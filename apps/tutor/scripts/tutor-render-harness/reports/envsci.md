# AP Environmental Science — Whiteboard Tool-Render Audit

Fourth course. Coverage = harvest (7 distinct tools fired across 7 real
claude-brain sessions). Env Sci exercises two Phase-12 catalog kinds unique to
this course (`population_pyramid`, `climate_diagram`) plus `show_food_web` and
the Desmos graph path for growth curves.

## Tools covered
| Tool / kind | Source | Render |
|---|---|---|
| `show_diagram: population_pyramid` (growing country, ×2) | harvested | ✅ excellent — broad-based expansive pyramid, M/F cohorts, % labels |
| `show_diagram: climate_diagram` (Walter-Lieth) | harvested | ✅ excellent — dual-axis temp line / precip bars, annual mean+total caption |
| `show_food_web` (4 trophic levels) | harvested | ✅ excellent — stratified producers→tertiary, energy-flow arrows, color-coded |
| `show_function_graph` J-curve + S-curve (Desmos) | harvested | ✅ **after fix** — was empty grid (bug below) |
| `show_function_graph` CO₂ trend (Desmos) | harvested | ✅ correct rising curve + pre-industrial/today points |
| `show_concept_map` (carbon cycle) | harvested | ✅ renders (see emission note) |
| `show_sketch` (survivorship; carbon cycle) | harvested | ⚠️ blank in harness (known limitation) + emission note |
| `tutor_scribble` | harvested | n/a — annotation tool, no base figure in isolation |

## Real findings

### 1. Render bug — Desmos drops curves with parenthesized exponents — FIXED
Asked to graph J-curve vs S-curve population growth, the brain emitted valid
`show_function_graph` with `expr: "100 * e^(0.3*x)"` and
`expr: "1000 / (1 + 9 * e^(-0.7*x))"`. **The plot rendered as an empty grid**
(legend present, no curves). Caught by the vision-judge; the deterministic gate
passed it (no error thrown).

Root cause: in `DesmosGraphRenderer`, the `fn.expr` path runs `normalizeBareLatex`,
which escaped function names / `pi` / `sqrt` but **never converted `^(...)` to
LaTeX brace form `^{...}`**. Desmos reads `e^(` as "e raised to `(`", then
multiplies the rest → the expression is malformed → nothing plots. The sibling
CO₂ fixture passed only because its exponents were single-token `^2` (already
valid LaTeX). This is the **Desmos-path analogue of the Stats Gaussian flat-line
bug** (which fixed the Mafs fallback + `math-expr.ts`); the same plain-math-in-
`expr` habit hits the primary Desmos renderer through a different code path.

**Fix:** a balanced-paren `bracketExponents()` helper in `DesmosGraphRenderer`,
called first in `normalizeBareLatex`, that rewrites `^(...)` → `^{...}` (recursing
into the group, leaving `^{...}` and `^2` untouched). Generic — fixes any
`e^(...)` / `^(expr)` the brain emits, not just this case. Both growth curves now
render perfectly (J-curve overtakes the leveling S-curve, exactly the pedagogy).

## Emission / tool-selection notes (not render defects)

- **Over-doodling precise charts as sketches.** Survivorship curves (Type I/II/III
  on a log scale) were emitted via `show_sketch` — a freehand 2-stage doodle —
  rather than `show_stats` / a 3-function `show_function_graph`. These are exact,
  quantitative curves that a structured line chart renders far more crisply.
  Same theme as the Bucket-C over-doodling work: route math to structured tools,
  reserve `show_sketch` for analogies.
- **No structured carbon/nitrogen-cycle kind.** For "draw the carbon cycle" the
  brain reached for `show_sketch` + `show_concept_map` (the catalog has
  `water_cycle` but no `carbon_cycle`). The concept-map render is acceptable, but
  a dedicated biogeochemical-cycle diagram kind is a plausible authoring gap
  (cf. the diagram-tools roadmap).
- **`show_sketch` is not deterministically testable.** It is a 2-stage async
  LLM-doodler (Haiku server route → rough.js); a brain-free harness renders it
  blank. Two of the three vision-judge fails are this known limitation, not a
  production defect. `tutor_scribble` (the third fail) is an annotation applied to
  an existing figure — "Unknown command type" in isolation is expected.

## Final state
- **Deterministic gate: 10/10 pass.**
- **Vision-judge: 7/10** — the 3 fails are all harness artifacts (2× `show_sketch`
  blank, 1× `tutor_scribble` standalone). Every purpose-built Env Sci render tool
  renders correctly.
- **1 real render bug found + fixed** (Desmos parenthesized-exponent drop).
