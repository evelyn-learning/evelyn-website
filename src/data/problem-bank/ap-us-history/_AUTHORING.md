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

## Unit 4: 1800-1848 (Period 4)

Stimulus-based MCQ bank (`u4.json`) keyed to the five Period-4 primary-source
documents seeded in `src/lib/tutor/passages/seeds/apush-{jefferson-inaugural,
monroe-doctrine,jackson-bank-veto,seneca-falls,garrison-liberator}.ts`, and to
the five Period-4 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apush-u4-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly. Composition follows the Period-4 spec block:
jefferson 2, monroe 1, jackson-veto 2, seneca-falls 2, garrison 1,
non-stimulus market-revolution 2.

| loId | cedCode | Topic | # items in u4.json |
|---|---|---|---|
| `apush.jefferson-era` | `AP-APUSH-4.2` | The Age of Jefferson — the "Revolution of 1800," strict construction vs. Jefferson's actual record, the Marshall Court, the Louisiana Purchase, the War of 1812, the Era of Good Feelings, the Monroe Doctrine, the Missouri Compromise. | 3 |
| `apush.market-revolution` | `AP-APUSH-4.5` | The Market Revolution — the transportation revolution (Erie Canal), the factory system, commercial agriculture, immigration, the cult of domesticity, and its uneven regional reach. | 2 |
| `apush.jacksonian-democracy` | `AP-APUSH-4.8` | Jacksonian Democracy — expanded white male suffrage, the spoils system, the Bank War, the nullification crisis, Indian Removal. | 2 |
| `apush.reform-awakening` | `AP-APUSH-4.10` | Religion and Reform in Antebellum America — the Second Great Awakening, temperance, abolition, the Seneca Falls Convention, utopian communities, the common-school movement. | 2 |
| `apush.slavery-south` | `AP-APUSH-4.12` | African Americans in the Antebellum South — the cotton gin, the internal slave trade, planter/yeoman social structure, enslaved family/culture/resistance, hardening proslavery ideology. | 1 |
| **Total** | | | **10** |

Note the `apush.jefferson-era` LO carries 3 items rather than 2: the period
block groups the Monroe Doctrine stimulus item under this LO (the jefferson-era
content plan's key ideas cover the Era of Good Feelings and Monroe Doctrine
directly, with `AP-APUSH-4.2` as the standard), alongside 2 items anchored to
the Jefferson First Inaugural passage.

## Anchoring documents (stimulus sets)

Each stimulus item anchors to one of the five Period-4 passage seeds via
`passageId` (for grouping/render); the two `market-revolution` items are
non-stimulus (no passage — per the Period-4 content-plan spec, that plan's
worked example uses a data comparison rather than a quoted document):

- `evelyn.passage.apush-jefferson-inaugural.v1` — Jefferson, First Inaugural Address (1801) — 2 items
- `evelyn.passage.apush-monroe-doctrine.v1` — Monroe, Seventh Annual Message / the Monroe Doctrine (1823) — 1 item
- `evelyn.passage.apush-jackson-bank-veto.v1` — Jackson, Bank Veto Message (1832) — 2 items
- `evelyn.passage.apush-seneca-falls.v1` — Declaration of Sentiments, Seneca Falls (1848) — 2 items
- `evelyn.passage.apush-garrison-liberator.v1` — Garrison, *The Liberator* No. 1 (1831) — 1 item

## Historical-reasoning skills tested

- **Sourcing / point of view** — Jackson's populist framing of "the rich and powerful" vs. "the humble members of society" in the Bank Veto Message (jacksonian-democracy.mcq.01, .mcq.02); Monroe's assertion of hemispheric influence (jefferson-era.mcq.03).
- **Contextualization** — Jefferson's "we are all Republicans, we are all Federalists" read against the bitterness of the 1800 campaign (jefferson-era.mcq.01); Garrison's immediatism read against the older gradualist/colonization consensus (slavery-south.mcq.01).
- **Causation** — the Erie Canal's role in enabling commercial agriculture (market-revolution.mcq.01).
- **Comparison/complication** — Jefferson's frugal-government creed set against the Louisiana Purchase, which he authorized without explicit constitutional basis (jefferson-era.mcq.02); the Northeast/South contrast showing the Market Revolution's uneven reach (market-revolution.mcq.02).
- **Continuity/change** — the Declaration of Sentiments' deliberate reuse of the Declaration of Independence's "created equal" language and grievance-list structure for women's rights (reform-awakening.mcq.01, .mcq.02).

## Real-misconception distractors

Several distractors invert a genuine AP US History fact rather than being
generic wrong answers, so a partially-prepared student is actually tempted:
jefferson-era.mcq.02 offers the Alien and Sedition Acts (Adams, not Jefferson)
and the Second Bank's 1816 charter (Madison, not Jefferson) as decoys for "an
action Jefferson took as president"; jacksonian-democracy.mcq.01 offers
"already ruled unconstitutional in McCulloch v. Maryland" as a decoy, when
that 1819 ruling actually upheld the Bank's constitutionality.

## Difficulty & answer-key hygiene

- Difficulty 1-4 spread: 1×1, 2×5, 3×3, 4×1 (same shape as `u3.json`).
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=2, B=3, C=2, D=3. Sequence: `BDACDBACBD` — not all-one-letter, and not a
  repeating 4-letter cyclic rotation (items 1-4 `BDAC` vs. items 5-8 `DBAC`
  differ, so it is not a simple period-4 repeat).
- Choice lengths checked by word count: the correct answer is the
  longest-worded choice (a tie at the longest length) in only **1 of 10**
  items (`apush.jacksonian-democracy.mcq.02`), well within the 0-2/10
  target — not a test-wiseness exploit.
- All stems and choices are ORIGINAL — written for this bank. Stimulus items
  quote only short verbatim phrases from the seeded Period-4 passages
  (verified as contiguous substrings of each passage's `fullText`, allowing
  only real mid-sentence elisions already present in the seeded excerpt, the
  same "..." convention used in `u3.json`'s Federalist No. 10 item).
  `license: 'internal-original'` per `scripts/seed-problem-bank.ts`.

## Verification (u4.json)

`npx tsc --noEmit`: 0 errors. `npm run lint:passages`: clean (35 passages
resolve across all periods, including all 5 referenced by this bank).
`npm run seed:problem-bank -- --course=ap-us-history --file=u4.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
