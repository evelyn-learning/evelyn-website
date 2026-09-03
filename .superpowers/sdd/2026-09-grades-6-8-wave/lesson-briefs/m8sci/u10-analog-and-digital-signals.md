# Lesson brief — m8sci · Unit 10 Topic 4 · Analog & Digital Signals

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 10 — Light, Sound & Information |
| Topic index in unit | 4 |
| Title | Analog & Digital Signals |
| Slug | `analog-and-digital-signals` |
| Standard | `MS-PS4-3` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u10-analog-and-digital-signals.ts` |
| Export symbol | `SEED_M8SCI_U10_ANALOG_AND_DIGITAL_SIGNALS` |
| Plan id | `evelyn.ms.m8sci.analog-and-digital-signals.v1` |
| Learning-objective id | `m8sci.analog-and-digital-signals` |
| `los[0].standard` | `M8SCI-10.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'10'` / `'10.4'` / `'Analog & Digital Signals'` |
| `prerequisites` | ["m8sci.light-versus-sound-and-the-electromagnetic-spectrum"] |
| `followUps` | [] |

## Scope — teach exactly this, and nothing adjacent

Explain that waves can carry information (a voice on a phone, a picture over wifi), distinguish an analog signal (a wave whose shape copies the original continuously) from a digital one (the information encoded as a pattern of on/off pulses — 1s and 0s), and use given information to argue that digital signals are more reliably copied and transmitted because small distortions do not change which pulses are "on" and "off" (MS-PS4-3, qualitative only). Withholds binary arithmetic, sampling rate and compression.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8sci-u10-analog-and-digital-signals.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
