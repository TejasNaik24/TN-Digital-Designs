/**
 * Brand tokens for the three concept businesses.
 *
 * One source shared by the full demo site, its Work-card preview and its slot
 * in the hero mockup, so the three can never disagree about what the business
 * looks like.
 *
 * Every business here is fictional. The demo sites carry a ConceptBanner and
 * the cards carry a ConceptBadge — never remove either.
 *
 * Deliberately NOT the studio's dark look: each one should read as somebody
 * else's website. Each palette was checked against its own ground for 4.5:1
 * body contrast.
 */

export type DemoSlug = 'restaurant' | 'clinic' | 'gym';

export type Brand = {
  name: string;
  /** Short line used in previews. */
  tagline: string;
  font: string;
  colors: {
    ground: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    /** Text that sits on `accent`. */
    onAccent: string;
    line: string;
  };
};

export const brands: Record<DemoSlug, Brand> = {
  /**
   * A neighbourhood trattoria. Sage paper and olive ink rather than the usual
   * cream-and-terracotta, chili red for the one thing that matters (booking).
   * Bricolage's narrow width axis gives the menu-board feel.
   */
  restaurant: {
    name: 'Ferro',
    tagline: 'Wood-fire kitchen on Elm Street',
    font: '"Bricolage Grotesque Variable", ui-sans-serif, system-ui, sans-serif',
    colors: {
      ground: '#e7ebdf',
      surface: '#f3f5ee',
      ink: '#1f261a',
      muted: '#4f5a44',
      accent: '#b8321b',
      onAccent: '#fff8f2',
      line: '#c9d0bd',
    },
  },

  /**
   * A family dental practice. White, deep-teal ink, a mint wash for calm
   * surfaces. Warm coral is reserved for urgent care only.
   */
  clinic: {
    name: 'Northgate Dental',
    tagline: 'Family dentistry, unhurried',
    font: '"Figtree Variable", ui-sans-serif, system-ui, sans-serif',
    colors: {
      ground: '#ffffff',
      surface: '#e8f4f1',
      ink: '#0e2a30',
      muted: '#3e5b60',
      accent: '#0d6e66',
      onAccent: '#ffffff',
      line: '#cfe3de',
    },
  },

  /**
   * A strength gym. Concrete, warm black, one hot orange signal. Big Shoulders
   * for the schedule-board display type; Figtree keeps the small print legible.
   *
   * Orange is FILL ONLY. As text on the concrete ground it measures 2.41:1 and
   * fails; as a fill with `onAccent` black text on it, 5.85:1.
   */
  gym: {
    name: 'Groundwork',
    tagline: 'A coach-led strength gym',
    font: '"Big Shoulders Display Variable", Impact, ui-sans-serif, sans-serif',
    colors: {
      ground: '#e4e2dd',
      surface: '#f4f3ef',
      ink: '#17150f',
      muted: '#4c4943',
      accent: '#ff5a1f',
      onAccent: '#17150f',
      line: '#c8c5bd',
    },
  },
};

/** Body face for the gym, whose display face is too condensed for paragraphs. */
export const GYM_BODY_FONT = '"Figtree Variable", ui-sans-serif, system-ui, sans-serif';
