# CRM round 2 — editable pipeline, delete with suppression, open product/segment lists — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the outreach Pipeline a table the operator can actually work in — one editable product per lead, free product/segment lists, in-place Segment/Status/Product/Decision-maker editing, delete that suppresses re-import, a source pill, sort + search, a collapsed Today list, and a company-naming rule that never writes "Unknown".

**Architecture:** Same shape as round 1. `Lead.opportunities[]` collapses to a single `Lead.product?: string`; `PipelineConfig` and the whole per-product stage machinery are deleted. A new `LeadSuppression` collection remembers what the operator deleted, and the one DB seam (`upsertLeadWithTouches`) consults it before creating any lead. Everything the console needs to decide (source pill, search match, sort order, option merge) lives in new pure, mongoose-free modules under `src/lib/crm/` with `npx tsx` tests. A one-off `scripts/crm-migrate-round2.ts` moves existing data.

**Tech Stack:** Next.js App Router, Mongoose, `zod`, lucide-react icons, TypeScript, `tsx` test scripts. No table library, no new dependency.

**Spec:** `docs/superpowers/specs/2026-09-23-crm-pipeline-round2-design.md` — read it first; every task below cites its numbered decisions. Round 1 (deployed 2026-09-22 as `e8358344`): `docs/superpowers/specs/2026-09-21-crm-unified-timeline.md`.

**Baseline facts confirmed in the worktree at HEAD `c5ce193f`:** `npx tsc --noEmit -p tsconfig.json` from `apps/marketing` exits 0 with no output. `scripts/` is in tsconfig's `exclude`, so the migration script is NOT type-checked by `tsc` — its gate is the deploy-time dry run. `SEGMENT_LABELS` is `Record<string, string>` exported from `ReviewQueueTab.tsx` and every lookup already falls back to the raw value. `TimelineDrawer` has exactly one caller (`PipelineTab`). There is no `.env.local.example` in `apps/marketing` — env vars are recorded in the deploy checklist instead.

## Global Constraints

- Work in this worktree (`.claude/worktrees/crm-timeline`), four-session protocol, worktree-only. App root for every path below: `apps/marketing/`. Run every command from that directory — **never from the repo root**.
- Test harness = the repo pattern: `import { strict as assert } from "node:assert"` + a local `test(name, fn)` counter; run with `npx tsx <file>.test.ts`; one `npm run test:crm-*` script per new test file, all chained into the existing `test:crm`.
- `src/lib/outreach/enums.ts` and every module in `src/lib/crm/` stay **mongoose-free**, except the DB seams: `upsert-lead.ts`, `gmail-ingest.ts`, `gmail-list.ts`. Type-only imports (`import type`) are allowed everywhere. `scripts/test-outreach-guards.ts` enforces the client-bundle half of this; keep it green.
- **NO manual check may run in this session.** The worktree's `.env.local` points `MONGODB_URI` at production Mongo through a tunnel. Never run `npm run dev`, `curl`, or any `scripts/*.ts`. Manual-check steps below are written out but marked **deploy-time**.
- Gates per task: that task's tests + `npx tsc --noEmit -p tsconfig.json` (expect no output). Tasks that touch `src/app/**` UI (6, 7, 8) and the final task also run `npm run build`. The final task also runs `npm run test:outreach` — it must stay green, including `test:outreach-guards`, which forbids the literals `threads.list` / `messages.list` / `messages.search` anywhere under `src/lib/outreach/`.
- Seeds stay: `PRODUCTS` and `LEAD_SEGMENTS` remain exported from `enums.ts` as seed lists and label sources. **Chosen consistently throughout this plan:** `Product` and `LeadSegment` become plain `string` aliases (they are NOT removed), so every existing importer keeps compiling and free values are legal everywhere.
- Commit after every task with `git add <explicit paths>` then `git commit`. Plain git only — no `-A`, no commit from the repo root. Message prefix `feat(crm):` / `refactor(crm):` / `test(crm):`, ending with EXACTLY these two lines:

```
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d
```

---

## File map

| Path | Responsibility |
|---|---|
| `src/lib/outreach/enums.ts` | `Product`/`LeadSegment` become `string`; `PRODUCTS`/`LEAD_SEGMENTS` stay as seeds |
| `src/models/Lead.ts` | + `product?: string`; `segment` free string; `opportunities`/`OpportunitySchema`/its index removed |
| `src/models/LeadSuppression.ts` | **new** — remembers deleted leads so imports can't resurrect them |
| `src/models/ResearchJob.ts` | `segment` free string |
| `src/models/PipelineConfig.ts` | **deleted** (+ its test) |
| `src/models/index.ts` | export `LeadSuppression`, drop `PipelineConfig`/`IOpportunity` |
| `src/lib/crm/opportunity.ts` | **deleted** (+ its test) |
| `src/lib/crm/match-lead.ts` | + `companyNameFor` (pure); `newLeadFields` uses it |
| `src/lib/crm/suppression.ts` | **new** pure — `suppressionKeysFor`, `suppressionQuery` |
| `src/lib/crm/console-helpers.ts` | **new** pure, client-safe — `mergeOptionValues`, `sourcePill`, `leadMatchesQuery`, `compareLeads` |
| `src/lib/crm/upsert-lead.ts` | suppression check before create; one `product` instead of opportunities |
| `src/lib/crm/gmail-ingest.ts` | `IngestPageResult.suppressed` counter |
| `src/lib/crm/classify-contact.ts` | `productFromParam` returns a seed or the slugified raw param |
| `src/lib/outreach/segment-landing.ts` | `Record<string, string>`, no `LeadSegment`/models import |
| `src/app/api/admin/outreach/pipelines/route.ts` | **deleted** |
| `src/app/api/admin/outreach/leads/[id]/route.ts` | `setOpportunity` removed; `product` added to `EDIT_FIELDS` |
| `src/app/api/admin/outreach/leads/bulk/route.ts` | + `action: "delete"` (suppress-then-delete) |
| `src/app/api/admin/outreach/leads/deleted/route.ts` | **new** GET — last 100 suppressions |
| `src/app/api/admin/outreach/leads/restore/route.ts` | **new** POST — recreate from snapshot |
| `src/app/api/admin/outreach/maintenance/fix-unknown-companies/route.ts` | **new** POST — dry-run/apply the naming rule |
| `src/app/api/admin/outreach/options/route.ts` | **new** GET — seeds ∪ distinct lead values |
| `src/app/api/admin/outreach/research/route.ts` | segment gate accepts seeds ∪ existing values |
| `src/app/api/admin/outreach/ingest/{gmail,linkedin}/route.ts` | `product` becomes a free string |
| `src/app/api/contact/route.ts` | passes the free-string product through |
| `src/app/admin/outreach/PipelineTab.tsx` | rewritten per spec §6 |
| `src/app/admin/outreach/OutreachConsole.tsx` | `LeadJSON`: + `product?`, − `opportunities` |
| `src/app/admin/outreach/TimelineDrawer.tsx` | product + editable notes instead of opportunities |
| `src/app/admin/outreach/TodayTab.tsx` | per-lead collapse (spec §7) |
| `src/app/admin/outreach/ImportTab.tsx` | Deleted-leads + Fix-Unknown sections; `suppressed` total |
| `src/app/admin/outreach/linkedin-import/LinkedinImport.tsx` | product options from the endpoint |
| `scripts/crm-migrate-round2.ts` | **new** one-off migration (dry run default, `--apply`) |
| `package.json` | test scripts + `crm:migrate-round2` |

---

### Task 1: Model + migration (spec §1, §2 schema half, §3 model, §9)

**Files:**
- Modify: `src/lib/outreach/enums.ts`, `src/models/Lead.ts`, `src/models/ResearchJob.ts`, `src/models/index.ts`, `src/lib/crm/upsert-lead.ts`, `src/app/api/admin/outreach/leads/[id]/route.ts`, `package.json`
- Create: `src/models/LeadSuppression.ts`, `scripts/crm-migrate-round2.ts`
- Delete: `src/models/PipelineConfig.ts`, `src/models/PipelineConfig.test.ts`, `src/lib/crm/opportunity.ts`, `src/lib/crm/opportunity.test.ts`, `src/app/api/admin/outreach/pipelines/route.ts`
- Test: `src/models/Lead.test.ts` (edit), `src/models/ResearchJob.test.ts` (edit), `src/models/LeadSuppression.test.ts` (new)

**Interfaces:**
- Produces: `type Product = string`, `type LeadSegment = string` (aliases; `PRODUCTS`/`LEAD_SEGMENTS` unchanged as `as const` seed tuples). `ILead` gains `product?: string` and loses `opportunities`. `IOpportunity` is gone. `LeadSuppression` model with `ILeadSuppression = { leadId: string; company: string; emails: string[]; linkedinUrls: string[]; gmailThreadIds: string[]; conversationKeys: string[]; snapshot: unknown; deletedAt: Date }`.
- Removes: `PipelineConfig`, `IPipelineConfig`, `DEFAULT_STAGES`, `applyOpportunity`, `OpportunityInput`, `GET/PUT /api/admin/outreach/pipelines`, the `setOpportunity` PATCH action.
- Consumed later: `LeadSuppression` by Task 3; `Lead.product` by Tasks 4–9.

- [ ] **Step 1: Rewrite the failing model tests**

In `src/models/Lead.test.ts`, replace the `bad segment rejected` test (lines 29–32) with:

```ts
await test("any segment string is accepted — the list is open (round-2 §2)", () => {
  const doc = new Lead({ ...base, segment: "hospital" });
  assert.equal(doc.validateSync(), undefined);
  assert.equal(doc.segment, "hospital");
});
await test("segment is still required", () => {
  const err = new Lead({ ...base, segment: "" }).validateSync();
  assert.ok(err?.errors["segment"]);
});
```

In the same file, replace the `opportunity requires a known product` test (lines 75–80) with:

```ts
await test("product is a free string and defaults to undefined", () => {
  assert.equal(new Lead(base).product, undefined);
  const doc = new Lead({ ...base, product: "homework_bot" });
  assert.equal(doc.validateSync(), undefined);
  assert.equal(doc.product, "homework_bot");
});
await test("opportunities is no longer part of the schema", () => {
  const doc = new Lead({ ...base, opportunities: [{ product: "voice_tutor", stage: "replied", updatedAt: new Date() }] });
  assert.equal(doc.validateSync(), undefined);
  assert.equal((doc as unknown as Record<string, unknown>).opportunities, undefined);
});
```

In `src/models/ResearchJob.test.ts`, replace the `bad segment / bad status fail` test (lines 27–30) with:

```ts
  await test("segment is open; bad status still fails", () => {
    assert.equal(new ResearchJob({ segment: "nope", count: 5 }).validateSync(), undefined);
    assert.ok(new ResearchJob({ segment: "nursing_program", count: 5, status: "nope" }).validateSync());
  });
```

Create `src/models/LeadSuppression.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { LeadSuppression } from "./LeadSuppression";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
const base = {
  leadId: "68d0000000000000000000aa",
  company: "Pagevault",
  snapshot: { company: "Pagevault", segment: "publisher", touches: [] },
  deletedAt: new Date(),
};

await test("minimal suppression validates and the key arrays default to []", () => {
  const doc = new LeadSuppression(base);
  assert.equal(doc.validateSync(), undefined);
  assert.deepEqual([...doc.emails], []);
  assert.deepEqual([...doc.linkedinUrls], []);
  assert.deepEqual([...doc.gmailThreadIds], []);
  assert.deepEqual([...doc.conversationKeys], []);
});
await test("leadId, company, snapshot and deletedAt are required", () => {
  const err = new LeadSuppression({}).validateSync();
  assert.ok(err?.errors["leadId"]);
  assert.ok(err?.errors["company"]);
  assert.ok(err?.errors["snapshot"]);
  assert.ok(err?.errors["deletedAt"]);
});
await test("key arrays round-trip", () => {
  const doc = new LeadSuppression({
    ...base,
    emails: ["ops@pagevault.io"],
    linkedinUrls: ["https://www.linkedin.com/in/pv"],
    gmailThreadIds: ["18f0aa"],
    conversationKeys: ["https://www.linkedin.com/in/pv"],
  });
  assert.equal(doc.validateSync(), undefined);
  assert.deepEqual([...doc.emails], ["ops@pagevault.io"]);
  assert.deepEqual([...doc.conversationKeys], ["https://www.linkedin.com/in/pv"]);
});
await test("snapshot keeps an arbitrary nested shape (Mixed)", () => {
  const snapshot = { company: "X", touches: [{ at: new Date(), body: "hi", nested: { a: [1, 2] } }] };
  const doc = new LeadSuppression({ ...base, snapshot });
  assert.equal(doc.validateSync(), undefined);
  assert.equal((doc.snapshot as { touches: { body: string }[] }).touches[0].body, "hi");
});

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
})();
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx tsx src/models/Lead.test.ts; npx tsx src/models/ResearchJob.test.ts; npx tsx src/models/LeadSuppression.test.ts`
Expected: `Lead.test.ts` FAILS on `any segment string is accepted` (the enum still rejects `hospital`) and on both `product`/`opportunities` cases; `ResearchJob.test.ts` FAILS on `segment is open`; `LeadSuppression.test.ts` FAILS with `Cannot find module './LeadSuppression'`.

- [ ] **Step 3: Open the Product and LeadSegment types**

In `src/lib/outreach/enums.ts`, replace the `LeadSegment` alias line (currently `export type LeadSegment = (typeof LEAD_SEGMENTS)[number];`) with:

```ts
// Round 2 §2: the segment list is OPEN. `LEAD_SEGMENTS` stays as the seed
// list every dropdown starts from and as the key set of the label maps, but
// the type is a plain string — saving a lead with a new value is what adds
// that value to the list (see /api/admin/outreach/options).
export type LeadSegment = string;
```

and replace the `Product` alias line (currently `export type Product = (typeof PRODUCTS)[number];`) with:

```ts
// Round 2 §1/§2: one product per lead, and the product list is OPEN — same
// seed-plus-free-string rule as LEAD_SEGMENTS above.
export type Product = string;
```

- [ ] **Step 4: Collapse opportunities to one product on the Lead schema**

In `src/models/Lead.ts`:

1. Delete the whole `IOpportunity` interface (lines 32–38).
2. In `ILead`, replace the two lines

```ts
  opportunities: IOpportunity[];
```

with

```ts
  // Round 2 §1: exactly one product per lead (was `opportunities[]`).
  // Free string — the console's dropdown offers the seeds plus every value
  // already present on a lead, and "Other…" writes a brand-new one.
  product?: string;
```

3. Change the `segment` field to drop the enum:

```ts
    segment: { type: String, required: true, trim: true },
```

4. Add the `product` field immediately after `notes: String,`:

```ts
    product: String,
```

5. Delete the `OpportunitySchema` block (lines 124–133) and the `opportunities: { type: [OpportunitySchema], default: [] },` schema line.
6. Delete the index line `LeadSchema.index({ "opportunities.product": 1, "opportunities.stage": 1 });`.
7. Leave the enums import/re-export lines exactly as they are — `PRODUCTS` and `LEAD_SEGMENTS` are still re-exported for `@/models` importers, and `Product`/`LeadSegment` are still re-exported types.

- [ ] **Step 5: Open ResearchJob.segment**

In `src/models/ResearchJob.ts`:

1. Change the value import to drop `LEAD_SEGMENTS`:

```ts
import {
  RESEARCH_JOB_STATUSES, CANDIDATE_STATUSES,
} from "@/lib/outreach/enums";
```

2. Change the schema field to:

```ts
    // Round 2 §2: open segment list. The API route is the gate (it accepts a
    // seed value or any value already present on a lead); the schema stays
    // permissive so a historical job never fails to re-validate.
    segment: { type: String, required: true },
```

- [ ] **Step 6: Create the LeadSuppression model**

Create `src/models/LeadSuppression.ts`:

```ts
import mongoose, { Schema, Document } from "mongoose";

// Round 2 §3. Deleting a lead is not enough: every ingest path
// (`upsertLeadWithTouches`) would recreate it on the next run from the same
// Gmail thread / LinkedIn conversation / form submission. A suppression row
// is the tombstone — it carries every identity key the matcher could key on
// plus the full lead document, so a delete is reversible ("Restore") and a
// re-import reports the lead under `suppressed` instead of `created`.
export interface ILeadSuppression extends Document {
  /** The _id the lead had before it was deleted, as a string. */
  leadId: string;
  company: string;
  emails: string[];
  linkedinUrls: string[];
  gmailThreadIds: string[];
  /** LinkedIn conversation keys (profile URL, else the name slug). */
  conversationKeys: string[];
  /** The lead's full `toObject()` at delete time — the restore source. */
  snapshot: unknown;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSuppressionSchema = new Schema<ILeadSuppression>(
  {
    leadId: { type: String, required: true },
    company: { type: String, required: true },
    emails: { type: [String], default: [] },
    linkedinUrls: { type: [String], default: [] },
    gmailThreadIds: { type: [String], default: [] },
    conversationKeys: { type: [String], default: [] },
    snapshot: { type: Schema.Types.Mixed, required: true },
    deletedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// One index per key set: `suppressionQuery` builds an $or over exactly these
// four arrays, and the check runs on every would-be lead creation.
LeadSuppressionSchema.index({ emails: 1 });
LeadSuppressionSchema.index({ linkedinUrls: 1 });
LeadSuppressionSchema.index({ conversationKeys: 1 });
LeadSuppressionSchema.index({ gmailThreadIds: 1 });
LeadSuppressionSchema.index({ deletedAt: -1 });

export const LeadSuppression =
  mongoose.models.LeadSuppression ||
  mongoose.model<ILeadSuppression>("LeadSuppression", LeadSuppressionSchema);
```

- [ ] **Step 7: Delete PipelineConfig, the pipelines route and the opportunity module**

```bash
git rm src/models/PipelineConfig.ts src/models/PipelineConfig.test.ts src/lib/crm/opportunity.ts src/lib/crm/opportunity.test.ts src/app/api/admin/outreach/pipelines/route.ts
```

Then in `src/models/index.ts`:

1. Replace the `PipelineConfig` export line (line 76) with:

```ts
export { LeadSuppression, type ILeadSuppression } from "./LeadSuppression";
```

2. Remove `IOpportunity, ` from the `export type { ... } from "./Lead";` line, leaving:

```ts
export type { ILead, ITouch, IDemoVisit, ICurrentDraft, LeadSegment, LeadStatus, TouchChannel, Product, TouchOrigin } from "./Lead";
```

- [ ] **Step 8: Drop the opportunity write from the upsert seam**

In `src/lib/crm/upsert-lead.ts`, replace the whole `if (args.product) { ... }` block (lines 80–91) with:

```ts
  // Round 2 §1: one product per lead. The first ingest path that knows the
  // product sets it; later ingests never overwrite it, because the operator
  // may have corrected it in the Pipeline since.
  if (args.product && !lead.product) lead.product = args.product;
```

- [ ] **Step 9: Remove setOpportunity and make product editable**

In `src/app/api/admin/outreach/leads/[id]/route.ts`:

1. Replace the two model/lib imports (lines 6–10) with:

```ts
import { Lead, LEAD_STATUSES, type LeadStatus } from "@/models";
import { mergeDecisionMakerEdit, type DecisionMakerEditInput } from "@/lib/outreach/lead-edit";
import { applyApprove, applyKill } from "@/lib/outreach/lead-transitions";
```

2. In `EDIT_FIELDS`, add `"product",` immediately after `"segment",` — the Pipeline's inline Product dropdown saves through the existing `edit` action:

```ts
const EDIT_FIELDS = [
  "company",
  "segment",
  "product",
  "about",
  "whyFit",
  "useCaseHypothesis",
  "decisionMaker",
  "orgEmail",
  "orgEmailSourceUrl",
  "website",
  "source",
  "notes",
  "nextActionAt",
  "currentDraft",
] as const;
```

3. Delete the entire `case "setOpportunity": { ... }` block (lines 150–167).

- [ ] **Step 10: Write the migration script**

Create `scripts/crm-migrate-round2.ts`:

```ts
// One-off round-2 migration (spec §9). Idempotent: safe to re-run.
//   1. copy opportunities[0].product -> product when product is empty
//   2. $unset opportunities on every lead
//   3. drop the leads index opportunities.product_1_opportunities.stage_1
//   4. drop the pipelineconfigs collection
// Dry-run unless --apply.
//
// Usage (run on the host, after the deploy):
//   MONGODB_URI=... npx tsx scripts/crm-migrate-round2.ts            # dry run
//   MONGODB_URI=... npx tsx scripts/crm-migrate-round2.ts --apply    # write
import mongoose from "mongoose";
import { connectDB } from "@core/db";
import { Lead } from "@/models";

const apply = process.argv.includes("--apply");

const DEAD_INDEX = "opportunities.product_1_opportunities.stage_1";
const DEAD_COLLECTION = "pipelineconfigs";

(async () => {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("no mongoose connection database handle");

  // Read through the raw collection: `opportunities` is no longer in the
  // Mongoose schema, so a lean() projection on the model would strip it.
  const leads = db.collection("leads");

  const withOpps = await leads.countDocuments({ opportunities: { $exists: true } });
  const carryable = await leads
    .find(
      {
        "opportunities.0.product": { $exists: true, $nin: ["", null] },
        $or: [{ product: { $exists: false } }, { product: "" }, { product: null }],
      },
      { projection: { _id: 1, company: 1, opportunities: 1 } }
    )
    .toArray();

  console.log(`leads with an opportunities field: ${withOpps}`);
  console.log(`leads whose product can be carried over: ${carryable.length}`);
  for (const l of carryable.slice(0, 20)) {
    const opps = l.opportunities as { product?: string }[] | undefined;
    console.log(`  ${String(l._id)} ${String(l.company)} -> product=${opps?.[0]?.product}`);
  }

  const indexes = await leads.indexes();
  const hasDeadIndex = indexes.some((i) => i.name === DEAD_INDEX);
  const collections = await db.listCollections().toArray();
  const hasDeadCollection = collections.some((c) => c.name === DEAD_COLLECTION);
  console.log(`dead index present: ${hasDeadIndex}`);
  console.log(`${DEAD_COLLECTION} collection present: ${hasDeadCollection}`);

  if (!apply) {
    console.log("DRY RUN — nothing written. Re-run with --apply.");
    await mongoose.connection.close();
    process.exit(0);
  }

  let carried = 0;
  for (const l of carryable) {
    const opps = l.opportunities as { product?: string }[] | undefined;
    const product = opps?.[0]?.product;
    if (!product) continue;
    await leads.updateOne({ _id: l._id }, { $set: { product } });
    carried++;
  }

  const unset = await leads.updateMany(
    { opportunities: { $exists: true } },
    { $unset: { opportunities: "" } }
  );

  if (hasDeadIndex) await leads.dropIndex(DEAD_INDEX);
  if (hasDeadCollection) await db.collection(DEAD_COLLECTION).drop();

  // Prove the end state rather than trusting the writes above.
  const leftover = await leads.countDocuments({ opportunities: { $exists: true } });
  console.log(
    `APPLIED: products carried ${carried}, opportunities unset on ${unset.modifiedCount}, ` +
      `dead index dropped ${hasDeadIndex}, ${DEAD_COLLECTION} dropped ${hasDeadCollection}, ` +
      `leads still carrying opportunities ${leftover}`
  );
  if (leftover !== 0) {
    console.error("FAILED: some leads still carry an opportunities field");
    await mongoose.connection.close();
    process.exit(1);
  }
  // Sanity: how many leads ended up with a product at all.
  console.log(`leads with a non-empty product: ${await Lead.countDocuments({ product: { $nin: ["", null] } })}`);
  await mongoose.connection.close();
  process.exit(0);
})();
```

- [ ] **Step 11: Update the test scripts**

In `package.json`, change `test:crm-models`, delete `test:crm-opportunity`, add `crm:migrate-round2`, and drop `test:crm-opportunity` from the `test:crm` chain:

```json
    "test:crm-models": "npx tsx src/models/Lead.test.ts && npx tsx src/models/LeadSuppression.test.ts",
    "test:crm": "npm run test:crm-models && npm run test:crm-core && npm run test:crm-upsert-smoke && npm run test:crm-contact && npm run test:crm-gmail && npm run test:crm-gmail-classify && npm run test:crm-gmail-ingest && npm run test:crm-linkedin && npm run test:crm-archive",
    "crm:migrate-round2": "npx tsx scripts/crm-migrate-round2.ts",
```

- [ ] **Step 12: Gates**

Run: `npm run test:crm-models && npx tsx src/models/ResearchJob.test.ts && npm run test:crm-upsert-smoke && npx tsc --noEmit -p tsconfig.json`
Expected: all three test files print `failed: 0` / `0 failed`; `tsc` prints nothing.

> `PipelineTab`/`TimelineDrawer` still read `lead.opportunities` from the client-side `LeadJSON` type at this point. That compiles (the interface still declares the field) and cannot crash at runtime — both reads are `?.`/`?? []` guarded — and Task 6 removes them. Do not "fix" them here.

- [ ] **Step 13: Commit**

```bash
git add src/lib/outreach/enums.ts src/models/Lead.ts src/models/Lead.test.ts src/models/LeadSuppression.ts src/models/LeadSuppression.test.ts src/models/ResearchJob.ts src/models/ResearchJob.test.ts src/models/index.ts src/models/PipelineConfig.ts src/models/PipelineConfig.test.ts src/lib/crm/opportunity.ts src/lib/crm/opportunity.test.ts src/lib/crm/upsert-lead.ts 'src/app/api/admin/outreach/leads/[id]/route.ts' src/app/api/admin/outreach/pipelines/route.ts scripts/crm-migrate-round2.ts package.json
git commit -m "feat(crm): one product per lead, open segment list, LeadSuppression model, round-2 migration

Replaces Lead.opportunities[] with Lead.product (spec §1) and opens the
segment/product lists (§2): PipelineConfig, the pipelines route, the
setOpportunity action and lib/crm/opportunity are deleted. Adds the
LeadSuppression collection (§3) and the idempotent one-off migration (§9).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

---

### Task 2: Company naming rule + the fix-unknown maintenance route (spec §4)

**Files:**
- Modify: `src/lib/crm/match-lead.ts`, `src/lib/crm/match-lead.test.ts`
- Create: `src/app/api/admin/outreach/maintenance/fix-unknown-companies/route.ts`

**Interfaces:**
- Consumes: `emailDomain`, `isFreeMailDomain`, `normalizeEmail`, `websiteDomain` from `./identity`; `ContactIdentity`.
- Produces: `companyNameFor(identity: ContactIdentity): string` — explicit company → non-free-mail domain → person's name → email address → `"Unknown"` only when all are empty. `newLeadFields` uses it (so every ingest path inherits the rule).
- Produces: `POST /api/admin/outreach/maintenance/fix-unknown-companies`, body `{ dryRun?: boolean }` (default `true`) → `{ matched: number; updated: number; samples: { id: string; from: string; to: string }[] }`.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/crm/match-lead.test.ts`, before the final `console.log`/`process.exit` line, and add `companyNameFor` to the import on line 2 (`import { pickLead, matchQuery, newLeadFields, companyNameFor, type MatchableLead } from "./match-lead";`):

```ts
await test("companyNameFor: an explicit company always wins", () => {
  assert.equal(companyNameFor({ company: "  Acme Nursing  ", email: "bob@acme.edu", name: "Bob" }), "Acme Nursing");
});
await test("companyNameFor: an organisation domain beats the person's name", () => {
  assert.equal(companyNameFor({ email: "bob@acme.edu", name: "Bob Ray" }), "acme.edu");
  assert.equal(companyNameFor({ website: "https://www.tvs.org/about" }), "tvs.org");
});
await test("companyNameFor: gmail.com + a name gives the name, never Unknown", () => {
  assert.equal(companyNameFor({ email: "Bob Ray <bob.ray@gmail.com>", name: "Bob Ray" }), "Bob Ray");
});
await test("companyNameFor: gmail.com with no name gives the address, never Unknown", () => {
  assert.equal(companyNameFor({ email: "Bob.Ray@Gmail.com" }), "bob.ray@gmail.com");
});
await test("companyNameFor: Unknown only when there is nothing at all", () => {
  assert.equal(companyNameFor({}), "Unknown");
  assert.equal(companyNameFor({ company: "   ", name: "  " }), "Unknown");
});
await test("newLeadFields uses companyNameFor for a free-mail contact", () => {
  const f = newLeadFields({ email: "x@gmail.com" }, "gmail:info@evelynlearning.com") as Record<string, unknown>;
  assert.equal(f.company, "x@gmail.com");
  const g = newLeadFields({ email: "y@gmail.com", name: "Yara Qadir" }, "contact-form") as Record<string, unknown>;
  assert.equal(g.company, "Yara Qadir");
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx tsx src/lib/crm/match-lead.test.ts`
Expected: FAILS to even import — `companyNameFor` is not exported (the run reports the module error, or every new case fails with `companyNameFor is not a function`).

- [ ] **Step 3: Implement companyNameFor**

In `src/lib/crm/match-lead.ts`, add above `newLeadFields`:

```ts
/**
 * Round 2 §4. The name the operator sees in the Pipeline for a brand-new
 * lead. "Unknown" was the old fallback for every free-mail contact, which
 * made a whole column of leads indistinguishable; it is now reachable only
 * when the identity carries nothing at all.
 *
 * Order: an explicit company → the organisation's email/website domain (never
 * a free-mail provider) → the person's name → their email address.
 */
export function companyNameFor(identity: ContactIdentity): string {
  const explicit = identity.company?.trim();
  if (explicit) return explicit;
  const email = identity.email ? normalizeEmail(identity.email) : "";
  const domain = email ? emailDomain(email) : websiteDomain(identity.website ?? "");
  if (domain && !isFreeMailDomain(domain)) return domain;
  const name = identity.name?.trim();
  if (name) return name;
  if (email) return email;
  return "Unknown";
}
```

and replace the `company` line inside `newLeadFields` (currently `const company = identity.company?.trim() || (...)` ) with:

```ts
  const company = companyNameFor(identity);
```

- [ ] **Step 4: Run the tests**

Run: `npm run test:crm-core`
Expected: all three files pass, `0 failed` each.

- [ ] **Step 5: Add the maintenance route**

Create `src/app/api/admin/outreach/maintenance/fix-unknown-companies/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead, type ILead } from "@/models";
import { companyNameFor } from "@/lib/crm/match-lead";

export const maxDuration = 120;

const bodySchema = z.object({ dryRun: z.boolean().optional() });

// Leads whose company was written before the round-2 naming rule: literally
// "Unknown" (any case), empty, or missing.
const UNKNOWN_FILTER = {
  $or: [
    { company: { $regex: "^\\s*unknown\\s*$", $options: "i" } },
    { company: "" },
    { company: { $exists: false } },
  ],
};

// POST - apply the §4 naming rule to existing leads. Dry-run by default: the
// Import tab shows `matched` + samples first, then the operator applies.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const dryRun = parsed.data.dryRun ?? true;

  try {
    await connectDB();
    const leads = await Lead.find(UNKNOWN_FILTER)
      .select("_id company website emails decisionMaker")
      .lean<Pick<ILead, "_id" | "company" | "website" | "emails" | "decisionMaker">[]>();

    let updated = 0;
    const samples: { id: string; from: string; to: string }[] = [];

    for (const lead of leads) {
      const next = companyNameFor({
        email: lead.decisionMaker?.email || lead.emails?.[0],
        name: lead.decisionMaker?.name,
        website: lead.website,
      });
      // Nothing to learn from this lead — leave it alone rather than
      // rewriting "unknown" to "Unknown".
      if (!next || next === "Unknown" || next === lead.company) continue;
      if (samples.length < 50) samples.push({ id: String(lead._id), from: lead.company ?? "", to: next });
      if (!dryRun) {
        await Lead.updateOne({ _id: lead._id }, { $set: { company: next } });
      }
      updated++;
    }

    return NextResponse.json({ matched: leads.length, updated, samples, dryRun });
  } catch (error) {
    console.error("[CRM] fix-unknown-companies Error:", error);
    return NextResponse.json({ error: "Failed to fix company names" }, { status: 500 });
  }
}
```

- [ ] **Step 6: Gates**

Run: `npm run test:crm-core && npx tsc --noEmit -p tsconfig.json`
Expected: `0 failed` in all three core files; `tsc` prints nothing.

- [ ] **Step 7: Manual check — deploy-time**

> **Deploy-time only** (this worktree's `MONGODB_URI` is production). After deploying, from the Import tab press "Fix Unknown companies → Dry run": expect a `matched` count > 0 and samples like `Unknown → bob.ray@gmail.com`. Then "Apply" and confirm the Pipeline shows no "Unknown" rows and a second dry run reports `updated: 0`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/crm/match-lead.ts src/lib/crm/match-lead.test.ts src/app/api/admin/outreach/maintenance/fix-unknown-companies/route.ts
git commit -m "feat(crm): company naming rule (never Unknown) + fix-unknown-companies maintenance route

Spec §4: companyNameFor is the single naming rule for every ingest path, and
the maintenance route applies it to the leads created before it existed.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

---

### Task 3: Suppression — pure keys, the upsert gate, bulk delete, deleted list, restore (spec §3)

**Files:**
- Create: `src/lib/crm/suppression.ts`, `src/lib/crm/suppression.test.ts`
- Modify: `src/lib/crm/upsert-lead.ts`, `src/lib/crm/gmail-ingest.ts`, `src/lib/crm/gmail-ingest.test.ts`, `src/app/api/admin/outreach/leads/bulk/route.ts`, `package.json`
- Create: `src/app/api/admin/outreach/leads/deleted/route.ts`, `src/app/api/admin/outreach/leads/restore/route.ts`

**Interfaces:**
- Produces (pure, mongoose-free): `suppressionKeysFor(lead: SuppressibleLead): SuppressionKeys` where `SuppressibleLead = { emails?: string[]; decisionMaker?: { email?: string; linkedinUrl?: string }; gmailThreadIds?: string[]; linkedinConversationIds?: string[] }` and `SuppressionKeys = { emails: string[]; linkedinUrls: string[]; gmailThreadIds: string[]; conversationKeys: string[] }` (normalised, deduped, empties dropped); `suppressionQuery(identity: ContactIdentity & { conversationKey?: string; gmailThreadIds?: string[] }): Record<string, unknown> | null`.
- Changes: `upsertLeadWithTouches` now returns `UpsertResult = { leadId: string; created: boolean; added: number; matchedBy: MatchBy | "new" | "suppressed"; suppressed?: boolean }`. A suppressed identity yields `{ suppressed: true, leadId: "", created: false, added: 0, matchedBy: "suppressed" }`. `suppressed` is **optional** so the existing fake `upsert` deps in `gmail-ingest.test.ts` keep type-checking.
- Changes: `IngestPageResult` gains `suppressed: number`.
- Changes: `POST /api/admin/outreach/leads/bulk` accepts `action: "delete"` and returns `{ success, action, updated: string[], deleted: string[], skipped: { id, reason }[] }`.
- Produces: `GET /api/admin/outreach/leads/deleted` → `{ deleted: { _id: string; company: string; deletedAt: string; emails: string[] }[] }` (last 100 by `deletedAt`). `POST /api/admin/outreach/leads/restore` body `{ suppressionId: string }` → `{ leadId: string }`.
- **No change needed in the LinkedIn routes:** they already pass `linkedinConversationId` to `upsertLeadWithTouches`, and the seam maps it to `conversationKey` when building the suppression query. Do not add a second parameter.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/crm/suppression.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { suppressionKeysFor, suppressionQuery } from "./suppression";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {

await test("keys are normalised, deduped and empty-free", () => {
  const k = suppressionKeysFor({
    emails: ["Ops@Pagevault.IO", "ops@pagevault.io", "", "  Dana Smith <Dana@Acme.EDU>  "],
    decisionMaker: { email: "OPS@pagevault.io", linkedinUrl: "https://linkedin.com/in/Skyler-Scarlett/?trk=x" },
    gmailThreadIds: ["18f0aa", "", "18f0aa", "18f0bb"],
    linkedinConversationIds: ["https://www.linkedin.com/in/pv", "pat-lee", ""],
  });
  assert.deepEqual(k.emails, ["ops@pagevault.io", "dana@acme.edu"]);
  assert.deepEqual(k.linkedinUrls, ["https://www.linkedin.com/in/skyler-scarlett"]);
  assert.deepEqual(k.gmailThreadIds, ["18f0aa", "18f0bb"]);
  assert.deepEqual(k.conversationKeys, ["https://www.linkedin.com/in/pv", "pat-lee"]);
});

await test("an empty lead yields four empty arrays, not undefined", () => {
  assert.deepEqual(suppressionKeysFor({}), { emails: [], linkedinUrls: [], gmailThreadIds: [], conversationKeys: [] });
});

await test("a junk linkedin url is dropped, not stored raw", () => {
  const k = suppressionKeysFor({ decisionMaker: { linkedinUrl: "not a url" } });
  assert.deepEqual(k.linkedinUrls, []);
});

await test("query keys on email, linkedin url and conversation key", () => {
  const q = suppressionQuery({
    email: "Ops@Pagevault.IO",
    linkedinUrl: "linkedin.com/in/PV/",
    conversationKey: "pat-lee",
  }) as { $or: Record<string, unknown>[] };
  assert.ok(Array.isArray(q.$or));
  assert.deepEqual(q.$or, [
    { emails: "ops@pagevault.io" },
    { linkedinUrls: "https://www.linkedin.com/in/pv" },
    { conversationKeys: "pat-lee" },
  ]);
});

await test("query includes gmail thread ids with $in", () => {
  const q = suppressionQuery({ gmailThreadIds: ["18f0aa", "", "18f0bb"] }) as { $or: Record<string, unknown>[] };
  assert.deepEqual(q.$or, [{ gmailThreadIds: { $in: ["18f0aa", "18f0bb"] } }]);
});

await test("an identity with no suppressible key gives null (never a match-all)", () => {
  assert.equal(suppressionQuery({}), null);
  assert.equal(suppressionQuery({ name: "Pat", company: "Pagevault" }), null);
  assert.equal(suppressionQuery({ gmailThreadIds: [] }), null);
});

await test("a domain is NOT a suppression key — deleting one lead must not block a colleague", () => {
  const q = suppressionQuery({ email: "ops@pagevault.io", website: "https://pagevault.io" }) as { $or: Record<string, unknown>[] };
  assert.equal(q.$or.length, 1);
  assert.equal(JSON.stringify(q).includes("website"), false);
});

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

Append to `src/lib/crm/gmail-ingest.test.ts`, before its final `console.log`/`process.exit` line:

```ts
await test("real run: a suppressed identity counts under `suppressed`, not created/updated", async () => {
  const deps = {
    listThreadIds: fakeListThreadIds(["A"], undefined),
    getFullThread: fakeGetFullThread({ A: threadA }),
    upsert: async (_args: UpsertArgs) => ({ leadId: "", created: false, added: 0, matchedBy: "suppressed" as const, suppressed: true }),
    sleep: noopSleep,
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: false, origin: "gmail_import" }, deps);
  assert.equal(r.kept, 1);
  assert.equal(r.suppressed, 1);
  assert.equal(r.created, 0);
  assert.equal(r.updated, 0);
  assert.equal(r.touchesAdded, 0);
});

await test("suppressed starts at 0 on a dry run", async () => {
  const deps = {
    listThreadIds: fakeListThreadIds(["A"], undefined),
    getFullThread: fakeGetFullThread({ A: threadA }),
    upsert: async (_args: UpsertArgs) => ({ leadId: "L1", created: true, added: 1, matchedBy: "new" as const }),
    sleep: noopSleep,
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps);
  assert.equal(r.suppressed, 0);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx tsx src/lib/crm/suppression.test.ts; npx tsx src/lib/crm/gmail-ingest.test.ts`
Expected: `suppression.test.ts` FAILS with `Cannot find module './suppression'`; `gmail-ingest.test.ts` FAILS the two new cases (`r.suppressed` is `undefined`, and the suppressed run counts `updated: 1`).

- [ ] **Step 3: Implement the pure module**

Create `src/lib/crm/suppression.ts`:

```ts
import { normalizeEmail, normalizeLinkedinUrl } from "./identity";
import type { ContactIdentity } from "./match-lead";

// Round 2 §3. Pure, mongoose-free: the key-derivation and query-shape rules
// live here so they can be asserted without a database, and so the delete
// path (which writes the keys) and the create path (which reads them) can
// never disagree about normalisation.

export interface SuppressionKeys {
  emails: string[];
  linkedinUrls: string[];
  gmailThreadIds: string[];
  conversationKeys: string[];
}

export interface SuppressibleLead {
  emails?: string[];
  decisionMaker?: { email?: string; linkedinUrl?: string };
  gmailThreadIds?: string[];
  linkedinConversationIds?: string[];
}

function uniq(values: (string | undefined | null)[]): string[] {
  const out: string[] = [];
  for (const v of values) {
    const s = (v ?? "").trim();
    if (!s) continue;
    if (!out.includes(s)) out.push(s);
  }
  return out;
}

/** Every identity key a future ingest could match this lead on. */
export function suppressionKeysFor(lead: SuppressibleLead): SuppressionKeys {
  return {
    emails: uniq([...(lead.emails ?? []), lead.decisionMaker?.email].map((e) => (e ? normalizeEmail(e) : ""))),
    linkedinUrls: uniq([lead.decisionMaker?.linkedinUrl].map((u) => (u ? normalizeLinkedinUrl(u) : ""))),
    gmailThreadIds: uniq(lead.gmailThreadIds ?? []),
    // Conversation keys are already canonical when written (a normalised
    // profile URL or a name slug), so they are only trimmed/deduped here.
    conversationKeys: uniq(lead.linkedinConversationIds ?? []),
  };
}

/**
 * The Mongo filter that answers "has the operator deleted this contact?".
 * Deliberately EXACT-key only — email, LinkedIn URL, conversation key,
 * Gmail thread id. A domain clause would mean deleting one person's lead
 * silently blocks every future colleague at the same organisation.
 * Returns null when the identity carries no suppressible key, so a caller
 * can never accidentally issue a match-everything query.
 */
export function suppressionQuery(
  identity: ContactIdentity & { conversationKey?: string; gmailThreadIds?: string[] }
): Record<string, unknown> | null {
  const or: Record<string, unknown>[] = [];
  const email = identity.email ? normalizeEmail(identity.email) : "";
  if (email) or.push({ emails: email });
  const li = identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) : "";
  if (li) or.push({ linkedinUrls: li });
  const key = identity.conversationKey?.trim();
  if (key) or.push({ conversationKeys: key });
  const threadIds = uniq(identity.gmailThreadIds ?? []);
  if (threadIds.length) or.push({ gmailThreadIds: { $in: threadIds } });
  return or.length ? { $or: or } : null;
}
```

- [ ] **Step 4: Gate the upsert seam on suppression**

In `src/lib/crm/upsert-lead.ts`:

1. Extend the imports:

```ts
import { connectDB } from "@core/db";
import { Lead, LeadSuppression, type ILead, type ITouch, type Product } from "@/models";
import { matchQuery, newLeadFields, pickLead, type ContactIdentity, type MatchBy, type MatchableLead } from "./match-lead";
import { mergeTouches, applyIngestStatus, type IncomingTouch } from "./touches";
import { suppressionQuery } from "./suppression";
import { normalizeEmail } from "./identity";
```

2. Add the result type above `UpsertArgs`:

```ts
export interface UpsertResult {
  leadId: string;
  created: boolean;
  added: number;
  matchedBy: MatchBy | "new" | "suppressed";
  /** Round 2 §3: set when the identity is on the suppression list and
   *  nothing was written. `leadId` is "" in that case. */
  suppressed?: boolean;
}
```

3. Change the signature to `export async function upsertLeadWithTouches(args: UpsertArgs): Promise<UpsertResult> {`.

4. Replace the `let created = false; if (!lead) { ... }` block (lines 49–55) with:

```ts
  let created = false;
  if (!lead) {
    // Round 2 §3: matching an EXISTING lead is unaffected by suppression —
    // only creation is blocked. Checking here (rather than at the top) keeps
    // a restored lead importable again immediately, and means a suppressed
    // contact who later writes from a colleague's address still lands on the
    // existing organisation lead if one exists.
    const sq = suppressionQuery({ ...args.identity, conversationKey: args.linkedinConversationId });
    if (sq && (await LeadSuppression.exists(sq))) {
      return { leadId: "", created: false, added: 0, matchedBy: "suppressed", suppressed: true };
    }
    lead = await Lead.create(newLeadFields(args.identity, args.source));
    created = true;
    matchedBy = "new";
  }
```

- [ ] **Step 5: Count suppressed in the ingest tally**

In `src/lib/crm/gmail-ingest.ts`:

1. In `IngestPageResult`, change the counter line to:

```ts
  scanned: number; kept: number; created: number; updated: number; suppressed: number; touchesAdded: number; errors: number;
```

2. In `ingestGmailPage`, change the `out` initialiser's first line to:

```ts
    scanned: 0, kept: 0, created: 0, updated: 0, suppressed: 0, touchesAdded: 0, errors: 0,
```

3. Replace the two result lines at the end of the loop with:

```ts
    if (r.suppressed) out.suppressed++;
    else if (r.created) out.created++;
    else out.updated++;
    out.touchesAdded += r.added;
```

- [ ] **Step 6: Add `action: "delete"` to the bulk route**

In `src/app/api/admin/outreach/leads/bulk/route.ts`:

1. Extend the imports:

```ts
import { Lead, LeadSuppression } from "@/models";
import { applyApprove, applyKill } from "@/lib/outreach/lead-transitions";
import { suppressionKeysFor, type SuppressibleLead } from "@/lib/crm/suppression";
```

2. Replace the action guard with:

```ts
    if (action !== "approve" && action !== "kill" && action !== "delete") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
```

3. Add `const deleted: string[] = [];` beside `const updated: string[] = [];`.

4. Immediately after the `if (!lead) { ... continue; }` block inside the loop, insert:

```ts
      if (action === "delete") {
        // Round 2 §3: write the tombstone FIRST. If the delete then fails the
        // operator sees the lead still there and can retry; if the order were
        // reversed a crash between the two would delete the lead with nothing
        // stopping the next import from recreating it, and no way to restore.
        try {
          const snapshot = lead.toObject();
          await LeadSuppression.create({
            leadId: String(lead._id),
            company: lead.company || "(no company)",
            ...suppressionKeysFor(snapshot as SuppressibleLead),
            snapshot,
            deletedAt: now,
          });
        } catch (err) {
          console.error(`[OUTREACH] bulk delete failed to suppress ${id}:`, err);
          skipped.push({ id, reason: "suppression write failed" });
          continue;
        }
        try {
          await lead.deleteOne();
          deleted.push(id);
        } catch (err) {
          console.error(`[OUTREACH] bulk delete failed to remove ${id}:`, err);
          skipped.push({ id, reason: "delete failed" });
        }
        continue;
      }
```

5. Change the success response to carry both lists:

```ts
    return NextResponse.json({ success: true, action, updated, deleted, skipped });
```

6. Extend the header comment above `export async function POST` with a sentence:

```ts
// `action: "delete"` additionally writes a LeadSuppression tombstone per lead
// before removing it, so a re-import reports the lead as `suppressed` instead
// of recreating it, and "Restore" can bring it back with its touches.
```

- [ ] **Step 7: Add the deleted-list and restore routes**

Create `src/app/api/admin/outreach/leads/deleted/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { LeadSuppression, type ILeadSuppression } from "@/models";

// GET - the most recent suppressions (deleted leads), newest first. Feeds the
// Import tab's "Deleted leads" list; capped at 100 because it is a recovery
// aid, not an audit log.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const docs = await LeadSuppression.find({})
      .sort({ deletedAt: -1 })
      .limit(100)
      .select("_id company deletedAt emails")
      .lean<Pick<ILeadSuppression, "_id" | "company" | "deletedAt" | "emails">[]>();
    return NextResponse.json({
      deleted: docs.map((d) => ({
        _id: String(d._id),
        company: d.company,
        deletedAt: new Date(d.deletedAt).toISOString(),
        emails: d.emails ?? [],
      })),
    });
  } catch (error) {
    console.error("[OUTREACH] deleted leads GET Error:", error);
    return NextResponse.json({ error: "Failed to load deleted leads" }, { status: 500 });
  }
}
```

Create `src/app/api/admin/outreach/leads/restore/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead, LeadSuppression } from "@/models";

const bodySchema = z.object({ suppressionId: z.string().min(1).max(64) });

// POST - undo a delete: recreate the lead from its snapshot, then drop the
// tombstone so ingest can reach it again.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "suppressionId is required" }, { status: 400 });

  try {
    await connectDB();
    const doc = await LeadSuppression.findById(parsed.data.suppressionId).catch(() => null);
    if (!doc) return NextResponse.json({ error: "Deleted lead not found" }, { status: 404 });

    const snapshot = { ...((doc.snapshot ?? {}) as Record<string, unknown>) };
    // A fresh document: the old _id may since have been reused by nothing,
    // but re-inserting it would make the restore fail if the operator had
    // already recreated the lead by hand. The timestamps are re-stamped for
    // the same reason.
    delete snapshot._id;
    delete snapshot.__v;
    delete snapshot.createdAt;
    delete snapshot.updatedAt;
    if (!snapshot.company) return NextResponse.json({ error: "Snapshot is not a lead" }, { status: 422 });

    const lead = await Lead.create(snapshot);
    // Only now: while the tombstone exists the lead is unreachable by ingest,
    // so dropping it last means a failed create leaves the delete intact.
    await doc.deleteOne();
    return NextResponse.json({ leadId: String(lead._id) });
  } catch (error) {
    console.error("[OUTREACH] restore Error:", error);
    return NextResponse.json({ error: "Failed to restore lead" }, { status: 500 });
  }
}
```

- [ ] **Step 8: Register the test script**

In `package.json`, add `test:crm-suppression` and put it in the chain:

```json
    "test:crm-suppression": "npx tsx src/lib/crm/suppression.test.ts",
    "test:crm": "npm run test:crm-models && npm run test:crm-core && npm run test:crm-suppression && npm run test:crm-upsert-smoke && npm run test:crm-contact && npm run test:crm-gmail && npm run test:crm-gmail-classify && npm run test:crm-gmail-ingest && npm run test:crm-linkedin && npm run test:crm-archive",
```

- [ ] **Step 9: Gates**

Run: `npm run test:crm-suppression && npm run test:crm-gmail-ingest && npx tsc --noEmit -p tsconfig.json`
Expected: both test files print `0 failed`; `tsc` prints nothing.

- [ ] **Step 10: Manual check — deploy-time**

> **Deploy-time only.** Select three Pagevault rows in Pipeline → "Delete selected (3)" → accept the `confirm()`. They vanish from Review/Today/Pipeline. Run a Gmail dry run for the same mailbox: the counts line shows `suppressed 3` and `created 0` for those threads. From Import → "Deleted leads", press Restore on one: it reappears in Pipeline with its touches, and a further Gmail import updates it normally.

- [ ] **Step 11: Commit**

```bash
git add src/lib/crm/suppression.ts src/lib/crm/suppression.test.ts src/lib/crm/upsert-lead.ts src/lib/crm/gmail-ingest.ts src/lib/crm/gmail-ingest.test.ts src/app/api/admin/outreach/leads/bulk/route.ts src/app/api/admin/outreach/leads/deleted/route.ts src/app/api/admin/outreach/leads/restore/route.ts package.json
git commit -m "feat(crm): delete with suppression, restore, and a suppressed ingest counter

Spec §3: bulk delete writes a LeadSuppression tombstone before removing the
lead; upsertLeadWithTouches refuses to CREATE a suppressed identity (matching
an existing lead is unaffected) and reports matchedBy=suppressed, which the
Gmail ingest tallies separately.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

---

### Task 4: Options endpoint + the open-list gates (spec §2)

**Files:**
- Create: `src/lib/crm/console-helpers.ts`, `src/lib/crm/console-helpers.test.ts`, `src/app/api/admin/outreach/options/route.ts`
- Modify: `src/app/api/admin/outreach/research/route.ts`, `src/lib/outreach/segment-landing.ts`, `package.json`

**Interfaces:**
- Produces (pure, mongoose-free, imported by client components): `mergeOptionValues(seeds: readonly string[], present: (string | null | undefined)[]): string[]` — the seeds in seed order first, then every other non-empty value sorted `localeCompare`, deduped.
- Produces: `GET /api/admin/outreach/options` → `{ products: string[]; segments: string[] }`.
- Changes: `POST /api/admin/outreach/research` accepts a `segment` that is in `LEAD_SEGMENTS` **or** in `Lead.distinct("segment")`.
- Changes: `landingPathForSegment(segment: string): string`, backed by `Record<string, string>` with the existing `?? "/"` fallback (and no longer importing from `models/Lead`, which drags mongoose in).

- [ ] **Step 1: Write the failing test**

Create `src/lib/crm/console-helpers.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { mergeOptionValues } from "./console-helpers";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {

await test("seeds come first in seed order, extras follow sorted", () => {
  assert.deepEqual(
    mergeOptionValues(["voice_tutor", "academy", "other"], ["zeta", "academy", "homework_bot"]),
    ["voice_tutor", "academy", "other", "homework_bot", "zeta"]
  );
});
await test("empty, null and whitespace values are dropped", () => {
  assert.deepEqual(mergeOptionValues(["a"], ["", null, undefined, "  ", "b"]), ["a", "b"]);
});
await test("duplicates collapse and values are trimmed", () => {
  assert.deepEqual(mergeOptionValues(["a"], ["  b  ", "b", "a"]), ["a", "b"]);
});
await test("no present values gives exactly the seeds", () => {
  assert.deepEqual(mergeOptionValues(["a", "b"], []), ["a", "b"]);
});

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx tsx src/lib/crm/console-helpers.test.ts`
Expected: FAILS with `Cannot find module './console-helpers'`.

- [ ] **Step 3: Create the console-helpers module**

Create `src/lib/crm/console-helpers.ts`:

```ts
// Pure, mongoose-free helpers the outreach console's CLIENT components
// import directly (see the header comment in src/lib/outreach/enums.ts for
// why anything they import must not touch mongoose, and
// scripts/test-outreach-guards.ts for the guard that enforces it).
// Task 5 adds sourcePill / leadMatchesQuery / compareLeads below.

/**
 * Round 2 §2. The option list behind an open dropdown: the seed values in
 * their declared order (they carry the label maps and the product taxonomy),
 * then every other value actually present on a lead, sorted. Saving a lead
 * with a new value is what adds it — there is no options manager.
 */
export function mergeOptionValues(
  seeds: readonly string[],
  present: (string | null | undefined)[]
): string[] {
  const out: string[] = [];
  for (const s of seeds) {
    const v = s.trim();
    if (v && !out.includes(v)) out.push(v);
  }
  const extras: string[] = [];
  for (const p of present) {
    const v = (p ?? "").trim();
    if (!v || out.includes(v) || extras.includes(v)) continue;
    extras.push(v);
  }
  extras.sort((a, b) => a.localeCompare(b));
  return [...out, ...extras];
}
```

- [ ] **Step 4: Add the options endpoint**

Create `src/app/api/admin/outreach/options/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead } from "@/models";
import { LEAD_SEGMENTS, PRODUCTS } from "@/lib/outreach/enums";
import { mergeOptionValues } from "@/lib/crm/console-helpers";

// GET - the values the Pipeline's Product/Segment dropdowns offer: the seed
// lists plus every distinct value already on a lead (round-2 §2). Cheap
// enough to re-fetch after every inline save, which is how a brand-new
// "Other…" value becomes available on every other row.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const [products, segments] = await Promise.all([
      Lead.distinct("product") as Promise<(string | null)[]>,
      Lead.distinct("segment") as Promise<(string | null)[]>,
    ]);
    return NextResponse.json({
      products: mergeOptionValues(PRODUCTS, products),
      segments: mergeOptionValues(LEAD_SEGMENTS, segments),
    });
  } catch (error) {
    console.error("[OUTREACH] options GET Error:", error);
    return NextResponse.json({ error: "Failed to load options" }, { status: 500 });
  }
}
```

- [ ] **Step 5: Open the research route's segment gate**

In `src/app/api/admin/outreach/research/route.ts`:

1. Add `Lead` to the imports:

```ts
import { Lead } from "@/models";
```

2. Replace the POST body validation (the `if (!LEAD_SEGMENTS.includes(segment))` block through `await connectDB();`) with:

```ts
    const body = await request.json();
    const { segment, niche = "", region = "", count } = body ?? {};
    const seg = typeof segment === "string" ? segment.trim() : "";
    if (!seg) {
      return NextResponse.json({ error: "Invalid segment" }, { status: 400 });
    }
    const n = Number(count);
    if (!Number.isInteger(n) || n < 1 || n > 25) {
      return NextResponse.json({ error: "count must be an integer 1-25" }, { status: 400 });
    }
    await connectDB();
    // Round 2 §2: the segment list is open, but not arbitrary — a value is
    // legal if it is a seed or is already in use on a lead. That keeps a
    // typo'd segment from silently spawning a research job nobody can find.
    if (!(LEAD_SEGMENTS as readonly string[]).includes(seg)) {
      const known = (await Lead.distinct("segment")) as (string | null)[];
      if (!known.some((k) => (k ?? "").trim() === seg)) {
        return NextResponse.json({ error: "Invalid segment" }, { status: 400 });
      }
    }
```

3. Change the create call to use the trimmed value:

```ts
    const job = await ResearchJob.create({
      segment: seg, niche: String(niche).slice(0, 200), region: String(region).slice(0, 200), count: n,
    });
```

- [ ] **Step 6: Make the segment landing map open**

Replace `src/lib/outreach/segment-landing.ts` in full:

```ts
// Targets are the /solutions/[segment] pages (separate plan:
// 2026-08-04-solutions-segment-pages.md). Fallback "/" until a page ships.
//
// Round 2 §2: the segment list is open, so this is keyed by plain string
// rather than the (now string) LeadSegment alias — an operator-created
// segment simply has no landing page and falls through to "/". Importing the
// type from models/Lead would also drag mongoose into this module.
const MAP: Record<string, string> = {
  nursing_program: "/solutions/nursing",
  testprep_academy: "/solutions/test-prep-academies",
  homeschool_charter: "/solutions/homeschool-charters",
  microschool: "/solutions/schools",
  school_district: "/solutions/schools",
  private_school: "/solutions/schools",
  intl_school: "/solutions/schools",
  library: "/",
  publisher: "/solutions/publishers-agencies",
  agency: "/solutions/publishers-agencies",
  corporate_ld: "/solutions/corporate-ld",
  other: "/",
};

export function landingPathForSegment(segment: string): string {
  return MAP[segment] ?? "/";
}
```

- [ ] **Step 7: Register the test script**

In `package.json` add `test:crm-console` and put it in the chain right after `test:crm-suppression`:

```json
    "test:crm-console": "npx tsx src/lib/crm/console-helpers.test.ts",
```

and the chain becomes:

```json
    "test:crm": "npm run test:crm-models && npm run test:crm-core && npm run test:crm-suppression && npm run test:crm-console && npm run test:crm-upsert-smoke && npm run test:crm-contact && npm run test:crm-gmail && npm run test:crm-gmail-classify && npm run test:crm-gmail-ingest && npm run test:crm-linkedin && npm run test:crm-archive",
```

- [ ] **Step 8: Gates**

Run: `npm run test:crm-console && npm run test:outreach-cadence && npx tsc --noEmit -p tsconfig.json`
Expected: `0 failed` in both (`cadence.test.ts` covers `landingPathForSegment` across every seed segment); `tsc` prints nothing.

- [ ] **Step 9: Manual check — deploy-time**

> **Deploy-time only.** `GET /api/admin/outreach/options` returns the six seed products plus any operator-created ones, and the twelve seed segments plus any in use. Creating a research job with a segment that exists only on a lead succeeds; a nonsense segment still 400s with `Invalid segment`.

- [ ] **Step 10: Commit**

```bash
git add src/lib/crm/console-helpers.ts src/lib/crm/console-helpers.test.ts src/app/api/admin/outreach/options/route.ts src/app/api/admin/outreach/research/route.ts src/lib/outreach/segment-landing.ts package.json
git commit -m "feat(crm): options endpoint (seeds + values in use) and open segment gates

Spec §2: /api/admin/outreach/options merges the seed lists with Lead.distinct;
the research route accepts any segment that is a seed or already in use;
segment-landing is keyed by plain string with the existing / fallback.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

---

### Task 5: Client pure helpers — source pill, search, sort (spec §5, §6)

**Files:**
- Modify: `src/lib/crm/console-helpers.ts`, `src/lib/crm/console-helpers.test.ts`

**Interfaces:**
- Produces: `sourcePill(source?: string): { label: string; tone: "gmail" | "form" | "linkedin" | "research" }`.
- Produces: `leadMatchesQuery(lead: SearchableLead, q: string): boolean` over company, decision-maker name/title/email, `emails[]`, notes, source, product, segment, and each touch's subject/body/summary/from/to. Case-insensitive substring; an empty/whitespace query returns `true`.
- Produces: `compareLeads(a: SortableLead, b: SortableLead, key: SortKey, dir: SortDir): number` with `SortKey = "company" | "segment" | "status" | "product" | "decisionMaker" | "touches" | "nextActionAt" | "lastTouchAt"` and `SortDir = "asc" | "desc"`. Strings compare with `localeCompare`; touches/dates compare numerically; empty values sort LAST in both directions.
- Consumed by: `PipelineTab` (Task 6), `TodayTab` (Task 7).

- [ ] **Step 1: Write the failing tests**

In `src/lib/crm/console-helpers.test.ts`, extend the import on line 2 to:

```ts
import { mergeOptionValues, sourcePill, leadMatchesQuery, compareLeads, type SortableLead } from "./console-helpers";
```

and append, before the final `console.log`/`process.exit` line:

```ts
await test("sourcePill: gmail sources show the mailbox local part", () => {
  assert.deepEqual(sourcePill("gmail:praveen@evelynlearning.com"), { label: "praveen@", tone: "gmail" });
  assert.deepEqual(sourcePill("gmail:Info@EvelynLearning.com"), { label: "info@", tone: "gmail" });
});
await test("sourcePill: form, linkedin, research", () => {
  assert.deepEqual(sourcePill("contact-form"), { label: "form", tone: "form" });
  assert.deepEqual(sourcePill("linkedin:paste"), { label: "LinkedIn", tone: "linkedin" });
  assert.deepEqual(sourcePill("linkedin:archive"), { label: "LinkedIn", tone: "linkedin" });
  assert.deepEqual(sourcePill("research-job:68d1"), { label: "research", tone: "research" });
});
await test("sourcePill: empty, missing and legacy sources fall back to research", () => {
  assert.deepEqual(sourcePill(undefined), { label: "research", tone: "research" });
  assert.deepEqual(sourcePill(""), { label: "research", tone: "research" });
  assert.deepEqual(sourcePill("claude-research-2026-08"), { label: "research", tone: "research" });
});

const searchable: SortableLead = {
  company: "Pagevault",
  segment: "publisher",
  product: "content_services",
  status: "contacted",
  notes: "Introduced by Dee",
  source: "gmail:info@evelynlearning.com",
  emails: ["ops@pagevault.io"],
  decisionMaker: { name: "Pat Lee", title: "Head of Content", email: "pat@pagevault.io" },
  touches: [
    { at: "2026-09-01T00:00:00.000Z", subject: "Intro", body: "We digitise textbooks", summary: "Sent: Intro", from: "info@evelynlearning.com", to: "ops@pagevault.io" },
  ],
};

await test("leadMatchesQuery: an empty query matches everything", () => {
  assert.equal(leadMatchesQuery(searchable, ""), true);
  assert.equal(leadMatchesQuery(searchable, "   "), true);
});
await test("leadMatchesQuery: matches every documented field, case-insensitively", () => {
  for (const q of ["PAGEVAULT", "publisher", "content_services", "contacted", "Dee", "info@evelyn", "ops@pagevault", "Pat Lee", "Head of Content", "pat@pagevault", "Intro", "digitise"]) {
    assert.equal(leadMatchesQuery(searchable, q), true, q);
  }
});
await test("leadMatchesQuery: touch summary and recipient are searchable", () => {
  assert.equal(leadMatchesQuery(searchable, "Sent: Intro"), true);
  assert.equal(leadMatchesQuery(searchable, "ops@pagevault.io"), true);
});
await test("leadMatchesQuery: a miss is a miss, and a bare lead never throws", () => {
  assert.equal(leadMatchesQuery(searchable, "kanzoo"), false);
  assert.equal(leadMatchesQuery({}, "kanzoo"), false);
  assert.equal(leadMatchesQuery({}, ""), true);
});

const A: SortableLead = { company: "Acme", segment: "microschool", status: "approved", product: "academy", decisionMaker: { name: "Ann" }, nextActionAt: "2026-09-20T00:00:00.000Z", touches: [{ at: "2026-09-10T00:00:00.000Z" }, { at: "2026-09-18T00:00:00.000Z" }] };
const B: SortableLead = { company: "Zed", segment: "library", status: "dead", product: "mock_exams", decisionMaker: { name: "Bo" }, nextActionAt: "2026-09-25T00:00:00.000Z", touches: [{ at: "2026-09-19T00:00:00.000Z" }] };
const E: SortableLead = {};

await test("compareLeads: strings sort by localeCompare and flip with dir", () => {
  for (const k of ["company", "segment", "status", "product", "decisionMaker"] as const) {
    assert.ok(compareLeads(A, B, k, "asc") < 0, `${k} asc`);
    assert.ok(compareLeads(A, B, k, "desc") > 0, `${k} desc`);
    assert.equal(compareLeads(A, A, k, "asc"), 0, `${k} equal`);
  }
});
await test("compareLeads: touch count is numeric, not lexical", () => {
  assert.ok(compareLeads(B, A, "touches", "asc") < 0);
  assert.ok(compareLeads(B, A, "touches", "desc") > 0);
});
await test("compareLeads: nextActionAt and lastTouchAt compare as dates", () => {
  assert.ok(compareLeads(A, B, "nextActionAt", "asc") < 0);
  assert.ok(compareLeads(A, B, "lastTouchAt", "asc") < 0);
  assert.ok(compareLeads(A, B, "lastTouchAt", "desc") > 0);
});
await test("compareLeads: empty values sort LAST in both directions", () => {
  for (const k of ["company", "product", "decisionMaker", "nextActionAt", "lastTouchAt"] as const) {
    assert.ok(compareLeads(E, A, k, "asc") > 0, `${k} asc`);
    assert.ok(compareLeads(E, A, k, "desc") > 0, `${k} desc`);
    assert.equal(compareLeads(E, E, k, "asc"), 0, `${k} both empty`);
  }
});
await test("compareLeads: a lead with zero touches is 0, not empty", () => {
  assert.ok(compareLeads(E, A, "touches", "asc") < 0);
});
await test("compareLeads sorts a list end to end", () => {
  const sorted = [B, E, A].sort((x, y) => compareLeads(x, y, "company", "asc")).map((l) => l.company ?? "—");
  assert.deepEqual(sorted, ["Acme", "Zed", "—"]);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm run test:crm-console`
Expected: FAILS on import — `sourcePill`, `leadMatchesQuery`, `compareLeads` and `SortableLead` are not exported yet.

- [ ] **Step 3: Implement the three helpers**

Append to `src/lib/crm/console-helpers.ts`:

```ts
/**
 * Round 2 §5. Where a lead came from, derived from `Lead.source` on the
 * client. Source forms in the wild: `gmail:<account>`, `contact-form`,
 * `linkedin:paste`, `linkedin:archive`, `research-job:<id>`, plus legacy
 * free text (`claude-research-2026-08`) and empty — anything unrecognised is
 * research, because that is what every pre-CRM lead was.
 */
export function sourcePill(source?: string): { label: string; tone: "gmail" | "form" | "linkedin" | "research" } {
  const s = (source ?? "").trim().toLowerCase();
  if (s.startsWith("gmail:")) {
    const local = s.slice("gmail:".length).split("@")[0].trim();
    return { label: local ? `${local}@` : "gmail", tone: "gmail" };
  }
  if (s === "contact-form" || s === "form") return { label: "form", tone: "form" };
  if (s.startsWith("linkedin")) return { label: "LinkedIn", tone: "linkedin" };
  return { label: "research", tone: "research" };
}

export interface SearchableTouch {
  at?: string;
  subject?: string;
  body?: string;
  summary?: string;
  from?: string;
  to?: string;
}

export interface SearchableLead {
  company?: string;
  segment?: string;
  product?: string;
  notes?: string;
  source?: string;
  emails?: string[];
  decisionMaker?: { name?: string; title?: string; email?: string };
  touches?: SearchableTouch[];
}

/**
 * Round 2 §6. Case-insensitive substring over everything the operator can
 * see or remember about a lead, INCLUDING touch bodies — "typing pagevault
 * narrows to leads whose touches mention it" is the acceptance case. Applied
 * client-side over the already-loaded list, so an empty query must be cheap
 * and must match everything.
 */
export function leadMatchesQuery(lead: SearchableLead, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const fields: (string | undefined)[] = [
    lead.company,
    lead.segment,
    lead.product,
    lead.notes,
    lead.source,
    lead.decisionMaker?.name,
    lead.decisionMaker?.title,
    lead.decisionMaker?.email,
    ...(lead.emails ?? []),
  ];
  for (const t of lead.touches ?? []) fields.push(t.subject, t.body, t.summary, t.from, t.to);
  return fields.some((f) => !!f && f.toLowerCase().includes(needle));
}

export type SortKey =
  | "company" | "segment" | "status" | "product" | "decisionMaker"
  | "touches" | "nextActionAt" | "lastTouchAt";
export type SortDir = "asc" | "desc";

export interface SortableLead extends SearchableLead {
  status?: string;
  nextActionAt?: string | null;
}

const NUMERIC_KEYS: SortKey[] = ["touches", "nextActionAt", "lastTouchAt"];

function textOf(lead: SortableLead, key: SortKey): string {
  switch (key) {
    case "company": return lead.company ?? "";
    case "segment": return lead.segment ?? "";
    case "status": return lead.status ?? "";
    case "product": return lead.product ?? "";
    // The cell renders the name, falling back to the address — sort on
    // whatever it actually shows.
    case "decisionMaker": return lead.decisionMaker?.name || lead.decisionMaker?.email || "";
    default: return "";
  }
}

/** null means "this lead has no value for this column" — always sorted last. */
function numberOf(lead: SortableLead, key: SortKey): number | null {
  if (key === "touches") return (lead.touches ?? []).length;
  if (key === "nextActionAt") {
    if (!lead.nextActionAt) return null;
    const t = new Date(lead.nextActionAt).getTime();
    return Number.isNaN(t) ? null : t;
  }
  const stamps = (lead.touches ?? [])
    .map((t) => (t.at ? new Date(t.at).getTime() : Number.NaN))
    .filter((n) => !Number.isNaN(n));
  return stamps.length ? Math.max(...stamps) : null;
}

/**
 * Round 2 §6: every Pipeline header toggles asc/desc. Blank cells always
 * sink to the bottom, in BOTH directions — flipping the sort to find the
 * newest reply should not fill the top of the table with leads that have
 * never been touched.
 */
export function compareLeads(a: SortableLead, b: SortableLead, key: SortKey, dir: SortDir): number {
  const sign = dir === "desc" ? -1 : 1;
  if (NUMERIC_KEYS.includes(key)) {
    const x = numberOf(a, key);
    const y = numberOf(b, key);
    if (x === null && y === null) return 0;
    if (x === null) return 1;
    if (y === null) return -1;
    return (x - y) * sign;
  }
  const x = textOf(a, key);
  const y = textOf(b, key);
  if (!x && !y) return 0;
  if (!x) return 1;
  if (!y) return -1;
  return x.localeCompare(y) * sign;
}
```

- [ ] **Step 4: Gates**

Run: `npm run test:crm-console && npx tsc --noEmit -p tsconfig.json`
Expected: `0 failed`; `tsc` prints nothing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/console-helpers.ts src/lib/crm/console-helpers.test.ts
git commit -m "feat(crm): pure source-pill, search and sort helpers for the console

Spec §5/§6: sourcePill derives the origin from Lead.source; leadMatchesQuery
covers every field including touch bodies; compareLeads handles the eight
sortable columns and always sinks blanks.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

---

### Task 6: PipelineTab rewrite, LeadJSON, TimelineDrawer (spec §5, §6)

**Files:**
- Modify: `src/app/admin/outreach/PipelineTab.tsx` (full rewrite), `src/app/admin/outreach/OutreachConsole.tsx`, `src/app/admin/outreach/TimelineDrawer.tsx`

**Interfaces:**
- Consumes: `compareLeads`, `leadMatchesQuery`, `sourcePill`, `SortKey`, `SortDir` from `@/lib/crm/console-helpers`; `GET /api/admin/outreach/options`; `PATCH /api/admin/outreach/leads/[id]` actions `setStatus`, `workToday`, `edit` (fields `segment`, `product`, `decisionMaker`, `notes`); `POST /api/admin/outreach/leads/bulk` `{ action: "delete", ids }`.
- Changes: `LeadJSON` gains `product?: string` and loses `opportunities`.
- Changes: `TimelineDrawer` props become `{ lead: LeadJSON; onClose: () => void; refresh: () => Promise<void> }`.

- [ ] **Step 1: Update LeadJSON**

In `src/app/admin/outreach/OutreachConsole.tsx`:

1. Drop the now-unused `Product` from the type import on line 6:

```ts
import type { EmailSource, LeadSegment, LeadStatus, LinkedinSource, TouchChannel, TouchOrigin } from "@/lib/outreach/enums";
```

2. Replace the `opportunities` block in `LeadJSON` (lines 73–79) with:

```ts
  /** Round 2 §1: one product per lead; free string. */
  product?: string;
```

- [ ] **Step 2: Rewrite PipelineTab**

Replace `src/app/admin/outreach/PipelineTab.tsx` in full:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Trash2, X, Zap } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/outreach/enums";
import {
  compareLeads,
  leadMatchesQuery,
  sourcePill,
  type SortDir,
  type SortKey,
} from "@/lib/crm/console-helpers";
import type { LeadJSON } from "./OutreachConsole";
import { SEGMENT_LABELS } from "./ReviewQueueTab";
import TimelineDrawer from "./TimelineDrawer";

const STATUS_COLORS: Record<string, string> = {
  staged: "bg-gray-100 text-gray-700",
  approved: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  replied: "bg-purple-100 text-purple-700",
  call_booked: "bg-green-100 text-green-700",
  parked: "bg-orange-100 text-orange-700",
  dead: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  staged: "Staged",
  approved: "Approved",
  contacted: "Contacted",
  replied: "Replied",
  call_booked: "Call booked",
  parked: "Parked",
  dead: "Dead",
};

const PILL_TONES: Record<string, string> = {
  gmail: "bg-rose-50 text-rose-700",
  form: "bg-emerald-50 text-emerald-700",
  linkedin: "bg-sky-50 text-sky-700",
  research: "bg-gray-100 text-gray-600",
};

// Column widths total 1216px — the usable width of the console's max-w-7xl
// (1280px) main column minus its px-4 gutters — so the whole table fits one
// screen at 1280 with no horizontal scroll (round-2 §6). `table-fixed` makes
// these authoritative instead of advisory.
const COLUMNS: { key: SortKey | null; label: string; width: number }[] = [
  { key: null, label: "", width: 36 },
  { key: "company", label: "Company", width: 190 },
  { key: "segment", label: "Segment", width: 130 },
  { key: "status", label: "Status", width: 150 },
  { key: "product", label: "Product", width: 130 },
  { key: "decisionMaker", label: "Decision maker", width: 190 },
  { key: "touches", label: "Touches", width: 60 },
  { key: "nextActionAt", label: "Next action", width: 96 },
  { key: "lastTouchAt", label: "Last touch", width: 234 },
];

const OTHER = "__other__";

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) {
    const mins = Math.max(0, Math.floor(diffMs / (1000 * 60)));
    return `${mins}m ago`;
  } else if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`;
  }
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function PipelineTab({
  leads,
  refresh,
}: {
  leads: LeadJSON[];
  refresh: () => Promise<void>;
}) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [options, setOptions] = useState<{ products: string[]; segments: string[] }>({ products: [], segments: [] });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("company");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  // At most one "Other…" text box and one decision-maker editor open at a
  // time — the row is 130px wide, and two open editors never fit.
  const [otherFor, setOtherFor] = useState<{ id: string; field: "segment" | "product" } | null>(null);
  const [otherValue, setOtherValue] = useState("");
  const [dmFor, setDmFor] = useState<string | null>(null);
  const [dmDraft, setDmDraft] = useState({ name: "", title: "", email: "" });

  const loadOptions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/outreach/options");
      if (!res.ok) return;
      const data = await res.json();
      setOptions({ products: data.products ?? [], segments: data.segments ?? [] });
    } catch {
      // A failed options fetch leaves the dropdowns showing the lead's own
      // value plus "Other…", which is still fully usable.
    }
  }, []);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  // 150ms debounce (round-2 §6): the search runs over every loaded lead and
  // every touch body, so filtering on each keystroke is visibly janky.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  const setStatus = async (id: string, status: LeadStatus) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setStatus", status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update status");
        return;
      }
      await refresh();
    } catch {
      alert("Failed to update status");
    } finally {
      setPendingId(null);
    }
  };

  const saveFields = async (id: string, fields: Record<string, unknown>, failure: string) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", fields }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || failure);
        return false;
      }
      await refresh();
      // A brand-new "Other…" value only becomes available on every other row
      // once the options endpoint has seen it on a lead.
      await loadOptions();
      return true;
    } catch {
      alert(failure);
      return false;
    } finally {
      setPendingId(null);
    }
  };

  const workToday = async (id: string) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "workToday" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to bump lead to today");
        return;
      }
      await refresh();
    } catch {
      alert("Failed to bump lead to today");
    } finally {
      setPendingId(null);
    }
  };

  const onPickOption = async (lead: LeadJSON, field: "segment" | "product", value: string) => {
    if (value === OTHER) {
      setOtherFor({ id: lead._id, field });
      setOtherValue("");
      return;
    }
    await saveFields(lead._id, { [field]: value }, `Failed to update ${field}`);
  };

  const saveOther = async () => {
    if (!otherFor) return;
    const value = otherValue.trim();
    if (!value) return;
    const ok = await saveFields(otherFor.id, { [otherFor.field]: value }, `Failed to update ${otherFor.field}`);
    if (ok) {
      setOtherFor(null);
      setOtherValue("");
    }
  };

  const startDmEdit = (lead: LeadJSON) => {
    setDmFor(lead._id);
    setDmDraft({
      name: lead.decisionMaker?.name ?? "",
      title: lead.decisionMaker?.title ?? "",
      email: lead.decisionMaker?.email ?? "",
    });
  };

  const saveDm = async () => {
    if (!dmFor) return;
    // The `edit` action MERGES decisionMaker (lib/outreach/lead-edit.ts), so
    // sending only these three fields cannot wipe the vendor-provenance
    // history or the linkedinUrl.
    const ok = await saveFields(dmFor, { decisionMaker: { name: dmDraft.name.trim(), title: dmDraft.title.trim(), email: dmDraft.email.trim() } }, "Failed to update decision maker");
    if (ok) setDmFor(null);
  };

  const deleteSelected = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (
      !confirm(
        `Delete ${ids.length} lead${ids.length === 1 ? "" : "s"}? They are removed and suppressed, so a re-import will not bring them back. You can restore them from the Import tab.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/admin/outreach/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to delete leads");
        return;
      }
      if (Array.isArray(data.skipped) && data.skipped.length > 0) {
        alert(`Deleted ${data.deleted?.length ?? 0}; skipped ${data.skipped.length}: ${data.skipped.map((s: { id: string; reason: string }) => `${s.id} (${s.reason})`).join(", ")}`);
      }
      setSelected(new Set());
      await refresh();
      await loadOptions();
    } catch {
      alert("Failed to delete leads");
    }
  };

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const rows = leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (segmentFilter !== "all" && l.segment !== segmentFilter) return false;
      if (productFilter !== "all" && (l.product ?? "") !== productFilter) return false;
      return leadMatchesQuery(l, debouncedQuery);
    });
    return rows.sort((a, b) => compareLeads(a, b, sortKey, sortDir));
  }, [leads, statusFilter, segmentFilter, productFilter, debouncedQuery, sortKey, sortDir]);

  const allShownSelected = filtered.length > 0 && filtered.every((l) => selected.has(l._id));

  const toggleAllShown = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allShownSelected) for (const l of filtered) next.delete(l._id);
      else for (const l of filtered) next.add(l._id);
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const optionList = (kind: "segment" | "product", current?: string) => {
    const base = kind === "segment" ? options.segments : options.products;
    // A lead's own value must always be selectable even if the options fetch
    // failed or the value has since been renamed away from every other lead.
    return current && !base.includes(current) ? [current, ...base] : base;
  };

  const labelFor = (kind: "segment" | "product", value: string) =>
    kind === "segment" ? SEGMENT_LABELS[value] ?? value : value;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Status
          <select
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Segment
          <select
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
          >
            <option value="all">All</option>
            {options.segments.map((s) => (
              <option key={s} value={s}>
                {SEGMENT_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Product
          <select
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="all">All</option>
            {options.products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <input
          type="search"
          className="w-64 rounded-lg border border-gray-300 px-3 py-1 text-sm"
          placeholder="Search company, contact, notes, messages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {selected.size > 0 && (
          <button
            type="button"
            onClick={deleteSelected}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete selected ({selected.size})
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} of {leads.length} leads
        </span>
      </div>

      {/* Fixed-height scroll area with a sticky header (round-2 §6): the table
          scrolls inside this box so the page itself does not. 260px is the
          console chrome above it — header, tab bar, filter row. */}
      <div
        className="overflow-auto rounded-xl bg-white shadow"
        style={{ maxHeight: "calc(100vh - 260px)" }}
      >
        <table className="w-full table-fixed divide-y divide-gray-200 text-sm">
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.label || "select"} style={{ width: `${c.width}px` }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              {COLUMNS.map((c) =>
                c.key === null ? (
                  <th key="select" className="px-2 py-2 text-left">
                    <input
                      type="checkbox"
                      aria-label="Select all shown leads"
                      checked={allShownSelected}
                      onChange={toggleAllShown}
                    />
                  </th>
                ) : (
                  <th
                    key={c.key}
                    className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key as SortKey)}
                      className="inline-flex items-center gap-1 hover:text-gray-900"
                    >
                      {c.label}
                      {sortKey === c.key && <span aria-hidden>{sortDir === "asc" ? "▲" : "▼"}</span>}
                    </button>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-6 text-center text-sm text-gray-500">
                  No leads match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const dm = lead.decisionMaker;
                const outboundCount = lead.touches.filter((t) => t.direction === "outbound").length;
                const lastTouch = lead.touches.length > 0 ? lead.touches[lead.touches.length - 1] : null;
                const pill = sourcePill(lead.source);
                const busy = pendingId === lead._id;

                return (
                  <tr key={lead._id} className="align-top hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        aria-label={`Select ${lead.company}`}
                        checked={selected.has(lead._id)}
                        onChange={() => toggleOne(lead._id)}
                      />
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      <button
                        type="button"
                        title={lead.notes || undefined}
                        className="block w-full truncate text-left font-medium text-primary-700 hover:underline"
                        onClick={() => setOpenId(lead._id)}
                      >
                        {lead.company}
                      </button>
                    </td>
                    <td className="px-2 py-2">
                      {otherFor?.id === lead._id && otherFor.field === "segment" ? (
                        <OtherInput
                          value={otherValue}
                          busy={busy}
                          onChange={setOtherValue}
                          onSave={saveOther}
                          onCancel={() => setOtherFor(null)}
                        />
                      ) : (
                        <select
                          className="w-full rounded-lg border border-gray-300 px-1 py-1 text-xs"
                          value={lead.segment}
                          disabled={busy}
                          onChange={(e) => void onPickOption(lead, "segment", e.target.value)}
                        >
                          {optionList("segment", lead.segment).map((s) => (
                            <option key={s} value={s}>
                              {labelFor("segment", s)}
                            </option>
                          ))}
                          <option value={OTHER}>Other…</option>
                        </select>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <select
                          className={`w-full rounded-lg border-0 px-1 py-1 text-xs font-semibold ${STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-700"}`}
                          value={lead.status}
                          disabled={busy}
                          onChange={(e) => void setStatus(lead._id, e.target.value as LeadStatus)}
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s] ?? s}
                            </option>
                          ))}
                        </select>
                        {/* parked leads are at the touch cap; reviving them past the cadence is an owner product decision — not silently supported. */}
                        {(lead.status === "approved" || lead.status === "contacted") && (
                          <button
                            type="button"
                            onClick={() => void workToday(lead._id)}
                            disabled={busy}
                            title="Work today — bump this lead's next action to now"
                            aria-label="Work today"
                            className="shrink-0 rounded-lg bg-gray-100 p-1 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                          >
                            <Zap className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      {otherFor?.id === lead._id && otherFor.field === "product" ? (
                        <OtherInput
                          value={otherValue}
                          busy={busy}
                          onChange={setOtherValue}
                          onSave={saveOther}
                          onCancel={() => setOtherFor(null)}
                        />
                      ) : (
                        <select
                          className="w-full rounded-lg border border-gray-300 px-1 py-1 text-xs"
                          value={lead.product ?? ""}
                          disabled={busy}
                          onChange={(e) => void onPickOption(lead, "product", e.target.value)}
                        >
                          <option value="">—</option>
                          {optionList("product", lead.product).map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                          <option value={OTHER}>Other…</option>
                        </select>
                      )}
                    </td>
                    <td className="px-2 py-2 text-gray-600">
                      {dmFor === lead._id ? (
                        <div className="space-y-1">
                          <input
                            className="w-full rounded border border-gray-300 px-1 py-0.5 text-xs"
                            placeholder="Name"
                            value={dmDraft.name}
                            onChange={(e) => setDmDraft((d) => ({ ...d, name: e.target.value }))}
                          />
                          <input
                            className="w-full rounded border border-gray-300 px-1 py-0.5 text-xs"
                            placeholder="Title"
                            value={dmDraft.title}
                            onChange={(e) => setDmDraft((d) => ({ ...d, title: e.target.value }))}
                          />
                          <input
                            className="w-full rounded border border-gray-300 px-1 py-0.5 text-xs"
                            placeholder="Email"
                            value={dmDraft.email}
                            onChange={(e) => setDmDraft((d) => ({ ...d, email: e.target.value }))}
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => void saveDm()}
                              disabled={busy}
                              className="rounded bg-primary-600 p-1 text-white disabled:opacity-50"
                              aria-label="Save decision maker"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDmFor(null)}
                              className="rounded bg-gray-100 p-1 text-gray-600"
                              aria-label="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startDmEdit(lead)}
                          title="Click to edit name, title and email"
                          className="block w-full truncate text-left hover:text-primary-700 hover:underline"
                        >
                          {dm?.name || "—"}
                          {dm?.title ? ` (${dm.title})` : ""}
                          {dm?.email ? ` · ${dm.email}` : ""}
                        </button>
                      )}
                    </td>
                    <td className="px-2 py-2 text-gray-600">{outboundCount}</td>
                    <td className="px-2 py-2 text-gray-600">
                      {lead.nextActionAt ? new Date(lead.nextActionAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-2 py-2 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${PILL_TONES[pill.tone]}`}>
                          {pill.label}
                        </span>
                        <span className="truncate" title={lastTouch?.summary}>
                          {lastTouch ? `${relativeTime(lastTouch.at)} · ${lastTouch.summary}` : "—"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {openId &&
        (() => {
          const l = leads.find((x) => x._id === openId);
          return l ? <TimelineDrawer lead={l} onClose={() => setOpenId(null)} refresh={refresh} /> : null;
        })()}
    </div>
  );
}

// The "Other…" text box that replaces a dropdown in place. Enter saves,
// Escape cancels — the cell is too narrow for a labelled button pair.
function OtherInput({
  value,
  busy,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  busy: boolean;
  onChange: (v: string) => void;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        className="w-full rounded border border-gray-300 px-1 py-0.5 text-xs"
        placeholder="New value"
        value={value}
        disabled={busy}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void onSave();
          if (e.key === "Escape") onCancel();
        }}
      />
      <button
        type="button"
        onClick={() => void onSave()}
        disabled={busy || !value.trim()}
        className="shrink-0 rounded bg-primary-600 p-1 text-white disabled:opacity-50"
        aria-label="Save new value"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="shrink-0 rounded bg-gray-100 p-1 text-gray-600"
        aria-label="Cancel"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Show product and editable notes in the drawer**

Replace `src/app/admin/outreach/TimelineDrawer.tsx` in full:

```tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { LeadJSON } from "./OutreachConsole";

export default function TimelineDrawer({
  lead,
  onClose,
  refresh,
}: {
  lead: LeadJSON;
  onClose: () => void;
  refresh: () => Promise<void>;
}) {
  const touches = [...lead.touches].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveNotes = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/outreach/leads/${lead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", fields: { notes } }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to save notes");
        return;
      }
      setSaved(true);
      await refresh();
    } catch {
      alert("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{lead.company}</h2>
            <p className="text-sm text-gray-600">{lead.decisionMaker?.name}{lead.decisionMaker?.title ? ` · ${lead.decisionMaker.title}` : ""}</p>
            <p className="text-xs text-gray-500">{(lead.emails ?? []).join(", ")}{lead.decisionMaker?.linkedinUrl ? ` · ${lead.decisionMaker.linkedinUrl}` : ""}</p>
            {/* Round 2 §1: one product, edited in the Pipeline row. */}
            <p className="mt-1 text-xs text-gray-600">Product: {lead.product || "—"}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="lead-notes">
            Notes
          </label>
          <textarea
            id="lead-notes"
            className="mt-1 h-24 w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
            placeholder="Remarks about this lead"
          />
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void saveNotes()}
              disabled={saving}
              className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save notes"}
            </button>
            {saved && <span className="text-xs text-green-600">Saved</span>}
          </div>
        </div>

        {touches.length === 0 ? (
          <p className="text-sm text-gray-500">No touches yet.</p>
        ) : (
          <ol className="space-y-3">
            {touches.map((t, i) => (
              <li key={t.externalId ?? i} className={`rounded-lg border p-3 text-sm ${t.direction === "outbound" ? "border-blue-100 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                <div className="mb-1 flex flex-wrap gap-x-2 text-xs text-gray-500">
                  <span className="font-semibold uppercase">{t.channel}</span>
                  <span>{t.direction}</span>
                  <span>{new Date(t.at).toLocaleString()}</span>
                  {t.account && <span>{t.account}</span>}
                  {t.origin && <span>via {t.origin}</span>}
                </div>
                {t.subject && <div className="font-medium text-gray-900">{t.subject}</div>}
                <div className="whitespace-pre-wrap text-gray-800">{t.body ?? t.summary}</div>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}
```

- [ ] **Step 4: Gates**

Run: `npx tsc --noEmit -p tsconfig.json && npm run test:outreach-guards && npm run build 2>&1 | tail -20`
Expected: `tsc` prints nothing; the guard script prints `0 failed` (the new client imports are from `@/lib/crm/console-helpers` and `@/lib/outreach/enums`, never `@/models`); `npm run build` completes with no type errors.

- [ ] **Step 5: Manual check — deploy-time**

> **Deploy-time only.** At a 1280px viewport the Pipeline shows every column with no horizontal scroll and the page itself does not scroll — the table body scrolls under a sticky header. Clicking "Company" sorts A→Z, again Z→A. Typing `pagevault` narrows to leads whose touch bodies mention it. Changing Product to "Other… → Homework Bot" saves, and the value then appears in every other row's Product dropdown and in the Product filter. Segment, Status and the three decision-maker fields persist across a reload. The Work-today bolt appears only on `approved`/`contacted` rows. Hovering a company shows its notes; clicking opens the drawer, where the notes textarea saves.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/outreach/PipelineTab.tsx src/app/admin/outreach/OutreachConsole.tsx src/app/admin/outreach/TimelineDrawer.tsx
git commit -m "feat(crm): editable, sortable, searchable Pipeline table

Spec §5/§6: fixed-height sticky-header table sized for 1280px; inline
Segment/Status/Product dropdowns with Other…; in-place decision-maker edit;
select + Delete selected with confirm(); debounced search; source pill in
Last touch; Work today as an icon. LeadJSON swaps opportunities for product,
and the drawer shows the product and editable notes.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

---

### Task 7: TodayTab collapse (spec §7)

**Files:**
- Modify: `src/app/admin/outreach/TodayTab.tsx`

**Interfaces:**
- Consumes: `sourcePill` from `@/lib/crm/console-helpers`; the existing `isCadenceTouch`, `expectedNextChannel`, `SEQUENCE_STEP_LABELS`, `MAX_OUTBOUND_TOUCHES` from `@/lib/outreach/cadence`; `SEGMENT_LABELS` from `./ReviewQueueTab`.
- Produces: a local `CollapsibleLead` wrapper that owns the per-card `expanded` state (default `false`, not persisted) and renders `LeadCard` only when expanded. `LeadCard`'s own props and body are unchanged.

- [ ] **Step 1: Extend the imports**

In `src/app/admin/outreach/TodayTab.tsx`:

1. Add the two chevrons to the lucide import list (alphabetical position in that list is irrelevant; append before the closing brace):

```ts
  UserX,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
```

2. Add the helper import after the `SEGMENT_LABELS` import line:

```ts
import { sourcePill } from "@/lib/crm/console-helpers";
```

- [ ] **Step 2: Route the card through the collapse wrapper**

In the `due.map(...)` block, replace the `<LeadCard ... />` element with `<CollapsibleLead ... />`, keeping every existing prop:

```tsx
        <CollapsibleLead
          lead={lead}
          busy={pendingIds.has(lead._id)}
          onMarkSent={(channel) => markSent(lead._id, channel)}
          onCreateGmailDraft={(draft) => createGmailDraft(lead._id, draft)}
          onGenerateDraft={(channel) => generateDraft(lead._id, channel)}
          onSetLinkedinNotFound={(value) => setLinkedinNotFound(lead._id, value)}
          onEnrich={() => enrichLead(lead._id)}
          gmailAccount={gmailAccount}
        />
```

- [ ] **Step 3: Add the wrapper component**

Insert this immediately above `function LeadCard({` in the same file:

```tsx
// Round 2 §7. The Today list was every lead fully expanded, which meant
// scrolling past ~600px of card to see what else was due. The collapsed row
// carries exactly the fields needed to decide whether to open it; expansion
// state is per tab session and deliberately NOT persisted.
type LeadCardProps = Parameters<typeof LeadCard>[0];

function CollapsibleLead(props: LeadCardProps) {
  const { lead } = props;
  const [expanded, setExpanded] = useState(false);
  const dm = lead.decisionMaker;
  // Same expression as LeadCard's own outboundCount so the two can never
  // disagree about the step number (imported touches don't consume a step).
  const outboundCount = lead.touches.filter((t) => t.direction === "outbound" && isCadenceTouch(t)).length;
  const nextChannel = expectedNextChannel(lead.touches.map((t) => ({ ...t, at: new Date(t.at) })));
  const pill = sourcePill(lead.source);
  const Chevron = expanded ? ChevronDown : ChevronRight;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm shadow">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${lead.company}` : `Expand ${lead.company}`}
          className="shrink-0 rounded p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          <Chevron className="h-4 w-4" />
        </button>
        <span className="font-semibold text-gray-900">{lead.company}</span>
        <span className="inline-flex rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
          {SEGMENT_LABELS[lead.segment] ?? lead.segment}
        </span>
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          pill.tone === "gmail" ? "bg-rose-50 text-rose-700"
            : pill.tone === "form" ? "bg-emerald-50 text-emerald-700"
            : pill.tone === "linkedin" ? "bg-sky-50 text-sky-700"
            : "bg-gray-100 text-gray-600"
        }`}>
          {pill.label}
        </span>
        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          Touch {outboundCount} of {MAX_OUTBOUND_TOUCHES}
        </span>
        {nextChannel !== null && (
          <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            Next:{" "}
            {nextChannel === "linkedin" && dm?.linkedinNotFound
              ? "Email (no LinkedIn profile)"
              : SEQUENCE_STEP_LABELS[outboundCount]}
          </span>
        )}
        <span className="ml-auto truncate text-xs text-gray-500">{dm?.email || lead.orgEmail || "no email on file"}</span>
      </div>
      {expanded && <LeadCard {...props} />}
    </div>
  );
}
```

- [ ] **Step 4: Gates**

Run: `npx tsc --noEmit -p tsconfig.json && npm run test:outreach-guards && npm run build 2>&1 | tail -20`
Expected: `tsc` prints nothing; guards `0 failed`; build clean.

- [ ] **Step 5: Manual check — deploy-time**

> **Deploy-time only.** Today shows one row per due lead, all collapsed, each with a chevron, segment pill, source pill, "Touch N of 4", "Next: …" and the contact address. Clicking the chevron reveals the existing full card beneath it (drafts, tabs, mark-sent all behave as before); clicking again collapses it. Switching tabs and back resets everything to collapsed.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/outreach/TodayTab.tsx
git commit -m "feat(crm): collapse Today leads to one row each

Spec §7: a CollapsibleLead wrapper owns per-card expansion (default closed,
not persisted) and shows chevron / company / segment / source / touch step /
next step / contact; LeadCard itself is untouched.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

---

### Task 8: ImportTab — suppressed total, deleted leads, fix Unknown companies (spec §3, §4)

**Files:**
- Modify: `src/app/admin/outreach/ImportTab.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/outreach/leads/deleted`, `POST /api/admin/outreach/leads/restore`, `POST /api/admin/outreach/maintenance/fix-unknown-companies`, and `IngestPageResult.suppressed` from the Gmail ingest route.
- The tab already has no product select, so there is nothing to remove there.

- [ ] **Step 1: Track `suppressed` in the page tally**

In `src/app/admin/outreach/ImportTab.tsx`:

1. Extend the `PageResult` interface (line 7) with the new counter:

```ts
interface PageResult { nextPageToken?: string; scanned: number; kept: number; created: number; updated: number; suppressed: number; touchesAdded: number; errors: number; skipped: Record<string, number>; samples: { threadId: string; subject: string; participant: string; verdict: string }[] }
```

2. In `run`, change the accumulator initialiser to include it:

```ts
    const acc: PageResult = { scanned: 0, kept: 0, created: 0, updated: 0, suppressed: 0, touchesAdded: 0, errors: 0, skipped: {}, samples: [] };
```

3. In the same function, add it to the accumulation line:

```ts
        acc.scanned += p.scanned; acc.kept += p.kept; acc.created += p.created; acc.updated += p.updated; acc.suppressed += p.suppressed ?? 0; acc.touchesAdded += p.touchesAdded; acc.errors += p.errors ?? 0;
```

4. In the totals block, add `suppressed` to the counts line:

```tsx
            <div>
              scanned {totals.scanned} · kept {totals.kept} · created {totals.created} · updated {totals.updated} · suppressed {totals.suppressed} · touches {totals.touchesAdded}
              {" · "}
              <span className={totals.errors > 0 ? "font-medium text-red-600" : undefined}>errors {totals.errors}</span>
            </div>
```

- [ ] **Step 2: Add the deleted-leads and fix-Unknown state**

Add to the imports at the top of the file:

```ts
import { RotateCcw, Trash2, Wand2 } from "lucide-react";
```

Add these interfaces below `PageResult`:

```ts
interface DeletedLead { _id: string; company: string; deletedAt: string; emails: string[] }
interface FixResult { matched: number; updated: number; dryRun: boolean; samples: { id: string; from: string; to: string }[] }
```

Add this state inside the component, after `previewedFor`:

```ts
  const [deleted, setDeleted] = useState<DeletedLead[] | null>(null);
  const [deletedBusy, setDeletedBusy] = useState(false);
  const [fix, setFix] = useState<FixResult | null>(null);
  const [fixBusy, setFixBusy] = useState(false);
```

Add these handlers after `uploadArchive`:

```ts
  const loadDeleted = async () => {
    setDeletedBusy(true);
    try {
      const res = await fetch("/api/admin/outreach/leads/deleted");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || "Failed to load deleted leads"); return; }
      setDeleted(data.deleted ?? []);
    } finally {
      setDeletedBusy(false);
    }
  };

  const restore = async (suppressionId: string) => {
    setDeletedBusy(true);
    try {
      const res = await fetch("/api/admin/outreach/leads/restore", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suppressionId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || "Failed to restore lead"); return; }
      // The row is gone from the suppression list now — reload it rather than
      // trusting local state, then refresh the console's lead list.
      setDeleted((prev) => (prev ?? []).filter((d) => d._id !== suppressionId));
      await onImported();
    } finally {
      setDeletedBusy(false);
    }
  };

  const fixUnknown = async (dryRun: boolean) => {
    setFixBusy(true);
    try {
      const res = await fetch("/api/admin/outreach/maintenance/fix-unknown-companies", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || "Failed to fix company names"); return; }
      setFix(data as FixResult);
      if (!dryRun) await onImported();
    } finally {
      setFixBusy(false);
    }
  };
```

- [ ] **Step 3: Render the two new sections**

Insert these two `<section>` blocks immediately before the closing `</div>` of the returned root element (after the existing LinkedIn section):

```tsx
      <section className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 flex items-center gap-2 font-semibold"><Trash2 className="h-4 w-4" /> Deleted leads</h3>
        <p className="text-xs text-gray-500">
          Deleted leads are suppressed: an importer reports them under <code>suppressed</code> instead of recreating them.
          Restoring one brings back its touches and makes it importable again.
        </p>
        <button
          type="button"
          onClick={() => void loadDeleted()}
          disabled={deletedBusy}
          className="mt-2 rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium disabled:opacity-50"
        >
          {deletedBusy ? "Working…" : deleted ? "Reload" : "Show deleted leads"}
        </button>
        {deleted && (
          deleted.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">Nothing has been deleted.</p>
          ) : (
            <ul className="mt-2 max-h-64 divide-y overflow-y-auto text-sm">
              {deleted.map((d) => (
                <li key={d._id} className="flex items-center gap-2 py-1.5">
                  <span className="font-medium text-gray-900">{d.company}</span>
                  <span className="truncate text-xs text-gray-500">{d.emails.join(", ")}</span>
                  <span className="ml-auto shrink-0 text-xs text-gray-400">{new Date(d.deletedAt).toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => void restore(d._id)}
                    disabled={deletedBusy}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary-600 px-2 py-1 text-xs font-medium text-white disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )
        )}
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 flex items-center gap-2 font-semibold"><Wand2 className="h-4 w-4" /> Fix &ldquo;Unknown&rdquo; companies</h3>
        <p className="text-xs text-gray-500">
          Applies the current naming rule (organisation domain → person&rsquo;s name → email address) to leads whose company is
          <code>Unknown</code> or empty. Dry run first.
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => void fixUnknown(true)}
            disabled={fixBusy}
            className="rounded-lg bg-gray-100 px-3 py-1 font-medium disabled:opacity-50"
          >
            Dry run
          </button>
          <button
            type="button"
            onClick={() => void fixUnknown(false)}
            disabled={fixBusy || !fix || !fix.dryRun || fix.updated === 0}
            className="rounded-lg bg-primary-600 px-3 py-1 font-medium text-white disabled:opacity-50"
          >
            Apply
          </button>
          {fix && (
            <span className="text-xs text-gray-600">
              matched {fix.matched} · {fix.dryRun ? "would update" : "updated"} {fix.updated}
            </span>
          )}
        </div>
        {fix && fix.samples.length > 0 && (
          <ul className="mt-2 max-h-48 overflow-y-auto text-xs text-gray-600">
            {fix.samples.map((s) => (
              <li key={s.id} className="border-b py-1"><span className="font-mono">{s.from || "(empty)"}</span> → {s.to}</li>
            ))}
          </ul>
        )}
      </section>
```

- [ ] **Step 4: Gates**

Run: `npx tsc --noEmit -p tsconfig.json && npm run test:outreach-guards && npm run build 2>&1 | tail -20`
Expected: `tsc` prints nothing; guards `0 failed`; build clean.

- [ ] **Step 5: Manual check — deploy-time**

> **Deploy-time only.** A Gmail dry run's counts line now includes `suppressed`. "Show deleted leads" lists what was deleted with a Restore button that removes the row and brings the lead back into Pipeline. "Fix Unknown companies → Dry run" reports `matched`/`would update` with before→after samples; Apply enables only after a dry run that found something, and a second dry run afterwards reports `would update 0`.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/outreach/ImportTab.tsx
git commit -m "feat(crm): Import tab gains suppressed totals, deleted-leads restore and Fix Unknown companies

Spec §3/§4: the Gmail tally shows `suppressed`; a Deleted leads section lists
suppressions with Restore; Fix Unknown companies runs the naming rule as a
dry run before applying.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

---

### Task 9: Free-string products end to end + wrap-up (spec §1, §2, §8, §9)

**Files:**
- Modify: `src/lib/crm/classify-contact.ts`, `src/lib/crm/classify-contact.test.ts`, `src/app/api/contact/route.ts`, `src/app/api/admin/outreach/ingest/gmail/route.ts`, `src/app/api/admin/outreach/ingest/linkedin/route.ts`, `src/app/admin/outreach/linkedin-import/LinkedinImport.tsx`, `package.json`, this plan file (tick the boxes)

**Interfaces:**
- Changes: `productFromParam(p: string | null): string | undefined` — a mapped CTA slug, else the raw param if it is already a seed, else the param slugified to `snake_case`; `null`/empty → `undefined`. No longer collapses unknown CTAs to `"other"`.
- Changes: the `product` field of both ingest route bodies becomes `z.string().trim().max(60).optional()` instead of `z.enum(PRODUCTS)`.
- Changes: `LinkedinImport`'s product select is populated from `GET /api/admin/outreach/options`.

- [ ] **Step 1: Update the failing contact test**

In `src/lib/crm/classify-contact.test.ts`, replace the `productFromParam maps CTA slugs` test body with:

```ts
await test("productFromParam maps CTA slugs", () => {
  assert.equal(productFromParam("voice-tutor"), "voice_tutor");
  assert.equal(productFromParam("tutor-copilot"), "voice_tutor");
  assert.equal(productFromParam("academy"), "academy");
  assert.equal(productFromParam("mock-exams"), "mock_exams");
  assert.equal(productFromParam("white-label"), "white_label");
  assert.equal(productFromParam("content"), "content_services");
  assert.equal(productFromParam(null), undefined);
});
await test("productFromParam keeps an unmapped CTA as its own product (round-2 §2)", () => {
  // Was "other" — collapsing every unmapped CTA lost which page the lead
  // came from, and the product list is open now.
  assert.equal(productFromParam("essay-ai"), "essay_ai");
  assert.equal(productFromParam("Virtual Labs"), "virtual_labs");
  assert.equal(productFromParam("proctoring-suite"), "proctoring_suite");
});
await test("productFromParam passes a seed value through unchanged", () => {
  assert.equal(productFromParam("voice_tutor"), "voice_tutor");
  assert.equal(productFromParam("other"), "other");
});
await test("productFromParam returns undefined for empty or punctuation-only params", () => {
  assert.equal(productFromParam(""), undefined);
  assert.equal(productFromParam("   "), undefined);
  assert.equal(productFromParam("---"), undefined);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:crm-contact`
Expected: FAILS the three new cases — `productFromParam("essay-ai")` currently returns `"other"`, and `productFromParam("---")` returns `"other"` rather than `undefined`.

- [ ] **Step 3: Implement**

In `src/lib/crm/classify-contact.ts`, replace `productFromParam` (and drop the now-wrong `Record<string, Product>` annotation's implication) with:

```ts
const PRODUCT_PARAM: Record<string, string> = {
  "voice-tutor": "voice_tutor", "tutor-copilot": "voice_tutor", "homework-bot": "voice_tutor", "math-solver": "voice_tutor",
  academy: "academy", "evelyn-academy": "academy",
  "mock-exams": "mock_exams", "test-generator": "mock_exams",
  "white-label": "white_label", partner: "white_label",
  content: "content_services", "content-authoring": "content_services",
};

/**
 * Round 2 §2: the product list is open, so an unmapped CTA slug becomes its
 * own product rather than collapsing into "other" — a lead from
 * /products/essay-ai is recorded as `essay_ai`, which the Pipeline dropdown
 * then offers to every other lead. The map above still exists for the CTAs
 * whose slug differs from the product we sell.
 */
export function productFromParam(p: string | null): string | undefined {
  if (!p) return undefined;
  const raw = p.trim().toLowerCase();
  if (!raw) return undefined;
  const mapped = PRODUCT_PARAM[raw];
  if (mapped) return mapped;
  if ((PRODUCTS as readonly string[]).includes(raw)) return raw;
  const slug = raw.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return slug || undefined;
}
```

and change the first import line to bring in `PRODUCTS` and drop the unused `Product` type:

```ts
import { CONTACT_REASONS, PRODUCTS, type ContactReason } from "@/lib/outreach/enums";
```

- [ ] **Step 4: Run the test**

Run: `npm run test:crm-contact`
Expected: `0 failed`.

> `src/app/api/contact/route.ts` needs no change: `const product = productFromParam(data.product ?? null);` is already a `string | undefined` passed straight into `upsertLeadWithTouches({ product })`, whose `product?: Product` is now `string`. Confirm by reading the file; do not edit it.

- [ ] **Step 5: Accept free product strings at the ingest boundaries**

In `src/app/api/admin/outreach/ingest/gmail/route.ts`:

1. Drop the enum import — change line 6 to remove it entirely (nothing else in the file uses `PRODUCTS`):

```ts
import { authOptions } from "@/lib/auth";
import { isAllowedAccount } from "@/lib/outreach/gmail";
import { GmailRateLimitError, ingestGmailPage, sentQuery } from "@/lib/crm/gmail-ingest";
```

2. Change the schema field to:

```ts
  // Round 2 §2: open product list — validated for shape, not membership.
  product: z.string().trim().max(60).optional(),
```

In `src/app/api/admin/outreach/ingest/linkedin/route.ts`, make the same two changes: remove `import { PRODUCTS } from "@/lib/outreach/enums";` and change `product: z.enum(PRODUCTS).optional(),` to:

```ts
  product: z.string().trim().max(60).optional(),
```

- [ ] **Step 6: Load product options in the LinkedIn import page**

In `src/app/admin/outreach/linkedin-import/LinkedinImport.tsx`:

1. Replace the enums import (line 5) with nothing — the options come from the API now. Delete that line.
2. Add state beside the others:

```ts
  const [productOptions, setProductOptions] = useState<string[]>([]);
```

3. Extend the mount `useEffect` body, after the existing `decodeHash` handling:

```ts
    fetch("/api/admin/outreach/options")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setProductOptions(data.products ?? []); })
      .catch(() => {});
```

4. Replace the product `<select>` options with the fetched list:

```tsx
        <select className="rounded-lg border px-3 py-2 text-sm" value={product} onChange={(e) => setProduct(e.target.value)}>
          <option value="">Product (optional)</option>
          {productOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
```

- [ ] **Step 7: Finalise the test scripts**

Confirm `package.json` matches exactly (the chain now includes `test:crm-suppression` and `test:crm-console`, and `test:crm-opportunity` is gone):

```json
    "test:crm-models": "npx tsx src/models/Lead.test.ts && npx tsx src/models/LeadSuppression.test.ts",
    "test:crm-core": "npx tsx src/lib/crm/identity.test.ts && npx tsx src/lib/crm/match-lead.test.ts && npx tsx src/lib/crm/touches.test.ts",
    "test:crm-suppression": "npx tsx src/lib/crm/suppression.test.ts",
    "test:crm-console": "npx tsx src/lib/crm/console-helpers.test.ts",
    "test:crm": "npm run test:crm-models && npm run test:crm-core && npm run test:crm-suppression && npm run test:crm-console && npm run test:crm-upsert-smoke && npm run test:crm-contact && npm run test:crm-gmail && npm run test:crm-gmail-classify && npm run test:crm-gmail-ingest && npm run test:crm-linkedin && npm run test:crm-archive",
    "crm:migrate-round2": "npx tsx scripts/crm-migrate-round2.ts",
```

- [ ] **Step 8: Full gates**

Run: `npm run test:crm && npm run test:outreach && npx tsc --noEmit -p tsconfig.json && npm run build 2>&1 | tail -20`
Expected: every `test:crm-*` file prints `0 failed`; `test:outreach` finishes green including `test:outreach-guards` and `test:outreach-job` (whose segment case was rewritten in Task 1); `tsc` prints nothing; the build completes with no type errors.

- [ ] **Step 9: Tick this plan's boxes**

Mark every completed step above `- [x]` and commit the plan alongside the final code change.

- [ ] **Step 10: Commit**

```bash
git add src/lib/crm/classify-contact.ts src/lib/crm/classify-contact.test.ts src/app/api/admin/outreach/ingest/gmail/route.ts src/app/api/admin/outreach/ingest/linkedin/route.ts src/app/admin/outreach/linkedin-import/LinkedinImport.tsx package.json docs/superpowers/plans/2026-09-23-crm-pipeline-round2.md
git commit -m "feat(crm): free-string products end to end + round-2 test chain

Spec §2: productFromParam keeps an unmapped CTA slug as its own product, both
ingest routes accept a free product string, and the LinkedIn import page
loads its product options from /api/admin/outreach/options. Finalises the
test:crm chain and the crm:migrate-round2 script.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019ih8H7uTiiV2DFxMmBA42d"
```

- [ ] **Step 11: Deploy-time checklist (separate approval — do NOT run in this session)**

1. Merge the branch to `main` per the four-session protocol, then GATE, then deploy marketing with `./deploy-marketing.sh` (never `deploy-update.sh`).
2. On the host, run the migration DRY RUN first and read the counts:
   `MONGODB_URI=<prod> npx tsx scripts/crm-migrate-round2.ts`
   then apply:
   `MONGODB_URI=<prod> npx tsx scripts/crm-migrate-round2.ts --apply`
   Expect `leads still carrying opportunities 0`. Re-running `--apply` must report `products carried 0, opportunities unset on 0` (idempotent).
3. Set `LINKEDIN_OWNER_PROFILE_URL` in the production env (spec §8) once Praveen supplies it, then restart the app — the archive upload 500s with `LINKEDIN_OWNER_PROFILE_URL not set` until it is present. There is no `.env.local.example` in `apps/marketing`; this checklist is the record.
4. Walk the acceptance list in the spec: delete three Pagevault leads → Gmail dry run reports them under `suppressed` → restore one; "Other… → Homework Bot" appears in every row's dropdown; Segment/Status/Decision maker survive a reload; Pipeline fits 1280px and sorts/searches; no "Unknown" companies remain after Fix Unknown; Today rows collapsed with source pills; archive upload succeeds.

---

## Self-review

**Spec coverage, decision by decision:**

- **§1 One product per lead** → T1 (schema: `product?: string`, `opportunities`/`OpportunitySchema`/index removed; `PipelineConfig`, `pipelines/route.ts`, `setOpportunity`, `lib/crm/opportunity.ts` and both their tests and package scripts deleted; `upsert-lead` writes one product), T6 (`LeadJSON.product`, Product column, drawer line), T9 (`productFromParam`). Remarks stay in `Lead.notes`, made editable in the T6 drawer.
- **§2 Open product/segment lists, no options manager** → T1 (`Product`/`LeadSegment` → `string`; `Lead.segment` and `ResearchJob.segment` drop their enums; `PRODUCTS`/`LEAD_SEGMENTS` stay as seeds), T4 (`mergeOptionValues`, `/options`, research-route gate, `segment-landing` → `Record<string, string>` with the existing fallback), T6 ("Other…" → text box → save → re-fetch options), T9 (free product at both ingest boundaries + LinkedIn page). Labels come from `SEGMENT_LABELS` with the raw value as fallback — unchanged, already `Record<string, string>`.
- **§3 Delete with suppression** → T1 (`LeadSuppression` model + indexes + test), T3 (`suppression.ts` pure + tests; `upsertLeadWithTouches` blocks CREATION only and returns `matchedBy: "suppressed"`; `IngestPageResult.suppressed`; `bulk` `action: "delete"` writes the tombstone then deletes; `/leads/deleted`; `/leads/restore` recreating from the snapshot minus `_id/__v/createdAt/updatedAt`), T6 (select column, `confirm()`, "Delete selected (N)"), T8 (Deleted-leads list + Restore, `suppressed` in the totals line). The existing staged-only `DELETE /leads/[id]` is left untouched, as the spec requires. Single delete = the same bulk route with one id.
- **§4 Company naming rule** → T2 (`companyNameFor` pure + five tests incl. gmail.com-with-name, gmail.com-without-name and an org domain; `newLeadFields` uses it, so every ingest path inherits it) and the `fix-unknown-companies` route (dryRun default true, `{ matched, updated, samples }`), surfaced in T8.
- **§5 Source pill** → T5 (`sourcePill`, tested against all six real `Lead.source` forms plus empty and legacy), rendered in T6 (Last touch cell) and T7 (Today row).
- **§6 Pipeline table** → T6: fixed-height (`calc(100vh - 260px)`) scroll container with a sticky header; the nine specified columns in order with `table-fixed` widths totalling 1216px; inline Segment/Status/Product dropdowns (Status via `setStatus`, the other two via `edit`); the old trailing action column removed and Work-today reduced to an icon beside Status for `approved`/`contacted`; decision-maker three-input in-place editor via the merging `edit` action; every header toggles asc/desc; a 150ms-debounced search combined with the filters, all client-side.
- **§7 Today tab** → T7: `CollapsibleLead` owns per-card `expanded` (default false, not persisted); the collapsed row carries chevron · company · segment pill · source pill · "Touch N of MAX" · "Next: …" · contact address, and expands into the untouched `LeadCard`.
- **§8 Env** → the deploy-time checklist (T9 step 11) records `LINKEDIN_OWNER_PROFILE_URL`; there is no `.env.local.example` file to edit in this app.
- **§9 Migration** → T1 `scripts/crm-migrate-round2.ts`: dry run by default, `--apply` to write, idempotent, carries `opportunities[0].product` → `product` only when `product` is empty, `$unset opportunities` on every lead, drops `opportunities.product_1_opportunities.stage_1` if present, drops `pipelineconfigs` if present, prints counts and asserts the end state.
- **Non-goals respected:** no per-product stages, no options-management screen, no global rename/delete of a value, no server-side pagination or search, Today expansion not persisted, `setStatus` still a raw assignment.

**Placeholder scan:** every code step contains the literal code to write. No "similar to", "as above", "etc.", "TODO", or elided bodies. The only prose-only steps are `git rm` (Task 1 step 7), the box-ticking step, the deploy-time checklist, and the two "no change needed — confirm by reading" notes (contact route in T9, LinkedIn routes in T3), which are deliberate: they exist so the implementer does not invent a phantom edit.

**Type consistency:** `Product` and `LeadSegment` are `string` aliases everywhere (chosen once, in T1, and never removed), so `z.string()` bodies, `Record<string, string>` maps and `Lead.distinct` results all line up. `UpsertResult.suppressed` is **optional**, which is why the pre-existing fake `upsert` deps in `gmail-ingest.test.ts` still type-check while the two new cases exercise the suppressed branch. `IngestPageResult.suppressed` (T3) is mirrored by `PageResult.suppressed` in `ImportTab` (T8), read defensively as `p.suppressed ?? 0` so a stale server never NaNs the tally. `SuppressionKeys` (T3) is spread directly into the `LeadSuppression` schema fields, whose names match one-for-one. `SortKey`/`SortDir`/`SortableLead` (T5) are the exact types `PipelineTab` (T6) imports; `LeadJSON` satisfies `SortableLead` structurally because `status`, `nextActionAt`, `product`, `segment`, `notes`, `source`, `emails`, `decisionMaker` and `touches[].at/subject/body/summary/from/to` are all present with compatible types. `TimelineDrawer`'s new required `refresh` prop has exactly one caller (`PipelineTab`), verified by grep.

**Known cross-task ordering hazards, stated deliberately:** (a) after T1, `PipelineTab`/`TimelineDrawer` still reference `lead.opportunities` — that compiles (the client interface still declares it until T6) and cannot throw at runtime because both reads are guarded; do not fix it early. (b) `ResearchJob.test.ts` asserts that a bad segment is rejected and is part of `test:outreach`, so T1 must rewrite it or the final `npm run test:outreach` gate fails. (c) `scripts/` is excluded from `tsconfig.json`, so the migration script is never type-checked here — its only gate is the deploy-time dry run.
