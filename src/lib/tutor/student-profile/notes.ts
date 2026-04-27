/**
 * End-of-session note generator.
 *
 * Three artifacts produced from a finished session:
 *   - Theory note     — main concepts, formulas, brief idea (1 page)
 *   - Methods note    — solving approaches with worked examples (~2 pages)
 *   - Cheat sheet     — short / medium / complete printable summary
 *
 * Implementation: a small Claude call (Haiku for speed/cost; Sonnet
 * fallback when complex) with a structured-output prompt seeded by the
 * session transcript + the lesson plan (when one was active) + the
 * student's grade band so vocabulary matches.
 *
 * Runs ASYNCHRONOUSLY after `endSession` — the student doesn't wait.
 * Result is persisted on the SessionMemory under `summary` + saved as
 * a separate Notes document for retrieval.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { GradeBand } from '@/lib/tutor/pedagogy/grade-profile';
import { getGradeProfile } from '@/lib/tutor/pedagogy/grade-profile';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type CheatSheetSize = 'short' | 'medium' | 'complete';

export interface SessionNotesInput {
  /** Full transcript of the session (student + tutor turns). */
  transcript: Array<{ role: 'student' | 'tutor'; text: string }>;
  /** Lesson plan that drove the session, when applicable. */
  lessonPlan?: LessonPlan | null;
  /** Subject / topic / grade for fallback context when no plan. */
  subject?: string;
  topic?: string;
  grade?: string;
  /** LOs the brain marked as touched. */
  losTouched?: string[];
}

export interface SessionNotes {
  /** One-paragraph plain-text recap of what was covered. */
  summary: string;
  /** Theory note — concepts + formulas + brief intuition. Markdown. */
  theory: string;
  /** Methods note — approaches with worked examples. Markdown. */
  methods: string;
  /** Cheat sheets at three sizes. Markdown each. */
  cheatSheet: Record<CheatSheetSize, string>;
}

const NOTES_MODEL = process.env.NOTES_MODEL || 'claude-haiku-4-5-20251001';

const SYSTEM = `You are a study-notes generator. Given a tutoring session transcript plus optional lesson-plan context, produce a JSON document with these exact fields:

  {
    "summary":   "<1-paragraph recap, plain text>",
    "theory":    "<markdown — main concepts, formulas, brief intuition>",
    "methods":   "<markdown — solving methods with one short worked example each>",
    "cheatSheet": {
      "short":    "<markdown — 5-8 bullet lines, the absolute minimum>",
      "medium":   "<markdown — half-page, formulas + key steps>",
      "complete": "<markdown — 1 page, every formula + every method>"
    }
  }

Calibrate vocabulary and depth to the student's grade band (named in the user message). For K-2, use very short sentences and pictures-of-words; for 9-12, formal notation is fine. Stay within the LOs covered in the transcript — don't go off-topic. Each section is a STANDALONE document the student should be able to read without the others.

Return strictly valid JSON. No prose around it.`;

export async function generateSessionNotes(input: SessionNotesInput): Promise<SessionNotes> {
  const profile = getGradeProfile(input.grade);
  const userMessage = buildUserMessage(input, profile.band);
  const response = await anthropic.messages.create({
    model: NOTES_MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessage }],
  });
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('');
  // Tolerate Claude wrapping JSON in code fences.
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  let parsed: SessionNotes;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`generateSessionNotes: model returned non-JSON: ${(err as Error).message}\n--- output ---\n${text.slice(0, 400)}`);
  }
  // Defensive: ensure all fields exist.
  return {
    summary: parsed.summary || '(no summary)',
    theory: parsed.theory || '',
    methods: parsed.methods || '',
    cheatSheet: {
      short: parsed.cheatSheet?.short || '',
      medium: parsed.cheatSheet?.medium || '',
      complete: parsed.cheatSheet?.complete || '',
    },
  };
}

function buildUserMessage(input: SessionNotesInput, gradeBand: GradeBand): string {
  const lines: string[] = [];
  lines.push(`Student grade band: ${gradeBand}.`);
  if (input.subject) lines.push(`Subject: ${input.subject}.`);
  if (input.topic) lines.push(`Topic: ${input.topic}.`);
  if (input.lessonPlan) {
    lines.push(``, `Lesson plan that drove this session:`);
    lines.push(`  Title: ${input.lessonPlan.title}`);
    lines.push(`  LOs:`);
    for (const lo of input.lessonPlan.los) {
      lines.push(`    - ${lo.description} (${lo.id})`);
    }
  }
  if (input.losTouched?.length) {
    lines.push(``, `LOs the tutor marked as touched: ${input.losTouched.join(', ')}.`);
  }
  lines.push(``, `--- transcript begin ---`);
  for (const t of input.transcript) {
    lines.push(`${t.role === 'tutor' ? 'TUTOR' : 'STUDENT'}: ${t.text}`);
  }
  lines.push(`--- transcript end ---`);
  lines.push(``, `Produce the JSON document.`);
  return lines.join('\n');
}
