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
'w-full bg-transparent border-b border-[var(--edge)] py-3 text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--ac)] transition-colors';
// FormSubmit relays submissions to this inbox as email — no backend needed.
// Deliberately NOT PROFILE.email: contact@macs.dev is a Squarespace forward
// and FormSubmit's activation emails didn't survive the hop — register a
// real inbox directly. Changing this address means re-activating it via
// FormSubmit's confirmation email (sent on first submission; can be slow).
const FORM_INBOX = 'macs@macsdickinson.com';
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_INBOX}`;
export function BookMe() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>>(
    {});
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [honeypot, setHoneypot] = useState('');
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
    setStatus((s) => (s === 'error' ? 'idle' : s));
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
    if (honeypot) {
      // Bot filled the hidden field — pretend it worked, send nothing.
      setStatus('success');
      setForm(EMPTY);
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organisation: form.organisation,
          topic: form.topic,
          message: form.message,
          _subject: `macs.dev enquiry - ${form.topic} - ${form.name}`,
          _template: 'table',
          _replyto: form.email
        })
      });
      // FormSubmit answers 200 even when it didn't deliver (e.g. the address
      // hasn't been activated yet), flagging it in the body instead.
      const data = await res.json();
      if (!res.ok || String(data.success) !== 'true')
      throw new Error(data.message ?? `FormSubmit responded ${res.status}`);
      setStatus('success');
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };
  return (
    <section id="book" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-5">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-16 bg-gradient-to-r from-[var(--ac)] to-transparent" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
                  Book me to speak
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-light leading-[0.95] tracking-tight text-[var(--text)] [font-variation-settings:'opsz'_144]">
                I&apos;d love to join <span className="italic text-[var(--ac)]">your lineup</span>.
              </h2>
              <p className="mt-6 max-w-md text-[var(--text-soft)] leading-relaxed">
                Planning a conference, internal summit, or podcast episode?
                Tell me what you&apos;re planning and I&apos;ll get back to
                you.
              </p>
              <div className="mt-8 space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]">
                  Or reach me directly
                </p>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="font-mono text-lg text-[var(--text)] border-b border-[var(--edge)] hover:border-[var(--ac)] hover:text-[var(--ac)] transition-colors">

                  {PROFILE.email}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-[var(--surface)] p-8 md:p-10 shadow-[var(--nm-raise)]">
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
                  className="flex flex-col items-start gap-5">

                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ac)] text-[var(--ground)] shadow-[0_0_24px_-3px_var(--ac)]">
                      <CheckIcon className="h-6 w-6" />
                    </span>
                    <h3 className="font-display text-3xl font-light text-[var(--text)]">
                      Message sent.
                    </h3>
                    <p className="text-[var(--text-soft)] max-w-sm">
                      Thanks for reaching out. I&apos;ll be in touch within a
                      few days to talk details.
                    </p>
                    <button
                    onClick={() => setStatus('idle')}
                    className="font-mono text-xs uppercase tracking-[0.15em] border-b border-[var(--edge)] pb-1 text-[var(--text)] hover:text-[var(--ac)] hover:border-[var(--ac)] transition-colors">

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

                    <input
                    type="text"
                    name="_honey"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden" />

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
                          className="bg-[var(--surface)] text-[var(--text)]">
                          
                              {t}
                            </option>
                        )}
                          <option
                          value="Something else"
                          className="bg-[var(--surface)] text-[var(--text)]">
                          
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
                    className="inline-flex items-center gap-3 rounded-xl bg-[var(--field)] px-8 py-4 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text)] shadow-[var(--nm-flat)] transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 hover:text-[var(--ac)] hover:shadow-[var(--nm-hover)] active:translate-y-0 active:shadow-[var(--nm-inset)] disabled:opacity-60">

                      {status === 'submitting' ?
                    'Sending…' :
                    status === 'error' ?
                    'Try again' :
                    'Send enquiry'}
                    </button>

                    {status === 'error' &&
                  <p className="text-sm text-[var(--text-soft)]">
                        Something went wrong sending that. Please try again,
                        or email me directly at{' '}
                        <a
                      href={`mailto:${PROFILE.email}`}
                      className="text-[var(--ac)] border-b border-[var(--ac)]/40 hover:border-[var(--ac)] transition-colors">

                          {PROFILE.email}
                        </a>
                        .
                      </p>
                  }
                  </motion.form>
                }
              </AnimatePresence>
              </div>
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
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]">
        {label}
      </span>
      <div className="mt-1">{children}</div>
      {error &&
      <span className="mt-1 block text-xs text-[var(--ac)]">{error}</span>
      }
    </label>);

}