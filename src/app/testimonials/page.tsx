import type { Metadata } from "next";
import TestimonialsPage from "@/src/Pages/TestimonialsPage";

export const metadata: Metadata = {
  title: "Ferbz Reviews – Local Business Billing Software",
  description:
    "Real reviews from local business owners using Ferbz. See how independent businesses improved retention and recovered revenue with WhatsApp reminders.",
  alternates: {
    canonical: "https://ferbz.com/testimonials",
  },
  openGraph: {
    title: "Ferbz Reviews – Local Business Billing Software",
    description:
      "Real reviews from local business owners using Ferbz. See how independent businesses improved retention and recovered revenue with WhatsApp reminders.",
    url: "https://ferbz.com/testimonials",
    siteName: "Ferbz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferbz Reviews – Local Business Billing Software",
    description:
      "Real reviews from local business owners using Ferbz. See how independent businesses improved retention and recovered revenue with WhatsApp reminders.",
  },
};

export default function Page() {
  return <TestimonialsPage />;
}
