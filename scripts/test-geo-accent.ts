/**
 * Unit tests for the timezone -> accent mapper
 * (docs/superpowers/specs/2026-07-19-geo-accent-tutor-voice-design.md).
 * Pure-logic test — no network, no DOM.
 *
 * Usage: npx tsx scripts/test-geo-accent.ts
 */
import assert from 'node:assert';
import { accentFromTimezone } from '../src/lib/tutor/voice/geo-accent';

let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (err) {
    console.error(`  FAIL - ${name}`);
    throw err;
  }
}

const CASES: Array<[string | undefined, string | undefined]> = [
  // en-in: subcontinent
  ['Asia/Kolkata', 'en-in'],
  ['Asia/Calcutta', 'en-in'], // legacy alias still emitted by some browsers
  ['Asia/Karachi', 'en-in'],
  ['Asia/Dhaka', 'en-in'],
  ['Asia/Colombo', 'en-in'],
  ['Asia/Kathmandu', 'en-in'],
  // en-au: Australia + NZ
  ['Australia/Sydney', 'en-au'],
  ['Australia/Perth', 'en-au'],
  ['Pacific/Auckland', 'en-au'],
  // en-sg: SE Asia (serves PH too — no Filipino accent in Cartesia)
  ['Asia/Manila', 'en-sg'],
  ['Asia/Singapore', 'en-sg'],
  ['Asia/Kuala_Lumpur', 'en-sg'],
  ['Asia/Hong_Kong', 'en-sg'],
  ['Asia/Brunei', 'en-sg'],
  // en-za: sub-Saharan Africa (prefix rule)
  ['Africa/Johannesburg', 'en-za'],
  ['Africa/Lagos', 'en-za'],
  ['Africa/Nairobi', 'en-za'],
  ['Africa/Dar_es_Salaam', 'en-za'],
  ['Africa/Porto-Novo', 'en-za'],
  // en-ar-gulf: Gulf + Levant + North Africa (exact beats Africa/* prefix)
  ['Asia/Dubai', 'en-ar-gulf'],
  ['Asia/Riyadh', 'en-ar-gulf'],
  ['Asia/Amman', 'en-ar-gulf'],
  ['Asia/Kuwait', 'en-ar-gulf'],
  ['Asia/Qatar', 'en-ar-gulf'],
  ['Asia/Bahrain', 'en-ar-gulf'],
  ['Asia/Baghdad', 'en-ar-gulf'],
  ['Asia/Beirut', 'en-ar-gulf'],
  ['Asia/Damascus', 'en-ar-gulf'],
  ['Asia/Muscat', 'en-ar-gulf'],
  ['Africa/Cairo', 'en-ar-gulf'],
  ['Africa/Casablanca', 'en-ar-gulf'],
  ['Africa/Algiers', 'en-ar-gulf'],
  ['Africa/Tunis', 'en-ar-gulf'],
  ['Africa/Tripoli', 'en-ar-gulf'],
  ['Africa/Khartoum', 'en-ar-gulf'],
  // en-de / en-nl / en-gb
  ['Europe/Berlin', 'en-de'],
  ['Europe/Vienna', 'en-de'],
  ['Europe/Zurich', 'en-de'],
  ['Europe/Amsterdam', 'en-nl'],
  ['Europe/Brussels', 'en-nl'],
  ['Europe/London', 'en-gb'],
  ['Europe/Dublin', 'en-gb'],
  ['Europe/Malta', 'en-gb'],
  // en-us: all of the Americas (prefix rule) + Hawaii
  ['America/New_York', 'en-us'],
  ['America/Toronto', 'en-us'],
  ['America/Lima', 'en-us'],
  ['America/Sao_Paulo', 'en-us'],
  ['Pacific/Honolulu', 'en-us'],
  // fall-through: unmapped -> undefined (teacher base voice wins)
  ['Europe/Paris', undefined],
  ['Europe/Madrid', undefined],
  ['Asia/Tokyo', undefined],
  ['Asia/Shanghai', undefined],
  ['Europe/Istanbul', undefined],
  [undefined, undefined],
  ['', undefined],
  ['Not/A_Zone', undefined],
];

for (const [tz, expected] of CASES) {
  check(`${JSON.stringify(tz)} -> ${JSON.stringify(expected)}`, () => {
    assert.strictEqual(accentFromTimezone(tz), expected);
  });
}

console.log(`\n${passed}/${CASES.length} geo-accent checks passed`);
