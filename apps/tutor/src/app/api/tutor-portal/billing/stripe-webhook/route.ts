/**
 * POST /api/tutor-portal/billing/stripe-webhook: Stripe tells us a checkout was paid, and the pack's minutes
 * are added to the partner's pool (partner-dashboard/billing.ts). The only caller is Stripe: the signature on
 * the raw body is the whole of the authentication, so the body is read as text and never re-serialised.
 *
 * Answers 200 for every event it understood or does not care about (Stripe retries anything else for days),
 * and 500 when a credit could not be written, so that Stripe sends the event again.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { billingEnv, creditPurchase, paidCheckoutFromEvent, verifyStripeSignature } from '@/lib/tutor/partner-dashboard/billing';
import { dashboardOwnerEmail, sendDashboardMail } from '@/lib/tutor/partner-dashboard/mailer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const b = billingEnv();
  if (!b?.webhookSecret) return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get('stripe-signature'), b.webhookSecret)) return NextResponse.json({ error: 'bad_signature' }, { status: 400 });
  let event: unknown;
  try { event = JSON.parse(raw); } catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }
  const paid = paidCheckoutFromEvent(event);
  if (!paid) return NextResponse.json({ received: true });
  // A live server credits live payments only, and a test server test payments only.
  if (paid.livemode !== b.live) return NextResponse.json({ received: true, ignored: 'mode' });
  try {
    const r = await creditPurchase(paid);
    if (r.credited) {
      console.log(`[partner-billing] credited ${paid.minutes} min to ${paid.partnerId} (${paid.sessionId}${paid.livemode ? '' : ', test mode'})`);
      void sendDashboardMail({
        to: dashboardOwnerEmail(), ...(paid.by ? { replyTo: paid.by } : {}),
        subject: `Purchase${paid.livemode ? '' : ' (test mode)'}: ${paid.partnerId} bought ${paid.minutes.toLocaleString('en-US')} minutes`,
        text: `Partner: ${paid.partnerId}\nPack: ${paid.packId}\nMinutes: ${paid.minutes}\nPaid: ${(paid.amountCents / 100).toFixed(2)} ${paid.currency.toUpperCase()}\nBy: ${paid.by || 'unknown'}\nStripe checkout: ${paid.sessionId}\n`,
        html: `<h2>Minute pack purchased${paid.livemode ? '' : ' (test mode)'}</h2><p>Partner: ${paid.partnerId}<br>Pack: ${paid.packId}<br>Minutes: ${paid.minutes}<br>Paid: ${(paid.amountCents / 100).toFixed(2)} ${paid.currency.toUpperCase()}<br>Stripe checkout: ${paid.sessionId}</p>`,
      }).catch(() => false);
    }
    return NextResponse.json({ received: true, credited: r.credited });
  } catch (err) {
    console.error('[partner-billing] credit failed', paid.partnerId, paid.sessionId, (err as Error)?.message);
    return NextResponse.json({ error: 'credit_failed' }, { status: 500 });
  }
}
