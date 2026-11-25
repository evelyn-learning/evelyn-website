/**
 * GET /api/tutor-portal/dashboard/admin/partners: every partner (the owner's view, partner-dashboard/admin.ts).
 * POST { action: 'add_minutes' | 'suspend' | 'resume', partnerId, minutes? }.
 * For the accounts listed in PARTNER_DASHBOARD_ADMINS only; anyone else gets 404, as if the route were not there.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { adminPartnerRows, applyAdminAction, isDashboardAdmin, parseAdminAction } from '@/lib/tutor/partner-dashboard/admin';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const a = await requireAccount(req);
  if (a instanceof NextResponse) return a;
  if (!isDashboardAdmin(a.account.email)) return json({ error: 'not_found' }, 404);
  return json({ rows: await adminPartnerRows() });
}

export async function POST(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  if (!isDashboardAdmin(a.account.email)) return json({ error: 'not_found' }, 404);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: 'bad_request' }, 400); }
  const action = parseAdminAction(body);
  if (!action) return json({ error: 'bad_request' }, 400);
  const r = await applyAdminAction(action, a.account.email);
  return r.ok ? json({ ok: true }) : json({ error: r.error }, 404);
}
