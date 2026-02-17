import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explorer Academy | AI-Powered Learning Platform Demo',
  description: 'Personalized, curriculum-aligned Math & Science learning tools for Explorer Academy students.',
  robots: { index: false, follow: false },
};

export default function ExplorerAcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
