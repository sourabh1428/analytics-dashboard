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
          <div className="relative border border-ink bg-ink p-6 text-paper shadow-[8px_8px_0_#146C3C]">
            {/* Header */}
            <div className="relative mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-green-bright bg-green text-paper">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-base font-extrabold uppercase leading-tight text-paper [font-stretch:80%]">
                    {geo ? `${geo.flag} EasiBill for ${geo.countryName}` : "Let's get you set up"}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] tracking-[0.04em] text-faint">We reply with the best next step — usually same day.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close"
                className="shrink-0 p-1.5 text-faint transition-colors hover:text-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {done ? (
              <div className="relative flex flex-col items-center gap-3 py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center border border-green-bright bg-green/20">
                  <CheckCircle2 className="h-7 w-7 text-green-bright" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.06em] text-paper">Got it — we will be in touch shortly.</p>
                <p className="font-mono text-[11px] tracking-[0.04em] text-faint">Expect a reply within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative grid gap-3">
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden="true" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-ink-soft bg-ink-soft/40 py-2.5 pl-10 pr-3.5 text-sm text-paper outline-none placeholder:text-faint focus:border-green-bright"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden="true" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-ink-soft bg-ink-soft/40 py-2.5 pl-10 pr-3 text-sm text-paper outline-none placeholder:text-faint focus:border-green-bright"
                      placeholder="Email"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden="true" />
                    <input
                      name="mobile"
                      type="tel"
                      value={form.mobile}
                      onChange={handleChange}
                      className="w-full border border-ink-soft bg-ink-soft/40 py-2.5 pl-10 pr-3 text-sm text-paper outline-none placeholder:text-faint focus:border-green-bright"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <p className="-mt-1.5 font-mono text-[10.5px] tracking-[0.02em] text-faint">At least one of email or phone is required.</p>

                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden="true" />
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full border border-ink-soft bg-ink-soft/40 py-2.5 pl-10 pr-3.5 text-sm text-paper outline-none placeholder:text-faint focus:border-green-bright"
                    placeholder="Business / company name"
                  />
                </div>

                <div className="relative">
                  <MessageSquare className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-faint" aria-hidden="true" />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={2}
                    className="w-full resize-none border border-ink-soft bg-ink-soft/40 py-2.5 pl-10 pr-3.5 text-sm text-paper outline-none placeholder:text-faint focus:border-green-bright"
                    placeholder="What do you want help with?"
                  />
                </div>

                {error && <p className="text-center font-mono text-xs text-rust">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 inline-flex min-h-[44px] items-center justify-center gap-2 bg-green px-4 py-3 font-mono text-xs uppercase tracking-[0.08em] text-paper transition-colors hover:bg-green-bright hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
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
