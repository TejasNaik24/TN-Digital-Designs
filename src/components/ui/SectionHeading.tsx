import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { MonoLabel } from './MonoLabel';
import { Reveal } from './Reveal';

/**
 * Consistent opening for every section: mono marker, display title, optional
 * lede, optional trailing action. Keeping this in one place is what stops the
 * page drifting into six slightly different heading treatments.
 */
export function SectionHeading({
  id,
  label,
  title,
  lede,
  action,
  align = 'left',
  className,
}: {
  id?: string;
  label: string;
  title: ReactNode;
  lede?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered
          ? 'items-center text-center'
          : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <Reveal className={cn('max-w-2xl', centered && 'flex flex-col items-center')}>
        <MonoLabel>{label}</MonoLabel>
        <h2
          id={id}
          className="mt-6 text-title font-medium text-ink sm:text-display"
        >
          {title}
        </h2>
        {lede && (
          // max-w-xl, not the parent's max-w-2xl: the heading wants a wide
          // measure for its display type, the lede wants ~65 characters for
          // comfortable reading. They shouldn't share one width.
          <p
            className={cn(
              'mt-6 max-w-xl text-lede text-ink-2',
              centered && 'mx-auto',
            )}
          >
            {lede}
          </p>
        )}
      </Reveal>

      {action && (
        <Reveal delay={0.08} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
