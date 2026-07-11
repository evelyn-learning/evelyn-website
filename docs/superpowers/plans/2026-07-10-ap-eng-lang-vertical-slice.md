# AP English Language Vertical Slice — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build reusable stimulus-passage infrastructure and a complete Unit-1 vertical slice of AP English Language & Composition (all six content components), so the essay/passage approach can be validated live before fanning out to Units 2–9.

**Architecture:** A standalone `Passage` seed-registry (mirroring the topic-notes/lesson-plan stores) that plans, `try_yourself` segments, and ProblemBank items reference by `passageId`. The rubric grader is made passage-aware so it can verify cited evidence. Then Unit-1 content is authored on top: 3–4 public-domain passages, ~5–6 lesson plans, notes baselines, 2 passage-grouped MCQ sets, 6-point AP Lang rubrics, and a published academy course.

**Tech Stack:** TypeScript, Next.js (engine repo), Mongo (ProblemBank + academy_portal), `@evelyn/portal-contract/v1` (FrqRubric/grading types), ts-node test scripts (node:assert harness), esbuild-based academy `gen-seed.mjs`.

**Spec:** `docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md`

## Global Constraints

- **Passages public-domain only** — every `Passage.license === 'public-domain'`; pre-1929 sources (Wikisource/Gutenberg/archives). No copyrighted text anywhere.
- **Rubric scale = authentic AP Lang 6-point, integer** — Thesis 1 + Evidence & Commentary 4 + Sophistication 1 = 6. NOT the STEM 9-point convention. Every `FrqRubricPart` keeps required `scoringCriteria` + `modelResponse`.
- **Plan ID scheme:** `evelyn.ap.englang.<slug>.v1`; files `ap-englang-u1-<slug>.ts`; LO ids `apenglang.<slug>`; `subject: 'ela'`; `curriculum: 'AP'`; `metadata.cedUnit: 1`.
- **`baselineId === planId`** for every topic-notes baseline.
- **Additive schema changes only** — `passageId?`/`passageText?` are optional; absent → behavior identical to today. No existing course content changes.
- **Verify structurally, never by grep** — rubric presence/sums audited by walking `SEED_PLANS` segments (the word "rubric" appears in prose).
- **Isolated worktree** — all work in `.claude/worktrees/ap-eng-lang` on branch `eng-lang-vertical-slice` (off `origin/main`). Do NOT run the dev server on port 3001 (another session drives live tutor sessions).
- **Test harness pattern:** no framework — `node:assert` (strict) + a tiny `test()` counter harness with non-zero exit on failure, run via a `test:*` npm script (ts-node + tsconfig-paths). Stub any model `complete`/grader deps so no network call happens.

## File Structure

**Phase 0 — infrastructure (create):**
- `src/lib/tutor/passages/types.ts` — `Passage` interface.
- `src/lib/tutor/passages/store.ts` — `SEED_PASSAGES`, `passageById`, `resolvePassage`.
- `src/lib/tutor/passages/seeds/*.ts` — one file per passage.
- `src/lib/tutor/passages/store.test.ts` — resolver unit tests.
- `src/lib/tutor/portal/grade-free-response.test.ts` — passage-aware grader tests.
- `scripts/lint-passages.ts` — reference-integrity + license lint.

**Phase 0 — infrastructure (modify):**
- `src/lib/tutor/lesson-plan/types.ts` — add `passageId?` to `SegmentTryYourself` + `SegmentConcept`.
- `src/models/ProblemBank.ts` — add `passageId?` to schema.
- `scripts/seed-problem-bank.ts` — carry `passageId` through validation + upsert (SeedItem shape).
- `src/lib/tutor/portal/grade-free-response.ts` — thread `passageText` into `GradeItem`, `RubricPartGrader`, the rubric loop, and `defaultGradeDeps` prompt; bump `max_tokens` 600→1000.

**Phase 1 — content (create):**
- `src/lib/tutor/passages/seeds/ap-englang-*.ts` — 3–4 Unit-1 passages.
- `src/lib/tutor/lesson-plan/seeds/ap-englang-u1-*.ts` — ~5–6 plans + 1 frq-practice.
- `src/lib/tutor/topic-notes/seeds/ap-englang-u1-*.ts` — ~5 baselines.
- `src/data/problem-bank/ap-english-language/u1.json` — 2 MCQ sets.
- `src/data/problem-bank/ap-english-language/_AUTHORING.md` — per-LO cedCode table.

**Phase 1 — content (modify):**
- `src/lib/tutor/lesson-plan/store.ts` — register the new plans.
- `src/lib/tutor/topic-notes/store.ts` — register the new baselines.
- academy `tools/gen-seed.mjs` — new `buildCourse` block for AP English Language.

---

## PHASE 0 — PASSAGE INFRASTRUCTURE

### Task 1: Passage type + seed registry

**Files:**
- Create: `src/lib/tutor/passages/types.ts`
- Create: `src/lib/tutor/passages/seeds/douglass-fourth-of-july.ts`
- Create: `src/lib/tutor/passages/store.ts`
- Test: `src/lib/tutor/passages/store.test.ts`

**Interfaces:**
- Produces: `interface Passage`; `SEED_PASSAGES: Passage[]`; `passageById: Map<string, Passage>`; `resolvePassage(id: string): Passage | undefined`.

- [ ] **Step 1: Write the `Passage` type**

Create `src/lib/tutor/passages/types.ts`:

```ts
/**
 * A public-domain stimulus passage shared across a lesson plan, its topic
 * notes, a passage-grouped MCQ set, and/or an essay try-yourself. Referenced
 * by `passageId` from those consumers; resolved via passages/store.ts.
 */
export interface Passage {
  /** 'evelyn.passage.<slug>.v1' */
  id: string;
  title: string;
  author: string;
  /** Publication/delivery year (must be public-domain: pre-1929). */
  year: number;
  /** Canonical public-domain source (Wikisource/Gutenberg/archives). */
  sourceUrl: string;
  license: 'public-domain';
  genre: 'speech' | 'essay' | 'letter' | 'sermon' | 'pamphlet' | 'memoir';
  /** Paragraph-delimited full text (\n\n between paragraphs). AP-typical
   *  excerpt length ~600-800 words to keep grader prompts affordable. */
  fullText: string;
  /** AP passages are line-numbered for citation. */
  lineNumbered: boolean;
  wordCount: number;
}
```

- [ ] **Step 2: Write one seed passage**

Create `src/lib/tutor/passages/seeds/douglass-fourth-of-july.ts`. (Author the ~600-800 word public-domain excerpt in Task 5; for this infra task a short real excerpt is sufficient to make the store importable.)

```ts
import type { Passage } from '../types';

export const PASSAGE_DOUGLASS_FOURTH_OF_JULY: Passage = {
  id: 'evelyn.passage.douglass-fourth-of-july.v1',
  title: 'What to the Slave Is the Fourth of July?',
  author: 'Frederick Douglass',
  year: 1852,
  sourceUrl: 'https://en.wikisource.org/wiki/What_to_the_Slave_Is_the_Fourth_of_July%3F',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'Fellow-citizens, pardon me, allow me to ask, why am I called upon to speak here to-day? ' +
    'What have I, or those I represent, to do with your national independence?',
  lineNumbered: true,
  wordCount: 27,
};
```

- [ ] **Step 3: Write the store**

Create `src/lib/tutor/passages/store.ts`:

```ts
/**
 * Passage registry. Each passage is a seed module imported here and added to
 * SEED_PASSAGES. Resolve by id to render (show_annotated_passage) or to feed
 * the passage-aware grader. Mirrors topic-notes/store.ts.
 */
import type { Passage } from './types';
import { PASSAGE_DOUGLASS_FOURTH_OF_JULY } from './seeds/douglass-fourth-of-july';

export const SEED_PASSAGES: Passage[] = [
  PASSAGE_DOUGLASS_FOURTH_OF_JULY,
];

export const passageById = new Map<string, Passage>(
  SEED_PASSAGES.map((p) => [p.id, p]),
);

export function resolvePassage(id: string): Passage | undefined {
  return passageById.get(id);
}
```

- [ ] **Step 4: Write the failing test**

Create `src/lib/tutor/passages/store.test.ts` (follow the node:assert harness pattern from `src/lib/tutor/portal/extract-social-threads.test.ts`):

```ts
import { strict as assert } from 'node:assert';
import { SEED_PASSAGES, resolvePassage } from './store';

let passed = 0, failed = 0;
function test(name: string, fn: () => void): void {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

test('resolvePassage returns a seeded passage', () => {
  const p = resolvePassage('evelyn.passage.douglass-fourth-of-july.v1');
  assert.ok(p, 'expected passage to resolve');
  assert.equal(p!.author, 'Frederick Douglass');
  assert.equal(p!.license, 'public-domain');
});

test('resolvePassage returns undefined for unknown id', () => {
  assert.equal(resolvePassage('nope'), undefined);
});

test('all passages are public-domain with unique ids', () => {
  const ids = SEED_PASSAGES.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate passage ids');
  for (const p of SEED_PASSAGES) assert.equal(p.license, 'public-domain');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

Add an npm script to `package.json` mirroring the other `test:*` entries:

```json
"test:passages": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' src/lib/tutor/passages/store.test.ts",
```

- [ ] **Step 5: Run the test**

Run: `npm run test:passages`
Expected: `3 passed, 0 failed`

- [ ] **Step 6: Typecheck + commit**

Run: `npx tsc --noEmit` → 0 errors.
```bash
git add src/lib/tutor/passages package.json
git commit -m "feat(passages): Passage type + seed registry + resolver"
```

---

### Task 2: `passageId` references on segment + bank schemas

**Files:**
- Modify: `src/lib/tutor/lesson-plan/types.ts` (SegmentTryYourself, SegmentConcept)
- Modify: `src/models/ProblemBank.ts`
- Modify: `scripts/seed-problem-bank.ts` (SeedItem shape + upsert)

**Interfaces:**
- Produces: optional `passageId?: string` on `SegmentTryYourself`, `SegmentConcept`, the ProblemBank Mongoose schema, and the seed `SeedItem` type.

- [ ] **Step 1: Add `passageId?` to the two segment types**

In `src/lib/tutor/lesson-plan/types.ts`, inside `interface SegmentTryYourself` (after `choices?`), add:

```ts
  /** Optional shared stimulus passage this prompt analyzes (passages/store). */
  passageId?: string;
```

Inside `interface SegmentConcept` (after `references?`), add the same field with the same comment.

- [ ] **Step 2: Add `passageId?` to the ProblemBank model**

In `src/models/ProblemBank.ts`, add to the schema definition (near `cedCode`):

```ts
  passageId: { type: String, required: false },
```

and to the corresponding TS interface for a bank document:

```ts
  passageId?: string;
```

- [ ] **Step 3: Carry `passageId` through the seed script**

In `scripts/seed-problem-bank.ts`, find the `SeedItem` type and add `passageId?: string;`. In the upsert mapping (where each item's fields are written to Mongo), add `passageId: item.passageId`. No validation change needed (optional field).

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors (all additions optional; nothing else references them yet).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/lesson-plan/types.ts src/models/ProblemBank.ts scripts/seed-problem-bank.ts
git commit -m "feat(passages): optional passageId refs on segment + ProblemBank schemas"
```

---

### Task 3: Passage-aware rubric grading

**Files:**
- Modify: `src/lib/tutor/portal/grade-free-response.ts`
- Test: `src/lib/tutor/portal/grade-free-response.test.ts`

**Interfaces:**
- Consumes: `GradeItem`, `RubricPartGrader`, `gradeFreeResponse` (from Task 0 baseline / existing file).
- Produces: `GradeItem.passageText?: string`; `RubricPartGrader` args gain `passageText?: string`; `gradeFreeResponse` forwards `item.passageText` to each `gradeRubricPart` call.

- [ ] **Step 1: Write the failing test**

Create `src/lib/tutor/portal/grade-free-response.test.ts`:

```ts
import { strict as assert } from 'node:assert';
import { gradeFreeResponse, type GradeDeps, type GradeItem } from './grade-free-response';

let passed = 0, failed = 0;
function test(name: string, fn: () => Promise<void>): Promise<void> {
  return fn().then(() => { passed++; console.log(`  ok - ${name}`); })
             .catch((e) => { failed++; console.log(`  FAIL - ${name}`); console.error(e); });
}

const req = { itemId: 'x', response: { text: 'my essay' } } as any;

async function run() {
  await test('passageText is forwarded to gradeRubricPart', async () => {
    const seen: (string | undefined)[] = [];
    const deps: GradeDeps = {
      gradeRubricPart: async (a: any) => { seen.push(a.passageText); return { pointsAwarded: 1, feedback: 'ok' }; },
      judgeSingleAnswer: async () => ({ correct: true, feedback: 'ok' }),
    };
    const item: GradeItem = {
      itemId: 'x',
      passageText: 'DOUGLASS PASSAGE TEXT',
      rubric: { parts: [
        { criterionId: 'A', maxPoints: 1, scoringCriteria: 'thesis', modelResponse: 'm' },
      ] },
    };
    const res = await gradeFreeResponse(req, item, deps);
    assert.equal(res.maxPoints, 1);
    assert.deepEqual(seen, ['DOUGLASS PASSAGE TEXT']);
  });

  await test('absent passageText forwards undefined (back-compat)', async () => {
    let seen: string | undefined = 'sentinel';
    const deps: GradeDeps = {
      gradeRubricPart: async (a: any) => { seen = a.passageText; return { pointsAwarded: 2, feedback: 'ok' }; },
      judgeSingleAnswer: async () => ({ correct: true, feedback: 'ok' }),
    };
    const item: GradeItem = {
      itemId: 'x',
      rubric: { parts: [{ criterionId: 'A', maxPoints: 4, scoringCriteria: 'ev', modelResponse: 'm' }] },
    };
    await gradeFreeResponse(req, item, deps);
    assert.equal(seen, undefined);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
```

Add to `package.json`:

```json
"test:portal-grading-passage": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' src/lib/tutor/portal/grade-free-response.test.ts",
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:portal-grading-passage`
Expected: FAIL — `passageText` is not yet on `GradeItem`/`RubricPartGrader` (tsc error or `seen` mismatch).

- [ ] **Step 3: Thread `passageText` through the types + loop**

In `src/lib/tutor/portal/grade-free-response.ts`:

Add to `interface GradeItem` (after `modelResponse?`):
```ts
  /** Resolved stimulus text (from passageId) the response analyzes; when
   *  present it is given to each rubric-part grader so it can verify evidence. */
  passageText?: string;
```

Add to `RubricPartGrader` args type (after `response`):
```ts
  passageText?: string;
```

In `gradeFreeResponse`, in the rubric loop's `deps.gradeRubricPart({...})` call, add:
```ts
    passageText: item.passageText,
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:portal-grading-passage`
Expected: `2 passed, 0 failed`

- [ ] **Step 5: Make the real grader use the passage + bump max_tokens**

In the same file, in `defaultGradeDeps()`'s `gradeRubricPart` implementation:
- Change `max_tokens: 600` → `max_tokens: 1000`.
- In the prompt, when `args.passageText` is present, prepend a block:
```ts
      ...(args.passageText
        ? [`Stimulus the student analyzed (verify cited evidence against it):\n${args.passageText}`]
        : []),
```
(splice into the existing prompt-lines array before the criterion line).

- [ ] **Step 6: Typecheck + commit**

Run: `npx tsc --noEmit` → 0 errors.
```bash
git add src/lib/tutor/portal/grade-free-response.ts src/lib/tutor/portal/grade-free-response.test.ts package.json
git commit -m "feat(grading): passage-aware rubric grading (passageText) + wider feedback budget"
```

---

### Task 4: Passage reference-integrity lint

**Files:**
- Create: `scripts/lint-passages.ts`

**Interfaces:**
- Consumes: `SEED_PASSAGES` (Task 1), `SEED_PLANS` (lesson-plan/store), ProblemBank JSON under `src/data/problem-bank/`.

- [ ] **Step 1: Write the lint script**

Create `scripts/lint-passages.ts`:

```ts
/**
 * Passage lint: every passageId referenced by a plan segment or a bank item
 * must resolve in SEED_PASSAGES; passage ids unique; referenced passages
 * public-domain. Exits 1 on any error. Run in CI alongside lint-ap-plans.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SEED_PASSAGES, passageById } from '../src/lib/tutor/passages/store';
import { SEED_PLANS } from '../src/lib/tutor/lesson-plan/store';

const errors: string[] = [];

// unique ids
const ids = SEED_PASSAGES.map((p) => p.id);
for (const id of ids) if (ids.filter((x) => x === id).length > 1) errors.push(`duplicate passage id ${id}`);
for (const p of SEED_PASSAGES) if (p.license !== 'public-domain') errors.push(`passage ${p.id} not public-domain`);

// plan refs
for (const plan of SEED_PLANS) {
  for (const seg of plan.segments ?? []) {
    const pid = (seg as { passageId?: string }).passageId;
    if (pid && !passageById.has(pid)) errors.push(`plan ${plan.id} seg ${seg.id} → unknown passageId ${pid}`);
  }
}

// bank refs
const bankRoot = join(__dirname, '..', 'src', 'data', 'problem-bank');
if (existsSync(bankRoot)) {
  for (const course of readdirSync(bankRoot)) {
    const dir = join(bankRoot, course);
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      const items = JSON.parse(readFileSync(join(dir, f), 'utf8')) as Array<{ id: string; passageId?: string }>;
      for (const it of items) if (it.passageId && !passageById.has(it.passageId)) {
        errors.push(`bank ${course}/${f} item ${it.id} → unknown passageId ${it.passageId}`);
      }
    }
  }
}

if (errors.length === 0) { console.log(`✅ passages lint clean (${SEED_PASSAGES.length} passages)`); process.exit(0); }
console.log(`❌ ${errors.length} passage error(s):`);
for (const e of errors) console.log('  • ' + e);
process.exit(1);
```

Add to `package.json`:
```json
"lint:passages": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/lint-passages.ts",
```

- [ ] **Step 2: Run it**

Run: `npm run lint:passages`
Expected: `✅ passages lint clean (1 passages)`

- [ ] **Step 3: Commit**

```bash
git add scripts/lint-passages.ts package.json
git commit -m "feat(passages): reference-integrity + license lint"
```

---

## PHASE 1 — UNIT 1 CONTENT

> Content tasks are authored, not TDD; their "test" is the verification gate at the end of each task. Author original prose modeled on the spec's conventions and the gold reference files named in each task. Use parallel subagents for fan-out where noted, exactly as the parity build did.

### Task 5: Seed the Unit-1 passages

**Files:**
- Modify: `src/lib/tutor/passages/seeds/douglass-fourth-of-july.ts` (expand to full excerpt)
- Create: `src/lib/tutor/passages/seeds/henry-give-me-liberty.ts`
- Create: `src/lib/tutor/passages/seeds/woolf-excerpt.ts` (or Swift — a short public-domain essay excerpt)
- Modify: `src/lib/tutor/passages/store.ts` (register the two new passages)

- [ ] **Step 1: Author the excerpts.** For each passage, fetch the canonical public-domain text from its `sourceUrl` (Wikisource/Gutenberg), trim to a ~600–800-word rhetorically-rich excerpt, paragraph-delimit with `\n\n`, set an accurate `wordCount`, and confirm `year < 1929`. Expand the Douglass seed from Task 1 to the full excerpt.
- [ ] **Step 2: Register** the two new passages in `SEED_PASSAGES` in `store.ts` (import + array entry).
- [ ] **Step 3: Verify.** `npm run test:passages` (still passes, ids unique, all public-domain) and `npm run lint:passages` (clean, 3 passages). `npx tsc --noEmit` → 0 errors.
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/passages
git commit -m "content(eng-lang): 3 public-domain Unit-1 passages (Douglass, Henry, Woolf)"
```

---

### Task 6: Calibration lesson plan (rhetorical situation intro)

**Files:**
- Create: `src/lib/tutor/lesson-plan/seeds/ap-englang-u1-rhetorical-situation.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts` (register)

**Interfaces:**
- Consumes: `LessonPlan` type; `AP_PACING_THRESHOLDS`, `AP_SOURCE` from `./_ap-shared`.
- Produces: `SEED_AP_ENGLANG_U1_RHETORICAL_SITUATION` plan; LO `apenglang.rhetorical-situation`.

- [ ] **Step 1: Author the plan.** Model structure on an existing AP plan (e.g. `src/lib/tutor/lesson-plan/seeds/ap-macro-u1-scarcity.ts`) but with English semantics per spec §2: `hook`; `concept` (rhetorical situation — exigence/purpose/audience/writer/context, `vocabulary` = those terms, `passageId: 'evelyn.passage.douglass-fourth-of-july.v1'`); `worked_example` (annotated: identify the rhetorical situation of the Douglass excerpt, `steps` walking each element); `try_yourself` **micro** grain (`responseFormat: 'free'`, `passageId` set, `rubric` = 1 Thesis-style part worth… see rubric note below); `misconception_check` (summary vs analysis); `recap`. Set `subject: 'ela'`, `curriculum: 'AP'`, `metadata: { cedUnit: 1, cedTopic: '1.1', cedTitle: 'Rhetorical Situation', sources: [...] }`, `pacingThresholds: AP_PACING_THRESHOLDS`.
- [ ] **Step 2: Rubric on the micro try-yourself.** Since this is a micro (thesis) grain, use a 6-point rubric where Thesis carries the weight appropriate to the task — for a thesis-only exercise, a single-part rubric `[{criterionId:'thesis', maxPoints:6, scoringCriteria, modelResponse}]` is acceptable (the full 1/4/1 split appears on the full essay in Task 8). Keep it integer, summing to 6.
- [ ] **Step 3: Register** in `lesson-plan/store.ts` (import + `SEED_PLANS` array entry).
- [ ] **Step 4: Verify.** `npx tsc --noEmit` → 0. `npx tsx scripts/lint-ap-plans.ts` → passes (course now appears as new-format). `npm run lint:passages` → clean (passage ref resolves). Structural check: `npx tsx -e "import {SEED_PLANS} from './src/lib/tutor/lesson-plan/store'; const p=SEED_PLANS.find(x=>x.id==='evelyn.ap.englang.rhetorical-situation.v1'); console.log(p.subject, p.metadata.cedUnit, p.segments.map(s=>s.kind).join(','))"` → prints `ela 1 hook,concept,worked_example,try_yourself,misconception_check,recap`.
- [ ] **Step 5: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-englang-u1-rhetorical-situation.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(eng-lang): U1 calibration plan — rhetorical situation"
```

**STOP — calibration checkpoint.** This plan is the gold template the rest of Unit 1 follows. Review it (structure, English semantics, passage wiring, rubric shape) before authoring the remaining plans.

---

### Task 7: Remaining Unit-1 content plans (fan-out)

**Files:**
- Create: `src/lib/tutor/lesson-plan/seeds/ap-englang-u1-reading-for-claim.ts` (LO `apenglang.reading-for-claim`, cedTopic 1.2)
- Create: `src/lib/tutor/lesson-plan/seeds/ap-englang-u1-defensible-thesis.ts` (LO `apenglang.defensible-thesis`, 1.3)
- Create: `src/lib/tutor/lesson-plan/seeds/ap-englang-u1-evidence-commentary.ts` (LO `apenglang.evidence-commentary`, 1.4)
- Create (optional 5th): `src/lib/tutor/lesson-plan/seeds/ap-englang-u1-audience-context.ts` (LO `apenglang.audience-context`, 1.5)
- Modify: `src/lib/tutor/lesson-plan/store.ts` (register all)

- [ ] **Step 1: Author** each plan following the Task-6 calibration template exactly (same segment kinds + English semantics). Vary the `try_yourself` grain: `defensible-thesis` = micro; `evidence-commentary` = **paragraph** grain (`responseFormat:'free'`, rubric = Evidence & Commentary parts summing to 6, e.g. `[{evidence:3},{commentary:3}]`); `reading-for-claim`/`audience-context` may use `passageId` for Henry or Woolf. Dispatch one subagent per plan (author-only), or author inline. Each sets `metadata.cedUnit:1` with the listed cedTopic.
- [ ] **Step 2: Register** all in `lesson-plan/store.ts`.
- [ ] **Step 3: Verify.** `npx tsc --noEmit` → 0. `npx tsx scripts/lint-ap-plans.ts` → passes. `npm run lint:passages` → clean. Structural rubric audit (walk `SEED_PLANS` for `topic`/id prefix `evelyn.ap.englang`, every `try_yourself` has `rubric` with parts summing to 6 integer + per-part fields).
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-englang-u1-*.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(eng-lang): U1 content plans (reading, thesis, evidence, audience)"
```

---

### Task 8: FRQ-practice plan — full Rhetorical Analysis essay

**Files:**
- Create: `src/lib/tutor/lesson-plan/seeds/ap-englang-u1-frq-practice.ts`
- Modify: `src/lib/tutor/lesson-plan/store.ts`

- [ ] **Step 1: Author** the frq-practice plan: LO `apenglang.u1-frq-practice`, `metadata.cedTopic:'1-FRQ'`. One `try_yourself` full-essay segment: `responseFormat:'frq'`, `passageId:'evelyn.passage.douglass-fourth-of-july.v1'`, `problem` = a real AP-style Rhetorical Analysis prompt on the Douglass excerpt, `expectedAnswer` = a paragraph describing a full-credit response, and the **6-point AP Lang rubric** as three parts: `[{criterionId:'A-thesis',maxPoints:1,...},{criterionId:'B-evidence-commentary',maxPoints:4,...},{criterionId:'C-sophistication',maxPoints:1,...}]`, each with `scoringCriteria` + `modelResponse`. Model file structure on `src/lib/tutor/lesson-plan/seeds/ap-stats-u2-frq-practice.ts`.
- [ ] **Step 2: Register** in store.
- [ ] **Step 3: Verify.** `npx tsc --noEmit` → 0. Structural: the essay segment's rubric parts sum to exactly 6, all integer, each with non-empty `scoringCriteria`+`modelResponse`, and `passageId` resolves (`npm run lint:passages`). `npx tsx scripts/lint-ap-plans.ts` → passes.
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/lesson-plan/seeds/ap-englang-u1-frq-practice.ts src/lib/tutor/lesson-plan/store.ts
git commit -m "content(eng-lang): U1 FRQ-practice — Rhetorical Analysis essay + 6-pt rubric"
```

---

### Task 9: Topic-notes baselines

**Files:**
- Create: `src/lib/tutor/topic-notes/seeds/ap-englang-u1-<slug>.ts` — one per content plan (~5)
- Modify: `src/lib/tutor/topic-notes/store.ts` (register)

- [ ] **Step 1: Author** one baseline per Task-6/7 content plan, `baselineId===planId`, `course:'AP English Language'`, `cedUnit:1`, rhetoric-shaped `theory` (kinds like `'rhetorical-device'`, `'framework'`, plus 2–3 `'definition'`), `methods` (writing moves as ordered `steps` with an `example.{problem,solution}`), `pointers` (tips). Model on `src/lib/tutor/topic-notes/seeds/ap-macro-u4-money-market.ts`. Text-only (no `diagram`). Dispatch one subagent per baseline or author inline.
- [ ] **Step 2: Register** all in `SEED_BASELINES` (import + array entry).
- [ ] **Step 3: Verify.** `npx tsc --noEmit` → 0. Structural: `npx tsx -e "import {SEED_BASELINES} from './src/lib/tutor/topic-notes/store'; import {SEED_PLANS} from './src/lib/tutor/lesson-plan/store'; const pi=new Set(SEED_PLANS.map(p=>p.id)); const b=SEED_BASELINES.filter(x=>x.course==='AP English Language'); console.log('count',b.length,'mismatch',b.filter(x=>x.baselineId!==x.planId).length,'orphan',b.filter(x=>!pi.has(x.planId)).length)"` → `count 5 mismatch 0 orphan 0`.
- [ ] **Step 4: Commit.**
```bash
git add src/lib/tutor/topic-notes/seeds/ap-englang-u1-*.ts src/lib/tutor/topic-notes/store.ts
git commit -m "content(eng-lang): U1 topic-notes baselines"
```

---

### Task 10: Passage-grouped MCQ bank

**Files:**
- Create: `src/data/problem-bank/ap-english-language/u1.json`
- Create: `src/data/problem-bank/ap-english-language/_AUTHORING.md`

- [ ] **Step 1: Author** `u1.json` — a JSON array of ~16–22 items forming **2 passage-grouped sets**: ~8–11 items keyed to `passageId:'evelyn.passage.douglass-fourth-of-july.v1'` and ~8–11 to `...henry-give-me-liberty.v1`. Each item: `{id, loId (apenglang.*), cedCode, difficulty 1-4, responseFormat:'mcq', passageId, problemText (a reading-skill question ABOUT the passage — do NOT re-inline the passage; retrieval renders it), choices (3-5), answer (LETTER), hints}`. **Distribute correct-answer letters** across A/B/C/D (don't default all to A — the parity build's known trap). Record the per-LO cedCode table in `_AUTHORING.md`.
- [ ] **Step 2: Validate + dry-run verify** (no DB write):
Run: `npm run seed:problem-bank -- --course=ap-english-language --dry-run`
Expected: validation passes (unique ids, mcq 3-5 choices + answer-letter in range) and the Sonnet verify-at-ingest solves each item; ~all pass (a stray stochastic reject is acceptable if the key is hand-verified).
Run: `npm run lint:passages` → clean (every item `passageId` resolves).
- [ ] **Step 3: Commit** (git JSON is the source of truth; DB seeding to prod is a later ops step, NOT in this plan).
```bash
git add src/data/problem-bank/ap-english-language
git commit -m "content(eng-lang): U1 passage-grouped MCQ bank (2 sets)"
```

---

### Task 11: Academy course

**Files:**
- Modify: academy `tools/gen-seed.mjs` (new `buildCourse` block + add to `courses` array + log string)

- [ ] **Step 1: Add the course block.** In the academy repo's `tools/gen-seed.mjs` (find via `git worktree list` sibling or `/Users/luke/Dev/academy`), add an `apEngLang = buildCourse({...})` call mirroring `apStats`: filename `pattern: /^ap-englang-.*\.ts$/`, `key:'AP_ENGLISH_LANGUAGE'`, `title:'AP English Language & Composition'`, `subject:'English Language'`, `fallbackTopic:'ap-english-language'`, engine coords `{subject:'ela', level:'ap', topic:'ap-english-language'}`, appropriate `seoMeta`. Add `apEngLang` to the final `courses` array and the summary log/`generatedFrom` string.
- [ ] **Step 2: Generate + ingest** (academy repo): `npm run seed:gen` then `npm run ingest` (writes to `academy_portal` Mongo; idempotent upsert by courseId+loId; existing courses untouched). Then publish the course + enroll a test account as the calcbc build did.
- [ ] **Step 3: Verify.** `mappings.json` includes the AP English Language nodes; ingest logs show the new CourseNodes; the course row is `published`.
- [ ] **Step 4: Commit** (in the academy repo).
```bash
git add tools/gen-seed.mjs seed/mappings.json
git commit -m "feat(academy): AP English Language course from engine englang seeds"
```

---

### Task 12: Live validation gate (manual — release gate before fan-out)

**Not a code task.** With the branch built, run ONE real Unit-1 tutor session (the user drives; do not auto-start port 3001) and confirm:
- [ ] A passage renders in-session via `show_annotated_passage` with line numbers.
- [ ] The Rhetorical Analysis essay try-yourself grades against the **passage-aware 6-point rubric** (per-part points + feedback returned; grader references passage evidence).
- [ ] A passage-grouped MCQ set surfaces in practice/quiz.
- [ ] Topic notes render for a Unit-1 plan.

**Only after this passes** does Phase 2 (Units 2–9 fan-out) begin as a separate initiative. Record results in `project_ap_parity_gaps_build`'s sibling memory or a new `project_ap_eng_lang` note.

---

## Self-Review

**Spec coverage:** D1 vertical slice → Tasks 5–12; D2 public-domain → Task 5 + Global Constraints + lint Task 4; D3 passage registry → Task 1; D4 6-point rubric → Tasks 6/7/8 + constraints; D5 three grains → Tasks 6 (micro), 7 (paragraph), 8 (full); D6 CED units → cedUnit:1 throughout. Passage schema refs → Task 2; grader awareness → Task 3; lint → Task 4; all six components → Tasks 5–11 (plans 6/7/8, diagrams reused-none, notes 9, bank 10, rubrics 6/7/8, academy 11). Success/validation → Task 12.

**Placeholder scan:** No TBD/TODO; content tasks name the exact gold reference file to model, exact ids, exact verification commands. The prose itself is authored during execution (a plan cannot contain 800 words of Douglass) but every structural decision is specified.

**Type consistency:** `passageId?` (schemas) vs `passageText?` (grader, resolved value) used consistently and deliberately distinct; `resolvePassage`/`passageById`/`SEED_PASSAGES` names match across Tasks 1/4; rubric part totals = 6 everywhere; plan/LO/file id schemes uniform.
