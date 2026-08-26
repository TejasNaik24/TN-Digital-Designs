import { useEffect, useRef } from 'react';
import { useHasFinePointer } from '@/hooks/useMediaQuery';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/**
 * A slow drift of particles that wakes up around the cursor.
 *
 * Everything is drawn into ONE canvas — a single compositor layer with no
 * blend modes, no filters, and no CSS gradients being repainted. That matters
 * here specifically: this file's whole job is "something is always moving in
 * the background", which is exactly the kind of thing that made this site slow
 * in Safari before (see AmbientBackground and CLAUDE.md). Canvas sidesteps all
 * of it — the cost is a handful of arcs and lines per frame, and it is the
 * same cost in every engine.
 *
 * Away from the pointer the field is nearly subliminal: faint, cool-toned
 * dots. Within CURSOR_RADIUS they brighten, swell, and start drawing links to
 * each other, so the "constellation" only ever exists where you're looking.
 * That keeps it from reading as a 2014 particles.js wallpaper.
 */

/** One particle per ~22k px². Capped, so a 4K display doesn't get a swarm. */
const DENSITY = 1 / 22000;
const MAX_PARTICLES = 88;

/** Two particles link only if both are inside the cursor's halo. */
const LINK_DIST = 128;
const CURSOR_RADIUS = 190;

/** Dots are soft; rendering them at full retina density buys nothing. */
const MAX_DPR = 1.5;

/** Cool tints only — the palette's azure/violet/aqua, kept desaturated so the
 *  field never competes with the accent gradient on real UI. */
const TINTS: ReadonlyArray<readonly [number, number, number]> = [
  [130, 175, 255],
  [150, 130, 250],
  [110, 205, 230],
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tint: readonly [number, number, number];
  /** Resting opacity, before any cursor boost. */
  base: number;
};

export function ConstellationField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionSafe();
  const finePointer = useHasFinePointer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;

    // Rendered cursor position trails the real one, so the halo eases into
    // place instead of snapping. Starts off-screen: nothing is lit until the
    // pointer actually arrives.
    let cursorX = -9999;
    let cursorY = -9999;
    let targetX = -9999;
    let targetY = -9999;
    let pointerSeen = false;

    const seed = () => {
      const count = Math.min(
        MAX_PARTICLES,
        Math.round(width * height * DENSITY),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        // ~4–10px per second. Present, but never something you'd call motion.
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 0.7 + Math.random() * 1,
        tint: TINTS[Math.floor(Math.random() * TINTS.length)] ?? TINTS[0]!,
        base: 0.16 + Math.random() * 0.24,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Only seed once. Re-seeding on resize would reshuffle the whole field
      // every time a mobile URL bar collapses; the wrap logic redistributes
      // particles into new bounds on its own.
      if (particles.length === 0) seed();
    };

    const render = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      if (animate) {
        cursorX += (targetX - cursorX) * 0.12;
        cursorY += (targetY - cursorY) * 0.12;
      }

      const lit = pointerSeen && finePointer;
      const count = particles.length;

      if (animate) {
        for (let i = 0; i < count; i += 1) {
          const p = particles[i];
          if (!p) continue;
          p.x += p.vx;
          p.y += p.vy;
          // Wrap with a margin so nothing pops in at the edge.
          if (p.x < -24) p.x = width + 24;
          else if (p.x > width + 24) p.x = -24;
          if (p.y < -24) p.y = height + 24;
          else if (p.y > height + 24) p.y = -24;
        }
      }

      // ── Links. Skipped entirely when the pointer hasn't been seen, which is
      //    also what keeps the touch/reduced-motion render cheap.
      if (lit) {
        ctx.lineWidth = 1;
        for (let i = 0; i < count; i += 1) {
          const a = particles[i];
          if (!a) continue;
          const adx = a.x - cursorX;
          const ady = a.y - cursorY;
          const aDist = Math.sqrt(adx * adx + ady * ady);
          if (aDist > CURSOR_RADIUS) continue;
          const aBoost = 1 - aDist / CURSOR_RADIUS;

          for (let j = i + 1; j < count; j += 1) {
            const b = particles[j];
            if (!b) continue;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const sq = dx * dx + dy * dy;
            if (sq > LINK_DIST * LINK_DIST) continue;

            const bdx = b.x - cursorX;
            const bdy = b.y - cursorY;
            const bDist = Math.sqrt(bdx * bdx + bdy * bdy);
            if (bDist > CURSOR_RADIUS) continue;

            const alpha =
              (1 - Math.sqrt(sq) / LINK_DIST) *
              Math.min(aBoost, 1 - bDist / CURSOR_RADIUS) *
              0.5;
            if (alpha < 0.02) continue;

            ctx.strokeStyle = `rgba(125, 168, 255, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // ── Dots
      for (let i = 0; i < count; i += 1) {
        const p = particles[i];
        if (!p) continue;
        let alpha = p.base;
        let radius = p.r;

        if (lit) {
          const dx = p.x - cursorX;
          const dy = p.y - cursorY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS) {
            const boost = 1 - dist / CURSOR_RADIUS;
            alpha = Math.min(1, p.base + boost * 0.72);
            radius = p.r * (1 + boost * 0.85);
          }
        }

        const [r, g, b] = p.tint;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      render(true);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || document.hidden) return;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerSeen) {
        // First sighting: drop the halo straight onto the cursor rather than
        // flying it in from the corner.
        cursorX = event.clientX;
        cursorY = event.clientY;
        pointerSeen = true;
      }
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resize();
        if (reduced) render(false);
      });
    };

    resize();
    // Paint once up front, before any rAF. The loop below won't start while
    // the tab is hidden (correctly — it shouldn't burn frames nobody sees),
    // and without this the field would be blank for the first frame after the
    // tab is brought forward.
    render(false);

    if (reduced) {
      // Motion off: one static frame. The field still reads as designed
      // texture, it just doesn't drift or follow anything.
      render(false);
      window.addEventListener('resize', onResize);
      return () => {
        cancelAnimationFrame(resizeFrame);
        window.removeEventListener('resize', onResize);
      };
    }

    if (finePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    start();

    return () => {
      stop();
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, [reduced, finePointer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
