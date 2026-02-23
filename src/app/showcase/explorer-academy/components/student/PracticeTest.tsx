'use client';

import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useExplorerStore } from '../../store';
import { PRACTICE_TEST_TOPICS } from '../../data/curriculum';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// ─── Types ───────────────────────────────────────────────────────────
interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

function InlineKatex({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, { throwOnError: false, displayMode: false, strict: false });
      } catch {
        ref.current.textContent = latex;
      }
    }
  }, [latex]);
  return <span ref={ref} />;
}

function MathText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineKatex key={i} latex={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

const SUBJECTS = ['Math', 'Science'];

export default function PracticeTest() {
  const { currentUser, navigate, recordTestScore, preSelectedTestTopic, setPreSelectedTestTopic } = useExplorerStore();
  const trackInteraction = useTrackInteraction();
  const grade = currentUser?.grade ?? 3;
  const gradeLabel = `Grade ${grade}`;

  const topicMap = PRACTICE_TEST_TOPICS[grade] || {};
  const [subject, setSubject] = useState('Math');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testsGenerated, setTestsGenerated] = useState(0);

  const availableTopics = topicMap[subject] || [];

  // Handle pre-selected topic from assigned tests
  useEffect(() => {
    if (preSelectedTestTopic) {
      // Determine which subject this topic belongs to
      const mathTopics = topicMap['Math'] || [];
      const scienceTopics = topicMap['Science'] || [];
      if (mathTopics.includes(preSelectedTestTopic)) {
        setSubject('Math');
        setTopic(preSelectedTestTopic);
      } else if (scienceTopics.includes(preSelectedTestTopic)) {
        setSubject('Science');
        setTopic(preSelectedTestTopic);
      }
      setPreSelectedTestTopic(null);
    }
  }, [preSelectedTestTopic]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Only auto-set topic from subject change if no pre-selected topic was just applied
    if (!preSelectedTestTopic) {
      setTopic(availableTopics[0] || '');
    }
  }, [subject]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateTest = async () => {
    if (!topic) return;
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setError('');

    try {
      const res = await fetch('/api/showcase/explorer-academy/practice-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: gradeLabel, subject, topic }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate test');
      }
      const data = await res.json();
      setQuestions(data.questions);
      setTestsGenerated((c) => c + 1);
      trackInteraction('tool_use', 'generate_test', { subject, topic, questionCount: data.questions?.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitTest = () => {
    setSubmitted(true);
    const score = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    recordTestScore(topic, score);
    trackInteraction('tool_use', 'submit_test', { topic, score, total: questions.length });
  };

  const score = submitted ? questions.filter((q) => answers[q.id] === q.correctIndex).length : 0;
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  const difficultyColor = (d: string) => {
    if (d === 'easy') return 'bg-green-100 text-green-700';
    if (d === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate('student-home')}
        className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1 mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">Practice Test</h2>
          <p className="text-gray-600 text-sm mt-1">
            Generate unique practice tests for {gradeLabel} topics
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {availableTopics.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button
              onClick={generateTest}
              disabled={loading || !topic}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : questions.length > 0 ? 'Generate Another' : 'Generate Test'}
            </button>
          </div>

          {testsGenerated > 0 && (
            <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 rounded-lg px-4 py-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Every test is unique and curriculum-aligned
              {testsGenerated > 1 && <span className="font-semibold ml-1">({testsGenerated} generated)</span>}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {questions.length > 0 && (
            <div className="space-y-5">
              {questions.map((q, qi) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border-2 p-5 transition-all ${
                      submitted
                        ? isCorrect ? 'border-green-200 bg-green-50/50'
                          : userAnswer !== undefined ? 'border-red-200 bg-red-50/50' : 'border-gray-200'
                        : 'border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="font-semibold text-gray-800">
                        <span className="text-purple-500 mr-1">{qi + 1}.</span>{' '}
                        <MathText text={q.question} />
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = userAnswer === oi;
                        const isRight = q.correctIndex === oi;
                        let optionClass = 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer';
                        if (isSelected && !submitted) optionClass = 'border-purple-500 bg-purple-50 ring-2 ring-purple-200';
                        if (submitted && isRight) optionClass = 'border-green-500 bg-green-50';
                        if (submitted && isSelected && !isRight) optionClass = 'border-red-500 bg-red-50';

                        return (
                          <button
                            key={oi}
                            onClick={() => selectAnswer(q.id, oi)}
                            disabled={submitted}
                            className={`text-left px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${optionClass} ${submitted ? 'cursor-default' : ''}`}
                          >
                            <span className="font-semibold text-gray-400 mr-2">{String.fromCharCode(65 + oi)}.</span>
                            <MathText text={opt} />
                            {submitted && isRight && (
                              <svg className="inline w-4 h-4 text-green-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && userAnswer !== undefined && !isCorrect && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
                        <span className="font-semibold">Explanation: </span>
                        <MathText text={q.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}

              {!submitted ? (
                <div className="text-center">
                  <button
                    onClick={submitTest}
                    disabled={!allAnswered}
                    className="px-8 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answers
                  </button>
                  {!allAnswered && (
                    <p className="text-sm text-gray-400 mt-2">Answer all {questions.length} questions to submit</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl ${
                    score >= 4 ? 'bg-green-50 border-2 border-green-200' :
                    score >= 3 ? 'bg-yellow-50 border-2 border-yellow-200' :
                    'bg-red-50 border-2 border-red-200'
                  }`}>
                    <span className="text-4xl font-bold text-gray-900">{score}/{questions.length}</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        {score === 5 ? 'Perfect Score!' : score >= 4 ? 'Great Job!' : score >= 3 ? 'Good Effort!' : 'Keep Practicing!'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {score === 5 ? "You've mastered this topic!" : 'Review the explanations above.'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={generateTest}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                    >
                      Generate Another Test
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && questions.length === 0 && !error && (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Select a subject and topic, then click &quot;Generate Test&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
