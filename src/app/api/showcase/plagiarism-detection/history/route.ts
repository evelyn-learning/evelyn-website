import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { connectDB } from '@/lib/db';
import { AnalysisHistory } from '@/models/AnalysisHistory';
import { Teacher } from '@/models/Teacher';

const MAX_LIST = 200;

interface AnalyzeResultLike {
  overallScore?: number;
  overallVerdict?: string;
  aiDetection?: { score?: number; verdict?: string };
  plagiarism?: { score?: number; verdict?: string };
}

function isObjectId(s: string): boolean {
  return Types.ObjectId.isValid(s);
}

// Strip any unexpected raw-text-shaped field defensively before persisting.
// We never store the submitted text — only result metadata. This is a
// belt-and-suspenders guard in case a caller sends extra fields.
function sanitizeResult(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object') return {};
  const r = { ...(input as Record<string, unknown>) };
  delete r.text;
  delete r.submittedText;
  delete r.rawText;
  delete r.documentText;
  return r;
}

export async function GET(req: NextRequest) {
  const teacherId = new URL(req.url).searchParams.get('teacherId');
  if (!teacherId || !isObjectId(teacherId)) {
    return NextResponse.json({ error: 'teacherId required' }, { status: 400 });
  }

  try {
    await connectDB();
    const items = await AnalysisHistory.find({ teacherId })
      .sort({ createdAt: -1 })
      .limit(MAX_LIST)
      .select(
        '_id documentName source studentName courseTitle assignmentTitle context overallScore overallVerdict aiScore aiVerdict plagiarismScore plagiarismVerdict createdAt submittedAt'
      )
      .lean();
    return NextResponse.json({ items });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load history';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: {
    teacherId?: string;
    documentName?: string;
    source?: 'upload' | 'classroom';
    studentName?: string;
    studentEmail?: string;
    courseId?: string;
    courseTitle?: string;
    assignmentId?: string;
    assignmentTitle?: string;
    driveFileId?: string;
    submittedAt?: string;
    context?: { gradeLevel?: number; subject?: string; assignmentType?: string };
    result?: AnalyzeResultLike;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.teacherId || !isObjectId(body.teacherId)) {
    return NextResponse.json({ error: 'teacherId required' }, { status: 400 });
  }
  if (!body.documentName || !body.source || !body.result) {
    return NextResponse.json({ error: 'documentName, source, and result are required' }, { status: 400 });
  }
  if (body.source !== 'upload' && body.source !== 'classroom') {
    return NextResponse.json({ error: 'source must be "upload" or "classroom"' }, { status: 400 });
  }

  try {
    await connectDB();

    // Verify the teacher actually exists — prevents writing orphan history.
    const teacher = await Teacher.findById(body.teacherId).select('_id').lean();
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const r = body.result;
    const doc = await AnalysisHistory.create({
      teacherId: body.teacherId,
      documentName: body.documentName,
      source: body.source,
      studentName: body.studentName,
      studentEmail: body.studentEmail,
      courseId: body.courseId,
      courseTitle: body.courseTitle,
      assignmentId: body.assignmentId,
      assignmentTitle: body.assignmentTitle,
      driveFileId: body.driveFileId,
      submittedAt: body.submittedAt ? new Date(body.submittedAt) : undefined,
      context: body.context,
      overallScore: r.overallScore ?? 0,
      overallVerdict: r.overallVerdict ?? '',
      aiScore: r.aiDetection?.score ?? 0,
      aiVerdict: r.aiDetection?.verdict ?? '',
      plagiarismScore: r.plagiarism?.score ?? 0,
      plagiarismVerdict: r.plagiarism?.verdict ?? '',
      result: sanitizeResult(r),
    });

    return NextResponse.json({ id: String(doc._id) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save history';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
