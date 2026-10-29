# Tutor Demo Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the free voice demo read as a teacher, not a machine: one visible Full screen control, legible board handwriting, spoken comparison signs, no stacked filler openers, an audible wrap and goodbye at the time box, and 20-minute demos on every portal.

**Architecture:** Every behavioural change is client-side or in a pure helper with its own `test:*` script; the brain prompt is untouched except that the idle-nudge directive (already a pure function) gains one boolean. Tenant behaviour is a partner row in `embed-ui-options.ts`; each change hides behind a `NEXT_PUBLIC_*` flag read as `!== 'off'`.

**Tech Stack:** Next.js (apps/tutor, apps/marketing), TypeScript, `npx tsx` script tests run by `npm run test:changed` / `test:all`; academy (Express + Mongoose) for the demo-settings defaults.

**Spec:** `docs/superpowers/specs/2026-10-29-tutor-demo-polish-design.md`

## Global Constraints

- Work only in worktree `/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-demo-polish` (engine + marketing) and `/Users/luke/Dev/academy` for Task 10's code change. Paths below are relative to `apps/tutor` unless stated.
- New flags: `NEXT_PUBLIC_TUTOR_HEADER_FULLSCREEN`, `NEXT_PUBLIC_TUTOR_NOTE_PRINT_HAND`, `NEXT_PUBLIC_TUTOR_ACK_OPENER_STRIP`, `NEXT_PUBLIC_TUTOR_TIMEBOX_FAREWELL` — defined in `src/lib/tutor/orchestrator/flags.ts` in the `TUTOR_DEMO_TOPIC_CHOICE` shape (`process.env.X !== 'off'`), default ON.
- Every new pure helper gets a `scripts/test-<name>.ts` with a `"test:<name>"` entry in `package.json` (the `check(name, cond)` pattern of `scripts/test-cover-layer.ts`); `test:changed` maps a test to the sources it imports, so import the helper with `@/…`.
- Fixed copy, verbatim: wrap line **"We've got about two minutes left, so let's finish this one."**; goodbye **"That's our time for today, {name}. Nice work."** → without a name **"That's our time for today. Nice work."**; header button **"Full screen"** / **"Exit full screen"**.
- Partner rows: `greenapple` and `gameclass` keep the cluster (`toolCluster: true`); engine default hides it.
- Demo numbers: `max_duration_minutes: 20`, `wrap_at_minutes: 18` everywhere; copy "20-minute demo".
- No live model calls in tests. One local voice run at the end (Task 11).
- Commit after each task; message prefix by area (`tts:`, `tutor:`, `marketing:`, `academy:`), ending with the session's attribution lines.

## Review Focus

1. A reply whose first sentence is only a filler ("Okay.") after an ack: the strip must leave the sentence alone (three-word floor), never emit an empty sentence. → Task 3 test `keeps a filler-only sentence`.
2. `<` with markup-like neighbours in prose ("use <b>bold</b>", "one<br>two"): tags must not become "less than b greater than". → Task 1: tag lookahead/lookbehind on the rules; tests pin `<br>`, `<span>`, `<b>` untouched and bare `x<y` converted.
3. The wrap minute arrives while the student is mid-sentence or the tutor is speaking: the line must wait, then speak once, never twice. → Task 8 test on the pure `decideWrapLine` helper.
4. The student taps End during the hard-stop farewell, or the hard stop fires during a host-end farewell: exactly one end, `ended_reason` of the first path wins. → Task 8 relies on the existing `endingRef` guard; the plan's step pins `reason` only on the first call (test on the helper `endReasonFor`).
5. Note reveal must not replay on page flips, resume or re-measure, and must honour reduced motion. → Task 7 keys the animation on first mount per note key and pins the CSS media query.

---

### Task 1: TTS — comparison signs, "point (", "N too" in prose

**Files:**
- Modify: `src/lib/tutor/voice/tts-pronunciation.ts` (the `MATH_OPERATOR_REPLACEMENTS` table ~line 270 and the prose pass that applies it)
- Test: `scripts/test-tts-pronunciation.ts` (existing; `assert` style)

**Interfaces:**
- Consumes: `rewriteForTTS(raw: string, opts?)` (existing export).
- Produces: nothing new; behaviour only.

- [ ] **Step 1: Add failing asserts** to `scripts/test-tts-pronunciation.ts`:

```ts
assert.match(rewriteForTTS('That gives 2 < 0 + 1, which is 2 < 1.'), /2 less than 0 \+ 1, which is 2 less than 1/);
assert.match(rewriteForTTS('Here is y < x + 1.'), /y less than x \+ 1/);
assert.match(rewriteForTTS('so x > 5 works'), /x greater than 5/);
assert.match(rewriteForTTS('a <= b and x >= −3'), /a less than or equal to b and x greater than or equal to negative 3/);
assert.match(rewriteForTTS('The point (0, 2) gives 2 < 1.'), /2 less than 1/);
assert.doesNotMatch(rewriteForTTS('one<br>two'), /less than|greater than/);
assert.doesNotMatch(rewriteForTTS('<span>hi</span>'), /less than|greater than/);
assert.doesNotMatch(rewriteForTTS('x<b>y</b>'), /less than|greater than/);
assert.match(rewriteForTTS('x<y'), /x less than y/);
assert.match(rewriteForTTS('Look at the point (2, 0) on the board.'), /point, \(?2/);
assert.match(rewriteForTTS('Check (0, 2) too.'), /as well/);
assert.doesNotMatch(rewriteForTTS('You too, Praveen.'), /as well/);
```

- [ ] **Step 2: Run** `npm run test:tts-pronunciation` — expected: the new asserts FAIL (the `<` ones spell nothing; `point (`/`too` unchanged).

- [ ] **Step 3: Implement** in `MATH_OPERATOR_REPLACEMENTS` (ordered: `<=`/`>=` before `<`/`>`), operand classes `L = [\p{L}\p{N})\]]`, `R = [\p{L}\p{N}(\[−-]`:
  - `(?<=L)\s*<=\s*(?=R)` → ` less than or equal to `; same for `>=`.
  - `(?<=L)\s*<\s*(?=R)` → ` less than `; `(?<=L)\s*>\s*(?=R)` → ` greater than `.
  - Every `<` rule carries the negative lookahead `(?!\/?[a-z][a-z0-9-]*\s*\/?>)` so a tag (`<br>`, `<b>`, `</span>`) is never an inequality; every `>` rule carries the negative lookbehind `(?<!<\/?[a-z][a-z0-9-]*\s*\/?)`.
  - `\bpoints?\s*\(` → `point, (` / `points, (` (keep plural).
  - `(?<=[\d)])\s+too\b` → ` as well`.
  Use the `u` flag. Existing `≤`/`≥` rules stay.

- [ ] **Step 4: Run** `npm run test:tts-pronunciation` — expected: PASS, exit 0.

- [ ] **Step 5: Commit** `tts: speak <, >, <=, >= in prose; "point (" gets a beat; "N too" → "as well"`.

---

### Task 2: Ack phrase list

**Files:**
- Modify: `src/lib/tutor/voice/ack-layer.ts:33-42` (`ACK_PHRASES`)
- Test: `scripts/test-ack-layer.ts` (existing)

- [ ] **Step 1: Add failing check** to `scripts/test-ack-layer.ts`:

```ts
const FILLER_OPENER = /^(okay|ok|alright|all right|so|right|now)\b/i;
check('no ack phrase opens with a filler the brain also uses', ACK_PHRASES.every((p) => !FILLER_OPENER.test(p)));
```

- [ ] **Step 2: Run** `npm run test:ack-layer` — expected: FAIL on that check.

- [ ] **Step 3: Remove** `"Okay, let's see."` from `ACK_PHRASES`. If an existing check pins the list length or a specific index, update that check to the new list (pickAck is index-based).

- [ ] **Step 4: Run** `npm run test:ack-layer` and `npm run test:cover-layer` — expected: both PASS (cover-layer's `generic` pool is `ACK_PHRASES`).

- [ ] **Step 5: Commit** `tutor: drop the "Okay, let's see." ack — it stacked on the brain's own "Okay," opener`.

---

### Task 3: Opener filler strip after an ack

**Files:**
- Create: `src/lib/tutor/voice/opener-filler.ts`
- Create: `scripts/test-opener-filler.ts`; add `"test:opener-filler": "npx tsx scripts/test-opener-filler.ts"` to `package.json`
- Modify: `src/lib/tutor/orchestrator/flags.ts` (add `TUTOR_ACK_OPENER_STRIP`)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — the ack site (~line 20509, `ack_spoken`) and the first-sentence site (~line 14089, `isFirstSentenceOfTurn`)

**Interfaces:**
- Produces: `stripOpenerFiller(sentence: string): { text: string; removed: string | null }` — pure. Removes `^\s*(okay|ok|alright|all right|so|right|now)\s*[,.—-]?\s+` (case-insensitive) when at least three words remain; re-capitalises the first letter of the remainder; otherwise returns the input with `removed: null`.

- [ ] **Step 1: Write the failing test** `scripts/test-opener-filler.ts`:

```ts
import { stripOpenerFiller } from '@/lib/tutor/voice/opener-filler';
check('strips Okay,', stripOpenerFiller("Okay, let's look at the point (2, 0).").text === "Let's look at the point (2, 0).");
check('strips Alright —', stripOpenerFiller('Alright — plug in x = 2.').text === 'Plug in x = 2.');
check('reports the word', stripOpenerFiller('So the origin is inside.').removed === 'So');
check('keeps a filler-only sentence', stripOpenerFiller('Okay.').removed === null);
check('keeps short remainder', stripOpenerFiller('Okay, go on.').removed === null);
check('keeps verdict openers', stripOpenerFiller('Exactly, that is the boundary line.').removed === null);
check('keeps "Not quite"', stripOpenerFiller('Not quite, check the sign again.').removed === null);
check('keeps words that start with ok', stripOpenerFiller('Oklahoma is a state with a long name.').removed === null);
```

- [ ] **Step 2: Run** `npm run test:opener-filler` — expected: FAIL (module not found).

- [ ] **Step 3: Implement** `stripOpenerFiller` in `src/lib/tutor/voice/opener-filler.ts` and add `export const TUTOR_ACK_OPENER_STRIP = process.env.NEXT_PUBLIC_TUTOR_ACK_OPENER_STRIP !== 'off';` to `flags.ts`.

- [ ] **Step 4: Run** `npm run test:opener-filler` — expected: PASS.

- [ ] **Step 5: Wire** in `VoiceTutorRealtime.tsx`: add `const ackSpokenThisTurnRef = useRef(false)`; set `true` right after the `ack_spoken` event; reset to `false` where the per-turn ack state is reset at dispatch of a new student turn (the same place `ackTurnIndex` advances). In the sentence loop, immediately after `const isFirstSentenceOfTurn = totalSentenceCount === 0;`, when `TUTOR_ACK_OPENER_STRIP && isFirstSentenceOfTurn && ackSpokenThisTurnRef.current`, run `stripOpenerFiller(sentence)`; on a removal replace `sentence` with `.text` (before the greeting strip and before TTS/caption use) and emit `onDebugEvent?.('opener_filler_stripped', removed)`.

- [ ] **Step 6: Add** `'opener_filler_stripped'` to the embed page's persisted event allowlist (`src/app/tutor-portal/embed/page.tsx` ~line 298) so it reaches the session row.

- [ ] **Step 7: Typecheck** `npx tsc --noEmit -p .` — expected: 0 errors.

- [ ] **Step 8: Commit** `tutor: strip a leading filler from the brain's first sentence when an ack already spoke`.

---

### Task 4: Idle nudge without an open question

**Files:**
- Modify: `src/lib/tutor/voice/idle-nudge.ts:172-190` (`idleNudgeDirective`)
- Modify: `scripts/test-idle-nudge.ts`
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (~line 1171 `questionPin` state; the `<VoiceTutorRealtime` props ~line 1635)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (new prop; the call at ~line 22306)

**Interfaces:**
- Produces: `idleNudgeDirective(opts: { v2: boolean; hasOpenQuestion?: boolean }): string`. With `v2 && hasOpenQuestion === false` the sentence "Offer a choice: more time, or a hint. A hint must NARROW the search — point at what to look at, or rule something out — and must not give the answer inside it." is replaced verbatim by "There is no problem on the table to hint at. Re-offer the choice or next step you last asked about, in different words, in one short sentence." The v1 text is unchanged for every input.
- New VTR prop `hasOpenQuestion?: boolean`; TutorSession passes `hasOpenQuestion={questionPin != null}`.

- [ ] **Step 1: Add failing checks** to `scripts/test-idle-nudge.ts`:

```ts
check('v2 default keeps the hint offer', idleNudgeDirective({ v2: true }).includes('more time, or a hint'));
check('v2 without a pin re-offers the choice', idleNudgeDirective({ v2: true, hasOpenQuestion: false }).includes('There is no problem on the table to hint at.'));
check('v2 without a pin has no hint offer', !idleNudgeDirective({ v2: true, hasOpenQuestion: false }).includes('more time, or a hint'));
check('v1 ignores the flag', idleNudgeDirective({ v2: false, hasOpenQuestion: false }) === idleNudgeDirective({ v2: false }));
```

- [ ] **Step 2: Run** `npm run test:idle-nudge` — expected: FAIL.

- [ ] **Step 3: Implement** the branch in `idleNudgeDirective`.

- [ ] **Step 4: Run** `npm run test:idle-nudge` — expected: PASS.

- [ ] **Step 5: Thread the prop:** VTR gets `hasOpenQuestion?: boolean`, mirrored into `hasOpenQuestionRef` (refs are what the nudge closure reads); the call becomes `idleNudgeDirective({ v2: TUTOR_IDLE_NUDGE_V2, hasOpenQuestion: hasOpenQuestionRef.current })`. TutorSession passes `hasOpenQuestion={questionPin != null}`.

- [ ] **Step 6: Typecheck** `npx tsc --noEmit -p .` — 0 errors. **Commit** `tutor: the idle nudge stops offering a hint when no question is pinned`.

---

### Task 5: `toolCluster` embed option, partner rows, cluster hidden

**Files:**
- Modify: `src/lib/tutor/portal/embed-ui-options.ts` (interface, `DEFAULT_EMBED_UI_OPTIONS`, `PARTNER_UI_DEFAULTS`, `resolveEmbedUiOptions`)
- Modify: `scripts/test-embed-ui-options.tsx`
- Modify: `src/lib/tutor/orchestrator/flags.ts` (`TUTOR_HEADER_FULLSCREEN`)
- Modify: `src/app/tutor/components/session/SessionStage.tsx` (new prop `toolCluster?: boolean`; the cluster block ~lines 1700-1780)
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (~line 2132, pass `toolCluster`)
- Modify: `src/app/tutor-portal/data/config-params.ts` (document `features.tool_cluster` next to `tools_low`)

**Interfaces:**
- Produces: `EmbedUiOptions.toolCluster: boolean` (token field `features.tool_cluster`), default `false`; partner rows `greenapple: { …, toolCluster: true }`, `gameclass: { …, toolCluster: true }`.
- `TUTOR_HEADER_FULLSCREEN` flag: when `'off'`, SessionStage renders the cluster regardless of `toolCluster` (today's behaviour).

- [ ] **Step 1: Add failing checks** to `scripts/test-embed-ui-options.tsx` in its existing style:

```ts
assert.equal(resolveEmbedUiOptions({}).toolCluster, false);
assert.equal(resolveEmbedUiOptions({ partner_id: 'greenapple' }).toolCluster, true);
assert.equal(resolveEmbedUiOptions({ partner_id: 'gameclass' }).toolCluster, true);
assert.equal(resolveEmbedUiOptions({ partner_id: 'gameclass' }).toolsLow, true);
assert.equal(resolveEmbedUiOptions({ partner_id: 'greenapple', features: { tool_cluster: false } }).toolCluster, false);
assert.equal(resolveEmbedUiOptions({ features: { tool_cluster: true } }).toolCluster, true);
```

- [ ] **Step 2: Run** `npm run test:embed-ui-options` — expected: FAIL (property missing / type error).

- [ ] **Step 3: Implement** the option and rows; add the flag. In SessionStage add prop `toolCluster?: boolean` and compute `const showToolCluster = !TUTOR_HEADER_FULLSCREEN || toolCluster === true;` — wrap the cluster's outer absolutely-positioned `<div>` in `{showToolCluster && (…)}`. The Q button (`showQBtn`) must still render when the cluster is hidden: move `renderQBtn` out of the cluster row into its own anchored element at the same top/right when `!showToolCluster`. TutorSession passes `toolCluster={uiOptions.toolCluster}` (same source as `toolsLow`). The retail `/tutor` page passes nothing (default hidden).

- [ ] **Step 4: Run** `npm run test:embed-ui-options` — PASS; `npx tsc --noEmit -p .` — 0.

- [ ] **Step 5: Commit** `tutor: board tool cluster is a partner option (GAC, GameClass keep it); hidden by default`.

---

### Task 6: Header Full screen button

**Files:**
- Modify: `src/app/tutor/components/session/SessionStage.tsx` (new prop `onFullscreenApi?: (api: FullscreenApi | null) => void`; the `canFullscreen`/`canExpand`/`isFullscreen`/`expanded`/`toggleFullscreen`/`requestExpand`/`requestCollapse` values ~lines 953-1020; the phone header row ~line 1646)
- Modify: `src/app/tutor/components/SessionControls.tsx` (new prop `fullscreen?: FullscreenApi | null`; the actions group ~line 331)
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (hold the api in state, pass to both)
- Create: `src/app/tutor/components/session/fullscreen-api.ts` (the type)

**Interfaces:**
- Produces: `export interface FullscreenApi { available: boolean; active: boolean; toggle: () => void }` — `available = canFullscreen || canExpand`, `active = isFullscreen || expanded`, `toggle` = `toggleFullscreen` when `canFullscreen`, else `expanded ? requestCollapse : requestExpand`. SessionStage calls `onFullscreenApi` from an effect whenever any of those change (and `null` on unmount).
- SessionControls renders, when `TUTOR_HEADER_FULLSCREEN && fullscreen?.available`, a button in the actions group before Export PDF: `<Maximize2>`/`<Minimize2>` icon + label `Full screen` / `Exit full screen` (`hidden sm:inline` label), `title` same text, `data-testid="header-fullscreen"`, `onClick={fullscreen.toggle}`.
- SessionStage phone row: next to `headerClock` inside the `sm:hidden` area render the same icon-only button when `TUTOR_HEADER_FULLSCREEN && api.available` (uses the stage's own values directly; no prop round-trip).

- [ ] **Step 1: Write a render test** `scripts/test-header-fullscreen.tsx` (add `"test:header-fullscreen"`), using `renderToStaticMarkup` as `test-embed-ui-options.tsx` does: render `<SessionControls … fullscreen={{ available: true, active: false, toggle() {} }} />` and assert the markup contains `data-testid="header-fullscreen"` and `Full screen`; with `active: true` assert `Exit full screen`; with `fullscreen={null}` assert the testid is absent. (If SessionControls cannot render server-side because of a browser-only import, test a small extracted `HeaderFullscreenButton` component instead and have SessionControls use it.)

- [ ] **Step 2: Run** `npm run test:header-fullscreen` — FAIL.

- [ ] **Step 3: Implement** the type, the button (extracted `HeaderFullscreenButton` in `fullscreen-api.ts`'s sibling file `HeaderFullscreenButton.tsx`), the SessionStage effect + phone slot, and the TutorSession plumbing (`const [fullscreenApi, setFullscreenApi] = useState<FullscreenApi | null>(null)`; `controlsEl` gets `fullscreen={fullscreenApi}`; `<SessionStage onFullscreenApi={setFullscreenApi}>`). Keep the cluster's own fullscreen button code untouched (it still renders for partners that show the cluster).

- [ ] **Step 4: Run** `npm run test:header-fullscreen` — PASS; `npx tsc --noEmit -p .` — 0.

- [ ] **Step 5: Manual check** on the dev server (`npm run dev` in `apps/tutor`, open `/tutor`): the header shows "Full screen"; clicking fills the window with the stage; the label flips; at 375px width the icon sits beside the clock. Record the result in the commit body.

- [ ] **Step 6: Commit** `tutor: labelled Full screen control in the session header (phones: beside the clock)`.

---

### Task 7: Handwriting — Kalam first, 24px, writing reveal

**Files:**
- Modify: `src/lib/tutor/whiteboard/note-font.ts` (family order; export the size)
- Modify: `src/app/tutor/components/whiteboard/InkNotesOverlay.tsx:33-35` (`NOTE_LINE_H`), `:66-70` (`noteFont`), `:1030-1045` (note div style), note element class for the reveal
- Modify: `src/lib/tutor/orchestrator/flags.ts` (`TUTOR_NOTE_PRINT_HAND`)
- Modify: `src/app/globals.css` (or the stylesheet InkNotesOverlay already uses) — keyframes `evelyn-note-reveal` and the reduced-motion rule
- Test: `scripts/test-note-font.ts` (new, `"test:note-font"`)

**Interfaces:**
- Produces in `note-font.ts`: `export const NOTE_FONT_PX: number` (24 when `TUTOR_NOTE_PRINT_HAND`, else 22), `export const NOTE_LINE_PX: number` (29 / 26), `export function noteFontFamilyVars(): string` → `'var(--font-kalam), var(--font-caveat), cursive'` when on, the old order when off; `resolveNoteFontFamilies()` reads the vars in that same order. `export function noteRevealMs(text: string): number` → `Math.min(2500, 70 * text.length)`.

- [ ] **Step 1: Write the failing test** `scripts/test-note-font.ts`:

```ts
check('kalam first', noteFontFamilyVars().startsWith('var(--font-kalam)'));
check('24px', NOTE_FONT_PX === 24 && NOTE_LINE_PX === 29);
check('reveal scales with length', noteRevealMs('ten chars!') === 700);
check('reveal caps at 2.5 s', noteRevealMs('x'.repeat(100)) === 2500);
```

- [ ] **Step 2: Run** `npm run test:note-font` — FAIL.

- [ ] **Step 3: Implement** the exports; InkNotesOverlay uses `NOTE_FONT_PX`, `NOTE_LINE_PX`, `noteFontFamilyVars()` in both `noteFont()` and the div style. Reveal: the note div gets `style.animation = \`evelyn-note-reveal ${noteRevealMs(text)}ms linear forwards\`` only on the render where the note key is first seen (a `useRef<Set<string>>` of revealed keys; keys already present on mount from a resume/page flip are added without animating), and `clipPath` initial `inset(0 100% 0 0)` via the keyframes (`from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) }`). CSS: `@media (prefers-reduced-motion: reduce) { .evelyn-note-reveal { animation: none !important; clip-path: none !important } }`. Flag off ⇒ no animation and old sizes.

- [ ] **Step 4: Run** `npm run test:note-font`, `npm run test:ink-placement`, `npm run test:ink-reconstruct` — all PASS (placement constants changed; fix any pinned numbers in those tests to the 24/29 values).

- [ ] **Step 5: Manual check** on the dev server: a session's `handwrite` note writes in left-to-right in Kalam; a page flip back shows the note instantly. Commit `tutor: board notes in an upright hand (Kalam 24px) with a writing reveal`.

---

### Task 8: Wrap line and spoken goodbye at the time box

**Files:**
- Create: `src/lib/tutor/voice/timebox-lines.ts`; test `scripts/test-timebox-lines.ts` (`"test:timebox-lines"`)
- Modify: `src/lib/tutor/orchestrator/flags.ts` (`TUTOR_TIMEBOX_FAREWELL`)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — `endSessionNowRef` type and body (~line 4603, ~26096-26185), the hard-stop effect (~25437-25455), a new wrap-line effect beside it, the `onEndSession` prop type (~line 870)
- Modify: `src/app/tutor-portal/embed/page.tsx` (`handleEndSession` already takes `reason`; no change expected — verify) and `src/app/tutor/components/session/TutorSession.tsx` / `src/app/tutor/page.tsx` where `onEndSession` is passed (forward the reason).

**Interfaces:**
- Produces (pure): `WRAP_LINE = "We've got about two minutes left, so let's finish this one."`; `goodbyeLine(studentName?: string | null): string` → `"That's our time for today, Praveen. Nice work."` / `"That's our time for today. Nice work."` (first word of the name, trimmed); `decideWrapLine(s: { wrapPhase: boolean; spoken: boolean; busy: boolean; midUtterance: boolean }): 'speak' | 'wait' | 'none'` → `'none'` unless `wrapPhase && !spoken`; `'wait'` when `busy || midUtterance`; else `'speak'`.
- `endSessionNowRef.current(opts?: { farewell?: string; reason?: 'time_limit' })` forwards `reason` to `onEndSession?.(reason)`.
- `onEndSession?: (reason?: 'time_limit') => void` (already so on VTR; make TutorSession and the retail page pass it through unchanged).

- [ ] **Step 1: Write the failing test** `scripts/test-timebox-lines.ts`:

```ts
check('goodbye with name', goodbyeLine('Praveen Tyagi') === "That's our time for today, Praveen. Nice work.");
check('goodbye without name', goodbyeLine(undefined) === "That's our time for today. Nice work.");
check('wrap: not in phase', decideWrapLine({ wrapPhase: false, spoken: false, busy: false, midUtterance: false }) === 'none');
check('wrap: speaks when free', decideWrapLine({ wrapPhase: true, spoken: false, busy: false, midUtterance: false }) === 'speak');
check('wrap: waits while busy', decideWrapLine({ wrapPhase: true, spoken: false, busy: true, midUtterance: false }) === 'wait');
check('wrap: waits mid-utterance', decideWrapLine({ wrapPhase: true, spoken: false, busy: false, midUtterance: true }) === 'wait');
check('wrap: once', decideWrapLine({ wrapPhase: true, spoken: true, busy: false, midUtterance: false }) === 'none');
```

- [ ] **Step 2: Run** `npm run test:timebox-lines` — FAIL.

- [ ] **Step 3: Implement** `timebox-lines.ts` and the flag.

- [ ] **Step 4: Run** `npm run test:timebox-lines` — PASS.

- [ ] **Step 5: Wire the goodbye.** In the hard-stop interval replace `onEndSession('time_limit')` with: when `TUTOR_TIMEBOX_FAREWELL` → `void endSessionNowRef.current({ farewell: goodbyeLine(studentName), reason: 'time_limit' })`, else the old call. In `endSessionNowRef.current` add `reason` to the opts type and end with `onEndSession?.(opts?.reason)`. Add event `timebox_farewell_spoken` next to the existing farewell transcript write.

- [ ] **Step 6: Wire the wrap line.** New effect beside the hard stop: active when `TUTOR_TIMEBOX_FAREWELL && sessionWrapMinutes != null && (sessionModeRef.current === 'demo' || (sessionModeRef.current != null && maxDurationExplicit))`; a 5 s interval computing `wrapPhase` exactly as the idle-nudge block does (~line 22248) and `busy` as that block does, `midUtterance` from `perceptionMidUtteranceRef.current`; on `'speak'`: set `wrapLineSpokenRef.current = true`, and speak through the bridge-line path (`realtime.speakText(line, pushTtsScriptForPerception(line))`, append a `{ role: 'tutor', text: line, id: \`tutor-${Date.now()}-wrap\` }` transcript entry, `onTranscriptUpdate`, `onTrackInteraction?.('message', line, undefined, 'tutor')`, `onDebugEvent?.('wrap_line_spoken', line)`); in text mode skip `speakText` and post the entry only. Clear the interval once spoken.

- [ ] **Step 7: Persist** `wrap_line_spoken` and `timebox_farewell_spoken` in the embed page's event allowlist (~line 298). Check `TutorSession`'s and `tutor/page.tsx`'s `onEndSession` handlers forward `reason` to `handleEndSession(reason)`.

- [ ] **Step 8: Typecheck** `npx tsc --noEmit -p .` — 0. **Commit** `tutor: time-boxed sessions say "two minutes left" and a goodbye before the hard stop ends them`.

---

### Task 9: Demo length on the engine demo page and the marketing site

**Files:**
- Modify: `src/app/tutor-portal/demo/components/EngineSelector.tsx:42-43` and `:209`
- Modify: `../marketing/src/components/demos/VoiceTutorLiveDemo.tsx:158-159`, `:385`, `:523`

- [ ] **Step 1: Edit** `max_duration_minutes: 10, wrap_at_minutes: 8` → `20`, `18` in both files; copy "10-minute demo" → "20-minute demo" (EngineSelector :209, VoiceTutorLiveDemo :385) and "free 10-minute demo" → "free 20-minute demo" (:523).

- [ ] **Step 2: Verify** `grep -rn "10-minute demo\|max_duration_minutes: 10" src ../marketing/src` returns nothing.

- [ ] **Step 3: Commit** `marketing+tutor: free demos run 20 minutes, wrap at 18`.

---

### Task 10: Academy demo settings — prod rows and code defaults

**Files (academy repo, `/Users/luke/Dev/academy`, worktree per its WORKFLOW):**
- Modify: `apps/api/src/models/DemoSettings.ts:26-27`, `apps/api/src/services/DemoSettingsService.ts:86-87`, `apps/api/src/services/DemoService.ts:624` (comment), `apps/api/src/http/routes/admin.ts:128` if the zod max (60) needs nothing — leave.
- Prod data: `crimsora.demosettings` and `evelyntutor.demosettings`, `{ key: 'demo' }`.

- [ ] **Step 1: Write the rows** (approved 2026-10-29 by Praveen for exactly these values), one DB at a time over the tunnel:

```bash
for d in crimsora evelyntutor; do mongosh --quiet "mongodb://127.0.0.1:2710/$d?directConnection=true" --eval 'db.demosettings.updateOne({key:"demo"},{$set:{durationMinutes:20,wrapAtMinutes:18}}); printjson(db.demosettings.findOne({key:"demo"},{durationMinutes:1,wrapAtMinutes:1}))'; done
```
Expected: both print `durationMinutes: 20, wrapAtMinutes: 18`.

- [ ] **Step 2: Academy code defaults:** in an academy worktree (`scripts/ops/wt.sh new academy-demo-20` or its equivalent per `/Users/luke/Dev/academy` WORKFLOW), change the model defaults 15/13 → 20/18, the `$setOnInsert` 15/13 → 20/18, the comment "15-minute budget" → "20-minute budget"; run the academy typecheck; commit `academy: demo defaults 20/18 (rows already updated in prod)`. Merge to academy main per its workflow; do NOT deploy academy (its main carries an unreviewed GAC web build).

- [ ] **Step 3: Check** a fresh crimsora.com demo start shows "20-minute demo" in the header copy (the API reads the row on every start). Record in the task note.

---

### Task 11: Gate, local voice run, deploys, memory

- [ ] **Step 1: Merge** `origin/main` into the worktree branch (`git fetch && git merge origin/main`), resolve, re-run the touched tests.

- [ ] **Step 2: Gate** — `npm run test:changed` in `apps/tutor`; it will demand `test:all` (VTR touched): run it. Expected: only the two baseline failures (`embed-debug-coverage`, `portal-student-scoping`) and, at most, a `brain-route-cache-blocks` flake that passes alone. Then `npm run build` in `apps/tutor` and in `apps/marketing` — 0 errors.

- [ ] **Step 3: Local voice run** (one): `npm run dev` in the worktree's `apps/tutor`; mint a Crimsora trial link with the scratch mint pattern from memory `project_demo_topic_choice_2026_10_28` with `max_duration_minutes: 3, wrap_at_minutes: 1`, `is_trial: true`. Verify by ear and in the session's debug events: `opener_filler_stripped` fires at least once over ~8 turns and no "Okay, … Okay, …" stack is heard; a `handwrite` note writes in; "2 < 1" is spoken "2 less than 1"; `wrap_line_spoken` at ~1:00; `timebox_farewell_spoken` then the end at 3:00 with `ended_reason: 'time_limit'` in the postMessage (DevTools console). Stop the dev server.

- [ ] **Step 4: Deploy**, one at a time from the worktree root, after `cmp .env.local.production ../../.env.local.production` (worktree vs root) is silent: `./deploy-tutor.sh`, then `./deploy-tutor-demo.sh`, then `./deploy-marketing.sh`. After each: process online with restarts 0, public URL 200, and the other build ids unchanged (GAC :3008 must not move). Served-artifact probe on :3007: `grep -c "Exit full screen" .next/static/chunks/**/*.js` on the box ≥ 1.

- [ ] **Step 5: Finish** — `scripts/ops/wt.sh finish`. Update memory `project_tutor_demo_polish_2026_10_29` with build ids + commits; retire its "plan not written" line in `MEMORY.md`.
