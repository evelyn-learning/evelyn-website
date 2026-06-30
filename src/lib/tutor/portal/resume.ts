/**
 * Resume snapshot builder (client side, shared by the embed + /tutor).
 *
 * Maps the prior-session read from GET /api/tutor/session-usage?sessionId=
 * into the runtime's `TutorResumeState`, enforcing RESUME_MAX_AGE_MS so the
 * engine makes the same new-vs-continue decision everywhere (contract §1.4).
 * The progress display is structural and never expires; this only gates
 * resuming the live conversation.
 */

import { RESUME_MAX_AGE_MS } from '@evelyn/portal-contract/v1';
import type { TranscriptEntry } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { TutorResumeState } from '@/app/tutor/components/VoiceTutorRealtime';

/** Raw shape returned by GET /api/tutor/session-usage?sessionId=. */
export interface PriorSessionRead {
  exists?: boolean;
  status?: string;
  subject?: string;
  topic?: string;
  level?: string;
  sessionGoal?: string;
  studentName?: string;
  inputMode?: string;
  startedAt?: string;
  lessonProgress?: {
    lessonPlanId?: string;
    currentSegmentId?: string;
    completedSegmentIds?: string[];
    updatedAt?: string;
  } | null;
  transcript?: Array<{ role?: string; text?: string; timestamp?: string }>;
  whiteboardCommands?: Array<{ action: string; data?: Record<string, unknown> }>;
}

/** True when the checkpoint is within the conversation-resume window (§1.4). */
export function isCheckpointResumable(updatedAt?: string): boolean {
  if (!updatedAt) return false;
  const t = new Date(updatedAt).getTime();
  return Number.isFinite(t) && t > 0 && Date.now() - t <= RESUME_MAX_AGE_MS;
}

/**
 * Build the runtime resume snapshot from a prior-session read. Returns null
 * when there is no checkpoint within RESUME_MAX_AGE_MS (caller starts fresh).
 */
export function buildResumeState(data: PriorSessionRead | null | undefined): TutorResumeState | null {
  const cp = data?.lessonProgress;
  if (!cp || !cp.lessonPlanId || !isCheckpointResumable(cp.updatedAt)) return null;

  const transcript: TranscriptEntry[] = (Array.isArray(data?.transcript) ? data!.transcript : []).map((t, i) => ({
    id: `resume-${i}`,
    role: (t.role === 'tutor' || t.role === 'system' ? t.role : 'student') as TranscriptEntry['role'],
    text: typeof t.text === 'string' ? t.text : '',
    timestamp: t.timestamp ? new Date(t.timestamp) : new Date(),
  }));

  const whiteboardCommands: WhiteboardCommand[] = (Array.isArray(data?.whiteboardCommands) ? data!.whiteboardCommands : []).map((c) => ({
    // `data` was stored as { ...cmd, action: undefined }; spread it FIRST and
    // restore `action` last or it clobbers to undefined.
    ...(c.data && typeof c.data === 'object' ? c.data : {}),
    action: c.action,
  })) as WhiteboardCommand[];

  return {
    currentSegmentId: typeof cp.currentSegmentId === 'string' ? cp.currentSegmentId : '',
    completedSegmentIds: Array.isArray(cp.completedSegmentIds) ? cp.completedSegmentIds : [],
    transcript,
    whiteboardCommands,
  };
}
