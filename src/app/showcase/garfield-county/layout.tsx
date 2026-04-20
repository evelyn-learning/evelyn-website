import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panguitch Middle Math | Evelyn Learning',
  description:
    'Live mastery tracking and intervention, built for Panguitch Middle 8th grade math — Utah Core aligned.',
  robots: { index: false, follow: false },
};

export default function GarfieldCountyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
