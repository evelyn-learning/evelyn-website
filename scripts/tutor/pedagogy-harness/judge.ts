/**
 * Task H5 (Layer 2) — Sonnet advisory rubric judge over a captured
 * pedagogy-harness `Bundle` (Task H4, ./run-harness). Mirrors
 * scripts/tutor-render-harness/judge.ts's Anthropic usage (same model,
 * same loadApiKey/Anthropic-SDK pattern) and reuses `CompleteFn` from the
 * Haiku student-simulator (Task H3, ./student-simulator) since it's the
 * exact same "(system, messages) -> text" shape.
 *
 * ADVISORY, never a killer (matching the codebase's "judge is advisory, not
 * a killer" stance — see feedback_generic_prompts / round7 architecture
 * memory): `judgeBundle` never throws on low scores. `flagged` is just the
 * scores under 4/5, for a human to read in the report.
 *
 * The LLM call is injectable via `opts.complete` — default is real Sonnet
 * (claude-sonnet-4-6); tests inject a stub so the default suite
 * (npm run test:pedagogy-gates) makes NO network call.
 */
import Anthropic from '@anthropic-ai/sdk';
import { loadApiKey } from '../../tutor-e2e/llm';
import type { CompleteFn } from './student-simulator';
import type { Bundle } from './run-harness';

export type RubricItem = { id: string; question: string };
/** score is 1..5. */
export type JudgeScore = { id: string; score: number; rationale: string };
/** flagged = scores < 4. */
export type JudgeResult = { scores: JudgeScore[]; flagged: JudgeScore[] };

/** Same Sonnet id used elsewhere in this codebase's harnesses (tutor-e2e's
 *  llm.ts, tutor-render-harness's vision judge). */
export const PEDAGOGY_JUDGE_MODEL_ID = 'claude-sonnet-4-6';

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: loadApiKey() });
  return client;
}

/** Default `complete`: one real Sonnet call. */
const realSonnetComplete: CompleteFn = async (system, messages) => {
  const msg = await getClient().messages.create({
    model: PEDAGOGY_JUDGE_MODEL_ID,
    max_tokens: 1200,
    system,
    messages,
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
};

const SYSTEM = `You are a strict but fair pedagogy reviewer for an AI voice tutor. You are given a transcript of one tutoring session turn-by-turn (tutor then student) and a rubric of yes/no-ish quality questions. Score EACH rubric item 1-5 (1 = clearly fails, 5 = excellent) based ONLY on what the transcript actually shows — do not assume anything not present.

Respond with ONLY a JSON array, no prose, no markdown fences: [{"id": "<rubric item id>", "score": <1-5 integer>, "rationale": "<one short sentence>"}, ...] — exactly one entry per rubric item, in the order given.`;

/** Renders the Bundle's turns + the rubric into the judge's user message. */
function buildPrompt(bundle: Bundle, rubric: RubricItem[]): string {
  const transcript = bundle.turns.length
    ? bundle.turns
        .map((t) => `Turn ${t.index}:\nTutor: ${t.tutorText}\nStudent: ${t.studentReply || '(no reply)'}`)
        .join('\n\n')
    : '(no turns captured)';

  const rubricBlock = rubric.map((r) => `- ${r.id}: ${r.question}`).join('\n');

  return `Persona: ${bundle.persona.id} (${bundle.persona.mode})\n\nTranscript:\n${transcript}\n\nRubric:\n${rubricBlock}`;
}

/** Best-effort parse of the judge's reply into `JudgeScore[]`. Never
 *  throws — an unparseable reply just yields no scores (advisory: the
 *  worst case is "nothing to report", not a crash). */
function parseScores(raw: string): JudgeScore[] {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is JudgeScore => typeof s?.id === 'string' && typeof s?.score === 'number')
      .map((s) => ({ id: s.id, score: s.score, rationale: typeof s.rationale === 'string' ? s.rationale : '' }));
  } catch {
    return [];
  }
}

/**
 * Layer-2 advisory judge: scores `bundle` against `rubric` (1-5 each) via
 * Sonnet (or the injected stub). Never throws on low scores — `flagged` is
 * simply the subset scored < 4, for a human to read alongside the L1 gates
 * in the report.
 */
export async function judgeBundle(
  bundle: Bundle,
  rubric: RubricItem[],
  opts?: { complete?: CompleteFn },
): Promise<JudgeResult> {
  const complete = opts?.complete ?? realSonnetComplete;
  const prompt = buildPrompt(bundle, rubric);
  const raw = await complete(SYSTEM, [{ role: 'user', content: prompt }]);
  const scores = parseScores(raw);
  const flagged = scores.filter((s) => s.score < 4);
  return { scores, flagged };
}
