// Explicit .ts: vite.config.ts imports this file, and Vite's native config
// loader needs real extensions.
import { projects } from './projects.ts';

/**
 * Title and description for every route, in one place.
 *
 * Read twice: by `useDocumentMeta` in the browser, and by the `seo()` plugin in
 * vite.config.ts at build time, which writes a static HTML file per route with
 * these tags already in it. Link previewers (iMessage, Slack, LinkedIn) don't
 * run JavaScript, so without the build step every shared link would preview
 * as the homepage.
 *
 * Keep this file free of browser APIs and `import.meta.env` — Node loads it.
 */

export type PageMeta = { path: string; title: string; description: string };

export const homeMeta: PageMeta = {
  path: '/',
  title: 'Tejas Naik — Web Design & Development Studio',
  description:
    'I design and build fast, custom websites, web applications, and AI-powered features for companies that want to stand out. Independent studio — design and engineering in one place.',
};

export const workMeta: PageMeta = {
  path: '/work',
  title: 'Work — Tejas Naik, Digital Studio',
  description:
    'Working concept websites for a restaurant, a dental clinic and a gym — designed and built by Tejas Naik. Concepts, not client work.',
};

export const demoMeta: PageMeta[] = projects.map((project) => ({
  path: `/work/${project.slug}`,
  title: project.meta.title,
  description: project.meta.description,
}));

/** Every indexable route — the sitemap, and one generated HTML file each. */
export const allPages: PageMeta[] = [homeMeta, workMeta, ...demoMeta];
