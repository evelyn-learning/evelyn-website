# Lesson brief — m8sci · Unit 4 Topic 1 · Kinetic Energy: Mass & Speed

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 4 — Energy: Kinetic, Potential & Conservation |
| Topic index in unit | 1 |
| Title | Kinetic Energy: Mass & Speed |
| Slug | `kinetic-energy-mass-and-speed` |
| Standard | `MS-PS3-1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u4-kinetic-energy-mass-and-speed.ts` |
| Export symbol | `SEED_M8SCI_U4_KINETIC_ENERGY_MASS_AND_SPEED` |
| Plan id | `evelyn.ms.m8sci.kinetic-energy-mass-and-speed.v1` |
| Learning-objective id | `m8sci.kinetic-energy-mass-and-speed` |
| `los[0].standard` | `M8SCI-4.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'4'` / `'4.1'` / `'Kinetic Energy: Mass & Speed'` |
| `prerequisites` | ["m8sci.fields-forces-without-contact"] |
| `followUps` | ["m8sci.potential-energy-and-position"] |

## Scope — teach exactly this, and nothing adjacent

Interpret a data table written out in words to describe how kinetic energy depends on mass (double the mass → double the energy) and on speed (double the speed → FOUR times the energy), and choose the correct comparison for described objects (a tennis ball vs a wiffle ball at the same speed; a bike at 2 m/s vs 4 m/s). Withholds computing KE = ½mv² in joules (`g8-sci-forces-energy.ts` does this; declined — see quantitative ceiling) and momentum.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-forces-energy.ts` (concept-formulas keyIdea "a car at 30 m/s has 4× the KE of the same car at 15 m/s"; misconception on kinds of potential energy) — reusable ONLY as the described doubling relationship; do NOT carry forward the ½mv² / mgh joule calculations or the numeric roller-coaster worked example

## Hard rules

- Write ONLY `m8sci-u4-kinetic-energy-mass-and-speed.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
