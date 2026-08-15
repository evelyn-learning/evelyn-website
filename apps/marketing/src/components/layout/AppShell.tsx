'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidgetWrapper } from '@/components/chat';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell conditionally wraps pages with the Evelyn Learning header/footer.
 * Showcase pages (under /showcase/) get their own branding and layout,
 * so they don't need the Evelyn wrapper.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Detect tutor portal subdomain (tutor.evelynlearning.com or tutor.localhost)
  // Middleware rewrites subdomain requests to /tutor-portal/*, but usePathname()
  // returns the original URL path, so we check the hostname instead.
  const [isTutorPortal, setIsTutorPortal] = useState(false);
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.startsWith('tutor.') || hostname === 'tutor.localhost') {
      setIsTutorPortal(true);
    }
  }, []);

  // Showcase pages have their own header/footer/chat widget
  const isShowcasePage = pathname?.startsWith('/showcase/');
  // Tutor page manages its own full-screen layout per stage
  const isTutorPage = pathname === '/tutor';
  // Also check pathname for direct /tutor-portal access (non-subdomain)
  const isTutorPortalPath = pathname?.startsWith('/tutor-portal');

  if (isShowcasePage || isTutorPage || isTutorPortal || isTutorPortalPath) {
    // Return children without Evelyn wrapper
    return <>{children}</>;
  }

  // Regular Evelyn Learning pages get the full wrapper
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ChatWidgetWrapper />
    </>
  );
}
