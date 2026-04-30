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
 *  a plan tagged `grade=8`. */
function gradesInBand(band: string): string[] {
  const b = band.trim().toLowerCase();
  if (b === 'k-2') return ['k', '1', '2'];
  if (b === '3-5') return ['3', '4', '5'];
  if (b === '6-8') return ['6', '7', '8'];
  if (b === '9-10') return ['9', '10'];
  if (b === '11-12') return ['11', '12'];
  if (b === 'ap' || b === 'sat-act' || b === 'college') return [b];
  return [b];
}

function gradeMatches(filterGrade: string | undefined, planGrade: string): boolean {
  if (!filterGrade) return true;
  const filterSet = gradesInBand(filterGrade);
  const plan = planGrade.trim().toLowerCase();
  return filterSet.includes(plan);
}

/** List plans matching the filter. Seeds + DB merged, deduped by id. */
export async function listLessonPlans(filter: LessonPlanFilter = {}): Promise<LessonPlan[]> {
  const matches = (p: LessonPlan) =>
    (!filter.subject || p.subject === filter.subject) &&
    gradeMatches(filter.grade, p.grade) &&
    (!filter.curriculum || p.curriculum === filter.curriculum) &&
    (!filter.topic || p.topic === filter.topic) &&
    (!filter.locale || p.locale === filter.locale);

  const seedHits = SEED_PLANS.filter(matches);
  let dbHits: LessonPlan[] = [];
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (filter.subject) query.subject = filter.subject;
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
