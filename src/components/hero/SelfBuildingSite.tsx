import { AnimatePresence, motion, useInView } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { EASE_EXPO } from '@/lib/motion';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/**
 * A miniature website that builds itself, then dissolves and rebuilds as a
 * different kind of site.
 *
 * This is the hero's whole argument: it says "I build websites" without a
 * sentence of explanation.
 *
 * The content is deliberately REAL TEXT rather than grey placeholder bars.
 * Bars read as a skeleton loader — an unfinished mockup — which is the opposite
 * of the impression this site is selling. Real words, even at 10px, read as a
 * finished website.
 *
 * Everything is sized in container-query units, so proportions are identical
 * whether the device is 340px or 640px wide. On a phone the small type becomes
 * texture rather than copy, which is fine; the composition still reads.
 */

/** Long enough that each layout sits finished and still for most of its turn —
 *  the assembly is the point, but a site that is always mid-animation reads as
 *  a demo rather than a product. */
const CYCLE_MS = 9200;

/* ── Motion ─────────────────────────────────────────────────────────────── */

const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.038, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.34, ease: EASE_EXPO } },
};

/** Blocks arrive. */
const rise = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_EXPO } },
};

/**
 * Type gets wiped in from the left, like a line being set. A clip-path wipe
 * rather than scaleX — scaling would squash the glyphs.
 */
const setType = {
  hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.45, ease: EASE_EXPO },
  },
};

/* ── Primitives ─────────────────────────────────────────────────────────── */

type TxtProps = {
  children: ReactNode;
  /** Font size in cqw. */
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/** A line of real type inside the miniature site. */
function Txt({ children, size = 1.7, className, style }: TxtProps) {
  return (
    <motion.div
      variants={setType}
      className={cn('whitespace-nowrap leading-[1.15]', className)}
      style={{ fontSize: `${size}cqw`, ...style }}
    >
      {children}
    </motion.div>
  );
}

function Block({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <motion.div
      variants={rise}
      className={cn(
        'rounded-[1.2cqw] border border-white/[0.07] bg-white/[0.035]',
        className,
      )}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Btn({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <motion.div
      variants={rise}
      className={cn(
        'flex items-center rounded-full px-[2.4cqw] py-[1.1cqw] font-medium leading-none',
        accent
          ? 'bg-[linear-gradient(90deg,var(--color-azure),var(--color-indigo))] text-white'
          : 'border border-white/[0.14] text-white/70',
      )}
      style={{ fontSize: '1.5cqw' }}
    >
      {children}
    </motion.div>
  );
}

function Mark({ size = 2.6 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-[0.7cqw] bg-[linear-gradient(135deg,var(--color-azure),var(--color-violet))]"
      style={{ width: `${size}cqw`, height: `${size}cqw` }}
    />
  );
}

/* ── Layout A — a marketing site ────────────────────────────────────────── */

function MarketingLayout() {
  return (
    <>
      <motion.div variants={rise} className="flex items-center justify-between">
        <div className="flex items-center gap-[1.5cqw]">
          <Mark />
          <span
            className="font-semibold tracking-[-0.02em] text-white/90"
            style={{ fontSize: '2cqw' }}
          >
            Lumen
          </span>
        </div>
        <div className="flex items-center gap-[2.6cqw] text-white/45">
          <span style={{ fontSize: '1.55cqw' }}>Product</span>
          <span style={{ fontSize: '1.55cqw' }}>Pricing</span>
          <span style={{ fontSize: '1.55cqw' }}>About</span>
          <Btn accent>Get started</Btn>
        </div>
      </motion.div>

      <div className="mt-[6.5cqw] flex items-start gap-[5cqw]">
        <div className="flex w-[54%] flex-col">
          <Txt
            size={1.35}
            className="font-mono uppercase tracking-[0.22em] text-azure"
          >
            Platform
          </Txt>

          <div className="mt-[2.4cqw] flex flex-col gap-[0.9cqw] font-semibold tracking-[-0.035em] text-white/92">
            <Txt size={5.2}>Grow without</Txt>
            <Txt size={5.2}>the guesswork.</Txt>
          </div>

          <div className="mt-[2.6cqw] flex flex-col gap-[0.7cqw] text-white/40">
            <Txt size={1.7}>Everything your team needs to launch,</Txt>
            <Txt size={1.7}>measure, and scale — in one place.</Txt>
          </div>

          <div className="mt-[3cqw] flex gap-[1.6cqw]">
            <Btn accent>Start free</Btn>
            <Btn>Book a demo</Btn>
          </div>
        </div>

        <Block className="relative flex-1 overflow-hidden" style={{ height: '30cqw' }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 70% at 30% 20%, rgb(77 141 255 / 0.32), transparent 70%), radial-gradient(70% 60% at 85% 90%, rgb(139 92 246 / 0.3), transparent 70%)',
            }}
          />
          <div className="absolute inset-x-[9%] bottom-[9%]">
            <div
              className="font-medium text-white/80"
              style={{ fontSize: '1.75cqw' }}
            >
              Live overview
            </div>
            <div className="mt-[0.6cqw] text-white/35" style={{ fontSize: '1.4cqw' }}>
              Updated moments ago
            </div>
          </div>
        </Block>
      </div>
    </>
  );
}

/* ── Layout B — a brand/studio site ─────────────────────────────────────── */

/** Captions inside a fictional studio site. They describe the demo page, not
 *  this studio — nothing here is a claim about real work. */
const CAPABILITIES = [
  { name: 'Identity', note: 'Naming, marks, systems' },
  { name: 'Websites', note: 'Design and build' },
  { name: 'Motion', note: 'Film and interaction' },
];

/**
 * A full page composition rather than an app screen: navigation, a headline,
 * an image band, then a content row. This slot used to hold an analytics
 * dashboard, which looked good but sold the wrong thing — the hero's entire
 * job is to say "I build websites", and a chart-and-KPI screen says "I build
 * SaaS internals" instead. Every element here is something a marketing site
 * actually has.
 */
function StudioLayout() {
  return (
    <div className="flex h-full flex-col">
      <motion.div variants={rise} className="flex items-center justify-between">
        <div className="flex items-center gap-[1.4cqw]">
          <Mark size={2.4} />
          <span
            className="font-semibold tracking-[-0.02em] text-white/90"
            style={{ fontSize: '2cqw' }}
          >
            Aperture
          </span>
        </div>
        <div className="flex items-center gap-[2.4cqw] text-white/45">
          <span style={{ fontSize: '1.5cqw' }}>Work</span>
          <span style={{ fontSize: '1.5cqw' }}>Studio</span>
          <span style={{ fontSize: '1.5cqw' }}>Journal</span>
          <Btn>Let’s talk</Btn>
        </div>
      </motion.div>

      <div className="mt-[5cqw] flex items-end justify-between gap-[4cqw]">
        <div className="flex flex-col gap-[0.9cqw] font-semibold tracking-[-0.035em] text-white/92">
          <Txt size={4.8}>Built for brands</Txt>
          <Txt size={4.8}>that mean it.</Txt>
        </div>
        <div className="flex flex-col items-end gap-[1cqw] pb-[0.6cqw] text-right text-white/40">
          <Txt size={1.5}>An independent design</Txt>
          <Txt size={1.5}>and technology studio.</Txt>
        </div>
      </div>

      {/* Image band — three plates reading as photography, not placeholders. */}
      <div className="mt-[3.4cqw] grid grid-cols-[1.6fr_1fr_1fr] gap-[1.6cqw]">
        <Block className="relative overflow-hidden" style={{ height: '17cqw' }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(75% 80% at 25% 15%, rgb(77 141 255 / 0.34), transparent 72%), radial-gradient(60% 70% at 90% 95%, rgb(139 92 246 / 0.3), transparent 74%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(to_top,rgb(5_8_16/0.88),transparent)]" />
          <div className="absolute inset-x-[6%] bottom-[8%]">
            <div className="font-medium text-white/85" style={{ fontSize: '1.6cqw' }}>
              Halden Optics
            </div>
            <div className="text-white/35" style={{ fontSize: '1.3cqw' }}>
              Brand & site
            </div>
          </div>
        </Block>
        <Block className="relative overflow-hidden" style={{ height: '17cqw' }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 70% at 60% 25%, rgb(34 211 238 / 0.24), transparent 74%)',
            }}
          />
          <div className="absolute inset-x-[9%] bottom-[9%] text-white/70" style={{ fontSize: '1.35cqw' }}>
            Marlow
          </div>
        </Block>
        <Block className="relative overflow-hidden" style={{ height: '17cqw' }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 70% at 40% 30%, rgb(240 179 87 / 0.22), transparent 74%)',
            }}
          />
          <div className="absolute inset-x-[9%] bottom-[9%] text-white/70" style={{ fontSize: '1.35cqw' }}>
            Ferrous
          </div>
        </Block>
      </div>

      {/* Content row */}
      <div className="mt-auto grid grid-cols-3 gap-[1.8cqw] border-t border-white/[0.07] pt-[2.4cqw]">
        {CAPABILITIES.map((item) => (
          <motion.div key={item.name} variants={rise} className="flex flex-col">
            <span
              className="font-medium tracking-[-0.02em] text-white/85"
              style={{ fontSize: '1.7cqw' }}
            >
              {item.name}
            </span>
            <span className="mt-[0.5cqw] text-white/35" style={{ fontSize: '1.3cqw' }}>
              {item.note}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Layout C — an editorial portfolio ──────────────────────────────────── */

const WORKS = [
  {
    name: 'Coastal House',
    year: '2024',
    wash: 'radial-gradient(70% 70% at 40% 30%, rgb(77 141 255 / 0.3), transparent 72%)',
  },
  {
    name: 'Concrete Chapel',
    year: '2025',
    wash: 'radial-gradient(70% 70% at 60% 40%, rgb(139 92 246 / 0.3), transparent 72%)',
  },
  {
    name: 'Glass Pavilion',
    year: '2026',
    wash: 'radial-gradient(70% 70% at 50% 60%, rgb(34 211 238 / 0.22), transparent 72%)',
  },
];

function EditorialLayout() {
  return (
    <div className="flex h-full flex-col">
      <motion.div variants={rise} className="flex items-center justify-between">
        <span
          className="font-semibold tracking-[0.12em] text-white/85"
          style={{ fontSize: '1.9cqw' }}
        >
          ATELIER
        </span>
        <div className="flex gap-[2.6cqw] text-white/40">
          <span style={{ fontSize: '1.5cqw' }}>Work</span>
          <span style={{ fontSize: '1.5cqw' }}>Studio</span>
          <span style={{ fontSize: '1.5cqw' }}>Contact</span>
        </div>
      </motion.div>

      <div className="mt-[5.5cqw] flex flex-col items-center gap-[1cqw] text-center">
        <div className="flex flex-col items-center gap-[0.8cqw] font-semibold tracking-[-0.035em] text-white/92">
          <Txt size={4.6}>Spaces that hold</Txt>
          <Txt size={4.6}>their silence.</Txt>
        </div>
        <div className="mt-[1.4cqw] text-white/35">
          <Txt size={1.55}>Selected works · 2019—2026</Txt>
        </div>
      </div>

      <div className="mt-[5cqw] grid flex-1 grid-cols-3 gap-[2cqw]">
        {WORKS.map((work) => (
          <Block key={work.name} className="relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: work.wash }} />
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_top,rgb(5_8_16/0.85),transparent)]" />
            <div className="absolute inset-x-[9%] bottom-[9%]">
              <div
                className="truncate font-medium text-white/85"
                style={{ fontSize: '1.5cqw' }}
              >
                {work.name}
              </div>
              <div className="text-white/35" style={{ fontSize: '1.3cqw' }}>
                {work.year}
              </div>
            </div>
          </Block>
        ))}
      </div>
    </div>
  );
}

/* ── Cycler ─────────────────────────────────────────────────────────────── */

/** Three kinds of website, not three kinds of screen — the cycle is the hero's
 *  argument that this studio builds range, so each entry has to read
 *  unmistakably as a *site*. */
export const buildLayouts = [
  { id: 'marketing', label: 'marketing-site', Component: MarketingLayout },
  { id: 'studio', label: 'studio-site', Component: StudioLayout },
  { id: 'editorial', label: 'portfolio', Component: EditorialLayout },
] as const;

/**
 * Drives the cycle. Lives outside the renderer so the device's address bar can
 * label whatever is currently being built.
 */
export function useBuildCycle(ref: React.RefObject<HTMLElement | null>) {
  const reduced = useReducedMotionSafe();
  const inView = useInView(ref, { amount: 0.3 });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Nothing runs when the hero is off-screen or motion is reduced.
    if (reduced || !inView) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % buildLayouts.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(timer);
  }, [reduced, inView]);

  const active = buildLayouts[index] ?? buildLayouts[0];
  return { index, label: active.label };
}

export function SelfBuildingSite({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const active = buildLayouts[index] ?? buildLayouts[0];
  const { Component } = active;

  return (
    <div
      // An illustration of a website, not content. Without this a screen
      // reader announces "Lumen Product Pricing Get started Grow without the
      // guesswork…" as if it were part of the page.
      aria-hidden="true"
      className={cn('relative size-full overflow-hidden', className)}
      style={{ containerType: 'inline-size' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          variants={stage}
          // Reduced motion skips the assembly and shows the finished layout.
          initial={reduced ? 'visible' : 'hidden'}
          animate="visible"
          exit="exit"
          className="absolute inset-0 p-[3.6cqw]"
        >
          <Component />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
