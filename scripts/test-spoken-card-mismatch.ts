/**
 * Unit test for the spoken-vs-card term mismatch detector (2026-08-10 root
 * cause, prod session portal-7cfa226c, AP Calc BC): the tutor's spoken
 * narration correctly derived one set of terms while the show_equation
 * card it rendered in the SAME turn asserted a different (transposed)
 * set — a board/narration contradiction that then snowballs via the
 * whiteboard-snapshot feedback loop.
 * Usage: npx tsx scripts/test-spoken-card-mismatch.ts
 */
import { checkSpokenCardMismatch } from '../apps/marketing/src/lib/tutor/voice/spoken-card-mismatch';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

// ---------- The live failure, verbatim shape ----------
{
  const cardLatex = "\\frac{d}{dt}[2t\\sin t] = 2\\cos t + 2t\\sin t";
  const spoken = ["Applying the product rule: $u'v + uv' = 2\\sin t + 2t\\cos t$."];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('live bug: transposed coefficients between spoken and card fires', r.mismatch === true, JSON.stringify(r));
}

// ---------- Correct pair: card matches narration → no flag ----------
{
  const cardLatex = "\\frac{d}{dt}[2t\\sin t] = 2\\sin t + 2t\\cos t";
  const spoken = ["Applying the product rule: $u'v + uv' = 2\\sin t + 2t\\cos t$."];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('correct pair: card matches narration → no flag', r.mismatch === false, JSON.stringify(r));
}

// ---------- Unrelated equation on card → no flag ----------
{
  const cardLatex = 'F = ma';
  const spoken = ["Applying the product rule: $u'v + uv' = 2\\sin t + 2t\\cos t$."];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('unrelated equation on card → no flag', r.mismatch === false, JSON.stringify(r));
}

// ---------- Term-reordered-but-equal → no flag ----------
{
  const cardLatex = 'y = 2t\\cos t + 2\\sin t';
  const spoken = ['So $y = 2\\sin t + 2t\\cos t$, same thing just reordered.'];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('term-reordered-but-equal → no flag', r.mismatch === false, JSON.stringify(r));
}

// ---------- Sign flip → flag ----------
{
  const cardLatex = 'y = 3x + 5';
  const spoken = ['We get $y = 3x - 5$ after distributing the negative.'];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('sign flip → flag', r.mismatch === true, JSON.stringify(r));
}

// ---------- No equation on card (placeholder / non-equality latex) → no flag ----------
{
  const cardLatex = 'f(x) = x^2 + 3x - 2';
  const r = checkSpokenCardMismatch([], cardLatex);
  check('no spoken sentences → no flag', r.mismatch === false, JSON.stringify(r));
}

// ---------- Card latex with no top-level "=" → no flag, never throws ----------
{
  const r = checkSpokenCardMismatch(["It's $3x^2$ after that."], '3x^2');
  check('card latex with no equality → no flag (never throws)', r.mismatch === false, JSON.stringify(r));
}

// ========== FP-hardening review round (2026-08-10) — adversarial cases ==========
// Review verdict: Fix A and Fix C mergeable as-is; Fix B had a critical FP
// class (the "shares >= 1 loose term" gate fires on common benign
// patterns). Hardened with (1) a full coefficient+base PERMUTATION gate
// (both multisets must match, not just share one term) and (2) LAST-
// ASSERTION-WINS (only the turn's final qualifying equality is judged,
// mirroring Fix A's design) — see the module doc comment for the full
// mechanism writeup.

// ---------- Case 1 (KNOWN LIMITATION — kept as documented CURRENT behavior) ----------
// "Two parallel lines in one breath": the spoken text asserts BOTH lines
// together against a card showing just one. In raw text order this is
// [equality matching the card, equality that's a sign-flip of the card] —
// which is byte-for-byte the same SHAPE as a genuine self-correction typo
// ("I wrote $y=2x-3$ by mistake — it's $y=2x+3$", see case 2b below,
// which correctly must NOT flag). Last-assertion-wins has no syntactic
// signal to tell "two intentionally distinct lines" apart from "a typo,
// corrected" — both are qualifying-match-then-qualifying-sign-flip. This
// is an ACCEPTED false-positive class (documented in the module doc
// comment), not something this deterministic parse can resolve; it would
// need discourse-level (LLM) understanding to disambiguate. Test asserts
// the CURRENT (flagging) behavior so a future change to this trade-off is
// a deliberate, visible diff here rather than a silent regression.
{
  const cardLatex = 'y = 2x + 3';
  const spoken = ['We have two parallel lines: $y = 2x + 3$ and $y = 2x - 3$.'];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('case 1 (KNOWN LIMITATION): two parallel lines in one breath still flags', r.mismatch === true, JSON.stringify(r));
}

// ---------- Case 2 (must NOT flag): draft value later corrected to a DIFFERENT value ----------
// The earlier (wrong) equality doesn't even share the card's base/
// coefficient parts ("5" vs "2" are unrelated constants) — it fails the
// permutation gate outright and is ignored; the later, corrected equality
// matches the card exactly.
{
  const cardLatex = 'y = 3x + 2';
  const spoken = ['You said $y = 3x + 5$, but it should be $y = 3x + 2$.'];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('case 2: wrong-then-right correction to a DIFFERENT value → no flag', r.mismatch === false, JSON.stringify(r));
}

// ---------- Case 2b (must NOT flag): same correction shape, but the DRAFT is a structural (sign) typo ----------
// Unlike case 2, this draft DOES qualify under the permutation gate (same
// coefficient "3" / base "x" and "2" parts as the card, just the wrong
// sign) — this is the case that specifically exercises last-assertion-
// wins: a first-match rule would flag on the draft alone.
{
  const cardLatex = 'y = 3x + 2';
  const spoken = ['Hold on, I wrote $y = 3x - 2$ by mistake — it should be $y = 3x + 2$.'];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('case 2b: structurally-qualifying draft superseded by the correction → no flag', r.mismatch === false, JSON.stringify(r));
}

// ---------- Case 3 (must NOT flag): recap / multi-part aside sharing one term with the card ----------
// The reviewer's own illustrative FP for the permutation-gate change:
// "2x + 7" spoken vs a "2x + 4" card shared the "2x" term under the old
// "shares >= 1 loose term" gate and used to flag. Bases {x,7} vs {x,4}
// don't match as a full multiset, so it's correctly ignored as unrelated.
{
  const cardLatex = 'y = 2x + 4';
  const spoken = ['Earlier, for the first part, we had $y = 2x + 7$.'];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('case 3: recap aside sharing one term ("2x+7" vs card "2x+4") → no flag', r.mismatch === false, JSON.stringify(r));
}

// ---------- Case 4 (must NOT flag): same bases, DIFFERENT coefficients ----------
// Exercises the "AND coefficient multiset must also match" half of the
// gate specifically: bases {x,y} match on both sides, but coefficients
// {5,3} vs {2,3} don't — these are just two different expressions, not a
// same-parts transposition.
{
  const cardLatex = 'z = 5x + 3y';
  const spoken = ['Combining like terms, we get $z = 2x + 3y$ after distributing.'];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('case 4: matching bases but different coefficients → no flag', r.mismatch === false, JSON.stringify(r));
}

// ---------- Case 5 (must NOT flag): different term COUNT sharing a base with the card ----------
// A 3-term spoken RHS shares two bases with the 2-term card RHS — under
// the old "shares >= 1" gate this would have qualified and then failed
// strict equality (extra term) → false flag. The permutation gate's
// length-sensitive multiset comparison rejects it outright as a
// different-shaped expression, not a value-substitution error.
{
  const cardLatex = 'y = 2\\cos t + 2t\\sin t';
  const spoken = ["Adding a constant offset: $y = 3 + 2\\sin t + 2t\\cos t$."];
  const r = checkSpokenCardMismatch(spoken, cardLatex);
  check('case 5: extra term (3 parts vs 2) sharing bases with the card → no flag', r.mismatch === false, JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
