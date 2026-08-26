import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { LinkButton } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';
import { MobileMenu } from './MobileMenu';
import { navLinks } from '@/data/site';
import { cn } from '@/lib/cn';
import { scrollToId, scrollToTop } from '@/lib/scroll';
import { EASE_EXPO } from '@/lib/motion';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useSpotlight } from '@/hooks/useSpotlight';

const sectionIds = navLinks.map((link) => link.href.replace('#', ''));

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const active = useScrollSpy(sectionIds);
  const reduced = useReducedMotionSafe();
  const { ref: spotRef, onPointerMove } = useSpotlight<HTMLDivElement>();

  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrolled(value > 40);
  });

  return (
    <>
      {/* Wrapper carries the one-time entrance and centers the pill — kept
          separate from the pill itself so its own continuous float animation
          (a plain CSS transform below) never fights a Motion-driven transform
          on the same element. */}
      <motion.div
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="fixed inset-x-0 top-0 z-40 flex justify-center px-[var(--gutter)] pt-3 sm:pt-5"
      >
        {/* Halo — breathes on the same slow rhythm as AmbientBackground's own
            blooms rather than inventing a new cadence. Blur lives on this
            static-position layer only, never on the pill itself (see
            DeviceFrame / CLAUDE.md: backdrop-filter and continuous blur on a
            persistent, always-mounted element is the Safari perf cliff that
            got fixed once already). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-3 h-24 w-[min(96vw,var(--shell))] -translate-x-1/2 rounded-full sm:top-5"
          style={{
            background:
              'radial-gradient(60% 100% at 50% 45%, rgb(77 141 255 / 0.24), rgb(139 92 246 / 0.1) 55%, transparent 75%)',
            filter: 'blur(30px)',
            animation: reduced ? undefined : 'breathe 20s var(--ease-out-soft) infinite',
            opacity: reduced ? 0.5 : undefined,
          }}
        />

        <div
          ref={spotRef}
          onPointerMove={onPointerMove}
          style={{ animation: reduced ? undefined : 'float-nav 12s ease-in-out infinite' }}
          // Matches the page's own content width (--shell, same as every
          // <Shell> below it) rather than an arbitrary narrower cap — so the
          // pill's edges line up with the hero/section content beneath it.
          className="w-full max-w-[min(96vw,var(--shell))]"
        >
          <header
            className={cn(
              // surface-card gives the cursor-tracked gradient border + interior
              // wash for free — the same primitive every other card on the site
              // uses, so the nav's "glow" reads as part of one system rather
              // than a one-off effect.
              'surface-card relative flex items-center justify-between overflow-hidden rounded-full border px-4 sm:px-5',
              'bg-[linear-gradient(180deg,rgb(19_27_46/0.94),rgb(9_13_23/0.9))]',
              // Static fallback shadow — the source of truth when motion is
              // reduced; overridden below by the animated glow otherwise.
              'shadow-[0_1px_0_0_rgb(180_205_255/0.12)_inset,0_24px_60px_-26px_rgb(0_0_0/0.9),0_0_0_1px_rgb(77_141_255/0.2),0_0_22px_1px_rgb(77_141_255/0.16)]',
              'transition-[height,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              scrolled ? 'h-14 border-hairline-strong' : 'h-[4.25rem] border-hairline',
            )}
            style={
              reduced ? undefined : { animation: 'nav-border-glow 4s ease-in-out infinite' }
            }
          >
            <a
              href="#top"
              aria-label="Tejas Naik — home"
              onClick={(event) => {
                event.preventDefault();
                scrollToTop();
              }}
              className="relative z-10 rounded-lg transition-opacity duration-200 hover:opacity-85"
            >
              <Wordmark />
            </a>

            <nav aria-label="Primary" className="relative z-10 hidden lg:block">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const id = link.href.replace('#', '');
                  const isActive = active === id;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          scrollToId(id);
                        }}
                        className={cn(
                          'relative block rounded-full px-4 py-2 text-sm transition-colors duration-200',
                          isActive ? 'text-ink' : 'text-ink-2 hover:text-ink',
                        )}
                      >
                        {link.label}
                        {/* Always mounted, opacity-only — a Motion layoutId
                            FLIP here would force a synchronous layout
                            measurement on every scroll-spy change. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute inset-0 -z-10 rounded-full border border-hairline-strong bg-white/[0.06] transition-opacity duration-300 ease-out',
                            isActive ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="relative z-10 flex items-center gap-3">
              <LinkButton
                href="#contact"
                variant="glow"
                arrow="right"
                size="md"
                className="hidden sm:inline-flex"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId('contact');
                }}
              >
                Start a project
              </LinkButton>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="grid size-11 place-items-center rounded-full border border-hairline text-ink-2 transition-colors duration-200 hover:border-hairline-strong hover:text-ink lg:hidden"
              >
                <Menu className="size-5" strokeWidth={1.75} />
              </button>
            </div>
          </header>
        </div>
      </motion.div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
