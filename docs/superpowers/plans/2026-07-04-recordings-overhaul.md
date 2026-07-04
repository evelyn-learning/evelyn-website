# Session Recordings Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Filterable, source-tagged tutor-session recordings with a reliable replay player (audio hot-attach fix), a curated timeline, relative dates, and pagination.

**Architecture:** Three new capture fields (`source:'test'`, `sourcePartnerId`, `sourceHost`) flow from the capture pages through `/api/tutor/session-usage` into `TutorSession`. Four new pure modules under `src/lib/tutor/recordings/` carry all testable logic (relative time, event curation, speaker segments, filter queries). The admin list/detail pages stay server components with searchParams-driven filters; `ReplayPlayer` gets an explicit audio state machine with hot-attach; `ReplayTimeline` gets curated dots + an all-events lane. Spec: `docs/superpowers/specs/2026-07-04-recordings-overhaul-design.md`.

**Tech Stack:** Next.js 15 app router (server components for admin pages), Mongoose (`TutorSession`), WebAudio playback, ts-node plain-assert test scripts.

## Global Constraints

- New payload/schema fields are OPTIONAL end-to-end; old clients that omit them must still persist (spec §Error handling).
- Legacy sessions (no `sourcePartnerId`/`sourceHost`) filter under their bare `source` and show no partner/host badge. No backfill.
- Unknown searchParam values are ignored (treated as All); unknown debug-event types NEVER render as dots (hidden, not gray).
- Relative dates: "X secs/mins/hrs/days ago" within 7 days, then "Jul 2" (same year) / "Jul 2, 2025" (other years).
- Pagination page size = 50. Speaker-segment gap cap = 20000 ms.
- Admin pages keep the existing next-auth gate (`getServerSession` → redirect) — do not touch auth.
- Run `npx tsc --noEmit` after every code task; it must stay clean. Existing suites (`npm run test:caption-sync`, `npm run test:render-sync`) must stay green — they share files with none of these tasks, so any failure is a regression you introduced.

---

### Task 1: Pure modules + `test:recordings` suite (TDD)

**Files:**
- Create: `src/lib/tutor/recordings/relative-time.ts`
- Create: `src/lib/tutor/recordings/timeline-events.ts`
- Create: `src/lib/tutor/recordings/segments.ts`
- Create: `src/lib/tutor/recordings/filters.ts`
- Create: `scripts/test-recordings.ts`
- Modify: `package.json` (add script next to `test:render-sync`, ~line 44)

**Interfaces (produced — later tasks import these exactly):**

```ts
// relative-time.ts
export function formatRelativeTime(date: Date | string, now?: Date): string;

// timeline-events.ts
export interface EventCategory {
  key: 'kill' | 'perception' | 'mic' | 'upload' | 'error';
  label: string;      // legend text
  color: string;      // tailwind bg class, e.g. 'bg-purple-500'
}
export const EVENT_CATEGORIES: EventCategory[];
export function categorizeEvent(type: string): EventCategory | null; // null = hidden
export function curateEvents<T extends { data: { type?: string } }>(events: T[]): (T & { category: EventCategory })[];

// segments.ts
export interface SpeakerSegment { start: number; end: number; role: string; }
export function buildSpeakerSegments(
  entries: { offsetMs: number; role: string }[],
  totalDurationMs: number,
  gapCapMs?: number, // default 20000
): SpeakerSegment[];

// filters.ts
export interface SessionFilterParams {
  src?: string;      // 'tutor' | 'embed' | 'showcase' | 'test'
  partner?: string;  // exact sourcePartnerId
  host?: string;     // exact sourceHost
  audio?: string;    // '1' → hasAudio: true
  range?: string;    // 'today' | '7d' | '30d'
}
export function buildSessionFilter(params: SessionFilterParams, now?: Date): Record<string, unknown>;
```

- [ ] **Step 1: Write the failing test script**

Create `scripts/test-recordings.ts`:

```ts
/**
 * Unit tests for the recordings pure modules (relative-time, timeline-events,
 * segments, filters). Run: npm run test:recordings
 * Design: docs/superpowers/specs/2026-07-04-recordings-overhaul-design.md
 */
import { formatRelativeTime } from '../src/lib/tutor/recordings/relative-time';
import { categorizeEvent, curateEvents, EVENT_CATEGORIES } from '../src/lib/tutor/recordings/timeline-events';
import { buildSpeakerSegments } from '../src/lib/tutor/recordings/segments';
import { buildSessionFilter } from '../src/lib/tutor/recordings/filters';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const NOW = new Date('2026-07-04T12:00:00Z');

// ── relative-time ─────────────────────────────────────────────────
check('34 secs ago', formatRelativeTime(new Date(NOW.getTime() - 34_000), NOW) === '34 secs ago');
check('1 sec ago (singular)', formatRelativeTime(new Date(NOW.getTime() - 1_000), NOW) === '1 sec ago');
check('34 mins ago', formatRelativeTime(new Date(NOW.getTime() - 34 * 60_000), NOW) === '34 mins ago');
check('1 min ago (singular)', formatRelativeTime(new Date(NOW.getTime() - 60_000), NOW) === '1 min ago');
check('5 hrs ago', formatRelativeTime(new Date(NOW.getTime() - 5 * 3_600_000), NOW) === '5 hrs ago');
check('3 days ago', formatRelativeTime(new Date(NOW.getTime() - 3 * 86_400_000), NOW) === '3 days ago');
check('same year past 7d → "Jul 2" style', formatRelativeTime(new Date('2026-06-01T12:00:00Z'), NOW) === 'Jun 1');
check('other year → "Jul 2, 2025" style', formatRelativeTime(new Date('2025-07-02T12:00:00Z'), NOW) === 'Jul 2, 2025');
check('accepts ISO string input', formatRelativeTime(new Date(NOW.getTime() - 120_000).toISOString(), NOW) === '2 mins ago');
check('future/clock-skew clamps to just now', formatRelativeTime(new Date(NOW.getTime() + 60_000), NOW) === '0 secs ago');

// ── timeline-events: categorization ───────────────────────────────
check('judge_kill_snapshot → kill', categorizeEvent('judge_kill_snapshot')?.key === 'kill');
check('dev_forced_kill → kill', categorizeEvent('dev_forced_kill')?.key === 'kill');
check('killed_render_rollback → kill', categorizeEvent('killed_render_rollback')?.key === 'kill');
check('contradiction_inversion_retry → kill', categorizeEvent('contradiction_inversion_retry')?.key === 'kill');
check('perception_cancel_suppressed_opening → perception', categorizeEvent('perception_cancel_suppressed_opening')?.key === 'perception');
check('mic_mute → mic', categorizeEvent('mic_mute')?.key === 'mic');
check('mic_unmute → mic', categorizeEvent('mic_unmute')?.key === 'mic');
check('image_upload → upload', categorizeEvent('image_upload')?.key === 'upload');
check('error → error', categorizeEvent('error')?.key === 'error');
check('tool_call_error → error', categorizeEvent('tool_call_error')?.key === 'error');
check('perception_error → error (error beats perception)', categorizeEvent('perception_error')?.key === 'error');
check('tool_call → hidden', categorizeEvent('tool_call') === null);
check('render_sync_buffer → hidden', categorizeEvent('render_sync_buffer') === null);
check('unknown future type → hidden', categorizeEvent('some_new_event_2027') === null);
check('EVENT_CATEGORIES has 5 legend entries', EVENT_CATEGORIES.length === 5);

// curateEvents keeps only categorized, attaches category
{
  const events = [
    { data: { type: 'tool_call' } },
    { data: { type: 'mic_mute' } },
    { data: { type: 'judge_kill_snapshot' } },
    { data: {} },
  ];
  const curated = curateEvents(events);
  check('curateEvents filters uncategorized', curated.length === 2);
  check('curateEvents attaches category', curated[0].category.key === 'mic' && curated[1].category.key === 'kill');
}

// ── segments: gap cap ─────────────────────────────────────────────
{
  const segs = buildSpeakerSegments(
    [
      { offsetMs: 0, role: 'tutor' },
      { offsetMs: 5_000, role: 'student' },
      { offsetMs: 60_000, role: 'tutor' },
    ],
    100_000,
  );
  check('segment 1 ends at next entry', segs[0].start === 0 && segs[0].end === 5_000);
  check('segment 2 capped at 20s (silence not painted)', segs[1].start === 5_000 && segs[1].end === 25_000);
  check('last segment capped at 20s, not totalDuration', segs[2].start === 60_000 && segs[2].end === 80_000);
}
{
  const segs = buildSpeakerSegments([{ offsetMs: 95_000, role: 'tutor' }], 100_000);
  check('cap clamps to totalDuration', segs[0].end === 100_000);
  check('empty entries → empty segments', buildSpeakerSegments([], 100_000).length === 0);
}

// ── filters ───────────────────────────────────────────────────────
check('no params → empty filter', Object.keys(buildSessionFilter({})).length === 0);
check('src=test → source filter', (buildSessionFilter({ src: 'test' }) as { source?: string }).source === 'test');
check('invalid src ignored', Object.keys(buildSessionFilter({ src: 'bogus' })).length === 0);
check('partner filter', (buildSessionFilter({ partner: 'acme' }) as { sourcePartnerId?: string }).sourcePartnerId === 'acme');
check('host filter', (buildSessionFilter({ host: 'https://retail.example' }) as { sourceHost?: string }).sourceHost === 'https://retail.example');
check('audio=1 → hasAudio true', (buildSessionFilter({ audio: '1' }) as { hasAudio?: boolean }).hasAudio === true);
check('audio other value ignored', Object.keys(buildSessionFilter({ audio: '0' })).length === 0);
{
  const f = buildSessionFilter({ range: '7d' }, NOW) as { startedAt?: { $gte: Date } };
  check('range=7d → startedAt $gte 7 days back', f.startedAt?.$gte.getTime() === NOW.getTime() - 7 * 86_400_000);
}
{
  const f = buildSessionFilter({ range: 'today' }, NOW) as { startedAt?: { $gte: Date } };
  check('range=today → startedAt $gte 24h back', f.startedAt?.$gte.getTime() === NOW.getTime() - 86_400_000);
}
check('invalid range ignored', Object.keys(buildSessionFilter({ range: 'always' })).length === 0);
{
  const f = buildSessionFilter({ src: 'embed', partner: 'acme', audio: '1' });
  check('filters compose', Object.keys(f).length === 3);
}

console.log(`\nrecordings: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Add npm script; run to verify failure**

In `package.json` next to `test:render-sync`:

```json
"test:recordings": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-recordings.ts",
```

Run: `npm run test:recordings`
Expected: FAIL — `Cannot find module '../src/lib/tutor/recordings/relative-time'`.

- [ ] **Step 3: Implement the four modules**

`src/lib/tutor/recordings/relative-time.ts`:

```ts
/**
 * Relative-date formatting for the recordings admin surfaces.
 * "X secs/mins/hrs/days ago" within 7 days, then "Jul 2" (same year)
 * or "Jul 2, 2025" (other years). Pure; `now` injectable for tests.
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatRelativeTime(date: Date | string, now: Date = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const deltaMs = Math.max(0, now.getTime() - d.getTime());
  const secs = Math.floor(deltaMs / 1000);
  if (secs < 60) return `${secs} sec${secs === 1 ? '' : 's'} ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const md = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
  return d.getUTCFullYear() === now.getUTCFullYear() ? md : `${md}, ${d.getUTCFullYear()}`;
}
```

`src/lib/tutor/recordings/timeline-events.ts`:

```ts
/**
 * Debug-event curation for the replay timeline. A small, deliberate set of
 * categories renders as labeled dots; EVERYTHING else is hidden from the bar
 * (never an anonymous gray dot) and lives in the "show all events" lane.
 * Rule order matters: error patterns are checked before kill/perception so
 * e.g. perception_error lands in 'error'.
 */
export interface EventCategory {
  key: 'kill' | 'perception' | 'mic' | 'upload' | 'error';
  label: string;
  color: string; // tailwind bg class
}

export const EVENT_CATEGORIES: EventCategory[] = [
  { key: 'kill', label: 'Kill / retry', color: 'bg-purple-500' },
  { key: 'perception', label: 'Barge-in / perception', color: 'bg-sky-500' },
  { key: 'mic', label: 'Mic event', color: 'bg-orange-400' },
  { key: 'upload', label: 'Upload', color: 'bg-green-500' },
  { key: 'error', label: 'Error', color: 'bg-red-500' },
];

const byKey = Object.fromEntries(EVENT_CATEGORIES.map((c) => [c.key, c])) as Record<EventCategory['key'], EventCategory>;

// First-match-wins rule list. Sourced from the actual onDebugEvent type
// inventory (grep onDebugEvent in VoiceTutorRealtime.tsx / page.tsx,
// 2026-07-04). Unmatched types are hidden by design.
const RULES: { pattern: RegExp; key: EventCategory['key'] }[] = [
  { pattern: /^mic_(mute|unmute)$/, key: 'mic' },
  { pattern: /^image_upload$/, key: 'upload' },
  { pattern: /(^|_)error$/, key: 'error' },
  { pattern: /^(judge_kill|dev_forced_kill|kill_|killed_render)/, key: 'kill' },
  { pattern: /_retry$/, key: 'kill' },
  { pattern: /^(perception_|bargein|barge_in)/, key: 'perception' },
];

export function categorizeEvent(type: string): EventCategory | null {
  for (const rule of RULES) {
    if (rule.pattern.test(type)) return byKey[rule.key];
  }
  return null;
}

export function curateEvents<T extends { data: { type?: string } }>(
  events: T[],
): (T & { category: EventCategory })[] {
  const out: (T & { category: EventCategory })[] = [];
  for (const ev of events) {
    const category = ev.data.type ? categorizeEvent(ev.data.type) : null;
    if (category) out.push({ ...ev, category });
  }
  return out;
}
```

`src/lib/tutor/recordings/segments.ts`:

```ts
/**
 * Speaker segments for the replay timeline bar. A segment runs from its
 * transcript entry to the NEXT entry or `gapCapMs`, whichever is sooner —
 * so long silences render as neutral track instead of being painted as the
 * previous speaker (the pre-2026-07-04 behavior the user flagged).
 */
export interface SpeakerSegment {
  start: number;
  end: number;
  role: string;
}

export function buildSpeakerSegments(
  entries: { offsetMs: number; role: string }[],
  totalDurationMs: number,
  gapCapMs = 20_000,
): SpeakerSegment[] {
  const segments: SpeakerSegment[] = [];
  for (let i = 0; i < entries.length; i++) {
    const start = entries[i].offsetMs;
    const nextStart = i + 1 < entries.length ? entries[i + 1].offsetMs : Infinity;
    const end = Math.min(nextStart, start + gapCapMs, totalDurationMs);
    if (end > start) segments.push({ start, end, role: entries[i].role });
  }
  return segments;
}
```

`src/lib/tutor/recordings/filters.ts`:

```ts
/**
 * searchParams → TutorSession mongo filter for the admin list page.
 * Unknown/invalid values are IGNORED (fall back to All) per spec.
 */
const VALID_SOURCES = new Set(['tutor', 'embed', 'showcase', 'test']);
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
  if (params.src && VALID_SOURCES.has(params.src)) filter.source = params.src;
  if (params.partner) filter.sourcePartnerId = params.partner;
  if (params.host) filter.sourceHost = params.host;
  if (params.audio === '1') filter.hasAudio = true;
  if (params.range && RANGE_MS[params.range]) {
    filter.startedAt = { $gte: new Date(now.getTime() - RANGE_MS[params.range]) };
  }
  return filter;
}
```

- [ ] **Step 4: Run tests + typecheck**

Run: `npm run test:recordings`
Expected: `recordings: 43 passed, 0 failed`.
Run: `npx tsc --noEmit` — clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/recordings scripts/test-recordings.ts package.json
git commit -m "feat(admin): recordings pure modules — relative time, event curation, segments, filters"
```

---

### Task 2: Source identity — schema, capture, persistence

**Files:**
- Modify: `src/models/TutorSession.ts` (interface ~line 60; schema `source` block ~line 265)
- Modify: `src/app/api/tutor/session-usage/route.ts` (setOnInsertFields block, ~line 100)
- Modify: `src/app/tutor/page.tsx` (payload `source: 'tutor'` ~line 465; `__tutorTestStart` hook ~line 1165)
- Modify: `src/app/tutor-portal/embed/page.tsx` (both payload sites, ~lines 282 and ~373)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `TutorSession.source` accepts `'test'`; new optional fields `sourcePartnerId: string`, `sourceHost: string` — consumed by Tasks 3 and 6.

- [ ] **Step 1: Schema**

In `src/models/TutorSession.ts`, interface line ~60:

```ts
  source?: "tutor" | "embed" | "showcase" | "test";
  /** Embed token partner_id — which partner platform hosted the session. */
  sourcePartnerId?: string;
  /** Origin of the page embedding the tutor iframe (ancestorOrigins/referrer). */
  sourceHost?: string;
```

Schema block (~line 265):

```ts
    source: {
      type: String,
      enum: ["tutor", "embed", "showcase", "test"],
      default: "tutor",
    },
    sourcePartnerId: {
      type: String,
    },
    sourceHost: {
      type: String,
    },
```

- [ ] **Step 2: Persistence**

In `src/app/api/tutor/session-usage/route.ts`, directly after `if (body.source) setOnInsertFields.source = body.source;`:

```ts
    if (body.sourcePartnerId) setOnInsertFields.sourcePartnerId = body.sourcePartnerId;
    if (body.sourceHost) setOnInsertFields.sourceHost = body.sourceHost;
```

- [ ] **Step 3: Harness test tagging in `/tutor`**

In `src/app/tutor/page.tsx`:
1. Near the other page-level refs, add:

```ts
  // Recordings source tagging: __tutorTestStart marks the session as a
  // harness run so it persists source:'test' instead of polluting 'tutor'.
  const testSessionRef = useRef(false);
```

2. Inside the `__tutorTestStart` hook body (first statement inside the function assigned at ~line 1165):

```ts
      testSessionRef.current = true;
```

3. At the payload site (~line 465), change `source: 'tutor',` to:

```ts
      source: testSessionRef.current ? 'test' : 'tutor',
```

- [ ] **Step 4: Embed partner + host capture**

In `src/app/tutor-portal/embed/page.tsx`:
1. Add a module-level helper above the component:

```ts
/** Origin of the page embedding this iframe. ancestorOrigins is the
 *  reliable signal in Chromium/Safari; referrer is the Firefox fallback.
 *  Returns undefined outside an iframe or when both are unavailable. */
function getEmbeddingHost(): string | undefined {
  try {
    const ancestors = window.location.ancestorOrigins;
    if (ancestors && ancestors.length > 0) return ancestors[0];
    if (document.referrer) return new URL(document.referrer).origin;
  } catch { /* cross-origin quirks — omit */ }
  return undefined;
}
```

2. At BOTH payload sites (`source: 'embed',` at ~282 and ~373), add directly after the `source` line (the decoded token config holding `partner_id` is in scope at both sites — reuse the variable the surrounding code uses for it):

```ts
      sourcePartnerId: config?.partner_id || undefined,
      sourceHost: getEmbeddingHost(),
```

(If the surrounding code names the decoded token differently — e.g. `embedConfig` — use that name; verify by reading the enclosing function.)

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit` — clean. `npm run test:recordings` — still green.

```bash
git add src/models/TutorSession.ts src/app/api/tutor/session-usage/route.ts src/app/tutor/page.tsx src/app/tutor-portal/embed/page.tsx
git commit -m "feat(admin): source identity — test tagging, partnerId + host capture on sessions"
```

---

### Task 3: List page — filters, pagination, relative dates

**Files:**
- Modify: `src/app/admin/tutor-sessions/page.tsx` (full rework of the query + table header area; row rendering largely kept)

**Interfaces:**
- Consumes: `buildSessionFilter`, `formatRelativeTime` (Task 1); `sourcePartnerId`/`sourceHost`/`source:'test'` (Task 2).
- Produces: URL contract `?src=&partner=&host=&audio=1&range=&page=N` (Task 7 verifies).

- [ ] **Step 1: Rework the page**

Replace the data-fetch + header sections of `src/app/admin/tutor-sessions/page.tsx` with the following (keep the existing imports that remain used, drop unused ones; the table `<tbody>` row markup stays as-is except the two cells noted in Step 2):

```tsx
import { formatRelativeTime } from "@/lib/tutor/recordings/relative-time";
import { buildSessionFilter, type SessionFilterParams } from "@/lib/tutor/recordings/filters";

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function param(sp: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = sp[key];
  return typeof v === 'string' && v ? v : undefined;
}

async function getSessions(filters: SessionFilterParams, page: number) {
  await connectDB();
  const query = buildSessionFilter(filters);
  const [sessions, total, partners, hosts] = await Promise.all([
    TutorSession.find(query)
      .select('-transcript -whiteboardCommands -debugEvents -tokenUsage')
      .sort({ startedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    TutorSession.countDocuments(query),
    TutorSession.distinct('sourcePartnerId', { sourcePartnerId: { $nin: [null, ''] } }),
    TutorSession.distinct('sourceHost', { sourceHost: { $nin: [null, ''] } }),
  ]);
  return {
    sessions: JSON.parse(JSON.stringify(sessions)),
    total,
    partners: partners.sort(),
    hosts: hosts.sort(),
  };
}

const SOURCE_CHIPS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'tutor', label: 'Website' },
  { value: 'embed', label: 'Portal' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'test', label: 'Tests' },
];

const RANGE_CHIPS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
];

/** Build an href preserving current filters, overriding the given keys.
 *  Setting a key to undefined removes it. Page resets unless explicitly set. */
function filterHref(current: SessionFilterParams & { page?: string }, overrides: Record<string, string | undefined>): string {
  const merged: Record<string, string | undefined> = { ...current, page: undefined, ...overrides };
  const qs = Object.entries(merged)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join('&');
  return qs ? `/admin/tutor-sessions?${qs}` : '/admin/tutor-sessions';
}
```

The component body:

```tsx
export default async function TutorSessionsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const filters: SessionFilterParams = {
    src: param(sp, 'src'),
    partner: param(sp, 'partner'),
    host: param(sp, 'host'),
    audio: param(sp, 'audio'),
    range: param(sp, 'range'),
  };
  const page = Math.max(1, parseInt(param(sp, 'page') || '1', 10) || 1);
  const { sessions, total, partners, hosts } = await getSessions(filters, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const now = new Date();
  // ... header unchanged except the count badge shows `${total} sessions`
```

Filter row (render between the header and the table):

```tsx
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {SOURCE_CHIPS.map((c) => (
            <Link
              key={c.label}
              href={filterHref(filters, { src: c.value })}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                filters.src === c.value || (!filters.src && !c.value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {c.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-gray-300" />
          {RANGE_CHIPS.map((c) => (
            <Link
              key={c.label}
              href={filterHref(filters, { range: c.value })}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                filters.range === c.value || (!filters.range && !c.value)
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {c.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-gray-300" />
          <Link
            href={filterHref(filters, { audio: filters.audio === '1' ? undefined : '1' })}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              filters.audio === '1'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Has audio
          </Link>
        </div>
        {(partners.length > 0 || hosts.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {partners.length > 0 && (
              <span className="flex flex-wrap items-center gap-1 text-gray-400">
                Partner:
                {partners.map((p: string) => (
                  <Link key={p} href={filterHref(filters, { partner: filters.partner === p ? undefined : p })}
                    className={`rounded px-2 py-0.5 border ${filters.partner === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    {p}
                  </Link>
                ))}
              </span>
            )}
            {hosts.length > 0 && (
              <span className="flex flex-wrap items-center gap-1 text-gray-400">
                Host:
                {hosts.map((h: string) => (
                  <Link key={h} href={filterHref(filters, { host: filters.host === h ? undefined : h })}
                    className={`rounded px-2 py-0.5 border ${filters.host === h ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    {h.replace(/^https?:\/\//, '')}
                  </Link>
                ))}
              </span>
            )}
          </div>
        )}
      </div>
```

Pagination (render after the table):

```tsx
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-1 py-4 text-sm text-gray-500">
            <span>Page {page} of {totalPages} · {total} sessions</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={filterHref(filters, { page: String(page - 1) })} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50">← Newer</Link>
              )}
              {page < totalPages && (
                <Link href={filterHref(filters, { page: String(page + 1) })} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50">Older →</Link>
              )}
            </div>
          </div>
        )}
```

Empty state: keep the existing "No tutor sessions found." card but change the copy to `No sessions match these filters.` when any filter is active.

- [ ] **Step 2: Row cells — date, source badge, mode+engine merge**

In the row markup:
1. Date cell becomes relative with absolute on hover:

```tsx
                      <td className="px-4 py-3 text-sm text-gray-500" title={new Date(s.startedAt as string).toLocaleString('en-US')}>
                        {formatRelativeTime(s.startedAt as string, now)}
                      </td>
```

2. Source badge under the student name — replace the existing `s.source && String(s.source) !== 'tutor'` block with:

```tsx
                        {(s.source && String(s.source) !== 'tutor') || s.sourcePartnerId ? (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {String(s.source) !== 'tutor' && (
                              <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                String(s.source) === 'embed' ? 'bg-indigo-50 text-indigo-600'
                                : String(s.source) === 'test' ? 'bg-purple-50 text-purple-600'
                                : 'bg-amber-50 text-amber-600'
                              }`}>
                                {String(s.source) === 'embed' ? 'Portal' : String(s.source) === 'test' ? 'Test' : String(s.source)}
                              </span>
                            )}
                            {s.sourcePartnerId ? (
                              <span className="inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600">
                                {String(s.sourcePartnerId)}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
```

3. Merge Mode + engine into one cell (drop the separate engine line's redundancy): keep the existing mode badge, render the engine as the small second line as today — no change needed beyond confirming it reads well; if the Level column is mostly '-', leave it (YAGNI).

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit` — clean. Load `http://localhost:3006/admin/tutor-sessions` (dev server is running) — filters render, chips navigate, dates relative.

```bash
git add src/app/admin/tutor-sessions/page.tsx
git commit -m "feat(admin): tutor-sessions list — source/partner/host/audio/date filters, pagination, relative dates"
```

---

### Task 4: ReplayPlayer — audio state machine + hot-attach + status pill

**Files:**
- Modify: `src/app/admin/tutor-sessions/components/ReplayPlayer.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: none (self-contained UI). The bug contract: play-before-load must gain sound WITHOUT any user action once loading completes; empty/404 tracks must show "No audio recorded"; fetch failure shows "Audio failed — Retry".

- [ ] **Step 1: Replace the audio-loaded flags with a state machine**

Remove `const [audioLoaded, setAudioLoaded] = useState(false);` and `const [audioLoading, setAudioLoading] = useState(false);`. Add:

```tsx
  type AudioState = 'idle' | 'loading' | 'ready' | 'none' | 'error';
  const [audioState, setAudioState] = useState<AudioState>('idle');
  // Ref mirror so playback callbacks never read a stale closure — the exact
  // bug that made play-before-load permanently silent (2026-07-04).
  const audioStateRef = useRef<AudioState>('idle');
  const setAudioStateBoth = useCallback((s: AudioState) => {
    audioStateRef.current = s;
    setAudioState(s);
  }, []);
```

- [ ] **Step 2: Rework `loadAudio`**

Replace the existing `loadAudio` with:

```tsx
  // Load both PCM tracks. Distinguishes: ready (≥1 non-empty track),
  // none (both tracks absent/empty — nothing was recorded), error
  // (network/exception — retryable via the status pill).
  const loadAudio = useCallback(async () => {
    if (!sessionId) { setAudioStateBoth('none'); return; }
    if (audioStateRef.current === 'loading' || audioStateRef.current === 'ready') return;
    setAudioStateBoth('loading');
    try {
      const [studentResp, tutorResp] = await Promise.all([
        fetch(`/api/tutor/session-audio?sessionId=${sessionId}&role=student`),
        fetch(`/api/tutor/session-audio?sessionId=${sessionId}&role=tutor`),
      ]);
      const intHeader = (resp: Response, name: string, fallback: number) =>
        parseInt(resp.headers.get(name) || String(fallback), 10) || fallback;

      if (studentResp.ok) {
        const buf = await studentResp.arrayBuffer();
        if (buf.byteLength > 0) {
          studentRawRef.current = {
            float32: pcm16ToFloat32(buf),
            sampleRate: intHeader(studentResp, 'X-Sample-Rate', 24000),
          };
        }
      }
      if (tutorResp.ok) {
        const buf = await tutorResp.arrayBuffer();
        if (buf.byteLength > 0) {
          tutorRawRef.current = {
            float32: pcm16ToFloat32(buf),
            sampleRate: intHeader(tutorResp, 'X-Sample-Rate', 24000),
          };
        }
      }
      setAudioStateBoth(studentRawRef.current || tutorRawRef.current ? 'ready' : 'none');
    } catch (err) {
      console.error('[ReplayPlayer] Audio load error:', err);
      setAudioStateBoth('error');
    }
  }, [sessionId, setAudioStateBoth]);
```

Also simplify the raw-ref types — `originOffsetMs` is dead (the API never sends `X-Origin-Offset-Ms`; capture-side leading-silence padding makes 0 correct):

```tsx
  const studentRawRef = useRef<{ float32: Float32Array; sampleRate: number } | null>(null);
  const tutorRawRef = useRef<{ float32: Float32Array; sampleRate: number } | null>(null);
```

- [ ] **Step 3: Fix `startAudioPlayback` guard + remove origin-offset scheduling**

Change the guard to read the ref (`if (audioStateRef.current !== 'ready') return;`, dependency array drops `audioLoaded`). Simplify `scheduleTrack` — with origin offset always 0 the future-scheduling branch is dead:

```tsx
    const scheduleTrack = (
      buffer: AudioBuffer | null,
      gain: GainNode | null,
    ): AudioBufferSourceNode | null => {
      if (!buffer || !gain) return null;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = playbackRate;
      source.connect(gain);
      const bufferOffsetSec = offsetMs / 1000;
      if (bufferOffsetSec >= buffer.duration) return null; // past end of track
      source.start(0, bufferOffsetSec);
      return source;
    };

    studentSourceRef.current = scheduleTrack(studentBufferRef.current, studentGainRef.current);
    tutorSourceRef.current = scheduleTrack(tutorBufferRef.current, tutorGainRef.current);
```

- [ ] **Step 4: Hot-attach effect**

Add after the `startAudioPlayback` definition:

```tsx
  // HOT-ATTACH (the core bug fix): if audio finishes loading while the
  // visual replay is already playing, start it at the current position —
  // previously the user had to rewind/pause+play to get sound.
  // startAudioPlayback rides a ref so this effect fires ONLY on the
  // loading→ready transition — with the callback in the dep array, every
  // mute toggle would recreate it and needlessly restart the sources.
  const startAudioPlaybackRef = useRef(startAudioPlayback);
  startAudioPlaybackRef.current = startAudioPlayback;
  useEffect(() => {
    if (audioState === 'ready' && playingRef.current) {
      startAudioPlaybackRef.current(currentTimeMsRef.current, speedRef.current);
    }
  }, [audioState]);
```

- [ ] **Step 5: Status pill**

Replace the `{audioLoaded && (...)}` mute-controls block and the `{audioLoading && ...}` fragment with:

```tsx
            <div className="flex items-center gap-2 border-l pl-3 ml-2">
              {audioState === 'loading' && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">Audio loading…</span>
              )}
              {audioState === 'none' && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-400">No audio recorded</span>
              )}
              {audioState === 'error' && (
                <button
                  onClick={() => { setAudioStateBoth('idle'); loadAudio(); }}
                  className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                >
                  Audio failed — Retry
                </button>
              )}
              {audioState === 'ready' && (
                <>
                  <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">Audio on</span>
                  {/* existing Student / Tutor mute buttons move here unchanged */}
                </>
              )}
            </div>
```

Keep the existing Student/Tutor mute buttons exactly as they are, nested in the `ready` branch.

- [ ] **Step 6: Verify + commit**

Run: `npx tsc --noEmit` — clean.
Live check (dev server): open a session with audio, click Play IMMEDIATELY after the modal opens — audio must kick in mid-replay without touching anything. Open a session without audio files — pill shows "No audio recorded".

```bash
git add src/app/admin/tutor-sessions/components/ReplayPlayer.tsx
git commit -m "fix(admin): replay audio — state machine + hot-attach; no more silent play-before-load"
```

---

### Task 5: ReplayTimeline — curated dots, legend, event lane, segment fix

**Files:**
- Modify: `src/app/admin/tutor-sessions/components/ReplayTimeline.tsx` (full rework)

**Interfaces:**
- Consumes: `curateEvents`, `EVENT_CATEGORIES`, `categorizeEvent` types, `buildSpeakerSegments` (Task 1). Existing props `{events, totalDurationMs, currentTimeMs, onSeek}` stay unchanged (ReplayPlayer needs no edit).

- [ ] **Step 1: Rework the component**

Replace the body of `ReplayTimeline.tsx` with:

```tsx
'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { MicOff, Upload, AlertTriangle, Zap, Ear, ListTree } from 'lucide-react';
import { curateEvents, categorizeEvent, EVENT_CATEGORIES, type EventCategory } from '@/lib/tutor/recordings/timeline-events';
import { buildSpeakerSegments } from '@/lib/tutor/recordings/segments';

export interface TimelineEvent {
  type: 'transcript' | 'whiteboard' | 'debug';
  offsetMs: number;
  data: {
    role?: string;
    type?: string;
    message?: string;
    [key: string]: unknown;
  };
}

interface ReplayTimelineProps {
  events: TimelineEvent[];
  totalDurationMs: number;
  currentTimeMs: number;
  onSeek: (timeMs: number) => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const CATEGORY_ICONS: Record<EventCategory['key'], typeof MicOff> = {
  kill: Zap,
  perception: Ear,
  mic: MicOff,
  upload: Upload,
  error: AlertTriangle,
};

export default function ReplayTimeline({ events, totalDurationMs, currentTimeMs, onSeek }: ReplayTimelineProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const laneRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || totalDurationMs <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * totalDurationMs);
  }, [totalDurationMs, onSeek]);

  const handleDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 || !barRef.current || totalDurationMs <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * totalDurationMs);
  }, [totalDurationMs, onSeek]);

  const progressPct = totalDurationMs > 0 ? (currentTimeMs / totalDurationMs) * 100 : 0;

  // Curated debug markers — only categorized events reach the bar; the full
  // stream lives in the toggleable lane below.
  const debugEvents = useMemo(() => events.filter((e) => e.type === 'debug'), [events]);
  const markers = useMemo(() => curateEvents(debugEvents), [debugEvents]);

  // Speaker segments with the 20s gap cap (silence renders as neutral track).
  const segments = useMemo(() => {
    const entries = events
      .filter((e) => e.type === 'transcript')
      .map((e) => ({ offsetMs: e.offsetMs, role: (e.data.role as string) || 'tutor' }));
    return buildSpeakerSegments(entries, totalDurationMs);
  }, [events, totalDurationMs]);

  // Auto-follow: keep the last-passed event visible in the lane.
  const lastPassedIndex = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < debugEvents.length; i++) {
      if (debugEvents[i].offsetMs <= currentTimeMs) idx = i;
      else break;
    }
    return idx;
  }, [debugEvents, currentTimeMs]);
  useEffect(() => {
    if (!showAllEvents || lastPassedIndex < 0 || !laneRef.current) return;
    const row = laneRef.current.querySelector<HTMLElement>(`[data-evt-idx="${lastPassedIndex}"]`);
    row?.scrollIntoView({ block: 'nearest' });
  }, [showAllEvents, lastPassedIndex]);

  return (
    <div className="space-y-1">
      {/* Time display + lane toggle */}
      <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono px-0.5">
        <span>{formatTime(currentTimeMs)}</span>
        <button
          onClick={() => setShowAllEvents((v) => !v)}
          className={`flex items-center gap-1 rounded px-1.5 py-0.5 font-sans text-[10px] font-medium transition-colors ${
            showAllEvents ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <ListTree className="w-3 h-3" />
          {showAllEvents ? 'Hide events' : `All events (${debugEvents.length})`}
        </button>
        <span>{formatTime(totalDurationMs)}</span>
      </div>

      {/* Timeline bar */}
      <div
        ref={barRef}
        className="relative h-6 bg-gray-200 rounded-full cursor-pointer select-none overflow-hidden"
        onClick={handleClick}
        onMouseMove={handleDrag}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`absolute top-0 h-full ${
              seg.role === 'student' ? 'bg-blue-100' : seg.role === 'tutor' ? 'bg-gray-300' : 'bg-yellow-100'
            }`}
            style={{ left: `${(seg.start / totalDurationMs) * 100}%`, width: `${((seg.end - seg.start) / totalDurationMs) * 100}%` }}
          />
        ))}

        <div
          className="absolute top-0 left-0 h-full bg-blue-500/30 rounded-l-full transition-[width] duration-75"
          style={{ width: `${progressPct}%` }}
        />

        {markers.map((ev, i) => {
          const Icon = CATEGORY_ICONS[ev.category.key];
          return (
            <button
              key={`marker-${i}`}
              type="button"
              className="absolute top-0.5 -translate-x-1/2 group"
              style={{ left: `${(ev.offsetMs / totalDurationMs) * 100}%` }}
              onClick={(e) => { e.stopPropagation(); onSeek(ev.offsetMs); }}
              title={`${ev.data.type}: ${(ev.data.message as string) || ''}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${ev.category.color}`}>
                <Icon className="w-2 h-2 text-white" />
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                {formatTime(ev.offsetMs)} · {ev.data.type}: {((ev.data.message as string) || '').slice(0, 60)}
              </div>
            </button>
          );
        })}

        <div
          className="absolute top-0 h-full w-0.5 bg-blue-600 transition-[left] duration-75"
          style={{ left: `${progressPct}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
        </div>
      </div>

      {/* Legend — one entry per curated category + speakers */}
      <div className="flex flex-wrap gap-3 text-[10px] text-gray-400 px-0.5">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-100 border border-blue-200" /> Student</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gray-300" /> Tutor</span>
        {EVENT_CATEGORIES.map((c) => (
          <span key={c.key} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${c.color}`} /> {c.label}
          </span>
        ))}
      </div>

      {/* All-events lane */}
      {showAllEvents && (
        <div ref={laneRef} className="max-h-36 overflow-y-auto rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
          {debugEvents.map((ev, i) => {
            const cat = ev.data.type ? categorizeEvent(ev.data.type) : null;
            return (
              <button
                key={`lane-${i}`}
                type="button"
                data-evt-idx={i}
                onClick={() => onSeek(ev.offsetMs)}
                className={`w-full flex items-center gap-2 px-2 py-1 text-left text-[11px] hover:bg-blue-50 ${
                  i === lastPassedIndex ? 'bg-blue-50/70' : ''
                }`}
              >
                <span className="font-mono text-gray-400 shrink-0">{formatTime(ev.offsetMs)}</span>
                <span className={`shrink-0 rounded px-1 text-[10px] font-medium ${cat ? `${cat.color} text-white` : 'bg-gray-100 text-gray-500'}`}>
                  {ev.data.type}
                </span>
                <span className="truncate text-gray-600">{(ev.data.message as string) || ''}</span>
              </button>
            );
          })}
          {debugEvents.length === 0 && (
            <div className="px-2 py-2 text-[11px] text-gray-400">No debug events in this session.</div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

Run: `npx tsc --noEmit` — clean. `npm run test:recordings` — green.
Live: open a replay — bar shows only labeled, iconed dots; legend matches; dot click seeks; "All events" toggle lists the full stream and follows the playhead; long silences render as neutral gray.

```bash
git add src/app/admin/tutor-sessions/components/ReplayTimeline.tsx
git commit -m "feat(admin): replay timeline — curated labeled dots, all-events lane, silence-aware segments"
```

---

### Task 6: Detail page facts header

**Files:**
- Modify: `src/app/admin/tutor-sessions/[sessionId]/page.tsx`

**Interfaces:**
- Consumes: `formatRelativeTime` (Task 1); `source`/`sourcePartnerId`/`sourceHost` (Task 2).

- [ ] **Step 1: Add badges + relative date to the header**

Read the file first (151 lines; it already has a header and stat cards). In the header block, under the `session.sessionId` line, add a badge row:

```tsx
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                  session.source === 'embed' ? 'bg-indigo-50 text-indigo-600'
                  : session.source === 'test' ? 'bg-purple-50 text-purple-600'
                  : session.source === 'showcase' ? 'bg-amber-50 text-amber-600'
                  : 'bg-blue-50 text-blue-600'
                }`}>
                  {session.source === 'embed' ? 'Portal' : session.source === 'test' ? 'Test' : session.source === 'showcase' ? 'Showcase' : 'Website'}
                </span>
                {session.sourcePartnerId && (
                  <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">{session.sourcePartnerId}</span>
                )}
                {session.sourceHost && (
                  <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700">{String(session.sourceHost).replace(/^https?:\/\//, '')}</span>
                )}
                {session.voiceEngine && (
                  <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">{session.voiceEngine}</span>
                )}
                {session.hasAudio && (
                  <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-green-50 text-green-600">Audio</span>
                )}
                <span className="inline-flex rounded px-2 py-0.5 text-xs text-gray-500" title={new Date(session.startedAt).toLocaleString('en-US')}>
                  {formatRelativeTime(session.startedAt)}
                </span>
              </div>
```

Import `formatRelativeTime` from `@/lib/tutor/recordings/relative-time`. Keep the existing stat cards; do not restructure the rest of the page.

- [ ] **Step 2: Verify + commit**

Run: `npx tsc --noEmit` — clean. Live: open a session detail — badges + relative date render.

```bash
git add "src/app/admin/tutor-sessions/[sessionId]/page.tsx"
git commit -m "feat(admin): session detail facts header — source/partner/host/engine/audio badges, relative date"
```

---

### Task 7: Verification gate

**Files:** none; gates completion.

- [ ] **Step 1: Full local gate**

Run: `npm run test:recordings && npm run test:caption-sync && npm run test:render-sync && npx tsc --noEmit`
Expected: all green.

- [ ] **Step 2: End-to-end source tagging (dogfood via harness)**

With the dev server on 3006: `npm run test:tutor-e2e -- coop-arith`. Then open `/admin/tutor-sessions?src=test` — the fresh run must appear under Tests (proves `__tutorTestStart` → `source:'test'` → filter end-to-end).

- [ ] **Step 3: Live replay checklist**

1. Open a session WITH audio → Play immediately → audio kicks in mid-replay, pill "Audio on", no rewind needed.
2. Open a session WITHOUT audio files → pill "No audio recorded".
3. Timeline: only labeled dots, legend matches, dot click seeks, "All events" lane follows playhead and row-click seeks, silences neutral.
4. List: chips/partner/host/audio/date filters compose in the URL and narrow results; pagination past 50; relative dates with absolute on hover.
5. Detail page: badge row renders.

- [ ] **Step 4: Report honestly**

Any failure returns to its task; do not check boxes on unverified claims.
