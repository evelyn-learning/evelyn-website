# GameClass "One Continuous Lesson" (spec v1.2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The embedded tutor stays open beside a host video for a whole lesson: it stands by (silent, mic released, clock stopped) while the video plays or the panel is minimized, wakes on a student question or a host "moment", answers from the lesson at the current video position, and can resume the video itself.

**Architecture:** All protocol logic lives in two new pure modules (`host-lesson.ts`: message parsers, a standby reducer, inactive-time accounting, the moment directive; `host-lesson-timeline.ts`: timeline clamp + the per-turn window renderer). The embed page owns the host conversation (one `message` listener, the reducer, outgoing posts, the 30-minute idle end, duration accounting). `VoiceTutorRealtime` (VTR) gets a single `standby` prop plus a few callbacks and does the mechanical part (mic, speech, idle nudge, clock anchors). The lesson window reaches the model as a per-turn `<lesson_video>` block in the USER content (same tier as `<demo_stop>`), never in the system prompt, so the shared prompt cache is untouched. The tutor resumes the video through a `resume_lesson` tool that is appended only for video-host sessions (same precedent as `set_current_problem`).

**Tech Stack:** Next.js (apps/tutor), TypeScript, `npx tsx` script tests (`node:assert`), Playwright live check (gitignored `apps/tutor/artifacts/`).

**Spec:** `docs/whitelabel/gameclass/spec-v1.2-continuous-lesson.md` (local copy of `~/Desktop/GameClass-integration/GameClass-Tutor-Integration-Spec-v1.2.md`, the contract SENT to GameClass 2026-10-08; the directory is gitignored).

## Global Constraints

- Additive only: pages and tokens that work today keep working unchanged. A host that sends none of the new messages sees no change at all.
- Host messages are accepted only when `event.source === window.parent` and `isAllowedHostOrigin(event.origin, getEmbeddingHost())` (reuse from `lib/tutor/portal/host-end.ts`).
- Message names and fields exactly as the spec: host→tutor `evelyn:video_state {state: "playing"|"paused"|"ended", position_seconds}`, `evelyn:moment {kind: "teaching_moment"|"question"|"quiz", position_seconds, title, summary, question, student_answer, correct_answer}`, `evelyn:lesson {timeline: [{start, end?, text, kind?: "speech"|"visual"}]}`, `evelyn:pause {reason}`, `evelyn:resume`; tutor→host `evelyn:video_command {command: "play"|"pause", source: "student"|"tutor"}`, `evelyn:standby {standing_by}`.
- Timeline limits: 5,000 entries, 500 characters per entry, 150,000 characters in total. Over a limit is cut, never rejected.
- Standby line, verbatim: `Feel free to ask a question about anything you see.`
- No reply to a tutor `play` command within 3 seconds ⇒ the tutor stays available.
- 30 minutes of continuous standby ⇒ the session ends itself with `ended_reason: "idle"`.
- Standing-by and minimized time is not counted: not in `duration`, not against `max_duration_minutes`, not on the header clock.
- New flag `NEXT_PUBLIC_TUTOR_HOST_LESSON`, default ON (`!== 'off'`).
- Prompt text is generic: no partner, game or character names anywhere in engine code or tests' expected prompt strings.
- The shared system-prompt core and the default tools array stay byte-identical for sessions that are not video-host sessions.
- New debug event types must be covered by `EMBED_DEBUG_EVENT_PREFIXES` (`test:embed-debug-coverage` must not gain failures).
- Do not edit existing files in `apps/tutor/src/lib/tutor/portal/` other than `embed-ui-options.ts`; add new files beside them.
- Gate: `npm run test:all` from the repo root; baseline 330/332 on this branch before this work (the two pre-existing failures are `embed-debug-coverage` and `portal-student-scoping`).

## Review Focus

1. **Repeated `video_state` (seek spam, a host that posts on every `timeupdate`)**: the mic must not be released and re-acquired per message and `evelyn:standby` must post only when the value changes. Pinned in Task 1 (reducer idempotence) and Task 6 (source scan: post is behind a change check).
2. **Host messages before the session has started or before the session handle exists (prewarm)**: no throw, no microphone prompt, state is remembered, a moment waits for the start. Pinned in Task 1 (reducer from the initial state) and Task 7 (live check `early` variant).
3. **A wake the host never confirms** (student types while the video plays; the host ignores `video_command`): the tutor must still answer. Pinned in Task 1 (`student_wake` survives a stale `playing`; cleared by a later one).
4. **Malformed or huge `evelyn:lesson`** (not an array, `NaN` starts, a 1 MB text, 50,000 entries): clamps, never throws, never exceeds the per-turn block bound. Pinned in Task 2.
5. **The student speaks or types after the tutor called `resume_lesson` but before the video restarts**: the video must NOT restart over them. Pinned in Task 4 (source scan: engagement clears the pending resume) and Task 7 (live check `barge` step).

---

### Task 1: Protocol helpers (`host-lesson.ts`)

**Files:**
- Create: `apps/tutor/src/lib/tutor/portal/host-lesson.ts`
- Create: `apps/tutor/scripts/test-host-lesson.ts`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/flags.ts` (after the `TUTOR_HOST_START` line)
- Modify: `apps/tutor/package.json` (after `"test:host-start"`)

**Interfaces:**
- Produces: `parseVideoState`, `parseMoment`, `parseHostPause`, `parseHostResume`, `LessonHostState`, `INITIAL_LESSON_HOST_STATE`, `reduceLessonHost(state, event, nowMs)`, `isStandingBy(state)`, `panelToggleCommand(video)`, `renderMomentDirective(moment)`, `InactiveClock`, `INITIAL_INACTIVE_CLOCK`, `markInactive`, `inactiveMsAt`, `activeSeconds`, `shiftAnchor`, constants `WAKE_GRACE_MS`, `RESUME_CONFIRM_MS`, `STANDBY_IDLE_END_MS`, `MOMENT_STALE_MS`, `STANDBY_LINE`; flag `TUTOR_HOST_LESSON`.

- [ ] **Step 1: Write the failing test**

```ts file=apps/tutor/scripts/test-host-lesson.ts
/**
 * One continuous lesson beside a host video (GameClass spec v1.2): pure
 * helpers in lib/tutor/portal/host-lesson.ts, plus source scans proving the
 * embed page, TutorSession and VTR wire them.
 *
 * Run: npm run test:host-lesson
 */
import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  INITIAL_INACTIVE_CLOCK,
  INITIAL_LESSON_HOST_STATE,
  MOMENT_STALE_MS,
  RESUME_CONFIRM_MS,
  STANDBY_IDLE_END_MS,
  STANDBY_LINE,
  WAKE_GRACE_MS,
  activeSeconds,
  inactiveMsAt,
  isStandingBy,
  markInactive,
  panelToggleCommand,
  parseHostPause,
  parseHostResume,
  parseMoment,
  parseVideoState,
  reduceLessonHost,
  renderMomentDirective,
  shiftAnchor,
  type LessonHostState,
} from '../src/lib/tutor/portal/host-lesson';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

const T = 1_800_000_000_000;
const S0 = INITIAL_LESSON_HOST_STATE;
const play = (s: LessonHostState, at: number, pos: number | null = null) =>
  reduceLessonHost(s, { type: 'video_state', state: 'playing', positionSeconds: pos }, at);
const pause = (s: LessonHostState, at: number, pos: number | null = null) =>
  reduceLessonHost(s, { type: 'video_state', state: 'paused', positionSeconds: pos }, at);

test('constants are the spec values', () => {
  assert.equal(RESUME_CONFIRM_MS, 3000);
  assert.equal(STANDBY_IDLE_END_MS, 30 * 60 * 1000);
  assert.equal(STANDBY_LINE, 'Feel free to ask a question about anything you see.');
  assert.ok(WAKE_GRACE_MS > 0 && WAKE_GRACE_MS <= 5000);
  assert.ok(MOMENT_STALE_MS >= 30_000);
});

test('parseVideoState: exact type, known state, tolerant position', () => {
  assert.deepEqual(parseVideoState({ type: 'evelyn:video_state', state: 'playing', position_seconds: 12.5 }), { state: 'playing', positionSeconds: 12.5 });
  assert.deepEqual(parseVideoState({ type: 'evelyn:video_state', state: 'ended' }), { state: 'ended', positionSeconds: null });
  for (const bad of [-1, NaN, Infinity, '12', null]) {
    assert.deepEqual(parseVideoState({ type: 'evelyn:video_state', state: 'paused', position_seconds: bad }), { state: 'paused', positionSeconds: null }, String(bad));
  }
  for (const d of [null, 'x', [], {}, { type: 'evelyn:video_state' }, { type: 'evelyn:video_state', state: 'buffering' }, { type: 'evelyn:start', state: 'playing' }]) {
    assert.equal(parseVideoState(d), null, JSON.stringify(d));
  }
});

test('parseHostPause / parseHostResume', () => {
  assert.deepEqual(parseHostPause({ type: 'evelyn:pause', reason: 'minimized' }), { reason: 'minimized' });
  assert.deepEqual(parseHostPause({ type: 'evelyn:pause' }), { reason: 'minimized' });
  assert.equal(parseHostPause({ type: 'evelyn:pause', reason: 'x'.repeat(200) })?.reason.length, 40);
  assert.equal(parseHostPause({ type: 'evelyn:resume' }), null);
  assert.equal(parseHostResume({ type: 'evelyn:resume' }), true);
  assert.equal(parseHostResume({ type: 'evelyn:pause' }), null);
  assert.equal(parseHostResume(null), null);
});

test('parseMoment: clamps every field, never rejects a known type', () => {
  const m = parseMoment({
    type: 'evelyn:moment', kind: 'question', position_seconds: 148.7, title: 't'.repeat(300), summary: 's'.repeat(5000),
    question: 'q'.repeat(5000), student_answer: 'a'.repeat(900), correct_answer: 'c'.repeat(900),
  });
  assert.ok(m);
  assert.equal(m.kind, 'question');
  assert.equal(m.positionSeconds, 148.7);
  assert.equal(m.title?.length, 80);
  assert.equal(m.summary?.length, 1500);
  assert.equal(m.question?.length, 2000);
  assert.equal(m.studentAnswer?.length, 500);
  assert.equal(m.correctAnswer?.length, 500);
  assert.deepEqual(parseMoment({ type: 'evelyn:moment' }), { kind: 'teaching_moment', positionSeconds: null });
  assert.equal(parseMoment({ type: 'evelyn:moment', kind: 'surprise', title: 7 })?.kind, 'teaching_moment');
  assert.equal(parseMoment({ type: 'evelyn:moments' }), null);
  assert.equal(parseMoment(undefined), null);
});

test('standby: nothing known ⇒ not standing by (v1.1 hosts unchanged)', () => {
  assert.equal(isStandingBy(S0), false);
  assert.equal(S0.video, null);
});

test('standby: video playing ⇒ standing by; paused or ended ⇒ available', () => {
  const p = play(S0, T, 10);
  assert.equal(isStandingBy(p), true);
  assert.equal(p.positionSeconds, 10);
  assert.equal(isStandingBy(pause(p, T + 1, 11)), false);
  assert.equal(isStandingBy(reduceLessonHost(p, { type: 'video_state', state: 'ended', positionSeconds: null }, T + 1)), false);
});

test('standby: a missing position keeps the last known one', () => {
  const s = pause(play(S0, T, 42), T + 1, null);
  assert.equal(s.positionSeconds, 42);
});

test('standby: repeated identical video_state is idempotent (Review Focus 1)', () => {
  let s = play(S0, T, 1);
  for (let i = 0; i < 50; i++) {
    const next = play(s, T + i * 250, 1 + i * 0.25);
    assert.equal(isStandingBy(next), true);
    s = next;
  }
  assert.equal(s.wokeAtMs, null);
});

test('standby: host pause holds standby whatever the video does; resume releases it', () => {
  let s = reduceLessonHost(pause(S0, T), { type: 'host_pause' }, T + 1);
  assert.equal(isStandingBy(s), true);
  s = pause(s, T + 2);
  assert.equal(isStandingBy(s), true);
  s = reduceLessonHost(s, { type: 'host_resume' }, T + 3);
  assert.equal(isStandingBy(s), false);
  assert.equal(isStandingBy(reduceLessonHost(play(S0, T), { type: 'host_resume' }, T + 1)), true);
});

test('wake: a student wake over a playing video ends standby at once', () => {
  const s = reduceLessonHost(play(S0, T), { type: 'student_wake' }, T + 100);
  assert.equal(isStandingBy(s), false);
  assert.equal(s.wokeAtMs, T + 100);
});

test('wake: a stale "playing" inside the grace window does not re-enter standby (Review Focus 3)', () => {
  let s = reduceLessonHost(play(S0, T), { type: 'student_wake' }, T + 100);
  s = play(s, T + 100 + WAKE_GRACE_MS - 1, 5);
  assert.equal(isStandingBy(s), false);
  assert.equal(s.positionSeconds, 5);
});

test('wake: the host never confirms ⇒ still awake; a later "playing" means the student pressed play', () => {
  let s = reduceLessonHost(play(S0, T), { type: 'student_wake' }, T + 100);
  assert.equal(isStandingBy(s), false);
  s = play(s, T + 100 + WAKE_GRACE_MS + 1);
  assert.equal(isStandingBy(s), true);
});

test('wake: confirmed pause clears the wake; the next play stands by immediately', () => {
  let s = reduceLessonHost(play(S0, T), { type: 'student_wake' }, T + 100);
  s = pause(s, T + 300, 9);
  assert.equal(s.wokeAtMs, null);
  assert.equal(isStandingBy(play(s, T + 400)), true);
});

test('wake: a wake while not standing by on the video changes nothing', () => {
  const s = pause(S0, T);
  assert.deepEqual(reduceLessonHost(s, { type: 'student_wake' }, T + 1), s);
  assert.deepEqual(reduceLessonHost(S0, { type: 'student_wake' }, T + 1), S0);
});

test('moment: wakes over a playing video and records its position; does not lift a host pause', () => {
  let s = reduceLessonHost(play(S0, T, 100), { type: 'moment', positionSeconds: 148 }, T + 1);
  assert.equal(isStandingBy(s), false);
  assert.equal(s.positionSeconds, 148);
  s = reduceLessonHost(reduceLessonHost(pause(S0, T), { type: 'host_pause' }, T), { type: 'moment', positionSeconds: null }, T + 1);
  assert.equal(isStandingBy(s), true);
});

test('play_command: drops an unconfirmed wake so a playing video stands by again', () => {
  let s = reduceLessonHost(play(S0, T), { type: 'student_wake' }, T + 100);
  s = reduceLessonHost(s, { type: 'play_command' }, T + 200);
  assert.equal(isStandingBy(s), true);
});

test('panel button: follows the last reported state', () => {
  assert.equal(panelToggleCommand(null), null);
  assert.equal(panelToggleCommand('playing'), 'pause');
  assert.equal(panelToggleCommand('paused'), 'play');
  assert.equal(panelToggleCommand('ended'), 'play');
});

test('moment directive: bracketed synthetic turn, facts in, generic wording', () => {
  const d = renderMomentDirective({ kind: 'teaching_moment', positionSeconds: 148, title: 'Chart 3', summary: 'Odds: A 45%, B 30%.' });
  assert.match(d, /^\[The lesson video just paused at 2:28 for a teaching moment: "Chart 3"\./);
  assert.match(d, /On screen: Odds: A 45%, B 30%\./);
  assert.match(d, /Step in now: /);
  assert.ok(d.endsWith(']'));
  // Must NOT look like a real student gesture to VTR's sendTextMessage.
  assert.equal(/^\s*\[(?:The student (?:wrote|drew|uploaded)|Via their review-agenda menu)/i.test(d), false);
});

test('moment directive: question with and without the student answer', () => {
  const withAnswer = renderMomentDirective({ kind: 'question', positionSeconds: null, question: 'What is 2 + 2?', studentAnswer: '5', correctAnswer: '4' });
  assert.match(withAnswer, /^\[The lesson video just paused for a question\./);
  assert.match(withAnswer, /Question: What is 2 \+ 2\?/);
  assert.match(withAnswer, /The student answered: 5/);
  assert.match(withAnswer, /never state it outright/);
  assert.match(withAnswer, /start from what the student answered/);
  const noAnswer = renderMomentDirective({ kind: 'quiz', positionSeconds: 5, question: 'Why?' });
  assert.match(noAnswer, /for a quiz question\./);
  assert.match(noAnswer, /ask the student what they think/);
  const bare = renderMomentDirective({ kind: 'teaching_moment', positionSeconds: null });
  assert.match(bare, /^\[The lesson video just paused for a teaching moment\. Step in now: /);
});

test('inactive clock: accumulates closed stretches plus the open one', () => {
  let c = INITIAL_INACTIVE_CLOCK;
  assert.equal(inactiveMsAt(c, T), 0);
  c = markInactive(c, true, T);
  assert.equal(inactiveMsAt(c, T + 5000), 5000);
  c = markInactive(c, true, T + 1000); // already inactive: start is kept
  assert.equal(inactiveMsAt(c, T + 5000), 5000);
  c = markInactive(c, false, T + 6000);
  assert.deepEqual(c, { totalMs: 6000, sinceMs: null });
  c = markInactive(c, false, T + 7000); // already active: no-op
  assert.equal(inactiveMsAt(c, T + 9000), 6000);
  c = markInactive(c, true, T + 10_000);
  assert.equal(inactiveMsAt(c, T + 12_000), 8000);
});

test('inactive clock: a clock that went backwards never subtracts', () => {
  const c = markInactive(markInactive(INITIAL_INACTIVE_CLOCK, true, T), false, T - 5000);
  assert.equal(c.totalMs, 0);
});

test('activeSeconds: wall time minus inactive time, never negative', () => {
  const c = { totalMs: 60_000, sinceMs: T };
  assert.equal(activeSeconds(300, c, T + 30_000), 210);
  assert.equal(activeSeconds(10, c, T + 30_000), 0);
});

test('shiftAnchor: moves a start anchor by the standby time that overlapped it', () => {
  assert.equal(shiftAnchor(null, T, T + 1000), null);
  assert.equal(shiftAnchor(T - 60_000, T, T + 20_000), T - 40_000); // started before standby
  assert.equal(shiftAnchor(T + 5000, T, T + 20_000), T + 20_000);    // started during standby
  assert.equal(shiftAnchor(T - 60_000, T, T - 1), T - 60_000);       // clock went backwards
});

// ── Wiring (source scans) — filled in by Tasks 3–6 ──
const root = join(__dirname, '..');
const read = (p: string) => (existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : '');
const flags = read('src/lib/tutor/orchestrator/flags.ts');

test('flag NEXT_PUBLIC_TUTOR_HOST_LESSON defaults ON', () => {
  assert.match(flags, /TUTOR_HOST_LESSON = process\.env\.NEXT_PUBLIC_TUTOR_HOST_LESSON !== 'off'/);
});

// WIRING-TESTS (Tasks 3–6 append their source scans above this line)

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Register the script and run it to verify it fails**

In `apps/tutor/package.json`, after the `"test:host-start"` line add:

```json
    "test:host-lesson": "npx tsx scripts/test-host-lesson.ts",
    "test:host-lesson-timeline": "npx tsx scripts/test-host-lesson-timeline.ts",
```

Run: `cd apps/tutor && npm run --silent test:host-lesson`
Expected: FAIL — cannot find module `../src/lib/tutor/portal/host-lesson`.

- [ ] **Step 3: Write the implementation**

```ts file=apps/tutor/src/lib/tutor/portal/host-lesson.ts
/**
 * One continuous lesson beside a host video (partner spec v1.2 §2–§5). Pure
 * helpers; the embed page (tutor-portal/embed) wires them to `window.message`
 * and `window.parent.postMessage`, and passes the resulting `standby` flag
 * down to the session.
 *
 * Why: the panel used to be one session per "Ask Tutor" click, so each
 * question re-paid the start and lost the conversation. Now the panel stays
 * open for the lesson. While the host's video plays, or the host has hidden
 * the panel, the tutor STANDS BY: silent, microphone released, session clock
 * stopped. A student question or a host "moment" wakes it.
 *
 * Standby is derived, never stored: `isStandingBy(state)`. The host is the
 * only authority on the video; the frame never guesses the player's state.
 */
import { LESSON_CONTEXT_LIMITS } from '../embed/lesson-context';

export const VIDEO_STATES = ['playing', 'paused', 'ended'] as const;
export type VideoState = (typeof VIDEO_STATES)[number];

export const MOMENT_KINDS = ['teaching_moment', 'question', 'quiz'] as const;
export type MomentKind = (typeof MOMENT_KINDS)[number];

/** Shown in the dock while standing by (spec §1). */
export const STANDBY_LINE = 'Feel free to ask a question about anything you see.';
/** After a student-initiated wake, a `playing` report this recent is the
 *  host's state from BEFORE it acted on our pause command — not a new play. */
export const WAKE_GRACE_MS = 2000;
/** The tutor's own play command must be confirmed by `video_state: playing`
 *  within this long, else the tutor stays available (spec §3.4). */
export const RESUME_CONFIRM_MS = 3000;
/** Continuous standby this long ends the session with `ended_reason: "idle"` (spec §5). */
export const STANDBY_IDLE_END_MS = 30 * 60 * 1000;
/** A moment that could not be delivered within this long (session never
 *  started, tutor kept busy) is dropped: the video has moved on. */
export const MOMENT_STALE_MS = 120 * 1000;

function obj(data: unknown): Record<string, unknown> | null {
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : null;
}

function secs(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
}

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  if (!t) return undefined;
  // Count code points so a clamp never splits a surrogate pair.
  return t.length > max ? Array.from(t).slice(0, max).join('') : t;
}

/** `{ type: 'evelyn:video_state', state, position_seconds? }`. An unknown
 *  state is ignored (null); a bad position is dropped, the state is kept. */
export function parseVideoState(data: unknown): { state: VideoState; positionSeconds: number | null } | null {
  const d = obj(data);
  if (!d || d.type !== 'evelyn:video_state') return null;
  if (typeof d.state !== 'string' || !(VIDEO_STATES as readonly string[]).includes(d.state)) return null;
  return { state: d.state as VideoState, positionSeconds: secs(d.position_seconds) };
}

/** `{ type: 'evelyn:pause', reason? }` — the host hid the panel. */
export function parseHostPause(data: unknown): { reason: string } | null {
  const d = obj(data);
  if (!d || d.type !== 'evelyn:pause') return null;
  return { reason: str(d.reason, 40) ?? 'minimized' };
}

/** `{ type: 'evelyn:resume' }` — the host showed the panel again. */
export function parseHostResume(data: unknown): true | null {
  const d = obj(data);
  return d && d.type === 'evelyn:resume' ? true : null;
}

export interface LessonMoment {
  kind: MomentKind;
  positionSeconds: number | null;
  title?: string;
  summary?: string;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
}

/** `{ type: 'evelyn:moment', … }`. Every field is optional and CLAMPED with
 *  the same limits as the token's lesson context; an unknown `kind` is a
 *  teaching moment. A host typo must not swallow the moment. */
export function parseMoment(data: unknown): LessonMoment | null {
  const d = obj(data);
  if (!d || d.type !== 'evelyn:moment') return null;
  const L = LESSON_CONTEXT_LIMITS;
  const kind = typeof d.kind === 'string' && (MOMENT_KINDS as readonly string[]).includes(d.kind)
    ? (d.kind as MomentKind)
    : 'teaching_moment';
  const m: LessonMoment = {
    kind,
    positionSeconds: secs(d.position_seconds),
    title: str(d.title, L.title),
    summary: str(d.summary, L.summary),
    question: str(d.question, L.question),
    studentAnswer: str(d.student_answer, L.studentAnswer),
    correctAnswer: str(d.correct_answer, L.correctAnswer),
  };
  return Object.fromEntries(Object.entries(m).filter(([, v]) => v !== undefined)) as unknown as LessonMoment;
}

export interface LessonHostState {
  /** Last `video_state` from the host; null until the first one (a host
   *  that never sends one gets the pre-v1.2 behaviour). */
  video: VideoState | null;
  positionSeconds: number | null;
  /** Between `evelyn:pause` and `evelyn:resume`. */
  hostPaused: boolean;
  /** When the student (or a moment) woke the tutor over a playing video.
   *  Non-null = awake although the last report says `playing`. */
  wokeAtMs: number | null;
}

export const INITIAL_LESSON_HOST_STATE: LessonHostState = {
  video: null, positionSeconds: null, hostPaused: false, wokeAtMs: null,
};

export type LessonHostEvent =
  | { type: 'video_state'; state: VideoState; positionSeconds: number | null }
  | { type: 'host_pause' }
  | { type: 'host_resume' }
  /** The student started typing, tapped the mic, or pressed pause in the panel. */
  | { type: 'student_wake' }
  | { type: 'moment'; positionSeconds: number | null }
  /** A play command was sent to the host (panel button or the tutor). */
  | { type: 'play_command' };

export function reduceLessonHost(s: LessonHostState, e: LessonHostEvent, nowMs: number): LessonHostState {
  switch (e.type) {
    case 'video_state': {
      const inGrace = s.wokeAtMs !== null && nowMs >= s.wokeAtMs && nowMs - s.wokeAtMs < WAKE_GRACE_MS;
      return {
        ...s,
        video: e.state,
        positionSeconds: e.positionSeconds ?? s.positionSeconds,
        wokeAtMs: e.state === 'playing' && inGrace ? s.wokeAtMs : null,
      };
    }
    case 'host_pause':
      return s.hostPaused ? s : { ...s, hostPaused: true };
    case 'host_resume':
      return s.hostPaused ? { ...s, hostPaused: false } : s;
    case 'student_wake':
      return s.video === 'playing' && s.wokeAtMs === null ? { ...s, wokeAtMs: nowMs } : s;
    case 'moment': {
      const positionSeconds = e.positionSeconds ?? s.positionSeconds;
      return s.video === 'playing' && s.wokeAtMs === null
        ? { ...s, positionSeconds, wokeAtMs: nowMs }
        : positionSeconds === s.positionSeconds ? s : { ...s, positionSeconds };
    }
    case 'play_command':
      return s.wokeAtMs === null ? s : { ...s, wokeAtMs: null };
  }
}

/** Standing by = the host hid the panel, or its video is playing and nothing woke the tutor. */
export function isStandingBy(s: LessonHostState): boolean {
  return s.hostPaused || (s.video === 'playing' && s.wokeAtMs === null);
}

/** What the panel's play/pause button sends; null = no button yet (no `video_state` seen). */
export function panelToggleCommand(video: VideoState | null): 'play' | 'pause' | null {
  if (video === null) return null;
  return video === 'playing' ? 'pause' : 'play';
}

function mmss(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** The synthetic (bracketed, silent) turn that makes the tutor step in on a
 *  host moment. Generic by design: every fact comes from the host's fields. */
export function renderMomentDirective(m: LessonMoment): string {
  const at = m.positionSeconds !== null ? ` at ${mmss(Math.floor(m.positionSeconds))}` : '';
  const what = m.kind === 'teaching_moment' ? 'a teaching moment' : m.kind === 'quiz' ? 'a quiz question' : 'a question';
  const parts = [`The lesson video just paused${at} for ${what}${m.title ? `: "${m.title}"` : ''}.`];
  if (m.summary) parts.push(`On screen: ${m.summary}`);
  if (m.question) parts.push(`Question: ${m.question}`);
  if (m.studentAnswer) parts.push(`The student answered: ${m.studentAnswer}`);
  if (m.correctAnswer) parts.push(`Correct answer (never state it outright; guide the student to it): ${m.correctAnswer}`);
  if (m.question && m.studentAnswer) {
    parts.push('Step in now: start from what the student answered — what they got right, then the one idea that fixes the rest.');
  } else if (m.question) {
    parts.push('Step in now: ask the student what they think and why, then work from their answer.');
  } else {
    parts.push('Step in now: in one or two sentences say what this shows, then ask one question that checks the student followed it.');
  }
  return `[${parts.join(' ')}]`;
}

/** Time that must not count as session time: standby, and a prewarmed
 *  frame's wait before the start. `sinceMs` = the open stretch's start. */
export interface InactiveClock {
  totalMs: number;
  sinceMs: number | null;
}

export const INITIAL_INACTIVE_CLOCK: InactiveClock = { totalMs: 0, sinceMs: null };

export function markInactive(c: InactiveClock, inactive: boolean, nowMs: number): InactiveClock {
  if (inactive) return c.sinceMs === null ? { ...c, sinceMs: nowMs } : c;
  if (c.sinceMs === null) return c;
  return { totalMs: c.totalMs + Math.max(0, nowMs - c.sinceMs), sinceMs: null };
}

export function inactiveMsAt(c: InactiveClock, nowMs: number): number {
  return c.totalMs + (c.sinceMs === null ? 0 : Math.max(0, nowMs - c.sinceMs));
}

/** Session seconds to report: wall seconds since the mount minus inactive time. */
export function activeSeconds(wallSeconds: number, c: InactiveClock, nowMs: number): number {
  return Math.max(0, wallSeconds - inactiveMsAt(c, nowMs) / 1000);
}

/** A "started at" anchor every elapsed-time reader subtracts from now
 *  (header clock, hard-stop cap, wrap minute). On leaving a standby that
 *  began at `standbySinceMs`, move the anchor forward by the part of that
 *  standby it covers, so every reader keeps counting active time only. */
export function shiftAnchor(anchorMs: number | null, standbySinceMs: number, nowMs: number): number | null {
  if (anchorMs === null) return null;
  const overlap = nowMs - Math.max(standbySinceMs, anchorMs);
  return overlap > 0 ? anchorMs + overlap : anchorMs;
}
```

In `apps/tutor/src/lib/tutor/orchestrator/flags.ts`, directly after the `export const TUTOR_HOST_START = …` line add:

```ts
// One continuous lesson beside a host video (partner spec v1.2): standby while
// the video plays or the panel is hidden, wake on a question or a moment,
// per-turn <lesson_video> context, tutor-resumed playback.
// NEXT_PUBLIC_TUTOR_HOST_LESSON=off ignores the v1.2 host messages entirely.
export const TUTOR_HOST_LESSON = process.env.NEXT_PUBLIC_TUTOR_HOST_LESSON !== 'off';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run --silent test:host-lesson`
Expected: every test PASS, last line `N/N passed`.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/portal/host-lesson.ts apps/tutor/scripts/test-host-lesson.ts apps/tutor/src/lib/tutor/orchestrator/flags.ts apps/tutor/package.json
git commit -m "feat(embed): host-lesson protocol helpers — video state, moments, standby reducer, inactive-time accounting"
```

---

### Task 2: Lesson timeline (`host-lesson-timeline.ts`)

**Files:**
- Create: `apps/tutor/src/lib/tutor/portal/host-lesson-timeline.ts`
- Create: `apps/tutor/scripts/test-host-lesson-timeline.ts`

**Interfaces:**
- Consumes: `VideoState` from `host-lesson.ts`.
- Produces: `LESSON_TIMELINE_LIMITS`, `TimelineEntry`, `ParsedTimeline`, `parseLessonTimeline(data)`, `LESSON_NOW_LIMITS`, `LESSON_NOW_MAX_CHARS`, `renderLessonNow({ timeline, video, positionSeconds, resumeTool })` → `string | undefined`.

- [ ] **Step 1: Write the failing test**

```ts file=apps/tutor/scripts/test-host-lesson-timeline.ts
/**
 * Whole-lesson timeline (partner spec v1.2 §4): clamp-never-reject parsing
 * and the per-turn window the model sees.
 *
 * Run: npm run test:host-lesson-timeline
 */
import { strict as assert } from 'node:assert';
import {
  LESSON_NOW_LIMITS,
  LESSON_NOW_MAX_CHARS,
  LESSON_TIMELINE_LIMITS,
  parseLessonTimeline,
  renderLessonNow,
  type TimelineEntry,
} from '../src/lib/tutor/portal/host-lesson-timeline';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

const msg = (timeline: unknown) => ({ type: 'evelyn:lesson', timeline });

test('limits are the spec values', () => {
  assert.deepEqual(LESSON_TIMELINE_LIMITS, { entries: 5000, entryChars: 500, totalChars: 150_000 });
});

test('parse: the host transcript format passes through; kind defaults to speech', () => {
  const p = parseLessonTimeline(msg([
    { start: 0, end: 4.2, text: 'Welcome back' },
    { start: 148, kind: 'visual', text: 'Chart 3: A 45%, B 30%' },
    { start: 131.4, end: 134, text: 'Watch what happens' },
  ]));
  assert.ok(p);
  assert.deepEqual(p.entries, [
    { start: 0, end: 4.2, text: 'Welcome back', kind: 'speech' },
    { start: 131.4, end: 134, text: 'Watch what happens', kind: 'speech' },
    { start: 148, text: 'Chart 3: A 45%, B 30%', kind: 'visual' },
  ]);
  assert.equal(p.received, 3);
  assert.equal(p.cut, false);
});

test('parse: wrong type or a non-array timeline is not a lesson', () => {
  for (const d of [null, 'x', {}, { type: 'evelyn:lesson' }, { type: 'evelyn:lesson', timeline: 'abc' }, { type: 'evelyn:lesson', timeline: { 0: {} } }, { type: 'evelyn:lessons', timeline: [] }]) {
    assert.equal(parseLessonTimeline(d), null, JSON.stringify(d));
  }
  assert.deepEqual(parseLessonTimeline(msg([]))?.entries, []);
});

test('parse: malformed entries are skipped, never thrown on (Review Focus 4)', () => {
  const p = parseLessonTimeline(msg([
    null, 7, 'x', [], {}, { start: NaN, text: 'a' }, { start: -1, text: 'a' }, { start: '3', text: 'a' },
    { start: 1 }, { start: 1, text: '   ' }, { start: 1, text: 42 },
    { start: 2, end: 1, text: 'end before start' }, { start: 3, end: 'x', text: 'bad end' }, { start: 4, kind: 'banana', text: 'odd kind' },
  ]));
  assert.ok(p);
  assert.deepEqual(p.entries, [
    { start: 2, text: 'end before start', kind: 'speech' },
    { start: 3, text: 'bad end', kind: 'speech' },
    { start: 4, text: 'odd kind', kind: 'speech' },
  ]);
  assert.equal(p.received, 14);
});

test('parse: entry text over 500 characters is cut', () => {
  const p = parseLessonTimeline(msg([{ start: 0, text: 'x'.repeat(1_000_000) }]));
  assert.equal(p?.entries[0].text.length, 500);
  assert.equal(p?.cut, true);
});

test('parse: more than 5,000 entries keeps the first 5,000', () => {
  const p = parseLessonTimeline(msg(Array.from({ length: 50_000 }, (_, i) => ({ start: i, text: 'w' }))));
  assert.equal(p?.entries.length, 5000);
  assert.equal(p?.entries[4999].start, 4999);
  assert.equal(p?.cut, true);
});

test('parse: total text over 150,000 characters is cut at the limit', () => {
  const p = parseLessonTimeline(msg(Array.from({ length: 400 }, (_, i) => ({ start: i, text: 'y'.repeat(500) }))));
  assert.ok(p);
  assert.equal(p.entries.reduce((n, e) => n + e.text.length, 0), 150_000);
  assert.equal(p.entries.length, 300);
  assert.equal(p.cut, true);
});

const TL: TimelineEntry[] = [
  { start: 0, end: 4, text: 'Welcome back.', kind: 'speech' },
  { start: 20, kind: 'visual', text: 'Chart 1: the track map.' },
  { start: 131, end: 134, text: 'Watch what happens', kind: 'speech' },
  { start: 134, end: 137, text: 'when the box opens.', kind: 'speech' },
  { start: 148, kind: 'visual', text: 'Chart 3: A 45%, B 30%, C 20%, D 5%.' },
  { start: 163, end: 166, text: 'The least likely one came up.', kind: 'speech' },
  { start: 400, kind: 'visual', text: 'Chart 9: the final table.' },
  { start: 401, end: 404, text: 'Far in the future.', kind: 'speech' },
];

test('render: nothing until the host has reported a video state', () => {
  assert.equal(renderLessonNow({ timeline: TL, video: null, positionSeconds: null, resumeTool: true }), undefined);
});

test('render: state line, visuals so far, speech around the position', () => {
  const r = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: true });
  assert.ok(r);
  assert.match(r, /The video is paused at 2:30\./);
  assert.match(r, /\[0:20\] Chart 1: the track map\./);
  assert.match(r, /\[2:28\] Chart 3: A 45%, B 30%, C 20%, D 5%\./);
  assert.ok(!r.includes('Chart 9'), 'a visual that has not appeared yet is not shown');
  assert.match(r, /\[2:11\] Watch what happens when the box opens\./);
  assert.match(r, /\[2:43\] The least likely one came up\./);
  assert.ok(!r.includes('Welcome back'), 'speech far before the position is outside the window');
  assert.ok(!r.includes('Far in the future'));
  assert.ok(r.indexOf('Chart 1') < r.indexOf('Chart 3'), 'visuals in time order');
});

test('render: resume instructions only when the tool is offered and the video can resume', () => {
  const on = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: true }) ?? '';
  assert.match(on, /`resume_lesson`/);
  const off = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: 150, resumeTool: false }) ?? '';
  assert.ok(!off.includes('resume_lesson'));
  const ended = renderLessonNow({ timeline: TL, video: 'ended', positionSeconds: 500, resumeTool: true }) ?? '';
  assert.match(ended, /The video has finished/);
  assert.ok(!/call `resume_lesson`/.test(ended));
});

test('render: no timeline still gives the state and the rules', () => {
  const r = renderLessonNow({ timeline: null, video: 'paused', positionSeconds: 12, resumeTool: true }) ?? '';
  assert.match(r, /The video is paused at 0:12\./);
  assert.ok(!r.includes('On screen so far'));
  assert.match(r, /`resume_lesson`/);
});

test('render: unknown position shows the visuals but no speech window', () => {
  const r = renderLessonNow({ timeline: TL, video: 'paused', positionSeconds: null, resumeTool: false }) ?? '';
  assert.match(r, /The video is paused\./);
  assert.ok(!r.includes('What is said around this point'));
});

test('render: budgets hold on the largest timeline; the newest visuals and nearest speech survive', () => {
  const big: TimelineEntry[] = [];
  for (let i = 0; i < 2500; i++) big.push({ start: i, text: `s${i} ` + 'w'.repeat(400), kind: 'speech' });
  for (let i = 0; i < 2500; i++) big.push({ start: i, text: `v${i} ` + 'z'.repeat(400), kind: 'visual' });
  big.sort((a, b) => a.start - b.start);
  const r = renderLessonNow({ timeline: big, video: 'paused', positionSeconds: 2000, resumeTool: true }) ?? '';
  assert.ok(r.length <= LESSON_NOW_MAX_CHARS, `block is ${r.length} chars`);
  assert.ok(r.includes('v2000 '), 'the visual on screen now is kept');
  assert.ok(!r.includes('v100 '), 'old visuals are dropped first');
  assert.ok(r.includes('s2000 '), 'speech at the position is kept');
  assert.ok(LESSON_NOW_LIMITS.speechChars + LESSON_NOW_LIMITS.visualChars < LESSON_NOW_MAX_CHARS);
});

test('render: generic wording — no partner or game names', () => {
  const r = renderLessonNow({ timeline: [], video: 'playing', positionSeconds: 1, resumeTool: true }) ?? '';
  assert.ok(!/gameclass|mario|sonic/i.test(r));
});

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd apps/tutor && npm run --silent test:host-lesson-timeline`
Expected: FAIL — cannot find module `../src/lib/tutor/portal/host-lesson-timeline`.

- [ ] **Step 3: Write the implementation**

```ts file=apps/tutor/src/lib/tutor/portal/host-lesson-timeline.ts
/**
 * Whole-lesson timeline for a host video (partner spec v1.2 §4). The host
 * posts it once (`evelyn:lesson`) — too large for the token — and on every
 * turn the model is shown only the part around the current video position
 * plus every on-screen visual so far.
 *
 * Why a window and not the whole lesson: a full transcript is up to 150,000
 * characters; resending it every turn would cost more than the rest of the
 * prompt, and a model handed the whole lesson answers about the wrong part.
 *
 * The rendered window travels in the per-turn USER content (the brain's
 * `<lesson_video>` block), never in the system prompt: it changes every turn,
 * and the system prompt is shared and cached across sessions.
 *
 * Pure. Clamp, never reject: a malformed host entry must not fail a session.
 */
import type { VideoState } from './host-lesson';

export const LESSON_TIMELINE_LIMITS = { entries: 5000, entryChars: 500, totalChars: 150_000 } as const;

export interface TimelineEntry {
  start: number;
  end?: number;
  text: string;
  /** `visual` = what is on screen (the transcript only carries what is said). */
  kind: 'speech' | 'visual';
}

export interface ParsedTimeline {
  /** Sorted by `start`. */
  entries: TimelineEntry[];
  /** How many items the host sent. */
  received: number;
  /** True when any limit cut something. */
  cut: boolean;
}

function secs(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
}

function clamp(t: string, max: number): string {
  if (t.length <= max) return t;
  // Count code points so a clamp never splits a surrogate pair. Slice first:
  // Array.from on a megabyte string would allocate a megabyte array.
  return Array.from(t.slice(0, max * 2)).slice(0, max).join('');
}

/** `{ type: 'evelyn:lesson', timeline: [...] }`. null when it is not that
 *  message; otherwise whatever survives the limits, in time order. */
export function parseLessonTimeline(data: unknown): ParsedTimeline | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const d = data as { type?: unknown; timeline?: unknown };
  if (d.type !== 'evelyn:lesson' || !Array.isArray(d.timeline)) return null;
  const L = LESSON_TIMELINE_LIMITS;
  const entries: TimelineEntry[] = [];
  let total = 0;
  let cut = false;
  for (const raw of d.timeline) {
    if (entries.length >= L.entries || total >= L.totalChars) { cut = true; break; }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const r = raw as Record<string, unknown>;
    const start = secs(r.start);
    if (start === null || typeof r.text !== 'string') continue;
    const trimmed = r.text.trim();
    if (!trimmed) continue;
    let text = clamp(trimmed, L.entryChars);
    if (text.length < trimmed.length) cut = true;
    if (total + text.length > L.totalChars) { text = clamp(text, L.totalChars - total); cut = true; }
    total += text.length;
    const end = secs(r.end);
    entries.push({
      start,
      ...(end !== null && end >= start ? { end } : {}),
      text,
      kind: r.kind === 'visual' ? 'visual' : 'speech',
    });
  }
  // Stable: entries with the same start keep the host's order.
  entries.sort((a, b) => a.start - b.start);
  return { entries, received: d.timeline.length, cut };
}

export const LESSON_NOW_LIMITS = {
  /** Speech this far before the position is context for "what did they just say". */
  beforeSeconds: 120,
  /** A little ahead: the student often asks just before the line that answers it. */
  afterSeconds: 20,
  speechChars: 4000,
  visualChars: 4000,
  /** Short caption segments are joined; a new time stamp starts this often. */
  stampEverySeconds: 15,
} as const;

/** Upper bound of the rendered block; the brain route refuses anything longer. */
export const LESSON_NOW_MAX_CHARS = 12_000;

function mmss(total: number): string {
  const t = Math.floor(total);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

const STATE_WORD: Record<VideoState, string> = { playing: 'playing', paused: 'paused', ended: 'finished' };

/**
 * The body of the per-turn `<lesson_video>` block; undefined until the host
 * has reported a video state (a host without a video gets no block).
 * `resumeTool` = the `resume_lesson` tool is offered this session.
 */
export function renderLessonNow(input: {
  timeline: TimelineEntry[] | null;
  video: VideoState | null;
  positionSeconds: number | null;
  resumeTool: boolean;
}): string | undefined {
  const { video, positionSeconds: pos } = input;
  if (video === null) return undefined;
  const timeline = input.timeline ?? [];
  const L = LESSON_NOW_LIMITS;
  const out: string[] = [];
  out.push(
    `The student is watching a lesson video beside this conversation. ` +
    (video === 'ended' ? 'The video has finished.' : `The video is ${STATE_WORD[video]}${pos !== null ? ` at ${mmss(pos)}` : ''}.`),
  );

  // Every visual that has appeared so far; when over budget the oldest go first.
  const visuals = timeline.filter((e) => e.kind === 'visual' && (pos === null || e.start <= pos + 1));
  const visualLines: string[] = [];
  let used = 0;
  for (let i = visuals.length - 1; i >= 0; i--) {
    const line = `[${mmss(visuals[i].start)}] ${visuals[i].text}`;
    if (used + line.length > L.visualChars) break;
    used += line.length + 1;
    visualLines.unshift(line);
  }
  if (visualLines.length) out.push('On screen so far (latest last):', ...visualLines);

  // Speech around the position.
  if (pos !== null) {
    let speech = timeline.filter((e) => e.kind === 'speech' && e.start >= pos - L.beforeSeconds && e.start <= pos + L.afterSeconds);
    let chars = speech.reduce((n, e) => n + e.text.length + 1, 0);
    // Over budget: drop whichever end is farther from the position.
    while (speech.length > 1 && chars > L.speechChars - 200) {
      const dropFirst = pos - speech[0].start >= speech[speech.length - 1].start - pos;
      chars -= (dropFirst ? speech[0] : speech[speech.length - 1]).text.length + 1;
      speech = dropFirst ? speech.slice(1) : speech.slice(0, -1);
    }
    const speechLines: string[] = [];
    let stampAt = -Infinity;
    for (const e of speech) {
      if (e.start - stampAt >= L.stampEverySeconds || !speechLines.length) {
        speechLines.push(`[${mmss(e.start)}] ${e.text}`);
        stampAt = e.start;
      } else {
        speechLines[speechLines.length - 1] += ` ${e.text}`;
      }
    }
    if (speechLines.length) out.push(`What is said around this point (the video is at ${mmss(pos)}):`, ...speechLines);
  }

  out.push(
    'Treat these lines as the facts of the lesson at this point. Do not add names, numbers or events that are not in them or in the lesson context; ' +
    'if a detail is missing, say you do not have it. Answer about this point in the video unless the student asks about another part.',
  );
  if (input.resumeTool) {
    out.push(
      video === 'ended'
        ? 'There is nothing left to resume.'
        : 'When the student has shown they understand, or says they want to keep watching, say one short hand-back line and call `resume_lesson` in that same turn; ' +
          'the video then plays and you stay quiet until the student asks again. Never call it while a question you asked is still unanswered.',
    );
  }
  return out.join('\n');
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/tutor && npm run --silent test:host-lesson-timeline`
Expected: every test PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/portal/host-lesson-timeline.ts apps/tutor/scripts/test-host-lesson-timeline.ts
git commit -m "feat(embed): lesson timeline — clamped parse and the per-turn window around the video position"
```

---

### Task 3: Brain plumbing — `<lesson_video>` block and the `resume_lesson` tool

**Files:**
- Modify: `apps/tutor/src/lib/tutor/voice/claude-brain.ts` (`BrainTurnInput` near the `styleReminder` field ~line 330; a new `formatLessonVideoBlock` beside `formatDemoStopBlock` ~line 1622; BOTH `userContent` assemblies — `runBrainTurn` ~line 1955 and `streamBrainTurn` ~line 2280)
- Modify: `apps/tutor/src/app/api/tutor/brain/stream/route.ts` (body type ~line 120; sanitising beside `demoStop` ~line 735; tool append after the homework append ~line 704; the `streamBrainTurn` input ~line 852)
- Modify: `apps/tutor/src/app/tutor/hooks/toolDefinitions.ts` (new exported `RESUME_LESSON_TOOL` beside `SET_CURRENT_PROBLEM_TOOL` ~line 2198; the name→command mapper beside `close_session_notes` ~line 3050; the command union type that holds `action: 'closeSessionNotes'`)
- Test: `apps/tutor/scripts/test-host-lesson.ts` (append above the `WIRING-TESTS` marker)

**Interfaces:**
- Consumes: `LESSON_NOW_MAX_CHARS` from Task 2.
- Produces: request body fields `lessonNow?: string` (≤ 12,000 chars) and `videoHost?: boolean`; `BrainTurnInput.lessonNow?: string`; `formatLessonVideoBlock(lessonNow?: string): string`; `RESUME_LESSON_TOOL: ToolDefinition` (name `resume_lesson`, no parameters); tool command `{ action: 'resumeLesson' }`.

- [ ] **Step 1: Write the failing tests** — insert above the `// WIRING-TESTS` line of `scripts/test-host-lesson.ts`:

```ts
const brain = read('src/lib/tutor/voice/claude-brain.ts');
const route = read('src/app/api/tutor/brain/stream/route.ts');
const toolDefs = read('src/app/tutor/hooks/toolDefinitions.ts');

test('brain: <lesson_video> block is rendered in BOTH turn builders, in the user content', () => {
  assert.match(brain, /export function formatLessonVideoBlock\(/);
  assert.match(brain, /<lesson_video>\\n\$\{/);
  const uses = brain.split('formatLessonVideoBlock(input.lessonNow)').length - 1;
  assert.equal(uses, 2, 'runBrainTurn and streamBrainTurn');
  assert.equal(brain.split('lessonVideoBlock +').length - 1, 2, 'joined into both userContent strings');
});

test('route: lessonNow is bounded and videoHost appends the resume tool after the subject filter', () => {
  assert.match(route, /LESSON_NOW_MAX_CHARS/);
  assert.match(route, /body\.videoHost === true/);
  assert.match(route, /RESUME_LESSON_TOOL\]/);
  assert.ok(route.indexOf('RESUME_LESSON_TOOL]') > route.indexOf('filterToolsForSubject('), 'appended after Lever A');
});

test('tool: resume_lesson is defined outside the default catalogue and maps to resumeLesson', () => {
  assert.match(toolDefs, /export const RESUME_LESSON_TOOL: ToolDefinition = \{\s*name: 'resume_lesson'/);
  assert.match(toolDefs, /funcName === 'resume_lesson'/);
  assert.match(toolDefs, /action: 'resumeLesson'/);
  const catalogue = toolDefs.slice(toolDefs.indexOf('export const WHITEBOARD_TOOLS'), toolDefs.indexOf('export const SET_CURRENT_PROBLEM_TOOL'));
  assert.ok(!catalogue.includes("'resume_lesson'"), 'not in the shared default tools array');
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd apps/tutor && npm run --silent test:host-lesson`
Expected: the three new tests FAIL, the Task 1 tests PASS.

- [ ] **Step 3: Implement**

`claude-brain.ts` — in `BrainTurnInput`, after the `styleReminder?: string;` field:

```ts
  /** Host video beside the session (partner spec v1.2 §4): the lesson around
   *  the current video position, rendered client-side by renderLessonNow.
   *  Absent ⇒ no `<lesson_video>` block ⇒ userContent byte-identical. */
  lessonNow?: string;
```

After `formatDemoStopBlock`:

```ts
/** Render the `<lesson_video>` block (partner spec v1.2 §4). '' when absent. */
export function formatLessonVideoBlock(lessonNow?: string): string {
  return lessonNow ? `<lesson_video>\n${lessonNow}\n</lesson_video>\n\n` : '';
}
```

In BOTH `runBrainTurn` and `streamBrainTurn`, directly after the `const demoStopBlock = formatDemoStopBlock(input.demoStop);` line add:

```ts
  // Host video (spec v1.2 §4): the lesson at the current video position. '' when absent.
  const lessonVideoBlock = formatLessonVideoBlock(input.lessonNow);
```

and in both `userContent` concatenations add `lessonVideoBlock +` on its own line directly BEFORE the `lessonBlock +` line (facts about the lesson sit with the other lesson facts).

`toolDefinitions.ts` — directly AFTER the closing `};` of `SET_CURRENT_PROBLEM_TOOL` (not inside or before it: it must stay out of `WHITEBOARD_TOOLS`):

```ts
/** Offered only to sessions whose host has a lesson video (partner spec v1.2
 *  §3.4) — appended by the brain route after the subject filter, so every
 *  other session's tools array (and cached prefix) is unchanged. */
export const RESUME_LESSON_TOOL: ToolDefinition = {
  name: 'resume_lesson',
  description: 'Silent — the student does not hear or see this. Resumes the lesson video the student is watching beside this conversation. Call it only when your context has a <lesson_video> block and the student has shown they understand or asked to keep watching. Say one short hand-back line in the same turn; the video starts when you finish speaking, and you then stay quiet until the student asks again. Never call it while a question you asked is still unanswered.',
  parameters: { type: 'object', properties: {}, required: [] },
};
```

In the name→command mapper, directly before `if (funcName === 'close_session_notes') {`:

```ts
  if (funcName === 'resume_lesson') {
    return { action: 'resumeLesson' };
  }
```

Add `| { action: 'resumeLesson' }` to the command union that already contains the `closeSessionNotes` member (find it with `grep -n "action: 'closeSessionNotes'" -r apps/tutor/src`; it is the type the mapper returns).

`route.ts` — import: add `RESUME_LESSON_TOOL` to the `toolDefinitions` import and `import { LESSON_NOW_MAX_CHARS } from '@/lib/tutor/portal/host-lesson-timeline';`. In the request-body interface, after `demoStop?`:

```ts
  /** Partner spec v1.2 §4: rendered lesson window. See BrainTurnInput.lessonNow. */
  lessonNow?: string;
  /** Partner spec v1.2 §3.4: this session's host has a lesson video ⇒ offer `resume_lesson`. */
  videoHost?: boolean;
```

Directly after the `if (homework) { … SET_CURRENT_PROBLEM_TOOL … }` block:

```ts
      // Host video (spec v1.2): sanitised like every other client block — a
      // malformed client can never inject an oversized one. Fail closed.
      const lessonNow =
        typeof body.lessonNow === 'string' && body.lessonNow.trim() && body.lessonNow.length <= LESSON_NOW_MAX_CHARS
          ? body.lessonNow
          : undefined;
      if (body.videoHost === true) {
        // Session-stable (derived from the embed token), so a video-host
        // session's tools array is the same on every turn and shared by all
        // such sessions. Appended AFTER the Lever A filter, like homework.
        toolFilter = { ...toolFilter, tools: [...toolFilter.tools, RESUME_LESSON_TOOL] };
      }
      if (lessonNow || body.videoHost === true) {
        console.log(`[lesson-video] block=${lessonNow ? lessonNow.length : 0} chars resume_tool=${body.videoHost === true}`);
      }
```

In the object passed to `streamBrainTurn`, after `demoStop,` add `lessonNow,`.

- [ ] **Step 4: Run tests and typecheck**

Run: `cd apps/tutor && npm run --silent test:host-lesson && npx tsc --noEmit -p .`
Expected: all PASS; tsc prints nothing.

Then run the prompt-shape tests that pin the userContent and the tools array, to prove non-video sessions are unchanged:
`npm run --silent test:system-prompt-parts && npm run --silent test:lever-a 2>/dev/null; grep -o '"test:[a-z0-9-]*\(tool\|cache\|prompt\)[a-z0-9-]*"' package.json`
Run every script that grep lists. Expected: all PASS with no snapshot changes.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/voice/claude-brain.ts apps/tutor/src/app/api/tutor/brain/stream/route.ts apps/tutor/src/app/tutor/hooks/toolDefinitions.ts apps/tutor/scripts/test-host-lesson.ts
git commit -m "feat(tutor): per-turn <lesson_video> block and a resume_lesson tool for video-host sessions"
```

---

### Task 4: Session mechanics in `VoiceTutorRealtime.tsx` (VTR)

**Files:**
- Modify: `apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx`
- Modify: `apps/tutor/src/lib/tutor/orchestrator/types.ts` (the handle type holding `setTutorVoiceMuted?` ~line 104)
- Test: `apps/tutor/scripts/test-host-lesson.ts`

**Interfaces:**
- Consumes: `shiftAnchor`, `MOMENT_STALE_MS` (Task 1); body fields `lessonNow`, `videoHost` and command `{ action: 'resumeLesson' }` (Task 3).
- Produces (new VTR props, all optional): `standby?: boolean`, `videoHost?: boolean`, `getLessonNow?: () => string | undefined`, `onStudentWake?: (via: 'typing' | 'mic') => void`, `onResumeLesson?: () => void`. New handle method: `deliverMoment?: (directive: string) => void`.

Behaviour contract (each line is one edit; anchors are current line numbers, re-find by the quoted text):

1. **Props + refs.** Add the five props beside `prewarm?: boolean` (prop type ~line 743, destructuring ~line 1262). Add refs near `idleNudgeTimerRef` (~line 1903): `standbyRef = useRef(false)`, `standbySinceMsRef = useRef<number | null>(null)`, `pendingMomentRef = useRef<{ text: string; atMs: number } | null>(null)`, `resumeLessonPendingRef = useRef(false)`, plus latest-closure refs `getLessonNowRef`, `onStudentWakeRef`, `onResumeLessonRef` assigned on every render (pattern: `onRelayReadyRef` ~line 20773). `const hostStandby = TUTOR_HOST_LESSON && standby === true;` and `standbyRef.current = hostStandby;` in the render body.
2. **Mic released.** Line ~20771: `const perceptionEnabled = sessionMode !== 'text' && perceptionStage >= 0 && realtime.isConnected && !prewarmMicHold && !hostStandby;`
3. **Standby effect** — `useEffect(() => { … }, [hostStandby])`, placed after `armIdleNudge` (~line 21013):
   - On enter: `standbySinceMsRef.current = Date.now()`; abort the turn in flight exactly as the farewell seal does (`queuedTranscriptsRef.current = []; inFlightBrainAbortRef.current?.abort(); speakTextBlockedUntilRef.current = Date.now() + SPEAK_TEXT_GATE_MS;`); drop queued sentences but let the one being spoken finish (see Step 3 note); `realtime.muteInput()` when `sessionMode !== 'text'`; clear `idleNudgeTimerRef`; `resumeLessonPendingRef.current = false`; `onDebugEvent?.('standby_enter', …)`.
   - On leave (only if `standbySinceMsRef.current !== null`): `voiceSessionStartedAtMsRef.current = shiftAnchor(voiceSessionStartedAtMsRef.current, since, Date.now())`; clear `standbySinceMsRef`; when `sessionMode !== 'text' && hasStartedRef.current && !isMicMutedRef.current && !studentTypingRef.current && realtime.isConnected` call `realtime.startListening()`; `armIdleNudgeRef.current()` when `hasStartedRef.current`; `onDebugEvent?.('standby_leave', \`ms=${…}\`)`.
4. **Idle nudge off.** In `fireOrRecheck` (~line 20933), first line after `idleNudgeTimerRef.current = null;`: `if (standbyRef.current) return;`
5. **Hard-stop cap counts active time.** In the cap interval (~line 23857), after `if (hardStopFiredRef.current) return;`: `if (standbyRef.current) return;`
6. **No synthetic turns in standby.** At the top of `handleStudentTranscriptForBrain` (find `if (farewellSealedRef.current) return;` ~line 19451) add: `if (standbyRef.current && opts?.silent) return;`
7. **Wake on mic tap.** First statement of `handleMicClick` after the text-mode early return (~line 23897): `if (standbyRef.current) { onStudentWakeRef.current?.('mic'); return; }` — the standby-leave effect opens the mic.
8. **Wake on typing.** In the composer input's `onFocus` (~line 25306), first line: `if (standbyRef.current) onStudentWakeRef.current?.('typing');` and the same guard as the first line of the composer form's submit handler (a submit without focus, e.g. the e2e harness).
9. **Per-turn body.** In the brain request body (~line 12163, beside `demoStop,`): `lessonNow: TUTOR_HOST_LESSON ? getLessonNowRef.current?.() : undefined,` and `videoHost: TUTOR_HOST_LESSON && videoHost ? true : undefined,`
10. **Moment delivery.** Handle method `deliverMoment: (directive) => { pendingMomentRef.current = { text: directive, atMs: Date.now() }; }`. One `useEffect` with a 250 ms interval: if nothing pending return; if `Date.now() - atMs > MOMENT_STALE_MS` drop it and `onDebugEvent?.('moment_dropped', 'why=stale')`; deliver when `hasStartedRef.current && !standbyRef.current && !endingRef.current && productionStateRef.current !== 'speaking' && !brainBusyRef.current && awaitingDispatchTimerRef.current == null` by clearing the ref and calling `handleStudentTranscriptForBrain(text, { silent: true, bypassPerceptionDedupe: true })` (the idle nudge's mechanism), then `onDebugEvent?.('moment_delivered', \`waitMs=${…}\`)`.
11. **Tutor resumes the video.** In the tool-command dispatcher beside `if (cmd.action === 'closeSessionNotes')` (~line 7815): `if (cmd.action === 'resumeLesson') { … }` — when `TUTOR_HOST_LESSON && videoHost`: `resumeLessonPendingRef.current = true; onDebugEvent?.('resume_lesson_called', '')` and return the tool-result note `'resume_lesson: the video will play when you finish speaking — say one short hand-back line and nothing else.'`; otherwise note `'resume_lesson: there is no lesson video in this session — carry on.'` (follow how the `closeSessionNotes` branch returns its `note`). A second interval effect (200 ms): while `resumeLessonPendingRef.current`, when `productionStateRef.current !== 'speaking' && !brainBusyRef.current` has held for 600 ms, clear the flag, `onDebugEvent?.('resume_lesson_fired', '')` and call `onResumeLessonRef.current?.()`; give up after 60 s (`resume_lesson_dropped why=timeout`).
12. **Student speaks or types first ⇒ no resume (Review Focus 5).** Where student engagement is recorded (`recordStudentEngagement(idleNudgeStateRef.current)` ~lines 19494 and 22448): add `resumeLessonPendingRef.current = false;` on the line before each.

- [ ] **Step 1: Write the failing tests** — insert above `// WIRING-TESTS`:

```ts
const vtr = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
const types = read('src/lib/tutor/orchestrator/types.ts');

test('VTR: standby releases the microphone and is flag-gated', () => {
  assert.match(vtr, /standby\?: boolean/);
  assert.match(vtr, /const hostStandby = TUTOR_HOST_LESSON && standby === true/);
  assert.match(vtr, /const perceptionEnabled = [^;]*!prewarmMicHold && !hostStandby/);
});

test('VTR: standby stops the idle nudge, the hard-stop cap and synthetic turns', () => {
  const nudge = vtr.slice(vtr.indexOf('const armIdleNudge = useCallback'), vtr.indexOf('armIdleNudgeRef.current = armIdleNudge'));
  assert.match(nudge, /idleNudgeTimerRef\.current = null;\s*if \(standbyRef\.current\) return;/);
  const cap = vtr.slice(vtr.indexOf('const capMs = sessionMaxMinutes * 60000'), vtr.indexOf("onEndSession('time_limit')"));
  assert.match(cap, /if \(standbyRef\.current\) return;/);
  assert.match(vtr, /if \(standbyRef\.current && opts\?\.silent\) return;/);
});

test('VTR: leaving standby shifts the session start anchor and reopens the mic', () => {
  assert.match(vtr, /voiceSessionStartedAtMsRef\.current = shiftAnchor\(voiceSessionStartedAtMsRef\.current,/);
  assert.match(vtr, /'standby_enter'/);
  assert.match(vtr, /'standby_leave'/);
});

test('VTR: mic tap and typing during standby wake the tutor through the page', () => {
  assert.match(vtr, /if \(standbyRef\.current\) \{ onStudentWakeRef\.current\?\.\('mic'\); return; \}/);
  assert.ok(vtr.split("onStudentWakeRef.current?.('typing')").length - 1 >= 2, 'focus and submit');
});

test('VTR: per-turn lesson window and the video-host flag ride the brain request', () => {
  assert.match(vtr, /lessonNow: TUTOR_HOST_LESSON \? getLessonNowRef\.current\?\.\(\) : undefined/);
  assert.match(vtr, /videoHost: TUTOR_HOST_LESSON && videoHost \? true : undefined/);
});

test('VTR: a moment waits for a started, awake, idle tutor and goes stale', () => {
  assert.match(types, /deliverMoment\?: \(directive: string\) => void/);
  assert.match(vtr, /deliverMoment: \(directive/);
  assert.match(vtr, /MOMENT_STALE_MS/);
  assert.match(vtr, /'moment_delivered'/);
  assert.match(vtr, /'moment_dropped'/);
});

test('VTR: resume_lesson fires after the turn is spoken, and student engagement cancels it (Review Focus 5)', () => {
  assert.match(vtr, /cmd\.action === 'resumeLesson'/);
  assert.match(vtr, /'resume_lesson_fired'/);
  assert.match(vtr, /onResumeLessonRef\.current\?\.\(\)/);
  const cancels = vtr.split(/resumeLessonPendingRef\.current = false;\s*recordStudentEngagement\(idleNudgeStateRef\.current\)/).length - 1;
  assert.ok(cancels >= 2, `engagement sites that cancel a pending resume: ${cancels}`);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd apps/tutor && npm run --silent test:host-lesson`
Expected: the seven new tests FAIL.

- [ ] **Step 3: Implement** the twelve contract lines above, importing `TUTOR_HOST_LESSON` from the flags module VTR already imports `TUTOR_HOST_START`-style flags from and `{ MOMENT_STALE_MS, shiftAnchor }` from `@/lib/tutor/portal/host-lesson`. Add `deliverMoment?: (directive: string) => void;` to the handle type in `types.ts` after `setTutorVoiceMuted?`.

Note on "finish the current sentence" (contract line 3): `realtime.clearSpeechQueue()` CANCELS the sentence being spoken (see its doc in `useOpenAIRealtime.ts` ~line 430 and the farewell branch's "cut sentence's tail"). The spec says the tutor finishes its current sentence. Read the speech-queue implementation the session actually uses (`grep -n "speakTextQueueRef" apps/tutor/src/app/tutor/hooks/*.ts`): if it exposes the pending queue separately from the in-flight sentence, add a hook method `dropQueuedSpeech(): void` that empties only the pending queue (`speakTextQueueRef.current = []`) and call that; then, as a bound, a `setTimeout` of 8,000 ms that calls `realtime.clearSpeechQueue()` if `standbyRef.current && productionStateRef.current === 'speaking'` still holds. Do not call `realtime.interrupt()` on standby entry.

- [ ] **Step 4: Run tests and typecheck**

Run: `cd apps/tutor && npm run --silent test:host-lesson && npm run --silent test:host-start && npx tsc --noEmit -p .`
Expected: all PASS; tsc prints nothing.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx apps/tutor/src/lib/tutor/orchestrator/types.ts apps/tutor/src/app/tutor/hooks apps/tutor/scripts/test-host-lesson.ts
git commit -m "feat(tutor): standby — mic released, clock and nudge stopped; moments, wake and tutor-resumed video in the session runtime"
```

---

### Task 5: Panel UI — standby line, frozen clock, play/pause button

**Files:**
- Modify: `apps/tutor/src/lib/tutor/portal/embed-ui-options.ts`
- Modify: `apps/tutor/scripts/test-embed-ui-options.tsx`
- Modify: `apps/tutor/src/app/tutor/components/session/HeaderClock.tsx`
- Modify: `apps/tutor/src/app/tutor/components/session/TutorSession.tsx`
- Modify: `apps/tutor/src/app/tutor/components/SessionControls.tsx` (only if its timer reads `startedAtMs` on its own interval — give it the same `frozenAtMs` treatment)
- Test: `apps/tutor/scripts/test-host-lesson.ts`

**Interfaces:**
- Consumes: VTR props from Task 4; `STANDBY_LINE`, `shiftAnchor`, `panelToggleCommand`, `VideoState` from Task 1.
- Produces: `EmbedUiOptions.videoControl` (token field `features.video_control`, default false, `gameclass` default true). New `TutorSession` props (all optional, passed straight to VTR unless noted): `standby`, `videoHost`, `getLessonNow`, `onStudentWake`, `onResumeLesson`, and `videoControl?: { state: VideoState; onToggle: () => void } | null` (rendered by TutorSession).

- [ ] **Step 1: Write the failing tests** — insert above `// WIRING-TESTS`:

```ts
const session = read('src/app/tutor/components/session/TutorSession.tsx');
const clock = read('src/app/tutor/components/session/HeaderClock.tsx');
const uiOptions = read('src/lib/tutor/portal/embed-ui-options.ts');

test('UI option videoControl: off by default, on for the video-lesson partner', () => {
  assert.match(uiOptions, /videoControl: boolean;/);
  assert.match(uiOptions, /videoControl: pick\(features\.video_control, 'videoControl'\)/);
  assert.match(uiOptions, /gameclass: \{[^}]*videoControl: true/);
  assert.match(uiOptions, /DEFAULT_EMBED_UI_OPTIONS[^\n]*videoControl: false/);
});

test('TutorSession: passes standby through, shows the standby line, freezes and shifts the clock', () => {
  for (const p of ['standby={standby}', 'videoHost={videoHost}', 'getLessonNow={getLessonNow}', 'onStudentWake={onStudentWake}', 'onResumeLesson={onResumeLesson}']) {
    assert.ok(session.includes(p), p);
  }
  assert.match(session, /STANDBY_LINE/);
  assert.match(session, /setVoiceStartedAtMs\(\(prev\) => shiftAnchor\(prev,/);
  assert.match(session, /frozenAtMs=\{/);
  assert.match(clock, /frozenAtMs\?: number \| null/);
});

test('TutorSession: play/pause button beside the text box, labelled from the host state', () => {
  assert.match(session, /videoControl\?: \{ state: VideoState; onToggle: \(\) => void \} \| null/);
  assert.match(session, /aria-label=\{videoControl\.state === 'playing' \? 'Pause the video' : 'Play the video'\}/);
});
```

and in `scripts/test-embed-ui-options.tsx` add (matching that file's existing test helper and style):

```ts
test('videoControl: default off; gameclass default on; an explicit token boolean wins', () => {
  assert.equal(resolveEmbedUiOptions({ partner_id: 'academy' }).videoControl, false);
  assert.equal(resolveEmbedUiOptions({ partner_id: 'gameclass' }).videoControl, true);
  assert.equal(resolveEmbedUiOptions({ partner_id: 'gameclass', features: { video_control: false } }).videoControl, false);
  assert.equal(resolveEmbedUiOptions({ partner_id: 'academy', features: { video_control: true } }).videoControl, true);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd apps/tutor && npm run --silent test:host-lesson; npm run --silent test:embed-ui-options`
Expected: the new tests FAIL.

- [ ] **Step 3: Implement**

`embed-ui-options.ts`: add to the interface

```ts
  /** Show a play/pause button for the HOST's video beside the text box, and
   *  offer the tutor the "resume the lesson" action. The button appears once
   *  the host has sent its first `evelyn:video_state` (partner spec v1.2).
   *  Token field: `features.video_control` (boolean). Default false. */
  videoControl: boolean;
```

add `videoControl: false` to `DEFAULT_EMBED_UI_OPTIONS`, `videoControl: true` to the `gameclass` partner default, and `videoControl: pick(features.video_control, 'videoControl'),` to the returned object.

`HeaderClock.tsx`: add prop `frozenAtMs?: number | null` (doc: "Non-null while the session stands by: the clock shows the elapsed time at that instant and does not tick"). In the effect, compute against `frozenAtMs ?? Date.now()`, skip the `setInterval` when `frozenAtMs` is set, and add `frozenAtMs` to the dependency array:

```ts
    const tick = () => setElapsedSec(Math.max(0, Math.floor(((frozenAtMs ?? Date.now()) - startedAtMs) / 1000)));
    tick();
    if (frozenAtMs) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAtMs, frozenAtMs]);
```

`TutorSession.tsx`:
- Props (beside `voiceMuteControl?: boolean` ~line 215, and in the destructuring ~line 284): `standby`, `videoHost`, `getLessonNow`, `onStudentWake`, `onResumeLesson`, `videoControl`. Import `STANDBY_LINE, shiftAnchor, type VideoState` from `@/lib/tutor/portal/host-lesson` and `Play, Pause` from `lucide-react`.
- Pass the five VTR props through at the VTR element (beside `prewarm={prewarm}`).
- Clock: beside `voiceStartedAtMs` state (~line 332):

```ts
  // Standby (partner spec v1.2 §5): the clock stops while standing by. On
  // leaving, the start anchor moves forward by the standby time, so every
  // reader of voiceStartedAtMs keeps counting active time only.
  const [standbySinceMs, setStandbySinceMs] = useState<number | null>(null);
  useEffect(() => {
    if (standby) { setStandbySinceMs((prev) => prev ?? Date.now()); return; }
    setStandbySinceMs((since) => {
      if (since !== null) setVoiceStartedAtMs((prev) => shiftAnchor(prev, since, Date.now()));
      return null;
    });
  }, [standby]);
```

  and pass `frozenAtMs={standbySinceMs}` to `<HeaderClock …>` (~line 1966). If `SessionControls` renders its own ticking timer from `startedAtMs`, add the same `frozenAtMs` prop there and pass it (~line 1648).
- Standby line: in `dockStatus` (~line 1009) make the text `standby && started ? STANDBY_LINE : preStartDockCaption(…)` with class `text-slate-600` when standing by.
- Button: next to `voiceMuteBtn` define

```tsx
  // Embed option `videoControl` (partner spec v1.2 §3.5): play/pause for the
  // HOST's video. Shows the host's last reported state; the click only asks —
  // the host's own `video_state` reply is what changes it.
  const videoBtn = videoControl ? (
    <button
      type="button"
      onClick={videoControl.onToggle}
      aria-label={videoControl.state === 'playing' ? 'Pause the video' : 'Play the video'}
      title={videoControl.state === 'playing' ? 'Pause the video' : 'Play the video'}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
    >
      {videoControl.state === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </button>
  ) : null;
```

  and render `{videoBtn}` in the dock row that holds the text box, immediately before the composer (the same row `voiceMuteBtn` is rendered in; the composer itself is drawn by VTR — if VTR owns that row, pass `videoBtn` down through the existing slot prop VTR uses for dock extras, the way `voiceMuteBtn` reaches it).

- [ ] **Step 4: Run tests and typecheck**

Run: `cd apps/tutor && npm run --silent test:host-lesson && npm run --silent test:embed-ui-options && npx tsc --noEmit -p .`
Expected: all PASS; tsc prints nothing.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/lib/tutor/portal/embed-ui-options.ts apps/tutor/scripts/test-embed-ui-options.tsx apps/tutor/src/app/tutor/components apps/tutor/scripts/test-host-lesson.ts
git commit -m "feat(embed): standby line, clock that stops while standing by, play/pause button for the host video"
```

---

### Task 6: Embed page — the host conversation

**Files:**
- Modify: `apps/tutor/src/app/tutor-portal/embed/page.tsx`
- Test: `apps/tutor/scripts/test-host-lesson.ts`

**Interfaces:**
- Consumes: everything from Tasks 1, 2, 4, 5.
- Produces: outgoing `evelyn:video_command {command, source}` and `evelyn:standby {standing_by}`; `ended_reason: "idle"` after 30 minutes of standby; `duration` that excludes standby and prewarm waiting.

- [ ] **Step 1: Write the failing tests** — insert above `// WIRING-TESTS`:

```ts
const embed = read('src/app/tutor-portal/embed/page.tsx');

test('embed: v1.2 host messages are parent-only, origin-checked and flag-gated', () => {
  const i = embed.indexOf('parseVideoState(event.data)');
  assert.ok(i > 0, 'parseVideoState wired');
  const block = embed.slice(Math.max(0, i - 900), i + 200);
  assert.match(block, /if \(!TUTOR_HOST_LESSON\) return;/);
  assert.match(block, /event\.source !== window\.parent/);
  assert.match(block, /isAllowedHostOrigin\(event\.origin, expectedOrigin\)/);
  for (const p of ['parseMoment(event.data)', 'parseLessonTimeline(event.data)', 'parseHostPause(event.data)', 'parseHostResume(event.data)']) {
    assert.ok(embed.includes(p), p);
  }
});

test('embed: evelyn:standby is posted only when the value changes (Review Focus 1)', () => {
  assert.match(embed, /if \(standingBy === lastStandbyPostedRef\.current\) return;/);
  assert.match(embed, /type: 'evelyn:standby', standing_by: standingBy/);
});

test('embed: video commands carry who asked', () => {
  assert.match(embed, /type: 'evelyn:video_command', command, source/);
  assert.match(embed, /postVideoCommand\('pause', 'student'\)/);
  assert.match(embed, /postVideoCommand\('play', 'tutor'\)/);
  assert.match(embed, /RESUME_CONFIRM_MS/);
  assert.match(embed, /'video_resume_unconfirmed'/);
});

test('embed: 30 minutes of standby ends the session as idle, silently', () => {
  assert.match(embed, /STANDBY_IDLE_END_MS/);
  const i = embed.indexOf('STANDBY_IDLE_END_MS);');
  const block = embed.slice(Math.max(0, i - 900), i);
  assert.match(block, /hostEndReasonRef\.current = 'idle'/);
  assert.match(block, /endSession\(\)/);
});

test('embed: duration excludes standby and prewarm waiting, in the save and in session_ended', () => {
  assert.ok(embed.split('activeSeconds(').length - 1 >= 2, 'saveSession and handleEndSession');
  assert.match(embed, /markInactive\(/);
});

test('embed: moments become a synthetic turn; the timeline feeds the per-turn window', () => {
  assert.match(embed, /deliverMoment\?\.\(renderMomentDirective\(/);
  assert.match(embed, /renderLessonNow\(\{/);
  assert.match(embed, /getLessonNow=\{getLessonNow\}/);
  assert.match(embed, /videoHost=\{uiOptions\.videoControl\}/);
});

test('embed: new telemetry events persist', () => {
  for (const e of ['standby', 'video_', 'moment_', 'lesson_timeline', 'host_pause', 'host_resume', 'student_wake', 'resume_lesson']) {
    assert.ok(embed.includes(`'${e}'`), e);
  }
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd apps/tutor && npm run --silent test:host-lesson`
Expected: the seven new tests FAIL.

- [ ] **Step 3: Implement** in `embed/page.tsx`

Imports:

```ts
import { TUTOR_HOST_LESSON } from '@/lib/tutor/orchestrator/flags'; // add to the existing flags import
import {
  INITIAL_INACTIVE_CLOCK, INITIAL_LESSON_HOST_STATE, RESUME_CONFIRM_MS, STANDBY_IDLE_END_MS,
  activeSeconds, isStandingBy, markInactive, panelToggleCommand, parseHostPause, parseHostResume, parseMoment,
  parseVideoState, reduceLessonHost, renderMomentDirective, type LessonHostEvent, type LessonHostState,
} from '@/lib/tutor/portal/host-lesson';
import { parseLessonTimeline, renderLessonNow, type TimelineEntry } from '@/lib/tutor/portal/host-lesson-timeline';
```

`EMBED_DEBUG_EVENT_PREFIXES`: after the `'prewarm_', 'host_start',` line add

```ts
  // Spec v1.2 (one continuous lesson): standby_enter / standby_leave /
  // standby_idle_end, video_state / video_command / video_resume_unconfirmed,
  // moment_received / moment_delivered / moment_dropped, lesson_timeline,
  // host_pause / host_resume, student_wake, resume_lesson_called / _fired / _dropped.
  'standby', 'video_', 'moment_', 'lesson_timeline', 'host_pause', 'host_resume', 'student_wake', 'resume_lesson',
```

State and the reducer wrapper — place after the host-start block (after the `prewarm` idle-reload effect, ~line 1374):

```ts
  // One continuous lesson (spec v1.2). The host reports its video and whether
  // the panel is hidden; standby is derived from that (isStandingBy). The ref
  // is the truth for handlers; the state mirrors it for rendering.
  const lessonHostRef = useRef<LessonHostState>(INITIAL_LESSON_HOST_STATE);
  const [lessonHost, setLessonHost] = useState<LessonHostState>(INITIAL_LESSON_HOST_STATE);
  const timelineRef = useRef<TimelineEntry[] | null>(null);
  const lastStandbyPostedRef = useRef(false);
  const inactiveClockRef = useRef(INITIAL_INACTIVE_CLOCK);
  const resumeConfirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inactive = standing by, or a prewarmed frame still waiting for its start
  // (spec §5: only active time is counted). Re-evaluated on every change.
  const syncInactive = useCallback(() => {
    const waitingPrewarm = prewarm && sessionEngagedAtRef.current === null;
    inactiveClockRef.current = markInactive(inactiveClockRef.current, isStandingBy(lessonHostRef.current) || waitingPrewarm, Date.now());
  }, [prewarm]);
  useEffect(() => { syncInactive(); }, [syncInactive]);

  const dispatchLessonHost = useCallback((e: LessonHostEvent) => {
    const next = reduceLessonHost(lessonHostRef.current, e, Date.now());
    if (next === lessonHostRef.current) return;
    lessonHostRef.current = next;
    setLessonHost(next);
    syncInactive();
    const standingBy = isStandingBy(next);
    if (standingBy === lastStandbyPostedRef.current) return;
    lastStandbyPostedRef.current = standingBy;
    window.parent.postMessage({ type: 'evelyn:standby', standing_by: standingBy }, '*');
  }, [syncInactive]);

  const postVideoCommand = useCallback((command: 'play' | 'pause', source: 'student' | 'tutor') => {
    addDebugEvent('video_command', `command=${command} source=${source}`);
    window.parent.postMessage({ type: 'evelyn:video_command', command, source }, '*');
  }, [addDebugEvent]);
```

Also call `syncInactive()` at the two places `sessionEngagedAtRef.current` is first set to a timestamp (the `addDebugEvent` setter and the `onStarted` listener ~line 1412), so the prewarm wait closes at the start.

The listener (same shape as the host-start listener):

```ts
  useEffect(() => {
    if (!TUTOR_HOST_LESSON) return;
    const expectedOrigin = getEmbeddingHost();
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || window.parent === window) return;
      if (!isAllowedHostOrigin(event.origin, expectedOrigin)) return;
      const video = parseVideoState(event.data);
      if (video) {
        const before = lessonHostRef.current.video;
        dispatchLessonHost({ type: 'video_state', state: video.state, positionSeconds: video.positionSeconds });
        // Persist changes of state only — a host may report its position often.
        if (video.state !== before) addDebugEvent('video_state', `state=${video.state} pos=${video.positionSeconds ?? ''}`);
        if (video.state === 'playing' && resumeConfirmTimerRef.current) {
          clearTimeout(resumeConfirmTimerRef.current);
          resumeConfirmTimerRef.current = null;
        }
        return;
      }
      const moment = parseMoment(event.data);
      if (moment) {
        addDebugEvent('moment_received', `kind=${moment.kind} pos=${moment.positionSeconds ?? ''}`);
        dispatchLessonHost({ type: 'moment', positionSeconds: moment.positionSeconds });
        sessionHandleRef.current?.deliverMoment?.(renderMomentDirective(moment));
        return;
      }
      const lesson = parseLessonTimeline(event.data);
      if (lesson) {
        timelineRef.current = lesson.entries;
        addDebugEvent('lesson_timeline', `received=${lesson.received} kept=${lesson.entries.length} cut=${lesson.cut}`);
        return;
      }
      const hostPause = parseHostPause(event.data);
      if (hostPause) {
        addDebugEvent('host_pause', `reason=${hostPause.reason}`);
        dispatchLessonHost({ type: 'host_pause' });
        return;
      }
      if (parseHostResume(event.data)) {
        addDebugEvent('host_resume', '');
        dispatchLessonHost({ type: 'host_resume' });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [addDebugEvent, dispatchLessonHost]);
```

Callbacks handed to the session:

```ts
  const standby = TUTOR_HOST_LESSON && isStandingBy(lessonHost);

  // The student started to ask (typing or the mic) while standing by: ask the
  // host to pause, and wake now — the answer must not wait on the host.
  const handleStudentWake = useCallback((via: 'typing' | 'mic') => {
    const s = lessonHostRef.current;
    if (s.hostPaused || s.video !== 'playing') return;
    addDebugEvent('student_wake', `via=${via}`);
    postVideoCommand('pause', 'student');
    dispatchLessonHost({ type: 'student_wake' });
  }, [addDebugEvent, postVideoCommand, dispatchLessonHost]);

  // The tutor asked to resume (resume_lesson, after its hand-back line was
  // spoken). No `playing` report within RESUME_CONFIRM_MS ⇒ stay available.
  const handleResumeLesson = useCallback(() => {
    const s = lessonHostRef.current;
    if (s.video === null || s.video === 'ended' || (s.video === 'playing' && s.wokeAtMs === null)) return;
    postVideoCommand('play', 'tutor');
    dispatchLessonHost({ type: 'play_command' });
    if (resumeConfirmTimerRef.current) clearTimeout(resumeConfirmTimerRef.current);
    resumeConfirmTimerRef.current = setTimeout(() => {
      resumeConfirmTimerRef.current = null;
      if (lessonHostRef.current.video !== 'playing') addDebugEvent('video_resume_unconfirmed', `waitedMs=${RESUME_CONFIRM_MS}`);
    }, RESUME_CONFIRM_MS);
  }, [addDebugEvent, postVideoCommand, dispatchLessonHost]);

  const handleVideoToggle = useCallback(() => {
    const command = panelToggleCommand(lessonHostRef.current.video);
    if (!command) return;
    postVideoCommand(command, 'student');
    if (command === 'play') dispatchLessonHost({ type: 'play_command' });
  }, [postVideoCommand, dispatchLessonHost]);

  const getLessonNow = useCallback(() => renderLessonNow({
    timeline: timelineRef.current,
    video: lessonHostRef.current.video,
    positionSeconds: lessonHostRef.current.positionSeconds,
    resumeTool: uiOptions.videoControl,
  }), [uiOptions.videoControl]);

  // Spec §5: 30 minutes of continuous standby ends the session as idle —
  // silently (no goodbye line: the student is watching, or the panel is hidden).
  useEffect(() => {
    if (!standby) return;
    const t = setTimeout(() => {
      if (sessionEngagedAtRef.current === null || sessionEndedPostedRef.current) return;
      const h = sessionHandleRef.current;
      if (h?.isEnding?.() === true) return;
      addDebugEvent('standby_idle_end', `afterMs=${STANDBY_IDLE_END_MS}`);
      hostEndReasonRef.current = 'idle';
      if (h?.endSession) h.endSession();
      else handleEndSessionRef.current();
    }, STANDBY_IDLE_END_MS);
    return () => clearTimeout(t);
  }, [standby, addDebugEvent]);
```

Duration (two edits):
- `saveSession` (~line 864): replace the `duration` line with

```ts
    const duration = Math.round(activeSeconds((now.getTime() - sessionStartRef.current.getTime()) / 1000, inactiveClockRef.current, now.getTime()));
```

- `handleEndSession` (~line 1179): the first argument of `endedDurationSeconds(` becomes `activeSeconds((Date.now() - sessionStartRef.current.getTime()) / 1000, inactiveClockRef.current, Date.now())`.

`inactiveClockRef` must be declared above `saveSession` (move its `useRef` line up beside `priorActiveSecRef` ~line 668).

Props on `<TutorSession …>` (beside `prewarm={prewarm}`):

```tsx
        standby={standby}
        videoHost={uiOptions.videoControl}
        getLessonNow={getLessonNow}
        onStudentWake={handleStudentWake}
        onResumeLesson={handleResumeLesson}
        videoControl={TUTOR_HOST_LESSON && uiOptions.videoControl && lessonHost.video ? { state: lessonHost.video, onToggle: handleVideoToggle } : null}
```

Then check the server does not re-derive duration from wall time: `grep -n "endedAt\|startedAt" apps/tutor/src/app/api/tutor/session-usage/route.ts apps/tutor/src/lib/tutor/portal/session-summary.ts | head -40`. If any consumer computes `endedAt - startedAt` for a figure shown or sent to a partner, record it in the plan's ledger and report it — do not change server accounting in this task.

- [ ] **Step 4: Run tests, typecheck, debug-coverage**

Run: `cd apps/tutor && npm run --silent test:host-lesson && npm run --silent test:host-start && npx tsc --noEmit -p . && npm run --silent test:embed-debug-coverage | tail -12`
Expected: host-lesson and host-start all PASS; tsc silent; `embed-debug-coverage` lists the same 5 pre-existing unregistered events as before this work and none of the new event names.

- [ ] **Step 5: Commit**

```bash
git add apps/tutor/src/app/tutor-portal/embed/page.tsx apps/tutor/scripts/test-host-lesson.ts
git commit -m "feat(embed): one continuous lesson — standby on video play and minimize, moments, lesson timeline, panel video control, idle end, active-time duration"
```

---

### Task 7: Live check on dev

**Files:**
- Create: `apps/tutor/artifacts/live-host-lesson-check.mjs` (gitignored; start from a copy of `artifacts/live-host-start-check.mjs`)

**Interfaces:**
- Consumes: the running dev server on `:3027` (`cd apps/tutor && PORT=3027 npm run dev`), the fake-host pattern on `:3028`.

- [ ] **Step 1: Write the harness.** Copy `live-host-start-check.mjs`; keep the token signing and the fake host page; set `partner_id: 'gameclass'` in the payload (signed with the academy secret — dev accepts it), `max_duration_minutes: 10`. Extend the host page with `window.post = (m) => document.getElementById('tutor').contentWindow.postMessage(m, origin)` and make its message listener answer `evelyn:video_command` after 150 ms with the matching `evelyn:video_state` (unless `window.__mute` is set), recording every message in `window.__msgs` with full data. Patch `getUserMedia` in the init script to also record each returned track so the script can read `track.readyState`. Record every `/api/tutor/brain/stream` request body. Sequence (variant `flow`, the default), each step printing `PASS`/`FAIL`:
  1. load with `prewarm=1`; wait `evelyn:ready`; post `evelyn:lesson` with a 6-entry timeline including two `visual` entries carrying numbers; post `video_state playing pos=5` → expect `evelyn:standby {standing_by: true}`; expect zero `getUserMedia` calls.
  2. post `video_state paused pos=150`, show the frame, post `evelyn:start` → expect `session_started`, a first brain request whose body has `videoHost: true` and a `lessonNow` containing `paused at 2:30` and the second visual's numbers.
  3. wait for the tutor to finish; post `video_state playing pos=151` → expect `standby true`; within 10 s every recorded mic track has `readyState === 'ended'`; the dock shows the standby line; the header clock text is unchanged across a 5 s wait.
  4. type "what were the odds?" into `input[name="studentText"]` → expect `video_command {command: 'pause', source: 'student'}` BEFORE the next brain request; expect `standby false`; the brain request's `lessonNow` reflects the host's replied position.
  5. post `video_state playing`, then `video_state paused pos=200` + `evelyn:moment {kind:'teaching_moment', position_seconds: 200, title:'Chart 5', summary:'…numbers…'}` → expect a brain request whose student text starts with `[The lesson video just paused at 3:20 for a teaching moment`.
  6. type "got it, let's keep watching" → expect a `video_command {command:'play', source:'tutor'}` after the tutor's reply finishes, then `standby true`. (Model-dependent: report the observed tool call; retry once with "please resume the video" before marking FAIL.)
  7. post `evelyn:pause {reason:'minimized'}` while paused → `standby true`; post `evelyn:resume` → `standby false`.
  8. click the panel's video button → `video_command` with `source: 'student'`.
  9. end via `evelyn:host_end {reason:'finished'}` → `session_ended.data.duration` is less than the wall time by at least the standby seconds measured in steps 3, 6 and 7 (± 3 s).
  Variants: `early` (all of step 1's messages posted immediately at load, before `evelyn:ready` — expect no throw in the page console and the state applied), `nohost` (`window.__mute = true`: step 4 must still produce a brain request and an answer), `barge` (after step 6's tutor reply begins, type a message → no `video_command play`), `idle` (run the dev server with nothing changed, but override the timeout through `window.__standbyIdleMs` ONLY if such a test hook already exists in the page — otherwise skip and state that the 30-minute end was verified by unit/source scan only).

- [ ] **Step 2: Run** `cd apps/tutor && node artifacts/live-host-lesson-check.mjs flow` then `early`, `nohost`, `barge`.
Expected: every step PASS. Any FAIL → fix the code (not the check), re-run the unit tests, re-run the variant.

- [ ] **Step 3: Screenshots** for Praveen: `node artifacts/narrow-shot.mjs 420 gameclass standby` after extending it (or the harness) to post `video_state playing`; capture standing by (line + play/pause button) and active states. Read both images and confirm the standby line and the button are visible and not clipped at 420 px.

- [ ] **Step 4: Commit** (code fixes only; `artifacts/` is gitignored)

```bash
git status --short && git add -u && git commit -m "fix(embed): live-check findings for the continuous-lesson flow" || true
```

---

### Task 8: Gate and hand-off

- [ ] **Step 1: Merge and gate.** `git fetch origin && git merge origin/main --no-edit`, then from the repo root: `npm run test:all 2>&1 | tail -30` (expect only the two pre-existing failures, and two more passing scripts than the 330/332 baseline), `cd apps/tutor && npx tsc --noEmit -p . && npm run build 2>&1 | tail -15` (expect a clean production build).
- [ ] **Step 2: Whole-branch review** with a fresh reviewer (superpowers:requesting-code-review) over `git diff origin/main...HEAD`, pointing it at the Review Focus list. Fix what it finds; re-run Step 1.
- [ ] **Step 3: Update memory** `project_gameclass_skyler_partnership.md` (state, sha, what is built, what was verified live and what was not, the deploy lines) and its `MEMORY.md` pointer.
- [ ] **Step 4: Deploy hand-off.** Per the standing rule: confirm no other deploy script is running, `cmp` the worktree's `.env.local.production` against the root's, then run `./deploy-tutor.sh` from the worktree (if the classifier refuses, hand Praveen the `!` line), verify the served build, and `git push origin gameclass-drop2:main`. This also ships section 1 (voice mute, pace pill) which is on this branch and not yet deployed.
