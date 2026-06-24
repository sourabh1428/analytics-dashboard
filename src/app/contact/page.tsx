import type { Metadata } from "next";
import ContactPage from "@/src/Pages/Contact";

export const metadata: Metadata = {
  title: "Contact EasiBill – Talk to Our Pharmacy Billing Team",
  description:
    "Get in touch with EasiBill. We help Indian pharmacy owners set up WhatsApp billing, refill reminders, and patient retention tools. Book a demo or reach us by email.",
  alternates: {
    canonical: "https://easibill.com/contact",
  },
  openGraph: {
    title: "Contact EasiBill – Talk to Our Pharmacy Billing Team",
    description:
      "Get in touch with EasiBill. We help Indian pharmacy owners set up WhatsApp billing, refill reminders, and patient retention tools.",
    url: "https://easibill.com/contact",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact EasiBill – Talk to Our Pharmacy Billing Team",
    description:
      "Get in touch with EasiBill. We help Indian pharmacy owners set up WhatsApp billing, refill reminders, and patient retention tools.",
  },
};

export default function Page() {
  return <ContactPage />;
}
