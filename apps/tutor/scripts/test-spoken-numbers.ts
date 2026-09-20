/**
 * The tutor speaks numbers as words; every deterministic arithmetic guard
 * parses digits. portal-9a9b7c09 had seven defective turns and zero kills.
 *
 * Usage: npx tsx scripts/test-spoken-numbers.ts  (npm run test:spoken-numbers)
 */
import { spokenNumbersToDigits } from '../src/lib/tutor/voice/spoken-numbers';
import { checkArithmeticClaims } from '../src/lib/tutor/voice/arithmetic-claim-check';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}
const eq = (name: string, input: string, expected: string) =>
  check(name, spokenNumbersToDigits(input) === expected, JSON.stringify(spokenNumbersToDigits(input)));

// ─── the live sentences ───
eq('451.1s the false sum',
  "Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's *thirty-eight*.",
  "Right. 16 plus 9 plus 9 plus 4 plus 144 — that's *38*.");
eq('763.6s the unflagged reversal',
  'Right. Twelve — five plus nineteen is twenty-four, and twenty-four over two is twelve.',
  'Right. 12 — 5 plus 19 is 24, and 24 over 2 is 12.');
eq('369.2s the wrong squares', 'Right. Nine, nine, nine, four', 'Right. 9, 9, 9, 4');
eq('158.7s', 'What does thirty-five divided by five give you?', 'What does 35 divided by 5 give you?');
eq('399.9s', 'four minus seven squared is nine', '4 minus 7 squared is 9');

// ─── compound and hundreds forms ───
eq('hundreds with and', 'one hundred and forty-four', '144');
eq('plain hundreds', 'two hundred', '200');
eq('spoken shorthand "one forty-four"', 'one forty-four', '144');
eq('hyphenated shorthand', 'one-forty-four', '144');
eq('teens', 'seventeen', '17');
eq('tens compound', 'ninety-nine', '99');

// ─── FAIL CLOSED: a lone "one" is usually a determiner, never convert it ───
eq('determiner "that one number"',
  'That one number, $144$, is going to dwarf every other squared deviation.',
  'That one number, $144$, is going to dwarf every other squared deviation.');
eq('determiner "one more step"', 'one more step to go', 'one more step to go');
eq('lone one in a sum is skipped (miss, not false fire)', 'five plus one', '5 plus one');

// ─── prose "and" must survive; it only joins number words ───
eq('trailing and is handed back',
  'Add the last two nines and the four and the total lands at 182',
  'Add the last 2 nines and the 4 and the total lands at 182');

// ─── nothing to do ───
eq('no numbers', 'Take your time — no rush.', 'Take your time — no rush.');
eq('already digits', 'Distribute the $4$ across both terms.', 'Distribute the $4$ across both terms.');
eq('empty', '', '');

// ─── Leading "and" is prose even when a hundreds value follows later in the
// same run — the shape that the original `hundred`-anywhere guard broke. ───
eq('leading and + hundreds value', 'and one hundred is your answer', 'and 100 is your answer');
eq('leading and + hundreds mid-sentence',
  "She added ten, and one hundred is what's left.",
  "She added 10, and 100 is what's left.");
// Both kinds of "and" in one run: the leading one is prose and survives,
// the value-internal one is consumed into 144.
eq('leading prose and + value-internal and', 'and one hundred and forty-four', 'and 144');

// ─── "and" between two INDEPENDENT numbers must not merge them ───
// parseRun filtered every "and" unconditionally, so "twenty and forty" became
// a single value 60. That fed checkArithmeticClaims, which then read
// "We had twenty and forty times two is eighty" as "60 times 2 is 80" and
// KILLED a correct turn as a false assertion. "and" is value-internal only in
// a hundreds compound ("one hundred and forty-four"), which the cases above
// pin unchanged.
eq('independent numbers joined by "and" stay separate',
  'twenty and forty', '20 and 40');
eq('the full false-kill sentence normalizes without merging',
  'We had twenty and forty times two is eighty',
  'We had 20 and 40 times 2 is 80');

// The guard that was doing the killing, on the same sentence, end to end.
{
  const r = checkArithmeticClaims('We had twenty and forty times two is eighty', { normalizeSpokenWords: true });
  check('checkArithmeticClaims no longer kills "twenty and forty times two is eighty"',
    r.verdict === 'ok', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
