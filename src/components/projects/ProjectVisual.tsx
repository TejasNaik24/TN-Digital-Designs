import { cn } from '@/lib/cn';
import type { ProjectVisualKind } from '@/data/projects';

/**
 * Project previews, drawn rather than screenshotted.
 *
 * Four dark product surfaces, each composed to look like a real site for that
 * kind of business, taking its accent from the project's own colour.
 *
 * The copy is REAL TEXT, not grey placeholder bars. Bars read as a skeleton
 * loader — an unfinished mockup — which is exactly the wrong impression for a
 * section whose job is to prove finished work. Real words make these read as
 * websites. At phone widths the small type becomes texture, which is fine; the
 * composition still holds.
 *
 * REPLACE: when a real screenshot exists, render an <img> here instead. The
 * card and modal don't care which they get.
 */

type VisualProps = { accent: string; name: string };

const surface = 'rounded-[1.2cqw] border border-white/[0.07] bg-white/[0.03]';

function Mark({ accent, size = 2.4 }: { accent: string; size?: number }) {
  return (
    <div
      className="shrink-0 rounded-[0.6cqw]"
      style={{ width: `${size}cqw`, height: `${size}cqw`, background: accent, opacity: 0.9 }}
    />
  );
}

function Nav({
  accent,
  name,
  links,
  cta,
}: {
  accent: string;
  name: string;
  links: string[];
  cta?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[1.3cqw]">
        <Mark accent={accent} />
        <span
          className="font-semibold tracking-[-0.02em] text-white/85"
          style={{ fontSize: '2.1cqw' }}
        >
          {name}
        </span>
      </div>
      <div className="flex items-center gap-[2.2cqw]">
        {links.map((link) => (
          <span key={link} className="text-white/40" style={{ fontSize: '1.7cqw' }}>
            {link}
          </span>
        ))}
        {cta && (
          <span
            className="rounded-full px-[2.2cqw] py-[1cqw] font-medium leading-none text-white"
            style={{ fontSize: '1.6cqw', background: accent, opacity: 0.92 }}
          >
            {cta}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Atelier Nord — editorial architecture portfolio ────────────────────── */

function EditorialVisual({ accent, name }: VisualProps) {
  /** Massed volumes, read as an elevation. Enough form to say "architecture"
   *  without pretending to be a photograph.
   *
   *  `windows` is what stops this reading as a bar chart — five plain
   *  rectangles of stepped height is exactly a column chart, which is the
   *  wrong signal on a card whose whole job is to say "architecture studio".
   *  A few horizontal floor lines and a lit window turn the same shapes into
   *  buildings. */
  const massing = [
    { left: '8%', width: '17%', height: '46%', opacity: 0.1, floors: 3, lit: false },
    { left: '25%', width: '13%', height: '68%', opacity: 0.16, floors: 5, lit: true },
    { left: '38%', width: '22%', height: '88%', opacity: 0.24, floors: 6, lit: false },
    { left: '60%', width: '15%', height: '58%', opacity: 0.14, floors: 4, lit: true },
    { left: '75%', width: '19%', height: '36%', opacity: 0.09, floors: 2, lit: false },
  ];

  return (
    <div className="flex h-full flex-col p-[4cqw]">
      <div className="flex items-center justify-between">
        <span
          className="font-semibold uppercase tracking-[0.14em] text-white/85"
          style={{ fontSize: '1.9cqw' }}
        >
          {name}
        </span>
        <div className="flex gap-[2.2cqw] text-white/40">
          {['Works', 'Studio', 'Contact'].map((link) => (
            <span key={link} style={{ fontSize: '1.6cqw' }}>
              {link}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-[3.5cqw] flex flex-1 gap-[4cqw]">
        <div className="flex w-[40%] flex-col justify-center">
          <span
            className="font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: '1.35cqw', color: accent, opacity: 0.9 }}
          >
            Selected work
          </span>
          <div
            className="mt-[1.8cqw] font-semibold leading-[1.12] tracking-[-0.035em] text-white/90"
            style={{ fontSize: '4.2cqw' }}
          >
            Light, mass, and
            <br />
            the space between.
          </div>
          <div
            className="mt-[1.8cqw] leading-[1.5] text-white/38"
            style={{ fontSize: '1.55cqw' }}
          >
            An architecture practice
            <br />
            working in northern light.
          </div>
          <div
            className="mt-[2cqw] h-px w-[30%]"
            style={{ background: accent, opacity: 0.5 }}
          />
        </div>

        <div className={cn(surface, 'relative flex-1 overflow-hidden')}>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${accent}26 0%, transparent 62%), radial-gradient(60% 45% at 72% 12%, #ffffff1c, transparent 72%)`,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 top-0">
            {massing.map((block, index) => (
              <div
                key={index}
                className="absolute bottom-0 flex flex-col justify-end gap-[8%] overflow-hidden border-t border-white/[0.14] px-[14%] pb-[10%]"
                style={{
                  left: block.left,
                  width: block.width,
                  height: block.height,
                  background: `rgb(255 255 255 / ${block.opacity})`,
                }}
              >
                {Array.from({ length: block.floors }).map((_, floor) => (
                  <span
                    key={floor}
                    className="h-px w-full shrink-0"
                    style={{
                      background:
                        block.lit && floor === 1
                          ? `${accent}88`
                          : 'rgb(255 255 255 / 0.16)',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(to_top,rgb(5_8_16/0.92),transparent)]" />
          <div className="absolute inset-x-[6%] bottom-[7%]">
            <div
              className="font-medium text-white/85"
              style={{ fontSize: '1.6cqw' }}
            >
              Rill House
            </div>
            <div className="text-white/35" style={{ fontSize: '1.35cqw' }}>
              Nordland · 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Vela — AI product site ─────────────────────────────────────────────── */

const VELA_STATS = [
  { label: 'Requests', value: '2.4M' },
  { label: 'p95 latency', value: '180ms' },
  { label: 'Uptime', value: '99.9%' },
];

function ProductVisual({ accent, name }: VisualProps) {
  return (
    <div className="flex h-full flex-col p-[3.6cqw]">
      <Nav accent={accent} name={name} links={['Docs', 'Pricing']} cta="Get started" />

      <div className="mt-[4.5cqw] flex flex-1 gap-[3.2cqw]">
        <div className="flex w-[42%] flex-col justify-center">
          <span
            className="w-fit rounded-full px-[1.6cqw] py-[0.7cqw] font-medium leading-none"
            style={{ fontSize: '1.35cqw', background: `${accent}26`, color: accent }}
          >
            Now in beta
          </span>
          <div
            className="mt-[1.8cqw] font-semibold leading-[1.12] tracking-[-0.035em] text-white/90"
            style={{ fontSize: '3.8cqw' }}
          >
            Ship AI features,
            <br />
            not prototypes.
          </div>
          <div
            className="mt-[1.6cqw] leading-[1.5] text-white/38"
            style={{ fontSize: '1.5cqw' }}
          >
            One API for retrieval, evals,
            <br />
            and everything after the demo.
          </div>
          <div className="mt-[2.2cqw] flex gap-[1.4cqw]">
            <span
              className="rounded-full px-[2.2cqw] py-[1.1cqw] font-medium leading-none text-white"
              style={{ fontSize: '1.5cqw', background: accent, opacity: 0.92 }}
            >
              Start building
            </span>
            <span
              className="rounded-full border border-white/15 px-[2.2cqw] py-[1.1cqw] font-medium leading-none text-white/65"
              style={{ fontSize: '1.5cqw' }}
            >
              Read docs
            </span>
          </div>
        </div>

        <div className={cn(surface, 'relative flex-1 overflow-hidden p-[2.2cqw]')}>
          <div className="flex items-center justify-between">
            <span className="font-medium text-white/70" style={{ fontSize: '1.5cqw' }}>
              Production
            </span>
            <div className="flex gap-[0.7cqw]">
              <div className="size-[1.2cqw] rounded-full bg-white/12" />
              <div className="size-[1.2cqw] rounded-full bg-white/12" />
            </div>
          </div>

          <div className="mt-[2cqw] grid grid-cols-3 gap-[1.3cqw]">
            {VELA_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="rounded-[0.8cqw] border border-white/[0.06] p-[1.1cqw]"
                style={{ background: index === 0 ? `${accent}1f` : '#ffffff08' }}
              >
                <div className="truncate text-white/40" style={{ fontSize: '1.2cqw' }}>
                  {stat.label}
                </div>
                <div
                  className="mt-[0.5cqw] font-semibold tracking-[-0.02em]"
                  style={{
                    fontSize: '2cqw',
                    color: index === 0 ? accent : 'rgb(255 255 255 / 0.88)',
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <svg
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            className="mt-[1.8cqw] h-[30%] w-full"
          >
            <path
              d="M0 50 C 18 46, 30 28, 46 27 S 78 40, 94 32 S 128 10, 146 15 S 178 6, 200 3"
              fill="none"
              stroke={accent}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M0 50 C 18 46, 30 28, 46 27 S 78 40, 94 32 S 128 10, 146 15 S 178 6, 200 3 L 200 60 L 0 60 Z"
              fill={accent}
              opacity="0.13"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Maison Levant — restaurant ─────────────────────────────────────────── */

const BOOKING = [
  { label: 'Date', value: 'Fri 14 Mar' },
  { label: 'Guests', value: 'Two' },
  { label: 'Time', value: '7:30 pm' },
];

function HospitalityVisual({ accent, name }: VisualProps) {
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(75% 65% at 50% 8%, ${accent}2e, transparent 68%), radial-gradient(60% 50% at 12% 100%, ${accent}1c, transparent 70%)`,
        }}
      />

      <div className="relative flex h-full flex-col p-[3.6cqw]">
        <div className="flex items-center justify-between">
          <span
            className="uppercase tracking-[0.24em] text-white/45"
            style={{ fontSize: '1.35cqw' }}
          >
            Menu
          </span>
          <span
            className="rounded-full px-[2cqw] py-[0.9cqw] font-medium leading-none"
            style={{
              fontSize: '1.45cqw',
              border: `1px solid ${accent}66`,
              color: accent,
            }}
          >
            Reserve
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span
            className="uppercase tracking-[0.3em]"
            style={{ fontSize: '1.3cqw', color: accent, opacity: 0.85 }}
          >
            {name}
          </span>
          <div
            className="mt-[2cqw] font-semibold leading-[1.1] tracking-[-0.035em] text-white/92"
            style={{ fontSize: '4.6cqw' }}
          >
            A table by
            <br />
            the water.
          </div>
          <div
            className="mt-[1.6cqw] text-white/38"
            style={{ fontSize: '1.5cqw' }}
          >
            Dinner, Tuesday to Sunday
          </div>
        </div>

        {/* Booking bar — permanently reachable, which is the whole point. */}
        <div
          className={cn(surface, 'flex items-center gap-[2cqw] p-[1.5cqw]')}
          style={{ background: '#ffffff09' }}
        >
          {BOOKING.map((field, index) => (
            <div key={field.label} className="flex items-center gap-[2cqw]">
              {index > 0 && <div className="h-[3cqw] w-px bg-white/10" />}
              <div>
                <div className="text-white/35" style={{ fontSize: '1.15cqw' }}>
                  {field.label}
                </div>
                <div
                  className="font-medium text-white/80"
                  style={{ fontSize: '1.45cqw' }}
                >
                  {field.value}
                </div>
              </div>
            </div>
          ))}
          <span
            className="ml-auto rounded-full px-[2.4cqw] py-[1.1cqw] font-medium leading-none text-[#1a1206]"
            style={{ fontSize: '1.45cqw', background: accent }}
          >
            Book
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Northbeam — B2B services ───────────────────────────────────────────── */

const SERVICES = [
  { name: 'Strategy & operations', meta: 'Advisory' },
  { name: 'Financial modelling', meta: 'Analysis' },
  { name: 'Market entry', meta: 'Research' },
];

function BusinessVisual({ accent, name }: VisualProps) {
  return (
    <div className="flex h-full flex-col p-[3.6cqw]">
      <Nav accent={accent} name={name} links={['Services', 'About']} cta="Talk to us" />

      {/* flex-1 so this row absorbs the leftover height. Without it the row
          took its natural height and `mt-auto` on the footer shoved the
          remainder into one dead gap in the middle of the card. */}
      <div className="mt-[4cqw] flex flex-1 items-center gap-[3.5cqw]">
        <div className="flex w-[48%] flex-col justify-center">
          <div
            className="font-semibold leading-[1.14] tracking-[-0.035em] text-white/90"
            style={{ fontSize: '3.4cqw' }}
          >
            Advice that holds
            <br />
            up in the room.
          </div>
          <div
            className="mt-[1.6cqw] leading-[1.5] text-white/38"
            style={{ fontSize: '1.5cqw' }}
          >
            Independent counsel for teams
            <br />
            making decisions that stick.
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[1.2cqw]">
          {SERVICES.map((service) => (
            <div
              key={service.name}
              className={cn(surface, 'flex items-center gap-[1.5cqw] p-[1.5cqw]')}
            >
              <div
                className="size-[2.4cqw] shrink-0 rounded-[0.6cqw]"
                style={{ background: `${accent}44` }}
              />
              <div className="min-w-0 flex-1">
                <div
                  className="truncate font-medium text-white/80"
                  style={{ fontSize: '1.5cqw' }}
                >
                  {service.name}
                </div>
                <div className="text-white/32" style={{ fontSize: '1.25cqw' }}>
                  {service.meta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer row. This used to be a "Trusted by" label followed by four grey
          bars standing in for logos — which read as a skeleton loader, the one
          thing these previews must never look like, and hinted at clients that
          don't exist. Real words about the fictional firm instead: it reads as
          a finished page and claims nothing. */}
      <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-[2.2cqw]">
        <span
          className="uppercase tracking-[0.18em] text-white/30"
          style={{ fontSize: '1.15cqw' }}
        >
          Offices in Chicago & Toronto
        </span>
        <span
          className="font-medium"
          style={{ fontSize: '1.35cqw', color: accent, opacity: 0.85 }}
        >
          Book a consultation →
        </span>
      </div>
    </div>
  );
}

/* ── Westgate Health — clinic ───────────────────────────────────────────── */

const CARE = [
  { name: 'Family medicine', note: 'Same-week appointments' },
  { name: 'Physiotherapy', note: 'Referral not required' },
];

function HealthcareVisual({ accent, name }: VisualProps) {
  return (
    <div className="flex h-full flex-col p-[3.6cqw]">
      <Nav accent={accent} name={name} links={['Care', 'Team']} cta="Book" />

      <div className="mt-[4cqw] flex flex-1 items-center gap-[3.2cqw]">
        <div className="flex w-[52%] flex-col">
          <div
            className="font-semibold leading-[1.14] tracking-[-0.035em] text-white/90"
            style={{ fontSize: '3.4cqw' }}
          >
            Care that starts
            <br />
            with listening.
          </div>
          <div
            className="mt-[1.6cqw] leading-[1.5] text-white/38"
            style={{ fontSize: '1.5cqw' }}
          >
            A family practice in the west end,
            <br />
            accepting new patients.
          </div>
          <span
            className="mt-[2.2cqw] w-fit rounded-full px-[2.4cqw] py-[1.1cqw] font-medium leading-none text-[#04231f]"
            style={{ fontSize: '1.5cqw', background: accent }}
          >
            Book an appointment
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-[1.3cqw]">
          {CARE.map((item) => (
            <div key={item.name} className={cn(surface, 'p-[1.6cqw]')}>
              <div
                className="truncate font-medium text-white/82"
                style={{ fontSize: '1.5cqw' }}
              >
                {item.name}
              </div>
              <div className="text-white/34" style={{ fontSize: '1.25cqw' }}>
                {item.note}
              </div>
            </div>
          ))}
          <div
            className={cn(surface, 'flex items-center justify-between p-[1.6cqw]')}
            style={{ background: `${accent}14` }}
          >
            <span className="text-white/60" style={{ fontSize: '1.3cqw' }}>
              Next available
            </span>
            <span
              className="font-medium"
              style={{ fontSize: '1.4cqw', color: accent }}
            >
              Tomorrow
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Switch ─────────────────────────────────────────────────────────────── */

const visuals: Record<ProjectVisualKind, (props: VisualProps) => React.JSX.Element> = {
  editorial: EditorialVisual,
  product: ProductVisual,
  hospitality: HospitalityVisual,
  business: BusinessVisual,
  healthcare: HealthcareVisual,
};

export function ProjectVisual({
  kind,
  accent,
  name,
  className,
}: {
  kind: ProjectVisualKind;
  accent: string;
  name: string;
  className?: string;
}) {
  const Visual = visuals[kind];

  return (
    <div
      className={cn('relative size-full bg-[#050810]', className)}
      style={{ containerType: 'inline-size' }}
      aria-hidden="true"
    >
      <Visual accent={accent} name={name} />
    </div>
  );
}
