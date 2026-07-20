import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – EasiBill",
  description: "Learn how EasiBill collects, uses, and protects your business and customer data, including WhatsApp numbers, purchase history, and billing records.",
  alternates: { canonical: "https://easibill.com/privacy" },
};

const sections = [
  {
    heading: "1. Information We Collect",
    body: `We collect information you provide directly when you create an account, import customer records, or contact support. This includes business name, owner name, email address, phone number, and billing details. Customer data (name, phone number, item or service purchased, and follow-up intervals) is collected only through your explicit import or manual entry inside the dashboard.`,
  },
  {
    heading: "2. How We Use Your Information",
    body: `We use collected data to operate and improve EasiBill: sending WhatsApp follow-up reminders on your behalf, generating daily queues, producing retention analytics, and providing customer support. We do not sell or rent your data or your customers' data to any third party.`,
  },
  {
    heading: "3. WhatsApp Integration",
    body: `EasiBill connects to WhatsApp Business API to deliver reminder and broadcast messages. Message content is composed by our system from your customer records and templates you approve. Messages are routed through Meta's infrastructure and are subject to Meta's own privacy practices. We store message-delivery status (sent, delivered, read) for analytics purposes only.`,
  },
  {
    heading: "4. Customer Data",
    body: `Customer records stored in EasiBill are treated as sensitive personal data. We encrypt all customer records at rest (AES-256) and in transit (TLS 1.3). Access is restricted to authenticated users with permissions scoped to your business account. We do not use customer data to train AI models or for any purpose beyond operating EasiBill for your account.`,
  },
  {
    heading: "5. Data Retention",
    body: `Your account data and customer records are retained for as long as your account is active. Upon account deletion, all personally identifiable data is purged within 30 days. Anonymised aggregate statistics (reminder counts, follow-up rates) may be retained for product analytics.`,
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
      <p className="font-mono text-xs tracking-[0.2em] text-green">LEGAL</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[.96] tracking-[-0.018em] text-ink [font-stretch:68%]">
        Privacy policy
      </h1>
      <p className="mt-3 font-mono text-xs tracking-[0.08em] text-faint">LAST UPDATED: JUNE 2026</p>
      <p className="mt-6 leading-7 text-mutedink">
        EasiBill ("we", "our", "us") is committed to protecting the privacy of local business owners and their customers. This policy explains what data we collect, how we use it, and the rights you have over it.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.heading} className="border-t border-ink pt-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-[-0.005em] text-ink">{s.heading}</h2>
            <p className="mt-2 leading-7 text-mutedink">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
