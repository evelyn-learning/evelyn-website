/**
 * Topic-notes baseline registry.
 *
 * Mirrors the lesson-plan/store.ts pattern: each baseline is a TS seed
 * module imported here and registered in `SEED_BASELINES`. Adding a
 * baseline = importing the seed file + adding the constant to the array.
 * Updating a baseline = editing the seed file and bumping
 * `baselineVersion` inside it.
 *
 * Baselines are immutable at runtime. Per-student overlays live in
 * Mongo (see `apply-overlay.ts` + `src/models/StudentTopicNotes.ts`).
 *
 * `baselineId === planId` (the corresponding lesson plan id), so callers
 * can resolve from a plan id without an extra mapping.
 */

import type { TopicNotesBaseline } from './types';

// ---------------------------------------------------------------------------
// Baseline imports — registered as they're authored.
//
// Phase 1 (AP Macro U4) — all 7 baselines shipped:
//   ✓ loanable-funds       (hand-authored calibration baseline)
//   ✓ functions-of-money   (extracted via scripts/extract-topic-notes-baselines.ts)
//   ✓ banking-money-creation
//   ✓ financial-assets
//   ✓ nominal-vs-real-interest-rates
//   ✓ money-market
//   ✓ monetary-policy
//
// FRQ-practice plans (ap-macro-u4-frq-practice etc.) deferred to Phase 2 —
// they need a different extractor pass (no concept segments to extract from;
// they're pure practice → pointers + methods only, no theory).
// ---------------------------------------------------------------------------

import { BASELINE_AP_MACRO_LOANABLE_FUNDS } from './seeds/ap-macro-u4-loanable-funds';
import { BASELINE_AP_MACRO_FUNCTIONS_OF_MONEY } from './seeds/ap-macro-u4-functions-of-money';
import { BASELINE_AP_MACRO_BANKING_MONEY_CREATION } from './seeds/ap-macro-u4-banking-money-creation';
import { BASELINE_AP_MACRO_FINANCIAL_ASSETS } from './seeds/ap-macro-u4-financial-assets';
import { BASELINE_AP_MACRO_NOMINAL_VS_REAL_INTEREST_RATES } from './seeds/ap-macro-u4-nominal-vs-real-interest-rates';
import { BASELINE_AP_MACRO_MONEY_MARKET } from './seeds/ap-macro-u4-money-market';
import { BASELINE_AP_MACRO_MONETARY_POLICY } from './seeds/ap-macro-u4-monetary-policy';

// AP Statistics Unit 1 (CED 1.1–1.10) — calibration unit (hand-curated from
// extract-topic-notes-baselines.ts drafts). FRQ-practice plan deferred (no
// concept segments → pointers/methods only).
import { BASELINE_AP_STATS_CATEGORICAL_DATA } from './seeds/ap-stats-u1-categorical-data';
import { BASELINE_AP_STATS_QUANTITATIVE_GRAPHS } from './seeds/ap-stats-u1-quantitative-graphs';
import { BASELINE_AP_STATS_DISTRIBUTION_SHAPE } from './seeds/ap-stats-u1-distribution-shape';
import { BASELINE_AP_STATS_SUMMARY_STATISTICS } from './seeds/ap-stats-u1-summary-statistics';
import { BASELINE_AP_STATS_COMPARING_DISTRIBUTIONS } from './seeds/ap-stats-u1-comparing-distributions';
import { BASELINE_AP_STATS_NORMAL_DISTRIBUTION } from './seeds/ap-stats-u1-normal-distribution';

// AP Statistics Unit 2 (CED 2.1–2.9) — exploring two-variable data (hand-curated
// from extract-topic-notes-baselines.ts drafts). FRQ-practice plan deferred.
import { BASELINE_AP_STATS_TWO_CATEGORICAL_RELATIONSHIPS } from './seeds/ap-stats-u2-two-categorical-relationships';
import { BASELINE_AP_STATS_SCATTERPLOTS } from './seeds/ap-stats-u2-scatterplots';
import { BASELINE_AP_STATS_CORRELATION } from './seeds/ap-stats-u2-correlation';
import { BASELINE_AP_STATS_LINEAR_REGRESSION } from './seeds/ap-stats-u2-linear-regression';
import { BASELINE_AP_STATS_RESIDUALS } from './seeds/ap-stats-u2-residuals';

// AP Statistics Unit 3 (CED 3.1–3.7) — collecting data: sampling & experiments.
import { BASELINE_AP_STATS_SAMPLING_METHODS } from './seeds/ap-stats-u3-sampling-methods';
import { BASELINE_AP_STATS_SAMPLING_BIAS } from './seeds/ap-stats-u3-sampling-bias';
import { BASELINE_AP_STATS_EXPERIMENTAL_DESIGN } from './seeds/ap-stats-u3-experimental-design';
import { BASELINE_AP_STATS_INFERENCE_EXPERIMENTS } from './seeds/ap-stats-u3-inference-experiments';

// AP Statistics Unit 4 (CED 4.1–4.11) — probability, random variables, binomial/geometric.
import { BASELINE_AP_STATS_PROBABILITY_BASICS } from './seeds/ap-stats-u4-probability-basics';
import { BASELINE_AP_STATS_CONDITIONAL_INDEPENDENCE } from './seeds/ap-stats-u4-conditional-independence';
import { BASELINE_AP_STATS_RANDOM_VARIABLES } from './seeds/ap-stats-u4-random-variables';
import { BASELINE_AP_STATS_COMBINING_RV } from './seeds/ap-stats-u4-combining-rv';
import { BASELINE_AP_STATS_BINOMIAL_DISTRIBUTION } from './seeds/ap-stats-u4-binomial-distribution';
import { BASELINE_AP_STATS_GEOMETRIC_DISTRIBUTION } from './seeds/ap-stats-u4-geometric-distribution';

// AP Statistics Unit 5 (CED 5.1–5.8) — sampling distributions & the CLT.
import { BASELINE_AP_STATS_SAMPLING_DISTRIBUTION_CONCEPT } from './seeds/ap-stats-u5-sampling-distribution-concept';
import { BASELINE_AP_STATS_CENTRAL_LIMIT_THEOREM } from './seeds/ap-stats-u5-central-limit-theorem';
import { BASELINE_AP_STATS_PROPORTIONS_SAMPLING_DIST } from './seeds/ap-stats-u5-proportions-sampling-dist';
import { BASELINE_AP_STATS_MEANS_SAMPLING_DIST } from './seeds/ap-stats-u5-means-sampling-dist';

// AP Statistics Unit 6 (CED 6.1–6.11) — inference for proportions.
import { BASELINE_AP_STATS_ONE_PROP_CI } from './seeds/ap-stats-u6-one-prop-ci';
import { BASELINE_AP_STATS_ONE_PROP_TEST } from './seeds/ap-stats-u6-one-prop-test';
import { BASELINE_AP_STATS_TEST_ERRORS } from './seeds/ap-stats-u6-test-errors';
import { BASELINE_AP_STATS_TWO_PROP_CI } from './seeds/ap-stats-u6-two-prop-ci';
import { BASELINE_AP_STATS_TWO_PROP_TEST } from './seeds/ap-stats-u6-two-prop-test';

// AP Statistics Unit 7 (CED 7.1–7.10) — inference for means (t-procedures).
import { BASELINE_AP_STATS_ONE_MEAN_CI } from './seeds/ap-stats-u7-one-mean-ci';
import { BASELINE_AP_STATS_ONE_MEAN_TEST } from './seeds/ap-stats-u7-one-mean-test';
import { BASELINE_AP_STATS_TWO_MEAN_CI } from './seeds/ap-stats-u7-two-mean-ci';
import { BASELINE_AP_STATS_TWO_MEAN_TEST } from './seeds/ap-stats-u7-two-mean-test';

// AP Statistics Unit 8 (CED 8.1–8.7) — chi-square inference for categorical data.
import { BASELINE_AP_STATS_CHI_SQUARE_GOODNESS_OF_FIT } from './seeds/ap-stats-u8-chi-square-goodness-of-fit';
import { BASELINE_AP_STATS_CHI_SQUARE_TWOWAY } from './seeds/ap-stats-u8-chi-square-twoway';
import { BASELINE_AP_STATS_CHOOSING_CATEGORICAL_PROCEDURES } from './seeds/ap-stats-u8-choosing-categorical-procedures';

// AP Statistics Unit 9 (CED 9.1–9.5) — inference for regression slopes.
import { BASELINE_AP_STATS_SLOPE_CI } from './seeds/ap-stats-u9-slope-ci';
import { BASELINE_AP_STATS_SLOPE_TEST } from './seeds/ap-stats-u9-slope-test';

export const SEED_BASELINES: TopicNotesBaseline[] = [
  BASELINE_AP_MACRO_LOANABLE_FUNDS,
  BASELINE_AP_MACRO_FUNCTIONS_OF_MONEY,
  BASELINE_AP_MACRO_BANKING_MONEY_CREATION,
  BASELINE_AP_MACRO_FINANCIAL_ASSETS,
  BASELINE_AP_MACRO_NOMINAL_VS_REAL_INTEREST_RATES,
  BASELINE_AP_MACRO_MONEY_MARKET,
  BASELINE_AP_MACRO_MONETARY_POLICY,
  BASELINE_AP_STATS_CATEGORICAL_DATA,
  BASELINE_AP_STATS_QUANTITATIVE_GRAPHS,
  BASELINE_AP_STATS_DISTRIBUTION_SHAPE,
  BASELINE_AP_STATS_SUMMARY_STATISTICS,
  BASELINE_AP_STATS_COMPARING_DISTRIBUTIONS,
  BASELINE_AP_STATS_NORMAL_DISTRIBUTION,
  BASELINE_AP_STATS_TWO_CATEGORICAL_RELATIONSHIPS,
  BASELINE_AP_STATS_SCATTERPLOTS,
  BASELINE_AP_STATS_CORRELATION,
  BASELINE_AP_STATS_LINEAR_REGRESSION,
  BASELINE_AP_STATS_RESIDUALS,
  BASELINE_AP_STATS_SAMPLING_METHODS,
  BASELINE_AP_STATS_SAMPLING_BIAS,
  BASELINE_AP_STATS_EXPERIMENTAL_DESIGN,
  BASELINE_AP_STATS_INFERENCE_EXPERIMENTS,
  BASELINE_AP_STATS_PROBABILITY_BASICS,
  BASELINE_AP_STATS_CONDITIONAL_INDEPENDENCE,
  BASELINE_AP_STATS_RANDOM_VARIABLES,
  BASELINE_AP_STATS_COMBINING_RV,
  BASELINE_AP_STATS_BINOMIAL_DISTRIBUTION,
  BASELINE_AP_STATS_GEOMETRIC_DISTRIBUTION,
  BASELINE_AP_STATS_SAMPLING_DISTRIBUTION_CONCEPT,
  BASELINE_AP_STATS_CENTRAL_LIMIT_THEOREM,
  BASELINE_AP_STATS_PROPORTIONS_SAMPLING_DIST,
  BASELINE_AP_STATS_MEANS_SAMPLING_DIST,
  BASELINE_AP_STATS_ONE_PROP_CI,
  BASELINE_AP_STATS_ONE_PROP_TEST,
  BASELINE_AP_STATS_TEST_ERRORS,
  BASELINE_AP_STATS_TWO_PROP_CI,
  BASELINE_AP_STATS_TWO_PROP_TEST,
  BASELINE_AP_STATS_ONE_MEAN_CI,
  BASELINE_AP_STATS_ONE_MEAN_TEST,
  BASELINE_AP_STATS_TWO_MEAN_CI,
  BASELINE_AP_STATS_TWO_MEAN_TEST,
  BASELINE_AP_STATS_CHI_SQUARE_GOODNESS_OF_FIT,
  BASELINE_AP_STATS_CHI_SQUARE_TWOWAY,
  BASELINE_AP_STATS_CHOOSING_CATEGORICAL_PROCEDURES,
  BASELINE_AP_STATS_SLOPE_CI,
  BASELINE_AP_STATS_SLOPE_TEST,
];

const baselinesById = new Map(SEED_BASELINES.map((b) => [b.baselineId, b]));

/** Look up a topic-notes baseline by id. Returns null when not found.
 *  `baselineId === planId`. */
export function getTopicNotesBaseline(baselineId: string): TopicNotesBaseline | null {
  return baselinesById.get(baselineId) ?? null;
}

/** List all registered baselines (defensive copy). */
export function listTopicNotesBaselines(): TopicNotesBaseline[] {
  return [...SEED_BASELINES];
}

/** List baselines for a course (e.g. `'AP Macroeconomics'`). */
export function listTopicNotesBaselinesForCourse(course: string): TopicNotesBaseline[] {
  return SEED_BASELINES.filter((b) => b.course === course);
}

/** List baselines for a specific course + CED unit. Used for the
 *  per-unit reading view (Phase 2) which composes constituent topic
 *  baselines + each student's overlays into a unit-level rendering. */
export function listTopicNotesBaselinesForUnit(
  course: string,
  cedUnit: number,
): TopicNotesBaseline[] {
  return SEED_BASELINES.filter((b) => b.course === course && b.cedUnit === cedUnit);
}
