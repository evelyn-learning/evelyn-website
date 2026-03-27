import { PortalNav } from './PortalNav';
import { PortalFooter } from './PortalFooter';

interface PortalShellProps {
  children: React.ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PortalNav />
      <main className="flex-grow">{children}</main>
      <PortalFooter />
    </div>
  );
}
