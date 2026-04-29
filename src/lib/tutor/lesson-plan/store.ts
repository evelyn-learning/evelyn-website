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
  SEED_CHEM_ATOMIC_STRUCTURE,
  SEED_PHYS_KINEMATICS_1D,
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
