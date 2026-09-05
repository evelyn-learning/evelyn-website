# Holistic-Pedagogy Round — Plan 2 (contract v1.15.0 + academy) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface the engine-owned homework loop to students: an additive contract bump, an authoritative engine read route, the academy's "From your tutor" practice card, the `practice_locator` / `goal_note` embed fields, and the Session-row chip — so the locator gate in Plan 1 opens and the tutor may speak about homework.

**Architecture:** The contract gains two optional `SessionResult` fields and one new read endpoint (`assigned-practice`). The engine populates the result best-effort and serves the read from `PracticeAssignment` + its own evidence rows. The academy mints the two transient embed fields at session start, stores the result summary on the `Session` row, and renders assignments on the Practice tab by creating a `PracticeSet` with source `tutor-assigned` that reuses the existing drill, so attempts flow back as evidence unchanged.

**Tech Stack:** zod schemas in the sibling `portal-contract` repo (built `dist/` rsynced into both `node_modules`, then tagged and pinned), Next.js route handler + `withPortalAuth` (engine), Express routes + Mongoose (academy api), Next.js server components + BFF forward (academy web), vitest (academy `tests/`).

**Spec:** `docs/superpowers/specs/2026-09-05-tutor-holistic-pedagogy-round-design.md` §C.7 (academy side), §C.8, §C.9, §8. Depends on Plan 1 being merged (Tasks 9–13 of `2026-09-05-holistic-pedagogy-plan1-engine.md`).

## Global Constraints

- Three repos: contract `/Users/luke/Dev/portal-contract`, engine worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-rounds` (paths relative to `apps/tutor/`), academy `/Users/luke/Dev/academy` (work on a feature branch from `origin/main`; the root's local `main` is stale — `git fetch origin && git checkout -b holistic-pedagogy-plan2 origin/main`).
- Contract stays additive v1: new fields optional, no enum values added, `package.json` version `1.15.0`. Process per `project_portal_contract_v1_2`: edit `src/` → `npm run build` → rsync `dist/` + copy `package.json` into BOTH consumers' `node_modules/@evelyn/portal-contract/` → tag `v1.15.0` and push the tag → bump `#v1.15.0` pins in engine `package.json` and academy root + `apps/api/package.json`.
- Tag push and every deploy are Praveen-gated (announce before/after). Order: contract tag → engine (pin + read route) deploy → academy (pin + card + mint) deploy, both tenants (`./deploy-crimsora.sh`, `./deploy-evelyntutor.com.sh`). Run `deploy/env-drift-check.sh` before any academy deploy.
- Academy tests: `npm test` (vitest, `tests/`), `npm run typecheck` at root and in `apps/web`.
- Commit trailer on every commit: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` / `Claude-Session: https://claude.ai/code/session_017HSQzGrkRuuzVWbUCnDZ8x`.

---

## File structure

| Repo | File | Responsibility |
|---|---|---|
| contract | `src/v1/schemas.ts`, `src/v1/types.ts`, `scripts/schemas.test.ts`, `package.json`, `README.md` changelog | v1.15.0 additive shapes |
| engine | `src/app/api/portal/v1/assigned-practice/route.ts` (create) | authoritative read |
| engine | `src/lib/tutor/portal/session-result.ts` (modify) | `assignedPractice` + `nextSessionIntent` on the result |
| engine | `scripts/test-portal-contract.ts`, `scripts/test-portal-endpoints.ts` (extend) | parse + route coverage |
| academy api | `src/engine/EngineClient.ts`, `src/engine/embedToken.ts`, `src/services/SessionService.ts`, `src/services/ArtifactService.ts`, `src/models/artifacts.ts`, `src/models/Session.ts`, `src/http/routes/core.ts` | client, mint fields, result storage, routes |
| academy web | `lib/me.ts`, `app/api/practice/assigned/route.ts` (create), `app/app/courses/[courseKey]/page.tsx`, `components/PracticeView.tsx` | card + drill reuse |
| academy | `tests/assigned-practice.test.ts` (create) | vitest |

---

### Task 1: Contract v1.15.0 — schemas, types, tests, build, sync

**Files:**
- Modify: `/Users/luke/Dev/portal-contract/src/v1/schemas.ts` (after `ReviewPlanResponseSchema`, ~line 1080), `src/v1/types.ts`, `scripts/schemas.test.ts`, `package.json` (`"version": "1.15.0"`), `README.md` changelog.

**Interfaces:**
- Produces:
```ts
export const AssignedPracticeLoSchema = z.object({ loId: z.string().min(1), title: z.string().optional(), reason: z.string(), items: z.array(PracticeItemSchema), status: z.object({ attempted: z.number().int().nonnegative(), correct: z.number().int().nonnegative(), total: z.number().int().nonnegative(), lastAttemptAt: z.string().optional() }) });
export const AssignedPracticeEntrySchema = z.object({ assignmentId: z.string(), sessionId: z.string(), assignedAt: z.string(), locator: z.string().optional(), los: z.array(AssignedPracticeLoSchema) });
export const AssignedPracticeRequestSchema = z.object({ studentId: z.string().min(1), courseId: z.string().optional(), includeAcknowledged: z.boolean().optional() });
export const AssignedPracticeResponseSchema = z.object({ assignments: z.array(AssignedPracticeEntrySchema) });
// SessionResultSchema += assignedPractice?: Array<{ loId, title?, itemIds: string[], reason, assignedAt }>, nextSessionIntent?: string
export type AssignedPracticeRequest / AssignedPracticeResponse / AssignedPracticeEntry
```

- [ ] **Step 1: Failing test** — append to `scripts/schemas.test.ts` (it uses `node:assert` + a `test()` helper; follow the file's own helper name):
```ts
import { AssignedPracticeRequestSchema, AssignedPracticeResponseSchema, SessionResultSchema } from '../src/v1/schemas';
test('v1.15.0 assigned-practice request/response parse', () => {
  assert.ok(AssignedPracticeRequestSchema.safeParse({ studentId: 's1' }).success);
  assert.ok(!AssignedPracticeRequestSchema.safeParse({}).success);
  const res = AssignedPracticeResponseSchema.safeParse({ assignments: [{ assignmentId: 'a', sessionId: 's', assignedAt: '2026-09-05T00:00:00Z', locator: 'Unit 2 · Practice', los: [{ loId: 'lo1', title: 'T', reason: 'r', items: [{ id: 'i1', source: 'bank', problemText: 'q', expectedAnswer: '1' }], status: { attempted: 1, correct: 1, total: 1 } }] }] });
  assert.ok(res.success, JSON.stringify(res));
});
test('v1.15.0 SessionResult carries optional assignedPractice + nextSessionIntent and still parses without them', () => {
  const base = { sessionId: 's', studentId: 'st', courseId: 'c', status: 'completed', milestone: 'none', notesTouched: [], learningStateDelta: { gaps: { new: [], promoted: [], resolved: [] }, mastery: [] }, renderedArtifacts: { quizzes: [], conceptMaps: [] } };
  assert.ok(SessionResultSchema.safeParse(base).success);
  const withHw = SessionResultSchema.safeParse({ ...base, assignedPractice: [{ loId: 'lo1', itemIds: ['i1', 'i2'], reason: 'r', assignedAt: '2026-09-05T00:00:00Z' }], nextSessionIntent: 'start with vertex form' });
  assert.ok(withHw.success, JSON.stringify(withHw));
});
```

- [ ] **Step 2: Run** `npm test` in the contract repo → FAIL (missing exports).

- [ ] **Step 3: Schemas** — after `ReviewPlanResponseSchema`:
```ts
// v1.15.0 (additive): tutor-assigned practice (homework) read + result fields
export const AssignedPracticeStatusSchema = z.object({
  attempted: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  lastAttemptAt: z.string().optional(),
});
export const AssignedPracticeLoSchema = z.object({
  loId: z.string().min(1),
  title: z.string().optional(),
  /** The tutor's one-sentence reason, shown on the student's card. */
  reason: z.string(),
  /** Items WITH answer keys (same contract as /practice: local grading). */
  items: z.array(PracticeItemSchema),
  status: AssignedPracticeStatusSchema,
});
export const AssignedPracticeEntrySchema = z.object({
  assignmentId: z.string(),
  sessionId: z.string(),
  assignedAt: z.string(),
  /** The academy's own display locator, echoed back ("Unit 2 · Practice"). */
  locator: z.string().optional(),
  los: z.array(AssignedPracticeLoSchema),
});
export const AssignedPracticeRequestSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().optional(),
  includeAcknowledged: z.boolean().optional(),
});
export const AssignedPracticeResponseSchema = z.object({ assignments: z.array(AssignedPracticeEntrySchema) });
```
In `SessionResultSchema` add after `lessonProgress`:
```ts
  /** v1.15.0 (additive): homework the tutor assigned at close. Best-effort
   *  on the result (the engine's tool-time write and the portal's emit are
   *  independent requests); `assigned-practice` is the authoritative read. */
  assignedPractice: z.array(z.object({
    loId: z.string(), title: z.string().optional(), itemIds: z.array(z.string()), reason: z.string(), assignedAt: z.string(),
  })).optional(),
  /** v1.15.0 (additive): the tutor's own "next time we'll…" note. */
  nextSessionIntent: z.string().optional(),
```
`types.ts`: add the three `z.infer` exports (`AssignedPracticeRequest`, `AssignedPracticeResponse`, `AssignedPracticeEntry`) following the file's pattern. `package.json` → `1.15.0`. README changelog: `- **1.15.0** (additive): assigned-practice read (POST /assigned-practice) + SessionResult.assignedPractice? / nextSessionIntent?.`

- [ ] **Step 4: Test, build, sync, commit**
```bash
cd /Users/luke/Dev/portal-contract && npm test && npm run build
for c in /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-rounds /Users/luke/Dev/academy; do rsync -a --delete dist/ "$c/node_modules/@evelyn/portal-contract/dist/"; cp package.json "$c/node_modules/@evelyn/portal-contract/package.json"; done
git add -A && git commit -m "feat(v1.15.0): additive assigned-practice read + SessionResult.assignedPractice/nextSessionIntent"
```
Tag + push (`git tag v1.15.0 && git push origin main v1.15.0`) ONLY on Praveen's go — it is outward-facing. Until then both consumers run on the synced `node_modules`.

---

### Task 2: Engine — result fields + `assigned-practice` read route + pin

**Files:**
- Modify: `src/lib/tutor/portal/session-result.ts` (~line 300-335, where `base` is assembled)
- Create: `src/app/api/portal/v1/assigned-practice/route.ts`
- Modify: `package.json` (pin `#v1.15.0`), `scripts/test-portal-contract.ts`, `scripts/test-portal-endpoints.ts`

**Interfaces:**
- Consumes (Plan 1): `findAssignmentBySession`, `findOpenAssignments`, `computeHomeworkStatus`, `PracticeAssignmentModel`, `EvidenceEventModel`.
- Produces: `POST /api/portal/v1/assigned-practice` (HMAC via `withPortalAuth`) → `AssignedPracticeResponse`.

- [ ] **Step 1: Failing tests.** `scripts/test-portal-contract.ts`: add a parse case mirroring Task 1's second test (imports from `@evelyn/portal-contract/v1`). `scripts/test-portal-endpoints.ts`: add the auth cases the file already uses for every route (missing signature → 401, bad body → 400) for `/api/portal/v1/assigned-practice`.

- [ ] **Step 2: Result fields** — in `emitSessionResult`, after `const artifacts = …` and before `base`:
```ts
  // v1.15.0 — best-effort homework echo (authoritative read = assigned-practice route).
  const assignment = await findAssignmentBySession(req.sessionId).catch(() => null);
  const assignedPractice = assignment && assignment.locator
    ? assignment.los.map((l) => ({ loId: l.loId, title: l.title, itemIds: l.items.map((i) => i.id), reason: l.reason, assignedAt: assignment.assignedAt.toISOString() }))
    : undefined;
  const nextSessionIntent = assignment?.nextTimeIntent ?? profile.nextSessionIntent?.text;
```
and add `...(assignedPractice ? { assignedPractice } : {}), ...(nextSessionIntent ? { nextSessionIntent } : {})` to `base`. (Locator-gated: no locator ⇒ never echoed — spec §C.6.)

- [ ] **Step 3: Route**
```ts
// src/app/api/portal/v1/assigned-practice/route.ts
/** POST /api/portal/v1/assigned-practice — authoritative homework read (v1.15.0, spec §C.8). */
import { NextResponse } from 'next/server';
import { withPortalAuth } from '@/lib/tutor/portal/auth';
import { AssignedPracticeRequestSchema, AssignedPracticeResponseSchema } from '@evelyn/portal-contract/v1';
import connectDB from '@core/db';
import { EvidenceEventModel, PracticeAssignmentModel } from '@/models';
import { resolveProfileIdOrRaw } from '@/lib/tutor/student-profile/store';
import { findOpenAssignments } from '@/lib/tutor/practice-assign/store';
import { computeHomeworkStatus } from '@/lib/tutor/practice-assign/status';

export const runtime = 'nodejs';

export const POST = withPortalAuth(async (_req, auth) => {
  const parsed = AssignedPracticeRequestSchema.safeParse(auth.body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request', issues: parsed.error.issues }, { status: 400 });
  const { studentId, courseId, includeAcknowledged } = parsed.data;
  const profileId = await resolveProfileIdOrRaw({ partnerId: auth.partnerId, externalStudentId: studentId });
  await connectDB();
  const records = includeAcknowledged
    ? await PracticeAssignmentModel.find({ studentId: profileId, locator: { $exists: true, $ne: '' }, ...(courseId ? { courseId } : {}) }).sort({ assignedAt: -1 }).limit(10).lean()
    : (await findOpenAssignments(profileId, { withinDays: 21, requireLocator: true })).filter((a) => !courseId || a.courseId === courseId);
  const itemIds = records.flatMap((a) => a.los.flatMap((l) => l.items.map((i) => i.id)));
  const rows = itemIds.length ? await EvidenceEventModel.find({ studentId: profileId, itemId: { $in: itemIds } }).select('itemId outcome occurredAt').lean() : [];
  const assignments = records.map((a) => {
    const st = computeHomeworkStatus(a, rows);
    return {
      assignmentId: a._id, sessionId: a.sessionId, assignedAt: a.assignedAt.toISOString(), ...(a.locator ? { locator: a.locator } : {}),
      los: a.los.map((l) => {
        const s = st.los.find((x) => x.loId === l.loId)!;
        return { loId: l.loId, title: l.title, reason: l.reason, items: l.items, status: { attempted: s.attempted, correct: s.correct, total: s.total, ...(s.lastAttemptAt ? { lastAttemptAt: s.lastAttemptAt } : {}) } };
      }),
    };
  });
  return NextResponse.json(AssignedPracticeResponseSchema.parse({ assignments }));
});
```

- [ ] **Step 4: Pin, test, commit**
```bash
sed -i '' 's/portal-contract#v1.14.0/portal-contract#v1.15.0/' package.json   # apps/tutor + repo root package.json
npm run test:portal && npx tsc --noEmit -p .
git add -A && git commit -m "feat(tutor): v1.15.0 — assigned-practice read route + assignedPractice/nextSessionIntent on SessionResult (spec §C.8)"
```

---

### Task 3: Academy API — client, mint fields, result storage, routes, PracticeSet source

**Files:**
- Modify: `apps/api/src/engine/EngineClient.ts` (after `learnerState`), `apps/api/src/engine/embedToken.ts` (`EmbedConfig` + `BuildEmbedInput` + the claim spread ~line 156-160), `apps/api/src/services/SessionService.ts` (`startSession` node branch ~line 249-270; `buildLiveEmbedUrl` opts ~line 690-745; `processResult` ~line 921-930), `apps/api/src/services/ArtifactService.ts` (new `startAssignedPractice`), `apps/api/src/models/artifacts.ts` (source enum), `apps/api/src/models/Session.ts`, `apps/api/src/http/routes/core.ts` (two routes), root + `apps/api/package.json` pins.
- Test: `tests/assigned-practice.test.ts` (vitest; mirror `tests/quiz.test.ts`'s setup: in-memory Mongo + a mocked `EngineClient`).

**Interfaces:**
- Produces: `EngineClient.assignedPractice(req: AssignedPracticeRequest, timeoutMs?): Promise<AssignedPracticeResponse>`; `GET /me/assigned-practice?courseId=` → `AssignedPracticeResponse`; `POST /artifacts/practice/assigned { assignmentId, loId }` → `{ practiceSetId, items }`; `BuildEmbedInput.practiceLocator?`, `.goalNote?` → claims `practice_locator`, `goal_note`; `Session.assignedPractice?`, `Session.nextSessionIntent?`; `PracticeSet.source` enum += `'tutor-assigned'`.

- [ ] **Step 1: Failing test**
```ts
// tests/assigned-practice.test.ts
import { describe, it, expect, vi } from 'vitest';
import { startAssignedPractice } from '../apps/api/src/services/ArtifactService.js';
import { PracticeSet } from '../apps/api/src/models/index.js';
// use the same in-memory Mongo bootstrap helper tests/quiz.test.ts uses (import it identically)

describe('tutor-assigned practice', () => {
  it('creates a PracticeSet with source tutor-assigned from the engine read, and reuses it on a second start', async () => {
    const engine = { assignedPractice: vi.fn().mockResolvedValue({ assignments: [{ assignmentId: 'as1', sessionId: 's', assignedAt: '2026-09-05T00:00:00Z', locator: 'Unit 2 · Practice', los: [{ loId: 'lo1', title: 'Fractions', reason: 'r', items: [{ id: 'i1', source: 'bank', problemText: 'q', expectedAnswer: '1' }], status: { attempted: 0, correct: 0, total: 1 } }] }] }) } as any;
    const first = await startAssignedPractice({ engine, userId: USER_ID, studentId: 'esid', courseId: COURSE_ID, assignmentId: 'as1', loId: 'lo1' });
    expect(first.items.map((i) => i.id)).toEqual(['i1']);
    const doc = await PracticeSet.findById(first.practiceSetId).lean();
    expect(doc?.source).toBe('tutor-assigned');
    expect((doc?.scope as any).assignmentId).toBe('as1');
    const second = await startAssignedPractice({ engine, userId: USER_ID, studentId: 'esid', courseId: COURSE_ID, assignmentId: 'as1', loId: 'lo1' });
    expect(second.practiceSetId).toBe(first.practiceSetId);
  });
  it('unknown assignment/lo → throws not found', async () => {
    const engine = { assignedPractice: vi.fn().mockResolvedValue({ assignments: [] }) } as any;
    await expect(startAssignedPractice({ engine, userId: USER_ID, studentId: 'esid', courseId: COURSE_ID, assignmentId: 'zzz', loId: 'lo1' })).rejects.toThrow(/not found/);
  });
});
```
(`USER_ID`/`COURSE_ID`: create a user + course in `beforeAll` the way `tests/quiz.test.ts` does.)

- [ ] **Step 2: Run** `npm test -- assigned-practice` → FAIL.

- [ ] **Step 3: EngineClient**
```ts
  /** v1.15.0 — tutor-assigned practice (homework) read. Callers treat a throw
   *  as "no card" (best-effort surface). */
  async assignedPractice(req: AssignedPracticeRequest, timeoutMs?: number): Promise<AssignedPracticeResponse> {
    const body = AssignedPracticeRequestSchema.parse(req);
    return this.send('POST', this.path('/assigned-practice'), body, AssignedPracticeResponseSchema, timeoutMs);
  }
```
(import the three symbols from `@evelyn/portal-contract/v1`).

- [ ] **Step 4: Embed fields** — `embedToken.ts`: add to `EmbedConfig` after `mock_item_ids`: `practice_locator?: string; goal_note?: string;`; to `BuildEmbedInput`: `practiceLocator?: string; goalNote?: string;`; in the claim spread: `...(input.practiceLocator ? { practice_locator: input.practiceLocator } : {}), ...(input.goalNote ? { goal_note: input.goalNote } : {}),`. `SessionService.buildLiveEmbedUrl` opts gain `practiceLocator?: string; goalNote?: string;` and pass them through. In `startSession`'s node branch (beside `readinessNote`):
```ts
    // Spec §C.7 — where tutor-assigned practice lands + the student's goal.
    const nodeDoc = input.nodeId ? await CourseNode.findById(input.nodeId).select('unit').lean() : null;
    const practiceLocator = !isTrial && nodeDoc?.unit ? `Unit ${nodeDoc.unit} · Practice` : undefined;
    const enrollmentGoal = !isTrial ? (await Enrollment.findOne({ userId: input.userId, courseId: input.courseId }).select('goal').lean())?.goal : undefined;
    const goalNote = enrollmentGoal?.targetDate
      ? `target date ${new Date(enrollmentGoal.targetDate).toISOString().slice(0, 10)}${enrollmentGoal.targetScore ? `, target score ${enrollmentGoal.targetScore}` : ''}`
      : undefined;
```
and pass `practiceLocator, goalNote` into `buildLiveEmbedUrl`. Do the same in `resumeSession`'s re-mint (grep `buildLiveEmbedUrl(` for the second call site) so a resumed session keeps the locator.

- [ ] **Step 5: Session row + processResult** — `models/Session.ts` after `milestoneReached`:
```ts
  // v1.15.0: homework the tutor assigned at close (summary for the chip) + its next-time note.
  assignedPractice: { type: [new Schema({ loId: String, title: String, count: Number, reason: String }, { _id: false })], default: undefined },
  nextSessionIntent: { type: String },
```
In `processResult` after `session.milestoneReached = result.milestone;`:
```ts
  if (result.assignedPractice?.length) session.assignedPractice = result.assignedPractice.map((a) => ({ loId: a.loId, title: a.title, count: a.itemIds.length, reason: a.reason }));
  if (result.nextSessionIntent) session.nextSessionIntent = result.nextSessionIntent;
```

- [ ] **Step 6: PracticeSet source + service** — `models/artifacts.ts` enum: `['session-extracted', 'bank-retrieved', 'derived', 'tutor-assigned']`. `ArtifactService.ts`:
```ts
export async function startAssignedPractice(input: { engine: EngineClient; userId: string; studentId: string; courseId: string; assignmentId: string; loId: string }) {
  const existing = await PracticeSet.findOne({ userId: input.userId, courseId: input.courseId, source: 'tutor-assigned', 'scope.assignmentId': input.assignmentId, 'scope.loId': input.loId }).lean();
  if (existing) return { practiceSetId: String(existing._id), items: existing.items as PracticeItem[] };
  const res = await input.engine.assignedPractice({ studentId: input.studentId, courseId: await engineCourseIdForCourseId(input.courseId), includeAcknowledged: true }, 5000);
  const lo = res.assignments.find((a) => a.assignmentId === input.assignmentId)?.los.find((l) => l.loId === input.loId);
  if (!lo) throw new Error(`assigned practice not found: ${input.assignmentId}/${input.loId}`);
  const set = await PracticeSet.create({ userId: input.userId, courseId: input.courseId, scope: { loId: input.loId, assignmentId: input.assignmentId }, items: lo.items, source: 'tutor-assigned' });
  return { practiceSetId: String(set._id), items: lo.items };
}
```
`attemptPractice` reads `scope.loId` for its light commit — unchanged, so attempts on an assigned set emit evidence with the assigned item ids.

- [ ] **Step 7: Routes** — beside `/me/practice-history`:
```ts
  r.get('/me/assigned-practice', asyncHandler(async (req, res) => {
    const { esid } = getAuth(req);
    const courseId = String(req.query.courseId ?? '');
    if (!courseId) throw notFound('courseId required');
    try {
      res.json(await deps.engine.assignedPractice({ studentId: esid, courseId: await engineCourseIdForCourseId(courseId) }, 5000));
    } catch (err) {
      console.warn('[assigned-practice] engine read failed; rendering no card:', (err as Error)?.message ?? err);
      res.json({ assignments: [] });
    }
  }));
```
and beside `/artifacts/practice`:
```ts
  r.post('/artifacts/practice/assigned', asyncHandler(async (req, res) => {
    const { userId, esid } = getAuth(req);
    const body = parseBody(z.object({ courseId: z.string(), assignmentId: z.string().min(1), loId: z.string().min(1) }), req);
    const out = await startAssignedPractice({ engine: deps.engine, userId, studentId: esid, courseId: body.courseId, assignmentId: body.assignmentId, loId: body.loId });
    res.status(201).json(out);
  }));
```
(No premium gate: homework the tutor assigned must never be paywalled — note it in the route comment.)

- [ ] **Step 8: Pins, tests, commit**
```bash
sed -i '' 's/portal-contract#v1.14.0/portal-contract#v1.15.0/' package.json apps/api/package.json
npm run typecheck && npm test
git add -A && git commit -m "feat(api): v1.15.0 — assigned-practice read, tutor-assigned PracticeSet, practice_locator/goal_note mint, Session homework chip"
```

---

### Task 4: Academy web — "From your tutor" card + drill reuse

**Files:**
- Modify: `apps/web/lib/me.ts` (add `getAssignedPractice`), `apps/web/app/app/courses/[courseKey]/page.tsx` (`PracticeTab` ~line 349-380), `apps/web/components/PracticeView.tsx` (props, card, `PracticeDrill` preset), `apps/web/components/PracticeView.module.css` (card style)
- Create: `apps/web/app/api/practice/assigned/route.ts`

**Interfaces:**
- Consumes: Task 3's routes and `AssignedPracticeResponse`.
- Produces: `PracticeViewProps.assigned?: AssignedPracticeEntry[]`; `PracticeDrill` gains `preset?: { practiceSetId: string; items: PracticeItem[] }`.

- [ ] **Step 1: Fetch helper + BFF**
```ts
// lib/me.ts
export const getAssignedPractice = (courseId: string) =>
  apiGet<AssignedPracticeResponse>(`/api/me/assigned-practice?courseId=${encodeURIComponent(courseId)}`);
```
```ts
// app/api/practice/assigned/route.ts
import { type NextRequest } from 'next/server';
import { forward } from '@/lib/bff';
export async function POST(req: NextRequest) { return forward('POST', '/api/artifacts/practice/assigned', await req.json()); }
```

- [ ] **Step 2: PracticeTab** — add `getAssignedPractice(courseId).then((r) => r?.assignments ?? [])` to the `Promise.all` and pass `assigned={assigned}` to `PracticeView`.

- [ ] **Step 3: Card + drill preset.** In `PracticeView`: add `assigned?: AssignedPracticeEntry[]` to props; compute `const unitAssigned = useMemo(() => (assigned ?? []).flatMap((a) => a.los.filter((l) => unitNodes.some((n) => n.loId === l.loId)).map((l) => ({ a, l }))), [assigned, unitNodes]);` and render, ABOVE the quiz cards inside the non-locked branch:
```tsx
          {unitAssigned.map(({ a, l }) => (
            <AssignedCard key={`${a.assignmentId}-${l.loId}`} courseId={courseId} assignmentId={a.assignmentId} lo={l} assignedAt={a.assignedAt}
              onAttempt={(percent) => setPracHist((prev) => { const next = prev.filter((h) => h.loId !== l.loId); const cur = prev.find((h) => h.loId === l.loId) ?? { loId: l.loId, attempts: [] }; return [...next, { loId: l.loId, attempts: [...cur.attempts, { attemptedAt: new Date().toISOString(), scorePercent: percent }] }]; })} />
          ))}
```
```tsx
function AssignedCard({ courseId, assignmentId, lo, assignedAt, onAttempt }: { courseId: string; assignmentId: string; lo: AssignedPracticeEntry['los'][number]; assignedAt: string; onAttempt: (percent: number) => void }) {
  const [preset, setPreset] = useState<{ practiceSetId: string; items: PracticeItem[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const st = lo.status;
  const pill = st.attempted === 0 ? 'Not started' : st.attempted >= st.total ? `Done · ${st.correct}/${st.total}` : `${st.attempted}/${st.total} done`;
  const start = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await postJson('/api/practice/assigned', { courseId, assignmentId, loId: lo.loId });
      const data = await res.json();
      if (!res.ok) throw new Error(errMsg(data, 'Could not load your homework.'));
      setPreset({ practiceSetId: data.practiceSetId, items: data.items });
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className={`${s.loCard} ${s.assignedCard}`} data-testid={`assigned-${assignmentId}-${lo.loId}`}>
      <div className={s.loHead}>
        <span className={s.assignedTag}>From your tutor · {assignedAt.slice(0, 10)}</span>
        <span className={s.loTitle}>{lo.title ?? lo.loId}</span>
        <span className={`${s.pill} ${st.attempted >= st.total && st.total > 0 ? s.pillGood : s.pillMuted}`}>{pill}</span>
      </div>
      <p className={s.assignedReason}>{lo.reason}</p>
      {err && <p className={s.err}>{err}</p>}
      {preset
        ? <div className={s.loBody}><PracticeDrill courseId={courseId} loId={lo.loId} onAttempt={onAttempt} preset={preset} /></div>
        : <button className={s.primary} onClick={start} disabled={busy}>{busy ? 'Loading…' : st.attempted > 0 ? 'Continue' : 'Start'} · {lo.items.length} questions</button>}
    </div>
  );
}
```
`PracticeDrill`: add `preset?: { practiceSetId: string; items: PracticeItem[] }` to its props; in `load`, when `preset` is provided and `items === null`, set `setItems(preset.items); setSetId(preset.practiceSetId);` (skipping the `/api/practice` fetch and the seen-dedupe), and auto-call `load()` once on mount via a `useEffect` guarded on `preset`. Everything else (check, commit-on-unmount → `/api/practice/attempt`) is unchanged, so attempts on the assigned set emit evidence with the assigned item ids. Add `.assignedCard { border-left: 3px solid var(--accent) }`, `.assignedTag`, `.assignedReason` to the module CSS using the existing tokens.

- [ ] **Step 4: Typecheck + eyeball**
```bash
cd apps/web && npm run typecheck
```
Prod-build eyeball (the P&Q build's lesson: dev mode flakes): `next build && next start -p 3011` with a seeded assignment (call the engine's `practice-assign` route with a signed embed token for a test student, locator set), open the course's Practice tab → card renders at the LO's unit → Start → drill → check answers → collapse → `attempt` posted. Screenshot into `artifacts/`.

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "feat(web): 'From your tutor' homework card on the Practice tab, reusing the drill (spec §C.9)"
```

---

### Task 5: Rollout — tag, engine deploy, academy deploy, live check

- [ ] **Step 1 (Praveen-gated):** push the contract tag `v1.15.0`; `npm install` in engine worktree and academy to confirm the pinned tag resolves (node_modules identical to the synced dist).
- [ ] **Step 2:** Engine: merge `origin/main` into `tutor-rounds`, gates (tsc, build, `test:all` with only the 4 known reds), announce, `./deploy-tutor.sh`, verify BUILD_ID + `curl -s -o /dev/null -w '%{http_code}' localhost:3007/api/portal/v1/assigned-practice` → 401 (auth required) and a `/zzz` control → 404. Push `tutor-rounds:main`.
- [ ] **Step 3:** Academy: `deploy/env-drift-check.sh`, announce, `./deploy-crimsora.sh` then `./deploy-evelyntutor.com.sh`; verify both BUILD_IDs and that a newly minted session's embed URL carries `practice_locator` (decode the token payload from a test session start; read-only).
- [ ] **Step 4: Live check (crimsora test account):** full lesson session → tutor assigns at close (`practice_assigned` in the session's debugEvents; the tutor names "Unit N · Practice") → Practice tab shows the card → complete the drill → next session on the same course: `homework_checked` and the opener acknowledges it. Record all four observations, with session ids, in `docs/superpowers/reports/…-plan2-ledger.md`; update the handoff memories.

---

## Self-review notes

- Spec coverage: C.7 academy (T3 step 4), C.8 (T1, T2), C.9 (T3, T4), §8 sequencing (T5). The engine EmbedConfig side of C.7 shipped in Plan 1.
- The race noted in spec §C.8 is handled: the card reads the authoritative route (T3 step 7 + T4), never `Session.assignedPractice` (chip only).
- Types: `AssignedPracticeEntry` / `AssignedPracticeResponse` are the only cross-repo names and come from the contract; `startAssignedPractice` is defined in T3 and consumed in T3's route and T4's BFF.
