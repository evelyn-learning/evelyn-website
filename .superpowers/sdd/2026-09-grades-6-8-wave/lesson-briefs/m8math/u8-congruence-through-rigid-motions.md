# Lesson brief — m8math · Unit 8 Topic 3 · Congruence Through Rigid Motions

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 8 — Transformations, Congruence & Similarity |
| Topic index in unit | 3 |
| Title | Congruence Through Rigid Motions |
| Slug | `congruence-through-rigid-motions` |
| Standard | `8.G.A.2` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u8-congruence-through-rigid-motions.ts` |
| Export symbol | `SEED_M8MATH_U8_CONGRUENCE_THROUGH_RIGID_MOTIONS` |
| Plan id | `evelyn.ms.m8math.congruence-through-rigid-motions.v1` |
| Learning-objective id | `m8math.congruence-through-rigid-motions` |
| `los[0].standard` | `M8MATH-8.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'8'` / `'8.3'` / `'Congruence Through Rigid Motions'` |
| `prerequisites` | ["m8math.rotations-about-the-origin"] |
| `followUps` | ["m8math.dilations-and-similarity"] |

## Scope — teach exactly this, and nothing adjacent

Two figures are congruent exactly when a sequence of translations, reflections and rotations maps one onto the other; describe such a sequence between two given figures, apply it to coordinates, and decide congruence from coordinates; numeric item asks a coordinate of the image after a two-step sequence. Withholds: correspondence statements, triangle congruence criteria and CPCTC → `geom-u4-congruence-rigid-motions.ts`, `geom-u5-triangle-congruence-criteria.ts`, `geom-u5-cpctc-proofs.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-transformations.ts` ("the first three preserve size and shape (rigid motions)") — framing only

## Hard rules

- Write ONLY `m8math-u8-congruence-through-rigid-motions.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
