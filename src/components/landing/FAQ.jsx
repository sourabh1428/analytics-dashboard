'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { fadeUp, scaleIn, stagger, wordVariant, viewport } from '@/src/lib/motion'

const FAQS = [
  {
    question: 'Do I need WhatsApp Business API to use EasiBill?',
    answer: 'No. The Starter plan connects to your existing WhatsApp Business number by scanning a QR code — no API registration, no waiting period, no extra cost. Just scan once and you are live in 2 minutes. The Pro plan uses an official WhatsApp Business API number (via Gupshup) for pharmacies who need broadcast campaigns at scale.',
  },
  {
    question: 'Does EasiBill replace my billing software (Marg, Vyapar, Ecogreen)?',
    answer: 'No — and intentionally so. EasiBill works alongside your existing billing software. It is a patient retention CRM, not a billing or inventory system. You continue using Marg or Vyapar for GST invoicing. EasiBill handles patient records, refill reminders, and WhatsApp campaigns.',
  },
  {
    question: 'What happens if my WhatsApp disconnects?',
    answer: 'EasiBill automatically reconnects with retry — sessions persist through server restarts and network drops, so you never need to re-scan the QR code. If a reminder fails to send, it appears on the dashboard immediately so you can retry manually or follow up by phone.',
  },
  {
    question: 'Is my patient data safe?',
    answer: 'All patient data is encrypted and stored on secure cloud infrastructure. Data is scoped per pharmacy — no other pharmacy can access your records. You can export everything at any time.',
  },
  {
    question: 'How long does setup take?',
    answer: 'Most pharmacies go from sign-up to first reminder in under 30 minutes. Step 1: scan the WhatsApp QR code (2 min). Step 2: add or import your top 20–30 patients (8–10 min). Step 3: enable reminders. Everything else is automatic.',
  },
  {
    question: 'What happens if I want to cancel?',
    answer: 'Cancel any time from your account settings. No cancellation fee, no lock-in. Your patient data is preserved and you can export it before you leave.',
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const id = `faq-answer-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <motion.div
      variants={fadeUp}
      className="border-b border-zinc-800 last:border-0"
    >
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm group"
      >
        <span className="font-semibold text-zinc-200 text-base group-hover:text-white transition-colors duration-150">
          {item.question}
        </span>
        {open
          ? <Minus className="h-5 w-5 text-amber-400 shrink-0" aria-hidden="true" />
          : <Plus className="h-5 w-5 text-zinc-600 shrink-0 group-hover:text-zinc-400 transition-colors duration-150" aria-hidden="true" />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-zinc-500 text-sm leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const H2_WORDS = ['Questions', 'pharmacists', 'ask', 'before', 'switching']

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 px-6 bg-[#09090B]"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
          className="text-center mb-14"
        >
          <motion.h2
            id="faq-heading"
            variants={stagger}
            className="text-4xl font-bold text-white mb-4 leading-tight"
          >
            {H2_WORDS.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em]">
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg">
            Honest answers. No marketing fluff.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
          viewport={viewport}
          className="bg-[#18181B] rounded-2xl border border-zinc-800 px-8"
        >
          {FAQS.map((item, i) => (
            <FAQItem key={item.question} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
