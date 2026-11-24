import type { Metadata } from 'next';
import { VerifyLink } from './VerifyLink';

export const metadata: Metadata = {
  title: 'Continue to your dashboard',
  robots: { index: false, follow: false },
  // The address carries the one-time token: it must not travel on as a referrer.
  referrer: 'no-referrer',
};

export default async function DashboardVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await searchParams).token;
  const token = typeof raw === 'string' ? raw : '';
  return <VerifyLink token={token} />;
}
