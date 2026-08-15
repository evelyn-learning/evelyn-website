import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { IntegrityReport } from '@/models/IntegrityReport';

/**
 * POST: Save report HTML and return a shareable ID.
 */
export async function POST(request: NextRequest) {
  try {
    const { html, studentName, assignmentName } = await request.json();

    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Report HTML is required.' }, { status: 400 });
    }

    // Cap at 500KB to prevent abuse
    if (html.length > 500_000) {
      return NextResponse.json({ error: 'Report too large.' }, { status: 400 });
    }

    await connectDB();

    const report = await IntegrityReport.create({
      html,
      studentName: studentName || '',
      assignmentName: assignmentName || '',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return NextResponse.json({ id: report._id.toString() });
  } catch (error) {
    console.error('Report save error:', error);
    return NextResponse.json({ error: 'Failed to save report.' }, { status: 500 });
  }
}
