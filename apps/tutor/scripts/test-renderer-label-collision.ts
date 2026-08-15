/**
 * Renderer label-collision battery. Auto-discovers fixture modules from
 * scripts/label-collision-fixtures/ (one file per renderer; each
 * default-exports LabelFixture[]) and asserts every fixture renders with
 * no label-label overlap, no label outside the viewbox, and — where the
 * fixture opts in — no label crossing an arrow shaft.
 *
 * Assertion machinery: scripts/lib/label-collision-harness.ts.
 * Add coverage by ADDING a fixture file — never edit this runner.
 *
 * Run: npx tsx scripts/test-renderer-label-collision.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { runFixture, type LabelFixture } from './lib/label-collision-harness';

async function main() {
  const dir = path.join(__dirname, 'label-collision-fixtures');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts')).sort();
  let failures = 0;
  let cases = 0;
  for (const file of files) {
    const mod = await import(path.join(dir, file));
    const fixtures: LabelFixture[] = mod.default;
    if (!Array.isArray(fixtures)) {
      failures++;
      console.error(`FAIL ${file}: default export is not a LabelFixture[]`);
      continue;
    }
    for (const f of fixtures) {
      cases++;
      const errs = runFixture(f);
      if (errs.length === 0) {
        console.log(`  ok  ${f.name}`);
      } else {
        failures += errs.length;
        for (const e of errs) console.error(`FAIL ${e}`);
      }
    }
  }
  console.log(`\n${cases} fixture(s) across ${files.length} file(s)`);
  if (failures > 0) { console.error(`${failures} failure(s)`); process.exit(1); }
  console.log('OK — renderer label-collision invariants validated');
}

main().catch((e) => { console.error(e); process.exit(1); });
