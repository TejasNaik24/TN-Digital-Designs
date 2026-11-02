/**
 * Northgate Dental's fictional practice details. Not a real clinic — see
 * ConceptBanner.
 *
 * `knowledge` is also the AI assistant's entire world: the server prompt is
 * built from it and the scripted fallback answers from it, so the assistant can
 * never say anything the page itself doesn't.
 */

export type Service = { id: string; name: string; detail: string; length: string; from: string };

export const services: Service[] = [
  { id: 'checkup', name: 'Check-up and cleaning', detail: 'Exam, gentle clean, and X-rays when they’re due.', length: '45 min', from: '$95' },
  { id: 'whitening', name: 'Whitening', detail: 'In-chair whitening, or take-home trays made for you.', length: '60 min', from: '$280' },
  { id: 'fillings', name: 'Fillings', detail: 'Tooth-coloured fillings, usually done in one visit.', length: '30–60 min', from: '$140' },
  { id: 'kids', name: 'Children’s dentistry', detail: 'First visits from age one. We go slowly and explain everything.', length: '30 min', from: '$70' },
  { id: 'invisalign', name: 'Clear aligners', detail: 'Free consultation, scan, and a plan with a fixed price.', length: '45 min', from: 'Free consult' },
  { id: 'emergency', name: 'Emergency visit', detail: 'Toothache, broken tooth, swelling. Same-day where we can.', length: '30 min', from: '$120' },
];

export const team = [
  { initials: 'AM', name: 'Dr. Asha Mehta', role: 'General dentist', note: 'Looks after most of our nervous first-timers.' },
  { initials: 'JO', name: 'Dr. Joel Okafor', role: 'Children’s dentist', note: 'Runs the Saturday kids’ clinic.' },
  { initials: 'RL', name: 'Rita Lund', role: 'Dental hygienist', note: 'Cleanings, gum care, and honest advice on flossing.' },
];

export const insurers = ['Delta Dental', 'Cigna', 'MetLife', 'Guardian', 'Aetna', 'United Concordia'];

export const hours = [
  { days: 'Monday – Thursday', time: '8 am – 6 pm' },
  { days: 'Friday', time: '8 am – 3 pm' },
  { days: 'Saturday', time: '9 am – 1 pm (children’s clinic)' },
  { days: 'Sunday', time: 'Closed' },
];

export const faqs = [
  {
    q: 'Do you take my insurance?',
    a: `We’re in-network with ${insurers.join(', ')}. If yours isn’t listed, we’ll still file the claim for you, and you pay only the difference.`,
  },
  {
    q: 'What if I’m nervous about the dentist?',
    a: 'Tell us when you book. We’ll give you a longer first visit, explain each step before we do it, and stop whenever you raise a hand.',
  },
  {
    q: 'How quickly can I be seen?',
    a: 'Most check-ups are available the same week. For pain or a broken tooth, call us — we keep same-day emergency slots every weekday.',
  },
  {
    q: 'Do you see children?',
    a: 'Yes, from their first tooth. Our Saturday morning clinic is just for children.',
  },
];

export const phone = '(555) 018-4471';
export const address = '88 Northgate Road, Suite 2';

/** Flat knowledge base for the assistant: one entry per topic. */
export const knowledge = [
  // First so it wins ties: "Can my 5 year old come on Saturday?" is about children, not hours.
  { topic: 'children', keywords: ['child', 'kid', 'son', 'daughter', 'baby', 'toddler', 'year old', 'years old', 'little one'], answer: faqs[3]?.a ?? '' },
  { topic: 'hours', keywords: ['hour', 'open', 'close', 'time', 'saturday', 'sunday', 'weekend', 'today'], answer: `We’re open ${hours.map((h) => `${h.days}: ${h.time}`).join('; ')}.` },
  { topic: 'insurance', keywords: ['insurance', 'insur', 'delta', 'cigna', 'metlife', 'aetna', 'guardian', 'network', 'cover', 'pay', 'cost', 'price'], answer: faqs[0]?.a ?? '' },
  { topic: 'services', keywords: ['service', 'offer', 'whiten', 'filling', 'clean', 'check', 'aligner', 'invisalign', 'brace'], answer: `We offer ${services.map((s) => `${s.name.toLowerCase()} (${s.from === 'Free consult' ? 'free consultation' : `from ${s.from}`})`).join(', ')}.` },
  { topic: 'emergency', keywords: ['emergency', 'pain', 'hurt', 'broken', 'swell', 'urgent', 'toothache', 'same day', 'same-day'], answer: `For pain, a broken tooth or swelling, call us on ${phone}. We keep same-day emergency slots every weekday.` },
  { topic: 'nervous', keywords: ['nervous', 'anxious', 'scared', 'afraid', 'fear'], answer: faqs[1]?.a ?? '' },
  { topic: 'location', keywords: ['where', 'address', 'location', 'park', 'find', 'direction'], answer: `We’re at ${address}, with free parking behind the building.` },
  { topic: 'booking', keywords: ['book', 'appointment', 'schedule', 'reschedule', 'cancel'], answer: `You can request a visit with the booking form on this page, or call ${phone}. Please give 24 hours’ notice to cancel.` },
];
