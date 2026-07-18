# Problem Bank Parity Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the `ap-parity-gaps` branch to main, then bring every content plan LO in all 9 bank-backed courses to ≥ 4 verified ProblemBank items (~450 new items).

**Architecture:** A new gap-manifest script computes exact per-LO deficits from the lesson-plan seeds (source of LO ids/CED codes) and the bank seed JSONs (source of current counts). Authoring appends items to the existing per-unit JSON arrays. The existing `seed-problem-bank.ts` provides validation (`--dry-run`) and the Sonnet verify-at-ingest gate before idempotent upserts to prod Mongo.

**Tech Stack:** TypeScript scripts run via `npx tsx` / `ts-node`, Mongoose/MongoDB, Anthropic SDK (verify gate). Repo: `/Users/luke/Dev/evelynlearning` (all paths below are relative to it; run all commands from the repo root).

**Spec:** `docs/superpowers/specs/2026-07-18-problem-bank-parity-extension-design.md`

## Global Constraints

- **Floor:** every included plan LO ends with ≥ 4 bank items. Existing items are never modified or deleted.
- **Excluded LOs:** plan LOs appearing ONLY in `*-frq-practice` / `*-saq-practice` / `*-dbq-practice` / `*-leq-practice` plan seed files get NO bank items.
- **Item shape** (validated by `scripts/seed-problem-bank.ts`): `{ id, loId, cedCode, difficulty: 1|2|3|4, responseFormat: 'mcq'|'numeric', problemText, choices? (mcq: 3-5), answer (mcq: letter 'A'-'E'; numeric: parseable number), hints? (1-3), passageId? }`.
- **Id convention:** `<prefix>.<lo-slug>.<mcq|numeric>.<NN>` continuing the existing per-LO, per-format sequence (e.g. existing `apush.columbian-exchange.mcq.01`–`.03` → new items start at `.04`). Zero-padded 2 digits.
- **Formats:** APUSH, APWorld, APGov, EngLang: mcq only. Calc/Stats/Macro/EnvSci/Psych: mcq or numeric per what the LO naturally supports (roughly matching the course's existing mcq:numeric ratio).
- **Content rules:** original AP-style items only — never transcribed from real released exams. MCQ distractors must encode plausible misconceptions. No `$<digit>` in problemText (KaTeX currency trap — write "4 dollars" or escape). `passageId` only if it resolves in `src/lib/tutor/passages/store.ts` — never invent passage ids; if no existing passage fits, write passage-free items.
- **Difficulty:** steer each LO toward a spread of roughly {d1: 1, d2: 1, d3: 1, d4: 1}; the manifest's `difficultyGaps` lists which buckets to fill first.
- **Authoring style guides:** `src/data/problem-bank/<course>/_AUTHORING.md` exists for ap-english-language, ap-us-government, ap-us-history, ap-world-history, ap-macroeconomics, ap-environmental-science, ap-psychology (last three arrive with the Task 1 merge). Calc/Stats have none — mirror the conventions visible in their existing items.
- **Env:** `scripts/seed-problem-bank.ts` loads `.env.local`; already-exported env vars win. Prod seeding = override `MONGODB_URI` from `.env.local.production` (see Task 13). `ANTHROPIC_API_KEY` comes from `.env.local`.
- **Commits:** conventional-commit style (`feat(problem-bank): ...`), commit after each task.

---

### Task 1: Merge `ap-parity-gaps` into main

**Files:**
- No file edits — git merge + worktree cleanup only.

**Interfaces:**
- Produces: `src/data/problem-bank/{ap-macroeconomics,ap-environmental-science,ap-psychology}/` seed JSONs + `_AUTHORING.md` files on main, which Tasks 3+ read.

- [ ] **Step 1: Confirm the branch and preview the merge**

```bash
cd /Users/luke/Dev/evelynlearning
git status --short   # must be clean apart from untracked scratch; commit/stash anything staged first
git log --oneline main..worktree-ap-parity-gaps   # expect the 4 known commits (587f06d2, 8fd3a169, 2db9c161, a984ffe6)
git merge-tree $(git merge-base main worktree-ap-parity-gaps) main worktree-ap-parity-gaps | grep -c '<<<<<<<' || true
```
Expected: conflict count 0 (branch is purely additive).

- [ ] **Step 2: Merge**

```bash
git merge worktree-ap-parity-gaps --no-edit
ls src/data/problem-bank/   # expect 9 course dirs now
```

- [ ] **Step 3: Typecheck + relevant tests**

```bash
npx tsc --noEmit
npm run test:portal-practice && npm run test:adapters-passage && npm run test:passages
```
Expected: typecheck clean; all three suites pass. If typecheck fails on pre-existing unrelated errors, confirm the same errors exist on `main~1` before proceeding; the merge itself must introduce none.

- [ ] **Step 4: Push and remove the worktree**

```bash
git push origin main
git worktree remove .claude/worktrees/ap-parity-gaps
git branch -d worktree-ap-parity-gaps
```

### Task 2: Gap-manifest script (TDD)

**Files:**
- Create: `scripts/problem-bank-gap-manifest.ts`
- Create: `scripts/test-gap-manifest.ts`
- Modify: `package.json` (add `test:gap-manifest` script)
- Modify: `.gitignore` (add `.gap-manifests/`)

**Interfaces:**
- Produces: `computeManifest(planLos: PlanLo[], bankCounts: Map<string, BankCount>, floor?: number): GapEntry[]` (exported), and a CLI writing `.gap-manifests/<course>.json`.
- Types (exported from `scripts/problem-bank-gap-manifest.ts`):

```typescript
export interface PlanLo {
  loId: string;            // e.g. "apush.columbian-exchange"
  cedCode: string;         // from the plan LO's `standard`, e.g. "AP-APUSH-1.4"
  unit: number;            // from the plan seed filename's -u<N>- segment
  frqPracticeOnly: boolean; // true if the LO appears only in *-{frq,saq,dbq,leq}-practice files
}
export interface BankCount { total: number; byDifficulty: Record<1 | 2 | 3 | 4, number>; }
export interface GapEntry {
  loId: string; cedCode: string; unit: number;
  current: number; deficit: number;            // deficit = max(0, floor - current)
  difficultyGaps: Array<1 | 2 | 3 | 4>;        // buckets with 0 items, ordered ascending
}
```

- [ ] **Step 1: Write the failing test**

Create `scripts/test-gap-manifest.ts`. Follow the repo's standalone-assert test style (plain script, `process.exit(1)` on failure):

```typescript
import { computeManifest, parsePlanLosFromSource, type PlanLo } from './problem-bank-gap-manifest';
import assert from 'assert';

// --- parsePlanLosFromSource: extracts LO id + standard from plan seed source ---
const src = `
  los: [{ id: 'apush.columbian-exchange', description: 'x', standard: 'AP-APUSH-1.4' },
        { id: 'apush.spanish-colonization', description: 'y', standard: 'AP-APUSH-1.5' }],
`;
const parsed = parsePlanLosFromSource(src, 'apush');
assert.deepStrictEqual(
  parsed.map((p) => [p.loId, p.cedCode]),
  [['apush.columbian-exchange', 'AP-APUSH-1.4'], ['apush.spanish-colonization', 'AP-APUSH-1.5']],
);

// --- computeManifest: deficits, frq exclusion, difficulty gaps ---
const planLos: PlanLo[] = [
  { loId: 'apush.columbian-exchange', cedCode: 'AP-APUSH-1.4', unit: 1, frqPracticeOnly: false },
  { loId: 'apush.uncovered-lo', cedCode: 'AP-APUSH-2.1', unit: 2, frqPracticeOnly: false },
  { loId: 'apush.u1-dbq-practice', cedCode: 'AP-APUSH-1-DBQ', unit: 1, frqPracticeOnly: true },
];
const bankCounts = new Map([
  ['apush.columbian-exchange', { total: 3, byDifficulty: { 1: 1, 2: 2, 3: 0, 4: 0 } }],
]);
const manifest = computeManifest(planLos, bankCounts, 4);
assert.strictEqual(manifest.length, 2, 'frq-practice-only LO must be excluded');
const covered = manifest.find((m) => m.loId === 'apush.columbian-exchange')!;
assert.strictEqual(covered.deficit, 1);
assert.deepStrictEqual(covered.difficultyGaps, [3, 4]);
const uncovered = manifest.find((m) => m.loId === 'apush.uncovered-lo')!;
assert.strictEqual(uncovered.deficit, 4);
assert.deepStrictEqual(uncovered.difficultyGaps, [1, 2, 3, 4]);
assert.strictEqual(uncovered.unit, 2);

console.log('✓ test-gap-manifest: all assertions passed');
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npx tsx scripts/test-gap-manifest.ts
```
Expected: FAIL — cannot find module `./problem-bank-gap-manifest`.

- [ ] **Step 3: Implement the script**

Create `scripts/problem-bank-gap-manifest.ts`:

```typescript
/**
 * Compute per-LO problem-bank deficits against a floor (default 4 items/LO).
 *
 * Sources (git = source of truth, no DB access):
 *  - src/lib/tutor/lesson-plan/seeds/*.ts   → plan LO ids, CED codes (`standard`), unit (filename -u<N>-)
 *  - src/data/problem-bank/<course>/u*.json → current per-LO counts + difficulty spread
 *
 * LOs that appear ONLY in *-{frq,saq,dbq,leq}-practice plan files are
 * essay-skill LOs and are excluded (spec amendment 2026-07-18).
 *
 * Usage: npx tsx scripts/problem-bank-gap-manifest.ts [--course=ap-us-history] [--floor=4]
 * Writes .gap-manifests/<course>.json and prints a summary table.
 */
import * as fs from 'fs';
import * as path from 'path';

export interface PlanLo { loId: string; cedCode: string; unit: number; frqPracticeOnly: boolean; }
export interface BankCount { total: number; byDifficulty: Record<1 | 2 | 3 | 4, number>; }
export interface GapEntry {
  loId: string; cedCode: string; unit: number;
  current: number; deficit: number; difficultyGaps: Array<1 | 2 | 3 | 4>;
}

/** course dir → LO-id prefix */
export const COURSE_PREFIX: Record<string, string> = {
  'ap-calculus-bc': 'apcalcbc', 'ap-statistics': 'apstats', 'ap-macroeconomics': 'apmacro',
  'ap-environmental-science': 'apenvsci', 'ap-psychology': 'appsych',
  'ap-english-language': 'apenglang', 'ap-world-history': 'apworld',
  'ap-us-history': 'apush', 'ap-us-government': 'apgov',
};

const FRQ_FILE_RE = /-(frq|saq|dbq|leq)-practice/;

/** Extract `{ id: '<prefix>.x', ... standard: 'Y' }` pairs from plan seed source. */
export function parsePlanLosFromSource(src: string, prefix: string): Array<{ loId: string; cedCode: string }> {
  const out: Array<{ loId: string; cedCode: string }> = [];
  const re = new RegExp(
    `id:\\s*['"](${prefix}\\.[a-z0-9-]+)['"][^}]*?standard:\\s*['"]([^'"]+)['"]`, 'gs');
  for (const m of src.matchAll(re)) out.push({ loId: m[1], cedCode: m[2] });
  return out;
}

export function collectPlanLos(seedsDir: string, prefix: string): PlanLo[] {
  const byLo = new Map<string, PlanLo>();
  const inNonFrq = new Set<string>();
  for (const f of fs.readdirSync(seedsDir).filter((f) => f.endsWith('.ts'))) {
    const src = fs.readFileSync(path.join(seedsDir, f), 'utf8');
    const unitM = f.match(/-u(\d+)-/);
    const unit = unitM ? parseInt(unitM[1], 10) : 1;
    const isFrq = FRQ_FILE_RE.test(f);
    for (const { loId, cedCode } of parsePlanLosFromSource(src, prefix)) {
      if (!isFrq) inNonFrq.add(loId);
      const prev = byLo.get(loId);
      if (!prev) byLo.set(loId, { loId, cedCode, unit, frqPracticeOnly: isFrq });
      else if (prev.frqPracticeOnly && !isFrq) byLo.set(loId, { loId, cedCode, unit, frqPracticeOnly: false });
    }
  }
  for (const lo of byLo.values()) lo.frqPracticeOnly = !inNonFrq.has(lo.loId);
  return [...byLo.values()];
}

export function collectBankCounts(courseDir: string): Map<string, BankCount> {
  const counts = new Map<string, BankCount>();
  for (const f of fs.readdirSync(courseDir).filter((f) => f.endsWith('.json'))) {
    const items = JSON.parse(fs.readFileSync(path.join(courseDir, f), 'utf8')) as Array<{ loId: string; difficulty: 1 | 2 | 3 | 4 }>;
    for (const it of items) {
      const c = counts.get(it.loId) ?? { total: 0, byDifficulty: { 1: 0, 2: 0, 3: 0, 4: 0 } };
      c.total += 1;
      c.byDifficulty[it.difficulty] += 1;
      counts.set(it.loId, c);
    }
  }
  return counts;
}

export function computeManifest(planLos: PlanLo[], bankCounts: Map<string, BankCount>, floor = 4): GapEntry[] {
  return planLos
    .filter((lo) => !lo.frqPracticeOnly)
    .map((lo) => {
      const c = bankCounts.get(lo.loId) ?? { total: 0, byDifficulty: { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<1 | 2 | 3 | 4, number> };
      const difficultyGaps = ([1, 2, 3, 4] as const).filter((d) => c.byDifficulty[d] === 0);
      return { loId: lo.loId, cedCode: lo.cedCode, unit: lo.unit, current: c.total, deficit: Math.max(0, floor - c.total), difficultyGaps: [...difficultyGaps] };
    })
    .sort((a, b) => a.unit - b.unit || a.loId.localeCompare(b.loId));
}

function main() {
  const courseArg = process.argv.find((a) => a.startsWith('--course='))?.split('=')[1];
  const floor = parseInt(process.argv.find((a) => a.startsWith('--floor='))?.split('=')[1] ?? '4', 10);
  const root = path.join(__dirname, '..');
  const seedsDir = path.join(root, 'src/lib/tutor/lesson-plan/seeds');
  const outDir = path.join(root, '.gap-manifests');
  fs.mkdirSync(outDir, { recursive: true });
  const courses = courseArg ? [courseArg] : Object.keys(COURSE_PREFIX);
  for (const course of courses) {
    const prefix = COURSE_PREFIX[course];
    if (!prefix) throw new Error(`unknown course ${course}`);
    const manifest = computeManifest(
      collectPlanLos(seedsDir, prefix),
      collectBankCounts(path.join(root, 'src/data/problem-bank', course)),
      floor,
    );
    fs.writeFileSync(path.join(outDir, `${course}.json`), JSON.stringify(manifest, null, 2));
    const need = manifest.reduce((s, m) => s + m.deficit, 0);
    const zero = manifest.filter((m) => m.current === 0).length;
    console.log(`${course}: LOs=${manifest.length} zero-item=${zero} totalDeficit=${need}`);
  }
}

if (require.main === module) main();
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx tsx scripts/test-gap-manifest.ts
```
Expected: `✓ test-gap-manifest: all assertions passed`

- [ ] **Step 5: Register the test + ignore the output dir**

In `package.json` scripts (alphabetically near the other `test:` entries):
```json
"test:gap-manifest": "npx tsx scripts/test-gap-manifest.ts",
```
Append to `.gitignore`:
```
.gap-manifests/
```

- [ ] **Step 6: Commit**

```bash
git add scripts/problem-bank-gap-manifest.ts scripts/test-gap-manifest.ts package.json .gitignore
git commit -m "feat(problem-bank): gap-manifest script for 4/LO parity round"
```

### Task 3: Generate manifests and record the authoring budget

**Files:**
- Create (untracked): `.gap-manifests/<course>.json` × 9

**Interfaces:**
- Consumes: `scripts/problem-bank-gap-manifest.ts` CLI from Task 2.
- Produces: the 9 manifest JSONs Tasks 4–12 author against, plus a deficit summary recorded in the task report.

- [ ] **Step 1: Run the CLI for all courses**

```bash
npx tsx scripts/problem-bank-gap-manifest.ts
```
Expected: one summary line per course. Sanity checks: `ap-us-government` totalDeficit ≈ 110–135; `ap-calculus-bc` and `ap-macroeconomics` totalDeficit < 40; no course reports LOs=0; grand total ≈ 400–500.

- [ ] **Step 2: Sanity-check exclusions**

```bash
grep -c "frq\|saq\|dbq\|leq" .gap-manifests/*.json || true
```
Expected: 0 matches — no essay-practice LO made it into any manifest. If any did, fix the exclusion logic before proceeding (test first).

- [ ] **Step 3: Record the per-course deficit table** in the task report (it drives review of Tasks 4–12). No commit (dir is gitignored).

### Tasks 4–12: Author items (one task per course)

Nine identical-procedure tasks, one per course. Order (largest gap first):

| Task | Course | Manifest | Est. new items | Formats |
|---|---|---|---|---|
| 4 | ap-us-government | `.gap-manifests/ap-us-government.json` | ~110–135 | mcq |
| 5 | ap-us-history | `.gap-manifests/ap-us-history.json` | ~100–125 | mcq |
| 6 | ap-world-history | `.gap-manifests/ap-world-history.json` | ~85–110 | mcq |
| 7 | ap-english-language | `.gap-manifests/ap-english-language.json` | ~50–65 | mcq |
| 8 | ap-statistics | `.gap-manifests/ap-statistics.json` | ~10–30 | mcq+numeric |
| 9 | ap-calculus-bc | `.gap-manifests/ap-calculus-bc.json` | ~5–30 | mcq+numeric |
| 10 | ap-macroeconomics | `.gap-manifests/ap-macroeconomics.json` | ~5–25 | mcq+numeric |
| 11 | ap-environmental-science | `.gap-manifests/ap-environmental-science.json` | ~5–25 | mcq+numeric |
| 12 | ap-psychology | `.gap-manifests/ap-psychology.json` | ~5–25 | mcq |

Each of Tasks 4–12 runs this exact procedure for its course (shown for Task 4, ap-us-government — substitute the course dir/manifest for the others):

**Files:**
- Modify: `src/data/problem-bank/ap-us-government/u<N>.json` (append to the arrays; create `u<N>.json` as `[]`-rooted array only if the manifest names a unit with no existing file)
- Read: `.gap-manifests/ap-us-government.json`, `src/data/problem-bank/ap-us-government/_AUTHORING.md` (where present), 3 existing items of the same course as style anchors

**Interfaces:**
- Consumes: `GapEntry[]` manifest (Task 3).
- Produces: seed JSONs whose every manifest LO now has ≥ 4 items; consumed by Task 13's verify+seed.

- [ ] **Step 1: Author the deficit items.** For each manifest entry with `deficit > 0`: write `deficit` new items for that `loId`/`cedCode` into the unit file the entry names, filling `difficultyGaps` buckets first, then spreading remaining items across d2–d3. Follow every Global Constraint (id sequencing, formats, distractor quality, passage rule, no `$<digit>`). Ground content in the LO's plan: read the LO's teaching plan seed (`src/lib/tutor/lesson-plan/seeds/`, the non-frq file whose `los[]` carries the loId) so items test what the plan actually teaches.

- [ ] **Step 2: Validate**

```bash
npx tsx scripts/problem-bank-gap-manifest.ts --course=ap-us-government
npm run seed:problem-bank -- --course=ap-us-government --dry-run --no-verify
```
Expected: manifest reports `totalDeficit=0`; dry-run reports 0 validation errors (warnings about pre-existing items are acceptable; new items must add none).

- [ ] **Step 3: Commit**

```bash
git add src/data/problem-bank/ap-us-government/
git commit -m "feat(problem-bank): ap-us-government parity items to 4/LO floor"
```

### Task 13: Verify-at-ingest + seed to prod

**Files:**
- No source edits (repair edits to seed JSONs only if the verify gate rejects items).

**Interfaces:**
- Consumes: seed JSONs from Tasks 4–12; `seed-problem-bank.ts` verify+upsert; prod Mongo via `.env.local.production`'s `MONGODB_URI`.
- Produces: verified rows live in prod `problembanks`.

- [ ] **Step 1: Confirm the prod tunnel/URI works**

```bash
cd /Users/luke/Dev/evelynlearning
export PROD_MONGODB_URI="$(grep '^MONGODB_URI=' .env.local.production | cut -d= -f2- | tr -d '\"')"
node --input-type=module -e "
import mongoose from 'mongoose';
await mongoose.connect(process.env.PROD_MONGODB_URI);
console.log('rows:', await mongoose.connection.db.collection('problembanks').countDocuments());
await mongoose.disconnect();"
```
Expected: prints current row count (~1657). If connection fails, the SSH tunnel to prod Mongo is down — ask the user to re-open it rather than guessing at ports.

- [ ] **Step 2: Seed each course with the verify gate** (sequential; each run is idempotent and resumable)

```bash
for c in ap-us-government ap-us-history ap-world-history ap-english-language \
         ap-statistics ap-calculus-bc ap-macroeconomics ap-environmental-science ap-psychology; do
  MONGODB_URI="$PROD_MONGODB_URI" npm run seed:problem-bank -- --course=$c || break
done
```
Expected per course: all items pass validation; verify-gate failures listed with the model's answer.

- [ ] **Step 3: Repair loop.** For each verify-gate rejection: re-examine the item; if the key is wrong, fix `answer` (or the distractors) in the seed JSON; if the item is ambiguous/unsolvable, delete it from the JSON and author a replacement (same id slot). Re-run that course's seed command (already-verified items upsert cheaply). An item failing twice is dropped; if a drop pushes an LO under 4, author one replacement before moving on. Commit repairs:

```bash
git add src/data/problem-bank/ && git commit -m "fix(problem-bank): verify-gate repairs for parity round"
```

- [ ] **Step 4: Push**

```bash
git push origin main
```

### Task 14: Post-ship verification

**Files:**
- No edits — verification queries + reporting only.

**Interfaces:**
- Consumes: prod Mongo, `.gap-manifests/*.json`, plan seeds.

- [ ] **Step 1: Assert the floor holds in prod**

```bash
cd /Users/luke/Dev/evelynlearning
export PROD_MONGODB_URI="$(grep '^MONGODB_URI=' .env.local.production | cut -d= -f2- | tr -d '\"')"
node --input-type=module -e "
import mongoose from 'mongoose';
import fs from 'fs';
await mongoose.connect(process.env.PROD_MONGODB_URI);
const col = mongoose.connection.db.collection('problembanks');
let bad = 0;
for (const f of fs.readdirSync('.gap-manifests')) {
  const course = f.replace('.json', '');
  const manifest = JSON.parse(fs.readFileSync('.gap-manifests/' + f, 'utf8'));
  for (const m of manifest) {
    const n = await col.countDocuments({ loId: m.loId, verifiedAt: { \$exists: true } });
    if (n < 4) { bad++; console.log('UNDER FLOOR', course, m.loId, n); }
  }
  console.log(course, 'checked', manifest.length, 'LOs');
}
console.log(bad === 0 ? 'ALL LOs AT FLOOR ✓' : bad + ' LOs under floor ✗');
await mongoose.disconnect();"
```
Expected: `ALL LOs AT FLOOR ✓`. Any under-floor LO goes back through Task 13 Step 3.

- [ ] **Step 2: Retrieval spot-check** — for one previously-zero LO per gap course (pick from the Task 3 deficit table, e.g. an `apgov.*` LO that had `current: 0`):

```bash
node --input-type=module -e "
import mongoose from 'mongoose';
await mongoose.connect(process.env.PROD_MONGODB_URI);
const rows = await mongoose.connection.db.collection('problembanks')
  .find({ loId: 'apgov.<previously-zero-lo>' }).project({ id: 1, difficulty: 1, responseFormat: 1 }).toArray();
console.log(rows);
await mongoose.disconnect();"
npm run test:portal-practice
```
Expected: ≥ 4 rows spanning ≥ 3 difficulty buckets; the portal practice unit suite still passes (retrieval path unchanged, this is a regression check).

- [ ] **Step 3: Report.** Final numbers per course (items added, verify-gate reject rate, new totals) in the task report, and note completion in the session summary for the user.

## Self-Review Notes

- Spec coverage: merge → Task 1; manifest → Tasks 2–3; authoring → 4–12; verify gate → 13; ship+verify → 13–14; FRQ-LO exclusion amendment → manifest logic + Task 3 Step 2 check.
- The spec's "spot-check voice `queryBank`" is satisfied by construction (manifest only emits plan LOs, and the LO-match invariant was verified in analysis) plus Task 14 Step 2's row check; no live voice session is required.
