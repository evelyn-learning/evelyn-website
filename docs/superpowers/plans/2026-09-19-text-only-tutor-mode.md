# Text-Only Tutor Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Honour the embed token's `input_mode: 'text'` claim with a partner-level text-only tutor (Option C layout): student types, tutor replies in text revealed sentence-by-sentence in step with the whiteboard, no mic, no audio, mode persisted and reported.

**Architecture:** A pure resolver turns the token claim + a kill switch into `sessionMode: 'voice' | 'text'`, threaded exactly like `ttsProvider` (embed page → `TutorSession` → `VoiceTutorRealtime` / `SessionStage`). Text mode forces the existing `'silent'` TTS provider (zero-filled audio keeps every sentence/render-sync timer alive) at a reading pace, never opens the mic, pins the transcript panel open, and promotes the existing typed-input form to the composer. Every change is behind `sessionMode === 'text'`; voice sessions are untouched by construction.

**Tech Stack:** Next.js 15 app router (apps/tutor), React 19, TypeScript, Mongoose (`TutorSession`), tsx test scripts registered as `test:*` in `apps/tutor/package.json` (run by `npm run test:all`), Playwright e2e harness `scripts/tutor-e2e/run.ts`, portal contract `@evelyn/portal-contract` (sibling repo `/Users/luke/Dev/portal-contract`, git-tag pinned).

**Spec:** `docs/superpowers/specs/2026-09-19-text-only-tutor-mode-design.md`

## Global Constraints

- Work in a linked worktree (`.claude/worktrees/<name>`), never the repo root; deploy with `./deploy-tutor.sh` from the worktree only (four-session protocol Rule 1).
- Text mode is selected ONLY by the signed embed-token claim `input_mode === 'text'` AND `NEXT_PUBLIC_TUTOR_TEXT_MODE !== 'off'`. No URL override on the retail `/tutor` page.
- Kill switch defaults ON (`!== 'off'` house rule). It is a build-time `NEXT_PUBLIC_` flag: it must be in the env AT BUILD TIME to take effect.
- Every text-mode branch is guarded by `sessionMode === 'text'`; a voice session must produce a byte-identical DOM and identical debug-event stream before/after this plan (Task 12 measures it).
- No new npm dependencies. No changes to `packages/core` (174 marketing importers).
- Reading pace `TEXT_MODE_SECONDS_PER_WORD = 0.35`, overridable by `NEXT_PUBLIC_TUTOR_TEXT_MODE_SPW`.
- Partner-embed brain turns already pass `allowFallback:false` (main `c30bbcad`); text mode inherits it.
- Docs: text-only is `$0.12/min` everywhere (`01-product-description.md` still says `$0.02` — fixed in Task 11).

---

## File map

| File | Responsibility in this plan |
|---|---|
| `apps/tutor/src/lib/tutor/voice/resolve-session-mode.ts` (new) | Pure resolver: claim + kill switch → `SessionMode` |
| `apps/tutor/scripts/test-session-mode.ts` (new) | Unit test for the resolver |
| `apps/tutor/src/lib/tutor/voice/resolve-tts-provider.ts` | Gains a `mode` input: text ⇒ `'silent'` |
| `apps/tutor/src/app/tutor/hooks/useOpenAIRealtime.ts` | Per-mode silent pacing (`secondsPerWord` option) |
| `apps/tutor/src/app/tutor-portal/embed/page.tsx` | Resolves `sessionMode` from `config.input_mode`, passes it down |
| `apps/tutor/src/app/tutor/components/session/TutorSession.tsx` | Threads `sessionMode`; no caption ticker in text mode; composer status slot |
| `apps/tutor/src/app/tutor/components/session/SessionStage.tsx` | `sessionMode` prop: drawer pinned open, board bottom clearance, no orb/mic semantics, "Text session" chip |
| `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` | `sessionMode` prop: primary composer, no mic/perception/warm-up, relaxed connected gate, idle-nudge keystroke reset, mic-warning suppression, prompt clause input |
| `apps/tutor/src/lib/tutor/ai/system-prompt-builder.ts` | `inputMode` context → text-mode clause |
| `apps/tutor/src/lib/tutor/portal/session-summary.ts` | `mode` in the partner summary |
| `/Users/luke/Dev/portal-contract` | `SessionSummary.mode?: 'voice' \| 'text'` → v1.18.0 |
| `apps/tutor/src/lib/tutor/recordings/filters.ts` + `apps/tutor/src/app/admin/tutor-sessions/page.tsx` | `mode` filter + tag in the Status cell |
| `packages/core/src/models/DemoSession.ts` (schema field only) + `apps/marketing/src/app/api/demos/track/route.ts` + `apps/tutor/src/app/admin/demos/DemoAnalyticsDashboard.tsx` + `apps/marketing/src/app/products/voice-tutor/page.tsx` | Demo Analytics voice/text |
| `apps/tutor/scripts/tutor-e2e/run.ts` + `scenarios/text-mode-factoring.ts` (new) | Embed-token text-mode e2e |
| `docs/whitelabel/01-product-description.md`, `02-technical-integration-spec.md` | Reconciled copy |

---

### Task 1: Session-mode resolver

**Files:**
- Create: `apps/tutor/src/lib/tutor/voice/resolve-session-mode.ts`
- Create: `apps/tutor/scripts/test-session-mode.ts`
- Modify: `apps/tutor/package.json` (add `"test:session-mode"` next to `"test:verdict-guard"`)

**Interfaces:**
- Produces: `export type SessionMode = 'voice' | 'text'`; `export function resolveSessionMode(tokenInputMode: string | null | undefined, killSwitch: string | undefined): SessionMode`; `export const TEXT_MODE_SECONDS_PER_WORD = 0.35`; `export function textModeSecondsPerWord(env: string | undefined): number`.

- [ ] **Step 1: Write the failing test**

`apps/tutor/scripts/test-session-mode.ts`:
```ts
/** resolveSessionMode: text ONLY when the token claim is 'text' and the kill switch is not 'off'. */
async function main() {
  const { resolveSessionMode, textModeSecondsPerWord, TEXT_MODE_SECONDS_PER_WORD } =
    await import('@/lib/tutor/voice/resolve-session-mode');
  const checks: Array<[string, boolean]> = [
    ["claim 'text', switch unset → text", resolveSessionMode('text', undefined) === 'text'],
    ["claim 'text', switch 'on' → text", resolveSessionMode('text', 'on') === 'text'],
    ["claim 'text', switch 'off' → voice", resolveSessionMode('text', 'off') === 'voice'],
    ["claim 'voice' → voice", resolveSessionMode('voice', undefined) === 'voice'],
    ['claim undefined → voice', resolveSessionMode(undefined, undefined) === 'voice'],
    ['claim garbage → voice', resolveSessionMode('TEXT ', undefined) === 'voice'],
    ['spw default 0.35', textModeSecondsPerWord(undefined) === TEXT_MODE_SECONDS_PER_WORD],
    ['spw env parsed', textModeSecondsPerWord('0.5') === 0.5],
    ['spw env garbage → default', textModeSecondsPerWord('fast') === TEXT_MODE_SECONDS_PER_WORD],
    ['spw env non-positive → default', textModeSecondsPerWord('0') === TEXT_MODE_SECONDS_PER_WORD],
  ];
  let fail = 0;
  for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
  console.log(`${checks.length - fail}/${checks.length} passed`);
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Register and run it to verify it fails**

In `apps/tutor/package.json`, after the `"test:verdict-guard"` line add:
```json
    "test:session-mode": "npx tsx scripts/test-session-mode.ts",
```
Run: `cd apps/tutor && npm run -s test:session-mode`
Expected: FAIL — `Cannot find module '@/lib/tutor/voice/resolve-session-mode'`.

- [ ] **Step 3: Write the resolver**

`apps/tutor/src/lib/tutor/voice/resolve-session-mode.ts`:
```ts
/**
 * Session input-mode resolution (text-only tutor mode, 2026-09-19).
 *
 * Text mode is PARTNER-LEVEL: it is selected only by the signed embed-token
 * claim `input_mode: 'text'`. A kill switch (`NEXT_PUBLIC_TUTOR_TEXT_MODE`,
 * default ON per the house rule) makes the claim inert again — i.e. exactly
 * today's behaviour, where the claim is forwarded to analytics and ignored.
 *
 * Pure module: zero imports — server- and client-safe, unit-tested by
 * scripts/test-session-mode.ts.
 */
export type SessionMode = 'voice' | 'text';

export function resolveSessionMode(
  tokenInputMode: string | null | undefined,
  killSwitch: string | undefined,
): SessionMode {
  if (killSwitch === 'off') return 'voice';
  return tokenInputMode === 'text' ? 'text' : 'voice';
}

/** Reading pace for the silent clock in text mode (real speech ≈ 0.37 s/word;
 *  the harness's 0.15 would race the board ahead of a reader). */
export const TEXT_MODE_SECONDS_PER_WORD = 0.35;

export function textModeSecondsPerWord(env: string | undefined): number {
  const n = Number(env);
  return Number.isFinite(n) && n > 0 ? n : TEXT_MODE_SECONDS_PER_WORD;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run -s test:session-mode`
Expected: `10/10 passed`.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/voice/resolve-session-mode.ts apps/tutor/scripts/test-session-mode.ts apps/tutor/package.json
git commit -m "feat(tutor): resolveSessionMode — partner text-only mode from the embed token claim, kill switch NEXT_PUBLIC_TUTOR_TEXT_MODE"
```

---

### Task 2: Silent clock at reading pace, and TTS provider forced by mode

**Files:**
- Modify: `apps/tutor/src/lib/tutor/voice/resolve-tts-provider.ts`
- Modify: `apps/tutor/src/app/tutor/hooks/useOpenAIRealtime.ts` (silent-buffer branch near `ttsProviderRef.current === 'silent'`, option type near line 320)
- Modify: `apps/tutor/scripts/test-session-mode.ts` (two more checks)

**Interfaces:**
- Produces: `resolveTtsProvider(urlParam, envFlag, mode?: SessionMode)` — `mode === 'text'` ⇒ `'silent'` regardless of the other inputs. `useOpenAIRealtime` option `silentSecondsPerWord?: number` (default = existing `SILENT_TTS_SECONDS_PER_WORD`).

- [ ] **Step 1: Extend the resolver test**

Append to the `checks` array in `scripts/test-session-mode.ts`:
```ts
    ["tts: text mode → 'silent' even with ?tts=cartesia", (await import('@/lib/tutor/voice/resolve-tts-provider')).resolveTtsProvider('cartesia', 'cartesia', 'text') === 'silent'],
    ["tts: voice mode unchanged", (await import('@/lib/tutor/voice/resolve-tts-provider')).resolveTtsProvider(undefined, 'cartesia', 'voice') === 'cartesia'],
```
Run: `npm run -s test:session-mode` → Expected: FAIL (`resolveTtsProvider` takes 2 args / returns `'cartesia'`).

- [ ] **Step 2: Add the `mode` input to `resolveTtsProvider`**

Replace the function in `resolve-tts-provider.ts` with:
```ts
import type { SessionMode } from './resolve-session-mode';

export function resolveTtsProvider(
  urlParam: string | null | undefined,
  envFlag: string | undefined,
  mode: SessionMode = 'voice',
): TtsProvider {
  // Text-only mode (2026-09-19): never call a TTS API. The 'silent' provider
  // plays zero-filled buffers so sentence-start/drain/render-sync keep firing.
  if (mode === 'text') return 'silent';
  if (urlParam === 'mini') return 'openai-mini';
  if (urlParam === 'silent') return 'silent';
  if (urlParam === 'cartesia') return 'cartesia';
  if (envFlag === 'cartesia') return 'cartesia';
  if (envFlag === 'silent') return 'silent';
  return 'realtime';
}
```

- [ ] **Step 3: Per-instance silent pacing in `useOpenAIRealtime`**

In the hook's options interface (the block containing `ttsProvider?: 'realtime' | 'openai-mini' | 'cartesia' | 'silent';` near line 320) add:
```ts
    /** Seconds of silence fabricated per word when ttsProvider === 'silent'.
     *  Harness default 0.15 (fast); text-only sessions pass a reading pace. */
    silentSecondsPerWord?: number;
```
Where the hook reads its options into refs (next to `ttsProviderRef`, near line 1079) add:
```ts
  const silentSecondsPerWordRef = useRef<number>(options.silentSecondsPerWord ?? SILENT_TTS_SECONDS_PER_WORD);
  silentSecondsPerWordRef.current = options.silentSecondsPerWord ?? SILENT_TTS_SECONDS_PER_WORD;
```
(Use the hook's actual options identifier if it is not named `options`.) In the silent branch replace
```ts
        Math.round(words * SILENT_TTS_SECONDS_PER_WORD * 24000),
```
with
```ts
        Math.round(words * silentSecondsPerWordRef.current * 24000),
```

- [ ] **Step 4: Run the tests and typecheck**

Run: `npm run -s test:session-mode` → Expected: `12/12 passed`.
Run: `npx tsc --noEmit -p tsconfig.json` → Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/voice/resolve-tts-provider.ts apps/tutor/src/app/tutor/hooks/useOpenAIRealtime.ts apps/tutor/scripts/test-session-mode.ts
git commit -m "feat(tutor): text mode forces the silent TTS clock at a reading pace (per-instance secondsPerWord)"
```

---

### Task 3: Thread `sessionMode` from the embed token to the session components

**Files:**
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx` (near `const inputMode: InputMode = config.input_mode || 'voice';` and the `<TutorSession … ttsProvider={ttsProvider}` JSX)
- Modify: `apps/tutor/src/app/tutor/components/session/TutorSession.tsx` (props interface near line 90–116; destructure near line 237; `<VoiceTutorRealtime` mount near line 1263; `<SessionStage` mount near line 1683)
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (props interface near `ttsProvider?:` line 710)
- Modify: `apps/tutor/src/app/tutor/components/session/SessionStage.tsx` (props interface line 49+)

**Interfaces:**
- Produces: `TutorSessionProps.sessionMode?: SessionMode` (default `'voice'`); `VoiceTutorRealtime` prop `sessionMode?: SessionMode`; `SessionStageProps.sessionMode?: SessionMode`. Consumers in Tasks 4–6 read `sessionMode === 'text'`.

- [ ] **Step 1: Embed page resolves the mode**

Right after `const inputMode: InputMode = config.input_mode || 'voice';` add:
```ts
  // Text-only tutor (2026-09-19): partner-level, from the signed claim only.
  const sessionMode = resolveSessionMode(config.input_mode, process.env.NEXT_PUBLIC_TUTOR_TEXT_MODE);
```
Add the import `import { resolveSessionMode } from '@/lib/tutor/voice/resolve-session-mode';`. Change the `ttsProvider` line (near 509) to:
```ts
  const ttsProvider = resolveTtsProvider(null, useCartesiaVoice || useCartesiaDefault ? 'cartesia' : undefined, sessionMode);
```
(import `resolveTtsProvider` from `@/lib/tutor/voice/resolve-tts-provider`; keep the existing `'realtime' | 'cartesia'` outcome for voice — the resolver returns exactly that for those inputs). In the `<TutorSession` JSX add `sessionMode={sessionMode}` next to `ttsProvider={ttsProvider}`.

- [ ] **Step 2: TutorSession accepts and forwards it**

In `TutorSessionProps` after the `ttsProvider?:` line add:
```ts
  /** Text-only tutor mode (partner token claim). Default 'voice'. */
  sessionMode?: SessionMode;
```
Import `type SessionMode` from `@/lib/tutor/voice/resolve-session-mode`. Add `sessionMode = 'voice'` to the destructure (line ~237). Pass `sessionMode={sessionMode}` on `<VoiceTutorRealtime` (next to `ttsProvider={ttsProvider}`, line ~1312) and on `<SessionStage` (line ~1683). Also pass `silentSecondsPerWord` through to VTR: `silentSecondsPerWord={sessionMode === 'text' ? textModeSecondsPerWord(process.env.NEXT_PUBLIC_TUTOR_TEXT_MODE_SPW) : undefined}` (import `textModeSecondsPerWord`).

- [ ] **Step 3: VTR + SessionStage accept it**

In VTR's props interface after `ttsProvider?:` add:
```ts
  /** Text-only tutor mode (2026-09-19). 'text' ⇒ no mic, no perception WS,
   *  composer is the primary input, silent TTS clock. Default 'voice'. */
  sessionMode?: SessionMode;
  /** Silent-clock pace; only meaningful when ttsProvider === 'silent'. */
  silentSecondsPerWord?: number;
```
Destructure both with `sessionMode = 'voice'`. Where VTR passes `ttsProvider,` into `useOpenAIRealtime(...)` (line ~17893) add `silentSecondsPerWord,` beside it. In `SessionStageProps` add `sessionMode?: SessionMode;` and destructure with default `'voice'`.

- [ ] **Step 4: Typecheck and voice-parity smoke**

Run: `npx tsc --noEmit -p tsconfig.json` → exit 0.
Run: `npm run test:all` → expected same pass count as before this plan plus `test:session-mode`.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/app/tutor-portal/embed/page.tsx apps/tutor/src/app/tutor/components/session/TutorSession.tsx apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx apps/tutor/src/app/tutor/components/session/SessionStage.tsx
git commit -m "feat(tutor): thread sessionMode (embed token claim) through TutorSession → VoiceTutorRealtime/SessionStage; text ⇒ silent TTS"
```

---

### Task 4: Text-mode stage — transcript pinned, board clearance, composer replaces the dock

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/session/SessionStage.tsx` (`useState(false)` for `drawerOpen` line ~296; board column div line ~790; floating bar block line ~1341–1352; header right cluster where `endControl` renders)
- Modify: `apps/tutor/src/app/tutor/components/session/TutorSession.tsx` (`dockCaptionEl` line ~818; the `voiceInputEl` composition line ~1258)
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (composer `<form>` + `<input>` near lines 22040–22167; mic/mute button rendering in the same block)

**Interfaces:**
- Consumes: `sessionMode` from Task 3.
- Produces: in text mode SessionStage renders `{voiceInput}` as the full-width composer card, keeps `{transcript}` in the drawer opened by default, and reserves `paddingBottom` on the board column equal to the dock height.

- [ ] **Step 1: Drawer pinned open in text mode**

Replace `const [drawerOpen, setDrawerOpen] = useState(false);` with:
```ts
  // Text-only mode: the transcript IS the conversation surface, so it starts
  // open (Option C). Voice keeps the closed default.
  const [drawerOpen, setDrawerOpen] = useState(sessionMode === 'text');
```

- [ ] **Step 2: Board clearance above the opaque composer**

The dock already has `ref={dockRef}`. Add state + a `ResizeObserver` next to `drawerOpen`:
```ts
  const [dockHeight, setDockHeight] = useState(0);
  useEffect(() => {
    if (sessionMode !== 'text' || !dockRef.current) return;
    const el = dockRef.current;
    const ro = new ResizeObserver(() => setDockHeight(el.getBoundingClientRect().height));
    ro.observe(el);
    setDockHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, [sessionMode]);
```
On the board column `<div className={\`absolute inset-0 ${showSwitcher ? 'pt-12' : …} pb-2 …\`}>` add a style prop:
```tsx
            style={sessionMode === 'text' ? { paddingBottom: `calc(${Math.max(dockHeight, 88)}px + 1rem + env(safe-area-inset-bottom))` } : undefined}
```
(Voice: `style` is `undefined` — no DOM change.)

- [ ] **Step 3: "Text session" chip in the header**

Where the header renders `{endControl}`, prepend:
```tsx
            {sessionMode === 'text' && (
              <span className="mr-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Text session</span>
            )}
```

- [ ] **Step 4: No caption ticker, no mic status in text mode (TutorSession)**

Change the `dockCaptionEl` head to:
```tsx
  const dockCaptionEl = sessionMode === 'text' ? null : statusOverride ? (
```
(VTR's `captionSlot` then receives `null`; the composer row has no caption line.) Keep `getSpokenCaption` wiring untouched — it is only read by the ticker.

- [ ] **Step 5: Composer as the primary input (VTR)**

In the composer block: the mic-toggle/mute button(s) rendered in the same `<form>` (search `aria-label="Mute"` / `Unmute` / the mic `<button` inside this form) get `{sessionMode !== 'text' && (…)}`. On the `<input name="studentText"`:
```tsx
          placeholder={sessionMode === 'text' ? 'Type your answer… Enter to send' : "Type here if you can't speak..."}
          autoFocus={sessionMode === 'text'}
          disabled={sessionMode === 'text' ? !brainReachable : !realtime.isConnected}
```
and on the submit `<button` the same `disabled` expression. Add near `hasStartedRef`:
```ts
  // Text mode: the OpenAI Realtime WS is a pure TTS sink; the composer must
  // be live immediately, gated only on the brain route being reachable.
  const [brainReachable, setBrainReachable] = useState(true);
```
(Set `false` only when a brain fetch fails with a network error, in the existing catch that renders the typed-outage bubble — search `typed: true` outage handling near 11201–11214 — and back to `true` on the next successful turn.) In `onFocus` / `onBlur` wrap the `realtime.muteInput()` / `realtime.startListening()` calls with `if (sessionMode !== 'text')`.

- [ ] **Step 6: Typecheck + run the harness against a voice session to prove no change**

Run: `npx tsc --noEmit -p tsconfig.json` → exit 0.
Run (dev server on :3007): `TUTOR_E2E_URL=http://localhost:3007 npm run test:tutor-e2e -- arith-long-division` → Expected: passes as before; inspect the bundle's transcript — no `Text session` chip, drawer closed.

- [ ] **Step 7: Commit**

```bash
git add apps/tutor/src/app/tutor/components/session/SessionStage.tsx apps/tutor/src/app/tutor/components/session/TutorSession.tsx apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "feat(tutor): text-mode stage — transcript pinned open, board clearance above the composer, composer primary, no caption/mic UI"
```

---

### Task 5: No mic, no perception, no warm-up overlay, tolerant timers

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` — `const perceptionEnabled = …` (line ~18061); `setShowWarmupOverlay(true)` in the mic-click kickoff (line ~21006); `armIdleNudge` (line ~18212); MicSilentWarning emit site(s) (search `MicSilentWarning` near 1172–1200 and 18881); every `realtime.startListening()` call site.

**Interfaces:**
- Consumes: `sessionMode`.
- Produces: in text mode `getUserMedia` is never requested, the warm-up overlay is never shown, typing resets the idle nudge, the mic-silent notice never fires.

- [ ] **Step 1: Perception + mic**

```ts
  const perceptionEnabled = sessionMode !== 'text' && perceptionStage >= 0 && realtime.isConnected;
```
Wrap each `realtime.startListening()` call (grep them; there are several, incl. the composer `onBlur` handled in Task 4 and the start/kickoff path) with `if (sessionMode !== 'text')`. Also `setIsMicMuted(true)` once on mount when `sessionMode === 'text'` so any mic-state UI reads muted:
```ts
  useEffect(() => { if (sessionMode === 'text') setIsMicMuted(true); }, [sessionMode]);
```

- [ ] **Step 2: Warm-up overlay**

Change `setShowWarmupOverlay(true);` (mic-click kickoff branch) to `if (sessionMode !== 'text') setShowWarmupOverlay(true);`. (Text sessions start from the typed-submit path, which already never shows it; this guards the orb-tap route if a text session ever reaches it.)

- [ ] **Step 3: Idle nudge resets on keystroke**

`armIdleNudge` already treats `studentTypingRef.current` as busy. Add an `onChange` on the composer `<input>`:
```tsx
          onChange={() => { if (sessionMode === 'text') armIdleNudge(); }}
```
(`armIdleNudge` re-arms the timer from now; with the student typing it re-checks rather than fires.)

- [ ] **Step 4: Mic-silent warning suppressed**

At the site that emits/sets the MicSilentWarning (the `setMicSilentWarning(...)`/dispatch near line 1172–1200, and the noise-floor nag near 18881) add an early `if (sessionMode === 'text') return;`.

- [ ] **Step 5: Verify with a typed text-mode run and a voice run**

Run the dev server, mint a text token (Task 10 Step 1 shows how), open `/tutor-portal/embed?token=…` in a browser: Expected — no mic permission prompt (check the address-bar icon), no overlay, composer focused. Open a voice token: permission prompt appears as today.
Run: `npx tsc --noEmit -p tsconfig.json` → exit 0.

- [ ] **Step 6: Commit**

```bash
git add apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "feat(tutor): text mode never opens the mic/perception WS, skips the warm-up overlay and mic-silent nag, idle nudge resets on typing"
```

---

### Task 6: Text-mode prompt clause

**Files:**
- Modify: `apps/tutor/src/lib/tutor/ai/system-prompt-builder.ts` (`SystemPromptContext` near line 100–191; the opener/entry logic near line 1508)
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx` (`buildSystemPrompt({` call near line 20737)
- Modify: `apps/tutor/scripts/test-session-mode.ts` (prompt assertion)

**Interfaces:**
- Produces: `SystemPromptContext.inputMode?: 'voice' | 'text'`; when `'text'` the prompt gains the `<text_mode>` clause below.

- [ ] **Step 1: Failing test**

Append to `checks` in `test-session-mode.ts`:
```ts
    ['prompt: text mode carries the <text_mode> clause', (await import('@/lib/tutor/ai/system-prompt-builder')).buildSystemPrompt({ module: null, inputMode: 'text' } as never).includes('<text_mode>')],
    ['prompt: voice mode has no <text_mode> clause', !(await import('@/lib/tutor/ai/system-prompt-builder')).buildSystemPrompt({ module: null } as never).includes('<text_mode>')],
```
Run → Expected: first check FAILs.

- [ ] **Step 2: Context field + clause**

In `SystemPromptContext` add:
```ts
  /** Text-only session (partner claim). The student types and reads. */
  inputMode?: 'voice' | 'text';
```
Where `buildSystemPrompt` assembles its final string (the function's return — find `return` of the concatenated prompt), append before returning:
```ts
  const textModeClause = ctx.inputMode === 'text'
    ? '\n<text_mode>\nThis student is TYPING and READING, not speaking. Write, do not narrate: no "say", "hear", "listen" phrasing. ' +
      'Keep every turn short (one idea, then a question). Keep math in the same $…$ delimiters so the board and the chat render identically. ' +
      'Never ask the student to speak or to use a microphone.\n</text_mode>\n'
    : '';
  return prompt + textModeClause;
```
(Adapt to the local variable name holding the assembled prompt.)

- [ ] **Step 3: Pass it from VTR**

In the `buildSystemPrompt({` call add `inputMode: sessionMode,`.

- [ ] **Step 4: Run tests**

Run: `npm run -s test:session-mode` → all pass. Run: `npm run test:all` (prompt-touching commits must run the full suite per house rule) → same pass count.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/ai/system-prompt-builder.ts apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx apps/tutor/scripts/test-session-mode.ts
git commit -m "feat(tutor): <text_mode> prompt clause — write, don't narrate; short turns; same math delimiters"
```

---

### Task 7: `mode` in the partner session summary (contract v1.18.0) and billing docs

**Files:**
- Modify: `/Users/luke/Dev/portal-contract/src/*.ts` (the `SessionSummary` schema/type that carries `durationSec`), `package.json` version → `1.18.0`, tag `v1.18.0`
- Modify: `apps/tutor/src/lib/tutor/portal/session-summary.ts` (return object near line 106)
- Modify: `apps/tutor/package.json` (`@evelyn/portal-contract` pin → `#v1.18.0`) and `package-lock.json` via `npm install "@evelyn/portal-contract@github:evelyn-learning/portal-contract#v1.18.0"`

**Interfaces:**
- Produces: `SessionSummary.mode?: 'voice' | 'text'` on the wire; the engine emits it from `TutorSession.inputMode` (already persisted by the embed page).

- [ ] **Step 1: Contract**

In the sibling repo, add to the SessionSummary type/schema beside `durationSec`:
```ts
  /** Input mode of the session; text sessions bill at the text rate. */
  mode: z.enum(['voice', 'text']).optional(),
```
(If the type is a plain TS interface: `mode?: 'voice' | 'text';`.) Bump `package.json` to `1.18.0`, run its test/build script, commit `feat(v1.18.0): SessionSummary.mode`, tag `v1.18.0`, push tag.

- [ ] **Step 2: Engine emits it**

In `session-summary.ts` return object add after `status: s.status,`:
```ts
    ...(s.inputMode === 'text' || s.inputMode === 'voice' ? { mode: s.inputMode } : {}),
```
Re-pin: `cd apps/tutor && npm install "@evelyn/portal-contract@github:evelyn-learning/portal-contract#v1.18.0"` (the memory note: `npm install` does NOT re-resolve a tag pin unless named explicitly).

- [ ] **Step 3: Test**

`npm run test:portal-contract && npm run test:portal-endpoints` → pass. Add to `scripts/test-portal-endpoints.ts` (or the summary test that exists) a fixture session with `inputMode: 'text'` and assert `summary.mode === 'text'`, and one without `inputMode` asserting `mode` is absent.

- [ ] **Step 4: Commit**

```bash
git add apps/tutor/src/lib/tutor/portal/session-summary.ts apps/tutor/package.json package-lock.json apps/tutor/scripts/test-portal-endpoints.ts
git commit -m "feat(portal): sessions/summary carries mode (voice|text) — contract v1.18.0"
```

---

### Task 8: Admin sessions list — mode tag and filter

**Files:**
- Modify: `apps/tutor/src/lib/tutor/recordings/filters.ts` (`SessionFilterParams`, `buildSessionFilter`)
- Modify: `apps/tutor/src/app/admin/tutor-sessions/page.tsx` (filters object near line 146; Status cell near line 372–381; the `<form method="get">` near the `q` input)
- Test: `apps/tutor/scripts/test-session-filters.ts` (create if no filters test exists; check `ls scripts | grep -i filter` first)

- [ ] **Step 1: Failing test**

```ts
import { buildSessionFilter } from '@/lib/tutor/recordings/filters';
const now = new Date();
const t = buildSessionFilter({ mode: 'text' }, now);
const v = buildSessionFilter({ mode: 'voice' }, now);
const none = buildSessionFilter({}, now);
const bad = buildSessionFilter({ mode: 'video' }, now);
const checks: Array<[string, boolean]> = [
  ['mode=text → inputMode text', t.inputMode === 'text'],
  ['mode=voice → inputMode voice', v.inputMode === 'voice'],
  ['no mode → no inputMode clause', !('inputMode' in none)],
  ['garbage mode ignored', !('inputMode' in bad)],
];
```
(wrap in the same PASS/FAIL runner as Task 1). Register `"test:session-filters": "npx tsx scripts/test-session-filters.ts"`. Run → FAIL.

- [ ] **Step 2: Filter**

`SessionFilterParams` gains `mode?: string;`. In `buildSessionFilter` after the `host` line:
```ts
  if (params.mode === 'text' || params.mode === 'voice') filter.inputMode = params.mode;
```

- [ ] **Step 3: Page**

In the `filters` object add `mode: str(sp.mode),`. In the GET form beside the `q` input add:
```tsx
            <select name="mode" defaultValue={filters.mode || ''} className="rounded-md border border-gray-300 px-2 py-1.5 text-sm">
              <option value="">Voice + text</option>
              <option value="voice">Voice</option>
              <option value="text">Text</option>
            </select>
```
(Ensure the hidden-input loop that preserves other params excludes `mode` so the select wins.) In the Status cell, under the existing `voiceEngine` line add:
```tsx
                        {s.inputMode ? (
                          <div className={`text-[10px] mt-0.5 ${s.inputMode === 'text' ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>{String(s.inputMode)}</div>
                        ) : null}
```

- [ ] **Step 4: Run + eyeball**

`npm run -s test:session-filters` → pass. Dev server: `/admin/tutor-sessions?mode=text` lists only the two 2026-09-05 QA-typed sessions (plus any new text sessions).

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/recordings/filters.ts apps/tutor/src/app/admin/tutor-sessions/page.tsx apps/tutor/scripts/test-session-filters.ts apps/tutor/package.json
git commit -m "feat(admin): sessions list shows voice/text under status and filters by mode"
```

---

### Task 9: Demo Analytics — voice/text

**Files:**
- Modify: `packages/core/src/models/DemoSession.ts` (summary schema near line 87; `IDemoSessionSummary` near line 12) — schema field only, additive
- Modify: `apps/marketing/src/app/api/demos/track/route.ts` (the `try`/`complete` update branch that sets `"summary.lastActivity": now`)
- Modify: `apps/marketing/src/app/products/voice-tutor/page.tsx` (wrap `<VoiceTutorLiveDemo />` line 92)
- Modify: `apps/tutor/src/app/admin/demos/DemoAnalyticsDashboard.tsx` (sessions table Product cell; Top Demos table)

**Interfaces:**
- Produces: `DemoSession.summary.mode?: 'voice' | 'text'`; tracked via `trackTry({ mode })` metadata; dashboard shows a tag and a "text share" column.

- [ ] **Step 1: Schema + type**

`IDemoSessionSummary` gains `mode?: 'voice' | 'text';`; the schema `summary` block gains `mode: { type: String, enum: ['voice', 'text'] },`.

- [ ] **Step 2: Track route**

In the branch handling `eventType === 'try' || 'complete'` (the update that sets `"summary.lastActivity": now`), add to the `$set`:
```ts
          ...(metadata?.mode === 'voice' || metadata?.mode === 'text' ? { 'summary.mode': metadata.mode } : {}),
```

- [ ] **Step 3: Product page tags its live demo**

```tsx
<DemoTracker productId="voice-tutor" productTitle="AI Voice Tutor">
  <VoiceTutorLiveDemo />
</DemoTracker>
```
and inside `VoiceTutorLiveDemo`, at the point the student starts a session (the start handler), call `useTrackInteraction()`'s sibling: import `useDemoTracker` is not available inside a wrapped child — instead use the existing `DemoTrackingContext`'s `trackInteraction('click', 'session_start', { mode: 'voice' })` and, in `useDemoTracking.trackInteraction`, forward `metadata.mode` on the next `try` event. (If `DemoTracker` already fires `try` on first interaction, pass the mode through `track("try", { mode })` by reading a `mode` from `DemoTrackingContext` — add `mode?: 'voice' | 'text'` to the provider props with default `'voice'`.) Keep it to: DemoTracker gains an optional `mode` prop defaulting to `'voice'`, and `trackTry` receives `{ mode }`.

- [ ] **Step 4: Dashboard**

Sessions table Product cell:
```tsx
<td className="py-3 text-left">{s.productTitle}{s.summary?.mode ? <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${s.summary.mode === 'text' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>{s.summary.mode}</span> : null}</td>
```
Top Demos table: add a header `Text share` and a cell `{d.tries ? Math.round(100 * (d.textTries ?? 0) / d.tries) + '%' : '–'}`; in `/api/admin/demos` `topDemos` aggregation add `textTries: { $sum: { $cond: [{ $and: [{ $eq: ['$eventType', 'try'] }, { $eq: ['$metadata.mode', 'text'] }] }, 1, 0] } }`.

- [ ] **Step 5: Verify**

Marketing dev server: open `/products/voice-tutor`, start the demo, then in Mongo `db.demosessions.findOne({productId:'voice-tutor'},{summary:1})` shows `summary.mode: 'voice'`. Tutor admin `/admin/demos` shows the tag. `npx tsc --noEmit` in both apps → exit 0.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/models/DemoSession.ts packages/core/src/components/demos/DemoTracker.tsx packages/core/src/hooks/useDemoTracking.ts apps/marketing/src/app/api/demos/track/route.ts apps/marketing/src/app/products/voice-tutor/page.tsx apps/tutor/src/app/admin/demos/DemoAnalyticsDashboard.tsx apps/tutor/src/app/api/admin/demos/route.ts
git commit -m "feat(demos): demo sessions record voice/text mode; Demo Analytics shows a mode tag and text share"
```
Note: this touches `packages/core` (a marketing deploy risk per memory) — additive schema + optional prop only; both apps must be typechecked and both deployed together.

---

### Task 10: End-to-end text-mode scenario against a minted embed token

**Files:**
- Modify: `apps/tutor/scripts/tutor-e2e/run.ts` (navigation near line 192–193; add `TUTOR_E2E_EMBED_TOKEN`)
- Create: `apps/tutor/scripts/tutor-e2e/scenarios/text-mode-factoring.ts`
- Create: `apps/tutor/scripts/mint-embed-token.ts` (dev helper; mirrors `docs/whitelabel/kanzoo/examples/sign-embed-token.js` using the local `PORTAL_PARTNER_SECRETS` entry)

- [ ] **Step 1: Token minting helper**

```ts
/** Mint a dev embed token for the local engine. Usage:
 *  npx tsx scripts/mint-embed-token.ts --partner evelyn-marketing --mode text --student qa-text-1 */
import * as dotenv from 'dotenv'; dotenv.config({ path: '.env.local' });
import { createHmac } from 'node:crypto';
const arg = (k: string, d?: string) => process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : d;
const partner = arg('partner', 'evelyn-marketing')!;
const secret = Object.fromEntries((process.env.PORTAL_PARTNER_SECRETS || '').split(',').map((p) => p.split(':') as [string, string]))[partner];
if (!secret) throw new Error(`no secret for ${partner} in PORTAL_PARTNER_SECRETS`);
const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const payload: Record<string, unknown> = { partner_id: partner, student_id: arg('student', 'qa-text-1'), subject: 'math', level: '9-10', topic: 'algebra-1', iat: now, exp: now + 3600 };
const mode = arg('mode'); if (mode) payload.input_mode = mode;
const head = b64({ alg: 'HS256', typ: 'JWT' }); const body = b64(payload);
const sig = createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
console.log(`${head}.${body}.${sig}`);
```
(Confirm the claim names and signing scheme against `docs/whitelabel/kanzoo/examples/sign-embed-token.js` lines 40–60 before committing; match them exactly.)

- [ ] **Step 2: Harness navigates to the embed when a token is given**

In `run.ts` replace the `page.goto(\`${BASE_URL}/tutor?tts=${TTS_PARAM}\`…)` with:
```ts
    const EMBED_TOKEN = process.env.TUTOR_E2E_EMBED_TOKEN;
    const url = EMBED_TOKEN ? `${BASE_URL}/tutor-portal/embed?token=${encodeURIComponent(EMBED_TOKEN)}` : `${BASE_URL}/tutor?tts=${TTS_PARAM}`;
    log(`navigating to ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
```
Confirm `window.__tutorSendText` and `window.__tutorTestState` are exposed on the embed page too (they are defined in `page.tsx:1575–1601` for `/tutor`; if the embed page lacks them, add the same two `window` hooks in `embed/page.tsx` guarded by `process.env.NODE_ENV !== 'production'`).

- [ ] **Step 3: Scenario**

```ts
import type { Scenario } from '../types';
/** Text-only mode (partner claim): typed turns, silent clock, sentence-paced reveal, board renders. */
const scenario: Scenario = {
  name: 'text-mode-factoring',
  description: 'Algebra I factoring in text-only mode — no mic, transcript grows per sentence, board renders anchored to sentences.',
  start: { subject: 'math', level: '9-10', topic: 'algebra-1', studentName: 'Test Student' },
  seedTurns: [{ say: "I don't get why we factor these. Like x^2 + 5x + 6" }],
  testTurns: [{ say: '2 and 3' }],
  cooperativeStudent: { profile: 'struggling', firstSay: 'can you show me the steps on the board?', goal: 'Factor x^2+5x+6 as (x+2)(x+3) with the steps written on the board.', turns: 3 },
};
export default scenario;
```
Add to the harness's post-run checks (where `debugEvents` are inspected, near `__tutorTestState`) a text-mode assertion block, active only when `TUTOR_E2E_EMBED_TOKEN` is set: fail if any event name matches `/mic|getUserMedia|warmup_overlay/`, fail if `state.transcript` has fewer than 2 tutor entries, fail if the board command count is 0.

- [ ] **Step 4: Run both modes**

```bash
T=$(npx tsx scripts/mint-embed-token.ts --mode text)
TUTOR_E2E_URL=http://localhost:3007 TUTOR_E2E_EMBED_TOKEN=$T npm run test:tutor-e2e -- text-mode-factoring
V=$(npx tsx scripts/mint-embed-token.ts)
TUTOR_E2E_URL=http://localhost:3007 TUTOR_E2E_EMBED_TOKEN=$V npm run test:tutor-e2e -- arith-long-division
```
Expected: text run passes the new assertions; voice run passes exactly as before. Then in Mongo: the text session doc has `inputMode: 'text'` and `GET /api/portal/v1/sessions/summary` for it returns `mode: 'text'`.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/scripts/tutor-e2e/run.ts apps/tutor/scripts/tutor-e2e/scenarios/text-mode-factoring.ts apps/tutor/scripts/mint-embed-token.ts
git commit -m "test(tutor): e2e text-mode scenario via a minted embed token; harness can target the embed page"
```

---

### Task 11: Docs and legacy-path signposts

**Files:**
- Modify: `docs/whitelabel/01-product-description.md:23` (`$0.02/minute` → `$0.12/minute`)
- Modify: `docs/whitelabel/02-technical-integration-spec.md` (`input_mode` row: "honoured since 2026-09"; describe the text layout; add `mode` to the `sessions/summary` field table)
- Modify: `apps/tutor/src/app/tutor/page.tsx` (comment above the legacy `inputMode === 'text'` branch near line 3115) and `apps/tutor/src/app/tutor/components/VoiceInterface.tsx` (comment above `useTextMode`)

- [ ] **Step 1: Edit the three docs lines**, and add this comment above each legacy branch:
```ts
// LEGACY pre-brain text path — NOT the partner text-only mode. The real text
// mode is resolveSessionMode() + sessionMode==='text' in the embed session
// (docs/superpowers/specs/2026-09-19-text-only-tutor-mode-design.md). Do not
// extend this branch; it bypasses the brain and the whiteboard.
```

- [ ] **Step 2: Commit**

```bash
git add docs/whitelabel/01-product-description.md docs/whitelabel/02-technical-integration-spec.md apps/tutor/src/app/tutor/page.tsx apps/tutor/src/app/tutor/components/VoiceInterface.tsx
git commit -m "docs(tutor): text-only mode is honoured and priced at $0.12/min; signpost the legacy text paths"
```

---

### Task 12: Gate, voice-parity measurement, deploy

**Files:** none new.

- [ ] **Step 1: Structural check** — `grep -rn "sessionMode" apps/tutor/src | grep -v "sessionMode === 'text'\|sessionMode !== 'text'\|sessionMode = 'voice'\|sessionMode?:\|sessionMode={sessionMode}\|sessionMode,\|resolveSessionMode\|inputMode: sessionMode\|\[sessionMode\]"` → every remaining hit must be a definition or a pass-through, not a behaviour change.
- [ ] **Step 2: Measured parity** — with the voice e2e bundle from Task 10 Step 4, diff the ordered list of `debugEvents[].name` against the same run captured on `origin/main` before Task 1 (store both under `.superpowers/parity/`). Expected: identical.
- [ ] **Step 3: Full gate on the merged tree** — `git merge origin/main`, then `npx tsc --noEmit -p apps/tutor/tsconfig.json`, `npx tsc --noEmit -p apps/marketing/tsconfig.json`, `cd apps/tutor && npm run test:all`, `npm run build` in both apps. All green or stop.
- [ ] **Step 4: Praveen's local review** — dev server, two minted tokens (text + voice), Playwright screenshots at 1280 and 390 px saved to `~/Downloads/text-mode-review/`. Hand over; wait for go.
- [ ] **Step 5: Deploy** — announce peers; `./deploy-tutor.sh` then `./deploy-marketing.sh` (Task 9 touches `packages/core`), from the worktree; probe: served HTML of a text-token embed contains `Text session`, a voice-token embed does not; pm2 restarts 0; push `main`.

---

## Self-review

- Spec coverage: §3 → T1, T3; §4 → T4, T5; §5 → T2, T3; §6 → T6; §7 → T7, T8, T9; §8 → T10, T12; §9 → T12; §10 → T11; §11 fallback inherited (already on main).
- Placeholders: none; every code step has code. Two spots require reading exact local identifiers before editing (hook options name in T2 Step 3; the assembled-prompt variable in T6 Step 2; the signing scheme in T10 Step 1) — each says to confirm against the named file.
- Type consistency: `SessionMode` (T1) is the type used by T2–T6; `silentSecondsPerWord` name matches between T2 (hook option), T3 (VTR prop) and T3 Step 2 (TutorSession pass-through); `inputMode` on `SystemPromptContext` (T6) vs `sessionMode` elsewhere is deliberate (prompt-side name mirrors the token claim).
