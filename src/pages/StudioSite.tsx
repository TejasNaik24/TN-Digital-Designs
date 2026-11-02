import { Route, Routes } from 'react-router-dom';
import { StudioChrome } from '@/components/layout/StudioChrome';
import { HomePage } from '@/pages/HomePage';
import { WorkPage } from '@/pages/WorkPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Every studio route, loaded as one chunk.
 *
 * Split from the demos so a visitor opening /work/clinic from a shared link
 * downloads the app shell and that one demo — not the studio homepage, its
 * sections and its animation layer. The `seo()` build plugin preloads this
 * chunk from the studio routes' HTML, so the split costs them no extra trip.
 */
export default function StudioSite() {
  return (
    <Routes>
      <Route element={<StudioChrome />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

/** The studio 404, for a demo slug that doesn't exist. */
export function StudioNotFound() {
  return (
    <StudioChrome>
      <NotFoundPage />
    </StudioChrome>
  );
}
