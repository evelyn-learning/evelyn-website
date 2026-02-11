import { AdminSessionProvider } from './AdminSessionProvider';

export const metadata = {
  title: "Admin Dashboard | Evelyn Learning",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>;
}
