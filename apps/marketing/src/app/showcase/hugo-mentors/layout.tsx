import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hugo Mentors | Assessment Report System Demo',
  description: 'AI-powered individualized assessment report generation — built by Evelyn Learning',
  robots: { index: false, follow: false },
};

export default function HugoMentorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
