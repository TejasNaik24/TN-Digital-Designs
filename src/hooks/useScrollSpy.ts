import { useEffect, useState } from 'react';

/**
 * Marks a section active once it crosses a narrow band through the middle of
 * the viewport, so the nav highlight changes when the section is genuinely
 * being read rather than the instant its top edge appears.
 *
 * `enabled` exists because the Navbar is mounted once and survives every route
 * change, while the sections it watches only exist on the homepage. Without a
 * dep that actually changes on navigation, this effect ran exactly once for
 * the whole session, which broke two ways:
 *
 *   - first load on /work/vela → no sections → early return → the effect never
 *     re-ran, so the highlight stayed dead even after navigating home;
 *   - first load on / → observer attaches → navigate away → it holds detached
 *     nodes, which never fire, so the last-active link stayed lit on a page
 *     that has no such section.
 */
export function useScrollSpy(
  ids: readonly string[],
  enabled = true,
): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Track the whole visible set rather than the last entry seen — otherwise
    // scrolling back to the hero leaves the final section stuck as "current".
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [ids, enabled]);

  return active;
}
