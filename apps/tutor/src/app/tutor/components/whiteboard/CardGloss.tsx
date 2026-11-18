/**
 * Task 7p: the line in the learner's language under a question card or a rule note of a spoken language lesson (tutor brain
 * v2, lib/tutor/v2/card-gloss.ts), drawn as the sentence card draws its gloss (WhiteboardCanvas SentenceCard). `of` is the
 * board command (an annotate command carries `gloss`; a showProblem command's problem does): one without a gloss draws nothing,
 * so every other card renders as before.
 */
export function cardGlossOf(of: unknown): string {
  const c = (of ?? {}) as { gloss?: unknown; problem?: { gloss?: unknown } };
  const g = c.gloss ?? c.problem?.gloss;
  return typeof g === 'string' ? g.trim() : '';
}

export function CardGloss({ of }: { of: unknown }) {
  const text = cardGlossOf(of);
  return text ? <p className="text-sm text-gray-500 mt-1 break-words" data-feature="gloss">{text}</p> : null;
}
