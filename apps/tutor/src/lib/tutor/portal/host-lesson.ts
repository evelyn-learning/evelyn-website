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
import { lessonEndSeconds, normalizeQuestionType, type QuestionType, type TimelineEntry } from './host-lesson-timeline';

export const VIDEO_STATES = ['playing', 'paused', 'ended'] as const;
export type VideoState = (typeof VIDEO_STATES)[number];

export const MOMENT_KINDS = ['teaching_moment', 'question', 'quiz', 'exit_ticket'] as const;
export type MomentKind = (typeof MOMENT_KINDS)[number];

/** Shown in the dock while standing by (spec §1). Skyler 2026-11-02: name
 *  the pause, the experience works best when the student pauses first. */
export const STANDBY_LINE = 'Feel free to pause the video and ask a question about anything you see.';
/** The tutor's own play command must be confirmed by `video_state: playing`
 *  within this long, else the tutor stays available (spec §3.4). */
export const RESUME_CONFIRM_MS = 3000;
/** Continuous standby this long ends the session with `ended_reason: "idle"` (spec §5). */
export const STANDBY_IDLE_END_MS = 30 * 60 * 1000;
/** A moment that could not be delivered within this long (session never
 *  started, tutor kept busy) is dropped: the video has moved on. */
export const MOMENT_STALE_MS = 120 * 1000;
/** A moment that arrives BEFORE the session has started is kept while the
 *  video stays paused on it (a host pauses at the moment; the student reads
 *  it, then taps start — seconds later), up to MOMENT_STALE_MS. Once the
 *  video plays on without a start, it is dropped after this long: a student
 *  who opens the tutor a minute later is asking about something else. */
export const MOMENT_PRESTART_HOLD_MS = 5 * 1000;
/** A session that starts with the video this close to its beginning opens
 *  with a short hook for the lesson instead of the usual opener. */
export const LESSON_START_WINDOW_S = 15;
/** At most this many answer options are kept from a moment, each clamped. */
export const MOMENT_OPTIONS_MAX = 8;
export const MOMENT_OPTION_CHARS = 200;
/** A moment's own transcript (what is said in that part of the video). */
export const MOMENT_TRANSCRIPT_CHARS = 1500;
export const HOST_ID_CHARS = 80;
/** The most of a question that is read aloud (spec v1.6). A longer stem is
 *  cut at a sentence or word end: the student has it on screen, and a long
 *  read holds up the ones who read faster than the voice. */
export const QUESTION_READ_MAX_CHARS = 400;
/** After a correct answer, how long the frame waits for its own short line
 *  to finish before telling the host it is done anyway. */
export const HOST_LINE_DONE_MAX_MS = 8000;

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

/** A host id: a string or a number, kept as a short string. */
function hostId(v: unknown): string | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return str(v, HOST_ID_CHARS);
}

/** `{ type: 'evelyn:video_state', state, position_seconds? }`. An unknown
 *  state is ignored (null); a bad position is dropped, the state is kept. */
export function parseVideoState(data: unknown): { state: VideoState; positionSeconds: number | null; durationSeconds: number | null } | null {
  const d = obj(data);
  if (!d || d.type !== 'evelyn:video_state') return null;
  if (typeof d.state !== 'string' || !(VIDEO_STATES as readonly string[]).includes(d.state)) return null;
  const duration = secs(d.duration_seconds);
  return { state: d.state as VideoState, positionSeconds: secs(d.position_seconds), durationSeconds: duration && duration > 0 ? duration : null };
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
  /** How the question is answered (question / quiz moments); see QuestionType. */
  questionType?: QuestionType;
  title?: string;
  summary?: string;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  /** Every answer option the student was shown (quiz / question moments). */
  options?: string[];
  /** What is said in this part of the video, as the host sends it. */
  transcript?: string;
  /** The host's own id for the question (ties a moment to `evelyn:question`). */
  questionId?: string;
}

/** Options as plain strings: a string, or an object's `text` / `label` /
 *  `value`. Anything else is skipped; the list is capped and each clamped. */
function parseOptions(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: string[] = [];
  for (const raw of v) {
    if (out.length >= MOMENT_OPTIONS_MAX) break;
    const o = obj(raw);
    const text = str(o ? (o.text ?? o.label ?? o.value) : raw, MOMENT_OPTION_CHARS);
    if (text) out.push(text);
  }
  return out.length ? out : undefined;
}

/** `{ type: 'evelyn:moment', … }`. Every field is optional and CLAMPED with
 *  the same limits as the token's lesson context; an unknown `kind` is a
 *  teaching moment. A host typo must not swallow the moment. */
export function parseMoment(data: unknown): LessonMoment | null {
  const d = obj(data);
  if (!d || d.type !== 'evelyn:moment') return null;
  const L = LESSON_CONTEXT_LIMITS;
  // `type` is the message type here, so the question type goes by its other names.
  // A host may also name the moment after the question's type (kind: "mcq").
  const kindAsType = normalizeQuestionType(d.kind);
  const questionType = normalizeQuestionType(d.question_type) ?? normalizeQuestionType(d.questionType) ?? normalizeQuestionType(d.format) ?? normalizeQuestionType(d.answer_type) ?? kindAsType;
  const kind = typeof d.kind === 'string' && (MOMENT_KINDS as readonly string[]).includes(d.kind)
    ? (d.kind as MomentKind)
    : kindAsType ? 'question' : 'teaching_moment';
  const m: LessonMoment = {
    kind,
    positionSeconds: secs(d.position_seconds),
    questionType,
    title: str(d.title, L.title),
    summary: str(d.summary, L.summary),
    question: str(d.question, L.question),
    studentAnswer: str(d.student_answer, L.studentAnswer),
    // A free response has no key: the platform marks every submission
    // correct, and its field is a placeholder the tutor must not grade by.
    correctAnswer: questionType === 'freeresponse' ? undefined : str(d.correct_answer, L.correctAnswer),
    options: parseOptions(d.options),
    transcript: str(d.transcript, MOMENT_TRANSCRIPT_CHARS),
    questionId: hostId(d.question_id),
  };
  return Object.fromEntries(Object.entries(m).filter(([, v]) => v !== undefined)) as unknown as LessonMoment;
}

export interface LessonHostState {
  /** Last `video_state` from the host; null until the first one (a host
   *  that never sends one gets the pre-v1.2 behaviour). */
  video: VideoState | null;
  positionSeconds: number | null;
  /** When `positionSeconds` was reported (a playing video has moved on since). */
  positionAtMs: number | null;
  /** The video's length, once the host has reported it (optional). */
  durationSeconds: number | null;
  /** Between `evelyn:pause` and `evelyn:resume`. */
  hostPaused: boolean;
  /** When the student (or a moment) woke the tutor over a playing video.
   *  Non-null = awake although the last report says `playing`; cleared by a
   *  paused/ended report or a play command. */
  wokeAtMs: number | null;
  /** A host question is on screen and is the student's to answer (spec
   *  v1.6): from `evelyn:question` until a moment or the student wakes the
   *  tutor, or the video plays on. The video is paused meanwhile, yet the
   *  tutor stands by — reading the question out is not tutoring time. */
  questionOpen: boolean;
}

export const INITIAL_LESSON_HOST_STATE: LessonHostState = {
  video: null, positionSeconds: null, positionAtMs: null, durationSeconds: null, hostPaused: false, wokeAtMs: null, questionOpen: false,
};

export type LessonHostEvent =
  | { type: 'video_state'; state: VideoState; positionSeconds: number | null; durationSeconds?: number | null }
  | { type: 'host_pause' }
  | { type: 'host_resume' }
  /** The student started typing, tapped the mic, or pressed pause in the panel. */
  | { type: 'student_wake' }
  | { type: 'moment'; positionSeconds: number | null }
  /** `evelyn:question`: a question appeared on the host's screen. */
  | { type: 'question'; positionSeconds: number | null }
  /** A play command was sent to the host (panel button or the tutor). */
  | { type: 'play_command' };

export function reduceLessonHost(s: LessonHostState, e: LessonHostEvent, nowMs: number): LessonHostState {
  switch (e.type) {
    case 'video_state': {
      return {
        ...s,
        video: e.state,
        // No position in this report: keep the last one, advanced to now if
        // the video was playing, so a later estimate starts from the right place.
        positionSeconds: e.positionSeconds ?? currentPositionSeconds(s, nowMs),
        positionAtMs: nowMs,
        durationSeconds: e.durationSeconds ?? s.durationSeconds,
        // A wake outlives further `playing` reports (a host that reports its
        // position often, or is slow to pause, must not put the tutor back
        // to sleep in the middle of the student's question). It ends when the
        // host reports paused/ended, or when a play command is sent.
        wokeAtMs: e.state === 'playing' ? s.wokeAtMs : null,
        // The video plays on: the question is behind it, answered or not.
        questionOpen: e.state === 'playing' ? false : s.questionOpen,
      };
    }
    case 'host_pause':
      return s.hostPaused ? s : { ...s, hostPaused: true };
    case 'host_resume':
      return s.hostPaused ? { ...s, hostPaused: false } : s;
    case 'student_wake': {
      const wake = s.video === 'playing' && s.wokeAtMs === null;
      if (!wake && !s.questionOpen) return s;
      return { ...s, wokeAtMs: wake ? nowMs : s.wokeAtMs, questionOpen: false };
    }
    case 'moment': {
      const wake = s.video === 'playing' && s.wokeAtMs === null;
      if (e.positionSeconds === null) {
        return wake || s.questionOpen ? { ...s, wokeAtMs: wake ? nowMs : s.wokeAtMs, questionOpen: false } : s;
      }
      return {
        ...s,
        positionSeconds: e.positionSeconds,
        positionAtMs: nowMs,
        wokeAtMs: wake ? nowMs : s.wokeAtMs,
        questionOpen: false,
      };
    }
    case 'question': {
      // A tutor the student woke over a playing video is mid-conversation:
      // the question does not put it back to sleep.
      if (s.wokeAtMs !== null) return s;
      if (s.questionOpen && e.positionSeconds === null) return s;
      return e.positionSeconds === null
        ? { ...s, questionOpen: true }
        : { ...s, questionOpen: true, positionSeconds: e.positionSeconds, positionAtMs: nowMs };
    }
    case 'play_command':
      return s.wokeAtMs === null ? s : { ...s, wokeAtMs: null };
  }
}

/** Where the video is now. The host reports a position when the state
 *  changes, not continuously: while it plays, the last report plus the time
 *  since is the best estimate (normal speed assumed; the host's next report
 *  corrects it). A student who asks 90 s into a stretch of playback must get
 *  the lesson at that point, not at where the stretch began. */
export function currentPositionSeconds(s: LessonHostState, nowMs: number): number | null {
  if (s.positionSeconds === null) return null;
  if (s.video !== 'playing' || s.positionAtMs === null) return s.positionSeconds;
  return s.positionSeconds + Math.max(0, nowMs - s.positionAtMs) / 1000;
}

/** The video state to tell the model. A tutor that was woken over a playing
 *  video has asked the host to pause: describe it as paused, so the model
 *  talks about a moment rather than a moving target. */
export function videoForPrompt(s: LessonHostState): VideoState | null {
  return s.video === 'playing' && s.wokeAtMs !== null ? 'paused' : s.video;
}

/** A moment's position, checked against where the host's own `video_state`
 *  says the video is. A value that is far from it but matches it once divided
 *  by 1000 was sent in milliseconds (seen live: `16750` for 16.75 s) — use
 *  seconds, or the tutor is shown the wrong part of the lesson. */
export function reconcileMomentPosition(positionSeconds: number | null, knownSeconds: number | null): number | null {
  if (positionSeconds === null || knownSeconds === null) return positionSeconds;
  const asSeconds = positionSeconds / 1000;
  return Math.abs(positionSeconds - knownSeconds) > 60 && Math.abs(asSeconds - knownSeconds) <= 5 ? asSeconds : positionSeconds;
}

/** Standing by = the host hid the panel, or its video is playing and nothing
 *  woke the tutor, or a host question is on screen for the student to answer. */
export function isStandingBy(s: LessonHostState): boolean {
  return s.hostPaused || s.questionOpen || (s.video === 'playing' && s.wokeAtMs === null);
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

/** A teaching moment this close to the end of the lesson, with nothing after
 *  it, is the exit ticket even when the host did not tag it (creators do not
 *  always): the tutor recaps the lesson instead of teaching one more visual. */
export const EXIT_TICKET_END_WINDOW_S = 5;

/** Why an untagged moment counts as the exit ticket; null when it does not.
 *  Both conditions must hold: it appears within the last
 *  EXIT_TICKET_END_WINDOW_S of the lesson (reported duration, else the end of
 *  the timeline), and no visual, slide, quiz or question comes after it. */
export function inferExitTicket(
  m: LessonMoment,
  input: { timeline: TimelineEntry[] | null; durationSeconds: number | null },
): 'duration' | 'timeline_end' | 'tagged_in_timeline' | null {
  if (m.kind !== 'teaching_moment' || m.positionSeconds === null) return null;
  const pos = m.positionSeconds;
  const later = (input.timeline ?? []).filter((e) => e.kind !== 'speech' && e.start > pos + 1);
  if (later.length) return null;
  const tagged = (input.timeline ?? []).some((e) => e.exitTicket && Math.abs(e.start - pos) <= 2);
  if (tagged) return 'tagged_in_timeline';
  const end = lessonEndSeconds(input.timeline, input.durationSeconds);
  if (end === null || pos < end - EXIT_TICKET_END_WINDOW_S) return null;
  return input.durationSeconds !== null ? 'duration' : 'timeline_end';
}

/** The synthetic (bracketed, silent) turn that makes the tutor step in on a
 *  host moment. Generic by design: every fact comes from the host's fields. */
export function renderMomentDirective(m: LessonMoment, opts?: { readAloud?: boolean }): string {
  const at = m.positionSeconds !== null ? ` at ${mmss(Math.floor(m.positionSeconds))}` : '';
  const open = m.questionType === 'freeresponse';
  const typeWord =
    open ? 'an open-ended'
      : m.questionType === 'truefalse' ? 'a true-or-false'
        : m.questionType === 'shortanswer' ? 'a short-answer'
          : m.questionType === 'mcq' ? 'a multiple-choice'
            : m.kind === 'teaching_moment' || m.kind === 'exit_ticket' ? '' : 'a';
  const what =
    m.kind === 'teaching_moment' ? 'a teaching moment'
      : m.kind === 'quiz' ? `${typeWord} quiz question`
        : m.kind === 'exit_ticket' ? 'the exit ticket at the end of the lesson'
          : `${typeWord} question`;
  const parts = [`The lesson video just paused${at} for ${what}${m.title ? `: "${m.title}"` : ''}.`];
  if (m.summary) parts.push(`On screen: ${m.summary}`);
  if (m.transcript) parts.push(`Said in this part of the video: ${m.transcript}`);
  if (m.question) parts.push(`Question: ${m.question}`);
  // Spec v1.6: the frame read the question out when it appeared. Hearing it
  // a second time from the tutor is the delay the read was meant to remove.
  if (m.question && opts?.readAloud) parts.push('The student has just heard this question read aloud; do not read it out again.');
  if (m.options) parts.push(`Answer options shown to the student: ${m.options.map((o) => `"${o}"`).join(' | ')}.`);
  else if (m.questionType === 'truefalse') parts.push('The student chooses True or False.');
  if (m.studentAnswer) parts.push(`The student answered: ${m.studentAnswer}`);
  if (open) parts.push('This question has no set answer; the platform accepts whatever the student writes. Never mark it right or wrong.');
  if (m.correctAnswer) parts.push(`Correct answer (never state it outright; guide the student to it): ${m.correctAnswer}`);
  if (m.kind === 'exit_ticket') {
    // The lesson is ending: recap first, then a single check. The exit
    // ticket itself is the student's to answer.
    parts.push(
      'Step in now: in two or three sentences, sum up the key takeaways of this lesson from the lesson video lines, ' +
      'then ask one short question that checks one of them.' +
      (m.question ? ' Do not give away the answer to the exit-ticket question.' : ''),
    );
  } else if (open && m.studentAnswer) {
    parts.push(
      'Step in now: respond to what the student wrote — name what is sound in it, then the one thing that would make it stronger, and ask them to add that.',
    );
  } else if (m.question && m.studentAnswer) {
    parts.push(
      'Step in now: start from what the student answered — what they got right, then the one idea that fixes the rest.' +
      (m.options ? ' Use the other options only to contrast with the one they chose; do not read them all out.' : ''),
    );
  } else if (m.question) {
    parts.push('Step in now: ask the student what they think and why, then work from their answer.');
  } else {
    parts.push('Step in now: in one or two sentences say what this shows, then ask one question that checks the student followed it.');
  }
  // The moment interrupts whatever was going on: a question the tutor had
  // asked is dropped, not answered on the student's behalf.
  parts.push('If a question of yours was still open, leave it — do not answer it for the student.');
  return `[${parts.join(' ')}]`;
}

/** The banner that tells the student why the tutor opened: the moment's own
 *  title (no generated text), under a label for its kind. Null without a title. */
export function momentBanner(m: LessonMoment): { label: string; title: string } | null {
  if (!m.title) return null;
  const label =
    m.kind === 'teaching_moment' ? 'Teaching moment'
      : m.kind === 'quiz' ? 'Quiz'
        : m.kind === 'exit_ticket' ? 'Exit ticket'
          : 'Question';
  return { label, title: m.title };
}

/** Opening-turn instruction for a session that starts at the very beginning
 *  of the host's video: a short hook for the lesson, no teaching, then the
 *  video. Null when the video is not near its start (a student who opens the
 *  tutor mid-lesson gets the usual opener) or its position is unknown. */
export function lessonStartHook(s: LessonHostState, nowMs: number, resumeTool: boolean): string | null {
  if (s.video === null || s.video === 'ended') return null;
  const pos = currentPositionSeconds(s, nowMs);
  if (pos === null || pos > LESSON_START_WINDOW_S) return null;
  return (
    'LESSON START: the student is about to watch the lesson video, which is at its very beginning. ' +
    'This replaces the usual opening: in two or three short sentences, introduce what the lesson is about and spark curiosity about what is coming, ' +
    'and tell the student they can ask you anything while they watch. Do not explain or teach the content yet; explain only if the student asks.' +
    (resumeTool ? ' Unless the student asks something, end with one short hand-back line and call `resume_lesson` in that same turn.' : '')
  );
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

/** How often the running clock is re-posted, so a host that draws it stays in step. */
export const CLOCK_POST_MS = 15 * 1000;

/** `evelyn:clock` (tutor → host): the session clock for a host that draws it
 *  in its own header. `active_seconds` is session time so far (standing by and
 *  minimized time excluded); `running` says whether it is advancing right now
 *  — the host ticks locally from the last message while it is, and shows the
 *  value as is while it is not. `max_seconds` only when the token set a limit. */
export function clockMessage(input: { activeSeconds: number; running: boolean; maxSeconds?: number; poolRemainingSeconds?: number }): {
  type: 'evelyn:clock'; active_seconds: number; running: boolean; max_seconds?: number; pool_remaining_seconds?: number;
} {
  return {
    type: 'evelyn:clock',
    active_seconds: Math.max(0, Math.floor(input.activeSeconds)),
    running: input.running,
    ...(typeof input.maxSeconds === 'number' && input.maxSeconds > 0 ? { max_seconds: Math.floor(input.maxSeconds) } : {}),
    // Partner minute pool (2026-10-21): minutes left in the partner's shared
    // pool, for a host that draws a gauge. Absent when no pool applies.
    ...(typeof input.poolRemainingSeconds === 'number' && Number.isFinite(input.poolRemainingSeconds) && input.poolRemainingSeconds >= 0
      ? { pool_remaining_seconds: Math.floor(input.poolRemainingSeconds) }
      : {}),
  };
}

// ── Question read-aloud and the short line after a correct answer (spec v1.6) ──
// The tutor is present at every question without a model call: the frame
// speaks the question when it appears and one short line when the student
// gets it right. Only a wrong answer (the host's moment) starts tutoring.

export interface HostQuestion {
  questionId?: string;
  /** The stem, as the host shows it. */
  text: string;
  questionType?: QuestionType;
  positionSeconds: number | null;
}

/** `{ type: 'evelyn:question', question_id?, text, question_type?, position_seconds? }`.
 *  The stem may come as `text` or `question`; a message without one is
 *  ignored (there is nothing to read). */
export function parseHostQuestion(data: unknown): HostQuestion | null {
  const d = obj(data);
  if (!d || d.type !== 'evelyn:question') return null;
  const text = str(d.text, LESSON_CONTEXT_LIMITS.question) ?? str(d.question, LESSON_CONTEXT_LIMITS.question);
  if (!text) return null;
  const q: HostQuestion = {
    questionId: hostId(d.question_id),
    text,
    questionType: normalizeQuestionType(d.question_type) ?? normalizeQuestionType(d.questionType) ?? normalizeQuestionType(d.format) ?? normalizeQuestionType(d.answer_type),
    positionSeconds: secs(d.position_seconds),
  };
  return Object.fromEntries(Object.entries(q).filter(([, v]) => v !== undefined)) as unknown as HostQuestion;
}

/** A host pauses its video for a question and sends `evelyn:question`; the
 *  two can arrive in either order, this far apart at most. */
export const QUESTION_AFTER_PAUSE_MS = 3000;

/** Does a question that just appeared put the tutor on standby and get read
 *  out? Not when the student is in conversation with a started tutor (a
 *  question re-sent for a second try must not cut the tutor off). A started
 *  tutor that is awake only because the host's pause report arrived a moment
 *  before the question is not in conversation. */
export function questionTakesOver(s: LessonHostState, input: { started: boolean; nowMs: number }): boolean {
  if (!input.started || isStandingBy(s)) return true;
  if (s.wokeAtMs !== null) return false;
  return s.video === 'paused' && s.positionAtMs !== null && input.nowMs - s.positionAtMs <= QUESTION_AFTER_PAUSE_MS;
}

/** A moment with no id to match counts as the question just read for this long. */
export const READ_QUESTION_MATCH_MS = 120 * 1000;

/** Is this moment about the question the frame read aloud? By the host's id
 *  where both carry one, else by the same question text, else (a moment that
 *  names neither) by having been read a short while ago. The moment may
 *  arrive after a start that already lifted the question's standby, so the
 *  standby state cannot answer this. */
export function momentFollowsRead(
  read: { questionId?: string; text: string; atMs: number } | null,
  m: LessonMoment,
  nowMs: number,
): boolean {
  if (!read) return false;
  if (read.questionId && m.questionId) return read.questionId === m.questionId;
  const norm = (t: string) => t.replace(/\s+/g, ' ').trim().toLowerCase();
  if (m.question) return norm(m.question) === norm(read.text);
  return nowMs - read.atMs <= READ_QUESTION_MATCH_MS;
}

/** `{ type: 'evelyn:answer', question_id?, correct }`. `correct` must be a
 *  boolean: a host that leaves it out has not said how the answer went. */
export function parseHostAnswer(data: unknown): { questionId?: string; correct: boolean } | null {
  const d = obj(data);
  if (!d || d.type !== 'evelyn:answer' || typeof d.correct !== 'boolean') return null;
  const questionId = hostId(d.question_id);
  return questionId ? { questionId, correct: d.correct } : { correct: d.correct };
}

/** What is spoken for a question: the stem only (the options are on screen;
 *  reading them all holds up a student who already knows), as plain text,
 *  cut at QUESTION_READ_MAX_CHARS on a sentence end where there is one. */
export function questionReadLine(q: HostQuestion): string {
  let t = q.text
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (Array.from(t).length > QUESTION_READ_MAX_CHARS) {
    const head = Array.from(t).slice(0, QUESTION_READ_MAX_CHARS).join('');
    const sentenceEnd = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '));
    const wordEnd = head.lastIndexOf(' ');
    t = sentenceEnd >= QUESTION_READ_MAX_CHARS / 2 ? head.slice(0, sentenceEnd + 1) : wordEnd > 0 ? head.slice(0, wordEnd) : head;
  }
  if (q.questionType === 'truefalse' && !/^true or false\b/i.test(t)) t = `True or false: ${t}`;
  return t;
}

/** One of these is spoken after a correct answer. Short on purpose: the
 *  video is waiting. Plain praise of the answer, nothing about the content
 *  (no model wrote it, so it cannot know what was asked). */
export const ENCOURAGEMENT_LINES: readonly string[] = [
  'That’s right.',
  'Exactly right.',
  'Yes, well done.',
  'Correct. Nice work.',
  'You’ve got it.',
  'Spot on.',
  'That’s it, nicely done.',
  'Right. Good thinking.',
];

/** A line for this correct answer, never the one spoken last time. */
export function pickEncouragement(last: string | null, rand: () => number = Math.random): string {
  const pool = ENCOURAGEMENT_LINES.filter((l) => l !== last);
  return pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))];
}

/** `evelyn:question_done` (tutor → host): the frame has finished with a
 *  correctly answered question — its short line has been spoken, or was not
 *  spoken at all (`spoken: false`). The host resumes its video on this. */
export function questionDoneMessage(input: { questionId?: string; spoken: boolean }): {
  type: 'evelyn:question_done'; outcome: 'correct'; spoken: boolean; question_id?: string;
} {
  return { type: 'evelyn:question_done', outcome: 'correct', spoken: input.spoken, ...(input.questionId ? { question_id: input.questionId } : {}) };
}
