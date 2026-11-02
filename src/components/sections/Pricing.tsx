import { Check } from 'lucide-react';
import { Section, Shell } from '@/components/layout/Section';
import { LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { tiers, type Tier } from '@/data/pricing';
import { cn } from '@/lib/cn';
import { useAnchorNavigate } from '@/lib/navigation';
import { requestQuote } from '@/lib/quote';

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  const { hrefFor, onClickFor } = useAnchorNavigate();
  const toContact = onClickFor('contact');

  return (
    <Reveal delay={index * 0.06} className="h-full">
      <article
        aria-labelledby={`tier-${tier.id}`}
        className={cn(
          'card-surface flex h-full flex-col rounded-panel p-7 sm:p-8',
          // Emphasis by edge light, not a louder card: the recommended tier
          // should read as the obvious default without shouting. `!` because
          // card-surface sets its own border and shadow.
          tier.recommended &&
            'border-[rgb(120_160_255/0.38)]! shadow-[0_1px_0_0_rgb(180_205_255/0.1)_inset,0_24px_60px_-28px_rgb(77_141_255/0.5)]!',
        )}
      >
        {/* Wraps instead of squeezing: on narrow cards the badge drops below the name. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <h3 id={`tier-${tier.id}`} className="whitespace-nowrap text-[1.375rem] font-medium tracking-[-0.022em] text-ink">
            {tier.name}
          </h3>
          {tier.recommended && (
            <span className="rounded-full border border-azure/30 bg-azure/10 whitespace-nowrap px-2.5 py-1 text-[0.75rem] font-medium text-ink">
              What I’d suggest for most
            </span>
          )}
        </div>

        <p className="mt-6 text-[0.875rem] text-ink-3">Starting at</p>
        <p className="mt-1 text-[2.25rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">
          ${tier.startingAt}
        </p>

        <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-2">{tier.forWho}</p>

        <ul className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6">
          {tier.includes.map((item) => (
            <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-2">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-azure" strokeWidth={2} />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <LinkButton
            href={hrefFor('contact')}
            variant={tier.recommended ? 'glow' : 'secondary'}
            arrow="right"
            className="w-full"
            onClick={(event) => {
              requestQuote(tier.projectType);
              toContact(event);
            }}
          >
            Get a quote<span className="sr-only"> for a {tier.name}</span>
          </LinkButton>
        </div>
      </article>
    </Reveal>
  );
}

export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-heading">
      <Shell>
        <SectionHeading
          id="pricing-heading"
          label="Pricing"
          title="Clear starting points. A fixed quote before any work begins."
          lede="Every site is priced for what it actually needs, after a short call. These are where projects start, so you know the range before you get in touch."
        />

        <div className="mt-14 grid gap-4 lg:mt-16 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <TierCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>
      </Shell>
    </Section>
  );
}
