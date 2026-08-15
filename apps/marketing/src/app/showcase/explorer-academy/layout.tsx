import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explorer Academy | Learning Platform',
  description: 'Personalized, curriculum-aligned Math & Science learning platform for Explorer Academy students.',
  robots: { index: false, follow: false },
};

export default function ExplorerAcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
