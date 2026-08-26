import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LinkButton } from '@/components/ui/Button';
import { Monogram } from '@/components/ui/Wordmark';
import { navLinks, site } from '@/data/site';
import { DUR, EASE_EXPO } from '@/lib/motion';
import { scrollToId } from '@/lib/scroll';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotionSafe();
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const go = (href: string) => {
    onClose();
    // Let the panel finish leaving before the page moves underneath it.
    window.setTimeout(() => scrollToId(href.replace('#', '')), reduced ? 0 : 260);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: DUR.exit * 0.6 } }}
          transition={{ duration: DUR.panel, ease: EASE_EXPO }}
          className="fixed inset-0 z-50 flex flex-col bg-canvas/95 backdrop-blur-2xl lg:hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 50% at 50% 0%, rgb(77 141 255 / 0.16), transparent 65%)',
            }}
          />

          <div className="relative flex h-[4.5rem] shrink-0 items-center justify-between px-[var(--gutter)]">
            <Monogram />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full border border-hairline text-ink-2 transition-colors duration-200 hover:border-hairline-strong hover:text-ink"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <nav className="relative flex flex-1 flex-col justify-center px-[var(--gutter)] pb-16">
            <ul className="flex flex-col">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: reduced ? 0 : 0.08 + index * 0.06,
                    ease: EASE_EXPO,
                  }}
                  className="border-b border-hairline"
                >
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      go(link.href);
                    }}
                    className="flex items-baseline gap-4 py-5 text-[2rem] font-medium tracking-[-0.03em] text-ink transition-colors duration-200 hover:text-azure"
                  >
                    <span className="mono-label w-6 text-ink-3">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : 0.34, ease: EASE_EXPO }}
              className="mt-10 flex flex-col gap-5"
            >
              <LinkButton
                href="#contact"
                variant="glow"
                size="lg"
                arrow="right"
                onClick={(event) => {
                  event.preventDefault();
                  go('#contact');
                }}
              >
                Start a project
              </LinkButton>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-ink-2 transition-colors duration-200 hover:text-ink"
              >
                {site.email}
              </a>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
