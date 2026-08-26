import { useState } from 'react';
import { Section, Shell } from '@/components/layout/Section';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CaseStudyModal } from '@/components/projects/CaseStudyModal';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects, type Project } from '@/data/projects';
import { cn } from '@/lib/cn';
import { scrollToId } from '@/lib/scroll';
import { useSpotlight } from '@/hooks/useSpotlight';

/**
 * The hand-off from "here is what I can build" to "let's build yours".
 *
 * This used to be one more card inside the project grid, where it read as a
 * fifth project rather than as an invitation. Full width, its own light, and
 * the site's real CTA button — this is the point in the page where a founder
 * has just finished being convinced, so it needs to be the obvious next step,
 * not a tile they scan past.
 */
function OpenSlotBand() {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

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
            I take on a small number of projects at a time so each one gets
            proper attention. Tell me what you’re building.
          </p>
        </div>

        <LinkButton
          href="#contact"
          variant="glow"
          size="lg"
          arrow="right"
          className="shrink-0 max-sm:w-full"
          onClick={(event) => {
            event.preventDefault();
            scrollToId('contact');
          }}
        >
          Start a project
        </LinkButton>
      </div>
    </div>
  );
}

export function Work() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <Section id="work" labelledBy="work-heading" space="loose" ambient>
      <Shell>
        <SectionHeading
          id="work-heading"
          label="Selected work"
          title="Built to show what’s possible."
          lede="Self-directed concept builds, each one exploring how a different kind of business should feel online. Every project here is labelled as a concept — none of them are client work."
        />

        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className={cn(project.wide && 'lg:col-span-2')}>
              <Reveal className="h-full">
                <ProjectCard project={project} onOpen={setActive} />
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal>
          <div className="mt-4">
            <OpenSlotBand />
          </div>
        </Reveal>
      </Shell>

      <CaseStudyModal project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
