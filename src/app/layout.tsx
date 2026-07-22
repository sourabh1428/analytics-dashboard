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
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ferbz",
              url: "https://ferbz.com",
              logo: "https://ferbz.com/android-chrome-512x512.png",
              description:
                "Ferbz is billing software for local businesses. Send bills on WhatsApp, retain customers with automated reminders, and run your business hassle-free.",
              sameAs: [],
            }),
          }}
        />
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
        {/*
          lazyOnload (not afterInteractive): this is a support-chat widget,
          not needed for first render or SEO. afterInteractive was firing it
          in the same window as hydration + the Lenis/GSAP scroll rig +
          PostHog + GTM, all competing for the main thread right when the
          user is most likely to start scrolling. lazyOnload defers it until
          the browser is idle, so it no longer contributes to that jank.
        */}
        <Script id="assistloop-widget" strategy="lazyOnload">
          {`
            (function() {
              var script = document.createElement('script');
              script.src = 'https://assistloop.ai/assistloop-widget.js';
              script.onload = function() {
                // Bottom-left (see src/index.css) - bottom-right is already
                // taken by ScrollToTopButton. Positioning is enforced by the
                // CSS rules in src/index.css (single source of truth); do
                // not also fight it here with inline styles or a
                // MutationObserver - that previously left both the left and
                // right insets set at once (two important stylesheet rules
                // on different properties, both applying), which is what
                // broke the opened chat window's layout on mobile.
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
  )
}
