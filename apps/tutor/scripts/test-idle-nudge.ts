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
  planIdleNudge,
  onsetResetsIdleNudge,
  IDLE_NUDGE_RECHECK_MS,
  IDLE_NUDGE_ONSET_GRACE_MS,
  IDLE_NUDGE_ONSET_MAX_DEFER_MS,
  IDLE_NUDGE_ONSET_TOTAL_DEFER_MS,
  IDLE_NUDGE_GENUINE_ABSENCE_MS,
  IDLE_NUDGE_MAX_ABSENCE_RESTARTS,
  IDLE_NUDGE_POSTPONED_LOG_EVERY_MS,
  shouldLogIdleNudgePostponed,
  type IdleNudgePostponeReason,
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

// ── Dispatch-anchored clock (2026-10-03) ────────────────────────────────
// Production: one nudge at 378 s, then 229 s of dead air and no second
// nudge, while the mic showed repeated sound bursts and no transcript —
// every onset reset the stretch and restarted the 75 s timer.
//
// simulate() is the VTR timer loop in miniature: arm at t=0 (tutor turn
// delivered), run planIdleNudge when the timer is due, follow rechecks.
function simulate(opts: {
  onsetEveryMs?: number;          // a sound burst this often, never a transcript
  onsetFromMs?: number;           // …starting here (default: one interval in)
  midUtteranceAlways?: boolean;   // perception stuck "mid-utterance"
  hiddenUntilMs?: number;
  hardBusyUntilMs?: number;
  hiddenWhen?: (t: number) => boolean;    // flapping visibility
  hardBusyWhen?: (t: number) => boolean;  // busy blips
  dispatchAtMs?: number;          // a real student turn is dispatched here
  dispatchAnchored?: boolean;
  horizonMs: number;
}) {
  const anchored = opts.dispatchAnchored !== false;
  const s = createIdleNudgeState();
  let armAt = 0;
  let dueAt = armAt + idleNudgeArmDelayMs(s);
  let nextCheck = dueAt;
  let lastOnset: number | null = null;
  let nextOnset = opts.onsetEveryMs == null ? Infinity : (opts.onsetFromMs ?? opts.onsetEveryMs);
  let lastReason: IdleNudgePostponeReason | null = null;
  let dispatched = false;
  const postponed: Array<{ t: number; reason: IdleNudgePostponeReason }> = [];
  const fired: number[] = [];
  let ceilingHit = false;
  for (let t = 0; t <= opts.horizonMs; t += 500) {
    if (opts.dispatchAtMs != null && !dispatched && t >= opts.dispatchAtMs) {
      // A dispatched turn: stretch resets, timer cleared; the tutor reply's
      // delivery (2 s later here) re-arms it.
      dispatched = true;
      recordStudentEngagement(s);
      armAt = t + 2_000; dueAt = armAt + idleNudgeArmDelayMs(s); nextCheck = dueAt; lastReason = null;
    }
    if (t >= nextOnset) {
      lastOnset = t; nextOnset += opts.onsetEveryMs!;
      if (onsetResetsIdleNudge(anchored)) {
        recordStudentEngagement(s);
        armAt = t; dueAt = armAt + idleNudgeArmDelayMs(s); nextCheck = dueAt;
      }
    }
    if (t < nextCheck) continue;
    const plan = planIdleNudge({
      nowMs: t, dueAtMs: dueAt, lastOnsetAtMs: anchored ? lastOnset : null,
      hardBusy: t < (opts.hardBusyUntilMs ?? 0) || !!opts.hardBusyWhen?.(t),
      midUtterance: !!opts.midUtteranceAlways,
      hidden: t < (opts.hiddenUntilMs ?? 0) || !!opts.hiddenWhen?.(t),
      wrapPhase: false, state: s, lastPostponeReason: lastReason,
    });
    if (plan.dueAtMs != null) dueAt = plan.dueAtMs;
    if (plan.decision === 'stand-down') { nextCheck = Infinity; continue; }
    if (plan.decision === 'recheck') {
      lastReason = plan.reason!;
      postponed.push({ t, reason: plan.reason! });
      nextCheck = t + plan.recheckMs!;
      continue;
    }
    if (plan.ceilingHit) ceilingHit = true;
    recordIdleNudgeFired(s);
    fired.push(t);
    // The nudge's own delivery re-arms at the repeat gap (1 s of speech).
    armAt = t + 1_000; dueAt = armAt + idleNudgeArmDelayMs(s); nextCheck = dueAt; lastReason = null;
  }
  return { fired, postponed, ceilingHit, state: s };
}

const CEILING_MS = IDLE_NUDGE_FIRST_MS + IDLE_NUDGE_ONSET_MAX_DEFER_MS;
{
  // Onsets every 10 s, no dispatch: the nudge still lands by the ceiling.
  const r = simulate({ onsetEveryMs: 10_000, horizonMs: 600_000 });
  check('onsets-every-10s: first nudge by the ceiling', r.fired.length >= 1 && r.fired[0] <= CEILING_MS, r.fired);
  check('onsets-every-10s: not before the first threshold', r.fired[0] >= IDLE_NUDGE_FIRST_MS, r.fired);
  check('onsets-every-10s: second nudge also arrives (stretch not wiped by onsets)',
    r.fired.length === IDLE_NUDGE_MAX_PER_STRETCH
      && r.fired[1] <= r.fired[0] + 1_000 + IDLE_NUDGE_REPEAT_MS + IDLE_NUDGE_ONSET_MAX_DEFER_MS, r.fired);
  check('onsets-every-10s: stretch cap still holds (2, then quiet)', r.state.stretchCount === IDLE_NUDGE_MAX_PER_STRETCH, r.state);
  check('onsets-every-10s: every onset postponement is logged with its reason',
    r.postponed.length > 0 && r.postponed.every((p) => p.reason === 'onset-grace'), r.postponed);
  // The pre-fix rule on the same input: never fires — the production stall.
  const legacy = simulate({ onsetEveryMs: 10_000, horizonMs: 600_000, dispatchAnchored: false });
  check('legacy rule reproduces the stall (onsets hold it off forever)', legacy.fired.length === 0, legacy.fired);
}
{
  // Perception stuck mid-utterance with no transcript is onset-class too.
  const r = simulate({ midUtteranceAlways: true, horizonMs: 300_000 });
  check('stuck-mid-utterance: fires at the ceiling', r.fired[0] === CEILING_MS && r.ceilingHit, r.fired);
}
{
  // No onsets at all: unchanged — fires exactly at the first threshold.
  const r = simulate({ horizonMs: 100_000 });
  check('quiet: fires at the first threshold', r.fired[0] === IDLE_NUDGE_FIRST_MS && r.postponed.length === 0, r);
}
{
  // A dispatched turn resets: stretch back to 0 and the clock restarts from
  // the reply's delivery, at the FIRST threshold again.
  const r = simulate({ dispatchAtMs: 60_000, horizonMs: 62_000 + IDLE_NUDGE_FIRST_MS });
  check('dispatch-resets: nothing before delivery + first threshold',
    r.fired.length === 1 && r.fired[0] === 62_000 + IDLE_NUDGE_FIRST_MS, r.fired);
  const r2 = simulate({ dispatchAtMs: 300_000, horizonMs: 302_000 + IDLE_NUDGE_FIRST_MS });
  check('dispatch-resets: stretch count cleared after two nudges',
    r2.fired.length === 3 && r2.state.stretchCount === 1 && r2.state.sessionCount === 3, { fired: r2.fired, state: r2.state });
}
{
  // Hidden tab defers (not bounded by the ceiling) and each recheck is logged.
  const r = simulate({ hiddenUntilMs: 200_000, horizonMs: 260_000 });
  const hiddenLogs = r.postponed.filter((p) => p.reason === 'hidden');
  check('hidden: no nudge while hidden', r.fired.every((t) => t >= 200_000), r.fired);
  check('hidden: fires once visible', r.fired.length >= 1 && r.fired[0] < 200_000 + IDLE_NUDGE_RECHECK_MS + 500, r.fired);
  check('hidden: every recheck logged', hiddenLogs.length === Math.ceil((200_000 - IDLE_NUDGE_FIRST_MS) / IDLE_NUDGE_RECHECK_MS), hiddenLogs.length);
}
{
  // Hard busy defers with reason 'busy'; hidden outranks busy outranks onset.
  const s = createIdleNudgeState();
  const base = { nowMs: 80_000, dueAtMs: 75_000, lastOnsetAtMs: 79_000, midUtterance: false, wrapPhase: false, state: s };
  const busy = planIdleNudge({ ...base, hardBusy: true, hidden: false });
  check('busy: recheck reason=busy at the recheck interval', busy.decision === 'recheck' && busy.reason === 'busy' && busy.recheckMs === IDLE_NUDGE_RECHECK_MS, busy);
  const hid = planIdleNudge({ ...base, hardBusy: true, hidden: true });
  check('hidden outranks busy', hid.reason === 'hidden', hid);
  const grace = planIdleNudge({ ...base, hardBusy: false, hidden: false });
  check('onset 1 s ago: grace recheck for the remaining 7 s',
    grace.decision === 'recheck' && grace.reason === 'onset-grace' && grace.recheckMs === IDLE_NUDGE_ONSET_GRACE_MS - 1_000, grace);
  const stale = planIdleNudge({ ...base, lastOnsetAtMs: 80_000 - IDLE_NUDGE_ONSET_GRACE_MS, hardBusy: false, hidden: false });
  check('onset older than the grace: fire', stale.decision === 'fire' && !stale.ceilingHit, stale);
  const nearCeiling = planIdleNudge({ ...base, nowMs: 75_000 + IDLE_NUDGE_ONSET_MAX_DEFER_MS - 2_000, lastOnsetAtMs: 75_000 + IDLE_NUDGE_ONSET_MAX_DEFER_MS - 2_500, hardBusy: false, hidden: false });
  check('grace is clipped to the ceiling', nearCeiling.recheckMs === 2_000, nearCeiling);
  // Caps and stand-downs are untouched by the new clock.
  const capped = createIdleNudgeState();
  for (let i = 0; i < IDLE_NUDGE_MAX_PER_STRETCH; i++) recordIdleNudgeFired(capped);
  check('stretch cap stands down under the new clock', planIdleNudge({ ...base, state: capped, hardBusy: false, hidden: false }).decision === 'stand-down');
  check('wrap phase stands down', planIdleNudge({ ...base, wrapPhase: true, hardBusy: false, hidden: false }).decision === 'stand-down');
  check('hold stands down', planIdleNudge({ ...base, hold: true, hardBusy: false, hidden: false }).decision === 'stand-down');
  check('onsetResetsIdleNudge: only with the flag off', onsetResetsIdleNudge(false) === true && onsetResetsIdleNudge(true) === false);
}

// ── 2026-10-04: a hidden/busy postponement must not use up the ceiling ──
// The ceiling was anchored to the FIRST due time. Tab hidden for 10 minutes;
// the student returns and starts speaking; the next recheck saw
// now ≥ dueAt + 30 s and fired the nudge over their first words.
{
  const s = createIdleNudgeState();
  const due = IDLE_NUDGE_FIRST_MS;
  const back = due + 600_000;
  const speaking = { nowMs: back, dueAtMs: due, lastOnsetAtMs: back - 1_000, hardBusy: false, midUtterance: true, hidden: false, wrapPhase: false, state: s };
  const afterHidden = planIdleNudge({ ...speaking, lastPostponeReason: 'hidden' });
  check('back from a hidden tab, speaking: onset grace applies again (no nudge over their words)',
    afterHidden.decision === 'recheck' && afterHidden.reason === 'onset-grace' && !afterHidden.ceilingHit, afterHidden);
  check('back from a hidden tab: the ceiling clock restarts from now', afterHidden.dueAtMs === back, afterHidden);
  const afterBusy = planIdleNudge({ ...speaking, lastPostponeReason: 'busy' });
  check('composer blurred after a long busy postponement: same restart',
    afterBusy.decision === 'recheck' && afterBusy.reason === 'onset-grace' && afterBusy.dueAtMs === back, afterBusy);
  // The restarted ceiling still bounds onset-class deferral.
  const stuck = planIdleNudge({ ...speaking, nowMs: back + IDLE_NUDGE_ONSET_MAX_DEFER_MS, dueAtMs: back, lastOnsetAtMs: back + IDLE_NUDGE_ONSET_MAX_DEFER_MS - 500, lastPostponeReason: 'onset-grace' });
  check('restarted ceiling still fires 30 s later', stuck.decision === 'fire' && stuck.ceilingHit === true, stuck);
  // Returning to a quiet room: fire at once, as before.
  const quiet = planIdleNudge({ ...speaking, lastOnsetAtMs: null, midUtterance: false, lastPostponeReason: 'hidden' });
  check('back from a hidden tab, quiet: fires', quiet.decision === 'fire' && !quiet.ceilingHit, quiet);
  // Still hidden / still busy: nothing restarts yet.
  const stillHidden = planIdleNudge({ ...speaking, hidden: true, lastPostponeReason: 'hidden' });
  check('still hidden: recheck, due time untouched', stillHidden.decision === 'recheck' && stillHidden.reason === 'hidden' && stillHidden.dueAtMs === undefined, stillHidden);
  const hiddenThenBusy = planIdleNudge({ ...speaking, hardBusy: true, lastPostponeReason: 'hidden' });
  check('hidden then busy: still postponed, due time untouched', hiddenThenBusy.reason === 'busy' && hiddenThenBusy.dueAtMs === undefined, hiddenThenBusy);
  // An onset-grace postponement never restarts the ceiling (that is the 229 s stall).
  const onsetOnly = planIdleNudge({ ...speaking, lastPostponeReason: 'onset-grace' });
  check('onset-class postponement does not restart the ceiling', onsetOnly.decision === 'fire' && onsetOnly.ceilingHit === true && onsetOnly.dueAtMs === undefined, onsetOnly);
  const noHistory = planIdleNudge(speaking);
  check('no previous postponement: ceiling anchored to the due time, as before', noHistory.decision === 'fire' && noHistory.ceilingHit === true, noHistory);
}
{
  // End to end: hidden 10 min, the student talks from the moment they return
  // and their turn is dispatched 6 s later — no nudge lands on top of it.
  const r = simulate({ hiddenUntilMs: 675_000, onsetEveryMs: 2_000, onsetFromMs: 675_000, dispatchAtMs: 681_000, horizonMs: 700_000 });
  check('hidden 10 min → student speaks on return: no nudge over their words', r.fired.length === 0, r.fired);
  // …and noise that never becomes a turn is still bounded after the return.
  const noise = simulate({ hiddenUntilMs: 675_000, onsetEveryMs: 2_000, onsetFromMs: 675_000, horizonMs: 760_000 });
  check('hidden 10 min → noise only: nudge within the restarted ceiling',
    noise.fired.length >= 1 && noise.fired[0] > 675_000 && noise.fired[0] <= 675_000 + IDLE_NUDGE_RECHECK_MS + IDLE_NUDGE_ONSET_MAX_DEFER_MS, noise.fired);
}

// ── 2026-10-04: the ceiling restart is bounded ────────────────────────────
// Any check landing on busy/hidden followed by one landing on an onset
// restarted the 30 s ceiling — so a busy blip 8 s of every 16 s, or a tab
// flapping hidden 10 s of every 40 s, held the nudge off for as long as the
// noise lasted (30 minutes in the reproduction).
{
  const HALF_HOUR = 1_800_000;
  const from = IDLE_NUDGE_FIRST_MS;
  const busyBlips = simulate({ onsetEveryMs: 2_000, hardBusyWhen: (t) => t >= from && (t - from) % 16_000 < 8_000, horizonMs: HALF_HOUR });
  check('busy blip 8 s of every 16 s + noise: the nudge still fires', busyBlips.fired.length >= 1, busyBlips.fired);
  // A 16 s blip sampled at the 15 s recheck looks like one unbroken busy run
  // (each check lands 1 s earlier in the cycle), i.e. like a genuine absence —
  // which is why those restarts are limited per stretch as well. Bound here:
  // the limited restarts, each after ~7 busy checks.
  check('busy blip + noise: first nudge within 7 min of coming due (was: never)', busyBlips.fired[0] <= from + 420_000, busyBlips.fired);
  check('busy blip + noise: both nudges of the stretch arrive', busyBlips.fired.length === IDLE_NUDGE_MAX_PER_STRETCH, busyBlips.fired);
  const hiddenFlap = simulate({ onsetEveryMs: 2_000, hiddenWhen: (t) => t >= from && (t - from) % 40_000 < 10_000, horizonMs: HALF_HOUR });
  check('hidden flap 10 s of every 40 s + noise: the nudge still fires', hiddenFlap.fired.length >= 1, hiddenFlap.fired);
  check('hidden flap + noise: first nudge within 90 s of coming due', hiddenFlap.fired[0] <= from + 90_000, hiddenFlap.fired);
  check('hidden flap + noise: both nudges of the stretch arrive', hiddenFlap.fired.length === IDLE_NUDGE_MAX_PER_STRETCH, hiddenFlap.fired);
  const stuckFlap = simulate({ midUtteranceAlways: true, hiddenWhen: (t) => t >= from && (t - from) % 40_000 < 10_000, horizonMs: HALF_HOUR });
  check('hidden flap + stuck mid-utterance: fires too', stuckFlap.fired.length === IDLE_NUDGE_MAX_PER_STRETCH && stuckFlap.fired[0] <= from + 90_000, stuckFlap.fired);
}
{
  // One arm, check by check. `step` plays the caller: it stores the restarted
  // due time and the last postponement reason.
  const s = createIdleNudgeState();
  let due = IDLE_NUDGE_FIRST_MS; let last: IdleNudgePostponeReason | null = null;
  const step = (nowMs: number, o: { hidden?: boolean; hardBusy?: boolean; noise?: boolean }) => {
    const plan = planIdleNudge({
      nowMs, dueAtMs: due, lastOnsetAtMs: o.noise ? nowMs - 500 : null, hardBusy: !!o.hardBusy, midUtterance: !!o.noise,
      hidden: !!o.hidden, wrapPhase: false, state: s, lastPostponeReason: last,
    });
    if (plan.dueAtMs != null) due = plan.dueAtMs;
    if (plan.decision === 'recheck') last = plan.reason!;
    return plan;
  };
  let t = due;
  check('arm: busy blip', step(t, { hardBusy: true }).reason === 'busy');
  t += 15_000;
  const first = step(t, { noise: true });
  check('first short blip ends on an onset: the ceiling restarts (once)', first.reason === 'onset-grace' && first.dueAtMs === t, first);
  t += 8_000;
  check('second blip', step(t, { hardBusy: true }).reason === 'busy');
  t += 15_000;
  const second = step(t, { noise: true });
  check('second short blip: NO second restart', second.decision === 'recheck' && second.reason === 'onset-grace' && second.dueAtMs === undefined, second);
  // A genuine absence (hidden across ≥ 60 s of consecutive checks) restarts
  // the ceiling again, however many restarts came before.
  t += 8_000;
  for (let k = 0; k * IDLE_NUDGE_RECHECK_MS <= IDLE_NUDGE_GENUINE_ABSENCE_MS; k++, t += IDLE_NUDGE_RECHECK_MS) {
    check(`absence check ${k}: hidden`, step(t, { hidden: true }).reason === 'hidden');
  }
  const afterAbsence = step(t, { noise: true });
  check('a 60 s absence restarts the ceiling even after the one free restart',
    afterAbsence.decision === 'recheck' && afterAbsence.reason === 'onset-grace' && afterAbsence.dueAtMs === t, afterAbsence);
  // …but 59 s of hidden does not.
  const s2 = createIdleNudgeState();
  const short = (nowMs: number, lastPostponeReason: IdleNudgePostponeReason | null, hidden: boolean, dueAtMs: number) => planIdleNudge({
    nowMs, dueAtMs, lastOnsetAtMs: nowMs - 500, hardBusy: false, midUtterance: true, hidden, wrapPhase: false, state: s2, lastPostponeReason,
  });
  const d0 = IDLE_NUDGE_FIRST_MS;
  short(d0, null, true, d0);
  const r1 = short(d0 + 15_000, 'hidden', false, d0);          // free restart → due = d0 + 15 s
  check('setup: free restart used', r1.dueAtMs === d0 + 15_000, r1);
  short(d0 + 23_000, 'onset-grace', true, d0 + 15_000);
  short(d0 + 38_000, 'hidden', true, d0 + 15_000);
  short(d0 + 53_000, 'hidden', true, d0 + 15_000);
  const r2 = short(d0 + 23_000 + IDLE_NUDGE_GENUINE_ABSENCE_MS - 1_000, 'hidden', false, d0 + 15_000);
  check('59 s hidden is not a genuine absence: no restart, ceiling fires', r2.decision === 'fire' && r2.ceilingHit === true && r2.dueAtMs === undefined, r2);
}
{
  // Absence restarts are limited per stretch: the limit-plus-first long
  // "absence" with no dispatched turn in between no longer restarts.
  const s = createIdleNudgeState();
  let t = 0;
  const absenceThenNoise = () => {
    const due = t; let last: IdleNudgePostponeReason | null = null;
    for (let k = 0; k * IDLE_NUDGE_RECHECK_MS <= IDLE_NUDGE_GENUINE_ABSENCE_MS; k++, t += IDLE_NUDGE_RECHECK_MS) {
      planIdleNudge({ nowMs: t, dueAtMs: due, lastOnsetAtMs: null, hardBusy: false, midUtterance: false, hidden: true, wrapPhase: false, state: s, lastPostponeReason: last });
      last = 'hidden';
    }
    // back, 31 s past the original due time, with sound: fires unless restarted
    const plan = planIdleNudge({ nowMs: t, dueAtMs: due, lastOnsetAtMs: t - 500, hardBusy: false, midUtterance: true, hidden: false, wrapPhase: false, state: s, lastPostponeReason: last });
    t += 1_000_000; // the next call is a new arm, far away
    return plan;
  };
  for (let k = 0; k < IDLE_NUDGE_MAX_ABSENCE_RESTARTS; k++) {
    const p = absenceThenNoise();
    check(`absence ${k + 1}: restart granted`, p.decision === 'recheck' && p.dueAtMs !== undefined, p);
  }
  check('absence restarts are counted on the stretch', s.absenceRestarts === IDLE_NUDGE_MAX_ABSENCE_RESTARTS, s);
  // One more: only the per-arm short restart is left (a new arm has one).
  const extra = absenceThenNoise();
  check('past the limit a long absence is treated like a short one (the arm\'s single restart)', extra.dueAtMs !== undefined && s.absenceRestarts === IDLE_NUDGE_MAX_ABSENCE_RESTARTS && s.arm?.shortRestarts === 1, { extra, s });
  recordStudentEngagement(s);
  check('a dispatched student turn clears the count', s.absenceRestarts === 0 && s.onsetDeferredMs === 0, s);
}
{
  // Total onset-class deferral since the last dispatched student turn is
  // capped — across arms, and whatever restarts were granted.
  const s = createIdleNudgeState();
  const noisy = (nowMs: number, dueAtMs: number, last: IdleNudgePostponeReason | null) => planIdleNudge({
    nowMs, dueAtMs, lastOnsetAtMs: nowMs - 500, hardBusy: false, midUtterance: true, hidden: false, wrapPhase: false, state: s, lastPostponeReason: last,
  });
  let spent = 0;
  for (let arm = 0; spent < IDLE_NUDGE_ONSET_TOTAL_DEFER_MS; arm++) {
    const due = 1_000_000 * (arm + 1);
    check(`arm ${arm}: noise defers`, noisy(due, due, null).reason === 'onset-grace');
    const slice = Math.min(20_000, IDLE_NUDGE_ONSET_TOTAL_DEFER_MS - spent);
    spent += slice;
    const next = noisy(due + slice, due, 'onset-grace');
    if (spent < IDLE_NUDGE_ONSET_TOTAL_DEFER_MS) check(`arm ${arm}: still inside the total allowance`, next.decision === 'recheck', next);
    else check('total onset deferral used up: fires although the ceiling of this arm is not reached', next.decision === 'fire' && next.ceilingHit === true, next);
  }
  const fresh = noisy(9_000_000, 9_000_000, null);
  check('allowance used up: a new arm gets no onset grace', fresh.decision === 'fire' && fresh.ceilingHit === true, fresh);
  recordStudentEngagement(s);
  check('a dispatched student turn restores the allowance', noisy(9_500_000, 9_500_000, null).reason === 'onset-grace');
  check('total allowance covers at least two ceilings', IDLE_NUDGE_ONSET_TOTAL_DEFER_MS >= 2 * IDLE_NUDGE_ONSET_MAX_DEFER_MS);
}

// ── idle_nudge_postponed throttle: these events are persisted ────────────
{
  check('throttle interval is one minute', IDLE_NUDGE_POSTPONED_LOG_EVERY_MS === 60_000);
  check('first postponement is logged', shouldLogIdleNudgePostponed({ reason: 'hidden', lastReason: null, lastLoggedAtMs: 0, nowMs: 1_000 }));
  check('same reason 15 s later: not logged', !shouldLogIdleNudgePostponed({ reason: 'hidden', lastReason: 'hidden', lastLoggedAtMs: 1_000, nowMs: 16_000 }));
  check('same reason 59 s later: not logged', !shouldLogIdleNudgePostponed({ reason: 'hidden', lastReason: 'hidden', lastLoggedAtMs: 1_000, nowMs: 60_000 }));
  check('same reason a minute later: logged', shouldLogIdleNudgePostponed({ reason: 'hidden', lastReason: 'hidden', lastLoggedAtMs: 1_000, nowMs: 61_000 }));
  check('reason changes: logged at once', shouldLogIdleNudgePostponed({ reason: 'busy', lastReason: 'hidden', lastLoggedAtMs: 1_000, nowMs: 2_000 }));
  // One hour hidden at the 15 s recheck: ~60 rows, not ~240.
  let last: IdleNudgePostponeReason | null = null; let at = 0; let rows = 0;
  for (let t = 0; t < 3_600_000; t += IDLE_NUDGE_RECHECK_MS) {
    if (shouldLogIdleNudgePostponed({ reason: 'hidden', lastReason: last, lastLoggedAtMs: at, nowMs: t })) { rows++; last = 'hidden'; at = t; }
  }
  check('an hour in a hidden tab logs 60 rows', rows === 60, rows);
}

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('test:idle-nudge PASS');
