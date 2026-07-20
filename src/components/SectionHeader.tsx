import React from "react";
import { Reveal } from "./Reveal";
type SectionHeaderProps = {
  label: string;
  title: React.ReactNode;
  description?: string;
};
export function SectionHeader({
  label,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-12 md:mb-20">
      <Reveal>
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-[var(--ac)] to-transparent" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
            {label}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tight text-[var(--text)] max-w-4xl [font-variation-settings:'opsz'_144]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-base md:text-lg text-[var(--text-soft)] leading-relaxed">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
