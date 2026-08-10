/**
 * Unit test for the spoken-vs-card term mismatch detector (2026-08-10 root
 * cause, prod session portal-7cfa226c, AP Calc BC): the tutor's spoken
 * narration correctly derived one set of terms while the show_equation
 * card it rendered in the SAME turn asserted a different (transposed)
 * set — a board/narration contradiction that then snowballs via the
 * whiteboard-snapshot feedback loop.
 * Usage: npx tsx scripts/test-spoken-card-mismatch.ts
 */
import { checkSpokenCardMismatch } from '../src/lib/tutor/voice/spoken-card-mismatch';

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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
