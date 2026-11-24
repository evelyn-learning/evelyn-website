/**
 * Partner dashboard and self-serve sandbox: the pure parts (no I/O, no env reads beyond the ones passed in).
 *
 * Why this exists (Praveen, 2026-11-24): a developer who finds the tutor engine, alone or through a coding
 * assistant, gets keys and 300 free minutes at once, with no request to us and no wait; we hear of it by email.
 * The dashboard is where they see their minutes, keys, sessions and docs.
 *
 * What bounds the cost of an open sign-up: the email must be proven (the sandbox is created only when the
 * emailed link is used), one sandbox per email, a few per IP per day, a ceiling on new sandboxes per day for
 * everyone, and the partner minute pool, which is a hard cap.
 */
import { createHash, randomBytes } from 'node:crypto';

/** The sandbox terms a new partner accepts. A change of wording gets a new version, and the account keeps the
 *  version it accepted. */
export const SANDBOX_TERMS_VERSION = '2026-11-24';

export const SANDBOX_FREE_MINUTES = 300;
export const LOGIN_LINK_TTL_MS = 30 * 60_000;
export const DASH_SESSION_TTL_MS = 30 * 24 * 60 * 60_000;
export const DASH_SESSION_COOKIE = 'evelyn_partner_session';
/** How long the secret being replaced keeps working after a rotation, so a partner can switch without downtime. */
export const ROTATED_SECRET_GRACE_MS = 24 * 60 * 60_000;

export interface SignupLimits {
  /** Links emailed to one address per day (a link request costs us an email and nothing else). */
  linksPerEmailPerDay: number;
  linksPerIpPerDay: number;
  /** Sandboxes created from one IP per day. */
  sandboxesPerIpPerDay: number;
  /** Sandboxes created per day, everyone together: the ceiling on what a run of sign-ups can cost. */
  sandboxesPerDay: number;
}

const int = (raw: string | undefined, fallback: number): number => {
  const n = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export function signupLimits(env: NodeJS.ProcessEnv = process.env): SignupLimits {
  return {
    linksPerEmailPerDay: int(env.PARTNER_SIGNUP_LINKS_PER_EMAIL_PER_DAY, 6),
    linksPerIpPerDay: int(env.PARTNER_SIGNUP_LINKS_PER_IP_PER_DAY, 20),
    sandboxesPerIpPerDay: int(env.PARTNER_SIGNUP_PER_IP_PER_DAY, 3),
    sandboxesPerDay: int(env.PARTNER_SIGNUP_PER_DAY, 25),
  };
}

/** Self-serve sign-up switch. Default ON; 'off' sends visitors back to the request form's answer ("we will write
 *  to you"), and every dashboard route still works for the accounts that exist. */
export function selfServeSignupOn(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.PARTNER_SELF_SERVE_SIGNUP !== 'off';
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const e = raw.trim().toLowerCase();
  return e.length <= 254 && EMAIL_RE.test(e) ? e : null;
}

export function cleanText(raw: unknown, max: number): string {
  return typeof raw === 'string' ? raw.replace(/[\u0000-\u0008\u000b-\u001f]/g, ' ').trim().slice(0, max) : '';
}

/** A fresh random token for a link or a cookie (43 URL-safe characters). */
export function newToken(): string {
  return randomBytes(32).toString('base64url');
}

/** What is stored for a token: its SHA-256. The token itself exists only in the email or the cookie. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** A new partner secret: 64 hex characters, the shape every existing partner's secret has. */
export function newPartnerSecret(): string {
  return randomBytes(32).toString('hex');
}

/** Ids no self-serve partner may take: ours, the test rows, and words a URL or a log line would misread. */
const RESERVED_ID = /^(?:evelyn|admin|api|app|demo|test|trial|sandbox|portal|partner|internal|system|root|support|null|undefined|www|tutor)(?:-|$)|test$/;

/** The partner id suggested by a company name: lower-case letters, digits and hyphens, 3 to 28 characters.
 *  Null when the name gives nothing usable (the caller then falls back to a random id). */
export function partnerIdFromCompany(company: string): string | null {
  const slug = company
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28)
    .replace(/-+$/g, '');
  if (slug.length < 3 || !/^[a-z]/.test(slug) || RESERVED_ID.test(slug)) return null;
  return slug;
}

/** The ids to try for a new partner, in order: the company's own, the same with a short random tail, then
 *  random ones. `taken` says whether an id is in use (a row, or a name in the env secrets map). */
export async function pickPartnerId(company: string, taken: (id: string) => Promise<boolean>, rand: () => string = () => randomBytes(3).toString('hex')): Promise<string> {
  const base = partnerIdFromCompany(company);
  const tries = base ? [base, `${base.slice(0, 21)}-${rand()}`, `${base.slice(0, 21)}-${rand()}`] : [];
  for (let k = 0; k < 4; k++) tries.push(`sb-${rand()}${rand()}`);
  for (const id of tries) if (!(await taken(id))) return id;
  throw new Error('no free partner id');
}

/** The names in the env secrets map (`PORTAL_PARTNER_SECRETS`, `PORTAL_PARTNER_ID`): a partner with no row is
 *  served from there, so a new row must never take one of those names. */
export function envPartnerIds(env: NodeJS.ProcessEnv = process.env): Set<string> {
  const ids = new Set<string>();
  try {
    const map = JSON.parse(env.PORTAL_PARTNER_SECRETS || '{}') as Record<string, unknown>;
    if (map && typeof map === 'object') for (const k of Object.keys(map)) ids.add(k);
  } catch { /* not JSON: nothing to add */ }
  if (env.PORTAL_PARTNER_ID) ids.add(env.PORTAL_PARTNER_ID);
  return ids;
}

/** The base URL links in emails point at. The dashboard lives on the developer portal's host. */
export function dashboardOrigin(env: NodeJS.ProcessEnv = process.env): string {
  return (env.PARTNER_DASHBOARD_ORIGIN || 'https://tutor.evelynlearning.com').replace(/\/+$/, '');
}

/** The link an email carries. It opens a page with one button; the button's POST is what signs the person in,
 *  so a mail scanner that fetches the link does not use it up. */
export function loginLinkUrl(token: string, origin: string): string {
  return `${origin}/dashboard/verify?token=${encodeURIComponent(token)}`;
}

export interface TestLessonInput {
  language?: unknown; subject?: unknown; level?: unknown; topic?: unknown; mode?: unknown; studentName?: unknown; minutes?: unknown;
}

/** The token claims of a "start a test lesson" link: an ordinary partner session, on a student id that names
 *  the dashboard so test sessions are told apart from the partner's own. */
export function testLessonClaims(partnerId: string, input: TestLessonInput, nowMs: number, languageCodes: readonly string[]): Record<string, unknown> {
  const language = typeof input.language === 'string' && languageCodes.includes(input.language) ? input.language : 'en';
  const minutes = Math.min(30, Math.max(1, Math.round(Number(input.minutes) || 10)));
  const now = Math.floor(nowMs / 1000);
  return {
    partner_id: partnerId,
    student_id: 'dashboard-test',
    student_name: cleanText(input.studentName, 40) || undefined,
    subject: cleanText(input.subject, 40) || 'math',
    level: cleanText(input.level, 40) || 'Grade 8',
    topic: cleanText(input.topic, 160) || 'Solving linear equations',
    target_kind: 'freestyle',
    input_mode: input.mode === 'text' ? 'text' : 'voice',
    ...(language !== 'en' ? { tutor_languages: [language] } : {}),
    max_duration_minutes: minutes,
    metadata: { source: 'partner-dashboard-test' },
    iat: now,
    exp: now + 2 * 60 * 60,
  };
}

export interface DayUsage { day: string; minutes: number; sessions: number }

/** Minutes and sessions per UTC day for the last `days` days, oldest first, with empty days filled in. */
export function usageByDay(rows: ReadonlyArray<{ startedAt: Date | string; seconds: number }>, nowMs: number, days = 30): DayUsage[] {
  const key = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  const out = new Map<string, DayUsage>();
  for (let k = days - 1; k >= 0; k--) { const d = key(nowMs - k * 86_400_000); out.set(d, { day: d, minutes: 0, sessions: 0 }); }
  for (const r of rows) {
    const slot = out.get(key(new Date(r.startedAt).getTime()));
    if (!slot) continue;
    slot.sessions += 1;
    slot.minutes += Math.max(0, r.seconds) / 60;
  }
  return [...out.values()].map((d) => ({ ...d, minutes: Math.round(d.minutes * 10) / 10 }));
}

/** A secret with all but its last four characters hidden, for the keys page before "reveal". */
export function maskSecret(secret: string): string {
  return secret.length <= 4 ? '••••' : `${'•'.repeat(12)}${secret.slice(-4)}`;
}
