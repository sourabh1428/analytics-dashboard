import type { Metadata } from "next";
import FeaturesPage from "@/src/Pages/FeaturesPage";

export const metadata: Metadata = {
  title: "Ferbz Features – Easy WhatsApp Billing & Customer Retention",
  description:
    "Explore Ferbz's features for local businesses: WhatsApp reminders, customer segmentation, daily queues, retention analytics, and broadcast campaigns.",
  alternates: {
    canonical: "https://ferbz.com/features",
  },
  openGraph: {
    title: "Ferbz Features – Easy WhatsApp Billing & Customer Retention",
    description:
      "Explore Ferbz's features for local businesses: WhatsApp reminders, customer segmentation, daily queues, retention analytics, and broadcast campaigns.",
    url: "https://ferbz.com/features",
    siteName: "Ferbz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferbz Features – Easy WhatsApp Billing & Customer Retention",
    description:
      "Explore Ferbz's features for local businesses: WhatsApp reminders, customer segmentation, daily queues, retention analytics, and broadcast campaigns.",
  },
};

export default function Page() {
  return <FeaturesPage />;
}
