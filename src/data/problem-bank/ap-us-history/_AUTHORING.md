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
