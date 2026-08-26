import { Section, Shell } from '@/components/layout/Section';
import { cn } from '@/lib/cn';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services, type Service } from '@/data/services';
import { useSpotlight } from '@/hooks/useSpotlight';

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const Icon = service.icon;

  return (
    <Reveal delay={index * 0.06} className="h-full">
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        className={cn(
          'surface-card card-surface group h-full rounded-panel p-7 sm:p-8',
          'transition-[transform,border-color,box-shadow] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          'hover:-translate-y-1 hover:border-hairline-strong',
          'hover:shadow-[0_1px_0_0_rgb(180_205_255/0.12)_inset,0_28px_60px_-30px_rgb(0_0_0/0.95)]',
        )}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center justify-between">
            <span className="grid size-11 place-items-center rounded-[0.85rem] border border-hairline bg-elevated text-azure shadow-[0_0_0_1px_rgb(4_6_12/0.6)] transition-[color,border-color,transform] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:border-azure/35 group-hover:text-ink">
              <Icon className="size-[1.15rem]" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <span className="mono-label text-ink-3">{service.label}</span>
          </div>

          <h3 className="mt-7 text-[1.375rem] font-medium tracking-[-0.022em] text-ink">
            {service.title}
          </h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
            {service.description}
          </p>

          {/* Deliverables as one quiet line rather than a stack of chips —
              keeps four cards side by side from turning into columns. */}
          <p className="mt-auto pt-7 font-mono text-[0.6875rem] leading-[1.9] text-ink-3">
            {service.includes.join('  ·  ')}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function Services() {
  return (
    <Section id="services" labelledBy="services-heading" tone="raised">
      <Shell>
        <SectionHeading
          id="services-heading"
          label="What I build"
          title="End to end, from the first sketch to the live site."
          lede="Four things, done properly. Most projects are one of them; the interesting ones are usually two or three combined."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </Shell>
    </Section>
  );
}
