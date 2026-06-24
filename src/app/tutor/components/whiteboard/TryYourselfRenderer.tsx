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
import { stripRedundantChoiceLabel } from './choiceLabel';

/** Compare a student's typed answer against the expected answer with
 *  format-aware tolerance:
 *  - numeric: parse both sides as numbers; "024" matches "24", "0.5" matches "1/2".
 *  - mcq: case-insensitive, trim, collapse internal whitespace.
 *  - frq: returns TRISTATE — true (string-equal after normalization),
 *    false (numeric mismatch only), or null (undecidable; defer to the
 *    brain). String mismatches in FRQ space are too unreliable to assert
 *    "wrong" — students write "sin" when expected is "sin(θ)", "1/√2"
 *    when expected is "√2/2", etc. The brain reads the marker and
 *    judges algebraic equivalence.
 *
 *  Returning null in the FRQ branch keeps the renderer from showing
 *  "Not quite. Expected: X" when the answer is plausibly correct in a
 *  different form.
 */
export function matchesAnswerStrict(submitted: string, expected: string, format: 'mcq' | 'frq' | 'numeric' | undefined): boolean | null {
  const s = submitted.trim();
  const e = expected.trim();
  if (!s || !e) return null;
  // Numeric path: try to parse and compare values, including simple fractions.
  const tryParse = (v: string): number | null => {
    const cleaned = v.replace(/,/g, '').replace(/\s+/g, '');
    if (cleaned === '') return null;
    const frac = cleaned.match(/^(-?\d+)\/(-?\d+)$/);
    if (frac) {
      const num = Number(frac[1]);
      const den = Number(frac[2]);
      if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) return num / den;
      return null;
    }
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };
  const sn = tryParse(s);
  const en = tryParse(e);
  if (sn !== null && en !== null) {
    return Math.abs(sn - en) < 1e-9;
  }
  const norm = (v: string) =>
    v.toLowerCase()
      .replace(/^[a-z]\s*=\s*/, '')
      .replace(/\s+/g, ' ')
      .trim();
  if (format === 'numeric') {
    // Format said numeric but parsing failed — strict string equality.
    return norm(s) === norm(e);
  }
  if (format === 'mcq') {
    return norm(s) === norm(e);
  }
  // FRQ: only assert TRUE on exact normalized match; otherwise undecidable.
  if (norm(s) === norm(e)) return true;
  return null;
}

interface Choice {
  id: string;
  text: string;
  correct?: boolean;
}

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

  const isCorrect = submitted && expectedAnswer
    ? matchesAnswerStrict(submitted, expectedAnswer, responseFormat)
    : null;

  return (
    <div className="my-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg max-w-xl">
      <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
        {title}
      </div>
      <div className="text-base text-gray-900 mb-3">{problem}</div>

      {responseFormat === 'mcq' && choices.length > 0 ? (
        <div className="space-y-2">
          {choices.map((c) => {
            const isPick = submitted === c.id || submitted === c.text;
            const correctMark = submitted ? (c.correct ? '✓' : (isPick ? '✗' : '')) : '';
            return (
              <button
                key={c.id}
                disabled={!!submitted}
                onClick={() => submit(c.id)}
                className={`block w-full text-left px-3 py-2 rounded border transition ${
                  submitted
                    ? c.correct
                      ? 'bg-green-50 border-green-400'
                      : isPick
                      ? 'bg-red-50 border-red-400'
                      : 'bg-white border-gray-200 opacity-60'
                    : 'bg-white border-gray-300 hover:bg-amber-100 hover:border-amber-400'
                }`}
              >
                <span className="font-mono mr-2 text-amber-700">{c.id}.</span>
                {stripRedundantChoiceLabel(c.text, c.id)}
                {correctMark && <span className="ml-2 font-bold">{correctMark}</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type={responseFormat === 'numeric' ? 'number' : 'text'}
            value={text}
            disabled={!!submitted}
            placeholder="Type your answer…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit(text);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:bg-gray-100"
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
                <div key={i} className="text-gray-700 italic">💡 {h}</div>
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
      {submitted && expectedAnswer != null && (
        <div className={`mt-3 text-sm font-medium ${
          isCorrect === true ? 'text-green-700'
          : isCorrect === false ? 'text-red-700'
          : 'text-gray-600'
        }`}>
          {isCorrect === true ? '✓ Correct!'
          : isCorrect === false ? `Not quite. Expected: ${expectedAnswer}`
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
