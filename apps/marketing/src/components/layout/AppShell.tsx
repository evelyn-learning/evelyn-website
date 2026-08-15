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

  // NOTE: the /tutor-portal special-cases that used to live here (a
  // tutor.* hostname probe and a pathname check) were removed by the M1a
  // workspace split. Every /tutor-portal path now belongs to apps/tutor and
  // nginx proxies it to :3007, so this app can never render one.

  // Showcase pages have their own header/footer/chat widget
  const isShowcasePage = pathname?.startsWith('/showcase/');
  // Tutor page manages its own full-screen layout per stage
  const isTutorPage = pathname === '/tutor';

  if (isShowcasePage || isTutorPage) {
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
