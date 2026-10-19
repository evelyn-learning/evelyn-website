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
  MOMENT_PRESTART_HOLD_MS,
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
  reconcileMomentPosition,
  reduceLessonHost,
  renderMomentDirective,
  shiftAnchor,
  videoForPrompt,
  type LessonHostState,
  lessonStartHook,
  momentBanner,
  LESSON_START_WINDOW_S,
  MOMENT_OPTIONS_MAX,
  inferExitTicket,
} from '../src/lib/tutor/portal/host-lesson';
import type { TimelineEntry } from '../src/lib/tutor/portal/host-lesson-timeline';

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
  assert.deepEqual(parseVideoState({ type: 'evelyn:video_state', state: 'playing', position_seconds: 12.5 }), { state: 'playing', positionSeconds: 12.5, durationSeconds: null });
  assert.deepEqual(parseVideoState({ type: 'evelyn:video_state', state: 'ended' }), { state: 'ended', positionSeconds: null, durationSeconds: null });
  for (const bad of [-1, NaN, Infinity, '12', null]) {
    assert.deepEqual(parseVideoState({ type: 'evelyn:video_state', state: 'paused', position_seconds: bad }), { state: 'paused', positionSeconds: null, durationSeconds: null }, String(bad));
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

test('parseMoment: the question type is read; a typed kind becomes a question; a free response drops the host\'s placeholder answer', () => {
  const fr = parseMoment({ type: 'evelyn:moment', kind: 'question', question_type: 'freeresponse', question: 'Why did it keep rolling?', student_answer: 'Nothing stopped it', correct_answer: 'Nothing stopped it' });
  assert.deepEqual(fr, { kind: 'question', positionSeconds: null, questionType: 'freeresponse', question: 'Why did it keep rolling?', studentAnswer: 'Nothing stopped it' });
  const tf = parseMoment({ type: 'evelyn:moment', kind: 'truefalse', question: 'Mass is weight.', student_answer: 'True', correct_answer: 'False' });
  assert.equal(tf?.kind, 'question');
  assert.equal(tf?.questionType, 'truefalse');
  assert.equal(tf?.correctAnswer, 'False');
  assert.equal(parseMoment({ type: 'evelyn:moment', kind: 'quiz', questionType: 'MCQ' })?.questionType, 'mcq');
  assert.equal(parseMoment({ type: 'evelyn:moment', kind: 'quiz', format: 'Short Answer' })?.questionType, 'shortanswer');
  assert.equal(parseMoment({ type: 'evelyn:moment', kind: 'question', question_type: 'riddle' })?.questionType, undefined);
  assert.equal(parseMoment({ type: 'evelyn:moment', kind: 'free_response', question: 'q' })?.kind, 'question');
});

test('moment directive: a free response is discussed, never marked; true/false names its two options', () => {
  const fr = renderMomentDirective({ kind: 'question', positionSeconds: 30, questionType: 'freeresponse', question: 'Why did it keep rolling?', studentAnswer: 'Nothing stopped it' });
  assert.match(fr, /open-ended/i);
  assert.match(fr, /The student answered: Nothing stopped it/);
  assert.ok(!/Correct answer/.test(fr));
  assert.match(fr, /what the student wrote/);
  const frBlank = renderMomentDirective({ kind: 'question', positionSeconds: 30, questionType: 'freeresponse', question: 'Why?' });
  assert.match(frBlank, /open-ended/i);
  assert.match(frBlank, /what they think/);
  const tf = renderMomentDirective({ kind: 'question', positionSeconds: 30, questionType: 'truefalse', question: 'Mass is weight.', studentAnswer: 'True', correctAnswer: 'False' });
  assert.match(tf, /true-or-false question/);
  assert.match(tf, /Correct answer \(never state it outright; guide the student to it\): False/);
  assert.ok(!/gameclass/i.test(fr + tf));
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
  assert.match(types, /deliverMoment\?: \(directive: string, banner\?: \{ label: string; title: string \} \| null\) => void/);
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
  assert.match(vtr, /cancelResumeLesson\('student_turn'\);\s*recordStudentEngagement\(idleNudgeStateRef\.current\)/);
  const pump = vtr.slice(vtr.indexOf('runHostLessonPumpRef.current = () => {'), vtr.indexOf("'resume_lesson_fired'"));
  assert.match(pump, /realtime\.isSpeechPending\(\)/);
  assert.match(pump, /!perceptionMidUtteranceRef\.current/);
  assert.match(pump, /studentTextInputRef\.current\?\.value \?\? ''\)\.trim\(\) === ''/);
  assert.ok(!/!studentTypingRef\.current/.test(pump), 'focus alone must not block the pump (it stays after a send)');
  const submit = vtr.slice(vtr.indexOf('onSubmit={async (e: FormEvent) => {'), vtr.indexOf("namedItem('studentText')"));
  assert.match(submit, /cancelResumeLesson\('student_typed'\);/);
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
  const block = embed.slice(Math.max(0, i - 2200), i + 200);
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

test('embed: telemetry records the reported duration and each timeline kind\'s shape, so a host\'s real payload can be read from prod', () => {
  assert.match(embed, /addDebugEvent\('video_state', `state=\$\{video\.state\} pos=\$\{video\.positionSeconds \?\? ''\}\$\{video\.durationSeconds !== null \? ` dur=\$\{video\.durationSeconds\}` : ''\}`\)/);
  assert.match(embed, /addDebugEvent\('lesson_timeline_shapes'/);
  assert.match(embed, /lesson\.shapes/);
  assert.match(embed, /lesson\.questionTypes/);
});

test('embed: the lesson timeline survives the warm frame\'s 30-minute self-reload (host sends it once, on the first ready)', () => {
  // Live 10-19: GameClass posted evelyn:lesson once; after our idle reload the frame had no timeline.
  assert.match(embed, /sessionStorage\.setItem\(cacheKey, JSON\.stringify\(event\.data\)\)/);
  assert.match(embed, /sessionStorage\.getItem\(cacheKey\)/);
  assert.match(embed, /'lesson_timeline_restored' : 'lesson_timeline'/);
  assert.match(embed, /lessonCacheKey\(embedToken\)/);
  assert.match(embed, /LESSON_CACHE_MAX_CHARS/);
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
  assert.equal(vtr.split(/speechKilledAtRef\.current = Date\.now\(\);\s*cancelResumeLesson\('turn_killed'\);/).length - 1, 2);
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

test('moment position sent in milliseconds is read as seconds when it matches the video', () => {
  assert.equal(reconcileMomentPosition(16750, 16.73), 16.75);
  assert.equal(reconcileMomentPosition(148000, 150), 148);
  assert.equal(reconcileMomentPosition(16.72, 16.73), 16.72);   // already seconds
  assert.equal(reconcileMomentPosition(900, 16), 900);           // a real jump, not ms
  assert.equal(reconcileMomentPosition(16750, null), 16750);     // nothing to check against
  assert.equal(reconcileMomentPosition(null, 16), null);
  assert.equal(reconcileMomentPosition(50_000, 49), 50_000 / 1000);
});

test('a moment for a tutor that is not open is dropped after a short hold; resume cancellations say why', () => {
  assert.equal(MOMENT_PRESTART_HOLD_MS, 5000);
  assert.match(vtr, /if \(!hasStartedRef\.current && now - moment\.atMs > MOMENT_PRESTART_HOLD_MS\) \{[^}]*'why=not_started'/);
  for (const why of ['student_turn', 'standby', 'moment', 'student_typed', 'turn_killed']) assert.ok(vtr.includes(`cancelResumeLesson('${why}')`), why);
  assert.match(embed, /reconcileMomentPosition\(sentPos, currentPositionSeconds\(lessonHostRef\.current, Date\.now\(\)\)\)/);
  assert.match(embed, /speech=\$\{st\.speech\} visual=\$\{st\.visual\} slide=\$\{st\.slide\} quiz=\$\{st\.quiz\} question=\$\{st\.question\} chars=\$\{st\.chars\}/);
});

test('moment: answer options are kept (strings or objects), capped and clamped, and reach the directive', () => {
  const m = parseMoment({ type: 'evelyn:moment', kind: 'quiz', question: 'Which is a royalty?', student_answer: 'Owning 25%',
    options: ['Owning 25%', { text: '$1 per unit sold' }, { label: 'A loan' }, 7, null, '  '] })!;
  assert.deepEqual(m.options, ['Owning 25%', '$1 per unit sold', 'A loan']);
  const d = renderMomentDirective(m);
  assert.match(d, /Answer options shown to the student: "Owning 25%" \| "\$1 per unit sold" \| "A loan"\./);
  assert.match(d, /Use the other options only to contrast with the one they chose; do not read them all out\./);
  const many = parseMoment({ type: 'evelyn:moment', options: Array.from({ length: 20 }, (_, i) => `opt ${i} ${'x'.repeat(400)}`) })!;
  assert.equal(many.options!.length, MOMENT_OPTIONS_MAX);
  assert.ok(many.options!.every((o) => o.length <= 200));
  assert.equal(parseMoment({ type: 'evelyn:moment', options: 'not a list' })!.options, undefined);
  assert.ok(!/Answer options/.test(renderMomentDirective(parseMoment({ type: 'evelyn:moment', title: 'x' })!)));
});

test('moment: the host transcript for the moment reaches the directive', () => {
  const d = renderMomentDirective(parseMoment({ type: 'evelyn:moment', title: 'Two kinds of offers', transcript: 'Equity means owning a piece.' })!);
  assert.match(d, /Said in this part of the video: Equity means owning a piece\./);
});

test('exit ticket: its own kind, recap then one check, never the answer', () => {
  const m = parseMoment({ type: 'evelyn:moment', kind: 'exit_ticket', title: 'Exit ticket', question: 'Equity or royalty?' })!;
  assert.equal(m.kind, 'exit_ticket');
  const d = renderMomentDirective(m);
  assert.match(d, /for the exit ticket at the end of the lesson/);
  assert.match(d, /sum up the key takeaways of this lesson/);
  assert.match(d, /ask one short question that checks one of them/);
  assert.match(d, /Do not give away the answer to the exit-ticket question\./);
  assert.ok(!/start from what the student answered/.test(d));
});

test('video duration: parsed when positive, kept across reports without one', () => {
  assert.equal(parseVideoState({ type: 'evelyn:video_state', state: 'paused', position_seconds: 3, duration_seconds: 245 })!.durationSeconds, 245);
  assert.equal(parseVideoState({ type: 'evelyn:video_state', state: 'paused', duration_seconds: 0 })!.durationSeconds, null);
  assert.equal(parseVideoState({ type: 'evelyn:video_state', state: 'paused', duration_seconds: 'x' })!.durationSeconds, null);
  let s = reduceLessonHost(S0, { type: 'video_state', state: 'paused', positionSeconds: 0, durationSeconds: 245 }, 0);
  s = reduceLessonHost(s, { type: 'video_state', state: 'playing', positionSeconds: 10 }, 1000);
  assert.equal(s.durationSeconds, 245);
});

test('moment banner: the host title under a label for its kind; none without a title', () => {
  assert.deepEqual(momentBanner(parseMoment({ type: 'evelyn:moment', title: 'Two kinds of offers' })!), { label: 'Teaching moment', title: 'Two kinds of offers' });
  assert.equal(momentBanner(parseMoment({ type: 'evelyn:moment', kind: 'quiz', title: 'Q' })!)!.label, 'Quiz');
  assert.equal(momentBanner(parseMoment({ type: 'evelyn:moment', kind: 'exit_ticket', title: 'E' })!)!.label, 'Exit ticket');
  assert.equal(momentBanner(parseMoment({ type: 'evelyn:moment', kind: 'question', title: 'Q' })!)!.label, 'Question');
  assert.equal(momentBanner(parseMoment({ type: 'evelyn:moment', summary: 'no title' })!), null);
});

test('lesson-start hook: only with the video near its beginning; hands back only with the resume tool', () => {
  const at = (pos: number | null, state: 'paused' | 'playing' | 'ended' = 'paused') =>
    reduceLessonHost(S0, { type: 'video_state', state, positionSeconds: pos }, 0);
  const hook = lessonStartHook(at(0), 0, true)!;
  assert.match(hook, /^LESSON START:/);
  assert.match(hook, /This replaces the usual opening/);
  assert.match(hook, /Do not explain or teach the content yet; explain only if the student asks\./);
  assert.match(hook, /call `resume_lesson` in that same turn/);
  assert.ok(!/resume_lesson/.test(lessonStartHook(at(0), 0, false)!));
  assert.ok(lessonStartHook(at(LESSON_START_WINDOW_S), 0, true));
  assert.equal(lessonStartHook(at(LESSON_START_WINDOW_S + 1), 0, true), null);
  assert.equal(lessonStartHook(at(null), 0, true), null);         // position unknown
  assert.equal(lessonStartHook(S0, 0, true), null);               // no video reported
  assert.equal(lessonStartHook(at(2, 'ended'), 0, true), null);
  // A playing video moves on: 10 s in at report + 10 s since = past the window.
  assert.equal(lessonStartHook(at(10, 'playing'), 10_000, true), null);
  // Generic: no partner or lesson names in the instruction.
  assert.ok(!/gameclass|scrub|shark/i.test(hook));
});

test('wiring: banner, opening note, recap and duration reach the session', () => {
  assert.match(embed, /deliverMoment\?\.\(renderMomentDirective\(moment\), momentBanner\(moment\)\)/);
  assert.match(embed, /if \(moment\.kind === 'exit_ticket'\) recapRef\.current = true;/);
  assert.match(embed, /if \(standingBy\) recapRef\.current = false;/);
  assert.match(embed, /durationSeconds: lessonHostRef\.current\.durationSeconds,\s*recap: recapRef\.current,/);
  assert.match(embed, /durationSeconds: video\.durationSeconds/);
  assert.match(embed, /lessonStartHook\(lessonHostRef\.current, Date\.now\(\), uiOptions\.videoControl\)/);
  assert.match(embed, /getOpeningNote=\{getOpeningNote\}/);
  assert.match(vtr, /onMomentBannerRef\.current\?\.\(moment\.banner\);/);
  assert.match(vtr, /if \(openingNoteRef\.current === null\) openingNoteRef\.current = getOpeningNoteRef\.current\?\.\(\) \?\? '';/);
  const ts = readFileSync(join(__dirname, '../src/app/tutor/components/session/TutorSession.tsx'), 'utf8');
  assert.match(ts, /onMomentBanner=\{handleMomentBanner\}/);
  assert.match(ts, /questionPin=\{questionPinEl \?\? momentBannerEl\}/);
  assert.match(ts, /if \(standby\) setMomentBannerState\(null\);/);
  assert.match(ts, /if \(questionPinEl && momentBannerState\) setMomentBannerState\(null\);/);
  const stage = readFileSync(join(__dirname, '../src/app/tutor/components/session/SessionStage.tsx'), 'utf8');
  assert.match(stage, /if \(questionPinKey\.startsWith\('moment-'\)\) return;/);
});

test('wiring: a moment supersedes the question pinned before it (live 10-15)', () => {
  const ts = readFileSync(join(__dirname, '../src/app/tutor/components/session/TutorSession.tsx'), 'utf8');
  const handler = ts.slice(ts.indexOf('const handleMomentBanner = useCallback'), ts.indexOf('const handleMomentBanner = useCallback') + 600);
  assert.match(handler, /if \(b\) \{\s*setQuestionPin\(null\);/);
  assert.match(handler, /onDebugEvent\?\.\('moment_banner'/);
  // A pin fetched for a pre-moment turn must not land on top of the banner.
  assert.match(ts, /const momentSeqAtFetch = momentBannerSeqRef\.current;/);
  assert.equal((ts.match(/if \(momentBannerSeqRef\.current !== momentSeqAtFetch\)/g) ?? []).length, 2, 'both the gist and the fallback path');
  // The ref is declared before the pin-fetch effect reads it.
  assert.ok(ts.indexOf('const momentBannerSeqRef = useRef(0);') < ts.indexOf('const momentSeqAtFetch'));
});

test('exit ticket: an untagged last visual near the end is inferred (duration or timeline end)', () => {
  const tm = (pos: number) => parseMoment({ type: 'evelyn:moment', kind: 'teaching_moment', title: '07 Exit', position_seconds: pos })!;
  const tl: TimelineEntry[] = [
    { start: 36, kind: 'visual', text: 'Rights' },
    { start: 150, kind: 'quiz', text: 'Quiz' },
    { start: 210, end: 216, kind: 'speech', text: 'last line' },
    { start: 219.7, kind: 'visual', text: 'Exit' },
  ];
  assert.equal(inferExitTicket(tm(219.7), { timeline: tl, durationSeconds: 222 }), 'duration');
  assert.equal(inferExitTicket(tm(219.7), { timeline: tl, durationSeconds: null }), 'timeline_end');
  assert.equal(inferExitTicket(tm(210), { timeline: tl, durationSeconds: 222 }), null, 'more than 5 s from the end');
  assert.equal(inferExitTicket(tm(36), { timeline: tl, durationSeconds: 40 }), null, 'a quiz still comes after it');
  assert.equal(inferExitTicket(tm(219.7), { timeline: [...tl, { start: 221, kind: 'question', text: 'Q' }], durationSeconds: 222 }), null, 'a question after it');
  assert.equal(inferExitTicket(tm(219.7), { timeline: [...tl, { start: 221, kind: 'speech', text: 'bye' }], durationSeconds: 222 }), 'duration', 'speech after it does not count');
  assert.equal(inferExitTicket(tm(100), { timeline: [{ start: 100, kind: 'visual', text: 'X', exitTicket: true }, { start: 200, kind: 'speech', text: 's' }], durationSeconds: 300 }), 'tagged_in_timeline');
  const quiz = parseMoment({ type: 'evelyn:moment', kind: 'quiz', position_seconds: 219.7 })!;
  assert.equal(inferExitTicket(quiz, { timeline: tl, durationSeconds: 222 }), null, 'only teaching moments');
  assert.equal(inferExitTicket(tm(219.7), { timeline: null, durationSeconds: null }), null, 'nothing to measure the end against');
  const noPos = parseMoment({ type: 'evelyn:moment', kind: 'teaching_moment' })!;
  assert.equal(inferExitTicket(noPos, { timeline: tl, durationSeconds: 222 }), null);
});

test('embed: an inferred exit ticket is logged and becomes the recap', () => {
  const embed = readFileSync(join(__dirname, '../src/app/tutor-portal/embed/page.tsx'), 'utf8');
  const i = embed.indexOf('inferExitTicket(moment,');
  assert.ok(i > 0);
  assert.ok(i < embed.indexOf("if (moment.kind === 'exit_ticket') recapRef.current = true;"), 'inferred before the recap switch');
  assert.ok(i > embed.indexOf('reconcileMomentPosition(sentPos'), 'after the position is corrected');
  assert.match(embed, /\(inferred: \$\{inferred\}\)/);
  assert.match(embed, /kinds=\$\{Object\.entries\(lesson\.rawKinds\)/);
});

// WIRING-TESTS (Tasks 3–6 append their source scans above this line)

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
