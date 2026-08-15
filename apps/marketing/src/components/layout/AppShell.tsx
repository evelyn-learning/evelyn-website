'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidgetWrapper } from '@/components/chat';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell conditionally wraps pages with the Evelyn Learning header/footer.
 * Showcase pages (under /showcase/) get their own branding and layout, so they
 * don't need the Evelyn wrapper — they are the only exception.
 *
 * The tutor surfaces (/tutor, /tutor-portal/*) belong to apps/tutor, not to
 * this app; nginx proxies them to :3007, so they never reach this component
 * and need no special case here.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Showcase pages bring their own header, footer and chat widget.
  if (pathname?.startsWith('/showcase/')) {
    return <>{children}</>;
  }

  // Every other Evelyn Learning page gets the full wrapper.
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ChatWidgetWrapper />
    </>
  );
}
