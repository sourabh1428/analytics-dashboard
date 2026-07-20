"use client";

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EasibillFeatures = lazy(() => import('../components/easibill/EasibillFeatures'));
const EasibillCTA = lazy(() => import('../components/easibill/EasibillCTA'));

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const comparison = [
  { label: 'Setup time',           manual: 'None',           crm: '2–4 weeks',     easibill: '< 5 minutes' },
  { label: 'Monthly staff effort', manual: 'Hours of chats', crm: 'Training needed', easibill: 'Daily 2-min review' },
  { label: 'Customer tracking',    manual: 'Memory / notebook', crm: 'Spreadsheet import', easibill: 'Built-in, automatic' },
  { label: 'Reminder automation',  manual: 'None',           crm: 'Complex setup',  easibill: 'On by default' },
  { label: 'Monthly cost',         manual: '$0',             crm: '$20–80/user', easibill: 'From $9' },
];

const FeaturesPage = () => {
  return (
    <div className="space-y-16 pb-20 pt-28 md:space-y-24 md:pb-28 md:pt-36">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-rust">Product features</p>
            <h1 className="mt-4 text-balance font-display text-5xl font-extrabold uppercase tracking-[-0.018em] text-ink sm:text-6xl">
              Every tool your business counter needs. Nothing it doesn't.
            </h1>
            <p className="mt-6 text-lg leading-8 text-mutedink">
              Easibill is not a CRM. It is a focused retention tool that fits the way a business counter already works — no migration, no training programme, no bloat.
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
                href="/lead"
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

      {/* Feature grid (reuse existing section) */}
      <Suspense fallback={<LoadingSpinner />}>
        <EasibillFeatures />
      </Suspense>

      {/* Comparison table */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-rust">How it compares</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-[-0.018em] text-ink sm:text-5xl">
              Designed for local businesses, not generic CRMs.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="mt-10 overflow-hidden border border-ink bg-paper-white shadow-[8px_8px_0_#17150F]"
          >
            {/* Table header */}
            <div className="grid grid-cols-4 gap-px bg-ink">
              <div className="bg-paper-alt px-5 py-4 font-mono text-sm font-semibold text-mutedink" />
              <div className="bg-paper-alt px-5 py-4 font-mono text-sm font-semibold text-ink-soft">Manual WhatsApp</div>
              <div className="bg-paper-alt px-5 py-4 font-mono text-sm font-semibold text-ink-soft">Generic CRM</div>
              <div className="bg-green-pale px-5 py-4 font-mono text-sm font-semibold text-green">Easibill</div>
            </div>
            {/* Rows */}
            {comparison.map((row, index) => (
              <div
                key={row.label}
                className="grid grid-cols-4 gap-px bg-ink"
              >
                <div className="bg-paper-white px-5 py-4 text-sm font-medium text-ink-soft">{row.label}</div>
                <div className="bg-paper-white px-5 py-4 text-sm text-mutedink">{row.manual}</div>
                <div className="bg-paper-white px-5 py-4 text-sm text-mutedink">{row.crm}</div>
                <div className="flex items-center gap-2 bg-green-pale/50 px-5 py-4 text-sm font-medium text-green">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green" />
                  {row.easibill}
                </div>
              </div>
            ))}
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

export default FeaturesPage;
