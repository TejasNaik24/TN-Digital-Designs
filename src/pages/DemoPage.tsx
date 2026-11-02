import { lazy, Suspense, useLayoutEffect } from 'react';
// Each demo's typeface. Here, not only in ProjectVisual: that lives in the
// lazy studio chunk, so a visitor landing straight on a demo would never load
// these @font-face rules. The font files themselves only download when used.
import '@/styles/demo-fonts.css';
import { useParams } from 'react-router-dom';
import { ConceptBanner } from '@/components/demo/ConceptBanner';
import { StudioNotFound } from '@/pages/lazyStudio';
import { brands, type DemoSlug } from '@/demos/brands';
import { getProject } from '@/data/projects';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { site } from '@/data/site';

/**
 * One chunk per demo. A visitor to the studio homepage never downloads three
 * other businesses' websites, and a visitor to one demo never downloads the
 * other two.
 */
const sites: Record<DemoSlug, React.LazyExoticComponent<() => React.JSX.Element>> = {
  restaurant: lazy(() => import('@/demos/restaurant/Site')),
  clinic: lazy(() => import('@/demos/clinic/Site')),
  gym: lazy(() => import('@/demos/gym/Site')),
};

/**
 * Repaint the document itself in the demo's colours while it's mounted.
 *
 * `index.html` paints <html> the studio's near-black before React mounts (to
 * avoid a white flash on the studio). Left alone, a light demo would show that
 * black on overscroll and behind the iOS toolbar, and the browser chrome would
 * stay dark via theme-color.
 */
function useDocumentTheme(ground: string) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const themeMeta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previous = {
      background: html.style.backgroundColor,
      scheme: html.style.colorScheme,
      theme: themeMeta?.content,
    };
    html.style.backgroundColor = ground;
    html.style.colorScheme = 'light';
    if (themeMeta) themeMeta.content = ground;

    return () => {
      html.style.backgroundColor = previous.background;
      html.style.colorScheme = previous.scheme;
      if (themeMeta && previous.theme) themeMeta.content = previous.theme;
    };
  }, [ground]);
}

function Demo({ slug }: { slug: DemoSlug }) {
  const brand = brands[slug];
  const project = getProject(slug);
  const Site = sites[slug];

  useDocumentTheme(brand.colors.ground);
  useDocumentMeta({
    title: project?.meta.title ?? brand.name,
    description: project?.meta.description ?? brand.tagline,
    url: `${site.url}/work/${slug}`,
  });

  return (
    <div style={{ background: brand.colors.ground, color: brand.colors.ink }} className="min-h-dvh">
      <ConceptBanner business={brand.name} />
      {/* Same id + tabIndex as the studio <main>, so route focus and the skip
          link work identically on demo routes. */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Suspense fallback={<div className="min-h-dvh" />}>
          <Site />
        </Suspense>
      </main>
    </div>
  );
}

export function DemoPage() {
  const { slug } = useParams();
  if (!slug || !(slug in sites)) {
    // Lazy, so the studio's code stays out of every demo visitor's download.
    return (
      <Suspense fallback={null}>
        <StudioNotFound />
      </Suspense>
    );
  }
  return <Demo slug={slug as DemoSlug} />;
}
