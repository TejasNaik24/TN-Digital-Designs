import { useId, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { scrollToId } from '@/lib/scroll';
import type { Brand } from './brands';

/**
 * Building blocks shared by the three demo sites.
 *
 * Every demo sets its palette as `--d-*` custom properties on its root (see
 * `brandVars`), and these components read only those — so a form field is
 * written once and still looks native to a trattoria, a dentist and a gym.
 */

export function brandVars(brand: Brand, body = brand.font): CSSProperties {
  const c = brand.colors;
  return {
    '--d-ground': c.ground,
    '--d-surface': c.surface,
    '--d-ink': c.ink,
    '--d-muted': c.muted,
    '--d-accent': c.accent,
    '--d-on-accent': c.onAccent,
    '--d-line': c.line,
    // The ring must be visible on this brand's ground; ink always is.
    '--focus-ring': c.ink,
    fontFamily: body,
    background: c.ground,
    color: c.ink,
  } as CSSProperties;
}

/** In-page link that animates to a section but keeps a real, copyable href. */
export function anchor(id: string) {
  return {
    href: `#${id}`,
    onClick: (event: React.MouseEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      scrollToId(id);
    },
  };
}

/**
 * Every demo form ends here. It must say plainly that nothing was sent — a
 * visitor who fills in a booking form and gets a bare "Booked!" would think
 * they had a real appointment.
 */
export function ConceptConfirmation({
  title,
  children,
  onReset,
  resetLabel,
  className,
}: {
  title: string;
  children: ReactNode;
  onReset: () => void;
  resetLabel: string;
  className?: string;
}) {
  return (
    <div role="status" className={cn('flex flex-col items-start gap-4', className)}>
      <p className="text-2xl font-semibold leading-tight">{title}</p>
      <div className="leading-relaxed text-[var(--d-muted)]">{children}</div>
      <p className="rounded-lg border border-dashed border-[var(--d-line)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--d-muted)]">
        This is a concept site, so nothing was actually sent or booked.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="min-h-11 font-semibold underline underline-offset-4"
      >
        {resetLabel}
      </button>
    </div>
  );
}

const control =
  'w-full min-h-12 rounded-[var(--d-radius,0.75rem)] border bg-[var(--d-field,#fff)] px-3.5 text-base text-[var(--d-ink)] placeholder:text-[var(--d-muted)] placeholder:opacity-80 focus-visible:outline-offset-1';

export function DemoField({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: {
    id: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
    className: string;
  }) => ReactNode;
}) {
  const id = useId();
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        className: cn(control, error ? 'border-[#b42318]' : 'border-[var(--d-line)]'),
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-[var(--d-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Pragmatic email shape check, mirroring the studio's own contact form. */
export const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/** The next `count` calendar days starting tomorrow, for date pickers. */
export function upcomingDays(count: number, skip: (day: Date) => boolean = () => false) {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    if (!skip(cursor)) days.push(new Date(cursor));
  }
  return days;
}

export const dayLabel = (day: Date) =>
  day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
