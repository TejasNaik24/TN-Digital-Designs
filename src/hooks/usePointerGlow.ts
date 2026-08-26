import { useEffect, type RefObject } from 'react';

/**
 * Moves a glow element to trail the cursor.
 *
 * This used to write a CSS custom property (`--mx`/`--my`) on the root
 * element every frame, feeding a `radial-gradient(at var(--mx) var(--my))` on
 * a full-viewport fixed layer. That's expensive in a way `transform` isn't:
 * animating a gradient's *center* forces the browser to repaint those pixels
 * every frame — it can't be composited the way a transform can — and it's
 * particularly costly in Safari, which repaints large gradient areas far less
 * efficiently than Chrome. The symptom was exactly "the mouse itself feels
 * laggy" — it fires on every hover, everywhere on the page, continuously.
 *
 * Fix: the glow is a fixed-size element with a *static* gradient, and this
 * hook only ever touches its `transform`. Moving a layer via transform is
 * compositor-only — no repaint, no layout, cheap in every engine.
 *
 * The loop only runs while the cursor is actually travelling (it exits as
 * soon as it catches up) and stops entirely when the tab is hidden.
 */
export function usePointerGlow(
  enabled: boolean,
  ref: RefObject<HTMLElement | null>,
  /** Lerp factor per frame. Higher tracks the cursor more tightly — used to
   *  give a small core glow a faster response than the wide halo behind it,
   *  which is what makes the pair read as depth rather than one flat blob. */
  ease = 0.075,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.3;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let running = false;

    const write = () => {
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate3d(-50%, -50%, 0)`;
    };

    const tick = () => {
      const dx = targetX - x;
      const dy = targetY - y;
      x += dx * ease;
      y += dy * ease;
      write();

      // Arrived: park the loop instead of burning frames on sub-pixel drift.
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      start();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        running = false;
      }
    };

    write();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [enabled, ref, ease]);
}
