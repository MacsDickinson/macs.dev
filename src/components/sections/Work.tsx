import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { WORK } from '../../data/content';

export function Work() {
  return (
    <section id="work" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="03"
          label="Work"
          title={
          <>
              A career of <span className="italic text-[var(--ac)]">scaling teams</span>.
            </>
          } />


        {/* Glowing rail; each role is a plate with a node that lights up. */}
        <div className="relative pl-10">
          <span className="pointer-events-none absolute left-[11px] top-1.5 bottom-1.5 w-0.5 rounded bg-gradient-to-b from-[var(--ac)] to-transparent shadow-[0_0_12px_-2px_var(--ac)]" />

          {WORK.map((role, i) =>
          <Reveal key={role.company + role.period} delay={i * 0.04}>
              <div className="group relative mb-4">
                <span className="absolute -left-[34px] top-6 h-3 w-3 rounded-full bg-[var(--field)] shadow-[var(--nm-flat),0_0_0_4px_var(--ground)] transition-all duration-300 group-hover:bg-[var(--ac)] group-hover:shadow-[0_0_16px_var(--ac),0_0_0_4px_var(--ground)]" />
                <div className="rounded-2xl bg-[var(--surface)] p-6 md:p-7 shadow-[var(--nm-flat)] transition-[transform,box-shadow] duration-300 group-hover:translate-x-1 group-hover:shadow-[var(--nm-raise)]">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--ac)]">
                    {role.period}
                  </p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
                    <h3 className="font-display text-2xl md:text-3xl font-light leading-tight text-[var(--text)]">
                      {role.role}
                    </h3>
                    <span className="font-mono text-sm text-[var(--text-soft)]">
                      @ {role.company}
                    </span>
                  </div>
                  <p className="mt-3 max-w-3xl leading-relaxed text-[var(--text-soft)]">
                    {role.description}
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}
