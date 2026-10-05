/**
 * POST /api/portal/v1/practice — gap-targeted practice retrieval (Phase 3(c)).
 */

import { NextResponse, after } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { RetrievePracticeRequestSchema } from '@evelyn/portal-contract/v1';
import { retrievePractice } from '@/lib/tutor/portal/practice';
import { mongoPracticeSources } from '@/lib/tutor/portal/adapters';
import { PRACTICE_DRAW_DEADLINE_MS } from '@/lib/tutor/portal/practice-gen';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = RetrievePracticeRequestSchema.safeParse(auth.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'bad_request', issues: parsed.error.issues }, { status: 400 });
  }
  // An interactive draw answers within the deadline; a generation slot that
  // is still running then finishes after the response and is stored for the
  // next draw. The server is a long-running Node process, so that work
  // outlives the response on its own — `after` additionally ties it to the
  // request's lifetime for Next's own shutdown handling. (Outside a request
  // scope — the endpoint tests call this handler directly — `after` throws
  // and the work simply carries on unattached; it never rejects.)
  const result = await retrievePractice(parsed.data, mongoPracticeSources(), undefined, { partnerId: auth.partnerId }, {
    genDeadlineMs: PRACTICE_DRAW_DEADLINE_MS,
    onBackground: (work) => {
      try {
        after(() => work);
      } catch {
        /* not in a request scope */
      }
    },
  });
  return NextResponse.json(result);
});
