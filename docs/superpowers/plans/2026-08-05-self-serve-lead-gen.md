# Self-Serve Lead Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A "Find leads" tab in `/admin/outreach` that runs Claude-powered lead research server-side (job doc + cron worker), inserting researched, drafted, staged leads — plus a paste-JSON import box that removes the terminal dependency.

**Architecture:** `POST /api/admin/outreach/research` creates a `ResearchJob` (queued); a node-cron worker (same globalThis pattern as `reply-watcher.ts`) claims it and runs discovery + per-candidate research via the Claude API (`claude-opus-5`, server-side web search/fetch, structured outputs), gates emails through a deterministic published-on-page check, and inserts leads via a shared importer lib also used by the CLI script and the new import route. Console polls the job doc.

**Tech Stack:** Next.js App Router, Mongoose 8, node-cron, `@anthropic-ai/sdk` (bumped to latest), next-auth v4 (`getServerSession(authOptions)`), house test harness (`npx tsx` + `node:assert`).

**Spec:** `docs/superpowers/specs/2026-08-05-self-serve-lead-gen-design.md`

## Global Constraints

- **Never fabricate a person, email, or LinkedIn URL.** `emailVerified: true` only after the server itself fetched `emailSourceUrl` and found the email string. Empty is correct; a guess is a failure.
- Hard cost cap `LEAD_RESEARCH_COST_CAP_USD` (default `20`), checked between candidates; abort keeps inserted leads.
- `count` 1–25; one active job at a time.
- Model: `claude-opus-5` exactly. Tools: `web_search_20260209`, `web_fetch_20260209`.
- Every new API route self-gates with `getServerSession(authOptions)` (admin routes have NO middleware gate).
- Client components must NOT value-import from `@/models` — use `@/lib/outreach/enums` (guard test enforces this).
- Worker state lives on `globalThis` via `Symbol.for`, NOT module scope (two server bundles — see `reply-watcher.ts:12-26`).
- All tests: `npx tsx` + `node:assert`, no live API calls, no DB where avoidable (use `validateSync`).
- Commit after each task; `--no-verify` is NOT used unless hooks are broken.

---

### Task 1: Shared importer lib (extract from CLI script)

**Files:**
- Create: `src/lib/outreach/import-leads.ts`
- Create: `src/lib/outreach/import-leads.test.ts`
- Modify: `scripts/import-leads.ts` (becomes thin CLI wrapper)
- Modify: `package.json` (add `test:outreach-import` script, extend `test:outreach` chain)

**Interfaces:**
- Consumes: `Lead` from `@/models/Lead`.
- Produces:
  - `interface ImportCounts { valid: number; invalid: number; inserted: number; skippedDupes: number; errors: string[] }`
  - `sanitizeLeadRow(row: Record<string, unknown>): Record<string, unknown>` — strips `status`, `demoToken`, `gmailThreadIds`, `touches`, `demoVisits`, and `currentDraft.gmailDraftId`/`gmailThreadId`.
  - `validateLeadRows(rows: unknown[]): { docs: InstanceType<typeof Lead>[]; counts: ImportCounts }` — no DB access (uses `validateSync`), forces `status: "staged"`.
  - `insertLeads(docs: InstanceType<typeof Lead>[]): Promise<ImportCounts>` — dedupes on `{ company, "decisionMaker.email" }` then saves. Caller is responsible for `connectDB()`.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/outreach/import-leads.test.ts
import { strict as assert } from "node:assert";
import { sanitizeLeadRow, validateLeadRows } from "./import-leads";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const goodRow = () => ({
  company: "Acme Nursing College",
  segment: "nursing_program",
  about: "A nursing school",
  whyFit: "NCLEX prep at scale",
  useCaseHypothesis: "Tutor for NCLEX drill",
  decisionMaker: { name: "Dana Smith", title: "Dean", email: "dsmith@acme.edu", emailVerified: true },
  website: "https://acme.edu",
  source: "test",
});

(async () => {
  await test("sanitizeLeadRow strips runtime fields", () => {
    const r = sanitizeLeadRow({
      ...goodRow(),
      status: "contacted", demoToken: "x", gmailThreadIds: ["t"], touches: [{}], demoVisits: [{}],
      currentDraft: { channel: "email", body: "hi", gmailDraftId: "d1", gmailThreadId: "t1" },
    });
    assert.equal(r.status, undefined);
    assert.equal(r.demoToken, undefined);
    assert.equal(r.gmailThreadIds, undefined);
    assert.equal(r.touches, undefined);
    assert.equal(r.demoVisits, undefined);
    const draft = r.currentDraft as Record<string, unknown>;
    assert.equal(draft.body, "hi");
    assert.equal(draft.gmailDraftId, undefined);
    assert.equal(draft.gmailThreadId, undefined);
  });

  await test("validateLeadRows: valid row becomes staged doc", () => {
    const { docs, counts } = validateLeadRows([goodRow()]);
    assert.equal(counts.valid, 1);
    assert.equal(counts.invalid, 0);
    assert.equal(docs[0].status, "staged");
  });

  await test("validateLeadRows: bad segment is invalid with row error", () => {
    const { docs, counts } = validateLeadRows([{ ...goodRow(), segment: "nope" }]);
    assert.equal(counts.valid, 0);
    assert.equal(counts.invalid, 1);
    assert.equal(docs.length, 0);
    assert.ok(counts.errors[0].includes("Acme"));
  });

  await test("validateLeadRows: input status contacted is overridden to staged", () => {
    const { docs } = validateLeadRows([{ ...goodRow(), status: "contacted" }]);
    assert.equal(docs[0].status, "staged");
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/outreach/import-leads.test.ts`
Expected: FAIL — `Cannot find module './import-leads'`

- [ ] **Step 3: Write the lib (logic lifted verbatim from `scripts/import-leads.ts:36-70`)**

```typescript
// src/lib/outreach/import-leads.ts
// Shared lead-import validation/insert used by the CLI script
// (scripts/import-leads.ts) and the console import + research pipeline.
import { Lead } from "@/models/Lead";

export interface ImportCounts {
  valid: number;
  invalid: number;
  inserted: number;
  skippedDupes: number;
  errors: string[];
}

const emptyCounts = (): ImportCounts =>
  ({ valid: 0, invalid: 0, inserted: 0, skippedDupes: 0, errors: [] });

// Runtime/state fields never accepted from imported rows.
export function sanitizeLeadRow(row: Record<string, unknown>): Record<string, unknown> {
  const r = { ...row };
  delete r.status; delete r.demoToken; delete r.gmailThreadIds;
  delete r.touches; delete r.demoVisits;
  if (r.currentDraft && typeof r.currentDraft === "object") {
    const d = { ...(r.currentDraft as Record<string, unknown>) };
    delete d.gmailDraftId; delete d.gmailThreadId;
    r.currentDraft = d;
  }
  return r;
}

export function validateLeadRows(rows: unknown[]): {
  docs: InstanceType<typeof Lead>[];
  counts: ImportCounts;
} {
  const counts = emptyCounts();
  const docs: InstanceType<typeof Lead>[] = [];
  rows.forEach((row, i) => {
    const r = sanitizeLeadRow((row ?? {}) as Record<string, unknown>);
    const doc = new Lead({ ...r, status: "staged" });
    const err = doc.validateSync();
    if (err) {
      counts.invalid++;
      counts.errors.push(`row ${i} (${r.company ?? "?"}): ${Object.keys(err.errors).join(", ")}`);
    } else {
      counts.valid++;
      docs.push(doc);
    }
  });
  return { docs, counts };
}

// Caller must have called connectDB() first.
export async function insertLeads(docs: InstanceType<typeof Lead>[]): Promise<ImportCounts> {
  const counts = emptyCounts();
  counts.valid = docs.length;
  for (const doc of docs) {
    const dupe = await Lead.findOne({
      company: doc.company,
      "decisionMaker.email": doc.decisionMaker.email ?? null,
    });
    if (dupe) { counts.skippedDupes++; continue; }
    await doc.save();
    counts.inserted++;
  }
  return counts;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/outreach/import-leads.test.ts`
Expected: PASS (4 ok)

- [ ] **Step 5: Rewrite `scripts/import-leads.ts` as a thin wrapper**

Replace the whole body after the header comment (keep usage comment, update it to mention the shared lib):

```typescript
// scripts/import-leads.ts
/**
 * Import Claude-researched leads into the outreach pipeline (status: staged).
 * Thin CLI over src/lib/outreach/import-leads.ts (also used by the console
 * import route and the research pipeline).
 *
 * Usage:
 *   npx tsx scripts/import-leads.ts <file.json>                          # dry-run
 *   MONGODB_URI=... npx tsx scripts/import-leads.ts <file.json> --apply  # write
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import { validateLeadRows, insertLeads } from "../src/lib/outreach/import-leads";

const APPLY = process.argv.includes("--apply");
const file = process.argv[2];
if (!file || file.startsWith("--")) {
  console.error("Usage: npx tsx scripts/import-leads.ts <file.json> [--apply]");
  process.exit(1);
}

let rows: unknown[];
try {
  rows = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`Cannot read ${file}: ${(e as Error).message}`);
  process.exit(1);
}
if (!Array.isArray(rows)) { console.error("Input must be a JSON array"); process.exit(1); }

async function main() {
  const { docs, counts } = validateLeadRows(rows);

  if (!APPLY) {
    console.log("[DRY RUN] no writes. Re-run with --apply to insert.");
    console.log(counts);
    process.exit(counts.invalid > 0 ? 1 : 0);
  }

  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  await mongoose.connect(process.env.MONGODB_URI);
  const inserted = await insertLeads(docs);
  await mongoose.disconnect();
  console.log({ ...counts, inserted: inserted.inserted, skippedDupes: inserted.skippedDupes });
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 6: Verify wrapper dry-run against the existing fixture (if present) or an inline fixture**

Run: `echo '[{"company":"T","segment":"nursing_program","decisionMaker":{"name":"A","title":"B"}}]' > /tmp/leads-fixture.json && npx tsx scripts/import-leads.ts /tmp/leads-fixture.json`
Expected: `[DRY RUN]` output with `valid: 1, invalid: 0`, exit 0

- [ ] **Step 7: Add test script and commit**

In `package.json` scripts, after `"test:outreach-model"`, add:
```json
"test:outreach-import": "npx tsx src/lib/outreach/import-leads.test.ts",
```
and extend `"test:outreach"` to `"npm run test:outreach-model && npm run test:outreach-import && npm run test:outreach-cadence && npm run test:outreach-reply && npm run test:outreach-guards"`.

```bash
npm run test:outreach
git add src/lib/outreach/import-leads.ts src/lib/outreach/import-leads.test.ts scripts/import-leads.ts package.json
git commit -m "refactor(outreach): extract shared lead-import lib from CLI script"
```

---

### Task 2: `ResearchJob` model

**Files:**
- Create: `src/models/ResearchJob.ts`
- Create: `src/models/ResearchJob.test.ts`
- Modify: `src/models/index.ts` (add exports next to the `Lead` exports at `:82-83`)
- Modify: `src/lib/outreach/enums.ts` (add job enums — mongoose-free, client-safe)
- Modify: `package.json` (add `test:outreach-job`, extend chain)

**Interfaces:**
- Produces (in `enums.ts`):
  - `RESEARCH_JOB_STATUSES = ["queued","running","done","failed","aborted_cost","cancelled"] as const`, `type ResearchJobStatus`
  - `CANDIDATE_STATUSES = ["pending","inserted","no_email","dupe","discarded","error"] as const`, `type CandidateStatus`
- Produces (in `ResearchJob.ts`):
  - `interface ICandidate { company: string; website: string; status: CandidateStatus; note?: string }`
  - `interface IResearchJob extends Document { segment: LeadSegment; niche?: string; region?: string; count: number; status: ResearchJobStatus; candidates: ICandidate[]; progress: { inserted: number; noEmail: number; skippedDupes: number; discarded: number; errors: number }; costUsd: number; tokens: { input: number; output: number }; error?: string; createdAt: Date; updatedAt: Date }`
  - `export const ResearchJob` (mongoose model, `timestamps: true`, index `{ status: 1, createdAt: -1 }`)

- [ ] **Step 1: Write the failing test**

```typescript
// src/models/ResearchJob.test.ts
import { strict as assert } from "node:assert";
import { ResearchJob } from "./ResearchJob";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
  await test("valid job passes validateSync with defaults", () => {
    const j = new ResearchJob({ segment: "nursing_program", count: 20 });
    assert.equal(j.validateSync(), undefined);
    assert.equal(j.status, "queued");
    assert.equal(j.costUsd, 0);
    assert.equal(j.tokens.input, 0);
    assert.equal(j.progress.inserted, 0);
    assert.deepEqual(j.candidates.toObject(), []);
  });

  await test("count outside 1-25 fails", () => {
    assert.ok(new ResearchJob({ segment: "nursing_program", count: 0 }).validateSync());
    assert.ok(new ResearchJob({ segment: "nursing_program", count: 26 }).validateSync());
  });

  await test("bad segment / bad status fail", () => {
    assert.ok(new ResearchJob({ segment: "nope", count: 5 }).validateSync());
    assert.ok(new ResearchJob({ segment: "nursing_program", count: 5, status: "nope" }).validateSync());
  });

  await test("candidate requires company+website, status enum enforced", () => {
    const j = new ResearchJob({
      segment: "nursing_program", count: 5,
      candidates: [{ company: "X", website: "https://x.edu", status: "pending" }],
    });
    assert.equal(j.validateSync(), undefined);
    const bad = new ResearchJob({
      segment: "nursing_program", count: 5,
      candidates: [{ company: "X", website: "https://x.edu", status: "nope" }],
    });
    assert.ok(bad.validateSync());
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/models/ResearchJob.test.ts`
Expected: FAIL — `Cannot find module './ResearchJob'`

- [ ] **Step 3: Add enums, then the model**

Append to `src/lib/outreach/enums.ts`:

```typescript
export const RESEARCH_JOB_STATUSES = [
  "queued", "running", "done", "failed", "aborted_cost", "cancelled",
] as const;
export type ResearchJobStatus = (typeof RESEARCH_JOB_STATUSES)[number];

export const CANDIDATE_STATUSES = [
  "pending", "inserted", "no_email", "dupe", "discarded", "error",
] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];
```

Create `src/models/ResearchJob.ts`:

```typescript
import mongoose, { Schema, Document } from "mongoose";
import {
  LEAD_SEGMENTS, RESEARCH_JOB_STATUSES, CANDIDATE_STATUSES,
} from "@/lib/outreach/enums";
import type { LeadSegment, ResearchJobStatus, CandidateStatus } from "@/lib/outreach/enums";

export interface ICandidate {
  company: string;
  website: string;
  status: CandidateStatus;
  note?: string;
}

export interface IResearchJob extends Document {
  segment: LeadSegment;
  niche?: string;
  region?: string;
  count: number;
  status: ResearchJobStatus;
  candidates: ICandidate[];
  progress: { inserted: number; noEmail: number; skippedDupes: number; discarded: number; errors: number };
  costUsd: number;
  tokens: { input: number; output: number };
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    company: { type: String, required: true },
    website: { type: String, required: true },
    status: { type: String, enum: CANDIDATE_STATUSES, default: "pending" },
    note: String,
  },
  { _id: false }
);

const ResearchJobSchema = new Schema<IResearchJob>(
  {
    segment: { type: String, enum: LEAD_SEGMENTS, required: true },
    niche: { type: String, default: "" },
    region: { type: String, default: "" },
    count: { type: Number, required: true, min: 1, max: 25 },
    status: { type: String, enum: RESEARCH_JOB_STATUSES, default: "queued" },
    candidates: { type: [CandidateSchema], default: [] },
    progress: {
      inserted: { type: Number, default: 0 },
      noEmail: { type: Number, default: 0 },
      skippedDupes: { type: Number, default: 0 },
      discarded: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
    },
    costUsd: { type: Number, default: 0 },
    tokens: {
      input: { type: Number, default: 0 },
      output: { type: Number, default: 0 },
    },
    error: String,
  },
  { timestamps: true }
);

ResearchJobSchema.index({ status: 1, createdAt: -1 });

export const ResearchJob =
  mongoose.models.ResearchJob ||
  mongoose.model<IResearchJob>("ResearchJob", ResearchJobSchema);
```

Add to `src/models/index.ts` (next to the Lead lines):

```typescript
export { ResearchJob } from "./ResearchJob";
export type { IResearchJob, ICandidate } from "./ResearchJob";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/models/ResearchJob.test.ts`
Expected: PASS (4 ok)

- [ ] **Step 5: Add test script and commit**

Add `"test:outreach-job": "npx tsx src/models/ResearchJob.test.ts"` to `package.json` and insert `npm run test:outreach-job &&` into the `test:outreach` chain after `test:outreach-model`.

```bash
npm run test:outreach
git add src/models/ResearchJob.ts src/models/ResearchJob.test.ts src/models/index.ts src/lib/outreach/enums.ts package.json
git commit -m "feat(outreach): ResearchJob model for in-console lead research"
```

---

### Task 3: Cost meter

**Files:**
- Create: `src/lib/outreach/research/cost.ts`
- Create: `src/lib/outreach/research/cost.test.ts`
- Modify: `package.json` (add `test:outreach-research` running all research/*.test.ts — extended in later tasks)

**Interfaces:**
- Produces:
  - `interface UsageLike { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number | null; cache_read_input_tokens?: number | null; server_tool_use?: { web_search_requests?: number } | null }`
  - `priceUsageUsd(u: UsageLike): number` — Opus 5 rates: input $5/MTok, output $25/MTok, cache-write 1.25× input, cache-read 0.1× input, web search $0.01/request.
  - `costCapUsd(): number` — `LEAD_RESEARCH_COST_CAP_USD` env, default `20`; non-numeric/≤0 falls back to 20.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/outreach/research/cost.test.ts
import { strict as assert } from "node:assert";
import { priceUsageUsd, costCapUsd } from "./cost";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

(async () => {
  await test("plain input+output tokens", () => {
    // 100K in = $0.50, 10K out = $0.25
    assert.ok(close(priceUsageUsd({ input_tokens: 100_000, output_tokens: 10_000 }), 0.75));
  });

  await test("cache write 1.25x, cache read 0.1x input rate", () => {
    const usd = priceUsageUsd({
      input_tokens: 0, output_tokens: 0,
      cache_creation_input_tokens: 100_000,  // $0.625
      cache_read_input_tokens: 100_000,      // $0.05
    });
    assert.ok(close(usd, 0.675));
  });

  await test("web search requests at $0.01 each", () => {
    const usd = priceUsageUsd({
      input_tokens: 0, output_tokens: 0,
      server_tool_use: { web_search_requests: 5 },
    });
    assert.ok(close(usd, 0.05));
  });

  await test("null/absent optional fields are zero", () => {
    assert.ok(close(priceUsageUsd({
      input_tokens: 1000, output_tokens: 0,
      cache_creation_input_tokens: null, cache_read_input_tokens: null, server_tool_use: null,
    }), 0.005));
  });

  await test("costCapUsd default and env override", () => {
    delete process.env.LEAD_RESEARCH_COST_CAP_USD;
    assert.equal(costCapUsd(), 20);
    process.env.LEAD_RESEARCH_COST_CAP_USD = "12.5";
    assert.equal(costCapUsd(), 12.5);
    process.env.LEAD_RESEARCH_COST_CAP_USD = "banana";
    assert.equal(costCapUsd(), 20);
    process.env.LEAD_RESEARCH_COST_CAP_USD = "-3";
    assert.equal(costCapUsd(), 20);
    delete process.env.LEAD_RESEARCH_COST_CAP_USD;
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/outreach/research/cost.test.ts`
Expected: FAIL — `Cannot find module './cost'`

- [ ] **Step 3: Implement**

```typescript
// src/lib/outreach/research/cost.ts
// Prices Claude API usage for the lead-research worker and enforces the
// batch cost ceiling. Rates are claude-opus-5 list prices.
export interface UsageLike {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  server_tool_use?: { web_search_requests?: number } | null;
}

const INPUT_PER_MTOK = 5;
const OUTPUT_PER_MTOK = 25;
const CACHE_WRITE_MULT = 1.25;
const CACHE_READ_MULT = 0.1;
const WEB_SEARCH_PER_REQUEST = 0.01;

export function priceUsageUsd(u: UsageLike): number {
  const per = (tokens: number, ratePerMTok: number) => (tokens / 1_000_000) * ratePerMTok;
  return (
    per(u.input_tokens ?? 0, INPUT_PER_MTOK) +
    per(u.output_tokens ?? 0, OUTPUT_PER_MTOK) +
    per(u.cache_creation_input_tokens ?? 0, INPUT_PER_MTOK * CACHE_WRITE_MULT) +
    per(u.cache_read_input_tokens ?? 0, INPUT_PER_MTOK * CACHE_READ_MULT) +
    (u.server_tool_use?.web_search_requests ?? 0) * WEB_SEARCH_PER_REQUEST
  );
}

export function costCapUsd(): number {
  const raw = Number(process.env.LEAD_RESEARCH_COST_CAP_USD);
  return Number.isFinite(raw) && raw > 0 ? raw : 20;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/outreach/research/cost.test.ts`
Expected: PASS (5 ok)

- [ ] **Step 5: Add test script and commit**

Add to `package.json`: `"test:outreach-research": "npx tsx src/lib/outreach/research/cost.test.ts"` (later tasks append `&&`-chained files to this same script) and insert `npm run test:outreach-research &&` into the `test:outreach` chain before `test:outreach-guards`.

```bash
npm run test:outreach
git add src/lib/outreach/research/cost.ts src/lib/outreach/research/cost.test.ts package.json
git commit -m "feat(outreach): research cost meter with hard cap"
```

---

### Task 4: Anti-fabrication email verification gate

**Files:**
- Create: `src/lib/outreach/research/verify-email.ts`
- Create: `src/lib/outreach/research/verify-email.test.ts`
- Modify: `package.json` (chain the test into `test:outreach-research`)

**Interfaces:**
- Produces:
  - `emailAppearsInText(email: string, pageText: string): boolean` — pure; case-insensitive; tolerant of ` [at] `, `(at)`, ` at ` for `@` and ` [dot] `, `(dot)`, ` dot ` for `.`.
  - `verifyEmailPublished(email: string, sourceUrl: string, fetchFn?: typeof fetch): Promise<boolean>` — fetches `sourceUrl` (10s timeout, `text()`), returns `emailAppearsInText` result; any fetch error → `false`.

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/outreach/research/verify-email.test.ts
import { strict as assert } from "node:assert";
import { emailAppearsInText, verifyEmailPublished } from "./verify-email";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
  await test("plain email found (case-insensitive)", () => {
    assert.ok(emailAppearsInText("dsmith@acme.edu", "Contact: DSmith@Acme.edu for details"));
  });
  await test("obfuscated [at]/[dot] found", () => {
    assert.ok(emailAppearsInText("dsmith@acme.edu", "dsmith [at] acme [dot] edu"));
    assert.ok(emailAppearsInText("dsmith@acme.edu", "dsmith (at) acme (dot) edu"));
    assert.ok(emailAppearsInText("dsmith@acme.edu", "email dsmith at acme dot edu"));
  });
  await test("absent email not found", () => {
    assert.equal(emailAppearsInText("dsmith@acme.edu", "Contact the dean's office at 555-1234"), false);
  });
  await test("similar-but-different email not matched", () => {
    assert.equal(emailAppearsInText("dsmith@acme.edu", "asmith@acme.edu is the contact"), false);
  });

  await test("verifyEmailPublished true when page contains email", async () => {
    const fakeFetch = (async () => new Response("reach Dana at dsmith@acme.edu")) as typeof fetch;
    assert.equal(await verifyEmailPublished("dsmith@acme.edu", "https://acme.edu/staff", fakeFetch), true);
  });
  await test("verifyEmailPublished false when absent", async () => {
    const fakeFetch = (async () => new Response("no contacts here")) as typeof fetch;
    assert.equal(await verifyEmailPublished("dsmith@acme.edu", "https://acme.edu/staff", fakeFetch), false);
  });
  await test("verifyEmailPublished false on fetch error", async () => {
    const fakeFetch = (async () => { throw new Error("ECONNREFUSED"); }) as unknown as typeof fetch;
    assert.equal(await verifyEmailPublished("dsmith@acme.edu", "https://acme.edu/staff", fakeFetch), false);
  });
  await test("verifyEmailPublished false on non-2xx", async () => {
    const fakeFetch = (async () => new Response("gone", { status: 404 })) as typeof fetch;
    assert.equal(await verifyEmailPublished("dsmith@acme.edu", "https://acme.edu/staff", fakeFetch), false);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/outreach/research/verify-email.test.ts`
Expected: FAIL — `Cannot find module './verify-email'`

- [ ] **Step 3: Implement**

```typescript
// src/lib/outreach/research/verify-email.ts
// The deterministic anti-fabrication gate: an email only survives into a
// Lead if the server itself fetched the model-cited source URL and found
// the address on the page. A model claim is never sufficient.

// Normalize common email obfuscations so "d [at] x [dot] edu" matches.
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s*[\[(]\s*at\s*[\])]\s*/g, "@")
    .replace(/\s+at\s+/g, "@")
    .replace(/\s*[\[(]\s*dot\s*[\])]\s*/g, ".")
    .replace(/\s+dot\s+/g, ".");
}

export function emailAppearsInText(email: string, pageText: string): boolean {
  const needle = email.toLowerCase();
  const haystack = normalize(pageText);
  // Word-ish boundary before the local part so "asmith@x" doesn't match "dsmith@x"
  const idx = haystack.indexOf(needle);
  if (idx === -1) return false;
  const before = idx === 0 ? "" : haystack[idx - 1];
  return before === "" || !/[a-z0-9._%+-]/.test(before);
}

export async function verifyEmailPublished(
  email: string,
  sourceUrl: string,
  fetchFn: typeof fetch = fetch
): Promise<boolean> {
  try {
    const res = await fetchFn(sourceUrl, {
      signal: AbortSignal.timeout(10_000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; EvelynResearch/1.0)" },
    });
    if (!res.ok) return false;
    const text = await res.text();
    return emailAppearsInText(email, text);
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/outreach/research/verify-email.test.ts`
Expected: PASS (8 ok)

- [ ] **Step 5: Chain test and commit**

Extend `test:outreach-research` in `package.json` to:
`"npx tsx src/lib/outreach/research/cost.test.ts && npx tsx src/lib/outreach/research/verify-email.test.ts"`

```bash
npm run test:outreach-research
git add src/lib/outreach/research/verify-email.ts src/lib/outreach/research/verify-email.test.ts package.json
git commit -m "feat(outreach): deterministic email-published verification gate"
```

---

### Task 5: Claude call layer (SDK bump, tool loop, prompts, schemas)

**Files:**
- Modify: `package.json` / `package-lock.json` (`npm install @anthropic-ai/sdk@latest`)
- Create: `src/lib/outreach/research/claude.ts`
- Create: `src/lib/outreach/research/prompts.ts`
- Create: `src/lib/outreach/research/claude.test.ts`
- Modify: `package.json` (chain test)

**Interfaces:**
- Consumes: `UsageLike` from `./cost`.
- Produces (in `claude.ts`):
  - `interface ResearchMessage { stop_reason: string | null; content: Array<Record<string, unknown>>; usage: UsageLike }`
  - `type CallModel = (params: Record<string, unknown>) => Promise<ResearchMessage>` — the injectable seam; tests pass fakes, production passes `realCallModel()`.
  - `realCallModel(): CallModel` — `new Anthropic()` bound to `messages.create`, model/tools NOT baked in (params carry them).
  - `callWithToolLoop(call: CallModel, params: Record<string, unknown>, onUsage: (u: UsageLike) => void): Promise<ResearchMessage>` — reports usage for every response; resumes `pause_turn` up to 8 times by appending the assistant turn; throws `Error("RESEARCH_REFUSED")` on `stop_reason === "refusal"`.
  - `extractJson(msg: ResearchMessage): unknown` — parses the last `text` block as JSON; throws `Error("RESEARCH_BAD_JSON")` if none/unparseable.
- Produces (in `prompts.ts`):
  - `RESEARCH_MODEL = "claude-opus-5"`, `RESEARCH_TOOLS` (web_search + web_fetch defs, `max_uses: 8` each)
  - `DISCOVERY_SCHEMA`, `LEAD_SCHEMA` (JSON Schemas, all-fields-required, `additionalProperties: false`; empty string = absent)
  - `discoveryParams(input: { segment: string; niche: string; region: string; wanted: number; excludeCompanies: string[] }): Record<string, unknown>`
  - `candidateParams(input: { segment: string; niche: string; company: string; website: string }): Record<string, unknown>`
  - `interface ResearchedLead { company: string; website: string; about: string; whyFit: string; useCaseHypothesis: string; source: string; decisionMakerName: string; decisionMakerTitle: string; linkedinUrl: string; email: string; emailSourceUrl: string; nameSourceUrl: string; sourceUrls: string[]; draftSubject: string; draftBody: string }`

- [ ] **Step 1: Bump the SDK**

Run: `cd /Users/luke/Dev/evelynlearning && npm install @anthropic-ai/sdk@latest`
Expected: package.json shows a version ≥ 0.7x newer than 0.71; `npm run build` not needed yet.

- [ ] **Step 2: Write the failing test**

```typescript
// src/lib/outreach/research/claude.test.ts
import { strict as assert } from "node:assert";
import { callWithToolLoop, extractJson, type ResearchMessage, type CallModel } from "./claude";
import { discoveryParams, candidateParams, RESEARCH_MODEL } from "./prompts";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const usage = { input_tokens: 10, output_tokens: 5 };
const textMsg = (text: string, stop = "end_turn"): ResearchMessage =>
  ({ stop_reason: stop, content: [{ type: "text", text }], usage });

(async () => {
  await test("single end_turn call reports usage once", async () => {
    const seen: number[] = [];
    const call: CallModel = async () => textMsg('{"ok":true}');
    const msg = await callWithToolLoop(call, { messages: [] }, (u) => seen.push(u.input_tokens));
    assert.equal(msg.stop_reason, "end_turn");
    assert.deepEqual(seen, [10]);
  });

  await test("pause_turn resumes with appended assistant turn", async () => {
    const calls: Record<string, unknown>[] = [];
    let n = 0;
    const call: CallModel = async (params) => {
      calls.push(params);
      n++;
      return n === 1 ? textMsg("searching...", "pause_turn") : textMsg('{"done":1}');
    };
    const msg = await callWithToolLoop(call, { messages: [{ role: "user", content: "go" }] }, () => {});
    assert.equal(n, 2);
    const secondMessages = calls[1].messages as Array<{ role: string }>;
    assert.equal(secondMessages.length, 2);
    assert.equal(secondMessages[1].role, "assistant");
    assert.equal(msg.stop_reason, "end_turn");
  });

  await test("refusal throws RESEARCH_REFUSED", async () => {
    const call: CallModel = async () => ({ stop_reason: "refusal", content: [], usage });
    await assert.rejects(
      () => callWithToolLoop(call, { messages: [] }, () => {}),
      /RESEARCH_REFUSED/
    );
  });

  await test("pause_turn cap: throws after 8 resumes", async () => {
    const call: CallModel = async () => textMsg("still going", "pause_turn");
    await assert.rejects(
      () => callWithToolLoop(call, { messages: [] }, () => {}),
      /RESEARCH_PAUSE_LOOP/
    );
  });

  await test("extractJson parses last text block", () => {
    const msg: ResearchMessage = {
      stop_reason: "end_turn",
      content: [
        { type: "server_tool_use", name: "web_search" },
        { type: "text", text: "preamble" },
        { type: "text", text: '{"candidates":[{"company":"A","website":"https://a.edu"}]}' },
      ],
      usage,
    };
    const parsed = extractJson(msg) as { candidates: unknown[] };
    assert.equal(parsed.candidates.length, 1);
  });

  await test("extractJson throws on no JSON", () => {
    assert.throws(() => extractJson(textMsg("not json")), /RESEARCH_BAD_JSON/);
  });

  await test("discoveryParams shape", () => {
    const p = discoveryParams({ segment: "nursing_program", niche: "PMHNP", region: "US Northeast", wanted: 30, excludeCompanies: ["Acme"] }) as {
      model: string; max_tokens: number; tools: unknown[]; messages: Array<{ content: string }>; output_config: unknown;
    };
    assert.equal(p.model, RESEARCH_MODEL);
    assert.ok(p.max_tokens >= 8000);
    assert.equal(p.tools.length, 2);
    assert.ok(p.messages[0].content.includes("PMHNP"));
    assert.ok(p.messages[0].content.includes("Acme"));
    assert.ok(p.output_config);
  });

  await test("candidateParams includes company, website, and no-fabrication rules", () => {
    const p = candidateParams({ segment: "nursing_program", niche: "", company: "Acme College", website: "https://acme.edu" }) as {
      messages: Array<{ content: string }>;
    };
    const prompt = p.messages[0].content;
    assert.ok(prompt.includes("Acme College"));
    assert.ok(prompt.includes("https://acme.edu"));
    assert.ok(/never guess|do not guess|NEVER guess/i.test(prompt));
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx tsx src/lib/outreach/research/claude.test.ts`
Expected: FAIL — `Cannot find module './claude'`

- [ ] **Step 4: Implement `claude.ts`**

```typescript
// src/lib/outreach/research/claude.ts
// Thin call layer over the Anthropic SDK for the research worker.
// Everything model-specific (model id, tools, prompts) lives in prompts.ts;
// this file owns the pause_turn resume loop, refusal handling, usage
// reporting, and JSON extraction. CallModel is the injection seam for tests.
import Anthropic from "@anthropic-ai/sdk";
import type { UsageLike } from "./cost";

export interface ResearchMessage {
  stop_reason: string | null;
  content: Array<Record<string, unknown>>;
  usage: UsageLike;
}

export type CallModel = (params: Record<string, unknown>) => Promise<ResearchMessage>;

export function realCallModel(): CallModel {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY
  return async (params) =>
    (await client.messages.create(
      params as unknown as Parameters<typeof client.messages.create>[0]
    )) as unknown as ResearchMessage;
}

const MAX_PAUSE_RESUMES = 8;

// Runs one logical request, transparently resuming server-tool pause_turn
// stops. onUsage fires once per underlying API response (cost accounting).
export async function callWithToolLoop(
  call: CallModel,
  params: Record<string, unknown>,
  onUsage: (u: UsageLike) => void
): Promise<ResearchMessage> {
  let current = { ...params };
  for (let i = 0; i <= MAX_PAUSE_RESUMES; i++) {
    const msg = await call(current);
    onUsage(msg.usage);
    if (msg.stop_reason === "refusal") throw new Error("RESEARCH_REFUSED");
    if (msg.stop_reason !== "pause_turn") return msg;
    current = {
      ...current,
      messages: [
        ...(current.messages as Array<Record<string, unknown>>),
        { role: "assistant", content: msg.content },
      ],
    };
  }
  throw new Error("RESEARCH_PAUSE_LOOP");
}

export function extractJson(msg: ResearchMessage): unknown {
  const texts = msg.content.filter((b) => b.type === "text");
  const last = texts[texts.length - 1];
  if (last && typeof last.text === "string") {
    try {
      return JSON.parse(last.text);
    } catch {
      /* fall through */
    }
  }
  throw new Error("RESEARCH_BAD_JSON");
}
```

- [ ] **Step 5: Implement `prompts.ts`**

```typescript
// src/lib/outreach/research/prompts.ts
// Model id, tool defs, JSON schemas, and prompt builders for lead research.
// Schemas use all-required + additionalProperties:false (structured-outputs
// constraint); empty string means "absent" — the pipeline interprets.

export const RESEARCH_MODEL = "claude-opus-5";

export const RESEARCH_TOOLS = [
  { type: "web_search_20260209", name: "web_search", max_uses: 8 },
  { type: "web_fetch_20260209", name: "web_fetch", max_uses: 8 },
];

export const DISCOVERY_SCHEMA = {
  type: "object",
  properties: {
    candidates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          website: { type: "string" },
        },
        required: ["company", "website"],
        additionalProperties: false,
      },
    },
  },
  required: ["candidates"],
  additionalProperties: false,
} as const;

export interface ResearchedLead {
  company: string;
  website: string;
  about: string;
  whyFit: string;
  useCaseHypothesis: string;
  source: string;
  decisionMakerName: string;
  decisionMakerTitle: string;
  linkedinUrl: string;
  email: string;
  emailSourceUrl: string;
  nameSourceUrl: string;
  sourceUrls: string[];
  draftSubject: string;
  draftBody: string;
}

export const LEAD_SCHEMA = {
  type: "object",
  properties: {
    company: { type: "string" },
    website: { type: "string" },
    about: { type: "string" },
    whyFit: { type: "string" },
    useCaseHypothesis: { type: "string" },
    source: { type: "string" },
    decisionMakerName: { type: "string" },
    decisionMakerTitle: { type: "string" },
    linkedinUrl: { type: "string" },
    email: { type: "string" },
    emailSourceUrl: { type: "string" },
    nameSourceUrl: { type: "string" },
    sourceUrls: { type: "array", items: { type: "string" } },
    draftSubject: { type: "string" },
    draftBody: { type: "string" },
  },
  required: [
    "company", "website", "about", "whyFit", "useCaseHypothesis", "source",
    "decisionMakerName", "decisionMakerTitle", "linkedinUrl", "email",
    "emailSourceUrl", "nameSourceUrl", "sourceUrls", "draftSubject", "draftBody",
  ],
  additionalProperties: false,
} as const;

const SEGMENT_CONTEXT: Record<string, string> = {
  nursing_program: "nursing schools and NCLEX-prep programs",
  testprep_academy: "test-prep academies (SAT/ACT/AP)",
  homeschool_charter: "homeschool charter programs",
  microschool: "microschools",
  school_district: "school districts",
  private_school: "private K-12 schools",
  intl_school: "international schools",
  library: "public library systems",
  publisher: "education publishers",
  agency: "education agencies/consultancies",
  corporate_ld: "corporate learning & development teams",
  other: "education organizations",
};

export function discoveryParams(input: {
  segment: string; niche: string; region: string; wanted: number; excludeCompanies: string[];
}): Record<string, unknown> {
  const kind = SEGMENT_CONTEXT[input.segment] ?? "education organizations";
  const exclude = input.excludeCompanies.length
    ? `\n\nDo NOT include any of these (already in our pipeline):\n${input.excludeCompanies.map((c) => `- ${c}`).join("\n")}`
    : "";
  return {
    model: RESEARCH_MODEL,
    max_tokens: 8192,
    tools: RESEARCH_TOOLS,
    output_config: { format: { type: "json_schema", schema: DISCOVERY_SCHEMA } },
    messages: [{
      role: "user",
      content:
`Find up to ${input.wanted} real, currently-operating ${kind}${input.niche ? ` — specifically: ${input.niche}` : ""}${input.region ? ` in ${input.region}` : ""} that could plausibly buy an AI voice-tutoring platform (Evelyn Learning) for their students or staff.

Use web search to find real institutions. For each, give the official organization name and its official website homepage URL. Prefer mid-sized organizations where a single decision-maker is reachable. Only include organizations you actually found via search — never invent names or URLs.${exclude}`,
    }],
  };
}

export function candidateParams(input: {
  segment: string; niche: string; company: string; website: string;
}): Record<string, unknown> {
  const kind = SEGMENT_CONTEXT[input.segment] ?? "education organization";
  return {
    model: RESEARCH_MODEL,
    max_tokens: 8192,
    tools: RESEARCH_TOOLS,
    output_config: { format: { type: "json_schema", schema: LEAD_SCHEMA } },
    messages: [{
      role: "user",
      content:
`Research this ${kind} as a sales lead for Evelyn Learning (AI voice-tutoring platform: live voice sessions with an AI tutor over an interactive whiteboard; students practice, get diagnostic feedback, and drill weak areas — strong fit for exam prep and skills training).

Organization: ${input.company}
Website: ${input.website}
${input.niche ? `Focus area: ${input.niche}\n` : ""}
Using web search and web fetch, research the organization's OWN website (programs, about, staff/leadership pages). Produce:

- about: 1-2 sentences on what they do, grounded in their site.
- whyFit: why Evelyn specifically helps THEM — cite something real and specific you found (a program, a stated challenge, a scale number).
- useCaseHypothesis: the concrete first use case they'd deploy.
- source: the single most informative page URL you used.
- decisionMakerName/decisionMakerTitle: a REAL person you found named on their site or an official directory who owns this decision (dean, director, head of L&D). If you cannot find a real named person, return empty strings.
- nameSourceUrl: the URL where that person is named (empty if none).
- email: the person's email ONLY if it is published on an official page you actually fetched. NEVER guess or construct an email — do not infer patterns like first.last@domain. If not published, return "".
- emailSourceUrl: the exact page URL where the email appears (empty if email is empty).
- linkedinUrl: the person's LinkedIn URL ONLY if you actually visited it; else "".
- sourceUrls: every URL you actually used.
- draftSubject/draftBody: a short (120-180 word) personalized intro email from Praveen at Evelyn Learning to that person (or "Hi there" if no person found). Reference the specific real thing from whyFit. Include this exact line on its own line where the demo link belongs: [DEMO_LINK]. End: "Best,\\nPraveen\\nEvelyn Learning". No pricing claims, no fake statistics.

Accuracy over completeness: an empty field is correct; an invented one is a serious failure.`,
    }],
  };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx tsx src/lib/outreach/research/claude.test.ts`
Expected: PASS (8 ok)

- [ ] **Step 7: Chain test and commit**

Append `&& npx tsx src/lib/outreach/research/claude.test.ts` to `test:outreach-research`.

```bash
npm run test:outreach-research
git add package.json package-lock.json src/lib/outreach/research/claude.ts src/lib/outreach/research/prompts.ts src/lib/outreach/research/claude.test.ts
git commit -m "feat(outreach): Claude call layer + research prompts/schemas (SDK bump)"
```

---

### Task 6: Research pipeline

**Files:**
- Create: `src/lib/outreach/research/pipeline.ts`
- Create: `src/lib/outreach/research/pipeline.test.ts`
- Modify: `package.json` (chain test)

**Interfaces:**
- Consumes: `CallModel`, `callWithToolLoop`, `extractJson` (Task 5); `priceUsageUsd`, `costCapUsd` (Task 3); `verifyEmailPublished` (Task 4); `validateLeadRows`, `insertLeads` (Task 1); `ResearchJob`, `Lead` models.
- Produces:
  - `interface PipelineDeps { call: CallModel; fetchFn?: typeof fetch }`
  - `researchedToLeadRow(r: ResearchedLead, opts: { segment: string; jobId: string; emailVerified: boolean }): Record<string, unknown>` — pure mapper (exported for tests). Email included only when `emailVerified`; `linkedinUrl` only when listed in `r.sourceUrls`; `currentDraft = { channel: "email", subject: r.draftSubject, body: r.draftBody }`; `source` = `r.source || "research-job:" + jobId`.
  - `processJob(jobId: string, deps: PipelineDeps): Promise<void>` — full run; all state transitions written to the job doc. Never throws for per-candidate errors.

- [ ] **Step 1: Write the failing test (pure mapper + orchestration with in-memory fakes)**

The orchestration test avoids Mongo by testing `researchedToLeadRow` (pure) and the exported helper `runCandidate` (see Step 3 — takes the candidate + deps, returns an outcome object without touching the DB). `processJob`'s DB glue is covered by the dev rehearsal in Task 8.

```typescript
// src/lib/outreach/research/pipeline.test.ts
import { strict as assert } from "node:assert";
import { researchedToLeadRow, runCandidate } from "./pipeline";
import type { ResearchedLead } from "./prompts";
import type { CallModel, ResearchMessage } from "./claude";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const usage = { input_tokens: 10, output_tokens: 5 };
const researched = (over: Partial<ResearchedLead> = {}): ResearchedLead => ({
  company: "Acme Nursing College", website: "https://acme.edu",
  about: "Nursing school", whyFit: "NCLEX pass-rate pressure",
  useCaseHypothesis: "NCLEX drill", source: "https://acme.edu/programs",
  decisionMakerName: "Dana Smith", decisionMakerTitle: "Dean",
  linkedinUrl: "", email: "dsmith@acme.edu",
  emailSourceUrl: "https://acme.edu/staff", nameSourceUrl: "https://acme.edu/staff",
  sourceUrls: ["https://acme.edu/programs", "https://acme.edu/staff"],
  draftSubject: "NCLEX prep at Acme", draftBody: "Hi Dana...\n[DEMO_LINK]\nBest,\nPraveen\nEvelyn Learning",
  ...over,
});
const leadMsg = (r: ResearchedLead): ResearchMessage =>
  ({ stop_reason: "end_turn", content: [{ type: "text", text: JSON.stringify(r) }], usage });

(async () => {
  await test("mapper: verified email kept, emailVerified true", () => {
    const row = researchedToLeadRow(researched(), { segment: "nursing_program", jobId: "j1", emailVerified: true }) as {
      decisionMaker: { email?: string; emailVerified: boolean }; currentDraft: { body: string }; segment: string;
    };
    assert.equal(row.decisionMaker.email, "dsmith@acme.edu");
    assert.equal(row.decisionMaker.emailVerified, true);
    assert.equal(row.segment, "nursing_program");
    assert.ok(row.currentDraft.body.includes("[DEMO_LINK]"));
  });

  await test("mapper: unverified email stripped", () => {
    const row = researchedToLeadRow(researched(), { segment: "nursing_program", jobId: "j1", emailVerified: false }) as {
      decisionMaker: { email?: string; emailVerified: boolean };
    };
    assert.equal(row.decisionMaker.email, undefined);
    assert.equal(row.decisionMaker.emailVerified, false);
  });

  await test("mapper: linkedinUrl kept only when in sourceUrls", () => {
    const kept = researchedToLeadRow(
      researched({ linkedinUrl: "https://linkedin.com/in/dana", sourceUrls: ["https://linkedin.com/in/dana"] }),
      { segment: "nursing_program", jobId: "j1", emailVerified: false }
    ) as { decisionMaker: { linkedinUrl?: string } };
    assert.equal(kept.decisionMaker.linkedinUrl, "https://linkedin.com/in/dana");

    const dropped = researchedToLeadRow(
      researched({ linkedinUrl: "https://linkedin.com/in/dana", sourceUrls: ["https://acme.edu"] }),
      { segment: "nursing_program", jobId: "j1", emailVerified: false }
    ) as { decisionMaker: { linkedinUrl?: string } };
    assert.equal(dropped.decisionMaker.linkedinUrl, undefined);
  });

  await test("runCandidate: published email -> verified lead row", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("Dean Dana Smith — dsmith@acme.edu")) as typeof fetch;
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn }, () => {}
    );
    assert.equal(out.outcome, "inserted");
    const row = out.row as { decisionMaker: { emailVerified: boolean } };
    assert.equal(row.decisionMaker.emailVerified, true);
  });

  await test("runCandidate: email absent from page -> stripped, outcome no_email", async () => {
    const call: CallModel = async () => leadMsg(researched());
    const fetchFn = (async () => new Response("no emails on this page")) as typeof fetch;
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn }, () => {}
    );
    assert.equal(out.outcome, "no_email");
    const row = out.row as { decisionMaker: { email?: string } };
    assert.equal(row.decisionMaker.email, undefined);
    assert.ok(out.note && /not verified|not found/i.test(out.note));
  });

  await test("runCandidate: model returns no email at all -> no_email, no fetch attempted", async () => {
    const call: CallModel = async () => leadMsg(researched({ email: "", emailSourceUrl: "" }));
    const fetchFn = (async () => { throw new Error("should not fetch"); }) as unknown as typeof fetch;
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn }, () => {}
    );
    assert.equal(out.outcome, "no_email");
  });

  await test("runCandidate: no real person found -> discarded", async () => {
    const call: CallModel = async () =>
      leadMsg(researched({ decisionMakerName: "", decisionMakerTitle: "", email: "", emailSourceUrl: "", nameSourceUrl: "" }));
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn: (async () => new Response("")) as typeof fetch }, () => {}
    );
    assert.equal(out.outcome, "discarded");
  });

  await test("runCandidate: refusal -> error outcome with note, does not throw", async () => {
    const call: CallModel = async () => ({ stop_reason: "refusal", content: [], usage });
    const out = await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn: (async () => new Response("")) as typeof fetch }, () => {}
    );
    assert.equal(out.outcome, "error");
    assert.ok(out.note?.includes("RESEARCH_REFUSED"));
  });

  await test("runCandidate: reports usage via onUsage", async () => {
    let calls = 0;
    const call: CallModel = async () => leadMsg(researched({ email: "", emailSourceUrl: "" }));
    await runCandidate(
      { company: "Acme Nursing College", website: "https://acme.edu" },
      { segment: "nursing_program", niche: "", jobId: "j1" },
      { call, fetchFn: (async () => new Response("")) as typeof fetch },
      () => { calls++; }
    );
    assert.equal(calls, 1);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/outreach/research/pipeline.test.ts`
Expected: FAIL — `Cannot find module './pipeline'`

- [ ] **Step 3: Implement**

```typescript
// src/lib/outreach/research/pipeline.ts
// Orchestrates one ResearchJob: discovery -> per-candidate research ->
// anti-fabrication gate -> insert as staged Lead. All state lives on the
// job doc so a restart resumes cleanly. Per-candidate errors never kill
// the job; 3 consecutive errors, the cost cap, or a cancel do.
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { ResearchJob, type IResearchJob, type ICandidate } from "@/models/ResearchJob";
import { callWithToolLoop, extractJson, type CallModel } from "./claude";
import { discoveryParams, candidateParams, type ResearchedLead } from "./prompts";
import { priceUsageUsd, costCapUsd, type UsageLike } from "./cost";
import { verifyEmailPublished } from "./verify-email";
import { validateLeadRows, insertLeads } from "../import-leads";

export interface PipelineDeps {
  call: CallModel;
  fetchFn?: typeof fetch;
}

export function researchedToLeadRow(
  r: ResearchedLead,
  opts: { segment: string; jobId: string; emailVerified: boolean }
): Record<string, unknown> {
  const linkedinOk = r.linkedinUrl && r.sourceUrls.includes(r.linkedinUrl);
  return {
    company: r.company,
    segment: opts.segment,
    about: r.about,
    whyFit: r.whyFit,
    useCaseHypothesis: r.useCaseHypothesis,
    website: r.website,
    source: r.source || `research-job:${opts.jobId}`,
    decisionMaker: {
      name: r.decisionMakerName,
      title: r.decisionMakerTitle,
      ...(linkedinOk ? { linkedinUrl: r.linkedinUrl } : {}),
      ...(opts.emailVerified && r.email ? { email: r.email } : {}),
      emailVerified: opts.emailVerified && !!r.email,
    },
    currentDraft: { channel: "email", subject: r.draftSubject, body: r.draftBody },
    notes: `Researched by job ${opts.jobId}. Sources: ${r.sourceUrls.join(", ")}`,
  };
}

export interface CandidateOutcome {
  outcome: "inserted" | "no_email" | "discarded" | "error";
  row?: Record<string, unknown>;
  note?: string;
}

// Research one candidate. DB-free: returns the mapped row (or a discard/
// error outcome); the caller validates, dedupes, and saves.
export async function runCandidate(
  candidate: { company: string; website: string },
  job: { segment: string; niche: string; jobId: string },
  deps: PipelineDeps,
  onUsage: (u: UsageLike) => void
): Promise<CandidateOutcome> {
  try {
    const msg = await callWithToolLoop(
      deps.call,
      candidateParams({
        segment: job.segment, niche: job.niche,
        company: candidate.company, website: candidate.website,
      }),
      onUsage
    );
    const r = extractJson(msg) as ResearchedLead;

    if (!r.decisionMakerName && !r.email) {
      return { outcome: "discarded", note: "no real decision-maker found" };
    }

    let emailVerified = false;
    let note: string | undefined;
    if (r.email && r.emailSourceUrl) {
      emailVerified = await verifyEmailPublished(r.email, r.emailSourceUrl, deps.fetchFn ?? fetch);
      if (!emailVerified) note = `email ${r.email} not verified at ${r.emailSourceUrl} — stripped`;
    } else if (r.email && !r.emailSourceUrl) {
      note = `email ${r.email} had no source URL — stripped`;
    } else {
      note = "no published email found";
    }

    const row = researchedToLeadRow(r, {
      segment: job.segment, jobId: job.jobId, emailVerified,
    });
    return { outcome: emailVerified ? "inserted" : "no_email", row, note };
  } catch (e) {
    return { outcome: "error", note: e instanceof Error ? e.message : String(e) };
  }
}

// Full job run. Claims nothing itself — the worker sets status: "running"
// before calling. Safe to re-enter after a crash: only "pending" candidates
// are processed.
export async function processJob(jobId: string, deps: PipelineDeps): Promise<void> {
  await connectDB();
  const job = (await ResearchJob.findById(jobId)) as IResearchJob | null;
  if (!job) return;

  const addUsage = async (u: UsageLike) => {
    job.costUsd += priceUsageUsd(u);
    job.tokens.input += (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
    job.tokens.output += u.output_tokens ?? 0;
  };

  try {
    // Phase 1: discovery (skipped on resume if candidates already exist)
    if (job.candidates.length === 0) {
      const existing = await Lead.find({ segment: job.segment }, { company: 1 }).lean();
      const msg = await callWithToolLoop(
        deps.call,
        discoveryParams({
          segment: job.segment, niche: job.niche ?? "", region: job.region ?? "",
          wanted: Math.min(25, Math.ceil(job.count * 1.5)),
          excludeCompanies: existing.map((l) => l.company as string),
        }),
        (u) => { void addUsage(u); }
      );
      const parsed = extractJson(msg) as { candidates: Array<{ company: string; website: string }> };
      job.candidates = parsed.candidates.map((c) => ({
        company: c.company, website: c.website, status: "pending" as const,
      })) as unknown as ICandidate[];
      await job.save();
    }

    // Phase 2: per-candidate research
    let consecutiveErrors = 0;
    for (const candidate of job.candidates) {
      if (candidate.status !== "pending") continue;
      if (job.progress.inserted + job.progress.noEmail >= job.count) break;

      // Re-read status for cancel awareness (route flips it to "cancelled")
      const fresh = await ResearchJob.findById(jobId, { status: 1 }).lean() as { status: string } | null;
      if (fresh?.status === "cancelled") { job.status = "cancelled"; await job.save(); return; }

      if (job.costUsd >= costCapUsd()) {
        job.status = "aborted_cost";
        await job.save();
        return;
      }

      const out = await runCandidate(
        { company: candidate.company, website: candidate.website },
        { segment: job.segment, niche: job.niche ?? "", jobId: String(job._id) },
        deps,
        (u) => { void addUsage(u); }
      );

      if (out.outcome === "error") {
        consecutiveErrors++;
        candidate.status = "error";
        candidate.note = out.note;
        job.progress.errors++;
        if (consecutiveErrors >= 3) {
          job.status = "failed";
          job.error = `3 consecutive candidate errors; last: ${out.note}`;
          await job.save();
          return;
        }
      } else if (out.outcome === "discarded") {
        consecutiveErrors = 0;
        candidate.status = "discarded";
        candidate.note = out.note;
        job.progress.discarded++;
      } else {
        consecutiveErrors = 0;
        const { docs, counts } = validateLeadRows([out.row]);
        if (counts.invalid > 0) {
          candidate.status = "discarded";
          candidate.note = `schema-invalid: ${counts.errors[0]}`;
          job.progress.discarded++;
        } else {
          const inserted = await insertLeads(docs);
          if (inserted.skippedDupes > 0) {
            candidate.status = "dupe";
            candidate.note = "already in pipeline";
            job.progress.skippedDupes++;
          } else {
            candidate.status = out.outcome === "inserted" ? "inserted" : "no_email";
            candidate.note = out.note;
            if (out.outcome === "inserted") job.progress.inserted++;
            else { job.progress.inserted++; job.progress.noEmail++; }
          }
        }
      }
      await job.save();
    }

    job.status = "done";
    await job.save();
  } catch (e) {
    job.status = "failed";
    job.error = e instanceof Error ? e.message : String(e);
    await job.save();
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/outreach/research/pipeline.test.ts`
Expected: PASS (9 ok)

- [ ] **Step 5: Chain test and commit**

Append `&& npx tsx src/lib/outreach/research/pipeline.test.ts` to `test:outreach-research`.

```bash
npm run test:outreach-research && npm run test:outreach
git add src/lib/outreach/research/pipeline.ts src/lib/outreach/research/pipeline.test.ts package.json
git commit -m "feat(outreach): research pipeline with anti-fabrication gate and cost cap"
```

---

### Task 7: Worker + instrumentation wiring

**Files:**
- Create: `src/lib/outreach/research/worker.ts`
- Modify: `src/instrumentation.ts` (new block after the reply-watcher block)
- Modify: `.env.local.example` (document new vars)

**Interfaces:**
- Consumes: `processJob`, `realCallModel`.
- Produces:
  - `startResearchWorker(cronExpression?: string): void` (default `"* * * * *"`)
  - `stopResearchWorker(): void`
  - `isResearchWorkerActive(): boolean`
  - `runResearchTick(): Promise<{ ran: boolean; jobId?: string }>` — claims one job (first a stale `running` job for crash-resume, else oldest `queued` → flips to `running`), then `processJob`. Overlap-guarded.

No unit test (it's glue mirroring `reply-watcher.ts`, whose structure is already proven); verified in Task 8's rehearsal.

- [ ] **Step 1: Implement `worker.ts` (mirror `reply-watcher.ts` exactly — globalThis state, Symbol.for key)**

```typescript
// src/lib/outreach/research/worker.ts
// Cron worker for lead-research jobs. Structure mirrors
// src/lib/outreach/reply-watcher.ts — including the globalThis state rule
// (instrumentation.ts and route handlers load SEPARATE module instances;
// see reply-watcher.ts:12-26 for the incident writeup).
import cron, { ScheduledTask } from "node-cron";
import { connectDB } from "@/lib/db";
import { ResearchJob } from "@/models/ResearchJob";
import { processJob } from "./pipeline";
import { realCallModel } from "./claude";

interface WorkerState {
  isWorkerRunning: boolean;
  workerTask: ScheduledTask | null;
  isJobInProgress: boolean;
}

const WORKER_STATE_KEY = Symbol.for("evelyn.outreach.researchWorkerState");

function workerState(): WorkerState {
  const g = globalThis as unknown as Record<symbol, WorkerState | undefined>;
  if (!g[WORKER_STATE_KEY]) {
    g[WORKER_STATE_KEY] = { isWorkerRunning: false, workerTask: null, isJobInProgress: false };
  }
  return g[WORKER_STATE_KEY];
}

// Claim and run at most one job. A "running" job with no in-process run is
// a crash leftover — resume it before touching the queue.
export async function runResearchTick(): Promise<{ ran: boolean; jobId?: string }> {
  const st = workerState();
  if (st.isJobInProgress) return { ran: false };
  st.isJobInProgress = true;
  try {
    await connectDB();
    let job = await ResearchJob.findOne({ status: "running" }).sort({ createdAt: 1 });
    if (!job) {
      job = await ResearchJob.findOneAndUpdate(
        { status: "queued" },
        { $set: { status: "running" } },
        { sort: { createdAt: 1 }, new: true }
      );
    }
    if (!job) return { ran: false };
    console.log(`[Research Worker] Processing job ${job._id}`);
    await processJob(String(job._id), { call: realCallModel() });
    return { ran: true, jobId: String(job._id) };
  } catch (e) {
    console.error("[Research Worker] tick error:", e);
    return { ran: false };
  } finally {
    st.isJobInProgress = false;
  }
}

export function startResearchWorker(cronExpression: string = "* * * * *"): void {
  const st = workerState();
  if (st.isWorkerRunning) {
    console.log("[Research Worker] Already running");
    return;
  }
  if (!cron.validate(cronExpression)) {
    console.error(`[Research Worker] Invalid cron expression: ${cronExpression}`);
    return;
  }
  st.workerTask = cron.schedule(cronExpression, async () => {
    const r = await runResearchTick();
    if (r.ran) console.log(`[Research Worker] Finished job ${r.jobId}`);
  });
  st.isWorkerRunning = true;
  console.log(`[Research Worker] Started with schedule: ${cronExpression}`);
}

export function stopResearchWorker(): void {
  const st = workerState();
  if (st.workerTask) {
    st.workerTask.stop();
    st.workerTask = null;
    st.isWorkerRunning = false;
    console.log("[Research Worker] Stopped");
  }
}

export function isResearchWorkerActive(): boolean {
  return workerState().isWorkerRunning;
}
```

- [ ] **Step 2: Wire into `src/instrumentation.ts`**

Add directly after the reply-watcher `if/else` block (same shape — the setTimeout + try/catch comment discipline is load-bearing, see the comment in the existing block):

```typescript
    // Lead-research worker: claims queued ResearchJobs and runs Claude-powered
    // lead research (set ENABLE_LEAD_RESEARCH=true in production env).
    if (process.env.ENABLE_LEAD_RESEARCH === 'true') {
      setTimeout(async () => {
        try {
          const { startResearchWorker } = await import('@/lib/outreach/research/worker');
          startResearchWorker('* * * * *');
        } catch (error) {
          // Same rule as the watcher block above: a throw here is an unhandled
          // rejection in a bare setTimeout — log, never crash the process.
          console.error('[Instrumentation] Failed to start lead-research worker:', error);
        }
      }, 5000);
    } else {
      console.log('[Instrumentation] Lead-research worker disabled (set ENABLE_LEAD_RESEARCH=true to enable)');
    }
```

- [ ] **Step 3: Document env vars in `.env.local.example`**

Add near the outreach section:

```bash
# Lead-research worker (in-console "Find leads")
ENABLE_LEAD_RESEARCH=false
LEAD_RESEARCH_COST_CAP_USD=20
# uses existing ANTHROPIC_API_KEY
```

- [ ] **Step 4: Typecheck and commit**

Run: `npx tsc --noEmit`
Expected: no new errors (pre-existing errors, if any, unchanged)

```bash
git add src/lib/outreach/research/worker.ts src/instrumentation.ts .env.local.example
git commit -m "feat(outreach): lead-research cron worker wired into instrumentation"
```

---

### Task 8: API routes (research create/list, cancel, import)

**Files:**
- Create: `src/app/api/admin/outreach/research/route.ts`
- Create: `src/app/api/admin/outreach/research/[id]/cancel/route.ts`
- Create: `src/app/api/admin/outreach/import/route.ts`
- Test: `npm run test:outreach-guards` (directory walks auto-cover new files) + manual curl rehearsal

**Interfaces:**
- Consumes: `ResearchJob`, `validateLeadRows`/`insertLeads`, `isResearchWorkerActive`, `runResearchTick`, `LEAD_SEGMENTS`.
- Produces (HTTP):
  - `POST /api/admin/outreach/research` body `{ segment, niche?, region?, count }` → `201 { job }` | `409 { error: "A research job is already queued or running" }` | `400`
  - `GET /api/admin/outreach/research` → `{ workerActive: boolean, active: job | null, recent: job[] }` (recent = last 10 terminal jobs)
  - `POST /api/admin/outreach/research/[id]/cancel` → `{ success: true, job }` | `409` if already terminal
  - `POST /api/admin/outreach/import` body `{ rows: unknown[], dryRun?: boolean }` → `{ counts }` (dryRun: validation only)

- [ ] **Step 1: Implement `research/route.ts`**

```typescript
// src/app/api/admin/outreach/research/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ResearchJob } from "@/models/ResearchJob";
import { LEAD_SEGMENTS } from "@/lib/outreach/enums";
import { isResearchWorkerActive } from "@/lib/outreach/research/worker";

// GET - worker status + active job + recent jobs
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const active = await ResearchJob.findOne({ status: { $in: ["queued", "running"] } })
      .sort({ createdAt: 1 });
    const recent = await ResearchJob.find({ status: { $nin: ["queued", "running"] } })
      .sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ workerActive: isResearchWorkerActive(), active, recent });
  } catch (error) {
    console.error("[OUTREACH] research GET Error:", error);
    return NextResponse.json({ error: "Failed to load research jobs" }, { status: 500 });
  }
}

// POST - create a research job (one active at a time)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { segment, niche = "", region = "", count } = body ?? {};
    if (!LEAD_SEGMENTS.includes(segment)) {
      return NextResponse.json({ error: "Invalid segment" }, { status: 400 });
    }
    const n = Number(count);
    if (!Number.isInteger(n) || n < 1 || n > 25) {
      return NextResponse.json({ error: "count must be an integer 1-25" }, { status: 400 });
    }
    await connectDB();
    const existing = await ResearchJob.findOne({ status: { $in: ["queued", "running"] } });
    if (existing) {
      return NextResponse.json(
        { error: "A research job is already queued or running" }, { status: 409 }
      );
    }
    const job = await ResearchJob.create({
      segment, niche: String(niche).slice(0, 200), region: String(region).slice(0, 200), count: n,
    });
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("[OUTREACH] research POST Error:", error);
    return NextResponse.json({ error: "Failed to create research job" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Implement `research/[id]/cancel/route.ts`**

```typescript
// src/app/api/admin/outreach/research/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ResearchJob } from "@/models/ResearchJob";

// POST - cancel a queued/running job. The pipeline re-reads status between
// candidates, so a running job stops at the next candidate boundary;
// already-inserted leads are kept.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const job = await ResearchJob.findOneAndUpdate(
      { _id: id, status: { $in: ["queued", "running"] } },
      { $set: { status: "cancelled" } },
      { new: true }
    );
    if (!job) {
      return NextResponse.json({ error: "Job not found or already finished" }, { status: 409 });
    }
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("[OUTREACH] research cancel Error:", error);
    return NextResponse.json({ error: "Failed to cancel job" }, { status: 500 });
  }
}
```

Note: check the repo's Next version's dynamic-params convention before copying — if existing `[id]` routes type params as `{ params: { id: string } }` (non-Promise), match them.

- [ ] **Step 3: Implement `import/route.ts`**

```typescript
// src/app/api/admin/outreach/import/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { validateLeadRows, insertLeads } from "@/lib/outreach/import-leads";

// POST - paste-JSON lead import. { rows, dryRun } -> counts.
// dryRun validates without writing (mirror of the CLI's default mode).
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const rows = body?.rows;
    if (!Array.isArray(rows)) {
      return NextResponse.json({ error: "rows must be a JSON array" }, { status: 400 });
    }
    if (rows.length > 200) {
      return NextResponse.json({ error: "Max 200 rows per import" }, { status: 400 });
    }
    const { docs, counts } = validateLeadRows(rows);
    if (body?.dryRun) {
      return NextResponse.json({ counts, dryRun: true });
    }
    await connectDB();
    const inserted = await insertLeads(docs);
    return NextResponse.json({
      counts: { ...counts, inserted: inserted.inserted, skippedDupes: inserted.skippedDupes },
    });
  } catch (error) {
    console.error("[OUTREACH] import Error:", error);
    return NextResponse.json({ error: "Failed to import leads" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run guards + typecheck**

Run: `npm run test:outreach-guards && npx tsc --noEmit`
Expected: guards PASS (new routes/files hold the invariants), no new type errors

- [ ] **Step 5: Dev rehearsal (manual, local dev server + dev Mongo)**

Start `npm run dev`, sign in to `/admin`, then from the browser console (session cookie rides along):

```javascript
// 1. Import dry-run
await (await fetch("/api/admin/outreach/import", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ dryRun: true, rows: [{ company: "T1", segment: "nursing_program", decisionMaker: { name: "A", title: "B" } }] }) })).json();
// expect counts.valid: 1, dryRun: true

// 2. Create job (expect 201), duplicate create (expect 409)
await (await fetch("/api/admin/outreach/research", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ segment: "nursing_program", niche: "test", count: 1 }) })).json();

// 3. GET status shows the active job
await (await fetch("/api/admin/outreach/research")).json();

// 4. Cancel it
// (replace <id> from step 2's response)
await (await fetch("/api/admin/outreach/research/<id>/cancel", { method: "POST" })).json();
```

Expected: 201 → 409 → active job visible → cancel flips to `cancelled`.
Also verify unauthenticated: `curl -s -X POST localhost:3000/api/admin/outreach/import -d '{}'` → `{"error":"Unauthorized"}`.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/outreach/research src/app/api/admin/outreach/import
git commit -m "feat(outreach): research job + import API routes (self-gated)"
```

---

### Task 9: "Find leads" console tab

**Files:**
- Create: `src/app/admin/outreach/FindLeadsTab.tsx`
- Modify: `src/app/admin/outreach/OutreachConsole.tsx` (add `"find"` to `TabKey`, tab button, render)

**Interfaces:**
- Consumes: `GET/POST /api/admin/outreach/research`, `POST .../research/[id]/cancel`, `POST .../import`. Type-only imports from `@/lib/outreach/enums` (`LEAD_SEGMENTS` is a value import from `enums.ts` — that file is client-safe by design; NEVER import from `@/models`).
- Produces: `export default function FindLeadsTab(): JSX.Element` — self-contained (fetches its own data; no lead-list props needed).

- [ ] **Step 1: Implement `FindLeadsTab.tsx`**

```tsx
// src/app/admin/outreach/FindLeadsTab.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Play, Square, Upload } from "lucide-react";
import { LEAD_SEGMENTS } from "@/lib/outreach/enums";
import type { LeadSegment, ResearchJobStatus, CandidateStatus } from "@/lib/outreach/enums";

interface CandidateJSON {
  company: string;
  website: string;
  status: CandidateStatus;
  note?: string;
}

interface ResearchJobJSON {
  _id: string;
  segment: LeadSegment;
  niche?: string;
  region?: string;
  count: number;
  status: ResearchJobStatus;
  candidates: CandidateJSON[];
  progress: { inserted: number; noEmail: number; skippedDupes: number; discarded: number; errors: number };
  costUsd: number;
  createdAt: string;
}

interface ResearchState {
  workerActive: boolean;
  active: ResearchJobJSON | null;
  recent: ResearchJobJSON[];
}

const TERMINAL_LABEL: Record<string, string> = {
  done: "Done", failed: "Failed", aborted_cost: "Stopped at cost cap", cancelled: "Cancelled",
};

export default function FindLeadsTab({ onLeadsChanged }: { onLeadsChanged: () => void }) {
  const [state, setState] = useState<ResearchState | null>(null);
  const [segment, setSegment] = useState<LeadSegment>("nursing_program");
  const [niche, setNiche] = useState("");
  const [region, setRegion] = useState("");
  const [count, setCount] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [importText, setImportText] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/outreach/research");
      if (res.ok) setState(await res.json());
    } catch { /* transient poll failure — keep last state */ }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [refresh]);

  const createJob = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/outreach/research", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ segment, niche, region, count }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Failed to create job");
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const cancelJob = async (id: string) => {
    await fetch(`/api/admin/outreach/research/${id}/cancel`, { method: "POST" });
    await refresh();
  };

  const runImport = async (dryRun: boolean) => {
    setImportBusy(true);
    setImportResult(null);
    try {
      let rows: unknown;
      try { rows = JSON.parse(importText); }
      catch { setImportResult("Not valid JSON"); return; }
      const res = await fetch("/api/admin/outreach/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rows, dryRun }),
      });
      const data = await res.json();
      if (!res.ok) { setImportResult(data.error ?? "Import failed"); return; }
      const c = data.counts;
      setImportResult(
        `${dryRun ? "[dry-run] " : ""}valid ${c.valid}, invalid ${c.invalid}` +
        (dryRun ? "" : `, inserted ${c.inserted}, dupes ${c.skippedDupes}`) +
        (c.errors?.length ? ` — ${c.errors.slice(0, 3).join("; ")}` : "")
      );
      if (!dryRun) onLeadsChanged();
    } finally {
      setImportBusy(false);
    }
  };

  const active = state?.active ?? null;
  const jobDone = (j: ResearchJobJSON) =>
    `${j.progress.inserted} inserted (${j.progress.noEmail} no-email), ${j.progress.skippedDupes} dupes, ${j.progress.discarded} discarded, ${j.progress.errors} errors — $${j.costUsd.toFixed(2)}`;

  return (
    <div className="space-y-8">
      {/* New job form */}
      <section className="rounded-lg border p-4 space-y-3">
        <h2 className="font-semibold">Find leads</h2>
        {state && !state.workerActive && (
          <p className="text-sm text-amber-600">
            Research worker is off (ENABLE_LEAD_RESEARCH) — jobs will queue but not run.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <label className="text-sm">
            Segment
            <select value={segment} onChange={(e) => setSegment(e.target.value as LeadSegment)}
              className="mt-1 w-full rounded border px-2 py-1.5" disabled={!!active}>
              {LEAD_SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm">
            Niche (optional)
            <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. PMHNP programs"
              className="mt-1 w-full rounded border px-2 py-1.5" disabled={!!active} />
          </label>
          <label className="text-sm">
            Region (optional)
            <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. US Northeast"
              className="mt-1 w-full rounded border px-2 py-1.5" disabled={!!active} />
          </label>
          <label className="text-sm">
            Count
            <input type="number" min={1} max={25} value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-1 w-full rounded border px-2 py-1.5" disabled={!!active} />
          </label>
        </div>
        <button onClick={createJob} disabled={submitting || !!active}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Start research
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </section>

      {/* Active job */}
      {active && (
        <section className="rounded-lg border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {active.status === "queued" ? "Queued" : "Researching"}: {active.segment}
              {active.niche ? ` · ${active.niche}` : ""} ({active.count} wanted)
            </h3>
            <button onClick={() => cancelJob(active._id)}
              className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm">
              <Square className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>
          <p className="text-sm text-gray-600">{jobDone(active)}</p>
          <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
            {active.candidates.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className={
                  c.status === "inserted" ? "text-green-600" :
                  c.status === "pending" ? "text-gray-400" :
                  c.status === "error" ? "text-red-600" : "text-amber-600"
                }>{c.status}</span>
                <span>{c.company}</span>
                {c.note && <span className="text-gray-500">— {c.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent jobs */}
      {state && state.recent.length > 0 && (
        <section className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Recent jobs</h3>
          <ul className="space-y-1 text-sm">
            {state.recent.map((j) => (
              <li key={j._id}>
                <span className="font-medium">{TERMINAL_LABEL[j.status] ?? j.status}</span>{" "}
                {j.segment}{j.niche ? ` · ${j.niche}` : ""} — {jobDone(j)}
                <span className="text-gray-500"> · {new Date(j.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Import JSON */}
      <section className="rounded-lg border p-4 space-y-2">
        <h3 className="font-semibold">Import JSON</h3>
        <p className="text-sm text-gray-600">
          Paste a JSON array matching the Lead schema (e.g. from a Claude research chat).
        </p>
        <textarea value={importText} onChange={(e) => setImportText(e.target.value)}
          rows={6} className="w-full rounded border p-2 font-mono text-xs"
          placeholder='[{"company": "...", "segment": "nursing_program", ...}]' />
        <div className="flex gap-2">
          <button onClick={() => runImport(true)} disabled={importBusy || !importText.trim()}
            className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">
            Dry run
          </button>
          <button onClick={() => runImport(false)} disabled={importBusy || !importText.trim()}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50">
            {importBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import
          </button>
        </div>
        {importResult && <p className="text-sm">{importResult}</p>}
      </section>
    </div>
  );
}
```

Match the existing tabs' styling idioms while implementing — copy class patterns from `ReviewQueueTab.tsx` rather than inventing new ones; the JSX above is the structure, not pixel-final styling.

- [ ] **Step 2: Wire the tab into `OutreachConsole.tsx`**

- Change `type TabKey = "review" | "today" | "pipeline";` → `type TabKey = "review" | "today" | "pipeline" | "find";`
- Add `import FindLeadsTab from "./FindLeadsTab";`
- Add a "Find leads" button wherever the three existing tab buttons render (copy the existing button idiom exactly).
- Render `{tab === "find" && <FindLeadsTab onLeadsChanged={refetchLeads} />}` next to the other tab renders — `refetchLeads` = whatever existing callback the console uses to reload `leads` after mutations (find it in the file; if none exists, pass `() => window.location.reload()` — imports are rare).

- [ ] **Step 3: Guards + typecheck + build**

Run: `npm run test:outreach-guards && npx tsc --noEmit && npm run build`
Expected: guards PASS (no value-imports from `@/models` in the new client file), build succeeds

- [ ] **Step 4: Manual verify in dev**

`npm run dev` → `/admin/outreach` → "Find leads" tab: form renders with all 12 segments, import dry-run of a 1-row array reports `valid 1`, creating a job shows the queued card with worker-off warning (ENABLE_LEAD_RESEARCH unset locally), cancel works.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/outreach/FindLeadsTab.tsx src/app/admin/outreach/OutreachConsole.tsx
git commit -m "feat(outreach): Find-leads console tab with job progress + JSON import"
```

---

### Task 10: End-to-end live smoke + final verification

**Files:** none new (verification task)

- [ ] **Step 1: Full test suite**

Run: `npm run test:outreach && npx tsc --noEmit && npm run build`
Expected: all pass

- [ ] **Step 2: One live research job in dev (real API, costs ~$1-2)**

With `ANTHROPIC_API_KEY` set and dev Mongo running:
`ENABLE_LEAD_RESEARCH=true npm run dev`, then create a job from the tab: segment `nursing_program`, niche `accelerated BSN programs`, count `2`. Watch the tab.

Expected:
- Job flips queued → running within a minute; candidates appear after discovery.
- Each processed candidate lands as inserted / no_email / discarded / dupe with a note.
- Any lead with an email has `emailVerified: true` and the email really appears at its `emailSourceUrl` (spot-check by opening the URL).
- `costUsd` is nonzero and plausible (< $3 for count 2).
- Inserted leads appear in the Review Queue tab with `currentDraft` containing `[DEMO_LINK]`.

- [ ] **Step 3: Cancel + cost-cap rehearsal**

- Start another 2-count job and cancel mid-run: it stops at the next candidate boundary; inserted leads remain.
- Set `LEAD_RESEARCH_COST_CAP_USD=0.01`, start a job: it aborts `aborted_cost` after the first usage report.
- Unset the override afterwards.

- [ ] **Step 4: Clean up dev test leads, commit any fixes**

Delete test leads from dev DB (staged leads created by the smoke jobs). Commit anything fixed during the smoke run:

```bash
git add -A && git commit -m "fix(outreach): live-smoke fixes for lead research"  # only if changes exist
```

- [ ] **Step 5: Deploy notes (do NOT deploy without the owner)**

Deploy is owner-gated. When approved: use `./deploy-to-production.sh` (fast path — this change touches no blog/speaker content), then on the server set `ENABLE_LEAD_RESEARCH=true` and `LEAD_RESEARCH_COST_CAP_USD=20` in the prod env and `pm2 restart` (remember: `pm2 --update-env` never removes deleted vars, only changed ones). Verify: `/admin/outreach` → Find leads tab shows "worker active" (no amber warning), then run one real 20-count nursing batch with the owner watching.

---

## Self-review notes (already applied)

- Spec coverage: importer lib (T1), model (T2), cost (T3), gate (T4), Claude layer (T5), pipeline incl. resume/cancel/cap/consecutive-errors (T6), worker+instrumentation+env (T7), 4 routes (T8), tab+import UI (T9), live verification + deploy notes (T10). Guards auto-cover new files — no guard edits needed.
- The spec's "6 segments" is the solutions-page count; the Lead enum has 12 — the form uses `LEAD_SEGMENTS` (all 12), which is strictly more capable and matches the model validation.
- Type consistency: `ImportCounts`/`validateLeadRows`/`insertLeads` (T1) used in T6/T8; `UsageLike` (T3) used in T5/T6; `CallModel`/`ResearchMessage` (T5) used in T6; `ResearchedLead` (T5) used in T6; candidate statuses (T2) match pipeline writes (T6) and UI colors (T9).
