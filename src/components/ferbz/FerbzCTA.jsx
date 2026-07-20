"use client";

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Headphones, MessageCircle } from 'lucide-react';
import { track } from '../../utils/mixpanel';
import { fadeUpBlur, springCard, stagger, VIEWPORT } from '../../utils/animations';

const trial = [
  'Connect your business profile',
  'Add or import customers',
  'Send your first reminders',
  'Review follow-up performance',
];

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const FerbzCTA = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      {/* Dark section scales in from slightly small */}
      <motion.div
        className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl"
        initial={{ opacity: 0, scale: 0.97, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ type: 'spring', stiffness: 75, damping: 18 }}
      >
        <div className="p-7 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">

            {/* Left copy — blur reveal */}
            <motion.div
              variants={fadeUpBlur}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h2 className="max-w-2xl text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
                Stop losing customers
                <br />
                <span className="text-amber-400">to memory.</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Launch Ferbz with one store, one staff workflow, and one simple goal — bring repeat customers back before they buy elsewhere.
              </p>
              <motion.div
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.45 }}
              >
                <motion.a
                  href={DASHBOARD_LOGIN_URL}
                  onClick={() => track('trial_started', { source: 'cta_section' })}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Start free trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </motion.a>
                <motion.a
                  href="mailto:support@ferbz.com"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <Headphones className="h-4 w-4" />
                  Talk to the team
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right — trial card, list stagger */}
            <motion.div
              initial={{ opacity: 0, x: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.15 }}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-amber-500 p-3 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Your first 14 days</h3>
                  <p className="text-sm text-slate-400">A guided setup path, not an empty dashboard.</p>
                </div>
              </div>
              <motion.div
                className="space-y-2"
                variants={stagger(0.25, 0.08)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {trial.map((item) => (
                  <motion.div
                    key={item}
                    variants={{
                      hidden: { opacity: 0, x: 12 },
                      show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
                    }}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3.5 text-slate-100"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FerbzCTA;
