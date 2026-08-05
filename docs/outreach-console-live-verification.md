# Outreach Console — Live Verification Checklist

This is the handoff checklist for a human operator with real credentials
(Google Cloud console access, the `praveen@evelynlearning.com` Gmail account,
and DB access) to exercise the B2B outreach console end-to-end. None of this
was runnable by the implementing agent — it requires an authenticated admin
session, live Gmail API access, and DB writes, all of which were out of
scope for the automated build/test/typecheck pass.

Work through the items in order; later items build on state created by
earlier ones (a connected Gmail account, an approved lead with a sent
thread, etc).

---

## 0. Confirm a real AdminUser row exists (do this FIRST)

`src/lib/auth.ts:8-14,53-66` has a hardcoded fallback admin
(`admin@evelynlearning.com` / `admin123`) that authenticates whenever no
`AdminUser` document exists in the database yet. `getServerSession(authOptions)`
is what gates every route in this checklist, including the OAuth connect in
§3 — so until a real `AdminUser` row exists, that gate can be satisfied by
the hardcoded fallback credentials, and whoever passes them gets a session
able to read the outreach inbox and compose mail as
`praveen@evelynlearning.com`.

Before proceeding to §3 (Connect Gmail):

1. Confirm at least one `AdminUser` document exists in the production
   database (`db.adminusers.countDocuments()` or equivalent), with a real,
   non-default password hash.
2. If none exists, create one first (see the admin-user seed/creation path
   for this codebase) and verify login with those real credentials at
   `/admin/login` — do **not** proceed using the fallback
   `admin@evelynlearning.com` / `admin123` credentials.
3. Only once a real `AdminUser` row makes the fallback unreachable should you
   complete the OAuth connect in §3 below.

---

## 1. Prerequisites — GCP + env setup

The outreach Gmail integration uses its own OAuth client, **separate from**
`GOOGLE_CLASSROOM_*` — do not reuse that client. See
`.env.local.example` lines 59–71 for the canonical documented shape.

1. In the GCP console, create a new OAuth 2.0 Client ID of type **Web
   application**.
2. Enable the **Gmail API** for that GCP project (APIs & Services → Library).
3. Add **Authorized redirect URIs**. These must match `GMAIL_OUTREACH_CALLBACK_URL`
   byte-for-byte — Google compares the string exactly, and `www.` vs the apex
   counts as different. Production is canonical on **www** (`NEXT_PUBLIC_SITE_URL`
   in `.env.local.production` is `https://www.evelynlearning.com`), so register:
   - `https://www.evelynlearning.com/api/admin/outreach/gmail/callback` (prod — use this one)
   - `https://evelynlearning.com/api/admin/outreach/gmail/callback` (apex, register as a safety net)
   - `http://localhost:3006/api/admin/outreach/gmail/callback` (dev — port
     3006 matches the value baked into `.env.local.example`)

   A mismatch here is the worst failure mode to debug: Google refuses at its own
   consent screen and never redirects back, so no `?gmail_error=` ever reaches
   the console and the chip just stays disconnected. If that happens, read the
   error on Google's page — it will say `redirect_uri_mismatch`.
4. Under **OAuth consent screen**, set User type = **Internal**. `evelynlearning.com`
   is on Google Workspace (`MX = SMTP.GOOGLE.com`), so this is available, and it is
   the option you want for two reasons:
   - The two Gmail scopes are "sensitive", so an **External** app would need
     Google's verification review before it could be published.
   - **Refresh tokens issued by an External app in "Testing" status expire after
     7 days.** That would silently break the reply watcher every week —
     `getOutreachGmail()` would start throwing `invalid_grant` and each console
     action would surface a Gmail error until someone reconnected by hand.
   Internal avoids both: no review, and non-expiring refresh tokens.
5. Set these env vars (dev: `.env.local`; prod: `.env.local.production`,
   shipped via `./deploy-update.sh` — **not** `npm run deploy`, which ships
   to a dead directory):
   ```
   GMAIL_OUTREACH_CLIENT_ID=<client id from step 1>
   GMAIL_OUTREACH_CLIENT_SECRET=<client secret from step 1>
   GMAIL_OUTREACH_CALLBACK_URL=https://www.evelynlearning.com/api/admin/outreach/gmail/callback   # www — must match the GCP entry exactly; localhost:3006 variant in dev
   GMAIL_OUTREACH_USER=praveen@evelynlearning.com
   ENABLE_OUTREACH_WATCHER=true
   ```
   `GMAIL_OUTREACH_USER` is the only account the console will ever treat as
   "connected" — `src/lib/outreach/gmail.ts` `getOutreachAccount()` and the
   callback's account-match check (`src/app/api/admin/outreach/gmail/callback/route.ts`)
   both key off it.
6. Restart the app after setting env vars (Next.js reads `process.env` at
   boot; `ENABLE_OUTREACH_WATCHER` in particular is only read once, in
   `src/instrumentation.ts`, 5s after process start).

**Expected result:** app boots without `[Instrumentation] Outreach reply
watcher disabled` in the logs; `/admin/outreach` loads without a "Connect
Gmail" 500.

---

## 2. Import leads

```bash
npx tsx scripts/import-leads.ts <file.json>                          # dry-run, no DB access needed
MONGODB_URI=... npx tsx scripts/import-leads.ts <file.json> --apply  # writes
```

- Input is a JSON array matching the `Lead` schema (`src/models/Lead.ts`).
  `status`, `demoToken`, `gmailThreadIds`, `touches`, `demoVisits` on input
  rows are stripped and ignored; `currentDraft.gmailDraftId` /
  `currentDraft.gmailThreadId` are stripped too (a pre-written draft's body
  survives import, its Gmail ids don't — see amendment A4 in the plan).
- Every imported row lands with `status: "staged"`.
- Dedup key on `--apply` is `(company, decisionMaker.email)` — a repeat
  import of the same file is a no-op past the first run.

**Expected dry-run output:** `[DRY RUN] no writes. Re-run with --apply to
insert.` followed by `{ valid, invalid, inserted: 0, skippedDupes: 0, errors: [] }`.
Any `invalid` rows list `row <i> (<company>): <failed-field-names>` in
`errors`.

**Expected apply output:** `{ valid, invalid, inserted, skippedDupes, errors }`
with `inserted` matching the number of new (non-dupe) valid rows. Confirm
in the console's Review tab that the count of staged leads increased by
`inserted`.

---

## 3. Connect Gmail

1. Open `/admin/outreach`, click **Connect Gmail** in the header
   (`src/app/admin/outreach/OutreachConsole.tsx`, ~line 237 — links to
   `/api/admin/outreach/gmail/auth`).
2. Expect a redirect to Google's consent screen, scoped to
   `gmail.compose` + `gmail.readonly`
   (`GMAIL_OUTREACH_SCOPES` in `src/lib/outreach/gmail.ts`), with
   `login_hint=praveen@evelynlearning.com`.
3. Approve as `praveen@evelynlearning.com`.
4. Expect redirect back to `/admin/outreach?gmail=connected`, which the
   client strips from the URL; the header chip flips to **"Gmail connected
   (praveen@evelynlearning.com since <date>)"**.
5. Confirm one `OutreachToken` document now exists for that account (its
   `refreshTokenEnc` field is encrypted — don't expect readable content).

**Negative test — wrong account:**

1. Click **Connect Gmail** again, but on Google's consent screen switch to
   or sign in as a *different* Google account and approve.
2. Expected: redirect back to `/admin/outreach?gmail_error=wrong_account`,
   surfaced by the header as a red "Gmail connect failed: wrong_account"
   banner (dismissable, `X` button).
3. Confirm **no** `OutreachToken` write happened for the wrong account, and
   the previously-connected token (if any) is untouched — the account-match
   check in `src/app/api/admin/outreach/gmail/callback/route.ts` compares
   `profile.data.emailAddress` against `GMAIL_OUTREACH_USER` and returns the
   `wrong_account` redirect **before** any `OutreachToken.findOneAndUpdate`
   call, so the DB is never touched on this path.

---

## 4. Review queue

On the **Review** tab (`src/app/admin/outreach/ReviewQueueTab.tsx`), for a
`staged` lead:

- **Approve**: `status` → `approved`, a `demoToken` is minted (if not
  already set) via `randomBytes(8).toString("base64url")`, and
  `nextActionAt` is set to now — so the lead should immediately appear in
  the **Today** tab's due list. (`src/app/api/admin/outreach/leads/[id]/route.ts`,
  `case "approve"`.)
- **Edit**: patches any of `company`, `segment`, `about`, `whyFit`,
  `useCaseHypothesis`, `decisionMaker`, `website`, `source`, `notes`,
  `nextActionAt`, `currentDraft` in place; status is unchanged.
- **Kill**: `status` → `dead`, `nextActionAt` cleared to `null`; the lead
  drops out of Review and Today, and shows as Dead in Pipeline.

**Expected:** counts in the tab-bar badges (Review/Today/Pipeline) update
immediately after each action via the console's `refresh()`.

---

## 5. Draft + send (Today tab)

On an `approved` lead in **Today**
(`src/app/admin/outreach/TodayTab.tsx`):

1. If there's a pre-written `currentDraft` (from import) with
   `channel: "email"` and no `gmailDraftId` yet, a **"Create Gmail draft"**
   button appears — click it. This calls
   `POST /api/admin/outreach/leads/[id]/draft`
   (`src/app/api/admin/outreach/leads/[id]/draft/route.ts`), which calls
   `createOutreachDraft()` in `src/lib/outreach/gmail.ts` and creates a
   **real** Gmail draft via `gmail.users.drafts.create`.
2. Open Gmail as `praveen@evelynlearning.com` → Drafts. Confirm a new draft
   exists, addressed to `lead.decisionMaker.email`, with the subject/body
   matching what's shown in the console.
3. Back in the console, an **"Open draft in Gmail"** link should now be
   present (`https://mail.google.com/mail/u/0/#drafts?compose=<draftId>`)
   and the **"Mark Email sent"** button should now be enabled (it's
   disabled until `lead.currentDraft.gmailThreadId` exists).
4. In Gmail, send the draft.
5. Back in the console, click **"Mark Email sent"**. This calls
   `POST .../mark-sent` with `{ channel: "email" }`
   (`src/app/api/admin/outreach/leads/[id]/mark-sent/route.ts`).

**Expected:** `lead.currentDraft.gmailThreadId` gets pushed onto
`lead.gmailThreadIds` (dedup'd) and `lead.currentDraft` is cleared to
`null`. `lead.status` advances per the cadence (see §7) and an outbound
`touch` is appended. Confirm via the Pipeline tab or a direct DB read that
`gmailThreadIds` contains the real Gmail thread id and `currentDraft` is
gone.

---

## 6. Reply

1. From the recipient's (test) email account, reply to the thread sent in
   §5.
2. In the console header, click **"Check replies now"**
   (`OutreachConsole.tsx` → `POST /api/admin/outreach/watcher` →
   `runReplyCheck()` in `src/lib/outreach/reply-watcher.ts`).

**Expected:**
- `lead.status` → `"replied"`.
- An inbound `touch` is appended with `direction: "inbound"`,
  `channel: "email"`, and `gmailMessageId` set to the reply's Gmail message
  id (`reply-watcher.ts`, the `lead.touches.push(...)` block).
- `lead.nextActionAt` → `null`.
- The lead disappears from the **Today** tab (Today only shows
  `approved`/`contacted` leads with a due `nextActionAt` —
  `TodayTab.tsx` filter at the top of the file).
- The response body of the POST includes `{ success: true, stats: { checkedThreads, repliesFound, errors } }` with `repliesFound >= 1`.

---

## 7. Cadence (4-step channel-aware sequence)

Sequence and delays live in `src/lib/outreach/cadence.ts`:
`SEQUENCE_CHANNELS = ["email", "linkedin", "email", "email"]`,
`FOLLOW_UP_DELAYS_DAYS = [1, 3, 6]`, `MAX_OUTBOUND_TOUCHES = 4`.

On a fresh test lead, call mark-sent four times in a row (any channel is
fine for the counter — it's channel-blind, i.e. marking LinkedIn sent still
consumes a step of the email-heavy sequence):

| Mark-sent # | Expected `status` | Expected `nextActionAt` |
|---|---|---|
| 1st | `contacted` | now + 1 day |
| 2nd | `contacted` | now + 3 days |
| 3rd | `contacted` | now + 6 days |
| 4th | `parked` | `null` |

Also confirm the Today-tab **"Next: …"** hint
(`TodayTab.tsx`, `SEQUENCE_STEP_LABELS[outboundCount]`) advances in step
with the outbound touch count:
`Intro email` → `LinkedIn note` → `Email bump` → `Breakup email`, then
disappears once `expectedNextChannel()` returns `null` after the 4th send.

---

## 8. Late reply to a parked lead (amendment A3)

1. Continue from §7's now-`parked` lead (its breakup email thread id is in
   `gmailThreadIds`).
2. From the recipient account, reply to that breakup thread — days later
   is fine, this is exactly the "late reply" case A3 exists for.
3. Run the watcher (button or wait up to 15 min if
   `ENABLE_OUTREACH_WATCHER=true`).

**Expected:** the lead flips `parked` → `replied` exactly like §6, even
though it was no longer `contacted`. This works because
`runReplyCheck()`'s query explicitly includes `parked` alongside
`contacted`:
```ts
Lead.find({ status: { $in: ["contacted", "parked"] }, gmailThreadIds: { $exists: true, $ne: [] } })
```
(`src/lib/outreach/reply-watcher.ts`).

---

## 9. Reply-in-thread vs. fresh thread (amendment A2)

On a lead that already has a sent thread (`gmailThreadIds` non-empty):

1. Draft a second email (e.g. the "bump" step) via
   `POST /api/admin/outreach/leads/[id]/draft` with **no** `newThread` flag.
   **Expected:** the new Gmail draft threads onto the existing thread — in
   Gmail, subject is `Re: <original subject>` (not double-prefixed if it
   was already `Re:`), and `In-Reply-To`/`References` headers point at the
   thread's latest non-draft message's `Message-ID`. Verify the draft shows
   up inside the same Gmail conversation as the original send, not as a
   separate thread. (`src/lib/outreach/gmail.ts`,
   `createOutreachDraft()` — the `if (args.threadId)` branch.)
2. Draft again, this time with `{ ..., newThread: true }` in the POST body.
   **Expected:** a brand-new, unrelated Gmail thread is created instead —
   `threadId` is omitted from the Gmail API call in this case
   (`src/app/api/admin/outreach/leads/[id]/draft/route.ts`, the
   `threadId = lead.gmailThreadIds.length > 0 && newThread !== true ? ... : undefined` line).

---

## 10. Demo link (`/d/[token]`)

1. On an approved lead (Today or Pipeline tab), copy its **Demo link**
   (`${NEXT_PUBLIC_SITE_URL}/d/<demoToken>`).
2. Open it in a browser (or `curl -i`).

**Expected:** a `302` redirect. Target path is
`landingPathForSegment(lead.segment)` from
`src/lib/outreach/segment-landing.ts`, e.g. `nursing_program` →
`/solutions/nursing`. **Note:** the `/solutions/*` pages themselves ship
from the separate `solutions-pages` branch — until that branch merges,
unmapped/not-yet-built segments (and `library`/`other`) resolve to `/`,
which is expected, not a bug.
3. Back in the console (Today and/or Pipeline tab), confirm a blue
   **"Visited <relative time> ago"** chip now renders on that lead
   (`TodayTab.tsx`'s `lastVisit` chip, sourced from
   `lead.demoVisits[lead.demoVisits.length - 1]`). The route writes onto
   `demoVisits` with a capped `$slice: -50` (`src/app/d/[token]/route.ts`).
4. Sanity-check the "never leak whether a token exists" property: hit
   `/d/<garbage-token>` and confirm it also 302s to `/` (not a 404 or 500).

---

## 11. Watcher (background cron)

With `ENABLE_OUTREACH_WATCHER=true` set and the app restarted:

1. Confirm the header's **"Watcher active"** chip (green) is showing on
   `/admin/outreach` — this reflects
   `GET /api/admin/outreach/watcher` → `isReplyWatcherActive()`.
2. Send a reply to a recorded thread (as in §6) but **do not** click
   "Check replies now."
3. Wait up to 15 minutes (`startReplyWatcher('*/15 * * * *')` in
   `src/instrumentation.ts`) and confirm, without any manual action, the
   lead flips to `replied` per §6's expected state. Server logs should show
   `[Reply Watcher] Running scheduled check at ...` and a completion line
   with `repliesFound: 1` on the tick that catches it.

---

## Notes for the operator

- Every route above sits behind `getServerSession(authOptions)` — all
  requests must come from an authenticated admin browser session; there is
  no separate service-account path. That gate is only as strong as the admin
  accounts behind it, though — see §0 above: until a real `AdminUser` row
  exists, `authOptions`' hardcoded fallback admin can satisfy this same
  check.
- The reply watcher **only** polls Gmail thread ids already recorded on a
  lead (`lead.gmailThreadIds`) — it never lists or searches the wider
  inbox. This is deliberate (see the comment atop
  `src/lib/outreach/reply-watcher.ts`) and worth re-confirming visually in
  Gmail's API activity/audit log if available, since it's a meaningful
  privacy/scope boundary.
- The pre-existing security gap flagged in the plan's self-review notes —
  `/admin/prospecting` and `/api/admin/prospecting` are ungated — is
  **not** addressed by this console and is out of scope here; it should be
  tracked and closed separately.
