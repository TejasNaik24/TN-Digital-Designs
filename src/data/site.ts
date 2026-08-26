/**
 * Site-wide identity and copy.
 *
 * This is a studio site — a sales tool for winning web development work. It is
 * deliberately not a CV: no employers, no research, no credentials.
 */
export const site = {
  name: 'Tejas Naik',
  monogram: 'TN',
  role: 'Digital Studio',

  /** REPLACE: swap in a custom domain when there is one (also in index.html,
   *  public/robots.txt and public/sitemap.xml). */
  url: 'https://tn-digital.com',

  email: 'naik.tejas11@gmail.com',

  /** REPLACE: verify these handles before launch. */
  social: {
    github: 'https://github.com/TejasNaik24',
    linkedin: 'https://linkedin.com/in/tejas-naik2028',
  },

  availability: {
    open: true,
    label: 'Available for new projects',
  },

  hero: {
    eyebrow: 'Web design & development',
    headline: ['I build websites that', 'make people trust you'],
    headlineAccent: 'before you say a word.',
    lede: 'Custom websites, web applications, and AI-powered features for companies that want to stand out — designed, built, and shipped end to end. No templates, no agency layers.',
  },

  statement:
    'Your website is often the first interaction someone has with your company. It should feel like it.',

  contact: {
    heading: ['Tell me what you’re building.', 'I’ll take it from there.'],
    lede: 'I personally review every project enquiry and usually reply within a day. No sales team, no discovery-call funnel — just a straight answer about whether I’m the right fit.',
  },
} as const;

// Order must match the section order in App.tsx — nav links jump in document
// order, so a mismatch here makes clicking through the nav scroll backward.
export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Questions', href: '#faq' },
  { label: 'Contact', href: '#contact' },
] as const;
