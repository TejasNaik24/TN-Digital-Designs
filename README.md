# TN Digital

The website for **TN Digital**, the independent web design and development studio of Tejas Naik.

Live positioning: *"I build websites that make people trust you before you say a word."*

---

## What this is — read before writing any copy

This is a **client-acquisition site for a one-person web development studio**. Its only job is to make a business owner want to hire Tejas to build their website.

It is **not** a portfolio, résumé, or academic site. That exists separately at [tejasnaik.vercel.app](https://tejasnaik.vercel.app).

**Never add** employers, internships, research, publications, coursework, or academic credentials here. An earlier draft pulled real résumé content into the Work section and it actively undermined the site — a founder evaluating a web developer reads *"student researcher"* as *"not a professional studio."*

Constraints that follow from this:

| Rule | Why |
|---|---|
| **Work is concept builds only.** Every project is self-directed and chipped `CONCEPT` everywhere it appears. | Presenting fictional work as client work is the one design decision that would genuinely damage credibility. |
| **Never fabricate** clients, testimonials, metrics, revenue, conversion lifts, or awards. | Same. Honesty is part of the design quality. |
| **AI is one capability of four**, never the site's identity. | This is a web studio that can integrate AI, not an AI company. |
| **Next.js is excluded** from the build *and* the visible tech list (capped at eight entries in `src/data/tech.ts`). | The site doesn't use it. Listing it would be a lie in the shop window. |
| **No brand logos anywhere.** | Avoids trademark misuse and reads more premium than a logo wall. The only exception is `src/components/ui/SocialIcons.tsx` — lucide v1 dropped brand icons, so the GitHub/LinkedIn glyphs are hand-drawn. |

---

## Quick start

```bash
npm install
npm run dev          # Vite dev server on :5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on `:5173` |
| `npm run build` | `tsc --noEmit` **then** `vite build` |
| `npm run typecheck` | Types only, no emit |
| `npm run preview` | Serve `dist/` locally |

> **There is no test suite and no linter.** `npm run build` type-checks first, so **it is the real gate** — run it before claiming anything works.

---

## Stack

| | |
|---|---|
| **Framework** | React 19.2 + TypeScript 7 (strict, incl. `noUncheckedIndexedAccess`) |
| **Build** | Vite 8, target `es2022`, `lightningcss` for CSS minification |
| **Styling** | Tailwind v4 — **no config file**, everything lives in `@theme` inside `src/styles/index.css` |
| **Motion** | Motion 13 (`motion/react`) |
| **Routing** | react-router-dom 7 |
| **Icons** | lucide-react |
| **Fonts** | Geist + Geist Mono (self-hosted via `@fontsource-variable`) |

`@` is aliased to `./src`.

Roughly **7,900 lines** across 67 source files. No CMS, no state library, no UI kit, no backend.

---

## Architecture

### Routes

`BrowserRouter` lives in `main.tsx`; the route table is in `App.tsx`. `AmbientBackground`, `Navbar` and `Footer` sit **outside** `<Routes>` so they persist across navigation.

| Route | Page | Notes |
|---|---|---|
| `/` | `pages/HomePage.tsx` | Eight sections, in order |
| `/work` | `pages/WorkPage.tsx` | Standalone gallery index |
| `/work/:slug` | `pages/ProjectPage.tsx` | Case study. Unknown slug renders the 404, not a crash |
| `*` | `pages/NotFoundPage.tsx` | In-identity 404 |

`vercel.json` provides the SPA rewrite. **Without it every deep link 404s on refresh.**

### Homepage section order

`Hero → Statement → Services → Work → WhyMe → Process → FAQ → Contact`

`navLinks` in `src/data/site.ts` **must match this order** — nav links jump in document order, so a mismatch makes clicking through the nav scroll backwards.

### Content lives in `src/data`

Every piece of user-facing copy is in `src/data/*.ts` — site identity, services, projects, reasons, process, FAQ, tech. **Components contain no prose.** Change copy there, not in JSX.

> `src/data/faq.ts` answers are commitments to prospective clients (timelines, support). Treat them as content to confirm with Tejas, not as fixed truth.

---

## The Work system

Three self-directed concepts, each with a real route and a real case study:

| Slug | Concept | Category | Visual language |
|---|---|---|---|
| `atelier-nord` | Atelier Nord | Architecture & Design Studio | **Light** — warm off-white paper, charcoal type, Swiss-modern discipline |
| `vela` | Vela | AI Product / SaaS | Near-black, single azure accent, real product surface |
| `monument` | Monument | Luxury Hospitality | Warm dark, editorial type, persistent booking bar |

Atelier Nord is deliberately **light**. Every other surface on the site is near-black, and a studio that can only make dark tech websites is a studio with one trick.

### Case studies are data, not markup

`src/data/projects.ts` holds a `CaseStudySection` discriminated union; `ProjectSection.tsx` switches on `kind`. **A new project is a data edit** — you only touch components to add a new *section type*.

```
prose    — heading + paragraphs
screen   — one screen, full / split-left / split-right
screens  — 2-up supporting screens
palette  — colour swatches with notes
build    — technical breakdown
```

### Concept screens

15 screens in `src/components/projects/screens/`, one registry per concept, resolved through `registry.ts`.

All drawn in **DOM/CSS/SVG — zero raster bytes**, crisp at any density, editable rather than frozen in a PNG.

**The one rule that makes this work:** every screen sits in a `container-type: inline-size` context and **sizes everything in `cqw`**. One component then renders correctly as a small split-column figure *and* as a full-bleed hero with no breakpoints. A fixed `px` value anywhere will break at one of those scales.

Screens must use **real text, never grey placeholder bars** — bars read as a *skeleton loader*, i.e. an unfinished mockup, which is the exact opposite of what this section is selling. This rule has been violated twice and had to be audited out both times.

### Adding a real client project

Set `type: 'client'` on the entry. The card, gallery, badge, and case-study page all handle it already. Nothing else changes.

---

## Design system

All colour, type, and motion tokens are `@theme` entries in `src/styles/index.css` (42 tokens). **Nothing arbitrary belongs in a component.**

### The contrast trap

`--color-ink-4` measures **2.7:1** against the page background. It is **decoration only** — the `aria-hidden` blueprint dimension marks and the pull-quote glyph.

Body text must use `ink-2` (7.9:1) or `ink-3` (4.8:1). This has leaked into the footer and service cards before and had to be audited out. **Check any new text against it.**

### Shared surfaces

| Utility | Use |
|---|---|
| `card-surface` | The one card background. Consolidated from four different backgrounds that were close enough to look accidental |
| `surface-card` | Cursor-tracked gradient border + interior wash (drives `--spot-x`/`--spot-y`) |
| `btn-glow` | Same mechanism retuned for button scale. Rests at `0.34` opacity, not 0 — with the glow fully off, the primary CTA was indistinguishable from the secondary button beside it |
| `shell` | Max-width + gutter container |

### Section rhythm

`Section` takes `tone` (`base` / `raised` / `deep`) and `space` (`tight` / `regular` / `loose`), plus an `ambient` flag for a soft pool of light.

Before this existed, every section was transparent over one canvas colour at identical padding — eight thousand pixels of scroll with no landmarks, reading as an endless void. `raised` and `deep` fade to nothing at both edges on purpose: you should feel the rhythm without being able to point at where it starts.

The anchor `id` sits on an **inner div** with `scroll-mt-24`, not the outer `<section>` — anchoring the padded box scrolled to the top of the padding and left a wall of empty space above the heading.

### Motion

One easing curve for the entire site: expo-out `[0.16, 1, 0.3, 1]`, exported as `EASE_EXPO`. Hover transitions are **220ms** and live in Tailwind classes.

---

## Performance constraints — do not regress these

Every rule below is a fixed bug, not a preference. The site felt smooth in Chrome and laggy in Safari for a long time because of them.

### No `backdrop-filter` on anything persistent

It survives only on **transient overlays** (the mobile menu). It is deliberately absent from the fixed header, the device frame, cards, buttons, and the contact form.

The diagnosis came from a clean A/B: the "Start a project" button inside the Work section scrolled *instantly* in Safari while a nav link calling the identical `scrollToId` stalled for a beat. The only difference was that the nav link lived inside a `fixed` header carrying `backdrop-blur-xl`. WebKit re-samples and re-blurs everything behind a backdrop-filtered element on every scroll frame *and* on any repaint inside it — a nav link's hover colour transition is enough.

### No `mix-blend-mode` anywhere

WebKit falls back to CPU-assisted compositing for a blended layer and drags anything stacked with it along. Because the affected layers were full-viewport and always mounted, this tax applied on every frame, everywhere, permanently.

### Cursor-tracking moves by `transform` only

`usePointerGlow` translates a fixed-size element with a *static* gradient. It used to write `--mx`/`--my` onto `:root` feeding a `radial-gradient(at var(--mx) var(--my))`. Animating a gradient's own centre forces a repaint of its pixels every frame and can't be composited — that was the actual cause of a "the mouse itself feels laggy in Safari" report.

### Scrolling is a custom Motion `animate()` loop

`lib/scroll.ts` drives `window.scrollTo()` from a Motion tween on an expo-out curve. **Two alternatives were tried and reverted:**

1. **Lenis** — owns the scroll position, so every programmatic jump fought its rAF loop and queued trackpad momentum.
2. **Native `scrollIntoView({ behavior: 'smooth' })`** — Safari's built-in easing has a heavy ease-in ramp, spending its first ~100–200ms barely moving. Reads as "click, pause, then it scrolls," and browsers don't expose the curve to tune it.

The header offset is read from `getComputedStyle(target).scrollMarginTop` at call time — one source of truth.

### Route changes must land instantly, and in a layout effect

Two load-bearing details in `App.tsx` and `HomePage.tsx`:

- **`useRouteScroll` must stay a `useLayoutEffect`.** React runs a parent's layout effect *after* children's layout effects but *before* their passive effects — which is when `useRevealOnce` builds its IntersectionObservers. Land the scroll in a passive effect instead and those observers are built at the *old* position, deliver "not intersecting", then the page jumps past them. No further threshold is ever crossed and whole sections stay at `opacity: 0` permanently.
- **Cross-route anchor jumps are instant, never animated.** A tween across ~8000px moves the viewport faster than any human scroll, so a section can go from fully-below to fully-above between two frames without crossing a threshold — the same silent failure.

### `html` uses `overflow-x: clip` and must stay `clip`

Decorative elements deliberately sit outside their parents. `overflow-x: hidden` on `<body>` doesn't work — it propagates to the viewport and leaves body itself `visible`, so spill still produced real 14px horizontal scroll.

It must be **`clip`, never `hidden`** — `hidden` turns `html` into a scroll container and silently breaks every `position: sticky` on the page, which the FAQ and Contact headings both rely on.

### rAF loops must self-suspend

`usePointerGlow` parks itself once it catches up or the tab is hidden. `SelfBuildingSite`'s cycle stops when the hero scrolls out of view. `ConstellationField` pauses on hidden tabs and caps DPR at 1.5. **Nothing should run permanently.**

---

## Accessibility

- **Reduced motion is a first-class path.** Twelve files gate on `useReducedMotionSafe`. The site must still look *designed*, not merely functional — verify visually, not just by reading the flag.
- **Scroll reveals never use Motion's `whileInView`.** `useRevealOnce` also treats `boundingClientRect.top < 0` as revealed, because a plain `isIntersecting` check loses elements when you scroll fast or land on a deep link. Go through `<Reveal>` or `useRevealOnce`.
- Route changes move focus to `<main>` (`tabIndex={-1}`, `preventScroll: true`) so the change isn't silent for screen readers.
- The skip link **is not** a bare `href="#main"` — a same-document hash click updates `window.location` without firing `popstate`, leaving the router's location stale.
- Tap targets are ≥44px. Focus rings are `:focus-visible` only and are never removed.

---

## Contact form

`src/lib/contact.ts` is the **entire** integration. It posts to EmailJS's REST endpoint with plain `fetch` — no SDK.

```
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
```

See `.env.example`. EmailJS's "public key" is designed to be exposed client-side, so shipping it in the bundle is expected, not a leak. Set the template's **To Email** in the EmailJS dashboard, not from here, so it can't be redirected by a form submission.

Three outcomes: `sent`, `failed`, `unconfigured`. **Both `unconfigured` and `failed` fall back to a prefilled `mailto:`** — a genuine send failure must never silently swallow a message either, not just a missing config.

Validation (`lib/validation.ts`) runs **on blur, not on keystroke**. Company and budget stay optional on purpose — every extra required field costs enquiries.

---

## Deployment

Target is Vercel. `vercel.json` sets the build command, output directory, the SPA rewrite, and immutable caching for hashed assets.

Rewrites run **after** the filesystem check, so `favicon.svg`, `robots.txt`, `sitemap.xml` and `/assets/*` keep serving as real files.

---

## Known placeholders — before launch

| Item | Where |
|---|---|
| **`tn-digital.com` is a stand-in domain** | `index.html`, `public/robots.txt`, `public/sitemap.xml`, `src/data/site.ts` |
| **Social URLs are unverified** | `src/data/site.ts` |
| **FAQ answers are promises** | `src/data/faq.ts` — confirm timelines and support commitments |
| **Per-route metadata is client-side only** | `useDocumentMeta` sets tags at runtime. Googlebot renders JS and sees them; non-JS scrapers (Slack, iMessage, LinkedIn) still get the site-level OG tags from `index.html`. If per-route link previews matter, the fix is a small post-build prerender step — the route set is fully static — not a bigger runtime library. |
| **Bundle exceeds Vite's 500 kB warning** | Acceptable for now (~167 kB gzipped). If it matters, code-split `/work/*` and `*` only — never `/`, whose sections the scroll spy needs present at mount. |

---

## Repo map

```
src/
  App.tsx                    Route table + scroll/focus management
  main.tsx                   BrowserRouter, manual scrollRestoration
  pages/                     HomePage, WorkPage, ProjectPage, NotFoundPage
  components/
    background/              AmbientBackground, ConstellationField (canvas)
    hero/                    Hero, DeviceFrame, SelfBuildingSite
    sections/                The eight homepage sections
    projects/                Cards, case-study parts, ScreenFrame
      screens/               15 concept screens + registry
    work/                    WorkGallery (shared by / and /work)
    contact/                 ContactForm, Field
    navigation/              Navbar, MobileMenu
    layout/                  Section + Shell, Footer
    ui/                      Button, Reveal, SectionHeading, MonoLabel, …
  data/                      ALL user-facing copy
  hooks/                     9 hooks (reveal, spotlight, scroll spy, …)
  lib/                       scroll, navigation, contact, validation, motion, cn
  styles/index.css           The entire design system
```
