/**
 * Task 5 of docs/superpowers/plans/2026-07-06-cartesia-migration-phase2.md.
 *
 * Pure-logic test for `reconstructInkFinals` (src/app/tutor/hooks/
 * useCartesiaInkWS.ts) — no network, no browser. Fixtures below are
 * REAL recorded Ink 2 event sequences copied verbatim (type/turn_id/
 * transcript fields only) from artifacts/stt/run-<timestamp>/events/
 * en-us__sample1__ink2.jsonl (Phase 1 voice-harness `--probe` runs).
 *
 * `reconstructInkFinals` is ported VERBATIM from
 * scripts/tutor/voice-harness/stt-clients.ts's `ink2()` onMessage delta
 * logic — same per-turn_id cumulative-prefix diffing. Note (see the
 * function's doc comment in useCartesiaInkWS.ts): `.join(' ')` on its
 * output is a WER-style APPROXIMATION of the full sentence, not a
 * byte-exact reconstruction — Ink 2 sometimes grows the cumulative
 * transcript mid-word (e.g. "...x circum" -> "...x circumflex "), so a
 * delta can land mid-word and `.join(' ')` inserts a space that isn't in
 * the original text ("circum flex" instead of "circumflex"). This is why
 * the real hook (useCartesiaInkWS) delivers turn.end's OWN `transcript`
 * field verbatim to onTranscript and uses this function only as a
 * new-content/duplicate guard — see finalizeTurn's comment.
 */
import assert from 'node:assert';
import { reconstructInkFinals, type InkEvent } from '../src/app/tutor/hooks/useCartesiaInkWS';

// Fixture 1 — complete turn, copied verbatim from
// artifacts/stt/run-2026-07-06T16-21-03-156Z/events/en-us__sample1__ink2.jsonl
// (identical modulo request_id across every completed run of this clip).
// turn.start -> 20 turn.update (cumulative growth) -> turn.eager_end ->
// turn.end, both trailing events repeating the same full cumulative text.
const FIXTURE_COMPLETE_TURN: InkEvent[] = [
  { type: 'connected' },
  { type: 'turn.start', turn_id: '1' },
  { type: 'turn.update', turn_id: '1', transcript: 'So' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to x' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to x circum' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to x circumflex ' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to x circumflex 5.' },
  { type: 'turn.eager_end', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to x circumflex 5.' },
  { type: 'turn.end', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to x circumflex 5.' },
];
// Expected deltas for the fixture above — verified by running the ported
// function against it (matches the harness's own observed behavior: the
// trailing turn.eager_end/turn.end contribute nothing since they repeat
// the prior turn.update's cumulative text verbatim, so the array's last
// entry ("5.") comes from the final turn.update, not the terminal events).
const EXPECTED_DELTAS_COMPLETE = [
  'So', 'the', 'derivative', 'of', 'x', 'squared', 'is', '2', 'x',
  '. Watch', 'what', 'happens when', 'we', 'apply the', 'power', 'rule to',
  'x', 'circum', 'flex', '5.',
];

// Fixture 2 — copied verbatim from the 20-line PARTIAL recording
// (artifacts/stt/run-2026-07-06T15-18-17-175Z/events/en-us__sample1__ink2.jsonl):
// that probe run sent an (incorrect, since-fixed) `{type:'finalize'}`
// control message instead of `{type:'done'}` and got a 400 error back —
// no turn.eager_end/turn.end ever arrived. Real evidence that a partial
// turn (no terminal event) still reconstructs correctly from turn.update
// alone, and that a bare `error` event (no turn_id/transcript) is ignored.
const FIXTURE_PARTIAL_TURN_NO_END: InkEvent[] = [
  { type: 'connected' },
  { type: 'turn.start', turn_id: '1' },
  { type: 'turn.update', turn_id: '1', transcript: 'So' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to' },
  { type: 'turn.update', turn_id: '1', transcript: 'So the derivative of x squared is 2 x. Watch what happens when we apply the power rule to x' },
  {
    type: 'error',
    error_code: null,
    message: 'Unrecognized message type "finalize". Expected one of: "done", "close", "config".',
    status_code: 400,
    title: 'Invalid client message',
  },
];
const EXPECTED_DELTAS_PARTIAL = [
  'So', 'the', 'derivative', 'of', 'x', 'squared', 'is', '2', 'x',
  '. Watch', 'what', 'happens when', 'we', 'apply the', 'power', 'rule to', 'x',
];

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
  } catch (err) {
    console.error(`  FAIL  ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('test-ink-reconstruct');

test('complete turn (real recording) matches the verbatim-ported delta sequence', () => {
  assert.deepStrictEqual(reconstructInkFinals(FIXTURE_COMPLETE_TURN), EXPECTED_DELTAS_COMPLETE);
});

test('partial turn with no terminal event (real recording, 400 error mid-stream) reconstructs up to the last update', () => {
  assert.deepStrictEqual(reconstructInkFinals(FIXTURE_PARTIAL_TURN_NO_END), EXPECTED_DELTAS_PARTIAL);
});

test('turn.end repeating turn.eager_end\'s cumulative transcript (the normal/observed sequence) contributes nothing new', () => {
  // Both trailing events in the complete-turn fixture carry the exact same
  // cumulative transcript as the preceding turn.update — confirm neither
  // adds a trailing entry beyond what the turn.update stream alone produced.
  const onlyUpdates = FIXTURE_COMPLETE_TURN.filter((e) => e.type === 'turn.update');
  assert.deepStrictEqual(reconstructInkFinals(onlyUpdates), reconstructInkFinals(FIXTURE_COMPLETE_TURN));
});

test('a genuine duplicate turn.end (identical transcript sent twice) yields no double text', () => {
  const withDuplicate: InkEvent[] = [...FIXTURE_COMPLETE_TURN, FIXTURE_COMPLETE_TURN[FIXTURE_COMPLETE_TURN.length - 1]];
  assert.deepStrictEqual(reconstructInkFinals(withDuplicate), EXPECTED_DELTAS_COMPLETE);
});

test('events with no turn_id/transcript are ignored (connected, turn.start, error)', () => {
  const finals = reconstructInkFinals([
    { type: 'connected' },
    { type: 'turn.start', turn_id: '1' },
    { type: 'error', message: 'boom' },
  ]);
  assert.deepStrictEqual(finals, []);
});

test('two sequential turns (different turn_ids) each reconstruct independently', () => {
  const events: InkEvent[] = [
    { type: 'turn.start', turn_id: 'a' },
    { type: 'turn.update', turn_id: 'a', transcript: 'Hello' },
    { type: 'turn.update', turn_id: 'a', transcript: 'Hello there' },
    { type: 'turn.end', turn_id: 'a', transcript: 'Hello there' },
    { type: 'turn.start', turn_id: 'b' },
    { type: 'turn.update', turn_id: 'b', transcript: 'Second' },
    { type: 'turn.update', turn_id: 'b', transcript: 'Second turn' },
    { type: 'turn.end', turn_id: 'b', transcript: 'Second turn' },
  ];
  assert.deepStrictEqual(reconstructInkFinals(events), ['Hello', 'there', 'Second', 'turn']);
});

if (process.exitCode) {
  console.error('\nFAILED');
  process.exit(1);
} else {
  console.log('\nOK');
}
