import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PODCASTS } from '../../data/content';
import { PaperPage } from '../PaperPage';

export function Podcast() {
  const [view, setView] = useState<'guest' | 'own'>('guest');
  const reduced = useReducedMotion();
  return <PaperPage id="podcast" label="Podcast" title="Better as a conversation." description="On engineering leadership, AI adoption and doing this work sustainably.">
    <div className="paper-filters paper-podcast-switcher" role="group" aria-label="Podcast collection">
      <button aria-pressed={view === 'guest'} aria-controls="podcast-collection" onClick={() => setView('guest')}>Guest appearances</button>
      <button aria-pressed={view === 'own'} aria-controls="podcast-collection" onClick={() => setView('own')}>My podcast</button>
    </div>
    <AnimatePresence mode="wait" initial={false}>
      <motion.section id="podcast-collection" key={view} aria-label={view === 'guest' ? 'Guest appearances' : 'My podcast'} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}>
        {view === 'guest' ? <div className="paper-episodes">{PODCASTS.map(episode => {
          const content = <><div className="paper-episode-meta"><span>{episode.show}</span><span>{episode.date}{episode.duration ? ` / ${episode.duration}` : ''}</span></div><h2>{episode.title}</h2><p>{episode.description}</p>{episode.link && <span className="paper-episode-listen">Listen to the conversation<ArrowUpRight size={17} aria-hidden="true" /></span>}</>;
          return episode.link ? <a key={episode.slug ?? episode.title} className="paper-episode" href={episode.link} target="_blank" rel="noreferrer">{content}</a> : <article key={episode.slug ?? episode.title} className="paper-episode">{content}</article>;
        })}</div> : <div className="paper-podcast-soon"><h2>Coming soon.</h2></div>}
      </motion.section>
    </AnimatePresence>
  </PaperPage>;
}
