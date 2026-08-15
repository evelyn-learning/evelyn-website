import { NextRequest, NextResponse } from 'next/server';
import { listSubmissions } from '@/lib/google/classroom-client';
import { extractTextFromDriveFile } from '@/lib/google/drive-extract';
import { analyzeText, type AnalyzeContext } from '@/lib/plagiarism/analyze-text';
import { GoogleAuthError } from '@/lib/google/token-refresh';
import type { ClassroomSubmission } from '@/lib/google/types';

interface AnalyzedSubmission {
  id: string;
  fileName: string;
  studentName: string;
  studentEmail?: string;
  driveFileId: string;
  submittedAt?: string;
  status: 'complete' | 'error';
  result?: Awaited<ReturnType<typeof analyzeText>>;
  error?: string;
}

const CONCURRENCY = 3;

async function processOne(
  teacherId: string,
  sub: ClassroomSubmission,
  context: AnalyzeContext | undefined
): Promise<AnalyzedSubmission> {
  const attachment = sub.attachments[0];
  if (!attachment) {
    return {
      id: sub.id,
      fileName: '(no attachment)',
      studentName: sub.studentName,
      studentEmail: sub.studentEmail,
      driveFileId: '',
      submittedAt: sub.submittedAt,
      status: 'error',
      error: 'No Drive attachment on this submission.',
    };
  }

  try {
    const extracted = await extractTextFromDriveFile(teacherId, attachment.driveFileId);
    const wordCount = extracted.text.trim().split(/\s+/).length;

    // Observability: log extracted-text fingerprint so we can diagnose why the
    // same essay scores differently across PDF / Word / Google Doc. Logs the
    // length, mimeType, and first/last 200 chars (no full text — FERPA).
    const head = extracted.text.slice(0, 200).replace(/\n/g, '\\n');
    const tail = extracted.text.slice(-200).replace(/\n/g, '\\n');
    console.log(
      '[classroom.analyze] extracted',
      JSON.stringify({
        submissionId: sub.id,
        driveFileId: attachment.driveFileId,
        mimeType: extracted.mimeType,
        fileName: extracted.fileName,
        chars: extracted.text.length,
        words: wordCount,
        head,
        tail,
      })
    );

    if (wordCount < 50) {
      return {
        id: sub.id,
        fileName: extracted.fileName,
        studentName: sub.studentName,
        studentEmail: sub.studentEmail,
        driveFileId: attachment.driveFileId,
        submittedAt: sub.submittedAt,
        status: 'error',
        error: `Submission has only ${wordCount} words; minimum 50 required for analysis.`,
      };
    }

    const result = await analyzeText({ text: extracted.text, context });

    return {
      id: sub.id,
      fileName: extracted.fileName,
      studentName: sub.studentName,
      studentEmail: sub.studentEmail,
      driveFileId: attachment.driveFileId,
      submittedAt: sub.submittedAt,
      status: 'complete',
      result,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Analysis failed';
    // Log server-side so failures are debuggable from pm2 logs.
    // Includes student id + drive file id + the full error so we can correlate
    // a "Failed" badge in the UI with a specific log line.
    console.error(
      '[classroom.analyze] submission failed',
      JSON.stringify({
        submissionId: sub.id,
        studentId: sub.studentId,
        driveFileId: attachment.driveFileId,
        fileName: attachment.title,
        error: msg,
        stack: err instanceof Error ? err.stack : undefined,
      })
    );
    return {
      id: sub.id,
      fileName: attachment.title || attachment.driveFileId,
      studentName: sub.studentName,
      studentEmail: sub.studentEmail,
      driveFileId: attachment.driveFileId,
      submittedAt: sub.submittedAt,
      status: 'error',
      error: msg,
    };
  }
}

async function runWithConcurrency<T>(items: T[], limit: number, fn: (t: T) => Promise<AnalyzedSubmission>): Promise<AnalyzedSubmission[]> {
  const results: AnalyzedSubmission[] = [];
  let cursor = 0;
  const workers: Promise<void>[] = [];
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    workers.push((async () => {
      while (cursor < items.length) {
        const idx = cursor++;
        const out = await fn(items[idx]);
        results[idx] = out;
      }
    })());
  }
  await Promise.all(workers);
  return results;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> }
) {
  const { courseId, assignmentId } = await params;
  let body: { teacherId?: string; context?: AnalyzeContext } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const teacherId = body.teacherId;
  if (!teacherId) {
    return NextResponse.json({ error: 'teacherId required' }, { status: 400 });
  }

  try {
    const submissions = await listSubmissions(teacherId, courseId, assignmentId);
    const turnedIn = submissions.filter(s => s.attachments.length > 0);

    const analyzed = await runWithConcurrency(turnedIn, CONCURRENCY, sub =>
      processOne(teacherId, sub, body.context)
    );

    const skipped = submissions
      .filter(s => s.attachments.length === 0)
      .map<AnalyzedSubmission>(s => ({
        id: s.id,
        fileName: '(no attachment)',
        studentName: s.studentName,
        studentEmail: s.studentEmail,
        driveFileId: '',
        submittedAt: s.submittedAt,
        status: 'error',
        error: 'Student has not turned in any Drive attachment.',
      }));

    return NextResponse.json({ submissions: [...analyzed, ...skipped] });
  } catch (err) {
    if (err instanceof GoogleAuthError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 401 });
    }
    const msg = err instanceof Error ? err.message : 'Batch analysis failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
