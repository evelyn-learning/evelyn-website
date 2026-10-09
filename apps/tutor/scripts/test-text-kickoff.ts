/** Round 4 (E5): text-mode kickoff for any goal on the host's tutor_opens claim;
 *  round-2 homework kickoff unchanged; voice never. Usage: npx tsx scripts/test-text-kickoff.ts */
import { readFileSync } from 'fs';
import { join } from 'path';
import { textKickoffReady, textKickoffMessage, isKickoffMessage, decideTypedDuringTurn, decideTypedBeforeHomeworkReady, createTypedHold, TYPED_HOMEWORK_WAIT_MS } from '../src/app/tutor/components/session/text-kickoff';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };
const base = { sessionMode: 'text', sessionGoal: 'concept-review', tutorOpens: false, homeworkReady: false, hasPlanId: true, planLoaded: true };

assert(!textKickoffReady({ ...base, sessionMode: 'voice', tutorOpens: true }), 'voice never kicks off');
assert(textKickoffReady({ ...base, sessionGoal: 'homework-help', homeworkReady: true }), 'round 2: homework problems kick off without the claim');
assert(!textKickoffReady(base), 'no claim: a concept-review text session waits (other hosts unchanged)');
assert(textKickoffReady({ ...base, tutorOpens: true }), 'claim + plan loaded → kick off');
assert(!textKickoffReady({ ...base, tutorOpens: true, planLoaded: false }), 'claim + plan still loading → wait');
assert(textKickoffReady({ ...base, tutorOpens: true, hasPlanId: false, planLoaded: false }), 'claim + planless → kick off');
assert(textKickoffReady({ ...base, sessionGoal: 'homework-help', tutorOpens: true }), 'homework goal fell back to a normal plan: claim kicks off');
assert(textKickoffMessage(true) === '[start lesson]' && textKickoffMessage(false) === '[start session]', 'message mirrors the mic-tap start');

const root = join(__dirname, '..', 'src/app');
const vtr = readFileSync(join(root, 'tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
const ts = readFileSync(join(root, 'tutor/components/session/TutorSession.tsx'), 'utf8');
const embed = readFileSync(join(root, 'tutor-portal/embed/page.tsx'), 'utf8');
const docs = readFileSync(join(root, 'tutor-portal/data/config-params.ts'), 'utf8');
assert(vtr.includes('textKickoffReady(') && !vtr.includes("sessionGoal !== 'homework-help' || !homeworkReady) return;"), 'wiring: VTR kickoff uses textKickoffReady');
assert(vtr.includes('textKickoffMessage('), 'wiring: kickoff message chosen by plan presence');
assert(ts.includes('tutorOpens={tutorOpens}'), 'wiring: TutorSession passes tutorOpens');
assert(embed.includes('tutor_opens?: boolean') && embed.includes('tutorOpens={tutorOpens}'), 'wiring: embed claim → prop');
assert(docs.includes("name: 'tutor_opens'"), 'docs: claim documented');

// 2026-10-08 (portal-09624999): the student typed at 8.0 s while the automatic
// opening turn (dispatched at 0.4 s, first sentence at 10.0 s) was in flight.
// The composer cleared the busy flag without aborting it, so the typed turn
// ran beside it (0.4–11.6 s and 8.1–19.7 s): two tutor messages back to back,
// the first one answering nothing the student had written.
const typedAt = { sessionMode: 'text', brainBusy: true, inFlightTranscript: '[start lesson]' as string | null, inFlightShown: false };
assert(decideTypedDuringTurn(typedAt) === 'supersede_opening', 'recorded: typed while the opening turn has shown nothing → the opening turn is aborted');
assert(decideTypedDuringTurn({ ...typedAt, inFlightTranscript: '[start session]' }) === 'supersede_opening', 'the planless opener is an opening turn too');
assert(decideTypedDuringTurn({ ...typedAt, inFlightShown: true }) === 'queue_after_opening', 'the opening turn has already shown a sentence → the typed message runs right after it');
assert(decideTypedDuringTurn({ ...typedAt, brainBusy: false }) === 'dispatch', 'nothing in flight → dispatched as before');
assert(decideTypedDuringTurn({ ...typedAt, brainBusy: false, inFlightShown: true }) === 'dispatch', 'nothing in flight → dispatched as before (whatever the last turn showed)');
assert(decideTypedDuringTurn({ ...typedAt, inFlightTranscript: 'x = 4' }) === 'force_clear', 'an ordinary student turn in flight → unchanged (busy flag force-cleared)');
assert(decideTypedDuringTurn({ ...typedAt, inFlightTranscript: '[Skip-button-clicked: advance]' }) === 'force_clear', 'another runtime dispatch in flight → unchanged');
assert(decideTypedDuringTurn({ ...typedAt, inFlightTranscript: null }) === 'force_clear', 'busy with no turn on record (a stale flag) → unchanged');
assert(decideTypedDuringTurn({ ...typedAt, sessionMode: 'voice' }) === 'force_clear', 'voice → unchanged');
assert(isKickoffMessage(' [start lesson] ') && isKickoffMessage('[start session]') && !isKickoffMessage('start lesson') && !isKickoffMessage(null) && !isKickoffMessage('[Session-resumed]'), 'only the two session-start kickoffs are opening turns');

const composer = vtr.slice(vtr.indexOf('const typedDuringTurn = decideTypedDuringTurn({'));
assert(vtr.split('decideTypedDuringTurn({').length - 1 === 1 && composer.length > 0, 'wiring: the composer decides with decideTypedDuringTurn');
assert(/typedDuringTurn === 'supersede_opening'[\s\S]{0,900}openerSupersededByStudentRef\.current = true;[\s\S]{0,400}inFlightBrainAbortRef\.current\?\.abort\(\)/.test(composer), 'wiring: superseding flags the opening turn, then aborts it');
assert(/typedDuringTurn === 'force_clear'\) \{[\s\S]{0,300}setBrainBusy\(false\);\s*queuedTranscriptsRef\.current = \[\];/.test(composer), 'wiring: the busy flag is force-cleared only on force_clear');
assert(vtr.includes('const isAbort =\n        supersededByStudent || ('), 'wiring: an opening turn aborted for the student is a silent abort — no opener retry, no stall retry, no apology');
assert(vtr.includes('openingTurnPendingRef.current && !supersededByStudent'), 'wiring: no fallback opener card for it, and the student turn stays the opening turn');
assert(vtr.split('markInFlightTurnShown()').length - 1 === 2, 'wiring: both sentence-dispatch sites mark the turn in flight as shown');
assert(vtr.includes('inFlightTurnRef.current = { transcript, shown: false };') && vtr.includes('inFlightTurnRef.current = { transcript: combined, shown: false };') && vtr.includes('inFlightTurnRef.current = null;'), 'wiring: the turn in flight is recorded per dispatch (direct and queue-drained) and cleared at the end');

// 2026-10-09 (local end-to-end run, scenario C): the student typed at 6.75 s;
// the homework plan (requested at ~6.2 s) loaded at 7.5 s. The turn was
// dispatched at once — no plan, no homework block — so the client latched the
// tool scope to "full" for the session: turn 1 ran with 86 tools (hw=0),
// turn 2 with 87 (set_current_problem joined), and the ~125K-token cached
// prefix was written twice ($1.04 for two turns).
const hold = { enabled: true, sessionMode: 'text', sessionGoal: 'homework-help', hasPlanId: true, planLoadSettled: false, homeworkReady: false, waitedMs: 0 };
const dec = (o: Partial<typeof hold> & { timeoutMs?: number }) => decideTypedBeforeHomeworkReady({ ...hold, ...o });
assert(dec({}).action === 'wait' && dec({}).reason === 'plan-loading', 'recorded: typed while the homework plan is still being fetched → held');
assert(dec({ waitedMs: 550 }).action === 'wait', 'still loading inside the bound → still held');
assert(dec({ homeworkReady: true, waitedMs: 750 }).action === 'dispatch' && dec({ homeworkReady: true }).reason === 'homework-ready', 'the problems arrived → dispatched with them');
assert(dec({ waitedMs: TYPED_HOMEWORK_WAIT_MS }).action === 'timeout' && dec({ waitedMs: TYPED_HOMEWORK_WAIT_MS + 1 }).reason === 'timeout', 'the bound is reached → dispatched as before, flagged as a timeout');
assert(dec({ waitedMs: 300, timeoutMs: 250 }).action === 'timeout' && dec({ waitedMs: 200, timeoutMs: 250 }).action === 'wait', 'the bound is a parameter');
assert(TYPED_HOMEWORK_WAIT_MS > 0 && TYPED_HOMEWORK_WAIT_MS <= 5000, 'the bound is short');
assert(dec({ planLoadSettled: true }).action === 'dispatch' && dec({ planLoadSettled: true }).reason === 'plan-settled-without-homework', 'the plan request finished with no homework problems (failed / an ordinary plan) → nothing to wait for');
assert(dec({ hasPlanId: false }).action === 'dispatch' && dec({ hasPlanId: false }).reason === 'no-plan-requested', 'no plan was requested → nothing is being fetched → dispatched as before');
assert(dec({ sessionGoal: 'concept-review' }).action === 'dispatch' && dec({ sessionGoal: 'concept-review' }).reason === 'not-homework', 'another goal → unchanged');
assert(dec({ sessionMode: 'voice' }).action === 'dispatch' && dec({ sessionMode: 'voice' }).reason === 'not-text', 'voice → unchanged');
assert(dec({ enabled: false }).action === 'dispatch' && dec({ enabled: false }).reason === 'flag-off', 'switch off → dispatched at once, as before');
assert(dec({ homeworkReady: true, waitedMs: TYPED_HOMEWORK_WAIT_MS * 2 }).action === 'dispatch', 'ready wins over the clock');

// The hold itself: one waiter, messages released in the order typed.
{
  let now = 0; let ready = false; const sent: string[] = []; const events: string[] = []; const busy: boolean[] = [];
  let tick: (() => void) | null = null;
  const h = createTypedHold({
    decide: (waitedMs) => decideTypedBeforeHomeworkReady({ ...hold, homeworkReady: ready, waitedMs }),
    now: () => now,
    every: (fn) => { tick = fn; return () => { tick = null; }; },
    onHeld: (held) => busy.push(held),
    onEvent: (type, msg) => events.push(`${type}:${msg}`),
  });
  h.submit(() => sent.push('first'));
  assert(sent.length === 0 && h.held() === 1 && busy.join() === 'true' && events[0].startsWith('typed_held_for_homework:'), 'hold: the first message is held, "thinking" shown, the hold recorded');
  h.submit(() => sent.push('second'));
  assert(sent.length === 0 && h.held() === 2 && events.length === 1, 'hold: a second message typed during the wait joins the same hold');
  now = 400; tick!();
  assert(sent.length === 0 && tick !== null, 'hold: still loading → still held');
  now = 760; ready = true; tick!();
  assert(sent.join() === 'first,second' && h.held() === 0 && tick === null && busy.join() === 'true,false', 'hold: the plan arrived → both sent in the order typed, the waiter stopped');
  assert(events[1] === 'typed_homework_released:homework-ready waited=760ms held=2', 'hold: the release is recorded with how long it waited');
  h.submit(() => sent.push('third'));
  assert(sent.join() === 'first,second,third' && events.length === 2, 'hold: once ready, a message goes straight through');
}
{
  let now = 0; const sent: string[] = []; const events: string[] = [];
  let tick: (() => void) | null = null;
  const h = createTypedHold({
    decide: (waitedMs) => decideTypedBeforeHomeworkReady({ ...hold, waitedMs }),
    now: () => now, every: (fn) => { tick = fn; return () => { tick = null; }; }, onHeld: () => {}, onEvent: (type, msg) => events.push(`${type}:${msg}`),
  });
  h.submit(() => sent.push('only'));
  now = TYPED_HOMEWORK_WAIT_MS; tick!();
  assert(sent.join() === 'only' && events[1] === `typed_homework_wait_timeout:waited=${TYPED_HOMEWORK_WAIT_MS}ms held=1 — dispatched without the homework context`, 'hold: the bound is reached → sent as before, with a debug event');
  h.submit(() => sent.push('late')); h.cancel();
  assert(h.held() === 0 && tick === null && sent.join() === 'only', 'hold: cancel (unmount) drops the waiter and sends nothing');
}
{
  const sent: string[] = [];
  const h = createTypedHold({ decide: () => { throw new Error('boom'); }, now: () => 0, every: () => () => {}, onHeld: () => {}, onEvent: () => {} });
  h.submit(() => sent.push('x'));
  assert(sent.join() === 'x', 'hold: a decision that throws never swallows the message');
}

assert(vtr.split('typedHoldRef.current.submit(').length - 1 === 2, 'wiring: the composer and the handle\'s sendTextMessage both go through the hold');
assert(/typedHoldRef\.current\.submit\(\(\) => realtime\.sendTextMessage\(text, \{ typed: true \}\)\)/.test(composer), 'wiring: the composer holds only the dispatch — the supersede/queue decision and the start stamps run at submit time');
assert(vtr.indexOf('const typedDuringTurn = decideTypedDuringTurn({') < vtr.indexOf('typedHoldRef.current.submit(() => realtime.sendTextMessage(text, { typed: true }))'), 'wiring: decideTypedDuringTurn runs before the hold');
assert(vtr.includes('planLoadSettledIdRef.current = lessonPlanId;') && vtr.includes('homeworkReady: homeworkProblemsRef.current !== null,'), 'wiring: the hold reads the plan request and the loaded problems');
assert(/const composing = isWarmingUp \|\| realtime\.state === 'processing' \|\| typedHeldForHomework;/.test(vtr), 'wiring: a held message shows the "thinking" state');
assert(readFileSync(join(root, '../lib/tutor/orchestrator/turn-round-flags.ts'), 'utf8').includes("process.env.NEXT_PUBLIC_TUTOR_TYPED_WAITS_FOR_HOMEWORK !== 'off'"), 'kill switch defaults ON');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
