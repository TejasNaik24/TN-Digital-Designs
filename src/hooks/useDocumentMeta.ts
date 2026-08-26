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
 * Note this runs client-side, so it updates the tab and anything that executes
 * JS. Crawlers that read only the initial HTML still see the index.html
 * defaults — fine for this site, but worth knowing before relying on it for
 * per-route social previews.
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

export function useDocumentMeta({ title, description, url }: Meta): void {
  useEffect(() => {
    // Capture what was there so leaving a route restores the site defaults
    // rather than leaking the last project's title onto the homepage.
    const previousTitle = document.title;
    const previousDescription =
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') ?? '';

    document.title = title;
    setMetaName('description', description);
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);

    if (url) {
      setMetaProperty('og:url', url);
      let canonical = document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
      );
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }

    return () => {
      document.title = previousTitle;
      if (previousDescription) setMetaName('description', previousDescription);
    };
  }, [title, description, url]);
}
