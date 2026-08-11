/**
 * Unit test for the praise-echo check (verdict-detector round, session
 * portal-cb2addf5): the R41 target class where the brain's opener affirms a
 * value that DISAGREES with what the student actually said out loud
 * ("Right — $2x$." after the student said "three x"). Distinct from
 * `detectPraiseContradiction` (praise-contradiction.ts), which catches the
 * brain contradicting ITSELF later in the same turn — this compares the
 * affirmation against the STUDENT's utterance via the tri-state comparator
 * (`matchUtteranceToAnswer`). 'unknown'/'agree' verdicts and bare praise
 * must never fire; only a full-parse 'disagree' does.
 * Usage: npx tsx scripts/test-praise-echo-check.ts
 */
import { checkPraiseEcho } from '../src/lib/tutor/voice/praise-echo-check';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

// the R41 target class: affirm echoes a DIFFERENT value than the student said
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $2x$. So the second derivative is...', studentUtterance: 'three x' });
  check('echo disagrees with utterance → false_praise', r.verdict === 'false_praise', JSON.stringify(r));
}
// equivalent reformulation is fine
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $0.5$. Nice.', studentUtterance: 'one half' });
  check('equivalent echo ok', r.verdict === 'ok', JSON.stringify(r));
}
// bare praise never fires (user decision: no expectedAnswer fallback)
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right. Now try the next one.', studentUtterance: 'three x' });
  check('bare praise ok', r.verdict === 'ok', JSON.stringify(r));
}
// unknown comparator verdict never fires
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $2x$. Good.', studentUtterance: 'yeah that thing we did' });
  check('unparseable utterance ok', r.verdict === 'ok', JSON.stringify(r));
}
// Single-letter ambiguity guard (fix, 2026-08-10 review Critical): a
// $-wrapped single letter a-e ("Right — $b$! Good work.") is a math-variable
// affirmation, not an MCQ echo. Without the guard, resolveMcqLetter's
// $-stripping would collide "$b$" with choice letter "B" and kill a benign
// turn — the tutor was talking about a variable, not the student's answer.
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $b$! Good work.', studentUtterance: 'C', choices: [{ letter: 'A', text: '1' }, { letter: 'B', text: '2' }, { letter: 'C', text: '3' }] });
  check('single-letter math variable with live MCQ choices → ok (no wrongful kill)', r.verdict === 'ok', JSON.stringify(r));
}
// Same guard must hold even with no MCQ live — withholding `choices` alone
// is NOT sufficient (utterance "C" vs "$b$" still reaches the EXPRESSION
// path: 'c' vs 'b' both parse flat → disagree), so the length-1 guard has
// to fire independent of whether choices are present.
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $b$! Good work.', studentUtterance: 'C' });
  check('single-letter math variable, no MCQ choices → ok', r.verdict === 'ok', JSON.stringify(r));
}
// Widened guard (fix, 2026-08-10 re-review Important): primed single
// letters ("$y'$", derivative notation) are exactly as ambiguous as
// unprimed ones and common in calculus tutoring — the original
// /^[a-zA-Z]$/ guard let "y'" (2 chars after stripping) slip through and
// reach the comparator, reproducing the same wrongful-kill shape.
{
  const r = checkPraiseEcho({ turnTextSoFar: "Right — $y'$! Good.", studentUtterance: 'C', choices: [{ letter: 'A', text: '1' }, { letter: 'B', text: '2' }, { letter: 'C', text: '3' }] });
  check('primed single-letter (derivative notation) with live MCQ choices → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkPraiseEcho({ turnTextSoFar: "Right — $y'$! Good.", studentUtterance: 'C' });
  check('primed single-letter, no MCQ choices → ok', r.verdict === 'ok', JSON.stringify(r));
}
// Regression: multi-char math tokens are unaffected by the single-letter guard.
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — $2x$.', studentUtterance: 'three x' });
  check("multi-char token still fires false_praise (guard is single letter ± 2 primes only)", r.verdict === 'false_praise', JSON.stringify(r));
}
// MCQ shape (design decision 2026-08-10, resolving the earlier NEEDS_CONTEXT
// — see task-4-report.md): extractPraiseEcho stays frozen and never returns
// a bare letter, so this now goes through checkPraiseEcho's own MCQ-scoped
// second branch — PRAISE_OPENER_RE re-matched directly, capture resolved
// against `choices` via matchUtteranceToAnswer's MCQ path. Gated on
// `choices` being present, so this can ONLY fire when an MCQ problem is
// live — never turns a bare-letter LABEL reference in prose into a kill.
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — B. Moving on.', studentUtterance: 'C', choices: [{ letter: 'B', text: '4' }, { letter: 'C', text: '6' }] });
  check('mcq echo mismatch fires', r.verdict === 'false_praise', JSON.stringify(r));
}
// Negative: the identical opener text, but no MCQ problem is live (no
// `choices`) — the MCQ-scoped branch must not even attempt the match, since
// a bare letter with no choices context is exactly the "label reference,
// not a choice" shape the design decision says must never fire.
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — B. Moving on.', studentUtterance: 'C' });
  check('mcq-shaped opener with NO choices → ok', r.verdict === 'ok', JSON.stringify(r));
}
// Negative: choices present, but the student's utterance actually AGREES
// with the affirmed letter — must resolve to 'ok', not fire.
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — B. Moving on.', studentUtterance: 'B', choices: [{ letter: 'B', text: '4' }, { letter: 'C', text: '6' }] });
  check('mcq echo agrees with utterance → ok', r.verdict === 'ok', JSON.stringify(r));
}
// Negative: choices present, opener captures a long CLAUSE rather than a
// letter/"option B" shape — the length guard must reject it before it ever
// reaches the comparator, regardless of what the student said.
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Right — this looks correct. Next problem.', studentUtterance: 'B', choices: [{ letter: 'B', text: '4' }, { letter: 'C', text: '6' }] });
  check('mcq long-clause capture (length guard) → ok', r.verdict === 'ok', JSON.stringify(r));
}
// denial opener is not praise
{
  const r = checkPraiseEcho({ turnTextSoFar: 'Not quite — $2x$ is the derivative.', studentUtterance: 'three x' });
  check('denial opener ok', r.verdict === 'ok', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
