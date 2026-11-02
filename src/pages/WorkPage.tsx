import { Shell } from '@/components/layout/Section';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Reveal } from '@/components/ui/Reveal';
import { WorkGallery } from '@/components/work/WorkGallery';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { workMeta } from '@/data/pageMeta';
import { site } from '@/data/site';

/**
 * The standalone gallery at /work.
 *
 * Shares `WorkGallery` with the homepage section so the two can never drift.
 * The only difference is the framing: here it is the page, so it gets an <h1>
 * and a little more room to breathe.
 */
export function WorkPage() {
  useDocumentMeta({ ...workMeta, url: `${site.url}${workMeta.path}` });

  return (
    <Shell className="pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-40">
      <Reveal>
        <div className="max-w-2xl">
          <MonoLabel>Selected work</MonoLabel>
          <h1 className="mt-6 text-hero font-medium text-ink">
            Websites for the businesses on your street.
          </h1>
          <p className="mt-6 max-w-xl text-lede text-ink-2">
            Three fictional local businesses, each with a real, working website
            you can click through. They’re concepts, not clients — built to
            show what your business could have.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 lg:mt-16">
        <WorkGallery headingLevel="h2" />
      </div>
    </Shell>
  );
}
