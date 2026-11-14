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
import type { AnswerKey } from '../homework-build/types';
import { resolveHomeworkProblemTurn, type HomeworkProblemTurn, type HomeworkProblemTurnDeps } from '../voice/homework-problem-turn';
import { allKeyPartsConfirmed, confirmedKeyMarks, proseCreditForPart, proseMatchCandidates, sanitizeConfirmedMarks, scopedKeyedVerdicts, type KeyedVerdict } from '../voice/keyed-verdict';
import type { ProseAnswerMatchFn } from '../voice/prose-answer-match';
import { noRevealLedgerForPartner } from '../voice/no-reveal-ledger-gate';
import {
  HOMEWORK_PROBLEM_CONDUCT_RULES, HOMEWORK_PROBLEM_FIGURE_SHOWN, HOMEWORK_PROBLEM_NO_FIGURE, HOMEWORK_PROBLEM_UNVERIFIED,
} from '../voice/homework-problem-block';
import { marksInWords, oneLine, partLabel } from './homework-facts';
import type { V2HomeworkProblem, V2HomeworkState, V2Session, V2State } from './types';

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
    ...(hp.verified && hp.key?.parts.length ? { parts: hp.key.parts.map((p) => partLabel(p.label)) } : {}),
    ...(opts.noReveal ? { noReveal: true } : {}),
  };
}

/** The principle the homework session runs on. It is the one place the constitution's "show the step and move
 *  on after two tries" gives way: here the student must still reach the answer themselves. */
export const V2_HOMEWORK_NO_REVEAL = 'This is the student\'s own homework: they must reach the final answer themselves. Never state it, even when they ask for it outright or ask again; when they are stuck, give the next smallest step. This holds after any number of tries, in place of showing the step and moving on.';

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
    hw.verified
      ? '- Each answer the student gives is checked against the sheet\'s checked answer key, and what the check found is in the facts as "answer check". It is right: when your own working disagrees with it, look again at yours. Call a part done only when the homework record in the facts lists it as confirmed.'
      : `- ${HOMEWORK_PROBLEM_UNVERIFIED}`,
    '- Labels and values are the ones on the student\'s sheet, as written in the problem above.',
    '- The session is for this one problem. When the homework record says every part is confirmed correct, say in a sentence that the problem is done, tell them they can go back to their list, and call end_lesson.',
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
  return { confirmed: sanitizeConfirmedMarks(h.confirmed), ...(h.done === true ? { done: true } : {}) };
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

/**
 * Design 2–3: the student's message checked against the key before the model is called. The deterministic
 * keyed check first (voice/keyed-verdict.ts, sheet-scoped exactly as v1); a worded answer to a prose part,
 * which nothing deterministic can match, is put to the prose match (one small model call) as v1 does. The
 * result is what the facts say; the key's values are never in it.
 */
export async function v2HomeworkCheck(input: {
  key: AnswerKey | undefined; problem: V2HomeworkProblem; state: V2State; studentSaid: string | null;
  proseMatch?: ProseAnswerMatchFn;
}): Promise<V2HomeworkCheckResult> {
  const prior = input.state.homework?.confirmed ?? input.problem.priorConfirmed ?? [];
  const wasDone = input.state.homework?.done === true;
  const key = input.problem.verified ? input.key : undefined;
  if (!key?.parts.length || input.studentSaid === null || wasDone) return { verdicts: [], confirmed: [...prior], done: wasDone, justDone: false };
  const history = studentMessagesOf(input.state.history);
  const said = input.studentSaid;
  const decided = scopedKeyedVerdicts(history, said, key, prior).filter((v): v is KeyedVerdict & { verdict: 'correct' | 'incorrect' } => v.verdict !== 'undecided');
  const verdicts: V2HomeworkVerdict[] = decided.map((v) => ({ part: partLabel(v.part ?? ''), verdict: v.verdict, ...(v.value ? { value: v.value } : {}) }));
  const credit: string[] = [];
  if (!decided.length && key.parts.some((p) => p.prose)) {
    const msgs = [...history.map((m) => m.content), said];
    const candidates = proseMatchCandidates(msgs, key, confirmedKeyMarks(history, said, key, prior)).filter((p) => proseCreditForPart(msgs, key, prior, p).length);
    if (candidates.length) {
      const match = input.proseMatch ?? (await import('../voice/prose-answer-match')).proseAnswerMatches;
      const found = await Promise.all(candidates.map((p) => match({ problem: input.problem.text, label: p.label, keyStatement: p.final, studentMessage: said }).catch(() => null)));
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
