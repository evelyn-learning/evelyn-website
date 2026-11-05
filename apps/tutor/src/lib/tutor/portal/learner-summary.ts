/**
 * Learner summary (GDI learner home): a stored tutor session → facts, a generic
 * prompt, and a validated EN/JA summary. Pure: the model call is injected
 * (Task 2 wires callGraderJson). Numbers, levels and corrections always come
 * from the session, never from the model.
 */
import type { ReplySchema } from './grade-free-response';
import type { WorkingLevel } from '../level/working-level';

export type LearnerSummaryV1 = {
  version: 1; generated_at: string; model: string; turn_count: number;
  level: { value: WorkingLevel | null; source: 'session' | 'profile' | 'none'; evidence_en: string; evidence_ja: string };
  assessment: {
    grammar_en: string; grammar_ja: string;
    corrections: Array<{ student: string; corrected: string }>;
    pronunciation: { practised: Array<{ sentence: string; overall: number; prosody: number | null; weak: string[] }>; comment_en: string; comment_ja: string };
  };
  recommendations: Array<{ en: string; ja: string }>;
};

export type SessionFacts = {
  lessonTitle: string; durationMin: number; partsCompleted: string[];
  level: LearnerSummaryV1['level'];
  corrections: LearnerSummaryV1['assessment']['corrections'];
  pronunciation: LearnerSummaryV1['assessment']['pronunciation']['practised'];
  transcriptExcerpt: string;
};

export type SessionFactsInput = {
  subject?: string; topic?: string; duration?: number;
  transcript: Array<{ role: string; text: string; whiteboardCommands?: Array<Record<string, unknown>> }>;
  debugEvents?: Array<{ type: string; message: string }>;
  lessonProgress?: { completedSegmentIds?: string[] };
};

type ModelReply = {
  level_evidence_en: string; level_evidence_ja: string; grammar_en: string; grammar_ja: string;
  pronunciation_comment_en: string; pronunciation_comment_ja: string; recommendations: Array<{ en: string; ja: string }>;
};

const MAX_CORRECTIONS = 6;
const MAX_TURNS = 40;
const MAX_TURN_CHARS = 160;
const MAX_FIELD = 400;
const NOT_PRACTISED_EN = 'Pronunciation was not practised in this lesson.';
const NOT_PRACTISED_JA = '今回のレッスンでは発音の練習は行いませんでした。';
const PROFILE_EVIDENCE_EN = 'Level set in an earlier lesson';
const PROFILE_EVIDENCE_JA = '以前のレッスンで設定されたレベルです。';

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export function parseWorkingLevelEvent(message: string): { level: WorkingLevel; evidence: string } | null {
  const m = /^(beginner|intermediate|advanced)\b(?:\s+source=\w+)?\s+evidence=([\s\S]*)$/.exec((message ?? '').trim());
  if (!m) return null;
  return { level: m[1] as WorkingLevel, evidence: m[2].trim() };
}

export function parsePronunciationNote(message: string): { sentence: string; overall: number; prosody: number | null; weak: string[] } | null {
  const text = message ?? '';
  if (!/^\s*measured\b/.test(text) && !text.includes('Measured pronunciation of')) return null;
  const head = /Measured pronunciation of "([\s\S]*?)": overall (\d+(?:\.\d+)?)\/100\./.exec(text);
  if (!head) return null;
  const rest = text.slice((head.index ?? 0) + head[0].length);
  const weakRegion = rest.split(/Prosody|Feed back/)[0];
  const weak: string[] = [];
  for (const w of weakRegion.matchAll(/"([^"]+)"\s+(?:\d+|omitted)/g)) weak.push(w[1]);
  const pros = /Prosody (\d+(?:\.\d+)?)\/100/.exec(rest);
  return { sentence: head[1], overall: Number(head[2]), prosody: pros ? Number(pros[1]) : null, weak };
}

export function correctionsFromTranscript(transcript: SessionFactsInput['transcript']): LearnerSummaryV1['assessment']['corrections'] {
  const out: LearnerSummaryV1['assessment']['corrections'] = [];
  const seen = new Set<string>();
  let lastStudent = '';
  for (const t of transcript ?? []) {
    if (t.role === 'student' || t.role === 'user') { lastStudent = String(t.text ?? '').trim(); continue; }
    if (t.role !== 'tutor' && t.role !== 'assistant') continue;
    for (const c of t.whiteboardCommands ?? []) {
      if (c.action !== 'showSentence') continue;
      const corrected = typeof c.sentence === 'string' ? c.sentence.trim() : '';
      if (!corrected || !Array.isArray(c.emphasis) || c.emphasis.length === 0) continue;
      if (seen.has(corrected) || !lastStudent) continue;
      seen.add(corrected);
      out.push({ student: lastStudent, corrected });
      if (out.length >= MAX_CORRECTIONS) return out;
    }
  }
  return out;
}

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

export function buildSessionFacts(
  input: SessionFactsInput,
  profileLevel: { level: WorkingLevel; setAt: number } | null,
): SessionFacts {
  const events = input.debugEvents ?? [];
  let level: SessionFacts['level'] = { value: null, source: 'none', evidence_en: '', evidence_ja: '' };
  const lvEvent = [...events].reverse().find((e) => e.type === 'working_level_set');
  const parsed = lvEvent ? parseWorkingLevelEvent(lvEvent.message) : null;
  if (parsed) level = { value: parsed.level, source: 'session', evidence_en: parsed.evidence, evidence_ja: '' };
  else if (profileLevel) level = { value: profileLevel.level, source: 'profile', evidence_en: PROFILE_EVIDENCE_EN, evidence_ja: PROFILE_EVIDENCE_JA };

  const pronunciation: SessionFacts['pronunciation'] = [];
  for (const e of events) {
    if (e.type !== 'pronunciation_note_planted') continue;
    const p = parsePronunciationNote(e.message);
    if (p) pronunciation.push(p);
  }

  const turns = (input.transcript ?? []).filter((t) => String(t.text ?? '').trim()).slice(-MAX_TURNS);
  const transcriptExcerpt = turns
    .map((t) => `${t.role === 'student' || t.role === 'user' ? 'Student' : 'Tutor'}: ${clip(String(t.text), MAX_TURN_CHARS)}`)
    .join('\n');

  return {
    lessonTitle: [input.subject, input.topic].filter(Boolean).join(' — '),
    durationMin: Math.round(((input.duration ?? 0) / 60) * 10) / 10,
    partsCompleted: [...(input.lessonProgress?.completedSegmentIds ?? [])],
    level,
    corrections: correctionsFromTranscript(input.transcript ?? []),
    pronunciation,
    transcriptExcerpt,
  };
}

const str = { type: 'string' };
export const LEARNER_SUMMARY_SCHEMA: ReplySchema = {
  type: 'object',
  properties: {
    level_evidence_en: str, level_evidence_ja: str,
    grammar_en: str, grammar_ja: str,
    pronunciation_comment_en: str, pronunciation_comment_ja: str,
    recommendations: {
      type: 'array',
      items: { type: 'object', properties: { en: str, ja: str }, required: ['en', 'ja'], additionalProperties: false },
    },
  },
  required: ['level_evidence_en', 'level_evidence_ja', 'grammar_en', 'grammar_ja', 'pronunciation_comment_en', 'pronunciation_comment_ja', 'recommendations'],
  additionalProperties: false,
};

export function renderSummaryPrompt(facts: SessionFacts): { system: string; user: string } {
  const system =
    'You write the learner-facing summary of one language lesson from the facts given. Never invent scores, levels or corrections; comment only on what the facts show. English first; each `_ja` field is one short polite Japanese sentence carrying the same point. Reply with only the JSON object.';
  const lines = [
    `Lesson: ${facts.lessonTitle || '(untitled)'}`,
    `Duration: ${facts.durationMin} min`,
    `Parts completed: ${facts.partsCompleted.length ? facts.partsCompleted.join(', ') : 'none recorded'}`,
    `Level: ${facts.level.value ?? 'not assessed'} (${facts.level.source})${facts.level.evidence_en ? ` — ${facts.level.evidence_en}` : ''}`,
    'Corrections made in the lesson:',
    ...(facts.corrections.length ? facts.corrections.map((c) => `- "${c.student}" -> "${c.corrected}"`) : ['- none']),
    'Pronunciation measured:',
    ...(facts.pronunciation.length
      ? facts.pronunciation.map((p) => `- "${p.sentence}" overall ${p.overall}/100, prosody ${p.prosody ?? 'n/a'}${p.weak.length ? `, weak words: ${p.weak.join(', ')}` : ', no weak words'}`)
      : ['- none (not practised)']),
    'Transcript excerpt:',
    facts.transcriptExcerpt || '(empty)',
    '',
    'Reply with JSON fields: level_evidence_en, level_evidence_ja (why this level, from the facts), grammar_en, grammar_ja (one observation on the learner\'s grammar), pronunciation_comment_en, pronunciation_comment_ja (on the measured scores only; say it was not practised if none), recommendations (3 to 5 objects {en, ja}: concrete next steps).',
  ];
  return { system, user: lines.join('\n') };
}

function okStr(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= MAX_FIELD;
}

export function validateModelReply(reply: unknown): ModelReply | null {
  if (!reply || typeof reply !== 'object' || Array.isArray(reply)) return null;
  const r = reply as Record<string, unknown>;
  for (const k of ['level_evidence_en', 'level_evidence_ja', 'grammar_en', 'grammar_ja', 'pronunciation_comment_en', 'pronunciation_comment_ja']) {
    if (!okStr(r[k])) return null;
  }
  const recs = r.recommendations;
  if (!Array.isArray(recs) || recs.length < 3 || recs.length > 5) return null;
  const out: Array<{ en: string; ja: string }> = [];
  for (const x of recs) {
    const o = x as Record<string, unknown> | null;
    if (!o || !okStr(o.en) || !okStr(o.ja)) return null;
    out.push({ en: o.en as string, ja: o.ja as string });
  }
  return {
    level_evidence_en: r.level_evidence_en as string, level_evidence_ja: r.level_evidence_ja as string,
    grammar_en: r.grammar_en as string, grammar_ja: r.grammar_ja as string,
    pronunciation_comment_en: r.pronunciation_comment_en as string, pronunciation_comment_ja: r.pronunciation_comment_ja as string,
    recommendations: out,
  };
}

export function assembleSummary(
  facts: SessionFacts,
  reply: ModelReply | null,
  meta: { model: string; turnCount: number; now?: Date },
): LearnerSummaryV1 {
  if (!reply) throw new Error('assembleSummary: reply is not valid');
  const practised = facts.pronunciation.length > 0;
  const level = { ...facts.level };
  if (level.source === 'session') { level.evidence_en = reply.level_evidence_en; level.evidence_ja = reply.level_evidence_ja; }
  else if (level.source === 'profile') { level.evidence_en = PROFILE_EVIDENCE_EN; level.evidence_ja = PROFILE_EVIDENCE_JA; }
  else { level.evidence_en = reply.level_evidence_en; level.evidence_ja = reply.level_evidence_ja; }
  return {
    version: 1,
    generated_at: (meta.now ?? new Date()).toISOString(),
    model: meta.model,
    turn_count: meta.turnCount,
    level,
    assessment: {
      grammar_en: reply.grammar_en, grammar_ja: reply.grammar_ja,
      corrections: facts.corrections.map((c) => ({ ...c })),
      pronunciation: {
        practised: facts.pronunciation.map((p) => ({ ...p, weak: [...p.weak] })),
        comment_en: practised ? reply.pronunciation_comment_en : NOT_PRACTISED_EN,
        comment_ja: practised ? reply.pronunciation_comment_ja : NOT_PRACTISED_JA,
      },
    },
    recommendations: reply.recommendations.map((x) => ({ ...x })),
  };
}

export async function generateLearnerSummary(
  facts: SessionFacts,
  deps: { callJson: (system: string, user: string, schema: ReplySchema) => Promise<Record<string, unknown>>; model: string; turnCount: number; now?: Date },
): Promise<{ ok: true; summary: LearnerSummaryV1 } | { ok: false; error: string }> {
  const { system, user } = renderSummaryPrompt(facts);
  const retryUser = `${user}\n\nYour previous reply was not valid JSON for the schema; reply again with only the JSON object.`;
  let lastError = 'invalid reply';
  for (const u of [user, retryUser]) {
    try {
      const valid = validateModelReply(await deps.callJson(system, u, LEARNER_SUMMARY_SCHEMA));
      if (valid) return { ok: true, summary: assembleSummary(facts, valid, { model: deps.model, turnCount: deps.turnCount, now: deps.now }) };
      lastError = 'invalid reply';
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  return { ok: false, error: lastError };
}
