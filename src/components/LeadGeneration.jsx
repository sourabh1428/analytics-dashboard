import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Building, Phone, ChevronRight, ChevronLeft, Send, Briefcase, CheckCircle2, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import { track } from '../utils/mixpanel'
import posthog from 'posthog-js'

const questions = [
  { id: 1, label: "Your name", icon: User, type: "text", name: "name", placeholder: "e.g. Ramesh Kumar", required: true },
  { id: 2, label: "Email address", icon: Mail, type: "email", name: "email", placeholder: "e.g. ramesh@pharmacy.in", required: true },
  { id: 3, label: "Mobile number", icon: Phone, type: "tel", name: "mobile", placeholder: "10-digit mobile", required: true, pattern: "[0-9]{10}" },
  { id: 4, label: "Pharmacy / shop name", icon: Briefcase, type: "text", name: "companyName", placeholder: "e.g. Sharma Medical Store", required: true },
  { id: 5, label: "City / location", icon: Building, type: "text", name: "location", placeholder: "e.g. Pune, Maharashtra", required: true },
]

const DISCORD_URL = 'https://discord.gg/easibill';

const benefits = [
  { title: 'Pharmacy-specific setup', body: 'We configure patient records, refill intervals, and WhatsApp templates for your store.' },
  { title: '14-day refill reminder trial', body: 'Start with your highest-frequency chronic-care patients first.' },
  { title: 'Community support', body: 'Join our Discord to discuss setup, pharmacy growth, and product updates.' },
]

export default function LeadGeneration() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [showThankYou, setShowThankYou] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name, value) => {
    if (questions.find(q => q.name === name)?.required && !value?.trim()) return 'This field is required'
    if (name === 'mobile' && value && !/^[0-9]{10}$/.test(value)) return 'Enter a valid 10-digit mobile number'
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address'
    return null
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleNext = () => {
    const q = questions[step]
    const error = validateField(q.name, formData[q.name])
    if (!error) {
      setStep(s => s + 1)
    } else {
      setErrors(prev => ({ ...prev, [q.name]: error }))
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && step < questions.length - 1) {
      e.preventDefault()
      handleNext()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    questions.forEach(q => {
      const err = validateField(q.name, formData[q.name])
      if (err) newErrors[q.name] = err
    })
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setIsSubmitting(true)
    try {
      const response = await fetch('https://landingpage-lead.sppathak1428.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Failed to submit')
      // Identify user in PostHog — links all past + future sessions to this person
      posthog.identify(formData.email, {
        email: formData.email,
        phone: formData.mobile,
        name: formData.name,
        company: formData.companyName,
        location: formData.location,
        lead_source: 'demo_form',
      })
      posthog.capture('lead_captured', {
        source: 'demo_form',
        company: formData.companyName,
        location: formData.location,
      })
      track('demo_requested', { source: 'lead_form', method: 'form_submit', shop_name: formData.companyName, location: formData.location })
      setShowThankYou(true)
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const q = questions[step]
  const Icon = q.icon

  return (
    <section className="relative isolate min-h-screen overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.15),transparent_28%),linear-gradient(180deg,#f8faf8_0%,#eefbf6_60%,#ffffff_100%)]" />

      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_0.9fr]">

        {/* Left — benefits */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-4"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-3 py-1.5 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur">
            Book a pharmacy demo
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            See Easibill working in your store.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Share a few details and we'll walk you through a live refill-reminder setup tailored to your pharmacy.
          </p>

          <div className="mt-10 space-y-5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{b.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{b.body}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href={DISCORD_URL}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
          >
            <MessageCircle className="h-4 w-4" />
            Join Easibill Discord
          </a>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-950/5 backdrop-blur"
        >
          <AnimatePresence mode="wait">
            {showThankYou ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-5 py-10 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">We've got your details!</h2>
                  <p className="mt-2 text-slate-600">Someone from the Easibill team will reach out within one business day.</p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-950"
                >
                  Back to home <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-slate-950">Tell us about your pharmacy</h2>
                  <p className="mt-1 text-sm text-slate-500">Step {step + 1} of {questions.length}</p>
                </div>

                {/* Progress dots */}
                <div className="mb-8 flex gap-2">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-emerald-500' : i < step ? 'w-4 bg-emerald-200' : 'w-4 bg-slate-200'}`}
                    />
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      <label htmlFor={q.name} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Icon className="h-4 w-4 text-emerald-600" />
                        {q.label}
                        {q.required && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        type={q.type}
                        id={q.name}
                        name={q.name}
                        value={formData[q.name] || ''}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        pattern={q.pattern}
                        autoFocus
                        className={`w-full rounded-2xl border px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 ${errors[q.name] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                        placeholder={q.placeholder}
                      />
                      {errors[q.name] && (
                        <p className="flex items-center gap-1.5 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4" /> {errors[q.name]}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {errors.submit && (
                    <p className="mt-4 text-center text-sm text-red-600">{errors.submit}</p>
                  )}

                  <div className="mt-8 flex items-center justify-between">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => setStep(s => s - 1)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                    ) : <div />}

                    {step < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-950"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-950 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting…' : 'Book my demo'} <Send className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
