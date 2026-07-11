"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  MessageCircle,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { track } from '../../utils/mixpanel';

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const reminders = [
  { name: 'Anita R.', product: 'Metformin 500mg', status: 'Reminder sent', dot: 'bg-emerald-400' },
  { name: 'Harish K.', product: 'Deep Tissue Massage — 60 min', status: 'Due tomorrow', dot: 'bg-amber-400' },
  { name: 'Meena S.', product: 'Wireless Earbuds', status: 'Followed up', dot: 'bg-slate-400' },
];

function WordReveal({ text, baseDelay = 0, className = '' }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block ${className}`}
          initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: baseDelay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </>
  );
}

const EasibillHero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const dashY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const dashOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36"
    >
      {/* Emerald glow — top center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-500/[0.08] blur-3xl"
      />
      {/* Secondary glow — bottom right */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 -z-10 h-96 w-96 rounded-full bg-emerald-400/[0.06] blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">

        {/* ── Left: copy ── */}
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            className="mb-6 text-sm font-medium tracking-wide text-emerald-400/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            Trusted by 2,400+ local businesses across India
          </motion.p>

          {/* Headline */}
          <h1 className="text-[2.8rem] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            <WordReveal text="Billing that" baseDelay={0.15} />
            <br className="hidden sm:block" />
            <motion.span
              className="relative inline-block text-emerald-400"
              initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              runs itself.
              {/* Underline sweep */}
              <motion.span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-emerald-400/50"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.span>
            {' '}
            <WordReveal text="Customers who come back." baseDelay={0.4} />
          </h1>

          {/* Sub */}
          <motion.p
            className="mt-6 max-w-lg text-lg leading-8 text-white/50"
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            GST bills on WhatsApp in 3 seconds. Automatic follow-up reminders.
            Zero paperwork. Built for local businesses.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.85 }}
          >
            <a
              href={DASHBOARD_LOGIN_URL}
              onClick={() => track('trial_started', { source: 'hero' })}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-black shadow-xl shadow-emerald-500/25 transition-all hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#080d0a]"
            >
              <Zap className="h-4 w-4" />
              Start free — 14 days
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/lead"
              onClick={() => track('demo_requested', { source: 'hero', method: 'button_click' })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.05] px-7 py-3.5 text-sm font-semibold text-white/80 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#080d0a]"
            >
              Book business demo
            </a>
          </motion.div>

          {/* Trust chips */}
          <motion.div
            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.05 }}
          >
            {['No setup fee', 'Works with Marg & Ecogreen', 'No credit card needed'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/70" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Right: dashboard (white card on dark bg = premium contrast) ── */}
        <motion.div
          style={{ y: dashY, opacity: dashOpacity }}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 75, damping: 18, delay: 0.22 }}
          className="relative"
        >
          {/* Glow halo behind card */}
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-3xl bg-emerald-400/[0.07] blur-2xl"
          />

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1b10] shadow-2xl shadow-black/50">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/70">Today · Follow-up queue</p>
                <h2 className="mt-0.5 text-sm font-semibold text-white">Verma Medical Store</h2>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.1] px-3 py-1.5 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-[1.1fr_0.9fr]">
              {/* Reminder rows */}
              <div className="space-y-2">
                {reminders.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 110, damping: 20, delay: 0.55 + index * 0.1 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3.5 py-3"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.dot}`} />
                      <div>
                        <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                        <p className="truncate text-xs text-white/40">{item.product}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] font-medium text-white/40">{item.status}</span>
                  </motion.div>
                ))}
              </div>

              {/* Right panels */}
              <div className="space-y-2.5">
                {/* WhatsApp bubble */}
                <motion.div
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.7 }}
                >
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                    <MessageCircle className="h-3 w-3" />
                    WhatsApp
                  </div>
                  <p className="text-[10px] leading-4 text-white/60">
                    Namaste Anita ji, your Metformin is due for a follow-up today. Reply YES to confirm.
                  </p>
                  <p className="mt-2 text-right text-[9px] text-emerald-400/70">Queued 9:00 AM ✓</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { Icon: Bell, value: '128', label: 'due this week' },
                    { Icon: TrendingUp, value: '+35%', label: 'return rate' },
                  ].map(({ Icon, value, label }, i) => (
                    <motion.div
                      key={label}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 110, damping: 20, delay: 0.82 + i * 0.08 }}
                    >
                      <Icon className="mb-2 h-3.5 w-3.5 text-emerald-400/60" />
                      <p className="text-lg font-bold text-white">{value}</p>
                      <p className="text-[9px] text-white/35 leading-3">{label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            className="absolute -bottom-5 -left-5 hidden rounded-xl border border-white/[0.08] bg-[#0d1b10]/90 p-3.5 shadow-xl backdrop-blur-sm sm:block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            style={{ animation: 'float-slow 5s ease-in-out infinite' }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Bill sent via WhatsApp</p>
                <p className="text-[10px] text-white/40">Delivered 2.3s · ₹300 · GST</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EasibillHero;
