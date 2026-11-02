import { useMemo, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { brands, GYM_BODY_FONT } from '../brands';
import { anchor, brandVars, ConceptConfirmation, DemoField, looksLikeEmail } from '../shared';
import { ANNUAL_MONTHS_CHARGED, classInfo, classTypes, plans, week, type ClassType } from './data';
import { cn } from '@/lib/cn';

const brand = brands.gym;
/** Big Shoulders is the board face: headlines and the timetable only. */
const display = { fontFamily: brand.font } as const;

/* ── Header ─────────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--d-ink)] bg-[var(--d-ground)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a {...anchor('gym-top')} className="inline-flex min-h-11 items-center text-3xl font-black uppercase leading-none" style={display}>
          Groundwork
        </a>
        <nav aria-label="Groundwork" className="flex items-center gap-1">
          <a {...anchor('schedule')} className="hidden min-h-11 items-center px-3 font-semibold sm:inline-flex">
            Schedule
          </a>
          <a {...anchor('pricing')} className="hidden min-h-11 items-center px-3 font-semibold sm:inline-flex">
            Pricing
          </a>
          <a {...anchor('trial')} className="inline-flex min-h-11 items-center bg-[var(--d-accent)] px-5 font-bold text-[var(--d-on-accent)]">
            Free trial class
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="gym-top" aria-labelledby="gym-title" className="scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1.3fr_1fr] md:items-end md:pt-16">
        <h1 id="gym-title" className="text-[clamp(5rem,17vw,12rem)] font-black uppercase leading-[0.82]" style={display}>
          Get strong{' '}
          {/* inline-block with its own line-height: as a plain inline span its
              fill follows the 0.82 leading and bleeds up over "strong". */}
          <span className="mt-[0.08em] inline-block bg-[var(--d-accent)] px-[0.08em] pt-[0.06em] leading-[0.9] text-[var(--d-on-accent)]">
            here.
          </span>
        </h1>
        <div className="flex flex-col gap-6 md:pb-3">
          <p className="max-w-sm text-lg leading-relaxed">
            Coach-led strength classes of eight people or fewer. Every lift is taught, every session
            scales to you, and your first class is free.
          </p>
          <div className="flex flex-wrap gap-3">
            <a {...anchor('trial')} className="inline-flex min-h-12 items-center bg-[var(--d-accent)] px-6 font-bold text-[var(--d-on-accent)]">
              Book a free class
            </a>
            <a {...anchor('schedule')} className="inline-flex min-h-12 items-center border-2 border-[var(--d-ink)] px-6 font-bold">
              See the schedule
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Schedule ───────────────────────────────────────────────────────────── */

const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

function Schedule() {
  const [filter, setFilter] = useState<ClassType | 'All'>('All');
  const [mobileDay, setMobileDay] = useState(todayIndex);

  const visible = (type: ClassType) => filter === 'All' || filter === type;
  const count = week.reduce((n, day) => n + day.sessions.filter((s) => visible(s.type)).length, 0);

  const sessionRow = (session: (typeof week)[number]['sessions'][number]) => (
    <li key={session.time + session.type} className="border-t-2 border-[var(--d-ink)] py-3">
      <p className="text-2xl font-extrabold tabular-nums leading-none" style={display}>
        {session.time}
      </p>
      <p className="mt-1 font-semibold">{session.type}</p>
      <p className="text-sm text-[var(--d-muted)]">Coach {session.coach}</p>
      <p className="text-sm font-semibold">
        {session.spots === 0 ? 'Waitlist' : `${session.spots} spots left`}
      </p>
    </li>
  );

  return (
    <section id="schedule" aria-labelledby="schedule-title" className="scroll-mt-16 bg-[var(--d-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="schedule-title" className="text-6xl font-black uppercase leading-none md:text-7xl" style={display}>
            This week
          </h2>
          <div role="group" aria-label="Filter classes" className="flex flex-wrap gap-2">
            {(['All', ...classTypes] as const).map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={filter === type}
                onClick={() => setFilter(type)}
                className={cn(
                  'min-h-11 border-2 px-4 font-bold',
                  filter === type ? 'border-[var(--d-ink)] bg-[var(--d-ink)] text-[var(--d-ground)]' : 'border-[var(--d-ink)]',
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[var(--d-muted)]" aria-live="polite">
          {filter === 'All' ? `${count} classes this week.` : `${count} ${filter.toLowerCase()} classes this week. ${classInfo[filter]}`}
        </p>

        {/* Mobile: one day at a time. */}
        <div className="mt-8 md:hidden">
          <div role="group" aria-label="Day" className="flex gap-1 overflow-x-auto pb-1">
            {week.map((day, index) => (
              <button
                key={day.day}
                type="button"
                aria-pressed={mobileDay === index}
                onClick={() => setMobileDay(index)}
                className={cn(
                  'min-h-11 min-w-12 shrink-0 border-2 border-[var(--d-ink)] px-2 font-bold',
                  mobileDay === index && 'bg-[var(--d-ink)] text-[var(--d-ground)]',
                )}
              >
                {day.short}
              </button>
            ))}
          </div>
          <h3 className="mt-6 text-3xl font-black uppercase" style={display}>
            {week[mobileDay]?.day}
          </h3>
          <ul className="mt-2">
            {week[mobileDay]?.sessions.filter((s) => visible(s.type)).map(sessionRow)}
          </ul>
          {week[mobileDay]?.sessions.every((s) => !visible(s.type)) && (
            <p className="mt-4 text-[var(--d-muted)]">No {filter.toLowerCase()} classes on this day.</p>
          )}
        </div>

        {/* Desktop: the whole board. */}
        <div className="mt-10 hidden grid-cols-7 gap-4 md:grid">
          {week.map((day, index) => (
            <div key={day.day}>
              <h3 className={cn('text-2xl font-black uppercase', index === todayIndex && 'underline decoration-[var(--d-accent)] decoration-4 underline-offset-4')} style={display}>
                {day.short}
                {index === todayIndex && <span className="sr-only"> (today)</span>}
              </h3>
              <ul className="mt-2">{day.sessions.filter((s) => visible(s.type)).map(sessionRow)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ────────────────────────────────────────────────────────────── */

function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="pricing-title" className="text-6xl font-black uppercase leading-none md:text-7xl" style={display}>
              Membership
            </h2>
            <p className="mt-4 max-w-md text-lg">No joining fee. Cancel monthly plans with 30 days’ notice.</p>
          </div>
          <div role="group" aria-label="Billing period" className="flex border-2 border-[var(--d-ink)]">
            {[
              [false, 'Monthly'],
              [true, 'Annual, 2 months free'],
            ].map(([value, label]) => (
              <button
                key={String(label)}
                type="button"
                aria-pressed={annual === value}
                onClick={() => setAnnual(value as boolean)}
                className={cn('min-h-11 px-4 font-bold', annual === value && 'bg-[var(--d-ink)] text-[var(--d-ground)]')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const price = annual ? Math.round((plan.monthly * ANNUAL_MONTHS_CHARGED) / 12) : plan.monthly;
            const featured = plan.id === 'unlimited';
            return (
              <li
                key={plan.id}
                className={cn('flex flex-col border-2 border-[var(--d-ink)] p-6', featured ? 'bg-[var(--d-ink)] text-[var(--d-ground)]' : 'bg-[var(--d-surface)]')}
              >
                <h3 className="text-4xl font-black uppercase" style={display}>
                  {plan.name}
                </h3>
                <p className={cn('mt-1', featured ? 'opacity-80' : 'text-[var(--d-muted)]')}>{plan.who}</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-6xl font-black tabular-nums" style={display}>
                    ${price}
                  </span>
                  <span className="font-semibold">/ month</span>
                </p>
                <p className={cn('mt-1 text-sm', featured ? 'opacity-80' : 'text-[var(--d-muted)]')}>
                  {annual ? `$${plan.monthly * ANNUAL_MONTHS_CHARGED} billed once a year` : 'Billed monthly'}
                </p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={3} />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  {...anchor('trial')}
                  className={cn(
                    'mt-8 inline-flex min-h-12 items-center justify-center px-6 font-bold',
                    featured ? 'bg-[var(--d-accent)] text-[var(--d-on-accent)]' : 'border-2 border-[var(--d-ink)]',
                  )}
                >
                  Start with a free class
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── Free trial ─────────────────────────────────────────────────────────── */

const levels = ['New to lifting', 'Some experience', 'Lift regularly'];

function Trial() {
  const options = useMemo(
    () => week.flatMap((day) => day.sessions.filter((s) => s.spots > 0).map((s) => `${day.day} ${s.time} — ${s.type}`)),
    [],
  );
  const [form, setForm] = useState({ session: '', level: levels[0] ?? '', name: '', email: '' });
  const [errors, setErrors] = useState<Partial<Record<'session' | 'name' | 'email', string>>>({});
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    if (!form.session) found.session = 'Pick a class to try.';
    if (!form.name.trim()) found.name = 'Add your name.';
    if (!looksLikeEmail(form.email)) found.email = 'Add an email so the coach can send details.';
    setErrors(found);
    if (Object.keys(found).length === 0) setDone(true);
  };

  return (
    <section id="trial" aria-labelledby="trial-title" className="scroll-mt-16 bg-[var(--d-ink)] text-[var(--d-ground)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.3fr] md:py-24">
        <div>
          <h2 id="trial-title" className="text-6xl font-black uppercase leading-none md:text-7xl" style={display}>
            Your first class is free
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed opacity-85">
            Turn up ten minutes early. A coach will walk you through the warm-up and scale every lift to where you are.
          </p>
        </div>

        <div className="bg-[var(--d-surface)] p-5 text-[var(--d-ink)] sm:p-8" style={{ '--d-radius': '0', '--focus-ring': brand.colors.ink } as React.CSSProperties}>
          {done ? (
            <ConceptConfirmation
              title="You’re on the list"
              resetLabel="Book a different class"
              onReset={() => {
                setDone(false);
                setForm({ session: '', level: levels[0] ?? '', name: '', email: '' });
              }}
            >
              {form.name.split(' ')[0]}, your free class: {form.session}. Groundwork would normally email {form.email} with what to bring.
            </ConceptConfirmation>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-6">
              <DemoField label="Class" error={errors.session}>
                {(props) => (
                  <select {...props} value={form.session} onChange={(e) => set('session', e.target.value)}>
                    <option value="" disabled>
                      Choose a class with space
                    </option>
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                )}
              </DemoField>

              <fieldset className="min-w-0">
                <legend className="text-sm font-semibold">Experience</legend>
                <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                  {levels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={form.level === level}
                      onClick={() => set('level', level)}
                      className={cn('min-h-12 border-2 border-[var(--d-ink)] px-3 font-semibold', form.level === level && 'bg-[var(--d-ink)] text-[var(--d-ground)]')}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <DemoField label="Name" error={errors.name}>
                  {(props) => <input {...props} autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} />}
                </DemoField>
                <DemoField label="Email" error={errors.email}>
                  {(props) => <input {...props} type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} />}
                </DemoField>
              </div>

              <button type="submit" className="min-h-12 bg-[var(--d-accent)] px-6 font-bold text-[var(--d-on-accent)]">
                Book my free class
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Site ───────────────────────────────────────────────────────────────── */

export default function GymSite() {
  return (
    <div style={brandVars(brand, GYM_BODY_FONT)}>
      <Header />
      <Hero />
      <Schedule />
      <Pricing />
      <Trial />
      <footer className="border-t-2 border-[var(--d-ink)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-[var(--d-muted)] sm:flex-row sm:justify-between sm:px-6">
          <p>
            <span className="font-black uppercase text-[var(--d-ink)]" style={display}>
              Groundwork
            </span>{' '}
            40 Foundry Lane, Riverside
          </p>
          <p>A concept site by Tejas Naik</p>
        </div>
      </footer>
    </div>
  );
}
