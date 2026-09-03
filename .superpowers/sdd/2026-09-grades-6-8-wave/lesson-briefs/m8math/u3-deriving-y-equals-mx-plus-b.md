# Lesson brief — m8math · Unit 3 Topic 4 · Deriving y = mx & y = mx + b

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 3 — Proportional Relationships & Slope |
| Topic index in unit | 4 |
| Title | Deriving y = mx & y = mx + b |
| Slug | `deriving-y-equals-mx-plus-b` |
| Standard | `8.EE.B.6` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u3-deriving-y-equals-mx-plus-b.ts` |
| Export symbol | `SEED_M8MATH_U3_DERIVING_Y_EQUALS_MX_PLUS_B` |
| Plan id | `evelyn.ms.m8math.deriving-y-equals-mx-plus-b.v1` |
| Learning-objective id | `m8math.deriving-y-equals-mx-plus-b` |
| `los[0].standard` | `M8MATH-3.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'3'` / `'3.4'` / `'Deriving y = mx & y = mx + b'` |
| `prerequisites` | ["m8math.slope-from-similar-triangles"] |
| `followUps` | ["m8math.equations-with-variables-on-both-sides"] |

## Scope — teach exactly this, and nothing adjacent

Derive y = mx for a line through the origin and y = mx + b for a line crossing the y-axis at (0, b); read m and b from a graph that shows the intercept and write the line's equation; contrast with the through-the-origin test of `m7math-u3-proportional-relationships.ts` (y = 2x + 3 is linear but not proportional — assumed known). Withholds: writing the equation from a slope and a point or from two points, and graphing directly from the equation → `alg1-u4-slope-intercept-form.ts` (HS review) — in G8 the equation always comes from a graph (here) or a table/description (rows 7.1–7.2); point-slope and standard form → `alg1-u4-point-slope-standard-form.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-slope-linear-functions.ts` ("y-intercept as the starting value … finding equation from a graph") — salvage the starting-value framing only

## Hard rules

- Write ONLY `m8math-u3-deriving-y-equals-mx-plus-b.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
