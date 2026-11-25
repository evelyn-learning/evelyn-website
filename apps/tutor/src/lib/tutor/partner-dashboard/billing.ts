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

async function stripe<T>(b: BillingEnv, method: 'GET' | 'POST' | 'DELETE', path: string, form?: Form, idempotencyKey?: string): Promise<T> {
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
    // The card is kept on the partner's Stripe customer so that automatic top-up, if they turn it on, can use it.
    // Stripe's page says so to the buyer before they pay.
    'payment_intent_data[setup_future_usage]': 'off_session',
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

export interface PaidCheckout { sessionId: string; partnerId: string; packId: string; minutes: number; amountCents: number; currency: string; by?: string; livemode: boolean; kind?: 'checkout' | 'auto_topup'; paymentIntentId?: string; customerId?: string }

/** What a `checkout.session.completed` (or async payment succeeded) event credits, or null when it is not a paid
 *  pack of ours. The minutes come from the pack table by id, never from a number in the event. Pure. */
export function paidCheckoutFromEvent(event: unknown): PaidCheckout | null {
  const e = event as { type?: string; livemode?: boolean; data?: { object?: { id?: string; mode?: string; payment_status?: string; amount_total?: number; amount_subtotal?: number; currency?: string; metadata?: Record<string, string>; payment_intent?: string | null; customer?: string | null; status?: string; paid?: boolean; subtotal?: number; total?: number; amount_paid?: number } } } | null;
  if (e?.type === 'invoice.paid') return paidTopUpFromInvoice(e);
  if (!e || (e.type !== 'checkout.session.completed' && e.type !== 'checkout.session.async_payment_succeeded')) return null;
  const o = e.data?.object;
  if (!o?.id || o.mode !== 'payment' || o.payment_status !== 'paid') return null;
  const pack = packById(o.metadata?.pack_id);
  const partnerId = o.metadata?.partner_id;
  if (!pack || !partnerId || !/^[a-z0-9][a-z0-9-]{1,40}$/.test(partnerId)) return null;
  // The price paid must be the pack's (before tax): a session someone made by hand with our metadata buys nothing.
  if ((o.amount_subtotal ?? o.amount_total ?? 0) < pack.usd * 100 || (o.currency ?? 'usd') !== 'usd') return null;
  return { sessionId: o.id, partnerId, packId: pack.id, minutes: pack.minutes, amountCents: o.amount_total ?? pack.usd * 100, currency: o.currency ?? 'usd', by: o.metadata?.by, livemode: !!e.livemode, kind: 'checkout', ...(typeof o.payment_intent === 'string' ? { paymentIntentId: o.payment_intent } : {}), ...(typeof o.customer === 'string' ? { customerId: o.customer } : {}) };
}

/** An automatic top-up's paid invoice. Only an invoice we made for a top-up (its metadata says so): the invoice
 *  Stripe writes for an ordinary checkout is paid too, and that pack is credited from its checkout event. Pure. */
function paidTopUpFromInvoice(e: { livemode?: boolean; data?: { object?: { id?: string; status?: string; paid?: boolean; subtotal?: number; total?: number; amount_paid?: number; currency?: string; metadata?: Record<string, string> } } }): PaidCheckout | null {
  const o = e.data?.object;
  if (!o?.id || o.metadata?.kind !== 'auto_topup' || (o.status !== 'paid' && o.paid !== true)) return null;
  const pack = packById(o.metadata?.pack_id);
  const partnerId = o.metadata?.partner_id;
  if (!pack || !partnerId || !/^[a-z0-9][a-z0-9-]{1,40}$/.test(partnerId)) return null;
  if ((o.subtotal ?? o.total ?? 0) < pack.usd * 100 || (o.currency ?? 'usd') !== 'usd') return null;
  return { sessionId: o.id, partnerId, packId: pack.id, minutes: pack.minutes, amountCents: o.amount_paid ?? o.total ?? pack.usd * 100, currency: o.currency ?? 'usd', livemode: !!e.livemode, kind: 'auto_topup' };
}

/** Credit a paid pack once. The purchase row's unique checkout id decides: the second delivery of the same
 *  event finds the row and adds nothing. Returns whether minutes were added now. */
export async function creditPurchase(p: PaidCheckout): Promise<{ credited: boolean; reason?: 'duplicate' | 'no_partner' }> {
  await connectDB();
  if (!(await PartnerModel.exists({ _id: p.partnerId, kind: 'partner' }))) return { credited: false, reason: 'no_partner' };
  try {
    await PartnerPurchase.create({ partnerId: p.partnerId, stripeSessionId: p.sessionId, packId: p.packId, minutes: p.minutes, amountCents: p.amountCents, currency: p.currency, by: p.by, livemode: p.livemode, kind: p.kind ?? 'checkout' });
  } catch (err) {
    if ((err as { code?: number } | null)?.code !== 11000) throw err;
  }
  // The claim and the credit are one step each, in this order: a crash between them leaves a row with no
  // `creditedAt`, which the next delivery of the event (Stripe retries for days) picks up here.
  // Minutes that have already lapsed come off before new ones go on, so the new pack is never eaten by an old lapse.
  await lapseExpiredMinutes(p.partnerId).catch(() => 0);
  const now = new Date();
  const claimed = await PartnerPurchase.findOneAndUpdate({ stripeSessionId: p.sessionId, creditedAt: { $exists: false } }, { $set: { creditedAt: now, expiresAt: new Date(now.getTime() + PACK_LIFETIME_MS) } });
  if (!claimed) return { credited: false, reason: 'duplicate' };
  const ts = new Date().toISOString();
  await PartnerPoolModel.updateOne(
    { _id: p.partnerId },
    { $inc: { capSec: p.minutes * 60 }, $set: { updatedAt: ts }, $max: { sessionMaxSec: PAID_SESSION_MAX_SEC }, $unset: { 'alerts.pct80At': '', 'alerts.pct100At': '' }, $setOnInsert: { usedSec: 0 } },
    { upsert: true },
  );
  await PartnerModel.updateOne({ _id: p.partnerId }, { $set: { 'metering.plan': 'prepaid', updatedAt: ts } });
  if (p.kind === 'auto_topup') await PartnerSettings.updateOne({ _id: p.partnerId }, { $unset: { 'autoTopUp.pendingAt': '', 'autoTopUp.lastError': '' }, $set: { 'autoTopUp.lastAt': now } });
  invalidatePartner(p.partnerId);
  return { credited: true };
}

/** After a checkout, the card that paid becomes the customer's default for invoices: it is what an automatic
 *  top-up charges. Best effort: a failure here only means a top-up would find no card and say so. */
export async function rememberCard(b: BillingEnv, p: PaidCheckout): Promise<void> {
  if (!p.paymentIntentId || !p.customerId) return;
  const pi = await stripe<{ payment_method?: string | null }>(b, 'GET', `/payment_intents/${p.paymentIntentId}`);
  if (typeof pi.payment_method === 'string') await stripe(b, 'POST', `/customers/${p.customerId}`, { 'invoice_settings[default_payment_method]': pi.payment_method });
}

/** Minutes bought in a pack are good for twelve months from the day they are added (Praveen 2026-11-24). */
export const PACK_LIFETIME_MS = 365 * 24 * 60 * 60_000;

export interface Lot { id: string; sec: number; creditedAtMs: number; expiresAtMs: number | null; lapsed: boolean; lapsedSec: number }

/** Which packs have lapsed and how many unused seconds each takes off the pool. Minutes are used oldest first:
 *  the minutes that were never bought (the free sandbox minutes, minutes we added by hand) go first and never
 *  lapse, then each pack in the order it was bought. A pack whose lapse was already applied counts only for what
 *  was used of it. Pure. */
export function lapsePlan(pool: { capSec: number; usedSec: number }, lots: readonly Lot[], nowMs: number): Array<{ id: string; forfeitSec: number }> {
  const ordered = [...lots].sort((a, b) => a.creditedAtMs - b.creditedAtMs);
  const size = (l: Lot) => Math.max(0, l.sec - (l.lapsed ? l.lapsedSec : 0));
  const baseSec = Math.max(0, pool.capSec - ordered.reduce((n, l) => n + size(l), 0));
  let unallocated = Math.max(0, pool.usedSec - baseSec);
  const out: Array<{ id: string; forfeitSec: number }> = [];
  for (const l of ordered) {
    const usedOfLot = Math.min(size(l), unallocated);
    unallocated -= usedOfLot;
    if (!l.lapsed && l.expiresAtMs !== null && l.expiresAtMs <= nowMs) out.push({ id: l.id, forfeitSec: size(l) - usedOfLot });
  }
  return out;
}

/** Apply any lapse that is due for a partner. Each pack is claimed in one step before its seconds come off the
 *  pool, so two callers cannot take the same pack off twice. Returns the seconds taken off now. */
export async function lapseExpiredMinutes(partnerId: string, nowMs: number = Date.now()): Promise<number> {
  await connectDB();
  if (!(await PartnerPurchase.exists({ partnerId, creditedAt: { $exists: true }, expiredAt: { $exists: false }, expiresAt: { $lte: new Date(nowMs) } }))) return 0;
  const [pool, docs] = await Promise.all([
    PartnerPoolModel.findById(partnerId, { capSec: 1, usedSec: 1 }).lean<{ capSec?: number; usedSec?: number } | null>(),
    PartnerPurchase.find({ partnerId, creditedAt: { $exists: true } }).lean(),
  ]);
  if (!pool) return 0;
  const lots: Lot[] = docs.map((d) => ({ id: String(d._id), sec: d.minutes * 60, creditedAtMs: d.creditedAt!.getTime(), expiresAtMs: d.expiresAt ? d.expiresAt.getTime() : null, lapsed: !!d.expiredAt, lapsedSec: d.expiredSec ?? 0 }));
  let taken = 0;
  for (const step of lapsePlan({ capSec: pool.capSec ?? 0, usedSec: pool.usedSec ?? 0 }, lots, nowMs)) {
    const claimed = await PartnerPurchase.findOneAndUpdate({ _id: step.id, expiredAt: { $exists: false } }, { $set: { expiredAt: new Date(nowMs), expiredSec: step.forfeitSec } });
    if (!claimed || step.forfeitSec <= 0) continue;
    await PartnerPoolModel.updateOne({ _id: partnerId }, { $inc: { capSec: -step.forfeitSec }, $set: { updatedAt: new Date(nowMs).toISOString() } });
    taken += step.forfeitSec;
  }
  if (taken) console.log(`[partner-billing] ${partnerId}: ${Math.round(taken / 60)} unused minutes lapsed`);
  return taken;
}

/** The minutes-left line at which an automatic top-up buys: a tenth of the pack, and never under thirty minutes,
 *  so that a class in progress does not run dry while the charge clears. */
export function topUpLineSec(pack: MinutePack): number {
  return Math.max(30, pack.minutes / 10) * 60;
}

export interface AutoTopUpView { enabled: boolean; packId: string | null; lineMinutes: number | null; lastError: string | null; hasCard: boolean }

export async function autoTopUpView(partnerId: string): Promise<AutoTopUpView> {
  await connectDB();
  const s = await PartnerSettings.findById(partnerId, { autoTopUp: 1, stripeCustomerId: 1 }).lean<{ autoTopUp?: { enabled?: boolean; packId?: string; lastError?: string }; stripeCustomerId?: string } | null>();
  const pack = packById(s?.autoTopUp?.packId);
  return { enabled: !!s?.autoTopUp?.enabled && !!pack, packId: pack?.id ?? null, lineMinutes: pack ? topUpLineSec(pack) / 60 : null, lastError: s?.autoTopUp?.lastError ?? null, hasCard: !!s?.stripeCustomerId };
}

/** Turn automatic top-up on (with the pack to buy) or off. It can be turned on only after a first purchase:
 *  that is when the card was given, on Stripe's page, with the buyer told it would be kept. */
export async function saveAutoTopUp(partnerId: string, input: { enabled?: unknown; pack?: unknown }, by: string): Promise<{ ok: true } | { ok: false; error: 'unknown_pack' | 'no_card' }> {
  await connectDB();
  if (input.enabled !== true) {
    await PartnerSettings.updateOne({ _id: partnerId }, { $set: { 'autoTopUp.enabled': false, updatedAt: new Date(), updatedBy: by }, $unset: { 'autoTopUp.pendingAt': '' } }, { upsert: true });
    return { ok: true };
  }
  const pack = packById(input.pack);
  if (!pack) return { ok: false, error: 'unknown_pack' };
  if (!(await PartnerPurchase.exists({ partnerId, creditedAt: { $exists: true }, kind: { $ne: 'auto_topup' } }))) return { ok: false, error: 'no_card' };
  await PartnerSettings.updateOne({ _id: partnerId }, { $set: { 'autoTopUp.enabled': true, 'autoTopUp.packId': pack.id, updatedAt: new Date(), updatedBy: by }, $unset: { 'autoTopUp.lastError': '' } }, { upsert: true });
  return { ok: true };
}

/** Called after a session's time is charged: when the minutes left are at or under the line and top-up is on,
 *  charge the kept card for the pack through a Stripe invoice (so tax and a receipt are handled as at checkout).
 *  The minutes are added by the webhook when the invoice is paid, never here. One at a time: `pendingAt` is
 *  claimed in one step and held for an hour. A refused card turns top-up off and tells the caller, who tells
 *  the partner. Never throws. */
export async function maybeAutoTopUp(partnerId: string, remainingSec: number, env: NodeJS.ProcessEnv = process.env): Promise<'none' | 'started' | 'failed'> {
  try {
    const b = billingEnv(env);
    if (!b?.webhookSecret) return 'none';
    await connectDB();
    const s = await PartnerSettings.findById(partnerId, { autoTopUp: 1, stripeCustomerId: 1, stripeCustomerLive: 1 }).lean<{ autoTopUp?: { enabled?: boolean; packId?: string }; stripeCustomerId?: string; stripeCustomerLive?: boolean } | null>();
    const pack = packById(s?.autoTopUp?.packId);
    if (!s?.autoTopUp?.enabled || !pack || !s.stripeCustomerId || !!s.stripeCustomerLive !== b.live || remainingSec > topUpLineSec(pack)) return 'none';
    const now = new Date();
    const claimed = await PartnerSettings.findOneAndUpdate(
      { _id: partnerId, 'autoTopUp.enabled': true, $or: [{ 'autoTopUp.pendingAt': { $exists: false } }, { 'autoTopUp.pendingAt': { $lt: new Date(now.getTime() - 60 * 60_000) } }] },
      { $set: { 'autoTopUp.pendingAt': now } },
    );
    if (!claimed) return 'none';
    const key = `topup:${partnerId}:${now.getTime()}`;
    let invoiceId = '';
    try {
      const meta = { 'metadata[partner_id]': partnerId, 'metadata[pack_id]': pack.id, 'metadata[kind]': 'auto_topup' };
      const inv = await stripe<{ id: string }>(b, 'POST', '/invoices', { customer: s.stripeCustomerId, collection_method: 'charge_automatically', auto_advance: false, description: `Automatic top-up: ${pack.label} for ${partnerId}`, ...(b.automaticTax ? { 'automatic_tax[enabled]': true } : {}), ...meta }, `${key}:inv`);
      invoiceId = inv.id;
      await stripe(b, 'POST', '/invoiceitems', { customer: s.stripeCustomerId, invoice: inv.id, amount: pack.usd * 100, currency: 'usd', description: `Evelyn Voice Tutor: ${pack.label}` }, `${key}:item`);
      await stripe(b, 'POST', `/invoices/${inv.id}/finalize`, { auto_advance: false }, `${key}:fin`);
      await stripe(b, 'POST', `/invoices/${inv.id}/pay`, { off_session: true }, `${key}:pay`);
      console.log(`[partner-billing] auto top-up started for ${partnerId}: ${pack.id} (${inv.id})`);
      return 'started';
    } catch (err) {
      const message = (err as Error)?.message || 'payment failed';
      // The unpaid invoice is cancelled: left open, Stripe would try the card again later and add minutes the
      // partner has by then been told were not bought.
      if (invoiceId) await stripe(b, 'POST', `/invoices/${invoiceId}/void`).catch(() => stripe(b, 'DELETE', `/invoices/${invoiceId}`).catch(() => undefined));
      await PartnerSettings.updateOne({ _id: partnerId }, { $set: { 'autoTopUp.enabled': false, 'autoTopUp.lastError': message.slice(0, 200) }, $unset: { 'autoTopUp.pendingAt': '' } });
      console.warn(`[partner-billing] auto top-up failed for ${partnerId}:`, message);
      return 'failed';
    }
  } catch (err) {
    console.warn('[partner-billing] auto top-up unavailable', partnerId, (err as Error)?.message);
    return 'none';
  }
}

export interface PurchaseRow { at: string; pack: string; minutes: number; amount: number; currency: string; status: 'credited' | 'pending'; test: boolean; auto: boolean; expiresAt: string | null; lapsedMinutes: number | null }

export async function listPurchases(partnerId: string): Promise<PurchaseRow[]> {
  await connectDB();
  const docs = await PartnerPurchase.find({ partnerId }).sort({ createdAt: -1 }).limit(100).lean();
  return docs.map((d) => ({ at: d.createdAt.toISOString(), pack: packById(d.packId)?.label ?? d.packId, minutes: d.minutes, amount: d.amountCents / 100, currency: d.currency, status: d.creditedAt ? 'credited' : 'pending', test: !d.livemode, auto: d.kind === 'auto_topup', expiresAt: d.expiresAt ? d.expiresAt.toISOString() : null, lapsedMinutes: d.expiredAt ? Math.round((d.expiredSec ?? 0) / 6) / 10 : null }));
}

/** Stripe's own page for invoices, receipts and the billing address. Null when the partner has not bought yet. */
export async function billingPortalUrl(b: BillingEnv, partnerId: string, origin: string): Promise<string | null> {
  await connectDB();
  const s = await PartnerSettings.findById(partnerId, { stripeCustomerId: 1, stripeCustomerLive: 1 }).lean<{ stripeCustomerId?: string; stripeCustomerLive?: boolean } | null>();
  if (!s?.stripeCustomerId || !!s.stripeCustomerLive !== b.live) return null;
  const r = await stripe<{ url: string }>(b, 'POST', '/billing_portal/sessions', { customer: s.stripeCustomerId, return_url: `${origin}/dashboard/billing` });
  return r.url;
}
