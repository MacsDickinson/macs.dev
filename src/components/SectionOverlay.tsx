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
      className="fixed inset-0 z-40 bg-[var(--paper)]"
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
      
      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <button
          onClick={onClose}
          className="pointer-events-auto group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]">
          
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
          
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--ink)]">
            {label}
          </span>
          <button
            onClick={onClose}
            aria-label="Close section"
            className="ml-3 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]">
            
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <motion.div
        className="h-full w-full overflow-y-auto"
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