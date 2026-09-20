/**
 * portal-704e3e01: a false-assertion kill removed the turn's verdict and the
 * retry never restored one. The student asked, in the session, whether she
 * had got the previous question right.
 *
 * Usage: npx tsx scripts/test-verdict-preservation.ts  (npm run test:verdict-preservation)
 */
import { hasVerdictOpener, VERDICT_REPLANT_CLAUSE } from '../src/lib/tutor/voice/verdict-preservation';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── verdict openers, verbatim from the killed turns ───
check('killed turn 1414.3s opened with a verdict',
  hasVerdictOpener('Exactly. $3x = 30$ divided by $3$ gives $x = 10$.'));
check('killed turn 1113.7s opened with a verdict',
  hasVerdictOpener("Exactly. $x = 9$ — that's choice *C*."));
check('"Right —" opener', hasVerdictOpener('Right — that\'s exactly the connection.'));
check('"Not quite" is also a verdict', hasVerdictOpener('Not quite. Look at your number line.'));
check('"Correct." opener', hasVerdictOpener('Correct. Now divide both sides.'));

// ─── the retries that replaced them had none ───
check('aired retry 1430.1s had NO verdict',
  !hasVerdictOpener('The mistake here is treating $10 - 2$ as if it happens first.'));
check('aired retry 1116.4s had NO verdict',
  !hasVerdictOpener("Let's try that negative-sign trap fresh. Here's one for you — take a look."));
check('a plain question has no verdict',
  !hasVerdictOpener('What does $4(x+3)$ expand to?'));
check('a wait acknowledgement has no verdict',
  !hasVerdictOpener('Take your time — no rush.'));

// ─── mid-turn verdicts count; only the opening two sentences are scanned ───
check('verdict in sentence two still counts',
  hasVerdictOpener('Okay, one moment. Right — that lands on 10.'));
check('a verdict word buried far downstream does not',
  !hasVerdictOpener('Look at the board. There are two pieces here. Now combine them. Right.'));

// ─── the replant clause is generic (no subject content, no numbers) ───
check('replant clause carries no digits', !/\d/.test(VERDICT_REPLANT_CLAUSE));
check('replant clause is non-empty', VERDICT_REPLANT_CLAUSE.length > 40);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
