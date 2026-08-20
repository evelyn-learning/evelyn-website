/**
 * Lint every MS-core plan (selected by known course infix: m7math today).
 * Selection is by PLAN id, so nothing outside evelyn.ms.* can match.
 * Mirrors lint-hs-plans.ts. Run: npm run lint:ms-plans
 */
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';
import type { SegmentTryYourself } from '../src/lib/tutor/lesson-plan/types';
import { MS_PACING_THRESHOLDS } from '../src/lib/tutor/lesson-plan/seeds/_ms-shared';

// course infix → expected identity; extend as ELA/Science/Geography land.
const COURSES: Record<string, { subject: string; topic: string; loPrefix: string; std: string; grade: string }> = {
  m7math: { subject: 'math', topic: 'grade-7-math', loPrefix: 'm7math', std: 'M7MATH', grade: '7' },
};

const COURSE_SEL = new RegExp(`^evelyn\\.ms\\.(${Object.keys(COURSES).join('|')})\\.`);
const ID_PATTERN = /^evelyn\.ms\.([a-z0-9]+)\.[a-z0-9-]+\.v\d+$/;
const FRQ_MARKERS = /frq|dbq|leq|saq/i;

// Fixed MS lesson shape: 9 segments in this exact order, every time. Guards
// the template fan-out — a reordered/dropped/duplicated segment breaks the
// recipe silently otherwise.
const EXPECTED_SEGMENT_KINDS = [
  'hook',
  'concept',
  'worked_example',
  'worked_example',
  'try_yourself',
  'try_yourself',
  'try_yourself',
  'misconception_check',
  'recap',
];

const errors: string[] = [];
const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`);

const plans = SEED_PLANS.filter((p) => COURSE_SEL.test(p.id));
if (plans.length === 0) {
  console.error(`lint-ms-plans: no plans matching evelyn.ms.(${Object.keys(COURSES).join('|')}) found`);
  process.exit(1);
}

for (const p of plans) {
  const md = (p.metadata ?? {}) as Record<string, unknown>;
  const m = ID_PATTERN.exec(p.id);
  if (!m) {
    err(p.id, 'id must match evelyn.ms.<course>.<slug>.v<N>');
    continue;
  }
  const course = COURSES[m[1]];
  if (!course) {
    err(p.id, `unknown course infix '${m[1]}'`);
    continue;
  }
  if (p.curriculum !== 'MS') err(p.id, `curriculum must be 'MS'`);
  if (p.grade !== course.grade) err(p.id, `grade must be '${course.grade}'`);
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
  if (JSON.stringify(p.pacingThresholds) !== JSON.stringify(MS_PACING_THRESHOLDS)) err(p.id, 'pacingThresholds must be MS_PACING_THRESHOLDS');

  // MS recipe is fixed at 3 try_yourselves: 2 MCQ + 1 numeric.
  const tys = p.segments.filter((s): s is SegmentTryYourself => s.kind === 'try_yourself');
  if (tys.length !== 3) err(p.id, `needs exactly 3 try_yourself segments (has ${tys.length})`);
  if (!tys.some((t) => t.responseFormat === 'numeric')) err(p.id, 'needs at least one numeric try_yourself');
  for (const t of tys) {
    if (t.responseFormat !== 'mcq' && t.responseFormat !== 'numeric') err(p.id, `${t.id}: responseFormat must be mcq|numeric`);
    if (t.responseFormat === 'mcq') {
      if (!t.choices || t.choices.length !== 4) err(p.id, `${t.id}: mcq needs exactly 4 choices`);
      else if (t.choices.filter((c) => c.correct).length !== 1) err(p.id, `${t.id}: exactly one correct choice`);
    }
    if (t.rubric) err(p.id, `${t.id}: rubrics are FRQ-only — not allowed in MS plans`);
  }

  // Concept segments carry 4-6 keyIdeas at this grade band (HS allows 5-8).
  for (const s of p.segments) {
    if (s.kind !== 'concept') continue;
    const n = s.keyIdeas?.length ?? 0;
    if (n < 4 || n > 6) err(p.id, `${s.id}: concept needs 4-6 keyIdeas (has ${n})`);
  }

  if (!p.segments.some((s) => s.kind === 'recap')) err(p.id, 'needs a recap segment');
  if (p.schemaVersion !== 1) err(p.id, 'schemaVersion must be 1');

  // Plan-level time budget: fixed 18-22 minute band for this grade.
  if (!Number.isInteger(p.estimatedMinutes) || p.estimatedMinutes < 18 || p.estimatedMinutes > 22) {
    err(p.id, `estimatedMinutes must be an integer 18-22 (has ${p.estimatedMinutes})`);
  }

  // Segment minutes must sum to (approximately) the plan's estimatedMinutes.
  // A missing segment estimatedMinutes is its own error, not a silent 0 that
  // could paper over a bad sum.
  let segMinutesSum = 0;
  for (const s of p.segments) {
    if (typeof s.estimatedMinutes !== 'number') {
      err(p.id, `${s.id}: segment missing estimatedMinutes`);
    } else {
      segMinutesSum += s.estimatedMinutes;
    }
  }
  if (Math.abs(segMinutesSum - p.estimatedMinutes) > 1) {
    err(p.id, `segment estimatedMinutes sum (${segMinutesSum}) must be within 1 of plan estimatedMinutes (${p.estimatedMinutes})`);
  }

  // Fixed segment order — see EXPECTED_SEGMENT_KINDS.
  const kinds = p.segments.map((s) => s.kind);
  if (JSON.stringify(kinds) !== JSON.stringify(EXPECTED_SEGMENT_KINDS)) {
    err(p.id, `segment order must be [${EXPECTED_SEGMENT_KINDS.join(', ')}] but got [${kinds.join(', ')}]`);
  }
}

// Prerequisite/followUp chain: every reference must resolve to an LO in this
// band. A slug typo here is invisible until the portal builds a broken
// prerequisite graph, so it is cheaper to catch at lint time.
const loIds = new Set(plans.map((p) => p.los[0]?.id).filter(Boolean));
for (const p of plans) {
  for (const ref of [...(p.prerequisites ?? []), ...(p.followUps ?? [])]) {
    if (!loIds.has(ref)) err(p.id, `dangling prerequisite/followUp '${ref}'`);
  }
}

if (errors.length) {
  console.error(`lint-ms-plans: ${errors.length} error(s) across ${plans.length} plans:`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`lint-ms-plans: ${plans.length} plans OK`);
