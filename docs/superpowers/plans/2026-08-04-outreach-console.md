# B2B Outreach Console (/admin/outreach) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Internal B2B outreach console at `/admin/outreach`: a `Lead` pipeline (staged → approved → contacted → replied/call_booked/parked/dead) with Gmail-draft sending, a 15-minute reply watcher over recorded thread IDs only, tracked `/d/[token]` demo links, a 4d/6d/auto-park follow-up cadence, and a JSON lead importer.

**Architecture:** New `Lead` Mongoose model (separate from the legacy `Prospect`/showcase-scraping pipeline, which stays untouched). One server-gated admin page with a three-tab client console backed by `/api/admin/outreach/*` routes. Gmail via googleapis OAuth for the single account praveen@evelynlearning.com, refresh token AES-encrypted with the existing `token-encryption.ts`, reply watcher as a `node-cron` job started from `instrumentation.ts` behind `ENABLE_OUTREACH_WATCHER` (mirrors `blog-scheduler.ts`).

**Tech Stack:** Next.js App Router (src/), Mongoose 8, next-auth v4 (`getServerSession(authOptions)`), googleapis (already a dep), node-cron (already a dep), Tailwind + lucide-react, house test harness (`npx tsx` + node:assert).

**Spec deviations (approved-pending):** three additions the frozen scope structurally requires — (1) `currentDraft` subdocument on Lead (the "drafted message with copy button" and the Gmail draft body have to live somewhere); (2) `demoVisits[{at, ua}]` embedded array on Lead (requirement 4 logs `{lead, ts, ua}` and shows last-visit; lead is the parent doc); (3) a tiny `OutreachToken` model holding the encrypted Gmail refresh token (single-account OAuth needs storage; the existing pattern stores tokens on `Teacher`, which doesn't apply here). Nothing else added.

## Global Constraints

- Segment enum, verbatim: `nursing_program | testprep_academy | homeschool_charter | microschool | school_district | private_school | intl_school | library | publisher | agency | corporate_ld | other`
- Status enum, verbatim: `staged | approved | contacted | replied | call_booked | parked | dead`
- Touch channels: `email | linkedin | form`
- Reply watcher polls ONLY thread IDs recorded in `lead.gmailThreadIds`. Never query or list the wider inbox.
- Gmail thread ID is recorded into `gmailThreadIds` at email **mark-sent** time (draft creation stores it on `currentDraft` only).
- Follow-up cadence (4-step, channel-aware sequence): [email intro] → +1d [linkedin note] → +3d [email bump] → +6d [email breakup] → parked. So mark-sent #1 → `nextActionAt = +1d`, #2 → `+3d`, #3 → `+6d`, #4 → `status = parked`, `nextActionAt = null`. 4 outbound touches max. `expectedNextChannel(touches)` derives the suggested channel from the outbound count (0→email, 1→linkedin, 2→email, 3→email, else null) and the Today tab shows it as a hint — but the step counter is channel-blind: marking any channel sent consumes the step (skipping LinkedIn just advances the sequence).
- Reply detected → `status = replied`, inbound touch logged, `nextActionAt = null`, thread stops being polled.
- Import script lands every lead as `status: "staged"` regardless of input.
- Every new admin page/API route adds its own `getServerSession(authOptions)` gate (the admin layout does NOT gate — see `src/app/admin/contacts/page.tsx:16-18` for the canonical pattern). `/d/[token]` is the only ungated route.
- Out of scope v1: sequence engine, open/click pixels, multi-user, dashboards, LinkedIn automation, inbound capture. Legacy `/admin/prospecting` + `Prospect` model untouched.
- Env vars added: `GMAIL_OUTREACH_CLIENT_ID`, `GMAIL_OUTREACH_CLIENT_SECRET`, `GMAIL_OUTREACH_CALLBACK_URL`, `GMAIL_OUTREACH_USER` (praveen@evelynlearning.com), `ENABLE_OUTREACH_WATCHER`. Reuses `TOKEN_ENCRYPTION_KEY`. Document all in `.env.local.example`.
- Verification: `npx tsc --noEmit` after every task; pure-logic tests via `npm run test:outreach` (house harness: `npx tsx`, `node:assert`, must end `failed: 0`).
- Commits: conventional style with scope, e.g. `feat(outreach): ...`.

---

### Task 1: Lead model

**Files:**
- Create: `src/models/Lead.ts`
- Modify: `src/models/index.ts` (add exports)
- Test: `src/models/Lead.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `Lead` model; types `ILead`, `ITouch`, `LeadSegment`, `LeadStatus`, `TouchChannel`; constant arrays `LEAD_SEGMENTS`, `LEAD_STATUSES`. All importable `from "@/models"`.

- [ ] **Step 1: Write the failing test** (`validateSync` works without a DB connection)

```ts
// src/models/Lead.test.ts
import { strict as assert } from "node:assert";
import { Lead } from "./Lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const base = {
  company: "Acme Nursing College",
  segment: "nursing_program",
  about: "200-student ADN program",
  whyFit: "NCLEX pass-rate pressure",
  useCaseHypothesis: "voice tutor for NCLEX drill",
  decisionMaker: { name: "Dana Smith", title: "Program Director", emailVerified: false },
  website: "https://acmenursing.edu",
  source: "claude-research-2026-08",
};

await test("valid staged lead passes validateSync", () => {
  const doc = new Lead({ ...base, status: "staged" });
  assert.equal(doc.validateSync(), undefined);
});
await test("status defaults to staged", () => {
  assert.equal(new Lead(base).status, "staged");
});
await test("bad segment rejected", () => {
  const err = new Lead({ ...base, segment: "hospital" }).validateSync();
  assert.ok(err?.errors["segment"]);
});
await test("bad status rejected", () => {
  const err = new Lead({ ...base, status: "won" }).validateSync();
  assert.ok(err?.errors["status"]);
});
await test("touch requires channel+direction", () => {
  const err = new Lead({ ...base, touches: [{ summary: "x" }] }).validateSync();
  assert.ok(err);
});

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/models/Lead.test.ts`
Expected: FAIL (module `./Lead` not found)

- [ ] **Step 3: Write the model**

```ts
// src/models/Lead.ts
import mongoose, { Schema, Document } from "mongoose";

export const LEAD_SEGMENTS = [
  "nursing_program", "testprep_academy", "homeschool_charter", "microschool",
  "school_district", "private_school", "intl_school", "library",
  "publisher", "agency", "corporate_ld", "other",
] as const;
export type LeadSegment = (typeof LEAD_SEGMENTS)[number];

export const LEAD_STATUSES = [
  "staged", "approved", "contacted", "replied", "call_booked", "parked", "dead",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const TOUCH_CHANNELS = ["email", "linkedin", "form"] as const;
export type TouchChannel = (typeof TOUCH_CHANNELS)[number];

export interface ITouch {
  at: Date;
  channel: TouchChannel;
  direction: "outbound" | "inbound";
  summary: string;
  gmailMessageId?: string;
}

export interface IDemoVisit {
  at: Date;
  ua: string;
}

export interface ICurrentDraft {
  channel: TouchChannel;
  subject?: string;
  body: string;
  gmailDraftId?: string;
  gmailThreadId?: string;
}

export interface ILead extends Document {
  company: string;
  segment: LeadSegment;
  about: string;
  whyFit: string;
  useCaseHypothesis: string;
  decisionMaker: {
    name: string;
    title: string;
    linkedinUrl?: string;
    email?: string;
    emailVerified: boolean;
  };
  website: string;
  source: string;
  status: LeadStatus;
  demoToken?: string;
  demoVisits: IDemoVisit[];
  gmailThreadIds: string[];
  nextActionAt?: Date | null;
  touches: ITouch[];
  currentDraft?: ICurrentDraft | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TouchSchema = new Schema<ITouch>(
  {
    at: { type: Date, required: true },
    channel: { type: String, enum: TOUCH_CHANNELS, required: true },
    direction: { type: String, enum: ["outbound", "inbound"], required: true },
    summary: { type: String, required: true },
    gmailMessageId: String,
  },
  { _id: false }
);

const LeadSchema = new Schema<ILead>(
  {
    company: { type: String, required: true, trim: true },
    segment: { type: String, enum: LEAD_SEGMENTS, required: true },
    about: { type: String, default: "" },
    whyFit: { type: String, default: "" },
    useCaseHypothesis: { type: String, default: "" },
    decisionMaker: {
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      linkedinUrl: String,
      email: String,
      emailVerified: { type: Boolean, default: false },
    },
    website: { type: String, default: "" },
    source: { type: String, default: "" },
    status: { type: String, enum: LEAD_STATUSES, default: "staged" },
    demoToken: { type: String },
    demoVisits: [{ at: { type: Date, required: true }, ua: { type: String, default: "" }, _id: false }],
    gmailThreadIds: { type: [String], default: [] },
    nextActionAt: { type: Date, default: null },
    touches: { type: [TouchSchema], default: [] },
    currentDraft: {
      type: {
        channel: { type: String, enum: TOUCH_CHANNELS, required: true },
        subject: String,
        body: { type: String, required: true },
        gmailDraftId: String,
        gmailThreadId: String,
      },
      default: null,
      _id: false,
    },
    notes: String,
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1, nextActionAt: 1 });
LeadSchema.index({ segment: 1, status: 1 });
LeadSchema.index({ demoToken: 1 }, { unique: true, sparse: true });
LeadSchema.index({ company: 1, "decisionMaker.email": 1 });

export const Lead =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
```

- [ ] **Step 4: Export from the barrel**

In `src/models/index.ts`, following the existing pattern, add:

```ts
export { Lead, LEAD_SEGMENTS, LEAD_STATUSES, TOUCH_CHANNELS } from "./Lead";
export type { ILead, ITouch, IDemoVisit, ICurrentDraft, LeadSegment, LeadStatus, TouchChannel } from "./Lead";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx tsx src/models/Lead.test.ts` → `passed: 5, failed: 0`
Run: `npx tsc --noEmit` → clean

- [ ] **Step 6: Register test + commit**

In `package.json` scripts add: `"test:outreach-model": "npx tsx src/models/Lead.test.ts"`.

```bash
git add src/models/Lead.ts src/models/Lead.test.ts src/models/index.ts package.json
git commit -m "feat(outreach): Lead model for B2B outreach pipeline"
```

---

### Task 2: Follow-up cadence + segment landing map (pure logic)

**Files:**
- Create: `src/lib/outreach/cadence.ts`
- Create: `src/lib/outreach/segment-landing.ts`
- Test: `src/lib/outreach/cadence.test.ts`

**Interfaces:**
- Consumes: `TouchChannel`, `LeadStatus`, `ITouch` from `@/models`.
- Produces:
  - `applyMarkSent(input: { status: LeadStatus; touches: ITouch[] }, channel: TouchChannel, summary: string, now: Date): { status: LeadStatus; nextActionAt: Date | null; touch: ITouch }`
  - `expectedNextChannel(touches: ITouch[]): TouchChannel | null` — outbound count 0→`"email"`, 1→`"linkedin"`, 2→`"email"`, 3→`"email"`, else `null`
  - `SEQUENCE_STEP_LABELS = ["Intro email", "LinkedIn note", "Email bump", "Breakup email"]` (Today-tab hint copy, indexed by outbound count)
  - `landingPathForSegment(segment: LeadSegment): string`
  - `FOLLOW_UP_DELAYS_DAYS = [1, 3, 6]`, `MAX_OUTBOUND_TOUCHES = 4`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/outreach/cadence.test.ts
import { strict as assert } from "node:assert";
import { applyMarkSent, expectedNextChannel } from "./cadence";
import { landingPathForSegment } from "./segment-landing";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const now = new Date("2026-08-04T17:00:00Z");
const days = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);
const out = (channel: "email" | "linkedin" | "form") =>
  ({ at: now, channel, direction: "outbound", summary: "x" } as const);
const inb = { at: now, channel: "email", direction: "inbound", summary: "reply" } as const;

await test("1st send (intro email): contacted, nextActionAt +1d", () => {
  const r = applyMarkSent({ status: "approved", touches: [] }, "email", "intro email", now);
  assert.equal(r.status, "contacted");
  assert.equal(r.nextActionAt?.getTime(), days(1).getTime());
  assert.equal(r.touch.direction, "outbound");
});
await test("2nd send: nextActionAt +3d", () => {
  const r = applyMarkSent({ status: "contacted", touches: [out("email")] }, "linkedin", "li note", now);
  assert.equal(r.status, "contacted");
  assert.equal(r.nextActionAt?.getTime(), days(3).getTime());
});
await test("3rd send: nextActionAt +6d", () => {
  const r = applyMarkSent({ status: "contacted", touches: [out("email"), out("linkedin")] }, "email", "bump", now);
  assert.equal(r.status, "contacted");
  assert.equal(r.nextActionAt?.getTime(), days(6).getTime());
});
await test("4th send: auto-park, nextActionAt cleared", () => {
  const touches = [out("email"), out("linkedin"), out("email")];
  const r = applyMarkSent({ status: "contacted", touches }, "email", "breakup", now);
  assert.equal(r.status, "parked");
  assert.equal(r.nextActionAt, null);
});
await test("counter is channel-blind: skipping LinkedIn still consumes the step", () => {
  const r = applyMarkSent({ status: "contacted", touches: [out("email")] }, "email", "bump instead of li", now);
  assert.equal(r.nextActionAt?.getTime(), days(3).getTime());
});
await test("inbound touches don't count toward the 4-touch cap", () => {
  const r = applyMarkSent({ status: "contacted", touches: [out("email"), inb] }, "linkedin", "y", now);
  assert.equal(r.status, "contacted");
  assert.equal(r.nextActionAt?.getTime(), days(3).getTime());
});
await test("expectedNextChannel follows the sequence by outbound count", () => {
  assert.equal(expectedNextChannel([]), "email");
  assert.equal(expectedNextChannel([out("email")]), "linkedin");
  assert.equal(expectedNextChannel([out("email"), out("linkedin")]), "email");
  assert.equal(expectedNextChannel([out("email"), out("linkedin"), out("email")]), "email");
  assert.equal(expectedNextChannel([out("email"), out("linkedin"), out("email"), out("email")]), null);
  // channel-blind: count drives the hint, not what was actually sent
  assert.equal(expectedNextChannel([out("form")]), "linkedin");
  // inbound touches ignored
  assert.equal(expectedNextChannel([out("email"), inb]), "linkedin");
});
await test("segment landing map covers every segment", async () => {
  const { LEAD_SEGMENTS } = await import("../../models/Lead");
  for (const s of LEAD_SEGMENTS) assert.ok(landingPathForSegment(s).startsWith("/"), s);
  assert.equal(landingPathForSegment("nursing_program"), "/solutions/nursing");
  assert.equal(landingPathForSegment("corporate_ld"), "/solutions/corporate-ld");
  assert.equal(landingPathForSegment("other"), "/");
});

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/outreach/cadence.test.ts` → FAIL (modules not found)

- [ ] **Step 3: Implement**

```ts
// src/lib/outreach/cadence.ts
import type { ITouch, LeadStatus, TouchChannel } from "@/models";

// 4-step channel-aware sequence:
// [email intro] → +1d [linkedin note] → +3d [email bump] → +6d [email breakup] → parked
export const FOLLOW_UP_DELAYS_DAYS = [1, 3, 6] as const;
export const MAX_OUTBOUND_TOUCHES = 4;
export const SEQUENCE_CHANNELS: TouchChannel[] = ["email", "linkedin", "email", "email"];
export const SEQUENCE_STEP_LABELS = ["Intro email", "LinkedIn note", "Email bump", "Breakup email"] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

function outboundCount(touches: ITouch[]): number {
  return touches.filter((t) => t.direction === "outbound").length;
}

// Suggested next channel by outbound count alone — channel-blind: what was
// actually sent doesn't shift the sequence, marking any channel consumes a step.
export function expectedNextChannel(touches: ITouch[]): TouchChannel | null {
  return SEQUENCE_CHANNELS[outboundCount(touches)] ?? null;
}

export function applyMarkSent(
  input: { status: LeadStatus; touches: ITouch[] },
  channel: TouchChannel,
  summary: string,
  now: Date
): { status: LeadStatus; nextActionAt: Date | null; touch: ITouch } {
  const touch: ITouch = { at: now, channel, direction: "outbound", summary };
  const countAfterSend = outboundCount(input.touches) + 1;

  if (countAfterSend >= MAX_OUTBOUND_TOUCHES) {
    return { status: "parked", nextActionAt: null, touch };
  }
  const delayDays = FOLLOW_UP_DELAYS_DAYS[countAfterSend - 1] ?? 6;
  return {
    status: "contacted",
    nextActionAt: new Date(now.getTime() + delayDays * DAY_MS),
    touch,
  };
}
```

```ts
// src/lib/outreach/segment-landing.ts
import type { LeadSegment } from "@/models";

// Targets are the /solutions/[segment] pages (separate plan:
// 2026-08-04-solutions-segment-pages.md). Fallback "/" until a page ships.
const MAP: Record<LeadSegment, string> = {
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

export function landingPathForSegment(segment: LeadSegment): string {
  return MAP[segment] ?? "/";
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx tsx src/lib/outreach/cadence.test.ts` → `failed: 0`. Note: this file imports `@/models` — if `tsx` chokes on the alias, switch the imports in `cadence.ts`/`segment-landing.ts` tests to relative (`../../models/Lead`) as the test already does; app code keeps `@/`.

- [ ] **Step 5: Register + commit**

Add `"test:outreach-cadence": "npx tsx src/lib/outreach/cadence.test.ts"` and an umbrella `"test:outreach": "npm run test:outreach-model && npm run test:outreach-cadence && npm run test:outreach-reply"` (reply script lands in Task 7; add it to the chain then if preferred).

```bash
git add src/lib/outreach/cadence.ts src/lib/outreach/segment-landing.ts src/lib/outreach/cadence.test.ts package.json
git commit -m "feat(outreach): follow-up cadence + segment landing map"
```

---

### Task 3: scripts/import-leads.ts

**Files:**
- Create: `scripts/import-leads.ts`
- Create: `scripts/fixtures/leads-sample.json` (2 valid + 1 invalid lead, for dry-run testing)

**Interfaces:**
- Consumes: `Lead` model (schema re-imported via relative path — `scripts/` is excluded from tsconfig and runs under `npx tsx`).
- Produces: CLI `MONGODB_URI=... npx tsx scripts/import-leads.ts <file.json> [--apply]`. Dry-run by default. Forces `status: "staged"`, strips any incoming `demoToken`/`gmailThreadIds`/`touches`/`demoVisits`. **Keeps** an optional `currentDraft { channel, subject?, body }` (research batches ship each lead with its intro email pre-written) but strips `currentDraft.gmailDraftId`/`gmailThreadId` — a Gmail draft is only ever minted through the draft endpoint. Dedupes on `company` + `decisionMaker.email` against the DB (skip + report).

- [ ] **Step 1: Write the fixture**

```json
[
  {
    "company": "Acme Nursing College",
    "segment": "nursing_program",
    "about": "200-student ADN program in Ohio",
    "whyFit": "Public NCLEX pass-rate pressure; no tutoring budget for 1:1",
    "useCaseHypothesis": "Voice tutor as unlimited NCLEX drill partner",
    "decisionMaker": { "name": "Dana Smith", "title": "Program Director", "linkedinUrl": "https://linkedin.com/in/danasmith", "email": "dana@acmenursing.edu", "emailVerified": true },
    "website": "https://acmenursing.edu",
    "source": "claude-research-2026-08-04",
    "currentDraft": { "channel": "email", "subject": "NCLEX prep that talks back", "body": "Hi Dana — saw Acme's NGN pass-rate note...", "gmailDraftId": "SHOULD-BE-STRIPPED" }
  },
  {
    "company": "Summit Test Prep",
    "segment": "testprep_academy",
    "about": "SAT/ACT academy, 3 locations",
    "whyFit": "Tutor payroll is their #1 cost",
    "useCaseHypothesis": "White-label voice tutor between human sessions",
    "decisionMaker": { "name": "Lee Park", "title": "Owner", "emailVerified": false },
    "website": "https://summittestprep.com",
    "source": "claude-research-2026-08-04"
  },
  {
    "company": "Bad Row Inc",
    "segment": "hospital",
    "decisionMaker": { "name": "X", "title": "Y", "emailVerified": false },
    "website": "https://bad.example",
    "source": "test"
  }
]
```

- [ ] **Step 2: Write the script**

```ts
// scripts/import-leads.ts
/**
 * Import Claude-researched leads into the outreach pipeline (status: staged).
 *
 * Usage:
 *   MONGODB_URI=... npx tsx scripts/import-leads.ts <file.json>          # dry-run
 *   MONGODB_URI=... npx tsx scripts/import-leads.ts <file.json> --apply  # write
 *
 * Input: JSON array matching the Lead schema (see src/models/Lead.ts).
 * status/demoToken/gmailThreadIds/touches on input rows are ignored.
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import { Lead } from "../src/models/Lead";

const APPLY = process.argv.includes("--apply");
const file = process.argv[2];
if (!file || file.startsWith("--")) {
  console.error("Usage: npx tsx scripts/import-leads.ts <file.json> [--apply]");
  process.exit(1);
}

const rows: unknown[] = JSON.parse(readFileSync(file, "utf8"));
if (!Array.isArray(rows)) { console.error("Input must be a JSON array"); process.exit(1); }

const results = { valid: 0, invalid: 0, inserted: 0, skippedDupes: 0, errors: [] as string[] };

async function main() {
  const docs: InstanceType<typeof Lead>[] = [];
  rows.forEach((row, i) => {
    const r = row as Record<string, unknown>;
    delete r.status; delete r.demoToken; delete r.gmailThreadIds; delete r.touches; delete r.demoVisits;
    if (r.currentDraft && typeof r.currentDraft === "object") {
      const d = r.currentDraft as Record<string, unknown>;
      delete d.gmailDraftId; delete d.gmailThreadId;
    }
    const doc = new Lead({ ...r, status: "staged" });
    const err = doc.validateSync();
    if (err) {
      results.invalid++;
      results.errors.push(`row ${i} (${r.company ?? "?"}): ${Object.keys(err.errors).join(", ")}`);
    } else {
      results.valid++;
      docs.push(doc);
    }
  });

  if (!APPLY) {
    console.log("[DRY RUN] no writes. Re-run with --apply to insert.");
    console.log(results);
    process.exit(results.invalid > 0 ? 1 : 0);
  }

  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  await mongoose.connect(process.env.MONGODB_URI);
  for (const doc of docs) {
    const dupe = await Lead.findOne({
      company: doc.company,
      "decisionMaker.email": doc.decisionMaker.email ?? null,
    });
    if (dupe) { results.skippedDupes++; continue; }
    await doc.save();
    results.inserted++;
  }
  await mongoose.disconnect();
  console.log(results);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Verify dry-run against the fixture**

Run: `npx tsx scripts/import-leads.ts scripts/fixtures/leads-sample.json`
Expected: exits 1, `valid: 2, invalid: 1`, error names `segment` for row 2 (`Bad Row Inc`). No DB needed for dry-run.

- [ ] **Step 4: Verify --apply against local dev DB**

Run: `MONGODB_URI=<local dev uri> npx tsx scripts/import-leads.ts scripts/fixtures/leads-sample.json --apply` after removing the bad row → `inserted: 2`; run again → `skippedDupes: 2`. Clean up the two rows afterwards (`db.leads.deleteMany({source: "claude-research-2026-08-04"})` via mongosh) or leave for console testing.

- [ ] **Step 5: Commit**

```bash
git add scripts/import-leads.ts scripts/fixtures/leads-sample.json
git commit -m "feat(outreach): import-leads script (dry-run default, --apply)"
```

---

### Task 4: Leads API routes

**Files:**
- Create: `src/app/api/admin/outreach/leads/route.ts` (GET list w/ filters)
- Create: `src/app/api/admin/outreach/leads/[id]/route.ts` (PATCH edit/approve/kill/status, DELETE)
- Create: `src/app/api/admin/outreach/leads/[id]/mark-sent/route.ts` (POST per-channel mark-sent)

**Interfaces:**
- Consumes: `Lead` from `@/models`; `applyMarkSent` from `@/lib/outreach/cadence`; `getServerSession(authOptions)`; `connectDB` from `@/lib/db`.
- Produces (all session-gated, house response shapes `{ leads } | { success, lead } | { error }`):
  - `GET /api/admin/outreach/leads?status=...&segment=...&due=1` → `{ leads: ILead[] }` sorted `nextActionAt asc, updatedAt desc`; `due=1` means `nextActionAt <= now` and `status in [approved, contacted]`.
  - `PATCH /api/admin/outreach/leads/:id` body `{ action: "approve" | "kill" | "edit" | "setStatus", fields?, status? }`:
    - `approve`: staged → approved; mints `demoToken` via `crypto.randomBytes(8).toString("base64url")`; sets `nextActionAt = now` so it appears in Today immediately.
    - `kill`: → `status: "dead"`, `nextActionAt: null`.
    - `edit`: whitelisted field update (`company, segment, about, whyFit, useCaseHypothesis, decisionMaker, website, source, notes, nextActionAt, currentDraft`).
    - `setStatus`: any valid `LeadStatus` (used by Pipeline tab, e.g. manual `call_booked`).
  - `POST /api/admin/outreach/leads/:id/mark-sent` body `{ channel, summary? }` → runs `applyMarkSent`, pushes touch, sets status/nextActionAt; if `channel === "email"` and `currentDraft?.gmailThreadId`, `$addToSet`s it into `gmailThreadIds` (this is the "record threadId on send" moment) and clears `currentDraft`.

- [ ] **Step 1: Implement `route.ts` (list)** — clone the shape of `src/app/api/admin/prospects/route.ts` (session check → `connectDB` → query → `NextResponse.json({ leads })`, catch → `console.error("[OUTREACH] GET Error:", error)` + 500).

```ts
// src/app/api/admin/outreach/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query: Record<string, unknown> = {};
    const status = searchParams.get("status");
    const segment = searchParams.get("segment");
    if (status) query.status = { $in: status.split(",") };
    if (segment) query.segment = segment;
    if (searchParams.get("due") === "1") {
      query.nextActionAt = { $lte: new Date() };
      query.status = { $in: ["approved", "contacted"] };
    }
    const leads = await Lead.find(query).sort({ nextActionAt: 1, updatedAt: -1 }).lean();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[OUTREACH] GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Implement `[id]/route.ts`** — same skeleton; PATCH switch on `action` as specified in Interfaces (approve/kill/edit/setStatus, each ending `await lead.save(); return NextResponse.json({ success: true, lead })`); DELETE removes the doc (staged-only guard: refuse if status !== "staged"). `demoToken` mint on approve:

```ts
import { randomBytes } from "node:crypto";
// inside approve branch:
if (lead.status !== "staged") return NextResponse.json({ error: "Only staged leads can be approved" }, { status: 400 });
lead.status = "approved";
lead.demoToken = lead.demoToken ?? randomBytes(8).toString("base64url");
lead.nextActionAt = new Date();
```

- [ ] **Step 3: Implement `mark-sent/route.ts`**

```ts
// core of POST, after gate + connectDB + Lead.findById:
const { channel, summary } = await request.json();
if (!["email", "linkedin", "form"].includes(channel))
  return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
const r = applyMarkSent(
  { status: lead.status, touches: lead.touches },
  channel, summary || `${channel} outreach sent`, new Date()
);
lead.touches.push(r.touch);
lead.status = r.status;
lead.nextActionAt = r.nextActionAt;
if (channel === "email" && lead.currentDraft?.gmailThreadId) {
  if (!lead.gmailThreadIds.includes(lead.currentDraft.gmailThreadId))
    lead.gmailThreadIds.push(lead.currentDraft.gmailThreadId);
  lead.currentDraft = null;
}
await lead.save();
return NextResponse.json({ success: true, lead });
```

- [ ] **Step 4: Verify** — `npx tsc --noEmit` clean; with dev server (`npm run dev`, port 3006) + imported fixture leads, curl the three routes while logged out (expect 401) and exercise approve → mark-sent ×4 → observe parked with `nextActionAt: null` (and intermediate `nextActionAt`s of +1d/+3d/+6d).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/outreach
git commit -m "feat(outreach): leads API (list/patch/mark-sent) with cadence"
```

---

### Task 5: Console page shell + Review queue tab

**Files:**
- Create: `src/app/admin/outreach/page.tsx` (server component, gated)
- Create: `src/app/admin/outreach/OutreachConsole.tsx` (`'use client'` tabs shell)
- Create: `src/app/admin/outreach/ReviewQueueTab.tsx`
- Modify: `src/app/admin/page.tsx` (add dashboard card linking `/admin/outreach`, alongside the existing cards at lines ~133-196)

**Interfaces:**
- Consumes: `getServerSession(authOptions)` gate pattern from `src/app/admin/contacts/page.tsx:16-18`; leads API from Task 4.
- Produces: `<OutreachConsole initialLeads={leads} />` with tab state `"review" | "today" | "pipeline"`; each tab component takes `{ leads, refresh }` where `refresh: () => Promise<void>` re-fetches `GET /api/admin/outreach/leads`.

- [ ] **Step 1: Server page (the gate)**

```tsx
// src/app/admin/outreach/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models";
import OutreachConsole from "./OutreachConsole";

export const dynamic = "force-dynamic";

export default async function AdminOutreachPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  await connectDB();
  const leads = JSON.parse(
    JSON.stringify(await Lead.find({}).sort({ nextActionAt: 1, updatedAt: -1 }).lean())
  );
  return <OutreachConsole initialLeads={leads} />;
}
```

- [ ] **Step 2: Tabs shell** — `'use client'`; house admin chrome: `min-h-screen bg-gray-100`, `<header className="bg-white shadow">` with back-link `<Link href="/admin"><ArrowLeft/></Link>` + title "Outreach Console", `mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8` main. Tab buttons Review / Today / Pipeline with counts (`staged` count, due count, total). Holds `leads` state seeded from `initialLeads`, `refresh()` re-fetches the list API, passes both down.

- [ ] **Step 3: Review queue tab** — cards over `leads.filter(l => l.status === "staged")`. Each card: company + segment badge, `about`, `whyFit`, `useCaseHypothesis`, decision-maker line (name — title, mailto if email, LinkedIn icon-link if `linkedinUrl`, ✓ badge if `emailVerified`), website link, `source`. Actions: **Approve** (`PATCH {action:"approve"}`), **Edit** (inline form over the whitelisted fields, submits `PATCH {action:"edit", fields}`), **Kill** (`PATCH {action:"kill"}`, `confirm()` first). All actions then `refresh()`.

- [ ] **Step 4: Dashboard card** — in `src/app/admin/page.tsx`, copy an existing card block, href `/admin/outreach`, title "B2B Outreach", lucide icon (e.g. `Send`).

- [ ] **Step 5: Verify + commit** — `npx tsc --noEmit`; in dev, log in at `/admin/login`, see staged fixture leads, approve one, kill one, edit one.

```bash
git add src/app/admin/outreach src/app/admin/page.tsx
git commit -m "feat(outreach): console shell + review queue tab"
```

---

### Task 6: Today tab + Pipeline tab

**Files:**
- Create: `src/app/admin/outreach/TodayTab.tsx`
- Create: `src/app/admin/outreach/PipelineTab.tsx`

**Interfaces:**
- Consumes: leads API (Task 4); `landingPathForSegment`, `expectedNextChannel`, `SEQUENCE_STEP_LABELS` (Task 2); draft endpoint (Task 8) for the "Create Gmail draft" button; `navigator.clipboard.writeText` for copy.
- Produces: the two remaining tabs inside `OutreachConsole`.

- [ ] **Step 1: Today tab** — list `leads` where `nextActionAt != null && new Date(nextActionAt) <= now && ["approved","contacted"].includes(status)` (client-side filter of the shared list; `refresh()` uses `?due=1` server filter when invoked from this tab). Per lead card:
  - Header: company, segment, outbound-touch count ("touch 2 of 4"), **next-step hint** from the sequence (`Next: ${SEQUENCE_STEP_LABELS[outboundCount]}` — e.g. "Next: LinkedIn note" — via `expectedNextChannel`/outbound count; hidden when null), last-visit chip if `demoVisits.length` (`demoVisits.at(-1).at`, relative time).
  - **Drafted message block**: if `currentDraft` present show `subject` + `body` in a `<pre className="whitespace-pre-wrap">` with a **Copy** button (`navigator.clipboard.writeText(body)`; flip label to "Copied ✓" for 1.5s). When `currentDraft.channel === "email"` and no `gmailDraftId` (the imported-pre-written case), show a **"Create Gmail draft"** button that POSTs the stored `{ channel, subject, body }` to the Task-8 draft endpoint, then `refresh()` — this is how an imported intro email becomes a real Gmail draft. If no draft at all, show "No draft yet" + note that drafts are written by the agent via the draft API (Task 8).
  - **Links row**: LinkedIn profile (`decisionMaker.linkedinUrl`), website, website + `/contact` guess labeled "contact page?", and the lead's demo link `${NEXT_PUBLIC_SITE_URL}/d/${demoToken}` with its own copy button.
  - **Per-channel mark-sent**: three buttons Email / LinkedIn / Form → `POST .../mark-sent {channel}` → `refresh()`. Disable Email button if no `currentDraft?.gmailThreadId` (nothing drafted to send), with tooltip.
- [ ] **Step 2: Pipeline tab** — `<table>` (wrapped in `overflow-x-auto`) of all leads: company, segment, status pill (color per status), decision maker, outbound touches, `nextActionAt`, last demo visit, last touch summary. Filter selects for status + segment (client-side). Row action: status dropdown → `PATCH {action:"setStatus"}` (covers `replied → call_booked`, manual `parked`/`dead` etc.).
- [ ] **Step 3: Verify + commit** — `npx tsc --noEmit`; in dev: approve a fixture lead → appears in Today (nextActionAt=now) → mark email sent (disabled, no draft — verify tooltip) → verify the header hint reads "Next: Intro email" → mark LinkedIn sent anyway (channel-blind step) → verify nextActionAt jumped +1d, hint advanced to "Next: LinkedIn note", and lead left Today; imported lead with pre-written draft shows "Create Gmail draft" button (disabled path until Task 8 ships — render-only check here); set status via Pipeline.

```bash
git add src/app/admin/outreach
git commit -m "feat(outreach): today + pipeline tabs"
```

---

### Task 7: Gmail OAuth + client lib

**Files:**
- Create: `src/models/OutreachToken.ts` (+ barrel export)
- Create: `src/lib/outreach/gmail.ts`
- Create: `src/lib/outreach/reply-detect.ts`
- Create: `src/app/api/admin/outreach/gmail/auth/route.ts` (GET → redirect to Google consent)
- Create: `src/app/api/admin/outreach/gmail/callback/route.ts`
- Create: `src/app/api/admin/outreach/gmail/status/route.ts`
- Test: `src/lib/outreach/reply-detect.test.ts`
- Modify: `.env.local.example` (document `GMAIL_OUTREACH_*`)

**Interfaces:**
- Consumes: `encryptToken`/`decryptToken` from `@/lib/crypto/token-encryption`; `encodeOAuthState`/`verifyOAuthState` from `@/lib/google/oauth-state`; `google` from `googleapis`.
- Produces:
  - `OutreachToken` model: `{ account: string (unique), refreshTokenEnc: string, connectedAt: Date }` — singleton per account.
  - `getOutreachGmail(): Promise<gmail_v1.Gmail>` — throws `Error("GMAIL_NOT_CONNECTED")` if no token doc.
  - `createOutreachDraft(args: { to: string; subject: string; body: string; threadId?: string }): Promise<{ draftId: string; threadId: string }>` — when `threadId` is set the draft is a reply into that thread: the draft message carries `threadId`, subject becomes `Re: <original subject>` (unless already `Re:`-prefixed), and `In-Reply-To`/`References` headers are set from the thread's latest `Message-ID`.
  - `getThreadMessages(threadId: string): Promise<Array<{ id: string; from: string; subject: string; messageIdHeader: string; labelIds: string[]; snippet: string; internalDate: number }>>` — `metadataHeaders: ["From", "Message-ID", "Subject"]`.
  - `findInboundReply(messages, selfEmail): { gmailMessageId: string; from: string; snippet: string } | null` (pure, in reply-detect.ts)

- [ ] **Step 1: Write the failing reply-detect test**

```ts
// src/lib/outreach/reply-detect.test.ts
import { strict as assert } from "node:assert";
import { findInboundReply } from "./reply-detect";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const self = "praveen@evelynlearning.com";
const msg = (id: string, from: string, labelIds: string[] = []) =>
  ({ id, from, labelIds, snippet: "s", internalDate: 1 });

await test("no reply when only self messages", () => {
  assert.equal(findInboundReply([msg("1", `Praveen <${self}>`, ["SENT"])], self), null);
});
await test("detects external reply", () => {
  const r = findInboundReply(
    [msg("1", `Praveen <${self}>`, ["SENT"]), msg("2", "Dana <dana@acme.edu>", ["INBOX"])], self);
  assert.equal(r?.gmailMessageId, "2");
});
await test("ignores drafts", () => {
  assert.equal(findInboundReply([msg("1", "Dana <dana@acme.edu>", ["DRAFT"])], self), null);
});
await test("self-match is case-insensitive", () => {
  assert.equal(findInboundReply([msg("1", "PRAVEEN@EVELYNLEARNING.COM", ["SENT"])], self), null);
});

console.log(`passed: ${passed}, failed: ${failed}`);
if (failed > 0) process.exit(1);
```

Run: `npx tsx src/lib/outreach/reply-detect.test.ts` → FAIL.

- [ ] **Step 2: Implement reply-detect (pure)**

```ts
// src/lib/outreach/reply-detect.ts
export interface ThreadMessageMeta {
  id: string; from: string; labelIds: string[]; snippet: string; internalDate: number;
}
export function findInboundReply(
  messages: ThreadMessageMeta[], selfEmail: string
): { gmailMessageId: string; from: string; snippet: string } | null {
  const self = selfEmail.toLowerCase();
  for (const m of messages) {
    if (m.labelIds.includes("DRAFT")) continue;
    if (m.from.toLowerCase().includes(self)) continue;
    return { gmailMessageId: m.id, from: m.from, snippet: m.snippet };
  }
  return null;
}
```

Run test → `failed: 0`. Register `"test:outreach-reply": "npx tsx src/lib/outreach/reply-detect.test.ts"` and complete the `test:outreach` umbrella from Task 2.

- [ ] **Step 3: OutreachToken model** — house model pattern: `account: { type: String, required: true, unique: true }`, `refreshTokenEnc: { type: String, required: true }`, `connectedAt: Date`, `timestamps: true`; export `OutreachToken`, `IOutreachToken` from the barrel.

- [ ] **Step 4: Gmail lib**

```ts
// src/lib/outreach/gmail.ts
import { google, gmail_v1 } from "googleapis";
import { connectDB } from "@/lib/db";
import { OutreachToken } from "@/models";
import { decryptToken } from "@/lib/crypto/token-encryption";

export const GMAIL_OUTREACH_SCOPES = [
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.readonly",
];

export function getOutreachAccount(): string {
  return process.env.GMAIL_OUTREACH_USER || "praveen@evelynlearning.com";
}

export function getOutreachOAuthClient() {
  const id = process.env.GMAIL_OUTREACH_CLIENT_ID;
  const secret = process.env.GMAIL_OUTREACH_CLIENT_SECRET;
  const callback = process.env.GMAIL_OUTREACH_CALLBACK_URL;
  if (!id || !secret || !callback) throw new Error("GMAIL_OUTREACH_* env not configured");
  return new google.auth.OAuth2(id, secret, callback);
}

export async function getOutreachGmail(): Promise<gmail_v1.Gmail> {
  await connectDB();
  const doc = await OutreachToken.findOne({ account: getOutreachAccount() });
  if (!doc) throw new Error("GMAIL_NOT_CONNECTED");
  const auth = getOutreachOAuthClient();
  auth.setCredentials({ refresh_token: decryptToken(doc.refreshTokenEnc) });
  return google.gmail({ version: "v1", auth });
}

export async function createOutreachDraft(args: {
  to: string; subject: string; body: string; threadId?: string;
}) {
  const gmail = await getOutreachGmail();
  let subject = args.subject;
  const extraHeaders: string[] = [];
  if (args.threadId) {
    // Reply into an existing thread: Re:-subject + In-Reply-To/References
    // from the thread's latest Message-ID.
    const messages = await getThreadMessages(args.threadId);
    const latest = messages[messages.length - 1];
    if (latest?.messageIdHeader) {
      extraHeaders.push(`In-Reply-To: ${latest.messageIdHeader}`);
      extraHeaders.push(`References: ${latest.messageIdHeader}`);
    }
    const original = latest?.subject || args.subject;
    subject = /^re:/i.test(original) ? original : `Re: ${original}`;
  }
  const mime = [
    `To: ${args.to}`,
    `Subject: ${subject}`,
    ...extraHeaders,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    args.body,
  ].join("\r\n");
  const raw = Buffer.from(mime).toString("base64url");
  const res = await gmail.users.drafts.create({
    userId: "me",
    requestBody: { message: { raw, ...(args.threadId ? { threadId: args.threadId } : {}) } },
  });
  const draftId = res.data.id ?? "";
  const threadId = res.data.message?.threadId ?? "";
  if (!draftId || !threadId) throw new Error("Draft create returned no id/threadId");
  return { draftId, threadId };
}

export async function getThreadMessages(threadId: string) {
  const gmail = await getOutreachGmail();
  const res = await gmail.users.threads.get({
    userId: "me", id: threadId, format: "metadata",
    metadataHeaders: ["From", "Message-ID", "Subject"],
  });
  const header = (m: gmail_v1.Schema$Message, name: string) =>
    m.payload?.headers?.find((h) => h.name?.toLowerCase() === name)?.value ?? "";
  return (res.data.messages ?? []).map((m) => ({
    id: m.id ?? "",
    from: header(m, "from"),
    subject: header(m, "subject"),
    messageIdHeader: header(m, "message-id"),
    labelIds: m.labelIds ?? [],
    snippet: m.snippet ?? "",
    internalDate: Number(m.internalDate ?? 0),
  }));
}
```

- [ ] **Step 5: OAuth routes** — all three session-gated.
  - `auth/route.ts`: `GET` → build consent URL `getOutreachOAuthClient().generateAuthUrl({ access_type: "offline", prompt: "consent", scope: GMAIL_OUTREACH_SCOPES, state: encodeOAuthState(), login_hint: getOutreachAccount() })` → `NextResponse.redirect(url)`.
  - `callback/route.ts`: verify `verifyOAuthState(searchParams.get("state"))`; `const { tokens } = await client.getToken(code)`; require `tokens.refresh_token`; upsert `OutreachToken` with `refreshTokenEnc: encryptToken(tokens.refresh_token)`; redirect to `/admin/outreach?gmail=connected`.
  - `status/route.ts`: `GET` → `{ connected: boolean, account }`.
  - In `OutreachConsole` header: small Gmail status chip fetched from `status` route, "Connect Gmail" link to the auth route when disconnected.

- [ ] **Step 6: Env + GCP setup note** — add the four `GMAIL_OUTREACH_*` vars to `.env.local.example` under a `# Gmail outreach (B2B console)` header. Manual prereq (document in the PR/commit body, cannot be automated): create an OAuth client in GCP console with redirect `https://evelynlearning.com/api/admin/outreach/gmail/callback` (+ localhost:3006 variant), enable Gmail API, add praveen@evelynlearning.com as test user or publish internal.

- [ ] **Step 7: Verify + commit** — `npx tsc --noEmit`; `npm run test:outreach` → all `failed: 0`; live OAuth round-trip in dev (needs real GCP creds) → status chip flips to connected.

```bash
git add src/models/OutreachToken.ts src/models/index.ts src/lib/outreach src/app/api/admin/outreach/gmail .env.local.example package.json
git commit -m "feat(outreach): Gmail OAuth + draft/thread client for outreach account"
```

---

### Task 8: Draft endpoint (agent-written body → real Gmail draft)

**Files:**
- Create: `src/app/api/admin/outreach/leads/[id]/draft/route.ts`
- Modify: `src/app/admin/outreach/TodayTab.tsx` (surface draft errors + "open in Gmail" link)

**Interfaces:**
- Consumes: `createOutreachDraft` (Task 7); `Lead`.
- Produces: `POST /api/admin/outreach/leads/:id/draft` body `{ channel: "email" | "linkedin" | "form", subject?, body, newThread?: boolean }` (session-gated):
  - `email`: requires `lead.decisionMaker.email`. **Reply-by-default:** when `lead.gmailThreadIds` is non-empty and `newThread` is not `true`, calls `createOutreachDraft({ to, subject, body, threadId: lead.gmailThreadIds[0] })` so follow-up bumps/breakups thread onto the intro email; otherwise (first touch, or explicit `{ newThread: true }`) drafts a fresh thread. Sets `currentDraft = { channel, subject, body, gmailDraftId, gmailThreadId }` (the returned threadId — same as the existing thread when replying). Returns `{ success, lead, gmailDraftUrl }` where `gmailDraftUrl = https://mail.google.com/mail/u/0/#drafts?compose=<draftId>`.
  - `linkedin` / `form`: just sets `currentDraft = { channel, body }` (copy-button source; no Gmail).
  - This is the endpoint the agent (Claude, out-of-band) hits to load personalized messages; it's also callable from an "Edit draft" textarea in the Today tab for manual tweaks (same endpoint re-creates the Gmail draft; on email re-draft, first `gmail.users.drafts.delete` the old `gmailDraftId`, ignore 404).

- [ ] **Step 1: Implement the route** (house skeleton; 400 on missing body/email, 409 `{ error: "GMAIL_NOT_CONNECTED" }` mapped from the lib error).
- [ ] **Step 2: Today tab wiring** — "Edit draft" toggle showing subject/body inputs → POST → `refresh()`; when `currentDraft.gmailDraftId` present, render "Open draft in Gmail" external link.
- [ ] **Step 3: Verify + commit** — with Gmail connected in dev: draft an email to a test address you control, confirm the draft appears in the real Gmail drafts folder threaded correctly; confirm mark-sent moves `gmailThreadId` into `gmailThreadIds`.

```bash
git add src/app/api/admin/outreach/leads src/app/admin/outreach/TodayTab.tsx
git commit -m "feat(outreach): draft endpoint wiring agent copy into real Gmail drafts"
```

---

### Task 9: Reply watcher cron (15 min)

**Files:**
- Create: `src/lib/outreach/reply-watcher.ts`
- Modify: `src/instrumentation.ts` (start behind `ENABLE_OUTREACH_WATCHER === 'true'`)
- Create: `src/app/api/admin/outreach/watcher/route.ts` (GET status, POST manual trigger — the `triggerQueueProcessing` escape-hatch pattern)
- Modify: `.env.local.example` (`ENABLE_OUTREACH_WATCHER`)

**Interfaces:**
- Consumes: `getThreadMessages`, `getOutreachAccount` (Task 7); `findInboundReply` (Task 7); `Lead`.
- Produces (mirrors the `blog-scheduler.ts` quartet):
  - `startReplyWatcher(cronExpression = "*/15 * * * *"): void`
  - `stopReplyWatcher(): void`
  - `isReplyWatcherActive(): boolean`
  - `runReplyCheck(): Promise<{ checkedThreads: number; repliesFound: number; errors: number }>`

- [ ] **Step 1: Implement `runReplyCheck`**

```ts
// src/lib/outreach/reply-watcher.ts (core)
export async function runReplyCheck() {
  const stats = { checkedThreads: 0, repliesFound: 0, errors: 0 };
  await connectDB();
  // ONLY leads with recorded threads. Never the wider inbox.
  // parked included: a lead can reply late to the breakup email.
  const leads = await Lead.find({
    status: { $in: ["contacted", "parked"] },
    gmailThreadIds: { $exists: true, $ne: [] },
  });
  const self = getOutreachAccount();
  for (const lead of leads) {
    for (const threadId of lead.gmailThreadIds) {
      try {
        stats.checkedThreads++;
        const messages = await getThreadMessages(threadId);
        const known = new Set(lead.touches.map((t) => t.gmailMessageId).filter(Boolean));
        const reply = findInboundReply(messages.filter((m) => !known.has(m.id)), self);
        if (reply) {
          lead.status = "replied";
          lead.nextActionAt = null;
          lead.touches.push({
            at: new Date(), channel: "email", direction: "inbound",
            summary: `Reply from ${reply.from}: ${reply.snippet.slice(0, 140)}`,
            gmailMessageId: reply.gmailMessageId,
          });
          await lead.save();
          stats.repliesFound++;
          break; // this lead is done; stop scanning its other threads
        }
      } catch (e) {
        stats.errors++;
        console.error(`[OUTREACH-WATCHER] thread ${threadId} error:`, e);
      }
    }
  }
  return stats;
}
```

Plus module-level `let task: ScheduledTask | null` + `isRunning` overlap guard, `startReplyWatcher` with `cron.validate()` + `cron.schedule`, `stopReplyWatcher`, `isReplyWatcherActive` — copy the structure of `blog-scheduler.ts:106-148`. If `runReplyCheck` throws `GMAIL_NOT_CONNECTED`, log once and return (don't crash the schedule).

- [ ] **Step 2: instrumentation hook** — in `src/instrumentation.ts` inside the `nodejs` guard, after the existing scheduler block (keep the existing early-return refactored so outreach isn't gated behind `ENABLE_BLOG_SCHEDULER` — move the blog early-return into its own `if` block):

```ts
if (process.env.ENABLE_OUTREACH_WATCHER === "true") {
  setTimeout(async () => {
    const { startReplyWatcher } = await import("@/lib/outreach/reply-watcher");
    startReplyWatcher("*/15 * * * *");
  }, 5000);
}
```

**Careful:** `instrumentation.ts:24-27` currently `return`s early when `ENABLE_BLOG_SCHEDULER !== 'true'` — the outreach block must sit BEFORE that return (or the return becomes a scoped `if`). Single pm2 instance in prod → no locking needed.

- [ ] **Step 3: Status/trigger route** — session-gated; `GET` → `{ active: isReplyWatcherActive() }`; `POST` → `{ success: true, stats: await runReplyCheck() }`. Add a "Check replies now" button + watcher-active chip in the console header.
- [ ] **Step 4: Verify + commit** — `npx tsc --noEmit`; in dev with `ENABLE_OUTREACH_WATCHER=true`: send the Task-8 test draft to yourself, reply from the other account, hit "Check replies now" → lead flips to `replied`, inbound touch logged with `gmailMessageId`, `nextActionAt` null, lead leaves Today.

```bash
git add src/lib/outreach/reply-watcher.ts src/instrumentation.ts src/app/api/admin/outreach/watcher .env.local.example
git commit -m "feat(outreach): 15-min reply watcher over recorded thread IDs"
```

---

### Task 10: /d/[token] demo links

**Files:**
- Create: `src/app/d/[token]/route.ts`
- Test: covered by cadence test's landing-map assertions (Task 2) + manual

**Interfaces:**
- Consumes: `Lead`, `landingPathForSegment` (Task 2).
- Produces: public `GET /d/:token` → logs visit, 302 to segment landing page. Unknown token → 302 to `/` (no 404 leak that a token was wrong).

- [ ] **Step 1: Implement**

```ts
// src/app/d/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models";
import { landingPathForSegment } from "@/lib/outreach/segment-landing";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://evelynlearning.com";
  try {
    await connectDB();
    const ua = request.headers.get("user-agent") ?? "";
    const lead = await Lead.findOneAndUpdate(
      { demoToken: token },
      { $push: { demoVisits: { $each: [{ at: new Date(), ua }], $slice: -50 } } },
      { new: false }
    ).lean();
    const path = lead ? landingPathForSegment(lead.segment) : "/";
    return NextResponse.redirect(new URL(path, base), 302);
  } catch (error) {
    console.error("[DEMO-LINK] Error:", error);
    return NextResponse.redirect(new URL("/", base), 302);
  }
}
```

Check `params` typing against a neighboring dynamic route (`src/app/showcase/[slug]/layout.tsx`) — if this Next version passes `params` as a plain object rather than a Promise, match the house signature.

- [ ] **Step 2: Middleware check** — confirm `src/middleware.ts:34-39` matcher doesn't rewrite `/d/*` for the tutor hostnames (it rewrites everything on `tutor.` subdomains; demo links will use the apex domain, so no change needed — verify, don't assume).
- [ ] **Step 3: Verify + commit** — dev: approve a lead (mints token), open `http://localhost:3006/d/<token>` → 302 to the mapped path, `demoVisits` grew, Today/Pipeline show last-visit; bogus token → `/`.

```bash
git add src/app/d
git commit -m "feat(outreach): /d/[token] tracked demo links"
```

---

### Task 11: End-to-end pass + docs

**Files:**
- Modify: anything the pass shakes out.

- [ ] **Step 1: Full-flow dev rehearsal** — import fixture (`--apply`) → review-queue approve → agent-style draft via `curl -X POST .../draft` → copy button → mark-sent email (threadId recorded) → reply from test account → "Check replies now" → replied → Pipeline `setStatus: call_booked`. Separately: 4× mark-sent on another lead → auto-park; then reply to its (test) thread and run the watcher → parked lead flips to replied (A3 late-reply path). Verify a 2nd email draft on a contacted lead threads as a reply (Re: subject, same threadId) and `{ newThread: true }` forces a fresh thread. Confirm the imported pre-written draft → "Create Gmail draft" → mark-sent flow records the threadId. Confirm `/d/` visit chips render.
- [ ] **Step 2: Verification gate** — `npx tsc --noEmit` clean; `npm run test:outreach` → every suite `failed: 0`; `npm run build` completes (catches server/client component violations).
- [ ] **Step 3: Commit residue + final commit**

```bash
git add -A && git commit -m "feat(outreach): e2e polish for outreach console v1"
```

---

## Self-Review Notes

- **Amendments applied 2026-08-04 (owner-approved):** A1 4-step channel-aware cadence ([1,3,6]d, max 4, `expectedNextChannel` + Today hint, channel-blind counter); A2 reply-in-thread drafts (optional `threadId`, Re:-subject, In-Reply-To/References, reply-by-default with `newThread` escape); A3 watcher also polls `parked` (late replies to the breakup); A4 importer keeps pre-written `currentDraft` (Gmail ids stripped) + Today-tab "Create Gmail draft" button. A6 (admin gate hotfix) shipped separately ahead of this plan.

- **Spec coverage:** 1→Task 1; 2→Tasks 5–6; 3→Tasks 7–9; 4→Task 10; 5→Tasks 2+4; 6→Task 3. Out-of-scope list respected — no pixels, no sequence engine, no LinkedIn automation.
- **Known deviations (flagged up top):** `currentDraft`, `demoVisits`, `OutreachToken` — structurally required by requirements 2/3/4.
- **Deliberate call:** thread ID recorded at mark-sent (not draft-creation) so the watcher never polls never-sent drafts — this is the literal reading of "record threadId on send".
- **Security flag (pre-existing, NOT fixed by this plan):** `/admin/prospecting` page and `/api/admin/prospecting` route are ungated today. The new console gates everything, but the legacy gap should be closed separately.
- **Dependency:** segment landing paths point at `/solutions/*` from the companion plan (`2026-08-04-solutions-segment-pages.md`); until those ship, `/d/` links land on `/` for unmapped segments — acceptable because outreach won't start before the pages exist.
