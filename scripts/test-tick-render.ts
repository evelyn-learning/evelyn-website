/**
 * Tick-render ship-gate for the scribble + handwrite redesign
 * (2026-05-13), extended for the SmoothDraw Phase 3 close (2026-07-11
 * legibility gate — AnnotationStrip retired, on-board ink notes are now
 * the default board behavior). Verifies the tool surface + renderer:
 *
 *   1. tutor_scribble maps to a scribble command with the new shape
 *      vocabulary (tick / highlight). Legacy values (circle /
 *      underline / box / arrow) remap to tick. Default is tick.
 *   2. tutor_handwrite maps to a handwrite command — legacy `position`
 *      / `margin` fields are always stripped (accepted-and-ignored if a
 *      stale brain still emits them). `near` rides through by DEFAULT
 *      (ink notes default ON post-gate); `NEXT_PUBLIC_TUTOR_INK_NOTES=off`
 *      is the kill switch that drops it, mirroring the old flag-off
 *      behavior.
 *   3. The live WhiteboardCanvas renderer source contains the tick SVG
 *      path generator. The AnnotationStrip component is GONE — deleted,
 *      not flag-gated. Old HandwriteOverlays is gone too.
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

// (b) Legacy `position`/`margin` fields are ALWAYS stripped (pre-2026-05-13
// schema), regardless of the ink-notes kill switch. Test this under the
// kill switch ON — the degraded-rollback state where a stale `near` is
// ALSO expected to drop, mirroring pre-P3-close flag-off behavior.
process.env.NEXT_PUBLIC_TUTOR_INK_NOTES = 'off';
const staleCall = mapFunctionCallToCommand('tutor_handwrite', {
    text: 'note',
    near: 'the term',
    position: 'above',
    margin: 'right',
});
delete process.env.NEXT_PUBLIC_TUTOR_INK_NOTES;
expect(staleCall !== null, 'stale-shape handwrite should still map');
if (staleCall && staleCall.action === 'handwrite') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCmd = staleCall as any;
    expect(!('near' in anyCmd), 'kill-switch near silently dropped');
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

// (e) SmoothDraw P3 close: ink notes default ON — env UNSET carries `near`.
delete process.env.NEXT_PUBLIC_TUTOR_INK_NOTES;
const inkNote = mapFunctionCallToCommand('tutor_handwrite', { text: 'a = 3 here', near: 'the vertex' });
expect(inkNote !== null, 'default-on handwrite maps');
if (inkNote && inkNote.action === 'handwrite') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((inkNote as any).near === 'the vertex', 'default-on (env unset) handwrite carries near');
}
// Kill switch: NEXT_PUBLIC_TUTOR_INK_NOTES='off' drops near again.
process.env.NEXT_PUBLIC_TUTOR_INK_NOTES = 'off';
const offAgain = mapFunctionCallToCommand('tutor_handwrite', { text: 'x', near: 'y' });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
expect(offAgain !== null && !('near' in (offAgain as any)), 'kill switch (=off) drops near');
delete process.env.NEXT_PUBLIC_TUTOR_INK_NOTES;

// ── 3. WhiteboardCanvas renderer source (static check) ─────────

const wbSource = readFileSync(
    join(__dirname, '..', 'src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx'),
    'utf8',
);

// AnnotationStrip is deleted (SmoothDraw P3 close, 2026-07-11 gate) — on-
// board ink notes (InkNotesOverlay) are the sole note-rendering path now.
expect(!wbSource.includes('function AnnotationStrip('), 'AnnotationStrip should be deleted');
expect(!wbSource.includes('<AnnotationStrip'), 'AnnotationStrip should not be rendered anywhere');

// HandwriteOverlays is gone.
expect(!wbSource.includes('function HandwriteOverlays'), 'HandwriteOverlays should be removed');
expect(!wbSource.includes('<HandwriteOverlays'), 'HandwriteOverlays should not be used');

// Old margin-based padding heuristics are gone.
expect(!wbSource.includes("h.margin === 'top'"), 'paddingTop heuristic for margin=top removed');
expect(!wbSource.includes("h.margin === 'bottom'"), 'paddingBottom heuristic for margin=bottom removed');

// Tick anchor formula present: corner-outside placement + ✓ path.
// The path's first move is `M ${tx - half} ${ty}` (start at left of
// the tick), followed by an L to the cusp and an L to the upper-right.
// 2026-07-10: anchor moved from inside-right/vertically-centered (which
// struck through equation content) to just outside the top-right corner,
// with clamps back inside the viewBox at canvas edges.
expect(wbSource.includes('M ${tx - half} ${ty}'), 'WhiteboardCanvas contains the tick SVG path generator');
expect(wbSource.includes('r.x + r.w + half * 0.6'), 'tick anchor is outside the feature\'s top-right corner');
expect(wbSource.includes('r.y - half * 0.2'), 'tick anchor rides the feature\'s top edge');
expect(wbSource.includes('if (tx + half > vbW - 2)'), 'tick clamps horizontally at the canvas edge');
expect(wbSource.includes('if (ty - half * 0.6 < 2)'), 'tick clamps vertically at the canvas top');

// Highlight branch still present.
expect(wbSource.includes("s.shape === 'highlight'"), 'highlight branch present');
expect(wbSource.includes("fillOpacity=\"0.25\""), 'highlight uses 0.25 opacity');

// ── 4. PDF capture source (static check) ───────────────────────

const captureSource = readFileSync(
    join(__dirname, '..', 'src/lib/utils/export/whiteboard-capture.ts'),
    'utf8',
);

// PDF mirror of the tick formula — same anchor math, written in plain
// strings since the PDF builds DOM nodes via createElementNS. Both
// capture sites (live-DOM capture + doc-based capture) carry it.
expect(
    (captureSource.match(/rx \+ rw \+ half \* 0\.6/g) ?? []).length === 2,
    'PDF capture tick anchor matches live (rx + rw + half * 0.6) in both capture sites',
);
expect(
    (captureSource.match(/ry - half \* 0\.2/g) ?? []).length === 2,
    'PDF capture tick rides the top edge (ry - half * 0.2) in both capture sites',
);
expect(
    !captureSource.includes('rx + rw - tickSize * 0.55'),
    'old inward PDF tick anchor removed',
);
// Legacy shape cases are removed from the dispatcher (no more circle/
// underline/box/arrow branches in the PDF capture switch — they map
// to the else-branch tick).
expect(
    !captureSource.includes("case 'circle':") || !captureSource.includes("case 'underline':"),
    'PDF capture removed legacy shape branches',
);

// Phase-2 hand marks: both capture sites branch on drawOnEnabled() and
// consume the shared hand-stroke module, mirroring the live overlay.
expect(
    (captureSource.match(/drawOnEnabled\(\)/g) ?? []).length >= 4,
    'both PDF capture sites gate hand marks on drawOnEnabled() (tick + highlight each)',
);
expect(
    captureSource.includes("from '@/lib/tutor/whiteboard/hand-stroke'"),
    'PDF capture imports the shared hand-stroke module',
);
expect(
    wbSource.includes('tickSpine(tx, ty, tickSize)'),
    'live overlay builds the hand tick from the shared spine',
);
expect(
    wbSource.includes('seenMarkSeedsRef'),
    'live overlay animates each mark once (seed-keyed seen set)',
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
