# Lesson brief — m8math · Unit 8 Topic 2 · Rotations About the Origin

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 8 — Transformations, Congruence & Similarity |
| Topic index in unit | 2 |
| Title | Rotations About the Origin |
| Slug | `rotations-about-the-origin` |
| Standard | `8.G.A.1, 8.G.A.3` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u8-rotations-about-the-origin.ts` |
| Export symbol | `SEED_M8MATH_U8_ROTATIONS_ABOUT_THE_ORIGIN` |
| Plan id | `evelyn.ms.m8math.rotations-about-the-origin.v1` |
| Learning-objective id | `m8math.rotations-about-the-origin` |
| `los[0].standard` | `M8MATH-8.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'8'` / `'8.2'` / `'Rotations About the Origin'` |
| `prerequisites` | ["m8math.translations-and-reflections"] |
| `followUps` | ["m8math.congruence-through-rigid-motions"] |

## Scope — teach exactly this, and nothing adjacent

Rotate figures 90°, 180° and 270° about the origin (counterclockwise convention) with coordinate rules ((x, y) → (−y, x), (−x, −y), (y, −x)), verify the preserved properties, and identify a rotation from a preimage/image pair. Withholds: rotations about other centers and the translate-rotate-translate-back method → `geom-u4-rotations.ts`; compositions and symmetry → `geom-u4-compositions-symmetry.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-transformations.ts` ("rotations turn") — rule examples only

## Hard rules

- Write ONLY `m8math-u8-rotations-about-the-origin.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
