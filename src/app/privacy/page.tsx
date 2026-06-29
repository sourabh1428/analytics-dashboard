import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – EasiBill",
  description: "Learn how EasiBill collects, uses, and protects your pharmacy and patient data.",
  alternates: { canonical: "https://easibill.com/privacy" },
};

const sections = [
  {
    heading: "1. Information We Collect",
    body: `We collect information you provide directly when you create an account, import patient records, or contact support. This includes pharmacy name, owner name, email address, phone number, and billing details. Patient data (name, phone number, prescribed medicines, and refill intervals) is collected only through your explicit import or manual entry inside the dashboard.`,
  },
  {
    heading: "2. How We Use Your Information",
    body: `We use collected data to operate and improve EasiBill: sending WhatsApp refill reminders on your behalf, generating daily queues, producing retention analytics, and providing customer support. We do not sell or rent your data or your patients' data to any third party.`,
  },
  {
    heading: "3. WhatsApp Integration",
    body: `EasiBill connects to WhatsApp Business API to deliver reminder and broadcast messages. Message content is composed by our system from your patient records and templates you approve. Messages are routed through Meta's infrastructure and are subject to Meta's own privacy practices. We store message-delivery status (sent, delivered, read) for analytics purposes only.`,
  },
  {
    heading: "4. Patient Data",
    body: `Patient records stored in EasiBill are treated as sensitive health data. We encrypt all patient records at rest (AES-256) and in transit (TLS 1.3). Access is restricted to authenticated users with permissions scoped to your pharmacy account. We do not use patient data to train AI models or for any purpose beyond operating EasiBill for your account.`,
  },
  {
    heading: "5. Data Retention",
    body: `Your account data and patient records are retained for as long as your account is active. Upon account deletion, all personally identifiable data is purged within 30 days. Anonymised aggregate statistics (reminder counts, refill rates) may be retained for product analytics.`,
  },
  {
    heading: "6. Cookies and Tracking",
    body: `We use strictly necessary cookies for authentication sessions. With your consent, we use analytics cookies (Google Analytics) to understand how the dashboard is used. You can withdraw cookie consent at any time via the consent banner.`,
  },
  {
    heading: "7. Third-Party Services",
    body: `EasiBill uses the following third-party processors: Google Cloud (hosting and storage), Stripe (payment processing), Meta WhatsApp Business API (message delivery), and Vercel (web hosting). Each processor has its own data processing agreement and privacy standards.`,
  },
  {
    heading: "8. Your Rights",
    body: `Depending on your jurisdiction you may have rights to access, correct, export, or delete your personal data. To exercise any of these rights contact us at support@easibill.com. We respond within 30 days.`,
  },
  {
    heading: "9. Security",
    body: `We implement industry-standard safeguards: encrypted databases, role-based access control, regular security audits, and secure CI/CD pipelines. No system is 100% secure; if you suspect unauthorised access to your account please contact us immediately.`,
  },
  {
    heading: "10. Changes to This Policy",
    body: `We may update this policy as our product evolves. Material changes will be notified via email to the account owner at least 14 days before taking effect. Continued use of EasiBill after that date constitutes acceptance.`,
  },
  {
    heading: "11. Contact",
    body: `Questions about this policy? Email support@easibill.com or call +91 8839143395.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">Legal</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>
      <p className="mt-3 text-white/50">Last updated: June 2026</p>
      <p className="mt-6 leading-7 text-white/70">
        EasiBill ("we", "our", "us") is committed to protecting the privacy of pharmacy owners and their patients. This policy explains what data we collect, how we use it, and the rights you have over it.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-lg font-semibold text-white">{s.heading}</h2>
            <p className="mt-2 leading-7 text-white/60">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
