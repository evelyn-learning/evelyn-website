# AP English Language — Problem Bank Authoring Notes

## Unit 1: Rhetorical Situation & Reading for Argument

Passage-grouped MCQ bank (`u1.json`) built against the same 5 learning objectives
as the Unit-1 lesson plans and topic notes (`src/lib/tutor/lesson-plan/seeds/ap-englang-u1-*.ts`,
`src/lib/tutor/topic-notes/seeds/ap-englang-u1-*.ts`). `cedCode` mirrors each LO's
`standard` field exactly, so bank items, lesson-plan LOs, and topic notes all key
to the same College Board reference.

| loId | cedCode | Skill (CED framework) | # items in u1.json |
|---|---|---|---|
| `apenglang.rhetorical-situation` | `AP-ENGLANG-1.1` | Skill 1 — identify exigence, purpose, audience, writer, and context; state a defensible claim about rhetorical purpose. | 5 |
| `apenglang.reading-for-claim` | `AP-ENGLANG-1.2` | Skill 2.A — distinguish a text's topic from the writer's arguable claim; state that claim precisely. | 4 |
| `apenglang.defensible-thesis` | `AP-ENGLANG-1.3` | Skill 2.B — recognize a thesis that is arguable, responsive, and specific (vs. a restatement/summary/vague evaluation). | 3 |
| `apenglang.evidence-commentary` | `AP-ENGLANG-1.4` | Skill 2.C/2.D — explain how selected evidence functions and why it serves the writer's purpose. | 4 |
| `apenglang.audience-context` | `AP-ENGLANG-1.5` | Skill 1.B/1.C — explain how assumptions about audience/context shape specific stylistic choices; recognize persona/irony. | 4 |
| **Total** | | | **20** |

## Passage sets

Two passage-grouped sets, one per Unit-1 seed passage
(`src/lib/tutor/passages/seeds/`):

- **Set 1 — Douglass, "What to the Slave Is the Fourth of July?" (1852)**
  `passageId: evelyn.passage.douglass-fourth-of-july.v1` — 10 items
  (`apenglang.rhetorical-situation.mcq.01/02/03`, `.audience-context.mcq.01/02`,
  `.reading-for-claim.mcq.01/02`, `.evidence-commentary.mcq.01/02`,
  `.defensible-thesis.mcq.01`).
- **Set 2 — Henry, "Give Me Liberty or Give Me Death" (1775)**
  `passageId: evelyn.passage.henry-give-me-liberty.v1` — 10 items
  (`apenglang.rhetorical-situation.mcq.04/05`, `.reading-for-claim.mcq.03/04`,
  `.evidence-commentary.mcq.03/04`, `.defensible-thesis.mcq.02/03`,
  `.audience-context.mcq.03/04`).

## Authoring rule: self-contained stems (controller override)

Unlike a plain reading-passage bank, `scripts/seed-problem-bank.ts`'s verify-at-ingest
gate solves each item from `problemText` alone — it does **not** load the referenced
passage. So every stem here quotes the specific short line or phrase the question is
actually about, directly inline, before asking the rhetoric question (purpose, device
effect, tone, audience, meaning-in-context, or line of reasoning). This makes items
independently verifiable AND content-filter safe (only short quoted fragments, never
long or graphic spans of the source text). `passageId` is still set on every item —
it drives set-grouping in the picker and full-passage rendering during a session; it
is simply not required to *answer* the MCQ.

## Difficulty & answer-key hygiene

- Difficulty 1–4 mixed across both sets (overall spread: 1×5, 2×9, 3×4, 4×2).
- Correct-answer letters deliberately distributed evenly: A=5, B=5, C=5, D=5 across
  all 20 items (the known "everything keys to A" trap from earlier banks).
- All choices and stems are ORIGINAL — written for this bank, not transcribed from
  any real AP exam. `license: 'internal-original'` per `scripts/seed-problem-bank.ts`.
