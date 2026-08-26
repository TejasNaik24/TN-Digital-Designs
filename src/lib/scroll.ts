import { animate } from 'motion/react';

/**
 * Anchor navigation.
 *
 * Three approaches, in order, and why each got replaced:
 *
 *  1. Lenis. It owns the scroll position, so a programmatic jump had to fight
 *     its rAF loop and whatever trailing wheel/trackpad momentum was still
 *     queued.
 *  2. Native `Element.scrollIntoView({ behavior: 'smooth' })`. Compositor-driven
 *     and cheap on the main thread — but Safari's built-in easing for smooth
 *     scroll has a much heavier "ease-in" ramp than Chrome's. It spends its
 *     first ~100-200ms barely moving before becoming visible, which reads as
 *     "click, pause, then it scrolls" even though nothing is actually blocked.
 *     Browsers don't expose that curve to tune it.
 *  3. A hand-rolled Motion `animate()` loop, tried once before this and pulled
 *     for being janky *during* the scroll in Safari. That jank is gone now:
 *     it was caused by `mix-blend-mode` and an animated gradient *position* in
 *     `AmbientBackground` (see that file and `usePointerGlow`), both removed.
 *     The cost was those specific paint sources needing to repaint on every
 *     scroll frame, not the act of driving scroll from JS.
 *
 * So: back to a custom animation, on top of the now-cheap background. An
 * expo-out curve is front-loaded — real, visible motion from the very first
 * frame, no ease-in ramp to read as a delay — and we control it exactly the
 * same way in every engine, rather than trusting each browser's own curve.
 */

/** Matches the site's one easing curve (see `lib/motion.ts`) without importing
 *  a component-layer module into this low-level utility. */
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

type Controls = { stop: () => void };

let active: Controls | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Any real scroll input cancels the animation — a programmatic scroll must
 *  never feel like it's holding the page hostage. */
const INTERRUPTS = ['wheel', 'touchstart'] as const;

function detach(): void {
  for (const type of INTERRUPTS) window.removeEventListener(type, cancel);
}

function cancel(): void {
  active?.stop();
  active = null;
  detach();
}

function attach(): void {
  for (const type of INTERRUPTS) {
    window.addEventListener(type, cancel, { passive: true, once: true });
  }
}

function scrollToY(to: number): void {
  cancel();

  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const target = Math.min(Math.max(to, 0), maxScroll);
  const from = window.scrollY;
  const distance = Math.abs(target - from);

  if (distance < 4) return;

  if (prefersReducedMotion()) {
    window.scrollTo(0, target);
    return;
  }

  // Long jumps take a little longer, but the curve is capped so crossing the
  // whole page never feels like waiting.
  const duration = Math.min(0.7, 0.28 + distance / 9500);

  active = animate(from, target, {
    duration,
    ease: EASE_EXPO,
    onUpdate: (value) => window.scrollTo(0, value),
    onComplete: () => {
      active = null;
      detach();
    },
  });

  attach();
}

function scrollToTarget(target: HTMLElement | null): void {
  if (!target) return;
  // Read `scroll-margin-top` (Section's `scroll-mt-24`) rather than
  // duplicating that offset as a second hardcoded constant here — one source
  // of truth for what clears the sticky header.
  const scrollMarginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  scrollToY(target.getBoundingClientRect().top + window.scrollY - scrollMarginTop);
}

export function scrollToId(id: string): void {
  scrollToTarget(document.getElementById(id));
}

export function scrollToTop(): void {
  scrollToY(0);
}

/* ── Instant landings, for route changes ──────────────────────────────────
 *
 * Route changes own the scroll position absolutely, and they must never
 * animate. Two reasons, both load-bearing:
 *
 * 1. An in-flight tween keeps writing `window.scrollTo(0, value)` from its
 *    `onUpdate` every frame — including after a route change. Jumping without
 *    cancelling first just gets undone on the tween's next frame, so every
 *    jump below goes through `cancel()`.
 *
 * 2. Animating a long cross-route jump breaks `useRevealOnce`. A tween moves
 *    the viewport faster than any human scroll, so a section can go from fully
 *    below to fully above between two frames: intersection ratio reads 0 both
 *    times, no threshold is crossed, no callback is delivered, and the
 *    `top < 0` rescue never gets a chance to fire. Those sections stay at
 *    opacity 0 forever. Landing instantly sidesteps it, because the position
 *    is established before any observer exists.
 *
 * These deliberately do NOT reuse `scrollToY`: it bails under 4px and clamps
 * against `scrollHeight`, which during a route transition is still the *old*
 * page's height. The browser clamps `window.scrollTo` itself, against the real
 * live document.
 */

export function jumpToY(to: number): void {
  cancel();
  window.scrollTo(0, Math.max(0, to));
}

export function jumpToTop(): void {
  jumpToY(0);
}

export function jumpToId(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  const scrollMarginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  jumpToY(target.getBoundingClientRect().top + window.scrollY - scrollMarginTop);
}
