/**
 * Fallback-mic picker (2026-08-17 triage): macOS handed Vanshika's sessions
 * the iPhone Continuity microphone three separate times, and it recorded
 * pure silence (peak −∞ dBFS) every time. The only remedy she found was
 * restarting the whole session with the MacBook mic. The dead-mic banner
 * now offers a one-tap switch; this rule picks WHICH device to offer.
 */
import { pickFallbackMicDevice } from '../src/lib/tutor/voice/mic-devices';

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

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll mic-devices checks passed.');
