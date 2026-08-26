import { ScreenSurface, T, Pill, type ScreenProps } from './shared';

/**
 * Monument — a small luxury hotel.
 *
 * Warm neutrals against a low dark ground, so the amber accent reads as
 * candlelight rather than as a highlighter. The design argument is that
 * atmosphere and utility are not actually in conflict: the imagery stays
 * full-bleed and the pacing stays unhurried, while booking stays reachable at
 * every scroll position.
 *
 * No invented reviews, occupancy figures, or awards anywhere.
 */

const INK = '#12100d';
const UMBER = '#241f18';
const LINEN = '#e8e2d8';
const SAND = 'rgb(169 158 141 / 0.9)';
const RULE = 'rgb(232 226 216 / 0.13)';

/** A warm image plate — light through a window, not a grey rectangle. */
function Plate({
  accent,
  height,
  tone = 0.3,
  at = '35% 20%',
  children,
}: {
  accent: string;
  height: string;
  tone?: number;
  at?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height, background: UMBER }}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 70% at ${at}, ${accent}${Math.round(tone * 255)
            .toString(16)
            .padStart(2, '0')}, transparent 72%), linear-gradient(180deg, rgb(255 240 220 / 0.06), transparent 55%)`,
        }}
      />
      {children}
    </div>
  );
}

function Nav({ accent }: ScreenProps) {
  return (
    <div className="flex items-center justify-between px-[3.6cqw] py-[2.4cqw]">
      <T size={2} className="font-semibold uppercase tracking-[0.28em]" style={{ color: LINEN }}>
        Monument
      </T>
      <div className="flex items-center gap-[2.6cqw]">
        {['Rooms', 'Dining', 'The house'].map((link) => (
          <T key={link} size={1.35} style={{ color: SAND }}>{link}</T>
        ))}
        <Pill size={1.3} border={`${accent}88`} color={accent}>Reserve</Pill>
      </div>
    </div>
  );
}

/** The persistent booking bar — the whole thesis of the concept. */
function BookingBar({ accent, compact = false }: ScreenProps & { compact?: boolean }) {
  const fields = [
    ['Arrive', 'Fri 14 Mar'],
    ['Depart', 'Sun 16 Mar'],
    ['Guests', 'Two'],
  ];

  return (
    <div
      className="flex items-center gap-[2.4cqw] rounded-[1.2cqw] border px-[2cqw] py-[1.5cqw]"
      style={{ borderColor: RULE, background: 'rgb(18 16 13 / 0.86)' }}
    >
      {fields.map(([label, value], index) => (
        <div key={label} className="flex items-center gap-[2.4cqw]">
          {index > 0 && <div className="h-[3cqw] w-px" style={{ background: RULE }} />}
          <div>
            <T size={compact ? 1.05 : 1.15} style={{ color: SAND }}>{label}</T>
            <T size={compact ? 1.3 : 1.45} className="mt-[0.3cqw] font-medium" style={{ color: LINEN }}>
              {value}
            </T>
          </div>
        </div>
      ))}
      <span
        className="ml-auto shrink-0 rounded-full px-[2.6cqw] py-[1.2cqw] font-medium leading-none"
        style={{ fontSize: '1.4cqw', background: accent, color: '#1a1206' }}
      >
        Check availability
      </span>
    </div>
  );
}

function Home({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={INK}>
      <div className="flex h-full flex-col">
        <Nav accent={accent} />

        <div className="relative flex-1">
          <Plate accent={accent} height="100%" tone={0.34} at="30% 15%" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <T size={1.2} className="uppercase tracking-[0.34em]" style={{ color: accent }}>
              Est. 1908 · Lisbon
            </T>
            <T size={5.2} className="mt-[2cqw] font-semibold tracking-[-0.035em]" style={{ color: LINEN }}>
              A house that keeps
            </T>
            <T size={5.2} className="font-semibold tracking-[-0.035em]" style={{ color: LINEN }}>
              its own hours.
            </T>
            <T size={1.45} className="mt-[1.8cqw]" style={{ color: SAND }}>
              Fourteen rooms above the river.
            </T>
          </div>
        </div>

        <div className="px-[3.6cqw] pb-[2.4cqw] pt-[2cqw]">
          <BookingBar accent={accent} />
        </div>
      </div>
    </ScreenSurface>
  );
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function Booking({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={INK}>
      <div className="flex h-full flex-col">
        <Nav accent={accent} />

        <div className="grid flex-1 grid-cols-[46%_1fr] gap-[3cqw] px-[3.6cqw] py-[2.4cqw]">
          <div>
            <T size={1.15} className="uppercase tracking-[0.28em]" style={{ color: accent }}>
              Reserve
            </T>
            <T size={3.2} className="mt-[1.4cqw] font-semibold tracking-[-0.03em]" style={{ color: LINEN }}>
              March 2026
            </T>

            {/* Availability shown inline, so nobody discovers a sold-out night
                three steps into a form. */}
            <div className="mt-[2.4cqw] grid grid-cols-7 gap-[0.8cqw]">
              {DAYS.map((day, index) => (
                <T key={index} size={1.05} className="text-center" style={{ color: SAND }}>
                  {day}
                </T>
              ))}
              {Array.from({ length: 28 }).map((_, index) => {
                const date = index + 1;
                const selected = date >= 14 && date <= 16;
                const unavailable = [4, 5, 11, 22, 23].includes(date);
                return (
                  <div
                    key={date}
                    className="grid place-items-center rounded-[0.5cqw]"
                    style={{
                      aspectRatio: '1',
                      fontSize: '1.15cqw',
                      background: selected ? accent : undefined,
                      color: selected
                        ? '#1a1206'
                        : unavailable
                          ? 'rgb(169 158 141 / 0.3)'
                          : LINEN,
                      textDecoration: unavailable ? 'line-through' : undefined,
                    }}
                  >
                    {date}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-[1.4cqw]">
            {[
              ['Garden Room', 'Two nights · from €280'],
              ['River Suite', 'Two nights · from €420'],
              ['The Tower', 'Two nights · from €610'],
            ].map(([name, detail], index) => (
              <div
                key={name}
                className="flex items-center gap-[1.6cqw] rounded-[1cqw] border p-[1.4cqw]"
                style={{
                  borderColor: index === 1 ? `${accent}66` : RULE,
                  background: index === 1 ? `${accent}12` : UMBER,
                }}
              >
                <Plate accent={accent} height="7cqw" tone={0.26} />
                <div className="min-w-0 flex-1">
                  <T size={1.5} className="font-medium" style={{ color: LINEN }}>{name}</T>
                  <T size={1.2} className="mt-[0.4cqw]" style={{ color: SAND }}>{detail}</T>
                </div>
                <T size={1.25} className="shrink-0" style={{ color: accent }}>Select</T>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenSurface>
  );
}

function Rooms({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={INK}>
      <div className="flex h-full flex-col">
        <Nav accent={accent} />

        <div className="px-[3.6cqw] pt-[1.6cqw]">
          <T size={3.4} className="font-semibold tracking-[-0.035em]" style={{ color: LINEN }}>
            Fourteen rooms.
          </T>
          <T size={1.4} className="mt-[0.9cqw]" style={{ color: SAND }}>
            No two are the same shape.
          </T>
        </div>

        <div className="mt-[2.4cqw] grid flex-1 grid-cols-3 gap-[1.8cqw] px-[3.6cqw] pb-[2.4cqw]">
          {[
            ['Garden Room', '28 m² · Courtyard'],
            ['River Suite', '46 m² · Balcony'],
            ['The Tower', '52 m² · Terrace'],
          ].map(([name, meta], index) => (
            <div
              key={name}
              className="flex flex-col overflow-hidden rounded-[1.2cqw] border"
              style={{ borderColor: RULE, background: UMBER }}
            >
              <Plate
                accent={accent}
                height="16cqw"
                tone={0.22 + index * 0.06}
                at={`${30 + index * 18}% 22%`}
              />
              <div className="p-[1.5cqw]">
                <T size={1.6} className="font-medium" style={{ color: LINEN }}>{name}</T>
                <T size={1.2} className="mt-[0.5cqw]" style={{ color: SAND }}>{meta}</T>
                <div className="mt-[1.2cqw] flex items-center justify-between border-t pt-[1.1cqw]" style={{ borderColor: RULE }}>
                  <T size={1.25} style={{ color: LINEN }}>from €280</T>
                  <T size={1.2} style={{ color: accent }}>Reserve →</T>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenSurface>
  );
}

function Dining({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={INK}>
      <div className="flex h-full flex-col">
        <Nav accent={accent} />

        <div className="grid flex-1 grid-cols-[44%_1fr]">
          <div className="flex flex-col justify-center px-[3.6cqw]">
            <T size={1.15} className="uppercase tracking-[0.3em]" style={{ color: accent }}>
              The dining room
            </T>
            <T size={3.6} className="mt-[1.6cqw] font-semibold tracking-[-0.035em]" style={{ color: LINEN }}>
              Dinner, Tuesday
            </T>
            <T size={3.6} className="font-semibold tracking-[-0.035em]" style={{ color: LINEN }}>
              to Sunday.
            </T>
            <T size={1.4} className="mt-[1.6cqw] leading-[1.55]" style={{ color: SAND }}>
              One menu each evening, written after
              <br />
              the morning market.
            </T>

            <div className="mt-[2.2cqw] flex flex-col gap-[1cqw]">
              {[
                ['First', 'Grilled sardine, fennel, lemon'],
                ['Second', 'Braised pork, quince, mustard'],
                ['To finish', 'Burnt honey tart'],
              ].map(([course, dish]) => (
                <div key={course} className="border-b pb-[1cqw]" style={{ borderColor: RULE }}>
                  <T size={1.05} className="uppercase tracking-[0.2em]" style={{ color: SAND }}>
                    {course}
                  </T>
                  <T size={1.4} className="mt-[0.4cqw]" style={{ color: LINEN }}>{dish}</T>
                </div>
              ))}
            </div>

            <span
              className="mt-[2cqw] w-fit rounded-full px-[2.6cqw] py-[1.2cqw] font-medium leading-none"
              style={{ fontSize: '1.4cqw', background: accent, color: '#1a1206' }}
            >
              Book a table
            </span>
          </div>

          <Plate accent={accent} height="100%" tone={0.3} at="55% 30%" />
        </div>
      </div>
    </ScreenSurface>
  );
}

function Mobile({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={INK} ratio="9 / 17">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-[5cqw] py-[4cqw]">
          <T size={4} className="font-semibold uppercase tracking-[0.26em]" style={{ color: LINEN }}>
            Monument
          </T>
          <div className="flex flex-col gap-[1.1cqw]">
            <span className="h-px w-[5.5cqw]" style={{ background: SAND }} />
            <span className="h-px w-[5.5cqw]" style={{ background: SAND }} />
          </div>
        </div>

        <div className="relative flex-1">
          <Plate accent={accent} height="100%" tone={0.32} at="35% 20%" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[6cqw] text-center">
            <T size={3} className="uppercase tracking-[0.3em]" style={{ color: accent }}>
              Lisbon
            </T>
            <T size={9.5} className="mt-[3cqw] font-semibold tracking-[-0.035em]" style={{ color: LINEN }}>
              A house that
            </T>
            <T size={9.5} className="font-semibold tracking-[-0.035em]" style={{ color: LINEN }}>
              keeps its own
            </T>
            <T size={9.5} className="font-semibold tracking-[-0.035em]" style={{ color: LINEN }}>
              hours.
            </T>
          </div>
        </div>

        {/* The desktop booking bar becomes a docked sheet. */}
        <div
          className="rounded-t-[3.4cqw] border-t px-[5cqw] pb-[5cqw] pt-[3.4cqw]"
          style={{ borderColor: RULE, background: 'rgb(18 16 13 / 0.96)' }}
        >
          <span
            className="mx-auto block rounded-full"
            style={{ width: '12cqw', height: '0.9cqw', background: 'rgb(232 226 216 / 0.24)' }}
          />
          <div className="mt-[3.4cqw] flex items-center justify-between">
            <div>
              <T size={2.8} style={{ color: SAND }}>Arrive</T>
              <T size={3.8} className="mt-[0.8cqw] font-medium" style={{ color: LINEN }}>
                Fri 14 Mar
              </T>
            </div>
            <div className="h-[8cqw] w-px" style={{ background: RULE }} />
            <div>
              <T size={2.8} style={{ color: SAND }}>Guests</T>
              <T size={3.8} className="mt-[0.8cqw] font-medium" style={{ color: LINEN }}>
                Two
              </T>
            </div>
          </div>
          <div
            className="mt-[3.4cqw] grid place-items-center rounded-full py-[3.4cqw] font-medium"
            style={{ fontSize: '3.6cqw', background: accent, color: '#1a1206' }}
          >
            Check availability
          </div>
        </div>
      </div>
    </ScreenSurface>
  );
}

export const monumentScreens = {
  home: Home,
  booking: Booking,
  rooms: Rooms,
  dining: Dining,
  mobile: Mobile,
};
