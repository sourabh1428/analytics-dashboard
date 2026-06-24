"use client";

import { motion } from 'framer-motion';
import { AlertTriangle, ClipboardList, IndianRupee, MessageSquareX, UsersRound } from 'lucide-react';

const losses = [
  {
    icon: UsersRound,
    title: 'Your best patients quietly drift away',
    copy: 'Chronic-care customers should return every 25-35 days, but most stores only remember the familiar names.',
  },
  {
    icon: ClipboardList,
    title: 'Manual lists collapse after 30 follow-ups',
    copy: 'A register, WhatsApp chat, or staff memory cannot scale to hundreds of refill cycles every month.',
  },
  {
    icon: IndianRupee,
    title: 'The revenue loss compounds',
    copy: 'Each missed refill is not one lost sale. It is a recurring relationship handed to a nearby competitor.',
  },
];

const oldTools = ['Billing software tracks invoices, not relationships', 'Generic CRMs are too heavy for pharmacy counters', 'Manual WhatsApp has no delivery history or refill logic'];

const counterScenes = [
  'Staff writes "BP uncle refill" in a notebook but cannot find the bill date.',
  'Owner forwards yesterday\'s WhatsApp list to an assistant and two patients are missed.',
  'Patient says they bought the same strip nearby because nobody reminded them.',
];

const EasibillProblem = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-600">The hidden leak</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Pharmacy retention is still run from memory.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Independent pharmacies already have the demand. The problem is that refill timing, patient context, and WhatsApp follow-up live in separate places.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-[2rem] border border-red-100 bg-gradient-to-br from-white to-red-50 p-5 shadow-xl shadow-red-950/5"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-100 p-3 text-red-700">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">One missed reminder can erase a monthly habit.</h3>
                <p className="mt-2 text-slate-600">
                  If a diabetes patient buys somewhere else once, your store becomes less automatic the next month too.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {losses.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/5"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700 transition group-hover:bg-red-100 group-hover:text-red-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.copy}</p>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-950/20"
        >
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-7 sm:p-8">
              <div className="mb-5 inline-flex rounded-2xl bg-white/10 p-3 text-emerald-300">
                <MessageSquareX className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold">Existing tools stop at the bill.</h3>
              <p className="mt-4 leading-8 text-slate-300">
                Marg, Ecogreen, and Vyapar can record the sale. They do not know when the patient should come back, which reminder failed, or who needs a personal follow-up today.
              </p>
            </div>
            <div className="border-t border-white/10 bg-white/[0.04] p-7 sm:p-8 lg:border-l lg:border-t-0">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">What breaks</p>
              <div className="space-y-3">
                {oldTools.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-slate-200">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-3 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 md:grid-cols-3">
          {counterScenes.map((scene) => (
            <div key={scene} className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Counter reality</span>
              {scene}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EasibillProblem;
