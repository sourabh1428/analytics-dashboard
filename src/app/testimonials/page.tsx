import type { Metadata } from "next";
import TestimonialsPage from "@/src/Pages/TestimonialsPage";

export const metadata: Metadata = {
  title: "EasiBill Reviews – Local Business Owners on the Best Billing Software",
  description:
    "Read real reviews from local business owners who use EasiBill. See how independent businesses worldwide improved customer retention and recovered revenue with WhatsApp follow-up reminders.",
  alternates: {
    canonical: "https://easibill.com/testimonials",
  },
  openGraph: {
    title: "EasiBill Reviews – Local Business Owners on the Best Billing Software",
    description:
      "Read real reviews from local business owners who use EasiBill. See how independent businesses worldwide improved customer retention and recovered revenue with WhatsApp follow-up reminders.",
    url: "https://easibill.com/testimonials",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasiBill Reviews – Local Business Owners on the Best Billing Software",
    description:
      "Read real reviews from local business owners who use EasiBill. See how independent businesses worldwide improved customer retention and recovered revenue with WhatsApp follow-up reminders.",
  },
};

export default function Page() {
  return <TestimonialsPage />;
}
