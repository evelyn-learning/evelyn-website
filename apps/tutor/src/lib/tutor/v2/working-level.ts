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
import { TUTOR_V2_LEVEL_CHECK_MIN_ANSWERS, TUTOR_V2_LEVEL_RECONFIRM } from '../orchestrator/flags';

const SKIPPED_FOR_LEVEL = 'working level known from an earlier lesson';

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

/** Answers the level check needs before a level is set (the partner's brief: three conversational questions). */
export const V2_LEVEL_CHECK_MIN_ANSWERS = 3;

// Words that carry no answer: assent, a bare yes or no, thanks, readiness ("Yes, I'm ready.", "No, I haven't.").
const NO_CONTENT = new Set(('yes yeah yep yup no nope nah ok okay sure alright right fine good great nice thanks thank you i i\'m im am ready '
  + 'sound sounds that this it it\'s is was have haven\'t has do don\'t did didn\'t can can\'t will would let\'s lets go on please oh uh um '
  + 'er hmm well so too very much for the a lesson today understand understood see me we us also and of course really '
  + 'はい ええ うん いいえ いや ありがとうございます ありがとうございました わかりました 分かりました 大丈夫です お願いします よろしくお願いします').split(/\s+/));
// Asking for the question again is not an answer (findings case 1).
const CONFUSED = /\b(?:rephrase|repeat|say (?:that|it) again|(?:don'?t|didn'?t|do not|did not) (?:understand|get it|catch)|pardon|what do you mean|in japanese|more slowly|once more)\b|わかりません|分かりません|もう一度|ゆっくり/i;
// Asking to leave the level check out.
const SKIP = /\b(?:skip(?: (?:it|this|that|the (?:check|questions|test)))?|no (?:more )?(?:test|questions)|just (?:start|begin|teach)|(?:start|begin) the lesson)\b|飛ばし|スキップ/i;
const tokensOf = (t: string) => t.toLowerCase().replace(/[’]/g, "'").match(/[\p{L}\p{N}]+(?:'[\p{L}]+)*/gu) ?? [];
/** A reply that answers something: a word of content beyond assent, yes or no, and not a request to hear the question again. */
export function v2AnswerHasContent(text: string): boolean {
  const t = text.trim();
  if (!t || t.startsWith('[')) return false;
  const tokens = tokensOf(t);
  if (CONFUSED.test(t) && tokens.length <= 8) return false;
  return tokens.some((w) => !NO_CONTENT.has(w));
}
const textOf = (m: Anthropic.MessageParam) => (typeof m.content === 'string' ? m.content : m.content.map((b) => (b.type === 'text' ? b.text : '')).join(' '));
const studentTexts = (state: V2State) => state.history.filter(isStudentReply).map(textOf);

/** Why set_working_level must wait, or null when it may go ahead (D7: levels were set after two questions, one of them
 *  answered "No." twice). It waits until the learner has given three answers with content in this lesson, unless they
 *  asked to skip the check or the time is up. A remembered level's revision is not held. */
export function v2LevelSetTooEarly(state: V2State, heard: string | null | undefined, opts: { timeUp?: boolean; enabled?: boolean } = {}): string | null {
  if (!(opts.enabled ?? TUTOR_V2_LEVEL_CHECK_MIN_ANSWERS) || state.workingLevel || opts.timeUp) return null;
  const said = [...studentTexts(state), ...(heard ? [heard] : [])];
  if (said.some((x) => SKIP.test(x))) return null;
  // Not the reply budget (V2_LEVEL_CHECK_MAX_REPLIES): it counts the overview's replies too, and real-t2 had spent it
  // (two overview replies, a rephrase, two answers, two "No."s) at the very call this gate is for. Past the budget the
  // facts still stop asking for the check (v2LevelCheckOver); a level set later waits for answers with content.
  const n = said.filter(v2AnswerHasContent).length;
  if (n >= V2_LEVEL_CHECK_MIN_ANSWERS) return null;
  return `not set: they have answered ${n} of the level check's ${V2_LEVEL_CHECK_MIN_ANSWERS} questions (a yes, a no or a request to repeat is not an answer). Say nothing of this message. Ask your next level-check question, one short conversational question, and set the level once they have answered ${V2_LEVEL_CHECK_MIN_ANSWERS}.`;
}

/** The tool's effect on the state. A level set in this lesson is final (v1's once-only rule: "never re-test");
 *  a level remembered from an earlier lesson may be revised once, since whoever is on the link may be someone
 *  else (findings case 11: a second person inherited the first one's level and skipped the check). */
export function v2ApplySetWorkingLevel(state: V2State, args: Record<string, unknown>, ctx: { heard?: string | null; timeUp?: boolean } = {}): string {
  const early = v2LevelSetTooEarly(state, ctx.heard, { timeUp: ctx.timeUp });
  if (early) return early;
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

const studentReplies = (state: V2State) => state.history.filter(isStudentReply).length;

/** Student replies after which a level check that set no level is over, whatever the plan says: the opener's reply,
 *  three answers and room for two "could you rephrase that?". */
export const V2_LEVEL_CHECK_MAX_REPLIES = 6;

/** The level check is over without a level (review I1: with no end, "find it with three questions" stood in every
 *  turn's facts for the whole lesson when the estimate was off or failed, or the plan had no level-check part):
 *  the lesson has moved past the plan's level-check part, or the student has replied more than the check's budget.
 *  `heard` counts as a reply. */
export function v2LevelCheckOver(session: V2Session, state: V2State, heard: string | null | undefined): boolean {
  const plan = session.plan;
  if (plan && plan.segments.some((seg) => v2PartOf(seg).skipWhenLevelKnown) && v2LevelEstimateDue(plan, state.goals, undefined)) return true;
  return studentReplies(state) + (heard ? 1 : 0) > V2_LEVEL_CHECK_MAX_REPLIES;
}

/** The facts lines for the working level (levelCheck sessions only). `heard` is the student's words this turn;
 *  `reopened`: their words just now said the remembered level does not fit (v2ReopenLevelCheck). */
export function v2WorkingLevelFacts(session: V2Session, state: V2State, heard: string | null | undefined, opts: { reopened?: boolean; reconfirm?: boolean } = {}): string[] {
  if (!v2LevelCheckOn(session)) return [];
  const wl = state.workingLevel;
  const reconfirm = opts.reconfirm ?? TUTOR_V2_LEVEL_RECONFIRM;
  // The remembered level did not fit them: the check runs as for a newcomer (D6).
  const reopened = opts.reopened ? ['working level: the level remembered from an earlier lesson on this link did not fit them (their answer just now), so it is set aside and the level check is open again'] : [];
  // Over with no level: a middle pitch, adjusted from what they say; the tool stays open for a level that becomes clear.
  if (!wl && v2LevelCheckOver(session, state, heard)) return ['working level: not set, and the level check is over: do not check it again. Pitch at intermediate and adjust to how they speak; if their level becomes clear, call set_working_level once'];
  if (!wl) {
    const support = session.languages && session.languages.length > 1 ? `a few words of ${languageNameOf(session.languages[1]!)}` : 'an example';
    return [
      ...reopened,
      'working level: not known yet. Find it with three short conversational questions, one at a time (the plan\'s level-check part), then call set_working_level',
      // Findings case 1: "Could you please rephrase that?" / "Sorry, I don't understand" got the NEXT question on v1.
      `when they ask you to rephrase or say they did not understand, that is not an answer: ask the same question again, more simply (first in simpler English, then with ${support}); go to the next question only once they have answered this one`,
    ];
  }
  if (wl.from === 'this_lesson') return [`working level: ${wl.level} (set this lesson: keep to it, and do not check it again)`];
  // Remembered from an earlier lesson. Findings case 11: a second person on the same link inherited the level and
  // the check was skipped for a newcomer. The first exchange confirms it lightly instead of assuming it.
  const replies = studentReplies(state) + (heard ? 1 : 0);
  const head = `working level: ${wl.level}, remembered from an earlier lesson on this link; the parts marked to skip when the level is known are skipped`;
  if (!reconfirm) {
    if (replies === 0) return [`${head}. Whoever is here may be someone else: in your opening, ask one natural question about them whose answer shows how they speak (not a test; name no level)`];
    if (replies === 1) return [`${head}. Their reply just now is your check: if it shows another level, call set_working_level with that level; if it fits, carry on`];
    return [head];
  }
  // D6 (case 11 again on v2: the shared-link run went straight into the lesson). One light question, asked outright; the
  // level is named once, as the pace the lessons were taken at, never as a verdict on them.
  if (replies === 0) return [`${head}. Whoever is here may be someone else: in your opening, after the greeting, ask one light question to confirm it, in your own words: "Last time we worked at ${wl.level} level. Does that still feel right?" Not a test, and nothing more about the level`];
  if (replies === 1) return [`${head}. Their reply just now answers whether that level still feels right: if it does, carry on at it; if their words show another level, call set_working_level with that level`];
  return [head];
}

const DECLINES = [
  /^\s*(?:(?:um+|uh+|er+|hmm+|well|sorry|oh)[,.]?\s+)*(?:no\b(?![, ]+(?:problem|worries)\b)|nope\b|nah\b|not really|not (?:quite|exactly|sure|anymore|any more)|i'?m not sure|i don'?t (?:think so|know)|(?:it(?:'s| is| was) )?(?:a (?:bit|little) )?too (?:hard|difficult|easy|fast|slow))/i,
  /^[\s、。]*(?:いいえ|いや|ちょっと|難し|むずかし|わかりません|分かりません|自信がない|違います|合っていません)/,
];
/** Their answer to "does that still feel right?" says no (or not sure). */
export function v2DeclinesLevel(text: string | null | undefined): boolean {
  const t = (text ?? '').trim();
  return !!t && !t.startsWith('[') && DECLINES.some((re) => re.test(t));
}

/** A "no" to the light confirm re-opens the level check (D6): the remembered level is set aside and the level-check
 *  parts skipped for it come back, before the facts of the turn that answers it. True when it did so. */
export function v2ReopenLevelCheck(session: V2Session, state: V2State, heard: string | null | undefined, enabled: boolean = TUTOR_V2_LEVEL_RECONFIRM): boolean {
  if (!enabled || !v2LevelCheckOn(session) || state.workingLevel?.from !== 'earlier_lesson' || studentReplies(state) !== 0 || !v2DeclinesLevel(heard)) return false;
  delete state.workingLevel;
  for (const [id, g] of Object.entries(state.goals)) if (g.status === 'skipped' && g.why === SKIPPED_FOR_LEVEL) delete state.goals[id];
  return true;
}

/** A remembered level skips the plan's level-check parts: marked before the tutor's turn, so the tutor and the
 *  progress report both see them skipped (v1 started past them). Parts already marked keep their mark. */
export function v2MarkLevelKnownParts(session: V2Session, state: V2State, nowMs: number): void {
  if (!v2LevelCheckOn(session) || state.workingLevel?.from !== 'earlier_lesson' || !session.plan) return;
  for (const seg of session.plan.segments) {
    if (v2PartOf(seg).skipWhenLevelKnown && !state.goals[seg.id]) state.goals[seg.id] = { status: 'skipped', why: SKIPPED_FOR_LEVEL, at: nowMs };
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
 *  first, else the one remembered on the profile. A remembered level that arrives once the student has replied is
 *  not taken (review M1: the profile read is waited on for 1.5 s only; seeded late, it skipped a level check already
 *  under way and the first-exchange re-confirmation never happened). The same object when there is nothing to do. */
export function v2SeedWorkingLevel(state: V2State, from: { known?: WorkingLevel | null; estimated?: WorkingLevel | null }): V2State {
  if (state.workingLevel) return state;
  if (from.estimated) return { ...state, workingLevel: { level: from.estimated, from: 'this_lesson' } };
  if (from.known && studentReplies(state) === 0) return { ...state, workingLevel: { level: from.known, from: 'earlier_lesson' } };
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
