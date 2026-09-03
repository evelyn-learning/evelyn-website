# Lesson brief — m8geo · Unit 1 Topic 3 · Scale of Analysis & Hidden Patterns

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 1 — Geographic Data & Spatial Analysis |
| Topic index in unit | 3 |
| Title | Scale of Analysis & Hidden Patterns |
| Slug | `scale-of-analysis-and-hidden-patterns` |
| Standard | `NGS 3` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u1-scale-of-analysis-and-hidden-patterns.ts` |
| Export symbol | `SEED_M8GEO_U1_SCALE_OF_ANALYSIS_AND_HIDDEN_PATTERNS` |
| Plan id | `evelyn.ms.m8geo.scale-of-analysis-and-hidden-patterns.v1` |
| Learning-objective id | `m8geo.scale-of-analysis-and-hidden-patterns` |
| `los[0].standard` | `M8GEO-1.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'1'` / `'1.3'` / `'Scale of Analysis & Hidden Patterns'` |
| `prerequisites` | ["m8geo.evaluating-a-choropleth"] |
| `followUps` | ["m8geo.maps-as-arguments"] |

## Scope — teach exactly this, and nothing adjacent

Given the same described data aggregated at national, regional and local scale, compute or compare the figures at each scale and state which claims each scale can and cannot support (a national average that is high while every district but one is low; a regional pattern that vanishes when districts are merged). Deepens G7 3.1 (a density figure is an average that can hide clustering) and G7 5.3 (a national average hides the variation inside it) — both of which taught THAT the average hides; G8 works the sub-unit figures to show WHAT it hides and evaluates a claim at each scale. The formal names (ecological fallacy, modifiable areal unit problem) are withheld; they belong to a high-school or AP statistics treatment that no seed in the library currently owns (`UNVERIFIED` for AP Statistics content).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8geo-u1-scale-of-analysis-and-hidden-patterns.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
