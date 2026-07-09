'use client';

import { usePathname } from 'next/navigation';
import { PortalNav } from './PortalNav';
import { PortalFooter } from './PortalFooter';

interface PortalShellProps {
  children: React.ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();

  // Embed + replay pages render without nav/footer — they live inside
  // partner iframes (replay = the student past-sessions surface).
  if (pathname === '/embed' || pathname?.startsWith('/embed/') ||
      pathname === '/tutor-portal/embed' || pathname?.startsWith('/tutor-portal/embed/') ||
      pathname === '/replay' || pathname?.startsWith('/replay/') ||
      pathname === '/tutor-portal/replay' || pathname?.startsWith('/tutor-portal/replay/')) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PortalNav />
      <main className="flex-grow">{children}</main>
      <PortalFooter />
    </div>
  );
}
