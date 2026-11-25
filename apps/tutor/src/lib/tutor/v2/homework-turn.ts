/**
 * Tutor brain v2 — one homework turn (homework.ts): the answer check, then the turn, with the no-reveal guard
 * around it. Apart from homework.ts, which turn.ts reads for the session part, so the two do not import each
 * other.
 *
 * No-reveal (design 4). The principle is in the session part; this is the one runtime guard behind it.
 *   - The board, for every checked problem: a board call that writes a value of the key the student has not
 *     written is not painted, and the model reads why (v1's homeworkKeyWithheld / boardRevealsHomeworkKey).
 *     In the opening reply of a problem whose figure is already on screen nothing is drawn.
 *   - The reply, for partners under the no-reveal rule (no-reveal-ledger-gate.ts): the reply is held until it
 *     is complete; one that states a final answer is not sent and is written again once, with a fact saying
 *     why. A second draft that still states it has those sentences cut (v1's fixed tails are the last resort).
 *     Held replies cost the student the stream of a typed reply, not its words; homework is typed (GAC).
 */
import type { ProseAnswerMatchFn } from '../voice/prose-answer-match';
import { boardRevealsHomeworkKey, homeworkKeyWithheld, HOMEWORK_BOARD_KEY_WITHHELD_REASON, HOMEWORK_OPENER_BOARD_WITHHELD_REASON } from '../voice/homework-problem-block';
import { boardStrings, revealsWithheldAnswer, type WithheldAnswer } from '../voice/whole-answer-reveal';
import { newSheetRecord, partLabel, problemNumbersNamed, sheetProblemNamed, studentMessagesOf, v2HomeworkCheck, type V2HomeworkResolved, type V2SheetResolved } from './homework';
import { answerText } from '../voice/answer-text';
import { castsDoubt, creditsNonAnswer, givesCredit, isBareNumber, statesExpression, statesOwnResult, isGuess, nonAnswer, sentencesOf, unearnedCredit, verdictMissing, V2_HOMEWORK_GUARD_REASONS, v2VerdictOpeners, type GuessedPart, type NonAnswer } from './homework-guards';
import { V2_CONTROL_TOOL_NAMES } from './tool-names';
import { v2LessonLines } from './lesson-lines';
import { taughtIn } from '../voice/lesson-language';
import { runV2Turn, type V2TurnInput } from './turn';
import type { V2HomeworkProblem, V2Session, V2State, V2ToolCall, V2TurnResult } from './types';

/** A homework frame for the client (client.ts V2HomeworkFrame). */
export type V2HomeworkFrameOut = { type: 'homework-keyed-verdict'; part: string; verdict: 'correct' | 'incorrect'; value?: string } | { type: 'homework-problem-done' };

/** Said in place of a draft whose every sentence stated the answer, so the reply still hands the turn over. */
export const V2_HOMEWORK_FALLBACK_QUESTION = 'What do you think the next step is?';
export const V2_HOMEWORK_NOT_SENT = 'it stated the final answer of a part the student has not reached. They must reach it themselves: write the reply again without it, and give them the next smallest step.';

/**
 * The key with its confirmed parts left out: a part the answer check confirmed was written by the student, so
 * saying it back is not a reveal. The number reader missed a hedged one ("maybe -10 < x < 2?") and cut the
 * "Yes, that's right" it was owed (GAC validation fixed3, 2026-11-15).
 */
function openKey<K extends { parts: Array<{ label?: string | null }> }>(key: K, confirmed: ReadonlyArray<string>): K {
  return { ...key, parts: key.parts.filter((p) => !confirmed.includes(`part:${partLabel(p.label)}`)) };
}

/** The words of the tutor's last reply in a v2 history. */
function lastTutorText(history: V2State['history']): string {
  const m = [...history].reverse().find((h) => h.role === 'assistant' && (typeof h.content === 'string' || h.content.some((c) => c.type === 'text')));
  return !m ? '' : typeof m.content === 'string' ? m.content : m.content.map((c) => (c.type === 'text' ? c.text : '')).join(' ');
}

// A key value written as an expression ("y = 3x + 1") is read by its written form too: the number reader passes
// it by (precalculus, 2026-11-15: "adding 1 to both sides gives y=3x+1" in a correction, before (b) was tried).
const revealing = (sentence: string, withheld: ReadonlyArray<WithheldAnswer>) => withheld.some((a) => revealsWithheldAnswer(sentence, a).hit || (statesExpression(sentence, a.value, a.givenText ?? '') && !statesExpression(a.studentText ?? '', a.value, a.givenText ?? '')));

/** A board note written about the student and not to them, in a lesson taught in Chinese or Japanese (學生的答案…, 生徒の答え…). */
const ABOUT_THE_STUDENT_CJK = /(?:這位|这位|該|该)?(?:學生|学生)(?:的|給|给|說|说|寫|写|回答)|生徒(?:の|は|が)/u;
/** 2026-11-24: the same in Hindi, French and Spanish (छात्र का उत्तर…, "La réponse de l'élève…", "La respuesta del estudiante…"). */
const ABOUT_THE_STUDENT_MORE = /(?:छात्रा?|विद्यार्थी|स्टूडेंट|student)\s*(?:का|की|के|ने)(?![\p{L}\p{M}])|(?<![\p{L}])(?:l'élève|l'étudiante?|(?:el|la|del|de\s+la)\s+(?:estudiante|alumn[oa]))(?![\p{L}])/iu;

/** What the homework-guards checks read for one turn. */
interface TurnChecks {
  /** This message's decided verdicts (check 1). */
  verdicts: Array<'correct' | 'incorrect'>;
  /** The message answers nothing the tutor asked (check 2). */
  nonAnswer: NonAnswer | null;
  /** Own-question results the student has not written (check 3). */
  own: Array<{ q: string; a: string }>;
  /** Parts confirmed from a bare guess (check 4); `allGuessed`: every confirmed part was. */
  guessed: GuessedPart[];
  allGuessed: boolean;
  /** A bare number no check covered, sent in reply to the tutor's question (physics, 2026-11-15: "3" credited for 10 m/s). */
  unchecked?: string | null;
}

const readsKeyValue = (text: string, value: string, given: string) => revealsWithheldAnswer(text, { value, studentText: '', givenText: given }).hit;
const statesOwn = (text: string, own: ReadonlyArray<{ q: string; a: string }>) => own.some((o) => statesOwnResult(text, o, readsKeyValue));

/** The own-question results the student has not yet written (check 3). */
function ownWithheld(state: V2State, studentText: string): Array<{ q: string; a: string }> {
  return (state.homework?.own ?? []).filter((o) => !statesOwnResult(studentText, o, readsKeyValue));
}

/** The own-question result this message writes, as the facts' answer check says it (check 3: credit only). */
function ownAnswerCheck(state: V2State, studentSaid: string | null): string | null {
  if (!studentSaid) return null;
  const hit = (state.homework?.own ?? []).find((o) => statesOwnResult(studentSaid, o, readsKeyValue));
  return hit ? `their own question (${hit.q.slice(0, 80)}): the student's answer matches the result you worked out` : null;
}

/** A bare number sent to the tutor's question that neither the key nor an own result checked (check 2b). */
function uncheckedNumber(studentSaid: string | null, na: NonAnswer | null, verdicts: number, state: V2State, languages?: readonly string[]): string | null {
  if (!studentSaid || na || verdicts || !isBareNumber(studentSaid, languages) || ownAnswerCheck(state, studentSaid)) return null;
  return /[?？]/.test(lastTutorText(state.history)) ? studentSaid.trim() : null;
}

/** Parts newly confirmed by this message, when it offered them as a bare guess (check 4). */
function newlyGuessed(prior: ReadonlyArray<string>, confirmed: ReadonlyArray<string>, studentSaid: string | null, verdicts: ReadonlyArray<{ part: string; verdict: string; value?: string }>, prefix = '', languages?: readonly string[]): GuessedPart[] {
  if (!studentSaid || !isGuess(studentSaid, languages)) return [];
  const fresh = confirmed.filter((m) => m.startsWith('part:') && !prior.includes(m)).map((m) => m.slice(5));
  // The hedge as the checks read it (voice/answer-text.ts): 可能是 11？ is "maybe 11?".
  const value = answerText(studentSaid, languages).replace(/^.*?(?:maybe|perhaps|probably|i (?:think|guess)|is it|could it be)\s+/i, '').replace(/[?!.\s]+$/, '').trim();
  return fresh.map((label) => ({ label: `${prefix}${label}`, value: verdicts.find((v) => v.part === label)?.value ?? value }));
}

/**
 * One homework turn: the answer check, then the turn with what it found as a fact. The route and the offline
 * harness both run this, so what is tested offline is what the student gets.
 */
export async function runV2HomeworkTurn(input: V2TurnInput & { resolved: V2HomeworkResolved; onHomeworkFrame?: (f: V2HomeworkFrameOut) => void; proseMatch?: ProseAnswerMatchFn }): Promise<V2TurnResult & { homeworkFrames: V2HomeworkFrameOut[] }> {
  const { resolved, onHomeworkFrame, proseMatch, ...turn } = input;
  const session: V2Session = { ...turn.session, homework: turn.session.homework ?? resolved.problem };
  const hw = session.homework!;
  // The session's languages go to every reader of the student's words: an answer worded in French or Spanish has no script to tell it by.
  const languages = session.languages;
  const hc = await v2HomeworkCheck({ key: resolved.key, problem: hw, state: turn.state, studentSaid: turn.studentSaid, languages, ...(proseMatch ? { proseMatch } : {}) });
  const frames: V2HomeworkFrameOut[] = [...hc.verdicts.map((v) => ({ type: 'homework-keyed-verdict' as const, ...v })), ...(hc.justDone ? [{ type: 'homework-problem-done' as const }] : [])];
  for (const f of frames) onHomeworkFrame?.(f);
  const doneAt = hc.justDone ? turn.state.history.length : turn.state.homework?.doneAt;
  const prior = turn.state.homework?.confirmed ?? hw.priorConfirmed ?? [];
  const guessed = [...(turn.state.homework?.guessed ?? []), ...newlyGuessed(prior, hc.confirmed, turn.studentSaid, hc.verdicts, '', languages)];
  const own = turn.state.homework?.own;
  const state: V2State = { ...turn.state, homework: { confirmed: hc.confirmed, ...(hc.done ? { done: true } : {}), ...(doneAt !== undefined ? { doneAt } : {}), ...(guessed.length ? { guessed } : {}), ...(own?.length ? { own } : {}) } };

  const na = nonAnswer(turn.studentSaid, lastTutorText(turn.state.history), languages);
  // A stray value that only repeats a part already confirmed is not an answer to the sheet either.
  const repeatOnly = !!na && hc.verdicts.length > 0 && hc.verdicts.every((v) => prior.includes(`part:${v.part}`));
  const checks = [repeatOnly || !hc.answerCheck ? null : hc.answerCheck, na ? `the student's message ("${na.said.slice(0, 40)}") does not answer your last question` : null, ownAnswerCheck(turn.state, turn.studentSaid)].filter(Boolean);
  const facts = { ...(turn.facts ?? {}), ...(checks.length ? { answerCheck: checks.join('; ') } : {}) };

  const studentText = [...studentMessagesOf(turn.state.history).map((m) => m.content), turn.studentSaid ?? ''].join('\n');
  const withheld = hw.verified && resolved.key ? homeworkKeyWithheld({ text: hw.text, verified: true, hasFigure: hw.hasFigure, key: openKey(resolved.key, hc.confirmed) }, studentText) : [];
  const confirmedParts = hc.confirmed.filter((m) => m.startsWith('part:')).length;
  const r = await guardedTurn({ ...turn, session, state, facts }, withheld, { noReveal: !!hw.noReveal, figureOnScreen: hw.hasFigure }, {
    verdicts: repeatOnly ? [] : hc.verdicts.map((v) => v.verdict), nonAnswer: na, own: ownWithheld(turn.state, studentText), guessed, allGuessed: guessed.length > 0 && guessed.length >= confirmedParts,
    unchecked: uncheckedNumber(turn.studentSaid, na, hc.verdicts.length, turn.state, languages),
  });
  return { ...r, homeworkFrames: frames };
}

/**
 * The turn under the homework guards: the no-reveal guard (this file's header) and the checks of
 * homework-guards.ts. `withheld`: the key values the student has not written. `figureOnScreen`: the opening
 * reply draws nothing. A draft is held while any check could fail it; a failing draft is written again once,
 * with a fact saying why, and a second failing draft is repaired by the same rules.
 */
async function guardedTurn(given: V2TurnInput, withheld: WithheldAnswer[], opts: { noReveal: boolean; figureOnScreen: boolean }, checks: TurnChecks): Promise<V2TurnResult> {
  const turn = given;
  const opening = !turn.state.history.length && turn.studentSaid === null;

  const boardGuard = (name: string, args: Record<string, unknown>): string | null => {
    if (V2_CONTROL_TOOL_NAMES.has(name) || name === 'new_page' || name === 'go_to_page') return null;
    if (opening && opts.figureOnScreen) return HOMEWORK_OPENER_BOARD_WITHHELD_REASON.replace(/^not shown — /, '');
    // A note about "the student" is written to the tutor, not to them ("The student's answer, 17, arrived with no
    // working. Before it is checked, ask…", GAC validation round 2): the board is the student's page.
    if (boardStrings(args).some((t) => /\bthe student(?:'s|s')?\b/i.test(t) || ABOUT_THE_STUDENT_CJK.test(t) || ABOUT_THE_STUDENT_MORE.test(t))) return 'the board is the student\'s page: write to them as "you", or not at all';
    if (checks.own.length && boardStrings(args).some((t) => statesOwn(t, checks.own))) return 'it states the result of the student\'s own question, which they must reach themselves';
    return withheld.length && boardRevealsHomeworkKey(args, withheld) ? HOMEWORK_BOARD_KEY_WITHHELD_REASON.replace(/^not shown — /, '') : null;
  };
  const guarded: V2TurnInput = { ...turn, boardGuard };
  const keyGuard = opts.noReveal && withheld.length > 0;
  // Every homework reply is held: any of them may cast doubt on a confirmed answer (castsDoubt).
  const facts = turn.facts ?? {};
  const languages = turn.session.languages;

  // Each check, on a whole draft: why it fails, or nothing.
  const reasonsFor = (spoken: string): string[] => {
    const ss = sentencesOf(spoken);
    const out: string[] = [];
    if (keyGuard && ss.some((x) => revealing(x, withheld))) out.push(V2_HOMEWORK_NOT_SENT);
    if (checks.own.length && ss.some((x) => statesOwn(x, checks.own))) out.push(V2_HOMEWORK_GUARD_REASONS.own);
    const v = verdictMissing(spoken, checks.verdicts, languages);
    if (v) out.push(V2_HOMEWORK_GUARD_REASONS.verdict(v));
    if (checks.nonAnswer && creditsNonAnswer(spoken, languages)) out.push(V2_HOMEWORK_GUARD_REASONS.nonAnswer(checks.nonAnswer));
    const unearned = unearnedCredit(spoken, checks.guessed, checks.allGuessed, languages);
    if (unearned.length) out.push(V2_HOMEWORK_GUARD_REASONS.recap(unearned));
    const doubts = castsDoubt(spoken, languages);
    if (doubts.length) out.push(V2_HOMEWORK_GUARD_REASONS.doubt(doubts));
    if (checks.unchecked && creditsNonAnswer(spoken, languages)) out.push(V2_HOMEWORK_GUARD_REASONS.unchecked(checks.unchecked));
    return out;
  };
  // Held: the student sees a draft only once it has passed.
  const held = async (extra: Partial<V2TurnInput>) => {
    const events: Array<() => void> = [];
    const r = await runV2Turn({
      ...guarded, ...extra,
      onText: (d) => events.push(() => turn.onText?.(d)),
      onToolCall: (c: V2ToolCall) => events.push(() => turn.onToolCall?.(c)),
      onBoardOpen: () => events.push(() => turn.onBoardOpen?.()),
      onBoardWithdraw: (id) => events.push(() => turn.onBoardWithdraw?.(id)),
    });
    return { r, flush: () => { for (const e of events) e(); }, reasons: reasonsFor(r.spoken) };
  };
  const first = await held({});
  if (!first.reasons.length) { first.flush(); return first.r; }
  console.log(`[brain-v2] homework: a draft was written again — ${first.reasons.map((x) => x.split(/[,.(]/)[0].slice(0, 60)).join(' | ')}`);
  const second = await held({ facts: { ...facts, notSent: first.reasons.join(' Also: ') } });
  if (!second.reasons.length) { second.flush(); return second.r; }
  console.log('[brain-v2] homework: the second draft failed too — repaired');
  // Last resort: the sentences that fail are cut from what is said and from what is stored, and a missing
  // verdict is said in front.
  let handOver = false;
  const cut = (text: string, firstBlock: boolean) => {
    const ss = sentencesOf(text);
    const unearned = new Set([...unearnedCredit(text, checks.guessed, checks.allGuessed, languages), ...castsDoubt(text, languages)]);
    return ss.filter((x, i) => {
      const drop = (keyGuard && revealing(x, withheld)) || (checks.own.length > 0 && statesOwn(x, checks.own)) || (!!checks.nonAnswer && firstBlock && i === 0 && givesCredit(x, languages));
      if (drop) handOver = true;
      return !drop && !unearned.has(x);
    }).join(' ');
  };
  const missing = verdictMissing(second.r.spoken, checks.verdicts, languages);
  // The typed wording in a typed session (typed Hinglish is in Latin letters).
  const opener = missing ? v2VerdictOpeners(turn.session.languages, turn.session.mode)[missing] : '';
  const fallbackQuestion = v2LessonLines(turn.session.languages, turn.session.mode)?.nextStep ?? V2_HOMEWORK_FALLBACK_QUESTION;
  // A draft that handed the turn over with a question still does, whatever was cut.
  if (/[?？]\s*$/.test(second.r.spoken)) handOver = true;
  let spoken = [opener, cut(second.r.spoken, true)].filter(Boolean).join(' ');
  if (handOver && !/[?？]\s*$/.test(spoken)) spoken = `${spoken} ${fallbackQuestion}`.trim();
  const before = turn.state.history.length;
  let firstText = true;
  const history = second.r.state.history.map((m, i) => {
    if (i < before + 1 || m.role !== 'assistant' || typeof m.content === 'string') return m;
    // An empty text block is refused by the API: a block left with nothing is dropped.
    const content = m.content.map((b) => {
      if (b.type !== 'text') return b;
      const text = [firstText ? opener : '', cut(b.text, firstText)].filter(Boolean).join(' ');
      firstText = false;
      return { ...b, text };
    }).filter((b) => b.type !== 'text' || b.text.trim());
    return { ...m, content: content.length ? content : [{ type: 'text' as const, text: fallbackQuestion }] };
  });
  // What is stored hands the turn over as what is said does.
  const lastText = [...history].reverse().find((m) => m.role === 'assistant' && Array.isArray(m.content) && m.content.some((b) => b.type === 'text'));
  const tail = lastText && Array.isArray(lastText.content) ? ([...lastText.content].reverse().find((b) => b.type === 'text') as { text: string } | undefined) : undefined;
  if (handOver && tail && !/[?？]\s*$/.test(tail.text)) tail.text = `${tail.text} ${fallbackQuestion}`.trim();
  turn.onText?.(spoken);
  for (const c of second.r.toolCalls) turn.onToolCall?.(c);
  return { ...second.r, spoken, state: { ...second.r.state, history } };
}

/** A whole-sheet frame: a problem solved, by number and by its position on the sheet (v1 records positions). */
export type V2SheetFrameOut = V2HomeworkFrameOut | { type: 'homework-sheet-solved'; n: number; position: number; solved: number[]; total: number };

/**
 * One turn of a whole-sheet session (design 10): the problem in play is the one the student names, or the one
 * set_current_problem last turned to; its answer is checked against its own key exactly as in a one-problem
 * session (designs 1–4 on the current problem), and the sheet's record follows.
 */
export async function runV2SheetTurn(input: V2TurnInput & { resolvedSheet: V2SheetResolved; onHomeworkFrame?: (f: V2SheetFrameOut) => void; proseMatch?: ProseAnswerMatchFn }): Promise<V2TurnResult & { homeworkFrames: V2SheetFrameOut[] }> {
  const { resolvedSheet, onHomeworkFrame, proseMatch, ...turn } = input;
  const sheet = turn.session.homeworkSheet ?? resolvedSheet.sheet;
  const session: V2Session = { ...turn.session, homeworkSheet: sheet };
  let rec = turn.state.homework?.sheet ?? newSheetRecord(sheet);
  // A message that names a problem is about that problem, from this message on.
  const named = sheetProblemNamed(turn.studentSaid, sheet);
  if (named !== null && named !== rec.current) rec = { ...rec, current: named, since: turn.state.history.length };
  // The problem in play is solved and the tutor moved on in words without set_current_problem: the answer is
  // for the open problem its last reply named (the last one named), or else the first open one. Left on the
  // solved problem, every later answer went unchecked and the sheet could never be done (review, 2026-11-14).
  else if (named === null && rec.solved.includes(rec.current)) {
    const open = sheet.problems.map((p) => p.n).filter((n) => !rec.solved.includes(n));
    const said = lastTutorText(turn.state.history);
    const mentioned = problemNumbersNamed(said).filter((n) => open.includes(n));
    const next = mentioned.at(-1) ?? open[0];
    if (next !== undefined) rec = { ...rec, current: next, since: turn.state.history.length };
  }
  const problem = sheet.problems.find((p) => p.n === rec.current);
  const key = resolvedSheet.keys[rec.current];
  const frames: V2SheetFrameOut[] = [];
  const languages = session.languages;
  const na = nonAnswer(turn.studentSaid, lastTutorText(turn.state.history), languages);
  const checkLines: string[] = [];
  let verdicts: Array<'correct' | 'incorrect'> = [];
  let guessed = [...(turn.state.homework?.guessed ?? [])];
  if (problem) {
    const one: V2HomeworkProblem = { text: problem.text, verified: problem.verified, hasFigure: false, ...(problem.parts ? { parts: problem.parts } : {}) };
    const scoped: V2State = { ...turn.state, history: turn.state.history.slice(rec.since), homework: { confirmed: rec.confirmed[String(rec.current)] ?? [], ...(rec.solved.includes(rec.current) ? { done: true } : {}) } };
    const hc = await v2HomeworkCheck({ key, problem: one, state: scoped, studentSaid: turn.studentSaid, languages, ...(proseMatch ? { proseMatch } : {}) });
    frames.push(...hc.verdicts.map((v) => ({ type: 'homework-keyed-verdict' as const, ...v })));
    rec = { ...rec, confirmed: { ...rec.confirmed, [String(rec.current)]: hc.confirmed } };
    if (hc.justDone && !rec.solved.includes(rec.current)) {
      rec = { ...rec, solved: [...rec.solved, rec.current] };
      frames.push({ type: 'homework-sheet-solved', n: rec.current, position: sheet.problems.findIndex((p) => p.n === rec.current) + 1, solved: sheet.problems.map((p, i) => (rec.solved.includes(p.n) ? i + 1 : 0)).filter(Boolean), total: sheet.problems.length });
    }
    const prior = scoped.homework!.confirmed;
    const repeatOnly = !!na && hc.verdicts.length > 0 && hc.verdicts.every((v) => prior.includes(`part:${v.part}`));
    if (hc.answerCheck && !repeatOnly) { checkLines.push(`problem ${rec.current}, ${hc.answerCheck}`); verdicts = hc.verdicts.map((v) => v.verdict); }
    guessed = [...guessed, ...newlyGuessed(prior, hc.confirmed, turn.studentSaid, hc.verdicts, `${rec.current}:`, languages)];
  }
  if (na) checkLines.push(`the student's message ("${na.said.slice(0, 40)}") does not answer your last question`);
  const ownCheck = ownAnswerCheck(turn.state, turn.studentSaid);
  if (ownCheck) checkLines.push(ownCheck);
  if (checkLines.length) turn.facts = { ...(turn.facts ?? {}), answerCheck: checkLines.join('; ') };
  for (const f of frames) onHomeworkFrame?.(f);
  const state: V2State = { ...turn.state, homework: { ...(turn.state.homework ?? { confirmed: [] }), sheet: rec, ...(guessed.length ? { guessed } : {}) } };
  // Every key value on the sheet the student has not written stays off the board and out of the reply.
  const studentText = [...studentMessagesOf(turn.state.history).map((m) => m.content), turn.studentSaid ?? ''].join('\n');
  // The whole sheet is given data: a number one problem states is never withheld as another's answer.
  const sheetText = sheet.problems.map((p) => p.text).join('\n');
  const withheld = sheet.problems.flatMap((p) => (resolvedSheet.keys[p.n] ? homeworkKeyWithheld({ text: sheetText, verified: true, hasFigure: false, key: openKey(resolvedSheet.keys[p.n], rec.confirmed[String(p.n)] ?? []) }, studentText) : []));
  const confirmedParts = Object.values(rec.confirmed).flat().filter((m) => m.startsWith('part:')).length;
  const r = await guardedTurn({ ...turn, session, state }, withheld, { noReveal: !!sheet.noReveal, figureOnScreen: false }, {
    verdicts, nonAnswer: na, own: ownWithheld(turn.state, studentText), guessed, allGuessed: guessed.length > 0 && guessed.length >= confirmedParts,
    unchecked: uncheckedNumber(turn.studentSaid, na, verdicts.length, turn.state, languages),
  });
  return { ...r, homeworkFrames: frames };
}
