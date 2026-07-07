import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { PROFILE } from '../../data/content';
import { ConstellationBackground } from '../ConstellationBackground';
import { NavNode, type NavNodeData } from '../NavNode';
type HeroProps = {
  onNavigate: (target: string) => void;
};
// Floating nav nodes positioned across the field (% of hero box).
const NODES: NavNodeData[] = [
{
  label: 'Book me to speak',
  target: 'book',
  color: '#ff5a2c',
  primary: true,
  x: 76,
  y: 22,
  align: 'left',
  delay: 0.5
},
{
  label: 'Speaking',
  target: 'speaking',
  color: '#6c5ce7',
  x: 83,
  y: 60,
  align: 'right',
  delay: 0.7
},
{
  label: 'Writing',
  target: 'writing',
  color: '#00b894',
  x: 15,
  y: 68,
  align: 'left',
  delay: 0.85
},
{
  label: 'Work',
  target: 'work',
  color: '#8a93a6',
  x: 64,
  y: 34,
  align: 'left',
  delay: 1
},
{
  label: 'Podcast',
  target: 'podcast',
  color: '#6c5ce7',
  x: 26,
  y: 30,
  align: 'left',
  delay: 1.15
},
{
  label: 'About',
  target: 'about',
  color: '#00b894',
  x: 84,
  y: 82,
  align: 'right',
  delay: 1.3
}];

const item = {
  hidden: {
    opacity: 0,
    y: 30
  },
  show: {
    opacity: 1,
    y: 0
  }
};
export function Hero({ onNavigate }: HeroProps) {
  return (
    <section
      id="top"
      className="relative h-full w-full overflow-hidden bg-[var(--field)] text-[var(--paper)]">
      
      {/* Interactive canvas field */}
      <div className="absolute inset-0">
        <ConstellationBackground className="h-full w-full" />
      </div>

      {/* Vignette to deepen edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
          'radial-gradient(120% 90% at 30% 25%, rgba(22,27,34,0) 40%, rgba(14,17,22,0.85) 100%)'
        }} />
      

      {/* Floating nav nodes */}
      <div className="absolute inset-0 hidden md:block">
        {NODES.map((n) =>
        <NavNode key={n.target} node={n} onSelect={onNavigate} />
        )}
      </div>

      {/* Centered name + tagline */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 md:px-10">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{
            staggerChildren: 0.12,
            delayChildren: 0.1
          }}
          className="pointer-events-none">
          
          <motion.div
            variants={item}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mb-8 flex items-center gap-4">
            
            <span className="font-mono text-xs tracking-widest text-[var(--accent)]">
              00
            </span>
            <span className="h-px w-16 bg-[var(--field-line)]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--dim)]">
              {PROFILE.role} @ {PROFILE.company}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-layered font-display font-light leading-[0.85] tracking-tight text-[clamp(3.25rem,13vw,10rem)]">
            
            Macs
            <br />
            <span className="italic">Dickinson</span>
          </motion.h1>

          <motion.p
            variants={item}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--dim)] md:text-xl">
            
            {PROFILE.tagline}
          </motion.p>

          <motion.p
            variants={item}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mt-6 hidden font-mono text-xs uppercase tracking-[0.2em] text-[var(--dim)]/70 md:block">
            
            An interactive constellation — pick a drifting node to explore.
          </motion.p>
        </motion.div>

        {/* Mobile: node targets as tappable pills (nodes are hidden on small screens) */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          transition={{
            delay: 0.5,
            duration: 0.6
          }}
          className="mt-10 flex flex-wrap gap-2.5 md:hidden">
          
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
      </div>
    </section>);

}