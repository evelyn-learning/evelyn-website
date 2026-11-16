/**
 * Tutor brain v2 — the one-time level check, remembered.
 *
 * A partner with `levelCheck` (partner-session-options.ts, under the TUTOR_WORKING_LEVEL kill switch) has the
 * tutor find the learner's working level once, with three conversational questions and the `set_working_level`
 * tool, and pitch the lesson at it. The level is kept on the learner's profile (StudentProfile.workingLevel,
 * through the existing commit route) and the next lesson starts from it: the plan's parts marked "skip when the
 * level is known" are skipped. If the tool was never called, the browser asks the estimate route
 * (level/estimate.ts) once the check is over. The ladder, the once-only rule and the per-level guidance are
 * v1's (level/working-level.ts).
 *
 * The level is in every turn's facts (facts.ts); the session part carries what each level means (stable, so it
 * stays in the cached prefix). Pure, client-safe.
 */
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../lesson-plan/types';
import { languageNameOf } from '../voice/language-request';
import { WORKING_LEVELS, WORKING_LEVEL_QUESTIONS, WORKING_LEVEL_SUPPORT, decideSetWorkingLevel, parseWorkingLevel, type WorkingLevel } from '../level/working-level';
import { discussionOf } from './discussion';
import { v2PartOf } from './plan-map';
import { v2Progress } from './progress';
import type { V2Session, V2State, V2WorkingLevel } from './types';

/** The level check runs in a taught lesson of a partner that has it: not in homework, which works the student's own
 *  problem, and not in a discussion, which has no level to pitch. */
export function v2LevelCheckOn(session: V2Session): boolean {
  return !!session.levelCheck && !session.homework && !session.homeworkSheet && !discussionOf(session.plan);
}

export const V2_SET_WORKING_LEVEL_TOOL: Anthropic.Tool = {
  name: 'set_working_level',
  description: 'Record the learner\'s working level, judged from what they actually said (how much of the lesson\'s language they used, how complete and accurate it was), whatever language they answered in. The learner does not see it. Call it once, when the level check is answered; when the facts give a level remembered from an earlier lesson, call it only if their answers show another level.',
  input_schema: {
    type: 'object',
    properties: {
      level: { type: 'string', enum: [...WORKING_LEVELS], description: 'The level to pitch the rest of the lesson at.' },
      evidence: { type: 'string', description: 'One short sentence on what in their answers led to it.' },
    },
    required: ['level', 'evidence'],
  },
};

/** The tool's effect on the state. A level set in this lesson is final (v1's once-only rule: "never re-test");
 *  a level remembered from an earlier lesson may be revised once, since whoever is on the link may be someone
 *  else (findings case 11: a second person inherited the first one's level and skipped the check). */
export function v2ApplySetWorkingLevel(state: V2State, args: Record<string, unknown>): string {
  const held = state.workingLevel?.from === 'this_lesson' ? state.workingLevel.level : null;
  const d = decideSetWorkingLevel(held, args.level);
  if (!d.ok || !d.level) return `not set: ${d.note ?? ''}`.trim();
  state.workingLevel = { level: d.level, from: 'this_lesson' };
  return d.note ?? 'set';
}

/** The session part's level section (levelCheck sessions only). Stable for the whole session. */
export function v2WorkingLevelSection(): string {
  const rung = (l: WorkingLevel) => `  - ${l}: questions: ${WORKING_LEVEL_QUESTIONS[l]} Support: ${WORKING_LEVEL_SUPPORT[l]}`;
  return [
    'WORKING LEVEL',
    // Without a pitch per level the same questions and help went to every learner (the partner's "adaptive learning" checkpoint).
    `The learner's working level is ${WORKING_LEVELS.join(', ')}. The facts say each turn whether it is known. Pitch your language, questions, help and corrections at it:`,
    ...WORKING_LEVELS.map(rung),
    // v1 Task 30 E5: "Let's work at the beginner level today" was spoken.
    'Never tell the learner a score, a CEFR level or a label such as "you are a beginner"; never use the level words about them. The level is how you pitch the lesson, not a verdict on them.',
    // v1: with all three versions on the page, the tutor read out every version.
    'When the lesson material gives versions marked [beginner], [intermediate] and [advanced], teach only the one marked with the working level, and never read out or mention the others.',
  ].join('\n');
}

/** Whether a message of the history is a reply in the student's own words (not a tool result or a runtime note). */
const isStudentReply = (m: Anthropic.MessageParam) => m.role === 'user' && (typeof m.content === 'string'
  ? !m.content.startsWith('[')
  : m.content.some((b) => b.type === 'text' && !b.text.startsWith('[')));

/** The facts lines for the working level (levelCheck sessions only). `heard` is the student's words this turn. */
export function v2WorkingLevelFacts(session: V2Session, state: V2State, heard: string | null | undefined): string[] {
  if (!v2LevelCheckOn(session)) return [];
  const wl = state.workingLevel;
  if (!wl) {
    const support = session.languages && session.languages.length > 1 ? `a few words of ${languageNameOf(session.languages[1]!)}` : 'an example';
    return [
      'working level: not known yet. Find it with three short conversational questions, one at a time (the plan\'s level-check part), then call set_working_level',
      // Findings case 1: "Could you please rephrase that?" / "Sorry, I don't understand" got the NEXT question on v1.
      `when they ask you to rephrase or say they did not understand, that is not an answer: ask the same question again, more simply (first in simpler English, then with ${support}); go to the next question only once they have answered this one`,
    ];
  }
  if (wl.from === 'this_lesson') return [`working level: ${wl.level} (set this lesson: keep to it, and do not check it again)`];
  // Remembered from an earlier lesson. Findings case 11: a second person on the same link inherited the level and
  // the check was skipped for a newcomer. The first exchange confirms it lightly instead of assuming it.
  const replies = state.history.filter(isStudentReply).length + (heard ? 1 : 0);
  const head = `working level: ${wl.level}, remembered from an earlier lesson on this link; the parts marked to skip when the level is known are skipped`;
  if (replies === 0) return [`${head}. Whoever is here may be someone else: in your opening, ask one natural question about them whose answer shows how they speak (not a test; name no level)`];
  if (replies === 1) return [`${head}. Their reply just now is your check: if it shows another level, call set_working_level with that level; if it fits, carry on`];
  return [head];
}

/** A remembered level skips the plan's level-check parts: marked before the tutor's turn, so the tutor and the
 *  progress report both see them skipped (v1 started past them). Parts already marked keep their mark. */
export function v2MarkLevelKnownParts(session: V2Session, state: V2State, nowMs: number): void {
  if (!v2LevelCheckOn(session) || state.workingLevel?.from !== 'earlier_lesson' || !session.plan) return;
  for (const seg of session.plan.segments) {
    if (v2PartOf(seg).skipWhenLevelKnown && !state.goals[seg.id]) state.goals[seg.id] = { status: 'skipped', why: 'working level known from an earlier lesson', at: nowMs };
  }
}

/** The estimate fallback is due: the plan has a level-check part, the lesson is past it (it is done, or a later
 *  part is in hand), and no level is held (v1 Task 14 §G: the tool was never called and the lesson ran unlevelled). */
export function v2LevelEstimateDue(plan: LessonPlan, goals: V2State['goals'], workingLevel: V2WorkingLevel | undefined): boolean {
  if (workingLevel) return false;
  const idx = plan.segments.map((seg, i) => (v2PartOf(seg).skipWhenLevelKnown ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return false;
  const { currentSegmentId, completedSegmentIds } = v2Progress(plan, goals);
  const at = plan.segments.findIndex((s) => s.id === currentSegmentId);
  return idx.every((i) => completedSegmentIds.includes(plan.segments[i]!.id) || i < at);
}

/** The level the browser puts in the state before a turn, when the state holds none: an estimate from this lesson
 *  first, else the one remembered on the profile. The same object when there is nothing to do. */
export function v2SeedWorkingLevel(state: V2State, from: { known?: WorkingLevel | null; estimated?: WorkingLevel | null }): V2State {
  if (state.workingLevel) return state;
  if (from.estimated) return { ...state, workingLevel: { level: from.estimated, from: 'this_lesson' } };
  if (from.known) return { ...state, workingLevel: { level: from.known, from: 'earlier_lesson' } };
  return state;
}

/** The route's reading of the level in the client's state: a bad level or source is dropped. */
export function v2ReadWorkingLevel(raw: unknown): V2WorkingLevel | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as { level?: unknown; from?: unknown };
  const level = parseWorkingLevel(r.level);
  if (!level || (r.from !== 'earlier_lesson' && r.from !== 'this_lesson')) return undefined;
  return { level, from: r.from };
}

/** The profile field for a level set this lesson (a remembered one is already there). */
export function v2WorkingLevelField(state: V2State, lessonPlanId: string | undefined): { workingLevel: { level: WorkingLevel; planId: string } } | Record<string, never> {
  return state.workingLevel?.from === 'this_lesson' ? { workingLevel: { level: state.workingLevel.level, planId: lessonPlanId ?? '' } } : {};
}

/** A trial's commit: the level alone. Trials keep no memory (no transcript, summary, gaps or mastery), but a
 *  partner's trial link that checks the level remembers it, as v1 did, through the same commit route. Null when
 *  no level was set this lesson. */
export function v2WorkingLevelCommit(input: { sessionId: string; subject: string; lessonPlanId?: string; state: V2State }): Record<string, unknown> | null {
  const field = v2WorkingLevelField(input.state, input.lessonPlanId);
  if (!('workingLevel' in field)) return null;
  return { sessionId: input.sessionId, subject: input.subject, ...(input.lessonPlanId ? { lessonPlanId: input.lessonPlanId } : {}), generateNotes: false, ...field };
}
