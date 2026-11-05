# GDI learner home (Your lessons + session summary) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Each tester's signed link opens "Your lessons": every past session with a stored EN/JA summary (level, assessment incl. pronunciation, recommendations), a replay-with-audio link and a PDF; the lesson's end screen shows the same summary.

**Architecture:** A pure summary module (facts from the stored session → prompt → validated JSON) and a thin store with an atomic claim so a summary is generated once per session, triggered from the completed save and lazily from the home page. One token-scoped API route (GET state / POST generate), a server-side replay-token signer, a server-rendered home page reusing the replay page's PDF button, and a client panel in the embed page's end branch. Everything is partner-agnostic; only gdi-demo links are minted.

**Tech Stack:** Next.js app router (server components + route handlers), TypeScript, Mongoose (`TutorSession`), Anthropic via `getModelClient`/`callGraderJson`, HS256 tokens (`signEmbedToken`), tsx test scripts under `apps/tutor/scripts`.

**Spec:** `docs/superpowers/specs/2026-11-05-gdi-learner-home-design.md` (read it first; its "Calls made after the builder check" section is binding).

## Global Constraints

- Work in the worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/gdi-trial-lesson`, from `apps/tutor`; never the root checkout; nothing that writes to `127.0.0.1:2710` (PROD Mongo tunnel); no live sessions, no API spend; tests use injected fakes (no Mongo, no network).
- Scoping rule everywhere: a lookup matches `sourcePartnerId === payload.partner_id && studentId === payload.student_id`; a token without `student_id` is refused (`401 {error:'unauthorized', reason:'student_id_required'}`); a session of another student is `403 {error:'forbidden'}`.
- Summary numbers come only from the session record; the model writes prose. Prompt text is generic (no GDI/lesson-specific wording).
- English first, one short Japanese line per section (`*_ja` fields).
- Model role `judge` via `getModelClient('judge')` + `callGraderJson` (temperature 0.2, `max_tokens` 1200); one in-call retry on an invalid reply, no loop.
- Listed sessions: ≥ 4 transcript turns, any status, newest first, at most 20.
- Prose/typed-turn engine files untouched except the two named edits in `VoiceTutorRealtime.tsx` (none) — this plan edits `embed/page.tsx` (end branch only) and `session-usage/route.ts` (two named spots).
- Commit trailers on every commit: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` / `Claude-Session: https://claude.ai/code/session_015DuqWUDa61XUeoZHsy49AU`. Test scripts register as `"test:<name>": "npx tsx scripts/test-<name>.ts"` in `package.json`.

## Review Focus

1. A token with no `student_id` (older minted links) → home, GET and POST refuse with `student_id_required` (Task 4 pins it; Task 5 renders the refusal).
2. A valid token for student A naming student B's session → 403, and no summary generation is triggered (Task 4).
3. A session saved by the slim fallback (no `debugEvents`, transcript present) → level comes from the profile, pronunciation section = `practised: []` with `comment_en` "Pronunciation was not practised in this lesson." (Task 1).
4. The model returns unusable JSON twice → `status:'failed'` stored with `error`, GET returns it, the panel shows Retry; a later POST re-claims (Task 2).
5. A `pending` claim older than 120 s (process died) → re-claimable by the next POST/home view (Task 2).

---

### Task 1: Summary module (pure)

**Files:**
- Create: `apps/tutor/src/lib/tutor/portal/learner-summary.ts`
- Test: `apps/tutor/scripts/test-learner-summary.ts` (+ `package.json` script `test:learner-summary`)

**Interfaces:**
- Consumes: `ReplySchema`, `GraderModelClient`, `callGraderJson(client, model, system, user, schema?, opts?)` from `src/lib/tutor/portal/grade-free-response.ts` (not called here; Task 2 wires it); `WorkingLevel` from `src/lib/tutor/level/working-level.ts`.
- Produces:
  ```ts
  export type LearnerSummaryV1 = {
    version: 1; generated_at: string; model: string; turn_count: number;
    level: { value: 'beginner'|'intermediate'|'advanced'|null; source: 'session'|'profile'|'none'; evidence_en: string; evidence_ja: string };
    assessment: {
      grammar_en: string; grammar_ja: string;
      corrections: Array<{ student: string; corrected: string }>;   // max 6, from the session, never from the model
      pronunciation: { practised: Array<{ sentence: string; overall: number; prosody: number|null; weak: string[] }>; comment_en: string; comment_ja: string };
    };
    recommendations: Array<{ en: string; ja: string }>;  // 3–5
  };
  export type SessionFacts = { lessonTitle: string; durationMin: number; partsCompleted: string[]; level: LearnerSummaryV1['level']; corrections: LearnerSummaryV1['assessment']['corrections']; pronunciation: LearnerSummaryV1['assessment']['pronunciation']['practised']; transcriptExcerpt: string /* tutor+student turns, each ≤ 160 chars, max 40 turns */ };
  export type SessionFactsInput = { subject?: string; topic?: string; duration?: number; transcript: Array<{ role: string; text: string; whiteboardCommands?: Array<Record<string, unknown>> }>; debugEvents?: Array<{ type: string; message: string }>; lessonProgress?: { completedSegmentIds?: string[] } };
  export function buildSessionFacts(input: SessionFactsInput, profileLevel: { level: 'beginner'|'intermediate'|'advanced'; setAt: number } | null): SessionFacts;
  export function parseWorkingLevelEvent(message: string): { level: 'beginner'|'intermediate'|'advanced'; evidence: string } | null;   // "intermediate source=estimate evidence=Connected sentences…" → {level, evidence}
  export function parsePronunciationNote(message: string): { sentence: string; overall: number; prosody: number|null; weak: string[] } | null; // 'measured · Measured pronunciation of "X": overall 94/100. No word below 70. Prosody 88/100. …' ; weak = the `"word" NN…` items (word only); null for 'unavailable · …'
  export function correctionsFromTranscript(transcript: SessionFactsInput['transcript']): LearnerSummaryV1['assessment']['corrections']; // a tutor turn's showSentence with non-empty emphasis = corrected; student = the nearest preceding student turn text; dedupe by corrected; max 6
  export const LEARNER_SUMMARY_SCHEMA: ReplySchema;  // properties: level_evidence_en/ja, grammar_en/ja, pronunciation_comment_en/ja, recommendations: array of {en, ja}; required all; additionalProperties false
  export function renderSummaryPrompt(facts: SessionFacts): { system: string; user: string };
  export function validateModelReply(reply: unknown): { level_evidence_en: string; level_evidence_ja: string; grammar_en: string; grammar_ja: string; pronunciation_comment_en: string; pronunciation_comment_ja: string; recommendations: Array<{ en: string; ja: string }> } | null; // 3–5 recs, every string non-empty ≤ 400 chars
  export function assembleSummary(facts: SessionFacts, reply: ReturnType<typeof validateModelReply>, meta: { model: string; turnCount: number; now?: Date }): LearnerSummaryV1;
  export async function generateLearnerSummary(facts: SessionFacts, deps: { callJson: (system: string, user: string, schema: ReplySchema) => Promise<Record<string, unknown>>; model: string; turnCount: number; now?: Date }): Promise<{ ok: true; summary: LearnerSummaryV1 } | { ok: false; error: string }>; // one retry on invalid reply (second user message appends "Your previous reply was not valid JSON for the schema; reply again with only the JSON object.")
  ```

- [ ] **Step 1: Write the failing tests** — `scripts/test-learner-summary.ts` using `node:assert`, the project's `check(name, cond)` style (copy from `scripts/test-pdf-tutor-session.ts`). Cases, with these exact inputs:
  - `parseWorkingLevelEvent('intermediate source=estimate evidence=Connected sentences with mostly correct grammar')` → `{ level:'intermediate', evidence:'Connected sentences with mostly correct grammar' }`; `parseWorkingLevelEvent('known: intermediate')` → `null`.
  - `parsePronunciationNote('measured · Measured pronunciation of "I have worked with international customers for several years.": overall 94/100. No word below 70. Prosody 88/100. Feed back only on t')` → `{ sentence:'I have worked with international customers for several years.', overall:94, prosody:88, weak:[] }`; a note with `… "international" 62, weakest sound /ʃ/ 40; "with" 66, weakest sound /ð/ 51. Prosody 71/100.` → `weak:['international','with']`; `'unavailable · …'` → `null`.
  - `correctionsFromTranscript([{role:'student',text:'I work as sales manager in Nagoya.'},{role:'tutor',text:'…',whiteboardCommands:[{action:'showSentence',sentence:'I work as a sales manager in Nagoya.',emphasis:['a','in']}]},{role:'tutor',text:'…',whiteboardCommands:[{action:'showSentence',sentence:'It helps me.'}]}])` → `[{student:'I work as sales manager in Nagoya.',corrected:'I work as a sales manager in Nagoya.'}]`.
  - `buildSessionFacts` with no `working_level_set` event and `profileLevel:{level:'intermediate',setAt:…}` → `level.source==='profile'`, `evidence_en` contains "earlier lesson"; with no events and no profile → `source:'none'`, `value:null`; with no pronunciation events → `pronunciation:[]`.
  - `validateModelReply` rejects 2 recommendations and accepts 4; `assembleSummary` copies `corrections` and `pronunciation.practised` from facts (the model cannot add numbers); `pronunciation.comment_en === 'Pronunciation was not practised in this lesson.'` when `practised` is empty regardless of the reply.
  - `generateLearnerSummary`: fake `callJson` returning `{}` then a valid reply → `ok:true` and the fake was called twice with the second user message containing "not valid JSON"; always `{}` → `ok:false`, called exactly twice.
  - `renderSummaryPrompt(facts).system` contains neither "GDI" nor "Work projects"; `.user` contains the facts' corrected sentences and the scores.
- [ ] **Step 2: Run** `npx tsx scripts/test-learner-summary.ts` → FAIL (module not found).
- [ ] **Step 3: Implement** `learner-summary.ts` per the Interfaces block. Prompt (generic): system = the role ("You write the learner-facing summary of one language lesson from the facts given. Never invent scores, levels or corrections; comment only on what the facts show. English first; each `_ja` field is one short polite Japanese sentence carrying the same point. Reply with only the JSON object."); user = the facts rendered as labelled lines plus the schema's field list.
- [ ] **Step 4: Run the test** → PASS. Add `"test:learner-summary": "npx tsx scripts/test-learner-summary.ts"` to `package.json`.
- [ ] **Step 5: Commit** `feat(portal): learner summary module — facts from the session, generic prompt, validated EN/JA summary`.

### Task 2: Summary store, claim and orchestrator

**Files:**
- Modify: `apps/tutor/src/models/TutorSession.ts` (interface `ITutorSession` + schema + index)
- Create: `apps/tutor/src/lib/tutor/portal/learner-summary-store.ts`
- Test: `apps/tutor/scripts/test-learner-summary-store.ts` (+ script entry)

**Interfaces:**
- Consumes: Task 1 (`buildSessionFacts`, `generateLearnerSummary`, `LearnerSummaryV1`); `getModelClient('judge')`, `prepareParams('judge', p)` from `src/lib/tutor/ai/model-registry.ts`; `callGraderJson` from `grade-free-response.ts`; `resolveProfileId({partnerId, externalStudentId})` + `getStudentProfile(id)` from `src/lib/tutor/student-profile/store.ts`.
- Produces:
  ```ts
  // TutorSession: new optional field (schema default undefined, `{ _id:false }` sub-schema like lessonProgress)
  learnerSummary?: { status: 'pending'|'ready'|'failed'; summary?: LearnerSummaryV1 /* Mixed */; turnCount: number; version: number; updatedAt: Date; error?: string };
  // new index: { sourcePartnerId: 1, studentId: 1, startedAt: -1 }
  export type SummaryState = { status: 'none'|'pending'|'ready'|'failed'; summary?: LearnerSummaryV1; error?: string; version?: number };
  export type LearnerSessionRow = { sessionId: string; startedAt: string; endedAt?: string; durationSec: number; status: string; turnCount: number; hasAudio: boolean; subject?: string; topic?: string; level?: string; studentName?: string; summary: SummaryState; transcript: unknown[]; whiteboardCommands: unknown[]; sessionGoal?: string };
  export interface SummaryStoreDeps {
    loadSession(sessionId: string): Promise<(SessionFactsInput & { sessionId: string; studentId?: string; sourcePartnerId?: string; hasAudio?: boolean; learnerSummary?: ITutorSession['learnerSummary'] }) | null>;
    claim(sessionId: string, turnCount: number, now: Date): Promise<'claimed'|'busy'|'ready'>;   // atomic: claim when learnerSummary is absent, or failed, or pending older than 120 s, or ready with turnCount + 3 <= new turnCount → set {status:'pending', turnCount, version: (prev.version ?? 0) + (prev ready ? 1 : 0) …, updatedAt: now}
    store(sessionId: string, result: { ok: true; summary: LearnerSummaryV1 } | { ok: false; error: string }, now: Date): Promise<void>;
    profileLevel(partnerId: string, studentId: string): Promise<{ level: 'beginner'|'intermediate'|'advanced'; setAt: number } | null>;  // resolveProfileId + getStudentProfile, null on any error
    callJson(system: string, user: string, schema: ReplySchema): Promise<Record<string, unknown>>;  // getModelClient('judge') + callGraderJson with prepareParams
    model: string; now(): Date;
  }
  export function mongoSummaryStoreDeps(): SummaryStoreDeps;                     // the production wiring
  export function __setLearnerSummaryDepsForTests(deps: SummaryStoreDeps | null): void;
  export async function runSummaryForSession(sessionId: string, deps?: SummaryStoreDeps): Promise<SummaryState>;  // load → turnCount = transcript.length → claim → facts (profileLevel in try/catch) → generate → store → return the new state; 'busy' or 'ready' returns the stored state untouched
  export function summaryStateOf(s: ITutorSession['learnerSummary'] | undefined): SummaryState;
  export async function listLearnerSessions(partnerId: string, studentId: string, limit = 20): Promise<LearnerSessionRow[]>;  // TutorSession.find({sourcePartnerId, studentId, 'transcript.3': {$exists: true}}).sort({startedAt:-1}).limit(limit).lean()
  ```

- [ ] **Step 1: Write the failing tests** (fake `SummaryStoreDeps`, in-memory session map): claim semantics as a pure table — absent → claimed; pending 30 s old → busy; pending 130 s old → claimed; ready with turnCount 20, new 22 → ready; new 23 → claimed and version increments; failed → claimed. `runSummaryForSession`: happy path stores `ready` with the summary and `turn_count`; model failing twice stores `failed` with `error`; `profileLevel` throwing is swallowed (level source `none`); `busy` returns without calling the model.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** the model field + index (verbatim pattern of `lessonProgress`), the store module and `mongoSummaryStoreDeps` (the claim as one `findOneAndUpdate` with a `$or` filter on `learnerSummary.status`/`updatedAt`/`turnCount`). **Step 4: Run** → PASS; `npx tsc --noEmit -p tsconfig.json` clean.
- [ ] **Step 5: Commit** `feat(portal): learnerSummary on TutorSession + atomic claim store + runSummaryForSession`.

### Task 3: Replay-token signer

**Files:**
- Modify: `apps/tutor/src/lib/tutor/portal/replay-token.ts`
- Test: extend `apps/tutor/scripts/test-replay-token.ts` (create if absent; check `grep -l replay-token scripts/`)

**Interfaces:**
- Consumes: `signEmbedToken(payload, secret)` from `embed-token.ts`; `resolvePartnerTokenSecrets(partnerId)`; `__setPartnerTokenSecretDepsForTests`.
- Produces: `export async function signReplayToken(p: { partner_id: string; student_id: string; session_id: string; branding?: ReplayTokenPayload['branding']; ttlSec?: number /* default 30 days */ }, now = Date.now()): Promise<string | null>` (null when the partner has no secret) and `export function replayUrl(token: string, origin: string): string` → `${origin}/tutor-portal/replay?token=${token}`.

- [ ] **Step 1: Failing test:** with the secrets seam set to `['s1']`, `verifyReplayTokenAsync(await signReplayToken({...}))` → `ok:true` with the same `session_id`/`student_id`; with `[]` → `null`; `exp` is `now/1000 + 30*86400` rounded down.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** (reuse `signEmbedToken`; payload `{mode:'replay', …}`). **Step 4: Run** → PASS. **Step 5: Commit** `feat(portal): server-side replay-token signer`.

### Task 4: Learner-summary API + save-path hooks

**Files:**
- Create: `apps/tutor/src/app/api/tutor-portal/learner-summary/route.ts` (`GET`, `POST`)
- Modify: `apps/tutor/src/app/api/tutor/session-usage/route.ts` (two spots: identity from the token ~:139-148; completed hook after the `findOneAndUpdate` ~:423)
- Test: `apps/tutor/scripts/test-learner-summary-route.ts` (+ script entry); extend `apps/tutor/scripts/test-session-usage-pool.ts` with two source pins.

**Interfaces:**
- Consumes: `verifyEmbedTokenAsync`, Task 2 (`runSummaryForSession`, `summaryStateOf`, `__setLearnerSummaryDepsForTests`, `loadSession` via deps), Task 3 (`signReplayToken`, `replayUrl`).
- Produces: `GET /api/tutor-portal/learner-summary?sessionId=<id>` and `POST` (JSON body `{ sessionId }`), both with header `x-embed-token` (or `?token=` for GET). Response `200 { state: SummaryState, replayUrl: string | null, hasAudio: boolean }`; `401 {error:'unauthorized', reason}` (bad token / `student_id_required`); `403 {error:'forbidden'}` (session not this partner+student); `404 {error:'not_found'}`. POST runs `runSummaryForSession` and awaits up to 20 s (`Promise.race` with a timer; on timeout returns the current state, generation continues).
- Session-usage route: (a) when `auth.payload` is present, `studentId` and `sourcePartnerId` used for insert/update are `auth.payload.student_id` / `auth.payload.partner_id` (body values ignored; log once `[session-usage] identity from token`); (b) after the update, `if (body.status === 'completed') void runSummaryForSession(sessionId).catch((e) => console.warn('[learner-summary] completed hook failed', e))`.

- [ ] **Step 1: Failing route tests** (handlers imported directly as `scripts/test-portal-student-scoping.ts` does; secrets seam + summary deps seam with an in-memory session for partner `p1`, student `A`, sessionId `s1`): token for `A` GET `s1` → 200 with `state.status` and a `replayUrl` containing `/tutor-portal/replay?token=`; token for student `B` → 403 and the deps' `claim` never called; token without `student_id` → 401 `student_id_required`; unknown session → 404; POST with a fake model → 200 `state.status === 'ready'`.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** the route and the two session-usage edits. **Step 4: Run** → PASS; add the two regex pins to `test-session-usage-pool.ts`: the route source contains `auth.payload.student_id` on the identity line and `runSummaryForSession(` guarded by `body.status === 'completed'`. **Step 5: Commit** `feat(portal): learner-summary route (token-scoped GET/POST) + completed-save hook + identity from the embed token`.

### Task 5: Home page

**Files:**
- Create: `apps/tutor/src/app/tutor-portal/home/page.tsx` (server component), `apps/tutor/src/app/tutor-portal/home/LearnerSessionCard.tsx` (client), `apps/tutor/src/app/tutor-portal/home/home-rows.ts` (pure helpers)
- Test: `apps/tutor/scripts/test-learner-home.ts` (+ script entry)

**Interfaces:**
- Consumes: `verifyEmbedTokenAsync`; Task 2 `listLearnerSessions`, `runSummaryForSession`; Task 3 `signReplayToken`/`replayUrl`; `ExportSessionPDFButton` (props exactly as the replay page passes them; `whiteboardCommands` are the stored `{action, data}` rows); the replay page's `Refusal` pattern (copy the component locally, title "Your lessons are unavailable").
- Produces (pure, in `home-rows.ts`): `startLessonUrl(token: string): string` → `/tutor-portal/embed?token=${encodeURIComponent(token)}&return=home`; `rowLabel(row: LearnerSessionRow): { title: string; status: 'Completed'|'Ended early'; when: string }` (`Completed` iff `row.status === 'completed'`); `levelBadge(summary: SummaryState): string | null`.
- Page behaviour: verdict not ok or no `student_id` → Refusal; else rows = `listLearnerSessions(partner_id, student_id)`; for every row with `summary.status` `none`/`failed`-older-than-10-min → `void runSummaryForSession(id)` (fire-and-forget) and render as pending; each card gets a server-minted `replayUrl` (null → the button is hidden). Header: `student_name` or "Your lessons", lesson title from the first row's `topic` (or the token's `topic`), **Start a new lesson** button; empty state shows the Start button and one line "Your finished lessons will appear here with a summary, a replay and a PDF." Branding: `payload.branding?.primary_color` for the accent as the embed page does (`brandStyle`).
- `LearnerSessionCard` (client): props `{ row, replayUrl, token, pollUrl }`; shows date/status/duration, the level badge, the collapsed summary (level line + first recommendation), "Show full summary" expand (all sections, EN line then JA line in muted text); while `pending` polls `GET /api/tutor-portal/learner-summary?sessionId=…&token=…` every 3 s up to 60 s; `failed` shows "Summary not available — Retry" calling POST; buttons: "Replay with audio" (`row.hasAudio`) / "Replay" (new tab) and `ExportSessionPDFButton`.

- [ ] **Step 1: Failing tests:** `startLessonUrl('a b')` encodes; `rowLabel` status mapping; `levelBadge` null when `state.status !== 'ready'`; a source pin that `home/page.tsx` calls `listLearnerSessions(` with both `partner_id` and `student_id` and renders the Refusal when `student_id` is missing (regex, as the client-pin scripts do).
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** the three files. **Step 4: Run** → PASS; `tsc` clean. **Step 5: Commit** `feat(portal): /tutor-portal/home — Your lessons with summary, replay and PDF`.

### Task 6: End-of-lesson panel on the embed page

**Files:**
- Create: `apps/tutor/src/app/tutor-portal/embed/LessonSummaryPanel.tsx` (client)
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx:2321-2332` (the `sessionEnded` branch only)
- Test: `apps/tutor/scripts/test-learner-home.ts` (extend with embed pins)

**Interfaces:**
- Consumes: Task 4 route (POST once after mount, then GET every 2 s up to 30 s, then every 10 s up to 2 min); `ExportSessionPDFButton` with the in-memory `transcript` and `whiteboardCommands.map((x) => x.cmd)`; `useSearchParams().get('return') === 'home'` and the raw `embedToken` for the back link.
- Produces: `<LessonSummaryPanel sessionId token transcript whiteboardCommands studentName subject topic level sessionGoal productName showHomeLink />` rendered in place of the "Session Complete" card for partner sessions (`config.partner_id` present); non-partner embeds keep the old card.

- [ ] **Step 1: Failing pins:** `page.tsx` renders `LessonSummaryPanel` inside the `sessionEnded` branch and still contains the old "Session Complete" text for the non-partner case; the panel source contains the POST-then-GET sequence and the `return=home` check.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** The panel states: `pending` → "Preparing your summary…" with the two buttons already active; `ready` → the full summary; `failed` → Retry (POST). **Step 4: Run** → PASS; `tsc` clean; `npm run test:changed`. **Step 5: Commit** `feat(embed): end-of-lesson summary panel with replay, PDF and back-to-home`.

### Task 7: Minting, email draft, docs

**Files:**
- Modify: `docs/whitelabel/gdi/demo/mint-demo-links.js`, `docs/whitelabel/gdi/demo/mint.test.mjs`
- Create: `docs/whitelabel/gdi/email-testers-2026-11-05.md`
- Modify: `docs/superpowers/plans/2026-11-04-gdi-trial-day5-handoff.md` (a "Learner home" block: links file, pool step, open items)

**Interfaces:**
- Produces: `trial --home` prints `label\t<ORIGIN>/tutor-portal/home?token=…`; `--from <links file>` re-signs each line's existing payload (same `student_id`/claims, fresh `iat`/`exp`) instead of minting new ids; `--add james` appends a `james` row with a fresh `gdi-trial-james-<fresh>` id. Output written by the operator to `~/.evelyn/partners/gdi-trial.links.home.prod.txt` (not committed).

- [ ] **Step 1: Failing tests** in `mint.test.mjs`: `--home` URL path; `--from` keeps `student_id` and bumps `exp`; `--add james` row present.
- [ ] **Step 2: Run** `node docs/whitelabel/gdi/demo/mint.test.mjs` → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Write the email draft** (English, ~15 lines): five learner links (one per person, do not share a link), the shared 300-minute pool, Chrome/Edge + microphone + quiet room (from TESTER-GUIDE.md), every session is the same Work-projects lesson (the second one skips the level check), what they see afterwards (summary, replay with audio, PDF), who to contact. Leave the link placeholders `{{tester-1}}` … `{{james}}`.
- [ ] **Step 6: Handoff block + commit** `docs(gdi): home links minting (--home/--from/--add), tester email draft, handoff`.

---

## Deploy (operator, after the whole-branch review)

`npm run test:all` once (baseline failures only) → `./deploy-tutor-demo.sh` from the worktree → verify `BUILD_ID`, open one home link in Chrome (a tester with a past session shows the summary) → `partner-pool.sh set gdi-demo <used + 300>` → mint home links with `--from ~/.evelyn/partners/gdi-trial.links.prod.txt --add james --home` → fill the email.
