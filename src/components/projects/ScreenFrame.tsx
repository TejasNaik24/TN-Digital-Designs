import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Chrome around a concept screen.
 *
 * Same idea as the hero's DeviceFrame — a browser window drawn rather than
 * photographed, so there is no screenshot to go stale and nothing to
 * re-export when a colour changes. Kept separate from DeviceFrame because that
 * one owns the hero's animated address-bar label and its cursor-tilt wrapper;
 * this one is static and takes an arbitrary aspect ratio.
 *
 * `bare` exists for screens that are already a self-contained composition and
 * would look boxed-in inside a second frame.
 */
export function ScreenFrame({
  variant = 'browser',
  label,
  children,
  className,
}: {
  variant?: 'browser' | 'phone' | 'bare';
  /** Shown in the address bar. Not a real URL — it's a caption. */
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  if (variant === 'bare') {
    return (
      <div
        className={cn(
          'overflow-hidden rounded-panel border border-hairline bg-[#050810]',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  if (variant === 'phone') {
    return (
      <div
        className={cn(
          'relative mx-auto w-full max-w-[19rem] overflow-hidden rounded-[2rem] border border-hairline-strong bg-elevated p-2',
          'shadow-[0_1px_0_0_rgb(180_205_255/0.14)_inset,0_40px_90px_-30px_rgb(0_0_0/0.9)]',
          className,
        )}
      >
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#050810]">
          {/* Status bar — sells it as a phone without drawing a notch. */}
          <div className="flex items-center justify-between px-5 py-2.5">
            <span className="font-mono text-[0.5625rem] text-ink-3">9:41</span>
            <div className="flex items-center gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-4/70" />
              <span className="h-1.5 w-3 rounded-[2px] bg-ink-4/70" />
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[0.95rem] border border-hairline-strong bg-elevated',
        'shadow-[0_1px_0_0_rgb(180_205_255/0.14)_inset,0_40px_90px_-30px_rgb(0_0_0/0.9)]',
        className,
      )}
    >
      <div className="flex h-9 items-center gap-3 border-b border-hairline px-4">
        <div className="flex gap-[0.3rem]" aria-hidden="true">
          <span className="size-[0.4rem] rounded-full bg-white/20" />
          <span className="size-[0.4rem] rounded-full bg-white/20" />
          <span className="size-[0.4rem] rounded-full bg-white/20" />
        </div>
        {label && (
          <div className="mx-auto flex h-5 min-w-0 max-w-[18rem] flex-1 items-center gap-2 rounded-full border border-hairline bg-canvas/60 px-3">
            <Lock aria-hidden="true" className="size-2.5 shrink-0 text-ink-4" />
            <span className="mono-label block truncate text-[0.5625rem] tracking-[0.1em] text-ink-3">
              {label}
            </span>
          </div>
        )}
        <div className="w-8" aria-hidden="true" />
      </div>

      <div className="relative bg-[#050810]">{children}</div>
    </div>
  );
}
