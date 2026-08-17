import type { NextConfig } from "next";

const adminOrigin =
  process.env.ADMIN_INTERNAL_URL ?? "http://127.0.0.1:3005";

const nextConfig: NextConfig = {
  // Admin is mounted at /admin/ on the Node service; avoid /admin ↔ /admin/ redirect loops.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/local-seo",
        destination: "/seo",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: `${adminOrigin}/admin/`,
      },
      {
        source: "/admin/:path*",
        destination: `${adminOrigin}/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
