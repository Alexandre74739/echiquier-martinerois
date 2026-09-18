import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // unsafe-eval requis par Stockfish WASM ; unsafe-inline requis par Next.js hydration et Tailwind
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https://cdn.sanity.io data: blob:",
      // next/font/google auto-héberge les polices — pas besoin de fonts.googleapis.com
      "font-src 'self' data:",
      "connect-src 'self' https://lichess.org blob:",
      // Stockfish tourne dans un Web Worker local
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      {
        // Headers de sécurité sur toutes les routes sauf /studio (Sanity Studio a ses propres exigences CSP)
        source: '/((?!studio).*)',
        headers: securityHeaders,
      },
      {
        // COEP/COOP nécessaires pour SharedArrayBuffer dans le Web Worker Stockfish
        source: '/stockfish.js',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ]
  },
}

export default nextConfig
