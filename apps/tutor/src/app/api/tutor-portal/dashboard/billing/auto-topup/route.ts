/** PUT /api/tutor-portal/dashboard/billing/auto-topup { enabled, pack }: turn automatic top-up on or off. Owners only:
 *  it lets a card be charged with nobody at the keyboard. */
import { NextResponse, type NextRequest } from 'next/server';
import { saveAutoTopUp } from '@/lib/tutor/partner-dashboard/billing';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  if (a.account.role !== 'owner') return json({ error: 'owner_only' }, 403);
  let body: { enabled?: unknown; pack?: unknown };
  try { body = (await req.json()) as { enabled?: unknown; pack?: unknown }; } catch { return json({ error: 'bad_request' }, 400); }
  const r = await saveAutoTopUp(a.account.partnerId, body, a.account.email);
  return r.ok ? json({ ok: true }) : json({ error: r.error }, 400);
}
