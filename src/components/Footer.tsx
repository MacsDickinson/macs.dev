import React from 'react';
import { PROFILE } from '../data/content';
export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper-alt)]">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-display text-2xl text-[var(--ink)]">
            {PROFILE.name}
            <span className="text-[var(--accent)]">.</span>
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]">
            {PROFILE.role} @ {PROFILE.company}
          </p>
        </div>
        <div className="text-left md:text-right">
          <a
            href={`mailto:${PROFILE.email}`}
            className="font-mono text-sm text-[var(--ink)] hover:text-[var(--accent)] transition-colors">
            
            {PROFILE.email}
          </a>
          <p className="mt-3 font-mono text-xs text-[var(--ink-soft)]">
            © {new Date().getFullYear()} {PROFILE.name} · Built with ♥ in the
            UK
          </p>
        </div>
      </div>
    </footer>);

}