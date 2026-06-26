import type { Metadata } from "next";
import BulkBillingSolutionPage from "@/src/Pages/BulkBillingSolutionPage";

export const metadata: Metadata = {
  title: "EasiBill Customisable Bulk Billing Solution for Pharmacies",
  description:
    "EasiBill's customisable bulk billing solution helps independent pharmacies create compliant invoices, manage bulk orders, and send bills on WhatsApp — all in under 5 minutes of setup.",
  alternates: {
    canonical: "https://easibill.com/easibill-customisable-bulk-billing-solution",
  },
  openGraph: {
    title: "EasiBill Customisable Bulk Billing Solution for Pharmacies",
    description:
      "EasiBill's customisable bulk billing solution helps independent pharmacies create compliant invoices, manage bulk orders, and send bills on WhatsApp — all in under 5 minutes of setup.",
    url: "https://easibill.com/easibill-customisable-bulk-billing-solution",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasiBill Customisable Bulk Billing Solution for Pharmacies",
    description:
      "EasiBill's customisable bulk billing solution helps independent pharmacies create compliant invoices, manage bulk orders, and send bills on WhatsApp — all in under 5 minutes of setup.",
  },
};

export default function Page() {
  return <BulkBillingSolutionPage />;
}
