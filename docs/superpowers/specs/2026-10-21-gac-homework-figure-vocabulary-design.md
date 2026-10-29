# GAC Homework Help — figure vocabulary expansion (design)

**Date:** 2026-10-21 (night) · **Owner:** Praveen · **Author:** Claude (session 15830315) · **Branch:** `gac-29oct` in `evelynlearning` (engine) — academy unchanged unless noted · **Deadline:** before the GAC demo (29 Oct 2026)

Companion to `docs/superpowers/specs/2026-10-20-gac-homework-per-problem-design.md` (the per-problem redesign). That design pre-builds each problem's figure ahead of the session; this one widens what "figure" can be.

## 1. Intent and why

Today the pre-build can draw exactly two things: a planar geometry construction (points, segments, lines, circles, arcs, polygons, conics, angle marks, optionally on a coordinate plane) and a function graph (curves and marked points). Everything else on a grade 9–10 math sheet — a box plot, a histogram, a frequency table, a number line, a cone — gets *no* figure: the problem card has no thumbnail, the board has nothing to point at, and the tutor is told to "refer to the sheet", where it may sketch something unvalidated or nothing at all.

Audit of the four builds of the three sheets uploaded so far (2026-10-21): 29 problems carried a figure description; two were vocabulary gaps (a cone, a box plot); every other failure was a validator/proposer defect since fixed. The owner's ruling on seeing that list: *"We should have all these figures in our vocab built & ready before the demo."*

Success: a GAC student uploads any of the course sheets and every problem whose sheet shows a figure of the kinds below opens with that figure drawn on the board, validated against the sheet's own text, with a real thumbnail on the list — and a figure the builder cannot vouch for is still *no figure* (never a wrong one).

## 2. Goals, non-goals, anti-goals

**Goals**
1. Pre-built, validated figures for the kinds in §3, through the same pipeline the geometry figures use (propose → validate → store → draw on the board → thumbnail).
2. Provenance rule kept whole: every label and every number drawn comes from the problem text; a value the text does not state (an answer, a computed percentage) rejects the figure.
3. Thumbnails for every new kind (the list card's `<img>`), not a "Figure ready" placeholder.
4. No change to the live session contract: the board draws the figure with the existing `CommandRenderer`; the tutor still cannot redraw or clear it.
5. No API spend in tests; unit fixtures come from the stored descriptions of the real sheets.

**Non-goals**
- Composite / stacked solids, solids with a cut-out, cross-sections (the catalog's `solid_3d` draws single primitives, with an optional net).
- Photo-like or labelled real-world pictures, physics apparatus, chemistry — not on GAC math sheets.
- Changing how the photo read describes figures (the `[Figure: …]` block). It already names the kind in its first words ("box plot titled…", "a cone with…"); the proposer reads that.
- Relational claims for the new kinds (the Sonnet claim-extraction stays geometry-only). A box plot has no "point on segment" relation; its truth is its numbers.

**Anti-goals (a failure even if it "works")**
- A figure that shows an answer (the median the student must find, a computed percentage, a volume).
- A figure whose numbers are the proposer's estimates rather than the sheet's ("≈ 9" in the description must appear as 9 in the text, or the figure is not drawn).
- A thumbnail path that costs a model call or that can crash the build (figure-svg is best-effort, as today).
- Any behaviour change for sessions that are not one-problem homework sessions (GAC engine freeze).

## 3. The vocabulary (what gets added)

Each kind is an existing whiteboard command the live board already renders; the work is to let the pre-build propose it, validate it, and thumbnail it. Priority order is the owner's call (open question 1); the builder ships in this order unless told otherwise.

| # | Kind on the sheet | Command | Renderer (exists) | Validation data |
|---|---|---|---|---|
| 1 | Box plot (one or several) | `showStats` type `boxplot` (`boxplot.datasets[]` min/q1/median/q3/max, outliers) | `StatsRenderer` | five numbers + outliers + labels |
| 2 | Histogram | `showStats` type `histogram` (`bins: [lo, hi, count][]`) | `StatsRenderer` | bin edges, counts, axis labels |
| 3 | Dot plot / line plot | `showStats` type `dotplot` (`data: number[]`) | `StatsRenderer` | each value's count |
| 4 | Bar chart | `showStats` type `bar` (`bar.categories/values`) | `StatsRenderer` | categories, values |
| 5 | Pie chart | `showStats` type `pie` (`pie.slices[]`) | `StatsRenderer` | slice labels + stated values only |
| 6 | Scatter plot | `showScatterPlot` (points, optional trend line only if the text gives it) | `ScatterPlotRenderer` (hook-free) | points |
| 7 | Table (frequency, two-way, function, stem-and-leaf as two columns) | `showTable` (`headers`, `rows`) | table renderer | every cell |
| 8 | Number line (points, open/closed intervals, inequality graphs) | `showNumberLine` (min/max/step, points, intervals) | `NumberLineRenderer` | endpoints, points, labels |
| 9 | 3D solid with dimension labels, optional net | `showDiagram` kind `solid_3d` (cube, rectangular prism, triangular prism, cylinder, cone, sphere, square pyramid; `showNet`) | catalog solver + `CatalogSolid3DRenderer` | dims (and their labels) |
| 10 | Venn diagram (2–3 sets, region counts) | `showVennDiagram` (`sets`, `regions`) | `VennDiagramRenderer` | set labels, region values |
| 11 | Tree diagram (probability / outcomes) | `showTree` | `TreeRenderer` | node labels, branch probabilities |
| 12 | Fraction bar / tape diagram / area model | `showFractionBar`; `showDiagram` kinds `tape_diagram`, `area_model` | `FractionBarRenderer`, catalog | parts, labels |
| 13 | Coordinate-plane figure that is not a function graph (plotted shape, transformation, inequality region) | `showCoordinatePlane`; `showDiagram` kinds `transformation`, `inequality_graph`, `coordinate_grid` | `CoordinatePlaneRenderer` (hook-free), catalog | vertices, labels |

Geometry (`showGeometryConstructed`) and function graphs (`showGraph`) stay exactly as they are.

A sheet figure that fits none of these is still "no figure" with a note; the tutor's existing no-figure rule applies.

## 4. How it works (decided)

### 4.1 Types
`FigureCommand` (engine `homework-build/types.ts`) becomes the union of the current two members and the commands in §3, typed from `@core/knowledge/types` `WhiteboardCommand` members (no new shapes invented; `showScatterPlot` is a member, types.ts ~981). `FIGURE_ACTIONS` is the explicit allowlist of actions; `FIGURE_STATS_TYPES` = `histogram | boxplot | dotplot | bar | pie` (a `showStats` of type `distribution`, `scatter`, `scatterplot` or `scatterplot_regression` is rejected — scatter goes through `showScatterPlot`, a trend line only when the text states it); `FIGURE_DIAGRAM_KINDS` the allowlist of `showDiagram` kinds — `solid_3d`, `tape_diagram`, `area_model`, `transformation`, `inequality_graph`, `coordinate_grid`, all present in `diagrams/catalog/manifest.ts` with a solver. Anything outside is rejected by the validator as `unsupported figure kind "…"` (the note the teacher sees).

The academy's zod schema for the status response treats `figure` as opaque already (it never receives it; it gets `hasFigure` and `figureSvg`). No portal-contract bump. Verify, do not assume.

### 4.2 Proposer (Opus 5.5, one call per attempt, as today)
`FIGURE_PROPOSE_SYSTEM` gains a "Figure kinds" section, generated at module load from the vocabulary so prompt and allowlist cannot drift: for each kind, one line naming when to use it and the exact JSON shape (core command fields from the type; for catalog kinds the catalog's own `paramSchema` string from `diagrams/catalog/manifest.ts`). The geometry rules 1–8 stay; two rules are added, phrased generically (never a topic-specific example):

- *Numbers are copied from the problem text as written there. A statistic the problem asks for, or a value you would have to compute, is never drawn — leave it off and say so in note.*
- *Pick the kind the description names; when the description names none of the kinds you have, return "" with a note.*

Prompt size grows by roughly 2–3 K tokens; the build cost target (≤ $0.60/sheet) still holds — measured in the live check, not assumed.

### 4.3 Validator (`figure-validate.ts`, pure, no model call)
`validateFigure` dispatches on action:

- **Structural** — the command must render: for `showDiagram` kinds the catalog solver runs (`diagrams/catalog/kinds/*`; a throw is a rejection with its message); for core commands a per-kind shape check: required fields present, numbers finite, a box plot's five numbers non-decreasing, histogram bins contiguous and non-overlapping, pie values positive, number-line points inside [min, max], table rows rectangular, Venn regions keyed to the declared sets.
- **Provenance** — every free-text field (`title`, labels, categories, headers, cells, node labels) passes `textFieldIsFromText`; every drawn number passes a new `numberIsFromText(value, problemText)`. "Problem text" is the whole stored problem text *including its bracketed `[Figure: …]` description* — that is where a box plot's five numbers or a histogram's counts live, and it is what `validateFigure` already receives as `problemText`. A number matches when the text holds it as a whole token (digits, allowing `≈`, units, thousands separators, a leading sign, a fraction `a/b` or a percentage that parses to the same value) or as a small number word (zero–twenty: the read writes "three dots at 5"). A count the description does not state cannot be drawn; such a figure fails and the note says which number. The label-field list per kind comes from `buildManifestForCommand(cmd)` (`diagrams/manifests.ts`) where a builder exists, so the validator reads the same manifest the brain reads; kinds without a manifest builder get an explicit field list in the validator.
- **No answers** — covered by provenance: a value the sheet does not state (an answer, a computed statistic) is not in the text and fails. A key value that the sheet *does* state (a given 10 cm that is also part (b)'s answer) is a given and passes; there is no separate check against the key, and the runner keeps the figure and key solves in parallel as today.

Reasons are the same free-text strings as today and feed the proposer's second attempt.

### 4.4 Runner, cache, status — unchanged in shape
`buildFigure` keeps its two attempts and the feedback loop; `runner.ts` keeps the cache re-validation added in `9afba7a0` (so cached figures of the old vocabulary are re-checked by the new validator). `status.ts` keeps `hasFigure`/`figureSvg`.

### 4.5 Board
`ProblemFigure` already routes anything that is not constructed geometry through `CommandRenderer`, inside the `leadItem` slot; the slot itself imposes no height (today the non-geometry branch renders at natural height, the geometry branch inside the 280/400 px box). Sizing rule, applied in `ProblemFigure` by kind, no canvas change: stats, scatter, solids, Venn, tree, fraction, coordinate-plane figures get the fixed box; tables and number lines keep natural height (a table in a 400 px box is wrong both ways). The opener-turn board guard and the key-value guard apply unchanged.

### 4.6 Thumbnails (`figure-svg.ts`)
Today: geometry via a hook-free render tree, graphs via a hand-written SVG writer; everything else returns nothing. The first task of the plan is a *spike* (throwaway, ≤ 1 h) that renders each §3 renderer through the version-matched compiled `react-dom/server` the geometry path already loads, and records which survive. Known hazard: hooks across React instances ("Cannot read properties of null (reading 'useMemo')"). For each renderer that fails, the builder picks per kind: (a) a hook-free render function split out like `renderGeometryTree` when its hooks are plain `useMemo`/`useRef` (`StatsRenderer` 2, `TreeRenderer` 1, `FractionBarRenderer` 1 hook), or (b) a small dedicated SVG writer like `graph-svg.ts` (stats and number lines are a few dozen lines each). Tables get a plain SVG grid writer (first 6 rows, ellipsis). Minimum that must ship: box plot, histogram, dot plot, bar, table, number line, solid_3d. If the spike fails for most of them, one generic SVG writer for the stats family (bars, boxes, dots on a scaled axis, the renderer's colours but not its exact look) is acceptable for thumbnails — a thumbnail is a 112×80 px preview — rather than seven bespoke writers. The placeholder text for a figure with no SVG becomes "Figure" (no "ready"), academy side, one line (the academy deploy runs alongside the engine deploy as planned).

### 4.7 Kill switch
`HOMEWORK_FIGURE_KINDS` (engine env): unset or `all` = the whole vocabulary (default ON, house rule); `geometry` = today's two kinds only. Read when a build starts (`runHomeworkBuild`), so a pm2 restart with the new value is enough; it narrows both the proposer's "Figure kinds" section and the validator's allowlist, so under `geometry` a cached new-kind figure fails the cache re-validation (`9afba7a0`) and is retried as geometry-or-nothing.

### 4.8 Tests (no API spend)
- Unit fixtures: the stored descriptions of hw-11 p6 (box plot), hw-9/10 p4 (cone), plus one hand-written description per remaining kind written in the photo read's own style. Each: a good proposal passes, a proposal with an answer value fails on provenance, a malformed one fails structurally.
- `test-homework-figure.ts`, `test-homework-build.ts` extended; a render-harness fixture per kind under `scripts/tutor-render-harness/fixtures` so the board rendering is in the visual review.
- Gate: engine `npm run test:all` with only the two known baseline failures; academy suite unchanged.

## 5. Constraints
- GAC engine freeze: nothing here changes a non-homework-problem session; `FIGURE_ACTIONS` is consulted only by the homework build. Deploy only via `deploy-tutor-gac.sh` after telling GAC.
- Build cost ≤ $0.60/sheet, worst case ~120 s/problem (existing targets).
- The key never reaches the browser; the figure carries no key values (4.3).
- Prompts stay generic (no topic-specific guardrail examples).
- Work in the `gac-29oct` worktree of the engine; the academy worktree only for the one-line placeholder text.

## 6. Left to the builder
- Exact per-kind field lists for provenance where no manifest builder exists.
- Whether stem-and-leaf becomes a `showTable` with two columns or is left out (the owner has not asked for it; leaving it out is acceptable if the table route is ugly).
- The spike's verdict per renderer (4.6) and which of (a)/(b) each kind takes.
- Order of the kinds within the plan after the owner answers open question 1 — default is the table order in §3.

## 7. Open questions (owner)
1. Which sheets will the GAC demo use? If you can share them (or just say which kinds are on them), those kinds go first and the rest follow; otherwise the order in §3 stands.
2. Cut line: the plan ships kinds 1–9 (stats, scatter, table, number line, solids) as the first milestone and 10–13 (Venn, tree, fraction/tape/area, coordinate-plane) as the second; if the 29th arrives between them, the first milestone deploys alone. Agreed?
3. Composite solids and cut-out shapes stay out (non-goal) — agreed?
4. A pie chart or percentage that the sheet does not state as a number is not drawn (anti-goal: no computed values). Agreed, even where that leaves a pie with labels only?

## 8. Calls I made (check these while reading)
- The new kinds have no relational claims; their truth is provenance + structure (3, 4.3).
- "Problem text" for provenance includes the bracketed figure description; small number words count (4.3). No separate check against the key (4.3 "No answers").
- `showStats` is limited to five types; scatter goes through `showScatterPlot` (4.1).
- A generic stats thumbnail writer is acceptable if the spike fails (4.6).
- Tables and number lines are drawn at natural height; everything else in the fixed box (4.5).
- Thumbnails start with a spike; the minimum set is the seven kinds named in 4.6.
- Kill switch name and default (4.7).
