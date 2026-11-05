/**
 * Learner summary (GDI learner home): a stored tutor session → facts, a generic
 * prompt, and a validated English summary with optional support-language lines. Pure: the model call is injected
 * (Task 2 wires callGraderJson). Numbers, levels and corrections always come
 * from the session, never from the model.
 */
import type { ReplySchema } from './grade-free-response';
import type { WorkingLevel } from '../level/working-level';

// v1 field names keep the `_ja` suffix: each `*_ja` field is the support-language line.
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
  /** W9-B4 (fix wave 9, run 5): sentences armed for a pronunciation check (pronunciation_armed events) — practised even
   *  when no clip could be measured, so the summary never says "not practised" after a cut recording. */
  pronunciationArmed: number;
  transcriptExcerpt: string;
  /** BCP-47 code of the support language (the session's tutorLanguages[1]), or null. */
  supportLanguage: string | null;
};

export type SessionFactsInput = {
  subject?: string; topic?: string; duration?: number;
  transcript: Array<{ role: string; text: string; whiteboardCommands?: Array<Record<string, unknown>> }>;
  debugEvents?: Array<{ type: string; message: string }>;
  lessonProgress?: { completedSegmentIds?: string[] };
  tutorLanguages?: string[];
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
/** W9-B4: practised (armed) but nothing measured — a fixed line, never the model's guess. */
const COUNT_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five'];
function practisedUnmeasuredEn(n: number): string {
  const count = COUNT_WORDS[n] ?? String(n);
  return `${count} sentence${n === 1 ? ' was' : 's were'} practised; no score could be measured this time.`;
}
function practisedUnmeasuredJa(n: number): string {
  return `${n}つの文を練習しましたが、今回はスコアを測定できませんでした。`;
}
const LEVEL_NONE_EN = 'Level not set in this lesson.';
const LEVEL_NONE_JA = 'このレッスンではレベルを設定していません。';

/** Summaries are generated only for language lessons (the session's `subject`). */
export const LEARNER_SUMMARY_SUBJECT = 'languages';
export function isLearnerSummarySubject(subject: unknown): boolean {
  return subject === LEARNER_SUMMARY_SUBJECT;
}

/** The session's tutor languages as sent by the embed save: 1-4 short BCP-47-like codes, else undefined. */
export function sanitizeTutorLanguages(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 4) return undefined;
  const ok = raw.every((v) => typeof v === 'string' && /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(v) && v.length <= 20);
  return ok ? (raw as string[]).slice() : undefined;
}

/** Display name of a support-language code: 'ja' -> Japanese, 'en' -> English, else the code as-is. */
export function supportLanguageName(code: string): string {
  return code === 'ja' ? 'Japanese' : code === 'en' ? 'English' : code;
}

/** A fixed-text support-language line exists only for Japanese; other support languages get ''. */
function fixedSupportLine(supportLanguage: string | null, ja: string): string {
  return supportLanguage === 'ja' ? ja : '';
}

function isoDay(ms: number): string | null {
  const d = new Date(ms);
  return Number.isFinite(d.getTime()) ? d.toISOString().slice(0, 10) : null;
}

function profileEvidence(setAt: number, supportLanguage: string | null): { en: string; ja: string } {
  const day = isoDay(setAt);
  return day
    ? { en: `Level set in your lesson on ${day}.`, ja: fixedSupportLine(supportLanguage, `${day}のレッスンで設定されたレベルです。`) }
    : { en: 'Level set in an earlier lesson.', ja: fixedSupportLine(supportLanguage, '以前のレッスンで設定されたレベルです。') };
}

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
  const langs = Array.isArray(input.tutorLanguages) ? input.tutorLanguages : [];
  const supportLanguage = typeof langs[1] === 'string' && langs[1].trim() ? langs[1].trim() : null;
  let level: SessionFacts['level'] = { value: null, source: 'none', evidence_en: '', evidence_ja: '' };
  const lvEvent = [...events].reverse().find((e) => e.type === 'working_level_set');
  const parsed = lvEvent ? parseWorkingLevelEvent(lvEvent.message) : null;
  if (parsed) level = { value: parsed.level, source: 'session', evidence_en: parsed.evidence, evidence_ja: '' };
  else if (profileLevel) {
    const ev = profileEvidence(profileLevel.setAt, supportLanguage);
    level = { value: profileLevel.level, source: 'profile', evidence_en: ev.en, evidence_ja: ev.ja };
  }

  const pronunciation: SessionFacts['pronunciation'] = [];
  let pronunciationArmed = 0;
  for (const e of events) {
    if (e.type === 'pronunciation_armed') { pronunciationArmed++; continue; }
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
    pronunciationArmed,
    transcriptExcerpt,
    supportLanguage,
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
  const support = facts.supportLanguage
    ? `Each \`_ja\` field is the support-language line: one short sentence in ${supportLanguageName(facts.supportLanguage)} carrying the same point as its English field.`
    : 'Leave every `_ja` field as an empty string.';
  const system =
    `You write the learner-facing summary of one lesson from the facts given. Never invent scores, levels or corrections; comment only on what the facts show. English first. Keep every field short: at most two sentences. ${support} Reply with only the JSON object.`;
  const levelAsk = facts.level.source === 'session'
    ? 'level_evidence_en, level_evidence_ja (why this level, from the facts)'
    : 'level_evidence_en, level_evidence_ja (empty strings: the level is not described in this summary)';
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
      : facts.pronunciationArmed > 0
        ? [`- none measured (${facts.pronunciationArmed} sentence${facts.pronunciationArmed === 1 ? '' : 's'} practised, no score could be measured)`]
        : ['- none (not practised)']),
    'Transcript excerpt:',
    facts.transcriptExcerpt || '(empty)',
    '',
    `Reply with JSON fields: ${levelAsk}, grammar_en, grammar_ja (one observation on the learner\'s grammar), pronunciation_comment_en, pronunciation_comment_ja (on the measured scores only; with none measured, one short sentence that says so), recommendations (3 to 5 objects {en, ja}: concrete next steps).`,
  ];
  return { system, user: lines.join('\n') };
}

function okStr(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}
function okStrOrEmpty(v: unknown): v is string {
  return typeof v === 'string';
}
/** An over-long field is clipped at the last sentence end inside the cap, never rejected: one verbose field must not cost the whole summary. */
export function clipField(v: string): string {
  if (v.length <= MAX_FIELD) return v;
  const head = v.slice(0, MAX_FIELD);
  const cut = Math.max(head.lastIndexOf('. '), head.lastIndexOf('。'), head.lastIndexOf('! '), head.lastIndexOf('? '));
  return cut > MAX_FIELD / 3 ? head.slice(0, cut + 1).trimEnd() : `${head.slice(0, MAX_FIELD - 1).trimEnd()}…`;
}

/**
 * `opts.supportLanguage`: when set, every `_ja` line must be non-empty; when
 * absent/null, `_ja` lines may be empty. `opts.levelSource`: level evidence is
 * required only for a session-set level (other sources use fixed text).
 */
export function validateModelReply(
  reply: unknown,
  opts: { supportLanguage?: string | null; levelSource?: SessionFacts['level']['source'] } = {},
): ModelReply | null {
  if (!reply || typeof reply !== 'object' || Array.isArray(reply)) return null;
  const r = reply as Record<string, unknown>;
  const ja = opts.supportLanguage ? okStr : okStrOrEmpty;
  const levelEn = opts.levelSource && opts.levelSource !== 'session' ? okStrOrEmpty : okStr;
  const levelJa = opts.levelSource && opts.levelSource !== 'session' ? okStrOrEmpty : ja;
  if (!levelEn(r.level_evidence_en) || !levelJa(r.level_evidence_ja)) return null;
  for (const k of ['grammar_en', 'pronunciation_comment_en']) if (!okStr(r[k])) return null;
  for (const k of ['grammar_ja', 'pronunciation_comment_ja']) if (!ja(r[k])) return null;
  const recs = r.recommendations;
  if (!Array.isArray(recs) || recs.length < 3 || recs.length > 5) return null;
  const out: Array<{ en: string; ja: string }> = [];
  for (const x of recs) {
    const o = x as Record<string, unknown> | null;
    if (!o || !okStr(o.en) || !ja(o.ja)) return null;
    out.push({ en: o.en as string, ja: o.ja as string });
  }
  const c = (v: unknown) => clipField(v as string);
  return {
    level_evidence_en: c(r.level_evidence_en), level_evidence_ja: c(r.level_evidence_ja),
    grammar_en: c(r.grammar_en), grammar_ja: c(r.grammar_ja),
    pronunciation_comment_en: c(r.pronunciation_comment_en), pronunciation_comment_ja: c(r.pronunciation_comment_ja),
    recommendations: out.map((x) => ({ en: c(x.en), ja: c(x.ja) })),
  };
}

export function assembleSummary(
  facts: SessionFacts,
  reply: ModelReply | null,
  meta: { model: string; turnCount: number; now?: Date },
): LearnerSummaryV1 {
  if (!reply) throw new Error('assembleSummary: reply is not valid');
  const practised = facts.pronunciation.length > 0;
  const sl = facts.supportLanguage;
  // No support language: every support-language line is empty, whatever the model wrote.
  const j = (s: string) => (sl ? s : '');
  const level = { ...facts.level };
  if (level.source === 'session') { level.evidence_en = reply.level_evidence_en; level.evidence_ja = j(reply.level_evidence_ja); }
  else if (level.source === 'profile') { /* fixed, dated text from buildSessionFacts */ }
  else { level.evidence_en = LEVEL_NONE_EN; level.evidence_ja = fixedSupportLine(sl, LEVEL_NONE_JA); }
  return {
    version: 1,
    generated_at: (meta.now ?? new Date()).toISOString(),
    model: meta.model,
    turn_count: meta.turnCount,
    level,
    assessment: {
      grammar_en: reply.grammar_en, grammar_ja: j(reply.grammar_ja),
      corrections: facts.corrections.map((c) => ({ ...c })),
      pronunciation: {
        practised: facts.pronunciation.map((p) => ({ ...p, weak: [...p.weak] })),
        // W9-B4: armed but unmeasured ⇒ the fixed "practised, no score" line (the model's comment is used only for measured scores).
        comment_en: practised ? reply.pronunciation_comment_en : facts.pronunciationArmed > 0 ? practisedUnmeasuredEn(facts.pronunciationArmed) : NOT_PRACTISED_EN,
        comment_ja: practised ? j(reply.pronunciation_comment_ja) : fixedSupportLine(sl, facts.pronunciationArmed > 0 ? practisedUnmeasuredJa(facts.pronunciationArmed) : NOT_PRACTISED_JA),
      },
    },
    recommendations: reply.recommendations.map((x) => ({ en: x.en, ja: j(x.ja) })),
  };
}

/** One log line describing a rejected reply: keys, string lengths, recommendation count — no learner text. */
function describeReply(raw: unknown): string {
  if (!raw || typeof raw !== 'object') return `type=${raw === null ? 'null' : typeof raw}`;
  const r = raw as Record<string, unknown>;
  const parts = Object.entries(r).map(([k, v]) => Array.isArray(v) ? `${k}[${v.length}]` : typeof v === 'string' ? `${k}:${v.length}` : `${k}:${typeof v}`);
  return parts.join(' ');
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
      const raw = await deps.callJson(system, u, LEARNER_SUMMARY_SCHEMA);
      const valid = validateModelReply(raw, { supportLanguage: facts.supportLanguage, levelSource: facts.level.source });
      if (valid) return { ok: true, summary: assembleSummary(facts, valid, { model: deps.model, turnCount: deps.turnCount, now: deps.now }) };
      lastError = 'invalid reply';
      console.warn(`[learner-summary] invalid reply: ${describeReply(raw)}`);
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  return { ok: false, error: lastError };
}
