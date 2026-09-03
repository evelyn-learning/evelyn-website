# Lesson brief — m8math · Unit 5 Topic 2 · Solving Systems by Graphing

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 5 — Systems of Linear Equations |
| Topic index in unit | 2 |
| Title | Solving Systems by Graphing |
| Slug | `solving-systems-by-graphing` |
| Standard | `8.EE.C.8b` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u5-solving-systems-by-graphing.ts` |
| Export symbol | `SEED_M8MATH_U5_SOLVING_SYSTEMS_BY_GRAPHING` |
| Plan id | `evelyn.ms.m8math.solving-systems-by-graphing.v1` |
| Learning-objective id | `m8math.solving-systems-by-graphing` |
| `los[0].standard` | `M8MATH-5.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'5'` / `'5.2'` / `'Solving Systems by Graphing'` |
| `prerequisites` | ["m8math.solutions-of-systems-as-intersection-points"] |
| `followUps` | ["m8math.solving-systems-by-substitution"] |

## Scope — teach exactly this, and nothing adjacent

Graph two lines given in (or easily put into) y = mx + b form, read the intersection, estimate it when it is not a lattice point, and recognize by inspection that parallel lines (same slope, different intercept; the standard's 3x + 2y = 5 vs 3x + 2y = 6) give no solution and coincident lines infinitely many. Withholds: graphing from standard form via intercepts and formal classification vocabulary → `alg1-u5-systems-by-graphing.ts` (HS review of the same skill); elimination → `alg1-u5-systems-elimination.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8math-u5-solving-systems-by-graphing.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
