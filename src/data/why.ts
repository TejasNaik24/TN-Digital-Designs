export type Reason = {
  id: string;
  title: string;
  body: string;
};

/** Text only (icons live in WhyMe.tsx) so the studio assistant's serverless
 *  function can import it. Written as plain statements of fact about how the work happens — not
 *  agency-brochure claims. If a line could appear on any studio's site, it's
 *  the wrong line. */
export const reasons: Reason[] = [
  {
    id: 'ownership',
    title: 'One person, full ownership',
    body: 'You talk to the person building it. No account manager relaying your feedback, no handoff where the detail quietly goes missing.',
  },
  {
    id: 'design-engineering',
    title: 'Design and engineering in one head',
    body: 'The person choosing the typography is the person writing the code. Nothing gets watered down in translation between a design file and a build.',
  },
  {
    id: 'custom',
    title: 'Custom, never a template',
    body: 'Built from scratch around your business. No page builders, no theme a visitor has already seen on three other sites this week.',
  },
  {
    id: 'full-stack',
    title: 'Full-stack when you need it',
    body: 'Custom functionality, integrations, dashboards, AI features — built properly into the product rather than bolted on with a plugin.',
  },
  {
    id: 'fast',
    title: 'Fast, without cutting corners',
    body: 'Modern AI-assisted development lets me move at studio speed on a solo timeline. It changes how quickly I work, not where the quality bar sits.',
  },
  {
    id: 'performance',
    title: 'Performance and accessibility by default',
    body: 'Not line items on a quote. Fast loads, keyboard support, and real contrast are simply how the site gets built in the first place.',
  },
];
