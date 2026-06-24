import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import ConsentBanner from "@/src/components/ConsentBanner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://easibill.com"),
  title: {
    default: "EasiBill – Easy Pharmacy Billing & Patient Retention Software",
    template: "%s | EasiBill",
  },
  description:
    "EasiBill is the easiest billing software for Indian pharmacies. Send bills on WhatsApp, retain patients with automated refill reminders, and manage your medical store with zero hassle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eafaf3] via-[#f4fdf8] to-[#eef9f4] text-slate-950">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_45%_at_5%_15%,rgba(16,185,129,0.10),transparent),radial-gradient(ellipse_60%_35%_at_95%_55%,rgba(56,189,248,0.09),transparent),radial-gradient(ellipse_75%_40%_at_50%_85%,rgba(16,185,129,0.07),transparent)]" />
          <ScrollProgressBar />
          <NavBar />
          <main className="relative">{children}</main>
          <Footer />
          <ConsentBanner />
          <Analytics />
          <SpeedInsights />
        </div>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H54PC2W756"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H54PC2W756', { page_path: window.location.pathname });
          `}
        </Script>
      </body>
    </html>
  );
}
