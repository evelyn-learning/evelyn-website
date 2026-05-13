/**
 * Tick-render ship-gate for the scribble + handwrite redesign
 * (2026-05-13). Verifies the new tool surface + renderer changes:
 *
 *   1. tutor_scribble maps to a scribble command with the new shape
 *      vocabulary (tick / highlight). Legacy values (circle /
 *      underline / box / arrow) remap to tick. Default is tick.
 *   2. tutor_handwrite maps to a text-only handwrite command — `near`
 *      / `position` / `margin` fields are stripped from the schema
 *      but accepted-and-ignored if a stale brain still emits them.
 *   3. The live WhiteboardCanvas renderer source contains the tick
 *      SVG path generator + the AnnotationStrip component. Old
 *      HandwriteOverlays is gone.
 *   4. The PDF capture source uses the same tick anchor formula
 *      (just inside the feature's right edge, vertically centered,
 *      with bold stroke — sized for visibility, 2026-05-13 tweak).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-tick-render.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
    if (!cond) failures.push({ msg });
}

function eq<T>(actual: T, expected: T, msg: string): void {
    if (actual !== expected) failures.push({ msg: `${msg} — expected ${String(expected)}, got ${String(actual)}` });
}

// ── 1. tutor_scribble surface ──────────────────────────────────

// (a) Default shape is `tick` when omitted.
const defaultShape = mapFunctionCallToCommand('tutor_scribble', { target: 'point A' });
expect(defaultShape !== null, 'default-shape scribble should map');
if (defaultShape && defaultShape.action === 'scribble') {
    eq(defaultShape.shape, 'tick', 'default shape');
}

// (b) Explicit `tick`.
const tickShape = mapFunctionCallToCommand('tutor_scribble', { target: 'point A', shape: 'tick' });
if (tickShape && tickShape.action === 'scribble') {
    eq(tickShape.shape, 'tick', 'explicit tick');
}

// (c) Explicit `highlight` — preserved.
const highlightShape = mapFunctionCallToCommand('tutor_scribble', { target: 'row 1', shape: 'highlight' });
if (highlightShape && highlightShape.action === 'scribble') {
    eq(highlightShape.shape, 'highlight', 'explicit highlight');
}

// (d) Legacy shapes remap to `tick`.
for (const legacy of ['circle', 'underline', 'box', 'arrow']) {
    const cmd = mapFunctionCallToCommand('tutor_scribble', { target: 'x', shape: legacy });
    expect(cmd !== null, `legacy shape "${legacy}" should still map`);
    if (cmd && cmd.action === 'scribble') {
        eq(cmd.shape, 'tick', `legacy "${legacy}" remaps to tick`);
    }
}

// (e) Empty target → null.
const noTarget = mapFunctionCallToCommand('tutor_scribble', { target: '' });
expect(noTarget === null, 'empty target should return null');

// (f) Label preserved.
const withLabel = mapFunctionCallToCommand('tutor_scribble', { target: 'point A', label: 'here' });
if (withLabel && withLabel.action === 'scribble') {
    eq(withLabel.label, 'here', 'label preserved');
}

// ── 2. tutor_handwrite surface ─────────────────────────────────

// (a) Pure text-only call.
const handwrite = mapFunctionCallToCommand('tutor_handwrite', { text: 'Legislative makes laws' });
expect(handwrite !== null, 'text-only handwrite should map');
if (handwrite && handwrite.action === 'handwrite') {
    eq(handwrite.text, 'Legislative makes laws', 'handwrite.text');
    // Legacy fields must not appear on the resulting command.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCmd = handwrite as any;
    expect(!('near' in anyCmd), 'handwrite should NOT carry near');
    expect(!('position' in anyCmd), 'handwrite should NOT carry position');
    expect(!('margin' in anyCmd), 'handwrite should NOT carry margin');
}

// (b) Stale brain emitting near/position/margin — fields silently dropped.
const staleCall = mapFunctionCallToCommand('tutor_handwrite', {
    text: 'note',
    near: 'the term',
    position: 'above',
    margin: 'right',
});
expect(staleCall !== null, 'stale-shape handwrite should still map');
if (staleCall && staleCall.action === 'handwrite') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCmd = staleCall as any;
    expect(!('near' in anyCmd), 'stale near silently dropped');
    expect(!('position' in anyCmd), 'stale position silently dropped');
    expect(!('margin' in anyCmd), 'stale margin silently dropped');
}

// (c) Empty text → null.
const emptyText = mapFunctionCallToCommand('tutor_handwrite', { text: '   ' });
expect(emptyText === null, 'empty text → null');

// (d) Color preserved.
const colored = mapFunctionCallToCommand('tutor_handwrite', { text: 'hi', color: '#16a34a' });
if (colored && colored.action === 'handwrite') {
    eq(colored.color, '#16a34a', 'handwrite.color preserved');
}

// ── 3. WhiteboardCanvas renderer source (static check) ─────────

const wbSource = readFileSync(
    join(__dirname, '..', 'src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx'),
    'utf8',
);

// AnnotationStrip component exists.
expect(wbSource.includes('function AnnotationStrip('), 'WhiteboardCanvas defines AnnotationStrip');
expect(wbSource.includes('<AnnotationStrip'), 'AnnotationStrip is rendered inside the page wrapper');

// HandwriteOverlays is gone.
expect(!wbSource.includes('function HandwriteOverlays'), 'HandwriteOverlays should be removed');
expect(!wbSource.includes('<HandwriteOverlays'), 'HandwriteOverlays should not be used');

// Old margin-based padding heuristics are gone.
expect(!wbSource.includes("h.margin === 'top'"), 'paddingTop heuristic for margin=top removed');
expect(!wbSource.includes("h.margin === 'bottom'"), 'paddingBottom heuristic for margin=bottom removed');

// Tick anchor formula present: right edge + vertical center + ✓ path.
// The path's first move is `M ${tx - half} ${ty}` (start at left of
// the tick), followed by an L to the cusp and an L to the upper-right.
expect(wbSource.includes('M ${tx - half} ${ty}'), 'WhiteboardCanvas contains the tick SVG path generator');
expect(wbSource.includes('r.x + r.w - tickSize'), 'tick anchor is inside the feature\'s right edge (inward placement)');
expect(wbSource.includes('r.y + r.h / 2'), 'tick anchor is vertically centered');

// Highlight branch still present.
expect(wbSource.includes("s.shape === 'highlight'"), 'highlight branch present');
expect(wbSource.includes("fillOpacity=\"0.25\""), 'highlight uses 0.25 opacity');

// ── 4. PDF capture source (static check) ───────────────────────

const captureSource = readFileSync(
    join(__dirname, '..', 'src/lib/utils/export/whiteboard-capture.ts'),
    'utf8',
);

// PDF mirror of the tick formula — same anchor math, written in plain
// strings since the PDF builds DOM nodes via createElementNS.
expect(
    captureSource.includes('rx + rw - tickSize * 0.55'),
    'PDF capture tick anchor matches live (rx + rw - tickSize * 0.55)',
);
expect(
    captureSource.includes('ry + rh / 2'),
    'PDF capture tick centered vertically (ry + rh / 2)',
);
// Legacy shape cases are removed from the dispatcher (no more circle/
// underline/box/arrow branches in the PDF capture switch — they map
// to the else-branch tick).
expect(
    !captureSource.includes("case 'circle':") || !captureSource.includes("case 'underline':"),
    'PDF capture removed legacy shape branches',
);

// ── 5. Orchestrator handwrite-field stripping ──────────────────

const orchSource = readFileSync(
    join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'),
    'utf8',
);
expect(
    orchSource.includes("'near' in cmdAny"),
    'orchestrator strips legacy `near` field on handwrite',
);
expect(
    orchSource.includes("'margin' in cmdAny"),
    'orchestrator strips legacy `margin` field on handwrite',
);
// The old `near`-resolution loop with catalogRef.current.resolveTarget(near)
// is gone — search for its distinctive console.warn signature.
expect(
    !orchSource.includes('handwrite near-resolve failed'),
    'old near-resolution warning removed',
);

// ── Report ──
if (failures.length === 0) {
    console.log('✓ tick-render: scribble surface, handwrite surface, renderer, PDF, orchestrator — all checks passed.');
    process.exit(0);
} else {
    console.error(`✗ ${failures.length} failure(s):`);
    for (const f of failures) console.error(`  - ${f.msg}`);
    process.exit(1);
}
