import type { EnhancedAnalysisResult } from '@/components/plagiarism-detection/types';

export const TEACHER_ID_KEY = 'plagiarism_teacher_id';

export interface SaveHistoryInput {
  documentName: string;
  source: 'upload' | 'classroom';
  result: EnhancedAnalysisResult;
  studentName?: string;
  studentEmail?: string;
  courseId?: string;
  courseTitle?: string;
  assignmentId?: string;
  assignmentTitle?: string;
  driveFileId?: string;
  submittedAt?: string;
  context?: { gradeLevel?: number; subject?: string; assignmentType?: string };
}

/**
 * Save an analysis result to the teacher's history. No-op if the teacher
 * isn't connected (no teacherId in localStorage). Errors are swallowed —
 * history saving must never block the analysis flow.
 */
export async function saveAnalysisToHistory(input: SaveHistoryInput): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const teacherId = localStorage.getItem(TEACHER_ID_KEY);
  if (!teacherId) return null;

  try {
    const res = await fetch('/api/showcase/plagiarism-detection/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, ...input }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.id || null;
  } catch {
    return null;
  }
}
