# SmoothDraw Phase 4 — tutor_link Arrows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A new `tutor_link({ from, to, label?, color? })` tool draws a hand-drawn curved arrow between two board features (with an optional label placed by the slot engine) — covering the connection/causation utterance classes (D/I in the 2026-05-13 taxonomy), the top missing mark primitive.

**Architecture:** Pure arrow geometry joins `hand-stroke.ts` (nearest-edge anchors, seeded curved spine, barb heads — all rendered as filled variable-width outlines like the ticks). A new `link` command flows scribble-style through the orchestrator (dual catalog resolution, silent drop on either miss, cross-turn dedup) and renders inside the existing `InkNotesOverlay` so arrow labels share ONE placement/occupied space with notes. PDFs represent links as caption lines (no bake v1 — arrows can span items; documented divergence). Ships dark behind `NEXT_PUBLIC_TUTOR_LINKS === 'true'`; the close-out (after the user feel gate) flips it to kill-switch default-on and deploys **with the user-pre-authorized `NEXT_PUBLIC_TUTOR_DRAW_ON=true` prod flip**.

**Tech Stack:** TypeScript, React, WAAPI. No new deps. Spec: `docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md` §6 (+§2, §4 conventions). Phases 1–3 merged and deployed.

## Global Constraints

- Flag: `linksEnabled()` = `process.env.NEXT_PUBLIC_TUTOR_LINKS === 'true'` (dark until the user gate; the close-out flips to `!== 'off'`). Read at call time (test-toggleable). The `tutor_link` TOOL is included in `WHITEBOARD_TOOLS` only when enabled — flag-off brains never see it; a stale brain emitting it flag-off is dropped silently by the mapping.
- Round-7: link resolution misses (either endpoint) are SILENT drops — no rejection, no retry, no tool_result mutation. Mimic `_scribbleRejected`.
- Determinism: all geometry seeded (`${fromFeature}->${toFeature}`); no `Math.random`/`Date.now`.
- Arrows render ONLY when both endpoints measure on the current page's DOM; a missing endpoint rect skips the render silently (command persists — replay-safe). No orchestrator page logic.
- Arrow labels share `InkNotesOverlay`'s placement loop and occupied set — never overlap notes/content (the P3 invariant).
- PDF: caption-line representation v1 (`{from} → {to} — {label}` strip-bullet style, sanitized text path), flag-gated; NO bake (documented: arrows span items; the PDF is a linear stack).
- Silent TTS for all e2e; no app edits during live runs; one run per scenario (one diagnostic re-run for harness failures).
- Every commit: `npx tsc --noEmit` clean; repo test style; standard trailer (Co-Authored-By: Claude Fable 5 + Claude-Session link).

---

### Task 1: Arrow geometry — `hand-stroke.ts` additions + suite extension

**Files:**
- Modify: `src/lib/tutor/whiteboard/hand-stroke.ts` (append; do not touch existing exports)
- Modify: `scripts/test-hand-stroke.ts` (append blocks)

**Interfaces:**
- Consumes: existing `Pt`, `strokeOutline`, internal `fnv1a`/`mulberry32` (reuse — export nothing new beyond below).
- Produces (Task 3 relies on):
  - `arrowSpine(from: Rect4, to: Rect4, seed: string): Pt[]` where `type Rect4 = { x: number; y: number; w: number; h: number }` (exported)
  - `arrowHeads(spine: Pt[], size: number): [Pt[], Pt[]]` — two barb spines anchored at the spine's LAST point, oriented against its end tangent. Empty arrays when spine < 2 pts.

- [ ] **Step 1: Append failing tests**

```ts
// append to scripts/test-hand-stroke.ts (before the final report lines)
import { arrowSpine, arrowHeads, type Rect4 } from '../src/lib/tutor/whiteboard/hand-stroke';

// ── arrow spine ───────────────────────────────────────────────
{
  const a: Rect4 = { x: 0, y: 0, w: 100, h: 60 };
  const b: Rect4 = { x: 300, y: 200, w: 120, h: 80 };
  const s = arrowSpine(a, b, 'seed');
  check('spine has many samples (curved, resampleable)', s.length >= 8);
  const first = s[0];
  const last = s[s.length - 1];
  check('spine starts OUTSIDE the from-rect', first.x > 100 || first.y > 60);
  check('spine ends OUTSIDE the to-rect (before its edge)', last.x < 300 || last.y < 200);
  check('deterministic', JSON.stringify(arrowSpine(a, b, 'seed')) === JSON.stringify(s));
  check('different seed bows differently', JSON.stringify(arrowSpine(a, b, 'other')) !== JSON.stringify(s));
  // Bow: the midpoint deviates from the straight chord.
  const mid = s[Math.floor(s.length / 2)];
  const chordMidX = (first.x + last.x) / 2;
  const chordMidY = (first.y + last.y) / 2;
  const dev = Math.hypot(mid.x - chordMidX, mid.y - chordMidY);
  check('spine bows away from the chord', dev > 4);
  check('bow is bounded', dev <= 40 + 1);
}
{
  // Degenerate: overlapping rects → no spine.
  const a: Rect4 = { x: 0, y: 0, w: 100, h: 100 };
  const b: Rect4 = { x: 20, y: 20, w: 100, h: 100 };
  check('overlapping rects → empty spine', arrowSpine(a, b, 's').length === 0);
}

// ── arrow heads ───────────────────────────────────────────────
{
  const spine = arrowSpine({ x: 0, y: 0, w: 50, h: 50 }, { x: 200, y: 0, w: 50, h: 50 }, 'h');
  const [b1, b2] = arrowHeads(spine, 12);
  check('two barbs, 2 pts each', b1.length === 2 && b2.length === 2);
  const tip = spine[spine.length - 1];
  check('barbs anchor at the tip', b1[0].x === tip.x && b1[0].y === tip.y && b2[0].x === tip.x && b2[0].y === tip.y);
  check('barbs point BACK from the tip (upstream x)', b1[1].x < tip.x && b2[1].x < tip.x);
  check('barbs straddle the shaft (opposite y sides)', (b1[1].y - tip.y) * (b2[1].y - tip.y) < 0);
  check('empty spine → no barbs', arrowHeads([], 12)[0].length === 0);
}
```

- [ ] **Step 2: Run to verify FAIL** — `npm run test:hand-stroke` → module has no `arrowSpine` export.

- [ ] **Step 3: Implement (append to hand-stroke.ts)**

```ts
export type Rect4 = { x: number; y: number; w: number; h: number };

/** Where the center-to-center line exits `rect`, pushed `pad` px outward.
 *  Returns null when the other center is inside this rect. */
function edgeExit(rect: Rect4, toward: Pt, pad: number): Pt | null {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (dx === 0 && dy === 0) return null;
  // Slab test: smallest t where the ray leaves the rect.
  const tx = dx !== 0 ? (dx > 0 ? (rect.x + rect.w - cx) / dx : (rect.x - cx) / dx) : Infinity;
  const ty = dy !== 0 ? (dy > 0 ? (rect.y + rect.h - cy) / dy : (rect.y - cy) / dy) : Infinity;
  const t = Math.min(tx, ty);
  if (!isFinite(t) || t <= 0) return null;
  const len = Math.hypot(dx, dy);
  const tPad = t + pad / len;
  return { x: cx + dx * tPad, y: cy + dy * tPad };
}

/** SmoothDraw P4: curved hand-arrow spine between two feature rects.
 *  Anchors at each rect's nearest edge (4px outside), bows the chord by a
 *  seeded perpendicular offset (12% of distance, clamped 8..40px), and
 *  samples the quadratic into ~12+ points so strokeOutline can wobble it.
 *  Overlapping/contained rects → empty spine (no meaningful arrow). */
export function arrowSpine(from: Rect4, to: Rect4, seed: string): Pt[] {
  const toC = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
  const fromC = { x: from.x + from.w / 2, y: from.y + from.h / 2 };
  const a = edgeExit(from, toC, 4);
  const b = edgeExit(to, fromC, 4);
  if (!a || !b) return [];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 24) return []; // rects touch/overlap — an arrow would be noise
  const rng = mulberry32(fnv1a(seed));
  const bow = Math.min(40, Math.max(8, dist * 0.12)) * (rng() > 0.5 ? 1 : -1) * (0.75 + rng() * 0.5);
  const nx = -dy / dist;
  const ny = dx / dist;
  const ctrl = { x: (a.x + b.x) / 2 + nx * bow, y: (a.y + b.y) / 2 + ny * bow };
  const n = Math.max(12, Math.round(dist / 14));
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push({
      x: u * u * a.x + 2 * u * t * ctrl.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * ctrl.y + t * t * b.y,
    });
  }
  return out;
}

/** Two barb spines for the arrowhead, anchored at the spine tip and swept
 *  back ±~150° from the end tangent. */
export function arrowHeads(spine: Pt[], size: number): [Pt[], Pt[]] {
  if (spine.length < 2) return [[], []];
  const tip = spine[spine.length - 1];
  const prev = spine[spine.length - 2];
  const ang = Math.atan2(tip.y - prev.y, tip.x - prev.x);
  const barb = (offset: number): Pt[] => [
    { x: tip.x, y: tip.y },
    { x: tip.x + Math.cos(ang + offset) * size, y: tip.y + Math.sin(ang + offset) * size },
  ];
  const SPREAD = Math.PI - Math.PI / 6; // 150°
  return [barb(SPREAD), barb(-SPREAD)];
}
```

- [ ] **Step 4: Green + typecheck** — `npm run test:hand-stroke && npx tsc --noEmit`. (Note: the horizontal-arrow barb test relies on tip.x > prev.x for a left-to-right spine — true by construction here; if the bow flips the final tangent's y only, x still advances. If a test fails, fix geometry, never tests; report BLOCKED if you believe a test is wrong.)

- [ ] **Step 5: Commit** — `git add src/lib/tutor/whiteboard/hand-stroke.ts scripts/test-hand-stroke.ts && git commit -m "feat(tutor): SmoothDraw P4 — arrow spine + barb geometry"`

---

### Task 2: `link` command — type, tool, mapping, orchestrator, membership sweep

**Files:**
- Modify: `src/lib/knowledge/types.ts` (WhiteboardCommand union — model on the `scribble` member at ~line 676)
- Modify: `src/app/tutor/hooks/toolDefinitions.ts` (flag helper, conditional tool entry, mapping)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (resolution + dedup + drop)
- Modify: every action-membership list where `'scribble'` appears with overlay-mark semantics (sweep below)
- Modify: `scripts/test-tick-render.ts` (mapping assertions)

**Interfaces:**
- Consumes: `catalogRef.current.resolveTarget(raw)` → `{ ok, canonical, itemId }`.
- Produces (Task 3 relies on): commands `{ action: 'link'; from: string; to: string; label?: string; color?: string; fromFeature?: string; fromId?: string; toFeature?: string; toId?: string }` — stamps present only when BOTH endpoints resolved (all-or-nothing). `linksEnabled(): boolean` exported from toolDefinitions.ts.

- [ ] **Step 1: Type.** Add to the WhiteboardCommand union in types.ts:

```ts
  | {
      action: 'link';
      /** Raw target grammar strings (resolved + stamped by the orchestrator). */
      from: string;
      to: string;
      label?: string;
      color?: string;
      fromFeature?: string;
      fromId?: string;
      toFeature?: string;
      toId?: string;
    }
```

- [ ] **Step 2: Flag + tool + mapping (toolDefinitions.ts).**

```ts
/** SmoothDraw P4: hand-drawn arrows. Dark until the user feel gate passes;
 *  the close-out flips this to kill-switch (!== 'off'). Call-time read. */
export function linksEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TUTOR_LINKS === 'true';
}
```

Tool entry — insert into `WHITEBOARD_TOOLS` right after `tutor_scribble` via conditional spread:

```ts
  ...(linksEnabled() ? [{
    name: 'tutor_link',
    description: 'Draw a hand-drawn arrow between two things already on the board — for connections, causation, and "this leads to that" moments. Both endpoints use the same target grammar as tutor_scribble (feature or item names visible on the board). Optional short label rides the arrow. Both endpoints must already be rendered; if either cannot be found the arrow is skipped silently, so only reference things you can see in the board state.',
    parameters: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Source feature/item (same grammar as tutor_scribble target).' },
        to: { type: 'string', description: 'Destination feature/item. The arrowhead lands here.' },
        label: { type: 'string', description: 'Optional ≤6-word label, hand-written beside the arrow.' },
        color: { type: 'string', description: 'CSS color. Defaults to amber (#a16207).' },
      },
      required: ['from', 'to'],
    },
  }] : []),
```

(NOTE: `WHITEBOARD_TOOLS` is a module-scope const — env is inlined client-side / read at module init server-side; identical pattern risk to zero since the flag doesn't change within a process. State this in a comment.)

Mapping in `mapFunctionCallToCommand`:

```ts
  if (funcName === 'tutor_link') {
    if (!linksEnabled()) return null; // stale brain flag-off — silent
    const from = typeof funcArgs.from === 'string' ? funcArgs.from.trim() : '';
    const to = typeof funcArgs.to === 'string' ? funcArgs.to.trim() : '';
    if (!from || !to) return null;
    const cmd: WhiteboardCommand = { action: 'link', from, to };
    if (typeof funcArgs.label === 'string' && funcArgs.label.trim()) cmd.label = funcArgs.label.trim();
    if (typeof funcArgs.color === 'string' && funcArgs.color.trim()) cmd.color = funcArgs.color.trim();
    return cmd;
  }
```

- [ ] **Step 3: Orchestrator (VTR).** Next to the handwrite near-resolution loop, add a link loop with the SAME timing (after catalog append, before dispatch):

```ts
    // SmoothDraw P4: resolve link endpoints through the catalog. Both must
    // resolve or the arrow drops SILENTLY (round-7 — soft pedagogy aid).
    // Cross-turn dedup: an identical from→to(+label) already on the page is
    // a re-emission habit, not a new arrow — drop it silently too.
    for (const cmd of processed) {
      if (cmd.action !== 'link') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = cmd as any;
      const f = catalogRef.current.resolveTarget(c.from);
      const t = catalogRef.current.resolveTarget(c.to);
      if (!f.ok || !t.ok || (f.canonical === t.canonical && f.itemId === t.itemId)) {
        c._linkRejected = true;
        onDebugEvent?.('link_dropped', `${c.from} -> ${c.to} (${!f.ok ? 'from-miss' : !t.ok ? 'to-miss' : 'self-link'})`);
        continue;
      }
      const dupe = whiteboardCommandsRef.current.some((prev) => {
        if ((prev as { action?: string }).action !== 'link') return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = prev as any;
        return p.fromFeature === f.canonical && p.toFeature === t.canonical && (p.label ?? '') === (c.label ?? '');
      });
      if (dupe) { c._linkRejected = true; onDebugEvent?.('link_dropped', 'duplicate'); continue; }
      c.fromFeature = f.canonical; c.fromId = f.itemId;
      c.toFeature = t.canonical; c.toId = t.itemId;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processed = processed.filter((cmd) => !(cmd as any)._linkRejected);
```

(Adapt ref names to the surrounding code — the scribble block just above is the template. If `whiteboardCommandsRef` isn't the right accumulated-commands ref at that point, use whatever the scribble dedup uses and note it.)

- [ ] **Step 4: Membership sweep.** Run `grep -rn "'scribble'" src/ scripts/ | grep -v test-` and build a table of EVERY action-set where `'scribble'` appears. Add `'link'` to each set where the semantics are "overlay mark, not a board item" — known sites include: WhiteboardCanvas.tsx renderableCommands filter (~899) and BOTH view-follow META sets (~677, ~752); VTR's isRenderAction list (~202) and DEDUP_META_ACTIONS (~2582); page-grouping.ts scribble mentions; the PDF walk's meta/skip lists in pdf-tutor-session.ts; resume-seed catalog replay exclusions; whiteboard-capture input types if scribbles are filtered there. For each site: include or exclude `'link'` WITH a one-line justification in your report. Anything ambiguous → ask the controller, don't guess. This sweep is the task's highest-risk step — the P3 counter-drift memo (META_ACTIONS constraint) is the cautionary tale.

- [ ] **Step 5: Tests.** Append to test-tick-render.ts section 1:

```ts
// SmoothDraw P4: tutor_link mapping (flag-gated).
process.env.NEXT_PUBLIC_TUTOR_LINKS = 'true';
const link = mapFunctionCallToCommand('tutor_link', { from: 'the equation', to: 'the graph', label: 'same slope' });
expect(link !== null && link.action === 'link', 'flag-on link maps');
if (link && link.action === 'link') {
    eq(link.from, 'the equation', 'link.from');
    eq(link.to, 'the graph', 'link.to');
    eq(link.label, 'same slope', 'link.label');
}
expect(mapFunctionCallToCommand('tutor_link', { from: 'x', to: '' }) === null, 'empty endpoint → null');
delete process.env.NEXT_PUBLIC_TUTOR_LINKS;
expect(mapFunctionCallToCommand('tutor_link', { from: 'a', to: 'b' }) === null, 'flag-off link drops silently');
```

- [ ] **Step 6: Battery + commit.** `npx tsc --noEmit && npx tsx scripts/test-tick-render.ts && npm run test:process-tool-call && npm run test:page-grouping && npm run test:draw-on && npm run test:resume-seed` all green (flag unset → zero behavior change). Commit: `feat(tutor): SmoothDraw P4 — link command, tool, resolution, membership sweep`.

---

### Task 3: Arrow rendering in InkNotesOverlay

**Files:**
- Modify: `src/app/tutor/components/whiteboard/InkNotesOverlay.tsx`
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx` (pass `links` prop — one memo + one prop)

**Interfaces:**
- Consumes: `arrowSpine`, `arrowHeads`, `strokeOutline`, `Rect4` (Task 1); stamped link commands (Task 2); existing `targetRect`, placement loop, `resolveNoteFontFamilies` conventions.
- Produces: arrows draw with hand character + halo; labels flow through the shared placement loop (occupied includes arrows' spine bboxes so notes never sit on an arrow).

- [ ] **Step 1: WhiteboardCanvas — links memo + prop.** Next to the `handwrites` memo: `const links = useMemo(() => safeCurrentPage.commands.filter((c) => c.action === 'link'), [safeCurrentPage.commands]);` (match the neighbors' exact memo style) and pass `links={links}` to `<InkNotesOverlay …/>`.

- [ ] **Step 2: Overlay.** Add `links: LinkCmd[]` prop (`type LinkCmd = Extract<WhiteboardCommand, { action: 'link' }>`). In the measuring effect, before note placement: for each link with all four stamps, measure `fromRect = targetRect(host, link.fromId, link.fromFeature)` and `toRect` similarly; both present → `spine = arrowSpine(fromRect, toRect, `${link.fromFeature}->${link.toFeature}`)`; skip silently when either rect is missing (other page) or spine is empty. Store `{ key, spine, color, labelText? }` in a new `arrows` state array. Push each spine's bounding box (+6px pad) into `occupied` BEFORE the note-placement loop so notes dodge arrows. Arrow labels: append to the placement `sources` AFTER scribble labels, with `target` = a 24×24 rect centered on the spine midpoint (labels place beside the arrow's waist).
- Render: one `<svg className="absolute inset-0 …" pointer-events-none>` inside the overlay (above the backdrop notes' container or beside it — either; document). Per arrow: halo `strokeOutline(spine, 7, `${key}-halo`)` white 0.95 + color `strokeOutline(spine, 4.5, key)`, plus both barbs through the same dual outline (barb width 4.5, size 12). Draw-on: WAAPI clip-wipe on the arrow `<g>` oriented by the spine's dominant direction (inset from the appropriate side), ~500ms, `fill:'backwards'`, animate-once keyed on `key` in the existing `animatedRef`.

- [ ] **Step 3: Verify + commit.** `npx tsc --noEmit && npm run test:ink-placement && npm run test:hand-stroke && npx tsx scripts/test-tick-render.ts && npm run test:process-tool-call` green. Commit: `feat(tutor): SmoothDraw P4 — arrows render in the notes overlay (shared placement space)`.

---

### Task 4: PDF caption lines for links

**Files:**
- Modify: `src/lib/utils/export/pdf-tutor-session.ts`

**Interfaces:**
- Consumes: `linksEnabled()`; link commands with stamps; the existing strip-bullet caption renderer (the handwrite caption path is the template).

- [ ] **Step 1:** In the export walk, `link` commands render a caption line in the strip-bullet style: text `${fromDisplay} → ${toDisplay}${label ? ` — ${label}` : ''}` where fromDisplay/toDisplay prefer the human `from`/`to` strings the brain wrote (they read better than canonical slugs), sanitized through the caption path (WinAnsi-safe `→` already maps). Color = link color or amber. Flag-gated; flag-off, link commands are skipped in the walk (add to the PDF's meta-skip list — coordinate with Task 2's sweep so it happens exactly once).
- Add a comment: no bake v1 — arrows can span two items; the PDF is a linear item stack (same rationale as margin notes).

- [ ] **Step 2:** `npx tsc --noEmit && npx tsx scripts/test-tick-render.ts && npm run test:process-tool-call` green. Commit: `feat(tutor): SmoothDraw P4 — PDF caption lines for links`.

---

### Task 5: Gate — fresh-session e2e + round-7 + user feel round

**Files:**
- Create: `scripts/tutor-e2e/scenarios/link-arrows.ts`
- Modify: `.env.local` (add `NEXT_PUBLIC_TUTOR_LINKS=true`; controller restarts the dev server)

- [ ] **Step 1: Scenario**

```ts
import type { Scenario } from '../types';

/**
 * SmoothDraw Phase-4 gate: hand-drawn arrows. FRESH SESSION required (new
 * tool in the prompt). Requires NEXT_PUBLIC_TUTOR_LINKS=true (+ the P1-3
 * defaults) in .env.local and a dev-server restart. TUTOR_E2E_VIDEO=1.
 */
const scenario: Scenario = {
  name: 'link-arrows',
  description: 'Arrows draw between features with labels; misses drop silently.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [],
  testTurns: [
    {
      say: 'Draw the triangle with vertices (0,0), (6,0) and (0,3), then draw an arrow from vertex B to vertex A labeled "the hypotenuse runs here".',
      watchFor: 'Curved hand-drawn arrow from B to A with barbed head at A; label beside the arrow waist, not overlapping the figure; arrow wipes on.',
      timeoutMs: 150_000,
    },
    {
      say: 'Now write the area formula as an equation, and draw an arrow from that equation to the triangle labeled "computes this area".',
      watchFor: 'Cross-item arrow (equation card → figure) on the same page; label placed clear of notes/content; no overlap.',
      timeoutMs: 150_000,
    },
    {
      say: 'Draw an arrow from the circumcenter to vertex A.',
      watchFor: 'No circumcenter exists on the board — the arrow must drop SILENTLY: no error speech, no retry loop; tutor responds naturally (may draw the point first — also fine; judge from debug events link_dropped or a legitimately drawn arrow).',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
```

- [ ] **Step 2:** Commit scenario FIRST, controller restarts the dev server with the flag, then run `TUTOR_E2E_VIDEO=1 npm run test:tutor-e2e -- link-arrows`. Analyze frames: arrow curvature/hand feel, barbs, label placement (shared occupied working — no label-on-note collisions), wipe-on, the silent-drop turn. Then full battery + `npm run test:tutor-e2e -- round7-regression` (0 anomalies, 0 MAX_VALIDATOR_RETRIES). PDF spot-check: link caption lines present.

- [ ] **Step 3: USER FEEL ROUND** (controller hands off): arrows in a live session — curvature, head size, label placement, wipe speed.

---

### Task 6: Close-out (controller + user gate dependent)

After the user's feel sign-off:
1. Flip `linksEnabled()` to kill-switch: `!== 'off'` (same pattern as inkNotesEnabled; update the doc comment + the tool-inclusion comment + test-tick-render's env-toggle block to assert default-on/kill-switch).
2. Remove `NEXT_PUBLIC_TUTOR_LINKS=true` from `.env.local` (redundant once default-on).
3. Battery green; commit `feat(tutor): SmoothDraw P4 close — links default with kill switch`.
4. Push to origin/main.
5. **Prod deploy with the user-pre-authorized DRAW_ON flip (2026-07-11 authorization):** add `NEXT_PUBLIC_TUTOR_DRAW_ON=true` to `.env.local.production` BEFORE running `./deploy-to-production.sh` (the build inlines it — no separate restart needed). Verify www/tutor/embed 200 post-deploy.
6. Ledger + memory close-out: SmoothDraw initiative COMPLETE (all four spec phases live in prod).

---

## Self-review notes

- Spec §6 coverage: from/to/label/color (T2), curved hand stroke between nearest edges (T1), label at midpoint via the slot picker (T3 shared placement), misses silent-drop like scribbles (T2). §2 interrupts: arrows animate once via the overlay's existing animatedRef; kill-recovery removes link commands → nodes unmount (same adjudication as marks/notes). §4 conventions: seeded determinism, dual-outline halo, amber default.
- Type consistency: `Rect4`/`arrowSpine`/`arrowHeads` (T1) consumed in T3; `linksEnabled` (T2) in T2/T4/T6; stamp fields `fromFeature/fromId/toFeature/toId` (T2) consumed in T3's measurement and T2's dedup.
- Known v1 limits, stated: no PDF bake for arrows; arrows render only when both endpoints are on the current page's DOM; same-feature self-links dropped.
