# AP Psychology — Whiteboard Tool-Render Audit

Sixth and final mapped AP course, and the most concept-heavy (Stats-like). Coverage =
harvest (5 distinct tools across 6 brain sessions). As expected, the yield leaned
on organizers/flowcharts/tables rather than graphs — but it surfaced the audit's
biggest render bug so far.

## Tools covered
| Tool / kind | Source | Render |
|---|---|---|
| `show_stats` normal curve (IQ distribution) | harvested | ✅ excellent — smooth bell, mean 100, ±4 SD axis |
| `show_diagram: t_chart` (IQ; Classical vs Operant) | harvested | ✅ excellent — clean 2-column comparison |
| `show_diagram: flowchart_simple` (memory model) | harvested | ✅ **after fix** — linear flow w/ edge labels (was a placeholder) |
| `show_diagram: flowchart_simple` (classical conditioning) | harvested | ⚠️ renders after fix, but branching-layout overlap (below) |
| `show_table` (memory model) | harvested | ✅ renders |
| `show_sketch` (neuron; brain anatomy) | harvested | ⚠️ blank in harness (known limitation) + emission note |

## Real findings

### 1. Render bug — `flowchart_simple` fully broken for the model's natural emission — FIXED
Every `flowchart_simple` the brain emitted rendered as the **"Tutor is figuring out
how to draw this…" placeholder** — i.e. the diagram failed entirely. `flowchart_simple`
is a go-to tool for psychology process diagrams (classical conditioning, the
information-processing memory model), so this broke a core Psych visual.

Root cause: `solveFlowchartSimple` (`diagrams/catalog/kinds/cs.ts`) strictly required
every node to carry `type` (one of start/end/process/decision/io) **and** `text`. The
brain instead emits the natural shape `{id, label}` — `label` (the field every *other*
catalog kind uses: pyramid, food_web, climate…) and no `type`. So `nodes[0].type
invalid` threw → the whole diagram fell back to the placeholder. The solver was the
odd one out, not the brain.

**Fix (generic, solver-side):** make `solveFlowchartSimple` tolerant — accept `label`
as an alias for `text`, and when `type` is missing/invalid **infer** it from edge
connectivity (no incoming → `start`, no outgoing → `end`, else `process`). Backward-
compatible (only kicks in when `type`/`text` are absent). The linear memory-model
flowchart now renders perfectly (start/end shapes inferred, `attention`/`encoding`
edge labels intact). Same "be liberal in what you accept" pattern as the other audit
fixes; no prompt change.

### 2. Flowchart branching-layout overlap (classical conditioning) — DOCUMENTED, not fixed
With the solver fixed, the classical-conditioning flowchart renders but a sibling node
label (`CS (Bell) → No Response`) overlaps the `AFTER Conditioning` box. The brain
modeled the topic as a branching tree (a `BEFORE` header fanning out to sub-items),
and the flowchart layout engine doesn't space multi-child branches — it stacks them
into a collision. This is a **pre-existing layout limitation** (independent of the
solver fix, which only enabled rendering), and the branching emission is itself
awkward (a linear before→during→after flow would render cleanly). Left as a follow-up:
either teach the layout engine to lay out branches, or steer conditioning to a linear
flow / dedicated kind.

## Emission / tool-selection notes (not render defects)
- **Anatomy over-doodled via `show_sketch`.** The neuron ("dendrites, axon, myelin,
  synapse") and brain-lobes diagrams were emitted as freehand `show_sketch` doodles —
  there is no labeled-neuron or brain-anatomy catalog kind, so the brain improvises.
  Same over-doodling theme as Env Sci; a labeled anatomy kind (or curated
  `show_labeled_image` assets) is a plausible authoring gap. `show_sketch` also can't
  render in a brain-free harness (2-stage async), so those 2 are expected blanks.
- **Empty double-emit.** The memory-models session emitted `flowchart_simple` twice —
  an empty `{nodes:[],edges:[]}` shell first (correctly placeholders — nothing to draw)
  then the populated one. A capture/double-emit artifact, not a render defect; in
  production the populated emission is what renders.

## Final state
- **Deterministic gate: 9/9 pass.**
- **Vision-judge: 5/9** — fails are 1 fixed-but-branch-overlapping flowchart, 1 empty-
  payload artifact, 2 `show_sketch` blanks (harness limitation). Every structurally-
  rendered Psych tool is correct.
- **1 real render bug found + fixed** (`flowchart_simple` placeholder) — the highest-
  impact fix of the audit, since it silently broke an entire common diagram kind for
  the brain's natural output across every course that uses flowcharts.
