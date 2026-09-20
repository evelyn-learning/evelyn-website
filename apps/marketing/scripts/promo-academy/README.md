# Evelyn Academy tour video — sources

Small, durable sources for the ~60 s walkthrough on `/products/academy`
(spec: `docs/superpowers/specs/2026-09-16-academy-product-page-design.md` §7).
The Crimsora v2 promo lost its sources in a session scratchpad; these live in
git so that cannot happen again. Raw footage, VO mp3s and music do NOT belong
here — keep them in `~/.evelyn/promo/academy-v1/` (the `<work-dir>` in
`scenes.json`).

This folder is outside the marketing deploy allow-list (`deploy-marketing.sh`
zips `src`, `public`, `.next` — not `scripts`), so nothing here ships.

## Pipeline

The editor lives in the academy repo and is used **read-only, by path**:
`~/Dev/academy/scripts/promo/` + `~/Dev/academy/scripts/capture-session-video.mjs`.
Read its README first — the gotchas there are real.

`gen-vo.mjs` reads `vo-script.json` from its own directory, so copy the
pipeline scripts into the work dir and put OUR script beside them:

    W=~/.evelyn/promo/academy-v1 && mkdir -p $W/{ui,session,music,vo,labels}
    cp ~/Dev/academy/scripts/promo/{gen-vo,assemble,gen-labels,shot-card,tts-track,capture-page-scroll,login-save-state}.mjs $W/
    cp vo-script.json introcard.html endcard.html scenes.json $W/

1. **Cards** — `node shot-card.mjs introcard.html introcard.png` (same for endcard).
2. **Narration** — `CARTESIA_API_KEY=… node gen-vo.mjs vo`, then `ffmpeg -af atempo=1.09` per file.
3. **Footage** — local academy stack with `BRAND` unset (the neutral "Evelyn Academy"
   brand, :3011), tutor engine on :3006. UI scenes via `capture-page-scroll.mjs`
   with a saved login state; the lesson via
   `CAPTURE_TTS=1 node ~/Dev/academy/scripts/capture-session-video.mjs …` + `tts-track.mjs`.
   Brand-swap scene: the three Playwright brand builds (:3011 / :3012 / :3013), hard cuts.
4. **Assemble** — fill real `start`/`dur` in `scenes.json` from a contact sheet, then
   `node assemble.mjs scenes.json academy-tour-v1.mp4`.
5. **Ship** — H.264 + faststart, ≤ 8 MB → `apps/marketing/public/videos/academy-tour-v1.mp4`
   + a poster jpg, then set `ACADEMY_TOUR_VIDEO` in `src/app/products/academy/page.tsx`
   and add `VideoObject` JSON-LD in the layout.

## What actually produced v1 (2026-09-17)

`academy-tour-v1.mp4` — 55.2 s, −16.9 LUFS, 5.0 MB web encode (`-crf 23 -movflags +faststart`), poster = master frame at 17 s.

- **Stack:** academy worktree with a current `npm ci` (the academy ROOT's `node_modules` had a stale
  portal-contract and the API would not boot). `BRAND` unset → the neutral "Evelyn Academy" brand on :3011.
- **Live-lesson scene — REAL engine:** tutor engine from an evelynlearning worktree on :3006 with
  `MONGODB_URI=mongodb://127.0.0.1:27017/academy_m3` (⚠ the dev `.env.local` URI is a tunnel to a REMOTE
  Mongo — always override) and `PORTAL_PARTNER_SECRETS` matching the academy `.env.local`; academy API via
  `tsx apps/api/src/index.ts`. Local `GEOMETRY.defaultTeacherId` set to a Cartesia-voiced persona for the run
  and unset afterwards. `CAPTURE_TTS=1 … capture-session-video.mjs geometry "Triangle Angle Sum" --max-ms 150000`
  → `tts-track.mjs`. Window used: source 74.0 → 87.0 s (tutor utterance starts ≈76.1 s, after the narrator's hand-off line).
  The first run can time out on `enroll-cta` while Next dev compiles — re-run; the saved auth state is reused.
- **Every other scene — MOCK backend (`npm run dev:backend`, `ADMIN_EMAILS=admin@northfield.example`):**
  in-memory Mongo + mock engine, so the footage contains fixture data and fictional accounts only.
  `capture-ui.mjs` (this folder) signs the accounts up via the API, applies `zoom: 1.3` for legibility at 1080p,
  hides the Next dev badge, and films lessons / practice / overview / mock / admin. It also swaps the mock
  engine's stub exam text ("What is 1 + 1?", "Fixture Form A") for realistic copy at the network layer —
  display-only; the fixture answers still line up (A, then B).
- **Brand swap:** two more `next dev` servers from the same worktree — `BRAND=crimsora -p 3013` and
  `BRAND=evelyn -p 3012`, each with its own `NEXT_DIST_DIR` — then `capture-ui.mjs brand-<name>` with `WEB=` set.
  The session cookie is host-scoped, so one account works on all three ports. ⚠ `next dev` rewrites
  `apps/web/next-env.d.ts` + `tsconfig.json` in that worktree: `git checkout --` them and delete the extra dist dirs after.
- **Narration:** Crimsora promo narrator voice (confirmed by Praveen), `atempo=1.09`, `voGain 1.3`.
- **Music:** "Cinematic Corporate Explainer Video" by alex-morgan, Pixabay audio ID 552769, Pixabay Content
  License; the licence certificate is kept beside the track at `<work-dir>/music/bed-LICENSE.txt`. Gain 0.09.
- **Verified:** `ebur128` integrated −16.9 LUFS; Deepgram transcript of the master = narrator lines + the tutor
  slice only (no mic was granted to the capture browser, so no student audio can exist); contact sheet checked for PII.

## v2 (2026-09-17, same day) — Praveen's notes on v1

`academy-tour-v2.mp4` — 58.4 s, −17.2 LUFS, 5.4 MB. Three changes:

1. **Breathing room around the tutor slice.** ~2 s of silence between the narrator's "Here's the tutor,
   mid-lesson." and the tutor's first word, and ~2 s after his last. Done with a NEGATIVE `audioLead` on the
   lesson scene (`start 73.9`, `audioLead -1.0`, `audioDur 14.5`, `dur 16.2`): the picture starts earlier than
   the audio, which also keeps the tail of the previous utterance out. The slice is ONE complete sentence
   (source 78.06 → 88.15 s) chosen from a Deepgram word-timed transcript, so it starts and ends cleanly.
2. **Male US tutor voice.** Narrator (Sophie) and the v1 tutor (Kiara) were both female and hard to tell
   apart. Re-captured the same lesson with **Mr. Cole** (Cartesia "Cole – Clear Communicator", a shipped
   Crimsora persona): `seed-teachers.ts` against the LOCAL `academy_portal`, then `GEOMETRY.defaultTeacherId`
   → Mr. Cole for the run and back to the seed mapping after. Voice confirmed by pitch, not by ear:
   median F0 ≈ 120 Hz (v1 ≈ 179 Hz). Use a FRESH capture account — a resumed session keeps its old persona.
3. **Burned-in captions.** `captions.json` (cue times from the Deepgram transcript of the assembled master,
   text from the scripts — never the ASR text) → `gen-captions.mjs` renders transparent PNG cards →
   one ffmpeg pass overlays them with `enable='between(t,a,b)'` (this ffmpeg has no drawtext/libass).
   Tutor cues carry a "MR. COLE · AI TUTOR" pill. Scene label chips moved to the TOP-RIGHT
   (`overlay=W-w-64:56` in the work-dir copy of `assemble.mjs`) so they never collide with captions.

New file name on purpose (`-v2`): the v1 URL may be cached by browsers/CDN.

## Hard rules

- **No real student's voice, name, email or session in any frame.** Tutor-only TTS
  capture; local seeded accounts; admin footage from the local in-memory stack
  (`academy/tools/e2e-backend.mjs`), never prod.
- Verify before shipping: duration, `ebur128` ≈ −16 LUFS, Deepgram `diarize` shows
  narrator + tutor only, spot-frames checked for PII.
- Running the tutor engine locally for capture is not a deploy. Nothing in this
  process touches `apps/tutor`, `packages/core` or any server.

