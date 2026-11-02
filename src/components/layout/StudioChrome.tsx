import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { AmbientBackground } from '@/components/background/AmbientBackground';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * The studio's own frame: dark ambient background, navbar, footer.
 *
 * Wraps every studio route. The /work/:slug demos deliberately do NOT get it —
 * each demo is a different business's website and must not look like it lives
 * inside the studio site.
 *
 * Renders `children` when given (used to show the 404 for an unknown demo
 * slug), otherwise the matched child route.
 */
export function StudioChrome({ children }: { children?: ReactNode }) {
  return (
    <>
      <AmbientBackground />
      <Navbar />

      {/* tabIndex={-1} makes this programmatically focusable without adding it
          to the tab order. index.css only styles :focus-visible, so this draws
          no outline. */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children ?? <Outlet />}
      </main>

      <Footer />
    </>
  );
}
