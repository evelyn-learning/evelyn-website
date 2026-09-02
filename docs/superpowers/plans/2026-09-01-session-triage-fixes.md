# Session-Triage Fixes (portal-85b2c632 + embed-1788187567764) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the seven orchestrator/perception issues diagnosed from two live sessions on 2026-09-01, without changing brain-model behavior (brain is Sonnet 5 + DeepSeek fallback — do not touch model config).

**Architecture:** All fixes are client-orchestrator (`VoiceTutorRealtime.tsx`) or small pure modules beside it. Each behavioral change is gated by a new env flag defaulting ON (`!== 'off'` — house rule), so any fix can be disabled in prod without a code change.

**Tech Stack:** Next.js/TS (apps/tutor), ts-node test scripts (`apps/tutor/scripts/test-*.ts` + entry in package.json), Playwright live probes.

**Spec:** The Findings section below IS the spec (no separate doc). Evidence source of truth: `evelyn.tutorsessions` docs for the two session ids + `[brain.stream]` pm2 log lines.

## Global Constraints

- **Read FIRST:** memory `project_tutor_session_handoff.md`, `project_four_session_protocol.md` (v3.5), `project_tutor_round7_architecture.md` (load-bearing guardrails — do not regress any listed item), `project_tutor_model_registry.md`.
- Work in a linked worktree of `/Users/luke/Dev/evelynlearning` (NEVER the repo root). `git rev-parse --git-dir` must contain `.git/worktrees/`.
- New tutor flags default **ON** via `process.env.X !== 'off'` (house rule; existing `=== 'on'` flags stay as they are).
- Prompts and notes must stay **generic** — never subject-specific examples (feedback rule).
- `VoiceTutorRealtime.tsx` (~19K lines) is a guardrail minefield: read the 50 surrounding lines before every edit; add new guardrails, never loosen round-1–7 ones.
- Gate before deploy: `npx tsc --noEmit` clean + `npm run test:all` (KNOWN pre-existing failures, NOT yours: `test:embed-token` [gate-fixture], `test:verdict-guard` "non-answer branch", `test:pedagogy-posed-problem`, `test:pedagogy-d1`) + `npm run build:tutor`.
- Deploy per protocol: announce to peers before/after, `./deploy-tutor.sh` from the worktree, verify with two checks that fail differently (anchored `^KEY=` env grep with a bogus-key control + a round-unique literal in the served bundle with a present-control), then `git push origin HEAD:main` (main == prod, both directions).
- The demo-gate allowlisted IP `157.131.199.237` skips demo quotas for live probes; probe drivers pattern: `apps/tutor/scripts/live-observe-brain.ts`.

---

## Findings (the spec)

### Session `portal-85b2c632-df76-4970-beea-528047a21687` (Algebra 1, 2026-09-01 04:10–04:28 UTC)

| # | Time (UTC) | Evidence | Diagnosis |
|---|---|---|---|
| A | 04:15:45, 04:17:48 | `false_assertion_kill :: x=-5 verified=4`; `board_anchor_flagged :: question with no board write` at 04:17:20 + 04:18:50; 10s and 38s dead air | Brain posed a SPOKEN side-problem (−3x=15, answer −5) without boarding it; the false-assertion validator graded against the stale active-problem anchor (answer 4) and **killed a correct assertion**. (The 04:17:48 kill of `x=16` was legitimate — keep that protection.) |
| B | 04:22:27 | `render_dropped :: showProblem — duplicate`, `dedup_surfaced_as_rejection :: show_segment_card → worked-two-step`, `judge_kill_snapshot :: 1 unplayed`, retry, `judge_kill_resume_diverged :: held=1`; T47 opens mid-thought referencing an un-introduced problem | A `show_segment_card` duplicating the card ALREADY ACTIVE on the board was surfaced as a kill+rejection instead of a silent drop → retry → divergent resume. |
| C | 04:27:22 | `judge_correction_note_timeout :: undelivered 20000ms — volunteering the correction`; student had said "I'm just doing mental math" at 04:27:38; `dispatch_dropped_mid_utterance :: X equals 8.` | The 20s correction-note deadline fired during student-declared think time, so the tutor volunteered intermediate steps mid-think. |
| D | 04:17:34→04:18:12 | 38s student-facing silence | Downstream cost of A (kill→judge→regenerate). Fixing A removes the worst case; no separate task. |

### Session `embed-1788187567764` (Grade 3 demo, 2026-08-31 16:46–16:48 UTC)

| # | Time (UTC) | Evidence | Diagnosis |
|---|---|---|---|
| E | 16:47:15→16:47:20 | S6 "…what is the topic? No, no, stop…" + S7 "what is the topic" dispatched as two turns; T8 AND T9 answer the same question 1s apart | Two student turns split from one utterance stream each got a full brain answer — no coalescing/supersede of a queued second turn. |
| F | 16:46:33–35 | `perception_cancel_suppressed_opening` ×3; classifier heuristic ALREADY said `barge_in:speaking + question shape ≥3w`; `cover_liveness` spoke over the student | During the opening turn all cancels are suppressed (2026-07-04 phantom-echo guard) — even when a REAL ≥3-word non-echo transcript proves it's not noise. |
| G | 16:47:06 | `perception_cancel_storm_suppressed` ×2 while the student was saying stop-words | The cancel-storm governor (anti-flapping) swallowed legitimate stop-imperative cancels. |
| H | 16:46:44 | `perception_noise_dropped :: Hello.` | Noise gate discarded a genuine greeting while the student was trying to establish contact. LOW priority. |

Code anchors (verified 2026-09-01; re-grep before editing — lines drift):
- False-assertion kill branch: `VoiceTutorRealtime.tsx:~10759-10777` (`checkFalseFinalAssertion`, `TUTOR_FALSE_ASSERTION_KILL`).
- Board-anchor note plant: `VoiceTutorRealtime.tsx:~13799-13806` (`pendingBoardAnchorNoteRef`, `TUTOR_BOARD_ANCHOR_NET`).
- Dedup-rejection branch: `VoiceTutorRealtime.tsx:~12500-12525` (`dedup_surfaced_as_rejection`, `activeIsOffSegment`, `askedForAnother`, `performKill()`).
- Correction-note timeout: `VoiceTutorRealtime.tsx:~3225-3250` (`CORRECTION_NOTE_TIMEOUT_MS`, `busy` check, `CORRECTION_DUE_DIRECTIVE`).
- Perception dispatch: `VoiceTutorRealtime.tsx:~17255-17275` (`perception_direct_dispatch`, `perceptionDispatchDeduperRef`); busy-path in `handleStudentTranscriptForBrain`.
- Opening suppression: retro path `~16385-16395` (`openingTurnFullyDelivered()`, def at `~16305`), onset path `~17810-17825` (`OPENER_BARGEIN_SUSTAIN_MS` deferred-fire).
- Cancel storm: `src/lib/tutor/voice/cancel-storm.ts:24` (`CancelStormGovernor`), call sites VTR `~16416` + `~17471`.
- Noise drop: `VoiceTutorRealtime.tsx:~16855`.
- Flags live in `src/lib/tutor/orchestrator/flags.ts` — follow its existing declaration style.

---

### Task 1: Stale-anchor downgrade for the false-assertion kill (Issue A)

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (false-assertion branch ~10759; turn-start bookkeeping near where `rejectionsThisAttempt` resets)
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts` (new flag)

**Interfaces:**
- Consumes: `pendingBoardAnchorNoteRef` (existing ref, planted when a substantive question had no board write), `checkFalseFinalAssertion(...)` (unchanged).
- Produces: debug event `'false_assertion_downgraded_stale_anchor'`; flag `TUTOR_FA_STALE_ANCHOR_DOWNGRADE` (default ON).

- [ ] **Step 1: Add the flag** in `flags.ts`, matching neighboring declarations:

```ts
/** Issue-A fix (portal-85b2c632, 2026-09-01): when the previous turn posed a
 *  question with NO board write (board-anchor note planted), the active-problem
 *  anchor is suspect — downgrade a false-assertion KILL to an advisory log so a
 *  correct answer to the spoken side-question isn't killed against a stale
 *  anchor. Default ON. */
export const TUTOR_FA_STALE_ANCHOR_DOWNGRADE = process.env.NEXT_PUBLIC_TUTOR_FA_STALE_ANCHOR_DOWNGRADE !== 'off';
```

- [ ] **Step 2: Capture anchor-suspicion at turn start.** In VTR, at the top of the brain-turn processing (same scope where the false-assertion branch runs; find where the turn's attempt loop begins and per-turn refs are read), add:

```ts
// Issue A: a board-anchor note pending at turn start means last turn asked a
// question that was never boarded — the active-problem anchor may not be the
// question the student is answering.
const anchorSuspectThisTurn = pendingBoardAnchorNoteRef.current != null;
```

Read the surrounding block first; place it where `currentProblemRef` is already in scope and it evaluates once per turn (not per sentence).

- [ ] **Step 3: Downgrade instead of kill.** In the false-assertion branch (the `if (fa.verdict === 'false_assertion')` block), wrap the kill:

```ts
if (fa.verdict === 'false_assertion') {
  if (TUTOR_FA_STALE_ANCHOR_DOWNGRADE && anchorSuspectThisTurn) {
    console.warn(`[brain-orchestrator] false-assertion DOWNGRADED (stale anchor — unboarded question last turn): ${fa.answerVar}=${fa.asserted} vs verified ${fa.expected}`);
    onDebugEvent?.('false_assertion_downgraded_stale_anchor', `${fa.answerVar}=${fa.asserted} verified=${fa.expected?.slice(0, 40)}`);
  } else {
    // …existing reason/push/performKill/continue block UNCHANGED…
  }
}
```

Do NOT touch the legitimate-kill path (the `x=16 verified=4` class must still kill).

- [ ] **Step 4: Typecheck.** Run from `apps/tutor`: `npx tsc --noEmit`. Expected: clean.
- [ ] **Step 5: Commit** `git add apps/tutor && git commit -m "fix(tutor): downgrade false-assertion kill when the active-problem anchor is stale (unboarded question)"`.

### Task 2: Silent-drop duplicate-of-ACTIVE segment card (Issue B)

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (~12500-12525)
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`

**Interfaces:**
- Consumes: the dedup branch's existing locals `name`, `segId`, `activeIsOffSegment`, `askedForAnother`, `noProblemObserved`, and the active-card identity (read the block: the active statement/segment is already computed for `activeIsOffSegment`).
- Produces: debug event `'dedup_silent_dropped_active'`; flag `TUTOR_DEDUP_ACTIVE_SILENT` (default ON).

- [ ] **Step 1: Add flag** `TUTOR_DEDUP_ACTIVE_SILENT = process.env.NEXT_PUBLIC_TUTOR_DEDUP_ACTIVE_SILENT !== 'off'` with a comment citing Issue B (duplicate of the card the student is ALREADY looking at → round-7 silent-drop semantics; kill+retry caused a divergent resume at 04:22:27).

- [ ] **Step 2: Insert the silent branch** at the TOP of the dedup-rejection block, before the `reason` construction (read the block first; the duplicate-of-active condition is: NOT `askedForAnother`, NOT `activeIsOffSegment`, NOT `noProblemObserved`, and the suppressed card's `segId` matches the active board card's segment — the block already knows the duplicate target; reuse its variables, do not invent new lookups):

```ts
if (TUTOR_DEDUP_ACTIVE_SILENT && !askedForAnother && !activeIsOffSegment && !noProblemObserved) {
  // The duplicate IS the card the student is looking at — speech stays
  // coherent against it. Round-7 semantics: silent drop, no kill, no retry.
  console.warn(`[brain-orchestrator] dedup silent-drop (duplicate of active card): ${name} → ${segId}`);
  onDebugEvent?.('dedup_silent_dropped_active', `${name} → ${segId}`);
  continue;
}
```

- [ ] **Step 3: Typecheck** `npx tsc --noEmit` → clean.
- [ ] **Step 4: Commit** `git commit -m "fix(tutor): silent-drop segment-card duplicate of the active board card instead of kill+retry"`.

### Task 3: Correction-note timeout respects declared think-time (Issue C)

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (timeout `busy` check ~3228; student-transcript ingress — the handler that appends student turns to the transcript)
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`

**Interfaces:**
- Produces: ref `studentThinkTimeUntilRef: MutableRefObject<number>`; debug events `'think_time_hold_set'` / consumed implicitly; flag `TUTOR_THINK_TIME_HOLD` (default ON).

- [ ] **Step 1: Add flag** `TUTOR_THINK_TIME_HOLD = process.env.NEXT_PUBLIC_TUTOR_THINK_TIME_HOLD !== 'off'`.

- [ ] **Step 2: Add the ref + detector.** Near the other perception refs (follow local idiom):

```ts
/** Issue C: epoch-ms until which the student has claimed think time
 *  ("give me a minute", "doing mental math"). Holds the correction-note
 *  volunteer timer; cleared by any substantive student turn. */
const studentThinkTimeUntilRef = useRef(0);
const THINK_TIME_HOLD_MS = 60_000;
const thinkTimeRe = /\b(give me a (?:minute|min|sec|second|moment)|let me think|(?:i'?m )?(?:just )?thinking|mental math|hold on a (?:sec|second|minute)|one (?:sec|second|minute|moment)|just a (?:sec|second|minute|moment))\b/i;
```

In the student-transcript ingress path (where a final student utterance is accepted as a turn — the same place `lastStudentText`-style state updates; read it first):

```ts
if (TUTOR_THINK_TIME_HOLD) {
  if (thinkTimeRe.test(studentText)) {
    studentThinkTimeUntilRef.current = Date.now() + THINK_TIME_HOLD_MS;
    onDebugEvent?.('think_time_hold_set', studentText.slice(0, 60));
  } else if (studentText.trim().split(/\s+/).length >= 3 || /\d/.test(studentText)) {
    studentThinkTimeUntilRef.current = 0; // substantive turn ends the hold
  }
}
```

- [ ] **Step 3: Honor it in the timeout.** In the correction-note `fire()` at ~3228, extend the existing `busy` disjunction:

```ts
const busy =
  productionStateRef.current === 'speaking' ||
  brainBusyRef.current ||
  perceptionMidUtteranceRef.current ||
  studentTypingRef.current ||
  (TUTOR_THINK_TIME_HOLD && Date.now() < studentThinkTimeUntilRef.current);
```

(The existing busy path already re-arms the timer — no other change.)

- [ ] **Step 4: Typecheck** → clean. **Step 5: Commit** `git commit -m "fix(tutor): correction-note volunteer timer holds during student-declared think time"`.

### Task 4: Coalesce rapid double student turns (Issue E)

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (perception direct-dispatch ~17255 AND the busy-queue path inside `handleStudentTranscriptForBrain` — grep `queues behind` / read how a transcript arriving while `brainBusyRef.current` is handled)
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`

**Interfaces:**
- Produces: debug event `'student_turn_coalesced'`; flag `TUTOR_TURN_COALESCE` (default ON); constant `TURN_COALESCE_MS = 5000`.

- [ ] **Step 1: Read the busy path.** Establish exactly what happens today when a student transcript arrives while a brain turn is in flight (evidence says: it queues and later dispatches as a SECOND full turn — T8+T9 answered 1s apart). Write down the queue variable names before editing.

- [ ] **Step 2: Add flag** `TUTOR_TURN_COALESCE = process.env.NEXT_PUBLIC_TUTOR_TURN_COALESCE !== 'off'`.

- [ ] **Step 3: Coalesce.** In the queue path: if a queued (not-yet-dispatched) student utterance exists and the new final arrives within `TURN_COALESCE_MS` of it, MERGE instead of enqueueing a second entry:

```ts
// Issue E (embed-1788187567764): two finals split from one utterance stream
// each got a full brain answer. Merge rapid successors into ONE queued turn.
if (TUTOR_TURN_COALESCE && queued && Date.now() - queued.at < TURN_COALESCE_MS) {
  queued.text = `${queued.text} ${newText}`.trim();
  queued.at = Date.now();
  onDebugEvent?.('student_turn_coalesced', queued.text.slice(0, 80));
  return;
}
```

Adapt `queued`'s shape to the real queue structure found in Step 1 (if the queue stores plain strings, wrap with a timestamp; keep the change minimal). Do NOT kill the in-flight turn here — that path is Issue G's territory and killing on new_turn regressed before (see the E1 lazy-cancel comments in the file).

- [ ] **Step 4: Typecheck** → clean. **Step 5: Commit** `git commit -m "fix(tutor): coalesce rapid successive student finals into one queued brain turn"`.

### Task 5: Opening-turn barge-in escape on a real transcript (Issue F)

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (retro path ~16385, onset path ~17810 — read both blocks AND `openingTurnFullyDelivered()` at ~16305 first)
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts`

**Interfaces:**
- Produces: helper `openerBargeEscape(text: string): boolean`; debug event `'perception_opening_bargein_escape'`; flag `TUTOR_OPENING_BARGEIN_ESCAPE` (default ON).

- [ ] **Step 1: Add flag** + helper near `openingTurnFullyDelivered`:

```ts
/** Issue F (embed-1788187567764): during the opening turn every cancel was
 *  suppressed (2026-07-04 phantom-echo guard) even when the student produced a
 *  real multi-word utterance. A ≥3-word transcript that is NOT a substring of
 *  the opener's own text is a human, not echo/noise — allow the cancel.
 *  The echo check is what keeps the 2026-07-04 guard's protection: phantom
 *  self-echo transcripts repeat the opener's words. */
const openerBargeEscape = useCallback((text: string): boolean => {
  if (!TUTOR_OPENING_BARGEIN_ESCAPE) return false;
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  const openerText = (openingTurnTextRef.current ?? '').toLowerCase();
  return !openerText.includes(text.trim().toLowerCase());
}, []);
```

If no ref holding the opener's spoken text exists, add `openingTurnTextRef` populated where the opener's sentences are emitted (find where the opening turn's text accumulates — the `openingTurnFullyDelivered` machinery tracks the same turn; ~10 lines).

- [ ] **Step 2: Wire the retro path** (~16391). The suppression currently `return`s unconditionally when `!openingTurnFullyDelivered()`. Change to consult the escape using the most recent perception transcript (the retro path runs on state transitions — pass the latest interim/final text available in that scope; read the block to find it, e.g. the last value seen by `perceptionOnTranscript`; if none is in scope, keep a small `lastPerceptionTextRef` updated in the transcript handler):

```ts
if (!openingTurnFullyDelivered()) {
  if (openerBargeEscape(lastPerceptionTextRef.current)) {
    onDebugEvent?.('perception_opening_bargein_escape', lastPerceptionTextRef.current.slice(0, 60));
    // fall through to the normal cancel path below
  } else {
    console.warn('[PERCEPTION] retro-cancel suppressed — opening turn not yet delivered');
    onDebugEvent?.('perception_cancel_suppressed_opening', `→${toState}`);
    return;
  }
}
```

- [ ] **Step 3: Wire the onset path** (~17820, the `else` that logs `cancel suppressed — opening turn not yet delivered`): same shape — escape → proceed to the kill the deferred-fire branch would have performed (`runPerceptionKill('speaking')`), else keep the existing suppression.

- [ ] **Step 4: Regression guard.** Re-read the 2026-07-04 comment ("phantom self-echo transcripts were cancelling the long teacher-intro opener") and confirm the echo-substring check covers it: a self-echo transcript IS a substring of the opener → escape returns false → still suppressed. State this in the commit message.

- [ ] **Step 5: Typecheck** → clean. **Step 6: Commit** `git commit -m "fix(tutor): opening turn yields to a real multi-word non-echo barge-in (escape hatch on the 2026-07-04 guard)"`.

### Task 6: Stop-imperative bypass for the cancel-storm governor (Issue G)

**Files:**
- Modify: `apps/tutor/src/lib/tutor/voice/cancel-storm.ts`
- Test: `apps/tutor/scripts/test-cancel-storm.ts` (create if absent; if a test for this class already exists, extend it) + package.json `test:cancel-storm` entry + add to `scripts/run-all-tests.mjs`
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (both `allowCancel` call sites ~16416, ~17471)

**Interfaces:**
- Produces: `CancelStormGovernor.allowCancel(nowMs: number, opts?: { stopImperative?: boolean }): boolean` (backward-compatible optional second arg); exported `STOP_IMPERATIVE_RE`.

- [ ] **Step 1: Write the failing test** (follow the assert style of e.g. `scripts/test-demo-gate.ts`):

```ts
import { CancelStormGovernor, STOP_IMPERATIVE_RE } from '@/lib/tutor/voice/cancel-storm';

// storm state: exhaust the governor, then assert a stop-imperative still passes
const g = new CancelStormGovernor();
let t = 1_000_000;
while (g.allowCancel(t)) t += 100; // drive it into suppression
if (g.allowCancel(t)) throw new Error('expected storm suppression');
if (!g.allowCancel(t, { stopImperative: true })) throw new Error('stop imperative must bypass the storm governor');
for (const s of ['stop', 'No, no, stop.', 'wait wait', 'hold on', 'pause please']) {
  if (!STOP_IMPERATIVE_RE.test(s)) throw new Error(`should match: ${s}`);
}
for (const s of ['the bus stop is far', 'stopwatch', 'I can’t wait for class']) {
  if (STOP_IMPERATIVE_RE.test(s)) throw new Error(`should NOT match: ${s}`);
}
console.log('cancel-storm: all assertions passed');
```

Note the negative cases: `\b` boundaries + word-form checks; tune the regex until all pass.

- [ ] **Step 2: Run it, expect failure** (`STOP_IMPERATIVE_RE` not exported yet).
- [ ] **Step 3: Implement** in `cancel-storm.ts`:

```ts
/** Issue G (embed-1788187567764): explicit stop imperatives must never be
 *  storm-suppressed — a student shouting "stop" while the storm breaker is
 *  engaged is exactly the moment the breaker exists to protect, inverted. */
export const STOP_IMPERATIVE_RE = /(?:^|\s)(?:stop|wait|pause|hold on|be quiet|quiet|shush)\b[.!,]?(?:\s|$)/i;
```

and in `allowCancel(nowMs: number, opts?: { stopImperative?: boolean }): boolean`, first line: `if (opts?.stopImperative) return true;` (do not record the bypassed cancel into the storm window — read the class internals and keep its bookkeeping consistent).

- [ ] **Step 4: Run the test → PASS.**
- [ ] **Step 5: Wire the call sites.** At both VTR `allowCancel(Date.now())` sites, pass the latest perception transcript through the regex (same `lastPerceptionTextRef` / in-scope transcript as Task 5):

```ts
if (!cancelStormRef.current.allowCancel(Date.now(), { stopImperative: STOP_IMPERATIVE_RE.test(lastPerceptionTextRef.current) })) {
```

- [ ] **Step 6: Typecheck + test** → clean/PASS. **Step 7: Commit** `git commit -m "fix(tutor): stop-imperative transcripts bypass the cancel-storm governor"`.

### Task 7: Greeting exception in the perception noise gate (Issue H — smallest, do last)

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (~16855)

- [ ] **Step 1: Read the noise-drop block** (~16840-16860) to learn why "Hello." was classified noise (likely a short-utterance/filler gate).
- [ ] **Step 2: Exempt greetings before first real turn:** when the session has no accepted student turn yet, `/^(hello|hi|hey)[.!?]?$/i` passes the gate as a real turn instead of being dropped. Guard with the existing `TUTOR_*` flag style only if the block is flag-gated; otherwise inline with a dated comment citing Issue H. Keep the drop for every other case.
- [ ] **Step 3: Typecheck → commit** `git commit -m "fix(tutor): greeting words pass the noise gate before the first accepted student turn"`.

### Task 8: Gate, deploy, verify live

- [ ] **Step 1:** `npx tsc --noEmit` clean; `npm run test:all` — only the four KNOWN pre-existing failures (listed in Global Constraints); `npm run build:tutor` exit 0.
- [ ] **Step 2:** Merge `origin/main` into the worktree branch, re-run the gate if the merge was not a no-op.
- [ ] **Step 3:** Announce to live peers (ListAgents → SendMessage), run `./deploy-tutor.sh` from the worktree, confirm "Deployment completed successfully", new BUILD_ID, pm2 `evelyn-tutor` online.
- [ ] **Step 4:** Two-check verify: served-bundle grep for a round-unique literal (e.g. `dedup_silent_dropped_active`) with a bogus-literal control; env untouched this round (no env edits — confirm `grep -cE '^TUTOR_BRAIN_MODEL=claude-sonnet-5$'` still 1).
- [ ] **Step 5:** `git push origin HEAD:main`; confirm `main` == deployed sha.
- [ ] **Step 6: Live probes** (allowlisted IP; driver pattern `scripts/live-observe-brain.ts`):
  - Issue A probe: drive a session where the tutor is asked a side question verbally, then answer it correctly; assert NO `false_assertion_kill` against the side answer (event `false_assertion_downgraded_stale_anchor` acceptable) and no 30s+ gaps.
  - Issue B probe: ask "show me that problem again"; assert `dedup_silent_dropped_active` fires with no retry cascade in the transcript.
  - Issue C probe: answer a question wrong, then say "hold on, I'm just doing mental math"; assert no tutor turn for ≥20s and `think_time_hold_set` present.
  - Issues E/F/G need real audio: they cannot be driven by the typed-input harness. Verify mechanically instead: session debugEvents after Praveen's next voice session should show `perception_opening_bargein_escape` / `student_turn_coalesced` / absence of `perception_cancel_storm_suppressed` during stop-imperatives. Tell Praveen the barge-in fixes await his voice-session confirmation.
- [ ] **Step 7:** Update memory: append outcome to `project_tutor_session_handoff.md` (new dated section, description frontmatter too) and a new round file if the session ends; note any regressions observed.

## Self-Review (completed 2026-09-01)

- Spec coverage: A→T1, B→T2, C→T3, D→absorbed by T1 (stated), E→T4, F→T5, G→T6, H→T7, deploy/verify→T8. No gaps.
- Placeholders: none — every step carries code or an exact locate-and-adapt instruction with the expected shape; Tasks 4/5 explicitly require reading the anchored block first because queue/ref names must come from the live file, not this plan.
- Type consistency: `lastPerceptionTextRef` is introduced in Task 5 Step 2 and reused in Task 6 Step 5 (same name); `STOP_IMPERATIVE_RE` exported in T6 Step 3 and consumed in T6 Step 5; flags all follow `!== 'off'`.
