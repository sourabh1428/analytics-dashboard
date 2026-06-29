'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Send, X } from 'lucide-react'
import { track } from '../utils/mixpanel'
import { useGeo } from '../hooks/useGeo'

const WORKER_URL = 'https://landingpage-lead.sppathak1428.workers.dev/'
const STORAGE_KEY = 'lead_nudge_dismissed'
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function wasDismissedRecently() {
  try {
    const ts = localStorage.getItem(STORAGE_KEY)
    if (!ts) return false
    return Date.now() - Number(ts) < DISMISS_TTL_MS
  } catch {
    return false
  }
}

function markDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {}
}

export default function LeadNudge() {
  const geo = useGeo()
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', mobile: '', company: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (wasDismissedRecently()) return
    const timer = setTimeout(() => setVisible(true), 15_000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setVisible(false)
    markDismissed()
  }

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) { setError('Please enter your name.'); return }
    if (!form.email && !form.mobile) { setError('Add at least an email or phone.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || form.mobile,
          mobile: form.mobile || form.email,
          company: form.company,
          message: form.message,
          source: 'nudge',
          country: geo?.countryCode,
        }),
      })
      if (!res.ok) throw new Error()
      track('demo_requested', { source: 'lead_nudge', method: 'form_submit', company: form.company })
      setDone(true)
      markDismissed()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-5 right-5 z-50 w-[min(360px,calc(100vw-2.5rem))]"
          role="dialog"
          aria-modal="true"
          aria-label="Quick inquiry form"
        >
          <div className="rounded-[1.75rem] bg-[#0D0B1E] p-5 text-white shadow-2xl shadow-violet-950/60 ring-1 ring-violet-500/20">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-500 p-2.5 text-white">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight text-white">
                  {geo ? `${geo.flag} EasiBill for ${geo.countryName}` : 'Send your details'}
                </p>
                  <p className="text-xs text-slate-400">We will reply with the best next step.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close"
                className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-2 py-5 text-center">
                <CheckCircle2 className="h-8 w-8 text-violet-400" />
                <p className="text-sm font-semibold text-white">Got it — we will be in touch shortly.</p>
                <p className="text-xs text-slate-400">Expect a reply within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-2">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400"
                  placeholder="Your name"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400"
                    placeholder="Email"
                  />
                  <input
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange}
                    className="rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400"
                    placeholder="Phone"
                  />
                </div>
                <p className="text-[10px] text-slate-500 -mt-1">At least one required.</p>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400"
                  placeholder="Pharmacy / company name"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={2}
                  className="rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 resize-none"
                  placeholder="What do you want help with?"
                />
                {error && <p className="text-center text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 rounded-full bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit inquiry'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
