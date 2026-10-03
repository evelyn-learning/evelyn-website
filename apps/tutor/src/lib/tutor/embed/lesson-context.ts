/**
 * Host-supplied lesson context for "in-flow" embeds (partner spec v1.1):
 * the short title, the lesson description, what happens in the clip, and the
 * question the student was on. Every field is optional and CLAMPED, never
 * rejected — a malformed host field must not fail a session. Rendered into
 * the SESSION part of the system prompt (never the shared core).
 */
export type LessonContext = {
  title?: string;
  description?: string;
  summary?: string;
  characters?: string[];
  transcript?: string;
  playheadSeconds?: number;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
};

export const LESSON_CONTEXT_LIMITS = {
  title: 80, topic: 200, description: 1000, summary: 1500, characters: 10, character: 80,
  transcript: 6000, question: 2000, studentAnswer: 500, correctAnswer: 500,
} as const;

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  if (!t) return undefined;
  // Count code points so a clamp never splits a surrogate pair.
  return t.length > max ? Array.from(t).slice(0, max).join('') : t;
}

function strList(v: unknown, maxItems: number, maxEach: number): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: string[] = [];
  for (const item of v) {
    const s = str(item, maxEach);
    if (s) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out.length ? out : undefined;
}

function seconds(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : undefined;
}

export function parseLessonContext(raw: unknown): LessonContext | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const r = raw as Record<string, unknown>;
  const c = (r.context && typeof r.context === 'object' && !Array.isArray(r.context) ? r.context : {}) as Record<string, unknown>;
  const L = LESSON_CONTEXT_LIMITS;
  const lc: LessonContext = {
    title: str(r.title, L.title),
    description: str(r.description, L.description),
    summary: str(c.summary, L.summary),
    characters: strList(c.characters, L.characters, L.character),
    transcript: str(c.transcript, L.transcript),
    playheadSeconds: seconds(c.playhead_seconds),
    question: str(r.question, L.question),
    studentAnswer: str(r.student_answer, L.studentAnswer),
    correctAnswer: str(r.correct_answer, L.correctAnswer),
  };
  const compact = Object.fromEntries(Object.entries(lc).filter(([, v]) => v !== undefined)) as LessonContext;
  return Object.keys(compact).length ? compact : undefined;
}

export function parseEntry(raw: unknown): 'in-flow' | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  return (raw as { entry?: unknown }).entry === 'in-flow' ? 'in-flow' : undefined;
}

/** Display title: cut with an ellipsis when over `max` (default 80). */
export function clampTitle(s: string, max: number = LESSON_CONTEXT_LIMITS.title): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function mmss(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Facts about the scene, from the host. '' when there is nothing to say. */
export function renderLessonContextBlock(lc: LessonContext): string {
  const lines: string[] = [];
  if (lc.title) lines.push(`Lesson: ${lc.title}`);
  if (lc.description) lines.push(`Description: ${lc.description}`);
  if (lc.summary) lines.push(`Clip: ${lc.summary}`);
  if (lc.characters?.length) lines.push(`People: ${lc.characters.join(', ')}`);
  if (lc.playheadSeconds !== undefined) lines.push(`The student was at ${mmss(lc.playheadSeconds)} of the clip when they asked for help.`);
  if (lc.transcript) lines.push(`<clip_transcript>\n${lc.transcript}\n</clip_transcript>`);
  if (!lines.length) return '';
  return (
    `\n## Lesson context (supplied by the host — the only source of facts about the scene)\n` +
    lines.join('\n') + '\n' +
    'Treat the lines above as the facts of the scene. Do not add names, numbers, offers or events that are not in them; ' +
    'if a detail is missing, say you do not have it rather than guessing.\n'
  );
}

/** The question the student was on. '' when there is none. */
export function renderQuestionBlock(lc: LessonContext): string {
  if (!lc.question) return '';
  let out = `\n## The question the student was on\nQuestion: ${lc.question}\n`;
  if (lc.studentAnswer) out += `Student answered: ${lc.studentAnswer}\n`;
  if (lc.correctAnswer) out += `Correct answer (never state it outright; guide the student to it): ${lc.correctAnswer}\n`;
  out += 'Start from what the student answered: find what they got right, then the one idea that fixes the rest.\n';
  return out;
}
