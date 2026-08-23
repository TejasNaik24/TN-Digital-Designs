import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Every section shares one scroll offset, so anchor jumps always clear the
 * sticky header by the same amount.
 *
 * `tone` and `space` exist because a page where every section is transparent
 * over one flat canvas, at identical padding, reads as an endless void — there
 * are no landmarks for the eye across eight thousand pixels of scroll.
 */

/**
 * `raised` is a barely-there lift, not a panel. The gradient fades to nothing
 * at both edges so there is never a visible seam between sections — you should
 * register it as rhythm without being able to point at where it starts.
 */
const tones = {
  base: '',
  raised:
    'before:pointer-events-none before:absolute before:inset-0 before:-z-10 ' +
    'before:bg-[linear-gradient(180deg,transparent,rgb(11_16_30/0.65)_14%,rgb(11_16_30/0.65)_86%,transparent)] ' +
    "before:content-['']",
} as const;

/** Spacing carries hierarchy too: headline sections breathe, support sections
 *  sit tighter. */
const spacing = {
  regular: 'py-20 sm:py-28 lg:py-32',
  loose: 'py-24 sm:py-32 lg:py-40',
  tight: 'py-16 sm:py-20 lg:py-24',
} as const;

export function Section({
  id,
  children,
  className,
  labelledBy,
  tone = 'base',
  space = 'regular',
}: {
  id: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  tone?: keyof typeof tones;
  space?: keyof typeof spacing;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn('relative', spacing[space], tones[tone], className)}
    >
      {tone === 'raised' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(150_178_255/0.14),transparent)]"
        />
      )}
      {/* The anchor target sits here, after the section's own top padding,
          not on the section itself — anchoring on the outer padded box made
          a nav click scroll to the top of that padding, leaving a wall of
          empty space above the heading before any content appeared. */}
      <div id={id} className="scroll-mt-24">
        {children}
      </div>
    </section>
  );
}

export function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('shell', className)}>{children}</div>;
}
