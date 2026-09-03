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
import { BASELINE_AP_APUSH_NATIVE_SOCIETIES } from './seeds/ap-apush-u1-native-societies';
import { BASELINE_AP_APUSH_COLUMBIAN_EXCHANGE } from './seeds/ap-apush-u1-columbian-exchange';
import { BASELINE_AP_APUSH_SPANISH_COLONIZATION } from './seeds/ap-apush-u1-spanish-colonization';
import { BASELINE_AP_APUSH_COLONIAL_REGIONS } from './seeds/ap-apush-u2-colonial-regions';
import { BASELINE_AP_APUSH_TRANSATLANTIC_ECONOMY } from './seeds/ap-apush-u2-transatlantic-economy';
import { BASELINE_AP_APUSH_SLAVERY_COLONIES } from './seeds/ap-apush-u2-slavery-colonies';
import { BASELINE_AP_APUSH_COLONIAL_SOCIETY } from './seeds/ap-apush-u2-colonial-society';
import { BASELINE_AP_APUSH_CAUSES_OF_REVOLUTION } from './seeds/ap-apush-u3-causes-of-revolution';
import { BASELINE_AP_APUSH_REVOLUTIONARY_IDEALS } from './seeds/ap-apush-u3-revolutionary-ideals';
import { BASELINE_AP_APUSH_ARTICLES_OF_CONFEDERATION } from './seeds/ap-apush-u3-articles-of-confederation';
import { BASELINE_AP_APUSH_CONSTITUTION_RATIFICATION } from './seeds/ap-apush-u3-constitution-ratification';
import { BASELINE_AP_APUSH_NEW_REPUBLIC } from './seeds/ap-apush-u3-new-republic';

// AP US History Unit 4 (CED 4.2-4.4, 4.5-4.7, 4.8-4.9, 4.10-4.11, 4.12-4.13)
// — Period-4 content plans (jefferson-era through slavery-south, 1800-1848).
import { BASELINE_AP_APUSH_JEFFERSON_ERA } from './seeds/ap-apush-u4-jefferson-era';
import { BASELINE_AP_APUSH_MARKET_REVOLUTION } from './seeds/ap-apush-u4-market-revolution';
import { BASELINE_AP_APUSH_JACKSONIAN_DEMOCRACY } from './seeds/ap-apush-u4-jacksonian-democracy';
import { BASELINE_AP_APUSH_REFORM_AWAKENING } from './seeds/ap-apush-u4-reform-awakening';
import { BASELINE_AP_APUSH_SLAVERY_SOUTH } from './seeds/ap-apush-u4-slavery-south';

// AP US History Unit 5 (CED 5.2-5.3, 5.4-5.6, 5.7-5.8, 5.9, 5.10-5.11) —
// Period-5 content plans (manifest destiny through Reconstruction, 1844-1877).
import { BASELINE_AP_APUSH_MANIFEST_DESTINY } from './seeds/ap-apush-u5-manifest-destiny';
import { BASELINE_AP_APUSH_SECTIONAL_CRISIS } from './seeds/ap-apush-u5-sectional-crisis';
import { BASELINE_AP_APUSH_SECESSION_CIVIL_WAR } from './seeds/ap-apush-u5-secession-civil-war';
import { BASELINE_AP_APUSH_EMANCIPATION } from './seeds/ap-apush-u5-emancipation';
import { BASELINE_AP_APUSH_RECONSTRUCTION } from './seeds/ap-apush-u5-reconstruction';
// AP US History Unit 6 (CED 6.2-6.3, 6.4-6.6, 6.7, 6.8-6.10, 6.11-6.13) —
// Period-6 fan-out content plans (the West/New South through Gilded Age
// politics and Populism, 1865-1898).
import { BASELINE_AP_APUSH_THE_WEST } from './seeds/ap-apush-u6-the-west';
import { BASELINE_AP_APUSH_INDUSTRIALIZATION } from './seeds/ap-apush-u6-industrialization';
import { BASELINE_AP_APUSH_LABOR } from './seeds/ap-apush-u6-labor';
import { BASELINE_AP_APUSH_IMMIGRATION_URBANIZATION } from './seeds/ap-apush-u6-immigration-urbanization';
import { BASELINE_AP_APUSH_GILDED_POLITICS_POPULISM } from './seeds/ap-apush-u6-gilded-politics-populism';

// AP US History Unit 7 (CED 7.2-7.3, 7.4-7.5, 7.6-7.8, 7.9-7.10, 7.11-7.12,
// 7.13-7.15) — Period-7 fan-out content plans (American imperialism through
// World War II, 1890-1945).
import { BASELINE_AP_APUSH_IMPERIALISM } from './seeds/ap-apush-u7-imperialism';
import { BASELINE_AP_APUSH_PROGRESSIVISM } from './seeds/ap-apush-u7-progressivism';
import { BASELINE_AP_APUSH_WWI } from './seeds/ap-apush-u7-wwi';
import { BASELINE_AP_APUSH_TWENTIES } from './seeds/ap-apush-u7-twenties';
import { BASELINE_AP_APUSH_DEPRESSION_NEW_DEAL } from './seeds/ap-apush-u7-depression-newdeal';
import { BASELINE_AP_APUSH_WWII } from './seeds/ap-apush-u7-wwii';
// AP US History Unit 8 (CED 8.2-8.3, 8.4-8.6, 8.7-8.8/8.11-8.13, 8.9-8.10,
// 8.14-8.15) — Period-8 fan-out content plans (1945-1980: Cold War origins
// through the crises of the 1970s).
import { BASELINE_AP_APUSH_COLD_WAR } from './seeds/ap-apush-u8-cold-war';
import { BASELINE_AP_APUSH_POSTWAR_SOCIETY } from './seeds/ap-apush-u8-postwar-society';
import { BASELINE_AP_APUSH_CIVIL_RIGHTS } from './seeds/ap-apush-u8-civil-rights';
import { BASELINE_AP_APUSH_SIXTIES_VIETNAM } from './seeds/ap-apush-u8-sixties-vietnam';
import { BASELINE_AP_APUSH_SEVENTIES } from './seeds/ap-apush-u8-seventies';

// AP US History Unit 9 (CED 9.2-9.3, 9.4-9.5, 9.6) — Period-9 fan-out
// content plans (1980-present: conservative resurgence through the
// present day).
import { BASELINE_AP_APUSH_CONSERVATIVE_RESURGENCE } from './seeds/ap-apush-u9-conservative-resurgence';
import { BASELINE_AP_APUSH_GLOBALIZATION } from './seeds/ap-apush-u9-globalization';
import { BASELINE_AP_APUSH_SINCE_2001 } from './seeds/ap-apush-u9-since-2001';

// AP World History Unit 1 (CED 1.1-1.2, 1.3, 1.4-1.5, 1.6) — Unit-1 fan-out
// content plans (East Asia through medieval Europe). FRQ-practice plans
// deferred (pure practice → no theory).
import { BASELINE_AP_APWORLD_EAST_ASIA_SONG } from './seeds/ap-apworld-u1-east-asia-song';
import { BASELINE_AP_APWORLD_DAR_AL_ISLAM } from './seeds/ap-apworld-u1-dar-al-islam';
import { BASELINE_AP_APWORLD_SOUTH_SOUTHEAST_ASIA } from './seeds/ap-apworld-u1-south-southeast-asia';
import { BASELINE_AP_APWORLD_AMERICAS_AFRICA_STATES } from './seeds/ap-apworld-u1-americas-africa';
import { BASELINE_AP_APWORLD_MEDIEVAL_EUROPE } from './seeds/ap-apworld-u1-medieval-europe';

// AP World History Unit 2 (CED 2.1-2.4, 2.6) — Unit-2 Vertical Slice content
// plans (Mongol Empire through cultural/technological/biological diffusion).
// DBQ/LEQ/SAQ essay-practice plans deferred (pure practice → no theory).
import { BASELINE_AP_APWORLD_SILK_ROADS } from './seeds/ap-apworld-u2-silk-roads';
import { BASELINE_AP_APWORLD_INDIAN_OCEAN_TRADE } from './seeds/ap-apworld-u2-indian-ocean-trade';
import { BASELINE_AP_APWORLD_TRANS_SAHARAN_TRADE } from './seeds/ap-apworld-u2-trans-saharan-trade';
import { BASELINE_AP_APWORLD_MONGOL_EMPIRE } from './seeds/ap-apworld-u2-mongol-empire';
import { BASELINE_AP_APWORLD_CULTURAL_DIFFUSION } from './seeds/ap-apworld-u2-cultural-diffusion';

// AP World History Unit 3 (CED 3.1, 3.2, 3.3-3.4) — Unit-3 fan-out content
// plans (Land-Based Empires: expansion, administration, belief systems).
// FRQ-practice plans deferred (pure practice → no theory).
import { BASELINE_AP_APWORLD_EMPIRES_EXPANSION } from './seeds/ap-apworld-u3-empires-expansion';
import { BASELINE_AP_APWORLD_EMPIRES_ADMINISTRATION } from './seeds/ap-apworld-u3-empires-administration';
import { BASELINE_AP_APWORLD_EMPIRES_BELIEF_SYSTEMS } from './seeds/ap-apworld-u3-empires-belief';
// AP World History Unit 4 (CED 4.1-4.2, 4.3, 4.4-4.5, 4.4/4.6, 4.7-4.8) —
// Unit-4 fan-out content plans (Transoceanic Interconnections, 1450-1750).
import { BASELINE_AP_APWORLD_MARITIME_EXPLORATION } from './seeds/ap-apworld-u4-maritime-exploration';
import { BASELINE_AP_APWORLD_COLUMBIAN_EXCHANGE } from './seeds/ap-apworld-u4-columbian-exchange';
import { BASELINE_AP_APWORLD_MARITIME_EMPIRES } from './seeds/ap-apworld-u4-maritime-empires';
import { BASELINE_AP_APWORLD_ATLANTIC_SLAVE_TRADE } from './seeds/ap-apworld-u4-atlantic-slave-trade';
import { BASELINE_AP_APWORLD_RESISTANCE } from './seeds/ap-apworld-u4-resistance';

// AP World History Unit 5 (CED 5.1, 5.2, 5.2, 5.3-5.6, 5.7-5.11) — Unit-5
// fan-out content plans (Revolutions, 1750-1900).
import { BASELINE_AP_APWORLD_ENLIGHTENMENT } from './seeds/ap-apworld-u5-enlightenment';
import { BASELINE_AP_APWORLD_ATLANTIC_REVOLUTIONS } from './seeds/ap-apworld-u5-atlantic-revolutions';
import { BASELINE_AP_APWORLD_NATIONALISM } from './seeds/ap-apworld-u5-nationalism';
import { BASELINE_AP_APWORLD_INDUSTRIAL_REVOLUTION } from './seeds/ap-apworld-u5-industrial-revolution';
import { BASELINE_AP_APWORLD_INDUSTRIAL_SOCIETY } from './seeds/ap-apworld-u5-industrial-society';
// AP World History Unit 6 (CED 6.1-6.7) — imperialism, resistance, economic
// imperialism, migration, reform, 1750-1900.
import { BASELINE_AP_APWORLD_U6_IMPERIAL_EXPANSION } from './seeds/ap-apworld-u6-imperial-expansion';
import { BASELINE_AP_APWORLD_U6_IMPERIAL_RESISTANCE } from './seeds/ap-apworld-u6-imperial-resistance';
import { BASELINE_AP_APWORLD_U6_ECONOMIC_IMPERIALISM } from './seeds/ap-apworld-u6-economic-imperialism';
import { BASELINE_AP_APWORLD_U6_GLOBAL_MIGRATION } from './seeds/ap-apworld-u6-global-migration';
import { BASELINE_AP_APWORLD_U6_REFORM_RESPONSES } from './seeds/ap-apworld-u6-reform-responses';

// AP World History Unit 7 (CED 7.1-7.9) — WWI, interwar crisis, WWII,
// conflict legacies, 1900-present.
import { BASELINE_AP_APWORLD_U7_WWI } from './seeds/ap-apworld-u7-wwi';
import { BASELINE_AP_APWORLD_U7_INTERWAR } from './seeds/ap-apworld-u7-interwar';
import { BASELINE_AP_APWORLD_U7_WWII } from './seeds/ap-apworld-u7-wwii';
import { BASELINE_AP_APWORLD_U7_LEGACIES } from './seeds/ap-apworld-u7-legacies';
// AP World History Unit 8 (CED 8.1-8.4, 8.5-8.6, 8.7-8.8, 8.9-8.10) —
// Unit-8 fan-out content plans (Cold War through the end of the Cold War).
import { BASELINE_AP_APWORLD_U8_COLD_WAR } from './seeds/ap-apworld-u8-cold-war';
import { BASELINE_AP_APWORLD_U8_DECOLONIZATION } from './seeds/ap-apworld-u8-decolonization';
import { BASELINE_AP_APWORLD_U8_NEW_STATES } from './seeds/ap-apworld-u8-new-states';
import { BASELINE_AP_APWORLD_U8_END_COLD_WAR } from './seeds/ap-apworld-u8-end-cold-war';

// AP World History Unit 9 (CED 9.1-9.3, 9.4-9.5, 9.6-9.7, 9.8-9.9) —
// Unit-9 fan-out content plans (global economy through culture/rights/
// migration).
import { BASELINE_AP_APWORLD_U9_GLOBAL_ECONOMY } from './seeds/ap-apworld-u9-global-economy';
import { BASELINE_AP_APWORLD_U9_TECHNOLOGY } from './seeds/ap-apworld-u9-technology';
import { BASELINE_AP_APWORLD_U9_ENVIRONMENT_DISEASE } from './seeds/ap-apworld-u9-environment-disease';
import { BASELINE_AP_APWORLD_U9_CULTURE_RIGHTS } from './seeds/ap-apworld-u9-culture-rights';

// AP US Government & Politics Unit 1 (CED 1.1-1.3, 1.4-1.5, 1.6, 1.7-1.9) —
// Unit-1 Vertical Slice content plans (democratic ideals through
// federalism). FRQ-practice plans deferred (pure practice → no theory).
import { BASELINE_AP_APGOV_DEMOCRATIC_IDEALS } from './seeds/ap-apgov-u1-democratic-ideals';
import { BASELINE_AP_APGOV_CONSTITUTION_RATIFICATION } from './seeds/ap-apgov-u1-constitution-ratification';
import { BASELINE_AP_APGOV_SEPARATION_OF_POWERS } from './seeds/ap-apgov-u1-separation-of-powers';
import { BASELINE_AP_APGOV_FEDERALISM } from './seeds/ap-apgov-u1-federalism';

// AP US Government & Politics Unit 2 (CED 2.1-2.3, 2.4-2.7, 2.8-2.11,
// 2.12-2.14, 2.15) — Unit-2 Vertical Slice content plans (institutional
// walk across Congress, the Presidency, the Judiciary, the Bureaucracy,
// and cross-branch policy-making in practice).
import { BASELINE_AP_APGOV_CONGRESS_STRUCTURE } from './seeds/ap-apgov-u2-congress';
import { BASELINE_AP_APGOV_PRESIDENCY_POWER } from './seeds/ap-apgov-u2-presidency';
import { BASELINE_AP_APGOV_JUDICIARY_INDEPENDENCE } from './seeds/ap-apgov-u2-judiciary';
import { BASELINE_AP_APGOV_BUREAUCRACY_ACCOUNTABILITY } from './seeds/ap-apgov-u2-bureaucracy';
import { BASELINE_AP_APGOV_CHECKS_IN_PRACTICE } from './seeds/ap-apgov-u2-checks-in-practice';

// AP US Government & Politics Unit 3 (CED 3.1-3.4, 3.5-3.6, 3.7-3.9,
// 3.10-3.13) — Unit-3 Vertical Slice content plans (civil liberties and
// civil rights walk: religion/speech, press/assembly/arms, due
// process/incorporation, and equal protection/civil rights).
import { BASELINE_AP_APGOV_RELIGION_SPEECH } from './seeds/ap-apgov-u3-religion-speech';
import { BASELINE_AP_APGOV_PRESS_ASSEMBLY_ARMS } from './seeds/ap-apgov-u3-press-assembly-arms';
import { BASELINE_AP_APGOV_DUE_PROCESS } from './seeds/ap-apgov-u3-due-process';
import { BASELINE_AP_APGOV_CIVIL_RIGHTS } from './seeds/ap-apgov-u3-civil-rights';

// AP US Government & Politics Unit 4 (CED 4.1-4.4, 4.5, 4.6-4.9) — Unit-4
// Vertical Slice content plans (public-opinion walk: socialization/opinion
// formation, measuring public opinion via polling, and ideology/policy).
import { BASELINE_AP_APGOV_SOCIALIZATION_OPINION } from './seeds/ap-apgov-u4-socialization';
import { BASELINE_AP_APGOV_PUBLIC_OPINION_MEASUREMENT } from './seeds/ap-apgov-u4-polling';
import { BASELINE_AP_APGOV_IDEOLOGY_POLICY } from './seeds/ap-apgov-u4-ideology-policy';

// AP US Government & Politics Unit 5 (CED 5.1-5.2, 5.3-5.5, 5.6-5.7,
// 5.8-5.11, 5.12-5.13) — Unit-5 Vertical Slice content plans (the
// linkage-institutions walk: voting rights/behavior, political parties,
// interest groups, elections/campaign finance, and the media).
import { BASELINE_AP_APGOV_VOTING_RIGHTS_BEHAVIOR } from './seeds/ap-apgov-u5-voting';
import { BASELINE_AP_APGOV_POLITICAL_PARTIES } from './seeds/ap-apgov-u5-parties';
import { BASELINE_AP_APGOV_INTEREST_GROUPS } from './seeds/ap-apgov-u5-interest-groups';
import { BASELINE_AP_APGOV_ELECTIONS_CAMPAIGN_FINANCE } from './seeds/ap-apgov-u5-elections';
import { BASELINE_AP_APGOV_MEDIA_LINKAGE } from './seeds/ap-apgov-u5-media';

// ---------------------------------------------------------------------------
// AP parity build 2026-07-10 — Macro (U1-U3,U5,U6), Env Sci (U1-U9), Psych
// (U0-U5) topic-notes baselines. Brings the 3 courses to notes parity with
// AP Stats + Calc BC. Authored per-plan from the lesson-plan seeds.
// ---------------------------------------------------------------------------
import { BASELINE_AP_ENVSCI_CARBON_WATER_CYCLES } from './seeds/ap-envsci-u1-carbon-water-cycles';
import { BASELINE_AP_ENVSCI_ECOSYSTEMS_BIOMES } from './seeds/ap-envsci-u1-ecosystems-biomes';
import { BASELINE_AP_ENVSCI_FOOD_WEBS } from './seeds/ap-envsci-u1-food-webs';
import { BASELINE_AP_ENVSCI_NITROGEN_PHOSPHORUS_CYCLES } from './seeds/ap-envsci-u1-nitrogen-phosphorus-cycles';
import { BASELINE_AP_ENVSCI_PRODUCTIVITY_ENERGY_FLOW } from './seeds/ap-envsci-u1-productivity-energy-flow';
import { BASELINE_AP_ENVSCI_BIODIVERSITY_ISLAND_BIOGEO } from './seeds/ap-envsci-u2-biodiversity-island-biogeo';
import { BASELINE_AP_ENVSCI_DISRUPTIONS_SUCCESSION } from './seeds/ap-envsci-u2-disruptions-succession';
import { BASELINE_AP_ENVSCI_TOLERANCE_ADAPTATIONS } from './seeds/ap-envsci-u2-tolerance-adaptations';
import { BASELINE_AP_ENVSCI_AGE_STRUCTURE_FERTILITY } from './seeds/ap-envsci-u3-age-structure-fertility';
import { BASELINE_AP_ENVSCI_CARRYING_CAPACITY_GROWTH } from './seeds/ap-envsci-u3-carrying-capacity-growth';
import { BASELINE_AP_ENVSCI_DEMOGRAPHIC_TRANSITION } from './seeds/ap-envsci-u3-demographic-transition';
import { BASELINE_AP_ENVSCI_SURVIVORSHIP_R_K } from './seeds/ap-envsci-u3-survivorship-r-k';
import { BASELINE_AP_ENVSCI_ATMOSPHERE_WIND } from './seeds/ap-envsci-u4-atmosphere-wind';
import { BASELINE_AP_ENVSCI_CLIMATE_ENSO } from './seeds/ap-envsci-u4-climate-enso';
import { BASELINE_AP_ENVSCI_PLATE_TECTONICS_SOIL } from './seeds/ap-envsci-u4-plate-tectonics-soil';
import { BASELINE_AP_ENVSCI_WATERSHEDS_SOLAR } from './seeds/ap-envsci-u4-watersheds-solar';
import { BASELINE_AP_ENVSCI_AGRICULTURE } from './seeds/ap-envsci-u5-agriculture';
import { BASELINE_AP_ENVSCI_COMMONS_FISHING_FOOTPRINT } from './seeds/ap-envsci-u5-commons-fishing-footprint';
import { BASELINE_AP_ENVSCI_FORESTRY_MINING } from './seeds/ap-envsci-u5-forestry-mining';
import { BASELINE_AP_ENVSCI_URBANIZATION_WATER } from './seeds/ap-envsci-u5-urbanization-water';
import { BASELINE_AP_ENVSCI_ENERGY_CONSERVATION } from './seeds/ap-envsci-u6-energy-conservation';
import { BASELINE_AP_ENVSCI_ENERGY_OVERVIEW_FOSSIL } from './seeds/ap-envsci-u6-energy-overview-fossil';
import { BASELINE_AP_ENVSCI_NUCLEAR_BIOMASS } from './seeds/ap-envsci-u6-nuclear-biomass';
import { BASELINE_AP_ENVSCI_RENEWABLES } from './seeds/ap-envsci-u6-renewables';
import { BASELINE_AP_ENVSCI_ACID_RAIN } from './seeds/ap-envsci-u7-acid-rain';
import { BASELINE_AP_ENVSCI_AIR_POLLUTION_SOURCES } from './seeds/ap-envsci-u7-air-pollution-sources';
import { BASELINE_AP_ENVSCI_AIR_QUALITY_MITIGATION } from './seeds/ap-envsci-u7-air-quality-mitigation';
import { BASELINE_AP_ENVSCI_SMOG_INVERSION } from './seeds/ap-envsci-u7-smog-inversion';
import { BASELINE_AP_ENVSCI_EUTROPHICATION_THERMAL } from './seeds/ap-envsci-u8-eutrophication-thermal';
import { BASELINE_AP_ENVSCI_SOLID_WASTE } from './seeds/ap-envsci-u8-solid-waste';
import { BASELINE_AP_ENVSCI_TOXICS_POPS_BIOMAG } from './seeds/ap-envsci-u8-toxics-pops-biomag';
import { BASELINE_AP_ENVSCI_WATER_POLLUTION_SOURCES } from './seeds/ap-envsci-u8-water-pollution-sources';
import { BASELINE_AP_ENVSCI_BIODIVERSITY_THREATS } from './seeds/ap-envsci-u9-biodiversity-threats';
import { BASELINE_AP_ENVSCI_GREENHOUSE_CLIMATE } from './seeds/ap-envsci-u9-greenhouse-climate';
import { BASELINE_AP_ENVSCI_OCEAN_CHANGES } from './seeds/ap-envsci-u9-ocean-changes';
import { BASELINE_AP_ENVSCI_OZONE } from './seeds/ap-envsci-u9-ozone';
import { BASELINE_AP_MACRO_COMPARATIVE_ADVANTAGE } from './seeds/ap-macro-u1-comparative-advantage';
import { BASELINE_AP_MACRO_COST_BENEFIT } from './seeds/ap-macro-u1-cost-benefit';
import { BASELINE_AP_MACRO_MARGINAL_ANALYSIS_CONSUMER } from './seeds/ap-macro-u1-marginal-analysis-consumer';
import { BASELINE_AP_MACRO_PPC } from './seeds/ap-macro-u1-ppc';
import { BASELINE_AP_MACRO_RESOURCE_ALLOCATION } from './seeds/ap-macro-u1-resource-allocation';
import { BASELINE_AP_MACRO_SCARCITY } from './seeds/ap-macro-u1-scarcity';
import { BASELINE_AP_MACRO_BUSINESS_CYCLE } from './seeds/ap-macro-u2-business-cycle';
import { BASELINE_AP_MACRO_CIRCULAR_FLOW_GDP } from './seeds/ap-macro-u2-circular-flow-gdp';
import { BASELINE_AP_MACRO_COSTS_OF_INFLATION } from './seeds/ap-macro-u2-costs-of-inflation';
import { BASELINE_AP_MACRO_GDP_LIMITATIONS } from './seeds/ap-macro-u2-gdp-limitations';
import { BASELINE_AP_MACRO_PRICE_INDICES_INFLATION } from './seeds/ap-macro-u2-price-indices-inflation';
import { BASELINE_AP_MACRO_REAL_VS_NOMINAL_GDP } from './seeds/ap-macro-u2-real-vs-nominal-gdp';
import { BASELINE_AP_MACRO_UNEMPLOYMENT } from './seeds/ap-macro-u2-unemployment';
import { BASELINE_AP_MACRO_AGGREGATE_DEMAND } from './seeds/ap-macro-u3-aggregate-demand';
import { BASELINE_AP_MACRO_AUTOMATIC_STABILIZERS } from './seeds/ap-macro-u3-automatic-stabilizers';
import { BASELINE_AP_MACRO_CHANGES_AD_AS_SHORT_RUN } from './seeds/ap-macro-u3-changes-ad-as-short-run';
import { BASELINE_AP_MACRO_EQUILIBRIUM_AD_AS } from './seeds/ap-macro-u3-equilibrium-ad-as';
import { BASELINE_AP_MACRO_FISCAL_POLICY } from './seeds/ap-macro-u3-fiscal-policy';
import { BASELINE_AP_MACRO_LONG_RUN_AGGREGATE_SUPPLY } from './seeds/ap-macro-u3-long-run-aggregate-supply';
import { BASELINE_AP_MACRO_LONG_RUN_SELF_ADJUSTMENT } from './seeds/ap-macro-u3-long-run-self-adjustment';
import { BASELINE_AP_MACRO_MULTIPLIERS } from './seeds/ap-macro-u3-multipliers';
import { BASELINE_AP_MACRO_SHORT_RUN_AGGREGATE_SUPPLY } from './seeds/ap-macro-u3-short-run-aggregate-supply';
import { BASELINE_AP_MACRO_CROWDING_OUT_LONG_RUN } from './seeds/ap-macro-u5-crowding-out-long-run';
import { BASELINE_AP_MACRO_DEFICITS_DEBT } from './seeds/ap-macro-u5-deficits-debt';
import { BASELINE_AP_MACRO_ECONOMIC_GROWTH } from './seeds/ap-macro-u5-economic-growth';
import { BASELINE_AP_MACRO_FISCAL_MONETARY_SHORT_RUN } from './seeds/ap-macro-u5-fiscal-monetary-short-run';
import { BASELINE_AP_MACRO_MONEY_GROWTH_INFLATION } from './seeds/ap-macro-u5-money-growth-inflation';
import { BASELINE_AP_MACRO_PHILLIPS_CURVE } from './seeds/ap-macro-u5-phillips-curve';
import { BASELINE_AP_MACRO_PUBLIC_POLICY_GROWTH } from './seeds/ap-macro-u5-public-policy-growth';
import { BASELINE_AP_MACRO_BALANCE_OF_PAYMENTS } from './seeds/ap-macro-u6-balance-of-payments';
import { BASELINE_AP_MACRO_EXCHANGE_RATES } from './seeds/ap-macro-u6-exchange-rates';
import { BASELINE_AP_MACRO_FX_DETERMINANTS } from './seeds/ap-macro-u6-fx-determinants';
import { BASELINE_AP_MACRO_FX_EFFECTS_ON_ECONOMY } from './seeds/ap-macro-u6-fx-effects-on-economy';
import { BASELINE_AP_MACRO_FX_MARKET } from './seeds/ap-macro-u6-fx-market';
import { BASELINE_AP_MACRO_TRADE_CAPITAL_FLOWS } from './seeds/ap-macro-u6-trade-capital-flows';
import { BASELINE_AP_PSYCH_RESEARCH_METHODS } from './seeds/ap-psych-u0-research-methods';
import { BASELINE_AP_PSYCH_BRAIN_STRUCTURES } from './seeds/ap-psych-u1-brain-structures';
import { BASELINE_AP_PSYCH_CONSCIOUSNESS_SLEEP } from './seeds/ap-psych-u1-consciousness-sleep';
import { BASELINE_AP_PSYCH_NERVOUS_ENDOCRINE } from './seeds/ap-psych-u1-nervous-endocrine';
import { BASELINE_AP_PSYCH_NEURONS_NEUROTRANSMITTERS } from './seeds/ap-psych-u1-neurons-neurotransmitters';
import { BASELINE_AP_PSYCH_SENSATION_PERCEPTION } from './seeds/ap-psych-u1-sensation-perception';
import { BASELINE_AP_PSYCH_INTELLIGENCE } from './seeds/ap-psych-u2-intelligence';
import { BASELINE_AP_PSYCH_MEMORY_FORGETTING } from './seeds/ap-psych-u2-memory-forgetting';
import { BASELINE_AP_PSYCH_MEMORY_MODELS } from './seeds/ap-psych-u2-memory-models';
import { BASELINE_AP_PSYCH_MEMORY_STORAGE_RETRIEVAL } from './seeds/ap-psych-u2-memory-storage-retrieval';
import { BASELINE_AP_PSYCH_THINKING_LANGUAGE } from './seeds/ap-psych-u2-thinking-language';
import { BASELINE_AP_PSYCH_CLASSICAL_CONDITIONING } from './seeds/ap-psych-u3-classical-conditioning';
import { BASELINE_AP_PSYCH_COGNITIVE_DEVELOPMENT } from './seeds/ap-psych-u3-cognitive-development';
import { BASELINE_AP_PSYCH_DEVELOPMENTAL_THEMES_METHODS } from './seeds/ap-psych-u3-developmental-themes-methods';
import { BASELINE_AP_PSYCH_GENDER_SEXUAL_ORIENTATION } from './seeds/ap-psych-u3-gender-sexual-orientation';
import { BASELINE_AP_PSYCH_OBSERVATIONAL_LEARNING } from './seeds/ap-psych-u3-observational-learning';
import { BASELINE_AP_PSYCH_OPERANT_CONDITIONING } from './seeds/ap-psych-u3-operant-conditioning';
import { BASELINE_AP_PSYCH_SOCIAL_EMOTIONAL_MORAL } from './seeds/ap-psych-u3-social-emotional-moral';
import { BASELINE_AP_PSYCH_ATTRIBUTION_ATTITUDES } from './seeds/ap-psych-u4-attribution-attitudes';
import { BASELINE_AP_PSYCH_EMOTION } from './seeds/ap-psych-u4-emotion';
import { BASELINE_AP_PSYCH_MOTIVATION } from './seeds/ap-psych-u4-motivation';
import { BASELINE_AP_PSYCH_PERSONALITY_ASSESSMENT } from './seeds/ap-psych-u4-personality-assessment';
import { BASELINE_AP_PSYCH_PERSONALITY_THEORIES } from './seeds/ap-psych-u4-personality-theories';
import { BASELINE_AP_PSYCH_PREJUDICE_STEREOTYPES } from './seeds/ap-psych-u4-prejudice-stereotypes';
import { BASELINE_AP_PSYCH_SOCIAL_INFLUENCE } from './seeds/ap-psych-u4-social-influence';
import { BASELINE_AP_PSYCH_ANXIETY_DISORDERS } from './seeds/ap-psych-u5-anxiety-disorders';
import { BASELINE_AP_PSYCH_CLASSIFYING_DISORDERS } from './seeds/ap-psych-u5-classifying-disorders';
import { BASELINE_AP_PSYCH_MOOD_DISORDERS } from './seeds/ap-psych-u5-mood-disorders';
import { BASELINE_AP_PSYCH_POSITIVE_PSYCHOLOGY } from './seeds/ap-psych-u5-positive-psychology';
import { BASELINE_AP_PSYCH_SCHIZO_PERSONALITY } from './seeds/ap-psych-u5-schizo-personality';
import { BASELINE_AP_PSYCH_STRESS_HEALTH } from './seeds/ap-psych-u5-stress-health';
import { BASELINE_AP_PSYCH_THERAPY } from './seeds/ap-psych-u5-therapy';

// ── HS core: Chemistry (2026-07 wave 1) ──
import { BASELINE_CHEM_U1_CLASSIFYING_MATTER } from './seeds/chem-u1-classifying-matter';
import { BASELINE_CHEM_U1_DENSITY_DIMENSIONAL_ANALYSIS } from './seeds/chem-u1-density-dimensional-analysis';
import { BASELINE_CHEM_U1_MEASUREMENT_SIG_FIGS } from './seeds/chem-u1-measurement-sig-figs';
import { BASELINE_CHEM_U1_PHYSICAL_CHEMICAL_CHANGES } from './seeds/chem-u1-physical-chemical-changes';
import { BASELINE_CHEM_U2_ATOMIC_THEORY } from './seeds/chem-u2-atomic-theory';
import { BASELINE_CHEM_U2_AVERAGE_ATOMIC_MASS } from './seeds/chem-u2-average-atomic-mass';
import { BASELINE_CHEM_U2_ELECTRON_CONFIGURATIONS } from './seeds/chem-u2-electron-configurations';
import { BASELINE_CHEM_U2_SUBATOMIC_PARTICLES_ISOTOPES } from './seeds/chem-u2-subatomic-particles-isotopes';
import { BASELINE_CHEM_U3_ION_FORMATION } from './seeds/chem-u3-ion-formation';
import { BASELINE_CHEM_U3_PERIODIC_TABLE_ORGANIZATION } from './seeds/chem-u3-periodic-table-organization';
import { BASELINE_CHEM_U3_PERIODIC_TRENDS } from './seeds/chem-u3-periodic-trends';
import { BASELINE_CHEM_U4_COVALENT_BONDING_LEWIS } from './seeds/chem-u4-covalent-bonding-lewis';
import { BASELINE_CHEM_U4_IONIC_BONDING } from './seeds/chem-u4-ionic-bonding';
import { BASELINE_CHEM_U4_MOLECULAR_SHAPE_VSEPR } from './seeds/chem-u4-molecular-shape-vsepr';
import { BASELINE_CHEM_U4_NAMING_COMPOUNDS_FORMULAS } from './seeds/chem-u4-naming-compounds-formulas';
import { BASELINE_CHEM_U4_POLARITY_INTERMOLECULAR_FORCES } from './seeds/chem-u4-polarity-intermolecular-forces';
import { BASELINE_CHEM_U5_BALANCING_EQUATIONS } from './seeds/chem-u5-balancing-equations';
import { BASELINE_CHEM_U5_PREDICTING_PRODUCTS_ACTIVITY } from './seeds/chem-u5-predicting-products-activity';
import { BASELINE_CHEM_U5_REACTION_TYPES } from './seeds/chem-u5-reaction-types';
import { BASELINE_CHEM_U5_REDOX_INTRO } from './seeds/chem-u5-redox-intro';
import { BASELINE_CHEM_U6_LIMITING_REACTANT_YIELD } from './seeds/chem-u6-limiting-reactant-yield';
import { BASELINE_CHEM_U6_MASS_MASS_STOICHIOMETRY } from './seeds/chem-u6-mass-mass-stoichiometry';
import { BASELINE_CHEM_U6_MOLE_CONVERSIONS } from './seeds/chem-u6-mole-conversions';
import { BASELINE_CHEM_U6_PERCENT_COMPOSITION_EMPIRICAL } from './seeds/chem-u6-percent-composition-empirical';
import { BASELINE_CHEM_U6_THE_MOLE_MOLAR_MASS } from './seeds/chem-u6-the-mole-molar-mass';
import { BASELINE_CHEM_U7_GAS_LAWS } from './seeds/chem-u7-gas-laws';
import { BASELINE_CHEM_U7_IDEAL_GAS_LAW } from './seeds/chem-u7-ideal-gas-law';
import { BASELINE_CHEM_U7_KINETIC_MOLECULAR_THEORY } from './seeds/chem-u7-kinetic-molecular-theory';
import { BASELINE_CHEM_U7_PHASE_CHANGES_HEATING_CURVES } from './seeds/chem-u7-phase-changes-heating-curves';
import { BASELINE_CHEM_U8_DILUTIONS_COLLIGATIVE } from './seeds/chem-u8-dilutions-colligative';
import { BASELINE_CHEM_U8_MOLARITY } from './seeds/chem-u8-molarity';
import { BASELINE_CHEM_U8_SOLUTIONS_SOLUBILITY } from './seeds/chem-u8-solutions-solubility';
import { BASELINE_CHEM_U9_ENDOTHERMIC_EXOTHERMIC } from './seeds/chem-u9-endothermic-exothermic';
import { BASELINE_CHEM_U9_EQUILIBRIUM_LE_CHATELIER } from './seeds/chem-u9-equilibrium-le-chatelier';
import { BASELINE_CHEM_U9_REACTION_RATES_COLLISION } from './seeds/chem-u9-reaction-rates-collision';
import { BASELINE_CHEM_U9_SPECIFIC_HEAT_CALORIMETRY } from './seeds/chem-u9-specific-heat-calorimetry';
import { BASELINE_CHEM_U10_ACIDS_BASES_DEFINITIONS } from './seeds/chem-u10-acids-bases-definitions';
import { BASELINE_CHEM_U10_NEUTRALIZATION_TITRATION } from './seeds/chem-u10-neutralization-titration';
import { BASELINE_CHEM_U10_NUCLEAR_CHEMISTRY_INTRO } from './seeds/chem-u10-nuclear-chemistry-intro';
import { BASELINE_CHEM_U10_PH_SCALE } from './seeds/chem-u10-ph-scale';

// HS core: Algebra 1 (2026-08 backfill) — 40 baselines, units 1-10.
import { BASELINE_ALG1_U1_REAL_NUMBERS_OPERATIONS } from './seeds/alg1-u1-real-numbers-operations';
import { BASELINE_ALG1_U1_ORDER_OF_OPERATIONS } from './seeds/alg1-u1-order-of-operations';
import { BASELINE_ALG1_U1_SIMPLIFYING_EXPRESSIONS } from './seeds/alg1-u1-simplifying-expressions';
import { BASELINE_ALG1_U1_TRANSLATING_WORDS_TO_ALGEBRA } from './seeds/alg1-u1-translating-words-to-algebra';
import { BASELINE_ALG1_U2_ONE_TWO_STEP_EQUATIONS } from './seeds/alg1-u2-one-two-step-equations';
import { BASELINE_ALG1_U2_MULTI_STEP_EQUATIONS } from './seeds/alg1-u2-multi-step-equations';
import { BASELINE_ALG1_U2_LITERAL_EQUATIONS } from './seeds/alg1-u2-literal-equations';
import { BASELINE_ALG1_U2_PROPORTIONS_PERCENTS } from './seeds/alg1-u2-proportions-percents';
import { BASELINE_ALG1_U3_ONE_VARIABLE_INEQUALITIES } from './seeds/alg1-u3-one-variable-inequalities';
import { BASELINE_ALG1_U3_COMPOUND_INEQUALITIES } from './seeds/alg1-u3-compound-inequalities';
import { BASELINE_ALG1_U3_ABSOLUTE_VALUE } from './seeds/alg1-u3-absolute-value';
import { BASELINE_ALG1_U4_RELATIONS_FUNCTIONS } from './seeds/alg1-u4-relations-functions';
import { BASELINE_ALG1_U4_SLOPE_RATE_OF_CHANGE } from './seeds/alg1-u4-slope-rate-of-change';
import { BASELINE_ALG1_U4_SLOPE_INTERCEPT_FORM } from './seeds/alg1-u4-slope-intercept-form';
import { BASELINE_ALG1_U4_POINT_SLOPE_STANDARD_FORM } from './seeds/alg1-u4-point-slope-standard-form';
import { BASELINE_ALG1_U4_PARALLEL_PERPENDICULAR } from './seeds/alg1-u4-parallel-perpendicular';
import { BASELINE_ALG1_U5_SYSTEMS_BY_GRAPHING } from './seeds/alg1-u5-systems-by-graphing';
import { BASELINE_ALG1_U5_SYSTEMS_SUBSTITUTION } from './seeds/alg1-u5-systems-substitution';
import { BASELINE_ALG1_U5_SYSTEMS_ELIMINATION } from './seeds/alg1-u5-systems-elimination';
import { BASELINE_ALG1_U5_SYSTEMS_APPLICATIONS } from './seeds/alg1-u5-systems-applications';
import { BASELINE_ALG1_U6_EXPONENT_RULES } from './seeds/alg1-u6-exponent-rules';
import { BASELINE_ALG1_U6_NEGATIVE_EXPONENTS_SCIENTIFIC_NOTATION } from './seeds/alg1-u6-negative-exponents-scientific-notation';
import { BASELINE_ALG1_U6_EXPONENTIAL_FUNCTIONS } from './seeds/alg1-u6-exponential-functions';
import { BASELINE_ALG1_U6_EXPONENTIAL_GROWTH_DECAY } from './seeds/alg1-u6-exponential-growth-decay';
import { BASELINE_ALG1_U7_POLYNOMIAL_OPERATIONS } from './seeds/alg1-u7-polynomial-operations';
import { BASELINE_ALG1_U7_SPECIAL_PRODUCTS } from './seeds/alg1-u7-special-products';
import { BASELINE_ALG1_U7_FACTORING_GCF_GROUPING } from './seeds/alg1-u7-factoring-gcf-grouping';
import { BASELINE_ALG1_U7_FACTORING_TRINOMIALS } from './seeds/alg1-u7-factoring-trinomials';
import { BASELINE_ALG1_U7_FACTORING_SPECIAL_FORMS } from './seeds/alg1-u7-factoring-special-forms';
import { BASELINE_ALG1_U8_QUADRATIC_GRAPHS_VERTEX } from './seeds/alg1-u8-quadratic-graphs-vertex';
import { BASELINE_ALG1_U8_SOLVING_BY_FACTORING_SQUARE_ROOTS } from './seeds/alg1-u8-solving-by-factoring-square-roots';
import { BASELINE_ALG1_U8_COMPLETING_THE_SQUARE } from './seeds/alg1-u8-completing-the-square';
import { BASELINE_ALG1_U8_QUADRATIC_FORMULA_DISCRIMINANT } from './seeds/alg1-u8-quadratic-formula-discriminant';
import { BASELINE_ALG1_U8_QUADRATIC_MODELS } from './seeds/alg1-u8-quadratic-models';
import { BASELINE_ALG1_U9_SIMPLIFYING_RADICALS } from './seeds/alg1-u9-simplifying-radicals';
import { BASELINE_ALG1_U9_RADICAL_EQUATIONS } from './seeds/alg1-u9-radical-equations';
import { BASELINE_ALG1_U9_RATIONAL_EXPRESSIONS } from './seeds/alg1-u9-rational-expressions';
import { BASELINE_ALG1_U10_ONE_VARIABLE_STATISTICS } from './seeds/alg1-u10-one-variable-statistics';
import { BASELINE_ALG1_U10_SCATTERPLOTS_TREND_LINES } from './seeds/alg1-u10-scatterplots-trend-lines';
import { BASELINE_ALG1_U10_SEQUENCES } from './seeds/alg1-u10-sequences';
import { BASELINE_GEOM_U1_POINTS_LINES_PLANES } from './seeds/geom-u1-points-lines-planes';
import { BASELINE_GEOM_U1_SEGMENTS_DISTANCE_MIDPOINT } from './seeds/geom-u1-segments-distance-midpoint';
import { BASELINE_GEOM_U1_ANGLES_AND_MEASURE } from './seeds/geom-u1-angles-and-measure';
import { BASELINE_GEOM_U1_ANGLE_PAIR_RELATIONSHIPS } from './seeds/geom-u1-angle-pair-relationships';
import { BASELINE_GEOM_U2_INDUCTIVE_DEDUCTIVE_REASONING } from './seeds/geom-u2-inductive-deductive-reasoning';
import { BASELINE_GEOM_U2_CONDITIONAL_STATEMENTS } from './seeds/geom-u2-conditional-statements';
import { BASELINE_GEOM_U2_TWO_COLUMN_PROOFS } from './seeds/geom-u2-two-column-proofs';
import { BASELINE_GEOM_U3_PARALLEL_LINES_TRANSVERSALS } from './seeds/geom-u3-parallel-lines-transversals';
import { BASELINE_GEOM_U3_PROVING_LINES_PARALLEL } from './seeds/geom-u3-proving-lines-parallel';
import { BASELINE_GEOM_U3_SLOPES_PARALLEL_PERPENDICULAR } from './seeds/geom-u3-slopes-parallel-perpendicular';
import { BASELINE_GEOM_U4_TRANSLATIONS } from './seeds/geom-u4-translations';
import { BASELINE_GEOM_U4_REFLECTIONS } from './seeds/geom-u4-reflections';
import { BASELINE_GEOM_U4_ROTATIONS } from './seeds/geom-u4-rotations';
import { BASELINE_GEOM_U4_COMPOSITIONS_SYMMETRY } from './seeds/geom-u4-compositions-symmetry';
import { BASELINE_GEOM_U4_CONGRUENCE_RIGID_MOTIONS } from './seeds/geom-u4-congruence-rigid-motions';
import { BASELINE_GEOM_U5_TRIANGLE_ANGLE_RELATIONSHIPS } from './seeds/geom-u5-triangle-angle-relationships';
import { BASELINE_GEOM_U5_TRIANGLE_CONGRUENCE_CRITERIA } from './seeds/geom-u5-triangle-congruence-criteria';
import { BASELINE_GEOM_U5_CPCTC_PROOFS } from './seeds/geom-u5-cpctc-proofs';
import { BASELINE_GEOM_U5_ISOSCELES_EQUILATERAL } from './seeds/geom-u5-isosceles-equilateral';
import { BASELINE_GEOM_U5_MIDSEGMENTS_BISECTORS_INEQUALITIES } from './seeds/geom-u5-midsegments-bisectors-inequalities';
import { BASELINE_GEOM_U6_DILATIONS_SCALE_FACTOR } from './seeds/geom-u6-dilations-scale-factor';
import { BASELINE_GEOM_U6_SIMILAR_POLYGONS } from './seeds/geom-u6-similar-polygons';
import { BASELINE_GEOM_U6_TRIANGLE_SIMILARITY_CRITERIA } from './seeds/geom-u6-triangle-similarity-criteria';
import { BASELINE_GEOM_U6_PROPORTIONALITY_THEOREMS } from './seeds/geom-u6-proportionality-theorems';
import { BASELINE_GEOM_U7_PYTHAGOREAN_THEOREM } from './seeds/geom-u7-pythagorean-theorem';
import { BASELINE_GEOM_U7_SPECIAL_RIGHT_TRIANGLES } from './seeds/geom-u7-special-right-triangles';
import { BASELINE_GEOM_U7_TRIG_RATIOS } from './seeds/geom-u7-trig-ratios';
import { BASELINE_GEOM_U7_SOLVING_RIGHT_TRIANGLES } from './seeds/geom-u7-solving-right-triangles';
import { BASELINE_GEOM_U8_POLYGON_ANGLE_SUMS } from './seeds/geom-u8-polygon-angle-sums';
import { BASELINE_GEOM_U8_PARALLELOGRAMS } from './seeds/geom-u8-parallelograms';
import { BASELINE_GEOM_U8_SPECIAL_PARALLELOGRAMS } from './seeds/geom-u8-special-parallelograms';
import { BASELINE_GEOM_U8_TRAPEZOIDS_KITES } from './seeds/geom-u8-trapezoids-kites';
import { BASELINE_GEOM_U9_CIRCLE_BASICS_ARCS } from './seeds/geom-u9-circle-basics-arcs';
import { BASELINE_GEOM_U9_CENTRAL_INSCRIBED_ANGLES } from './seeds/geom-u9-central-inscribed-angles';
import { BASELINE_GEOM_U9_TANGENTS_SECANTS_ANGLES } from './seeds/geom-u9-tangents-secants-angles';
import { BASELINE_GEOM_U9_CIRCLE_EQUATIONS } from './seeds/geom-u9-circle-equations';
import { BASELINE_GEOM_U10_AREA_POLYGONS } from './seeds/geom-u10-area-polygons';
import { BASELINE_GEOM_U10_CIRCUMFERENCE_ARC_LENGTH_SECTOR } from './seeds/geom-u10-circumference-arc-length-sector';
import { BASELINE_GEOM_U10_PRISMS_CYLINDERS } from './seeds/geom-u10-prisms-cylinders';
import { BASELINE_GEOM_U10_PYRAMIDS_CONES_SPHERES } from './seeds/geom-u10-pyramids-cones-spheres';
import { BASELINE_BIO_U1_CHARACTERISTICS_OF_LIFE } from './seeds/bio-u1-characteristics-of-life';
import { BASELINE_BIO_U1_SCIENTIFIC_METHOD_BIO } from './seeds/bio-u1-scientific-method-bio';
import { BASELINE_BIO_U1_WATER_AND_MACROMOLECULES } from './seeds/bio-u1-water-and-macromolecules';
import { BASELINE_BIO_U1_ENZYMES } from './seeds/bio-u1-enzymes';
import { BASELINE_BIO_U2_CELL_THEORY_TYPES } from './seeds/bio-u2-cell-theory-types';
import { BASELINE_BIO_U2_ORGANELLES } from './seeds/bio-u2-organelles';
import { BASELINE_BIO_U2_CELL_MEMBRANE_STRUCTURE } from './seeds/bio-u2-cell-membrane-structure';
import { BASELINE_BIO_U2_TRANSPORT_ACROSS_MEMBRANES } from './seeds/bio-u2-transport-across-membranes';
import { BASELINE_BIO_U3_ATP_AND_ENERGY } from './seeds/bio-u3-atp-and-energy';
import { BASELINE_BIO_U3_PHOTOSYNTHESIS } from './seeds/bio-u3-photosynthesis';
import { BASELINE_BIO_U3_CELLULAR_RESPIRATION } from './seeds/bio-u3-cellular-respiration';
import { BASELINE_BIO_U4_CELL_CYCLE_MITOSIS } from './seeds/bio-u4-cell-cycle-mitosis';
import { BASELINE_BIO_U4_CELL_CYCLE_REGULATION_CANCER } from './seeds/bio-u4-cell-cycle-regulation-cancer';
import { BASELINE_BIO_U4_MEIOSIS } from './seeds/bio-u4-meiosis';
import { BASELINE_BIO_U4_MITOSIS_MEIOSIS_VARIATION } from './seeds/bio-u4-mitosis-meiosis-variation';
import { BASELINE_BIO_U5_MENDEL_LAWS } from './seeds/bio-u5-mendel-laws';
import { BASELINE_BIO_U5_PUNNETT_SQUARES_MONOHYBRID } from './seeds/bio-u5-punnett-squares-monohybrid';
import { BASELINE_BIO_U5_DIHYBRID_CROSSES } from './seeds/bio-u5-dihybrid-crosses';
import { BASELINE_BIO_U5_NON_MENDELIAN_INHERITANCE } from './seeds/bio-u5-non-mendelian-inheritance';
import { BASELINE_BIO_U5_PEDIGREES_HUMAN_GENETICS } from './seeds/bio-u5-pedigrees-human-genetics';
import { BASELINE_BIO_U6_DNA_STRUCTURE_REPLICATION } from './seeds/bio-u6-dna-structure-replication';
import { BASELINE_BIO_U6_TRANSCRIPTION_TRANSLATION } from './seeds/bio-u6-transcription-translation';
import { BASELINE_BIO_U6_MUTATIONS } from './seeds/bio-u6-mutations';
import { BASELINE_BIO_U6_BIOTECHNOLOGY } from './seeds/bio-u6-biotechnology';
import { BASELINE_BIO_U7_EVIDENCE_FOR_EVOLUTION } from './seeds/bio-u7-evidence-for-evolution';
import { BASELINE_BIO_U7_NATURAL_SELECTION } from './seeds/bio-u7-natural-selection';
import { BASELINE_BIO_U7_POPULATION_GENETICS } from './seeds/bio-u7-population-genetics';
import { BASELINE_BIO_U7_SPECIATION } from './seeds/bio-u7-speciation';
import { BASELINE_BIO_U8_TAXONOMY_CLASSIFICATION } from './seeds/bio-u8-taxonomy-classification';
import { BASELINE_BIO_U8_PHYLOGENETICS_CLADOGRAMS } from './seeds/bio-u8-phylogenetics-cladograms';
import { BASELINE_BIO_U8_DOMAINS_KINGDOMS_DIVERSITY } from './seeds/bio-u8-domains-kingdoms-diversity';
import { BASELINE_BIO_U9_ECOSYSTEMS_BIOMES } from './seeds/bio-u9-ecosystems-biomes';
import { BASELINE_BIO_U9_ENERGY_FLOW_FOOD_WEBS } from './seeds/bio-u9-energy-flow-food-webs';
import { BASELINE_BIO_U9_BIOGEOCHEMICAL_CYCLES } from './seeds/bio-u9-biogeochemical-cycles';
import { BASELINE_BIO_U9_POPULATION_COMMUNITY_ECOLOGY } from './seeds/bio-u9-population-community-ecology';
import { BASELINE_BIO_U10_HOMEOSTASIS_FEEDBACK } from './seeds/bio-u10-homeostasis-feedback';
import { BASELINE_BIO_U10_CIRCULATORY_RESPIRATORY } from './seeds/bio-u10-circulatory-respiratory';
import { BASELINE_BIO_U10_DIGESTIVE_EXCRETORY } from './seeds/bio-u10-digestive-excretory';
import { BASELINE_BIO_U10_NERVOUS_ENDOCRINE } from './seeds/bio-u10-nervous-endocrine';
import { BASELINE_BIO_U10_IMMUNE_SYSTEM } from './seeds/bio-u10-immune-system';
import { BASELINE_ENGL_U1_PARTS_OF_SPEECH } from './seeds/engl-u1-parts-of-speech';
import { BASELINE_ENGL_U1_SUBJECT_VERB_AGREEMENT } from './seeds/engl-u1-subject-verb-agreement';
import { BASELINE_ENGL_U1_PRONOUN_AGREEMENT_CLARITY } from './seeds/engl-u1-pronoun-agreement-clarity';
import { BASELINE_ENGL_U1_VERB_TENSE_AND_FORM } from './seeds/engl-u1-verb-tense-and-form';
import { BASELINE_ENGL_U2_CLAUSES_AND_PHRASES } from './seeds/engl-u2-clauses-and-phrases';
import { BASELINE_ENGL_U2_SENTENCE_TYPES_COMBINING } from './seeds/engl-u2-sentence-types-combining';
import { BASELINE_ENGL_U2_FRAGMENTS_AND_RUN_ONS } from './seeds/engl-u2-fragments-and-run-ons';
import { BASELINE_ENGL_U2_MODIFIERS_AND_PARALLELISM } from './seeds/engl-u2-modifiers-and-parallelism';
import { BASELINE_ENGL_U3_COMMAS } from './seeds/engl-u3-commas';
import { BASELINE_ENGL_U3_SEMICOLONS_AND_COLONS } from './seeds/engl-u3-semicolons-and-colons';
import { BASELINE_ENGL_U3_APOSTROPHES_AND_POSSESSIVES } from './seeds/engl-u3-apostrophes-and-possessives';
import { BASELINE_ENGL_U3_DASHES_PARENTHESES_QUOTATION } from './seeds/engl-u3-dashes-parentheses-quotation';
import { BASELINE_ENGL_U4_PRECISION_AND_CONCISION } from './seeds/engl-u4-precision-and-concision';
import { BASELINE_ENGL_U4_CONNOTATION_AND_DENOTATION } from './seeds/engl-u4-connotation-and-denotation';
import { BASELINE_ENGL_U4_TONE_AND_REGISTER } from './seeds/engl-u4-tone-and-register';
import { BASELINE_ENGL_U4_COMMONLY_CONFUSED_WORDS } from './seeds/engl-u4-commonly-confused-words';
import { BASELINE_ENGL_U5_CLAIMS_AND_EVIDENCE } from './seeds/engl-u5-claims-and-evidence';
import { BASELINE_ENGL_U5_RHETORICAL_APPEALS } from './seeds/engl-u5-rhetorical-appeals';
import { BASELINE_ENGL_U5_LOGICAL_FALLACIES } from './seeds/engl-u5-logical-fallacies';
import { BASELINE_ENGL_U5_COUNTERARGUMENT_AND_REBUTTAL } from './seeds/engl-u5-counterargument-and-rebuttal';
import { BASELINE_ENGL_U6_PLOT_AND_CONFLICT } from './seeds/engl-u6-plot-and-conflict';
import { BASELINE_ENGL_U6_CHARACTERIZATION } from './seeds/engl-u6-characterization';
import { BASELINE_ENGL_U6_NARRATIVE_POINT_OF_VIEW } from './seeds/engl-u6-narrative-point-of-view';
import { BASELINE_ENGL_U6_THEME } from './seeds/engl-u6-theme';
import { BASELINE_ENGL_U7_CENTRAL_IDEA_AND_DETAILS } from './seeds/engl-u7-central-idea-and-details';
import { BASELINE_ENGL_U7_AUTHORS_PURPOSE_AND_PERSPECTIVE } from './seeds/engl-u7-authors-purpose-and-perspective';
import { BASELINE_ENGL_U7_TEXT_STRUCTURE } from './seeds/engl-u7-text-structure';
import { BASELINE_ENGL_U7_INFERENCE_AND_EVIDENCE } from './seeds/engl-u7-inference-and-evidence';
import { BASELINE_ENGL_U8_FIGURATIVE_LANGUAGE } from './seeds/engl-u8-figurative-language';
import { BASELINE_ENGL_U8_IMAGERY_AND_SYMBOLISM } from './seeds/engl-u8-imagery-and-symbolism';
import { BASELINE_ENGL_U8_SOUND_DEVICES } from './seeds/engl-u8-sound-devices';
import { BASELINE_ENGL_U8_POETIC_FORM_AND_STRUCTURE } from './seeds/engl-u8-poetic-form-and-structure';
import { BASELINE_ENGL_U9_THESIS_STATEMENTS } from './seeds/engl-u9-thesis-statements';
import { BASELINE_ENGL_U9_PARAGRAPH_UNITY_AND_SUPPORT } from './seeds/engl-u9-paragraph-unity-and-support';
import { BASELINE_ENGL_U9_TRANSITIONS_AND_COHESION } from './seeds/engl-u9-transitions-and-cohesion';
import { BASELINE_ENGL_U9_INTRODUCTIONS_AND_CONCLUSIONS } from './seeds/engl-u9-introductions-and-conclusions';
import { BASELINE_ENGL_U10_RESEARCH_QUESTIONS_AND_SOURCES } from './seeds/engl-u10-research-questions-and-sources';
import { BASELINE_ENGL_U10_EVALUATING_SOURCES } from './seeds/engl-u10-evaluating-sources';
import { BASELINE_ENGL_U10_QUOTING_PARAPHRASING_SUMMARIZING } from './seeds/engl-u10-quoting-paraphrasing-summarizing';
import { BASELINE_ENGL_U10_CITING_AND_INTEGRATING_SOURCES } from './seeds/engl-u10-citing-and-integrating-sources';
import { BASELINE_WHIST_U1_NEOLITHIC_REVOLUTION } from './seeds/whist-u1-neolithic-revolution';
import { BASELINE_WHIST_U1_FEATURES_OF_CIVILIZATION } from './seeds/whist-u1-features-of-civilization';
import { BASELINE_WHIST_U1_MESOPOTAMIA_EGYPT } from './seeds/whist-u1-mesopotamia-egypt';
import { BASELINE_WHIST_U1_EARLY_INDIA_CHINA } from './seeds/whist-u1-early-india-china';
import { BASELINE_WHIST_U2_CLASSICAL_GREECE } from './seeds/whist-u2-classical-greece';
import { BASELINE_WHIST_U2_ROME_REPUBLIC_EMPIRE } from './seeds/whist-u2-rome-republic-empire';
import { BASELINE_WHIST_U2_CLASSICAL_INDIA_CHINA } from './seeds/whist-u2-classical-india-china';
import { BASELINE_WHIST_U2_WORLD_BELIEF_SYSTEMS } from './seeds/whist-u2-world-belief-systems';
import { BASELINE_WHIST_U3_RISE_OF_ISLAM } from './seeds/whist-u3-rise-of-islam';
import { BASELINE_WHIST_U3_ISLAMIC_GOLDEN_AGE } from './seeds/whist-u3-islamic-golden-age';
import { BASELINE_WHIST_U3_TANG_SONG_CHINA } from './seeds/whist-u3-tang-song-china';
import { BASELINE_WHIST_U3_MONGOL_EMPIRE } from './seeds/whist-u3-mongol-empire';
import { BASELINE_WHIST_U4_BYZANTINE_EMPIRE } from './seeds/whist-u4-byzantine-empire';
import { BASELINE_WHIST_U4_FEUDAL_EUROPE } from './seeds/whist-u4-feudal-europe';
import { BASELINE_WHIST_U4_CHURCH_AND_CRUSADES } from './seeds/whist-u4-church-and-crusades';
import { BASELINE_WHIST_U4_LATE_MIDDLE_AGES } from './seeds/whist-u4-late-middle-ages';
import { BASELINE_WHIST_U5_WEST_AFRICAN_EMPIRES } from './seeds/whist-u5-west-african-empires';
import { BASELINE_WHIST_U5_EAST_AFRICA_INDIAN_OCEAN } from './seeds/whist-u5-east-africa-indian-ocean';
import { BASELINE_WHIST_U5_MAYA_AZTEC } from './seeds/whist-u5-maya-aztec';
import { BASELINE_WHIST_U5_INCA_NORTH_AMERICA } from './seeds/whist-u5-inca-north-america';
import { BASELINE_WHIST_U6_RENAISSANCE } from './seeds/whist-u6-renaissance';
import { BASELINE_WHIST_U6_PROTESTANT_REFORMATION } from './seeds/whist-u6-protestant-reformation';
import { BASELINE_WHIST_U6_AGE_OF_EXPLORATION } from './seeds/whist-u6-age-of-exploration';
import { BASELINE_WHIST_U6_COLUMBIAN_EXCHANGE } from './seeds/whist-u6-columbian-exchange';
import { BASELINE_WHIST_U7_SCIENTIFIC_REVOLUTION } from './seeds/whist-u7-scientific-revolution';
import { BASELINE_WHIST_U7_ABSOLUTISM_CONSTITUTIONALISM } from './seeds/whist-u7-absolutism-constitutionalism';
import { BASELINE_WHIST_U7_ENLIGHTENMENT } from './seeds/whist-u7-enlightenment';
import { BASELINE_WHIST_U7_ATLANTIC_REVOLUTIONS } from './seeds/whist-u7-atlantic-revolutions';
import { BASELINE_WHIST_U8_INDUSTRIAL_REVOLUTION } from './seeds/whist-u8-industrial-revolution';
import { BASELINE_WHIST_U8_INDUSTRIAL_SOCIETY_REFORM } from './seeds/whist-u8-industrial-society-reform';
import { BASELINE_WHIST_U8_NATIONALISM_UNIFICATION } from './seeds/whist-u8-nationalism-unification';
import { BASELINE_WHIST_U8_NEW_IMPERIALISM } from './seeds/whist-u8-new-imperialism';
import { BASELINE_WHIST_U9_WORLD_WAR_I } from './seeds/whist-u9-world-war-i';
import { BASELINE_WHIST_U9_INTERWAR_YEARS } from './seeds/whist-u9-interwar-years';
import { BASELINE_WHIST_U9_WORLD_WAR_II } from './seeds/whist-u9-world-war-ii';
import { BASELINE_WHIST_U9_HOLOCAUST_HUMAN_RIGHTS } from './seeds/whist-u9-holocaust-human-rights';
import { BASELINE_WHIST_U10_COLD_WAR } from './seeds/whist-u10-cold-war';
import { BASELINE_WHIST_U10_DECOLONIZATION } from './seeds/whist-u10-decolonization';
import { BASELINE_WHIST_U10_END_OF_COLD_WAR } from './seeds/whist-u10-end-of-cold-war';
import { BASELINE_WHIST_U10_GLOBALIZATION } from './seeds/whist-u10-globalization';
import { BASELINE_DSAT_U1_LINEAR_EQUATIONS_ONE_VAR } from './seeds/dsat-u1-linear-equations-one-var';
import { BASELINE_DSAT_U1_LINEAR_FUNCTIONS } from './seeds/dsat-u1-linear-functions';
import { BASELINE_DSAT_U1_LINEAR_EQUATIONS_TWO_VARS } from './seeds/dsat-u1-linear-equations-two-vars';
import { BASELINE_DSAT_U1_SYSTEMS_OF_LINEAR_EQUATIONS } from './seeds/dsat-u1-systems-of-linear-equations';
import { BASELINE_DSAT_U1_LINEAR_INEQUALITIES } from './seeds/dsat-u1-linear-inequalities';
import { BASELINE_DSAT_U1_EQUIVALENT_FORMS_SOLUTION_COUNTS } from './seeds/dsat-u1-equivalent-forms-solution-counts';
import { BASELINE_DSAT_U2_EQUIVALENT_EXPRESSIONS } from './seeds/dsat-u2-equivalent-expressions';
import { BASELINE_DSAT_U2_QUADRATIC_EQUATIONS } from './seeds/dsat-u2-quadratic-equations';
import { BASELINE_DSAT_U2_NONLINEAR_FUNCTIONS_GRAPHS } from './seeds/dsat-u2-nonlinear-functions-graphs';
import { BASELINE_DSAT_U2_EXPONENTIAL_FUNCTIONS } from './seeds/dsat-u2-exponential-functions';
import { BASELINE_DSAT_U2_RATIONAL_RADICAL_ABSOLUTE } from './seeds/dsat-u2-rational-radical-absolute';
import { BASELINE_DSAT_U2_NONLINEAR_SYSTEMS_TRANSFORMATIONS } from './seeds/dsat-u2-nonlinear-systems-transformations';
import { BASELINE_DSAT_U3_RATIOS_RATES_UNITS } from './seeds/dsat-u3-ratios-rates-units';
import { BASELINE_DSAT_U3_PERCENTAGES } from './seeds/dsat-u3-percentages';
import { BASELINE_DSAT_U3_ONE_VARIABLE_DATA } from './seeds/dsat-u3-one-variable-data';
import { BASELINE_DSAT_U3_TWO_VARIABLE_DATA } from './seeds/dsat-u3-two-variable-data';
import { BASELINE_DSAT_U3_PROBABILITY } from './seeds/dsat-u3-probability';
import { BASELINE_DSAT_U3_SAMPLE_STATISTICS_CLAIMS } from './seeds/dsat-u3-sample-statistics-claims';
import { BASELINE_DSAT_U4_AREA_VOLUME } from './seeds/dsat-u4-area-volume';
import { BASELINE_DSAT_U4_LINES_ANGLES_TRIANGLES } from './seeds/dsat-u4-lines-angles-triangles';
import { BASELINE_DSAT_U4_RIGHT_TRIANGLE_TRIG } from './seeds/dsat-u4-right-triangle-trig';
import { BASELINE_DSAT_U4_CIRCLES } from './seeds/dsat-u4-circles';
import { BASELINE_DSAT_U5_CENTRAL_IDEAS_DETAILS } from './seeds/dsat-u5-central-ideas-details';
import { BASELINE_DSAT_U5_TEXTUAL_EVIDENCE } from './seeds/dsat-u5-textual-evidence';
import { BASELINE_DSAT_U5_QUANTITATIVE_EVIDENCE } from './seeds/dsat-u5-quantitative-evidence';
import { BASELINE_DSAT_U5_INFERENCES } from './seeds/dsat-u5-inferences';
import { BASELINE_DSAT_U6_WORDS_IN_CONTEXT } from './seeds/dsat-u6-words-in-context';
import { BASELINE_DSAT_U6_TEXT_STRUCTURE_PURPOSE } from './seeds/dsat-u6-text-structure-purpose';
import { BASELINE_DSAT_U6_CROSS_TEXT_CONNECTIONS } from './seeds/dsat-u6-cross-text-connections';
import { BASELINE_DSAT_U7_RHETORICAL_SYNTHESIS } from './seeds/dsat-u7-rhetorical-synthesis';
import { BASELINE_DSAT_U7_TRANSITIONS } from './seeds/dsat-u7-transitions';
import { BASELINE_DSAT_U8_BOUNDARIES } from './seeds/dsat-u8-boundaries';
import { BASELINE_DSAT_U8_SUBJECT_VERB_PRONOUN_AGREEMENT } from './seeds/dsat-u8-subject-verb-pronoun-agreement';
import { BASELINE_DSAT_U8_VERB_FORMS_MODIFIERS } from './seeds/dsat-u8-verb-forms-modifiers';
import { BASELINE_DSAT_U8_PLURALS_POSSESSIVES_CONFUSABLES } from './seeds/dsat-u8-plurals-possessives-confusables';
import { BASELINE_ACT_U1_SENTENCE_STRUCTURE } from './seeds/act-u1-sentence-structure';
import { BASELINE_ACT_U1_PUNCTUATION } from './seeds/act-u1-punctuation';
import { BASELINE_ACT_U1_AGREEMENT } from './seeds/act-u1-agreement';
import { BASELINE_ACT_U1_VERB_TENSE_FORM } from './seeds/act-u1-verb-tense-form';
import { BASELINE_ACT_U1_MODIFIERS_PARALLELISM } from './seeds/act-u1-modifiers-parallelism';
import { BASELINE_ACT_U1_CONCISENESS } from './seeds/act-u1-conciseness';
import { BASELINE_ACT_U1_WORD_CHOICE_TONE } from './seeds/act-u1-word-choice-tone';
import { BASELINE_ACT_U1_TRANSITIONS } from './seeds/act-u1-transitions';
import { BASELINE_ACT_U1_RHETORICAL_SKILLS } from './seeds/act-u1-rhetorical-skills';
import { BASELINE_ACT_U2_PREALGEBRA_REVIEW } from './seeds/act-u2-prealgebra-review';
import { BASELINE_ACT_U2_LINEAR_EQUATIONS_INEQUALITIES } from './seeds/act-u2-linear-equations-inequalities';
import { BASELINE_ACT_U2_SYSTEMS } from './seeds/act-u2-systems';
import { BASELINE_ACT_U2_QUADRATICS_POLYNOMIALS } from './seeds/act-u2-quadratics-polynomials';
import { BASELINE_ACT_U2_FUNCTIONS_GRAPHS } from './seeds/act-u2-functions-graphs';
import { BASELINE_ACT_U2_EXPONENTS_ROOTS_LOGS } from './seeds/act-u2-exponents-roots-logs';
import { BASELINE_ACT_U2_COORDINATE_GEOMETRY } from './seeds/act-u2-coordinate-geometry';
import { BASELINE_ACT_U2_PLANE_GEOMETRY } from './seeds/act-u2-plane-geometry';
import { BASELINE_ACT_U2_TRIGONOMETRY } from './seeds/act-u2-trigonometry';
import { BASELINE_ACT_U2_STATISTICS_PROBABILITY } from './seeds/act-u2-statistics-probability';
import { BASELINE_ACT_U2_SEQUENCES_MATRICES_COMPLEX } from './seeds/act-u2-sequences-matrices-complex';
import { BASELINE_ACT_U2_WORD_PROBLEMS_MODELING } from './seeds/act-u2-word-problems-modeling';
import { BASELINE_ACT_U3_MAIN_IDEA_PURPOSE } from './seeds/act-u3-main-idea-purpose';
import { BASELINE_ACT_U3_DETAIL_SEQUENCE } from './seeds/act-u3-detail-sequence';
import { BASELINE_ACT_U3_INFERENCE_GENERALIZATION } from './seeds/act-u3-inference-generalization';
import { BASELINE_ACT_U3_VOCABULARY_IN_CONTEXT } from './seeds/act-u3-vocabulary-in-context';
import { BASELINE_ACT_U3_PAIRED_PASSAGES } from './seeds/act-u3-paired-passages';
import { BASELINE_ACT_U3_READING_PACING_STRATEGY } from './seeds/act-u3-reading-pacing-strategy';
import { BASELINE_ACT_U4_DATA_REPRESENTATION } from './seeds/act-u4-data-representation';
import { BASELINE_ACT_U4_TRENDS_EXTRAPOLATION } from './seeds/act-u4-trends-extrapolation';
import { BASELINE_ACT_U4_RESEARCH_SUMMARIES } from './seeds/act-u4-research-summaries';
import { BASELINE_ACT_U4_VARIABLES_CONTROLS } from './seeds/act-u4-variables-controls';
import { BASELINE_ACT_U4_CONFLICTING_VIEWPOINTS } from './seeds/act-u4-conflicting-viewpoints';
import { BASELINE_ACT_U4_SCIENTIFIC_MATH_UNITS } from './seeds/act-u4-scientific-math-units';
import { BASELINE_ACT_U4_SCIENCE_PACING_STRATEGY } from './seeds/act-u4-science-pacing-strategy';

// Grade 7 Math (MS) — all 10 units (40 baselines), extracted from the
// m7math lesson-plan seeds via scripts/extract-topic-notes-baselines.ts
// + enriched via scripts/gen-topic-notes-pointers.ts (Opus, SYSTEM_MS).
import { BASELINE_M7MATH_U1_INTEGERS_AND_ABSOLUTE_VALUE } from './seeds/m7math-u1-integers-and-absolute-value';
import { BASELINE_M7MATH_U1_RATIONAL_NUMBERS_ON_THE_NUMBER_LINE } from './seeds/m7math-u1-rational-numbers-on-the-number-line';
import { BASELINE_M7MATH_U1_COMPARING_AND_ORDERING_RATIONALS } from './seeds/m7math-u1-comparing-and-ordering-rationals';
import { BASELINE_M7MATH_U1_FRACTIONS_DECIMALS_PERCENTS } from './seeds/m7math-u1-fractions-decimals-percents';
import { BASELINE_M7MATH_U2_ADDING_RATIONAL_NUMBERS } from './seeds/m7math-u2-adding-rational-numbers';
import { BASELINE_M7MATH_U2_SUBTRACTING_RATIONAL_NUMBERS } from './seeds/m7math-u2-subtracting-rational-numbers';
import { BASELINE_M7MATH_U2_MULTIPLYING_DIVIDING_RATIONAL_NUMBERS } from './seeds/m7math-u2-multiplying-dividing-rational-numbers';
import { BASELINE_M7MATH_U2_ORDER_OF_OPERATIONS_RATIONALS } from './seeds/m7math-u2-order-of-operations-rationals';
import { BASELINE_M7MATH_U3_RATIOS_AND_UNIT_RATES } from './seeds/m7math-u3-ratios-and-unit-rates';
import { BASELINE_M7MATH_U3_COMPLEX_FRACTION_UNIT_RATES } from './seeds/m7math-u3-complex-fraction-unit-rates';
import { BASELINE_M7MATH_U3_PROPORTIONAL_RELATIONSHIPS } from './seeds/m7math-u3-proportional-relationships';
import { BASELINE_M7MATH_U3_CONSTANT_OF_PROPORTIONALITY } from './seeds/m7math-u3-constant-of-proportionality';
import { BASELINE_M7MATH_U4_PERCENT_OF_A_NUMBER } from './seeds/m7math-u4-percent-of-a-number';
import { BASELINE_M7MATH_U4_PERCENT_INCREASE_DECREASE } from './seeds/m7math-u4-percent-increase-decrease';
import { BASELINE_M7MATH_U4_TAX_TIP_DISCOUNT_MARKUP } from './seeds/m7math-u4-tax-tip-discount-markup';
import { BASELINE_M7MATH_U4_SIMPLE_INTEREST_AND_PERCENT_ERROR } from './seeds/m7math-u4-simple-interest-and-percent-error';
import { BASELINE_M7MATH_U5_WRITING_ALGEBRAIC_EXPRESSIONS } from './seeds/m7math-u5-writing-algebraic-expressions';
import { BASELINE_M7MATH_U5_EVALUATING_EXPRESSIONS } from './seeds/m7math-u5-evaluating-expressions';
import { BASELINE_M7MATH_U5_COMBINING_LIKE_TERMS } from './seeds/m7math-u5-combining-like-terms';
import { BASELINE_M7MATH_U5_DISTRIBUTIVE_PROPERTY_AND_FACTORING } from './seeds/m7math-u5-distributive-property-and-factoring';
import { BASELINE_M7MATH_U6_ONE_STEP_EQUATIONS } from './seeds/m7math-u6-one-step-equations';
import { BASELINE_M7MATH_U6_TWO_STEP_EQUATIONS } from './seeds/m7math-u6-two-step-equations';
import { BASELINE_M7MATH_U6_WRITING_EQUATIONS_FROM_WORD_PROBLEMS } from './seeds/m7math-u6-writing-equations-from-word-problems';
import { BASELINE_M7MATH_U6_SOLVING_AND_GRAPHING_INEQUALITIES } from './seeds/m7math-u6-solving-and-graphing-inequalities';
import { BASELINE_M7MATH_U7_ANGLE_RELATIONSHIPS } from './seeds/m7math-u7-angle-relationships';
import { BASELINE_M7MATH_U7_TRIANGLE_SIDE_AND_ANGLE_CONDITIONS } from './seeds/m7math-u7-triangle-side-and-angle-conditions';
import { BASELINE_M7MATH_U7_SCALE_DRAWINGS } from './seeds/m7math-u7-scale-drawings';
import { BASELINE_M7MATH_U7_CROSS_SECTIONS_OF_SOLIDS } from './seeds/m7math-u7-cross-sections-of-solids';
import { BASELINE_M7MATH_U8_AREA_OF_POLYGONS } from './seeds/m7math-u8-area-of-polygons';
import { BASELINE_M7MATH_U8_CIRCUMFERENCE_AND_AREA_OF_CIRCLES } from './seeds/m7math-u8-circumference-and-area-of-circles';
import { BASELINE_M7MATH_U8_SURFACE_AREA_OF_PRISMS_AND_PYRAMIDS } from './seeds/m7math-u8-surface-area-of-prisms-and-pyramids';
import { BASELINE_M7MATH_U8_VOLUME_OF_PRISMS_AND_COMPOSITE_SOLIDS } from './seeds/m7math-u8-volume-of-prisms-and-composite-solids';
import { BASELINE_M7MATH_U9_POPULATIONS_AND_SAMPLES } from './seeds/m7math-u9-populations-and-samples';
import { BASELINE_M7MATH_U9_RANDOM_SAMPLING_AND_INFERENCES } from './seeds/m7math-u9-random-sampling-and-inferences';
import { BASELINE_M7MATH_U9_MEASURES_OF_CENTER_AND_VARIABILITY } from './seeds/m7math-u9-measures-of-center-and-variability';
import { BASELINE_M7MATH_U9_COMPARING_TWO_POPULATIONS } from './seeds/m7math-u9-comparing-two-populations';
import { BASELINE_M7MATH_U10_PROBABILITY_OF_SIMPLE_EVENTS } from './seeds/m7math-u10-probability-of-simple-events';
import { BASELINE_M7MATH_U10_EXPERIMENTAL_VS_THEORETICAL_PROBABILITY } from './seeds/m7math-u10-experimental-vs-theoretical-probability';
import { BASELINE_M7MATH_U10_PROBABILITY_MODELS_AND_SIMULATIONS } from './seeds/m7math-u10-probability-models-and-simulations';
import { BASELINE_M7MATH_U10_COMPOUND_EVENTS } from './seeds/m7math-u10-compound-events';

// m7ela lesson-plan seeds via scripts/extract-topic-notes-baselines.ts
import { BASELINE_M7ELA_U1_TEXT_EVIDENCE_AND_INFERENCE } from './seeds/m7ela-u1-text-evidence-and-inference';
import { BASELINE_M7ELA_U1_PLOT_STRUCTURE_AND_CONFLICT } from './seeds/m7ela-u1-plot-structure-and-conflict';
import { BASELINE_M7ELA_U1_CHARACTERIZATION } from './seeds/m7ela-u1-characterization';
import { BASELINE_M7ELA_U1_SETTING_AND_STORY_ELEMENTS } from './seeds/m7ela-u1-setting-and-story-elements';
import { BASELINE_M7ELA_U2_THEME_AND_SUMMARY } from './seeds/m7ela-u2-theme-and-summary';
import { BASELINE_M7ELA_U2_POINT_OF_VIEW } from './seeds/m7ela-u2-point-of-view';
import { BASELINE_M7ELA_U2_FIGURATIVE_LANGUAGE } from './seeds/m7ela-u2-figurative-language';
import { BASELINE_M7ELA_U2_TONE_MOOD_AND_WORD_CHOICE } from './seeds/m7ela-u2-tone-mood-and-word-choice';
import { BASELINE_M7ELA_U3_CENTRAL_IDEA_AND_SUPPORTING_DETAILS } from './seeds/m7ela-u3-central-idea-and-supporting-details';
import { BASELINE_M7ELA_U3_SUMMARIZING_INFORMATIONAL_TEXT } from './seeds/m7ela-u3-summarizing-informational-text';
import { BASELINE_M7ELA_U3_TEXT_FEATURES_AND_GRAPHICS } from './seeds/m7ela-u3-text-features-and-graphics';
import { BASELINE_M7ELA_U3_TECHNICAL_AND_DOMAIN_VOCABULARY } from './seeds/m7ela-u3-technical-and-domain-vocabulary';
import { BASELINE_M7ELA_U4_TEXT_STRUCTURE } from './seeds/m7ela-u4-text-structure';
import { BASELINE_M7ELA_U4_AUTHORS_PURPOSE_AND_PERSPECTIVE } from './seeds/m7ela-u4-authors-purpose-and-perspective';
import { BASELINE_M7ELA_U4_TRACING_AN_ARGUMENT } from './seeds/m7ela-u4-tracing-an-argument';
import { BASELINE_M7ELA_U4_COMPARING_TWO_TEXTS } from './seeds/m7ela-u4-comparing-two-texts';
import { BASELINE_M7ELA_U5_PARTS_OF_SPEECH } from './seeds/m7ela-u5-parts-of-speech';
import { BASELINE_M7ELA_U5_SUBJECT_VERB_AGREEMENT } from './seeds/m7ela-u5-subject-verb-agreement';
import { BASELINE_M7ELA_U5_PRONOUNS_AND_ANTECEDENTS } from './seeds/m7ela-u5-pronouns-and-antecedents';
import { BASELINE_M7ELA_U5_VERB_TENSE_CONSISTENCY } from './seeds/m7ela-u5-verb-tense-consistency';
import { BASELINE_M7ELA_U6_PHRASES_AND_CLAUSES } from './seeds/m7ela-u6-phrases-and-clauses';
import { BASELINE_M7ELA_U6_SENTENCE_TYPES_AND_COMBINING } from './seeds/m7ela-u6-sentence-types-and-combining';
import { BASELINE_M7ELA_U6_FRAGMENTS_AND_RUN_ONS } from './seeds/m7ela-u6-fragments-and-run-ons';
import { BASELINE_M7ELA_U6_COMMAS_AND_END_PUNCTUATION } from './seeds/m7ela-u6-commas-and-end-punctuation';
import { BASELINE_M7ELA_U7_CONTEXT_CLUES } from './seeds/m7ela-u7-context-clues';
import { BASELINE_M7ELA_U7_ROOTS_PREFIXES_AND_SUFFIXES } from './seeds/m7ela-u7-roots-prefixes-and-suffixes';
import { BASELINE_M7ELA_U7_CONNOTATION_AND_DENOTATION } from './seeds/m7ela-u7-connotation-and-denotation';
import { BASELINE_M7ELA_U7_COMMONLY_CONFUSED_WORDS } from './seeds/m7ela-u7-commonly-confused-words';
import { BASELINE_M7ELA_U8_CLAIMS_AND_REASONS } from './seeds/m7ela-u8-claims-and-reasons';
import { BASELINE_M7ELA_U8_EVIDENCE_AND_ELABORATION } from './seeds/m7ela-u8-evidence-and-elaboration';
import { BASELINE_M7ELA_U8_COUNTERCLAIMS } from './seeds/m7ela-u8-counterclaims';
import { BASELINE_M7ELA_U8_ORGANIZING_AN_ARGUMENT } from './seeds/m7ela-u8-organizing-an-argument';
import { BASELINE_M7ELA_U9_INFORMATIVE_THESIS_AND_STRUCTURE } from './seeds/m7ela-u9-informative-thesis-and-structure';
import { BASELINE_M7ELA_U9_PARAGRAPH_DEVELOPMENT } from './seeds/m7ela-u9-paragraph-development';
import { BASELINE_M7ELA_U9_TRANSITIONS_AND_COHESION } from './seeds/m7ela-u9-transitions-and-cohesion';
import { BASELINE_M7ELA_U9_NARRATIVE_TECHNIQUE } from './seeds/m7ela-u9-narrative-technique';
import { BASELINE_M7ELA_U10_RESEARCH_QUESTIONS } from './seeds/m7ela-u10-research-questions';
import { BASELINE_M7ELA_U10_EVALUATING_SOURCES } from './seeds/m7ela-u10-evaluating-sources';
import { BASELINE_M7ELA_U10_QUOTING_PARAPHRASING_SUMMARIZING } from './seeds/m7ela-u10-quoting-paraphrasing-summarizing';
import { BASELINE_M7ELA_U10_CITING_SOURCES } from './seeds/m7ela-u10-citing-sources';
import { BASELINE_M7SCI_U1_CHARACTERISTICS_OF_LIVING_THINGS } from './seeds/m7sci-u1-characteristics-of-living-things';
import { BASELINE_M7SCI_U1_SCIENTIFIC_INVESTIGATION } from './seeds/m7sci-u1-scientific-investigation';
import { BASELINE_M7SCI_U1_VARIABLES_AND_CONTROLS } from './seeds/m7sci-u1-variables-and-controls';
import { BASELINE_M7SCI_U1_DATA_GRAPHS_AND_CONCLUSIONS } from './seeds/m7sci-u1-data-graphs-and-conclusions';
import { BASELINE_M7SCI_U2_CELL_THEORY_AND_MICROSCOPES } from './seeds/m7sci-u2-cell-theory-and-microscopes';
import { BASELINE_M7SCI_U2_PLANT_AND_ANIMAL_CELLS } from './seeds/m7sci-u2-plant-and-animal-cells';
import { BASELINE_M7SCI_U2_ORGANELLES_AND_THEIR_JOBS } from './seeds/m7sci-u2-organelles-and-their-jobs';
import { BASELINE_M7SCI_U2_DIFFUSION_AND_OSMOSIS } from './seeds/m7sci-u2-diffusion-and-osmosis';
import { BASELINE_M7SCI_U3_LEVELS_OF_ORGANIZATION } from './seeds/m7sci-u3-levels-of-organization';
import { BASELINE_M7SCI_U3_DIGESTIVE_AND_CIRCULATORY_SYSTEMS } from './seeds/m7sci-u3-digestive-and-circulatory-systems';
import { BASELINE_M7SCI_U3_RESPIRATORY_AND_NERVOUS_SYSTEMS } from './seeds/m7sci-u3-respiratory-and-nervous-systems';
import { BASELINE_M7SCI_U3_HOMEOSTASIS } from './seeds/m7sci-u3-homeostasis';
import { BASELINE_M7SCI_U4_ENERGY_FOR_LIVING_THINGS } from './seeds/m7sci-u4-energy-for-living-things';
import { BASELINE_M7SCI_U4_PHOTOSYNTHESIS } from './seeds/m7sci-u4-photosynthesis';
import { BASELINE_M7SCI_U4_CELLULAR_RESPIRATION } from './seeds/m7sci-u4-cellular-respiration';
import { BASELINE_M7SCI_U4_MATTER_AND_ENERGY_IN_ORGANISMS } from './seeds/m7sci-u4-matter-and-energy-in-organisms';
import { BASELINE_M7SCI_U5_CELL_DIVISION_AND_GROWTH } from './seeds/m7sci-u5-cell-division-and-growth';
import { BASELINE_M7SCI_U5_ASEXUAL_AND_SEXUAL_REPRODUCTION } from './seeds/m7sci-u5-asexual-and-sexual-reproduction';
import { BASELINE_M7SCI_U5_PLANT_REPRODUCTION_AND_POLLINATION } from './seeds/m7sci-u5-plant-reproduction-and-pollination';
import { BASELINE_M7SCI_U5_ENVIRONMENT_AND_GROWTH } from './seeds/m7sci-u5-environment-and-growth';
import { BASELINE_M7SCI_U6_GENES_CHROMOSOMES_AND_DNA } from './seeds/m7sci-u6-genes-chromosomes-and-dna';
import { BASELINE_M7SCI_U6_DOMINANT_AND_RECESSIVE_TRAITS } from './seeds/m7sci-u6-dominant-and-recessive-traits';
import { BASELINE_M7SCI_U6_PUNNETT_SQUARES } from './seeds/m7sci-u6-punnett-squares';
import { BASELINE_M7SCI_U6_MUTATIONS_AND_VARIATION } from './seeds/m7sci-u6-mutations-and-variation';
import { BASELINE_M7SCI_U7_FOSSILS_AND_THE_FOSSIL_RECORD } from './seeds/m7sci-u7-fossils-and-the-fossil-record';
import { BASELINE_M7SCI_U7_EVIDENCE_FOR_COMMON_ANCESTRY } from './seeds/m7sci-u7-evidence-for-common-ancestry';
import { BASELINE_M7SCI_U7_NATURAL_SELECTION } from './seeds/m7sci-u7-natural-selection';
import { BASELINE_M7SCI_U7_ADAPTATION_AND_ARTIFICIAL_SELECTION } from './seeds/m7sci-u7-adaptation-and-artificial-selection';
import { BASELINE_M7SCI_U8_CLASSIFYING_LIVING_THINGS } from './seeds/m7sci-u8-classifying-living-things';
import { BASELINE_M7SCI_U8_DOMAINS_AND_KINGDOMS } from './seeds/m7sci-u8-domains-and-kingdoms';
import { BASELINE_M7SCI_U8_USING_DICHOTOMOUS_KEYS } from './seeds/m7sci-u8-using-dichotomous-keys';
import { BASELINE_M7SCI_U8_CLADOGRAMS_AND_RELATEDNESS } from './seeds/m7sci-u8-cladograms-and-relatedness';
import { BASELINE_M7SCI_U9_ECOSYSTEM_ORGANIZATION } from './seeds/m7sci-u9-ecosystem-organization';
import { BASELINE_M7SCI_U9_FOOD_CHAINS_AND_FOOD_WEBS } from './seeds/m7sci-u9-food-chains-and-food-webs';
import { BASELINE_M7SCI_U9_CYCLES_OF_MATTER } from './seeds/m7sci-u9-cycles-of-matter';
import { BASELINE_M7SCI_U9_BIOMES_AND_HABITATS } from './seeds/m7sci-u9-biomes-and-habitats';
import { BASELINE_M7SCI_U10_INTERACTIONS_BETWEEN_SPECIES } from './seeds/m7sci-u10-interactions-between-species';
import { BASELINE_M7SCI_U10_POPULATION_CHANGES_AND_LIMITS } from './seeds/m7sci-u10-population-changes-and-limits';
import { BASELINE_M7SCI_U10_ECOSYSTEM_DISRUPTION } from './seeds/m7sci-u10-ecosystem-disruption';
import { BASELINE_M7SCI_U10_BIODIVERSITY_AND_HUMAN_IMPACT } from './seeds/m7sci-u10-biodiversity-and-human-impact';
import { BASELINE_M7GEO_U1_MAPS_GLOBES_AND_PROJECTIONS } from './seeds/m7geo-u1-maps-globes-and-projections';
import { BASELINE_M7GEO_U1_LATITUDE_LONGITUDE_AND_LOCATION } from './seeds/m7geo-u1-latitude-longitude-and-location';
import { BASELINE_M7GEO_U1_MAP_ELEMENTS_SCALE_AND_DIRECTION } from './seeds/m7geo-u1-map-elements-scale-and-direction';
import { BASELINE_M7GEO_U1_REGIONS_AND_PLACE } from './seeds/m7geo-u1-regions-and-place';
import { BASELINE_M7GEO_U2_LANDFORMS_AND_WATER_FEATURES } from './seeds/m7geo-u2-landforms-and-water-features';
import { BASELINE_M7GEO_U2_PLATE_TECTONICS_AND_NATURAL_HAZARDS } from './seeds/m7geo-u2-plate-tectonics-and-natural-hazards';
import { BASELINE_M7GEO_U2_WEATHER_CLIMATE_AND_FACTORS } from './seeds/m7geo-u2-weather-climate-and-factors';
import { BASELINE_M7GEO_U2_CLIMATE_ZONES_AND_BIOMES } from './seeds/m7geo-u2-climate-zones-and-biomes';
import { BASELINE_M7GEO_U3_POPULATION_DISTRIBUTION_AND_DENSITY } from './seeds/m7geo-u3-population-distribution-and-density';
import { BASELINE_M7GEO_U3_POPULATION_GROWTH_AND_STRUCTURE } from './seeds/m7geo-u3-population-growth-and-structure';
import { BASELINE_M7GEO_U3_MIGRATION_PUSH_AND_PULL } from './seeds/m7geo-u3-migration-push-and-pull';
import { BASELINE_M7GEO_U3_URBANIZATION_AND_SETTLEMENT } from './seeds/m7geo-u3-urbanization-and-settlement';
import { BASELINE_M7GEO_U4_WHAT_CULTURE_IS } from './seeds/m7geo-u4-what-culture-is';
import { BASELINE_M7GEO_U4_LANGUAGE_FAMILIES_AND_DIFFUSION } from './seeds/m7geo-u4-language-families-and-diffusion';
import { BASELINE_M7GEO_U4_WORLD_RELIGIONS } from './seeds/m7geo-u4-world-religions';
import { BASELINE_M7GEO_U4_CULTURAL_CHANGE_AND_GLOBALIZATION } from './seeds/m7geo-u4-cultural-change-and-globalization';
import { BASELINE_M7GEO_U5_ECONOMIC_SYSTEMS } from './seeds/m7geo-u5-economic-systems';
import { BASELINE_M7GEO_U5_RESOURCES_AND_ECONOMIC_ACTIVITY } from './seeds/m7geo-u5-resources-and-economic-activity';
import { BASELINE_M7GEO_U5_LEVELS_OF_DEVELOPMENT } from './seeds/m7geo-u5-levels-of-development';
import { BASELINE_M7GEO_U5_TRADE_AND_INTERDEPENDENCE } from './seeds/m7geo-u5-trade-and-interdependence';
import { BASELINE_M7GEO_U6_TYPES_OF_GOVERNMENT } from './seeds/m7geo-u6-types-of-government';
import { BASELINE_M7GEO_U6_CITIZENSHIP_AND_RIGHTS } from './seeds/m7geo-u6-citizenship-and-rights';
import { BASELINE_M7GEO_U6_BORDERS_AND_CONFLICT } from './seeds/m7geo-u6-borders-and-conflict';
import { BASELINE_M7GEO_U6_INTERNATIONAL_COOPERATION } from './seeds/m7geo-u6-international-cooperation';
import { BASELINE_M7GEO_U7_LATIN_AMERICA_PHYSICAL_GEOGRAPHY } from './seeds/m7geo-u7-latin-america-physical-geography';
import { BASELINE_M7GEO_U7_LATIN_AMERICA_HISTORY_AND_CULTURE } from './seeds/m7geo-u7-latin-america-history-and-culture';
import { BASELINE_M7GEO_U7_LATIN_AMERICA_ECONOMY_AND_CITIES } from './seeds/m7geo-u7-latin-america-economy-and-cities';
import { BASELINE_M7GEO_U7_LATIN_AMERICA_ENVIRONMENT_ISSUES } from './seeds/m7geo-u7-latin-america-environment-issues';
import { BASELINE_M7GEO_U8_EUROPE_PHYSICAL_GEOGRAPHY } from './seeds/m7geo-u8-europe-physical-geography';
import { BASELINE_M7GEO_U8_EUROPE_HISTORY_AND_CULTURE } from './seeds/m7geo-u8-europe-history-and-culture';
import { BASELINE_M7GEO_U8_EUROPE_ECONOMY_AND_UNION } from './seeds/m7geo-u8-europe-economy-and-union';
import { BASELINE_M7GEO_U8_RUSSIA_AND_EURASIA } from './seeds/m7geo-u8-russia-and-eurasia';
import { BASELINE_M7GEO_U9_AFRICA_PHYSICAL_GEOGRAPHY } from './seeds/m7geo-u9-africa-physical-geography';
import { BASELINE_M7GEO_U9_AFRICA_HISTORY_AND_CULTURE } from './seeds/m7geo-u9-africa-history-and-culture';
import { BASELINE_M7GEO_U9_MIDDLE_EAST_GEOGRAPHY_AND_RESOURCES } from './seeds/m7geo-u9-middle-east-geography-and-resources';
import { BASELINE_M7GEO_U9_AFRICA_MIDDLE_EAST_DEVELOPMENT } from './seeds/m7geo-u9-africa-middle-east-development';
import { BASELINE_M7GEO_U10_ASIA_PHYSICAL_GEOGRAPHY } from './seeds/m7geo-u10-asia-physical-geography';
import { BASELINE_M7GEO_U10_SOUTH_AND_EAST_ASIA_CULTURE } from './seeds/m7geo-u10-south-and-east-asia-culture';
import { BASELINE_M7GEO_U10_ASIA_POPULATION_AND_ECONOMY } from './seeds/m7geo-u10-asia-population-and-economy';
import { BASELINE_M7GEO_U10_OCEANIA_AND_ANTARCTICA } from './seeds/m7geo-u10-oceania-and-antarctica';

// MS-core — Grade 6 (4 courses x 40 baselines).
import { BASELINE_M6MATH_U1_RATIO_LANGUAGE_AND_NOTATION } from './seeds/m6math-u1-ratio-language-and-notation';
import { BASELINE_M6MATH_U1_REPRESENTING_RATIOS_WITH_TABLES_AND_DIAGRAMS } from './seeds/m6math-u1-representing-ratios-with-tables-and-diagrams';
import { BASELINE_M6MATH_U1_SOLVING_MISSING_VALUE_RATIO_PROBLEMS } from './seeds/m6math-u1-solving-missing-value-ratio-problems';
import { BASELINE_M6MATH_U1_UNIT_RATES_AND_UNIT_PRICING } from './seeds/m6math-u1-unit-rates-and-unit-pricing';
import { BASELINE_M6MATH_U2_PERCENT_AS_RATE_PER_100 } from './seeds/m6math-u2-percent-as-rate-per-100';
import { BASELINE_M6MATH_U2_FINDING_THE_PERCENT_OF_A_QUANTITY } from './seeds/m6math-u2-finding-the-percent-of-a-quantity';
import { BASELINE_M6MATH_U2_FINDING_THE_WHOLE_GIVEN_A_PART_AND_PERCENT } from './seeds/m6math-u2-finding-the-whole-given-a-part-and-percent';
import { BASELINE_M6MATH_U2_CONVERTING_MEASUREMENT_UNITS } from './seeds/m6math-u2-converting-measurement-units';
import { BASELINE_M6MATH_U3_MEANING_OF_FRACTION_DIVISION } from './seeds/m6math-u3-meaning-of-fraction-division';
import { BASELINE_M6MATH_U3_DIVIDING_FRACTIONS_BY_FRACTIONS } from './seeds/m6math-u3-dividing-fractions-by-fractions';
import { BASELINE_M6MATH_U3_DIVIDING_MIXED_NUMBERS } from './seeds/m6math-u3-dividing-mixed-numbers';
import { BASELINE_M6MATH_U3_WORD_PROBLEMS_WITH_FRACTION_DIVISION } from './seeds/m6math-u3-word-problems-with-fraction-division';
import { BASELINE_M6MATH_U4_DIVIDING_MULTI_DIGIT_WHOLE_NUMBERS } from './seeds/m6math-u4-dividing-multi-digit-whole-numbers';
import { BASELINE_M6MATH_U4_ADDING_AND_SUBTRACTING_DECIMALS } from './seeds/m6math-u4-adding-and-subtracting-decimals';
import { BASELINE_M6MATH_U4_MULTIPLYING_AND_DIVIDING_DECIMALS } from './seeds/m6math-u4-multiplying-and-dividing-decimals';
import { BASELINE_M6MATH_U4_GCF_LCM_AND_THE_DISTRIBUTIVE_PROPERTY } from './seeds/m6math-u4-gcf-lcm-and-the-distributive-property';
import { BASELINE_M6MATH_U5_NEGATIVE_NUMBERS_IN_CONTEXT } from './seeds/m6math-u5-negative-numbers-in-context';
import { BASELINE_M6MATH_U5_RATIONAL_NUMBERS_ON_THE_NUMBER_LINE } from './seeds/m6math-u5-rational-numbers-on-the-number-line';
import { BASELINE_M6MATH_U5_ABSOLUTE_VALUE } from './seeds/m6math-u5-absolute-value';
import { BASELINE_M6MATH_U5_ORDERING_RATIONAL_NUMBERS } from './seeds/m6math-u5-ordering-rational-numbers';
import { BASELINE_M6MATH_U6_PLOTTING_POINTS_IN_ALL_FOUR_QUADRANTS } from './seeds/m6math-u6-plotting-points-in-all-four-quadrants';
import { BASELINE_M6MATH_U6_REFLECTING_POINTS_ACROSS_THE_AXES } from './seeds/m6math-u6-reflecting-points-across-the-axes';
import { BASELINE_M6MATH_U6_FINDING_DISTANCE_BETWEEN_POINTS } from './seeds/m6math-u6-finding-distance-between-points';
import { BASELINE_M6MATH_U6_SOLVING_REAL_WORLD_COORDINATE_PLANE_PROBLEMS } from './seeds/m6math-u6-solving-real-world-coordinate-plane-problems';
import { BASELINE_M6MATH_U7_NUMERICAL_EXPRESSIONS_WITH_EXPONENTS } from './seeds/m6math-u7-numerical-expressions-with-exponents';
import { BASELINE_M6MATH_U7_WRITING_AND_EVALUATING_ALGEBRAIC_EXPRESSIONS } from './seeds/m6math-u7-writing-and-evaluating-algebraic-expressions';
import { BASELINE_M6MATH_U7_PARTS_OF_AN_EXPRESSION } from './seeds/m6math-u7-parts-of-an-expression';
import { BASELINE_M6MATH_U7_EQUIVALENT_EXPRESSIONS } from './seeds/m6math-u7-equivalent-expressions';
import { BASELINE_M6MATH_U8_WHAT_IT_MEANS_TO_SOLVE_AN_EQUATION } from './seeds/m6math-u8-what-it-means-to-solve-an-equation';
import { BASELINE_M6MATH_U8_SOLVING_ONE_STEP_EQUATIONS } from './seeds/m6math-u8-solving-one-step-equations';
import { BASELINE_M6MATH_U8_WRITING_AND_GRAPHING_INEQUALITIES } from './seeds/m6math-u8-writing-and-graphing-inequalities';
import { BASELINE_M6MATH_U8_DEPENDENT_AND_INDEPENDENT_VARIABLES } from './seeds/m6math-u8-dependent-and-independent-variables';
import { BASELINE_M6MATH_U9_AREA_OF_TRIANGLES_AND_QUADRILATERALS } from './seeds/m6math-u9-area-of-triangles-and-quadrilaterals';
import { BASELINE_M6MATH_U9_POLYGONS_IN_THE_COORDINATE_PLANE } from './seeds/m6math-u9-polygons-in-the-coordinate-plane';
import { BASELINE_M6MATH_U9_VOLUME_OF_RECTANGULAR_PRISMS } from './seeds/m6math-u9-volume-of-rectangular-prisms';
import { BASELINE_M6MATH_U9_NETS_AND_SURFACE_AREA } from './seeds/m6math-u9-nets-and-surface-area';
import { BASELINE_M6MATH_U10_STATISTICAL_QUESTIONS } from './seeds/m6math-u10-statistical-questions';
import { BASELINE_M6MATH_U10_DOT_PLOTS_AND_HISTOGRAMS } from './seeds/m6math-u10-dot-plots-and-histograms';
import { BASELINE_M6MATH_U10_MEASURES_OF_CENTER } from './seeds/m6math-u10-measures-of-center';
import { BASELINE_M6MATH_U10_MEASURES_OF_SPREAD_AND_SUMMARIZING_DATA } from './seeds/m6math-u10-measures-of-spread-and-summarizing-data';
import { BASELINE_M6ELA_U1_TEXT_EVIDENCE_AND_INFERENCE } from './seeds/m6ela-u1-text-evidence-and-inference';
import { BASELINE_M6ELA_U1_HOW_A_STORYS_PLOT_UNFOLDS } from './seeds/m6ela-u1-how-a-storys-plot-unfolds';
import { BASELINE_M6ELA_U1_HOW_CHARACTERS_RESPOND_AND_CHANGE } from './seeds/m6ela-u1-how-characters-respond-and-change';
import { BASELINE_M6ELA_U1_HOW_A_SCENE_FITS_THE_WHOLE_STORY } from './seeds/m6ela-u1-how-a-scene-fits-the-whole-story';
import { BASELINE_M6ELA_U2_THEME_AND_OBJECTIVE_SUMMARY } from './seeds/m6ela-u2-theme-and-objective-summary';
import { BASELINE_M6ELA_U2_POINT_OF_VIEW_OF_THE_NARRATOR } from './seeds/m6ela-u2-point-of-view-of-the-narrator';
import { BASELINE_M6ELA_U2_FIGURATIVE_LANGUAGE } from './seeds/m6ela-u2-figurative-language';
import { BASELINE_M6ELA_U2_WORD_CHOICE_AND_TONE } from './seeds/m6ela-u2-word-choice-and-tone';
import { BASELINE_M6ELA_U3_CENTRAL_IDEA_AND_SUPPORTING_DETAILS } from './seeds/m6ela-u3-central-idea-and-supporting-details';
import { BASELINE_M6ELA_U3_SUMMARIZING_INFORMATIONAL_TEXT } from './seeds/m6ela-u3-summarizing-informational-text';
import { BASELINE_M6ELA_U3_TECHNICAL_AND_DOMAIN_VOCABULARY } from './seeds/m6ela-u3-technical-and-domain-vocabulary';
import { BASELINE_M6ELA_U3_TEXT_FEATURES_AND_HOW_THEY_AID_UNDERSTANDING } from './seeds/m6ela-u3-text-features-and-how-they-aid-understanding';
import { BASELINE_M6ELA_U4_HOW_A_TEXT_IS_ORGANIZED } from './seeds/m6ela-u4-how-a-text-is-organized';
import { BASELINE_M6ELA_U4_AUTHORS_PURPOSE } from './seeds/m6ela-u4-authors-purpose';
import { BASELINE_M6ELA_U4_TRACING_AN_ARGUMENT } from './seeds/m6ela-u4-tracing-an-argument';
import { BASELINE_M6ELA_U4_COMPARING_TWO_AUTHORS_ACCOUNTS } from './seeds/m6ela-u4-comparing-two-authors-accounts';
import { BASELINE_M6ELA_U5_PRONOUN_CASE } from './seeds/m6ela-u5-pronoun-case';
import { BASELINE_M6ELA_U5_INTENSIVE_PRONOUNS } from './seeds/m6ela-u5-intensive-pronouns';
import { BASELINE_M6ELA_U5_KEEPING_PRONOUN_NUMBER_AND_PERSON_CONSISTENT } from './seeds/m6ela-u5-keeping-pronoun-number-and-person-consistent';
import { BASELINE_M6ELA_U5_STANDARD_AND_NONSTANDARD_ENGLISH } from './seeds/m6ela-u5-standard-and-nonstandard-english';
import { BASELINE_M6ELA_U6_SENTENCE_FRAGMENTS_AND_RUN_ONS } from './seeds/m6ela-u6-sentence-fragments-and-run-ons';
import { BASELINE_M6ELA_U6_VARYING_SENTENCE_PATTERNS_FOR_STYLE } from './seeds/m6ela-u6-varying-sentence-patterns-for-style';
import { BASELINE_M6ELA_U6_COMMAS_FOR_NONRESTRICTIVE_AND_PARENTHETICAL_ELEMENTS } from './seeds/m6ela-u6-commas-for-nonrestrictive-and-parenthetical-elements';
import { BASELINE_M6ELA_U6_MAINTAINING_CONSISTENT_STYLE_AND_TONE } from './seeds/m6ela-u6-maintaining-consistent-style-and-tone';
import { BASELINE_M6ELA_U7_CONTEXT_CLUES } from './seeds/m6ela-u7-context-clues';
import { BASELINE_M6ELA_U7_GREEK_AND_LATIN_ROOTS_AND_AFFIXES } from './seeds/m6ela-u7-greek-and-latin-roots-and-affixes';
import { BASELINE_M6ELA_U7_CONNOTATION_AND_DENOTATION } from './seeds/m6ela-u7-connotation-and-denotation';
import { BASELINE_M6ELA_U7_WORD_RELATIONSHIPS_AND_ANALOGIES } from './seeds/m6ela-u7-word-relationships-and-analogies';
import { BASELINE_M6ELA_U8_INTRODUCING_A_CLAIM } from './seeds/m6ela-u8-introducing-a-claim';
import { BASELINE_M6ELA_U8_SUPPORTING_A_CLAIM_WITH_REASONS_AND_EVIDENCE } from './seeds/m6ela-u8-supporting-a-claim-with-reasons-and-evidence';
import { BASELINE_M6ELA_U8_LINKING_WORDS_FOR_CLAIMS_AND_REASONS } from './seeds/m6ela-u8-linking-words-for-claims-and-reasons';
import { BASELINE_M6ELA_U8_WRITING_A_CONCLUDING_STATEMENT } from './seeds/m6ela-u8-writing-a-concluding-statement';
import { BASELINE_M6ELA_U9_ORGANIZING_AN_INFORMATIVE_TEXT } from './seeds/m6ela-u9-organizing-an-informative-text';
import { BASELINE_M6ELA_U9_DEVELOPING_A_TOPIC_WITH_FACTS_AND_DETAILS } from './seeds/m6ela-u9-developing-a-topic-with-facts-and-details';
import { BASELINE_M6ELA_U9_TRANSITIONS_IN_INFORMATIVE_WRITING } from './seeds/m6ela-u9-transitions-in-informative-writing';
import { BASELINE_M6ELA_U9_ORIENTING_THE_READER_IN_A_NARRATIVE } from './seeds/m6ela-u9-orienting-the-reader-in-a-narrative';
import { BASELINE_M6ELA_U10_ASKING_A_RESEARCH_QUESTION } from './seeds/m6ela-u10-asking-a-research-question';
import { BASELINE_M6ELA_U10_EVALUATING_SOURCE_CREDIBILITY } from './seeds/m6ela-u10-evaluating-source-credibility';
import { BASELINE_M6ELA_U10_QUOTING_AND_PARAPHRASING_WITHOUT_PLAGIARIZING } from './seeds/m6ela-u10-quoting-and-paraphrasing-without-plagiarizing';
import { BASELINE_M6ELA_U10_GIVING_BASIC_SOURCE_INFORMATION } from './seeds/m6ela-u10-giving-basic-source-information';
import { BASELINE_M6SCI_U1_SCALE_OF_THE_SOLAR_SYSTEM } from './seeds/m6sci-u1-scale-of-the-solar-system';
import { BASELINE_M6SCI_U1_CLASSIFYING_THE_PLANETS } from './seeds/m6sci-u1-classifying-the-planets';
import { BASELINE_M6SCI_U1_GRAVITY_AND_ORBITAL_MOTION } from './seeds/m6sci-u1-gravity-and-orbital-motion';
import { BASELINE_M6SCI_U1_ASTEROIDS_COMETS_AND_OTHER_SOLAR_SYSTEM_OBJECTS } from './seeds/m6sci-u1-asteroids-comets-and-other-solar-system-objects';
import { BASELINE_M6SCI_U2_EARTHS_ROTATION_DAY_AND_NIGHT } from './seeds/m6sci-u2-earths-rotation-day-and-night';
import { BASELINE_M6SCI_U2_EARTHS_REVOLUTION_AND_THE_SEASONS } from './seeds/m6sci-u2-earths-revolution-and-the-seasons';
import { BASELINE_M6SCI_U2_PHASES_OF_THE_MOON } from './seeds/m6sci-u2-phases-of-the-moon';
import { BASELINE_M6SCI_U2_SOLAR_AND_LUNAR_ECLIPSES } from './seeds/m6sci-u2-solar-and-lunar-eclipses';
import { BASELINE_M6SCI_U3_EARTHS_LAYERED_STRUCTURE } from './seeds/m6sci-u3-earths-layered-structure';
import { BASELINE_M6SCI_U3_IDENTIFYING_MINERALS_BY_THEIR_PROPERTIES } from './seeds/m6sci-u3-identifying-minerals-by-their-properties';
import { BASELINE_M6SCI_U3_THE_THREE_ROCK_TYPES } from './seeds/m6sci-u3-the-three-rock-types';
import { BASELINE_M6SCI_U3_THE_ROCK_CYCLE } from './seeds/m6sci-u3-the-rock-cycle';
import { BASELINE_M6SCI_U4_EVIDENCE_FOR_CONTINENTAL_DRIFT } from './seeds/m6sci-u4-evidence-for-continental-drift';
import { BASELINE_M6SCI_U4_EARTHS_PLATES_AND_MANTLE_CONVECTION } from './seeds/m6sci-u4-earths-plates-and-mantle-convection';
import { BASELINE_M6SCI_U4_TYPES_OF_PLATE_BOUNDARIES } from './seeds/m6sci-u4-types-of-plate-boundaries';
import { BASELINE_M6SCI_U4_LANDFORMS_BUILT_BY_PLATE_MOTION } from './seeds/m6sci-u4-landforms-built-by-plate-motion';
import { BASELINE_M6SCI_U5_RELATIVE_DATING_AND_ROCK_LAYERS } from './seeds/m6sci-u5-relative-dating-and-rock-layers';
import { BASELINE_M6SCI_U5_ABSOLUTE_DATING_AND_THE_GEOLOGIC_TIME_SCALE } from './seeds/m6sci-u5-absolute-dating-and-the-geologic-time-scale';
import { BASELINE_M6SCI_U5_FOSSILS_AS_EVIDENCE_OF_EARTHS_HISTORY } from './seeds/m6sci-u5-fossils-as-evidence-of-earths-history';
import { BASELINE_M6SCI_U5_MASS_EXTINCTIONS_AS_TIME_MARKERS } from './seeds/m6sci-u5-mass-extinctions-as-time-markers';
import { BASELINE_M6SCI_U6_LAYERS_AND_COMPOSITION_OF_THE_ATMOSPHERE } from './seeds/m6sci-u6-layers-and-composition-of-the-atmosphere';
import { BASELINE_M6SCI_U6_AIR_MASSES_AND_FRONTS } from './seeds/m6sci-u6-air-masses-and-fronts';
import { BASELINE_M6SCI_U6_READING_WEATHER_MAPS } from './seeds/m6sci-u6-reading-weather-maps';
import { BASELINE_M6SCI_U6_HOW_AIR_MASS_INTERACTIONS_PRODUCE_SEVERE_WEATHER } from './seeds/m6sci-u6-how-air-mass-interactions-produce-severe-weather';
import { BASELINE_M6SCI_U7_EARTHS_FOUR_SPHERES_INTERACTING } from './seeds/m6sci-u7-earths-four-spheres-interacting';
import { BASELINE_M6SCI_U7_THE_WATER_CYCLE_EVAPORATION_CONDENSATION_PRECIPITATION } from './seeds/m6sci-u7-the-water-cycle-evaporation-condensation-precipitation';
import { BASELINE_M6SCI_U7_THE_WATER_CYCLE_GROUNDWATER_AND_RUNOFF } from './seeds/m6sci-u7-the-water-cycle-groundwater-and-runoff';
import { BASELINE_M6SCI_U7_WEATHERING_EROSION_AND_DEPOSITION_BY_WATER } from './seeds/m6sci-u7-weathering-erosion-and-deposition-by-water';
import { BASELINE_M6SCI_U8_WEATHER_VERSUS_CLIMATE } from './seeds/m6sci-u8-weather-versus-climate';
import { BASELINE_M6SCI_U8_WHAT_DETERMINES_A_REGIONS_CLIMATE } from './seeds/m6sci-u8-what-determines-a-regions-climate';
import { BASELINE_M6SCI_U8_HOW_OCEAN_CURRENTS_MOVE_HEAT_AROUND_THE_GLOBE } from './seeds/m6sci-u8-how-ocean-currents-move-heat-around-the-globe';
import { BASELINE_M6SCI_U8_READING_CLIMATE_GRAPHS } from './seeds/m6sci-u8-reading-climate-graphs';
import { BASELINE_M6SCI_U9_RENEWABLE_AND_NONRENEWABLE_RESOURCES } from './seeds/m6sci-u9-renewable-and-nonrenewable-resources';
import { BASELINE_M6SCI_U9_HOW_GEOLOGIC_PROCESSES_DISTRIBUTE_RESOURCES_UNEVENLY } from './seeds/m6sci-u9-how-geologic-processes-distribute-resources-unevenly';
import { BASELINE_M6SCI_U9_MAPPING_GEOLOGIC_HAZARDS } from './seeds/m6sci-u9-mapping-geologic-hazards';
import { BASELINE_M6SCI_U9_FORECASTING_AND_PREPARING_FOR_WEATHER_HAZARDS } from './seeds/m6sci-u9-forecasting-and-preparing-for-weather-hazards';
import { BASELINE_M6SCI_U10_THE_CARBON_CYCLE_IN_ROCKS_OCEAN_AND_AIR } from './seeds/m6sci-u10-the-carbon-cycle-in-rocks-ocean-and-air';
import { BASELINE_M6SCI_U10_EVIDENCE_FOR_RISING_GLOBAL_TEMPERATURES } from './seeds/m6sci-u10-evidence-for-rising-global-temperatures';
import { BASELINE_M6SCI_U10_MONITORING_AND_REDUCING_HUMAN_IMPACT_ON_EARTH_SYSTEMS } from './seeds/m6sci-u10-monitoring-and-reducing-human-impact-on-earth-systems';
import { BASELINE_M6SCI_U10_POPULATION_GROWTH_AND_RESOURCE_DEMAND } from './seeds/m6sci-u10-population-growth-and-resource-demand';
import { BASELINE_M6GEO_U1_WHAT_IS_GEOGRAPHY } from './seeds/m6geo-u1-what-is-geography';
import { BASELINE_M6GEO_U1_MENTAL_MAPS_AND_SPATIAL_THINKING } from './seeds/m6geo-u1-mental-maps-and-spatial-thinking';
import { BASELINE_M6GEO_U1_ABSOLUTE_AND_RELATIVE_LOCATION } from './seeds/m6geo-u1-absolute-and-relative-location';
import { BASELINE_M6GEO_U1_SITE_AND_SITUATION } from './seeds/m6geo-u1-site-and-situation';
import { BASELINE_M6GEO_U2_PARTS_OF_A_MAP } from './seeds/m6geo-u2-parts-of-a-map';
import { BASELINE_M6GEO_U2_TYPES_OF_MAPS } from './seeds/m6geo-u2-types-of-maps';
import { BASELINE_M6GEO_U2_CONTINENTS_AND_OCEANS } from './seeds/m6geo-u2-continents-and-oceans';
import { BASELINE_M6GEO_U2_HEMISPHERES_EQUATOR_AND_PRIME_MERIDIAN } from './seeds/m6geo-u2-hemispheres-equator-and-prime-meridian';
import { BASELINE_M6GEO_U3_LAYERS_OF_THE_EARTH } from './seeds/m6geo-u3-layers-of-the-earth';
import { BASELINE_M6GEO_U3_EARTHS_MOVING_PLATES } from './seeds/m6geo-u3-earths-moving-plates';
import { BASELINE_M6GEO_U3_THE_ROCK_CYCLE } from './seeds/m6geo-u3-the-rock-cycle';
import { BASELINE_M6GEO_U3_WEATHERING_EROSION_AND_DEPOSITION } from './seeds/m6geo-u3-weathering-erosion-and-deposition';
import { BASELINE_M6GEO_U4_MAJOR_LANDFORM_VOCABULARY } from './seeds/m6geo-u4-major-landform-vocabulary';
import { BASELINE_M6GEO_U4_COASTAL_AND_CONNECTING_LANDFORMS } from './seeds/m6geo-u4-coastal-and-connecting-landforms';
import { BASELINE_M6GEO_U4_MAJOR_WATER_FEATURE_VOCABULARY } from './seeds/m6geo-u4-major-water-feature-vocabulary';
import { BASELINE_M6GEO_U4_READING_ELEVATION_AND_RELIEF } from './seeds/m6geo-u4-reading-elevation-and-relief';
import { BASELINE_M6GEO_U5_WEATHER_VS_CLIMATE } from './seeds/m6geo-u5-weather-vs-climate';
import { BASELINE_M6GEO_U5_THE_WATER_CYCLE } from './seeds/m6geo-u5-the-water-cycle';
import { BASELINE_M6GEO_U5_WHAT_IS_A_BIOME } from './seeds/m6geo-u5-what-is-a-biome';
import { BASELINE_M6GEO_U5_ECOSYSTEMS_AND_HABITATS } from './seeds/m6geo-u5-ecosystems-and-habitats';
import { BASELINE_M6GEO_U6_RENEWABLE_AND_NONRENEWABLE_RESOURCES } from './seeds/m6geo-u6-renewable-and-nonrenewable-resources';
import { BASELINE_M6GEO_U6_RESOURCE_DISTRIBUTION_AND_ITS_EFFECTS } from './seeds/m6geo-u6-resource-distribution-and-its-effects';
import { BASELINE_M6GEO_U6_CONSERVING_NATURAL_RESOURCES } from './seeds/m6geo-u6-conserving-natural-resources';
import { BASELINE_M6GEO_U6_HOW_PEOPLE_ADAPT_TO_DIFFERENT_CLIMATES } from './seeds/m6geo-u6-how-people-adapt-to-different-climates';
import { BASELINE_M6GEO_U7_SATELLITE_IMAGES_AND_AERIAL_VIEWS } from './seeds/m6geo-u7-satellite-images-and-aerial-views';
import { BASELINE_M6GEO_U7_HOW_GPS_FINDS_YOUR_LOCATION } from './seeds/m6geo-u7-how-gps-finds-your-location';
import { BASELINE_M6GEO_U7_READING_A_THEMATIC_MAP } from './seeds/m6geo-u7-reading-a-thematic-map';
import { BASELINE_M6GEO_U7_READING_GEOGRAPHIC_GRAPHS_AND_CHARTS } from './seeds/m6geo-u7-reading-geographic-graphs-and-charts';
import { BASELINE_M6GEO_U8_WHAT_MAKES_A_PLACE_UNIQUE } from './seeds/m6geo-u8-what-makes-a-place-unique';
import { BASELINE_M6GEO_U8_HOW_PEOPLE_PERCEIVE_PLACES_DIFFERENTLY } from './seeds/m6geo-u8-how-people-perceive-places-differently';
import { BASELINE_M6GEO_U8_COMPARING_TWO_PLACES } from './seeds/m6geo-u8-comparing-two-places';
import { BASELINE_M6GEO_U8_MAPPING_YOUR_OWN_COMMUNITY } from './seeds/m6geo-u8-mapping-your-own-community';
import { BASELINE_M6GEO_U9_CONTINENTS_SUBREGIONS_AND_HOW_GEOGRAPHERS_GROUP_THEM } from './seeds/m6geo-u9-continents-subregions-and-how-geographers-group-them';
import { BASELINE_M6GEO_U9_LOCATING_THE_AMERICAS } from './seeds/m6geo-u9-locating-the-americas';
import { BASELINE_M6GEO_U9_LOCATING_EUROPE_AFRICA_AND_THE_MIDDLE_EAST } from './seeds/m6geo-u9-locating-europe-africa-and-the-middle-east';
import { BASELINE_M6GEO_U9_LOCATING_ASIA_AND_OCEANIA } from './seeds/m6geo-u9-locating-asia-and-oceania';
import { BASELINE_M6GEO_U10_GEOGRAPHIC_REASONING_IN_EVERYDAY_DECISIONS } from './seeds/m6geo-u10-geographic-reasoning-in-everyday-decisions';
import { BASELINE_M6GEO_U10_MAP_BASED_PROBLEM_SOLVING } from './seeds/m6geo-u10-map-based-problem-solving';
import { BASELINE_M6GEO_U10_HOW_PHYSICAL_GEOGRAPHY_CHANGES_OVER_TIME } from './seeds/m6geo-u10-how-physical-geography-changes-over-time';
import { BASELINE_M6GEO_U10_USING_GEOGRAPHY_TO_PLAN_A_COMMUNITY } from './seeds/m6geo-u10-using-geography-to-plan-a-community';

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
  BASELINE_AP_APUSH_NATIVE_SOCIETIES,
  BASELINE_AP_APUSH_COLUMBIAN_EXCHANGE,
  BASELINE_AP_APUSH_SPANISH_COLONIZATION,
  BASELINE_AP_APUSH_COLONIAL_REGIONS,
  BASELINE_AP_APUSH_TRANSATLANTIC_ECONOMY,
  BASELINE_AP_APUSH_SLAVERY_COLONIES,
  BASELINE_AP_APUSH_COLONIAL_SOCIETY,
  BASELINE_AP_APUSH_CAUSES_OF_REVOLUTION,
  BASELINE_AP_APUSH_REVOLUTIONARY_IDEALS,
  BASELINE_AP_APUSH_ARTICLES_OF_CONFEDERATION,
  BASELINE_AP_APUSH_CONSTITUTION_RATIFICATION,
  BASELINE_AP_APUSH_NEW_REPUBLIC,
  BASELINE_AP_APUSH_JEFFERSON_ERA,
  BASELINE_AP_APUSH_MARKET_REVOLUTION,
  BASELINE_AP_APUSH_JACKSONIAN_DEMOCRACY,
  BASELINE_AP_APUSH_REFORM_AWAKENING,
  BASELINE_AP_APUSH_SLAVERY_SOUTH,
  BASELINE_AP_APUSH_MANIFEST_DESTINY,
  BASELINE_AP_APUSH_SECTIONAL_CRISIS,
  BASELINE_AP_APUSH_SECESSION_CIVIL_WAR,
  BASELINE_AP_APUSH_EMANCIPATION,
  BASELINE_AP_APUSH_RECONSTRUCTION,
  BASELINE_AP_APUSH_THE_WEST,
  BASELINE_AP_APUSH_INDUSTRIALIZATION,
  BASELINE_AP_APUSH_LABOR,
  BASELINE_AP_APUSH_IMMIGRATION_URBANIZATION,
  BASELINE_AP_APUSH_GILDED_POLITICS_POPULISM,
  BASELINE_AP_APUSH_IMPERIALISM,
  BASELINE_AP_APUSH_PROGRESSIVISM,
  BASELINE_AP_APUSH_WWI,
  BASELINE_AP_APUSH_TWENTIES,
  BASELINE_AP_APUSH_DEPRESSION_NEW_DEAL,
  BASELINE_AP_APUSH_WWII,
  BASELINE_AP_APUSH_COLD_WAR,
  BASELINE_AP_APUSH_POSTWAR_SOCIETY,
  BASELINE_AP_APUSH_CIVIL_RIGHTS,
  BASELINE_AP_APUSH_SIXTIES_VIETNAM,
  BASELINE_AP_APUSH_SEVENTIES,
  BASELINE_AP_APUSH_CONSERVATIVE_RESURGENCE,
  BASELINE_AP_APUSH_GLOBALIZATION,
  BASELINE_AP_APUSH_SINCE_2001,
  BASELINE_AP_APWORLD_EAST_ASIA_SONG,
  BASELINE_AP_APWORLD_DAR_AL_ISLAM,
  BASELINE_AP_APWORLD_SOUTH_SOUTHEAST_ASIA,
  BASELINE_AP_APWORLD_AMERICAS_AFRICA_STATES,
  BASELINE_AP_APWORLD_MEDIEVAL_EUROPE,
  BASELINE_AP_APWORLD_SILK_ROADS,
  BASELINE_AP_APWORLD_INDIAN_OCEAN_TRADE,
  BASELINE_AP_APWORLD_TRANS_SAHARAN_TRADE,
  BASELINE_AP_APWORLD_MONGOL_EMPIRE,
  BASELINE_AP_APWORLD_CULTURAL_DIFFUSION,
  BASELINE_AP_APWORLD_EMPIRES_EXPANSION,
  BASELINE_AP_APWORLD_EMPIRES_ADMINISTRATION,
  BASELINE_AP_APWORLD_EMPIRES_BELIEF_SYSTEMS,
  BASELINE_AP_APWORLD_MARITIME_EXPLORATION,
  BASELINE_AP_APWORLD_COLUMBIAN_EXCHANGE,
  BASELINE_AP_APWORLD_MARITIME_EMPIRES,
  BASELINE_AP_APWORLD_ATLANTIC_SLAVE_TRADE,
  BASELINE_AP_APWORLD_RESISTANCE,
  BASELINE_AP_APWORLD_ENLIGHTENMENT,
  BASELINE_AP_APWORLD_ATLANTIC_REVOLUTIONS,
  BASELINE_AP_APWORLD_NATIONALISM,
  BASELINE_AP_APWORLD_INDUSTRIAL_REVOLUTION,
  BASELINE_AP_APWORLD_INDUSTRIAL_SOCIETY,
  BASELINE_AP_APWORLD_U6_IMPERIAL_EXPANSION,
  BASELINE_AP_APWORLD_U6_IMPERIAL_RESISTANCE,
  BASELINE_AP_APWORLD_U6_ECONOMIC_IMPERIALISM,
  BASELINE_AP_APWORLD_U6_GLOBAL_MIGRATION,
  BASELINE_AP_APWORLD_U6_REFORM_RESPONSES,
  BASELINE_AP_APWORLD_U7_WWI,
  BASELINE_AP_APWORLD_U7_INTERWAR,
  BASELINE_AP_APWORLD_U7_WWII,
  BASELINE_AP_APWORLD_U7_LEGACIES,
  BASELINE_AP_APWORLD_U8_COLD_WAR,
  BASELINE_AP_APWORLD_U8_DECOLONIZATION,
  BASELINE_AP_APWORLD_U8_NEW_STATES,
  BASELINE_AP_APWORLD_U8_END_COLD_WAR,
  BASELINE_AP_APWORLD_U9_GLOBAL_ECONOMY,
  BASELINE_AP_APWORLD_U9_TECHNOLOGY,
  BASELINE_AP_APWORLD_U9_ENVIRONMENT_DISEASE,
  BASELINE_AP_APWORLD_U9_CULTURE_RIGHTS,
  BASELINE_AP_APGOV_DEMOCRATIC_IDEALS,
  BASELINE_AP_APGOV_CONSTITUTION_RATIFICATION,
  BASELINE_AP_APGOV_SEPARATION_OF_POWERS,
  BASELINE_AP_APGOV_FEDERALISM,
  BASELINE_AP_APGOV_CONGRESS_STRUCTURE,
  BASELINE_AP_APGOV_PRESIDENCY_POWER,
  BASELINE_AP_APGOV_JUDICIARY_INDEPENDENCE,
  BASELINE_AP_APGOV_BUREAUCRACY_ACCOUNTABILITY,
  BASELINE_AP_APGOV_CHECKS_IN_PRACTICE,
  BASELINE_AP_APGOV_RELIGION_SPEECH,
  BASELINE_AP_APGOV_PRESS_ASSEMBLY_ARMS,
  BASELINE_AP_APGOV_DUE_PROCESS,
  BASELINE_AP_APGOV_CIVIL_RIGHTS,
  BASELINE_AP_APGOV_SOCIALIZATION_OPINION,
  BASELINE_AP_APGOV_PUBLIC_OPINION_MEASUREMENT,
  BASELINE_AP_APGOV_IDEOLOGY_POLICY,
  BASELINE_AP_APGOV_VOTING_RIGHTS_BEHAVIOR,
  BASELINE_AP_APGOV_POLITICAL_PARTIES,
  BASELINE_AP_APGOV_INTEREST_GROUPS,
  BASELINE_AP_APGOV_ELECTIONS_CAMPAIGN_FINANCE,
  BASELINE_AP_APGOV_MEDIA_LINKAGE,
  // --- AP parity build 2026-07-10: Macro / Env Sci / Psych baselines ---
  BASELINE_AP_ENVSCI_CARBON_WATER_CYCLES,
  BASELINE_AP_ENVSCI_ECOSYSTEMS_BIOMES,
  BASELINE_AP_ENVSCI_FOOD_WEBS,
  BASELINE_AP_ENVSCI_NITROGEN_PHOSPHORUS_CYCLES,
  BASELINE_AP_ENVSCI_PRODUCTIVITY_ENERGY_FLOW,
  BASELINE_AP_ENVSCI_BIODIVERSITY_ISLAND_BIOGEO,
  BASELINE_AP_ENVSCI_DISRUPTIONS_SUCCESSION,
  BASELINE_AP_ENVSCI_TOLERANCE_ADAPTATIONS,
  BASELINE_AP_ENVSCI_AGE_STRUCTURE_FERTILITY,
  BASELINE_AP_ENVSCI_CARRYING_CAPACITY_GROWTH,
  BASELINE_AP_ENVSCI_DEMOGRAPHIC_TRANSITION,
  BASELINE_AP_ENVSCI_SURVIVORSHIP_R_K,
  BASELINE_AP_ENVSCI_ATMOSPHERE_WIND,
  BASELINE_AP_ENVSCI_CLIMATE_ENSO,
  BASELINE_AP_ENVSCI_PLATE_TECTONICS_SOIL,
  BASELINE_AP_ENVSCI_WATERSHEDS_SOLAR,
  BASELINE_AP_ENVSCI_AGRICULTURE,
  BASELINE_AP_ENVSCI_COMMONS_FISHING_FOOTPRINT,
  BASELINE_AP_ENVSCI_FORESTRY_MINING,
  BASELINE_AP_ENVSCI_URBANIZATION_WATER,
  BASELINE_AP_ENVSCI_ENERGY_CONSERVATION,
  BASELINE_AP_ENVSCI_ENERGY_OVERVIEW_FOSSIL,
  BASELINE_AP_ENVSCI_NUCLEAR_BIOMASS,
  BASELINE_AP_ENVSCI_RENEWABLES,
  BASELINE_AP_ENVSCI_ACID_RAIN,
  BASELINE_AP_ENVSCI_AIR_POLLUTION_SOURCES,
  BASELINE_AP_ENVSCI_AIR_QUALITY_MITIGATION,
  BASELINE_AP_ENVSCI_SMOG_INVERSION,
  BASELINE_AP_ENVSCI_EUTROPHICATION_THERMAL,
  BASELINE_AP_ENVSCI_SOLID_WASTE,
  BASELINE_AP_ENVSCI_TOXICS_POPS_BIOMAG,
  BASELINE_AP_ENVSCI_WATER_POLLUTION_SOURCES,
  BASELINE_AP_ENVSCI_BIODIVERSITY_THREATS,
  BASELINE_AP_ENVSCI_GREENHOUSE_CLIMATE,
  BASELINE_AP_ENVSCI_OCEAN_CHANGES,
  BASELINE_AP_ENVSCI_OZONE,
  BASELINE_AP_MACRO_COMPARATIVE_ADVANTAGE,
  BASELINE_AP_MACRO_COST_BENEFIT,
  BASELINE_AP_MACRO_MARGINAL_ANALYSIS_CONSUMER,
  BASELINE_AP_MACRO_PPC,
  BASELINE_AP_MACRO_RESOURCE_ALLOCATION,
  BASELINE_AP_MACRO_SCARCITY,
  BASELINE_AP_MACRO_BUSINESS_CYCLE,
  BASELINE_AP_MACRO_CIRCULAR_FLOW_GDP,
  BASELINE_AP_MACRO_COSTS_OF_INFLATION,
  BASELINE_AP_MACRO_GDP_LIMITATIONS,
  BASELINE_AP_MACRO_PRICE_INDICES_INFLATION,
  BASELINE_AP_MACRO_REAL_VS_NOMINAL_GDP,
  BASELINE_AP_MACRO_UNEMPLOYMENT,
  BASELINE_AP_MACRO_AGGREGATE_DEMAND,
  BASELINE_AP_MACRO_AUTOMATIC_STABILIZERS,
  BASELINE_AP_MACRO_CHANGES_AD_AS_SHORT_RUN,
  BASELINE_AP_MACRO_EQUILIBRIUM_AD_AS,
  BASELINE_AP_MACRO_FISCAL_POLICY,
  BASELINE_AP_MACRO_LONG_RUN_AGGREGATE_SUPPLY,
  BASELINE_AP_MACRO_LONG_RUN_SELF_ADJUSTMENT,
  BASELINE_AP_MACRO_MULTIPLIERS,
  BASELINE_AP_MACRO_SHORT_RUN_AGGREGATE_SUPPLY,
  BASELINE_AP_MACRO_CROWDING_OUT_LONG_RUN,
  BASELINE_AP_MACRO_DEFICITS_DEBT,
  BASELINE_AP_MACRO_ECONOMIC_GROWTH,
  BASELINE_AP_MACRO_FISCAL_MONETARY_SHORT_RUN,
  BASELINE_AP_MACRO_MONEY_GROWTH_INFLATION,
  BASELINE_AP_MACRO_PHILLIPS_CURVE,
  BASELINE_AP_MACRO_PUBLIC_POLICY_GROWTH,
  BASELINE_AP_MACRO_BALANCE_OF_PAYMENTS,
  BASELINE_AP_MACRO_EXCHANGE_RATES,
  BASELINE_AP_MACRO_FX_DETERMINANTS,
  BASELINE_AP_MACRO_FX_EFFECTS_ON_ECONOMY,
  BASELINE_AP_MACRO_FX_MARKET,
  BASELINE_AP_MACRO_TRADE_CAPITAL_FLOWS,
  BASELINE_AP_PSYCH_RESEARCH_METHODS,
  BASELINE_AP_PSYCH_BRAIN_STRUCTURES,
  BASELINE_AP_PSYCH_CONSCIOUSNESS_SLEEP,
  BASELINE_AP_PSYCH_NERVOUS_ENDOCRINE,
  BASELINE_AP_PSYCH_NEURONS_NEUROTRANSMITTERS,
  BASELINE_AP_PSYCH_SENSATION_PERCEPTION,
  BASELINE_AP_PSYCH_INTELLIGENCE,
  BASELINE_AP_PSYCH_MEMORY_FORGETTING,
  BASELINE_AP_PSYCH_MEMORY_MODELS,
  BASELINE_AP_PSYCH_MEMORY_STORAGE_RETRIEVAL,
  BASELINE_AP_PSYCH_THINKING_LANGUAGE,
  BASELINE_AP_PSYCH_CLASSICAL_CONDITIONING,
  BASELINE_AP_PSYCH_COGNITIVE_DEVELOPMENT,
  BASELINE_AP_PSYCH_DEVELOPMENTAL_THEMES_METHODS,
  BASELINE_AP_PSYCH_GENDER_SEXUAL_ORIENTATION,
  BASELINE_AP_PSYCH_OBSERVATIONAL_LEARNING,
  BASELINE_AP_PSYCH_OPERANT_CONDITIONING,
  BASELINE_AP_PSYCH_SOCIAL_EMOTIONAL_MORAL,
  BASELINE_AP_PSYCH_ATTRIBUTION_ATTITUDES,
  BASELINE_AP_PSYCH_EMOTION,
  BASELINE_AP_PSYCH_MOTIVATION,
  BASELINE_AP_PSYCH_PERSONALITY_ASSESSMENT,
  BASELINE_AP_PSYCH_PERSONALITY_THEORIES,
  BASELINE_AP_PSYCH_PREJUDICE_STEREOTYPES,
  BASELINE_AP_PSYCH_SOCIAL_INFLUENCE,
  BASELINE_AP_PSYCH_ANXIETY_DISORDERS,
  BASELINE_AP_PSYCH_CLASSIFYING_DISORDERS,
  BASELINE_AP_PSYCH_MOOD_DISORDERS,
  BASELINE_AP_PSYCH_POSITIVE_PSYCHOLOGY,
  BASELINE_AP_PSYCH_SCHIZO_PERSONALITY,
  BASELINE_AP_PSYCH_STRESS_HEALTH,
  BASELINE_AP_PSYCH_THERAPY,
  // HS core: Chemistry (2026-07 wave 1)
  BASELINE_CHEM_U1_CLASSIFYING_MATTER,
  BASELINE_CHEM_U1_DENSITY_DIMENSIONAL_ANALYSIS,
  BASELINE_CHEM_U1_MEASUREMENT_SIG_FIGS,
  BASELINE_CHEM_U1_PHYSICAL_CHEMICAL_CHANGES,
  BASELINE_CHEM_U2_ATOMIC_THEORY,
  BASELINE_CHEM_U2_AVERAGE_ATOMIC_MASS,
  BASELINE_CHEM_U2_ELECTRON_CONFIGURATIONS,
  BASELINE_CHEM_U2_SUBATOMIC_PARTICLES_ISOTOPES,
  BASELINE_CHEM_U3_ION_FORMATION,
  BASELINE_CHEM_U3_PERIODIC_TABLE_ORGANIZATION,
  BASELINE_CHEM_U3_PERIODIC_TRENDS,
  BASELINE_CHEM_U4_COVALENT_BONDING_LEWIS,
  BASELINE_CHEM_U4_IONIC_BONDING,
  BASELINE_CHEM_U4_MOLECULAR_SHAPE_VSEPR,
  BASELINE_CHEM_U4_NAMING_COMPOUNDS_FORMULAS,
  BASELINE_CHEM_U4_POLARITY_INTERMOLECULAR_FORCES,
  BASELINE_CHEM_U5_BALANCING_EQUATIONS,
  BASELINE_CHEM_U5_PREDICTING_PRODUCTS_ACTIVITY,
  BASELINE_CHEM_U5_REACTION_TYPES,
  BASELINE_CHEM_U5_REDOX_INTRO,
  BASELINE_CHEM_U6_LIMITING_REACTANT_YIELD,
  BASELINE_CHEM_U6_MASS_MASS_STOICHIOMETRY,
  BASELINE_CHEM_U6_MOLE_CONVERSIONS,
  BASELINE_CHEM_U6_PERCENT_COMPOSITION_EMPIRICAL,
  BASELINE_CHEM_U6_THE_MOLE_MOLAR_MASS,
  BASELINE_CHEM_U7_GAS_LAWS,
  BASELINE_CHEM_U7_IDEAL_GAS_LAW,
  BASELINE_CHEM_U7_KINETIC_MOLECULAR_THEORY,
  BASELINE_CHEM_U7_PHASE_CHANGES_HEATING_CURVES,
  BASELINE_CHEM_U8_DILUTIONS_COLLIGATIVE,
  BASELINE_CHEM_U8_MOLARITY,
  BASELINE_CHEM_U8_SOLUTIONS_SOLUBILITY,
  BASELINE_CHEM_U9_ENDOTHERMIC_EXOTHERMIC,
  BASELINE_CHEM_U9_EQUILIBRIUM_LE_CHATELIER,
  BASELINE_CHEM_U9_REACTION_RATES_COLLISION,
  BASELINE_CHEM_U9_SPECIFIC_HEAT_CALORIMETRY,
  BASELINE_CHEM_U10_ACIDS_BASES_DEFINITIONS,
  BASELINE_CHEM_U10_NEUTRALIZATION_TITRATION,
  BASELINE_CHEM_U10_NUCLEAR_CHEMISTRY_INTRO,
  BASELINE_CHEM_U10_PH_SCALE,
  // HS core: Algebra 1 (2026-08 backfill)
  BASELINE_ALG1_U1_REAL_NUMBERS_OPERATIONS,
  BASELINE_ALG1_U1_ORDER_OF_OPERATIONS,
  BASELINE_ALG1_U1_SIMPLIFYING_EXPRESSIONS,
  BASELINE_ALG1_U1_TRANSLATING_WORDS_TO_ALGEBRA,
  BASELINE_ALG1_U2_ONE_TWO_STEP_EQUATIONS,
  BASELINE_ALG1_U2_MULTI_STEP_EQUATIONS,
  BASELINE_ALG1_U2_LITERAL_EQUATIONS,
  BASELINE_ALG1_U2_PROPORTIONS_PERCENTS,
  BASELINE_ALG1_U3_ONE_VARIABLE_INEQUALITIES,
  BASELINE_ALG1_U3_COMPOUND_INEQUALITIES,
  BASELINE_ALG1_U3_ABSOLUTE_VALUE,
  BASELINE_ALG1_U4_RELATIONS_FUNCTIONS,
  BASELINE_ALG1_U4_SLOPE_RATE_OF_CHANGE,
  BASELINE_ALG1_U4_SLOPE_INTERCEPT_FORM,
  BASELINE_ALG1_U4_POINT_SLOPE_STANDARD_FORM,
  BASELINE_ALG1_U4_PARALLEL_PERPENDICULAR,
  BASELINE_ALG1_U5_SYSTEMS_BY_GRAPHING,
  BASELINE_ALG1_U5_SYSTEMS_SUBSTITUTION,
  BASELINE_ALG1_U5_SYSTEMS_ELIMINATION,
  BASELINE_ALG1_U5_SYSTEMS_APPLICATIONS,
  BASELINE_ALG1_U6_EXPONENT_RULES,
  BASELINE_ALG1_U6_NEGATIVE_EXPONENTS_SCIENTIFIC_NOTATION,
  BASELINE_ALG1_U6_EXPONENTIAL_FUNCTIONS,
  BASELINE_ALG1_U6_EXPONENTIAL_GROWTH_DECAY,
  BASELINE_ALG1_U7_POLYNOMIAL_OPERATIONS,
  BASELINE_ALG1_U7_SPECIAL_PRODUCTS,
  BASELINE_ALG1_U7_FACTORING_GCF_GROUPING,
  BASELINE_ALG1_U7_FACTORING_TRINOMIALS,
  BASELINE_ALG1_U7_FACTORING_SPECIAL_FORMS,
  BASELINE_ALG1_U8_QUADRATIC_GRAPHS_VERTEX,
  BASELINE_ALG1_U8_SOLVING_BY_FACTORING_SQUARE_ROOTS,
  BASELINE_ALG1_U8_COMPLETING_THE_SQUARE,
  BASELINE_ALG1_U8_QUADRATIC_FORMULA_DISCRIMINANT,
  BASELINE_ALG1_U8_QUADRATIC_MODELS,
  BASELINE_ALG1_U9_SIMPLIFYING_RADICALS,
  BASELINE_ALG1_U9_RADICAL_EQUATIONS,
  BASELINE_ALG1_U9_RATIONAL_EXPRESSIONS,
  BASELINE_ALG1_U10_ONE_VARIABLE_STATISTICS,
  BASELINE_ALG1_U10_SCATTERPLOTS_TREND_LINES,
  BASELINE_ALG1_U10_SEQUENCES,
  BASELINE_GEOM_U1_POINTS_LINES_PLANES,
  BASELINE_GEOM_U1_SEGMENTS_DISTANCE_MIDPOINT,
  BASELINE_GEOM_U1_ANGLES_AND_MEASURE,
  BASELINE_GEOM_U1_ANGLE_PAIR_RELATIONSHIPS,
  BASELINE_GEOM_U2_INDUCTIVE_DEDUCTIVE_REASONING,
  BASELINE_GEOM_U2_CONDITIONAL_STATEMENTS,
  BASELINE_GEOM_U2_TWO_COLUMN_PROOFS,
  BASELINE_GEOM_U3_PARALLEL_LINES_TRANSVERSALS,
  BASELINE_GEOM_U3_PROVING_LINES_PARALLEL,
  BASELINE_GEOM_U3_SLOPES_PARALLEL_PERPENDICULAR,
  BASELINE_GEOM_U4_TRANSLATIONS,
  BASELINE_GEOM_U4_REFLECTIONS,
  BASELINE_GEOM_U4_ROTATIONS,
  BASELINE_GEOM_U4_COMPOSITIONS_SYMMETRY,
  BASELINE_GEOM_U4_CONGRUENCE_RIGID_MOTIONS,
  BASELINE_GEOM_U5_TRIANGLE_ANGLE_RELATIONSHIPS,
  BASELINE_GEOM_U5_TRIANGLE_CONGRUENCE_CRITERIA,
  BASELINE_GEOM_U5_CPCTC_PROOFS,
  BASELINE_GEOM_U5_ISOSCELES_EQUILATERAL,
  BASELINE_GEOM_U5_MIDSEGMENTS_BISECTORS_INEQUALITIES,
  BASELINE_GEOM_U6_DILATIONS_SCALE_FACTOR,
  BASELINE_GEOM_U6_SIMILAR_POLYGONS,
  BASELINE_GEOM_U6_TRIANGLE_SIMILARITY_CRITERIA,
  BASELINE_GEOM_U6_PROPORTIONALITY_THEOREMS,
  BASELINE_GEOM_U7_PYTHAGOREAN_THEOREM,
  BASELINE_GEOM_U7_SPECIAL_RIGHT_TRIANGLES,
  BASELINE_GEOM_U7_TRIG_RATIOS,
  BASELINE_GEOM_U7_SOLVING_RIGHT_TRIANGLES,
  BASELINE_GEOM_U8_POLYGON_ANGLE_SUMS,
  BASELINE_GEOM_U8_PARALLELOGRAMS,
  BASELINE_GEOM_U8_SPECIAL_PARALLELOGRAMS,
  BASELINE_GEOM_U8_TRAPEZOIDS_KITES,
  BASELINE_GEOM_U9_CIRCLE_BASICS_ARCS,
  BASELINE_GEOM_U9_CENTRAL_INSCRIBED_ANGLES,
  BASELINE_GEOM_U9_TANGENTS_SECANTS_ANGLES,
  BASELINE_GEOM_U9_CIRCLE_EQUATIONS,
  BASELINE_GEOM_U10_AREA_POLYGONS,
  BASELINE_GEOM_U10_CIRCUMFERENCE_ARC_LENGTH_SECTOR,
  BASELINE_GEOM_U10_PRISMS_CYLINDERS,
  BASELINE_GEOM_U10_PYRAMIDS_CONES_SPHERES,
  BASELINE_BIO_U1_CHARACTERISTICS_OF_LIFE,
  BASELINE_BIO_U1_SCIENTIFIC_METHOD_BIO,
  BASELINE_BIO_U1_WATER_AND_MACROMOLECULES,
  BASELINE_BIO_U1_ENZYMES,
  BASELINE_BIO_U2_CELL_THEORY_TYPES,
  BASELINE_BIO_U2_ORGANELLES,
  BASELINE_BIO_U2_CELL_MEMBRANE_STRUCTURE,
  BASELINE_BIO_U2_TRANSPORT_ACROSS_MEMBRANES,
  BASELINE_BIO_U3_ATP_AND_ENERGY,
  BASELINE_BIO_U3_PHOTOSYNTHESIS,
  BASELINE_BIO_U3_CELLULAR_RESPIRATION,
  BASELINE_BIO_U4_CELL_CYCLE_MITOSIS,
  BASELINE_BIO_U4_CELL_CYCLE_REGULATION_CANCER,
  BASELINE_BIO_U4_MEIOSIS,
  BASELINE_BIO_U4_MITOSIS_MEIOSIS_VARIATION,
  BASELINE_BIO_U5_MENDEL_LAWS,
  BASELINE_BIO_U5_PUNNETT_SQUARES_MONOHYBRID,
  BASELINE_BIO_U5_DIHYBRID_CROSSES,
  BASELINE_BIO_U5_NON_MENDELIAN_INHERITANCE,
  BASELINE_BIO_U5_PEDIGREES_HUMAN_GENETICS,
  BASELINE_BIO_U6_DNA_STRUCTURE_REPLICATION,
  BASELINE_BIO_U6_TRANSCRIPTION_TRANSLATION,
  BASELINE_BIO_U6_MUTATIONS,
  BASELINE_BIO_U6_BIOTECHNOLOGY,
  BASELINE_BIO_U7_EVIDENCE_FOR_EVOLUTION,
  BASELINE_BIO_U7_NATURAL_SELECTION,
  BASELINE_BIO_U7_POPULATION_GENETICS,
  BASELINE_BIO_U7_SPECIATION,
  BASELINE_BIO_U8_TAXONOMY_CLASSIFICATION,
  BASELINE_BIO_U8_PHYLOGENETICS_CLADOGRAMS,
  BASELINE_BIO_U8_DOMAINS_KINGDOMS_DIVERSITY,
  BASELINE_BIO_U9_ECOSYSTEMS_BIOMES,
  BASELINE_BIO_U9_ENERGY_FLOW_FOOD_WEBS,
  BASELINE_BIO_U9_BIOGEOCHEMICAL_CYCLES,
  BASELINE_BIO_U9_POPULATION_COMMUNITY_ECOLOGY,
  BASELINE_BIO_U10_HOMEOSTASIS_FEEDBACK,
  BASELINE_BIO_U10_CIRCULATORY_RESPIRATORY,
  BASELINE_BIO_U10_DIGESTIVE_EXCRETORY,
  BASELINE_BIO_U10_NERVOUS_ENDOCRINE,
  BASELINE_BIO_U10_IMMUNE_SYSTEM,
  BASELINE_ENGL_U1_PARTS_OF_SPEECH,
  BASELINE_ENGL_U1_SUBJECT_VERB_AGREEMENT,
  BASELINE_ENGL_U1_PRONOUN_AGREEMENT_CLARITY,
  BASELINE_ENGL_U1_VERB_TENSE_AND_FORM,
  BASELINE_ENGL_U2_CLAUSES_AND_PHRASES,
  BASELINE_ENGL_U2_SENTENCE_TYPES_COMBINING,
  BASELINE_ENGL_U2_FRAGMENTS_AND_RUN_ONS,
  BASELINE_ENGL_U2_MODIFIERS_AND_PARALLELISM,
  BASELINE_ENGL_U3_COMMAS,
  BASELINE_ENGL_U3_SEMICOLONS_AND_COLONS,
  BASELINE_ENGL_U3_APOSTROPHES_AND_POSSESSIVES,
  BASELINE_ENGL_U3_DASHES_PARENTHESES_QUOTATION,
  BASELINE_ENGL_U4_PRECISION_AND_CONCISION,
  BASELINE_ENGL_U4_CONNOTATION_AND_DENOTATION,
  BASELINE_ENGL_U4_TONE_AND_REGISTER,
  BASELINE_ENGL_U4_COMMONLY_CONFUSED_WORDS,
  BASELINE_ENGL_U5_CLAIMS_AND_EVIDENCE,
  BASELINE_ENGL_U5_RHETORICAL_APPEALS,
  BASELINE_ENGL_U5_LOGICAL_FALLACIES,
  BASELINE_ENGL_U5_COUNTERARGUMENT_AND_REBUTTAL,
  BASELINE_ENGL_U6_PLOT_AND_CONFLICT,
  BASELINE_ENGL_U6_CHARACTERIZATION,
  BASELINE_ENGL_U6_NARRATIVE_POINT_OF_VIEW,
  BASELINE_ENGL_U6_THEME,
  BASELINE_ENGL_U7_CENTRAL_IDEA_AND_DETAILS,
  BASELINE_ENGL_U7_AUTHORS_PURPOSE_AND_PERSPECTIVE,
  BASELINE_ENGL_U7_TEXT_STRUCTURE,
  BASELINE_ENGL_U7_INFERENCE_AND_EVIDENCE,
  BASELINE_ENGL_U8_FIGURATIVE_LANGUAGE,
  BASELINE_ENGL_U8_IMAGERY_AND_SYMBOLISM,
  BASELINE_ENGL_U8_SOUND_DEVICES,
  BASELINE_ENGL_U8_POETIC_FORM_AND_STRUCTURE,
  BASELINE_ENGL_U9_THESIS_STATEMENTS,
  BASELINE_ENGL_U9_PARAGRAPH_UNITY_AND_SUPPORT,
  BASELINE_ENGL_U9_TRANSITIONS_AND_COHESION,
  BASELINE_ENGL_U9_INTRODUCTIONS_AND_CONCLUSIONS,
  BASELINE_ENGL_U10_RESEARCH_QUESTIONS_AND_SOURCES,
  BASELINE_ENGL_U10_EVALUATING_SOURCES,
  BASELINE_ENGL_U10_QUOTING_PARAPHRASING_SUMMARIZING,
  BASELINE_ENGL_U10_CITING_AND_INTEGRATING_SOURCES,
  BASELINE_WHIST_U1_NEOLITHIC_REVOLUTION,
  BASELINE_WHIST_U1_FEATURES_OF_CIVILIZATION,
  BASELINE_WHIST_U1_MESOPOTAMIA_EGYPT,
  BASELINE_WHIST_U1_EARLY_INDIA_CHINA,
  BASELINE_WHIST_U2_CLASSICAL_GREECE,
  BASELINE_WHIST_U2_ROME_REPUBLIC_EMPIRE,
  BASELINE_WHIST_U2_CLASSICAL_INDIA_CHINA,
  BASELINE_WHIST_U2_WORLD_BELIEF_SYSTEMS,
  BASELINE_WHIST_U3_RISE_OF_ISLAM,
  BASELINE_WHIST_U3_ISLAMIC_GOLDEN_AGE,
  BASELINE_WHIST_U3_TANG_SONG_CHINA,
  BASELINE_WHIST_U3_MONGOL_EMPIRE,
  BASELINE_WHIST_U4_BYZANTINE_EMPIRE,
  BASELINE_WHIST_U4_FEUDAL_EUROPE,
  BASELINE_WHIST_U4_CHURCH_AND_CRUSADES,
  BASELINE_WHIST_U4_LATE_MIDDLE_AGES,
  BASELINE_WHIST_U5_WEST_AFRICAN_EMPIRES,
  BASELINE_WHIST_U5_EAST_AFRICA_INDIAN_OCEAN,
  BASELINE_WHIST_U5_MAYA_AZTEC,
  BASELINE_WHIST_U5_INCA_NORTH_AMERICA,
  BASELINE_WHIST_U6_RENAISSANCE,
  BASELINE_WHIST_U6_PROTESTANT_REFORMATION,
  BASELINE_WHIST_U6_AGE_OF_EXPLORATION,
  BASELINE_WHIST_U6_COLUMBIAN_EXCHANGE,
  BASELINE_WHIST_U7_SCIENTIFIC_REVOLUTION,
  BASELINE_WHIST_U7_ABSOLUTISM_CONSTITUTIONALISM,
  BASELINE_WHIST_U7_ENLIGHTENMENT,
  BASELINE_WHIST_U7_ATLANTIC_REVOLUTIONS,
  BASELINE_WHIST_U8_INDUSTRIAL_REVOLUTION,
  BASELINE_WHIST_U8_INDUSTRIAL_SOCIETY_REFORM,
  BASELINE_WHIST_U8_NATIONALISM_UNIFICATION,
  BASELINE_WHIST_U8_NEW_IMPERIALISM,
  BASELINE_WHIST_U9_WORLD_WAR_I,
  BASELINE_WHIST_U9_INTERWAR_YEARS,
  BASELINE_WHIST_U9_WORLD_WAR_II,
  BASELINE_WHIST_U9_HOLOCAUST_HUMAN_RIGHTS,
  BASELINE_WHIST_U10_COLD_WAR,
  BASELINE_WHIST_U10_DECOLONIZATION,
  BASELINE_WHIST_U10_END_OF_COLD_WAR,
  BASELINE_WHIST_U10_GLOBALIZATION,
  BASELINE_DSAT_U1_LINEAR_EQUATIONS_ONE_VAR,
  BASELINE_DSAT_U1_LINEAR_FUNCTIONS,
  BASELINE_DSAT_U1_LINEAR_EQUATIONS_TWO_VARS,
  BASELINE_DSAT_U1_SYSTEMS_OF_LINEAR_EQUATIONS,
  BASELINE_DSAT_U1_LINEAR_INEQUALITIES,
  BASELINE_DSAT_U1_EQUIVALENT_FORMS_SOLUTION_COUNTS,
  BASELINE_DSAT_U2_EQUIVALENT_EXPRESSIONS,
  BASELINE_DSAT_U2_QUADRATIC_EQUATIONS,
  BASELINE_DSAT_U2_NONLINEAR_FUNCTIONS_GRAPHS,
  BASELINE_DSAT_U2_EXPONENTIAL_FUNCTIONS,
  BASELINE_DSAT_U2_RATIONAL_RADICAL_ABSOLUTE,
  BASELINE_DSAT_U2_NONLINEAR_SYSTEMS_TRANSFORMATIONS,
  BASELINE_DSAT_U3_RATIOS_RATES_UNITS,
  BASELINE_DSAT_U3_PERCENTAGES,
  BASELINE_DSAT_U3_ONE_VARIABLE_DATA,
  BASELINE_DSAT_U3_TWO_VARIABLE_DATA,
  BASELINE_DSAT_U3_PROBABILITY,
  BASELINE_DSAT_U3_SAMPLE_STATISTICS_CLAIMS,
  BASELINE_DSAT_U4_AREA_VOLUME,
  BASELINE_DSAT_U4_LINES_ANGLES_TRIANGLES,
  BASELINE_DSAT_U4_RIGHT_TRIANGLE_TRIG,
  BASELINE_DSAT_U4_CIRCLES,
  BASELINE_DSAT_U5_CENTRAL_IDEAS_DETAILS,
  BASELINE_DSAT_U5_TEXTUAL_EVIDENCE,
  BASELINE_DSAT_U5_QUANTITATIVE_EVIDENCE,
  BASELINE_DSAT_U5_INFERENCES,
  BASELINE_DSAT_U6_WORDS_IN_CONTEXT,
  BASELINE_DSAT_U6_TEXT_STRUCTURE_PURPOSE,
  BASELINE_DSAT_U6_CROSS_TEXT_CONNECTIONS,
  BASELINE_DSAT_U7_RHETORICAL_SYNTHESIS,
  BASELINE_DSAT_U7_TRANSITIONS,
  BASELINE_DSAT_U8_BOUNDARIES,
  BASELINE_DSAT_U8_SUBJECT_VERB_PRONOUN_AGREEMENT,
  BASELINE_DSAT_U8_VERB_FORMS_MODIFIERS,
  BASELINE_DSAT_U8_PLURALS_POSSESSIVES_CONFUSABLES,
  BASELINE_ACT_U1_SENTENCE_STRUCTURE,
  BASELINE_ACT_U1_PUNCTUATION,
  BASELINE_ACT_U1_AGREEMENT,
  BASELINE_ACT_U1_VERB_TENSE_FORM,
  BASELINE_ACT_U1_MODIFIERS_PARALLELISM,
  BASELINE_ACT_U1_CONCISENESS,
  BASELINE_ACT_U1_WORD_CHOICE_TONE,
  BASELINE_ACT_U1_TRANSITIONS,
  BASELINE_ACT_U1_RHETORICAL_SKILLS,
  BASELINE_ACT_U2_PREALGEBRA_REVIEW,
  BASELINE_ACT_U2_LINEAR_EQUATIONS_INEQUALITIES,
  BASELINE_ACT_U2_SYSTEMS,
  BASELINE_ACT_U2_QUADRATICS_POLYNOMIALS,
  BASELINE_ACT_U2_FUNCTIONS_GRAPHS,
  BASELINE_ACT_U2_EXPONENTS_ROOTS_LOGS,
  BASELINE_ACT_U2_COORDINATE_GEOMETRY,
  BASELINE_ACT_U2_PLANE_GEOMETRY,
  BASELINE_ACT_U2_TRIGONOMETRY,
  BASELINE_ACT_U2_STATISTICS_PROBABILITY,
  BASELINE_ACT_U2_SEQUENCES_MATRICES_COMPLEX,
  BASELINE_ACT_U2_WORD_PROBLEMS_MODELING,
  BASELINE_ACT_U3_MAIN_IDEA_PURPOSE,
  BASELINE_ACT_U3_DETAIL_SEQUENCE,
  BASELINE_ACT_U3_INFERENCE_GENERALIZATION,
  BASELINE_ACT_U3_VOCABULARY_IN_CONTEXT,
  BASELINE_ACT_U3_PAIRED_PASSAGES,
  BASELINE_ACT_U3_READING_PACING_STRATEGY,
  BASELINE_ACT_U4_DATA_REPRESENTATION,
  BASELINE_ACT_U4_TRENDS_EXTRAPOLATION,
  BASELINE_ACT_U4_RESEARCH_SUMMARIES,
  BASELINE_ACT_U4_VARIABLES_CONTROLS,
  BASELINE_ACT_U4_CONFLICTING_VIEWPOINTS,
  BASELINE_ACT_U4_SCIENTIFIC_MATH_UNITS,
  BASELINE_ACT_U4_SCIENCE_PACING_STRATEGY,

  // Grade 7 Math (MS) — all 10 units (40 baselines).
  BASELINE_M7MATH_U1_INTEGERS_AND_ABSOLUTE_VALUE,
  BASELINE_M7MATH_U1_RATIONAL_NUMBERS_ON_THE_NUMBER_LINE,
  BASELINE_M7MATH_U1_COMPARING_AND_ORDERING_RATIONALS,
  BASELINE_M7MATH_U1_FRACTIONS_DECIMALS_PERCENTS,
  BASELINE_M7MATH_U2_ADDING_RATIONAL_NUMBERS,
  BASELINE_M7MATH_U2_SUBTRACTING_RATIONAL_NUMBERS,
  BASELINE_M7MATH_U2_MULTIPLYING_DIVIDING_RATIONAL_NUMBERS,
  BASELINE_M7MATH_U2_ORDER_OF_OPERATIONS_RATIONALS,
  BASELINE_M7MATH_U3_RATIOS_AND_UNIT_RATES,
  BASELINE_M7MATH_U3_COMPLEX_FRACTION_UNIT_RATES,
  BASELINE_M7MATH_U3_PROPORTIONAL_RELATIONSHIPS,
  BASELINE_M7MATH_U3_CONSTANT_OF_PROPORTIONALITY,
  BASELINE_M7MATH_U4_PERCENT_OF_A_NUMBER,
  BASELINE_M7MATH_U4_PERCENT_INCREASE_DECREASE,
  BASELINE_M7MATH_U4_TAX_TIP_DISCOUNT_MARKUP,
  BASELINE_M7MATH_U4_SIMPLE_INTEREST_AND_PERCENT_ERROR,
  BASELINE_M7MATH_U5_WRITING_ALGEBRAIC_EXPRESSIONS,
  BASELINE_M7MATH_U5_EVALUATING_EXPRESSIONS,
  BASELINE_M7MATH_U5_COMBINING_LIKE_TERMS,
  BASELINE_M7MATH_U5_DISTRIBUTIVE_PROPERTY_AND_FACTORING,
  BASELINE_M7MATH_U6_ONE_STEP_EQUATIONS,
  BASELINE_M7MATH_U6_TWO_STEP_EQUATIONS,
  BASELINE_M7MATH_U6_WRITING_EQUATIONS_FROM_WORD_PROBLEMS,
  BASELINE_M7MATH_U6_SOLVING_AND_GRAPHING_INEQUALITIES,
  BASELINE_M7MATH_U7_ANGLE_RELATIONSHIPS,
  BASELINE_M7MATH_U7_TRIANGLE_SIDE_AND_ANGLE_CONDITIONS,
  BASELINE_M7MATH_U7_SCALE_DRAWINGS,
  BASELINE_M7MATH_U7_CROSS_SECTIONS_OF_SOLIDS,
  BASELINE_M7MATH_U8_AREA_OF_POLYGONS,
  BASELINE_M7MATH_U8_CIRCUMFERENCE_AND_AREA_OF_CIRCLES,
  BASELINE_M7MATH_U8_SURFACE_AREA_OF_PRISMS_AND_PYRAMIDS,
  BASELINE_M7MATH_U8_VOLUME_OF_PRISMS_AND_COMPOSITE_SOLIDS,
  BASELINE_M7MATH_U9_POPULATIONS_AND_SAMPLES,
  BASELINE_M7MATH_U9_RANDOM_SAMPLING_AND_INFERENCES,
  BASELINE_M7MATH_U9_MEASURES_OF_CENTER_AND_VARIABILITY,
  BASELINE_M7MATH_U9_COMPARING_TWO_POPULATIONS,
  BASELINE_M7MATH_U10_PROBABILITY_OF_SIMPLE_EVENTS,
  BASELINE_M7MATH_U10_EXPERIMENTAL_VS_THEORETICAL_PROBABILITY,
  BASELINE_M7MATH_U10_PROBABILITY_MODELS_AND_SIMULATIONS,
  BASELINE_M7MATH_U10_COMPOUND_EVENTS,
  // MS-core — Grade 7 English Language Arts.
  BASELINE_M7ELA_U1_TEXT_EVIDENCE_AND_INFERENCE,
  BASELINE_M7ELA_U1_PLOT_STRUCTURE_AND_CONFLICT,
  BASELINE_M7ELA_U1_CHARACTERIZATION,
  BASELINE_M7ELA_U1_SETTING_AND_STORY_ELEMENTS,
  BASELINE_M7ELA_U2_THEME_AND_SUMMARY,
  BASELINE_M7ELA_U2_POINT_OF_VIEW,
  BASELINE_M7ELA_U2_FIGURATIVE_LANGUAGE,
  BASELINE_M7ELA_U2_TONE_MOOD_AND_WORD_CHOICE,
  BASELINE_M7ELA_U3_CENTRAL_IDEA_AND_SUPPORTING_DETAILS,
  BASELINE_M7ELA_U3_SUMMARIZING_INFORMATIONAL_TEXT,
  BASELINE_M7ELA_U3_TEXT_FEATURES_AND_GRAPHICS,
  BASELINE_M7ELA_U3_TECHNICAL_AND_DOMAIN_VOCABULARY,
  BASELINE_M7ELA_U4_TEXT_STRUCTURE,
  BASELINE_M7ELA_U4_AUTHORS_PURPOSE_AND_PERSPECTIVE,
  BASELINE_M7ELA_U4_TRACING_AN_ARGUMENT,
  BASELINE_M7ELA_U4_COMPARING_TWO_TEXTS,
  BASELINE_M7ELA_U5_PARTS_OF_SPEECH,
  BASELINE_M7ELA_U5_SUBJECT_VERB_AGREEMENT,
  BASELINE_M7ELA_U5_PRONOUNS_AND_ANTECEDENTS,
  BASELINE_M7ELA_U5_VERB_TENSE_CONSISTENCY,
  BASELINE_M7ELA_U6_PHRASES_AND_CLAUSES,
  BASELINE_M7ELA_U6_SENTENCE_TYPES_AND_COMBINING,
  BASELINE_M7ELA_U6_FRAGMENTS_AND_RUN_ONS,
  BASELINE_M7ELA_U6_COMMAS_AND_END_PUNCTUATION,
  BASELINE_M7ELA_U7_CONTEXT_CLUES,
  BASELINE_M7ELA_U7_ROOTS_PREFIXES_AND_SUFFIXES,
  BASELINE_M7ELA_U7_CONNOTATION_AND_DENOTATION,
  BASELINE_M7ELA_U7_COMMONLY_CONFUSED_WORDS,
  BASELINE_M7ELA_U8_CLAIMS_AND_REASONS,
  BASELINE_M7ELA_U8_EVIDENCE_AND_ELABORATION,
  BASELINE_M7ELA_U8_COUNTERCLAIMS,
  BASELINE_M7ELA_U8_ORGANIZING_AN_ARGUMENT,
  BASELINE_M7ELA_U9_INFORMATIVE_THESIS_AND_STRUCTURE,
  BASELINE_M7ELA_U9_PARAGRAPH_DEVELOPMENT,
  BASELINE_M7ELA_U9_TRANSITIONS_AND_COHESION,
  BASELINE_M7ELA_U9_NARRATIVE_TECHNIQUE,
  BASELINE_M7ELA_U10_RESEARCH_QUESTIONS,
  BASELINE_M7ELA_U10_EVALUATING_SOURCES,
  BASELINE_M7ELA_U10_QUOTING_PARAPHRASING_SUMMARIZING,
  BASELINE_M7ELA_U10_CITING_SOURCES,
  BASELINE_M7SCI_U1_CHARACTERISTICS_OF_LIVING_THINGS,
  BASELINE_M7SCI_U1_SCIENTIFIC_INVESTIGATION,
  BASELINE_M7SCI_U1_VARIABLES_AND_CONTROLS,
  BASELINE_M7SCI_U1_DATA_GRAPHS_AND_CONCLUSIONS,
  BASELINE_M7SCI_U2_CELL_THEORY_AND_MICROSCOPES,
  BASELINE_M7SCI_U2_PLANT_AND_ANIMAL_CELLS,
  BASELINE_M7SCI_U2_ORGANELLES_AND_THEIR_JOBS,
  BASELINE_M7SCI_U2_DIFFUSION_AND_OSMOSIS,
  BASELINE_M7SCI_U3_LEVELS_OF_ORGANIZATION,
  BASELINE_M7SCI_U3_DIGESTIVE_AND_CIRCULATORY_SYSTEMS,
  BASELINE_M7SCI_U3_RESPIRATORY_AND_NERVOUS_SYSTEMS,
  BASELINE_M7SCI_U3_HOMEOSTASIS,
  BASELINE_M7SCI_U4_ENERGY_FOR_LIVING_THINGS,
  BASELINE_M7SCI_U4_PHOTOSYNTHESIS,
  BASELINE_M7SCI_U4_CELLULAR_RESPIRATION,
  BASELINE_M7SCI_U4_MATTER_AND_ENERGY_IN_ORGANISMS,
  BASELINE_M7SCI_U5_CELL_DIVISION_AND_GROWTH,
  BASELINE_M7SCI_U5_ASEXUAL_AND_SEXUAL_REPRODUCTION,
  BASELINE_M7SCI_U5_PLANT_REPRODUCTION_AND_POLLINATION,
  BASELINE_M7SCI_U5_ENVIRONMENT_AND_GROWTH,
  BASELINE_M7SCI_U6_GENES_CHROMOSOMES_AND_DNA,
  BASELINE_M7SCI_U6_DOMINANT_AND_RECESSIVE_TRAITS,
  BASELINE_M7SCI_U6_PUNNETT_SQUARES,
  BASELINE_M7SCI_U6_MUTATIONS_AND_VARIATION,
  BASELINE_M7SCI_U7_FOSSILS_AND_THE_FOSSIL_RECORD,
  BASELINE_M7SCI_U7_EVIDENCE_FOR_COMMON_ANCESTRY,
  BASELINE_M7SCI_U7_NATURAL_SELECTION,
  BASELINE_M7SCI_U7_ADAPTATION_AND_ARTIFICIAL_SELECTION,
  BASELINE_M7SCI_U8_CLASSIFYING_LIVING_THINGS,
  BASELINE_M7SCI_U8_DOMAINS_AND_KINGDOMS,
  BASELINE_M7SCI_U8_USING_DICHOTOMOUS_KEYS,
  BASELINE_M7SCI_U8_CLADOGRAMS_AND_RELATEDNESS,
  BASELINE_M7SCI_U9_ECOSYSTEM_ORGANIZATION,
  BASELINE_M7SCI_U9_FOOD_CHAINS_AND_FOOD_WEBS,
  BASELINE_M7SCI_U9_CYCLES_OF_MATTER,
  BASELINE_M7SCI_U9_BIOMES_AND_HABITATS,
  BASELINE_M7SCI_U10_INTERACTIONS_BETWEEN_SPECIES,
  BASELINE_M7SCI_U10_POPULATION_CHANGES_AND_LIMITS,
  BASELINE_M7SCI_U10_ECOSYSTEM_DISRUPTION,
  BASELINE_M7SCI_U10_BIODIVERSITY_AND_HUMAN_IMPACT,
  BASELINE_M7GEO_U1_MAPS_GLOBES_AND_PROJECTIONS,
  BASELINE_M7GEO_U1_LATITUDE_LONGITUDE_AND_LOCATION,
  BASELINE_M7GEO_U1_MAP_ELEMENTS_SCALE_AND_DIRECTION,
  BASELINE_M7GEO_U1_REGIONS_AND_PLACE,
  BASELINE_M7GEO_U2_LANDFORMS_AND_WATER_FEATURES,
  BASELINE_M7GEO_U2_PLATE_TECTONICS_AND_NATURAL_HAZARDS,
  BASELINE_M7GEO_U2_WEATHER_CLIMATE_AND_FACTORS,
  BASELINE_M7GEO_U2_CLIMATE_ZONES_AND_BIOMES,
  BASELINE_M7GEO_U3_POPULATION_DISTRIBUTION_AND_DENSITY,
  BASELINE_M7GEO_U3_POPULATION_GROWTH_AND_STRUCTURE,
  BASELINE_M7GEO_U3_MIGRATION_PUSH_AND_PULL,
  BASELINE_M7GEO_U3_URBANIZATION_AND_SETTLEMENT,
  BASELINE_M7GEO_U4_WHAT_CULTURE_IS,
  BASELINE_M7GEO_U4_LANGUAGE_FAMILIES_AND_DIFFUSION,
  BASELINE_M7GEO_U4_WORLD_RELIGIONS,
  BASELINE_M7GEO_U4_CULTURAL_CHANGE_AND_GLOBALIZATION,
  BASELINE_M7GEO_U5_ECONOMIC_SYSTEMS,
  BASELINE_M7GEO_U5_RESOURCES_AND_ECONOMIC_ACTIVITY,
  BASELINE_M7GEO_U5_LEVELS_OF_DEVELOPMENT,
  BASELINE_M7GEO_U5_TRADE_AND_INTERDEPENDENCE,
  BASELINE_M7GEO_U6_TYPES_OF_GOVERNMENT,
  BASELINE_M7GEO_U6_CITIZENSHIP_AND_RIGHTS,
  BASELINE_M7GEO_U6_BORDERS_AND_CONFLICT,
  BASELINE_M7GEO_U6_INTERNATIONAL_COOPERATION,
  BASELINE_M7GEO_U7_LATIN_AMERICA_PHYSICAL_GEOGRAPHY,
  BASELINE_M7GEO_U7_LATIN_AMERICA_HISTORY_AND_CULTURE,
  BASELINE_M7GEO_U7_LATIN_AMERICA_ECONOMY_AND_CITIES,
  BASELINE_M7GEO_U7_LATIN_AMERICA_ENVIRONMENT_ISSUES,
  BASELINE_M7GEO_U8_EUROPE_PHYSICAL_GEOGRAPHY,
  BASELINE_M7GEO_U8_EUROPE_HISTORY_AND_CULTURE,
  BASELINE_M7GEO_U8_EUROPE_ECONOMY_AND_UNION,
  BASELINE_M7GEO_U8_RUSSIA_AND_EURASIA,
  BASELINE_M7GEO_U9_AFRICA_PHYSICAL_GEOGRAPHY,
  BASELINE_M7GEO_U9_AFRICA_HISTORY_AND_CULTURE,
  BASELINE_M7GEO_U9_MIDDLE_EAST_GEOGRAPHY_AND_RESOURCES,
  BASELINE_M7GEO_U9_AFRICA_MIDDLE_EAST_DEVELOPMENT,
  BASELINE_M7GEO_U10_ASIA_PHYSICAL_GEOGRAPHY,
  BASELINE_M7GEO_U10_SOUTH_AND_EAST_ASIA_CULTURE,
  BASELINE_M7GEO_U10_ASIA_POPULATION_AND_ECONOMY,
  BASELINE_M7GEO_U10_OCEANIA_AND_ANTARCTICA,
  // MS-core — Grade 6.
  BASELINE_M6MATH_U1_RATIO_LANGUAGE_AND_NOTATION,
  BASELINE_M6MATH_U1_REPRESENTING_RATIOS_WITH_TABLES_AND_DIAGRAMS,
  BASELINE_M6MATH_U1_SOLVING_MISSING_VALUE_RATIO_PROBLEMS,
  BASELINE_M6MATH_U1_UNIT_RATES_AND_UNIT_PRICING,
  BASELINE_M6MATH_U2_PERCENT_AS_RATE_PER_100,
  BASELINE_M6MATH_U2_FINDING_THE_PERCENT_OF_A_QUANTITY,
  BASELINE_M6MATH_U2_FINDING_THE_WHOLE_GIVEN_A_PART_AND_PERCENT,
  BASELINE_M6MATH_U2_CONVERTING_MEASUREMENT_UNITS,
  BASELINE_M6MATH_U3_MEANING_OF_FRACTION_DIVISION,
  BASELINE_M6MATH_U3_DIVIDING_FRACTIONS_BY_FRACTIONS,
  BASELINE_M6MATH_U3_DIVIDING_MIXED_NUMBERS,
  BASELINE_M6MATH_U3_WORD_PROBLEMS_WITH_FRACTION_DIVISION,
  BASELINE_M6MATH_U4_DIVIDING_MULTI_DIGIT_WHOLE_NUMBERS,
  BASELINE_M6MATH_U4_ADDING_AND_SUBTRACTING_DECIMALS,
  BASELINE_M6MATH_U4_MULTIPLYING_AND_DIVIDING_DECIMALS,
  BASELINE_M6MATH_U4_GCF_LCM_AND_THE_DISTRIBUTIVE_PROPERTY,
  BASELINE_M6MATH_U5_NEGATIVE_NUMBERS_IN_CONTEXT,
  BASELINE_M6MATH_U5_RATIONAL_NUMBERS_ON_THE_NUMBER_LINE,
  BASELINE_M6MATH_U5_ABSOLUTE_VALUE,
  BASELINE_M6MATH_U5_ORDERING_RATIONAL_NUMBERS,
  BASELINE_M6MATH_U6_PLOTTING_POINTS_IN_ALL_FOUR_QUADRANTS,
  BASELINE_M6MATH_U6_REFLECTING_POINTS_ACROSS_THE_AXES,
  BASELINE_M6MATH_U6_FINDING_DISTANCE_BETWEEN_POINTS,
  BASELINE_M6MATH_U6_SOLVING_REAL_WORLD_COORDINATE_PLANE_PROBLEMS,
  BASELINE_M6MATH_U7_NUMERICAL_EXPRESSIONS_WITH_EXPONENTS,
  BASELINE_M6MATH_U7_WRITING_AND_EVALUATING_ALGEBRAIC_EXPRESSIONS,
  BASELINE_M6MATH_U7_PARTS_OF_AN_EXPRESSION,
  BASELINE_M6MATH_U7_EQUIVALENT_EXPRESSIONS,
  BASELINE_M6MATH_U8_WHAT_IT_MEANS_TO_SOLVE_AN_EQUATION,
  BASELINE_M6MATH_U8_SOLVING_ONE_STEP_EQUATIONS,
  BASELINE_M6MATH_U8_WRITING_AND_GRAPHING_INEQUALITIES,
  BASELINE_M6MATH_U8_DEPENDENT_AND_INDEPENDENT_VARIABLES,
  BASELINE_M6MATH_U9_AREA_OF_TRIANGLES_AND_QUADRILATERALS,
  BASELINE_M6MATH_U9_POLYGONS_IN_THE_COORDINATE_PLANE,
  BASELINE_M6MATH_U9_VOLUME_OF_RECTANGULAR_PRISMS,
  BASELINE_M6MATH_U9_NETS_AND_SURFACE_AREA,
  BASELINE_M6MATH_U10_STATISTICAL_QUESTIONS,
  BASELINE_M6MATH_U10_DOT_PLOTS_AND_HISTOGRAMS,
  BASELINE_M6MATH_U10_MEASURES_OF_CENTER,
  BASELINE_M6MATH_U10_MEASURES_OF_SPREAD_AND_SUMMARIZING_DATA,
  BASELINE_M6ELA_U1_TEXT_EVIDENCE_AND_INFERENCE,
  BASELINE_M6ELA_U1_HOW_A_STORYS_PLOT_UNFOLDS,
  BASELINE_M6ELA_U1_HOW_CHARACTERS_RESPOND_AND_CHANGE,
  BASELINE_M6ELA_U1_HOW_A_SCENE_FITS_THE_WHOLE_STORY,
  BASELINE_M6ELA_U2_THEME_AND_OBJECTIVE_SUMMARY,
  BASELINE_M6ELA_U2_POINT_OF_VIEW_OF_THE_NARRATOR,
  BASELINE_M6ELA_U2_FIGURATIVE_LANGUAGE,
  BASELINE_M6ELA_U2_WORD_CHOICE_AND_TONE,
  BASELINE_M6ELA_U3_CENTRAL_IDEA_AND_SUPPORTING_DETAILS,
  BASELINE_M6ELA_U3_SUMMARIZING_INFORMATIONAL_TEXT,
  BASELINE_M6ELA_U3_TECHNICAL_AND_DOMAIN_VOCABULARY,
  BASELINE_M6ELA_U3_TEXT_FEATURES_AND_HOW_THEY_AID_UNDERSTANDING,
  BASELINE_M6ELA_U4_HOW_A_TEXT_IS_ORGANIZED,
  BASELINE_M6ELA_U4_AUTHORS_PURPOSE,
  BASELINE_M6ELA_U4_TRACING_AN_ARGUMENT,
  BASELINE_M6ELA_U4_COMPARING_TWO_AUTHORS_ACCOUNTS,
  BASELINE_M6ELA_U5_PRONOUN_CASE,
  BASELINE_M6ELA_U5_INTENSIVE_PRONOUNS,
  BASELINE_M6ELA_U5_KEEPING_PRONOUN_NUMBER_AND_PERSON_CONSISTENT,
  BASELINE_M6ELA_U5_STANDARD_AND_NONSTANDARD_ENGLISH,
  BASELINE_M6ELA_U6_SENTENCE_FRAGMENTS_AND_RUN_ONS,
  BASELINE_M6ELA_U6_VARYING_SENTENCE_PATTERNS_FOR_STYLE,
  BASELINE_M6ELA_U6_COMMAS_FOR_NONRESTRICTIVE_AND_PARENTHETICAL_ELEMENTS,
  BASELINE_M6ELA_U6_MAINTAINING_CONSISTENT_STYLE_AND_TONE,
  BASELINE_M6ELA_U7_CONTEXT_CLUES,
  BASELINE_M6ELA_U7_GREEK_AND_LATIN_ROOTS_AND_AFFIXES,
  BASELINE_M6ELA_U7_CONNOTATION_AND_DENOTATION,
  BASELINE_M6ELA_U7_WORD_RELATIONSHIPS_AND_ANALOGIES,
  BASELINE_M6ELA_U8_INTRODUCING_A_CLAIM,
  BASELINE_M6ELA_U8_SUPPORTING_A_CLAIM_WITH_REASONS_AND_EVIDENCE,
  BASELINE_M6ELA_U8_LINKING_WORDS_FOR_CLAIMS_AND_REASONS,
  BASELINE_M6ELA_U8_WRITING_A_CONCLUDING_STATEMENT,
  BASELINE_M6ELA_U9_ORGANIZING_AN_INFORMATIVE_TEXT,
  BASELINE_M6ELA_U9_DEVELOPING_A_TOPIC_WITH_FACTS_AND_DETAILS,
  BASELINE_M6ELA_U9_TRANSITIONS_IN_INFORMATIVE_WRITING,
  BASELINE_M6ELA_U9_ORIENTING_THE_READER_IN_A_NARRATIVE,
  BASELINE_M6ELA_U10_ASKING_A_RESEARCH_QUESTION,
  BASELINE_M6ELA_U10_EVALUATING_SOURCE_CREDIBILITY,
  BASELINE_M6ELA_U10_QUOTING_AND_PARAPHRASING_WITHOUT_PLAGIARIZING,
  BASELINE_M6ELA_U10_GIVING_BASIC_SOURCE_INFORMATION,
  BASELINE_M6SCI_U1_SCALE_OF_THE_SOLAR_SYSTEM,
  BASELINE_M6SCI_U1_CLASSIFYING_THE_PLANETS,
  BASELINE_M6SCI_U1_GRAVITY_AND_ORBITAL_MOTION,
  BASELINE_M6SCI_U1_ASTEROIDS_COMETS_AND_OTHER_SOLAR_SYSTEM_OBJECTS,
  BASELINE_M6SCI_U2_EARTHS_ROTATION_DAY_AND_NIGHT,
  BASELINE_M6SCI_U2_EARTHS_REVOLUTION_AND_THE_SEASONS,
  BASELINE_M6SCI_U2_PHASES_OF_THE_MOON,
  BASELINE_M6SCI_U2_SOLAR_AND_LUNAR_ECLIPSES,
  BASELINE_M6SCI_U3_EARTHS_LAYERED_STRUCTURE,
  BASELINE_M6SCI_U3_IDENTIFYING_MINERALS_BY_THEIR_PROPERTIES,
  BASELINE_M6SCI_U3_THE_THREE_ROCK_TYPES,
  BASELINE_M6SCI_U3_THE_ROCK_CYCLE,
  BASELINE_M6SCI_U4_EVIDENCE_FOR_CONTINENTAL_DRIFT,
  BASELINE_M6SCI_U4_EARTHS_PLATES_AND_MANTLE_CONVECTION,
  BASELINE_M6SCI_U4_TYPES_OF_PLATE_BOUNDARIES,
  BASELINE_M6SCI_U4_LANDFORMS_BUILT_BY_PLATE_MOTION,
  BASELINE_M6SCI_U5_RELATIVE_DATING_AND_ROCK_LAYERS,
  BASELINE_M6SCI_U5_ABSOLUTE_DATING_AND_THE_GEOLOGIC_TIME_SCALE,
  BASELINE_M6SCI_U5_FOSSILS_AS_EVIDENCE_OF_EARTHS_HISTORY,
  BASELINE_M6SCI_U5_MASS_EXTINCTIONS_AS_TIME_MARKERS,
  BASELINE_M6SCI_U6_LAYERS_AND_COMPOSITION_OF_THE_ATMOSPHERE,
  BASELINE_M6SCI_U6_AIR_MASSES_AND_FRONTS,
  BASELINE_M6SCI_U6_READING_WEATHER_MAPS,
  BASELINE_M6SCI_U6_HOW_AIR_MASS_INTERACTIONS_PRODUCE_SEVERE_WEATHER,
  BASELINE_M6SCI_U7_EARTHS_FOUR_SPHERES_INTERACTING,
  BASELINE_M6SCI_U7_THE_WATER_CYCLE_EVAPORATION_CONDENSATION_PRECIPITATION,
  BASELINE_M6SCI_U7_THE_WATER_CYCLE_GROUNDWATER_AND_RUNOFF,
  BASELINE_M6SCI_U7_WEATHERING_EROSION_AND_DEPOSITION_BY_WATER,
  BASELINE_M6SCI_U8_WEATHER_VERSUS_CLIMATE,
  BASELINE_M6SCI_U8_WHAT_DETERMINES_A_REGIONS_CLIMATE,
  BASELINE_M6SCI_U8_HOW_OCEAN_CURRENTS_MOVE_HEAT_AROUND_THE_GLOBE,
  BASELINE_M6SCI_U8_READING_CLIMATE_GRAPHS,
  BASELINE_M6SCI_U9_RENEWABLE_AND_NONRENEWABLE_RESOURCES,
  BASELINE_M6SCI_U9_HOW_GEOLOGIC_PROCESSES_DISTRIBUTE_RESOURCES_UNEVENLY,
  BASELINE_M6SCI_U9_MAPPING_GEOLOGIC_HAZARDS,
  BASELINE_M6SCI_U9_FORECASTING_AND_PREPARING_FOR_WEATHER_HAZARDS,
  BASELINE_M6SCI_U10_THE_CARBON_CYCLE_IN_ROCKS_OCEAN_AND_AIR,
  BASELINE_M6SCI_U10_EVIDENCE_FOR_RISING_GLOBAL_TEMPERATURES,
  BASELINE_M6SCI_U10_MONITORING_AND_REDUCING_HUMAN_IMPACT_ON_EARTH_SYSTEMS,
  BASELINE_M6SCI_U10_POPULATION_GROWTH_AND_RESOURCE_DEMAND,
  BASELINE_M6GEO_U1_WHAT_IS_GEOGRAPHY,
  BASELINE_M6GEO_U1_MENTAL_MAPS_AND_SPATIAL_THINKING,
  BASELINE_M6GEO_U1_ABSOLUTE_AND_RELATIVE_LOCATION,
  BASELINE_M6GEO_U1_SITE_AND_SITUATION,
  BASELINE_M6GEO_U2_PARTS_OF_A_MAP,
  BASELINE_M6GEO_U2_TYPES_OF_MAPS,
  BASELINE_M6GEO_U2_CONTINENTS_AND_OCEANS,
  BASELINE_M6GEO_U2_HEMISPHERES_EQUATOR_AND_PRIME_MERIDIAN,
  BASELINE_M6GEO_U3_LAYERS_OF_THE_EARTH,
  BASELINE_M6GEO_U3_EARTHS_MOVING_PLATES,
  BASELINE_M6GEO_U3_THE_ROCK_CYCLE,
  BASELINE_M6GEO_U3_WEATHERING_EROSION_AND_DEPOSITION,
  BASELINE_M6GEO_U4_MAJOR_LANDFORM_VOCABULARY,
  BASELINE_M6GEO_U4_COASTAL_AND_CONNECTING_LANDFORMS,
  BASELINE_M6GEO_U4_MAJOR_WATER_FEATURE_VOCABULARY,
  BASELINE_M6GEO_U4_READING_ELEVATION_AND_RELIEF,
  BASELINE_M6GEO_U5_WEATHER_VS_CLIMATE,
  BASELINE_M6GEO_U5_THE_WATER_CYCLE,
  BASELINE_M6GEO_U5_WHAT_IS_A_BIOME,
  BASELINE_M6GEO_U5_ECOSYSTEMS_AND_HABITATS,
  BASELINE_M6GEO_U6_RENEWABLE_AND_NONRENEWABLE_RESOURCES,
  BASELINE_M6GEO_U6_RESOURCE_DISTRIBUTION_AND_ITS_EFFECTS,
  BASELINE_M6GEO_U6_CONSERVING_NATURAL_RESOURCES,
  BASELINE_M6GEO_U6_HOW_PEOPLE_ADAPT_TO_DIFFERENT_CLIMATES,
  BASELINE_M6GEO_U7_SATELLITE_IMAGES_AND_AERIAL_VIEWS,
  BASELINE_M6GEO_U7_HOW_GPS_FINDS_YOUR_LOCATION,
  BASELINE_M6GEO_U7_READING_A_THEMATIC_MAP,
  BASELINE_M6GEO_U7_READING_GEOGRAPHIC_GRAPHS_AND_CHARTS,
  BASELINE_M6GEO_U8_WHAT_MAKES_A_PLACE_UNIQUE,
  BASELINE_M6GEO_U8_HOW_PEOPLE_PERCEIVE_PLACES_DIFFERENTLY,
  BASELINE_M6GEO_U8_COMPARING_TWO_PLACES,
  BASELINE_M6GEO_U8_MAPPING_YOUR_OWN_COMMUNITY,
  BASELINE_M6GEO_U9_CONTINENTS_SUBREGIONS_AND_HOW_GEOGRAPHERS_GROUP_THEM,
  BASELINE_M6GEO_U9_LOCATING_THE_AMERICAS,
  BASELINE_M6GEO_U9_LOCATING_EUROPE_AFRICA_AND_THE_MIDDLE_EAST,
  BASELINE_M6GEO_U9_LOCATING_ASIA_AND_OCEANIA,
  BASELINE_M6GEO_U10_GEOGRAPHIC_REASONING_IN_EVERYDAY_DECISIONS,
  BASELINE_M6GEO_U10_MAP_BASED_PROBLEM_SOLVING,
  BASELINE_M6GEO_U10_HOW_PHYSICAL_GEOGRAPHY_CHANGES_OVER_TIME,
  BASELINE_M6GEO_U10_USING_GEOGRAPHY_TO_PLAN_A_COMMUNITY,
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
