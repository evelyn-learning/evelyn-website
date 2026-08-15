import { NextRequest, NextResponse } from 'next/server';
import { listSubmissions } from '@/lib/google/classroom-client';
import { GoogleAuthError } from '@/lib/google/token-refresh';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> }
) {
  const { courseId, assignmentId } = await params;
  const teacherId = new URL(req.url).searchParams.get('teacherId');
  if (!teacherId) {
    return NextResponse.json({ error: 'teacherId required' }, { status: 400 });
  }
  try {
    const submissions = await listSubmissions(teacherId, courseId, assignmentId);
    return NextResponse.json({ submissions });
  } catch (err) {
    if (err instanceof GoogleAuthError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 401 });
    }
    const msg = err instanceof Error ? err.message : 'Failed to list submissions';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
