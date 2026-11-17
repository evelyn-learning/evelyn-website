/**
 * Tutor brain v2 — the level check, counted (Task 7d, LEVEL_CHECK_CAP).
 *
 * Mic test 1 (embed-1794882458629, 0.8–3.76 min): the check ran six tutor turns and five questions where the plan says three
 * (`segment_overlong` at 3.74). The facts said "find it with three short conversational questions" every turn and nothing
 * more, so the model kept its own count: a follow-up after question 2 ("What do you sell to them?") and a re-ask of
 * question 3 after an answer that missed it each took a turn, and only the reply budget (working-level.ts
 * V2_LEVEL_CHECK_MAX_REPLIES) ended it.
 *
 * The rule: follow-ups are not plan questions, but the check is done after three answered plan questions plus at most ONE
 * follow-up in the whole check. Counted here from the history, for the facts:
 *  - a tutor reply is the plan question it shares enough words with (one not yet answered), else a follow-up;
 *  - an answer counts only when it has content (working-level.ts v2AnswerHasContent: not a bare yes or no, not "I don't
 *    understand"); a re-ask after a reply with no answer in it is the same question, whatever its words, so a learner's
 *    confused reply is never cut short;
 *  - a second follow-up's answer counts as a plan question's (the facts said no more follow-ups; a plan question asked in
 *    words of the model's own is counted that way too, so the count is bounded either way).
 * Answers with content before the first reply that asks a plan question in its words count as questions asked in other words
 * (fix round 1, M4: as the gate counts them; the overview's "Okay." has no content); a plan
 * whose questions cannot be read, or whose questions were never asked in their words, counts every answer with content as a
 * question, as the gate on set_working_level does (working-level.ts v2LevelSetTooEarly): never stuck at "0 of 3".
 * Pure, client-safe.
 */
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../lesson-plan/types';
import { stripBoardBlocks } from './board-inline';
import { v2PartOf } from './plan-map';

/** Plan questions the check asks. */
export const V2_LEVEL_CHECK_QUESTIONS = 3;

const SMALL = new Set(('the and you your you\'d you\'re can could would will what which when where who how why about that this these those with have has had '
  + 'are was were for any one some me more like into from them they their there here then than just also very much does did do is it its '
  + 'not but our out get got let let\'s ever if so').split(/\s+/));
const contentWords = (t: string) => [...new Set((t.toLowerCase().replace(/[’]/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) ?? []).filter((w) => w.length >= 3 && !SMALL.has(w)))];
const same = (a: string, b: string) => a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5));

/** The plan's level-check part (the part marked to skip when the level is known), or null. */
export function v2LevelCheckPart(plan: LessonPlan | null | undefined): LessonPlan['segments'][number] | null {
  return plan?.segments.find((seg) => v2PartOf(seg).skipWhenLevelKnown) ?? null;
}

/** The questions the level-check part lists ("1. …\n2. …"), or none. */
export function v2LevelCheckQuestions(plan: LessonPlan | null | undefined): string[] {
  const seg = v2LevelCheckPart(plan) as { question?: unknown; problem?: unknown } | null;
  const raw = typeof seg?.question === 'string' ? seg.question : typeof seg?.problem === 'string' ? seg.problem : '';
  return raw.split(/\n+/).map((x) => x.replace(/^\s*\d+[.)]\s*/, '').trim()).filter((x) => /[?？]/.test(x));
}

/** Which of `open` (indexes into `questions`) the tutor's reply asks, by shared words, or -1. Enough words: half the
 *  question's, and at least two. */
export function v2MatchLevelQuestion(reply: string, questions: string[], open: number[]): number {
  const have = contentWords(stripBoardBlocks(reply));
  let best = -1; let bestN = 0;
  for (const i of open) {
    const want = contentWords(questions[i]!);
    const n = want.filter((w) => have.some((x) => same(w, x))).length;
    if (n >= Math.max(2, Math.ceil(want.length / 2)) && n > bestN) { best = i; bestN = n; }
  }
  return best;
}

export interface V2LevelCheckCount {
  /** Plan questions answered (with content). */
  answered: number;
  /** The one follow-up has been asked and answered. */
  followUp: boolean;
  /** Three are answered: the level is to be set now. */
  done: boolean;
  /** The plan's questions could be told apart from follow-ups (false: every answer counted as a question). */
  classified: boolean;
}

/** Final review M4: a question about them, not the overview's "Does that sound good?" / "Are you ready?": the level check has
 *  begun with it. */
const ABOUT_THEM = /^(?:(?:so|okay|ok|now|great|good|first|let'?s (?:begin|start)|to start)[,.!]?\s+)*(?:what|how|where|when|why|which|who|have you|has your|did you|do you|are you|were you|can you|could you|would you|tell me)\b[^?]*\?["'”’]*$/i;
const NOT_LEVEL = /\b(?:ready|sound(?:s)? good|okay|ok|all right|alright|clear|make sense|any questions?|shall we|start the lesson)\b/i;
const lastOf = (t: string) => stripBoardBlocks(t).split(/(?<=[.!?。！？]["'”’」)]*)\s+/).map((x) => x.trim()).filter(Boolean).pop() ?? '';
const textOf = (m: Anthropic.MessageParam) => (typeof m.content === 'string' ? m.content : m.content.map((b) => (b.type === 'text' ? b.text : '')).join(' '));
const isOwnWords = (m: Anthropic.MessageParam) => m.role === 'user' && !textOf(m).trim().startsWith('[');

/** The count, with `heard` (the learner's words this turn) as the newest answer. `hasContent`: working-level.ts
 *  v2AnswerHasContent (passed in: that module reads this one). */
export function v2CountLevelCheck(plan: LessonPlan | null | undefined, history: Anthropic.MessageParam[], heard: string | null | undefined, hasContent: (text: string) => boolean): V2LevelCheckCount {
  const questions = v2LevelCheckQuestions(plan);
  // Each of the learner's replies with the tutor's reply just before it.
  // `begun` (final review M4): the level check had begun when the tutor asked it: a reply after the one that marked a part
  // before the check (the overview), or a reply that asks a question about them. Small talk before it ("Sounds good, I'm a
  // little nervous today." to the opener) is no answer to a level question.
  const pairs: Array<{ tutor: string; said: string; begun: boolean }> = [];
  const levelAt = plan ? plan.segments.findIndex((seg) => v2PartOf(seg).skipWhenLevelKnown) : -1;
  const before = new Set(levelAt > 0 ? plan!.segments.slice(0, levelAt).map((seg) => seg.id) : []);
  let tutor = ''; let begun = false; let markedBefore = false;
  for (const m of history) {
    if (m.role === 'assistant') {
      const t = textOf(m);
      if (t.trim()) { tutor = t; if (markedBefore) begun = true; }
      if (Array.isArray(m.content) && m.content.some((b) => b.type === 'tool_use' && b.name === 'set_goal_status' && before.has(String((b.input as { goal?: unknown } | null)?.goal ?? '')))) markedBefore = true;
      continue;
    }
    if (isOwnWords(m)) {
      if (ABOUT_THEM.test(lastOf(tutor)) && !NOT_LEVEL.test(lastOf(tutor))) begun = true;
      pairs.push({ tutor, said: textOf(m), begun }); tutor = '';
    }
  }
  if (heard) { if (ABOUT_THEM.test(lastOf(tutor)) && !NOT_LEVEL.test(lastOf(tutor))) begun = true; pairs.push({ tutor, said: heard, begun }); }
  const all = questions.map((_, i) => i);
  const start = questions.length ? pairs.findIndex((p) => v2MatchLevelQuestion(p.tutor, questions, all) >= 0) : -1;
  if (start < 0) {
    const n = pairs.filter((p) => hasContent(p.said)).length;
    return { answered: Math.min(n, V2_LEVEL_CHECK_QUESTIONS), followUp: false, done: n >= V2_LEVEL_CHECK_QUESTIONS, classified: false };
  }
  const answered = new Set<number>(); let pending: number | null = null; let followUp = false; let extra = 0;
  for (const p of pairs.slice(start)) {
    const m = v2MatchLevelQuestion(p.tutor, questions, all.filter((i) => !answered.has(i)));
    if (m >= 0) pending = m;
    // A reply with no answer in it leaves the question open: the next reply re-asks it, in whatever words.
    if (!hasContent(p.said)) continue;
    if (pending !== null) { answered.add(pending); pending = null; } else if (!followUp) followUp = true; else extra += 1;
  }
  // Fix round 1 (M4): answers before the first question in the plan's words answered the check's questions in other words:
  // counted as questions, as the gate counts them, so the check is never done only after five answers.
  // Final review M4: only from when the check began (not the overview's small talk).
  const earlier = pairs.slice(0, start).filter((p) => p.begun && hasContent(p.said)).length;
  const n = Math.min(answered.size + extra + earlier, V2_LEVEL_CHECK_QUESTIONS);
  return { answered: n, followUp, done: n >= V2_LEVEL_CHECK_QUESTIONS, classified: true };
}

/** The facts line for the count (in place of "find it with three questions"). */
export function v2LevelCheckCountLine(c: V2LevelCheckCount): string {
  const of = V2_LEVEL_CHECK_QUESTIONS;
  if (c.done) return `level check: all ${of} questions answered${c.followUp ? ', and the one follow-up' : ''}: the check is done. Call set_working_level now, in this reply, and move on to the lesson; ask no more level questions`;
  const follow = !c.classified ? '' : c.followUp ? ', the one follow-up used: no more follow-ups' : ', no follow-up yet (at most one in the whole check, not one per question)';
  return `level check: ${c.answered} of ${of} questions asked and answered${follow}; a question asked again because they did not understand it is still the same question`;
}
