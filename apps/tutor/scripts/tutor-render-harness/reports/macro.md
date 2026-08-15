# AP Macroeconomics — Whiteboard Tool-Render Audit

**Pilot course for the tool-render audit harness.** Verifies that every
render-producing tool AP Macro actually uses draws correctly — deterministically
(no brain) and visually (Claude-vision).

## How it was run
1. **Curate** the expected render-tool set from the course's plans + the econ
   diagram kinds (`diagrams/catalog/kinds/economics.ts`) + CED content.
2. **Harvest** (`npm run test:render-harvest -- macro`): drive real claude-brain
   sessions on 7 Macro plans with a *base* turn + a *shift* turn each; capture the
   raw `{tool, args}` the brain emits (`window.__tutorToolCalls`) → fixtures +
   reconcile report.
3. **Gate** (`npm run test:render-tools -- macro`): render every fixture through
   the real `CommandRenderer` (via `processToolCall`); pass = not-rejected + no
   render error. Deterministic, free, CI-able.
4. **Vision-judge** (`npm run test:render-judge -- macro`): Claude-vision over
   each screenshot — "is this a correct, non-broken rendering?" Catches overlap /
   clipping / garbled layout the gate can't.

## Tools covered
`show_diagram` is the **modern, preferred** tool (many legacy tools are
deprecated *in favor of* it; `show_svg_diagram` is the deprecated free-form one).
The 7 econ kinds are `show_diagram` catalog kinds. Macro tested:

| Tool / kind | Fired? | Variants harvested |
|---|---|---|
| `show_diagram: aggregate_demand_supply` | ✅ | base + shifted (×3) |
| `show_diagram: money_market` | ✅ | base + shifted (×2) |
| `show_diagram: loanable_funds` | ✅ | base + shifted (×2) |
| `show_diagram: phillips_curve` | ✅ | base + shifted (×2) |
| `show_diagram: production_possibilities` | ✅ | base + shifted (×3) |
| `show_diagram: foreign_exchange_market` | ✅ | base + shifted (×3) |
| `show_diagram: business_cycle` | ✅ | base (×1) |
| `show_equation` | ❌ never emitted | hand-fixtured (smoke) |
| `show_table` | ❌ never emitted | hand-fixtured (smoke) |
| `show_diagram: historical_timeline` | ⚠️ emitted *unexpectedly* | base (×1) |

## Bugs found — both FIXED

### 1. `historical_timeline` rendered garbled (HIGH)
A `"Today"` event (no digits) parsed to **year 0**, was sorted to the front,
making `minY = 0` and squishing the real 1958–1970 events into an overlapping
sliver at the far right. Also: the year regex `\d{1,4}` parsed `"10 Jul 1776"`
as year **10**.
**Fix** (`advanced-math-ela-social.ts` + `CatalogAdvancedRenderers.tsx`): require
a 3–4 digit year; when any date has no parseable year, fall back to **even
spacing in author order** (don't sort); renderer uses real `min`/`max`.
Regression test: `npm run test:timeline`.

### 2. `phillips_curve` compressed into the corner (HIGH)
The renderer hardcoded `AXIS_MAX = 100`, but the brain emits real percentages
(`nairu:5, inflation:3`), so the SRPC drew as a tiny segment in the bottom-left.
**Fix** (`PhillipsCurveRenderer.tsx`): adaptive axis scaled to the data extent
(handles single-digit % *and* the legacy 0–100 convention). Found by the
vision-judge (the deterministic gate had passed it).

## Cosmetic nits — OPEN (low priority)
- **Floating `AD₂` / `D₂` labels** hover near the *supply* curve in the AD-AS and
  FX shift diagrams while the actual shifted curve is the dashed `…'` one —
  redundant/ambiguous label placement.
- **PPC growth** marks point A with a **blue** dot not present in the figure's own
  legend (green = on-curve / red = inside / orange = outside).

## Emission observations (not render defects)
- The Macro brain lives almost entirely in the **diagram tools** — it never
  reached for `show_equation` / `show_table`, even on a direct "make a table"
  request (it folded the summary into the diagram/speech). A prompt/pedagogy lever
  if more tabular/equation output is wanted; not a correctness issue.
- It emitted `historical_timeline` for the Phillips history unprompted — creative,
  off the expected econ set.

## Final state
- **Deterministic gate: 20/20 pass.**
- **Vision-judge: 19/19 pass** (1 n/a = the intentionally-rejected empty-table edge fixture).
- 2 real render bugs fixed; 2 cosmetic nits open.

## Reusability
The harness is course-agnostic. To audit the next AP course: add a harvest config
block (plans + targeted utterances + expected set) in `harvest.ts`, then run
harvest → gate → judge. The seam (`process-tool-call.ts`) and route already cover
every render tool.
