# Tutor R34 — Demo UX (End-confirm, Incomplete-utterance Hold, Manual Mic)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One accidental click can no longer end a session; a mid-sentence hesitation can no longer truncate a student's turn; students who want it can end their turns manually.

**Architecture:** (1) The End/Pause controls gain a two-tap confirm (pure UI, unflagged). (2) A new pure module `utterance-hold.ts` decides when a finalized transcript looks cut-off (dangling function word) and VTR holds it ~1.4s to merge with resumed speech (flag `NEXT_PUBLIC_TUTOR_INCOMPLETE_HOLD`). (3) An opt-in per-device "Manual mic" mode buffers finalized transcripts instead of dispatching, until the student taps send (flag `NEXT_PUBLIC_TUTOR_MANUAL_MIC` gates availability; mode itself is a student toggle). Grounded in trial session portal-d9bacb7e (2026-07-26): transcript cut at "Could you give me a"; End/Pause click silenced TTS *and* terminally ended a 38s demo.

**Tech Stack:** TypeScript, Next.js client components, `scripts/test-*.ts` + `check()` harness via `npx tsx`, Ink2/Cartesia STT.

## Global Constraints

- NOTE: the 2026-07-25 roadmap doc reserved "R34" for silence-audit leftovers (reconnect budget, AudioContext, bfcache, save durability) — those move to R35; THIS round is R34 in the live-test ledger.
- VTR (`src/app/tutor/components/VoiceTutorRealtime.tsx`, ~16k lines) line anchors below are from the 2026-07-26 exploration — ALWAYS verify by searching the quoted code before editing.
- New env flags go into `.env.local` AND `.env.local.production` with comments (deploy-update.sh now ships `.env.local.production` to the server automatically — no manual server edit).
- Pure modules: no I/O, no React, deterministic; tests exact.
- The confirm step must not slow down a *deliberate* end: two taps within the window, no modal, no layout jump that moves the button out from under the pointer.
- Manual-mic scope guard: manual mode changes ONLY the plain-listening dispatch path (student composing their own turn). Barge-in kills, perception verdicts, and RESTORE machinery while the tutor is processing/speaking stay EXACTLY as today.
- Deploy is `./deploy-update.sh`, user-gated (Task 5).

## File Structure

- Create `src/lib/tutor/voice/utterance-hold.ts` — pure: `endsMidThought`, `mergeHeldTranscript`, `HOLD_MS`.
- Create `scripts/test-utterance-hold.ts` (+ package.json script `test:utterance-hold`).
- Modify `src/app/tutor/components/TutorSession.tsx` (endControl, ~:802-815) — confirm step.
- Modify `src/app/tutor/components/VoiceTutorRealtime.tsx` — internal End button confirm (~:15689-15705), incomplete-hold wiring, manual-mic mode.
- Modify `src/lib/tutor/orchestrator/flags.ts` — `TUTOR_INCOMPLETE_HOLD`, `TUTOR_MANUAL_MIC`.
- Modify `.env.local`, `.env.local.production` — both flags, commented.
- Modify the ⋯ adaptive menu component (pace/difficulty chips live there — locate by searching the pace chip labels) — "Mic: Auto/Manual" row.

---

### Task 1: End-button two-tap confirm (unflagged)

**Files:**
- Modify: `src/app/tutor/components/TutorSession.tsx` (endControl builder — anchor: the red pill labeled "End / Pause" whose onClick calls `h.endSession()`, ~:802-815)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (internal End/Pause button — anchor: the `onEndSession && !hideEndButton` block, ~:15689-15705)

**Interfaces:**
- Produces: both end controls require two clicks within 3s. First click: label swaps to "End session?" (pill turns solid red / clearly armed), a 3s timer re-disarms. Second click while armed: existing end path runs unchanged. No new props.

- [ ] **Step 1: TutorSession endControl.** Add component state `const [endArmed, setEndArmed] = useState(false)` + `endArmTimerRef`. onClick:

```tsx
onClick={() => {
  if (!endArmed) {
    setEndArmed(true);
    if (endArmTimerRef.current) clearTimeout(endArmTimerRef.current);
    // 3s to confirm; disarm quietly if the student hesitates. Guards the
    // 2026-07-26 trial failure: one stray tap ended a 38s demo terminally.
    endArmTimerRef.current = setTimeout(() => setEndArmed(false), 3000);
    return;
  }
  if (endArmTimerRef.current) { clearTimeout(endArmTimerRef.current); endArmTimerRef.current = null; }
  setEndArmed(false);
  h.endSession(); // exact existing call — read the current handler and keep it verbatim
}}
```

Label/title: armed ? "End session?" : existing label; keep the LogOut icon and pill geometry IDENTICAL between states (only color/text change) so the second tap lands on the same hit target. Clear the timer on unmount (add to an existing cleanup effect in the same component or a tiny `useEffect` return).

- [ ] **Step 2: VTR internal End button** (used on /tutor where `hideEndButton` is false): same pattern, same 3s window, local state near the button (or shared refs at component scope following VTR conventions). Keep the existing click handler body as the armed-branch action, verbatim.

- [ ] **Step 3: Typecheck** (`npx tsc --noEmit`) + manual dev check on /tutor: first click arms + auto-disarms after 3s without ending; double-click ends. (This is a UI-only task — no harness test exists for these components; note the manual check result in your report.)

- [ ] **Step 4: Commit** — `git commit -m "fix(tutor): End/Pause requires a two-tap confirm (R34 T1)"`

---

### Task 2: utterance-hold pure module

**Files:**
- Create: `src/lib/tutor/voice/utterance-hold.ts`
- Create: `scripts/test-utterance-hold.ts`
- Modify: `package.json` (`"test:utterance-hold": "npx tsx scripts/test-utterance-hold.ts"`)

**Interfaces:**
- Produces: `endsMidThought(transcript: string): boolean`, `mergeHeldTranscript(held: string, next: string): string`, `HOLD_MS = 1400`. Task 3 consumes all three.

- [ ] **Step 1: Failing tests** (`scripts/test-utterance-hold.ts`, `check()` harness style copied from `scripts/test-cover-layer.ts`):

```ts
import { endsMidThought, mergeHeldTranscript, HOLD_MS } from '../src/lib/tutor/voice/utterance-hold';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

check('hold-ms', HOLD_MS === 1400);
// The live truncation: "Could you give me a" (session portal-d9bacb7e).
check('dangling-article', endsMidThought('Could you give me a') === true);
check('dangling-article-period', endsMidThought('Could you give me a.') === true);
check('dangling-the', endsMidThought('What about the') === true);
check('dangling-to', endsMidThought('I want to') === true);
check('dangling-of', endsMidThought('the derivative of') === true);
check('dangling-and', endsMidThought('mean is 14 and') === true);
check('dangling-my', endsMidThought('can you check my') === true);
// Complete thoughts must NOT hold:
check('complete-question', endsMidThought('Could you give me a hint?') === false);
check('complete-number', endsMidThought('The answer is 14.') === false);
check('complete-yes', endsMidThought('Yeah, makes sense.') === false);
check('single-word-a-is-not-held', endsMidThought('a') === false); // bare noise, not a cut sentence
check('empty', endsMidThought('') === false);
check('synthetic-never', endsMidThought('[start lesson]') === false);
// "so" / "because" trail off mid-reasoning:
check('dangling-so', endsMidThought('I multiplied by five so') === true);
check('dangling-because', endsMidThought('the median stays because') === true);
// merge: single space, trims, drops the held text's trailing period.
check('merge-basic', mergeHeldTranscript('Could you give me a', 'harder problem?') === 'Could you give me a harder problem?');
check('merge-period', mergeHeldTranscript('Could you give me a.', 'harder problem?') === 'Could you give me a harder problem?');
check('merge-trim', mergeHeldTranscript(' I want to ', ' try again. ') === 'I want to try again.');
// Complete utterances that USED to false-positive (review round 1):
check('question-stranded-prep', endsMidThought('What page is it on?') === false);
check('question-converge-to', endsMidThought('What does it converge to?') === false);
check('complete-demonstrative', endsMidThought('Can you explain that') === false);
check('complete-pronoun', endsMidThought('I already tried this') === false);
check('complete-over', endsMidThought('The test is over') === false);
// Un-punctuated dangling articles still hold:
check('dangling-the-no-punct', endsMidThought('what about the') === true);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all utterance-hold checks passed');
```

- [ ] **Step 2: Run, confirm module-not-found failure.**

- [ ] **Step 3: Implement:**

```ts
/**
 * Incomplete-utterance hold (R34) — Ink2's semantic endpointing sometimes
 * finalizes a turn on a mid-sentence hesitation (live: "Could you give me a",
 * session portal-d9bacb7e). turn.end is irrevocable upstream, so the client
 * holds a transcript that ENDS ON A DANGLING FUNCTION WORD for HOLD_MS,
 * merging it with the student's resumed speech instead of dispatching a
 * fragment the brain will answer wrongly.
 *
 * Conservative by construction: contains only words that are rare sentence-final
 * in complete STATEMENTS (articles, subjunct prepositions, linking auxiliaries).
 * Questions are EXEMPTED wholesale: English strands prepositions constantly at
 * question end ("what does it converge to?"). Tradeoff: a rare complete statement
 * ending in a kept word costs one HOLD_MS of latency, never data loss.
 */
export const HOLD_MS = 1400;

const DANGLING_WORDS = new Set([
  // articles / determiners (articles almost never end statements)
  'a', 'an', 'the', 'my', 'your', 'their', 'our',
  // prepositions that require objects (cannot end statements)
  'to', 'of', 'into',
  // conjunctions / trail-offs (never end well-formed statements)
  'and', 'or', 'but', 'so', 'because', 'if', 'when', 'while', 'than',
  // auxiliaries that never end a real turn
  'is', 'are', 'was', 'were', 'be', 'been',
]);

export function endsMidThought(transcript: string): boolean {
  const t = transcript.trim();
  if (!t || t.startsWith('[')) return false;
  // Questions are exempt (English routinely strands prepositions at question end)
  if (t.endsWith('?')) return false;
  const words = t.toLowerCase().replace(/[.,!?;:]+$/g, '').split(/\s+/).filter(Boolean);
  if (words.length < 2) return false; // a bare "a"/"the" is noise, not a cut sentence
  return DANGLING_WORDS.has(words[words.length - 1]);
}

export function mergeHeldTranscript(held: string, next: string): string {
  const left = held.trim().replace(/[.]+$/g, '').trim();
  const right = next.trim();
  return `${left} ${right}`.trim();
}
```

- [ ] **Step 4: Run tests — all pass. Iterate the word list ONLY if a listed test fails; never edit test expectations.**

- [ ] **Step 5: Commit** — `git commit -m "feat(tutor): utterance-hold pure module — dangling-word detection + merge (R34 T2)"`

---

### Task 3: Incomplete-hold VTR wiring (flag `TUTOR_INCOMPLETE_HOLD`)

**Files:**
- Modify: `src/lib/tutor/orchestrator/flags.ts` (after `TUTOR_COVER_V2`):

```ts
// R34: hold a finalized transcript that ends on a dangling function word
// ("give me a…") for HOLD_MS and merge with resumed speech — Ink2's
// endpointer sometimes cuts mid-hesitation. Default OFF.
export const TUTOR_INCOMPLETE_HOLD =
  process.env.NEXT_PUBLIC_TUTOR_INCOMPLETE_HOLD === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_INCOMPLETE_HOLD === 'true';
```

- Modify: `.env.local` + `.env.local.production`: `NEXT_PUBLIC_TUTOR_INCOMPLETE_HOLD=on` with a one-line comment.
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — the shared perception transcript handler (anchor: the muted-drop branch emitting `perception_dropped_muted` and the noise-drop branch from R32 Task 8, ~:13283-13305; the hold goes at the TOP of that handler, before mute/noise handling).

**Interfaces:**
- Consumes: `endsMidThought`, `mergeHeldTranscript`, `HOLD_MS` (Task 2); the handler's transcript param and its downstream processing call.
- Produces: `heldTranscriptRef` used only here; debug events `transcript_held`, `transcript_merged`, `transcript_hold_flushed`.

- [ ] **Step 1: Wire the hold.** New refs near the handler: `heldTranscriptRef = useRef<{ text: string; timer: ReturnType<typeof setTimeout> } | null>(null)`. At the handler top (after synthetic/empty guards, BEFORE mute/noise branches — read the real order and place so held+merged text flows through the FULL existing pipeline when released):

```ts
if (TUTOR_INCOMPLETE_HOLD) {
  // Merge a resumed thought into the held fragment first.
  if (heldTranscriptRef.current) {
    clearTimeout(heldTranscriptRef.current.timer);
    transcript = mergeHeldTranscript(heldTranscriptRef.current.text, transcript);
    heldTranscriptRef.current = null;
    onDebugEvent?.('transcript_merged', transcript.slice(0, 60));
  }
  // Hold a fresh dangling fragment (only while the student owns the floor —
  // do not hold during tutor speech, where barge-in timing matters).
  if (endsMidThought(transcript) && <production-state is not 'speaking'/'processing' — use the real state signal in scope, same one the noise-nag gate uses>) {
    const heldText = transcript;
    onDebugEvent?.('transcript_held', heldText.slice(-30));
    heldTranscriptRef.current = {
      text: heldText,
      timer: setTimeout(() => {
        heldTranscriptRef.current = null;
        onDebugEvent?.('transcript_hold_flushed', heldText.slice(-30));
        <re-invoke this same handler with heldText — factor the handler body or call the processing continuation directly; NO recursion through the hold block (guard: flush path skips the hold)>;
      }, HOLD_MS),
    };
    return;
  }
}
```

Implementation notes (resolve while wiring, document in report): (a) the flush re-entry must skip the hold check (pass a `bypassHold` arg or process via the continuation below the hold block); (b) clear `heldTranscriptRef` + its timer at session teardown alongside the other timer cleanups (unmount effect, ~VTR:7094-7100) and on mic mute; (c) the held fragment must still respect `submitPendingUtteranceRef`/mute-to-submit — if the student muted while a fragment is held, flush it immediately through the submit path rather than dropping it.

- [ ] **Step 2: Typecheck + suites:** `npx tsc --noEmit && npm run test:utterance-hold && npm run test:cover-layer && npm run test:ack-layer`.

- [ ] **Step 3: SKIP live mic test (deferred to Task 5).**

- [ ] **Step 4: Commit** — `git commit -m "feat(tutor): hold dangling-word transcripts and merge resumed speech (R34 T3)"`

---

### Task 4: Manual mic mode (flag `TUTOR_MANUAL_MIC`, per-device opt-in)

**Files:**
- Modify: `src/lib/tutor/orchestrator/flags.ts` (after `TUTOR_INCOMPLETE_HOLD`):

```ts
// R34: availability gate for the student-facing "Manual mic" toggle —
// buffered turn composition with tap-to-send instead of auto endpointing.
// The MODE is opt-in per device (localStorage); this flag just ships the UI.
export const TUTOR_MANUAL_MIC =
  process.env.NEXT_PUBLIC_TUTOR_MANUAL_MIC === 'on' ||
  process.env.NEXT_PUBLIC_TUTOR_MANUAL_MIC === 'true';
```

- Modify: `.env.local` + `.env.local.production`: `NEXT_PUBLIC_TUTOR_MANUAL_MIC=on`, commented.
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — buffering + send.
- Modify: the ⋯ adaptive menu (locate: the menu hosting the pace "slow ×1" and Harder/Easier chips — search those labels; likely SessionStage `adaptiveMenu` slot builder) — add a "Mic" row with Auto/Manual segmented toggle, visible only when `TUTOR_MANUAL_MIC`.

**Interfaces:**
- Consumes: the same shared transcript handler seam as Task 3 (hold runs first; manual buffering runs after merge so fragments merge before buffering); `mergeHeldTranscript` for buffer joining; the mic button + its state machine (`handleMicClick`, ~VTR:14783; state icons ~VTR:15410-15425); localStorage.
- Produces: `manualMicRef`/`setManualMic(v)` persisted at `localStorage['evelyn-manual-mic']` (`'on'`/absent); `manualBufferRef: string[]`; debug events `manual_buffered`, `manual_sent`, `manual_mode_toggled`.

- [ ] **Step 1: State + toggle.** `const [manualMic, setManualMicState] = useState(false)` initialized from localStorage in a mount effect (SSR-safe); `manualMicRef` mirrors it (VTR ref-mirror convention). Setter writes localStorage + `onDebugEvent?.('manual_mode_toggled', v ? 'manual' : 'auto')`. Menu row: two small buttons "Auto" / "Manual" with the active one highlighted, matching the pace-chip styling in that menu (copy classes from the adjacent rows).

- [ ] **Step 2: Buffer instead of dispatch.** In the shared transcript handler, AFTER Task 3's hold/merge block and after the mute/noise gates (a buffered turn must still be a real, unmuted, non-noise transcript), and ONLY when the student owns the floor (same not-speaking/processing state signal as Task 3 — barge-in path untouched per Global Constraints):

```ts
if (TUTOR_MANUAL_MIC && manualMicRef.current) {
  manualBufferRef.current.push(transcript);
  onDebugEvent?.('manual_buffered', `${manualBufferRef.current.length} part(s)`);
  <show the buffered hint — set whatever small status text state the dock's mic-state line uses (the caption slot doubles as the mic-state line; find how "Muted — tap mic" style hints are set and reuse): "Held — tap ✓ to send">
  return;
}
```

- [ ] **Step 3: Send affordance.** When `manualMic && manualBufferRef.current.length > 0`: the mic button (or a companion send button beside it — pick whichever needs LESS surgery after reading the dock JSX; a separate small ✓ button beside the mic is acceptable and simpler than rewiring the mic state machine) dispatches:

```ts
const joined = manualBufferRef.current.splice(0).reduce((acc, part) => (acc ? mergeHeldTranscript(acc, part) : part), '');
onDebugEvent?.('manual_sent', joined.slice(0, 60));
<dispatch joined through the SAME processing continuation the auto path uses (the code right after the manual-buffer branch) — NOT a direct handleStudentTranscriptForBrain call, so classifier/cover/dedupe all run normally>;
```

If the student is mid-utterance when they tap send, set a one-shot ref so the in-flight utterance's transcript merges into the send when it finalizes (reuse the pattern `submitPendingUtteranceRef` uses for mute-to-submit — read `toggleMicMute` ~VTR:14904-14942 first).

- [ ] **Step 4: Mode-exit + teardown hygiene.** Switching Manual→Auto with a non-empty buffer sends it (never drops words). Session end/unmount clears the buffer. Mute while buffering: buffer persists (muted students expect held text to survive).

- [ ] **Step 5: Typecheck + suites** (same battery as Task 3). SKIP live test (Task 5).

- [ ] **Step 6: Commit** — `git commit -m "feat(tutor): manual mic mode — buffered turns with tap-to-send (R34 T4)"`

---

### Task 5: Round verification + deploy gate

**Files:** none.

- [ ] **Step 1:** `npm run test:utterance-hold && npm run test:cover-layer && npm run test:ack-layer && npm run test:stage2-restore-r32 && npx tsc --noEmit && npm run build` — all green.
- [ ] **Step 2 (manual, dev — needs a working Cartesia key; the current dev key is exhausted per 2026-07-25, swap first):** (a) End button: single tap arms only; (b) say "could you give me a… (pause) …harder problem" → one merged turn (watch `transcript_held`/`transcript_merged` events); (c) toggle Manual mic → speak two fragments → nothing dispatches → tap send → one combined turn; toggle back to Auto with buffer → sends.
- [ ] **Step 3 (user gate):** `./deploy-update.sh` (ships both new flags via .env.local.production automatically). Live-gate on prod: one demo-style session exercising all three features; confirm no `transcript_held` on complete sentences (false-positive watch).
- [ ] **Step 4:** Update the live-test rounds ledger memory (R34 entry).

---

## Self-Review Notes

- Spec coverage: End confirm → T1 (both surfaces); endpointing hold → T2/T3; manual mode → T4; opener softening explicitly PARKED (not in scope); verification/deploy → T5.
- Type consistency: `endsMidThought`/`mergeHeldTranscript`/`HOLD_MS` produced in T2, consumed T3/T4; flags named `TUTOR_INCOMPLETE_HOLD`/`TUTOR_MANUAL_MIC` consistently.
- T3/T4 wiring steps are anchor-based by necessity (VTR); each names search strings and the placement invariants (hold BEFORE mute/noise; buffer AFTER them; barge-in path untouched).
