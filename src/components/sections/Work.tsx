import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { WORK } from '../../data/content';
export function Work() {
  return (
    <section id="work" className="scroll-mt-20 border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="03"
          label="Work"
          title={
          <>
              A career of <span className="italic">scaling teams</span>.
            </>
          } />
        

        <div>
          {WORK.map((role, i) =>
          <Reveal key={role.company} delay={i * 0.04}>
              <article className="grid md:grid-cols-12 gap-4 md:gap-8 py-10 border-t border-[var(--line)] first:border-t-[var(--ink)]/15">
                <div className="md:col-span-3">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]">
                    {role.period}
                  </p>
                </div>
                <div className="md:col-span-9">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="font-display text-2xl md:text-3xl font-light text-[var(--ink)]">
                      {role.role}
                    </h3>
                    <span className="font-mono text-sm text-[var(--accent)]">
                      @ {role.company}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-[var(--ink-soft)] leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </article>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}