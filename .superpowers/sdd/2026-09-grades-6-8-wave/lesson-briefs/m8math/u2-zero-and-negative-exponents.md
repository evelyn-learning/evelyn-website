# Lesson brief — m8math · Unit 2 Topic 2 · Zero & Negative Exponents

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — Integer Exponents & Scientific Notation |
| Topic index in unit | 2 |
| Title | Zero & Negative Exponents |
| Slug | `zero-and-negative-exponents` |
| Standard | `8.EE.A.1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u2-zero-and-negative-exponents.ts` |
| Export symbol | `SEED_M8MATH_U2_ZERO_AND_NEGATIVE_EXPONENTS` |
| Plan id | `evelyn.ms.m8math.zero-and-negative-exponents.v1` |
| Learning-objective id | `m8math.zero-and-negative-exponents` |
| `los[0].standard` | `M8MATH-2.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.2'` / `'Zero & Negative Exponents'` |
| `prerequisites` | ["m8math.product-quotient-and-power-of-a-power-rules"] |
| `followUps` | ["m8math.scientific-notation"] |

## Scope — teach exactly this, and nothing adjacent

Extend the quotient rule (a³ ÷ a³, a² ÷ a⁵) to show a⁰ = 1 and a⁻ⁿ = 1/aⁿ; evaluate 2⁻³, (1/2)⁻², 3² × 3⁻⁵ = 3⁻³ = 1/27 (the standard's own example); kill "a negative exponent makes a negative number". Withholds: variable-base rewriting of quotients with negative exponents inside monomials → `alg1-u6-negative-exponents-scientific-notation.ts` (cites 8.EE.A.1 as HS review); exponential functions y = a·bˣ → `alg1-u6-exponential-functions.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-exponents-scientific-notation.ts` (its "zero exponent, negative exponent" bullets) — example numbers only

## Hard rules

- Write ONLY `m8math-u2-zero-and-negative-exponents.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
