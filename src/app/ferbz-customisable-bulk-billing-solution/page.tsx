import type { Metadata } from "next";
import BulkBillingSolutionPage from "@/src/Pages/BulkBillingSolutionPage";

export const metadata: Metadata = {
  title: "Ferbz Customisable Bulk Billing Solution for Local Businesses",
  description:
    "Ferbz's customisable bulk billing solution helps local businesses create compliant invoices, manage bulk orders, and send bills on WhatsApp in under 5 minutes.",
  alternates: {
    canonical: "https://ferbz.com/ferbz-customisable-bulk-billing-solution",
  },
  openGraph: {
    title: "Ferbz Customisable Bulk Billing Solution for Local Businesses",
    description:
      "Ferbz's customisable bulk billing solution helps local businesses create compliant invoices, manage bulk orders, and send bills on WhatsApp in under 5 minutes.",
    url: "https://ferbz.com/ferbz-customisable-bulk-billing-solution",
    siteName: "Ferbz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferbz Customisable Bulk Billing Solution for Local Businesses",
    description:
      "Ferbz's customisable bulk billing solution helps local businesses create compliant invoices, manage bulk orders, and send bills on WhatsApp in under 5 minutes.",
  },
};

export default function Page() {
  return <BulkBillingSolutionPage />;
}
