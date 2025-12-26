import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    authProxy: {
      matcher: [
        /*
         * 以下のパスを除外:
         * - /api/auth (認証API)
         * - /_next/static (静的ファイル)
         * - /_next/image (画像最適化)
         * - /favicon.ico, /sitemap.xml, /robots.txt (メタデータファイル)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      ],
    },
  },
};

export default nextConfig;
