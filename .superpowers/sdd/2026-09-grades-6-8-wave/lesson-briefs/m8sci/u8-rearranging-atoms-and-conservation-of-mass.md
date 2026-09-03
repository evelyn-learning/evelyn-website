# Lesson brief — m8sci · Unit 8 Topic 2 · Rearranging Atoms & Conservation of Mass

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 8 — Chemical Reactions |
| Topic index in unit | 2 |
| Title | Rearranging Atoms & Conservation of Mass |
| Slug | `rearranging-atoms-and-conservation-of-mass` |
| Standard | `MS-PS1-5` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u8-rearranging-atoms-and-conservation-of-mass.ts` |
| Export symbol | `SEED_M8SCI_U8_REARRANGING_ATOMS_AND_CONSERVATION_OF_MASS` |
| Plan id | `evelyn.ms.m8sci.rearranging-atoms-and-conservation-of-mass.v1` |
| Learning-objective id | `m8sci.rearranging-atoms-and-conservation-of-mass` |
| `los[0].standard` | `M8SCI-8.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'8'` / `'8.2'` / `'Rearranging Atoms & Conservation of Mass'` |
| `prerequisites` | ["m8sci.evidence-of-a-chemical-reaction"] |
| `followUps` | ["m8sci.reactions-that-release-or-absorb-thermal-energy"] |

## Scope — teach exactly this, and nothing adjacent

Model a chemical reaction as reactants whose atoms are regrouped into products, count atoms of each kind before and after in a word-and-particle description (two hydrogen molecules plus one oxygen molecule → two water molecules: four hydrogen atoms and two oxygen atoms on each side), conclude that total mass is conserved, and explain "lost" mass in an open container as gas that escaped versus the unchanged reading in a sealed one. Grade 7 traced the same atom-conservation rule through an organism (`m7sci-u4-matter-and-energy-in-organisms.ts`, read in full) — cited as prior knowledge, not re-taught (MS-PS1-5 and the reactant/product model merged into one lesson; sign-off 7). Withholds writing and balancing symbolic equations with coefficients (`chem-u5-balancing-equations.ts`) and any mole reasoning (`chem-u6-*`).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g7-sci-conservation-mass.ts` (burning-log 100 g → 5 g ash hook and worked example; open vs closed system keyIdeas; sealed antacid-bottle try item) — directly reusable framing (try item recast as MCQ); do NOT carry forward concept-balanced-equations (coefficients, `show_balanced_equation` tool) or the E = mc² / nuclear aside in the misconception segment

## Hard rules

- Write ONLY `m8sci-u8-rearranging-atoms-and-conservation-of-mass.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
