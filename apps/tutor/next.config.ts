import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // NEXT_DIST_DIR was the staged-build override for deploy-update.sh, which
  // built on the server and swapped a staging dir into .next atomically.
  // That script was DELETED 2026-08-21 and nothing sets this variable any
  // more, so this always resolves to '.next'. Kept rather than inlined
  // because it is a harmless escape hatch, but do not assume a reader can
  // find the mechanism it was written for — it is gone.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Pin the Turbopack workspace root to the repo root (two levels up from
  // this app, which lives at apps/tutor/) — see apps/marketing/next.config.ts
  // for the full rationale. It must stay pinned at the repo root — not this
  // app dir — because deps are hoisted to the workspace root's node_modules
  // (npm workspaces); pinning to the app dir makes Turbopack treat it as a
  // hermetic filesystem boundary and it can no longer find next/package.json
  // above it.
  turbopack: { root: path.join(__dirname, "..", "..") },
  transpilePackages: ['@evelyn/core'],
  // 50mb, NOT the 10mb default: /api/tutor/session-audio flushes exceeded 10MB
  // (2026-04-24 "Unterminated JSON at position 10436608" = exactly the cutoff).
  experimental: { middlewareClientMaxBodySize: '50mb' },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.evelynlearning.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh7-us.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
