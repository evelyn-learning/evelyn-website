/**
 * GAC review 2026-10-27 (Biology, 27 Oct transcripts): "maybe it binds in the
 * active site itself and blocks the substrate" — what part (b) asks ("what
 * does a competitive inhibitor do to the active site?") — was checked
 * partly_correct at medium confidence, because the key's statement also says
 * the inhibitor mimics the substrate. The part was never recorded and the
 * problem ended "Needs review". The general answer check judges against its
 * own working; this one compares the student's words with the build's agreed
 * statement for that part and with the part's own question, so a detail the
 * question did not ask for is not held against the student.
 *
 * Used only for a prose key part (AnswerPart.prose) when the general check
 * found nothing wrong but did not say correct with high confidence. It only
 * ever confirms; a "no" or a failure leaves the general check's finding.
 */

import type Anthropic from '@anthropic-ai/sdk';
import { getModelClient, prepareParams } from '../ai/model-registry';

export const PROSE_ANSWER_MATCH_SYSTEM =
  'You check one student answer to one part of a homework problem. You get the problem, the part, the answer key\'s statement for that part, and the student\'s message. '
  + 'Decide whether the message states, correctly, what the part as written asks for. '
  + 'The key\'s statement may add detail the part does not ask for (a cause, a reason, a name or a mechanism behind the answer): a message that leaves out only such detail still answers the part. '
  + 'Wording, order, a hedge ("maybe", "I think") and a missing technical term do not count against it. '
  + 'It does not answer the part when it says something false about the problem, when it answers a different question, or when it leaves out something the part explicitly asks for. '
  + 'Answer only from the message: never complete it with what the student might have meant.';

export const PROSE_ANSWER_MATCH_SCHEMA = {
  type: 'object',
  properties: { answers_part: { type: 'boolean' }, false_claim: { type: 'boolean' } },
  required: ['answers_part', 'false_claim'],
  additionalProperties: false,
} as const;

export const PROSE_ANSWER_MATCH_TIMEOUT_MS = 6_000;

export interface ProseAnswerMatchRequest {
  problem: string;
  label: string;
  keyStatement: string;
  studentMessage: string;
}

export type ProseAnswerMatchFn = (req: ProseAnswerMatchRequest) => Promise<boolean | null>;

export function proseAnswerMatchPrompt(req: ProseAnswerMatchRequest): string {
  return `Problem:\n${req.problem.slice(0, 4000)}\n\nPart: ${req.label || '(the whole problem)'}\n\n`
    + `Answer key statement for this part:\n${req.keyStatement.slice(0, 600)}\n\nStudent's message:\n${req.studentMessage.slice(0, 1500)}`;
}

/** True: the message answers the part. False: it does not. Null: no usable reply in time. */
export const proseAnswerMatches: ProseAnswerMatchFn = async (req) => {
  try {
    const { client, model } = getModelClient('content-verify');
    const params = prepareParams('content-verify', {
      model,
      max_tokens: 400,
      system: PROSE_ANSWER_MATCH_SYSTEM,
      messages: [{ role: 'user', content: proseAnswerMatchPrompt(req) }],
      output_config: { effort: 'low', format: { type: 'json_schema', schema: PROSE_ANSWER_MATCH_SCHEMA } },
    });
    const msg = await client.messages.create(params as unknown as Anthropic.MessageCreateParamsNonStreaming, { timeout: PROSE_ANSWER_MATCH_TIMEOUT_MS, maxRetries: 0 });
    if (msg.stop_reason === 'max_tokens' || msg.stop_reason === 'refusal') return null;
    const raw = msg.content.filter((b) => b.type === 'text').map((b) => (b as Anthropic.TextBlock).text).join('');
    const json = JSON.parse(raw.trim()) as { answers_part?: unknown; false_claim?: unknown };
    if (typeof json.answers_part !== 'boolean') return null;
    return json.answers_part === true && json.false_claim !== true;
  } catch {
    return null;
  }
};
