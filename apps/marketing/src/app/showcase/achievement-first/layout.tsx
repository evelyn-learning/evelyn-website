import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achievement First Learning Platform',
  description: 'Teacher-driven classroom learning platform for Achievement First charter schools.',
  robots: { index: false, follow: false },
};

export default function AchievementFirstLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
