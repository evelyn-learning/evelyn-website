/**
 * Lint every Digital SAT / ACT plan (selected by plan.topic, NOT id — the
 * legacy evelyn.testprep.sat.* seeds keep their old shape and are exempt).
 * Mirrors lint-ap-plans.ts. Run: npm run lint:testprep-plans
 *
 * We load seed files directly (not via store.ts) because store.ts pulls in
 * `@/lib/db` which needs Next.js path-alias resolution. Then we validate
 * that each globbed plan is registered in SEED_PLANS (store.ts).
 */
import * as fs from 'fs';
import * as path from 'path';
import type { LessonPlan, SegmentTryYourself } from '../apps/marketing/src/lib/tutor/lesson-plan/types';
import { TESTPREP_PACING_THRESHOLDS } from '../apps/marketing/src/lib/tutor/lesson-plan/seeds/_testprep-shared';
import { SEED_PLANS } from '@/lib/tutor/lesson-plan/store';

const TOPICS = ['digital-sat', 'act'] as const;
const ID_PATTERN = /^evelyn\.testprep\.(dsat|act)\.[a-z0-9-]+\.v\d+$/;
const FRQ_MARKERS = /frq|dbq|leq|saq/i;

const errors: string[] = [];
const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`);

function isLessonPlan(x: unknown): x is LessonPlan {
  if (!x || typeof x !== 'object') return false;
  const p = x as Record<string, unknown>;
  return typeof p.id === 'string' && Array.isArray(p.segments) && typeof p.curriculum === 'string';
}

function loadAllPlans(): LessonPlan[] {
  const seedsDir = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'lesson-plan', 'seeds');
  const files = fs.readdirSync(seedsDir).filter((f) => f.endsWith('.ts') && !f.startsWith('_'));
  const plans: LessonPlan[] = [];
  for (const file of files) {
    const fullPath = path.join(seedsDir, file);
    let mod: Record<string, unknown>;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require(fullPath);
    } catch (loadErr) {
      console.error(`⚠️  failed to require ${file}: ${loadErr instanceof Error ? loadErr.message.slice(0, 200) : loadErr}`);
      continue;
    }
    for (const [key, val] of Object.entries(mod)) {
      if (key.startsWith('SEED_') && isLessonPlan(val)) {
        plans.push(val);
      }
    }
  }
  return plans;
}

const allPlans = loadAllPlans();
const globbedTestprepPlans = allPlans.filter((p) => TOPICS.includes(p.topic as (typeof TOPICS)[number]));
const seedPlanIds = new Set(SEED_PLANS.map((p) => p.id));

// Check registration: each globbed testprep plan must be in SEED_PLANS
for (const p of globbedTestprepPlans) {
  if (!seedPlanIds.has(p.id)) {
    err(p.id, 'plan is authored in seeds/ but not registered in store.ts SEED_PLANS');
  }
}

// Lint only registered plans
const plans = globbedTestprepPlans.filter((p) => seedPlanIds.has(p.id));
if (plans.length === 0) {
  console.error('lint-testprep-plans: no plans with topic digital-sat/act found');
  process.exit(1);
}

for (const p of plans) {
  const md = (p.metadata ?? {}) as Record<string, unknown>;
  if (!ID_PATTERN.test(p.id)) err(p.id, 'id must match evelyn.testprep.(dsat|act).<slug>.v<N>');
  if (p.topic === 'digital-sat' && p.curriculum !== 'SAT') err(p.id, `curriculum must be 'SAT'`);
  if (p.topic === 'act' && p.curriculum !== 'ACT') err(p.id, `curriculum must be 'ACT'`);
  if (p.grade !== 'sat-act') err(p.id, `grade must be 'sat-act'`);
  if (p.subject !== 'test-prep') err(p.id, `subject must be 'test-prep'`);
  if (typeof md.cedUnit !== 'string' || !/^[1-8]$/.test(md.cedUnit)) err(p.id, 'metadata.cedUnit must be a string 1-8');
  if (typeof md.cedTopic !== 'string' || !/^[1-8]\.\d+$/.test(md.cedTopic as string)) err(p.id, 'metadata.cedTopic must be "<u>.<t>"');
  if (typeof md.cedTitle !== 'string' || !(md.cedTitle as string).length) err(p.id, 'metadata.cedTitle required');
  if (p.los.length !== 1) err(p.id, 'exactly one LO per plan');
  const lo = p.los[0];
  if (lo && !/^(dsat|act)\.[a-z0-9-]+$/.test(lo.id)) err(p.id, `loId '${lo?.id}' must match (dsat|act).<slug>`);
  if (lo?.standard && FRQ_MARKERS.test(lo.standard)) err(p.id, 'standard must not contain frq/dbq/leq/saq');
  if (FRQ_MARKERS.test(String(md.cedTopic)) || FRQ_MARKERS.test(String(md.cedTitle))) err(p.id, 'cedTopic/cedTitle must not contain frq/dbq/leq/saq');
  if (JSON.stringify(p.pacingThresholds) !== JSON.stringify(TESTPREP_PACING_THRESHOLDS)) err(p.id, 'pacingThresholds must be TESTPREP_PACING_THRESHOLDS');

  const tys = p.segments.filter((s): s is SegmentTryYourself => s.kind === 'try_yourself');
  if (tys.length < 2) err(p.id, `needs >=2 try_yourself segments (has ${tys.length})`);
  for (const t of tys) {
    if (t.responseFormat !== 'mcq' && t.responseFormat !== 'numeric') err(p.id, `${t.id}: responseFormat must be mcq|numeric`);
    if (t.responseFormat === 'mcq') {
      if (!t.choices || t.choices.length !== 4) err(p.id, `${t.id}: mcq needs exactly 4 choices`);
      else if (t.choices.filter((c) => c.correct).length !== 1) err(p.id, `${t.id}: exactly one correct choice`);
    }
    if (t.rubric) err(p.id, `${t.id}: rubrics are FRQ-only — not allowed in test-prep plans`);
  }
  if (!p.segments.some((s) => s.kind === 'recap')) err(p.id, 'needs a recap segment');
  if (p.schemaVersion !== 1) err(p.id, 'schemaVersion must be 1');
}

if (errors.length) {
  console.error(`lint-testprep-plans: ${errors.length} error(s) across ${plans.length} plans:`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`lint-testprep-plans: ${plans.length} plans OK (${plans.filter((p) => p.topic === 'digital-sat').length} dsat, ${plans.filter((p) => p.topic === 'act').length} act)`);
