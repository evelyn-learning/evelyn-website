/** POST /api/tutor-portal/dashboard/billing/checkout { pack }: start a Stripe checkout and answer with its URL. */
import { NextResponse, type NextRequest } from 'next/server';
import { billingEnv, mayBuy, startCheckout } from '@/lib/tutor/partner-dashboard/billing';
import { json, requestOrigin, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  const b = billingEnv();
  if (!b || !mayBuy(b, a.account.email)) return json({ error: 'not_on_sale' }, 403);
  let body: { pack?: unknown };
  try { body = (await req.json()) as { pack?: unknown }; } catch { return json({ error: 'bad_request' }, 400); }
  try {
    const r = await startCheckout(b, { packId: body.pack, partnerId: a.account.partnerId, email: a.account.email, company: a.account.company, origin: requestOrigin(req) });
    return r.ok ? json({ url: r.url }) : json({ error: r.error }, 400);
  } catch (err) {
    console.error('[partner-billing] checkout failed', a.account.partnerId, (err as Error)?.message);
    return json({ error: 'payment_unavailable' }, 502);
  }
}
