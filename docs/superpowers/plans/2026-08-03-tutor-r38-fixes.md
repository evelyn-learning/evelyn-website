# Tutor R38 — Five-Session Triage Fix Round

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 12 root-caused defects from the 2026-08-03 five-session triage (sessions embed-1785782727978, embed-1785738371329, session-1785670103078, session-1785689585145, session-1785553390273): false-praise verdict leak, embed persona/voice mismatch, ElevenLabs map gaps, per-voice speed, whiteboard title clip, number-line label doubling, Q-pin vanish, idle-nudge-during-wrap, language policy, audio-tail loss, replay asterisks.

**Architecture:** All engine repo (`/Users/luke/Dev/evelynlearning`). Pure-logic changes go in tested lib modules (repo convention: `scripts/test-*.ts` suites wired as `npm run test:<name>`); UI changes are thin JSX edits at documented file:line sites. No portal (academy) changes. No new deps.

**Tech Stack:** Next.js app, TypeScript, tsx test scripts, Cartesia sonic-3.5 / ink-2, KaTeX whiteboard renderers.

## Global Constraints

- Deploy is `./deploy-update.sh` from the engine repo ONLY (never `npm run deploy`); never chain after `cd`.
- Build checks must use `set -o pipefail` when piping (`npm run build | tail` masks failures).
- `npm run lint` is broken repo-wide (Next 16 removed `next lint`) — pre-existing, not a gate.
- `scripts/test-teacher-persona.ts` has 3 PRE-EXISTING failures on clean main (stale DEMO_TEACHERS "exactly 4" pins from the 18-persona geo ship). Task 4 updates persona voices and MUST fix those stale pins while touching that suite; do not count other suites' pre-existing failures against your task.
- TeacherPersonaWire is a frozen portal contract — field *values* may change, field *shapes* may not.
- Commit per task with conventional-commit messages; end commit messages with the Claude Code trailer already configured for this checkout.

---

### Task 1: Verdict-opener regex gap (`"Right — X."` bypasses the verdict hold)

**Files:**
- Modify: `src/lib/tutor/orchestrator/text-heuristics.ts:173`
- Test: find the suite that pins `isVerdictOpener` (`grep -rn "isVerdictOpener" scripts/ package.json`); add pins there. If none exists, add cases to `scripts/test-text-heuristics.ts` style suite nearest to it (follow whatever suite already imports from text-heuristics).

**Interfaces:**
- Produces: unchanged signature `isVerdictOpener(s: string): boolean`, now returning `true` for `"Right — one half."`, `"Yes — that's it."`, `"No — think again."`.

Root cause (session embed-1785738371329): `right[.!,]`, `yes[.!,]`, `no[.!,]` exclude whitespace/dashes (deliberately, to avoid "right now"/"no problem"), so `"Right — one half."` returned false → `fastOpenerEligible` in VoiceTutorRealtime.tsx (~:9489) voiced it ungated before the turn's own "…*one third*, not one half" arrived.

- [ ] **Step 1: Write failing pins.** Add to the suite:

```ts
// R38: "Right — X." / "Yes — X." verdict openers must be held (embed-1785738371329:
// "Right — one half." fast-opened ungated, then the same turn taught "one third").
assert(isVerdictOpener('Right — one half.') === true);
assert(isVerdictOpener('Yes — that is exactly the pattern.') === true);
assert(isVerdictOpener('No — look at the denominator again.') === true);
assert(isVerdictOpener('Right, one half.') === true);       // existing behavior, keep green
assert(isVerdictOpener('Right now, look at the board.') === false); // the FP the old charset guarded
assert(isVerdictOpener('No problem, take your time.') === false);
assert(isVerdictOpener('Yes and no — it depends on the base.') === true); // dash form still a verdict
```

- [ ] **Step 2: Run suite, verify the new dash-form pins FAIL.**
- [ ] **Step 3: Fix the regex.** In `text-heuristics.ts:173` replace the three tight alternatives:
  - `yes[.!,]` → `yes\s*[.!,—–-]`
  - `no[.!,]` → `no\s*[.!,—–-]`
  - `right[.!,]` → `right\s*[.!,—–-]`

  Em-dash `—`, en-dash `–`, hyphen `-` and punctuation are all verdict-shaped; a following WORD (`right now`, `no problem`) still fails to match because the class has no bare `\s`-then-letter path. Keep the existing `right\s+(?:idea|track|…)` alternative untouched.
- [ ] **Step 4: Run the suite green (all old pins + new).**
- [ ] **Step 5: Commit** `fix(tutor): hold "Right —"/"Yes —"/"No —" dash-form verdict openers (R38)`

---

### Task 2: Prompt verdict rules — bidirectional R32 + fix the contradictory exemplar

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts:433` (R32 rule), `:863` (exemplar)
- Test: `scripts/test-r33-prompt-rules.ts` pattern — find the prompt-rule pin suite (`grep -rn "r33-prompt-rules\|BASE_PROMPT" scripts/*.ts | head`) and add substring pins in the same style.

**Interfaces:** none (prompt text only).

- [ ] **Step 1: Write failing pins** asserting the built prompt contains the new bidirectional sentence and does NOT contain `"Right — 5."`:

```ts
assert(prompt.includes('Before speaking "Right." / "Yes." / "Exactly."'));
assert(!prompt.includes('✓ "Right — 5.'));
```

- [ ] **Step 2: Run, verify FAIL.**
- [ ] **Step 3: Edit the prompt.**
  1. At `:433`, after the existing "Not quite./Close." sentence, add the mirror branch:

  > `The same check runs in the PRAISE direction: Before speaking "Right." / "Yes." / "Exactly." (or any praise-class opener), silently name the value your OWN next sentence is about to teach and compare it to what the student proposed. If your explanation is about to say "…, not X" where X is what the student said, the verdict is WRONG: open "Not quite." — never affirm a value your own turn contradicts. A live session opened "Right — one half." and the SAME turn taught "you've gone one third of the way, not one half."`

  2. At `:863`, replace the exemplar `✓ "Right — 5. And one small refinement: keep the units, so it's 5 meters per second."` with `✓ "Right. 5. And one small refinement: keep the units, so it's 5 meters per second."` (the em-dash-merged form is banned by TURN_OPENER_RULE at ~:294 — the two rules currently contradict and the model follows the concrete example).
- [ ] **Step 4: Run pins green + `npx tsc --noEmit`.**
- [ ] **Step 5: Commit** `fix(tutor): bidirectional verdict-agreement rule + de-conflict the "Right — 5." exemplar (R38)`

---

### Task 3: Deterministic praise-then-contradiction backstop

**Files:**
- Create: `src/lib/tutor/voice/praise-contradiction.ts`
- Create: `scripts/test-praise-contradiction.ts` + package.json script `test:praise-contradiction`
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — wire at the same seam as `simplification-verdict-check.ts` (grep `simplificationVerdict` call site in VTR/callBrainOnce; mirror its kill+retry invocation exactly, including debug event emission — event name `praise_contradiction_kill`).

**Interfaces:**
- Produces: `detectPraiseContradiction(turnText: string): { affirmed: string } | null`

Deterministic shape (no LLM, no FP class): the turn's FIRST sentence opens with a praise-class verdict word followed by a short value phrase, and a LATER sentence in the same turn contains `not <that same phrase>`.

- [ ] **Step 1: Write failing tests:**

```ts
// The live failure, verbatim shape:
assert(detectPraiseContradiction(
  'Right — one half.\n\nThe mark on the board already shows *one third*, so let\'s connect it: ' +
  'landing on the first step after one move means you\'ve gone *one third* of the way, not one half.'
)?.affirmed === 'one half');
// Praise with no later contradiction → null:
assert(detectPraiseContradiction('Right — one half. Half the strip is shaded, exactly as you said.') === null);
// Corrective opener → null (other layers own that direction):
assert(detectPraiseContradiction('Not quite. It is one third, not one half.') === null);
// Contradiction of a DIFFERENT value → null (tutor may legitimately contrast):
assert(detectPraiseContradiction('Right — one third. Not one half, like the last one — one third.') === null);
// Emphasis asterisks around the token must not defeat the match:
assert(detectPraiseContradiction('Yes — 12. Careful though: the total is *10*, not 12.')?.affirmed === '12');
```

- [ ] **Step 2: Run FAIL** (`npx tsx scripts/test-praise-contradiction.ts`).
- [ ] **Step 3: Implement** (pure module, header comment naming session embed-1785738371329):

```ts
const PRAISE_OPENER_RE =
  /^\s*(?:right|yes|exactly|correct|perfect|spot on|that'?s (?:right|correct|it))\s*[—–,.:!-]\s*([^.!?\n]{1,40})[.!?]/i;

export function detectPraiseContradiction(turnText: string): { affirmed: string } | null {
  const m = turnText.match(PRAISE_OPENER_RE);
  if (!m) return null;
  const affirmed = m[1].replace(/\*/g, '').trim().replace(/\s+/g, ' ');
  if (!affirmed) return null;
  const rest = turnText.slice(m.index! + m[0].length).replace(/\*/g, '');
  const escaped = affirmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const contra = new RegExp(`\\bnot\\s+${escaped}\\b`, 'i');
  return contra.test(rest) ? { affirmed } : null;
}
```

  Last test case ("Right — one third. Not one half…") passes because the contradiction regex targets the AFFIRMED phrase only.
- [ ] **Step 4: Run tests green.**
- [ ] **Step 5: Wire into VTR** at the simplification-verdict seam: on full-turn accumulation, if `detectPraiseContradiction(attemptText)` fires → same performKill+retry path, corrective feedback string: `` `Your opener affirmed "${affirmed}" but your own explanation says "not ${affirmed}". Re-deliver the turn with the verdict and explanation agreeing — open with the TRUE verdict.` `` Emit debug event `praise_contradiction_kill`.
- [ ] **Step 6: `npx tsc --noEmit` + run the existing verdict suites** (`test:verdict-guard`, `test:simplification-verdict`, `test:arith-claim` — names in package.json) to confirm no interference.
- [ ] **Step 7: Commit** `feat(tutor): deterministic praise-then-contradiction kill (R38)`

---

### Task 4: Embed speaks the persona's real voice (Sameer ≠ coral)

**Files:**
- Modify: `src/lib/tutor/ai/teacher-persona.ts:97,124,150,175`
- Modify: `src/app/tutor-portal/embed/page.tsx:257-266`
- Test: `scripts/test-teacher-persona.ts` (fix its 3 stale pre-existing pins while here), `test:cartesia-registry`, `test:teacher-roster`.

**Interfaces:**
- Produces: the four original DEMO_TEACHERS declare `voice: { provider: 'cartesia', voiceId: <registry id> }`; embed page honors a teacher-declared openai voiceId when provider is `'openai'`.

Root cause: embed voice resolution recognizes ONLY `provider === 'cartesia'`; the four originals declare openai voices (Sameer=`ash`) so every embed session speaks the hardcoded `coral` default. Prod TTS engine is Cartesia and `/tutor` already resolves these personas to their registry Cartesia voices, so aligning the declarations fixes the embed at the source with zero new logic.

- [ ] **Step 1: Flip the four persona voice declarations** to match `cartesia-voice-registry.ts` TEACHER_VOICES exactly:
  - `ms-elena-vasquez` (:97): `{ provider: 'cartesia', voiceId: 'f786b574-daa5-4673-aa0c-cbe3e8534c02' }` // Katie
  - `mr-dev-khanna` (:124): `{ provider: 'cartesia', voiceId: '638efaaa-4d0c-442e-b701-3fae16aad012' }` // Sameer
  - `dr-amara-osei` (:150): `{ provider: 'cartesia', voiceId: 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4' }` // Skylar
  - `sofia` (:175): `{ provider: 'cartesia', voiceId: '62ae83ad-4f6a-430b-af41-a9bede9286ca' }` // Gemma

  Comment each: `// R38: declared voice now matches the registry voice actually used in prod — the embed reads THIS field and was falling back to openai 'coral' for every original persona.`
- [ ] **Step 2: Embed openai-branch honor** (defense for partner-supplied openai teachers). At `embed/page.tsx:257` replace:

```ts
const openAIVoice: OpenAIVoice = (config.voice as OpenAIVoice) || 'coral';
```

with:

```ts
// R38: an openai-provider teacher voice was silently discarded (only the
// cartesia branch below read teacher.voice) — honor its voiceId ahead of
// the token-level `voice` field and the 'coral' default.
const openAIVoice: OpenAIVoice =
  (config.teacher?.voice?.provider === 'openai' && config.teacher.voice.voiceId
    ? (config.teacher.voice.voiceId as OpenAIVoice)
    : (config.voice as OpenAIVoice)) || 'coral';
```

- [ ] **Step 3: Fix `scripts/test-teacher-persona.ts`** — update any pins asserting the old openai providers/voiceIds AND the 3 stale pre-existing DEMO_TEACHERS-count pins (memory: "exactly 4" pins stale since the 18-persona ship). Suite must end green.
- [ ] **Step 4: Run** `test:teacher-persona`, `test:cartesia-registry`, `test:teacher-roster`, `npx tsc --noEmit` — all green.
- [ ] **Step 5: Commit** `fix(tutor): embed speaks the persona's registry voice — originals declared dead openai voices (R38)`

---

### Task 5: ElevenLabs failover map — six missing geo-pool voices

**Files:**
- Modify: `src/lib/tutor/voice/elevenlabs-voice-map.ts:41-64`
- Test: `test:elevenlabs-voice-map` (add pins for all six).

Missing since the 2026-07-19 geo ship; each currently falls to default Sonya (American female) — including for male voices, the exact mid-session accent+gender flip the map exists to prevent. Only four ElevenLabs voices exist on the account (NAKUL, ANJURA, EARL, SONYA) — map nearest gender+accent, precedent set by the en-gb→American rows:

- [ ] **Step 1: Failing pins** for the six ids resolving to non-default expected values (Cooper→EARL will pass only after the fix since default is SONYA; assert exact values for all six).
- [ ] **Step 2: Add rows:**

```ts
  'c2ad7092-0447-47ea-948b-61fbb6faf153': SONYA,   // Grace — en-au female (nearest)
  '49743b08-0f5d-4741-839c-b12933853780': EARL,    // Cooper — en-au male (nearest)
  'efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f': ANJURA,  // Nadia — en-sg female (nearest)
  'ac5a9529-3965-4eac-b574-dce63664fbf4': NAKUL,   // Kiran — en-sg male (nearest)
  '263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18': SONYA,   // Zanele — en-za female (nearest)
  'baf84392-fa95-4d44-8871-d32ee36b0e01': EARL,    // Pieter — en-za male (nearest)
```

- [ ] **Step 3: Suite green. Commit** `fix(tutor): elevenlabs failover rows for the 6 geo-pool voices (R38)`

---

### Task 6: Per-voice TTS speed (Elena/Katie too fast)

**Files:**
- Modify: `src/lib/tutor/voice/cartesia-voice-registry.ts` (TeacherVoice type + Katie entries + resolveCartesiaVoice return)
- Modify: `src/app/tutor/hooks/useOpenAIRealtime.ts:3027-3030` and `:3121-3130` (speed merge)
- Modify: `src/app/tutor/hooks/useCartesiaSonicWS.ts:220-236` (WS `__experimental_controls`)
- Modify: whoever passes `voiceId` into the hook/synthesize so the resolved `speed` rides along (trace `cartesiaVoiceIdRef` producer; it is set where `resolveCartesiaVoice` is called — thread `speed` next to it as `cartesiaVoiceSpeedRef`).
- Test: `test:cartesia-registry` (add pins).

**Interfaces:**
- Produces: `resolveCartesiaVoice(opts): { voiceId: string; label: string; speed?: number }`; `SonicSynthesizeOpts` gains optional `speed?: string | number`.

Elena resolves to Katie (`f786b574…`, also CARTESIA_DEFAULT and the en-us female pool voice) which measures ~22 chars/s vs the 14–17 baseline. Cartesia accepts `voice.__experimental_controls.speed` ∈ presets | [-1, 1]; the HTTP route already clamps/forwards; the WS path sends nothing today.

- [ ] **Step 1: Failing pins:** `resolveCartesiaVoice({ teacherId: 'ms-elena-vasquez' }).speed === -0.25`; a no-speed voice (e.g. `mr-dev-khanna`) returns `speed === undefined`; the bare-default resolve (`{}`) also carries `-0.25` (it IS Katie).
- [ ] **Step 2: Registry change:** add `/** Optional Cartesia __experimental_controls.speed offset ∈ [-1,1] — per-voice cadence normalization (R38: Katie ≈22 chars/s vs 14–17 baseline). */ speed?: number;` to `TeacherVoice` and `VoiceEntry`; set `speed: -0.25` on: `ms-elena-vasquez`, the `en-us` ACCENT_POOLS female row (same Katie id), and thread through `resolveCartesiaVoice` returns (`{ voiceId, label, speed: teacher.speed }` etc.) including the default branch (`return { voiceId: CARTESIA_DEFAULT_VOICE_ID, label: DEFAULT_LABEL, speed: TEACHER_VOICES['ms-elena-vasquez'].speed }`). Do NOT touch the en-in localized Katie row (different voice model, unmeasured).
- [ ] **Step 3: HTTP path merge** at `useOpenAIRealtime.ts:3027`: student "slow" toggle wins; else per-voice speed:

```ts
const voiceSpeed = cartesiaVoiceSpeedRef.current; // number | undefined, set beside cartesiaVoiceIdRef
const speed = speakingRateRef.current === 'slow' ? (useCartesia ? 'slow' : 0.85)
            : (useCartesia ? voiceSpeed : undefined);
```

  Mirror in `fetchCartesiaStreamedHead` (:3121). `'normal'`+no-voice-speed still omits the field (byte-identical requests).
- [ ] **Step 4: WS path:** `SonicSynthesizeOpts` gains `speed?: string | number`; in `synthesize` (:224) build `voice` with `...(opts.speed !== undefined ? { __experimental_controls: { speed: opts.speed } } : {})`. Update the WS caller to pass the same merged speed value as Step 3. Comment: `// R38: WS path previously sent NO speed at all — a per-voice fix applied only to the HTTP route silently skips most sentences when NEXT_PUBLIC_TUTOR_TTS_WS=on.`
- [ ] **Step 5:** `npx tsc --noEmit`, `test:cartesia-registry` green, plus a manual dev listen-check note for the user gate (Katie audibly slower, others unchanged).
- [ ] **Step 6: Commit** `feat(tutor): per-voice cartesia speed normalization; Katie -0.25, wired through HTTP + WS paths (R38)`

---

### Task 7: FractionBar title clips on both sides

**Files:**
- Modify: `src/app/tutor/components/whiteboard/FractionBarRenderer.tsx:379-433`
- Test: visual — plus `npx tsc --noEmit`; if a renderer snapshot/collision suite covers FractionBar (grep `FractionBar` in `scripts/`), run it.

Move the title OUT of the SVG to an HTML heading, mirroring `NumberLineRenderer.tsx:323-328` exactly (its `<h3 className="text-sm font-semibold text-slate-700 text-center"><InlineMathText text={title} /></h3>` wraps naturally and never clips).

- [ ] **Step 1:** Wrap the returned `<svg>` in `<div className="w-full flex flex-col items-center gap-2">…</div>`; render `{title && (<h3 className="text-sm font-semibold text-slate-700 text-center"><InlineMathText text={title} /></h3>)}` above the svg (import InlineMathText as NumberLineRenderer does; keep `mathifyDollarSpans` OUT — InlineMathText handles `$…$`).
- [ ] **Step 2:** Delete the `<text …>{mathifyDollarSpans(title)}</text>` block (:421-433) and remove the `(title ? TITLE_HEIGHT : 0)` contribution at `:382` (title no longer occupies viewBox rows; delete the now-unused `TITLE_HEIGHT` const if nothing else reads it). Keep `aria-label={title ?? …}`.
- [ ] **Step 3:** `npx tsc --noEmit`; dev-render a one-circle fraction (`{numerator:1, denominator:4, style:'circle'}` with the long title `"One pizza, cut into 4 equal slices"`) and confirm full title text wraps/centers un-clipped.
- [ ] **Step 4: Commit** `fix(whiteboard): FractionBar title as HTML heading — centered SVG text clipped both ends at shape-width viewBoxes (R38)`

---

### Task 8: Number-line doubled tick labels

**Files:**
- Modify: `src/app/tutor/components/whiteboard/NumberLineRenderer.tsx:247`
- Test: renderer label-collision harness — add fixture `scripts/label-collision-fixtures/` if a number-line fixture pattern exists (grep first); otherwise a small pin script is overkill — assert via the existing suite if reachable, else document manual check.

Dedup epsilon `1e-9` can never absorb a decimal-approximated step (`|0.333333 − 1/3| ≈ 3.3e-7`), so both passes print "0.3333" at the same pixel.

- [ ] **Step 1:** Replace `:247`:

```ts
// R38 (embed-1785738371329): step=0.333333 vs fractionTicks 1/3 differ by
// ~3e-7 — far over the old 1e-9 epsilon, so both passes printed "0.3333"
// at the same pixel. Compare in step-relative units instead.
if (!ticks.some((t) => Math.abs(t - v) < step * 1e-3)) {
```

- [ ] **Step 2:** `npx tsc --noEmit`; dev-render `{min:0,max:1,step:0.333333,fractionTicks:{denominator:3,showLabels:true}}` → single label per tick. Also render `{min:0,max:1,step:0.25,fractionTicks:{denominator:3}}` → fraction ticks at 1/3, 2/3 still present (no over-dedup).
- [ ] **Step 3: Commit** `fix(whiteboard): number-line fraction-tick dedup epsilon — decimal steps double-printed labels (R38)`

---

### Task 9: Q-pin must survive non-question tutor turns (idle nudge killed it)

**Files:**
- Modify: `src/app/tutor/components/session/TutorSession.tsx:642` and `:843-845`
- Test: `src/lib/tutor/qpin-behavior.ts` + `test:qpin` — add a pure helper + pins.

Today the render gate `lastTutorEntry?.id === questionPin.turnId` (:845) hides the pin the moment ANY newer tutor entry exists — the idle-nudge reply and `historyOnly` tool-turn placeholders both do it, and since neither asks a question, no replacement pin ever forms. New semantics: **a pin persists until dismissed or replaced by a newer turn's pin.**

- [ ] **Step 1: Pure helper + failing pins** in `qpin-behavior.ts`:

```ts
/** R38: the pin's owning turn no longer needs to be the LATEST tutor turn —
 *  an idle-nudge line or a board-only (historyOnly) turn must not kill an
 *  unanswered question. The pin dies only by ✕ dismiss or replacement
 *  (the gist effect sets a NEW pin when a newer turn asks a question). */
export function latestSubstantiveTutorEntry<T extends { role: string; historyOnly?: boolean }>(
  transcript: T[],
): T | undefined {
  return [...transcript].reverse().find((t) => t.role === 'tutor' && !t.historyOnly);
}
```

  Pins: returns the last non-historyOnly tutor entry; skips a trailing historyOnly entry; returns undefined on empty/no-tutor transcripts.
- [ ] **Step 2: Run `test:qpin` — new pins FAIL.** Implement, run green.
- [ ] **Step 3: TutorSession edits:**
  1. `:642` → `const lastTutorEntry = latestSubstantiveTutorEntry(transcript);` (verify `historyOnly` is the actual TranscriptEntry field name — grep `historyOnly` in VoiceTutorRealtime.tsx ~:12120; adapt if it's `meta.historyOnly`).
  2. `:843-845` render gate: drop the staleness clause —

```tsx
const questionPinEl =
  TUTOR_QUESTION_PIN && questionPin && pinShownForTurn === questionPin.turnId ? ( …
```

  with a comment: `// R38: no lastTutorEntry staleness clause — the pin persists across non-question tutor turns (idle nudge, board-only) and is retired only by ✕ or by the gist effect pinning the NEXT question.`
  3. Check the reveal effect at `:812-826`: its `questionPin.turnId !== lastTutorFinal?.id` early-return would deadlock a pin whose turn was superseded before reveal — change that guard to only apply while `voiceState === 'speaking'` (i.e., when the probe loop is meaningful); otherwise mark shown immediately (the existing non-speaking branch).
- [ ] **Step 4:** `npx tsc --noEmit`; `test:qpin` green; manual dev check: pin stays through an idle nudge, ✕ still dismisses, next question replaces.
- [ ] **Step 5: Commit** `fix(tutor): Q-pin persists until dismissed or replaced — idle nudge/board-only turns no longer kill it (R38)`

---

### Task 10: Suppress idle nudge during the demo wrap phase

**Files:**
- Modify: `src/lib/tutor/voice/idle-nudge.ts` (decideIdleNudge arg), `src/app/tutor/components/VoiceTutorRealtime.tsx:13608-13634` (wiring)
- Test: `test:idle-nudge`.

User-approved product call: after the sticky "Wrap up NOW" directive (elapsed ≥ wrapAtMinutes) the tutor has delivered its one allowed sign-off; a nudge there can only force a second sign-off. Non-demo sessions carry no wrap phase → zero change elsewhere.

- [ ] **Step 1: Failing pins:** `decideIdleNudge({ busy:false, hidden:false, wrapPhase:true, state:fresh }) === 'stand-down'`; `wrapPhase:false` still `'fire'`; wrapPhase beats recheck (`busy:true, wrapPhase:true` → `'stand-down'`, not `'recheck'` — the phase never un-wraps, so re-polling is pointless).
- [ ] **Step 2: Implement:** add to the args interface `/** R38: elapsed ≥ wrapAtMinutes on a time-boxed demo — the wrap directive owns the endgame; a nudge here collides with the one-sign-off rule. Never true for non-demo sessions. */ wrapPhase: boolean;` and put `if (args.wrapPhase) return 'stand-down';` FIRST in the function. Run pins green.
- [ ] **Step 3: VTR wiring** in `fireOrRecheck` (:13613): compute alongside `busy`/`hidden`:

```ts
const startedAtMs = voiceSessionStartedAtMsRef.current ?? sessionStartMsRef.current;
const wrapPhase =
  sessionWrapMinutes != null &&
  (sessionModeRef.current === 'demo' || (sessionModeRef.current != null && maxDurationExplicit)) &&
  Math.floor((Date.now() - startedAtMs) / 60000) >= sessionWrapMinutes;
```

  (the same eligibility predicate as the demoStop payload at :8230 — copy its exact ref/prop names) and pass `wrapPhase` to `decideIdleNudge`. If `sessionWrapMinutes`/`maxDurationExplicit` aren't in scope at :13613, thread them via refs the way `sessionModeRef` already is.
- [ ] **Step 4:** `npx tsc --noEmit`; `test:idle-nudge` green.
- [ ] **Step 5: Commit** `feat(tutor): stand down idle nudge during demo wrap phase (R38, user call)`

---

### Task 11: Language policy — one language per session

**Files:**
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts:361-365` (Rule 5) and `:1751-1752` (delete legacy paragraph)
- Test: prompt-pin suite from Task 2 (add pins).

User-approved policy: the session's language is fixed for the whole session; the tutor never switches mid-session, even on an explicit request. On a switch request it delivers (verbatim-ish) the user's approved line.

- [ ] **Step 1: Failing pins:** prompt contains `each session sticks to one language`; prompt does NOT contain `## Multilingual Support` nor `respond in the same language mix`.
- [ ] **Step 2: Rewrite Rule 5** (replace :361-365 wholesale):

> **Rule 5 — One language per session (HARD RULE).** The session's language is the language the session started in, and it stays fixed for the WHOLE session. Never switch languages mid-session — not for a single anomalous turn, and not even when the student explicitly asks. Speech recognition occasionally hallucinates a transcript in a different language: if a turn arrives in another language, treat it as a misrecognized utterance in the session language, reply in the session language, and ask the student to repeat.
>
> **When the student asks you to switch languages**, decline warmly with, in substance: "I can teach in Hindi, Spanish, French, Japanese and about a dozen others — but each session sticks to one language. You would need to write to support to know how I can teach in another language." Say it in the session language, then continue the lesson. Do not list more languages than that, do not promise the switch will work mid-session, and do not switch.

- [ ] **Step 3: Delete** the `## Multilingual Support` block at `:1751-1752` (it contradicts Rule 5 and promises Hinglish/Spanish mirroring the STT/TTS stack cannot deliver — Ink-2 is English-only and Cartesia is pinned `language:'en'`; leave a one-line comment in the code noting why it was removed and referencing this plan).
- [ ] **Step 4:** pins green, `npx tsc --noEmit`. Also re-run any suite pinning Rule 5 text (grep `Language lock` in `scripts/`).
- [ ] **Step 5: Commit** `feat(tutor): one-language-per-session policy — no mid-session switches, supported-languages line (R38, user call)`

---

### Task 12: Audio recording tail loss on tab close

**Files:**
- Modify: `src/app/tutor/hooks/useAudioRecorder.ts:60` (interval) + new visibility flush effect
- Test: `npx tsc --noEmit` + manual (loss window is a browser-teardown behavior; no unit seam).

session-1785553390273 lost ~10s of HEARD audio: 30s flush interval + the pagehide flush is a non-keepalive fetch (~480KB/track ≫ the 64KB keepalive quota, so keepalive can't carry it either). Fix = shrink the exposure window, don't pretend to close it:

- [ ] **Step 1:** `flushIntervalMs = 30000` → `10000` (:24 doc-comment + :60 default). 10s of PCM16@24kHz ≈ 480KB/track per flush — same order as today's periodic bodies, 3× the request rate, negligible server load (append-only route).
- [ ] **Step 2: Visibility flush** — new effect beside the pagehide one:

```ts
// R38: flush immediately when the tab goes hidden. On mobile, close/switch
// fires visibilitychange→hidden while the page can still run a NORMAL
// fetch (no keepalive body cap) — this catches most aborted-close tails
// that the pagehide keepalive path cannot carry (~64KB quota vs ~480KB of
// 10s PCM). Worst-case loss drops from flushIntervalMs to seconds.
useEffect(() => {
  if (!enabled) return;
  const onVis = () => { if (document.visibilityState === 'hidden') void flush().catch(() => {}); };
  document.addEventListener('visibilitychange', onVis);
  return () => document.removeEventListener('visibilitychange', onVis);
}, [enabled, flush]);
```

- [ ] **Step 3:** Update the pagehide comment (:234-240) to note the new honest bound: residual loss = audio buffered after the last hidden/interval flush when the tab is destroyed without going hidden first (desktop ⌘W), ≤10s.
- [ ] **Step 4:** `npx tsc --noEmit`. **Commit** `fix(tutor): 10s recording flush + visibilitychange flush — tab-close tail loss shrinks 30s→~0-10s (R38)`

---

### Task 13: Replay transcripts render `*emphasis*` raw

**Files:**
- Create: `src/app/tutor/components/inline-emphasis.tsx` (hoisted from TranscriptView)
- Modify: `src/app/tutor/components/TranscriptView.tsx:76-101` (import instead of local), `src/app/admin/tutor-sessions/components/ReplayPlayer.tsx:82` (TranscriptBubble)
- Test: `npx tsc --noEmit` + dev check of both surfaces (student `/tutor-portal/replay` shares TranscriptBubble).

- [ ] **Step 1: Hoist** `renderInlineEmphasis` (TranscriptView.tsx:76-101) verbatim into the new module, exported; TranscriptView imports it (delete the local copy). Zero behavior change on the drawer.
- [ ] **Step 2: Apply in TranscriptBubble.** ReplayPlayer.tsx:82 currently renders `<InlineMathText text={entry.text} />` for the whole body. Emphasis must not run INSIDE `$…$` math. Reuse TranscriptView's own approach: its `renderBubbleText` (:62-74) already splits math from prose and routes prose through `renderInlineEmphasis` — export a bubble-body renderer from the new module (move `renderBubbleText`'s split logic there too if it has no other TranscriptView-local deps) and call it from BOTH TranscriptView and TranscriptBubble. If `renderBubbleText` is too entangled, replicate only its split-then-emphasize core in the shared module and leave TranscriptView untouched this round.
- [ ] **Step 3:** Dev check: admin replay + `/tutor-portal/replay` for a session containing `*1* out of *3*` → italics, and a `$\frac{1}{3}$` message still renders KaTeX. `npx tsc --noEmit`.
- [ ] **Step 4: Commit** `fix(replay): render *emphasis* in replay transcript bubbles — was raw asterisks on admin AND student replay (R38)`

---

### Task 14: Full battery + ship gate

- [ ] **Step 1:** Run every suite touched this round + the standing battery: `test:teacher-persona`, `test:cartesia-registry`, `test:teacher-roster`, `test:elevenlabs-voice-map`, `test:qpin`, `test:idle-nudge`, `test:cover-layer`, `test:math` (regression canary for text-heuristics), the verdict suites, and new `test:praise-contradiction`. All green (pre-existing failures documented in Global Constraints excepted ONLY if a task didn't touch that suite).
- [ ] **Step 2:** `set -o pipefail; npm run build 2>&1 | tail -20` — clean.
- [ ] **Step 3:** Check for active sessions before any deploy: `ssh root@84.247.185.169 'cd /root/evelynlearning && export $(grep -E "^MONGODB_URI=" .env.local) && npx tsx scripts/inspect-tutor-session.ts --since 1h'`.
- [ ] **Step 4:** Merge branch → main, push. Deploy via `./deploy-update.sh` (from the engine repo root, never chained after `cd`). Bundle-verify by grepping `.next/static/chunks` on the server for a distinctive new literal (e.g. `praise_contradiction_kill`).
- [ ] **Step 5:** Post-ship live-verify list for the user: Sameer demo speaks Indian voice; Katie/Elena audibly slower; "Right —" wrong-answer confirm gone; Q-pin survives idle nudge; no nudge after demo wrap; fraction titles wrap; number-line labels single; replay emphasis italic; language-switch request gets the support line.
