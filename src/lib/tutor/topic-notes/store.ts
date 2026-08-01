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
