"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { track } from '../utils/mixpanel';

const WORKER_URL = 'https://landingpage-lead.sppathak1428.workers.dev/';
const DASHBOARD_LOGIN_URL = 'https://easibill.vercel.app/login';
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
    <div className="bg-[#f8faf8] px-4 pb-20 pt-32 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Talk to Easibill</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Bring your pharmacy refill workflow. We will make it automatic.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            For sales, onboarding, or a live demo, reach the team directly. We are building with pharmacy owners, not guessing from a template.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={DASHBOARD_LOGIN_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Open Easibill app
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={DISCORD_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-6 py-3.5 text-sm font-semibold text-indigo-800 transition hover:border-indigo-300"
            >
              <MessageCircle className="h-4 w-4" />
              Join Discord
            </a>
          </div>

          <div className="mt-10 grid gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-600" />
              <a href="mailto:support@easibill.com" className="hover:text-blue-700">support@easibill.com</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-600" />
              <a href="mailto:support@easibill.com" className="hover:text-blue-700">support@easibill.com</a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/8"
        >
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-500 p-3 text-white">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Send your details</h2>
                <p className="text-sm text-slate-300">We will reply with the best next step.</p>
              </div>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-blue-400" />
                <p className="text-lg font-semibold text-white">Got it — we will be in touch shortly.</p>
                <p className="text-sm text-slate-400">Expect a reply within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
                  placeholder="Your name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
                    placeholder="Email address"
                  />
                  <input
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
                    placeholder="Phone number"
                  />
                </div>
                <p className="text-xs text-slate-400 -mt-1 px-1">At least one of email or phone is required.</p>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
                  placeholder="Pharmacy / company name"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="min-h-28 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
                  placeholder="What do you want help with?"
                />
                {error && <p className="text-center text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50 disabled:opacity-60"
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
