# Lesson brief — m8sci · Unit 3 Topic 2 · Electric Forces & Charge

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 3 — Gravity, Electric & Magnetic Forces, and Fields |
| Topic index in unit | 2 |
| Title | Electric Forces & Charge |
| Slug | `electric-forces-and-charge` |
| Standard | `MS-PS2-3` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u3-electric-forces-and-charge.ts` |
| Export symbol | `SEED_M8SCI_U3_ELECTRIC_FORCES_AND_CHARGE` |
| Plan id | `evelyn.ms.m8sci.electric-forces-and-charge.v1` |
| Learning-objective id | `m8sci.electric-forces-and-charge` |
| `los[0].standard` | `M8SCI-3.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'3'` / `'3.2'` / `'Electric Forces & Charge'` |
| `prerequisites` | ["m8sci.gravity-mass-distance-and-weight"] |
| `followUps` | ["m8sci.magnetic-forces-and-electromagnets"] |

## Scope — teach exactly this, and nothing adjacent

Explain that objects carry positive or negative charge, that like charges repel and opposite charges attract, that rubbing transfers charge (the balloon on the wall), and identify from described data which factors change the strength of an electric force — amount of charge and distance apart (first of two lessons sharing MS-PS2-3, split by force type). Withholds Coulomb's law (`ap-physics2-electrostatics.ts`) and ALL current electricity, circuits and V = IR (`ap-physics2-circuits.ts`; see sign-off 6).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-electricity.ts` (concept-charges keyIdeas: two kinds of charge, like repel / opposite attract, balloon hook) — reusable for static charge only; do NOT carry forward concept-current, worked-ohms-law, or the numeric V = IR try item

## Hard rules

- Write ONLY `m8sci-u3-electric-forces-and-charge.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
