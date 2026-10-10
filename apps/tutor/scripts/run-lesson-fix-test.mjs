// scripts/run-lesson-fix-test.mjs
// Gate wrapper for the scripts/lesson-fix tests that read the lesson files
// kept OUTSIDE the repo (docs/whitelabel/greenapple/integration/…). Those
// files are not on a clean checkout or CI, where the test would crash on its
// first readdir; here it is SKIPPED with a clear message instead (exit 0, a
// line starting "SKIP:" that run-all-tests.mjs reports as a skip). When the
// files are there the test runs exactly as by hand:
//   env -u MONGODB_URI [LESSON_FIX_PASS=n] npx tsx scripts/lesson-fix/<name>.test.ts
// The test files themselves are not touched.
//
// Usage: node scripts/run-lesson-fix-test.mjs <simulate|add-core|add-simulate> [pass 1|2|3]
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
// The same environment overrides scripts/lesson-fix/io.ts and add-io.ts read.
const READ = process.env.LESSON_READ_DIR ?? path.join(INTEGRATION, 'lesson-read-2026-10-10');
const ADD = process.env.LESSON_ADD_DIR ?? path.join(INTEGRATION, 'lesson-add-2026-10-12');
const READ_FIXED = path.join(INTEGRATION, 'lesson-read-2026-10-10'); // add-io.ts does not read LESSON_READ_DIR

const [name, pass] = process.argv.slice(2);
/** What each test reads unconditionally (what it guards itself with existsSync is left to it). */
const NEEDS = {
  simulate: () => {
    const p = pass === '3' ? 3 : pass === '2' ? 2 : 1;
    return [
      path.join(READ, p === 3 ? 'lessons-v3' : p === 2 ? 'lessons-v2' : 'lessons'),
      p === 3 ? path.join(READ, 'patches3') : p === 2 ? path.join(READ, 'tooling-pass2', 'patches-final') : path.join(READ, 'patches', 'final'),
    ];
  },
  'add-core': () => addNeeds(),
  'add-simulate': () => addNeeds(),
};
function addNeeds() {
  return [
    path.join(ADD, 'packs'),
    path.join(INTEGRATION, 'audited-list-2026-10-06/work/prod-dump.json'),
    path.join(READ_FIXED, 'tooling/lesson-corrections.data.json'),
    path.join(READ_FIXED, 'tooling-pass2/lesson-corrections-2.data.json'),
    path.join(READ_FIXED, 'tooling-pass3/lesson-corrections-3.data.json'),
    path.join(READ_FIXED, 'lessons-v3'),
    path.join(READ_FIXED, 'expanded-45-index.json'),
    path.join(INTEGRATION, 'practice-depth-2026-10-10/packs'),
    path.join(INTEGRATION, 'practice-topup-2026-10-11/packs'),
  ];
}

if (!(name in NEEDS) || (pass !== undefined && !['1', '2', '3'].includes(pass))) {
  console.error('Usage: node scripts/run-lesson-fix-test.mjs <simulate|add-core|add-simulate> [1|2|3]');
  process.exit(2);
}
const file = `scripts/lesson-fix/${name}.test.ts`;
const missing = NEEDS[name]().filter((p) => !existsSync(p));
if (missing.length > 0) {
  console.log(`SKIP: ${file}${pass ? ` (LESSON_FIX_PASS=${pass})` : ''} — it reads lesson files kept outside the repo, and ${missing.length === 1 ? 'this one is' : `${missing.length} of them are`} not on this machine:`);
  for (const p of missing) console.log(`  ${p}`);
  process.exit(0);
}
const env = { ...process.env };
delete env.MONGODB_URI; // as the test's own header says: env -u MONGODB_URI
if (pass) env.LESSON_FIX_PASS = pass;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = spawnSync('npx', ['tsx', file], { cwd: root, env, stdio: 'inherit' });
process.exit(r.status ?? 1);
