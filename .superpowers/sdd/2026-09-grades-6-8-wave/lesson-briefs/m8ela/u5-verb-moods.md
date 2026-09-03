# Lesson brief — m8ela · Unit 5 Topic 4 · Verb Moods

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8ela-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 5 — Grammar: Verbals, Voice & Mood |
| Topic index in unit | 4 |
| Title | Verb Moods |
| Slug | `verb-moods` |
| Standard | `L.8.1c` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8ela-u5-verb-moods.ts` |
| Export symbol | `SEED_M8ELA_U5_VERB_MOODS` |
| Plan id | `evelyn.ms.m8ela.verb-moods.v1` |
| Learning-objective id | `m8ela.verb-moods` |
| `los[0].standard` | `M8ELA-5.4` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'5'` / `'5.4'` / `'Verb Moods'` |
| `prerequisites` | ["m8ela.active-and-passive-voice"] |
| `followUps` | ["m8ela.shifts-in-voice-and-mood"] |

## Scope — teach exactly this, and nothing adjacent

Form and identify verbs in the indicative (states), imperative (commands), interrogative (asks), conditional (would/could/might + verb; "if" clauses), and subjunctive (wishes and contrary-to-fact: "if I were", "I suggest that he be") mood, sorting sentences by the job the verb form signals. Identification only; using conditional and subjunctive for effect is row 6.2. Builds on `m7ela-u5-verb-tense-consistency.ts` (L.7.1: past/present/future answer WHEN; mood answers WHAT KIND of statement, which no G7 row addresses — the word "subjunctive" appears in no `m7ela-*` seed, grep verified). No HS English seed teaches verb mood (grep across `engl-*`, verified), so the row is complete in itself at the MS band.

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8ela-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

none

## Hard rules

- Write ONLY `m8ela-u5-verb-moods.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
