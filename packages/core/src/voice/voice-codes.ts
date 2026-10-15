/**
 * Partner-facing voice codes: the names partners put in an embed token
 * (`voice: "maple"`, or a persona's `voice: "maple"`) to choose how the tutor
 * sounds. The code is ours; the provider voice behind it is not part of the
 * partner contract, so a code keeps working if the voice behind it changes.
 *
 * Two groups:
 *  - teacher: the house persona voices (same ids as TEACHER_VOICES in
 *    cartesia-voice-registry.ts), verified in live teaching sessions.
 *  - character: livelier voices for a partner's own themed companion.
 *
 * Codes never reuse a realtime voice name (alloy, ash, ballad, coral, echo,
 * sage, shimmer, verse, marin, cedar): the token's `voice` field also accepts
 * those, and a code must never be mistaken for one.
 *
 * Pure module: safe to import from client and server.
 */

export type VoiceGroup = 'teacher' | 'character';

export interface VoiceCode {
  code: string;
  group: VoiceGroup;
  /** Short plain-language tags shown in the gallery. */
  tags: string[];
  /** One line on how it sounds, for the gallery. */
  description: string;
  /** Provider voice id — server/client internal, never shown to partners. */
  voiceId: string;
}

export const VOICE_CODES: readonly VoiceCode[] = [
  // ── Teacher voices (house personas) ──
  { code: 'maple', group: 'teacher', tags: ['female', 'American', 'warm'], description: 'Calm, mature and warm — our default teacher voice.', voiceId: 'bf0a246a-8642-498a-9950-80c35e9276b5' },
  { code: 'willow', group: 'teacher', tags: ['female', 'American', 'friendly'], description: 'Approachable and clear, a friendly guide.', voiceId: 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4' },
  { code: 'canyon', group: 'teacher', tags: ['male', 'American', 'easygoing'], description: 'Relaxed and friendly, never in a hurry.', voiceId: 'a5136bf9-224c-4d76-b823-52bd5efcffcc' },
  { code: 'thistle', group: 'teacher', tags: ['female', 'British', 'confident'], description: 'Confident and expressive.', voiceId: '62ae83ad-4f6a-430b-af41-a9bede9286ca' },
  { code: 'harbour', group: 'teacher', tags: ['male', 'British', 'warm'], description: 'Warm and conversational.', voiceId: 'ef191366-f52f-447a-a398-ed8c0f2943a1' },
  { code: 'saffron', group: 'teacher', tags: ['male', 'Indian English', 'brisk'], description: 'Friendly and quick, a problem solver.', voiceId: '638efaaa-4d0c-442e-b701-3fae16aad012' },
  { code: 'lotus', group: 'teacher', tags: ['female', 'Indian English', 'friendly'], description: 'Friendly presenter with a light accent.', voiceId: '28ca2041-5dda-42df-8123-f58ea9c3da00' },
  { code: 'wattle', group: 'teacher', tags: ['female', 'Australian', 'bright'], description: 'Bright and polished.', voiceId: 'c2ad7092-0447-47ea-948b-61fbb6faf153' },
  { code: 'kestrel', group: 'teacher', tags: ['male', 'Australian', 'warm'], description: 'Warm and relatable.', voiceId: '49743b08-0f5d-4741-839c-b12933853780' },
  { code: 'protea', group: 'teacher', tags: ['female', 'South African', 'lively'], description: 'Lively and positive.', voiceId: '263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18' },
  { code: 'baobab', group: 'teacher', tags: ['male', 'South African', 'clear'], description: 'Clear and articulate.', voiceId: 'baf84392-fa95-4d44-8871-d32ee36b0e01' },
  { code: 'orchid', group: 'teacher', tags: ['female', 'Singaporean', 'clear'], description: 'Friendly and clear.', voiceId: 'efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f' },
  { code: 'banyan', group: 'teacher', tags: ['male', 'Singaporean', 'steady'], description: 'Steady and trustworthy.', voiceId: 'ac5a9529-3965-4eac-b574-dce63664fbf4' },
  { code: 'dune', group: 'teacher', tags: ['female', 'Arabic accent', 'warm'], description: 'Warm, conversational and natural.', voiceId: '9825cf5f-6aff-412a-80c5-bc58a8d55bc4' },
  { code: 'oasis', group: 'teacher', tags: ['male', 'Arabic accent', 'clear'], description: 'Articulate and patient.', voiceId: '9cbad5f7-fbf6-4416-a22f-1ecc75ad40a2' },
  { code: 'linden', group: 'teacher', tags: ['female', 'German accent', 'approachable'], description: 'Approachable and conversational.', voiceId: 'ac197a78-cec7-4c50-93e5-93bdc1910b11' },
  { code: 'alder', group: 'teacher', tags: ['male', 'German accent', 'clear'], description: 'Clear and instructive.', voiceId: '42f14755-88c3-4124-aae3-5cc3a9618e8f' },
  { code: 'tulip', group: 'teacher', tags: ['female', 'Dutch accent', 'methodical'], description: 'Clear and methodical.', voiceId: '225ba8cf-9fc2-4371-a78c-fe38ba38898a' },
  // ── Character voices (themed companions) ──
  { code: 'pixel', group: 'character', tags: ['female', 'young adult', 'high energy'], description: 'Bright, high-energy, made for animated characters.', voiceId: 'cccc21e8-5bcf-4ff0-bc7f-be4e40afc544' },
  { code: 'turbo', group: 'character', tags: ['male', 'young adult', 'sidekick'], description: 'Friendly, upbeat sidekick.', voiceId: 'e00d0e4c-a5c8-443f-a8a3-473eb9a62355' },
  { code: 'confetti', group: 'character', tags: ['female', 'young adult', 'cheery'], description: 'Cheery and fun.', voiceId: '56b87df1-594d-4135-992c-1112bb504c59' },
  { code: 'jelly', group: 'character', tags: ['male', 'comic', 'silly'], description: 'Goofy and playful — for a comic companion.', voiceId: 'bfd3644b-d561-4b1c-a01f-d9af98cb67c0' },
  { code: 'rocket', group: 'character', tags: ['male', 'excited', 'cheerful'], description: 'Excited and cheerful.', voiceId: '2d5b8c3a-116c-4741-acaf-ba4fa289eba2' },
  { code: 'zest', group: 'character', tags: ['female', 'upbeat', 'energetic'], description: 'A ball of energy.', voiceId: '050f5a7a-9d2b-4b76-84e3-2d056a0a3eb0' },
  { code: 'stadium', group: 'character', tags: ['male', 'sportscaster', 'big energy'], description: 'Sports-commentary energy.', voiceId: '59697755-8cfb-4ccf-9da4-f2201d06b067' },
  { code: 'campfire', group: 'character', tags: ['male', 'storyteller', 'playful'], description: 'Unhurried storyteller with a playful charm.', voiceId: 'fbf7d2ec-ebea-49f2-8889-a482b9b0a7ed' },
  { code: 'storybook', group: 'character', tags: ['female', 'storyteller', 'animated'], description: 'Chirpy, expressive narrator.', voiceId: '083de431-6b5c-4b18-a2dc-264eafa205f2' },
  { code: 'compass', group: 'character', tags: ['male', 'explorer', 'deep'], description: 'Curious explorer, documentary feel.', voiceId: 'e2d48e7b-cd73-4c4c-bc1e-f232580e8709' },
  { code: 'marmalade', group: 'character', tags: ['female', 'British', 'chirpy'], description: 'Chirpy and witty.', voiceId: 'a01c369f-6d2d-4185-bc20-b32c225eab70' },
  { code: 'skate', group: 'character', tags: ['male', 'young adult', 'buddy'], description: 'Cheerful, supportive buddy.', voiceId: '630ed21c-2c5c-41cf-9d82-10a7fd668370' },
  { code: 'lantern', group: 'character', tags: ['male', 'deep', 'mysterious'], description: 'Deep and mysterious — for adventure and mystery themes.', voiceId: '6a176356-ada1-4b48-b2ae-3a3fdd485680' },
];

const BY_CODE = new Map(VOICE_CODES.map((v) => [v.code, v]));

/** Normalises a partner-supplied code ("  Maple " → "maple"). */
function norm(code: string): string {
  return code.trim().toLowerCase();
}

export function isVoiceCode(value: unknown): value is string {
  return typeof value === 'string' && BY_CODE.has(norm(value));
}

/** The provider voice id behind a code; null for an unknown code. */
export function voiceIdForCode(code: string): string | null {
  return BY_CODE.get(norm(code))?.voiceId ?? null;
}

/** The code for a provider voice id (to show a catalogue persona's voice as a code). */
export function codeForVoiceId(voiceId: string): string | null {
  return VOICE_CODES.find((v) => v.voiceId === voiceId)?.code ?? null;
}
