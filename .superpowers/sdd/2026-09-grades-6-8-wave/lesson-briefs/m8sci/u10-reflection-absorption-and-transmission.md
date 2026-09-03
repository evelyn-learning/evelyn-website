# Lesson brief — m8sci · Unit 10 Topic 1 · Reflection, Absorption & Transmission

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 10 — Light, Sound & Information |
| Topic index in unit | 1 |
| Title | Reflection, Absorption & Transmission |
| Slug | `reflection-absorption-and-transmission` |
| Standard | `MS-PS4-2` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u10-reflection-absorption-and-transmission.ts` |
| Export symbol | `SEED_M8SCI_U10_REFLECTION_ABSORPTION_AND_TRANSMISSION` |
| Plan id | `evelyn.ms.m8sci.reflection-absorption-and-transmission.v1` |
| Learning-objective id | `m8sci.reflection-absorption-and-transmission` |
| `los[0].standard` | `M8SCI-10.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'10'` / `'10.1'` / `'Reflection, Absorption & Transmission'` |
| `prerequisites` | ["m8sci.amplitude-and-wave-energy"] |
| `followUps` | ["m8sci.refraction-bending-light-at-a-boundary"] |

## Scope — teach exactly this, and nothing adjacent

Model what happens when a light or sound wave meets a material — reflected (mirror, echo), absorbed (a black curtain, acoustic foam), transmitted (window glass, a thin wall) — usually some of each, explain that we see an object because light reflects off it into the eye and that a red object reflects red light and absorbs the rest, and predict the outcome for a described material (first of two lessons sharing MS-PS4-2, split by phenomenon: 10.2 is bending at a boundary).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-sound-light.ts` (concept-similarities keyIdeas; try laser-on-wall vs black-curtain item; worked-echo idea) — reusable framing (try item recast as MCQ; the 343 m/s echo calculation is NOT carried forward — the light-quantitative echo lives in 9.3)

## Hard rules

- Write ONLY `m8sci-u10-reflection-absorption-and-transmission.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
