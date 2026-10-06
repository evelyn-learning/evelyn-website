import type { Metadata } from 'next';
import { REPLAY_DOCUMENT_TITLE, partnerFrameMetadata } from '@/lib/tutor/portal/partner-frame-metadata';

// Bare layout — no portal shell (PortalShell also skips this path), and
// never indexed: every URL here carries a signed, short-lived student token.
// Shown inside partner products: neutral title, none of this site's
// descriptive metadata. The page's generateMetadata adds the partner's
// product name when the verified token carries one.
export const metadata: Metadata = partnerFrameMetadata(REPLAY_DOCUMENT_TITLE);

export default function ReplayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
