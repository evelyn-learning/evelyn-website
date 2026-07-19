# Tutor Sessions Dashboard Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin tutor-sessions list debuggable for real-student sessions: Students-by-default filter (excludes test/showcase/Praveen), lesson title in Subject/Topic, Location column (IP capture + geolocation), Mode column removed.

**Architecture:** All engine-side (`evelynlearning`). Pure filter logic in `src/lib/tutor/recordings/filters.ts` (tested via `scripts/test-recordings.ts`), a new pure client-IP helper, IP capture + fire-and-forget ip-api.com geolocation in the `session-usage` upsert route, and rendering changes in the server component `src/app/admin/tutor-sessions/page.tsx`.

**Tech Stack:** Next.js App Router server components, Mongoose, ts-node test scripts (`npm run test:recordings`).

**Spec:** `docs/superpowers/specs/2026-07-19-tutor-sessions-dashboard-cleanup-design.md`

## Global Constraints

- Repo: `/Users/luke/Dev/evelynlearning`, work on `main`.
- Test-name exclusion list: `TEST_STUDENT_NAMES = ['praveen']`, case-insensitive substring match.
- Students filter shape: `source ∉ {test, showcase}` AND studentName not matching the test-name regex. Sessions with a MISSING `source` or `studentName` field must still match (Mongo `$nin`/`$not` semantics give this for free — don't add `$exists` clauses).
- Geo lookup: `http://ip-api.com/json/{ip}?fields=status,city,regionName,countryCode`, 3s timeout, never blocks or fails the save. Private/loopback IPs → `{ city: 'Local' }`, no network call.
- Location renders as `City, CC`; tooltip = raw IP; `–` when absent. No backfill of old sessions.
- Verification command for pure logic: `npm run test:recordings` (must end `failed: 0`).
- Type check touched files with `npx tsc --noEmit` — pre-existing errors in UNTOUCHED files are not yours to fix; only ensure no NEW errors in files this plan touches.

---

### Task 1: Students/All filter semantics in `buildSessionFilter`

**Files:**
- Modify: `src/lib/tutor/recordings/filters.ts`
- Test: `scripts/test-recordings.ts` (existing `── filters ──` section, lines ~83–96)

**Interfaces:**
- Produces: `export const TEST_STUDENT_NAMES: string[]`; `buildSessionFilter(params, now?)` — unchanged signature, new default: no/unknown `src` → Students shape; `src=all` → no source clause; `src=tutor|embed|showcase|test` unchanged.

- [ ] **Step 1: Update the filter tests to the new semantics**

In `scripts/test-recordings.ts`, REPLACE these two existing checks:

```ts
check('no params → empty filter', Object.keys(buildSessionFilter({})).length === 0);
check('invalid src ignored', Object.keys(buildSessionFilter({ src: 'bogus' })).length === 0);
```

with:

```ts
{
  // Default (no src) → Students view: excludes test/showcase sources and test-named students.
  const f = buildSessionFilter({}) as { source?: { $nin?: string[] }; studentName?: { $not?: RegExp } };
  check('no params → students source $nin', JSON.stringify(f.source?.$nin) === JSON.stringify(['test', 'showcase']));
  check('no params → students name exclusion matches Praveen', f.studentName?.$not instanceof RegExp && f.studentName.$not.test('Praveen'));
  check('no params → students name exclusion spares real names', f.studentName?.$not instanceof RegExp && !f.studentName.$not.test('mitakshra bhaskar'));
}
{
  const f = buildSessionFilter({ src: 'bogus' }) as { source?: unknown };
  check('invalid src falls back to students shape', typeof f.source === 'object' && f.source !== null);
}
check('src=all → no source clause', buildSessionFilter({ src: 'all' }).source === undefined);
check('src=all + audio still applies audio', (buildSessionFilter({ src: 'all', audio: '1' }) as { hasAudio?: boolean }).hasAudio === true);
check('src=embed unchanged', (buildSessionFilter({ src: 'embed' }) as { source?: string }).source === 'embed');
```

Keep every other existing check untouched.

- [ ] **Step 2: Run to verify the new checks fail**

Run: `cd /Users/luke/Dev/evelynlearning && npm run test:recordings`
Expected: FAIL — the new students-shape checks report `✗` (current code returns `{}` for no params).

- [ ] **Step 3: Implement the new semantics**

Replace the body of `src/lib/tutor/recordings/filters.ts`'s source handling:

```ts
/**
 * searchParams → TutorSession mongo filter for the admin list page.
 * Unknown/invalid values fall back to the DEFAULT view, which is now
 * "Students": real learner sessions only (no test/showcase sources, no
 * test-account names). `src=all` is the explicit everything view.
 */
const VALID_SOURCES = new Set(['tutor', 'embed', 'showcase', 'test']);

/** Names whose sessions are internal tests regardless of source.
 *  Case-insensitive substring match against studentName. */
export const TEST_STUDENT_NAMES = ['praveen'];

const RANGE_MS: Record<string, number> = {
  today: 86_400_000,
  '7d': 7 * 86_400_000,
  '30d': 30 * 86_400_000,
};

export interface SessionFilterParams {
  src?: string;
  partner?: string;
  host?: string;
  audio?: string;
  range?: string;
}

export function buildSessionFilter(
  params: SessionFilterParams,
  now: Date = new Date(),
): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (params.src === 'all') {
    // explicit everything view — no source clause
  } else if (params.src && VALID_SOURCES.has(params.src)) {
    filter.source = params.src;
  } else {
    // Default: Students. Missing source/studentName fields still match
    // ($nin and $not both include docs lacking the field), so legacy
    // website sessions and anonymous students stay visible.
    filter.source = { $nin: ['test', 'showcase'] };
    filter.studentName = { $not: new RegExp(TEST_STUDENT_NAMES.join('|'), 'i') };
  }
  if (params.partner) filter.sourcePartnerId = params.partner;
  if (params.host) filter.sourceHost = params.host;
  if (params.audio === '1') filter.hasAudio = true;
  if (params.range && RANGE_MS[params.range]) {
    filter.startedAt = { $gte: new Date(now.getTime() - RANGE_MS[params.range]) };
  }
  return filter;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test:recordings`
Expected: PASS, `failed: 0` (all pre-existing checks still green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/recordings/filters.ts scripts/test-recordings.ts
git commit -m "feat(admin): students-by-default session filter (excludes test/showcase/test-named)"
```

---

### Task 2: Client-IP extraction helper

**Files:**
- Create: `src/lib/tutor/recordings/client-ip.ts`
- Test: `scripts/test-recordings.ts` (append a new `── client-ip ──` section)

**Interfaces:**
- Produces: `extractClientIp(headers: Headers): string | undefined` — first `x-forwarded-for` hop, else `x-real-ip`, trimmed, `::ffff:` IPv4-mapped prefix stripped, undefined when absent. `isPrivateIp(ip: string): boolean` — true for loopback/RFC1918/link-local/unique-local ranges.

- [ ] **Step 1: Write failing tests**

Append to `scripts/test-recordings.ts` (after the filters section), and add the import at the top with the other imports:

```ts
import { extractClientIp, isPrivateIp } from '../src/lib/tutor/recordings/client-ip';
```

```ts
// ── client-ip ─────────────────────────────────────────────────────
check('xff first hop wins', extractClientIp(new Headers({ 'x-forwarded-for': '203.0.113.9, 10.0.0.1' })) === '203.0.113.9');
check('x-real-ip fallback', extractClientIp(new Headers({ 'x-real-ip': '198.51.100.7' })) === '198.51.100.7');
check('no headers → undefined', extractClientIp(new Headers()) === undefined);
check('ipv4-mapped prefix stripped', extractClientIp(new Headers({ 'x-forwarded-for': '::ffff:203.0.113.9' })) === '203.0.113.9');
check('loopback private', isPrivateIp('127.0.0.1') === true);
check('::1 private', isPrivateIp('::1') === true);
check('10.x private', isPrivateIp('10.1.2.3') === true);
check('192.168 private', isPrivateIp('192.168.1.5') === true);
check('172.16 private', isPrivateIp('172.16.0.1') === true);
check('172.31 private', isPrivateIp('172.31.255.1') === true);
check('172.32 public', isPrivateIp('172.32.0.1') === false);
check('public ip not private', isPrivateIp('203.0.113.9') === false);
check('fd00 unique-local private', isPrivateIp('fd12::1') === true);
```

- [ ] **Step 2: Run to verify fail**

Run: `npm run test:recordings`
Expected: FAIL to even start (module not found) — that counts as the red step.

- [ ] **Step 3: Implement `src/lib/tutor/recordings/client-ip.ts`**

```ts
/**
 * Client IP extraction for the session-usage capture path. Pure — no Node
 * networking — so it stays testable from scripts/test-recordings.ts.
 * The engine sits behind nginx, so x-forwarded-for's first hop is the
 * client; x-real-ip is the fallback.
 */

export function extractClientIp(headers: Headers): string | undefined {
  const raw =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    '';
  if (!raw) return undefined;
  // Node often reports IPv4 as IPv6-mapped (::ffff:1.2.3.4).
  return raw.replace(/^::ffff:/i, '');
}

/** Loopback / RFC1918 / link-local / IPv6 unique-local — never geolocatable. */
export function isPrivateIp(ip: string): boolean {
  const v = ip.toLowerCase();
  if (v === '::1' || v === 'localhost') return true;
  if (/^(127|10)\./.test(v)) return true;
  if (/^192\.168\./.test(v)) return true;
  if (/^169\.254\./.test(v)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(v)) return true;
  if (/^f[cd]/.test(v)) return true; // fc00::/7 unique-local
  if (/^fe80/.test(v)) return true; // link-local
  return false;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test:recordings`
Expected: PASS, `failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/recordings/client-ip.ts scripts/test-recordings.ts
git commit -m "feat(admin): client-ip extraction helper for session location capture"
```

---

### Task 3: Model fields + IP capture + geolocation in session-usage

**Files:**
- Modify: `src/models/TutorSession.ts` (interface ~line 60s, schema near `sourceHost`)
- Create: `src/lib/tutor/recordings/geo.ts`
- Modify: `src/app/api/tutor/session-usage/route.ts` (POST handler)

**Interfaces:**
- Consumes: `extractClientIp`, `isPrivateIp` from Task 2.
- Produces: `ITutorSession.clientIp?: string`, `ITutorSession.location?: { city?: string; region?: string; country?: string }`; `lookupGeo(ip: string): Promise<{ city?: string; region?: string; country?: string } | null>`.

- [ ] **Step 1: Add model fields**

In `src/models/TutorSession.ts`, in `ITutorSession` after `sourceHost?: string;`:

```ts
  /** First-hop client IP captured on session insert (admin debugging). */
  clientIp?: string;
  /** Geolocated from clientIp at capture time (ip-api.com); city='Local' for private IPs. */
  location?: { city?: string; region?: string; country?: string };
```

In the schema, after the `sourceHost` field definition:

```ts
    clientIp: { type: String },
    location: {
      type: new Schema(
        {
          city: { type: String },
          region: { type: String },
          country: { type: String },
        },
        { _id: false },
      ),
      default: undefined,
    },
```

- [ ] **Step 2: Create `src/lib/tutor/recordings/geo.ts`**

```ts
/**
 * Best-effort IP geolocation for session capture. ip-api.com free tier:
 * HTTP only, no key, 45 req/min — far above session-start volume. Callers
 * fire-and-forget; this must never throw into the save path.
 */
import { isPrivateIp } from './client-ip';

export interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
}

const GEO_TIMEOUT_MS = 3000;

export async function lookupGeo(ip: string): Promise<GeoLocation | null> {
  if (isPrivateIp(ip)) return { city: 'Local' };
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,countryCode`,
      { signal: AbortSignal.timeout(GEO_TIMEOUT_MS) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status?: string;
      city?: string;
      regionName?: string;
      countryCode?: string;
    };
    if (data.status !== 'success') return null;
    const loc: GeoLocation = {};
    if (data.city) loc.city = data.city;
    if (data.regionName) loc.region = data.regionName;
    if (data.countryCode) loc.country = data.countryCode;
    return Object.keys(loc).length > 0 ? loc : null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 3: Wire capture into the POST handler**

In `src/app/api/tutor/session-usage/route.ts`:

Add imports at the top:

```ts
import { extractClientIp } from "@/lib/tutor/recordings/client-ip";
import { lookupGeo } from "@/lib/tutor/recordings/geo";
```

After the `await connectDB();` line in POST, detect first save:

```ts
    // Location capture (admin debugging): resolve the client IP once, on
    // the insert that creates the session document.
    const isNewSession = !(await TutorSession.exists({ sessionId }));
    const clientIp = isNewSession ? extractClientIp(req.headers) : undefined;
    if (clientIp) setOnInsertFields.clientIp = clientIp;
```

NOTE: this block must come AFTER `setOnInsertFields` is declared — place it immediately before the `// Fields that should only be set on insert` comment, and keep the `connectDB()` call above it (move `await connectDB();` up next to the rate-limit check if it currently sits lower; in the current file `connectDB` is called before the field building, so just insert the block after it).

After the `findOneAndUpdate` succeeds (immediately before `return NextResponse.json({ success: true, ... })`):

```ts
    // Fire-and-forget geolocation — a down ip-api can never sink the save.
    if (clientIp) {
      void lookupGeo(clientIp)
        .then((loc) => {
          if (loc) return TutorSession.updateOne({ sessionId }, { $set: { location: loc } });
        })
        .catch((err) => console.error("Geo lookup failed:", err));
    }
```

- [ ] **Step 4: Type-check and run tests**

Run: `npx tsc --noEmit 2>&1 | grep -E "TutorSession|session-usage|geo|client-ip"` — expected: no output (no new errors in touched files).
Run: `npm run test:recordings` — expected: PASS, `failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/models/TutorSession.ts src/lib/tutor/recordings/geo.ts src/app/api/tutor/session-usage/route.ts
git commit -m "feat(admin): capture client IP + geolocation on session insert"
```

---

### Task 4: Dashboard page — chips, lesson line, Location column, drop Mode

**Files:**
- Modify: `src/app/admin/tutor-sessions/page.tsx`

**Interfaces:**
- Consumes: `TEST_STUDENT_NAMES`-backed default filter (Task 1 — no page change needed for it beyond chips), `session.location`/`session.clientIp` (Task 3), `LessonPlan` model (`_id` string PK, `title`).

- [ ] **Step 1: Update the source chips**

Replace `SOURCE_CHIPS` in `src/app/admin/tutor-sessions/page.tsx`:

```ts
const SOURCE_CHIPS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'Students' },
  { value: 'all', label: 'All' },
  { value: 'tutor', label: 'Website' },
  { value: 'embed', label: 'Portal' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'test', label: 'Tests' },
];
```

The existing active-chip logic (`filters.src === c.value || (!filters.src && !c.value)`) already highlights Students when no `src` param is present — no change needed there.

- [ ] **Step 2: Batch-resolve lesson titles in `getSessions`**

Add the import:

```ts
import { LessonPlanModel } from "@/models/LessonPlan";
```

(`LessonPlanModel` is the verified export — `src/models/LessonPlan.ts:90`.)

In `getSessions`, after the name-fallback block and before the `return`:

```ts
  // Lesson titles for the Subject/Topic cell — one batched query per page.
  const planIds = [
    ...new Set(
      sessions
        .map((s) => (s.lessonProgress as { lessonPlanId?: string } | undefined)?.lessonPlanId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const lessonTitles: Record<string, string> = {};
  if (planIds.length > 0) {
    const plans = await LessonPlanModel.find({ _id: { $in: planIds } })
      .select('title')
      .lean();
    for (const p of plans) lessonTitles[String(p._id)] = p.title as string;
  }
```

Add `lessonTitles` to the returned object, and destructure it at the call site:

```ts
  const { sessions, total, partners, hosts, lessonTitles } = await getSessions(filters, page);
```

- [ ] **Step 3: Update the table**

Header row — replace the `Mode` `<th>` with nothing (delete it), and insert a new Location header between `Cost` and `Status`:

```tsx
<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
```

Body row changes, per cell:

1. Subject/Topic cell — add the lesson line after the topic div:

```tsx
<td className="px-4 py-3 text-sm text-gray-700">
  <div>{s.subject as string}</div>
  <div className="text-xs text-gray-400">{s.topic as string}</div>
  {(() => {
    const planId = (s.lessonProgress as { lessonPlanId?: string } | undefined)?.lessonPlanId;
    if (!planId) return null;
    return <div className="text-xs text-indigo-500">{lessonTitles[planId] || planId}</div>;
  })()}
</td>
```

2. Delete the entire Mode `<td>` (the one rendering `modeLabels[...]` and `voiceEngine`), and delete the now-unused `modeLabels` constant.

3. Insert the Location cell between the Cost and Status cells:

```tsx
<td className="px-4 py-3 text-sm text-gray-600" title={(s.clientIp as string) || undefined}>
  {(() => {
    const loc = s.location as { city?: string; country?: string } | undefined;
    const text = [loc?.city, loc?.country].filter(Boolean).join(', ');
    return text || <span className="text-gray-400">–</span>;
  })()}
</td>
```

4. Status cell — add the voice engine under the badge:

```tsx
<td className="px-4 py-3 text-sm">
  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
    statusColors[s.status as string] || 'bg-gray-100 text-gray-600'
  }`}>
    {s.status as string}
  </span>
  {s.voiceEngine ? (
    <div className="text-[10px] text-gray-400 mt-0.5">{String(s.voiceEngine)}</div>
  ) : null}
</td>
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep "tutor-sessions/page"` — expected: no output.

- [ ] **Step 5: Manual verification on dev**

Run the engine dev server (`npm run dev`, :3006) and open `/admin/tutor-sessions`:
- Default view highlights **Students**; no Praveen, test, or showcase rows.
- **All** chip (`?src=all`) shows everything, count badge matches old total.
- No Mode column; engine label appears under Status.
- Portal sessions show a third indigo line with the lesson title (or raw plan id).
- Location shows `–` on all existing rows. Start a throwaway session from localhost and confirm its row shows `Local` (private IP path).

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/tutor-sessions/page.tsx
git commit -m "feat(admin): students-default chips, lesson line, location column, drop mode column"
```
