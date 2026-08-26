import { useRef } from 'react';
import { ConstellationField } from './ConstellationField';
import { usePointerGlow } from '@/hooks/usePointerGlow';
import { useHasFinePointer } from '@/hooks/useMediaQuery';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/** Diameter of the glow element — 2x its gradient radius, so translating its
 *  center to the cursor via transform:translate(-50%,-50%) lines up exactly
 *  with the old 560px-radius gradient. */
const GLOW_SIZE = 1120;

/** The tighter inner glow that sits on top of it. Tracks faster (see the ease
 *  argument below), which is what sells the two layers as one light source
 *  with depth rather than a single flat wash. */
const CORE_SIZE = 380;

/**
 * The room the site sits in.
 *
 * Five stacked layers, all fixed, all `pointer-events: none`, none of them
 * animated with JavaScript except the cursor glow, which moves via transform:
 *
 *   1. static radial light fields    — the base depth
 *   2. two slow drifting blooms      — the "breathing"
 *   3. a hairline grid, masked        — structure, fading out at the edges
 *   4. the cursor glow                — the site noticing you
 *   5. grain                          — stops the gradients banding
 *
 * The goal is a dark physical space, not decoration. Every value here is low
 * enough that removing a layer should be noticeable but not obvious.
 */
export function AmbientBackground() {
  const finePointer = useHasFinePointer();
  const reduced = useReducedMotionSafe();
  const glowRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  // Touch devices get the ambient layers without the cursor tracking.
  usePointerGlow(finePointer && !reduced, glowRef);
  usePointerGlow(finePointer && !reduced, coreRef, 0.16);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — base light fields */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 78% 52% at 12% -8%, rgb(77 141 255 / 0.14), transparent 62%)',
            'radial-gradient(ellipse 62% 46% at 92% 4%, rgb(139 92 246 / 0.12), transparent 60%)',
            'radial-gradient(ellipse 90% 60% at 50% 108%, rgb(99 102 241 / 0.09), transparent 66%)',
          ].join(','),
        }}
      />

      {/* 2 — breathing blooms. ~18–24s cycles: present, never a screensaver.
             No `filter: blur()`. These are radial gradients that already fade
             to transparent — stacking a 120px blur on top of an already-soft
             gradient is visually redundant but enormously expensive to
             rasterize, and because they animate continuously they can't be
             cached. Safari pays that cost on every frame, forever, which
             starves the main thread that a click needs. The falloff below is
             widened slightly to match the old softness. */}
      <div
        className="absolute -top-[18vh] left-[6vw] size-[52vw] max-h-[720px] max-w-[720px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgb(77 141 255 / 0.16) 0%, rgb(77 141 255 / 0.09) 38%, transparent 72%)',
          animation: reduced ? undefined : 'breathe 19s var(--ease-out-soft) infinite',
          opacity: reduced ? 0.7 : undefined,
          willChange: 'transform, opacity',
        }}
      />
      <div
        className="absolute -right-[8vw] top-[8vh] size-[44vw] max-h-[620px] max-w-[620px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgb(139 92 246 / 0.14) 0%, rgb(139 92 246 / 0.08) 38%, transparent 72%)',
          animation: reduced ? undefined : 'drift 24s var(--ease-out-soft) infinite',
          opacity: reduced ? 0.6 : undefined,
          willChange: 'transform, opacity',
        }}
      />

      {/* 3 — hairline grid, faded out toward the edges so it never reads as a table */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgb(150 178 255 / 0.05) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgb(150 178 255 / 0.05) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '68px 68px',
          maskImage:
            'radial-gradient(ellipse 110% 70% at 50% 0%, #000 15%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 110% 70% at 50% 0%, #000 15%, transparent 72%)',
        }}
      />

      {/* 3.5 — the constellation. Drawn in canvas rather than DOM: it's the
                only layer here that is genuinely animating every frame, and a
                single canvas is one compositor layer with no gradients to
                repaint. See ConstellationField for the full reasoning. */}
      <ConstellationField />

      {/* 4 — the cursor glow, in two layers: a wide halo and a tighter core
              that tracks faster. Low opacity: the page notices you, it doesn't
              shine a torch at you.
              No mix-blend-mode: it's a well-known Safari performance cliff —
              WebKit falls back to CPU-assisted compositing for a blended
              layer (and drags anything stacked with it along), while Chrome
              composites it cheaply on the GPU. It cost nothing visually here
              — a dark background makes plain alpha compositing and `screen`
              blending nearly indistinguishable at this opacity.
              Also fixed-size with a STATIC gradient, moved only via
              `transform` (see usePointerGlow) — animating a gradient's own
              center forces a repaint of its pixels every frame and can't be
              composited, unlike a transform, which is compositor-only in
              every engine. That fixed-position-gradient version was the
              actual cause of "the mouse itself feels laggy" in Safari: it
              fired on every hover, everywhere, continuously. */}
      {finePointer && !reduced && (
        <>
          <div
            ref={glowRef}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              width: GLOW_SIZE,
              height: GLOW_SIZE,
              background:
                'radial-gradient(circle, rgb(96 150 255 / 0.16), rgb(139 92 246 / 0.08) 42%, transparent 68%)',
            }}
          />
          <div
            ref={coreRef}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              width: CORE_SIZE,
              height: CORE_SIZE,
              background:
                'radial-gradient(circle, rgb(150 190 255 / 0.13), rgb(99 102 241 / 0.07) 45%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* 5 — grain, to keep the gradients from banding on wide displays.
              Same reasoning as the cursor glow: no mix-blend-mode. */}
      <div className="grain absolute inset-0 opacity-[0.035]" />

      {/* Floor: anchors the page so content doesn't float off the bottom edge */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_top,var(--color-canvas),transparent)]" />
    </div>
  );
}
