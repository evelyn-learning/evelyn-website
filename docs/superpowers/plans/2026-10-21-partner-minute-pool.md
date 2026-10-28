# Partner Minute Pool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A per-partner pool of wall-clock tutoring minutes, enforced by the engine (start gate, mid-session ceiling, per-sitting cap, parked-idle end), with a partner read endpoint, host messages, alert emails and an ops top-up script; seeded for `gameclass` at 300 min.

**Architecture:** Pure helpers in `lib/tutor/portal/partner-pool.ts` decide everything (charge arithmetic, gate, thresholds); a thin Mongo store (`partner-pool-store.ts`) does the atomic writes; the existing `POST /api/tutor/session-usage` charges each sitting on every report it already receives; the embed page reads a pool snapshot, gates the start, runs a wall-clock cap timer and ends on `exhausted`. Partners read `GET /api/portal/v1/usage` under the existing HMAC auth.

**Tech Stack:** Next.js (apps/tutor, see apps/tutor/AGENTS.md: read `node_modules/next/dist/docs/` before route code), Mongoose, nodemailer (SMTP env already in prod), tests = `npx tsx scripts/test-*.ts` with `node:assert` (pattern: `apps/tutor/scripts/test-host-start.ts`), registered as `test:*` in `apps/tutor/package.json` so `npm run test:all` picks them up.

**Spec:** `docs/superpowers/specs/2026-10-21-partner-minute-pool-design.md` (same folder in the root checkout).

All paths below are relative to the worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/partner-pool/apps/tutor` unless they start with `/`.

## Global Constraints

- Wall clock, per sitting (page mount), from `attemptEngagedAt` to the save's own end: `end = status === 'active' ? serverNow : (endedAt ?? serverNow)`; never the stored `endedAt`.
- Charge clamp per sitting: `sessionMaxSec + 120`. Start refused when `remaining_sec < 60` (`POOL_MIN_START_SEC = 60`).
- Effective sitting cap = `min(tokenMaxSec ?? 1800, sessionMaxSec, remainingSec)`, wall clock, standby included.
- Partner for charging: verified embed token's `partner_id` wins; else `body.sourcePartnerId`; mismatch → token wins + `console.warn('[partner-pool] partner_mismatch …')`.
- Fail OPEN on any pool read/write error (start as today, no charge, log `partner_pool_unavailable`). Fail closed only on a definite `remaining_sec < 60` or `exhausted: true`.
- No pool doc for the partner ⇒ `{ pooled: false }` ⇒ no behaviour change (GreenApple, Kanzoo, retail untouched). `goodbyeFor('minutes_exhausted')` in host-end.ts is NOT changed.
- Flags default ON: server `TUTOR_PARTNER_POOL !== 'off'`, browser `NEXT_PUBLIC_TUTOR_PARTNER_POOL !== 'off'`.
- Fixed copy: overlay/start-blocked line "Tutoring minutes for this program are used up."; pool-originated goodbye "The tutoring minutes for this program are used up for now."; alert subject `"${partnerName} pool: ${usedMin} of ${capMin} minutes used"`.
- Thresholds 0.8 and 1.0 of `capSec`, each emailed once; cleared by a top-up that drops usage back under the threshold.
- Defaults when a field is absent on the pool doc: `sessionMaxSec = 900`, `idleEndSec = 1800` (today's `STANDBY_IDLE_END_MS`).
- Collection `partnerpools`, `_id` = partner slug. `tutorsessions.poolCharges: [{ engagedAt: Date, chargedSec: number }]` additive.
- Nothing Evelyn-branded in student-visible copy. Absolute paths in any message to the user.

## Review Focus

1. A tab-hide `abandoned` save followed by `active` saves: charging must keep advancing (Task 1 `sittingCharge` end-by-status test; Task 4 route test).
2. Two saves for the same sitting racing (beacon + keepalive): one charge only (Task 2 CAS test with injected store).
3. A resumed session's second sitting: charged from its own `engagedAt`, not from the first sitting's (Task 1 `clampEngagedAt`, Task 4).
4. Pool read failure at start (Mongo down): session starts, debug event `partner_pool_unavailable` (Task 6 source scan + Task 3 route 200 `{pooled:false, error:'unavailable'}`).
5. A token with `max_duration_minutes: 60` on a 15-min pool partner: effective cap 900 s and `evelyn:clock.max_seconds = 900` (Task 1 `effectiveCapSec`, Task 6 scan).

---

### Task 1: Pure pool helpers

**Files:**
- Create: `src/lib/tutor/portal/partner-pool.ts`
- Test: `scripts/test-partner-pool.ts`
- Modify: `package.json` (add `"test:partner-pool": "npx tsx scripts/test-partner-pool.ts"` next to `test:host-start`)

**Interfaces:**
- Produces:
  ```ts
  export const POOL_MIN_START_SEC = 60;
  export const POOL_CHARGE_SLACK_SEC = 120;
  export const DEFAULT_SESSION_MAX_SEC = 900;
  export const DEFAULT_IDLE_END_SEC = 1800;
  export const POOL_BLOCKED_LINE = 'Tutoring minutes for this program are used up.';
  export const POOL_GOODBYE_LINE = 'The tutoring minutes for this program are used up for now.';
  export interface PoolDoc { _id: string; capSec: number; usedSec: number; sessionMaxSec?: number; idleEndSec?: number; alerts?: { pct80At?: string; pct100At?: string } }
  export interface PoolView { pooled: true; capSec: number; usedSec: number; remainingSec: number; sessionMaxSec: number; idleEndSec: number; exhausted: boolean }
  export type PoolSnapshot = PoolView | { pooled: false };
  export function poolView(doc: PoolDoc | null): PoolSnapshot;            // remainingSec = max(0, cap − used); exhausted = remainingSec < POOL_MIN_START_SEC
  export function clampEngagedAt(reportedMs: number, bounds: { createdAtMs: number; prevEngagedAtMs?: number; nowMs: number }): number;
  export function sittingEndMs(save: { status: 'active' | 'completed' | 'abandoned'; endedAtMs?: number | null }, nowMs: number): number;
  export function sittingCharge(input: { engagedAtMs: number; endMs: number; chargedSec: number; sessionMaxSec: number }): { wallSec: number; deltaSec: number };
  export function effectiveCapSec(input: { tokenMaxSec?: number; sessionMaxSec: number; remainingSec: number }): number;
  export function startDecision(snap: PoolSnapshot): { start: true; capSec?: number; idleEndSec?: number } | { start: false; reason: 'minutes_exhausted' };
  export function thresholdsCrossed(prevUsedSec: number, newUsedSec: number, capSec: number): Array<'pct80' | 'pct100'>;
  export function thresholdsCleared(newUsedSec: number, capSec: number, alerts: PoolDoc['alerts']): Array<'pct80' | 'pct100'>;
  export function clockPoolSeconds(snap: PoolSnapshot | null): number | undefined; // remainingSec or undefined
  export function poolFlagOn(env: string | undefined): boolean;            // env !== 'off'
  ```

- [ ] **Step 1: Write the failing tests** in `scripts/test-partner-pool.ts` (same `passed/failed` + `check(name, fn)` shape as `scripts/test-host-start.ts`). Cases, with these exact values:
  - `poolView(null)` → `{ pooled: false }`; `poolView({_id:'g', capSec:18000, usedSec:17950})` → `remainingSec 50, exhausted true, sessionMaxSec 900, idleEndSec 1800`; usedSec > capSec → remainingSec 0.
  - `sittingEndMs({status:'active', endedAtMs: 1000}, 5000)` → 5000 (stale endedAt ignored); `({status:'abandoned', endedAtMs:1000}, 5000)` → 1000; `({status:'completed'}, 5000)` → 5000.
  - `sittingCharge({engagedAtMs:0, endMs:100_000, chargedSec:40, sessionMaxSec:900})` → `{wallSec:100, deltaSec:60}`; endMs 2_000_000 → wallSec 1020 (900+120 clamp); chargedSec 150 with wallSec 100 → deltaSec 0; endMs < engagedAtMs → wallSec 0.
  - `clampEngagedAt(reported, {createdAtMs: 10_000, nowMs: 50_000})` (floor = `createdAtMs − 60_000` = −50_000, ceiling = `nowMs`): 5_000 → 5_000; −100_000 → −50_000; 99_000 → 50_000; with `prevEngagedAtMs: 20_000` the floor becomes 20_000, so 15_000 → 20_000.
  - `effectiveCapSec({tokenMaxSec: 3600, sessionMaxSec: 900, remainingSec: 5000})` → 900; `{tokenMaxSec: undefined, sessionMaxSec: 900, remainingSec: 400}` → 400; `{tokenMaxSec: 300, sessionMaxSec: 900, remainingSec: 5000}` → 300.
  - `startDecision({pooled:false})` → `{start:true}`; exhausted → `{start:false, reason:'minutes_exhausted'}`; remainingSec 400, sessionMaxSec 900 → `{start:true, capSec:400, idleEndSec:1800}`.
  - `thresholdsCrossed(14_000, 14_400, 18_000)` → `['pct80']`; `(17_900, 18_100, 18_000)` → `['pct100']`; `(10_000, 18_100, 18_000)` → `['pct80','pct100']`; `(14_400, 14_500, 18_000)` → `[]`.
  - `thresholdsCleared(10_000, 18_000, {pct80At:'x', pct100At:'y'})` → `['pct80','pct100']`; `(15_000, 18_000, {pct80At:'x'})` → `[]`.
  - `clockPoolSeconds({pooled:false})` → undefined; view with remainingSec 123 → 123.
  - `poolFlagOn(undefined)` true, `('off')` false, `('on')` true.

- [ ] **Step 2: Run to verify it fails**

Run: `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/partner-pool/apps/tutor && npm run test:partner-pool`
Expected: FAIL — module `../src/lib/tutor/portal/partner-pool` not found.

- [ ] **Step 3: Implement `src/lib/tutor/portal/partner-pool.ts`** with the exact exports above. Pure, import-free, file header explaining wall-clock-per-sitting and fail-open (two sentences, cite the spec path).

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:partner-pool`
Expected: `… passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/portal/partner-pool.ts apps/tutor/scripts/test-partner-pool.ts apps/tutor/package.json
git commit -m "feat(tutor): partner minute pool — pure helpers (wall-clock sitting charge, start gate, thresholds)"
```

---

### Task 2: Pool model, session field, store with CAS charge and alerts

**Files:**
- Create: `src/models/PartnerPool.ts`
- Create: `src/lib/tutor/portal/partner-pool-store.ts`
- Create: `src/lib/tutor/portal/partner-pool-alerts.ts`
- Modify: `src/models/TutorSession.ts` (interface + schema: `poolCharges?: Array<{ engagedAt: Date; chargedSec: number }>`, additive, after `attemptSpans`)
- Test: `scripts/test-partner-pool-store.ts`; `package.json` `"test:partner-pool-store"`

**Interfaces:**
- Consumes: Task 1 helpers.
- Produces:
  ```ts
  // PartnerPool.ts
  export interface IPartnerPool { _id: string; capSec: number; usedSec: number; sessionMaxSec?: number; idleEndSec?: number; alerts?: { pct80At?: string; pct100At?: string }; updatedAt: string }
  export const PartnerPoolModel: mongoose.Model<IPartnerPool>;   // collection 'partnerpools', { _id: false } like Partner.ts

  // partner-pool-store.ts
  export interface PoolStoreDeps {
    readPool(partnerId: string): Promise<PoolDoc | null>;
    casSittingCharge(a: { sessionId: string; engagedAtMs: number; prevChargedSec: number | null; newChargedSec: number }): Promise<boolean>;  // null prev = push a new sitting entry if absent
    incPool(partnerId: string, deltaSec: number): Promise<PoolDoc | null>;        // $inc usedSec, returns new doc
    readSitting(sessionId: string): Promise<{ createdAtMs: number; sittings: Array<{ engagedAtMs: number; chargedSec: number }> } | null>;
    now(): number;
  }
  export function mongoPoolStoreDeps(): PoolStoreDeps;     // the real one, built on PartnerPoolModel / TutorSession
  export async function readPoolSnapshot(partnerId: string, deps?: PoolStoreDeps): Promise<PoolSnapshot>;     // poolView(readPool); any throw → { pooled: false }
  export async function chargeSitting(input: {
    partnerId: string; sessionId: string; reportedEngagedAtMs: number;
    save: { status: 'active' | 'completed' | 'abandoned'; endedAtMs?: number | null };
  }, deps?: PoolStoreDeps): Promise<{ charged: boolean; deltaSec: number; snapshot: PoolSnapshot; crossed: Array<'pct80'|'pct100'> }>;
  // partner-pool-alerts.ts
  export async function sendPoolAlert(a: { partnerId: string; partnerName: string; usedSec: number; capSec: number; which: 'pct80' | 'pct100' }): Promise<void>;  // nodemailer SMTP like tutor-portal/sandbox/route.ts; to = process.env.PARTNER_POOL_ALERT_TO || 'praveen@evelynlearning.com'; never throws (catch + console.error)
  ```

- [ ] **Step 1: Write the failing tests** in `scripts/test-partner-pool-store.ts` with an in-memory `PoolStoreDeps` fake (a Map for pools, a Map for sittings, a `calls` log):
  - `chargeSitting` first report of a sitting (no entry): fake has pool cap 18000 used 0, createdAt 0, now 90_000, engagedAt 30_000, status active → `charged true, deltaSec 60`, pool used 60, sitting entry `{engagedAtMs 30_000, chargedSec 60}`.
  - second report now 150_000 → deltaSec 60 more (charged 120); a duplicate of the SAME report (fake `casSittingCharge` returns false) → `charged false, deltaSec 0`, pool unchanged.
  - abandoned save with endedAtMs 100_000 then an active save at now 200_000 → second charge advances to 170 s total (end-by-status).
  - resumed sitting: existing sitting at 30_000 charged 120; report engagedAt 400_000 now 460_000 → new entry, deltaSec 60, first entry untouched.
  - no pool doc → `charged false`, `snapshot.pooled false`, no calls to `incPool`.
  - `readPool` throws → `charged false`, snapshot `{pooled:false}`, no throw.
  - `crossed`: pool cap 18000 used 14_300, delta 200 → `['pct80']`.
  - `readPoolSnapshot` with a throwing dep → `{ pooled: false }`.
  - Source scan: `src/models/TutorSession.ts` contains `poolCharges`; `src/models/PartnerPool.ts` contains `'partnerpools'` or model name `PartnerPool`.

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:partner-pool-store`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement** `PartnerPool.ts` (schema fields as above, `collection: 'partnerpools'`), the `TutorSession` field, `partner-pool-store.ts` (algorithm: `readSitting` → pick the entry whose `engagedAtMs` is within 60 s of `clampEngagedAt(reported…)` else treat as new; `sittingEndMs` → `sittingCharge` → if `deltaSec > 0` `casSittingCharge` (Mongo: `updateOne({sessionId, 'poolCharges.engagedAt': d, 'poolCharges.chargedSec': prev}, {$set: {'poolCharges.$.chargedSec': new}})` or for a new sitting `updateOne({sessionId, 'poolCharges.engagedAt': {$ne: d}}, {$push: …})`, matched count 1 = won) → `incPool` → `thresholdsCrossed`; whole body in try/catch → fail open), and `partner-pool-alerts.ts`.

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:partner-pool-store && npx tsc --noEmit -p .`
Expected: all pass; tsc clean.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/models/PartnerPool.ts apps/tutor/src/models/TutorSession.ts apps/tutor/src/lib/tutor/portal/partner-pool-store.ts apps/tutor/src/lib/tutor/portal/partner-pool-alerts.ts apps/tutor/scripts/test-partner-pool-store.ts apps/tutor/package.json
git commit -m "feat(tutor): partner pool store — CAS per-sitting charge, atomic pool increment, threshold alerts"
```

---

### Task 3: `GET /api/tutor/partner-pool` (frame read)

**Files:**
- Create: `src/app/api/tutor/partner-pool/route.ts`
- Test: extend `scripts/test-partner-pool-store.ts` with a source scan of the route (uses `checkEmbedAuthAsync`, reads `payload.partner_id`, returns `pooled`), or a route test if the repo has a route-test pattern (`scripts/test-*route*.ts`); scan is acceptable.

**Interfaces:**
- Consumes: `checkEmbedAuthAsync({ token, route: 'partner-pool:GET' })` → `{ allow, payload?: { partner_id } }` from `src/lib/tutor/portal/embed-token.ts`; `readPoolSnapshot` (Task 2); `poolFlagOn(process.env.TUTOR_PARTNER_POOL)`.
- Produces: `200 { pooled: true, cap_sec, used_sec, remaining_sec, session_max_sec, idle_end_sec, exhausted }` | `200 { pooled: false }` | `200 { pooled: false, error: 'unavailable' }` (read threw) | `401 { error: 'unauthorized', reason }` only when enforce mode is `on` and the token is invalid. No token at all → `{ pooled: false }` (retail/demo surfaces).

- [ ] **Step 1: Write the failing scan test** (route file exists, imports `checkEmbedAuthAsync` and `readPoolSnapshot`, contains `'partner-pool:GET'` and `pooled`).
- [ ] **Step 2: Run** `npm run test:partner-pool-store` → FAIL (file missing).
- [ ] **Step 3: Implement the route** (`export const dynamic = 'force-dynamic'`; token from `x-embed-token` header or `?token=`; `await connectDB()` only when a verified `partner_id` exists; flag off → `{ pooled: false }`).
- [ ] **Step 4: Run** `npm run test:partner-pool-store && npx tsc --noEmit -p .` → pass.
- [ ] **Step 5: Commit** `git commit -m "feat(tutor): GET /api/tutor/partner-pool — pool snapshot for the embed frame"`

---

### Task 4: Charge from `POST /api/tutor/session-usage`

**Files:**
- Modify: `src/app/api/tutor/session-usage/route.ts` (after the span write succeeds and before the geo lookup, ~line 480–497; response ~line 505)
- Modify: `src/app/tutor-portal/embed/page.tsx` `saveSession` basePayload (~line 985): add `attemptEngagedAt: sessionEngagedAtRef.current ? new Date(sessionEngagedAtRef.current).toISOString() : undefined`
- Test: `scripts/test-session-usage-pool.ts` (new; `"test:session-usage-pool"`) — source scans + a unit test of a small extracted helper.

**Interfaces:**
- Consumes: `chargeSitting`, `sendPoolAlert`, `poolFlagOn`; the route already has `token` (string|null), `body.sourcePartnerId`, `body.status`, `body.endedAt`, `sessionId`, and `auth` (only when `body.studentId`).
- Produces: in the route file, export nothing new; add a pure helper to `partner-pool.ts`: `export function chargePartnerFor(input: { tokenPartnerId?: string | null; bodyPartnerId?: string | null }): { partnerId: string | null; mismatch: boolean }` (token wins). Response gains `pool?: { remaining_sec: number; exhausted: boolean }` when the partner is pooled.

- [ ] **Step 1: Write the failing tests**: `chargePartnerFor({tokenPartnerId:'gameclass', bodyPartnerId:'gameclass'})` → `{partnerId:'gameclass', mismatch:false}`; `({tokenPartnerId:'gameclass', bodyPartnerId:'other'})` → `{partnerId:'gameclass', mismatch:true}`; `({tokenPartnerId:null, bodyPartnerId:'gameclass'})` → `{partnerId:'gameclass', mismatch:false}`; both null → `{partnerId:null, mismatch:false}`. Source scans: route imports `chargeSitting` and `chargePartnerFor`, reads `body.attemptEngagedAt`, response contains `pool:`; `embed/page.tsx` basePayload contains `attemptEngagedAt`.
- [ ] **Step 2: Run** `npm run test:session-usage-pool` → FAIL.
- [ ] **Step 3: Implement**: in the route, when `poolFlagOn(process.env.TUTOR_PARTNER_POOL)` and `body.attemptEngagedAt` parses: resolve the token's partner — if `auth` exists use `auth.payload?.partner_id`; else if a token string is present call `checkEmbedAuthAsync({ token, route: 'session-usage:pool' })` once and use its `payload?.partner_id` (do not change the existing 401 behaviour: a failed verification here just yields no token partner) — then `chargePartnerFor`, `chargeSitting({...})`, `for (const which of result.crossed) void sendPoolAlert({...})` (partner name from `getPartner(partnerId)` → `name`, fallback the slug), and spread `pool` into the JSON. Mismatch → `console.warn`. Whole block in try/catch (fail open).
- [ ] **Step 4: Run** `npm run test:session-usage-pool && npx tsc --noEmit -p .` → pass.
- [ ] **Step 5: Commit** `git commit -m "feat(tutor): session-usage charges the partner pool per sitting; response carries pool state"`

---

### Task 5: `GET /api/portal/v1/usage` (partner read, HMAC)

**Files:**
- Create: `src/app/api/portal/v1/usage/route.ts`
- Modify: `src/app/tutor-portal/data/webhook-events.ts` (document new `start_blocked` reason + `ended_reason` value + `evelyn:clock.pool_remaining_seconds`; add the endpoint to whatever list documents portal endpoints in `src/app/tutor-portal/data/` if one exists — check `ls src/app/tutor-portal/data/`)
- Test: `scripts/test-partner-pool-usage-route.ts` (`"test:partner-pool-usage-route"`): source scan (uses `withPortalAuth`, `auth.partnerId`, returns `remaining_minutes`) + unit test of `usageResponse(snapshot, partnerId)`.

**Interfaces:**
- Consumes: `withPortalAuth` (`src/lib/tutor/portal/auth.ts`, handler gets `auth.partnerId`), `readPoolSnapshot`.
- Produces: add to `partner-pool.ts`: `export function usageResponse(snap: PoolSnapshot, partnerId: string): { partner_id: string; pooled: boolean; cap_minutes?: number; used_minutes?: number; remaining_minutes?: number; session_max_minutes?: number }` (minutes to one decimal via `Math.round(sec/6)/10`).

- [ ] **Step 1: Failing tests**: `usageResponse({pooled:false}, 'gameclass')` → `{partner_id:'gameclass', pooled:false}`; view cap 18000 used 12_744 sessionMax 900 → `{cap_minutes:300, used_minutes:212.4, remaining_minutes:87.6, session_max_minutes:15}`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the route (`export const GET = withPortalAuth(async (_req, auth) => NextResponse.json(usageResponse(await readPoolSnapshot(auth.partnerId), auth.partnerId)))`) and the docs-data edits.
- [ ] **Step 4: Run** test + tsc → pass.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): GET /api/portal/v1/usage — a partner reads its minute pool"`

---

### Task 6: Embed frame — snapshot, start gate, wall-clock cap, exhausted end, idle end, clock

**Files:**
- Modify: `src/app/tutor-portal/embed/page.tsx`:
  - flags block (near `TUTOR_HOST_START`): `const TUTOR_PARTNER_POOL = process.env.NEXT_PUBLIC_TUTOR_PARTNER_POOL !== 'off';`
  - `EMBED_DEBUG_EVENT_PREFIXES` (~line 65): add `'partner_pool'`.
  - new refs/state: `poolSnapshotRef = useRef<PoolSnapshot | null>(null)`, `poolCapSecRef = useRef<number | null>(null)`, `poolEndReasonRef = useRef<'time_limit' | 'minutes_exhausted' | null>(null)`; `startBlocked` union gains `'minutes_exhausted'`.
  - mount effect: when `TUTOR_PARTNER_POOL && embedToken`: `fetch('/api/tutor/partner-pool', {headers:{'x-embed-token': embedToken}})` at mount and every 60 s until `sessionEngagedAtRef.current !== null`; store snapshot; `addDebugEvent('partner_pool_snapshot', 'remaining=… cap=…')`; on exhausted before engagement → `blockStart('minutes_exhausted')`; fetch error → `addDebugEvent('partner_pool_unavailable', …)` and snapshot `{pooled:false}`.
  - `runHostStart` (~line 1401): before `h.startSession()`, `await` a fresh snapshot (≤ 1.5 s timeout, else use the ref); `startDecision` → blocked ⇒ `blockStart('minutes_exhausted')` and return; else set `poolCapSecRef` to `effectiveCapSec({ tokenMaxSec: maxDurationExplicit ? maxDuration*60 : undefined, sessionMaxSec, remainingSec })` and `poolIdleEndSecRef`.
  - student tap: in `addDebugEvent` where `start_tap` latches `sessionEngagedAtRef` (~line 823), also compute `poolCapSecRef` from the current snapshot the same way (the overlay already prevents a tap when exhausted).
  - wall-clock cap: an effect keyed on `sessionEngagedAtRef`/`sessionStarted` — `setInterval` 5 s: if `poolCapSecRef.current` and `Date.now() − sessionEngagedAtRef.current >= cap*1000` and not ending → `poolEndReasonRef.current = 'time_limit'`, `addDebugEvent('partner_pool_cap_end', …)`, `h.endSession({ farewell: goodbyeFor('finished') })` else `handleEndSessionRef.current('time_limit')`.
  - `notePriorActive` (~line 744): also read `j.pool`; if `pool.exhausted` and not ending → `poolEndReasonRef.current = 'minutes_exhausted'`, `addDebugEvent('partner_pool_exhausted', …)`, `h.endSession({ farewell: POOL_GOODBYE_LINE })`; keep `poolSnapshotRef` remaining updated from `pool.remaining_sec`.
  - `handleEndSession` (~line 1272): `const endedReason = reason ?? poolEndReasonRef.current ?? hostEndReasonRef.current ?? undefined;`
  - idle end (~line 1640): replace `STANDBY_IDLE_END_MS` with `(poolIdleEndSecRef.current ?? STANDBY_IDLE_END_MS/1000) * 1000`.
  - `postClock` (~line 1681): `maxSeconds: poolCapSecRef.current ?? (maxDurationExplicit ? maxDuration*60 : undefined)`, `poolRemainingSeconds: clockPoolSeconds(poolSnapshotRef.current)`.
  - overlay (~line 2160): add `{startBlocked === 'minutes_exhausted' && (<div …same classes…>{POOL_BLOCKED_LINE}</div>)}`.
- Modify: `src/lib/tutor/portal/host-lesson.ts` `clockMessage` (~line 413): input gains `poolRemainingSeconds?: number`; output gains `pool_remaining_seconds?: number` (present when a finite number ≥ 0).
- Test: `scripts/test-host-lesson.ts` (add clock cases), `scripts/test-partner-pool-embed.ts` (`"test:partner-pool-embed"`, source scans of page.tsx for each wiring point listed above), `scripts/test-embed-debug-coverage.ts` (run; the new prefix must be admitted).

**Interfaces:**
- Consumes: Task 1 helpers; Task 3 route; Task 4 response `pool`.
- Produces: host messages `evelyn:start_blocked {reason:'minutes_exhausted'}`, `evelyn:session_ended {ended_reason:'minutes_exhausted'|'time_limit'}`, `evelyn:clock.pool_remaining_seconds`.

- [ ] **Step 1: Failing tests**: `clockMessage({activeSeconds: 10, running: true, poolRemainingSeconds: 123})` → has `pool_remaining_seconds: 123`; without → key absent; `poolRemainingSeconds: -5` → absent. Scans: page.tsx contains `NEXT_PUBLIC_TUTOR_PARTNER_POOL`, `'/api/tutor/partner-pool'`, `blockStart('minutes_exhausted')`, `poolEndReasonRef`, `POOL_BLOCKED_LINE`, `POOL_GOODBYE_LINE`, `partner_pool_cap_end`, `partner_pool_exhausted`, `partner_pool_unavailable`, `clockPoolSeconds(`, `'partner_pool'` in the prefix list; `startBlocked === 'minutes_exhausted'`.
- [ ] **Step 2: Run** `npm run test:host-lesson && npm run test:partner-pool-embed` → FAIL on the new cases.
- [ ] **Step 3: Implement** all page.tsx and host-lesson.ts edits above.
- [ ] **Step 4: Run** `npm run test:host-lesson && npm run test:partner-pool-embed && npm run test:embed-debug-coverage && npm run test:host-start && npm run test:host-end && npx tsc --noEmit -p . && npm run lint -- --quiet` → pass (embed-debug-coverage: 1 pre-existing fail `practice_gen_gate_failed` is known; everything else must pass).
- [ ] **Step 5: Commit** `git commit -m "feat(embed): partner pool — start gate, wall-clock sitting cap, exhausted end, per-partner parked idle, clock pool field"`

---

### Task 7: Admin pool line + ops script + seed

**Files:**
- Modify: `src/app/admin/tutor-sessions/page.tsx` (~line 48–95 `getSessions`, ~line 209 header): when `filters.partner` (the `sourcePartnerId` filter) names a partner with a pool, show `Pool: 212.4 / 300 min` next to the model-cost line; `readPoolSnapshot(filters.partner)`.
- Create: `/Users/luke/Dev/evelynlearning/scripts/ops/partner-pool.sh` and `/Users/luke/Dev/evelynlearning/scripts/ops/partner-pool.js` (mongosh script; `.sh` wraps `mongosh "mongodb://127.0.0.1:2710/evelyn?directConnection=true" --quiet --eval "const ARGS='$*'" partner-pool.js`). Commands: `show <partner>` (read-only; prints doc + computed minutes + last 5 charged sessions), `set <partner> <minutes>`, `add <partner> <minutes>`, `session-max <partner> <minutes>`, `idle-end <partner> <minutes>`. Writes also clear `alerts.pct80At/pct100At` when usage falls below the threshold (use `thresholdsCleared` logic inline — mongosh cannot import TS) and set `updatedAt`. Header comment: laptop :2710 is the PROD tunnel; writes need Praveen's go-ahead.
- Test: `scripts/test-partner-pool-embed.ts` add a scan that `admin/tutor-sessions/page.tsx` imports `readPoolSnapshot`; `bash -n scripts/ops/partner-pool.sh`.

- [ ] **Step 1: Failing scan**, **Step 2: run → FAIL**, **Step 3: implement**, **Step 4: run tests + `bash -n`** → pass.
- [ ] **Step 5: Seed (dry):** `bash /Users/luke/Dev/evelynlearning/scripts/ops/partner-pool.sh show gameclass` → prints "no pool doc". DO NOT run `set` without Praveen's go-ahead (prod write); the executing session asks in its final message.
- [ ] **Step 6: Commit** `git commit -m "feat(ops): partner-pool.sh show/set/add; admin tutor-sessions shows the partner pool"`

---

### Task 8: Partner-facing docs + email draft

**Files:**
- Create: `/Users/luke/Dev/evelynlearning/docs/whitelabel/gameclass/spec-v1.5-minute-pool.md` (content = spec §5, written for Naresh: endpoint with a curl example using their three HMAC headers, the two host-message additions, the token line, the five rules; one line that `session_ended.duration` stays ACTIVE seconds while the pool is wall clock).
- Create: `/Users/luke/Dev/evelynlearning/docs/whitelabel/gameclass/email-2026-10-21-minute-pool.md` (short email from Praveen to Naresh cc Skyler: thanks for the call, four segments recap in one line, "300 free minutes, enforced on our side from <date>", what to implement (link/attach v1.5), ask Naresh to re-enable the logged-out link once done, Skyler can announce after that).
- Modify: `/Users/luke/Dev/evelynlearning/docs/whitelabel/gameclass/integration-guide.md` §5 `max_duration_minutes` row (+ "for pooled partners this is wall clock"), §6 table (`duration` = active seconds; `evelyn:start_blocked` row; `ended_reason` adds `minutes_exhausted`), §8 (new `GET /usage` row), §9 (300 free minutes = the pool, wall clock, `GET /usage`).
- Also copy spec-v1.5 + email into the worktree's `docs/whitelabel/gameclass/` if that folder is tracked there (check `git ls-files docs/whitelabel | head`); if untracked, root checkout only.

- [ ] **Step 1: Write the three files / edits.**
- [ ] **Step 2: Verify** `grep -c "minutes_exhausted" /Users/luke/Dev/evelynlearning/docs/whitelabel/gameclass/integration-guide.md` ≥ 2; `grep -c "wall clock" …/spec-v1.5-minute-pool.md` ≥ 1.
- [ ] **Step 3: Commit** (only tracked files) `git commit -m "docs(gameclass): spec v1.5 minute pool; integration guide: pool, start_blocked, ended_reason"`

---

### Task 9: Gate, merge, deploy, seed, verify

- [ ] **Step 1:** `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/partner-pool && git fetch origin && git merge origin/main` (rule: merge origin/main before every deploy).
- [ ] **Step 2:** `cd apps/tutor && MONGODB_URI="" npm run test:all` → baseline is 375/379 on 10-19 (known fails listed in memory `project_engine_test_all_preexisting_failures`); the new suites must be in the pass column. `npx tsc --noEmit -p .` clean. `npm run build` succeeds.
- [ ] **Step 3:** Add `TUTOR_PARTNER_POOL=on`, `NEXT_PUBLIC_TUTOR_PARTNER_POOL=on`, `PARTNER_POOL_ALERT_TO=praveen@evelynlearning.com` to `/Users/luke/Dev/evelynlearning/.claude/worktrees/partner-pool/.env.local.production` AND `/Users/luke/Dev/evelynlearning/.env.local.production` (absolute paths; `grep -c` both).
- [ ] **Step 4:** Deploy: `while [ -e /tmp/evelyn-deploy.lock ]; do sleep 10; done; ./deploy-tutor.sh` from the worktree root (ships :3007 only; GAC :3008 untouched). Verify `pm2 list` uptime and `curl -s https://tutor.evelynlearning.com/api/tutor/partner-pool` → `{"pooled":false}` (no token).
- [ ] **Step 5:** Seed, with Praveen's go-ahead: `bash /Users/luke/Dev/evelynlearning/scripts/ops/partner-pool.sh set gameclass 300 && … session-max gameclass 15 && … idle-end gameclass 10 && … show gameclass`.
- [ ] **Step 6:** Verify end to end with ONE short GameClass-shaped session (live budget rule: minimum runs): mint with the gameclass secret (recipe in memory `project_tutor_session_handoff`), open, start, end after ~1 min; then `show gameclass` → `usedSec` ≈ 60–90; the session doc has `poolCharges[0]`; `evelyn:clock` in the console shows `pool_remaining_seconds`. Then `git push origin partner-pool` and merge to main per the four-session protocol.
