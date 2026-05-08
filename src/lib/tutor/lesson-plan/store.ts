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
// AP Macro old plans deleted in cleanup commit — superseded by Units 2/3/4 plans
// in the AP Plans Initiative. Was: SEED_AP_MACRO_AD_AS, SEED_AP_MACRO_MONEY_BANKING.
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
import { SEED_AP_BIO_ENZYMES } from './seeds/ap-bio-enzymes';
import { SEED_AP_BIO_IMMUNE } from './seeds/ap-bio-immune';
// Batch 45 — AP Micro/Macro depth.
import { SEED_AP_MICRO_ELASTICITY } from './seeds/ap-micro-elasticity';
import { SEED_AP_MICRO_MARKET_STRUCTURES } from './seeds/ap-micro-market-structures';
import { SEED_AP_MICRO_FACTOR_MARKETS } from './seeds/ap-micro-factor-markets';
// AP Macro old plans deleted in cleanup commit — superseded by Units 2/3 plans.
// Was: SEED_AP_MACRO_FISCAL_POLICY, SEED_AP_MACRO_BUSINESS_CYCLE.
// AP Plans Initiative — AP Macro plans (47 across 6 units; AP Macro complete).
// See project_ap_plans_initiative.md.
import { SEED_AP_MACRO_U1_SCARCITY } from './seeds/ap-macro-u1-scarcity';
import { SEED_AP_MACRO_U1_RESOURCE_ALLOCATION } from './seeds/ap-macro-u1-resource-allocation';
import { SEED_AP_MACRO_U1_PPC } from './seeds/ap-macro-u1-ppc';
import { SEED_AP_MACRO_U1_COMPARATIVE_ADVANTAGE } from './seeds/ap-macro-u1-comparative-advantage';
import { SEED_AP_MACRO_U1_COST_BENEFIT } from './seeds/ap-macro-u1-cost-benefit';
import { SEED_AP_MACRO_U1_MARGINAL_ANALYSIS } from './seeds/ap-macro-u1-marginal-analysis';
import { SEED_AP_MACRO_U1_FRQ_PRACTICE } from './seeds/ap-macro-u1-frq-practice';
import { SEED_AP_MACRO_U2_CIRCULAR_FLOW_GDP } from './seeds/ap-macro-u2-circular-flow-gdp';
import { SEED_AP_MACRO_U2_GDP_LIMITATIONS } from './seeds/ap-macro-u2-gdp-limitations';
import { SEED_AP_MACRO_U2_UNEMPLOYMENT } from './seeds/ap-macro-u2-unemployment';
import { SEED_AP_MACRO_U2_PRICE_INDICES_INFLATION } from './seeds/ap-macro-u2-price-indices-inflation';
import { SEED_AP_MACRO_U2_COSTS_OF_INFLATION } from './seeds/ap-macro-u2-costs-of-inflation';
import { SEED_AP_MACRO_U2_REAL_VS_NOMINAL_GDP } from './seeds/ap-macro-u2-real-vs-nominal-gdp';
import { SEED_AP_MACRO_U2_BUSINESS_CYCLE } from './seeds/ap-macro-u2-business-cycle';
import { SEED_AP_MACRO_U2_FRQ_PRACTICE } from './seeds/ap-macro-u2-frq-practice';
import { SEED_AP_MACRO_U3_AGGREGATE_DEMAND } from './seeds/ap-macro-u3-aggregate-demand';
import { SEED_AP_MACRO_U3_MULTIPLIERS } from './seeds/ap-macro-u3-multipliers';
import { SEED_AP_MACRO_U3_SRAS } from './seeds/ap-macro-u3-sras';
import { SEED_AP_MACRO_U3_LRAS } from './seeds/ap-macro-u3-lras';
import { SEED_AP_MACRO_U3_EQUILIBRIUM_AD_AS } from './seeds/ap-macro-u3-equilibrium-ad-as';
import { SEED_AP_MACRO_U3_CHANGES_SHORT_RUN } from './seeds/ap-macro-u3-changes-short-run';
import { SEED_AP_MACRO_U3_LONG_RUN_SELF_ADJUST } from './seeds/ap-macro-u3-long-run-self-adjust';
import { SEED_AP_MACRO_U3_FISCAL_POLICY } from './seeds/ap-macro-u3-fiscal-policy';
import { SEED_AP_MACRO_U3_AUTOMATIC_STABILIZERS } from './seeds/ap-macro-u3-automatic-stabilizers';
import { SEED_AP_MACRO_U3_FRQ_PRACTICE } from './seeds/ap-macro-u3-frq-practice';
import { SEED_AP_MACRO_U4_FINANCIAL_ASSETS } from './seeds/ap-macro-u4-financial-assets';
import { SEED_AP_MACRO_U4_NOMINAL_REAL_RATES } from './seeds/ap-macro-u4-nominal-real-rates';
import { SEED_AP_MACRO_U4_FUNCTIONS_OF_MONEY } from './seeds/ap-macro-u4-functions-of-money';
import { SEED_AP_MACRO_U4_BANKING_MONEY_CREATION } from './seeds/ap-macro-u4-banking-money-creation';
import { SEED_AP_MACRO_U4_MONEY_MARKET } from './seeds/ap-macro-u4-money-market';
import { SEED_AP_MACRO_U4_MONETARY_POLICY } from './seeds/ap-macro-u4-monetary-policy';
import { SEED_AP_MACRO_U4_LOANABLE_FUNDS } from './seeds/ap-macro-u4-loanable-funds';
import { SEED_AP_MACRO_U4_FRQ_PRACTICE } from './seeds/ap-macro-u4-frq-practice';
import { SEED_AP_MACRO_U5_PHILLIPS_CURVE } from './seeds/ap-macro-u5-phillips-curve';
import { SEED_AP_MACRO_U5_MONEY_GROWTH_INFLATION } from './seeds/ap-macro-u5-money-growth-inflation';
import { SEED_AP_MACRO_U5_DEFICITS_DEBT } from './seeds/ap-macro-u5-deficits-debt';
import { SEED_AP_MACRO_U5_CROWDING_OUT_LONG_RUN } from './seeds/ap-macro-u5-crowding-out-long-run';
import { SEED_AP_MACRO_U5_ECONOMIC_GROWTH } from './seeds/ap-macro-u5-economic-growth';
import { SEED_AP_MACRO_U5_PUBLIC_POLICY_GROWTH } from './seeds/ap-macro-u5-public-policy-growth';
import { SEED_AP_MACRO_U5_FRQ_PRACTICE } from './seeds/ap-macro-u5-frq-practice';
import { SEED_AP_MACRO_U6_BALANCE_OF_PAYMENTS } from './seeds/ap-macro-u6-balance-of-payments';
import { SEED_AP_MACRO_U6_EXCHANGE_RATES } from './seeds/ap-macro-u6-exchange-rates';
import { SEED_AP_MACRO_U6_FX_MARKET } from './seeds/ap-macro-u6-fx-market';
import { SEED_AP_MACRO_U6_FX_DETERMINANTS } from './seeds/ap-macro-u6-fx-determinants';
import { SEED_AP_MACRO_U6_FX_EFFECTS } from './seeds/ap-macro-u6-fx-effects';
import { SEED_AP_MACRO_U6_TRADE_CAPITAL_FLOWS } from './seeds/ap-macro-u6-trade-capital-flows';
import { SEED_AP_MACRO_U6_FRQ_PRACTICE } from './seeds/ap-macro-u6-frq-practice';
// AP Calc BC — Initiative course 2 of 6. Unit 1 (Limits and Continuity).
import { SEED_AP_CALCBC_U1_INTRODUCING_CALCULUS } from './seeds/ap-calcbc-u1-introducing-calculus';
import { SEED_AP_CALCBC_U1_DEFINING_LIMITS } from './seeds/ap-calcbc-u1-defining-limits';
import { SEED_AP_CALCBC_U1_LIMITS_GRAPHS_TABLES } from './seeds/ap-calcbc-u1-limits-graphs-tables';
import { SEED_AP_CALCBC_U1_LIMITS_ALGEBRAIC_PROPERTIES } from './seeds/ap-calcbc-u1-limits-algebraic-properties';
import { SEED_AP_CALCBC_U1_LIMITS_ALGEBRAIC_MANIPULATION } from './seeds/ap-calcbc-u1-limits-algebraic-manipulation';
import { SEED_AP_CALCBC_U1_LIMITS_STRATEGY } from './seeds/ap-calcbc-u1-limits-strategy';
import { SEED_AP_CALCBC_U1_SQUEEZE_THEOREM } from './seeds/ap-calcbc-u1-squeeze-theorem';
import { SEED_AP_CALCBC_U1_DISCONTINUITY_TYPES } from './seeds/ap-calcbc-u1-discontinuity-types';
import { SEED_AP_CALCBC_U1_CONTINUITY } from './seeds/ap-calcbc-u1-continuity';
import { SEED_AP_CALCBC_U1_REMOVING_DISCONTINUITIES } from './seeds/ap-calcbc-u1-removing-discontinuities';
import { SEED_AP_CALCBC_U1_INFINITE_LIMITS_ASYMPTOTES } from './seeds/ap-calcbc-u1-infinite-limits-asymptotes';
import { SEED_AP_CALCBC_U1_LIMITS_AT_INFINITY } from './seeds/ap-calcbc-u1-limits-at-infinity';
import { SEED_AP_CALCBC_U1_IVT } from './seeds/ap-calcbc-u1-ivt';
import { SEED_AP_CALCBC_U1_FRQ_PRACTICE } from './seeds/ap-calcbc-u1-frq-practice';
import { SEED_AP_CALCBC_U2_DERIVATIVE_DEFINITION } from './seeds/ap-calcbc-u2-derivative-definition';
import { SEED_AP_CALCBC_U2_ESTIMATING_DERIVATIVES } from './seeds/ap-calcbc-u2-estimating-derivatives';
import { SEED_AP_CALCBC_U2_DIFFERENTIABILITY_CONTINUITY } from './seeds/ap-calcbc-u2-differentiability-continuity';
import { SEED_AP_CALCBC_U2_POWER_RULE_LINEARITY } from './seeds/ap-calcbc-u2-power-rule-linearity';
import { SEED_AP_CALCBC_U2_TRANSCENDENTAL_DERIVATIVES } from './seeds/ap-calcbc-u2-transcendental-derivatives';
import { SEED_AP_CALCBC_U2_PRODUCT_RULE } from './seeds/ap-calcbc-u2-product-rule';
import { SEED_AP_CALCBC_U2_QUOTIENT_RULE } from './seeds/ap-calcbc-u2-quotient-rule';
import { SEED_AP_CALCBC_U2_FRQ_PRACTICE } from './seeds/ap-calcbc-u2-frq-practice';
import { SEED_AP_CALCBC_U3_CHAIN_RULE } from './seeds/ap-calcbc-u3-chain-rule';
import { SEED_AP_CALCBC_U3_IMPLICIT_DIFFERENTIATION } from './seeds/ap-calcbc-u3-implicit-differentiation';
import { SEED_AP_CALCBC_U3_DERIVATIVES_INVERSE } from './seeds/ap-calcbc-u3-derivatives-inverse';
import { SEED_AP_CALCBC_U3_HIGHER_ORDER_DERIVATIVES } from './seeds/ap-calcbc-u3-higher-order-derivatives';
import { SEED_AP_CALCBC_U3_FRQ_PRACTICE } from './seeds/ap-calcbc-u3-frq-practice';
import { SEED_AP_CALCBC_U4_DERIVATIVE_CONTEXT } from './seeds/ap-calcbc-u4-derivative-context';
import { SEED_AP_CALCBC_U4_MOTION } from './seeds/ap-calcbc-u4-motion';
import { SEED_AP_CALCBC_U4_RELATED_RATES } from './seeds/ap-calcbc-u4-related-rates';
import { SEED_AP_CALCBC_U4_LINEARIZATION } from './seeds/ap-calcbc-u4-linearization';
import { SEED_AP_CALCBC_U4_LHOPITAL } from './seeds/ap-calcbc-u4-lhopital';
import { SEED_AP_CALCBC_U4_FRQ_PRACTICE } from './seeds/ap-calcbc-u4-frq-practice';
import { SEED_AP_CALCBC_U5_MVT_EVT } from './seeds/ap-calcbc-u5-mvt-evt';
import { SEED_AP_CALCBC_U5_FIRST_DERIVATIVE_ANALYSIS } from './seeds/ap-calcbc-u5-first-derivative-analysis';
import { SEED_AP_CALCBC_U5_CONCAVITY_SECOND_DERIVATIVE } from './seeds/ap-calcbc-u5-concavity-second-derivative';
import { SEED_AP_CALCBC_U5_GRAPHING_F_FP_FPP } from './seeds/ap-calcbc-u5-graphing-f-fp-fpp';
import { SEED_AP_CALCBC_U5_OPTIMIZATION } from './seeds/ap-calcbc-u5-optimization';
import { SEED_AP_CALCBC_U5_FRQ_PRACTICE } from './seeds/ap-calcbc-u5-frq-practice';
import { SEED_AP_CALCBC_U6_RIEMANN_SUMS } from './seeds/ap-calcbc-u6-riemann-sums';
import { SEED_AP_CALCBC_U6_FTC } from './seeds/ap-calcbc-u6-ftc';
import { SEED_AP_CALCBC_U6_INTEGRAL_PROPERTIES } from './seeds/ap-calcbc-u6-integral-properties';
import { SEED_AP_CALCBC_U6_BASIC_ANTIDERIVATIVES } from './seeds/ap-calcbc-u6-basic-antiderivatives';
import { SEED_AP_CALCBC_U6_U_SUBSTITUTION } from './seeds/ap-calcbc-u6-u-substitution';
import { SEED_AP_CALCBC_U6_INTEGRATION_BY_PARTS } from './seeds/ap-calcbc-u6-integration-by-parts';
import { SEED_AP_CALCBC_U6_PARTIAL_FRACTIONS } from './seeds/ap-calcbc-u6-partial-fractions';
import { SEED_AP_CALCBC_U6_IMPROPER_INTEGRALS } from './seeds/ap-calcbc-u6-improper-integrals';
import { SEED_AP_CALCBC_U6_INTEGRATION_STRATEGY } from './seeds/ap-calcbc-u6-integration-strategy';
import { SEED_AP_CALCBC_U6_FRQ_PRACTICE } from './seeds/ap-calcbc-u6-frq-practice';
import { SEED_AP_CALCBC_U7_MODELING_VERIFYING } from './seeds/ap-calcbc-u7-modeling-verifying';
import { SEED_AP_CALCBC_U7_SLOPE_FIELDS } from './seeds/ap-calcbc-u7-slope-fields';
import { SEED_AP_CALCBC_U7_EULERS_METHOD } from './seeds/ap-calcbc-u7-eulers-method';
import { SEED_AP_CALCBC_U7_SEPARATION_OF_VARIABLES } from './seeds/ap-calcbc-u7-separation-of-variables';
import { SEED_AP_CALCBC_U7_EXPONENTIAL_MODELS } from './seeds/ap-calcbc-u7-exponential-models';
import { SEED_AP_CALCBC_U7_LOGISTIC_MODELS } from './seeds/ap-calcbc-u7-logistic-models';
import { SEED_AP_CALCBC_U7_FRQ_PRACTICE } from './seeds/ap-calcbc-u7-frq-practice';
import { SEED_AP_CALCBC_U8_APPLICATIONS } from './seeds/ap-calcbc-u8-applications';
import { SEED_AP_CALCBC_U8_AREA_BETWEEN_CURVES } from './seeds/ap-calcbc-u8-area-between-curves';
import { SEED_AP_CALCBC_U8_VOLUMES_CROSS_SECTIONS } from './seeds/ap-calcbc-u8-volumes-cross-sections';
import { SEED_AP_CALCBC_U8_VOLUMES_REVOLUTION } from './seeds/ap-calcbc-u8-volumes-revolution';
import { SEED_AP_CALCBC_U8_ARC_LENGTH } from './seeds/ap-calcbc-u8-arc-length';
import { SEED_AP_CALCBC_U8_FRQ_PRACTICE } from './seeds/ap-calcbc-u8-frq-practice';
import { SEED_AP_CALCBC_U9_PARAMETRIC } from './seeds/ap-calcbc-u9-parametric';
import { SEED_AP_CALCBC_U9_PARAMETRIC_ARC_LENGTH } from './seeds/ap-calcbc-u9-parametric-arc-length';
import { SEED_AP_CALCBC_U9_VECTOR_VALUED } from './seeds/ap-calcbc-u9-vector-valued';
import { SEED_AP_CALCBC_U9_POLAR_COORDINATES } from './seeds/ap-calcbc-u9-polar-coordinates';
import { SEED_AP_CALCBC_U9_POLAR_AREA } from './seeds/ap-calcbc-u9-polar-area';
import { SEED_AP_CALCBC_U9_FRQ_PRACTICE } from './seeds/ap-calcbc-u9-frq-practice';
import { SEED_AP_CALCBC_U10_SERIES_CONVERGENCE } from './seeds/ap-calcbc-u10-series-convergence';
import { SEED_AP_CALCBC_U10_CONVERGENCE_TESTS } from './seeds/ap-calcbc-u10-convergence-tests';
import { SEED_AP_CALCBC_U10_ALTERNATING_SERIES } from './seeds/ap-calcbc-u10-alternating-series';
import { SEED_AP_CALCBC_U10_RATIO_TEST } from './seeds/ap-calcbc-u10-ratio-test';
import { SEED_AP_CALCBC_U10_TAYLOR_POLYNOMIAL } from './seeds/ap-calcbc-u10-taylor-polynomial';
import { SEED_AP_CALCBC_U10_POWER_SERIES } from './seeds/ap-calcbc-u10-power-series';
import { SEED_AP_CALCBC_U10_MACLAURIN_SERIES } from './seeds/ap-calcbc-u10-maclaurin-series';
import { SEED_AP_CALCBC_U10_FRQ_PRACTICE } from './seeds/ap-calcbc-u10-frq-practice';
// AP Statistics — new format (CED-aligned).
import { SEED_AP_STATS_U1_CATEGORICAL_DATA } from './seeds/ap-stats-u1-categorical-data';
import { SEED_AP_STATS_U1_QUANTITATIVE_GRAPHS } from './seeds/ap-stats-u1-quantitative-graphs';
import { SEED_AP_STATS_U1_DISTRIBUTION_SHAPE } from './seeds/ap-stats-u1-distribution-shape';
import { SEED_AP_STATS_U1_SUMMARY_STATISTICS } from './seeds/ap-stats-u1-summary-statistics';
import { SEED_AP_STATS_U1_COMPARING_DISTRIBUTIONS } from './seeds/ap-stats-u1-comparing-distributions';
import { SEED_AP_STATS_U1_NORMAL_DISTRIBUTION } from './seeds/ap-stats-u1-normal-distribution';
import { SEED_AP_STATS_U1_FRQ_PRACTICE } from './seeds/ap-stats-u1-frq-practice';
import { SEED_AP_STATS_U2_TWO_CATEGORICAL } from './seeds/ap-stats-u2-two-categorical';
import { SEED_AP_STATS_U2_SCATTERPLOTS } from './seeds/ap-stats-u2-scatterplots';
import { SEED_AP_STATS_U2_CORRELATION } from './seeds/ap-stats-u2-correlation';
import { SEED_AP_STATS_U2_LINEAR_REGRESSION } from './seeds/ap-stats-u2-linear-regression';
import { SEED_AP_STATS_U2_RESIDUALS } from './seeds/ap-stats-u2-residuals';
import { SEED_AP_STATS_U2_FRQ_PRACTICE } from './seeds/ap-stats-u2-frq-practice';
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
// Batch 56 — AP Bio Unit 6 depth: central dogma + gene regulation/biotech.
import { SEED_AP_BIO_CENTRAL_DOGMA } from './seeds/ap-bio-central-dogma';
import { SEED_AP_BIO_GENE_REGULATION_BIOTECH } from './seeds/ap-bio-gene-regulation-biotech';
// Batch 57 — GCSE Math Higher (UK exam prep): full topic cluster across
// number, algebra, geometry, trig, mensuration, statistics, probability.
import { SEED_GCSE_MATH_SURDS_INDICES } from './seeds/gcse-math-surds-indices';
import { SEED_GCSE_MATH_BOUNDS_ERROR } from './seeds/gcse-math-bounds-error';
import { SEED_GCSE_MATH_ALGEBRA_FACTOR } from './seeds/gcse-math-algebra-factor';
import { SEED_GCSE_MATH_QUADRATIC_COMPLETE_SQUARE } from './seeds/gcse-math-quadratic-complete-square';
import { SEED_GCSE_MATH_SIMULTANEOUS_LIN_QUAD } from './seeds/gcse-math-simultaneous-lin-quad';
import { SEED_GCSE_MATH_SEQUENCES } from './seeds/gcse-math-sequences';
import { SEED_GCSE_MATH_FUNCTIONS_TRANSFORMATIONS } from './seeds/gcse-math-functions-transformations';
import { SEED_GCSE_MATH_RATIO_PROPORTION_RATE } from './seeds/gcse-math-ratio-proportion-rate';
import { SEED_GCSE_MATH_CIRCLE_THEOREMS } from './seeds/gcse-math-circle-theorems';
import { SEED_GCSE_MATH_VECTORS } from './seeds/gcse-math-vectors';
import { SEED_GCSE_MATH_SINE_COSINE_RULES } from './seeds/gcse-math-sine-cosine-rules';
import { SEED_GCSE_MATH_TRIG_EXACT_VALUES } from './seeds/gcse-math-trig-exact-values';
import { SEED_GCSE_MATH_ARCS_SECTORS } from './seeds/gcse-math-arcs-sectors';
import { SEED_GCSE_MATH_3D_VOLUME_SA } from './seeds/gcse-math-3d-volume-sa';
import { SEED_GCSE_MATH_CUMULATIVE_FREQ } from './seeds/gcse-math-cumulative-freq';
import { SEED_GCSE_MATH_HISTOGRAMS } from './seeds/gcse-math-histograms';
import { SEED_GCSE_MATH_PROBABILITY_TREES } from './seeds/gcse-math-probability-trees';
import { SEED_GCSE_MATH_CONDITIONAL_PROB } from './seeds/gcse-math-conditional-prob';
// Batch 58 — IB DP Math Analysis & Approaches: full topic cluster.
import { SEED_IBDP_AA_SEQUENCES_SERIES } from './seeds/ibdp-aa-sequences-series';
import { SEED_IBDP_AA_EXP_LOGS } from './seeds/ibdp-aa-exp-logs';
import { SEED_IBDP_AA_BINOMIAL_THEOREM } from './seeds/ibdp-aa-binomial-theorem';
import { SEED_IBDP_AA_FUNCTIONS_INVERSES } from './seeds/ibdp-aa-functions-inverses';
import { SEED_IBDP_AA_QUADRATICS_DEEP } from './seeds/ibdp-aa-quadratics-deep';
import { SEED_IBDP_AA_POLY_RATIONAL } from './seeds/ibdp-aa-poly-rational';
import { SEED_IBDP_AA_TRIG_RADIANS } from './seeds/ibdp-aa-trig-radians';
import { SEED_IBDP_AA_TRIG_ID_EQUATIONS } from './seeds/ibdp-aa-trig-id-equations';
import { SEED_IBDP_AA_VECTORS_2D_3D } from './seeds/ibdp-aa-vectors-2d-3d';
import { SEED_IBDP_AA_VECTOR_LINES_PLANES } from './seeds/ibdp-aa-vector-lines-planes';
import { SEED_IBDP_AA_STATISTICS_DESCRIPTIVE } from './seeds/ibdp-aa-statistics-descriptive';
import { SEED_IBDP_AA_PROBABILITY } from './seeds/ibdp-aa-probability';
import { SEED_IBDP_AA_BINOMIAL_DISTRIBUTION } from './seeds/ibdp-aa-binomial-distribution';
import { SEED_IBDP_AA_NORMAL_DISTRIBUTION } from './seeds/ibdp-aa-normal-distribution';
import { SEED_IBDP_AA_LIMITS_CONTINUITY } from './seeds/ibdp-aa-limits-continuity';
import { SEED_IBDP_AA_DIFFERENTIATION } from './seeds/ibdp-aa-differentiation';
import { SEED_IBDP_AA_INTEGRATION } from './seeds/ibdp-aa-integration';
import { SEED_IBDP_AA_DIFFERENTIAL_EQUATIONS } from './seeds/ibdp-aa-differential-equations';
// Batch 59 — GRE Quantitative Reasoning (content topics).
import { SEED_GRE_Q_ARITHMETIC } from './seeds/gre-q-arithmetic';
import { SEED_GRE_Q_NUMBER_PROPERTIES } from './seeds/gre-q-number-properties';
import { SEED_GRE_Q_EXPONENTS_ROOTS } from './seeds/gre-q-exponents-roots';
import { SEED_GRE_Q_ALGEBRA_EQUATIONS } from './seeds/gre-q-algebra-equations';
import { SEED_GRE_Q_WORD_PROBLEMS } from './seeds/gre-q-word-problems';
import { SEED_GRE_Q_COORDINATE_GEOMETRY } from './seeds/gre-q-coordinate-geometry';
import { SEED_GRE_Q_LINES_ANGLES_TRIANGLES } from './seeds/gre-q-lines-angles-triangles';
import { SEED_GRE_Q_QUADRILATERALS } from './seeds/gre-q-quadrilaterals';
import { SEED_GRE_Q_CIRCLES } from './seeds/gre-q-circles';
import { SEED_GRE_Q_3D_GEOMETRY } from './seeds/gre-q-3d-geometry';
import { SEED_GRE_Q_DATA_INTERPRETATION } from './seeds/gre-q-data-interpretation';
import { SEED_GRE_Q_STATISTICS } from './seeds/gre-q-statistics';
import { SEED_GRE_Q_PROBABILITY_COUNTING } from './seeds/gre-q-probability-counting';
import { SEED_GRE_Q_QUANT_COMPARISON } from './seeds/gre-q-quant-comparison';
// Batch 60 — JEE Main Physics content (10 high-priority topics).
import { SEED_JEE_PHYS_KINEMATICS } from './seeds/jee-phys-kinematics';
import { SEED_JEE_PHYS_LAWS_MOTION } from './seeds/jee-phys-laws-motion';
import { SEED_JEE_PHYS_WORK_ENERGY_POWER } from './seeds/jee-phys-work-energy-power';
import { SEED_JEE_PHYS_GRAVITATION } from './seeds/jee-phys-gravitation';
import { SEED_JEE_PHYS_OSCILLATIONS } from './seeds/jee-phys-oscillations';
import { SEED_JEE_PHYS_WAVES } from './seeds/jee-phys-waves';
import { SEED_JEE_PHYS_ELECTROSTATICS } from './seeds/jee-phys-electrostatics';
import { SEED_JEE_PHYS_CURRENT_ELECTRICITY } from './seeds/jee-phys-current-electricity';
import { SEED_JEE_PHYS_MAGNETIC_EFFECTS } from './seeds/jee-phys-magnetic-effects';
import { SEED_JEE_PHYS_EM_INDUCTION } from './seeds/jee-phys-em-induction';
import { SEED_JEE_PHYS_EM_WAVES_OPTICS } from './seeds/jee-phys-em-waves-optics';
import { SEED_JEE_PHYS_ATOMS_NUCLEI } from './seeds/jee-phys-atoms-nuclei';
// Batch 61 — JEE Main Physics completion (final 4 topics).
import { SEED_JEE_PHYS_KINETIC_THEORY } from './seeds/jee-phys-kinetic-theory';
import { SEED_JEE_PHYS_DUAL_NATURE } from './seeds/jee-phys-dual-nature';
import { SEED_JEE_PHYS_SEMICONDUCTORS } from './seeds/jee-phys-semiconductors';
import { SEED_JEE_PHYS_SOLID_LIQUID_PROPERTIES } from './seeds/jee-phys-solid-liquid-properties';
// Batch 62 — Grades 3-5 ELA cluster (20 plans).
import { SEED_G35_ELA_MULTISYLLABIC } from './seeds/g35-ela-multisyllabic';
import { SEED_G35_ELA_PREFIXES_SUFFIXES } from './seeds/g35-ela-prefixes-suffixes';
import { SEED_G35_ELA_CONTEXT_CLUES } from './seeds/g35-ela-context-clues';
import { SEED_G35_ELA_THEME } from './seeds/g35-ela-theme';
import { SEED_G35_ELA_INFERENCE_EVIDENCE } from './seeds/g35-ela-inference-evidence';
import { SEED_G35_ELA_AUTHORS_PURPOSE } from './seeds/g35-ela-authors-purpose';
import { SEED_G35_ELA_POINT_OF_VIEW } from './seeds/g35-ela-point-of-view';
import { SEED_G35_ELA_FIGURATIVE_LANGUAGE } from './seeds/g35-ela-figurative-language';
import { SEED_G35_ELA_TEXT_FEATURES } from './seeds/g35-ela-text-features';
import { SEED_G35_ELA_SUMMARIZING } from './seeds/g35-ela-summarizing';
import { SEED_G35_ELA_PARAGRAPH_STRUCTURE } from './seeds/g35-ela-paragraph-structure';
import { SEED_G35_ELA_NARRATIVE_DEVELOPED } from './seeds/g35-ela-narrative-developed';
import { SEED_G35_ELA_INFORMATIONAL_WRITING } from './seeds/g35-ela-informational-writing';
import { SEED_G35_ELA_OPINION_ARGUMENT } from './seeds/g35-ela-opinion-argument';
import { SEED_G35_ELA_EDITING_REVISION } from './seeds/g35-ela-editing-revision';
import { SEED_G35_ELA_SUBJECT_VERB_AGREEMENT } from './seeds/g35-ela-subject-verb-agreement';
import { SEED_G35_ELA_PRONOUN_USAGE } from './seeds/g35-ela-pronoun-usage';
import { SEED_G35_ELA_VERB_TENSES } from './seeds/g35-ela-verb-tenses';
import { SEED_G35_ELA_COMMAS_QUOTES } from './seeds/g35-ela-commas-quotes';
import { SEED_G35_ELA_RESEARCH_BASICS } from './seeds/g35-ela-research-basics';
// Batch 63 — Grades 6-8 ELA cluster (18 plans).
import { SEED_G68_ELA_LITERARY_ANALYSIS } from './seeds/g68-ela-literary-analysis';
import { SEED_G68_ELA_NARRATIVE_ARC } from './seeds/g68-ela-narrative-arc';
import { SEED_G68_ELA_SYMBOLISM_MOTIF } from './seeds/g68-ela-symbolism-motif';
import { SEED_G68_ELA_TONE_MOOD } from './seeds/g68-ela-tone-mood';
import { SEED_G68_ELA_ARGUMENT_CER } from './seeds/g68-ela-argument-cer';
import { SEED_G68_ELA_COUNTERCLAIM } from './seeds/g68-ela-counterclaim';
import { SEED_G68_ELA_INFORMATIONAL_RESEARCH } from './seeds/g68-ela-informational-research';
import { SEED_G68_ELA_NARRATIVE_DEVELOPED } from './seeds/g68-ela-narrative-developed';
import { SEED_G68_ELA_CITING_EVIDENCE } from './seeds/g68-ela-citing-evidence';
import { SEED_G68_ELA_SENTENCE_VARIETY } from './seeds/g68-ela-sentence-variety';
import { SEED_G68_ELA_ACTIVE_PASSIVE_VOICE } from './seeds/g68-ela-active-passive-voice';
import { SEED_G68_ELA_WORD_CHOICE } from './seeds/g68-ela-word-choice';
import { SEED_G68_ELA_REVISING_CLARITY } from './seeds/g68-ela-revising-clarity';
import { SEED_G68_ELA_PHRASES_CLAUSES } from './seeds/g68-ela-phrases-clauses';
import { SEED_G68_ELA_ADVANCED_PUNCTUATION } from './seeds/g68-ela-advanced-punctuation';
import { SEED_G68_ELA_COMPARING_TEXTS } from './seeds/g68-ela-comparing-texts';
import { SEED_G68_ELA_ANALYZING_MEDIA } from './seeds/g68-ela-analyzing-media';
import { SEED_G68_ELA_GREEK_LATIN_ROOTS } from './seeds/g68-ela-greek-latin-roots';
// Batch 64 — Grades 9-12 ELA cluster (20 plans).
import { SEED_G912_ELA_CLOSE_READING } from './seeds/g912-ela-close-reading';
import { SEED_G912_ELA_LITERARY_DEVICES } from './seeds/g912-ela-literary-devices';
import { SEED_G912_ELA_RHETORIC_EPL } from './seeds/g912-ela-rhetoric-epl';
import { SEED_G912_ELA_ARGUMENT_ANALYSIS } from './seeds/g912-ela-argument-analysis';
import { SEED_G912_ELA_RESEARCH_PAPER } from './seeds/g912-ela-research-paper';
import { SEED_G912_ELA_SYNTHESIS_ESSAY } from './seeds/g912-ela-synthesis-essay';
import { SEED_G912_ELA_MLA_APA_CITATION } from './seeds/g912-ela-mla-apa-citation';
import { SEED_G912_ELA_ANNOTATED_BIB } from './seeds/g912-ela-annotated-bib';
import { SEED_G912_ELA_LOGICAL_FALLACIES } from './seeds/g912-ela-logical-fallacies';
import { SEED_G912_ELA_CRITICAL_READING } from './seeds/g912-ela-critical-reading';
import { SEED_G912_ELA_NARRATIVE_ADVANCED } from './seeds/g912-ela-narrative-advanced';
import { SEED_G912_ELA_ANALYTICAL_ESSAY } from './seeds/g912-ela-analytical-essay';
import { SEED_G912_ELA_LITERATURE_PERIODS } from './seeds/g912-ela-literature-periods';
import { SEED_G912_ELA_SHAKESPEARE_BASICS } from './seeds/g912-ela-shakespeare-basics';
import { SEED_G912_ELA_POETRY_ANALYSIS } from './seeds/g912-ela-poetry-analysis';
import { SEED_G912_ELA_SHORT_STORY_CRAFT } from './seeds/g912-ela-short-story-craft';
import { SEED_G912_ELA_GENRE_COMPARISON } from './seeds/g912-ela-genre-comparison';
import { SEED_G912_ELA_SPEECH_PRESENTATION } from './seeds/g912-ela-speech-presentation';
import { SEED_G912_ELA_VOCAB_ADVANCED } from './seeds/g912-ela-vocab-advanced';
import { SEED_G912_ELA_COLLEGE_ESSAY } from './seeds/g912-ela-college-essay';
// Batch 65 — K-2 ELA cluster (11 plans).
import { SEED_K2_ELA_PHONEMIC_AWARENESS } from './seeds/k2-ela-phonemic-awareness';
import { SEED_K2_ELA_CVC_DECODING } from './seeds/k2-ela-cvc-decoding';
import { SEED_K2_ELA_VOWEL_TEAMS } from './seeds/k2-ela-vowel-teams';
import { SEED_K2_ELA_SENTENCE_STRUCTURE } from './seeds/k2-ela-sentence-structure';
import { SEED_K2_ELA_STORY_ELEMENTS } from './seeds/k2-ela-story-elements';
import { SEED_K2_ELA_MAIN_IDEA_DETAILS } from './seeds/k2-ela-main-idea-details';
import { SEED_K2_ELA_SEQUENCING } from './seeds/k2-ela-sequencing';
import { SEED_K2_ELA_COMPARE_CONTRAST } from './seeds/k2-ela-compare-contrast';
import { SEED_K2_ELA_ASKING_QUESTIONS } from './seeds/k2-ela-asking-questions';
import { SEED_K2_ELA_NARRATIVE_WRITING } from './seeds/k2-ela-narrative-writing';
import { SEED_K2_ELA_OPINION_WRITING } from './seeds/k2-ela-opinion-writing';
// Batch 66 — K-2 SS cluster (5 plans, fills tracker gaps).
import { SEED_K2_SS_COMMUNITY_INTRO } from './seeds/k2-ss-community-intro';
import { SEED_K2_SS_MAPS_SYMBOLS } from './seeds/k2-ss-maps-symbols';
import { SEED_K2_SS_RULES_LAWS } from './seeds/k2-ss-rules-laws';
import { SEED_K2_SS_TIMELINE_INTRO } from './seeds/k2-ss-timeline-intro';
import { SEED_K2_SS_HOLIDAYS_TRADITIONS } from './seeds/k2-ss-holidays-traditions';
// Batch 67 — Grades 3-5 SS cluster (11 plans, fills tracker gaps).
import { SEED_G35_SS_NATIVE_AMERICAN } from './seeds/g35-ss-native-american';
import { SEED_G35_SS_AMERICAN_REVOLUTION } from './seeds/g35-ss-american-revolution';
import { SEED_G35_SS_CONSTITUTION_INTRO } from './seeds/g35-ss-constitution-intro';
import { SEED_G35_SS_WESTWARD_EXPANSION } from './seeds/g35-ss-westward-expansion';
import { SEED_G35_SS_CIVIL_WAR_OVERVIEW } from './seeds/g35-ss-civil-war-overview';
import { SEED_G35_SS_STATE_GOVERNMENTS } from './seeds/g35-ss-state-governments';
import { SEED_G35_SS_CITIZENSHIP_RIGHTS } from './seeds/g35-ss-citizenship-rights';
import { SEED_G35_SS_WORLD_CULTURES } from './seeds/g35-ss-world-cultures';
import { SEED_G35_SS_ECONOMICS_BASICS } from './seeds/g35-ss-economics-basics';
import { SEED_G35_SS_LAT_LONG_MAPPING } from './seeds/g35-ss-lat-long-mapping';
import { SEED_G35_SS_CLIMATE_GEOGRAPHY } from './seeds/g35-ss-climate-geography';
// Batch 68 — Grades 6-8 SS cluster (10 plans, fills tracker gaps).
import { SEED_G68_SS_COLONIAL_DEEPER } from './seeds/g68-ss-colonial-deeper';
import { SEED_G68_SS_CONSTITUTION_BILL_RIGHTS } from './seeds/g68-ss-constitution-bill-rights';
import { SEED_G68_SS_CIVIL_WAR_RECONSTRUCTION } from './seeds/g68-ss-civil-war-reconstruction';
import { SEED_G68_SS_IMPERIALISM_WWI } from './seeds/g68-ss-imperialism-wwi';
import { SEED_G68_SS_DEPRESSION_WWII } from './seeds/g68-ss-depression-wwii';
import { SEED_G68_SS_CIVIL_RIGHTS_MOVEMENT } from './seeds/g68-ss-civil-rights-movement';
import { SEED_G68_SS_COLD_WAR_OVERVIEW } from './seeds/g68-ss-cold-war-overview';
import { SEED_G68_SS_WORLD_RELIGIONS } from './seeds/g68-ss-world-religions';
import { SEED_G68_SS_WORLD_REGIONS_GEOGRAPHY } from './seeds/g68-ss-world-regions-geography';
import { SEED_G68_SS_ECONOMIC_SYSTEMS } from './seeds/g68-ss-economic-systems';
// Batch 69 — Grades 9-12 SS cluster (6 plans, fills tracker gaps).
import { SEED_G912_SS_PRE_COLUMBIAN } from './seeds/g912-ss-pre-columbian';
import { SEED_G912_SS_ANTEBELLUM_SLAVERY } from './seeds/g912-ss-antebellum-slavery';
import { SEED_G912_SS_WWII_HOME_FRONT } from './seeds/g912-ss-wwii-home-front';
import { SEED_G912_SS_EARLY_MODERN_WORLD } from './seeds/g912-ss-early-modern-world';
import { SEED_G912_SS_MICROECONOMICS_INTRO } from './seeds/g912-ss-microeconomics-intro';
import { SEED_G912_SS_MACROECONOMICS_INTRO } from './seeds/g912-ss-macroeconomics-intro';
// Computer Science batch — taxonomy coverage for MS / HS / IB / College.
import { SEED_G68_CS_INTRO_CODING } from './seeds/g68-cs-intro-coding';
import { SEED_G68_CS_SCRATCH_BLOCK } from './seeds/g68-cs-scratch-block';
import { SEED_G68_CS_WEB_BASICS } from './seeds/g68-cs-web-basics';
import { SEED_G68_CS_DIGITAL_LITERACY } from './seeds/g68-cs-digital-literacy';
import { SEED_G910_CS_INTRO_PYTHON } from './seeds/g910-cs-intro-python';
import { SEED_G910_CS_WEB_DEVELOPMENT } from './seeds/g910-cs-web-development';
import { SEED_G910_CS_DATA_DATABASES } from './seeds/g910-cs-data-databases';
import { SEED_G910_CS_CYBERSECURITY } from './seeds/g910-cs-cybersecurity';
import { SEED_G1112_CS_DATA_STRUCTURES } from './seeds/g1112-cs-data-structures';
import { SEED_G1112_CS_OOP } from './seeds/g1112-cs-oop';
import { SEED_G1112_CS_MOBILE_DEVELOPMENT } from './seeds/g1112-cs-mobile-development';
import { SEED_IB_CS_SYSTEMS_FUNDAMENTALS } from './seeds/ib-cs-systems-fundamentals';
import { SEED_COLLEGE_CS101 } from './seeds/college-cs101';
import { SEED_COLLEGE_CS_DATA_STRUCTURES } from './seeds/college-cs-data-structures';
import { SEED_COLLEGE_CS_ALGORITHMS } from './seeds/college-cs-algorithms';
import { SEED_COLLEGE_CS_DISCRETE_MATH } from './seeds/college-cs-discrete-math';
import { SEED_COLLEGE_CS_INTRO_AI } from './seeds/college-cs-intro-ai';
// Science HS 9-10 + College batch.
import { SEED_G910_SCI_BIOLOGY_OVERVIEW } from './seeds/g910-sci-biology-overview';
import { SEED_G910_SCI_CHEMISTRY_OVERVIEW } from './seeds/g910-sci-chemistry-overview';
import { SEED_G910_SCI_EARTH_SCIENCE } from './seeds/g910-sci-earth-science';
import { SEED_G910_SCI_PHYSICAL_SCIENCE } from './seeds/g910-sci-physical-science';
import { SEED_G910_SCI_ANATOMY_PHYSIOLOGY } from './seeds/g910-sci-anatomy-physiology';
import { SEED_COLLEGE_SCI_GENERAL_CHEMISTRY } from './seeds/college-sci-general-chemistry';
import { SEED_COLLEGE_SCI_GENERAL_PHYSICS } from './seeds/college-sci-general-physics';
import { SEED_COLLEGE_SCI_ORGANIC_CHEMISTRY } from './seeds/college-sci-organic-chemistry';
import { SEED_COLLEGE_SCI_INTRO_BIOLOGY } from './seeds/college-sci-intro-biology';
import { SEED_COLLEGE_SCI_BIOCHEMISTRY } from './seeds/college-sci-biochemistry';
// Social Studies HS 11-12 + College batch.
import { SEED_G1112_SS_US_HISTORY_ADVANCED } from './seeds/g1112-ss-us-history-advanced';
import { SEED_G1112_SS_EUROPEAN_HISTORY } from './seeds/g1112-ss-european-history';
import { SEED_G1112_SS_PSYCHOLOGY } from './seeds/g1112-ss-psychology';
import { SEED_G1112_SS_SOCIOLOGY } from './seeds/g1112-ss-sociology';
import { SEED_G1112_SS_PHILOSOPHY } from './seeds/g1112-ss-philosophy';
import { SEED_COLLEGE_SS_WESTERN_CIVILIZATION } from './seeds/college-ss-western-civilization';
import { SEED_COLLEGE_SS_AMERICAN_GOVERNMENT } from './seeds/college-ss-american-government';
import { SEED_COLLEGE_SS_INTRO_PSYCHOLOGY } from './seeds/college-ss-intro-psychology';
import { SEED_COLLEGE_SS_INTRO_ECONOMICS } from './seeds/college-ss-intro-economics';
import { SEED_COLLEGE_SS_INTRO_SOCIOLOGY } from './seeds/college-ss-intro-sociology';
// World Languages batch.
import { SEED_G35_LANG_SPANISH_BEGINNER } from './seeds/g35-lang-spanish-beginner';
import { SEED_G35_LANG_FRENCH_BEGINNER } from './seeds/g35-lang-french-beginner';
import { SEED_G35_LANG_MANDARIN_BEGINNER } from './seeds/g35-lang-mandarin-beginner';
import { SEED_G68_LANG_SPANISH_1 } from './seeds/g68-lang-spanish-1';
import { SEED_G68_LANG_SPANISH_2 } from './seeds/g68-lang-spanish-2';
import { SEED_G68_LANG_FRENCH_1 } from './seeds/g68-lang-french-1';
import { SEED_G68_LANG_FRENCH_2 } from './seeds/g68-lang-french-2';
import { SEED_G68_LANG_MANDARIN_1 } from './seeds/g68-lang-mandarin-1';
import { SEED_G910_LANG_SPANISH_1_3 } from './seeds/g910-lang-spanish-1-3';
import { SEED_G910_LANG_FRENCH_1_3 } from './seeds/g910-lang-french-1-3';
import { SEED_G910_LANG_MANDARIN_1_2 } from './seeds/g910-lang-mandarin-1-2';
import { SEED_G910_LANG_GERMAN_1_2 } from './seeds/g910-lang-german-1-2';
import { SEED_G910_LANG_JAPANESE_1_2 } from './seeds/g910-lang-japanese-1-2';
import { SEED_G1112_LANG_SPANISH_4_PLUS } from './seeds/g1112-lang-spanish-4-plus';
import { SEED_G1112_LANG_FRENCH_4_PLUS } from './seeds/g1112-lang-french-4-plus';
import { SEED_G1112_LANG_MANDARIN_3_PLUS } from './seeds/g1112-lang-mandarin-3-plus';
import { SEED_AP_SPANISH_LITERATURE } from './seeds/ap-spanish-literature';
import { SEED_IB_SPANISH_LANGUAGE } from './seeds/ib-spanish-language';
import { SEED_IB_FRENCH_LANGUAGE } from './seeds/ib-french-language';
// Coverage batch 2026-05-06 — fills 19 remaining empty taxonomy cells.
import { SEED_COLLEGE_ELA_COLLEGE_WRITING } from './seeds/college-ela-college-writing';
import { SEED_COLLEGE_ELA_INTRO_LITERATURE } from './seeds/college-ela-intro-literature';
import { SEED_COLLEGE_ELA_ACADEMIC_RESEARCH } from './seeds/college-ela-academic-research';
import { SEED_IB_ENGLISH_A } from './seeds/ib-english-a';
import { SEED_K2_MATH_SHAPES_PATTERNS } from './seeds/k2-math-shapes-patterns';
import { SEED_G35_MATH_ORDER_OF_OPERATIONS } from './seeds/g35-math-order-of-operations';
import { SEED_IB_MATH_APPLICATIONS } from './seeds/ib-math-applications';
import { SEED_COLLEGE_MATH_LINEAR_ALGEBRA } from './seeds/college-math-linear-algebra';
import { SEED_COLLEGE_MATH_DISCRETE_MATH } from './seeds/college-math-discrete-math';
import { SEED_COLLEGE_MATH_INTRO_STATISTICS } from './seeds/college-math-intro-statistics';
import { SEED_G35_SCI_ECOSYSTEMS } from './seeds/g35-sci-ecosystems';
import { SEED_G1112_SCI_ASTRONOMY } from './seeds/g1112-sci-astronomy';
import { SEED_IB_BIOLOGY } from './seeds/ib-biology';
import { SEED_IB_CHEMISTRY } from './seeds/ib-chemistry';
import { SEED_IB_PHYSICS } from './seeds/ib-physics';
import { SEED_G910_SS_GEOGRAPHY } from './seeds/g910-ss-geography';
import { SEED_IB_HISTORY } from './seeds/ib-history';
import { SEED_GRE_MATH_SUBJECT } from './seeds/gre-math-subject';
import { SEED_GRE_PHYSICS_SUBJECT } from './seeds/gre-physics-subject';
// Coverage wave 2 (2026-05-06) — sparse-cell backfill, math 9-12 + college.
import { SEED_G910_MATH_QUADRATIC_COMPLETING_SQUARE } from './seeds/g910-math-quadratic-completing-square';
import { SEED_G910_MATH_QUADRATIC_FORMULA } from './seeds/g910-math-quadratic-formula';
import { SEED_G910_MATH_QUADRATIC_VERTEX_FORM } from './seeds/g910-math-quadratic-vertex-form';
import { SEED_G910_MATH_SYSTEMS_SUBSTITUTION } from './seeds/g910-math-systems-substitution';
import { SEED_G910_MATH_SYSTEMS_ELIMINATION } from './seeds/g910-math-systems-elimination';
import { SEED_G910_MATH_SYSTEMS_WORD_PROBLEMS } from './seeds/g910-math-systems-word-problems';
import { SEED_G910_MATH_LINEAR_SLOPE_INTERCEPT } from './seeds/g910-math-linear-slope-intercept';
import { SEED_G910_MATH_LINEAR_POINT_SLOPE } from './seeds/g910-math-linear-point-slope';
import { SEED_G910_MATH_LINEAR_PARALLEL_PERPENDICULAR } from './seeds/g910-math-linear-parallel-perpendicular';
import { SEED_G910_MATH_POLYNOMIALS_LONG_DIVISION } from './seeds/g910-math-polynomials-long-division';
import { SEED_G910_MATH_POLYNOMIALS_RATIONAL_ROOTS } from './seeds/g910-math-polynomials-rational-roots';
import { SEED_G910_MATH_EXPONENT_RULES } from './seeds/g910-math-exponent-rules';
import { SEED_G1112_MATH_TRIG_RIGHT_TRIANGLE } from './seeds/g1112-math-trig-right-triangle';
import { SEED_G1112_MATH_TRIG_UNIT_CIRCLE } from './seeds/g1112-math-trig-unit-circle';
import { SEED_G1112_MATH_TRIG_EQUATIONS } from './seeds/g1112-math-trig-equations';
import { SEED_G1112_MATH_TRIG_LAWS_SIN_COS } from './seeds/g1112-math-trig-laws-sin-cos';
import { SEED_G1112_MATH_LOG_EQUATIONS } from './seeds/g1112-math-log-equations';
import { SEED_G1112_MATH_LOG_PROPERTIES } from './seeds/g1112-math-log-properties';
import { SEED_G1112_MATH_EXPONENTIAL_GROWTH_DECAY } from './seeds/g1112-math-exponential-growth-decay';
import { SEED_G1112_MATH_SEQUENCES_SIGMA } from './seeds/g1112-math-sequences-sigma';
import { SEED_COLLEGE_MATH_LINALG_ROW_REDUCTION } from './seeds/college-math-linalg-row-reduction';
import { SEED_COLLEGE_MATH_LINALG_EIGENVALUES } from './seeds/college-math-linalg-eigenvalues';
import { SEED_COLLEGE_MATH_DISCRETE_GRAPHS } from './seeds/college-math-discrete-graphs';
import { SEED_COLLEGE_MATH_STATS_HYPOTHESIS_TESTING } from './seeds/college-math-stats-hypothesis-testing';
import { SEED_COLLEGE_MATH_STATS_REGRESSION } from './seeds/college-math-stats-regression';
// Coverage wave 3 (2026-05-06) — Science college + ACT + GRE Verbal + MCAT subsections.
import { SEED_COLLEGE_SCI_GENCHEM_STOICHIOMETRY } from './seeds/college-sci-genchem-stoichiometry';
import { SEED_COLLEGE_SCI_GENCHEM_EQUILIBRIUM } from './seeds/college-sci-genchem-equilibrium';
import { SEED_COLLEGE_SCI_GENPHYS_MECHANICS } from './seeds/college-sci-genphys-mechanics';
import { SEED_COLLEGE_SCI_GENPHYS_EM } from './seeds/college-sci-genphys-em';
import { SEED_COLLEGE_SCI_ORGCHEM_FUNCTIONAL_GROUPS } from './seeds/college-sci-orgchem-functional-groups';
import { SEED_COLLEGE_SCI_ORGCHEM_MECHANISMS } from './seeds/college-sci-orgchem-mechanisms';
import { SEED_COLLEGE_SCI_INTROBIO_CELLS } from './seeds/college-sci-introbio-cells';
import { SEED_COLLEGE_SCI_INTROBIO_GENETICS } from './seeds/college-sci-introbio-genetics';
import { SEED_COLLEGE_SCI_BIOCHEM_METABOLISM } from './seeds/college-sci-biochem-metabolism';
import { SEED_COLLEGE_SCI_BIOCHEM_ENZYMES } from './seeds/college-sci-biochem-enzymes';
import { SEED_ACT_MATH_PRE_ALGEBRA_ALGEBRA } from './seeds/act-math-pre-algebra-algebra';
import { SEED_ACT_MATH_GEOMETRY_TRIG } from './seeds/act-math-geometry-trig';
import { SEED_ACT_ENGLISH_GRAMMAR_RULES } from './seeds/act-english-grammar-rules';
import { SEED_ACT_ENGLISH_RHETORICAL_SKILLS } from './seeds/act-english-rhetorical-skills';
import { SEED_ACT_READING_PASSAGE_STRATEGY } from './seeds/act-reading-passage-strategy';
import { SEED_ACT_READING_QUESTION_TYPES } from './seeds/act-reading-question-types';
import { SEED_ACT_SCIENCE_DATA_REP } from './seeds/act-science-data-rep';
import { SEED_ACT_SCIENCE_CONFLICTING_VIEWPOINTS } from './seeds/act-science-conflicting-viewpoints';
import { SEED_GRE_VERBAL_TEXT_COMPLETION } from './seeds/gre-verbal-text-completion';
import { SEED_GRE_VERBAL_SENTENCE_EQUIVALENCE } from './seeds/gre-verbal-sentence-equivalence';
import { SEED_GRE_VERBAL_READING_COMP } from './seeds/gre-verbal-reading-comp';
import { SEED_MCAT_CHEM_PHYS_DOMAINS } from './seeds/mcat-chem-phys-domains';
import { SEED_MCAT_BIO_BIOCHEM_DOMAINS } from './seeds/mcat-bio-biochem-domains';
import { SEED_MCAT_PSYCH_SOC_DOMAINS } from './seeds/mcat-psych-soc-domains';
// Coverage wave 4 (2026-05-06) — Science 6-8/HS/AP, SS 11-12/AP, ELA AP, CS HS.
import { SEED_G68_SCI_CELL_STRUCTURE } from './seeds/g68-sci-cell-structure';
import { SEED_G68_SCI_MITOSIS_MEIOSIS } from './seeds/g68-sci-mitosis-meiosis';
import { SEED_G68_SCI_DNA_GENES } from './seeds/g68-sci-dna-genes';
import { SEED_G68_SCI_MENDEL_INHERITANCE } from './seeds/g68-sci-mendel-inheritance';
import { SEED_G68_SCI_FOOD_WEBS } from './seeds/g68-sci-food-webs';
import { SEED_G68_SCI_BIOMES } from './seeds/g68-sci-biomes';
import { SEED_G910_SCI_PLATE_TECTONICS } from './seeds/g910-sci-plate-tectonics';
import { SEED_G910_SCI_ATMOSPHERE_CLIMATE } from './seeds/g910-sci-atmosphere-climate';
import { SEED_AP_PHYSICS_2_THERMODYNAMICS } from './seeds/ap-physics-2-thermodynamics';
import { SEED_AP_PHYSICS_2_OPTICS } from './seeds/ap-physics-2-optics';
import { SEED_AP_PHYSICS_C_MECH_CALCULUS } from './seeds/ap-physics-c-mech-calculus';
import { SEED_G1112_SS_EUROPEAN_HISTORY_SURVEY } from './seeds/g1112-ss-european-history-survey';
import { SEED_G1112_SS_PSYCHOLOGY_SCHOOLS } from './seeds/g1112-ss-psychology-schools';
import { SEED_G1112_SS_PHILOSOPHY_BRANCHES } from './seeds/g1112-ss-philosophy-branches';
import { SEED_AP_EUROPEAN_HISTORY_RENAISSANCE } from './seeds/ap-european-history-renaissance';
import { SEED_AP_PSYCHOLOGY_RESEARCH_METHODS } from './seeds/ap-psychology-research-methods';
import { SEED_AP_ENGLISH_LANG_RHETORIC } from './seeds/ap-english-lang-rhetoric';
import { SEED_AP_ENGLISH_LANG_SYNTHESIS_ESSAY } from './seeds/ap-english-lang-synthesis-essay';
import { SEED_G910_CS_PYTHON_CONTROL_FLOW } from './seeds/g910-cs-python-control-flow';
import { SEED_G910_CS_PYTHON_FUNCTIONS } from './seeds/g910-cs-python-functions';
// Coverage wave 5 (2026-05-06) — Math sparse cells.
import { SEED_K2_MATH_PLACE_VALUE_DEEP } from './seeds/k2-math-place-value-deep';
import { SEED_K2_MATH_SHAPES_2D_3D } from './seeds/k2-math-shapes-2d-3d';
import { SEED_K2_MATH_PATTERNS_RULES } from './seeds/k2-math-patterns-rules';
import { SEED_G35_MATH_WORD_PROBLEMS_STRATEGIES } from './seeds/g35-math-word-problems-strategies';
import { SEED_G35_MATH_WORD_PROBLEMS_FRACTIONS } from './seeds/g35-math-word-problems-fractions';
import { SEED_G35_MATH_ORDER_OF_OPS_MULTISTEP } from './seeds/g35-math-order-of-ops-multistep';
import { SEED_G68_MATH_INTEGERS_RATIONALS_DEEP } from './seeds/g68-math-integers-rationals-deep';
import { SEED_G68_MATH_COORDINATE_GRAPHING } from './seeds/g68-math-coordinate-graphing';
import { SEED_G68_MATH_COORDINATE_SHAPES } from './seeds/g68-math-coordinate-shapes';
import { SEED_G1112_MATH_SEQUENCES_RECURSIVE } from './seeds/g1112-math-sequences-recursive';
import { SEED_COLLEGE_MATH_DISCRETE_COMBINATORICS } from './seeds/college-math-discrete-combinatorics';
// Coverage wave 6 (2026-05-06) — JEE Math + JEE Chemistry depth.
import { SEED_JEE_MATH_ALGEBRA } from './seeds/jee-math-algebra';
import { SEED_JEE_MATH_CALCULUS } from './seeds/jee-math-calculus';
import { SEED_JEE_MATH_VECTORS_3D } from './seeds/jee-math-vectors-3d';
import { SEED_JEE_MATH_PROBABILITY_PERMUTATIONS } from './seeds/jee-math-probability-permutations';
import { SEED_JEE_MATH_TRIGONOMETRY } from './seeds/jee-math-trigonometry';
import { SEED_JEE_MATH_MATRICES_DETERMINANTS } from './seeds/jee-math-matrices-determinants';
import { SEED_JEE_CHEM_ATOMIC_STRUCTURE } from './seeds/jee-chem-atomic-structure';
import { SEED_JEE_CHEM_CHEMICAL_BONDING } from './seeds/jee-chem-chemical-bonding';
import { SEED_JEE_CHEM_EQUILIBRIUM_IONIC } from './seeds/jee-chem-equilibrium-ionic';
import { SEED_JEE_CHEM_PERIODIC_PROPERTIES } from './seeds/jee-chem-periodic-properties';
import { SEED_JEE_CHEM_COORDINATION_COMPOUNDS } from './seeds/jee-chem-coordination-compounds';
// Coverage wave 7 (2026-05-06) — NEET depth.
import { SEED_NEET_UG_STRATEGY } from './seeds/neet-ug-strategy';
import { SEED_NEET_UG_TIME_MANAGEMENT } from './seeds/neet-ug-time-management';
import { SEED_NEET_BIO_GENETICS_DEEP } from './seeds/neet-bio-genetics-deep';
import { SEED_NEET_BIO_PLANT_PHYSIOLOGY } from './seeds/neet-bio-plant-physiology';
import { SEED_NEET_BIO_BIOTECH_APPLICATIONS } from './seeds/neet-bio-biotech-applications';
import { SEED_NEET_BIO_EVOLUTION } from './seeds/neet-bio-evolution';
import { SEED_NEET_PHYSICS_WAVES_OPTICS } from './seeds/neet-physics-waves-optics';
import { SEED_NEET_PHYSICS_MODERN_PHYSICS } from './seeds/neet-physics-modern-physics';
import { SEED_NEET_PHYSICS_THERMODYNAMICS } from './seeds/neet-physics-thermodynamics';
import { SEED_NEET_CHEM_PHYSICAL_DEEP } from './seeds/neet-chem-physical-deep';
import { SEED_NEET_CHEM_THERMODYNAMICS } from './seeds/neet-chem-thermodynamics';
import { SEED_NEET_CHEM_ELECTROCHEMISTRY } from './seeds/neet-chem-electrochemistry';
import { SEED_NEET_CHEM_COORDINATION } from './seeds/neet-chem-coordination';
// Coverage wave 8 (2026-05-06) — AP Science backfill.
import { SEED_AP_PHYSICS_C_MECH_ROTATION } from './seeds/ap-physics-c-mech-rotation';
import { SEED_AP_PHYSICS_C_MECH_ENERGY_MOMENTUM } from './seeds/ap-physics-c-mech-energy-momentum';
import { SEED_AP_PHYSICS_2_ELECTROSTATICS } from './seeds/ap-physics-2-electrostatics';
import { SEED_IB_BIOLOGY_CELL_BIO } from './seeds/ib-biology-cell-bio';
import { SEED_IB_BIOLOGY_GENETICS } from './seeds/ib-biology-genetics';
import { SEED_IB_CHEMISTRY_BONDING } from './seeds/ib-chemistry-bonding';
import { SEED_IB_PHYSICS_MECHANICS } from './seeds/ib-physics-mechanics';
import { SEED_IB_PHYSICS_EM } from './seeds/ib-physics-em';
// Coverage wave 9 (2026-05-06) — AP ELA/SS/CS + Test Prep.
import { SEED_IB_ENGLISH_A_PAPER1 } from './seeds/ib-english-a-paper1';
import { SEED_IB_ENGLISH_A_PAPER2 } from './seeds/ib-english-a-paper2';
import { SEED_AP_US_HISTORY_PERIOD6_7 } from './seeds/ap-us-history-period6-7';
import { SEED_AP_US_HISTORY_CIVIL_RIGHTS } from './seeds/ap-us-history-civil-rights';
import { SEED_AP_WORLD_HISTORY_TRADE_EMPIRES } from './seeds/ap-world-history-trade-empires';
import { SEED_IB_HISTORY_PAPER1_SKILLS } from './seeds/ib-history-paper1-skills';
import { SEED_IB_HISTORY_PAPER2_ESSAY } from './seeds/ib-history-paper2-essay';
import { SEED_IB_CS_DATA_STRUCTURES } from './seeds/ib-cs-data-structures';
import { SEED_IB_CS_ALGORITHMS } from './seeds/ib-cs-algorithms';
import { SEED_AP_TEST_STRATEGY_FRQ } from './seeds/ap-test-strategy-frq';
import { SEED_AP_TEST_STRATEGY_MCQ } from './seeds/ap-test-strategy-mcq';
// Coverage wave 10 (2026-05-06) — AP Languages.
import { SEED_AP_SPANISH_LANG_GRAMMAR } from './seeds/ap-spanish-lang-grammar';
import { SEED_AP_SPANISH_LANG_WRITING } from './seeds/ap-spanish-lang-writing';
import { SEED_AP_SPANISH_LIT_POETRY } from './seeds/ap-spanish-lit-poetry';
import { SEED_AP_SPANISH_LIT_PROSE } from './seeds/ap-spanish-lit-prose';
import { SEED_AP_FRENCH_LANG_GRAMMAR } from './seeds/ap-french-lang-grammar';
import { SEED_AP_FRENCH_LANG_WRITING } from './seeds/ap-french-lang-writing';
import { SEED_AP_CHINESE_LANG_GRAMMAR } from './seeds/ap-chinese-lang-grammar';
import { SEED_AP_CHINESE_LANG_CHARACTERS } from './seeds/ap-chinese-lang-characters';
import { SEED_IB_SPANISH_TEXT_TYPES } from './seeds/ib-spanish-text-types';
import { SEED_IB_FRENCH_TEXT_TYPES } from './seeds/ib-french-text-types';
// Coverage wave 11 (2026-05-06) — SAT teaching plans (Math + R&W).
import { SEED_SAT_MATH_LINEAR_WORD_PROBLEMS } from './seeds/sat-math-linear-word-problems';
import { SEED_SAT_MATH_SYSTEMS_EQUATIONS } from './seeds/sat-math-systems-equations';
import { SEED_SAT_MATH_INEQUALITIES } from './seeds/sat-math-inequalities';
import { SEED_SAT_MATH_PERCENT } from './seeds/sat-math-percent';
import { SEED_SAT_MATH_RATIOS_RATES } from './seeds/sat-math-ratios-rates';
import { SEED_SAT_MATH_STATISTICS } from './seeds/sat-math-statistics';
import { SEED_SAT_MATH_QUADRATICS } from './seeds/sat-math-quadratics';
import { SEED_SAT_MATH_EXPONENTS } from './seeds/sat-math-exponents';
import { SEED_SAT_MATH_FUNCTIONS } from './seeds/sat-math-functions';
import { SEED_SAT_MATH_GEOMETRY } from './seeds/sat-math-geometry';
import { SEED_SAT_MATH_TRIGONOMETRY } from './seeds/sat-math-trigonometry';
import { SEED_SAT_MATH_COMPLEX_NUMBERS } from './seeds/sat-math-complex-numbers';
import { SEED_SAT_MATH_RATIONAL_RADICAL } from './seeds/sat-math-rational-radical';
import { SEED_SAT_RW_WORDS_IN_CONTEXT } from './seeds/sat-rw-words-in-context';
import { SEED_SAT_RW_MAIN_IDEA } from './seeds/sat-rw-main-idea';
import { SEED_SAT_RW_EVIDENCE } from './seeds/sat-rw-evidence';
import { SEED_SAT_RW_INFERENCE } from './seeds/sat-rw-inference';
import { SEED_SAT_RW_GRAMMAR_COMMAS } from './seeds/sat-rw-grammar-commas';
import { SEED_SAT_RW_GRAMMAR_AGREEMENT } from './seeds/sat-rw-grammar-agreement';
import { SEED_SAT_RW_GRAMMAR_STRUCTURE } from './seeds/sat-rw-grammar-structure';
import { SEED_SAT_RW_RHETORICAL_SYNTHESIS } from './seeds/sat-rw-rhetorical-synthesis';
import { SEED_SAT_RW_TRANSITIONS } from './seeds/sat-rw-transitions';
// QA harness — test-* plans for systematic browser exercising of tutor
// surfaces. Not production content. Safe to remove together; ids and
// titles are prefixed with `test-` / `[TEST]` for easy identification.
import { SEED_TEST_K2_MATH_COMPARING_NUMBERS } from './seeds/test-k2-math-comparing-numbers';
import { SEED_TEST_G5_SCI_CARBON_CYCLE } from './seeds/test-g5-sci-carbon-cycle';
import { SEED_TEST_G7_MATH_DIRECT_INVERSE_VARIATION } from './seeds/test-g7-math-direct-inverse-variation';
import { SEED_TEST_HS_BIO_SEX_LINKED_PEDIGREE } from './seeds/test-hs-bio-sex-linked-pedigree';
import { SEED_TEST_G7_SS_APOLLO_MISSIONS } from './seeds/test-g7-ss-apollo-missions';
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
  SEED_AP_BIO_ENZYMES,
  SEED_AP_BIO_IMMUNE,
  SEED_AP_MICRO_ELASTICITY,
  SEED_AP_MICRO_MARKET_STRUCTURES,
  SEED_AP_MICRO_FACTOR_MARKETS,
  SEED_AP_MACRO_U1_SCARCITY,
  SEED_AP_MACRO_U1_RESOURCE_ALLOCATION,
  SEED_AP_MACRO_U1_PPC,
  SEED_AP_MACRO_U1_COMPARATIVE_ADVANTAGE,
  SEED_AP_MACRO_U1_COST_BENEFIT,
  SEED_AP_MACRO_U1_MARGINAL_ANALYSIS,
  SEED_AP_MACRO_U1_FRQ_PRACTICE,
  SEED_AP_MACRO_U2_CIRCULAR_FLOW_GDP,
  SEED_AP_MACRO_U2_GDP_LIMITATIONS,
  SEED_AP_MACRO_U2_UNEMPLOYMENT,
  SEED_AP_MACRO_U2_PRICE_INDICES_INFLATION,
  SEED_AP_MACRO_U2_COSTS_OF_INFLATION,
  SEED_AP_MACRO_U2_REAL_VS_NOMINAL_GDP,
  SEED_AP_MACRO_U2_BUSINESS_CYCLE,
  SEED_AP_MACRO_U2_FRQ_PRACTICE,
  SEED_AP_MACRO_U3_AGGREGATE_DEMAND,
  SEED_AP_MACRO_U3_MULTIPLIERS,
  SEED_AP_MACRO_U3_SRAS,
  SEED_AP_MACRO_U3_LRAS,
  SEED_AP_MACRO_U3_EQUILIBRIUM_AD_AS,
  SEED_AP_MACRO_U3_CHANGES_SHORT_RUN,
  SEED_AP_MACRO_U3_LONG_RUN_SELF_ADJUST,
  SEED_AP_MACRO_U3_FISCAL_POLICY,
  SEED_AP_MACRO_U3_AUTOMATIC_STABILIZERS,
  SEED_AP_MACRO_U3_FRQ_PRACTICE,
  SEED_AP_MACRO_U4_FINANCIAL_ASSETS,
  SEED_AP_MACRO_U4_NOMINAL_REAL_RATES,
  SEED_AP_MACRO_U4_FUNCTIONS_OF_MONEY,
  SEED_AP_MACRO_U4_BANKING_MONEY_CREATION,
  SEED_AP_MACRO_U4_MONEY_MARKET,
  SEED_AP_MACRO_U4_MONETARY_POLICY,
  SEED_AP_MACRO_U4_LOANABLE_FUNDS,
  SEED_AP_MACRO_U4_FRQ_PRACTICE,
  SEED_AP_MACRO_U5_PHILLIPS_CURVE,
  SEED_AP_MACRO_U5_MONEY_GROWTH_INFLATION,
  SEED_AP_MACRO_U5_DEFICITS_DEBT,
  SEED_AP_MACRO_U5_CROWDING_OUT_LONG_RUN,
  SEED_AP_MACRO_U5_ECONOMIC_GROWTH,
  SEED_AP_MACRO_U5_PUBLIC_POLICY_GROWTH,
  SEED_AP_MACRO_U5_FRQ_PRACTICE,
  SEED_AP_MACRO_U6_BALANCE_OF_PAYMENTS,
  SEED_AP_MACRO_U6_EXCHANGE_RATES,
  SEED_AP_MACRO_U6_FX_MARKET,
  SEED_AP_MACRO_U6_FX_DETERMINANTS,
  SEED_AP_MACRO_U6_FX_EFFECTS,
  SEED_AP_MACRO_U6_TRADE_CAPITAL_FLOWS,
  SEED_AP_MACRO_U6_FRQ_PRACTICE,
  SEED_AP_CALCBC_U1_INTRODUCING_CALCULUS,
  SEED_AP_CALCBC_U1_DEFINING_LIMITS,
  SEED_AP_CALCBC_U1_LIMITS_GRAPHS_TABLES,
  SEED_AP_CALCBC_U1_LIMITS_ALGEBRAIC_PROPERTIES,
  SEED_AP_CALCBC_U1_LIMITS_ALGEBRAIC_MANIPULATION,
  SEED_AP_CALCBC_U1_LIMITS_STRATEGY,
  SEED_AP_CALCBC_U1_SQUEEZE_THEOREM,
  SEED_AP_CALCBC_U1_DISCONTINUITY_TYPES,
  SEED_AP_CALCBC_U1_CONTINUITY,
  SEED_AP_CALCBC_U1_REMOVING_DISCONTINUITIES,
  SEED_AP_CALCBC_U1_INFINITE_LIMITS_ASYMPTOTES,
  SEED_AP_CALCBC_U1_LIMITS_AT_INFINITY,
  SEED_AP_CALCBC_U1_IVT,
  SEED_AP_CALCBC_U1_FRQ_PRACTICE,
  SEED_AP_CALCBC_U2_DERIVATIVE_DEFINITION,
  SEED_AP_CALCBC_U2_ESTIMATING_DERIVATIVES,
  SEED_AP_CALCBC_U2_DIFFERENTIABILITY_CONTINUITY,
  SEED_AP_CALCBC_U2_POWER_RULE_LINEARITY,
  SEED_AP_CALCBC_U2_TRANSCENDENTAL_DERIVATIVES,
  SEED_AP_CALCBC_U2_PRODUCT_RULE,
  SEED_AP_CALCBC_U2_QUOTIENT_RULE,
  SEED_AP_CALCBC_U2_FRQ_PRACTICE,
  SEED_AP_CALCBC_U3_CHAIN_RULE,
  SEED_AP_CALCBC_U3_IMPLICIT_DIFFERENTIATION,
  SEED_AP_CALCBC_U3_DERIVATIVES_INVERSE,
  SEED_AP_CALCBC_U3_HIGHER_ORDER_DERIVATIVES,
  SEED_AP_CALCBC_U3_FRQ_PRACTICE,
  SEED_AP_CALCBC_U4_DERIVATIVE_CONTEXT,
  SEED_AP_CALCBC_U4_MOTION,
  SEED_AP_CALCBC_U4_RELATED_RATES,
  SEED_AP_CALCBC_U4_LINEARIZATION,
  SEED_AP_CALCBC_U4_LHOPITAL,
  SEED_AP_CALCBC_U4_FRQ_PRACTICE,
  SEED_AP_CALCBC_U5_MVT_EVT,
  SEED_AP_CALCBC_U5_FIRST_DERIVATIVE_ANALYSIS,
  SEED_AP_CALCBC_U5_CONCAVITY_SECOND_DERIVATIVE,
  SEED_AP_CALCBC_U5_GRAPHING_F_FP_FPP,
  SEED_AP_CALCBC_U5_OPTIMIZATION,
  SEED_AP_CALCBC_U5_FRQ_PRACTICE,
  SEED_AP_CALCBC_U6_RIEMANN_SUMS,
  SEED_AP_CALCBC_U6_FTC,
  SEED_AP_CALCBC_U6_INTEGRAL_PROPERTIES,
  SEED_AP_CALCBC_U6_BASIC_ANTIDERIVATIVES,
  SEED_AP_CALCBC_U6_U_SUBSTITUTION,
  SEED_AP_CALCBC_U6_INTEGRATION_BY_PARTS,
  SEED_AP_CALCBC_U6_PARTIAL_FRACTIONS,
  SEED_AP_CALCBC_U6_IMPROPER_INTEGRALS,
  SEED_AP_CALCBC_U6_INTEGRATION_STRATEGY,
  SEED_AP_CALCBC_U6_FRQ_PRACTICE,
  SEED_AP_CALCBC_U7_MODELING_VERIFYING,
  SEED_AP_CALCBC_U7_SLOPE_FIELDS,
  SEED_AP_CALCBC_U7_EULERS_METHOD,
  SEED_AP_CALCBC_U7_SEPARATION_OF_VARIABLES,
  SEED_AP_CALCBC_U7_EXPONENTIAL_MODELS,
  SEED_AP_CALCBC_U7_LOGISTIC_MODELS,
  SEED_AP_CALCBC_U7_FRQ_PRACTICE,
  SEED_AP_CALCBC_U8_APPLICATIONS,
  SEED_AP_CALCBC_U8_AREA_BETWEEN_CURVES,
  SEED_AP_CALCBC_U8_VOLUMES_CROSS_SECTIONS,
  SEED_AP_CALCBC_U8_VOLUMES_REVOLUTION,
  SEED_AP_CALCBC_U8_ARC_LENGTH,
  SEED_AP_CALCBC_U8_FRQ_PRACTICE,
  SEED_AP_CALCBC_U9_PARAMETRIC,
  SEED_AP_CALCBC_U9_PARAMETRIC_ARC_LENGTH,
  SEED_AP_CALCBC_U9_VECTOR_VALUED,
  SEED_AP_CALCBC_U9_POLAR_COORDINATES,
  SEED_AP_CALCBC_U9_POLAR_AREA,
  SEED_AP_CALCBC_U9_FRQ_PRACTICE,
  SEED_AP_CALCBC_U10_SERIES_CONVERGENCE,
  SEED_AP_CALCBC_U10_CONVERGENCE_TESTS,
  SEED_AP_CALCBC_U10_ALTERNATING_SERIES,
  SEED_AP_CALCBC_U10_RATIO_TEST,
  SEED_AP_CALCBC_U10_TAYLOR_POLYNOMIAL,
  SEED_AP_CALCBC_U10_POWER_SERIES,
  SEED_AP_CALCBC_U10_MACLAURIN_SERIES,
  SEED_AP_CALCBC_U10_FRQ_PRACTICE,
  SEED_AP_STATS_U1_CATEGORICAL_DATA,
  SEED_AP_STATS_U1_QUANTITATIVE_GRAPHS,
  SEED_AP_STATS_U1_DISTRIBUTION_SHAPE,
  SEED_AP_STATS_U1_SUMMARY_STATISTICS,
  SEED_AP_STATS_U1_COMPARING_DISTRIBUTIONS,
  SEED_AP_STATS_U1_NORMAL_DISTRIBUTION,
  SEED_AP_STATS_U1_FRQ_PRACTICE,
  SEED_AP_STATS_U2_TWO_CATEGORICAL,
  SEED_AP_STATS_U2_SCATTERPLOTS,
  SEED_AP_STATS_U2_CORRELATION,
  SEED_AP_STATS_U2_LINEAR_REGRESSION,
  SEED_AP_STATS_U2_RESIDUALS,
  SEED_AP_STATS_U2_FRQ_PRACTICE,
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
  SEED_AP_BIO_CENTRAL_DOGMA,
  SEED_AP_BIO_GENE_REGULATION_BIOTECH,
  // Batch 57 — GCSE Math Higher (UK).
  SEED_GCSE_MATH_SURDS_INDICES,
  SEED_GCSE_MATH_BOUNDS_ERROR,
  SEED_GCSE_MATH_ALGEBRA_FACTOR,
  SEED_GCSE_MATH_QUADRATIC_COMPLETE_SQUARE,
  SEED_GCSE_MATH_SIMULTANEOUS_LIN_QUAD,
  SEED_GCSE_MATH_SEQUENCES,
  SEED_GCSE_MATH_FUNCTIONS_TRANSFORMATIONS,
  SEED_GCSE_MATH_RATIO_PROPORTION_RATE,
  SEED_GCSE_MATH_CIRCLE_THEOREMS,
  SEED_GCSE_MATH_VECTORS,
  SEED_GCSE_MATH_SINE_COSINE_RULES,
  SEED_GCSE_MATH_TRIG_EXACT_VALUES,
  SEED_GCSE_MATH_ARCS_SECTORS,
  SEED_GCSE_MATH_3D_VOLUME_SA,
  SEED_GCSE_MATH_CUMULATIVE_FREQ,
  SEED_GCSE_MATH_HISTOGRAMS,
  SEED_GCSE_MATH_PROBABILITY_TREES,
  SEED_GCSE_MATH_CONDITIONAL_PROB,
  // Batch 58 — IB DP Math Analysis & Approaches.
  SEED_IBDP_AA_SEQUENCES_SERIES,
  SEED_IBDP_AA_EXP_LOGS,
  SEED_IBDP_AA_BINOMIAL_THEOREM,
  SEED_IBDP_AA_FUNCTIONS_INVERSES,
  SEED_IBDP_AA_QUADRATICS_DEEP,
  SEED_IBDP_AA_POLY_RATIONAL,
  SEED_IBDP_AA_TRIG_RADIANS,
  SEED_IBDP_AA_TRIG_ID_EQUATIONS,
  SEED_IBDP_AA_VECTORS_2D_3D,
  SEED_IBDP_AA_VECTOR_LINES_PLANES,
  SEED_IBDP_AA_STATISTICS_DESCRIPTIVE,
  SEED_IBDP_AA_PROBABILITY,
  SEED_IBDP_AA_BINOMIAL_DISTRIBUTION,
  SEED_IBDP_AA_NORMAL_DISTRIBUTION,
  SEED_IBDP_AA_LIMITS_CONTINUITY,
  SEED_IBDP_AA_DIFFERENTIATION,
  SEED_IBDP_AA_INTEGRATION,
  SEED_IBDP_AA_DIFFERENTIAL_EQUATIONS,
  // Batch 59 — GRE Quant content topics.
  SEED_GRE_Q_ARITHMETIC,
  SEED_GRE_Q_NUMBER_PROPERTIES,
  SEED_GRE_Q_EXPONENTS_ROOTS,
  SEED_GRE_Q_ALGEBRA_EQUATIONS,
  SEED_GRE_Q_WORD_PROBLEMS,
  SEED_GRE_Q_COORDINATE_GEOMETRY,
  SEED_GRE_Q_LINES_ANGLES_TRIANGLES,
  SEED_GRE_Q_QUADRILATERALS,
  SEED_GRE_Q_CIRCLES,
  SEED_GRE_Q_3D_GEOMETRY,
  SEED_GRE_Q_DATA_INTERPRETATION,
  SEED_GRE_Q_STATISTICS,
  SEED_GRE_Q_PROBABILITY_COUNTING,
  SEED_GRE_Q_QUANT_COMPARISON,
  // Batch 60 — JEE Main Physics content (12 high-priority topics).
  SEED_JEE_PHYS_KINEMATICS,
  SEED_JEE_PHYS_LAWS_MOTION,
  SEED_JEE_PHYS_WORK_ENERGY_POWER,
  SEED_JEE_PHYS_GRAVITATION,
  SEED_JEE_PHYS_OSCILLATIONS,
  SEED_JEE_PHYS_WAVES,
  SEED_JEE_PHYS_ELECTROSTATICS,
  SEED_JEE_PHYS_CURRENT_ELECTRICITY,
  SEED_JEE_PHYS_MAGNETIC_EFFECTS,
  SEED_JEE_PHYS_EM_INDUCTION,
  SEED_JEE_PHYS_EM_WAVES_OPTICS,
  SEED_JEE_PHYS_ATOMS_NUCLEI,
  // Batch 61 — JEE Main Physics completion.
  SEED_JEE_PHYS_KINETIC_THEORY,
  SEED_JEE_PHYS_DUAL_NATURE,
  SEED_JEE_PHYS_SEMICONDUCTORS,
  SEED_JEE_PHYS_SOLID_LIQUID_PROPERTIES,
  // Batch 62 — Grades 3-5 ELA cluster.
  SEED_G35_ELA_MULTISYLLABIC,
  SEED_G35_ELA_PREFIXES_SUFFIXES,
  SEED_G35_ELA_CONTEXT_CLUES,
  SEED_G35_ELA_THEME,
  SEED_G35_ELA_INFERENCE_EVIDENCE,
  SEED_G35_ELA_AUTHORS_PURPOSE,
  SEED_G35_ELA_POINT_OF_VIEW,
  SEED_G35_ELA_FIGURATIVE_LANGUAGE,
  SEED_G35_ELA_TEXT_FEATURES,
  SEED_G35_ELA_SUMMARIZING,
  SEED_G35_ELA_PARAGRAPH_STRUCTURE,
  SEED_G35_ELA_NARRATIVE_DEVELOPED,
  SEED_G35_ELA_INFORMATIONAL_WRITING,
  SEED_G35_ELA_OPINION_ARGUMENT,
  SEED_G35_ELA_EDITING_REVISION,
  SEED_G35_ELA_SUBJECT_VERB_AGREEMENT,
  SEED_G35_ELA_PRONOUN_USAGE,
  SEED_G35_ELA_VERB_TENSES,
  SEED_G35_ELA_COMMAS_QUOTES,
  SEED_G35_ELA_RESEARCH_BASICS,
  // Batch 63 — Grades 6-8 ELA cluster.
  SEED_G68_ELA_LITERARY_ANALYSIS,
  SEED_G68_ELA_NARRATIVE_ARC,
  SEED_G68_ELA_SYMBOLISM_MOTIF,
  SEED_G68_ELA_TONE_MOOD,
  SEED_G68_ELA_ARGUMENT_CER,
  SEED_G68_ELA_COUNTERCLAIM,
  SEED_G68_ELA_INFORMATIONAL_RESEARCH,
  SEED_G68_ELA_NARRATIVE_DEVELOPED,
  SEED_G68_ELA_CITING_EVIDENCE,
  SEED_G68_ELA_SENTENCE_VARIETY,
  SEED_G68_ELA_ACTIVE_PASSIVE_VOICE,
  SEED_G68_ELA_WORD_CHOICE,
  SEED_G68_ELA_REVISING_CLARITY,
  SEED_G68_ELA_PHRASES_CLAUSES,
  SEED_G68_ELA_ADVANCED_PUNCTUATION,
  SEED_G68_ELA_COMPARING_TEXTS,
  SEED_G68_ELA_ANALYZING_MEDIA,
  SEED_G68_ELA_GREEK_LATIN_ROOTS,
  // Batch 64 — Grades 9-12 ELA cluster.
  SEED_G912_ELA_CLOSE_READING,
  SEED_G912_ELA_LITERARY_DEVICES,
  SEED_G912_ELA_RHETORIC_EPL,
  SEED_G912_ELA_ARGUMENT_ANALYSIS,
  SEED_G912_ELA_RESEARCH_PAPER,
  SEED_G912_ELA_SYNTHESIS_ESSAY,
  SEED_G912_ELA_MLA_APA_CITATION,
  SEED_G912_ELA_ANNOTATED_BIB,
  SEED_G912_ELA_LOGICAL_FALLACIES,
  SEED_G912_ELA_CRITICAL_READING,
  SEED_G912_ELA_NARRATIVE_ADVANCED,
  SEED_G912_ELA_ANALYTICAL_ESSAY,
  SEED_G912_ELA_LITERATURE_PERIODS,
  SEED_G912_ELA_SHAKESPEARE_BASICS,
  SEED_G912_ELA_POETRY_ANALYSIS,
  SEED_G912_ELA_SHORT_STORY_CRAFT,
  SEED_G912_ELA_GENRE_COMPARISON,
  SEED_G912_ELA_SPEECH_PRESENTATION,
  SEED_G912_ELA_VOCAB_ADVANCED,
  SEED_G912_ELA_COLLEGE_ESSAY,
  // Batch 65 — K-2 ELA cluster.
  SEED_K2_ELA_PHONEMIC_AWARENESS,
  SEED_K2_ELA_CVC_DECODING,
  SEED_K2_ELA_VOWEL_TEAMS,
  SEED_K2_ELA_SENTENCE_STRUCTURE,
  SEED_K2_ELA_STORY_ELEMENTS,
  SEED_K2_ELA_MAIN_IDEA_DETAILS,
  SEED_K2_ELA_SEQUENCING,
  SEED_K2_ELA_COMPARE_CONTRAST,
  SEED_K2_ELA_ASKING_QUESTIONS,
  SEED_K2_ELA_NARRATIVE_WRITING,
  SEED_K2_ELA_OPINION_WRITING,
  // Batch 66 — K-2 SS cluster.
  SEED_K2_SS_COMMUNITY_INTRO,
  SEED_K2_SS_MAPS_SYMBOLS,
  SEED_K2_SS_RULES_LAWS,
  SEED_K2_SS_TIMELINE_INTRO,
  SEED_K2_SS_HOLIDAYS_TRADITIONS,
  // Batch 67 — Grades 3-5 SS cluster.
  SEED_G35_SS_NATIVE_AMERICAN,
  SEED_G35_SS_AMERICAN_REVOLUTION,
  SEED_G35_SS_CONSTITUTION_INTRO,
  SEED_G35_SS_WESTWARD_EXPANSION,
  SEED_G35_SS_CIVIL_WAR_OVERVIEW,
  SEED_G35_SS_STATE_GOVERNMENTS,
  SEED_G35_SS_CITIZENSHIP_RIGHTS,
  SEED_G35_SS_WORLD_CULTURES,
  SEED_G35_SS_ECONOMICS_BASICS,
  SEED_G35_SS_LAT_LONG_MAPPING,
  SEED_G35_SS_CLIMATE_GEOGRAPHY,
  // Batch 68 — Grades 6-8 SS cluster.
  SEED_G68_SS_COLONIAL_DEEPER,
  SEED_G68_SS_CONSTITUTION_BILL_RIGHTS,
  SEED_G68_SS_CIVIL_WAR_RECONSTRUCTION,
  SEED_G68_SS_IMPERIALISM_WWI,
  SEED_G68_SS_DEPRESSION_WWII,
  SEED_G68_SS_CIVIL_RIGHTS_MOVEMENT,
  SEED_G68_SS_COLD_WAR_OVERVIEW,
  SEED_G68_SS_WORLD_RELIGIONS,
  SEED_G68_SS_WORLD_REGIONS_GEOGRAPHY,
  SEED_G68_SS_ECONOMIC_SYSTEMS,
  // Batch 69 — Grades 9-12 SS cluster.
  SEED_G912_SS_PRE_COLUMBIAN,
  SEED_G912_SS_ANTEBELLUM_SLAVERY,
  SEED_G912_SS_WWII_HOME_FRONT,
  SEED_G912_SS_EARLY_MODERN_WORLD,
  SEED_G912_SS_MICROECONOMICS_INTRO,
  SEED_G912_SS_MACROECONOMICS_INTRO,
  // Computer Science batch.
  SEED_G68_CS_INTRO_CODING,
  SEED_G68_CS_SCRATCH_BLOCK,
  SEED_G68_CS_WEB_BASICS,
  SEED_G68_CS_DIGITAL_LITERACY,
  SEED_G910_CS_INTRO_PYTHON,
  SEED_G910_CS_WEB_DEVELOPMENT,
  SEED_G910_CS_DATA_DATABASES,
  SEED_G910_CS_CYBERSECURITY,
  SEED_G1112_CS_DATA_STRUCTURES,
  SEED_G1112_CS_OOP,
  SEED_G1112_CS_MOBILE_DEVELOPMENT,
  SEED_IB_CS_SYSTEMS_FUNDAMENTALS,
  SEED_COLLEGE_CS101,
  SEED_COLLEGE_CS_DATA_STRUCTURES,
  SEED_COLLEGE_CS_ALGORITHMS,
  SEED_COLLEGE_CS_DISCRETE_MATH,
  SEED_COLLEGE_CS_INTRO_AI,
  // Science HS 9-10 + College batch.
  SEED_G910_SCI_BIOLOGY_OVERVIEW,
  SEED_G910_SCI_CHEMISTRY_OVERVIEW,
  SEED_G910_SCI_EARTH_SCIENCE,
  SEED_G910_SCI_PHYSICAL_SCIENCE,
  SEED_G910_SCI_ANATOMY_PHYSIOLOGY,
  SEED_COLLEGE_SCI_GENERAL_CHEMISTRY,
  SEED_COLLEGE_SCI_GENERAL_PHYSICS,
  SEED_COLLEGE_SCI_ORGANIC_CHEMISTRY,
  SEED_COLLEGE_SCI_INTRO_BIOLOGY,
  SEED_COLLEGE_SCI_BIOCHEMISTRY,
  // Social Studies HS 11-12 + College batch.
  SEED_G1112_SS_US_HISTORY_ADVANCED,
  SEED_G1112_SS_EUROPEAN_HISTORY,
  SEED_G1112_SS_PSYCHOLOGY,
  SEED_G1112_SS_SOCIOLOGY,
  SEED_G1112_SS_PHILOSOPHY,
  SEED_COLLEGE_SS_WESTERN_CIVILIZATION,
  SEED_COLLEGE_SS_AMERICAN_GOVERNMENT,
  SEED_COLLEGE_SS_INTRO_PSYCHOLOGY,
  SEED_COLLEGE_SS_INTRO_ECONOMICS,
  SEED_COLLEGE_SS_INTRO_SOCIOLOGY,
  // World Languages batch.
  SEED_G35_LANG_SPANISH_BEGINNER,
  SEED_G35_LANG_FRENCH_BEGINNER,
  SEED_G35_LANG_MANDARIN_BEGINNER,
  SEED_G68_LANG_SPANISH_1,
  SEED_G68_LANG_SPANISH_2,
  SEED_G68_LANG_FRENCH_1,
  SEED_G68_LANG_FRENCH_2,
  SEED_G68_LANG_MANDARIN_1,
  SEED_G910_LANG_SPANISH_1_3,
  SEED_G910_LANG_FRENCH_1_3,
  SEED_G910_LANG_MANDARIN_1_2,
  SEED_G910_LANG_GERMAN_1_2,
  SEED_G910_LANG_JAPANESE_1_2,
  SEED_G1112_LANG_SPANISH_4_PLUS,
  SEED_G1112_LANG_FRENCH_4_PLUS,
  SEED_G1112_LANG_MANDARIN_3_PLUS,
  SEED_AP_SPANISH_LITERATURE,
  SEED_IB_SPANISH_LANGUAGE,
  SEED_IB_FRENCH_LANGUAGE,
  // Coverage batch 2026-05-06 — fills 19 remaining empty taxonomy cells.
  SEED_COLLEGE_ELA_COLLEGE_WRITING,
  SEED_COLLEGE_ELA_INTRO_LITERATURE,
  SEED_COLLEGE_ELA_ACADEMIC_RESEARCH,
  SEED_IB_ENGLISH_A,
  SEED_K2_MATH_SHAPES_PATTERNS,
  SEED_G35_MATH_ORDER_OF_OPERATIONS,
  SEED_IB_MATH_APPLICATIONS,
  SEED_COLLEGE_MATH_LINEAR_ALGEBRA,
  SEED_COLLEGE_MATH_DISCRETE_MATH,
  SEED_COLLEGE_MATH_INTRO_STATISTICS,
  SEED_G35_SCI_ECOSYSTEMS,
  SEED_G1112_SCI_ASTRONOMY,
  SEED_IB_BIOLOGY,
  SEED_IB_CHEMISTRY,
  SEED_IB_PHYSICS,
  SEED_G910_SS_GEOGRAPHY,
  SEED_IB_HISTORY,
  SEED_GRE_MATH_SUBJECT,
  SEED_GRE_PHYSICS_SUBJECT,
  // Coverage wave 2 (2026-05-06) — sparse-cell backfill, math 9-12 + college.
  SEED_G910_MATH_QUADRATIC_COMPLETING_SQUARE,
  SEED_G910_MATH_QUADRATIC_FORMULA,
  SEED_G910_MATH_QUADRATIC_VERTEX_FORM,
  SEED_G910_MATH_SYSTEMS_SUBSTITUTION,
  SEED_G910_MATH_SYSTEMS_ELIMINATION,
  SEED_G910_MATH_SYSTEMS_WORD_PROBLEMS,
  SEED_G910_MATH_LINEAR_SLOPE_INTERCEPT,
  SEED_G910_MATH_LINEAR_POINT_SLOPE,
  SEED_G910_MATH_LINEAR_PARALLEL_PERPENDICULAR,
  SEED_G910_MATH_POLYNOMIALS_LONG_DIVISION,
  SEED_G910_MATH_POLYNOMIALS_RATIONAL_ROOTS,
  SEED_G910_MATH_EXPONENT_RULES,
  SEED_G1112_MATH_TRIG_RIGHT_TRIANGLE,
  SEED_G1112_MATH_TRIG_UNIT_CIRCLE,
  SEED_G1112_MATH_TRIG_EQUATIONS,
  SEED_G1112_MATH_TRIG_LAWS_SIN_COS,
  SEED_G1112_MATH_LOG_EQUATIONS,
  SEED_G1112_MATH_LOG_PROPERTIES,
  SEED_G1112_MATH_EXPONENTIAL_GROWTH_DECAY,
  SEED_G1112_MATH_SEQUENCES_SIGMA,
  SEED_COLLEGE_MATH_LINALG_ROW_REDUCTION,
  SEED_COLLEGE_MATH_LINALG_EIGENVALUES,
  SEED_COLLEGE_MATH_DISCRETE_GRAPHS,
  SEED_COLLEGE_MATH_STATS_HYPOTHESIS_TESTING,
  SEED_COLLEGE_MATH_STATS_REGRESSION,
  // Coverage wave 3 (2026-05-06) — Science college + ACT + GRE Verbal + MCAT subsections.
  SEED_COLLEGE_SCI_GENCHEM_STOICHIOMETRY,
  SEED_COLLEGE_SCI_GENCHEM_EQUILIBRIUM,
  SEED_COLLEGE_SCI_GENPHYS_MECHANICS,
  SEED_COLLEGE_SCI_GENPHYS_EM,
  SEED_COLLEGE_SCI_ORGCHEM_FUNCTIONAL_GROUPS,
  SEED_COLLEGE_SCI_ORGCHEM_MECHANISMS,
  SEED_COLLEGE_SCI_INTROBIO_CELLS,
  SEED_COLLEGE_SCI_INTROBIO_GENETICS,
  SEED_COLLEGE_SCI_BIOCHEM_METABOLISM,
  SEED_COLLEGE_SCI_BIOCHEM_ENZYMES,
  SEED_ACT_MATH_PRE_ALGEBRA_ALGEBRA,
  SEED_ACT_MATH_GEOMETRY_TRIG,
  SEED_ACT_ENGLISH_GRAMMAR_RULES,
  SEED_ACT_ENGLISH_RHETORICAL_SKILLS,
  SEED_ACT_READING_PASSAGE_STRATEGY,
  SEED_ACT_READING_QUESTION_TYPES,
  SEED_ACT_SCIENCE_DATA_REP,
  SEED_ACT_SCIENCE_CONFLICTING_VIEWPOINTS,
  SEED_GRE_VERBAL_TEXT_COMPLETION,
  SEED_GRE_VERBAL_SENTENCE_EQUIVALENCE,
  SEED_GRE_VERBAL_READING_COMP,
  SEED_MCAT_CHEM_PHYS_DOMAINS,
  SEED_MCAT_BIO_BIOCHEM_DOMAINS,
  SEED_MCAT_PSYCH_SOC_DOMAINS,
  // Coverage wave 4 (2026-05-06) — Science 6-8/HS/AP, SS 11-12/AP, ELA AP, CS HS.
  SEED_G68_SCI_CELL_STRUCTURE,
  SEED_G68_SCI_MITOSIS_MEIOSIS,
  SEED_G68_SCI_DNA_GENES,
  SEED_G68_SCI_MENDEL_INHERITANCE,
  SEED_G68_SCI_FOOD_WEBS,
  SEED_G68_SCI_BIOMES,
  SEED_G910_SCI_PLATE_TECTONICS,
  SEED_G910_SCI_ATMOSPHERE_CLIMATE,
  SEED_AP_PHYSICS_2_THERMODYNAMICS,
  SEED_AP_PHYSICS_2_OPTICS,
  SEED_AP_PHYSICS_C_MECH_CALCULUS,
  SEED_G1112_SS_EUROPEAN_HISTORY_SURVEY,
  SEED_G1112_SS_PSYCHOLOGY_SCHOOLS,
  SEED_G1112_SS_PHILOSOPHY_BRANCHES,
  SEED_AP_EUROPEAN_HISTORY_RENAISSANCE,
  SEED_AP_PSYCHOLOGY_RESEARCH_METHODS,
  SEED_AP_ENGLISH_LANG_RHETORIC,
  SEED_AP_ENGLISH_LANG_SYNTHESIS_ESSAY,
  SEED_G910_CS_PYTHON_CONTROL_FLOW,
  SEED_G910_CS_PYTHON_FUNCTIONS,
  // Coverage wave 5 (2026-05-06) — Math sparse cells.
  SEED_K2_MATH_PLACE_VALUE_DEEP,
  SEED_K2_MATH_SHAPES_2D_3D,
  SEED_K2_MATH_PATTERNS_RULES,
  SEED_G35_MATH_WORD_PROBLEMS_STRATEGIES,
  SEED_G35_MATH_WORD_PROBLEMS_FRACTIONS,
  SEED_G35_MATH_ORDER_OF_OPS_MULTISTEP,
  SEED_G68_MATH_INTEGERS_RATIONALS_DEEP,
  SEED_G68_MATH_COORDINATE_GRAPHING,
  SEED_G68_MATH_COORDINATE_SHAPES,
  SEED_G1112_MATH_SEQUENCES_RECURSIVE,
  SEED_COLLEGE_MATH_DISCRETE_COMBINATORICS,
  // Coverage wave 6 (2026-05-06) — JEE Math + JEE Chemistry depth.
  SEED_JEE_MATH_ALGEBRA,
  SEED_JEE_MATH_CALCULUS,
  SEED_JEE_MATH_VECTORS_3D,
  SEED_JEE_MATH_PROBABILITY_PERMUTATIONS,
  SEED_JEE_MATH_TRIGONOMETRY,
  SEED_JEE_MATH_MATRICES_DETERMINANTS,
  SEED_JEE_CHEM_ATOMIC_STRUCTURE,
  SEED_JEE_CHEM_CHEMICAL_BONDING,
  SEED_JEE_CHEM_EQUILIBRIUM_IONIC,
  SEED_JEE_CHEM_PERIODIC_PROPERTIES,
  SEED_JEE_CHEM_COORDINATION_COMPOUNDS,
  // Coverage wave 7 (2026-05-06) — NEET depth.
  SEED_NEET_UG_STRATEGY,
  SEED_NEET_UG_TIME_MANAGEMENT,
  SEED_NEET_BIO_GENETICS_DEEP,
  SEED_NEET_BIO_PLANT_PHYSIOLOGY,
  SEED_NEET_BIO_BIOTECH_APPLICATIONS,
  SEED_NEET_BIO_EVOLUTION,
  SEED_NEET_PHYSICS_WAVES_OPTICS,
  SEED_NEET_PHYSICS_MODERN_PHYSICS,
  SEED_NEET_PHYSICS_THERMODYNAMICS,
  SEED_NEET_CHEM_PHYSICAL_DEEP,
  SEED_NEET_CHEM_THERMODYNAMICS,
  SEED_NEET_CHEM_ELECTROCHEMISTRY,
  SEED_NEET_CHEM_COORDINATION,
  // Coverage wave 8 (2026-05-06) — AP Science backfill.
  SEED_AP_PHYSICS_C_MECH_ROTATION,
  SEED_AP_PHYSICS_C_MECH_ENERGY_MOMENTUM,
  SEED_AP_PHYSICS_2_ELECTROSTATICS,
  SEED_IB_BIOLOGY_CELL_BIO,
  SEED_IB_BIOLOGY_GENETICS,
  SEED_IB_CHEMISTRY_BONDING,
  SEED_IB_PHYSICS_MECHANICS,
  SEED_IB_PHYSICS_EM,
  // Coverage wave 9 (2026-05-06) — AP ELA/SS/CS + Test Prep.
  SEED_IB_ENGLISH_A_PAPER1,
  SEED_IB_ENGLISH_A_PAPER2,
  SEED_AP_US_HISTORY_PERIOD6_7,
  SEED_AP_US_HISTORY_CIVIL_RIGHTS,
  SEED_AP_WORLD_HISTORY_TRADE_EMPIRES,
  SEED_IB_HISTORY_PAPER1_SKILLS,
  SEED_IB_HISTORY_PAPER2_ESSAY,
  SEED_IB_CS_DATA_STRUCTURES,
  SEED_IB_CS_ALGORITHMS,
  SEED_AP_TEST_STRATEGY_FRQ,
  SEED_AP_TEST_STRATEGY_MCQ,
  // Coverage wave 10 (2026-05-06) — AP Languages.
  SEED_AP_SPANISH_LANG_GRAMMAR,
  SEED_AP_SPANISH_LANG_WRITING,
  SEED_AP_SPANISH_LIT_POETRY,
  SEED_AP_SPANISH_LIT_PROSE,
  SEED_AP_FRENCH_LANG_GRAMMAR,
  SEED_AP_FRENCH_LANG_WRITING,
  SEED_AP_CHINESE_LANG_GRAMMAR,
  SEED_AP_CHINESE_LANG_CHARACTERS,
  SEED_IB_SPANISH_TEXT_TYPES,
  SEED_IB_FRENCH_TEXT_TYPES,
  // Coverage wave 11 (2026-05-06) — SAT teaching plans (Math + R&W).
  SEED_SAT_MATH_LINEAR_WORD_PROBLEMS,
  SEED_SAT_MATH_SYSTEMS_EQUATIONS,
  SEED_SAT_MATH_INEQUALITIES,
  SEED_SAT_MATH_PERCENT,
  SEED_SAT_MATH_RATIOS_RATES,
  SEED_SAT_MATH_STATISTICS,
  SEED_SAT_MATH_QUADRATICS,
  SEED_SAT_MATH_EXPONENTS,
  SEED_SAT_MATH_FUNCTIONS,
  SEED_SAT_MATH_GEOMETRY,
  SEED_SAT_MATH_TRIGONOMETRY,
  SEED_SAT_MATH_COMPLEX_NUMBERS,
  SEED_SAT_MATH_RATIONAL_RADICAL,
  SEED_SAT_RW_WORDS_IN_CONTEXT,
  SEED_SAT_RW_MAIN_IDEA,
  SEED_SAT_RW_EVIDENCE,
  SEED_SAT_RW_INFERENCE,
  SEED_SAT_RW_GRAMMAR_COMMAS,
  SEED_SAT_RW_GRAMMAR_AGREEMENT,
  SEED_SAT_RW_GRAMMAR_STRUCTURE,
  SEED_SAT_RW_RHETORICAL_SYNTHESIS,
  SEED_SAT_RW_TRANSITIONS,
  // QA harness — test-* plans (see import block at top of file).
  SEED_TEST_K2_MATH_COMPARING_NUMBERS,
  SEED_TEST_G5_SCI_CARBON_CYCLE,
  SEED_TEST_G7_MATH_DIRECT_INVERSE_VARIATION,
  SEED_TEST_HS_BIO_SEX_LINKED_PEDIGREE,
  SEED_TEST_G7_SS_APOLLO_MISSIONS,
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
  if (b === 'k-2') return ['k', '1', '2', 'k-2'];
  if (b === '3-5') return ['3', '4', '5', '3-5'];
  if (b === '6-8') return ['6', '7', '8', '6-8'];
  if (b === '9-10') return ['9', '10', '9-10', '9-12'];
  if (b === '11-12') return ['11', '12', '11-12', '9-12'];
  if (b === 'ap') return ['ap', '11', '12', '9-12', '11-12'];
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

/** Topic aliases — map UI taxonomy topic IDs to the set of plan-tag
 *  topic IDs that should match. Plans across many seed batches use
 *  different but related tags ('algebra', 'algebra-1', 'equations',
 *  'expressions' all live under the UI's 'algebra-1' topic).
 *
 *  Without this expansion, hundreds of plans were silently filtered
 *  out because their plan.topic didn't equal the picker's selected
 *  taxonomy topic ID.
 *
 *  Pattern: keys are taxonomy topic IDs from src/lib/tutor/topic-taxonomy.ts;
 *  values list the plan.topic strings that should match. The taxonomy
 *  ID itself is implicit — we always include it. */
const TOPIC_ALIASES: Record<string, string[]> = {
  // ── Math ──
  'algebra-1': ['algebra', 'algebra-1', 'equations', 'expressions', 'inequalities'],
  'algebra-2': ['algebra-2', 'polynomials', 'rational-functions', 'exponential-functions', 'logarithms'],
  'pre-algebra': ['pre-algebra', 'integers', 'number-system', 'number-theory'],
  'fractions-decimals': ['fractions', 'decimals', 'percent', 'percents', 'percentages'],
  'multiplication-division': ['multiplication', 'division', 'operations'],
  'addition-subtraction': ['addition', 'subtraction', 'operations'],
  'counting': ['counting', 'numbers', 'number-system', 'place-value'],
  'place-value': ['place-value', 'numbers', 'number-system'],
  'geometry-basics': ['angles', 'circles', 'measurement', 'volume'],
  'geometry': ['geometry', 'angles', 'circles', 'congruence', 'similarity', 'transformations', 'volume'],
  'geometry-angles': ['geometry', 'angles', 'circles', 'volume'],
  'ratios-proportions': ['ratios', 'proportions', 'percent', 'percents'],
  'expressions-equations': ['expressions', 'equations', 'inequalities'],
  'statistics-probability': ['statistics', 'probability', 'data'],
  'measurement-time': ['measurement', 'data'],
  'measurement-data': ['measurement', 'data', 'statistics'],
  'word-problems': ['word-problems'],
  'pre-calculus': ['precalculus', 'trigonometry', 'trig-identities', 'sequences'],
  'trigonometry': ['trigonometry', 'trig-identities'],
  'intro-calculus': ['calculus', 'precalculus'],
  'sequences-series': ['sequences'],
  'logarithms-exponentials': ['logarithms', 'exponential-functions', 'exponents'],
  'matrices': ['matrices', 'algebra-2'],
  'linear-functions': ['linear-functions', 'functions'],
  'quadratic-equations': ['quadratics'],
  'systems-of-equations': ['systems-of-equations', 'equations'],
  'polynomials': ['polynomials'],
  'intro-statistics': ['intro-statistics', 'statistics', 'probability'],
  'calculus-1': ['calculus'],
  'calculus-2': ['calculus'],
  'integers-rational': ['integers', 'integer-operations', 'rational-numbers', 'pre-algebra'],
  'coordinate-plane': ['coordinate-plane', 'coordinate-geometry'],
  'order-of-operations': ['order-of-operations', 'operations'],
  'shapes-patterns': ['shapes-patterns', 'shapes', 'geometry-basics', 'patterns'],
  'discrete-math': ['discrete-math', 'discrete-math-cs'],
  'linear-algebra': ['linear-algebra'],
  'ib-math-applications': ['ib-math-applications', 'ibdp-ai', 'ibdp-aa'],
  // ── Science ──
  'living-things': ['cells-and-life', 'life-science', 'animals-habitats'],
  'cell-biology': ['cell-biology', 'cells-and-life', 'biology'],
  'biology': ['biology', 'genetics', 'cell-biology'],
  'chemistry-basics': ['chemistry', 'matter'],
  'chemistry': ['chemistry'],
  'physics-basics': ['physics', 'forces-and-motion', 'waves', 'energy'],
  'physics': ['physics', 'physics-mechanics', 'waves', 'energy', 'forces-and-motion'],
  'forces-motion': ['forces-and-motion', 'physics', 'physics-mechanics'],
  'earth-science': ['earth-science', 'earth-and-space', 'earth-systems'],
  'earth-space-science': ['earth-and-space', 'earth-science', 'earth-systems'],
  'earth-space': ['earth-and-space', 'earth-science', 'earth-systems'],
  'genetics': ['genetics', 'biology'],
  'ecology': ['ecology', 'biology'],
  'environmental-science': ['environmental-science'],
  'matter-materials': ['matter', 'chemistry'],
  'physical-science': ['physical-science', 'physics', 'chemistry'],
  'astronomy': ['astronomy', 'space', 'earth-and-space'],
  'biology-advanced': ['biology', 'genetics', 'evolution', 'ecology'],
  'chemistry-advanced': ['chemistry'],
  'human-body': ['human-body', 'biology', 'life-science'],
  'anatomy-physiology': ['anatomy', 'human-body', 'biology'],
  'weather-seasons': ['weather-seasons', 'earth-and-space', 'weather'],
  'animals-habitats': ['animals-habitats', 'life-science', 'habitats'],
  'life-cycles': ['life-cycles', 'life-science'],
  'ecosystems': ['ecosystems', 'ecology', 'environmental-science'],
  'water-cycle': ['water-cycle', 'earth-systems', 'earth-and-space'],
  'light-sound': ['light-sound', 'waves'],
  'simple-machines': ['simple-machines', 'forces-and-motion'],
  'ap-chemistry': ['ap-chemistry', 'chemistry'],
  'ap-physics-c-mech': ['ap-physics-c-mech', 'physics-mechanics'],
  'ap-physics-c-em': ['ap-physics-c-em', 'physics'],
  'ap-environmental': ['ap-environmental', 'environmental-science'],
  'ib-biology': ['ib-biology'],
  'ib-chemistry': ['ib-chemistry'],
  'ib-physics': ['ib-physics'],
  // ── ELA — gradeband bucket tags surface across the relevant taxonomy topics ──
  'phonics-reading': ['phonics', 'reading', 'reading-foundations', 'k2-ela'],
  'sight-words': ['k2-ela', 'phonics', 'reading-foundations'],
  'basic-writing': ['k2-ela', 'writing'],
  'vocabulary-building': ['k2-ela', 'vocabulary'],
  'listening-comprehension': ['k2-ela', 'speaking-listening'],
  'reading-comprehension': ['reading-comprehension', 'reading', 'g35-ela'],
  'grammar-punctuation': ['g35-ela', 'grammar'],
  'paragraph-writing': ['g35-ela', 'writing'],
  'vocabulary': ['vocabulary', 'g35-ela', 'g68-ela'],
  'spelling': ['spelling', 'g35-ela'],
  'book-reports': ['g35-ela', 'reading-comprehension'],
  'literary-analysis': ['literary-analysis', 'literary-devices', 'g68-ela', 'g912-ela'],
  'essay-writing': ['g68-ela', 'g912-ela', 'argument-writing', 'writing'],
  'grammar-mechanics': ['grammar', 'g68-ela'],
  'vocabulary-context': ['vocabulary', 'g68-ela'],
  'poetry': ['poetry', 'g68-ela', 'g912-ela'],
  'narrative-writing': ['g68-ela', 'g35-ela', 'writing'],
  'research-skills': ['research', 'g68-ela'],
  'literature-fiction': ['literature', 'g912-ela', 'reading-comprehension'],
  'literature-nonfiction': ['literature', 'g912-ela', 'reading-comprehension'],
  'persuasive-writing': ['argument-writing', 'rhetoric', 'g912-ela'],
  'research-papers': ['research', 'g912-ela'],
  'rhetoric-argument': ['rhetoric', 'argument-writing', 'g912-ela'],
  'vocabulary-sat': ['vocabulary', 'g912-ela'],
  'american-literature': ['literature', 'g912-ela'],
  'british-literature': ['literature', 'g912-ela', 'drama'],
  'world-literature': ['literature', 'g912-ela'],
  'advanced-composition': ['g912-ela', 'writing'],
  'critical-analysis': ['g912-ela', 'literary-analysis'],
  'college-essays': ['g912-ela'],
  // ── Social Studies — gradeband bucket tags ──
  'communities': ['communities', 'community', 'k2-ss'],
  'maps-globes': ['k2-ss', 'us-geography', 'geography'],
  'us-regions': ['us-geography', 'g35-ss', 'geography'],
  'native-american-cultures': ['g35-ss'],
  'colonial-america': ['us-history', 'g35-ss', 'g68-ss'],
  'american-revolution': ['us-history', 'g35-ss', 'g68-ss'],
  'us-constitution': ['government', 'civics', 'us-history', 'g35-ss', 'g68-ss', 'g912-ss'],
  'westward-expansion': ['us-history', 'g35-ss', 'g68-ss'],
  'civil-war': ['us-history', 'g35-ss', 'g68-ss', 'g912-ss'],
  'reconstruction': ['us-history', 'g68-ss', 'g912-ss'],
  'progressive-era': ['us-history', 'g68-ss', 'g912-ss'],
  'world-war-1': ['world-history', 'us-history', 'g68-ss', 'g912-ss'],
  'world-war-2': ['world-history', 'us-history', 'g68-ss', 'g912-ss'],
  'cold-war': ['world-history', 'us-history', 'g68-ss', 'g912-ss'],
  'civil-rights-movement': ['us-history', 'g68-ss', 'g912-ss'],
  'great-depression': ['us-history', 'g68-ss', 'g912-ss'],
  'industrial-revolution': ['world-history', 'us-history', 'g68-ss'],
  'ancient-civilizations': ['world-history', 'g68-ss'],
  'medieval-europe': ['world-history', 'g68-ss'],
  'renaissance': ['world-history', 'g68-ss'],
  'world-religions': ['culture', 'world-history', 'g68-ss'],
  'world-geography': ['geography', 'us-geography', 'human-geography'],
  'us-government': ['government', 'civics', 'g35-ss', 'g68-ss', 'g912-ss'],
  'state-governments': ['government', 'civics', 'g35-ss'],
  'citizenship': ['civics', 'g35-ss'],
  'economics': ['economics', 'g35-ss', 'g68-ss', 'g912-ss'],
  'micro-economics': ['economics', 'g912-ss'],
  'macro-economics': ['economics', 'g912-ss'],
  'community-helpers': ['community-helpers', 'communities', 'community', 'k2-ss'],
  'holidays-traditions': ['holidays-traditions', 'k2-ss', 'culture'],
  'rules-citizenship': ['rules-citizenship', 'k2-ss', 'civics'],
  'early-american-history': ['early-american-history', 'us-history', 'g35-ss'],
  'world-cultures': ['world-cultures', 'culture', 'g35-ss'],
  'government-basics': ['government-basics', 'government', 'civics', 'g35-ss'],
  'economics-basics': ['economics-basics', 'economics', 'g35-ss'],
  'native-americans': ['native-americans', 'native-american-cultures', 'g35-ss'],
  'us-history-to-1877': ['us-history-to-1877', 'us-history', 'g68-ss'],
  'us-history-1877-present': ['us-history-1877-present', 'us-history', 'g68-ss'],
  'economics-ms': ['economics-ms', 'economics', 'g68-ss'],
  'us-history': ['us-history', 'g912-ss', 'g68-ss'],
  'government-politics': ['government-politics', 'government', 'civics', 'g912-ss'],
  'geography': ['geography', 'world-geography', 'us-geography', 'human-geography'],
  'ap-european-history': ['ap-european-history', 'european-history'],
  'ap-human-geography': ['ap-human-geography', 'ap-human-geo', 'human-geography'],
  'ib-history': ['ib-history'],
  // ── Test prep namespaces ──
  // SAT/ACT topic IDs are now canonical under Test Prep › SAT/ACT only;
  // the math/ela/science subject-level SAT/ACT cells were removed.
  // Aliases below absorb legacy plan-tag spellings that drifted across batches.
  'sat-math': ['sat-math', 'sat-math-full', 'sat-math-no-calc', 'sat-math-calc'],
  'sat-reading-writing': ['sat-reading-writing', 'sat-reading', 'sat-reading-full', 'sat-writing', 'sat-writing-full'],
  'act-math': ['act-math', 'act'],
  'act-reading': ['act-reading', 'act'],
  'act-english': ['act-english', 'act'],
  'act-science': ['act-science', 'act'],
  'gre-quant': ['gre-quant'],
  'gre-verbal': ['gre-verbal'],
  'gmat-quant': ['gmat-quant'],
  'gmat-verbal': ['gmat-verbal'],
  // JEE Main + JEE Advanced are full-exam topics covering all three
  // subjects (Physics + Chemistry + Math). Their picker cells aggregate
  // every JEE-tagged plan so students see the complete content.
  'jee-main': ['jee-main', 'jee-physics', 'jee-chemistry', 'jee-math',
               'jee-organic', 'jee-physical-chem', 'jee-inorganic',
               'jee-coordinate-geometry', 'physics-mechanics'],
  'jee-advanced': ['jee-main', 'jee-physics', 'jee-chemistry', 'jee-math',
                   'jee-organic', 'jee-physical-chem', 'jee-inorganic',
                   'jee-coordinate-geometry'],
  'gcse-math-higher': ['gcse-math'],
  'ib-math-analysis': ['ibdp-aa', 'calculus', 'precalculus'],
  // Music / arts
  'ap-music-theory': ['music-theory'],
  'ap-art-history': ['art-history'],
  // Computer science
  'ap-cs-a': ['computer-science', 'ap-cs-a'],
  'ap-cs-principles': ['computer-science', 'ap-cs-principles'],
  // ── Civics / government cross-references ──
  'civics-government': ['civics', 'government'],
  // ── Test-prep specific cell aliases (cell-id → plan tags) ──
  'ap-test-strategy': ['ap-test-strategy'],
  'ssat-isee': ['ssat-isee'],
  'jee-chemistry': ['jee-chemistry', 'jee-organic', 'jee-physical-chem', 'jee-inorganic'],
  'jee-math': ['jee-math', 'jee-coordinate-geometry'],
  'gre-aw': ['gre-aw', 'gre-analytical-writing'],
  'nclex-pn': ['nclex-pn'],
  'gre-math-subject': ['gre-math-subject'],
  'gre-physics-subject': ['gre-physics-subject'],
  // ── ELA AP/IB + College ──
  'ib-english-a': ['ib-english-a'],
  'college-writing': ['college-writing', 'college-ela'],
  'intro-literature': ['intro-literature', 'college-ela'],
  'academic-research': ['academic-research', 'college-ela'],
};

/** Returns true if the plan's topic matches the filter topic — directly
 *  or via the alias map. If filter.topic is empty, returns true. */
function topicMatches(filterTopic: string | undefined, planTopic: string | undefined): boolean {
  if (!filterTopic) return true;
  if (!planTopic) return false;
  if (planTopic === filterTopic) return true;
  const aliases = TOPIC_ALIASES[filterTopic];
  return !!aliases && aliases.includes(planTopic);
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
 *    - plan.topic matches filter.topic (e.g. JEE/SAT/GRE seeds whose
 *      plan.subject is the underlying area but plan.topic is a
 *      specific exam ID like 'jee-advanced').
 *
 *  All standardized-test content (SAT, ACT, JEE, NEET, GRE, GMAT,
 *  MCAT, NCLEX, AP-strategy) lives under subject='test-prep'. The
 *  picker no longer surfaces these cells under math/ela/science
 *  subject-level SAT/ACT — use Test Prep instead. */
export async function listLessonPlans(filter: LessonPlanFilter = {}): Promise<LessonPlan[]> {
  const matches = (p: LessonPlan) => {
    let subjectOk: boolean;
    if (filter.subject === 'test-prep') {
      subjectOk =
        p.subject === 'test-prep' ||
        p.topic === 'test-prep' ||
        (!!filter.topic && topicMatches(filter.topic, p.topic));
    } else {
      subjectOk = subjectMatches(filter.subject, p.subject);
    }
    return (
      subjectOk &&
      gradeMatches(filter.grade, p.grade) &&
      (!filter.curriculum || p.curriculum === filter.curriculum) &&
      topicMatches(filter.topic, p.topic) &&
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
        // like 'jee-advanced' / 'sat-math' / 'gre-quant').
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
    if (filter.topic) {
      // Apply topic aliases on the DB side too — match plans whose
      // topic equals the filter or any aliased plan-tag.
      const aliases = TOPIC_ALIASES[filter.topic];
      if (aliases && aliases.length > 0) {
        const all = Array.from(new Set([filter.topic, ...aliases]));
        query.topic = { $in: all };
      } else {
        query.topic = filter.topic;
      }
    }
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
