/**
 * POST /api/portal/v1/session-result — session-result emitter (Phase 4).
 * Commits session deltas (reusing the store functions), runs the Phase-3
 * passes, and returns a contract-valid SessionResult. Idempotent on sessionId.
 * Supports checkpoint mode (status:'in_progress' → snapshot, no mutation).
 */

import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { SessionEmitRequestSchema } from '@evelyn/portal-contract/v1';
import { emitSessionResult } from '@/lib/tutor/portal/session-result';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = SessionEmitRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  const result = await emitSessionResult(parsed.data);
  return NextResponse.json(result);
});
