import type { ProjectType } from '@/data/projectTypes';

/**
 * Lets a pricing tier pre-select its project type in the contact form.
 *
 * A window event rather than shared state: the two sections are siblings far
 * apart on the page, and this is the only thing they ever say to each other.
 */
const EVENT = 'quote:request';

export function requestQuote(projectType: ProjectType) {
  window.dispatchEvent(new CustomEvent<ProjectType>(EVENT, { detail: projectType }));
}

export function onQuoteRequest(listener: (projectType: ProjectType) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<ProjectType>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
