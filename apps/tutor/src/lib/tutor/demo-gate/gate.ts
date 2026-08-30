/**
 * Demo-gate configuration + client-IP resolution (demo-abuse restrictions,
 * 2026-08-29 — built after one demo student ran 16 sessions from one IP
 * through the marketing embed with zero enforcement anywhere).
 *
 * Everything reads process.env at CALL time (the flags.ts convention) so a
 * pm2 restart with a changed env is the whole rollback story.
 *
 * TUTOR_DEMO_GATE modes — same staging shape as EMBED_TOKEN_ENFORCE:
 *   'off' : no enforcement anywhere; demo-start grants without counting.
 *   'log' : quotas are counted and denials are computed but only logged.
 *   'on'  : (DEFAULT — new tutor flags default ON, feedback rule 2026-08-20)
 *           demo-start denies over-quota starts; the costly routes
 *           (realtime-token / chat / brain-stream / generate-whiteboard /
 *           sketch) require a demo grant or a verified partner embed token.
 */

import { getPartnerSecret } from '@/lib/tutor/portal/auth';
import { isPrivateIp } from '@/lib/tutor/recordings/client-ip';

export type DemoGateMode = 'off' | 'log' | 'on';

export function demoGateMode(): DemoGateMode {
  const raw = process.env.TUTOR_DEMO_GATE;
  if (raw === 'off' || raw === 'log') return raw;
  return 'on';
}

/** Quota caps, env-overridable. 0 or negative disables that dimension. */
export function demoGateLimits() {
  return {
    perIpPerDay: intEnv('TUTOR_DEMO_PER_IP_PER_DAY', 3),
    perDevicePerDay: intEnv('TUTOR_DEMO_PER_DEVICE_PER_DAY', 3),
    perEmailLifetime: intEnv('TUTOR_DEMO_PER_EMAIL_LIFETIME', 3),
    globalPerDay: intEnv('TUTOR_DEMO_GLOBAL_PER_DAY', 50),
  };
}

function intEnv(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
}

/**
 * HMAC secret for the grant cookie. Dedicated env var when set; otherwise the
 * evelyn-marketing partner secret (already provisioned in prod for embed-token
 * signing) so the gate needs no new secret distribution to go live. Empty
 * string = no usable secret; callers treat that as gate-inoperable and FAIL
 * OPEN with a loud log, because silently denying every student over a missing
 * env var is the worse failure.
 */
export function demoGateSecret(): string {
  return process.env.TUTOR_DEMO_GATE_SECRET || getPartnerSecret('evelyn-marketing') || '';
}

/**
 * The IP the QUOTA is keyed on. Prefer x-real-ip — nginx sets it from
 * $remote_addr, unforgeable from outside. Fall back to the LAST
 * x-forwarded-for entry ($proxy_add_x_forwarded_for APPENDS the real client
 * after anything the client sent, so the last hop is nginx's own view; the
 * FIRST entry is client-forgeable, which is why this deliberately differs
 * from recordings/client-ip.ts, whose first-hop read predates this gate).
 */
export function gateClientIp(headers: Headers): string {
  const real = headers.get('x-real-ip')?.trim();
  if (real) return real.replace(/^::ffff:/i, '');
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last.replace(/^::ffff:/i, '');
  }
  return '';
}

/**
 * Allowlisted IPs bypass quotas in demo-start AND enforcement on the costly
 * routes — internal testing (Praveen's sessions dominate all-brand traffic)
 * must not burn or hit demo quotas. Private/loopback ranges are always
 * allowlisted so local dev never needs env setup.
 */
export function isAllowlistedIp(ip: string): boolean {
  if (!ip) return false;
  if (isPrivateIp(ip)) return true;
  const raw = process.env.TUTOR_DEMO_IP_ALLOWLIST || '';
  if (!raw) return false;
  return raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .includes(ip);
}

/**
 * Same dotted-domain regex Crimsora's gate uses on both client and server —
 * deliberately stricter than HTML5's, which accepts `user@gmail` (no dot).
 */
export const DEMO_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeDemoEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (!email || email.length > 254 || !DEMO_EMAIL_RE.test(email)) return null;
  return email;
}

export function normalizeDemoName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const name = raw.trim();
  if (!name || name.length > 60) return null;
  return name;
}
