/**
 * Ferro's fictional menu and hours. Not a real restaurant — see ConceptBanner.
 */

export type Dish = { name: string; detail: string; price: string; tags?: ('V' | 'GF')[] };
export type MenuGroup = { title: string; dishes: Dish[] };
export type MenuId = 'dinner' | 'lunch' | 'drinks';

export const menus: Record<MenuId, { label: string; note: string; groups: MenuGroup[] }> = {
  dinner: {
    label: 'Dinner',
    note: 'Served Tuesday to Sunday from 5 pm.',
    groups: [
      {
        title: 'To start',
        dishes: [
          { name: 'Charred leeks', detail: 'hazelnut, brown butter, lemon', price: '11', tags: ['V', 'GF'] },
          { name: 'Whipped ricotta', detail: 'chili honey, grilled bread', price: '12', tags: ['V'] },
          { name: 'Fried artichokes', detail: 'aioli, parsley salt', price: '13', tags: ['V'] },
        ],
      },
      {
        title: 'Pasta',
        dishes: [
          { name: 'Pici', detail: 'brown butter, sage, pecorino', price: '19', tags: ['V'] },
          { name: 'Tagliatelle', detail: 'slow pork ragù, parmesan', price: '23' },
          { name: 'Squid ink chitarra', detail: 'clams, garlic, chili', price: '26' },
        ],
      },
      {
        title: 'From the fire',
        dishes: [
          { name: 'Flatbread', detail: 'nduja, fior di latte, basil', price: '14' },
          { name: 'Half chicken', detail: 'salsa verde, charred lemon', price: '27', tags: ['GF'] },
          { name: 'Hanger steak', detail: 'bone marrow butter, chicory', price: '34', tags: ['GF'] },
        ],
      },
    ],
  },
  lunch: {
    label: 'Lunch',
    note: 'Friday to Sunday, noon to 3 pm.',
    groups: [
      {
        title: 'Plates',
        dishes: [
          { name: 'Flatbread of the day', detail: 'ask your server', price: '13' },
          { name: 'Porchetta sandwich', detail: 'salsa verde, rocket', price: '15' },
          { name: 'Farro salad', detail: 'roast squash, feta, mint', price: '14', tags: ['V'] },
        ],
      },
      {
        title: 'Pasta',
        dishes: [
          { name: 'Pici', detail: 'brown butter, sage, pecorino', price: '17', tags: ['V'] },
          { name: 'Rigatoni', detail: 'tomato, basil, ricotta', price: '16', tags: ['V'] },
        ],
      },
    ],
  },
  drinks: {
    label: 'Drinks',
    note: 'Wine list changes with what our suppliers bring in.',
    groups: [
      {
        title: 'Wine by the glass',
        dishes: [
          { name: 'Vermentino', detail: 'Liguria, bright and saline', price: '12' },
          { name: 'Rosato', detail: 'Abruzzo, dry, red berries', price: '11' },
          { name: 'Nero d’Avola', detail: 'Sicily, plum, warm spice', price: '13' },
        ],
      },
      {
        title: 'Not wine',
        dishes: [
          { name: 'Negroni', detail: 'gin, vermouth, bitter', price: '14' },
          { name: 'House spritz', detail: 'aperitivo, prosecco, orange', price: '12' },
          { name: 'Fennel soda', detail: 'made here, no alcohol', price: '6' },
        ],
      },
    ],
  },
};

/** 0 = Sunday … 6 = Saturday. Each day is a list of [open, close] in minutes. */
export const hours: { day: string; sessions: [number, number][] }[] = [
  { day: 'Sunday', sessions: [[12 * 60, 21 * 60]] },
  { day: 'Monday', sessions: [] },
  { day: 'Tuesday', sessions: [[17 * 60, 22 * 60]] },
  { day: 'Wednesday', sessions: [[17 * 60, 22 * 60]] },
  { day: 'Thursday', sessions: [[17 * 60, 22 * 60]] },
  { day: 'Friday', sessions: [[12 * 60, 15 * 60], [17 * 60, 23 * 60]] },
  { day: 'Saturday', sessions: [[12 * 60, 15 * 60], [17 * 60, 23 * 60]] },
];

export const formatMinutes = (minutes: number) => {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h24 >= 12 ? 'pm' : 'am';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
};

/**
 * "Open now, until 10 pm" / "Opens 5 pm" / "Closed today" — computed from the
 * visitor's own clock, which is the honest reading for a demo.
 */
export function openStatus(now = new Date()): { open: boolean; text: string } {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const today = hours[now.getDay()]?.sessions ?? [];

  const current = today.find(([open, close]) => minutes >= open && minutes < close);
  if (current) return { open: true, text: `Open now, until ${formatMinutes(current[1])}` };

  const later = today.find(([open]) => open > minutes);
  if (later) return { open: false, text: `Closed now, opens ${formatMinutes(later[0])}` };

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = hours[(now.getDay() + offset) % 7];
    const first = day?.sessions[0];
    if (day && first) {
      const when = offset === 1 ? 'tomorrow' : day.day;
      return { open: false, text: `Closed now, opens ${when} ${formatMinutes(first[0])}` };
    }
  }
  return { open: false, text: 'Closed' };
}

/** Dinner seatings offered in the reservation form. */
export const seatings = ['5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00'];

/**
 * Which seatings show as full. Deterministic per date, so the grid doesn't
 * reshuffle on every render — but varied, so it looks like a real book.
 */
export function fullSeatings(day: Date): Set<string> {
  const seed = day.getDate() * 7 + day.getMonth() * 13 + day.getDay();
  return new Set(seatings.filter((_, index) => (seed + index * 5) % 7 === 0 || (seed + index) % 9 === 0));
}

export const isClosedDay = (day: Date) => (hours[day.getDay()]?.sessions.length ?? 0) === 0;
