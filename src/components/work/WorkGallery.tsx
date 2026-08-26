import { Reveal } from '@/components/ui/Reveal';
import { LinkButton } from '@/components/ui/Button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects } from '@/data/projects';
import { cn } from '@/lib/cn';
import { useAnchorNavigate } from '@/lib/navigation';
import { useSpotlight } from '@/hooks/useSpotlight';

/**
 * The hand-off from "here is what I can build" to "let's build yours".
 *
 * This used to be one more card inside the project grid, where it read as a
 * fourth project rather than an invitation. Full width, its own light, and the
 * site's real CTA button — this is the point in the page where a founder has
 * just finished being convinced, so it needs to be the obvious next step.
 */
function OpenSlotBand() {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const { hrefFor, onClickFor } = useAnchorNavigate();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={cn(
        'surface-card relative overflow-hidden rounded-panel',
        'border border-dashed border-[rgb(150_178_255/0.2)] bg-[linear-gradient(180deg,rgb(20_28_48/0.6),rgb(11_16_28/0.4))]',
        'px-7 py-10 sm:px-10 sm:py-12',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(80% 130% at 50% 0%, rgb(77 141 255 / 0.13), transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
        <div>
          <span className="mono-label text-ink-3">Open slot</span>
          <h3 className="mt-5 text-title font-medium tracking-[-0.025em] text-ink">
            Your company could be next.
          </h3>
          <p className="mt-3.5 max-w-lg text-[0.9375rem] leading-relaxed text-ink-2">
            Have an idea, an outdated site, or a product that deserves a better
            digital experience? Let’s build it.
          </p>
        </div>

        <LinkButton
          href={hrefFor('contact')}
          variant="glow"
          size="lg"
          arrow="right"
          className="shrink-0 max-sm:w-full"
          onClick={onClickFor('contact')}
        >
          Start a project
        </LinkButton>
      </div>
    </div>
  );
}

/**
 * The gallery itself — shared by the homepage Work section and the standalone
 * /work route, so the two can never drift apart.
 *
 * Editorial hierarchy rather than a uniform grid: the strongest project spans
 * both columns and gets a side-by-side treatment, the rest sit beneath it.
 */
export function WorkGallery({ showCta = true }: { showCta?: boolean }) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.slug}
            className={cn(project.featured && 'lg:col-span-2')}
          >
            <Reveal className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          </div>
        ))}
      </div>

      {showCta && (
        <Reveal>
          <div className="mt-4">
            <OpenSlotBand />
          </div>
        </Reveal>
      )}
    </>
  );
}
