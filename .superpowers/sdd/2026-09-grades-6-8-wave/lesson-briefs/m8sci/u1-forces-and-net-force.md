# Lesson brief — m8sci · Unit 1 Topic 4 · Forces, Net Force & Balanced Forces

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 1 — Describing Motion |
| Topic index in unit | 4 |
| Title | Forces, Net Force & Balanced Forces |
| Slug | `forces-and-net-force` |
| Standard | `PS2.A` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u1-forces-and-net-force.ts` |
| Export symbol | `SEED_M8SCI_U1_FORCES_AND_NET_FORCE` |
| Plan id | `evelyn.ms.m8sci.forces-and-net-force.v1` |
| Learning-objective id | `m8sci.forces-and-net-force` |
| `los[0].standard` | `M8SCI-1.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'1'` / `'1.4'` / `'Forces, Net Force & Balanced Forces'` |
| `prerequisites` | ["m8sci.velocity-and-acceleration"] |
| `followUps` | ["m8sci.newtons-first-law-inertia-and-friction"] |

## Scope — teach exactly this, and nothing adjacent

Describe a force as a push or pull with a size (newtons) and a direction, add two forces along one line to find the net force (5 N left and 3 N right → 2 N left), and classify the forces on an object as balanced (no change in motion) or unbalanced (motion changes) (DCI PS2.A, foundational to MS-PS2-2; one-dimensional only — no free-body diagrams with angled forces, which is `ap-physics-newtons-second-deep.ts`).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-newtons-laws.ts` (net-force vocabulary "the leftover force after all forces are added together") — reusable phrasing only

## Hard rules

- Write ONLY `m8sci-u1-forces-and-net-force.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
