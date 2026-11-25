/**
 * GET /api/tutor-portal/dashboard/students: the partner's students with their sessions and minutes.
 * DELETE { studentId }: erase everything held for one student (the same erase as POST /api/portal/v1/student-erase).
 * Owners only for the erase: it cannot be undone.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { eraseStudentData } from '@/lib/tutor/student-erase/erase';
import { listStudents } from '@/lib/tutor/partner-dashboard/data';
import { json, requireAccount } from '@/lib/tutor/partner-dashboard/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const a = await requireAccount(req);
  if (a instanceof NextResponse) return a;
  return json(await listStudents(a.account.partnerId));
}

export async function DELETE(req: NextRequest) {
  const a = await requireAccount(req, { write: true });
  if (a instanceof NextResponse) return a;
  if (a.account.role !== 'owner') return json({ error: 'owner_only' }, 403);
  let body: { studentId?: unknown };
  try { body = (await req.json()) as { studentId?: unknown }; } catch { return json({ error: 'bad_request' }, 400); }
  if (typeof body.studentId !== 'string' || !body.studentId || body.studentId.length > 200) return json({ error: 'bad_request' }, 400);
  const result = await eraseStudentData({ partnerId: a.account.partnerId, externalStudentId: body.studentId });
  console.log(`[partner-dashboard] ${a.account.email} erased a student of ${a.account.partnerId}; complete=${result.complete}`);
  return result.complete ? json({ ok: true, deleted: result.deleted }) : json({ error: 'erase_incomplete', deleted: result.deleted }, 500);
}
