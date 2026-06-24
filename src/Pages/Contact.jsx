"use client";

import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Mail, MessageCircle, Phone, Send, Users } from 'lucide-react';

const DASHBOARD_LOGIN_URL = 'https://easibill.vercel.app/login';
const DISCORD_URL = 'https://discord.gg/easibill';

const roles = [
  {
    title: 'Senior Developer',
    copy: 'Own product-quality frontend, backend integrations, performance, and reliability for pharmacy workflows.',
  },
  {
    title: 'Sales Person',
    copy: 'Run pharmacy demos, collect owner feedback, close early customers, and shape our go-to-market playbook.',
  },
];

const ContactPage = () => {
  return (
    <div className="bg-[#f8faf8] px-4 pb-20 pt-32 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Talk to Easibill</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Bring your pharmacy refill workflow. We will make it automatic.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            For sales, onboarding, community, or careers, reach the team directly. We are building with pharmacy owners, not guessing from a template.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={DASHBOARD_LOGIN_URL} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-900/10 transition hover:bg-emerald-950">
              Open Easibill app
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href={DISCORD_URL} className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-6 py-3.5 text-sm font-semibold text-indigo-800 transition hover:border-indigo-300">
              <MessageCircle className="h-4 w-4" />
              Join Discord
            </a>
          </div>

          <div className="mt-10 grid gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-emerald-700" />
              <a href="mailto:support@easibill.com" className="hover:text-emerald-800">support@easibill.com</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-emerald-700" />
              <a href="tel:+918839143395" className="hover:text-emerald-800">+91 800-123-4567</a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/8"
        >
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-300 p-3 text-emerald-950">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Send your details</h2>
                <p className="text-sm text-slate-300">We will reply with the best next step.</p>
              </div>
            </div>
            <form className="grid gap-3">
              <input className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-300" placeholder="Your name" />
              <input className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-300" placeholder="Email or phone" />
              <input className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-300" placeholder="Pharmacy / company name" />
              <textarea className="min-h-28 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-300" placeholder="What do you want help with?" />
              <button type="button" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100">
                Submit inquiry
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-indigo-200 bg-indigo-50 p-6">
          <Users className="mb-4 h-6 w-6 text-indigo-700" />
          <h2 className="text-2xl font-semibold">Lead generation with community</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Use the form for direct sales help, or join Discord for faster product questions, onboarding ideas, and pharmacy growth discussions.
          </p>
          <a href={DISCORD_URL} className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white">
            <MessageCircle className="h-4 w-4" />
            Join Easibill Discord
          </a>
        </div>

        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6" id="careers">
          <div className="mb-5 flex items-center gap-3">
            <BriefcaseBusiness className="h-6 w-6 text-emerald-700" />
            <h2 className="text-2xl font-semibold">Open jobs</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <div key={role.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-950">{role.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{role.copy}</p>
                <a href="mailto:careers@easibill.com" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  Apply now
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
