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

## Unit 6: The Gilded Age (Period 6, 1865–1898)

Stimulus-based MCQ bank (`u6.json`) keyed to five of the six Period-6
primary/visual source documents seeded in `src/lib/tutor/passages/seeds/
apush-{carnegie-wealth,omaha-platform,chinese-exclusion,immigration-table,
cross-of-gold}.ts`, and to the five Period-6 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apush-u6-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly. Composition follows the period spec block
(carnegie 2, omaha 2, chinese-exclusion 1, immigration-table 2, cross-of-gold
1, non-stimulus labor + west 2 = 10 total).

| loId | cedCode | Topic | # items in u6.json |
|---|---|---|---|
| `apush.the-west-new-south` | `AP-APUSH-6.2` | The West and the New South (Homestead Act + railroad land grants as one combined settlement policy, displacing Plains nations). | 1 |
| `apush.industrialization-big-business` | `AP-APUSH-6.4` | Industrialization and Big Business (Carnegie's "Wealth" — Gospel of Wealth vs. Social Darwinism). | 2 |
| `apush.labor-movement` | `AP-APUSH-6.7` | The Labor Movement (Knights of Labor vs. AFL organizing strategy). | 1 |
| `apush.immigration-urbanization` | `AP-APUSH-6.8` | Immigration and Urbanization (Chinese Exclusion Act; immigration-by-decade data table, incl. the European sending-region shift). | 3 |
| `apush.gilded-politics-populism` | `AP-APUSH-6.11` | Gilded Age Politics and Populism (Omaha Platform preamble + free-silver demand; Bryan's "Cross of Gold"). | 3 |
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

Each stimulus item anchors to one of the five Period-6 passage seeds via
`passageId` (for grouping/render); the two non-stimulus items (labor,
the-west-new-south) intentionally omit `passageId` — no seeded passage is
wired to either LO's content plan (the labor plan's Knights-vs-AFL comparison
and the west plan's homestead-filings data point are both described,
non-passage primary-source analogies in their own worked examples, so the
MCQ bank does not fabricate a passage anchor for them either):

- `evelyn.passage.apush-carnegie-wealth.v1` — Carnegie, "Wealth" (1889) — 2 items
- `evelyn.passage.apush-omaha-platform.v1` — Omaha Platform (1892) — 2 items
- `evelyn.passage.apush-chinese-exclusion.v1` — Chinese Exclusion Act (1882) — 1 item
- `evelyn.passage.apush-immigration-table.v1` — U.S. immigration-by-decade data table (1861–1900) — 2 items
- `evelyn.passage.apush-cross-of-gold.v1` — Bryan, "Cross of Gold" speech (1896) — 1 item

## Authoring rule: self-contained stems (controller override)

Same rule as Unit 3: every stem inlines the specific short quoted line,
statute text, or table figures it questions, directly in the stem, before
asking the historical-reasoning question — the verify-at-ingest gate solves
each item from `problemText` (plus, for passage-anchored items, the full
passage text fed to the verifier) but the stem itself is written to stand
alone. Quoted spans are verbatim contiguous substrings of the seeded
`fullText` (ellipses mark elisions exactly as the source passage seeds mark
them). `immigration-table` items state explicitly that the region-shift
percentages (16%→43% Southern/Eastern Europe; 76%→46% Northern/Western
Europe) are **shares of that decade's European immigration specifically**,
never shares of total immigration — matching the scoping the passage seed
and its content plan both insist on (mcq.03 tests this scoping directly, as
its own question).

## Historical-reasoning skills tested

- **Sourcing / point of view** — Carnegie's "Wealth" as a duty-to-redistribute argument distinct from Social Darwinism (industrialization-big-business.mcq.01); the Omaha Platform's systemic-corruption preamble (gilded-politics-populism.mcq.01).
- **Contextualization** — the free-silver demand's link to farmers' deflation-driven debt crisis (gilded-politics-populism.mcq.02); Bryan's "Cross of Gold" closing lines as the 1896 free-silver-vs-gold-standard fight (gilded-politics-populism.mcq.03).
- **Comparison** — the Gospel of Wealth vs. Social Darwinism, both defending competition but diverging on what the wealthy owe afterward (industrialization-big-business.mcq.02); the Chinese Exclusion Act's binding federal force vs. the informal social prejudice European "new immigrants" faced (immigration-urbanization.mcq.01); Knights of Labor's broad membership vs. the AFL's narrower craft-union structure (labor-movement.mcq.01).
- **Data-table reading (quantitative)** — literal decade totals, correctly identifying the 1880s peak (immigration-urbanization.mcq.02); the region-shift percentages, correctly scoped to European immigration only, not total immigration (immigration-urbanization.mcq.03 — the bank's hardest item, difficulty 4).
- **Causation** — the Homestead Act and federally subsidized railroads as one combined settlement policy whose "opened" land was land Plains nations already depended on (the-west-new-south.mcq.01).

## Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1×1, 2×5, 3×3, 4×1 (immigration-urbanization.mcq.03,
  the region-shift scoping item, is the sole difficulty-4 item).
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=2, B=2, C=3, D=3. Sequence: `CADBACDBCD` — not all-A, not a repeating
  ABCD block.
- Choice lengths checked by word count per item: the correct answer is the
  longest/tied-longest option in **0 of 10** items (each item has at least
  one distractor of equal-or-greater length; several distractors are
  deliberately padded with extra clauses so the correct answer never stands
  out by length alone). Verify: `npx tsx -e "const a=require('./src/data/problem-bank/ap-us-history/u6.json'); for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); console.log(i.id, w[ci]===Math.max(...w));}"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from the five public-domain Period-6 documents
  (never transcribed wholesale from a real AP exam). `license:
  'internal-original'` per `scripts/seed-problem-bank.ts`.
- Real-misconception distractors used per the plan constraints: Carnegie's
  essay is NOT a defense of unlimited accumulation (industrialization-big-
  business.mcq.01/.02, matching the content plan's own misconception check);
  the Knights of Labor were NOT craft-only or uniformly radical
  (labor-movement.mcq.01); nativism was NOT applied uniformly across
  immigrant groups (immigration-urbanization.mcq.01); the West was NOT empty
  land awaiting settlers (the-west-new-south.mcq.01).

## Verification

`npm run seed:problem-bank -- --course=ap-us-history --file=u6.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (35 passages resolve, including all 5
referenced by this bank). `npx tsc --noEmit`: 0 errors.
