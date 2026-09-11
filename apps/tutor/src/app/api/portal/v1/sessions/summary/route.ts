/**
 * GET /api/portal/v1/sessions/summary?ids=a,b,c — engine-side session facts
 * for a partner's admin dashboard (contract v1.16.0, additive).
 *
 *   → 200 { sessions: SessionSummary[] }
 *   → 400 { error: 'bad_request', reason }   ids missing / empty / > 50
 *
 * Tenancy: only sessions whose `sourcePartnerId` equals the VERIFIED calling
 * partner are returned; ids belonging to another partner (or unknown) are
 * silently omitted, so a partner cannot probe another tenant's sessions.
 * The raw `clientIp` is never serialized — see session-summary.ts.
 */
import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { connectDB } from '@core/db';
import { TutorSession, type ITutorSession } from '@/models/TutorSession';
import { SessionSummaryReadSchema, SESSION_SUMMARY_MAX_IDS } from '@evelyn/portal-contract/v1';
import { parseSummaryIds, summarizeTutorSession } from '@/lib/tutor/portal/session-summary';

export const GET = withPortalAuth(async (req, auth) => {
  const ids = parseSummaryIds(new URL(req.url).searchParams.get('ids'));
  if (!ids) {
    return NextResponse.json(
      { error: 'bad_request', reason: `ids required (1..${SESSION_SUMMARY_MAX_IDS}, comma-separated)` },
      { status: 400 },
    );
  }

  await connectDB();
  const docs = await TutorSession.find({ sessionId: { $in: ids }, sourcePartnerId: auth.partnerId })
    .select({
      sessionId: 1,
      status: 1,
      startedAt: 1,
      endedAt: 1,
      duration: 1,
      'transcript.role': 1,
      whiteboardItemCount: 1,
      estimatedCost: 1,
      location: 1,
    })
    .lean<Pick<ITutorSession, 'sessionId' | 'status' | 'startedAt' | 'endedAt' | 'duration' | 'transcript' | 'whiteboardItemCount' | 'estimatedCost' | 'location'>[]>();

  const body = SessionSummaryReadSchema.parse({ sessions: docs.map((d) => summarizeTutorSession(d)) });
  return NextResponse.json(body);
});
