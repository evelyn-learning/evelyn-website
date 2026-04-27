'use client';

/**
 * QuizRenderer — small embedded quiz (1-5 items, mixed MCQ + FRQ).
 *
 * Different from show_problem (single problem card, brain-driven)
 * and show_try_yourself (mid-explanation hand-off). This is a
 * STANDALONE assessment the student works through on their own,
 * with auto-scoring for objective items. Used pedagogically at
 * end-of-segment / end-of-session to check retention before moving on.
 *
 * Item formats:
 *   mcq      multiple choice with one correct option
 *   frq      free response — student types; auto-scored if expected
 *            answer is provided (case-insensitive substring match)
 *   numeric  single number — exact match within tolerance
 *
 * The student works through items at their own pace; "Submit" reveals
 * a score + per-item feedback.
 */

import React, { useState } from 'react';

export interface QuizItem {
  id: string;
  question: string;
  format: 'mcq' | 'frq' | 'numeric';
  /** For mcq: the choices. Exactly one should be `correct: true`. */
  choices?: Array<{ id: string; text: string; correct?: boolean }>;
  /** For frq / numeric: expected answer. */
  expectedAnswer?: string;
  /** For numeric: optional tolerance (default 0.01). */
  tolerance?: number;
  /** Optional explanation shown after submit. */
  explanation?: string;
}

export interface QuizSpec {
  title?: string;
  items: QuizItem[];
  /** When true, items are graded immediately as the student answers
   *  (no Submit button). Default false. */
  immediate?: boolean;
}

export default function QuizRenderer({ spec }: { spec: QuizSpec }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? spec.items.reduce((s, item) => s + (gradeItem(item, answers[item.id]) ? 1 : 0), 0)
    : 0;

  return (
    <div className="quiz-renderer max-w-2xl border-2 border-purple-300 bg-purple-50 rounded-lg p-4 my-2">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold uppercase tracking-wider text-purple-700">
          {spec.title || 'Quick Quiz'} · {spec.items.length} item{spec.items.length === 1 ? '' : 's'}
        </div>
        {submitted && (
          <div className="text-sm font-bold text-purple-900">
            Score: {score} / {spec.items.length}
          </div>
        )}
      </div>

      <ol className="space-y-3">
        {spec.items.map((item, idx) => {
          const userAns = answers[item.id] ?? '';
          const correct = submitted ? gradeItem(item, userAns) : null;
          return (
            <li key={item.id} className="bg-white border border-purple-200 rounded p-3">
              <div className="flex gap-2 mb-2">
                <span className="font-mono text-purple-600 font-semibold flex-shrink-0">{idx + 1}.</span>
                <span className="text-sm text-gray-900">{item.question}</span>
              </div>
              {item.format === 'mcq' ? (
                <div className="space-y-1 ml-6">
                  {item.choices?.map((c) => {
                    const isPick = userAns === c.id;
                    const showResult = submitted;
                    return (
                      <button
                        key={c.id}
                        disabled={submitted}
                        onClick={() => setAnswers((a) => ({ ...a, [item.id]: c.id }))}
                        className={`block w-full text-left px-3 py-1.5 rounded border text-sm transition ${
                          showResult
                            ? c.correct
                              ? 'bg-green-50 border-green-400'
                              : isPick
                              ? 'bg-red-50 border-red-400'
                              : 'bg-white border-gray-200 opacity-60'
                            : isPick
                            ? 'bg-purple-100 border-purple-400'
                            : 'bg-white border-gray-300 hover:bg-purple-50'
                        }`}
                      >
                        <span className="font-mono mr-2 text-purple-700">{c.id}.</span>
                        {c.text}
                        {showResult && c.correct && <span className="ml-2 font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="ml-6">
                  <input
                    type={item.format === 'numeric' ? 'number' : 'text'}
                    value={userAns}
                    disabled={submitted}
                    onChange={(e) => setAnswers((a) => ({ ...a, [item.id]: e.target.value }))}
                    className="w-full max-w-sm px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-400 disabled:bg-gray-100"
                    placeholder="Type your answer…"
                  />
                </div>
              )}
              {submitted && (
                <div className={`mt-2 ml-6 text-xs ${correct ? 'text-green-700' : 'text-red-700'}`}>
                  {correct ? '✓ Correct.' : `✗ ${item.expectedAnswer ? `Expected: ${item.expectedAnswer}` : 'Not matched.'}`}
                  {item.explanation && <div className="text-gray-700 italic mt-0.5">— {item.explanation}</div>}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {!submitted && !spec.immediate && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded font-medium disabled:opacity-50 hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

function gradeItem(item: QuizItem, answer: string | undefined): boolean {
  if (!answer) return false;
  if (item.format === 'mcq') {
    const correct = item.choices?.find((c) => c.correct);
    return !!correct && correct.id === answer;
  }
  if (item.format === 'numeric') {
    const expected = parseFloat(item.expectedAnswer ?? '');
    const actual = parseFloat(answer);
    if (!Number.isFinite(expected) || !Number.isFinite(actual)) return false;
    return Math.abs(expected - actual) <= (item.tolerance ?? 0.01);
  }
  if (!item.expectedAnswer) return false;
  return answer.trim().toLowerCase().includes(item.expectedAnswer.trim().toLowerCase());
}
