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
import { lessonEndSeconds, type TimelineEntry } from './host-lesson-timeline';

export const VIDEO_STATES = ['playing', 'paused', 'ended'] as const;
export type VideoState = (typeof VIDEO_STATES)[number];

export const MOMENT_KINDS = ['teaching_moment', 'question', 'quiz', 'exit_ticket'] as const;
export type MomentKind = (typeof MOMENT_KINDS)[number];

/** Shown in the dock while standing by (spec §1). */
export const STANDBY_LINE = 'Feel free to ask a question about anything you see.';
/** The tutor's own play command must be confirmed by `video_state: playing`
 *  within this long, else the tutor stays available (spec §3.4). */
export const RESUME_CONFIRM_MS = 3000;
/** Continuous standby this long ends the session with `ended_reason: "idle"` (spec §5). */
export const STANDBY_IDLE_END_MS = 30 * 60 * 1000;
/** A moment that could not be delivered within this long (session never
 *  started, tutor kept busy) is dropped: the video has moved on. */
export const MOMENT_STALE_MS = 120 * 1000;
/** A moment that arrives BEFORE the session has started is kept only this
 *  long: a host's "ask the tutor about this" sends the moment and the start
 *  together, while a moment for a student who has not opened the tutor must
 *  not play a minute later when they open it about something else. */
export const MOMENT_PRESTART_HOLD_MS = 5 * 1000;
/** A session that starts with the video this close to its beginning opens
 *  with a short hook for the lesson instead of the usual opener. */
export const LESSON_START_WINDOW_S = 15;
/** At most this many answer options are kept from a moment, each clamped. */
export const MOMENT_OPTIONS_MAX = 8;
export const MOMENT_OPTION_CHARS = 200;
/** A moment's own transcript (what is said in that part of the video). */
export const MOMENT_TRANSCRIPT_CHARS = 1500;

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
  title?: string;
  summary?: string;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  /** Every answer option the student was shown (quiz / question moments). */
  options?: string[];
  /** What is said in this part of the video, as the host sends it. */
  transcript?: string;
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
    options: parseOptions(d.options),
    transcript: str(d.transcript, MOMENT_TRANSCRIPT_CHARS),
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
}

export const INITIAL_LESSON_HOST_STATE: LessonHostState = {
  video: null, positionSeconds: null, positionAtMs: null, durationSeconds: null, hostPaused: false, wokeAtMs: null,
};

export type LessonHostEvent =
  | { type: 'video_state'; state: VideoState; positionSeconds: number | null; durationSeconds?: number | null }
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
      };
    }
    case 'host_pause':
      return s.hostPaused ? s : { ...s, hostPaused: true };
    case 'host_resume':
      return s.hostPaused ? { ...s, hostPaused: false } : s;
    case 'student_wake':
      return s.video === 'playing' && s.wokeAtMs === null ? { ...s, wokeAtMs: nowMs } : s;
    case 'moment': {
      if (e.positionSeconds === null) {
        return s.video === 'playing' && s.wokeAtMs === null ? { ...s, wokeAtMs: nowMs } : s;
      }
      return {
        ...s,
        positionSeconds: e.positionSeconds,
        positionAtMs: nowMs,
        wokeAtMs: s.video === 'playing' && s.wokeAtMs === null ? nowMs : s.wokeAtMs,
      };
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
export function renderMomentDirective(m: LessonMoment): string {
  const at = m.positionSeconds !== null ? ` at ${mmss(Math.floor(m.positionSeconds))}` : '';
  const what =
    m.kind === 'teaching_moment' ? 'a teaching moment'
      : m.kind === 'quiz' ? 'a quiz question'
        : m.kind === 'exit_ticket' ? 'the exit ticket at the end of the lesson'
          : 'a question';
  const parts = [`The lesson video just paused${at} for ${what}${m.title ? `: "${m.title}"` : ''}.`];
  if (m.summary) parts.push(`On screen: ${m.summary}`);
  if (m.transcript) parts.push(`Said in this part of the video: ${m.transcript}`);
  if (m.question) parts.push(`Question: ${m.question}`);
  if (m.options) parts.push(`Answer options shown to the student: ${m.options.map((o) => `"${o}"`).join(' | ')}.`);
  if (m.studentAnswer) parts.push(`The student answered: ${m.studentAnswer}`);
  if (m.correctAnswer) parts.push(`Correct answer (never state it outright; guide the student to it): ${m.correctAnswer}`);
  if (m.kind === 'exit_ticket') {
    // The lesson is ending: recap first, then a single check. The exit
    // ticket itself is the student's to answer.
    parts.push(
      'Step in now: in two or three sentences, sum up the key takeaways of this lesson from the lesson video lines, ' +
      'then ask one short question that checks one of them.' +
      (m.question ? ' Do not give away the answer to the exit-ticket question.' : ''),
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
export function clockMessage(input: { activeSeconds: number; running: boolean; maxSeconds?: number }): {
  type: 'evelyn:clock'; active_seconds: number; running: boolean; max_seconds?: number;
} {
  return {
    type: 'evelyn:clock',
    active_seconds: Math.max(0, Math.floor(input.activeSeconds)),
    running: input.running,
    ...(typeof input.maxSeconds === 'number' && input.maxSeconds > 0 ? { max_seconds: Math.floor(input.maxSeconds) } : {}),
  };
}
