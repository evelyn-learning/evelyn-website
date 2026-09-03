# Lesson brief — m8math · Unit 8 Topic 1 · Translations & Reflections

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 8 — Transformations, Congruence & Similarity |
| Topic index in unit | 1 |
| Title | Translations & Reflections |
| Slug | `translations-and-reflections` |
| Standard | `8.G.A.1, 8.G.A.3` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u8-translations-and-reflections.ts` |
| Export symbol | `SEED_M8MATH_U8_TRANSLATIONS_AND_REFLECTIONS` |
| Plan id | `evelyn.ms.m8math.translations-and-reflections.v1` |
| Learning-objective id | `m8math.translations-and-reflections` |
| `los[0].standard` | `M8MATH-8.1` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'8'` / `'8.1'` / `'Translations & Reflections'` |
| `prerequisites` | ["m8math.describing-and-sketching-qualitative-graphs"] |
| `followUps` | ["m8math.rotations-about-the-origin"] |

## Scope — teach exactly this, and nothing adjacent

Translate and reflect whole figures on the coordinate plane with coordinate rules ((x, y) → (x + a, y + b); reflection across the x-axis or the y-axis) and verify that lines map to lines, lengths and angle measures are preserved, and parallel lines stay parallel. Extends `m6math` row 6.2 (reflecting single points across the axes — assumed) to figures plus the preserved-property list. Withholds: translation vectors, reflection across y = x or other lines, orientation arguments → `geom-u4-translations.ts`, `geom-u4-reflections.ts`.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-transformations.ts` (8.G.A.1 + 8.G.A.3, all four transformations in ONE plan) — salvage the slide/flip vocabulary and coordinate rules; do NOT carry its four-in-one-lesson compression (each motion gets its own row here)

## Hard rules

- Write ONLY `m8math-u8-translations-and-reflections.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
