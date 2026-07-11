# AP US History (APUSH) — Period-3 Vertical Slice Design

**Date:** 2026-07-10
**Status:** Approved (brainstorming)
**Branch / worktree:** `apush-period3-slice` @ `.claude/worktrees/apush-p3` (off `eng-lang-units-2-9` — reuses the passage/packet/grader infrastructure)
**Related:** [[project_ap_eng_lang_slice]] (passage infra + multi-source packet this reuses), [[project_ap_parity_gaps_build]] (6-component model), [[project_ap_plans_initiative]] (AP authoring conventions)

## Purpose

Build AP US History — **#2 AP exam by US volume** (~517k). It reuses the stimulus/essay infrastructure built for AP English Language: the DBQ is a multi-document packet (the Synthesis `passageIds[]` mechanism), documents map to the `Passage` registry, and the passage-aware grader carries over. The genuinely new work is (a) three authentic AP History rubric formats and (b) chronological historical content.

To de-risk the DBQ/document/rubric approach before fanning out 9 chronological periods, this is a **vertical slice: Period 3 (1754–1800, Revolution & Constitution) end-to-end**, plus the three rubric formats and the `'document'` passage genre. After validation, Periods 1–2 and 4–9 fan out (separate initiative).

## Decisions locked (brainstorming)

| # | Decision | Resolution |
|---|---|---|
| D1 | Course | **AP US History** (chosen; #2 demand; unlocks AP World History which shares the DBQ infra). |
| D2 | Build shape | **Vertical slice first** — Period 3 end-to-end + rubric formats, validate the DBQ, then fan out the other 8 periods. |
| D3 | Slice period | **Period 3 (1754–1800)** — content-rich, high-yield, and almost entirely public-domain documents (founding-era), so the DBQ document set is trivial + filter-safe to assemble. |
| D4 | Rubric formats | **Authentic AP History totals** (engine sums part-points dynamically): **DBQ = 7**, **LEQ = 6**, **SAQ = 3**. Same "authentic scale" approach as Eng Lang's 6-point. |
| D5 | DBQ documents | **Reuse the Synthesis `passageIds[]` packet** — the ~7 documents are a document packet; the grader concatenates + labels them (relabel "Source"→"Document"). |
| D6 | Document model | **Reuse the `Passage` registry** with new genres `'document'`, `'political-cartoon'`, `'constitution'`. Visual documents = text description + attribution (Passage is text-only). Public-domain only. |

## Architecture

### Reused from Eng Lang (no rebuild)
- `Passage` registry (`src/lib/tutor/passages/`) — documents are `Passage`s.
- `passageIds?: string[]` on `SegmentTryYourself` + `resolvePassageText(passageId, passageIds)` concatenation — the DBQ document packet.
- Passage-aware rubric grader (`grade-free-response.ts` + `resolveGradeItem`/`resolveAssessmentItem`).
- `lint-passages.ts`, the 6-point `FrqRubric` mechanism, the topic-notes + problem-bank + academy pipelines.

### New / changed
1. **Genre enum** (`passages/types.ts`): add `'document' | 'political-cartoon' | 'constitution'` to `Passage.genre`.
2. **Document label** (`portal/adapters.ts` `resolvePassageText`): the multi-source label is currently `Source A/B/C`. Make it history-appropriate for DBQ — `Document 1..7`. Cleanest: keep a single generic helper but switch the label to `Document N` (numbers, not letters), OR keep `Source A` and accept it (History reads fine either way). Decision: relabel to `Document N` since that is the DBQ convention; verify the Eng Lang Synthesis path still reads acceptably (its prompt already says "Source A/B/C", so we keep BOTH labels: pass an optional label-style, default `Source`, DBQ uses `Document`). **Minimal additive param**, back-compat for Eng Lang.
3. **Three rubric shapes** (authored on the essay-practice plans, no code):
   - **DBQ (7):** `A-thesis`:1, `B-context`:1, `C-doc-evidence`:2, `D-outside-evidence`:1, `E-sourcing`:1, `F-complexity`:1.
   - **LEQ (6):** `A-thesis`:1, `B-context`:1, `C-evidence`:2, `D-analysis`:2.
   - **SAQ (3):** `a`:1, `b`:1, `c`:1 (no thesis; `responseFormat:'frq'`).

### Period-3 deliverables (all components)

**Documents (~7 public-domain, seeded as `Passage` genre `'document'`):**
- Thomas Paine, *Common Sense* (1776)
- Declaration of Independence (1776) — preamble/grievances excerpt
- Patrick Henry, "Give Me Liberty" (1775) — **reuse existing seed**
- *Federalist No. 10* (Madison, 1787)
- *Brutus No. 1* (Anti-Federalist, 1787)
- U.S. Constitution Preamble / Articles of Confederation excerpt
- Political cartoon "Join, or Die" (Franklin, 1754) — text description + attribution

| Component | Deliverable |
|---|---|
| Lesson plans | ~5–6 content plans across Period-3 key concepts (causes of the Revolution; Revolutionary ideals & the Enlightenment; the war & its effects; Articles of Confederation & their weaknesses; the Constitution & ratification debate; the new republic) + **3 essay-practice plans (DBQ, LEQ, SAQ)** |
| Documents | ~7 seeded `Passage`s (genre `'document'`), used as the DBQ packet + stimulus MCQs |
| Rubrics | DBQ 7-pt, LEQ 6-pt, SAQ 3-pt on the essay-practice plans |
| Topic-notes | one baseline per content plan |
| MCQ bank | `data/problem-bank/ap-us-history/u3.json` — stimulus-based sets (document/described-image), self-contained stems (verifier can't load the passage), distributed+shuffled answers |
| Academy | Period-3 nodes; new `buildCourse` block (pattern `/^ap-apush-.*\.ts$/`), mappings regenerated |

IDs `evelyn.ap.apush.<slug>.v1`; LO `apush.<slug>`; files `ap-apush-u3-<slug>.ts`; `subject:'ss'`; `curriculum:'AP'`; `metadata.cedUnit:'3'`.

## Phasing
- **P0 — infra:** genre enum + `Document N` label param + lint. Verify: tsc, grader back-compat tests, lint:passages.
- **P1 — Period-3 content:** seed ~7 documents → author content plans (calibrate 1) → notes → DBQ/LEQ/SAQ essay-practice plans + rubrics → stimulus MCQ bank → academy block.
- **Validation gate (user):** live session — a document renders, the DBQ grades against the 7-point rubric with all documents in the grader, an SAQ grades 3-point, a stimulus MCQ set surfaces. Do not fan out until this passes.
- **P2 (separate initiative):** Periods 1–2, 4–9 fan-out.

## Testing strategy
- P0: grader back-compat (absent packet → unchanged); a unit test that the DBQ document packet resolves all 7 documents labeled `Document 1..7`.
- Content gates (reuse Eng Lang pattern): tsc 0; lint-ap-plans passes; lint:passages clean; DBQ rubric sums to 7, LEQ to 6, SAQ to 3 (structural `SEED_PLANS` walk); baselineId===planId, 0 dup/orphan; MCQ dry-run verify; no dangling refs; content-filter safety.
- Live gate as the release gate before fan-out.

## Out of scope (deferred)
- Periods 1–2, 4–9 (P2 initiative).
- Actual embedded document images (visual docs = text descriptions).
- 20th-century copyrighted documents (Periods 7–9 sourcing handled at fan-out; favor public-domain / described).
- DB seeding + academy ingest + merge (user/ops — will ship together with Eng Lang).

## Risks
- **DBQ grader with 7 documents** inflates the grader prompt (7 docs × ~150 words ≈ 1k words, fine). Documents kept to authentic short excerpts.
- **Content-filter** on some historical content (slavery, war) — Period 3 founding texts are measured; use short excerpts, same discipline as Eng Lang. Later periods (Civil War, etc.) need care at fan-out.
- **Label reuse**: the `Source`/`Document` label param must stay back-compat for the Eng Lang Synthesis packet (its prompt says "Source A/B/C").
