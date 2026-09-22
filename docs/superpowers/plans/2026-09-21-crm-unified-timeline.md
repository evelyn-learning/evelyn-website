# CRM Unified Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin outreach console the CRM by growing each lead's timeline automatically from the contact form, two Gmail mailboxes, and LinkedIn, with per-product stages.

**Architecture:** Everything hangs off the existing `Lead` document in `apps/marketing`. Pure, DB-free modules under `src/lib/crm/` do classification, matching, parsing and touch-merging (all unit-tested with the repo's `npx tsx *.test.ts` harness); thin API routes under `src/app/api/admin/outreach/ingest/` call them; the Gmail client gains a second account; the reply-watcher cron also ingests `CRM`-labelled threads; the console gains an Import tab and a timeline drawer.

**Tech Stack:** Next.js App Router, Mongoose, `googleapis` (already a dependency), `node-cron`, `zod`, `react-hook-form`, TypeScript, `tsx` test scripts.

**Spec:** `docs/superpowers/specs/2026-09-21-crm-unified-timeline.md` — read it first; every task below cites its numbered decisions.

## Global Constraints

- Work in a git worktree off `origin/main` (four-session protocol, worktree-only). App root for all paths below: `apps/marketing/`. Run tests from that directory.
- Test harness = the repo pattern: `import { strict as assert } from "node:assert"` + a local `test(name, fn)` counter; run with `npx tsx <file>.test.ts`; add an `npm run test:crm-*` script per new test file.
- `src/lib/outreach/enums.ts` and everything in `src/lib/crm/` must stay **mongoose-free** (client components import enums; see the header comment in `enums.ts`).
- Products: `voice_tutor | academy | mock_exams | white_label | content_services | other`. Contact reasons: `product_inquiry | demo_request | demo | partnership | careers | support | other` (`demo` is an alias accepted from old links; normalise to `demo_request`).
- Self domains: `evelynlearning.com`, `evelyntutor.com`, `crimsora.com`. `info@` aliases: `contact, hello, legal, support, admin, training, security`.
- Auto-reply subject (exact): `Thank you for contacting Evelyn Learning`. Self-notification subject prefix: `New Contact Form Submission:`.
- New env: `GMAIL_OUTREACH_ACCOUNTS`, `LINKEDIN_OWNER_NAME`, `LINKEDIN_OWNER_PROFILE_URL`. Never commit values.
- Every ingest path is idempotent: dedupe on `touches[].externalId`.
- Commit after every task with a `feat(crm): …` / `test(crm): …` message ending in `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## File map

| Path | Responsibility |
|---|---|
| `src/lib/outreach/enums.ts` | + `PRODUCTS`, `CONTACT_REASONS`, `TOUCH_ORIGINS` |
| `src/models/Lead.ts` | + touch fields, `emails[]`, `opportunities[]`, `needsReview`, `linkedinConversationIds[]` |
| `src/models/PipelineConfig.ts` | per-product stage lists |
| `src/models/ContactSubmission.ts` | + `reason`, `product` |
| `src/lib/crm/identity.ts` | normalise email / LinkedIn URL / domain; free-mail list |
| `src/lib/crm/match-lead.ts` | pick the lead a contact belongs to (pure) + `findOrCreateLead` (DB) |
| `src/lib/crm/touches.ts` | `mergeTouches` (dedupe) + `applyIngestStatus` |
| `src/lib/crm/classify-contact.ts` | careers screen for the contact form |
| `src/lib/crm/gmail-classify.ts` | per-thread keep/skip rules (pure) |
| `src/lib/crm/gmail-ingest.ts` | list sent/labelled threads, fetch bodies, build touches, upsert leads |
| `src/lib/crm/linkedin-paste.ts` | parse a pasted/bookmarklet LinkedIn conversation |
| `src/lib/crm/linkedin-archive.ts` | CSV parser + archive → conversations |
| `src/lib/outreach/gmail.ts` | multi-account client |
| `src/lib/outreach/reply-watcher.ts` | + CRM-label ingest on the same cron |
| `src/app/api/contact/route.ts` | reason/product + lead upsert |
| `src/components/ContactForm.tsx` | reason select, hidden product, careers redirect |
| `src/app/api/admin/outreach/gmail/{auth,callback,status}/route.ts` | account param + allowed list |
| `src/app/api/admin/outreach/ingest/gmail/route.ts` | paged import, dry-run |
| `src/app/api/admin/outreach/ingest/linkedin/route.ts` | paste import |
| `src/app/api/admin/outreach/ingest/linkedin-archive/route.ts` | archive upload |
| `src/app/api/admin/outreach/pipelines/route.ts` | GET/PUT stage config |
| `src/app/api/admin/outreach/leads/[id]/route.ts` | + `setOpportunity` action |
| `src/app/admin/outreach/ImportTab.tsx`, `TimelineDrawer.tsx`, `linkedin-import/page.tsx` | UI |
| `src/app/admin/outreach/PipelineTab.tsx`, `OutreachConsole.tsx` | product filter, drawer, Import tab |
| `scripts/crm-backfill-contact-submissions.ts` | one-off backfill |

---

### Task 1: Enums, Lead schema, PipelineConfig, ContactSubmission fields

**Files:**
- Modify: `src/lib/outreach/enums.ts`
- Modify: `src/models/Lead.ts`
- Create: `src/models/PipelineConfig.ts`
- Modify: `src/models/ContactSubmission.ts`
- Modify: `src/models/index.ts`
- Test: `src/models/Lead.test.ts` (append), `src/models/PipelineConfig.test.ts`
- Modify: `package.json` scripts

**Interfaces:**
- Produces: `PRODUCTS`, `Product`, `CONTACT_REASONS`, `ContactReason`, `TOUCH_ORIGINS`, `TouchOrigin` (enums); `ITouch` gains `subject?, body?, from?, to?, externalId?, account?, origin?`; `ILead` gains `emails: string[]`, `opportunities: IOpportunity[]`, `needsReview: boolean`, `linkedinConversationIds: string[]`; `IOpportunity = { product: Product; stage: string; nextActionAt?: Date|null; notes?: string; updatedAt: Date }`; `PipelineConfig` model `{ product: Product; stages: string[] }` with `DEFAULT_STAGES = [...LEAD_STATUSES]`.

- [ ] **Step 1: Write the failing model tests**

Append to `src/models/Lead.test.ts` before the final summary/exit lines (keep the existing `base` object):

```ts
await test("touch accepts body/externalId/account/origin", () => {
  const doc = new Lead({ ...base, touches: [{
    at: new Date(), channel: "email", direction: "inbound", summary: "Reply",
    subject: "Re: hi", body: "full text", from: "a@b.edu", to: "praveen@evelynlearning.com",
    externalId: "gmail:18f", account: "praveen@evelynlearning.com", origin: "gmail_import",
  }] });
  assert.equal(doc.validateSync(), undefined);
  assert.equal(doc.touches[0].externalId, "gmail:18f");
});
await test("bad touch origin rejected", () => {
  const err = new Lead({ ...base, touches: [{ at: new Date(), channel: "email", direction: "inbound", summary: "x", origin: "carrier_pigeon" }] }).validateSync();
  assert.ok(err?.errors["touches.0.origin"]);
});
await test("opportunity requires a known product", () => {
  const ok = new Lead({ ...base, opportunities: [{ product: "voice_tutor", stage: "replied", updatedAt: new Date() }] }).validateSync();
  assert.equal(ok, undefined);
  const err = new Lead({ ...base, opportunities: [{ product: "jetpack", stage: "replied", updatedAt: new Date() }] }).validateSync();
  assert.ok(err?.errors["opportunities.0.product"]);
});
await test("emails default to [] and needsReview to false", () => {
  const doc = new Lead(base);
  assert.deepEqual(doc.emails, []);
  assert.equal(doc.needsReview, false);
  assert.deepEqual(doc.linkedinConversationIds, []);
});
```

Create `src/models/PipelineConfig.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { PipelineConfig, DEFAULT_STAGES } from "./PipelineConfig";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
await test("default stages equal the seven lead statuses", () => {
  assert.deepEqual(DEFAULT_STAGES, ["staged", "approved", "contacted", "replied", "call_booked", "parked", "dead"]);
});
await test("stages default when omitted", () => {
  const doc = new PipelineConfig({ product: "academy" });
  assert.equal(doc.validateSync(), undefined);
  assert.deepEqual([...doc.stages], DEFAULT_STAGES);
});
await test("unknown product rejected", () => {
  assert.ok(new PipelineConfig({ product: "jetpack" }).validateSync()?.errors["product"]);
});
await test("empty stages rejected", () => {
  assert.ok(new PipelineConfig({ product: "academy", stages: [] }).validateSync());
});
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx tsx src/models/Lead.test.ts && npx tsx src/models/PipelineConfig.test.ts`
Expected: Lead tests FAIL on the new cases (unknown paths are silently dropped, so `externalId` is `undefined`; `origin` is not validated); PipelineConfig FAILS with "Cannot find module './PipelineConfig'".

- [ ] **Step 3: Extend enums**

Append to `src/lib/outreach/enums.ts`:

```ts
export const PRODUCTS = [
  "voice_tutor", "academy", "mock_exams", "white_label", "content_services", "other",
] as const;
export type Product = (typeof PRODUCTS)[number];

// Public contact-form reasons. `demo` is accepted from pre-existing links
// (`/contact?demo=true`) and normalised to `demo_request` by the API.
export const CONTACT_REASONS = [
  "product_inquiry", "demo_request", "partnership", "careers", "support", "other",
] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

// Where a touch came from — distinct from `channel` (the medium). Lets the
// timeline show "imported from info@ sent folder" vs "console mark-sent".
export const TOUCH_ORIGINS = [
  "console", "contact_form", "gmail_import", "gmail_label", "gmail_watcher",
  "linkedin_paste", "linkedin_archive", "backfill",
] as const;
export type TouchOrigin = (typeof TOUCH_ORIGINS)[number];
```

- [ ] **Step 4: Extend the Lead schema**

In `src/models/Lead.ts`:

1. Extend the imports from enums to also pull `PRODUCTS, TOUCH_ORIGINS` and types `Product, TouchOrigin`, and add them to the re-export lines.
2. Replace `ITouch` with:

```ts
export interface ITouch {
  at: Date;
  channel: TouchChannel;
  direction: "outbound" | "inbound";
  summary: string;
  gmailMessageId?: string;
  // Full-message fields (spec §1). Absent on touches written before the CRM
  // round, which is why `summary` stays required and the UI falls back to it.
  subject?: string;
  body?: string;
  from?: string;
  to?: string;
  // Stable per-message id used for idempotent ingest: `gmail:<messageId>`,
  // `li:<sha1 of conversation+date+body>`, `form:<submissionId>`.
  externalId?: string;
  // Mailbox the message lives in (praveen@ / info@). Email only.
  account?: string;
  origin?: TouchOrigin;
}

export interface IOpportunity {
  product: Product;
  stage: string;
  nextActionAt?: Date | null;
  notes?: string;
  updatedAt: Date;
}
```

3. Add to `ILead` (after `notes?: string;`):

```ts
  // Every address ever seen for this organisation's people, lowercased.
  // Matching input for ingest (lib/crm/match-lead.ts); decisionMaker.email
  // is always included here as well.
  emails: string[];
  opportunities: IOpportunity[];
  // Set by ingest when a thread is one outbound message with no reply — the
  // lead is created `staged` so it shows in Review rather than Pipeline.
  needsReview: boolean;
  linkedinConversationIds: string[];
```

4. Replace `TouchSchema` with:

```ts
const TouchSchema = new Schema<ITouch>(
  {
    at: { type: Date, required: true },
    channel: { type: String, enum: TOUCH_CHANNELS, required: true },
    direction: { type: String, enum: ["outbound", "inbound"], required: true },
    summary: { type: String, required: true },
    gmailMessageId: String,
    subject: String,
    body: String,
    from: String,
    to: String,
    externalId: String,
    account: String,
    origin: { type: String, enum: TOUCH_ORIGINS },
  },
  { _id: false }
);

const OpportunitySchema = new Schema<IOpportunity>(
  {
    product: { type: String, enum: PRODUCTS, required: true },
    stage: { type: String, required: true },
    nextActionAt: { type: Date, default: null },
    notes: String,
    updatedAt: { type: Date, required: true },
  },
  { _id: false }
);
```

5. Add to `LeadSchema` fields (after `notes: String,`):

```ts
    emails: { type: [String], default: [] },
    opportunities: { type: [OpportunitySchema], default: [] },
    needsReview: { type: Boolean, default: false },
    linkedinConversationIds: { type: [String], default: [] },
```

6. Add indexes after the existing ones:

```ts
LeadSchema.index({ emails: 1 });
LeadSchema.index({ "touches.externalId": 1 });
LeadSchema.index({ "decisionMaker.linkedinUrl": 1 });
LeadSchema.index({ "opportunities.product": 1, "opportunities.stage": 1 });
```

- [ ] **Step 5: Create PipelineConfig**

Create `src/models/PipelineConfig.ts`:

```ts
import mongoose, { Schema, Document } from "mongoose";
import { PRODUCTS, LEAD_STATUSES } from "@/lib/outreach/enums";
import type { Product } from "@/lib/outreach/enums";

// Per-product stage list (spec §2). Every product starts with the seven
// global lead statuses; a product diverges by editing its row via
// PUT /api/admin/outreach/pipelines. `Lead.opportunities[].stage` is a free
// string validated against this list at the API boundary, not in the schema,
// so renaming a stage never invalidates historical leads.
export const DEFAULT_STAGES: string[] = [...LEAD_STATUSES];

export interface IPipelineConfig extends Document {
  product: Product;
  stages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PipelineConfigSchema = new Schema<IPipelineConfig>(
  {
    product: { type: String, enum: PRODUCTS, required: true, unique: true },
    stages: {
      type: [String],
      default: () => [...DEFAULT_STAGES],
      validate: { validator: (v: string[]) => v.length > 0, message: "stages must not be empty" },
    },
  },
  { timestamps: true }
);

export const PipelineConfig =
  mongoose.models.PipelineConfig ||
  mongoose.model<IPipelineConfig>("PipelineConfig", PipelineConfigSchema);
```

- [ ] **Step 6: ContactSubmission fields + index exports**

In `src/models/ContactSubmission.ts` add to the interface `reason?: string; product?: string;` and to the schema `reason: { type: String }, product: { type: String },`.

In `src/models/index.ts` change the Lead export lines to:

```ts
export { Lead, LEAD_SEGMENTS, LEAD_STATUSES, TOUCH_CHANNELS, PRODUCTS, TOUCH_ORIGINS } from "./Lead";
export type { ILead, ITouch, IOpportunity, IDemoVisit, ICurrentDraft, LeadSegment, LeadStatus, TouchChannel, Product, TouchOrigin } from "./Lead";
export { PipelineConfig, DEFAULT_STAGES, type IPipelineConfig } from "./PipelineConfig";
```

Add to `package.json` scripts: `"test:crm-models": "npx tsx src/models/Lead.test.ts && npx tsx src/models/PipelineConfig.test.ts"`.

- [ ] **Step 7: Run tests**

Run: `npm run test:crm-models`
Expected: all PASS, `0 failed` in both files.

- [ ] **Step 8: Commit**

```bash
git add src/lib/outreach/enums.ts src/models/Lead.ts src/models/Lead.test.ts src/models/PipelineConfig.ts src/models/PipelineConfig.test.ts src/models/ContactSubmission.ts src/models/index.ts package.json
git commit -m "feat(crm): full-message touches, per-product opportunities, PipelineConfig

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Identity normalisation + lead matching + touch merge (pure modules)

**Files:**
- Create: `src/lib/crm/identity.ts`, `src/lib/crm/match-lead.ts`, `src/lib/crm/touches.ts`
- Test: `src/lib/crm/identity.test.ts`, `src/lib/crm/match-lead.test.ts`, `src/lib/crm/touches.test.ts`

**Interfaces:**
- Produces:
  - `normalizeEmail(s: string): string` (lowercase, trimmed, angle-brackets stripped) and `emailDomain(email: string): string`, `isFreeMailDomain(d: string): boolean`, `isSelfAddress(email: string): boolean`, `normalizeLinkedinUrl(u: string): string` (`https://www.linkedin.com/in/<slug>` lowercase, no query/trailing slash), `websiteDomain(url: string): string`, `SELF_DOMAINS`, `INFO_ALIASES`.
  - `type ContactIdentity = { email?: string; linkedinUrl?: string; name?: string; company?: string; website?: string }`
  - `type MatchableLead = { _id: string; emails: string[]; decisionMaker: { email?: string; linkedinUrl?: string }; website: string }`
  - `pickLead(identity: ContactIdentity, candidates: MatchableLead[]): { lead: MatchableLead; by: "email"|"linkedin"|"domain" } | null`
  - `matchQuery(identity: ContactIdentity): Record<string, unknown> | null` — the Mongo `$or` filter to load candidates.
  - `newLeadFields(identity: ContactIdentity, source: string): object` — fields for `Lead.create`.
  - `type IncomingTouch = ITouch-shaped plain object with required externalId`
  - `mergeTouches(existing: ITouch[], incoming: IncomingTouch[]): { touches: ITouch[]; added: number }` — sorted by `at`, deduped on `externalId`.
  - `applyIngestStatus(lead: { status: LeadStatus; nextActionAt?: Date|null; needsReview: boolean }, touches: ITouch[], opts: { created: boolean; flagReview: boolean }): void` (spec §5, §8e).

- [ ] **Step 1: Write failing tests**

`src/lib/crm/identity.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { normalizeEmail, emailDomain, isFreeMailDomain, isSelfAddress, normalizeLinkedinUrl, websiteDomain } from "./identity";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
await test("normalizeEmail strips display name and case", () => {
  assert.equal(normalizeEmail("Dana Smith <Dana@Acme.EDU>"), "dana@acme.edu");
  assert.equal(normalizeEmail("  x@y.com "), "x@y.com");
});
await test("emailDomain", () => assert.equal(emailDomain("dana@acme.edu"), "acme.edu"));
await test("free mail domains are not org identities", () => {
  assert.equal(isFreeMailDomain("gmail.com"), true);
  assert.equal(isFreeMailDomain("acme.edu"), false);
});
await test("self addresses include info@ aliases and all self domains", () => {
  assert.equal(isSelfAddress("Praveen <praveen@evelynlearning.com>"), true);
  assert.equal(isSelfAddress("hello@evelynlearning.com"), true);
  assert.equal(isSelfAddress("support@evelyntutor.com"), true);
  assert.equal(isSelfAddress("dana@acme.edu"), false);
});
await test("normalizeLinkedinUrl canonicalises", () => {
  assert.equal(normalizeLinkedinUrl("https://linkedin.com/in/Skyler-Scarlett/?trk=x"), "https://www.linkedin.com/in/skyler-scarlett");
  assert.equal(normalizeLinkedinUrl("www.linkedin.com/in/jane/"), "https://www.linkedin.com/in/jane");
  assert.equal(normalizeLinkedinUrl("not a url"), "");
});
await test("websiteDomain drops scheme and www", () => {
  assert.equal(websiteDomain("https://www.tvs.org/about"), "tvs.org");
  assert.equal(websiteDomain(""), "");
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

`src/lib/crm/match-lead.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { pickLead, matchQuery, newLeadFields, type MatchableLead } from "./match-lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
const acme: MatchableLead = { _id: "1", emails: ["dana@acme.edu"], decisionMaker: { email: "dana@acme.edu", linkedinUrl: "https://www.linkedin.com/in/dana" }, website: "https://acme.edu" };
const zed: MatchableLead = { _id: "2", emails: [], decisionMaker: { email: "z@zed.org" }, website: "https://zed.org" };

await test("email wins over everything", () => {
  const r = pickLead({ email: "DANA@acme.edu", linkedinUrl: "https://www.linkedin.com/in/someone-else" }, [zed, acme]);
  assert.equal(r?.lead._id, "1"); assert.equal(r?.by, "email");
});
await test("linkedin url matches when email unknown", () => {
  const r = pickLead({ linkedinUrl: "linkedin.com/in/Dana/" }, [zed, acme]);
  assert.equal(r?.lead._id, "1"); assert.equal(r?.by, "linkedin");
});
await test("domain matches org, but never a free-mail domain", () => {
  assert.equal(pickLead({ email: "bob@acme.edu" }, [zed, acme])?.by, "domain");
  assert.equal(pickLead({ email: "bob@gmail.com" }, [zed, acme]), null);
});
await test("no identity -> null", () => assert.equal(pickLead({ name: "X" }, [acme]), null));
await test("matchQuery builds an $or of the available keys", () => {
  const q = matchQuery({ email: "Bob@Acme.edu", linkedinUrl: "https://linkedin.com/in/bob" }) as { $or: unknown[] };
  assert.ok(Array.isArray(q.$or));
  assert.ok(JSON.stringify(q).includes("bob@acme.edu"));
  assert.ok(JSON.stringify(q).includes("acme.edu"));
  assert.equal(matchQuery({ name: "only" }), null);
});
await test("newLeadFields derives company from domain when absent", () => {
  const f = newLeadFields({ email: "bob@acme.edu", name: "Bob Ray" }, "gmail:info@evelynlearning.com") as Record<string, unknown>;
  assert.equal(f.company, "acme.edu");
  assert.equal(f.segment, "other");
  assert.deepEqual(f.emails, ["bob@acme.edu"]);
  assert.equal((f.decisionMaker as { name: string }).name, "Bob Ray");
  assert.equal(f.source, "gmail:info@evelynlearning.com");
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

`src/lib/crm/touches.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { mergeTouches, applyIngestStatus, type IncomingTouch } from "./touches";
import type { ITouch } from "@/models/Lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
const t = (id: string, dir: "inbound" | "outbound", at: number): IncomingTouch =>
  ({ at: new Date(at), channel: "email", direction: dir, summary: id, externalId: id, origin: "gmail_import" });

(async () => {
await test("merge dedupes on externalId and sorts by at", () => {
  const existing: ITouch[] = [{ at: new Date(20), channel: "email", direction: "outbound", summary: "b", externalId: "b" }];
  const r = mergeTouches(existing, [t("a", "outbound", 10), t("b", "inbound", 20), t("c", "inbound", 30)]);
  assert.equal(r.added, 2);
  assert.deepEqual(r.touches.map((x) => x.externalId), ["a", "b", "c"]);
});
await test("legacy touches without externalId are kept untouched", () => {
  const existing: ITouch[] = [{ at: new Date(5), channel: "linkedin", direction: "outbound", summary: "old" }];
  const r = mergeTouches(existing, [t("a", "inbound", 10)]);
  assert.equal(r.touches.length, 2); assert.equal(r.touches[0].summary, "old");
});
await test("inbound flips staged/approved/contacted/parked to replied", () => {
  for (const s of ["staged", "approved", "contacted", "parked"] as const) {
    const lead = { status: s, nextActionAt: new Date(), needsReview: false };
    applyIngestStatus(lead, [t("a", "inbound", 1) as ITouch], { created: false, flagReview: false });
    assert.equal(lead.status, "replied"); assert.equal(lead.nextActionAt, null);
  }
});
await test("dead / replied / call_booked are never changed", () => {
  for (const s of ["dead", "replied", "call_booked"] as const) {
    const lead = { status: s, nextActionAt: null, needsReview: false };
    applyIngestStatus(lead, [t("a", "inbound", 1) as ITouch], { created: false, flagReview: false });
    assert.equal(lead.status, s);
  }
});
await test("new lead with only outbound -> contacted, no cadence", () => {
  const lead = { status: "staged" as const, nextActionAt: null, needsReview: false };
  applyIngestStatus(lead, [t("a", "outbound", 1) as ITouch], { created: true, flagReview: false });
  assert.equal(lead.status, "contacted"); assert.equal(lead.nextActionAt, null);
});
await test("flagReview keeps a new lead staged and sets needsReview", () => {
  const lead = { status: "staged" as const, nextActionAt: null, needsReview: false };
  applyIngestStatus(lead, [t("a", "outbound", 1) as ITouch], { created: true, flagReview: true });
  assert.equal(lead.status, "staged"); assert.equal(lead.needsReview, true);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx tsx src/lib/crm/identity.test.ts; npx tsx src/lib/crm/match-lead.test.ts; npx tsx src/lib/crm/touches.test.ts`
Expected: each FAILS with "Cannot find module".

- [ ] **Step 3: Implement identity.ts**

```ts
// Mongoose-free identity helpers shared by every ingest path.
export const SELF_DOMAINS = ["evelynlearning.com", "evelyntutor.com", "crimsora.com"] as const;
export const INFO_ALIASES = ["info", "contact", "hello", "legal", "support", "admin", "training", "security"] as const;

const FREE_MAIL = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "hotmail.com", "outlook.com", "live.com",
  "icloud.com", "me.com", "aol.com", "protonmail.com", "proton.me", "mail.com", "msn.com", "ymail.com",
]);

export function normalizeEmail(s: string): string {
  const m = s.match(/<([^>]+)>/);
  return (m ? m[1] : s).trim().toLowerCase();
}

export function emailDomain(email: string): string {
  const e = normalizeEmail(email);
  const i = e.lastIndexOf("@");
  return i === -1 ? "" : e.slice(i + 1);
}

export function isFreeMailDomain(domain: string): boolean {
  return FREE_MAIL.has(domain.toLowerCase());
}

export function isSelfAddress(email: string): boolean {
  const d = emailDomain(email);
  return (SELF_DOMAINS as readonly string[]).includes(d);
}

export function normalizeLinkedinUrl(u: string): string {
  const m = u.trim().match(/linkedin\.com\/in\/([^/?#\s]+)/i);
  return m ? `https://www.linkedin.com/in/${decodeURIComponent(m[1]).toLowerCase()}` : "";
}

export function websiteDomain(url: string): string {
  if (!url) return "";
  try {
    const host = new URL(url.includes("://") ? url : `https://${url}`).hostname.toLowerCase();
    return host.replace(/^www\./, "");
  } catch {
    return "";
  }
}
```

- [ ] **Step 4: Implement match-lead.ts**

```ts
import { emailDomain, isFreeMailDomain, normalizeEmail, normalizeLinkedinUrl, websiteDomain } from "./identity";

export interface ContactIdentity {
  email?: string;
  linkedinUrl?: string;
  name?: string;
  company?: string;
  website?: string;
  title?: string;
}

export interface MatchableLead {
  _id: string;
  emails: string[];
  decisionMaker: { email?: string; linkedinUrl?: string };
  website: string;
}

export type MatchBy = "email" | "linkedin" | "domain";

/** Spec §4: email → linkedin → org domain. Pure; caller loads candidates. */
export function pickLead(
  identity: ContactIdentity,
  candidates: MatchableLead[]
): { lead: MatchableLead; by: MatchBy } | null {
  const email = identity.email ? normalizeEmail(identity.email) : "";
  const li = identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) : "";
  const domain = email ? emailDomain(email) : websiteDomain(identity.website ?? "");

  if (email) {
    const hit = candidates.find(
      (c) => c.emails.map(normalizeEmail).includes(email) || (c.decisionMaker.email && normalizeEmail(c.decisionMaker.email) === email)
    );
    if (hit) return { lead: hit, by: "email" };
  }
  if (li) {
    const hit = candidates.find((c) => c.decisionMaker.linkedinUrl && normalizeLinkedinUrl(c.decisionMaker.linkedinUrl) === li);
    if (hit) return { lead: hit, by: "linkedin" };
  }
  if (domain && !isFreeMailDomain(domain)) {
    const hit = candidates.find(
      (c) => websiteDomain(c.website) === domain || c.emails.some((e) => emailDomain(e) === domain) || (c.decisionMaker.email && emailDomain(c.decisionMaker.email) === domain)
    );
    if (hit) return { lead: hit, by: "domain" };
  }
  return null;
}

/** Mongo filter that loads every plausible candidate for `pickLead`. */
export function matchQuery(identity: ContactIdentity): Record<string, unknown> | null {
  const or: Record<string, unknown>[] = [];
  const email = identity.email ? normalizeEmail(identity.email) : "";
  const li = identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) : "";
  const domain = email ? emailDomain(email) : websiteDomain(identity.website ?? "");
  if (email) {
    or.push({ emails: email }, { "decisionMaker.email": new RegExp(`^${escapeRe(email)}$`, "i") });
  }
  if (li) or.push({ "decisionMaker.linkedinUrl": new RegExp(escapeRe(li.replace("https://www.", "")), "i") });
  if (domain && !isFreeMailDomain(domain)) {
    const re = new RegExp(`${escapeRe(domain)}(\\/|$)`, "i");
    or.push({ website: re }, { emails: new RegExp(`@${escapeRe(domain)}$`, "i") }, { "decisionMaker.email": new RegExp(`@${escapeRe(domain)}$`, "i") });
  }
  return or.length ? { $or: or } : null;
}

export function newLeadFields(identity: ContactIdentity, source: string) {
  const email = identity.email ? normalizeEmail(identity.email) : "";
  const domain = email ? emailDomain(email) : websiteDomain(identity.website ?? "");
  const company = identity.company?.trim() || (domain && !isFreeMailDomain(domain) ? domain : identity.name?.trim() || "Unknown");
  return {
    company,
    segment: "other",
    about: "",
    whyFit: "",
    useCaseHypothesis: "",
    decisionMaker: {
      name: identity.name?.trim() ?? "",
      title: identity.title?.trim() ?? "",
      email: email || undefined,
      emailVerified: false,
      linkedinUrl: identity.linkedinUrl ? normalizeLinkedinUrl(identity.linkedinUrl) || undefined : undefined,
    },
    website: identity.website ?? (domain && !isFreeMailDomain(domain) ? `https://${domain}` : ""),
    source,
    status: "staged",
    emails: email ? [email] : [],
  };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
```

- [ ] **Step 5: Implement touches.ts**

```ts
import type { ITouch } from "@/models/Lead";
import type { LeadStatus } from "@/lib/outreach/enums";

export type IncomingTouch = Omit<ITouch, "externalId"> & { externalId: string };

/** Idempotent append: drop incoming touches whose externalId already exists; keep the list sorted by `at`. */
export function mergeTouches(existing: ITouch[], incoming: IncomingTouch[]): { touches: ITouch[]; added: number } {
  const seen = new Set(existing.map((t) => t.externalId).filter(Boolean) as string[]);
  const fresh: ITouch[] = [];
  for (const t of incoming) {
    if (seen.has(t.externalId)) continue;
    seen.add(t.externalId);
    fresh.push(t);
  }
  const touches = [...existing, ...fresh].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return { touches, added: fresh.length };
}

const FROZEN: LeadStatus[] = ["dead", "replied", "call_booked"];

/** Spec §5 + §8e. Mutates `lead`. */
export function applyIngestStatus(
  lead: { status: LeadStatus; nextActionAt?: Date | null; needsReview: boolean },
  touches: ITouch[],
  opts: { created: boolean; flagReview: boolean }
): void {
  if (FROZEN.includes(lead.status)) return;
  const hasInbound = touches.some((t) => t.direction === "inbound");
  if (hasInbound) {
    lead.status = "replied";
    lead.nextActionAt = null;
    lead.needsReview = false;
    return;
  }
  if (opts.created) {
    if (opts.flagReview) {
      lead.status = "staged";
      lead.needsReview = true;
    } else {
      lead.status = "contacted";
      lead.nextActionAt = null;
    }
  }
}
```

- [ ] **Step 6: Run tests**

Run: `npx tsx src/lib/crm/identity.test.ts && npx tsx src/lib/crm/match-lead.test.ts && npx tsx src/lib/crm/touches.test.ts`
Expected: all PASS. Add script `"test:crm-core": "npx tsx src/lib/crm/identity.test.ts && npx tsx src/lib/crm/match-lead.test.ts && npx tsx src/lib/crm/touches.test.ts"`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/crm package.json
git commit -m "feat(crm): identity normalisation, lead matching, idempotent touch merge

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: DB-side upsert helper

**Files:**
- Create: `src/lib/crm/upsert-lead.ts`

**Interfaces:**
- Consumes: `matchQuery`, `pickLead`, `newLeadFields`, `mergeTouches`, `applyIngestStatus`, `Lead`.
- Produces: `upsertLeadWithTouches(args: { identity: ContactIdentity; touches: IncomingTouch[]; source: string; product?: Product; flagReview?: boolean; linkedinConversationId?: string }): Promise<{ leadId: string; created: boolean; added: number; matchedBy: MatchBy | "new" }>`.

No unit test (it is the one DB seam); it is exercised by every route's manual check and by the dry-run paths that call the pure functions directly.

- [ ] **Step 1: Implement**

```ts
import { connectDB } from "@core/db";
import { Lead, type ILead, type ITouch, type Product } from "@/models";
import { matchQuery, newLeadFields, pickLead, type ContactIdentity, type MatchBy, type MatchableLead } from "./match-lead";
import { mergeTouches, applyIngestStatus, type IncomingTouch } from "./touches";
import { normalizeEmail } from "./identity";

export interface UpsertArgs {
  identity: ContactIdentity;
  touches: IncomingTouch[];
  source: string;
  product?: Product;
  flagReview?: boolean;
  linkedinConversationId?: string;
}

export async function upsertLeadWithTouches(args: UpsertArgs) {
  await connectDB();
  const q = matchQuery(args.identity);
  const candidates: MatchableLead[] = q
    ? (await Lead.find(q).select("_id emails decisionMaker.email decisionMaker.linkedinUrl website").lean()).map((c) => ({
        _id: String(c._id), emails: c.emails ?? [], decisionMaker: c.decisionMaker ?? {}, website: c.website ?? "",
      }))
    : [];
  const picked = pickLead(args.identity, candidates);

  let lead: ILead;
  let created = false;
  let matchedBy: MatchBy | "new";
  if (picked) {
    lead = (await Lead.findById(picked.lead._id))!;
    matchedBy = picked.by;
  } else {
    lead = await Lead.create(newLeadFields(args.identity, args.source));
    created = true;
    matchedBy = "new";
  }

  // Grow the identity set so the next ingest matches on email directly.
  const email = args.identity.email ? normalizeEmail(args.identity.email) : "";
  if (email && !lead.emails.includes(email)) lead.emails.push(email);
  if (args.identity.linkedinUrl && !lead.decisionMaker.linkedinUrl) lead.decisionMaker.linkedinUrl = args.identity.linkedinUrl;
  if (args.identity.name && !lead.decisionMaker.name) lead.decisionMaker.name = args.identity.name;
  if (args.linkedinConversationId && !lead.linkedinConversationIds.includes(args.linkedinConversationId)) {
    lead.linkedinConversationIds.push(args.linkedinConversationId);
  }

  const merged = mergeTouches(lead.touches as ITouch[], args.touches);
  lead.touches = merged.touches;
  applyIngestStatus(lead, lead.touches, { created, flagReview: !!args.flagReview });

  if (args.product) {
    const now = new Date();
    const opp = lead.opportunities.find((o) => o.product === args.product);
    if (opp) { opp.stage = lead.status; opp.updatedAt = now; }
    else lead.opportunities.push({ product: args.product, stage: lead.status, nextActionAt: null, updatedAt: now });
  }

  await lead.save();
  return { leadId: String(lead._id), created, added: merged.added, matchedBy };
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "crm|Lead" || echo "clean"`
Expected: `clean`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/crm/upsert-lead.ts
git commit -m "feat(crm): upsertLeadWithTouches DB seam

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Contact form reason/product + lead upsert (spec §6)

**Files:**
- Create: `src/lib/crm/classify-contact.ts`, test `src/lib/crm/classify-contact.test.ts`
- Modify: `src/components/ContactForm.tsx`, `src/app/api/contact/route.ts`

**Interfaces:**
- Produces: `classifyContact(input: { reason?: string; subject: string; message: string }): { reason: ContactReason; isCareers: boolean }`; `productFromParam(p: string | null): Product | undefined`.

- [ ] **Step 1: Failing tests**

`src/lib/crm/classify-contact.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { classifyContact, productFromParam } from "./classify-contact";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
await test("explicit careers reason", () => {
  assert.deepEqual(classifyContact({ reason: "careers", subject: "x", message: "y" }), { reason: "careers", isCareers: true });
});
await test("keyword screen catches a job inquiry with no reason", () => {
  const r = classifyContact({ subject: "Inquiry: Voice Tutor", message: "Please find my resume attached, I am applying for the ML engineer position." });
  assert.equal(r.isCareers, true); assert.equal(r.reason, "careers");
});
await test("demo alias normalises", () => {
  assert.equal(classifyContact({ reason: "demo", subject: "Request a Demo", message: "hi" }).reason, "demo_request");
});
await test("unknown reason -> other; ordinary inquiry not careers", () => {
  const r = classifyContact({ reason: "banana", subject: "Pricing", message: "How much per minute?" });
  assert.equal(r.reason, "other"); assert.equal(r.isCareers, false);
});
await test("productFromParam maps CTA slugs", () => {
  assert.equal(productFromParam("voice-tutor"), "voice_tutor");
  assert.equal(productFromParam("tutor-copilot"), "voice_tutor");
  assert.equal(productFromParam("academy"), "academy");
  assert.equal(productFromParam("mock-exams"), "mock_exams");
  assert.equal(productFromParam("white-label"), "white_label");
  assert.equal(productFromParam("content"), "content_services");
  assert.equal(productFromParam("essay-ai"), "other");
  assert.equal(productFromParam(null), undefined);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run to verify fail** — `npx tsx src/lib/crm/classify-contact.test.ts` → "Cannot find module".

- [ ] **Step 3: Implement classify-contact.ts**

```ts
import { CONTACT_REASONS, type ContactReason, type Product } from "@/lib/outreach/enums";

const CAREERS_RE = /\b(resume|r[ée]sum[ée]|\bcv\b|applying|application for|job (opening|opportunity|role)|position|internship|vacancy|hiring|recruit)/i;

export function classifyContact(input: { reason?: string; subject: string; message: string }): { reason: ContactReason; isCareers: boolean } {
  let reason: ContactReason = "other";
  const raw = (input.reason ?? "").trim().toLowerCase();
  if (raw === "demo") reason = "demo_request";
  else if ((CONTACT_REASONS as readonly string[]).includes(raw)) reason = raw as ContactReason;
  const text = `${input.subject}\n${input.message}`;
  const isCareers = reason === "careers" || (reason === "other" || reason === "product_inquiry") && CAREERS_RE.test(text);
  return { reason: isCareers ? "careers" : reason, isCareers };
}

const PRODUCT_PARAM: Record<string, Product> = {
  "voice-tutor": "voice_tutor", "tutor-copilot": "voice_tutor", "homework-bot": "voice_tutor", "math-solver": "voice_tutor",
  academy: "academy", "evelyn-academy": "academy",
  "mock-exams": "mock_exams", "test-generator": "mock_exams",
  "white-label": "white_label", partner: "white_label",
  content: "content_services", "content-authoring": "content_services",
};

export function productFromParam(p: string | null): Product | undefined {
  if (!p) return undefined;
  return PRODUCT_PARAM[p.toLowerCase()] ?? "other";
}
```

- [ ] **Step 4: Run test** — `npx tsx src/lib/crm/classify-contact.test.ts` → PASS. Add script `"test:crm-contact": "npx tsx src/lib/crm/classify-contact.test.ts"`.

- [ ] **Step 5: Form changes**

In `src/components/ContactForm.tsx`:

1. Extend the zod schema: `reason: z.enum(["product_inquiry","demo_request","partnership","careers","support","other"]), product: z.string().optional(),`.
2. In the prefill `useEffect`, after the existing branches add:

```ts
    // Structured intent (spec §6). CTA links carry ?product= and/or
    // ?demo=true; those set the select so the operator never types intent.
    const reasonParam = searchParams.get('reason');
    if (reasonParam) setValue('reason', (reasonParam === 'demo' ? 'demo_request' : reasonParam) as ContactFormData['reason']);
    else if (demo === 'true') setValue('reason', 'demo_request');
    else if (product) setValue('reason', 'product_inquiry');
    if (product) setValue('product', product);
```

3. Add a `reason` watch: `const reason = watch('reason');` (add `watch` to the `useForm` destructure).
4. Insert this block **above** the Subject field:

```tsx
      {/* Reason */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          What is this about? <span className="text-red-500">*</span>
        </label>
        <select
          {...register("reason")}
          id="reason"
          defaultValue=""
          className={cn("mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500", errors.reason ? "border-red-300" : "border-gray-200")}
        >
          <option value="" disabled>Select one</option>
          <option value="product_inquiry">A product inquiry</option>
          <option value="demo_request">Request a demo</option>
          <option value="partnership">Partnership or white-label</option>
          <option value="support">Support for an existing account</option>
          <option value="careers">Careers / job application</option>
          <option value="other">Something else</option>
        </select>
        {errors.reason && <p className="mt-1 text-sm text-red-500">Please choose a reason</p>}
        <input type="hidden" {...register("product")} />
      </div>
      {reason === "careers" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Applying for a role? Please use our <a href="/careers" className="font-semibold underline">careers page</a> so your application reaches the right team.
        </div>
      )}
```

5. In `onSubmit`, before the `fetch`, add: `if (data.reason === "careers") { window.location.href = "/careers"; return; }`.

- [ ] **Step 6: API route changes**

In `src/app/api/contact/route.ts`:

1. Add imports: `import { classifyContact, productFromParam } from "@/lib/crm/classify-contact"; import { upsertLeadWithTouches } from "@/lib/crm/upsert-lead";`
2. Extend `contactSchema` with `reason: z.string().optional(), product: z.string().optional(),`.
3. After parsing, compute `const cls = classifyContact({ reason: data.reason, subject: data.subject, message: data.message }); const product = productFromParam(data.product ?? null);`
4. Change the `ContactSubmission.create` call to include `reason: cls.reason, product,`.
5. Immediately after the submission is created, add:

```ts
    // Spec §6: everything except careers becomes (or extends) a lead.
    if (!cls.isCareers) {
      try {
        await upsertLeadWithTouches({
          identity: { email: data.email, name: data.name, company: data.company },
          source: "contact-form",
          product,
          touches: [{
            at: new Date(),
            channel: "form",
            direction: "inbound",
            summary: `Contact form (${cls.reason}): ${data.subject}`.slice(0, 200),
            subject: data.subject,
            body: data.message,
            from: data.email,
            to: "info@evelynlearning.com",
            externalId: `form:${submission._id}`,
            origin: "contact_form",
          }],
        });
      } catch (leadErr) {
        console.error("[CRM] contact-form lead upsert failed:", leadErr);
      }
    }
```

- [ ] **Step 7: Manual check**

Run: `npm run dev` then in another shell:

```bash
curl -s -X POST http://localhost:3000/api/contact -H 'Content-Type: application/json' -d '{"name":"Test Lead","email":"tl@example-school.org","subject":"Demo Request: Voice Tutor","message":"We run a 300-student MS.","reason":"demo_request","product":"voice-tutor"}'
curl -s -X POST http://localhost:3000/api/contact -H 'Content-Type: application/json' -d '{"name":"Job Seeker","email":"js@gmail.com","subject":"Inquiry","message":"Please find my resume attached for the position.","reason":"other"}'
```

Expected: both return `{"success":true,...}`; `/admin/outreach` Pipeline shows `example-school.org` at status `replied` with an inbound form touch and an `opportunities` entry `voice_tutor`; no lead for the job seeker (check `db.leads.countDocuments({emails:"js@gmail.com"})` = 0).

- [ ] **Step 8: Commit**

```bash
git add src/lib/crm/classify-contact.ts src/lib/crm/classify-contact.test.ts src/components/ContactForm.tsx src/app/api/contact/route.ts package.json
git commit -m "feat(crm): contact form reason/product, careers screen, lead upsert

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Multi-account Gmail client (spec §7)

**Files:**
- Modify: `src/lib/outreach/gmail.ts`, `src/app/api/admin/outreach/gmail/auth/route.ts`, `.../callback/route.ts`, `.../status/route.ts`
- Test: `src/lib/outreach/gmail-accounts.test.ts`

**Interfaces:**
- Produces: `getOutreachAccounts(): string[]` (from `GMAIL_OUTREACH_ACCOUNTS`, falling back to `[getOutreachAccount()]`); `isAllowedAccount(email: string): boolean`; `getOutreachGmail(account?: string)` (default unchanged); `getThreadMessages(threadId, account?)`; new `getFullThread(threadId: string, account: string): Promise<FullMessage[]>` where `FullMessage = { id: string; threadId: string; from: string; to: string; subject: string; date: number; labelIds: string[]; text: string; messageIdHeader: string }`; `listThreadIds(account: string, q: string, pageToken?: string): Promise<{ ids: string[]; nextPageToken?: string }>`.
- Callers of the old signatures keep working (all new params optional).

- [ ] **Step 1: Failing test**

`src/lib/outreach/gmail-accounts.test.ts`:

```ts
import { strict as assert } from "node:assert";
process.env.GMAIL_OUTREACH_USER = "praveen@evelynlearning.com";
process.env.GMAIL_OUTREACH_ACCOUNTS = "praveen@evelynlearning.com, Info@EvelynLearning.com";
import { getOutreachAccounts, isAllowedAccount, extractPlainText } from "./gmail";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
await test("accounts parsed, lowercased, primary first", () => {
  assert.deepEqual(getOutreachAccounts(), ["praveen@evelynlearning.com", "info@evelynlearning.com"]);
});
await test("isAllowedAccount is case-insensitive", () => {
  assert.equal(isAllowedAccount("INFO@evelynlearning.com"), true);
  assert.equal(isAllowedAccount("x@evelynlearning.com"), false);
});
await test("extractPlainText prefers text/plain, falls back to stripped html", () => {
  const b64 = (s: string) => Buffer.from(s).toString("base64url");
  assert.equal(extractPlainText({ mimeType: "text/plain", body: { data: b64("hi there") } }), "hi there");
  assert.equal(extractPlainText({ mimeType: "multipart/alternative", parts: [
    { mimeType: "text/html", body: { data: b64("<p>Hello <b>world</b></p>") } },
    { mimeType: "text/plain", body: { data: b64("Hello world") } },
  ] }), "Hello world");
  assert.equal(extractPlainText({ mimeType: "text/html", body: { data: b64("<div>A<br>B</div>") } }), "A\nB");
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run to verify fail** — `npx tsx src/lib/outreach/gmail-accounts.test.ts` → FAIL (`getOutreachAccounts` is not exported).

- [ ] **Step 3: Implement in gmail.ts**

Add after `getOutreachAccount()`:

```ts
export function getOutreachAccounts(): string[] {
  const primary = getOutreachAccount().toLowerCase();
  const extra = (process.env.GMAIL_OUTREACH_ACCOUNTS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return Array.from(new Set([primary, ...extra]));
}

export function isAllowedAccount(email: string): boolean {
  return getOutreachAccounts().includes(email.trim().toLowerCase());
}
```

Change `getOutreachGmail` to accept an account:

```ts
export async function getOutreachGmail(account: string = getOutreachAccount()): Promise<gmail_v1.Gmail> {
  await connectDB();
  const doc = await OutreachToken.findOne({ account: account.toLowerCase() });
  if (!doc) throw new Error("GMAIL_NOT_CONNECTED");
  const auth = getOutreachOAuthClient();
  auth.setCredentials({ refresh_token: decryptToken(doc.refreshTokenEnc) });
  return google.gmail({ version: "v1", auth });
}
```

Change `getThreadMessages(threadId: string)` to `getThreadMessages(threadId: string, account?: string)` and pass `account` to `getOutreachGmail(account)`.

Append:

```ts
export interface FullMessage {
  id: string; threadId: string; from: string; to: string; subject: string;
  date: number; labelIds: string[]; text: string; messageIdHeader: string;
}

type Part = { mimeType?: string | null; body?: { data?: string | null } | null; parts?: Part[] | null };

/** text/plain if present anywhere in the tree; otherwise HTML stripped to text. */
export function extractPlainText(part: Part): string {
  const decode = (d?: string | null) => (d ? Buffer.from(d, "base64url").toString("utf8") : "");
  const walk = (p: Part, want: string): string => {
    if (p.mimeType === want && p.body?.data) return decode(p.body.data);
    for (const c of p.parts ?? []) { const r = walk(c, want); if (r) return r; }
    return "";
  };
  const plain = walk(part, "text/plain");
  if (plain) return plain.replace(/\r\n/g, "\n").trim();
  const html = walk(part, "text/html");
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|tr|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n").trim();
}

export async function getFullThread(threadId: string, account: string): Promise<FullMessage[]> {
  const gmail = await getOutreachGmail(account);
  const res = await gmail.users.threads.get({ userId: "me", id: threadId, format: "full" });
  const header = (m: gmail_v1.Schema$Message, name: string) =>
    m.payload?.headers?.find((h) => h.name?.toLowerCase() === name)?.value ?? "";
  return (res.data.messages ?? []).map((m) => ({
    id: m.id ?? "", threadId: m.threadId ?? threadId,
    from: header(m, "from"), to: header(m, "to"), subject: header(m, "subject"),
    date: Number(m.internalDate ?? 0), labelIds: m.labelIds ?? [],
    text: m.payload ? extractPlainText(m.payload as Part) : "",
    messageIdHeader: header(m, "message-id"),
  }));
}

export async function listThreadIds(account: string, q: string, pageToken?: string): Promise<{ ids: string[]; nextPageToken?: string }> {
  const gmail = await getOutreachGmail(account);
  const res = await gmail.users.threads.list({ userId: "me", q, maxResults: 50, pageToken });
  return { ids: (res.data.threads ?? []).map((t) => t.id ?? "").filter(Boolean), nextPageToken: res.data.nextPageToken ?? undefined };
}
```

- [ ] **Step 4: OAuth routes**

`auth/route.ts`: read `const account = new URL(req.url).searchParams.get("account") ?? getOutreachAccount();` and return `errorRedirect(req, "unknown_account")` if `!isAllowedAccount(account)`; use `login_hint: account`. Import `isAllowedAccount`.

`callback/route.ts`: replace the `consentedEmail !== account` check with:

```ts
    if (!consentedEmail || !isAllowedAccount(consentedEmail)) {
      return errorRedirect(req, "wrong_account");
    }
    const account = consentedEmail;
```

`status/route.ts`: return every allowed account:

```ts
  const accounts = getOutreachAccounts();
  const docs = await OutreachToken.find({ account: { $in: accounts } }).lean<IOutreachToken[]>();
  const byAccount = new Map(docs.map((d) => [d.account, d]));
  return NextResponse.json({
    connected: byAccount.has(accounts[0]),
    account: accounts[0],
    connectedAt: byAccount.get(accounts[0])?.connectedAt ? new Date(byAccount.get(accounts[0])!.connectedAt).toISOString() : null,
    accounts: accounts.map((a) => ({ account: a, connected: byAccount.has(a), connectedAt: byAccount.get(a)?.connectedAt ? new Date(byAccount.get(a)!.connectedAt).toISOString() : null })),
  });
```

(The top-level keys are unchanged so `OutreachConsole` keeps working.)

- [ ] **Step 5: Run tests** — `npx tsx src/lib/outreach/gmail-accounts.test.ts && npm run test:outreach-reply` → PASS. Add script `"test:crm-gmail": "npx tsx src/lib/outreach/gmail-accounts.test.ts"`.

- [ ] **Step 6: Manual check** — with `GMAIL_OUTREACH_ACCOUNTS` set in `.env.local`, visit `/api/admin/outreach/gmail/auth?account=info@evelynlearning.com`, consent as info@, expect redirect to `/admin/outreach?gmail=connected` and `/api/admin/outreach/gmail/status` listing both accounts.

- [ ] **Step 7: Commit**

```bash
git add src/lib/outreach/gmail.ts src/lib/outreach/gmail-accounts.test.ts src/app/api/admin/outreach/gmail package.json
git commit -m "feat(crm): multi-account Gmail client, full-thread fetch, thread listing

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Gmail thread classification (spec §8, pure)

**Files:**
- Create: `src/lib/crm/gmail-classify.ts`, test `src/lib/crm/gmail-classify.test.ts`

**Interfaces:**
- Consumes: `FullMessage` from `gmail.ts`, `isSelfAddress` from `identity.ts`.
- Produces: `classifyThread(messages: FullMessage[], account: string): ThreadVerdict` where `ThreadVerdict = { keep: false; reason: "auto_reply_only"|"self_notification"|"internal"|"machine"|"empty" } | { keep: true; flagReview: boolean; identity: ContactIdentity; touches: IncomingTouch[] }`; `AUTO_REPLY_SUBJECT`, `SELF_NOTIFICATION_PREFIX`.

- [ ] **Step 1: Failing tests**

```ts
import { strict as assert } from "node:assert";
import { classifyThread } from "./gmail-classify";
import type { FullMessage } from "@/lib/outreach/gmail";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
const acct = "info@evelynlearning.com";
const m = (o: Partial<FullMessage>): FullMessage => ({ id: "x", threadId: "t", from: "", to: "", subject: "", date: 1, labelIds: [], text: "", messageIdHeader: "", ...o });
(async () => {
await test("auto-reply only is skipped", () => {
  const v = classifyThread([m({ id: "1", from: acct, to: "p@x.org", subject: "Thank you for contacting Evelyn Learning", labelIds: ["SENT"] })], acct);
  assert.deepEqual(v, { keep: false, reason: "auto_reply_only" });
});
await test("auto-reply followed by a human reply is kept", () => {
  const v = classifyThread([
    m({ id: "1", from: acct, to: "p@x.org", subject: "Thank you for contacting Evelyn Learning", labelIds: ["SENT"], date: 1 }),
    m({ id: "2", from: "Pat <p@x.org>", to: acct, subject: "Re: Thank you", text: "Great, when can we talk?", date: 2 }),
    m({ id: "3", from: "hello@evelynlearning.com", to: "p@x.org", subject: "Re: Thank you", text: "Tomorrow?", labelIds: ["SENT"], date: 3 }),
  ], acct);
  assert.ok(v.keep);
  if (v.keep) {
    assert.equal(v.flagReview, false);
    assert.equal(v.identity.email, "p@x.org"); assert.equal(v.identity.name, "Pat");
    assert.deepEqual(v.touches.map((t) => t.direction), ["outbound", "inbound", "outbound"]);
    assert.equal(v.touches[1].body, "Great, when can we talk?");
    assert.equal(v.touches[0].externalId, "gmail:1");
    assert.equal(v.touches[0].account, acct);
  }
});
await test("self notification skipped", () => {
  assert.equal(classifyThread([m({ from: acct, to: "praveen@evelynlearning.com", subject: "New Contact Form Submission: Demo" })], acct).keep, false);
});
await test("internal-only skipped", () => {
  assert.deepEqual(classifyThread([m({ from: acct, to: "praveen@evelynlearning.com", subject: "sync" })], acct), { keep: false, reason: "internal" });
});
await test("machine senders skipped", () => {
  assert.deepEqual(classifyThread([m({ from: "no-reply@calendar.google.com", to: acct, subject: "Invite" })], acct), { keep: false, reason: "machine" });
  assert.deepEqual(classifyThread([m({ from: acct, to: "billing@apollo.io", subject: "x", labelIds: ["SENT"] })], acct), { keep: false, reason: "machine" });
});
await test("single outbound with no reply is kept but flagged", () => {
  const v = classifyThread([m({ id: "9", from: "Praveen <praveen@evelynlearning.com>", to: "Dean <dean@school.edu>", subject: "Quick idea", text: "…", labelIds: ["SENT"] })], "praveen@evelynlearning.com");
  assert.ok(v.keep && v.flagReview);
  if (v.keep) { assert.equal(v.identity.email, "dean@school.edu"); assert.equal(v.identity.name, "Dean"); }
});
await test("drafts are ignored", () => {
  assert.equal(classifyThread([m({ from: acct, to: "p@x.org", labelIds: ["DRAFT"] })], acct).keep, false);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run to verify fail** — `npx tsx src/lib/crm/gmail-classify.test.ts` → "Cannot find module".

- [ ] **Step 3: Implement**

```ts
import type { FullMessage } from "@/lib/outreach/gmail";
import type { ContactIdentity } from "./match-lead";
import type { IncomingTouch } from "./touches";
import { isSelfAddress, normalizeEmail } from "./identity";

export const AUTO_REPLY_SUBJECT = "Thank you for contacting Evelyn Learning";
export const SELF_NOTIFICATION_PREFIX = "New Contact Form Submission:";
const MACHINE_RE = /(^|[<\s.@-])(no-?reply|notifications?|billing|calendar|mailer-daemon|postmaster|apollo\.io|hunter\.io|prospeo)/i;

export type SkipReason = "auto_reply_only" | "self_notification" | "internal" | "machine" | "empty";
export type ThreadVerdict =
  | { keep: false; reason: SkipReason }
  | { keep: true; flagReview: boolean; identity: ContactIdentity; touches: IncomingTouch[] };

function displayName(addr: string): string {
  const m = addr.match(/^\s*"?([^"<]+?)"?\s*<[^>]+>/);
  return m ? m[1].trim() : "";
}

function splitAddresses(field: string): string[] {
  return field.split(",").map((s) => s.trim()).filter(Boolean);
}

export function classifyThread(messages: FullMessage[], account: string): ThreadVerdict {
  const msgs = messages.filter((m) => !m.labelIds.includes("DRAFT")).sort((a, b) => a.date - b.date);
  if (msgs.length === 0) return { keep: false, reason: "empty" };

  if (msgs.some((m) => m.subject.trim().startsWith(SELF_NOTIFICATION_PREFIX))) return { keep: false, reason: "self_notification" };

  const all = msgs.flatMap((m) => [...splitAddresses(m.from), ...splitAddresses(m.to)]);
  if (all.some((a) => MACHINE_RE.test(a))) return { keep: false, reason: "machine" };

  const external = all.filter((a) => !isSelfAddress(a));
  if (external.length === 0) return { keep: false, reason: "internal" };

  const selfMsgs = msgs.filter((m) => isSelfAddress(m.from));
  if (selfMsgs.length > 0 && selfMsgs.every((m) => m.subject.trim() === AUTO_REPLY_SUBJECT)) {
    // Kept only if an external person wrote back AND we (a human) answered.
    const humanSelf = selfMsgs.some((m) => m.subject.trim() !== AUTO_REPLY_SUBJECT);
    if (!humanSelf) {
      const inboundHuman = msgs.some((m) => !isSelfAddress(m.from));
      if (!inboundHuman) return { keep: false, reason: "auto_reply_only" };
    }
  }

  // Identity = first external participant (the To of our first send, or the From of their first message).
  const firstExternal = external[0];
  const identity: ContactIdentity = { email: normalizeEmail(firstExternal), name: displayName(firstExternal) || undefined };

  const touches: IncomingTouch[] = msgs
    .filter((m) => m.subject.trim() !== AUTO_REPLY_SUBJECT) // the auto-reply itself is noise on the timeline
    .map((m) => {
      const outbound = isSelfAddress(m.from);
      return {
        at: new Date(m.date),
        channel: "email",
        direction: outbound ? "outbound" : "inbound",
        summary: `${outbound ? "Sent" : "Received"}: ${m.subject || "(no subject)"} — ${m.text.slice(0, 120).replace(/\s+/g, " ")}`,
        subject: m.subject, body: m.text, from: m.from, to: m.to,
        externalId: `gmail:${m.id}`, gmailMessageId: m.id, account, origin: "gmail_import",
      };
    });
  if (touches.length === 0) return { keep: false, reason: "auto_reply_only" };

  const flagReview = touches.length === 1 && touches[0].direction === "outbound";
  return { keep: true, flagReview, identity, touches };
}
```

- [ ] **Step 4: Run tests** — PASS. Script: `"test:crm-gmail-classify": "npx tsx src/lib/crm/gmail-classify.test.ts"`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/gmail-classify.ts src/lib/crm/gmail-classify.test.ts package.json
git commit -m "feat(crm): per-thread Gmail keep/skip classification

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Gmail ingest service + paged import route + watcher label ingest

**Files:**
- Create: `src/lib/crm/gmail-ingest.ts`, `src/app/api/admin/outreach/ingest/gmail/route.ts`
- Modify: `src/lib/outreach/reply-watcher.ts`

**Interfaces:**
- Produces: `ingestGmailPage(args: { account: string; query: string; pageToken?: string; dryRun: boolean; origin: "gmail_import"|"gmail_label"; product?: Product }): Promise<IngestPageResult>` with `IngestPageResult = { nextPageToken?: string; scanned: number; kept: number; created: number; updated: number; touchesAdded: number; skipped: Record<SkipReason, number>; samples: { threadId: string; subject: string; participant: string; verdict: string }[] }`; `sentQuery(days: number): string` = `in:sent newer_than:${days}d`; `labelQuery(): string` = `label:CRM newer_than:3d`.
- Route: `POST /api/admin/outreach/ingest/gmail` body `{ account, days?: number (default 365), query?: string, pageToken?: string, dryRun?: boolean (default true) }` → `IngestPageResult`.

- [ ] **Step 1: Implement gmail-ingest.ts**

```ts
import { getFullThread, listThreadIds } from "@/lib/outreach/gmail";
import type { Product, TouchOrigin } from "@/lib/outreach/enums";
import { classifyThread, type SkipReason } from "./gmail-classify";
import { upsertLeadWithTouches } from "./upsert-lead";

export interface IngestPageResult {
  nextPageToken?: string;
  scanned: number; kept: number; created: number; updated: number; touchesAdded: number;
  skipped: Record<SkipReason, number>;
  samples: { threadId: string; subject: string; participant: string; verdict: string }[];
}

export const sentQuery = (days: number) => `in:sent newer_than:${Math.max(1, Math.floor(days))}d`;
export const labelQuery = () => "label:CRM newer_than:3d";

export async function ingestGmailPage(args: {
  account: string; query: string; pageToken?: string; dryRun: boolean; origin: Extract<TouchOrigin, "gmail_import" | "gmail_label">; product?: Product;
}): Promise<IngestPageResult> {
  const out: IngestPageResult = {
    scanned: 0, kept: 0, created: 0, updated: 0, touchesAdded: 0,
    skipped: { auto_reply_only: 0, self_notification: 0, internal: 0, machine: 0, empty: 0 }, samples: [],
  };
  const { ids, nextPageToken } = await listThreadIds(args.account, args.query, args.pageToken);
  out.nextPageToken = nextPageToken;

  for (const threadId of ids) {
    out.scanned++;
    let verdict;
    let subject = "";
    try {
      const msgs = await getFullThread(threadId, args.account);
      subject = msgs[0]?.subject ?? "";
      verdict = classifyThread(msgs, args.account);
    } catch (e) {
      console.error(`[CRM] gmail ingest thread ${threadId} failed:`, e instanceof Error ? e.message : e);
      continue;
    }
    if (!verdict.keep) {
      out.skipped[verdict.reason]++;
      if (out.samples.length < 30) out.samples.push({ threadId, subject, participant: "", verdict: `skip:${verdict.reason}` });
      continue;
    }
    out.kept++;
    const participant = verdict.identity.email ?? "";
    if (out.samples.length < 30) out.samples.push({ threadId, subject, participant, verdict: verdict.flagReview ? "keep:review" : "keep" });
    if (args.dryRun) continue;
    const touches = verdict.touches.map((t) => ({ ...t, origin: args.origin }));
    const r = await upsertLeadWithTouches({
      identity: verdict.identity, touches, source: `gmail:${args.account}`, flagReview: verdict.flagReview, product: args.product,
    });
    if (r.created) out.created++; else out.updated++;
    out.touchesAdded += r.added;
  }
  return out;
}
```

- [ ] **Step 2: Route**

`src/app/api/admin/outreach/ingest/gmail/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isAllowedAccount } from "@/lib/outreach/gmail";
import { PRODUCTS } from "@/lib/outreach/enums";
import { ingestGmailPage, sentQuery } from "@/lib/crm/gmail-ingest";

export const maxDuration = 300;

const bodySchema = z.object({
  account: z.string().email(),
  days: z.number().int().min(1).max(3650).optional(),
  query: z.string().max(500).optional(),
  pageToken: z.string().optional(),
  dryRun: z.boolean().optional(),
  product: z.enum(PRODUCTS).optional(),
});

// POST - import one page (≤50 threads) of a mailbox's sent folder into leads.
// Dry-run by default: the UI loops on nextPageToken and shows counts/samples
// before the operator runs it for real.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body", issues: parsed.error.issues }, { status: 400 });
  const b = parsed.data;
  if (!isAllowedAccount(b.account)) return NextResponse.json({ error: "Account not allowed" }, { status: 400 });
  try {
    const result = await ingestGmailPage({
      account: b.account.toLowerCase(), query: b.query ?? sentQuery(b.days ?? 365), pageToken: b.pageToken,
      dryRun: b.dryRun ?? true, origin: "gmail_import", product: b.product,
    });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ingest failed";
    const status = msg === "GMAIL_NOT_CONNECTED" ? 409 : 500;
    console.error("[CRM] gmail ingest error:", msg);
    return NextResponse.json({ error: msg }, { status });
  }
}
```

- [ ] **Step 3: Watcher label ingest**

In `src/lib/outreach/reply-watcher.ts`:

1. Import: `import { getOutreachAccounts } from "./gmail"; import { ingestGmailPage, labelQuery } from "@/lib/crm/gmail-ingest";`
2. Add after `runReplyCheck`:

```ts
// Ongoing CRM ingest (spec §7): any thread the operator labels "CRM" in
// either mailbox is imported on the same 15-minute cron. Idempotent, so the
// 3-day window re-scanning the same threads costs Gmail calls, not
// duplicates.
export async function runLabelIngest(): Promise<{ account: string; kept: number; touchesAdded: number; errors: number }[]> {
  const results: { account: string; kept: number; touchesAdded: number; errors: number }[] = [];
  for (const account of getOutreachAccounts()) {
    let pageToken: string | undefined;
    let kept = 0, touchesAdded = 0, errors = 0;
    try {
      do {
        const r = await ingestGmailPage({ account, query: labelQuery(), pageToken, dryRun: false, origin: "gmail_label" });
        kept += r.kept; touchesAdded += r.touchesAdded; pageToken = r.nextPageToken;
      } while (pageToken);
    } catch (e) {
      errors++;
      if (!(e instanceof Error && e.message === "GMAIL_NOT_CONNECTED")) console.error(`[CRM] label ingest ${account}:`, e);
    }
    results.push({ account, kept, touchesAdded, errors });
  }
  return results;
}
```

3. In `startReplyWatcher`'s cron callback, after the reply-check log block add:

```ts
    const label = await runLabelIngest();
    const touched = label.reduce((n, r) => n + r.touchesAdded, 0);
    if (touched > 0 || label.some((r) => r.errors)) console.log(`[CRM] label ingest: ${JSON.stringify(label)}`);
```

4. In `src/app/api/admin/outreach/watcher/route.ts` POST, after `runReplyCheck()` also run `const label = await runLabelIngest();` and return `{ success: true, stats, label }`.

- [ ] **Step 4: Manual check**

With `info@` connected:

```bash
curl -s -X POST http://localhost:3000/api/admin/outreach/ingest/gmail -H 'Content-Type: application/json' -b "$ADMIN_COOKIE" -d '{"account":"info@evelynlearning.com","days":365,"dryRun":true}' | jq '{scanned,kept,skipped,nextPageToken, samples: .samples[:5]}'
```

Expected: JSON with non-zero `scanned`, `skipped.auto_reply_only` counting the form auto-replies, a `nextPageToken` when more than 50 threads exist. Then run with `"dryRun":false` once and again: the second run reports `touchesAdded: 0`.

Label a thread `CRM` in Gmail, `POST /api/admin/outreach/watcher`, expect `label[].touchesAdded ≥ 1`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/gmail-ingest.ts src/app/api/admin/outreach/ingest/gmail/route.ts src/lib/outreach/reply-watcher.ts src/app/api/admin/outreach/watcher/route.ts
git commit -m "feat(crm): paged Gmail sent-folder import and CRM-label cron ingest

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: LinkedIn paste/bookmarklet parser + route + import page (spec §9a)

**Files:**
- Create: `src/lib/crm/linkedin-paste.ts`, test `src/lib/crm/linkedin-paste.test.ts`
- Create: `src/app/api/admin/outreach/ingest/linkedin/route.ts`
- Create: `src/app/admin/outreach/linkedin-import/page.tsx`, `src/app/admin/outreach/linkedin-import/LinkedinImport.tsx`

**Interfaces:**
- Produces: `parseLinkedinConversation(text: string, opts: { ownerName: string; now?: Date }): { participant: string; messages: { from: string; at: Date; body: string; outbound: boolean }[] }`; `linkedinTouches(parsed, conversationKey: string): IncomingTouch[]` (externalId = `li:<sha1(conversationKey|iso minute|body)>`).
- Route: `POST /api/admin/outreach/ingest/linkedin` body `{ text: string; profileUrl?: string; name?: string; product?: Product; dryRun?: boolean }` → `{ participant, messages: [...], leadId?, created?, added? }`.

- [ ] **Step 1: Failing tests**

```ts
import { strict as assert } from "node:assert";
import { parseLinkedinConversation, linkedinTouches } from "./linkedin-paste";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
const SAMPLE = `Skyler Scarlett 
1st degree connection
· 1st
2x ABC Shark Tank Entrepreneur | AI Patent Holder
Saturday
Praveen Tyagi sent the following message at 1:28 PM
View Praveen’s profilePraveen Tyagi
Praveen Tyagi   1:28 PM
Hi Skyler, I run Evelyn Learning, an AI-first EdTech company.

Skyler Scarlett sent the following messages at 2:22 PM
View Skyler’s profileSkyler Scarlett
Skyler Scarlett   2:22 PM
Very cool

Nice to be connected!

Praveen Tyagi sent the following message at 5:36 PM
View Praveen’s profilePraveen Tyagi
Praveen Tyagi   5:36 PM
Likewise! Up for a 20-minute demo swap sometime?

Skyler Scarlett sent the following messages at 5:37 PM
View Skyler’s profileSkyler Scarlett
Skyler Scarlett   5:37 PM
👏
👍
😊

Thank you!! 

Sure, be great to connect. 
`;
(async () => {
const now = new Date("2026-09-21T12:00:00-07:00"); // Monday
await test("parses messages, direction, participant", () => {
  const r = parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now });
  assert.equal(r.participant, "Skyler Scarlett");
  assert.equal(r.messages.length, 4);
  assert.deepEqual(r.messages.map((m) => m.outbound), [true, false, true, false]);
  assert.equal(r.messages[1].body, "Very cool\n\nNice to be connected!");
  assert.equal(r.messages[3].body, "Thank you!!\n\nSure, be great to connect.");
});
await test("reaction-only lines are dropped", () => {
  const r = parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now });
  assert.ok(!r.messages[3].body.includes("👏"));
});
await test("weekday marker resolves to the most recent such day", () => {
  const r = parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now });
  const d = r.messages[0].at;
  assert.equal(d.getDay(), 6); // Saturday
  assert.ok(d.getTime() < now.getTime());
  assert.equal(d.getHours(), 13); assert.equal(d.getMinutes(), 28);
});
await test("'Today' and 'Sep 18' markers", () => {
  const txt = `Today\nJane Doe   9:05 AM\nhello\nSep 18\nPraveen Tyagi   4:00 PM\nreply`;
  const r = parseLinkedinConversation(txt, { ownerName: "Praveen Tyagi", now });
  assert.equal(r.messages.length, 2);
  assert.equal(r.messages[0].at.toDateString(), now.toDateString());
  assert.equal(r.messages[1].at.getMonth(), 8); assert.equal(r.messages[1].at.getDate(), 18);
  assert.equal(r.participant, "Jane Doe");
});
await test("touches are stable across re-parse (idempotent ids)", () => {
  const a = linkedinTouches(parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now }), "skyler-scarlett");
  const b = linkedinTouches(parseLinkedinConversation(SAMPLE, { ownerName: "Praveen Tyagi", now }), "skyler-scarlett");
  assert.deepEqual(a.map((t) => t.externalId), b.map((t) => t.externalId));
  assert.ok(a[0].externalId.startsWith("li:"));
  assert.equal(a[0].channel, "linkedin"); assert.equal(a[0].origin, "linkedin_paste");
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run to verify fail** — "Cannot find module".

- [ ] **Step 3: Implement linkedin-paste.ts**

```ts
import { createHash } from "node:crypto";
import type { IncomingTouch } from "./touches";

export interface ParsedLinkedin {
  participant: string;
  messages: { from: string; at: Date; body: string; outbound: boolean }[];
}

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const HEADER_LONG = /^(.+?) sent the following messages? at (\d{1,2}:\d{2}\s?[AP]M)\s*$/i;
const HEADER_SHORT = /^(.+?)\s{2,}(\d{1,2}:\d{2}\s?[AP]M)\s*$/i;
const VIEW_PROFILE = /^View .+?[’']s profile/i;
const EMOJI_ONLY = /^[\p{Extended_Pictographic}\p{Emoji_Presentation}\s️]+$/u;
const NOISE = /^(1st degree connection|· ?1st|Message|Save in Sales Navigator|More)$/i;

function resolveDay(marker: string, now: Date): Date | null {
  const m = marker.trim().toLowerCase();
  const d = new Date(now); d.setHours(0, 0, 0, 0);
  if (m === "today") return d;
  if (m === "yesterday") { d.setDate(d.getDate() - 1); return d; }
  const wd = WEEKDAYS.indexOf(m);
  if (wd !== -1) { const diff = (d.getDay() - wd + 7) % 7 || 7; d.setDate(d.getDate() - diff); return d; }
  const md = m.match(/^([a-z]{3})[a-z]*\.? (\d{1,2})(?:,? (\d{4}))?$/);
  if (md && MONTHS.includes(md[1])) {
    const y = md[3] ? Number(md[3]) : now.getFullYear();
    const cand = new Date(y, MONTHS.indexOf(md[1]), Number(md[2]));
    if (!md[3] && cand > now) cand.setFullYear(y - 1);
    return cand;
  }
  return null;
}

function withTime(day: Date, hhmm: string): Date {
  const m = hhmm.match(/(\d{1,2}):(\d{2})\s?([AP]M)/i)!;
  let h = Number(m[1]) % 12; if (m[3].toUpperCase() === "PM") h += 12;
  const d = new Date(day); d.setHours(h, Number(m[2]), 0, 0); return d;
}

export function parseLinkedinConversation(text: string, opts: { ownerName: string; now?: Date }): ParsedLinkedin {
  const now = opts.now ?? new Date();
  const owner = opts.ownerName.trim().toLowerCase();
  const lines = text.replace(/\r/g, "").split("\n");
  let day = new Date(now); day.setHours(0, 0, 0, 0);
  const messages: ParsedLinkedin["messages"] = [];
  let cur: { from: string; at: Date; lines: string[] } | null = null;
  let pendingHeader: { from: string; time: string } | null = null;

  const flush = () => {
    if (!cur) return;
    const body = cur.lines.map((l) => l.trimEnd()).filter((l) => !EMOJI_ONLY.test(l) || l.trim() === "")
      .join("\n").replace(/\n{3,}/g, "\n\n").trim();
    if (body) messages.push({ from: cur.from, at: cur.at, body, outbound: cur.from.toLowerCase() === owner });
    cur = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    const dayHit = resolveDay(line, now);
    if (dayHit && line.length <= 20) { day = dayHit; continue; }
    const long = line.match(HEADER_LONG);
    if (long) { flush(); pendingHeader = { from: long[1].trim(), time: long[2] }; continue; }
    if (VIEW_PROFILE.test(line)) continue;
    const short = raw.match(HEADER_SHORT);
    if (short && (!pendingHeader || short[1].trim() === pendingHeader.from)) {
      flush(); cur = { from: short[1].trim(), at: withTime(day, short[2]), lines: [] }; pendingHeader = null; continue;
    }
    if (pendingHeader) { cur = { from: pendingHeader.from, at: withTime(day, pendingHeader.time), lines: [] }; pendingHeader = null; }
    if (!cur) continue; // profile header noise before the first message
    if (NOISE.test(line)) continue;
    cur.lines.push(raw);
  }
  flush();

  const participant = messages.find((m) => !m.outbound)?.from
    ?? lines.map((l) => l.trim()).find((l) => l && l.toLowerCase() !== owner && !NOISE.test(l)) ?? "";
  return { participant, messages };
}

export function linkedinTouches(parsed: ParsedLinkedin, conversationKey: string, origin: "linkedin_paste" | "linkedin_archive" = "linkedin_paste"): IncomingTouch[] {
  return parsed.messages.map((m) => {
    const minute = new Date(m.at); minute.setSeconds(0, 0);
    const id = createHash("sha1").update(`${conversationKey}|${minute.toISOString()}|${m.body}`).digest("hex").slice(0, 24);
    return {
      at: m.at, channel: "linkedin", direction: m.outbound ? "outbound" : "inbound",
      summary: `${m.outbound ? "Sent" : "Received"} (LinkedIn): ${m.body.slice(0, 140).replace(/\s+/g, " ")}`,
      body: m.body, from: m.from, to: m.outbound ? parsed.participant : "me",
      externalId: `li:${id}`, origin,
    };
  });
}
```

- [ ] **Step 4: Run tests** — PASS. Script `"test:crm-linkedin": "npx tsx src/lib/crm/linkedin-paste.test.ts"`.

- [ ] **Step 5: Route**

`src/app/api/admin/outreach/ingest/linkedin/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { PRODUCTS } from "@/lib/outreach/enums";
import { parseLinkedinConversation, linkedinTouches } from "@/lib/crm/linkedin-paste";
import { normalizeLinkedinUrl } from "@/lib/crm/identity";
import { upsertLeadWithTouches } from "@/lib/crm/upsert-lead";

const bodySchema = z.object({
  text: z.string().min(10).max(200_000),
  profileUrl: z.string().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  product: z.enum(PRODUCTS).optional(),
  dryRun: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const b = parsed.data;
  const owner = process.env.LINKEDIN_OWNER_NAME || "Praveen Tyagi";
  const conv = parseLinkedinConversation(b.text, { ownerName: owner });
  const participant = b.name?.trim() || conv.participant;
  if (!participant || conv.messages.length === 0) {
    return NextResponse.json({ error: "Could not find any messages in the pasted text", participant, messages: [] }, { status: 422 });
  }
  const li = b.profileUrl ? normalizeLinkedinUrl(b.profileUrl) : "";
  const key = li || participant.toLowerCase().replace(/\s+/g, "-");
  const touches = linkedinTouches({ ...conv, participant }, key);
  if (b.dryRun) return NextResponse.json({ participant, messages: conv.messages });
  const r = await upsertLeadWithTouches({
    identity: { linkedinUrl: li || undefined, name: participant, company: b.company },
    touches, source: "linkedin:paste", product: b.product, linkedinConversationId: key,
  });
  return NextResponse.json({ participant, messages: conv.messages, ...r });
}
```

- [ ] **Step 6: Import page + bookmarklet**

`src/app/admin/outreach/linkedin-import/page.tsx`:

```tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LinkedinImport from "./LinkedinImport";

export const dynamic = "force-dynamic";

export default async function LinkedinImportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return <LinkedinImport />;
}
```

`src/app/admin/outreach/linkedin-import/LinkedinImport.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/outreach/enums";

interface Preview { participant: string; messages: { from: string; at: string; body: string; outbound: boolean }[] }

// The bookmarklet runs on linkedin.com and cannot POST here (cross-site
// cookies). It opens this page with the payload in the URL fragment, which
// never leaves the browser, and this page — same origin, admin session —
// does the POST.
const BOOKMARKLET = `javascript:(function(){var l=document.querySelector('.msg-s-message-list-content')||document.querySelector('.msg-s-message-list')||document.body;var a=document.querySelector('a.msg-thread__link-to-profile')||document.querySelector('.msg-entity-lockup__entity-title a');var n=(document.querySelector('.msg-entity-lockup__entity-title')||{}).innerText||'';var p={text:l.innerText,profileUrl:a?a.href:'',name:n.trim()};var s=btoa(unescape(encodeURIComponent(JSON.stringify(p)))).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');window.open('${typeof window !== "undefined" ? window.location.origin : ""}/admin/outreach/linkedin-import#'+s,'_blank');})();`;

function decodeHash(): { text: string; profileUrl: string; name: string } | null {
  try {
    const h = window.location.hash.slice(1);
    if (!h) return null;
    const b64 = h.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch { return null; }
}

export default function LinkedinImport() {
  const [text, setText] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState<string>("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = decodeHash();
    if (p) { setText(p.text); setProfileUrl(p.profileUrl); setName(p.name); window.history.replaceState({}, "", window.location.pathname); }
  }, []);

  const post = async (dryRun: boolean) => {
    setBusy(true); setResult(null);
    try {
      const res = await fetch("/api/admin/outreach/ingest/linkedin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, profileUrl: profileUrl || undefined, name: name || undefined, company: company || undefined, product: product || undefined, dryRun }),
      });
      const data = await res.json();
      if (!res.ok) { setResult(data.error || "Failed"); return; }
      setPreview({ participant: data.participant, messages: data.messages });
      if (!dryRun) setResult(`${data.created ? "Created" : "Updated"} lead ${data.leadId} (+${data.added} touches)`);
    } finally { setBusy(false); }
  };

  const bookmarklet = useMemo(() => BOOKMARKLET, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">LinkedIn conversation import</h1>
        <Link href="/admin/outreach" className="text-sm text-primary-600">← Outreach console</Link>
      </div>
      <p className="text-sm text-gray-600">
        Drag this to your bookmarks bar, open a LinkedIn conversation, click it:&nbsp;
        <a href={bookmarklet} className="rounded bg-gray-900 px-2 py-1 text-xs font-semibold text-white" onClick={(e) => e.preventDefault()}>Evelyn CRM ⇪</a>
        &nbsp;Or paste the conversation below.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Profile URL" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} />
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Name (auto-detected if blank)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
        <select className="rounded-lg border px-3 py-2 text-sm" value={product} onChange={(e) => setProduct(e.target.value)}>
          <option value="">Product (optional)</option>
          {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <textarea className="h-64 w-full rounded-lg border p-3 font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the LinkedIn conversation here" />
      <div className="flex gap-2">
        <button disabled={busy || !text} onClick={() => post(true)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium disabled:opacity-50">Preview</button>
        <button disabled={busy || !preview} onClick={() => post(false)} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Import</button>
        {result && <span className="self-center text-sm text-gray-700">{result}</span>}
      </div>
      {preview && (
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="mb-2 text-sm font-semibold">{preview.participant} · {preview.messages.length} messages</div>
          <ul className="space-y-2">
            {preview.messages.map((m, i) => (
              <li key={i} className={`rounded-lg p-3 text-sm ${m.outbound ? "bg-blue-50" : "bg-gray-50"}`}>
                <div className="mb-1 text-xs text-gray-500">{m.outbound ? "You" : m.from} · {new Date(m.at).toLocaleString()}</div>
                <div className="whitespace-pre-wrap">{m.body}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Manual check** — open `/admin/outreach/linkedin-import`, paste the Skyler sample from the test, Preview → 4 messages, Import → "Created lead …". Import again → `+0 touches`. Drag the bookmarklet to Chrome, open any LinkedIn thread, click → new tab lands on the page with text prefilled.

- [ ] **Step 8: Commit**

```bash
git add src/lib/crm/linkedin-paste.ts src/lib/crm/linkedin-paste.test.ts src/app/api/admin/outreach/ingest/linkedin src/app/admin/outreach/linkedin-import package.json
git commit -m "feat(crm): LinkedIn conversation parser, import route, bookmarklet page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: LinkedIn archive import (spec §9b)

**Files:**
- Create: `src/lib/crm/csv.ts` (+ test), `src/lib/crm/linkedin-archive.ts` (+ test), `src/app/api/admin/outreach/ingest/linkedin-archive/route.ts`

**Interfaces:**
- Produces: `parseCsv(text: string): string[][]` (RFC 4180: quoted fields, doubled quotes, embedded newlines); `parseArchive(args: { messagesCsv: string; connectionsCsv?: string; ownerProfileUrl: string }): ArchiveConversation[]` where `ArchiveConversation = { conversationId: string; participant: { name: string; profileUrl: string; company?: string; title?: string }; messages: { from: string; at: Date; body: string; outbound: boolean }[] }` — only conversations with ≥1 owner message, non-draft, folder INBOX (or no folder column).
- Route: `POST /api/admin/outreach/ingest/linkedin-archive` multipart (`messages`, `connections` optional, `dryRun` "1"/"0") → `{ conversations: number; imported: number; created: number; touchesAdded: number; skippedNoOwnerMessage: number; sample: string[] }`.

- [ ] **Step 1: Failing tests**

`src/lib/crm/csv.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { parseCsv } from "./csv";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
(async () => {
await test("simple rows", () => assert.deepEqual(parseCsv("a,b\n1,2\n"), [["a", "b"], ["1", "2"]]));
await test("quoted commas, doubled quotes, embedded newline, CRLF", () => {
  assert.deepEqual(parseCsv('h1,h2\r\n"x, y","say ""hi""\nline2"\r\n'), [["h1", "h2"], ["x, y", 'say "hi"\nline2']]);
});
await test("trailing empty field", () => assert.deepEqual(parseCsv("a,b,\n"), [["a", "b", ""]]));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

`src/lib/crm/linkedin-archive.test.ts`:

```ts
import { strict as assert } from "node:assert";
import { parseArchive } from "./linkedin-archive";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
const OWNER = "https://www.linkedin.com/in/praveentyagi";
const MESSAGES = `CONVERSATION ID,CONVERSATION TITLE,FROM,SENDER PROFILE URL,TO,RECIPIENT PROFILE URLS,DATE,SUBJECT,CONTENT,FOLDER,IS MESSAGE DRAFT,IS CONVERSATION ARCHIVED
c1,,Praveen Tyagi,${OWNER},Skyler Scarlett,https://www.linkedin.com/in/skylerscarlett,2026-09-19 13:28:00 UTC,,"Hi Skyler, I run Evelyn Learning.",INBOX,No,No
c1,,Skyler Scarlett,https://www.linkedin.com/in/skylerscarlett,Praveen Tyagi,${OWNER},2026-09-19 14:22:00 UTC,,Very cool,INBOX,No,No
c2,,Some Recruiter,https://www.linkedin.com/in/recruiter,Praveen Tyagi,${OWNER},2026-09-01 10:00:00 UTC,,We have a role,INBOX,No,No
c3,,Praveen Tyagi,${OWNER},Jane Doe,https://www.linkedin.com/in/janedoe,2026-08-01 10:00:00 UTC,,draft text,INBOX,Yes,No
`;
const CONNECTIONS = `Notes:\n"When exporting your connection data, you may notice..."\n\nFirst Name,Last Name,URL,Email Address,Company,Position,Connected On\nSkyler,Scarlett,https://www.linkedin.com/in/skylerscarlett,,GameClass,Founder | CEO,18 Sep 2026\n`;
(async () => {
await test("keeps only conversations with an owner-sent, non-draft message", () => {
  const convs = parseArchive({ messagesCsv: MESSAGES, connectionsCsv: CONNECTIONS, ownerProfileUrl: OWNER });
  assert.deepEqual(convs.map((c) => c.conversationId), ["c1"]);
});
await test("messages ordered, directions set, participant enriched from Connections", () => {
  const c = parseArchive({ messagesCsv: MESSAGES, connectionsCsv: CONNECTIONS, ownerProfileUrl: OWNER })[0];
  assert.deepEqual(c.messages.map((m) => m.outbound), [true, false]);
  assert.equal(c.messages[0].at.toISOString(), "2026-09-19T13:28:00.000Z");
  assert.equal(c.participant.name, "Skyler Scarlett");
  assert.equal(c.participant.profileUrl, "https://www.linkedin.com/in/skylerscarlett");
  assert.equal(c.participant.company, "GameClass");
  assert.equal(c.participant.title, "Founder | CEO");
});
await test("works without a Connections file", () => {
  const c = parseArchive({ messagesCsv: MESSAGES, ownerProfileUrl: OWNER })[0];
  assert.equal(c.participant.company, undefined);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
```

- [ ] **Step 2: Run to verify fail** — both "Cannot find module".

- [ ] **Step 3: Implement csv.ts**

```ts
/** Minimal RFC 4180 parser: handles quoted fields, doubled quotes, embedded newlines, CRLF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
      continue;
    }
    if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = ""; rows.push(row); row = [];
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
```

- [ ] **Step 4: Implement linkedin-archive.ts**

```ts
import { parseCsv } from "./csv";
import { normalizeLinkedinUrl } from "./identity";

export interface ArchiveConversation {
  conversationId: string;
  participant: { name: string; profileUrl: string; company?: string; title?: string };
  messages: { from: string; at: Date; body: string; outbound: boolean }[];
}

function headerIndex(header: string[]): Record<string, number> {
  const idx: Record<string, number> = {};
  header.forEach((h, i) => { idx[h.trim().toUpperCase()] = i; });
  return idx;
}

/** LinkedIn's Connections.csv starts with a "Notes:" preamble; the real header is the first row containing "First Name". */
function parseConnections(csv?: string): Map<string, { company?: string; title?: string }> {
  const map = new Map<string, { company?: string; title?: string }>();
  if (!csv) return map;
  const rows = parseCsv(csv);
  const hi = rows.findIndex((r) => r.some((c) => c.trim().toLowerCase() === "first name"));
  if (hi === -1) return map;
  const idx = headerIndex(rows[hi]);
  for (const r of rows.slice(hi + 1)) {
    const url = normalizeLinkedinUrl(r[idx["URL"]] ?? "");
    if (!url) continue;
    map.set(url, { company: r[idx["COMPANY"]] || undefined, title: r[idx["POSITION"]] || undefined });
  }
  return map;
}

export function parseArchive(args: { messagesCsv: string; connectionsCsv?: string; ownerProfileUrl: string }): ArchiveConversation[] {
  const owner = normalizeLinkedinUrl(args.ownerProfileUrl);
  const rows = parseCsv(args.messagesCsv);
  if (rows.length < 2) return [];
  const idx = headerIndex(rows[0]);
  const conns = parseConnections(args.connectionsCsv);
  const byConv = new Map<string, ArchiveConversation>();

  for (const r of rows.slice(1)) {
    if (r.length < 5) continue;
    const id = r[idx["CONVERSATION ID"]];
    const folder = idx["FOLDER"] !== undefined ? r[idx["FOLDER"]].trim().toUpperCase() : "INBOX";
    const isDraft = idx["IS MESSAGE DRAFT"] !== undefined && /^yes$/i.test(r[idx["IS MESSAGE DRAFT"]]);
    if (!id || folder !== "INBOX" || isDraft) continue;
    const senderUrl = normalizeLinkedinUrl(r[idx["SENDER PROFILE URL"]] ?? "");
    const outbound = senderUrl === owner;
    const body = (r[idx["CONTENT"]] ?? "").trim();
    if (!body) continue;
    const at = new Date((r[idx["DATE"]] ?? "").replace(" UTC", "Z").replace(" ", "T"));
    if (Number.isNaN(at.getTime())) continue;

    let conv = byConv.get(id);
    if (!conv) {
      const pUrl = outbound ? normalizeLinkedinUrl((r[idx["RECIPIENT PROFILE URLS"]] ?? "").split(",")[0]) : senderUrl;
      const pName = outbound ? (r[idx["TO"]] ?? "").split(",")[0].trim() : (r[idx["FROM"]] ?? "").trim();
      const extra = conns.get(pUrl) ?? {};
      conv = { conversationId: id, participant: { name: pName, profileUrl: pUrl, ...extra }, messages: [] };
      byConv.set(id, conv);
    }
    conv.messages.push({ from: (r[idx["FROM"]] ?? "").trim(), at, body, outbound });
  }

  return [...byConv.values()]
    .filter((c) => c.messages.some((m) => m.outbound))
    .map((c) => ({ ...c, messages: c.messages.sort((a, b) => a.at.getTime() - b.at.getTime()) }));
}
```

- [ ] **Step 5: Run tests** — PASS. Script `"test:crm-archive": "npx tsx src/lib/crm/csv.test.ts && npx tsx src/lib/crm/linkedin-archive.test.ts"`.

- [ ] **Step 6: Route**

`src/app/api/admin/outreach/ingest/linkedin-archive/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseArchive } from "@/lib/crm/linkedin-archive";
import { linkedinTouches } from "@/lib/crm/linkedin-paste";
import { upsertLeadWithTouches } from "@/lib/crm/upsert-lead";

export const maxDuration = 300;

// POST multipart: messages (csv, required), connections (csv, optional), dryRun ("1" default).
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const owner = process.env.LINKEDIN_OWNER_PROFILE_URL;
  if (!owner) return NextResponse.json({ error: "LINKEDIN_OWNER_PROFILE_URL not set" }, { status: 500 });
  const form = await request.formData();
  const messages = form.get("messages");
  if (!(messages instanceof File)) return NextResponse.json({ error: "messages file required" }, { status: 400 });
  const connections = form.get("connections");
  const dryRun = (form.get("dryRun") ?? "1") !== "0";

  const convs = parseArchive({
    messagesCsv: await messages.text(),
    connectionsCsv: connections instanceof File ? await connections.text() : undefined,
    ownerProfileUrl: owner,
  });
  const out = { conversations: convs.length, imported: 0, created: 0, touchesAdded: 0, sample: convs.slice(0, 20).map((c) => `${c.participant.name} (${c.messages.length})`) };
  if (dryRun) return NextResponse.json(out);

  for (const c of convs) {
    const key = c.participant.profileUrl || c.conversationId;
    const touches = linkedinTouches({ participant: c.participant.name, messages: c.messages }, key, "linkedin_archive");
    const r = await upsertLeadWithTouches({
      identity: { linkedinUrl: c.participant.profileUrl || undefined, name: c.participant.name, company: c.participant.company, title: c.participant.title },
      touches, source: "linkedin:archive", linkedinConversationId: c.conversationId,
    });
    out.imported++; if (r.created) out.created++; out.touchesAdded += r.added;
  }
  return NextResponse.json(out);
}
```

- [ ] **Step 7: Manual check** — `curl -b "$ADMIN_COOKIE" -F messages=@messages.csv -F connections=@Connections.csv -F dryRun=1 http://localhost:3000/api/admin/outreach/ingest/linkedin-archive` → counts; run with `dryRun=0` twice → second run `touchesAdded: 0`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/crm/csv.ts src/lib/crm/csv.test.ts src/lib/crm/linkedin-archive.ts src/lib/crm/linkedin-archive.test.ts src/app/api/admin/outreach/ingest/linkedin-archive package.json
git commit -m "feat(crm): LinkedIn data-archive import (messages.csv + Connections.csv)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Pipeline config API + setOpportunity action

**Files:**
- Create: `src/app/api/admin/outreach/pipelines/route.ts`
- Modify: `src/app/api/admin/outreach/leads/[id]/route.ts`

**Interfaces:**
- `GET /api/admin/outreach/pipelines` → `{ pipelines: { product, stages }[] }` (one entry per `PRODUCTS`, defaults filled in).
- `PUT /api/admin/outreach/pipelines` body `{ product, stages: string[] }` → upsert.
- Lead PATCH `action: "setOpportunity"`, `opportunity: { product, stage, notes?, nextActionAt? }` → validates `stage ∈ config.stages`; upserts the entry.

- [ ] **Step 1: pipelines route**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { PipelineConfig, DEFAULT_STAGES, type IPipelineConfig } from "@/models";
import { PRODUCTS } from "@/lib/outreach/enums";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const docs = await PipelineConfig.find({}).lean<IPipelineConfig[]>();
  const by = new Map(docs.map((d) => [d.product, d.stages]));
  return NextResponse.json({ pipelines: PRODUCTS.map((p) => ({ product: p, stages: by.get(p) ?? DEFAULT_STAGES })) });
}

const putSchema = z.object({ product: z.enum(PRODUCTS), stages: z.array(z.string().min(1).max(40)).min(1).max(20) });

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = putSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  await connectDB();
  const doc = await PipelineConfig.findOneAndUpdate(
    { product: parsed.data.product }, { $set: { stages: parsed.data.stages } }, { upsert: true, new: true }
  ).lean<IPipelineConfig>();
  return NextResponse.json({ product: doc!.product, stages: doc!.stages });
}
```

- [ ] **Step 2: setOpportunity action**

In `src/app/api/admin/outreach/leads/[id]/route.ts` add imports `import { PipelineConfig, DEFAULT_STAGES, type IPipelineConfig } from "@/models"; import { PRODUCTS, type Product } from "@/lib/outreach/enums";` and a new `case` in the switch (before `default`):

```ts
      case "setOpportunity": {
        const opp = body?.opportunity as { product?: string; stage?: string; notes?: string; nextActionAt?: string | null } | undefined;
        if (!opp || !PRODUCTS.includes(opp.product as Product) || !opp.stage) {
          return NextResponse.json({ error: "opportunity.product and opportunity.stage are required" }, { status: 400 });
        }
        const cfg = await PipelineConfig.findOne({ product: opp.product }).lean<IPipelineConfig>();
        const stages = cfg?.stages ?? DEFAULT_STAGES;
        if (!stages.includes(opp.stage)) {
          return NextResponse.json({ error: `stage must be one of: ${stages.join(", ")}` }, { status: 400 });
        }
        const now = new Date();
        const existing = lead.opportunities.find((o) => o.product === opp.product);
        if (existing) {
          existing.stage = opp.stage; existing.updatedAt = now;
          if (opp.notes !== undefined) existing.notes = opp.notes;
          if (opp.nextActionAt !== undefined) existing.nextActionAt = opp.nextActionAt ? new Date(opp.nextActionAt) : null;
        } else {
          lead.opportunities.push({ product: opp.product as Product, stage: opp.stage, notes: opp.notes, nextActionAt: opp.nextActionAt ? new Date(opp.nextActionAt) : null, updatedAt: now });
        }
        break;
      }
```

- [ ] **Step 3: Manual check** — `curl -X PUT …/pipelines -d '{"product":"white_label","stages":["inquiry","call","sandbox","contract","live","dead"]}'`; then PATCH a lead with `{"action":"setOpportunity","opportunity":{"product":"white_label","stage":"sandbox"}}` → 200; with stage `"banana"` → 400 listing stages.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/outreach/pipelines 'src/app/api/admin/outreach/leads/[id]/route.ts'
git commit -m "feat(crm): per-product pipeline config API and setOpportunity action

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Console UI — product filter, timeline drawer, Import tab

**Files:**
- Create: `src/app/admin/outreach/TimelineDrawer.tsx`, `src/app/admin/outreach/ImportTab.tsx`
- Modify: `src/app/admin/outreach/OutreachConsole.tsx`, `src/app/admin/outreach/PipelineTab.tsx`

- [ ] **Step 1: Extend `LeadJSON`** in `OutreachConsole.tsx`

Add to `LeadTouch`: `subject?: string; body?: string; from?: string; to?: string; externalId?: string; account?: string; origin?: string;`. Add to `LeadJSON`: `emails: string[]; opportunities: { product: Product; stage: string; nextActionAt?: string | null; notes?: string; updatedAt: string }[]; needsReview: boolean;` (import `Product` type from enums). Extend `TabKey` with `"import"` and add `{ key: "import", label: "Import" }` to `tabs`; render `{tab === "import" && <ImportTab gmailStatus={gmailStatus} onImported={refresh} />}`. Extend `GmailStatus` with `accounts?: { account: string; connected: boolean; connectedAt: string | null }[]`.

- [ ] **Step 2: TimelineDrawer.tsx**

```tsx
"use client";

import { X } from "lucide-react";
import type { LeadJSON } from "./OutreachConsole";

export default function TimelineDrawer({ lead, onClose }: { lead: LeadJSON; onClose: () => void }) {
  const touches = [...lead.touches].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{lead.company}</h2>
            <p className="text-sm text-gray-600">{lead.decisionMaker?.name}{lead.decisionMaker?.title ? ` · ${lead.decisionMaker.title}` : ""}</p>
            <p className="text-xs text-gray-500">{lead.emails.join(", ")}{lead.decisionMaker?.linkedinUrl ? ` · ${lead.decisionMaker.linkedinUrl}` : ""}</p>
            {lead.opportunities.length > 0 && (
              <p className="mt-1 text-xs text-gray-600">{lead.opportunities.map((o) => `${o.product}: ${o.stage}`).join(" · ")}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
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

- [ ] **Step 3: PipelineTab changes**

1. Imports: add `PRODUCTS` from enums, `useState` already; `import TimelineDrawer from "./TimelineDrawer";`.
2. State: `const [productFilter, setProductFilter] = useState<string>("all"); const [openId, setOpenId] = useState<string | null>(null);`
3. Filter: inside `filtered`, add `if (productFilter !== "all" && !l.opportunities?.some((o) => o.product === productFilter)) return false;` and to the deps array.
4. Add a Product `<select>` next to Segment:

```tsx
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Product
          <select className="rounded-lg border border-gray-300 px-2 py-1 text-sm" value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
            <option value="all">All</option>
            {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
```

5. Add a `"Products"` header after `"Status"` and, in the row, after the status cell:

```tsx
                    <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-600">
                      {lead.opportunities?.length ? lead.opportunities.map((o) => `${o.product}: ${o.stage}`).join(", ") : "—"}
                    </td>
```

Bump the empty-state `colSpan` to `10`.

6. Make the company cell a button: `<button className="text-left font-medium text-primary-700 hover:underline" onClick={() => setOpenId(lead._id)}>{lead.company}</button>` and render at the end of the component: `{openId && (() => { const l = leads.find((x) => x._id === openId); return l ? <TimelineDrawer lead={l} onClose={() => setOpenId(null)} /> : null; })()}`.

- [ ] **Step 4: ImportTab.tsx**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface GmailStatus { accounts?: { account: string; connected: boolean; connectedAt: string | null }[] }
interface PageResult { nextPageToken?: string; scanned: number; kept: number; created: number; updated: number; touchesAdded: number; skipped: Record<string, number>; samples: { threadId: string; subject: string; participant: string; verdict: string }[] }

export default function ImportTab({ gmailStatus, onImported }: { gmailStatus: GmailStatus | null; onImported: () => Promise<void> }) {
  const accounts = gmailStatus?.accounts ?? [];
  const [account, setAccount] = useState(accounts[0]?.account ?? "");
  const [days, setDays] = useState(365);
  const [running, setRunning] = useState<"idle" | "dry" | "real">("idle");
  const [totals, setTotals] = useState<PageResult | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [archiveMsg, setArchiveMsg] = useState<string | null>(null);

  const run = async (dryRun: boolean) => {
    setRunning(dryRun ? "dry" : "real"); setLog([]);
    const acc: PageResult = { scanned: 0, kept: 0, created: 0, updated: 0, touchesAdded: 0, skipped: {}, samples: [] };
    let pageToken: string | undefined;
    try {
      do {
        const res = await fetch("/api/admin/outreach/ingest/gmail", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account, days, pageToken, dryRun }),
        });
        const data = await res.json();
        if (!res.ok) { setLog((l) => [...l, `Error: ${data.error}`]); break; }
        const p = data as PageResult;
        acc.scanned += p.scanned; acc.kept += p.kept; acc.created += p.created; acc.updated += p.updated; acc.touchesAdded += p.touchesAdded;
        for (const [k, v] of Object.entries(p.skipped)) acc.skipped[k] = (acc.skipped[k] ?? 0) + v;
        if (acc.samples.length < 60) acc.samples.push(...p.samples);
        setTotals({ ...acc }); setLog((l) => [...l, `page: scanned ${p.scanned}, kept ${p.kept}`]);
        pageToken = p.nextPageToken;
      } while (pageToken);
      if (!dryRun) await onImported();
    } finally { setRunning("idle"); }
  };

  const uploadArchive = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setArchiveMsg("Uploading…");
    const res = await fetch("/api/admin/outreach/ingest/linkedin-archive", { method: "POST", body: fd });
    const data = await res.json();
    setArchiveMsg(res.ok ? JSON.stringify(data) : `Error: ${data.error}`);
    if (res.ok && fd.get("dryRun") === "0") await onImported();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Gmail sent-folder import</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <select className="rounded-lg border px-2 py-1" value={account} onChange={(e) => setAccount(e.target.value)}>
            {accounts.map((a) => <option key={a.account} value={a.account} disabled={!a.connected}>{a.account}{a.connected ? "" : " (not connected)"}</option>)}
          </select>
          <label>Days <input type="number" className="w-20 rounded-lg border px-2 py-1" value={days} min={1} max={3650} onChange={(e) => setDays(Number(e.target.value))} /></label>
          <button disabled={running !== "idle" || !account} onClick={() => run(true)} className="rounded-lg bg-gray-100 px-3 py-1 font-medium disabled:opacity-50">Dry run</button>
          <button disabled={running !== "idle" || !totals} onClick={() => run(false)} className="rounded-lg bg-primary-600 px-3 py-1 font-medium text-white disabled:opacity-50">Import for real</button>
          {accounts.some((a) => !a.connected) && (
            <a className="text-primary-600 underline" href={`/api/admin/outreach/gmail/auth?account=${accounts.find((a) => !a.connected)?.account}`}>Connect {accounts.find((a) => !a.connected)?.account}</a>
          )}
        </div>
        {totals && (
          <div className="mt-3 text-sm">
            <div>scanned {totals.scanned} · kept {totals.kept} · created {totals.created} · updated {totals.updated} · touches {totals.touchesAdded}</div>
            <div className="text-xs text-gray-600">skipped: {Object.entries(totals.skipped).map(([k, v]) => `${k} ${v}`).join(" · ") || "none"}</div>
            <ul className="mt-2 max-h-64 overflow-y-auto text-xs">
              {totals.samples.map((s) => <li key={s.threadId} className="border-b py-1"><span className="font-mono">{s.verdict}</span> — {s.subject || "(no subject)"} {s.participant && `· ${s.participant}`}</li>)}
            </ul>
          </div>
        )}
        {log.length > 0 && <pre className="mt-2 max-h-32 overflow-y-auto rounded bg-gray-50 p-2 text-xs">{log.join("\n")}</pre>}
        <p className="mt-2 text-xs text-gray-500">Ongoing: label any thread <code>CRM</code> in Gmail; the watcher imports it within 15 minutes.</p>
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">LinkedIn</h3>
        <p className="text-sm">Same-day: <Link href="/admin/outreach/linkedin-import" className="text-primary-600 underline">conversation import page + bookmarklet</Link>.</p>
        <form onSubmit={uploadArchive} className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <label>messages.csv <input type="file" name="messages" accept=".csv" required /></label>
          <label>Connections.csv <input type="file" name="connections" accept=".csv" /></label>
          <select name="dryRun" className="rounded-lg border px-2 py-1" defaultValue="1"><option value="1">Dry run</option><option value="0">Import</option></select>
          <button className="rounded-lg bg-primary-600 px-3 py-1 font-medium text-white">Upload archive</button>
        </form>
        {archiveMsg && <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs">{archiveMsg}</pre>}
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Build + manual check**

Run: `npm run build 2>&1 | tail -20` — Expected: no type errors. Then in the console: Pipeline shows the Product filter and Products column; clicking a company opens the drawer with bodies; Import tab dry-runs Gmail and shows counts; archive upload dry-run returns counts.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/outreach
git commit -m "feat(crm): product filter, timeline drawer, Import tab in the outreach console

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Backfill existing ContactSubmission rows (spec §10)

**Files:**
- Create: `scripts/crm-backfill-contact-submissions.ts`
- Modify: `package.json` (`"crm:backfill-contacts": "npx tsx scripts/crm-backfill-contact-submissions.ts"`)

- [x] **Step 1: Script**

```ts
// One-off: turn historical contact-form submissions into leads/touches.
// Dry-run unless --apply. Idempotent via externalId `form:<submissionId>`.
import { connectDB } from "@core/db";
import { ContactSubmission, type IContactSubmission } from "@/models";
import { classifyContact, productFromParam } from "@/lib/crm/classify-contact";
import { upsertLeadWithTouches } from "@/lib/crm/upsert-lead";

const apply = process.argv.includes("--apply");

(async () => {
  await connectDB();
  const subs = await ContactSubmission.find({}).sort({ createdAt: 1 }).lean<IContactSubmission[]>();
  let careers = 0, leads = 0, touches = 0;
  for (const s of subs) {
    const cls = classifyContact({ reason: s.reason, subject: s.subject ?? "", message: s.message });
    if (cls.isCareers) { careers++; continue; }
    if (!apply) { leads++; continue; }
    const r = await upsertLeadWithTouches({
      identity: { email: s.email, name: s.name, company: s.company }, source: "contact-form", product: productFromParam(s.product ?? null),
      touches: [{
        at: new Date(s.createdAt), channel: "form", direction: "inbound",
        summary: `Contact form (${cls.reason}): ${s.subject ?? ""}`.slice(0, 200),
        subject: s.subject, body: s.message, from: s.email, to: "info@evelynlearning.com",
        externalId: `form:${s._id}`, origin: "backfill",
      }],
    });
    leads++; touches += r.added;
  }
  console.log(`${apply ? "APPLIED" : "DRY RUN"}: submissions ${subs.length}, careers skipped ${careers}, leads touched ${leads}, touches added ${touches}`);
  process.exit(0);
})();
```

- [ ] **Step 2: Run** — `npm run crm:backfill-contacts` (dry) then `npm run crm:backfill-contacts -- --apply` on the local DB; second apply → `touches added 0`.

> Deferred to deploy-time verification (worktree env targets prod Mongo via tunnel).

- [x] **Step 3: Commit**

```bash
git add scripts/crm-backfill-contact-submissions.ts package.json
git commit -m "feat(crm): backfill script for historical contact submissions

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Aggregate test script, env docs, deploy notes

**Files:**
- Modify: `package.json`, `.env.example` (or the env doc the repo uses — check `ls apps/marketing/.env*`), `docs/superpowers/plans/2026-09-21-crm-unified-timeline.md` (this file: tick boxes)

- [x] **Step 1:** Add `"test:crm": "npm run test:crm-models && npm run test:crm-core && npm run test:crm-contact && npm run test:crm-gmail && npm run test:crm-gmail-classify && npm run test:crm-linkedin && npm run test:crm-archive"` and run it: all PASS.
- [x] **Step 2:** Document the three new env vars in the marketing env example with placeholder values (never real ones).
- [x] **Step 3:** Full `npm run build`. Expected clean.
- [x] **Step 4:** Commit `chore(crm): aggregate test script + env docs`.
- [ ] **Step 5 (deploy, separate approval):** merge to `main` → `./deploy-marketing.sh` (never `deploy-update.sh`); on prod set `GMAIL_OUTREACH_ACCOUNTS`, `LINKEDIN_OWNER_NAME`, `LINKEDIN_OWNER_PROFILE_URL`; visit `/api/admin/outreach/gmail/auth?account=info@evelynlearning.com` and consent; run Gmail dry-run for both accounts from the Import tab and review counts before the real run; run `crm:backfill-contacts -- --apply` on prod once.

---

## Self-review

**Spec coverage:** §1 touches → T1/T2; §2 opportunities + PipelineConfig → T1/T10/T11; §3 products → T1; §4 matching → T2/T3; §5 status effects → T2 (`applyIngestStatus`); §6 contact form → T4 + T12; §7 two mailboxes, sent-folder import, label cron → T5/T7; §8 skip rules → T6 (a–d skips, e flags review via `staged`+`needsReview`); §9a bookmarklet/paste → T8; §9b archive → T9; §10 legacy untouched + backfill → T12; §11 UI → T11. Acceptance items each map to a manual check step.

**Placeholder scan:** none of the banned phrases; every code step has code.

**Type consistency:** `IncomingTouch` (T2) is consumed by T3/T6/T8/T9 with `externalId` required; `upsertLeadWithTouches` signature is identical in T3/T4/T7/T8/T9/T12; `FullMessage` (T5) matches T6's test factory; `PageResult` in T11 mirrors `IngestPageResult` in T7; `LeadJSON.opportunities` (T11) mirrors `IOpportunity` (T1) with ISO strings.
