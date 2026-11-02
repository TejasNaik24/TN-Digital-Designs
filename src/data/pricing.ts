import type { ProjectType } from './projectTypes';

export type Tier = {
  id: string;
  name: string;
  /** Shown as "Starting at $…". While any tier still reads 'X,XXX' the
   *  assistant refuses to quote prices (see lib/assistant/studio.ts). */
  startingAt: string;
  /** Who this tier is for, in the customer's terms. */
  forWho: string;
  includes: string[];
  /** A condition that changes the price, in the third person — this exact text
   *  goes into the assistant's facts, so keep it factual. */
  note?: string;
  /** The same condition in the page's first-person voice, shown under the
   *  tier's list. Keep it saying exactly what `note` says. */
  pageNote?: string;
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
    startingAt: '750',
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
    startingAt: '1,800',
    forWho: 'For a business that takes bookings, orders or enquiries online.',
    includes: [
      'Everything in the Starter site',
      'Up to 12 pages',
      'One working feature, like the booking, menu or class schedule in my concepts',
      'Content you can edit yourself',
      'Visitor analytics set up',
    ],
    note: 'Taking payments online (ordering, checkout) is quoted separately. For most small businesses Tejas connects tools you may already use, like Square, Toast or Stripe, rather than building custom checkout.',
    pageNote: 'Taking payments online (ordering, checkout) is quoted separately. For most small businesses I connect tools you may already use, like Square, Toast or Stripe, rather than building custom checkout.',
    projectType: 'Business site',
    recommended: true,
  },
  {
    id: 'ai',
    name: 'Site + AI feature',
    startingAt: '2,800',
    forWho: 'For a business that answers the same questions all day.',
    includes: [
      'Everything in the Business site',
      'An assistant that answers from your own FAQ, like the Northgate demo',
      'Scripted answers if the AI is ever unavailable',
      'Usage limits so running costs stay predictable',
    ],
    note: 'The assistant runs on an AI account in your business’s name, which Tejas sets up for you. Running costs are usually low at small-business traffic and depend on usage. You pay the provider directly.',
    pageNote: 'The assistant runs on an AI account in your business’s name, which I set up for you. Running costs are usually low at small-business traffic and depend on usage. You pay the provider directly.',
    projectType: 'Site + AI feature',
  },
];

/** Shown under the tiers and known to the assistant. Never pair it with a
 *  count of remaining spots or any urgency — the assistant is told the same. */
export const foundingOffer =
  'Founding clients: my first 3 clients get 25% off in exchange for an honest review and permission to show the finished site.';
