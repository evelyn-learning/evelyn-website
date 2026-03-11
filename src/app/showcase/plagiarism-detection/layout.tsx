import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plagiarism & AI Detection — Evelyn Learning Showcase',
  description: 'K-12 academic integrity tool with AI detection, plagiarism analysis, inline highlighting, batch processing, and teacher-ready reports.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
