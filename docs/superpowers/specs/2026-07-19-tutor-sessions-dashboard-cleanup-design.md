# Tutor Sessions Dashboard Cleanup — Design

**Date:** 2026-07-19
**Repo:** evelynlearning (engine) — no portal changes
**Problem:** The admin tutor-sessions list (`/admin/tutor-sessions`) can't isolate real student sessions for debugging: there's no non-test filter, Praveen's own sessions look like student sessions, the Subject/Topic column omits the lesson, the Mode column is dead weight (always voice), and there's no location signal.

## 1. Students filter (default view)

Source chips become: **Students | All | Website | Portal | Showcase | Tests**.

- **Students** is the default (no `src` param). Filter: `source ∉ {test, showcase}` AND `studentName` does not match `/praveen/i`.
- **All** gets an explicit `src=all` param (previously "All" was the no-param state).
- Website/Portal/Showcase/Tests chips unchanged (`src=tutor|embed|showcase|test`).
- The test-name list lives as an exported constant `TEST_STUDENT_NAMES = ['praveen']` in `src/lib/tutor/recordings/filters.ts` so future test identities are a one-line addition. Matching is case-insensitive substring (covers "Praveen", "praveen test", etc.).
- Header session count reflects the active filter, as today.

**File:** `src/lib/tutor/recordings/filters.ts` — `buildSessionFilter` gains the students/all semantics; unknown `src` values still fall back to the default (now Students).

## 2. Location capture + column

`TutorSession` gains two set-on-insert fields:

```ts
clientIp?: string;
location?: { city?: string; region?: string; country?: string };  // country = ISO code
```

**Capture** in `POST /api/tutor/session-usage`: when the upsert *inserts* (checked via a cheap `TutorSession.exists({sessionId})` before the update), extract IP from `x-forwarded-for` (first hop) → `x-real-ip`, store it via `$setOnInsert`, then fire-and-forget a geolocation lookup:

- Private/loopback ranges (10.x, 172.16–31.x, 192.168.x, 127.x, ::1) → store `location.city = 'Local'`, skip the API call.
- Public IPs → `http://ip-api.com/json/{ip}?fields=status,city,regionName,countryCode` (free tier, no key, 45 req/min — far above session-start volume). On success, `$set` location; on failure/timeout (3s), leave location unset. The lookup NEVER blocks or fails the save.

**Column:** new Location column before Status. Renders `City, CC` (e.g. "San Jose, US"), tooltip shows the raw IP. Sessions without location (all pre-existing ones) show "–".

## 3. Subject/Topic includes the lesson

Third line in the Subject/Topic cell: the lesson title.

- Source: `session.lessonProgress.lessonPlanId` → `LessonPlan.title`.
- The list page batch-fetches titles for the current page's distinct plan ids in `getSessions` (one `LessonPlan.find({_id: {$in: ids}}).select('title')`), so no N+1.
- Fallback: raw plan id if the plan isn't in the DB; nothing rendered when the session has no `lessonProgress` (website free-form sessions).

## 4. Mode column removed

The Mode column (and its `modeLabels` map) is deleted — every session is voice. The voice-engine label (`claude-brain`, etc.) moves to small gray text under the Status badge, preserving it for debugging.

## Error handling

- Geo lookup: best-effort, wrapped, 3s timeout, `.catch` logged — a down ip-api can never sink a session save.
- IP missing (direct connection, no proxy headers): store nothing; Location renders "–".
- Praveen regex applies only to the Students view; other chips are unaffected.

## Testing

- Extend the existing `buildSessionFilter` unit tests: default → students filter shape, `src=all` → `{}` (plus other params), `src=test` unchanged, test-name exclusion present in the students shape.
- New unit tests for the IP-extraction + private-range helper (pure function, extracted to `src/lib/tutor/recordings/client-ip.ts` or similar).
- Manual verification on :3006 dev — list renders, Students default hides Praveen/test/showcase rows, new session from localhost shows "Local".

## Out of scope

- Backfilling location for existing sessions.
- Portal (academy) changes.
- Session detail page changes (it already shows engine/mode; untouched).
