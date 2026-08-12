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
import { detectVoiceOnlyExercise, RENDER_TOOLS, isRenderTool } from '../src/lib/tutor/voice/exercise-board-check';

// Whole-branch review ride-along: the drift pin derives its expectation from
// the REAL tool list instead of a hardcoded count. WHITEBOARD_TOOLS is
// module-init-time env-sensitive (show_sketch is spread in only when
// TUTOR_SKETCH === 'true'), so force the flag ON and load it with require()
// AFTER doing so — a static `import` is hoisted above this assignment and
// would snapshot the flag-off list, making the pin quietly blind to every
// flag-gated show_* tool. Forcing it on is the right expectation: RENDER_TOOLS
// must cover every show_* tool the brain can EVER be handed, not just the
// ones the current env exposes.
process.env.TUTOR_SKETCH = 'true';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { WHITEBOARD_TOOLS } = require('../src/app/tutor/hooks/toolDefinitions') as typeof import('../src/app/tutor/hooks/toolDefinitions');

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

// MINOR (review round, report-note-only): "Give me two different ways to
// check that" is a spec-inherited false positive of shape (ii) — "N
// different <ways>" + the "give" ask verb — even though it can plausibly be
// a conversational aside rather than a posed exercise. Accepted per the
// brief's own shape (ii) definition; documented here rather than narrowed,
// since narrowing the ask-verb/noun set to exclude it would also exclude
// legitimate asks ("give me two different examples").
test('accepted FP: "give me two different ways" reads as posed (shape ii, spec-inherited)', () => {
  const result = detectVoiceOnlyExercise('Give me two different ways to check that.');
  assert.equal(result.posed, true);
  assert.equal(result.shape, 'n-different');
});

// --- RENDER_TOOLS membership (review round Finding 1) -----------------------
// Pinned literal set enumerated from WHITEBOARD_TOOLS (toolDefinitions.ts,
// 64 show_* tools, R48 review round) — every show_* tool renders NEW
// content and counts; pointer/annotation/control/silent tools do not.
test('RENDER_TOOLS: content renderers included', () => {
  for (const name of [
    'show_problem', 'show_equation', 'show_table', 'show_diagram',
    'show_segment_card', 'show_try_yourself', 'show_passage',
    'show_annotated_passage', 'show_solution', 'show_worked_example',
  ]) {
    assert.equal(isRenderTool(name), true, `${name} must be a render tool`);
  }
});

test('RENDER_TOOLS: pointer/annotation tools excluded (cannot paint new material)', () => {
  for (const name of ['tutor_scribble', 'tutor_link', 'tutor_handwrite', 'highlight', 'annotate', 'draw_vector']) {
    assert.equal(isRenderTool(name), false, `${name} must NOT be a render tool`);
  }
});

test('RENDER_TOOLS: control/meta/silent tools excluded', () => {
  for (const name of [
    'new_page', 'go_to_page', 'clear', 'list_whiteboard_features',
    'tutor_scroll_whiteboard', 'advance_lesson', 'mark_segment_complete',
    'generate_problem', 'confirm_plan_los', 'propose_plan_swap',
    'record_gap', 'flag_prerequisite_gap', 'expand_topic_notes_theory',
    'add_topic_notes_method', 'add_topic_notes_pointer',
  ]) {
    assert.equal(isRenderTool(name), false, `${name} must NOT be a render tool`);
  }
});

// Whole-branch review ride-along: a bare `size === 64` pin cannot see DRIFT —
// add a 65th show_* tool to toolDefinitions.ts and this suite stays green
// while the gate silently stops counting it. Derive the expectation from
// WHITEBOARD_TOOLS instead and assert SET EQUALITY, so any show_* tool added
// (or removed, or renamed) fails here until RENDER_TOOLS is updated too.
// (Loaded with TUTOR_SKETCH forced on — see the require() at the top.)
test('RENDER_TOOLS: exactly the show_* tools in WHITEBOARD_TOOLS (drift-proof)', () => {
  const expected = WHITEBOARD_TOOLS
    .map((t) => t.name)
    .filter((n) => n.startsWith('show_'))
    .sort();
  const actual = Array.from(RENDER_TOOLS).sort();
  assert.ok(actual.every((n) => n.startsWith('show_')), 'every RENDER_TOOLS member must be show_-prefixed');
  const missing = expected.filter((n) => !RENDER_TOOLS.has(n));
  const extra = actual.filter((n) => !expected.includes(n));
  assert.deepEqual(
    actual, expected,
    `RENDER_TOOLS drifted from toolDefinitions.ts — missing: [${missing.join(', ')}], extra: [${extra.join(', ')}]`,
  );
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
