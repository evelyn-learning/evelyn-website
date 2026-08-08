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
 * Run: npx tsx scripts/test-stage2-cancel.ts
 */
import {
  decideStage2CancelAction,
  decideStage2CancelPolicy,
  isDuplicateTranscript,
  normalizeForDuplicateCheck,
} from '../src/lib/tutor/voice/stage2-cancel-policy';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
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
  'policy: speaking, "60 60" vs "60", verdict new_turn → eager (state gates first, no duplicate logic applied)',
  decideStage2CancelPolicy({ state: 'speaking', verdict: 'new_turn', newTranscript: '60 60', originalTranscript: '60' }),
  'eager',
);

// ── isDuplicateTranscript + normalizeForDuplicateCheck: normalization edges ─

check('duplicate: exact match', isDuplicateTranscript('60', '60'), true);
check('duplicate: word-multiset repeat "60 60" vs "60"', isDuplicateTranscript('60 60', '60'), true);
check('duplicate: filler-padded "yeah 60" vs "60"', isDuplicateTranscript('yeah 60', '60'), true);
check('duplicate: multi-filler "yeah, sure 60" vs "60"', isDuplicateTranscript('yeah, sure 60', '60'), true);
check('duplicate: case-insensitive "SIXTY" vs "sixty"', isDuplicateTranscript('SIXTY', 'sixty'), true);
check('duplicate: trailing punctuation "60?" vs "60"', isDuplicateTranscript('60?', '60'), true);
check('duplicate: um/uh stripped "Um, sixty." vs "sixty"', isDuplicateTranscript('Um, sixty.', 'sixty'), true);
check('duplicate: extra substantive word is NOT a duplicate', isDuplicateTranscript('60 and then what', '60'), false);
check('duplicate: different number is NOT a duplicate', isDuplicateTranscript('61', '60'), false);
check('duplicate: pure filler vs substantive is NOT a duplicate', isDuplicateTranscript('um', '60'), false);
check('duplicate: both pure filler is NOT a duplicate (nothing to compare)', isDuplicateTranscript('um', 'uh'), false);
check('duplicate: multi-word exact match, different order still matches (set-based)', isDuplicateTranscript('the derivative', 'derivative the'), true);
check('duplicate: subset (fewer words than original) is NOT a duplicate', isDuplicateTranscript('60', '60 and then what'), false);

check(
  'normalize: strips fillers + punctuation + case',
  [...normalizeForDuplicateCheck('Yeah, Sure, 60!')].sort().join(','),
  '60',
);
check(
  'normalize: collapses repeats into a set',
  normalizeForDuplicateCheck('60 60 60').size,
  1,
);
check(
  'normalize: pure filler normalizes to empty set',
  normalizeForDuplicateCheck('um uh yeah').size,
  0,
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll stage2-cancel-policy checks passed.');
