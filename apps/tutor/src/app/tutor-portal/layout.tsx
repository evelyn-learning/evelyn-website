import type { Metadata } from 'next';
import { PortalShell } from './components/PortalShell';

export const metadata: Metadata = {
  title: {
    default: 'AI Voice Tutor — White-Label Platform',
    template: '%s | Evelyn Voice Tutor',
  },
  description:
    'White-label AI voice tutoring platform with interactive whiteboard, 200+ topics, and 50+ languages. Embed in your app and launch in weeks.',
  robots: { index: true, follow: true },
};

export default function TutorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell>{children}</PortalShell>;
}
