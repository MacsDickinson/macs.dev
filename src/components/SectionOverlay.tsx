import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon, ArrowLeftIcon } from 'lucide-react';
type SectionOverlayProps = {
  label: string;
  color: string;
  onClose: () => void;
  children: React.ReactNode;
};
/**
 * Full-screen animated panel that slides over the constellation field.
 * The page itself never scrolls — this overlay owns its own internal scroll.
 * Closes on the button or the Escape key, returning to the constellation.
 */
export function SectionOverlay({
  label,
  color,
  onClose,
  children
}: SectionOverlayProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-40 bg-[var(--ground)] text-[var(--text)]"
      style={{ ['--ac' as string]: color }}
      initial={{
        clipPath: 'circle(0% at 50% 50%)',
        opacity: 0.4
      }}
      animate={{
        clipPath: 'circle(150% at 50% 50%)',
        opacity: 1
      }}
      exit={{
        clipPath: 'circle(0% at 50% 50%)',
        opacity: 0.2
      }}
      transition={{
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1]
      }}>

      {/* Atmosphere — the constellation dissolves into a backlit instrument deck */}
      <div className="pointer-events-none absolute inset-0 z-0 deck-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-0 deck-scan" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-0 deck-grain" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `radial-gradient(120% 80% at 50% -5%, ${color}1f 0%, transparent 55%)`
        }} />

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <button
          onClick={onClose}
          className="pointer-events-auto group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-soft)] transition-colors hover:text-[var(--text)]">

          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Constellation
        </button>
        <div className="pointer-events-auto flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 10px ${color}`
            }} />

          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text)]">
            {label}
          </span>
          <button
            onClick={onClose}
            aria-label="Close section"
            className="ml-3 flex h-9 w-9 items-center justify-center rounded-full text-[var(--text)] bg-[var(--surface)] shadow-[var(--nm-flat)] transition-transform hover:scale-105 active:scale-95 active:shadow-[var(--nm-inset)]">

            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <motion.div
        className="relative z-10 h-full w-full overflow-y-auto"
        initial={{
          opacity: 0,
          y: 24
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.25,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}>
        
        <div className="pt-16">{children}</div>
      </motion.div>
    </motion.div>);

}