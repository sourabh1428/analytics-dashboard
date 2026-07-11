"use client";

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stagger, wordVariant, fadeUp, scaleIn, staggerFast, fadeIn, viewport } from '@/lib/motion';

const H1_WORDS_1 = ['Your', 'local', 'business', 'loses', '20–40%', 'of', 'customers', 'every', 'year.'];
const H1_WORDS_2 = ['EasiBill', 'stops', 'that.'];

const PROOF = [
  'Free to start — no card needed',
  '2,400+ local businesses worldwide',
  '18M+ bills sent via WhatsApp',
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen flex items-center bg-[#09090B] overflow-hidden"
      id="hero"
      aria-labelledby="hero-heading"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272A 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      {/* Amber top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '800px',
          height: '500px',
          background: 'radial-gradient(ellipse at center top, rgba(245,158,11,0.1) 0%, transparent 68%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Badge */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-10"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
            WhatsApp-first CRM for local businesses
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.06] tracking-tight mb-6"
        >
          {H1_WORDS_1.map((word, i) => (
            <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em]">
              {word}
            </motion.span>
          ))}
          <br className="hidden sm:block" />
          {H1_WORDS_2.map((word, i) => (
            <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em] text-amber-400">
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.55 }}
          className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Log a sale. EasiBill sends a follow-up reminder on the right day via WhatsApp — from your own number, without you touching anything. Customers come back. Revenue holds.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.67 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <button
            onClick={() => navigate('/lead')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors duration-150 text-base min-h-[52px]"
          >
            Start free — no card needed
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => navigate('/lead')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-800 hover:border-zinc-600 transition-colors duration-150 text-base min-h-[52px]"
          >
            See a demo →
          </button>
        </motion.div>

        <motion.ul
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          role="list"
        >
          {PROOF.map((point) => (
            <motion.li
              key={point}
              variants={fadeIn}
              className="flex items-center gap-1.5 text-sm text-zinc-500"
            >
              <CheckCircle className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
              {point}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
