import React, { Suspense, useCallback, useEffect } from 'react';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScreenInit } from '../useScreenInit';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Speaking } from '../components/sections/Speaking';
import { Work } from '../components/sections/Work';
import { Writing } from '../components/sections/Writing';
import { Podcast } from '../components/sections/Podcast';
import { BookMe } from '../components/sections/BookMe';
const ConstellationHero = React.lazy(() => import('../components/sections/ConstellationHero').then(m => ({ default: m.ConstellationHero })));
type SectionKey = 'about' | 'speaking' | 'work' | 'writing' | 'podcast' | 'book';
const SECTIONS: Record<SectionKey, () => React.ReactNode> = {
  about: () => <About />,
  speaking: () => <Speaking />,
  work: () => <Work />,
  writing: () => <Writing />,
  podcast: () => <Podcast />,
  book: () => <BookMe />
};
export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const canonicalPath = location.pathname.replace(/\/+$/, '') || '/';
  const originalScene = new URLSearchParams(location.search).has('constellation');
  const { section } = useParams<{ section?: string }>();
  const screenInit = useScreenInit() as {
    active?: SectionKey;
  };

  // The open section is the URL — so browser back/forward, refresh, and shared
  // links all work, and each section (/about, /podcast…) is directly linkable.
  const active: SectionKey | null =
  section && Object.prototype.hasOwnProperty.call(SECTIONS, section) ? section as SectionKey : null;

  // Back-compat: `?mp_screen=` deep links (the screenshot workflow) carry the
  // section in a query param — translate it to the canonical path once.
  useEffect(() => {
    if (!active && screenInit.active && Object.prototype.hasOwnProperty.call(SECTIONS, screenInit.active)) {
      navigate(`/${screenInit.active}`, { replace: true });
    }
  }, [active, screenInit.active, navigate]);

  const goTo = useCallback((key: string) => {
    if (Object.prototype.hasOwnProperty.call(SECTIONS, key)) navigate(`/${key}`);
  }, [navigate]);
  if (location.pathname !== canonicalPath) return <Navigate to={{ pathname: canonicalPath, search: location.search, hash: location.hash }} replace />;
  if (!active && canonicalPath !== '/') return <Navigate to="/" replace />;
  const current = active ? SECTIONS[active] : null;
  if (current) return <>{current()}</>;
  return (
    <motion.div className={originalScene ? "portrait-home-route bg-[var(--field)]" : "portrait-home-route"} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
      <Suspense fallback={null}>{originalScene ? <ConstellationHero onNavigate={goTo} covered={active !== null} /> : <Hero onNavigate={goTo} covered={active !== null} />}</Suspense>
    </motion.div>);

}
