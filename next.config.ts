import type { NextConfig } from "next";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unconfigured";

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to optimize images from this project's Sanity CDN.
    // Use the object form, not `new URL(...)`: a URL object sets `search: ""`,
    // which only allows URLs *without* a query string, and every Sanity image
    // URL carries sizing/crop parameters (?w=…&h=…&fit=crop&auto=format).
    // Omitting `search` allows any query string.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${sanityProjectId}/**`,
      },
    ],
  },
  // Font files read at runtime by the generated link-preview images.
  outputFileTracingIncludes: {
    "/**/opengraph-image": ["./assets/fonts/**"],
  },
};

export default nextConfig;
