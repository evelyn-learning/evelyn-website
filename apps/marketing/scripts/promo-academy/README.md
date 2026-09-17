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

## Hard rules

- **No real student's voice, name, email or session in any frame.** Tutor-only TTS
  capture; local seeded accounts; admin footage from the local in-memory stack
  (`academy/tools/e2e-backend.mjs`), never prod.
- Verify before shipping: duration, `ebur128` ≈ −16 LUFS, Deepgram `diarize` shows
  narrator + tutor only, spot-frames checked for PII.
- Running the tutor engine locally for capture is not a deploy. Nothing in this
  process touches `apps/tutor`, `packages/core` or any server.

## Open items

- Narrator voice: defaults to the Crimsora promo narrator — confirm for the Evelyn brand.
- Music bed: needs a licensed track, or ship v1 without.
