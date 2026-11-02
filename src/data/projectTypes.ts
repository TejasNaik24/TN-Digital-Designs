/** Contact form "Project type" options. The first three match the pricing
 *  tiers, so a tier's "Get a quote" button can pre-select its own option. */
export const PROJECT_TYPES = [
  'Starter site',
  'Business site',
  'Site + AI feature',
  'Website redesign',
  'Web application',
  'AI feature for an existing site',
  'Something else',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

/** Contact form "Budget" options: one band per pricing tier, so the band a
 *  visitor picks says which tier they mean. Revisit if tier prices change.
 *  Here rather than in ContactForm so the studio assistant can validate a
 *  handoff against the exact same list. */
export const BUDGETS = [
  'Under $1,000', // Starter site ($750)
  '$1,000 – $2,500', // Business site ($1,800)
  '$2,500 – $5,000', // Site + AI feature ($2,800)
  '$5,000+',
  'Not sure yet',
] as const;

export type Budget = (typeof BUDGETS)[number];
