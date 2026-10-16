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

/** `visualEntryChars`: what is on screen takes more words than a caption
 *  segment (a narrated visual, a table of numbers), so visual entries get a
 *  larger cap than the 500 of the spec's speech entries. */
export const LESSON_TIMELINE_LIMITS = { entries: 5000, entryChars: 500, visualEntryChars: 1500, totalChars: 150_000 } as const;

/** `visual` / `slide` = what is on screen (the transcript only carries what
 *  is said); `quiz` / `question` = an assessment item in the lesson. */
export type TimelineKind = 'speech' | 'visual' | 'slide' | 'quiz' | 'question';

export interface TimelineEntry {
  start: number;
  end?: number;
  text: string;
  kind: TimelineKind;
  /** The host tagged this entry as the lesson's exit ticket. */
  exitTicket?: true;
}

/** What the lesson teaches is set by its title and description, then what is
 *  on screen, then its quizzes and questions; the video's speech comes last.
 *  A clip is often borrowed to teach something else (a sports clip for a
 *  physics law), so its narration must not set the topic. */
export function isOnScreen(kind: TimelineKind): boolean {
  return kind === 'visual' || kind === 'slide';
}
export function isAssessment(kind: TimelineKind): boolean {
  return kind === 'quiz' || kind === 'question';
}

/** Host `kind` values read as speech; anything else that is not a known kind
 *  is on-screen content (a host's new item type must not be read as narration). */
const SPEECH_KINDS = new Set(['', 'speech', 'transcript', 'caption', 'captions', 'subtitle', 'narration', 'audio']);

function kindOf(raw: unknown): { kind: TimelineKind; exitTicket: boolean } {
  const k = typeof raw === 'string' ? raw.trim().toLowerCase().replace(/[\s-]+/g, '_') : '';
  if (SPEECH_KINDS.has(k)) return { kind: 'speech', exitTicket: false };
  if (k === 'slide' || k === 'slides') return { kind: 'slide', exitTicket: false };
  if (k === 'quiz' || k === 'quizzes') return { kind: 'quiz', exitTicket: false };
  if (k === 'question' || k === 'questions' || k === 'mcq') return { kind: 'question', exitTicket: false };
  return { kind: 'visual', exitTicket: k === 'exit_ticket' || k === 'exit' };
}

function field(r: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  }
  return undefined;
}

function optionTexts(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, 8).map((o) => (o && typeof o === 'object' ? field(o as Record<string, unknown>, 'text', 'label', 'value') : typeof o === 'string' ? o.trim() : undefined))
    .filter((t): t is string => !!t);
}

/** One question as a line: the question, its options, and its answer marked
 *  as the tutor's alone (it guides; it never reads the answer out). */
function questionLine(q: Record<string, unknown>): string | undefined {
  const text = field(q, 'question', 'text', 'prompt', 'title');
  if (!text) return undefined;
  const opts = optionTexts(q.options ?? q.choices ?? q.answers);
  const answer = field(q, 'correct_answer', 'correctAnswer', 'answer');
  return text + (opts.length ? ` Options: ${opts.join(' | ')}.` : '') + (answer ? ` (Answer, for you only: ${answer}.)` : '');
}

/** An entry's text: `text` as sent, else built from the fields a quiz,
 *  question or slide carries (title, summary, question(s), options). */
function entryText(r: Record<string, unknown>, kind: TimelineKind): string | undefined {
  const parts: string[] = [];
  const text = typeof r.text === 'string' && r.text.trim() ? r.text.trim() : undefined;
  const title = field(r, 'title', 'label', 'name');
  if (text) parts.push(text);
  else if (title) parts.push(title);
  if (kind === 'speech') return parts[0];
  const summary = field(r, 'summary', 'description', 'content');
  if (summary && summary !== text) parts.push(summary);
  if (text && title && !text.includes(title)) parts.unshift(`"${title}":`);
  const qs = Array.isArray(r.questions) ? r.questions : (r.question !== undefined ? [r] : []);
  qs.forEach((q, i) => {
    const line = q && typeof q === 'object' ? questionLine(q as Record<string, unknown>) : typeof q === 'string' && q.trim() ? q.trim() : undefined;
    if (line && line !== text) parts.push(qs.length > 1 ? `Q${i + 1}: ${line}` : line);
  });
  return parts.length ? parts.join(' ') : undefined;
}

export interface ParsedTimeline {
  /** Sorted by `start`. */
  entries: TimelineEntry[];
  /** The host's own `kind` values and how many of each (telemetry). */
  rawKinds: Record<string, number>;
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
  const rawKinds: Record<string, number> = {};
  let cut = false;
  for (const raw of d.timeline) {
    if (entries.length >= L.entries || total >= L.totalChars) { cut = true; break; }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const r = raw as Record<string, unknown>;
    const rk = typeof r.kind === 'string' ? r.kind.slice(0, 24) : '-';
    rawKinds[rk] = (rawKinds[rk] ?? 0) + 1;
    const start = secs(r.start ?? r.position_seconds ?? r.time);
    if (start === null) continue;
    const { kind, exitTicket } = kindOf(r.kind);
    const trimmed = entryText(r, kind);
    if (!trimmed) continue;
    let text = clamp(trimmed, kind === 'speech' ? L.entryChars : L.visualEntryChars);
    if (text.length < trimmed.length) cut = true;
    if (total + text.length > L.totalChars) { text = clamp(text, L.totalChars - total); cut = true; }
    total += text.length;
    const end = secs(r.end);
    entries.push({
      start,
      ...(end !== null && end >= start ? { end } : {}),
      text,
      kind,
      ...(exitTicket ? { exitTicket: true as const } : {}),
    });
  }
  // Stable: entries with the same start keep the host's order.
  entries.sort((a, b) => a.start - b.start);
  return { entries, received: d.timeline.length, cut, rawKinds };
}

export const LESSON_NOW_LIMITS = {
  /** Speech this far before the position is context for "what did they just say". */
  beforeSeconds: 120,
  /** A little ahead: the student often asks just before the line that answers it. */
  afterSeconds: 20,
  speechChars: 4000,
  visualChars: 5000,
  /** Quizzes and questions so far. */
  assessmentChars: 3000,
  /** Short caption segments are joined; a new time stamp starts this often. */
  stampEverySeconds: 15,
  /** Recap (exit ticket): speech from the start of the lesson up to now. */
  recapSpeechChars: 7000,
} as const;

/** Seconds left at which the window tells the tutor the lesson is nearly over. */
export const LESSON_NEAR_END_S = 60;

/** What a timeline holds, for telemetry (how much of it is on-screen content). */
export function timelineStats(entries: TimelineEntry[]): { speech: number; visual: number; slide: number; quiz: number; question: number; chars: number } {
  const n = { speech: 0, visual: 0, slide: 0, quiz: 0, question: 0, chars: 0 };
  for (const e of entries) { n[e.kind]++; n.chars += e.text.length; }
  return n;
}

/** Where the lesson ends: the reported duration, else the last timeline
 *  entry's end (a host that never reports the duration). */
export function lessonEndSeconds(entries: TimelineEntry[] | null, durationSeconds: number | null): number | null {
  if (durationSeconds !== null) return durationSeconds;
  if (!entries?.length) return null;
  return entries.reduce((m, e) => Math.max(m, e.end ?? e.start), 0);
}

/** Upper bound of the rendered block; the brain route refuses anything longer. */
export const LESSON_NOW_MAX_CHARS = 18_000;

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
  /** The video's length, when the host reported it. */
  durationSeconds?: number | null;
  /** Recap mode (after an exit-ticket moment): the lesson's speech from its
   *  start, not just the stretch around the position. */
  recap?: boolean;
}): string | undefined {
  const { video, positionSeconds: pos } = input;
  const duration = input.durationSeconds ?? null;
  if (video === null) return undefined;
  const timeline = input.timeline ?? [];
  const L = LESSON_NOW_LIMITS;
  const out: string[] = [];
  out.push(
    `The student is watching a lesson video beside this conversation. ` +
    (video === 'ended'
      ? 'The video has finished.'
      : `The video is ${STATE_WORD[video]}${pos !== null ? ` at ${mmss(pos)}` : ''}${duration !== null ? ` of ${mmss(duration)}` : ''}.`),
  );
  if (video !== 'ended' && pos !== null && duration !== null && duration - pos <= LESSON_NEAR_END_S) {
    out.push('The lesson is nearly over.');
  }

  // Every visual / slide, then every quiz / question, that has appeared so
  // far; when over budget the oldest go first.
  const sofar = (keep: (k: TimelineKind) => boolean, budget: number, label: boolean): string[] => {
    const items = timeline.filter((e) => keep(e.kind) && (pos === null || e.start <= pos + 1));
    const lines: string[] = [];
    let used = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const tag = label ? `${items[i].kind === 'quiz' ? 'Quiz' : items[i].kind === 'slide' ? 'Slide' : items[i].kind === 'question' ? 'Question' : ''}${items[i].kind !== 'visual' ? ': ' : ''}` : '';
      const line = `[${mmss(items[i].start)}] ${tag}${items[i].text}`;
      if (used + line.length > budget) break;
      used += line.length + 1;
      lines.unshift(line);
    }
    return lines;
  };
  const visualLines = sofar(isOnScreen, L.visualChars, true);
  if (visualLines.length) out.push('On screen so far (latest last):', ...visualLines);
  const assessmentLines = sofar(isAssessment, L.assessmentChars, true);
  if (assessmentLines.length) out.push('Quizzes and questions so far (latest last; never read an answer out):', ...assessmentLines);

  if (input.recap) {
    // The whole lesson so far, for a summary. Over budget: keep evenly
    // spaced lines, so the beginning, middle and end all stay represented.
    let speech = timeline.filter((e) => e.kind === 'speech' && (pos === null || e.start <= pos + 1));
    const total = speech.reduce((n, e) => n + e.text.length + 10, 0);
    if (total > L.recapSpeechChars) {
      const keep = Math.max(1, Math.floor(speech.length * (L.recapSpeechChars / total)));
      const stride = speech.length / keep;
      speech = Array.from({ length: keep }, (_, k) => speech[Math.floor(k * stride)]);
    }
    const lines: string[] = [];
    let stampAt = -Infinity;
    for (const e of speech) {
      if (e.start - stampAt >= L.stampEverySeconds || !lines.length) {
        lines.push(`[${mmss(e.start)}] ${e.text}`);
        stampAt = e.start;
      } else {
        lines[lines.length - 1] += ` ${e.text}`;
      }
    }
    if (lines.length) out.push('What the lesson has said so far, from the start:', ...lines);
  } else if (pos !== null) {
    // Speech around the position.
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

  if (visualLines.length || assessmentLines.length) {
    out.push(
      'What the lesson teaches comes, in order, from its title and description, then what is on screen, then its quizzes and questions; ' +
      'what the video says matters least. The clip may be about something else than the concept being taught (a sports clip used to teach a law of physics): ' +
      'teach the lesson\'s concept and use the clip as the example.',
    );
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
