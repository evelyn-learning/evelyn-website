/**
 * Unit test for the card/narration numeric-match validator (E2, prod
 * session 2026-08-06/07): the brain called show_segment_card, the runtime
 * resolved the AUTHORED card onto the board, but the brain narrated a
 * completely different improvised problem in the same turn's speech, then
 * scolded the student for answering the board's (authored) problem.
 * Usage: npx tsx scripts/test-card-narration.ts
 */
import { detectCardNarrationMismatch } from '../src/lib/tutor/voice/card-narration-mismatch';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

const CAR_CARD = 'A car travels 240 miles in 4 hours. Find the rate of change.';

// ---------- The live failure, verbatim shape: improvised taxi problem ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    "Let's say a taxi charges a $5 flat fee plus $1.50 per kilometer traveled. What's the rate of change here?",
  );
  check('improvised different problem (taxi vs car) → reject', r.reject === true, JSON.stringify(r));
}

// ---------- Paraphrase using the card's own numbers → pass ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    "So we've got a car going 240 miles over 4 hours — what's the rate of change?",
  );
  check('paraphrase reusing card numbers → pass', r.reject === false, JSON.stringify(r));
}

// ---------- Short transition, <2 numbers spoken → pass ----------
{
  const r = detectCardNarrationMismatch(CAR_CARD, "Nice, let's check that.");
  check('short transition with 0 numbers → pass', r.reject === false, JSON.stringify(r));
}
{
  const r = detectCardNarrationMismatch(CAR_CARD, "That's 5. Nicely done.");
  check('short verdict with 1 number → pass', r.reject === false, JSON.stringify(r));
}

// ---------- Speech reuses card numbers plus one new (computed step) → pass ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    '240 miles in 4 hours gives a rate of 60 miles per hour.',
  );
  check('card numbers reused + one new computed value → pass', r.reject === false, JSON.stringify(r));
}

// ---------- Card with no numbers → pass/skip ----------
{
  const r = detectCardNarrationMismatch(
    'Explain why the slope represents a constant rate of change.',
    "Let's say a taxi charges a $5 flat fee plus $1.50 per kilometer.",
  );
  check('card with no numbers → skip (pass)', r.reject === false, JSON.stringify(r));
}

// ---------- Boundary: exactly 2 new numbers, no overlap → reject ----------
{
  const r = detectCardNarrationMismatch(CAR_CARD, 'A pizza costs 12 dollars plus 3 dollars per topping.');
  check('boundary: exactly 2 new numbers, no card overlap → reject', r.reject === true, JSON.stringify(r));
}

// ---------- One card number present alongside 2+ new numbers → pass (conservative bias) ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    'Actually, 240 — no wait, imagine instead a taxi with a $5 flat fee plus $1.50 per kilometer.',
  );
  check('one card number present among new numbers → pass (conservative)', r.reject === false, JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
