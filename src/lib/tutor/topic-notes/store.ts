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
import { BASELINE_AP_CALCBC_DEFINING_LIMITS } from './seeds/ap-calcbc-u1-defining-limits';
import { BASELINE_AP_CALCBC_INTRODUCING_CALCULUS } from './seeds/ap-calcbc-u1-introducing-calculus';
import { BASELINE_AP_CALCBC_LIMITS_GRAPHS_TABLES } from './seeds/ap-calcbc-u1-limits-graphs-tables';
import { BASELINE_AP_CALCBC_LIMITS_ALGEBRAIC_PROPERTIES } from './seeds/ap-calcbc-u1-limits-algebraic-properties';
import { BASELINE_AP_CALCBC_LIMITS_ALGEBRAIC_MANIPULATION } from './seeds/ap-calcbc-u1-limits-algebraic-manipulation';
import { BASELINE_AP_CALCBC_LIMITS_STRATEGY } from './seeds/ap-calcbc-u1-limits-strategy';
import { BASELINE_AP_CALCBC_SQUEEZE_THEOREM } from './seeds/ap-calcbc-u1-squeeze-theorem';
import { BASELINE_AP_CALCBC_LIMITS_REPRESENTATIONS } from './seeds/ap-calcbc-u1-limits-representations';
import { BASELINE_AP_CALCBC_DISCONTINUITY_TYPES } from './seeds/ap-calcbc-u1-discontinuity-types';
import { BASELINE_AP_CALCBC_CONTINUITY } from './seeds/ap-calcbc-u1-continuity';
import { BASELINE_AP_CALCBC_REMOVING_DISCONTINUITIES } from './seeds/ap-calcbc-u1-removing-discontinuities';
import { BASELINE_AP_CALCBC_INFINITE_LIMITS_ASYMPTOTES } from './seeds/ap-calcbc-u1-infinite-limits-asymptotes';
import { BASELINE_AP_CALCBC_LIMITS_AT_INFINITY } from './seeds/ap-calcbc-u1-limits-at-infinity';
import { BASELINE_AP_CALCBC_IVT } from './seeds/ap-calcbc-u1-ivt';
import { BASELINE_AP_CALCBC_DERIVATIVE_DEFINITION } from './seeds/ap-calcbc-u2-derivative-definition';
import { BASELINE_AP_CALCBC_ESTIMATING_DERIVATIVES } from './seeds/ap-calcbc-u2-estimating-derivatives';
import { BASELINE_AP_CALCBC_DIFFERENTIABILITY_CONTINUITY } from './seeds/ap-calcbc-u2-differentiability-continuity';
import { BASELINE_AP_CALCBC_POWER_RULE_LINEARITY } from './seeds/ap-calcbc-u2-power-rule-linearity';
import { BASELINE_AP_CALCBC_TRANSCENDENTAL_DERIVATIVES } from './seeds/ap-calcbc-u2-transcendental-derivatives';
import { BASELINE_AP_CALCBC_PRODUCT_RULE } from './seeds/ap-calcbc-u2-product-rule';
import { BASELINE_AP_CALCBC_QUOTIENT_RULE } from './seeds/ap-calcbc-u2-quotient-rule';
import { BASELINE_AP_CALCBC_CHAIN_RULE } from './seeds/ap-calcbc-u3-chain-rule';
import { BASELINE_AP_CALCBC_IMPLICIT_DIFFERENTIATION } from './seeds/ap-calcbc-u3-implicit-differentiation';
import { BASELINE_AP_CALCBC_DERIVATIVES_INVERSE } from './seeds/ap-calcbc-u3-derivatives-inverse';
import { BASELINE_AP_CALCBC_HIGHER_ORDER_DERIVATIVES } from './seeds/ap-calcbc-u3-higher-order-derivatives';
import { BASELINE_AP_CALCBC_DERIVATIVE_IN_CONTEXT } from './seeds/ap-calcbc-u4-derivative-context';
import { BASELINE_AP_CALCBC_LHOPITAL } from './seeds/ap-calcbc-u4-lhopital';
import { BASELINE_AP_CALCBC_LINEARIZATION } from './seeds/ap-calcbc-u4-linearization';
import { BASELINE_AP_CALCBC_STRAIGHT_LINE_MOTION } from './seeds/ap-calcbc-u4-motion';
import { BASELINE_AP_CALCBC_RELATED_RATES } from './seeds/ap-calcbc-u4-related-rates';
import { BASELINE_AP_CALCBC_CONCAVITY_SECOND_DERIVATIVE } from './seeds/ap-calcbc-u5-concavity-second-derivative';
import { BASELINE_AP_CALCBC_FIRST_DERIVATIVE_ANALYSIS } from './seeds/ap-calcbc-u5-first-derivative-analysis';
import { BASELINE_AP_CALCBC_GRAPHING_F_FP_FPP } from './seeds/ap-calcbc-u5-graphing-f-fp-fpp';
import { BASELINE_AP_CALCBC_IMPLICIT_BEHAVIORS } from './seeds/ap-calcbc-u5-implicit-behaviors';
import { BASELINE_AP_CALCBC_MVT_EVT } from './seeds/ap-calcbc-u5-mvt-evt';
import { BASELINE_AP_CALCBC_OPTIMIZATION } from './seeds/ap-calcbc-u5-optimization';
import { BASELINE_AP_CALCBC_BASIC_ANTIDERIVATIVES } from './seeds/ap-calcbc-u6-basic-antiderivatives';
import { BASELINE_AP_CALCBC_FTC } from './seeds/ap-calcbc-u6-ftc';
import { BASELINE_AP_CALCBC_IMPROPER_INTEGRALS } from './seeds/ap-calcbc-u6-improper-integrals';
import { BASELINE_AP_CALCBC_INTEGRAL_PROPERTIES } from './seeds/ap-calcbc-u6-integral-properties';
import { BASELINE_AP_CALCBC_INTEGRATION_BY_PARTS } from './seeds/ap-calcbc-u6-integration-by-parts';
import { BASELINE_AP_CALCBC_INTEGRATION_STRATEGY } from './seeds/ap-calcbc-u6-integration-strategy';
import { BASELINE_AP_CALCBC_LONG_DIVISION_COMPLETING_SQUARE } from './seeds/ap-calcbc-u6-long-division-completing-square';
import { BASELINE_AP_CALCBC_PARTIAL_FRACTIONS } from './seeds/ap-calcbc-u6-partial-fractions';
import { BASELINE_AP_CALCBC_RIEMANN_SUMS } from './seeds/ap-calcbc-u6-riemann-sums';
import { BASELINE_AP_CALCBC_U_SUBSTITUTION } from './seeds/ap-calcbc-u6-u-substitution';
import { BASELINE_AP_CALCBC_EULERS_METHOD } from './seeds/ap-calcbc-u7-eulers-method';
import { BASELINE_AP_CALCBC_EXPONENTIAL_MODELS } from './seeds/ap-calcbc-u7-exponential-models';
import { BASELINE_AP_CALCBC_LOGISTIC_MODELS } from './seeds/ap-calcbc-u7-logistic-models';
import { BASELINE_AP_CALCBC_MODELING_VERIFYING_DE } from './seeds/ap-calcbc-u7-modeling-verifying';
import { BASELINE_AP_CALCBC_SEPARATION_OF_VARIABLES } from './seeds/ap-calcbc-u7-separation-of-variables';
import { BASELINE_AP_CALCBC_SLOPE_FIELDS } from './seeds/ap-calcbc-u7-slope-fields';
import { BASELINE_AP_CALCBC_APPLICATIONS } from './seeds/ap-calcbc-u8-applications';
import { BASELINE_AP_CALCBC_ARC_LENGTH } from './seeds/ap-calcbc-u8-arc-length';
import { BASELINE_AP_CALCBC_AREA_BETWEEN_CURVES } from './seeds/ap-calcbc-u8-area-between-curves';
import { BASELINE_AP_CALCBC_VOLUMES_CROSS_SECTIONS } from './seeds/ap-calcbc-u8-volumes-cross-sections';
import { BASELINE_AP_CALCBC_VOLUMES_REVOLUTION } from './seeds/ap-calcbc-u8-volumes-revolution';
import { BASELINE_AP_CALCBC_WASHER_OTHER_AXES } from './seeds/ap-calcbc-u8-washer-other-axes';
import { BASELINE_AP_CALCBC_PARAMETRIC_ARC_LENGTH } from './seeds/ap-calcbc-u9-parametric-arc-length';
import { BASELINE_AP_CALCBC_PARAMETRIC } from './seeds/ap-calcbc-u9-parametric';
import { BASELINE_AP_CALCBC_POLAR_AREA } from './seeds/ap-calcbc-u9-polar-area';
import { BASELINE_AP_CALCBC_POLAR_COORDINATES } from './seeds/ap-calcbc-u9-polar-coordinates';
import { BASELINE_AP_CALCBC_VECTOR_VALUED } from './seeds/ap-calcbc-u9-vector-valued';
import { BASELINE_AP_CALCBC_ALTERNATING_SERIES } from './seeds/ap-calcbc-u10-alternating-series';
import { BASELINE_AP_CALCBC_CONVERGENCE_TESTS } from './seeds/ap-calcbc-u10-convergence-tests';
import { BASELINE_AP_CALCBC_MACLAURIN_SERIES } from './seeds/ap-calcbc-u10-maclaurin-series';
import { BASELINE_AP_CALCBC_POWER_SERIES } from './seeds/ap-calcbc-u10-power-series';
import { BASELINE_AP_CALCBC_RATIO_TEST } from './seeds/ap-calcbc-u10-ratio-test';
import { BASELINE_AP_CALCBC_SERIES_CONVERGENCE } from './seeds/ap-calcbc-u10-series-convergence';
import { BASELINE_AP_CALCBC_TAYLOR_POLYNOMIAL } from './seeds/ap-calcbc-u10-taylor-polynomial';
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

// AP English Language & Composition Unit 1 (CED 1.1–1.5) — the foundational
// rhetorical-analysis sequence (calibration unit for the AP Eng Lang
// vertical slice). FRQ-practice plan deferred (pure practice → no theory).
import { BASELINE_AP_ENGLANG_RHETORICAL_SITUATION } from './seeds/ap-englang-u1-rhetorical-situation';
import { BASELINE_AP_ENGLANG_READING_FOR_CLAIM } from './seeds/ap-englang-u1-reading-for-claim';
import { BASELINE_AP_ENGLANG_DEFENSIBLE_THESIS } from './seeds/ap-englang-u1-defensible-thesis';
import { BASELINE_AP_ENGLANG_EVIDENCE_COMMENTARY } from './seeds/ap-englang-u1-evidence-commentary';
import { BASELINE_AP_ENGLANG_AUDIENCE_CONTEXT } from './seeds/ap-englang-u1-audience-context';
// AP English Language Units 2-9 (Phase 2 fan-out) — topic-notes baselines
import { BASELINE_AP_ENGLANG_BUILDING_AN_ARGUMENT } from './seeds/ap-englang-u2-building-an-argument';
import { BASELINE_AP_ENGLANG_COUNTERARGUMENT_REBUTTAL } from './seeds/ap-englang-u2-counterargument-rebuttal';
import { BASELINE_AP_ENGLANG_INTROS_CONCLUSIONS } from './seeds/ap-englang-u2-intros-conclusions';
import { BASELINE_AP_ENGLANG_LINE_OF_REASONING_ARGUMENT } from './seeds/ap-englang-u2-line-of-reasoning-argument';
import { BASELINE_AP_ENGLANG_SELECTING_EVIDENCE } from './seeds/ap-englang-u2-selecting-evidence';
import { BASELINE_AP_ENGLANG_CITING_ATTRIBUTING_SOURCES } from './seeds/ap-englang-u3-citing-attributing-sources';
import { BASELINE_AP_ENGLANG_INTEGRATING_EVIDENCE } from './seeds/ap-englang-u3-integrating-evidence';
import { BASELINE_AP_ENGLANG_POSITION_ACROSS_SOURCES } from './seeds/ap-englang-u3-position-across-sources';
import { BASELINE_AP_ENGLANG_SYNTHESIS_LINE_OF_REASONING } from './seeds/ap-englang-u3-synthesis-line-of-reasoning';
import { BASELINE_AP_ENGLANG_THE_SYNTHESIS_TASK } from './seeds/ap-englang-u3-the-synthesis-task';
import { BASELINE_AP_ENGLANG_ANALYZING_LINE_OF_REASONING } from './seeds/ap-englang-u4-analyzing-line-of-reasoning';
import { BASELINE_AP_ENGLANG_DICTION_AND_TONE } from './seeds/ap-englang-u4-diction-and-tone';
import { BASELINE_AP_ENGLANG_INTROS_CONCLUSIONS_ANALYSIS } from './seeds/ap-englang-u4-intros-conclusions-analysis';
import { BASELINE_AP_ENGLANG_METHODS_OF_DEVELOPMENT } from './seeds/ap-englang-u4-methods-of-development';
import { BASELINE_AP_ENGLANG_ORGANIZING_FOR_EFFECT } from './seeds/ap-englang-u5-organizing-for-effect';
import { BASELINE_AP_ENGLANG_REASONING_AND_PARAGRAPHING } from './seeds/ap-englang-u5-reasoning-and-paragraphing';
import { BASELINE_AP_ENGLANG_TRANSITIONS_COHESION } from './seeds/ap-englang-u5-transitions-cohesion';
import { BASELINE_AP_ENGLANG_UNITY_AND_COHERENCE } from './seeds/ap-englang-u5-unity-and-coherence';
import { BASELINE_AP_ENGLANG_ANALYZING_STYLE } from './seeds/ap-englang-u6-analyzing-style';
import { BASELINE_AP_ENGLANG_DICTION_CONNOTATION_TONE } from './seeds/ap-englang-u6-diction-connotation-tone';
import { BASELINE_AP_ENGLANG_FIGURATIVE_LANGUAGE_SCHEMES } from './seeds/ap-englang-u6-figurative-language-schemes';
import { BASELINE_AP_ENGLANG_SYNTAX_FOR_EFFECT } from './seeds/ap-englang-u6-syntax-for-effect';
import { BASELINE_AP_ENGLANG_COMPLEX_REASONING } from './seeds/ap-englang-u7-complex-reasoning';
import { BASELINE_AP_ENGLANG_NUANCE_QUALIFICATION_CONCESSION } from './seeds/ap-englang-u7-nuance-qualification-concession';
import { BASELINE_AP_ENGLANG_RHETORICAL_RISK } from './seeds/ap-englang-u7-rhetorical-risk';
import { BASELINE_AP_ENGLANG_SITUATING_IN_CONTEXT } from './seeds/ap-englang-u7-situating-in-context';
import { BASELINE_AP_ENGLANG_COMPETING_PERSPECTIVES } from './seeds/ap-englang-u8-competing-perspectives';
import { BASELINE_AP_ENGLANG_QUALIFYING_WITH_SOURCES } from './seeds/ap-englang-u8-qualifying-with-sources';
import { BASELINE_AP_ENGLANG_SOPHISTICATION_IN_SYNTHESIS } from './seeds/ap-englang-u8-sophistication-in-synthesis';
import { BASELINE_AP_ENGLANG_SOURCE_CREDIBILITY_BIAS } from './seeds/ap-englang-u8-source-credibility-bias';
import { BASELINE_AP_ENGLANG_MCQ_READING_STRATEGY } from './seeds/ap-englang-u9-mcq-reading-strategy';
import { BASELINE_AP_ENGLANG_MCQ_WRITING_EDITING } from './seeds/ap-englang-u9-mcq-writing-editing';
import { BASELINE_AP_ENGLANG_REVISION_AND_SOPHISTICATION } from './seeds/ap-englang-u9-revision-and-sophistication';
import { BASELINE_AP_ENGLANG_TIMED_WRITING_STRATEGY } from './seeds/ap-englang-u9-timed-writing-strategy';

// AP US History Unit 3 (CED 3.2, 3.3, 3.9, 3.10, 3.11) — Period-3 Vertical
// Slice content plans (causes of Revolution through the New Republic).
// DBQ/LEQ/SAQ essay-practice plans deferred (pure practice → no theory).
import { BASELINE_AP_APUSH_CAUSES_OF_REVOLUTION } from './seeds/ap-apush-u3-causes-of-revolution';
import { BASELINE_AP_APUSH_REVOLUTIONARY_IDEALS } from './seeds/ap-apush-u3-revolutionary-ideals';
import { BASELINE_AP_APUSH_ARTICLES_OF_CONFEDERATION } from './seeds/ap-apush-u3-articles-of-confederation';
import { BASELINE_AP_APUSH_CONSTITUTION_RATIFICATION } from './seeds/ap-apush-u3-constitution-ratification';
import { BASELINE_AP_APUSH_NEW_REPUBLIC } from './seeds/ap-apush-u3-new-republic';

export const SEED_BASELINES: TopicNotesBaseline[] = [
  BASELINE_AP_CALCBC_DEFINING_LIMITS,
  BASELINE_AP_CALCBC_INTRODUCING_CALCULUS,
  BASELINE_AP_CALCBC_LIMITS_GRAPHS_TABLES,
  BASELINE_AP_CALCBC_LIMITS_ALGEBRAIC_PROPERTIES,
  BASELINE_AP_CALCBC_LIMITS_ALGEBRAIC_MANIPULATION,
  BASELINE_AP_CALCBC_LIMITS_STRATEGY,
  BASELINE_AP_CALCBC_SQUEEZE_THEOREM,
  BASELINE_AP_CALCBC_LIMITS_REPRESENTATIONS,
  BASELINE_AP_CALCBC_DISCONTINUITY_TYPES,
  BASELINE_AP_CALCBC_CONTINUITY,
  BASELINE_AP_CALCBC_REMOVING_DISCONTINUITIES,
  BASELINE_AP_CALCBC_INFINITE_LIMITS_ASYMPTOTES,
  BASELINE_AP_CALCBC_LIMITS_AT_INFINITY,
  BASELINE_AP_CALCBC_IVT,
  BASELINE_AP_CALCBC_DERIVATIVE_DEFINITION,
  BASELINE_AP_CALCBC_ESTIMATING_DERIVATIVES,
  BASELINE_AP_CALCBC_DIFFERENTIABILITY_CONTINUITY,
  BASELINE_AP_CALCBC_POWER_RULE_LINEARITY,
  BASELINE_AP_CALCBC_TRANSCENDENTAL_DERIVATIVES,
  BASELINE_AP_CALCBC_PRODUCT_RULE,
  BASELINE_AP_CALCBC_QUOTIENT_RULE,
  BASELINE_AP_CALCBC_CHAIN_RULE,
  BASELINE_AP_CALCBC_IMPLICIT_DIFFERENTIATION,
  BASELINE_AP_CALCBC_DERIVATIVES_INVERSE,
  BASELINE_AP_CALCBC_HIGHER_ORDER_DERIVATIVES,
  BASELINE_AP_CALCBC_DERIVATIVE_IN_CONTEXT,
  BASELINE_AP_CALCBC_LHOPITAL,
  BASELINE_AP_CALCBC_LINEARIZATION,
  BASELINE_AP_CALCBC_STRAIGHT_LINE_MOTION,
  BASELINE_AP_CALCBC_RELATED_RATES,
  BASELINE_AP_CALCBC_CONCAVITY_SECOND_DERIVATIVE,
  BASELINE_AP_CALCBC_FIRST_DERIVATIVE_ANALYSIS,
  BASELINE_AP_CALCBC_GRAPHING_F_FP_FPP,
  BASELINE_AP_CALCBC_IMPLICIT_BEHAVIORS,
  BASELINE_AP_CALCBC_MVT_EVT,
  BASELINE_AP_CALCBC_OPTIMIZATION,
  BASELINE_AP_CALCBC_BASIC_ANTIDERIVATIVES,
  BASELINE_AP_CALCBC_FTC,
  BASELINE_AP_CALCBC_IMPROPER_INTEGRALS,
  BASELINE_AP_CALCBC_INTEGRAL_PROPERTIES,
  BASELINE_AP_CALCBC_INTEGRATION_BY_PARTS,
  BASELINE_AP_CALCBC_INTEGRATION_STRATEGY,
  BASELINE_AP_CALCBC_LONG_DIVISION_COMPLETING_SQUARE,
  BASELINE_AP_CALCBC_PARTIAL_FRACTIONS,
  BASELINE_AP_CALCBC_RIEMANN_SUMS,
  BASELINE_AP_CALCBC_U_SUBSTITUTION,
  BASELINE_AP_CALCBC_EULERS_METHOD,
  BASELINE_AP_CALCBC_EXPONENTIAL_MODELS,
  BASELINE_AP_CALCBC_LOGISTIC_MODELS,
  BASELINE_AP_CALCBC_MODELING_VERIFYING_DE,
  BASELINE_AP_CALCBC_SEPARATION_OF_VARIABLES,
  BASELINE_AP_CALCBC_SLOPE_FIELDS,
  BASELINE_AP_CALCBC_APPLICATIONS,
  BASELINE_AP_CALCBC_ARC_LENGTH,
  BASELINE_AP_CALCBC_AREA_BETWEEN_CURVES,
  BASELINE_AP_CALCBC_VOLUMES_CROSS_SECTIONS,
  BASELINE_AP_CALCBC_VOLUMES_REVOLUTION,
  BASELINE_AP_CALCBC_WASHER_OTHER_AXES,
  BASELINE_AP_CALCBC_PARAMETRIC_ARC_LENGTH,
  BASELINE_AP_CALCBC_PARAMETRIC,
  BASELINE_AP_CALCBC_POLAR_AREA,
  BASELINE_AP_CALCBC_POLAR_COORDINATES,
  BASELINE_AP_CALCBC_VECTOR_VALUED,
  BASELINE_AP_CALCBC_ALTERNATING_SERIES,
  BASELINE_AP_CALCBC_CONVERGENCE_TESTS,
  BASELINE_AP_CALCBC_MACLAURIN_SERIES,
  BASELINE_AP_CALCBC_POWER_SERIES,
  BASELINE_AP_CALCBC_RATIO_TEST,
  BASELINE_AP_CALCBC_SERIES_CONVERGENCE,
  BASELINE_AP_CALCBC_TAYLOR_POLYNOMIAL,
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
  BASELINE_AP_ENGLANG_RHETORICAL_SITUATION,
  BASELINE_AP_ENGLANG_READING_FOR_CLAIM,
  BASELINE_AP_ENGLANG_DEFENSIBLE_THESIS,
  BASELINE_AP_ENGLANG_EVIDENCE_COMMENTARY,
  BASELINE_AP_ENGLANG_AUDIENCE_CONTEXT,
  // AP English Language Units 2-9 baselines
  BASELINE_AP_ENGLANG_BUILDING_AN_ARGUMENT,
  BASELINE_AP_ENGLANG_COUNTERARGUMENT_REBUTTAL,
  BASELINE_AP_ENGLANG_INTROS_CONCLUSIONS,
  BASELINE_AP_ENGLANG_LINE_OF_REASONING_ARGUMENT,
  BASELINE_AP_ENGLANG_SELECTING_EVIDENCE,
  BASELINE_AP_ENGLANG_CITING_ATTRIBUTING_SOURCES,
  BASELINE_AP_ENGLANG_INTEGRATING_EVIDENCE,
  BASELINE_AP_ENGLANG_POSITION_ACROSS_SOURCES,
  BASELINE_AP_ENGLANG_SYNTHESIS_LINE_OF_REASONING,
  BASELINE_AP_ENGLANG_THE_SYNTHESIS_TASK,
  BASELINE_AP_ENGLANG_ANALYZING_LINE_OF_REASONING,
  BASELINE_AP_ENGLANG_DICTION_AND_TONE,
  BASELINE_AP_ENGLANG_INTROS_CONCLUSIONS_ANALYSIS,
  BASELINE_AP_ENGLANG_METHODS_OF_DEVELOPMENT,
  BASELINE_AP_ENGLANG_ORGANIZING_FOR_EFFECT,
  BASELINE_AP_ENGLANG_REASONING_AND_PARAGRAPHING,
  BASELINE_AP_ENGLANG_TRANSITIONS_COHESION,
  BASELINE_AP_ENGLANG_UNITY_AND_COHERENCE,
  BASELINE_AP_ENGLANG_ANALYZING_STYLE,
  BASELINE_AP_ENGLANG_DICTION_CONNOTATION_TONE,
  BASELINE_AP_ENGLANG_FIGURATIVE_LANGUAGE_SCHEMES,
  BASELINE_AP_ENGLANG_SYNTAX_FOR_EFFECT,
  BASELINE_AP_ENGLANG_COMPLEX_REASONING,
  BASELINE_AP_ENGLANG_NUANCE_QUALIFICATION_CONCESSION,
  BASELINE_AP_ENGLANG_RHETORICAL_RISK,
  BASELINE_AP_ENGLANG_SITUATING_IN_CONTEXT,
  BASELINE_AP_ENGLANG_COMPETING_PERSPECTIVES,
  BASELINE_AP_ENGLANG_QUALIFYING_WITH_SOURCES,
  BASELINE_AP_ENGLANG_SOPHISTICATION_IN_SYNTHESIS,
  BASELINE_AP_ENGLANG_SOURCE_CREDIBILITY_BIAS,
  BASELINE_AP_ENGLANG_MCQ_READING_STRATEGY,
  BASELINE_AP_ENGLANG_MCQ_WRITING_EDITING,
  BASELINE_AP_ENGLANG_REVISION_AND_SOPHISTICATION,
  BASELINE_AP_ENGLANG_TIMED_WRITING_STRATEGY,
  BASELINE_AP_APUSH_CAUSES_OF_REVOLUTION,
  BASELINE_AP_APUSH_REVOLUTIONARY_IDEALS,
  BASELINE_AP_APUSH_ARTICLES_OF_CONFEDERATION,
  BASELINE_AP_APUSH_CONSTITUTION_RATIFICATION,
  BASELINE_AP_APUSH_NEW_REPUBLIC,
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
