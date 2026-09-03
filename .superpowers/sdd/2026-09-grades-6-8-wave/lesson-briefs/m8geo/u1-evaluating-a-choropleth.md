# Lesson brief — m8geo · Unit 1 Topic 2 · Evaluating a Choropleth Map

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 1 — Geographic Data & Spatial Analysis |
| Topic index in unit | 2 |
| Title | Evaluating a Choropleth Map |
| Slug | `evaluating-a-choropleth` |
| Standard | `NGS 1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u1-evaluating-a-choropleth.ts` |
| Export symbol | `SEED_M8GEO_U1_EVALUATING_A_CHOROPLETH` |
| Plan id | `evelyn.ms.m8geo.evaluating-a-choropleth.v1` |
| Learning-objective id | `m8geo.evaluating-a-choropleth` |
| `los[0].standard` | `M8GEO-1.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'1'` / `'1.2'` / `'Evaluating a Choropleth Map'` |
| `prerequisites` | ["m8geo.counts-rates-and-fair-comparison"] |
| `followUps` | ["m8geo.scale-of-analysis-and-hidden-patterns"] |

## Scope — teach exactly this, and nothing adjacent

Given a described choropleth (its classes, their break values, and the value of each described region), determine which regions share a class, explain how re-drawing the class breaks or mapping a count instead of a rate changes the pattern shown, and judge whether the described map supports a stated conclusion. Deepens G6 7.3 `m6geo-u7-reading-a-thematic-map.ts`, which read one described thematic map's key to answer a data question, and G7 1.3 `m7geo-u1-map-elements-scale-and-direction.ts`, which taught legend, scale and the large-scale/small-scale rule; G8 evaluates the classing choice itself. Not yet cartographic software or color theory.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8geo-u1-evaluating-a-choropleth.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
