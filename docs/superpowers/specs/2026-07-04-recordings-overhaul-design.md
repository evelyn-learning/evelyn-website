# Session Recordings Overhaul — Design

**Date:** 2026-07-04
**Status:** Approved (user-grilled, 4 decisions locked)
**Queue:** User-ordered fixes queue 2026-07-04, item 2

## Problems (user-reported)

1. No way to filter recordings by where they came from: tests (harness runs),
   the evelyn website `/tutor` page, evelyn's tutor portal, academy portals
   hosted on other retail websites, partner platforms. The record stores only
   `source: 'tutor' | 'embed' | 'showcase'`; the embed token's `partner_id`
   is never persisted; harness sessions pollute `tutor`.
2. Layout: list is a bare table, absolute dates, hard 100-session cap, no
   filters. Dates wanted as "xx mins ago".
3. **BUG:** recordings don't always play sound — sometimes a rewind click is
   needed first, sometimes no sound ever.
4. The timeline's "dots" don't function according to their label: every debug
   event renders as a dot but only mic/upload/error have icons; the legend
   covers 4 of dozens of types; speaker segments paint silence as the
   previous speaker.

## Root cause of the audio bug (traced, ReplayPlayer.tsx)

- `loadAudio()` (slow multi-MB fetch of both PCM tracks) starts when the
  modal opens. `startAudioPlayback()` silently early-returns until the
  `audioLoaded` state flips. Clicking Play before the fetch lands starts the
  visual replay with no audio and nothing re-attaches when the load
  completes — the next `startAudioPlayback` call (rewind/pause+play/seek)
  is what makes sound appear. That is the "needs a rewind first" symptom.
- `setAudioLoaded(true)` fires even when both tracks returned empty/404 —
  sessions with no audio files claim "loaded", play silently, and surface
  nothing. That is the "no sound no matter what" symptom.
- A fetch error leaves `audioLoaded=false` forever with only a console
  error — same silent outcome, no retry affordance.
- Cosmetic: the player reads an `X-Origin-Offset-Ms` response header the
  API never sends (always 0). Dead code to remove; capture-side leading-
  silence padding makes 0 correct for modern recordings.

## Decisions locked (2026-07-04)

1. **Source identity = `source` + `sourcePartnerId` + `sourceHost`** (not a
   fixed five-bucket enum). Filters derive partner/host options from actual
   stored values; new partners need no code change.
2. **Audio fix UX = hot-attach + status pill.** Play never blocks; audio
   attaches mid-play when ready; pill distinguishes loading / on / none /
   failed-with-retry.
3. **Timeline = curated dot set + "show all events" toggle** (not remove-all,
   not categorize-everything).
4. **Layout scope = all three surfaces**: list overhaul, player polish,
   detail-page facts header. Relative dates everywhere.

## Design

### 1. Source identity

**Schema (`src/models/TutorSession.ts`):**
- `source` enum gains `'test'` → `'tutor' | 'embed' | 'showcase' | 'test'`.
- New optional `sourcePartnerId: string` (embed token `partner_id`).
- New optional `sourceHost: string` (origin of the embedding page).

**Capture:**
- Embed page (`src/app/tutor-portal/embed/page.tsx`): already sends
  `source:'embed'` in its session-usage payload; add `sourcePartnerId` (from
  the decoded token) and `sourceHost` (first of
  `location.ancestorOrigins?.[0]`, else `document.referrer` origin, else
  omitted).
- `/tutor` page: unchanged (`source:'tutor'`).
- Harness: `__tutorTestStart` (dev hook in `src/app/tutor/page.tsx`) sets a
  flag so the session-usage payload carries `source:'test'`. Harness runs
  become first-class filterable data.
- `session-usage` route (`src/app/api/tutor/session-usage/route.ts`):
  persist both new fields alongside the existing `source` on insert.

**Legacy data:** old sessions lack the new fields; they filter under their
bare `source` and appear with no partner/host badge. No backfill.

### 2. List page (`src/app/admin/tutor-sessions/page.tsx`)

Stays a server component; filters travel as URL searchParams (links, no
client state):
- Filter row: source chips (All / Website / Portal / Showcase / Tests),
  partner dropdown + host dropdown (each populated via `distinct()` on the
  collection, shown only when non-empty), has-audio toggle, date-range
  (today / 7d / 30d / all).
- Relative dates: "34 secs/mins/hours ago" within 7 days, then "Jul 2" (same
  year) / "Jul 2, 2025". Pure helper, unit-tested.
- Pagination: `?page=N` with 50/page + total count, replacing the 100 cap.
- Column tidy-up: mode+engine merged into one badge column; source/partner
  badge under the student name (existing pattern, extended for test/partner).

### 3. Player audio fix (`ReplayPlayer.tsx`)

- Audio lifecycle becomes an explicit state machine held in state AND a ref
  (so callbacks never read stale closures):
  `idle → loading → ready | none | error`.
  - `none`: both fetches OK but empty (or both 404) — "No audio recorded".
  - `error`: network/exception — pill shows "Audio failed — Retry" (retry
    re-runs `loadAudio`).
- **Hot-attach:** when state reaches `ready` and the replay is already
  playing, immediately `startAudioPlayback(currentTimeMsRef.current,
  speedRef.current)`. Symmetrically, `startAudioPlayback` reads the state
  ref, not the `audioLoaded` closure.
- Status pill in the controls row: `Audio loading… / Audio on / No audio
  recorded / Audio failed — Retry`. Mute buttons render only in `ready`.
- Remove the dead `X-Origin-Offset-Ms` read (API never sends it; treat
  origin offset as 0, which capture-side leading-silence padding makes
  correct).

### 4. Timeline rework (`ReplayTimeline.tsx`)

- **Curated dots** (icon + legend + hover card; click seeks to the event —
  explicit `onSeek(offsetMs)`, not just bubbling):
  - kills/retries (judge/validator/forced-kill family)
  - barge-in / perception cancels
  - mic mute/unmute
  - uploads
  - errors
  The category map is `type → {category, icon, color}` with prefix/regex
  matching; anything unmatched is EXCLUDED from the bar. At implementation
  time, inventory actual `onDebugEvent` type strings (grep call sites in
  VoiceTutorRealtime/page.tsx) and assign each to a category or to hidden;
  unknown future types default to hidden (never an anonymous gray dot).
- **"Show all events" toggle:** opens a scrollable event-list lane under the
  bar (time, type, message), auto-follows the playhead, click row → seek.
  This is where the full debug stream lives.
- **Speaker segments gap cap:** a segment ends at the next transcript event
  or `start + 20s`, whichever is sooner; uncovered time renders as the
  neutral track. Pure segment builder, unit-tested.

### 5. Detail page (`[sessionId]/page.tsx`)

Facts header above the replay button: source/partner/host badges, engine +
mode, duration, message count, WB count, cost, has-audio, started "xx mins
ago" (+ absolute on hover). Reuses the same badge + relative-date helpers.

## Module boundaries (new pure code, unit-testable)

`src/lib/tutor/recordings/` (new):
- `relative-time.ts` — `formatRelativeTime(date, now)`.
- `timeline-events.ts` — debug-event category map + `curateEvents(events)`.
- `segments.ts` — `buildSpeakerSegments(entries, totalMs, gapCapMs)`.
- `filters.ts` — searchParams → mongo query object (`buildSessionFilter`).

Test script `scripts/test-recordings.ts` (`npm run test:recordings`), house
plain-assert pattern.

## Error handling

- Audio: every failure path lands in a visible pill state; retry available;
  no silent fallthrough.
- Filters: unknown searchParam values ignored (fall back to All); empty
  result set keeps the filter row visible with a "no sessions match" body.
- Capture: new payload fields are optional end-to-end; a client that omits
  them (old cached bundle) still persists.

## Testing

- Unit: the four pure modules via `test:recordings`.
- Live: (1) audio bug — open a recorded session, press Play IMMEDIATELY:
  audio must kick in mid-play without rewind; a no-audio session must show
  "No audio recorded"; (2) filters — run an e2e harness session, confirm it
  appears under Tests; open an embed session, confirm partner/host badges;
  (3) timeline — dots match legend, click-seek works, toggle shows the full
  stream; (4) `npx tsc --noEmit` clean, existing suites unaffected.

## Out of scope

- Backfilling `source`/partner on historical sessions.
- Audio waveform rendering on the timeline.
- Retention/deletion policy for PCM files.
- Auth changes (admin pages already gate on next-auth session).
