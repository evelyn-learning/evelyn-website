/**
 * End-of-session summary generator.
 *
 * Produces a single short narrative recap of what the session covered.
 * Persisted on SessionMemory.summary and rendered into the brain's
 * profile block in future sessions for callbacks.
 *
 * Topic-notes generation (theory / methods / pointers) is a separate
 * feature — see project_topic_notes_initiative.md and the live
 * tool-driven flow under src/lib/tutor/topic-notes/.
 *
 * Runs ASYNCHRONOUSLY after `endSession` — the student doesn't wait.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { GradeBand } from '@/lib/tutor/pedagogy/grade-profile';
import { getGradeProfile } from '@/lib/tutor/pedagogy/grade-profile';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface SessionSummaryInput {
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

const SUMMARY_MODEL = process.env.NOTES_MODEL || 'claude-haiku-4-5-20251001';

const SYSTEM = `You produce one-paragraph plain-text recaps of tutoring sessions. Calibrate vocabulary to the student's grade band (named in the user message). Stay within what the transcript shows — don't invent or extrapolate. Output the paragraph and nothing else: no markdown, no quotes, no headings, no preamble.`;

export async function generateSessionSummary(input: SessionSummaryInput): Promise<string> {
  const profile = getGradeProfile(input.grade);
  const userMessage = buildUserMessage(input, profile.band);
  const response = await anthropic.messages.create({
    model: SUMMARY_MODEL,
    max_tokens: 500,
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessage }],
  });
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim();
  return text || '(no summary)';
}

function buildUserMessage(input: SessionSummaryInput, gradeBand: GradeBand): string {
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
  lines.push(``, `Produce the recap paragraph.`);
  return lines.join('\n');
}
