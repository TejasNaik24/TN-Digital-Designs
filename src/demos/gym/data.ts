/**
 * Groundwork's fictional timetable and prices. Not a real gym — see
 * ConceptBanner.
 */

export type ClassType = 'Strength' | 'Conditioning' | 'Mobility' | 'Open gym';
export const classTypes: ClassType[] = ['Strength', 'Conditioning', 'Mobility', 'Open gym'];

export const classInfo: Record<ClassType, string> = {
  Strength: 'Barbell lifts in small groups, coached rep by rep.',
  Conditioning: 'Intervals on sleds, bikes and rowers. Hard, short, scalable.',
  Mobility: 'Slow, deliberate work on hips, shoulders and backs.',
  'Open gym': 'Your own programme, with a coach on the floor.',
};

export type Session = { time: string; type: ClassType; coach: string; spots: number };

/** Monday-first. `spots` is places left; 0 = waitlist. */
export const week: { day: string; short: string; sessions: Session[] }[] = [
  { day: 'Monday', short: 'Mon', sessions: [
    { time: '6:00', type: 'Strength', coach: 'Dana', spots: 0 },
    { time: '7:15', type: 'Conditioning', coach: 'Marcus', spots: 4 },
    { time: '12:00', type: 'Mobility', coach: 'Lena', spots: 8 },
    { time: '17:30', type: 'Strength', coach: 'Dana', spots: 2 },
    { time: '18:45', type: 'Open gym', coach: 'Marcus', spots: 10 },
  ] },
  { day: 'Tuesday', short: 'Tue', sessions: [
    { time: '6:00', type: 'Conditioning', coach: 'Marcus', spots: 3 },
    { time: '12:00', type: 'Strength', coach: 'Dana', spots: 6 },
    { time: '17:30', type: 'Conditioning', coach: 'Marcus', spots: 0 },
    { time: '18:45', type: 'Mobility', coach: 'Lena', spots: 7 },
  ] },
  { day: 'Wednesday', short: 'Wed', sessions: [
    { time: '6:00', type: 'Strength', coach: 'Dana', spots: 1 },
    { time: '7:15', type: 'Mobility', coach: 'Lena', spots: 9 },
    { time: '17:30', type: 'Strength', coach: 'Dana', spots: 0 },
    { time: '18:45', type: 'Open gym', coach: 'Marcus', spots: 12 },
  ] },
  { day: 'Thursday', short: 'Thu', sessions: [
    { time: '6:00', type: 'Conditioning', coach: 'Marcus', spots: 5 },
    { time: '12:00', type: 'Mobility', coach: 'Lena', spots: 6 },
    { time: '17:30', type: 'Strength', coach: 'Dana', spots: 3 },
    { time: '18:45', type: 'Conditioning', coach: 'Marcus', spots: 4 },
  ] },
  { day: 'Friday', short: 'Fri', sessions: [
    { time: '6:00', type: 'Strength', coach: 'Dana', spots: 2 },
    { time: '7:15', type: 'Conditioning', coach: 'Marcus', spots: 6 },
    { time: '17:30', type: 'Open gym', coach: 'Lena', spots: 14 },
  ] },
  { day: 'Saturday', short: 'Sat', sessions: [
    { time: '8:00', type: 'Strength', coach: 'Dana', spots: 0 },
    { time: '9:15', type: 'Conditioning', coach: 'Marcus', spots: 2 },
    { time: '10:30', type: 'Mobility', coach: 'Lena', spots: 10 },
  ] },
  { day: 'Sunday', short: 'Sun', sessions: [
    { time: '9:00', type: 'Open gym', coach: 'Marcus', spots: 15 },
    { time: '10:30', type: 'Mobility', coach: 'Lena', spots: 11 },
  ] },
];

export type Plan = { id: string; name: string; who: string; monthly: number; includes: string[] };

/** Annual billing = 10 months for 12. Stated on the page, not hidden. */
export const ANNUAL_MONTHS_CHARGED = 10;

export const plans: Plan[] = [
  { id: 'twice', name: '2 a week', who: 'Fitting training around a busy week.', monthly: 89, includes: ['Any 2 classes a week', 'Strength assessment', 'App booking'] },
  { id: 'unlimited', name: 'Unlimited', who: 'Training most days.', monthly: 149, includes: ['Every class, every day', 'Open gym access', 'Quarterly programme review'] },
  { id: 'coached', name: 'Coached', who: 'A plan written for you.', monthly: 239, includes: ['Unlimited classes', 'Monthly 1:1 session', 'Written programme, updated monthly'] },
];
