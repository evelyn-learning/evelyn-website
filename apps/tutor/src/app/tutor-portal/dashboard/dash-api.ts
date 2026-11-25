/**
 * The partner dashboard's API, as the pages call it: one fetch helper, the shape of /me, and the plain-words
 * text for each error code. Client-safe (no server imports).
 *
 * A 401 { error: 'signed_out' } from any call sends the browser to the sign-in page: the session cookie is
 * httpOnly, so the answer of a call is the only way a page learns it has expired.
 */

export interface DashAccount {
  email: string; name: string; company: string; role: 'owner' | 'member';
  termsVersion: string | null; termsCurrent: string; createdAt: string | null;
}
export interface DashPool {
  pooled: boolean; capMinutes: number; usedMinutes: number; remainingMinutes: number; sessionMaxMinutes: number; exhausted: boolean;
}
export interface DashDay { day: string; minutes: number; sessions: number }
export interface DashKey { masked: string; createdAt: string | null; expiresAt: string | null; current: boolean }
export interface DashMember { email: string; name: string; role: 'owner' | 'member'; lastLoginAt: string | null }
export interface DashMe {
  account: DashAccount;
  partnerId: string;
  /** One of the people who run Evelyn: the shell adds the "All partners" page for them. */
  admin: boolean;
  pool: DashPool;
  usage: { days: DashDay[]; sessionsTotal: number; sessions7d: number; minutes7d: number };
  keys: DashKey[];
  members: DashMember[];
  firstSessionAt: string | null;
}
export interface DashSessionRow {
  sessionId: string; studentId: string; startedAt: string; minutes: number; status: string;
  languages: string[]; subject: string; topic: string; inputMode: string; messages: number; test: boolean;
}
export interface DashStudentRow { studentId: string; sessions: number; minutes: number; lastSessionAt: string; languages: string[] }
export interface DashApiLogRow { at: string; method: string; path: string; status: number; error: string | null; ms: number }
export interface DashAdminPartnerRow {
  partnerId: string; name: string; status: 'active' | 'suspended'; plan: string; createdAt: string;
  owner: { email: string; name: string; company: string } | null; people: number;
  pooled: boolean; capMinutes: number; usedMinutes: number;
  sessions: number; sessions7d: number; lastSessionAt: string | null; firstSessionAt: string | null;
}
export interface DashPack { id: string; label: string; minutes: number; usd: number; perMinute: number }
export interface DashPurchase { at: string; pack: string; minutes: number; amount: number; currency: string; status: 'credited' | 'pending'; test: boolean }
export interface DashBilling {
  /** Whether this account can buy now; false shows the packs without a way to buy them. */
  onSale: boolean;
  /** Stripe's test mode: no money moves, the minutes are real. */
  testMode: boolean;
  packs: DashPack[]; pool: DashPool; purchases: DashPurchase[];
  /** Whether Stripe's page of invoices and receipts exists for this partner (it does after a first purchase). */
  canManage: boolean;
}
/** One webhook delivery. `status` 0 means the receiver gave no answer at all. */
export interface DashWebhookDelivery { at: string; event: string; status: number; ok: boolean; attempts: number; error: string | null; ms: number | null }
export interface DashWebhook { url: string | null; deliveries: DashWebhookDelivery[] }

export const LOGIN_PATH = '/dashboard/login';

export class DashApiError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
    this.name = 'DashApiError';
  }
}

interface DashFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** The sign-in and link pages call the API signed out on purpose; they handle a 401 themselves. */
  stayOn401?: boolean;
}

export async function dashFetch<T>(path: string, opts: DashFetchOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/tutor-portal/dashboard/${path}`, {
      method: opts.method ?? (opts.body === undefined ? 'GET' : 'POST'),
      credentials: 'same-origin',
      cache: 'no-store',
      headers: opts.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    });
  } catch {
    throw new DashApiError('network', 0);
  }
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (res.ok && data) return data;
  const code = (data && typeof data.error === 'string' && data.error) || (res.status >= 500 ? 'unavailable' : 'failed');
  if (res.status === 401 && !opts.stayOn401 && typeof window !== 'undefined') window.location.assign(LOGIN_PATH);
  throw new DashApiError(code, res.status);
}

const ERROR_TEXT: Record<string, string> = {
  invalid_email: 'That email address does not look right. Check it and try again.',
  missing_fields: 'Please fill in your name and company.',
  terms_required: 'Please agree to the sandbox terms to continue.',
  rate_limited: 'Too many requests from here for now. Wait a few minutes and try again.',
  signup_closed: 'Sign-ups are paused; write to info@evelynlearning.com',
  invalid_link: 'This link has expired or was already used.',
  owner_only: 'Only the account owner can do this.',
  email_in_use: 'That email already has a sandbox account, so it cannot be added here.',
  too_many: 'This account has reached its limit of people. Remove someone first.',
  not_found: 'We could not find that.',
  erase_incomplete: 'Some of this student\'s data could not be deleted. Try again; if it happens again, write to info@evelynlearning.com.',
  not_pooled: 'This partner has no minute pool, so there are no minutes to add.',
  not_on_sale: 'Minute packs are not on sale yet. Write to info@evelynlearning.com to add minutes.',
  unknown_pack: 'That pack is no longer offered. Reload the page and choose again.',
  payment_unavailable: 'We could not reach the payment service. Nothing was charged. Try again in a minute.',
  no_purchases: 'There are no invoices yet: this account has not bought a pack.',
  invalid_url: 'That does not look like a web address. It should look like https://example.com/hooks/evelyn',
  https_only: 'The URL must start with https://',
  no_credentials: 'Do not put a username or password in the URL.',
  bad_port: 'Use port 443 or 8443.',
  private_host: 'That host is not reachable from the internet.',
  signed_out: 'You have been signed out. Sign in again to continue.',
  bad_origin: 'This request did not come from this page. Reload and try again.',
  network: 'We could not reach the server. Check your connection and try again.',
  unavailable: 'The service is not answering right now. Try again in a minute.',
};

/** What to show for a failed call, in plain words. */
export function errorText(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  return err instanceof DashApiError ? ERROR_TEXT[err.code] ?? fallback : fallback;
}
