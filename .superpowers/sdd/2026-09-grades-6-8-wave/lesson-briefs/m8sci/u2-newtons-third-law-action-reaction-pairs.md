# Lesson brief — m8sci · Unit 2 Topic 3 · Newton's Third Law: Action-Reaction Pairs

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | 2 — Forces & Newton's Laws |
| Topic index in unit | 3 |
| Title | Newton's Third Law: Action-Reaction Pairs |
| Slug | `newtons-third-law-action-reaction-pairs` |
| Standard | `MS-PS2-1` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/m8sci-u2-newtons-third-law-action-reaction-pairs.ts` |
| Export symbol | `SEED_M8SCI_U2_NEWTONS_THIRD_LAW_ACTION_REACTION_PAIRS` |
| Plan id | `evelyn.ms.m8sci.newtons-third-law-action-reaction-pairs.v1` |
| Learning-objective id | `m8sci.newtons-third-law-action-reaction-pairs` |
| `los[0].standard` | `M8SCI-2.3` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'2'` / `'2.3'` / `'Newton's Third Law: Action-Reaction Pairs'` |
| `prerequisites` | ["m8sci.newtons-second-law-force-mass-and-acceleration"] |
| `followUps` | ["m8sci.collisions-and-designing-for-safety"] |

## Scope — teach exactly this, and nothing adjacent

Identify the action-reaction pair in a described interaction (you push the wall, the wall pushes you; a swimmer pushes water back, water pushes the swimmer forward), state that the two forces are equal in size, opposite in direction, and act on DIFFERENT objects, and explain why they therefore never cancel (first of two lessons sharing MS-PS2-1: this one is the law, 2.4 is the design application).

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/m8sci-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

`g8-sci-newtons-laws.ts` (concept-third-law keyIdeas; worked-rocket; misconception "forces all cancel") and `g7-sci-newton-laws-bridge.ts` (worked-jumping example, misconception-third-law-cancel) — directly reusable framing and misconception text

## Hard rules

- Write ONLY `m8sci-u2-newtons-third-law-action-reaction-pairs.ts`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
