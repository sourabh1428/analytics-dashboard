'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Send, X, User, Mail, Phone, Building2, MessageSquare } from 'lucide-react'
import { track } from '../utils/mixpanel'
import { useGeo } from '../hooks/useGeo'
import posthog from 'posthog-js'

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

    let fired = false
    const show = () => { if (!fired) { fired = true; setVisible(true) } }

    // Trigger when user has scrolled 55% down the page
    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrolled >= 0.55) { show(); window.removeEventListener('scroll', onScroll) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Hard fallback: show after 25s regardless
    const timer = setTimeout(show, 25_000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
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
      // Identify user in PostHog — links all past + future sessions to this person
      const distinctId = form.email || form.mobile
      posthog.identify(distinctId, {
        email: form.email || undefined,
        phone: form.mobile || undefined,
        name: form.name,
        company: form.company,
        lead_source: 'nudge',
        country: geo?.countryCode,
      })
      posthog.capture('lead_captured', {
        source: 'nudge',
        has_email: !!form.email,
        has_phone: !!form.mobile,
        company: form.company,
        country: geo?.countryCode,
      })
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
          className="fixed bottom-5 right-5 z-50 w-[min(400px,calc(100vw-2.5rem))]"
          role="dialog"
          aria-modal="true"
          aria-label="Quick inquiry form"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[#18181B] p-6 text-white shadow-2xl shadow-black/50 ring-1 ring-zinc-800">
            <div
              className="absolute -top-24 -right-16 h-56 w-56 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }}
              aria-hidden="true"
            />

            {/* Header */}
            <div className="relative mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-bold leading-tight text-white">
                    {geo ? `${geo.flag} EasiBill for ${geo.countryName}` : "Let's get you set up"}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">We reply with the best next step — usually same day.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close"
                className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {done ? (
              <div className="relative flex flex-col items-center gap-3 py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                  <CheckCircle2 className="h-7 w-7 text-amber-400" />
                </div>
                <p className="text-sm font-semibold text-white">Got it — we will be in touch shortly.</p>
                <p className="text-xs text-zinc-400">Expect a reply within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative grid gap-3">
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-3 py-2.5 text-sm outline-none placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
                      placeholder="Email"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                    <input
                      name="mobile"
                      type="tel"
                      value={form.mobile}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-3 py-2.5 text-sm outline-none placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <p className="-mt-1.5 text-[11px] text-zinc-500">At least one of email or phone is required.</p>

                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
                    placeholder="Business / company name"
                  />
                </div>

                <div className="relative">
                  <MessageSquare className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={2}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 resize-none"
                    placeholder="What do you want help with?"
                  />
                </div>

                {error && <p className="text-center text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
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
