/**
 * POST /api/tutor-portal/dashboard/test-link: a signed link to a real lesson on the partner's own account, so
 * they see it work before writing any code. It is an ordinary partner session: it uses their minutes and shows
 * in their session list, under the student id "dashboard-test".
 */
import { NextResponse, type NextRequest } from 'next/server';
import { signEmbedToken } from '@/lib/tutor/portal/embed-token';
import { SUPPORTED_TUTOR_LANGUAGES } from '@/lib/tutor/voice/tts-language';
import { testLessonClaims } from '@/lib/tutor/partner-dashboard/core';
import { json, requestOrigin, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return json({ error: 'bad_request' }, 400); }
  const secrets = await a.store.partnerSecrets(a.account.partnerId);
  if (!secrets.length) return json({ error: 'no_secret' }, 404);
  const claims = testLessonClaims(a.account.partnerId, { ...body, studentName: body.studentName ?? a.account.name.split(/\s+/)[0] }, Date.now(), SUPPORTED_TUTOR_LANGUAGES);
  const token = signEmbedToken(claims, secrets[0].secret);
  return json({ url: `${requestOrigin(req)}/tutor-portal/embed?token=${token}`, claims });
}
