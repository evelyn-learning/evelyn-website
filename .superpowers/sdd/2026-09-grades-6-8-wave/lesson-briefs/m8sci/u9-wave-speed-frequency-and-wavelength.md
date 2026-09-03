# Lesson brief — m8sci · Unit 9 Topic 3 · Wave Speed, Frequency & Wavelength

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 9 — Waves & Their Properties |
| Topic index in unit | 3 |
| Title | Wave Speed, Frequency & Wavelength |
| Slug | `wave-speed-frequency-and-wavelength` |
| Standard | `PS4.A` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u9-wave-speed-frequency-and-wavelength.ts` |
| Export symbol | `SEED_M8SCI_U9_WAVE_SPEED_FREQUENCY_AND_WAVELENGTH` |
| Plan id | `evelyn.ms.m8sci.wave-speed-frequency-and-wavelength.v1` |
| Learning-objective id | `m8sci.wave-speed-frequency-and-wavelength` |
| `los[0].standard` | `M8SCI-9.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'9'` / `'9.3'` / `'Wave Speed, Frequency & Wavelength'` |
| `prerequisites` | ["m8sci.amplitude-wavelength-and-frequency"] |
| `followUps` | ["m8sci.amplitude-and-wave-energy"] |

## Scope — teach exactly this, and nothing adjacent

Explain that a wave's speed is set by the medium it travels in (sound is faster in water than air, and does not travel through a vacuum), so that for waves in the SAME medium a higher frequency goes with a shorter wavelength (speed = frequency × wavelength as a described relationship), and apply distance = speed × time with small whole numbers to an echo or to counting seconds between lightning and thunder, choosing the stated result (DCI PS4.A; the relationship is the qualitative form of MS-PS4-1's "mathematical representations"). Withholds v = fλ computations with scientific notation or units conversion, which is the boundary crossed by `g8-sci-wave-properties.ts` (100 MHz radio example) — declined.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-wave-properties.ts` (try-1 thunder-delay idea) — reusable only if the numbers are made small and whole (e.g., 3 s at 300 m/s → 900 m) and the item is an MCQ; do NOT carry forward the worked-radio-wave 3 × 10⁸ m/s calculation

## Hard rules

- Write ONLY `m8sci-u9-wave-speed-frequency-and-wavelength.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
