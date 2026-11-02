/**
 * The shared core of every site assistant (the clinic demo and the studio).
 *
 * Imported by BOTH the browser widgets and the `api/chat.ts` serverless
 * function, so: no React, no browser APIs, no `@/` aliases, and relative
 * imports keep their `.js` extension (Vercel runs `api/` as native ESM).
 *
 * Each assistant supplies an `AssistantConfig`; everything here is the part
 * they have in common.
 */

export type ChatTurn = { role: 'user' | 'assistant'; text: string };

/** A project summary the visitor agreed to hand to the contact form. */
export type Handoff = { projectType: string; budget: string; details: string };

export type ChatReply = {
  text: string;
  source: 'ai' | 'scripted';
  handoff?: Handoff;
};

export type AssistantId = 'clinic' | 'studio';

export type AssistantConfig = {
  id: AssistantId;
  /** The model's entire world. Built on the server; never sent by a browser. */
  systemPrompt: () => string;
  /** Keyword answer used when Gemini can't be (no key, quota, timeout…). */
  scriptedReply: (question: string) => { text: string; handoff?: Handoff };
  /** When set, a trailing `HANDOFF {...}` line in the model's reply is parsed
   *  and validated against these options. */
  handoffOptions?: { projectTypes: readonly string[]; budgets: readonly string[] };
};

/** Limits shared by client (to stop typing) and server (to enforce). */
export const MAX_MESSAGE_CHARS = 500;
export const MAX_HISTORY_TURNS = 6;
export const MAX_HANDOFF_DETAILS = 600;

export type KnowledgeEntry = { topic: string; keywords: string[]; answer: string };

/** The best-scoring entry for a question, or null if nothing matched. Ties go
 *  to the earlier entry, so order entries from most to least specific. */
export function bestMatch<T extends KnowledgeEntry>(question: string, entries: readonly T[]): T | null {
  const q = question.toLowerCase();
  let best: { score: number; entry: T | null } = { score: 0, entry: null };
  for (const entry of entries) {
    const score = entry.keywords.reduce((n, keyword) => n + (q.includes(keyword) ? 1 : 0), 0);
    if (score > best.score) best = { score, entry };
  }
  return best.entry;
}

const HANDOFF_LINE = /\n?[ \t]*HANDOFF[ \t]*(\{[\s\S]*\})[ \t]*$/;

/**
 * Splits a model reply into the visible text and an optional handoff.
 *
 * The model is told to end with `HANDOFF {"projectType", "budget", "details"}`
 * only after the visitor says yes. Anything that doesn't validate is dropped
 * silently — the visitor still gets the text, just no button.
 */
export function parseHandoff(
  raw: string,
  options: { projectTypes: readonly string[]; budgets: readonly string[] },
): { text: string; handoff?: Handoff } {
  const match = raw.match(HANDOFF_LINE);
  if (!match) return { text: raw.trim() };

  const text = raw.slice(0, match.index).trim();
  try {
    const data = JSON.parse(match[1] ?? '') as Record<string, unknown>;
    const projectType = typeof data.projectType === 'string' ? data.projectType.trim() : '';
    const budget = typeof data.budget === 'string' ? data.budget.trim() : '';
    const details = typeof data.details === 'string' ? data.details.trim() : '';

    if (!options.projectTypes.includes(projectType)) return { text };
    if (budget && !options.budgets.includes(budget)) return { text };
    if (!details) return { text };

    return { text, handoff: { projectType, budget, details: details.slice(0, MAX_HANDOFF_DETAILS) } };
  } catch {
    return { text };
  }
}
