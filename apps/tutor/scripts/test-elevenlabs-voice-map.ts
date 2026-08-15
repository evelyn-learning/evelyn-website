/**
 * Round-28b: Cartesia → ElevenLabs voice-matched fallback mapping.
 *
 * The OpenAI-voice fallback (round-18) is gone — a sudden accent change
 * mid-lesson was a dealbreaker (user, 2026-07-18). Every Cartesia teacher
 * voice maps to a voice-matched ElevenLabs fallback (gender + accent), so
 * a Cartesia outage degrades to a SIMILAR voice, never a jarring one.
 * Mapping confirmed by the user 2026-07-18.
 *
 * Run: npx tsx scripts/test-elevenlabs-voice-map.ts
 */
import {
  ELEVENLABS_VOICES,
  ELEVENLABS_DEFAULT_VOICE_ID,
  resolveElevenLabsVoice,
} from '../src/lib/tutor/voice/elevenlabs-voice-map';

let failures = 0;
function check(name: string, actual: string, expected: string) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}${ok ? '' : ` (expected ${expected}, got ${actual})`}`);
}

const { PRAVEEN, NAKUL, ANJURA, EARL, SONYA } = ELEVENLABS_VOICES;

// Portal teacher clones/voices (seed-teachers.ts) — user-confirmed mapping.
// Praveen's own ElevenLabs clone (ELEVENLABS_VOICES.PRAVEEN) is PARKED —
// professional voices need a Creator-tier subscription (user decision
// 2026-07-18: substitute Nakul instead of upgrading).
check('Mr. Praveen (custom clone) → Nakul (clone parked: needs Creator tier)',
  resolveElevenLabsVoice('232ac7bd-274f-468b-a06d-98248beee31a'), NAKUL);
check('Mr. Sameer (Cartesia Sameer, Indian male) → Nakul',
  resolveElevenLabsVoice('638efaaa-4d0c-442e-b701-3fae16aad012'), NAKUL);
check('Ms. Kiara (Indian female) → Anjura',
  resolveElevenLabsVoice('f8f5f1b2-f02d-4d8e-a40d-fd850a487b3d'), ANJURA);
check('Mr. Joseph (American male) → Earl',
  resolveElevenLabsVoice('7d444628-dd13-442b-b687-71a6baf0c07e'), EARL);
check('Mr. Cole (American male) → Earl',
  resolveElevenLabsVoice('3e39e9a5-585c-4f5f-bac6-5e4905c51095'), EARL);
check('Ms. Cathy (American female) → Sonya',
  resolveElevenLabsVoice('e8e5fffb-252c-436d-b842-8879b84445b6'), SONYA);
check('Ms. Michelle (American female) → Sonya',
  resolveElevenLabsVoice('d7bf7d75-64b7-4c1e-86c0-79d647366587'), SONYA);
check('Coach Riley (Sophie, 2026-07-30 swap; female) → Sonya',
  resolveElevenLabsVoice('bf0a246a-8642-498a-9950-80c35e9276b5'), SONYA);

// Engine /tutor registry voices — rule-based nearest match.
check('Katie (en-us female) → Sonya',
  resolveElevenLabsVoice('f786b574-daa5-4673-aa0c-cbe3e8534c02'), SONYA);
check('Jameson (en-us male) → Earl',
  resolveElevenLabsVoice('a5136bf9-224c-4d76-b823-52bd5efcffcc'), EARL);
check('Katie en-in localized (Indian female) → Anjura',
  resolveElevenLabsVoice('dc4725ab-a34f-4625-9ae3-e35296b456e2'), ANJURA);
check('Grace (en-au female) → Sonya',
  resolveElevenLabsVoice('c2ad7092-0447-47ea-948b-61fbb6faf153'), SONYA);
check('Cooper (en-au male) → Earl',
  resolveElevenLabsVoice('49743b08-0f5d-4741-839c-b12933853780'), EARL);
check('Nadia (en-sg female) → Anjura',
  resolveElevenLabsVoice('efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f'), ANJURA);
check('Kiran (en-sg male) → Nakul',
  resolveElevenLabsVoice('ac5a9529-3965-4eac-b574-dce63664fbf4'), NAKUL);
check('Zanele (en-za female) → Sonya',
  resolveElevenLabsVoice('263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18'), SONYA);
check('Pieter (en-za male) → Earl',
  resolveElevenLabsVoice('baf84392-fa95-4d44-8871-d32ee36b0e01'), EARL);

// Defaults: unknown / absent voice ids fall back to Sonya (mirrors the
// Cartesia default, Katie — en-us female).
check('unknown Cartesia voice → default (Sonya)',
  resolveElevenLabsVoice('00000000-0000-0000-0000-000000000000'), SONYA);
check('undefined voice → default (Sonya)',
  resolveElevenLabsVoice(undefined), SONYA);
check('default constant is Sonya', ELEVENLABS_DEFAULT_VOICE_ID, SONYA);

// Every ElevenLabs id in play is one of the five known voices.
const known = new Set(Object.values(ELEVENLABS_VOICES));
check('exactly 5 known ElevenLabs voices', String(known.size), '5');

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll elevenlabs-voice-map checks passed.');
