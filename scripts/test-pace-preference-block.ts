/**
 * Task W3 probe (extended by W5): prints the `<pace_preference>` block
 * formatPacePreferenceBlock would inject at every reachable paceBias level
 * (-2..+2, clamped range — see VoiceTutorRealtime.tsx stepPaceBias). Confirms:
 *   - bias === 0 renders nothing (block stays omitted on the common case).
 *   - -1 / +1 ("mild") and -2 / +2 ("strong") each render distinct,
 *     directive/checkable guidance text (the W3 potency rewrite) rather
 *     than the old soft "add more" / "cut more" prose.
 *   - negative bias (-1 / -2) DOES cross-reference "the Absorption rule"
 *     (W5, landed in system-prompt-builder.ts near Precision) — negative
 *     bias should lean on the Absorption rule's pause/recall-back mechanics
 *     rather than re-deriving them.
 *   - positive bias (+1 / +2) and bias === 0 do NOT reference it — the
 *     Absorption rule's extra pausing is a negative-bias-only lean.
 *
 * Not a pass/fail gate script for the block's prose itself, but DOES assert
 * the cross-reference invariant above. Run:
 *   npx tsx scripts/test-pace-preference-block.ts
 */
import { formatPacePreferenceBlock } from '../src/lib/tutor/voice/claude-brain';

const cases: Array<{ label: string; paceBias?: number; paceBiasAppliedSinceTurns?: number }> = [
  { label: 'bias=0 (neutral, block should be empty)', paceBias: 0 },
  { label: 'bias=-1 (Slow down ×1 / mild)', paceBias: -1, paceBiasAppliedSinceTurns: 3 },
  { label: 'bias=-2 (Slow down ×2 / strong)', paceBias: -2, paceBiasAppliedSinceTurns: 0 },
  { label: 'bias=+1 (Speed up ×1 / mild)', paceBias: 1, paceBiasAppliedSinceTurns: 5 },
  { label: 'bias=+2 (Speed up ×2 / strong)', paceBias: 2 },
];

let failed = false;

for (const c of cases) {
  const block = formatPacePreferenceBlock({
    correctStreak: 0,
    incorrectStreak: 0,
    segmentTurns: 0,
    paceBias: c.paceBias,
    paceBiasAppliedSinceTurns: c.paceBiasAppliedSinceTurns,
  });
  console.log(`\n=== ${c.label} ===`);
  console.log(block === '' ? '(empty string — block omitted)' : block);

  if (c.paceBias === 0 && block !== '') {
    console.error('FAIL: bias=0 should omit the block entirely');
    failed = true;
  }
  if (c.paceBias !== 0 && block === '') {
    console.error(`FAIL: bias=${c.paceBias} should render a block`);
    failed = true;
  }
  const referencesAbsorption = /absorption rule/i.test(block);
  const isNegative = typeof c.paceBias === 'number' && c.paceBias < 0;
  if (isNegative && !referencesAbsorption) {
    console.error(`FAIL: bias=${c.paceBias} (negative) should cross-reference "the Absorption rule" (W5)`);
    failed = true;
  }
  if (!isNegative && referencesAbsorption) {
    console.error(`FAIL: bias=${c.paceBias} (non-negative) should NOT reference "the absorption rule" — the cross-reference is a negative-bias-only lean`);
    failed = true;
  }
}

if (failed) {
  console.error('\ntest-pace-preference-block: FAILED');
  process.exit(1);
} else {
  console.log('\ntest-pace-preference-block: all cases OK (block presence + Absorption cross-reference at negative bias only)');
}
