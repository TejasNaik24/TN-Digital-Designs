import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The recurring section marker: a short accent rule followed by a mono
 * uppercase label. It's the site's structural signature — used to open every
 * section, and nowhere else.
 */
export function MonoLabel({
  children,
  className,
  rule = true,
}: {
  children: ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-ink-3', className)}>
      {rule && (
        <span
          aria-hidden="true"
          className="h-px w-8 bg-[linear-gradient(to_right,transparent,var(--color-azure))]"
        />
      )}
      {/* Larger than the base mono-label size used for chips and form labels
          — this is the section eyebrow, it needs to read at a glance. */}
      <span className="mono-label text-[0.8125rem] tracking-[0.14em]">{children}</span>
    </span>
  );
}
