# Lesson brief — m8math · Unit 2 Topic 1 · Product, Quotient & Power-of-a-Power Rules

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — Integer Exponents & Scientific Notation |
| Topic index in unit | 1 |
| Title | Product, Quotient & Power-of-a-Power Rules |
| Slug | `product-quotient-and-power-of-a-power-rules` |
| Standard | `8.EE.A.1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u2-product-quotient-and-power-of-a-power-rules.ts` |
| Export symbol | `SEED_M8MATH_U2_PRODUCT_QUOTIENT_AND_POWER_OF_A_POWER_RULES` |
| Plan id | `evelyn.ms.m8math.product-quotient-and-power-of-a-power-rules.v1` |
| Learning-objective id | `m8math.product-quotient-and-power-of-a-power-rules` |
| `los[0].standard` | `M8MATH-2.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.1'` / `'Product, Quotient & Power-of-a-Power Rules'` |
| `prerequisites` | ["m8math.estimating-and-locating-irrational-numbers"] |
| `followUps` | ["m8math.zero-and-negative-exponents"] |

## Scope — teach exactly this, and nothing adjacent

Derive aᵐ·aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ and (aᵐ)ⁿ = aᵐⁿ from expanded form with numerical bases (2, 3, 10) and at most a single variable base; write equivalent expressions (3² × 3⁵ = 3⁷; 5⁶ ÷ 5² = 5⁴; (2³)² = 2⁶); positive exponents only; numeric item asks for the resulting exponent or value. Assumes `m6math` row 7.1 (numerical expressions with exponents). Withholds: zero and negative exponents (row 2.2); power of a product/quotient (ab)ⁿ, (a/b)ⁿ and multi-variable monomials such as (2x³y)² → Algebra 1 `alg1-u6-exponent-rules.ts` (which cites 8.EE.A.1 as HS review).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-exponents-scientific-notation.ts` (8.EE.A.1 "Apply properties of integer exponents" + 8.EE.A.3 in ONE plan) — salvage the rule list and example numbers; do NOT carry its two-LO single-plan shape (scientific notation is rows 2.3–2.4)

## Hard rules

- Write ONLY `m8math-u2-product-quotient-and-power-of-a-power-rules.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
