/**
 * Structural ship-gate test for tutor_handwrite after the scribble +
 * handwrite redesign (2026-05-13).
 *
 * Verifies:
 *   1. mapFunctionCallToCommand returns a pure text-only handwrite
 *      command — no near / position / margin fields, even when a
 *      stale brain emits them.
 *   2. buildManifestForCommand still registers the handwrite as a
 *      scribbleable feature so the brain can address it on the next
 *      turn (boardSnapshot continuity).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-handwrite-roundtrip.ts
 */

import { mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';
import { buildManifestForCommand } from '../src/lib/tutor/diagrams/manifests';
import type { WhiteboardCommand } from '@core/knowledge/types';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
    if (!cond) failures.push({ msg });
}

function eq<T>(actual: T, expected: T, msg: string): void {
    if (actual !== expected) failures.push({ msg: `${msg} — expected ${String(expected)}, got ${String(actual)}` });
}

// ── 1. mapFunctionCallToCommand: text-only ────────────────────

const basic = mapFunctionCallToCommand('tutor_handwrite', { text: 'Legislative makes laws' });
expect(basic !== null, 'basic text-only handwrite should map');
if (basic && basic.action === 'handwrite') {
    eq(basic.text, 'Legislative makes laws', 'basic.text');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCmd = basic as any;
    expect(!('near' in anyCmd), 'basic.near should not exist');
    expect(!('position' in anyCmd), 'basic.position should not exist');
    expect(!('margin' in anyCmd), 'basic.margin should not exist');
}

// (b) Stale brain emitting legacy fields — silently stripped.
const stale = mapFunctionCallToCommand('tutor_handwrite', {
    text: 'note',
    near: 'point a',
    position: 'right',
    margin: 'top',
});
expect(stale !== null, 'stale handwrite still maps');
if (stale && stale.action === 'handwrite') {
    eq(stale.text, 'note', 'stale.text');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCmd = stale as any;
    expect(!('near' in anyCmd), 'stale.near silently dropped');
    expect(!('position' in anyCmd), 'stale.position silently dropped');
    expect(!('margin' in anyCmd), 'stale.margin silently dropped');
}

// (c) Color preserved.
const colored = mapFunctionCallToCommand('tutor_handwrite', { text: 'x', color: '#22c55e' });
if (colored && colored.action === 'handwrite') {
    eq(colored.color, '#22c55e', 'color preserved');
}

// (d) Empty text → null.
const empty = mapFunctionCallToCommand('tutor_handwrite', { text: '   ' });
expect(empty === null, 'empty text returns null');

// ── 2. buildManifestForCommand: feature still registered ──────

const cmd: WhiteboardCommand = {
    action: 'handwrite',
    text: 'key idea',
} as WhiteboardCommand;
const manifest = buildManifestForCommand(cmd);
expect(manifest !== null, 'manifest is not null');
expect(Array.isArray(manifest) && manifest.length === 1, 'manifest has exactly 1 feature');
if (manifest && manifest[0]) {
    eq(manifest[0].name, 'handwrite', 'feature.name');
    eq(manifest[0].kind, 'label', 'feature.kind');
    expect(!!manifest[0].scribbleable, 'feature scribbleable');
    const labels = manifest[0].labels ?? [];
    expect(labels.includes('handwrite'), 'labels include "handwrite"');
    expect(labels.includes('the note'), 'labels include "the note"');
    expect(labels.includes('key idea'), 'labels include the text');
}

// ── Report ──

if (failures.length === 0) {
    console.log('✓ tutor_handwrite roundtrip (text-only): mapping + manifest pass.');
    process.exit(0);
} else {
    console.error(`✗ ${failures.length} failure(s):`);
    for (const f of failures) console.error(`  - ${f.msg}`);
    process.exit(1);
}
