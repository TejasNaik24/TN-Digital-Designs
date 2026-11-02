import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { EASE_EXPO } from '@/lib/motion';
import { useAnchorNavigate } from '@/lib/navigation';
import { prefillContact } from '@/lib/quote';
import { MAX_MESSAGE_CHARS, type Handoff } from '@/lib/assistant/core';
import { scriptedReply } from '@/lib/assistant/studio';
import { useAssistantChat, useAssistantPanel } from '@/lib/assistant/useAssistantChat';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/**
 * The studio's own assistant, on / and /work.
 *
 * Its job, in order: get a visitor with a real project into the contact form
 * with the details already written; answer questions about working with
 * Tejas; and be a working sample of the "AI features" service.
 *
 * Design: the chrome stays quiet so the one distinctive element — the
 * project brief card, showing exactly what will go into the form before the
 * visitor commits — carries the moment. Replies are set as text with a thin
 * azure rule rather than grey chat bubbles. No backdrop-filter (see README:
 * Safari performance).
 */

const STUDIO_PATHS = new Set(['/', '/work']);

const GREETING =
  'Hi — I can answer questions about what Tejas builds, how a project works, and what it costs. If you have something in mind, I can help you describe it and pass it to him.';

const SUGGESTIONS = [
  'What do you build?',
  'How much does a website cost?',
  'How long does it take?',
  'Can you add AI to my existing site?',
];

/** Plain text in, paragraphs and "- " lists out. The prompt allows nothing
 *  richer, so this is all the formatting a reply can have. */
function ReplyText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={blocks.length} className="flex list-disc flex-col gap-1 pl-5 marker:text-ink-3">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (/^[-•*]\s+/.test(trimmed)) list.push(trimmed.replace(/^[-•*]\s+/, ''));
    else {
      flush();
      if (trimmed) blocks.push(<p key={blocks.length}>{trimmed}</p>);
    }
  }
  flush();
  return <div className="flex flex-col gap-2.5">{blocks}</div>;
}

function BriefCard({ handoff, onUse }: { handoff: Handoff; onUse: () => void }) {
  return (
    <div className="rounded-xl border border-azure/30 bg-azure/[0.06] p-4">
      <p className="text-[0.8125rem] font-medium text-ink">Project brief</p>
      <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-[0.8125rem]">
        <dt className="text-ink-2">Type</dt>
        <dd className="text-ink">{handoff.projectType}</dd>
        {handoff.budget && (
          <>
            <dt className="text-ink-2">Budget</dt>
            <dd className="text-ink">{handoff.budget}</dd>
          </>
        )}
      </dl>
      <p className="mt-3 border-l-2 border-hairline-strong pl-3 text-[0.875rem] leading-relaxed text-ink-2">
        {handoff.details}
      </p>
      <button
        type="button"
        onClick={onUse}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-azure/40 bg-azure/15 px-5 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:bg-azure/25"
      >
        Fill in the contact form
      </button>
      <p className="mt-2 text-center text-[0.75rem] text-ink-2">Nothing is sent until you press Send.</p>
    </div>
  );
}

export function StudioAssistant() {
  const { pathname } = useLocation();
  const reduced = useReducedMotionSafe();
  const { go } = useAnchorNavigate();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [contactInView, setContactInView] = useState(false);
  const { messages, pending, send: sendMessage, fresh } = useAssistantChat({
    assistant: 'studio',
    greeting: GREETING,
    scripted: scriptedReply,
  });
  const { launcher, panel, input, log } = useAssistantPanel(open, setOpen, `${messages.length}${pending}`);

  const onStudioPage = STUDIO_PATHS.has(pathname);

  // Step aside while the contact form is on screen, so the launcher never sits
  // on top of the Send button or the form's last field on a phone.
  useEffect(() => {
    const contact = document.getElementById('contact');
    if (!contact) {
      setContactInView(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setContactInView(Boolean(entry?.isIntersecting)), {
      threshold: 0,
    });
    observer.observe(contact);
    return () => observer.disconnect();
  }, [pathname]);

  if (!onStudioPage) return null;

  const send = async (text: string) => {
    setDraft('');
    await sendMessage(text);
    input.current?.focus({ preventScroll: true });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void send(draft);
  };

  /** Hand the brief to the contact form. Never submits: the visitor adds their
   *  name and email and presses Send themselves. */
  const handOff = (handoff: Handoff) => {
    setOpen(false);
    prefillContact({ ...handoff, announce: true });
    go('contact');
  };

  return (
    <>
      <button
        ref={launcher}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        hidden={open || contactInView}
        // Below 640px: a 44px icon-only circle, so it covers as little of the
        // page as possible. The label stays in the DOM (sr-only), so its
        // accessible name is "Ask a question" at every width.
        className="fixed bottom-5 right-5 z-30 inline-flex size-11 items-center justify-center rounded-full border border-hairline-strong bg-elevated text-[0.9375rem] font-medium text-ink shadow-[0_1px_0_0_rgb(180_205_255/0.08)_inset,0_16px_40px_-16px_rgb(0_0_0/0.9)] transition-colors duration-200 hover:border-azure/40 sm:bottom-6 sm:right-6 sm:size-auto sm:min-h-12 sm:gap-2.5 sm:px-5"
      >
        <MessageCircle aria-hidden="true" className="size-[1.125rem] text-azure" strokeWidth={1.75} />
        <span className="max-sm:sr-only">Ask a question</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="studio-assistant-title"
            aria-describedby="studio-assistant-note"
            tabIndex={-1}
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.2, ease: EASE_EXPO }}
            style={{ transformOrigin: 'bottom right' }}
            // Solid, not card-surface: that gradient is translucent, and with no
            // backdrop-filter (Safari) the page would show through the panel.
            className="fixed inset-x-3 bottom-3 z-[45] flex max-h-[min(40rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-panel border border-hairline-strong bg-elevated shadow-[0_1px_0_0_rgb(180_205_255/0.08)_inset,0_28px_70px_-24px_rgb(0_0_0/0.95)] focus:outline-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[26rem]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4">
              <div>
                <h2 id="studio-assistant-title" className="text-[1.0625rem] font-medium tracking-[-0.01em] text-ink">
                  Ask about working with Tejas
                </h2>
                <p id="studio-assistant-note" className="mt-1 text-[0.8125rem] leading-snug text-ink-2">
                  AI assistant. Answers from this site; Tejas confirms anything specific.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </button>
            </div>

            <div
              ref={log}
              role="log"
              aria-live="polite"
              aria-busy={pending}
              className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 text-[0.9375rem] leading-relaxed"
            >
              {messages.map((message, index) =>
                message.role === 'user' ? (
                  <p
                    key={index}
                    className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-surface-3 px-4 py-2.5 text-ink"
                  >
                    <span className="sr-only">You: </span>
                    {message.text}
                  </p>
                ) : (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="border-l-2 border-azure/60 pl-3.5 text-ink-2">
                      <span className="sr-only">Assistant: </span>
                      <ReplyText text={message.text} />
                    </div>
                    {message.handoff && (
                      <BriefCard handoff={message.handoff} onUse={() => handOff(message.handoff!)} />
                    )}
                  </div>
                ),
              )}

              {pending && <p className="pl-4 text-[0.875rem] text-ink-3">Writing a reply…</p>}

              {fresh && (
                <ul aria-label="Suggested questions" className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((question) => (
                    <li key={question}>
                      <button
                        type="button"
                        onClick={() => void send(question)}
                        className="min-h-11 rounded-full border border-hairline-strong px-4 text-[0.875rem] text-ink-2 transition-colors duration-200 hover:border-azure/40 hover:text-ink"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={submit} className="flex gap-2 border-t border-hairline p-3">
              <label htmlFor="studio-assistant-input" className="sr-only">
                Your question
              </label>
              <input
                ref={input}
                id="studio-assistant-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={MAX_MESSAGE_CHARS}
                autoComplete="off"
                placeholder="Ask about pricing, process…"
                className={cn(
                  'min-h-12 min-w-0 flex-1 rounded-xl border border-hairline bg-surface-2/70 px-4 text-base text-ink',
                  'placeholder:text-ink-3 focus:border-azure focus:outline-none',
                )}
              />
              <button
                type="submit"
                disabled={pending || !draft.trim()}
                aria-label="Send question"
                className="grid size-12 shrink-0 place-items-center rounded-xl bg-azure text-canvas transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp aria-hidden="true" className="size-5" strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
