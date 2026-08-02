import type { Metadata } from 'next';

// page.tsx is 'use client' and cannot export metadata; this layout gives
// /tutor its own title/description/canonical (it previously inherited the
// root defaults, including a canonical pointing at the homepage).
export const metadata: Metadata = {
  title: 'Try the AI Voice Tutor Live',
  description:
    'Start a live voice tutoring session — pick a lesson, talk to the AI tutor, and watch the whiteboard. 1,700+ lessons across math, science, English, history, test prep, and more.',
  alternates: { canonical: '/tutor' },
};

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
