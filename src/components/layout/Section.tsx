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
 * Three tones, alternating down the page so the eye gets landmarks.
 *
 * `raised` is a barely-there lift, not a panel. `deep` is the opposite — it
 * sinks slightly below the canvas, which is what makes the section after it
 * feel like it rises. Both fade to nothing at their edges, so there is never
 * a visible seam: you should register the change as rhythm without being able
 * to point at where it starts.
 */
const tones = {
  base: '',
  raised:
    'before:pointer-events-none before:absolute before:inset-0 before:-z-10 ' +
    'before:bg-[linear-gradient(180deg,transparent,rgb(13_19_35/0.8)_14%,rgb(13_19_35/0.8)_86%,transparent)] ' +
    "before:content-['']",
  deep:
    'before:pointer-events-none before:absolute before:inset-0 before:-z-10 ' +
    'before:bg-[linear-gradient(180deg,transparent,rgb(2_3_8/0.75)_18%,rgb(2_3_8/0.75)_82%,transparent)] ' +
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
  ambient = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  tone?: keyof typeof tones;
  space?: keyof typeof spacing;
  /** A soft pool of light entering from the top of the section. For the long
   *  showcase sections that would otherwise be an unbroken field of black —
   *  atmosphere, not a visible blob. */
  ambient?: boolean;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn('relative', spacing[space], tones[tone], className)}
    >
      {ambient && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem]"
          style={{
            background:
              'radial-gradient(64% 100% at 50% 0%, rgb(77 141 255 / 0.09), rgb(139 92 246 / 0.045) 46%, transparent 72%)',
          }}
        />
      )}
      {(tone === 'raised' || ambient) && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(150_178_255/0.16),transparent)]"
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
