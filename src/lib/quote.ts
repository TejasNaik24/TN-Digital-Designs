import type { ProjectType } from '@/data/projectTypes';

/**
 * Pre-fills the contact form from elsewhere on the page: a pricing tier's
 * "Get a quote" (project type only) or the studio assistant's handoff (type,
 * budget and a written summary).
 *
 * A window event rather than shared state: the senders and the form are far
 * apart, and this is the only thing they ever say to each other. The latest
 * request is also kept as `pending`, so a form that mounts AFTER the request —
 * the assistant on /work navigating home to #contact — still receives it.
 *
 * Never submits. The visitor always reviews and sends it themselves.
 */
export type ContactPrefill = {
  projectType: ProjectType | string;
  budget?: string;
  details?: string;
  /** Move focus to Name and announce the fill — for the assistant handoff,
   *  where the visitor's next step is typing their name. */
  announce?: boolean;
};

const EVENT = 'contact:prefill';
let pending: ContactPrefill | null = null;

export function prefillContact(prefill: ContactPrefill) {
  pending = prefill;
  window.dispatchEvent(new CustomEvent<ContactPrefill>(EVENT, { detail: prefill }));
}

export function requestQuote(projectType: ProjectType) {
  prefillContact({ projectType });
}

/** Subscribe, receiving any request made before this subscriber mounted. */
export function onContactPrefill(listener: (prefill: ContactPrefill) => void) {
  const handler = (event: Event) => {
    pending = null;
    listener((event as CustomEvent<ContactPrefill>).detail);
  };
  window.addEventListener(EVENT, handler);
  if (pending) {
    const early = pending;
    pending = null;
    listener(early);
  }
  return () => window.removeEventListener(EVENT, handler);
}
