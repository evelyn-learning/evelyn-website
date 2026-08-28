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
  idleNudgeDirective,
} from '../src/lib/tutor/voice/idle-nudge';

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
  // R58 student-declared hold: the student asked for the silence — a
  // nudge is exactly what they asked us not to do.
  check(
    'hold-stands-down',
    decideIdleNudge({ busy: false, hidden: false, wrapPhase: false, hold: true, state: s }) === 'stand-down',
  );
  check(
    'hold-absent-unchanged',
    decideIdleNudge({ busy: false, hidden: false, wrapPhase: false, state: s }) === 'fire',
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

// ── R49b: a nudge must not ANSWER the question it is nudging about ──────
// Live portal-2d53e403 at 1003.4s. The tutor had asked "What's a common
// denominator for fourths and halves?" at 911.2s. 95 seconds of silence,
// idle_nudge_sent fires, and the tutor says: "Fourths — since half is just
// two fourths. No rush, Praveen — take a look at that. Once both sides
// speak 'fourths,' who's pulling harder...". It answered its own question,
// then moved on to the NEXT one — so the student was skipped entirely on a
// question they were still thinking about. Six idle_nudge_sent that session.
//
// v1's intent was already right ("softly check in or offer a choice — a
// hint, or more time"), which is the point: the brain read "a hint" as
// licence to supply the answer. v2 has to say the quiet part explicitly.
//
// NOTE: check() takes a BOOLEAN, not a thunk. An arrow function here is
// always truthy and the assertion silently passes — which is exactly what
// happened on the first draft of this block.
const V2 = idleNudgeDirective({ v2: true });
check('v2: forbids answering the outstanding question',
  /do not answer/i.test(V2) && /still (?:outstanding|theirs|unanswered)/i.test(V2), V2);
check('v2: a hint must narrow, not resolve',
  /narrow/i.test(V2) && /not (?:give|supply|state) (?:it|the answer)/i.test(V2), V2);
check('v2: must not advance to a new question',
  /new question/i.test(V2) || /move on/i.test(V2), V2);
check('v2: keeps the ONE short sentence cap', /ONE short sentence/.test(V2), V2);
check('v2: keeps the bracketed synthetic shape',
  /^\[System note:/.test(V2) && V2.endsWith(']') && !V2.slice(1, -1).includes('['), V2);
check('v1 unchanged when flag off — byte-identical to the exported constant',
  idleNudgeDirective({ v2: false }) === IDLE_NUDGE_DIRECTIVE && idleNudgeDirective({}) === IDLE_NUDGE_DIRECTIVE);
check('v2 actually differs from v1', V2 !== IDLE_NUDGE_DIRECTIVE);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('test:idle-nudge PASS');
