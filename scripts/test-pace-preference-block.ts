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
 * the cross-reference invariant above.
 *
 * Task Y5 extension: also asserts the -1-default derivation seam
 * (resolvePaceBiasOnLoad, pace-preference.ts) — a fresh session (no prior
 * blob / no paceBias field) resolves to -1, while ANY explicit numeric
 * paceBias in a prior blob — including 0 — wins over that default. Confirms
 * bias=-1 (the new default) renders the same "mild"/negative pace_preference
 * guidance as any other -1, i.e. the new default composes cleanly with the
 * W3 potency tiers with no special-casing needed.
 *
 * Run:
 *   npx tsx scripts/test-pace-preference-block.ts
 */
import { formatPacePreferenceBlock } from '../src/lib/tutor/voice/claude-brain';
import { DEFAULT_PACE_BIAS, resolvePaceBiasOnLoad } from '../src/lib/tutor/voice/pace-preference';

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

// Task Y5: -1-default derivation seam (resolvePaceBiasOnLoad).
console.log('\n--- Task Y5: resolvePaceBiasOnLoad derivation ---');
const derivationCases: Array<{ label: string; prior: { paceBias?: number } | null | undefined; expected: number }> = [
  { label: 'no prior blob at all (brand-new plan)', prior: null, expected: -1 },
  { label: 'prior blob present, paceBias field absent', prior: {}, expected: -1 },
  { label: 'prior explicit paceBias=0 ("normal", explicitly chosen) wins over -1 default', prior: { paceBias: 0 }, expected: 0 },
  { label: 'prior explicit paceBias=1 wins', prior: { paceBias: 1 }, expected: 1 },
  { label: 'prior explicit paceBias=-2 wins', prior: { paceBias: -2 }, expected: -2 },
  { label: 'prior paceBias out of range clamps to ±2', prior: { paceBias: 5 }, expected: 2 },
];
if (DEFAULT_PACE_BIAS !== -1) {
  console.error(`FAIL: DEFAULT_PACE_BIAS should be -1 per the Y5 product decision, got ${DEFAULT_PACE_BIAS}`);
  failed = true;
}
for (const c of derivationCases) {
  const got = resolvePaceBiasOnLoad(c.prior);
  const ok = got === c.expected;
  console.log(`${ok ? 'OK' : 'FAIL'}: ${c.label} -> ${got} (expected ${c.expected})`);
  if (!ok) failed = true;
}
// The new -1 default must compose with the existing W3 potency tiers with
// no special-casing: bias=-1 (whether it arrived via the new default or an
// explicit student choice) renders the same "mild"/negative guidance as any
// other -1 case above.
const defaultBlock = formatPacePreferenceBlock({ correctStreak: 0, incorrectStreak: 0, segmentTurns: 0, paceBias: DEFAULT_PACE_BIAS });
if (!/mild/i.test(defaultBlock) || !/absorption rule/i.test(defaultBlock)) {
  console.error('FAIL: the -1 default should render the mild/negative pace_preference guidance (same as any explicit -1)');
  failed = true;
} else {
  console.log('OK: -1 default composes with W3 potency text (mild tier) + Absorption cross-reference');
}

if (failed) {
  console.error('\ntest-pace-preference-block: FAILED');
  process.exit(1);
} else {
  console.log('\ntest-pace-preference-block: all cases OK (block presence + Absorption cross-reference at negative bias only; Y5 -1-default derivation seam)');
}
