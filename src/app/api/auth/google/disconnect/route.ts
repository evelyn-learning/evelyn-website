import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Teacher } from '@/models/Teacher';
import { decryptToken } from '@/lib/crypto/token-encryption';

export async function POST(req: NextRequest) {
  try {
    const { teacherId } = await req.json();
    if (!teacherId) {
      return NextResponse.json({ error: 'teacherId required' }, { status: 400 });
    }

    await connectDB();
    const teacher = await Teacher.findById(teacherId);
    if (!teacher || !teacher.googleAuth) {
      return NextResponse.json({ ok: true, alreadyDisconnected: true });
    }

    const accessToken = decryptToken(teacher.googleAuth.accessToken);

    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(accessToken)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    } catch (err) {
      console.warn('Google token revocation request failed:', err);
    }

    teacher.googleAuth = undefined;
    await teacher.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'disconnect_failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
