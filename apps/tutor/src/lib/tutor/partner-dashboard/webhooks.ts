/**
 * Webhooks: when something happens on a partner's account, their server is told by an HTTPS POST.
 *
 * Until 2026-11-24 the only events were the session page's browser messages (evelyn:session_ended), which a
 * partner's server never sees and a closed tab never sends. A webhook is sent from our server when the
 * session's end is saved.
 *
 * Events: `session.ended` (once per session), `pool.low` and `pool.exhausted` (the 80% and 100% lines of the
 * minute pool), `webhook.test` (the dashboard's button).
 *
 * The request: POST, JSON body `{ id, type, created, partner_id, data }`, and three headers the receiver checks:
 *   x-evelyn-event, x-evelyn-timestamp (Unix ms), x-evelyn-signature = hex HMAC-SHA256 of `${timestamp}.${body}`
 * with the partner's current secret: the same secret and the same construction idea as the partner API, so a
 * partner has one thing to keep and one way to verify.
 *
 * A URL is the partner's to choose, so it is treated as hostile: HTTPS only, no credentials in it, the host
 * must resolve only to public addresses (checked at save and again before every send), redirects are not
 * followed, and the answer's body is never read. Three tries (at once, after 3 s, after 15 s) inside the
 * process that saved the session; a restart in that window loses the retries, and the delivery log shows it.
 */
import { createHmac, randomUUID } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import connectDB, { isDBConfigured } from '@core/db';
import { PartnerSettings } from '@/models/PartnerSettings';
import { PartnerWebhookDelivery } from '@/models/PartnerWebhookDelivery';
import { TutorSession } from '@/models/TutorSession';
import { resolvePartnerTokenSecrets } from '@/lib/tutor/portal/partner-token-secrets';
import { sessionActiveSeconds } from '@/lib/tutor/recordings/active-seconds';

export type WebhookEventType = 'session.ended' | 'pool.low' | 'pool.exhausted' | 'webhook.test';
export const WEBHOOK_RETRY_DELAYS_MS = [0, 3000, 15000] as const;
const TIMEOUT_MS = 6000;

/** An address a partner's webhook may not point at: loopback, private, link-local, carrier-grade NAT, multicast,
 *  unspecified, and the IPv6 forms of the same (mapped IPv4 included). Pure. */
export function isPrivateAddress(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const [a, b] = ip.split('.').map(Number) as [number, number];
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19)) || a >= 224;
  }
  if (v === 6) {
    const x = ip.toLowerCase();
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(x);
    if (mapped) return isPrivateAddress(mapped[1]!);
    return x === '::' || x === '::1' || x.startsWith('fc') || x.startsWith('fd') || x.startsWith('fe8') || x.startsWith('fe9') || x.startsWith('fea') || x.startsWith('feb') || x.startsWith('ff') || x.startsWith('::ffff:') || x.startsWith('64:ff9b:');
  }
  return true;
}

export type UrlVerdict = { ok: true; url: string } | { ok: false; error: 'invalid_url' | 'https_only' | 'no_credentials' | 'bad_port' | 'private_host' };

/** The shape of a webhook URL, before any DNS: HTTPS, a real host name, port 443 or 8443, nothing secret in it. Pure. */
export function checkWebhookUrlShape(raw: unknown): UrlVerdict {
  if (typeof raw !== 'string' || raw.length > 500) return { ok: false, error: 'invalid_url' };
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return { ok: false, error: 'invalid_url' }; }
  if (u.protocol !== 'https:') return { ok: false, error: 'https_only' };
  if (u.username || u.password) return { ok: false, error: 'no_credentials' };
  if (u.port && u.port !== '443' && u.port !== '8443') return { ok: false, error: 'bad_port' };
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (isIP(host) ? isPrivateAddress(host) : (!host.includes('.') || /(?:^|\.)(?:localhost|local|internal|lan|home|corp)$/i.test(host))) return { ok: false, error: 'private_host' };
  u.hash = '';
  return { ok: true, url: u.toString() };
}

/** Shape, then every address the host resolves to must be public. */
export async function checkWebhookUrl(raw: unknown, resolve: (host: string) => Promise<string[]> = async (h) => (await lookup(h, { all: true })).map((a) => a.address)): Promise<UrlVerdict> {
  const shape = checkWebhookUrlShape(raw);
  if (!shape.ok) return shape;
  const host = new URL(shape.url).hostname.replace(/^\[|\]$/g, '');
  if (isIP(host)) return shape;
  try {
    const addrs = await resolve(host);
    if (!addrs.length || addrs.some(isPrivateAddress)) return { ok: false, error: 'private_host' };
  } catch { return { ok: false, error: 'invalid_url' }; }
  return shape;
}

export function signWebhook(secret: string, timestampMs: number, body: string): string {
  return createHmac('sha256', secret).update(`${timestampMs}.${body}`).digest('hex');
}

export function webhookBody(partnerId: string, type: WebhookEventType, data: Record<string, unknown>, nowMs: number, id: string = randomUUID()): string {
  return JSON.stringify({ id, type, created: new Date(nowMs).toISOString(), partner_id: partnerId, data });
}

export function webhooksOn(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.PARTNER_WEBHOOKS !== 'off';
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Send one event, with retries, and keep the log line up to date. Returns the last attempt's outcome. */
async function send(partnerId: string, url: string, type: WebhookEventType, key: string, data: Record<string, unknown>): Promise<{ ok: boolean; status: number; error?: string }> {
  const secrets = await resolvePartnerTokenSecrets(partnerId);
  if (!secrets.length) return { ok: false, status: 0, error: 'no_secret' };
  let last: { ok: boolean; status: number; error?: string; ms?: number } = { ok: false, status: 0, error: 'not_sent' };
  // One event, one id and one body, however many tries: the receiver tells a retry from a new event by the id.
  const body = webhookBody(partnerId, type, data, Date.now());
  for (let k = 0; k < WEBHOOK_RETRY_DELAYS_MS.length; k++) {
    if (WEBHOOK_RETRY_DELAYS_MS[k]) await wait(WEBHOOK_RETRY_DELAYS_MS[k]!);
    const started = Date.now();
    const safe = await checkWebhookUrl(url);
    if (!safe.ok) { last = { ok: false, status: 0, error: safe.error }; break; }
    try {
      const res = await fetch(safe.url, {
        method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS), body,
        headers: { 'content-type': 'application/json', 'user-agent': 'EvelynTutor-Webhook/1', 'x-evelyn-event': type, 'x-evelyn-timestamp': String(started), 'x-evelyn-signature': signWebhook(secrets[0]!, started, body) },
      });
      void res.body?.cancel().catch(() => undefined);
      last = { ok: res.status >= 200 && res.status < 300, status: res.status, ms: Date.now() - started, ...(res.status >= 300 && res.status < 400 ? { error: 'redirect_not_followed' } : {}) };
    } catch (err) {
      last = { ok: false, status: 0, ms: Date.now() - started, error: (err as Error)?.name === 'TimeoutError' ? 'timeout' : 'unreachable' };
    }
    await PartnerWebhookDelivery.updateOne({ partnerId, event: type, key }, { $set: { attempts: k + 1, status: last.status, ok: last.ok, ms: last.ms, ...(last.error ? { error: last.error } : {}) }, ...(last.error ? {} : { $unset: { error: '' } }) }).catch(() => undefined);
    // A 4xx is the receiver saying no: the same request again gets the same answer.
    if (last.ok || (last.status >= 400 && last.status < 500 && last.status !== 408 && last.status !== 429)) break;
  }
  return last;
}

/** Queue one event for a partner, once per `key`. Resolves when the log line exists; the sending goes on after. */
export async function emitWebhook(partnerId: string, type: WebhookEventType, key: string, data: Record<string, unknown> | (() => Promise<Record<string, unknown> | null>)): Promise<'sent' | 'no_webhook' | 'duplicate' | 'off'> {
  if (!webhooksOn() || !isDBConfigured() || !partnerId) return 'off';
  await connectDB();
  const settings = await PartnerSettings.findById(partnerId, { webhookUrl: 1 }).lean<{ webhookUrl?: string } | null>();
  if (!settings?.webhookUrl) return 'no_webhook';
  try {
    await PartnerWebhookDelivery.create({ partnerId, event: type, key, url: settings.webhookUrl, at: new Date() });
  } catch (err) {
    if ((err as { code?: number } | null)?.code === 11000) return 'duplicate';
    throw err;
  }
  void (async () => {
    try {
      const payload = typeof data === 'function' ? await data() : data;
      if (payload) await send(partnerId, settings.webhookUrl!, type, key, payload);
    } catch (err) { console.warn('[partner-webhook] send failed', partnerId, type, (err as Error)?.message); }
  })();
  return 'sent';
}

/** What `session.ended` carries: the session's facts as saved. No transcript: that is fetched with the API or seen in the replay. */
export async function sessionEndedData(partnerId: string, sessionId: string): Promise<Record<string, unknown> | null> {
  const d = await TutorSession.findOne({ sessionId, sourcePartnerId: partnerId }, { studentId: 1, startedAt: 1, endedAt: 1, duration: 1, attemptSpans: 1, status: 1, tutorLanguages: 1, subject: 1, topic: 1, inputMode: 1, messageCount: 1 })
    .lean<{ studentId?: string; startedAt?: Date; endedAt?: Date; duration?: number; attemptSpans?: unknown; status?: string; tutorLanguages?: string[]; subject?: string; topic?: string; inputMode?: string; messageCount?: number } | null>();
  if (!d) return null;
  return {
    session_id: sessionId, student_id: d.studentId ?? null, started_at: d.startedAt?.toISOString() ?? null, ended_at: d.endedAt?.toISOString() ?? null,
    duration_seconds: Math.round(sessionActiveSeconds(d) ?? 0), status: d.status ?? 'completed', languages: d.tutorLanguages?.length ? d.tutorLanguages : ['en'],
    subject: d.subject ?? null, topic: d.topic ?? null, input_mode: d.inputMode ?? 'voice', message_count: d.messageCount ?? 0,
  };
}

/** The session-usage route's call when a session's end is saved. Never throws. */
export function notifySessionEnded(partnerId: string, sessionId: string): void {
  void emitWebhook(partnerId, 'session.ended', sessionId, () => sessionEndedData(partnerId, sessionId)).catch(() => undefined);
}

/** The pool's 80% and 100% lines. The key carries the pool's cap, so a top-up lets the next crossing be told. */
export function notifyPoolLine(partnerId: string, which: 'pct80' | 'pct100', usedSec: number, capSec: number): void {
  const data = { cap_minutes: Math.round(capSec / 6) / 10, used_minutes: Math.round(usedSec / 6) / 10, remaining_minutes: Math.round(Math.max(0, capSec - usedSec) / 6) / 10 };
  void emitWebhook(partnerId, which === 'pct100' ? 'pool.exhausted' : 'pool.low', `${which}:${capSec}`, data).catch(() => undefined);
}

export interface WebhookSettingsView { url: string | null; deliveries: Array<{ at: string; event: string; status: number; ok: boolean; attempts: number; error: string | null; ms: number | null }> }

export async function webhookSettings(partnerId: string): Promise<WebhookSettingsView> {
  await connectDB();
  const [s, rows] = await Promise.all([
    PartnerSettings.findById(partnerId, { webhookUrl: 1 }).lean<{ webhookUrl?: string } | null>(),
    PartnerWebhookDelivery.find({ partnerId }).sort({ at: -1 }).limit(50).lean(),
  ]);
  return { url: s?.webhookUrl ?? null, deliveries: rows.map((r) => ({ at: r.at.toISOString(), event: r.event, status: r.status, ok: r.ok, attempts: r.attempts, error: r.error ?? null, ms: r.ms ?? null })) };
}

/** Save (or with an empty value, remove) the partner's webhook URL. */
export async function saveWebhookUrl(partnerId: string, raw: unknown, by: string): Promise<{ ok: true; url: string | null } | { ok: false; error: string }> {
  await connectDB();
  if (raw === null || raw === '') {
    await PartnerSettings.updateOne({ _id: partnerId }, { $unset: { webhookUrl: '' }, $set: { updatedAt: new Date(), updatedBy: by } }, { upsert: true });
    return { ok: true, url: null };
  }
  const v = await checkWebhookUrl(raw);
  if (!v.ok) return v;
  await PartnerSettings.updateOne({ _id: partnerId }, { $set: { webhookUrl: v.url, updatedAt: new Date(), updatedBy: by } }, { upsert: true });
  return { ok: true, url: v.url };
}

/** The dashboard's "send a test event": waits for the outcome so the page can show it. */
export async function sendTestWebhook(partnerId: string): Promise<{ ok: boolean; status: number; error?: string } | { ok: false; status: 0; error: 'no_webhook' }> {
  await connectDB();
  const s = await PartnerSettings.findById(partnerId, { webhookUrl: 1 }).lean<{ webhookUrl?: string } | null>();
  if (!s?.webhookUrl) return { ok: false, status: 0, error: 'no_webhook' };
  const key = `test:${Date.now()}`;
  await PartnerWebhookDelivery.create({ partnerId, event: 'webhook.test', key, url: s.webhookUrl, at: new Date() });
  const secrets = await resolvePartnerTokenSecrets(partnerId);
  if (!secrets.length) return { ok: false, status: 0, error: 'no_secret' };
  // One try only: a person is waiting on the button.
  const started = Date.now();
  const safe = await checkWebhookUrl(s.webhookUrl);
  let out: { ok: boolean; status: number; error?: string };
  if (!safe.ok) out = { ok: false, status: 0, error: safe.error };
  else {
    const body = webhookBody(partnerId, 'webhook.test', { message: 'This is a test event from your Evelyn Voice Tutor dashboard.' }, started);
    try {
      const res = await fetch(safe.url, { method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS), body, headers: { 'content-type': 'application/json', 'user-agent': 'EvelynTutor-Webhook/1', 'x-evelyn-event': 'webhook.test', 'x-evelyn-timestamp': String(started), 'x-evelyn-signature': signWebhook(secrets[0]!, started, body) } });
      void res.body?.cancel().catch(() => undefined);
      out = { ok: res.status >= 200 && res.status < 300, status: res.status, ...(res.status >= 300 && res.status < 400 ? { error: 'redirect_not_followed' } : {}) };
    } catch (err) { out = { ok: false, status: 0, error: (err as Error)?.name === 'TimeoutError' ? 'timeout' : 'unreachable' }; }
  }
  await PartnerWebhookDelivery.updateOne({ partnerId, event: 'webhook.test', key }, { $set: { attempts: 1, status: out.status, ok: out.ok, ms: Date.now() - started, ...(out.error ? { error: out.error } : {}) } }).catch(() => undefined);
  return out;
}
