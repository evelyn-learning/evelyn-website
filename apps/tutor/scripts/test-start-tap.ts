/**
 * Start-tap resolver (2026-08-17 Crimsora triage, portal-96a436f0): a
 * pre-start orb/mic tap could fall into handleMicClick's listen/stop
 * toggle branches and die silently — the student sat 4 minutes in a
 * session that never started, with zero telemetry. These tests pin the
 * rule: BEFORE the session starts, a tap always resolves to a start
 * action (start / queue-start / resume-continue), never to a toggle.
 */
import { resolveAgendaPickFailure, resolveStartTap, resolveStartWatchdog } from '../src/app/tutor/components/session/start-tap';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

console.log('pre-start taps always start');
// THE portal-96a436f0 bug: relay reached 'listening' before the student
// tapped (pre-start input-blur / unmute paths call startListening), and the
// tap became a silent stop-listening toggle. Pre-start + connected = start,
// no matter what state the relay is in.
check(
  'connected relay in listening state still starts (the 96a436f0 dead-session bug)',
  resolveStartTap({ hasStarted: false, hasResumeState: false, realtimeState: 'listening', isConnected: true }),
  'start',
);
check(
  'connected relay in connected state starts (normal path)',
  resolveStartTap({ hasStarted: false, hasResumeState: false, realtimeState: 'connected', isConnected: true }),
  'start',
);
check(
  'connected relay in speaking state still starts (defensive — should not occur pre-start)',
  resolveStartTap({ hasStarted: false, hasResumeState: false, realtimeState: 'speaking', isConnected: true }),
  'start',
);
check(
  'relay still connecting queues the tap (R40 behavior preserved)',
  resolveStartTap({ hasStarted: false, hasResumeState: false, realtimeState: 'connecting', isConnected: false }),
  'queue-start',
);
check(
  'relay disconnected queues the tap (R40 behavior preserved)',
  resolveStartTap({ hasStarted: false, hasResumeState: false, realtimeState: 'disconnected', isConnected: false }),
  'queue-start',
);

console.log('resume sessions');
check(
  'pre-start resume tap continues the rehydrated session',
  resolveStartTap({ hasStarted: false, hasResumeState: true, realtimeState: 'connecting', isConnected: false }),
  'resume-continue',
);
// Previously resume excluded listening/speaking states and the tap fell
// into the toggle chain — the same dead-tap class as 96a436f0.
check(
  'pre-start resume tap continues even when relay is already listening',
  resolveStartTap({ hasStarted: false, hasResumeState: true, realtimeState: 'listening', isConnected: true }),
  'resume-continue',
);
check(
  'post-start resume state is irrelevant — normal toggle rules apply',
  resolveStartTap({ hasStarted: true, hasResumeState: true, realtimeState: 'listening', isConnected: true }),
  'stop-listening',
);

console.log('in-session taps keep their toggle semantics');
check(
  'listening → stop-listening',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'listening', isConnected: true }),
  'stop-listening',
);
check(
  'speaking → interrupt',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'speaking', isConnected: true }),
  'interrupt',
);
check(
  'idle but connected → start (re-opens listening via the start branch)',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'connected', isConnected: true }),
  'start',
);
check(
  'disconnected mid-session → none (no silent fall-through; telemetry records it)',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'disconnected', isConnected: false }),
  'none',
);

console.log('start watchdog');
// The watchdog is the safety net for silent-death variants the resolver
// can't reach (agenda pick stuck mid-flight, handle not attached, unknown
// future paths): 30s after mount with no started session it restores the
// start affordance and always leaves a telemetry trace.
check(
  'session started → nothing to do',
  resolveStartWatchdog({ started: true, agendaEngaged: false }),
  'none',
);
check(
  'agenda pick stuck pre-start → restore the orb as the start button',
  resolveStartWatchdog({ started: false, agendaEngaged: true }),
  'restore-start',
);
check(
  'pre-start idle with orb available → log only (orb is already the affordance)',
  resolveStartWatchdog({ started: false, agendaEngaged: false }),
  'log-idle',
);

console.log('agenda pick failure fallbacks');
// A pre-start agenda-row tap IS the student's start gesture. When the pick
// itself can't complete, the session must still start — the failure modes:
// no mock-review context loaded yet (nothing dispatched → run the plain
// full start), or the beyond-focus refetch dies AFTER gestureSessionStart
// already marked the session started (brain never kicked → student stuck
// on the warmup spinner). Mid-session picks keep their log-and-ignore.
check(
  'no context + first gesture → plain full start',
  resolveAgendaPickFailure({ isFirstGesture: true, stage: 'no-context' }),
  'plain-start',
);
check(
  'no context mid-session → ignore',
  resolveAgendaPickFailure({ isFirstGesture: false, stage: 'no-context' }),
  'ignore',
);
check(
  'refetch unavailable + first gesture → kick the lesson anyway',
  resolveAgendaPickFailure({ isFirstGesture: true, stage: 'refetch-unavailable' }),
  'kickoff-lesson',
);
check(
  'refetch failed + first gesture → kick the lesson anyway',
  resolveAgendaPickFailure({ isFirstGesture: true, stage: 'refetch-failed' }),
  'kickoff-lesson',
);
check(
  'refetch failed mid-session → ignore (current behavior preserved)',
  resolveAgendaPickFailure({ isFirstGesture: false, stage: 'refetch-failed' }),
  'ignore',
);

// ── R49 dock-state-only (2026-08-20, user decision) ─────────────────────
// The dock mic is a five-way control whose label was orphaned in July 2026:
// TutorSession passes captionSlot, and the caption REPLACES the stateUI text
// block, so "Tutor speaking / Click to interrupt" has been unreachable in the
// shipped layout ever since. What remains is an unlabelled green pulsing
// circle that kills the tutor's audio. In embed-1787073582144 a first-time
// visitor tapped it twice during the opening turn and left at 37s.
// Decision: post-start the dock becomes a pure state indicator. End/Pause
// owns the session, Mute owns the mic, and speech owns barge-in. The opening
// turn becomes uninterruptible, which is deliberate — opening-turn voice
// barge-in is already suppressed (perception_cancel_suppressed_opening), and
// a noisy room cutting the intro is a worse outcome than not cutting it.
check(
  'dock-state-only: a tap during speaking no longer interrupts',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'speaking', isConnected: true, dockStateOnly: true }),
  'none',
);
check(
  'dock-state-only: a tap during listening no longer stops the mic (Mute owns that)',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'listening', isConnected: true, dockStateOnly: true }),
  'none',
);
check(
  'dock-state-only: the in-session default is inert too',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'connected', isConnected: true, dockStateOnly: true }),
  'none',
);
check(
  'dock-state-only: PRE-start is untouched — the tap must still start the session',
  resolveStartTap({ hasStarted: false, hasResumeState: false, realtimeState: 'connected', isConnected: true, dockStateOnly: true }),
  'start',
);
check(
  'dock-state-only: a queued pre-start tap is untouched',
  resolveStartTap({ hasStarted: false, hasResumeState: false, realtimeState: 'connecting', isConnected: false, dockStateOnly: true }),
  'queue-start',
);
check(
  'dock-state-only: resume is untouched — the first tap must still continue the lesson',
  resolveStartTap({ hasStarted: false, hasResumeState: true, realtimeState: 'connected', isConnected: true, dockStateOnly: true }),
  'resume-continue',
);
check(
  'flag off: speaking still interrupts (byte-identical pre-R49 behaviour)',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'speaking', isConnected: true }),
  'interrupt',
);
check(
  'flag off: listening still stops listening',
  resolveStartTap({ hasStarted: true, hasResumeState: false, realtimeState: 'listening', isConnected: true }),
  'stop-listening',
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll start-tap resolver checks passed.');
