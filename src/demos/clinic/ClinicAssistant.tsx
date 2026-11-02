import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/cn';
import { MAX_HISTORY_TURNS, MAX_MESSAGE_CHARS, scriptedAnswer, type ChatReply, type ChatTurn } from './assistant';
import { phone } from './data';

const GREETING: ChatTurn = {
  role: 'assistant',
  text: 'Hi! I can answer questions about our hours, insurance, services and booking. What would you like to know?',
};

const SUGGESTIONS = ['When are you open?', 'Do you take my insurance?', 'What services do you offer?', 'Can I bring my kids?'];

/**
 * Ask the server, which uses Gemini when it has a key and scripted answers
 * otherwise. If the function can't be reached at all (offline, static
 * preview), answer from the same knowledge base right here — the widget never
 * leaves a question hanging.
 */
async function ask(history: ChatTurn[]): Promise<ChatReply> {
  const question = history.at(-1)?.text ?? '';
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-MAX_HISTORY_TURNS) }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const reply = (await response.json()) as Partial<ChatReply>;
    if (typeof reply.text !== 'string' || !reply.text) throw new Error('empty reply');
    return { text: reply.text, source: reply.source === 'ai' ? 'ai' : 'scripted' };
  } catch {
    return { text: scriptedAnswer(question), source: 'scripted' };
  }
}

export function ClinicAssistant() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useFocusTrap(panel, open);

  // The trap focuses the first control (Close); typing is what people came for.
  // On close, focus goes back to the launcher here rather than via the trap:
  // the launcher is hidden before the trap runs, so the trap only sees <body>.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      launcher.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [turns, pending]);

  const send = async (text: string) => {
    const question = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!question || pending) return;
    const history: ChatTurn[] = [...turns, { role: 'user', text: question }];
    setTurns(history);
    setDraft('');
    setPending(true);
    // The greeting is UI, not conversation; the server drops leading assistant turns anyway.
    const reply = await ask(history.slice(1));
    setTurns((current) => [...current, { role: 'assistant', text: reply.text }]);
    setPending(false);
    input.current?.focus({ preventScroll: true });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void send(draft);
  };

  return (
    <>
      <button
        ref={launcher}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        hidden={open}
        className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--d-accent)] px-5 font-semibold text-[var(--d-on-accent)] shadow-[0_8px_24px_rgba(14,42,48,0.22)] sm:bottom-6 sm:right-6"
      >
        <MessageCircle aria-hidden="true" className="size-5" strokeWidth={2} />
        Ask a question
      </button>

      {open && (
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
          tabIndex={-1}
          className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(36rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-3xl border border-[var(--d-line)] bg-white shadow-[0_16px_48px_rgba(14,42,48,0.24)] focus:outline-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[24rem]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--d-line)] px-5 py-4">
            <div>
              <h2 id="assistant-title" className="text-lg font-semibold">
                Northgate front desk
              </h2>
              <p className="text-sm text-[var(--d-muted)]">Answers from this page. For your treatment, call {phone}.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full hover:bg-[var(--d-surface)]"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div ref={log} role="log" aria-live="polite" aria-busy={pending} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
            {turns.map((turn, index) => (
              <p
                key={index}
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed',
                  turn.role === 'user' ? 'self-end bg-[var(--d-accent)] text-[var(--d-on-accent)]' : 'self-start bg-[var(--d-surface)]',
                )}
              >
                <span className="sr-only">{turn.role === 'user' ? 'You: ' : 'Northgate: '}</span>
                {turn.text}
              </p>
            ))}
            {pending && <p className="self-start px-1 text-sm text-[var(--d-muted)]">Typing…</p>}

            {turns.length === 1 && (
              <ul aria-label="Suggested questions" className="mt-1 flex flex-wrap gap-2">
                {SUGGESTIONS.map((question) => (
                  <li key={question}>
                    <button
                      type="button"
                      onClick={() => void send(question)}
                      className="min-h-11 rounded-full border border-[var(--d-line)] px-4 text-sm font-medium hover:border-[var(--d-accent)]"
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-[var(--d-line)] p-3">
            <label htmlFor="assistant-input" className="sr-only">
              Your question
            </label>
            <input
              ref={input}
              id="assistant-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MAX_MESSAGE_CHARS}
              autoComplete="off"
              placeholder="Ask about hours, insurance…"
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-[var(--d-line)] px-4 text-base placeholder:text-[var(--d-muted)]"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              aria-label="Send question"
              className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--d-accent)] text-[var(--d-on-accent)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Send aria-hidden="true" className="size-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
