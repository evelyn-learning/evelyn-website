/**
 * STAGE-2 lazy-cancel policy (E1, repeat-storm fix).
 *
 * Incident (real prod log): student answers "60"; brain turn starts
 * (prod='processing', 8-23s with no audio yet). Hearing silence, the
 * student repeats "60". The OLD behavior aborted the in-flight brain turn
 * the instant speech_started fired, then the repeat's transcript ("60 60")
 * resolved to noise and RE-FIRED the whole turn from scratch — every
 * repeat added 10-20s of fresh silence, inviting more repeats.
 *
 * decideStage2CancelAction / decideStage2CancelPolicy is the pure verdict:
 *   'eager'             → not 'processing' — unchanged instant-abort path
 *   'continue'          → 'processing' + noise/filler/drop_self_voice/
 *                          duplicate — let the in-flight turn play out
 *   'abort_and_dispatch'→ 'processing' + genuine new content — abort now,
 *                          then dispatch
 *
 * Review-round-1 ruling on the duplicate check (isDuplicateTranscript):
 * order-sensitive and strict — exact match, single-token repetition
 * ("60 60" vs "60"), or leading/trailing-filler-stripped match ("yeah,
 * sure 60" vs "60"), with 'like'/'right'/'so' removed from the filler list
 * (substantive in math/English) and reordered content ("5 minus 12" vs
 * "12 minus 5") explicitly NOT a duplicate.
 *
 * Run: npx tsx scripts/test-stage2-cancel.ts
 */
import {
  decideStage2CancelAction,
  decideStage2CancelPolicy,
  isDuplicateTranscript,
  normalizeForDuplicateCheck,
  stripLeadingTrailingFillers,
} from '../apps/marketing/src/lib/tutor/voice/stage2-cancel-policy';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`);
}

// ── decideStage2CancelAction: state × verdict × isDuplicate → action ──────

check(
  "processing + noise → continue",
  decideStage2CancelAction({ state: 'processing', verdict: 'noise', isDuplicate: false }),
  'continue',
);
check(
  "processing + filler → continue",
  decideStage2CancelAction({ state: 'processing', verdict: 'filler', isDuplicate: false }),
  'continue',
);
check(
  "processing + drop_self_voice → continue",
  decideStage2CancelAction({ state: 'processing', verdict: 'drop_self_voice', isDuplicate: false }),
  'continue',
);
check(
  "processing + new_turn (duplicate override) → continue",
  decideStage2CancelAction({ state: 'processing', verdict: 'new_turn', isDuplicate: true }),
  'continue',
);
check(
  "processing + continuation (duplicate override) → continue",
  decideStage2CancelAction({ state: 'processing', verdict: 'continuation', isDuplicate: true }),
  'continue',
);
check(
  "processing + new_turn, not duplicate → abort_and_dispatch",
  decideStage2CancelAction({ state: 'processing', verdict: 'new_turn', isDuplicate: false }),
  'abort_and_dispatch',
);
check(
  "processing + continuation, not duplicate → abort_and_dispatch",
  decideStage2CancelAction({ state: 'processing', verdict: 'continuation', isDuplicate: false }),
  'abort_and_dispatch',
);
check(
  "processing + barge_in, not duplicate → abort_and_dispatch",
  decideStage2CancelAction({ state: 'processing', verdict: 'barge_in', isDuplicate: false }),
  'abort_and_dispatch',
);
check(
  "processing + escalate (defensive), not duplicate → abort_and_dispatch",
  decideStage2CancelAction({ state: 'processing', verdict: 'escalate', isDuplicate: false }),
  'abort_and_dispatch',
);

// ── 'speaking' and 'listening' stay eager — this module has no opinion ────

for (const verdict of ['noise', 'filler', 'drop_self_voice', 'new_turn', 'continuation', 'barge_in'] as const) {
  check(
    `speaking + ${verdict} → eager (unchanged instant-abort path)`,
    decideStage2CancelAction({ state: 'speaking', verdict, isDuplicate: false }),
    'eager',
  );
  check(
    `listening + ${verdict} → eager (unchanged)`,
    decideStage2CancelAction({ state: 'listening', verdict, isDuplicate: false }),
    'eager',
  );
}
// A 'speaking'/'listening' duplicate flag must not flip the outcome either
// — state gates before duplicate is even consulted.
check(
  "speaking + new_turn + isDuplicate=true → still eager",
  decideStage2CancelAction({ state: 'speaking', verdict: 'new_turn', isDuplicate: true }),
  'eager',
);

// ── decideStage2CancelPolicy: the transcript-level wrapper ────────────────

check(
  'policy: processing, "60 60" vs "60", generic verdict new_turn → continue (duplicate override)',
  decideStage2CancelPolicy({ state: 'processing', verdict: 'new_turn', newTranscript: '60 60', originalTranscript: '60' }),
  'continue',
);
check(
  'policy: processing, "yeah, sure 60" vs "60", verdict new_turn → continue (duplicate override)',
  decideStage2CancelPolicy({ state: 'processing', verdict: 'new_turn', newTranscript: 'yeah, sure 60', originalTranscript: '60' }),
  'continue',
);
check(
  'policy: processing, "yeah 60" vs "60", verdict continuation → continue (duplicate override)',
  decideStage2CancelPolicy({ state: 'processing', verdict: 'continuation', newTranscript: 'yeah 60', originalTranscript: '60' }),
  'continue',
);
check(
  'policy: processing, "60 and then what" vs "60", verdict new_turn → abort_and_dispatch (genuinely new content, not a duplicate)',
  decideStage2CancelPolicy({ state: 'processing', verdict: 'new_turn', newTranscript: '60 and then what', originalTranscript: '60' }),
  'abort_and_dispatch',
);
check(
  'policy: processing, "61" vs "60", verdict new_turn → abort_and_dispatch (a genuine correction, not a repeat)',
  decideStage2CancelPolicy({ state: 'processing', verdict: 'new_turn', newTranscript: '61', originalTranscript: '60' }),
  'abort_and_dispatch',
);
check(
  'policy: processing, "5 minus 12" vs "12 minus 5", verdict new_turn → abort_and_dispatch (reordered ≠ duplicate)',
  decideStage2CancelPolicy({ state: 'processing', verdict: 'new_turn', newTranscript: '5 minus 12', originalTranscript: '12 minus 5' }),
  'abort_and_dispatch',
);
check(
  'policy: speaking, "60 60" vs "60", verdict new_turn → eager (state gates first, no duplicate logic applied)',
  decideStage2CancelPolicy({ state: 'speaking', verdict: 'new_turn', newTranscript: '60 60', originalTranscript: '60' }),
  'eager',
);

// ── isDuplicateTranscript: rules (a) exact, (b) single-token repeat, ──────
// (c) leading/trailing-filler-stripped match — order-sensitive, strict.

check('duplicate: (a) exact match', isDuplicateTranscript('60', '60'), true);
check('duplicate: (a) case-insensitive "SIXTY" vs "sixty"', isDuplicateTranscript('SIXTY', 'sixty'), true);
check('duplicate: (a) trailing punctuation "60?" vs "60"', isDuplicateTranscript('60?', '60'), true);
check('duplicate: (b) single-token repeat "60 60" vs "60"', isDuplicateTranscript('60 60', '60'), true);
check('duplicate: (b) single-token triple repeat "60 60 60" vs "60"', isDuplicateTranscript('60 60 60', '60'), true);
check('duplicate: (c) leading filler "yeah 60" vs "60"', isDuplicateTranscript('yeah 60', '60'), true);
check('duplicate: (c) multi leading filler "yeah, sure 60" vs "60"', isDuplicateTranscript('yeah, sure 60', '60'), true);
check('duplicate: (c) leading filler + punctuation "Um, sixty." vs "sixty"', isDuplicateTranscript('Um, sixty.', 'sixty'), true);
check('duplicate: (c) "60, right, um" vs "60" is NOT a duplicate — "right" is substantive (not a filler), so it survives edge-stripping and blocks the match', isDuplicateTranscript('60, right, um', '60'), false);
check('duplicate: (c) trailing filler only "60 um" vs "60"', isDuplicateTranscript('60 um', '60'), true);

// ── Review-round-1 ruling: reorder is NOT a duplicate ──────────────────────
check('duplicate: reordered content "5 minus 12" vs "12 minus 5" is NOT a duplicate', isDuplicateTranscript('5 minus 12', '12 minus 5'), false);
check('duplicate: reordered two-word "the derivative" vs "derivative the" is NOT a duplicate', isDuplicateTranscript('the derivative', 'derivative the'), false);

// ── Review-round-1 ruling: 'like'/'right'/'so' are substantive, NOT fillers ─
check('duplicate: "so 60" vs "60" is NOT a duplicate ("so" is substantive, not stripped)', isDuplicateTranscript('so 60', '60'), false);
check('duplicate: "right 60" vs "60" is NOT a duplicate ("right" is substantive, not stripped)', isDuplicateTranscript('right 60', '60'), false);
check('duplicate: "like 60" vs "60" is NOT a duplicate ("like" is substantive, not stripped)', isDuplicateTranscript('like 60', '60'), false);
check('duplicate: "so" is substantive — "so 5 minus 12" vs "5 minus 12" is NOT a duplicate', isDuplicateTranscript('so 5 minus 12', '5 minus 12'), false);

// ── Other non-duplicate cases ──────────────────────────────────────────────
check('duplicate: extra substantive word is NOT a duplicate', isDuplicateTranscript('60 and then what', '60'), false);
check('duplicate: different number is NOT a duplicate', isDuplicateTranscript('61', '60'), false);
check('duplicate: pure filler vs substantive is NOT a duplicate', isDuplicateTranscript('um', '60'), false);
check('duplicate: both pure filler is NOT a duplicate (nothing to compare)', isDuplicateTranscript('um', 'uh'), false);
check('duplicate: subset (fewer words than original) is NOT a duplicate', isDuplicateTranscript('60', '60 and then what'), false);
check('duplicate: multi-token original — new is not a repetition of it', isDuplicateTranscript('60 60', '5 minus 12'), false);

// ── normalizeForDuplicateCheck / stripLeadingTrailingFillers: edges ────────

check(
  'normalize: lowercase + strip punctuation, ordered tokens (no filler removal)',
  normalizeForDuplicateCheck('Yeah, Sure, 60!'),
  ['yeah', 'sure', '60'],
);
check(
  'normalize: no dedup — repeats preserved in order',
  normalizeForDuplicateCheck('60 60 60'),
  ['60', '60', '60'],
);
check(
  'stripLeadingTrailingFillers: strips both edges, preserves middle order',
  stripLeadingTrailingFillers(['yeah', 'sure', '60', 'um']),
  ['60'],
);
check(
  'stripLeadingTrailingFillers: does not touch "so"/"right"/"like" (removed from filler list)',
  stripLeadingTrailingFillers(['so', '60']),
  ['so', '60'],
);
check(
  'stripLeadingTrailingFillers: all-filler input strips to empty',
  stripLeadingTrailingFillers(['um', 'uh', 'yeah']),
  [],
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll stage2-cancel-policy checks passed.');
