# APUSH Period-3 Vertical Slice — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Period-3 vertical slice of AP US History — content plans + notes + DBQ/LEQ/SAQ essay practice with authentic rubrics + document set + stimulus MCQs — validating the DBQ document-packet grading before fanning out the other 8 periods.

**Architecture:** Reuse the AP English Language stimulus infrastructure: the DBQ is a multi-document packet on the existing `passageIds[]` field; documents are `Passage`s; the passage-aware grader carries over. New: a `'document'` passage genre, a back-compat `Document N` grader label for DBQ packets, and three authentic AP History rubric formats (DBQ 7 / LEQ 6 / SAQ 3) authored on essay-practice plans.

**Tech Stack:** TypeScript, Next.js (engine), Mongo (ProblemBank + academy_portal), `@evelyn/portal-contract/v1`, ts-node test scripts (node:assert harness), esbuild academy `gen-seed.mjs`.

**Spec:** `docs/superpowers/specs/2026-07-10-ap-us-history-design.md`

## Global Constraints

- **Documents public-domain only** — every `Passage.license === 'public-domain'`; Period-3 founding-era sources. Short excerpts (~100–200 words). Content-filter safety: measured excerpts, no graphic spans.
- **Rubric totals authentic** — DBQ parts sum to **7**, LEQ to **6**, SAQ to **3**, all integer, each `FrqRubricPart` with `scoringCriteria` + `modelResponse`.
- **ID scheme:** `evelyn.ap.apush.<slug>.v1`; LO `apush.<slug>`; files `ap-apush-u3-<slug>.ts`; `subject:'ss'`; `curriculum:'AP'`; `topic:'ap-us-history'`; `metadata.cedUnit:'3'` (STRING).
- **`baselineId === planId`** for every topic-notes baseline.
- **Additive/back-compat** — the `packetLabel` field + genre additions are optional; the Eng Lang Synthesis packet MUST still label `Source A/B/C` (its prompt says so). No existing course content changes.
- **Verify structurally, never by grep** — rubric sums audited by walking `SEED_PLANS` segments.
- **Isolated worktree** — all work in `.claude/worktrees/apush-p3` on branch `apush-period3-slice` (stacked on `eng-lang-units-2-9`). Do NOT run the dev server on port 3001–3010 (other sessions live-test there).
- **Test harness:** node:assert (strict) + a tiny `test()` counter, non-zero exit on failure, run via a `test:*` npm script (ts-node + tsconfig-paths). Stub model deps — no network.

## File Structure

**Phase 0 (modify):**
- `src/lib/tutor/passages/types.ts` — add genres to `Passage.genre`.
- `src/lib/tutor/lesson-plan/types.ts` — add `packetLabel?: 'source' | 'document'` to `SegmentTryYourself`.
- `src/lib/tutor/portal/adapters.ts` — `resolvePassageText` gains a label-style param; `resolveGradeItem` + `resolveAssessmentItem` pass `seg.packetLabel`.
- `src/lib/tutor/portal/adapters.test.ts` — add DBQ `Document N` + Eng Lang `Source A` back-compat tests.

**Phase 1 (create):**
- `src/lib/tutor/passages/seeds/apush-*.ts` — ~6 new Period-3 documents (Henry reused).
- `src/lib/tutor/lesson-plan/seeds/ap-apush-u3-*.ts` — ~6 content plans + 3 essay-practice (dbq/leq/saq).
- `src/lib/tutor/topic-notes/seeds/ap-apush-u3-*.ts` — ~6 baselines.
- `src/data/problem-bank/ap-us-history/u3.json` + `_AUTHORING.md`.

**Phase 1 (modify):**
- `src/lib/tutor/passages/store.ts`, `src/lib/tutor/lesson-plan/store.ts`, `src/lib/tutor/topic-notes/store.ts` — register.
- academy `tools/gen-seed.mjs` — APUSH `buildCourse` block.

---

## PHASE 0 — INFRA

### Task 1: `'document'` genre + `Document N` DBQ label (back-compat)

**Files:**
- Modify: `src/lib/tutor/passages/types.ts`
- Modify: `src/lib/tutor/lesson-plan/types.ts`
- Modify: `src/lib/tutor/portal/adapters.ts`
- Test: `src/lib/tutor/portal/adapters.test.ts`

**Interfaces:**
- Produces: `Passage.genre` includes `'document' | 'political-cartoon' | 'constitution'`; `SegmentTryYourself.packetLabel?: 'source' | 'document'`; `resolvePassageText(passageId?, passageIds?, packetLabel?: 'source'|'document')` labels `Document N` when `packetLabel==='document'`, else `Source A/B/C`.

- [ ] **Step 1: Extend the genre enum**

In `src/lib/tutor/passages/types.ts`, change the `genre` union to add the three history genres:
```ts
  genre: 'speech' | 'essay' | 'letter' | 'sermon' | 'pamphlet' | 'memoir' | 'document' | 'political-cartoon' | 'constitution';
```

- [ ] **Step 2: Add `packetLabel` to the try-yourself segment**

In `src/lib/tutor/lesson-plan/types.ts`, right after the `passageIds?: string[]` field (line ~199), add:
```ts
  /** Label style for a multi-source/document packet in the grader prompt:
   *  'document' → "Document 1..N" (APUSH DBQ); default/'source' → "Source A/B/C"
   *  (Eng Lang Synthesis). Back-compat: undefined behaves as 'source'. */
  packetLabel?: 'source' | 'document';
```

- [ ] **Step 3: Write the failing test**

Add to `src/lib/tutor/portal/adapters.test.ts` (follow the existing harness in that file). The test drives the real `resolveGradeItem` against two seeded FRQ items — but since those APUSH plans don't exist yet, test `resolvePassageText` directly by exporting it OR test via a small seeded fixture. Simplest: **export `resolvePassageText`** from `adapters.ts` (add `export`) and assert:

```ts
import { resolvePassageText } from './adapters';
// (add to the existing run() in adapters.test.ts)
await test('document packet labels Document 1..N', async () => {
  const ids = ['evelyn.passage.henry-give-me-liberty.v1']; // real seeded passage
  const out = resolvePassageText(undefined, [ids[0], ids[0]], 'document');
  assert.ok(out && out.includes('Document 1') && out.includes('Document 2'), 'expected Document N labels');
  assert.ok(!out!.includes('Source A'), 'should not use Source labels for document style');
});
await test('source packet still labels Source A/B/C (back-compat)', async () => {
  const id = 'evelyn.passage.henry-give-me-liberty.v1';
  const out = resolvePassageText(undefined, [id, id]); // no packetLabel → source
  assert.ok(out && out.includes('Source A') && out.includes('Source B'), 'expected Source labels by default');
});
```

- [ ] **Step 4: Run test — verify it fails**

Run: `npm run test:adapters-passage`
Expected: FAIL — `resolvePassageText` not exported / third param not honored / still emits `Source` for document style.

- [ ] **Step 5: Implement the label param**

In `src/lib/tutor/portal/adapters.ts`, change `resolvePassageText` to:
```ts
export function resolvePassageText(
  passageId?: string,
  passageIds?: string[],
  packetLabel: 'source' | 'document' = 'source',
): string | undefined {
  const ids = [...(passageId ? [passageId] : []), ...(passageIds ?? [])];
  if (ids.length === 0) return undefined;
  const multi = ids.length > 1;
  const chunks = ids
    .map((id, i) => {
      const p = resolvePassage(id);
      if (!p) return undefined;
      const tag = packetLabel === 'document' ? `Document ${i + 1}` : `Source ${String.fromCharCode(65 + i)}`;
      const label = multi ? `${tag} — ${p.title} (${p.author}):\n` : '';
      return label + p.fullText;
    })
    .filter((c): c is string => Boolean(c));
  return chunks.length ? chunks.join('\n\n---\n\n') : undefined;
}
```

Then thread `seg.packetLabel` at both call sites:
- `resolveGradeItem`: `passageText: resolvePassageText(seg.passageId, seg.passageIds, seg.packetLabel)`.
- `resolveAssessmentItem` (plan try-yourself branch): same third arg `seg.packetLabel`.

- [ ] **Step 6: Run tests — verify pass + back-compat**

Run: `npm run test:adapters-passage` → both new tests + existing pass.
Run: `npm run test:portal-grading-passage` → still 2/2 (back-compat).
Run: `npx tsc --noEmit` → 0 errors.

- [ ] **Step 7: Commit**
```bash
git add src/lib/tutor/passages/types.ts src/lib/tutor/lesson-plan/types.ts src/lib/tutor/portal/adapters.ts src/lib/tutor/portal/adapters.test.ts
git commit -m "feat(apush): 'document' passage genre + Document N DBQ packet label (back-compat)"
```

---

## PHASE 1 — PERIOD-3 CONTENT

> Content tasks are authored, not TDD; the gate is tsc + lint + structural audit. Author original prose modeled on the named gold references. Documents are verbatim public-domain excerpts.

### Task 2: Seed ~7 Period-3 documents

**Files:**
- Create: `src/lib/tutor/passages/seeds/apush-common-sense.ts`, `apush-declaration.ts`, `apush-federalist-10.ts`, `apush-brutus-1.ts`, `apush-constitution-preamble.ts`, `apush-join-or-die.ts`
- Modify: `src/lib/tutor/passages/store.ts` (register; Henry already registered — reuse)

- [ ] **Step 1: Author each document seed** as a `Passage` (genre `'document'`, or `'constitution'` for the Preamble, `'political-cartoon'` for Join-or-Die). Fetch verbatim public-domain text (Gutenberg/Wikisource/Avalon), trim to ~100–200-word authentic DBQ excerpts, paragraph-delimit, accurate `wordCount`, `year < 1929`, `license:'public-domain'`, real `sourceUrl`. For Join-or-Die (visual), `fullText` = a factual text DESCRIPTION of the cartoon + its caption + attribution (no image). ids `evelyn.passage.apush-<slug>.v1`.
- [ ] **Step 2: Register** the 6 new documents in `SEED_PASSAGES` (Henry is already there — reuse its id in the DBQ set).
- [ ] **Step 3: Verify.** `npm run test:passages` (ids unique, all public-domain); `npm run lint:passages` (clean); `npx tsc --noEmit` → 0. Sanity-check each `wordCount` (within ~5%).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/passages
git commit -m "content(apush): 6 public-domain Period-3 documents (+ Henry reused)"
```

### Task 3: Calibration content plan + register (STOP checkpoint)

**Files:**
- Create: `src/lib/tutor/lesson-plan/seeds/ap-apush-u3-causes-of-revolution.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts`

- [ ] **Step 1: Author** the plan (gold structural reference: `src/lib/tutor/lesson-plan/seeds/ap-macro-u1-scarcity.ts` for a content-course shape; English-course semantics reference `ap-englang-u1-rhetorical-situation.ts`). id `evelyn.ap.apush.causes-of-revolution.v1`, LO `apush.causes-of-revolution` (standard `AP-APUSH-3.2`), cedTopic '3.2', cedTitle 'Causes of the American Revolution'. Segments: hook; concept (the imperial crisis — taxation, salutary neglect's end, Enlightenment ideas; `vocabulary`); worked_example (annotated: analyze a short document excerpt's argument, e.g. a line from Common Sense — set `passageId`); try_yourself (a **SAQ-style** short-answer: "Briefly explain ONE cause of the Revolution and ONE piece of evidence" — `responseFormat:'frq'`, rubric = 2 parts summing to… keep this plan's try-yourself a simple 3-pt SAQ shape a:1/b:1/c:1 OR a focused 2-part; the full DBQ/LEQ/SAQ live in Task 5). Use a rubric summing to a clean integer with real fields; misconception_check (a real APUSH trap — e.g. confusing correlation/causation of events, or presentism); recap. `subject:'ss'`, `metadata.cedUnit:'3'`, `pacingThresholds: AP_PACING_THRESHOLDS`, `source: AP_SOURCE`. Plan-level `estimatedMinutes` = segment sum.
- [ ] **Step 2: Register** in `lesson-plan/store.ts`.
- [ ] **Step 3: Verify.** `npx tsc --noEmit` → 0; `npx tsx scripts/lint-ap-plans.ts` — NOTE: `lint-ap-plans.ts` has a hardcoded `AP_COURSE_SLUGS` list; **add `'apush'` to it** (same one-line edit made for `'englang'`) so the plan is recognized as new-format. `npm run lint:passages` clean. Structural: segment kinds print in order, rubric sums to its declared integer, passageId resolves.
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apush-u3-causes-of-revolution.ts src/lib/tutor/lesson-plan/store.ts scripts/lint-ap-plans.ts
git commit -m "content(apush): Period-3 calibration plan — causes of the Revolution"
```

**STOP — calibration checkpoint.** This is the gold template for the remaining content plans + establishes APUSH content-course semantics (historical concept + document analysis + SAQ-style practice). Review before Task 4.

### Task 4: Remaining Period-3 content plans

**Files:**
- Create: `ap-apush-u3-revolutionary-ideals.ts` (LO `apush.revolutionary-ideals`, cedTopic 3.3), `ap-apush-u3-articles-of-confederation.ts` (3.5, `apush.articles-of-confederation`), `ap-apush-u3-constitution-ratification.ts` (3.8/3.9, `apush.constitution-ratification`), `ap-apush-u3-new-republic.ts` (3.10, `apush.new-republic`), optionally `ap-apush-u3-revolution-effects.ts` (3.11, `apush.revolution-effects`).
- Modify: `src/lib/tutor/lesson-plan/store.ts`

- [ ] **Step 1: Author** each plan copying the Task-3 template. Each: historical `concept`, a `worked_example` analyzing a document (set `passageId` to a relevant Period-3 document — Declaration for ideals, Federalist/Brutus for ratification, etc.), a `try_yourself` (SAQ-style short-answer with an integer rubric), a real `misconception_check`, hook/recap. Wire `prerequisites`/`followUps` within the period + to the calibration LO. Every referenced id must be a real LO. Plan-level `estimatedMinutes` = segment sum.
- [ ] **Step 2: Register** all in `lesson-plan/store.ts`.
- [ ] **Step 3: Verify.** tsc 0; `lint-ap-plans` passes; `lint:passages` clean; structural rubric audit (each try_yourself rubric an integer total with per-part fields); 0 dangling refs (walk SEED_PLANS for `evelyn.ap.apush.` prereqs/followUps).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apush-u3-*.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(apush): Period-3 content plans (ideals, articles, ratification, new republic)"
```

### Task 5: Essay-practice plans — DBQ, LEQ, SAQ

**Files:**
- Create: `ap-apush-u3-dbq-practice.ts`, `ap-apush-u3-leq-practice.ts`, `ap-apush-u3-saq-practice.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts`

- [ ] **Step 1: Author the DBQ plan.** id `evelyn.ap.apush.u3-dbq-practice.v1`, LO `apush.u3-dbq-practice` (`AP-APUSH-3-DBQ`), cedTopic '3-DBQ'. prerequisites = the Period-3 content LOs. Segments: hook; concept (frames the DBQ task + the 7 rubric rows); ONE full-essay `try_yourself` — `responseFormat:'frq'`, **`packetLabel:'document'`**, **`passageIds`** = the 7 Period-3 document ids (Common Sense, Declaration, Henry, Federalist 10, Brutus 1, Constitution Preamble, Join-or-Die), a real AP-style DBQ prompt (e.g. "Evaluate the extent to which the American Revolution changed American political and social ideals, 1775–1800"), `expectedAnswer` describing full-credit work, and the **7-point rubric**: `[A-thesis:1, B-context:1, C-doc-evidence:2, D-outside-evidence:1, E-sourcing:1, F-complexity:1]`, each part with `scoringCriteria` + `modelResponse`. recap.
- [ ] **Step 2: Author the LEQ plan.** id `evelyn.ap.apush.u3-leq-practice.v1`, cedTopic '3-LEQ'. Full-essay `try_yourself`: `responseFormat:'frq'`, NO passages (student's own evidence), a real LEQ prompt (e.g. "Evaluate the extent to which the Articles of Confederation were an effective form of government, 1781–1789"), **6-point rubric**: `[A-thesis:1, B-context:1, C-evidence:2, D-analysis:2]`.
- [ ] **Step 3: Author the SAQ plan.** id `evelyn.ap.apush.u3-saq-practice.v1`, cedTopic '3-SAQ'. `try_yourself`: `responseFormat:'frq'`, a 3-part SAQ prompt ("(a) briefly describe ONE… (b) explain ONE… (c) explain ONE…") optionally with a short stimulus (`passageId` to one document), **3-point rubric**: `[a:1, b:1, c:1]`.
- [ ] **Step 4: Register** all three in `lesson-plan/store.ts`.
- [ ] **Step 5: Verify.** tsc 0. Structural + packet resolution:
`npx tsx -e "import {SEED_PLANS} from './src/lib/tutor/lesson-plan/store'; import {resolveGradeItem} from './src/lib/tutor/portal/adapters'; for (const [id,want] of [['evelyn.ap.apush.u3-dbq-practice.v1',7],['evelyn.ap.apush.u3-leq-practice.v1',6],['evelyn.ap.apush.u3-saq-practice.v1',3]]){ const p=SEED_PLANS.find(x=>x.id===id); const ty=p.segments.find(s=>s.kind==='try_yourself'); const sum=ty.rubric.parts.reduce((a,x)=>a+x.maxPoints,0); const gi=resolveGradeItem(id+'::'+ty.id); console.log(id.split('.')[3],'sum='+sum+'/'+want, 'docs='+(ty.passageIds?.length||0), gi?.passageText?.includes('Document 1')?'[Doc labels]':(gi?.passageText?'[text]':'none')); }"`
→ DBQ `sum=7/7 docs=7 [Doc labels]`, LEQ `sum=6/6 docs=0 none`, SAQ `sum=3/3`. `lint-ap-plans` + `lint:passages` pass.
- [ ] **Step 6: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-apush-u3-*q-practice.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(apush): Period-3 DBQ (7pt, 7-doc packet) + LEQ (6pt) + SAQ (3pt) practice"
```

### Task 6: Topic-notes baselines

**Files:**
- Create: `src/lib/tutor/topic-notes/seeds/ap-apush-u3-<slug>.ts` (one per content plan from Tasks 3–4)
- Modify: `src/lib/tutor/topic-notes/store.ts`

- [ ] **Step 1: Author** one baseline per content plan (gold: `src/lib/tutor/topic-notes/seeds/ap-englang-u1-rhetorical-situation.ts` for shape; content is historical). `baselineId===planId`, `course:'AP United States History'`, `cedUnit:3` (number), cedTopic/cedTitle from the plan, theory 8–12 (history facts + `kind:'definition'` for key terms/events + `kind:'framework'`), methods 1–2 (analysis moves, e.g. "How to source a document / HIPP"), pointers. Text-only. Skip the essay-practice plans.
- [ ] **Step 2: Register** in `SEED_BASELINES`.
- [ ] **Step 3: Verify.** tsc 0; structural (`course==='AP United States History'` count, 0 mismatch, 0 orphan, theoryMin ≥8).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/topic-notes/seeds/ap-apush-u3-*.ts src/lib/tutor/topic-notes/store.ts
git commit -m "content(apush): Period-3 topic-notes baselines"
```

### Task 7: Stimulus MCQ bank

**Files:**
- Create: `src/data/problem-bank/ap-us-history/u3.json`, `src/data/problem-bank/ap-us-history/_AUTHORING.md`

- [ ] **Step 1: Author** `u3.json` — ~10 stimulus-based MCQs in sets keyed to Period-3 documents. Each item **self-inlines the short quoted document line/description it tests** (the verifier does not load the passage) + sets `passageId` for grouping, `loId` = a Period-3 content LO, `cedCode`, difficulty 1–4, `responseFormat:'mcq'`, 4 `choices`, `answer` LETTER, `hints`. Questions test APUSH reading-skills: main idea/point of view of a document, historical situation, comparison across documents, cause/effect. **Distribute + shuffle answer letters** (non-cyclic); keep choice lengths comparable. Record per-LO cedCodes in `_AUTHORING.md`.
- [ ] **Step 2: Verify** (dry-run, uses `.env.local` ANTHROPIC_API_KEY — copy it into the worktree from the main checkout first if missing, gitignored): `npm run seed:problem-bank -- --course=ap-us-history --file=u3.json --dry-run` → validation + Sonnet verify pass; fix any wrong key/ambiguous stem. `npm run lint:passages` clean.
- [ ] **Step 3: Commit** (git JSON only; Mongo seed deferred).
```bash
git add src/data/problem-bank/ap-us-history
git commit -m "content(apush): Period-3 stimulus MCQ bank"
```

### Task 8: Academy course

**Files:**
- Modify: academy `tools/gen-seed.mjs` (new `buildCourse` block + `courses` array + log string) — work in `/Users/luke/Dev/academy` on a branch (do NOT commit on main; do not touch unrelated modified files).

- [ ] **Step 1: Add** an `apUSHistory = buildCourse({...})` mirroring `apStats`: pattern `/^ap-apush-.*\.ts$/`, key `'AP_US_HISTORY'`, title `'AP United States History'`, subject `'History'`, fallbackTopic `'ap-us-history'`, engine coords `{subject:'ss', level:'ap', topic:'ap-us-history'}`, seoMeta. Add to `courses` + the log/`generatedFrom` string.
- [ ] **Step 2: Regenerate** (from academy, pointing at this worktree): `ENGINE_REPO=/Users/luke/Dev/evelynlearning/.claude/worktrees/apush-p3 npm run seed:gen`. Verify `seed/mappings.json` has AP US History with the Period-3 nodes. **Do NOT run `npm run ingest`** (live DB — deferred to user).
- [ ] **Step 3: Commit** (academy branch): `git add tools/gen-seed.mjs seed/mappings.json && git commit -m "feat(academy): AP US History course from engine apush seeds"`.

### Task 9: Live validation gate (user-driven)

**Not a code task.** With the branch built, the user runs one real Period-3 session (drives port 3001; controller does not auto-start it) and confirms:
- [ ] A document renders (show_annotated_passage).
- [ ] The **DBQ grades against the 7-point rubric** with all 7 documents in the grader (Document 1..7 labels), a **SAQ grades 3-point**, a **LEQ grades 6-point**.
- [ ] A stimulus MCQ set surfaces; topic notes render.
- [ ] Content-filter-safe throughout.

**Only after this passes** does Phase 2 (Periods 1–2, 4–9) begin.

---

## Self-Review

**Spec coverage:** D1 APUSH → all; D2 vertical slice → Tasks 2–9; D3 Period 3 → cedUnit 3 throughout; D4 rubric totals 7/6/3 → Task 5 + constraints; D5 DBQ packet reuse → Task 1 (`packetLabel`) + Task 5 (`passageIds` + `packetLabel:'document'`); D6 document model → Task 1 (genres) + Task 2 (seeds). All six components → Tasks 2 (docs), 3–4 (plans), 5 (essays/rubrics), 6 (notes), 7 (MCQ), 8 (academy). Validation → Task 9.

**Placeholder scan:** No TBD/TODO; content tasks name gold references, exact ids, exact verify commands. Prose is authored at execution (a plan can't contain verbatim Federalist 10) but every structural decision is specified.

**Type consistency:** `packetLabel?: 'source'|'document'` used consistently (types → adapters → Task-5 DBQ); `resolvePassageText(passageId?, passageIds?, packetLabel?)` signature matches Task 1 and the Task-5 verify; rubric totals DBQ 7 / LEQ 6 / SAQ 3 consistent; id/LO/file schemes uniform.
