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
