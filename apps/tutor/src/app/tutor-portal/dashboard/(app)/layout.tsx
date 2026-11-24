import type { Metadata } from 'next';
import { DashboardShell } from './DashboardShell';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

// The (app) group holds the signed-in pages, so the sign-in and link pages beside it (dashboard/login,
// dashboard/verify) stay outside this layout and never ask /me.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
