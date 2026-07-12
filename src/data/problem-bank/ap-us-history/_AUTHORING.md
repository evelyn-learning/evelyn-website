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

## Unit 7: 1890–1945 (Period 7)

Stimulus-based MCQ bank (`u7.json`) keyed to the five Period-7 primary
document seeds in `src/lib/tutor/passages/seeds/apush-{roosevelt-corollary,
wilson-war-message,fdr-first-inaugural,four-freedoms,eo-9066}.ts`, and to the
six Period-7 content lesson-plan LOs (`src/lib/tutor/lesson-plan/seeds/
ap-apush-u7-*.ts`). `cedCode` mirrors each LO's `standard` field exactly.
Composition follows the period spec block (corollary 2, wilson 2,
fdr-inaugural 2, four-freedoms 1, eo-9066 2, non-stimulus progressivism 2 +
twenties 1 = 12 total).

| loId | cedCode | Topic | # items in u7.json |
|---|---|---|---|
| `apush.imperialism` | `AP-APUSH-7.2` | American Imperialism (the Roosevelt Corollary's "international police power," the Platt Amendment). | 2 |
| `apush.progressivism` | `AP-APUSH-7.4` | The Progressive Movement (Square Deal vs. New Freedom; NAWSA/National Woman's Party suffrage strategy). | 2 |
| `apush.wwi` | `AP-APUSH-7.6` | World War I (Wilson's idealist war message vs. the punitive Treaty of Versailles). | 2 |
| `apush.twenties` | `AP-APUSH-7.9` | The 1920s (uneven prosperity — the persistent farm depression). | 1 |
| `apush.depression-new-deal` | `AP-APUSH-7.11` | The Great Depression and the New Deal (FDR's First Inaugural — "fear itself" and "action, and action now"). | 2 |
| `apush.wwii` | `AP-APUSH-7.13` | World War II (the Four Freedoms; EO 9066's race-neutral text vs. its group-specific application). | 3 |
| **Total** | | | **12** |

## Anchoring documents (stimulus sets)

Each stimulus item anchors to one of the five Period-7 passage seeds via
`passageId` (for grouping/render); the three non-stimulus items
(progressivism ×2, twenties ×1) intentionally omit `passageId` — no seeded
passage is wired to either content plan (both plans' worked examples are
document-free comparative analyses, per the Period-7 block spec):

- `evelyn.passage.apush-roosevelt-corollary.v1` — TR, Fourth Annual Message to Congress (1904) — 2 items
- `evelyn.passage.apush-wilson-war-message.v1` — Wilson, war message to Congress (1917) — 2 items
- `evelyn.passage.apush-fdr-first-inaugural.v1` — FDR, First Inaugural Address (1933) — 2 items
- `evelyn.passage.apush-four-freedoms.v1` — FDR, Four Freedoms speech (1941) — 1 item
- `evelyn.passage.apush-eo-9066.v1` — Executive Order 9066 (1942) — 2 items

## Authoring rule: self-contained stems (controller override)

Same rule as Units 3 and 6: every stem inlines the specific short quoted
line it questions, directly in the stem, before asking the
historical-reasoning question. Quoted spans are verbatim contiguous
substrings of the seeded `fullText`. Two passages in this unit carry a
non-adjacency gotcha that this bank respects: the Roosevelt Corollary's
seeded excerpt has one elision (a transitional sentence about a country's
"hearty friendship"), so imperialism.mcq.01 quotes only from the span after
the ellipsis and imperialism.mcq.02 quotes the full sentence that follows it
in the same span — neither item bridges across the ellipsis. The FDR First
Inaugural's seeded excerpt is two non-adjacent spans from different
paragraphs ("fear itself" ... "action, and action now"); depression-new-
deal.mcq.01 quotes only the first span and .mcq.02 quotes only the second —
never combined into one bridged quote, and neither item quotes or attributes
"bold, persistent experimentation" (that phrase is from FDR's 1932
Oglethorpe University address, not this inaugural, as the passage seed and
content plan both flag). The EO 9066 items quote only the order's operative
authorization language, matching the passage's own scope (it excludes the
National Archives' surrounding background essay).

## Historical-reasoning skills tested

- **Sourcing / point of view** — the Roosevelt Corollary transforming the Monroe Doctrine from exclusion into intervention (imperialism.mcq.01); Wilson's war message framing U.S. entry as a disinterested moral cause rather than retaliation (wwi.mcq.01).
- **Contextualization** — the Platt Amendment as the standard of U.S.-supervised order Roosevelt held up for the Caribbean (imperialism.mcq.02); the Four Freedoms speech's universal war-aims framing nearly a year before Pearl Harbor (wwii.mcq.01).
- **Causation** — Wilson's idealistic "safe for democracy" framing setting up the later gap with the punitive Treaty of Versailles (wwi.mcq.02, the bank's sole difficulty-4 item); FDR's "fear itself" psychological diagnosis paired with the later "action, and action now" call anticipating the Hundred Days (depression-new-deal.mcq.01/.02).
- **Comparison** — Roosevelt's Square Deal (regulate) vs. Wilson's New Freedom (break up) as evidence of Progressivism's internal diversity, not a single agenda (progressivism.mcq.01); NAWSA's dual-track strategy vs. the National Woman's Party's direct action, both converging on the 19th Amendment (progressivism.mcq.02).
- **Close textual reading (source vs. application)** — EO 9066's formally race-neutral "any or all persons" text against its group-specific application to Japanese Americans (wwii.mcq.02); the citizenship status of those actually removed under it (wwii.mcq.03).
- **Continuity/uneven change** — the persistent 1920s farm depression as a genuine exception to consumer-economy prosperity (twenties.mcq.01).

## Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1×2 (depression-new-deal.mcq.01, progressivism.mcq.02),
  2×5 (imperialism.mcq.01, wwi.mcq.01, wwii.mcq.01, wwii.mcq.03,
  twenties.mcq.01), 3×4 (imperialism.mcq.02, depression-new-deal.mcq.02,
  wwii.mcq.02, progressivism.mcq.01), 4×1 (wwi.mcq.02, the Wilson-vs-
  Versailles item — the bank's hardest).
- Correct-answer letters distributed non-cyclically across all 12 items:
  A=3, B=3, C=3, D=3. Sequence: `ACBDCADBADCB` — not all-A, not a repeating
  ABCD block.
- Choice lengths checked by word count per item: an initial draft had the
  correct answer as the longest/tied-longest option in 6 of 12 items; a
  revision lengthened distractors (never shortened correct answers' content)
  so the correct answer is now the longest in **0 of 12** items. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-us-history/u7.json'); for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); console.log(i.id, w[ci]===Math.max(...w));}"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from the five public-domain Period-7 US-government
  documents (never transcribed wholesale from a real AP exam). `license:
  'internal-original'` per `scripts/seed-problem-bank.ts`.
- Real-misconception distractors used per the plan constraints: the New
  Deal did NOT end the Depression (depression-new-deal.mcq.02, matching the
  content plan's own misconception check — wartime mobilization did);
  the U.S. did NOT fight WWI from 1914 (wwi.mcq.02 — entry was April 1917);
  internment did NOT target only non-citizens (wwii.mcq.03 — most of the
  ~120,000 removed were U.S. citizens); Progressivism was NOT a single
  unified movement (progressivism.mcq.01, matching that content plan's own
  misconception check).

## Verification

`npm run seed:problem-bank -- --course=ap-us-history --file=u7.json --dry-run`:
12/12 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (40 passages resolve, including all 5
referenced by this bank). `npx tsc --noEmit`: 0 errors.
