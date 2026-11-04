import { motion, useReducedMotion } from 'framer-motion';
export function ReadingTitle({ children, className = '' }: { children: string; className?: string }) {
  const reduced = useReducedMotion();
  return <h1 className={`portrait-reading-title ${className}`} aria-label={children}>
    {children.split(' ').map((word, i) => <span className="title-window" aria-hidden="true" key={`${word}-${i}`}><motion.span initial={reduced ? false : { y: '110%', rotate: 3 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: .8, delay: .12 + i * .045, ease: [.22, 1, .36, 1] }}>{word}</motion.span></span>)}
  </h1>;
}
