/**
 * Unit test for the intra-sentence resume-from-cut clause-tail extractor (P5).
 * Usage: npx tsx scripts/test-resume-from-cut.ts
 */
import { clauseTailFromFraction } from '../src/lib/tutor/voice/resume-from-cut';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

// The live ear-test (Test 2) sentence. The only boundary is the comma at ~0.70.
const balloon = "the burner heats the air inside the balloon, temperature goes up";
// Cut AFTER the comma → clause-snap to the second clause.
const r1 = clauseTailFromFraction(balloon, 0.78);
check('clause-snap: cut after "balloon," resumes from "temperature goes up"',
  r1 === 'temperature goes up', r1);

// Cut WITHIN the opening clause (mid-"balloon", before the comma) → restart the
// whole sentence (no earlier boundary). This IS the early-cut fallback (Q3).
const r2 = clauseTailFromFraction(balloon, 0.62);
check('cut inside the first clause → restart whole sentence', r2 === balloon, r2);
const r2b = clauseTailFromFraction(balloon, 0.15);
check('very early cut → restart whole sentence', r2b === balloon, r2b);

// Clause-leader boundary (no punctuation): "and".
const andSent = "the gas expands and the piston pushes outward";
const r3 = clauseTailFromFraction(andSent, 0.6);
check('clause-leader "and": resume from "and the piston pushes outward"',
  r3 === 'and the piston pushes outward', r3);

// Multiple clauses — snap to the LATEST boundary at-or-before the cut.
const three = "first we heat it, then it expands, and finally it cools";
check('multi-clause: cut ~0.5 → "then it expands, and finally it cools"',
  clauseTailFromFraction(three, 0.5) === 'then it expands, and finally it cools',
  clauseTailFromFraction(three, 0.5));
check('multi-clause: cut ~0.85 → "and finally it cools"',
  clauseTailFromFraction(three, 0.85) === 'and finally it cools',
  clauseTailFromFraction(three, 0.85));

// Late cut keeps the (small) tail — never drops content.
const q = "so what happens to the volume";
check('no clause boundary at all → whole sentence (restart)',
  clauseTailFromFraction(q, 0.9) === q, clauseTailFromFraction(q, 0.9));

// Dash boundary.
const dash = "energy goes in — the molecules speed up";
check('dash boundary: resume from "the molecules speed up"',
  clauseTailFromFraction(dash, 0.7) === 'the molecules speed up', clauseTailFromFraction(dash, 0.7));

// Guards.
check('empty sentence → empty', clauseTailFromFraction('', 0.5) === '');
check('fraction 0 → whole sentence', clauseTailFromFraction(balloon, 0) === balloon);
check('fraction 1 → latest boundary tail (not empty)',
  clauseTailFromFraction(balloon, 1) === 'temperature goes up', clauseTailFromFraction(balloon, 1));
check('NaN fraction → whole sentence (safe)', clauseTailFromFraction(balloon, NaN) === balloon);
// A hyphenated word must NOT be treated as a clause boundary.
const hyphen = "the well-known result is that entropy increases";
check('hyphenated word is not a boundary',
  clauseTailFromFraction(hyphen, 0.3) === hyphen, clauseTailFromFraction(hyphen, 0.3));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
