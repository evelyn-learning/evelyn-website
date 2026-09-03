# Lesson brief — m8geo · Unit 2 Topic 2 · Buffers & Proximity Analysis

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — GIS & Geospatial Reasoning |
| Topic index in unit | 2 |
| Title | Buffers & Proximity Analysis |
| Slug | `buffers-and-proximity` |
| Standard | `NGS 3` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u2-buffers-and-proximity.ts` |
| Export symbol | `SEED_M8GEO_U2_BUFFERS_AND_PROXIMITY` |
| Plan id | `evelyn.ms.m8geo.buffers-and-proximity.v1` |
| Learning-objective id | `m8geo.buffers-and-proximity` |
| `los[0].standard` | `M8GEO-2.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.2'` / `'Buffers & Proximity Analysis'` |
| `prerequisites` | ["m8geo.gis-layers-and-overlay"] |
| `followUps` | ["m8geo.site-selection-with-weighted-criteria"] |

## Scope — teach exactly this, and nothing adjacent

Apply a buffer of a stated distance around a described feature (a river, a school, a highway) to decide which described locations fall inside or outside it, and evaluate how changing the buffer distance changes the answer and which distance a stated rule (a setback, a service radius) requires. No G7 antecedent; extends G6 1.3 `m6geo-u1-absolute-and-relative-location.ts` (relative location as nearness) into measured distance reasoning. Not yet network distance versus straight-line distance beyond naming the difference, which is high-school GIS.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8geo-u2-buffers-and-proximity.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
