import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * The honesty strip across the top of every demo site.
 *
 * Required on every concept route — the businesses are fictional, and a
 * visitor who lands here from a shared link has never seen the Work card that
 * says "Concept". Styled in the studio's own dark ink rather than the demo's
 * brand, so it reads as a frame around the site, not part of it.
 */
export function ConceptBanner({ business }: { business: string }) {
  return (
    <div className="relative z-50 bg-canvas text-[#c9d2e3]" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* One row at every width: on a phone the long sentence wrapped to three
          lines and took ~115px of the first screen. */}
      <div className="mx-auto flex min-h-11 max-w-6xl items-center justify-between gap-4 px-4 text-[0.8125rem] sm:px-6">
        <Link
          to="/work"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 font-medium text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure"
        >
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2} />
          <span className="sm:hidden">Tejas Naik</span>
          <span className="hidden sm:inline">Back to Tejas Naik</span>
        </Link>
        <p className="text-right">
          <strong className="font-semibold text-white">Concept site.</strong>{' '}
          <span className="sm:hidden">Not a real business.</span>
          <span className="hidden sm:inline">
            {business} isn’t a real business — this is a demo I designed and built.
          </span>
        </p>
      </div>
    </div>
  );
}
