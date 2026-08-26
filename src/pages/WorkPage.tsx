import { Shell } from '@/components/layout/Section';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Reveal } from '@/components/ui/Reveal';
import { WorkGallery } from '@/components/work/WorkGallery';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/**
 * The standalone gallery at /work.
 *
 * Shares `WorkGallery` with the homepage section so the two can never drift.
 * The only difference is the framing: here it is the page, so it gets an <h1>
 * and a little more room to breathe.
 */
export function WorkPage() {
  useDocumentMeta({
    title: 'Work — Tejas Naik, Digital Studio',
    description:
      'Self-directed concept builds exploring how different kinds of businesses could feel online. Every project is labelled as a concept — none are client work.',
  });

  return (
    <Shell className="pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-40">
      <Reveal>
        <div className="max-w-2xl">
          <MonoLabel>Selected work</MonoLabel>
          <h1 className="mt-6 text-hero font-medium text-ink">
            Built to show what’s possible.
          </h1>
          <p className="mt-6 max-w-xl text-lede text-ink-2">
            Self-directed concept builds, each one exploring how a different
            kind of business could feel online. Every project here is labelled
            as a concept — none of them are client work.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 lg:mt-16">
        <WorkGallery />
      </div>
    </Shell>
  );
}
