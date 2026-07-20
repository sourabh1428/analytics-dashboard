"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { track } from '../utils/mixpanel';

const WORKER_URL = 'https://landingpage-lead.sppathak1428.workers.dev/';
const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';
const DISCORD_URL = 'https://discord.gg/easibill';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { setError('Please enter your name.'); return; }
    if (!form.email && !form.mobile) { setError('Please provide at least an email or phone number.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || form.mobile,
          mobile: form.mobile || form.email,
          company: form.company,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      track('demo_requested', { source: 'email_page', method: 'form_submit', company: form.company });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-paper px-4 pb-20 pt-32 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-rust">Talk to Ferbz</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase tracking-[-0.018em] sm:text-6xl">
            Bring your business follow-up workflow. We will make it automatic.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-mutedink">
            For sales, onboarding, or a live demo, reach the team directly. We are building with local business owners, not guessing from a template.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={DASHBOARD_LOGIN_URL}
              className="inline-flex items-center justify-center gap-2 bg-green px-6 py-3.5 font-mono text-sm tracking-[0.08em] text-paper transition hover:bg-ink"
            >
              Open Ferbz app
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={DISCORD_URL}
              className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3.5 font-mono text-sm tracking-[0.08em] text-ink transition hover:bg-ink hover:text-paper"
            >
              <MessageCircle className="h-4 w-4" />
              Join Discord
            </a>
          </div>

          <div className="mt-10 grid gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-green" />
              <a href="mailto:support@ferbz.com" className="hover:text-green">support@ferbz.com</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-green" />
              <a href="mailto:support@ferbz.com" className="hover:text-green">support@ferbz.com</a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="border border-ink bg-paper-white p-5 shadow-[8px_8px_0_#17150F]"
        >
          <div className="bg-ink p-6 text-paper">
            <div className="mb-5 flex items-center gap-3">
              <div className="bg-green p-3 text-paper">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Send your details</h2>
                <p className="text-sm text-faint">We will reply with the best next step.</p>
              </div>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-green-bright" />
                <p className="text-lg font-semibold text-paper">Got it — we will be in touch shortly.</p>
                <p className="text-sm text-faint">Expect a reply within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-faint focus:border-green"
                  placeholder="Your name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-faint focus:border-green"
                    placeholder="Email address"
                  />
                  <input
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange}
                    className="border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-faint focus:border-green"
                    placeholder="Phone number"
                  />
                </div>
                <p className="text-xs text-faint -mt-1 px-1">At least one of email or phone is required.</p>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-faint focus:border-green"
                  placeholder="Business / company name"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="min-h-28 border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-faint focus:border-green"
                  placeholder="What do you want help with?"
                />
                {error && <p className="text-center text-sm text-rust">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-paper px-5 py-3 font-mono text-sm tracking-[0.08em] text-ink transition hover:bg-green-pale disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit inquiry'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContactPage;
