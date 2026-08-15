import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Lesson Engine | Interactive Lesson Generator Demo',
  description: 'AI-powered interactive lesson generation with narration, Q&A, and worksheets — built by Evelyn Learning',
  robots: { index: false, follow: false },
};

export default function LessonEngineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
