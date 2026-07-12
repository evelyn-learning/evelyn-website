# AP World History: Modern — Units 1 & 3–9 Fan-out Design

**Date:** 2026-07-11
**Status:** Approved (decisions derived from the validated APWorld U2 slice + AP Gov U2–5 / APUSH periods fan-out precedents — autonomous overnight run, user pre-authorized)
**Branch / worktree:** `apworld-units-fanout` @ `.claude/worktrees/apworld-fanout` off engine `main` AFTER the APUSH fan-out merge (cross-course passage reuses depend on it)
**Related:** `2026-07-10-ap-world-history-design.md` (validated U2 slice), `2026-07-11-apush-periods-fanout-design.md` (fan-out template + D2/D3 decisions reused)

## Purpose

Complete AP World History: Modern by fanning out **Units 1 and 3–9** on the validated Unit-2 patterns. Content-only: zero engine/academy code changes (`'apworld'` already in `AP_COURSE_SLUGS`; academy block matches `/^ap-apworld-.*\.ts$/`). One branch, one deploy.

## Decisions locked

| # | Decision | Resolution |
|---|---|---|
| D1 | FRQ density | All 3 history formats per unit — 24 FRQ plans (DBQ 7 / LEQ 6 / SAQ 3, U2 rubric shapes verbatim). |
| D2 | DBQ packet size | **5 documents per unit** (same trade as APUSH fan-out D2). |
| D3 | Copyright | Pre-1929 PD translations + US-gov works + UDHR (UN places it in the public domain) as Passages; **modern copyrighted landmarks (Churchill, Gandhi, Nehru, Nkrumah, Mao, Deng, Carson, King) = authored in-plan descriptions, zero quotes, never packets**; visuals & data tables = described text, genre `'political-cartoon'`, REAL published figures (UN/ITU/League/DHS-class sources) with real `sourceUrl`. |
| D4 | Content-plan scale | CED-topic-weighted: U1: 5, U3: 3, U4: 5, U5: 5, U6: 5, U7: 4, U8: 4, U9: 4 (**35 plans**; U3 has only 4 CED topics incl. a comparison topic). |
| D5 | MCQ volume | Exam-weighted: U1: 10, U3: 10, U4: 12, U5: 12, U6: 10, U7: 10, U8: 10, U9: 8 (**82 items**; course total 92 with U2's 10). |
| D6 | Shipping | One branch, one deploy; per-unit task groups, per-task review, whole-branch audit + final review; live gate deferred to the user. |
| D7 | Parallel waves | 4 group worktrees (U1+U3, U4+U5, U6+U7, U8+U9), periods independent, all LO strings pre-specified; merge groups → audit. |
| D8 | Cross-course passage reuse | APWorld packets may reuse APUSH/shared passages by id (single shared registry): `apush-columbus-letter`, `apush-equiano`, `apush-four-freedoms`, `apush-truman-doctrine`, `apush-bush-sept-2001`, `apworld-catalan-atlas`, `apush-cortes-tenochtitlan`. Branch bases off post-APUSH main so they exist. |

## Scope table (5-doc DBQ packet per unit; (R) = reuse, no re-seed)

| Unit | Plans | MCQs | Packet docs |
|---|---|---|---|
| U1 Global Tapestry (1200–1450) | 5 — Song East Asia; Dar al-Islam; South & SE Asia; Americas & Africa; medieval Europe | 10 | Marco Polo on the Khan's court (new); Ibn Battuta on Delhi (new); Magna Carta (new); Cortés on Tenochtitlan (R); Catalan Atlas (R) |
| U3 Land-Based Empires (1450–1750) | 3 — expansion; administration & legitimacy; belief systems & empire | 10 | Busbecq on Suleiman (new); Bernier on Mughal India (new); Peter the Great decrees (new); Taj Mahal described visual (new); Ottoman devshirme description — fold into Busbecq set? NO: 5th = Kangxi Sacred Edict maxims (new, PD trans; if raw text unfetchable → described-visual fallback: Suleymaniye mosque legitimacy description) |
| U4 Transoceanic Interconnections (1450–1750) | 5 — maritime exploration; global Columbian Exchange & silver; maritime empires; Atlantic slave trade; resistance & accommodation | 12 | Tokugawa closed-country edict (new); Potosí silver data table (new, described); Zheng He treasure-fleet described visual (new); Columbus letter (R); Equiano (R) |
| U5 Revolutions (1750–1900) | 5 — Enlightenment; Atlantic revolutions; nationalism; Industrial Revolution; industrial society & critiques | 12 | Declaration of the Rights of Man (new); Bolívar Jamaica Letter (new); Communist Manifesto excerpt (new); Wollstonecraft (new); Sadler Committee testimony (new) |
| U6 Consequences of Industrialization (1750–1900) | 5 — imperial ideologies & expansion; resistance; economic imperialism; global migration; reform responses (Tanzimat/Self-Strengthening/Meiji) | 10 | Kipling "White Man's Burden" (new); Lin Zexu letter to Victoria (new); Berlin Act excerpt (new); indentured-migration data table (new, described); Meiji Charter Oath (new) |
| U7 Global Conflict (1900–present) | 4 — WWI as global war; interwar world (depression, totalitarianism, anti-imperial movements); WWII; atrocities & legacies (measured) | 10 | Wilson Fourteen Points (new); Versailles Art. 231 + colonial clauses (new); WWI colonial-troops propaganda visual (new, described); Depression trade/unemployment data table (new, described); Four Freedoms (R) |
| U8 Cold War & Decolonization (1945–present) | 4 — global Cold War; decolonization; new states' paths; end of the Cold War | 10 | JFK Cuba quarantine address (new, gov); UDHR excerpt (new); UN-membership/decolonization data table (new, described); Berlin Wall described visual (new); Truman Doctrine (R) |
| U9 Globalization (1900–present) | 4 — global economy; technology & communication; environment & disease; culture, rights & migration | 8 | Life-expectancy data table (new, described, UN WPP); ICT-adoption data table (new, described, ITU); container-shipping/trade data table (new, described); UDHR (R from U8); Bush 9/20/2001 (R) |

**Totals:** 35 content plans, 24 FRQ plans, 35 notes, 82 MCQs, ~29 new passages (+6 reuses). Course after ship: 66 plans (40 lesson + 26 FRQ... U2 has 5 content + 3 FRQ; totals 40 lesson + 27 FRQ = 67 — audit computes exact), 40 baselines, 92 bank items.

**Conventions:** identical to U2 slice — IDs `evelyn.ap.apworld.<slug>.v1`; LO `apworld.<slug>`; files `ap-apworld-u<N>-<slug>.ts`; `topic:'ap-world-history'`; notes `course:'AP World History: Modern'` (VERIFY exact string from U2 seeds before authoring); `metadata.cedUnit:'<N>'` STRING in plans / NUMBER in notes; FRQ cedTopics `'<N>-DBQ'` etc.; rubrics DBQ7/LEQ6/SAQ3.

## Process & testing

Identical to the APUSH fan-out: 4 tasks per unit (passages → plans+notes → FRQs → MCQs), sonnet implementers / opus reviewers / fable final review; verbatim-contiguous discipline with programmatic substring verification (raw Gutenberg/Avalon/archive.org/fordham sourcebook fetches); translation fidelity — one named PD translation per document, cited; historical accuracy review per task; measured tone (slave trade, partition, Holocaust/atrocities, 9/11); gates per task (tsc, lint-ap-plans, lint:passages, rubric sums, packet resolution, dry-run MCQ verify course `ap-world-history`); whole-branch audit; ship via the same tunnel-seed + ingest runbook.

## Out of scope

Embedded images; engine/portal code; re-seeding reused passages; the U2 live-gate residuals.

## Risks

- **PD translation availability** for U1/U3 non-Western sources — mitigations: named fallbacks per doc (described-visual conversion is always safe); BLOCKED-not-approximate rule.
- **20th-century copyright (U7–U9)** — packets lean on gov works, treaties, UDHR, described tables/visuals.
- **Sensitive content** (atrocities, partition, slave trade) — measured, factual, exam-neutral; no graphic spans.
- **Cross-course reuse dependency** — branch off post-APUSH-merge main only.
