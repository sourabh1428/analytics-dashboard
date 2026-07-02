"use client";

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { stagger, wordVariant, fadeUp, scaleIn, staggerFast, fadeIn, viewport, blurFadeUp, bounceIn } from '@/lib/motion';

const H1_WORDS_1 = ['Your', 'pharmacy', 'loses', '20–40%', 'of', 'patients', 'every', 'year.'];
const H1_WORDS_2 = ['EasiBill', 'stops', 'that.'];

const PROOF = [
  'Free to start — no card needed',
  '2,400+ pharmacies worldwide',
  '18M+ bills sent via WhatsApp',
];

export default function Hero() {
  const router = useRouter();

  return (
    <section
      className="relative min-h-screen flex items-center bg-[#09090B] overflow-hidden"
      id="hero"
      aria-labelledby="hero-heading"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top-left glow */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        
        {/* Top-right glow */}
        <motion.div
          className="absolute -top-20 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      </div>

      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272A 0.5px, transparent 0.5px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Badge with enhanced animation */}
        <motion.div
          variants={bounceIn}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 backdrop-blur-sm mb-10"
        >
          <motion.span
            className="relative flex h-2.5 w-2.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden="true"
          >
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-amber-400"
              animate={{ opacity: [0.75, 0.3, 0.75] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </motion.span>
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
            WhatsApp-first CRM for pharmacies
          </span>
        </motion.div>

        {/* Headline with word-by-word animation */}
        <motion.h1
          id="hero-heading"
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8"
        >
          {H1_WORDS_1.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
          <br className="hidden sm:block" />
          <motion.span
            variants={stagger}
            className="inline-flex items-center gap-2"
          >
            {H1_WORDS_2.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariant}
                className="inline-block mr-[0.25em] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </motion.h1>

        <motion.p
          variants={blurFadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="text-lg text-zinc-300 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Log a sale. EasiBill sends a refill reminder on the right day via WhatsApp — from your own number. Patients come back. Revenue holds.
        </motion.p>

        {/* CTA Buttons with enhanced hover effects */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.button
            onClick={() => router.push('/lead')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 text-base min-h-[52px] group"
          >
            Start free — no card needed
            <motion.span
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </motion.button>
          
          <motion.button
            onClick={() => router.push('/lead')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-zinc-600 text-zinc-200 font-semibold hover:bg-zinc-800/50 hover:border-zinc-500 backdrop-blur-sm transition-all duration-300 text-base min-h-[52px] group"
          >
            <Sparkles className="h-4 w-4 group-hover:animate-spin" aria-hidden="true" />
            See a demo
          </motion.button>
        </motion.div>

        {/* Trust indicators with staggered animation */}
        <motion.ul
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          role="list"
        >
          {PROOF.map((point) => (
            <motion.li
              key={point}
              variants={fadeIn}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 0.5 }}
              >
                <CheckCircle className="h-5 w-5 text-amber-500 shrink-0" aria-hidden="true" />
              </motion.span>
              {point}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
