import React, { Suspense, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useScreenInit } from '../useScreenInit';
import { Hero } from '../components/sections/Hero';
import { SectionOverlay } from '../components/SectionOverlay';
import { Footer } from '../components/Footer';
import { About } from '../components/sections/About';
import { Speaking } from '../components/sections/Speaking';
import { Work } from '../components/sections/Work';
import { Podcast } from '../components/sections/Podcast';
import { BookMe } from '../components/sections/BookMe';

// Writing embeds the full text of every blog post (via data/posts.ts), so it
// loads on demand — keeping all that prose out of the main chunk.
const Writing = React.lazy(() =>
import('../components/sections/Writing').then((m) => ({ default: m.Writing }))
);
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
// The index.html title is the canonical default — restored when no overlay
// is open.
const DEFAULT_TITLE = document.title;

export function Home() {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const screenInit = useScreenInit() as {
    active?: SectionKey;
  };

  // The open section is the URL — so browser back/forward, refresh, and shared
  // links all work, and each section (/about, /podcast…) is directly linkable.
  const active: SectionKey | null =
  section && section in SECTIONS ? section as SectionKey : null;

  // Back-compat: `?mp_screen=` deep links (the screenshot workflow) carry the
  // section in a query param — translate it to the canonical path once.
  useEffect(() => {
    if (!active && screenInit.active && screenInit.active in SECTIONS) {
      navigate(`/${screenInit.active}`, { replace: true });
    }
  }, [active, screenInit.active, navigate]);

  // Keep the tab title in sync with the open overlay, so history entries and
  // shared links read as more than one repeated page name.
  useEffect(() => {
    const label = active ? SECTIONS[active].label : null;
    document.title = label ? `${label} — Macs Dickinson` : DEFAULT_TITLE;
  }, [active]);

  const goTo = useCallback((key: string) => {
    if (key in SECTIONS) navigate(`/${key}`);
  }, [navigate]);
  const close = useCallback(() => navigate('/'), [navigate]);
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

            <Suspense fallback={null}>{current.render(goTo)}</Suspense>
            <Footer />
          </SectionOverlay>
        }
      </AnimatePresence>
    </div>);

}