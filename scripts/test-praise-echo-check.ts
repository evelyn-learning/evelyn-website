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
