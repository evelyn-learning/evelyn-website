# GAC Homework Figure Vocabulary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the per-problem homework pre-build propose, validate, store, draw and thumbnail 13 more figure kinds (stats family, scatter, table, number line, 3D solid; then Venn, tree, fraction/tape/area, coordinate-plane), with every drawn label and number traced to the problem text.

**Architecture:** One vocabulary module (`figure-vocabulary.ts`) holds the allowlists, the per-kind proposer docs, the board sizing and the `HOMEWORK_FIGURE_KINDS` kill switch; the proposer prompt's "Figure kinds" section and the validator's allowlist are both generated from it, so they cannot drift. `validateFigure` keeps its signature and dispatches to pure per-kind validators (structure + provenance through a new `numberIsFromText`). Thumbnails follow the Task 1 spike's per-renderer verdict; the board draws through the existing `CommandRenderer`.

**Tech Stack:** TypeScript, Next (app router, React 19 canary bundle), tsx script tests (`node:assert`), react-dom/server, Playwright render harness.

**Spec:** `/Users/luke/Dev/evelynlearning/docs/superpowers/specs/2026-10-21-gac-homework-figure-vocabulary-design.md`

**Paths:** `ENG` = `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor` (branch `gac-29oct`); `CORE` = `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/packages/core/src`; `ACAD` = `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct` (branch `gac-29oct`, Task 12 only). All commands run from `ENG` unless stated.

**Owner defaults (spec §7):** kinds in the §3 order; milestone 1 = kinds 1–9 (Tasks 2–13), milestone 2 = kinds 10–13 (Tasks 14–17); composite solids stay out; a pie or percentage the sheet does not state as a number is not drawn, even if that leaves a pie with labels only.

## Global Constraints

- Work only in the `gac-29oct` engine worktree; the academy worktree only for the one-line placeholder (Task 12). No push, no deploy in this plan (deploy later via `deploy-tutor-gac.sh` after telling GAC).
- GAC engine freeze: nothing changes a session that is not a one-problem homework session; the vocabulary is consulted only by the homework build and `ProblemFigure`.
- No live model call and no paid API call in any test or step. Fixtures are the stored sheet descriptions or hand-written ones in the photo read's style.
- Prompts stay generic: no topic-specific guardrail examples.
- Kill switch `HOMEWORK_FIGURE_KINDS`: unset or `all` = the whole vocabulary (default ON); `geometry` = today's two kinds only; read when a build starts (`runHomeworkBuild`).
- `showStats` types limited to `histogram | boxplot | dotplot | bar | pie`; `distribution`, `scatter`, `scatterplot`, `scatterplot_regression` are rejected.
- Rejection note for anything outside the vocabulary: `unsupported figure kind "…"`.
- Provenance: every free-text field passes `textFieldIsFromText`; every drawn number passes `numberIsFromText(value, problemText)`; "problem text" includes the bracketed `[Figure: …]` description. No separate check against the key.
- `figure-svg` stays best-effort: never throws, no model call, result ≤ `FIGURE_SVG_MAX_CHARS` (65,536).
- Board: stats, scatter, solids, Venn, tree, fraction and coordinate-plane figures in the fixed `h-[280px] sm:h-[400px]` box; tables and number lines at natural height.
- No portal-contract bump. Verified: the academy receives only `hasFigure`/`figureSvg` (`ACAD/apps/api/src/engine/homework-types.ts:35`, `figureSvg: z.string().max(65536).optional()`), never `figure`.
- Tests that touch Mongo use the local test mongod (`mongodb://127.0.0.1:27017/evelyn-test-homework-build`), never port 2710.
- Every commit message ends with the two attribution lines from the session (`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and the `Claude-Session:` line).

## Review Focus

1. **Catalog solver defaults.** `solveSolid3D` fills missing dims from `DEFAULT_DIMS`, maps aliases (`pyramid`, `ball`) and falls back to `rectangular_prism`, so a cone with no height would be drawn with `h=6`. A person expects no figure, not invented numbers. Task 7 pins a test.
2. **Numbers the renderer computes.** `showPercentages` on a pie prints computed percentages. `showTrendLine` on a scatter draws a least-squares line and prints `R² = …`. A histogram given raw `data` bins itself. In milestone 2, `showLeafProbabilities`, `showComparison` and the area model's default `showProducts` also print computed values. Each is rejected unless every printed number is in the text. Tests are in Tasks 4, 6, 14 and 15.
3. **Digits inside other tokens.** "P1", "x2", "15" when looking for 5, "2023" when looking for 20, and "twenty-one" must not count as a stated number. Task 3 pins a test.
4. **Kill switch flipped between builds.** Under `geometry`, a cached new-kind figure is re-validated, rejected and retried, never copied. Values such as `" Geometry "` or `ALL` behave as written, and an unknown value means `all`. Task 2 pins a test.
5. **Long tables and big figures.** A 40-row table thumbnail shows 6 rows and an ellipsis row, stays under the cap and never throws. A table is never squeezed into the 400 px box. Tasks 9 and 10 pin tests.

---

## File structure

| File | Responsibility |
|---|---|
| `ENG/src/lib/tutor/homework-build/figure-vocabulary.ts` (new) | allowlists, `FigureVocabulary`, env reader, `figureKindId`, `FIGURE_KIND_DOCS`, `figureKindsSection`, `figureBoxMode` |
| `ENG/src/lib/tutor/homework-build/figure-text.ts` (new) | label/text provenance helpers moved out of `figure-validate.ts` + `numberIsFromText`, `parseNumberCell` |
| `ENG/src/lib/tutor/homework-build/figure-validate-data.ts` (new) | per-kind validators for core commands (stats, table, number line, scatter; M2 Venn, tree, fraction bar, coordinate plane) |
| `ENG/src/lib/tutor/homework-build/figure-validate-diagram.ts` (new) | `showDiagram` catalog kinds (solid_3d; M2 tape, area, transformation, inequality, grid) |
| `ENG/src/lib/tutor/homework-build/figure-validate.ts` | dispatcher + vocabulary gate; re-exports moved helpers |
| `ENG/src/lib/tutor/homework-build/types.ts` | `FigureCommand` union |
| `ENG/src/lib/tutor/homework-build/figure-build.ts` | `figureProposeSystem(v)`, `parseFigure`, caption-title normalisation, vocabulary threading |
| `ENG/src/lib/tutor/homework-build/runner.ts` | reads the kill switch, threads it |
| `ENG/src/lib/tutor/homework-build/figure-svg.ts` + writers per spike (`stats-svg.ts`, `table-svg.ts`, `number-line-svg.ts`) | thumbnails |
| `ENG/src/app/tutor/components/session/ProblemFigure.tsx` | sizing rule |
| `ENG/scripts/tutor-render-harness/fixtures/homework/figure-*.json` | visual review fixtures |
| Tests: `ENG/scripts/test-homework-figure.ts` (pure validators, provenance), `ENG/scripts/test-homework-build.ts` (vocabulary, prompt, build, svg, runner), `ENG/scripts/test-problem-panel.ts` (ProblemFigure source, fixtures) | |

Test commands and their pass lines:
- `npx tsx scripts/test-homework-figure.ts`: last line `N passed, 0 failed`
- `npx tsx scripts/test-homework-build.ts`: last line `N passed, 0 failed`, and no `SKIP:` line. Start a local mongod first, e.g. `brew services start mongodb-community`. Without it, sections 1 and 5 are skipped and the runner tests do not run.
- `npx tsx scripts/test-problem-panel.ts`: last line `N passed, 0 failed`

---

### Task 1: Thumbnail spike (throwaway, ≤ 1 h, nothing committed)

**Files:**
- Create (temporary, deleted at the end of the task): `ENG/scripts/spike-figure-thumbs.tsx`, `ENG/src/app/api/spike-figure-svg/route.ts`
- Modify: this plan's **Spike ledger** (below), and nothing else

**Interfaces:**
- Consumes: the renderer loader in `figure-svg.ts` (`loadRenderer`/`renderToStaticMarkup`, module-private; copy it into the spike files, do not export it); the renderers `StatsRenderer` (`StatsRenderer.tsx:1300`), `ScatterPlotRenderer` (default export), `NumberLineRenderer`, `CatalogSolid3DRenderer` (`{ figure: Solid3DFigure }`, feed it `solveDiagram('solid_3d', params)` from `diagrams/catalog/manifest.ts`), `VennDiagramRenderer`, `TreeRenderer`, `FractionBarRenderer`, `CoordinatePlaneRenderer` (default export), `CatalogDispatch` (tape_diagram, area_model, transformation, inequality_graph, coordinate_grid), and `CommandRenderer` for `showTable` (the table is inline in `WhiteboardCanvas.tsx:3052`).
- Produces: the filled ledger. Tasks 9 and 14–16 read it.

- [ ] **Step 1: tsx pass.** Write `scripts/spike-figure-thumbs.tsx`. It renders one sample of each renderer above through `react-dom/server` `renderToStaticMarkup` and prints `kind ok <bytes>` or `kind FAIL <message>`. Use the render-harness fixture args in `scripts/tutor-render-harness/fixtures/stats/authored-show-stats-*.json` and the `solid_3d` cone fixture as samples. Run `npx tsx scripts/spike-figure-thumbs.tsx`.
- [ ] **Step 2: Next pass, where the hooks hazard lives.** Write `src/app/api/spike-figure-svg/route.ts`, a `GET` that does the same through the copied version-matched loader and returns JSON `{ [kind]: 'ok <bytes>' | 'FAIL <message>' }`. Run `npx next dev -p 3046`, then `curl -s localhost:3046/api/spike-figure-svg`. Expect "Cannot read properties of null (reading 'useMemo')" for renderers that use hooks.
- [ ] **Step 3: Fill the ledger** (one row per renderer). Verdict rule:
  - Next ok: render through the renderer.
  - Next FAIL, and the hooks are plain `useMemo`/`useRef`, and the owner wants the board's exact look: (a) split out a hook-free tree, the way `renderGeometryTree` is split.
  - Otherwise: (b) a dedicated SVG writer.
  - If most of the stats family fails, use one generic stats writer (`stats-svg.ts`) for all five types plus scatter (spec §4.6).
  - Tables always use (b), `table-svg.ts`.
- [ ] **Step 4: Delete the spike files.** Run `rm scripts/spike-figure-thumbs.tsx src/app/api/spike-figure-svg/route.ts && git status --short`. Expected: only this plan file is modified. Do not commit the spike code.

**Spike ledger** (filled by Task 1):

| Renderer | tsx | Next route | Verdict |
|---|---|---|---|
| StatsRenderer boxplot / histogram / dotplot / bar / pie | | | |
| ScatterPlotRenderer | | | |
| NumberLineRenderer | | | |
| table (CommandRenderer) | n/a | n/a | (b) `table-svg.ts` |
| CatalogSolid3DRenderer | | | |
| VennDiagramRenderer / TreeRenderer / FractionBarRenderer | | | |
| CoordinatePlaneRenderer / CatalogDispatch (tape, area, transformation, inequality, grid) | | | |

---

### Task 2: Vocabulary module, types, kill switch, dispatcher gate

**Files:**
- Create: `ENG/src/lib/tutor/homework-build/figure-vocabulary.ts`, `ENG/src/lib/tutor/homework-build/figure-text.ts`
- Modify: `types.ts:9-11` (FigureCommand), `figure-validate.ts` (move helpers; dispatcher at `:562-569`), `figure-build.ts` (`parseFigure` `:240-247`, `buildFigure` opts, `FigureBuildDeps.propose` input), `runner.ts` (`runHomeworkBuild`)
- Test: `ENG/scripts/test-homework-build.ts` (section 2 for pure, section 3 for build, section 5 for runner)

**Interfaces:**
- Produces, in `types.ts`:
  ```ts
  export type FigureStatsType = 'histogram' | 'boxplot' | 'dotplot' | 'bar' | 'pie';
  export type FigureDiagramKind = 'solid_3d' | 'tape_diagram' | 'area_model' | 'transformation' | 'inequality_graph' | 'coordinate_grid';
  type Cmd<A extends WhiteboardCommand['action']> = Extract<WhiteboardCommand, { action: A }>;
  export type StatsFigure = Cmd<'showStats'> & { type: FigureStatsType };
  export type DiagramFigure = Cmd<'showDiagram'> & { type: FigureDiagramKind };
  export type FigureCommand = <existing geometry> | <existing graph> | StatsFigure | Cmd<'showScatterPlot'> | Cmd<'showTable'> | Cmd<'showNumberLine'> | DiagramFigure;
  ```
  (Milestone 2 adds `Cmd<'showVennDiagram'> | Cmd<'showTree'> | Cmd<'showFractionBar'> | Cmd<'showCoordinatePlane'>`.) `WhiteboardCommand` comes from `@core/knowledge/types`.
- Produces, in `figure-vocabulary.ts`:
  - `export type FigureVocabulary = 'all' | 'geometry'`
  - `export const FIGURE_ACTIONS: readonly string[]`. It starts as `['showGeometryConstructed', 'showGraph']`; each kind task appends its action.
  - `export const FIGURE_STATS_TYPES: readonly FigureStatsType[]`, starting `[]`.
  - `export const FIGURE_DIAGRAM_KINDS: readonly FigureDiagramKind[]`, starting `[]`.
  - `export interface FigureKindDoc { id: string; when: string; shape: string; box: 'fixed' | 'natural' }`
  - `export const FIGURE_KIND_DOCS: readonly FigureKindDoc[]`, starting `[]`. Each kind task appends its entries.
  - `export function figureVocabularyFromEnv(env: Record<string, string | undefined> = process.env): FigureVocabulary`
  - `export function figureKindId(figure: { action?: unknown; type?: unknown }): string`. It returns `"showStats:<type>"` and `"showDiagram:<type>"`, and the bare action otherwise.
  - `export function isFigureKindAllowed(id: string, v: FigureVocabulary): boolean`
- Produces, in `figure-text.ts`: the moved `normalise`, `tokenize`, `isCaptionLabel`, `labelIsFromText`, `textFieldIsFromText`, `phraseInText` and `textFieldReasons`, all exported. `figure-validate.ts` re-exports `isCaptionLabel`, `labelIsFromText` and `textFieldIsFromText`, so existing imports keep working.
- Produces, in `figure-validate.ts`: `FigureContext` becomes `{ problemText: string; claims: FigureClaim[]; vocabulary?: FigureVocabulary }`, with `vocabulary` defaulting to `'all'`.
- Produces, in `figure-build.ts`:
  - `buildFigure(problem, deps, opts: { maxAttempts?: number; vocabulary?: FigureVocabulary } = {})`
  - `FigureBuildDeps.propose(input: { text; feedback?; previous?; vocabulary?: FigureVocabulary })`
  - `parseFigure` returns any JSON object whose `action` is a string. It throws only for non-JSON or for an object with no string `action`.

- [ ] **Step 1: Write the failing tests.** In section 2, `vocabulary: env, kind ids, gate`:
  ```ts
  assert.equal(figureVocabularyFromEnv({}), 'all');
  assert.equal(figureVocabularyFromEnv({ HOMEWORK_FIGURE_KINDS: 'all' }), 'all');
  assert.equal(figureVocabularyFromEnv({ HOMEWORK_FIGURE_KINDS: ' Geometry ' }), 'geometry');
  assert.equal(figureVocabularyFromEnv({ HOMEWORK_FIGURE_KINDS: 'ALL' }), 'all');
  assert.equal(figureVocabularyFromEnv({ HOMEWORK_FIGURE_KINDS: 'nonsense' }), 'all');   // default ON
  assert.equal(figureKindId({ action: 'showStats', type: 'boxplot' }), 'showStats:boxplot');
  assert.equal(figureKindId({ action: 'showDiagram', type: 'solid_3d' }), 'showDiagram:solid_3d');
  assert.equal(figureKindId({ action: 'showTable' }), 'showTable');
  assert.ok(isFigureKindAllowed('showGraph', 'geometry') && isFigureKindAllowed('showGeometryConstructed', 'geometry'));
  const v = validateFigure({ action: 'showMolecule' } as never, { problemText: 'x', claims: [] });
  assert.deepEqual(v, { ok: false, reasons: ['unsupported figure kind "showMolecule"'] });
  ```
  Also add a drift test that holds at every stage:
  - every `FIGURE_KIND_DOCS` id's action is in `FIGURE_ACTIONS`;
  - every `showStats:*` doc type is in `FIGURE_STATS_TYPES`, and every `showDiagram:*` doc type is in `FIGURE_DIAGRAM_KINDS`;
  - every member of `FIGURE_STATS_TYPES` and `FIGURE_DIAGRAM_KINDS`, and every `FIGURE_ACTIONS` member other than the geometry two, has exactly one doc, or at least one for `showStats`/`showDiagram`;
  - every `showDiagram` kind has a solver: `isImplementedKind(kind)` from `diagrams/catalog/manifest.ts`.

  In section 3, `parseFigure keeps an unknown action for the validator to name`:
  - `parseFigure('{"action":"showMolecule"}')` deep-equals `{ action: 'showMolecule' }`;
  - `parseFigure('{"x":1}')` throws.

  The build test: a stub proposer returns `{ action:'showStats', type:'distribution' }` on both attempts. Expect `r.figure === null` and `r.note` matching `/unsupported figure kind "showStats:distribution"/`.

  In section 5 (runner, needs mongod), `HOMEWORK_FIGURE_KINDS=geometry: a cached figure outside the vocabulary is retried, not copied`:
  1. Seed `gen-v0` `ready`, with text `'Box [Figure: box plot]'` and figure `{ action:'showStats', type:'boxplot', boxplot:{ datasets:[] } }`.
  2. Set `process.env.HOMEWORK_FIGURE_KINDS = 'geometry'`, run `runHomeworkBuild('gen-v1', …)` with stub deps, and restore the env in `finally`.
  3. Expect `order` to equal `[text]`, the stored figure to be `null`, and the stub's `propose` to have been called with `vocabulary === 'geometry'`.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-build.ts`. Expected: FAIL, because `figure-vocabulary` cannot be resolved.
- [ ] **Step 3: Implement.**
  - Create the vocabulary module. `figureVocabularyFromEnv` trims and lower-cases the value. `geometry` gives `'geometry'`, unset or `all` gives `'all'`, and any other value gives `'all'` after `console.warn('[homework-build] HOMEWORK_FIGURE_KINDS="<raw>" not recognised, using all')`.
  - `isFigureKindAllowed`: under `geometry`, only the two geometry ids. Under `all`, those two plus every `FIGURE_KIND_DOCS` id.
  - Move the text helpers into `figure-text.ts` unchanged.
  - Dispatcher: compute the id first and reject anything not allowed with `unsupported figure kind "${id}"`. Keep the existing geometry and graph branches, and route new actions to the per-kind validators that later tasks add.
  - `parseFigure` as specified above. Thread `vocabulary` through `buildFigure` into `propose` and `validateFigure`.
  - In `runHomeworkBuild`, after `problems` is known: `const vocabulary = figureVocabularyFromEnv();`. Pass it to the cached-figure `validateFigure` and to every `buildFigure` call.
- [ ] **Step 4: Run the tests to verify they pass.** Run `npx tsx scripts/test-homework-build.ts && npx tsx scripts/test-homework-figure.ts`. Expected: both end `N passed, 0 failed`, and every existing test still passes.
- [ ] **Step 5: Commit.** Run `git add src/lib/tutor/homework-build scripts/test-homework-build.ts && git commit -m "feat(homework-figure): figure vocabulary module, HOMEWORK_FIGURE_KINDS kill switch (default all), unsupported-kind gate"`

---

### Task 3: `numberIsFromText` provenance helper

**Files:**
- Modify: `ENG/src/lib/tutor/homework-build/figure-text.ts`
- Test: `ENG/scripts/test-homework-figure.ts`

**Interfaces:**
- Produces:
  - `export function numberIsFromText(value: number, problemText: string): boolean`
  - `export function parseNumberCell(s: string): number | null`. It parses a cell or label written as a number: sign, thousands separators, decimal, `a/b`, a trailing `%` (gives the percentage number) and units. Anything else gives `null`.

- [ ] **Step 1: Write the failing test** `numberIsFromText: whole tokens, signs, separators, fractions, percentages, small number words`:
  ```ts
  const T = (v: number, t: string) => numberIsFromText(v, t);
  assert.ok(T(9, 'the median is ≈ 9 minutes'));
  assert.ok(T(1200, 'a total of 1,200 people'));
  assert.ok(T(-3, 'a closed dot at −3'));  assert.ok(!T(3, 'a closed dot at −3'));
  assert.ok(T(0.5, 'shade 1/2 of the bar'));
  assert.ok(T(25, '25% chose red') && T(0.25, '25% chose red'));
  assert.ok(T(10, 'a height of 10 cm') && T(10, 'height 10cm'));
  assert.ok(T(1.5, 'a step of 1.50'));
  assert.ok(T(3, 'three dots at 5') && T(20, 'Twenty students') && T(0, 'zero'));
  // Review Focus 3: a digit inside another token is not a stated number
  for (const [v, t] of [[1, 'point P1'], [2, 'x2 + 1'], [5, '15 students'], [20, 'in 2023'], [21, 'twenty-one'], [9, 'about 19']] as const) assert.ok(!T(v, t), `${v} in "${t}"`);
  assert.equal(parseNumberCell('1,200'), 1200); assert.equal(parseNumberCell('3/4'), 0.75); assert.equal(parseNumberCell('Red'), null);
  ```
- [ ] **Step 2: Run the test to verify it fails.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: FAIL (not exported).
- [ ] **Step 3: Implement.** Normalise the text with `normalise`, which already maps `−‒–` to `-`. Scan numeric tokens with a left boundary of no letter or digit, plus an optional sign immediately before the digits, and a right boundary of no digit. Letters, `%` and `°` may follow (units). Token forms are `d{1,3}(,ddd)+(.d+)?`, `d+(.d+)?`, and `d+/d+`. Each token yields its value; a `%` token also yields value/100. Match with `Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b))`. Number words `zero` through `twenty` match only as whole words that are not hyphen-joined to another number word, case-insensitive.
- [ ] **Step 4: Run the test to verify it passes.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: `N passed, 0 failed`.
- [ ] **Step 5: Commit.** Run `git commit -am "feat(homework-figure): numberIsFromText, a drawn number is a whole token or small number word of the problem text"`

---

### Task 4: Stats family (box plot, histogram, dot plot, bar, pie)

**Files:**
- Create: `ENG/src/lib/tutor/homework-build/figure-validate-data.ts`
- Modify: `figure-vocabulary.ts` (append `'showStats'` to `FIGURE_ACTIONS`, all five types to `FIGURE_STATS_TYPES`, five docs with `box: 'fixed'`), `figure-validate.ts` (route `showStats`)
- Test: `ENG/scripts/test-homework-figure.ts`

**Interfaces:**
- Consumes: `numberIsFromText`, `textFieldIsFromText`, `textFieldReasons` (Task 3, Task 2); `StatsFigure` (Task 2).
- Produces: `export function validateStatsFigure(fig: StatsFigure, ctx: FigureContext): string[]`

Rules (each line is one reason string; tests match the quoted words):
- **Every type:**
  - `title`, `xLabel` and `yLabel` pass `textFieldReasons`; axis labels pass with `axis: true`.
  - Any field the type does not use is rejected: `showStats field "<k>" is not used by a <type>`.
- **boxplot:**
  - `datasets` has length ≥ 1.
  - Per box: `box plot <i>: min ≤ q1 ≤ median ≤ q3 ≤ max fails`.
  - Each outlier is outside [min, max]: `box plot <i>: outlier <v> is inside the whiskers`.
  - min, q1, median, q3, max and every outlier pass `numberIsFromText`: `number <v> in boxplot.datasets[<i>].<field> does not come from the problem text`.
  - `label` passes as a text field (an empty label is allowed).
- **histogram:**
  - `bins` is non-empty, each bin being `[lo, hi, count]` with `lo < hi` and `count` a non-negative integer.
  - Neighbouring bins meet exactly: `histogram bins are not contiguous at <hi> / <lo>`.
  - Every lo, hi and count passes `numberIsFromText`.
  - `data` present → `a histogram takes bins only (raw data would be binned by the renderer)`.
- **dotplot:**
  - `data` is non-empty and finite.
  - For each distinct value v with count c: v passes `numberIsFromText`, and c passes when `c === 1 || numberIsFromText(c)`. Otherwise: `dot plot: <c> dots at <v> is not stated in the problem text`.
- **bar:**
  - `categories.length === values.length ≥ 1`.
  - Every category passes as a text field; every value is finite and passes `numberIsFromText`.
- **pie:**
  - `slices.length ≥ 2`.
  - A value ≤ 0 → `pie slice "<label>" value must be positive`.
  - Every value passes `numberIsFromText`; labels pass as text fields.
  - `showPercentages: true` → reject unless every computed percentage (`value / sum * 100`, rounded to 1 dp the way the renderer does) passes `numberIsFromText`. The reason is `pie percentages are computed, not stated` (Review Focus 2).

- [ ] **Step 1: Write the failing tests.** Fixtures:
  - `BOX`: `'The box plot shows the minutes students spent on homework. Find the interquartile range. [Figure: A box plot titled "Homework Minutes" above a number line from 0 to 60 marked every 10. The left whisker starts at 12, the box runs from 20 to 41 with the median line at 30, and the right whisker ends at 55.]'`
  - `HIST`: `'[Figure: A histogram of "Test Scores". Bars: 50–60 has height 3, 60–70 has 7, 70–80 has 12, 80–90 has 11, 90–100 has 7. The vertical axis is labelled Frequency.]'`
  - `DOT`: `'[Figure: A dot plot of "Pets per household": two dots at 0, four dots at 1, three dots at 2, one dot at 4.]'`
  - `BAR`: `'[Figure: A bar graph "Favorite Fruit": Apple 8, Banana 5, Cherry 3.]'`
  - `PIE`: `'[Figure: A pie chart of 40 votes: Red 10, Blue 18, Green 12.]'`

  Per kind, write three tests: a good proposal passes `validateFigure(..., { problemText, claims: [] })`; a proposal carrying an answer value fails on provenance; a malformed proposal fails structurally. Exact cases:
  - **BOX:**
    - The good proposal is `{min:12,q1:20,median:30,q3:41,max:55,label:''}` with title `'Homework Minutes'`.
    - Answer: `q3: 42` → reason matches `/number 42 .*does not come from the problem text/`. The title `'IQR = 21'` → reason matches `/label "IQR = 21"/`.
    - Malformed: `q1: 35` → `/min ≤ q1 ≤ median ≤ q3 ≤ max fails/`.
  - **HIST:**
    - Good: the bins exactly as stated, with `yLabel: 'Frequency'`.
    - Answer: an extra bin `[100, 110, 2]` → `/number 110/`.
    - Malformed: `[[50,60,3],[65,70,7]]` → `/not contiguous at 60 \/ 65/`. `data: [55, 61]` → `/takes bins only/`.
  - **DOT:**
    - Good: `data: [0,0,1,1,1,1,2,2,2,4]`.
    - Answer: five dots at 1 → `/5 dots at 1/`.
    - Malformed: `data: []`.
  - **BAR:**
    - Good: the stated categories and values.
    - Answer: `values: [8,5,4]` → `/number 4/`.
    - Malformed: 3 categories and 2 values.
  - **PIE:**
    - Good: the slices with values 10, 18 and 12.
    - Answer: `showPercentages: true` → `/computed, not stated/`.
    - Malformed: a slice with value 0 → `/must be positive/`.
  - **Rejected types:** each of `distribution`, `scatter`, `scatterplot` and `scatterplot_regression` → `/unsupported figure kind "showStats:/`.
  - **Kill switch:** the good BOX figure under `vocabulary: 'geometry'` → `unsupported figure kind "showStats:boxplot"`.
  - **Real fixture:** run the SAME three-case shape on the stored hw-11 p6 text. Fetch it read-only:
    1. `../../scripts/ops/mongo-tunnel.sh start`
    2. `set -a; . ./.env.local; set +a; mongosh "$MONGODB_URI" --quiet --eval 'db.homeworkbuilds.find({"problems.text":/box plot/i},{"problems.n":1,"problems.text":1}).toArray()'`

    Paste the problem text verbatim as `HW11_P6`. Build the good proposal from the numbers in that text, the answer case from a number not in it, and the malformed case by swapping q1 and q3. If the record is gone, write `HW11_P6 not retrievable` in the commit body and skip only this test.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: FAIL (`unsupported figure kind "showStats:boxplot"`).
- [ ] **Step 3: Implement** `validateStatsFigure` per the rules above, add the vocabulary entries, and route `showStats` in the dispatcher. Each doc's `shape` is the exact JSON the proposer must emit:
  - boxplot: `{"action":"showStats","type":"boxplot","title"?,"xLabel"?,"boxplot":{"datasets":[{"label","min","q1","median","q3","max","outliers"?:[…]}],"showValues"?}}`
  - histogram: `{"action":"showStats","type":"histogram","title"?,"xLabel"?,"yLabel"?,"bins":[[lo,hi,count],…],"showCounts"?}`
  - dotplot: `{"action":"showStats","type":"dotplot","title"?,"xLabel"?,"data":[one value per dot]}`
  - bar: `{"action":"showStats","type":"bar","title"?,"xLabel"?,"yLabel"?,"bar":{"categories":[…],"values":[…]}}`
  - pie: `{"action":"showStats","type":"pie","title"?,"pie":{"slices":[{"label","value"}]}}`

  `when` is one generic line naming the kind on the sheet.
- [ ] **Step 4: Run the tests to verify they pass.** Run `npx tsx scripts/test-homework-figure.ts && npx tsx scripts/test-homework-build.ts`. Expected: both `N passed, 0 failed`, including the drift test.
- [ ] **Step 5: Commit.** Run `git add -A src/lib/tutor/homework-build scripts/test-homework-figure.ts && git commit -m "feat(homework-figure): stats family (box plot, histogram, dot plot, bar, pie), structural + provenance validation"`

---

### Task 5: Table and number line

**Files:**
- Modify: `figure-validate-data.ts`, `figure-vocabulary.ts` (append `showTable` and `showNumberLine`, both docs `box: 'natural'`), `figure-validate.ts` (routes)
- Test: `ENG/scripts/test-homework-figure.ts`

**Interfaces:**
- Produces:
  - `export function validateTableFigure(fig: Extract<FigureCommand, { action: 'showTable' }>, ctx: FigureContext): string[]`
  - `export function validateNumberLineFigure(fig: Extract<FigureCommand, { action: 'showNumberLine' }>, ctx: FigureContext): string[]`

Rules:
- **Table:**
  - `headers.length ≥ 1` and `rows.length ≥ 1`.
  - Rows are rectangular: `table row <i> has <n> cells, headers have <h>`.
  - Each header and cell is either `''`, or a cell where `textFieldIsFromText(cell) || (parseNumberCell(cell) !== null && numberIsFromText(parseNumberCell(cell)!, text))`. Otherwise: `table cell "<cell>" does not come from the problem text`.
  - Stem-and-leaf: accepted only as a two-column table that passes these same rules. There is no special code; the doc's `when` line says "a stem-and-leaf display as two columns".
- **Number line:**
  - `min < max`; `step > 0` when given.
  - `min`, `max` and `step` are axis scaffolding and are not provenance-checked (the same as graph ranges).
  - Points, interval ends and segment ends lie in [min, max]: `number line point <v> is outside [<min>, <max>]`.
  - Every point `value` passes `numberIsFromText`.
  - Every interval `from`/`to` passes `numberIsFromText`, unless it equals `min` or `max` (a ray running off the line).
  - Every segment `from`/`to` passes `numberIsFromText`. `fractionTicks.denominator` passes `numberIsFromText`.
  - All labels and the title pass as text fields.

- [ ] **Step 1: Write the failing tests.** Fixtures:
  - `TABLE`: `'[Figure: A frequency table with columns "Score" and "Frequency": 1 – 4, 2 – 6, 3 – 5, 4 – 2.]'`
  - `NL`: `'Write the inequality shown. [Figure: A number line from −5 to 5 marked every 1. An open circle at −2 with an arrow shading to the right.]'`

  Cases:
  - **TABLE:**
    - Good: headers `['Score','Frequency']` and the four rows.
    - Answer: an added row `['Total','17']` → `/table cell "17"/`.
    - Malformed: a 3-cell row → `/row 2 has 3 cells, headers have 2/`.
    - Blank cells: `['5','']` passes when the text gives 5.
  - **NL:**
    - Good: `min:-5,max:5,step:1`, `intervals:[{from:-2,to:5,fromInclusive:false}]`, `points:[{value:-2,style:'open'}]`.
    - Answer: a point label `'x > -2'` passes only if the text states it. Here it is not stated → `/label "x > -2"/`.
    - Malformed: a point at 7 → `/outside \[-5, 5\]/`.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: FAIL, unsupported kind.
- [ ] **Step 3: Implement** per the rules. The shapes are:
  - table: `{"action":"showTable","headers":[…],"rows":[[…],…]}` (every row as long as headers; a cell the sheet leaves blank is "")
  - number line: `{"action":"showNumberLine","title"?,"min","max","step"?,"points"?:[{"value","label"?,"style"?:"filled"|"open"}],"intervals"?:[{"from","to","fromInclusive"?,"toInclusive"?,"label"?}]}`
- [ ] **Step 4: Run the tests to verify they pass.** Run `npx tsx scripts/test-homework-figure.ts && npx tsx scripts/test-homework-build.ts`. Expected: `N passed, 0 failed`.
- [ ] **Step 5: Commit.** Run `git commit -am "feat(homework-figure): table and number-line figures, every cell and point from the text"`

---

### Task 6: Scatter plot

**Files:**
- Modify: `figure-validate-data.ts`, `figure-vocabulary.ts` (append `showScatterPlot`, doc `box: 'fixed'`), `figure-validate.ts`
- Test: `ENG/scripts/test-homework-figure.ts`

**Interfaces:**
- Produces: `export function validateScatterFigure(fig: Extract<FigureCommand, { action: 'showScatterPlot' }>, ctx: FigureContext): string[]`

Rules:
- `points.length ≥ 1`. Every x and y is finite and passes `numberIsFromText`.
- `label`, `series`, `title`, `xLabel` and `yLabel` pass as text fields.
- `xRange` and `yRange` are not provenance-checked.
- `notes` is rejected unless it passes as a text field.
- `showTrendLine: true` is always rejected with `a trend line is drawn by least squares with a computed R²; it is never part of a homework figure`. This is a deliberate narrowing of spec §3 row 6: `ScatterPlotRenderer.tsx:223-235` computes the line and always prints `R² = …`, which is a computed value (anti-goal).

- [ ] **Step 1: Write the failing tests.** Fixture `SCAT`: `'[Figure: A scatter plot of hours studied (x) and score (y) with points (1, 62), (2, 70), (3, 75), (4, 83), (5, 88).]'`. Cases:
  - Good: the five points with `xLabel:'x'` and `yLabel:'y'` pass.
  - Answer: an extra point `(6, 93)` → `/number 6/` or `/number 93/`.
  - Trend line: `showTrendLine:true` → `/computed R²/`.
  - Malformed: `points: []`.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** The shape is `{"action":"showScatterPlot","title"?,"xLabel"?,"yLabel"?,"points":[{"x","y","label"?}],"xRange"?,"yRange"?}`.
- [ ] **Step 4: Run the tests to verify they pass.** Run `npx tsx scripts/test-homework-figure.ts && npx tsx scripts/test-homework-build.ts`. Expected: `N passed, 0 failed`.
- [ ] **Step 5: Commit.** Run `git commit -am "feat(homework-figure): scatter plot figures (stated points only, no computed trend line)"`

---

### Task 7: 3D solid (`showDiagram` type `solid_3d`)

**Files:**
- Create: `ENG/src/lib/tutor/homework-build/figure-validate-diagram.ts`
- Modify: `figure-vocabulary.ts` (append `showDiagram` and `solid_3d`, doc `box: 'fixed'`), `figure-validate.ts`
- Test: `ENG/scripts/test-homework-figure.ts`

**Interfaces:**
- Consumes: `solveDiagram`, `getDiagramKind` (`diagrams/catalog/manifest.ts`); `DiagramFigure`.
- Produces:
  - `export function validateDiagramFigure(fig: DiagramFigure, ctx: FigureContext): string[]`. It dispatches on `fig.type`; milestone 2 adds kinds.
  - `export const SOLID_DIMS: Record<'cube'|'rectangular_prism'|'triangular_prism'|'cylinder'|'cone'|'sphere'|'square_pyramid', readonly string[]>`, as follows: cube `['side']`; rectangular_prism `['length','width','height']`; triangular_prism `['base','triHeight','length']`; cylinder `['radius','height']`; cone `['radius','height']`; sphere `['radius']`; square_pyramid `['base','height']`.

Rules:
- `params.shape` must be one of the seven exact keys. Aliases such as `pyramid` or `ball`, and any unknown shape, give `solid_3d shape "<s>" is not one of …` (Review Focus 1).
- `params.dims` holds exactly the shape's keys, each finite and > 0:
  - a missing key gives `solid_3d <shape> needs dims <keys>`, because the solver would draw its default;
  - an extra key gives `solid_3d dim "<k>" is not drawn for a <shape>`.
- `showNet: true` with `sphere` → `a sphere has no net`.
- `solveDiagram('solid_3d', params)` must not throw; a throw becomes a reason carrying its message.
- Every dim value passes `numberIsFromText`. This catches a computed height on a cone the sheet gives by slant height.
- `params.title` passes as a text field.

- [ ] **Step 1: Write the failing tests.** Fixtures:
  - `CONE`: `'Find the volume of the cone. Leave your answer in terms of π. [Figure: A cone with a radius of 4 cm drawn from the centre of the base to its edge and a height of 9 cm drawn as a dashed line from the apex to the centre of the base.]'`
  - `SLANT`: `'[Figure: A cone with radius 3 and slant height 5.]'`

  Cases:
  - Good: `{action:'showDiagram',type:'solid_3d',params:{shape:'cone',dims:{radius:4,height:9}}}` passes.
  - Answer: `params.title:'V = 48π'` → `/label "V = 48π"/`. On SLANT, `dims:{radius:3,height:4}` → `/number 4/`.
  - Malformed:
    - `dims:{radius:4}` → `/needs dims radius, height/`;
    - `shape:'pyramid'` → `/is not one of/`;
    - `{shape:'sphere',dims:{radius:2},showNet:true}` with text `'sphere of radius 2'` → `/no net/`;
    - `type:'supply_demand'` → `/unsupported figure kind "showDiagram:supply_demand"/`.
  - Real fixture: the stored hw-9/10 p4 cone text (`HW910_P4`), fetched the same way as in Task 4 with `/cone/i`. Use the same three-case shape and the same not-retrievable rule.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** The doc shape is `{"action":"showDiagram","type":"solid_3d","params":{` + `getDiagramKind('solid_3d')!.paramSchema` + `}}`, generated at module load, not copied by hand.
- [ ] **Step 4: Run the tests to verify they pass.** Run `npx tsx scripts/test-homework-figure.ts && npx tsx scripts/test-homework-build.ts`. Expected: `N passed, 0 failed`.
- [ ] **Step 5: Commit.** Run `git add -A src/lib/tutor/homework-build scripts/test-homework-figure.ts && git commit -m "feat(homework-figure): solid_3d figures, exact shape and dims, no solver defaults drawn"`

---

### Task 8: Proposer "Figure kinds" section, two new rules, caption titles

**Files:**
- Modify: `ENG/src/lib/tutor/homework-build/figure-vocabulary.ts` (`figureKindsSection`), `figure-build.ts` (`FIGURE_PROPOSE_SYSTEM` `:35-62`, `normalizeFigureDisplay` `:166-203`, `defaultFigureBuildDeps.propose`)
- Test: `ENG/scripts/test-homework-build.ts` (sections 2 and 3)

**Interfaces:**
- Produces:
  - `export function figureKindsSection(v: FigureVocabulary): string`. It returns `''` for `'geometry'`.
  - `export function figureProposeSystem(v: FigureVocabulary): string`
  - `export const FIGURE_PROPOSE_SYSTEM = figureProposeSystem('all')`. The name is kept; existing tests read it.

The `all` prompt equals the `geometry` prompt with one block inserted immediately before `\n\nStep reference`. The `geometry` prompt is today's prompt unchanged. The block contains:
1. The heading `Figure kinds (figure_json holds ONE of these when the sheet's figure is not a geometry construction or a function graph):`, followed by one line per `FIGURE_KIND_DOCS` entry: `- <when> <shape>`.
2. Rules 11 and 12, verbatim:
   - `11. Numbers are copied from the problem text as written there. A statistic the problem asks for, or a value you would have to compute, is never drawn — leave it off and say so in note.`
   - `12. Pick the kind the description names; when the description names none of the kinds you have, return "" with a note.`

`normalizeFigureDisplay` gains one rule for the new kinds: a `title` (or `params.title` for `showDiagram`) that `isCaptionLabel` accepts and `textFieldIsFromText` rejects is dropped. Every other new-kind figure passes through unchanged.

- [ ] **Step 1: Write the failing tests.**
  - In section 2, `figure kinds section: generated from the vocabulary, rules 11–12 verbatim, geometry prompt unchanged`:
    ```ts
    const all = figureProposeSystem('all'), geo = figureProposeSystem('geometry');
    const cut = geo.indexOf('\n\nStep reference');
    assert.ok(all.startsWith(geo.slice(0, cut)) && all.endsWith(geo.slice(cut)));
    for (const d of FIGURE_KIND_DOCS) assert.ok(all.includes(d.shape), d.id);
    assert.ok(all.includes(getDiagramKind('solid_3d')!.paramSchema));
    assert.ok(all.includes('11. Numbers are copied from the problem text as written there. A statistic the problem asks for, or a value you would have to compute, is never drawn — leave it off and say so in note.'));
    assert.ok(all.includes('12. Pick the kind the description names; when the description names none of the kinds you have, return "" with a note.'));
    assert.ok(!geo.includes('Figure kinds') && !geo.includes('11. Numbers are copied'));
    assert.equal(FIGURE_PROPOSE_SYSTEM, all);
    ```
  - In section 3, `the proposer is given the build's vocabulary`: a stub `propose` records `input.vocabulary`. `buildFigure(p, deps, { vocabulary: 'geometry' })` records `'geometry'`, and the default records `'all'`.
  - Also in section 3, `a caption-like stats title not on the sheet is dropped, not fatal`: on BOX (Task 4), with title `'Distribution Of Student Homework Times'`, the stored figure has no `title` and `ok`. With title `'Homework Minutes'`, the title is kept.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-build.ts`. Expected: FAIL (`figureProposeSystem` not exported).
- [ ] **Step 3: Implement.** Build the prompt from a base string (today's text) plus `figureKindsSection(v)`. In `defaultFigureBuildDeps.propose`, use `figureProposeSystem(input.vocabulary ?? 'all')`.
- [ ] **Step 4: Run the tests to verify they pass.** Run `npx tsx scripts/test-homework-build.ts`. Expected: `N passed, 0 failed`, with all the existing prompt assertions (lines ~177–180, 235–240, 640–656) still passing.
- [ ] **Step 5: Commit.** Run `git commit -am "feat(homework-figure): proposer Figure kinds section generated from the vocabulary; rules 11-12; caption titles dropped"`

---

### Task 9: Thumbnails (per the Task 1 ledger)

**Files:**
- Modify: `ENG/src/lib/tutor/homework-build/figure-svg.ts` (`figureToSvg` `:63-86`)
- Create, as the ledger requires: `ENG/src/lib/tutor/homework-build/stats-svg.ts`, `table-svg.ts`, `number-line-svg.ts`. For an (a) verdict, also a hook-free `render<Name>Tree` export beside the renderer, split the way `renderGeometryTree` is (`GeometryRenderer.tsx:1577`).
- Test: `ENG/scripts/test-homework-build.ts` (section 2, beside the existing `figureToSvg` tests at ~394)

**Interfaces:**
- Consumes: the ledger verdicts, `FIGURE_SVG_MAX_CHARS`, and the figure types.
- Produces (only those the ledger selects):
  - `export function statsToSvg(fig: StatsFigure | Extract<FigureCommand, { action: 'showScatterPlot' }>): string | null`. One scaled axis, plus bars, boxes, dots or pie wedges in `DIAGRAM_COLORS` from `diagrams/theme.ts`.
  - `export function tableToSvg(fig: Extract<FigureCommand, { action: 'showTable' }>): string | null`. A plain grid with the header row plus the first 6 rows, then one row of `…` when there are more.
  - `export function numberLineToSvg(fig: Extract<FigureCommand, { action: 'showNumberLine' }>): string | null`
- `figureToSvg` keeps its signature. It dispatches on `figureKindId`, wraps every branch in try/catch → `null`, and applies the same root-`<svg>` clean-up (no `class`/`style` on the root, `xmlns` present) and the size cap.

- [ ] **Step 1: Write the failing test** `figureToSvg: the minimum new-kind set gives an svg document`. For each good figure from Tasks 4–7 (box plot, histogram, dot plot, bar, table, number line, solid_3d):
  ```ts
  const svg = await figureToSvg(fig);
  assert.ok(svg && /^<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg) && /viewBox=/.test(svg) && !/^<svg[^>]* class=/.test(svg), id);
  assert.ok(svg.length <= FIGURE_SVG_MAX_CHARS); assert.equal(await figureToSvg(fig), svg, 'deterministic');
  ```
  Then:
  - The table thumbnail contains `Score` and `Frequency`.
  - A 40-row table gives an svg with exactly 7 body rows (6 plus the `…` row) under the cap (Review Focus 5).
  - Pie and scatter: `figureToSvg` resolves to a string or `null`, never a rejection.
  - A malformed stats figure (`boxplot: {}`) resolves to `null`.
- [ ] **Step 2: Run the test to verify it fails.** Run `npx tsx scripts/test-homework-build.ts`. Expected: FAIL (`null` for box plot).
- [ ] **Step 3: Implement** the routes per the ledger.
- [ ] **Step 4: Run the test to verify it passes, and check inside Next.** Run `npx tsx scripts/test-homework-build.ts`; expected `N passed, 0 failed`. For each kind routed through a renderer, re-run the Task 1 Next route check once against the real `figureToSvg`, using a temporary route that is deleted afterwards and not committed. Expected: no `useMemo` error.
- [ ] **Step 5: Commit.** Run `git add -A src/lib/tutor/homework-build src/app/tutor/components/whiteboard scripts/test-homework-build.ts && git commit -m "feat(homework-figure): list thumbnails for the stats family, table, number line and solid_3d"`

---

### Task 10: ProblemFigure sizing rule

**Files:**
- Modify: `ENG/src/lib/tutor/homework-build/figure-vocabulary.ts` (`figureBoxMode`), `ENG/src/app/tutor/components/session/ProblemFigure.tsx:20-23`
- Test: `ENG/scripts/test-homework-build.ts` (section 2), `ENG/scripts/test-problem-panel.ts` (~line 71)

**Interfaces:**
- Produces: `export function figureBoxMode(figure: FigureCommand): 'fixed' | 'natural'`. It returns the doc's `box` for `figureKindId(figure)`; `showGraph` gives `'natural'` (unchanged) and `showGeometryConstructed` gives `'fixed'`.

- [ ] **Step 1: Write the failing tests.**
  - Section 2: `figureBoxMode` gives `'fixed'` for box plot, histogram, scatter and solid_3d, and `'natural'` for table, number line and `showGraph`.
  - `test-problem-panel.ts`, in the same section as the existing `pf` checks:
    ```ts
    has(pf, /figureBoxMode\(figure\) === 'fixed'/);
    has(pf, /h-\[280px\] sm:h-\[400px\][^"]*\[&_svg\]:h-full/);
    has(pf, /<CommandRenderer command=\{figure as unknown as WhiteboardCommand\} \/>/);
    ```
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-build.ts; npx tsx scripts/test-problem-panel.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** For a non-geometry figure where `figureBoxMode(figure) === 'fixed'`, wrap `CommandRenderer` in `<div data-testid="problem-figure" className="mx-auto flex h-[280px] sm:h-[400px] justify-center py-1 [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full">`. Otherwise render `CommandRenderer` bare, as today. The geometry branch is unchanged.
- [ ] **Step 4: Run the tests to verify they pass.** Run `npx tsx scripts/test-homework-build.ts && npx tsx scripts/test-problem-panel.ts`. Expected: both `N passed, 0 failed`.
- [ ] **Step 5: Commit.** Run `git commit -am "feat(homework-figure): board sizing, data figures in the fixed box, tables and number lines at natural height"`

---

### Task 11: Render-harness fixtures

**Files:**
- Create: `ENG/scripts/tutor-render-harness/fixtures/homework/figure-boxplot.json`, `figure-histogram.json`, `figure-dotplot.json`, `figure-bar.json`, `figure-pie.json`, `figure-scatter.json`, `figure-table.json`, `figure-number-line.json`, `figure-solid-cone.json`
- Test: `ENG/scripts/test-problem-panel.ts` (beside the ws3p5 fixture test at ~214)

**Interfaces:**
- Consumes: `toWhiteboardCommand` (`src/lib/tutor/whiteboard/process-tool-call.ts:70`), `validateFigure`, and the good figures and texts from Tasks 4–7.
- Each fixture: `{ "label": "figure-<kind>", "tool": "<snake_case of the action>", "expect": "render", "args": <the good figure minus action>, "problemText": "<its fixture text>" }`. The tool names are `show_stats`, `show_scatter_plot`, `show_table`, `show_number_line` and `show_diagram` (args `{type, params}`).

- [ ] **Step 1: Write the failing test** `every homework figure fixture is a valid figure for its text`. For each `fixtures/homework/figure-*.json`: `cmd = toWhiteboardCommand(f.tool, f.args)`, `assert.ok(FIGURE_ACTIONS.includes(cmd.action))`, and `assert.deepEqual(validateFigure(cmd, { problemText: f.problemText, claims: [] }), { ok: true })`. Also assert the count is ≥ 9.
- [ ] **Step 2: Run the test to verify it fails.** Run `npx tsx scripts/test-problem-panel.ts`. Expected: FAIL (count 0).
- [ ] **Step 3: Write the nine fixtures.**
- [ ] **Step 4: Verify.** Run `npx tsx scripts/test-problem-panel.ts`; expected `N passed, 0 failed`. Then start the dev server on :3006 (`npm run dev`), run `npm run test:render-tools -- homework`, and confirm every fixture shows pass. Review the screenshots in `scripts/tutor-render-harness/reports/` by eye.
- [ ] **Step 5: Commit.** Run `git add scripts/tutor-render-harness/fixtures/homework scripts/test-problem-panel.ts && git commit -m "test(homework-figure): render-harness fixture per new figure kind"`

---

### Task 12: Academy placeholder text "Figure"

**Files:**
- Modify: `ACAD/apps/web/components/homework/HomeworkProblemList.tsx:135`, `ACAD/apps/web/components/homework/HomeworkProblemPreview.tsx:54`

- [ ] **Step 1: Check the current text.** Run `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && grep -rn "'Figure ready'" apps/web/components`. Expected: 2 hits.
- [ ] **Step 2: Change the text.** In both files, `'Figure ready'` becomes `'Figure'`. `'Graph ready'` is unchanged (spec §4.6 names only the figure placeholder).
- [ ] **Step 3: Verify.** Run `grep -rn "Figure ready" apps/web/components`; expected no output. Run `npm run typecheck:web`; expected exit 0.
- [ ] **Step 4: Commit in the academy worktree.** Run `git commit -am "fix(homework): a figure with no thumbnail says Figure, not Figure ready"`

---

### Task 13: Milestone 1 gate

- [ ] **Step 1: Run the focused suites.** Run `npx tsx scripts/test-homework-figure.ts && npx tsx scripts/test-homework-build.ts && npx tsx scripts/test-problem-panel.ts`. Expected: each ends `N passed, 0 failed`, with no `SKIP:`.
- [ ] **Step 2: Typecheck.** Run `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "homework-build|ProblemFigure|whiteboard/(Stats|NumberLine|Scatter|CatalogSolid3D)"`. Expected: no output.
- [ ] **Step 3: Full suite.** Run `env -u ANTHROPIC_API_KEY -u DEEPSEEK_API_KEY npm run test:all`. The keys are unset because `test:material-extract` makes live model calls (no API spend). Expected: the only failures are `test:embed-debug-coverage` and `test:portal-student-scoping`, plus `test:material-extract` only if it fails for want of a key. Confirm that the same keyless failure happens on the commit before Task 2 (record its sha in the ledger during Task 1) before accepting it.
- [ ] **Step 4: Record the milestone.** Add a line to this plan's ledger: `M1 gate: <sha> — deployable alone`.

---

### Task 14 (M2): Venn diagram and tree diagram

**Files:**
- Modify: `types.ts` (add `Cmd<'showVennDiagram'> | Cmd<'showTree'>`), `figure-vocabulary.ts` (append actions and docs, `box: 'fixed'`), `figure-validate-data.ts`, `figure-validate.ts`, `figure-svg.ts` (per ledger, or no thumbnail)
- Create: `fixtures/homework/figure-venn.json`, `figure-tree.json`
- Test: `ENG/scripts/test-homework-figure.ts`, `ENG/scripts/test-homework-build.ts`

**Interfaces:**
- Produces:
  - `export function validateVennFigure(fig, ctx): string[]`
  - `export function validateTreeFigure(fig, ctx): string[]`

Rules:
- **Venn:**
  - 2 or 3 sets.
  - Region keys must belong to that set count:
    - 2 sets: `onlyA`, `onlyB`, `intersection`, `neither`.
    - 3 sets: `onlyA`, `onlyB`, `onlyC`, `AB`, `AC`, `BC`, `ABC`, `neither`.
    - Otherwise: `Venn region "<k>" does not belong to <n> sets`.
  - A region `value` passes `numberIsFromText` when `parseNumberCell` parses it, and otherwise passes as a text field. Items, set labels, `universalLabel` and the title pass as text fields.
- **Tree:**
  - The root passes through `normalizeTreeNode` (`TreeRenderer.tsx:88`).
  - Every node label and `value` passes as a text field. Every branch `probability` passes `numberIsFromText` when it parses as a number (fractions included), and otherwise passes as a text field.
  - `showLeafProbabilities: true` → `leaf probabilities are computed products, not stated` (Review Focus 2).

- [ ] **Step 1: Write the failing tests.** Fixtures:
  - `VENN`: `'[Figure: A Venn diagram of 30 students with circles "Soccer" and "Band": 8 in Soccer only, 5 in both, 10 in Band only, 7 outside both circles.]'`
  - `TREE`: `'[Figure: A tree diagram. First branch: Red 2/5, Blue 3/5. After Red: Red 1/4, Blue 3/4. After Blue: Red 2/4, Blue 2/4.]'`

  Cases:
  - Good: each figure as stated passes.
  - Answer: `regions.intersection.value: '6'` → `/number 6|"6"/`; `showLeafProbabilities:true` → `/computed products/`.
  - Malformed: region key `ABC` on 2 sets → `/does not belong to 2 sets/`; a tree with no root label.
  - Thumbnail: `figureToSvg` gives a string or `null`, never a throw.
  - Fixtures: the harness count assertion becomes ≥ 11.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** The shapes come from the core types: `{"action":"showVennDiagram","title"?,"sets":[{"label"}],"regions":{"<key>":{"value"?,"items"?}},"universalLabel"?}` and `{"action":"showTree","title"?,"type"?:"probability"|…,"root":{"label","children"?:[{"label","probability"?,"node":{…}}]}}`.
- [ ] **Step 4: Run the tests to verify they pass.** Run `npx tsx scripts/test-homework-figure.ts && npx tsx scripts/test-homework-build.ts && npx tsx scripts/test-problem-panel.ts`. Expected: all `N passed, 0 failed`.
- [ ] **Step 5: Commit.** Run `git add -A src scripts && git commit -m "feat(homework-figure): Venn and tree diagram figures (M2)"`

---

### Task 15 (M2): Fraction bar, tape diagram, area model

**Files:**
- Modify: `types.ts` (`Cmd<'showFractionBar'>`), `figure-vocabulary.ts` (`showFractionBar`, plus `tape_diagram` and `area_model` in `FIGURE_DIAGRAM_KINDS`, all `box: 'fixed'`), `figure-validate-data.ts`, `figure-validate-diagram.ts`, `figure-svg.ts` (per ledger)
- Create: `fixtures/homework/figure-fraction-bar.json`, `figure-tape.json`, `figure-area-model.json`
- Test: `ENG/scripts/test-homework-figure.ts`

**Interfaces:**
- Produces: `export function validateFractionBarFigure(fig, ctx): string[]`, and the `tape_diagram` and `area_model` branches of `validateDiagramFigure`.

Rules:
- **Fraction bar:**
  - Each item has an integer `denominator > 0` and an integer `0 ≤ numerator`.
  - `numerator` and `denominator` each pass `numberIsFromText`, or `numerator/denominator` passes as a value.
  - Labels pass as text fields.
  - `showComparison: true` → `a comparison is computed, not stated`.
- **Tape and area model (both):** `solveDiagram` must not throw.
- **Tape:** every segment `length` passes `numberIsFromText`, unless `unknown: true`. Labels and `totalLabel` pass as text fields.
- **Area model:** every `rows`/`cols` entry passes `numberIsFromText`. Unless `params.showProducts === false`, every product `rows[i] * cols[j]` must pass `numberIsFromText`, else `area model products are computed, not stated; set showProducts false`. This is needed because the solver defaults `showProducts` to true (`kinds/area-model.ts:46`). `cellLabels` pass as text fields.

- [ ] **Step 1: Write the failing tests.** Fixtures:
  - `FRAC`: `'[Figure: Two fraction bars: the top shows 3/4 shaded, the bottom shows 2/3 shaded.]'`
  - `TAPE`: `'[Figure: A tape diagram split into 3 equal parts labelled x, with a total of 24 marked above.]'`
  - `AREA`: `'[Figure: An area model for 23 × 14 with the rows split 20 and 3 and the columns split 10 and 4.]'`

  Cases:
  - Good: each passes; the area model needs `showProducts:false`.
  - Answer: the area model with products on → `/products are computed/`; tape `totalLabel:'x = 8'` → `/label "x = 8"/`.
  - Malformed: a fraction denominator of 0, and a tape with `bars: []`.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** Generate the catalog shapes from `getDiagramKind(kind)!.paramSchema`. The fraction-bar shape is `{"action":"showFractionBar","title"?,"items":[{"numerator","denominator","label"?}],"layout"?}`.
- [ ] **Step 4: Run the tests to verify they pass.** Run the three suites as in Task 14. Expected: all `N passed, 0 failed`.
- [ ] **Step 5: Commit.** Run `git add -A src scripts && git commit -m "feat(homework-figure): fraction bar, tape diagram and area model figures (M2)"`

---

### Task 16 (M2): Coordinate-plane figures (`showCoordinatePlane`, `transformation`, `inequality_graph`, `coordinate_grid`)

**Files:**
- Modify: `types.ts` (`Cmd<'showCoordinatePlane'>`), `figure-vocabulary.ts`, `figure-validate-data.ts`, `figure-validate-diagram.ts`, `figure-svg.ts` (per ledger)
  - Vocabulary entries: `showCoordinatePlane`, `transformation` and `coordinate_grid` get `box: 'fixed'`. `inequality_graph` gets `box: 'natural'`, because it draws a number line (a deliberate reading of §4.5).
- Create: `fixtures/homework/figure-coordinate-plane.json`, `figure-transformation.json`, `figure-inequality.json`, `figure-coordinate-grid.json`
- Test: `ENG/scripts/test-homework-figure.ts`, `ENG/scripts/test-homework-build.ts` (`figureBoxMode`)

**Interfaces:**
- Produces: `export function validateCoordinatePlaneFigure(fig, ctx): string[]`, and the three diagram branches.

Rules:
- **Coordinate plane:**
  - Every point x and y passes `numberIsFromText`. Segment and vector endpoints pass too.
  - Labels, `xLabel`, `yLabel` and the title pass as text fields; `notes` is rejected unless it passes as a text field.
  - Ranges are not checked.
- **transformation:**
  - Every `shape.vertices` coordinate and every transform number (`tx`, `ty`, `angleDeg`, `sx`, `sy`) passes `numberIsFromText`.
  - The solver's image vertices must each pass `numberIsFromText`, because the image is often the answer. Otherwise: `the image of a transformation is drawn only when the sheet gives it`.
- **inequality_graph:** `value` passes `numberIsFromText`, `operator` is one of `<`, `>`, `<=`, `>=`, and `variable` passes as a text field.
- **coordinate_grid:** every point coordinate passes `numberIsFromText` and labels pass as text fields. `xMin`/`xMax`/`yMin`/`yMax` are not checked.
- **All three diagram kinds:** `solveDiagram` must not throw.

- [ ] **Step 1: Write the failing tests.** Fixtures:
  - `CP`: `'[Figure: A coordinate plane with triangle ABC at A(1, 2), B(4, 2), C(1, 6).]'`
  - `TR`: `'Reflect triangle ABC over the y-axis. [Figure: triangle with vertices (1, 2), (4, 2), (1, 6) on a grid.]'`
  - `INEQ`: `'[Figure: A number line showing x ≥ 3 with a closed dot at 3.]'`
  - `GRID`: `'[Figure: points P(2, 3) and Q(−1, 4) on a grid.]'`

  Cases:
  - Good: CP, INEQ and GRID pass.
  - Answer: TR with the reflect transform → `/image of a transformation/`, because (−1, 2) and similar are not stated. A CP point D(4, 6) → `/number 6|number 4/` only when it is not in the text. Here D is new, so assert on its label `"D"`.
  - Malformed: `operator: '=='`.
  - Box modes: `figureBoxMode` gives `'natural'` for `showDiagram:inequality_graph` and `'fixed'` for `showCoordinatePlane`.
- [ ] **Step 2: Run the tests to verify they fail.** Run `npx tsx scripts/test-homework-figure.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** Catalog shapes come from the paramSchema. The core shape is `{"action":"showCoordinatePlane","title"?,"xRange"?,"yRange"?,"xLabel"?,"yLabel"?,"points"?:[{"x","y","label"?}],"segments"?:[{"from":{"x","y"},"to":{"x","y"},"label"?}]}`.
- [ ] **Step 4: Run the tests to verify they pass.** Run the three suites. Expected: all `N passed, 0 failed`.
- [ ] **Step 5: Commit.** Run `git add -A src scripts && git commit -m "feat(homework-figure): coordinate-plane, transformation, inequality and grid figures (M2)"`

---

### Task 17: Final gate

- [ ] **Step 1: Focused suites and typecheck.** Repeat Task 13 Steps 1–2. Expected: the same pass lines and no type errors in the touched files.
- [ ] **Step 2: Full suite.** Run `env -u ANTHROPIC_API_KEY -u DEEPSEEK_API_KEY npm run test:all`. Expected: only `test:embed-debug-coverage` and `test:portal-student-scoping` fail, plus the keyless `test:material-extract` if it did so in Task 13.
- [ ] **Step 3: Visual review.** With `npm run dev` on :3006, run `npm run test:render-tools -- homework`. Expected: every `figure-*` fixture passes. Review the screenshots by eye.
- [ ] **Step 4: Prompt hygiene.** Run `npx tsx -e "import('./src/lib/tutor/homework-build/figure-build').then(m=>console.log(m.FIGURE_PROPOSE_SYSTEM.length))"`. Record the length in the ledger. The prompt grows by roughly 2–3K tokens; the build cost (≤ $0.60/sheet) is measured in the live check, not here.
- [ ] **Step 5: Hand-off line in the ledger.** Write: `final gate <sha>; deploy = tell GAC → deploy-tutor-gac.sh (engine) + academy deploy for the placeholder → push`. This plan does not deploy.
