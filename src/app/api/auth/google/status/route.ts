import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Teacher } from '@/models/Teacher';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const teacherId = url.searchParams.get('teacherId');
  if (!teacherId) {
    return NextResponse.json({ connected: false });
  }

  try {
    await connectDB();
    const teacher = await Teacher.findById(teacherId).lean();
    if (!teacher || !teacher.googleAuth) {
      return NextResponse.json({ connected: false });
    }
    return NextResponse.json({
      connected: true,
      email: teacher.googleAuth.connectedEmail,
      connectedAt: teacher.googleAuth.connectedAt,
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
