import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  serverExternalPackages: ["pg"],
  async redirects() {
    return [
      {
        source: "/local-seo",
        destination: "/seo",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
