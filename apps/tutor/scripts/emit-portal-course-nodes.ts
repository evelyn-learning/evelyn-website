/**
 * Emit an academy `seed/mappings.json` course entry (the 40 `nodes`) for one
 * registered MS course, derived from the lesson-plan seeds themselves.
 *
 * The portal's course node and the engine's lesson plan carry the same facts —
 * title, standard code, objective text, unit/topic coordinate, prerequisite
 * chain — in two repositories. Typing them a second time by hand is how the
 * two drift, so this reads the registered plans and prints the node array.
 *
 * Usage:
 *   npx tsx scripts/emit-portal-course-nodes.ts --course m6math [--out <path>]
 */
import * as fs from 'fs';
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';

const arg = (n: string): string | undefined => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const course = arg('course');
const out = arg('out');
if (!course) {
  console.error('Usage: npx tsx scripts/emit-portal-course-nodes.ts --course <m6math> [--out <path>]');
  process.exit(1);
}

const plans = SEED_PLANS.filter((p) => p.id.startsWith(`evelyn.ms.${course}.`));
if (!plans.length) {
  console.error(`✗ no registered plans for evelyn.ms.${course}.`);
  process.exit(1);
}

const rows = plans.map((p) => {
  const md = (p.metadata ?? {}) as Record<string, unknown>;
  const lo = p.los?.[0];
  if (!lo) throw new Error(`${p.id}: no learning objective`);
  const cedTopic = String(md.cedTopic ?? '');
  const [u, t] = cedTopic.split('.');
  return {
    loId: lo.id,
    cedRef: String(lo.standard ?? ''),
    title: p.title,
    learningObjective: lo.description,
    unit: Number(u),
    cedTopic,
    cedTitle: String(md.cedTitle ?? p.title),
    type: 'lesson' as const,
    seedLessonPlanId: p.id,
    isFreestyle: false,
    prerequisiteLoIds: p.prerequisites ?? [],
    _t: Number(t),
  };
});

rows.sort((a, b) => a.unit - b.unit || a._t - b._t);
const nodes = rows.map(({ _t, ...r }, i) => ({ ...r, order: i + 1 }));

// The portal renders units from these coordinates, so a gap or a repeat is a
// broken course page rather than a cosmetic flaw. Check before emitting.
const seen = new Set<string>();
for (const n of nodes) {
  if (!n.cedRef) throw new Error(`${n.loId}: missing standard code`);
  if (seen.has(n.cedTopic)) throw new Error(`duplicate cedTopic ${n.cedTopic}`);
  seen.add(n.cedTopic);
}
const expected = Array.from({ length: 10 }, (_, u) =>
  Array.from({ length: 4 }, (_, t) => `${u + 1}.${t + 1}`),
).flat();
const missing = expected.filter((e) => !seen.has(e));
if (missing.length) throw new Error(`missing cedTopic coordinates: ${missing.join(', ')}`);

// Every prerequisite must name a lesson inside this same course, or the
// portal's chain points at nothing.
const ids = new Set(nodes.map((n) => n.loId));
for (const n of nodes) {
  for (const pre of n.prerequisiteLoIds) {
    if (!ids.has(pre)) throw new Error(`${n.loId}: prerequisite ${pre} is not in this course`);
  }
}

const json = JSON.stringify(nodes, null, 2);
if (out) fs.writeFileSync(out, json + '\n');
console.log(
  out
    ? `✓ ${nodes.length} nodes → ${out} (10 units x 4 topics, chains resolve)`
    : json,
);
