/**
 * Unit test for Task B3 — fail-to-simple opener render fallback (pure
 * helpers) (src/lib/tutor/ai/opener-fallback.ts): shouldEmitOpenerFallback,
 * buildOpenerFallbackCommand.
 * See project_tutor_pedagogy_opener_calibration +
 * .superpowers/sdd/task-B3-brief.md.
 *
 * Run: npx tsx scripts/test-opener-fallback.ts
 * No framework — matches the test:pedagogy-b2/b4/b5/b6 pattern.
 */

import { strict as assert } from 'node:assert';
import {
  shouldEmitOpenerFallback,
  buildOpenerFallbackCommand,
} from '../apps/marketing/src/lib/tutor/ai/opener-fallback';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function main() {
  console.log('shouldEmitOpenerFallback / buildOpenerFallbackCommand — Task B3\n');

  // ── shouldEmitOpenerFallback: truth table ──────────────────────────────
  test('opening + 0 renders -> true', () => {
    assert.equal(
      shouldEmitOpenerFallback({ openingPhase: true, validRendersThisTurn: 0 }),
      true,
    );
  });
  test('opening + 1 render -> false', () => {
    assert.equal(
      shouldEmitOpenerFallback({ openingPhase: true, validRendersThisTurn: 1 }),
      false,
    );
  });
  test('opening + many renders -> false', () => {
    assert.equal(
      shouldEmitOpenerFallback({ openingPhase: true, validRendersThisTurn: 7 }),
      false,
    );
  });
  test('not-opening + 0 renders -> false', () => {
    assert.equal(
      shouldEmitOpenerFallback({ openingPhase: false, validRendersThisTurn: 0 }),
      false,
    );
  });
  test('not-opening + renders -> false', () => {
    assert.equal(
      shouldEmitOpenerFallback({ openingPhase: false, validRendersThisTurn: 3 }),
      false,
    );
  });
  test('negative validRendersThisTurn (defensive) -> false (not === 0)', () => {
    assert.equal(
      shouldEmitOpenerFallback({ openingPhase: true, validRendersThisTurn: -1 }),
      false,
    );
  });
  test('does not mutate its input', () => {
    const input = { openingPhase: true, validRendersThisTurn: 0 };
    const snapshot = { ...input };
    shouldEmitOpenerFallback(input);
    assert.deepEqual(input, snapshot);
  });
  // Resume-duplicate regression (live 2026-07-04): a RELOADED session restores
  // the board from the checkpoint — including the original fallback line — and
  // resume-live re-arms the opener pending flag ('pickup' opener). The pickup
  // turn draws nothing, so without a board-state check the fallback fired a
  // SECOND identical handwrite. A non-blank board must suppress the fallback.
  test('opening + 0 renders + non-empty board -> false (resume duplicate)', () => {
    assert.equal(
      shouldEmitOpenerFallback({ openingPhase: true, validRendersThisTurn: 0, boardItemCount: 3 }),
      false,
    );
  });
  test('opening + 0 renders + explicitly blank board -> true', () => {
    assert.equal(
      shouldEmitOpenerFallback({ openingPhase: true, validRendersThisTurn: 0, boardItemCount: 0 }),
      true,
    );
  });

  // ── buildOpenerFallbackCommand: shape ──────────────────────────────────
  test('with topic: returns a well-formed handwrite command', () => {
    const cmd = buildOpenerFallbackCommand({ topic: 'photosynthesis' });
    assert.equal(cmd.action, 'handwrite');
    assert.equal(typeof (cmd as { text: string }).text, 'string');
    assert.ok((cmd as { text: string }).text.length > 0);
  });
  test('with topic: threads the topic into the text', () => {
    const cmd = buildOpenerFallbackCommand({ topic: 'photosynthesis' });
    assert.ok((cmd as { text: string }).text.includes('photosynthesis'));
  });
  test('with topic: does not use the banned "Today we will learn" banner phrasing', () => {
    const cmd = buildOpenerFallbackCommand({ topic: 'photosynthesis' });
    const text = (cmd as { text: string }).text.toLowerCase();
    assert.ok(!text.includes('today we will learn'));
  });
  test('without opts: sensible default, still a well-formed handwrite command', () => {
    const cmd = buildOpenerFallbackCommand();
    assert.equal(cmd.action, 'handwrite');
    assert.ok((cmd as { text: string }).text.length > 0);
  });
  test('with opts but no topic: same sensible default as no-opts', () => {
    const withNoTopic = buildOpenerFallbackCommand({});
    const withNoOpts = buildOpenerFallbackCommand();
    assert.deepEqual(withNoTopic, withNoOpts);
  });
  test('with whitespace-only topic: treated as absent (default text)', () => {
    const cmd = buildOpenerFallbackCommand({ topic: '   ' });
    const withNoOpts = buildOpenerFallbackCommand();
    assert.deepEqual(cmd, withNoOpts);
  });
  test('deterministic: same input -> byte-identical output', () => {
    const a = buildOpenerFallbackCommand({ topic: 'ratios' });
    const b = buildOpenerFallbackCommand({ topic: 'ratios' });
    assert.deepEqual(a, b);
  });
  test('command has no other action-specific fields beyond action/text/color', () => {
    const cmd = buildOpenerFallbackCommand({ topic: 'gravity' });
    const keys = Object.keys(cmd).sort();
    for (const k of keys) {
      assert.ok(['action', 'text', 'color'].includes(k), `unexpected key: ${k}`);
    }
  });
  test('never returns an empty-string text', () => {
    assert.ok(buildOpenerFallbackCommand({ topic: '' }).action === 'handwrite');
    const cmd = buildOpenerFallbackCommand({ topic: '' }) as { text: string };
    assert.ok(cmd.text.trim().length > 0);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
