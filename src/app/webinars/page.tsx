import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Webinars – Ferbz",
  description: "Live and recorded sessions on follow-up automation, customer retention, and running a profitable local business.",
  alternates: { canonical: "https://ferbz.com/webinars" },
};

const upcoming = [
  {
    date: "July 9, 2026",
    time: "7:00 PM IST",
    title: "Follow-up Automation 101: From Zero to 500 Reminders/Month",
    description: "A hands-on demo of the Ferbz daily queue. We will import real customer records, configure reminder templates, and show you exactly what customers receive.",
    host: "Ferbz Team",
  },
  {
    date: "July 23, 2026",
    time: "7:00 PM IST",
    title: "Broadcast Campaigns That Actually Fill Your Next Event",
    description: "Learn how to segment regular customers, write a compelling event announcement, and schedule a broadcast that gets replies — not just read receipts.",
    host: "Ferbz Team",
  },
  {
    date: "August 6, 2026",
    time: "7:00 PM IST",
    title: "Reading Your Retention Analytics: What the Numbers Mean",
    description: "Walk through the retention dashboard with us — delivered vs responded rates, recovered follow-ups, inactive cohorts, and how to act on each metric.",
    host: "Ferbz Team",
  },
];

const past = [
  {
    date: "June 11, 2026",
    title: "Getting Started With Ferbz in 30 Minutes",
    attendees: "312",
    duration: "34 min",
  },
  {
    date: "May 28, 2026",
    title: "WhatsApp for Local Businesses: Setup, Compliance, and Best Practices",
    attendees: "248",
    duration: "41 min",
  },
  {
    date: "May 14, 2026",
    title: "How to Win Back Inactive Customers With 3 Messages",
    attendees: "189",
    duration: "28 min",
  },
  {
    date: "April 30, 2026",
    title: "Retention Metrics Every Local Business Owner Should Track",
    attendees: "215",
    duration: "36 min",
  },
];

export default function WebinarsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-green">WEBINARS</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[.96] tracking-[-0.018em] text-ink [font-stretch:68%]">
        Live sessions, every two weeks
      </h1>
      <p className="mt-4 text-mutedink">
        Join our team live for walkthroughs, Q&amp;A, and practical tactics for local business retention. All sessions are free.
      </p>

      <h2 className="mt-14 font-display text-xl font-extrabold uppercase tracking-[-0.01em] text-ink">Upcoming sessions</h2>
      <div className="mt-5 space-y-4">
        {upcoming.map((w) => (
          <div key={w.title} className="border border-ink bg-paper-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-ink px-3 py-1 font-mono text-xs tracking-[0.1em] text-paper">{w.date}</span>
              <span className="font-mono text-xs text-faint">{w.time}</span>
            </div>
            <h3 className="mt-3 font-display text-base font-bold text-ink">{w.title}</h3>
            <p className="mt-2 text-sm leading-6 text-mutedink">{w.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[11px] text-faint">HOSTED BY {w.host.toUpperCase()}</span>
              <Link
                href="/contact"
                className="bg-green px-5 py-2 font-mono text-xs tracking-[0.1em] text-paper transition-colors hover:bg-ink"
              >
                REGISTER FREE
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-xl font-extrabold uppercase tracking-[-0.01em] text-ink">Past sessions</h2>
      <p className="mt-2 text-sm text-mutedink">Recordings available on request — email support@ferbz.com with the session title.</p>
      <div className="mt-5 space-y-3">
        {past.map((w) => (
          <div key={w.title} className="flex items-center justify-between gap-4 border border-ink bg-paper-white px-5 py-4">
            <div>
              <p className="font-display text-sm font-bold text-ink">{w.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-faint">{w.date} · {w.duration} · {w.attendees} attendees</p>
            </div>
            <a
              href="mailto:support@ferbz.com"
              className="shrink-0 font-mono text-xs tracking-[0.1em] text-green hover:text-ink"
            >
              REQUEST RECORDING
            </a>
          </div>
        ))}
      </div>

      <div className="mt-14 border border-ink bg-green-pale p-8">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-ink">Get reminder for every session</h2>
        <p className="mt-2 text-sm text-mutedink">Drop your email and we will send you a reminder 24 hours before each live webinar.</p>
        <div className="mt-5 flex max-w-sm border border-ink bg-paper-white">
          <input
            type="email"
            placeholder="your@email.com"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-faint"
          />
          <button className="bg-green px-5 font-mono text-xs tracking-[0.1em] text-paper transition-colors hover:bg-ink">
            NOTIFY ME
          </button>
        </div>
      </div>
    </div>
  );
}
