import type { Metadata } from "next";
import BulkBillingSolutionPage from "@/src/Pages/BulkBillingSolutionPage";

export const metadata: Metadata = {
  title: "EasiBill Customisable Bulk Billing Solution for Local Businesses",
  description:
    "EasiBill's customisable bulk billing solution helps local businesses create compliant invoices, manage bulk orders, and send bills on WhatsApp in under 5 minutes.",
  alternates: {
    canonical: "https://easibill.com/easibill-customisable-bulk-billing-solution",
  },
  openGraph: {
    title: "EasiBill Customisable Bulk Billing Solution for Local Businesses",
    description:
      "EasiBill's customisable bulk billing solution helps local businesses create compliant invoices, manage bulk orders, and send bills on WhatsApp in under 5 minutes.",
    url: "https://easibill.com/easibill-customisable-bulk-billing-solution",
    siteName: "EasiBill",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasiBill Customisable Bulk Billing Solution for Local Businesses",
    description:
      "EasiBill's customisable bulk billing solution helps local businesses create compliant invoices, manage bulk orders, and send bills on WhatsApp in under 5 minutes.",
  },
};

export default function Page() {
  return <BulkBillingSolutionPage />;
}
