/**
 * Learner-model estimator — pure functions over evidence events.
 *
 * No imports from `src/models/*` (or anything else DB-shaped) on purpose:
 * this module must be usable from a plain Node process with no Mongo
 * connection, and its test section (`scripts/test-learner-model.ts`) runs
 * without a DB. The evidence-append service (Task 7, `learner-model/store.ts`)
 * is the only caller that bridges this to Mongoose documents.
 *
 * Recency-and-source-weighted average of outcomes → an LO mastery estimate,
 * plus a spaced-review scheduler derived from the same evidence stream.
 */

export type EvidenceSource =
  | 'session'
  | 'assessment'
  | 'quiz'
  | 'practice'
  | 'mock'
  | 'diagnostic';

export interface EvidenceLike {
  source: EvidenceSource;
  outcome: number;
  occurredAt: Date;
}

export const TUNING = {
  sourceWeights: {
    mock: 3.0,
    quiz: 2.0,
    assessment: 2.0,
    practice: 1.5,
    session: 1.0,
    diagnostic: 1.0,
  } as Record<EvidenceSource, number>,
  recencyTauDays: 30,
  confidence: { medium: 2, high: 6 }, // n_eff floors
  trendDelta: 0.05,
  /** learner-state route (Task 9): how far back the "prior" snapshot for
   *  trend comparison is dated (M4 — was a bare `14` at the call site). */
  trendWindowDays: 14,
  untouchedPrior: 0.3,
  review: {
    minOutcome: 0.7,
    minEstimate: 0.6,
    baseDays: 2,
    capDays: 60,
    minSpacingDays: 1,
  },
  projection: {
    mockAlpha: 0.6,
    bandHalfWidth: { sat: 80, act: 4, ap: 1, readiness: 15 },
    highConfidenceScale: 0.5,
    /** projection.ts's `meanConfidenceWeight` (M4 — was a module-local
     *  `CONFIDENCE_WEIGHT` const). 0 (all low) .. 1 (all high). */
    confidenceWeight: { low: 0, medium: 0.5, high: 1 } as Record<'low' | 'medium' | 'high', number>,
    /** projection.ts's `pickCurveVariant` — the router-approximation cutoff
     *  (section mean >= this → 'hard' variant) for adaptive digital-SAT
     *  sections (M4 — was a bare `0.5` at the call site). */
    hardVariantThreshold: 0.5,
  },
};

export interface LoEstimate {
  estimate: number;
  nEff: number;
  confidence: 'low' | 'medium' | 'high';
}

/** Recency-and-source-weighted average of `outcome` across evidence for one
 *  LO. Weight per event = source weight * exp(-age_days / tau). `nEff` (the
 *  weight sum) drives the confidence band; `null` when there's no evidence. */
export function estimateLo(events: EvidenceLike[], now: Date): LoEstimate | null {
  if (events.length === 0) return null;
  let num = 0;
  let den = 0;
  for (const e of events) {
    const ageDays = Math.max(0, (now.getTime() - e.occurredAt.getTime()) / 86400000);
    const w = (TUNING.sourceWeights[e.source] ?? 1) * Math.exp(-ageDays / TUNING.recencyTauDays);
    num += w * Math.max(0, Math.min(1, e.outcome));
    den += w;
  }
  const estimate = num / den;
  const confidence =
    den >= TUNING.confidence.high ? 'high' : den >= TUNING.confidence.medium ? 'medium' : 'low';
  return { estimate, nEff: den, confidence };
}

/** 'up'/'down' when the estimate moved by more than `trendDelta` since the
 *  14-day-ago snapshot; 'flat' otherwise (including when either side is
 *  missing — nothing to compare against). */
export function trendOf(
  current: number | null,
  prior: number | null | undefined,
): 'up' | 'flat' | 'down' {
  if (current == null || prior == null) return 'flat';
  const delta = current - prior;
  return delta > TUNING.trendDelta ? 'up' : delta < -TUNING.trendDelta ? 'down' : 'flat';
}

/** Spaced-repetition due date. Weak LOs (estimate below `minEstimate`) get
 *  `null` — they need remediation, not review. Otherwise: count spaced
 *  successes (`k`, same-day repeats collapse to one via `minSpacingDays`),
 *  double the half-life per success (capped at `capDays`), and schedule
 *  `halfLifeDays` after the most recent success. */
export function nextReviewAt(events: EvidenceLike[], estimate: number, now: Date): Date | null {
  if (estimate < TUNING.review.minEstimate) return null;
  const successes = events
    .filter((e) => e.outcome >= TUNING.review.minOutcome)
    .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
  if (successes.length === 0) return null;
  let k = 0;
  let last = successes[0];
  for (const s of successes.slice(1)) {
    if (s.occurredAt.getTime() - last.occurredAt.getTime() >= TUNING.review.minSpacingDays * 86400000) {
      k += 1;
    }
    last = s;
  }
  const halfLifeDays = Math.min(TUNING.review.capDays, TUNING.review.baseDays * 2 ** k);
  return new Date(last.occurredAt.getTime() + halfLifeDays * 86400000);
}
