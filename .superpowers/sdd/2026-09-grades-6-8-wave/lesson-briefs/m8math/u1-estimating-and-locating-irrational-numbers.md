# Lesson brief — m8math · Unit 1 Topic 4 · Estimating & Locating Irrational Numbers

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 1 — Real Numbers: Rational, Irrational & Roots |
| Topic index in unit | 4 |
| Title | Estimating & Locating Irrational Numbers |
| Slug | `estimating-and-locating-irrational-numbers` |
| Standard | `8.NS.A.2` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u1-estimating-and-locating-irrational-numbers.ts` |
| Export symbol | `SEED_M8MATH_U1_ESTIMATING_AND_LOCATING_IRRATIONAL_NUMBERS` |
| Plan id | `evelyn.ms.m8math.estimating-and-locating-irrational-numbers.v1` |
| Learning-objective id | `m8math.estimating-and-locating-irrational-numbers` |
| `los[0].standard` | `M8MATH-1.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'1'` / `'1.4'` / `'Estimating & Locating Irrational Numbers'` |
| `prerequisites` | ["m8math.square-roots-and-cube-roots"] |
| `followUps` | ["m8math.product-quotient-and-power-of-a-power-rules"] |

## Scope — teach exactly this, and nothing adjacent

Trap √n between consecutive perfect squares, refine to one decimal place by squaring candidates (√50 ≈ 7.1), place irrational numbers on a number line, and compare/order mixed sets (√2, 1.5, π, 3.2); use truncations to estimate expressions like π² ≈ 9.8. Withholds: decimal expansion past tenths, radical arithmetic → `alg1-u9-simplifying-radicals.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-square-roots-irrationals.ts` ("Estimating non-perfect square roots between two perfect squares") — salvage the between-two-perfect-squares example shape only

## Hard rules

- Write ONLY `m8math-u1-estimating-and-locating-irrational-numbers.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
