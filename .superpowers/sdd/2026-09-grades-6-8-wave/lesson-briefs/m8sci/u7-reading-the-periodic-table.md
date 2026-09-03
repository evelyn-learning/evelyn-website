# Lesson brief — m8sci · Unit 7 Topic 3 · Reading the Periodic Table

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 7 — Atoms, Elements & the Periodic Table |
| Topic index in unit | 3 |
| Title | Reading the Periodic Table |
| Slug | `reading-the-periodic-table` |
| Standard | `PS1.A` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u7-reading-the-periodic-table.ts` |
| Export symbol | `SEED_M8SCI_U7_READING_THE_PERIODIC_TABLE` |
| Plan id | `evelyn.ms.m8sci.reading-the-periodic-table.v1` |
| Learning-objective id | `m8sci.reading-the-periodic-table` |
| `los[0].standard` | `M8SCI-7.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'7'` / `'7.3'` / `'Reading the Periodic Table'` |
| `prerequisites` | ["m8sci.inside-the-atom"] |
| `followUps` | ["m8sci.molecules-formulas-and-extended-structures"] |

## Scope — teach exactly this, and nothing adjacent

Locate an element by period (row) and group (column), read its symbol and atomic number, tell metals from nonmetals and metalloids by position and by described properties (shiny, conducts, bends vs dull, brittle, insulates), and predict that elements in the same group behave alike (the alkali metals all react with water; the noble gases barely react at all) (DCI PS1.A; supports MS-PS1-1's models). Withholds valence electrons as the reason for group behavior, periodic trends in radius/ionization energy/electronegativity (`chem-u3-periodic-table-organization.ts`, `chem-u3-periodic-trends.ts`).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g7-sci-periodic-table-intro.ts` (hook "the table is a map"; concept-organization and concept-properties-by-position keyIdeas; worked sodium-vs-cesium; try helium→argon) — directly reusable framing and examples (try item recast as MCQ); do NOT carry forward the misconception segment's electron-configuration explanation, which is `chem-u3-*`

## Hard rules

- Write ONLY `m8sci-u7-reading-the-periodic-table.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
