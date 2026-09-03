# Lesson brief — m8math · Unit 6 Topic 4 · Volume of Cylinders, Cones & Spheres

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8math-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 6 — Functions & Volume |
| Topic index in unit | 4 |
| Title | Volume of Cylinders, Cones & Spheres |
| Slug | `volume-of-cylinders-cones-and-spheres` |
| Standard | `8.G.C.9` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8math-u6-volume-of-cylinders-cones-and-spheres.ts` |
| Export symbol | `SEED_M8MATH_U6_VOLUME_OF_CYLINDERS_CONES_AND_SPHERES` |
| Plan id | `evelyn.ms.m8math.volume-of-cylinders-cones-and-spheres.v1` |
| Learning-objective id | `m8math.volume-of-cylinders-cones-and-spheres` |
| `los[0].standard` | `M8MATH-6.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'6'` / `'6.4'` / `'Volume of Cylinders, Cones & Spheres'` |
| `prerequisites` | ["m8math.comparing-functions-in-different-representations"] |
| `followUps` | ["m8math.rate-of-change-and-initial-value-from-tables-and-graphs"] |

## Scope — teach exactly this, and nothing adjacent

Extend V = Bh (`m7math-u8-volume-of-prisms-and-composite-solids.ts`, assumed) to cylinders using A = πr² (`m7math-u8-circumference-and-area-of-circles.ts`, assumed), then V = (1/3)πr²h for cones and V = (4/3)πr³ for spheres; solve real-world problems and work backwards to a radius or height; sits in this unit as the IM/Eureka pairing (volume as a nonlinear function of r; see sign-off 1). Withholds: surface area of curved solids, oblique solids, Cavalieri's principle, hemispheres/composites → `geom-u10-prisms-cylinders.ts`, `geom-u10-pyramids-cones-spheres.ts`; cone slant height.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8math-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-math-volume-surface-area.ts` (8.G.C.9 "formulas for the volumes of cones, cylinders, and spheres") — salvage the three formulas and the "when to use each, units" framing; do NOT carry its title's surface area, which is not in 8.G.C.9

## Hard rules

- Write ONLY `m8math-u6-volume-of-cylinders-cones-and-spheres.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
