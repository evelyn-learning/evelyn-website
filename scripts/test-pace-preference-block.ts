/**
 * Task W3 probe: prints the `<pace_preference>` block formatPacePreferenceBlock
 * would inject at every reachable paceBias level (-2..+2, clamped range —
 * see VoiceTutorRealtime.tsx stepPaceBias). Confirms:
 *   - bias === 0 renders nothing (block stays omitted on the common case).
 *   - -1 / +1 ("mild") and -2 / +2 ("strong") each render distinct,
 *     directive/checkable guidance text (the W3 potency rewrite) rather
 *     than the old soft "add more" / "cut more" prose.
 *   - no accidental forward reference to "the absorption rule" (W5 has not
 *     landed as of this write — see task-W3-report.md).
 *
 * Not a pass/fail gate script (no assertions) — a printer for manual/CI-log
 * review, per the W3 brief's "small node probe printing the block at each
 * bias level" instruction. Run: npx tsx scripts/test-pace-preference-block.ts
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
  if (/absorption rule/i.test(block)) {
    console.error('FAIL: guidance references "the absorption rule" — W5 has not landed, this would be a dangling forward reference');
    failed = true;
  }
}

if (failed) {
  console.error('\ntest-pace-preference-block: FAILED');
  process.exit(1);
} else {
  console.log('\ntest-pace-preference-block: all cases OK (block presence + no forward-reference)');
}
