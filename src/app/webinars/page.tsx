import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Webinars – EasiBill",
  description: "Live and recorded sessions on refill automation, patient retention, and running a profitable independent pharmacy.",
  alternates: { canonical: "https://easibill.com/webinars" },
};

const upcoming = [
  {
    date: "July 9, 2026",
    time: "7:00 PM IST",
    title: "Refill Automation 101: From Zero to 500 Reminders/Month",
    description: "A hands-on demo of the EasiBill daily queue. We will import real patient records, configure reminder templates, and show you exactly what patients receive.",
    host: "EasiBill Team",
  },
  {
    date: "July 23, 2026",
    time: "7:00 PM IST",
    title: "Broadcast Campaigns That Actually Fill Your Health Camp",
    description: "Learn how to segment chronic-care patients, write a compelling camp announcement, and schedule a broadcast that gets replies — not just read receipts.",
    host: "EasiBill Team",
  },
  {
    date: "August 6, 2026",
    time: "7:00 PM IST",
    title: "Reading Your Retention Analytics: What the Numbers Mean",
    description: "Walk through the retention dashboard with us — delivered vs responded rates, recovered refills, inactive cohorts, and how to act on each metric.",
    host: "EasiBill Team",
  },
];

const past = [
  {
    date: "June 11, 2026",
    title: "Getting Started With EasiBill in 30 Minutes",
    attendees: "312",
    duration: "34 min",
  },
  {
    date: "May 28, 2026",
    title: "WhatsApp for Pharmacies: Setup, Compliance, and Best Practices",
    attendees: "248",
    duration: "41 min",
  },
  {
    date: "May 14, 2026",
    title: "How to Win Back Inactive Patients With 3 Messages",
    attendees: "189",
    duration: "28 min",
  },
  {
    date: "April 30, 2026",
    title: "Retention Metrics Every Pharmacy Owner Should Track",
    attendees: "215",
    duration: "36 min",
  },
];

export default function WebinarsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Webinars</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Live sessions, every two weeks</h1>
      <p className="mt-4 text-white/60">
        Join our team live for walkthroughs, Q&amp;A, and practical tactics for independent pharmacy retention. All sessions are free.
      </p>

      <h2 className="mt-14 text-xl font-semibold text-white">Upcoming sessions</h2>
      <div className="mt-5 space-y-4">
        {upcoming.map((w) => (
          <div key={w.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-400">{w.date}</span>
              <span className="text-xs text-white/40">{w.time}</span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-white">{w.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">{w.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-white/30">Hosted by {w.host}</span>
              <Link
                href="/contact"
                className="rounded-full bg-violet-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-violet-400"
              >
                Register free
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-semibold text-white">Past sessions</h2>
      <p className="mt-2 text-sm text-white/50">Recordings available on request — email support@easibill.com with the session title.</p>
      <div className="mt-5 space-y-3">
        {past.map((w) => (
          <div key={w.title} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-white/80">{w.title}</p>
              <p className="mt-0.5 text-xs text-white/35">{w.date} · {w.duration} · {w.attendees} attendees</p>
            </div>
            <a
              href="mailto:support@easibill.com"
              className="shrink-0 text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              Request recording
            </a>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-8">
        <h2 className="text-lg font-semibold text-white">Get reminder for every session</h2>
        <p className="mt-2 text-sm text-white/60">Drop your email and we will send you a reminder 24 hours before each live webinar.</p>
        <div className="mt-5 flex max-w-sm overflow-hidden rounded-full border border-white/[0.1] bg-white/[0.04]">
          <input
            type="email"
            placeholder="your@email.com"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
          <button className="bg-violet-500 px-5 text-sm font-semibold text-white transition hover:bg-violet-400">
            Notify me
          </button>
        </div>
      </div>
    </div>
  );
}
