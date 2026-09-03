# Lesson brief — m8math · Unit 10 Topic 2 · Fitting a Line to a Scatter Plot

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 10 — Bivariate Data: Scatter Plots & Two-Way Tables |
| Topic index in unit | 2 |
| Title | Fitting a Line to a Scatter Plot |
| Slug | `fitting-a-line-to-a-scatter-plot` |
| Standard | `8.SP.A.2` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u10-fitting-a-line-to-a-scatter-plot.ts` |
| Export symbol | `SEED_M8MATH_U10_FITTING_A_LINE_TO_A_SCATTER_PLOT` |
| Plan id | `evelyn.ms.m8math.fitting-a-line-to-a-scatter-plot.v1` |
| Learning-objective id | `m8math.fitting-a-line-to-a-scatter-plot` |
| `los[0].standard` | `M8MATH-10.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'10'` / `'10.2'` / `'Fitting a Line to a Scatter Plot'` |
| `prerequisites` | ["m8math.scatter-plots-and-association"] |
| `followUps` | ["m8math.using-a-linear-model-with-bivariate-data"] |

## Scope — teach exactly this, and nothing adjacent

Informally fit a straight line to a linear-looking scatter plot by eye, judge the fit (about as many points above as below, small vertical gaps), and write the line's equation from two points on the drawn line (row 7.1). Withholds: least-squares/technology regression, residuals and the correlation coefficient → `alg1-u10-scatterplots-trend-lines.ts` (cites S-ID.B.6/C.8).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-bivariate-data.ts` ("Drawing line of best fit by eye") — salvage the by-eye procedure

## Hard rules

- Write ONLY `m8math-u10-fitting-a-line-to-a-scatter-plot.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
