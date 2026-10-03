# Bounce Handling + Deferred Follow-Ups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the outreach watcher's mis-classification of delivery bounces as replies, then clear the four follow-up items deliberately deferred during the 2026-08-13 session.

**Architecture:** Five INDEPENDENT workstreams (A–E). Each ships on its own and none blocks another — run them in any order, or split them into separate sessions. A is the only one touching live pipeline data and should go first.

**Tech Stack:** Next.js 16.3.1, TypeScript, Mongoose, googleapis (Gmail v1), `node:test` via `npx tsx --test`.

**Spec:** No separate spec — this plan is self-contained. Diagnostic evidence is in this session's transcript and reproducible with `scripts/diagnose-reply-watcher.ts`.

## Global Constraints

- **Repos:** Workstreams A–C and E are `~/Dev/evelynlearning`. Workstream D is `~/Dev/academy`. Never mix them in one commit.
- **Branch:** evelyn work goes on `taxonomy-generate`, then merges to `main` via the `.claude/worktrees/r42-ship` worktree (`main` is checked out there, so `git checkout main` fails in the main dir). Academy commits go on a short-lived branch then fast-forward to `main`.
- **Deploy:** `./deploy-to-production.sh` for evelyn — ALWAYS, never `deploy-update.sh`. `./deploy-crimsora.sh` for academy. **The deploy script builds from DISK, not from git — commit before deploying, and never edit files while a deploy is running.**
- **Prod env for scripts:** `.env.local.production` cannot be `source`d (line 10 `NEXT_PUBLIC_SITE_NAME=Evelyn Learning` is unquoted and breaks the shell). Use the `loadEnv()` helper already present in `scripts/diagnose-reply-watcher.ts`.
- **Verification bar:** every claim of "fixed" needs command output. Typecheck (`npx tsc --noEmit`) must stay at 0 errors.

## Open decisions — answer BEFORE starting Task A3

1. **How should a bounced lead be represented?** Recommended: `status: "dead"` + `decisionMaker.emailVerified = false` + an inbound touch recording the failure. Alternative: a new `"bounced"` status in `LEAD_STATUSES` (`src/lib/outreach/enums.ts:21`) — cleaner semantically, but touches the console UI, status filters, and the cadence engine. **The plan below assumes `"dead"`.**
2. **What to do with the one currently-mislabelled lead** (Community College of Rhode Island, `carr7@ccri.edu`, currently `status: "replied"`). Recommended: let Task A4 reclassify it automatically.

---

# Workstream A — Bounce-as-reply (do this first)

**Why:** `findInboundReply` returns the first thread message that is neither ours nor a draft. An NDR from `mailer-daemon@googlemail.com` satisfies both conditions, so a *delivery failure* flips the lead to `replied` — the strongest positive signal in the pipeline. Confirmed live on 2026-08-14: CCRI marked `replied` by an "Address not found" bounce. Scan of all 21 leads: 1 bounced, 20 delivered.

### Task A1: Classify bounce senders

**Files:**
- Modify: `src/lib/outreach/reply-detect.ts`
- Test: `src/lib/outreach/reply-detect.test.ts`

**Interfaces:**
- Produces: `isBounceSender(from: string): boolean`

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/outreach/reply-detect.test.ts`:

```ts
import { isBounceSender } from "./reply-detect";

test("isBounceSender matches Gmail's NDR sender", () => {
  assert.equal(isBounceSender("Mail Delivery Subsystem <mailer-daemon@googlemail.com>"), true);
  assert.equal(isBounceSender("<MAILER-DAEMON@google.com>"), true);
  assert.equal(isBounceSender("postmaster@ccri.edu"), true);
});

test("isBounceSender does not match a real person", () => {
  assert.equal(isBounceSender("Dr. Carr <carr7@ccri.edu>"), false);
  assert.equal(isBounceSender("Postmaster General <pg@example.com>"), false);
  assert.equal(isBounceSender(""), false);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx tsx --test src/lib/outreach/reply-detect.test.ts`
Expected: FAIL — `isBounceSender is not a function`

- [ ] **Step 3: Implement**

Add to `src/lib/outreach/reply-detect.ts`:

```ts
// Gmail delivers non-delivery reports from mailer-daemon@<host>; other MTAs
// use postmaster@<host>. Anchored on a local-part boundary so a real person
// at "Postmaster General <pg@example.com>" is not swallowed.
const BOUNCE_LOCALPART = /(^|[<\s])(mailer-daemon|postmaster)@/i;

export function isBounceSender(from: string): boolean {
  return BOUNCE_LOCALPART.test(from);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx tsx --test src/lib/outreach/reply-detect.test.ts`
Expected: PASS, 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/outreach/reply-detect.ts src/lib/outreach/reply-detect.test.ts
git commit -m "feat(outreach): classify mailer-daemon/postmaster senders as bounces"
```

### Task A2: Return a discriminated inbound result

**Files:**
- Modify: `src/lib/outreach/reply-detect.ts`
- Test: `src/lib/outreach/reply-detect.test.ts`

**Interfaces:**
- Consumes: `isBounceSender` from Task A1
- Produces: `findInboundMessage(messages: ThreadMessageMeta[], selfEmail: string): InboundMessage | null` where `InboundMessage = { kind: "reply" | "bounce"; gmailMessageId: string; from: string; snippet: string }`

- [ ] **Step 1: Write the failing tests**

```ts
import { findInboundMessage } from "./reply-detect";

const msg = (over: Partial<ThreadMessageMeta> = {}): ThreadMessageMeta => ({
  id: "m1", from: "someone@else.com", labelIds: [], snippet: "hi", internalDate: 1, ...over,
});

test("findInboundMessage tags a bounce as kind=bounce", () => {
  const out = findInboundMessage(
    [msg({ id: "b1", from: "Mail Delivery Subsystem <mailer-daemon@googlemail.com>", snippet: "Address not found" })],
    "praveen@evelynlearning.com",
  );
  assert.equal(out?.kind, "bounce");
  assert.equal(out?.gmailMessageId, "b1");
});

test("findInboundMessage tags a human message as kind=reply", () => {
  const out = findInboundMessage([msg({ id: "r1", from: "Dr. Carr <carr7@ccri.edu>" })], "praveen@evelynlearning.com");
  assert.equal(out?.kind, "reply");
});

test("a bounce takes precedence over a later human message in the same thread", () => {
  // Order matters: a thread can contain the NDR and then a forwarded note.
  const out = findInboundMessage(
    [
      msg({ id: "b1", from: "mailer-daemon@googlemail.com", internalDate: 1 }),
      msg({ id: "r1", from: "someone@else.com", internalDate: 2 }),
    ],
    "praveen@evelynlearning.com",
  );
  assert.equal(out?.kind, "bounce");
});

test("still skips drafts and our own messages", () => {
  assert.equal(findInboundMessage([msg({ labelIds: ["DRAFT"] })], "praveen@evelynlearning.com"), null);
  assert.equal(findInboundMessage([msg({ from: "praveen@evelynlearning.com" })], "praveen@evelynlearning.com"), null);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx tsx --test src/lib/outreach/reply-detect.test.ts`
Expected: FAIL — `findInboundMessage is not a function`

- [ ] **Step 3: Implement**

Replace `findInboundReply` in `src/lib/outreach/reply-detect.ts` with:

```ts
export type InboundKind = "reply" | "bounce";

export interface InboundMessage {
  kind: InboundKind;
  gmailMessageId: string;
  from: string;
  snippet: string;
}

/**
 * The first message in the thread that is neither ours nor a draft, tagged
 * with what it actually IS. The previous version returned only the message,
 * so the caller treated a non-delivery report as a reply and flipped the
 * lead to "replied" — the strongest positive signal in the pipeline — on an
 * email that was never delivered (observed on prod 2026-08-14, CCRI).
 *
 * Bounces are scanned for FIRST across the whole list rather than taken in
 * array order: a thread can contain the NDR plus later unrelated traffic,
 * and the delivery failure is the fact that matters.
 */
export function findInboundMessage(
  messages: ThreadMessageMeta[],
  selfEmail: string
): InboundMessage | null {
  const self = selfEmail.toLowerCase();
  const inbound = messages.filter(
    (m) => !m.labelIds.includes("DRAFT") && !m.from.toLowerCase().includes(self)
  );
  const bounce = inbound.find((m) => isBounceSender(m.from));
  const chosen = bounce ?? inbound[0];
  if (!chosen) return null;
  return {
    kind: bounce ? "bounce" : "reply",
    gmailMessageId: chosen.id,
    from: chosen.from,
    snippet: chosen.snippet,
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx tsx --test src/lib/outreach/reply-detect.test.ts`
Expected: PASS. Pre-existing tests referencing `findInboundReply` will now fail to compile — update them to call `findInboundMessage` and assert `out?.kind === "reply"` plus the same id.

- [ ] **Step 5: Commit**

```bash
git add src/lib/outreach/reply-detect.ts src/lib/outreach/reply-detect.test.ts
git commit -m "feat(outreach): findInboundMessage distinguishes replies from bounces"
```

### Task A3: Watcher marks bounced leads dead, not replied

**Files:**
- Modify: `src/lib/outreach/reply-watcher.ts:47-56` (stats interface), `:96-113` (the found-message branch)

**Interfaces:**
- Consumes: `findInboundMessage`, `InboundMessage` from Task A2
- Produces: `ReplyCheckStats.bounced: number`

- [ ] **Step 1: Add the counter**

In the `ReplyCheckStats` interface add:

```ts
  /** Leads closed this run because the outbound email bounced. */
  bounced: number;
```

and add `bounced: 0` to the initialiser in `runReplyCheck`.

- [ ] **Step 2: Replace the found-message branch**

Swap the `findInboundReply` call and its `if (reply) { ... }` block for:

```ts
          const found = findInboundMessage(
            messages.filter((m) => !known.has(m.id)),
            self
          );
          if (found?.kind === "bounce") {
            // A delivery failure is the OPPOSITE of a reply: the prospect
            // never received the mail. Close the lead and flag the address
            // so re-enrichment can pick it up, rather than leaving a dead
            // address sitting in the pipeline as a positive signal.
            lead.status = "dead";
            lead.nextActionAt = null;
            if (lead.decisionMaker) lead.decisionMaker.emailVerified = false;
            lead.touches.push({
              at: new Date(),
              channel: "email",
              direction: "inbound",
              summary: `Delivery failed (${found.from}): ${found.snippet.slice(0, 140)}`,
              gmailMessageId: found.gmailMessageId,
            });
            await lead.save();
            stats.bounced++;
            console.warn(`[Reply Watcher] ${lead.company}: delivery bounced — marked dead`);
            break;
          }
          if (found) {
            lead.status = "replied";
            lead.nextActionAt = null;
            lead.touches.push({
              at: new Date(),
              channel: "email",
              direction: "inbound",
              summary: `Reply from ${found.from}: ${found.snippet.slice(0, 140)}`,
              gmailMessageId: found.gmailMessageId,
            });
            await lead.save();
            stats.repliesFound++;
            break; // this lead is done; stop scanning its other threads
          }
```

- [ ] **Step 3: Add `bounced` to the Completed log line**

```ts
        `[Reply Watcher] Completed: ${stats.checkedThreads} checked, ${stats.repliesFound} replies found, ` +
          `${stats.bounced} bounced, ${stats.errors} errors, ${stats.prunedThreads} pruned, ${stats.unwatchableLeads} now unwatchable`
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` → 0 errors
Run: `npx tsx --test src/lib/outreach/*.test.ts` → all pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/outreach/reply-watcher.ts
git commit -m "fix(outreach): a bounced email marks the lead dead, not replied"
```

### Task A4: Reclassify leads already mislabelled by a bounce

**Files:**
- Create: `scripts/reclassify-bounced-leads.ts`

- [ ] **Step 1: Write the script**

Copy the `loadEnv()` helper verbatim from `scripts/diagnose-reply-watcher.ts`, then:

```ts
const APPLY = process.argv.includes('--apply');

async function main(): Promise<void> {
  await mongoose.connect(process.env.MONGODB_URI!);
  const { getThreadMessages } = await import('../src/lib/outreach/gmail');
  const { isBounceSender } = await import('../src/lib/outreach/reply-detect');

  const leads = await mongoose.connection.collection('leads')
    .find({ status: 'replied' }, { projection: { company: 1, gmailThreadIds: 1, decisionMaker: 1 } })
    .toArray();

  let fixed = 0;
  for (const lead of leads) {
    let bounceFrom: string | null = null;
    for (const t of (lead.gmailThreadIds as string[]) ?? []) {
      try {
        for (const m of await getThreadMessages(t)) {
          if (isBounceSender(m.from)) { bounceFrom = m.from; break; }
        }
      } catch { /* 404s are handled by the watcher's pruning */ }
      if (bounceFrom) break;
    }
    if (!bounceFrom) continue;
    console.log(`RECLASSIFY ${lead.company} — bounce from ${bounceFrom}`);
    if (APPLY) {
      await mongoose.connection.collection('leads').updateOne(
        { _id: lead._id },
        { $set: { status: 'dead', nextActionAt: null, 'decisionMaker.emailVerified': false } },
      );
    }
    fixed++;
  }
  console.log(`\n${APPLY ? 'applied' : 'would reclassify'}: ${fixed} of ${leads.length} 'replied' leads`);
  await mongoose.disconnect();
}
```

- [ ] **Step 2: Dry run**

Run: `npx tsx scripts/reclassify-bounced-leads.ts`
Expected: `RECLASSIFY Community College of Rhode Island…` and `would reclassify: 1 of 1`

- [ ] **Step 3: Apply and verify**

Run: `npx tsx scripts/reclassify-bounced-leads.ts --apply`
Then re-run without `--apply`; expected `would reclassify: 0`

- [ ] **Step 4: Commit, then deploy**

```bash
git add scripts/reclassify-bounced-leads.ts
git commit -m "chore(outreach): one-off reclassification of bounce-mislabelled leads"
```

Then merge to `main` via the r42-ship worktree, push, and `./deploy-to-production.sh`.

- [ ] **Step 5: Confirm on prod**

After restart, wait for the next quarter-hour tick:
`ssh root@84.247.185.169 'pm2 logs evelyn-website --lines 40 --nostream | grep "Reply Watcher"'`
Expected: `20 checked, 0 replies found, 0 bounced, 0 errors, 0 pruned, 0 now unwatchable` (20, not 21 — CCRI is `dead` and no longer polled).

---

# Workstream B — The three deferred dependency majors

**Context:** The non-breaking tier shipped 2026-08-13 (`08a3f6b1`), taking production vulnerabilities 16 → 1. These three need `npm audit fix --force`. Do them **one per commit** — a combined bump makes a regression impossible to attribute.

### Task B1: nodemailer 8 → 9

**Files:** `package.json`, `package-lock.json`; call sites `src/lib/email.ts`, `src/app/api/contact/route.ts`, `src/app/api/admin/prospects/outreach/route.ts`

**Risk:** highest of the three — this is the live Zoho send path. The advisory (message-level `raw` bypassing `disableFileAccess`/`disableUrlAccess`) is **not reachable**: no call site passes `raw`. This is hygiene, not urgency.

- [ ] **Step 1:** `npm i nodemailer@^9` then read nodemailer's v9 migration notes (WebFetch `https://github.com/nodemailer/nodemailer/releases`); check for changes to `createTransport` options, SMTP auth, and TLS defaults.
- [ ] **Step 2:** `npx tsc --noEmit` → 0 errors. Fix any signature changes at the three call sites.
- [ ] **Step 3:** Send a real test through each path — the contact form (`/contact`) and the prospects outreach route — to a real inbox. Do NOT declare this done on a typecheck alone; SMTP breakage is a runtime failure.
- [ ] **Step 4:** `git commit -m "chore(deps): nodemailer 8 -> 9"` and deploy separately from B2/B3.

### Task B2: sharp 0.34.5 → 0.35.x

**Files:** `package.json` (currently pinned exactly, no caret), `package-lock.json`

- [ ] **Step 1:** `npm i -D sharp@^0.35`
- [ ] **Step 2:** `npm run build` — sharp is Next's image-optimisation dependency, so a broken install surfaces at build/image-serve time, not typecheck.
- [ ] **Step 3:** After deploy, load a page with an optimised image and confirm `/_next/image` returns 200.
- [ ] **Step 4:** `git commit -m "chore(deps): sharp 0.34.5 -> 0.35.x (libvips CVEs)"`

### Task B3: esbuild — decide, don't reflexively bump

**Finding:** the advisory (GHSA-g7r4-m6w7-qqqr) is *arbitrary file read via the dev server **on Windows***. Development-only, and nobody here develops on Windows.

- [ ] **Step 1:** Confirm esbuild is dev-only: `npm ls esbuild` — it should appear under devDependencies/tooling, not the runtime tree.
- [ ] **Step 2:** Either bump (`npm i -D esbuild@^0.28`) if it's a clean no-op, or dismiss the Dependabot alert as not-applicable with that reasoning. Both are defensible; do not leave it as unexplained noise.

---

# Workstream C — Auth hardening residue

The fallback credential is gone from the code and login was verified working on prod. Three loose ends remain.

### Task C1: Rotate the admin password

**Why:** the `admin123` hash sits permanently in git history (commits `ddc01e9b`, `28a7e52f`), and the account email `admin@evelynlearning.com` is guessable. The *current* password was set 2026-01-26 and is not in history, so this is precautionary rather than urgent.

- [ ] **Step 1:** Pick a strong password in a password manager.
- [ ] **Step 2:** Run (leading space keeps it out of shell history; single-quote so `$`/`!` aren't expanded):

```bash
cd ~/Dev/evelynlearning
 ADMIN_EMAIL=admin@evelynlearning.com ADMIN_PASSWORD='<new>' ENV_FILE=.env.local.production npx tsx scripts/seed-admin-user.ts
```

- [ ] **Step 3:** Verify sign-in at `/admin/login` **in a private window** (an existing session's JWT is valid 24h and won't exercise the login path).

### Task C2: Gate the admin PAGES (APIs are already covered)

**Survey already done — 2026-08-14. Read this before assuming scope:**

- **Every `/api/admin/*` route handler self-gates.** Zero API routes lack a `getServerSession` check. The data layer is protected.
- **22 files under `src/app/admin/` have no `useSession`/`getServerSession` check at all.**
- `src/app/admin/layout.tsx` does **not** gate — it renders `<AdminSessionProvider>` and nothing else. There is no redirect and no middleware, so a page that doesn't call `useSession({ required: true })` itself is reachable by an anonymous visitor.

**So the exposure is UI, not data**: an unauthenticated visitor can render admin page shells, but the API calls those pages make will 401. Before writing any fix, establish which of the 22 actually leak something — a page that only renders a shell and fetches through a gated API is a much smaller problem than one doing server-side data fetching in the component.

- [ ] **Step 1:** Regenerate the list (it will have drifted):

```bash
cd ~/Dev/evelynlearning
for f in $(find src/app/admin -name "*.tsx" | sort); do
  printf "%s %s\n" "$(grep -cE 'getServerSession|useSession' "$f")" "$f"
done | grep '^0 '
```

- [ ] **Step 2:** Triage each hit into: (a) a route `page.tsx` that needs gating, (b) a child component whose parent page gates — no change needed, or (c) intentionally public. Only (a) needs work; do not bulk-edit.
- [ ] **Step 3:** For each (a), add the one-liner `/admin/showcase/page.tsx:127` already uses:

```ts
// Session gate: redirects to /admin/login (authOptions.pages.signIn) when unauthenticated
useSession({ required: true });
```

- [ ] **Step 4:** Consider whether gating belongs in `layout.tsx` once, instead of 20+ times. That is the more durable fix, and the reason this keeps recurring — but it changes every admin page's render path, so it wants its own testing pass rather than being folded in here.
- [ ] **Step 5:** Commit: `fix(admin): gate the admin pages missing a session check`.

### Task C3: Stop accumulating stale build output on the server

**Why:** `deploy-to-production.sh` wipes `.next/` locally before building but never server-side, and `unzip -o` overwrites without deleting. Result: **1,108 orphaned chunk files**, three of which still contain the retired `admin123` hash from the Aug 11/12 builds. Not reachable over HTTP (server chunks are loaded by manifest, and 0 current manifests reference them) — but retired credentials lingering on disk make any future audit confusing.

- [ ] **Step 1:** Note that `.next/static` already has an orphan-prune step (`deploy-to-production.sh:152-154`) using a manifest keep-set. `.next/server` has no equivalent.
- [ ] **Step 2:** Extend the same manifest approach to `.next/server/chunks`, or add `rm -rf .next` on the server immediately before the unzip. The manifest approach is safer with a running process; the `rm -rf` is simpler but briefly leaves the live process without its chunk files — **verify which is safe before choosing.**
- [ ] **Step 3:** After the next deploy: `ssh root@84.247.185.169 'cd /root/evelynlearning && find .next/server/chunks -name "*.js" ! -newermt "<deploy time>" | wc -l'` → expect 0.

---

# Workstream D — Academy live-verification (repo: `~/Dev/academy`)

All four shipped to prod 2026-08-13 (`f28c494` academy, `22975c4c` evelyn) with unit tests but **no live confirmation**. These are verification tasks; each may generate follow-up work.

- [ ] **D1 — mm/dd/yyyy target date.** Open a course Overview → Pace card. The field should read `mm/dd/yyyy`, auto-insert slashes as you type digits, reject `02/30/2027`, and reject a past date. Then set a goal and reopen the edit form: it should pre-fill in the same format. *Known gap: the native calendar picker is gone; if that's missed on mobile, the "text field + calendar button" option from the original decision is the fallback.*
- [ ] **D2 — prerequisite cycle guard.** Org console → a CPHQ draft → pick an LO, add another LO as its prerequisite, then open that second LO. The first should no longer appear in its `+ add prerequisite` menu. Server-side rejection is covered by unit tests; this checks the menu filter.
- [ ] **D3 — taxonomy `sectionKey` fix (the important one).** Re-ingest the CPHQ PDF in the org console **3+ times**. Every run should produce a full taxonomy. The old failure was intermittent, so a single success proves nothing. If one fails, the reason is now named in the log: `ssh root@84.247.185.169 'pm2 logs evelyn-website --lines 200 --nostream | grep taxonomy-generate'`.
- [ ] **D4 — NAHQ showcase tracking.** Have someone **outside your network** open `evelynlearning.com/showcase/nahq` and enter the passcode. Then check `/admin/showcase` — the NAHQ card is first, above Hugo Mentors. *Your own visits are invisible by design: the tracking endpoint drops admin sessions and Brentwood, CA traffic, so an empty card is not proof nobody looked.*

---

# Workstream E — Smaller observations (unowned; triage before doing)

- [ ] **E1 — Empty sitemap.** Every academy deploy ends with `ping-indexnow: sitemap yielded no URLs`. The script treats it as non-fatal, but a sitemap returning zero URLs means IndexNow submissions are no-ops and crimsora.com may not be getting indexed. Start at `apps/web/app/sitemap.xml` and check whether it renders any entries in production.
- [ ] **E2 — 7 abandoned Gmail drafts.** Left over from the era when the generated draft was unusable. Now that the draft is fixed (`22975c4c`), they're dead weight in the mailbox and one of them was the cause of the Yakima mis-pointing. Delete them by hand, or re-draft those leads to regenerate.

---

## Self-review notes

- **Coverage:** every item listed in the 2026-08-14 handoff maps to a task — bounce-as-reply (A1–A4), dependency majors (B1–B3), auth residue (C1–C3), academy verification (D1–D4), plus two observations found in passing (E1–E2).
- **Ordering:** A first (live pipeline data is wrong right now). B/C/D/E are independent.
- **Type consistency:** `findInboundMessage` / `InboundMessage` / `isBounceSender` are used with identical names and shapes across A1→A2→A3→A4.
- **Deliberately NOT planned:** replacing `findInboundReply`'s callers beyond `reply-watcher.ts` — a grep at the time of writing shows it has exactly one caller. Re-run `grep -rn "findInboundReply" src` before Task A2 and fold in any new ones.
