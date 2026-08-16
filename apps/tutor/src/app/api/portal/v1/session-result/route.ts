/**
 * POST /api/portal/v1/session-result — session-result emitter (Phase 4).
 * Commits session deltas (reusing the store functions), runs the Phase-3
 * passes, and returns a contract-valid SessionResult. Idempotent on sessionId.
 * Supports checkpoint mode (status:'in_progress' → snapshot, no mutation).
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { SessionEmitRequestSchema } from '@evelyn/portal-contract/v1';
import { emitSessionResult, extractSocialCarrier } from '@/lib/tutor/portal/session-result';
import { stripNullsDeep } from '@/lib/tutor/portal/serialize';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = SessionEmitRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  // M1c Task 5 (fix round 2, IMPORTANT D) — SessionEmitRequestSchema
  // declares `studentId: z.string()` with no `.min(1)`; reject `""` here
  // with a clean 400 rather than letting it reach emitSessionResult's
  // resolveProfileIdOrRaw, whose ProfileIdentityError now stays loud.
  if (!parsed.data.studentId) {
    return NextResponse.json({ error: 'bad_request', reason: 'studentId required' }, { status: 400 });
  }
  // Task D3 — ADDITIVE loose carrier (transcript + inbound socialMemory
  // threads) read off the raw body; not yet in SessionEmitRequestSchema
  // (zod strips unknown keys). Absent/malformed ⇒ undefined ⇒ no social
  // extraction, socialMemoryDelta omitted. This authed-portal route is
  // subscribed-only territory: demo/logged-out sessions never reach it, and
  // the academy sends no transcript carrier for trial / opted-out students.
  const social = extractSocialCarrier(auth.body);
  const result = await emitSessionResult(parsed.data, { ...(social ? { social } : {}), partnerId: auth.partnerId });
  return NextResponse.json(stripNullsDeep(result));
});
