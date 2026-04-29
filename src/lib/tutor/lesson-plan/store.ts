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
  SEED_G3_SCI_LIFE_CYCLES,
  SEED_G4_SCI_ENERGY_TRANSFER,
  SEED_G5_SCI_PHOTOSYNTHESIS_BASICS,
  SEED_G6_SCI_CELLS,
  SEED_G7_SCI_GENETICS_PUNNETT,
  SEED_G7_SCI_PLATE_TECTONICS,
  SEED_G8_SCI_NEWTONS_LAWS,
  SEED_BIO_CELL_THEORY_STRUCTURE,
  SEED_BIO_CELLULAR_RESPIRATION,
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
