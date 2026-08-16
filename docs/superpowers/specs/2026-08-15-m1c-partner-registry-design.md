# M1c — Partner Registry, Enforced Identity Namespacing, Per-Partner Limits

**Status:** design approved 2026-08-15, not yet planned or implemented.
**Decision this implements:** D15 of `academy/docs/superpowers/plans/2026-08-14-evelyntutor-platform.md`,
with two revisions recorded below.
**Depends on:** M1a (shipped 2026-08-15) — `apps/tutor` must be deployable alone to canary this.

---

## 1. The defect

Finding 6 of the platform review:

> `StudentProfile._id` namespacing is a convention, not an enforcement. The model header
> documents `${partnerId}:${externalStudentId}` for B2B, but `withPortalAuth` verifies the
> partner then passes the **raw body `studentId`** through. Two partners sending `user_1`
> would silently share one mastery/gaps/notes profile.

Confirmed in code: `apps/tutor/src/lib/tutor/portal/auth.ts` resolves and verifies `partnerId`
from the signed header, then hands the handler the parsed body untouched. Nothing derives a
namespaced key. HMAC prevents tampering *within* a partner; nothing prevents collision *across*
partners.

### 1.1 Measured production state (2026-08-15, read-only)

| Fact | Value |
|---|---|
| Partners configured (`PORTAL_PARTNER_SECRETS`) | `academy`, `crimsora`, `evelyn-marketing` — all first-party |
| `StudentProfile` documents | 495 |
| — already namespaced | 393 (`lmtest` 310, `trial` 68, `revtest` 7, `portalA` 6, `academy` 2) |
| — unnamespaced | 102 |
| `StudentProfile.partnerId` populated | **0 of 495** — the field exists and is dead |
| `EvidenceEvent.partnerId` populated | 7 of 2,423 |
| Unnamespaced ids appearing under **two** partners | **0** |

**No collision has ever fired.** This is a latent defect, not active corruption. That is what makes
a clean migration possible rather than a data-reconciliation exercise.

Rows referencing a `studentId`:

| Collection | total | with studentId | unnamespaced |
|---|---|---|---|
| `evidenceevents` | 2,423 | 2,423 | 2,366 |
| `learnerstateprojections` | 592 | 592 | 539 |
| `tutorsessions` | 1,462 | 261 | 219 |
| `learnerstatesnapshots` | 58 | 58 | 22 |
| `studenttopicnotes` | 22 | 22 | 21 |
| `mockattempts` | 7 | 7 | 7 |

### 1.2 Attribution

`TutorSession.sourcePartnerId` (with `sourceHost` / `source` as fallbacks) attributes **73 of the
102** unnamespaced profiles, with **zero ambiguity** — no student id resolves to more than one
partner. Distribution: `evelyn-marketing` 65, `crimsora` 6, `academy` 2.

The remaining **29 are orphans**: no session carries a partner signal. They are not junk — 19 carry
real mastery/gaps data, referenced by 19 `evidenceevents`, 17 `learnerstateprojections`, 10
`learnerstatesnapshots` and 1 `studenttopicnotes`, with activity as recent as 2026-08-11. They are
almost certainly retail `/tutor` and showcase users, who arrive with no partner by construction.

### 1.3 The single choke point

Exactly one file touches the model: `apps/tutor/src/lib/tutor/student-profile/store.ts`. No code
anywhere does `findById(studentId)` outside it. Identity resolution therefore has one place to live.

---

## 2. Decisions

### D15-R1 — Secrets are stored **encrypted**, not hashed

D15 says "hashed secret + rotation". **That is not implementable.** The portal contract
authenticates with an HMAC signature over the request body, so the engine must *recompute* the
signature, which requires the plaintext secret. A hash is one-way. The contract is frozen, so the
scheme cannot change to a hash-comparable bearer token.

Secrets are stored symmetrically encrypted at rest, with the key supplied by environment
(`PORTAL_SECRET_ENC_KEY`) and a `keyVersion` recorded per secret so the key itself can be rotated.
This preserves the operational property D15 wanted — a database dump alone yields no working
credential — by a different mechanism.

### D15-R2 — Namespacing is a **unique index on a surrogate `_id`**, not a derived key

D15 implies `_id` becomes `${partnerId}:${studentId}`. Rejected in favour of: `_id` keeps whatever
value it already has, and `StudentProfile` gains `partnerId` + `externalStudentId` under a unique
compound index.

Rationale:

1. **It eliminates the class of bug rather than reapplying the convention.** The original defect is
   that namespacing was *convention, not enforcement*. A derived key still depends on every call
   site remembering to prefix. A unique index makes the collision impossible in the database.
2. **The migration shrinks from ~3,275 rows to 102 field-additions.** `_id` never changes, so the
   other five collections — which reference it — do not move at all. MongoDB cannot update `_id`,
   so a derived key would require insert-plus-delete per profile with ~3,173 referencing rows
   updated in lockstep; a failure mid-run would leave a profile and its evidence pointing at
   different keys.
3. **Rollback is trivial and non-destructive:** drop the index, unset two fields.

Accepted cost: the profile key is no longer derivable, so resolution is a lookup (one choke point,
cacheable), and `_id` is opaque in logs rather than self-describing.

### D-new — Retail students get a reserved first-party partner row

Students arriving without a partner (retail `/tutor`, showcase, and the 29 orphans) are namespaced
under a real registry row, `evelyn`, with `kind: 'first-party'`. Every profile then has exactly one
key shape and the auth path has no special case. That row never authenticates via HMAC.

Rejected: namespacing by `TutorSession.source` (`tutor:` / `showcase:`), which would put two
vocabularies in one key space and let a future partner be named `tutor`. Also rejected: leaving
retail unnamespaced, which is grandfathering under another name.

### D-new — Counters live in **MongoDB**, not the Redis already on the box

Redis is running on the production host (`127.0.0.1:6379`) but belongs to another application, is
loopback-bound, and **M1b adds a second node** — at which point localhost Redis is invisible to it
and the store would migrate anyway. MongoDB is already the engine's only datastore, is already
remote, and is correct across nodes on day one. At three first-party partners and 1,462 lifetime
sessions, the ~1-2ms per atomic `$inc` versus Redis's ~0.2ms is immaterial. Redis remains the
documented upgrade path if volume ever justifies it.

### D-new — Burst limits fail **open**; quotas fail **closed**

If the counter store is unavailable, burst limiting is skipped and the request is served. Crimsora
is live paying traffic; an unmetered request is a better failure than a 503 mid-session. Quotas are
a billing construct and fail closed with a logged alert. Both paths emit a distinguishable log line
so the condition is visible rather than silent.

---

## 3. The `Partner` collection

```
_id               string    partner slug: 'crimsora' | 'academy' | 'evelyn-marketing' | 'evelyn'
name              string    display name
kind              enum      'partner' | 'first-party' | 'test'
status            enum      'active' | 'suspended'
secrets           array     { ciphertext, keyVersion, label, createdAt, expiresAt? }
allowedEndpoints  string[]  '/api/portal/v1' route prefixes
limits            object    { rpm, burst, dailyQuota }
flagOverrides     object    Record<string, boolean | string>
metering          object    { plan, ... }
createdAt         string
updatedAt         string
```

**Rotation** works by permitting more than one live secret: add the new secret, both verify, retire
the old after the partner has cut over. No coordinated cutover is required, and rotation never has
a window where neither secret works.

`kind: 'first-party'` marks rows that exist to own a namespace rather than to authenticate.
`withPortalAuth` refuses to authenticate a first-party row, so `evelyn` cannot be used as an API
credential even if a secret were added to it by mistake. `kind: 'test'` marks the rows created for
historical test prefixes (`lmtest`, `trial`, `revtest`, `portalA`) so that fixture data has a valid
registry reference without appearing in partner-facing lists or billing; these also cannot
authenticate.

**Secret resolution is cached.** `withPortalAuth` currently reads secrets from an environment
variable — free. A registry lookup on every authenticated request would put a database read on the
hot path of a live voice session. The resolver caches partner rows in-process with a short TTL
(60s) and an explicit invalidation hook used by the admin write path. A cache miss falls through to
a read; a read failure is treated as `unknown_partner` (`401`) rather than failing open, because
authentication is the one place where failing open is never acceptable.

If a stored secret fails to decrypt — wrong or rotated `PORTAL_SECRET_ENC_KEY` — the partner is
treated as unauthenticated (`401`) and the condition is logged distinctly from a genuine signature
mismatch, so a key-management fault is not misdiagnosed as a partner integration bug.

---

## 4. Identity resolution

`StudentProfile` gains:

```
partnerId          string   indexed, required after migration
externalStudentId  string   the raw id the partner sent
```

with a **unique compound index on `{ partnerId: 1, externalStudentId: 1 }`**.

`store.ts` gains `resolveProfileId({ partnerId, externalStudentId })`, which finds-or-creates and
returns the surrogate `_id`. New profiles receive `crypto.randomUUID()` as their `_id` — opaque,
collision-free, and not derived from anything a partner controls. Every existing store function
continues to key by `_id`; only the entry points change to resolve first.

**Find-or-create must be a single atomic upsert, not a read-then-write.** Two concurrent requests
for the same new student would otherwise both miss and both insert, and the second insert would be
rejected by the unique index — surfacing as a request failure for a legitimate student. The
resolver issues one `findOneAndUpdate` with `upsert: true` keyed on `(partnerId,
externalStudentId)`, and treats a duplicate-key error as "someone else won the race, re-read".

`withPortalAuth` supplies `partnerId` from the verified header — handlers never choose it. Internal
and retail paths follow §4.0: embed token's `partner_id` when one is present, `'evelyn'` only for
genuinely retail traffic.

Two partners sending `user_1` produce two documents, because the index refuses otherwise.

---

## 4.0 Where `partnerId` comes from — and why `'evelyn'` is not the internal-route answer

`withPortalAuth` supplies `partnerId` for `/api/portal/v1/**`. An earlier draft of this section said
the internal `/api/tutor/**` and retail paths "supply `'evelyn'`". **That is wrong, and it would have
split every partner-embedded student in two.**

The tutor UI a partner's students actually sit in is `tutor-portal/embed`, and it commits in-session
state through the **internal** routes — `POST /api/tutor/student-profile/{id}` for mastery deltas,
gaps and segment-outcome evidence, and `PATCH /api/tutor/topic-notes/{id}/{baselineId}` for notes.
Hardcoding `'evelyn'` there while the partner's own server-to-server reads resolve under
`auth.partnerId` gives the same student **two** surrogate profiles — `('evelyn', X)` and
`('academy', X)` — and, since §4.1 extends resolution to six collections, the split spans all of them.
A full session would write gaps, mastery and notes to the `evelyn` profile while
`/api/portal/v1/gaps`, `/mastery` and `/learner-state` returned empty for that student, permanently.
That is the cross-partner split-brain this milestone exists to prevent, arriving through the front
door.

**The rule:**

1. `/api/portal/v1/**` → the `partnerId` verified by `withPortalAuth`.
2. An internal `/api/tutor/**` route serving an **embedded** session → the `partner_id` claim of the
   verified embed token. It is a required claim on `EmbedTokenPayload`, and `checkEmbedAuth` already
   returns the payload — `student-profile/[id]/route.ts` holds it and currently ignores it.
3. Genuinely retail traffic, with no embed token → `'evelyn'`.

**The token is optional on internal routes, and that is deliberate.** An earlier draft of this section
said these routes "must gain embed-token auth" before the flip. That over-reached, and Task 5's second
review caught it: `/tutor` and `/tutor/settings` are **retail** surfaces that legitimately have no
embed token, so making one mandatory returns 401 to real users the moment the code deploys — before
any flag is flipped, defeating the point of gating.

The correct rule for an internal route is therefore:

- **Token absent** → retail. Use `'evelyn'`. Do **not** 401; this is the pre-existing behaviour and
  must not regress.
- **Token present but failing verification** → this is **not** retail, and must not be treated as
  such. Reject it (401) and log the reason. Falling back to `'evelyn'` here looks safe and is not: a
  partner session whose token expires past the grace window mid-session would have every subsequent
  write land under `('evelyn', rawStudentId)`, colliding with any retail user sharing that external
  id — the split-brain this milestone exists to prevent, reached through a degraded token rather than
  a missing one. In `'on'` mode `checkEmbedAuth` returns `{allow:false}` with no log line, so the
  misattribution would leave no trace at all. Retail is unaffected by this rule, because retail sends
  no token; only a genuinely broken token errors, which is the correct and actionable outcome.
- **Token present** → it must be *valid and student-bound*. Derive `partner_id` from it. A token that
  fails verification, or whose `student_id` does not bind to the path's student, must **not**
  contribute a partner id — otherwise a caller who obtained any signed token could choose whose
  namespace to write into. Note `checkEmbedAuth` currently returns its payload alongside a
  `student_mismatch` reason, and in `log` mode allows the request: the payload must not be trusted for
  partner derivation in that case.

This keeps the partner-embedded split closed (embed clients do send tokens) without breaking retail.
It leaves the pre-existing unauthenticated-write exposure on `/api/tutor/topic-notes/**` exactly as it
was — that is a separate security item, not something M1c should fix by breaking retail.

**Known asymmetry, recorded not fixed:** `verifyEmbedToken` resolves secrets from the environment via
`getPartnerSecret` and applies none of the registry checks `withPortalAuth` enforces — `kind ===
'partner'`, `status !== 'suspended'`. Now that an embed token picks a write namespace, a suspended
partner whose secret is still in `PORTAL_PARTNER_SECRETS` keeps that ability after the portal API has
cut it off. Routing embed verification through the registry is the fix; it is out of M1c's scope.

## 4.1 Which stores use the resolved id — and which do not

**Every student-keyed write uses the resolved `profileId`, not the raw `externalStudentId`.** That
means `StudentProfile._id`, `EvidenceEvent.studentId`, `LearnerStateProjection.studentId` (and its
derived `_id`), `LearnerStateSnapshot.studentId`, `StudentTopicNotes._id` prefix, `MockAttempt.studentId`,
and `EloRating`'s `student:<id>|<subject>` rows.

This was under-specified in the first draft of this document and Task 5's review caught it. §11's
"out of scope" clause is about **existing rows**, which genuinely never move; it says nothing about
**new writes**. Left unstated, the engine would have moved `StudentProfile` onto a surrogate key while
five other collections kept the raw partner-supplied id — so two partners sending `user_1` would get
two profiles but still share one Elo rating, one projection and one set of topic notes. That is the
milestone's own premise, half-fixed.

The collections are one identity space, not two. `scripts/backfill-evidence.ts` writes
`studentId: profile._id` directly, and before this milestone the profile `_id` and the raw student id
were the same value, so every collection agreed by construction.

**The one exception:** `EloRating` holds two kinds of row. `item:<itemId>` and `lo:<loId>:d<n>` are
item-difficulty rows, genuinely global and correctly partner-agnostic — they must **not** be resolved.
Only the `student:<id>|<subject>` rows are a student key.

## 4.2 `externalStudentId` is the id exactly as the partner sends it

`externalStudentId` is the **full, unmodified** string the partner transmits — never a substring of it.

Before M1c, `getOrCreateStudentProfile(studentId)` used the raw request id as the profile `_id`, so an
existing `_id` **is** by definition what that partner sends. The backfill therefore sets
`externalStudentId = _id` unchanged and attributes `partnerId` separately.

An earlier draft of §5 said to split a prefixed `_id` such as `academy:user1` on the first colon into
`partnerId: 'academy'` / `externalStudentId: 'user1'`. That is wrong: the partner sends
`academy:user1`, so after the flip `resolveProfileId('academy', 'academy:user1')` would miss the
backfilled row and mint a blank profile — the precise outcome the flag exists to prevent, for 393 of
the 495 rows. A prefix may be used as a *hint* for attributing `partnerId`; it is never removed from
`externalStudentId`.

(Live partners are unaffected either way — `User.engineStudentId` in the portal is "the opaque,
unguessable UUID minted at signup", so academy and crimsora send bare UUIDs. The prefixed rows are
test and trial fixtures. The rule is stated because correctness should not rest on that.)

## 5. Migration

A single idempotent script with a mandatory dry-run mode:

1. For each **unnamespaced** profile: attribute via `TutorSession.sourcePartnerId`; unattributable →
   `evelyn`. Set `partnerId`, and set `externalStudentId = _id`. `_id` is not touched.
   **`sourceHost` and `source` are NOT partner identifiers and must not be used as a fallback.**
   An earlier draft said to fall back to them. `source` is the fixed enum
   `"tutor" | "embed" | "showcase" | "test"` — coercing `'embed'` into a `partnerId` would mint a
   fictitious partner — and `sourceHost` is a hostname with no host→partner mapping anywhere in the
   repo. A fallback that can only produce a wrong answer is worse than the deliberately conservative
   `evelyn` default.
2. For each **already-prefixed** profile (`lmtest:`, `trial:`, `revtest:`, `portalA:`, `academy:`):
   use the prefix as the `partnerId` **hint**, but still set `externalStudentId = _id` in full — see
   §4.2. Do **not** split the prefix off. `_id` is not touched.
3. Create registry rows **only** for `evelyn` and for `kind: 'test'` prefixes. **The backfill must
   never create a `kind: 'partner'` row.** A row with `secrets: []` and `allowedEndpoints: []` wins
   over the environment fallback (`registry.ts`: "the registry row WINS once it exists"), so
   `withPortalAuth` would return `401 unknown_partner` for that partner within one 60s cache TTL —
   i.e. the migration would take the live portal API offline for `academy` and `crimsora`, and the
   documented rollback (drop the index, unset two fields) would not undo it. If an observed
   `partnerId` needs a real partner row, **abort** and tell the operator to run the seed (§10 step 1)
   first. Seeding credentials is the seed script's job, not the backfill's.
4. Build the unique index.

**The real verification is `already-migrated == 0` in the dry run, not the index build.** An earlier
draft claimed the build was the check. It overstates: every stamped row gets
`externalStudentId = _id`, and `_id` is the primary key, so `(partnerId, externalStudentId)` is unique
**by construction** and the build will succeed regardless — proving nothing about attribution. The
only way a duplicate could arise is a row that already carries identity fields where
`externalStudentId ≠ _id`, which is exactly what a non-zero `already-migrated` count reports. Do not
lean on the index build as a safety net; read the dry-run summary.

(Confirmed against production 2026-08-16: `already-migrated 0`, `ambiguous 0`, `existing-prefix 393`,
`sourcePartnerId 75`, `orphan-default 29`, total 497 — nothing written.)

**Rollback:** drop the index, `$unset` the two fields. Because `_id` never changed, nothing else in
the database is affected and no other collection needs a compensating change.

The dry-run must report the full attribution table — every profile, its inferred partner, and the
signal used — for review before the write pass runs.

---

## 6. Limits, quotas, metering

Counter documents are keyed `(partnerId, endpoint, windowKind, windowStart)` with a TTL index, and
incremented by an atomic `$inc` upsert. There are **two documents per request**, not one, because
the granularities differ: a minute-window document for burst, and a day-window document that serves
both quota and metering. The day document is the one that survives long enough to be billed from;
the minute document expires by TTL within the hour.

Together they serve three purposes:

- **Burst** — `limits.rpm` / `limits.burst` over a fixed window; exceeding returns `429` with
  `Retry-After`. Fails open.
- **Quota** — `limits.dailyQuota`; exceeding returns `402`. Fails closed, **but only for partners
  that actually have a `dailyQuota` configured** (see below).
- **Metering** — the per-`(partnerId, endpoint, day)` counter is the billing substrate, produced as
  a byproduct rather than by a second code path.

### 6.1 Reconciling the two failure policies

Stated naively, these contradict each other. Both counters live in the same store, so if that store
is unavailable, quota's fail-closed rejects the request and burst's fail-open never gets to matter —
the opposite of the intent, which is that a student mid-session should not be 503'd.

Resolved two ways:

1. **Fail-closed applies only when a `dailyQuota` is configured.** A partner with no quota — which
   is every partner today — is unaffected by a counter-store outage, so the system degrades to
   unmetered service rather than refusing traffic. Fail-closed protects revenue only where there is
   revenue to protect, and there it is the correct trade.
2. **Choosing MongoDB makes the scenario narrow anyway.** The counter store is the engine's primary
   datastore, so "counters unavailable but the engine serving" is close to unreachable: without
   Mongo there are no profiles, no plans and no sessions. This is a real advantage of Mongo over
   the Redis alternative, where a Redis outage would be an *independent* failure mode that the
   engine would otherwise survive — and would have made these policies load-bearing rather than
   theoretical.

The existing in-memory `packages/core/src/utils/rate-limit.ts` is **not** replaced. It guards
marketing and showcase routes, has a different threat model, and unifying the two is out of scope.

---

## 7. Allowed endpoints and flag overrides

`allowedEndpoints` is matched against the route prefix in `withPortalAuth` before the handler runs.
Existing partners are provisioned with all 23 `/api/portal/v1/**` routes, so behaviour is unchanged
on day one; new partners are provisioned narrowly.

`flagOverrides` rides on the auth context. The orchestrator reads flags through a resolver that
falls back to today's build-time `NEXT_PUBLIC_*` constants when a partner specifies no override.
M1c builds only this channel — per-brand CNAME and token-carried overrides remain D12.

---

## 8. Error semantics

| Condition | Response |
|---|---|
| Unknown partner | `401 unknown_partner` *(unchanged)* |
| Partner suspended | `403 partner_suspended` |
| Endpoint not in allowlist | `403 endpoint_not_allowed` |
| Burst limit exceeded | `429` + `Retry-After` |
| Daily quota exhausted | `402 quota_exceeded` |

Every new code is additive. The frozen contract's existing `401` path is untouched, so Crimsora
observes no behavioural change.

---

## 9. Testing

Following the repo's script-based oracle (`npm run test:all`, currently 181 entries):

- `resolveProfileId` find-or-create semantics.
- **Collision test:** two partners sending `user_1` produce two distinct profiles — **and distinct
  projections, topic notes and Elo student rows**. Asserting only on `StudentProfile` would pass a
  design that half-fixes the milestone's premise (§4.1).
- **Round-trip test:** every backfilled profile resolves, using the id the partner actually
  transmits, back to its own `_id` and not to a new one (§4.2).
- Secret rotation with two live secrets; verification succeeds under both; a retired secret fails.
- First-party rows cannot authenticate.
- Limiter window boundaries, and explicit tests for **both** failure policies — burst fails open,
  quota fails closed.
- Allowlist enforcement, including a route just outside an allowed prefix.
- Backfill **idempotency** (running twice is a no-op) and dry-run purity (no writes).

---

## 10. Rollout

Each step is independently reversible:

1. Ship the `Partner` collection and seed it from `PORTAL_PARTNER_SECRETS`; env still wins.
2. Backfill dry-run; review the attribution table.
3. Backfill write pass.
4. Build the unique index — the migration's own verification.
5. Flip the secret source to the registry; keep env as fallback for one deploy.
6. Enable limits in **report-only** mode; observe.
7. Enforce.

---

## 11. Out of scope

- Replacing marketing's in-memory rate limiter.
- Per-brand CNAME and token-carried flag overrides (D12).
- pm2 cluster mode and the second node (M1b).
- Canonicalizing LO ids through the concept registry (D16).
- Migrating the five collections that reference `_id` — by design, they never need to move.

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| Mis-attribution of the 29 orphans | They go to `evelyn`, which is where retail users belong anyway; the dry-run table is reviewed before any write. |
| `PORTAL_SECRET_ENC_KEY` lost | Secrets become unrecoverable and every partner must re-key. Key must be backed up alongside other production secrets before step 5. |
| Index build fails on unexpected duplicates | This is the desired behaviour — it blocks the migration rather than corrupting silently. Resolve the duplicate, re-run. |
| A new write path forgets to resolve | The unique index catches a genuine duplicate; a code-review rule plus the single choke point in `store.ts` is the primary guard. |
| Report-only mode left on indefinitely | Step 7 is an explicit gate with its own verification. |
