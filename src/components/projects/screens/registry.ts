import { atelierNordScreens } from './AtelierNordScreens';
import { velaScreens } from './VelaScreens';
import { monumentScreens } from './MonumentScreens';
import type { ScreenProps } from './shared';

/**
 * Maps a project slug to its screens.
 *
 * Keeping this separate from `projects.ts` keeps the data file free of JSX
 * imports — the content stays editable without touching components, which is
 * the whole point of the data-driven case study.
 */
export type ScreenComponent = (props: ScreenProps) => React.JSX.Element;

const registries: Record<string, Record<string, ScreenComponent>> = {
  'atelier-nord': atelierNordScreens,
  vela: velaScreens,
  monument: monumentScreens,
};

/** `noUncheckedIndexedAccess` is on — both lookups can miss. */
export function getScreen(
  slug: string,
  screen: string,
): ScreenComponent | undefined {
  return registries[slug]?.[screen];
}
