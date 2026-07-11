import type { Metadata } from "next";
import ContactPage from "@/src/Pages/Contact";

export const metadata: Metadata = {
  title: "Contact EasiBill – Talk to Our Local Business Billing Team",
  description:
    "Get in touch with EasiBill. We help local business owners worldwide set up WhatsApp billing, follow-up reminders, and customer retention tools. Book a demo or reach us by email.",
  alternates: {
    canonical: "https://easibill.com/contact",
  },
  openGraph: {
    title: "Contact EasiBill – Talk to Our Local Business Billing Team",
    description:
      "Get in touch with EasiBill. We help local business owners worldwide set up WhatsApp billing, follow-up reminders, and customer retention tools.",
    url: "https://easibill.com/contact",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact EasiBill – Talk to Our Local Business Billing Team",
    description:
      "Get in touch with EasiBill. We help local business owners worldwide set up WhatsApp billing, follow-up reminders, and customer retention tools.",
  },
};

export default function Page() {
  return <ContactPage />;
}
