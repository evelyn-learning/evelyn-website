/** POST /api/tutor-portal/dashboard/sessions/replay { sessionId }: a one-hour link to that session's replay
 *  (transcript, board, PDF). Only for a session of the signed-in partner. */
import { NextResponse, type NextRequest } from 'next/server';
import { sessionReplayLink } from '@/lib/tutor/partner-dashboard/data';
import { json, requestOrigin, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  let body: { sessionId?: unknown };
  try { body = (await req.json()) as { sessionId?: unknown }; } catch { return json({ error: 'bad_request' }, 400); }
  if (typeof body.sessionId !== 'string' || !body.sessionId || body.sessionId.length > 200) return json({ error: 'bad_request' }, 400);
  const url = await sessionReplayLink(a.account.partnerId, body.sessionId, requestOrigin(req));
  return url ? json({ url }) : json({ error: 'not_found' }, 404);
}
