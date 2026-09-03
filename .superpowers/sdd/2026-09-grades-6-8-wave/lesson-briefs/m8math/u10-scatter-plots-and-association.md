# Lesson brief — m8math · Unit 10 Topic 1 · Scatter Plots & Association

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 10 — Bivariate Data: Scatter Plots & Two-Way Tables |
| Topic index in unit | 1 |
| Title | Scatter Plots & Association |
| Slug | `scatter-plots-and-association` |
| Standard | `8.SP.A.1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u10-scatter-plots-and-association.ts` |
| Export symbol | `SEED_M8MATH_U10_SCATTER_PLOTS_AND_ASSOCIATION` |
| Plan id | `evelyn.ms.m8math.scatter-plots-and-association.v1` |
| Learning-objective id | `m8math.scatter-plots-and-association` |
| `los[0].standard` | `M8MATH-10.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'10'` / `'10.1'` / `'Scatter Plots & Association'` |
| `prerequisites` | ["m8math.pythagorean-applications-and-distance-between-points"] |
| `followUps` | ["m8math.fitting-a-line-to-a-scatter-plot"] |

## Scope — teach exactly this, and nothing adjacent

Construct a scatter plot from bivariate measurement data and describe clustering, outliers, positive/negative/no association and linear vs nonlinear pattern; numeric item reads a coordinate or counts the points meeting a condition. Builds on `m6math` row 6.1 (plotting points — assumed); does not revisit one-variable statistics from `m7math-u9-*`. Withholds: fitting a line (row 10.2); strength language and correlation vs causation → `alg1-u10-scatterplots-trend-lines.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-bivariate-data.ts` (8.SP.A.1 "Construct and interpret scatter plots … patterns of association") — salvage the positive/negative/no-correlation examples; its "line of best fit by eye" moves to row 10.2

## Hard rules

- Write ONLY `m8math-u10-scatter-plots-and-association.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
