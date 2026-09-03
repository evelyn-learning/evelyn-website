# Lesson brief — m8math · Unit 7 Topic 1 · Rate of Change & Initial Value from Tables & Graphs

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 7 — Linear Functions as Models |
| Topic index in unit | 1 |
| Title | Rate of Change & Initial Value from Tables & Graphs |
| Slug | `rate-of-change-and-initial-value-from-tables-and-graphs` |
| Standard | `8.F.B.4` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u7-rate-of-change-and-initial-value-from-tables-and-graphs.ts` |
| Export symbol | `SEED_M8MATH_U7_RATE_OF_CHANGE_AND_INITIAL_VALUE_FROM_TABLES_AND_GRAPHS` |
| Plan id | `evelyn.ms.m8math.rate-of-change-and-initial-value-from-tables-and-graphs.v1` |
| Learning-objective id | `m8math.rate-of-change-and-initial-value-from-tables-and-graphs` |
| `los[0].standard` | `M8MATH-7.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'7'` / `'7.1'` / `'Rate of Change & Initial Value from Tables & Graphs'` |
| `prerequisites` | ["m8math.volume-of-cylinders-cones-and-spheres"] |
| `followUps` | ["m8math.constructing-linear-models-from-descriptions"] |

## Scope — teach exactly this, and nothing adjacent

Determine m (Δy/Δx from any two rows or points) and b (read at x = 0, or back it out as b = y − mx when x = 0 is absent) from a table, a graph, or two given (x, y) values, and write y = mx + b. Distinct from row 3.4, which reads m and b off a graph that shows the intercept; every case here hides it. Withholds: point-slope form → `alg1-u4-point-slope-standard-form.ts`; `alg1-u4-slope-rate-of-change.ts` repeats slope-from-two-points as HS review.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-slope-linear-functions.ts` (8.F.B.4 "determine slope and y-intercept … from a graph or table") — salvage the equation-from-a-table example only

## Hard rules

- Write ONLY `m8math-u7-rate-of-change-and-initial-value-from-tables-and-graphs.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
