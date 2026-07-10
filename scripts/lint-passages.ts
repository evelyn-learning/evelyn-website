/**
 * Passage lint: every passageId referenced by a plan segment or a bank item
 * must resolve in SEED_PASSAGES; passage ids unique; referenced passages
 * public-domain. Exits 1 on any error. Run in CI alongside lint-ap-plans.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SEED_PASSAGES, passageById } from '../src/lib/tutor/passages/store';
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';

const errors: string[] = [];

// unique ids
const ids = SEED_PASSAGES.map((p) => p.id);
for (const id of ids) if (ids.filter((x) => x === id).length > 1) errors.push(`duplicate passage id ${id}`);
for (const p of SEED_PASSAGES) if (p.license !== 'public-domain') errors.push(`passage ${p.id} not public-domain`);

// plan refs
for (const plan of SEED_PLANS) {
  for (const seg of plan.segments ?? []) {
    const pid = (seg as { passageId?: string }).passageId;
    if (pid && !passageById.has(pid)) errors.push(`plan ${plan.id} seg ${seg.id} → unknown passageId ${pid}`);
  }
}

// bank refs
const bankRoot = join(__dirname, '..', 'src', 'data', 'problem-bank');
if (existsSync(bankRoot)) {
  for (const entry of readdirSync(bankRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const course = entry.name;
    const dir = join(bankRoot, course);
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      try {
        const items = JSON.parse(readFileSync(join(dir, f), 'utf8')) as Array<{ id: string; passageId?: string }>;
        for (const it of items) if (it.passageId && !passageById.has(it.passageId)) {
          errors.push(`bank ${course}/${f} item ${it.id} → unknown passageId ${it.passageId}`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`bank ${course}/${f}: invalid JSON (${msg})`);
      }
    }
  }
}

if (errors.length === 0) { console.log(`✅ passages lint clean (${SEED_PASSAGES.length} passages)`); process.exit(0); }
console.log(`❌ ${errors.length} passage error(s):`);
for (const e of errors) console.log('  • ' + e);
process.exit(1);
