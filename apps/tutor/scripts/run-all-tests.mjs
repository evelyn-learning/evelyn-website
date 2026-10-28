// scripts/run-all-tests.mjs
// Runs every `test:*` npm script serially and reports a pass/fail table.
// EXCLUDED: scripts that hit live networks/APIs or need a seeded DB — they are
// not hermetic, so they cannot gate a mechanical refactor. Run them by hand.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const EXCLUDE = new Set([
  'test:all',
  'test:changed',         // selector over the other test:* entries (would recurse)
  'test:portal',            // aggregate of other test:portal-* entries
  'test:outreach',          // aggregate of other test:outreach-* entries
  'test:pedagogy-sim-live', // live LLM calls
  'test:pedagogy-seed',     // writes to a DB
  'test:pedagogy',          // interactive CLI
  'test:pedagogy-driver',   // live smoke
  'test:voice-harness',     // live STT/TTS providers
  // Live Anthropic call — observed failing bare with
  // `[expandPlanLos] stage2 FAILED reason="haiku returned non-JSON"` (35s).
  'test:plan-generate',
  // Parameterized harnesses: these REQUIRE an argument and print usage +
  // exit non-zero when run bare, e.g.
  //   "Usage: npm run test:render-harvest -- <course>  (known: macro, stats, …)"
  // They are tools, not assertions — running them bare measures nothing.
  'test:render-tools',
  'test:render-harvest',
  'test:render-judge',
  'test:tutor-e2e',
  'test:tutor-judge',
]);

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const names = Object.keys(pkg.scripts).filter((n) => n.startsWith('test:') && !EXCLUDE.has(n));

const failed = [];
const skipped = [];
for (const name of names) {
  process.stdout.write(`${name} ... `);
  try {
    const out = String(execSync(`npm run --silent ${name}`, { stdio: 'pipe', timeout: 300_000 }));
    // A suite that needs files kept outside the repo says so itself (a line starting "SKIP:",
    // exit 0 — see scripts/run-lesson-fix-test.mjs); it is reported as skipped, not as a pass.
    const skip = /^SKIP: .*$/m.exec(out);
    if (skip) {
      skipped.push({ name, why: skip[0] });
      console.log('SKIP');
    } else console.log('PASS');
  } catch (err) {
    console.log('FAIL');
    failed.push({ name, output: String(err.stdout ?? '') + String(err.stderr ?? '') });
  }
}

console.log(`\n${names.length - failed.length - skipped.length}/${names.length - skipped.length} passed${skipped.length ? `, ${skipped.length} skipped` : ''}`);
for (const s of skipped) console.log(`  skipped ${s.name} — ${s.why.replace(/^SKIP: /, '')}`);
for (const f of failed) {
  console.log(`\n=== ${f.name} ===\n${f.output.slice(-2000)}`);
}
process.exit(failed.length ? 1 : 0);
