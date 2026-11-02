import { defineConfig, loadEnv, type Plugin, type Rollup } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { IncomingMessage } from 'node:http';
import { allPages, homeMeta, type PageMeta } from './src/data/pageMeta.ts';

/** Used when VITE_SITE_URL is unset. Change it in one place: the env var. */
const DEFAULT_SITE_URL = 'https://tn-digital-designs.vercel.app';

/**
 * Serves `api/*.ts` under `npm run dev`, so the clinic assistant works locally
 * without the Vercel CLI. In production Vercel runs those same files as
 * Functions; this plugin is dev-only (`apply: 'serve'`) and never ships.
 *
 * Each file exports Web-standard handlers (`export async function POST(request)`),
 * so this just converts Node's request to a `Request` and back.
 */
function apiDevServer(): Plugin {
  const readBody = (req: IncomingMessage) =>
    new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/api\/([\w-]+)(?:\?.*)?$/);
        const file = match && fileURLToPath(new URL(`./api/${match[1]}.ts`, import.meta.url));
        if (!match || !file || !existsSync(file)) return next();

        try {
          const mod = (await server.ssrLoadModule(file)) as Record<string, unknown>;
          const handler = mod[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            return res.end('Method not allowed');
          }
          // Uint8Array, not Buffer: Buffer isn't a BodyInit in the DOM typings.
          const body =
            req.method === 'GET' || req.method === 'HEAD' ? undefined : new Uint8Array(await readBody(req));
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value);
          }
          headers.set('x-forwarded-for', req.socket.remoteAddress ?? 'local');
          const response = (await handler(
            new Request(`http://localhost${req.url}`, { method: req.method, headers, body }),
          )) as Response;

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          server.ssrFixStacktrace(error as Error);
          next(error);
        }
      });
    },
  };
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Every absolute URL on the site comes from one value, `siteUrl`.
 *
 * - Fills the %SITE_URL% / %PAGE_*% tokens in index.html (dev and build).
 * - At build, writes `dist/<route>/index.html` for each page in
 *   src/data/pageMeta.ts with that page's title, description and canonical
 *   already in the HTML. Link previewers don't run JS; without this every
 *   shared /work/clinic link would preview as the homepage.
 * - Writes robots.txt and sitemap.xml from the same route list, so they can't
 *   go stale when a demo is added or renamed.
 * - Preloads each route's lazy chunks from its HTML. The studio and each demo
 *   are split out of the entry bundle (see src/pages/StudioSite.tsx); without
 *   these hints the browser would only discover them after the entry ran.
 */

/** The lazy chunk that renders each route — what its HTML should preload. */
const routeModule = (path: string) =>
  path.startsWith('/work/') ? `src/demos/${path.slice('/work/'.length)}/Site.tsx` : 'src/pages/StudioSite.tsx';

function seo(siteUrl: string): Plugin {
  let template = '';
  let outDir = 'dist';
  let isBuild = false;
  let bundle: Rollup.OutputBundle | undefined;

  /** <link> tags for a route's chunk and everything it statically imports,
   *  minus what the entry already loads. CSS too, or the chunk's styles
   *  (the demo fonts) would arrive after first paint. */
  const preloadTags = (path: string): string => {
    if (!bundle) return '';
    const chunks = Object.values(bundle).filter((item): item is Rollup.OutputChunk => item.type === 'chunk');
    const entry = chunks.find((chunk) => chunk.isEntry);
    const target = chunks.find((chunk) => chunk.facadeModuleId?.endsWith(routeModule(path)));
    if (!entry || !target) return '';

    const alreadyLoaded = new Set([entry.fileName, ...entry.imports]);
    const scripts = new Set<string>();
    const styles = new Set<string>();
    const visit = (fileName: string) => {
      const chunk = bundle?.[fileName];
      if (!chunk || chunk.type !== 'chunk' || scripts.has(fileName) || alreadyLoaded.has(fileName)) return;
      scripts.add(fileName);
      chunk.viteMetadata?.importedCss.forEach((css) => styles.add(css));
      chunk.imports.forEach(visit);
    };
    visit(target.fileName);

    return [
      ...[...styles].map((file) => `<link rel="stylesheet" crossorigin href="/${file}">`),
      ...[...scripts].map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`),
    ].join('\n    ');
  };

  const render = (html: string, page: PageMeta) =>
    html
      .replace('</head>', `  ${preloadTags(page.path)}\n  </head>`)
      .replaceAll('%PAGE_TITLE%', escapeHtml(page.title))
      .replaceAll('%PAGE_DESCRIPTION%', escapeHtml(page.description))
      .replaceAll('%PAGE_URL%', `${siteUrl}${page.path === '/' ? '/' : page.path}`)
      .replaceAll('%SITE_URL%', siteUrl);

  return {
    name: 'seo',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
      isBuild = config.command === 'build';
    },
    transformIndexHtml: {
      // After Vite injects the hashed asset tags, so every route's copy
      // loads the same bundle.
      order: 'post',
      handler(html, ctx) {
        bundle = ctx.bundle;
        template = html;
        return render(html, homeMeta);
      },
    },
    // `vite preview` otherwise answers /work/clinic with the SPA fallback
    // (the homepage HTML). Mirror vercel.json's rewrites so a local preview
    // serves exactly what production does.
    configurePreviewServer(server) {
      const paths = new Set(allPages.map((page) => page.path).filter((path) => path !== '/'));
      server.middlewares.use((req, _res, next) => {
        const [path = '', query] = (req.url ?? '').split('?');
        const route = path.replace(/\/+$/, '');
        if (paths.has(route)) req.url = `${route}/index.html${query ? `?${query}` : ''}`;
        next();
      });
    },
    closeBundle() {
      // Build only. The dev server also calls closeBundle when it shuts down or
      // restarts, and its template holds dev-only script tags (/src/main.tsx),
      // which would overwrite dist with pages that can't load.
      if (!isBuild || !template) return;
      for (const page of allPages) {
        if (page.path === '/') continue; // index.html is already the homepage
        const file = join(outDir, page.path, 'index.html');
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, render(template, page));
      }

      writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

      const urls = allPages
        .map((page) => `  <url>\n    <loc>${siteUrl}${page.path === '/' ? '/' : page.path}</loc>\n  </url>`)
        .join('\n');
      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  // Server-only secrets (no VITE_ prefix) for the dev API: load them into
  // process.env where the handlers read them, exactly as Vercel provides them.
  // Never exposed to the browser — Vite only bundles VITE_-prefixed vars.
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['GEMINI_API_KEY', 'GEMINI_MODEL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }

  // No trailing slash, so `${siteUrl}/path` is always well-formed.
  const siteUrl = (env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, '');

  return {
    plugins: [react(), tailwindcss(), apiDevServer(), seo(siteUrl)],
    // The browser reads the same resolved value (with the default applied)
    // via import.meta.env.VITE_SITE_URL, so client and HTML can't disagree.
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2022',
      cssMinify: 'lightningcss',
    },
  };
});
