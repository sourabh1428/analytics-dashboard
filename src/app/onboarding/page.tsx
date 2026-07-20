import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Onboarding Guide – Ferbz",
  description: "Step-by-step setup from your first customer import to your first WhatsApp follow-up reminder — in under 30 minutes.",
  alternates: { canonical: "https://ferbz.com/onboarding" },
};

const steps = [
  {
    step: "01",
    title: "Create your account",
    time: "2 min",
    details: [
      "Go to dashboard.ferbz.com and click Get started free.",
      "Enter your business name, your name, email, and phone number.",
      "Choose your country and time zone — this controls when daily reminders are sent.",
      "Verify your email and you are in.",
    ],
    tip: "Use the same email you check every morning. Daily queue summaries arrive there at 7 AM.",
  },
  {
    step: "02",
    title: "Connect WhatsApp Business",
    time: "5 min",
    details: [
      "From the dashboard, go to Settings → WhatsApp.",
      "Scan the QR code with your WhatsApp Business app (not regular WhatsApp).",
      "If you do not have WhatsApp Business, download it free from the App Store or Play Store first.",
      "Send a test message to yourself to confirm delivery.",
    ],
    tip: "Use a dedicated number for the business, not the owner's personal number. Customers will see this number when they receive reminders.",
  },
  {
    step: "03",
    title: "Import your first customers",
    time: "8 min",
    details: [
      "Download the import template from Customers → Import.",
      "Fill in: Customer Name, Phone (with country code), Item/Service, Follow-up Interval (days).",
      "Start with your top 20–30 regular customers. You can add more later.",
      "Upload the CSV and review the preview before confirming.",
    ],
    tip: "If you have customer data in a notebook or billing software, the quickest path is to type the top 20 customers manually — it takes about 8 minutes.",
  },
  {
    step: "04",
    title: "Customise your reminder template",
    time: "3 min",
    details: [
      "Go to Settings → Message Templates.",
      "The default template reads: 'Hi {Name}, this is {PharmacyName}. Your {Medicine} follow-up is due. Reply to confirm or call us.'",
      "Edit the text to match your business's tone. Add regional language if your customers prefer it.",
      "Save and preview how it looks on a phone screen.",
    ],
    tip: "Keep messages under 3 sentences. Longer messages get lower reply rates.",
  },
  {
    step: "05",
    title: "Send your first reminders",
    time: "2 min",
    details: [
      "Go to Daily Queue — you will see customers whose follow-up is due today or overdue.",
      "Click Send reminders to dispatch WhatsApp messages to all due customers.",
      "Replies from customers appear in the dashboard inbox in real time.",
      "Mark customers as followed up when they respond or confirm.",
    ],
    tip: "Run the queue every morning before 9 AM. Customers are most likely to respond in the first two hours of the day.",
  },
  {
    step: "06",
    title: "Check your analytics after one week",
    time: "2 min",
    details: [
      "After 7 days, go to Analytics → Retention.",
      "You will see reminders sent, delivered, responded, and follow-ups recovered.",
      "Benchmark: a healthy follow-up recovery rate is above 60% in the first month.",
      "Use the inactive customers list to identify anyone who has not responded after 3 reminders.",
    ],
    tip: "Share the weekly summary with your billing assistant so the whole team can see the impact.",
  },
];

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-green">ONBOARDING GUIDE</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[.96] tracking-[-0.018em] text-ink [font-stretch:68%]">
        From sign-up to first reminder
      </h1>
      <p className="mt-4 text-mutedink">
        Follow these six steps in order. Most local businesses complete setup in under 30 minutes.
      </p>

      <div className="mt-12 space-y-6">
        {steps.map((s) => (
          <div key={s.step} className="border border-ink bg-paper-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink bg-green-pale font-mono text-sm font-bold text-green">
                {s.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-base font-bold uppercase tracking-[-0.005em] text-ink">{s.title}</h2>
                  <span className="font-mono text-[11px] text-faint">{s.time}</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {s.details.map((d) => (
                    <li key={d} className="flex gap-2 text-sm text-mutedink">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-green" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border border-ink bg-green-pale px-4 py-3">
                  <p className="font-mono text-xs tracking-[0.02em] text-ink"><span className="font-bold text-green">TIP: </span>{s.tip}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border border-ink bg-paper-white p-8">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-ink">Prefer a guided walkthrough?</h2>
        <p className="mt-2 text-sm text-mutedink">
          Book a free 30-minute onboarding call. Our team will screen-share through every step and import your first customers together with you.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex bg-green px-6 py-2.5 font-mono text-xs tracking-[0.1em] text-paper transition-colors hover:bg-ink"
          >
            BOOK ONBOARDING CALL
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex border border-ink px-6 py-2.5 font-mono text-xs tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            WATCH TUTORIALS
          </Link>
        </div>
      </div>
    </div>
  );
}
