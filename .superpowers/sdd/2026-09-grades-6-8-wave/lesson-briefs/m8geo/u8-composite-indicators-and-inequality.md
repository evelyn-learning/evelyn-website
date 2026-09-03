# Lesson brief — m8geo · Unit 8 Topic 2 · Composite Indicators & Inequality

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 8 — Globalization, Trade Networks & Development |
| Topic index in unit | 2 |
| Title | Composite Indicators & Inequality |
| Slug | `composite-indicators-and-inequality` |
| Standard | `NGS 11` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8geo-u8-composite-indicators-and-inequality.ts` |
| Export symbol | `SEED_M8GEO_U8_COMPOSITE_INDICATORS_AND_INEQUALITY` |
| Plan id | `evelyn.ms.m8geo.composite-indicators-and-inequality.v1` |
| Learning-objective id | `m8geo.composite-indicators-and-inequality` |
| `los[0].standard` | `M8GEO-8.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'8'` / `'8.2'` / `'Composite Indicators & Inequality'` |
| `prerequisites` | ["m8geo.specialization-and-supply-chain-risk"] |
| `followUps` | ["m8geo.where-factories-locate"] |

## Scope — teach exactly this, and nothing adjacent

Given a described table of four indicators for several invented countries, build a simple composite (rank each indicator, average the ranks), show how the result changes when an indicator is added or dropped, and interpret a described inequality measure (the share of income held by the top fifth versus the bottom fifth) to explain why two countries with equal averages can differ. Deepens G7 5.3, which taught the indicators, why a composite combines them, and that one number never describes a country; G8 constructs the composite and adds distribution within the average. Measured, never ranked as a virtue (G7 contract rule 4).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8geo-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8geo-u8-composite-indicators-and-inequality.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
