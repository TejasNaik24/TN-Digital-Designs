/**
 * Selected work.
 *
 * Every entry here is a CONCEPT — a self-directed build made to explore a
 * particular kind of business. None of them are clients, none of them are
 * shipped products, and the UI labels them as concepts everywhere they appear.
 * Never soften that label to imply real client work.
 *
 * REPLACE: as real client projects ship, swap these entries out. Keep the shape
 * and set `kind: 'client'` — the card and modal already handle it.
 */

export type ProjectVisualKind =
  | 'editorial'
  | 'product'
  | 'hospitality'
  | 'business'
  | 'healthcare';

export type Project = {
  id: string;
  name: string;
  kind: 'concept' | 'client';
  industry: string;
  /** One line for the card. */
  summary: string;
  /** The self-set brief, shown in the case-study modal. */
  brief: string;
  /** What the build is actually demonstrating — the part a client cares about. */
  demonstrates: string[];
  stack: string[];
  visual: ProjectVisualKind;
  /** Drives the card's hover glow and the accent inside its visual. */
  accent: string;
  /** Spans both columns in the work grid. */
  wide?: boolean;
  /** Live demo, once one exists. The card opens the case study either way. */
  href?: string;
};

export const projects: Project[] = [
  {
    id: 'atelier-nord',
    name: 'Atelier Nord',
    kind: 'concept',
    industry: 'Architecture & design studio',
    summary:
      'An editorial portfolio for a practice whose work should be the loudest thing on the page.',
    brief:
      'Architecture studios usually get one of two websites: a slideshow that hides the work, or a grid that flattens it. This explores a third option — a magazine-style layout with enormous type, generous margins, and project imagery given room to actually breathe.',
    demonstrates: [
      'Editorial layout with a real typographic hierarchy',
      'Image-led case studies that stay fast',
      'Restraint — motion only where it aids reading',
    ],
    stack: ['React', 'TypeScript', 'Motion'],
    visual: 'editorial',
    // A cool slate-blue rather than a true neutral — a grey accent reads as
    // "unstyled placeholder" against a grey-on-dark composition.
    accent: '#8fa9d9',
    wide: true,
  },
  {
    id: 'vela',
    name: 'Vela',
    kind: 'concept',
    industry: 'AI startup',
    summary:
      'A product site for a technical audience that wants to see the thing, not read adjectives about it.',
    brief:
      'Developer-facing products get judged in about fifteen seconds. This concept puts a live product surface above the fold, keeps the copy specific, and treats documentation-grade clarity as a design goal rather than an afterthought.',
    demonstrates: [
      'Product UI rendered in the browser, not screenshotted',
      'Dense information kept legible',
      'A credible technical voice',
    ],
    stack: ['React', 'TypeScript', 'Tailwind'],
    visual: 'product',
    accent: '#4d8dff',
  },
  {
    id: 'maison-levant',
    name: 'Maison Levant',
    kind: 'concept',
    industry: 'Restaurant & hospitality',
    summary:
      'Atmosphere first, then the two things every guest actually came for: the menu and a table.',
    brief:
      'Restaurant sites tend to bury reservations under a mood film. This one keeps the atmosphere — full-bleed imagery, warm accent, unhurried pacing — while putting booking one tap away at every scroll position.',
    demonstrates: [
      'Warm accent working inside a dark system',
      'A booking flow that stays permanently reachable',
      'Mobile-first: most guests arrive on a phone',
    ],
    stack: ['React', 'TypeScript', 'Node.js'],
    visual: 'hospitality',
    accent: '#f0b357',
  },
  {
    id: 'northbeam',
    name: 'Northbeam',
    kind: 'concept',
    industry: 'B2B professional services',
    summary:
      'A site for a firm that needs to look like the safe, obvious choice within seconds.',
    brief:
      'B2B buyers are looking for reasons to disqualify you. This explores how structure, clear proof points, and calm typography do more for credibility than a stock photo of a handshake ever will.',
    demonstrates: [
      'Conversion-led structure without hard-sell design',
      'Proof and services legible at a glance',
      'Accessible contrast throughout',
    ],
    stack: ['React', 'TypeScript', 'Tailwind'],
    visual: 'business',
    accent: '#6366f1',
  },
  {
    id: 'westgate-health',
    name: 'Westgate Health',
    kind: 'concept',
    industry: 'Healthcare practice',
    summary:
      'A clinic site built around the two things patients arrive needing: reassurance, and an appointment.',
    brief:
      'Healthcare sites tend to be either sterile or overwhelming — stock photography and a wall of departments. This explores a calmer route: plain language, obvious next steps, and a booking path that someone anxious can follow on a phone without thinking about it.',
    demonstrates: [
      'Calm, legible design under a trust-critical brief',
      'Booking as the primary path, not a buried link',
      'Accessible contrast and type at every size',
    ],
    stack: ['React', 'TypeScript', 'Node.js'],
    visual: 'healthcare',
    accent: '#22d3ee',
  },
];
