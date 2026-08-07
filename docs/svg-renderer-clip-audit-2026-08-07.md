# SVG renderer label-clip audit — 2026-08-07

Follow-up to the FractionBar "anted square out" fix (embed-1786139818867, commit
`009dc645`). All 108 SVG-bearing whiteboard files (≈140 renderer components,
including multi-component Catalog files) were statically audited for the bug
class, and a sample of findings was verified headlessly against the real
components (`scripts/audit-svg-text-extents.ts` — 8/8 flagged renderers
violate, fixed FractionBar control clean).

**Bug class:** content-driven `<text>` (brain-authored label/title/note) in SVG
user units + viewBox computed only from shape geometry + no wrapping /
truncation / width-estimate / HTML fallback ⇒ the SVG viewport clips the text
at the viewBox edge (both sides when `textAnchor="middle"` over a small shape).

Width heuristic throughout: `chars × fontSize × 0.55`.

## Verified by headless render (audit harness)

| Renderer | Violation confirmed |
|---|---|
| TapeDiagramRenderer `bars[].name` | "Marcus's savings" → est [-74, 88] in [0, 720] (anchor=end at x=88) |
| FoodWebRenderer level labels | **deterministic**: "Primary consumers" AND "Secondary consumers" clip on every web with those levels |
| PieChartRenderer legend | "Students who bike to school (30)" → [362, 591] in [0, 480] |
| FractionComparisonRenderer (bars) | "two-thirds of the pizza" → [-109, 68] in [0, 600] |
| CoordinatePlaneRenderer `points[].label` | "(10, 5) maximum" → [506, 597] in [0, 520] |
| TreeRenderer in-SVG `title` | 56-char title → [-154, 338] in [-40, 224] |
| VennDiagramRenderer `title` | 61-char title → [-18, 518] in [0, 500] |
| BarChartRenderer `categories[]` | "Renewable electricity sources" → [486, 677] in [0, 640] |

## CLIP-PRONE — Tier 1 (deterministic or fires on defaults/typical input)

| # | Renderer · prop | Site | Budget / trigger |
|---|---|---|---|
| 1 | FoodWebRenderer · `LEVEL_LABELS` | FoodWebRenderer.tsx:147 (anchor=end at x=80) | deterministic — any web with consumers |
| 2 | CatalogEnergyPyramidRenderer · `units`+`energy` | CatalogBioAnatomyRenderers.tsx:677 (x=538, W=640) | clips with solver defaults ("10,000 kcal/m²/yr") |
| 3 | TapeDiagramRenderer · `bars[].name` | TapeDiagramRenderer.tsx:59-70 (anchor=end, x=88) | 11 chars; type doc suggests names |
| 4 | CatalogLogicGateRenderer · `inputs[]`/`output` | CatalogCSRenderers.tsx:477/490 (x=14 end / W-14 start, W=320) | ~1 glyph past defaults A/B/Y |
| 5 | PieChartRenderer · `slices[].label` | PieChartRenderer.tsx:55 (legend x=362, W=480) | ~16 chars incl. " (value)"; label required |
| 6 | CoordinatePlaneRenderer · `points[]`/`vectors[].label`, `yLabel` | CoordinatePlaneRenderer.tsx:326/301/235 | even "(10, 5)" overflows at xMax; brain sets tight ranges |

## CLIP-PRONE — Tier 2 (realistic lesson payloads)

- **FractionComparisonRenderer** Bars (`:35`, 68u left gutter ≈ 8 chars) + Circles (`:90`, W = count×140 — the exact FractionBar failure).
- **TreeRenderer** in-SVG `title` (`:590`, node-only viewBox — the R38 disease un-fixed) + `node.label`/`value`/branch labels (`:414-443`, fixed 80u boxes).
- **VennDiagramRenderer** `title` + `sets[].label` + `neither` region (`:385/:438/:82`, hardcoded 500×400 + hand-tuned anchors).
- **WritingFrameRenderer** all stem/hint props (`:71-123`, sentences by design, unwrapped in 520u; "Hook + thesis. Thesis: " prefix eats 23 chars).
- **GraphicOrganizerRenderer** `kwl.learned[]` + `t_chart.rightItems[]`/headers (`:111-131` — bare `<text>` while sibling variants correctly use `foreignObject`).
- **GeometryRenderer** point + segment labels (`:1046-1117`, geometry-fit range with 1.5-math-unit pad; collision resolver is bounds-blind).
- **StatsRenderer**: shell `title` (`:1302`), PieChart (`:522`), DistributionChart `probabilityLabel` (`:788`), Scatter `highlightPoint.label` (`:1192`).
- **BarChartRenderer** `categories[]` (`:74`) + rotated `yLabel` (`:47`).
- **ScatterPlotRenderer** `points[].label` (`:247`, ~11 chars at rightmost point).
- **ReactionCoordinateRenderer** `product_label`/`units` (`:340-359`, 132u right margin); reactant/curve labels = overlap.
- **ScatterRegressionRenderer** `highlightPoint.label` (`:154`, ~9 chars for right-edge outlier).
- **ProductionPossibilitiesRenderer** `points[].label` (`:233`, 18u at xAxis.max).
- **CatalogPhaseDiagramRenderer** `critical`/`triple`/`marker.label` (`:71-84`; even fallback "critical point" clips at t≥0.9).
- **CatalogVectors3DRenderer** vector/point/line/plane labels (`:76-135`; projection deliberately fills the frame).
- **CatalogNutrientCycleRenderer** `reservoirs[].label` (`:159`; box estimate capped at 168 and never widens W).
- **CatalogSimpleCircuitRenderer** `components[].label`/`value` (`:64-102`; corner component at (60,60); labels also inherit rotate(180/270) — separate defect).
- **AdAsRenderer** `labels.ad`/`sras`/`lras` (`:114-175`, anchor=start at line ends ~x524 of 580).
- **CatalogPhScaleRenderer** `markers[].label` at pH 0/14 (`:661`, centers x=56/724 of 780).
- **CatalogCoordinateGridRenderer** `points[].label` (`:401`; flipX guard sized for "(x, y)" only).
- **CatalogCycleStagesRenderer** `stages[].label` (`:88`, ring nodes at x=90/430 of 520).
- **BusinessCycleRenderer** `markers[].label` at t≈0/1 (`:123`).
- **CatalogBinaryTreeRenderer** node values (`:386`; W = 2^(depth-1)×80 — depth-only).
- **LinkedListRenderer** `items[]` (`:213`, 54u cells, first center x=51).
- **CatalogComplexPlaneRenderer** `points[].label` (`:976`, 25u at re=range; default "a + bi" string can clip).
- **CatalogFlowchartSimpleRenderer** back/skip-edge labels (`:99`, x=W-44 anchor=start; node text already width-aware — the one leak).
- **PhonicsRenderer** `renderSyllables` (`:121`, fontSize 48 in fixed 480) + blend/sound-out at high counts.
- **PolarGraphRenderer** / **ParametricCurveRenderer** `highlight*.label` (`:118`/`:150`, ~25u at curve edge).
- **CollisionRenderer** `notes`/`momentumAnnotation` (`:713-737` — in-SVG notes instead of shared HTML DiagramNotes).
- **EnergyBarsRenderer** `positions[].label` + `notes` (`:423/:473`, last column ~28-char budget; manifest anticipates parenthetical qualifiers).
- **CellDiagramRenderer** `highlight[].note` (`:246`; clamp sized for organelle names, not notes).
- **EarlyMathRenderer bar_model** `parts[].label`/`question` (`:461-473`, 480-wide canvas, 16-18px).
- **EconMicro ComparativeAdvantageRenderer** conclusion sentence (`:222`, 4 content strings + 66 literal chars, centred).
- **MapRenderer** `regions[].label` (`:445` — pins go through deoverlap, regions don't).
- **NormalCurveRenderer** `markValues[].label` (`:170`, marks near xMin have 50u).
- **MotionDiagramRenderer** `series[].label` (`:200`, rotated — budget is panel half-height).
- **GraphRenderer** Mafs `points[]`/`annotations[].label` (`:225-355`; `.MafsView{overflow:hidden}` enforces the clip).
- **StatsRenderer/BarChart** first/last `categories[]` (`:435`).
- **DiagramRenderer/SvgDiagram** raw brain-authored SVG passthrough (`:1445`; only guard is a +40/+20 viewBox pad) — adjacent class.

## SUSPECT (overlap-first or needs unusual input) — abbreviated

AreaModel cellLabels; BalanceScale pan labels; CatalogSentenceDiagram subject/object; CatalogHierarchyPyramid tiers; CatalogRhetoricalTriangle roles; CatalogEarthLayers names; CatalogGalvanic solutions; CatalogPlateTectonics labels; QueueRenderer items; CatalogGraph nodes; CatalogHashTable entries; StackRenderer items; CatalogStateMachine labels (+self-loop y<0 geometry bug); FreeBody object caption/notes; Histogram yLabel (rotated); Lewis non-symbol "elements"; LoanableFunds/MoneyMarket shift.label; TenFrame label @20px; AreaModel rowLabel; Pedigree individuals; PhillipsCurve shift.label; PopulationPyramid title/ageLabels; PulleySystem labels (Incline/Table scenes lack deoverlap); SimpleMachine units; ClimateDiagram title; ConceptMap nodes (wrap exists, no edge clamp); CycleDiagram middle-anchor descriptions; VectorDiagram (vertical-only deoverlap); Timeline first/last pins; SpringMass chain labels >86 chars; SupplyDemand "Quantity of {good}"; TaylorOverlay exprLabel; UnitCircle arc labels; CatalogVsepr terminals; CatalogSolidOfRevolution y-axis labels; FreeBodyDiagramRenderer notes at 80-char wrap; DnaRenderer 3' at x=512 (cosmetic).

## Out-of-class defects noticed in passing

- CatalogSimpleCircuitRenderer: labels inherit group rotate(180/270) → sideways/upside-down text.
- CatalogStateMachineRenderer: self-loop on a top state puts its label at y≈-18.
- CatalogPendulumRenderer: bob escapes viewBox for length>200 (shape, not text).
- CatalogRayDiagramRenderer: object at large distance → negative x geometry.
- OrbitalDiagramRenderer: ≥10 subshell rows overflow H=360 vertically.
- SimpleMachineRenderer lever: loadArm≫effortArm pushes geometry off-canvas.

## Existing mitigation patterns (the fix toolbox)

1. **`fraction-bar-layout.ts`** (commit 009dc645) — wrap at cap, item box grows to label, shape recentred, viewBox from label-aware boxes. Best for label-under-shape.
2. **`ProjectileMotionRenderer.tsx:197-208`** — `estW` char estimate + `clampX` into viewbox + `deoverlapLabels`. Best for point-anchored labels.
3. **`label-deoverlap.ts:132-145`** — reusable pre-pass clampX (already used by NumberLine, Map pins, Vector, InclinedPlane, Pendulum, Sketch).
4. **HTML outside the SVG** (R38 title fix; `DiagramNotes`; SlopeField `:57-60`; RayDiagram `:397-410`) — for titles/notes/captions.
5. **Wrap + ellipsis + box clamp** (`CatalogHistoricalTimelineRenderer:464-538`) and **truncation** (`CharacterWeb` 14-16 chars; FoodWeb species `truncate(,14)`; `CatalogPlotDiagram` 42 chars).
6. **Width-aware canvas** (`CatalogFlowchartSimpleRenderer` estNodeWidth → W; `CatalogHashTable` note-length max).

## Recommended fix strategy (when approved)

- Batch A (Tier 1, ~6 renderers): mechanical fixes per pattern — biggest win per line.
- Batch B (Tier 2): apply pattern per label type — titles/notes → HTML (pattern 4); anchored labels → clampX (pattern 3); under-shape labels → width-aware layout (pattern 1).
- Every fixed renderer gets a case in `scripts/audit-svg-text-extents.ts` flipped to `expectViolation:false`, turning the audit harness into the permanent regression suite.
