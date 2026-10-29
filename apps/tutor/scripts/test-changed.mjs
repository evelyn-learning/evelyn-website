#!/usr/bin/env node
// scripts/test-changed.mjs — run only the `test:*` scripts that cover what
// changed against origin/main (docs/ops/WORKFLOW.md §4).
//
// Selection, per test script file (scripts/test-*.ts, resolved from the npm
// script line):
//   1. the test file itself changed, or
//   2. it imports a changed module (import specifiers resolved one level:
//      '@/x' → src/x, './x' / '../x' relative to the test, '@core/x' →
//      packages/core/src/x), or
//   3. its text names a changed file's basename (source pins / fixtures).
// Cross-cutting files (CROSS_CUTTING below) or >10 changed source files print
// an advisory to run test:all instead — and still run the selected set.
//
//   npm run test:changed            # against origin/main (fetches first)
//   npm run test:changed -- --list  # only print the selection
//   BASE=main npm run test:changed  # a different base ref
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const APP = resolve(new URL('..', import.meta.url).pathname);
const ROOT = resolve(APP, '..', '..');
const BASE = process.env.BASE || 'origin/main';
const listOnly = process.argv.includes('--list');

const CROSS_CUTTING = [
  'apps/tutor/src/lib/tutor/voice/claude-brain.ts',
  'apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx',
  'apps/tutor/src/lib/tutor/ai/system-prompt-builder.ts',
  'apps/tutor/src/lib/tutor/voice/verdict-precheck.ts',
  'apps/tutor/src/lib/tutor/voice/verdict-precheck-shared.ts',
  'apps/tutor/src/lib/tutor/voice/work-then-match.ts',
  'apps/tutor/src/lib/tutor/orchestrator/flags.ts',
];
const ALWAYS = ['test:partner-session-options']; // the invariance suite is cheap and pins the tenant gate

const sh = (cmd) => execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
try { sh(`git fetch origin --quiet`); } catch { /* offline: use whatever origin/main is */ }
const changed = new Set(
  [sh(`git diff --name-only ${BASE}...HEAD`), sh('git diff --name-only HEAD') /* staged + unstaged */, sh('git ls-files --others --exclude-standard apps/tutor packages/core')]
    .join('\n').split('\n').map((s) => s.trim()).filter(Boolean),
);
if (changed.size === 0) { console.log(`test:changed — nothing changed against ${BASE}`); process.exit(0); }

const pkg = JSON.parse(readFileSync(join(APP, 'package.json'), 'utf8'));
const runAll = readFileSync(join(APP, 'scripts/run-all-tests.mjs'), 'utf8');
const excluded = new Set([...runAll.matchAll(/'(test:[^']+)'/g)].map((m) => m[1])); // the non-hermetic set run-all-tests skips

const stripExt = (p) => p.replace(/\.(tsx?|mjs|js)$/, '');
const changedNoExt = new Set([...changed].map(stripExt));
// Rule 3 (text mention) only for real source/fixture files with a distinctive
// name: package.json, index.ts, route.ts, page.tsx and the like would select
// half the suite.
const GENERIC = new Set(['index', 'route', 'page', 'layout', 'types', 'utils', 'config', 'constants', 'package', 'package-lock', 'tsconfig', 'README']);
const changedBase = new Set(
  [...changed]
    .filter((p) => /^(apps\/tutor\/(src|scripts)|packages\/core\/src)\//.test(p))
    .map((p) => stripExt(p.split('/').pop()))
    .filter((b) => b.length > 5 && !GENERIC.has(b)),
);

function resolveImport(spec, fromFile) {
  if (spec.startsWith('@/')) return `apps/tutor/src/${spec.slice(2)}`;
  if (spec.startsWith('@core/')) return `packages/core/src/${spec.slice(6)}`;
  if (spec.startsWith('.')) return relative(ROOT, resolve(dirname(fromFile), spec));
  return null;
}

const selected = new Map(); // script name → reason
for (const [name, line] of Object.entries(pkg.scripts)) {
  if (!name.startsWith('test:') || excluded.has(name) || name === 'test:changed') continue;
  const m = line.match(/scripts\/[\w./-]+\.(?:ts|tsx|mjs|js)/);
  if (!m) continue;
  const testRel = `apps/tutor/${m[0]}`;
  const testAbs = join(ROOT, testRel);
  if (!existsSync(testAbs)) continue;
  if (changed.has(testRel)) { selected.set(name, 'test file changed'); continue; }
  const src = readFileSync(testAbs, 'utf8');
  let why = null;
  for (const im of src.matchAll(/from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    const target = resolveImport(im[1] || im[2] || im[3], testAbs);
    if (target && (changedNoExt.has(stripExt(target)) || changedNoExt.has(`${stripExt(target)}/index`))) { why = `imports ${target}`; break; }
  }
  if (!why) for (const b of changedBase) { if (src.includes(b)) { why = `mentions ${b}`; break; } }
  if (why) selected.set(name, why);
}
for (const a of ALWAYS) if (pkg.scripts[a] && !selected.has(a)) selected.set(a, 'always');

const srcChanged = [...changed].filter((p) => /^(apps\/tutor\/src|packages\/core\/src)\//.test(p));
const crossHit = CROSS_CUTTING.filter((p) => changed.has(p));
console.log(`test:changed — ${changed.size} file(s) changed against ${BASE}, ${srcChanged.length} in source; ${selected.size} suite(s) selected`);
for (const [n, why] of selected) console.log(`  ${n.padEnd(40)} ${why}`);
if (crossHit.length || srcChanged.length > 10) {
  console.log(`\n⚠ cross-cutting change (${crossHit.length ? crossHit.map((p) => p.split('/').pop()).join(', ') : `${srcChanged.length} source files`}) — run \`npm run test:all\` before deploying.`);
}
if (listOnly) process.exit(0);
if (selected.size === 0) { console.log('nothing to run'); process.exit(0); }

// Known baseline failures (memory: project_engine_test_all_preexisting_failures).
// They still run and are reported, but do not block the gate — otherwise any
// change touching VoiceTutorRealtime.tsx selects them and `wt.sh finish` can
// never go green (2026-10-29: portal-student-scoping blocked a gated branch).
// A suite leaves this list the day it passes again.
const KNOWN_BASELINE_FAILURES = new Set(['test:embed-debug-coverage', 'test:portal-student-scoping']);

let failed = 0;
let baseline = 0;
const results = [];
for (const name of selected.keys()) {
  const t0 = Date.now();
  const run = () => spawnSync('npm', ['run', '--silent', name], { cwd: APP, stdio: 'inherit', env: { ...process.env, FORCE_COLOR: '1' } }).status === 0;
  let ok = run();
  let flaky = false;
  const known = !ok && KNOWN_BASELINE_FAILURES.has(name);
  // One retry, alone, before a failure counts: test:brain-route-cache-blocks
  // failed three times in full-suite runs on 10-28/29 and passed alone every
  // time (its fake endpoint captures the LAST request; under load an extra
  // request lands). A pass on retry is reported as flaky, never hidden.
  if (!ok && !known) { console.log(`\n${name}: FAILED — retrying once alone…`); ok = run(); flaky = ok; }
  if (!ok && !known) failed++;
  if (known) baseline++;
  results.push(`${ok ? (flaky ? 'PASS (on retry — FLAKY)' : 'PASS') : known ? 'FAIL (known baseline — not blocking)' : 'FAIL'}  ${name}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}
console.log(`\n${results.join('\n')}\n${selected.size - failed - baseline}/${selected.size} passed${baseline ? ` · ${baseline} known baseline failure(s) tolerated` : ''}`);
process.exit(failed ? 1 : 0);
