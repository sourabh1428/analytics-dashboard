"use client";

import { motion } from 'framer-motion';
import { BellRing, ChartNoAxesCombined, DatabaseZap, ListChecks, MessageSquareText, Tags } from 'lucide-react';
import { fadeUpBlur, springCard, stagger, VIEWPORT } from '../../utils/animations';

const features = [
  {
    icon: DatabaseZap,
    title: 'Patient refill memory',
    copy: 'Store patient, phone, medicine, refill interval, last purchase, and next due date — no ERP migration required.',
  },
  {
    icon: BellRing,
    title: 'Automatic reminders',
    copy: 'Send friendly WhatsApp reminders at 9 AM IST with retry visibility for every failed delivery.',
  },
  {
    icon: ListChecks,
    title: 'Daily action queue',
    copy: 'Know exactly who is due, overdue, or recently refilled before the morning rush starts.',
  },
  {
    icon: Tags,
    title: 'Tags and segments',
    copy: 'Group patients by diabetes, BP, thyroid, senior citizen, or high-value repeat buyer.',
  },
  {
    icon: MessageSquareText,
    title: 'Broadcast campaigns',
    copy: 'Send targeted health camps, seasonal offers, and loyalty messages without blasting everyone.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Retention analytics',
    copy: 'Measure reminders sent, refill response, inactive patients, and recovered monthly revenue.',
  },
];

const rows = [
  ['Today due', '128', 'Send queue ready'],
  ['Failed delivery', '7', 'Needs follow-up'],
  ['Recovered revenue', '₹42,800', 'This month'],
];

const EasibillFeatures = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Premium where it matters.{' '}
            <span className="text-emerald-400">Simple where staff use it.</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/45">
            EasiBill avoids bloated CRM behavior and focuses on the retention jobs a local business performs every single day.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">

          {/* Left — dashboard panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ type: 'spring', stiffness: 75, damping: 18 }}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1b10] shadow-xl shadow-black/40"
          >
            <div className="border-b border-white/[0.07] p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
                Retention dashboard
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">Your daily command centre</h3>
            </div>
            <div className="p-6">
              <motion.div
                className="grid gap-3 sm:grid-cols-3"
                variants={stagger(0.15, 0.08)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {rows.map(([label, value, caption]) => (
                  <motion.div
                    key={label}
                    variants={{
                      hidden: { opacity: 0, y: 12, scale: 0.94 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 18 } },
                    }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4"
                  >
                    <p className="text-sm text-white/45">{label}</p>
                    <p className="mt-3 text-2xl font-bold text-white">{value}</p>
                    <p className="mt-1 text-xs text-emerald-400/70">{caption}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.3 }}
                className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Patients needing attention</p>
                    <p className="text-xs text-white/35">Prioritized for staff follow-up</p>
                  </div>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                    Auto-sorted
                  </span>
                </div>
                {['Ramesh P. — insulin refill overdue', 'Nisha V. — BP medicine due today', 'Kiran M. — WhatsApp delivery failed'].map((item, index) => (
                  <div key={item} className="flex items-center justify-between border-t border-white/[0.05] py-3">
                    <span className="text-sm text-white/55">{item}</span>
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-white/35">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right — feature cards */}
          <motion.div
            className="grid content-start gap-3 sm:grid-cols-2"
            variants={stagger(0.1, 0.07)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  variants={springCard}
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  className="group cursor-pointer rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 backdrop-blur-sm transition-colors duration-200 hover:border-emerald-500/20 hover:bg-emerald-500/[0.05]"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-white/[0.06] p-3 text-white/40 transition-colors duration-200 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{feature.copy}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EasibillFeatures;
