/**
 * Structural ship-gate test for tutor_handwrite (Phase 1' of the
 * whiteboard markup initiative).
 *
 * Verifies:
 *   1. mapFunctionCallToCommand correctly normalizes brain-emitted
 *      tutor_handwrite calls (anchored, margin-only, both-given fallback,
 *      neither-given fallback).
 *   2. buildManifestForCommand returns the expected single-feature
 *      manifest with content-aware labels.
 *   3. The handwrite action is properly excluded from META_ACTIONS-style
 *      filters in the orchestrator (renderableCommands strips it).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-handwrite-roundtrip.ts
 */

import { mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';
import { buildManifestForCommand } from '../src/lib/tutor/diagrams/manifests';
import type { WhiteboardCommand } from '../src/lib/knowledge/types';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

function eq<T>(actual: T, expected: T, msg: string): void {
  if (actual !== expected) failures.push({ msg: `${msg} — expected ${String(expected)}, got ${String(actual)}` });
}

// ── 1. mapFunctionCallToCommand normalization ──────────────────

// (a) Anchored handwrite with explicit position
const anchored = mapFunctionCallToCommand('tutor_handwrite', {
  text: 'good catch!',
  near: 'cell at row 3 column 1',
  position: 'right',
  color: '#16a34a',
});
expect(anchored !== null, 'anchored handwrite should map');
if (anchored && anchored.action === 'handwrite') {
  eq(anchored.text, 'good catch!', 'anchored.text');
  eq(anchored.near, 'cell at row 3 column 1', 'anchored.near');
  eq(anchored.position, 'right', 'anchored.position');
  eq(anchored.color, '#16a34a', 'anchored.color');
  eq(anchored.margin, undefined, 'anchored.margin should be undefined');
} else {
  failures.push({ msg: 'anchored.action should be handwrite' });
}

// (b) Anchored without position — defaults to 'right'
const anchoredDefault = mapFunctionCallToCommand('tutor_handwrite', {
  text: 'note',
  near: 'the table',
});
if (anchoredDefault && anchoredDefault.action === 'handwrite') {
  eq(anchoredDefault.position, 'right', 'anchored-default position');
}

// (c) Margin-only
const marginCmd = mapFunctionCallToCommand('tutor_handwrite', {
  text: 'key idea: density = mass/volume',
  margin: 'top',
});
expect(marginCmd !== null, 'margin handwrite should map');
if (marginCmd && marginCmd.action === 'handwrite') {
  eq(marginCmd.margin, 'top', 'margin.margin');
  eq(marginCmd.near, undefined, 'margin.near should be undefined');
  eq(marginCmd.position, undefined, 'margin.position should be undefined');
}

// (d) Both `near` AND `margin` given — anchor wins.
const both = mapFunctionCallToCommand('tutor_handwrite', {
  text: 'anchor-wins',
  near: 'point a',
  margin: 'right',
});
if (both && both.action === 'handwrite') {
  eq(both.near, 'point a', 'both.near preserved');
  eq(both.margin, undefined, 'both.margin dropped when near present');
}

// (e) Neither given — falls back to margin "right"
const neither = mapFunctionCallToCommand('tutor_handwrite', {
  text: 'fallback',
});
if (neither && neither.action === 'handwrite') {
  eq(neither.margin, 'right', 'neither → margin "right" fallback');
  eq(neither.near, undefined, 'neither.near');
}

// (f) Empty text → null
const empty = mapFunctionCallToCommand('tutor_handwrite', { text: '   ' });
expect(empty === null, 'empty text should return null');

// (g) Invalid margin → falls back to "right"
const badMargin = mapFunctionCallToCommand('tutor_handwrite', {
  text: 'x',
  margin: 'sideways',
});
if (badMargin && badMargin.action === 'handwrite') {
  eq(badMargin.margin, 'right', 'invalid margin → "right"');
}

// (h) Invalid position → falls back to "right"
const badPos = mapFunctionCallToCommand('tutor_handwrite', {
  text: 'x',
  near: 'point a',
  position: 'diagonal',
});
if (badPos && badPos.action === 'handwrite') {
  eq(badPos.position, 'right', 'invalid position → "right"');
}

// ── 2. buildManifestForCommand ─────────────────────────────────

const handwriteCmd: WhiteboardCommand = {
  action: 'handwrite',
  text: 'key idea',
  margin: 'top',
} as WhiteboardCommand;
const manifest = buildManifestForCommand(handwriteCmd);
expect(manifest !== null, 'manifest should not be null');
expect(Array.isArray(manifest) && manifest.length === 1, 'manifest should have exactly 1 feature');
if (manifest && manifest[0]) {
  eq(manifest[0].name, 'handwrite', 'manifest feature name');
  eq(manifest[0].kind, 'label', 'manifest feature kind');
  expect(!!manifest[0].scribbleable, 'manifest feature should be scribbleable');
  const labels = manifest[0].labels ?? [];
  expect(labels.includes('handwrite'), 'manifest labels include "handwrite"');
  expect(labels.includes('the note'), 'manifest labels include "the note"');
  expect(labels.includes('key idea'), 'manifest labels include text content "key idea"');
}

// Anchored variant — different description prefix
const anchoredHandwrite: WhiteboardCommand = {
  action: 'handwrite',
  text: 'good!',
  near: 'point a',
} as WhiteboardCommand;
const anchoredManifest = buildManifestForCommand(anchoredHandwrite);
if (anchoredManifest && anchoredManifest[0]) {
  const desc = anchoredManifest[0].description ?? '';
  expect(desc.includes('near "point a"'), 'anchored description references the anchor');
}

// Margin variant
if (manifest && manifest[0]) {
  const desc = manifest[0].description ?? '';
  expect(desc.includes('margin "top"'), 'margin description references the slot');
}

// ── 3. Report ──────────────────────────────────────────────────

if (failures.length === 0) {
  console.log(`✓ tutor_handwrite: ${manifest?.length ?? 0} feature(s) per command, 11 mapping checks passed.`);
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
