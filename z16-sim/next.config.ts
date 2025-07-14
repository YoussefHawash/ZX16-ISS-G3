import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
// To enable SharedArrayBuffer in Next.js, you need to set the appropriate headers
export default nextConfig;
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
};
