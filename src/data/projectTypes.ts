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
