# Lesson brief — m8geo · Unit 2 Topic 1 · GIS Layers & Overlay Reasoning

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — GIS & Geospatial Reasoning |
| Topic index in unit | 1 |
| Title | GIS Layers & Overlay Reasoning |
| Slug | `gis-layers-and-overlay` |
| Standard | `NGS 1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u2-gis-layers-and-overlay.ts` |
| Export symbol | `SEED_M8GEO_U2_GIS_LAYERS_AND_OVERLAY` |
| Plan id | `evelyn.ms.m8geo.gis-layers-and-overlay.v1` |
| Learning-objective id | `m8geo.gis-layers-and-overlay` |
| `los[0].standard` | `M8GEO-2.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.1'` / `'GIS Layers & Overlay Reasoning'` |
| `prerequisites` | ["m8geo.maps-as-arguments"] |
| `followUps` | ["m8geo.buffers-and-proximity"] |

## Scope — teach exactly this, and nothing adjacent

Explain a geographic information system as separate data layers (parcels, roads, flood zone, land use) each tied to the same locations, and use a described overlay of two or three layers to answer a where-question (which described parcels are inside the flood zone AND next to a road). **No G7 antecedent** — none of the 40 `m7geo` LO descriptions mentions GIS, layers or overlay; the G6 table's progression rationale says the same and reserved this for G8. Deepens G6 7.1 `m6geo-u7-satellite-images-and-aerial-views.ts` (what an image shows versus a map) and G6 7.3 (reading one thematic layer). Software procedures — menus, file formats, projections in software — are withheld from the whole course by design (see For sign-off #5).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8geo-u2-gis-layers-and-overlay.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
