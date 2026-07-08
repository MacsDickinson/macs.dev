import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { PROFILE } from '../../data/content';
import { useMediaQuery } from '../../useMediaQuery';

// three.js + the scene are heavy — split them out so blog routes stay light.
const HeroScene = React.lazy(() =>
import('../HeroScene').then((m) => ({ default: m.HeroScene }))
);

type HeroProps = {
  onNavigate: (target: string) => void;
  /** True while a section overlay covers the hero — pauses the 3D loop. */
  covered?: boolean;
};

export function Hero({ onNavigate, covered }: HeroProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return (
    <section
      id="top"
      className="relative h-full w-full overflow-hidden bg-[var(--field)] text-[var(--paper)]">

      {/* The name in glass + rotating starfield & nav stars */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}>

        <Suspense fallback={null}>
          <HeroScene
            onNavigate={onNavigate}
            showNodes={isDesktop}
            paused={covered} />

        </Suspense>

      </motion.div>

      {/* Vignette to deepen edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
          'radial-gradient(120% 90% at 30% 25%, rgba(22,27,34,0) 40%, rgba(14,17,22,0.85) 100%)'
        }} />


      {/* The name lives in the canvas as glass — keep it in the document for
          screen readers and search engines. */}
      <h1 className="sr-only">{PROFILE.name}</h1>

      {/* Mobile: node targets as tappable pills (nav stars are desktop-only) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap gap-2.5 p-6 md:hidden">

        <button
          onClick={() => onNavigate('book')}
          className="bg-[var(--accent)] px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--field)]">

          Book me to speak →
        </button>
        {['speaking', 'work', 'writing', 'podcast', 'about'].map((t) =>
        <button
          key={t}
          onClick={() => onNavigate(t)}
          className="border border-[var(--field-line)] px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--dim)]">

            {t}
          </button>
        )}
      </motion.div>
    </section>);

}
