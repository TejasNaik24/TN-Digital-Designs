import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ProjectVisual } from './ProjectVisual';
import type { Project } from '@/data/projects';
import { useSpotlight } from '@/hooks/useSpotlight';

/** Concept work is labelled as concept work, everywhere, without exception. */
function KindChip({ kind }: { kind: Project['kind'] }) {
  return (
    <span
      className={cn(
        'mono-label rounded-full border px-2.5 py-1.5',
        kind === 'concept'
          ? 'border-hairline-strong bg-elevated/80 text-ink-3'
          : 'border-aqua/30 bg-aqua/10 text-aqua',
      )}
    >
      {kind === 'concept' ? 'Concept' : 'Client'}
    </span>
  );
}

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
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
        project.wide && 'lg:flex-row lg:items-stretch',
      )}
    >
      {/* Preview */}
      <div
        className={cn(
          'relative z-10 overflow-hidden border-b border-hairline',
          project.wide && 'lg:w-[58%] lg:shrink-0 lg:border-b-0 lg:border-r',
        )}
      >
        <div className="aspect-[16/10] overflow-hidden">
          <div className="size-full transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]">
            <ProjectVisual
              kind={project.visual}
              accent={project.accent}
              name={project.name}
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0',
            project.wide
              ? 'bg-[linear-gradient(to_top,rgb(4_6_12/0.55),transparent_45%)] lg:bg-[linear-gradient(to_right,transparent_60%,rgb(4_6_12/0.5))]'
              : 'bg-[linear-gradient(to_top,rgb(4_6_12/0.55),transparent_45%)]',
          )}
        />
      </div>

      {/* Meta */}
      <div
        className={cn(
          'relative z-10 flex flex-1 flex-col p-6 sm:p-7',
          project.wide && 'lg:justify-center lg:p-9',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="mono-label text-ink-3">{project.industry}</span>
          <KindChip kind={project.kind} />
        </div>

        <h3 className="mt-5 text-[1.375rem] font-medium tracking-[-0.025em] text-ink">
          <button
            type="button"
            onClick={() => onOpen(project)}
            aria-label={`${project.name} — open case study`}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.name}
          </button>
        </h3>

        <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-ink-2">
          {project.summary}
        </p>

        <div className="mt-6 flex items-end justify-between gap-6 border-t border-hairline pt-5">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
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
