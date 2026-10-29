# Tutor demo polish — design (2026-10-29)

Source: Praveen's free demo session `embed-1793240679836` (engine demo page,
voice, Haiku brain, 10-minute box, 2026-10-29 02:24Z) and his notes on it.
Report: the session's transcript, board and 191 debug events were pulled with
`apps/tutor/scripts/inspect-tutor-session.ts`.

## Intent

The free demo is the first thing a prospect hears and sees. Six things in this
session made it feel mechanical or broken: a crowded tool cluster hiding the
one control students look for (full screen); cursive board notes many students
cannot read; the voice silently skipping `<`; stacked filler openers ("Okay,
let's see. Okay, let's look at…"); the session cut off at 10:00 with no
goodbye; and a 10-minute budget that is too short to land one concept.

## Goals

1. One obvious **Full screen** control on every tutor surface; the tool cluster
   hidden by default, kept only for GAC (their homework product uses the pen).
2. Board handwriting a 12-year-old can read: a print-style hand plus a
   left-to-right "writing" reveal so it still reads as the teacher writing.
3. Spoken maths never drops a relational sign in prose.
4. No doubled openers between the acknowledgement layer and the brain's first
   sentence; the idle nudge stops offering "a hint" when there is nothing to
   hint at.
5. A time-boxed demo wraps audibly and ends with a spoken goodbye, never a
   silent cut.
6. Free demos run 20 minutes with the wrap at 18 on all three portals
   (Crimsora, evelyntutor, evelynlearning marketing) and on the engine's own
   demo page.

## Non-goals

- The plan-swap `targetSubject` omission (the swapped plan was filed under
  physics) and reply verbosity (73–95-word replies to one-word checks) — both
  in the 10-29 backlog memory, separate work.
- Any change to GAC :3008 (pinned; nothing here is deployed there).
- Billing enforcement of demo minutes; the academy's per-email lifetime
  budget logic is unchanged.

## Anti-goals

- A topic-specific or client-specific prompt rule. Every behavioural fix here
  is structural (client code, validators, phrase lists) or a generic prompt
  line.
- A per-tenant branch. GAC keeps the cluster via its partner row.
- A kill switch that only works when the env var is present at build time
  without saying so — every new flag is `NEXT_PUBLIC_*`, read as
  `!== 'off'`, default ON.

## Constraints

- Worktree `tutor-demo-polish` off origin/main `970364dd`; gate =
  `npm run test:changed` in `apps/tutor` (VoiceTutorRealtime.tsx is touched,
  so it will demand `test:all`; baseline 2 known failures + the
  `brain-route-cache-blocks` flake under load).
- Deploys, one at a time from the worktree: `./deploy-tutor.sh` (:3007),
  `./deploy-tutor-demo.sh` (:3009), `./deploy-marketing.sh` (:3001). Not
  `deploy-tutor-gac.sh`.
- Academy (`/Users/luke/Dev/academy`): the 20/18 demo rows are DATA (one
  `demosettings` row per tenant DB, read on every start) — the write takes
  effect without a deploy. The code default change rides the next academy
  deploy; academy main currently carries an unreviewed GAC web build, so do
  not deploy academy for this.
- Prod Mongo writes (the two demo-settings rows) are approved by Praveen on
  2026-10-29 for exactly `durationMinutes: 20, wrapAtMinutes: 18`.
- No live model calls in tests; one local voice run at the end to hear the
  ack strip, the wrap line and the goodbye (Praveen's live-test budget rule).

## The parts, as decided

### 1. Tool cluster hidden; Full screen in the header

**Decided.** The board tool cluster (Draw, board pen, Text note, Camera,
Full screen, wrench — `SessionStage.tsx` ~line 1700) is not rendered unless
the embed UI option `toolCluster` is true. New `EmbedUiOptions` field
`toolCluster` (token field `features.tool_cluster`), engine default **false**,
partner row `greenapple: { toolCluster: true }`. Retail `/tutor` and the
engine demo page get the engine default (hidden).

A labelled **Full screen** button goes in the session header's action group
(`SessionControls.tsx`, the row holding Export PDF and Upload Problem), on
both header hosts (`TutorSession.tsx` and `apps/tutor/src/app/tutor/page.tsx`).
Icon + label at every width (the label is the point; "Full screen" fits where
"Export PDF" was hidden below xl — if it does not, the icon stays and the
label hides below `sm`, never below `xl`). While active it reads **Exit full
screen**. It uses the SAME capability gates and the SAME toggle the cluster
used: native Fullscreen API when `canFullscreen`, the iframe expand request
(`canExpand`) where the API is unavailable (iPhone, iframes without
`allowfullscreen`), hidden when neither applies. How the stage's
`toggleFullscreen` / `isFullscreen` / `canFullscreen` / `canExpand` reach the
header is the builder's call (lift to the composing component, or an
imperative handle on SessionStage); the behaviour must be byte-identical.

Camera upload stays where it already is in the header (Upload Problem). The
existing `tools_low` option keeps working for hosts that show the cluster.

Phones (my call): the header action group is not rendered below `sm`
(`SessionStage.tsx` ~line 1644 wraps it in `hidden sm:block`; phones get only
the clock and the ⋯ menu). So below `sm` the Full screen / Expand control is
rendered beside the clock in the phone header, icon-only, same gates and
toggle. Without this, hiding the cluster would leave phones with no
fullscreen or expand control at all.

Hosts (my call): only the `TutorSession` host gets the button. The legacy
split-pane layout in `apps/tutor/src/app/tutor/page.tsx` (~line 2523) is
reached only when `NEXT_PUBLIC_TUTOR_NEW_SESSION_UI` is off; it is `on` in
prod and has no SessionStage to fullscreen. It is left as it is.

Partner rows: `greenapple: { toolCluster: true }`. GameClass currently has
`toolsLow: true` from Skyler's 2026-10-09 review, which asked for the
cluster placed low; whether GameClass keeps the cluster is Praveen's call
(GameClass changes are ask-first) — see the open question at the end.

Kill switch: `NEXT_PUBLIC_TUTOR_HEADER_FULLSCREEN` (`off` restores the
cluster everywhere and removes the header button).

### 2. Handwriting: print hand + writing reveal

**Decided.** Tutor `handwrite` notes (`InkNotesOverlay.tsx`, the note div at
~line 1036 and the canvas measure font `noteFont()` ~line 67, plus
`note-font.ts`) switch the family order to **Kalam first, Caveat second**
(Kalam is already loaded in `layout.tsx`; it is upright with unjoined
letters) at **24px**, one weight, 400. The measure font and the DOM font
must change together (line wrapping is measured on canvas), and
`NOTE_LINE_H` (26, tuned to 22px) moves to 29. `whiteboard-capture.ts`'s PDF
note bake resolves the same family list through `resolveNoteFontFamilies`,
so the family follows automatically; its size is viewport-relative
(`min(vw,vh)*0.045`) with a padding ratio written as `fontSize * (4/22)` —
the family change needs nothing there; the builder leaves the ratio alone
unless a baked PDF note visibly clips.

Reveal: each note animates in left-to-right as it is placed — a
`clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` transition on the note
element, duration `min(2500ms, 70ms × characters)`, linear, once per note
(not on page flips / re-renders of an existing note; key it on the note id).
Honour `prefers-reduced-motion: reduce` (no animation). Student-drawn ink,
equations, graphs and cards are untouched.

Kill switch: `NEXT_PUBLIC_TUTOR_NOTE_PRINT_HAND` (`off` = Caveat 22px, no
reveal, exactly today).

### 3. TTS: relational signs in prose

**Decided.** In `tts-pronunciation.ts`'s prose pass (where `≤`/`≥` are
already handled at ~line 273), add rules so that `<`, `>`, `<=`, `>=` are
spoken when they sit between operands: the left side ends in a letter, digit,
`)` or `]`, the right side begins with a letter, digit, `(`, `[`, `−` or `-`
(whitespace allowed on both sides). "2 < 0 + 1" → "2 less than 0 + 1"
(`+` is not wordified in prose today and this change leaves it alone; only
the comparison sign is new). Angle-bracket markup never has an operand
character directly left of `<` (`<br>` is preceded by a space or nothing),
and `claude-brain.ts` strips break tags from raw brain output first, so
tags are unaffected; the test pins `<br>` and `<span>` untouched.

Tests (in the existing TTS test file): `2 < 0 + 1`, `y < x + 1`, `x > 5`,
`a <= b`, `x >= −3`, `(0, 2) gives 2 < 1`, and the two tag controls.

### 4. Openers and the idle nudge

**Decided, three pieces.**

a. `ACK_PHRASES` (`ack-layer.ts`) loses `"Okay, let's see."`, and a test
   pins that no ACK phrase begins with `okay|ok|alright|all right|so|right|now`.
   The cover pools (`cover-layer.ts`, five phrases open with "Okay,"/"Alright,")
   are NOT reworded (my call): their collisions are covered by the strip in
   (b), which fires whenever any ack or cover line was spoken.

b. Opener strip. When an ack or cover line was spoken for the current turn
   (the `ack_spoken` site in VoiceTutorRealtime.tsx sets a per-turn ref), the
   brain's **first** sentence has a leading filler removed before TTS and
   before it is written to the caption/transcript: regex
   `^\s*(okay|ok|alright|all right|so|right|now)\s*[,.—-]?\s+` (case-insensitive),
   only when at least three words remain, and only on sentence 0 of the turn.
   The retained text is re-capitalised. Debug event
   `opener_filler_stripped` with the removed word. Verdict-word openers
   ("Exactly.", "Not quite.") are never touched — the regex lists fillers
   only. The per-turn ref clears when the turn ends.
   Kill switch: `NEXT_PUBLIC_TUTOR_ACK_OPENER_STRIP`.

c. Idle nudge. `idleNudgeDirective` gains `hasOpenQuestion: boolean`,
   applied to the v2 text only (`TUTOR_IDLE_NUDGE_V2` is on in prod; the v1
   constant stays frozen — my call). The
   client passes false when the last tutor turn produced no question pin
   (the `qpin_drop` "conversational" outcome or no pin at all — the pin state
   is held by the component that emits `qpin_set`/`qpin_drop`, TutorSession;
   the builder threads a boolean down, not the pin). With false, the
   directive's hint sentence is replaced by: "There is no problem on the
   table to hint at. Re-offer the choice or next step you last asked about,
   in different words, in one short sentence." Everything else unchanged.
   Pure function → unit test on the two variants.

### 5. Wrap line and spoken goodbye for time-boxed sessions

**Decided.** Two client-side additions. The wrap line uses the existing
`wrapPhase` predicate (VoiceTutorRealtime.tsx ~line 22248: `sessionWrapMinutes
!= null` and demo mode or an explicit box); the goodbye uses the hard stop's
own predicate (explicit `max_duration_minutes`, not a diagnostic,
`onEndSession` present). They differ today and are left as they are.

a. Wrap line. When the clock first crosses `wrapAtMinutes` and the tutor is
   not speaking, no brain call is in flight and the student is not
   mid-utterance (the same `busy` test the idle nudge uses, re-checked every
   5 s until it passes, once per session), the client speaks a fixed line
   through the same path the client-spoken demo opener uses
   (`realtime.speakText` + transcript entry + `bridge_spoken`-style event),
   wording: **"We've got about two minutes left, so let's finish this one."**
   Event `wrap_line_spoken`. The existing `<demo_stop>` wrap directive stays
   as it is. The header timer already turns red at 5 minutes left; no change.
   If the session is in text mode the line is posted as a tutor message
   instead of spoken.

b. Goodbye at the hard stop. The hard-stop interval (VoiceTutorRealtime.tsx
   ~line 25453) stops calling `onEndSession('time_limit')` directly and
   instead runs the existing farewell path `endSessionNowRef.current({
   farewell, reason: 'time_limit' })`. `endSessionNow` gains an optional
   `reason` that it forwards to `onEndSession(reason)` (today it calls
   `onEndSession()` bare at the end), so `ended_reason: 'time_limit'` still
   reaches the host and the academy's "Your N minutes are up" wall still
   shows. Wording: **"That's our time for today, {first name}. Nice work."**
   — the name clause is dropped when no student name is known. The farewell
   path already seals the brain, blocks further speech and waits (bounded)
   for the line to play.
   Kill switch: `NEXT_PUBLIC_TUTOR_TIMEBOX_FAREWELL` (`off` = today's silent
   cut; the wrap line is under the same switch).

### 6. Twenty-minute demos, wrap at eighteen

**Decided.**

- Engine demo page: `EngineSelector.tsx` `max_duration_minutes: 10,
  wrap_at_minutes: 8` → `20, 18`; copy "10-minute demo" → "20-minute demo".
- Marketing: `VoiceTutorLiveDemo.tsx` `10`/`8` → `20`/`18`; copy at lines
  ~385 and ~523 ("10-minute demo", "free 10-minute demo") → 20.
- Academy data: `crimsora.demosettings` and `evelyntutor.demosettings`
  (`key: 'demo'`) set `durationMinutes: 20, wrapAtMinutes: 18` — through the
  admin demo page if reachable, else a single `updateOne` per DB over the
  :2710 tunnel, each read back afterwards. Academy code default (`DemoSettings`
  model default 15, `DemoSettingsService` `$setOnInsert` 15/13, and the
  `// The demo's 15-minute budget` comment) → 20/18 in a commit on academy
  main that rides the next academy deploy.
- Cost note for the record: ~$0.12/min all-in ⇒ a full 20-minute demo ≈ $2.40;
  the demo gate (3/IP/day, 50/day) is unchanged.

## Left to the builder

- How fullscreen state is lifted from SessionStage to SessionControls.
- Exact placement/size of the header button at phone width (it must not push
  the lesson title to a single letter; icon-only below `sm` is acceptable).
- Where the per-turn "ack spoken" ref lives and how sentence 0 is identified
  on the Claude-brain path. There is no sentence-index marker to reuse
  (`fastOpenerSpoken` means "any TTS already dispatched this turn"); the
  builder adds a per-turn "first brain sentence seen" latch next to the ack
  ref.
- The reveal animation's exact easing and whether it is CSS-only or a
  `requestAnimationFrame` width tween (CSS preferred).
- Test placement: every new pure function gets a `test:*` script entry the
  gate can find (`test:changed` maps source files to scripts).

## Open question for Praveen

- GameClass: keep the tool cluster (add `gameclass: { toolCluster: true }`
  beside its `toolsLow`), or hide it there too? Skyler's review asked for the
  cluster placed low, so hiding it is a visible change for a live partner.

## Verification

- Gate green (`test:all`, baseline failures only).
- Served-artifact probes after each deploy: the "Full screen" label present
  in the built client chunks, `wrap_line_spoken` string present, the Kalam
  family first in the note style.
- One local voice run on the dev server with a minted trial token at
  `max_duration_minutes: 3, wrap_at_minutes: 1`: hear the wrap line at 1:00,
  the goodbye at 3:00, `ended_reason: time_limit` in the session_ended
  postMessage, and no "Okay, … Okay, …" stack across ten turns.
- Prod rows read back at 20/18 for both tenants.
