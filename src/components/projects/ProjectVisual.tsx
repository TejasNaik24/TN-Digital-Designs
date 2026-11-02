import '@/styles/demo-fonts.css';
import { cn } from '@/lib/cn';
import { brands, GYM_BODY_FONT, type DemoSlug } from '@/demos/brands';

/**
 * Project previews: miniatures of each concept's real homepage, drawn in DOM
 * so they stay sharp at any size and need no screenshots to go stale.
 *
 * Each one uses its business's own palette and typeface from `demos/brands`,
 * the same tokens the full demo site uses — so the card, the hero mockup and
 * the live site always agree.
 *
 * Copy is REAL TEXT, not grey placeholder bars (bars read as a skeleton loader
 * — an unfinished mockup). Everything is sized in `cqw`, so one component works
 * as a full card and as a tiny tile inside the hero device.
 */

/* ── Ferro — restaurant ─────────────────────────────────────────────────── */

const MENU = [
  ['Charred leeks, hazelnut', '11'],
  ['Whipped ricotta, chili honey', '12'],
  ['Wood-fire flatbread, nduja', '14'],
  ['Pici, brown butter, sage', '19'],
  ['Tagliatelle, pork ragù', '23'],
  ['Half chicken, salsa verde', '27'],
];

function RestaurantVisual() {
  const b = brands.restaurant;
  const c = b.colors;
  return (
    <div className="flex h-full flex-col p-[4.2cqw]" style={{ background: c.ground, color: c.ink, fontFamily: b.font }}>
      <div className="flex items-center justify-between" style={{ fontSize: '1.7cqw' }}>
        <span className="font-bold" style={{ fontSize: '2.3cqw', fontStretch: '75%' }}>
          {b.name}
        </span>
        <div className="flex items-center gap-[2.2cqw]" style={{ color: c.muted }}>
          <span>Menu</span>
          <span>Visit</span>
          <span
            className="rounded-full px-[2cqw] py-[0.8cqw] font-semibold"
            style={{ background: c.accent, color: c.onAccent }}
          >
            Book a table
          </span>
        </div>
      </div>

      <div className="mt-[4cqw] flex flex-1 gap-[4cqw]">
        <div className="flex w-[52%] flex-col justify-between">
          <div
            className="font-extrabold leading-[0.88] tracking-[-0.02em]"
            style={{ fontSize: '9cqw', fontStretch: '75%' }}
          >
            Fire,
            <br />
            bread,
            <br />
            company.
          </div>
          <div className="flex items-center gap-[1.2cqw]" style={{ fontSize: '1.6cqw' }}>
            <span className="size-[1.2cqw] rounded-full" style={{ background: '#3f8a3a' }} />
            <span className="font-semibold">Open now</span>
            <span style={{ color: c.muted }}>until 10 pm</span>
          </div>
        </div>

        <div
          className="flex flex-1 flex-col rounded-[1.4cqw] p-[2.6cqw]"
          style={{ background: c.surface, border: `1px solid ${c.line}` }}
        >
          <div className="font-bold" style={{ fontSize: '2cqw', fontStretch: '80%' }}>
            Tonight
          </div>
          <div className="mt-[1.6cqw] flex flex-col gap-[1.4cqw]">
            {MENU.map(([dish, price]) => (
              <div key={dish} className="flex items-baseline gap-[1cqw]" style={{ fontSize: '1.55cqw' }}>
                <span className="truncate">{dish}</span>
                <span className="flex-1 border-b border-dotted" style={{ borderColor: c.line }} />
                <span className="font-semibold">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Northgate — dental clinic ──────────────────────────────────────────── */

function ClinicVisual() {
  const b = brands.clinic;
  const c = b.colors;
  return (
    <div className="flex h-full flex-col p-[4.2cqw]" style={{ background: c.ground, color: c.ink, fontFamily: b.font }}>
      <div className="flex items-center justify-between" style={{ fontSize: '1.65cqw' }}>
        <span className="flex items-center gap-[1cqw] font-bold" style={{ fontSize: '2.1cqw' }}>
          <span className="size-[2.3cqw] rounded-full" style={{ background: c.accent }} />
          {b.name}
        </span>
        <div className="flex items-center gap-[2.2cqw]" style={{ color: c.muted }}>
          <span>Services</span>
          <span>Team</span>
          <span
            className="rounded-[1cqw] px-[2cqw] py-[0.8cqw] font-semibold"
            style={{ background: c.accent, color: c.onAccent }}
          >
            Book a visit
          </span>
        </div>
      </div>

      <div className="mt-[5cqw] flex flex-1 gap-[4cqw]">
        <div className="w-[50%]">
          <div className="font-semibold leading-[1.08] tracking-[-0.02em]" style={{ fontSize: '4.6cqw' }}>
            A dentist you won’t dread visiting.
          </div>
          <div className="mt-[1.8cqw] leading-[1.5]" style={{ fontSize: '1.6cqw', color: c.muted }}>
            Same-week appointments, clear prices, and a team that explains everything first.
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[1.4cqw] rounded-[1.6cqw] p-[2.4cqw]" style={{ background: c.surface }}>
          <div className="font-semibold" style={{ fontSize: '1.7cqw' }}>
            Request a visit
          </div>
          {['Cleaning & check-up', 'Tue 14 · 9:30 am'].map((value) => (
            <div
              key={value}
              className="rounded-[1cqw] bg-white px-[1.6cqw] py-[1.1cqw]"
              style={{ fontSize: '1.45cqw', border: `1px solid ${c.line}` }}
            >
              {value}
            </div>
          ))}
          <div
            className="mt-auto rounded-[1cqw] py-[1.1cqw] text-center font-semibold"
            style={{ fontSize: '1.5cqw', background: c.accent, color: c.onAccent }}
          >
            Continue
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Groundwork — gym ───────────────────────────────────────────────────── */

const SLOTS = [
  ['6:00', 'Strength', true],
  ['7:15', 'Conditioning', false],
  ['12:00', 'Mobility', false],
  ['18:00', 'Strength', true],
] as const;

function GymVisual() {
  const b = brands.gym;
  const c = b.colors;
  return (
    <div className="flex h-full flex-col p-[4.2cqw]" style={{ background: c.ground, color: c.ink, fontFamily: GYM_BODY_FONT }}>
      <div className="flex items-center justify-between" style={{ fontSize: '1.6cqw' }}>
        <span className="font-extrabold uppercase" style={{ fontSize: '2.6cqw', fontFamily: b.font }}>
          {b.name}
        </span>
        <div className="flex items-center gap-[2.2cqw]" style={{ color: c.muted }}>
          <span>Schedule</span>
          <span>Pricing</span>
          <span
            className="px-[2cqw] py-[0.8cqw] font-bold"
            style={{ background: c.accent, color: c.onAccent }}
          >
            Free trial
          </span>
        </div>
      </div>

      <div className="mt-[3.5cqw] flex flex-1 gap-[4cqw]">
        <div
          className="w-[48%] font-black uppercase leading-[0.86]"
          style={{ fontSize: '10cqw', fontFamily: b.font }}
        >
          Get
          <br />
          strong
          <br />
          <span className="mt-[0.8cqw] inline-block px-[0.8cqw] leading-[0.92]" style={{ background: c.accent }}>
            here.
          </span>
        </div>

        <div className="flex flex-1 flex-col" style={{ fontSize: '1.55cqw' }}>
          <div className="font-extrabold uppercase" style={{ fontSize: '2.3cqw', fontFamily: b.font }}>
            Today
          </div>
          {SLOTS.map(([time, name, full]) => (
            <div
              key={time}
              className="flex items-center gap-[1.6cqw] py-[1.1cqw]"
              style={{ borderTop: `1px solid ${c.line}` }}
            >
              <span className="w-[6cqw] font-bold tabular-nums">{time}</span>
              <span className="flex-1">{name}</span>
              <span style={{ color: c.muted }}>{full ? 'Waitlist' : 'Open'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Switch ─────────────────────────────────────────────────────────────── */

const visuals: Record<DemoSlug, () => React.JSX.Element> = {
  restaurant: RestaurantVisual,
  clinic: ClinicVisual,
  gym: GymVisual,
};

export function ProjectVisual({ kind, className }: { kind: DemoSlug; className?: string }) {
  const Visual = visuals[kind];

  return (
    <div
      className={cn('relative size-full overflow-hidden', className)}
      style={{ containerType: 'inline-size' }}
      aria-hidden="true"
    >
      <Visual />
    </div>
  );
}
