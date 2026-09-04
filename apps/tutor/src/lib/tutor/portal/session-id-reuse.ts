/**
 * Is this write landing on a session document from an earlier sitting?
 *
 * portal-85b2c632-df76-4970-beea-528047a21687 (created 2026-09-01T02:10:13Z)
 * holds transcript entries from 2026-09-01 (69), 2026-09-03 (17) and
 * 2026-09-04 (4) because the partner minted Sep-3 and Sep-4 embed tokens
 * carrying the Sep-1 session_id — verified by decoding the tokens out of the
 * nginx access log. portal-60dcca1d (created 2026-08-31) likewise holds four
 * events stamped 2026-09-04. Every duration, startedAt and per-session cost on
 * such a row is meaningless.
 *
 * The threshold is generous on purpose. A legitimate resume — a reconnect, a
 * reload, a student returning after a break — happens within one sitting; the
 * observed corruption spans DAYS. Anything under the window is allowed, so a
 * long real session can never be refused.
 *
 * Pure module — no side effects, never throws.
 */

/** Longer than any plausible single sitting; far shorter than the observed
 *  3-day spans. */
export const SESSION_REUSE_MAX_AGE_MS = 12 * 3_600_000; // 12h

export function isStaleSessionReuse(args: {
  existingCreatedAt: Date | string | null | undefined;
  now: Date;
  maxAgeMs?: number;
}): boolean {
  const raw = args.existingCreatedAt;
  if (raw === null || raw === undefined) return false;
  const created = raw instanceof Date ? raw : new Date(raw);
  const t = created.getTime();
  if (Number.isNaN(t)) return false;   // unparseable → never refuse
  const age = args.now.getTime() - t;
  if (age < 0) return false;           // clock skew → never refuse
  return age > (args.maxAgeMs ?? SESSION_REUSE_MAX_AGE_MS);
}
