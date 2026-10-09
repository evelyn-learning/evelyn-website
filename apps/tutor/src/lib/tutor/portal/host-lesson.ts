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
  /** When `positionSeconds` was reported (a playing video has moved on since). */
  positionAtMs: number | null;
  /** Between `evelyn:pause` and `evelyn:resume`. */
  hostPaused: boolean;
  /** When the student (or a moment) woke the tutor over a playing video.
   *  Non-null = awake although the last report says `playing`; cleared by a
   *  paused/ended report or a play command. */
  wokeAtMs: number | null;
}

export const INITIAL_LESSON_HOST_STATE: LessonHostState = {
  video: null, positionSeconds: null, positionAtMs: null, hostPaused: false, wokeAtMs: null,
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
      return {
        ...s,
        video: e.state,
        // No position in this report: keep the last one, advanced to now if
        // the video was playing, so a later estimate starts from the right place.
        positionSeconds: e.positionSeconds ?? currentPositionSeconds(s, nowMs),
        positionAtMs: nowMs,
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
  // The moment interrupts whatever was going on: a question the tutor had
  // asked is dropped, not answered on the student's behalf.
  parts.push('If a question of yours was still open, leave it — do not answer it for the student.');
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
