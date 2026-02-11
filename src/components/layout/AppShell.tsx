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
 * Showcase pages (under /showcase/) get their own branding and layout,
 * so they don't need the Evelyn wrapper.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Showcase pages have their own header/footer/chat widget
  const isShowcasePage = pathname?.startsWith('/showcase/');

  if (isShowcasePage) {
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
