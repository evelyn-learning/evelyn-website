# Tutor v2 figures — handoff (2026-11-13)

## State
- Production :3007 = main `af37e28f` (gate green; `test:all` clean except the two known baseline failures, `embed-debug-coverage` and `portal-student-scoping`).
- v2 is live for evelyn-marketing, Crimsora, evelyntutor. GAC :3008 untouched (deploy only when Praveen asks; its freeze pin no longer blocks code changes).
- Worktree: `/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes` (branch `tutor-fixes`, level with main). Keep it: it holds `apps/tutor/.v2-flags` and `.v2-audio`, and the local dev server runs from it on http://localhost:3019.
- Not yet done: no live lesson has been run since the figure work. Everything was checked as rendered figures only.

## How figures reach the tutor (v2)
- `apps/tutor/src/lib/tutor/v2/figure-catalogue.ts`: `TOOL_FIGURES` (kind, tool, subjects, when, params) is what the tutor and the after-reply board check are offered; `catalogueSubjects()` routes by subject and topic.
- `apps/tutor/src/lib/tutor/v2/drawn-figures.ts`: figures drawn as one SVG. Hand-written ones (refraction, apparent_depth, particles, buoyancy, pipe_flow) and a bridge (`ENGINE`) to the practice-question engine's kinds in `apps/tutor/src/lib/tutor/practice-figure/kinds/` (each module documents its params at the top; a bad spec is refused with the parameter named). Add a kind = one `ENGINE` entry + one `drawn(...)` line in the catalogue + a fixture + a test in `scripts/test-brain-v2.ts`.
- Do not import `practice-figure/render.ts` from v2 (it pulls in react-dom/server); import the kind modules directly.
- Graph block (`board-inline.ts`): `expr | name | dashed` and `| from a to b` / `| x > a`; points `(x, y) open | name`.

## How to check a figure
`cd apps/tutor && TUTOR_E2E_URL=http://localhost:3019 npx tsx scripts/tutor-render-harness/run.ts <fixtures folder>` then open every PNG in `artifacts/tutor-render-harness/<folder>-<timestamp>/`. Fixtures: `scripts/tutor-render-harness/fixtures/` (`v2-cards-6/7/8` are the new v2 figures; `audit-*` are the review sets, typical + stress per kind). Harness quirks: 900×700 viewport (tall figures look cut), `show_molecule` needs ~6 s to load, `show_graphic_organizer` needs `{ "spec": {…} }`.

## Constraints learned today
- Practice-question figures are pinned byte for byte (`scripts/lib/practice-figure-pins-*.json`). The engine uses a frozen force diagram (`practice-figure/FreeBodyDiagramFrozen.tsx`); do not change shared solvers it uses (`bar-chart`, `line-plot`, `coordinate-grid`) without running `test:practice-figure-batch2..5`.
- `src/lib/tutor/diagrams/catalog/manifest.ts` feeds the v1 system prompt: any edit changes `scripts/fixtures/system-prompt-hashes.json` (re-capture it in the same commit).
- A change this wide needs `npm run test:all`, not only the gate's `test:changed`.

## Next: gaps to fill (no figure exists yet)
Order is by how many lessons need it; Praveen has not set an order.
1. Maths: two-way table, linear-programming / half-plane region, sign chart, double number line, sequence plot, sampling-distribution picture. (The engine already has `sign_chart`, `venn_diagram`, `conic_graph`, `shaded_region`, `function_graph` — check these before writing new ones.)
2. Physics: circular motion and orbits, PV diagram, equipotentials and field of several charges, force on a charge or wire in a B field, prism and two-lens systems, RC curve, longitudinal wave. (Engine: `field_diagram`, `induction_loop`, `transformer`, `doppler_wavefronts`, `wave_diagram`.)
3. Chemistry: concentration-vs-time and ICE, lab apparatus, intermolecular forces, periodic trends, Maxwell–Boltzmann, electrolytic cell. (Engine: `electrochemical_cell`, `titration_curve`, `molecular_structure`.)
4. Biology: dihybrid and sex-linked crosses, osmosis/tonicity, population growth curves, action potential, feedback loops, enzyme rate graphs. (Engine: `punnett_square`, `gel_electrophoresis`, `replication_fork`, `operon_map`, `cell_cycle_wheel`.)
5. Earth: tides, greenhouse effect, weather fronts, wind cells, all eight moon phases round Earth.
6. Humanities: shaded historical maps, cost curves and surplus shading, family tree, line chart over time.
7. CS: array with index pointers, trace table, 2D grid trace.

Known weak figures: `show_molecule` for ionic compounds and hydrates (Ketcher scatters them; toolbar heavy); very crowded graph_diagram / state_machine / show_geometry cases; nasal cavity and stomach shapes; swimlane timeline titles truncated; `before_after` panels shrink text (`CatalogDispatch.tsx`).

## Open with Praveen
- Demo lessons for the marketing page: shortlist below; each needs one full run as a lesson before it goes on the site (`apps/marketing/src/components/demos/VoiceTutorLiveDemo.tsx`).
- Still owed from earlier: step 3 ports (GameClass, GDI, GAC to v2); test rows of `probe-*` students in prod (remove only if he asks).

## Demo shortlist proposed (he dislikes projectile motion and Punnett squares for this)
Lead: optics (`evelyn.ap.physics2.optics.v1`), Pythagoras / right triangles (`evelyn.testprep.dsat.right-triangle-trig.v1` or the m8 Pythagorean plan), circuits (`evelyn.g4.sci.physical.circuits-intro.v1`, `evelyn.ap.physics2.circuits.v1`), density and buoyancy (`evelyn.g6.science.physics.density-buoyancy.v1`), cells (`evelyn.g68.science.cell-structure.v1`), supply and demand (`evelyn.g11.ss.econ.supply-demand.v1`).
Second row: fractions (`evelyn.g4.math.equivalent-fractions.v1`), quadratic graphs (`evelyn.hs.alg1.quadratic-graphs-vertex.v1`), moon phases and eclipses (m6 science unit 2), states of matter (`evelyn.g3.sci.physical.states-of-matter.v1`, `evelyn.hs.chem.kinetic-molecular-theory.v1`), Silk Roads (`evelyn.ap.apworld.silk-roads.v1`), probability trees (`evelyn.g7.math.probability.intro.v1`).
