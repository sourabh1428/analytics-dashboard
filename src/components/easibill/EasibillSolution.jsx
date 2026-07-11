"use client";

import { motion } from 'framer-motion';
import { BarChart3, CalendarClock, CheckCircle2, MessageCircle, ReceiptText } from 'lucide-react';
import { fadeUpBlur, springCard, stagger, VIEWPORT } from '../../utils/animations';

const steps = [
  {
    num: '01',
    icon: ReceiptText,
    title: 'Capture the sale',
    copy: 'Add customer, mobile number, item, quantity, and sale date while billing or after closing.',
  },
  {
    num: '02',
    icon: CalendarClock,
    title: 'Predict the follow-up',
    copy: 'Easibill calculates the next follow-up date and lets staff adjust it for specific items.',
  },
  {
    num: '03',
    icon: MessageCircle,
    title: 'Send the WhatsApp',
    copy: 'A clear reminder goes out at the right time with your business name and customer context.',
  },
  {
    num: '04',
    icon: BarChart3,
    title: 'Track the recovery',
    copy: 'See sent, failed, due, followed up, and inactive customers in one retention dashboard.',
  },
];

const highlights = [
  'No ERP migration',
  'Works for chronic-care medicines',
  'Staff-friendly counter workflow',
  'Delivery and retry visibility',
];

const EasibillSolution = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

          {/* Left — copy */}
          <motion.div
            variants={fadeUpBlur}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-400/70">
              How it works
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Every sale becomes a retention workflow.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/45">
              Record, schedule, remind, track. That is the whole loop a business owner needs to recover missed follow-ups.
            </p>

            <motion.div
              className="mt-8 grid gap-3 sm:grid-cols-2"
              variants={stagger(0.2, 0.07)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {highlights.map((item) => (
                <motion.div
                  key={item}
                  variants={springCard}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 text-sm font-medium text-white/70"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — step cards */}
          <motion.div
            className="relative"
            variants={stagger(0.1, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {/* Vertical connector line */}
            <div className="absolute left-[1.875rem] top-10 hidden h-[calc(100%-5rem)] w-px bg-gradient-to-b from-emerald-500/30 via-white/[0.06] to-transparent md:block" />

            <div className="space-y-3">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    variants={{
                      hidden: { opacity: 0, x: 28, scale: 0.97 },
                      show: {
                        opacity: 1, x: 0, scale: 1,
                        transition: { type: 'spring', stiffness: 90, damping: 20 },
                      },
                    }}
                    whileHover={{ x: 4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                    className="group relative cursor-default rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 backdrop-blur-sm transition-colors duration-200 hover:border-emerald-500/20 hover:bg-emerald-500/[0.05]"
                  >
                    <div className="flex gap-4">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/40 transition-colors duration-200 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-[0.18em] text-white/25">{step.num}</span>
                          <h3 className="text-base font-semibold text-white">{step.title}</h3>
                        </div>
                        <p className="mt-1.5 leading-7 text-white/45">{step.copy}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EasibillSolution;
