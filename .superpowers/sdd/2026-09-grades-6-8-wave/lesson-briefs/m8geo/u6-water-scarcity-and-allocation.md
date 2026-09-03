# Lesson brief — m8geo · Unit 6 Topic 1 · Water Scarcity & Allocation

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 6 — Resources, Energy & Sustainability |
| Topic index in unit | 1 |
| Title | Water Scarcity & Allocation |
| Slug | `water-scarcity-and-allocation` |
| Standard | `NGS 16` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u6-water-scarcity-and-allocation.ts` |
| Export symbol | `SEED_M8GEO_U6_WATER_SCARCITY_AND_ALLOCATION` |
| Plan id | `evelyn.ms.m8geo.water-scarcity-and-allocation.v1` |
| Learning-objective id | `m8geo.water-scarcity-and-allocation` |
| `los[0].standard` | `M8GEO-6.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'6'` / `'6.1'` / `'Water Scarcity & Allocation'` |
| `prerequisites` | ["m8geo.refugees-and-displacement"] |
| `followUps` | ["m8geo.comparing-energy-sources"] |

## Scope — teach exactly this, and nothing adjacent

Given a described river basin with upstream and downstream users, annual flow, and each user's stated demand, compute whether demand exceeds supply, distinguish physical scarcity (not enough water) from economic scarcity (water exists but cannot be reached or paid for), and evaluate described allocation rules (fixed shares, priority by first use, proportional cuts in dry years) by who bears a shortage. Deepens G7 5.2 (a renewable resource can still be used up), G7 6.3 `m7geo-u6-borders-and-conflict.ts` (a resource sitting across a boundary is a predictable cause of dispute) and G7 9.3 `m7geo-u9-middle-east-geography-and-resources.ts` (aridity and fresh water shape where settlement concentrates); G8 works the numbers and evaluates the rule. Structured on a Colorado-type basin using an invented one; not yet groundwater hydrology (`m6sci` 7.3).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8geo-u6-water-scarcity-and-allocation.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
