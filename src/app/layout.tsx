import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import ConsentBanner from "@/src/components/ConsentBanner";
import LeadNudge from "@/src/components/LeadNudge";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://easibill.com"),
  title: {
    default: "EasiBill – Easy Pharmacy Billing & Patient Retention Software",
    template: "%s | EasiBill",
  },
  description:
    "EasiBill is the easiest billing software for independent pharmacies. Send bills on WhatsApp, retain patients with automated refill reminders, and manage your medical store with zero hassle.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body suppressHydrationWarning>
        <div className="relative min-h-screen overflow-x-hidden bg-[#080d0a] text-[#f1f5f1]">
          <ScrollProgressBar />
          <NavBar />
          <main className="relative">{children}</main>
          <Footer />
          <ConsentBanner />
          <LeadNudge />
          <Analytics />
          <SpeedInsights />
        </div>
        <Script id="assistloop-widget" strategy="afterInteractive">
          {`
            (function() {
              var script = document.createElement('script');
              script.src = 'https://assistloop.ai/assistloop-widget.js';
              script.onload = function() {
                AssistLoopWidget.init({ agentId: "fe2f60b9-35f6-4337-b517-75e80e069174", position: "bottom-left" });
              };
              document.head.appendChild(script);
            })();
          `}
        </Script>
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
