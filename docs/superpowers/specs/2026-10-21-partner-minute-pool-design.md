# Partner minute pool — design (2026-10-21)

A per-partner pool of free tutoring minutes, enforced by the engine, first used to give GameClass 300 wall-clock minutes for their launch announcement. Decided with Praveen on the 21 Oct GameClass call follow-up.

## 1. Intent

GameClass is about to announce the partnership on LinkedIn and re-enable the tutor for logged-out viewers. Every tutor minute is real model and voice spend on our side (≈$0.13/min all-in, measured 10-20), and today nothing in the engine caps what a partner can use: the registry's `limits` are request counts per endpoint, and the only pooled-minute logic lives in the GreenApple academy host, not the engine. The integration guide has promised GameClass "300 free minutes" since September; it was never enforced (≈1,490 wall-clock minutes consumed since 3 Oct).

Praveen wants a 300-minute cap, counted in minutes not dollars, enforced on our side, with a short spec GameClass can implement so their UI reflects the pool state. He sends that spec by email as soon as the design is agreed.

## 2. Goals, non-goals, anti-goals

Goals
- A partner-wide pool (minutes) in the partner registry; `gameclass` = 300.
- Enforced by the engine regardless of what the partner's page does: refuse a start when the pool is empty, end a running session when it drains.
- Counted in **wall-clock seconds from session start to session end** (Praveen's call, 10-21). Measured on 295 GameClass sessions: wall clock is 1.8× active time overall, 1.3× for sessions with a real conversation; the gap is abandoned tabs.
- Partner-facing: a read endpoint, two host messages, one token claim. Nothing else in their integration changes.
- Praveen is emailed at 80 % and 100 %.
- Top-up by a one-line ops script; no monthly reset.

Non-goals
- Billing, invoices, paid tiers. The pool is a cap, not a meter (a paid tier later = a bigger pool).
- Per-student caps inside the pool.
- Changing GreenApple's academy-side pool.
- Counting the prewarmed frame's wait or the lesson menu browsing (a page load is not a session).

Anti-goals (failure even if it "works")
- Blocking Naresh mid-demo because of a counter outage: the pool must fail **open** when Mongo cannot be read, like the burst limiter.
- Double-charging a session that posts usage twice (retry, beacon + fetch).
- A partner reading another partner's pool.
- Leaking the pool mechanism into the student UI with Evelyn branding.

## 3. Decisions (Praveen, 10-21)

| Decision | Value |
|---|---|
| Unit | wall-clock seconds, session start → session end |
| Scope | ONE pool per partner; `gameclass` = everything GameClass does, incl. Naresh's testing |
| Size | 300 min, one-time; Praveen tops up by hand |
| Reset | none (no monthly reset) |
| Per-session default | 15 min for gameclass, server-enforced, even if the token asks for more |
| Idle end | 10 min for gameclass (today's `STANDBY_IDLE_END_MS` is 30 min) |

## 4. How it works

### 4.1 Storage

New collection `partnerpools`, one doc per partner (`_id` = partner slug):

```
{ _id: 'gameclass', capSec: 18000, usedSec: 0,
  sessionMaxSec: 900, idleEndSec: 600,
  alerts: { pct80At?: ISO, pct100At?: ISO },
  updatedAt: ISO }
```

Absent doc = no pool = unlimited (today's behaviour for every other partner). The registry's `PartnerRecord` gains nothing; the pool is its own doc so an ops top-up never touches secrets.

`tutorsessions` gains one additive field: `poolCharges: [{ engagedAt: Date, chargedSec: number }]`, one entry per sitting (page mount), keyed by the moment that sitting actually started — start tap or `evelyn:start` — as reported by the embed (`attemptEngagedAt` in the usage body). Today's `startedAt` is the page MOUNT, which for a prewarmed GameClass frame can be long before the start.

### 4.2 Charging (server, idempotent, per sitting)

In `POST /api/tutor/session-usage` (the embed already posts every 30 s, on standby changes, at end, and on pagehide), after the doc upsert and only when the session belongs to a partner with a pool doc.

Which partner: the VERIFIED embed token's `partner_id` when the request carries a token that verifies (prod runs `EMBED_TOKEN_ENFORCE=on`); otherwise the body's `sourcePartnerId` (today's trust level for attribution). When both are present and disagree, the token wins and `partner_pool_partner_mismatch` is logged. (Builder-check Q3, my call.)

Each page mount is a sitting. The embed sends `attemptEngagedAt` (ISO, this mount's start tap / `evelyn:start` moment; absent before engagement, and the save is skipped before engagement anyway). Per session the doc keeps `poolCharges: [{ engagedAt: Date, chargedSec: number }]`, one entry per sitting.

```
end      = (thisSave.status === 'active') ? serverNow : thisSave.endedAt ?? serverNow
wallSec  = clamp( end − attemptEngagedAt , 0, sessionMaxSec + 120 )
delta    = max(0, wallSec − chargedSec(sitting))
CAS on the sitting's chargedSec (array filter on engagedAt + old value) → only one writer wins
if updated: partnerpools.findOneAndUpdate({_id}, {$inc: {usedSec: delta}}, {new: true})
```

- `end` uses the save's OWN status, never the stored `endedAt`: every tab-hide posts an `abandoned` save with `endedAt`, and later `active` saves never clear it (route.ts:195), so `endedAt ?? serverNow` would freeze the charge at the first tab-hide. (Builder-check contradiction, fixed.)
- `serverNow` is the engine's clock; `attemptEngagedAt` is client-reported but clamped to `[doc.createdAt − 60 s, serverNow]` for the first sitting and `[previous sitting's engagedAt, serverNow]` after.
- The compare-and-set makes beacon + keepalive + fetch duplicates charge once.
- The `sessionMaxSec + 120` clamp bounds a sitting that stopped posting (tab killed) to roughly what the wall-clock hard stop (4.3) allows.
- A resumed session (same `session_id`, new mount) is a new sitting: charged from its own engagement, capped per sitting. GameClass sessions have one sitting each in practice (295/295 since 3 Oct). (Builder-check Q2, my call.)
- No back-charging of sittings that started before the pool doc existed.

The response gains `pool: { remaining_sec, exhausted }` so the frame can act (4.4).

### 4.3 Start gate and per-session cap (engine frame)

When the frame is about to start a session (host `evelyn:start` or the student's start tap), it calls `GET /api/tutor/partner-pool` (embed token in `x-embed-token`; the route verifies the token and reads the pool for the token's `partner_id`; without a verifiable token → `{ pooled: false }`):

```
200 { pooled: true, cap_sec, used_sec, remaining_sec, session_max_sec, idle_end_sec }
200 { pooled: false }                       // partner has no pool → unlimited
```

- `remaining_sec < 60` → the start is refused: frame posts `evelyn:start_blocked { reason: "minutes_exhausted" }` and shows an unbranded line ("Tutoring minutes for this program are used up."). No brain call is made.
- Otherwise the sitting's **wall-clock** cap = `min(token max_duration_minutes × 60 (or 1800 default), session_max_sec, remaining_sec)`. This is a NEW wall-clock timer owned by the embed page for pooled partners (the existing `time_limit` hard stop in VoiceTutorRealtime counts ACTIVE time: it skips standby and shifts its anchor, VoiceTutorRealtime.tsx:24549–24570, so it cannot enforce a wall-clock cap). At the cap the frame ends the session through the host-end path with `ended_reason: "time_limit"` and the existing fixed goodbye. Standby is NOT excluded: a 15-minute sitting is 15 wall-clock minutes, video pauses included — consistent with how the pool charges. (Builder-check Q1, my call: wall clock everywhere, one definition. GameClass lessons are ≤ 3–4 min of video, so 15 min of wall clock is roomy; raise the per-session default if a longer lesson needs it.)
- `evelyn:clock.max_seconds` reflects the effective cap so GameClass's countdown is right (it already shows `max_seconds` when present). For a pooled partner `max_seconds` is now wall clock while `active_seconds` stays active; the spec says so.
- The read fails (network, Mongo) → fail open: start as today, log `partner_pool_unavailable`.

Placement: the embed page reads the pool once at MOUNT (prewarm included) and again every 60 s until the session is engaged, keeping the latest snapshot in a ref. The host `evelyn:start` path (`runHostStart`) re-reads before calling `startSession`; the student tap (which goes straight into VoiceTutorRealtime's `micClickRef`, VoiceTutorRealtime.tsx:23874–23879, no async hook) is covered by the snapshot: when it says exhausted the page shows the blocking overlay (same mechanism as `startBlocked === 'token_expired'`) so there is no tap to make. A pool that drains between the snapshot and the tap is caught by the first usage report (4.4). No VoiceTutorRealtime change. (Builder-check contradiction, settled.)

### 4.4 Mid-session ceiling

Concurrent sessions can drain the pool below what any one of them reserved. When a usage POST response says `pool.exhausted`, the frame ends the session through the existing host-end path with reason `minutes_exhausted` (fixed goodbye line, final flush, `evelyn:session_ended` with `ended_reason: "minutes_exhausted"`). The goodbye line: `goodbyeFor('minutes_exhausted')` in host-end.ts is what the ENGINE speaks on the academy's `evelyn:host_end`, and GreenApple's pool is monthly, so that line stays as it is. The pool-originated end (frame-internal, not a host message) speaks its own fixed line: "The tutoring minutes for this program are used up for now." Same `ended_reason` value, different line. (Builder-check contradiction, fixed.)

The server never ends a session by itself; it only reports. (Same shape as the academy's heartbeat design.)

### 4.5 Idle end

`STANDBY_IDLE_END_MS` becomes per-partner: `idle_end_sec` from the pool doc (gameclass 600 s), default unchanged (1,800 s) when there is no pool. Delivered to the frame by the same `GET /api/tutor/partner-pool` read, so no token change. This is the STANDBY idle end only (video playing, tutor parked); a silent non-standby sitting is bounded by the wall-clock cap (4.3) and the engine's existing no-input handling, nothing new. The partner spec says "parked for 10 minutes", not "idle". (Builder-check Q4, my call.)

### 4.6 Host messages (additive)

| Direction | Message | Change |
|---|---|---|
| frame → host | `evelyn:start_blocked` | new reason value `minutes_exhausted` (existing: `autoplay`, `token_expired`) |
| frame → host | `evelyn:session_ended` | new `ended_reason` value `minutes_exhausted` (existing: `time_limit`, host reasons) |
| frame → host | `evelyn:clock` | new optional `pool_remaining_seconds` (partner-wide, as of the last usage report) |

### 4.7 Partner API (server → server, HMAC as today)

`GET /api/portal/v1/usage` → `{ partner_id, pooled, cap_minutes, used_minutes, remaining_minutes, session_max_minutes }` (minutes, one decimal). `pooled:false` returns only `partner_id` and `pooled`. Tenancy: the verified calling partner only. Added to `allowedEndpoints` by prefix (`/api/portal/v1/` already covers it).

### 4.8 Alerts

After each `$inc`, if `usedSec/capSec` crosses 0.8 or 1.0 and the matching `alerts.*At` is unset, set it (CAS on the unset field) and email Praveen via the same nodemailer SMTP transport as `tutor-portal/sandbox/route.ts` (`SMTP_HOST/PORT/USER/PASS`, `EMAIL_FROM`; all present in prod env). Recipient: `PARTNER_POOL_ALERT_TO` (default `praveen@evelynlearning.com`). Subject: "GameClass pool: 240 of 300 minutes used". A top-up that brings usage back under a threshold clears that `alerts.*At` so it can fire again.

### 4.9 Ops

`scripts/ops/partner-pool.sh <partner> [show | set <minutes> | add <minutes> | session-max <minutes> | idle-end <minutes>]`, runs through the laptop's prod tunnel (`127.0.0.1:2710`, `evelyn` DB), prints the doc before and after. `show` is read-only; writes need Praveen's go-ahead per the standing rule. Initial seed for gameclass: `set 300`, `session-max 15`, `idle-end 10`.

`/admin/tutor-sessions` (already filters by `sourcePartnerId`) gains one line in its header when the partner has a pool: "Pool: 212.4 / 300 min". Nothing else in admin.

### 4.10 Flags

`TUTOR_PARTNER_POOL` — server + `NEXT_PUBLIC_TUTOR_PARTNER_POOL` for the frame; default ON (`!== 'off'`), per the house rule. Off = no gate, no charge, no idle change.

## 5. Partner-facing spec (what GameClass implements)

Sent by Praveen; the builder writes it to `docs/whitelabel/gameclass/spec-v1.5-minute-pool.md`. Content, in their terms:

1. **Before rendering "Ask the Tutor"**: `GET https://tutor.evelynlearning.com/api/portal/v1/usage` with the usual three HMAC headers. If `remaining_minutes < 1`, show "Free tutoring minutes are used up" instead of the button. Cache the result for 60 s per server, not per page view.
2. **Token**: set `max_duration_minutes: 15` (lower is fine; higher is clamped to 15 by the engine). For GameClass this cap is wall clock from start to end, standby included.
3. **Handle** `evelyn:start_blocked` with `reason: "minutes_exhausted"` and `evelyn:session_ended` with `ended_reason: "minutes_exhausted"`: show the same "used up" state.
4. **Optional**: `evelyn:clock.pool_remaining_seconds` if they want a partner-wide gauge.
5. **Rules**: wall clock from the moment the tutor starts to the moment it ends, standby included; the frame sitting prewarmed while the video plays is free; a session parked (tutor minimised while the video plays) for 10 minutes ends itself; the pool is shared by every GameClass session including testing; 300 minutes to start, top-ups by asking Praveen.

## 6. Constraints

- Shared, unauthenticated prod Mongo (one `mongod`, DB name = isolation): new collection name `partnerpools` must not collide; writes to prod only through the ops script and with Praveen's go-ahead.
- Four-session protocol: build in a worktree, merge origin/main before deploy, gate, `./deploy-tutor.sh` (does not touch GAC :3008), push.
- The GAC pinned engine (:3008) is frozen 15→22 Oct+; this change ships to :3007 only. GreenApple sessions on the shared engine have no pool doc, so they see no change.
- No new flags reach the browser except the `NEXT_PUBLIC_` one; server-only flags never reach the embed page.
- Fail open on read errors; fail closed only on a definite `remaining_sec < 60`.
- `evelyn:session_ended.duration` keeps reporting ACTIVE seconds (partner contract v1.18); the pool uses wall clock. The spec says so in one line to avoid a support question.

## 7. Left to the builder

- Exact placement of the gate in `embed/page.tsx` (`runHostStart` / the student tap path) and how the effective cap replaces `maxDuration` / `maxDurationExplicit` without re-rendering VoiceTutorRealtime mid-session.
- Pure helpers (pool arithmetic, threshold crossing, effective-cap, start decision) in `lib/tutor/portal/partner-pool.ts`, pinned by `scripts/test-partner-pool.ts`; the route uses them.
- Whether `GET /api/tutor/partner-pool` is a new route or an extra field on the existing resume boot `GET /api/tutor/session-usage` (new route preferred: it is called before any session exists).
- Test harness entries: `test:partner-pool`, extension of `test:host-lesson` for the new `start_blocked` reason and clock field, `test:embed-debug-coverage` allowlist for the new debug events (`partner_pool_gate`, `partner_pool_exhausted`, `partner_pool_unavailable`).
- Integration-guide §9 ("300 free minutes… measured as durationSec") and §6 line "duration is wall-clock seconds" (it is ACTIVE seconds since 10-03) are stale: update to wall clock + pool, and the `evelyn:start_blocked` / `ended_reason` tables.
