'use client';

import { usePathname } from 'next/navigation';
import { PortalNav } from './PortalNav';
import { PortalFooter } from './PortalFooter';

interface PortalShellProps {
  children: React.ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();

  // Embed pages render without nav/footer — they live inside partner iframes
  if (pathname === '/embed' || pathname?.startsWith('/embed/') ||
      pathname === '/tutor-portal/embed' || pathname?.startsWith('/tutor-portal/embed/')) {
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
