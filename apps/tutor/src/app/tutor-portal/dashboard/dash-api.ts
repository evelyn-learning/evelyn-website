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

export const LOGIN_PATH = '/dashboard/login';

export class DashApiError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
    this.name = 'DashApiError';
  }
}

interface DashFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
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
  signed_out: 'You have been signed out. Sign in again to continue.',
  bad_origin: 'This request did not come from this page. Reload and try again.',
  network: 'We could not reach the server. Check your connection and try again.',
  unavailable: 'The service is not answering right now. Try again in a minute.',
};

/** What to show for a failed call, in plain words. */
export function errorText(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  return err instanceof DashApiError ? ERROR_TEXT[err.code] ?? fallback : fallback;
}
