import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS, WORK, TALKS, PODCASTS, PROFILE } from '../../data/content';

const destinations = [
  { key: 'writing', label: 'Writing', preview: BLOG_POSTS[0]?.title ?? 'Notes from the working day.' },
  { key: 'work', label: 'Work', preview: `${WORK[0].role}, ${WORK[0].company}` },
  { key: 'speaking', label: 'Speaking', preview: TALKS[0]?.title ?? 'Talks and conversations.' },
  { key: 'podcast', label: 'Podcast', preview: PODCASTS[0]?.title ?? 'Conversations on engineering and leadership.' },
  { key: 'about', label: 'About', preview: 'The person behind the work.' },
];
export function Hero({ onNavigate, covered }: { onNavigate: (target: string) => void; covered?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const reduced = useReducedMotion();
  if (covered) return null;
  return <motion.main id="top" className="portrait-home-controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .35 }}>
    <h1 className="sr-only">{PROFILE.name}, engineering leadership and AI</h1>
    <div className="portrait-mast"><span>Engineering leader</span><a href={`mailto:${PROFILE.email}`}>Let’s talk</a></div>
    <nav className="portrait-destinations" aria-label="Explore">
      {destinations.map(item => <button type="button" key={item.key} onPointerEnter={() => setSelected(item.key)} onPointerLeave={() => setSelected(null)} onFocus={() => setSelected(item.key)} onBlur={() => setSelected(null)} onClick={() => onNavigate(item.key)} className={selected === item.key ? 'is-active' : ''}>
        <span className="destination-label">{item.label}</span><ArrowUpRight aria-hidden="true" size={20} />
        <AnimatePresence initial={false}>{selected === item.key && <motion.span className="destination-subheading" key="preview" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .28, ease: [.22, 1, .36, 1] }}><span>{item.preview}</span></motion.span>}</AnimatePresence>
      </button>)}
    </nav>
    <div className="portrait-introduction"><p>Engineering.<br />Leadership.<br />AI in practice.</p></div>
    <div className="portrait-secondary"><button type="button" className="portrait-book-cta" onClick={() => onNavigate('book')}>Book me to speak<ArrowUpRight size={18} aria-hidden="true" /></button></div>
  </motion.main>;
}
