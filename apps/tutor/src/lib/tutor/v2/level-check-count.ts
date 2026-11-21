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
import { v2WithoutCutBoardNote } from './interrupted';
import type { LessonPlan } from '../lesson-plan/types';
import { stripBoardBlocks } from './board-inline';
import { v2PartOf } from './plan-map';
import { TUTOR_V2_LEVEL_CHECK_PUT } from '../orchestrator/flags';
import { V2_CHECK_INS, v2ContentWords, v2LatinOnly, v2SameQuestion, v2SameWord } from './question-overlap';

/** Task 8a fix round 1 (M3): the level set when the check's time is up with no answer (the plan gives no starting level; the facts' "over"
 *  line pitches at intermediate too, working-level.ts). */
export const V2_LEVEL_CHECK_DEFAULT = 'intermediate';
/** Plan questions the check asks. */
export const V2_LEVEL_CHECK_QUESTIONS = 3;

// Task 8a fix round 1: the content words and the stem rule moved to question-overlap.ts (the re-test bookkeeping reads them too).
const contentWords = v2ContentWords;
const same = v2SameWord;

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
  /** Task 8a (LEVEL_CHECK_PUT): done because the level-check part has had its minutes, not by the count. */
  timeUp?: true;
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
/** Task 8a (LEVEL_CHECK_PUT, `put`): an answer counts only where it answers a question put (v2LevelQuestionsPut: not words that go on
 *  with an answer after a cut reply, not the same question asked again), and the count is never above the gate's (v2LevelQuestionsAnswered),
 *  so the facts never say "set it now" while set_working_level is refused. `timeUp`: the level-check part has had its minutes (time-fit.ts
 *  v2LevelCheckTimeUp): done. */
export function v2CountLevelCheck(plan: LessonPlan | null | undefined, history: Anthropic.MessageParam[], heard: string | null | undefined, hasContent: (text: string) => boolean, opts: { put?: boolean; timeUp?: boolean } = {}): V2LevelCheckCount {
  const put = opts.put ?? TUTOR_V2_LEVEL_CHECK_PUT;
  const c = countLevelCheck(plan, history, heard, hasContent, put);
  if (!put) return c;
  const n = Math.min(c.answered, v2LevelQuestionsAnswered(history, heard, hasContent));
  const timeUp = !!opts.timeUp && n < V2_LEVEL_CHECK_QUESTIONS;
  return { ...c, answered: n, done: n >= V2_LEVEL_CHECK_QUESTIONS || timeUp, ...(timeUp ? { timeUp: true } : {}) };
}
function countLevelCheck(plan: LessonPlan | null | undefined, history: Anthropic.MessageParam[], heard: string | null | undefined, hasContent: (text: string) => boolean, put: boolean): V2LevelCheckCount {
  const questions = v2LevelCheckQuestions(plan);
  // Each of the learner's replies with the tutor's reply just before it.
  // `begun` (final review M4): the level check had begun when the tutor asked it: a reply after the one that marked a part
  // before the check (the overview), or a reply that asks a question about them. Small talk before it ("Sounds good, I'm a
  // little nervous today." to the opener) is no answer to a level question.
  const pairs: Array<{ tutor: string; said: string; begun: boolean; fresh?: boolean }> = [];
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
  // Task 8a (LEVEL_CHECK_PUT): each answer marked as answering a question put, or not (v2LevelQuestionsPut, on the same history).
  if (put) { const fresh = v2LevelQuestionsPut(history, heard, hasContent); pairs.forEach((p, i) => { p.fresh = fresh[i] ?? false; }); }
  const counts = (p: { said: string; fresh?: boolean }) => hasContent(p.said) && (!put || !!p.fresh);
  const all = questions.map((_, i) => i);
  const start = questions.length ? pairs.findIndex((p) => v2MatchLevelQuestion(p.tutor, questions, all) >= 0) : -1;
  if (start < 0) {
    const n = pairs.filter(counts).length;
    return { answered: Math.min(n, V2_LEVEL_CHECK_QUESTIONS), followUp: false, done: n >= V2_LEVEL_CHECK_QUESTIONS, classified: false };
  }
  const answered = new Set<number>(); let pending: number | null = null; let followUp = false; let extra = 0;
  for (const p of pairs.slice(start)) {
    const m = v2MatchLevelQuestion(p.tutor, questions, all.filter((i) => !answered.has(i)));
    if (m >= 0) pending = m;
    // A reply with no answer in it leaves the question open: the next reply re-asks it, in whatever words.
    if (!counts(p)) continue;
    if (pending !== null) { answered.add(pending); pending = null; } else if (!followUp) followUp = true; else extra += 1;
  }
  // Fix round 1 (M4): answers before the first question in the plan's words answered the check's questions in other words:
  // counted as questions, as the gate counts them, so the check is never done only after five answers.
  // Final review M4: only from when the check began (not the overview's small talk).
  const earlier = pairs.slice(0, start).filter((p) => p.begun && counts(p)).length;
  const n = Math.min(answered.size + extra + earlier, V2_LEVEL_CHECK_QUESTIONS);
  return { answered: n, followUp, done: n >= V2_LEVEL_CHECK_QUESTIONS, classified: true };
}

/** Task 7g (LEVEL_CHECK_CHIP): the level check has begun: a tutor reply has asked a plan level question in its words (in its
 *  last two sentences), or, after the learner's first reply, ends on a question about them (the count's `begun`, above). The
 *  overview's "Does that sound good?" is not one. Pure. */
export function v2LevelCheckBegun(plan: LessonPlan | null | undefined, history: Anthropic.MessageParam[]): boolean {
  if (!v2LevelCheckPart(plan)) return false;
  const questions = v2LevelCheckQuestions(plan); const all = questions.map((_, i) => i);
  let replied = false;
  for (const m of history) {
    if (m.role !== 'assistant') { if (isOwnWords(m)) replied = true; continue; }
    const t = stripBoardBlocks(textOf(m));
    if (!t.trim()) continue;
    const tail = t.split(/(?<=[.!?。！？]["'”’」)]*)\s+/).map((x) => x.trim()).filter(Boolean).slice(-2).join(' ');
    if (questions.length && v2MatchLevelQuestion(tail, questions, all) >= 0) return true;
    const last = lastOf(t);
    if (replied && ABOUT_THEM.test(last) && !NOT_LEVEL.test(last)) return true;
  }
  return false;
}

/** The facts line for the count (in place of "find it with three questions"). */
export function v2LevelCheckCountLine(c: V2LevelCheckCount): string {
  const of = V2_LEVEL_CHECK_QUESTIONS;
  // Task 8a (LEVEL_CHECK_PUT): the check's time is up before the count.
  // Fix round 1 (M3): no answer to judge from: the default starting level, not a level "from what they have said".
  if (c.done && c.timeUp && c.answered === 0) return `level check: its time is up and no question of it has been answered, so there is nothing to judge a level from: call set_working_level now, in this reply, with ${V2_LEVEL_CHECK_DEFAULT} (the default starting level; it says so in its evidence), adjust your pitch to how they speak, and move on to the lesson; ask no more level questions`;
  if (c.done && c.timeUp) return `level check: its time is up (${c.answered} of ${of} questions asked and answered): the check is done. Call set_working_level now, in this reply, from what they have said, and move on to the lesson; ask no more level questions`;
  if (c.done) return `level check: all ${of} questions answered${c.followUp ? ', and the one follow-up' : ''}: the check is done. Call set_working_level now, in this reply, and move on to the lesson; ask no more level questions`;
  const follow = !c.classified ? '' : c.followUp ? ', the one follow-up used: no more follow-ups' : ', no follow-up yet (at most one in the whole check, not one per question)';
  return `level check: ${c.answered} of ${of} questions asked and answered${follow}; a question asked again because they did not understand it is still the same question`;
}

/** Task 8a (LEVEL_CHECK_PUT): a last sentence that asks for an answer with no question mark ("Tell me about the work you do, please."). */
const TELL_ME = /^(?:(?:so|okay|ok|now|first|great|good|then)[,.!]?\s+)*(?:please\s+)?(?:tell me|describe|talk (?:to me )?about)\b/i;
/** Task 8a (LEVEL_CHECK_PUT): the question a tutor reply put, as stored in the history: the last sentence of its heard words that ends on a
 *  question mark (an ask whether they are ready or have a question is none), or a last heard sentence that asks for an answer without one
 *  (TELL_ME), else the question of a question card it wrote inline (only when the reply was not cut: a cut reply's card was not reached).
 *  Null: it put none. Fix round 1 (I1): a Latin-script ask first when the reply has one (in a bilingual check the last "?" sentence is
 *  often the Japanese gloss of the English ask); (M1) the runtime's own check-in (V2_CHECK_INS, appended by turn.ts to a reply that asked
 *  nothing) is never a question put. */
export function v2LevelQuestionOf(reply: string): string | null {
  const cut = /\[cut off[^\]]*\]/i.test(reply);
  const heard = stripBoardBlocks(v2WithoutCutBoardNote(reply)).replace(/\[cut off[^\]]*\]/gi, ' ').replace(/\s+/g, ' ').trim();
  const sentences = heard.split(/(?<=[.!?。！？]["'”’」)]*)\s*/).map((x) => x.trim()).filter(Boolean);
  // M1: the runtime's check-in, word for word (fix round 2: wherever it stands, as replies of one turn are joined).
  for (let i = sentences.length - 1; i >= 0; i--) if (V2_CHECK_INS.includes(sentences[i]!)) sentences.splice(i, 1);
  const latinFirst = (xs: string[]) => { const l = xs.filter(v2LatinOnly); return (l.length ? l : xs).pop() ?? null; };
  const asks = sentences.filter((x) => /[?？]["'”’」)]*$/.test(x) && !NOT_LEVEL.test(x));
  if (asks.length) return latinFirst(asks);
  // An ask for an answer with no question mark ("Tell me about the work you do, please."), as its last heard sentence.
  const last = sentences[sentences.length - 1] ?? '';
  if (TELL_ME.test(last)) return last;
  if (cut) return null;
  const cards = [...reply.matchAll(/<board\s+problem\b[^>]*>([\s\S]*?)<\/board>/g)].map((m) => m[1]!.trim()).filter((x) => /[?？]/.test(x));
  return cards.length ? cards[cards.length - 1]! : null;
}

/** Two questions are the same question (question-overlap.ts v2SameQuestion: fix round 1, I1 Japanese by characters, M2 too little to
 *  compare = different). */
const sameQuestion = v2SameQuestion;

/** Task 8a (LEVEL_CHECK_PUT): for each of the learner's replies in their own words (and `heard` last), whether it answers a question the
 *  check put: the tutor's words since their reply before (all its messages in that turn) put a question (v2LevelQuestionOf), the reply has
 *  content, and that question is not the one their last counted answer answered. Words that go on with an answer over a reply cut before
 *  its question (mic test 9, embed-1795132864767 T9), and an answer to the same question asked again (T10 after T8), are no new one. */
export function v2LevelQuestionsPut(history: Anthropic.MessageParam[], heard: string | null | undefined, hasContent: (text: string) => boolean): boolean[] {
  const out: boolean[] = [];
  let tutor = ''; let last: string | null = null;
  const take = (said: string) => {
    const q = v2LevelQuestionOf(tutor);
    const fresh = !!q && hasContent(said) && !(last !== null && sameQuestion(q, last));
    if (fresh) last = q;
    out.push(fresh); tutor = '';
  };
  for (const m of history) {
    const t = textOf(m);
    if (m.role === 'assistant') { if (t.trim()) tutor = tutor ? `${tutor}\n${t}` : t; continue; }
    // Tool results only: no answer (kept in the list, as v2CountLevelCheck's pairs keep it), and the tutor's words run on.
    if (!t.trim()) { if (isOwnWords(m)) out.push(false); continue; }
    if (isOwnWords(m)) take(t);
    else if (/^\[The (?:student|session)\b/.test(t.trim())) tutor = '';
  }
  if (heard) take(heard);
  return out;
}

/** Task 8a (LEVEL_CHECK_PUT): the questions the check put that the learner answered (v2LevelQuestionsPut), `heard` the newest answer. */
export function v2LevelQuestionsAnswered(history: Anthropic.MessageParam[], heard: string | null | undefined, hasContent: (text: string) => boolean): number {
  return v2LevelQuestionsPut(history, heard, hasContent).filter(Boolean).length;
}
