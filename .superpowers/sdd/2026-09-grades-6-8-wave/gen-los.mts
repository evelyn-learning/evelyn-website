// Build <course>-los.json from the registered lesson-plan store: [{loId, planId, title, description, unit}]
// usage (from apps/tutor): npx tsx ../../.superpowers/sdd/2026-09-grades-6-8-wave/gen-los.mts m8sci ../../.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-los.json
import { writeFileSync } from 'node:fs';
const [course, out] = process.argv.slice(2);
const store = await import('../../../apps/tutor/src/lib/tutor/lesson-plan/store');
const plans: any[] = (store as any).LESSON_PLAN_SEEDS ?? (store as any).default ?? Object.values(store).find((v: any) => Array.isArray(v));
if (!Array.isArray(plans)) throw new Error('could not find the seed array export in store.ts; exports: ' + Object.keys(store).join(','));
const rows = plans
  .filter((p: any) => p.id?.startsWith(`evelyn.ms.${course}.`))
  .map((p: any) => ({ loId: p.los[0].id, planId: p.id, title: p.title, description: p.los[0].description, unit: Number(p.metadata?.cedUnit) }))
  .sort((a: any, b: any) => a.unit - b.unit || a.planId.localeCompare(b.planId));
writeFileSync(out, JSON.stringify(rows, null, 2) + '\n');
console.log(`${course}: ${rows.length} rows -> ${out}`);
