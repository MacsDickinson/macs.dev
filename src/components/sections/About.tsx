import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../Reveal';
import { PROFILE, ASK_ME_ABOUT, PRINCIPLES } from '../../data/content';

export function About() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <SectionHeader
          index="01"
          label="About"
          title={
          <>
              Director of Engineering at{' '}
              <span className="italic text-[var(--ac)]">{PROFILE.company}</span>.
            </>
          } />


        <div className="grid gap-6 md:grid-cols-[1.35fr_1fr]">
          {/* Intro plate */}
          <Reveal>
            <div className="h-full rounded-2xl bg-[var(--surface)] p-7 md:p-8 shadow-[var(--nm-raise)]">
              <p className="font-display text-xl md:text-2xl font-light leading-relaxed text-[var(--text)]">
                {PROFILE.intro}
              </p>
              <p className="mt-7 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
                Previously
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {PROFILE.previously.map((p) =>
                <span
                  key={p}
                  className="rounded-lg bg-[var(--field)] px-3.5 py-2 text-sm text-[var(--text-soft)] shadow-[var(--nm-inset)]">

                    {p}
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          {/* Ask me about — inset slots */}
          <Reveal delay={0.12}>
            <div className="h-full rounded-2xl bg-[var(--surface)] p-7 md:p-8 shadow-[var(--nm-raise)]">
              <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--ac)]">
                Ask me about
              </p>
              <ul className="flex flex-col gap-2.5">
                {ASK_ME_ABOUT.map((topic, i) =>
                <li
                  key={topic}
                  className="grid grid-cols-[auto_1fr] items-center gap-3.5 rounded-xl bg-[var(--field)] px-4 py-3.5 shadow-[var(--nm-inset)] transition-shadow duration-300 hover:shadow-[var(--nm-inset),inset_0_0_0_1px_color-mix(in_srgb,var(--ac)_32%,transparent)]">

                    <span className="font-mono text-xs text-[var(--ac)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-[var(--text)]">{topic}</span>
                  </li>
                )}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Philosophy — extruded keycaps */}
        <div className="mt-16 md:mt-24">
          <Reveal>
            <div className="mb-9 flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
                How I think
              </span>
              <span className="h-px flex-1 bg-[var(--edge-soft)]" />
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) =>
            <Reveal key={p.title} delay={i * 0.05}>
                <div className="group h-full rounded-2xl bg-[var(--surface)] p-7 shadow-[var(--nm-raise)] transition-[transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(.2,.8,.25,1)] hover:-translate-y-1.5 hover:shadow-[var(--nm-hover)] active:translate-y-0 active:shadow-[var(--nm-inset)]">
                  <span className="font-mono text-xs text-[var(--ac)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-light leading-tight text-[var(--text)]">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-soft)]">
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
