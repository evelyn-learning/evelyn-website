# R41 whiteboard defect fixes — report

Branch: `r41-demo-polish`. Four root-caused defects, one commit each, TDD where a harness existed or was created.

Commits (oldest → newest):
1. `017bb4ff` — fix(whiteboard): horizontal edge clamp in label de-overlap (B2 number-line clipping)
2. `271590f9` — fix(whiteboard): scope signature field-stripping to top level (C2 wrong-figure scroll)
3. `278d4a5b` — fix(whiteboard): exact-signature dedup survives new_page bypass (C1 duplicate figure)
4. `57ba5218` — fix(whiteboard): exclude back-edges from flowchart rank computation (C3 blank gap)

---

## Fix 1 — B2: label clipping (shared lib)

**Root cause.** `deoverlapLabels()` in `src/lib/tutor/whiteboard/label-deoverlap.ts` only ever moved a label's `y` (vertical nudging to resolve collisions). `bounds.width` was accepted as a parameter but never read anywhere in the function. A label with no collisions (the common case — most labels don't overlap anything) was returned as the exact same object reference, untouched — so a label the doodler/brain positioned near or past a canvas edge (e.g. a number-line caption near x≈0) stayed off-canvas forever, with no code path that ever looked at its x relative to the bounds.

**What changed.** Added `clampX()`, a horizontal clamp mirroring `clampLabelPos` in `sketch-render-core.ts:1193-1214` (same anchor `start`/`end`/`middle` branching, same "pin to the edge instead of inverting" behavior for a label wider than the usable width). Applied it as a final step to **every** output label:
- The untouched (no-collision) path: if the clamp doesn't move `x`, the same object reference is still returned (preserves the existing "bit-for-bit untouched" contract and passthrough test); otherwise a new object with the clamped `x` is returned and the box pushed to `placed` reflects the clamped position.
- The vertically-nudged (collision) path: `x` is clamped the same way after the vertical resolution decides `y`.

Vertical collision *resolution* itself is unchanged — it still walks using the label's original `x` throughout, matching the existing "x/anchor untouched" contract for that step; the clamp is purely an additive final pass, not a rewrite of the collision algorithm.

Updated the module's top-of-file algorithm doc and the `deoverlapLabels` docstring to describe the new step 4 (horizontal clamp) and revise the "same reference" guarantee to require *both* no vertical nudge and no horizontal clamp.

**Files:**
- `src/lib/tutor/whiteboard/label-deoverlap.ts`
- `scripts/test-label-deoverlap.ts` (extended)

**RED** (added 3 new checks to the existing harness before the fix, then ran it against unfixed code via `git stash push` of just the implementation file):
```
$ npx tsx scripts/test-label-deoverlap.ts
  ...
  ✗ edge clamp: left-edge label box.left >= edgePad
  ✗ edge clamp: right-edge label box.right <= bounds.width - edgePad
  ✓ edge clamp: mid-canvas label untouched (same reference)
21 passed, 2 failed
```
(The third case passed even pre-fix since a mid-canvas label was never off-canvas — expected, it's the negative-control case.)

**GREEN** (after the fix, `git stash pop`):
```
$ npx tsx scripts/test-label-deoverlap.ts
  ...
  ✓ edge clamp: left-edge label box.left >= edgePad
  ✓ edge clamp: right-edge label box.right <= bounds.width - edgePad
  ✓ edge clamp: mid-canvas label untouched (same reference)
23 passed, 0 failed
```

---

## Fix 2 — C2: false dedup collision (`buildShowSignature`)

**Root cause.** `buildShowSignature()` in `src/lib/tutor/whiteboard/catalog.ts:1307-1363` canonicalizes a show-command object into a hash used for duplicate detection. Its `canon()` closure recursed into every nested object/array, and at **every recursion depth** it filtered out keys in the `STRIP` set (`title`, `heading`, `label`, `difficultyLabel`, ...). That set is correct for the *top-level* command (stripping a re-worded heading so the same figure under a new title still dedups), but flowchart_simple commands carry `params.edges[].label` and `params.nodes[].label` — semantic branch/node text (see `FlowchartEdge.label` in `src/lib/tutor/diagrams/catalog/kinds/cs.ts:15-19`, and the node-label-as-text-alias comment at lines 35-39) nested inside those arrays. Because STRIP applied at every depth, two flowcharts with identical topology but *different* node/edge text hashed to the **same** signature. The catalog then treated the second, different figure as a duplicate of the first and dropped its render, scrolling the student to the wrong (old) figure instead.

**What changed.** `canon()` now takes an `isTop` flag. The STRIP filter (`.filter((k) => !isTop || !STRIP.has(k))`) is applied only when `isTop` is true; every recursive call (including array-item recursion) passes `isTop = false`, so nested objects/arrays keep every key — they're still canonicalized and key-sorted, just never stripped. Both call sites (the plain `cmd` hash and the `structuralAxesFor` organizer-axes hash) now pass `isTop = true` explicitly at their top level only. Updated the function's doc comment to state the top-level-only scope and why (nested `label` is semantic content, not decoration).

**Files:**
- `src/lib/tutor/whiteboard/catalog.ts`
- `scripts/test-show-signature.ts` (new; no prior harness existed for `buildShowSignature` — confirmed via grep of `scripts/`)
- `package.json` (added `test:show-signature`)

**RED** (wrote the new harness first, then ran it against the unfixed function via `git stash push` of just `catalog.ts`):
```
$ npx tsx scripts/test-show-signature.ts
  ✓ different node text → different signature
  ✗ different edge label → different signature
  ✓ top-level title change alone → same signature
  ✓ exact re-emission → same signature
  ✗ nested params.title differs → different signature (only top-level is stripped)
3 passed, 2 failed
```
(The "different node text" case incidentally passed pre-fix too, since node text lives in the `text` field, not `label` — not part of STRIP either way; the two failures are the real bug signature.)

**GREEN** (after `git stash pop` restoring the fix):
```
$ npx tsx scripts/test-show-signature.ts
  ✓ different node text → different signature
  ✓ different edge label → different signature
  ✓ top-level title change alone → same signature
  ✓ exact re-emission → same signature
  ✓ nested params.title differs → different signature (only top-level is stripped)
5 passed, 0 failed
```

Also re-ran the existing catalog-adjacent suites to confirm no regression: `test:dedup-scroll`, `test:dispatch-dedupe`, `test:page-model`, `test:page-grouping` — all passed (27, 26, and prior counts unchanged; see Final Verification below for the two required ones).

---

## Fix 3 — C1: duplicate render on "fresh" (dedup vs. `new_page` bypass)

**Root cause.** In `src/app/tutor/components/VoiceTutorRealtime.tsx`, the per-command dedup gate (~line 5588, pre-fix) was:
```ts
if (existing && (dedupAllowedDespiteNewPage || (!newPageThisBatch && !newPageThisTurnRef.current && !redrawRequested))) {
```
`newPageThisBatch` / `newPageThisTurnRef.current` are set whenever the model emits a (deprecated, render-stripped) `new_page` tool call anywhere in the turn. Because they were OR'd into the condition, **any** `new_page` in the turn defeated dedup for the rest of the turn — even when an incoming command's signature was an **exact** match (`existing` found) for something already in the catalog. Since `new_page` is advisory-only (stripped from `processed` earlier in the pipeline; the runtime, not the brain, owns pagination — see the "ADVISORY" comment block a few hundred lines above), honoring it in the dedup gate bought no actual page break; it just let an exact re-emission render as a second, literal duplicate figure on the board.

**What changed.** Dropped `newPageThisBatch` / `newPageThisTurnRef.current` from the gate entirely. The new condition is:
```ts
if (existing && (isOrganizerKind || !redrawRequested)) {
```
- `redrawRequested` (an explicit user/brain redraw intent) still bypasses dedup exactly as before — unchanged.
- `isOrganizerKind` (comparison_table/t_chart/etc.) still always dedups regardless of `redrawRequested` — unchanged (same OR-short-circuit structure as before, just with the newPage terms removed).
- Fresh/off-plan content is unaffected by construction: it has no `existing` signature match, so it never enters this branch regardless of `new_page` state — the "divergence guard" role the old comments attributed to `newPageThisTurnRef` was really about *content with no match*, which this change doesn't touch.

Updated two comment blocks per the fix spec:
- The "Brain new_page is ADVISORY" block (~line 4653) — replaced the "we preserve its dedup-bypass role" framing with an explanation that new_page no longer bypasses dedup for exact matches, and why fresh/off-plan content is unaffected.
- The "Track whether THIS BATCH started with a newPage" block (~line 5499) — replaced the stale "skip the dedup ... otherwise we leave a blank new page" rationale (that was the very code path being removed) with what `newPageThisBatch` is still used for (page-model bookkeeping + the diagnostic log) and a note that the 2026-04-30 blank-page symptom it originally cited was a page-model problem, not a dedup one, and remains fixed independently of this change.

**Files:**
- `src/app/tutor/components/VoiceTutorRealtime.tsx`

**Verification.** This file has no unit harness (per the task brief); verification is `tsc --noEmit` plus the two whiteboard suites staying green:
```
$ npx tsc --noEmit
(clean, no output)

$ npm run test:dedup-scroll
All dedup-scroll checks passed. (5/5)

$ npm run test:view-follow
All view-follow checks passed. (17/17)
```

---

## Fix 4 — C3: flowchart blank gap (back-edges inflating rank)

**Root cause.** `layoutFlowchart()` (formerly inline in `src/app/tutor/components/whiteboard/CatalogCSRenderers.tsx:213-308`) computes each node's row via longest-path BFS depth from the start node, iterating "until depths stabilize" up to a safety cap of `nodes.length * 4`. The loop walked **every** outgoing edge, including loop-back edges (e.g. a flowchart that loops back from a later step to an earlier one, like "add" → "tokenize" to re-loop). Around such a cycle, each pass of the stabilization loop bumps every cycle member's depth again — depth doesn't converge, it climbs every iteration until the safety cap is hit. The loop target (and everything downstream of it) ends up at a wildly inflated rank, producing a huge blank vertical gap on the board and forcing the renderer's `needsGutter`/far-right routing logic to treat the resulting long vertical span as a "skip edge."

**What changed.** Added `classifyBackEdges()`: an iterative (explicit-stack, not recursive) DFS from the start node over the `outgoing` edge map. An edge is a structural back-edge if its target is still `onStack` (i.e., an ancestor of the source on the *current* DFS path) — the standard graph-theory definition, computed once before the depth loop. The depth-stabilization loop now skips any edge in that back-edge set (`if (backEdges.has(edgeKey(n.id, e.to))) continue;`), so loop-back edges never propagate depth. The existing **position-based** back-edge detection used purely for *drawing* (the renderer's `b.y < a.y` check, the right-gutter reservation, and the actual back-edge routing path in `CatalogCSRenderers.tsx`) is untouched — it's a different, later-stage classification (based on final y position) that still runs exactly as before to route the loop-back arrow through the gutter.

`layoutFlowchart` was not exported and importing the `.tsx` renderer module directly would have pulled in React (the file starts with `'use client'` and imports `React`/`InlineMathText`). Per the approved structure change, extracted `layoutFlowchart` (plus the new `classifyBackEdges` helper) into a new pure module `src/app/tutor/components/whiteboard/flowchart-layout.ts` (no React imports, only a type import from `cs.ts`), and re-import it from `CatalogCSRenderers.tsx`. The extracted copy is byte-identical in its unchanged logic (packing, row ordering, positions) — only the back-edge classification + the one `continue` line inside the depth loop are additions.

**Files:**
- `src/app/tutor/components/whiteboard/flowchart-layout.ts` (new)
- `src/app/tutor/components/whiteboard/CatalogCSRenderers.tsx` (removed inline `layoutFlowchart`, added import)
- `scripts/test-flowchart-layout.ts` (new)
- `package.json` (added `test:flowchart-layout`)

**RED** (wrote the harness against the already-extracted-but-not-yet-fixed module, by temporarily disabling the `backEdges.has(...)` skip and re-running):
```
$ npx tsx scripts/test-flowchart-layout.ts
  ✓ cycle: start at depth 0
  ✗ cycle: a at depth 1
  ✗ cycle: b at depth 2 (converged, not inflated by the loop)
  ✗ cycle: no node deeper than node count
  ✓ acyclic: start=0, a=1, b=2, end=3
  ✓ "add" sits adjacent to "numbers" (depth diff 1), not inflated
  ✗ demo shape: no node deeper than node count
3 passed, 4 failed
```
(Note: the "add adjacent to numbers" relative-diff check happened to still pass pre-fix, because all three cycle members — tokens/numbers/add — get bumped together each pass and their *relative* offsets stay 1 apart even as their *absolute* depth inflates; the "no node deeper than node count" assertions are what actually catch the regression, and did.)

**GREEN** (re-enabled the back-edge skip):
```
$ npx tsx scripts/test-flowchart-layout.ts
  ✓ cycle: start at depth 0
  ✓ cycle: a at depth 1
  ✓ cycle: b at depth 2 (converged, not inflated by the loop)
  ✓ cycle: no node deeper than node count
  ✓ acyclic: start=0, a=1, b=2, end=3
  ✓ "add" sits adjacent to "numbers" (depth diff 1), not inflated
  ✓ demo shape: no node deeper than node count
7 passed, 0 failed
```

---

## Final verification (all green, run after all 4 commits)

```
$ npx tsc --noEmit
(clean)

$ npm run test:label-deoverlap 2>/dev/null || npx tsx scripts/test-label-deoverlap.ts
23 passed, 0 failed

$ npm run test:show-signature
5 passed, 0 failed

$ npm run test:flowchart-layout
7 passed, 0 failed

$ npm run test:dedup-scroll && npm run test:view-follow
All dedup-scroll checks passed. (5/5)
All view-follow checks passed. (17/17)

$ OPENAI_API_KEY=placeholder npm run build
(ran in background — foreground 120s limit — exit code 0, full route manifest printed, no compile errors)
```

(`test:label-deoverlap` has no dedicated npm script — confirmed via grep of `package.json` — so the fallback `npx tsx scripts/test-label-deoverlap.ts` was used, as anticipated by the task brief.)

## No scope creep

No restructuring beyond what each fix description explicitly authorized: Fix 4's extraction of `layoutFlowchart` into its own module was the one approved structure change (needed to unit-test pure logic without pulling React into a `tsx` script); everything else is an in-place, minimal diff. `docs/superpowers/plans/r41-fix-report.md` (this file) was written but not committed, per instructions — left for the controller to commit.

---

## Round 2 — code review findings

Code review found real issues in two of the four round-1 fixes (C2, B2) and a hygiene problem in a third (C3's new file). All three addressed, one commit each:

5. `69707bbc` — fix(whiteboard): strip decorative fields outside arrays only (C2 round 2)
6. `bad0421e` — fix(whiteboard): clamp labels before collision resolution (B2 round 2)
7. `a1559005` — fix(whiteboard): remove NUL byte from flowchart-layout edge key + extra tests

### C2 round 2 — top-level-only STRIP was too narrow

**Review finding.** Round 1 scoped `STRIP` to the command object's own top-level keys only (`isTop` flag). But real commands wrap their payload a level (or two) down in a plain object: `show_diagram` → `params.title`, `show_problem` → `problem.title`/`problem.difficultyLabel`/`problem.sourceTag`. Top-level-only stripping meant those nested decorative fields were no longer stripped, breaking the ORIGINAL dedup behavior the STRIP set exists for — the exact 2026-04-30 (earth_layers retitle) and 2026-05-04 (AP Precalc difficultyLabel) incidents documented in the file's own comment block. Round 1's actual target (flowchart_simple's `nodes[].label`/`edges[].label`, which are array items) was narrower than "top-level only."

**What changed.** Replaced the `isTop` boolean with an `insideArray` flag: `false` at the root and through any plain-object nesting (so STRIP still reaches `params.title`, `problem.difficultyLabel`, etc.); flips to `true`, permanently, the moment recursion passes through an array (so `nodes[].label`/`edges[].label`, and any object nested inside an array item, keep every key). This is the precise rule reviewer specified: strip on every object reached WITHOUT traversing an array; keep all keys on objects inside arrays.

**Files:** `src/lib/tutor/whiteboard/catalog.ts`, `scripts/test-show-signature.ts` (rewritten).

Rewrote the test harness with realistic command shapes (`flowchart({...})` builds `{ action, type, params: { title, nodes, edges } }`; `problem({...})` builds `{ action: 'showProblem', problem: { statement, difficultyLabel?, sourceTag? } }` — matching `VoiceTutorRealtime.tsx`'s actual `cmd.problem.statement`/`.difficultyLabel`/`.sourceTag` reads), replacing the round-1 tests that invented fields directly on `cmd`.

**RED** (new tests run against the round-1 top-level-only implementation via `git stash push` of just `catalog.ts`):
```
$ npx tsx scripts/test-show-signature.ts
  ✓ different node text → different signature
  ✓ different edge label → different signature
  ✗ params.title change alone → same signature
  ✗ problem.difficultyLabel present/absent alone → same signature
  ✗ problem.sourceTag change alone → same signature
  ✓ different problem.statement → different signature
  ✓ exact re-emission → same signature
4 passed, 3 failed
```

**GREEN** (after the fix, `git stash pop`):
```
$ npx tsx scripts/test-show-signature.ts
  ✓ different node text → different signature
  ✓ different edge label → different signature
  ✓ params.title change alone → same signature
  ✓ problem.difficultyLabel present/absent alone → same signature
  ✓ problem.sourceTag change alone → same signature
  ✓ different problem.statement → different signature
  ✓ exact re-emission → same signature
7 passed, 0 failed
```

Also re-ran `test:dedup-scroll`, `test:page-grouping`, `test:page-model` — all green, no regression.

### B2 round 2 — clamp order let a clamped label re-collide

**Review finding.** Round 1 clamped `x` AFTER deciding whether a label collides — collision detection used the label's PRE-clamp box. A label whose pre-clamp box missed every placed box, but whose CLAMPED (post-shift) box landed on top of one, slipped through the "no collision" branch untouched-but-then-clamped, silently overlapping the label it clamped onto. Reviewer's repro: label A placed near center (x=150), label B far right (x=480) with a long enough label that its pre-clamp box misses A but its clamped box (walked left onto the canvas) lands on A.

**What changed.** Moved the horizontal clamp to a PRE-PASS over every label, computed once up front (`const clamped: T[] = labels.map(...)`), before the reading-order sort and the collision-resolution loop. The loop now indexes into `clamped` instead of `labels` throughout, so every collision check — including the very first one — already sees the final, on-canvas x. The `resolve()`/`resolveUnbounded()` vertical-nudge helpers are unchanged (they only ever touched `y`). The same-reference contract simplified to its natural meaning: a label is returned as the same object only if it needed neither a clamp nor a nudge.

Also tightened the `clampX` doc comment per the review's minor note: "pins to the edge instead of inverting" is only true for `start`/`end` anchors; an overlong `middle`-anchored label is centered instead (pinning to one edge would just clip the other side of the same box) — the code already did this (`hi - half < lo + half ? bounds.width / 2 : ...`), only the comment was imprecise.

**Files:** `src/lib/tutor/whiteboard/label-deoverlap.ts`, `scripts/test-label-deoverlap.ts` (extended, section 8).

**RED** (new repro test — `A = L(150, 50, 'short label', 10)` (width ≈60.5, no clamp needed), `B = L(480, 50, 'x'.repeat(64), 10)` (width ≈352, clamps from x=480 to x≈323, landing on A) — run against the round-1 post-collision-clamp code):
```
$ npx tsx scripts/test-label-deoverlap.ts
  ...
  ✗ clamp-then-collide: no residual overlap after clamping
  ✗ clamp-then-collide: the clamped label was vertically nudged off A's row
  ✓ clamp-then-collide: A (never collides, never clamps) is untouched
  ✓ clamp-then-collide: B still respects the right edge after nudging
25 passed, 2 failed
```

**GREEN** (after moving the clamp to a pre-pass):
```
$ npx tsx scripts/test-label-deoverlap.ts
  ...
  ✓ clamp-then-collide: no residual overlap after clamping
  ✓ clamp-then-collide: the clamped label was vertically nudged off A's row
  ✓ clamp-then-collide: A (never collides, never clamps) is untouched
  ✓ clamp-then-collide: B still respects the right edge after nudging
27 passed, 0 failed
```

### C3 hygiene — NUL byte in flowchart-layout.ts

**Review finding.** The round-1 `edgeKey()` template literal (`\`${from}<NUL>${to}\``) contained a literal NUL byte as its delimiter (byte offset ~383). Git's binary-file heuristic flagged the whole file as binary as a result, so `git diff`/`git show` printed `Binary files ... differ` instead of a real diff — hiding the file's actual content from review and from any future `git blame`/diff-based tooling.

**What changed.** Replaced the NUL delimiter with a plain `=>` string (`\`${from}=>${to}\``). Verified via `python3 -c "...data.count(b'\x00')..."`: 1 NUL byte in the committed (pre-fix) blob, 0 in the working-tree file after the fix; `file` reports the fixed file as `Java source, Unicode text, UTF-8 text` (was `data`, i.e. binary) beforehand.

Also added two cheap tests per the review request, via a new exported `classifyFlowchartBackEdges(nodes, edges)` wrapper (builds its own adjacency map and calls the existing internal `classifyBackEdges`, so tests don't need to hand-build one) and an exported `edgeKey`:
- **Diamond** (`a→b, a→c, b→d, c→d`): asserts zero back-edges — two forward paths re-converging on `d` is not a cycle, and the DFS-ancestor-on-stack classifier must not mistake it for one.
- **Disconnected component with an internal cycle**: `start→a` is the reachable graph; a separate, unreached `x↔y` pair forms its own 2-cycle. Asserts exactly one of `x→y`/`y→x` is classified a back-edge (not zero, not both) and that the reachable `start→a` edge is untouched — covering the "disconnected nodes still need their own cycles classified" branch in `classifyBackEdges`'s `for (const id of nodeIds) visit(id)` loop.

**Files:** `src/app/tutor/components/whiteboard/flowchart-layout.ts`, `scripts/test-flowchart-layout.ts`.

**Verification** (no RED/GREEN cycle — this is a delimiter swap + added coverage of already-correct logic, not a behavior fix; the 7 existing tests plus 3 new ones all pass post-change):
```
$ npx tsx scripts/test-flowchart-layout.ts
  ✓ cycle: start at depth 0
  ✓ cycle: a at depth 1
  ✓ cycle: b at depth 2 (converged, not inflated by the loop)
  ✓ cycle: no node deeper than node count
  ✓ acyclic: start=0, a=1, b=2, end=3
  ✓ "add" sits adjacent to "numbers" (depth diff 1), not inflated
  ✓ demo shape: no node deeper than node count
  ✓ diamond: zero back-edges
  ✓ disconnected component: its internal cycle has exactly one back-edge
  ✓ disconnected component: the reachable start→a edge is not a back-edge
10 passed, 0 failed
```

### Round 2 final verification (all green)

```
$ npx tsx scripts/test-label-deoverlap.ts        → 27 passed, 0 failed
$ npm run test:show-signature                    → 7 passed, 0 failed
$ npm run test:flowchart-layout                   → 10 passed, 0 failed
$ npm run test:dedup-scroll && npm run test:view-follow
  → All dedup-scroll checks passed. (5/5)
  → All view-follow checks passed. (17/17)
$ npx tsc --noEmit                                → clean, exit 0
```

No commits were amended; all three round-2 findings landed as new commits on top of the round-1 four, per instructions.

---

## Round 3 — B4 (dock-tap dismiss) + B1 (insulin seed Desmos misfire)

Two more root-caused defects, one commit each:

8. `d533d829` — fix(tutor): dock taps are not outside-taps for the tools cluster (B4, R41)
9. `408af267` — fix(content): insulin seed — table pin + tool hints replace Desmos graph (B1, R41)

### B4 — tool cluster collapses on mute tap

**Root cause (as given).** `src/app/tutor/components/session/SessionStage.tsx`'s R35 outside-tap dismiss (`document` `pointerdown` listener, ~line 347) collapses `toolsOpen` whenever the tap target isn't contained by `toolsClusterRef`. The mute button lives in the floating dock — a sibling overlay (the `rounded-[24px] bg-white ...` wrapper around `{voiceInput}`, ~line 1202), never a descendant of `toolsClusterRef` — so a mute tap bubbled to `document`, read as "outside," and collapsed the cluster before the button's own `onClick` fired. The R40b one-shot re-open (start-tap only) doesn't cover a repeatedly-tappable control like mute.

**What changed.** Added `dockRef` (a new `useRef<HTMLDivElement>`) attached to the dock wrapper div at ~line 1202. Extended the `toolsClusterRef` dismiss guard (~line 347) to also exempt taps inside `dockRef`:
```ts
if (
  toolsClusterRef.current &&
  !toolsClusterRef.current.contains(e.target as Node) &&
  !dockRef.current?.contains(e.target as Node)
) {
  setToolsOpen(false);
}
```
Added an R40b-style comment naming the incident (`embed-1785972176560`) and stating the rule: taps on the dock's always-visible controls are never "outside" for this dismiss.

**Sibling `switcherRef` check (requested).** `switcherRef`'s own outside-tap dismiss (~line 557, closes the board-page switcher dropdown) has the structurally identical exposure: it's also a bare `document` `pointerdown` listener with containment scoped only to its own popover container, and the dock is an equally-uncontained sibling overlay to it. Same mechanism, same fix — applied the identical `!dockRef.current?.contains(e.target as Node)` exemption to `switcherRef`'s guard, with a short comment cross-referencing the B4 incident. **Reporting as instructed:** yes, same exposure found, same guard applied.

**Files:** `src/app/tutor/components/session/SessionStage.tsx` (1 file, +22/-3).

**Verification:**
```
$ npx tsc --noEmit
(clean, exit 0) — run twice, once immediately after this edit and once again after
the B1 seed edit, both clean.
```
No unit harness exists for this component (confirmed — it's a client component with DOM refs/effects, no existing test script targets it).

`npm run build` (`OPENAI_API_KEY=placeholder`) was run against a clean `.next` (`rm -rf .next` first) covering the FINAL state of both this fix and the B1 seed edit below. It completed with exit code 0 — full route manifest printed (all `/tutor*`, `/tutor-portal/*`, marketing routes, etc.), no compile errors, `.next/BUILD_ID` written fresh. (An earlier build attempt's captured stdout/stderr came back empty due to a background-output-capture quirk in this environment, unrelated to build correctness — this second, clean-`.next` run is the one that counts and it's unambiguous.)

### B1 — insulin lesson renders a nonsense Desmos graph

**Root cause (as given).** `src/lib/tutor/lesson-plan/seeds/nclex-insulin-management.ts` set `suggestedTools: ['show_function_graph']` on three segments (`hook` line 40, `concept-insulin-timing` line 60, `concept-hook-resolution` line 74). Insulin action over time isn't a closed-form function, so the model improvised a Desmos graph — the `prescribedRender` machinery (`src/lib/tutor/lesson-plan/types.ts:62-95`, enforced in `VoiceTutorRealtime.tsx:9791-9899`) exists but was unused by this seed.

**What changed, exactly as specified:**
- `hook`: removed the `suggestedTools` line entirely (kept the 1-minute curiosity beat unconstrained).
- `concept-insulin-timing`: changed `suggestedTools` to `['show_table']` and added a `prescribedRender` pinning `show_table` with the onset/peak/duration table. Verified the four data rows against the segment's own `keyIdeas` (lines 47-52) — they match exactly (rapid: 10-15 min / 1-2 hr / 3-5 hr; short/regular: 30 min-1 hr / 2-4 hr / 5-8 hr; NPH: 1-2 hr / "4-12 hr (broad, variable)" / 12-18 hr; long-acting: 1-2 hr / "no pronounced peak" / 20-24 hr), so no deviation from the spec's literal values was needed.
- `concept-hook-resolution`: changed `suggestedTools` to `['show_diagram']` (no `prescribedRender` — task only specified the tool hint change here; the segment's meal-present/give-vs-hold decision fits a `flowchart_simple` catalog kind, confirmed present and non-deprecated in `src/app/tutor/hooks/toolDefinitions.ts:1242` region).

**Schema check.** Read `show_table`'s definition in `src/app/tutor/hooks/toolDefinitions.ts:200-210`: `{ headers: string[], rows: string[][] }`, both required. The `prescribedRender.params` object matches this shape exactly — `headers` is a 4-element string array, each of `rows`' 4 entries is a 4-element string array — so the deep-equal substitution the orchestrator performs (`types.ts:62-95`) will match a correctly-formed `show_table` emission.

**Lesson-seed validation script.** Grepped `package.json` scripts and the `scripts/` directory for `seed`/`lesson`/`verify` — no dedicated lesson-plan/seed validator exists (only unrelated data-seeding scripts like `seed:teacher`, `seed:problem-bank`). Used `tsc --noEmit` as the fallback gate, per the task brief.

**Files:** `src/lib/tutor/lesson-plan/seeds/nclex-insulin-management.ts` (1 file, +14/-3).

**Verification:**
```
$ npx tsc --noEmit
(clean, exit 0)
```

### Round 3 final verification

```
$ npx tsc --noEmit         → clean, exit 0 (run after both edits, on the final file state)
$ git log --oneline -2
408af267 fix(content): insulin seed — table pin + tool hints replace Desmos graph (B1, R41)
d533d829 fix(tutor): dock taps are not outside-taps for the tools cluster (B4, R41)
```

`npm run build` (`OPENAI_API_KEY=placeholder`, clean `.next`) completed with exit code 0 against this exact final file state — see B4 verification note above. No pre-commit hooks were skipped; both commits went through normally.

---

## Round 4 — B3 (nursing demo tile: NGN-overview → fluid & electrolytes)

One commit:

10. `8228a808` — feat(content): fluid & electrolytes demo lesson replaces NGN-overview tile (B3, R41)

**Owner rationale (as given).** The nursing solutions-page demo tile pointed at the NGN-overview seed — exam-format/CJMM strategy content, not a clinical topic. For a nursing-dean audience deciding whether to buy, "here's how the exam is structured" reads as informational rather than a demonstration of clinical-reasoning teaching. Prior research had already identified fluid & electrolytes (potassium and the heart, hyperkalemia focus) as the strongest untapped topic: it threads through nearly every nursing course (med-surg, pharm, critical care, renal) and draws well visually (a normal-range/symptom table plus a membrane-potential mechanism diagram). Acid-base/ABG was explicitly considered and rejected as oversaturated and mnemonic-flavored rather than reasoning-driven.

**Pattern study.** Read both existing clinical-content NCLEX seeds in full — `nclex-insulin-management.ts` (segment order: hook → core-facts concept with `prescribedRender: show_table` pin whose rows are cross-checked against its own `keyIdeas` → resolution concept with `show_diagram` → comparison concept → 2 misconception checks → recap → extension) and `nclex-heart-failure.ts` (same architecture, `show_diagram`/`comparison_table`/`show_concept_map`/`show_table` hints across its four concept segments). Confirmed via `types.ts` (`prescribedRender` at lines 62-95, `suggestedTools` at 118/131) that `show_table`'s params shape is `{ headers: string[], rows: string[][] }`, matching what B1 (round 3) already validated. Found the seed registry by grepping `evelyn.testprep.nclex` across `src/lib/tutor/lesson-plan/` — both existing clinical seeds are imported and pushed into `SEED_PLANS` in `store.ts` (imports ~834-835, array entries ~2655-2656), immediately after a `// Clinical-content NCLEX demo lessons` comment marking that sub-family. Read `src/data/solutions.ts` (nursing segment's `demoLessons` array, tile at line ~89 for NGN-overview, heart-failure at ~96, insulin at ~103 pre-edit) and `scripts/test-solutions-demo-lessons.ts`, which enforces: every `demoLessons[].planId` resolves in `SEED_PLANS`, no duplicate planIds within a segment, no duplicate segment slugs, exactly 6 segments total, and `showCrimsora` matches the academic/non-academic split.

**What was authored.** New seed `src/lib/tutor/lesson-plan/seeds/nclex-fluid-electrolytes.ts`, id `evelyn.testprep.nclex.fluid-electrolytes.v1`, matching the insulin/heart-failure segment architecture exactly:
- `hook` — dialysis patient who missed sessions, weak with palpitations, peaked T waves on telemetry; asks the learner to name the electrolyte before reveal (`suggestedTools: ['show_diagram']`).
- `concept-normal-ranges-and-symptoms` — normal K+ (3.5-5.0 mEq/L), hyperkalemia (muscle weakness, peaked/tented T waves, lethal-arrhythmia risk) and hypokalemia (cramps, flat/inverted T + U wave, digoxin toxicity risk) findings, `suggestedTools: ['show_table']` with a `prescribedRender: show_table` pin whose 4 rows (normal range / muscle findings / ECG finding / key danger) were cross-checked word-for-word against the segment's own `keyIdeas` — no numeric drift between prose and pin, same discipline B1 enforced on the insulin seed.
- `concept-membrane-potential` — conceptual (non-equation) explanation of how the K+ gradient sets cardiac resting membrane potential and why imbalance in either direction disrupts conduction, `suggestedTools: ['show_diagram']`.
- `concept-nursing-priorities` — the "protect (IV calcium gluconate, stabilizes the membrane, doesn't lower K+) → shift (insulin+D50, albuterol — temporary) → remove (Kayexalate, dialysis — definitive)" hyperkalemia framework, `suggestedTools: ['show_table']` with its own `prescribedRender` pin (step / intervention / what it actually does).
- Two `misconception_check` segments in the insulin seed's style: (1) insulin+D50 is for blood sugar, not potassium-shifting — false; (2) calcium gluconate lowers serum potassium fastest — false, it protects the membrane without touching the level.
- `recap` (5 `mustRemember` bullets) and `extension` (DKA's serum-vs-total-body potassium paradox, tying back to the shift mechanism).
- File-header comment states clinical values are standard textbook ranges, flagged for owner review before high-stakes use — same status note as the insulin seed's numbers.

Registered the seed in `store.ts`: import added directly after the two existing clinical-content NCLEX imports (under the same `// Clinical-content NCLEX demo lessons` comment), array entry added directly after `SEED_NCLEX_INSULIN_MANAGEMENT`.

**Tile swap.** In `src/data/solutions.ts`, replaced the nursing segment's first `demoLessons` entry (`evelyn.testprep.nclex.ngn-overview.v1`, "NCLEX-NGN Format & Clinical Judgment") with `evelyn.testprep.nclex.fluid-electrolytes.v1` ("Fluid & Electrolytes: Potassium and the Heart", hook copy: "Why one electrolyte turns into a cardiac emergency"). Heart-failure and insulin tiles (entries 2 and 3) untouched.

**`ngn-overview` repo-wide grep — what else references it.** Ran `grep -rn "ngn-overview"` across `.ts`/`.tsx`/`.md`/`.json`, excluding `node_modules` and the stale `.claude/worktrees/solutions-pages` copy:
- `src/lib/tutor/lesson-plan/store.ts:456` — the seed's own import, still present (not removed, per instructions).
- `src/lib/tutor/lesson-plan/seeds/nclex-ngn-overview.ts` — the seed file itself, id `evelyn.testprep.nclex.ngn-overview.v1` and LO id `nclex.ngn-overview`; untouched. The lesson remains fully registered and reachable — only the demo-tile pointer in `solutions.ts` changed.
- `src/lib/tutor/lesson-plan/seeds/nclex-ngn-standalone-items.ts:25` and `nclex-ngn-case-studies.ts:27` — both list `prerequisites: ['nclex.ngn-overview']`, referencing the LO id (not the plan id). Unaffected by this change since the LO and its owning seed are untouched.
- `docs/superpowers/plans/2026-08-04-solutions-segment-pages.md:15` and `docs/superpowers/plans/2026-08-05-outreach-and-demo-polish-handoff.md:115` — prior planning/handoff docs that named the old tile as the thing to eventually replace. Historical, not code; no action taken (not part of this task's scope to edit prior planning docs).

No other references found (no test fixtures, no other page/component hardcoded the old planId beyond the one tile in `solutions.ts`).

**Verification:**
```
$ npm run test:solutions-demo
  ✓ nursing: Fluid & Electrolytes: Potassium and the Heart → Fluid & Electrolytes: Potassium and the Heart
  ✓ nursing: Heart Failure: Left vs Right & the Compensatory Loop → Heart Failure: Left vs Right-Sided Failure and the Compensatory Loop
  ✓ nursing: Insulin Timing, Hypoglycemia & DKA vs HHS → Diabetes & Insulin Management: Timing, and DKA vs HHS
  ... (all 6 segments, 16 demo lessons total)
All 6 solution segments verified. failed: 0

$ npx tsc --noEmit
(clean, exit 0)

$ npm run test:curated-demo
All 7 curated demo lessons verified.
```
(`test:curated-demo` is the sibling demo-lesson guard for the homepage/curated set — confirmed unaffected since it doesn't reference any NCLEX planId; run as an extra regression check, not because the task required it.)

**Files:**
- `src/lib/tutor/lesson-plan/seeds/nclex-fluid-electrolytes.ts` (new)
- `src/lib/tutor/lesson-plan/store.ts` (+2: import, array entry)
- `src/data/solutions.ts` (nursing tile swap, 1 entry)

Single commit `8228a808`, as specified. This report section was appended but not committed, per instructions.
