import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '@/components/hero/Hero';
import { Statement } from '@/components/sections/Statement';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { WhyMe } from '@/components/sections/WhyMe';
import { Process } from '@/components/sections/Process';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { jumpToId } from '@/lib/scroll';
import type { HomeScrollState } from '@/lib/navigation';

export function HomePage() {
  const { state } = useLocation();

  /**
   * Completes a cross-route anchor jump — someone clicked "Services" from a
   * project page, so we navigated here and now finish the trip. Owned by this
   * component rather than the call site because the target section has to
   * exist before we can measure it.
   *
   * Instant, not animated, and a layout effect — both deliberate. Coming from
   * `/work/vela` the visitor has never seen the top of this page, so a 700ms
   * tween would drag them through ~8000px of content they didn't ask for. It
   * would also outrun `useRevealOnce`'s observers and strand every section it
   * passed at opacity 0 (see lib/scroll.ts). Landing here in a layout effect
   * puts the viewport in place before those observers are created.
   */
  useLayoutEffect(() => {
    const target = (state as HomeScrollState)?.scrollTo;
    if (target) jumpToId(target);
  }, [state]);

  return (
    <>
      <Hero />
      <Statement />
      <Services />
      <Work />
      <WhyMe />
      <Process />
      <FAQ />
      <Contact />
    </>
  );
}
