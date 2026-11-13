/**
 * Tutor brain v2 — what a partner's portal knows about the student, as plain facts.
 *
 * The academy sends, with each session, the student's progress through the course, things they have mentioned
 * about themselves, their stated goal, what a diagnostic found about their prerequisites and where assigned
 * practice appears in the portal. v1 renders these with instructions on how to use them
 * (student-profile/transient-context.ts); v2 is given the facts alone, one per line.
 */
import type { SocialThread, ProgressDigest } from '@evelyn/portal-contract/v1';

export interface V2BackgroundInput {
  socialMemory?: SocialThread[];
  progressDigest?: ProgressDigest;
  readinessNote?: string;
  practiceLocator?: string;
  goalNote?: string;
}

export const V2_BACKGROUND_MAX_LINES = 14;
export const V2_BACKGROUND_LINE_CHARS = 400;

export function v2Background(input: V2BackgroundInput): string[] {
  const lines: string[] = [];
  const d = input.progressDigest;
  if (d) lines.push(`Course progress: ${d.unitsCompleted} of ${d.unitsTotal} units complete (${Math.round(d.percentComplete)}%)${d.weeksElapsed !== undefined ? `, ${d.weeksElapsed} ${d.weeksElapsed === 1 ? 'week' : 'weeks'} in` : ''}${d.paceNote ? `. ${d.paceNote}` : ''}`);
  if (input.goalNote?.trim()) lines.push(`Their goal, in their words: ${input.goalNote.trim()}`);
  if (input.readinessNote?.trim()) lines.push(`From a diagnostic before the course: ${input.readinessNote.trim()}`);
  for (const t of input.socialMemory ?? []) {
    if (!t.note?.trim()) continue;
    lines.push(`They have mentioned: ${t.note.trim().replace(/^goal:\s*/i, 'a goal, ')}${t.lastReferencedAt ? ` (you last brought this up on ${t.lastReferencedAt.slice(0, 10)})` : ''}`);
  }
  if (input.practiceLocator?.trim()) lines.push(`Practice set for them after a session appears in their course under: ${input.practiceLocator.trim()}`);
  return lines.slice(0, V2_BACKGROUND_MAX_LINES).map((l) => l.replace(/\s+/g, ' ').slice(0, V2_BACKGROUND_LINE_CHARS));
}
