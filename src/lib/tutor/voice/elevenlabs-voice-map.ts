/**
 * Cartesia → ElevenLabs voice-matched fallback map (round-28b, 2026-07-18).
 *
 * The round-18 OpenAI-voice fallback is REMOVED: a sudden accent change
 * mid-lesson was a user dealbreaker ("we're not going to have someone else
 * start talking"). When Cartesia is down, the sentence falls back to an
 * ElevenLabs voice matched on speaker (Praveen's own ElevenLabs clone) or
 * on gender + accent — never a random different voice.
 *
 * Portal-teacher mappings user-confirmed 2026-07-18. Engine /tutor demo
 * registry voices get the nearest gender+accent pick; non-Indian,
 * non-American accents (en-gb/en-ar-gulf/en-nl/en-de) collapse to the
 * American pair as the least-wrong available match.
 *
 * Pure module (no env reads) — safe for client and server imports, and
 * script-testable (test:elevenlabs-voice-map).
 */

export const ELEVENLABS_VOICES = {
  /** Mr. Praveen's own ElevenLabs clone — PARKED, not in the active map:
   *  professional voices require a Creator-tier subscription (403
   *  only_for_creator+ observed 2026-07-18). User decision: substitute
   *  Nakul rather than upgrade. Re-point the Praveen row below at this
   *  constant if the account ever moves to Creator+. */
  PRAVEEN: 'smHyZAcbUaIu7hBvqWsF',
  /** Nakul — Indian male. */
  NAKUL: 'UZZaeURqKfDlK782R5Xb',
  /** Anjura — Indian female. */
  ANJURA: 'a6XidOEnTywSiWFoBUhm',
  /** Earl — American male. */
  EARL: 'bV9ai9Wem8olqrkR49Zw',
  /** Sonya — American female. */
  SONYA: 'xmVFTJ0HkfAEMw4wGMgl',
} as const;

const { NAKUL, ANJURA, EARL, SONYA } = ELEVENLABS_VOICES;

/** Mirrors the Cartesia default (Katie — en-us female). */
export const ELEVENLABS_DEFAULT_VOICE_ID = SONYA;

const CARTESIA_TO_ELEVENLABS: Record<string, string> = {
  // ── Portal teachers (apps/api seed-teachers.ts in the academy repo) ──
  '232ac7bd-274f-468b-a06d-98248beee31a': NAKUL,   // Mr. Praveen — Indian male (own clone parked, see above)
  '638efaaa-4d0c-442e-b701-3fae16aad012': NAKUL,   // Mr. Sameer — Indian male
  'f8f5f1b2-f02d-4d8e-a40d-fd850a487b3d': ANJURA,  // Ms. Kiara — Indian female
  '7d444628-dd13-442b-b687-71a6baf0c07e': EARL,    // Mr. Joseph — American male
  '3e39e9a5-585c-4f5f-bac6-5e4905c51095': EARL,    // Mr. Cole — American male
  'e8e5fffb-252c-436d-b842-8879b84445b6': SONYA,   // Ms. Cathy — American female
  'd7bf7d75-64b7-4c1e-86c0-79d647366587': SONYA,   // Ms. Michelle — American female
  'bf0a246a-8642-498a-9950-80c35e9276b5': SONYA,   // Coach Riley (Sophie, 2026-07-30 swap) — female
  // ── Engine /tutor demo registry (cartesia-voice-registry.ts) ──
  'f786b574-daa5-4673-aa0c-cbe3e8534c02': SONYA,   // Katie — en-us female
  'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4': SONYA,   // Skylar — en-us female
  'a5136bf9-224c-4d76-b823-52bd5efcffcc': EARL,    // Jameson — en-us male
  '62ae83ad-4f6a-430b-af41-a9bede9286ca': SONYA,   // Gemma — en-gb female (nearest)
  'ef191366-f52f-447a-a398-ed8c0f2943a1': EARL,    // Archie — en-gb male (nearest)
  'dc4725ab-a34f-4625-9ae3-e35296b456e2': ANJURA,  // Katie en-in localized — Indian female
  '28ca2041-5dda-42df-8123-f58ea9c3da00': ANJURA,  // Palak — en-in female (reserved pool voice)
  '9825cf5f-6aff-412a-80c5-bc58a8d55bc4': SONYA,   // Maryam — en-ar-gulf female (nearest)
  '9cbad5f7-fbf6-4416-a22f-1ecc75ad40a2': EARL,    // Youssef — en-ar-gulf male (nearest)
  '225ba8cf-9fc2-4371-a78c-fe38ba38898a': SONYA,   // Anneliese — en-nl (nearest)
  'ac197a78-cec7-4c50-93e5-93bdc1910b11': SONYA,   // Jennifer — en-de female (nearest)
  '42f14755-88c3-4124-aae3-5cc3a9618e8f': EARL,    // Jan — en-de male (nearest)
  'c2ad7092-0447-47ea-948b-61fbb6faf153': SONYA,   // Grace — en-au female (nearest)
  '49743b08-0f5d-4741-839c-b12933853780': EARL,    // Cooper — en-au male (nearest)
  'efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f': ANJURA,  // Nadia — en-sg female (nearest)
  'ac5a9529-3965-4eac-b574-dce63664fbf4': NAKUL,   // Kiran — en-sg male (nearest)
  '263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18': SONYA,   // Zanele — en-za female (nearest)
  'baf84392-fa95-4d44-8871-d32ee36b0e01': EARL,    // Pieter — en-za male (nearest)
};

export function resolveElevenLabsVoice(cartesiaVoiceId: string | undefined): string {
  if (!cartesiaVoiceId) return ELEVENLABS_DEFAULT_VOICE_ID;
  return CARTESIA_TO_ELEVENLABS[cartesiaVoiceId] ?? ELEVENLABS_DEFAULT_VOICE_ID;
}
