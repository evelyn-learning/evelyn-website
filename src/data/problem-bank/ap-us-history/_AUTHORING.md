# AP US History — Problem Bank Authoring Notes

## Unit 3: The American Revolution & the Early Republic (Period 3, ~1754–1800)

Stimulus-based MCQ bank (`u3.json`) keyed to the six Period-3 primary/visual
source documents seeded in `src/lib/tutor/passages/seeds/apush-*.ts` +
`henry-give-me-liberty.ts`, and to the five Period-3 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apush-u3-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u3.json |
|---|---|---|---|
| `apush.causes-of-revolution` | `AP-APUSH-3.2` | Causes of the American Revolution (imperial crisis, taxation, Common Sense, Join-or-Die). | 2 |
| `apush.revolutionary-ideals` | `AP-APUSH-3.3` | Enlightenment/republican ideals (natural rights, consent of the governed, Locke). | 2 |
| `apush.articles-of-confederation` | `AP-APUSH-3.9` | Articles of Confederation — deliberately weak central government, its causes and consequences. | 2 |
| `apush.constitution-ratification` | `AP-APUSH-3.10` | Constitutional Convention & ratification debate (Federalist/Anti-Federalist). | 2 |
| `apush.new-republic` | `AP-APUSH-3.11` | The new republic under Washington (Whiskey Rebellion, rise of political parties). | 2 |
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

Each item anchors to one of the seven Period-3 passage seeds via `passageId`
(for grouping/render):

- `evelyn.passage.apush-join-or-die.v1` — Franklin, "Join, or Die" (1754 cartoon) — 1 item
- `evelyn.passage.apush-common-sense.v1` — Paine, *Common Sense* (1776) — 1 item
- `evelyn.passage.apush-declaration.v1` — Declaration of Independence (1776) — 2 items
- `evelyn.passage.henry-give-me-liberty.v1` — Henry, "Give Me Liberty" (1775) — 1 item
- `evelyn.passage.apush-constitution-preamble.v1` — Constitution Preamble (1787) — 2 items
- `evelyn.passage.apush-federalist-10.v1` — Madison, *Federalist No. 10* (1787) — 2 items
- `evelyn.passage.apush-brutus-1.v1` — *Brutus No. 1* (1787, Anti-Federalist) — 1 item

## Authoring rule: self-contained stems (controller override)

Same rule as the AP English Language bank: `scripts/seed-problem-bank.ts`'s
verify-at-ingest gate solves each item from `problemText` alone — it does
**not** load the referenced passage. So every stem inlines the specific short
quoted line or image description it questions, directly in the stem text,
before asking the historical-reasoning question. Quoted spans are kept short
(a phrase or single sentence) both for content-filter safety and because AP
MCQ stimuli are always excerpts, never full documents. `passageId` is still
set on every item — it drives stimulus-set grouping and full-document
rendering during a session; it is not required to *answer* the MCQ.

## Historical-reasoning skills tested

Unlike the AP English Language bank (rhetorical analysis of a single text),
APUSH MCQs test authentic AP US History source-analysis skills against the
Period-3 documents:

- **Sourcing / point of view** — Madison's stance in Federalist 10 (constitution-ratification.mcq.01); Locke's social-contract theory behind the Declaration (revolutionary-ideals.mcq.01).
- **Contextualization** — Join-or-Die's revival in the 1760s-70s imperial crisis (causes-of-revolution.mcq.01); Common Sense's appeal after Lexington and Concord (causes-of-revolution.mcq.02).
- **Causation** — the Declaration preamble's consent-of-the-governed principle plus revolutionary distrust of concentrated power shaping the deliberately weak Articles of Confederation executive (articles-of-confederation.mcq.02 — stem quotes only the seeded preamble line and frames the grievance history as outside knowledge, so the stimulus matches the seeded excerpt); Preamble language as a rebuke of the Articles' weaknesses (articles-of-confederation.mcq.01).
- **Comparison** — Brutus No. 1 vs. Federalist No. 10 on republic size and faction (constitution-ratification.mcq.02); Henry vs. the Declaration on natural-rights liberty (revolutionary-ideals.mcq.02).
- **Continuity/change** — the Whiskey Rebellion testing the new government's promise of domestic tranquility (new-republic.mcq.01); the rise of Federalist/Democratic-Republican parties despite Madison's Federalist 10 hopes (new-republic.mcq.02).

## Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1×1, 2×5, 3×3, 4×1.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=2, B=2, C=3, D=3. Sequence: `CADBACDBCD` — not all-A, not a repeating
  ABCD pattern (the known "everything keys to A" trap from earlier banks).
- Choice lengths equalized per item (word-count checked): in a first draft
  the correct answer was the longest/tied-longest option in 9 of 10 items (a
  test-wiseness exploit); a revision shortened correct choices and enriched
  distractors so the correct answer is now the longest in **0 of 10** items
  (each item has at least one distractor of equal-or-greater length).
  Verify: `npx tsx -e "const a=require('./src/data/problem-bank/ap-us-history/u3.json'); for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); console.log(i.id, w[ci]===Math.max(...w));}"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short phrases from public-domain Period-3 documents (never transcribed
  wholesale from a real AP exam). `license: 'internal-original'` per
  `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-us-history --file=u3.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected
— both on the initial draft and after the choice-length / AoC-stem revision.
`npm run lint:passages` clean (10 passages resolve, including all 7 referenced
by this bank).

## Unit 8: The Cold War, the Sixties, and the 1970s (Period 8, ~1945–1980)

Stimulus-based MCQ bank (`u8.json`) keyed to the four new Period-8 primary
source documents seeded in `src/lib/tutor/passages/seeds/apush-{truman-doctrine,
eisenhower-farewell,jfk-inaugural,lbj-great-society}.ts`, plus ONE REUSED
document (`apgov-brown-opinion.ts`, seeded for AP Gov Unit 3 — not re-seeded
here), and to the five Period-8 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apush-u8-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u8.json |
|---|---|---|---|
| `apush.cold-war-origins` | `AP-APUSH-8.2` | Origins of the Cold War — containment, Truman Doctrine, Eisenhower's military-industrial-complex warning. | 3 |
| `apush.sixties-vietnam` | `AP-APUSH-8.11` | JFK's New Frontier through LBJ's Great Society and the Vietnam War. | 3 |
| `apush.civil-rights-movement` | `AP-APUSH-8.9` | The civil rights movement — Brown v. Board of Education as its doctrinal spark. | 1 |
| `apush.postwar-society` | `AP-APUSH-8.4` | Postwar prosperity and its uneven distribution (redlining, persistent poverty). | 2 |
| `apush.seventies-crisis` | `AP-APUSH-8.14` | Nixon-era détente as a managed Cold War tactic, not a general disengagement. | 1 |
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

Seven of the ten items anchor to a Period-8 passage seed via `passageId` (for
grouping/render); the remaining three (`postwar-society` ×2,
`seventies-crisis` ×1) are non-stimulus items per the period spec, covering
LOs without a wired passage:

- `evelyn.passage.apush-truman-doctrine.v1` — Truman, Address to Congress (Truman Doctrine, March 1947) — 2 items
- `evelyn.passage.apush-eisenhower-farewell.v1` — Eisenhower, Farewell Address ("military-industrial complex," 1961) — 1 item
- `evelyn.passage.apush-jfk-inaugural.v1` — JFK, Inaugural Address (1961) — 1 item
- `evelyn.passage.apush-lbj-great-society.v1` — LBJ, Remarks at the University of Michigan ("the Great Society," 1964) — 2 items
- `evelyn.passage.apgov-brown-opinion.v1` — Warren, opinion in *Brown v. Board of Education* (1954, REUSED from AP Gov Unit 3) — 1 item

## Historical-reasoning skills tested

Same authentic AP US History source-analysis skills as the Unit-3 bank,
applied to Period-8 Cold War/civil-rights-era material:

- **Sourcing / point of view** — Eisenhower (a former five-star general) warning about the military-industrial complex he himself had presided over (cold-war-origins.mcq.03).
- **Contextualization** — Truman's binary "two ways of life" framing as the rhetorical vehicle for containment (cold-war-origins.mcq.02); JFK's "pay any price" pledge as continuity with, not a break from, containment-era commitments (sixties-vietnam.mcq.01).
- **Causation** — Truman's universal phrasing converting a narrow Greece/Turkey aid request into an open-ended doctrine (cold-war-origins.mcq.01); redlining alongside the GI Bill/FHA loans producing an unevenly distributed boom (postwar-society.mcq.01).
- **Comparison / synthesis** — reconciling Nixon's détente with continued Vietnam fighting and expanded defense spending (seventies-crisis.mcq.01); Johnson's "just the beginning" and "not a...finished work" lines showing the Great Society's scope and open-endedness (sixties-vietnam.mcq.02, .03).
- **Continuity/change** — Brown v. Board as the doctrinal spark of a decade-long movement rather than its conclusion, given what the ruling did and did not reach (civil-rights-movement.mcq.01); persistent poverty complicating the "prosperity reached everyone" claim (postwar-society.mcq.02).

## Historical accuracy / sensitivity notes

- No MLK material (speeches, "Letter from Birmingham Jail") is quoted or
  referenced anywhere in this bank — the civil-rights item anchors solely to
  the reused *Brown* opinion excerpt, consistent with the plan's zero-quote
  rule for still-copyrighted King works.
- The `apush.sixties-vietnam` items test JFK's inaugural rhetoric and LBJ's
  Great Society vision rather than Vietnam War combat detail directly,
  matching the plan's measured tone on the era's most sensitive material.
- Détente item (`seventies-crisis.mcq.01`) deliberately tests the same
  "détente ended the Cold War" misconception flagged in the content plan's
  own `misconception_check` segment, reframed as an MCQ reasoning task.

## Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1×1, 2×4, 3×3, 4×2.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=2, B=2, C=3, D=3. Sequence: `CADBCDABDC` — not all-A, not a repeating
  ABCD pattern.
- Choice lengths checked with the same word-count script as Unit 3: in a
  first draft, `cold-war-origins.mcq.01`'s correct answer TIED for longest
  with a distractor (14 words each); one distractor was lengthened (kept
  plausible in content) to break the tie. Final result: the correct answer
  is the (strict, non-tied) longest option in **0 of 10** items.
  Verify: `npx tsx -e "const a=require('./src/data/problem-bank/ap-us-history/u8.json'); for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); console.log(i.id, w[ci]===Math.max(...w));}"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short phrases from the seeded public-domain Period-8 documents (never
  transcribed wholesale from a real AP exam). `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-us-history --file=u8.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (34 passages resolve, including all 5 referenced
by this bank — 4 new Period-8 passages plus the reused `apgov-brown-opinion`).
