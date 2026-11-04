import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import { PaperPage } from '../PaperPage';
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
'paper-input';
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
  return <PaperPage id="book" label="Book me to speak" title="Let’s get a conversation started." description="Planning a conference, internal summit, or podcast episode? Tell me what you’re planning and I’ll get back to you.">
    <div className="paper-contact-direct">Prefer email? <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></div>
    <div className="paper-booking" aria-live="polite">
      <AnimatePresence mode="wait">
        {status === 'success' ? <motion.div key="success" className="paper-form-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status">
          <CheckIcon size={28} aria-hidden="true" /><h2>Message sent.</h2><p>Thanks for reaching out. I’ll be in touch within a few days to talk details.</p><button className="paper-text-link" onClick={() => setStatus('idle')}>Send another enquiry</button>
        </motion.div> : <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} noValidate aria-label="Speaking enquiry" aria-busy={status === 'submitting'}>
          <input type="text" name="_honey" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="paper-form-pair">
            <Field label="Name" error={errors.name} errorId="name-error"><input name="name" autoComplete="name" required value={form.name} onChange={set('name')} placeholder="Your name" className={inputBase} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} /></Field>
            <Field label="Email" error={errors.email} errorId="email-error"><input name="email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" className={inputBase} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} /></Field>
          </div>
          <div className="paper-form-pair">
            <Field label="Organisation (optional)"><input name="organisation" autoComplete="organization" value={form.organisation} onChange={set('organisation')} placeholder="Event or company" className={inputBase} /></Field>
            <Field label="Topic of interest"><select name="topic" value={form.topic} onChange={set('topic')} className={inputBase}>{ASK_ME_ABOUT.map(topic => <option key={topic} value={topic}>{topic}</option>)}<option value="Something else">Something else</option></select></Field>
          </div>
          <Field label="Tell me more" error={errors.message} errorId="message-error"><textarea name="message" required value={form.message} onChange={set('message')} rows={5} placeholder="Format, audience, date, and what you’d love me to cover…" className={inputBase} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} /></Field>
          <button type="submit" disabled={status === 'submitting'} className="paper-cta">{status === 'submitting' ? 'Sending…' : status === 'error' ? 'Try again' : 'Send enquiry'}</button>
          {status === 'error' && <p className="paper-form-error" role="alert">Something went wrong sending that. Please try again, or email me at <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.</p>}
        </motion.form>}
      </AnimatePresence>
    </div>
  </PaperPage>;
}
function Field({ label, error, errorId, children }: { label: string; error?: string; errorId?: string; children: React.ReactNode }) {
  return <label className="paper-field"><span>{label}</span>{children}{error && <span className="paper-field-error" id={errorId}>{error}</span>}</label>;
}
