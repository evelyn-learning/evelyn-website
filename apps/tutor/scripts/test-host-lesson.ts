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
  activeSeconds,
  clockMessage,
  CLOCK_POST_MS,
  currentPositionSeconds,
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
  videoForPrompt,
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

test('standby: a missing position keeps the last known one, advanced by the time it played', () => {
  assert.equal(pause(pause(S0, T, 42), T + 9000, null).positionSeconds, 42);
  assert.equal(pause(play(S0, T, 42), T + 9000, null).positionSeconds, 51);
});

test('position: a playing video is estimated from the last report; a paused one is not', () => {
  assert.equal(currentPositionSeconds(S0, T), null);
  const p = play(S0, T, 60);
  assert.equal(currentPositionSeconds(p, T), 60);
  assert.equal(currentPositionSeconds(p, T + 90_000), 150);
  assert.equal(currentPositionSeconds(p, T - 5000), 60); // clock went backwards
  assert.equal(currentPositionSeconds(pause(p, T + 1000, 61), T + 90_000), 61);
  // A fresh report resets the estimate (seek, or the host's pause reply).
  assert.equal(currentPositionSeconds(play(p, T + 10_000, 300), T + 12_000), 302);
});

test('prompt state: woken over a playing video reads as paused; otherwise the host state', () => {
  assert.equal(videoForPrompt(S0), null);
  assert.equal(videoForPrompt(play(S0, T)), 'playing');
  assert.equal(videoForPrompt(reduceLessonHost(play(S0, T), { type: 'student_wake' }, T + 1)), 'paused');
  assert.equal(videoForPrompt(pause(S0, T)), 'paused');
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

test('wake: further "playing" reports never put the tutor back to sleep mid-question (Review Focus 3)', () => {
  let s = reduceLessonHost(play(S0, T), { type: 'student_wake' }, T + 100);
  for (const dt of [150, 1900, 2100, 9000, 60_000]) {
    s = play(s, T + dt, 5);
    assert.equal(isStandingBy(s), false, `still awake after a playing report at +${dt} ms`);
  }
  assert.equal(s.positionSeconds, 5);
});

test('wake: over a host that never pauses, a play command (panel button or the tutor) ends it', () => {
  let s = reduceLessonHost(play(S0, T), { type: 'student_wake' }, T + 100);
  s = play(s, T + 30_000);
  assert.equal(isStandingBy(s), false);
  assert.equal(isStandingBy(reduceLessonHost(s, { type: 'play_command' }, T + 31_000)), true);
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
  assert.equal(currentPositionSeconds(s, T + 60_001), 208); // still "playing" until the host says otherwise
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
  assert.match(d, /do not answer it for the student\.\]$/);
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

const vtr = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
const types = read('src/lib/tutor/orchestrator/types.ts');
const speechHook = read('src/app/tutor/hooks/useOpenAIRealtime.ts');

test('VTR: standby releases the microphone and is flag-gated', () => {
  assert.match(vtr, /standby\?: boolean/);
  assert.match(vtr, /const hostStandby = TUTOR_HOST_LESSON && standby === true/);
  assert.match(vtr, /const perceptionEnabled = [^;]*!prewarmMicHold && !hostStandby/);
});

test('VTR: entering standby lets the current sentence finish (queued ones dropped, no hard cut)', () => {
  assert.match(speechHook, /const dropQueuedSpeech = useCallback\(\(\): number =>/);
  const enter = vtr.slice(vtr.indexOf("standbySinceMsRef.current = Date.now();"), vtr.indexOf("'standby_enter'"));
  assert.match(enter, /realtime\.dropQueuedSpeech\(\)/);
  assert.match(enter, /realtime\.releaseInput\(\)/); // released, not muted: a muted hold keeps the capture live
  assert.match(enter, /inFlightBrainAbortRef\.current\?\.abort\(\)/);
  assert.ok(!/realtime\.interrupt\(\)/.test(enter), 'no interrupt on standby entry');
});

test('VTR: standby stops the idle nudge, the hard-stop cap and synthetic turns', () => {
  const nudge = vtr.slice(vtr.indexOf('const armIdleNudge = useCallback'), vtr.indexOf('armIdleNudgeRef.current = armIdleNudge'));
  assert.match(nudge, /idleNudgeTimerRef\.current = null;\s*if \(standbyRef\.current\) return;/);
  const cap = vtr.slice(vtr.indexOf('const capMs = sessionMaxMinutes * 60000'), vtr.indexOf("onEndSession('time_limit')"));
  assert.match(cap, /if \(standbyRef\.current\) return;/);
  assert.match(vtr, /if \(standbyRef\.current && opts\?\.silent && !opts\?\.bypassMidUtteranceGuard\) return;/); // kickoffs exempt
});

test('VTR: leaving standby shifts the session start anchor and reopens the mic', () => {
  assert.match(vtr, /voiceSessionStartedAtMsRef\.current = shiftAnchor\(voiceSessionStartedAtMsRef\.current,/);
  assert.match(vtr, /'standby_enter'/);
  assert.match(vtr, /'standby_leave'/);
});

test('VTR: mic tap and typing during standby wake the tutor through the page', () => {
  assert.match(vtr, /onStudentWakeRef\.current\?\.\('mic'\);\s*if \(hasStartedRef\.current\) return;/);
  assert.ok(vtr.split("onStudentWakeRef.current?.('typing')").length - 1 >= 2, 'focus and submit');
  // The dock's mic button is the MUTE toggle once a session runs: in standby it must wake instead.
  assert.match(vtr, /if \(standbyRef\.current\) \{\s*onStudentWakeRef\.current\?\.\('mic'\);\s*if \(isMicMuted\) toggleMicMute\(\);\s*return;/);
});

test('VTR: per-turn lesson window and the video-host flag ride the brain request', () => {
  assert.match(vtr, /lessonNow: TUTOR_HOST_LESSON \? getLessonNowRef\.current\?\.\(\) : undefined/);
  assert.match(vtr, /videoHost: TUTOR_HOST_LESSON && videoHost \? true : undefined/);
});

test('VTR: a moment waits for a started, awake, idle tutor and goes stale', () => {
  assert.match(types, /deliverMoment\?: \(directive: string\) => void/);
  assert.match(vtr, /deliverMoment: \(directive/);
  assert.match(vtr, /MOMENT_STALE_MS/);
  assert.match(vtr, /hasStartedRef\.current && !standbyRef\.current && !endingRef\.current && quiet/);
  assert.match(vtr, /'moment_delivered'/);
  assert.match(vtr, /'moment_dropped'/);
});

test('VTR: resume_lesson fires only after the turn is spoken; a student turn or speech in progress stops it (Review Focus 5)', () => {
  assert.match(vtr, /\(cmd\.action as string\) === 'resumeLesson'/);
  assert.match(vtr, /'resume_lesson_fired'/);
  assert.match(vtr, /onResumeLessonRef\.current\?\.\(\)/);
  assert.match(vtr, /resumeLessonPendingRef\.current = false;\s*recordStudentEngagement\(idleNudgeStateRef\.current\)/);
  const pump = vtr.slice(vtr.indexOf('runHostLessonPumpRef.current = () => {'), vtr.indexOf("'resume_lesson_fired'"));
  assert.match(pump, /realtime\.isSpeechPending\(\)/);
  assert.match(pump, /!perceptionMidUtteranceRef\.current/);
  assert.match(pump, /studentTextInputRef\.current\?\.value \?\? ''\)\.trim\(\) === ''/);
  assert.ok(!/!studentTypingRef\.current/.test(pump), 'focus alone must not block the pump (it stays after a send)');
  const submit = vtr.slice(vtr.indexOf('onSubmit={async (e: FormEvent) => {'), vtr.indexOf("namedItem('studentText')"));
  assert.match(submit, /resumeLessonPendingRef\.current = false;/);
});

test('resume_lesson is registered as state, not ink: no board repair, withheld after a kill', () => {
  for (const f of ['src/lib/tutor/voice/rule8-client.ts', 'src/lib/tutor/voice/question-anchor.ts', 'src/lib/tutor/orchestrator/kill-scope.ts']) {
    assert.ok(read(f).includes("'resume_lesson'"), f);
  }
});

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
  assert.match(session, /\{STANDBY_LINE\}/);
  assert.match(session, /setVoiceStartedAtMs\(\(prev\) => shiftAnchor\(prev, since, Date\.now\(\)\)\)/);
  assert.equal(session.split('frozenAtMs={standbySinceMs}').length - 1, 2, 'header clock and desktop timer');
  assert.match(clock, /frozenAtMs\?: number \| null/);
  assert.match(clock, /if \(frozenAtMs\) return;/);
});

test('TutorSession: play/pause button beside the text box, labelled from the host state', () => {
  assert.match(session, /videoControl\?: \{ state: VideoState; onToggle: \(\) => void \} \| null/);
  assert.match(session, /aria-label=\{videoControl\.state === 'playing' \? 'Pause the video' : 'Play the video'\}/);
  assert.match(session, /composerSlot=\{videoBtn\}/);
  assert.match(vtr, /\{composerSlot\}\s*<input\s+ref=\{studentTextInputRef\}/);
});

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
  assert.match(embed, /if \(next === lessonHostRef\.current\) return;/);
});

test('embed: video commands carry who asked', () => {
  assert.match(embed, /type: 'evelyn:video_command', command, source/);
  assert.match(embed, /postVideoCommand\('pause', 'student'\)/);
  assert.match(embed, /postVideoCommand\('play', 'tutor'\)/);
  assert.match(embed, /RESUME_CONFIRM_MS/);
  assert.match(embed, /'video_resume_unconfirmed'/);
});

test('embed: 30 minutes of standby ends the session as idle, silently', () => {
  const i = embed.indexOf("addDebugEvent('standby_idle_end'");
  assert.ok(i > 0, 'idle timer');
  const block = embed.slice(Math.max(0, i - 700), i + 300);
  assert.match(block, /Date\.now\(\) - Math\.max\(standbyFrom, engagedAt\) < STANDBY_IDLE_END_MS/);
  assert.match(block, /hostEndReasonRef\.current = 'idle'/);
  assert.match(block, /h\.endSession\(\)/);
});

test('embed: duration excludes standby and prewarm waiting, in the save and in session_ended', () => {
  assert.equal(embed.split('activeSeconds((').length - 1, 3, 'saveSession, handleEndSession and the clock message');
  assert.match(embed, /const waitingPrewarm = prewarm && sessionEngagedAtRef\.current === null/);
  const latches = embed.split('sessionEngagedAtRef.current = Date.now();').length - 1;
  const synced = embed.split(/sessionEngagedAtRef\.current = Date\.now\(\);\s*syncInactiveRef\.current\(\);/).length - 1;
  assert.ok(latches >= 3 && synced === latches, `every engagement latch closes the prewarm wait (${synced}/${latches})`);
});

test('embed: moments become a synthetic turn; the timeline feeds the per-turn window', () => {
  assert.match(embed, /deliverMoment\?\.\(renderMomentDirective\(/);
  assert.match(embed, /renderLessonNow\(\{/);
  assert.match(embed, /positionSeconds: currentPositionSeconds\(lessonHostRef\.current, Date\.now\(\)\)/);
  assert.match(embed, /video: videoForPrompt\(lessonHostRef\.current\)/);
  assert.match(embed, /getLessonNow=\{getLessonNow\}/);
  assert.match(embed, /videoHost=\{uiOptions\.videoControl\}/);
});

test('embed: new telemetry events persist', () => {
  for (const e of ['standby', 'video_', 'moment_', 'lesson_timeline', 'host_pause', 'host_resume', 'student_wake', 'resume_lesson']) {
    assert.ok(embed.includes(`'${e}'`), e);
  }
});

test('review fixes: opener aborted by standby clears the joining overlay; resume needs a known video; a kill or fresh speech stops it', () => {
  const enter = vtr.slice(vtr.indexOf('standbySinceMsRef.current = Date.now();'), vtr.indexOf("'standby_enter'"));
  assert.match(enter, /setIsWarmingUp\(false\);\s*setShowWarmupOverlay\(false\);/);
  assert.match(enter, /warmupStateRef\.current = null;/);
  assert.match(vtr, /videoHost && !standbyRef\.current && !!getLessonNowRef\.current\?\.\(\)/);
  assert.equal(vtr.split(/speechKilledAtRef\.current = Date\.now\(\);\s*resumeLessonPendingRef\.current = false;/).length - 1, 2);
  assert.match(vtr, /lastVadActivityAtRef\.current > resumeLessonPendingAtRef\.current/);
  assert.match(embed, /prewarm && TUTOR_HOST_LESSON \?/); // flag off ⇒ durations exactly as before
});

test('evelyn:clock: whole active seconds, running flag, limit only when set', () => {
  assert.equal(CLOCK_POST_MS, 15_000);
  assert.deepEqual(clockMessage({ activeSeconds: 61.9, running: true, maxSeconds: 900 }), { type: 'evelyn:clock', active_seconds: 61, running: true, max_seconds: 900 });
  assert.deepEqual(clockMessage({ activeSeconds: -3, running: false }), { type: 'evelyn:clock', active_seconds: 0, running: false });
  assert.ok(!('max_seconds' in clockMessage({ activeSeconds: 1, running: true, maxSeconds: 0 })));
});

test('host header options: clock message posted on start, standby change, end and on a timer; timer / End / tools options wired', () => {
  assert.match(embed, /window\.parent\.postMessage\(clockMessage\(\{/);
  assert.match(embed, /running: !ended && !isStandingBy\(lessonHostRef\.current\)/);
  assert.match(embed, /\}, \[standby, sessionEnded, postClock\]\);/);
  assert.match(embed, /if \(!TUTOR_HOST_LESSON \|\| sessionEngagedAtRef\.current === null\) return;/);
  for (const p of ['sessionTimer={uiOptions.sessionTimer}', 'endControlVisible={uiOptions.endControl}', 'toolsLow={uiOptions.toolsLow}']) assert.ok(embed.includes(p), p);
  assert.match(session, /headerClock=\{!sessionTimer \? undefined : \(/);
  assert.match(session, /hideTimer=\{!sessionTimer\}/);
  assert.match(session, /endControl=\{endControlVisible \? endControlEl : null\}/);
  assert.match(read('src/app/tutor/components/session/SessionStage.tsx'), /style=\{toolsLow \? \{ bottom: /);
  assert.match(uiOptions, /sessionTimer: true, endControl: true, toolsLow: false/);
  assert.match(uiOptions, /gameclass: \{[^}]*toolsLow: true/);
  assert.ok(!/gameclass: \{[^}]*(sessionTimer|endControl)/.test(uiOptions), 'timer and End stay on until the host opts out per token');
});

// WIRING-TESTS (Tasks 3–6 append their source scans above this line)

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
