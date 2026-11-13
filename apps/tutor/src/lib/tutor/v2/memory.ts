/**
 * Tutor brain v2 — what the engine remembers of a student between sessions.
 *
 * The engine keeps a profile per student (student-profile/): a summary of each recent session, gaps still
 * open, what the student and tutor agreed to do next. v1 reads it into its prompt at the start and commits to
 * it at the end. v2 does the same through the same route: the profile's facts join the student's background
 * (background.ts) one per line, and the close commits the transcript (the server writes the session summary
 * from it), the gaps the tutor recorded, and how each part of the plan went.
 */
import type { LessonPlan } from '../lesson-plan/types';
import type { StudentProfile } from '../student-profile/types';
import type { V2State } from './types';

const day = (iso: string | undefined) => (iso ?? '').slice(0, 10);

/** The profile as plain lines for the tutor. Nothing from the session in progress (`sessionId`) is repeated. */
export function v2MemoryLines(profile: Partial<StudentProfile> | null | undefined, sessionId?: string): string[] {
  if (!profile) return [];
  const lines: string[] = [];
  const earlier = (profile.recentSessions ?? []).filter((s) => s.sessionId !== sessionId && s.summary?.trim() && !s.thin)
    .sort((a, b) => (b.endedAt ?? '').localeCompare(a.endedAt ?? '')).slice(0, 3);
  for (const s of earlier) lines.push(`Earlier session${s.endedAt ? ` on ${day(s.endedAt)}` : ''}${s.topic ? ` (${s.topic})` : ''}: ${s.summary!.trim()}`);
  const next = profile.nextSessionIntent;
  if (next?.text?.trim() && next.sessionId !== sessionId) lines.push(`At the end of the last session the plan for next time was: ${next.text.trim()}`);
  const open = (profile.gaps ?? []).filter((g) => g.status !== 'resolved').sort((a, b) => (b.lastSeenAt ?? '').localeCompare(a.lastSeenAt ?? '')).slice(0, 5);
  for (const g of open) { const what = g.evidence?.observation ?? g.description ?? g.conceptLabel ?? ''; if (what.trim()) lines.push(`A gap seen before${g.lastSeenAt ? ` (${day(g.lastSeenAt)})` : ''}: ${g.conceptLabel && g.conceptLabel !== what ? `${g.conceptLabel}. ` : ''}${what.trim()}`); }
  const p = profile.preferences;
  if (p?.pacing && p.pacing !== 'default') lines.push(`They prefer a ${p.pacing} pace.`);
  if (p?.interests?.length) lines.push(`Their interests (for everyday examples only): ${p.interests.slice(0, 5).join(', ')}`);
  return lines;
}

const GAP_NOTE: Record<string, string> = { found: 'Seen in the session, not yet worked on.', explained: 'Explained to them; they have not yet done one themselves.', done_with_help: 'They did one with help, not yet alone.' };

/** The commit made when a v2 session ends. */
export function v2ProfileCommit(input: { sessionId: string; subject: string; level: string; topic?: string; lessonPlanId?: string; plan: LessonPlan | null; state: V2State; transcript: Array<{ role: string; text?: string }> }): Record<string, unknown> {
  const { plan, state } = input;
  const touched = plan ? plan.segments.filter((seg) => state.goals[seg.id]) : [];
  return {
    sessionId: input.sessionId,
    endedAt: new Date().toISOString(),
    durationMinutes: Math.max(0, Math.round((Date.now() - state.startedAtMs) / 60000)),
    subject: input.subject,
    ...(input.topic ? { topic: input.topic } : plan?.title ? { topic: plan.title } : {}),
    grade: input.level,
    ...(input.lessonPlanId ? { lessonPlanId: input.lessonPlanId } : {}),
    // The plan's objectives count as touched once the lesson has moved past its opening.
    losTouched: plan && touched.length > 1 ? plan.los.map((lo) => lo.id) : [],
    // A gap the student closed alone in the session is not carried forward.
    gaps: (state.gaps ?? []).filter((g) => g.status !== 'done_alone').map((g) => ({ kind: 'prerequisite' as const, conceptLabel: g.what.slice(0, 120), observation: GAP_NOTE[g.status] ?? g.status })),
    transcript: input.transcript.filter((t) => (t.text ?? '').trim()).map((t) => ({ role: t.role === 'user' || t.role === 'student' ? 'student' as const : 'tutor' as const, text: String(t.text).slice(0, 4000) })),
    ...(state.closeSummary?.trim() ? { nextSessionIntent: state.closeSummary.trim().slice(0, 200) } : {}),
  };
}
