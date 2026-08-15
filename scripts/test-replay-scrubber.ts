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
import { buildCompressedTimeline } from '../apps/marketing/src/lib/tutor/recordings/compressed-timeline';
import { alignEvenBytes, findSegmentAt, frontierSec, type SegmentSpan } from '../apps/marketing/src/lib/tutor/recordings/audio-segments';

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

console.log('\nbuildCompressedTimeline — hasAudio option (task E2)');

check('single-attempt + hasAudio:true: NO gap cap — identity mapping, no re-seeks', () => {
  // A 60s silence (10_000 -> 70_000) that would normally collapse to the 8s
  // GAP_CAP_MS. With audio present and no resume, the honest axis is real
  // time: chat and audio share one axis, so nothing should compress.
  const offsets = [0, 5_000, 10_000, 70_000, 75_000];
  const realEndMs = 78_000; // 3s tail past the last item == MIN_TAIL_MS
  const { totalMs, toCompressed, audioReseekEndsMs } = buildCompressedTimeline(offsets, realEndMs, { hasAudio: true });
  assert.strictEqual(totalMs, realEndMs, `expected identity total, got ${totalMs}`);
  assert.strictEqual(audioReseekEndsMs.length, 0, 'no capped gaps means no re-seek points');
  for (const o of offsets) {
    assert.strictEqual(toCompressed(o), o, `toCompressed(${o}) should be identity, got ${toCompressed(o)}`);
  }
});

check('single-attempt + hasAudio:false (or omitted): today\'s capped behavior is unchanged', () => {
  // Same offsets/realEndMs as above, but audio-less (or opts omitted) — the
  // 60s silence must still compress down to the 8s cap, same as before E2.
  const offsets = [0, 5_000, 10_000, 70_000, 75_000];
  const realEndMs = 78_000;
  const withoutOpts = buildCompressedTimeline(offsets, realEndMs);
  const explicitFalse = buildCompressedTimeline(offsets, realEndMs, { hasAudio: false });
  for (const { totalMs, toCompressed, audioReseekEndsMs } of [withoutOpts, explicitFalse]) {
    assert.ok(totalMs < realEndMs, `expected the 60s gap to compress away, got totalMs=${totalMs} (realEndMs=${realEndMs})`);
    assert.ok(totalMs < 30_000, `expected a small compressed total, got ${totalMs}`);
    assert.strictEqual(audioReseekEndsMs.length, 1, 'the one capped gap needs exactly one re-seek point');
    for (const o of offsets) {
      const c = toCompressed(o);
      assert.ok(c >= 0 && c <= totalMs, `offset ${o} mapped to ${c}, outside [0, ${totalMs}]`);
    }
  }
});

check('resumed session + hasAudio:true: unchanged from today\'s resumed (capped) behavior', () => {
  // Same resumed-shape offsets as the "resumed session" totalMs test above.
  // The structural resumed-replay fix is out of scope this round (global
  // constraint) — hasAudio must NOT alter resumed-session compression at all.
  const offsets = [0, 10_000, 20_000, 30_000, 40_000, 600_000, 610_000, 620_000, 630_000, 780_000];
  const realEndMs = 240_000;
  const today = buildCompressedTimeline(offsets, realEndMs);
  const withHasAudio = buildCompressedTimeline(offsets, realEndMs, { hasAudio: true });
  assert.strictEqual(withHasAudio.totalMs, today.totalMs, 'hasAudio must not change resumed totalMs');
  assert.deepStrictEqual(withHasAudio.audioReseekEndsMs, today.audioReseekEndsMs, 'hasAudio must not change resumed re-seek points');
  for (const o of offsets) {
    assert.strictEqual(withHasAudio.toCompressed(o), today.toCompressed(o), `toCompressed(${o}) diverged for resumed+hasAudio`);
  }
  // And still compressed (this is the resumed-session behavior, unchanged).
  assert.ok(withHasAudio.totalMs < 100_000, `expected the resumed gap to still compress away, got ${withHasAudio.totalMs}`);
});

console.log('\nclick <-> render position-math invariant (ReplayTimeline\'s own formulas)');

/**
 * WARNING: These tests re-implement local copies of the formulas/guards from
 * src/app/admin/tutor-sessions/components/ReplayTimeline.tsx rather than
 * importing them directly. This is necessary because ReplayTimeline.tsx
 * transitively imports WhiteboardCanvas → KaTeX CSS, which breaks tsx/ts-node
 * parsing (SyntaxError on `katex.min.css`).
 *
 * LIMITATION: These tests do NOT regression-lock the shipped component's
 * behavior by themselves — they assert the mirrored math is self-consistent,
 * but drift between the mirror and ReplayTimeline.tsx will NOT be detected
 * automatically. If ReplayTimeline's guards or position formulas change,
 * update the mirror below to match; the `buildCompressedTimeline` tests do
 * lock down that function at the source (importable without CSS).
 *
 * Task E1 (pointer-capture drag) moved this guard/formula pair out of the
 * old onClick/onMouseMove pair and into a single `seekFromClientX(clientX)`
 * helper shared by onPointerDown/onPointerMove — the guard
 * (`!barRef.current || !(totalDurationMs > 0)`) and the position formula
 * (`pct = clamp((clientX - rect.left) / rect.width, 0, 1); onSeek(pct *
 * totalDurationMs)`) are unchanged text, just called from pointer handlers
 * instead of duplicated across two mouse handlers. The mirror below still
 * matches byte-for-byte; nothing here needed to change.
 */

// Mirrors ReplayTimeline.tsx's seekFromClientX + render exactly:
//   render:      progressPct = totalDurationMs > 0 ? (currentTimeMs / totalDurationMs) * 100 : 0
//   seek:        onSeek(pct * totalDurationMs)   where pct = clickFraction in [0,1]
//                (called from onPointerDown and onPointerMove-while-dragging)
// For any valid totalDurationMs, seeking at fraction f must render the
// handle back at (f * 100)% — i.e. render(seek(f)) === f, exactly.
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

console.log('\naudio-segments — alignEvenBytes 2-byte carry (task E3)');

check('even-length chunk with no prior carry passes through untouched', () => {
  const { data, carry } = alignEvenBytes(null, new Uint8Array([1, 2, 3, 4]));
  assert.deepStrictEqual([...data], [1, 2, 3, 4]);
  assert.strictEqual(carry, null);
});

check('odd-length chunk peels off exactly one trailing carry byte', () => {
  const { data, carry } = alignEvenBytes(null, new Uint8Array([1, 2, 3]));
  assert.deepStrictEqual([...data], [1, 2]);
  assert.strictEqual(carry, 3);
});

check('a prior carry is prepended before re-checking alignment', () => {
  // carry=9, incoming odd [1,2,3] → merged [9,1,2,3] is even → no new carry.
  const { data, carry } = alignEvenBytes(9, new Uint8Array([1, 2, 3]));
  assert.deepStrictEqual([...data], [9, 1, 2, 3]);
  assert.strictEqual(carry, null);
});

check('carry + even incoming becomes odd → one new carry peeled', () => {
  // carry=9, incoming even [1,2] → merged [9,1,2] odd → data [9,1], carry 2.
  const { data, carry } = alignEvenBytes(9, new Uint8Array([1, 2]));
  assert.deepStrictEqual([...data], [9, 1]);
  assert.strictEqual(carry, 2);
});

check('lossless invariant: concat(all data) + final carry == original stream, for adversarial odd splits', () => {
  // A 25-byte stream (odd total) split at deliberately awful boundaries.
  const original = Array.from({ length: 25 }, (_, i) => i + 1);
  const splits = [[1, 2, 3], [4], [5, 6], [7, 8, 9, 10, 11], [12], [13, 14, 15, 16], [17], [18, 19], [20, 21, 22, 23, 24, 25]];
  let carry: number | null = null;
  const out: number[] = [];
  for (const chunk of splits) {
    const r = alignEvenBytes(carry, new Uint8Array(chunk));
    assert.strictEqual(r.data.length % 2, 0, 'every emitted run must be even-length (safe to Int16-cast)');
    out.push(...r.data);
    carry = r.carry;
  }
  if (carry !== null) out.push(carry);
  assert.deepStrictEqual(out, original, 'no byte may be lost or duplicated across odd-boundary splits');
});

console.log('\naudio-segments — findSegmentAt / frontierSec (task E3)');

// Three contiguous 20s segments: [0,20), [20,40), [40,55).
const segs: SegmentSpan[] = [
  { startSec: 0, durationSec: 20 },
  { startSec: 20, durationSec: 20 },
  { startSec: 40, durationSec: 15 },
];

check('finds the covering segment and the intra-segment offset', () => {
  assert.deepStrictEqual(findSegmentAt(segs, 0), { index: 0, offsetSec: 0 });
  assert.deepStrictEqual(findSegmentAt(segs, 19.5), { index: 0, offsetSec: 19.5 });
  assert.deepStrictEqual(findSegmentAt(segs, 20), { index: 1, offsetSec: 0 }); // boundary belongs to the LATER segment
  assert.deepStrictEqual(findSegmentAt(segs, 45), { index: 2, offsetSec: 5 });
});

check('negative time and past-frontier time both return null (track silent / past end)', () => {
  assert.strictEqual(findSegmentAt(segs, -1), null);
  assert.strictEqual(findSegmentAt(segs, 55), null); // exactly at the frontier is past-end
  assert.strictEqual(findSegmentAt(segs, 999), null);
  assert.strictEqual(findSegmentAt([], 0), null); // no segments downloaded yet
});

check('frontierSec is the end of the last segment (0 when empty)', () => {
  assert.strictEqual(frontierSec(segs), 55);
  assert.strictEqual(frontierSec([]), 0);
  assert.strictEqual(frontierSec([{ startSec: 0, durationSec: 20 }]), 20);
});

console.log(`\n${passed} checks passed`);
