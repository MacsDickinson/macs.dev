import { useReducedMotion } from '../hooks/useReducedMotion';
import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

/** A real button and labelled region; only the requested detail moves. */
export function PaperDisclosure({ heading, children, defaultOpen = false }: { heading: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const reduced = useReducedMotion();
  return <article className={`paper-disclosure ${open ? 'is-open' : ''}`}>
    <h2><button id={`${id}-button`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{heading}<Plus size={20} className="paper-disclosure-icon" aria-hidden="true" /></button></h2>
    <AnimatePresence initial={false}>{open && <motion.div id={id} role="region" aria-labelledby={`${id}-button`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .35, ease: [.22, 1, .36, 1] }} className="paper-disclosure-body"><div>{children}</div></motion.div>}</AnimatePresence>
  </article>;
}
