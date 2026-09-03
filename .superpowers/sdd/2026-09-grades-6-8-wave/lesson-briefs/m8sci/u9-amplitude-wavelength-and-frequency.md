# Lesson brief — m8sci · Unit 9 Topic 2 · Amplitude, Wavelength & Frequency

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 9 — Waves & Their Properties |
| Topic index in unit | 2 |
| Title | Amplitude, Wavelength & Frequency |
| Slug | `amplitude-wavelength-and-frequency` |
| Standard | `MS-PS4-1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u9-amplitude-wavelength-and-frequency.ts` |
| Export symbol | `SEED_M8SCI_U9_AMPLITUDE_WAVELENGTH_AND_FREQUENCY` |
| Plan id | `evelyn.ms.m8sci.amplitude-wavelength-and-frequency.v1` |
| Learning-objective id | `m8sci.amplitude-wavelength-and-frequency` |
| `los[0].standard` | `M8SCI-9.2` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'9'` / `'9.2'` / `'Amplitude, Wavelength & Frequency'` |
| `prerequisites` | ["m8sci.what-a-wave-is"] |
| `followUps` | ["m8sci.wave-speed-frequency-and-wavelength"] |

## Scope — teach exactly this, and nothing adjacent

Read the three measures of a simple wave from a description written in words — amplitude (height from rest position to crest), wavelength (crest to crest), frequency (waves passing per second, in hertz) — and map them onto sound: frequency is heard as pitch, amplitude as loudness, and the two are independent (a quiet high note; a loud low one) (first of two lessons sharing MS-PS4-1, split by stage: this one names and reads the measures, 9.4 relates amplitude to energy). Withholds period and phase (AP Physics).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-wave-properties.ts` (concept-anatomy keyIdeas; misconception "louder sounds have higher pitch") — directly reusable definitions and misconception text; do NOT carry forward period T = 1/f or the numeric speed values

## Hard rules

- Write ONLY `m8sci-u9-amplitude-wavelength-and-frequency.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
