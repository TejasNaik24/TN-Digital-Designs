import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef, type PointerEvent } from 'react';
import { Shell } from '@/components/layout/Section';
import { LinkButton } from '@/components/ui/Button';
import { DeviceFrame, BlueprintMarks } from './DeviceFrame';
import { SelfBuildingSite, useBuildCycle } from './SelfBuildingSite';
import { site } from '@/data/site';
import { DUR, EASE_EXPO } from '@/lib/motion';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useHasFinePointer } from '@/hooks/useMediaQuery';
import { scrollToId } from '@/lib/scroll';

/** Page-load choreography: one sequence, top to bottom, then it's done. */
const enter = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduced = useReducedMotionSafe();
  const finePointer = useHasFinePointer();
  const sectionRef = useRef<HTMLElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const { index, label } = useBuildCycle(deviceRef);

  // Cursor tilt — the device leans toward the pointer anywhere in the hero.
  // Kept to ±3.5° so it reads as attention, not as a 3D toy.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 18, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 18, mass: 0.6 });
  const rotateY = useTransform(smoothX, [0, 1], [-3.5, 3.5]);
  const rotateX = useTransform(smoothY, [0, 1], [2.8, -2.8]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 46]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.12]);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!finePointer || reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const still = reduced || !finePointer;

  return (
    <section
      ref={sectionRef}
      id="top"
      onPointerMove={handlePointerMove}
      className="relative"
      aria-label="Introduction"
    >
      <Shell className="relative pb-16 pt-32 sm:pt-36 lg:pb-20 lg:pt-40">
        {/* Device gets slightly more of the row than the copy — it is the proof,
            and at 1fr it left a dead column to its right. */}
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* ── Copy ── */}
          <motion.div
            style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.1 }}
          >
            <motion.p
              variants={enter}
              transition={{ duration: DUR.reveal, ease: EASE_EXPO }}
              className="flex flex-wrap items-center gap-x-4 gap-y-3"
            >
              <span className="mono-label text-ink-3">{site.hero.eyebrow}</span>
            </motion.p>

            <motion.h1
              variants={enter}
              transition={{ duration: DUR.reveal, ease: EASE_EXPO }}
              className="mt-8 max-w-3xl text-balance text-hero font-medium text-ink"
            >
              {site.hero.headline.join(' ')}{' '}
              <span className="text-gradient">{site.hero.headlineAccent}</span>
            </motion.h1>

            <motion.p
              variants={enter}
              transition={{ duration: DUR.reveal, ease: EASE_EXPO }}
              className="mt-7 max-w-xl text-lede text-ink-2"
            >
              {site.hero.lede}
            </motion.p>

            <motion.div
              variants={enter}
              transition={{ duration: DUR.reveal, ease: EASE_EXPO }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <LinkButton
                href="#contact"
                size="lg"
                arrow="right"
                className="max-sm:w-full"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId('contact');
                }}
              >
                Start a project
              </LinkButton>
              <LinkButton
                href="#work"
                variant="secondary"
                size="lg"
                arrow={false}
                className="max-sm:w-full"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId('work');
                }}
              >
                See the work
              </LinkButton>
            </motion.div>
          </motion.div>

          {/* ── Device ── */}
          <motion.div
            ref={deviceRef}
            className="relative [perspective:1400px]"
            initial={{ opacity: 0, y: reduced ? 0 : 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: reduced ? 0 : 0.3, ease: EASE_EXPO }}
            style={reduced ? undefined : { y: deviceY }}
          >
            <motion.div
              style={still ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative"
            >
              <div
                style={{
                  animation: still ? undefined : 'float-slow 11s ease-in-out infinite',
                }}
              >
                <BlueprintMarks />
                <DeviceFrame label={label}>
                  <SelfBuildingSite index={index} />
                </DeviceFrame>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Shell>
    </section>
  );
}
