# AP Statistics — Whiteboard Tool-Render Audit

Second course. Notable for a **methodology learning**: the Macro harvest approach
(one "draw X" utterance → one diagram) does NOT transfer to Stats, whose plans are
concept-heavy — the lesson kickoff absorbs the draw request and the brain teaches
the concept instead. So Stats render coverage came from **hand-authored fixtures**
for the data-viz tools, which is the reliable path for concept-heavy courses.

## Tools covered
| Tool / kind | Source | Render |
|---|---|---|
| `show_stats: histogram` (binned) | authored | ✅ excellent |
| `show_stats: boxplot` (single) | authored | ✅ excellent |
| `show_stats: boxplot` (side-by-side, compare) | authored | ✅ excellent |
| `show_stats: dotplot` | authored | ✅ excellent |
| `show_stats: distribution` (normal, ±1 SD shaded) | harvested | ✅ excellent |
| `show_stats: scatter` + `scatterplot_regression` (LSRL, r) | harvested | ✅ excellent |
| `show_tree` (probability, 2 coin flips) | authored | ✅ excellent |
| `show_venn_diagram` (2-set) | authored | ✅ excellent |
| `show_venn_diagram` (3-set) | authored | ✅ excellent |
| `show_table` (two-way) | harvested | ✅ excellent |
| `show_diagram: comparison_table` | harvested | ✅ (concept table) |
| `show_function_graph` (normal curve, LaTeX) | harvested | 🔴 **BUG — renders as a straight line** |

## Bug found — `show_function_graph` mis-renders a LaTeX Gaussian (OPEN)
The brain emitted a **correct** standard-normal density —
`expr: "\frac{1}{\sqrt{2\pi}}e^{-x^2/2}"`, xRange [-4,4] — and the tool def says
`functions` takes a "LaTeX expression in x." But it rendered as a **straight
diagonal line**, not a bell curve. So the native function-graph renderer's
LaTeX→plottable parser fails on this Gaussian form (`\frac` + `e^{...}`) and falls
back to a line. Affects normal / exponential / any `\frac`+`e^{...}` curve drawn
via `show_function_graph`. Found by the vision-judge (the deterministic gate
passed it — it renders *something*, just wrong). Workaround in the wild: the
`show_stats` distribution path renders normals correctly.

## Other observations (not render defects)
- **Harvest methodology limit:** concept-heavy plans absorb "draw X" utterances;
  the brain emitted concept `comparison_table`s + `advance_lesson` + `show_problem`
  instead of the requested histogram/boxplot. Hand-authoring covers the gap.
- **Over-doodling:** an extraneous `show_sketch` fired on the regression turn
  (renders blank in the harness — a 2-stage async tool the deterministic harness
  can't render).
- **Harvest robustness:** one session errored (`__tutorTestState` nav race).
- An empty `show_problem` was correctly rejected by the validator.

## Final state
- **Deterministic gate: 14/14 pass.**
- **Vision-judge: 13/14 pass** (1 fail = the `show_function_graph` Gaussian bug).
- All purpose-built Stats viz tools (histogram, boxplot, dotplot, tree, Venn,
  distribution, scatter+LSRL, two-way table) render excellently.

## Method note for future concept-heavy courses
Prefer hand-authored fixtures (deterministic, no brain-elicitation dependency)
over harvest for courses whose plans aren't diagram-centric.
