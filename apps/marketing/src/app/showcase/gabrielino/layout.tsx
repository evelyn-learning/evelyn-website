import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evelyn Learning for SGUSD | Gabrielino High School',
  description: 'AI-powered education tools for San Gabriel Unified School District — built by Evelyn Learning',
  robots: { index: false, follow: false },
};

export default function GabrielinoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
