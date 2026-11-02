/**
 * Should a brain-emitted show_problem be rewritten into the current
 * segment's authored show_segment_card?
 *
 * The substitution exists so the brain cannot drift from the authored
 * script. portal-704e3e01 (2026-09-04) showed its two failure modes, both of
 * which end in the orchestrator killing the turn for its own override:
 *
 *   @1111.7s  substituted into a segment already marked COMPLETE, which the
 *             show_segment_card branch then blocks by design.
 *   @1021.1s  substituted while the student had just asked for a DIFFERENT
 *             problem ("let's see a different one"), so the authored card
 *             deduped against what was already on the board.
 *
 * Substitute-same-only round. The substitution was introduced for "a slight
 * rewording of the authored problem", but nothing checked that the brain's
 * statement WAS the authored problem (the only test upstream compares the noun
 * after find/calculate/how many). A brain problem about ticket resale
 * ("15n + 80 < 500") was replaced on the board by "Solve and graph:
 * 4x + 9 ≤ 33" while the speech described tickets — three times in one
 * session; on resume the substituted card then dedup'd against the board and
 * no problem card appeared at all. Two more reasons, evaluated AFTER the
 * existing ones:
 *
 *   different-problem          the brain's statement does not pose the
 *                              authored problem → its own card is dispatched.
 *   authored-already-on-board  it IS the authored problem and that card is
 *                              the tracked active card → the call is dropped
 *                              (`drop: true`): nothing is missing.
 *
 * Pure decisions — no side effects, never throw. The pre-existing skip
 * reasons are evaluated first so existing telemetry keeps its meaning.
 */
import { sameProblemStatement } from '../whiteboard/soft-rejections';

export type SubstitutionSkipReason =
  | 'targets-diverge'
  | 'new-page-in-turn'
  | 'generate-problem-in-turn'
  | 'segment-complete'
  | 'student-asked-for-another'
  | 'different-problem'
  | 'authored-already-on-board';

export interface SubstitutionDecision {
  substitute: boolean;
  skipReason?: SubstitutionSkipReason;
  /** True only for authored-already-on-board: drop the call (no dispatch, no
   *  rejection, no kill) instead of dispatching the brain's own card. */
  drop?: boolean;
}

export function shouldSubstituteShowProblem(args: {
  /** Brain's target word disagrees with the authored one — handled upstream. */
  targetsDiverge: boolean;
  /** new_page in this turn signals a deliberate fresh-context render. */
  newPageInTurn: boolean;
  /** generate_problem in this turn means the brain is building a new one. */
  generateProblemInTurn: boolean;
  /** Segment is in completedSegmentIdsRef — show_segment_card would be blocked. */
  segmentComplete: boolean;
  /** detectAnotherProblemRequest() on the latest student turn. */
  studentAskedForAnother: boolean;
  /** Kill switch (NEXT_PUBLIC_TUTOR_SUBSTITUTE_SAME_ONLY). Off ⇒ the two
   *  inputs below are ignored and the decision is exactly the pre-round one. */
  sameOnly: boolean;
  /** sameProblemStatement(brain statement, authored statement). */
  sameProblem: boolean;
  /** The authored statement is the tracked active card. */
  authoredOnBoard: boolean;
}): SubstitutionDecision {
  if (args.targetsDiverge) return { substitute: false, skipReason: 'targets-diverge' };
  if (args.newPageInTurn) return { substitute: false, skipReason: 'new-page-in-turn' };
  if (args.generateProblemInTurn) return { substitute: false, skipReason: 'generate-problem-in-turn' };
  if (args.segmentComplete) return { substitute: false, skipReason: 'segment-complete' };
  if (args.studentAskedForAnother) return { substitute: false, skipReason: 'student-asked-for-another' };
  if (!args.sameOnly) return { substitute: true };
  if (!args.sameProblem) return { substitute: false, skipReason: 'different-problem' };
  if (args.authoredOnBoard) return { substitute: false, skipReason: 'authored-already-on-board', drop: true };
  return { substitute: true };
}

/**
 * Companion 1 — the end-of-turn auto card (`auto_card_on_advance`) appends the
 * authored card for a segment the brain advanced into without rendering it.
 * In an attempt that painted the brain's OWN problem that would put a second,
 * different problem on the board under speech about the first: the mismatch
 * the gate above removes, back by another door. False ⇒ suppress.
 */
export function shouldAutoCardAfterOwnProblem(input: {
  enabled: boolean;
  ownProblemPaintedThisAttempt: boolean;
}): boolean {
  return !(input.enabled && input.ownProblemPaintedThisAttempt);
}

/**
 * Companion 2 — the dedup branch has three early silent drops ("student
 * verifying", "retry attempt", "duplicate of the active card") that run before
 * decideSubstitutedDuplicate and never ask whether the call was a runtime
 * substitution of a DIFFERENT problem. Silently dropping that leaves the
 * student with speech about a problem that is nowhere on the board. True ⇒
 * the silent drop must be refused (fall through to the rejection that guards
 * a missing problem card).
 */
export function refuseSilentDedupDrop(input: {
  enabled: boolean;
  /** The brain's statement when the RUNTIME rewrote the call; null otherwise. */
  substitutedBrainStatement: string | null;
  authoredStatement: string;
}): boolean {
  if (!input.enabled) return false;
  if (input.substitutedBrainStatement === null) return false;
  return !sameProblemStatement(input.substitutedBrainStatement, input.authoredStatement);
}

/** Task 23 §B1: a numbered card line's label ("1.", "2)", "Question 3:"). */
const CARD_LINE_LABEL_RE = /^\s*(?:question\s*)?\d+\s*[.):：]\s*/i;
const CARD_LINE_FILLERS = new Set(['um', 'uh', 'er', 'erm', 'hmm', 'so', 'well', 'okay', 'ok', 'please', 'now']);
function cardLineTokens(s: string): string[] {
  return ((s ?? '').replace(CARD_LINE_LABEL_RE, '').toLowerCase().replace(/’/g, "'").match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu) ?? [])
    .filter((t) => !CARD_LINE_FILLERS.has(t));
}
/** Shared tokens (with multiplicity) over the longer side. */
function cardLineMatch(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const left = new Map<string, number>();
  for (const t of b) left.set(t, (left.get(t) ?? 0) + 1);
  let shared = 0;
  for (const t of a) {
    const n = left.get(t) ?? 0;
    if (n > 0) { shared++; left.set(t, n - 1); }
  }
  return shared / Math.max(a.length, b.length);
}
export const AUTHORED_CARD_LINE_MATCH = 0.9;

/**
 * Task 23 §B1 (GDI run 11, 44 s / 139 s: the level check's authored card has
 * three numbered questions; the brain showed its own "Level check, question 1"
 * card with ONE of them — `different-problem`, and the authored card never
 * went up). True when the brain's statement is a single line that IS one
 * numbered line of a multi-line authored statement: labels ("1.", "Question
 * 3:") stripped, filler-free token match ≥ 90 %. The caller then substitutes
 * the WHOLE authored card (or, when it is already on the board, points at it).
 */
export function isAuthoredCardLine(brainStatement: string, authoredStatement: string): boolean {
  const brain = (brainStatement ?? '').trim();
  if (!brain || /\n/.test(brain)) return false;
  const lines = (authoredStatement ?? '').split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const numbered = lines.filter((l) => CARD_LINE_LABEL_RE.test(l));
  if (numbered.length < 2) return false;
  const bt = cardLineTokens(brain);
  return numbered.some((l) => cardLineMatch(bt, cardLineTokens(l)) >= AUTHORED_CARD_LINE_MATCH);
}

/**
 * Task 30 fix round 4 R3-13 (run r3, 155–372 s: the level check asked
 * question 1 of its authored three, then corrected and quizzed — "which
 * sentence uses the present perfect …" ×4 — and never asked questions 2 and
 * 3). For a part whose authored card is a numbered list of QUESTIONS (≥ 2
 * `^\d+\.` lines, each with a "?"), the first one the tutor has not asked
 * yet, in card order; null when the card is not such a list or all are asked.
 * A question counts as asked when some span of ≤ 3 consecutive tutor
 * sentences in the part holds ≥ 80 % of its filler-free tokens — the whole
 * question, or (fix round 5) its lead (the first sentence, or a one-sentence
 * question's first clause; ≥ 3 tokens) at ≥ 0.6, since a tutor paraphrases
 * ("If so, tell me about it."); or all of its ≥ 2 content words in one tutor
 * sentence. Pure, generic.
 */
export const NUMBERED_QUESTION_ASKED_MATCH = 0.8;
/** Fix round 5 (R3-13 paraphrase, rereview-4 S-7: "What do you do?" for "What
 *  do you do for work?"): the lead clause at ≥ 0.6 counts as asked. */
export const NUMBERED_QUESTION_LEAD_MATCH = 0.6;
/** Function words and common question verbs — the rest of a question's
 *  tokens are its content words (an approximation of its nouns). */
const QUESTION_FUNCTION_WORDS = new Set(['the', 'and', 'for', 'with', 'about', 'from', 'into', 'your', 'you', "you'd", "you're", "you've", 'yours', 'our', 'their', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'can', 'could', 'would', 'will', 'should', 'shall', 'may', 'might', 'must', 'does', 'did', 'have', 'has', 'had', 'are', 'was', 'were', 'been', 'being', 'tell', 'say', 'give', 'like', 'want', 'think', 'know', 'make', 'get', 'one', 'two', 'little', 'some', 'any', 'ever', 'this', 'that', 'these', 'those', 'there', 'here', 'very', 'more', 'most', 'also', 'just', 'it', "it's", 'its', 'all', 'not', 'but', 'then', 'than', 'please', 'important', 'improve', 'describe', 'explain']);
const NUMBERED_QUESTION_LINE_RE = /^\s*\d+\.\s*/;
function containedShare(needle: string[], hay: string[]): number {
  if (needle.length === 0) return 0;
  const left = new Map<string, number>();
  for (const t of hay) left.set(t, (left.get(t) ?? 0) + 1);
  let shared = 0;
  for (const t of needle) {
    const n = left.get(t) ?? 0;
    if (n > 0) { shared++; left.set(t, n - 1); }
  }
  return shared / needle.length;
}
function splitTutorSentences(text: string): string[] {
  return (text ?? '').split(/(?<=[.?!。？！])\s*/u).map((s) => s.trim()).filter(Boolean);
}
// Fix round 5 (R4-2, run r4: the topic-intro card "1. We use simple
// sentences … 2. Practice question: What do you do at work? Answer with one or
// two sentences." got no note because line 1 is not a question): only the
// numbered lines holding a question count (a "?" outside quotes, an optional
// "Practice question:" label), and the planted text is the question
// sentence(s) only.
const PRACTICE_QUESTION_LABEL_RE = /^\s*(?:practice\s+)?question\s*[:：]\s*/i;
const QUOTED_SPAN_RE = /["“][^"”]*["”]|'[^']*\?'|「[^」]*」/g;
export function numberedCardQuestions(cardStatement: string | null | undefined): Array<{ n: number; text: string }> {
  const lines = (cardStatement ?? '').split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const numbered = lines.filter((l) => NUMBERED_QUESTION_LINE_RE.test(l));
  if (numbered.length < 2) return [];
  const questions = numbered
    .map((l) => l.replace(NUMBERED_QUESTION_LINE_RE, '').replace(PRACTICE_QUESTION_LABEL_RE, '').trim())
    .filter((l) => /[?？]/.test(l.replace(QUOTED_SPAN_RE, ' ')))
    .map((l) => splitTutorSentences(l).filter((s) => /[?？]\s*$/.test(s)).join(' '))
    .filter(Boolean);
  return questions.map((text, i) => ({ n: i + 1, text }));
}
export function numberedQuestionAsked(question: string, tutorTurnsInSegment: readonly string[]): boolean {
  const whole = cardLineTokens(question);
  // The lead: the first sentence; for a one-sentence question, its first
  // clause (up to the first comma) — "What is one skill you'd like to improve
  // in your English, and why?" asks question 3 with its tail paraphrased.
  const first = splitTutorSentences(question)[0] ?? '';
  const lead = cardLineTokens(first.length < question.trim().length ? first : first.split(/[,，、]/)[0] ?? '');
  const sentences = tutorTurnsInSegment.flatMap((t) => splitTutorSentences(t)).map(cardLineTokens);
  for (let i = 0; i < sentences.length; i++) {
    let span: string[] = [];
    for (let k = i; k < Math.min(i + 3, sentences.length); k++) {
      span = [...span, ...sentences[k]!];
      if (containedShare(whole, span) >= NUMBERED_QUESTION_ASKED_MATCH) return true;
      if (lead.length >= 3 && containedShare(lead, span) >= NUMBERED_QUESTION_LEAD_MATCH) return true;
    }
  }
  // Fix round 5 (R3-13 paraphrase): the question's content words (≥ 2) all in
  // one tutor sentence ("What skill would you like to work on in English?").
  const content = [...new Set(whole.filter((w) => !QUESTION_FUNCTION_WORDS.has(w) && w.length >= 3 && !/(?:ed|ing)$/.test(w)))];
  if (content.length >= 2 && sentences.some((s) => content.every((w) => s.includes(w)))) return true;
  return false;
}
export function nextUnaskedNumberedQuestion(cardStatement: string | null | undefined, tutorTurnsInSegment: readonly string[]): { n: number; text: string; total: number } | null {
  const qs = numberedCardQuestions(cardStatement);
  for (const q of qs) if (!numberedQuestionAsked(q.text, tutorTurnsInSegment)) return { ...q, total: qs.length };
  return null;
}
/** Task 31 §H2 (GDI run 18, 99 s: a fourth level-check question after the
 *  third was answered): every question of a numbered card of ≥ 2 questions
 *  was asked ⇒ the note for the student turn that answers the last one (the
 *  caller plants it once per part). null otherwise. */
export function allNumberedQuestionsAnsweredNote(cardStatement: string | null | undefined, tutorTurnsInSegment: readonly string[]): string | null {
  const qs = numberedCardQuestions(cardStatement);
  if (qs.length < 2 || nextUnaskedNumberedQuestion(cardStatement, tutorTurnsInSegment) !== null) return null;
  return `[runtime note — not from the student] All ${qs.length} questions on this part's card are answered — do not ask another. Reply to the answer in ONE short sentence, give the part's closing line from its notes, and advance. Apply this silently; never mention this note.`;
}
/** The urgent note planted on a student turn while a numbered question is unasked. */
export function numberedQuestionNote(q: { n: number; text: string; total: number }): string {
  // Fix round 5: no stray "]" after the silent clause.
  return `[runtime note — not from the student] Reply to the student in ONE short sentence (no correction, no grammar question), then ask question ${q.n} of ${q.total} exactly: "${q.text}". Apply this silently; never mention this note.`;
}
