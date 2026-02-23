'use client';

import React, { useState, useCallback } from 'react';
import { useExplorerStore } from '../../store';
import { MathDisplay, MathText } from '../shared/FormattedText';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// ─── Types ───────────────────────────────────────────────────────────
interface MathStep {
  step: number;
  title: string;
  expression: string;
  explanation: string;
}

interface Solution {
  steps: MathStep[];
  finalAnswer: string;
  encouragement: string;
}

interface SampleProblem {
  grade: string;
  title: string;
  problem: string;
  latex: string;
  solution: Solution;
}

// ─── Grade-specific sample problems ─────────────────────────────────
const SAMPLE_PROBLEMS_3: SampleProblem[] = [
  {
    grade: 'Grade 3',
    title: 'Adding Fractions',
    problem: 'What is 2/3 + 1/4?',
    latex: '\\frac{2}{3} + \\frac{1}{4}',
    solution: {
      steps: [
        { step: 1, title: 'Find a common denominator', expression: '\\text{LCD of } 3 \\text{ and } 4 = 12', explanation: "To add fractions, we need the same denominator. The smallest number both 3 and 4 divide into is 12!" },
        { step: 2, title: 'Convert the first fraction', expression: '\\frac{2}{3} = \\frac{2 \\times 4}{3 \\times 4} = \\frac{8}{12}', explanation: "We multiply top and bottom of 2/3 by 4." },
        { step: 3, title: 'Convert the second fraction', expression: '\\frac{1}{4} = \\frac{1 \\times 3}{4 \\times 3} = \\frac{3}{12}', explanation: "We multiply top and bottom of 1/4 by 3." },
        { step: 4, title: 'Add the numerators', expression: '\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}', explanation: "Now add the top numbers and keep the denominator the same." },
      ],
      finalAnswer: '\\frac{11}{12}',
      encouragement: 'Excellent work! You just added fractions with unlike denominators!',
    },
  },
  {
    grade: 'Grade 3',
    title: 'Multiplication',
    problem: 'What is 7 x 8?',
    latex: '7 \\times 8',
    solution: {
      steps: [
        { step: 1, title: 'Break it down', expression: '7 \\times 8 = 7 \\times (5 + 3)', explanation: "Let's split 8 into 5 + 3 to make it easier!" },
        { step: 2, title: 'Multiply each part', expression: '7 \\times 5 = 35 \\quad \\text{and} \\quad 7 \\times 3 = 21', explanation: "Multiply 7 by each part separately." },
        { step: 3, title: 'Add the results', expression: '35 + 21 = 56', explanation: "Now just add them together!" },
      ],
      finalAnswer: '56',
      encouragement: 'Great job! Breaking problems into smaller parts is a super strategy!',
    },
  },
];

const SAMPLE_PROBLEMS_6: SampleProblem[] = [
  {
    grade: 'Grade 6',
    title: 'Ratios & Proportions',
    problem: 'If the ratio of boys to girls is 3:5 and there are 24 students total, how many are girls?',
    latex: '\\text{boys : girls} = 3 : 5, \\quad \\text{total} = 24',
    solution: {
      steps: [
        { step: 1, title: 'Find total parts', expression: '3 + 5 = 8 \\text{ parts}', explanation: "The ratio 3:5 means 8 parts total." },
        { step: 2, title: 'Value of one part', expression: '\\frac{24}{8} = 3 \\text{ students per part}', explanation: "24 students divided into 8 parts = 3 students each." },
        { step: 3, title: 'Calculate girls', expression: '5 \\times 3 = 15 \\text{ girls}', explanation: "Girls have 5 parts, each worth 3 students." },
        { step: 4, title: 'Verify', expression: '\\text{Boys} = 3 \\times 3 = 9, \\quad 9 + 15 = 24 \\checkmark', explanation: "9 boys + 15 girls = 24 total. Correct!" },
      ],
      finalAnswer: '15 \\text{ girls}',
      encouragement: 'Great job using ratios! This skill helps with real-world problems.',
    },
  },
  {
    grade: 'Grade 6',
    title: 'Solving Equations',
    problem: 'Solve for x: 2x + 6 = 18',
    latex: '2x + 6 = 18',
    solution: {
      steps: [
        { step: 1, title: 'Subtract 6 from both sides', expression: '2x + 6 - 6 = 18 - 6', explanation: "Remove the constant from the left side." },
        { step: 2, title: 'Simplify', expression: '2x = 12', explanation: "We're almost there!" },
        { step: 3, title: 'Divide both sides by 2', expression: 'x = \\frac{12}{2} = 6', explanation: "Divide to isolate x." },
        { step: 4, title: 'Verify', expression: '2(6) + 6 = 12 + 6 = 18 \\checkmark', explanation: "Plug it back in — it works!" },
      ],
      finalAnswer: 'x = 6',
      encouragement: "You solved a two-step equation. That's a key algebra skill!",
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────
export default function MathHelper() {
  const { currentUser, navigate } = useExplorerStore();
  const trackInteraction = useTrackInteraction();
  const grade = currentUser?.grade ?? 3;

  const samples = grade === 3 ? SAMPLE_PROBLEMS_3 : SAMPLE_PROBLEMS_6;

  const [selectedProblem, setSelectedProblem] = useState<SampleProblem | null>(null);
  const [customProblem, setCustomProblem] = useState('');
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'select' | 'solving'>('select');

  const selectSample = useCallback((problem: SampleProblem) => {
    setSelectedProblem(problem);
    setSolution(problem.solution);
    setVisibleSteps(0);
    setMode('solving');
    setError('');
  }, []);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customProblem.trim()) return;

    setSelectedProblem(null);
    setSolution(null);
    setVisibleSteps(0);
    setMode('solving');
    setLoading(true);
    setError('');

    trackInteraction('message', customProblem.trim(), undefined, 'student');

    try {
      const res = await fetch('/api/showcase/explorer-academy/math-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: customProblem, gradeLevel: `Grade ${grade}` }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to solve problem');
      }

      const data: Solution = await res.json();
      setSolution(data);
      trackInteraction('tool_use', 'math_solver', { steps: data.steps.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setMode('select');
    } finally {
      setLoading(false);
    }
  };

  const showNextStep = () => {
    if (solution && visibleSteps < solution.steps.length) setVisibleSteps((v) => v + 1);
  };
  const showAllSteps = () => {
    if (solution) setVisibleSteps(solution.steps.length);
  };
  const reset = () => {
    setSelectedProblem(null);
    setSolution(null);
    setVisibleSteps(0);
    setMode('select');
    setError('');
    setCustomProblem('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back button */}
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
          <h2 className="text-xl font-bold text-gray-900">Math Helper</h2>
          <p className="text-gray-600 text-sm mt-1">
            Step-by-step solutions — like having a personal math tutor
          </p>
        </div>

        <div className="p-6">
          {mode === 'select' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Try a Sample Problem
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {samples.map((p) => (
                    <button
                      key={p.title}
                      onClick={() => selectSample(p)}
                      className="text-left p-4 rounded-xl border-2 border-purple-100 hover:border-purple-400 hover:shadow-md transition-all group"
                    >
                      <span className="text-xs font-semibold text-purple-500">{p.grade}</span>
                      <p className="font-semibold text-gray-800 mt-1 group-hover:text-purple-700 transition-colors">
                        {p.title}
                      </p>
                      <div className="mt-2 text-gray-500 text-sm">
                        <MathDisplay latex={p.latex} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Or Type Your Own Problem
                </h3>
                <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={customProblem}
                    onChange={(e) => setCustomProblem(e.target.value)}
                    placeholder="e.g., What is 25 + 38?"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!customProblem.trim()}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Solve It
                  </button>
                </form>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
          )}

          {mode === 'solving' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="bg-purple-50 rounded-xl px-5 py-3">
                  <span className="text-xs font-semibold text-purple-500 block mb-1">
                    {selectedProblem ? selectedProblem.grade : `Grade ${grade}`}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {selectedProblem ? <MathDisplay latex={selectedProblem.latex} /> : customProblem}
                  </span>
                </div>
                <button onClick={reset} className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Try another problem
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mx-auto mb-3" />
                    <p className="text-gray-500">Solving step by step...</p>
                  </div>
                </div>
              )}

              {solution && !loading && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                    {solution.steps.map((step, i) => (
                      <div
                        key={step.step}
                        className={`transition-all duration-500 ${
                          i < visibleSteps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 h-0 overflow-hidden'
                        }`}
                      >
                        <div className="flex gap-4 items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm mb-1">{step.title}</p>
                            <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-lg mb-2 overflow-x-auto">
                              <MathDisplay latex={step.expression} display />
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              <MathText text={step.explanation} />
                            </p>
                          </div>
                        </div>
                        {i < visibleSteps - 1 && <div className="ml-4 h-6 border-l-2 border-purple-200" />}
                      </div>
                    ))}

                    {visibleSteps >= solution.steps.length && (
                      <div className="mt-4 pt-4 border-t-2 border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-green-700">Final Answer</p>
                            <div className="text-xl font-bold text-gray-900">
                              <MathDisplay latex={solution.finalAnswer} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 bg-green-50 rounded-lg px-4 py-3 border border-green-200">
                          <p className="text-green-800 text-sm">
                            <MathText text={solution.encouragement} />
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 justify-center">
                    {visibleSteps < solution.steps.length ? (
                      <>
                        <button
                          onClick={showNextStep}
                          className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-semibold transition-colors flex items-center gap-2"
                        >
                          Show Hint (Step {visibleSteps + 1} of {solution.steps.length})
                        </button>
                        <button
                          onClick={showAllSteps}
                          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-colors text-sm"
                        >
                          Show Full Solution
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={reset}
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
                      >
                        Solve Another Problem
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
