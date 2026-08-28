/**
 * Unit test for the card/narration numeric-match validator (E2, prod
 * session 2026-08-06/07): the brain called show_segment_card, the runtime
 * resolved the AUTHORED card onto the board, but the brain narrated a
 * completely different improvised problem in the same turn's speech, then
 * scolded the student for answering the board's (authored) problem.
 *
 * REVIEW FIX (2026-08-08): the first cut only extracted digits, so it
 * silently passed the exact incident it was built for — the VERBATIM
 * live narration has zero digits ("Here's a real-world one — a taxi ride
 * costs a flat five dollars, plus one fifty for every kilometer."). The
 * $-notation taxi phrasing below is a secondary, easier-to-read case, NOT
 * the live failure shape — the verbatim-shape test is the one using
 * spelled-out numbers.
 *
 * Usage: npx tsx scripts/test-card-narration.ts
 */
import { detectCardNarrationMismatch } from '../src/lib/tutor/voice/card-narration-mismatch';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

const CAR_CARD = 'A car travels 240 miles in 4 hours. Find the rate of change.';

// ---------- The live failure, VERBATIM shape (spelled-out, zero digits) ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    "Here's a real-world one — a taxi ride costs a flat five dollars, plus one fifty for every kilometer.",
  );
  check('verbatim live narration (spelled-out, zero digits) vs car card → reject', r.reject === true, JSON.stringify(r));
}

// ---------- Secondary shape: same scenario, $-notation instead of prose ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    "Let's say a taxi charges a $5 flat fee plus $1.50 per kilometer traveled. What's the rate of change here?",
  );
  check('improvised different problem, digit/$ notation (taxi vs car) → reject', r.reject === true, JSON.stringify(r));
}

// ---------- Spelled-out paraphrase using the CARD's own numbers → pass ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    'So imagine a car going two hundred forty miles over four hours — what\'s the rate of change?',
  );
  check('spelled-out paraphrase reusing card numbers → pass', r.reject === false, JSON.stringify(r));
}

// ---------- Digit paraphrase using the card's own numbers → pass ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    "So we've got a car going 240 miles over 4 hours — what's the rate of change?",
  );
  check('digit paraphrase reusing card numbers → pass', r.reject === false, JSON.stringify(r));
}

// ---------- Short transition, <2 numbers spoken → pass ----------
{
  const r = detectCardNarrationMismatch(CAR_CARD, "Nice, let's check that.");
  check('short transition with 0 numbers → pass', r.reject === false, JSON.stringify(r));
}
{
  const r = detectCardNarrationMismatch(CAR_CARD, "That's 5. Nicely done.");
  check('short verdict with 1 digit → pass', r.reject === false, JSON.stringify(r));
}
{
  const r = detectCardNarrationMismatch(CAR_CARD, "That's five. Nicely done.");
  check('short verdict with 1 spelled-out number → pass', r.reject === false, JSON.stringify(r));
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

// ---------- "one fifty" ambiguity: EITHER reading matching the card favors passing ----------
{
  const RENTAL_CARD = 'A rental costs a flat $150 plus $2 per mile. Find the cost after 10 miles.';
  const r = detectCardNarrationMismatch(RENTAL_CARD, "That's one fifty, right?");
  check(
    '"one fifty" ambiguous phrase, the 150 reading matches the card → pass (favors passing)',
    r.reject === false,
    JSON.stringify(r),
  );
}

// ---------- "one fifty" ambiguity: neither reading matches → both candidates count as foreign ----------
{
  const r = detectCardNarrationMismatch(CAR_CARD, "Actually, it's one fifty, not the car problem.");
  check(
    '"one fifty" ambiguous phrase, neither reading matches the card → reject (both candidates foreign)',
    r.reject === true,
    JSON.stringify(r),
  );
}

// ---------- Solo "one" as pronoun (not numeral) must not false-trigger ----------
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    "Here's a real-world one — let's think about it differently.",
  );
  check('solo "one" as pronoun, no other numbers → pass (not treated as a numeral)', r.reject === false, JSON.stringify(r));
}

// ---------- REVIEW ROUND 2 (2026-08-08): unconditional solo-"one" suppression was unsafe ----------
// Round 1's suppression treated EVERY standalone "one" as the pronoun,
// unconditionally. That silently passed a genuine-numeral "one" paired
// with exactly one other foreign number, because the spokenNums.size<2
// early-pass gate and the newNums.length>=2 reject gate sit at the same
// threshold. Verified failing before the fix: reject:false.
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    'The answer here is one, and it also costs five dollars.',
  );
  check(
    'round-2 (a): genuine-numeral "one" (not a determiner/pronoun slot) + one foreign number → reject',
    r.reject === true,
    JSON.stringify(r),
  );
}

// Round-2 (b): the ORIGINAL verbatim-incident test above must stay green.
// It's unaffected either way (it rejects on "five" + "one fifty" alone),
// but re-asserted here explicitly per the round-2 review requirement.
{
  const r = detectCardNarrationMismatch(
    CAR_CARD,
    "Here's a real-world one — a taxi ride costs a flat five dollars, plus one fifty for every kilometer.",
  );
  check(
    'round-2 (b): verbatim live narration still rejects regardless of how "one" itself resolves',
    r.reject === true,
    JSON.stringify(r),
  );
}

// ---------- Round-2 bonus: directly exercise the context-aware suppression paths ----------
// (Neither mandated round-2 case above actually walks the suppression
// branch: (a) hits the "count as numeral" branch, (b)'s "a real-world one"
// has "world" — not "a" — as its immediate predecessor due to hyphen
// splitting, so it also falls through to "count as numeral" and only
// passes because five + one-fifty already clear the reject bar on their
// own. These two cases pin the suppression branch itself.)
{
  // prevTok "the" is in DETERMINER_CONTEXT → suppressed → only "five" is
  // foreign → below the 2-number threshold → pass.
  const r = detectCardNarrationMismatch(CAR_CARD, "That's the one, and it also costs five dollars.");
  check(
    'round-2 bonus: "the one" (determiner immediately before) → suppressed → pass',
    r.reject === false,
    JSON.stringify(r),
  );
}
{
  // nextTok "that" is in FOLLOWED_BY_PRONOUN_CONTEXT → suppressed → only
  // "five" is foreign → below the 2-number threshold → pass.
  const r = detectCardNarrationMismatch(CAR_CARD, "I'll pick one that costs five dollars.");
  check(
    'round-2 bonus: "one that" (pronoun-context word immediately after) → suppressed → pass',
    r.reject === false,
    JSON.stringify(r),
  );
}

// ─── R58: student-number grounding (live, portal-d9e1b2d6 — fired twice
// in one session). A verdict turn quotes the STUDENT's numbers, then
// advances and shows the next card; the student's own numbers must count
// as grounded, never as a competing problem. ───
{
  const TRY_CARD = 'Use a 2-term Taylor series for cos(x) at a = 0 to approximate cos(0.2).';
  const SPOKEN = "Exactly right. That's 1 minus 0.08 plus 0.001067, roughly 0.9211 — matching your estimate. Let's lock in one more.";
  const STUDENT = 'the first 3 non-zero terms will be 1 minus x squared by 2 plus x to the power of 4 by 24, roughly comes out to around 0.9211';
  const withoutStudent = detectCardNarrationMismatch(TRY_CARD, SPOKEN);
  check('R58 baseline: verdict quoting student numbers rejects WITHOUT student grounding',
    withoutStudent.reject === true, JSON.stringify(withoutStudent));
  const withStudent = detectCardNarrationMismatch(TRY_CARD, SPOKEN, STUDENT);
  check('R58: same verdict passes WITH student text grounding',
    withStudent.reject === false, JSON.stringify(withStudent));
  // A genuinely different improvised problem still rejects even with the
  // student's text supplied — its numbers appear in neither source.
  const stillCaught = detectCardNarrationMismatch(
    TRY_CARD,
    'A taxi ride costs a flat 5 dollars plus 1.50 for every kilometer.',
    STUDENT,
  );
  check('R58: genuine competing problem still rejects with student text',
    stillCaught.reject === true, JSON.stringify(stillCaught));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
