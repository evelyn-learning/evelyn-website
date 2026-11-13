/**
 * Tutor brain v2 — what the engine remembers of a student between sessions.
 *
 * The engine keeps a profile per student (student-profile/): a summary of each recent session, gaps still
 * open, what the student and tutor agreed to do next. v1 reads it into its prompt at the start and commits to
 * it at the end. v2 does the same through the same route: the profile's facts join the student's background
 * (background.ts) one per line, and the close commits the transcript (the server writes the session summary
 * from it), the gaps the tutor recorded, and how each part of the plan went.
 */
import { resolveSegmentEvidence } from '../orchestrator/segment-evidence';
import { loGroupOf } from '../lesson-plan/context';
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
/** Mastery, per plan objective, read off what v2 records (Praveen 2026-11-12: ported before any tenant with
 *  enrolled students moves to v2). v1 takes a number from the tutor with each completed segment; v2 has no such
 *  number, and has two firmer signals instead: a practice segment the tutor marked as demonstrated, and the
 *  objectives it names at the close as not yet done alone.
 *   - evidence rows (the learner model): one per demonstrated practice segment, through the resolver v1 uses,
 *     at full weight unless its objective is among those still needing practice;
 *   - a mastery step per objective: down for one that still needs practice, up for one with a demonstrated
 *     practice segment, none for one that was only taught (it is still listed as touched).
 *  A segment belongs to the objective its id is grouped under, else to the plan's only objective. */
export const V2_MASTERY_UP = 0.5;
export const V2_MASTERY_DOWN = -0.3;
export function v2Mastery(plan: LessonPlan | null, goals: V2State['goals'], needsPracticeLoIds: string[] = []): { masteryDeltas: Array<{ loId: string; delta: number }>; segmentOutcomes: Array<{ segmentId: string; loId: string; kind: string; completed: boolean; outcome: number; streakAtComplete?: number }> } {
  if (!plan) return { masteryDeltas: [], segmentOutcomes: [] };
  const planLoIds = plan.los.map((lo) => lo.id);
  const weak = new Set(needsPracticeLoIds.filter((id) => planLoIds.includes(id)));
  const segmentOutcomes: ReturnType<typeof v2Mastery>['segmentOutcomes'] = [];
  const shownAlone = new Set<string>();
  for (const seg of plan.segments) {
    if (goals[seg.id]?.status !== 'demonstrated') continue;
    const group = loGroupOf(seg.id);
    const pre = resolveSegmentEvidence({ segmentId: seg.id, segmentKind: seg.kind, planLoIds, loGroupId: group, source: 'complete', streakAtComplete: undefined, demonstrated: true });
    if (!pre) continue;
    const solid = !weak.has(pre.loId);
    const evidence = solid ? resolveSegmentEvidence({ segmentId: seg.id, segmentKind: seg.kind, planLoIds, loGroupId: group, source: 'complete', streakAtComplete: 1, demonstrated: true }) ?? pre : pre;
    segmentOutcomes.push({ segmentId: seg.id, loId: evidence.loId, kind: seg.kind, completed: true, outcome: evidence.outcome, ...(evidence.streakAtComplete ? { streakAtComplete: evidence.streakAtComplete } : {}) });
    if (solid) shownAlone.add(evidence.loId);
  }
  const masteryDeltas = [...[...weak].map((loId) => ({ loId, delta: V2_MASTERY_DOWN })), ...[...shownAlone].map((loId) => ({ loId, delta: V2_MASTERY_UP }))];
  return { masteryDeltas, segmentOutcomes };
}

export function v2ProfileCommit(input: { needsPracticeLoIds?: string[]; sessionId: string; subject: string; level: string; topic?: string; lessonPlanId?: string; plan: LessonPlan | null; state: V2State; transcript: Array<{ role: string; text?: string }> }): Record<string, unknown> {
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
    ...v2Mastery(plan, state.goals, input.needsPracticeLoIds),
    // A gap the student closed alone in the session is not carried forward.
    gaps: (state.gaps ?? []).filter((g) => g.status !== 'done_alone').map((g) => ({ kind: 'prerequisite' as const, conceptLabel: g.what.slice(0, 120), observation: GAP_NOTE[g.status] ?? g.status })),
    transcript: input.transcript.filter((t) => (t.text ?? '').trim()).map((t) => ({ role: t.role === 'user' || t.role === 'student' ? 'student' as const : 'tutor' as const, text: String(t.text).slice(0, 4000) })),
    ...(state.closeSummary?.trim() ? { nextSessionIntent: state.closeSummary.trim().slice(0, 200) } : {}),
  };
}
