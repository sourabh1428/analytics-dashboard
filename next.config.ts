import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx"],
  eslint: {
    // Scope linting to the Next.js app code only. Legacy Vite-era src/components/*.jsx
    // files are not part of the App Router render tree and have pre-existing violations.
    dirs: ["src/app", "lib", "components"],
  },
  allowedDevOrigins: ["localhost:3000", "127.0.0.1:3000", "localhost:3001", "127.0.0.1:3001"],

  async redirects() {
    return [
      { source: "/feature", destination: "/features", permanent: true },
      { source: "/our-features", destination: "/features", permanent: true },
      { source: "/product-features", destination: "/features", permanent: true },
      { source: "/testimonial", destination: "/testimonials", permanent: true },
      { source: "/reviews", destination: "/testimonials", permanent: true },
      { source: "/customers", destination: "/testimonials", permanent: true },
      {
        source: "/bulk-billing",
        destination: "/easibill-customisable-bulk-billing-solution",
        permanent: true,
      },
      {
        source: "/bulk-billing-solution",
        destination: "/easibill-customisable-bulk-billing-solution",
        permanent: true,
      },
      {
        source: "/customisable-billing",
        destination: "/easibill-customisable-bulk-billing-solution",
        permanent: true,
      },
      {
        source: "/easibill-bulk-billing",
        destination: "/easibill-customisable-bulk-billing-solution",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
