import React, { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useScreenInit } from '../useScreenInit';
import { Hero } from '../components/sections/Hero';
import { SectionOverlay } from '../components/SectionOverlay';
import { Footer } from '../components/Footer';
import { About } from '../components/sections/About';
import { Speaking } from '../components/sections/Speaking';
import { Work } from '../components/sections/Work';
import { Writing } from '../components/sections/Writing';
import { Podcast } from '../components/sections/Podcast';
import { BookMe } from '../components/sections/BookMe';
type SectionKey = 'about' | 'speaking' | 'work' | 'writing' | 'podcast' | 'book';
type SectionDef = {
  label: string;
  color: string;
  render: (goTo: (key: SectionKey) => void) => React.ReactNode;
};
const SECTIONS: Record<SectionKey, SectionDef> = {
  about: {
    label: 'About',
    color: '#00b894',
    render: () => <About />
  },
  speaking: {
    label: 'Speaking',
    color: '#6c5ce7',
    render: (goTo) => <Speaking onBook={() => goTo('book')} />
  },
  work: {
    label: 'Work',
    color: '#8a93a6',
    render: () => <Work />
  },
  writing: {
    label: 'Writing',
    color: '#00b894',
    render: () => <Writing />
  },
  podcast: {
    label: 'Podcast',
    color: '#6c5ce7',
    render: () => <Podcast />
  },
  book: {
    label: 'Book me to speak',
    color: '#ff5a2c',
    render: () => <BookMe />
  }
};
export function Home() {
  const screenInit = useScreenInit() as {
    active?: SectionKey;
  };
  const [active, setActive] = useState<SectionKey | null>(
    screenInit.active && screenInit.active in SECTIONS ?
    screenInit.active :
    null
  );
  const goTo = useCallback((key: string) => {
    if (key in SECTIONS) setActive(key as SectionKey);
  }, []);
  const close = useCallback(() => setActive(null), []);
  const current = active ? SECTIONS[active] : null;
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--field)]">
      <Hero onNavigate={goTo} covered={active !== null} />

      <AnimatePresence>
        {current && active &&
        <SectionOverlay
          key={active}
          label={current.label}
          color={current.color}
          onClose={close}>
          
            {current.render(goTo)}
            <Footer />
          </SectionOverlay>
        }
      </AnimatePresence>
    </div>);

}