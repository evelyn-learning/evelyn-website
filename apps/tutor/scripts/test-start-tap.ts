/**
 * Start-tap resolver (2026-08-17 Crimsora triage, portal-96a436f0): a
 * pre-start orb/mic tap could fall into handleMicClick's listen/stop
 * toggle branches and die silently — the student sat 4 minutes in a
 * session that never started, with zero telemetry. These tests pin the
 * rule: BEFORE the session starts, a tap always resolves to a start
 * action (start / queue-start / resume-continue), never to a toggle.
 */
import { resolveStartTap, resolveStartWatchdog } from '../src/app/tutor/components/session/start-tap';

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

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll start-tap resolver checks passed.');
