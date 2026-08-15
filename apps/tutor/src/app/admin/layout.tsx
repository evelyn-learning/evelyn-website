import { AdminSessionProvider } from '@core/components/admin/AdminSessionProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: "Admin Dashboard | Evelyn Learning",
  robots: {
    index: false,
    follow: false,
  },
};

// These three /admin tools (tutor-sessions, demos, video-curator) moved into
// apps/tutor in the M1a workspace split. Before the split they were rendered
// by marketing's AppShell, which wrapped them in the site Header and Footer;
// apps/tutor's root layout renders {children} bare, so after the cutover they
// came up with no chrome at all. This layout restores the same wrapper shape
// AppShell used — Header, a flex-grow main, Footer — so these pages look
// exactly as they did before.
//
// AppShell also mounted ChatWidgetWrapper. That is deliberately NOT restored:
// it is a marketing-only component and pulling it into the engine would
// re-couple the two apps that this split exists to separate, to put a
// visitor-facing sales chat bubble on three auth-gated internal tools.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSessionProvider>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </AdminSessionProvider>
  );
}
