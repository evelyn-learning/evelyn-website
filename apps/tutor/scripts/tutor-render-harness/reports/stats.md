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
| `show_function_graph` (normal curve, LaTeX) | harvested | ✅ fixed (was 🔴 straight line — see below) |

## Bug found — `show_function_graph` LaTeX Gaussian rendered as a line — FIXED
The brain emitted a **correct** standard-normal density
(`expr: "\frac{1}{\sqrt{2\pi}}e^{-x^2/2}"`), but it rendered as a **straight
diagonal line**. Found by the vision-judge (the deterministic gate passed it —
it renders *something*, just wrong). Three compounding causes, all fixed:
1. **Harness exposed it:** in production `showGraph` uses `DesmosGraphRenderer`
   (which loads `window.Desmos` and handles LaTeX); the render-harness route has
   no Desmos, so it hits the native **Mafs `GraphRenderer` fallback** — the path
   that was broken.
2. **Wrong field:** the Mafs renderer read `fn.fn || fn.latex` but the tool
   schema's field is **`expr`** — so it never saw the expression and plotted the
   default `'x'` (the diagonal line). Now reads `fn.expr` (added to the type).
3. **LaTeX + a JS pitfall:** the normalizer didn't handle `\frac`/`\sqrt`/`^{…}`,
   and `-x**2` is a JS SyntaxError ("unary before \*\*"). Added a LaTeX→plain
   pre-pass and a `-x**2 → -(x**2)` wrap.

The normalizer was extracted to `@/lib/tutor/whiteboard/math-expr` and unit-tested
(`npm run test:graph-math`, 7 checks). The Mafs fallback now renders a correct
bell curve. (This also fixes the fallback for any `-x^2`/LaTeX curve, and the
Desmos primary path was already fine.)

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
- **Vision-judge: 13/14 at audit time** — the 1 fail (`show_function_graph`
  Gaussian) is now **fixed** and renders a correct bell curve (visually confirmed).
- All purpose-built Stats viz tools (histogram, boxplot, dotplot, tree, Venn,
  distribution, scatter+LSRL, two-way table) render excellently.

## Method note for future concept-heavy courses
Prefer hand-authored fixtures (deterministic, no brain-elicitation dependency)
over harvest for courses whose plans aren't diagram-centric.
