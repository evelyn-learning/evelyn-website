# Lesson brief — m8math · Unit 3 Topic 3 · Slope & Similar Triangles

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 3 — Proportional Relationships & Slope |
| Topic index in unit | 3 |
| Title | Slope & Similar Triangles |
| Slug | `slope-from-similar-triangles` |
| Standard | `8.EE.B.6` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u3-slope-from-similar-triangles.ts` |
| Export symbol | `SEED_M8MATH_U3_SLOPE_FROM_SIMILAR_TRIANGLES` |
| Plan id | `evelyn.ms.m8math.slope-from-similar-triangles.v1` |
| Learning-objective id | `m8math.slope-from-similar-triangles` |
| `los[0].standard` | `M8MATH-3.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'3'` / `'3.3'` / `'Slope & Similar Triangles'` |
| `prerequisites` | ["m8math.comparing-proportional-relationships"] |
| `followUps` | ["m8math.deriving-y-equals-mx-plus-b"] |

## Scope — teach exactly this, and nothing adjacent

Draw two slope triangles on the same non-vertical line and argue informally (similar triangles → equal rise:run ratios) that the slope is the same between any two points; then compute slope from a graph or from two given points by counting rise over run, including negative slopes. Assumes scale factor intuition from `m7math-u7-scale-drawings.ts`. Withholds: zero/undefined slope classification and horizontal/vertical lines as a topic, "rate of change with units" language → `alg1-u4-slope-rate-of-change.ts` (cites 8.F.B.4; HS review); parallel/perpendicular slope relationships → `alg1-u4-parallel-perpendicular.ts` and `geom-u3-slopes-parallel-perpendicular.ts`; formal similarity criteria → `geom-u6-triangle-similarity-criteria.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8math-u3-slope-from-similar-triangles.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
