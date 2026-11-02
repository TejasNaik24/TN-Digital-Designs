import { lazy } from 'react';

/** One lazy handle per export, shared by App and DemoPage so both resolve the
 *  same chunk (see StudioSite.tsx for why it's split out). */
export const StudioSite = lazy(() => import('./StudioSite'));
export const StudioNotFound = lazy(() =>
  import('./StudioSite').then((module) => ({ default: module.StudioNotFound })),
);
