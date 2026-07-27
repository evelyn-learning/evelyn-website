/**
 * Pre-start affordance rules (2026-07-26 trial feedback): the pre-start
 * screen showed TWO mic icons (the dock's start mic + the dock's mute
 * toggle), and the only start affordance sat at the very bottom edge while
 * the instruction sat in the center. These pure helpers encode who is
 * visible when, so SessionStage/VoiceTutorRealtime just render the answer.
 */
import {
  orbIsStartButton,
  preStartDockCaption,
  showsDockMuteButton,
} from '../src/app/tutor/components/session/prestart-affordances';

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

console.log('showsDockMuteButton');
// The whole point: mute is meaningless before there is anything to mute, and
// a second mic icon beside the start mic reads as a competing start control.
check('hidden pre-start', showsDockMuteButton({ hasStarted: false, isPaused: false }), false);
check('shown once started', showsDockMuteButton({ hasStarted: true, isPaused: false }), true);
check('hidden while paused (unchanged from before)', showsDockMuteButton({ hasStarted: true, isPaused: true }), false);
check('hidden pre-start even if paused', showsDockMuteButton({ hasStarted: false, isPaused: true }), false);

console.log('preStartDockCaption');
check(
  'pre-start points at the orb but keeps the dock as a real second way in',
  preStartDockCaption({ started: false, muted: false }),
  'or start here — talk or type',
);
check('muted wins over everything', preStartDockCaption({ started: true, muted: true }), 'Muted — tap the mic to talk');
check('muted pre-start still reads as muted', preStartDockCaption({ started: false, muted: true }), 'Muted — tap the mic to talk');
check('started and unmuted', preStartDockCaption({ started: true, muted: false }), 'Listening…');

console.log('orbIsStartButton');
check('pre-start with a live start path -> orb is the button', orbIsStartButton({ started: false, canStart: true, agendaEngaged: false }), true);
// Once the session runs the orb goes back to being a presence indicator —
// tapping it must not re-fire a kickoff.
check('after start -> decorative again', orbIsStartButton({ started: true, canStart: true, agendaEngaged: false }), false);
check('no start path wired -> decorative', orbIsStartButton({ started: false, canStart: false, agendaEngaged: false }), false);
// An agenda pick has already fired the start sequence; the orb must not
// double-kick the brain while the board content is still in flight.
check('agenda pick in flight -> decorative', orbIsStartButton({ started: false, canStart: true, agendaEngaged: true }), false);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll pre-start affordance checks passed');
