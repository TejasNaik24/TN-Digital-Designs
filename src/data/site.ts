/**
 * Site-wide identity and copy.
 *
 * This is a studio site — a sales tool for winning web development work. It is
 * deliberately not a CV: no employers, no research, no credentials.
 */
const REPLY_TIME = 'within a day';

export const site = {
  name: 'Tejas Naik',
  monogram: 'TN',
  role: 'Digital Studio',

  /** From VITE_SITE_URL (set in vite.config.ts, with its default). To move to
   *  a custom domain, change that env var — nothing else. No trailing slash. */
  // Guarded because the assistant's serverless function also loads this file,
  // and import.meta.env doesn't exist there. Keep the full
  // `import.meta.env.VITE_SITE_URL` expression: Vite's `define` matches it
  // literally, and `?.` would slip past the replacement.
  url: typeof import.meta.env === 'object' ? import.meta.env.VITE_SITE_URL : '',

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

  /** Shown in the Contact lede ("usually reply …") and quoted by the studio
   *  assistant as the typical reply time. */
  replyTime: REPLY_TIME,

  contact: {
    heading: ['Tell me what you’re building.', 'I’ll take it from there.'],
    lede: `I personally review every project enquiry and usually reply ${REPLY_TIME}. No sales team, no discovery-call funnel — just a straight answer about whether I’m the right fit.`,
  },
} as const;

// Order must match the section order in App.tsx — nav links jump in document
// order, so a mismatch here makes clicking through the nav scroll backward.
export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Questions', href: '#faq' },
  { label: 'Contact', href: '#contact' },
] as const;
