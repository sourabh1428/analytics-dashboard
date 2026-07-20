import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tutorials – Ferbz",
  description: "Short video and text walkthroughs covering setup, customer imports, WhatsApp connection, and reminders — onboard your team onto Ferbz in under an hour.",
  alternates: { canonical: "https://ferbz.com/tutorials" },
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
  Beginner: "text-green bg-green-pale",
  Intermediate: "text-rust bg-paper-warm",
  Advanced: "text-rust bg-paper-warm",
};

export default function TutorialsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-green">TUTORIALS</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[.96] tracking-[-0.018em] text-ink [font-stretch:68%]">
        Learn Ferbz in short bursts
      </h1>
      <p className="mt-4 text-mutedink">
        Each tutorial is under 6 minutes. Watch on your phone between customers or let your staff learn at the counter.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {tutorials.map((t) => (
          <div
            key={t.id}
            className="group flex gap-5 border border-ink bg-paper-white p-5 transition-colors hover:bg-paper-alt"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-ink bg-green-pale text-xl font-bold text-green">
              ▶
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-mono text-[11px] tracking-[0.05em] ${levelColors[t.level]}`}>
                  {t.level.toUpperCase()}
                </span>
                <span className="font-mono text-[11px] text-faint">{t.duration}</span>
              </div>
              <h2 className="mt-2 font-display text-sm font-bold text-ink transition-colors group-hover:text-green">{t.title}</h2>
              <p className="mt-1 text-xs leading-5 text-mutedink">{t.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 border border-ink bg-paper-white p-8">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-ink">Need a live walkthrough instead?</h2>
        <p className="mt-2 text-sm text-mutedink">
          Book a 30-minute onboarding call with our team. We will screen-share through setup, import your first customers, and send a live test reminder together.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex bg-green px-6 py-2.5 font-mono text-xs tracking-[0.1em] text-paper transition-colors hover:bg-ink"
        >
          BOOK A DEMO
        </Link>
      </div>
    </div>
  );
}
