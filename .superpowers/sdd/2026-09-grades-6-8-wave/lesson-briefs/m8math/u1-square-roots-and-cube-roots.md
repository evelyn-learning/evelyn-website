# Lesson brief — m8math · Unit 1 Topic 3 · Square Roots & Cube Roots

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 1 — Real Numbers: Rational, Irrational & Roots |
| Topic index in unit | 3 |
| Title | Square Roots & Cube Roots |
| Slug | `square-roots-and-cube-roots` |
| Standard | `8.EE.A.2` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u1-square-roots-and-cube-roots.ts` |
| Export symbol | `SEED_M8MATH_U1_SQUARE_ROOTS_AND_CUBE_ROOTS` |
| Plan id | `evelyn.ms.m8math.square-roots-and-cube-roots.v1` |
| Learning-objective id | `m8math.square-roots-and-cube-roots` |
| `los[0].standard` | `M8MATH-1.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'1'` / `'1.3'` / `'Square Roots & Cube Roots'` |
| `prerequisites` | ["m8math.rational-and-irrational-numbers"] |
| `followUps` | ["m8math.estimating-and-locating-irrational-numbers"] |

## Scope — teach exactly this, and nothing adjacent

Evaluate square roots of perfect squares to 225 and cube roots of perfect cubes to 1000; solve x² = p and x³ = p for those p, keeping both signs for the square case and the single real cube root; know √2 is irrational (from 1.2). Assumes (−3)² vs −3² from `m7math-u2-multiplying-dividing-rational-numbers.ts` and whole-number exponents from `m6math` row 7.1. Withholds: x² = k for non-perfect k and (x − h)² = k → `alg1-u8-solving-by-factoring-square-roots.ts`; simplifying radicals → `alg1-u9-simplifying-radicals.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-square-roots-irrationals.ts` (8.EE.A.2 "Use square root and cube root symbols to represent solutions to equations") — salvage the inverse-of-squaring framing and perfect-square ladder only

## Hard rules

- Write ONLY `m8math-u1-square-roots-and-cube-roots.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
