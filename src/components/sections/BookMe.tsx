import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import { Reveal } from '../Reveal';
import { PROFILE, ASK_ME_ABOUT } from '../../data/content';
type FormState = {
  name: string;
  email: string;
  organisation: string;
  topic: string;
  message: string;
};
const EMPTY: FormState = {
  name: '',
  email: '',
  organisation: '',
  topic: ASK_ME_ABOUT[0],
  message: ''
};
const inputBase =
'w-full bg-transparent border-b border-[var(--line)] py-3 text-[var(--ink)] placeholder-[var(--ink-soft)]/60 focus:outline-none focus:border-[var(--ink)] transition-colors';
export function BookMe() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>>(
    {});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    'idle'
  );
  const set =
  (key: keyof FormState) =>
  (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>

  {
    setForm((f) => ({
      ...f,
      [key]: e.target.value
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: undefined
    }));
  };
  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Please add your name';
    if (!form.email.trim()) next.email = 'Please add an email';else
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    next.email = 'That email looks off';
    if (!form.message.trim()) next.message = 'A few details help';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    await new Promise((r) => setTimeout(r, 1100));
    setStatus('success');
    setForm(EMPTY);
  };
  return (
    <section
      id="book"
      className="scroll-mt-20 border-t border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
      
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-5">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs tracking-widest text-[var(--accent)]">
                  06
                </span>
                <span className="h-px w-16 bg-[var(--paper)]/25" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--paper)]/60">
                  Book me to speak
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-light leading-[0.95] tracking-tight">
                Let&apos;s put me on <span className="italic">your stage</span>.
              </h2>
              <p className="mt-6 max-w-md text-[var(--paper)]/70 leading-relaxed">
                Planning a conference, internal summit, or podcast episode? Tell
                me what you&apos;re building and I&apos;ll get back to you
                personally.
              </p>
              <div className="mt-8 space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper)]/50">
                  Or reach me directly
                </p>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="font-mono text-lg text-[var(--paper)] border-b border-[var(--paper)]/40 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                  
                  {PROFILE.email}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <AnimatePresence mode="wait">
                {status === 'success' ?
                <motion.div
                  key="success"
                  initial={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  className="flex flex-col items-start gap-5 border border-[var(--paper)]/20 p-10">
                  
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]">
                      <CheckIcon className="h-6 w-6" />
                    </span>
                    <h3 className="font-display text-3xl font-light">
                      Message sent.
                    </h3>
                    <p className="text-[var(--paper)]/70 max-w-sm">
                      Thanks for reaching out — I&apos;ll be in touch within a
                      few days to talk details.
                    </p>
                    <button
                    onClick={() => setStatus('idle')}
                    className="font-mono text-xs uppercase tracking-[0.15em] border-b border-[var(--paper)]/40 pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                    
                      Send another
                    </button>
                  </motion.div> :

                <motion.form
                  key="form"
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  onSubmit={onSubmit}
                  noValidate
                  className="space-y-8">
                  
                    <div className="grid sm:grid-cols-2 gap-8">
                      <Field label="Name" error={errors.name}>
                        <input
                        type="text"
                        value={form.name}
                        onChange={set('name')}
                        placeholder="Your name"
                        className={inputBase} />
                      
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <input
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="you@company.com"
                        className={inputBase} />
                      
                      </Field>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      <Field label="Organisation">
                        <input
                        type="text"
                        value={form.organisation}
                        onChange={set('organisation')}
                        placeholder="Event or company"
                        className={inputBase} />
                      
                      </Field>
                      <Field label="Topic of interest">
                        <select
                        value={form.topic}
                        onChange={set('topic')}
                        className={`${inputBase} appearance-none`}>
                        
                          {ASK_ME_ABOUT.map((t) =>
                        <option
                          key={t}
                          value={t}
                          className="bg-[var(--ink)]">
                          
                              {t}
                            </option>
                        )}
                          <option
                          value="Something else"
                          className="bg-[var(--ink)]">
                          
                            Something else
                          </option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Tell me more" error={errors.message}>
                      <textarea
                      value={form.message}
                      onChange={set('message')}
                      rows={4}
                      placeholder="Format, audience, date, and what you'd love me to cover…"
                      className={`${inputBase} resize-none`} />
                    
                    </Field>

                    <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center gap-3 bg-[var(--paper)] text-[var(--ink)] px-8 py-4 font-mono text-xs uppercase tracking-[0.15em] hover:bg-[var(--accent)] hover:text-[var(--paper)] transition-colors disabled:opacity-60">
                    
                      {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
                    </button>
                  </motion.form>
                }
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </div>
    </section>);

}
function Field({
  label,
  error,
  children




}: {label: string;error?: string;children: React.ReactNode;}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper)]/50">
        {label}
      </span>
      <div className="mt-1">{children}</div>
      {error &&
      <span className="mt-1 block text-xs text-[var(--accent)]">{error}</span>
      }
    </label>);

}