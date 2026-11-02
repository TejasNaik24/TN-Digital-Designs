# TN Digital Designs

The website for **TN Digital Designs**, the independent web design and development studio of Tejas Naik.

Live positioning: *"I build websites that make people trust you before you say a word."*

---

## What this is — read before writing any copy

This is a **client-acquisition site for a one-person web development studio**. Its only job is to make a small-business owner want to hire Tejas to build their website.

Constraints that follow from this:

| Rule | Why |
|---|---|
| **Work is concept builds only.** The three projects are fictional local businesses with real, working sites. Each is labelled `Concept` on its card, and every demo carries a concept banner. | Presenting fictional work as client work is the one design decision that would genuinely damage credibility. |
| **Never fabricate** clients, testimonials, reviews, ratings, metrics, revenue, conversion lifts or awards. This applies to the demos and to both AI assistants too. | Same. Honesty is part of the design quality. |
| **AI is one capability of four**, never the site's identity. | This is a web studio that can integrate AI, not an AI company. |
| **Next.js is excluded** from the build *and* from the visible tech list (capped at eight entries in `src/data/tech.ts`). | The site doesn't use it. Listing it would be a lie in the shop window. |
| **No brand logos anywhere.** | Avoids trademark misuse and reads more premium than a logo wall. The only exception is `src/components/ui/SocialIcons.tsx` — lucide v1 dropped brand icons, so the GitHub/LinkedIn glyphs are hand-drawn. |

---

## Quick start

```bash
npm install
cp .env.example .env   # optional: EmailJS + Gemini keys (see below)
npm run dev            # Vite dev server on :5173, also serves /api
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on `:5173`. A dev-only plugin in `vite.config.ts` serves `api/*.ts`, so the assistants work without the Vercel CLI |
| `npm run build` | `tsc --noEmit` **then** `vite build` |
| `npm run typecheck` | Types only, no emit |
| `npm run preview` | Serve `dist/` locally. It mirrors `vercel.json`'s per-route rewrites, so it serves what production serves |

> **There is no test suite and no linter.** `npm run build` type-checks first, so **it is the real gate**. Run it before claiming anything works.

---

## Stack

| | |
|---|---|
| **Framework** | React 19.2 + TypeScript 7 (strict, including `noUncheckedIndexedAccess`) |
| **Build** | Vite 8, target `es2022`, `lightningcss` for CSS minification |
| **Styling** | Tailwind v4. There's **no config file**; everything lives in `@theme` inside `src/styles/index.css` |
| **Motion** | Motion 13 (`motion/react`) |
| **Routing** | react-router-dom 7 |
| **Icons** | lucide-react |
| **Fonts** | Geist + Geist Mono for the studio; Bricolage Grotesque, Figtree and Big Shoulders Display for the demos. All self-hosted via `@fontsource-variable` |
| **Server** | One Vercel Function, `api/chat.ts` (Gemini, called with plain `fetch`, no SDK) |
| **Email** | EmailJS REST from the browser |

`@` is aliased to `./src`. There's no CMS, no state library and no UI kit.

---

## Architecture

### Routes

`BrowserRouter` lives in `main.tsx`; the top-level table is in `App.tsx`.

| Route | Renders | Notes |
|---|---|---|
| `/`, `/work`, anything else | `pages/StudioSite.tsx` (lazy chunk) | The studio's own routes inside `StudioChrome` (background, navbar, footer, studio assistant). Unknown paths get the in-identity 404 |
| `/work/:slug` | `pages/DemoPage.tsx` | A concept business's own website, with **no** studio chrome, only the `ConceptBanner`. Unknown slugs render the studio 404 |

**The code is split by route.** The studio is one lazy chunk, and each demo site is its own chunk. A visitor opening a demo link never downloads the studio. The `seo()` plugin in `vite.config.ts` adds `modulepreload` links to each route's HTML for exactly the chunks it needs, so the split costs no extra round trip.

`App.tsx` owns scroll and focus for every route:
- `useRouteScroll` restores the position per history entry. It records only while that entry is the active one; otherwise the next route's jump-to-top overwrote it and Back always landed at the top.
- `useRouteFocus` moves focus to `<main>`.

### Homepage section order

`Hero → Statement → Services → Work → WhyMe → Process → Pricing → FAQ → Contact`

`navLinks` in `src/data/site.ts` **must match this order**. Nav links jump in document order, so a mismatch makes clicking through the nav scroll backwards.

### Content lives in `src/data`

Every piece of user-facing studio copy is in `src/data/*.ts`: site identity, services, projects, reasons, process, pricing, FAQ, tech, project types and budgets. **Components contain no prose.** Change copy there, not in JSX.

**These files are also read by the studio assistant's serverless function**, so keep them server-safe:
- text only, no React or icon imports (icons map by `id` inside `Services.tsx` and `WhyMe.tsx`);
- `.js` extensions on relative imports;
- no bare `import.meta.env` (see the guard in `site.ts`).

> `faq.ts` answers and the tier contents in `pricing.ts` are commitments to prospective clients. Confirm them; don't treat them as fixed truth.

---

## Concept demos

Three fictional local businesses, each a complete clickable site at its own route with its own brand:

| Slug | Business | Type | Signature feature |
|---|---|---|---|
| `restaurant` | Ferro | Bricolage Grotesque, sage + chili red | Menu tabs, live "open now" hours, table requests |
| `clinic` | Northgate Dental | Figtree, white + deep teal | Four-step booking request, and its own AI assistant |
| `gym` | Groundwork | Big Shoulders Display + Figtree, concrete + orange | Filterable weekly schedule, monthly/annual pricing, free-trial form |

**Rules:**
- Every demo route renders `ConceptBanner`. Every form ends in `ConceptConfirmation`, which says plainly that nothing was sent or booked.
- No reviews, star ratings, "trusted by" logos or invented stats, even for a fictional business.
- Brand tokens live once, in `src/demos/brands.ts`. The demo site, its Work-card preview (`ProjectVisual`) and the hero mockup all read them.

**Adding a demo:**
1. Add an entry to `projects.ts` and `brands.ts`.
2. Add `src/demos/<slug>/Site.tsx`.
3. Register it in `DemoPage`'s `sites` map.
4. Add a preview in `ProjectVisual`.
5. **Add the slug to the `/work/:slug(...)` rewrite in `vercel.json`.**

**Adding a real client project:** set `type: 'client'` on the entry. The card handles the badge.

---

## AI assistants

Two assistants share one core:

| | Where | Knows | Can hand off to the contact form |
|---|---|---|---|
| **Studio** | `/` and `/work` (`components/assistant/StudioAssistant.tsx`) | Everything in `src/data` | Yes |
| **Clinic** | `/work/clinic` (`demos/clinic/ClinicAssistant.tsx`) | `demos/clinic/data.ts` | No |

### How it fits together

- **`src/lib/assistant/core.ts`** holds what both share: types, limits, keyword scoring, and `parseHandoff`. It's loaded by the browser *and* the server, so: no React, no `@/`, and `.js` extensions on imports.
- **`src/lib/assistant/studio.ts`** is the studio config. **The system prompt template lives here** (`systemPrompt()`), along with the scripted fallback.
- **`src/demos/clinic/assistant.ts`** is the clinic config.
- **`src/lib/assistant/useAssistantChat.ts`** holds the shared React hooks for transcript and sending (`useAssistantChat`) and the focus trap, Escape and return-focus behaviour (`useAssistantPanel`).
- **`api/chat.ts`** is the only endpoint. The body is `{ assistant: 'clinic' | 'studio', messages }`. The server picks the system prompt from a fixed registry; **a prompt is never accepted from the browser**. `assistant` defaults to `clinic` for older clients.

### Knowledge is assembled, never copied

The studio prompt is built at request time from `site`, `services`, `processSteps`, `tiers`, `projects`, `faqs`, `reasons`, `technologies`, `PROJECT_TYPES` and `BUDGETS`. Edit `pricing.ts` and the assistant reflects it with no other change.

- **Pricing behaviour** (all in the prompt, all from `pricing.ts`):
  - Prices are quoted only as "starting at".
  - The founding client offer (`foundingOffer`) may be mentioned for price or getting-started questions, never with a count of spots left or any urgency.
  - Ordering, payments, checkout or e-commerce always gets the line that online payments are quoted on top of the tier.
  - AI running costs are never called free and never given a dollar figure.
  - Asked about past clients, it says plainly there's no client work to show yet.
- **The pricing rule switches automatically.** While any tier's `startingAt` still contains the `X,XXX` placeholder, the assistant may not state any dollar amount. Once all three are real, it quotes them, always as "starting at".
- **Keep the prompt near ~2,500 tokens** (it's about 2,600 now). If it grows, trim descriptions, never rules. The "why work with me" points are titles-only and the concept projects are name + link for this reason; the six "why" titles are the next cut.

### Never-invent rules

The prompt forbids the assistant from inventing:
- prices, discounts, timelines, guarantees or availability;
- firm per-project quotes;
- past clients or testimonials;
- personal details about Tejas beyond name, email, GitHub and LinkedIn.

It also forbids giving legal, tax or financial advice, going off-topic, and obeying "ignore your instructions". Change the wording only with the same care as a FAQ promise.

### Handoff to the contact form

When the visitor agrees, the model ends its reply with:

```
HANDOFF {"projectType": "...", "budget": "...", "details": "..."}
```

The server strips that line and validates it: `projectType` must be a real form option, `budget` a real option or empty, and `details` is capped at 600 characters. It returns `handoff` alongside the text; invalid JSON is dropped silently.

The widget then shows a **project brief** card. **"Fill in the contact form"** calls `prefillContact()` from `lib/quote.ts`, which:
- sets the type, budget and message;
- focuses Name and announces the fill to screen readers;
- works from `/work` too, because a form that mounts later picks up the pending request.

**It never submits.** The honeypot and timing check still apply.

### Fallbacks and limits

Every request gets an answer. The assistant falls back to scripted keyword answers, built from the same data, when:
- there's no key;
- Gemini returns a quota or rate-limit error;
- the request times out;
- the reply is empty or truncated;
- the visitor goes over the per-IP limit (8 a minute, 40 a day);
- the browser can't reach `/api/chat` at all.

Other limits:
- Output is capped at 1,024 tokens with minimal thinking.
- Messages are capped at 500 characters, and the server keeps the last 6 turns.
- The per-IP limit is **best-effort**. It's an in-memory map, so it's per function instance.

> **Both assistants share one Gemini quota** (it's per Google project), and the per-IP limit counts across both.

### Environment

```
GEMINI_API_KEY   server-only (no VITE_ prefix, never bundled)
GEMINI_MODEL     optional, defaults to gemini-3.5-flash-lite
```

Set both in Vercel → Settings → Environment Variables (Production + Preview), then redeploy. Locally, put them in `.env`.

---

## Design system

All colour, type and motion tokens are `@theme` entries in `src/styles/index.css`. **Nothing arbitrary belongs in a component.**

### The contrast trap

| Token | Ratio | Use |
|---|---|---|
| `ink-2` | 7.9:1 | Body text |
| `ink-3` | 5.4:1 on the page, **4.6:1 on the lightest card surface** | Secondary text. At its old value it fell to 4.1:1 on cards |
| `ink-4` | 2.7:1 | **Decoration only** — `aria-hidden` dimension marks and the pull-quote glyph. Never for text |

### Shared surfaces

| Utility | Use |
|---|---|
| `card-surface` | The one card background. **Translucent**, so don't use it for anything floating over content (the assistant panel uses solid `bg-elevated`) |
| `surface-card` | Cursor-tracked gradient border + interior wash (drives `--spot-x`/`--spot-y`) |
| `btn-glow` | The same mechanism at button scale. Reserved for the single primary CTA, "Start a project" |
| `shell` | Max-width + gutter container |

### Section rhythm

`Section` takes `tone` (`base` / `raised` / `deep`) and `space` (`tight` / `regular` / `loose`), plus an `ambient` flag. `raised` and `deep` fade to nothing at both edges on purpose: you should feel the rhythm without being able to point at where it starts.

The anchor `id` sits on an **inner div** with `scroll-mt-24`, not the outer `<section>`. Anchoring the padded box left a wall of empty space above the heading.

### Motion

One easing curve for the entire site: expo-out `[0.16, 1, 0.3, 1]`, exported as `EASE_EXPO`. Hover transitions are **220ms**.

---

## Performance constraints — do not regress these

Every rule below is a fixed bug, not a preference. The site felt smooth in Chrome and laggy in Safari for a long time because of them.

### No `backdrop-filter` on anything persistent

It survives only on **transient overlays** (the mobile menu). It's deliberately absent from the fixed header, the device frame, cards, buttons, the contact form and the assistant widget.

The diagnosis came from a clean A/B test. The "Start a project" button inside the Work section scrolled *instantly* in Safari, while a nav link calling the identical `scrollToId` stalled for a beat. The only difference was that the nav link lived inside a `fixed` header carrying `backdrop-blur-xl`. WebKit re-samples and re-blurs everything behind a backdrop-filtered element on every scroll frame, *and* on any repaint inside it.

### No `mix-blend-mode` anywhere

WebKit falls back to CPU-assisted compositing for a blended layer, and drags anything stacked with it along.

### Cursor-tracking moves by `transform` only

`usePointerGlow` translates a fixed-size element with a *static* gradient. Animating a gradient's own centre forces a repaint every frame and can't be composited.

### Scrolling is a custom Motion `animate()` loop

`lib/scroll.ts` drives `window.scrollTo()` from a Motion tween. Two alternatives were tried and reverted:
- **Lenis**, which fought every programmatic jump.
- **Native smooth `scrollIntoView`**, because Safari's ramp reads as "click, pause, then scroll".

### Route changes must land instantly, and in a layout effect

- **`useRouteScroll` must stay a `useLayoutEffect`.** It has to land before `useRevealOnce` builds its IntersectionObservers. Otherwise whole sections stay at `opacity: 0`.
- **Cross-route anchor jumps are instant, never animated**, for the same reason.

### `html` uses `overflow-x: clip` and must stay `clip`

`hidden` would turn `html` into a scroll container and silently break every `position: sticky`.

### rAF loops must self-suspend

`usePointerGlow`, `SelfBuildingSite` and `ConstellationField` all pause when off-screen or on a hidden tab. **Nothing should run permanently.**

---

## Accessibility

- **Reduced motion is a first-class path.** It's gated through `useReducedMotionSafe`, and the site must still look *designed* with motion off.
- **Scroll reveals never use Motion's `whileInView`**; go through `<Reveal>` / `useRevealOnce`.
- **Route changes move focus to `<main>`.** The skip link moves focus itself rather than using a bare `href="#main"`.
- **Tap targets are ≥44px.** Focus rings are `:focus-visible`, never removed. Each demo sets `--focus-ring` to its own ink colour.
- **Field focus borders are full-strength azure.** At 60% opacity they measured 2.85:1, under the 3:1 minimum.
- **Assistants:**
  - labelled dialogs with a focus trap;
  - Escape closes them, and focus returns to the launcher;
  - `role="log"` transcripts;
  - a visible "AI assistant" disclosure.

Last audit: Lighthouse accessibility, best practices and SEO all 100 on every route (mobile), including with the studio assistant open. There's no horizontal scroll at 375px.

---

## Contact form

`src/lib/contact.ts` is the **entire** integration. It posts to EmailJS's REST endpoint with plain `fetch`.

```
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
```

EmailJS's "public key" is designed to be exposed client-side. Set the template's **To Email** in the EmailJS dashboard, so a form submission can't redirect it.

- **Outcomes:** `sent`, `failed` and `unconfigured`. The last two fall back to a prefilled `mailto:`, so a message is never swallowed.
- **Spam:**
  - a hidden `website` honeypot field;
  - a submit within 2s of the form appearing is treated as a bot.

  Suspected bots see the normal success screen and nothing is sent.
- **Pre-fill:** the pricing tiers' "Get a quote" and the studio assistant's handoff both go through `prefillContact()` in `lib/quote.ts`.
- **Options:** project types and budgets live in `src/data/projectTypes.ts`. The first three project types match the pricing tiers, and the budget bands are one per tier (under $1,000 / $1,000–$2,500 / $2,500–$5,000 / $5,000+). Revisit the bands if prices change.
- **Validation** runs on blur. Company and budget stay optional on purpose.

---

## SEO and deployment

**One URL setting.** `VITE_SITE_URL` (default `https://tn-digital-designs.vercel.app`) drives the canonical tag, `og:url`, `og:image`, `robots.txt` and `sitemap.xml`. To move to a custom domain, change that env var and nothing else.

The `seo()` plugin in `vite.config.ts` does three things at build time:
- Fills `index.html`'s `%TOKEN%`s from `src/data/pageMeta.ts`.
- Writes `dist/<route>/index.html` for `/work` and each demo, with that page's own title, description and canonical. Link previewers don't run JS.
- Generates `robots.txt` and `sitemap.xml` from the same route list.

**Share image and icon.** `public/og.png` (1200×630) and `public/apple-touch-icon.png` are rendered from `scripts/og/`. The instructions for regenerating them are at the top of each source file.

**Vercel:**
- `vercel.json` rewrites `/work` and `/work/(restaurant|clinic|gym)` to their generated HTML.
- Everything else, except `/api/*`, goes to the SPA.
- Set the EmailJS and Gemini env vars there (`VITE_SITE_URL` is optional).

---

## Known placeholders — before launch

| Item | Where |
|---|---|
| **Tier contents and notes are promises** | `src/data/pricing.ts`. Each tier's `note` (third person, read by the assistant) and `pageNote` (first person, shown on the page) must say the same thing |
| **FAQ answers are promises** | `src/data/faq.ts`. Confirm the timelines and support commitments |
| **Social URLs are unverified** | `src/data/site.ts` |
| **Homepage LCP ~2.7s on throttled mobile** | The hero is drawn by JS. The real fix is pre-rendering the hero's HTML at build time |

---

## Repo map

```
api/
  chat.ts                    Both assistants: Gemini, rate limit, fallbacks
scripts/og/                  Sources for og.png and apple-touch-icon.png
src/
  App.tsx                    Top-level routes + scroll/focus management
  pages/                     StudioSite (lazy studio routes), HomePage, WorkPage,
                             DemoPage, NotFoundPage
  components/
    assistant/               StudioAssistant (studio chat widget)
    background/              AmbientBackground, ConstellationField (canvas)
    contact/                 ContactForm, Field
    demo/                    ConceptBanner
    hero/                    Hero, DeviceFrame, SelfBuildingSite
    layout/                  StudioChrome, Section + Shell, Footer
    navigation/              Navbar, MobileMenu
    projects/                ProjectCard, ProjectVisual (live previews)
    sections/                The nine homepage sections
    ui/                      Button, Reveal, SectionHeading, MonoLabel, …
    work/                    WorkGallery (shared by / and /work)
  data/                      ALL studio copy (server-safe: text only)
  demos/                     brands.ts, shared.tsx, restaurant/ clinic/ gym/
  hooks/                     reveal, spotlight, scroll spy, focus trap, meta, …
  lib/
    assistant/               core, studio config + prompt, React hooks
    contact, quote, scroll, navigation, validation, motion, cn
  styles/                    index.css (design system), demo-fonts.css
```
