# Lesson brief — m8math · Unit 2 Topic 3 · Writing & Comparing Numbers in Scientific Notation

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — Integer Exponents & Scientific Notation |
| Topic index in unit | 3 |
| Title | Writing & Comparing Numbers in Scientific Notation |
| Slug | `scientific-notation` |
| Standard | `8.EE.A.3` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u2-scientific-notation.ts` |
| Export symbol | `SEED_M8MATH_U2_SCIENTIFIC_NOTATION` |
| Plan id | `evelyn.ms.m8math.scientific-notation.v1` |
| Learning-objective id | `m8math.scientific-notation` |
| `los[0].standard` | `M8MATH-2.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.3'` / `'Writing & Comparing Numbers in Scientific Notation'` |
| `prerequisites` | ["m8math.zero-and-negative-exponents"] |
| `followUps` | ["m8math.operations-in-scientific-notation"] |

## Scope — teach exactly this, and nothing adjacent

Write very large and very small numbers as a × 10ⁿ with 1 ≤ a < 10 (negative n for small), convert back to standard form, estimate a quantity as a single digit times a power of 10, and compare two such numbers by "how many times as large" (3 × 10⁸ vs 6 × 10⁴ → 5 × 10³ times); numeric item asks for the exponent or the multiplier. Withholds: general operations (row 2.4).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-exponents-scientific-notation.ts` ("a × 10^n form … 1 ≤ ǀaǀ < 10 normalization rule") — salvage the normalization-rule framing

## Hard rules

- Write ONLY `m8math-u2-scientific-notation.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
