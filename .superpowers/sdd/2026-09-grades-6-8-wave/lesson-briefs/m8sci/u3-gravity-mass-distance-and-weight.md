# Lesson brief — m8sci · Unit 3 Topic 1 · Gravity: Mass, Distance & Weight

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 3 — Gravity, Electric & Magnetic Forces, and Fields |
| Topic index in unit | 1 |
| Title | Gravity: Mass, Distance & Weight |
| Slug | `gravity-mass-distance-and-weight` |
| Standard | `MS-PS2-4` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u3-gravity-mass-distance-and-weight.ts` |
| Export symbol | `SEED_M8SCI_U3_GRAVITY_MASS_DISTANCE_AND_WEIGHT` |
| Plan id | `evelyn.ms.m8sci.gravity-mass-distance-and-weight.v1` |
| Learning-objective id | `m8sci.gravity-mass-distance-and-weight` |
| `los[0].standard` | `M8SCI-3.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'3'` / `'3.1'` / `'Gravity: Mass, Distance & Weight'` |
| `prerequisites` | ["m8sci.collisions-and-designing-for-safety"] |
| `followUps` | ["m8sci.electric-forces-and-charge"] |

## Scope — teach exactly this, and nothing adjacent

Argue from evidence that gravity is always attractive and grows with the masses involved and weakens with distance, and distinguish mass (amount of matter, the same everywhere) from weight (the gravitational force on that mass, smaller on the Moon). This supplies the force underneath Grade 6's `m6sci-u1-gravity-and-orbital-motion.ts` (LO description read: gravity keeps objects in orbit, qualitatively) without re-teaching orbits. Withholds F = Gm₁m₂/r² and any inverse-square arithmetic (HS-PS2-4; the G6 table's "physics of gravity" reservation is declined at the formula level — see sign-off 5).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-solar-system-beyond.ts` (concept-gravity-rules keyIdeas: gravity scales with mass, weakens with distance; misconception "no gravity in space") — reusable for the mass/distance dependence and the ISS-weightlessness misconception; do NOT carry forward the "1/r², 40× farther → 1600× weaker" numeric item

## Hard rules

- Write ONLY `m8sci-u3-gravity-mass-distance-and-weight.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
