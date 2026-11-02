import type { DemoSlug } from '@/demos/brands';

/**
 * Selected work — the data behind the Work gallery and every demo route at
 * /work/:slug.
 *
 * Every entry here is a CONCEPT: a fictional local business, built as a real,
 * clickable website to show what a small business could have. None of them are
 * clients, and the UI labels them as concepts everywhere they appear — a
 * ConceptBadge on the card and a ConceptBanner across the top of the demo.
 * Never soften either label, and never invent a client, a testimonial, a
 * review, a metric, or an award.
 *
 * Adding a real client later: set `type: 'client'`, point `demo` at nothing
 * and link out instead. The card reads `type` and changes its badge.
 */

export type Project = {
  /** Route segment: /work/{slug}. Also the key into the demo registry. */
  slug: DemoSlug;
  title: string;
  category: string;
  type: 'concept' | 'client';
  year: string;
  /** One line, used on the card. */
  shortDescription: string;
  /** What a visitor can actually try on the demo — shown on the card. */
  tryIt: string;
  technologies: string[];
  /** Drives the card's hover glow. */
  accent: string;
  /** Spans both columns in the gallery. */
  featured?: boolean;
  meta: { title: string; description: string };
};

export const projects: Project[] = [
  {
    slug: 'restaurant',
    title: 'Ferro',
    category: 'Neighbourhood restaurant',
    type: 'concept',
    year: '2026',
    shortDescription:
      'A wood-fire kitchen that needs two things from its website: show the menu, and fill tables.',
    tryIt: 'Browse the menu, check if it’s open now, request a table.',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    accent: '#b8321b',
    featured: true,
    meta: {
      title: 'Ferro — Restaurant Website Concept by Tejas Naik',
      description:
        'A concept website for a neighbourhood restaurant: menu, live opening hours and table requests. Designed and built by Tejas Naik.',
    },
  },
  {
    slug: 'clinic',
    title: 'Northgate Dental',
    category: 'Dental clinic',
    type: 'concept',
    year: '2026',
    shortDescription:
      'A family practice where nervous patients book in a few calm steps — and get answers without phoning.',
    tryIt: 'Request an appointment, or ask the AI assistant about hours and insurance.',
    technologies: ['React', 'TypeScript', 'Gemini API'],
    accent: '#0d6e66',
    meta: {
      title: 'Northgate Dental — Clinic Website Concept by Tejas Naik',
      description:
        'A concept website for a dental clinic: services, team, booking requests and an AI assistant for common questions. Designed and built by Tejas Naik.',
    },
  },
  {
    slug: 'gym',
    title: 'Groundwork',
    category: 'Fitness studio',
    type: 'concept',
    year: '2026',
    shortDescription:
      'A strength gym whose schedule and prices are the whole sales pitch — so they’re the first thing you see.',
    tryIt: 'Filter the class schedule, compare plans, book a free trial class.',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    accent: '#ff5a1f',
    meta: {
      title: 'Groundwork — Gym Website Concept by Tejas Naik',
      description:
        'A concept website for a strength gym: filterable class schedule, membership pricing and free-trial sign-up. Designed and built by Tejas Naik.',
    },
  },
];

/** `noUncheckedIndexedAccess` is on, so callers must handle undefined. */
export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
