import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – Ferbz",
  description: "Read the terms and conditions for using Ferbz's local business billing, WhatsApp reminder, and customer retention software platform.",
  alternates: { canonical: "https://ferbz.com/terms" },
};

const sections = [
  {
    heading: "1. Acceptance of Terms",
    body: `By creating an Ferbz account or using any Ferbz service you agree to these Terms of Service. If you are using Ferbz on behalf of a business, you represent that you have authority to bind that entity to these terms.`,
  },
  {
    heading: "2. Description of Service",
    body: `Ferbz provides cloud-based local business billing software, customer record management, WhatsApp follow-up reminder automation, broadcast messaging, and retention analytics. Features available to you depend on the subscription plan you have chosen.`,
  },
  {
    heading: "3. Account Registration",
    body: `You must provide accurate information when creating your account and keep it updated. You are responsible for all activity that occurs under your account. You must not share login credentials or allow unauthorised persons to access your account. Notify us immediately at support@ferbz.com if you suspect unauthorised use.`,
  },
  {
    heading: "4. Subscription and Payment",
    body: `Ferbz offers a free Starter plan and paid Growth plans billed monthly or annually. Prices are listed on the Pricing page. Paid subscriptions renew automatically unless cancelled before the renewal date. All fees are non-refundable except where required by law. We reserve the right to change pricing with 30 days' notice.`,
  },
  {
    heading: "5. Acceptable Use",
    body: `You may use Ferbz only for lawful business operations. You must not: send unsolicited bulk messages unrelated to customer care; use Ferbz to harass or spam customers; attempt to reverse-engineer or scrape the platform; or resell access to Ferbz without written permission. Violation of these terms may result in immediate account suspension.`,
  },
  {
    heading: "6. Customer Data and Compliance",
    body: `You retain ownership of all customer data you import into Ferbz. You are responsible for obtaining any consents required by applicable law before storing customer contact information. Ferbz acts as a data processor on your behalf. If you require a data processing agreement for regulatory compliance, contact support@ferbz.com.`,
  },
  {
    heading: "7. WhatsApp Messaging",
    body: `Ferbz delivers messages via WhatsApp Business API. You are responsible for ensuring that customers have opted in to receive WhatsApp communications from your business and that message content complies with Meta's Commerce and Business policies. Ferbz is not liable for messages blocked, filtered, or penalised by Meta.`,
  },
  {
    heading: "8. Uptime and Support",
    body: `We target 99.5% monthly uptime for the Ferbz dashboard. Scheduled maintenance will be announced at least 24 hours in advance. Support is available via email (support@ferbz.com) and phone (+91 8839143395) during business hours IST.`,
  },
  {
    heading: "9. Intellectual Property",
    body: `Ferbz and all associated software, designs, and trademarks are owned by Ferbz and its licensors. These terms grant you a limited, non-exclusive, non-transferable licence to use the service during your subscription. You may not copy, modify, or distribute Ferbz software.`,
  },
  {
    heading: "10. Limitation of Liability",
    body: `To the fullest extent permitted by law, Ferbz's total liability to you for any claim arising from these terms or the service shall not exceed the fees you paid in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages including lost revenue or customer data loss.`,
  },
  {
    heading: "11. Termination",
    body: `You may cancel your account at any time from the dashboard settings. We may suspend or terminate accounts that violate these terms, are involved in fraudulent activity, or for non-payment after a grace period. Upon termination, you may export your data within 14 days before it is purged.`,
  },
  {
    heading: "12. Governing Law",
    body: `These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Bhopal, Madhya Pradesh, India, unless otherwise required by local consumer protection law in your jurisdiction.`,
  },
  {
    heading: "13. Changes to These Terms",
    body: `We may update these terms. Material changes will be communicated by email with at least 14 days' notice. Continued use after the effective date constitutes acceptance of the revised terms.`,
  },
  {
    heading: "14. Contact",
    body: `Questions about these terms? Email support@ferbz.com or call +91 8839143395.`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-green">LEGAL</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[.96] tracking-[-0.018em] text-ink [font-stretch:68%]">
        Terms of service
      </h1>
      <p className="mt-3 font-mono text-xs tracking-[0.08em] text-faint">LAST UPDATED: JUNE 2026</p>
      <p className="mt-6 leading-7 text-mutedink">
        Please read these Terms of Service carefully before using Ferbz. They govern your access to and use of our local business billing and customer retention platform.
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
