import type { Metadata } from "next";
import ContactPage from "@/src/Pages/Contact";

export const metadata: Metadata = {
  title: "Contact EasiBill – Talk to Our Local Business Billing Team",
  description:
    "Get in touch with EasiBill. We help local business owners set up WhatsApp billing, follow-up reminders, and retention tools. Book a demo or email us.",
  alternates: {
    canonical: "https://easibill.com/contact",
  },
  openGraph: {
    title: "Contact EasiBill – Talk to Our Local Business Billing Team",
    description:
      "Get in touch with EasiBill. We help local business owners set up WhatsApp billing, follow-up reminders, and retention tools. Book a demo or email us.",
    url: "https://easibill.com/contact",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact EasiBill – Talk to Our Local Business Billing Team",
    description:
      "Get in touch with EasiBill. We help local business owners set up WhatsApp billing, follow-up reminders, and retention tools. Book a demo or email us.",
  },
};

export default function Page() {
  return <ContactPage />;
}
