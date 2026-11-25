/** POST /api/tutor-portal/dashboard/billing/portal: a link to Stripe's page for this partner's invoices and receipts. */
import { NextResponse, type NextRequest } from 'next/server';
import { billingEnv, billingPortalUrl } from '@/lib/tutor/partner-dashboard/billing';
import { json, requestOrigin, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  const b = billingEnv();
  if (!b) return json({ error: 'not_on_sale' }, 403);
  try {
    const url = await billingPortalUrl(b, a.account.partnerId, requestOrigin(req));
    return url ? json({ url }) : json({ error: 'no_purchases' }, 404);
  } catch (err) {
    console.error('[partner-billing] portal failed', a.account.partnerId, (err as Error)?.message);
    return json({ error: 'payment_unavailable' }, 502);
  }
}
