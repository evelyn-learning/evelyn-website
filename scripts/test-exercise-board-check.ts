/**
 * R48 Task 2 — exercise-board-check.ts. Live failure (2026-08-12, HS English
 * phaseC verify session): a multi-part exercise ("tell me the job it's
 * doing in three different sentences, starting with 'her study of local
 * water quality.'") was posed voice-only — no show_problem/card ever
 * rendered. RED before the detector existed; GREEN once it exists and
 * matches the live utterance while staying silent on ordinary turns.
 *
 * Run: npx tsx scripts/test-exercise-board-check.ts
 */
import { strict as assert } from 'node:assert';
import { detectVoiceOnlyExercise } from '../src/lib/tutor/voice/exercise-board-check';

let passed = 0; let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

console.log('Voice-only exercise detector (exercise-board-check.ts)\n');

// --- POSITIVE: the live failure utterance ---------------------------------
test('live utterance (2026-08-12, HS English) is posed — shape ii or iii', () => {
  const text =
    "…press on the trap that catches almost everyone. Look at 'study' — " +
    "I want you to tell me the job it's doing in three different sentences, " +
    "starting with 'her study of local water quality.'";
  const result = detectVoiceOnlyExercise(text);
  assert.equal(result.posed, true, 'live utterance must be detected as posed');
  assert.ok(
    result.shape === 'n-different' || result.shape === 'quoted-material',
    `expected shape 'n-different' or 'quoted-material', got '${result.shape}'`,
  );
});

// --- POSITIVE: other shapes -------------------------------------------------
test('shape (i): (a)/(b) enumeration + question mark is posed', () => {
  const text = "Let's break this sentence down: (a) what is the subject, and (b) what is the verb?";
  const result = detectVoiceOnlyExercise(text);
  assert.equal(result.posed, true);
  assert.equal(result.shape, 'ab-enum');
});

test('shape (i): (a)/(b) enumeration + ask verb (no question mark) is posed', () => {
  const text = 'Write down (a) the subject and (b) the verb of this sentence.';
  const result = detectVoiceOnlyExercise(text);
  assert.equal(result.posed, true);
  assert.equal(result.shape, 'ab-enum');
});

test('shape (ii): "N different examples" + ask verb is posed', () => {
  const text = 'Give me two different examples of a metaphor before we move on.';
  const result = detectVoiceOnlyExercise(text);
  assert.equal(result.posed, true);
  assert.equal(result.shape, 'n-different');
});

test('shape (iii): quoted material + ask verb + bare count noun is posed', () => {
  const text = "Take the phrase 'a stitch in time saves nine' and come up with three examples of when you'd use it.";
  const result = detectVoiceOnlyExercise(text);
  assert.equal(result.posed, true);
  assert.equal(result.shape, 'quoted-material');
});

// --- NEGATIVE: false-positive discipline ------------------------------------
test('rhetorical count (no ask verb, no second-person) is NOT posed', () => {
  const text = 'There are three different ways this shows up in the text.';
  assert.equal(detectVoiceOnlyExercise(text).posed, false);
});

test('rhetorical count with "you" but no ask verb is NOT posed', () => {
  const text = 'You can see three different examples here already.';
  assert.equal(detectVoiceOnlyExercise(text).posed, false);
});

test('math turn with a show_equation ask verb is NOT posed (no enumeration/quote)', () => {
  const text = 'Take the derivative of f of x and tell me what you get.';
  assert.equal(detectVoiceOnlyExercise(text).posed, false);
});

test('plain question with no enumeration is NOT posed', () => {
  const text = 'What is the capital of France?';
  assert.equal(detectVoiceOnlyExercise(text).posed, false);
});

test('"give me a second" (ask verb, no structure) is NOT posed', () => {
  const text = 'Give me a second, let me think about how to explain this.';
  assert.equal(detectVoiceOnlyExercise(text).posed, false);
});

test('enumerated RECAP summary the tutor reads back is NOT posed', () => {
  const text = 'So today we covered (a) verbs, (b) nouns, and (c) adjectives — nice work.';
  assert.equal(detectVoiceOnlyExercise(text).posed, false);
});

test('quoted material with no ask verb is NOT posed', () => {
  const text = "The phrase 'her study of local water quality' shows the noun form of study.";
  assert.equal(detectVoiceOnlyExercise(text).posed, false);
});

test('contraction apostrophes do not open a false quote span', () => {
  const text = "Tell me what it's doing here — it's just a verb, right?";
  assert.equal(detectVoiceOnlyExercise(text).posed, false);
});

test('empty/whitespace input is safe', () => {
  assert.equal(detectVoiceOnlyExercise('').posed, false);
  assert.equal(detectVoiceOnlyExercise('   ').posed, false);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
