/**
 * Unit test for spoken-money answer reconciliation
 * (src/lib/tutor/voice/spoken-money.ts).
 *
 * ROOT CAUSE (R49, 2026-08-20, session portal-2d53e403, 317.0s): asked for
 * $10.50 − $6.75, the student said "three seventy-five" — correct. Ink2
 * transcribed it "375.", with no decimal point. extractAnswerNumber returns
 * 375; expected is 3.75; the integer-branch epsilon (0.01) rejects them and
 * the tutor answered "Not quite — close though." It then computed the same
 * 3.75 itself 115 seconds later, contradicting its own denial.
 *
 * The reconciliation is deliberately NARROW. "375" for 3.75 is also the
 * classic misplaced-decimal ERROR, and praising that would be worse than
 * the bug being fixed — so it only fires with explicit monetary context,
 * against a 2-decimal expected value of at least one whole unit.
 *
 * Run: npx tsx scripts/test-spoken-money.ts  (npm run test:spoken-money)
 */

import { strict as assert } from 'node:assert';
import { spokenMoneyMatches, looksMonetary } from '../src/lib/tutor/voice/spoken-money';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}
const M = (utterance: string, expected: string, over: Partial<{ enabled: boolean; monetary: boolean }> = {}) =>
  spokenMoneyMatches({ enabled: true, monetary: true, utterance, expected, ...over });

// ── the live failure ────────────────────────────────────────────────────
test('the portal-2d53e403 case: "375" reconciles with 3.75 in money context', () => {
  assert.equal(M('375', '3.75'), true);
});
test('"1050" reconciles with 10.50 (the same session, one step earlier)', () => {
  assert.equal(M('1050', '10.50'), true);
});
test('"1125" reconciles with 11.25', () => {
  assert.equal(M('1125', '11.25'), true);
});

// ── the guards that keep this from praising a real error ────────────────
test('NOT monetary ⇒ never reconciles — a stray decimal place is a real mistake', () => {
  assert.equal(M('375', '3.75', { monetary: false }), false);
});
test('flag off ⇒ never reconciles', () => {
  assert.equal(M('375', '3.75', { enabled: false }), false);
});
test('expected must carry exactly two decimals — 3.7 is not a cents value', () => {
  assert.equal(M('37', '3.7'), false);
});
test('expected must be at least one whole unit — "4" against $0.04 stays a mismatch', () => {
  assert.equal(M('4', '0.04'), false);
});
test('utterance must be a BARE integer — "3.75" is already comparable normally', () => {
  assert.equal(M('3.75', '3.75'), false);
});
test('a genuinely wrong integer does not reconcile', () => {
  assert.equal(M('380', '3.75'), false);
});
test('sign mismatch never reconciles', () => {
  assert.equal(M('-375', '3.75'), false);
});
test('matching negatives do reconcile', () => {
  assert.equal(M('-375', '-3.75'), true);
});
test('empty / junk sides are false, never throwing', () => {
  assert.equal(M('', '3.75'), false);
  assert.equal(M('375', ''), false);
  assert.equal(M('about three', '3.75'), false);
});

// ── looksMonetary: the context signal the reconciliation depends on ─────
test('looksMonetary: currency symbols', () => {
  assert.equal(looksMonetary('10.50 - 6.75 = ?'), false, 'bare digits are NOT money');
  assert.equal(looksMonetary('$10.50 - $6.75 = ?'), true);
  assert.equal(looksMonetary('£4.50 + £6.75'), true);
});
test('looksMonetary: currency words', () => {
  assert.equal(looksMonetary('Wednesday the vending machine takes 6 dollars 75'), true);
  assert.equal(looksMonetary('how many cents are left?'), true);
  assert.equal(looksMonetary('what is the total cost?'), true);
  assert.equal(looksMonetary('the price after the discount'), true);
});
test('looksMonetary: unrelated prose stays false', () => {
  assert.equal(looksMonetary('what is 10.50 minus 6.75 in metres?'), false);
  assert.equal(looksMonetary(''), false);
  assert.equal(looksMonetary('the scholarly account of medieval trade'), false, '"scholar" must not trip a "$" -less match');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
