# Lesson brief — m8sci · Unit 2 Topic 2 · Newton's Second Law: Force, Mass & Acceleration

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — Forces & Newton's Laws |
| Topic index in unit | 2 |
| Title | Newton's Second Law: Force, Mass & Acceleration |
| Slug | `newtons-second-law-force-mass-and-acceleration` |
| Standard | `MS-PS2-2` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u2-newtons-second-law-force-mass-and-acceleration.ts` |
| Export symbol | `SEED_M8SCI_U2_NEWTONS_SECOND_LAW_FORCE_MASS_AND_ACCELERATION` |
| Plan id | `evelyn.ms.m8sci.newtons-second-law-force-mass-and-acceleration.v1` |
| Learning-objective id | `m8sci.newtons-second-law-force-mass-and-acceleration` |
| `los[0].standard` | `M8SCI-2.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.2'` / `'Newton's Second Law: Force, Mass & Acceleration'` |
| `prerequisites` | ["m8sci.newtons-first-law-inertia-and-friction"] |
| `followUps` | ["m8sci.newtons-third-law-action-reaction-pairs"] |

## Scope — teach exactly this, and nothing adjacent

Predict how an object's acceleration changes when the net force or the mass changes (more force → more acceleration; more mass → less acceleration for the same force), apply F = m × a with small whole numbers (10 N on 2 kg → 5 m/s²) choosing the correctly stated result, and plan a fair-test investigation of the relationship (which variable to change, which to hold fixed — the fair-test vocabulary is Grade 7's `m7sci-u1-variables-and-controls.ts`, LO description read, not re-taught here). Withholds rearranging F = ma algebraically for unknown mass and any two-dimensional case (`ap-physics-newtons-second-deep.ts`).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-newtons-laws.ts` (concept-second-law keyIdeas; worked shopping-cart 20 N / 10 kg vs 50 kg comparison) — reusable as a worked example if recast so the student picks "the empty cart accelerates five times as much" from choices rather than computing 2 vs 0.4 m/s² freely

## Hard rules

- Write ONLY `m8sci-u2-newtons-second-law-force-mass-and-acceleration.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
