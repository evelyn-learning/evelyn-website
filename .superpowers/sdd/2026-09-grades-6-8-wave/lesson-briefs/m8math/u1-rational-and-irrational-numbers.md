# Lesson brief — m8math · Unit 1 Topic 2 · Rational & Irrational Numbers

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 1 — Real Numbers: Rational, Irrational & Roots |
| Topic index in unit | 2 |
| Title | Rational & Irrational Numbers |
| Slug | `rational-and-irrational-numbers` |
| Standard | `8.NS.A.1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u1-rational-and-irrational-numbers.ts` |
| Export symbol | `SEED_M8MATH_U1_RATIONAL_AND_IRRATIONAL_NUMBERS` |
| Plan id | `evelyn.ms.m8math.rational-and-irrational-numbers.v1` |
| Learning-objective id | `m8math.rational-and-irrational-numbers` |
| `los[0].standard` | `M8MATH-1.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'1'` / `'1.2'` / `'Rational & Irrational Numbers'` |
| `prerequisites` | ["m8math.repeating-decimals-to-fractions"] |
| `followUps` | ["m8math.square-roots-and-cube-roots"] |

## Scope — teach exactly this, and nothing adjacent

Define an irrational number as one whose decimal neither terminates nor repeats; classify π, √2, √9, 22/7, 0.101001000…; know √n is irrational whenever n is not a perfect square and rational when it is; numeric item asks e.g. the smallest whole number n > 1 with √n irrational. Withholds: proving √2 irrational; simplifying radicals (√50 = 5√2) → Algebra 1 `alg1-u9-simplifying-radicals.ts`; the real-number hierarchy and field properties → `alg1-u1-real-numbers-operations.ts` (which re-classifies rational vs irrational as HS review).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-square-roots-irrationals.ts` (LOs 8.NS.A.1 + 8.EE.A.2 in ONE plan: "√2, √3, √5 are irrational (decimals never repeat or terminate)") — salvage the perfect-square list and the "most square roots don't come out clean" framing; do NOT carry its two-LO-per-plan shape (this course is 1 LO/plan; roots are row 1.3)

## Hard rules

- Write ONLY `m8math-u1-rational-and-irrational-numbers.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
