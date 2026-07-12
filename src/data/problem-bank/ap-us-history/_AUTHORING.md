# AP US History — Problem Bank Authoring Notes

## Unit 1: Contact and Conquest, the Americas (Period 1, ~1491–1607)

Stimulus-based MCQ bank (`u1.json`) keyed to the five Period-1 primary/visual
source documents seeded in `src/lib/tutor/passages/seeds/apush-{columbus-letter,
las-casas,cortes-tenochtitlan,codex-mendoza,hakluyt-western-planting}.ts`, and
to the three Period-1 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apush-u1-{native-societies,
columbian-exchange,spanish-colonization}.ts`). `cedCode` mirrors each LO's
`standard` field exactly.

| loId | cedCode | Topic | # items in u1.json |
|---|---|---|---|
| `apush.native-societies` | `AP-APUSH-1.2` | Native American societies before European contact (diversity, adaptation to environment; no "empty wilderness"/uniform-culture). | 2 |
| `apush.columbian-exchange` | `AP-APUSH-1.4` | The Columbian Exchange (bidirectional crop/animal/disease transfer; Columbus's letter as Europe's first widely circulated framing of the encounter). | 2 |
| `apush.spanish-colonization` | `AP-APUSH-1.6` | Spanish colonial labor systems (encomienda, repartimiento), the casta hierarchy, and internal Spanish debate (Valladolid) over Native treatment. | 4 |
| **Total** | | | **8** |

## Anchoring documents (stimulus sets)

Each stimulus item anchors to one of the five Period-1 passage seeds via
`passageId` (for grouping/render); the eighth item is intentionally
non-stimulus (tests `native-societies` directly, no document referenced in
the stem):

- `evelyn.passage.apush-columbus-letter.v1` — Columbus, letter to Luis de Santángel (1493) — 2 items
- `evelyn.passage.apush-las-casas.v1` — Las Casas, *A Brief Account of the Destruction of the Indies* (1542) — 2 items
- `evelyn.passage.apush-cortes-tenochtitlan.v1` — Cortés, Second Letter to Charles V, on Tenochtitlan (1520) — 1 item
- `evelyn.passage.apush-codex-mendoza.v1` — Codex Mendoza, tribute section (c. 1541, described visual) — 1 item
- `evelyn.passage.apush-hakluyt-western-planting.v1` — Hakluyt, *A Discourse Concerning Western Planting* (1584) — 1 item
- (no passage) — non-stimulus item testing `native-societies` via Cahokia + Pacific Northwest facts already in the content plan — 1 item

## Document-fidelity notes specific to this bank

- The Columbus item stems quote only the seed's own phrasing — "guileless,
  and so liberal of all they have that no one would believe it" (NOT
  "artless and generous," which is not in the seeded excerpt).
- The Hakluyt item tests ONLY the seeded employment-of-idle-men motive
  (Spain/Portugal's discoveries absorbed their "idle" population; England
  still suffers "multitudes of loyterers and idle vagabondes" despite harsh
  statutes) — Hakluyt's other historically real motives (commodities,
  countering Spain, spreading religion) are NOT in this excerpt and are not
  tested here, matching the fidelity note already established in
  `ap-apush-u1-dbq-practice.ts`.
- The Codex Mendoza item uses only facts already in the seed's own
  description (commissioned c. 1541 by Viceroy Antonio de Mendoza; tribute
  categories — cotton mantles, quilted cotton warrior costumes, maize); no
  new claims about the manuscript are introduced.
- The Cortés and Codex Mendoza items are not wired as a `concept.passageId`
  in any Period-1 content plan (only Columbus → `columbian-exchange` and
  Las Casas → `spanish-colonization` are); they are assigned to LOs by
  subject matter: Cortés's description of Tenochtitlan's pre-conquest scale
  tests `native-societies` (evidence of complex, populous Mesoamerican
  urban civilization, read critically against its author's own role as
  conqueror); the Codex Mendoza's Spanish-commissioned tribute record tests
  `spanish-colonization` (colonial administration extracting resources via
  adapted, pre-existing indigenous tribute structures).

## Historical-reasoning skills tested

- **Sourcing / point of view** — reading Columbus's letter as promotional
  framing for further colonization, not a neutral travel account
  (columbian-exchange.mcq.01, .02); using Cortés's own account, despite his
  role as conqueror, as evidence of Tenochtitlan's scale
  (native-societies.mcq.01).
- **Contextualization / causation** — the encomienda's mechanics as
  described by Las Casas (spanish-colonization.mcq.01); Spain's own internal
  moral debate over colonization, culminating at Valladolid, as the correct
  reading of Las Casas's rhetoric — not proof his advocacy ended forced
  labor (spanish-colonization.mcq.02, the "Las Casas ended the encomienda"
  misconception from the period block).
- **Continuity/change** — Spanish colonial administration adapting existing
  Aztec tribute structures rather than inventing an entirely new system
  (spanish-colonization.mcq.03).
- **Comparison** — Hakluyt's English employment-of-idle-men motive against
  Spain's extractive encomienda model, directly testing the "all Europeans
  colonized the same way" misconception from the period block
  (spanish-colonization.mcq.04).
- **Complexity / periodization** — Cahokia's intensive agriculture versus
  Pacific Northwest societies with no agriculture at all, both refuting the
  "empty wilderness, one uniform culture" misconception
  (native-societies.mcq.02).

## Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1×2, 2×2, 3×3, 4×1 (spread: `2,3,2,4,1,3,3,1`).
- Correct-answer letters distributed non-cyclically across all 8 items:
  A=2, B=2, C=2, D=2. Sequence: `ACDBDABC` — not all-A, not a repeating
  ABCD pattern.
- Choice lengths checked by word count: in a first draft the correct
  answer was the longest option in 4 of 8 items; a revision shortened the
  correct choices in items 1, 3, 4, and 7 (and lengthened one distractor in
  item 3) so the correct answer is now the longest in **0 of 8** items.
  Verify: `npx tsx -e "const a=require('./src/data/problem-bank/ap-us-history/u1.json'); for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); console.log(i.id, w[ci]===Math.max(...w));}"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short phrases from public-domain Period-1 documents (never transcribed
  wholesale from a real AP exam). `license: 'internal-original'` per
  `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-us-history --file=u1.json --dry-run`:
8/8 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected,
on the first draft (after the choice-length revision above). `npm run
lint:passages` clean (35 passages resolve, including all 5 referenced by
this bank).

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

## Unit 2: British North American Colonies (Period 2, ~1607–1754)

Stimulus-based MCQ bank (`u2.json`) keyed to the five Period-2 primary source
documents seeded in `src/lib/tutor/passages/seeds/apush-{winthrop-charity,
mayflower-compact,bacon-declaration,equiano,edwards-sinners}.ts`, and to the
four Period-2 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apush-u2-{colonial-regions,
transatlantic-economy,slavery-colonies,colonial-society}.ts`). `cedCode`
mirrors each LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u2.json |
|---|---|---|---|
| `apush.colonial-regions` | `AP-APUSH-2.2` | New England covenant-community model vs. Chesapeake profit motive; Mayflower Compact self-government; Bacon's Rebellion and the labor-system vulnerability it exposed. | 4 |
| `apush.transatlantic-economy` | `AP-APUSH-2.4` | Mercantilism, the Navigation Acts, and the loose-enforcement origin of salutary neglect. | 1 |
| `apush.slavery-colonies` | `AP-APUSH-2.6` | The Middle Passage's dehumanizing conditions, documented through Equiano's firsthand testimony. | 2 |
| `apush.colonial-society` | `AP-APUSH-2.7` | The First Great Awakening's mass, emotional preaching style, contrasted with the Enlightenment. | 1 |
| **Total** | | | **8** |

## Anchoring documents (stimulus sets)

Each stimulus item anchors to one of the five Period-2 passage seeds via
`passageId` (for grouping/render); the eighth item (the Navigation Acts /
salutary-neglect item) is intentionally non-stimulus, per the Period-2 block's
composition (`winthrop 2, mayflower 1, bacon 1, equiano 2, edwards 1,
non-stimulus transatlantic-economy 1`):

- `evelyn.passage.apush-winthrop-charity.v1` — Winthrop, *A Model of Christian Charity* (1630) — 2 items
- `evelyn.passage.apush-mayflower-compact.v1` — The Mayflower Compact (1620) — 1 item
- `evelyn.passage.apush-bacon-declaration.v1` — Bacon, *Declaration of the People* (1676) — 1 item
- `evelyn.passage.apush-equiano.v1` — Equiano, *The Interesting Narrative* (1789) — 2 items
- `evelyn.passage.apush-edwards-sinners.v1` — Edwards, *Sinners in the Hands of an Angry God* (1741) — 1 item
- (no passage) — non-stimulus item testing `transatlantic-economy` via the
  Navigation Acts' loose enforcement, already covered in that content plan —
  1 item

## LO-assignment call: Bacon's Declaration → `colonial-regions`

The period block leaves the Bacon item's LO to author judgment
("bacon→colonial-regions or transatlantic-economy, your call"). Assigned to
`colonial-regions` (`AP-APUSH-2.2`) because that is the content plan that
actually teaches Bacon's Rebellion in depth — it appears as a full key idea
("BACON'S REBELLION (1676) AND THE SHIFT IN LABOR") and a defined vocabulary
term in `ap-apush-u2-colonial-regions.ts`, whereas the
`transatlantic-economy` plan never mentions Bacon at all. This does mean
`colonial-regions` carries 4 of the bank's 8 items (Winthrop x2, Mayflower,
Bacon) while `transatlantic-economy` and `colonial-society` each carry only
the 1 item specified by the period block; every LO still clears the ≥1-item
floor.

## Document-fidelity notes specific to this bank

- The Winthrop items quote only the seed's own Hanover-transcription
  early-modern orthography — "citty upon a hill," "eies," "uppon" — never the
  modernized "city upon a hill" (per the period block's edition-trap note).
- The Equiano items are limited to the seed's own inspection/confinement/fear
  content ("handled and tossed up to see if I were sound," "chained
  together... dejection and sorrow," "overpowered with horror and anguish...
  fainted") in a measured, exam-neutral tone — no graphic content beyond what
  the seed itself contains, consistent with the passage seed's own
  "MEASURED SELECTION FOR RESTRAINT" note.
- The Edwards item quotes "flung the door of mercy wide open" verbatim (not
  "thrown"), matching the seed and the colonial-society content plan's own
  fidelity note.
- The Bacon item quotes only the declaration's opening grievance clauses
  (unjust taxation for "private favorites," Berkeley "protected, favoured,
  and Imboldned the Indians against his Majesties loyall subjects") — no
  claims beyond what the seeded excerpt contains.
- The transatlantic-economy item is non-stimulus by design (per the period
  block) and tests the Navigation Acts' loose enforcement / salutary-neglect
  origin using facts already established in `ap-apush-u2-
  transatlantic-economy.ts`'s concept and misconception-check segments — no
  new claims introduced.

## Historical-reasoning skills tested

- **Sourcing / point of view** — reading Winthrop's covenant framing as a
  founding sermon addressed to settlers who had not yet landed
  (colonial-regions.mcq.01, .02); reading Equiano's 1789 narrative as
  testimony shaped for a British abolition-debate audience
  (slavery-colonies.mcq.01).
- **Contextualization** — the Mayflower Compact's self-government arising
  specifically because the Pilgrims landed outside their chartered territory
  (colonial-regions.mcq.03); the Navigation Acts' loose enforcement as the
  specific origin of salutary neglect (transatlantic-economy.mcq.01).
- **Causation** — Bacon's Rebellion exposing the Chesapeake's structural
  reliance on a growing population of landless former servants, a
  vulnerability that accelerated the shift to enslaved labor
  (colonial-regions.mcq.04, directly testing the period block's labor-system
  fidelity).
- **Complexity / measured reading of testimony** — Equiano's firsthand
  account of dehumanizing inspection and psychological terror as evidence of
  lived experience, not of trade statistics or legal procedure
  (slavery-colonies.mcq.01, .02).
- **Comparison** — Edwards's emotionally urgent Awakening preaching style
  directly contrasted with Enlightenment reason (colonial-society.mcq.01),
  testing the period block's "Enlightenment and Awakening were the same
  impulse" misconception.

## Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1×1, 2×4, 3×2, 4×1 (spread: `2,1,2,4,3,2,3,2`).
- Correct-answer letters distributed non-cyclically across all 8 items:
  A=2, B=2, C=2, D=2. Sequence: `BADCADCB` — not all-A, not a repeating
  ABCD pattern.
- Choice lengths checked by word count: the correct answer is the longest
  (tied-longest) option in only **1 of 8** items (colonial-regions.mcq.02,
  where the correct choice ties the longest distractor at 16 words), within
  the 0–2/8 target. Verify: `npx tsx -e "const a=require('./src/data/
  problem-bank/ap-us-history/u2.json'); for(const i of a){const
  w=i.choices.map(c=>c.split(/\\s+/).length); const
  ci='ABCD'.indexOf(i.answer); console.log(i.id,
  w[ci]===Math.max(...w));}"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short phrases from the public-domain Period-2 documents (never transcribed
  wholesale from a real AP exam). `license: 'internal-original'` per
  `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-us-history --file=u2.json --dry-run`:
8/8 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected,
on the first draft. `npm run lint:passages` clean (40 passages resolve,
including all 5 referenced by this bank).
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

## Unit 5: 1844-1877 (Period 5)

Stimulus-based MCQ bank (`u5.json`) keyed to three new Period-5 passage seeds
(`apush-{osullivan-annexation,sc-secession,emancipation-proclamation}.ts`) plus
two REUSED passages seeded for other courses
(`douglass-fourth-of-july.ts`, `lincoln-gettysburg.ts`), and to the five
Period-5 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apush-u5-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly. Composition follows the Period-5 spec block:
osullivan 1, douglass 2, sc-secession 2, emancipation-proclamation 2,
gettysburg 1, non-stimulus reconstruction 2.

| loId | cedCode | Topic | # items in u5.json |
|---|---|---|---|
| `apush.manifest-destiny` | `AP-APUSH-5.2` | Manifest Destiny — Texas annexation, Oregon, the Mexican-American War, the Wilmot Proviso, the California Gold Rush. | 1 |
| `apush.sectional-crisis` | `AP-APUSH-5.4` | The Sectional Crisis — Compromise of 1850/Fugitive Slave Act, *Uncle Tom's Cabin*, Kansas-Nebraska Act/Bleeding Kansas, *Dred Scott*, Lincoln-Douglas debates, John Brown's raid. | 1 |
| `apush.secession-civil-war` | `AP-APUSH-5.7` | Secession and the Civil War — the 1860 election, secession's stated logic, Union/Confederate advantages, total war, the home front. | 3 |
| `apush.emancipation` | `AP-APUSH-5.9` | Emancipation — the Emancipation Proclamation's scope and limits, Black military service, the Gettysburg Address's reframing of the war's purpose, the 13th Amendment. | 3 |
| `apush.reconstruction` | `AP-APUSH-5.10` | Reconstruction — Presidential vs. Radical/Congressional Reconstruction, the Reconstruction Amendments, Black officeholding, sharecropping, the KKK/Redemption, the Compromise of 1877. | 2 |
| **Total** | | | **10** |

### Controller override on LO assignment (every-LO-≥1 rule)

The Period-5 spec block's MCQ composition line ("osullivan 1, douglass 2,
sc-secession 2, emancipation 2, gettysburg 1, non-stimulus reconstruction 2")
does not by itself guarantee every Period-5 LO gets at least one item: naively
keying both `douglass-fourth-of-july` items under `secession-civil-war` (the
document's thematic neighbor) would leave `apush.sectional-crisis` with zero
items, since no other Period-5 passage anchors to that LO and its content plan
carries no wired passage. Per controller override, ONE of the two Douglass
items is keyed to `loId: apush.sectional-crisis` (`sectional-crisis.mcq.01`,
`cedCode: AP-APUSH-5.4`) — defensible on its own terms, since Douglass
delivered "What to the Slave Is the Fourth of July?" in 1852, two years after
the Fugitive Slave Act (1850) intensified the sectional conflict the
`sectional-crisis` LO covers. The second Douglass item
(`secession-civil-war.mcq.01`) stays keyed to `apush.secession-civil-war`,
testing the document as evidence against the "secession was primarily about
tariffs" misconception, which pairs naturally with the SC Secession
Declaration items testing the same point from the opposite (secessionist)
side. The Gettysburg Address's single item is keyed to `apush.emancipation`
(not a sixth LO) because the Period-5 content plan for `emancipation`
explicitly folds in "Gettysburg reframing (reuse gettysburg passage in
MCQs)" as part of that LO's scope. All five Period-5 LOs
(`manifest-destiny`, `sectional-crisis`, `secession-civil-war`,
`emancipation`, `reconstruction`) have ≥ 1 item in the resulting file.

## Anchoring documents (stimulus sets, u5.json)

Each stimulus item anchors to one of the five Period-5 passages via
`passageId` (for grouping/render); the two `reconstruction` items are
non-stimulus (no passage — per the Period-5 content-plan spec, that plan has
no wired document):

- `evelyn.passage.apush-osullivan-annexation.v1` — O'Sullivan, "Annexation" (1845, the "manifest destiny" coinage) — 1 item
- `evelyn.passage.douglass-fourth-of-july.v1` — Douglass, "What to the Slave Is the Fourth of July?" (1852, REUSED from AP English Language) — 2 items
- `evelyn.passage.apush-sc-secession.v1` — South Carolina, *Declaration of the Immediate Causes of Secession* (1860) — 2 items
- `evelyn.passage.apush-emancipation-proclamation.v1` — Lincoln, the Emancipation Proclamation (1863) — 2 items
- `evelyn.passage.lincoln-gettysburg.v1` — Lincoln, the Gettysburg Address (1863, REUSED from AP English Language) — 1 item

## Historical-reasoning skills tested (u5.json)

- **Sourcing / point of view** — O'Sullivan's providential framing of expansion (manifest-destiny.mcq.01); the SC secession convention naming slavery, in its own words, as the grievance (secession-civil-war.mcq.02).
- **Contextualization** — Douglass's 1852 speech read against the 1850 Fugitive Slave Act (sectional-crisis.mcq.01); the SC declaration's "servile insurrection" language read against Underground Railroad activity and Southern insurrection fears (secession-civil-war.mcq.03).
- **Comparison / complication** — Douglass's abolitionist moral argument set against the SC declaration's own slavery-grievance list as complementary evidence against the "tariffs, not slavery" misconception (secession-civil-war.mcq.01, .mcq.02).
- **Close reading / precision trap** — distinguishing the Emancipation Proclamation's opening recital ("shall be then, thenceforward, and forever free," restating the September 1862 preliminary promise) from its actual operative clause ("I do order and declare... are, and henceforward shall be free") (emancipation.mcq.01); reading the Proclamation's "war measure... upon military necessity" framing as a claim to wartime, not permanent constitutional, authority (emancipation.mcq.02).
- **Continuity / change** — the Gettysburg Address reframing the war's purpose from reunion alone to reunion plus a "new birth of freedom," building on the Proclamation ten months earlier (emancipation.mcq.03); Presidential vs. Radical/Congressional Reconstruction's sharply different readmission requirements (reconstruction.mcq.01).

## Real-misconception distractors

- `emancipation.mcq.01` distractor A ("because it appears first in the document") targets the actual precision trap the Period-5 spec calls out: mistaking the Proclamation's recital of its earlier promise for its operative clause.
- `emancipation.mcq.02` distractor B directly states the "the Proclamation freed all slaves immediately [nationwide, including border states]" misconception named in the Period-5 spec.
- `secession-civil-war.mcq.02` correct answer is itself the "secession was primarily about tariffs" misconception named in the Period-5 spec, framed as the claim the document's own words undercut.
- `reconstruction.mcq.02` distractor A invokes the famous "forty acres and a mule" myth as a genuine federal guarantee, when it was proposed (Special Field Order No. 15) but not delivered as durable policy.

## Difficulty & answer-key hygiene (u5.json)

- Difficulty 1-4 spread: 1×1, 2×4, 3×4, 4×1.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=2, B=3, C=2, D=3. Sequence: `BADCBDACBD` — items 1-4 (`BADC`) vs. items
  5-8 (`BDAC`) differ at positions 2-3, so this is not a repeating 4-letter
  cyclic rotation, and no single letter dominates.
- Choice lengths checked by word count: an initial draft had the correct
  answer as the longest (or tied-longest) choice in 8 of 10 items; a revision
  shortened correct choices and/or lengthened distractors so the correct
  answer is the longest in **0 of 10** items in the committed version.
  Verify: `node -e "const a=require('./src/data/problem-bank/ap-us-history/u5.json'); for(const i of a){const w=i.choices.map(c=>c.trim().split(/\s+/).length); const ci='ABCD'.indexOf(i.answer); console.log(i.id, w[ci]===Math.max(...w));}"`.
- All stems and choices are ORIGINAL — written for this bank. Stimulus items
  quote only verbatim, verified-contiguous-substring phrases from the seeded
  Period-5 passages (including the SC Secession Declaration's uncorrected
  "have assume the right" transcription artifact, reproduced exactly, and the
  Emancipation Proclamation's precise "are, and henceforward shall be free"
  operative clause vs. "shall be then, thenceforward, and forever free"
  recital, per the Period-5 spec's precision-trap note).
  `license: 'internal-original'` per `scripts/seed-problem-bank.ts`.

## Verification (u5.json)

`npx tsc --noEmit`: 0 errors. `npm run lint:passages`: clean (38 passages
resolve across all periods, including all 5 referenced by this bank).
`npm run seed:problem-bank -- --course=ap-us-history --file=u5.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected
on the first attempt.
