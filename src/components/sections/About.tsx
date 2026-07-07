import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { PROFILE, ASK_ME_ABOUT, PRINCIPLES } from '../../data/content';
export function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="01"
          label="About"
          title={
          <>
              Director of Engineering at{' '}
              <span className="italic">{PROFILE.company}</span>.
            </>
          } />
        

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="text-xl md:text-2xl font-display font-light leading-relaxed text-[var(--ink)]">
                {PROFILE.intro}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 font-mono text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]">
                Previously
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PROFILE.previously.map((p) =>
                <span
                  key={p}
                  className="border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--ink)]">
                  
                    {p}
                  </span>
                )}
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal delay={0.15}>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent)] mb-5">
                Ask me about
              </p>
              <ul className="space-y-4">
                {ASK_ME_ABOUT.map((topic, i) =>
                <li
                  key={topic}
                  className="flex gap-4 border-b border-[var(--line)] pb-4">
                  
                    <span className="font-mono text-xs text-[var(--ink-soft)] pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[var(--ink)]">{topic}</span>
                  </li>
                )}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Philosophy */}
        <div className="mt-24 md:mt-32">
          <Reveal>
            <div className="flex items-center gap-4 mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                How I think
              </span>
              <span className="h-px flex-1 bg-[var(--line)]" />
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
            {PRINCIPLES.map((p, i) =>
            <Reveal key={p.title} delay={i * 0.05}>
                <div className="bg-[var(--paper)] p-8 h-full hover:bg-[var(--paper-alt)] transition-colors">
                  <span className="font-mono text-xs text-[var(--accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-[var(--ink)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>);

}