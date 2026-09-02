/**
 * Build a `generate-bank-items.ts` LOS file from the REGISTERED seed plans of
 * one MS course.
 *
 * `generate-bank-items.ts` derives each item's cedCode and slug from the LOS
 * file's ORDER — `<PREFIX>-<unit>.<index within unit>`, counted as the rows
 * stream past. The seeds already carry the intended coordinate in
 * `metadata.cedTopic`. Those two must agree, so this script sorts by
 * (cedUnit, cedTopic) and then ASSERTS the derived index equals cedTopic
 * rather than trusting the sort: a course whose curriculum ever skips or
 * doubles a topic index would otherwise silently ship items whose cedCodes
 * are off by one from their own lesson.
 *
 * Usage:
 *   npx tsx scripts/build-los-file.ts --course m6math --out <path>
 *
 * `--course` is the plan-id namespace segment: plan ids are
 * `evelyn.ms.<course>.<slug>.v1`.
 */
import * as fs from 'fs';
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const course = arg('course');
const out = arg('out');
if (!course || !out) {
  console.error('Usage: npx tsx scripts/build-los-file.ts --course <m6math> --out <path>');
  process.exit(1);
}

const prefix = `evelyn.ms.${course}.`;
const plans = SEED_PLANS.filter((p) => p.id.startsWith(prefix));
if (plans.length === 0) {
  console.error(`✗ no registered plans with id prefix "${prefix}"`);
  process.exit(1);
}

const rows = plans.map((p) => {
  const md = (p.metadata ?? {}) as Record<string, unknown>;
  const cedUnit = String(md.cedUnit ?? '');
  const cedTopic = String(md.cedTopic ?? '');
  const lo = p.los?.[0];
  if (!cedUnit || !cedTopic) throw new Error(`${p.id}: missing cedUnit/cedTopic`);
  if (!lo) throw new Error(`${p.id}: no learning objective`);
  const [tUnit, tIndex] = cedTopic.split('.');
  if (tUnit !== cedUnit) {
    throw new Error(`${p.id}: cedTopic "${cedTopic}" does not sit in cedUnit "${cedUnit}"`);
  }
  return {
    loId: lo.id,
    planId: p.id,
    title: p.title,
    description: lo.description,
    unit: Number(cedUnit),
    _topicIndex: Number(tIndex),
  };
});

rows.sort((a, b) => a.unit - b.unit || a._topicIndex - b._topicIndex);

// Re-derive the index the generator will compute, and require it to match the
// seed's own cedTopic. This is the second mechanism: the sort could be right
// and the curriculum still wrong.
const counters: Record<number, number> = {};
const mismatches: string[] = [];
for (const r of rows) {
  counters[r.unit] = (counters[r.unit] ?? 0) + 1;
  if (counters[r.unit] !== r._topicIndex) {
    mismatches.push(
      `${r.planId}: generator would assign ${r.unit}.${counters[r.unit]}, seed says ${r.unit}.${r._topicIndex}`,
    );
  }
}
if (mismatches.length) {
  console.error(`✗ cedCode drift — ${mismatches.length} row(s):`);
  for (const m of mismatches) console.error(`  ${m}`);
  process.exit(1);
}

const dupLoIds = rows.map((r) => r.loId).filter((id, i, a) => a.indexOf(id) !== i);
if (dupLoIds.length) {
  console.error(`✗ duplicate loId(s): ${[...new Set(dupLoIds)].join(', ')}`);
  process.exit(1);
}

const payload = rows.map(({ _topicIndex, ...rest }) => rest);
fs.writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
const units = [...new Set(rows.map((r) => r.unit))].sort((a, b) => a - b);
console.log(
  `✓ ${payload.length} LO(s) → ${out} (units ${units[0]}-${units[units.length - 1]}, cedCodes verified)`,
);
