/**
 * Selected work — the data behind both the Work gallery and every case-study
 * route at /work/:slug.
 *
 * Every entry here is a CONCEPT: a self-directed build made to explore how a
 * particular kind of business could feel online. None of them are clients,
 * none of them are shipped products, and the UI labels them as concepts
 * everywhere they appear. Never soften that label, and never invent a client,
 * a testimonial, a metric, a revenue figure, or an award.
 *
 * Adding a real client later: set `type: 'client'` and fill the same shape.
 * The card, the gallery and the case-study page all read from this file and
 * need no changes.
 */

/** Which card preview a project uses. One per concept. */
export type ProjectVisualKind = 'editorial' | 'product' | 'hospitality';

/** Keys into a project's screen registry (see components/projects/screens). */
export type ScreenId = string;

/**
 * The case study is data, not markup, so a new project is a data edit rather
 * than a new page component. `ProjectSection` switches on `kind`.
 */
export type CaseStudySection =
  | {
      kind: 'prose';
      eyebrow: string;
      heading: string;
      body: string[];
    }
  | {
      kind: 'screen';
      eyebrow: string;
      heading: string;
      body: string;
      screen: ScreenId;
      frame: 'browser' | 'phone' | 'bare';
      /** `full` stacks copy above the screen; the splits sit it alongside. */
      layout: 'full' | 'split-left' | 'split-right';
      caption?: string;
    }
  | {
      kind: 'screens';
      eyebrow: string;
      heading: string;
      body?: string;
      items: { screen: ScreenId; caption: string }[];
    }
  | {
      kind: 'palette';
      eyebrow: string;
      heading: string;
      body: string;
      swatches: { name: string; value: string; note: string }[];
    }
  | {
      kind: 'build';
      eyebrow: string;
      heading: string;
      body: string;
      items: { label: string; detail: string }[];
    };

export type Project = {
  /** Route segment: /work/{slug} */
  slug: string;
  title: string;
  category: string;
  type: 'concept' | 'client';
  year: string;
  /** One line, used on the card. */
  shortDescription: string;
  /** The opening paragraph of the case study. */
  description: string;
  technologies: string[];
  /** Drives the card's hover glow and the accent inside its visuals. */
  accent: string;
  /** Spans both columns in the gallery — the strongest project. */
  featured?: boolean;
  /** Which card preview the gallery uses. */
  heroVisual: ProjectVisualKind;
  /** The screen shown full-bleed at the top of the case study. Kept separate
   *  from `sections` so it can't accidentally be rendered twice. */
  heroScreen: ScreenId;
  /** One line summarising the visual direction, shown in the meta rail. */
  designDirection: string;
  highlights: string[];
  sections: CaseStudySection[];
  meta: { title: string; description: string };
};

export const projects: Project[] = [
  /* ── 01 — Atelier Nord ────────────────────────────────────────────────── */
  {
    slug: 'atelier-nord',
    title: 'Atelier Nord',
    category: 'Architecture & Design Studio',
    type: 'concept',
    year: '2026',
    shortDescription:
      'An editorial portfolio for a practice whose work should be the loudest thing on the page.',
    description:
      'A self-directed exploration of how an architecture practice could translate the quiet precision of its work into a digital experience — where the building is the subject and the interface gets out of the way.',
    technologies: ['React', 'TypeScript', 'Motion', 'CSS Grid'],
    // A cool slate-blue rather than a true neutral — a grey accent reads as
    // "unstyled placeholder" against a grey-on-dark composition.
    accent: '#8fa9d9',
    featured: true,
    heroVisual: 'editorial',
    heroScreen: 'home',
    designDirection: 'Swiss-modern editorial. Stone, charcoal, one cool accent.',
    highlights: [
      'Editorial layout with a real typographic hierarchy',
      'A 12-column grid used strictly enough to feel composed',
      'Restraint — motion only where it aids reading',
    ],
    sections: [
      {
        kind: 'prose',
        eyebrow: 'The concept',
        heading: 'Architecture sites usually pick the wrong enemy.',
        body: [
          'Most practices end up with one of two websites. A full-screen slideshow that hides the work behind a carousel nobody clicks through, or a dense project grid that flattens twelve years of buildings into identical thumbnails.',
          'Both fail for the same reason: they treat the page as the thing being designed. This concept starts from the opposite assumption — that the work is already good, and the interface’s only job is to hold it steadily and get out of the way.',
          'The whole layout runs on a strict twelve-column grid with a single cool accent. Everything that could be decoration is removed until only structure, type, and image remain.',
        ],
      },
      {
        kind: 'palette',
        eyebrow: 'Visual direction',
        heading: 'Stone, charcoal, and one cool accent.',
        body: 'The palette is deliberately close to a set of physical materials. Nothing is saturated except a single slate-blue that marks interaction and nothing else, so a link always reads as a link.',
        swatches: [
          { name: 'Charcoal', value: '#14161a', note: 'Page ground' },
          { name: 'Graphite', value: '#2a2e35', note: 'Elevated surfaces' },
          { name: 'Stone', value: '#8b8d92', note: 'Secondary type' },
          { name: 'Bone', value: '#ece9e4', note: 'Primary type' },
          { name: 'Slate blue', value: '#8fa9d9', note: 'Interaction only' },
        ],
      },
      {
        kind: 'screen',
        eyebrow: 'Project index',
        heading: 'An index that stays scannable at forty projects.',
        body: 'A table, not a gallery. Year, name, location and type in a fixed rhythm, with the image revealed on hover rather than pre-loaded forty times over. It stays fast and it stays readable at any length.',
        screen: 'index',
        frame: 'browser',
        layout: 'split-left',
        caption: 'Project index',
      },
      {
        kind: 'screens',
        eyebrow: 'Inside a project',
        heading: 'The case study is the point.',
        body: 'A project page alternates full-bleed images with a narrow measure of text, so drawings and prose never compete for the same column.',
        items: [
          { screen: 'detail', caption: 'Project detail — image and text alternate' },
          { screen: 'philosophy', caption: 'Studio — practice and approach' },
        ],
      },
      {
        kind: 'screen',
        eyebrow: 'Responsive',
        heading: 'The grid collapses; the hierarchy does not.',
        body: 'On a phone the twelve columns become one, the display type steps down two sizes, and the hover-revealed index images become always-visible thumbnails — because there is no hover to rely on.',
        screen: 'mobile',
        frame: 'phone',
        layout: 'split-right',
        caption: 'Mobile — index and project detail',
      },
      {
        kind: 'build',
        eyebrow: 'Technical',
        heading: 'Built from the ground up.',
        body: 'No template, no page builder, no component library. The layout is CSS Grid with named areas, and the type scale is a set of clamp() ramps so it never needs a breakpoint to stay proportional.',
        items: [
          { label: 'React + TypeScript', detail: 'Typed content model, no CMS lock-in' },
          { label: 'CSS Grid', detail: 'A real 12-column system with named areas' },
          { label: 'Motion', detail: 'Reveal and image transitions only' },
          { label: 'Fluid type', detail: 'clamp() ramps instead of breakpoint jumps' },
        ],
      },
    ],
    meta: {
      title: 'Atelier Nord — Architecture Studio Concept',
      description:
        'A self-directed concept exploring how an architecture practice could present its work with stronger editorial hierarchy. Design and build by Tejas Naik.',
    },
  },

  /* ── 02 — Vela ────────────────────────────────────────────────────────── */
  {
    slug: 'vela',
    title: 'Vela',
    category: 'AI Product / SaaS',
    type: 'concept',
    year: '2026',
    shortDescription:
      'A product site for a technical audience that wants to see the thing, not read adjectives about it.',
    description:
      'A concept interface exploring an AI product workflow with a focus on clarity, hierarchy and interaction — built as a real product surface rather than a marketing illustration of one.',
    technologies: ['React', 'TypeScript', 'Tailwind', 'Motion'],
    accent: '#4d8dff',
    heroVisual: 'product',
    heroScreen: 'marketing',
    designDirection: 'Controlled dark UI. Density without noise.',
    highlights: [
      'Product UI rendered in the browser, not screenshotted',
      'Dense information kept legible',
      'A credible technical voice',
    ],
    sections: [
      {
        kind: 'prose',
        eyebrow: 'The concept',
        heading: 'Developer tools get judged in about fifteen seconds.',
        body: [
          'The audience for a product like this has already seen forty landing pages with a gradient, a headline about "unlocking potential", and a screenshot blurred just enough to hide that the product is thin.',
          'So this concept does the opposite. The product surface is the hero — a real, composed interface above the fold — and the copy stays specific enough that an engineer could argue with it.',
          'The harder design problem is density. A workflow tool has to show a lot at once without becoming noise, which makes hierarchy, spacing and restraint the entire job.',
        ],
      },
      {
        kind: 'palette',
        eyebrow: 'Visual direction',
        heading: 'One accent, used sparingly.',
        body: 'A near-black ground with a single azure accent reserved for state and action. The violet appears only in gradients at the edges of the composition, never on text, so contrast stays predictable.',
        swatches: [
          { name: 'Void', value: '#07090f', note: 'App ground' },
          { name: 'Panel', value: '#0e131c', note: 'Sidebar and cards' },
          { name: 'Line', value: '#1e2530', note: 'Dividers' },
          { name: 'Azure', value: '#4d8dff', note: 'Action and active state' },
          { name: 'Signal', value: '#22d3ee', note: 'Run status only' },
        ],
      },
      {
        kind: 'screen',
        eyebrow: 'The product',
        heading: 'A workspace that survives real density.',
        body: 'Sidebar, workspace, and an inspector that only appears when something is selected. Every row is scannable at a glance, and the interface stays quiet until you act on it.',
        screen: 'app',
        frame: 'browser',
        layout: 'full',
        caption: 'Application shell — sidebar, workspace, inspector',
      },
      {
        kind: 'screens',
        eyebrow: 'Interaction',
        heading: 'Where the thinking actually shows.',
        body: 'Two surfaces that would be easy to get wrong: a node workflow that has to stay legible as it grows, and settings that have to stay boring on purpose.',
        items: [
          { screen: 'workflow', caption: 'Workflow builder — nodes and connections' },
          { screen: 'settings', caption: 'Settings — deliberately unremarkable' },
        ],
      },
      {
        kind: 'screen',
        eyebrow: 'Responsive',
        heading: 'A workspace that folds down honestly.',
        body: 'The sidebar becomes a sheet, the inspector becomes a bottom drawer, and the workflow canvas gets pan-and-zoom instead of pretending a graph fits on a phone.',
        screen: 'mobile',
        frame: 'phone',
        layout: 'split-right',
        caption: 'Mobile — workspace and run detail',
      },
      {
        kind: 'build',
        eyebrow: 'Technical',
        heading: 'Built from the ground up.',
        body: 'Every surface here is real DOM — no image assets, no screenshots. That is deliberate: it keeps the concept fast, crisp at any density, and editable rather than frozen.',
        items: [
          { label: 'React + TypeScript', detail: 'Typed component API across every surface' },
          { label: 'Tailwind v4', detail: 'Token-driven, no arbitrary values in components' },
          { label: 'Container queries', detail: 'Screens scale by container, not viewport' },
          { label: 'Motion', detail: 'Transform and opacity only — no layout animation' },
        ],
      },
    ],
    meta: {
      title: 'Vela — AI Product Interface Concept',
      description:
        'A self-directed concept exploring an AI product workflow with a focus on clarity, hierarchy and interaction. Design and build by Tejas Naik.',
    },
  },

  /* ── 03 — Monument ────────────────────────────────────────────────────── */
  {
    slug: 'monument',
    title: 'Monument',
    category: 'Luxury Hospitality',
    type: 'concept',
    year: '2026',
    shortDescription:
      'Atmosphere first, then the two things every guest actually came for: a room and a table.',
    description:
      'A self-directed concept exploring how a small luxury hotel could hold its atmosphere online without burying the one thing a guest arrived to do — book a room.',
    technologies: ['React', 'TypeScript', 'Motion', 'Node.js'],
    accent: '#f0b357',
    heroVisual: 'hospitality',
    heroScreen: 'home',
    designDirection: 'Warm neutrals, editorial type, unhurried pacing.',
    highlights: [
      'A warm accent working inside a dark system',
      'Booking permanently reachable at every scroll position',
      'Mobile-first — most guests arrive on a phone',
    ],
    sections: [
      {
        kind: 'prose',
        eyebrow: 'The concept',
        heading: 'Hotel sites bury the booking under the mood.',
        body: [
          'Luxury hospitality has a recurring failure: an achingly slow mood film, a full-screen image carousel, and a "Reserve" link hidden in a hamburger menu three taps away.',
          'The atmosphere matters — it is most of what is being sold. But atmosphere and utility are not actually in conflict, and treating them as a trade-off is a design failure rather than a constraint.',
          'This concept keeps the imagery full-bleed and the pacing unhurried, while a booking bar stays reachable at every scroll position on every screen size.',
        ],
      },
      {
        kind: 'palette',
        eyebrow: 'Visual direction',
        heading: 'Warm neutrals against a low, dark ground.',
        body: 'A warm amber accent carries every call to action. The surrounding neutrals are pulled slightly warm too, so the accent reads as candlelight rather than as a highlighter.',
        swatches: [
          { name: 'Ink', value: '#12100d', note: 'Page ground' },
          { name: 'Umber', value: '#241f18', note: 'Elevated surfaces' },
          { name: 'Linen', value: '#e8e2d8', note: 'Primary type' },
          { name: 'Sand', value: '#a99e8d', note: 'Secondary type' },
          { name: 'Amber', value: '#f0b357', note: 'Booking and action' },
        ],
      },
      {
        kind: 'screen',
        eyebrow: 'Booking',
        heading: 'The part everyone gets wrong.',
        body: 'Dates, guests and room type in a single row that collapses to a sheet on mobile. Availability is shown inline on the calendar rather than after a submit, so nobody discovers a sold-out night three steps in.',
        screen: 'booking',
        frame: 'browser',
        layout: 'split-left',
        caption: 'Booking panel with inline availability',
      },
      {
        kind: 'screens',
        eyebrow: 'Rooms & dining',
        heading: 'Two rooms, two very different jobs.',
        body: 'Room cards have to sell a space and state a price without feeling like a listings site. The restaurant page has to work for someone who is not staying the night at all.',
        items: [
          { screen: 'rooms', caption: 'Rooms — cards and detail' },
          { screen: 'dining', caption: 'Dining — menu and reservation' },
        ],
      },
      {
        kind: 'screen',
        eyebrow: 'Responsive',
        heading: 'Designed for the phone first.',
        body: 'Most hospitality traffic is mobile, often mid-journey. The booking bar becomes a docked sheet, imagery keeps its full-bleed treatment, and every tap target clears 44px.',
        screen: 'mobile',
        frame: 'phone',
        layout: 'split-right',
        caption: 'Mobile — home and booking sheet',
      },
      {
        kind: 'build',
        eyebrow: 'Technical',
        heading: 'Built from the ground up.',
        body: 'A booking flow is where a hospitality site actually earns its keep, so the concept treats state, availability and validation as design problems rather than backend details.',
        items: [
          { label: 'React + TypeScript', detail: 'Typed booking state end to end' },
          { label: 'Motion', detail: 'Sheet and gallery transitions' },
          { label: 'Node.js', detail: 'Availability and reservation endpoints' },
          { label: 'Mobile-first', detail: 'Composed at 375px, then scaled up' },
        ],
      },
    ],
    meta: {
      title: 'Monument — Luxury Hospitality Concept',
      description:
        'A self-directed concept exploring how a small luxury hotel could keep its atmosphere online without burying the booking. Design and build by Tejas Naik.',
    },
  },
];

/** `noUncheckedIndexedAccess` is on, so callers must handle undefined. */
export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Wraps at both ends, so Previous/Next never dead-ends. */
export function getAdjacent(
  slug: string,
): { prev: Project; next: Project } | null {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return null;

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  if (!prev || !next) return null;

  return { prev, next };
}
