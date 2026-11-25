/**
 * Paying for minutes: prepaid packs bought by card through Stripe Checkout, credited to the partner's minute
 * pool when Stripe says the payment is paid (Praveen 2026-11-24: prepaid packs first; they are the pool we
 * already enforce, and nobody is ever owed money).
 *
 * No card detail touches our servers: the dashboard sends the buyer to Stripe's own page and Stripe calls
 * /api/tutor-portal/billing/stripe-webhook afterwards. The webhook is the only thing that credits minutes; the
 * page the buyer returns to only reads.
 *
 * Stripe is called over its REST API with fetch: three calls do not need an SDK. Keys: STRIPE_SECRET_KEY and
 * STRIPE_WEBHOOK_SECRET. With no secret key the billing page says packs are not on sale yet and nothing else
 * changes. A test-mode key (sk_test_) makes test purchases: real minutes are credited for them, so a test key
 * belongs on a test machine or behind PARTNER_BILLING_TEST_BUYERS (the emails allowed to buy in test mode).
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import connectDB from '@core/db';
import { PartnerModel } from '@/models/Partner';
import { PartnerPoolModel } from '@/models/PartnerPool';
import { PartnerPurchase } from '@/models/PartnerPurchase';
import { PartnerSettings } from '@/models/PartnerSettings';
import { invalidatePartner } from '@/lib/tutor/portal/registry';

export interface MinutePack { id: string; minutes: number; usd: number; label: string }

/** The packs on sale (Praveen 2026-11-24). The per-minute price falls with size from the published $0.20. */
export const MINUTE_PACKS: readonly MinutePack[] = [
  { id: 'pack_500', minutes: 500, usd: 100, label: '500 minutes' },
  { id: 'pack_2500', minutes: 2500, usd: 450, label: '2,500 minutes' },
  { id: 'pack_10000', minutes: 10000, usd: 1600, label: '10,000 minutes' },
];

/** A paying partner's sessions may run this long (the sandbox ends them at 15 minutes). */
export const PAID_SESSION_MAX_SEC = 60 * 60;

export const packById = (id: unknown): MinutePack | null => MINUTE_PACKS.find((p) => p.id === id) ?? null;
export const perMinute = (p: MinutePack): number => Math.round((p.usd / p.minutes) * 1000) / 1000;

export interface BillingEnv { secretKey: string; webhookSecret: string; live: boolean; testBuyers: Set<string>; automaticTax: boolean }

export function billingEnv(env: NodeJS.ProcessEnv = process.env): BillingEnv | null {
  const secretKey = (env.STRIPE_SECRET_KEY || '').trim();
  if (!/^(?:sk|rk)_(?:test|live)_/.test(secretKey)) return null;
  return {
    secretKey, webhookSecret: (env.STRIPE_WEBHOOK_SECRET || '').trim(), live: /^(?:sk|rk)_live_/.test(secretKey),
    testBuyers: new Set((env.PARTNER_BILLING_TEST_BUYERS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)),
    automaticTax: env.STRIPE_AUTOMATIC_TAX === 'on',
  };
}

/** Whether this account may start a checkout: anyone in live mode; in test mode only the listed test buyers,
 *  because a test card pays nothing and the minutes it buys are real. */
export function mayBuy(b: BillingEnv | null, email: string): boolean {
  return !!b && !!b.webhookSecret && (b.live || b.testBuyers.has(email.toLowerCase()));
}

type Form = Record<string, string | number | boolean | undefined>;

async function stripe<T>(b: BillingEnv, method: 'GET' | 'POST', path: string, form?: Form, idempotencyKey?: string): Promise<T> {
  const body = form ? new URLSearchParams(Object.entries(form).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : undefined;
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method, body, signal: AbortSignal.timeout(20_000),
    headers: { Authorization: `Bearer ${b.secretKey}`, ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}), ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) },
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: { message?: string; code?: string } };
  if (!res.ok) throw new Error(`stripe ${path}: ${res.status} ${json.error?.code || ''} ${json.error?.message || ''}`.trim());
  return json;
}

/** The form fields of a checkout for one pack. Pure: the test reads exactly what Stripe is asked for. */
export function checkoutForm(input: { pack: MinutePack; partnerId: string; email: string; customerId: string; origin: string; automaticTax: boolean }): Form {
  const { pack, partnerId, email, customerId, origin } = input;
  return {
    mode: 'payment',
    // Card only: pay-later and bank methods settle days later or can be reversed, and the minutes are usable at once.
    'allowed_payment_method_types[0]': 'card',
    customer: customerId,
    client_reference_id: partnerId,
    'line_items[0][quantity]': 1,
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': pack.usd * 100,
    'line_items[0][price_data][product_data][name]': `Evelyn Voice Tutor: ${pack.label}`,
    'line_items[0][price_data][product_data][description]': `${pack.minutes.toLocaleString('en-US')} prepaid tutoring minutes for partner ${partnerId}.`,
    'metadata[partner_id]': partnerId,
    'metadata[pack_id]': pack.id,
    'metadata[minutes]': pack.minutes,
    'metadata[by]': email,
    'payment_intent_data[description]': `${pack.label} for ${partnerId}`,
    'payment_intent_data[metadata][partner_id]': partnerId,
    'invoice_creation[enabled]': true,
    billing_address_collection: 'required',
    'customer_update[address]': 'auto',
    'customer_update[name]': 'auto',
    'tax_id_collection[enabled]': true,
    ...(input.automaticTax ? { 'automatic_tax[enabled]': true } : {}),
    success_url: `${origin}/dashboard/billing?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/billing?cancelled=1`,
  };
}

/** Start a checkout for a pack and return Stripe's page to send the buyer to. */
export async function startCheckout(b: BillingEnv, input: { packId: unknown; partnerId: string; email: string; company: string; origin: string }): Promise<{ ok: true; url: string } | { ok: false; error: 'unknown_pack' }> {
  const pack = packById(input.packId);
  if (!pack) return { ok: false, error: 'unknown_pack' };
  await connectDB();
  const s = await PartnerSettings.findById(input.partnerId, { stripeCustomerId: 1, stripeCustomerLive: 1 }).lean<{ stripeCustomerId?: string; stripeCustomerLive?: boolean } | null>();
  let customerId = s?.stripeCustomerId && !!s.stripeCustomerLive === b.live ? s.stripeCustomerId : '';
  if (!customerId) {
    const c = await stripe<{ id: string }>(b, 'POST', '/customers', { email: input.email, name: input.company || input.partnerId, 'metadata[partner_id]': input.partnerId }, `customer:${input.partnerId}:${b.live ? 'live' : 'test'}`);
    customerId = c.id;
    await PartnerSettings.updateOne({ _id: input.partnerId }, { $set: { stripeCustomerId: customerId, stripeCustomerLive: b.live, updatedAt: new Date() } }, { upsert: true });
  }
  const session = await stripe<{ id: string; url: string }>(b, 'POST', '/checkout/sessions', checkoutForm({ pack, partnerId: input.partnerId, email: input.email, customerId, origin: input.origin, automaticTax: b.automaticTax }));
  return { ok: true, url: session.url };
}

/** Stripe's webhook signature (`Stripe-Signature: t=…,v1=…`): HMAC-SHA256 of `${t}.${rawBody}`, within five
 *  minutes. Pure. */
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string, nowMs: number = Date.now(), toleranceSec = 300): boolean {
  if (!header || !secret) return false;
  const parts = header.split(',').map((p) => p.trim().split('='));
  const t = parts.find(([k]) => k === 't')?.[1];
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v ?? '');
  if (!t || !/^\d+$/.test(t) || !sigs.length || Math.abs(nowMs / 1000 - Number(t)) > toleranceSec) return false;
  const want = Buffer.from(createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex'));
  return sigs.some((s) => { const got = Buffer.from(s); return got.length === want.length && timingSafeEqual(got, want); });
}

export interface PaidCheckout { sessionId: string; partnerId: string; packId: string; minutes: number; amountCents: number; currency: string; by?: string; livemode: boolean }

/** What a `checkout.session.completed` (or async payment succeeded) event credits, or null when it is not a paid
 *  pack of ours. The minutes come from the pack table by id, never from a number in the event. Pure. */
export function paidCheckoutFromEvent(event: unknown): PaidCheckout | null {
  const e = event as { type?: string; livemode?: boolean; data?: { object?: { id?: string; mode?: string; payment_status?: string; amount_total?: number; amount_subtotal?: number; currency?: string; metadata?: Record<string, string> } } } | null;
  if (!e || (e.type !== 'checkout.session.completed' && e.type !== 'checkout.session.async_payment_succeeded')) return null;
  const o = e.data?.object;
  if (!o?.id || o.mode !== 'payment' || o.payment_status !== 'paid') return null;
  const pack = packById(o.metadata?.pack_id);
  const partnerId = o.metadata?.partner_id;
  if (!pack || !partnerId || !/^[a-z0-9][a-z0-9-]{1,40}$/.test(partnerId)) return null;
  // The price paid must be the pack's (before tax): a session someone made by hand with our metadata buys nothing.
  if ((o.amount_subtotal ?? o.amount_total ?? 0) < pack.usd * 100 || (o.currency ?? 'usd') !== 'usd') return null;
  return { sessionId: o.id, partnerId, packId: pack.id, minutes: pack.minutes, amountCents: o.amount_total ?? pack.usd * 100, currency: o.currency ?? 'usd', by: o.metadata?.by, livemode: !!e.livemode };
}

/** Credit a paid pack once. The purchase row's unique checkout id decides: the second delivery of the same
 *  event finds the row and adds nothing. Returns whether minutes were added now. */
export async function creditPurchase(p: PaidCheckout): Promise<{ credited: boolean; reason?: 'duplicate' | 'no_partner' }> {
  await connectDB();
  if (!(await PartnerModel.exists({ _id: p.partnerId, kind: 'partner' }))) return { credited: false, reason: 'no_partner' };
  try {
    await PartnerPurchase.create({ partnerId: p.partnerId, stripeSessionId: p.sessionId, packId: p.packId, minutes: p.minutes, amountCents: p.amountCents, currency: p.currency, by: p.by, livemode: p.livemode });
  } catch (err) {
    if ((err as { code?: number } | null)?.code !== 11000) throw err;
  }
  // The claim and the credit are one step each, in this order: a crash between them leaves a row with no
  // `creditedAt`, which the next delivery of the event (Stripe retries for days) picks up here.
  const claimed = await PartnerPurchase.findOneAndUpdate({ stripeSessionId: p.sessionId, creditedAt: { $exists: false } }, { $set: { creditedAt: new Date() } });
  if (!claimed) return { credited: false, reason: 'duplicate' };
  const ts = new Date().toISOString();
  await PartnerPoolModel.updateOne(
    { _id: p.partnerId },
    { $inc: { capSec: p.minutes * 60 }, $set: { updatedAt: ts }, $max: { sessionMaxSec: PAID_SESSION_MAX_SEC }, $unset: { 'alerts.pct80At': '', 'alerts.pct100At': '' }, $setOnInsert: { usedSec: 0 } },
    { upsert: true },
  );
  await PartnerModel.updateOne({ _id: p.partnerId }, { $set: { 'metering.plan': 'prepaid', updatedAt: ts } });
  invalidatePartner(p.partnerId);
  return { credited: true };
}

export interface PurchaseRow { at: string; pack: string; minutes: number; amount: number; currency: string; status: 'credited' | 'pending'; test: boolean }

export async function listPurchases(partnerId: string): Promise<PurchaseRow[]> {
  await connectDB();
  const docs = await PartnerPurchase.find({ partnerId }).sort({ createdAt: -1 }).limit(100).lean();
  return docs.map((d) => ({ at: d.createdAt.toISOString(), pack: packById(d.packId)?.label ?? d.packId, minutes: d.minutes, amount: d.amountCents / 100, currency: d.currency, status: d.creditedAt ? 'credited' : 'pending', test: !d.livemode }));
}

/** Stripe's own page for invoices, receipts and the billing address. Null when the partner has not bought yet. */
export async function billingPortalUrl(b: BillingEnv, partnerId: string, origin: string): Promise<string | null> {
  await connectDB();
  const s = await PartnerSettings.findById(partnerId, { stripeCustomerId: 1, stripeCustomerLive: 1 }).lean<{ stripeCustomerId?: string; stripeCustomerLive?: boolean } | null>();
  if (!s?.stripeCustomerId || !!s.stripeCustomerLive !== b.live) return null;
  const r = await stripe<{ url: string }>(b, 'POST', '/billing_portal/sessions', { customer: s.stripeCustomerId, return_url: `${origin}/dashboard/billing` });
  return r.url;
}
