/**
 * The whiteboard must never render a solver's error text to a STUDENT.
 *
 * WHY THIS EXISTS. On 2026-08-26 a student mid-lesson on evelyntutor saw two
 * stacked red boxes reading:
 *
 *   Lewis construction error: lewis: atom "c1" (C) has only 4 valence
 *   electrons — 4 short of an octet. Add a lone pair or increase a bond order.
 *
 * That sentence is addressed to the MODEL, not the learner. A sibling branch of
 * the same solver says "set skipValidation: true if expanded octet is
 * intended", and one non-throwing branch rendered literal API documentation:
 * "provide either `formula` or `expression` (with optional `expectedUnit`)".
 * The solver was RIGHT to reject the brain's spec every time — only the
 * audience was wrong.
 *
 * ⚠ IT WAS NEVER ONE SITE. The live report surfaced the Lewis one; the file
 * held SIX, accumulated over time because nothing tested them:
 *   Passage error · Construction error · Dimensional check error ·
 *   Equation balance error · Lewis construction error · the hardcoded
 *   dimensional-check usage string.
 * No test in this repo imports WhiteboardCanvas at all, which is exactly how
 * six copies of one defect went unnoticed. Hence a SOURCE-LEVEL guard: it
 * cannot verify how the component renders, but it can make the seventh copy
 * fail loudly the moment someone writes it.
 *
 * THE RULE: inside the whiteboard command renderer, `(err as Error).message`
 * may appear ONLY on a line that also logs (console.*). Anywhere else it is
 * being interpolated into JSX, i.e. shown to a student.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const TARGET = join(ROOT, 'src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx');

/** Lines that hand a raw Error message to something other than a logger. */
function findRawErrorRenders(source: string): { line: number; text: string }[] {
  const out: { line: number; text: string }[] = [];
  source.split('\n').forEach((text, i) => {
    if (!text.includes('as Error).message')) return;
    if (text.includes('console.')) return; // logging is the correct destination
    out.push({ line: i + 1, text: text.trim() });
  });
  return out;
}

/** The red error-box styling, which by construction is student-visible. */
function findRedErrorBoxes(source: string): { line: number; text: string }[] {
  const out: { line: number; text: string }[] = [];
  source.split('\n').forEach((text, i) => {
    if (text.includes('text-red-600') && text.includes('bg-red-50')) {
      out.push({ line: i + 1, text: text.trim() });
    }
  });
  return out;
}

let failures = 0;
function check(label: string, hits: { line: number; text: string }[]) {
  if (hits.length === 0) {
    console.log(`  PASS  ${label}`);
    return;
  }
  failures++;
  console.log(`  FAIL  ${label} — ${hits.length} occurrence(s):`);
  for (const h of hits) console.log(`          :${h.line}  ${h.text.slice(0, 110)}`);
}

const source = readFileSync(TARGET, 'utf8');

// Sanity: prove we actually read the intended file. A typo'd path would make
// every check below pass vacuously — the failure mode this whole file is about.
if (!source.includes('CommandRenderer')) {
  console.error('FATAL: did not read WhiteboardCanvas.tsx (no CommandRenderer found) — the checks below would pass vacuously.');
  process.exit(1);
}
console.log(`read ${TARGET.replace(ROOT, 'apps/tutor')} (${source.split('\n').length} lines)`);

check('no raw Error.message rendered to the student', findRawErrorRenders(source));
check('no red error boxes in the whiteboard command renderer', findRedErrorBoxes(source));

// ── CONTROLS ──────────────────────────────────────────────────────────────
// Both detectors above returned "nothing found". That is only meaningful if
// they are CAPABLE of finding something — a detector that has never said "no"
// has not been tested, it has been agreed with.
const LEAK_FIXTURE = [
  '      } catch (err) {',
  '        return (',
  '          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">',
  '            Lewis construction error: {(err as Error).message}',
  '          </div>',
  '        );',
].join('\n');

const ctrlRaw = findRawErrorRenders(LEAK_FIXTURE);
const ctrlRed = findRedErrorBoxes(LEAK_FIXTURE);
if (ctrlRaw.length !== 1) {
  console.log(`  FAIL  CONTROL: raw-message detector did not fire on a known leak (found ${ctrlRaw.length}, expected 1)`);
  failures++;
} else {
  console.log('  PASS  CONTROL: raw-message detector fires on a known leak');
}
if (ctrlRed.length !== 1) {
  console.log(`  FAIL  CONTROL: red-box detector did not fire on a known leak (found ${ctrlRed.length}, expected 1)`);
  failures++;
} else {
  console.log('  PASS  CONTROL: red-box detector fires on a known leak');
}

// And the inverse control: a correctly-logged rejection must NOT be flagged,
// or the rule would forbid the very fix it is meant to protect.
const OK_FIXTURE = "        console.warn('[CommandRenderer] Lewis structure solver rejected:', (err as Error).message);";
if (findRawErrorRenders(OK_FIXTURE).length !== 0) {
  console.log('  FAIL  CONTROL: detector flags a correctly-logged rejection (false positive)');
  failures++;
} else {
  console.log('  PASS  CONTROL: a logged rejection is not flagged');
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
