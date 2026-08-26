import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import type { Project } from '@/data/projects';

/**
 * Previous / next, at the foot of a case study.
 *
 * Wraps at both ends (see `getAdjacent`), so this never dead-ends on a
 * disabled-looking control — with three projects, "previous" from the first
 * simply means the last.
 */
function NavCard({
  project,
  direction,
}: {
  project: Project;
  direction: 'prev' | 'next';
}) {
  const isNext = direction === 'next';

  return (
    <Link
      to={`/work/${project.slug}`}
      className={cn(
        'card-surface group flex flex-col gap-2 rounded-panel p-6 sm:p-7',
        'transition-[transform,border-color] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:-translate-y-1 hover:border-hairline-strong',
        isNext && 'sm:items-end sm:text-right',
      )}
    >
      <span className="mono-label flex items-center gap-2 text-ink-3">
        {!isNext && (
          <ArrowLeft
            aria-hidden="true"
            className="size-3.5 transition-transform duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
            strokeWidth={2}
          />
        )}
        {isNext ? 'Next project' : 'Previous project'}
        {isNext && (
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            strokeWidth={2}
          />
        )}
      </span>

      <span className="text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
        {project.title}
      </span>
      <span className="text-[0.875rem] text-ink-2">{project.category}</span>
    </Link>
  );
}

export function ProjectNav({ prev, next }: { prev: Project; next: Project }) {
  return (
    <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
      <NavCard project={prev} direction="prev" />
      <NavCard project={next} direction="next" />
    </nav>
  );
}
