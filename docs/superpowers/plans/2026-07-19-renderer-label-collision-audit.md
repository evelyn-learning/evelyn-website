# Whiteboard renderer label-collision audit + retrofit plan (2026-07-19)

**Trigger:** two live sessions rendered colliding labels —
session-1784320013977 (`showFreeBodyDiagram`: force labels inline on the
arrow axis, 8-char truncation → "Wall pu…", crowding the "You" caption) and
session-1784182146307 / -1784194326500 (`number_line`: segment label
"diameter" composited into point label "diameter piece").

## Root causes (fixed this round)

- **FreeBodyDiagramRenderer** placed labels 16px past the arrow tip *along
  the arrow axis*, center-anchored — for horizontal forces the label sat ON
  the axis and ran back across its own shaft. Its only avoidance handled
  same-direction (<5°) clusters, structurally blind to opposed-horizontal
  forces and the object caption. Fixed: horizontal-ish labels above the
  shaft midpoint, caption-aware arrow start, 20-char name cap, and a
  `deoverlapLabels` pass with the object + shafts + θ zone as obstacles.
- **NumberLineRenderer** had three independent label systems (intervals,
  segments/arcs, points) all targeting the same above-line band; the point
  cluster-row logic only looked at other points. Fixed: one combined
  `deoverlapLabels` pass over every annotation label with the axis band and
  tick numerals as obstacles.

## Shared infrastructure (this round)

- `src/lib/tutor/whiteboard/label-deoverlap.ts` gained `obstacles`
  (immovable boxes labels route around) and `preferDir` (global + per-label
  up/down preference). Fully backward compatible (MapRenderer,
  sketch-render-core untouched; 20/20 existing tests pass).
- `scripts/test-renderer-label-collision.ts` — renders real components
  server-side, parses `<text>`/arrow geometry out of the SVG, asserts no
  label-label, label-arrow, or label-viewbox violations. Extend this file
  with fixtures as more renderers are retrofitted.
- `scripts/label-collision-smoke.ts` — playwright PNG for eyeballing.

## Remaining renderers by risk (audit of all data-positioned label draw sites)

Only TimelineRenderer, MapRenderer and sketch-render-core do real
de-overlap today. Retrofit priority:

**High (same failure family, LLM-positioned labels, no avoidance):**
- Physics: PendulumRenderer, ProjectileMotionRenderer, SpringMassRenderer,
  PulleySystemRenderer, InclinedPlaneRenderer, RayDiagramRenderer,
  CollisionRenderer, WaveRenderer — force/vector/measurement labels at
  computed coordinates, none measure text.
- VectorRenderer + CatalogVectorAdditionRenderer — converging vector labels.
- DiagramRenderer (generic point/label/annotation engine).

**Medium:**
- CoordinatePlaneRenderer (blind index stagger, no width measure),
  ScatterPlotRenderer, MotionDiagramRenderer, BarChartRenderer,
  HistogramRenderer, LinePlotRenderer, GraphRenderer, EnergyBarsRenderer,
  TapeDiagramRenderer, NormalCurve/RiemannSum/ScatterRegression/SlopeField/
  PolarGraph/ParametricCurve/PopulationPyramid.
- Econ curve renderers (SupplyDemand, Phillips, MoneyMarket, LoanableFunds,
  ForeignExchange, PPC, CircularFlow, BusinessCycle) — equilibrium labels
  cluster at curve crossings.
- Catalog mega-files (Advanced/BioAnatomy/Chemistry/CS/CSStructures/
  EarthSpace/EMNuclearMotion/Waves/CellBiology/MolecularBiology) — varies
  per sub-renderer; `truncate` caps length but not position.

**Low (already safe):** TimelineRenderer (row-stacking resolver — good
reference), MapRenderer (uses deoverlapLabels), flow-layout renderers
(Quiz/Passage/WritingFrame/SolvedExample/TryYourself/Equation/Matrix...).

## Retrofit recipe (per renderer)

1. Add a fixture reproducing its worst crowding to
   `test-renderer-label-collision.ts` (fails first).
2. Collect ALL its data-positioned labels into one `deoverlapLabels` call;
   pass fixed geometry (axes, shafts, curves' bboxes, object glyphs) as
   `obstacles`; choose `preferDir` per label from which side of its anchor
   geometry it starts on.
3. Keep each renderer's historical initial placement as the seed position —
   deoverlap only moves labels that actually collide, so existing good
   output stays pixel-identical.
