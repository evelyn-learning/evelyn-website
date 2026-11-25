import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EvelynWebhookError } from './errors.js';

/** The fields every webhook event has. `id` is the same on every retry of one event: use it to drop duplicates. */
interface WebhookEnvelope<Type extends string, Data> {
  /** The event's id. A retry of the same event carries the same id. */
  id: string;
  type: Type;
  /** When the event was made, as an ISO 8601 time. */
  created: string;
  partner_id: string;
  data: Data;
}

/** `session.ended`: sent once per session, when the session's end is saved. No transcript. */
export type SessionEndedWebhook = WebhookEnvelope<
  'session.ended',
  {
    session_id: string;
    student_id: string | null;
    started_at: string | null;
    ended_at: string | null;
    /** Active tutoring seconds. */
    duration_seconds: number;
    status: string;
    /** The lesson's languages, `['en']` for an English lesson. */
    languages: string[];
    subject: string | null;
    topic: string | null;
    input_mode: string;
    message_count: number;
  }
>;

/** What the two minute-pool events carry. */
export interface PoolWebhookData {
  cap_minutes: number;
  used_minutes: number;
  remaining_minutes: number;
}

/** `pool.low`: 80% of your tutoring minutes are used. */
export type PoolLowWebhook = WebhookEnvelope<'pool.low', PoolWebhookData>;

/** `pool.exhausted`: all of your tutoring minutes are used; sessions no longer start. */
export type PoolExhaustedWebhook = WebhookEnvelope<'pool.exhausted', PoolWebhookData>;

/** `webhook.test`: the dashboard's "send a test event" button. */
export type WebhookTestEvent = WebhookEnvelope<'webhook.test', { message: string }>;

/**
 * A verified webhook event. Switch on `type` to get the matching `data`. The service may add event types:
 * answer 2xx to a type you do not handle.
 */
export type WebhookEvent = SessionEndedWebhook | PoolLowWebhook | PoolExhaustedWebhook | WebhookTestEvent;

/** A request's headers: a Fetch `Headers`, or a plain object as Node and Express give (names in any case). */
export type WebhookHeaders = { get(name: string): string | null } | Record<string, string | string[] | undefined>;

/** One webhook request to check. */
export interface VerifyWebhookInput {
  /** The request body exactly as received, before any JSON parsing. */
  rawBody: string | Uint8Array;
  /** The request's headers. Or give `timestamp` and `signature` yourself. */
  headers?: WebhookHeaders;
  /** The `x-evelyn-timestamp` header, when `headers` is not given. */
  timestamp?: string;
  /** The `x-evelyn-signature` header, when `headers` is not given. */
  signature?: string;
  /** Your partner secret. While you rotate keys, give both the new and the old one. */
  secret: string | readonly string[];
  /** How old a request may be, in milliseconds. Default 300000 (5 minutes). */
  toleranceMs?: number;
  /** The current time in Unix milliseconds. Default: now. For tests. */
  now?: number;
}

function header(headers: WebhookHeaders | undefined, name: string): string | undefined {
  if (!headers) return undefined;
  if (typeof (headers as { get?: unknown }).get === 'function') return (headers as { get(n: string): string | null }).get(name) ?? undefined;
  for (const [key, value] of Object.entries(headers as Record<string, string | string[] | undefined>)) {
    if (key.toLowerCase() === name) return Array.isArray(value) ? value[0] : value;
  }
  return undefined;
}

/**
 * Checks that a webhook request came from the service and returns its event.
 *
 * The signature is the hex HMAC-SHA256, with your partner secret, of `<x-evelyn-timestamp>.<raw body>`.
 * It is compared in constant time, and a request older than `toleranceMs` is refused.
 *
 * @throws EvelynWebhookError with `reason` `malformed` (a header is missing or the body is not an event),
 *   `stale_timestamp`, or `bad_signature`.
 */
export function verifyWebhook(input: VerifyWebhookInput): WebhookEvent {
  const secrets = (typeof input.secret === 'string' ? [input.secret] : [...(input.secret ?? [])]).filter((s) => typeof s === 'string' && s !== '');
  if (secrets.length === 0) throw new TypeError('verifyWebhook needs your partner secret.');
  const timestamp = input.timestamp ?? header(input.headers, 'x-evelyn-timestamp');
  const signature = input.signature ?? header(input.headers, 'x-evelyn-signature');
  if (!timestamp || !signature) throw new EvelynWebhookError('malformed', 'The x-evelyn-timestamp or x-evelyn-signature header is missing.');
  if (!/^\d+$/.test(timestamp) || !/^[0-9a-f]{64}$/i.test(signature)) {
    throw new EvelynWebhookError('malformed', 'The timestamp must be Unix milliseconds and the signature 64 hex characters.');
  }
  if (typeof input.rawBody !== 'string' && !(input.rawBody instanceof Uint8Array)) {
    throw new EvelynWebhookError('malformed', 'The raw request body is needed, as a string or bytes, before any JSON parsing (in Express, use express.raw({ type: "application/json" })).');
  }
  if (Math.abs((input.now ?? Date.now()) - Number(timestamp)) > (input.toleranceMs ?? 300_000)) {
    throw new EvelynWebhookError('stale_timestamp', 'The request is older than the tolerance (or this machine\'s clock is wrong).');
  }
  const body = typeof input.rawBody === 'string' ? Buffer.from(input.rawBody, 'utf8') : Buffer.from(input.rawBody.buffer, input.rawBody.byteOffset, input.rawBody.byteLength);
  const given = Buffer.from(signature, 'hex');
  const matches = secrets.some((secret) => timingSafeEqual(given, createHmac('sha256', secret).update(`${timestamp}.`).update(body).digest()));
  if (!matches) throw new EvelynWebhookError('bad_signature', 'The signature does not match: the secret is not this partner\'s, or the body was changed before it was checked.');

  let event: unknown;
  try {
    event = JSON.parse(body.toString('utf8'));
  } catch {
    throw new EvelynWebhookError('malformed', 'The body is not JSON.');
  }
  const fields = event as Partial<Record<keyof WebhookEvent, unknown>> | null;
  if (!fields || typeof fields !== 'object' || typeof fields.id !== 'string' || typeof fields.type !== 'string' || !fields.data || typeof fields.data !== 'object') {
    throw new EvelynWebhookError('malformed', 'The body is not an event: id, type or data is missing.');
  }
  return event as WebhookEvent;
}

const MAX_BODY_BYTES = 1_000_000;

/** The raw body of a request: what a body parser left on `req.body` (bytes or a string), else the stream itself. */
async function readRawBody(req: IncomingMessage & { body?: unknown }): Promise<string | Uint8Array> {
  if (typeof req.body === 'string' || req.body instanceof Uint8Array) return req.body;
  if (req.body !== undefined && req.readableEnded) {
    throw new EvelynWebhookError('malformed', 'The body was parsed before the webhook handler saw it. Mount express.raw({ type: "application/json" }) on this route in place of express.json().');
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY_BYTES) throw new EvelynWebhookError('malformed', 'The body is larger than 1 MB.');
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

/**
 * A request handler for the webhook URL, for Node's `http` server and for Express.
 *
 * It verifies the request, awaits `onEvent`, and answers 200. A request that fails verification is answered
 * 401 (`bad_signature`) or 400 and `onEvent` is not called. If `onEvent` throws, the answer is 500 and the
 * service tries again (three tries in all, the same `event.id` each time). The service waits 6 seconds for
 * an answer, so do slow work after returning.
 *
 * In Express the route must see the raw body: `app.post('/hooks/evelyn', express.raw({ type: 'application/json' }), webhookHandler(secret, onEvent))`.
 */
export function webhookHandler(
  secret: string | readonly string[],
  onEvent: (event: WebhookEvent) => void | Promise<void>,
  options: { toleranceMs?: number } = {},
): (req: IncomingMessage & { body?: unknown }, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    const answer = (status: number, body: object): void => {
      res.writeHead(status, { 'content-type': 'application/json' }).end(JSON.stringify(body));
    };
    let event: WebhookEvent;
    try {
      event = verifyWebhook({ rawBody: await readRawBody(req), headers: req.headers, secret, toleranceMs: options.toleranceMs });
    } catch (err) {
      if (!(err instanceof EvelynWebhookError)) throw err;
      return answer(err.reason === 'bad_signature' ? 401 : 400, { error: err.reason });
    }
    try {
      await onEvent(event);
    } catch {
      return answer(500, { error: 'handler_failed' });
    }
    answer(200, { received: true });
  };
}
