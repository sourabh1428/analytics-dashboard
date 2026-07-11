import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tutorials – EasiBill",
  description: "Short video and text walkthroughs to onboard your business team onto EasiBill in under an hour.",
  alternates: { canonical: "https://easibill.com/tutorials" },
};

const tutorials = [
  {
    id: 1,
    duration: "3:24",
    level: "Beginner",
    title: "Account setup in under 5 minutes",
    description: "Create your account, set your business name and address, and send a test reminder before your counter opens.",
  },
  {
    id: 2,
    duration: "4:50",
    level: "Beginner",
    title: "Importing customers from Excel or CSV",
    description: "Download the import template, fill in customer names, phone numbers, and items or services, then upload with one click.",
  },
  {
    id: 3,
    duration: "5:12",
    level: "Beginner",
    title: "Connecting your WhatsApp Business number",
    description: "Scan a QR code to link your WhatsApp Business account. No app installation required on the business computer.",
  },
  {
    id: 4,
    duration: "3:40",
    level: "Intermediate",
    title: "Understanding the daily queue",
    description: "Walk through the morning queue: who is due today, who is overdue, and how to mark a customer as followed up.",
  },
  {
    id: 5,
    duration: "4:15",
    level: "Intermediate",
    title: "Customising reminder message templates",
    description: "Edit the default reminder text, add your business name, and create a personalised message in your regional language.",
  },
  {
    id: 6,
    duration: "6:00",
    level: "Intermediate",
    title: "Running a broadcast campaign",
    description: "Create an event announcement, segment customers by interest or purchase history, and schedule the broadcast for Monday morning.",
  },
  {
    id: 7,
    duration: "5:30",
    level: "Advanced",
    title: "Reading retention analytics",
    description: "Understand reminder sent vs delivered vs responded, track recovered follow-ups month on month, and export data to CSV.",
  },
  {
    id: 8,
    duration: "3:00",
    level: "Advanced",
    title: "Adding staff and setting permissions",
    description: "Invite a billing assistant, give them access only to the daily queue, and restrict analytics to owner-only view.",
  },
];

const levelColors: Record<string, string> = {
  Beginner: "text-green-400 bg-green-400/10",
  Intermediate: "text-amber-400 bg-amber-400/10",
  Advanced: "text-amber-400 bg-amber-400/10",
};

export default function TutorialsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">Tutorials</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Learn EasiBill in short bursts</h1>
      <p className="mt-4 text-white/60">
        Each tutorial is under 6 minutes. Watch on your phone between customers or let your staff learn at the counter.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {tutorials.map((t) => (
          <div
            key={t.id}
            className="group flex gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.05]"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 text-xl font-bold">
              ▶
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${levelColors[t.level]}`}>
                  {t.level}
                </span>
                <span className="text-xs text-white/30">{t.duration}</span>
              </div>
              <h2 className="mt-2 text-sm font-semibold text-white group-hover:text-amber-300 transition">{t.title}</h2>
              <p className="mt-1 text-xs leading-5 text-white/50">{t.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8">
        <h2 className="text-lg font-semibold text-white">Need a live walkthrough instead?</h2>
        <p className="mt-2 text-sm text-white/60">
          Book a 30-minute onboarding call with our team. We will screen-share through setup, import your first customers, and send a live test reminder together.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400"
        >
          Book a demo
        </Link>
      </div>
    </div>
  );
}
