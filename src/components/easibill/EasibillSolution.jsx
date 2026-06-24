"use client";

import { motion } from 'framer-motion';
import { BarChart3, CalendarClock, CheckCircle2, MessageCircle, ReceiptText, RefreshCcw } from 'lucide-react';

const steps = [
  {
    icon: ReceiptText,
    title: 'Capture the sale',
    copy: 'Add patient, mobile number, medicine, quantity, and sale date while billing or after closing.',
  },
  {
    icon: CalendarClock,
    title: 'Predict the refill',
    copy: 'Easibill calculates the next refill date and lets staff adjust it for specific medicines.',
  },
  {
    icon: MessageCircle,
    title: 'Send the WhatsApp',
    copy: 'A clear reminder goes out at the right time with your pharmacy name and patient context.',
  },
  {
    icon: BarChart3,
    title: 'Track the recovery',
    copy: 'See sent, failed, due, refilled, and inactive patients in one retention dashboard.',
  },
];

const highlights = ['No ERP migration', 'Works for chronic-care medicines', 'Staff-friendly counter workflow', 'Delivery and retry visibility'];

const EasibillSolution = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2.25rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-5 shadow-xl shadow-emerald-950/5 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">The Easibill loop</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Every sale becomes a retention workflow.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The product stays intentionally simple: record, schedule, remind, track. That is the whole loop a pharmacy owner needs to recover missed refills.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white bg-white/75 p-4 text-sm font-medium text-slate-700 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute left-8 top-10 hidden h-[calc(100%-5rem)] w-px bg-gradient-to-b from-emerald-300 via-cyan-300 to-transparent md:block" />
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                    className="relative rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-emerald-300 shadow-lg shadow-slate-950/15">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Step {index + 1}</div>
                        <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
                        <p className="mt-2 leading-7 text-slate-600">{step.copy}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mt-8 grid gap-4 rounded-[1.75rem] border border-emerald-200 bg-white/80 p-4 shadow-sm md:grid-cols-3"
        >
          <div className="rounded-2xl bg-slate-950 p-5 text-white">
            <RefreshCcw className="mb-4 h-6 w-6 text-emerald-300" />
            <p className="text-sm text-slate-300">Workflow outcome</p>
            <p className="mt-2 text-2xl font-semibold">More repeat visits with less counter work.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Before Easibill</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Manual WhatsApp, forgotten dates, no tracking.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-medium text-emerald-700">After Easibill</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Automatic reminders, clear lists, measurable recovery.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EasibillSolution;
