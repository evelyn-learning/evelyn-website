# Lesson brief — m8math · Unit 5 Topic 3 · Solving Simple Systems by Substitution

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 5 — Systems of Linear Equations |
| Topic index in unit | 3 |
| Title | Solving Simple Systems by Substitution |
| Slug | `solving-systems-by-substitution` |
| Standard | `8.EE.C.8b` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u5-solving-systems-by-substitution.ts` |
| Export symbol | `SEED_M8MATH_U5_SOLVING_SYSTEMS_BY_SUBSTITUTION` |
| Plan id | `evelyn.ms.m8math.solving-systems-by-substitution.v1` |
| Learning-objective id | `m8math.solving-systems-by-substitution` |
| `los[0].standard` | `M8MATH-5.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'5'` / `'5.3'` / `'Solving Simple Systems by Substitution'` |
| `prerequisites` | ["m8math.solving-systems-by-graphing"] |
| `followUps` | ["m8math.systems-word-problems"] |

## Scope — teach exactly this, and nothing adjacent

Solve algebraically when one or both equations are already solved for y — set y = 2x + 1 equal to y = −x + 7, or substitute y = 3x into 2x + y = 10 — then back-substitute to get both coordinates, and note the answer is exact where graphing only estimated. STOPS before: isolating a variable from a general two-variable equation first → `alg1-u5-systems-substitution.ts`; adding/scaling equations → `alg1-u5-systems-elimination.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8math-u5-solving-systems-by-substitution.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
