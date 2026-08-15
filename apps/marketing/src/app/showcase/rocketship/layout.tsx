import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rocketship Innovation School | Evelyn Learning Showcase',
  description: 'Interactive showcase for Rocketship Public Schools — ELL Co-Pilot, Teacher Briefs, AI Co-Pilot, and Unified Dashboard.',
  robots: { index: false, follow: false },
};

export default function RocketshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
