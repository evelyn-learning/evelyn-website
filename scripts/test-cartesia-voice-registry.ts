/**
 * Unit tests for the Cartesia voice registry (Task 1 of the Cartesia
 * migration Phase 2 plan). Pure-logic test — no network, no DOM.
 *
 * Usage: npx tsx scripts/test-cartesia-voice-registry.ts
 */
import assert from 'node:assert';
import {
  CARTESIA_DEFAULT_VOICE_ID,
  resolveCartesiaVoice,
} from '../src/lib/tutor/voice/cartesia-voice-registry';

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

// Locked IDs from docs/superpowers/plans/2026-07-06-cartesia-migration-phase2.md
const KATIE = 'f786b574-daa5-4673-aa0c-cbe3e8534c02';
const SAMEER = '638efaaa-4d0c-442e-b701-3fae16aad012';
const SKYLAR = 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4';
const GEMMA = '62ae83ad-4f6a-430b-af41-a9bede9286ca';
const KATIE_LOCALIZED_EN_IN = 'dc4725ab-a34f-4625-9ae3-e35296b456e2';
const MARYAM_EN_AR_GULF = '9825cf5f-6aff-412a-80c5-bc58a8d55bc4';
const JAN_EN_DE = '42f14755-88c3-4124-aae3-5cc3a9618e8f';

// Real DEMO_TEACHERS ids from src/lib/tutor/ai/teacher-persona.ts
const ELENA = 'ms-elena-vasquez';
const DEV = 'mr-dev-khanna';
const AMARA = 'dr-amara-osei';
const SOFIA = 'sofia';

check('CARTESIA_DEFAULT_VOICE_ID is Katie', () => {
  assert.strictEqual(CARTESIA_DEFAULT_VOICE_ID, KATIE);
});

check('elena -> Katie (persona-authentic base)', () => {
  assert.strictEqual(resolveCartesiaVoice({ teacherId: ELENA }).voiceId, KATIE);
});

check('dev -> Sameer (persona-authentic base, user-selected 2026-07-07)', () => {
  assert.strictEqual(resolveCartesiaVoice({ teacherId: DEV }).voiceId, SAMEER);
});

check('amara -> Skylar (persona-authentic base)', () => {
  assert.strictEqual(resolveCartesiaVoice({ teacherId: AMARA }).voiceId, SKYLAR);
});

check('sofia -> Gemma (persona-authentic base)', () => {
  assert.strictEqual(resolveCartesiaVoice({ teacherId: SOFIA }).voiceId, GEMMA);
});

check('elena + en-in -> Katie-localized (accent override on teacher base)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: ELENA, accent: 'en-in' }).voiceId,
    KATIE_LOCALIZED_EN_IN
  );
});

check('dev + en-in -> Sameer unchanged (already en-in)', () => {
  assert.strictEqual(resolveCartesiaVoice({ teacherId: DEV, accent: 'en-in' }).voiceId, SAMEER);
});

check('accent only en-ar-gulf (no teacher) -> Maryam (female default)', () => {
  assert.strictEqual(resolveCartesiaVoice({ accent: 'en-ar-gulf' }).voiceId, MARYAM_EN_AR_GULF);
});

check('dev + en-de -> Jan (male pool match)', () => {
  assert.strictEqual(resolveCartesiaVoice({ teacherId: DEV, accent: 'en-de' }).voiceId, JAN_EN_DE);
});

check('unknown teacher/accent -> CARTESIA_DEFAULT_VOICE_ID', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: 'nonexistent-teacher', accent: 'xx-yy' }).voiceId,
    CARTESIA_DEFAULT_VOICE_ID
  );
});

check('no-args -> default', () => {
  assert.strictEqual(resolveCartesiaVoice({}).voiceId, CARTESIA_DEFAULT_VOICE_ID);
  assert.strictEqual(resolveCartesiaVoice().voiceId, CARTESIA_DEFAULT_VOICE_ID);
});

check('every result includes a non-empty label', () => {
  assert.ok(resolveCartesiaVoice({ teacherId: ELENA }).label.length > 0);
  assert.ok(resolveCartesiaVoice().label.length > 0);
});

// ── Geo-accent pools (2026-07-19 spec: user-locked ids, no listening round) ──
const GRACE_EN_AU = 'c2ad7092-0447-47ea-948b-61fbb6faf153';
const COOPER_EN_AU = '49743b08-0f5d-4741-839c-b12933853780';
const NADIA_EN_SG = 'efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f';
const KIRAN_EN_SG = 'ac5a9529-3965-4eac-b574-dce63664fbf4';
const ZANELE_EN_ZA = '263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18';
const PIETER_EN_ZA = 'baf84392-fa95-4d44-8871-d32ee36b0e01';

check('elena + en-au -> Grace (female pool pick)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: ELENA, accent: 'en-au' }).voiceId,
    GRACE_EN_AU,
  );
});

check('dev + en-au -> Cooper (male pool pick)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: DEV, accent: 'en-au' }).voiceId,
    COOPER_EN_AU,
  );
});

check('no teacher + en-sg -> Nadia (female default)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ accent: 'en-sg' }).voiceId,
    NADIA_EN_SG,
  );
});

check('dev + en-sg -> Kiran (male pool pick)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: DEV, accent: 'en-sg' }).voiceId,
    KIRAN_EN_SG,
  );
});

check('elena + en-za -> Zanele (female pool pick; user-corrected gender)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: ELENA, accent: 'en-za' }).voiceId,
    ZANELE_EN_ZA,
  );
});

check('dev + en-za -> Pieter (male pool pick; user-corrected gender)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: DEV, accent: 'en-za' }).voiceId,
    PIETER_EN_ZA,
  );
});

check('dev + en-in still -> Sameer (native-accent short-circuit unchanged)', () => {
  assert.strictEqual(
    resolveCartesiaVoice({ teacherId: DEV, accent: 'en-in' }).voiceId,
    SAMEER,
  );
});

console.log(`\n${passed} passed`);
