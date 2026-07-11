import type { Metadata } from "next";
import TestimonialsPage from "@/src/Pages/TestimonialsPage";

export const metadata: Metadata = {
  title: "EasiBill Reviews – Local Business Billing Software",
  description:
    "Real reviews from local business owners using EasiBill. See how independent businesses improved retention and recovered revenue with WhatsApp reminders.",
  alternates: {
    canonical: "https://easibill.com/testimonials",
  },
  openGraph: {
    title: "EasiBill Reviews – Local Business Billing Software",
    description:
      "Real reviews from local business owners using EasiBill. See how independent businesses improved retention and recovered revenue with WhatsApp reminders.",
    url: "https://easibill.com/testimonials",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasiBill Reviews – Local Business Billing Software",
    description:
      "Real reviews from local business owners using EasiBill. See how independent businesses improved retention and recovered revenue with WhatsApp reminders.",
  },
};

export default function Page() {
  return <TestimonialsPage />;
}
