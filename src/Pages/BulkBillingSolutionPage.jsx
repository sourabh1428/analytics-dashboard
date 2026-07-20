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

const FerbzCTA = lazy(() => import('../components/ferbz/FerbzCTA'));

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const capabilities = [
  {
    icon: LayoutTemplate,
    title: 'Custom WhatsApp templates',
    copy: 'Personalise every message with item name, follow-up date, and business name tokens. Customers get a message that feels written for them.',
  },
  {
    icon: Tags,
    title: 'Segment-based broadcasts',
    copy: 'Target the right customers — regular buyers, wellness clients, senior citizens, or high-value repeat buyers — without blasting everyone.',
  },
  {
    icon: BellRing,
    title: 'Scheduled sends',
    copy: 'Plan event announcements, seasonal offers, or loyalty messages in advance. Campaigns go out at the right time automatically.',
  },
  {
    icon: TrendingUp,
    title: 'Delivery tracking per campaign',
    copy: 'See sent, failed, and read receipts for every broadcast. Know exactly which customer received which message.',
  },
];

const segments = ['Regular customers', 'Spa & wellness clients', 'Retail shoppers', 'Senior citizens', 'High-value buyers', 'Inactive 30+ days'];

const BulkBillingSolutionPage = () => {
  return (
    <div className="space-y-16 pb-20 pt-28 md:space-y-24 md:pb-28 md:pt-36">
      {/* Hero */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 border border-ink bg-paper-white px-3 py-1.5 font-mono text-sm tracking-[0.06em] text-ink shadow-[3px_3px_0_#17150F]">
              <Megaphone className="h-4 w-4" />
              Broadcast + Segmentation — Pro plan
            </div>
            <h1 className="text-balance font-display text-5xl font-extrabold uppercase tracking-[-0.018em] text-ink sm:text-6xl">
              Customisable bulk billing built for local businesses.
            </h1>
            <p className="mt-6 text-lg leading-8 text-mutedink">
              Send the right message to the right customers at the right time. Ferbz's bulk messaging is built around customer segments — not generic contact lists.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <motion.a
                href={DASHBOARD_LOGIN_URL}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 bg-green px-6 py-3.5 font-mono text-sm tracking-[0.08em] text-paper transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
              >
                Start 14-day trial
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center border border-ink bg-paper-white px-6 py-3.5 font-mono text-sm tracking-[0.08em] text-ink transition hover:bg-ink hover:text-paper"
              >
                Book a demo
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
              <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-rust">What it is</p>
              <h2 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-[-0.018em] text-ink sm:text-5xl">
                One message. The right customers. Zero manual work.
              </h2>
              <p className="mt-5 text-lg leading-8 text-mutedink">
                Bulk billing lets you compose a single WhatsApp message and deliver it to a filtered group of customers — by item, interest, activity, or custom tag. Unlike a generic blast, every message includes the customer's name and relevant item details.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  'No tech skills required — compose in the dashboard',
                  'Segments update automatically as customers are added',
                  'Schedule future campaigns without being online',
                  'Tracks delivery so you know who actually received it',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 border border-ink bg-paper-white p-4 text-sm font-medium text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green" />
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
              className="overflow-hidden border border-ink bg-ink text-paper shadow-[8px_8px_0_#17150F]"
            >
              <div className="border-b border-white/10 p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-green-bright">Broadcast composer</p>
                <h3 className="mt-1 text-lg font-semibold">New campaign</h3>
              </div>
              <div className="space-y-4 p-5">
                <div className="border border-white/10 bg-white/[0.06] p-4">
                  <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-faint">Segment</p>
                  <div className="flex flex-wrap gap-2">
                    {segments.map((seg, i) => (
                      <span
                        key={seg}
                        className={`px-3 py-1 text-xs font-medium ${
                          i === 0
                            ? 'bg-green text-paper'
                            : 'border border-white/10 bg-white/10 text-faint'
                        }`}
                      >
                        {seg}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border border-white/10 bg-white/[0.06] p-4">
                  <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-faint">Message preview</p>
                  <div className="border border-ink bg-paper-warm p-4 text-sm leading-6 text-ink">
                    Namaste {'{'}{'{'} Name {'}'}{'}'},<br />
                    Kumar Medicos is running a customer appreciation weekend this Sunday. Please visit us before 12 PM.
                  </div>
                </div>
                <div className="flex items-center justify-between border border-white/10 bg-white/[0.06] p-4">
                  <div>
                    <p className="text-sm font-semibold">Recipients</p>
                    <p className="font-mono text-xs text-faint">142 regular customers</p>
                  </div>
                  <button type="button" className="inline-flex items-center gap-2 bg-green px-4 py-2 font-mono text-xs font-semibold text-paper transition hover:bg-green-bright hover:text-ink">
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
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-rust">Capabilities</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-[-0.018em] text-ink sm:text-5xl">
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
                  className="group border border-ink bg-paper-white p-5 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#17150F]"
                >
                  <div className="mb-4 inline-flex border border-ink bg-green-pale p-3 text-green transition group-hover:bg-ink group-hover:text-green-bright">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{cap.title}</h3>
                  <p className="mt-2 leading-7 text-mutedink">{cap.copy}</p>
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
            className="overflow-hidden border border-ink bg-paper-alt p-5 shadow-[8px_8px_0_#17150F] sm:p-8 lg:p-10"
          >
            <p className="mb-8 text-center font-mono text-sm font-semibold uppercase tracking-[0.22em] text-rust">The difference</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="border border-ink bg-paper-white p-6">
                <div className="mb-4 inline-flex items-center gap-2 border border-rust bg-paper-white px-3 py-1.5 text-sm font-semibold text-rust">
                  <X className="h-4 w-4" />
                  Before Ferbz
                </div>
                <ul className="space-y-3 text-mutedink">
                  {[
                    'Blast every contact with the same generic message',
                    'High opt-out rate from irrelevant messages',
                    'No way to know who received or responded',
                    'Staff manually copies numbers into WhatsApp groups',
                    'No record of what was sent or when',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-rust" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-ink bg-paper-white p-6">
                <div className="mb-4 inline-flex items-center gap-2 border border-green bg-green-pale px-3 py-1.5 text-sm font-semibold text-green">
                  <CheckCircle2 className="h-4 w-4" />
                  After Ferbz
                </div>
                <ul className="space-y-3 text-mutedink">
                  {[
                    'Targeted messages to the right segment only',
                    'Customers respond because the message is relevant',
                    'Full delivery report — sent, failed, read',
                    'One click to schedule from the dashboard',
                    'Campaign history saved automatically',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green" />
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
            className="flex flex-col items-start justify-between gap-6 border border-ink bg-paper-white p-6 shadow-[8px_8px_0_#17150F] md:flex-row md:items-center"
          >
            <div>
              <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-rust">Pro plan</p>
              <h3 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-[-0.018em] text-ink">Bulk broadcasts from $9/month</h3>
              <p className="mt-2 text-mutedink">Broadcast messaging, segmentation, templates, and advanced analytics — all included in Pro.</p>
            </div>
            <a
              href="/#pricing"
              className="inline-flex items-center gap-2 whitespace-nowrap bg-green px-6 py-3.5 font-mono text-sm tracking-[0.08em] text-paper transition hover:bg-ink"
            >
              See all pricing
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA strip */}
      <Suspense fallback={<LoadingSpinner />}>
        <FerbzCTA />
      </Suspense>
    </div>
  );
};

export default BulkBillingSolutionPage;
