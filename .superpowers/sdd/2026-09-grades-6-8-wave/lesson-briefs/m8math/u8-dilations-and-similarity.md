# Lesson brief — m8math · Unit 8 Topic 4 · Dilations & Similarity

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 8 — Transformations, Congruence & Similarity |
| Topic index in unit | 4 |
| Title | Dilations & Similarity |
| Slug | `dilations-and-similarity` |
| Standard | `8.G.A.3, 8.G.A.4` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u8-dilations-and-similarity.ts` |
| Export symbol | `SEED_M8MATH_U8_DILATIONS_AND_SIMILARITY` |
| Plan id | `evelyn.ms.m8math.dilations-and-similarity.v1` |
| Learning-objective id | `m8math.dilations-and-similarity` |
| `los[0].standard` | `M8MATH-8.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'8'` / `'8.4'` / `'Dilations & Similarity'` |
| `prerequisites` | ["m8math.congruence-through-rigid-motions"] |
| `followUps` | ["m8math.parallel-lines-cut-by-a-transversal"] |

## Scope — teach exactly this, and nothing adjacent

Dilate a figure from the origin by scale factor k ((x, y) → (kx, ky), including 0 < k < 1), find k from a pair of figures, and define similar figures as those connected by a dilation followed by rigid motions; describe such a sequence. Assumes scale factor = constant of proportionality and area scaling by k² from `m7math-u7-scale-drawings.ts` (not re-taught). Withholds: dilations about other centers and the preserved-vs-scaled catalogue → `geom-u6-dilations-scale-factor.ts`; proportional-sides tests and perimeter/area ratios → `geom-u6-similar-polygons.ts`; SSS/SAS similarity → `geom-u6-triangle-similarity-criteria.ts` (AA is row 9.2).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-transformations.ts` ("dilation changes size but preserves shape (similarity)") — framing only

## Hard rules

- Write ONLY `m8math-u8-dilations-and-similarity.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
