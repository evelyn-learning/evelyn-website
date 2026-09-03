# Lesson brief — m8sci · Unit 7 Topic 4 · Molecules, Formulas & Extended Structures

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 7 — Atoms, Elements & the Periodic Table |
| Topic index in unit | 4 |
| Title | Molecules, Formulas & Extended Structures |
| Slug | `molecules-formulas-and-extended-structures` |
| Standard | `MS-PS1-1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u7-molecules-formulas-and-extended-structures.ts` |
| Export symbol | `SEED_M8SCI_U7_MOLECULES_FORMULAS_AND_EXTENDED_STRUCTURES` |
| Plan id | `evelyn.ms.m8sci.molecules-formulas-and-extended-structures.v1` |
| Learning-objective id | `m8sci.molecules-formulas-and-extended-structures` |
| `los[0].standard` | `M8SCI-7.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'7'` / `'7.4'` / `'Molecules, Formulas & Extended Structures'` |
| `prerequisites` | ["m8sci.reading-the-periodic-table"] |
| `followUps` | ["m8sci.evidence-of-a-chemical-reaction"] |

## Scope — teach exactly this, and nothing adjacent

Read a simple chemical formula written out (H₂O is two hydrogen atoms and one oxygen atom; CO₂; O₂ as a molecule of one element), match a formula to a described particle model, and distinguish substances made of separate molecules (water, carbon dioxide) from extended structures with no separate molecules (table salt, diamond, metals) (the formula-reading half of MS-PS1-1; the picture-level half is 7.1). Withholds writing formulas from names, subscripts vs coefficients, polyatomic ions, and ionic vs covalent bonding (`chem-u4-naming-compounds-formulas.ts`, `chem-u4-ionic-bonding.ts`, `chem-u4-covalent-bonding-lewis.ts`).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g6-sci-atoms-elements.ts` (worked-water H₂O parse; try CO₂ item) — reusable formula-reading examples (recast as MCQ)

## Hard rules

- Write ONLY `m8sci-u7-molecules-formulas-and-extended-structures.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
