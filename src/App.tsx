import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AmbientBackground } from '@/components/background/AmbientBackground';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { WorkPage } from '@/pages/WorkPage';
import { ProjectPage } from '@/pages/ProjectPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { jumpToTop, jumpToY } from '@/lib/scroll';
import type { HomeScrollState } from '@/lib/navigation';

/** Scroll position per history entry, so Back returns you where you were. */
const positions = new Map<string, number>();

/**
 * Lands the new route at the right scroll position.
 *
 * **This must stay a layout effect.** React runs layout effects bottom-up and
 * then all passive effects bottom-up, so a `useLayoutEffect` here fires after
 * every child's layout effect but *before* every child's `useEffect` —
 * including the one inside `useRevealOnce` that creates its IntersectionObserver.
 *
 * That ordering is the whole ballgame:
 *   - land in useLayoutEffect → observers are built at the final scroll
 *     position → anything above the fold reports `top < 0` on its first
 *     callback → revealed correctly.
 *   - land in useEffect → observers are built at the *old* position, deliver
 *     "not intersecting", then the page jumps past them. No further threshold
 *     is ever crossed, and those sections stay at opacity 0 permanently.
 *
 * One word away from a silent, hard-to-reproduce bug. Leave it as-is.
 */
function useRouteScroll() {
  const { key, state } = useLocation();

  /**
   * Record this entry's scroll position as it changes.
   *
   * Recorded live, and deliberately NOT in the effect's cleanup. React runs
   * layout effects before passive cleanups, so by the time a cleanup fired the
   * layout effect below had already scrolled the window to 0 — every entry
   * would save 0 and Back would always land at the top. Writing a number into
   * a Map on each scroll event is cheap enough that throttling it buys nothing
   * (and an rAF throttle silently records nothing at all in any context where
   * frames are suspended, such as a background tab).
   */
  useEffect(() => {
    const onScroll = () => positions.set(key, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [key]);

  useLayoutEffect(() => {
    // A cross-route anchor jump is HomePage's job — it has to wait for the
    // target section to exist. Don't fight it by jumping to the top first.
    if ((state as HomeScrollState)?.scrollTo) return;

    const saved = positions.get(key);
    // A fresh PUSH gets a brand-new key with no saved position → top.
    // A POP reuses the key it had on the way out → restore.
    if (saved !== undefined && saved > 0) jumpToY(saved);
    else jumpToTop();
  }, [key, state]);
}

/** Announces the new page to assistive tech and puts Tab back at its top. */
function useRouteFocus(ref: RefObject<HTMLElement | null>) {
  const { key } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Never on first paint: stealing focus there is hostile, and it fights the
    // browser restoring focus after a reload.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // preventScroll is required — focus() scrolls its target into view by
    // default, which would undo the landing useRouteScroll just performed.
    ref.current?.focus({ preventScroll: true });
  }, [key, ref]);
}

export default function App() {
  const mainRef = useRef<HTMLElement>(null);

  useRouteScroll();
  useRouteFocus(mainRef);

  return (
    <>
      {/* Not a bare href="#main": a same-document hash click updates
          window.location WITHOUT firing popstate, so the router's location
          goes stale relative to the address bar until the next real
          navigation. Move focus ourselves instead. */}
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          jumpToTop();
          mainRef.current?.focus({ preventScroll: true });
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:border focus:border-hairline-strong focus:bg-elevated focus:px-5 focus:py-3 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <AmbientBackground />
      <Navbar />

      {/* tabIndex={-1} makes this programmatically focusable without adding it
          to the tab order. index.css only styles :focus-visible, so this draws
          no outline. */}
      <main id="main" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
