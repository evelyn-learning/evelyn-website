/**
 * Lint every HS-core plan (selected by known course infix: alg1 today).
 * Deliberately excludes legacy evelyn.hs.science.* and evelyn.hs.bio.sex-linked.*
 * seeds which use out-of-scope ID structures.
 * Mirrors lint-testprep-plans.ts. Run: npm run lint:hs-plans
 */
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';
import type { SegmentTryYourself } from '../src/lib/tutor/lesson-plan/types';
import { HS_PACING_THRESHOLDS } from '../src/lib/tutor/lesson-plan/seeds/_hs-shared';

// course infix → expected identity; extend as Geometry/Bio/Chem land.
const COURSES: Record<string, { subject: string; topic: string; loPrefix: string; std: string }> = {
  alg1: { subject: 'math', topic: 'algebra-1', loPrefix: 'alg1', std: 'ALG1' },
  geom: { subject: 'math', topic: 'geometry', loPrefix: 'geom', std: 'GEOM' },
  whist: { subject: 'social-studies', topic: 'world-history', loPrefix: 'whist', std: 'WHIST' },
};

const COURSE_SEL = new RegExp(`^evelyn\\.hs\\.(${Object.keys(COURSES).join('|')})\\.`);
const ID_PATTERN = /^evelyn\.hs\.([a-z0-9]+)\.[a-z0-9-]+\.v\d+$/;
const FRQ_MARKERS = /frq|dbq|leq|saq/i;

const errors: string[] = [];
const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`);

const plans = SEED_PLANS.filter((p) => COURSE_SEL.test(p.id));
if (plans.length === 0) {
  console.error(`lint-hs-plans: no plans matching evelyn.hs.(${Object.keys(COURSES).join('|')}) found`);
  process.exit(1);
}

for (const p of plans) {
  const md = (p.metadata ?? {}) as Record<string, unknown>;
  const m = ID_PATTERN.exec(p.id);
  if (!m) {
    err(p.id, 'id must match evelyn.hs.<course>.<slug>.v<N>');
    continue;
  }
  const course = COURSES[m[1]];
  if (!course) {
    err(p.id, `unknown course infix '${m[1]}'`);
    continue;
  }
  if (p.curriculum !== 'HS') err(p.id, `curriculum must be 'HS'`);
  if (p.grade !== '9-10') err(p.id, `grade must be '9-10'`);
  if (p.subject !== course.subject) err(p.id, `subject must be '${course.subject}'`);
  if (p.topic !== course.topic) err(p.id, `topic must be '${course.topic}'`);
  if (typeof md.cedUnit !== 'string' || !/^([1-9]|10)$/.test(md.cedUnit)) err(p.id, 'metadata.cedUnit must be a string 1-10');
  if (typeof md.cedTopic !== 'string' || !/^([1-9]|10)\.\d+$/.test(md.cedTopic as string)) err(p.id, 'metadata.cedTopic must be "<u>.<t>"');
  if (typeof md.cedTitle !== 'string' || !(md.cedTitle as string).length) err(p.id, 'metadata.cedTitle required');
  if (p.los.length !== 1) err(p.id, 'exactly one LO per plan');
  const lo = p.los[0];
  if (lo && !new RegExp(`^${course.loPrefix}\\.[a-z0-9-]+$`).test(lo.id)) err(p.id, `loId '${lo?.id}' must match ${course.loPrefix}.<slug>`);
  if (lo?.standard && !new RegExp(`^${course.std}-([1-9]|10)\\.\\d+$`).test(lo.standard)) err(p.id, `standard '${lo?.standard}' must match ${course.std}-<u>.<t>`);
  if (lo?.standard && FRQ_MARKERS.test(lo.standard)) err(p.id, 'standard must not contain frq/dbq/leq/saq');
  if (FRQ_MARKERS.test(String(md.cedTopic)) || FRQ_MARKERS.test(String(md.cedTitle))) err(p.id, 'cedTopic/cedTitle must not contain frq/dbq/leq/saq');
  if (JSON.stringify(p.pacingThresholds) !== JSON.stringify(HS_PACING_THRESHOLDS)) err(p.id, 'pacingThresholds must be HS_PACING_THRESHOLDS');

  const tys = p.segments.filter((s): s is SegmentTryYourself => s.kind === 'try_yourself');
  if (tys.length < 2) err(p.id, `needs >=2 try_yourself segments (has ${tys.length})`);
  for (const t of tys) {
    if (t.responseFormat !== 'mcq' && t.responseFormat !== 'numeric') err(p.id, `${t.id}: responseFormat must be mcq|numeric`);
    if (t.responseFormat === 'mcq') {
      if (!t.choices || t.choices.length !== 4) err(p.id, `${t.id}: mcq needs exactly 4 choices`);
      else if (t.choices.filter((c) => c.correct).length !== 1) err(p.id, `${t.id}: exactly one correct choice`);
    }
    if (t.rubric) err(p.id, `${t.id}: rubrics are FRQ-only — not allowed in HS plans`);
  }
  if (!p.segments.some((s) => s.kind === 'recap')) err(p.id, 'needs a recap segment');
  if (p.schemaVersion !== 1) err(p.id, 'schemaVersion must be 1');
}

if (errors.length) {
  console.error(`lint-hs-plans: ${errors.length} error(s) across ${plans.length} plans:`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
const byCourse = Object.keys(COURSES)
  .map((k) => `${plans.filter((p) => p.id.startsWith(`evelyn.hs.${k}.`)).length} ${k}`)
  .join(', ');
console.log(`lint-hs-plans: ${plans.length} plans OK (${byCourse})`);
