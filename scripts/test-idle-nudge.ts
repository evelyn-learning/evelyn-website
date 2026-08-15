/**
 * Idle re-engagement nudge decisions (round-7g).
 *
 * Regression under test: session portal-b2fe010e (2026-07-28) — the tutor
 * ended a confirmation turn with no next move and NOTHING re-engaged for
 * 7.7 minutes of mutual silence. The nudge must fire after quiet, back
 * off while busy/hidden, and cap out rather than nag.
 *
 * Run: npx tsx scripts/test-idle-nudge.ts
 */
import {
  createIdleNudgeState,
  decideIdleNudge,
  idleNudgeArmDelayMs,
  recordIdleNudgeFired,
  recordStudentEngagement,
  IDLE_NUDGE_FIRST_MS,
  IDLE_NUDGE_REPEAT_MS,
  IDLE_NUDGE_MAX_PER_STRETCH,
  IDLE_NUDGE_MAX_PER_SESSION,
  IDLE_NUDGE_DIRECTIVE,
} from '../apps/marketing/src/lib/tutor/voice/idle-nudge';

let failures = 0;
function check(name: string, cond: boolean, got?: unknown) {
  if (!cond) { failures++; console.error(`FAIL ${name}${got !== undefined ? ` — got ${JSON.stringify(got)}` : ''}`); }
  else console.log(`ok ${name}`);
}

// Fresh state: quiet + visible → fire (the b2fe010e case).
{
  const s = createIdleNudgeState();
  check('fresh-arm-delay-is-first', idleNudgeArmDelayMs(s) === IDLE_NUDGE_FIRST_MS);
  check('quiet-visible-fires', decideIdleNudge({ busy: false, hidden: false, state: s }) === 'fire');
}

// Busy or hidden → recheck, never fire.
{
  const s = createIdleNudgeState();
  check('busy-rechecks', decideIdleNudge({ busy: true, hidden: false, state: s }) === 'recheck');
  check('hidden-rechecks', decideIdleNudge({ busy: false, hidden: true, state: s }) === 'recheck');
}

// R38: wrap phase (elapsed ≥ wrapAtMinutes on a time-boxed demo) stands the
// nudge down outright — the wrap directive already owns the endgame and a
// nudge there would force a second sign-off.
{
  const s = createIdleNudgeState();
  check(
    'wrap-phase-stands-down',
    decideIdleNudge({ busy: false, hidden: false, wrapPhase: true, state: s }) === 'stand-down',
  );
  check(
    'wrap-phase-false-unchanged',
    decideIdleNudge({ busy: false, hidden: false, wrapPhase: false, state: s }) === 'fire',
  );
  // The phase never un-wraps once entered, so a busy/hidden recheck loop
  // would just spin forever — wrap beats the recheck path outright.
  check(
    'wrap-phase-beats-busy-recheck',
    decideIdleNudge({ busy: true, hidden: false, wrapPhase: true, state: s }) === 'stand-down',
  );
}

// After a fire, the same stretch re-arms at the longer repeat gap.
{
  const s = createIdleNudgeState();
  recordIdleNudgeFired(s);
  check('post-fire-delay-is-repeat', idleNudgeArmDelayMs(s) === IDLE_NUDGE_REPEAT_MS);
  check('second-in-stretch-fires', decideIdleNudge({ busy: false, hidden: false, state: s }) === 'fire');
}

// Stretch cap: after MAX_PER_STRETCH unanswered nudges, go quiet.
{
  const s = createIdleNudgeState();
  for (let i = 0; i < IDLE_NUDGE_MAX_PER_STRETCH; i++) recordIdleNudgeFired(s);
  check('stretch-cap-stands-down', decideIdleNudge({ busy: false, hidden: false, state: s }) === 'stand-down');
  // Student comes back → stretch resets → nudging is available again.
  recordStudentEngagement(s);
  check('engagement-resets-stretch', decideIdleNudge({ busy: false, hidden: false, state: s }) === 'fire');
  check('engagement-resets-delay', idleNudgeArmDelayMs(s) === IDLE_NUDGE_FIRST_MS);
}

// Session cap survives engagement resets.
{
  const s = createIdleNudgeState();
  for (let i = 0; i < IDLE_NUDGE_MAX_PER_SESSION; i++) {
    recordStudentEngagement(s);
    recordIdleNudgeFired(s);
  }
  recordStudentEngagement(s);
  check('session-cap-stands-down', decideIdleNudge({ busy: false, hidden: false, state: s }) === 'stand-down');
}

// Directive is bracketed-synthetic (the orchestrator keys on a leading '[')
// and stays one instruction, not a script.
check('directive-bracketed', /^\[System note:/.test(IDLE_NUDGE_DIRECTIVE) && IDLE_NUDGE_DIRECTIVE.endsWith(']'));
check('directive-no-nested-brackets', !IDLE_NUDGE_DIRECTIVE.slice(1, -1).includes('['));

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('test:idle-nudge PASS');
