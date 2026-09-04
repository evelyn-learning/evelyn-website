/**
 * Unit test for the spoken-arithmetic claim checker (false denials / false assertions).
 * Guards against the live bug: tutor said "$18 - 3$ isn't $15$" — but 18 - 3 IS 15.
 * Usage: npx tsx scripts/test-arithmetic-claim-check.ts
 */
import { checkArithmeticClaims } from '../src/lib/tutor/voice/arithmetic-claim-check';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

type Verdict = 'ok' | 'false_denial' | 'false_assertion';
function expectVerdict(sentence: string, verdict: Verdict, correct?: string) {
  const r = checkArithmeticClaims(sentence);
  check(`[${verdict}] ${JSON.stringify(sentence)}`, r.verdict === verdict, JSON.stringify(r));
  if (correct !== undefined) {
    check(`    …correct === ${JSON.stringify(correct)}`, r.correct === correct, JSON.stringify(r.correct));
  }
}

// ---------- The live bug ----------
const liveBug = "Close — check that subtraction.$18 - 3$ isn't $15$ — try that subtraction again.";
expectVerdict(liveBug, 'false_denial', '18 - 3 = 15');
{
  const r = checkArithmeticClaims(liveBug);
  check('    …claim contains "18 - 3"', (r.claim ?? '').includes('18 - 3'), JSON.stringify(r.claim));
}

// ---------- Denials ----------
expectVerdict("18 - 3 isn't 15", 'false_denial', '18 - 3 = 15');
expectVerdict("18 - 3 is not 15", 'false_denial', '18 - 3 = 15');
expectVerdict("18 - 3 does not equal 15", 'false_denial', '18 - 3 = 15');
expectVerdict("18 - 3 doesn't equal 15", 'false_denial', '18 - 3 = 15');
expectVerdict("18 - 3 isn't 14", 'ok');                 // correct denial
expectVerdict("18 - 3 does not equal 14", 'ok');        // correct denial
expectVerdict("18 - 3 isn’t 15", 'false_denial');       // curly apostrophe

// ---------- Assertions ----------
expectVerdict("18 - 3 is 14", 'false_assertion', '18 - 3 = 15');
expectVerdict("18 - 3 is 15", 'ok');
expectVerdict("18 - 3 = 14", 'false_assertion', '18 - 3 = 15');
expectVerdict("18 - 3 = 15", 'ok');
expectVerdict("3 plus 4 equals 8", 'false_assertion', '3 + 4 = 7');
expectVerdict("31 - 2, that's 29", 'ok');               // correct "that's" assertion
expectVerdict("31 - 2, that's 28", 'false_assertion', '31 - 2 = 29');

// ---------- Word-form operators ----------
expectVerdict("18 minus 3 isn't 15", 'false_denial', '18 - 3 = 15');
expectVerdict("6 times 7 is 42", 'ok');
expectVerdict("6 times 7 is 44", 'false_assertion', '6 × 7 = 42');
expectVerdict("20 divided by 4 is 5", 'ok');
expectVerdict("20 divided by 4 is 4", 'false_assertion', '20 / 4 = 5');

// ---------- Unicode operators / negative numbers ----------
expectVerdict("−3 − 5 is −8", 'ok');                    // U+2212 minus, correct
expectVerdict("−3 − 5 is −7", 'false_assertion', '-3 - 5 = -8');
expectVerdict("3 × 4 is 13", 'false_assertion', '3 × 4 = 12');
expectVerdict("3 · 4 is 12", 'ok');
expectVerdict("15 ÷ 2 isn't 7.5", 'false_denial', '15 / 2 = 7.5');
expectVerdict("$18 - 3$ isn't $15$", 'false_denial', '18 - 3 = 15');
expectVerdict("$15/2$ is $7$", 'false_assertion', '15 / 2 = 7.5');

// ---------- Division / decimals ----------
expectVerdict("15 / 2 is 7.5", 'ok');
expectVerdict("15 / 2 is 7", 'false_assertion', '15 / 2 = 7.5');
expectVerdict("5 / 0 is 10", 'ok');                     // never fire on div-by-zero
expectVerdict("1.5 + 1.5 isn't 3", 'false_denial', '1.5 + 1.5 = 3');
expectVerdict("1.5 + 1.5 is 3.1", 'false_assertion', '1.5 + 1.5 = 3');
expectVerdict("0.1 + 0.2 isn't 0.3", 'false_denial', '0.1 + 0.2 = 0.3'); // float tolerance
expectVerdict("1 / 3 is 0.33", 'ok');                   // rounded-to-stated-precision is fine
expectVerdict("100000 + 1 is 100002", 'false_assertion', '100000 + 1 = 100001');

// ---------- Careful negatives: must all be ok ----------
expectVerdict("x - 3 isn't 15", 'ok');                  // variable operand
expectVerdict("x minus 3 isn't 15", 'ok');
expectVerdict("$Q3 - Q1$ isn't 15", 'ok');              // variables in math span
expectVerdict("18 - 3 isn't the IQR", 'ok');            // non-numeric RHS
expectVerdict("that isn't 15", 'ok');                   // no expression
expectVerdict("The total is 18. Minus 3 isn't 15 though.", 'ok'); // sentence boundary
expectVerdict("3 - 1.5 × 15 is 22.5", 'ok');            // two ops — skip
expectVerdict("5 - 3 - 1 is 1", 'ok');                  // two ops — skip
expectVerdict("18 - 3 is 15 - 2", 'ok');                // trailing op — skip
expectVerdict("50 - 25 is 25%", 'ok');                  // percent attached
expectVerdict("18cm - 3cm is 15cm", 'ok');              // units attached
expectVerdict("see questions 3-5, that's 7", 'ok');     // compact hyphen = likely range
expectVerdict("22 / 7 is about 3.14", 'ok');            // approximation word
expectVerdict("18 - 3 is roughly 14", 'ok');            // approximation word (even though wrong)
expectVerdict("18 - 3 ≈ 14", 'ok');                     // approx symbol
expectVerdict("", 'ok');
expectVerdict("no numbers here at all", 'ok');
expectVerdict("great job, let's keep going!", 'ok');

// ---------- Chained operators (portal-9a9b7c09) ----------
// ─── portal-9a9b7c09 @451.1s — the sum is 182, the tutor said 38 ───
{
  const r = checkArithmeticClaims(
    "Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's *thirty-eight*.",
    { normalizeSpokenWords: true },
  );
  check('portal-9a9b7c09: spoken chained sum, false total → false_assertion',
    r.verdict === 'false_assertion', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims("Right. 16 + 9 + 9 + 4 + 144 = 38", { normalizeSpokenWords: true });
  check('same claim in digits → false_assertion', r.verdict === 'false_assertion', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims("Right. 16 + 9 + 9 + 4 + 144 — that's 182.", { normalizeSpokenWords: true });
  check('the CORRECT total → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('2 * 3 * 4 is 26', { normalizeSpokenWords: true });
  check('chained product, wrong → false_assertion', r.verdict === 'false_assertion', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('2 * 3 * 4 is 24', { normalizeSpokenWords: true });
  check('chained product, right → ok', r.verdict === 'ok', JSON.stringify(r));
}
// ─── FALSE-KILL REGRESSIONS: mixed operators must never be judged ───
{
  const r = checkArithmeticClaims('16 + 9 * 2 is 50', { normalizeSpokenWords: true });
  check('mixed operators are NEVER judged (precedence) → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('3 + 4 * 5 + 6 is 100', { normalizeSpokenWords: true });
  check('mixed operators, longer chain → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('16 plus 9 plus 9 plus 4 plus 144', { normalizeSpokenWords: true });
  check('a chain with no claimed total → ok', r.verdict === 'ok', JSON.stringify(r));
}
// ─── the existing binary behaviour is untouched with the flag off ───
{
  const r = checkArithmeticClaims("Close — 18 - 3 isn't 15 — try that subtraction again.");
  check('binary false_denial still fires with no opts', r.verdict === 'false_denial', JSON.stringify(r));
}
{
  const r = checkArithmeticClaims('18 - 3 is 14.');
  check('binary false_assertion still fires with no opts', r.verdict === 'false_assertion', JSON.stringify(r));
}

// ---------- Never throws ----------
try {
  checkArithmeticClaims(null as unknown as string);
  checkArithmeticClaims(undefined as unknown as string);
  checkArithmeticClaims("$$$ --- ×÷ isn't is 3 3 3");
  check('never throws on garbage input', true);
} catch (e) {
  check('never throws on garbage input', false, String(e));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
