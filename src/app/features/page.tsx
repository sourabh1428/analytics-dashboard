import type { Metadata } from "next";
import FeaturesPage from "@/src/Pages/FeaturesPage";

export const metadata: Metadata = {
  title: "EasiBill Features – Easy WhatsApp Billing & Patient Retention",
  description:
    "Discover EasiBill's pharmacy billing features: automatic WhatsApp refill reminders, patient segmentation, daily action queues, retention analytics, and broadcast campaigns.",
  alternates: {
    canonical: "https://easibill.com/features",
  },
  openGraph: {
    title: "EasiBill Features – Easy WhatsApp Billing & Patient Retention",
    description:
      "Discover EasiBill's pharmacy billing features: automatic WhatsApp refill reminders, patient segmentation, daily action queues, retention analytics, and broadcast campaigns.",
    url: "https://easibill.com/features",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasiBill Features – Easy WhatsApp Billing & Patient Retention",
    description:
      "Discover EasiBill's pharmacy billing features: automatic WhatsApp refill reminders, patient segmentation, daily action queues, retention analytics, and broadcast campaigns.",
  },
};

export default function Page() {
  return <FeaturesPage />;
}
