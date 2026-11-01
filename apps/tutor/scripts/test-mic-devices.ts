/**
 * Fallback-mic picker (2026-08-17 triage): macOS handed Vanshika's sessions
 * the iPhone Continuity microphone three separate times, and it recorded
 * pure silence (peak −∞ dBFS) every time. The only remedy she found was
 * restarting the whole session with the MacBook mic. The dead-mic banner
 * now offers a one-tap switch; this rule picks WHICH device to offer.
 */
import { pickFallbackMicDevice } from '../src/lib/tutor/voice/mic-devices';
import { micReacquireDecision, micReacquireReason, MIC_TRACK_MUTED_REACQUIRE_MS, MIC_REACQUIRE_COOLDOWN_MS, defaultInputChanged } from '../src/lib/tutor/voice/mic-reacquire';

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

const d = (deviceId: string, label: string, kind = 'audioinput') => ({ deviceId, label, kind });

// The observed macOS device list shape.
const VANSHIKA = [
  d('default', 'Default - Vanshika’s iPhone (2) Microphone'),
  d('iphone1', 'Vanshika’s iPhone (2) Microphone'),
  d('mba1', 'MacBook Air Microphone (Built-in)'),
  d('spk1', 'MacBook Air Speakers', 'audiooutput'),
];

console.log('pickFallbackMicDevice');
check(
  'dead iPhone Continuity mic → offer the built-in MacBook mic',
  pickFallbackMicDevice(VANSHIKA, 'Vanshika’s iPhone (2) Microphone', []),
  { deviceId: 'mba1', label: 'MacBook Air Microphone (Built-in)' },
);
check(
  'the current device is never offered, even via its Default- wrapper',
  pickFallbackMicDevice(
    [d('default', 'Default - MacBook Air Microphone (Built-in)'), d('mba1', 'MacBook Air Microphone (Built-in)')],
    'MacBook Air Microphone (Built-in)',
    [],
  ),
  null,
);
check(
  'no built-in match → first other real input',
  pickFallbackMicDevice(
    [d('usb1', 'USB Audio Device'), d('head1', 'Gaming Headset')],
    'USB Audio Device',
    [],
  ),
  { deviceId: 'head1', label: 'Gaming Headset' },
);
check(
  'already-tried devices are excluded (no ping-pong back to the dead mic)',
  pickFallbackMicDevice(VANSHIKA, 'MacBook Air Microphone (Built-in)', ['iphone1']),
  null,
);
check(
  'outputs and pseudo-devices are never candidates',
  pickFallbackMicDevice(
    [d('default', 'Default'), d('communications', 'Communications'), d('spk', 'Speakers', 'audiooutput')],
    'Anything',
    [],
  ),
  null,
);
check(
  'permission-less blank labels are skipped (nothing meaningful to offer)',
  pickFallbackMicDevice([d('x1', ''), d('x2', '')], 'Current Mic', []),
  null,
);
check('empty device list → null', pickFallbackMicDevice([], 'Current', []), null);

// Task 27 §G (GDI run 14, 1141 s): when the session re-acquires the shared mic.
{
  const live = { enabled: true, captureOpen: true, inFlight: false, sinceLastReacquireMs: null };
  check('27G: devicechange → reacquire', micReacquireDecision({ kind: 'devicechange' }, live), 'reacquire');
  check('27G: track ended → reacquire', micReacquireDecision({ kind: 'track-ended' }, live), 'reacquire');
  check('27G: the 3 s mute threshold', MIC_TRACK_MUTED_REACQUIRE_MS, 3000);
  check('27G: muted 2.9 s → wait', micReacquireDecision({ kind: 'track-muted', mutedForMs: 2900 }, live), 'wait');
  check('27G: muted 3.0 s → reacquire', micReacquireDecision({ kind: 'track-muted', mutedForMs: 3000 }, live), 'reacquire');
  check('27G: a re-acquire in flight ⇒ no second one (every trigger)',
    [micReacquireDecision({ kind: 'devicechange' }, { ...live, inFlight: true }), micReacquireDecision({ kind: 'track-ended' }, { ...live, inFlight: true }), micReacquireDecision({ kind: 'track-muted', mutedForMs: 5000 }, { ...live, inFlight: true })],
    ['ignore', 'ignore', 'ignore']);
  check('27G: devicechange burst within the cooldown → ignore', micReacquireDecision({ kind: 'devicechange' }, { ...live, sinceLastReacquireMs: MIC_REACQUIRE_COOLDOWN_MS - 1 }), 'ignore');
  check('27G: devicechange after the cooldown → reacquire', micReacquireDecision({ kind: 'devicechange' }, { ...live, sinceLastReacquireMs: MIC_REACQUIRE_COOLDOWN_MS }), 'reacquire');
  check('27G: track ended ignores the cooldown', micReacquireDecision({ kind: 'track-ended' }, { ...live, sinceLastReacquireMs: 10 }), 'reacquire');
  check('27G: no capture open / flag off → ignore',
    [micReacquireDecision({ kind: 'devicechange' }, { ...live, captureOpen: false }), micReacquireDecision({ kind: 'track-ended' }, { ...live, enabled: false })], ['ignore', 'ignore']);
  const DEV = [
    { kind: 'audioinput', deviceId: 'default', label: 'Default - MacBook Air Microphone (Built-in)' },
    { kind: 'audioinput', deviceId: 'a1', label: 'AirPods Pro' },
    { kind: 'audiooutput', deviceId: 'default', label: 'Default - AirPods Pro' },
  ];
  check('27 r1 m-8: the default input moved off the captured device → changed', defaultInputChanged(DEV, 'AirPods Pro'), true);
  check('27 r1 m-8: the default input is the captured device (an output changed) → unchanged', defaultInputChanged(DEV, 'MacBook Air Microphone (Built-in)'), false);
  check('27 r1 m-8: no labels (no permission) → changed (re-acquire)', defaultInputChanged([{ kind: 'audioinput', deviceId: 'default', label: '' }], 'AirPods Pro'), true);
  check('27G: reasons', [micReacquireReason({ kind: 'devicechange' }), micReacquireReason({ kind: 'track-ended' }), micReacquireReason({ kind: 'track-muted', mutedForMs: 3100 })], ['devicechange', 'track-ended', 'track-muted 3.1s']);
}

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll mic-devices checks passed.');
