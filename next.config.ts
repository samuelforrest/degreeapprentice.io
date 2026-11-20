import type { NextConfig } from "next";

// Every listing page is pre-rendered from content/roles at build time.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The /mcp endpoint reads listings and guides from disk at request time.
  outputFileTracingIncludes: { "/mcp": ["./content/**/*"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/contribute", destination: "/about#contribute", permanent: true },
      { source: "/apprenticeships", destination: "/roles", permanent: true },
      { source: "/apprenticeships/:id", destination: "/roles/:id", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
