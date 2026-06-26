"use client";

import { motion } from 'framer-motion';
import { AlertTriangle, ClipboardList, IndianRupee, MessageSquareX, UsersRound } from 'lucide-react';
import { fadeUpBlur, springCard, stagger, VIEWPORT } from '../../utils/animations';

const losses = [
  {
    icon: UsersRound,
    title: 'Your best patients quietly drift away',
    copy: 'Chronic-care customers should return every 25–35 days. Most stores only remember the familiar names — and lose the rest.',
  },
  {
    icon: ClipboardList,
    title: 'Manual lists collapse after 30 follow-ups',
    copy: 'A register, WhatsApp chat, or staff memory cannot scale to hundreds of refill cycles every month without breaking.',
  },
  {
    icon: IndianRupee,
    title: 'The revenue loss compounds silently',
    copy: 'Each missed refill is not one lost sale. It is a recurring relationship handed to the competitor down the street.',
  },
];

const oldTools = [
  'Billing software tracks invoices, not patient relationships',
  'Generic CRMs are too heavy for a pharmacy counter',
  'Manual WhatsApp has no delivery history or refill logic',
];

const counterScenes = [
  'Staff writes "BP uncle refill" in a notebook but cannot find the original bill date.',
  "Owner forwards yesterday's WhatsApp list — two patients are missed during a busy hour.",
  'Patient says they bought the same strip nearby because nobody reminded them.',
];

const EasibillProblem = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <motion.div
            variants={fadeUpBlur}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-red-400/80">
              The hidden leak
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Pharmacy retention is still run from memory.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/45">
              Independent pharmacies have the demand. The problem is refill timing, patient context, and follow-up all living in separate places — with no one connecting them.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpBlur}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="rounded-2xl border border-red-500/[0.15] bg-red-500/[0.06] p-5"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-red-500/10 p-3 text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  One missed reminder can erase a monthly habit.
                </h3>
                <p className="mt-2 text-white/45">
                  If a diabetes patient buys somewhere else once, your store becomes less automatic the next month too.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Loss cards */}
        <motion.div
          className="mt-10 grid gap-4 md:grid-cols-3"
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {losses.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                variants={springCard}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group cursor-default rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-sm transition-colors duration-200 hover:border-red-500/20 hover:bg-red-500/[0.05]"
              >
                <div className="mb-5 inline-flex rounded-xl bg-white/[0.06] p-3 text-white/40 transition-colors duration-200 group-hover:bg-red-500/10 group-hover:text-red-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/45">{item.copy}</p>
              </motion.article>
            );
          })}
        </motion.div>

        {/* "Existing tools stop at the bill" block */}
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
        >
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-7 sm:p-8">
              <div className="mb-5 inline-flex rounded-xl bg-white/[0.06] p-3 text-emerald-400/70">
                <MessageSquareX className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Existing tools stop at the bill.</h3>
              <p className="mt-4 leading-8 text-white/45">
                Marg, Ecogreen, and Vyapar record the sale. They do not know when the patient should come back, which reminder failed, or who needs a personal follow-up today.
              </p>
            </div>
            <div className="border-t border-white/[0.06] bg-white/[0.02] p-7 sm:p-8 lg:border-l lg:border-t-0">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                Where things break
              </p>
              <div className="space-y-2.5">
                {oldTools.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/60" />
                    <span className="text-sm leading-6 text-white/50">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Counter scenes */}
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-5 grid gap-3 rounded-2xl border border-amber-500/[0.12] bg-amber-500/[0.05] p-4 md:grid-cols-3"
        >
          {counterScenes.map((scene, i) => (
            <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-4 text-sm leading-6 text-white/45">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400/70">
                Counter reality
              </span>
              {scene}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default EasibillProblem;
