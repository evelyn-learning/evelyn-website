import { NextRequest, NextResponse } from 'next/server';
import { listActiveCourses } from '@/lib/google/classroom-client';
import { GoogleAuthError } from '@/lib/google/token-refresh';

export async function GET(req: NextRequest) {
  const teacherId = new URL(req.url).searchParams.get('teacherId');
  if (!teacherId) {
    return NextResponse.json({ error: 'teacherId required' }, { status: 400 });
  }
  try {
    const courses = await listActiveCourses(teacherId);
    return NextResponse.json({ courses });
  } catch (err) {
    if (err instanceof GoogleAuthError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 401 });
    }
    const msg = err instanceof Error ? err.message : 'Failed to list courses';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
