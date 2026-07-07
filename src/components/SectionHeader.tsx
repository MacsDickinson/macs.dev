import React from 'react';
import { Reveal } from './Reveal';
type SectionHeaderProps = {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: string;
};
export function SectionHeader({
  index,
  label,
  title,
  description
}: SectionHeaderProps) {
  return (
    <div className="mb-12 md:mb-20">
      <Reveal>
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-xs tracking-widest text-[var(--accent)]">
            {index}
          </span>
          <span className="h-px flex-1 max-w-[120px] bg-[var(--line)]" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
            {label}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tight text-[var(--ink)] max-w-4xl">
          {title}
        </h2>
      </Reveal>
      {description &&
      <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-base md:text-lg text-[var(--ink-soft)] leading-relaxed">
            {description}
          </p>
        </Reveal>
      }
    </div>);

}