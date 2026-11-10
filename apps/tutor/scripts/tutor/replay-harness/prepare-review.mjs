// Replay harness — prepare a blind review set.
//
//   node scripts/tutor/replay-harness/prepare-review.mjs --fixture g6-fractions --arms v2none,v2all --out /tmp/review [--bundles artifacts/replay-harness]
//
// Writes <out>/<fixture>/session-A.txt … (shuffled), STUDENT.txt and RUBRIC.txt for the reviewer, and
// <out>-key/<fixture>.json (letter → arm) OUTSIDE the folder the reviewer reads. Bundles that ended in
// an error or a stall are left out. See REVIEW.md for how the review is run and how many runs it needs.
import fs from 'node:fs';
import path from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const fixture = arg('--fixture', '');
const arms = arg('--arms', '').split(',').filter(Boolean);
const out = arg('--out', '');
const bundles = arg('--bundles', path.join(process.cwd(), 'artifacts', 'replay-harness'));
if (!fixture || !arms.length || !out) { console.error('usage: --fixture <name> --arms a,b --out <dir>'); process.exit(1); }

const here = path.dirname(new URL(import.meta.url).pathname);
const files = [];
for (const arm of arms) {
  const re = new RegExp(`^${fixture}-${arm}-[a-z0-9]+\\.json$`);
  const mine = fs.readdirSync(bundles).filter((f) => re.test(f)).map((f) => path.join(bundles, f))
    .filter((f) => { const b = JSON.parse(fs.readFileSync(f, 'utf8')); return !['error', 'stall'].includes(b.endedBy) && b.turns.length >= 8; });
  console.log(`${arm}: ${mine.length} session(s)`);
  files.push(...mine);
}
for (let i = files.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [files[i], files[j]] = [files[j], files[i]]; }
if (files.length > 26) { console.error('more than 26 sessions: split the review'); process.exit(1); }

const dir = path.join(out, fixture);
fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const key = {};
files.forEach((f, i) => {
  const b = JSON.parse(fs.readFileSync(f, 'utf8')); const letter = String.fromCharCode(65 + i);
  key[letter] = { arm: b.arm, bundle: path.basename(f) };
  fs.writeFileSync(path.join(dir, `session-${letter}.txt`), b.turns.map((t, n) => `[${n + 1}] ${t.role.toUpperCase()}: ${t.text}`).join('\n\n'));
});
const fx = JSON.parse(fs.readFileSync(path.join(here, 'fixtures', `${fixture}.json`), 'utf8'));
fs.writeFileSync(path.join(dir, 'STUDENT.txt'), fx.student.who);
const rubric = path.join(here, 'rubrics', `${fixture}.txt`);
if (fs.existsSync(rubric)) fs.copyFileSync(rubric, path.join(dir, 'RUBRIC.txt'));
fs.mkdirSync(`${out}-key`, { recursive: true });
fs.writeFileSync(path.join(`${out}-key`, `${fixture}.json`), JSON.stringify(key, null, 1));
console.log(`${files.length} session(s) → ${dir}\nkey → ${out}-key/${fixture}.json (keep it away from the reviewer)`);
