import { useEffect } from 'react';

/**
 * Per-route document metadata.
 *
 * `index.html` carries one static title/description, which is correct for a
 * single-page site and wrong the moment real routes exist — every project page
 * would share the homepage's title in the tab, in bookmarks, and in any link
 * preview.
 *
 * Deliberately not `react-helmet`: this is ~40 lines against a dependency, and
 * the brief calls for keeping dependencies minimal.
 *
 * This keeps the tab and in-app navigation right. Crawlers and link previewers
 * that don't run JS get the same values from the per-route HTML the `seo()`
 * plugin writes at build time (see src/data/pageMeta.ts).
 */

type Meta = {
  title: string;
  description: string;
  /** Absolute URL for canonical + og:url. */
  url?: string;
};

/** Set an attribute-selected tag's content, creating the tag if absent. */
function setTag(selector: string, create: () => HTMLElement, content: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaName(name: string, content: string) {
  setTag(`meta[name="${name}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('name', name);
    return el;
  }, content);
}

function setMetaProperty(property: string, content: string) {
  setTag(`meta[property="${property}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('property', property);
    return el;
  }, content);
}

/** Every tag this hook touches, so leaving a route can put each one back. */
const MANAGED = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:url"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
];

export function useDocumentMeta({ title, description, url }: Meta): void {
  useEffect(() => {
    // Capture what was there so leaving a route restores the site defaults
    // rather than leaking the last page's title, preview text or canonical
    // onto the homepage.
    const previousTitle = document.title;
    const previous = MANAGED.map(
      (selector) => [selector, document.head.querySelector(selector)?.getAttribute('content')] as const,
    );
    const canonicalTag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonicalTag?.getAttribute('href');

    document.title = title;
    setMetaName('description', description);
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);

    if (url) {
      setMetaProperty('og:url', url);
      let canonical = canonicalTag;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }

    return () => {
      document.title = previousTitle;
      for (const [selector, content] of previous) {
        if (content != null) document.head.querySelector(selector)?.setAttribute('content', content);
      }
      if (previousCanonical != null) {
        document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', previousCanonical);
      }
    };
  }, [title, description, url]);
}
