/**
 * POST /api/chat — the Northgate Dental demo assistant.
 *
 * A Vercel Function (Web-standard handler) living beside the Vite app. The
 * Gemini key stays here, server-side; it is never in the browser bundle.
 *
 * Always answers. Falls back to a scripted reply from the same knowledge base
 * when: no GEMINI_API_KEY, the visitor is over the rate limit, Gemini returns
 * 429/403 (free-tier quota), it times out, the reply is empty or cut off, or
 * anything else goes wrong. `source` tells the client which path answered.
 *
 * Relative imports keep their `.js` extension: Vercel runs this as native ESM.
 */
import {
  MAX_HISTORY_TURNS,
  MAX_MESSAGE_CHARS,
  scriptedAnswer,
  systemPrompt,
  type ChatReply,
  type ChatTurn,
} from '../src/demos/clinic/assistant.js';

/** Recommended by Google for new projects (Nov 2026); override with GEMINI_MODEL. */
const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const TIMEOUT_MS = 8_000;
/**
 * Generous on purpose: Gemini counts THINKING tokens toward this cap, so a
 * tight limit can be spent entirely on reasoning and return an empty answer.
 * Reply length is held down by the prompt (≤ 3 sentences) instead.
 */
const MAX_OUTPUT_TOKENS = 1024;

/* ── Rate limiting ────────────────────────────────────────────────────────
   Best-effort and PER FUNCTION INSTANCE: Vercel can run several instances,
   each with its own Map, and a cold start resets it. Good enough to stop a
   casual loop hammering the free tier; a hard guarantee would need a shared
   store (e.g. Upstash Redis), deliberately not added for a demo. */

const PER_MINUTE = 8;
const PER_DAY = 40;
const hits = new Map<string, number[]>();

function overLimit(ip: string, now = Date.now()): boolean {
  const day = 24 * 60 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < day);
  const lastMinute = recent.filter((t) => now - t < 60_000).length;
  if (lastMinute >= PER_MINUTE || recent.length >= PER_DAY) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep memory bounded on a long-lived instance.
  if (hits.size > 5_000) hits.clear();
  return false;
}

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/* ── Gemini ──────────────────────────────────────────────────────────────── */

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
};

async function callGemini(apiKey: string, history: ChatTurn[], withThinkingConfig: boolean): Promise<Response> {
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt() }] },
      contents: history.map((turn) => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.text }],
      })),
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: 0.3,
        // Least reasoning: a FAQ lookup doesn't need it, and it's faster and
        // cheaper. Not every model accepts this, so a 400 retries without it.
        ...(withThinkingConfig ? { thinkingConfig: { thinkingLevel: 'minimal' } } : {}),
      },
    }),
  });
}

async function askGemini(apiKey: string, history: ChatTurn[]): Promise<string | null> {
  let response = await callGemini(apiKey, history, true);
  if (response.status === 400) response = await callGemini(apiKey, history, false);

  // 429 RESOURCE_EXHAUSTED (free-tier quota) and 403 land here too.
  if (!response.ok) {
    console.warn(`[chat] Gemini ${response.status}; using scripted answer`);
    return null;
  }

  const data = (await response.json()) as GeminiResponse;
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.map((part) => part.text ?? '').join('').trim();
  // An empty or truncated answer is worse than a scripted one.
  if (!text || candidate?.finishReason === 'MAX_TOKENS') return null;
  return text;
}

/* ── Input ───────────────────────────────────────────────────────────────── */

/** Accept only well-formed text turns, capped in length and count. The client
 *  sends message text only — it can't supply or override the system prompt. */
function parseHistory(body: unknown): ChatTurn[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const turns: ChatTurn[] = [];
  for (const message of messages.slice(-MAX_HISTORY_TURNS)) {
    const role = (message as { role?: unknown })?.role;
    const text = (message as { text?: unknown })?.text;
    if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string') return null;
    turns.push({ role, text: text.slice(0, MAX_MESSAGE_CHARS) });
  }
  // Gemini requires the conversation to start with the user and end with them.
  while (turns[0]?.role === 'assistant') turns.shift();
  if (turns.at(-1)?.role !== 'user') return null;
  return turns;
}

const json = (reply: ChatReply | { error: string }, status = 200) =>
  Response.json(reply, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Send JSON: { messages: [{ role, text }] }' }, 400);
  }

  const history = parseHistory(body);
  if (!history) return json({ error: 'The last message must be from the user.' }, 400);

  const question = history.at(-1)?.text ?? '';
  const scripted = (): Response => json({ text: scriptedAnswer(question), source: 'scripted' });

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return scripted();
  if (overLimit(clientIp(request))) return scripted();

  try {
    const text = await askGemini(apiKey, history);
    return text ? json({ text, source: 'ai' }) : scripted();
  } catch (error) {
    // Timeouts (AbortSignal) and network failures.
    console.warn('[chat] Gemini request failed; using scripted answer', error);
    return scripted();
  }
}
