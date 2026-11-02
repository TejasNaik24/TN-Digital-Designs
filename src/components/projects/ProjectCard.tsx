import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { ProjectVisual } from './ProjectVisual';
import { ConceptBadge } from './ConceptBadge';
import type { Project } from '@/data/projects';
import { useSpotlight } from '@/hooks/useSpotlight';

export function ProjectCard({
  project,
  headingLevel = 'h3',
}: {
  project: Project;
  /** h3 under the homepage's Work <h2>; h2 on /work, where the page title is the <h1>. */
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      style={{ '--glow': project.accent } as React.CSSProperties}
      className={cn(
        'surface-card card-surface group relative flex h-full flex-col overflow-hidden rounded-panel',
        'transition-[transform,border-color] duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:-translate-y-1 hover:border-hairline-strong',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-azure has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-canvas',
        // Featured card runs side by side — full width at 16:10 would be a
        // 700px-tall wall of preview.
        project.featured && 'lg:flex-row lg:items-stretch',
      )}
    >
      {/* Preview */}
      <div
        className={cn(
          'relative z-10 overflow-hidden border-b border-hairline',
          project.featured && 'lg:w-[58%] lg:shrink-0 lg:border-b-0 lg:border-r',
        )}
      >
        <div className="aspect-[16/10] overflow-hidden">
          <div className="size-full transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]">
            <ProjectVisual kind={project.slug} />
          </div>
        </div>
      </div>

      {/* Meta */}
      <div
        className={cn(
          'relative z-10 flex flex-1 flex-col p-6 sm:p-7',
          project.featured && 'lg:justify-center lg:p-9',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="mono-label text-ink-3">{project.category}</span>
          <ConceptBadge type={project.type} />
        </div>

        <Heading className="mt-5 text-[1.375rem] font-medium tracking-[-0.025em] text-ink">
          {/* A real link, not a button with an onClick: this gives the card an
              href, so it supports cmd-click, middle-click and copy-link like
              any other link on the web. `after:absolute after:inset-0` keeps
              the entire card as the hit target. */}
          <Link
            to={`/work/${project.slug}`}
            aria-label={`${project.title} — open the live concept site`}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </Heading>

        <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-ink-2">
          {project.shortDescription}
        </p>
        <p className="mt-3 max-w-lg text-[0.875rem] leading-relaxed text-ink-3">
          <span className="text-ink-2">Try it:</span> {project.tryIt}
        </p>

        <div className="mt-6 flex items-end justify-between gap-6 border-t border-hairline pt-5">
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((item) => (
              <li
                key={item}
                className="rounded-full border border-hairline-soft bg-elevated/70 px-2.5 py-1 font-mono text-[0.6875rem] text-ink-3"
              >
                {item}
              </li>
            ))}
          </ul>

          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-hairline text-ink-3 transition-[transform,color,border-color] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-hairline-strong group-hover:text-ink"
          >
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </article>
  );
}
