# AP Mock Exam Forms (×9) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Register 9 AP exam blueprints and author + verify + seed (as prod DRAFTs) one full-length mock form per AP course, completing Workstream 2 of the mock-exams platform (spec: `academy/docs/superpowers/specs/2026-07-20-mock-exams-platform-design.md`).

**Architecture:** Pure content round on the existing platform — `registerBlueprint` entries in `src/lib/tutor/mock-exam/blueprints/` (zero service/route changes), form content in `src/data/mock-forms/<formId>/{form.json,items.json}`, stimulus passages in `src/lib/tutor/passages/seeds/`, seeded via `npm run seed:mock-form`. Academy needs no code (Mock tab is generic; all 9 AP topicIds already mapped in `COURSE_ENGINE_TOPIC`) except one tiny ScoreReport polish.

**Tech Stack:** TypeScript (Next.js engine repo), node:assert test scripts, Mongoose/Mongo, Anthropic SDK (Sonnet verify gate).

## Global Constraints

- **Repos:** engine = `/Users/luke/Dev/evelynlearning` (branch off `main`), academy = `/Users/luke/Dev/academy` (Task 12 only). No portal-contract changes — v1.6.0 already covers `examType: 'ap'`, `responseFormat: 'frq'`, `FrqRubric`.
- ⚠ **PROD-WRITE GOTCHA:** engine `.env.local` `MONGODB_URI` = `127.0.0.1:2710` = the **PROD tunnel**. Any `seed:mock-form` run without `--dry-run`/`--lint-only` writes PROD. Default (no `--go-live`) seeds `status: 'draft'` — invisible to students. NEVER pass `--go-live` in this plan; live flips are user-gated.
- **Never remove/weaken** the `bankScope: 'mock'` exclusion guards in `safeBankQuery`/`resolveAssessmentItem`/`queryBank`.
- **Engine deploy before live-flip:** `./deploy-update.sh` (NEVER `npm run deploy`) must run before any AP form flips live — blueprints must exist on the server. `.deploy-*-manifest` files are a FALSE recency signal.
- **Test commands:** `npm run test:mock-blueprints`, `test:mock-scoring`, `test:mock-service`, `test:mock-report`, `test:portal-mock` (all node:assert scripts, run with `npx tsx`).
- **Form/topic naming:** `formId` = `<topicId>-form-a` (e.g. `ap-statistics-form-a`), dir name = formId, `topicIds: [<topicId>]`. TopicIds (must match academy `COURSE_ENGINE_TOPIC` exactly): `ap-statistics`, `ap-calculus-bc`, `ap-macroeconomics`, `ap-psychology`, `ap-environmental-science`, `ap-english-language`, `ap-us-history`, `ap-world-history`, `ap-us-government`.
- **Item IDs:** `<prefix>-fa-mc-NNN` (MCQ, 3-digit) / `<prefix>-fa-fr-NN` (FRQ, 2-digit), prefix = the course's bank loId prefix: `apstats`, `apcalcbc`, `apmacro`, `appsych`, `apenvsci`, `apenglang`, `apush`, `apworld`, `apgov`.
- **Passage IDs:** `evelyn.passage.<prefix>-mock-a-<slug>.v1`; seed files `src/lib/tutor/passages/seeds/<prefix>-mock-a.ts` exporting a `Passage[]`, registered in `store.ts` (import + spread — the `eda5c53a` ACT pattern).

### Global authoring guardrails (every content task, Tasks 3–11)

1. **loId/cedCode MUST be extracted from the bank, never guessed** (ACT round remapped 162 guessed codes). Inventory command per course:
   ```bash
   python3 - <<'EOF'
   import json, glob, collections
   COURSE = "<topicId>"   # e.g. ap-statistics
   pairs = collections.OrderedDict()
   for f in sorted(glob.glob(f"src/data/problem-bank/{COURSE}/*.json")):
       for it in json.load(open(f)):
           pairs.setdefault((it["loId"], it.get("cedCode","")), 0)
           pairs[(it["loId"], it.get("cedCode",""))] += 1
   for (lo, ced), n in pairs.items(): print(f"{lo}\t{ced}\t{n}")
   EOF
   ```
   Every authored item's `(loId, cedCode)` pair must appear in this inventory.
2. **Item shape** = `SeedableItem` (`scripts/seed-mock-form.ts:65-81`): `{ id, loId, topic: <topicId>, topicId: <topicId>, difficulty: 1|2|3|4, responseFormat, problemText, choices? (exactly 4 for AP MCQ), answer ('A'-'D' | 'see rubric' for FRQ), solutionText, passageId?, bankScope: 'mock', rubric? }`. Also carry `cedCode` per item (upserted by the seed script’s `$set`? No — it is NOT in the upsert; keep it in items.json anyway for provenance/lint parity with prior forms).
3. **FRQ rubric** = `{ parts: [{ criterionId, maxPoints, scoringCriteria, modelResponse }] }`; part points MUST sum to the exact task total in the course spec table (Task 2 adds a lint that enforces section totals vs. curve anchors). `scoringCriteria` = what earns the points (graders see only this + modelResponse + passage text); `modelResponse` = a full-credit exemplar for that part.
4. **KaTeX/currency:** `\$` for currency, `$...$` for math (`$3(2x+5)$`-style digit-leading math is fine — academy rich() handles it). Lint warns on raw `$<digit>`.
5. **Verifier-driven item-quality rules** (from SAT/ACT rounds): NO reorder items, NO "NO CHANGE"/bracket-convention items, NO intro-comma or comma-before-and ambiguity items, NO data-is/are items. Use blank-fill, semicolon-join boundaries, goal-anchored rhetorical questions. MCQ verify flakes can be value-vs-letter compares — re-run the failed item once before rewriting.
6. **No duplication of practice content:** before authoring, skim the course's practice-bank problemTexts (same inventory files) and avoid reusing scenarios/numbers; mock forms must feel fresh (negative-list recipe from the SAT round).
7. **Difficulty spread** roughly 20% d1 / 35% d2 / 30% d3 / 15% d4 across each MCQ section.
8. **Passages:** long shared stimulus → passage store (one `passageId` shared by its item set); short single-item stimulus (a data table, a 2-sentence scenario) → inline in `problemText` (markdown/KaTeX table). Multi-document packets (DBQ, synthesis, EBQ) are ONE compiled passage whose `fullText` contains `Document 1 (…attribution…)` / `Source A` headers — the mock pipeline supports only a single `passageId` per item. Original prose → `license: 'internal-original'`, `author: 'Evelyn (original)'`, `sourceUrl: 'internal:<prefix>-mock-a'`, `year: 2026`. Real historical texts (history DBQ/SAQ/RA docs) → canonical, well-known pre-1930 public-domain excerpts ONLY, `license: 'public-domain'`, real attribution — never paraphrase-from-memory presented as quotation (APWorld fabrication gotcha); if not certain of near-verbatim accuracy, use a different canonical text or author an original clearly-fictional document instead.
9. **Fan-out authoring:** dispatch parallel subagents in batches of ~20-25 MCQs; FRQs + their passages authored by one dedicated subagent per course (rubric coherence). Give every subagent: the course spec table from its task, the LO inventory, guardrails 1–8, and the SeedableItem shape.
10. **Seed-script verification is the gate:** every MCQ must survive a fresh-context Sonnet solve; FRQs are gated on rubric-points-sum only — so FRQ quality relies on authoring + task review. Verify commands run from the engine repo root and need `ANTHROPIC_API_KEY` (in `.env.local`).

### AP course spec table (locked; source: current CED digital-exam formats, spec §4.1)

| Course | Sections (id · items · min) | Break after | Tools (desmos) | MCQ/FRQ weights | FRQ point totals | cutPoints [2,3,4,5] |
|---|---|---|---|---|---|---|
| ap-statistics | mcq · 40 · 90 → frq · 6 · 90 | mcq +10 | both sections | .5/.5 | 6×4 = 24 | .25 .39 .53 .67 |
| ap-calculus-bc | mcq-nocalc · 30 · 60 → mcq-calc · 15 · 45 → frq-calc · 2 · 30 → frq-nocalc · 4 · 60 | mcq-calc +10 | mcq-calc, frq-calc | .5/.5 | 6×9 = 54 | .25 .36 .49 .63 |
| ap-macroeconomics | mcq · 60 · 70 → frq · 3 · 60 | mcq +10 | both | .6667/.3333 | 10+5+5 = 20 | .29 .44 .57 .71 |
| ap-psychology | mcq · 75 · 90 → frq · 2 · 70 | mcq +10 | none | .6667/.3333 | AAQ 7 + EBQ 7 = 14 | .31 .45 .60 .73 |
| ap-environmental-science | mcq · 80 · 90 → frq · 3 · 70 | mcq +10 | both | .6/.4 | 3×10 = 30 | .31 .45 .58 .72 |
| ap-english-language | mcq · 45 · 60 → frq · 3 · 135 | mcq +10 | none | .45/.55 | 3×6 = 18 | .36 .50 .62 .74 |
| ap-us-history | mcq · 55 · 55 → saq · 3 · 40 → dbq · 1 · 60 → leq · 1 · 40 | saq +10 | none | .4/.6 | SAQ 3×3, DBQ 7, LEQ 6 = 22 | .28 .42 .55 .68 |
| ap-world-history | (same shape as ap-us-history) | saq +10 | none | .4/.6 | 22 | .28 .42 .56 .70 |
| ap-us-government | mcq · 55 · 80 → frq · 4 · 100 | mcq +10 | none | .5/.5 | 3+4+4+6 = 17 | .31 .44 .59 .73 |

Known v1 approximations (document, don't "fix"): engine weights FRQ tasks by rubric points, so APUSH/World effective weights are SAQ 24.5% / DBQ 19.1% / LEQ 16.4% (real 20/25/15) and APGov FRQs 8.8–17.6% (real 12.5 each); LEQ/SAQ offer no prompt choice; `referenceSheet: false` everywhere (SAT-sheet wiring deferred — Stats/Calc formula sheets are a follow-up); cutPoints and 1–5 section subscores are product approximations like the SAT/ACT curves.

---

### Task 1: AP blueprints ×9 (`blueprints/ap.ts`)

**Files:**
- Create: `src/lib/tutor/mock-exam/blueprints/ap.ts`
- Modify: `src/lib/tutor/mock-exam/blueprints/index.ts` (imports + registry entries)
- Test: `src/lib/tutor/mock-exam/blueprints/blueprints.test.ts`

**Interfaces:**
- Consumes: `ExamBlueprint`, `CurveAnchor` from `./types`; registry pattern from `./index.ts`.
- Produces: `AP_BLUEPRINTS: ExamBlueprint[]` (all 9, examKeys = topicIds above), `apSectionCurve(rawMax, cutPoints): CurveAnchor[]` (exported for tests). Every later task's `form.json` `examKey` resolves through `getBlueprint`.

- [ ] **Step 1: Write the failing tests** — append to `blueprints.test.ts` before the final `console.log`:

```ts
  const AP_SPECS: Array<{ key: string; sections: Array<[string, number, number]>; mcqWeight: number; frqMax: number }> = [
    { key: 'ap-statistics', sections: [['mcq', 40, 90], ['frq', 6, 90]], mcqWeight: 0.5, frqMax: 24 },
    { key: 'ap-calculus-bc', sections: [['mcq-nocalc', 30, 60], ['mcq-calc', 15, 45], ['frq-calc', 2, 30], ['frq-nocalc', 4, 60]], mcqWeight: 0.5, frqMax: 54 },
    { key: 'ap-macroeconomics', sections: [['mcq', 60, 70], ['frq', 3, 60]], mcqWeight: 2 / 3, frqMax: 20 },
    { key: 'ap-psychology', sections: [['mcq', 75, 90], ['frq', 2, 70]], mcqWeight: 2 / 3, frqMax: 14 },
    { key: 'ap-environmental-science', sections: [['mcq', 80, 90], ['frq', 3, 70]], mcqWeight: 0.6, frqMax: 30 },
    { key: 'ap-english-language', sections: [['mcq', 45, 60], ['frq', 3, 135]], mcqWeight: 0.45, frqMax: 18 },
    { key: 'ap-us-history', sections: [['mcq', 55, 55], ['saq', 3, 40], ['dbq', 1, 60], ['leq', 1, 40]], mcqWeight: 0.4, frqMax: 22 },
    { key: 'ap-world-history', sections: [['mcq', 55, 55], ['saq', 3, 40], ['dbq', 1, 60], ['leq', 1, 40]], mcqWeight: 0.4, frqMax: 22 },
    { key: 'ap-us-government', sections: [['mcq', 55, 80], ['frq', 4, 100]], mcqWeight: 0.5, frqMax: 17 },
  ];
  for (const spec of AP_SPECS) {
    await test(`${spec.key} blueprint: sections, counts, ap spec, validates clean`, () => {
      const bp = getBlueprint(spec.key);
      assert.equal(bp.examType, 'ap');
      assert.deepEqual(bp.sections.map((s) => s.sectionId), spec.sections.map((x) => x[0]));
      assert.deepEqual(bp.sections.map((s) => s.modules.length), spec.sections.map(() => 1));
      assert.deepEqual(bp.sections.map((s) => s.modules[0].questionCount), spec.sections.map((x) => x[1]));
      assert.deepEqual(bp.sections.map((s) => s.modules[0].timeLimitMin), spec.sections.map((x) => x[2]));
      assert.equal(bp.scoring.kind, 'ap-composite');
      assert.ok(bp.scoring.ap);
      assert.ok(Math.abs(bp.scoring.ap!.mcqWeight - spec.mcqWeight) < 1e-9);
      assert.ok(Math.abs(bp.scoring.ap!.mcqWeight + bp.scoring.ap!.frqWeight - 1) < 1e-9);
      assert.equal(bp.scoring.compositeMax, 5);
      // FRQ sections' curve tops out at the locked rubric-point total.
      const frqSections = bp.sections.filter((s) => s.sectionId.startsWith('frq') || ['saq', 'dbq', 'leq'].includes(s.sectionId));
      const frqRawMax = frqSections.reduce((sum, s) => {
        const anchors = bp.scoring.curves[s.sectionId].default;
        return sum + anchors[anchors.length - 1][0];
      }, 0);
      assert.equal(frqRawMax, spec.frqMax);
      // Exactly one 10-min break, before the last FRQ block begins.
      assert.equal(bp.sections.filter((s) => s.breakAfterMin).length, 1);
      assert.deepEqual(validateBlueprint(bp), []);
    });
  }
```

- [ ] **Step 2: Run to verify failure** — `npx tsx src/lib/tutor/mock-exam/blueprints/blueprints.test.ts` → the 9 new tests FAIL with `Unknown exam blueprint: ap-statistics` etc. (existing tests still pass).

- [ ] **Step 3: Implement `ap.ts`** (complete file):

```ts
import type { CurveAnchor, ExamBlueprint } from './types';

/**
 * All 9 AP-course blueprints. Section = separately-timed exam part (the
 * service serves exactly one module per non-adaptive section, so every real
 * timed part gets its own section). Composite = ap-composite weighted
 * MCQ/FRQ fractions -> 1-5 cut points; per-section "scaled" is a 1-5
 * subscore derived from the same cut fractions (display only).
 * v1 approximations: FRQ tasks weight by rubric points (not official task
 * weights); no LEQ/SAQ prompt choice; referenceSheet false (SAT-sheet only).
 */

const NO_CALC = { desmos: false, referenceSheet: false, eliminator: true, highlighter: true };
const CALC = { desmos: true, referenceSheet: false, eliminator: true, highlighter: true };

/** 1-5 section curve from the composite cut fractions: raw 0 -> 1, each cut
 *  fraction of rawMax -> that score, rawMax -> 5. X-collisions from rounding
 *  on small rawMax are bumped up to keep anchors strictly increasing. */
export function apSectionCurve(rawMax: number, cutPoints: [number, number, number, number]): CurveAnchor[] {
  const anchors: CurveAnchor[] = [[0, 1]];
  cutPoints.forEach((c, i) => {
    let x = Math.round(c * rawMax);
    if (x <= anchors[anchors.length - 1][0]) x = anchors[anchors.length - 1][0] + 1;
    anchors.push([x, i + 2]);
  });
  const last = anchors[anchors.length - 1];
  if (last[0] < rawMax) anchors.push([rawMax, 5]);
  else last[0] = rawMax; // cut-5 landed on rawMax; cap there
  return anchors;
}

type SectionSpec = {
  sectionId: string;
  label: string;
  count: number;
  min: number;
  tools: typeof NO_CALC;
  breakAfterMin?: number;
  /** FRQ sections: raw max = locked rubric point total, not question count. */
  rawMax?: number;
};

function apBlueprint(cfg: {
  examKey: string;
  label: string;
  sections: SectionSpec[];
  mcqWeight: number;
  cutPoints: [number, number, number, number];
}): ExamBlueprint {
  return {
    examKey: cfg.examKey,
    examType: 'ap',
    label: cfg.label,
    sections: cfg.sections.map((s) => ({
      sectionId: s.sectionId,
      label: s.label,
      tools: s.tools,
      ...(s.breakAfterMin ? { breakAfterMin: s.breakAfterMin } : {}),
      modules: [{ moduleId: 'main', label: s.label, questionCount: s.count, timeLimitMin: s.min }],
    })),
    scoring: {
      kind: 'ap-composite',
      sectionScaledMin: 1,
      sectionScaledMax: 5,
      compositeMin: 1,
      compositeMax: 5,
      curves: Object.fromEntries(
        cfg.sections.map((s) => [s.sectionId, { default: apSectionCurve(s.rawMax ?? s.count, cfg.cutPoints) }])
      ),
      ap: {
        mcqWeight: cfg.mcqWeight,
        frqWeight: 1 - cfg.mcqWeight,
        cutPoints: cfg.cutPoints,
      },
    },
  };
}

export const AP_BLUEPRINTS: ExamBlueprint[] = [
  apBlueprint({
    examKey: 'ap-statistics', label: 'AP Statistics',
    mcqWeight: 0.5, cutPoints: [0.25, 0.39, 0.53, 0.67],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 40, min: 90, tools: CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 6, min: 90, tools: CALC, rawMax: 24 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-calculus-bc', label: 'AP Calculus BC',
    mcqWeight: 0.5, cutPoints: [0.25, 0.36, 0.49, 0.63],
    sections: [
      { sectionId: 'mcq-nocalc', label: 'Section I, Part A: MCQ (No Calculator)', count: 30, min: 60, tools: NO_CALC },
      { sectionId: 'mcq-calc', label: 'Section I, Part B: MCQ (Calculator)', count: 15, min: 45, tools: CALC, breakAfterMin: 10 },
      { sectionId: 'frq-calc', label: 'Section II, Part A: FRQ (Calculator)', count: 2, min: 30, tools: CALC, rawMax: 18 },
      { sectionId: 'frq-nocalc', label: 'Section II, Part B: FRQ (No Calculator)', count: 4, min: 60, tools: NO_CALC, rawMax: 36 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-macroeconomics', label: 'AP Macroeconomics',
    mcqWeight: 2 / 3, cutPoints: [0.29, 0.44, 0.57, 0.71],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 60, min: 70, tools: CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 3, min: 60, tools: CALC, rawMax: 20 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-psychology', label: 'AP Psychology',
    mcqWeight: 2 / 3, cutPoints: [0.31, 0.45, 0.6, 0.73],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 75, min: 90, tools: NO_CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: AAQ + EBQ', count: 2, min: 70, tools: NO_CALC, rawMax: 14 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-environmental-science', label: 'AP Environmental Science',
    mcqWeight: 0.6, cutPoints: [0.31, 0.45, 0.58, 0.72],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 80, min: 90, tools: CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 3, min: 70, tools: CALC, rawMax: 30 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-english-language', label: 'AP English Language and Composition',
    mcqWeight: 0.45, cutPoints: [0.36, 0.5, 0.62, 0.74],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 45, min: 60, tools: NO_CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 3, min: 135, tools: NO_CALC, rawMax: 18 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-us-history', label: 'AP U.S. History',
    mcqWeight: 0.4, cutPoints: [0.28, 0.42, 0.55, 0.68],
    sections: [
      { sectionId: 'mcq', label: 'Section I, Part A: Multiple Choice', count: 55, min: 55, tools: NO_CALC },
      { sectionId: 'saq', label: 'Section I, Part B: Short Answer', count: 3, min: 40, tools: NO_CALC, breakAfterMin: 10, rawMax: 9 },
      { sectionId: 'dbq', label: 'Section II: Document-Based Question', count: 1, min: 60, tools: NO_CALC, rawMax: 7 },
      { sectionId: 'leq', label: 'Section II: Long Essay', count: 1, min: 40, tools: NO_CALC, rawMax: 6 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-world-history', label: 'AP World History: Modern',
    mcqWeight: 0.4, cutPoints: [0.28, 0.42, 0.56, 0.7],
    sections: [
      { sectionId: 'mcq', label: 'Section I, Part A: Multiple Choice', count: 55, min: 55, tools: NO_CALC },
      { sectionId: 'saq', label: 'Section I, Part B: Short Answer', count: 3, min: 40, tools: NO_CALC, breakAfterMin: 10, rawMax: 9 },
      { sectionId: 'dbq', label: 'Section II: Document-Based Question', count: 1, min: 60, tools: NO_CALC, rawMax: 7 },
      { sectionId: 'leq', label: 'Section II: Long Essay', count: 1, min: 40, tools: NO_CALC, rawMax: 6 },
    ],
  }),
  apBlueprint({
    examKey: 'ap-us-government', label: 'AP U.S. Government and Politics',
    mcqWeight: 0.5, cutPoints: [0.31, 0.44, 0.59, 0.73],
    sections: [
      { sectionId: 'mcq', label: 'Section I: Multiple Choice', count: 55, min: 80, tools: NO_CALC, breakAfterMin: 10 },
      { sectionId: 'frq', label: 'Section II: Free Response', count: 4, min: 100, tools: NO_CALC, rawMax: 17 },
    ],
  }),
];
```

- [ ] **Step 4: Register in `index.ts`** — add import and spread:

```ts
import { AP_BLUEPRINTS } from './ap';
// ...
const REGISTRY: Record<string, ExamBlueprint> = {
  [FIXTURE_BLUEPRINT.examKey]: FIXTURE_BLUEPRINT,
  [DIGITAL_SAT_BLUEPRINT.examKey]: DIGITAL_SAT_BLUEPRINT,
  [ACT_BLUEPRINT.examKey]: ACT_BLUEPRINT,
  ...Object.fromEntries(AP_BLUEPRINTS.map((bp) => [bp.examKey, bp])),
};
```

- [ ] **Step 5: Run tests** — `npx tsx src/lib/tutor/mock-exam/blueprints/blueprints.test.ts` → all pass. Also `npm run test:mock-scoring && npm run test:mock-service && npm run test:mock-report` → unchanged, green. `npx tsc --noEmit` clean for touched files.

- [ ] **Step 6: Commit** — `git add src/lib/tutor/mock-exam/blueprints/ && git commit -m "feat(mock): 9 AP exam blueprints (ap-composite, 1-5 section subscores)"`

---

### Task 2: AP scoring golden test + FRQ-points lint guard

**Files:**
- Modify: `src/lib/tutor/mock-exam/scoring.test.ts`
- Modify: `scripts/seed-mock-form.ts` (lintForm)

**Interfaces:**
- Consumes: `getBlueprint('ap-us-history')`, `applyCurves`, `scoreMcqSections` (existing signatures).
- Produces: lint error `"<sectionId>: FRQ rubric points sum X != blueprint curve rawMax Y"` — content tasks rely on this to catch rubric-total drift.

- [ ] **Step 1: Failing golden test** — append to `scoring.test.ts`:

```ts
  await test('ap-us-history golden: 40/55 MCQ + 15/22 FRQ points -> composite 5', () => {
    const bp = getBlueprint('ap-us-history');
    const rawSections = [
      { sectionId: 'mcq', rawCorrect: 40, rawTotal: 55 },
      { sectionId: 'saq', rawCorrect: 0, rawTotal: 0 },
      { sectionId: 'dbq', rawCorrect: 0, rawTotal: 0 },
      { sectionId: 'leq', rawCorrect: 0, rawTotal: 0 },
    ];
    const frq = {
      saq: { points: 6, max: 9 },
      dbq: { points: 5, max: 7 },
      leq: { points: 4, max: 6 },
    };
    const { scaled, composite } = applyCurves(bp, rawSections, [], frq);
    // weighted = .4*(40/55) + .6*(15/22) = 0.7 >= cut-5 0.68
    assert.equal(composite, 5);
    assert.equal(scaled.compositeMax, 5);
    const mcq = scaled.sections.find((s) => s.sectionId === 'mcq')!;
    assert.ok(mcq.scaled >= 1 && mcq.scaled <= 5);
  });
```
(add `getBlueprint` to the imports from `./blueprints` — `import { getBlueprint } from './blueprints';`)

- [ ] **Step 2: Run** — `npm run test:mock-scoring` → new test FAILS (`Unknown exam blueprint`) if Task 1 not merged, else passes immediately; if it passes, verify the assertion is real by temporarily flipping `assert.equal(composite, 5)` to `4` (must fail), then restore.

- [ ] **Step 3: Lint guard** — in `scripts/seed-mock-form.ts` `lintForm`, after the reverse walk (after line ~264), add:

```ts
  // ap-composite: each FRQ-bearing section's rubric-point total must equal the
  // curve's final-anchor rawMax, or composite/section scoring silently drifts.
  if (bp.scoring.kind === 'ap-composite') {
    for (const sec of form.sections) {
      const anchors = bp.scoring.curves[sec.sectionId]?.default ?? [];
      if (!anchors.length) continue;
      const sectionItems = sec.modules.flatMap((m) => m.itemIds).map((id) => itemsById.get(id)).filter(Boolean) as SeedableItem[];
      const frqItems = sectionItems.filter((it) => it.responseFormat === 'frq');
      if (!frqItems.length) continue;
      const rubricSum = frqItems.reduce(
        (s, it) => s + (it.rubric?.parts ?? []).reduce((p, part) => p + (part.maxPoints || 0), 0), 0);
      const curveMax = anchors[anchors.length - 1][0];
      if (rubricSum !== curveMax) {
        errors.push(`${sec.sectionId}: FRQ rubric points sum ${rubricSum} != blueprint curve rawMax ${curveMax}`);
      }
    }
  }
```

- [ ] **Step 4: Verify guard fires** — `npm run seed:mock-form -- --form=fixture-form-a --lint-only` still passes (fixture is `scaled-sections`); sanity: `npm run test:portal-mock` green.

- [ ] **Step 5: Commit** — `git add src/lib/tutor/mock-exam/scoring.test.ts scripts/seed-mock-form.ts && git commit -m "test(mock): AP composite golden + FRQ rubric-total lint guard"`

---

### Tasks 3–11: author one form per course

Each task follows the same recipe (guardrails + spec table above are part of every task). Deliverable per task: `src/data/mock-forms/<formId>/{form.json,items.json}` (+ passage seeds where listed), lint clean, committed. **Do NOT seed to Mongo in these tasks** — Task 12 does the verified prod seeding in one sweep.

**Per-task steps (identical mechanics, course-specific spec below):**

- [ ] **Step 1:** Run the LO/cedCode inventory command (guardrail 1) for the course; save to the scratchpad as the authoring reference.
- [ ] **Step 2:** Author passages (if the course lists any) as `src/lib/tutor/passages/seeds/<prefix>-mock-a.ts` exporting `const <PREFIX>_MOCK_A_PASSAGES: Passage[]`; register in `store.ts` (import at top + spread into `SEED_PASSAGES`). Run `npx tsx src/lib/tutor/passages/store.test.ts` → green.
- [ ] **Step 3:** Fan out MCQ authoring subagents (batches ≤25) + one FRQ/rubric subagent per guardrail 9; assemble `items.json` (MCQs in exam order, then FRQs) and `form.json` (`{ formId, examKey: <topicId>, topicIds: [<topicId>], label, sections }` — sections/moduleIds exactly matching the blueprint: every module `moduleId: 'main'`, itemIds count = blueprint questionCount).
- [ ] **Step 4:** `npm run seed:mock-form -- --form=<formId> --lint-only` → `0 error(s)`. Fix anything it flags (including the Task-2 FRQ-points guard).
- [ ] **Step 5:** Self-review pass: read every FRQ rubric end-to-end (grader sees ONLY scoringCriteria/modelResponse/passage); spot-check 10 random MCQs for key correctness and guardrail-5 violations.
- [ ] **Step 6:** Commit — `git add src/data/mock-forms/<formId> src/lib/tutor/passages/ && git commit -m "feat(mock): <label> Form A — <n> items"`

**Task 3 — ap-statistics-form-a** (46 items, no passages).
MCQ unit spread (bank units u1–u9): 6/3/5/6/4/6/6/2/2. FRQs (`frq` section, 4 pts each, parts a/b/c with point splits): fr-01 exploring one/two-variable data; fr-02 sampling/experimental design; fr-03 probability/random variables; fr-04 sampling distributions or proportion inference; fr-05 means/slope inference; fr-06 investigative task (novel context combining ≥2 areas). Inline any data tables in `problemText`. Currency/percent per guardrail 4.

**Task 4 — ap-calculus-bc-form-a** (51 items, no passages).
MCQ spread u1–u10: 4/4/4/3/4/8/3/6/4/5; mc-001..030 → `mcq-nocalc` (must be hand-solvable), mc-031..045 → `mcq-calc` (calculator-active: numeric answers from graphs/integrals). FRQs 9 pts each, parts a–d: fr-01/02 (`frq-calc`): rate-in/rate-out accumulation; parametric/polar motion. fr-03..06 (`frq-nocalc`): series (Taylor/convergence), differential equation w/ slope-field description, area/volume, analysis of f/f′/f″. All math in `$...$` KaTeX.

**Task 5 — ap-macroeconomics-form-a** (63 items, no passages).
MCQ spread u1–u6: 8/15/15/12/7/3. FRQs: fr-01 long (10 pts, parts a–e: AD-AS shock → policy → graphs described in words → open-economy link); fr-02 (5 pts) money market/banking; fr-03 (5 pts) Phillips curve or FX market. Graph-drawing parts become "describe/state" parts (typed responses). `\$` for all currency figures.

**Task 6 — ap-psychology-form-a** (77 items, 2 passages).
MCQ spread u1–u5 (bank u0 science-practice LOs may be used within any unit's items): 15/17/15/13/15. Passages: `appsych-mock-a-aaq` (one original ~350-word research-study summary: method, variables, measures, results incl. one descriptive statistic) and `appsych-mock-a-ebq` (packet of THREE original study summaries labeled Source A/B/C on one theme), both `internal-original`, genre `informational`. FRQs: fr-01 AAQ (7 pts, parts per 2025 CED: research method; operational definition/variables; statistic interpretation; generalizability; ethics; two evaluation parts — 7 × 1 pt); fr-02 EBQ (7 pts: claim 1; evidence from two different sources 2×2; reasoning linking evidence 2 — parts summing 7). Both items carry the matching `passageId`.

**Task 7 — ap-environmental-science-form-a** (83 items, no passages).
MCQ spread u1–u9: 9/8/9/8/10/9/8/9/10 (inline data tables/graph descriptions where needed). FRQs 10 pts each, parts a–(e) with point splits: fr-01 design an investigation (scenario-based); fr-02 analyze an environmental problem + propose solution; fr-03 analyze a problem WITH calculations (energy/pollution math, show-work parts; calculator allowed).

**Task 8 — ap-english-language-form-a** (48 items, 7 passages).
Passages (all `internal-original` originals, seeds file `apenglang-mock-a.ts`): 5 MCQ passages (~450-650 words: 3 reading-analysis nonfiction/essay + 2 writing-revision drafts with numbered sentences), `apenglang-mock-a-rc1..3`, `-wr1..2`; RA stimulus `apenglang-mock-a-ra` (period-style public address by a clearly fictional speaker, or a canonical pre-1930 PD speech per guardrail 8); synthesis packet `apenglang-mock-a-syn` (SIX short sources labeled Source A–F incl. one described table/graphic, on one contemporary issue). MCQ: 23 reading + 22 writing items across the 5 passages (passageId shared per set; guardrail-5 item types only). FRQs 6 pts each (thesis 1 / evidence+commentary 4 / sophistication 1): fr-01 synthesis (cite ≥3 sources; `passageId` = syn packet), fr-02 rhetorical analysis (`passageId` = ra), fr-03 argument (no passage).

**Task 9 — ap-us-history-form-a** (60 items, passages: MCQ stimulus set + SAQ stimuli + DBQ packet).
MCQ spread periods 1–9: 3/5/7/6/7/7/8/7/5, organized as ~14 stimulus sets of 3-5 questions; each set's stimulus = one passage (seeds `apush-mock-a.ts`): canonical PD excerpts (speeches, letters, laws) per guardrail 8, or described tables/maps (`internal-original`, genre `document`/`informational`). SAQs (3 pts, parts a/b/c × 1): saq-1 with secondary-source-style stimulus passage, saq-2 with primary PD stimulus, saq-3 no stimulus. DBQ (7 pts: thesis 1 / context 1 / doc evidence 2 / outside evidence 1 / sourcing 1 / complexity 1 — mirror `ap-apush-u4-dbq-practice.ts` rubric structure): ONE compiled packet passage `evelyn.passage.apush-mock-a-dbq-packet.v1` containing `Document 1 (attribution)` … `Document 7`, on a single prompt-able theme; prefer canonical PD texts, described visuals allowed as documents. LEQ (6 pts: thesis 1 / context 1 / evidence 2 / analysis 1 / complexity 1), single prompt, no stimulus. FRQ item IDs fr-01..03 (saq), fr-04 (dbq), fr-05 (leq); form sections `saq`/`dbq`/`leq` reference them.

**Task 10 — ap-world-history-form-a** (60 items, same structure as Task 9 with `apworld` prefix/inventory).
MCQ spread u1–u9: 5/5/6/6/7/7/7/7/5, stimulus sets as in Task 9 (global sources — guardrail 8 verbatim rule is CRITICAL here; the APWorld fabrication catch happened in this course). SAQ/DBQ/LEQ identical mechanics: DBQ packet `evelyn.passage.apworld-mock-a-dbq-packet.v1` (7 documents), rubrics identical point structures.

**Task 11 — ap-us-government-form-a** (59 items, 1-2 passages).
MCQ spread u1–u5: 9/16/14/8/8 (quant items inline small data tables; a shared foundational-document excerpt set may use one PD passage, e.g. Federalist excerpt). FRQs: fr-01 concept application (3 pts a/b/c, scenario inline); fr-02 quantitative analysis (4 pts: identify 1 / describe data 1 / draw conclusion 1 / link to course concept 1; table inline); fr-03 SCOTUS comparison (4 pts; names a required case — provide non-required case facts inline); fr-04 argument essay (6 pts: thesis 1 / evidence 3 (≥2 foundational docs) / reasoning 1 / alternative perspective 1).

---

### Task 12: academy ScoreReport FRQ-section polish

**Files:**
- Modify: `/Users/luke/Dev/academy/apps/web/components/mock/ScoreReport.tsx` (~lines 191-220)

**Interfaces:** none new — `report.sections[].rawTotal === 0` marks FRQ-only sections (MCQ raw tally is 0/0; their credit arrives via `frqGrades`).

- [ ] **Step 1:** In the `report.sections.map` block, wherever `"{sec.rawCorrect} / {sec.rawTotal} correct"` renders, guard it: when `sec.rawTotal === 0` render `Free response — see task scores below` (muted text) instead of `0 / 0 correct` (both render sites, lines ~213 and ~218).
- [ ] **Step 2:** `cd /Users/luke/Dev/academy && npx vitest run tests/unit --silent` (or the repo's standard unit suite) → green; `npx tsc --noEmit -p apps/web` clean.
- [ ] **Step 3:** Commit in academy: `git add apps/web/components/mock/ScoreReport.tsx && git commit -m "fix(mock): FRQ-only sections show task-score pointer, not 0/0 correct"`

---

### Task 13: full-suite gate, prod DRAFT seeding, push, handoff

**Files:** none new (runs commands; updates memory + handoff notes).

- [ ] **Step 1: Engine suites** — `npm run test:mock-blueprints && npm run test:mock-scoring && npm run test:mock-service && npm run test:mock-report && npm run test:portal-mock` → all green. `npx tsc --noEmit` clean.
- [ ] **Step 2: Lint all 9 forms** — for each formId: `npm run seed:mock-form -- --form=<formId> --lint-only` → 0 errors.
- [ ] **Step 3: Record practice-visible baseline** (prod tunnel must be up): for each of the 9 topicIds, count practice-visible items — run a small tsx script using `ProblemBank.countDocuments({ topicId, bankScope: { $ne: 'mock' } })` — save the 9 counts.
- [ ] **Step 4: Seed each form to prod as DRAFT with full Sonnet verify** — `npm run seed:mock-form -- --form=<formId>` (NO `--go-live`). Expect `Verify: N/N passed`; for each MISMATCH: re-run once (flake rule), then fix the item and re-seed. Repeat until every form seeds with all items verified, `status='draft'`.
- [ ] **Step 5: Re-run the Step-3 counts** — all 9 practice-visible counts UNCHANGED (bankScope guard holds).
- [ ] **Step 6: Push** — engine: `git push` (main). Academy: push Task-12 commit.
- [ ] **Step 7: Engine deploy** — `./deploy-update.sh` (blueprints must exist on the server before any live flip); verify tutor 200 + mock routes respond 401-unsigned.
- [ ] **Step 8: Handoff notes** (memory update + final message): user eyeballs a form (e.g. `ap-statistics-form-a` via test account once flipped); live-flip command per form: direct Mongo status flip with all-items-verified guard (the SAT-B/C precedent) or `npm run seed:mock-form -- --form=<formId> --go-live` (re-verifies). Marketing at live-flip (feedback rule `marketing-stats-sync`): extend the `isTestPrep`-gated "Full-length timed practice tests included" line in `academy/apps/web/app/(marketing)/courses/[exam]/[courseKey]/page.tsx:98-102` to AP courses IN THE SAME DROP as the flips, then `./deploy-crimsora.sh`.

## Self-review notes

- Spec coverage: blueprints ×9 (spec §4.1 AP row) → Task 1; content forms (spec §3 Workstream 2, one form per AP course) → Tasks 3–11; form-lint/live-gate (spec §9) → Tasks 2+13; progressive-drop draft gating (spec §4.2) → Task 13; FRQ grading reuse (spec §4.3/5.3) → rubric shapes locked to contract `FrqRubric`. Workstream 3 (tutor CTA, email) explicitly out of scope this round.
- Curve helper collision guard: `apSectionCurve(7, …)` → `[[0,1],[2,2],[3,3],[4,4],[5,5],[7,5]]` monotone ✓; `apSectionCurve(6, [.28,.42,.55,.68])` → x = 2,3,3→bump 4,4→bump 5, +[6,5] ✓.
- Type consistency: `SectionSpec.rawMax` drives both curve rawMax and the Task-2 lint guard; blueprint test derives `frqMax` from curve last anchors — all three agree with the spec table.
