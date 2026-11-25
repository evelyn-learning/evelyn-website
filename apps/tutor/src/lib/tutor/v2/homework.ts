/**
 * Tutor brain v2 — homework mode (docs/superpowers/plans/2026-11-13-gac-on-v2-plan.md).
 *
 * Switched on by the plan, not by the partner: a session whose plan is one problem of a student's homework
 * sheet (lesson-plan/homework-problem.ts) works that problem. What the tutor is given is the problem and the
 * hard rules of homework help: the student reaches the final answer themselves, each answer is checked
 * against the sheet's key on the server, and the session ends when the problem is done. How to teach it is
 * v2's own.
 *
 * The answer key never enters the model's context. It is read on the server (voice/homework-problem-turn.ts)
 * and only the checker sees it; the model is told what the check found.
 */
import type { AnswerKey, HomeworkBuildDoc } from '../homework-build/types';
import { HOMEWORK_PROBLEM_KIND } from '../lesson-plan/homework-problem-meta';
import { homeworkProblemsOf } from '../lesson-plan/homework';
import { resolveHomeworkProblemTurn, type HomeworkProblemTurn, type HomeworkProblemTurnDeps } from '../voice/homework-problem-turn';
import { allKeyPartsConfirmed, confirmedKeyMarks, inSheetScope, keyFinalsLine, modelCheckConfirms, solutionPathLines, proseCreditForPart, proseMatchCandidates, sanitizeConfirmedMarks, scopedKeyedVerdicts, type KeyedVerdict } from '../voice/keyed-verdict';
import type { ProseAnswerMatchFn } from '../voice/prose-answer-match';
import { noRevealLedgerForPartner } from '../voice/no-reveal-ledger-gate';
import {
  HOMEWORK_PROBLEM_CONDUCT_RULES, HOMEWORK_PROBLEM_FIGURE_SHOWN, HOMEWORK_PROBLEM_NO_FIGURE, HOMEWORK_PROBLEM_UNVERIFIED,
} from '../voice/homework-problem-block';
import { marksInWords, oneLine, partLabel } from './homework-facts';
import { answerText, fullWidthToAscii } from '../voice/answer-text';
import { numeralValue } from '../voice/heard-numerals';
import { taughtIn } from '../voice/lesson-language';
import type { V2HomeworkProblem, V2HomeworkSheet, V2HomeworkState, V2Session, V2State } from './types';

export { marksInWords, partLabel, v2HomeworkFacts } from './homework-facts';

/** The session's homework problem as the tutor may see it: everything but the key. */
export function v2HomeworkSession(turn: HomeworkProblemTurn, opts: { noReveal: boolean }): V2HomeworkProblem {
  const hp = turn.homeworkProblem;
  return {
    text: hp.text,
    verified: hp.verified,
    hasFigure: hp.hasFigure,
    ...(hp.priorNote ? { priorNote: hp.priorNote } : {}),
    ...(hp.priorConfirmed?.length ? { priorConfirmed: [...hp.priorConfirmed] } : {}),
    // The parts' labels only, to name what is open: never their answers.
    ...(hp.verified && hp.key?.parts.length ? { parts: hp.key.parts.map((p) => partLabel(p.label)), expected: keyFinalsLine(hp.key) } : {}),
    ...(hp.verified && hp.key && solutionPathLines(hp.key).length ? { solutionPath: solutionPathLines(hp.key) } : {}),
    ...(opts.noReveal ? { noReveal: true } : {}),
  };
}

/** The principle the homework session runs on. It is the one place the constitution's "show the step and move
 *  on after two tries" gives way: here the student must still reach the answer themselves. */
export const V2_HOMEWORK_NO_REVEAL = 'This is the student\'s own homework: they must reach the final answer themselves. Never state it, even when they ask for it outright or ask again; when they are stuck, give the next smallest step. This holds after any number of tries, in place of showing the step and moving on.';

/** v1 judged every answer as it came; v2 held verdicts back to ask for working first, and left right answers
 *  unjudged (GAC validation, round 2: Geometry, Physics). */
/** The three habits the brain-model comparison found in every model (homework-guards.ts checks 2–4). */
export const V2_HOMEWORK_ACCURACY_RULES = [
  'A message that does not answer your last question (a bare "yes", or a number when you asked for something else) gets no credit and no "yes": ask what they mean, or ask the question again in other words.',
  'When the student asks a question of their own that has a final result, call note_own_answer with that result before you reply, then guide them to it exactly as you would a part of the sheet: never state it before they write it, on the page or on the board.',
  'When you sum up, credit only what the student wrote. A part they only guessed, they got: never say they worked it out, saw why, or found it by a method they did not show. Never call a confirmed answer a guess, unverified or confirmed too early, and never take back a verdict you gave.',
];

export const V2_HOMEWORK_JUDGE_EVERY_ANSWER = 'Whenever the student gives an answer (with or without working, sure or hedged, to the sheet or to a question of their own), say plainly whether it is right before anything else: against the checked answer for the sheet, against your own working for their own question. Never hold back that verdict to ask for working first; ask how they got it afterwards, if it helps.';

/** The homework part of the session part (turn.ts v2SessionPart), in place of the plan map. */
export function v2HomeworkPart(hw: V2HomeworkProblem): string {
  const prior = marksInWords(hw.priorConfirmed ?? []);
  return [
    'HOMEWORK',
    'The student has opened ONE problem from their own homework sheet. It reads (verbatim):',
    hw.text.trim().slice(0, 4000),
    hw.priorNote ? `What happened last time on this problem: ${oneLine(hw.priorNote, 400)}` : '',
    prior.length ? `Already confirmed correct in an earlier session: ${prior.join('; ')}. Do not ask for these again.` : '',
    `- ${V2_HOMEWORK_NO_REVEAL}`,
    `- ${hw.hasFigure ? HOMEWORK_PROBLEM_FIGURE_SHOWN : HOMEWORK_PROBLEM_NO_FIGURE}`,
    hw.verified && hw.expected ? `- The sheet's checked answer (for you only: never state it, or any value in it, before the student has written it themselves): ${hw.expected}${hw.solutionPath?.length ? `\n  One checked route to it: ${hw.solutionPath.join('; ')}. A student may take another valid route.` : ''}` : '',
    hw.verified
      ? '- Each answer the student gives is checked against the sheet\'s checked answer key, and what the check found is in the facts as "answer check". It is right: when your own working disagrees with it, look again at yours. Call a part done only when the homework record in the facts lists it as confirmed. Never mention the record, the check or the key to the student: they are yours to read. When you are sure an answer to a part is right and the record does not list it, ask once for that part\'s final answer on its own, then go on with what is left.'
      : `- ${HOMEWORK_PROBLEM_UNVERIFIED}`,
    '- Labels and values are the ones on the student\'s sheet, as written in the problem above.',
    `- ${V2_HOMEWORK_JUDGE_EVERY_ANSWER}`,
    ...V2_HOMEWORK_ACCURACY_RULES.map((r) => `- ${r}`),
    '- The session is for this one problem. When the homework record says every part is confirmed correct, say in a sentence that the problem is done, and ask whether they have any question about it. When they say they have none, or that they are finished, call end_lesson.',
    HOMEWORK_PROBLEM_CONDUCT_RULES.trimEnd(),
  ].filter(Boolean).join('\n');
}

/** In place of the student's words at the start of a homework session (turn.ts v2StudentBlock). */
export function v2HomeworkOpener(hw: V2HomeworkProblem): string {
  return `[The session has just started. The student has opened one problem from their homework, and it is on their screen${hw.hasFigure ? ' with its figure: do not draw it again' : ''}. Greet them in a few words and ask the first question that gets them working on it.${hw.priorNote || hw.priorConfirmed?.length ? ' They worked on it in an earlier session: say in a sentence where that left off and carry on from there.' : ''} Keep it short.]`;
}

/** Whether the session is in homework mode. */
export const isHomeworkSession = (s: V2Session): s is V2Session & { homework: V2HomeworkProblem } => !!s.homework;

/** What the turn route resolves for a homework plan: the problem as the tutor sees it, and the key, which only
 *  the checker reads. Null for every other plan. */
export interface V2HomeworkResolved { problem: V2HomeworkProblem; key?: AnswerKey; turn: HomeworkProblemTurn }

export async function v2HomeworkFor(
  planId: string | undefined, partnerId: string | undefined,
  deps: HomeworkProblemTurnDeps & { env?: Record<string, string | undefined> } = {},
): Promise<V2HomeworkResolved | null> {
  if (!planId) return null;
  const turn = await resolveHomeworkProblemTurn(planId, deps);
  if (!turn) return null;
  return { problem: v2HomeworkSession(turn, { noReveal: noRevealLedgerForPartner(partnerId, deps.env) }), ...(turn.homeworkProblem.key ? { key: turn.homeworkProblem.key } : {}), turn };
}

/** The homework record from a client-held state, kept to well-formed marks. */
export function readHomeworkState(raw: unknown): V2HomeworkState | undefined {
  const h = raw as Partial<V2HomeworkState> | null | undefined;
  if (!h || typeof h !== 'object') return undefined;
  const sheet = readSheetRecord(h.sheet);
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const guessed = Array.isArray(h.guessed) ? h.guessed.map((g) => ({ label: str(g?.label, 8), value: str(g?.value, 80) })).filter((g) => g.value).slice(-25) : [];
  const own = Array.isArray(h.own) ? h.own.map((o) => ({ q: str(o?.q, 200), a: str(o?.a, 120) })).filter((o) => o.a).slice(-5) : [];
  return { confirmed: sanitizeConfirmedMarks(h.confirmed), ...(h.done === true ? { done: true } : {}), ...(Number.isInteger(h.doneAt) && (h.doneAt as number) >= 0 ? { doneAt: h.doneAt } : {}), ...(sheet ? { sheet } : {}), ...(guessed.length ? { guessed } : {}), ...(own.length ? { own } : {}) };
}

/** A homework verdict as the browser records it (useV2Turns → `homework_keyed_verdict`, the outcome route's input). */
export interface V2HomeworkVerdict { part: string; verdict: 'correct' | 'incorrect'; value?: string }

export interface V2HomeworkCheckResult {
  /** The facts' "answer check" line; absent when the message answered nothing the key can judge. */
  answerCheck?: string;
  /** This message's decided verdicts, for the `homework-keyed-verdict` frames. */
  verdicts: V2HomeworkVerdict[];
  /** Every mark confirmed so far, earlier sessions' included. */
  confirmed: string[];
  done: boolean;
  /** This message completed the problem (the `homework-problem-done` frame). */
  justDone: boolean;
}

/** The student's own messages in a v2 history, in the plain form the keyed checks read. Tool results carry
 *  no text; the runtime's own placeholders ("[The session has just started…]") are runtime notes to them. */
export function studentMessagesOf(history: V2State['history']): Array<{ role: 'user'; content: string }> {
  const out: Array<{ role: 'user'; content: string }> = [];
  for (const m of history) {
    if (m.role !== 'user') continue;
    const text = typeof m.content === 'string' ? m.content : (m.content.find((b) => b.type === 'text') as { text?: string } | undefined)?.text;
    if (typeof text === 'string') out.push({ role: 'user', content: text });
  }
  return out;
}

/** Where a worked message breaks into the steps it states, last first ("…, so x = 30", "…, which gives 4/11"). */
// 2026-11-24: and before the words that open a result in Chinese or Japanese (所以 x = 11, だから x = 11).
// 2026-11-24: and in Hindi (इसलिए x = 11); French and Spanish have theirs once the message is read as the checks read it.
const STEP_BREAK = /(?<=[.!?;])\s+|,\s*|\s+(?=\b(?:so|which|that|therefore|then|giving|gives|hence)\b)|\s*(?=所以|因此|於是|于是|だから|なので|よって|इसलिए|इसीलिए)/i;
const exprKey = (s: string) => s.toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/\.$/, '');
/**
 * A key part stated as "name = expression" (`g^-1(x) = 3x + 1`) and an answer that offers the expression alone
 * ("maybe 3x + 1?"): the keyed check needs the name and leaves it undecided (validation round 2, precalculus). The
 * expression counts when it is the same text as the key's right-hand side, and holds a variable (a bare number is
 * not taken for a formula). Credit only.
 */
function nameEqualsCredit(candidate: string, key: AnswerKey): KeyedVerdict[] {
  const said = exprKey(candidate);
  if (!said || said.includes('=') || !/[a-z]/.test(said)) return [];
  for (const p of key.parts) {
    const text = p.canonical.kind === 'text' ? p.canonical.value : p.final;
    const eq = text.split(';')[0];
    const at = eq.indexOf('=');
    if (at < 0) continue;
    if (exprKey(eq.slice(at + 1)) === said) return [{ verdict: 'correct', part: partLabel(p.label), matched: candidate.trim() }];
  }
  return [];
}

/** The words that offer a value tentatively. */
const HEDGE = /^(?:(?:and|but|so|um+|uh+|hmm+|ok(?:ay)?)[,\s]+)*(?:maybe|perhaps|probably|i (?:think|guess)(?: it'?s| it is)?|is it|could it be|would it be|might it be)\s+/i;
/** The value a step states after its verb ("simplifies to 4/11", "the area is 52 cm²"). */
const STEP_VALUE = /\b(?:to|is|are|equals?|be|get|got|gives|makes|comes to)\s+(\S.*)$/i;

/**
 * A message that shows its working states several values, and the keyed check (rightly) will not pick one
 * ("8 + 5 + 6 + 3 is 22, so 8 out of 22, which simplifies to 4/11"). v1 asked its model pre-check for the
 * student's final value and re-checked that against the key (keyed-verdict.ts modelCheckConfirms). Here the
 * message's own steps are read, last first, with that same re-check: a value counts only when it is in the
 * student's words and confirms by the deterministic rules. Credit only — never a denial — so a slip in an
 * earlier step can never mark a right final answer wrong. A step that ends in a question is not an answer.
 */
export function workedAnswerCredit(studentSaid: string, key: AnswerKey): KeyedVerdict[] {
  // A hedged answer ("maybe 3x + 1?", "is it x = 8", "I think 4") counts as the answer it offers, as in v1
  // (Praveen 2026-11-14). Any other step that ends in a question is a question, not an answer.
  // The message as the checks read it (voice/answer-text.ts): full-width marks, 等於, 答案是, 可能是 … 嗎？
  studentSaid = answerText(studentSaid);
  const steps = studentSaid.split(STEP_BREAK).map((x) => x.trim()).filter(Boolean)
    .map((x) => (/\?\s*$/.test(x) ? (HEDGE.test(x) ? x.replace(HEDGE, '').replace(/\?+\s*$/, '').trim() : '') : x.replace(HEDGE, '').trim() || x))
    .filter(Boolean).reverse();
  for (const step of steps) {
    const value = STEP_VALUE.exec(step)?.[1];
    // A chain of equalities ends on the result: "P = 2(x + 5) + 2(4) = 2x + 18" offers 2x + 18.
    const lastSide = step.includes('=') ? step.slice(step.lastIndexOf('=') + 1).trim() : '';
    for (const candidate of [...new Set([step, ...(value && value !== step ? [value] : []), ...(lastSide ? [lastSide] : [])])]) {
      const v = modelCheckConfirms(candidate, studentSaid, key);
      if (v.length) return v;
      const named = nameEqualsCredit(candidate, key);
      if (named.length) return named;
    }
  }
  return [];
}

/**
 * Design 2–3: the student's message checked against the key before the model is called. The deterministic
 * keyed check first (voice/keyed-verdict.ts, sheet-scoped exactly as v1); a worded answer to a prose part,
 * which nothing deterministic can match, is put to the prose match (one small model call) as v1 does. The
 * result is what the facts say; the key's values are never in it.
 */
/** `languages` (2026-11-24): the session's, lesson language first. An answer worded in French or Spanish is written in
 *  English's script, so only the session can say how to read it (voice/answer-text.ts); the student's messages are
 *  put in the checks' form here, once, and every check below reads that. */
export async function v2HomeworkCheck(input: {
  key: AnswerKey | undefined; problem: V2HomeworkProblem; state: V2State; studentSaid: string | null;
  proseMatch?: ProseAnswerMatchFn; languages?: readonly string[] | null;
}): Promise<V2HomeworkCheckResult> {
  const prior = input.state.homework?.confirmed ?? input.problem.priorConfirmed ?? [];
  const wasDone = input.state.homework?.done === true;
  const key = input.problem.verified ? input.key : undefined;
  if (!key?.parts.length || input.studentSaid === null || wasDone) return { verdicts: [], confirmed: [...prior], done: wasDone, justDone: false };
  const base = taughtIn(input.languages)?.base;
  const worded = base === 'hi' || base === 'fr' || base === 'es';
  const history = worded ? studentMessagesOf(input.state.history).map((m) => ({ ...m, content: answerText(m.content, input.languages) })) : studentMessagesOf(input.state.history);
  const said = worded ? answerText(input.studentSaid, input.languages) : input.studentSaid;
  const decided = scopedKeyedVerdicts(history, said, key, prior).filter((v): v is KeyedVerdict & { verdict: 'correct' | 'incorrect' } => v.verdict !== 'undecided');
  const verdicts: V2HomeworkVerdict[] = decided.map((v) => ({ part: partLabel(v.part ?? ''), verdict: v.verdict, ...(v.value ? { value: v.value } : {}) }));
  const credit: string[] = [];
  // Undecided because the message shows its working: its own last stated value, re-checked against the key.
  if (!decided.length) {
    const worked = inSheetScope([...history.map((m) => m.content), said], key, prior, workedAnswerCredit(said, key));
    for (const v of worked) { credit.push(v.value ? `value:${v.part ?? ''}=${v.value}` : `part:${v.part ?? ''}`); verdicts.push({ part: partLabel(v.part ?? ''), verdict: 'correct', ...(v.value ? { value: v.value } : {}) }); }
  }
  if (!verdicts.length && key.parts.some((p) => p.prose)) {
    const msgs = [...history.map((m) => m.content), said];
    const candidates = proseMatchCandidates(msgs, key, confirmedKeyMarks(history, said, key, prior)).filter((p) => proseCreditForPart(msgs, key, prior, p).length);
    if (candidates.length) {
      const match = input.proseMatch ?? (await import('../voice/prose-answer-match')).proseAnswerMatches;
      const found = await Promise.all(candidates.map((p) => match({ problem: input.problem.text, label: p.label, keyStatement: p.final, studentMessage: input.studentSaid ?? said }).catch(() => null)));
      const hits = candidates.filter((_, i) => found[i] === true);
      if (hits.length === 1) for (const v of proseCreditForPart(msgs, key, prior, hits[0])) { credit.push(`part:${v.part ?? ''}`); verdicts.push({ part: partLabel(v.part ?? ''), verdict: 'correct' }); }
    }
  }
  const all = [...prior, ...credit];
  const confirmed = confirmedKeyMarks(history, said, key, all);
  const done = allKeyPartsConfirmed(history, said, key, all);
  const lines = verdicts.map((v) => `part ${v.part || '(the answer)'}${v.value ? `, ${v.value}` : ''}: ${v.verdict === 'correct' ? 'the student\'s answer matches the checked answer' : 'the student\'s answer does not match the checked answer'}`);
  return { ...(lines.length ? { answerCheck: lines.join('; ') } : {}), verdicts, confirmed, done, justDone: done };
}

// ── Whole-sheet homework (design 10) ─────────────────────────────────────────────────────────────────────────
// A homework-help plan carrying the sheet's problems (lesson-plan/homework.ts) and not a one-problem plan. The
// sheet's build (homework-build) holds a key per problem; a problem whose key is not ready is never graded.

export interface V2SheetResolved { sheet: V2HomeworkSheet; keys: Record<number, AnswerKey> }

export async function v2SheetFor(
  plan: { id?: string; metadata?: Record<string, unknown> } | null, partnerId: string | undefined,
  deps: { getBuild?: (planId: string) => Promise<Pick<HomeworkBuildDoc, 'problems'> | null>; env?: Record<string, string | undefined> } = {},
): Promise<V2SheetResolved | null> {
  // A one-problem plan copies its sheet's metadata; it is never a sheet itself.
  if (!plan || plan.metadata?.kind === HOMEWORK_PROBLEM_KIND) return null;
  const problems = homeworkProblemsOf(plan);
  if (!problems?.length) return null;
  const getBuild = deps.getBuild ?? (async (id: string) => (await import('../homework-build/store')).getHomeworkBuild(id));
  let build: Pick<HomeworkBuildDoc, 'problems'> | null = null;
  try { build = plan.id ? await getBuild(plan.id) : null; } catch { build = null; }
  const keys: Record<number, AnswerKey> = {};
  for (const p of problems) {
    const pb = build?.problems.find((b) => b.n === p.n) as { key?: AnswerKey | null; status?: string } | undefined;
    const key = pb && (pb.status === undefined || pb.status === 'ready') ? pb.key ?? undefined : undefined;
    if (key?.parts?.length) keys[p.n] = key;
  }
  return {
    sheet: {
      problems: problems.map((p) => ({ n: p.n, text: p.text, verified: !!keys[p.n], ...(keys[p.n] ? { parts: keys[p.n].parts.map((x) => partLabel(x.label)), expected: keyFinalsLine(keys[p.n]) } : {}) })),
      ...(noRevealLedgerForPartner(partnerId, deps.env) ? { noReveal: true } : {}),
    },
    keys,
  };
}

/** The sheet part of the session part (turn.ts v2SessionPart), in place of the plan map. */
export function v2SheetPart(sheet: V2HomeworkSheet): string {
  return [
    'HOMEWORK',
    `The student has brought their homework sheet: ${sheet.problems.length} problem${sheet.problems.length === 1 ? '' : 's'}, verbatim:`,
    ...sheet.problems.map((p) => `${p.n}. ${p.text.trim().slice(0, 4000)}${p.expected ? `\n   checked answer (for you only: never state it, or any value in it, before the student has written it themselves): ${p.expected}` : ''}`),
    `- ${V2_HOMEWORK_NO_REVEAL}`,
    '- They may work the problems in any order, and may skip one. Before you work a problem, call set_current_problem with its number: the answer check and the homework record in the facts follow the problem in play.',
    '- Each answer to a problem with a checked key is checked against it, and what the check found is in the facts as "answer check". It is right: when your own working disagrees with it, look again at yours. Never mention the record, the check or the key to the student: they are yours to read. When you are sure an answer is right and the record does not list it, ask once for that part\'s final answer on its own, then go on. A problem without a checked key is never called right or wrong: work it through with them, name any slip in their working, and ask them to check the final result with their teacher.',
    `- ${V2_HOMEWORK_JUDGE_EVERY_ANSWER}`,
    ...V2_HOMEWORK_ACCURACY_RULES.map((r) => `- ${r}`),
    '- When the record says a problem is done, say so and offer the next open one. When every problem is done, say the sheet is done and ask whether they have any question about it; when they say they have none, or that they are finished, call end_lesson.',
    '- Labels and values are the ones on the student\'s sheet, as written above.',
    HOMEWORK_PROBLEM_CONDUCT_RULES.trimEnd(),
  ].join('\n');
}

/** In place of the student's words at the start of a whole-sheet session. */
export function v2SheetOpener(sheet: V2HomeworkSheet): string {
  return `[The session has just started. The student has brought a homework sheet of ${sheet.problems.length} problem${sheet.problems.length === 1 ? '' : 's'}, which they can see. Greet them in a few words and ask which problem they want to start with, or start with problem ${sheet.problems[0]?.n ?? 1} if they have no preference. Keep it short.]`;
}

/** How a problem is named by its number, per language: the English words, then 第 2 題 / 第三題 / 問2 / 2番, then French, Spanish and Hindi. */
const PROBLEM_NAMED: ReadonlyArray<RegExp> = [
  /\b(?:problem|question|number|no\.|#)\s*(\d{1,2})\b/gi,
  /第\s*(\d{1,2}|[一二兩两三四五六七八九十]{1,3})\s*(?:大題|大题|題|题|問|番)/gu,
  /(?:問題?|问题)\s*(\d{1,2})/gu,
  /(\d{1,2})\s*番/gu,
  // 2026-11-24: "exercice 3", "numéro 3", "problema 3", "pregunta 3"; सवाल 3, प्रश्न नंबर 3, 3 नंबर का सवाल.
  /\b(?:problème|exercice|numéro|problema|ejercicio|pregunta|número)\s*(\d{1,2})\b/gi,
  /(?:सवाल|प्रश्न|क्वेश्चन|प्रॉब्लम)\s*(?:नंबर|संख्या|number)?\s*(\d{1,2})/gu,
  /(\d{1,2})\s*(?:नंबर|number)\s*(?:का|वाला|वाले)?\s*(?:सवाल|प्रश्न|question|problem)/giu,
];

/** Every problem number a text names, in the order named (2026-11-24: 第2題 and 第三題 were not read). */
export function problemNumbersNamed(text: string | null | undefined): number[] {
  const t = fullWidthToAscii(text ?? '');
  const found: Array<{ at: number; n: number }> = [];
  for (const re of PROBLEM_NAMED) for (const m of t.matchAll(re)) {
    const n = Number(/^\d/.test(m[1]) ? m[1] : numeralValue(m[1]) ?? NaN);
    if (Number.isInteger(n)) found.push({ at: m.index ?? 0, n });
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.n);
}

/** A problem of the sheet the student's message names ("problem 2", "question 3", "number 4", "#5"). */
export function sheetProblemNamed(studentSaid: string | null, sheet: V2HomeworkSheet): number | null {
  const n = problemNumbersNamed(studentSaid)[0] ?? NaN;
  return sheet.problems.some((p) => p.n === n) ? n : null;
}

/** The sheet's record before any turn: the first problem in play, nothing solved. */
export function newSheetRecord(sheet: V2HomeworkSheet): NonNullable<V2HomeworkState['sheet']> {
  return { current: sheet.problems[0]?.n ?? 1, since: 0, solved: [], confirmed: {} };
}

/** The sheet's record from a client-held state, kept to problems on the sheet and well-formed marks. */
export function readSheetRecord(raw: unknown): V2HomeworkState['sheet'] | undefined {
  const r = raw as Partial<NonNullable<V2HomeworkState['sheet']>> | null | undefined;
  if (!r || typeof r !== 'object' || !Number.isInteger(r.current)) return undefined;
  const solved = Array.isArray(r.solved) ? [...new Set(r.solved.filter((n): n is number => Number.isInteger(n)))].slice(0, 25) : [];
  const confirmed: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(r.confirmed ?? {}).slice(0, 25)) if (/^\d{1,2}$/.test(k)) confirmed[k] = sanitizeConfirmedMarks(v);
  return { current: r.current as number, since: Number.isInteger(r.since) && (r.since as number) >= 0 ? (r.since as number) : 0, solved, confirmed };
}
