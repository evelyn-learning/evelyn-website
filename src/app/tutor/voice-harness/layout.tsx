import type { Metadata } from 'next';

// Dev-only harness dashboard (spec Phase 1) — keep it out of search entirely.
// The page itself already 404s outside NODE_ENV=development; this is belt
// and suspenders for any environment where it's reachable.
export const metadata: Metadata = {
  title: 'Voice Harness (dev)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VoiceHarnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
