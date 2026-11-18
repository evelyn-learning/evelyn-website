# Keystone animated solutions — build plan (2026-11-18)

**Goal:** full-prototype-level animated solutions built on one shared player, a
review page on Keystone where the owner flags problems (button, spoken or typed
comment, snaps), and a fix → v2 → re-review loop. First 12 items are authored in
sessions; Praveen reviews them himself.

**Approved by Praveen 2026-11-18 (chat):** shared player + per-item custom
figure, cue list and practice task; first 12 built in sessions; review page with
Flag / speak / type / Snap; fixes come back as v2 with earlier flags to tick off;
checks before he sees one (spoken numbers match the approved written solution,
plays start to finish, phone and tablet width); hidden from Castle Rock until he
releases. Voice recording on Cartesia approved for the 12.

**Reference:** the four hand-built prototypes in
`/Users/luke/Dev/evelynlearning/docs/whitelabel/castle-rock/premium-prototypes/<id>/solution.html`
(laptop-only, not in git) and the rules in
`/Users/luke/Dev/evelynlearning/docs/whitelabel/castle-rock/enhanced-solution-playbook.md`
(22 rules, component glossary, write-for-the-ear rules). Behaviour of the shared
player = the behaviour of prototype 234035.

## Global constraints

- Work only in the worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/mktg-keystone-animated`. Never the root checkout.
- `apps/marketing/AGENTS.md`: this Next.js differs from training data; read `node_modules/next/dist/docs/` before writing route/page code. Server actions return `{ go }`, never `redirect()`.
- No database writes to port 2710 (PROD tunnel). Tests that need Mongo use `KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 KEYSTONE_DB_NAME=castle_rock_review_test`.
- No Cartesia call in any test or automated run. The record script calls it only when run by hand with `--live`.
- Never print or log an API key value.
- Client-facing content (the player page): no AI model, vendor or tool names, nothing about how it was made; "© 2026 Evelyn Learning" footer; Canadian spelling in written text.
- Do NOT commit. Leave changes uncommitted; the controller commits. Touch only the files your task owns.
- Packaging (Vance): one self-contained `solution.html` per item (inline CSS, JS, SVG), audio as `audio/step-N.mp3` beside it, no network request, no fonts, no storage, no cookies; classes prefixed `es-`, wrapper `.ai-solution`; 12pt Arial/Helvetica/Verdana; explicit backgrounds; usable width 700 px; no `<details>` (Legacy Edge) — use the player's own fold; works at 360, 768 and 1024 px wide.

## Contracts shared by the tasks

**Item source folder** (laptop, not in git): `<src>/<itemId>/` with
- `spec.json` — see below
- `figure.svg` — the board figure, `viewBox="0 0 240 200"` (or 240 wide), layers are elements with `id`
- `board.js` (optional) — item-specific code: `esBoard.define({ actions: { name(api, args){} }, practice(api){}, explore(api){} , rest(api, played){} })`. `api` = the player's primitives (show, hide, draw, flash, move, ink, wither, readout, fast flag, el(id), svgPoint(evt)). Every action must honour `api.fast` (apply the end state at once, no animation) so catch-up works.
- `audio/step-N.mp3`, `timing.json` — written by the record script

**spec.json**
```
{ "itemId": "234035", "subject": "Physics", "course": "Physics 30", "voice": "Mr. Joseph",
  "title": "…", "answer": { "text": "8.3 m/s at 42° South of East", "letter": "A" },
  "question": "<html of the stem as shown>",
  "board": { "fresh": [cue…], "readoutFresh": "…", "readoutPractice": "…", "buttons": [{"label":"↻ Replay collision","action":"collide"}] },
  "steps": [ { "title": "Use conservation of momentum",
      "lines": [ { "say": "caption text as displayed", "speak": "text sent to the voice (optional; default = say)", "cues": [cue…] } ],
      "body": "<html shown in the step: paragraphs, .es-eq lines with data-how, folds>" } ],
  "boxes": [ { "kind": "selfcheck|sanity|slip|explore|tryone|takeaway|diploma", "title": "…", "html": "…", "choices": ["…"], "answer": "…", "beforeStep": 4 } ],
  "practice": { "kind": "drag-snap|order|custom", … } }
```
cue = `{"do":"show|hide|draw|flash|move|ink|wither|answer|call|reset", "id":"layerId", "html":"…", "cls":"hi|result", "to":[dx,dy], "slide":true, "fn":"actionName", "args":{}}`

**timing.json** `{ "steps": [ { "file": "audio/step-1.mp3", "durationMs": 21340, "starts": [0, 2100, 9800, …] } ] }` — one start per line of that step. Missing timing → the player falls back to proportional-by-length timing (as the prototypes do).

**Player API on the built page** (same-origin, used by the review page): `window.esPlayer = { state(): { step, line, timeMs, playing, paused, version }, pause(), resume(), playFrom(step), stop() }`; the page also posts `{ type: "es-player", event: "step|line|pause|end", step, line }` to `window.parent`.

**Published layout on the box:** `DATA_DIR/assets/<itemId>/animated/v<N>/solution.html` + `audio/`. The four legacy prototypes stay at `assets/<itemId>/player/` and keep working.

---

## Task 1 — Shared player, builder, checks, headless verify

**Owns:** `apps/marketing/src/lib/keystone/animated/**` (player source `player.js`, `player.css`, `build.ts`, `spec.ts` types + validator, `checks.ts`, tests), `apps/marketing/scripts/keystone-animated-build.ts`, `apps/marketing/scripts/keystone-animated-verify.ts`, package.json test script entry if needed.

1. `spec.ts`: types for the contract above; `validateSpec(spec, svgText, boardJs?) → string[]` (empty = valid): shape, 3–7 steps, every cue id exists in the SVG, every `call` fn is defined in board.js, practice target ids exist, required boxes present (selfcheck, sanity, slip, takeaway, diploma; at least one fold in a step body), `beforeStep` in range.
2. `player.js` / `player.css` (vanilla ES5-compatible, no dependency): everything in the 234035 prototype that is not item-specific — answer bar, board + ink strip + live caption that never move, Play / Pause-Resume (button row keeps its width), per-step chevron + "▶ Listen" (plays from there to the end), previous step folds at the pace of the clip, pause freezes the fold, catch-up (replay earlier cues with `fast`), caption highlighting using `timing.json` starts (fallback proportional), transcript toggle, equation line tap (`data-how`), choice boxes with local feedback, own fold component instead of `<details>`, practice kinds `drag-snap` and `order` built in, `custom` delegated to board.js, Reset board (Fresh if never played, Practice otherwise), `prefers-reduced-motion`, phone layout (board on top) and ≥600 px (board sticky left), `window.esPlayer` + postMessage events.
3. `build.ts`: `buildItem(srcDir) → { html, warnings }` producing the self-contained page (escaping; SVG inlined; spec embedded as JSON; no external URL anywhere). CLI `keystone-animated-build.ts <srcDir>/<itemId> [--out dir]` writes `out/solution.html` and copies `audio/`.
4. `checks.ts` (pure, tested): `spokenNumbersCheck(spec, writtenSolutionText, questionText)` — every number in any `say`, ink html, step body, box and the answer must occur in the written solution or the question (normalised: thin spaces, ×10^n, thousands separators); returns the strays with where they occur; an explicit `spec.allowNumbers` list (with a reason each) exempts step numbers and the like. `packagingCheck(html)` — no `http(s)://`/`//` URL, no `<details`, no `<link`/`@import`/`@font-face`, every class used starts with `es-` or is `ai-solution`, banned words (reuse `BANNED_WORDS` from `../pipeline/checks`), footer present. `earCheck(spec)` — `speak` text has no symbols (`= + × ÷ / ° ² √ ^ _`), no bare `m/s`-style units, no three numbers in a row, sentence count of `say` lines equals `speak` lines.
5. `keystone-animated-verify.ts <outDir>`: Playwright (already a root dependency), at 360×740, 768×1024 and 1024×768: fresh load state (nothing derived visible), Play runs every step to the end with audio stubbed to short silent clips or `timing` fallback sped up, Listen on step 3 then step 1, Pause/Resume, Reset in both states, practice task completes, no console error, no network request other than the page and its audio, no horizontal scroll; saves a screenshot per step per width to `<outDir>/shots/`. Exit non-zero on any failure.
6. Proof: port prototype 234035 into the new format under `<scratch>/animated-src/234035/` (spec.json, figure.svg, board.js with `collide`, the drag task and the explore slider; reuse its four mp3 files, no timing.json), build, verify green, and compare by eye (screenshots) with the prototype.

Tests: `node:assert` style like the neighbouring `*.test.ts`, run with `npx tsx`; add them to `npm run test:keystone`.

## Task 2 — Review on Keystone (owner only)

**Owns:** `apps/marketing/src/lib/keystone/animreview/**`, `apps/marketing/src/app/keystone/animated/**`, `apps/marketing/src/app/api/keystone/animated/**`, `apps/marketing/scripts/keystone-animated-publish.ts`, `apps/marketing/scripts/keystone-animated-flags.ts`, the two new models in `src/lib/keystone/db.ts` (append only), a nav link for the evelyn role, CSS appended to `keystone.css`.

1. Models (additive): `animations` `{ itemId, version, entry:"solution.html", height, voice, status:"review"|"fixing"|"accepted"|"released", notes, addresses:[flagId], createdAt, createdBy }` unique on (itemId, version); `animflags` `{ itemId, version, step, line, timeMs, comment, spoken:boolean, shots:[file], status:"open"|"fixed"|"confirmed"|"reopened", fixedInVersion, reply, createdBy, createdAt, updatedAt }`.
2. File route `GET /api/keystone/animated/[itemId]/[version]/[...path]` — like the existing player route (Range for audio, path cannot leave the folder) but **evelyn role only** unless the animation's status is `released`. Shots: `GET /api/keystone/animated/shot/[flagId]/[file]`, evelyn only.
3. Pages (evelyn role only; others get 404): `/keystone/animated` — table of items with an animated version: latest version, status, open flags, link. `/keystone/animated/[itemId]?v=N` — the player in a same-origin iframe (height from the record, a phone/tablet/desktop width switch), version picker, and the flag panel.
4. Flag panel (client component): **Flag** (button and key `f`) calls `esPlayer.pause()`, records `esPlayer.state()` and opens the comment box; **mic** button dictates into the box with the browser's speech recognition (`webkitSpeechRecognition`; hidden when unsupported; text stays editable; sets `spoken`); **Snap** (button and key `s`) takes a picture of the tab with `getDisplayMedia({ preferCurrentTab: true })` exactly as `apps/tutor/src/app/tutor/components/v2/V2FlagBar.tsx` does (stream kept for the session, first frames blank), cropped to the iframe's rectangle, attached to the open flag (a Snap with no flag open opens one); **Save** posts the flag (multipart, PNGs ≤ 4 MB each, ≤ 8 per flag) and resumes playback. List of this version's flags (step, time, comment, thumbnails; edit / delete own open flag). For v ≥ 2: the previous version's flags listed as "Fixed in vN" with the fixer's reply, each with **Confirm** / **Reopen** (reopen needs a comment and creates an open flag on the current version linked to the old one). **Accept this version** button when no open flag remains.
5. Server actions / API with role check, input validation, and `KEYSTONE_READONLY` respected like the other writers. Shots stored at `DATA_DIR/animflags/<flagId>/<n>.png`.
6. `keystone-animated-publish.ts <outDir> --item <id> [--addresses flagId,…] [--reply "flagId=text"…] [--dry-run]` — rsync the built folder to `root@85.239.239.134:/root/keystone-data/assets/<id>/animated/v<N>/` and insert the `animations` row (N = last + 1), mark the addressed flags `fixed` with `fixedInVersion` and reply. Refuses unless `KEYSTONE_MONGODB_URI` is set explicitly; `--dry-run` prints and writes nothing. `keystone-animated-flags.ts [--item id] [--out dir]` — read-only: prints open/reopened flags (step, line, time, comment) and pulls their shots into `--out` so a session can look at them.
7. Tests against the local test DB for the role gate, flag lifecycle (open → fixed → confirmed / reopened), version numbering, path safety.

## Task 3 — Voice recording

**Owns:** `apps/marketing/scripts/keystone-animated-record.ts`, `apps/marketing/src/lib/keystone/animated/record.ts` (+ test).

1. Read Cartesia's current docs (do not trust memory) for TTS with word or sentence timestamps and the current model id; look at how `apps/tutor` calls Cartesia (model, version header, voice settings) and reuse the same conventions. Voices by spec `voice`: "Mr. Joseph" (Physics, Mathematics), "Ms. Michelle" (Biology, Chemistry) — find the Cartesia voice ids the October prototypes used (search the repo and `docs/whitelabel/castle-rock`, earlier scripts, the tutor's voice catalogue); if they cannot be found, report back rather than guess. Note `RETIRED_CARTESIA_VOICES` in the tutor app.
2. `record.ts`: pure parts tested without the network — `speakText(line)` (speak ?? say), `stepText(step)`, `startsFromTimestamps(lines, words[])` → one start (ms) per line by aligning the word stream to each line's words (tolerant of punctuation/number expansion; falls back to proportional inside a step when alignment fails, and says so), character count.
3. CLI: `keystone-animated-record.ts <srcDir>/<itemId> [--live] [--step N] [--force]` — without `--live` prints the text per step, the character count and what would be recorded (no call). With `--live`: one request per step, writes `audio/step-N.mp3` and `timing.json`; skips steps whose text hash is unchanged (hash kept in `timing.json`) unless `--force`; logs characters billed per item to `<srcDir>/recording-log.jsonl`. Key from `CARTESIA_API_KEY` in the environment (never printed); missing key → clear message.

## After the three tasks (controller)

- Commit, gate (`npm run test:keystone`, tsc, `scripts/ops/wt.sh finish --no-push`).
- Author the 12 items (one sub-agent each, from the approved written solution in `docs/whitelabel/castle-rock/keystone/items/<id>.md`): figure choice per the playbook's six beats, storyboard, spec/figure/board.js, build, checks, headless verify, look at the screenshots. Items: Math 303439, 299122, 286312, 286340 · Physics 98186, 202286, 135676 · Chemistry 193246, 196083 · Biology 304746, 304631, 93953.
- Record (Cartesia, approved), rebuild with timing, verify again.
- Deploy, publish v1 of each (needs Praveen's go for the production writes), hand him `/keystone/animated`.
