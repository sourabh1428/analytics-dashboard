import type { Metadata } from "next";
import TestimonialsPage from "@/src/Pages/TestimonialsPage";

export const metadata: Metadata = {
  title: "EasiBill Reviews – Pharmacy Owners on the Best Billing Software",
  description:
    "Read real reviews from pharmacy owners who use EasiBill. See how independent medical stores worldwide improved patient retention and recovered revenue with WhatsApp refill reminders.",
  alternates: {
    canonical: "https://easibill.com/testimonials",
  },
  openGraph: {
    title: "EasiBill Reviews – Pharmacy Owners on the Best Billing Software",
    description:
      "Read real reviews from pharmacy owners who use EasiBill. See how independent medical stores worldwide improved patient retention and recovered revenue with WhatsApp refill reminders.",
    url: "https://easibill.com/testimonials",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasiBill Reviews – Pharmacy Owners on the Best Billing Software",
    description:
      "Read real reviews from pharmacy owners who use EasiBill. See how independent medical stores worldwide improved patient retention and recovered revenue with WhatsApp refill reminders.",
  },
};

export default function Page() {
  return <TestimonialsPage />;
}
