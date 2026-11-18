/**
 * Task 7p: the line in the learner's language under a question card or a rule note of a spoken language lesson (tutor brain
 * v2, lib/tutor/v2/card-gloss.ts), drawn as the sentence card draws its gloss (WhiteboardCanvas SentenceCard). Only a card that
 * carries a gloss shows one; every other card renders as before.
 */
export function CardGloss({ text }: { text: string }) {
  return <p className="text-sm text-gray-500 mt-1 break-words" data-feature="gloss">{text}</p>;
}
