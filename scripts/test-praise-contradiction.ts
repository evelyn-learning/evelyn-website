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
import { detectPraiseContradiction } from '../src/lib/tutor/voice/praise-contradiction';

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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
