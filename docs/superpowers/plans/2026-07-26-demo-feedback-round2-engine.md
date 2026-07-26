# Demo Feedback Round 2 — Engine Fixes (E1–E4, P4, P2-coupling) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the six engine-side fixes from demo session portal-19ac025c (2026-07-26): emit `evelyn:session_started` for the portal countdown (P2), make the End button's armed state visible at embed width (E1), hide "Explain a concept" until practice mode is active (E4), strengthen + net the board-anchored-questions rule (E2), extend PDF latex-readable coverage (P4), and make ink-note annotations draggable (E3).

**Architecture:** All changes in `/Users/luke/Dev/evelynlearning`. Small UI/plumbing fixes (Tasks 1–3) first, then prompt+validator work (Task 4), the latex transform (Task 5), and the largest piece — draggable ink notes with persistence (Task 6) — last. Each task is independently committable.

**Tech Stack:** Next.js/React (tutor UI), bespoke `npx tsx` test scripts (no test framework — hand-rolled `test()`/`check()` + `node:assert`, exit code from failure count).

## Global Constraints

- **Do NOT regress** (triage doc): R35 warmup overlay timing, transcript-drawer scoped scrolling (b24aecb2), two-tap End on desktop (R34 T1, 102303c2), wall floor/refund flow, qpin drag (2026-07-23 round).
- **Embed protocol additive-only**: new postMessage types may be added; existing shapes unchanged.
- **New pure logic goes in its own `src/lib/tutor/...` module** with a `scripts/test-*.ts` script registered in package.json (the `qpin-behavior.ts` / `ink-placement.ts` pattern).
- Corrective validators PLANT NOTES, never kill (the turn-cap pattern — a kill would cut audio the student already heard). Note convention: `[<kind> note — not from the student] ...`.
- Verification: `npx tsc --noEmit` for type safety; targeted `npm run test:<suite>` per task; `npm run build` once before deploy.
- Work on a branch off `main` (currently 200e5804). Pre-existing untracked docs/.vscode dirt is not yours — leave it.

---

### Task 1: P2-coupling — emit `evelyn:session_started` at real session start

**Files:**
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (:915 the onSessionStarted wiring; refs near :233)
- Modify: `src/app/tutor-portal/embed/page.tsx` (relay effect precedent at :713-725)

**Interfaces:**
- Consumes: VTR's existing `onSessionStarted` callback — already fired at all four real-start sites (mic tap VTR:15117-15128, resume-continue :15024-15034, gesture start :14601-14621, typed submit :16009-16013).
- Produces: `window.parent.postMessage({ type: 'evelyn:session_started', data: { session_id, started_at_ms } }, '*')` from the embed, once per real start. The portal (already built + merged: academy `apps/web/components/EmbeddedSession.tsx`, `docs/contract-additions-v1.2.md` §3.2) consumes it and prefers `started_at_ms` (epoch ms, same browser clock) as the countdown anchor when present and sane.

**Background:** The engine's enforcement clock (hard-stop cap VTR:15065-15084 + demo_stop block) ALREADY anchors at mic-tap via `voiceSessionStartedAtMsRef`. The portal's display clock anchors at component mount — this message lets it re-anchor to match. `onSessionStarted` currently dead-ends at TutorSession.tsx:915 (`setVoiceStartedAtMs`). The lightest-touch bridge across TutorSession→embed is the window-event relay the embed already uses for `evelyn:expand`/`evelyn:collapse` (embed/page.tsx:713-725) and `evelyn:session-ending` (TutorSession.tsx:221).

- [ ] **Step 1: Dispatch a window event at first real start (TutorSession)**

At TutorSession.tsx:915, the current wiring is:
```tsx
        onSessionStarted={() => setVoiceStartedAtMs((prev) => (prev ?? Date.now()))}
```
Add a ref near the other refs (~:334):
```tsx
  // P2 (demo feedback R2): one-shot guard for the session-started window
  // event — onSessionStarted can fire from several VTR paths; the portal
  // must see exactly one start signal (its countdown anchors on the first).
  const sessionStartedDispatchedRef = useRef(false);
```
and change the wiring to (side effect OUTSIDE the state updater — updaters must stay pure under StrictMode double-invoke):
```tsx
        onSessionStarted={() => {
          if (!sessionStartedDispatchedRef.current) {
            sessionStartedDispatchedRef.current = true;
            // Same window-event bridge as 'evelyn:session-ending' (above) —
            // the embed page relays it to the parent as a postMessage. The
            // timestamp rides in detail so the portal can anchor its
            // countdown on the exact same instant this component's own
            // timer uses (same-browser clock — no skew).
            window.dispatchEvent(
              new CustomEvent('evelyn:session-started', { detail: { startedAtMs: Date.now() } }),
            );
          }
          setVoiceStartedAtMs((prev) => (prev ?? Date.now()));
        }}
```
(The `/tutor` page also mounts TutorSession — the event fires there too with no listener; harmless.)

- [ ] **Step 2: Relay to the parent from the embed**

In `src/app/tutor-portal/embed/page.tsx`, add a NEW effect next to the expand/collapse relay (keep that one untouched; this one needs `sessionId` in deps):
```tsx
  // P2 (demo feedback R2): relay the real session start (mic tap / first
  // gesture — the same moment the engine's own hard-stop clock anchors) to
  // the parent, so the portal's demo countdown can anchor there instead of
  // at iframe mount. Additive protocol message; older portals ignore it.
  useEffect(() => {
    const onStarted = (e: Event) => {
      const startedAtMs = (e as CustomEvent<{ startedAtMs?: number }>).detail?.startedAtMs;
      window.parent.postMessage(
        {
          type: 'evelyn:session_started',
          data: {
            session_id: sessionId,
            ...(typeof startedAtMs === 'number' && Number.isFinite(startedAtMs)
              ? { started_at_ms: startedAtMs }
              : {}),
          },
        },
        '*',
      );
    };
    window.addEventListener('evelyn:session-started', onStarted);
    return () => window.removeEventListener('evelyn:session-started', onStarted);
  }, [sessionId]);
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no NEW errors (run it on a clean checkout first if unsure of the baseline).

- [ ] **Step 4: Commit**

```bash
git add src/app/tutor/components/session/TutorSession.tsx src/app/tutor-portal/embed/page.tsx
git commit -m "feat(embed): emit evelyn:session_started at real session start (R2 P2)"
```

---

### Task 2: E1 — End button armed state must present text at all widths

**Files:**
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (:828-862, `endControlEl`)

**Interfaces:** none (self-contained JSX).

**Background:** R34's two-tap confirm hides the label below `sm` (`hidden sm:inline-block`, :860) — at embed width the armed state is COLOR-ONLY, and the user concluded the button was broken (tapped once, watched it revert). The functional path of the second tap was code-traced and is intact (onClick :842-846 → `h.endSession()` → VTR `endSessionNowRef` :15396-15418 → `onEndSession` → TutorSession `handleEndSession` :220-223 → embed `handleEndSession` → `evelyn:session_ended`); the failure was pure discoverability. Fix: at narrow widths, swap the icon for a compact "End?" label inside a FIXED-WIDTH slot so the pill geometry never changes (the R34 no-layout-jump rule), plus a polite `aria-live` announcement.

- [ ] **Step 1: Rework the pill contents**

Replace lines :856-860 (the `<LogOut .../>` + label span) with:
```tsx
      {/* Narrow (<sm): one fixed-width slot that swaps icon ↔ "End?" so the
          armed state always presents TEXT (2026-07-26 trial: color-only arm
          read as a broken button) while the pill geometry never changes —
          the second tap lands on the same hit target (R34 rule). */}
      <span className="inline-flex min-w-[2.25rem] justify-center sm:hidden">
        {endArmed ? 'End?' : <LogOut className="w-3.5 h-3.5" />}
      </span>
      <LogOut className="hidden sm:inline-block w-3.5 h-3.5" />
      {/* inline-block + min-w so the longer "End session?" label reserves
          the same slot as "End / Pause" — armed/unarmed never resize the
          pill, so the second tap always lands on the same hit target. */}
      <span className="hidden sm:inline-block sm:min-w-[6.5rem]">{endArmed ? 'End session?' : 'End / Pause'}</span>
      {/* Screen readers hear the arm regardless of viewport. */}
      <span aria-live="polite" className="sr-only">
        {endArmed ? 'Tap again to end the session' : ''}
      </span>
```
Keep the button's `onClick`/`title`/`aria-label`/className logic exactly as-is.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit` — expected clean (vs baseline).

- [ ] **Step 3: Visual check (dev server if available)**

If a dev server can be run (`npm run dev`, port per repo config): open `/tutor-portal/embed` (or `/tutor`) at a <640px viewport, tap End once → the pill must show "End?" in red; wait 3s → reverts to the icon. At desktop width behavior is unchanged ("End / Pause" ↔ "End session?"). If no browser is available, note this for the post-deploy live check (triage doc marks E1 as a live-test item).

- [ ] **Step 4: Commit**

```bash
git add src/app/tutor/components/session/TutorSession.tsx
git commit -m "fix(tutor): End-button armed state always shows text, aria-live announce (R2 E1)"
```

---

### Task 3: E4 — hide "Explain a concept" until practice mode is active

**Files:**
- Modify: `src/app/tutor/components/session/SessionStage.tsx` (props ~:154-164, destructure :196, chip row :691-716)
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (pass-through at the SessionStage call, ~:1229)

**Interfaces:**
- Consumes: `practiceStats.active` — TutorSession already holds it in state (`setPracticeStats` at :937); it is the derived truth (`derivePracticeMode(sessionGoal, practiceOverride)`, emitted by VTR:15381). Also `practiceOverrideActive` state (:257-260) as an OR-fallback for the window before the first stats emission.
- Produces: new optional `practiceModeActive?: boolean` prop on `SessionStage`.

**Background (DECIDED by user 2026-07-26):** In the demo the topic is pre-chosen and concept teaching IS the default mode — a pre-start "Explain a concept" chip is redundant and confusing. Hidden until practice mode is active, it reads as "back to teaching". Applies on ALL surfaces — SessionStage is the only chip owner (the legacy `/tutor` direct-VTR layout has no chips), so this one change covers everything.

- [ ] **Step 1: Add the prop to SessionStage**

In the props interface after `onTogglePracticeOverride` (:164):
```tsx
  /** E4 (demo feedback R2, user-decided 2026-07-26): true while practice
   *  mode is actually active (derivePracticeMode truth via practiceStats,
   *  OR'd with the override for the pre-stats window). The "Explain a
   *  concept" chip renders ONLY when true — teaching is the default mode,
   *  so pre-practice the chip is redundant; mid-practice it reads as
   *  "back to teaching". */
  practiceModeActive?: boolean;
```
Destructure with default at :196 alongside `practiceOverrideActive = false`:
```tsx
  practiceModeActive = false,
```

- [ ] **Step 2: Gate the chip**

At :715, wrap the chip:
```tsx
              {practiceModeActive && (
                <Chip onClick={() => { onTogglePracticeOverride?.(false); onStudentInput('text', 'Explain a concept to me.'); }}>Explain a concept</Chip>
              )}
```
(The "Practice problems" chip at :712-714 stays unconditional.)

- [ ] **Step 3: Feed it from TutorSession**

At the SessionStage call site (~:1229, next to `practiceOverrideActive`):
```tsx
        practiceModeActive={practiceOverrideActive || (practiceStats?.active ?? false)}
```
(Verify the exact name of the practice-stats state variable at :937/:953 — recon shows `practiceStats` with `.active`; use whatever the file declares.)

- [ ] **Step 4: Typecheck + commit**

Run: `npx tsc --noEmit` — clean vs baseline.
```bash
git add src/app/tutor/components/session/SessionStage.tsx src/app/tutor/components/session/TutorSession.tsx
git commit -m "feat(tutor): Explain-a-concept chip hidden until practice mode active (R2 E4)"
```

---

### Task 4: E2 — board-anchored questions: repeat-request clause + deterministic net

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (:514, the Board-anchored HARD RULE)
- Create: `src/lib/tutor/voice/question-anchor.ts`
- Modify: `src/lib/tutor/orchestrator/flags.ts` (flag, next to TUTOR_TURN_CAP at :123-145)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (ref near :2465-2472; detection at the turn-ok site :11439-11470; injection at :7690-7703)
- Create: `scripts/test-question-anchor.ts`, `scripts/test-board-anchored-question-clause.ts`
- Modify: `package.json` (register `test:question-anchor`, `test:pedagogy-board-anchored`)

**Interfaces:**
- Consumes: `lastQuestionSentence(text)` from `src/lib/tutor/question-gist-text.ts`; the turn-ok site locals `fullText`, `totalToolNamesSeen`; `pendingCadenceNoteRef`-style ref lifecycle.
- Produces: `isSubstantiveAsk(sentence: string): boolean`, `isBoardContentTool(name: string): boolean`, `buildBoardAnchorNote(question: string): string` from `question-anchor.ts`; flag `TUTOR_BOARD_ANCHOR_NET` from flags.ts.

**Evidence (session portal-19ac025c, console log analyzed 2026-07-26):** The k=-0.1 half-life question was posed in speech only; that turn's ONE board call was the *verification equation*, not the question — so a "no board call this turn" net would have MISSED it. The repeat-request turn ("Sorry, I didn't quite catch that") rephrased and wrote the half-life *condition*, but again not the question it asked. Consequences: (a) the PROMPT clause is the primary fix — the net is a safety net for the zero-board-call case only; (b) the note text must be conditional-phrased ("if it's not already visible…") so false positives are harmless.

- [ ] **Step 1: Write the failing prompt-clause test**

Create `scripts/test-board-anchored-question-clause.ts` on the `test-posed-problem-clause.ts` pattern (hand-rolled `test()` + `node:assert`, `SystemPromptContext` with `module: null, studentName`):
```ts
/**
 * R2 E2 (2026-07-26, session portal-19ac025c): pins the Board-anchored
 * questions HARD RULE, including the repeat-request clause — a repeat/
 * clarify request means the previous ask was hard to follow BY EAR, so the
 * tutor must re-explain differently AND board-anchor the ask.
 */
import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const prompt = buildSystemPrompt({ module: null, studentName: 'Ravi' } as SystemPromptContext);

test('board-anchored clause present', () => {
  assert.ok(prompt.includes('Board-anchored questions'));
  assert.ok(prompt.includes('never leave the student holding a spoken-only expression'));
});

test('repeat-request clause: repeat means re-explain AND write it', () => {
  assert.ok(prompt.includes('asks you to repeat'), 'repeat-request trigger missing');
  assert.ok(prompt.includes('write the question on the board'), 'board-anchor mandate missing');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```
Register in package.json scripts: `"test:pedagogy-board-anchored": "npx tsx scripts/test-board-anchored-question-clause.ts",`

- [ ] **Step 2: Run it — expect the repeat-request test to FAIL**

Run: `npm run test:pedagogy-board-anchored`
Expected: first test passes (clause exists), second FAILS (no repeat clause yet).

- [ ] **Step 3: Extend the HARD RULE at system-prompt-builder.ts:514**

Append to the end of the line-514 clause (after "…stays spoken."):
```
 **Repeat requests re-anchor:** if the student asks you to repeat or says they didn't catch it, your previous ask was hard to follow by ear — do not just re-say it: re-explain it differently AND write the question on the board this turn (show_equation or a scribble on the existing target) if it is not already visible there.
```

- [ ] **Step 4: Run the clause test + neighbors — expect PASS**

Run: `npm run test:pedagogy-board-anchored && npm run test:pedagogy-posed-problem && npm run test:pedagogy-board-truth`
Expected: all pass (the neighbors pin adjacent clauses — proves no accidental edit).

- [ ] **Step 5: Write the failing classifier test**

Create `scripts/test-question-anchor.ts` (same harness shape):
```ts
import { strict as assert } from 'node:assert';
import { isSubstantiveAsk, isBoardContentTool, buildBoardAnchorNote } from '../src/lib/tutor/voice/question-anchor';

let passed = 0; let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

// Substantive: names a number, variable, or expression to work.
test('k=-0.1 half-life ask is substantive', () => {
  assert.equal(isSubstantiveAsk('if a radioactive sample decays with k = -0.1 per year, what would you guess "half-life" means in terms of this equation -- what condition would y(t) need to satisfy?'), true);
});
test('percent-of ask is substantive', () => {
  assert.equal(isSubstantiveAsk("What's fifteen percent of sixty?"), false); // spelled-out numbers are a known miss — documented, not a goal
  assert.equal(isSubstantiveAsk("What's 15% of 60?"), true);
});
test('latex/dollar-span ask is substantive', () => {
  assert.equal(isSubstantiveAsk('So with just that -- $e^{kT} = \\frac{1}{2}$ -- what would you do to get T by itself?'), true);
});
test('conversational checks are NOT substantive', () => {
  assert.equal(isSubstantiveAsk('Does that make sense?'), false);
  assert.equal(isSubstantiveAsk('Ready to try one?'), false);
  assert.equal(isSubstantiveAsk('What do you think happens next?'), false);
  assert.equal(isSubstantiveAsk('Should we keep going?'), false);
});
test('empty/undefined-ish input safe', () => {
  assert.equal(isSubstantiveAsk(''), false);
  assert.equal(isSubstantiveAsk('   '), false);
});

// Tool classification: content writes vs meta/nav/control.
test('content tools', () => {
  assert.equal(isBoardContentTool('show_equation'), true);
  assert.equal(isBoardContentTool('show_problem'), true);
  assert.equal(isBoardContentTool('tutor_scribble'), true);
  assert.equal(isBoardContentTool('tutor_handwrite'), true);
});
test('meta/control tools are not content', () => {
  assert.equal(isBoardContentTool('new_page'), false);
  assert.equal(isBoardContentTool('go_to_page'), false);
  assert.equal(isBoardContentTool('clear'), false);
  assert.equal(isBoardContentTool('tutor_scroll_whiteboard'), false);
  assert.equal(isBoardContentTool('list_whiteboard_features'), false);
  assert.equal(isBoardContentTool('mark_segment_complete'), false);
  assert.equal(isBoardContentTool('advance_lesson'), false);
  assert.equal(isBoardContentTool('generate_problem'), false);
});

// Note text: conditional-phrased, follows the note convention.
test('note convention + conditional phrasing', () => {
  const note = buildBoardAnchorNote("What's 15% of 60?");
  assert.ok(note.startsWith('[board-anchor note — not from the student]'));
  assert.ok(note.includes('not already visible'));
  assert.ok(note.includes("What's 15% of 60?"));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```
Register: `"test:question-anchor": "npx tsx scripts/test-question-anchor.ts",`

- [ ] **Step 6: Run it — expect FAIL (module missing)**

Run: `npm run test:question-anchor`

- [ ] **Step 7: Implement the pure module**

Create `src/lib/tutor/voice/question-anchor.ts`:
```ts
/**
 * R2 E2 (2026-07-26, session portal-19ac025c): deterministic safety net for
 * the "Board-anchored questions" HARD RULE. The k=-0.1 half-life question
 * was posed in speech only — the prompt rule is the primary fix; this net
 * catches the zero-board-write case: a turn that ENDS with a substantive
 * question (names a number/variable/expression) and painted NO content on
 * the board plants a next-turn corrective note (the turn-cap pattern — a
 * note, never a kill; the audio already played).
 *
 * KNOWN LIMIT (deliberate): a turn that wrote SOME content but not the
 * question itself (the actual session-portal-19ac025c shape) is not
 * detectable without semantic matching — the strengthened prompt rule owns
 * that case. Spelled-out numbers ("fifteen percent") are likewise missed;
 * conservative by design (note noise costs prompt budget every turn).
 */

/** Meta/nav/control tool calls that do NOT paint teaching content. */
const NON_CONTENT_TOOLS = new Set([
  'new_page',
  'go_to_page',
  'clear',
  'tutor_scroll_whiteboard',
  'list_whiteboard_features',
  'mark_segment_complete',
  'advance_lesson',
  'generate_problem',
]);

export function isBoardContentTool(name: string): boolean {
  return !NON_CONTENT_TOOLS.has(name);
}

/** The prompt rule's exempt conversational checks — reaction/yes-no/open
 *  prediction asks that name nothing to hold onto. */
const CONVERSATIONAL_RE =
  /^(does that make sense|ready to try|what do you think happens next|should we keep going|make sense so far|any questions|you with me|sound good)/i;

/**
 * A substantive ask names a number, variable, or expression the student
 * must compute or manipulate: digits, math operators, LaTeX/$-spans, or a
 * function-call-shaped token like y(t).
 */
export function isSubstantiveAsk(sentence: string): boolean {
  const s = sentence.trim();
  if (!s) return false;
  if (CONVERSATIONAL_RE.test(s)) return false;
  return /[\d$\\^=+×÷*/%]|\b[a-zA-Z]\([a-zA-Z0-9 ,]*\)/.test(s);
}

export function buildBoardAnchorNote(question: string): string {
  return (
    `[board-anchor note — not from the student] Your previous turn ended by asking ` +
    `"${question}" — a question that names specific values — but painted nothing on the ` +
    `whiteboard that turn. If that ask is not already visible on the board, write it there ` +
    `now (show_equation, or a scribble against the existing target) as you continue; ` +
    `never leave the student holding a spoken-only expression in their head.`
  );
}
```
NOTE: the classifier test expects `isSubstantiveAsk("What's fifteen percent of sixty?")` to be `false` — that documents the known miss, it is not a target to fix. Iterate the regex only until the listed cases pass.

- [ ] **Step 8: Run classifier test — expect PASS**

Run: `npm run test:question-anchor`

- [ ] **Step 9: Wire the net into VoiceTutorRealtime**

(a) Flag in `src/lib/tutor/orchestrator/flags.ts` (after the TURN_CAP block ~:145):
```ts
// Board-anchored-question net (2026-07-26, R2 E2, session portal-19ac025c):
// a turn ending in a substantive question with ZERO content board writes
// plants a next-turn [board-anchor note] (same lifecycle as the cadence
// note — soft, never a kill). The prompt HARD RULE is the primary fix;
// this catches only the zero-write case by design.
export const TUTOR_BOARD_ANCHOR_NET = process.env.NEXT_PUBLIC_TUTOR_BOARD_ANCHOR_NET !== 'off';
```

(b) Ref in VoiceTutorRealtime.tsx next to `pendingNoAdvanceNoteRef` (:2472):
```ts
  // R2 E2: pending board-anchor corrective — same lifecycle as
  // pendingCadenceNoteRef but a SEPARATE ref/concern (a turn can lapse on
  // cadence and anchoring independently).
  const pendingBoardAnchorNoteRef = useRef<string | null>(null);
```

(c) Detection at the turn-ok site, AFTER the existing cadence else-if chain (:11454-11470) as an independent `if` (not chained — different concern, own ref):
```ts
      // R2 E2: substantive final question + zero content board writes →
      // plant a board-anchor note for the next turn. Independent of the
      // cadence triggers (own ref) — both can fire on the same turn.
      if (TUTOR_BOARD_ANCHOR_NET) {
        const finalQuestion = lastQuestionSentence(fullText);
        const paintedContent = totalToolNamesSeen.some((n) => isBoardContentTool(n));
        if (finalQuestion && !paintedContent && isSubstantiveAsk(finalQuestion)) {
          pendingBoardAnchorNoteRef.current = buildBoardAnchorNote(finalQuestion);
          console.warn('[brain-orchestrator] board-anchor net: substantive question, 0 content tools — note planted');
          onDebugEvent?.('board_anchor_flagged', `question with no board write — note planted for next turn`);
        }
      }
```
Imports: add `isSubstantiveAsk, isBoardContentTool, buildBoardAnchorNote` from `@/lib/tutor/voice/question-anchor`, `TUTOR_BOARD_ANCHOR_NET` to the flags import, and verify `lastQuestionSentence` is imported from `@/lib/tutor/question-gist-text` (it's already used for the q-pin — check the existing import).

(d) Injection at the note-delivery block (:7690-7703), after the `pendingNoAdvanceNoteRef` clause:
```ts
      // R2 E2: board-anchor corrective — same convention, own concern.
      if (pendingBoardAnchorNoteRef.current) {
        runTranscript = `${pendingBoardAnchorNoteRef.current}\n\n${runTranscript}`;
        pendingBoardAnchorNoteRef.current = null;
      }
```

- [ ] **Step 10: Typecheck + full related suites**

Run: `npx tsc --noEmit && npm run test:question-anchor && npm run test:pedagogy-board-anchored && npm run test:question-gist-text`
Expected: all green.

- [ ] **Step 11: Commit**

```bash
git add src/lib/tutor/ai/system-prompt-builder.ts src/lib/tutor/voice/question-anchor.ts src/lib/tutor/orchestrator/flags.ts src/app/tutor/components/VoiceTutorRealtime.tsx scripts/test-question-anchor.ts scripts/test-board-anchored-question-clause.ts package.json
git commit -m "feat(tutor): board-anchored questions — repeat-request clause + zero-write corrective net (R2 E2)"
```

---

### Task 5: P4 — PDF latex-readable: braced exponents/subscripts, trivial fractions, function spacing

**Files:**
- Modify: `src/lib/utils/export/latex-readable.ts` (superscript/subscript rules :106-108; add post-passes)
- Modify: `scripts/test-math-coverage.ts` (pins at :364-374)

**Interfaces:**
- Consumes: nothing new.
- Produces: changed `latexToReadable` output shapes — `e^{kT}` → `e^(kT)`, `\frac{1}{2}` → `1/2` (trivial operands only), `10\ln 2` → `10 ln 2`. Every text sink already routes through `sanitizeForPDF` → `mathifyDollarSpans` → `latexToReadable`.

**Evidence (this session's PDF, read 2026-07-26):** Whiteboard images render fine; the transcript text carries: `e^kT = (1)/(2)` (brace-stripped multi-char exponent is ambiguous — reads as (e^k)T), `(1)/(2)` where `1/2` is cleaner, `10ln 2` missing a space. Recon also confirmed a real correctness bug: `x^{n+1}` → `x^n+1` (reads as x^n + 1).

- [ ] **Step 1: Add the failing pins**

In `scripts/test-math-coverage.ts` after the existing PDF pins (:364-374) add:
```ts
  // R2 P4 (2026-07-26, session portal-19ac025c PDF): multi-token exponents
  // keep parens — brace-stripping made e^{kT} ambiguous and x^{n+1} WRONG.
  check('pdf: multi-token exponent keeps parens',
    mathifyDollarSpans('$e^{kT}$') === 'e^(kT)',
    `got "${mathifyDollarSpans('$e^{kT}$')}"`);
  check('pdf: x^{n+1} precedence preserved',
    mathifyDollarSpans('$x^{n+1}$') === 'x^(n+1)',
    `got "${mathifyDollarSpans('$x^{n+1}$')}"`);
  check('pdf: single-char exponent stays bare',
    mathifyDollarSpans('$x^{2}$') === 'x^2',
    `got "${mathifyDollarSpans('$x^{2}$')}"`);
  check('pdf: multi-token subscript keeps parens, single stays bare',
    mathifyDollarSpans('$a_{n+1} + y_{0}$') === 'a_(n+1) + y_0',
    `got "${mathifyDollarSpans('$a_{n+1} + y_{0}$')}"`);
  check('pdf: session shape y_0e^{kT} = y_0/2',
    mathifyDollarSpans('$y_0e^{kT} = y_0/2$') === 'y_0e^(kT) = y_0/2',
    `got "${mathifyDollarSpans('$y_0e^{kT} = y_0/2$')}"`);
  check('pdf: trivial fraction collapses',
    mathifyDollarSpans('$e^{kT} = \\frac{1}{2}$') === 'e^(kT) = 1/2',
    `got "${mathifyDollarSpans('$e^{kT} = \\frac{1}{2}$')}"`);
  check('pdf: dy/dt collapses, non-trivial operands keep parens',
    mathifyDollarSpans('$\\frac{dy}{dt} = \\frac{y_0}{2}$') === 'dy/dt = (y_0)/(2)',
    `got "${mathifyDollarSpans('$\\frac{dy}{dt} = \\frac{y_0}{2}$')}"`);
  check('pdf: coefficient-function spacing',
    mathifyDollarSpans('$T = \\frac{\\ln 2}{0.1} = 10\\ln 2$') === 'T = (ln 2)/(0.1) = 10 ln 2',
    `got "${mathifyDollarSpans('$T = \\frac{\\ln 2}{0.1} = 10\\ln 2$')}"`);
```
AND update the existing nested-frac pin (:370-372) — the trivial-collapse pass changes its expectation:
```ts
  check('pdf: nested frac resolves inner-first',
    mathifyDollarSpans('$\\frac{\\frac{1}{2}}{3}$') === '(1/2)/(3)',
    `got "${mathifyDollarSpans('$\\frac{\\frac{1}{2}}{3}$')}"`);
```
(`y_0` is NOT a trivial operand — it contains `_` — so `(y_0)/(2)` keeps its parens; the collapse whitelist is strictly `[A-Za-z0-9]{1,3}`.)

- [ ] **Step 2: Run — expect the new pins to FAIL**

Run: `npm run test:math-coverage`
Expected: new pins fail; note which OLD pins pass (they must all still pass at the end).

- [ ] **Step 3: Implement in latex-readable.ts**

(a) Replace the superscript/subscript rules (:106-108). Current:
```ts
  s = s.replace(/\^{([^}]+)}/g, '^$1');
  s = s.replace(/_{([^}]+)}/g, '_$1');
```
New — single-token bodies stay bare, multi-token bodies keep parens:
```ts
  // R2 P4: a braced exponent/subscript with more than one token must keep
  // parens — bare stripping turned e^{kT} into the ambiguous e^kT and
  // x^{n+1} into the WRONG x^n+1. Single alphanumeric tokens stay bare.
  s = s.replace(/\^{([^}]+)}/g, (_m, body: string) =>
    /^[A-Za-z0-9]$/.test(body) ? `^${body}` : `^(${body})`);
  s = s.replace(/_{([^}]+)}/g, (_m, body: string) =>
    /^[A-Za-z0-9]$/.test(body) ? `_${body}` : `_(${body})`);
```
CHECK the `_{0}` case: body `0` is single-token → `_0`. And `y_{0}e^{kT}` → `y_0e^(kT)`. But ALSO check what happens to bodies that are multi-DIGIT like `x^{10}` → `x^(10)` — acceptable (unambiguous either way, parens are safe).

(b) Add a trivial-fraction collapse AFTER the fraction do/while loop (:97-105):
```ts
  // R2 P4: collapse trivial fractions — both operands a single short
  // alphanumeric token — so (1)/(2) prints as 1/2 and (dy)/(dt) as dy/dt.
  // Anything with _, ^, operators, or length > 3 keeps its parens.
  s = s.replace(/\(([A-Za-z0-9]{1,3})\)\/\(([A-Za-z0-9]{1,3})\)/g, '$1/$2');
```

(c) Add coefficient-function spacing AFTER the function-name replacements (:16-37) — placement matters: it must run after `\ln` → `ln` etc., so put it near the end, before the catch-all strip (:111):
```ts
  // R2 P4: a coefficient butted against a function name gets a space —
  // "10\ln 2" had become "10ln 2".
  s = s.replace(/(\d)(sin|cos|tan|sec|csc|cot|ln|log|exp|sinh|cosh|tanh)\b/g, '$1 $2');
```

- [ ] **Step 4: Run the full math-coverage suite**

Run: `npm run test:math-coverage`
Expected: ALL pins pass (new + old, including `pdf: dfrac span → readable` — `(1)/(1+1^2)` must NOT collapse (denominator fails the whitelist) — and `pdf: currency untouched`), AND the generated stress corpus reports 0 failures. If any stress invariant breaks, fix the regex, don't loosen the invariant.

- [ ] **Step 5: Sibling suites (transform is shared surface)**

Run: `npm run test:inline-math && npm run test:physics-coverage && npm run test:chem-coverage && npm run test:subject-notation`
Expected: all green — these share the segment()/notation pipeline and pin adjacent behavior.

- [ ] **Step 6: Commit**

```bash
git add src/lib/utils/export/latex-readable.ts scripts/test-math-coverage.ts
git commit -m "fix(export): PDF latex — parenthesized multi-token scripts, trivial-frac collapse, fn spacing (R2 P4)"
```

---

### Task 6: E3 — draggable ink-note annotations (persisted, replay/PDF-aware)

**Files:**
- Modify: `src/lib/tutor/whiteboard/ink-placement.ts` (add `applyUserPos` helper + type)
- Modify: `src/lib/knowledge/types.ts` (`handwrite` member ~:764-777, `scribble` member ~:660-706 — additive `userPos` field)
- Modify: `src/app/tutor/components/whiteboard/InkNotesOverlay.tsx` (drag handlers, placement precedence, pointer-events)
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx` (thread `onInkNoteMoved` prop, ~:1780-1790 mount site)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (own the command mutation; whitelist `userPos` in the strip loop :5880-5907)
- Modify: `src/lib/utils/export/whiteboard-capture.ts` (PDF bake respects `userPos`, note loop :773-830)
- Modify: `scripts/test-ink-placement.ts` (pins for `applyUserPos`)

**Interfaces:**
- Consumes: `exceedsDragThreshold` + `QPIN_DRAG_THRESHOLD_PX` from `src/lib/tutor/qpin-behavior.ts` (reuse, don't duplicate); the qpin drag machinery at SessionStage.tsx:344-435 as the reference implementation (5px tap/drag threshold, capture-at-drag-start, `buttons === 0` stale-drag self-heal, `pointercancel` → same end handler WITHOUT arming click suppression).
- Produces: additive `userPos?: { dx: number; dy: number }` on `handwrite` and `scribble` command types (offset in UNSCALED content px, relative to the resolved target rect's top-left, or to the page origin when the note has no target); `applyUserPos(cache: { anchor: Rect | null }, userPos: { dx: number; dy: number }, size: { w: number; h: number }, page: Rect): Rect` in ink-placement.ts; `onInkNoteMoved?: (ref: { kind: 'handwrite' | 'scribble'; index: number; userPos: { dx: number; dy: number } }) => void` threaded InkNotesOverlay → WhiteboardCanvas → VTR.

**Design decisions (from triage + recon):**
1. Dragging is the manual escape hatch; the auto de-overlap slot engine stays the default. A note with `userPos` bypasses the slot engine but still registers its rect into the occupied set so OTHER notes avoid it.
2. Offset is stored target-relative so it survives reflow/resize; margin (targetless) notes store it page-origin-relative. Clamp to page bounds at render (mirror `clampQpinFraction`'s philosophy, but px-space here).
3. Persistence rides the existing pipeline for free ONCE the field is on the command object: Mongo stores `{action, data}` with data spread from the command; ReplayPlayer reconstructs via `{ action: entry.action, ...entry.data }`. The ONE trap: the handwrite field-strip loop at VTR:5880-5907 deletes unknown spatial fields — `userPos` must be explicitly preserved there.
4. R23 qpin lessons apply verbatim: `onPointerCancel` routes to the end handler but must NOT arm the click suppressor; capture only once the threshold is exceeded (capturing on pointerdown retargets plain taps); a new press overwrites a stale pre-threshold entry.
5. The overlay root stays `pointer-events-none`; individual note divs get `pointer-events-auto touch-none cursor-grab active:cursor-grabbing` (check interplay with the student-ink pen capture in WhiteboardCanvas — `setPointerCapture` at :1400/:1963 — the note div's own capture wins while dragging, verify a stray pen stroke doesn't start on note-tap).

- [ ] **Step 1: Write the failing pure-helper test**

Add to `scripts/test-ink-placement.ts` (match its existing harness style — read the file first):
```ts
// R2 E3: user-dragged placement (applyUserPos) — target-relative offset,
// page-origin fallback, page-bounds clamp.
test('applyUserPos: target-relative offset', () => {
  const rect = applyUserPos(
    { anchor: { x: 100, y: 50, w: 200, h: 40 } },
    { dx: 30, dy: -10 },
    { w: 120, h: 26 },
    { x: 0, y: 0, w: 800, h: 600 },
  );
  assert.deepEqual(rect, { x: 130, y: 40, w: 120, h: 26 });
});
test('applyUserPos: page-origin fallback when no anchor', () => {
  const rect = applyUserPos(
    { anchor: null },
    { dx: 500, dy: 300 },
    { w: 120, h: 26 },
    { x: 0, y: 0, w: 800, h: 600 },
  );
  assert.deepEqual(rect, { x: 500, y: 300, w: 120, h: 26 });
});
test('applyUserPos: clamps into page bounds', () => {
  const rect = applyUserPos(
    { anchor: null },
    { dx: 900, dy: -50 },
    { w: 120, h: 26 },
    { x: 0, y: 0, w: 800, h: 600 },
  );
  assert.equal(rect.x, 800 - 120);
  assert.equal(rect.y, 0);
});
```
(If the file uses a `check(name, cond)` harness instead of `test(fn)`, adapt to its exact idiom.)

- [ ] **Step 2: Run — expect FAIL**

Run: `npm run test:ink-placement`

- [ ] **Step 3: Implement `applyUserPos` in ink-placement.ts**

```ts
/** R2 E3: a user-dragged note's stored offset → concrete rect. Offset is
 *  target-relative (anchor present) or page-origin-relative (margin note).
 *  Always clamped fully inside the page so a drag can never strand a note
 *  off-canvas after a reflow shrinks the page. */
export function applyUserPos(
  cache: { anchor: Rect | null },
  userPos: { dx: number; dy: number },
  size: { w: number; h: number },
  page: Rect,
): Rect {
  const baseX = cache.anchor ? cache.anchor.x : page.x;
  const baseY = cache.anchor ? cache.anchor.y : page.y;
  const x = Math.min(Math.max(baseX + userPos.dx, page.x), page.x + page.w - size.w);
  const y = Math.min(Math.max(baseY + userPos.dy, page.y), page.y + page.h - size.h);
  return { x, y, w: size.w, h: size.h };
}
```
Run: `npm run test:ink-placement` — expect PASS (new + all pre-existing slot-engine pins).

- [ ] **Step 4: Add the `userPos` field to the command types**

In `src/lib/knowledge/types.ts`, add to BOTH the `handwrite` member (~:770) and the `scribble` member (~:700, with the other resolver-stamped fields):
```ts
      /** R2 E3 (2026-07-26): student-dragged placement — offset in unscaled
       *  content px from the resolved target rect's top-left (or the page
       *  origin for margin notes). Written client-side by the ink-note drag;
       *  never emitted by the brain. Additive — absent ⇒ auto placement. */
      userPos?: { dx: number; dy: number };
```

- [ ] **Step 5: Whitelist `userPos` in the VTR strip loop**

At VoiceTutorRealtime.tsx:5880-5907, the handwrite normalization loop strips spatial fields. Read the loop carefully and ensure `userPos` is NOT deleted on any path (if the loop deletes by explicit field name — `position`, `margin`, `near`, `targetItemIndex`, … — `userPos` survives untouched; if any branch clears unknown keys, add `userPos` to its keep-list). Add a one-line comment at the loop:
```ts
      // R2 E3: `userPos` (student drag) is client-stamped and MUST survive
      // this normalization — it is never brain-emitted, only re-ingested on
      // resume/replay.
```

- [ ] **Step 6: Drag machinery in InkNotesOverlay**

This is the core. Mirror SessionStage.tsx:344-435 exactly, adapted from fraction-space to px-space:

(a) Props: add
```ts
  /** R2 E3: fires when the student finishes dragging a note — the owner
   *  stamps userPos onto the source command (and persistence follows). */
  onNoteMoved?: (ref: { kind: 'handwrite' | 'scribble'; index: number; userPos: { dx: number; dy: number } }) => void;
```
The overlay's `sources` memo (:259-276) builds keys `hw-${i}-${text}` / `sl-${i}-${label}` — carry `{ kind, index }` on each source alongside the key so the callback can address the original command array.

(b) Drag state (single ref, one drag at a time — notes are few):
```ts
  const dragRef = useRef<{
    key: string;
    kind: 'handwrite' | 'scribble';
    index: number;
    pointerId: number;
    startX: number;
    startY: number;
    originX: number; // note rect x in UNSCALED content px at pointerdown
    originY: number;
    hasAnchor: boolean;
    anchorX: number; // resolved target rect origin (content px), 0/0 if none
    anchorY: number;
    dragging: boolean;
  } | null>(null);
  const [dragOverridePos, setDragOverridePos] = useState<{ key: string; x: number; y: number } | null>(null);
```

(c) Handlers on each note div (remember the overlay scales by `scale` — divide clientX/Y deltas by `scale` to get content px):
- `onPointerDown`: guard `if (dragRef.current?.dragging) return;` — record pointerId, start client coords, the note's current placement rect origin (from the entry being rendered), the resolved anchor rect origin (`targetRect(...)` result for this source, or none), `dragging: false`.
- `onPointerMove`: bail unless same pointerId; `if (!d.dragging && e.buttons === 0) { dragRef.current = null; return; }` (stale-press self-heal); compute `dx = (e.clientX - d.startX) / scale`, `dy` likewise; below `exceedsDragThreshold(e.clientX - d.startX, e.clientY - d.startY)` (CLIENT px — threshold is a finger-motion constant) do nothing; on first exceed set `d.dragging = true` and `(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)` (capture ONLY at drag start); update `setDragOverridePos({ key: d.key, x: d.originX + dx, y: d.originY + dy })` clamped to the content/page rect.
- `onPointerUp` / `onPointerCancel` → one end handler: if `d.dragging`, compute the final content-px position, convert to the stored offset — `userPos = { dx: finalX - d.anchorX, dy: finalY - d.anchorY }` (anchor origin, or 0/0 ⇒ page-origin-relative) — and call `onNoteMoved?.({ kind: d.kind, index: d.index, userPos })`; clear `dragRef.current` and `setDragOverridePos(null)` (the command-driven re-render takes over).

(d) Placement precedence in the measure/place effect (:305-571): for a source whose command carries `userPos`, skip the slot engine and cache reuse — `const rect = applyUserPos({ anchor: t?.rect ?? null }, cmd.userPos, { w: m.w, h: m.h }, pageRect)` — and PUSH that rect into `placedRects` so subsequent auto-placed notes avoid it. (Import `applyUserPos` from ink-placement.)

(e) Render: note divs get `pointer-events-auto touch-none cursor-grab active:cursor-grabbing` and the three pointer handlers; the root div KEEPS `pointer-events-none`. While `dragOverridePos?.key === e.key`, render at the override position instead of the placed one.

(f) `HandwriteCmd`/`ScribbleCmd` prop types in the overlay: recon says props are typed against command shapes — the new `userPos` field flows in via the `notes`/`labeledScribbles` arrays; no prop shape change beyond `onNoteMoved`.

- [ ] **Step 7: Thread the callback up**

(a) WhiteboardCanvas.tsx: add `onInkNoteMoved` to props, pass to `<InkNotesOverlay onNoteMoved={onInkNoteMoved} ...>` at the :1780-1790 mount.
(b) VoiceTutorRealtime.tsx (owner of `whiteboardCommands` state): implement the mutation where WhiteboardCanvas is rendered — find the `<WhiteboardCanvas` element and the `whiteboardCommands`/`setWhiteboardCommands` pair, then:
```tsx
        onInkNoteMoved={({ kind, index, userPos }) => {
          setWhiteboardCommands((prev) => {
            // Index addresses the kind-filtered subarray (the overlay's view),
            // so walk prev counting matches of that action type.
            const action = kind === 'handwrite' ? 'handwrite' : 'scribble';
            let seen = -1;
            return prev.map((cmd) => {
              if (cmd.action !== action) return cmd;
              seen += 1;
              if (seen !== index) return cmd;
              return { ...cmd, userPos };
            });
          });
        }}
```
CRITICAL CHECK: the overlay receives FILTERED arrays (`handwrites` memo at WhiteboardCanvas:1069, `scribbles` at :1065 — and the scribbles one is `labeledScribbles`, possibly filtered to `label`-bearing entries only). The index the overlay reports MUST be interpreted against the SAME filter on the VTR side — read both memos and replicate their filter predicates exactly in the mutation walk (e.g. if `labeledScribbles` is `commands.filter(c => c.action === 'scribble' && c.label)`, the walk must count only label-bearing scribbles). Get this wrong and a drag moves the WRONG note. Also verify whether `whiteboardCommands` state lives in VTR or is lifted (TutorSession or the embed page own it in some paths — recon shows `whiteboardCommands.length` used in TutorSession:1211 and embed:671); put the mutation wherever `setWhiteboardCommands` actually lives and thread the prop from there.

- [ ] **Step 8: PDF bake respects userPos**

In `src/lib/utils/export/whiteboard-capture.ts`, note loop :773-830: where it calls `placeNote(...)` for a baked note, first check the source command for `userPos` and use `applyUserPos` with the item-local target rect instead. Notes baked per-item have item-local coordinates — verify the coordinate space (the loop places relative to the item's SVG viewBox, with an empty occupied set); if the spaces don't line up trivially, the acceptable v1 fallback is: a `userPos`-bearing note whose target is on the item still bakes at its AUTO position in the PDF, with a code comment saying so — do NOT ship broken PDF geometry. Run `npm run test:ink-reconstruct` and `npm run test:hand-stroke` after.

- [ ] **Step 9: Typecheck + suites**

Run: `npx tsc --noEmit && npm run test:ink-placement && npm run test:qpin && npm run test:ink-reconstruct && npm run test:student-marks && npm run test:render-sync`
Expected: all green.

- [ ] **Step 10: Manual drag check (dev server if available)**

In a live board with a tutor note: press-and-hold-drag a note → it follows the pointer, clamps at edges; a plain tap does nothing (no ghost drag); after drag, trigger a re-render (resize the window) → the note STAYS at its dragged spot (userPos survived); other notes never overlap the dragged note. If no browser available, mark for the post-deploy live check (triage marks E3 live-test).

- [ ] **Step 11: Commit**

```bash
git add src/lib/tutor/whiteboard/ink-placement.ts src/lib/knowledge/types.ts src/app/tutor/components/whiteboard/InkNotesOverlay.tsx src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx src/app/tutor/components/VoiceTutorRealtime.tsx src/lib/utils/export/whiteboard-capture.ts scripts/test-ink-placement.ts
git commit -m "feat(tutor): draggable ink-note annotations, persisted + replay/PDF-aware (R2 E3)"
```

---

## Final verification & rollout

- [ ] `npx tsc --noEmit` clean vs baseline; `npm run build` succeeds.
- [ ] Suite sweep: `npm run test:math-coverage && npm run test:inline-math && npm run test:question-anchor && npm run test:pedagogy-board-anchored && npm run test:pedagogy-posed-problem && npm run test:pedagogy-board-truth && npm run test:ink-placement && npm run test:qpin && npm run test:validate-tool-call`
- [ ] Merge the branch to main.
- [ ] Deploy: `./deploy-update.sh` ONLY (never `npm run deploy`). NOTE: main also carries the R35 follow-ups (200e5804 etc.) not yet deployed — deploying ships those too; that is expected.
- [ ] **Deploy the engine BEFORE the portal** (the portal's P2 countdown waits for `evelyn:session_started`).
- [ ] Live-test items (need a real embed session on prod): E1 second-tap actually ends the session at embed width; E3 drag on touch — plain-tap-to-mark on a draggable note still resolves (fix-1, review round 1) and a completed drag persists across resize; E3 finger-scroll starting on a note (touch-none tradeoff — a finger landing on a note's ≤240px rect drags instead of scrolling the board underneath it) — if scroll capture proves hostile on tablet, revisit with `touch-action: pan-y`; P2 countdown starts on mic tap.
