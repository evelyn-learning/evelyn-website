/**
 * Authoritative lesson-plan taxonomy diagnostic — uses the REAL resolver.
 *
 * For every seed plan, run resolvePlanCell() (the same alias/grade-band-aware
 * predicate the drilldown uses). A plan is an ORPHAN iff it has a topic but
 * resolves to no cell — those need a data/taxonomy fix. Everything else is
 * fixed centrally by the resolver (search-select now lands in the resolved
 * cell, so the Topic dropdown always has the option).
 *
 * Run: npx tsx scripts/tutor-diagnose-mapping.ts
 */
import { writeFileSync } from 'fs';
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';
import { resolvePlanCell } from '../src/lib/tutor/lesson-plan/resolve-cell';

interface Orphan {
  id: string;
  title: string;
  file: string;
  subject: string;
  grade: string;
  topic: string;
  curriculum: string;
}

const orphans: Orphan[] = [];
let resolved = 0;
let noTopic = 0;

for (const plan of SEED_PLANS) {
  if (!plan.topic) { noTopic++; continue; }
  const cell = resolvePlanCell(plan);
  if (cell) { resolved++; continue; }
  orphans.push({
    id: plan.id, title: plan.title, file: '',
    subject: plan.subject, grade: plan.grade, topic: plan.topic ?? '',
    curriculum: plan.curriculum,
  });
}

console.log(`\nTOTAL PLANS: ${SEED_PLANS.length}`);
console.log(`  resolved to a taxonomy cell (central fix handles these): ${resolved}`);
console.log(`  no-topic (open-conversation, fine):                      ${noTopic}`);
console.log(`  TRUE ORPHANS (need data/taxonomy edit):                  ${orphans.length}\n`);

// group orphans by (subject|grade|topic|curriculum) pattern
const patterns: Record<string, { count: number; sample: string; ids: string[] }> = {};
for (const o of orphans) {
  const key = `${o.subject} | ${o.grade} | ${o.topic} | ${o.curriculum}`;
  if (!patterns[key]) patterns[key] = { count: 0, sample: o.title, ids: [] };
  patterns[key].count++;
  patterns[key].ids.push(o.id);
}
console.log(`ORPHAN PATTERNS (subject | grade | topic | curriculum):  [${Object.keys(patterns).length} distinct]`);
for (const [key, v] of Object.entries(patterns).sort((a, b) => b[1].count - a[1].count)) {
  console.log(`  [${String(v.count).padStart(3)}]  ${key}    e.g. "${v.sample}"`);
}

const out = '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/4abe41c0-5839-4273-837c-cf1e2c0d87ad/scratchpad/orphans.json';
writeFileSync(out, JSON.stringify({ orphans, patterns }, null, 2));
console.log(`\nFull orphan list → ${out}`);
