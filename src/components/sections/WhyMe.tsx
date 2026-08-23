import { Section, Shell } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { reasons } from '@/data/why';
import { technologies } from '@/data/tech';

export function WhyMe() {
  return (
    <Section id="why" labelledBy="why-heading" tone="raised">
      <Shell>
        <SectionHeading
          id="why-heading"
          label="Why work with me"
          title="No agency, no handoffs, no diluted work."
          lede="Most of what makes a website good gets lost between the people who design it and the people who build it. Here there’s nowhere for it to get lost."
        />

        <div className="mt-14 grid gap-x-10 gap-y-px border-t border-hairline sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} delay={(index % 3) * 0.06}>
                <div className="group flex h-full flex-col border-b border-hairline py-8">
                  <span className="grid size-9 place-items-center rounded-[0.7rem] border border-hairline bg-elevated text-azure transition-colors duration-300 group-hover:border-azure/30">
                    <Icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                    {reason.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                    {reason.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Tech row — short on purpose. A wall of logos reads as padding. */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <span className="mono-label shrink-0 text-ink-3">Built with</span>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
              {technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-hairline bg-surface/40 px-3.5 py-1.5 font-mono text-[0.75rem] tracking-[0.01em] text-ink-2 transition-colors duration-300 hover:border-hairline-strong hover:text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Shell>
    </Section>
  );
}
