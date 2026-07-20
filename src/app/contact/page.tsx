import type { Metadata } from "next";
import ContactPage from "@/src/Pages/Contact";

export const metadata: Metadata = {
  title: "Contact Ferbz – Talk to Our Local Business Billing Team",
  description:
    "Get in touch with Ferbz. We help local business owners set up WhatsApp billing, follow-up reminders, and retention tools. Book a demo or email us.",
  alternates: {
    canonical: "https://ferbz.com/contact",
  },
  openGraph: {
    title: "Contact Ferbz – Talk to Our Local Business Billing Team",
    description:
      "Get in touch with Ferbz. We help local business owners set up WhatsApp billing, follow-up reminders, and retention tools. Book a demo or email us.",
    url: "https://ferbz.com/contact",
    siteName: "Ferbz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Ferbz – Talk to Our Local Business Billing Team",
    description:
      "Get in touch with Ferbz. We help local business owners set up WhatsApp billing, follow-up reminders, and retention tools. Book a demo or email us.",
  },
};

export default function Page() {
  return <ContactPage />;
}
