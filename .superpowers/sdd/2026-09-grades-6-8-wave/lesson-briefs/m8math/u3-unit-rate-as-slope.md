# Lesson brief — m8math · Unit 3 Topic 1 · Unit Rate as Slope

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 3 — Proportional Relationships & Slope |
| Topic index in unit | 1 |
| Title | Unit Rate as Slope |
| Slug | `unit-rate-as-slope` |
| Standard | `8.EE.B.5` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u3-unit-rate-as-slope.ts` |
| Export symbol | `SEED_M8MATH_U3_UNIT_RATE_AS_SLOPE` |
| Plan id | `evelyn.ms.m8math.unit-rate-as-slope.v1` |
| Learning-objective id | `m8math.unit-rate-as-slope` |
| `los[0].standard` | `M8MATH-3.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'3'` / `'3.1'` / `'Unit Rate as Slope'` |
| `prerequisites` | ["m8math.operations-in-scientific-notation"] |
| `followUps` | ["m8math.comparing-proportional-relationships"] |

## Scope — teach exactly this, and nothing adjacent

Graph a proportional relationship from a table or from y = kx, name the line's steepness "slope", and show that slope = rise per 1 unit of run = the unit rate = k. Starts from `m7math-u3-constant-of-proportionality.ts` (identify k from table/graph/description, write y = kx — assumed, not re-taught); the NEW move is slope as a measurable steepness of the graph. Withholds: y-intercept (row 3.4); slope between two arbitrary points (row 3.3).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-slope-linear-functions.ts` (LO 8.EE.B.5 "Graph proportional relationships; interpret unit rate as slope"; NOTE its `grade: '9'` tag is wrong — it is Grade 8 content) — salvage the slope-is-the-unit-rate framing; do NOT carry its bundling of 8.EE.B.5 with 8.F.B.4. One level down, `g7-math-proportional-relationships.ts` names 8.EE.B.5 as its follow-up (adjacent ground; nothing to carry)

## Hard rules

- Write ONLY `m8math-u3-unit-rate-as-slope.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
