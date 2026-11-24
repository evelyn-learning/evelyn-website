import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: true },
};

export default function DashboardLoginPage() {
  return <LoginForm />;
}
