# Lesson brief — m8sci · Unit 2 Topic 4 · Collisions & Designing for Safety

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — Forces & Newton's Laws |
| Topic index in unit | 4 |
| Title | Collisions & Designing for Safety |
| Slug | `collisions-and-designing-for-safety` |
| Standard | `MS-PS2-1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u2-collisions-and-designing-for-safety.ts` |
| Export symbol | `SEED_M8SCI_U2_COLLISIONS_AND_DESIGNING_FOR_SAFETY` |
| Plan id | `evelyn.ms.m8sci.collisions-and-designing-for-safety.v1` |
| Learning-objective id | `m8sci.collisions-and-designing-for-safety` |
| `los[0].standard` | `M8SCI-2.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.4'` / `'Collisions & Designing for Safety'` |
| `prerequisites` | ["m8sci.newtons-third-law-action-reaction-pairs"] |
| `followUps` | ["m8sci.gravity-mass-distance-and-weight"] |

## Scope — teach exactly this, and nothing adjacent

Apply the third law and the force-mass-acceleration idea to a collision between two objects (a cart hitting a wall, two skaters pushing off, a ball and a bat) and evaluate a proposed safety design — helmet padding, crumple zone, airbag, egg-drop cushion — by whether it spreads the stopping force over a longer time or larger area (shares MS-PS2-1 with 2.3; assessed as evaluating designs, since a three-mcq course cannot run a build project). Withholds momentum and impulse (`ap-physics-c-mech-energy-momentum.ts`).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8sci-u2-collisions-and-designing-for-safety.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
