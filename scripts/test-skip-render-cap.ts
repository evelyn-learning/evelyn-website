/**
 * Standalone unit test for the Skip-turn render cap in
 * src/lib/tutor/engine/turn-pacing.ts.
 *
 * Run with:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/test-skip-render-cap.ts
 *
 * Or via npm script:
 *   npm run test:skip-cap
 *
 * No test framework — imports the pure transform + helpers, feeds them
 * synthetic BrainStreamEvent sequences, asserts via node:assert. Exits
 * non-zero on any failure so it's CI-friendly.
 *
 * Why standalone: matches the existing test:gaps pattern; the project has
 * no jest/vitest. turn-pacing.ts deliberately has no runtime deps (only a
 * type-only import of BrainStreamEvent), so this test loads neither the
 * Anthropic SDK nor an API key.
 *
 * What it proves: the cap mechanism is deterministic regardless of brain
 * behavior — a Skip turn that emits N visual renders only ever forwards
 * SKIP_TURN_RENDER_CAP of them to the client; the model-side contract is
 * untouched (we operate purely on the yielded event stream). This is the
 * piece a live session can't reliably demonstrate, because the over-render
 * it guards against is intermittent.
 */

import { strict as assert } from 'node:assert';
import {
  applyTurnPacing,
  isSkipTurn,
  isVisualTool,
  SKIP_TURN_RENDER_CAP,
} from '../apps/marketing/src/lib/tutor/engine/turn-pacing';
import type { BrainStreamEvent } from '../apps/marketing/src/lib/tutor/voice/claude-brain';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`      ${(err as Error).message}`);
    failed++;
  }
}

// ── helpers ──────────────────────────────────────────────────────────
async function* fromArray(events: BrainStreamEvent[]): AsyncGenerator<BrainStreamEvent> {
  for (const ev of events) yield ev;
}

async function collect(gen: AsyncIterable<BrainStreamEvent>): Promise<BrainStreamEvent[]> {
  const out: BrainStreamEvent[] = [];
  for await (const ev of gen) out.push(ev);
  return out;
}

const toolCall = (name: string, id = name): BrainStreamEvent => ({
  type: 'tool-call',
  id,
  name,
  args: {},
});
const sentence = (text: string, pauseAfter?: 'small' | 'medium' | 'large'): BrainStreamEvent =>
  ({ type: 'sentence', text, ...(pauseAfter ? { pauseAfter } : {}) });

const visualsIn = (events: BrainStreamEvent[]): string[] =>
  events.filter((e) => e.type === 'tool-call' && isVisualTool(e.name)).map((e) => (e as { name: string }).name);

// The live (deterministic-path) marker, verbatim shape from the rewrite
// in VoiceTutorRealtime, and the raw fallback marker.
const LIVE_MARKER =
  'Let\'s skip this and move on. [Lesson auto-advanced: the student clicked Skip-ahead and the lesson pointer has ALREADY moved to segment "concept-toolkit" (a concept segment). Introduce THAT segment now...]';
const RAW_MARKER =
  'Let\'s skip this and move on. [Skip-button-clicked: advance ONE segment by calling advance_lesson({to: \'next\'}) ...]';

// ── tests ────────────────────────────────────────────────────────────
async function run() {
  console.log('\nSkip-turn render cap — turn-pacing.ts\n');

  // --- isSkipTurn detection ---
  await test('isSkipTurn: live [Lesson auto-advanced ... clicked Skip-ahead] marker → true', () => {
    assert.equal(isSkipTurn(LIVE_MARKER), true);
  });
  await test('isSkipTurn: raw [Skip-button-clicked: ...] fallback marker → true', () => {
    assert.equal(isSkipTurn(RAW_MARKER), true);
  });
  await test('isSkipTurn: ordinary student answer → false', () => {
    assert.equal(isSkipTurn('xx1 + yy1 = r squared?'), false);
  });
  await test('isSkipTurn: null/undefined/empty → false', () => {
    assert.equal(isSkipTurn(null), false);
    assert.equal(isSkipTurn(undefined), false);
    assert.equal(isSkipTurn(''), false);
  });

  // --- isVisualTool classification ---
  await test('isVisualTool: show_* + scribble/highlight/annotate/draw_vector are visual', () => {
    for (const n of ['show_equation', 'show_diagram', 'show_problem', 'tutor_scribble', 'highlight', 'annotate', 'draw_vector']) {
      assert.equal(isVisualTool(n), true, `${n} should be visual`);
    }
  });
  await test('isVisualTool: engine/zero-render tools are NOT visual', () => {
    for (const n of ['advance_lesson', 'mark_segment_complete', 'new_page', 'generate_problem', 'flag_prerequisite_gap', 'add_topic_note', 'list_whiteboard_features']) {
      assert.equal(isVisualTool(n), false, `${n} should NOT be visual`);
    }
  });

  // --- the core cap: the formula-sheet dump scenario ---
  await test(`Skip turn: 6 show_* renders → only ${SKIP_TURN_RENDER_CAP} forwarded`, async () => {
    const dump: BrainStreamEvent[] = [
      sentence('Moving on — here are the key formulas.'),
      toolCall('new_page'),                 // not visual → always passes
      toolCall('show_equation', 'eq1'),
      toolCall('show_equation', 'eq2'),
      toolCall('show_equation', 'eq3'),
      toolCall('show_diagram', 'd1'),
      toolCall('show_diagram', 'd2'),
      toolCall('show_diagram', 'd3'),
    ];
    const out = await collect(applyTurnPacing(fromArray(dump), { isSkipTurn: true, scale: 1 }));
    const fwdVisuals = visualsIn(out);
    assert.equal(fwdVisuals.length, SKIP_TURN_RENDER_CAP, `expected ${SKIP_TURN_RENDER_CAP} visuals forwarded, got ${fwdVisuals.length}: ${fwdVisuals.join(',')}`);
    // The first two visuals (eq1, eq2) survive; the rest are dropped.
    assert.deepEqual(fwdVisuals, ['show_equation', 'show_equation']);
    // new_page (non-visual) still passes through.
    assert.ok(out.some((e) => e.type === 'tool-call' && e.name === 'new_page'), 'new_page should pass through');
    // The opening sentence still passes through.
    assert.ok(out.some((e) => e.type === 'sentence'), 'sentence should pass through');
  });

  await test('Skip turn: each forwarded visual still gets its post-tool pause; dropped ones do NOT', async () => {
    const dump: BrainStreamEvent[] = [
      toolCall('show_equation', 'eq1'),
      toolCall('show_equation', 'eq2'),
      toolCall('show_equation', 'eq3'),
      toolCall('show_equation', 'eq4'),
    ];
    const out = await collect(applyTurnPacing(fromArray(dump), { isSkipTurn: true, scale: 1 }));
    const pauses = out.filter((e) => e.type === 'pause');
    // 4 emitted, cap 2 → 2 forwarded visuals → exactly 2 post-tool pauses.
    assert.equal(pauses.length, SKIP_TURN_RENDER_CAP, `expected ${SKIP_TURN_RENDER_CAP} pauses, got ${pauses.length}`);
    assert.ok(pauses.every((p) => (p as { reason?: string }).reason === 'post-show_equation'));
  });

  // --- non-skip turns are untouched (no regression) ---
  await test('Non-skip turn: all 6 visual renders forwarded (cap does not apply)', async () => {
    const events: BrainStreamEvent[] = [
      toolCall('show_equation', 'eq1'),
      toolCall('show_equation', 'eq2'),
      toolCall('show_equation', 'eq3'),
      toolCall('show_diagram', 'd1'),
      toolCall('show_diagram', 'd2'),
      toolCall('show_diagram', 'd3'),
    ];
    const out = await collect(applyTurnPacing(fromArray(events), { isSkipTurn: false, scale: 1 }));
    assert.equal(visualsIn(out).length, 6);
  });

  // --- non-visual tools are never capped, even on a Skip turn ---
  await test('Skip turn: non-visual tools (advance_lesson, generate_problem) never capped', async () => {
    const events: BrainStreamEvent[] = [
      toolCall('advance_lesson', 'a1'),
      toolCall('mark_segment_complete', 'm1'),
      toolCall('generate_problem', 'g1'),
      toolCall('new_page', 'n1'),
      toolCall('flag_prerequisite_gap', 'f1'),
    ];
    const out = await collect(applyTurnPacing(fromArray(events), { isSkipTurn: true, scale: 1 }));
    const toolNames = out.filter((e) => e.type === 'tool-call').map((e) => (e as { name: string }).name);
    assert.deepEqual(toolNames, ['advance_lesson', 'mark_segment_complete', 'generate_problem', 'new_page', 'flag_prerequisite_gap']);
  });

  // --- a compliant Skip (≤ cap visuals) passes everything ---
  await test('Skip turn: a single anchor visual passes (compliant Skip, cap not tripped)', async () => {
    const events: BrainStreamEvent[] = [
      sentence('Alright, moving on.'),
      toolCall('advance_lesson', 'a1'),
      toolCall('show_diagram', 'd1'),
    ];
    const out = await collect(applyTurnPacing(fromArray(events), { isSkipTurn: true, scale: 1 }));
    assert.equal(visualsIn(out).length, 1);
    assert.ok(out.some((e) => e.type === 'tool-call' && e.name === 'advance_lesson'));
  });

  // --- pause scaling preserved (grade band) ---
  await test('Pause scaling: scale multiplier applied to post-tool + sentence pauses', async () => {
    const events: BrainStreamEvent[] = [
      sentence('Dense step.', 'large'),
      toolCall('show_equation', 'eq1'),
    ];
    const out = await collect(applyTurnPacing(fromArray(events), { isSkipTurn: false, scale: 2 }));
    const sentencePause = out.find((e) => e.type === 'pause' && (e as { reason?: string }).reason === 'sentence:large');
    const toolPause = out.find((e) => e.type === 'pause' && (e as { reason?: string }).reason === 'post-show_equation');
    assert.ok(sentencePause && (sentencePause as { ms: number }).ms === 4000, 'large pause 2000 * scale 2 = 4000');
    assert.ok(toolPause && (toolPause as { ms: number }).ms === 2200, 'post-tool 1100 * scale 2 = 2200');
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

run();
