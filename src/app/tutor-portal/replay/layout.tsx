import type { Metadata } from 'next';

// Bare layout — no portal shell (PortalShell also skips this path), and
// never indexed: every URL here carries a signed, short-lived student token.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ReplayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
