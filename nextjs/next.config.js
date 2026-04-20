/** @type {import('next').NextConfig} */
const withCloudflare = require('@cloudflare/next-on-pages/plugin')({
  // Cloudflare Pages configuration
  kv: {},           // Enable KV bindings
  DurableObjects: {}, // Enable Durable Objects
  r2: {},           // Enable R2 bindings
  wasm: {},         // Enable WASM modules
  functions: {     // Next.js API routes config
    config: {
      // Configure for edge runtime
    }
  }
})

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'source.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  // Enable static export for Cloudflare Pages
  output: 'standalone',
  // Ensure API routes work on edge
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = withCloudflare(nextConfig)