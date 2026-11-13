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
 *  enrolled students moved to v2). v1 takes a number from the tutor with each completed segment; v2 has two
 *  firmer signals: a practice segment the tutor marked as demonstrated, and the objectives it names at the
 *  close as not yet done alone. A score moves only on what the student did with a practice problem:
 *   - did one, and the objective is not named at the close: up, and full-weight evidence;
 *   - did one, but the objective is still named: up by half, half-weight evidence (right once, not yet secure);
 *   - was set one, did not get it, and the objective is named: down, a small step;
 *   - named at the close with no practice attempted (the lesson ended early, or never reached it): no change.
 *     Practice is still set for it; a score should not fall for work the student was never given. A student
 *     who solved a problem and left had the objective marked down under the first version of this rule
 *     (local run, 2026-11-12).
 *  A segment belongs to the objective its id is grouped under, else to the plan's only objective. */
export const V2_MASTERY_UP = 0.5;
export const V2_MASTERY_UP_MIXED = 0.25;
export const V2_MASTERY_DOWN = -0.2;
export function v2Mastery(plan: LessonPlan | null, goals: V2State['goals'], needsPracticeLoIds: string[] = []): { masteryDeltas: Array<{ loId: string; delta: number }>; segmentOutcomes: Array<{ segmentId: string; loId: string; kind: string; completed: boolean; outcome: number; streakAtComplete?: number }> } {
  if (!plan) return { masteryDeltas: [], segmentOutcomes: [] };
  const planLoIds = plan.los.map((lo) => lo.id);
  const weak = new Set(needsPracticeLoIds.filter((id) => planLoIds.includes(id)));
  const segmentOutcomes: ReturnType<typeof v2Mastery>['segmentOutcomes'] = [];
  const did = new Set<string>(); const triedOnly = new Set<string>();
  for (const seg of plan.segments) {
    const status = goals[seg.id]?.status;
    if (status !== 'demonstrated' && status !== 'shown') continue;
    const group = loGroupOf(seg.id);
    const signal = { segmentId: seg.id, segmentKind: seg.kind, planLoIds, loGroupId: group, source: 'complete' as const, demonstrated: true };
    const pre = resolveSegmentEvidence({ ...signal, streakAtComplete: undefined });
    if (!pre) continue; // not a practice segment, or no objective to credit
    if (status === 'shown') { triedOnly.add(pre.loId); continue; }
    const evidence = weak.has(pre.loId) ? pre : resolveSegmentEvidence({ ...signal, streakAtComplete: 1 }) ?? pre;
    segmentOutcomes.push({ segmentId: seg.id, loId: evidence.loId, kind: seg.kind, completed: true, outcome: evidence.outcome, ...(evidence.streakAtComplete ? { streakAtComplete: evidence.streakAtComplete } : {}) });
    did.add(evidence.loId);
  }
  const masteryDeltas: Array<{ loId: string; delta: number }> = [];
  for (const loId of planLoIds) {
    if (did.has(loId)) masteryDeltas.push({ loId, delta: weak.has(loId) ? V2_MASTERY_UP_MIXED : V2_MASTERY_UP });
    else if (weak.has(loId) && triedOnly.has(loId)) masteryDeltas.push({ loId, delta: V2_MASTERY_DOWN });
  }
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
