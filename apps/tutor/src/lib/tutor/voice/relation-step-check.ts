// src/lib/tutor/voice/relation-step-check.ts
/**
 * Tiered relation check for ONE boarded show_equation — OBSERVATION ONLY.
 * Exercised by scripts/test-relation-step-check.ts.
 *
 * Production sessions put wrong inequality steps on the whiteboard (a
 * comparator not flipped, a strict/non-strict swap at a boundary) and nothing
 * could see them: the answer matcher returns "unknown" for anything with
 * < > ≤ ≥. relation-sampling.ts decides one-variable linear relations exactly;
 * this module decides WHAT a step is compared with and WHEN a difference is
 * worth counting. Nothing here rejects, notes or kills — the caller emits
 * events.
 *
 * Tiers, first that applies:
 *   chain       an explicit ⟺ / ⟹ inside the card: each link is compared.
 *               ⟺ counts any `differs`; ⟹ counts only `drops` (a weaker
 *               consequence is a legitimate implication).
 *   vs-problem  the step against the active problem's relation. Counts
 *               `drops` / `both`. `adds`-only is NOT counted: it is the
 *               legitimate half of a split compound inequality.
 *   adjacent    the step against the previous relation boarded on the same
 *               page for the same problem — used when there is no problem
 *               relation to compare with, or that comparison is `unknown`.
 *               Counts `drops` / `both`, and never right after a partial
 *               (adds-only) relation, whose successor may be the other half.
 *
 * Skipped entirely (tier 'none'):
 *   · the label reads as a deliberate wrong step or as student work;
 *   · the problem statement did not yield a relation (a word problem, a
 *     domain restriction, more than one relation): the comparator works over
 *     the reals and cannot know an integer or non-negative domain.
 *
 * `unknown` is never counted. Pure, never throws, client-safe.
 */
import {
  compareRelations,
  extractProblemRelation,
  formatWitness,
  parseRelation,
  splitRelationChain,
  type ParseResult,
  type Relation,
  type SetCompare,
} from './relation-sampling';

export type RelationCheckTier = 'chain' | 'vs-problem' | 'adjacent' | 'none';

/** A relation that was boarded and can serve as the next step's reference. */
export interface BoardedRelation {
  latex: string;
  relation: Relation;
  /** It admits more than its reference did (one half of a split compound, a
   *  weaker consequence) — the next step is not expected to be equivalent. */
  partial: boolean;
}

export interface EquationRelationCheck {
  tier: RelationCheckTier;
  /** Null only when nothing was compared (tier 'none'). */
  compare: SetCompare | null;
  /** A disagreement that cannot be a legitimate step. */
  counted: boolean;
  skipped?: 'label' | 'word-problem' | 'nothing-to-compare';
  /** Why the problem statement yielded no relation (skipped 'word-problem'). */
  skipReason?: string;
  /** The two texts compared: reference (a) and step (b). */
  referenceLatex?: string;
  stepLatex?: string;
  /** What to remember as "previous" for the next step; null ⇒ leave as is. */
  boarded: BoardedRelation | null;
}

const WRONG_STEP_LABEL_RE = /\b(?:mistakes?|errors?|incorrect|wrong|your\s+work|students?|spot)\b|✗/i;

/** Label marks the equation as a deliberate wrong step or as student work. */
export function isDeliberateWrongStepLabel(label: string): boolean {
  return typeof label === 'string' && WRONG_STEP_LABEL_RE.test(label);
}

const countsAsStepError = (c: SetCompare): boolean =>
  c.verdict === 'differs' && (c.kind === 'drops' || c.kind === 'both');

/** Step against the problem, then against the previous relation. */
function checkStep(
  stepLatex: string,
  step: ParseResult,
  problemRelation: ParseResult | null,
  previous: BoardedRelation | null,
): EquationRelationCheck {
  const problem = problemRelation && problemRelation.ok ? problemRelation.relation : null;
  if (!step.ok) {
    if (!problem && !previous) return { tier: 'none', compare: null, counted: false, skipped: 'nothing-to-compare', boarded: null };
    return {
      tier: problem ? 'vs-problem' : 'adjacent',
      compare: { verdict: 'unknown', reason: `step: ${step.reason}` },
      counted: false,
      referenceLatex: problem ? problem.source : previous?.latex,
      stepLatex,
      boarded: null,
    };
  }
  let vsProblem: EquationRelationCheck | null = null;
  if (problem) {
    const compare = compareRelations(problem, step.relation);
    vsProblem = {
      tier: 'vs-problem',
      compare,
      counted: countsAsStepError(compare),
      referenceLatex: problem.source,
      stepLatex,
      boarded: { latex: stepLatex, relation: step.relation, partial: compare.verdict === 'differs' && compare.kind === 'adds' },
    };
    if (compare.verdict !== 'unknown') return vsProblem;
  }
  if (previous) {
    const compare = compareRelations(previous.relation, step.relation);
    return {
      tier: 'adjacent',
      compare,
      counted: countsAsStepError(compare) && !previous.partial,
      referenceLatex: previous.latex,
      stepLatex,
      boarded: { latex: stepLatex, relation: step.relation, partial: compare.verdict === 'differs' && compare.kind === 'adds' },
    };
  }
  if (vsProblem) return vsProblem;
  return {
    tier: 'none', compare: null, counted: false, skipped: 'nothing-to-compare',
    boarded: { latex: stepLatex, relation: step.relation, partial: false },
  };
}

export function checkEquationRelations(input: {
  latex: string;
  label: string;
  /** extractProblemRelation() of the active problem; null = no active problem. */
  problemRelation: ParseResult | null;
  /** Last relation boarded on the same page for the same problem. */
  previous: BoardedRelation | null;
}): EquationRelationCheck {
  const none: EquationRelationCheck = { tier: 'none', compare: null, counted: false, boarded: null };
  try {
    const latex = typeof input?.latex === 'string' ? input.latex : '';
    const label = typeof input?.label === 'string' ? input.label : '';
    const problemRelation = input?.problemRelation ?? null;
    const previous = input?.previous ?? null;
    if (isDeliberateWrongStepLabel(label)) return { ...none, skipped: 'label' };
    if (problemRelation && !problemRelation.ok) {
      return { ...none, skipped: 'word-problem', skipReason: problemRelation.reason };
    }
    if (latex.trim() === '') return { ...none, skipped: 'nothing-to-compare' };

    const chain = splitRelationChain(latex);
    if (!chain) return checkStep(latex.trim(), parseRelation(latex), problemRelation, previous);

    // ── chain ──
    const parsed = chain.segments.map((seg) => parseRelation(seg));
    let representative: EquationRelationCheck | null = null;
    let anyDiffers = false;
    for (let k = 0; k < chain.connectors.length; k++) {
      const a = parsed[k];
      const b = parsed[k + 1];
      const compare: SetCompare = !a.ok
        ? { verdict: 'unknown', reason: `segment ${k + 1}: ${a.reason}` }
        : !b.ok
          ? { verdict: 'unknown', reason: `segment ${k + 2}: ${b.reason}` }
          : compareRelations(a.relation, b.relation);
      const counted = compare.verdict === 'differs'
        && (chain.connectors[k] === 'iff' ? true : compare.kind === 'drops');
      const link: EquationRelationCheck = {
        tier: 'chain', compare, counted,
        referenceLatex: chain.segments[k], stepLatex: chain.segments[k + 1], boarded: null,
      };
      if (counted) return link;
      if (compare.verdict === 'differs') anyDiffers = true;
      if (compare.verdict !== 'equivalent' && !representative) representative = link;
      if (!representative && k === chain.connectors.length - 1) representative = link;
    }
    const last = parsed[parsed.length - 1];
    const boarded: BoardedRelation | null = last.ok
      ? { latex: chain.segments[chain.segments.length - 1], relation: last.relation, partial: anyDiffers }
      : null;
    // The chain is internally fine (or undecidable); its ENTRY must still
    // follow from the problem / the previous relation.
    const first = parsed[0];
    if (first.ok) {
      const entry = checkStep(chain.segments[0], first, problemRelation, previous);
      if (entry.counted) return { ...entry, boarded };
    }
    return { ...(representative ?? { tier: 'chain', compare: { verdict: 'equivalent' }, counted: false }), boarded };
  } catch {
    return none;
  }
}

/** One short line for a debug event: tier, verdict, and the detail that
 *  matters (reason when unknown; kind + witness when differs). */
export function describeRelationCheck(r: EquationRelationCheck): string {
  try {
    if (r.skipped) return `tier=none skipped=${r.skipped}${r.skipReason ? ` (${r.skipReason})` : ''}`;
    const c = r.compare;
    if (!c) return `tier=${r.tier}`;
    const head = `tier=${r.tier} verdict=${c.verdict}`;
    if (c.verdict === 'unknown') return `${head} reason=${c.reason}`;
    if (c.verdict === 'differs') return `${head} kind=${c.kind} witness=${formatWitness(c.witness)} counted=${r.counted ? 'yes' : 'no'}`;
    return head;
  } catch {
    return 'tier=none';
  }
}

// ── the trail of relations boarded for the current problem ─────────────────
export interface RelationTrail {
  /** Active problem statement the trail belongs to ('' = no active problem). */
  statement: string;
  pageKey: string;
  /** Problem epoch (count of distinct problems served) when the trail began. */
  epoch: number;
  /** Parsed ONCE per problem. Null = no active problem. */
  problemRelation: ParseResult | null;
  previous: BoardedRelation | null;
}

/**
 * Brings the trail up to date before a step is checked: a new problem (other
 * statement or epoch) starts a fresh trail and parses the problem's relation
 * once; a new page keeps the problem and forgets the previous relation.
 */
export function syncRelationTrail(
  trail: RelationTrail | null,
  now: { statement: string | null; pageKey: string; epoch: number },
): { trail: RelationTrail; problemChanged: boolean } {
  const statement = typeof now?.statement === 'string' ? now.statement.trim() : '';
  const pageKey = typeof now?.pageKey === 'string' ? now.pageKey : '';
  const epoch = Number.isFinite(now?.epoch) ? now.epoch : 0;
  if (!trail || trail.statement !== statement || trail.epoch !== epoch) {
    return {
      trail: { statement, pageKey, epoch, problemRelation: statement ? extractProblemRelation(statement) : null, previous: null },
      problemChanged: true,
    };
  }
  if (trail.pageKey !== pageKey) return { trail: { ...trail, pageKey, previous: null }, problemChanged: false };
  return { trail, problemChanged: false };
}

// ── answer key ─────────────────────────────────────────────────────────────
/**
 * The blind solver "agreed" with the brain's claimed answer — but agreement
 * is decided on the first number of each answer, so "−4 < x ≤ 2" agrees with
 * "−4 ≤ x < 2". When the problem's relation and the claimed answer BOTH parse
 * and their solution sets differ, the claimed answer must not be pinned as
 * the verified expected answer. Anything undecidable ⇒ does not contradict.
 */
export function claimedAnswerContradictsProblem(input: { statement: string; claimed: string }):
  { contradicts: boolean; compare: SetCompare } {
  try {
    const problem = extractProblemRelation(input?.statement);
    if (!problem.ok) return { contradicts: false, compare: { verdict: 'unknown', reason: `problem: ${problem.reason}` } };
    const claimed = parseRelation(input.claimed);
    if (!claimed.ok) return { contradicts: false, compare: { verdict: 'unknown', reason: `claimed: ${claimed.reason}` } };
    const compare = compareRelations(problem.relation, claimed.relation);
    return { contradicts: compare.verdict === 'differs', compare };
  } catch {
    return { contradicts: false, compare: { verdict: 'unknown', reason: 'internal failure' } };
  }
}
