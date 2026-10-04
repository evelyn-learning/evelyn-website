// src/lib/tutor/voice/answer-dispute-tiebreak.ts
/**
 * Solver-vs-brain answer dispute, broken by exact substitution.
 * Exercised by scripts/test-answer-dispute-tiebreak.ts.
 *
 * When the blind solver disagrees with the brain's declared answer, the brain
 * used to be told "neither value is confirmed — re-derive and trust that
 * derivation". In production the third derivation was wrong too and won,
 * while the solver had been right. For a one-variable linear relation the
 * dispute is decidable exactly (relation-sampling.ts): an answer whose
 * solution set equals the posed problem's IS the answer.
 *
 *   winner    pinned as verified key      note
 *   solved    solved (delimiters off)     "the answer is <solved>; yours fails at <witness>"
 *   claimed   claimed, if in solved form  none
 *   both      claimed if in solved form,  none
 *             else solved if it is
 *   neither   nothing                     the unconfirmed note + both witnesses
 *   unknown   nothing                     the unconfirmed note (unchanged)
 *
 * Adjudicated ONLY when (2026-10-04):
 *   · the statement is a PURE SOLVE ("Solve …", "Find the solution set …",
 *     "Find all …") — not "which value is a solution", "find one solution",
 *     "the boundary point", "how many", "the least …": there the solution set
 *     is not the answer, and a solver that returned it would be pinned as
 *     VERIFIED while the brain's correct point answer was called a failure;
 *   · the claimed answer is in the problem's comparator class (an `=` point
 *     claimed for an inequality problem answers some other question).
 * Anything else ⇒ `unknown`. Answers are compared after normalisation (one
 * wrapping delimiter pair and trailing sentence punctuation removed). Only a
 * SOLVED form (bare variable against constants) is ever pinned: the key is
 * what the student's spoken answer is matched against.
 *
 * Disabled ⇒ `unknown`'s row for every winner (the winner is still reported).
 * Pure, never throws, client-safe. The caller pins, plants and emits.
 */
import {
  adjudicateAnswerDispute,
  compareRelations,
  extractProblemRelation,
  formatWitness,
  parseRelation,
} from './relation-sampling';
import type { Expr } from './relation-sampling';
import { CORRECTION_NOTE_MARKER } from './relation-step-note';
import { comparatorClassOf } from './relation-step-check';

export type AnswerDisputeWinner = 'claimed' | 'solved' | 'both' | 'neither' | 'unknown';
export type AnswerDisputeAction =
  | 'pin-solved' | 'pin-claimed' | 'pin-claimed-same-set' | 'pin-solved-same-set'
  /** The right answer is known but not written in solved form: pin nothing, no note. */
  | 'no-pin-unsolved-form'
  | 'note-both-fail' | 'unchanged';

export interface AnswerDisputeDecision {
  winner: AnswerDisputeWinner;
  action: AnswerDisputeAction;
  /** Verified expected answer to pin; null = pin nothing. */
  pin: string | null;
  /** Note to plant if the correction-note slot is free; null = no note. */
  note: string | null;
  /** The brain's declared answer is proven wrong — it must not be kept, even
   *  as the unverified (advisory) card answer. */
  claimedRefuted: boolean;
  /** Formatted witnesses ("2", "19/6") where each answer fails. */
  witnessClaimed?: string;
  witnessSolved?: string;
  /** False when the decision is the disabled fallback. */
  enabled: boolean;
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * The form a solver answer is pinned in: the brain's declared answers carry
 * no math delimiters (and neither do pipeline keys), and the pinned key is
 * shown to the brain and compared with what the student says. One wrapping
 * pair of delimiters and trailing sentence punctuation (outside or inside
 * the pair) are removed; anything else is left alone. This is also the text
 * the dispute is adjudicated on.
 */
export function normalizeAnswerForPin(answer: string): string {
  // "x < 2." → "x < 2"; "x = 2.5" is untouched (the mark must END the text).
  const unpunct = (v: string): string => v.replace(/\s*[.,;]+\s*$/, '').trim();
  const t = unpunct(str(answer).replace(/\s+/g, ' ').trim());
  const pairs: Array<[string, string]> = [['$$', '$$'], ['$', '$'], ['\\(', '\\)'], ['\\[', '\\]']];
  for (const [open, close] of pairs) {
    if (t.length > open.length + close.length && t.startsWith(open) && t.endsWith(close)) {
      const inner = unpunct(t.slice(open.length, t.length - close.length).trim());
      if (inner && !inner.includes('$') && !/\\[()[\]]/.test(inner)) return inner;
      return t;
    }
  }
  return t;
}

const ASKS_TO_SOLVE_RE = /\bsolv(?:e|ing)\b|\bfind\s+(?:the\s+)?solution\s+set\b|\bfind\s+all\b/i;
/** "one" / "which" only as a request for a single value: "Solve the one-step
 *  inequality" and "Which way does the sign point?" ask for no such thing. */
const NOT_THE_SOLUTION_SET_RE = /\b(?:which\s+(?:values?|numbers?|of)|one\s+(?:solution|value|example)|a\s+value|an\s+example|boundary|how\s+many|least|greatest|smallest|largest)\b|\bis\b[^.!?]*\ba\s+solution\b/i;

/**
 * The statement asks for the relation's whole solution set and nothing else:
 * it says solve / find the solution set / find all, and does not ask for one
 * value, an example, a boundary, a count or an extreme.
 */
export function isPureSolveStatement(statement: string): boolean {
  const t = str(statement);
  return ASKS_TO_SOLVE_RE.test(t) && !NOT_THE_SOLUTION_SET_RE.test(t);
}

function hasVariable(e: Expr, depth = 0): boolean {
  if (!e || depth > 200) return true; // malformed / too deep ⇒ not a constant
  if (e.kind === 'var') return true;
  if (e.kind === 'num') return false;
  if (e.kind === 'neg') return hasVariable(e.arg, depth + 1);
  return hasVariable(e.left, depth + 1) || hasVariable(e.right, depth + 1);
}

/**
 * Solved form: every part of the relation is the bare variable or a constant
 * ("x < 5", "-4 \\le x < 2", "t \\le \\frac{25}{6}") — and the variable appears.
 * "2x < 10" is the right SET but not an answer a student would say.
 */
export function isSolvedFormAnswer(answer: string): boolean {
  try {
    const p = parseRelation(normalizeAnswerForPin(answer));
    if (!p.ok) return false;
    const parts = p.relation.parts;
    return parts.some((e) => e.kind === 'var') && parts.every((e) => e.kind === 'var' || !hasVariable(e));
  } catch {
    return false;
  }
}

/** Today's note, byte for byte, with optional extra sentences placed before
 *  the closing never-narrate sentence. */
export function buildUnconfirmedDisputeNote(input: { statement: string; claimed: string; solved: string; extra?: string }): string {
  const statement = str(input?.statement);
  const claimed = str(input?.claimed);
  const solved = str(input?.solved);
  const extra = str(input?.extra).trim();
  return (
    `${CORRECTION_NOTE_MARKER} For the problem you just posed ("${statement.slice(0, 120)}"), ` +
    `your stated answer "${claimed.slice(0, 60)}" DISAGREES with an independent solve ("${solved.slice(0, 60)}"). ` +
    `Neither value is confirmed. Before grading the student on this problem, silently re-derive the answer step by step and trust that derivation over both earlier values. ` +
    (extra ? `${extra} ` : '') +
    `Never narrate this note or the act of checking — the student only ever hears normal tutoring.`
  );
}

/** Where `answer` and the problem part ways: the witness and which side holds. */
function witnessAgainstProblem(statement: string, answer: string):
  { variable: string; value: string; problemHolds: boolean } | null {
  const problem = extractProblemRelation(statement);
  if (!problem.ok) return null;
  const parsed = parseRelation(normalizeAnswerForPin(answer));
  if (!parsed.ok) return null;
  const c = compareRelations(problem.relation, parsed.relation);
  if (c.verdict !== 'differs' || c.aHolds === c.bHolds) return null;
  const value = formatWitness(c.witness);
  if (!value) return null;
  return { variable: problem.relation.variable, value, problemHolds: c.aHolds };
}

/** "the problem holds there and your answer does not" / the reverse. */
const sidesAt = (problemHolds: boolean, answerName: string): string =>
  problemHolds ? `the problem holds there and ${answerName} does not` : `${answerName} holds there and the problem does not`;

/**
 * Note for "the solver's answer passes exact substitution, the brain's does
 * not". Null when the claimed answer's failure cannot be stated.
 */
export function buildSolvedWinsNote(input: { statement: string; claimed: string; solved: string }): string | null {
  try {
    const statement = str(input?.statement);
    const claimed = str(input?.claimed).replace(/\s+/g, ' ').trim();
    const solved = normalizeAnswerForPin(str(input?.solved));
    if (!statement || !claimed || !solved) return null;
    const w = witnessAgainstProblem(statement, claimed);
    if (!w) return null;
    return (
      `${CORRECTION_NOTE_MARKER} For the problem you just posed ("${statement.slice(0, 120)}"), ` +
      `the answer is "${solved.slice(0, 80)}" — it satisfies the problem exactly. ` +
      `Your stated answer "${claimed.slice(0, 60)}" fails at ${w.variable} = ${w.value}: ${sidesAt(w.problemHolds, 'your answer')}. ` +
      `Grade the student against "${solved.slice(0, 80)}". Do not re-derive the answer. ` +
      `Never narrate this note or the act of checking — the student only ever hears normal tutoring.`
    );
  } catch {
    return null;
  }
}

export function decideAnswerDisputeTiebreak(input: { enabled: boolean; statement: string; claimed: string; solved: string }): AnswerDisputeDecision {
  const statement = str(input?.statement);
  const claimed = str(input?.claimed);
  const solved = str(input?.solved);
  const enabled = input?.enabled === true;
  const unchanged = (winner: AnswerDisputeWinner, witnessClaimed?: string, witnessSolved?: string): AnswerDisputeDecision => ({
    winner, action: 'unchanged', pin: null,
    note: buildUnconfirmedDisputeNote({ statement, claimed, solved }),
    claimedRefuted: false, enabled,
    ...(witnessClaimed ? { witnessClaimed } : {}), ...(witnessSolved ? { witnessSolved } : {}),
  });
  try {
    // Gate: a pure solve statement, and a claimed answer of the problem's own
    // comparator class. Otherwise the solution set is not (known to be) the
    // answer — today's note, nothing pinned, nothing called a failure.
    const claimedN = normalizeAnswerForPin(claimed);
    const solvedN = normalizeAnswerForPin(solved);
    if (!isPureSolveStatement(statement)) return unchanged('unknown');
    const problem = extractProblemRelation(statement);
    const claimedRel = parseRelation(claimedN);
    if (!problem.ok || !claimedRel.ok || comparatorClassOf(problem.relation) !== comparatorClassOf(claimedRel.relation)) {
      return unchanged('unknown');
    }
    const dispute = adjudicateAnswerDispute({ statement, claimed: claimedN, solved: solvedN });
    const witnessClaimed = dispute.witnessClaimed ? formatWitness(dispute.witnessClaimed) : undefined;
    const witnessSolved = dispute.witnessSolved ? formatWitness(dispute.witnessSolved) : undefined;
    const witnesses = { ...(witnessClaimed ? { witnessClaimed } : {}), ...(witnessSolved ? { witnessSolved } : {}) };
    if (!enabled || dispute.winner === 'unknown') return unchanged(dispute.winner, witnessClaimed, witnessSolved);

    if (dispute.winner === 'claimed' || dispute.winner === 'both') {
      // Only a solved form is a key. The claimed text first (it is what the
      // brain declared); for `both` the solver's, when only that is solved.
      const base = { winner: dispute.winner, note: null, claimedRefuted: false, enabled, ...witnesses };
      if (isSolvedFormAnswer(claimedN)) {
        return { ...base, action: dispute.winner === 'both' ? 'pin-claimed-same-set' : 'pin-claimed', pin: claimedN };
      }
      if (dispute.winner === 'both' && isSolvedFormAnswer(solvedN)) {
        return { ...base, action: 'pin-solved-same-set', pin: solvedN };
      }
      return { ...base, action: 'no-pin-unsolved-form', pin: null };
    }
    if (dispute.winner === 'solved') {
      const pin = solvedN;
      // The pinned text must be a solved form, and the note must be able to
      // state where the claimed answer fails.
      const note = buildSolvedWinsNote({ statement, claimed, solved });
      if (!pin || !isSolvedFormAnswer(pin) || !note) return unchanged('solved', witnessClaimed, witnessSolved);
      return { winner: 'solved', action: 'pin-solved', pin, note, claimedRefuted: true, enabled, ...witnesses };
    }
    // neither
    const wc = witnessAgainstProblem(statement, claimed);
    const ws = witnessAgainstProblem(statement, solved);
    const parts: string[] = [];
    if (wc) parts.push(`your stated answer fails at ${wc.variable} = ${wc.value} (${sidesAt(wc.problemHolds, 'it')})`);
    if (ws) parts.push(`the independent solve fails at ${ws.variable} = ${ws.value} (${sidesAt(ws.problemHolds, 'it')})`);
    const extra = parts.length > 0
      ? `Exact substitution rejects both: ${parts.join('; ')}. Your re-derived answer must pass at ${parts.length > 1 ? 'those values' : 'that value'}.`
      : '';
    return {
      winner: 'neither', action: 'note-both-fail', pin: null,
      note: buildUnconfirmedDisputeNote({ statement, claimed, solved, extra }),
      claimedRefuted: true, enabled, ...witnesses,
    };
  } catch {
    return unchanged('unknown');
  }
}

/** One line for the `improvised_answer_dispute_adjudicated` debug event. */
export function describeAnswerDisputeDecision(d: AnswerDisputeDecision, claimed: string, solved: string): string {
  try {
    return (
      `winner=${d.winner}` +
      `${d.witnessClaimed ? ` witnessClaimed=${d.witnessClaimed}` : ''}` +
      `${d.witnessSolved ? ` witnessSolved=${d.witnessSolved}` : ''}` +
      ` action=${d.action}${d.enabled ? '' : '(flag-off)'}` +
      ` claimed="${str(claimed).slice(0, 40)}" solved="${str(solved).slice(0, 40)}"`
    );
  } catch {
    return 'winner=unknown action=unchanged';
  }
}
