# Lesson brief — m8geo · Unit 2 Topic 3 · Site Selection with Weighted Criteria

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — GIS & Geospatial Reasoning |
| Topic index in unit | 3 |
| Title | Site Selection with Weighted Criteria |
| Slug | `site-selection-with-weighted-criteria` |
| Standard | `NGS 3` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u2-site-selection-with-weighted-criteria.ts` |
| Export symbol | `SEED_M8GEO_U2_SITE_SELECTION_WITH_WEIGHTED_CRITERIA` |
| Plan id | `evelyn.ms.m8geo.site-selection-with-weighted-criteria.v1` |
| Learning-objective id | `m8geo.site-selection-with-weighted-criteria` |
| `los[0].standard` | `M8GEO-2.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.3'` / `'Site Selection with Weighted Criteria'` |
| `prerequisites` | ["m8geo.buffers-and-proximity"] |
| `followUps` | ["m8geo.change-detection-from-satellite-data"] |

## Scope — teach exactly this, and nothing adjacent

Given several described candidate sites and a set of criteria split into must-haves and weighted preferences, eliminate sites that fail a must-have, score the rest, and justify the choice — then evaluate how a change in one weight changes the winner. Deepens G6 10.1 `m6geo-u10-geographic-reasoning-in-everyday-decisions.ts`, which applied site-and-situation to choose one facility's location from stated reasons, and G7 3.4 `m7geo-u3-urbanization-and-settlement.ts`, which taught that cities form at sites that solve a problem (water, defensible site, break-of-bulk, resources); G8 makes the decision multi-criteria and scored. Not yet optimization or cost-distance surfaces.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8geo-u2-site-selection-with-weighted-criteria.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
