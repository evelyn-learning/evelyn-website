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

// ---------- spec §D.3 — bare praise opener + bare/same-claim denial ----------
// Third live instance of praise-then-reverse (2026-09-05 QA session, turn 5):
// the opener is BARE praise followed by prose ("Right, let's check the
// reasoning behind it…"), so neither the `not <affirmed phrase>` branch nor
// the math value-substitution branch above can see it — the affirmed capture
// is a whole prose clause, not a value. The widened branch fires when a LATER
// sentence denies, and the denial either names the student's OWN value or
// names no value at all (a denial naming a DIFFERENT value is the two-part
// "roots right, vertex wrong" shape and must stay silent).
{
  const inst3 = "Right, let's check the reasoning behind it. If we substitute x = 9 we get 27 + 6, which is 33. Right, that gives x = 21 on the other side, so x=9 isn't quite it here.";
  check('instance 3 (bare praise + "isn\'t quite it" naming the student value) fires', detectPraiseContradiction(inst3, { studentUtterance: 'x equals nine' }) !== null, JSON.stringify(detectPraiseContradiction(inst3, { studentUtterance: 'x equals nine' })));
  const bare = "Right, let's look at this together. Not quite — let's recheck the second step.";
  check('bare praise + bare denial (no value named) fires', detectPraiseContradiction(bare) !== null, JSON.stringify(detectPraiseContradiction(bare)));
  const twoPart = 'Right on the roots — two and three. Not quite on the vertex: it should be (1, -4), not (1, 4).';
  check('two-part: denial names a DIFFERENT value → does not fire', detectPraiseContradiction(twoPart, { studentUtterance: 'two and three' }) === null, JSON.stringify(detectPraiseContradiction(twoPart, { studentUtterance: 'two and three' })));
  const legit = "Right. Here's the next one: what is 7 times 8?";
  check('bare praise + no denial → null', detectPraiseContradiction(legit) === null, JSON.stringify(detectPraiseContradiction(legit)));
  const aside = "Right. Not quite the same thing happens with negatives, so watch that. Your answer of 12 is correct.";
  check('denial-shaped aside that names a different value (negatives/12) → null', detectPraiseContradiction(aside, { studentUtterance: 'twelve' }) === null, JSON.stringify(detectPraiseContradiction(aside, { studentUtterance: 'twelve' })));
}

// The exclusion above must not be defeated by a dash-form opener that leaves
// the "not quite the same…" aside in the REST of the turn (the exact aside
// class VoiceTutorRealtime's inverse-verdict gate documents at its
// `!attemptText` comment) — no value named there, so without the exclusion
// this would fire.
{
  const dashAside = "Right — good. Not quite the same thing happens with negatives, so watch that.";
  check('dash-form opener leaving the aside in the rest → still null', detectPraiseContradiction(dashAside) === null, JSON.stringify(detectPraiseContradiction(dashAside)));
}

// ---------- Flag-off proof: bareDenialWidening:false restores the OLD detector ----------
// TUTOR_FALSE_PRAISE_OPENER is this branch's kill switch too (task-1 report:
// "false-praise-opener guard + praise-contradiction widening"). This is a KILL
// path, so "off" has to mean byte-identical pre-widening behaviour — both
// shapes that the widening added must go back to null, while the two branches
// that shipped before it must still fire.
{
  const inst3 = "Right, let's check the reasoning behind it. If we substitute x = 9 we get 27 + 6, which is 33. Right, that gives x = 21 on the other side, so x=9 isn't quite it here.";
  check('flag off: instance 3 → null (pre-widening behaviour)', detectPraiseContradiction(inst3, { studentUtterance: 'x equals nine', bareDenialWidening: false }) === null);
  const bare = "Right, let's look at this together. Not quite — let's recheck the second step.";
  check('flag off: bare praise + bare denial → null', detectPraiseContradiction(bare, { bareDenialWidening: false }) === null);
  const live = 'Right — one half. …you\'ve gone one third of the way, not one half.';
  check('flag off: the ORIGINAL "not <affirmed>" branch still fires', detectPraiseContradiction(live, { bareDenialWidening: false })?.affirmed === 'one half');
  const subst = 'Right. $2x$. The derivative of $3x^2$ is $3 \\cdot 2x = 6x$ — so $f\'\'(x) = 6x$.';
  check('flag off: the value-substitution branch still fires', detectPraiseContradiction(subst, { bareDenialWidening: false })?.affirmed === '$2x$');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
