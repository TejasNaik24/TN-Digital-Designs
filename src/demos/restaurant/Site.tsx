import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Minus, Plus } from 'lucide-react';
import { brands } from '../brands';
import {
  anchor,
  brandVars,
  ConceptConfirmation,
  dayLabel,
  DemoField,
  looksLikeEmail,
  upcomingDays,
} from '../shared';
import {
  formatMinutes,
  fullSeatings,
  hours,
  isClosedDay,
  menus,
  openStatus,
  seatings,
  type MenuId,
} from './data';
import { cn } from '@/lib/cn';

const brand = brands.restaurant;
/** Bricolage's width axis — 75% is the narrow, menu-board cut. */
const narrow = { fontStretch: '75%' } as const;

/* ── Header ─────────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--d-line)] bg-[var(--d-ground)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a {...anchor('ferro-top')} className="inline-flex min-h-11 items-center text-[1.75rem] font-extrabold leading-none" style={narrow}>
          Ferro
        </a>
        <nav aria-label="Ferro" className="flex items-center gap-1 sm:gap-2">
          <a {...anchor('menu')} className="hidden min-h-11 items-center px-3 font-medium sm:inline-flex">
            Menu
          </a>
          <a {...anchor('visit')} className="hidden min-h-11 items-center px-3 font-medium sm:inline-flex">
            Visit
          </a>
          <a
            {...anchor('reserve')}
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--d-accent)] px-5 font-semibold text-[var(--d-on-accent)]"
          >
            Book a table
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

function useOpenStatus() {
  const [status, setStatus] = useState(() => openStatus());
  useEffect(() => {
    const timer = window.setInterval(() => setStatus(openStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return status;
}

function Hero() {
  const status = useOpenStatus();
  return (
    <section id="ferro-top" aria-labelledby="ferro-title" className="scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.35fr_1fr] md:items-end md:pt-20">
        <h1
          id="ferro-title"
          className="text-[clamp(4.25rem,15vw,10.5rem)] font-extrabold leading-[0.84] tracking-[-0.02em]"
          style={narrow}
        >
          Fire, bread,
          <br />
          company.
        </h1>

        <div className="flex flex-col gap-6 md:pb-4">
          <p className="max-w-sm text-lg leading-relaxed">
            A neighbourhood kitchen on Elm Street. Everything goes through the wood oven or
            the pasta table, and the menu follows what’s good this week.
          </p>
          <p className="flex items-center gap-2.5 font-semibold" aria-live="polite">
            <span
              aria-hidden="true"
              className={cn('size-2.5 rounded-full', status.open ? 'bg-[#2f7a2b]' : 'bg-[var(--d-muted)]')}
            />
            {status.text}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              {...anchor('reserve')}
              className="inline-flex min-h-12 items-center rounded-full bg-[var(--d-accent)] px-6 font-semibold text-[var(--d-on-accent)]"
            >
              Book a table
            </a>
            <a
              {...anchor('menu')}
              className="inline-flex min-h-12 items-center rounded-full border border-[var(--d-ink)] px-6 font-semibold"
            >
              See the menu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Menu ───────────────────────────────────────────────────────────────── */

const menuOrder: MenuId[] = ['dinner', 'lunch', 'drinks'];

function Menu() {
  const [active, setActive] = useState<MenuId>('dinner');
  const tabs = useRef<Record<MenuId, HTMLButtonElement | null>>({ dinner: null, lunch: null, drinks: null });
  const menu = menus[active];

  /** Arrow keys move between tabs, per the WAI-ARIA tabs pattern. */
  const onKeyDown = (event: KeyboardEvent) => {
    const index = menuOrder.indexOf(active);
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = menuOrder[(index + step + menuOrder.length) % menuOrder.length] ?? 'dinner';
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="scroll-mt-16 border-y border-[var(--d-line)] bg-[var(--d-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="menu-title" className="text-6xl font-extrabold leading-none md:text-7xl" style={narrow}>
            The menu
          </h2>
          <div role="tablist" aria-label="Menus" onKeyDown={onKeyDown} className="flex gap-2">
            {menuOrder.map((id) => (
              <button
                key={id}
                ref={(node) => {
                  tabs.current[id] = node;
                }}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={active === id}
                aria-controls="menu-panel"
                tabIndex={active === id ? 0 : -1}
                onClick={() => setActive(id)}
                className={cn(
                  'min-h-11 rounded-full border px-5 font-semibold transition-colors',
                  active === id
                    ? 'border-[var(--d-ink)] bg-[var(--d-ink)] text-[var(--d-ground)]'
                    : 'border-[var(--d-line)] hover:border-[var(--d-ink)]',
                )}
              >
                {menus[id].label}
              </button>
            ))}
          </div>
        </div>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${active}`} tabIndex={0} className="mt-12">
          <p className="text-[var(--d-muted)]">{menu.note}</p>
          <div className="mt-8 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {menu.groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-3xl font-bold" style={narrow}>
                  {group.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-5">
                  {group.dishes.map((dish) => (
                    <li key={dish.name}>
                      <div className="flex items-baseline gap-3">
                        <span className="text-lg font-semibold">{dish.name}</span>
                        {dish.tags && (
                          <span className="text-xs font-semibold text-[var(--d-muted)]">
                            {dish.tags.join(' ')}
                          </span>
                        )}
                        <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-0.3em] border-b-2 border-dotted border-[var(--d-line)]" />
                        <span className="text-lg font-semibold tabular-nums">
                          <span className="sr-only">$</span>
                          {dish.price}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[var(--d-muted)]">{dish.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-12 text-sm text-[var(--d-muted)]">
            V vegetarian, GF gluten-free. Tell us about allergies when you book — the kitchen can adapt most dishes.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Visit ──────────────────────────────────────────────────────────────── */

function Visit() {
  const today = new Date().getDay();
  // Monday-first reads more naturally for opening hours.
  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <h2 id="visit-title" className="text-6xl font-extrabold leading-none md:text-7xl" style={narrow}>
            Visit
          </h2>
          <address className="mt-8 text-lg not-italic leading-relaxed">
            214 Elm Street
            <br />
            Riverside
          </address>
          <p className="mt-4 text-lg">(555) 014-2290</p>
          <p className="mt-6 max-w-sm leading-relaxed text-[var(--d-muted)]">
            Walk-ins welcome at the bar. Tables for six or more, call us — we’ll push some together.
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold" style={narrow}>
            Hours
          </h3>
          <dl className="mt-5 divide-y divide-[var(--d-line)] border-y border-[var(--d-line)]">
            {order.map((index) => {
              const day = hours[index];
              if (!day) return null;
              const isToday = index === today;
              return (
                <div
                  key={day.day}
                  className={cn('flex justify-between gap-6 py-3', isToday && 'font-semibold')}
                >
                  <dt>
                    {day.day}
                    {isToday && <span className="ml-2 text-sm text-[var(--d-accent)]">Today</span>}
                  </dt>
                  <dd className="text-right tabular-nums">
                    {day.sessions.length === 0
                      ? 'Closed'
                      : day.sessions.map(([open, close]) => `${formatMinutes(open)} – ${formatMinutes(close)}`).join(', ')}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ── Reserve ────────────────────────────────────────────────────────────── */

type Booking = { day: Date | null; party: number; time: string; name: string; contact: string; note: string };
type BookingErrors = Partial<Record<'day' | 'time' | 'name' | 'contact', string>>;

function Reserve() {
  const days = useMemo(() => upcomingDays(14, isClosedDay), []);
  const [booking, setBooking] = useState<Booking>({ day: null, party: 2, time: '', name: '', contact: '', note: '' });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [confirmed, setConfirmed] = useState(false);
  const full = useMemo(() => (booking.day ? fullSeatings(booking.day) : new Set<string>()), [booking.day]);

  const update = <K extends keyof Booking>(key: K, value: Booking[K]) => {
    setBooking((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found: BookingErrors = {};
    if (!booking.day) found.day = 'Pick a date.';
    if (!booking.time) found.time = 'Pick a time.';
    if (!booking.name.trim()) found.name = 'Add a name for the booking.';
    const contact = booking.contact.trim();
    if (!contact) found.contact = 'Add an email or phone number so we can confirm.';
    else if (contact.includes('@') && !looksLikeEmail(contact)) found.contact = 'That email address looks incomplete.';
    setErrors(found);
    if (Object.keys(found).length === 0) setConfirmed(true);
  };

  return (
    <section id="reserve" aria-labelledby="reserve-title" className="scroll-mt-16 bg-[var(--d-ink)] text-[var(--d-ground)]">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:py-24">
        <div>
          <h2 id="reserve-title" className="text-6xl font-extrabold leading-none md:text-7xl" style={narrow}>
            Book a table
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed opacity-85">
            Dinner bookings up to two weeks ahead. We hold tables for 15 minutes.
          </p>
        </div>

        {/* The form sits on a light card so it inherits the normal field styles
            and contrast, rather than restyling every control for a dark ground. */}
        <div
          className="rounded-2xl bg-[var(--d-surface)] p-5 text-[var(--d-ink)] sm:p-8"
          style={{ '--focus-ring': brand.colors.ink } as React.CSSProperties}
        >
          {confirmed && booking.day ? (
            <ConceptConfirmation
              title="Request received"
              resetLabel="Make another request"
              onReset={() => {
                setConfirmed(false);
                setBooking({ day: null, party: 2, time: '', name: '', contact: '', note: '' });
              }}
            >
              {booking.name.split(' ')[0]}, a table for {booking.party} on {dayLabel(booking.day)} at{' '}
              {booking.time} pm. Ferro would normally confirm by message within the hour.
            </ConceptConfirmation>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-7">
              <fieldset className="min-w-0">
                <legend className="text-sm font-semibold">Date</legend>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {days.map((day) => {
                    const selected = booking.day?.toDateString() === day.toDateString();
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          update('day', day);
                          update('time', '');
                        }}
                        className={cn(
                          'flex min-h-16 min-w-16 shrink-0 flex-col items-center justify-center rounded-xl border px-2 text-sm',
                          selected
                            ? 'border-[var(--d-ink)] bg-[var(--d-ink)] text-[var(--d-ground)]'
                            : 'border-[var(--d-line)] bg-white hover:border-[var(--d-ink)]',
                        )}
                      >
                        <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-lg font-bold">{day.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.day && (
                  <p role="alert" className="mt-2 text-sm font-medium text-[#b42318]">
                    {errors.day}
                  </p>
                )}
                <p className="mt-2 text-sm text-[var(--d-muted)]">Closed Mondays.</p>
              </fieldset>

              <div className="flex items-center justify-between gap-4">
                <span id="party-label" className="text-sm font-semibold">
                  Party size
                </span>
                <div role="group" aria-labelledby="party-label" className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Fewer people"
                    disabled={booking.party <= 1}
                    onClick={() => update('party', booking.party - 1)}
                    className="grid size-11 place-items-center rounded-full border border-[var(--d-line)] bg-white disabled:opacity-40"
                  >
                    <Minus aria-hidden="true" className="size-4" />
                  </button>
                  <output aria-live="polite" className="w-8 text-center text-xl font-bold tabular-nums">
                    {booking.party}
                  </output>
                  <button
                    type="button"
                    aria-label="More people"
                    disabled={booking.party >= 6}
                    onClick={() => update('party', booking.party + 1)}
                    className="grid size-11 place-items-center rounded-full border border-[var(--d-line)] bg-white disabled:opacity-40"
                  >
                    <Plus aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>

              <fieldset className="min-w-0" disabled={!booking.day}>
                <legend className="text-sm font-semibold">Time</legend>
                {!booking.day ? (
                  <p className="mt-2 text-sm text-[var(--d-muted)]">Pick a date to see available times.</p>
                ) : (
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {seatings.map((time) => {
                      const taken = full.has(time);
                      const selected = booking.time === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={taken}
                          aria-pressed={selected}
                          aria-label={taken ? `${time} pm, fully booked` : `${time} pm`}
                          onClick={() => update('time', time)}
                          className={cn(
                            'min-h-11 rounded-lg border text-sm font-semibold tabular-nums',
                            taken && 'cursor-not-allowed border-dashed border-[var(--d-line)] text-[var(--d-muted)] line-through',
                            !taken && selected && 'border-[var(--d-accent)] bg-[var(--d-accent)] text-[var(--d-on-accent)]',
                            !taken && !selected && 'border-[var(--d-line)] bg-white hover:border-[var(--d-ink)]',
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
                {errors.time && (
                  <p role="alert" className="mt-2 text-sm font-medium text-[#b42318]">
                    {errors.time}
                  </p>
                )}
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <DemoField label="Name" error={errors.name}>
                  {(props) => (
                    <input
                      {...props}
                      autoComplete="name"
                      value={booking.name}
                      onChange={(event) => update('name', event.target.value)}
                    />
                  )}
                </DemoField>
                <DemoField label="Email or phone" error={errors.contact}>
                  {(props) => (
                    <input
                      {...props}
                      autoComplete="email"
                      value={booking.contact}
                      onChange={(event) => update('contact', event.target.value)}
                    />
                  )}
                </DemoField>
              </div>

              <DemoField label="Anything we should know?" hint="Allergies, a birthday, a high chair.">
                {(props) => (
                  <textarea
                    {...props}
                    rows={3}
                    className={cn(props.className, 'py-3')}
                    value={booking.note}
                    onChange={(event) => update('note', event.target.value)}
                  />
                )}
              </DemoField>

              <button
                type="submit"
                className="min-h-12 rounded-full bg-[var(--d-accent)] px-6 font-semibold text-[var(--d-on-accent)]"
              >
                Request this table
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Site ───────────────────────────────────────────────────────────────── */

export default function RestaurantSite() {
  return (
    <div style={brandVars(brand)}>
      <Header />
      <Hero />
      <Menu />
      <Visit />
      <Reserve />
      <footer className="border-t border-[var(--d-line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-[var(--d-muted)] sm:flex-row sm:justify-between sm:px-6">
          <p>
            <span className="font-bold text-[var(--d-ink)]" style={narrow}>
              Ferro
            </span>{' '}
            214 Elm Street, Riverside
          </p>
          <p>A concept site by Tejas Naik</p>
        </div>
      </footer>
    </div>
  );
}
