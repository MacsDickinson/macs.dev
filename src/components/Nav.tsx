import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
const LINKS = [
{
  label: 'About',
  href: '#about'
},
{
  label: 'Speaking',
  href: '#speaking'
},
{
  label: 'Work',
  href: '#work'
},
{
  label: 'Writing',
  href: '#writing'
},
{
  label: 'Podcast',
  href: '#podcast'
}];

type NavProps = {
  onNavigate: (href: string) => void;
};
export function Nav({ onNavigate }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const handleClick = (href: string) => {
    setOpen(false);
    onNavigate(href);
  };
  return (
    <motion.header
      initial={{
        y: -80,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[var(--paper)]/85 backdrop-blur-md border-b border-[var(--line)]' : 'border-b border-transparent'}`}>
      
      <nav className="mx-auto max-w-6xl px-6 md:px-10 h-16 flex items-center justify-between">
        <button
          onClick={() => handleClick('#top')}
          className="font-display text-xl font-medium tracking-tight text-[var(--ink)]"
          aria-label="Back to top">
          
          MD<span className="text-[var(--accent)]">.</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) =>
          <button
            key={l.href}
            onClick={() => handleClick(l.href)}
            className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">
            
              {l.label}
            </button>
          )}
          <button
            onClick={() => handleClick('#book')}
            className="font-mono text-xs uppercase tracking-[0.15em] px-4 py-2 bg-[var(--accent)] text-[var(--field)] hover:bg-[var(--accent-deep)] transition-colors">
            
            Book Me
          </button>
        </div>

        <button
          className="md:hidden font-mono text-xs uppercase tracking-widest text-[var(--ink)]"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu">
          
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open &&
      <motion.div
        initial={{
          height: 0,
          opacity: 0
        }}
        animate={{
          height: 'auto',
          opacity: 1
        }}
        className="md:hidden overflow-hidden border-t border-[var(--line)] bg-[var(--paper)]">
        
          <div className="px-6 py-6 flex flex-col gap-4">
            {LINKS.map((l) =>
          <button
            key={l.href}
            onClick={() => handleClick(l.href)}
            className="text-left font-mono text-sm uppercase tracking-[0.15em] text-[var(--ink-soft)]">
            
                {l.label}
              </button>
          )}
            <button
            onClick={() => handleClick('#book')}
            className="mt-2 text-center font-mono text-xs uppercase tracking-[0.15em] px-4 py-3 bg-[var(--ink)] text-[var(--paper)]">
            
              Book Me To Speak
            </button>
          </div>
        </motion.div>
      }
    </motion.header>);

}