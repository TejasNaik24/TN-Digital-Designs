import { useMemo, useRef, useState, type FormEvent } from "react";
import { Check, ChevronDown, Phone } from "lucide-react";
import { brands } from "../brands";
import {
  anchor,
  brandVars,
  ConceptConfirmation,
  dayLabel,
  DemoField,
  looksLikeEmail,
  upcomingDays,
} from "../shared";
import { ClinicAssistant } from "./ClinicAssistant";
import { address, faqs, hours, insurers, phone, services, team } from "./data";
import { cn } from "@/lib/cn";

const brand = brands.clinic;
/** Reserved for urgent care only, so it keeps meaning. 5.0:1 on white. */
const CORAL = "#c2412d";

/* ── Header ─────────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-(--d-line) bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          {...anchor("clinic-top")}
          className="inline-flex min-h-11 items-center gap-2.5 text-lg font-bold"
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-full bg-(--d-accent)"
          >
            <span className="size-3 rounded-full bg-white" />
          </span>
          Northgate Dental
        </a>
        <nav aria-label="Northgate Dental" className="flex items-center gap-1">
          {[
            ["services", "Services"],
            ["team", "Team"],
            ["questions", "Questions"],
          ].map(([id, label]) => (
            <a
              key={id}
              {...anchor(id!)}
              className="hidden min-h-11 items-center px-3 font-medium text-(--d-muted) hover:text-(--d-ink) md:inline-flex"
            >
              {label}
            </a>
          ))}
          <a
            {...anchor("book")}
            className="inline-flex min-h-11 items-center rounded-xl bg-(--d-accent) px-5 font-semibold text-(--d-on-accent)"
          >
            Book a visit
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      id="clinic-top"
      aria-labelledby="clinic-title"
      className="scroll-mt-16"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 md:grid-cols-[1.25fr_1fr] md:items-center md:pt-20">
        <div>
          <h1
            id="clinic-title"
            className="text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.025em]"
          >
            A dentist you won’t dread visiting.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-(--d-muted)">
            Same-week appointments, prices you see before you sit down, and a
            team that explains everything before they do it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              {...anchor("book")}
              className="inline-flex min-h-12 items-center rounded-xl bg-(--d-accent) px-6 font-semibold text-[var(--d-on-accent)]"
            >
              Request an appointment
            </a>
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-(--d-line) px-6 font-semibold"
            >
              <Phone aria-hidden="true" className="size-4" />
              {phone}
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-(--d-surface) p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Opening hours</h2>
          <dl className="mt-4 flex flex-col gap-3">
            {hours.map((row) => (
              <div
                key={row.days}
                className="flex justify-between gap-4 border-b border-[var(--d-line)] pb-3 last:border-0 last:pb-0"
              >
                <dt className="text-(--d-muted)">{row.days}</dt>
                <dd className="text-right font-medium">{row.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[var(--d-muted)]">{address}</p>
        </div>
      </div>

      {/* Urgent care: the one place coral appears. */}
      <div className="border-y border-[#f1d3cc] bg-[#fdf3f0]">
        <p className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <strong style={{ color: CORAL }}>In pain or broke a tooth?</strong>{" "}
          Call{" "}
          <a
            className="font-semibold underline underline-offset-4"
            href={`tel:${phone.replace(/\D/g, "")}`}
          >
            {phone}
          </a>{" "}
          — we keep same-day emergency slots every weekday.
        </p>
      </div>
    </section>
  );
}

/* ── Services ───────────────────────────────────────────────────────────── */

function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="scroll-mt-16"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <h2
          id="services-title"
          className="text-4xl font-semibold tracking-[-0.02em]"
        >
          What we do
        </h2>
        <p className="mt-3 max-w-xl text-lg text-(--d-muted)">
          Starting prices before insurance. We’ll always quote you the real
          figure before treatment.
        </p>
        <ul className="mt-10 grid border-t border-(--d-line) md:grid-cols-2 md:gap-x-12">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex gap-6 border-b border-(--d-line) py-6"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="mt-1 text-(--d-muted)">{service.detail}</p>
                <p className="mt-2 text-sm text-(--d-muted)">
                  {service.length}
                </p>
              </div>
              <p className="shrink-0 font-semibold text-(--d-accent)">
                {service.from === "Free consult"
                  ? "Free consult"
                  : `from ${service.from}`}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Team + insurance ───────────────────────────────────────────────────── */

function Team() {
  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className="scroll-mt-16 bg-(--d-surface)"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr] md:py-24">
        <div>
          <h2
            id="team-title"
            className="text-4xl font-semibold tracking-[-0.02em]"
          >
            Who you’ll see
          </h2>
          <ul className="mt-10 flex flex-col gap-8">
            {team.map((person) => (
              <li key={person.name} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-lg font-bold text-[var(--d-accent)]"
                >
                  {person.initials}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{person.name}</h3>
                  <p className="text-[var(--d-accent)]">{person.role}</p>
                  <p className="mt-1 text-[var(--d-muted)]">{person.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Insurance we accept</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {insurers.map((name) => (
              <li key={name} className="flex items-center gap-3">
                <Check
                  aria-hidden="true"
                  className="size-5 text-[var(--d-accent)]"
                  strokeWidth={2.5}
                />
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[var(--d-muted)]">
            Not listed? We’ll still file the claim for you.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Booking request ────────────────────────────────────────────────────── */

const slots = [
  "8:30 am",
  "9:30 am",
  "10:30 am",
  "1:00 pm",
  "2:30 pm",
  "4:00 pm",
];
const steps = ["Visit", "Day", "Time", "Your details"] as const;

type Request = {
  service: string;
  day: Date | null;
  time: string;
  name: string;
  email: string;
  phone: string;
  newPatient: boolean;
  note: string;
};
const empty: Request = {
  service: "",
  day: null,
  time: "",
  name: "",
  email: "",
  phone: "",
  newPatient: true,
  note: "",
};

function Booking() {
  const days = useMemo(() => upcomingDays(10, (day) => day.getDay() === 0), []);
  const [step, setStep] = useState(0);
  const [request, setRequest] = useState<Request>(empty);
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "email", string>>
  >({});
  const [done, setDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  const set = <K extends keyof Request>(key: K, value: Request[K]) =>
    setRequest((r) => ({ ...r, [key]: value }));

  /** Move focus to the step heading so screen readers hear the new step. */
  const go = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  };

  const canContinue = [
    request.service !== "",
    request.day !== null,
    request.time !== "",
    true,
  ][step];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    if (!request.name.trim()) found.name = "Add your name.";
    if (!looksLikeEmail(request.email))
      found.email = "Add an email so we can confirm the time.";
    setErrors(found);
    if (Object.keys(found).length === 0) setDone(true);
  };

  const serviceName = services.find((s) => s.id === request.service)?.name;

  const choice = (selected: boolean) =>
    cn(
      "min-h-12 rounded-xl border px-4 text-left font-medium transition-colors",
      selected
        ? "border-[var(--d-accent)] bg-[var(--d-surface)] ring-1 ring-[var(--d-accent)]"
        : "border-[var(--d-line)] hover:border-[var(--d-accent)]",
    );

  return (
    <section id="book" aria-labelledby="book-title" className="scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.6fr] md:py-24">
        <div>
          <h2
            id="book-title"
            className="text-4xl font-semibold tracking-[-0.02em]"
          >
            Request an appointment
          </h2>
          <p className="mt-3 text-lg text-(--d-muted)">
            Pick what suits you. We’ll confirm by email within one working day.
          </p>
        </div>

        <div className="rounded-3xl border border-(--d-line) p-5 sm:p-8">
          {done && request.day ? (
            <ConceptConfirmation
              title="Request sent"
              resetLabel="Start a new request"
              onReset={() => {
                setDone(false);
                setRequest(empty);
                setStep(0);
              }}
            >
              {serviceName} on {dayLabel(request.day)} at {request.time}.
              Northgate would normally email {request.email} to confirm.
            </ConceptConfirmation>
          ) : (
            <>
              <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Progress">
                {steps.map((label, index) => (
                  <li
                    key={label}
                    aria-current={index === step ? "step" : undefined}
                  >
                    <span
                      className={cn(
                        "block h-1.5 rounded-full",
                        index <= step ? "bg-(--d-accent)" : "bg-(--d-line)",
                      )}
                    />
                    <span
                      className={cn(
                        "mt-2 block text-sm",
                        index === step ? "font-semibold" : "text-(--d-muted)",
                      )}
                    >
                      {index + 1}. {label}
                    </span>
                  </li>
                ))}
              </ol>

              <form onSubmit={submit} noValidate>
                <h3
                  ref={heading}
                  tabIndex={-1}
                  className="text-xl font-semibold focus:outline-none"
                >
                  {
                    [
                      "What do you need?",
                      "Which day?",
                      "What time?",
                      "Your details",
                    ][step]
                  }
                </h3>

                <div className="mt-5">
                  {step === 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          aria-pressed={request.service === service.id}
                          onClick={() => set("service", service.id)}
                          className={choice(request.service === service.id)}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {days.map((day) => {
                        const selected =
                          request.day?.toDateString() === day.toDateString();
                        return (
                          <button
                            key={day.toISOString()}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => set("day", day)}
                            className={choice(selected)}
                          >
                            {dayLabel(day)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          aria-pressed={request.time === slot}
                          onClick={() => set("time", slot)}
                          className={choice(request.time === slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <DemoField label="Full name" error={errors.name}>
                        {(props) => (
                          <input
                            {...props}
                            autoComplete="name"
                            value={request.name}
                            onChange={(e) => set("name", e.target.value)}
                          />
                        )}
                      </DemoField>
                      <DemoField label="Email" error={errors.email}>
                        {(props) => (
                          <input
                            {...props}
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            value={request.email}
                            onChange={(e) => set("email", e.target.value)}
                          />
                        )}
                      </DemoField>
                      <DemoField label="Phone" hint="Optional">
                        {(props) => (
                          <input
                            {...props}
                            type="tel"
                            autoComplete="tel"
                            value={request.phone}
                            onChange={(e) => set("phone", e.target.value)}
                          />
                        )}
                      </DemoField>
                      <fieldset className="min-w-0 flex flex-col gap-1.5">
                        <legend className="text-sm font-semibold">
                          Have you visited before?
                        </legend>
                        <div className="mt-1.5 flex gap-2">
                          {[
                            [true, "First visit"],
                            [false, "Returning"],
                          ].map(([value, label]) => (
                            <button
                              key={String(label)}
                              type="button"
                              aria-pressed={request.newPatient === value}
                              onClick={() =>
                                set("newPatient", value as boolean)
                              }
                              className={cn(
                                choice(request.newPatient === value),
                                "flex-1 text-center",
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <div className="sm:col-span-2">
                        <DemoField
                          label="Anything we should know?"
                          hint="Nervous about visits? Tell us and we’ll book you a longer first appointment."
                        >
                          {(props) => (
                            <textarea
                              {...props}
                              rows={3}
                              className={cn(props.className, "py-3")}
                              value={request.note}
                              onChange={(e) => set("note", e.target.value)}
                            />
                          )}
                        </DemoField>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => go(step - 1)}
                      className="min-h-12 px-2 font-semibold underline underline-offset-4"
                    >
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      disabled={!canContinue}
                      onClick={() => go(step + 1)}
                      className="min-h-12 rounded-xl bg-[var(--d-accent)] px-6 font-semibold text-[var(--d-on-accent)] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="min-h-12 rounded-xl bg-[var(--d-accent)] px-6 font-semibold text-[var(--d-on-accent)]"
                    >
                      Send request
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Questions ──────────────────────────────────────────────────────────── */

function Questions() {
  return (
    <section
      id="questions"
      aria-labelledby="questions-title"
      className="scroll-mt-16 bg-[var(--d-surface)]"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <h2
          id="questions-title"
          className="text-4xl font-semibold tracking-[-0.02em]"
        >
          Common questions
        </h2>
        <div className="mt-8 flex flex-col gap-3">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl bg-white px-5">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="pb-5 leading-relaxed text-[var(--d-muted)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Site ───────────────────────────────────────────────────────────────── */

export default function ClinicSite() {
  return (
    <div style={brandVars(brand)}>
      <Header />
      <Hero />
      <Services />
      <Team />
      <Booking />
      <Questions />
      <footer className="border-t border-[var(--d-line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-[var(--d-muted)] sm:flex-row sm:justify-between sm:px-6">
          <p>
            <span className="font-bold text-[var(--d-ink)]">
              Northgate Dental
            </span>{" "}
            {address}
          </p>
          <p>A concept site by Tejas Naik</p>
        </div>
      </footer>
      <ClinicAssistant />
    </div>
  );
}
