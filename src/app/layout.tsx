import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import ConsentBanner from "@/src/components/ConsentBanner";
import LeadNudge from "@/src/components/LeadNudge";
import PostHogProvider from "@/src/components/PostHogProvider";
import PostHogPageView from "@/src/components/PostHogPageView";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
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
    <html lang="en" suppressHydrationWarning className={ibmPlexSans.variable}>
      <body suppressHydrationWarning>
        <PostHogProvider>
          <PostHogPageView />
          <div className="relative min-h-screen overflow-x-hidden bg-[#09090B] text-[#FAFAFA]">
            <ScrollProgressBar />
            <NavBar />
            <main className="relative">{children}</main>
            <Footer />
            <ConsentBanner />
            <LeadNudge />
            <Analytics />
            <SpeedInsights />
          </div>
        </PostHogProvider>
        <Script id="assistloop-widget" strategy="afterInteractive">
          {`
            (function() {
              var script = document.createElement('script');
              script.src = 'https://assistloop.ai/assistloop-widget.js';
              script.onload = function() {
                AssistLoopWidget.init({ agentId: "fe2f60b9-35f6-4337-b517-75e80e069174", position: "bottom-right" });
                // Force right-side position via CSS override and MutationObserver
                var style = document.createElement('style');
                style.textContent = [
                  'iframe[src*="assistloop"], div[id*="assistloop"], div[class*="assistloop"] {',
                  '  left: auto !important;',
                  '  right: 20px !important;',
                  '}'
                ].join('');
                document.head.appendChild(style);
                // Watch for the widget element being added to DOM and reposition it
                var observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(m) {
                    m.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1) {
                        var el = node;
                        var id = (el.id || '') + (el.className || '');
                        if (id.toLowerCase().indexOf('assist') !== -1 || el.querySelector && el.querySelector('[id*="assist"],[class*="assist"]')) {
                          el.style.left = 'auto';
                          el.style.right = '20px';
                        }
                      }
                    });
                  });
                });
                observer.observe(document.body, { childList: true, subtree: true });
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
  )
}
