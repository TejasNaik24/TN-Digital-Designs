import { Boxes, Layers, Sparkles, Wand2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Service = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Concrete deliverables — vague service copy is what makes sites forgettable. */
  includes: string[];
};

/** Framed as outcomes, not feature lists. AI is one of four capabilities here,
 *  never the identity of the studio. */
export const services: Service[] = [
  {
    id: 'websites',
    label: 'Websites',
    title: 'Turn visitors into customers.',
    description:
      'Marketing sites and landing pages that load fast, read clearly, and turn visitors into enquiries instead of bounces.',
    icon: Layers,
    includes: ['Marketing sites', 'Landing pages', 'Rebuilds & redesigns'],
  },
  {
    id: 'applications',
    label: 'Web Applications',
    title: 'More than a pretty page.',
    description:
      'Dashboards, portals, booking systems, and internal tools — with an actual backend, real auth, and data you can rely on.',
    icon: Boxes,
    includes: ['Dashboards', 'Client portals', 'Internal tools'],
  },
  {
    id: 'ai',
    label: 'AI Features',
    title: 'AI where it actually helps.',
    description:
      'Chat, intelligent search, recommendations, and automation — wired into your product properly, and only where it makes the product better.',
    icon: Sparkles,
    includes: ['Assistants & chat', 'Semantic search', 'Workflow automation'],
  },
  {
    id: 'experiences',
    label: 'Interactive',
    title: 'Give people something to remember.',
    description:
      'Motion, scroll choreography, and micro-interactions that make a site feel considered — the difference between looking at a site and remembering it.',
    icon: Wand2,
    includes: ['Motion design', 'Scroll experiences', 'Micro-interactions'],
  },
];
