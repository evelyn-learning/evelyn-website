# AP Calculus BC — Whiteboard Tool-Render Audit

Third course, and the first to test the **Desmos-faithful** graph path
(the harness now loads Desmos). Coverage = harvest (4 distinctive tools fired)
+ hand-authored fixtures for the rest.

## Tools covered
| Tool / kind | Source | Render |
|---|---|---|
| `show_diagram: riemann_sum` (left + midpoint) | harvested | ✅ excellent (v2 has a label nit — below) |
| `show_diagram: slope_field` | harvested | ✅ excellent (minor label nit — below) |
| `show_diagram: parametric_curve` (unit circle) | harvested | ✅ good (slightly polygonal) |
| `show_diagram: polar_graph` (cardioid) | authored | ✅ correct cardioid (judge FP — below) |
| `show_diagram: taylor_polynomial_overlay` (eˣ + T4) | authored | ✅ excellent |
| `show_function_graph` cubic (x³−3x, via **Desmos**) | authored | ✅ perfect |
| `show_diagram: t_chart` | harvested | ✅ (concept table) |

## Real findings

### 1. Emission bug — the brain draws polar curves the wrong way (CONTENT)
Asked to "graph the polar curve r = 2 + 2cos(θ)", the brain emitted
`show_function_graph` with a **Cartesian-implicit** expression
(`\sqrt{x^2+y^2} - 2 - 2(x/\sqrt{x^2+y^2})`) in a **y=f(x)** slot. Desmos then
faithfully plotted that as a function → a **parabola, not a cardioid**. The
purpose-built `polar_graph` kind renders the cardioid perfectly (authored
fixture), so this is a **tool-selection / prompt** issue: for polar curves the
brain should use `show_diagram(polar_graph)` (or Desmos native `r = …` polar),
not a Cartesian-implicit `show_function_graph`. Surfaced precisely because the
harness now tests the real Desmos path.

### 2. Two cosmetic label-collision nits — FIXED
- `riemann_sum` midpoint (v2): the method/area metadata overlapped the rising
  curve + rightmost rectangle in the top-right.
- `slope_field`: the "dy/dx = x − y" label sat on the plot border / top tick.
Both moved to **caption divs above the plot** (the same fix as the Macro shift
labels) — collision-proof since the slope field / curve fill the plot interior.

## Process notes (not render defects)
- **Vision-judge false-positive:** it flagged the authored cardioid as a
  "dimpled limaçon … doesn't reach the pole." It does — `r=2+2cosθ` is a
  cardioid (cusp at θ=π) and renders correctly. Documents that the LLM-judge can
  over-flag; verdicts still need a human glance on edge geometry.
- **Harvest robustness:** 2 of 6 sessions died on network/nav errors
  (`ERR_NETWORK_CHANGED`, "navigation interrupted") — lost the Taylor and
  derivative sessions; covered those tools with authored fixtures instead.
- **Desmos path verified:** the clean cubic renders perfectly via the production
  Desmos renderer (powered-by-desmos watermark), confirming the new fidelity.

## Final state
- **Deterministic gate: 9/9 pass.**
- **Vision-judge: 5/9 at audit time** — 1 real emission bug (polar function-graph),
  2 cosmetic label nits (now FIXED), 1 judge false-positive (cardioid). All
  purpose-built render tools render correctly.
