# Lesson brief — m8sci · Unit 6 Topic 3 · Density, Thermal Expansion & Why Warm Fluids Rise

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 6 — The Particle Model of Matter |
| Topic index in unit | 3 |
| Title | Density, Thermal Expansion & Why Warm Fluids Rise |
| Slug | `density-thermal-expansion-and-why-warm-fluids-rise` |
| Standard | `MS-PS1-4` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u6-density-thermal-expansion-and-why-warm-fluids-rise.ts` |
| Export symbol | `SEED_M8SCI_U6_DENSITY_THERMAL_EXPANSION_AND_WHY_WARM_FLUIDS_RISE` |
| Plan id | `evelyn.ms.m8sci.density-thermal-expansion-and-why-warm-fluids-rise.v1` |
| Learning-objective id | `m8sci.density-thermal-expansion-and-why-warm-fluids-rise` |
| `los[0].standard` | `M8SCI-6.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'6'` / `'6.3'` / `'Density, Thermal Expansion & Why Warm Fluids Rise'` |
| `prerequisites` | ["m8sci.changes-of-state-and-thermal-energy"] |
| `followUps` | ["m8sci.characteristic-properties-identify-a-substance"] |

## Scope — teach exactly this, and nothing adjacent

Explain density as how much mass is packed into a given volume (compare described samples: 10 g in 5 cm³ is denser than 10 g in 20 cm³), explain that warming a fluid makes its particles move faster and spread apart so the same mass takes more volume and the fluid becomes LESS dense, and use that to explain why warm air, warm water and (qualitatively) warm mantle rock rise while cooler material sinks — the particle-level "why" behind convection in 5.2 and behind Grade 6's mantle-convection and ocean-current lessons, which are referenced, not re-taught (shares MS-PS1-4 with 6.2 as a coarse split: that lesson is the change-of-state consequence of adding thermal energy, this one is the volume/density consequence). Withholds buoyant force and Archimedes' principle (`ap-physics2-fluids.ts`; sign-off 10) and density-as-conversion-factor arithmetic (`chem-u1-density-dimensional-analysis.ts`).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g6-sci-density-buoyancy.ts` (concept-density keyIdeas; misconception "heavy sinks, light floats"; steel-bar-vs-ship hook) — reusable for density = mass per volume and the weight-vs-density misconception only; do NOT carry forward concept-buoyancy / Archimedes or the numeric density-of-rock item

## Hard rules

- Write ONLY `m8sci-u6-density-thermal-expansion-and-why-warm-fluids-rise.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
