# AP World History — Problem Bank Authoring Notes

## Unit 2: Networks of Exchange, c. 1200–1450 (CED Unit 2)

Stimulus-based MCQ bank (`u2.json`) keyed to the seven Unit-2 primary/visual
source documents seeded in `src/lib/tutor/passages/seeds/apworld-*.ts` and to
the five Unit-2 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u2-*.ts`). `cedCode` mirrors each
LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u2.json |
|---|---|---|---|
| `apworld.mongol-empire` | `AP-APWORLD-2.1` | The Mongol Empire — conquest, administration, the yam relay, Pax Mongolica. | 2 |
| `apworld.silk-roads` | `AP-APWORLD-2.2` | The Silk Roads — overland Afro-Eurasian trade revival, 1200–1450. | 2 |
| `apworld.indian-ocean-trade` | `AP-APWORLD-2.3` | The Indian Ocean Trade Network — monsoon-driven maritime commerce, Swahili coast. | 2 |
| `apworld.trans-saharan-trade` | `AP-APWORLD-2.4` | The Trans-Saharan Trade Network — camel caravans, gold-salt trade, Mali/Mansa Musa. | 2 |
| `apworld.cultural-diffusion` | `AP-APWORLD-2.6` | Cultural, technological, and biological diffusion along trade routes. | 2 |
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

Each item anchors to one of the seven Unit-2 passage seeds via `passageId`
(for grouping/render):

- `evelyn.passage.apworld-marco-polo-kinsay.v1` — Marco Polo, on the city of Kinsay/Hangzhou — 2 items
- `evelyn.passage.apworld-marco-polo-yam.v1` — Marco Polo, on the Great Khan's yam post-houses — 2 items
- `evelyn.passage.apworld-marco-polo-paper-money.v1` — Marco Polo, on Yuan paper money — 1 item
- `evelyn.passage.apworld-ibn-battuta-kilwa.v1` — Ibn Battuta, on Kilwa/Kulwa (Swahili coast) — 2 items
- `evelyn.passage.apworld-mansa-musa.v1` — al-Umari, on Mansa Musa in Cairo — 1 item
- `evelyn.passage.apworld-black-death.v1` — Boccaccio, on the plague reaching Florence — 1 item
- `evelyn.passage.apworld-catalan-atlas.v1` — the Catalan Atlas (visual document, Mansa Musa panel) — 1 item

## Authoring rule: self-contained stems (controller override)

Same rule as the AP US History / AP English Language banks:
`scripts/seed-problem-bank.ts`'s verify-at-ingest gate solves each item from
`problemText` alone — it does **not** load the referenced passage. So every
stem inlines the specific short quoted document line (a verbatim substring of
the seeded `fullText`, confirmed programmatically — see Verification below)
before asking the historical-reasoning question. Quoted spans are kept short
(a phrase or single sentence) both for content-filter safety and because AP
World MCQ stimuli are always excerpts, never full documents. Note: quotes are
closed with a straight `"` immediately after the verbatim span (no added
period/comma inside the quotation marks) so the quoted text matches the seed
exactly — sentence-final punctuation, where needed, sits outside the closing
quote mark. `passageId` is still set on every item — it drives stimulus-set
grouping and full-document rendering during a session; it is not required to
*answer* the MCQ.

## Historical-reasoning skills tested

Unlike a plain reading-comprehension bank, these items test authentic AP
World History source-analysis skills against the Unit-2 documents:

- **Sourcing / point of view** — Marco Polo's Venetian-merchant awareness of an unfamiliar European audience (silk-roads.mcq.02); the Catalan Atlas as a European cartographer's depiction of Mali's gold wealth for the king of Aragon (trans-saharan-trade.mcq.02).
- **Contextualization** — Kinsay's market scale as evidence of a thriving Silk Roads/Indian Ocean node (silk-roads.mcq.01); Kilwa's built environment as evidence of Indian Ocean network wealth (indian-ocean-trade.mcq.01); Yuan paper money reported to Europe as an instance of technological diffusion along trade networks (cultural-diffusion.mcq.01).
- **Causation** — Mansa Musa's Cairo gold-giving causing a local gold-price crash (trans-saharan-trade.mcq.01); the yam relay system enabling Pax Mongolica-era communication and safety (mongol-empire.mcq.01); trade-network connectivity causing the Black Death's westward spread (cultural-diffusion.mcq.02).
- **Comparison / historical situation** — Kilwa's frequent military expeditions explained by its position bordering non-Muslim inland peoples while defending trade wealth (indian-ocean-trade.mcq.02).
- **Continuity/change** — yam-station comfort read against Mongol conquest's violence, illustrating the paradox of a conquering-yet-administratively-pragmatic empire (mongol-empire.mcq.02).

## Difficulty & answer-key hygiene

- Difficulty 1–4 mixed: 1×1, 2×5, 3×3, 4×1 (mirrors the APUSH u3.json spread).
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=3, B=2, C=3, D=2. Sequence: `BACDBADCAC` — not all one letter, not a
  repeating ABCD pattern (the known "everything keys to A" trap).
- Choice lengths equalized per item (word-count checked, correct answer NOT
  the systematically longest option — the APUSH length-tell trap): initial
  draft had the correct choice as the unique longest option in 6 of 10 items;
  revised distractor/correct-choice lengths so the correct answer is the
  **unique longest in 0 of 10 items** after revision. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u2.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL — written for this bank, quoting only
  short verbatim phrases from public-domain Unit-2 documents (never
  transcribed wholesale from a real AP exam). `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u2.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (17 passages, including all 7 referenced by
this bank). A standalone script confirmed every quoted span inside
`problemText` is a verbatim substring of its passage's seeded `fullText`
(0 mismatches).

## Unit 8: 1945–Present (Cold War & Decolonization, CED Unit 8)

Stimulus-based MCQ bank (`u8.json`) keyed to five Unit-8 documents —
one REUSE from the APUSH bank (`evelyn.passage.apush-truman-doctrine.v1`,
cross-course document reuse) plus four new AP World seeds — and to the four
Unit-8 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u8-*.ts`). `cedCode` mirrors
each LO's `standard` field exactly.

| loId | cedCode | Topic | # items in u8.json |
|---|---|---|---|
| `apworld.cold-war-global` | `AP-APWORLD-8.1` | The Cold War as a global conflict — containment, the Cuban Missile Crisis, nuclear-age crisis management. | 3 |
| `apworld.decolonization` | `AP-APWORLD-8.5` | Decolonization and the postwar international order — the UDHR's universalist claims, UN membership growth. | 4 |
| `apworld.end-cold-war` | `AP-APWORLD-8.9` | The end of the Cold War — the Berlin Wall's rise and fall, the internal causes of Soviet collapse. | 2 |
| `apworld.new-states` | `AP-APWORLD-8.7` | New states' development paths — the Non-Aligned Movement as a "third path." | 1 |
| **Total** | | | **10** |

## Anchoring documents (stimulus sets)

Six of ten items anchor to a Unit-8 passage seed via `passageId`; the
remaining two (`apworld.end-cold-war.mcq.02`, `apworld.new-states.mcq.01`)
are non-stimulus items testing content-plan material directly, per the
unit's planned MCQ composition, and omit `passageId`:

- `evelyn.passage.apush-truman-doctrine.v1` — Truman, on the containment commitment (cross-course REUSE from the APUSH bank) — 1 item
- `evelyn.passage.apworld-jfk-cuba.v1` — Kennedy, the October 1962 Cuban Missile Crisis quarantine address — 2 items (one quote per non-adjacent excerpted span, never spanning the elision)
- `evelyn.passage.apworld-udhr.v1` — the Universal Declaration of Human Rights, Preamble/Articles 1-2 class excerpt — 2 items
- `evelyn.passage.apworld-un-membership-table.v1` — described data table, UN membership growth 1945-2000 — 2 items (one keyed to the unambiguous 1960 single-year +17 jump, never an ambiguous "largest decade" framing; one to the overall 51-to-189 long-run trend)
- `evelyn.passage.apworld-berlin-wall-visual.v1` — described photograph set, the Berlin Wall 1961-1989 — 1 item

## Authoring rule: self-contained stems (controller override)

Same rule as Unit 2 and the AP US History / AP English Language banks: the
verify-at-ingest gate solves each item from `problemText` alone, so every
stimulus item inlines the specific quoted line, or (for the described data
table / visual) the specific real figures or facts, needed to answer —
without requiring the referenced passage to be loaded. `passageId` is still
set on every stimulus item for stimulus-set grouping/full-document
rendering; the two non-stimulus items omit it entirely, per plan.

## Compliance notes specific to Unit 8

- **JFK non-adjacent spans:** the Cuban Missile Crisis passage's seeded
  `fullText` elides two gaps (marked `. . .`) between three quoted
  paragraphs. Each of the two JFK items quotes verbatim from exactly one
  paragraph — never a span crossing an elision.
- **UN-table anchor discipline:** `decolonization.mcq.03` keys to the
  1960 single-year jump (82 -> 99, +17 members, 16 of 17 newly independent
  African states) — the unit's specified unambiguous anchor. No item keys
  an ambiguous "largest decade" framing.
- **UDHR excerpt class:** both UDHR items quote only from the Preamble/
  Articles 1-2 class excerpt actually seeded (Article 1's universal-equality
  clause; Article 2's non-distinction-by-territorial-status clause) — no
  quotation from any article outside the seeded excerpt.
- **Zero-quote copyright rule:** `new-states.mcq.01` names the 1955 Bandung
  Conference and tests the Non-Aligned Movement, but quotes no text from
  Nehru, Nkrumah, Gandhi, Nasser, or any Bandung-associated figure — the
  item is entirely original prose.
- **Real-misconception distractors:** `end-cold-war.mcq.02` directly tests
  the unit's flagged misconception ("the West simply won") by making the
  single-cause "NATO military defeat" option a distractor and keying the
  internal-causes (Gorbachev reforms, Afghanistan, Eastern European reform
  movements) option as correct. `new-states.mcq.01` similarly distractors
  the "everyone picked a superpower" misconception against the correct
  non-alignment answer.

## Difficulty & answer-key hygiene

- Difficulty 1-4 spread: 1x2, 2x5, 3x2, 4x1.
- Correct-answer letters distributed non-cyclically across all 10 items:
  A=3, B=2, C=2, D=3. Sequence: `BACDBADCAD` — not all one letter, not a
  repeating ABCD pattern.
- Choice lengths checked (word-count), correct answer NOT the systematically
  longest option: correct is the unique longest choice in **1 of 10** items
  (`new-states.mcq.01`), within the 0-2/file allowance. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u8.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL, quoting only short verbatim phrases
  (or, for the two described-document stimuli, real stated figures/facts)
  from the public-domain Unit-8 documents. `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u8.json --dry-run`:
10/10 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
`npm run lint:passages` clean (71 passages, including all 5 referenced by
this bank). A standalone script confirmed every quoted span inside
`problemText` is a verbatim substring of its passage's seeded `fullText`
(0 mismatches), and every stated UN-membership figure is a verbatim/accurate
match against the described table's seeded `fullText`.

## Unit 9: 1900–Present (Globalization, CED Unit 9)

Stimulus-based MCQ bank (`u9.json`) keyed to five Unit-9 documents — three
new described data-table seeds plus two REUSEs (`evelyn.passage.apworld-udhr.v1`
from Unit 8, `evelyn.passage.apush-bush-sept-2001.v1` cross-course from the
APUSH catalog) — and to the four Unit-9 content lesson-plan LOs
(`src/lib/tutor/lesson-plan/seeds/ap-apworld-u9-*.ts`). `cedCode` mirrors
each LO's `standard` field exactly. Composition follows the unit's planned
MCQ spec exactly: life-expectancy 2, ict 1, trade-table 1, udhr 1, bush 1,
non-stimulus global-economy + technology 2.

| loId | cedCode | Topic | # items in u9.json |
|---|---|---|---|
| `apworld.global-economy` | `AP-APWORLD-9.1` | The globalizing economy — Bretton Woods, GATT/WTO, multinational supply chains, China's reform era, the Asian Tigers, financial crises. | 2 |
| `apworld.technology-communication` | `AP-APWORLD-9.4` | Technology, communication, and health — the Green Revolution, medical advances, jet travel, internet/mobile leapfrogging. | 2 |
| `apworld.environment-disease` | `AP-APWORLD-9.6` | Population, disease, and the environment — the demographic transition, twentieth-century epidemics, climate change, global life expectancy. | 2 |
| `apworld.culture-rights-migration` | `AP-APWORLD-9.8` | Global culture, human rights, and migration — the UDHR, multidirectional cultural flows, the post-9/11 security-vs-rights debate. | 2 |
| **Total** | | | **8** |

## Anchoring documents (stimulus sets)

Six of eight items anchor to a Unit-9 passage seed via `passageId`; the
remaining two (`apworld.global-economy.mcq.02`, `apworld.technology-communication.mcq.02`)
are non-stimulus items testing content-plan material directly, per the
unit's planned MCQ composition, and omit `passageId`:

- `evelyn.passage.apworld-life-expectancy-table.v1` — described data table, world/regional life expectancy 1950 vs. 2019 (UN WPP) — 2 items (one keyed to the unambiguous "largest gain" anchor — Asia +32 years — never an ambiguous framing; one to the starting-point-vs.-gain reasoning behind Africa remaining furthest behind despite a real 25-year gain)
- `evelyn.passage.apworld-ict-table.v1` — described data table, global mobile subscriptions and Internet use 1990–2020 (ITU) — 1 item (leapfrogging inference from the mobile-vs.-internet growth gap; internet figures used ONLY from 2005 onward, per the seed's own documented data-gap before that year — never implying an earlier global internet-use figure)
- `evelyn.passage.apworld-trade-container-table.v1` — described data table, world container throughput vs. merchandise export value 1980–2020 (UNCTAD/WTO) — 1 item (physical-volume vs. nominal-dollar reliability, with the post-2010 flattening scoping note)
- `evelyn.passage.apworld-udhr.v1` — the Universal Declaration of Human Rights, Preamble/Articles 1–2 class excerpt (REUSE from Unit 8) — 1 item (a new anchor from this bank's Unit-8 items: the Preamble's "barbarous acts" clause read as historical context for the Declaration, contextualization skill)
- `evelyn.passage.apush-bush-sept-2001.v1` — Bush's September 20, 2001 address to Congress (cross-course REUSE from the APUSH catalog) — 1 item (quotes only the first paragraph's closing sentence, entirely within one contiguous segment, never crossing the seed's internal elision)

## Authoring rule: self-contained stems (controller override)

Same rule as Units 2 and 8 and the AP US History / AP English Language
banks: the verify-at-ingest gate solves each item from `problemText` alone,
so every stimulus item inlines the specific quoted line, or (for the three
described data tables) the specific real figures needed to answer, without
requiring the referenced passage to be loaded. `passageId` is still set on
every stimulus item for stimulus-set grouping/full-document rendering; the
two non-stimulus items omit it entirely, per plan.

## Compliance notes specific to Unit 9

- **Life-expectancy anchor discipline:** both items key to the unit's
  specified unambiguous anchors — Asia's +32-year gain as the largest of
  the three regions shown (`environment-disease.mcq.01`), and the
  starting-point-vs.-gain reasoning explaining why Africa's smaller
  absolute gain (a real +25 years) still leaves it behind Europe's smaller
  +17-year gain (`environment-disease.mcq.02`). No item claims a figure
  outside the seeded 46→73 (world), 37→62 (Africa), 42→74 (Asia), 62→79
  (Europe) set.
- **ICT internet-data-gap discipline:** `technology-communication.mcq.01`
  states internet-use figures ONLY from 2005 onward (15.6%/28.4%/39.9%/
  60.1%), matching the seed's documented absence of a reliable global
  aggregate before 2005 — the item never implies a 1990 or 2000
  internet-use figure exists. Mobile-subscription figures (11M/738M/5.29B/
  8.26B for 1990/2000/2010/2020) are stated separately and correctly.
- **Trade-table scoping:** `global-economy.mcq.01` states both the physical
  (36M→792M TEU, ~22×) and nominal-dollar ($1.97T→$17.73T, ~9×) series and
  scopes the dollar figure honestly as "current (not inflation-adjusted)
  US dollars," per the seed's documented distinction.
- **UDHR excerpt class:** `culture-rights-migration.mcq.01` quotes only from
  the Preamble/Articles 1–2 class excerpt actually seeded (the "barbarous
  acts" Preamble clause and Article 1's universal-equality clause) — no
  quotation from any article outside the seeded excerpt.
- **Bush single-segment discipline:** `culture-rights-migration.mcq.02`
  quotes only "night fell on a different world, a world where freedom
  itself is under attack" — the final sentence of the seed's first
  paragraph, entirely before the seed's paragraph-break elision. No item
  bridges this paragraph with the second (the Muslims/Islam paragraph) or
  crosses the "..." elision inside the second paragraph.
- **Zero-quote copyright rule:** `global-economy.mcq.02` (Deng Xiaoping's
  reform era, described via China's reform outcomes) and
  `technology-communication.mcq.02` (Norman Borlaug's Green Revolution,
  described via its documented effects) name no post-1928 figure's quoted
  words — both items are entirely original prose built from documented
  facts.
- **Real-misconception distractors:** `global-economy.mcq.02` directly
  tests the unit's flagged misconception ("globalization is only
  Westernization") by making the one-directional-Western-flow option the
  targeted-false claim and keying the multidirectional-supply-chain
  evidence as the correct answer choice. `technology-communication.mcq.02`
  similarly targets "technology diffuses evenly" as the false claim
  undermined by the Green Revolution's uneven reach and smallpox
  eradication's decades-long campaign.
- **Non-partisan tone:** the 9/11 item (`culture-rights-migration.mcq.02`)
  is framed entirely around the historical security-vs-rights tension
  Bush's own address opened, with no judgment offered on the merits of any
  security policy; the UDHR item is framed as historical contextualization,
  not a present-day rights argument.

## Difficulty & answer-key hygiene

- Difficulty 1–4 spread: 1×1, 2×3, 3×3, 4×1.
- Correct-answer letters distributed non-cyclically across all 8 items:
  A=2, B=2, C=2, D=2. Sequence: `BDACDBCA` — not all one letter, not a
  repeating ABCD pattern, and not a repeating 4-item block (`BDAC` vs.
  `DBCA` differ in order).
- Choice lengths checked (word-count), correct answer NOT the systematically
  longest option: correct is the unique longest choice in **2 of 8** items
  (`global-economy.mcq.01`, `culture-rights-migration.mcq.02`), within the
  0–2/file allowance. Verify:
  `npx tsx -e "const a=require('./src/data/problem-bank/ap-world-history/u9.json'); let n=0; for(const i of a){const w=i.choices.map(c=>c.split(/\\s+/).length); const ci='ABCD'.indexOf(i.answer); if(w[ci]===Math.max(...w)&&w.filter(x=>x===Math.max(...w)).length===1)n++;} console.log('correctIsUniqueLongest', n+'/'+a.length);"`.
- All stems and choices are ORIGINAL, quoting only short verbatim phrases
  (or, for the three described-data-table stimuli, real stated figures)
  from the public-domain Unit-9 documents. `license: 'internal-original'`
  per `scripts/seed-problem-bank.ts`.

## Verification

`npm run seed:problem-bank -- --course=ap-world-history --file=u9.json --dry-run`:
8/8 passed Sonnet (`claude-sonnet-5`) independent-solve verify, 0 rejected.
(One non-blocking `WARN problemText has $<digit> (currency/KaTeX trap)` on
`global-economy.mcq.01`, from the real `$1.97 trillion`/`$17.73 trillion`
export-value figures — expected and harmless per the script's own comment,
"warn, don't fail.")
`npm run lint:passages` clean (74 passages, including all 5 referenced by
this bank). A standalone script confirmed every quoted span inside
`problemText` (the two UDHR quotes, the one Bush quote) is a verbatim
substring of its passage's seeded `fullText` (0 mismatches), and every
stated life-expectancy/ICT/trade figure is a verbatim/accurate match
against its described table's seeded `fullText`.
