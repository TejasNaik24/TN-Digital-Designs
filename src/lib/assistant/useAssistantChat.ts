import { useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import {
  MAX_HISTORY_TURNS,
  MAX_MESSAGE_CHARS,
  type AssistantId,
  type ChatReply,
  type ChatTurn,
  type Handoff,
} from './core';

/** A transcript entry. `handoff` rides along on the assistant reply that
 *  offered it; it is never sent back to the server. */
export type ChatMessage = ChatTurn & { handoff?: Handoff };

type Scripted = (question: string) => { text: string; handoff?: Handoff };

/**
 * Ask the server, which uses Gemini when it has a key and scripted answers
 * otherwise. If the function can't be reached at all (offline, static
 * preview), answer from the same knowledge base right here — a question is
 * never left hanging.
 */
async function ask(assistant: AssistantId, history: ChatTurn[], scripted: Scripted): Promise<ChatReply> {
  const question = history.at(-1)?.text ?? '';
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistant, messages: history.slice(-MAX_HISTORY_TURNS) }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const reply = (await response.json()) as Partial<ChatReply>;
    if (typeof reply.text !== 'string' || !reply.text) throw new Error('empty reply');
    return { text: reply.text, source: reply.source === 'ai' ? 'ai' : 'scripted', handoff: reply.handoff };
  } catch {
    return { ...scripted(question), source: 'scripted' };
  }
}

/**
 * Transcript state and sending, shared by every assistant widget. The widgets
 * own only their look and their open/close behaviour.
 */
export function useAssistantChat({
  assistant,
  greeting,
  scripted,
}: {
  assistant: AssistantId;
  greeting: string;
  scripted: Scripted;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: greeting }]);
  const [pending, setPending] = useState(false);

  const send = async (text: string): Promise<boolean> => {
    const question = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!question || pending) return false;
    const next: ChatMessage[] = [...messages, { role: 'user', text: question }];
    setMessages(next);
    setPending(true);
    // The greeting is UI, not conversation (the server drops leading assistant
    // turns anyway), and handoff data never goes back to the model.
    const history = next.slice(1).map(({ role, text: t }) => ({ role, text: t }));
    const reply = await ask(assistant, history, scripted);
    setMessages((current) => [...current, { role: 'assistant', text: reply.text, handoff: reply.handoff }]);
    setPending(false);
    return true;
  };

  /** True before the visitor has said anything — when suggestions show. */
  const fresh = messages.length === 1;

  return { messages, pending, send, fresh };
}

/**
 * Panel behaviour shared by every assistant widget: focus trap, Escape to
 * close, focus into the input on open, focus back to the launcher on close,
 * and keeping the transcript scrolled to the newest message.
 *
 * Focus returns via the launcher ref rather than the trap: the launcher is
 * hidden while the panel is open, so the trap only ever sees <body> as
 * "previously focused".
 */
export function useAssistantPanel(open: boolean, setOpen: (open: boolean) => void, transcriptKey: unknown) {
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useFocusTrap(panel, open);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const launcherEl = launcher.current;
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      launcherEl?.focus({ preventScroll: true });
    };
  }, [open, setOpen]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [transcriptKey]);

  return { launcher, panel, input, log };
}
