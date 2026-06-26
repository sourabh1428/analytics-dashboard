'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    question: 'Do I need internet to use EasiBill?',
    answer: 'EasiBill works offline for billing and inventory. Bills are queued and sent on WhatsApp as soon as your phone reconnects. Your data syncs automatically — you never lose a bill.',
  },
  {
    question: 'Can I migrate from my current billing software?',
    answer: 'Yes. We provide free data migration support for all plans. Our team will import your customer list, medicine stock, and billing history from any existing system or Excel-based setup. Takes 1–2 business days.',
  },
  {
    question: 'Is my customer data safe? Where is it stored?',
    answer: 'All data is encrypted (AES-256) and stored on secure cloud infrastructure compliant with international data protection standards. You own your data — you can export everything at any time, in any plan.',
  },
  {
    question: 'How does WhatsApp billing work? Do I need WhatsApp Business API?',
    answer: 'The Starter and Growth plans use your existing WhatsApp Business number on your phone — no API needed. The Scale plan optionally supports WhatsApp Business API for high-volume stores (100+ bills per day) with automated sending.',
  },
  {
    question: 'Are tax reports compatible with my country\'s requirements?',
    answer: 'EasiBill generates itemized invoices with all the fields your accountant needs — item names, quantities, tax breakdowns, and invoice numbers. Export a clean report in one click. We support multiple tax formats globally.',
  },
  {
    question: 'What happens if I want to cancel?',
    answer: 'Cancel any time from your account settings. No cancellation fees, no lock-in. If you cancel a paid plan, you drop to the Starter (free) plan and keep your data. You can export everything before you leave.',
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const id = `faq-answer-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm"
      >
        <span className="font-semibold text-slate-900 text-base">{item.question}</span>
        {open
          ? <Minus className="h-5 w-5 text-blue-600 shrink-0" aria-hidden="true" />
          : <Plus className="h-5 w-5 text-gray-400 shrink-0" aria-hidden="true" />
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
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-500 text-sm leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <h2
            id="faq-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Questions pharmacists ask before switching
          </h2>
          <p className="text-gray-500 text-lg">
            Honest answers. No marketing fluff.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8"
        >
          {FAQS.map((item, i) => (
            <FAQItem key={item.question} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
