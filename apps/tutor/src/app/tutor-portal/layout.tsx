import type { Metadata } from 'next';
import { PortalShell } from './components/PortalShell';
import { lessonPlanCountFloor } from './data/curriculum';
import { PORTAL_ORIGIN, PORTAL_SITE_NAME } from './portal-pages';

// Written out, not built from PORTAL_SITE_NAME: scripts/test-partner-frame-metadata.ts reads these two literals.
const titles = { default: 'AI Voice Tutor — White-Label Platform', template: '%s | Evelyn Voice Tutor' };
const title = titles.default;
// 2026-11-24: "200+ topics" became the catalogue's real plan count. The language figure is the public reach
// claim and is not changed here.
const description =
  `White-label AI voice tutoring platform with interactive whiteboard, ${lessonPlanCountFloor.toLocaleString('en-US')}+ lesson plans, and 50+ languages. Embed in your app and launch in weeks.`;

// 2026-11-24: the portal's own metadata. Every page here sat under the root layout's, which describes the
// retail tutor: og:url was https://www.evelynlearning.com/tutor on every portal page, and metadataBase is www.
// Each key the root sets for sharing is set again here (metadata merges shallowly, so the whole openGraph and
// twitter objects are replaced). Indexable pages then set their own through portalMetadata (seo.ts), with an
// absolute canonical on this host; the private pages (dashboard, embed, replay, home) set noindex themselves.
export const metadata: Metadata = {
  metadataBase: new URL(PORTAL_ORIGIN),
  title: titles,
  description,
  applicationName: PORTAL_SITE_NAME,
  openGraph: { type: 'website', locale: 'en_US', url: `${PORTAL_ORIGIN}/`, siteName: PORTAL_SITE_NAME, title, description },
  twitter: { card: 'summary', title, description },
  robots: { index: true, follow: true },
};

export default function TutorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell>{children}</PortalShell>;
}
