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

import { getModelClient } from '../ai/model-registry';
import type { LessonPlan } from '@/lib/tutor/lesson-plan/types';
import type { GradeBand } from '@/lib/tutor/pedagogy/grade-profile';
import { getGradeProfile } from '@/lib/tutor/pedagogy/grade-profile';
import type { PlanContentFillings } from './types';

const { client: anthropic, model: SUMMARY_MODEL } = getModelClient('recap');

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

// SUMMARY_MODEL resolves above via the model-registry (role 'recap');
// the legacy NOTES_MODEL env var still works as an alias.

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

const FILLINGS_SYSTEM = `You produce a JSON object with two fields describing a tutoring session. "summary": a one-paragraph plain-text recap (grade-calibrated, only what the transcript shows, no markdown). "fillings": { "hooks": string[], "examples": string[], "problems": string[] } — SHORT descriptors (≤8 words each) of the specific opening hook/story, the worked-example contexts, and the practice-problem statements ACTUALLY USED this session. Empty arrays if none. Output ONLY the JSON object, no fences, no preamble.`;

/** Session recap. Default = the plain summary string wrapped in the object
 *  (fillings null), one LLM call. With extractFillings, the SAME single call
 *  also returns the fillings-used (content variety phase 1). Parse failures
 *  degrade to { summary, fillings: null } — capture never breaks a commit. */
export async function generateSessionRecap(
  input: SessionSummaryInput,
  opts?: { extractFillings?: boolean },
): Promise<{ summary: string; fillings: PlanContentFillings | null }> {
  if (!opts?.extractFillings) {
    return { summary: await generateSessionSummary(input), fillings: null };
  }
  const profile = getGradeProfile(input.grade);
  const userMessage = buildUserMessage(input, profile.band);
  const response = await anthropic.messages.create({
    model: SUMMARY_MODEL,
    max_tokens: 700,
    system: FILLINGS_SYSTEM,
    messages: [{ role: 'user', content: userMessage }],
  });
  const raw = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim();
  try {
    const parsed = JSON.parse(raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim());
    const arr = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((s) => s.slice(0, 80)) : [];
    return {
      summary: (typeof parsed.summary === 'string' && parsed.summary.trim()) || '(no summary)',
      fillings: {
        hooks: arr(parsed.fillings?.hooks),
        examples: arr(parsed.fillings?.examples),
        problems: arr(parsed.fillings?.problems),
      },
    };
  } catch {
    return { summary: '(no summary)', fillings: null };
  }
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
