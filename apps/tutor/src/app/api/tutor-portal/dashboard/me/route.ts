/**
 * GET /api/tutor-portal/dashboard/me: everything the dashboard's first screen shows: the account, the partner
 * id, the minute pool, usage by day, the key (masked) and the people with access.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { SANDBOX_TERMS_VERSION, maskSecret } from '@/lib/tutor/partner-dashboard/core';
import { poolSummary, usageSummary } from '@/lib/tutor/partner-dashboard/data';
import { isDashboardAdmin } from '@/lib/tutor/partner-dashboard/admin';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const a = await requireAccount(req);
  if (a instanceof NextResponse) return a;
  const { store, account } = a;
  const [pool, usage, secrets, members] = await Promise.all([
    poolSummary(account.partnerId), usageSummary(account.partnerId), store.partnerSecrets(account.partnerId), store.listAccounts(account.partnerId),
  ]);
  return json({
    account: { email: account.email, name: account.name, company: account.company, role: account.role, termsVersion: account.termsVersion ?? null, termsCurrent: SANDBOX_TERMS_VERSION, createdAt: account.createdAt ?? null },
    partnerId: account.partnerId,
    admin: isDashboardAdmin(account.email),
    pool, usage,
    keys: secrets.map((s, i) => ({ masked: maskSecret(s.secret), createdAt: s.createdAt, expiresAt: s.expiresAt ?? null, current: i === 0 })),
    members: members.map((m) => ({ email: m.email, name: m.name, role: m.role, lastLoginAt: m.lastLoginAt ?? null })),
    firstSessionAt: members.find((m) => m.role === 'owner')?.firstSessionAt ?? null,
  });
}
