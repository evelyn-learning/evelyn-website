'use client';

/**
 * TryYourselfRenderer
 *
 * "Your turn" card the brain emits mid-explanation. Pairs the problem
 * statement with an explicit answer surface (MCQ tap, free-response
 * input, or numeric box). When the student answers, the answer becomes
 * a synthetic student turn so the brain can react.
 *
 * The student can ALSO answer by scribbling on the whiteboard or
 * uploading a photo of their work — those paths flow through
 * /api/tutor/extract-homework as today; this card is just one of three
 * input modalities.
 *
 * Hints are revealed on demand (one at a time, escalating).
 */

import { useState } from 'react';
import { stripRedundantChoiceLabel, stripEmbeddedChoiceBlock } from './choiceLabel';
import { InlineMathText } from './InlineMathText';
import {
  matchesAnswerStrict,
  resolveMcqCorrectChoice,
  computeTryYourselfVerdict,
  type Choice,
} from './tryYourselfAnswer';

// matchesAnswerStrict / resolveMcqCorrectChoice / computeTryYourselfVerdict
// now live in ./tryYourselfAnswer.ts (a plain .ts module, importable from a
// bare `tsx` test run without pulling in InlineMathText's katex CSS import).
// Re-exported here for compatibility with any existing imports of this file.
export { matchesAnswerStrict };

interface TryYourselfRendererProps {
  title?: string;
  problem: string;
  responseFormat?: 'mcq' | 'frq' | 'numeric';
  choices?: Choice[];
  expectedAnswer?: string;
  hints?: string[];
  /** Called when the student commits an answer. Caller routes the text
   *  to the brain as a synthetic student turn. */
  onSubmit?: (answer: string) => void;
}

export function TryYourselfRenderer({
  title = 'Your turn',
  problem,
  responseFormat = 'frq',
  choices = [],
  expectedAnswer,
  hints = [],
  onSubmit,
}: TryYourselfRendererProps) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [hintIdx, setHintIdx] = useState(0);

  const submit = (answer: string) => {
    if (!answer.trim() || submitted) return;
    setSubmitted(answer.trim());
    onSubmit?.(answer.trim());
  };

  // The SAME resolved choice drives the row ✓ affordance, the verdict
  // text, and (via WhiteboardCanvas's onTryYourselfAnswer relay) what the
  // brain is told — see tryYourselfAnswer.ts for the bug this fixes.
  const mcqCorrectChoice = responseFormat === 'mcq' ? resolveMcqCorrectChoice(choices, expectedAnswer) : undefined;
  const isCorrect = submitted
    ? computeTryYourselfVerdict(submitted, expectedAnswer, responseFormat, choices)
    : null;
  // mcq can resolve a verdict purely from choices[].correct even when no
  // expectedAnswer text was authored; frq/numeric still require expectedAnswer.
  const hasVerdictSignal = responseFormat === 'mcq' ? (expectedAnswer != null || !!mcqCorrectChoice) : expectedAnswer != null;

  return (
    <div className="my-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg max-w-xl">
      <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
        <InlineMathText text={title} />
      </div>
      {/* overflow-x-auto (round-7 item 7): inline-math runs are unbreakable
          atoms — an oversized one scrolls instead of being clipped by the
          pane's overflow-x-hidden ancestor. */}
      <div className="text-base text-gray-900 mb-3 overflow-x-auto">
        <InlineMathText text={stripEmbeddedChoiceBlock(problem, choices.map((c) => ({ letter: c.id, text: c.text })))} />
      </div>

      {responseFormat === 'mcq' && choices.length > 0 ? (
        <div className="space-y-2">
          {choices.map((c) => {
            const isPick = submitted === c.id || submitted === c.text;
            // Mark the row using the SAME resolved choice as the verdict
            // text below — not the raw per-choice `c.correct` flag, which
            // can be absent while resolveMcqCorrectChoice still infers the
            // correct option from expectedAnswer.
            const isMarkedCorrect = !!mcqCorrectChoice && mcqCorrectChoice.id === c.id;
            const correctMark = submitted ? (isMarkedCorrect ? '✓' : (isPick ? '✗' : '')) : '';
            return (
              <button
                key={c.id}
                disabled={!!submitted}
                onClick={() => submit(c.id)}
                className={`block w-full text-left px-3 py-2 rounded border transition ${
                  submitted
                    ? isMarkedCorrect
                      ? 'bg-green-50 border-green-400'
                      : isPick
                      ? 'bg-red-50 border-red-400'
                      : 'bg-white border-gray-200 opacity-60'
                    : 'bg-white border-gray-300 hover:bg-amber-100 hover:border-amber-400'
                }`}
              >
                <span className="font-mono mr-2 text-amber-700">{c.id}.</span>
                <InlineMathText text={stripRedundantChoiceLabel(c.text, c.id)} />
                {correctMark && <span className="ml-2 font-bold">{correctMark}</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-2">
          {/* min-w-0: a flex <input> refuses to shrink below its intrinsic
              ~170px without it, which pushed the Submit button clean out of
              the card on phones (round-6e, IMG_7868). */}
          <input
            type={responseFormat === 'numeric' ? 'number' : 'text'}
            value={text}
            disabled={!!submitted}
            placeholder="Type your answer…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit(text);
            }}
            className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:bg-gray-100"
          />
          <button
            disabled={!!submitted || !text.trim()}
            onClick={() => submit(text)}
            className="px-4 py-2 bg-amber-600 text-white rounded font-medium disabled:opacity-50 hover:bg-amber-700"
          >
            Submit
          </button>
        </div>
      )}

      {/* Hints — escalating reveals */}
      {hints.length > 0 && !submitted && (
        <div className="mt-3 text-sm">
          {hintIdx > 0 && (
            <div className="space-y-1 mb-2">
              {hints.slice(0, hintIdx).map((h, i) => (
                <div key={i} className="text-gray-700 italic">💡 <InlineMathText text={h} /></div>
              ))}
            </div>
          )}
          {hintIdx < hints.length && (
            <button
              onClick={() => setHintIdx((i) => i + 1)}
              className="text-amber-700 hover:text-amber-900 underline text-xs"
            >
              {hintIdx === 0 ? 'Need a hint?' : 'Another hint…'}
            </button>
          )}
        </div>
      )}

      {/* Result indicator. When isCorrect is null (FRQ string mismatch
          or no expected answer), don't assert wrong/right — show a
          neutral "submitted, the tutor will respond" hint and defer to
          the brain. */}
      {submitted && hasVerdictSignal && (
        <div className={`mt-3 text-sm font-medium ${
          isCorrect === true ? 'text-green-700'
          : isCorrect === false ? 'text-red-700'
          : 'text-gray-600'
        }`}>
          {isCorrect === true ? '✓ Correct!'
          : isCorrect === false ? <>Not quite. Expected: <InlineMathText text={mcqCorrectChoice?.text ?? expectedAnswer ?? ''} /></>
          : 'Submitted — the tutor is reviewing your answer.'}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        You can also write your work on the whiteboard or upload a picture.
      </div>
    </div>
  );
}

export default TryYourselfRenderer;
