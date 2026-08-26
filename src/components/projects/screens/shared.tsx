import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Shared plumbing for concept screens.
 *
 * Every screen is drawn in DOM/CSS — zero raster bytes, crisp at any density,
 * and editable rather than frozen in a PNG.
 *
 * The one rule that makes this work: **size everything in `cqw`**. Each screen
 * sits in a container-query context, so one component renders correctly as a
 * small split-column figure and as a full-bleed hero without a single
 * breakpoint. A fixed `px` value anywhere will break at one of those scales.
 */

export type ScreenProps = { accent: string };

/**
 * The paper a screen is printed on.
 *
 * `bg` is per-screen on purpose. Atelier Nord is a warm off-white editorial
 * site, Vela is near-black, Monument is warm dark — if these all inherited one
 * dark ground they would look like three pages of the same website, which is
 * the opposite of what the Work section needs to prove.
 */
export function ScreenSurface({
  bg,
  ratio = '16 / 10',
  children,
  className,
  style,
}: {
  bg: string;
  ratio?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative w-full overflow-hidden', className)}
      style={{
        containerType: 'inline-size',
        aspectRatio: ratio,
        background: bg,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A line of type. `size` is in cqw. */
export function T({
  size,
  children,
  className,
  style,
}: {
  size: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn('leading-[1.15]', className)}
      style={{ fontSize: `${size}cqw`, ...style }}
    >
      {children}
    </div>
  );
}

/** A pill button. */
export function Pill({
  children,
  bg,
  color,
  border,
  size = 1.5,
}: {
  children: ReactNode;
  bg?: string;
  color?: string;
  border?: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-[2.2cqw] py-[1.1cqw] font-medium leading-none"
      style={{
        fontSize: `${size}cqw`,
        background: bg,
        color,
        border: border ? `1px solid ${border}` : undefined,
      }}
    >
      {children}
    </span>
  );
}
