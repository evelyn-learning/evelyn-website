/** GET /api/tutor-portal/dashboard/billing: the packs on sale, whether this account can buy, and the partner's purchases. */
import { NextResponse, type NextRequest } from 'next/server';
import { MINUTE_PACKS, autoTopUpView, billingEnv, lapseExpiredMinutes, listPurchases, mayBuy, perMinute } from '@/lib/tutor/partner-dashboard/billing';
import { TEXT_MINUTE_RATE } from '@/lib/tutor/portal/partner-pool';
import { poolSummary } from '@/lib/tutor/partner-dashboard/data';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const a = await requireAccount(req);
  if (a instanceof NextResponse) return a;
  const b = billingEnv();
  await lapseExpiredMinutes(a.account.partnerId).catch(() => 0);
  const [pool, purchases, autoTopUp] = await Promise.all([poolSummary(a.account.partnerId), listPurchases(a.account.partnerId), autoTopUpView(a.account.partnerId)]);
  return json({
    onSale: mayBuy(b, a.account.email), testMode: !!b && !b.live,
    packs: MINUTE_PACKS.map((p) => ({ id: p.id, label: p.label, minutes: p.minutes, usd: p.usd, perMinute: perMinute(p) })),
    pool, purchases, canManage: purchases.length > 0 && !!b,
    autoTopUp, textMinuteRate: TEXT_MINUTE_RATE, packLifetimeMonths: 12, taxAtCheckout: !!b?.automaticTax,
  });
}
