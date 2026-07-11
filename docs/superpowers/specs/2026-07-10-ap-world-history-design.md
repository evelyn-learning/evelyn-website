# AP World History: Modern — Unit-2 Vertical Slice Design

**Date:** 2026-07-10
**Status:** Approved (brainstorming)
**Branch / worktree:** `apworld-u2-slice` @ `.claude/worktrees/apworld-u2` (off `apush-period3-slice` — reuses the APUSH/Eng Lang history+stimulus infrastructure)
**Related:** [[project_apush_slice]] (the history infra + DBQ/LEQ/SAQ rubrics this reuses WHOLESALE), [[project_ap_eng_lang_slice]] (passage/packet/grader origin), [[project_ap_parity_gaps_build]] (6-component model)

## Purpose

Build AP World History: Modern — **#4 AP exam by US volume** (~412k). It reuses the APUSH history infrastructure with **zero new code**: the same `Passage`/document registry, the same DBQ multi-document packet (`passageIds[]` + `packetLabel:'document'` → grader "Document 1..7"), the same passage-aware grader, and the same three authentic rubric formats (DBQ 7 / LEQ 6 / SAQ 3). The only new work is **global historical content**.

To de-risk (minimally — the machinery is proven) and to mirror the APUSH/Eng Lang pattern, this is a **vertical slice: Unit 2 (Networks of Exchange, 1200–1450) end-to-end**. After validation, the other 8 units fan out (separate initiative).

## Decisions locked (brainstorming)

| # | Decision | Resolution |
|---|---|---|
| D1 | Course | **AP World History: Modern** (chosen; #4 demand; completes the history cluster — reuses APUSH rails). |
| D2 | Build shape | **Vertical slice first** — Unit 2 end-to-end, then fan out the other 8 units. |
| D3 | Slice unit | **Unit 2 — Networks of Exchange (1200–1450)**: Silk Roads, Indian Ocean, trans-Saharan trade, the Mongols. Quintessential world history, heavily tested, rich in public-domain travel accounts, filter-safe, and thematically distinct from the APUSH Revolution slice. |
| D4 | Infra | **Reuse APUSH/Eng Lang infra WHOLESALE — no code changes.** `'document'` genre, `packetLabel:'document'`, `passageIds[]` packet, `resolvePassageText` "Document 1..N", passage-aware grader, DBQ7/LEQ6/SAQ3 `FrqRubric` shapes, lint-passages, topic-notes/problem-bank/academy pipelines. |
| D5 | IDs | `evelyn.ap.apworld.<slug>.v1`; LO `apworld.<slug>`; files `ap-apworld-u2-<slug>.ts`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-world-history'`; `metadata.cedUnit:'2'`. |
| D6 | Documents | **Public-domain only** (old translations of medieval travel accounts + chronicles are PD). Visual documents = text descriptions (genre `'political-cartoon'`). Content-filter safety. |

## Architecture

### Reused (no rebuild, all present on the parent branch)
- `Passage` registry + genres (`'document'`, `'political-cartoon'`, `'constitution'`).
- `SegmentTryYourself.passageId?` / `passageIds?` / `packetLabel?`; `resolvePassageText(passageId?, passageIds?, packetLabel)` (Document 1..N for DBQ).
- Passage-aware rubric grader; `lint-passages.ts`; the `FrqRubric` mechanism.
- `scripts/lint-ap-plans.ts` — **add `'apworld'` to `AP_COURSE_SLUGS`** (the only "infra" touch, same one-line pattern as `'englang'`/`'apush'`).

### New = content only

**Documents (~7 public-domain, on Afro-Eurasian trade networks 1200–1450):**
- Marco Polo, *The Travels* — Silk Roads / Kublai Khan's court / Hangzhou commerce
- Ibn Battuta, *Rihla* — Indian Ocean trade / East African city-states (Kilwa)
- Al-Umari (Cairo chronicler) or Ibn Battuta on **Mansa Musa**'s hajj + Mali gold — trans-Saharan trade
- Marco Polo (or a chronicle) on the **Mongol** *yam* postal relay / Pax Mongolica
- A source on the **Black Death** / disease spread along trade routes (e.g. al-Maqrizi, or a European chronicle)
- A described **visual** — the Catalan Atlas (1375) panel depicting Mansa Musa holding gold (text description, genre `'political-cartoon'`)
- One more trade source (trans-Saharan al-Bakri on Ghana's gold, or a source on the Indian Ocean monsoon/dhow trade)

**Rubric shapes (authored on essay-practice plans, no code — identical to APUSH):**
- **DBQ (7):** `[A-thesis:1, B-context:1, C-doc-evidence:2, D-outside-evidence:1, E-sourcing:1, F-complexity:1]`.
- **LEQ (6):** `[A-thesis:1, B-context:1, C-evidence:2, D-analysis:2]`.
- **SAQ (3):** `[a:1, b:1, c:1]`.

| Component | Deliverable |
|---|---|
| Lesson plans | ~5 content plans (Silk Roads; Indian Ocean trade; trans-Saharan trade & Mali; the Mongol Empire & its effects; cultural/technological/biological diffusion incl. the Black Death) + **DBQ + LEQ + SAQ** essay-practice plans |
| Documents | ~7 seeded `Passage`s (genre `'document'`), used as the DBQ packet + stimulus MCQs |
| Rubrics | DBQ 7-pt, LEQ 6-pt, SAQ 3-pt on the essay-practice plans |
| Topic-notes | one baseline per content plan |
| MCQ bank | `data/problem-bank/ap-world-history/u2.json` — stimulus-based sets, self-contained stems, distributed+shuffled answers |
| Academy | new `buildCourse` block (pattern `/^ap-apworld-.*\.ts$/`, subject `'World History'`, engine coords `{subject:'ss', level:'ap', topic:'ap-world-history'}`), mappings regenerated |

DBQ prompt e.g. *"Evaluate the extent to which trade networks transformed Afro-Eurasia in the period 1200–1450."*

## Phasing
- **P0 — infra (tiny):** add `'apworld'` to `lint-ap-plans.ts` `AP_COURSE_SLUGS`. (No schema/grader changes — all reused.) Verify tsc + lint.
- **P1 — Unit-2 content:** seed ~7 documents → author content plans (calibrate 1) → notes → DBQ/LEQ/SAQ + rubrics → stimulus MCQ bank → academy block.
- **Validation gate (user):** live session — a document renders, the DBQ grades 7-pt with all documents (Document 1..N), SAQ 3-pt, LEQ 6-pt, a stimulus MCQ set surfaces.
- **P2 (separate):** Units 1, 3–9 fan-out.

## Testing strategy
- P0: lint-ap-plans recognizes `apworld`. (No new unit tests — infra reused + already tested on the APUSH branch.)
- Content gates (reuse APUSH pattern): tsc 0; lint-ap-plans passes; lint:passages clean; DBQ rubric sums to 7 / LEQ 6 / SAQ 3 (structural walk); DBQ packet resolves all docs → "Document 1..N"; baselineId===planId, 0 dup/orphan; MCQ dry-run verify (**note the seed-problem-bank verify-prompt hardcodes an AP-Statistics persona — see APUSH memo; didn't block APUSH, monitor**); 0 dangling refs; content-filter safety; historical accuracy (per-task review — history courses need it).
- Live gate as the release gate before fan-out.

## Out of scope (deferred)
- Units 1, 3–9 (P2 initiative).
- Embedded document images (visual docs = text descriptions).
- DB seeding + academy ingest + merge (user/ops — ships together with Eng Lang + APUSH; the branch is stacked on both).

## Risks
- **Translation fidelity**: medieval travel accounts exist in multiple PD translations; quote a single consistent PD translation per document and cite it. WebFetch's ~125-char quote guardrail blocks long verbatim fetches (per APUSH) → author short excerpts inline (controller) from reliable PD translations.
- **Content-filter**: Unit 2 is largely trade/travel narrative — filter-safe; the Black Death document should stay clinical/measured.
- **Historical accuracy**: the APUSH build's per-task reviews caught many factual errors — keep the same review discipline for World content (dates, dynasties, geography, attributions).
