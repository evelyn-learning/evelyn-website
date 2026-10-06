import type { Metadata } from 'next';
import { EMBED_DOCUMENT_TITLE, partnerFrameMetadata } from '@/lib/tutor/portal/partner-frame-metadata';

// Bare layout — no portal shell, no nav, no footer.
// This page lives inside partner iframes: a neutral document title, none of
// this site's descriptive metadata, never indexed (the URL carries a token).
// The page itself swaps in the partner's product name once it has read the
// token (it is a client page, so it cannot export metadata).
export const metadata: Metadata = partnerFrameMetadata(EMBED_DOCUMENT_TITLE);

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
