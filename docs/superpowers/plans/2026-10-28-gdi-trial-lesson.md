# GDI Trial Lesson Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Josh's 25-minute "Talking About Your Work and Recent Projects" lesson runs on the demo engine with a once-only working level, measured pronunciation feedback, four tester links and per-session replay links, by Friday 6 November 2026.

**Architecture:** Everything is tutor-engine code in `apps/tutor`, gated by two new partner-row options (`levelCheck`, `pronunciation`, on for `gdi-demo` only) and two kill switches. The working level is a once-only brain tool whose value is stored on the StudentProfile and turned into one prompt clause. Pronunciation is a vendor-neutral server route (`/api/tutor/pronunciation/assess`) fed by a one-turn clip the client buffers after a `request_pronunciation_check` tool call; the result is planted as a note into the next brain turn. The lesson is a plan JSON ingested into the demo engine's plan store.

**Tech Stack:** Next.js / TypeScript (`apps/tutor`), `*.test.ts` run with `npx tsx` via `npm run test:changed`, Mongo (prod via the :2710 tunnel), Cartesia Ink 2 STT / Sonic TTS, Azure AI Speech SDK (`microsoft-cognitiveservices-speech-sdk`) and Speechace REST for the bake-off, Haiku 5.5 brain.

**Spec:** `docs/superpowers/specs/2026-10-28-gdi-trial-lesson-design.md`

## Global Constraints

- Work in a worktree: `scripts/ops/wt.sh sweep` then `scripts/ops/wt.sh new gdi-trial-lesson` (off origin/main). Never edit, build or deploy in the root checkout.
- Deploy ONLY with `./deploy-tutor-demo.sh` from the worktree (`evelyn-tutor-demo` :3009). `:3007` and `:3008` build ids must be unchanged afterwards.
- Flags default ON: `process.env.NEXT_PUBLIC_<NAME> !== 'off'`. Tenant behaviour via `PARTNER_SESSION_DEFAULTS` (`src/lib/tutor/portal/partner-session-options.ts`), never a branch.
- Prompt clauses are generic (no "th / b-v / katakana" in the system prompt; those live in the plan JSON).
- Level values exactly: `'beginner' | 'intermediate' | 'advanced'`. Plan id exactly `gdi.trial.english.work-projects.v1`. Segment ids exactly: `overview`, `level-check`, `topic-intro`, `present-perfect`, `past-simple`, `open-conversation`, `pronunciation`, `summary`. Minutes 2/3/3/3.5/3.5/5/3/2 = 25.
- No `is_trial` and no `wrap_at_minutes` on the trial links; `max_duration_minutes: 30`.
- Vendor keys only in `apps/tutor/.env.local` (and the server's env when deployed): `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`, `SPEECHACE_KEY`, `TUTOR_PRONUNCIATION_VENDOR=azure|speechace`. Never committed.
- Prod writes (plan ingest, minute pool, env on the server) need Praveen's go-ahead per write. Live runs: ≤ 8 on the demo engine for this build.
- Commit after every task; `npm run test:changed` in `apps/tutor` before each commit (it says when `test:all` is needed; baseline has 2 known failures: embed-debug-coverage, portal-student-scoping).

## Review Focus

1. A learner answers the three level-check questions entirely in Japanese: the tutor must still set a level (beginner) and not loop on "please answer in English". Test in Task 2 (`set_working_level` accepts `evidence` in any script) and Task 4 (segment note says so).
2. The brain calls `set_working_level` twice or with a value outside the enum: second call and bad values are rejected with a note; the first value stands. Task 2.
3. A tester's second session with the level known: no level-check questions, no recall of last session's content, examples not rotated, one continuation line. Task 3.
4. Pronunciation clip arrives empty, too long (> 15 s), or the vendor errors / no key: the note says `unavailable`, the tutor coaches from the model, and the claim guard still drops unsupported claims. Tasks 6 and 7.
5. `close_session_notes` fires before the `summary` segment spoke: the spoken recap must still happen (the quiet auto-end waits 45 s after the close). Task 4 pins the recap's `requiredPhrases`; Task 9 checks it live.

---

### Task 1: Partner-row features and kill switches

**Files:**
- Modify: `apps/tutor/src/lib/tutor/portal/partner-session-options.ts:22-59`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts` (append after `TUTOR_BUBBLE_MATH`)
- Test: `apps/tutor/src/lib/tutor/portal/partner-session-options.test.ts` (create if absent)

**Interfaces:**
- Produces: `PartnerSessionOptions.levelCheck: boolean`, `PartnerSessionOptions.pronunciation: boolean` (both default `false`; `'gdi-demo'` sets both `true`); `export const TUTOR_WORKING_LEVEL: boolean`, `export const TUTOR_PRONUNCIATION_ASSESS: boolean` in `flags.ts` (`!== 'off'`).

- [ ] **Step 1: Write the failing test** — `resolvePartnerSessionOptions({ partner_id: 'gdi-demo' })` (signature at `partner-session-options.ts:73`, takes a `PartnerSessionLike`) returns `levelCheck: true, pronunciation: true`; `{ partner_id: 'crimsora' }` and an unknown partner return both `false`; existing `openerPrefetch` values unchanged.
- [ ] **Step 2: Run** `npx tsx src/lib/tutor/portal/partner-session-options.test.ts` — expect FAIL (fields undefined).
- [ ] **Step 3: Add the two fields + defaults + the `gdi-demo` row; add the two flags with a dated comment in the file's house style.**
- [ ] **Step 4: Run the test — PASS.** `npm run test:changed` clean.
- [ ] **Step 5: Commit** `feat(tutor): partner options levelCheck/pronunciation + kill switches (GDI trial)`.

### Task 2: Working level — tool, once-only handler, prompt clause, persistence

**Files:**
- Create: `apps/tutor/src/lib/tutor/level/working-level.ts`
- Create: `apps/tutor/src/lib/tutor/level/working-level.test.ts`
- Modify: `apps/tutor/src/app/tutor/hooks/toolDefinitions.ts` (tool after `close_session_notes` at :2068; handler near :3070)
- Modify: `apps/tutor/src/lib/tutor/student-profile/types.ts:226-270` (`StudentProfile.workingLevel?`)
- Modify: `apps/tutor/src/lib/tutor/ai/system-prompt-builder.ts` (context field + clause next to `buildBilingualClause` :2079)
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (tool filter near :21751; profile sync; prompt context)

**Interfaces:**
- Produces:
  - `export type WorkingLevel = 'beginner' | 'intermediate' | 'advanced'`; `export const WORKING_LEVELS: readonly WorkingLevel[]`
  - `export function parseWorkingLevel(v: unknown): WorkingLevel | null`
  - `export function buildWorkingLevelClause(level: WorkingLevel, opts: { secondLanguage?: string; known: boolean }): string` — `known: false` ⇒ "level just set: announce softly in one line, no CEFR, never re-test"; `known: true` ⇒ "level known from a previous lesson: one continuation line, skip the check".
  - `export function applyWorkingLevel(profile: StudentProfile, input: { level: WorkingLevel; planId: string; at?: number }): StudentProfile` (pure).
  - Tool `set_working_level({ level: WorkingLevel; evidence: string })`; handler returns `{ ok: true }` the first time, `{ ok: false, note: string }` on a second call or bad value.
  - Prompt-builder context: `workingLevel?: { level: WorkingLevel; known: boolean }`.
- Consumes: `resolvePartnerSessionOptions(partnerId).levelCheck`, `TUTOR_WORKING_LEVEL` (Task 1); `saveStudentProfile` / the existing `/api/tutor/student-profile/[id]` POST path (`student-profile/store.ts:144`).

- [ ] **Step 1: Write failing tests** in `working-level.test.ts`: `parseWorkingLevel('Intermediate ')` → `'intermediate'`, `'B1'` → `null`; `buildWorkingLevelClause('beginner', {secondLanguage:'Japanese', known:false})` contains "Japanese" for explanations AND corrections and the phrase "only once"; `'intermediate'` clause says corrections explained in Japanese, conversation in English; `'advanced'` says Japanese only on request; `known:true` clause contains "continue" and forbids the check; `applyWorkingLevel` sets `profile.workingLevel = {level, planId, setAt}` and is idempotent on the same level.
- [ ] **Step 2: Run** `npx tsx src/lib/tutor/level/working-level.test.ts` — FAIL (module missing).
- [ ] **Step 3: Implement `working-level.ts`** (the clause text is the only body that matters; keep it generic — no sound names, no lesson names).
- [ ] **Step 4: Tool definition + handler.** Add `set_working_level` to `WHITEBOARD_TOOLS`; in the tool-filter site (`VoiceTutorRealtime.tsx:21751`) drop it unless `partnerOptions.levelCheck && TUTOR_WORKING_LEVEL`. Handler: a `workingLevelRef` (null initially, or the profile's stored level on load); first valid call stores it, POSTs the profile update, and plants a note "level set — announce in one line"; later calls return `{ok:false, note:'Level already set this session; do not re-test.'}`.
- [ ] **Step 5: Prompt wiring.** Pass `workingLevel` into the prompt-builder context from the session component (known = came from the profile; not known = set this session). The clause is appended right after the bilingual clause.
- [ ] **Step 6: Tests** — extend `working-level.test.ts` with the handler's pure part (extract `decideSetWorkingLevel(current: WorkingLevel | null, requested: unknown): {ok:boolean; level?:WorkingLevel; note?:string}` into `working-level.ts` and test the three cases). Run `npm run test:changed` — PASS.
- [ ] **Step 7: Commit** `feat(tutor): once-only working level (tool, clause, profile) behind levelCheck`.

### Task 3: Fixed-script plans — skip the check when the level is known, no recall, no rotation

**Files:**
- Create: `apps/tutor/src/lib/tutor/lesson-plan/fixed-script.ts`
- Create: `apps/tutor/src/lib/tutor/lesson-plan/fixed-script.test.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (initial cursor :10854; `openerFields.isReturning` :24961; the `recordPlanContentSeen` call site)
- Modify: `apps/tutor/src/lib/tutor/ai/system-prompt-builder.ts` (warm-resume branch :1536-1670: when `fixedScript`, replace history recall with the known-level line)

**Interfaces:**
- Produces: `export function isFixedScriptPlan(plan: LessonPlan | null | undefined): boolean` (`plan.metadata.fixedScript === true`); `export function initialSegmentId(plan: LessonPlan, levelKnown: boolean): string` — first segment, or the first segment after any whose `metadata.skipWhenLevelKnown === true` when `levelKnown`.
- Consumes: `workingLevel.known` (Task 2).

- [ ] **Step 1: Failing tests**: `initialSegmentId(plan, false)` = `'overview'`; `initialSegmentId(plan, true)` on a plan whose `level-check` segment has `skipWhenLevelKnown` = `'overview'` still (overview is first) — and with the cursor advancing, `nextSegmentId(plan, 'overview', true)` = `'topic-intro'` (add `export function nextSegmentId(plan, fromId, levelKnown): string | null` that skips flagged segments). `isFixedScriptPlan` true/false/undefined cases.
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** `fixed-script.ts`; wire `nextSegmentId` into the `advance_lesson` "next" path and `initialSegmentId` into the initial cursor.
- [ ] **Step 4: Suppress recall + rotation.** When `isFixedScriptPlan`: `openerFields.isReturning = false`, the transient-context block omits previous-session summaries for this plan, and `recordPlanContentSeen` is not called. Add a test for the pure helper `shouldRotatePlanContent(plan)` (false for fixed script).
- [ ] **Step 5: `npm run test:changed` — PASS. Commit** `feat(tutor): fixedScript plans — skip known level check, no recall/rotation`.

### Task 4: The lesson plan JSON

**Files:**
- Create: `docs/whitelabel/gdi/plans/gdi-work-projects-v1.json`
- Create: `apps/tutor/src/lib/tutor/lesson-plan/gdi-work-projects.test.ts`

**Interfaces:**
- Consumes: parser `src/lib/tutor/lesson-plan/parser.ts` (`misconception_check` needs `question`; `extension` needs `advancedQuestion`; `keyIdeas` are strings; `requiredPhrases`, `estimatedMinutes`, `metadata` per segment).
- Produces: plan id `gdi.trial.english.work-projects.v1`, `metadata: { fixedScript: true, partner: 'gdi-demo' }`, segment `level-check` with `metadata.skipWhenLevelKnown: true`, segment `pronunciation` with `metadata.pronunciation: { words: ['responsibilities','international','communicate','customers','developed'], sentences: ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'] }`.

- [ ] **Step 1: Failing test**: load the JSON, run the parser, assert: 8 segments in the exact id order; minutes sum 25; `overview.requiredPhrases` include "present perfect" and "past simple"; `topic-intro.keyIdeas` contain lines starting `[beginner]`, `[intermediate]`, `[advanced]`; `summary.requiredPhrases` include "one thing you did well"; `subject === 'languages'`; `metadata.fixedScript === true`.
- [ ] **Step 2: Run — FAIL (file missing).**
- [ ] **Step 3: Write the plan** from Josh's document (`docs/whitelabel/gdi/samples/test-lesson-layout-and-requirements-2026-10-28.md`) using `gdi-demo-experiences-starter.json` as the shape template. Teacher notes carry: the three questions and "no corrections, one simple follow-up, then call set_working_level"; "teach ONLY the variant for the working level"; Acknowledge → Correct → Explain → Practice → Continue; the open-conversation persona answer rule; the four pronunciation options and "model first, then call request_pronunciation_check with the exact reference text"; the recap's four items. Level-check question text = the first spoken question (it is the segment's problem truth).
- [ ] **Step 4: Run — PASS. Commit** `content(gdi): trial lesson plan v1`.

### Task 5: Pronunciation bake-off harness (Azure vs Speechace)

**Files:**
- Create: `apps/tutor/src/lib/tutor/pronunciation/types.ts`
- Create: `apps/tutor/src/lib/tutor/pronunciation/azure.ts`, `speechace.ts`, `normalize.test.ts` (+ fixtures `fixtures/azure-sample.json`, `fixtures/speechace-sample.json`)
- Create: `apps/tutor/scripts/tutor/voice-harness/pronunciation/run.ts`, `corpus/pron-ja/clips.json`
- Modify: `apps/tutor/package.json` (`"voice:pron": "npx tsx scripts/tutor/voice-harness/pronunciation/run.ts"`), add dependency `microsoft-cognitiveservices-speech-sdk`.

**Interfaces:**
- Produces:
  - `export interface PronunciationResult { vendor: 'azure'|'speechace'; overall: number; words: Array<{ word: string; score: number; errorType: 'none'|'mispronunciation'|'omission'|'insertion'; phonemes: Array<{ ipa: string; score: number }>; stress?: 'ok'|'wrong' }>; prosody?: number; fluency?: number; latencyMs: number }`
  - `export function normalizeAzure(json: unknown): PronunciationResult`, `export function normalizeSpeechace(json: unknown): PronunciationResult`
  - `export async function assessAzure(pcm16: Buffer, referenceText: string, env: {key:string; region:string}): Promise<PronunciationResult>` (scripted, `granularity: Phoneme`, `phonemeAlphabet: 'IPA'`, prosody on), `export async function assessSpeechace(pcm16: Buffer, referenceText: string, env: {key:string}): Promise<PronunciationResult>`.
  - `npm run voice:pron [-- --vendor azure|speechace] [--clip <id>]` → `artifacts/voice-harness/pron/<runId>/results.json` + `compare.md` (per clip: both overalls, flagged words, worst phonemes, latency).
- Consumes: `wavToPcm16Mono` from `scripts/tutor/voice-harness/audio-util.ts`; `requireKey` from `env.ts`.

- [ ] **Step 1: Failing normaliser tests** against the two fixture JSONs (Azure fixture = the `countryside` sample from Microsoft's docs: word score 30, errorType mispronunciation, phoneme `k` score 0; Speechace fixture = one word with a syllable-stress error).
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** `types.ts`, the two normalisers, the two clients, `run.ts`, the npm script. Clips: Praveen records the five words and two sentences twice (katakana-style and clear) as 16 kHz WAV into `corpus/pron-ja/`; `clips.json` lists `{id, file, referenceText, planted: ['th'|'bv'|'katakana'|'none']}`.
- [ ] **Step 4: Run** `npm run test:changed` — PASS; then `npm run voice:pron` with both keys (paid-free-tier call; ≤ 24 requests). Read `compare.md`; record the pick and why in `docs/whitelabel/gdi/test-lesson-analysis-2026-10-28.md` §4.
- [ ] **Step 5: Commit** `feat(tutor): pronunciation assessment clients + bake-off harness`.

### Task 6: Server route `/api/tutor/pronunciation/assess`

**Files:**
- Create: `apps/tutor/src/app/api/tutor/pronunciation/assess/route.ts`
- Create: `apps/tutor/src/lib/tutor/pronunciation/assessor.ts`, `assessor.test.ts`
- Modify: `apps/tutor/src/lib/tutor/voice/pronunciation-claim.ts:21-45`

**Interfaces:**
- Produces:
  - `export async function assessPronunciation(input: { pcm16: Buffer; sampleRate: 24000; referenceText: string }, env = process.env): Promise<{ status: 'ok'; result: PronunciationResult } | { status: 'unavailable'; reason: 'no_vendor'|'no_key'|'clip_too_short'|'clip_too_long'|'vendor_error' }>` — vendor from `TUTOR_PRONUNCIATION_VENDOR`; `< 0.4 s` ⇒ too short; `> 15 s` ⇒ too long; resample 24 kHz → 16 kHz before the vendor call.
  - `export function formatPronunciationNote(r: ReturnType<typeof assessPronunciation> extends Promise<infer T> ? T : never, referenceText: string): string` — ≤ 80 words: overall, up to two worst words with their worst phoneme (IPA) and stress flag, or the `unavailable` sentence ("No measured result: coach stress and linking from your model; do not describe sounds.").
  - Route: POST body `{ sessionId, referenceText, audio: base64 PCM16 24 kHz }` (≤ 1.5 MB), same partner-session auth header as `/api/tutor/session-audio`; returns the assessor output. Gated: `TUTOR_PRONUNCIATION_ASSESS` and `resolvePartnerSessionOptions(partnerId).pronunciation`, else 404.
  - `isPronunciationClaimSentence(sentence, studentText, opts?: { measured?: boolean })` — `measured: true` ⇒ never drops.
- Consumes: Task 5 clients and `PronunciationResult`.

- [ ] **Step 1: Failing tests**: no vendor env ⇒ `unavailable/no_vendor`; vendor set, no key ⇒ `no_key`; 0.2 s clip ⇒ `clip_too_short`; a stubbed vendor returning the Azure fixture ⇒ `ok` and the note names `countryside` and `k`; `formatPronunciationNote` ≤ 80 words; guard with `measured:true` returns false for a sentence it would otherwise drop.
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** assessor, route, guard option.
- [ ] **Step 4: `npm run test:changed` — PASS. Commit** `feat(tutor): pronunciation assess route + measured-claim bypass`.

### Task 7: Client — `request_pronunciation_check` tool, one-turn clip, note into the next turn

**Files:**
- Modify: `apps/tutor/src/app/tutor/hooks/toolDefinitions.ts` (tool + handler)
- Create: `apps/tutor/src/lib/tutor/pronunciation/clip-capture.ts`, `clip-capture.test.ts`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (tool filter :21751; `onStudentAudioChunk` consumer at `useOpenAIRealtime.ts:218` already wired at :21835; `onSpeechStart/onSpeechStop` from `useCartesiaInkWS`; pronunciation-claim drop site :15168; TTS call for the model line)

**Interfaces:**
- Produces:
  - Tool `request_pronunciation_check({ referenceText: string; kind: 'word'|'sentence'|'natural' })` — offered only when `partnerOptions.pronunciation && TUTOR_PRONUNCIATION_ASSESS`; description: "Call right AFTER you have modelled the exact text and asked the student to repeat it; the next student turn is measured."
  - `export class ClipCapture { constructor(opts: { maxMs: 10000; sampleRate: 24000 }); arm(referenceText: string): void; onSpeechStart(): void; push(float32: Float32Array): void; onSpeechStop(): { referenceText: string; pcm16: Int16Array; durationMs: number } | null; isArmed(): boolean }` — pure, no React.
  - Debug events: `pronunciation_armed`, `pronunciation_clip_sent`, `pronunciation_note_planted`, `pronunciation_unavailable`.
- Consumes: Task 6 route and `formatPronunciationNote`; the note-planting pattern (`closeNotesResultNoteRef`, `VoiceTutorRealtime.tsx:8382`).

- [ ] **Step 1: Failing tests** for `ClipCapture`: not armed ⇒ `push` ignored and `onSpeechStop` null; armed ⇒ chunks between start/stop are concatenated as PCM16, duration correct, capture disarms after one stop; `maxMs` truncates; a second `arm` before stop replaces the reference text.
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** `clip-capture.ts`; register the tool; handler arms the capture and (if the model line was not yet spoken) speaks `referenceText` via `speakText`, making sure the TTS request carries `language:'en'` (the per-sentence picker `ttsLanguageFor` in `src/lib/tutor/voice/tts-language.ts:43` would otherwise pick the Japanese voice when kana share the turn); on `onSpeechStop` with a clip, POST to the route, plant `formatPronunciationNote(...)` as `pronunciationResultNoteRef` for the next brain turn, and pass `measured: true` to the claim guard for that one turn.
- [ ] **Step 4: `npm run test:changed` — PASS (it will say whether `test:all` is needed; the component file is cross-cutting). Commit** `feat(tutor): request_pronunciation_check — one-turn clip, measured note`.

### Task 8: Trial logistics — mint, pool, replay links, tester guide

**Files:**
- Modify: `docs/whitelabel/gdi/demo/mint-demo-links.js` (add lesson `trial`, `--testers N`, `--ttl_hours 720` default for `trial`)
- Create: `docs/whitelabel/gdi/demo/mint-replay-links.js`
- Modify: `docs/whitelabel/gdi/TESTER-GUIDE.md`
- Create: `docs/whitelabel/gdi/demo/mint.test.mjs` (decodes a minted token and checks claims)

**Interfaces:**
- Produces: trial claims `{ partner_id:'gdi-demo', student_id:'gdi-trial-<n>' (fixed) | 'gdi-trial-josh-<ts>' / 'gdi-trial-praveen-<ts>' (fresh), curriculum_module:'gdi.trial.english.work-projects.v1', target_kind:'lessonNode', input_mode:'voice', teacher: ryota, tutor_languages:['en','ja'], speech_rate:0.8, max_duration_minutes:30, exp: now+720h }` and NO `is_trial`, NO `wrap_at_minutes`.
- `node mint-replay-links.js --since 2026-11-01` → one `/tutor-portal/replay?token=…` per `gdi-demo` session (30-day exp) using `replay-token.ts`'s payload shape `{mode:'replay', partner_id, student_id, session_id, exp}` and the partner secret.

- [ ] **Step 1: Failing test** `node docs/whitelabel/gdi/demo/mint.test.mjs`: mint `trial --testers 4` with a dummy secret ⇒ 4 tester links with ids `gdi-trial-1..4` + 2 fresh-id links; decoded claims match the set above; `is_trial`/`wrap_at_minutes` absent.
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** the mint changes and `mint-replay-links.js` (reads sessions from Mongo via the tunnel, read-only).
- [ ] **Step 4: Update the tester guide** (25 min; the level check once; the four pronunciation options; "say 「わかりません」"; "you can skip pronunciation").
- [ ] **Step 5: Test PASS. Commit** `ops(gdi): trial mint, replay links, tester guide`.

### Task 9: Gate, deploy the demo engine, ingest, live acceptance

**Files:** none new. Prod writes need Praveen's go-ahead: plan ingest, `partner-pool.sh set gdi-demo 300` + `session-max gdi-demo 30`, server env keys.

- [ ] **Step 1:** `npm run test:changed` in the worktree's `apps/tutor` (run `test:all` if it says so); prod build.
- [ ] **Step 2:** Add `AZURE_SPEECH_KEY/REGION` or `SPEECHACE_KEY` + `TUTOR_PRONUNCIATION_VENDOR` to the server env for the demo engine (go-ahead), then `./deploy-tutor-demo.sh` from the worktree. Verify :3009 200, `:3007`/`:3008` build ids unchanged.
- [ ] **Step 3:** Ingest the plan into the demo engine's plan store (go-ahead; same path the three demo plans used — `upsertLessonPlan` via the lesson-plans route or script); set the minute pool (go-ahead).
- [ ] **Step 4: Live run 1 (Praveen, fresh id, intermediate):** overview → three questions → one soft level line → only the intermediate variant → a planted "I have attended an exhibition last year" corrected with a retry → ask the tutor a question → pronunciation option B with a planted "th" → summary quoting the learner's sentence → 20–27 min. Fix, redeploy, re-run as needed (budget ≤ 8 runs).
- [ ] **Step 5: Live run 2 (same tester id again):** skips the check, one continuation line, no recall of run 1's content.
- [ ] **Step 6: Live run 3 (beginner, Japanese-only answers to the check):** level = beginner, explanations in Japanese, English only for the target phrases.
- [ ] **Step 7:** Mint Josh's link + the four tester links; update the tester guide; hand Praveen the email line. `scripts/ops/wt.sh finish`.
- [ ] **Step 8:** Memory: update `project_gdi_communications_inquiry.md` with build ids, run ids and the vendor pick.
