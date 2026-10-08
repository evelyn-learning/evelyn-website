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
