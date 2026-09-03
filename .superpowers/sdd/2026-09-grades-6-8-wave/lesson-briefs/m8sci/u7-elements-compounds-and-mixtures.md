# Lesson brief — m8sci · Unit 7 Topic 1 · Elements, Compounds & Mixtures

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 7 — Atoms, Elements & the Periodic Table |
| Topic index in unit | 1 |
| Title | Elements, Compounds & Mixtures |
| Slug | `elements-compounds-and-mixtures` |
| Standard | `MS-PS1-1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u7-elements-compounds-and-mixtures.ts` |
| Export symbol | `SEED_M8SCI_U7_ELEMENTS_COMPOUNDS_AND_MIXTURES` |
| Plan id | `evelyn.ms.m8sci.elements-compounds-and-mixtures.v1` |
| Learning-objective id | `m8sci.elements-compounds-and-mixtures` |
| `los[0].standard` | `M8SCI-7.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'7'` / `'7.1'` / `'Elements, Compounds & Mixtures'` |
| `prerequisites` | ["m8sci.characteristic-properties-identify-a-substance"] |
| `followUps` | ["m8sci.inside-the-atom"] |

## Scope — teach exactly this, and nothing adjacent

Classify a described particle picture as an element (all atoms the same kind), a compound (atoms of two or more elements joined in a fixed way, with properties unlike its elements — table salt vs sodium metal and chlorine gas), or a mixture (different substances side by side, not joined, each keeping its properties), and state that an atom is the smallest unit of an element (MS-PS1-1's "atomic composition" at the picture level; the formula-reading half is 7.4). Withholds naming, bonding, and the homogeneous/heterogeneous split (`chem-u4-naming-compounds-formulas.ts`, `chem-u1-classifying-matter.ts`).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g6-sci-atoms-elements.ts` (hook: everything from ~90 building blocks; misconception "salt is just sodium and chlorine mixed") — directly reusable framing and misconception

## Hard rules

- Write ONLY `m8sci-u7-elements-compounds-and-mixtures.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
