/**
 * Unit test for the praise-then-contradiction backstop (R38, session
 * embed-1785738371329): the brain's first sentence praises a value ("Right
 * — one half.") and a LATER sentence in the same turn contradicts that same
 * value ("…not one half."). Task 1 already fixed isVerdictOpener so
 * "Right —" openers get HELD instead of spoken immediately; this module is
 * the deterministic backstop for turns that are held but still wrong once
 * fully assembled — hence it runs on the full accumulated turn text, not
 * sentence 0 alone.
 * Usage: npx tsx scripts/test-praise-contradiction.ts
 */
import { detectPraiseContradiction, extractPraiseEcho } from '../src/lib/tutor/voice/praise-contradiction';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

// ---------- The live failure, verbatim shape ----------
{
  const r = detectPraiseContradiction(
    'Right — one half.\n\nThe mark on the board already shows *one third*, so let\'s connect it: ' +
    'landing on the first step after one move means you\'ve gone *one third* of the way, not one half.',
  );
  check('live bug: praise "one half" then later contradiction fires', r?.affirmed === 'one half', JSON.stringify(r));
}

// ---------- Praise with no later contradiction → null ----------
{
  const r = detectPraiseContradiction('Right — one half. Half the strip is shaded, exactly as you said.');
  check('praise with no contradiction → null', r === null, JSON.stringify(r));
}

// ---------- Corrective opener → null (other layers own that direction) ----------
{
  const r = detectPraiseContradiction('Not quite. It is one third, not one half.');
  check('corrective opener → null', r === null, JSON.stringify(r));
}

// ---------- Contradiction of a DIFFERENT value → null ----------
{
  const r = detectPraiseContradiction('Right — one third. Not one half, like the last one — one third.');
  check('contradiction of a different value → null', r === null, JSON.stringify(r));
}

// ---------- Emphasis asterisks around the token must not defeat the match ----------
{
  const r = detectPraiseContradiction('Yes — 12. Careful though: the total is *10*, not 12.');
  check('asterisk emphasis does not defeat the match', r?.affirmed === '12', JSON.stringify(r));
}

// ---------- Value-substitution shape (2026-08-10, session portal-7cfa226c) ----------
// Verbatim incident: opener affirms "$2x$", a later sentence never says
// "not 2x" — it just silently substitutes "6x" as the final derived value,
// via an intermediate equality that still contains "2x" as a factor.
{
  const r = detectPraiseContradiction(
    'Right. $2x$.\n\n' +
    'The derivative of $3x^2$ is $3 \\cdot 2x = 6x$ — so $f\'\'(x) = 6x$.',
  );
  check('value-substitution: praise "$2x$" then silent substitution to "6x" fires', r?.affirmed === '$2x$', JSON.stringify(r));
}

// ---------- Same value restated → null (no substitution) ----------
{
  const r = detectPraiseContradiction("Right. $2x$. So $f'(x) = 2x$.");
  check('value-substitution: restating the SAME affirmed value → null', r === null, JSON.stringify(r));
}

// ---------- Different problem's equality in the same turn → null ----------
// The existing detector has no cross-problem scoping of its own (it scans
// the whole accumulated turn text) — the substring-containment gate on the
// equality's LHS is what keeps this from false-positiving: neither "g(x)"
// nor "g'(x)" contains the affirmed "2x" token.
{
  const r = detectPraiseContradiction("Right. $2x$. Now try $g(x)=x^3$: $g'(x)=3x^2$.");
  check('value-substitution: different problem\'s equality → null', r === null, JSON.stringify(r));
}

// ---------- Plain praise, no math token at all → null ----------
{
  const r = detectPraiseContradiction('Right — great job! Let\'s move on to the next one.');
  check('value-substitution: plain prose praise (no math token) → null', r === null, JSON.stringify(r));
}

// ---------- R42 post-mortem: loosened captures ----------
// 40-char cap never latched on long math openers
{
  const r = detectPraiseContradiction("Right — $f'(x) = 3x^2 e^{3x} + 2x e^{3x} \\cdot x$. Wait, that should be not $f'(x) = 3x^2 e^{3x} + 2x e^{3x} \\cdot x$ ...");
  check('long math opener latches', r !== null, JSON.stringify(r));
}
// whitespace-bearing $-token enters the value-substitution branch
{
  const r = detectPraiseContradiction('Right — $3 \\cdot 2x$. So we get $3 \\cdot 2x = 7x$.');
  check('whitespace math token qualifies', r !== null, JSON.stringify(r));
}
// extractPraiseEcho: capture without requiring a contradiction
{
  const r = extractPraiseEcho('Right — $2x$. Now differentiate again.');
  check('echo extraction', r === '$2x$', JSON.stringify(r));
}
{
  const r = extractPraiseEcho('Right. Now try the next one.');
  check('bare praise no echo', r === null, JSON.stringify(r));
}
{
  const r = extractPraiseEcho('Not quite — check the sign.');
  check('non-praise returns null', r === null, JSON.stringify(r));
}

// ---------- Coordinator review fix: whole-token check, not existence check ----------
// A backslash appearing ANYWHERE (not the whole token being a delimited
// math span) must not qualify a whole prose clause as an affirmed value.
{
  const text = 'Right — you used $\\sqrt{4}$ correctly here, nice job! Now let\'s move to the next problem.';
  const echo = extractPraiseEcho(text);
  check('prose clause with embedded backslash span → no echo', echo === null, JSON.stringify(echo));
  const r = detectPraiseContradiction(text);
  check('prose clause with embedded backslash span → benign, no fire', r === null, JSON.stringify(r));
}
// A greedy `^\$.*\$$` must not span multiple $-delimited pairs as if they
// were one token.
{
  const text = 'Right — $2x$ and $3y$. Not that.';
  const echo = extractPraiseEcho(text);
  check('multi $-pair capture → no echo', echo === null, JSON.stringify(echo));
  const r = detectPraiseContradiction(text);
  check('multi $-pair capture → benign, no fire', r === null, JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
