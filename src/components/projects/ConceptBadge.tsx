import { cn } from '@/lib/cn';
import type { Project } from '@/data/projects';

/**
 * The honesty label.
 *
 * Every fictional project on this site has to say so, visibly — not in tiny
 * grey text at the bottom of a card. These are self-directed concepts, and
 * presenting them as anything else would be the one design decision that
 * actually damages the studio's credibility.
 *
 * `size="lg"` is for case-study heroes, where the badge sits beside a display
 * heading and has to hold its own.
 */
export function ConceptBadge({
  type,
  size = 'md',
  className,
}: {
  type: Project['type'];
  size?: 'md' | 'lg';
  className?: string;
}) {
  const isConcept = type === 'concept';

  return (
    <span
      className={cn(
        'mono-label inline-flex shrink-0 items-center rounded-full border',
        size === 'lg' ? 'px-3.5 py-2 text-[0.75rem]' : 'px-2.5 py-1.5',
        isConcept
          ? 'border-hairline-strong bg-elevated/80 text-ink-2'
          : 'border-aqua/30 bg-aqua/10 text-aqua',
        className,
      )}
    >
      {isConcept ? 'Concept' : 'Client'}
    </span>
  );
}
