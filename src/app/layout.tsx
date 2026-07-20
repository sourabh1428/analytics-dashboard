import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, Newsreader, Spline_Sans_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import SmoothScroll from "@/src/components/landing/SmoothScroll";
import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import ConsentBanner from "@/src/components/ConsentBanner";
import LeadNudge from "@/src/components/LeadNudge";
import PostHogProvider from "@/src/components/PostHogProvider";
import PostHogPageView from "@/src/components/PostHogPageView";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const splineSansMono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-spline-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://ferbz.com"),
  title: {
    default: "Ferbz – Local Business Billing & Customer Retention",
    template: "%s | Ferbz",
  },
  description:
    "Ferbz is billing software for local businesses. Send bills on WhatsApp, retain customers with automated reminders, and run your business hassle-free.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${newsreader.variable} ${splineSansMono.variable}`}
    >
      <body suppressHydrationWarning>
        <PostHogProvider>
          <PostHogPageView />
          <SmoothScroll>
            {/*
              No overflow-x-hidden here on purpose: per the CSS overflow
              spec, a non-visible overflow-x forces overflow-y's computed
              value to `auto` too — even if overflow-y is explicitly set to
              `visible` — which turns this div into an unintended scroll
              container. Since the page actually scrolls on <body>/window
              (via Lenis), this div's own scrollTop never moves, which
              breaks `position: sticky` for every descendant that depends
              on real viewport scroll (Hero's stage, DayInTheLife's chat
              panel, etc.) — they end up behaving like `position: relative`
              and just scroll away with the page instead of pinning.
              Horizontal-bleed clipping, if needed, should be scoped to the
              individual section that needs it, not this global wrapper.
            */}
            <div className="relative min-h-screen bg-paper text-ink font-sans">
              <ScrollProgressBar />
              <NavBar />
              <main className="relative">{children}</main>
              <Footer />
              <ConsentBanner />
              <LeadNudge />
              <Analytics />
              <SpeedInsights />
            </div>
          </SmoothScroll>
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
