# Lesson brief — m8geo · Unit 2 Topic 4 · Change Detection from Satellite Data

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — GIS & Geospatial Reasoning |
| Topic index in unit | 4 |
| Title | Change Detection from Satellite Data |
| Slug | `change-detection-from-satellite-data` |
| Standard | `NGS 14` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u2-change-detection-from-satellite-data.ts` |
| Export symbol | `SEED_M8GEO_U2_CHANGE_DETECTION_FROM_SATELLITE_DATA` |
| Plan id | `evelyn.ms.m8geo.change-detection-from-satellite-data.v1` |
| Learning-objective id | `m8geo.change-detection-from-satellite-data` |
| `los[0].standard` | `M8GEO-2.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.4'` / `'Change Detection from Satellite Data'` |
| `prerequisites` | ["m8geo.site-selection-with-weighted-criteria"] |
| `followUps` | ["m8geo.north-america-landform-regions"] |

## Scope — teach exactly this, and nothing adjacent

Given described land-cover data for one area at two dates (hectares of forest, farmland, built-up land, water at each date), compute the change in each class, identify the most likely conversion (forest to farmland, farmland to built-up), and state the limits of the evidence (image resolution, cloud, the date gap). Deepens G6 7.1 (what a satellite image shows) and G6 10.3 `m6geo-u10-how-physical-geography-changes-over-time.ts` (that physical geography changes gradually), and G7 7.4 `m7geo-u7-latin-america-environment-issues.ts`, which taught why land is cleared, terraced, irrigated and mined and the effects that follow; G8 measures the change from data. Not yet spectral bands or classification algorithms.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8geo-u2-change-detection-from-satellite-data.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
