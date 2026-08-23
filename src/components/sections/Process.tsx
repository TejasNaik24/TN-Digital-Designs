import { motion } from 'motion/react';
import { useRef } from 'react';
import { Section, Shell } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { processSteps } from '@/data/process';
import { EASE_EXPO } from '@/lib/motion';
import { useRevealOnce } from '@/hooks/useRevealOnce';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export function Process() {
  const reduced = useReducedMotionSafe();
  const railRef = useRef<HTMLDivElement>(null);
  const railVisible = useRevealOnce(railRef);

  return (
    <Section id="process" labelledBy="process-heading">
      <Shell>
        <SectionHeading
          id="process-heading"
          label="How it works"
          title="Four stages. You always know where things stand."
          lede="No black box, no radio silence for three weeks. You see the site coming together from the first day of the build."
        />

        <div className="relative mt-16 lg:mt-20">
          {/* Connecting rail. The only animation here — it's what makes the
              sequence legible as a sequence. */}
          <div
            ref={railRef}
            aria-hidden="true"
            className="absolute left-[0.9375rem] top-2 hidden h-px w-full origin-left bg-hairline sm:block lg:left-0"
          >
            <motion.div
              initial={false}
              animate={{ scaleX: reduced || railVisible ? 1 : 0 }}
              transition={{ duration: 1.5, ease: EASE_EXPO, delay: 0.15 }}
              className="h-px w-full origin-left bg-[linear-gradient(to_right,var(--color-azure),var(--color-indigo)_45%,var(--color-violet)_75%,transparent)] opacity-55"
            />
          </div>

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {processSteps.map((step, index) => (
              <li key={step.step}>
                <Reveal delay={index * 0.08}>
                  <div className="group relative flex flex-col">
                    <span
                      aria-hidden="true"
                      className="relative z-10 mb-7 block size-[0.4375rem] rounded-full bg-azure shadow-[0_0_0_4px_var(--color-canvas),0_0_14px_2px_rgb(77_141_255/0.5)]"
                    />

                    <span className="mono-label text-ink-3">{step.step}</span>

                    <h3 className="mt-4 text-[1.5rem] font-medium tracking-[-0.025em] text-ink">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
                      {step.body}
                    </p>

                    <span className="mt-5 inline-flex w-fit items-center rounded-full border border-hairline bg-elevated/70 px-3 py-1.5 font-mono text-[0.6875rem] text-ink-3">
                      {step.output}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Shell>
    </Section>
  );
}
