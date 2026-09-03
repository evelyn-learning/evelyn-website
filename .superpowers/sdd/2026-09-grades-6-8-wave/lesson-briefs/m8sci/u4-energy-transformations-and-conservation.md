# Lesson brief — m8sci · Unit 4 Topic 3 · Energy Transformations & Conservation

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 4 — Energy: Kinetic, Potential & Conservation |
| Topic index in unit | 3 |
| Title | Energy Transformations & Conservation |
| Slug | `energy-transformations-and-conservation` |
| Standard | `PS3.B` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u4-energy-transformations-and-conservation.ts` |
| Export symbol | `SEED_M8SCI_U4_ENERGY_TRANSFORMATIONS_AND_CONSERVATION` |
| Plan id | `evelyn.ms.m8sci.energy-transformations-and-conservation.v1` |
| Learning-objective id | `m8sci.energy-transformations-and-conservation` |
| `los[0].standard` | `M8SCI-4.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'4'` / `'4.3'` / `'Energy Transformations & Conservation'` |
| `prerequisites` | ["m8sci.potential-energy-and-position"] |
| `followUps` | ["m8sci.energy-transfer-when-motion-changes"] |

## Scope — teach exactly this, and nothing adjacent

Trace energy through a described chain (battery → flashlight, roller coaster hill to hill, a pendulum) naming each form (kinetic, gravitational/elastic/chemical potential, thermal, light, sound), state that the total is conserved while some always ends up as thermal energy spread into the surroundings, and correct "the energy was used up" (DCI PS3.B, foundational to MS-PS3-5). The rule that energy is transferred and transformed rather than created is one the student met for organisms in Grade 7 (`m7sci-u4-energy-for-living-things.ts`, LO description read); cited here as a prior example, never re-taught.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g6-sci-energy-forms.ts` (hook: sandwich → pedaling → headlight chain; worked-rollercoaster energy trace; misconception-energy-used-up) — directly reusable framing and misconception text; do NOT carry forward the keyIdea "KE = (1/2)mv²" or the nuclear-energy bullet

## Hard rules

- Write ONLY `m8sci-u4-energy-transformations-and-conservation.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
