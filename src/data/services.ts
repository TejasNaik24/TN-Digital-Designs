export type Service = {
  id: string;
  label: string;
  title: string;
  description: string;
  /** Concrete deliverables — vague service copy is what makes sites forgettable. */
  includes: string[];
};

/** Framed as outcomes, not feature lists. AI is one of four capabilities here,
 *  never the identity of the studio.
 *
 *  Text only (icons live in Services.tsx) so the studio assistant's serverless
 *  function can import it. */
export const services: Service[] = [
  {
    id: 'websites',
    label: 'Websites',
    title: 'Turn visitors into customers.',
    description:
      'Marketing sites and landing pages that load fast, read clearly, and turn visitors into enquiries instead of bounces.',
    includes: ['Marketing sites', 'Landing pages', 'Rebuilds & redesigns'],
  },
  {
    id: 'applications',
    label: 'Web Applications',
    title: 'More than a pretty page.',
    description:
      'Dashboards, portals, booking systems, and internal tools — with an actual backend, real auth, and data you can rely on.',
    includes: ['Dashboards', 'Client portals', 'Internal tools'],
  },
  {
    id: 'ai',
    label: 'AI Features',
    title: 'AI where it actually helps.',
    description:
      'Chat, intelligent search, recommendations, and automation — wired into your product properly, and only where it makes the product better.',
    includes: ['Assistants & chat', 'Semantic search', 'Workflow automation'],
  },
  {
    id: 'experiences',
    label: 'Interactive',
    title: 'Give people something to remember.',
    description:
      'Motion, scroll choreography, and micro-interactions that make a site feel considered — the difference between looking at a site and remembering it.',
    includes: ['Motion design', 'Scroll experiences', 'Micro-interactions'],
  },
];
