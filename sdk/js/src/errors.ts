/** Where a developer gets a partner id and secret. */
export const SANDBOX_URL = 'https://tutor.evelynlearning.com/sandbox';

/** Where the keys, minutes used and session replays are shown after sign-up. */
export const DASHBOARD_URL = 'https://tutor.evelynlearning.com/dashboard';

/**
 * A setup problem on the caller's side: a missing key, a claim the service would refuse, an unreadable file.
 * The message says what to change.
 */
export class EvelynConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvelynConfigError';
  }
}

/** The API answered with a status outside 200–299. */
export class EvelynApiError extends Error {
  /** HTTP status of the response. */
  readonly status: number;
  /** The response's `error` field (for example `unauthorized`, `bad_request`, `not_found`), or `http_<status>`. */
  readonly code: string;
  /** The response's `reason` or `message` field when it has one (for example `bad_signature`). */
  readonly reason: string | undefined;
  /** The parsed JSON body, or the raw text when the body was not JSON. */
  readonly body: unknown;

  constructor(status: number, body: unknown, request: string) {
    const fields = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const code = typeof fields.error === 'string' ? fields.error : `http_${status}`;
    const reason = typeof fields.reason === 'string' ? fields.reason : typeof fields.message === 'string' ? fields.message : undefined;
    super(`Evelyn API ${request} failed: ${status} ${code}${reason ? ` (${reason})` : ''}`);
    this.name = 'EvelynApiError';
    this.status = status;
    this.code = code;
    this.reason = reason;
    this.body = body;
  }
}

/** Why a webhook request was refused. */
export type WebhookErrorReason = 'bad_signature' | 'stale_timestamp' | 'malformed';

/** A webhook request that did not pass verification. Answer it with a 4xx status and do not act on it. */
export class EvelynWebhookError extends Error {
  /** `bad_signature`, `stale_timestamp` or `malformed`. */
  readonly reason: WebhookErrorReason;

  constructor(reason: WebhookErrorReason, message: string) {
    super(`Webhook refused (${reason}): ${message}`);
    this.name = 'EvelynWebhookError';
    this.reason = reason;
  }
}

const API_FIXES: Record<string, string> = {
  missing_auth_headers: 'The request reached the API without its three x-evelyn-* headers. A proxy between you and the API may be removing them.',
  unknown_partner: `The partner id is not recognised. Compare EVELYN_PARTNER_ID with the one on ${DASHBOARD_URL}.`,
  bad_signature: `The signature did not match. EVELYN_PARTNER_SECRET is not the secret of this partner id; copy it again from ${DASHBOARD_URL}.`,
  bad_timestamp: 'The x-evelyn-timestamp header was not a number. It must be Unix time in milliseconds.',
  stale_timestamp: "This machine's clock is more than 5 minutes away from the API's. Set the system clock and try again.",
  partner_suspended: 'This partner account is suspended. Write to info@evelynlearning.com.',
  partner_cannot_authenticate: 'This partner id cannot call the API. Write to info@evelynlearning.com.',
  endpoint_not_allowed: 'This endpoint is not enabled for your partner account. Write to info@evelynlearning.com to have it enabled.',
};

/**
 * One plain-English line for any error this package can raise or receive: what went wrong and what to change.
 * Used by the command line and the MCP server so both give the same advice.
 */
export function explainError(err: unknown): string {
  if (err instanceof EvelynApiError) {
    const fix = (err.reason && API_FIXES[err.reason]) || (err.status === 429 ? 'Too many requests in a short time. Wait a minute and try again.' : '');
    return fix ? `${err.message}. ${fix}` : err.message;
  }
  if (err instanceof EvelynConfigError) return err.message;
  if (err instanceof Error) {
    const cause = (err as { cause?: unknown }).cause;
    const detail = cause instanceof Error && cause.message ? ` (${cause.message})` : '';
    return `${err.message}${detail}`;
  }
  return String(err);
}
