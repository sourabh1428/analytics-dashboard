"use client";

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  LayoutTemplate,
  Megaphone,
  Send,
  Tags,
  TrendingUp,
  X,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EasibillCTA = lazy(() => import('../components/easibill/EasibillCTA'));

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const capabilities = [
  {
    icon: LayoutTemplate,
    title: 'Custom WhatsApp templates',
    copy: 'Personalise every message with medicine name, refill date, and pharmacy name tokens. Patients get a message that feels written for them.',
  },
  {
    icon: Tags,
    title: 'Segment-based broadcasts',
    copy: 'Target the right patients — diabetes group, BP patients, senior citizens, or high-value repeat buyers — without blasting everyone.',
  },
  {
    icon: BellRing,
    title: 'Scheduled sends',
    copy: 'Plan health camp announcements, seasonal offers, or loyalty messages in advance. Campaigns go out at the right time automatically.',
  },
  {
    icon: TrendingUp,
    title: 'Delivery tracking per campaign',
    copy: 'See sent, failed, and read receipts for every broadcast. Know exactly which patient received which message.',
  },
];

const segments = ['Diabetes patients', 'BP medication', 'Thyroid care', 'Senior citizens', 'High-value buyers', 'Inactive 30+ days'];

const BulkBillingSolutionPage = () => {
  return (
    <div className="space-y-16 pb-20 pt-28 md:space-y-24 md:pb-28 md:pt-36">
      {/* Hero */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.15),transparent_30%)]" />
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/75 px-3 py-1.5 text-sm font-medium text-violet-800 shadow-sm backdrop-blur">
              <Megaphone className="h-4 w-4" />
              Broadcast + Segmentation — Pro plan
            </div>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Customisable bulk billing built for independent pharmacies.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Send the right message to the right patients at the right time. Easibill's bulk messaging is built around pharmacy segments — not generic contact lists.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <motion.a
                href={DASHBOARD_LOGIN_URL}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-600/25 transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                Start 14-day trial
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-violet-300 hover:text-violet-800"
              >
                Book pharmacy demo
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is bulk billing — 2-col explainer */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-700">What it is</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                One message. The right patients. Zero manual work.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Bulk billing lets you compose a single WhatsApp message and deliver it to a filtered group of patients — by medicine, condition, activity, or custom tag. Unlike a generic blast, every message includes the patient's name and relevant medicine details.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  'No tech skills required — compose in the dashboard',
                  'Segments update automatically as patients are added',
                  'Schedule future campaigns without being online',
                  'Tracks delivery so you know who actually received it',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet-600" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual mock — broadcast composer */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-950/20"
            >
              <div className="border-b border-white/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Broadcast composer</p>
                <h3 className="mt-1 text-lg font-semibold">New campaign</h3>
              </div>
              <div className="space-y-4 p-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Segment</p>
                  <div className="flex flex-wrap gap-2">
                    {segments.map((seg, i) => (
                      <span
                        key={seg}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          i === 0
                            ? 'bg-violet-500 text-white'
                            : 'border border-white/10 bg-white/10 text-slate-300'
                        }`}
                      >
                        {seg}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Message preview</p>
                  <div className="rounded-xl bg-violet-50 p-4 text-sm leading-6 text-violet-900">
                    Namaste {'{'}{'{'} Name {'}'}{'}'},<br />
                    Kumar Medicos is running a free diabetes check-up camp this Sunday. Please visit us before 12 PM.
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div>
                    <p className="text-sm font-semibold">Recipients</p>
                    <p className="text-xs text-slate-400">142 diabetes patients</p>
                  </div>
                  <button type="button" className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-400">
                    <Send className="h-3.5 w-3.5" />
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-600">Capabilities</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Built for campaigns that actually get responses.
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              return (
                <motion.article
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.07 }}
                  className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-950/5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-violet-50 p-3 text-violet-700 transition group-hover:bg-slate-950 group-hover:text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{cap.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{cap.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2.25rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 shadow-xl shadow-violet-950/5 sm:p-8 lg:p-10"
          >
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.22em] text-violet-700">The difference</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-rose-100 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700">
                  <X className="h-4 w-4" />
                  Before Easibill
                </div>
                <ul className="space-y-3 text-slate-600">
                  {[
                    'Blast every contact with the same generic message',
                    'High opt-out rate from irrelevant messages',
                    'No way to know who received or responded',
                    'Staff manually copies numbers into WhatsApp groups',
                    'No record of what was sent or when',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.75rem] border border-violet-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
                  <CheckCircle2 className="h-4 w-4" />
                  After Easibill
                </div>
                <ul className="space-y-3 text-slate-600">
                  {[
                    'Targeted messages to the right segment only',
                    'Patients respond because the message is relevant',
                    'Full delivery report — sent, failed, read',
                    'One click to schedule from the dashboard',
                    'Campaign history saved automatically',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing callout */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-700">Pro plan</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Bulk broadcasts from $9/month</h3>
              <p className="mt-2 text-slate-600">Broadcast messaging, segmentation, templates, and advanced analytics — all included in Pro.</p>
            </div>
            <a
              href="/#pricing"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              See all pricing
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA strip */}
      <Suspense fallback={<LoadingSpinner />}>
        <EasibillCTA />
      </Suspense>
    </div>
  );
};

export default BulkBillingSolutionPage;
