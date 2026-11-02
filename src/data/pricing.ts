import type { ProjectType } from './projectTypes';

export type Tier = {
  id: string;
  name: string;
  /** REPLACE: placeholder until real prices are set. Shown as "Starting at $X,XXX". */
  startingAt: string;
  /** Who this tier is for, in the customer's terms. */
  forWho: string;
  includes: string[];
  /** Pre-selected in the contact form when this tier's CTA is clicked. */
  projectType: ProjectType;
  /** Visually emphasised. A recommendation, never a popularity claim — there's
   *  no data behind "most popular", so the label must not imply any. */
  recommended?: boolean;
};

export const tiers: Tier[] = [
  {
    id: 'starter',
    name: 'Starter site',
    startingAt: 'X,XXX',
    forWho: 'For a business that needs to look real online and be easy to contact.',
    includes: [
      'Up to 5 pages, designed for your business',
      'Built mobile-first and fast to load',
      'Contact form that lands in your inbox',
      'Search basics and your Google Business details',
      'Launched on your own domain',
    ],
    projectType: 'Starter site',
  },
  {
    id: 'business',
    name: 'Business site',
    startingAt: 'X,XXX',
    forWho: 'For a business that takes bookings, orders or enquiries online.',
    includes: [
      'Everything in the Starter site',
      'Up to 12 pages',
      'One working feature, like the booking, menu or class schedule in my concepts',
      'Content you can edit yourself',
      'Visitor analytics set up',
    ],
    projectType: 'Business site',
    recommended: true,
  },
  {
    id: 'ai',
    name: 'Site + AI feature',
    startingAt: 'X,XXX',
    forWho: 'For a business that answers the same questions all day.',
    includes: [
      'Everything in the Business site',
      'An assistant that answers from your own FAQ, like the Northgate demo',
      'Scripted answers if the AI is ever unavailable',
      'Usage limits so running costs stay predictable',
    ],
    projectType: 'Site + AI feature',
  },
];
