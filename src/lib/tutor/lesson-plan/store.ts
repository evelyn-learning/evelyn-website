/**
 * Lesson plan storage. Reads/writes the LessonPlan collection plus the
 * seed plans bundled in `seeds/` (which are queryable without DB hits —
 * useful for the demo site running without the partner-content pipeline).
 *
 * The `find*` functions return seeds first, then DB results, deduped by
 * id. This way the seeds are always available and DB-stored partner
 * plans extend the catalog.
 */

import connectDB from '@/lib/db';
import { LessonPlanModel, toLessonPlan } from '@/models/LessonPlan';
import type { LessonPlan } from './types';
import { parseLessonPlan } from './parser';

import { SEED_G6_FRACTIONS_ADD_UNLIKE } from './seeds/g6-fractions-add-unlike';
import { SEED_K_COUNTING_TO_10 } from './seeds/k-counting-to-10';
import { SEED_G2_PLACE_VALUE } from './seeds/g2-place-value';
import { SEED_G4_MULTIPLICATION_AS_ARRAYS } from './seeds/g4-multiplication-as-arrays';
import { SEED_G8_LINEAR_EQUATIONS } from './seeds/g8-linear-equations';
import { SEED_G9_SYSTEMS_OF_EQUATIONS } from './seeds/g9-systems-of-equations';
import { SEED_G9_PYTHAGOREAN } from './seeds/g9-pythagorean';
import { SEED_G10_RIGHT_TRIANGLE_TRIG } from './seeds/g10-right-triangle-trig';
import { SEED_G11_UNIT_CIRCLE } from './seeds/g11-unit-circle';
import { SEED_G12_DERIVATIVE_INTUITION } from './seeds/g12-derivative-intuition';
// Batch 3 — Science K-12 kickoff (one plan per grade band as proof-of-quality;
// remaining ~106 science plans queued in TRACKER.md).
import { SEED_K2_SCI_PUSH_PULL } from './seeds/k2-sci-push-pull';
import { SEED_G3_SCI_FORCES_MOTION } from './seeds/g3-sci-forces-motion';
import { SEED_G6_SCI_CELLS } from './seeds/g6-sci-cells';
import { SEED_BIO_CELL_THEORY_STRUCTURE } from './seeds/bio-cell-theory-structure';
// Batch 3 continued — 12 more Science plans across grade bands.
import { SEED_K2_SCI_SUNLIGHT_WEATHER } from './seeds/k2-sci-sunlight-weather';
import { SEED_K2_SCI_PLANT_NEEDS } from './seeds/k2-sci-plant-needs';
import { SEED_K2_SCI_STATES_OF_MATTER } from './seeds/k2-sci-states-of-matter';
import { SEED_G3_SCI_LIFE_CYCLES } from './seeds/g3-sci-life-cycles';
import { SEED_G4_SCI_ENERGY_TRANSFER } from './seeds/g4-sci-energy-transfer';
import { SEED_G5_SCI_PHOTOSYNTHESIS_BASICS } from './seeds/g5-sci-photosynthesis-basics';
import { SEED_G7_SCI_GENETICS_PUNNETT } from './seeds/g7-sci-genetics-punnett';
import { SEED_G7_SCI_PLATE_TECTONICS } from './seeds/g7-sci-plate-tectonics';
import { SEED_G8_SCI_NEWTONS_LAWS } from './seeds/g8-sci-newtons-laws';
import { SEED_CHEM_ATOMIC_STRUCTURE } from './seeds/chem-atomic-structure';
import { SEED_PHYS_KINEMATICS_1D } from './seeds/phys-kinematics-1d';
import { SEED_BIO_CELLULAR_RESPIRATION } from './seeds/bio-cellular-respiration';
// Batch 3 K-2 Science completion (8 more — finishes K-2 Science cluster).
import { SEED_K2_SCI_ANIMAL_NEEDS } from './seeds/k2-sci-animal-needs';
import { SEED_K2_SCI_SOUND_VIBRATIONS } from './seeds/k2-sci-sound-vibrations';
import { SEED_K2_SCI_LIGHT_SHADOWS } from './seeds/k2-sci-light-shadows';
import { SEED_K2_SCI_REVERSIBLE_CHANGES } from './seeds/k2-sci-reversible-changes';
import { SEED_K2_SCI_HABITATS } from './seeds/k2-sci-habitats';
import { SEED_K2_SCI_EARTH_MATERIALS } from './seeds/k2-sci-earth-materials';
import { SEED_K2_SCI_DAY_NIGHT_SKY } from './seeds/k2-sci-day-night-sky';
import { SEED_K2_SCI_WEATHER_SEASONS } from './seeds/k2-sci-weather-seasons';
// Grades 3-5 Science completion.
import { SEED_G3_SCI_MAGNETS_ELECTRICITY } from './seeds/g3-sci-magnets-electricity';
import { SEED_G3_SCI_INHERITANCE_TRAITS } from './seeds/g3-sci-inheritance-traits';
import { SEED_G3_SCI_WEATHER_CLIMATE } from './seeds/g3-sci-weather-climate';
import { SEED_G3_SCI_ADAPTATIONS } from './seeds/g3-sci-adaptations';
import { SEED_G4_SCI_WAVES_INTRO } from './seeds/g4-sci-waves-intro';
import { SEED_G4_SCI_INFORMATION_TRANSFER } from './seeds/g4-sci-information-transfer';
import { SEED_G4_SCI_PLANT_ANIMAL_STRUCTURES } from './seeds/g4-sci-plant-animal-structures';
import { SEED_G4_SCI_EARTH_FEATURES } from './seeds/g4-sci-earth-features';
import { SEED_G4_SCI_NATURAL_HAZARDS } from './seeds/g4-sci-natural-hazards';
import { SEED_G5_SCI_MATTER_PROPERTIES } from './seeds/g5-sci-matter-properties';
import { SEED_G5_SCI_MIXTURES_SOLUTIONS } from './seeds/g5-sci-mixtures-solutions';
import { SEED_G5_SCI_ENERGY_FOOD_CHAINS } from './seeds/g5-sci-energy-food-chains';
import { SEED_G5_SCI_EARTH_SYSTEMS } from './seeds/g5-sci-earth-systems';
import { SEED_G5_SCI_SOLAR_SYSTEM } from './seeds/g5-sci-solar-system';
// HS Bio additions.
import { SEED_BIO_CELL_MEMBRANE_TRANSPORT } from './seeds/bio-cell-membrane-transport';
import { SEED_BIO_PHOTOSYNTHESIS_DEEP } from './seeds/bio-photosynthesis-deep';
import { SEED_BIO_CELL_CYCLE_MITOSIS } from './seeds/bio-cell-cycle-mitosis';
import { SEED_BIO_MEIOSIS_SEXUAL_REPRO } from './seeds/bio-meiosis-sexual-repro';
import { SEED_BIO_MENDELIAN_GENETICS } from './seeds/bio-mendelian-genetics';
import { SEED_BIO_DNA_STRUCTURE_REPLICATION } from './seeds/bio-dna-structure-replication';
import { SEED_BIO_PROTEIN_SYNTHESIS } from './seeds/bio-protein-synthesis';
import { SEED_BIO_MUTATIONS_GENETIC_ENG } from './seeds/bio-mutations-genetic-eng';
import { SEED_BIO_NATURAL_SELECTION_EVOL } from './seeds/bio-natural-selection-evol';
import { SEED_BIO_SPECIATION_PHYLOGENY } from './seeds/bio-speciation-phylogeny';
import { SEED_BIO_ECOLOGY_POPULATIONS } from './seeds/bio-ecology-populations';
import { SEED_BIO_ECOSYSTEMS_CYCLES } from './seeds/bio-ecosystems-cycles';
import { SEED_BIO_HUMAN_CIRC_RESP } from './seeds/bio-human-circ-resp';
import { SEED_BIO_HUMAN_NERV_ENDO } from './seeds/bio-human-nerv-endo';
import { SEED_BIO_HUMAN_IMMUNE_DIGEST } from './seeds/bio-human-immune-digest';
import { SEED_BIO_BIOTECH_ETHICS } from './seeds/bio-biotech-ethics';
import { SEED_CHEM_ELECTRON_CONFIG } from './seeds/chem-electron-config';
import { SEED_CHEM_PERIODIC_TRENDS } from './seeds/chem-periodic-trends';
import { SEED_CHEM_IONIC_BONDING } from './seeds/chem-ionic-bonding';
import { SEED_CHEM_COVALENT_BONDING_LEWIS } from './seeds/chem-covalent-bonding-lewis';
import { SEED_CHEM_MOLECULAR_GEOMETRY_VSEPR } from './seeds/chem-molecular-geometry-vsepr';
import { SEED_CHEM_NAMING_COMPOUNDS } from './seeds/chem-naming-compounds';
import { SEED_CHEM_MOLE_STOICHIOMETRY } from './seeds/chem-mole-stoichiometry';
import { SEED_CHEM_BALANCING_EQUATIONS } from './seeds/chem-balancing-equations';
import { SEED_CHEM_REACTIONS_TYPES } from './seeds/chem-reactions-types';
import { SEED_CHEM_GAS_LAWS } from './seeds/chem-gas-laws';
import { SEED_CHEM_SOLUTIONS_CONCENTRATION } from './seeds/chem-solutions-concentration';
import { SEED_CHEM_ACIDS_BASES_PH } from './seeds/chem-acids-bases-ph';
import { SEED_CHEM_THERMOCHEMISTRY } from './seeds/chem-thermochemistry';
import { SEED_CHEM_KINETICS } from './seeds/chem-kinetics';
import { SEED_CHEM_EQUILIBRIUM } from './seeds/chem-equilibrium';
import { SEED_CHEM_REDOX } from './seeds/chem-redox';
import { SEED_CHEM_ORGANIC_INTRO } from './seeds/chem-organic-intro';
import { SEED_PHYS_KINEMATICS_2D_PROJECTILE } from './seeds/phys-kinematics-2d-projectile';
import { SEED_PHYS_NEWTONS_FIRST_LAW } from './seeds/phys-newtons-first-law';
import { SEED_PHYS_NEWTONS_SECOND_LAW } from './seeds/phys-newtons-second-law';
import { SEED_PHYS_NEWTONS_THIRD_LAW } from './seeds/phys-newtons-third-law';
import { SEED_PHYS_FRICTION } from './seeds/phys-friction';
import { SEED_PHYS_WORK_ENERGY } from './seeds/phys-work-energy';
import { SEED_PHYS_CONSERVATION_ENERGY } from './seeds/phys-conservation-energy';
import { SEED_PHYS_MOMENTUM_COLLISIONS } from './seeds/phys-momentum-collisions';
import { SEED_PHYS_CIRCULAR_MOTION } from './seeds/phys-circular-motion';
import { SEED_PHYS_GRAVITATION } from './seeds/phys-gravitation';
import { SEED_PHYS_SIMPLE_HARMONIC_MOTION } from './seeds/phys-simple-harmonic-motion';
import { SEED_PHYS_WAVES_SOUND } from './seeds/phys-waves-sound';
import { SEED_PHYS_LIGHT_OPTICS } from './seeds/phys-light-optics';
import { SEED_PHYS_ELECTRIC_CHARGE_COULOMB } from './seeds/phys-electric-charge-coulomb';
import { SEED_PHYS_CIRCUITS_OHMS_LAW } from './seeds/phys-circuits-ohms-law';
import { SEED_PHYS_MAGNETISM } from './seeds/phys-magnetism';
import { SEED_PHYS_EM_INDUCTION } from './seeds/phys-em-induction';
import { SEED_PHYS_MODERN_INTRO } from './seeds/phys-modern-intro';
import { SEED_PHYS_SPECIAL_RELATIVITY_INTRO } from './seeds/phys-special-relativity-intro';
import { SEED_K_COUNTING_TO_100 } from './seeds/k-counting-to-100';
import { SEED_K_SHAPES_2D } from './seeds/k-shapes-2d';
import { SEED_G1_ADD_WITHIN_20 } from './seeds/g1-add-within-20';
import { SEED_G1_SUBTRACT_WITHIN_20 } from './seeds/g1-subtract-within-20';
import { SEED_G2_ADD_SUBTRACT_WITHIN_100 } from './seeds/g2-add-subtract-within-100';
import { SEED_G3_MATH_MULTIPLICATION_INTRO } from './seeds/g3-math-multiplication-intro';
import { SEED_G3_MATH_DIVISION_INTRO } from './seeds/g3-math-division-intro';
import { SEED_G3_MATH_FRACTIONS_INTRO } from './seeds/g3-math-fractions-intro';
import { SEED_G3_MATH_AREA_PERIMETER } from './seeds/g3-math-area-perimeter';
import { SEED_G3_MATH_TIME_MONEY } from './seeds/g3-math-time-money';
import { SEED_G4_MATH_MULTI_DIGIT_MULTIPLICATION } from './seeds/g4-math-multi-digit-multiplication';
import { SEED_G4_MATH_LONG_DIVISION } from './seeds/g4-math-long-division';
import { SEED_G4_MATH_EQUIVALENT_FRACTIONS } from './seeds/g4-math-equivalent-fractions';
import { SEED_G4_MATH_DECIMALS_INTRO } from './seeds/g4-math-decimals-intro';
import { SEED_G4_MATH_FACTORS_MULTIPLES } from './seeds/g4-math-factors-multiples';
import { SEED_G5_MATH_DECIMAL_OPERATIONS } from './seeds/g5-math-decimal-operations';
import { SEED_G5_MATH_FRACTION_OPERATIONS } from './seeds/g5-math-fraction-operations';
import { SEED_G5_MATH_VOLUME } from './seeds/g5-math-volume';
import { SEED_G5_MATH_COORDINATE_PLANE } from './seeds/g5-math-coordinate-plane';
import { SEED_G5_MATH_ORDER_OF_OPERATIONS } from './seeds/g5-math-order-of-operations';
import { SEED_G6_MATH_RATIOS_RATES } from './seeds/g6-math-ratios-rates';
import { SEED_G6_MATH_PERCENT } from './seeds/g6-math-percent';
import { SEED_G6_MATH_INTEGERS } from './seeds/g6-math-integers';
import { SEED_G6_MATH_EXPRESSIONS_VARIABLES } from './seeds/g6-math-expressions-variables';
import { SEED_G7_MATH_PROPORTIONAL_RELATIONSHIPS } from './seeds/g7-math-proportional-relationships';
import { SEED_G7_MATH_INTEGER_OPERATIONS } from './seeds/g7-math-integer-operations';
import { SEED_G7_MATH_ONE_STEP_EQUATIONS } from './seeds/g7-math-one-step-equations';
import { SEED_G7_MATH_TWO_STEP_EQUATIONS } from './seeds/g7-math-two-step-equations';
import { SEED_G7_MATH_DISTRIBUTIVE_COMBINE } from './seeds/g7-math-distributive-combine';
import { SEED_G8_MATH_FUNCTIONS_INTRO } from './seeds/g8-math-functions-intro';
import { SEED_G8_MATH_SLOPE_LINEAR_FUNCTIONS } from './seeds/g8-math-slope-linear-functions';
import { SEED_G8_MATH_EXPONENTS_SCIENTIFIC_NOTATION } from './seeds/g8-math-exponents-scientific-notation';
import { SEED_G8_MATH_TRANSFORMATIONS } from './seeds/g8-math-transformations';
import { SEED_G8_MATH_SQUARE_ROOTS_IRRATIONALS } from './seeds/g8-math-square-roots-irrationals';
import { SEED_G9_ALG1_POLYNOMIALS_INTRO } from './seeds/g9-alg1-polynomials-intro';
import { SEED_G9_ALG1_FACTORING } from './seeds/g9-alg1-factoring';
import { SEED_G9_ALG1_QUADRATICS_INTRO } from './seeds/g9-alg1-quadratics-intro';
import { SEED_G9_ALG1_EXPONENTIAL_FUNCTIONS } from './seeds/g9-alg1-exponential-functions';
import { SEED_G9_ALG1_INEQUALITIES } from './seeds/g9-alg1-inequalities';
import { SEED_G10_GEOM_ANGLE_RELATIONSHIPS } from './seeds/g10-geom-angle-relationships';
import { SEED_G10_GEOM_TRIANGLE_CONGRUENCE } from './seeds/g10-geom-triangle-congruence';
import { SEED_G10_GEOM_SIMILARITY } from './seeds/g10-geom-similarity';
import { SEED_G10_GEOM_CIRCLES } from './seeds/g10-geom-circles';
import { SEED_G10_GEOM_VOLUME_SOLIDS } from './seeds/g10-geom-volume-solids';
import { SEED_G11_ALG2_QUADRATIC_FORMULA } from './seeds/g11-alg2-quadratic-formula';
import { SEED_G11_ALG2_LOGARITHMS } from './seeds/g11-alg2-logarithms';
import { SEED_G11_ALG2_RATIONAL_FUNCTIONS } from './seeds/g11-alg2-rational-functions';
import { SEED_G11_ALG2_SEQUENCES_SERIES } from './seeds/g11-alg2-sequences-series';
import { SEED_G11_PRECALC_TRIG_IDENTITIES } from './seeds/g11-precalc-trig-identities';
import { SEED_G3_ELA_MAIN_IDEA } from './seeds/g3-ela-main-idea';
import { SEED_G3_ELA_CONTEXT_CLUES } from './seeds/g3-ela-context-clues';
import { SEED_G3_ELA_STORY_ELEMENTS } from './seeds/g3-ela-story-elements';
import { SEED_G3_ELA_PARTS_OF_SPEECH } from './seeds/g3-ela-parts-of-speech';
import { SEED_G3_ELA_OPINION_WRITING } from './seeds/g3-ela-opinion-writing';
import { SEED_G4_ELA_INFERENCE } from './seeds/g4-ela-inference';
import { SEED_G4_ELA_THEME_LESSON } from './seeds/g4-ela-theme-lesson';
import { SEED_G4_ELA_SENTENCE_STRUCTURE } from './seeds/g4-ela-sentence-structure';
import { SEED_G5_ELA_SUMMARIZING } from './seeds/g5-ela-summarizing';
import { SEED_G5_ELA_NARRATIVE_WRITING } from './seeds/g5-ela-narrative-writing';
import { SEED_G6_ELA_TEXTUAL_EVIDENCE } from './seeds/g6-ela-textual-evidence';
import { SEED_G6_ELA_ARGUMENT_WRITING } from './seeds/g6-ela-argument-writing';
import { SEED_G7_ELA_AUTHOR_PURPOSE_POV } from './seeds/g7-ela-author-purpose-pov';
import { SEED_G7_ELA_FIGURATIVE_LANGUAGE } from './seeds/g7-ela-figurative-language';
import { SEED_G8_ELA_THESIS_STATEMENTS } from './seeds/g8-ela-thesis-statements';
import { SEED_G3_SS_MAPS_GLOBES } from './seeds/g3-ss-maps-globes';
import { SEED_G4_SS_BRANCHES_OF_GOVERNMENT } from './seeds/g4-ss-branches-of-government';
import { SEED_G6_SS_ANCIENT_EGYPT } from './seeds/g6-ss-ancient-egypt';
import { SEED_G8_SS_AMERICAN_REVOLUTION } from './seeds/g8-ss-american-revolution';
import { SEED_G9_SS_CONSTITUTION_BILL_OF_RIGHTS } from './seeds/g9-ss-constitution-bill-of-rights';
import { SEED_SAT_MATH_HEART_OF_ALGEBRA } from './seeds/sat-math-heart-of-algebra';
import { SEED_SAT_MATH_PROBLEM_SOLVING_DATA } from './seeds/sat-math-problem-solving-data';
import { SEED_SAT_READING_EVIDENCE } from './seeds/sat-reading-evidence';
import { SEED_SAT_WRITING_GRAMMAR } from './seeds/sat-writing-grammar';
import { SEED_SAT_TEST_STRATEGY } from './seeds/sat-test-strategy';
import { SEED_G11_ELA_LITERARY_ANALYSIS } from './seeds/g11-ela-literary-analysis';
import { SEED_G11_ELA_RESEARCH_WRITING } from './seeds/g11-ela-research-writing';
import { SEED_G11_ELA_RHETORICAL_ANALYSIS } from './seeds/g11-ela-rhetorical-analysis';
import { SEED_G9_ELA_ESSAY_STRUCTURE } from './seeds/g9-ela-essay-structure';
import { SEED_G12_CALC_LIMITS } from './seeds/g12-calc-limits';
import { SEED_G12_CALC_DERIVATIVE_RULES } from './seeds/g12-calc-derivative-rules';
import { SEED_G12_CALC_APPLICATIONS } from './seeds/g12-calc-applications';
import { SEED_G12_CALC_INTEGRATION_INTRO } from './seeds/g12-calc-integration-intro';
import { SEED_G11_STATS_DESCRIPTIVE } from './seeds/g11-stats-descriptive';
import { SEED_G11_STATS_NORMAL_DISTRIBUTION } from './seeds/g11-stats-normal-distribution';
import { SEED_G11_STATS_PROBABILITY } from './seeds/g11-stats-probability';
import { SEED_G11_STATS_SAMPLING } from './seeds/g11-stats-sampling';
import { SEED_G11_STATS_CORRELATION_REGRESSION } from './seeds/g11-stats-correlation-regression';
import { SEED_G7_SS_ANCIENT_GREECE } from './seeds/g7-ss-ancient-greece';
import { SEED_G7_SS_ROMAN_EMPIRE } from './seeds/g7-ss-roman-empire';
import { SEED_G7_SS_MIDDLE_AGES } from './seeds/g7-ss-middle-ages';
import { SEED_G7_SS_RENAISSANCE } from './seeds/g7-ss-renaissance';
import { SEED_G8_SS_INDUSTRIAL_REVOLUTION } from './seeds/g8-ss-industrial-revolution';
import { SEED_G8_SS_CIVIL_WAR } from './seeds/g8-ss-civil-war';
import { SEED_G8_SS_FRENCH_REVOLUTION } from './seeds/g8-ss-french-revolution';
import { SEED_G10_SS_WORLD_WAR_1 } from './seeds/g10-ss-world-war-1';
import { SEED_G10_SS_WORLD_WAR_2 } from './seeds/g10-ss-world-war-2';
import { SEED_G11_SS_COLD_WAR } from './seeds/g11-ss-cold-war';
import { SEED_G11_SS_CIVIL_RIGHTS_MOVEMENT } from './seeds/g11-ss-civil-rights-movement';
import { SEED_G11_ECON_SUPPLY_DEMAND } from './seeds/g11-econ-supply-demand';
import { SEED_G11_ECON_GDP_INFLATION } from './seeds/g11-econ-gdp-inflation';
import { SEED_G11_ECON_FISCAL_MONETARY } from './seeds/g11-econ-fiscal-monetary';
import { SEED_G11_ECON_MARKET_STRUCTURES } from './seeds/g11-econ-market-structures';
import { SEED_G11_SS_ELECTIONS_VOTING } from './seeds/g11-ss-elections-voting';
import { SEED_ACT_ENGLISH } from './seeds/act-english';
import { SEED_ACT_MATH } from './seeds/act-math';
import { SEED_ACT_READING } from './seeds/act-reading';
import { SEED_ACT_SCIENCE } from './seeds/act-science';
import { SEED_G2_ELA_PHONICS_DECODING } from './seeds/g2-ela-phonics-decoding';
// Grades 6-8 Science completion.
import { SEED_G6_SCI_BODY_SYSTEMS_INTRO } from './seeds/g6-sci-body-systems-intro';
import { SEED_G6_SCI_ECOSYSTEMS } from './seeds/g6-sci-ecosystems';
import { SEED_G6_SCI_CLIMATE_WEATHER } from './seeds/g6-sci-climate-weather';
import { SEED_G6_SCI_ATOMS_ELEMENTS } from './seeds/g6-sci-atoms-elements';
import { SEED_G6_SCI_DENSITY_BUOYANCY } from './seeds/g6-sci-density-buoyancy';
import { SEED_G6_SCI_HEAT_TRANSFER } from './seeds/g6-sci-heat-transfer';
import { SEED_G6_SCI_EARTH_INTERIOR } from './seeds/g6-sci-earth-interior';
import { SEED_G7_SCI_EVOLUTION_SELECTION } from './seeds/g7-sci-evolution-selection';
import { SEED_G7_SCI_GEOLOGIC_TIME } from './seeds/g7-sci-geologic-time';
import { SEED_G7_SCI_CHEMICAL_REACTIONS_INTRO } from './seeds/g7-sci-chemical-reactions-intro';
import { SEED_G7_SCI_PERIODIC_TABLE_INTRO } from './seeds/g7-sci-periodic-table-intro';
import { SEED_G7_SCI_CONSERVATION_MASS } from './seeds/g7-sci-conservation-mass';
import { SEED_G7_SCI_BODY_SYSTEMS_DEEP } from './seeds/g7-sci-body-systems-deep';
import { SEED_G8_SCI_FORCES_ENERGY } from './seeds/g8-sci-forces-energy';
import { SEED_G8_SCI_WAVE_PROPERTIES } from './seeds/g8-sci-wave-properties';
import { SEED_G8_SCI_SOUND_LIGHT } from './seeds/g8-sci-sound-light';
import { SEED_G8_SCI_ELECTRICITY } from './seeds/g8-sci-electricity';
import { SEED_G8_SCI_SOLAR_SYSTEM_BEYOND } from './seeds/g8-sci-solar-system-beyond';
import { SEED_G8_SCI_CLIMATE_CHANGE } from './seeds/g8-sci-climate-change';
import { SEED_G8_SCI_ENGINEERING_DESIGN } from './seeds/g8-sci-engineering-design';
// Batch 25 — K-2 ELA foundations.
import { SEED_K_ELA_LETTER_SOUNDS } from './seeds/k-ela-letter-sounds';
import { SEED_K_ELA_SIGHT_WORDS } from './seeds/k-ela-sight-words';
import { SEED_G1_ELA_PHONICS_BLENDS } from './seeds/g1-ela-phonics-blends';
import { SEED_G1_ELA_FLUENCY } from './seeds/g1-ela-fluency';
import { SEED_G1_ELA_CAPITALIZATION } from './seeds/g1-ela-capitalization';
import { SEED_G2_ELA_SPELLING_PATTERNS } from './seeds/g2-ela-spelling-patterns';
// Batch 26 — K-2 SS + math gaps.
import { SEED_K2_SS_COMMUNITY_HELPERS } from './seeds/k2-ss-community-helpers';
import { SEED_K2_SS_FAMILIES_CULTURES } from './seeds/k2-ss-families-cultures';
import { SEED_K2_SS_CONTINENTS_OCEANS } from './seeds/k2-ss-continents-oceans';
import { SEED_G1_MATH_TIME_TO_HOUR } from './seeds/g1-math-time-to-hour';
import { SEED_G1_MATH_MEASUREMENT_LENGTH } from './seeds/g1-math-measurement-length';
import { SEED_G2_MATH_MONEY_COINS } from './seeds/g2-math-money-coins';
// Batch 27 — G3-G5 SS expansion + math fillers.
import { SEED_G3_SS_COMMUNITIES } from './seeds/g3-ss-communities';
import { SEED_G4_SS_US_REGIONS } from './seeds/g4-ss-us-regions';
import { SEED_G5_SS_EXPLORERS_COLONIZATION } from './seeds/g5-ss-explorers-colonization';
import { SEED_G5_SS_THIRTEEN_COLONIES } from './seeds/g5-ss-thirteen-colonies';
import { SEED_G6_MATH_GCF_LCM } from './seeds/g6-math-gcf-lcm';
import { SEED_G7_MATH_INEQUALITIES } from './seeds/g7-math-inequalities';
import { SEED_G11_ALG2_COMPLEX_NUMBERS } from './seeds/g11-alg2-complex-numbers';
import { SEED_G11_ALG2_CONIC_SECTIONS } from './seeds/g11-alg2-conic-sections';
import { SEED_G11_ALG2_MATRICES_INTRO } from './seeds/g11-alg2-matrices-intro';
// Batch 28 — Higher-grade SS, AP math/stats, math/ELA/sci fillers.
import { SEED_G8_SS_IMMIGRATION_INDUSTRIAL } from './seeds/g8-ss-immigration-industrial';
import { SEED_G8_SS_PROGRESSIVE_ERA } from './seeds/g8-ss-progressive-era';
import { SEED_G8_SS_WESTWARD_EXPANSION } from './seeds/g8-ss-westward-expansion';
import { SEED_G11_SS_GREAT_DEPRESSION_NEW_DEAL } from './seeds/g11-ss-great-depression-new-deal';
import { SEED_G11_SS_COLD_WAR_PROXIES } from './seeds/g11-ss-cold-war-ext';
import { SEED_G11_ECON_TRADE_GLOBALIZATION } from './seeds/g11-econ-trade-globalization';
import { SEED_G7_SS_MESOPOTAMIA } from './seeds/g7-ss-mesopotamia';
import { SEED_G7_SS_ANCIENT_CHINA } from './seeds/g7-ss-ancient-china';
import { SEED_G7_SS_ANCIENT_INDIA } from './seeds/g7-ss-ancient-india';
import { SEED_G9_CIVICS_THREE_BRANCHES } from './seeds/g9-civics-three-branches';
import { SEED_G8_ELA_CITING_EVIDENCE } from './seeds/g8-ela-citing-evidence';
import { SEED_G10_ELA_RHETORICAL_DEVICES } from './seeds/g10-ela-rhetorical-devices';
import { SEED_G9_ELA_ACTIVE_PASSIVE } from './seeds/g9-ela-active-passive';
import { SEED_G6_ELA_ACTIVE_LISTENING } from './seeds/g6-ela-active-listening-discussion';
import { SEED_G5_ELA_POETRY_INTRO } from './seeds/g5-ela-poetry-intro';
import { SEED_G11_ELA_POETRY_ANALYSIS } from './seeds/g11-ela-poetry-analysis';
import { SEED_AP_CALC_FUNDAMENTAL_THEOREM } from './seeds/ap-calc-fundamental-theorem';
import { SEED_AP_CALC_RELATED_RATES } from './seeds/ap-calc-related-rates';
import { SEED_AP_STATS_HYPOTHESIS_TESTING } from './seeds/ap-stats-hypothesis-testing';
import { SEED_G4_MATH_ANGLE_MEASUREMENT } from './seeds/g4-math-angle-measurement';
import { SEED_G3_MATH_ROUNDING } from './seeds/g3-math-rounding';
import { SEED_G6_MATH_COORDINATE_QUADRANTS } from './seeds/g6-math-coordinate-quadrants';
import { SEED_G7_MATH_PERCENT_APPLICATIONS } from './seeds/g7-math-percent-applications';
import { SEED_G6_SCI_ROCKS_MINERALS } from './seeds/g6-sci-rocks-minerals';
import { SEED_G4_SCI_EROSION_WEATHERING } from './seeds/g4-sci-erosion-weathering';
import { SEED_G6_SCI_WATER_CYCLE } from './seeds/g6-sci-water-cycle';
import { SEED_G4_SCI_CIRCUITS_INTRO } from './seeds/g4-sci-circuits-intro';
// Batch 29 — AP courses + advanced ELA + middle science.
import { SEED_AP_BIO_CELL_SIGNALING } from './seeds/ap-bio-cell-signaling';
import { SEED_AP_USH_RECONSTRUCTION } from './seeds/ap-ush-reconstruction';
import { SEED_AP_CHEM_REACTION_RATES } from './seeds/ap-chem-reaction-rates';
import { SEED_G9_ALG1_GRAPHING_FUNCTIONS } from './seeds/g9-alg1-graphing-functions';
import { SEED_G8_MATH_VOLUME_SURFACE_AREA } from './seeds/g8-math-volume-surface-area';
import { SEED_G7_ELA_CONTEXT_VOCAB } from './seeds/g7-ela-context-vocab';
import { SEED_G6_SCI_ENERGY_FORMS } from './seeds/g6-sci-energy-forms';
import { SEED_G8_SCI_CHEMISTRY_INTRO } from './seeds/g8-sci-chemistry-intro';
import { SEED_G11_ELA_RESEARCH_CITATION } from './seeds/g11-ela-research-citation';
import { SEED_G8_SS_CIVICS_RIGHTS } from './seeds/g8-ss-civics-rights-responsibilities';
import { SEED_G5_SCI_CLASSIFICATION } from './seeds/g5-sci-classification';
import { SEED_G11_ELA_SYNTAX_STYLE } from './seeds/g11-ela-syntax-style';
import { SEED_G7_SCI_ENERGY_FLOW_ECOSYSTEMS } from './seeds/g7-sci-energy-flow-ecosystems';
// Batch 30 — More AP, more K-2 foundations, more world history.
import { SEED_AP_WORLD_FRENCH_REVOLUTION_DEEP } from './seeds/ap-world-french-revolution-deep';
import { SEED_G4_ELA_PREFIXES_SUFFIXES } from './seeds/g4-ela-prefixes-suffixes';
import { SEED_G3_MATH_ELAPSED_TIME } from './seeds/g3-math-elapsed-time';
import { SEED_G11_STATS_CONFIDENCE_INTERVALS } from './seeds/g11-stats-confidence-intervals';
import { SEED_G4_ELA_PARAGRAPH_STRUCTURE } from './seeds/g4-ela-paragraph-structure';
import { SEED_G6_SS_BYZANTINE_ISLAMIC } from './seeds/g6-ss-byzantine-islamic';
import { SEED_G8_SCI_GENETICS_HEREDITY } from './seeds/g8-sci-genetics-heredity';
import { SEED_G10_ELA_SHAKESPEARE_INTRO } from './seeds/g10-ela-shakespeare-intro';
import { SEED_G6_SS_FEUDALISM } from './seeds/g6-ss-feudalism';
import { SEED_G7_MATH_VOLUME_PRISMS_PYRAMIDS } from './seeds/g7-math-volume-prisms-pyramids';
import { SEED_K_MATH_SHAPES_3D } from './seeds/k-math-shapes-3d';
import { SEED_K2_SCI_MAGNETISM_INTRO } from './seeds/k2-sci-magnetism-intro';
// Batch 31 — More AP physics, ELA depth, civics, K-2.
import { SEED_AP_PHYSICS_NEWTONS_SECOND_DEEP } from './seeds/ap-physics-newtons-second-deep';
import { SEED_G3_ELA_DIALOGUE_PUNCTUATION } from './seeds/g3-ela-dialogue-punctuation';
import { SEED_G6_ELA_FIGURATIVE_LANGUAGE } from './seeds/g6-ela-figurative-language';
import { SEED_G6_MATH_AREA_COMPOSITE } from './seeds/g6-math-area-composite';
import { SEED_G7_SCI_NEWTON_LAWS_BRIDGE } from './seeds/g7-sci-newton-laws-bridge';
import { SEED_G3_ELA_PREFIXES } from './seeds/g3-ela-prefixes';
import { SEED_G11_SS_SUPREME_COURT_CASES } from './seeds/g11-ss-supreme-court-cases';
import { SEED_G4_MATH_LINE_PLOTS_DATA } from './seeds/g4-math-line-plots-data';
// Batch 32 — More elementary, MS, AP supplements.
import { SEED_G2_ELA_COMPREHENSION_STRATEGIES } from './seeds/g2-ela-comprehension-strategies';
import { SEED_G5_MATH_DIVISIBILITY_RULES } from './seeds/g5-math-divisibility-rules';
import { SEED_G8_ELA_TONE_MOOD } from './seeds/g8-ela-tone-mood';
import { SEED_G7_SS_AGE_OF_EXPLORATION_DEEP } from './seeds/g7-ss-age-of-exploration-deep';
import { SEED_G3_SCI_STATES_OF_MATTER } from './seeds/g3-sci-states-of-matter';
import { SEED_G11_ECON_STOCK_MARKET_BASICS } from './seeds/g11-econ-stock-market-basics';
import { SEED_G6_MATH_STATISTICS_INTRO } from './seeds/g6-math-statistics-intro';
import { SEED_G7_MATH_PROBABILITY_BASICS } from './seeds/g7-math-probability-basics';
import { SEED_G11_BIO_EVOLUTION_EVIDENCE } from './seeds/g11-bio-evolution-evidence';
// Batch 33 — Civil War causes, photosynthesis deep, modern world.
import { SEED_G8_SS_CIVIL_WAR_CAUSES } from './seeds/g8-ss-civil-war-causes';
import { SEED_AP_BIO_PHOTOSYNTHESIS_DEEP } from './seeds/g11-bio-photosynthesis-deep';
import { SEED_K_MATH_COUNTING_OBJECTS } from './seeds/k-math-counting-objects';
import { SEED_G7_ELA_SUMMARY_PRECIS } from './seeds/g7-ela-summary-precis';
import { SEED_G11_SS_GLOBALIZATION_MODERN } from './seeds/g11-ss-globalization-modern';
import { SEED_G8_MATH_BIVARIATE_DATA } from './seeds/g8-math-bivariate-data';
import { SEED_SAT_ACT_ESSAY_STRATEGY } from './seeds/sat-act-essay-strategy';
import { SEED_G5_SCI_WATER_CYCLE } from './seeds/g5-sci-water-cycle';
// Batch 34 — High-impact AP completion + foundational fillers.
import { SEED_AP_CALC_OPTIMIZATION } from './seeds/ap-calc-optimization';
import { SEED_AP_CALC_LHOPITAL } from './seeds/ap-calc-lhopital';
import { SEED_AP_CALC_VOLUMES_REVOLUTION } from './seeds/ap-calc-volumes-revolution';
import { SEED_AP_BIO_CELLULAR_RESPIRATION_DEEP } from './seeds/ap-bio-cellular-respiration-deep';
import { SEED_AP_BIO_HARDY_WEINBERG } from './seeds/ap-bio-hardy-weinberg';
import { SEED_AP_STATS_CHI_SQUARE } from './seeds/ap-stats-chi-square';
import { SEED_AP_STATS_REGRESSION_INFERENCE } from './seeds/ap-stats-regression-inference';
import { SEED_AP_USH_COLONIAL_PURITANS } from './seeds/ap-ush-colonial-puritans';
import { SEED_AP_USH_JACKSONIAN } from './seeds/ap-ush-jacksonian';
import { SEED_AP_USH_1920S } from './seeds/ap-ush-1920s-jazz-age';
import { SEED_AP_USH_CIVIL_RIGHTS_DEEP } from './seeds/ap-ush-civil-rights-deep';
import { SEED_AP_WORLD_MONGOL_EMPIRE } from './seeds/ap-world-mongol-empire';
import { SEED_AP_WORLD_IMPERIALISM } from './seeds/ap-world-imperialism';
import { SEED_AP_WORLD_WWI_CAUSES } from './seeds/ap-world-wwi-causes';
import { SEED_K2_SCI_FIVE_SENSES } from './seeds/k2-sci-five-senses';
import { SEED_K_MATH_CALENDAR_TIME } from './seeds/k-math-calendar-time';
import { SEED_K2_SS_NEEDS_WANTS } from './seeds/k2-ss-needs-wants';
import { SEED_G2_MATH_EVEN_ODD } from './seeds/g2-math-even-odd';
import { SEED_G2_ELA_CONTRACTIONS } from './seeds/g2-ela-contractions';
import { SEED_G3_MATH_MULTIPLICATION_FLUENCY } from './seeds/g3-math-multiplication-fluency';
import { SEED_G3_MATH_WORD_PROBLEMS_STRATEGY } from './seeds/g3-math-word-problems-strategy';
import { SEED_G4_MATH_MIXED_NUMBERS } from './seeds/g4-math-mixed-numbers';
import { SEED_G7_ELA_COUNTERCLAIM } from './seeds/g7-ela-counterclaim';
import { SEED_G8_ELA_THEME_ANALYSIS } from './seeds/g8-ela-theme-analysis';
import { SEED_AP_LANG_ARGUMENT_ESSAY } from './seeds/ap-lang-argument-essay';
import { SEED_AP_LANG_SYNTHESIS_ESSAY } from './seeds/ap-lang-synthesis-essay';
// Batch 35 — Test prep pipeline + remaining AP gaps.
import { SEED_GRE_QUANT_STRATEGY } from './seeds/gre-quant-strategy';
import { SEED_GRE_VERBAL_STRATEGY } from './seeds/gre-verbal-strategy';
import { SEED_GRE_ANALYTICAL_WRITING } from './seeds/gre-analytical-writing';
import { SEED_GMAT_QUANT_STRATEGY } from './seeds/gmat-quant-strategy';
import { SEED_GMAT_VERBAL_STRATEGY } from './seeds/gmat-verbal-strategy';
import { SEED_SSAT_ISEE_STRATEGY } from './seeds/ssat-isee-strategy';
import { SEED_AP_TEST_STRATEGY } from './seeds/ap-test-strategy';
import { SEED_AP_CALC_BC_PARAMETRIC } from './seeds/ap-calc-bc-parametric';
import { SEED_AP_CALC_BC_POLAR } from './seeds/ap-calc-bc-polar';
import { SEED_AP_CALC_BC_SERIES_CONVERGENCE } from './seeds/ap-calc-bc-series-convergence';
import { SEED_AP_CALC_BC_TAYLOR_SERIES } from './seeds/ap-calc-bc-taylor-series';
import { SEED_AP_PHYSICS2_FLUIDS } from './seeds/ap-physics2-fluids';
import { SEED_AP_PHYSICS2_THERMO } from './seeds/ap-physics2-thermo';
import { SEED_AP_PHYSICS2_ELECTROSTATICS } from './seeds/ap-physics2-electrostatics';
import { SEED_AP_PHYSICS2_OPTICS } from './seeds/ap-physics2-optics';
import { SEED_AP_PSYCH_LEARNING } from './seeds/ap-psych-learning';
import { SEED_AP_PSYCH_MEMORY } from './seeds/ap-psych-memory';
import { SEED_AP_PSYCH_DEVELOPMENT } from './seeds/ap-psych-development';
import { SEED_AP_HUMAN_GEO_POPULATION } from './seeds/ap-human-geo-population';
import { SEED_AP_HUMAN_GEO_AGRICULTURE } from './seeds/ap-human-geo-agriculture';
import { SEED_AP_GOV_FEDERALISM } from './seeds/ap-gov-federalism';
import { SEED_AP_GOV_POLITICAL_PARTIES } from './seeds/ap-gov-political-parties';
import { SEED_AP_CHEM_THERMODYNAMICS } from './seeds/ap-chem-thermodynamics';
import { SEED_AP_CHEM_BUFFERS_TITRATION } from './seeds/ap-chem-buffers-titration';
import { SEED_AP_BIO_POPULATION_ECOLOGY } from './seeds/ap-bio-population-ecology';
import { SEED_AP_BIO_SPECIATION } from './seeds/ap-bio-speciation';
// Batch 36 — AP CS, more AP Stats/Physics 2/Psych/Geo + Micro/Macro.
import { SEED_AP_CSP_DATA_BINARY } from './seeds/ap-csp-data-binary';
import { SEED_AP_CSP_ALGORITHMS_ABSTRACTION } from './seeds/ap-csp-algorithms-abstraction';
import { SEED_AP_CSA_OBJECTS_CLASSES } from './seeds/ap-csa-objects-classes';
import { SEED_AP_CSA_ARRAYS_LOOPS } from './seeds/ap-csa-arrays-loops';
import { SEED_AP_STATS_TWO_SAMPLE_TESTS } from './seeds/ap-stats-two-sample-tests';
import { SEED_AP_PHYSICS2_CIRCUITS } from './seeds/ap-physics2-circuits';
import { SEED_AP_PHYSICS2_MAGNETISM } from './seeds/ap-physics2-magnetism';
import { SEED_AP_PHYSICS2_MODERN } from './seeds/ap-physics2-modern';
import { SEED_AP_PSYCH_COGNITION } from './seeds/ap-psych-cognition';
import { SEED_AP_PSYCH_SOCIAL } from './seeds/ap-psych-social';
import { SEED_AP_PSYCH_BIOLOGICAL } from './seeds/ap-psych-biological';
import { SEED_AP_HUMAN_GEO_URBAN } from './seeds/ap-human-geo-urban';
import { SEED_AP_HUMAN_GEO_POLITICAL } from './seeds/ap-human-geo-political';
import { SEED_AP_MICRO_PPC } from './seeds/ap-micro-ppc';
import { SEED_AP_MICRO_EXTERNALITIES } from './seeds/ap-micro-externalities';
import { SEED_AP_MACRO_AD_AS } from './seeds/ap-macro-ad-as';
import { SEED_AP_MACRO_MONEY_BANKING } from './seeds/ap-macro-money-banking';
// Batch 37 — AP ES, music, art history, professional tests, more world/lit.
import { SEED_AP_ENV_SCI_ECOSYSTEMS } from './seeds/ap-env-sci-ecosystems';
import { SEED_AP_ENV_SCI_CLIMATE_CHANGE } from './seeds/ap-env-sci-climate-change';
import { SEED_AP_ENV_SCI_POLLUTION } from './seeds/ap-env-sci-pollution';
import { SEED_AP_MUSIC_THEORY_FUNDAMENTALS } from './seeds/ap-music-theory-fundamentals';
import { SEED_AP_MUSIC_CHORDS_PROGRESSIONS } from './seeds/ap-music-chords-progressions';
import { SEED_AP_ART_HISTORY_ANALYSIS } from './seeds/ap-art-history-analysis';
import { SEED_AP_ART_HISTORY_MODERN } from './seeds/ap-art-history-modern';
import { SEED_MCAT_STRATEGY } from './seeds/mcat-strategy';
import { SEED_LSAT_STRATEGY } from './seeds/lsat-strategy';
import { SEED_NCLEX_STRATEGY } from './seeds/nclex-strategy';
import { SEED_G7_SS_RENAISSANCE_REFORMATION } from './seeds/g7-ss-renaissance-reformation';
import { SEED_G8_SS_INDUSTRIAL_REVOLUTION_DEEP } from './seeds/g8-ss-industrial-revolution-deep';
import { SEED_AP_LIT_PROSE_ANALYSIS } from './seeds/ap-lit-prose-analysis';
import { SEED_AP_LIT_Q3_ESSAY } from './seeds/ap-lit-q3-essay';
import { SEED_AP_SPANISH_STRATEGY } from './seeds/ap-spanish-strategy';
// Batch 38 — AP Physics 1 expansion (kinematics through waves).
import { SEED_AP_PHYS1_KINEMATICS } from './seeds/ap-phys1-kinematics';
import { SEED_AP_PHYS1_ENERGY_CONSERVATION } from './seeds/ap-phys1-energy-conservation';
import { SEED_AP_PHYS1_MOMENTUM } from './seeds/ap-phys1-momentum';
import { SEED_AP_PHYS1_ROTATION } from './seeds/ap-phys1-rotation';
import { SEED_AP_PHYS1_SHM } from './seeds/ap-phys1-shm';
import { SEED_AP_PHYS1_WAVES } from './seeds/ap-phys1-waves';
import { SEED_AP_PHYS1_CIRCULAR_GRAVITATION } from './seeds/ap-phys1-circular-gravitation';
// Batch 51 — AP Physics 1 Unit 8 (Fluids), added by College Board for May 2025+ exam.
// Currency-checked against the 2025-26 CED (Kinematics, Force, Energy, Momentum,
// Torque/Rotation, Energy/Momentum of Rotating Systems, Oscillations, Fluids).
// Cross-referenced with Khan Academy + Fiveable Unit 8 study guide for topic
// breakdown, common misconceptions, and worked-example coverage.
import { SEED_AP_PHYS1_FLUIDS_DENSITY_PRESSURE } from './seeds/ap-phys1-fluids-density-pressure';
import { SEED_AP_PHYS1_FLUIDS_BUOYANCY } from './seeds/ap-phys1-fluids-buoyancy';
import { SEED_AP_PHYS1_FLUIDS_FLOW } from './seeds/ap-phys1-fluids-flow';
// Batch 52 — AP Pre-Calculus full course (College Board added 2023-24).
// Currency-checked against the 2025-26 CED (4 units; Units 1-3 tested,
// Unit 4 optional). Cross-referenced with the AP Pre-Calc Course
// Framework PDF + Fiveable Unit summaries.
import { SEED_AP_PRECALC_POLYNOMIAL_RATIONAL } from './seeds/ap-precalc-polynomial-rational';
import { SEED_AP_PRECALC_EXPONENTIAL_LOGARITHMIC } from './seeds/ap-precalc-exponential-logarithmic';
import { SEED_AP_PRECALC_TRIGONOMETRIC_POLAR } from './seeds/ap-precalc-trigonometric-polar';
import { SEED_AP_PRECALC_PARAMETRIC_VECTORS_MATRICES } from './seeds/ap-precalc-parametric-vectors-matrices';
// Batch 53 — NCLEX-NGN (Next Generation NCLEX, launched April 2023).
// Currency-checked against NCSBN test-plan + UWorld + Kaplan briefs.
// Covers the new item types and the Clinical Judgment Measurement Model.
import { SEED_NCLEX_NGN_OVERVIEW } from './seeds/nclex-ngn-overview';
import { SEED_NCLEX_NGN_CASE_STUDIES } from './seeds/nclex-ngn-case-studies';
import { SEED_NCLEX_NGN_STANDALONE_ITEMS } from './seeds/nclex-ngn-standalone-items';
// Batch 54 — Digital SAT (US format since March 2024).
// Currency-checked against College Board SAT Suite + Bluebook docs +
// cross-referenced with Piqosity / IvyMax / Test Ninjas guides for
// module-adaptive routing rules and per-section domain breakdowns.
import { SEED_DIGITAL_SAT_FORMAT_OVERVIEW } from './seeds/digital-sat-format-overview';
import { SEED_DIGITAL_SAT_READING_WRITING_DOMAINS } from './seeds/digital-sat-reading-writing-domains';
import { SEED_DIGITAL_SAT_MATH_DOMAINS } from './seeds/digital-sat-math-domains';
// Batch 55 — AP CSP exam restructure (May 2024+ format).
// Currency-checked against College Board AP CSP page + AP Digital
// Portfolio submission docs. Create PT was reformatted (not removed):
// students submit a PPR by April 30, then answer 2 WR questions on
// exam day in Section 2. Exam:Create-PT score split is 70:30.
import { SEED_AP_CSP_EXAM_FORMAT } from './seeds/ap-csp-exam-format';
import { SEED_AP_CSP_CREATE_PT } from './seeds/ap-csp-create-pt';
// Batch 56 — GMAT Focus Edition (replaced GMAT Classic Feb 2024).
// Currency-checked against mba.com (GMAC) + e-GMAT + Yocket Focus
// Edition guides. AWA + IR + Sentence Correction + Geometry all
// removed; Data Insights is the new section absorbing Data Sufficiency.
// Score scale changed to 205-805.
import { SEED_GMAT_FOCUS_FORMAT_OVERVIEW } from './seeds/gmat-focus-format-overview';
import { SEED_GMAT_FOCUS_DATA_INSIGHTS } from './seeds/gmat-focus-data-insights';
import { SEED_GMAT_FOCUS_QUANT_VERBAL } from './seeds/gmat-focus-quant-verbal';
// Batch 57 — LSAT post-August 2024 format (Logic Games removed).
// Currency-checked against LSAC's Aug 2024 announcement + Princeton
// Review and U.S. News coverage of the change.
import { SEED_LSAT_FORMAT_2024 } from './seeds/lsat-format-2024';
import { SEED_LSAT_LOGICAL_REASONING } from './seeds/lsat-logical-reasoning';
import { SEED_LSAT_READING_COMPREHENSION } from './seeds/lsat-reading-comprehension';
// Batch 58 — GRE General Test shortened format (Sept 22, 2023).
// Currency-checked against ETS test-structure page + Booster / Yocket /
// Wizako guides. Test now ~1h 58m (was ~3h 45m); 1 essay (was 2);
// 27 V + 27 Q questions (was ~40 each); no unscored experimental
// section. Section-level adaptive routing preserved.
import { SEED_GRE_SHORTENED_FORMAT } from './seeds/gre-shortened-format';
import { SEED_GRE_SHORTENED_VERBAL } from './seeds/gre-shortened-verbal';
import { SEED_GRE_SHORTENED_QUANT } from './seeds/gre-shortened-quant';
// Batch 59 — JEE Main 2025-26 (NTA reorganized syllabus + pattern).
// Currency-checked against NTA's 2025 syllabus PDF + CollegeDekho /
// iibedu coverage. Two big changes: Section B is now mandatory
// (no more 10-pick-5) and carries -1 negative marking on numericals;
// syllabus reduced 25-35% with whole chapters cut from Chemistry.
import { SEED_JEE_MAIN_2025_FORMAT } from './seeds/jee-main-2025-format';
import { SEED_JEE_MAIN_2025_SYLLABUS_DELETIONS } from './seeds/jee-main-2025-syllabus-deletions';
import { SEED_JEE_MAIN_2025_PREP_STRATEGY } from './seeds/jee-main-2025-prep-strategy';
// Batch 39 — AP CSA expansion (recursion, inheritance, ArrayList, 2D arrays).
import { SEED_AP_CSA_RECURSION } from './seeds/ap-csa-recursion';
import { SEED_AP_CSA_INHERITANCE } from './seeds/ap-csa-inheritance';
import { SEED_AP_CSA_ARRAYLIST } from './seeds/ap-csa-arraylist';
import { SEED_AP_CSA_2D_ARRAYS } from './seeds/ap-csa-2d-arrays';
// Batch 40 — AP CSP expansion (Internet, cybersecurity, programming, impact).
import { SEED_AP_CSP_INTERNET } from './seeds/ap-csp-internet';
import { SEED_AP_CSP_CYBERSECURITY } from './seeds/ap-csp-cybersecurity';
import { SEED_AP_CSP_PROGRAMMING } from './seeds/ap-csp-programming';
import { SEED_AP_CSP_IMPACT } from './seeds/ap-csp-impact';
// Batch 41 — AP Gov expansion (Constitution, civil liberties, Congress, Presidency).
import { SEED_AP_GOV_CONSTITUTION } from './seeds/ap-gov-constitution';
import { SEED_AP_GOV_CIVIL_LIBERTIES } from './seeds/ap-gov-civil-liberties';
import { SEED_AP_GOV_CONGRESS } from './seeds/ap-gov-congress';
import { SEED_AP_GOV_PRESIDENCY } from './seeds/ap-gov-presidency';
// Batch 42 — AP Stats expansion (probability, sampling distributions, one-sample inference).
import { SEED_AP_STATS_PROBABILITY } from './seeds/ap-stats-probability';
import { SEED_AP_STATS_SAMPLING_DISTRIBUTIONS } from './seeds/ap-stats-sampling-distributions';
import { SEED_AP_STATS_ONE_SAMPLE_INFERENCE } from './seeds/ap-stats-one-sample-inference';
// Batch 43 — AP Lit/Lang depth (Modernism, Romanticism, poetry analysis, rhetorical analysis).
import { SEED_AP_LIT_MODERNISM } from './seeds/ap-lit-modernism';
import { SEED_AP_LIT_ROMANTICISM } from './seeds/ap-lit-romanticism';
import { SEED_AP_LIT_POETRY_ANALYSIS } from './seeds/ap-lit-poetry-analysis';
import { SEED_AP_LANG_RHETORICAL_ANALYSIS } from './seeds/ap-lang-rhetorical-analysis';
// Batch 44 — AP Calc AB + Bio (accumulation, area between curves, enzymes, immune system).
import { SEED_AP_CALC_ACCUMULATION } from './seeds/ap-calc-accumulation';
import { SEED_AP_CALC_AREA_BETWEEN_CURVES } from './seeds/ap-calc-area-between-curves';
import { SEED_AP_BIO_ENZYMES } from './seeds/ap-bio-enzymes';
import { SEED_AP_BIO_IMMUNE } from './seeds/ap-bio-immune';
// Batch 45 — AP Micro/Macro depth.
import { SEED_AP_MICRO_ELASTICITY } from './seeds/ap-micro-elasticity';
import { SEED_AP_MICRO_MARKET_STRUCTURES } from './seeds/ap-micro-market-structures';
import { SEED_AP_MICRO_FACTOR_MARKETS } from './seeds/ap-micro-factor-markets';
import { SEED_AP_MACRO_FISCAL_POLICY } from './seeds/ap-macro-fiscal-policy';
import { SEED_AP_MACRO_BUSINESS_CYCLE } from './seeds/ap-macro-business-cycle';
// Batch 46 — AP USH/World depth.
import { SEED_AP_USH_WWII } from './seeds/ap-ush-wwii';
import { SEED_AP_USH_MODERN_ERA } from './seeds/ap-ush-modern-era';
import { SEED_AP_WORLD_COLD_WAR } from './seeds/ap-world-cold-war';
import { SEED_AP_WORLD_DECOLONIZATION } from './seeds/ap-world-decolonization';
// Batch 47 — AP Languages + Capstone (French, Latin, Mandarin, Italian, Seminar, Research).
import { SEED_AP_FRENCH_STRATEGY } from './seeds/ap-french-strategy';
import { SEED_AP_LATIN_STRATEGY } from './seeds/ap-latin-strategy';
import { SEED_AP_MANDARIN_STRATEGY } from './seeds/ap-mandarin-strategy';
import { SEED_AP_ITALIAN_STRATEGY } from './seeds/ap-italian-strategy';
import { SEED_AP_SEMINAR_STRATEGY } from './seeds/ap-seminar-strategy';
import { SEED_AP_RESEARCH_STRATEGY } from './seeds/ap-research-strategy';
// Batch 48 — SAT depth (math passport + additional, reading lit/history/science, writing rhetoric).
import { SEED_SAT_MATH_PASSPORT_ADVANCED } from './seeds/sat-math-passport-advanced';
import { SEED_SAT_MATH_ADDITIONAL_TOPICS } from './seeds/sat-math-additional-topics';
import { SEED_SAT_READING_LITERATURE } from './seeds/sat-reading-literature';
import { SEED_SAT_READING_HISTORY } from './seeds/sat-reading-history';
import { SEED_SAT_READING_SCIENCE } from './seeds/sat-reading-science';
import { SEED_SAT_WRITING_RHETORIC } from './seeds/sat-writing-rhetoric';
// Batch 49 — IITJEE strategy + high-yield topics.
import { SEED_JEE_MAIN_STRATEGY } from './seeds/jee-main-strategy';
import { SEED_JEE_ADVANCED_STRATEGY } from './seeds/jee-advanced-strategy';
import { SEED_JEE_PHYSICS_STRATEGY } from './seeds/jee-physics-strategy';
import { SEED_JEE_CHEMISTRY_STRATEGY } from './seeds/jee-chemistry-strategy';
import { SEED_JEE_MATH_STRATEGY } from './seeds/jee-math-strategy';
import { SEED_JEE_ROTATIONAL_MECHANICS } from './seeds/jee-rotational-mechanics';
import { SEED_JEE_COORDINATE_GEOMETRY } from './seeds/jee-coordinate-geometry';
// Batch 50 — Rest tier: NCLEX-PN, GRE Subject (math+physics), JEE thermo+organic.
import { SEED_NCLEX_PN_STRATEGY } from './seeds/nclex-pn-strategy';
import { SEED_GRE_SUBJECT_MATH } from './seeds/gre-subject-math';
import { SEED_GRE_SUBJECT_PHYSICS } from './seeds/gre-subject-physics';
import { SEED_JEE_THERMODYNAMICS } from './seeds/jee-thermodynamics';
import { SEED_JEE_ORGANIC_MECHANISMS } from './seeds/jee-organic-mechanisms';
// Batch 51 — NEET UG hybrid: 1 META + 8 CONTENT (bio cell/genetics/physiology/ecology, physics mechanics/electrostatics, chem organic/equilibrium).
import { SEED_NEET_FORMAT_2025 } from './seeds/neet-format-2025';
import { SEED_NEET_BIO_CELL_BIOLOGY } from './seeds/neet-bio-cell-biology';
import { SEED_NEET_BIO_GENETICS } from './seeds/neet-bio-genetics';
import { SEED_NEET_BIO_HUMAN_PHYSIOLOGY } from './seeds/neet-bio-human-physiology';
import { SEED_NEET_BIO_ECOLOGY } from './seeds/neet-bio-ecology';
import { SEED_NEET_PHYSICS_MECHANICS } from './seeds/neet-physics-mechanics';
import { SEED_NEET_PHYSICS_ELECTROSTATICS } from './seeds/neet-physics-electrostatics';
import { SEED_NEET_CHEMISTRY_ORGANIC } from './seeds/neet-chemistry-organic';
import { SEED_NEET_CHEMISTRY_EQUILIBRIUM } from './seeds/neet-chemistry-equilibrium';
// Batch 52 — MCAT hybrid: 1 META + 7 CONTENT (biochem AAs/enzymes, bio organ systems, chem-phys acid-base/thermo, psych-soc research, CARS).
import { SEED_MCAT_FORMAT_2025 } from './seeds/mcat-format-2025';
import { SEED_MCAT_BIOCHEM_AMINO_ACIDS } from './seeds/mcat-biochem-amino-acids';
import { SEED_MCAT_BIOCHEM_ENZYMES } from './seeds/mcat-biochem-enzymes';
import { SEED_MCAT_BIO_ORGAN_SYSTEMS } from './seeds/mcat-bio-organ-systems';
import { SEED_MCAT_CHEM_PHYS_ACID_BASE } from './seeds/mcat-chem-phys-acid-base';
import { SEED_MCAT_CHEM_PHYS_THERMODYNAMICS } from './seeds/mcat-chem-phys-thermodynamics';
import { SEED_MCAT_PSYCH_SOC_RESEARCH } from './seeds/mcat-psych-soc-research';
import { SEED_MCAT_CARS_STRATEGY } from './seeds/mcat-cars-strategy';
// Batch 53 — AP World History depth: 4 unit-fillers (Networks, Land Empires, Transoceanic, Globalization).
import { SEED_AP_WORLD_UNIT2_NETWORKS } from './seeds/ap-world-unit2-networks';
import { SEED_AP_WORLD_UNIT3_LAND_EMPIRES } from './seeds/ap-world-unit3-land-empires';
import { SEED_AP_WORLD_UNIT4_TRANSOCEANIC } from './seeds/ap-world-unit4-transoceanic';
import { SEED_AP_WORLD_UNIT9_GLOBALIZATION } from './seeds/ap-world-unit9-globalization';
// Batch 54 — APUSH depth: 4 period-fillers (Period 1 encounter, Period 3 Independence, Period 6 Gilded Age, Period 7 Imperialism+Progressive).
import { SEED_AP_USH_PERIOD1_ENCOUNTER } from './seeds/ap-ush-period1-encounter';
import { SEED_AP_USH_PERIOD3_INDEPENDENCE } from './seeds/ap-ush-period3-independence';
import { SEED_AP_USH_PERIOD6_GILDED_AGE } from './seeds/ap-ush-period6-gilded-age';
import { SEED_AP_USH_PERIOD7_IMPERIALISM_PROGRESSIVE } from './seeds/ap-ush-period7-imperialism-progressive';
// Batch 55 — AP Calc AB depth: 4 unit-fillers (limits/continuity, chain+implicit, curve sketching, differential equations).
import { SEED_AP_CALC_LIMITS_CONTINUITY } from './seeds/ap-calc-limits-continuity';
import { SEED_AP_CALC_CHAIN_IMPLICIT } from './seeds/ap-calc-chain-implicit';
import { SEED_AP_CALC_CURVE_SKETCHING } from './seeds/ap-calc-curve-sketching';
import { SEED_AP_CALC_DIFFERENTIAL_EQUATIONS } from './seeds/ap-calc-differential-equations';
// Batch 56 — AP Bio Unit 6 depth: central dogma + gene regulation/biotech.
import { SEED_AP_BIO_CENTRAL_DOGMA } from './seeds/ap-bio-central-dogma';
import { SEED_AP_BIO_GENE_REGULATION_BIOTECH } from './seeds/ap-bio-gene-regulation-biotech';

/** Seeded plans bundled with the codebase. Curated for the public demo
 *  flow; partner plans live in the DB and merge in via listLessonPlans. */
export const SEED_PLANS: LessonPlan[] = [
  // Batch 1 — math foundations through middle school.
  SEED_K_COUNTING_TO_10,
  SEED_G2_PLACE_VALUE,
  SEED_G4_MULTIPLICATION_AS_ARRAYS,
  SEED_G6_FRACTIONS_ADD_UNLIKE,
  SEED_G8_LINEAR_EQUATIONS,
  // Batch 2 — math advanced (G9-12).
  SEED_G9_SYSTEMS_OF_EQUATIONS,
  SEED_G9_PYTHAGOREAN,
  SEED_G10_RIGHT_TRIANGLE_TRIG,
  SEED_G11_UNIT_CIRCLE,
  SEED_G12_DERIVATIVE_INTUITION,
  // Batch 3 — Science K-12 (full coverage tracked in TRACKER.md).
  SEED_K2_SCI_PUSH_PULL,
  SEED_K2_SCI_SUNLIGHT_WEATHER,
  SEED_K2_SCI_PLANT_NEEDS,
  SEED_K2_SCI_ANIMAL_NEEDS,
  SEED_K2_SCI_SOUND_VIBRATIONS,
  SEED_K2_SCI_LIGHT_SHADOWS,
  SEED_K2_SCI_STATES_OF_MATTER,
  SEED_K2_SCI_REVERSIBLE_CHANGES,
  SEED_K2_SCI_HABITATS,
  SEED_K2_SCI_EARTH_MATERIALS,
  SEED_K2_SCI_DAY_NIGHT_SKY,
  SEED_K2_SCI_WEATHER_SEASONS,
  SEED_G3_SCI_FORCES_MOTION,
  SEED_G3_SCI_MAGNETS_ELECTRICITY,
  SEED_G3_SCI_LIFE_CYCLES,
  SEED_G3_SCI_INHERITANCE_TRAITS,
  SEED_G3_SCI_WEATHER_CLIMATE,
  SEED_G3_SCI_ADAPTATIONS,
  SEED_G4_SCI_ENERGY_TRANSFER,
  SEED_G4_SCI_WAVES_INTRO,
  SEED_G4_SCI_INFORMATION_TRANSFER,
  SEED_G4_SCI_PLANT_ANIMAL_STRUCTURES,
  SEED_G4_SCI_EARTH_FEATURES,
  SEED_G4_SCI_NATURAL_HAZARDS,
  SEED_G5_SCI_MATTER_PROPERTIES,
  SEED_G5_SCI_MIXTURES_SOLUTIONS,
  SEED_G5_SCI_ENERGY_FOOD_CHAINS,
  SEED_G5_SCI_PHOTOSYNTHESIS_BASICS,
  SEED_G5_SCI_EARTH_SYSTEMS,
  SEED_G5_SCI_SOLAR_SYSTEM,
  SEED_G6_SCI_CELLS,
  SEED_G6_SCI_BODY_SYSTEMS_INTRO,
  SEED_G6_SCI_ECOSYSTEMS,
  SEED_G6_SCI_CLIMATE_WEATHER,
  SEED_G6_SCI_ATOMS_ELEMENTS,
  SEED_G6_SCI_DENSITY_BUOYANCY,
  SEED_G6_SCI_HEAT_TRANSFER,
  SEED_G6_SCI_EARTH_INTERIOR,
  SEED_G7_SCI_GENETICS_PUNNETT,
  SEED_G7_SCI_PLATE_TECTONICS,
  SEED_G7_SCI_EVOLUTION_SELECTION,
  SEED_G7_SCI_GEOLOGIC_TIME,
  SEED_G7_SCI_CHEMICAL_REACTIONS_INTRO,
  SEED_G7_SCI_PERIODIC_TABLE_INTRO,
  SEED_G7_SCI_CONSERVATION_MASS,
  SEED_G7_SCI_BODY_SYSTEMS_DEEP,
  SEED_G8_SCI_NEWTONS_LAWS,
  SEED_G8_SCI_FORCES_ENERGY,
  SEED_G8_SCI_WAVE_PROPERTIES,
  SEED_G8_SCI_SOUND_LIGHT,
  SEED_G8_SCI_ELECTRICITY,
  SEED_G8_SCI_SOLAR_SYSTEM_BEYOND,
  SEED_G8_SCI_CLIMATE_CHANGE,
  SEED_G8_SCI_ENGINEERING_DESIGN,
  SEED_BIO_CELL_THEORY_STRUCTURE,
  SEED_BIO_CELL_MEMBRANE_TRANSPORT,
  SEED_BIO_CELLULAR_RESPIRATION,
  SEED_BIO_PHOTOSYNTHESIS_DEEP,
  SEED_BIO_CELL_CYCLE_MITOSIS,
  SEED_BIO_MEIOSIS_SEXUAL_REPRO,
  SEED_BIO_MENDELIAN_GENETICS,
  SEED_BIO_DNA_STRUCTURE_REPLICATION,
  SEED_BIO_PROTEIN_SYNTHESIS,
  SEED_BIO_MUTATIONS_GENETIC_ENG,
  SEED_BIO_NATURAL_SELECTION_EVOL,
  SEED_BIO_SPECIATION_PHYLOGENY,
  SEED_BIO_ECOLOGY_POPULATIONS,
  SEED_BIO_ECOSYSTEMS_CYCLES,
  SEED_BIO_HUMAN_CIRC_RESP,
  SEED_BIO_HUMAN_NERV_ENDO,
  SEED_BIO_HUMAN_IMMUNE_DIGEST,
  SEED_BIO_BIOTECH_ETHICS,
  SEED_CHEM_ATOMIC_STRUCTURE,
  SEED_CHEM_ELECTRON_CONFIG,
  SEED_CHEM_PERIODIC_TRENDS,
  SEED_CHEM_IONIC_BONDING,
  SEED_CHEM_COVALENT_BONDING_LEWIS,
  SEED_CHEM_MOLECULAR_GEOMETRY_VSEPR,
  SEED_CHEM_NAMING_COMPOUNDS,
  SEED_CHEM_MOLE_STOICHIOMETRY,
  SEED_CHEM_BALANCING_EQUATIONS,
  SEED_CHEM_REACTIONS_TYPES,
  SEED_CHEM_GAS_LAWS,
  SEED_CHEM_SOLUTIONS_CONCENTRATION,
  SEED_CHEM_ACIDS_BASES_PH,
  SEED_CHEM_THERMOCHEMISTRY,
  SEED_CHEM_KINETICS,
  SEED_CHEM_EQUILIBRIUM,
  SEED_CHEM_REDOX,
  SEED_CHEM_ORGANIC_INTRO,
  SEED_PHYS_KINEMATICS_1D,
  SEED_PHYS_KINEMATICS_2D_PROJECTILE,
  SEED_PHYS_NEWTONS_FIRST_LAW,
  SEED_PHYS_NEWTONS_SECOND_LAW,
  SEED_PHYS_NEWTONS_THIRD_LAW,
  SEED_PHYS_FRICTION,
  SEED_PHYS_WORK_ENERGY,
  SEED_PHYS_CONSERVATION_ENERGY,
  SEED_PHYS_MOMENTUM_COLLISIONS,
  SEED_PHYS_CIRCULAR_MOTION,
  SEED_PHYS_GRAVITATION,
  SEED_PHYS_SIMPLE_HARMONIC_MOTION,
  SEED_PHYS_WAVES_SOUND,
  SEED_PHYS_LIGHT_OPTICS,
  SEED_PHYS_ELECTRIC_CHARGE_COULOMB,
  SEED_PHYS_CIRCUITS_OHMS_LAW,
  SEED_PHYS_MAGNETISM,
  SEED_PHYS_EM_INDUCTION,
  SEED_PHYS_MODERN_INTRO,
  SEED_PHYS_SPECIAL_RELATIVITY_INTRO,
  SEED_K_COUNTING_TO_100,
  SEED_K_SHAPES_2D,
  SEED_G1_ADD_WITHIN_20,
  SEED_G1_SUBTRACT_WITHIN_20,
  SEED_G2_ADD_SUBTRACT_WITHIN_100,
  // Batch 4 — G3 math foundations.
  SEED_G3_MATH_MULTIPLICATION_INTRO,
  SEED_G3_MATH_DIVISION_INTRO,
  SEED_G3_MATH_FRACTIONS_INTRO,
  SEED_G3_MATH_AREA_PERIMETER,
  SEED_G3_MATH_TIME_MONEY,
  // Batch 5 — G4 math (continuing the multiplication/division strand).
  SEED_G4_MATH_MULTI_DIGIT_MULTIPLICATION,
  SEED_G4_MATH_LONG_DIVISION,
  SEED_G4_MATH_EQUIVALENT_FRACTIONS,
  SEED_G4_MATH_DECIMALS_INTRO,
  SEED_G4_MATH_FACTORS_MULTIPLES,
  // Batch 6 — G5 math (operations on fractions/decimals + volume + coords + PEMDAS).
  SEED_G5_MATH_DECIMAL_OPERATIONS,
  SEED_G5_MATH_FRACTION_OPERATIONS,
  SEED_G5_MATH_VOLUME,
  SEED_G5_MATH_COORDINATE_PLANE,
  SEED_G5_MATH_ORDER_OF_OPERATIONS,
  // Batch 7 — G6 math (ratios, percent, integers, expressions).
  SEED_G6_MATH_RATIOS_RATES,
  SEED_G6_MATH_PERCENT,
  SEED_G6_MATH_INTEGERS,
  SEED_G6_MATH_EXPRESSIONS_VARIABLES,
  // Batch 8 — G7 math (algebra bridge: proportional, integers, equations, expressions).
  SEED_G7_MATH_PROPORTIONAL_RELATIONSHIPS,
  SEED_G7_MATH_INTEGER_OPERATIONS,
  SEED_G7_MATH_ONE_STEP_EQUATIONS,
  SEED_G7_MATH_TWO_STEP_EQUATIONS,
  SEED_G7_MATH_DISTRIBUTIVE_COMBINE,
  // Batch 9 — G8 math (functions, slope, exponents, transformations, irrationals).
  SEED_G8_MATH_FUNCTIONS_INTRO,
  SEED_G8_MATH_SLOPE_LINEAR_FUNCTIONS,
  SEED_G8_MATH_EXPONENTS_SCIENTIFIC_NOTATION,
  SEED_G8_MATH_TRANSFORMATIONS,
  SEED_G8_MATH_SQUARE_ROOTS_IRRATIONALS,
  // Batch 10 — HS Algebra 1 (polynomials, factoring, quadratics, exponentials, inequalities).
  SEED_G9_ALG1_POLYNOMIALS_INTRO,
  SEED_G9_ALG1_FACTORING,
  SEED_G9_ALG1_QUADRATICS_INTRO,
  SEED_G9_ALG1_EXPONENTIAL_FUNCTIONS,
  SEED_G9_ALG1_INEQUALITIES,
  // Batch 11 — HS Geometry (angles, congruence, similarity, circles, volume).
  SEED_G10_GEOM_ANGLE_RELATIONSHIPS,
  SEED_G10_GEOM_TRIANGLE_CONGRUENCE,
  SEED_G10_GEOM_SIMILARITY,
  SEED_G10_GEOM_CIRCLES,
  SEED_G10_GEOM_VOLUME_SOLIDS,
  // Batch 12 — HS Algebra 2 / Pre-calc (quadratic formula, logs, rationals, sequences, trig identities).
  SEED_G11_ALG2_QUADRATIC_FORMULA,
  SEED_G11_ALG2_LOGARITHMS,
  SEED_G11_ALG2_RATIONAL_FUNCTIONS,
  SEED_G11_ALG2_SEQUENCES_SERIES,
  SEED_G11_PRECALC_TRIG_IDENTITIES,
  // Batch 13 — G3 ELA foundations (reading + writing + grammar).
  SEED_G3_ELA_MAIN_IDEA,
  SEED_G3_ELA_CONTEXT_CLUES,
  SEED_G3_ELA_STORY_ELEMENTS,
  SEED_G3_ELA_PARTS_OF_SPEECH,
  SEED_G3_ELA_OPINION_WRITING,
  // Batch 14 — G4-G5 ELA (inference, theme, sentence structure, summarizing, narrative writing).
  SEED_G4_ELA_INFERENCE,
  SEED_G4_ELA_THEME_LESSON,
  SEED_G4_ELA_SENTENCE_STRUCTURE,
  SEED_G5_ELA_SUMMARIZING,
  SEED_G5_ELA_NARRATIVE_WRITING,
  // Batch 15 — G6-G8 ELA (textual evidence, argument, POV/purpose, figurative language, thesis).
  SEED_G6_ELA_TEXTUAL_EVIDENCE,
  SEED_G6_ELA_ARGUMENT_WRITING,
  SEED_G7_ELA_AUTHOR_PURPOSE_POV,
  SEED_G7_ELA_FIGURATIVE_LANGUAGE,
  SEED_G8_ELA_THESIS_STATEMENTS,
  // Batch 16 — Social Studies foundations (geography, civics, world history, US history).
  SEED_G3_SS_MAPS_GLOBES,
  SEED_G4_SS_BRANCHES_OF_GOVERNMENT,
  SEED_G6_SS_ANCIENT_EGYPT,
  SEED_G8_SS_AMERICAN_REVOLUTION,
  SEED_G9_SS_CONSTITUTION_BILL_OF_RIGHTS,
  // Batch 17 — Test Prep (SAT all sections + ACT all sections).
  SEED_SAT_MATH_HEART_OF_ALGEBRA,
  SEED_SAT_MATH_PROBLEM_SOLVING_DATA,
  SEED_SAT_READING_EVIDENCE,
  SEED_SAT_WRITING_GRAMMAR,
  SEED_SAT_TEST_STRATEGY,
  SEED_ACT_ENGLISH,
  SEED_ACT_MATH,
  SEED_ACT_READING,
  SEED_ACT_SCIENCE,
  // Batch 18 — HS ELA (literary analysis, research, rhetoric, essay structure).
  SEED_G9_ELA_ESSAY_STRUCTURE,
  SEED_G11_ELA_LITERARY_ANALYSIS,
  SEED_G11_ELA_RESEARCH_WRITING,
  SEED_G11_ELA_RHETORICAL_ANALYSIS,
  // Batch 19 — Calculus (G12).
  SEED_G12_CALC_LIMITS,
  SEED_G12_CALC_DERIVATIVE_RULES,
  SEED_G12_CALC_APPLICATIONS,
  SEED_G12_CALC_INTEGRATION_INTRO,
  // Batch 20 — Statistics (G11).
  SEED_G11_STATS_DESCRIPTIVE,
  SEED_G11_STATS_NORMAL_DISTRIBUTION,
  SEED_G11_STATS_PROBABILITY,
  SEED_G11_STATS_SAMPLING,
  SEED_G11_STATS_CORRELATION_REGRESSION,
  // Batch 21 — World History expansion (G7-G10).
  SEED_G7_SS_ANCIENT_GREECE,
  SEED_G7_SS_ROMAN_EMPIRE,
  SEED_G7_SS_MIDDLE_AGES,
  SEED_G7_SS_RENAISSANCE,
  SEED_G8_SS_INDUSTRIAL_REVOLUTION,
  SEED_G8_SS_FRENCH_REVOLUTION,
  SEED_G10_SS_WORLD_WAR_1,
  SEED_G10_SS_WORLD_WAR_2,
  // Batch 22 — US History expansion (G8-G11).
  SEED_G8_SS_CIVIL_WAR,
  SEED_G11_SS_COLD_WAR,
  SEED_G11_SS_CIVIL_RIGHTS_MOVEMENT,
  // Batch 23 — Economics + Government extras (G11).
  SEED_G11_ECON_SUPPLY_DEMAND,
  SEED_G11_ECON_GDP_INFLATION,
  SEED_G11_ECON_FISCAL_MONETARY,
  SEED_G11_ECON_MARKET_STRUCTURES,
  SEED_G11_SS_ELECTIONS_VOTING,
  // Batch 24 — Elementary ELA gap (G2 phonics).
  SEED_G2_ELA_PHONICS_DECODING,
  // Batch 25 — K-2 ELA foundations (letter sounds, sight words,
  // phonics blends, fluency, capitalization, spelling patterns).
  SEED_K_ELA_LETTER_SOUNDS,
  SEED_K_ELA_SIGHT_WORDS,
  SEED_G1_ELA_PHONICS_BLENDS,
  SEED_G1_ELA_FLUENCY,
  SEED_G1_ELA_CAPITALIZATION,
  SEED_G2_ELA_SPELLING_PATTERNS,
  // Batch 26 — K-2 SS + early math gaps (community, families,
  // continents, time, length, money).
  SEED_K2_SS_COMMUNITY_HELPERS,
  SEED_K2_SS_FAMILIES_CULTURES,
  SEED_K2_SS_CONTINENTS_OCEANS,
  SEED_G1_MATH_TIME_TO_HOUR,
  SEED_G1_MATH_MEASUREMENT_LENGTH,
  SEED_G2_MATH_MONEY_COINS,
  // Batch 27 — G3-G5 SS expansion + math fillers (G6 GCF/LCM,
  // G7 inequalities, G11 complex numbers, conics, matrices).
  SEED_G3_SS_COMMUNITIES,
  SEED_G4_SS_US_REGIONS,
  SEED_G5_SS_EXPLORERS_COLONIZATION,
  SEED_G5_SS_THIRTEEN_COLONIES,
  SEED_G6_MATH_GCF_LCM,
  SEED_G7_MATH_INEQUALITIES,
  SEED_G11_ALG2_COMPLEX_NUMBERS,
  SEED_G11_ALG2_CONIC_SECTIONS,
  SEED_G11_ALG2_MATRICES_INTRO,
  // Batch 28 — World/US history expansion, AP math/stats, civics,
  // ELA grammar/poetry, science earth/circuits.
  SEED_G7_SS_MESOPOTAMIA,
  SEED_G7_SS_ANCIENT_CHINA,
  SEED_G7_SS_ANCIENT_INDIA,
  SEED_G8_SS_IMMIGRATION_INDUSTRIAL,
  SEED_G8_SS_PROGRESSIVE_ERA,
  SEED_G8_SS_WESTWARD_EXPANSION,
  SEED_G11_SS_GREAT_DEPRESSION_NEW_DEAL,
  SEED_G11_SS_COLD_WAR_PROXIES,
  SEED_G11_ECON_TRADE_GLOBALIZATION,
  SEED_G9_CIVICS_THREE_BRANCHES,
  SEED_G8_ELA_CITING_EVIDENCE,
  SEED_G10_ELA_RHETORICAL_DEVICES,
  SEED_G9_ELA_ACTIVE_PASSIVE,
  SEED_G6_ELA_ACTIVE_LISTENING,
  SEED_G5_ELA_POETRY_INTRO,
  SEED_G11_ELA_POETRY_ANALYSIS,
  SEED_AP_CALC_FUNDAMENTAL_THEOREM,
  SEED_AP_CALC_RELATED_RATES,
  SEED_AP_STATS_HYPOTHESIS_TESTING,
  SEED_G4_MATH_ANGLE_MEASUREMENT,
  SEED_G3_MATH_ROUNDING,
  SEED_G6_MATH_COORDINATE_QUADRANTS,
  SEED_G7_MATH_PERCENT_APPLICATIONS,
  SEED_G6_SCI_ROCKS_MINERALS,
  SEED_G4_SCI_EROSION_WEATHERING,
  SEED_G6_SCI_WATER_CYCLE,
  SEED_G4_SCI_CIRCUITS_INTRO,
  // Batch 29 — AP courses + middle/HS depth fillers.
  SEED_AP_BIO_CELL_SIGNALING,
  SEED_AP_USH_RECONSTRUCTION,
  SEED_AP_CHEM_REACTION_RATES,
  SEED_G9_ALG1_GRAPHING_FUNCTIONS,
  SEED_G8_MATH_VOLUME_SURFACE_AREA,
  SEED_G7_ELA_CONTEXT_VOCAB,
  SEED_G6_SCI_ENERGY_FORMS,
  SEED_G8_SCI_CHEMISTRY_INTRO,
  SEED_G11_ELA_RESEARCH_CITATION,
  SEED_G8_SS_CIVICS_RIGHTS,
  SEED_G5_SCI_CLASSIFICATION,
  SEED_G11_ELA_SYNTAX_STYLE,
  SEED_G7_SCI_ENERGY_FLOW_ECOSYSTEMS,
  // Batch 30 — More AP/world/depth.
  SEED_AP_WORLD_FRENCH_REVOLUTION_DEEP,
  SEED_G4_ELA_PREFIXES_SUFFIXES,
  SEED_G3_MATH_ELAPSED_TIME,
  SEED_G11_STATS_CONFIDENCE_INTERVALS,
  SEED_G4_ELA_PARAGRAPH_STRUCTURE,
  SEED_G6_SS_BYZANTINE_ISLAMIC,
  SEED_G8_SCI_GENETICS_HEREDITY,
  SEED_G10_ELA_SHAKESPEARE_INTRO,
  SEED_G6_SS_FEUDALISM,
  SEED_G7_MATH_VOLUME_PRISMS_PYRAMIDS,
  SEED_K_MATH_SHAPES_3D,
  SEED_K2_SCI_MAGNETISM_INTRO,
  // Batch 31 — Newton/physics depth, ELA depth, civics.
  SEED_AP_PHYSICS_NEWTONS_SECOND_DEEP,
  SEED_G3_ELA_DIALOGUE_PUNCTUATION,
  SEED_G6_ELA_FIGURATIVE_LANGUAGE,
  SEED_G6_MATH_AREA_COMPOSITE,
  SEED_G7_SCI_NEWTON_LAWS_BRIDGE,
  SEED_G3_ELA_PREFIXES,
  SEED_G11_SS_SUPREME_COURT_CASES,
  SEED_G4_MATH_LINE_PLOTS_DATA,
  // Batch 32 — More elementary, MS, AP supplements.
  SEED_G2_ELA_COMPREHENSION_STRATEGIES,
  SEED_G5_MATH_DIVISIBILITY_RULES,
  SEED_G8_ELA_TONE_MOOD,
  SEED_G7_SS_AGE_OF_EXPLORATION_DEEP,
  SEED_G3_SCI_STATES_OF_MATTER,
  SEED_G11_ECON_STOCK_MARKET_BASICS,
  SEED_G6_MATH_STATISTICS_INTRO,
  SEED_G7_MATH_PROBABILITY_BASICS,
  SEED_G11_BIO_EVOLUTION_EVIDENCE,
  // Batch 33 — Civil War causes, photosynthesis deep, modern world.
  SEED_G8_SS_CIVIL_WAR_CAUSES,
  SEED_AP_BIO_PHOTOSYNTHESIS_DEEP,
  SEED_K_MATH_COUNTING_OBJECTS,
  SEED_G7_ELA_SUMMARY_PRECIS,
  SEED_G11_SS_GLOBALIZATION_MODERN,
  SEED_G8_MATH_BIVARIATE_DATA,
  SEED_SAT_ACT_ESSAY_STRATEGY,
  SEED_G5_SCI_WATER_CYCLE,
  // Batch 34 — High-impact AP completion + foundational fillers.
  SEED_AP_CALC_OPTIMIZATION,
  SEED_AP_CALC_LHOPITAL,
  SEED_AP_CALC_VOLUMES_REVOLUTION,
  SEED_AP_BIO_CELLULAR_RESPIRATION_DEEP,
  SEED_AP_BIO_HARDY_WEINBERG,
  SEED_AP_STATS_CHI_SQUARE,
  SEED_AP_STATS_REGRESSION_INFERENCE,
  SEED_AP_USH_COLONIAL_PURITANS,
  SEED_AP_USH_JACKSONIAN,
  SEED_AP_USH_1920S,
  SEED_AP_USH_CIVIL_RIGHTS_DEEP,
  SEED_AP_WORLD_MONGOL_EMPIRE,
  SEED_AP_WORLD_IMPERIALISM,
  SEED_AP_WORLD_WWI_CAUSES,
  SEED_K2_SCI_FIVE_SENSES,
  SEED_K_MATH_CALENDAR_TIME,
  SEED_K2_SS_NEEDS_WANTS,
  SEED_G2_MATH_EVEN_ODD,
  SEED_G2_ELA_CONTRACTIONS,
  SEED_G3_MATH_MULTIPLICATION_FLUENCY,
  SEED_G3_MATH_WORD_PROBLEMS_STRATEGY,
  SEED_G4_MATH_MIXED_NUMBERS,
  SEED_G7_ELA_COUNTERCLAIM,
  SEED_G8_ELA_THEME_ANALYSIS,
  SEED_AP_LANG_ARGUMENT_ESSAY,
  SEED_AP_LANG_SYNTHESIS_ESSAY,
  // Batch 35 — Test-prep pipeline + remaining AP gaps.
  SEED_GRE_QUANT_STRATEGY,
  SEED_GRE_VERBAL_STRATEGY,
  SEED_GRE_ANALYTICAL_WRITING,
  SEED_GMAT_QUANT_STRATEGY,
  SEED_GMAT_VERBAL_STRATEGY,
  SEED_SSAT_ISEE_STRATEGY,
  SEED_AP_TEST_STRATEGY,
  SEED_AP_CALC_BC_PARAMETRIC,
  SEED_AP_CALC_BC_POLAR,
  SEED_AP_CALC_BC_SERIES_CONVERGENCE,
  SEED_AP_CALC_BC_TAYLOR_SERIES,
  SEED_AP_PHYSICS2_FLUIDS,
  SEED_AP_PHYSICS2_THERMO,
  SEED_AP_PHYSICS2_ELECTROSTATICS,
  SEED_AP_PHYSICS2_OPTICS,
  SEED_AP_PSYCH_LEARNING,
  SEED_AP_PSYCH_MEMORY,
  SEED_AP_PSYCH_DEVELOPMENT,
  SEED_AP_HUMAN_GEO_POPULATION,
  SEED_AP_HUMAN_GEO_AGRICULTURE,
  SEED_AP_GOV_FEDERALISM,
  SEED_AP_GOV_POLITICAL_PARTIES,
  SEED_AP_CHEM_THERMODYNAMICS,
  SEED_AP_CHEM_BUFFERS_TITRATION,
  SEED_AP_BIO_POPULATION_ECOLOGY,
  SEED_AP_BIO_SPECIATION,
  // Batch 36 — AP CS + Stats/Physics 2/Psych/Geo + Micro/Macro.
  SEED_AP_CSP_DATA_BINARY,
  SEED_AP_CSP_ALGORITHMS_ABSTRACTION,
  SEED_AP_CSA_OBJECTS_CLASSES,
  SEED_AP_CSA_ARRAYS_LOOPS,
  SEED_AP_STATS_TWO_SAMPLE_TESTS,
  SEED_AP_PHYSICS2_CIRCUITS,
  SEED_AP_PHYSICS2_MAGNETISM,
  SEED_AP_PHYSICS2_MODERN,
  SEED_AP_PSYCH_COGNITION,
  SEED_AP_PSYCH_SOCIAL,
  SEED_AP_PSYCH_BIOLOGICAL,
  SEED_AP_HUMAN_GEO_URBAN,
  SEED_AP_HUMAN_GEO_POLITICAL,
  SEED_AP_MICRO_PPC,
  SEED_AP_MICRO_EXTERNALITIES,
  SEED_AP_MACRO_AD_AS,
  SEED_AP_MACRO_MONEY_BANKING,
  // Batch 37 — AP ES, music, art history, prof tests, more world/lit.
  SEED_AP_ENV_SCI_ECOSYSTEMS,
  SEED_AP_ENV_SCI_CLIMATE_CHANGE,
  SEED_AP_ENV_SCI_POLLUTION,
  SEED_AP_MUSIC_THEORY_FUNDAMENTALS,
  SEED_AP_MUSIC_CHORDS_PROGRESSIONS,
  SEED_AP_ART_HISTORY_ANALYSIS,
  SEED_AP_ART_HISTORY_MODERN,
  SEED_MCAT_STRATEGY,
  SEED_LSAT_STRATEGY,
  SEED_NCLEX_STRATEGY,
  SEED_G7_SS_RENAISSANCE_REFORMATION,
  SEED_G8_SS_INDUSTRIAL_REVOLUTION_DEEP,
  SEED_AP_LIT_PROSE_ANALYSIS,
  SEED_AP_LIT_Q3_ESSAY,
  SEED_AP_SPANISH_STRATEGY,
  SEED_AP_PHYS1_KINEMATICS,
  SEED_AP_PHYS1_ENERGY_CONSERVATION,
  SEED_AP_PHYS1_MOMENTUM,
  SEED_AP_PHYS1_ROTATION,
  SEED_AP_PHYS1_SHM,
  SEED_AP_PHYS1_WAVES,
  SEED_AP_PHYS1_CIRCULAR_GRAVITATION,
  SEED_AP_CSA_RECURSION,
  SEED_AP_CSA_INHERITANCE,
  SEED_AP_CSA_ARRAYLIST,
  SEED_AP_CSA_2D_ARRAYS,
  SEED_AP_CSP_INTERNET,
  SEED_AP_CSP_CYBERSECURITY,
  SEED_AP_CSP_PROGRAMMING,
  SEED_AP_CSP_IMPACT,
  SEED_AP_GOV_CONSTITUTION,
  SEED_AP_GOV_CIVIL_LIBERTIES,
  SEED_AP_GOV_CONGRESS,
  SEED_AP_GOV_PRESIDENCY,
  SEED_AP_STATS_PROBABILITY,
  SEED_AP_STATS_SAMPLING_DISTRIBUTIONS,
  SEED_AP_STATS_ONE_SAMPLE_INFERENCE,
  SEED_AP_LIT_MODERNISM,
  SEED_AP_LIT_ROMANTICISM,
  SEED_AP_LIT_POETRY_ANALYSIS,
  SEED_AP_LANG_RHETORICAL_ANALYSIS,
  SEED_AP_CALC_ACCUMULATION,
  SEED_AP_CALC_AREA_BETWEEN_CURVES,
  SEED_AP_BIO_ENZYMES,
  SEED_AP_BIO_IMMUNE,
  SEED_AP_MICRO_ELASTICITY,
  SEED_AP_MICRO_MARKET_STRUCTURES,
  SEED_AP_MICRO_FACTOR_MARKETS,
  SEED_AP_MACRO_FISCAL_POLICY,
  SEED_AP_MACRO_BUSINESS_CYCLE,
  SEED_AP_USH_WWII,
  SEED_AP_USH_MODERN_ERA,
  SEED_AP_WORLD_COLD_WAR,
  SEED_AP_WORLD_DECOLONIZATION,
  SEED_AP_FRENCH_STRATEGY,
  SEED_AP_LATIN_STRATEGY,
  SEED_AP_MANDARIN_STRATEGY,
  SEED_AP_ITALIAN_STRATEGY,
  SEED_AP_SEMINAR_STRATEGY,
  SEED_AP_RESEARCH_STRATEGY,
  SEED_SAT_MATH_PASSPORT_ADVANCED,
  SEED_SAT_MATH_ADDITIONAL_TOPICS,
  SEED_SAT_READING_LITERATURE,
  SEED_SAT_READING_HISTORY,
  SEED_SAT_READING_SCIENCE,
  SEED_SAT_WRITING_RHETORIC,
  SEED_JEE_MAIN_STRATEGY,
  SEED_JEE_ADVANCED_STRATEGY,
  SEED_JEE_PHYSICS_STRATEGY,
  SEED_JEE_CHEMISTRY_STRATEGY,
  SEED_JEE_MATH_STRATEGY,
  SEED_JEE_ROTATIONAL_MECHANICS,
  SEED_JEE_COORDINATE_GEOMETRY,
  SEED_NCLEX_PN_STRATEGY,
  SEED_GRE_SUBJECT_MATH,
  SEED_GRE_SUBJECT_PHYSICS,
  SEED_JEE_THERMODYNAMICS,
  SEED_JEE_ORGANIC_MECHANISMS,
  SEED_AP_PHYS1_FLUIDS_DENSITY_PRESSURE,
  SEED_AP_PHYS1_FLUIDS_BUOYANCY,
  SEED_AP_PHYS1_FLUIDS_FLOW,
  SEED_AP_PRECALC_POLYNOMIAL_RATIONAL,
  SEED_AP_PRECALC_EXPONENTIAL_LOGARITHMIC,
  SEED_AP_PRECALC_TRIGONOMETRIC_POLAR,
  SEED_AP_PRECALC_PARAMETRIC_VECTORS_MATRICES,
  SEED_NCLEX_NGN_OVERVIEW,
  SEED_NCLEX_NGN_CASE_STUDIES,
  SEED_NCLEX_NGN_STANDALONE_ITEMS,
  SEED_DIGITAL_SAT_FORMAT_OVERVIEW,
  SEED_DIGITAL_SAT_READING_WRITING_DOMAINS,
  SEED_DIGITAL_SAT_MATH_DOMAINS,
  SEED_AP_CSP_EXAM_FORMAT,
  SEED_AP_CSP_CREATE_PT,
  SEED_GMAT_FOCUS_FORMAT_OVERVIEW,
  SEED_GMAT_FOCUS_DATA_INSIGHTS,
  SEED_GMAT_FOCUS_QUANT_VERBAL,
  SEED_LSAT_FORMAT_2024,
  SEED_LSAT_LOGICAL_REASONING,
  SEED_LSAT_READING_COMPREHENSION,
  SEED_GRE_SHORTENED_FORMAT,
  SEED_GRE_SHORTENED_VERBAL,
  SEED_GRE_SHORTENED_QUANT,
  SEED_JEE_MAIN_2025_FORMAT,
  SEED_JEE_MAIN_2025_SYLLABUS_DELETIONS,
  SEED_JEE_MAIN_2025_PREP_STRATEGY,
  SEED_NEET_FORMAT_2025,
  SEED_NEET_BIO_CELL_BIOLOGY,
  SEED_NEET_BIO_GENETICS,
  SEED_NEET_BIO_HUMAN_PHYSIOLOGY,
  SEED_NEET_BIO_ECOLOGY,
  SEED_NEET_PHYSICS_MECHANICS,
  SEED_NEET_PHYSICS_ELECTROSTATICS,
  SEED_NEET_CHEMISTRY_ORGANIC,
  SEED_NEET_CHEMISTRY_EQUILIBRIUM,
  SEED_MCAT_FORMAT_2025,
  SEED_MCAT_BIOCHEM_AMINO_ACIDS,
  SEED_MCAT_BIOCHEM_ENZYMES,
  SEED_MCAT_BIO_ORGAN_SYSTEMS,
  SEED_MCAT_CHEM_PHYS_ACID_BASE,
  SEED_MCAT_CHEM_PHYS_THERMODYNAMICS,
  SEED_MCAT_PSYCH_SOC_RESEARCH,
  SEED_MCAT_CARS_STRATEGY,
  SEED_AP_WORLD_UNIT2_NETWORKS,
  SEED_AP_WORLD_UNIT3_LAND_EMPIRES,
  SEED_AP_WORLD_UNIT4_TRANSOCEANIC,
  SEED_AP_WORLD_UNIT9_GLOBALIZATION,
  SEED_AP_USH_PERIOD1_ENCOUNTER,
  SEED_AP_USH_PERIOD3_INDEPENDENCE,
  SEED_AP_USH_PERIOD6_GILDED_AGE,
  SEED_AP_USH_PERIOD7_IMPERIALISM_PROGRESSIVE,
  SEED_AP_CALC_LIMITS_CONTINUITY,
  SEED_AP_CALC_CHAIN_IMPLICIT,
  SEED_AP_CALC_CURVE_SKETCHING,
  SEED_AP_CALC_DIFFERENTIAL_EQUATIONS,
  SEED_AP_BIO_CENTRAL_DOGMA,
  SEED_AP_BIO_GENE_REGULATION_BIOTECH,
];

const seedById = new Map(SEED_PLANS.map((p) => [p.id, p]));

export async function getLessonPlan(id: string): Promise<LessonPlan | null> {
  const seed = seedById.get(id);
  if (seed) return seed;
  try {
    await connectDB();
    const doc = await LessonPlanModel.findById(id);
    return doc ? toLessonPlan(doc) : null;
  } catch {
    return null;
  }
}

export interface LessonPlanFilter {
  subject?: string;
  grade?: string;
  curriculum?: string;
  topic?: string;
  locale?: string;
}

/** Map a "band" id (k-2, 3-5, 6-8, 9-10, 11-12) to the set of single
 *  grade ids that fall within it. Identity for already-single grades.
 *  Plans are tagged with single grades (K, 2, 8); the demo page passes
 *  bands. Without expansion the filter `grade=6-8` would never match
 *  a plan tagged `grade=8`.
 *
 *  AP / SAT-ACT / IITJEE / Graduate / Nursing bands also expand to
 *  ['11', '12'] because most exam-prep + AP-level seed plans are
 *  tagged with the underlying grade rather than the level id. Without
 *  this expansion the picker would be empty for every level above
 *  high-school. */
function gradesInBand(band: string): string[] {
  const b = band.trim().toLowerCase();
  if (b === 'k-2') return ['k', '1', '2'];
  if (b === '3-5') return ['3', '4', '5'];
  if (b === '6-8') return ['6', '7', '8'];
  if (b === '9-10') return ['9', '10'];
  if (b === '11-12') return ['11', '12'];
  if (b === 'ap') return ['ap', '11', '12', '9-12'];
  if (b === 'sat-act') return ['sat-act', '11', '12'];
  if (b === 'iitjee') return ['iitjee', '11', '12'];
  if (b === 'medical-entrance') return ['medical-entrance', '11', '12'];
  if (b === 'graduate') return ['graduate', '11', '12'];
  if (b === 'nursing') return ['nursing', '11', '12'];
  if (b === 'college') return ['college', '12'];
  return [b];
}

/** Subject aliases — different seed batches used short ('sci', 'ss')
 *  vs long ('science', 'social-studies') ids interchangeably. The UI
 *  uses the long forms; this map lets a filter on the long form match
 *  plans tagged with either. */
const SUBJECT_ALIASES: Record<string, string[]> = {
  science: ['science', 'sci'],
  sci: ['science', 'sci'],
  'social-studies': ['social-studies', 'ss'],
  ss: ['social-studies', 'ss'],
};

function subjectMatches(filter: string | undefined, planSubject: string): boolean {
  if (!filter) return true;
  const aliases = SUBJECT_ALIASES[filter] ?? [filter];
  return aliases.includes(planSubject);
}

function gradeMatches(filterGrade: string | undefined, planGrade: string): boolean {
  if (!filterGrade) return true;
  const filterSet = gradesInBand(filterGrade);
  const plan = planGrade.trim().toLowerCase();
  return filterSet.includes(plan);
}

/** List plans matching the filter. Seeds + DB merged, deduped by id.
 *
 *  When filter.subject is 'test-prep', the plan is in-scope if any of:
 *    - plan.subject === 'test-prep' (modern direct tag)
 *    - plan.topic === 'test-prep' (legacy bucket marker)
 *    - plan.topic matches filter.topic (e.g. JEE/SAT/GRE seeds where
 *      plan.subject is the underlying area like 'math' but plan.topic
 *      is the specific exam ID like 'jee-advanced'). Without this
 *      third clause, the picker for IIT JEE / SAT / GRE returns empty
 *      because retagged seeds no longer carry topic='test-prep'. */
export async function listLessonPlans(filter: LessonPlanFilter = {}): Promise<LessonPlan[]> {
  const matches = (p: LessonPlan) => {
    let subjectOk: boolean;
    if (filter.subject === 'test-prep') {
      subjectOk =
        p.subject === 'test-prep' ||
        p.topic === 'test-prep' ||
        (!!filter.topic && p.topic === filter.topic);
    } else {
      subjectOk = subjectMatches(filter.subject, p.subject);
    }
    return (
      subjectOk &&
      gradeMatches(filter.grade, p.grade) &&
      (!filter.curriculum || p.curriculum === filter.curriculum) &&
      (!filter.topic || p.topic === filter.topic) &&
      (!filter.locale || p.locale === filter.locale)
    );
  };

  const seedHits = SEED_PLANS.filter(matches);
  let dbHits: LessonPlan[] = [];
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (filter.subject) {
      const aliases = SUBJECT_ALIASES[filter.subject] ?? [filter.subject];
      if (filter.subject === 'test-prep') {
        // Test-prep universe: subject='test-prep', legacy topic='test-prep',
        // or plan.topic matches the requested filter.topic (modern UI ID
        // like 'jee-advanced' / 'sat-math-full' / 'gre-quant').
        const or: Record<string, unknown>[] = [
          { subject: 'test-prep' },
          { topic: 'test-prep' },
        ];
        if (filter.topic) or.push({ topic: filter.topic });
        query.$or = or;
      } else if (aliases.length === 1) {
        query.subject = aliases[0];
      } else {
        query.subject = { $in: aliases };
      }
    }
    if (filter.grade) {
      // DB-side: expand band → set of grades. Mongo $in matches any.
      // Case-insensitive grades are matched via a lowercase regex set.
      const grades = gradesInBand(filter.grade);
      if (grades.length === 1) query.grade = { $regex: `^${grades[0]}$`, $options: 'i' };
      else query.grade = { $in: grades.flatMap((g) => [g, g.toUpperCase()]) };
    }
    if (filter.curriculum) query.curriculum = filter.curriculum;
    if (filter.topic) query.topic = filter.topic;
    if (filter.locale) query.locale = filter.locale;
    const docs = await LessonPlanModel.find(query).limit(200);
    dbHits = docs.map(toLessonPlan);
  } catch {
    // DB not configured / unreachable — seeds-only mode.
  }
  const seen = new Set<string>();
  const out: LessonPlan[] = [];
  for (const p of [...seedHits, ...dbHits]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

/** Upsert a plan. Validates via parseLessonPlan first. Returns the
 *  normalized, stored plan. */
export async function upsertLessonPlan(raw: unknown): Promise<LessonPlan> {
  const plan = parseLessonPlan(raw);
  await connectDB();
  await LessonPlanModel.findByIdAndUpdate(
    plan.id,
    {
      $set: {
        _id: plan.id,
        title: plan.title,
        curriculum: plan.curriculum,
        grade: plan.grade,
        subject: plan.subject,
        topic: plan.topic,
        locale: plan.locale,
        los: plan.los,
        estimatedMinutes: plan.estimatedMinutes,
        segments: plan.segments,
        prerequisites: plan.prerequisites,
        followUps: plan.followUps,
        source: plan.source,
        schemaVersion: plan.schemaVersion,
        metadata: plan.metadata,
      },
    },
    { upsert: true, new: true },
  );
  return plan;
}

export async function deleteLessonPlan(id: string): Promise<boolean> {
  if (seedById.has(id)) return false;       // seeds are immutable
  try {
    await connectDB();
    const res = await LessonPlanModel.deleteOne({ _id: id });
    return res.deletedCount === 1;
  } catch {
    return false;
  }
}
