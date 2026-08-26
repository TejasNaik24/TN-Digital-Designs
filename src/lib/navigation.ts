import { useCallback, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToId, scrollToTop } from './scroll';

/**
 * Route-aware anchor navigation.
 *
 * Every anchor link on this site (`#services`, `#contact`, …) used to call
 * `scrollToId` directly, which only works while the target section is mounted
 * — i.e. only on the homepage. Once project routes existed, the same nav link
 * did nothing at all on `/work/vela`.
 *
 * This is the single place that decides:
 *   - already on `/` → scroll, exactly as before (animated expo-out tween)
 *   - anywhere else  → navigate home, then let HomePage land the jump
 *
 * Navbar, MobileMenu, Footer and the Work CTA all go through this. Do not
 * reintroduce a bare `scrollToId` call in a component — it will silently be a
 * dead link from any project route.
 */

const HOME = '/';

type GoOptions = {
  /** Runs before anything moves — MobileMenu passes its close(). */
  before?: () => void;
  /** ms to wait after `before`, so an exit animation can finish first. */
  delay?: number;
};

export function useAnchorNavigate() {
  const navigate = useNavigate();
  const onHome = useLocation().pathname === HOME;

  /** A real href, so the link is copyable and opens in a new tab correctly. */
  const hrefFor = useCallback(
    (id: string) => (onHome ? `#${id}` : `/#${id}`),
    [onHome],
  );

  const go = useCallback(
    (id: string, { before, delay = 0 }: GoOptions = {}) => {
      before?.();

      const run = () => {
        if (onHome) {
          if (id === 'top') scrollToTop();
          else scrollToId(id);
          return;
        }
        // `state` is read by HomePage on mount — doing the scroll there rather
        // than on a timeout here means it fires once the section actually
        // exists, instead of racing an arbitrary delay.
        navigate(HOME, id === 'top' ? undefined : { state: { scrollTo: id } });
      };

      if (delay) window.setTimeout(run, delay);
      else run();
    },
    [onHome, navigate],
  );

  /** Drop-in replacement for the old inline preventDefault + scrollToId. */
  const onClickFor = useCallback(
    (id: string, options?: GoOptions) => (event: MouseEvent) => {
      // Let the browser handle modified clicks, so cmd/ctrl-click still opens
      // a new tab and middle-click still works.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
        return;
      }
      event.preventDefault();
      go(id, options);
    },
    [go],
  );

  return { onHome, hrefFor, go, onClickFor };
}

/** Shape of the router state HomePage consumes to finish a cross-route jump. */
export type HomeScrollState = { scrollTo?: string } | null;
