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

## Unit 9: The Reagan Era to the Present (Period 9, ~1980–present)

Stimulus-based MCQ bank (`u9.json`) keyed to the five new Period-9 primary
source documents seeded in `src/lib/tutor/passages/seeds/apush-{reagan-inaugural,
reagan-brandenburg,bush-sept-2001,obama-inaugural,immigration-origins-table}.ts`,
and to the three Period-9 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apush-u9-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u9.json |
|---|---|---|---|
| `apush.conservative-resurgence` | `AP-APUSH-9.2` | The conservative resurgence — Reagan's anti-government diagnosis of the stagflation era and the Cold War endgame (glasnost/perestroika, Brandenburg Gate challenge). | 3 |
| `apush.america-since-2001` | `AP-APUSH-9.6` | America since 2001 — the September 11 attacks and their historical framing; the 2008 financial crisis. | 2 |
| `apush.globalization-tech` | `AP-APUSH-9.4` | Globalization and technology — post-1965 immigration demographics (data-table analysis) and NAFTA-era trade liberalization. | 3 |
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
Seven of the eight items anchor to a Period-9 passage seed via `passageId`
(for grouping/render); the remaining one (`globalization-tech.mcq.03`, NAFTA)
is a non-stimulus item per the period spec, covering the LO with original
factual content not tied to a specific seeded document:

- `evelyn.passage.apush-reagan-inaugural.v1` — Reagan, First Inaugural Address (1981, "government is not the solution...government is the problem") — 2 items
- `evelyn.passage.apush-reagan-brandenburg.v1` — Reagan, Remarks at the Brandenburg Gate ("tear down this wall," 1987) — 1 item
- `evelyn.passage.apush-bush-sept-2001.v1` — G.W. Bush, Address to Congress on September 11 (September 20, 2001) — 1 item
- `evelyn.passage.apush-obama-inaugural.v1` — Obama, First Inaugural Address (2009, crisis-and-renewal framing) — 1 item
- `evelyn.passage.apush-immigration-origins-table.v1` — DHS Yearbook of Immigration Statistics data table (lawful-permanent-resident admissions by region of origin, 1960s vs. 2000s) — 2 items

## Historical-reasoning skills tested

Same authentic AP US History source-analysis skills as the Unit-3 and Unit-8
banks, applied to Period-9 (1980–present) material:

- **Sourcing / point of view** — Reagan's anti-government diagnosis read against the stagflation-era crisis it responds to (conservative-resurgence.mcq.01); Reagan's "government by an elite group" framing read as a rejection of technocratic/administrative governance rather than a specific institution (conservative-resurgence.mcq.02).
- **Contextualization** — "reform and openness" in Moscow situated as Gorbachev's own glasnost/perestroika program, not a Western initiative (conservative-resurgence.mcq.03); Bush's "one Sunday in 1941" comparison situated as historical framing of September 11's unprecedented nature, not a literal 1941 reenactment (america-since-2001.mcq.01); Obama's crisis language dated precisely to the January 2009 address to identify the 2008 financial crisis (america-since-2001.mcq.02).
- **Causation** — the Immigration and Nationality Act of 1965 identified as the specific legal cause of the shift documented in the DHS lawful-permanent-resident table (globalization-tech.mcq.01); NAFTA's simultaneous regional job losses and export gains used as evidence for unevenly distributed trade-liberalization effects, not a uniform national effect (globalization-tech.mcq.03).
- **Quantitative/data-table scoping** — reasoning about what a table scoped to lawful-permanent-resident admissions specifically can and cannot tell you (temporary visas and refugees fall outside its scope) (globalization-tech.mcq.02) — the same document-fidelity discipline as the AP Gov federal-grants-table item.

## Historical accuracy / sensitivity notes

- The September 11 item (`america-since-2001.mcq.01`) quotes only the first,
  measured, non-graphic segment of the seeded Bush excerpt (the "act of war...
  freedom itself is under attack" framing) and does not draw on either of the
  excerpt's other two non-adjacent segments (the message to Muslims
  worldwide), consistent with the plan's non-partisan, factual, non-graphic
  treatment of this material.
- The immigration-table items state their scoping explicitly in the stem
  ("LAWFUL PERMANENT RESIDENT status," i.e., green-card admissions) per the
  passage's own docblock — no claim is generalized beyond that scope to
  temporary visas, refugees/asylees, or unauthorized immigration.
- All items test historical facts (what a document says, what a table shows,
  what caused a documented shift) rather than political judgments; distractors
  are factually wrong (a different law, a different crisis, a different Cold
  War term), never framed as ideologically "wrong."

## Difficulty & answer-key hygiene

- Difficulty 1-4 mixed: 1×1, 2×3, 3×3, 4×1.
- Correct-answer letters distributed non-cyclically across all 8 items:
  A=2, B=2, C=2, D=2. Sequence: `CABDCADB` — not all-A, not a repeating
  ABCD pattern.
- Choice lengths checked with the same word-count script as Units 3 and 8:
  in a first draft, 5 of 8 items had the correct answer tied-or-strictly
  longest; distractors were lengthened (kept plausible in content, e.g. the
  Supreme Court judicial-review distractor in conservative-resurgence.mcq.02,
  the savings-and-loan distractor in america-since-2001.mcq.02) and correct
  answers trimmed where needed. Final result: the correct answer is the
  longest option in **0 of 8** items.
  Verify: `npx tsx -e "const a=require('./src/data/problem-bank/ap-us-history/u9.json'); for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); console.log(i.id, w[ci]===Math.max(...w));}"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short phrases from the seeded public-domain Period-9 documents (never
  transcribed wholesale from a real AP exam). `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-us-history --file=u9.json --dry-run`:
8/8 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (39 passages resolve, including all 5 referenced
by this bank).
