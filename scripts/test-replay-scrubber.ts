/**
 * Regression test for task C1 — replay scrubber handle vs. applied time.
 *
 * Context: ReplayTimeline's handle position (`progressPct = currentTimeMs /
 * totalDurationMs`) and its click handler (`onSeek(pct * totalDurationMs)`)
 * both read the SAME `totalDurationMs` prop, so they can only ever disagree
 * if that shared value itself is invalid. Live reproduction (Playwright,
 * real component + real Tailwind CSS, sequential/rapid/mid-transition/drag/
 * marker/playing-state/resumed-session clicks) found no divergence on
 * healthy session data — the actual gap found was narrower: for a malformed
 * session (NaN `startedAt`/`endedAt`, the same defect class ab39e4a7's
 * "NaN% guard" fixed for markers), `buildCompressedTimeline`'s `totalMs`
 * could come out NaN, and ReplayTimeline's click-handler guard
 * (`totalDurationMs <= 0`) and its render guard (`totalDurationMs > 0`) are
 * NOT logical complements for NaN — both are false, so the click guard let a
 * click through (computing `onSeek(NaN)`) while the render guard froze the
 * handle at 0%.
 *
 * This test locks down the fix: `buildCompressedTimeline`'s `totalMs` must
 * always be a finite, positive number, so every consumer's validity check
 * (whichever comparison operator it happens to use) agrees by construction.
 * It also locks down the pure click<->render position-math invariant that
 * the whole bug report hinges on: pct-to-time (click) and time-to-pct
 * (render) must be exact inverses for any valid totalMs.
 *
 *   npx tsx scripts/test-replay-scrubber.ts
 */
import assert from 'node:assert';
import { buildCompressedTimeline } from '../src/lib/tutor/recordings/compressed-timeline';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}

console.log('buildCompressedTimeline — totalMs invariant');

check('gap-free session (all gaps under the 8s cap): totalMs is finite, positive, and ~= real length', () => {
  const { totalMs } = buildCompressedTimeline([0, 5_000, 10_000, 15_000], 20_000);
  assert.ok(Number.isFinite(totalMs) && totalMs > 0);
  assert.ok(totalMs >= 20_000 && totalMs < 21_000, `totalMs was ${totalMs}`);
});

check('no items at all (fresh/empty session): totalMs floors at MIN_TAIL_MS, never 0/NaN', () => {
  const { totalMs } = buildCompressedTimeline([], 0);
  assert.ok(Number.isFinite(totalMs) && totalMs > 0, `totalMs was ${totalMs}`);
});

check('malformed startedAt (NaN realEndMs, no items): totalMs stays finite and positive', () => {
  // Mirrors a corrupt `startedAt` producing NaN via `new Date(x).getTime()`
  // upstream in ReplayPlayer — the exact defect class ab39e4a7 patched for
  // markers ("NaN% guard"). Before this fix, totalMs itself went NaN here.
  const { totalMs } = buildCompressedTimeline([], NaN);
  assert.ok(Number.isFinite(totalMs) && totalMs > 0, `totalMs was ${totalMs}`);
});

check('malformed realEndMs WITH real items: totalMs stays finite and positive', () => {
  const { totalMs } = buildCompressedTimeline([0, 5_000, 10_000], NaN);
  assert.ok(Number.isFinite(totalMs) && totalMs > 0, `totalMs was ${totalMs}`);
});

check('resumed session (large gap, duration spans only the latest attempt): totalMs valid, gap compressed', () => {
  // 5 items in attempt 1 (0-40s), a ~9min real gap, then items resuming at
  // 600-780s — but `duration` (realEndMs) only covers the latest attempt.
  const offsets = [0, 10_000, 20_000, 30_000, 40_000, 600_000, 610_000, 620_000, 630_000, 780_000];
  const { totalMs, toCompressed } = buildCompressedTimeline(offsets, 240_000);
  assert.ok(Number.isFinite(totalMs) && totalMs > 0);
  // The 9-minute gap must have compressed down to at most the 8s cap, so the
  // WHOLE compressed timeline is nowhere near the 780s real span.
  assert.ok(totalMs < 100_000, `expected the gap to compress away, got totalMs=${totalMs}`);
  // Every real offset maps within [0, totalMs] — nothing overflows the bar.
  for (const o of offsets) {
    const c = toCompressed(o);
    assert.ok(c >= 0 && c <= totalMs, `offset ${o} mapped to ${c}, outside [0, ${totalMs}]`);
  }
});

console.log('\nclick <-> render position-math invariant (ReplayTimeline\'s own formulas)');

// Mirrors ReplayTimeline.tsx exactly:
//   render:      progressPct = totalDurationMs > 0 ? (currentTimeMs / totalDurationMs) * 100 : 0
//   click:       onSeek(pct * totalDurationMs)   where pct = clickFraction in [0,1]
// For any valid totalDurationMs, clicking at fraction f must render the
// handle back at (f * 100)% — i.e. render(click(f)) === f, exactly.
function renderPct(currentTimeMs: number, totalDurationMs: number): number {
  return totalDurationMs > 0 ? (currentTimeMs / totalDurationMs) * 100 : 0;
}
function clickTimeMs(fraction: number, totalDurationMs: number): number {
  return fraction * totalDurationMs;
}

check('click-then-render round-trips exactly for a range of fractions and totals', () => {
  const totals = [3_000, 40_000, 141_000, 1_800_000];
  const fractions = [0, 0.01, 0.1, 0.3, 0.5, 0.7, 0.99, 1];
  for (const total of totals) {
    for (const f of fractions) {
      const seeked = clickTimeMs(f, total);
      const pct = renderPct(seeked, total);
      assert.ok(
        Math.abs(pct - f * 100) < 1e-9,
        `total=${total} fraction=${f}: click->render gave ${pct}%, expected ${f * 100}%`
      );
    }
  }
});

check('totalDurationMs from buildCompressedTimeline never breaks the render/click guard symmetry', () => {
  // The bug this test guards against: `totalDurationMs <= 0` (old click
  // guard) and `totalDurationMs > 0` (render guard) disagree ONLY for NaN.
  // With totalMs now guaranteed finite+positive, both guards agree for every
  // session shape we can construct, healthy or degenerate.
  const scenarios: [number[], number][] = [
    [[], 0],
    [[], NaN],
    [[0, 1000], NaN],
    [[0, 12_000, 24_000], 30_000],
  ];
  for (const [offsets, realEndMs] of scenarios) {
    const { totalMs } = buildCompressedTimeline(offsets, realEndMs);
    const renderSaysValid = totalMs > 0;
    const clickGuardOld = !(totalMs <= 0); // old (buggy) click guard, negated to "is valid"
    const clickGuardNew = totalMs > 0; // current click guard (same expression as render)
    assert.strictEqual(clickGuardNew, renderSaysValid);
    // Documents why the OLD guard was fine here too — only once totalMs
    // could no longer be NaN. Left as a sanity check, not a regression lock
    // on the old code (which no longer exists).
    assert.strictEqual(clickGuardOld, renderSaysValid);
  }
});

console.log(`\n${passed} checks passed`);
