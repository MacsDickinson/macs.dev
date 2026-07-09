import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
export type NavNodeData = {
  label: string;
  target: string;
  color: string;
  primary?: boolean;
  align?: 'left' | 'right';
  delay?: number;
};
type NavNodeProps = {
  node: NavNodeData;
  onSelect: (target: string) => void;
};
export function NavNode({ node, onSelect }: NavNodeProps) {
  const {
    label,
    target,
    color,
    primary,
    align = 'left',
    delay = 0
  } = node;
  // Each node gets a unique, gentle drifting orbit so the field feels alive.
  const drift = useMemo(() => {
    const seed = target.length + label.length;
    const ampX = 14 + seed % 5 * 4; // 14–30px
    const ampY = 12 + seed % 4 * 5; // 12–27px
    const dur = 9 + seed % 6; // 9–14s
    return {
      ampX,
      ampY,
      dur
    };
  }, [target, label]);
  return (
    <motion.div
      className="relative"
      initial={{
        opacity: 0,
        scale: 0.6
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}>
      
      {/* Continuous drift wrapper */}
      <motion.div
        animate={{
          x: [0, drift.ampX, -drift.ampX * 0.6, 0],
          y: [0, -drift.ampY, drift.ampY * 0.7, 0]
        }}
        transition={{
          duration: drift.dur,
          repeat: Infinity,
          ease: 'easeInOut'
        }}>
        
        <motion.button
          onClick={() => onSelect(target)}
          aria-label={`Explore ${label}`}
          whileHover={{
            scale: 1.1
          }}
          whileTap={{
            scale: 0.95
          }}
          className={`group flex items-center gap-2.5 focus:outline-none ${align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* Node dot + pulse */}
          <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full node-pulse"
              style={{
                background: color,
                animationDelay: `${delay}s`
              }} />
            
            <span
              className="relative h-2.5 w-2.5 rounded-full ring-2 ring-transparent group-focus-visible:ring-white/60 transition-transform group-hover:scale-125"
              style={{
                background: primary ? 'var(--accent)' : color,
                boxShadow: `0 0 12px ${primary ? 'var(--accent)' : color}`
              }} />
            
          </span>

          {/* Label — the shadow keeps it readable over bright backdrops */}
          <span
            style={{ textShadow: '0 1px 10px rgba(8,10,14,0.85)' }}
            className={`font-mono text-[11px] uppercase tracking-[0.18em] whitespace-nowrap transition-colors ${primary ? 'text-[var(--paper)] font-medium' : 'text-[var(--dim)] group-hover:text-[var(--paper)]'}`}>
            
            {label}
            {primary && <span className="ml-1.5 text-[var(--accent)]">→</span>}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>);

}