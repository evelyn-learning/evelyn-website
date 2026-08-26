/**
 * Embed-session token verifier (learner-model Phase C, Task 1).
 *
 * The portal mints an HS256 JWT signed with the SAME per-partner secret used
 * for the HMAC portal API (PORTAL_PARTNER_SECRETS / getPartnerSecret), so no
 * new secret distribution is needed. This is the AUTH layer for embed
 * sessions — it only verifies signature/partner/expiry claims. The full
 * EmbedConfig (lesson context, curriculum_module, etc.) rides in the same
 * payload untouched; this module never inspects those fields.
 *
 * Unlike the replay token (`replay-token.ts`), there is no `mode` claim to
 * pin, and `student_id` is OPTIONAL — some engine demo/anonymous embeds have
 * no student identity at all. Expiry also gets a grace window
 * (EMBED_TOKEN_EXP_GRACE_MINUTES, default 240min) so a token that goes stale
 * mid-session (long tutor sessions, clock skew) doesn't hard-fail.
 *
 * Enforcement is staged via EMBED_TOKEN_ENFORCE so routes can be gated
 * without a hard cutover:
 *   - 'off' (default): don't even verify; always allow.
 *   - 'log':  verify, but only warn on failure — never block.
 *   - 'on':   verify and block on failure.
 *
 * Dependency-free (node:crypto) — the engine has no jsonwebtoken.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { getPartnerSecret } from './auth';
import { resolvePartnerTokenSecrets } from './partner-token-secrets';

export type EmbedEnforceMode = 'off' | 'log' | 'on';

/** Reads process.env.EMBED_TOKEN_ENFORCE at CALL time (not cached). */
export function embedEnforceMode(): EmbedEnforceMode {
  const raw = process.env.EMBED_TOKEN_ENFORCE;
  if (raw === 'log' || raw === 'on') return raw;
  return 'off';
}

export interface EmbedTokenPayload {
  partner_id: string;
  /** Optional: engine demo/anonymous embeds may carry no student identity. */
  student_id?: string;
  exp?: number;
  /** The full EmbedConfig rides here; we only verify the auth claims above. */
  [k: string]: unknown;
}

function b64urlDecode(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function b64urlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export type EmbedVerdict =
  | { ok: true; payload: EmbedTokenPayload }
  | { ok: false; reason: string };

/**
 * Structural + claim checks — everything that needs no secret. Returns a final
 * verdict, or the pieces `finishEmbedVerification` needs once the caller has
 * resolved the partner's live secrets. Split out so the sync and async entry
 * points below cannot drift in their claim handling.
 */
function verifyEmbedTokenParts(
  token: string | null,
): EmbedVerdict | { pending: { headerB64: string; payloadB64: string; sigB64: string; payload: EmbedTokenPayload; partnerId: string } } {
  if (!token) return { ok: false, reason: 'missing token' };
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'not a JWT' };
  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];

  let header: { alg?: string };
  let payload: Partial<EmbedTokenPayload>;
  try {
    header = JSON.parse(b64urlDecode(headerB64).toString('utf8'));
    payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed token' };
  }
  // JSON.parse accepts bare `null`/scalars as valid JSON; guard property
  // access below so a token like "bnVsbA.bnVsbA.x" (base64 of "null") can
  // never throw instead of returning a rejection.
  if (typeof header !== 'object' || header === null) {
    return { ok: false, reason: 'malformed token' };
  }
  if (typeof payload !== 'object' || payload === null) {
    return { ok: false, reason: 'malformed token' };
  }
  if (header.alg !== 'HS256') return { ok: false, reason: 'unsupported alg' };
  if (!payload.partner_id) return { ok: false, reason: 'missing claims' };

  return {
    pending: {
      headerB64,
      payloadB64,
      sigB64,
      payload: payload as EmbedTokenPayload,
      partnerId: payload.partner_id,
    },
  };
}

/**
 * Signature + expiry-with-grace, given the partner's candidate secrets. Pure.
 *
 * `secrets` is a LIST because an M1c registry row can hold several live
 * secrets mid-rotation and any one of them verifying is a pass — the old
 * env-only lookup could express exactly one, so a key rotation would have
 * broken every embedded session for that partner.
 */
function finishEmbedVerification(
  pending: { headerB64: string; payloadB64: string; sigB64: string; payload: EmbedTokenPayload },
  secrets: string[],
  nowMs: number,
): EmbedVerdict {
  if (secrets.length === 0) return { ok: false, reason: 'unknown partner' };

  const payload = pending.payload;
  const signed = `${pending.headerB64}.${pending.payloadB64}`;
  let matched: boolean;
  try {
    const actual = b64urlDecode(pending.sigB64);
    matched = secrets.some((secret) => {
      const expected = createHmac('sha256', secret).update(signed).digest();
      return expected.length === actual.length && timingSafeEqual(expected, actual);
    });
  } catch {
    return { ok: false, reason: 'malformed token' };
  }
  if (!matched) return { ok: false, reason: 'bad signature' };

  if (payload.exp !== undefined) {
    // Number(...) on a non-numeric env value (e.g. a typo'd override) yields
    // NaN, and NaN in the comparison below makes it always false — a
    // fail-open that would let every expired token through regardless of
    // age. Fall back to the 240min default whenever the parse isn't a finite
    // number.
    const parsedGrace = Number(process.env.EMBED_TOKEN_EXP_GRACE_MINUTES ?? 240);
    const graceMinutes = Number.isFinite(parsedGrace) ? parsedGrace : 240;
    const graceMs = graceMinutes * 60_000;
    if (payload.exp * 1000 + graceMs < nowMs) {
      return { ok: false, reason: 'expired' };
    }
  }

  return { ok: true, payload };
}

/**
 * Verify an HS256 embed JWT against the ENV map only. Never throws.
 *
 * Retained for callers that cannot await and for the existing hermetic tests.
 * ⚠ Cannot see M1c registry partners — use `verifyEmbedTokenAsync` in new
 * code. See `partner-token-secrets.ts` for what this blind spot cost.
 */
export function verifyEmbedToken(token: string | null, nowMs: number = Date.now()): EmbedVerdict {
  const step = verifyEmbedTokenParts(token);
  if (!('pending' in step)) return step;
  const secret = getPartnerSecret(step.pending.partnerId);
  return finishEmbedVerification(step.pending, secret ? [secret] : [], nowMs);
}

/** Verify an HS256 embed JWT against the partner's LIVE secrets (registry, then env). Never throws. */
export async function verifyEmbedTokenAsync(
  token: string | null,
  nowMs: number = Date.now(),
): Promise<EmbedVerdict> {
  const step = verifyEmbedTokenParts(token);
  if (!('pending' in step)) return step;
  const secrets = await resolvePartnerTokenSecrets(step.pending.partnerId);
  return finishEmbedVerification(step.pending, secrets, nowMs);
}

export interface EmbedAuthDecision {
  allow: boolean;
  reason?: string;
  payload?: EmbedTokenPayload;
}

/**
 * M1c Task 5 (fix round 2, spec §4.0; corrected fix round 3, CRITICAL A1 +
 * A2) — the partner id an internal `/api/tutor/**` route resolves student
 * identity under, given the `checkEmbedAuth` decision for that request.
 *
 * The tutor UI a partner's students actually sit in is `tutor-portal/embed`,
 * and it commits session state through these internal routes — hardcoding
 * `'evelyn'` there while the SAME partner's server-to-server portal reads
 * resolve under their verified `auth.partnerId` gives one student two
 * surrogate profiles (round-1 CRITICAL A). The verified embed token's
 * `partner_id` claim is the correct answer for an embedded session;
 * `'evelyn'` is reserved for genuinely retail traffic that carries none.
 *
 * CRITICAL A1 (fix round 3): callers of this function must NOT gate the
 * request on `auth.allow`. `/tutor` and `/tutor/settings` are retail
 * surfaces that legitimately send no embed token, and an earlier version of
 * spec §4.0 said internal routes "must gain embed-token auth" — requiring
 * one 401s real retail users the moment the code ships, independent of
 * `PORTAL_IDENTITY_RESOLUTION` (this auth check isn't gated by that flag at
 * all). Token absent → this function returns `'evelyn'` and the route must
 * still serve the request. Token present → it must be valid and
 * student-bound to contribute a partner id; otherwise this ALSO falls back
 * to `'evelyn'` (never a 401) — see CRITICAL A2 below for why a token can
 * be present yet still not trusted.
 *
 * CRITICAL A2 (fix round 3): `checkEmbedAuth` returns `payload` even when
 * verification only PARTIALLY succeeded — a token whose `student_id` claim
 * doesn't bind to the request's student comes back as `{reason:
 * 'student_mismatch', payload}`, and in `'log'` enforcement mode the
 * request is still allowed through. Trusting `payload.partner_id` in that
 * case would let ANY validly-signed token choose a write namespace
 * regardless of which student it names — e.g. the marketing demo-token
 * route hands out a validly-signed `evelyn-marketing` token to anyone, so
 * in `'log'` mode an anonymous caller could write into
 * `('evelyn-marketing', <any studentId>)`. Only `auth.reason === undefined`
 * (full verification success — no missing/bad/expired/mismatched token)
 * makes the payload trustworthy for partner derivation.
 *
 * `auth.payload` is also undefined whenever nothing was actually VERIFIED
 * in the first place — `EMBED_TOKEN_ENFORCE` is `'off'` (still the current
 * default: `checkEmbedAuth` returns `{allow:true}` with no payload,
 * without even attempting verification) or the token was missing
 * entirely. Falling back to `'evelyn'` in that case is correct for a
 * request that carried no verifiable token — but it means partner
 * attribution here is only as good as `EMBED_TOKEN_ENFORCE`'s own rollout.
 * `PORTAL_IDENTITY_RESOLUTION` must not flip to `'on'` in an environment
 * where embed sessions are still running with enforcement `'off'`, or every
 * embedded partner student would resolve under `'evelyn'` instead of their
 * real partner — the exact split this function exists to prevent. That is
 * a rollout-ordering precondition (same shape as the Task 6 backfill gate),
 * not something this function can enforce by itself.
 */
export function partnerIdForInternalRoute(auth: EmbedAuthDecision): string {
  if (auth.reason !== undefined) return 'evelyn';
  return auth.payload?.partner_id ?? 'evelyn';
}

/**
 * M1c Task 5 (fix round 4, spec §4.0 refinement) — the reject/proceed
 * decision an internal identity-deriving route must make BEFORE calling
 * `partnerIdForInternalRoute`, given the raw token string and the
 * `checkEmbedAuth` decision for it. Returns the failure `reason` to 401
 * with, or `null` to proceed.
 *
 * Round 3 made `partnerIdForInternalRoute` fall back to `'evelyn'` for ANY
 * decision with a `reason` set — that conflated two different situations:
 *
 *   - No token at all. This IS retail (`/tutor`, `/tutor/settings` send
 *     none) and must resolve to `'evelyn'` and be SERVED, never 401 — the
 *     round-3 CRITICAL A1 fix, and it stands.
 *   - A token that WAS sent but failed verification (bad signature,
 *     expired past the grace window, unknown partner) or failed the
 *     student-binding check (`student_mismatch`). This is NOT retail — a
 *     present token is by definition someone claiming to be a specific
 *     partner's student. Falling back to `'evelyn'` here is silently
 *     WRONG, not safely conservative: a partner's tutoring session running
 *     past the token's grace window would have every subsequent write land
 *     under `('evelyn', rawStudentId)` — colliding with any retail user
 *     sharing that external id, the exact split-brain this milestone
 *     exists to prevent, reached through a degraded token instead of a
 *     missing one. And in `'on'` enforcement mode `checkEmbedAuth` returns
 *     `{allow:false}` with NO log line, so the misattribution left no
 *     trace. This function's whole job is to make that case reject (401)
 *     and log instead, at every enforcement mode where verification
 *     actually ran (`'off'` never attempts verification at all — `reason`
 *     is never set there regardless of what the client sent — so this
 *     never rejects in `'off'` mode; `'log'` mode's traditional "warn but
 *     allow" is deliberately overridden here, because for THESE routes an
 *     allowed-through bad token is a correctness bug, not an
 *     observability nicety).
 *
 * `token` must be the SAME raw string passed into `checkEmbedAuth` — this
 * function cannot infer "was a token sent" from `auth` alone, because in
 * `'off'` mode `checkEmbedAuth` returns `{allow:true}` with no payload or
 * reason regardless of whether the caller sent one.
 */
export function embedTokenRejectionReason(token: string | null, auth: EmbedAuthDecision): string | null {
  if (token === null) return null; // no token sent at all -> retail, never reject
  if (auth.reason === undefined) return null; // absent, or fully verified -> proceed
  return auth.reason; // present but invalid/mismatched -> reject with this reason
}

/**
 * Verify a token and apply the current enforce mode. Never throws.
 *
 * - 'off': allow unconditionally, without attempting verification.
 * - 'log': verify; on failure, console.warn and still allow.
 * - 'on':  verify; on failure, block.
 *
 * A verified token whose student_id doesn't match `expectedStudentId` is
 * treated as a failure with reason 'student_mismatch'.
 */
export function checkEmbedAuth(opts: {
  token: string | null;
  /** When set, a verified token's student_id must equal this. */
  expectedStudentId?: string;
  /** Route label for log lines, e.g. 'student-profile:POST'. */
  route: string;
}): EmbedAuthDecision {
  const mode = embedEnforceMode();
  if (mode === 'off') return { allow: true };
  return applyEmbedAuthDecision(verifyEmbedToken(opts.token), mode, opts);
}

/**
 * `checkEmbedAuth`, but resolving the partner through the M1c registry.
 *
 * THIS IS THE ONE PRODUCTION ROUTES SHOULD CALL. The sync sibling above sees
 * only `PORTAL_PARTNER_SECRETS`, which is why every embed-token-gated engine
 * route rejected the whole evelyntutor brand with `unknown partner` while its
 * server-to-server portal calls (registry-resolved by `withPortalAuth`)
 * succeeded — 1061 × 401 vs 0 × 200 on `/api/tutor/session-usage`, measured
 * from nginx on 2026-08-26. See `partner-token-secrets.ts`.
 *
 * Decision logic is delegated to `applyEmbedAuthDecision` rather than copied,
 * so the two entry points cannot drift the way the two secret lookups did.
 */
export async function checkEmbedAuthAsync(opts: {
  token: string | null;
  expectedStudentId?: string;
  route: string;
}): Promise<EmbedAuthDecision> {
  const mode = embedEnforceMode();
  if (mode === 'off') return { allow: true };
  return applyEmbedAuthDecision(await verifyEmbedTokenAsync(opts.token), mode, opts);
}

/** Shared tail of both checkEmbedAuth entry points: student binding, then enforce mode. */
function applyEmbedAuthDecision(
  verdict: EmbedVerdict,
  mode: EmbedEnforceMode,
  opts: { expectedStudentId?: string; route: string },
): EmbedAuthDecision {
  let reason: string | undefined;
  let payload: EmbedTokenPayload | undefined;
  if (!verdict.ok) {
    reason = verdict.reason;
  } else if (
    opts.expectedStudentId !== undefined &&
    verdict.payload.student_id !== opts.expectedStudentId
  ) {
    reason = 'student_mismatch';
    payload = verdict.payload;
  } else {
    payload = verdict.payload;
  }

  if (reason === undefined) return { allow: true, payload };

  if (mode === 'log') {
    console.warn('[embed-auth]', opts.route, reason);
    return { allow: true, reason, payload };
  }
  return { allow: false, reason, payload };
}

/**
 * Sign an HS256 embed JWT. Used by first-party minting (Task 5) and tests.
 * Never throws under normal input; caller supplies a valid secret.
 */
export function signEmbedToken(payload: Record<string, unknown>, secret: string): string {
  const headerB64 = b64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest();
  return `${headerB64}.${payloadB64}.${b64urlEncode(sig)}`;
}
