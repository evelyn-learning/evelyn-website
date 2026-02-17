'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

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

// ─── KaTeX rendering helper ──────────────────────────────────────────
function MathDisplay({ latex, display = false }: { latex: string; display?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
          displayMode: display,
          trust: true,
          strict: false,
        });
      } catch {
        ref.current.textContent = latex;
      }
    }
  }, [latex, display]);

  return <span ref={ref} />;
}

// Render text that may contain inline LaTeX between $ delimiters
function MathText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return <MathDisplay key={i} latex={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// ─── Sample problems with pre-written solutions ──────────────────────
const SAMPLE_PROBLEMS: SampleProblem[] = [
  {
    grade: 'Grade 4',
    title: 'Adding Fractions',
    problem: 'What is 2/3 + 1/4?',
    latex: '\\frac{2}{3} + \\frac{1}{4}',
    solution: {
      steps: [
        {
          step: 1,
          title: 'Find a common denominator',
          expression: '\\text{LCD of } 3 \\text{ and } 4 = 12',
          explanation: 'To add fractions, we need the same denominator (bottom number). We find the smallest number that both 3 and 4 divide into evenly — that\'s 12!',
        },
        {
          step: 2,
          title: 'Convert the first fraction',
          expression: '\\frac{2}{3} = \\frac{2 \\times 4}{3 \\times 4} = \\frac{8}{12}',
          explanation: 'We multiply both the top and bottom of 2/3 by 4 to get a denominator of 12. This doesn\'t change the value — it\'s like cutting the same pizza into more slices!',
        },
        {
          step: 3,
          title: 'Convert the second fraction',
          expression: '\\frac{1}{4} = \\frac{1 \\times 3}{4 \\times 3} = \\frac{3}{12}',
          explanation: 'We do the same for 1/4, multiplying top and bottom by 3 to get twelfths.',
        },
        {
          step: 4,
          title: 'Add the numerators',
          expression: '\\frac{8}{12} + \\frac{3}{12} = \\frac{8 + 3}{12} = \\frac{11}{12}',
          explanation: 'Now that both fractions have the same denominator, we simply add the numerators (top numbers) and keep the denominator the same.',
        },
      ],
      finalAnswer: '\\frac{11}{12}',
      encouragement: 'Excellent work! You just added fractions with unlike denominators — a key skill in Grade 4 math!',
    },
  },
  {
    grade: 'Grade 6',
    title: 'Ratios & Proportions',
    problem: 'If the ratio of boys to girls in a class is 3:5 and there are 24 students total, how many are girls?',
    latex: '\\text{boys : girls} = 3 : 5, \\quad \\text{total} = 24',
    solution: {
      steps: [
        {
          step: 1,
          title: 'Find total parts in the ratio',
          expression: '3 + 5 = 8 \\text{ parts}',
          explanation: 'A ratio tells us how to divide something into parts. The ratio 3:5 means 3 parts boys and 5 parts girls — that\'s 8 parts total.',
        },
        {
          step: 2,
          title: 'Find the value of one part',
          expression: '\\frac{24}{8} = 3 \\text{ students per part}',
          explanation: 'If 24 students are split into 8 equal parts, each part represents 3 students.',
        },
        {
          step: 3,
          title: 'Calculate the number of girls',
          expression: '5 \\times 3 = 15 \\text{ girls}',
          explanation: 'Girls have 5 parts, and each part is 3 students. So we multiply 5 × 3 to find the number of girls.',
        },
        {
          step: 4,
          title: 'Verify our answer',
          expression: '\\text{Boys} = 3 \\times 3 = 9, \\quad 9 + 15 = 24 \\checkmark',
          explanation: 'Let\'s check: 9 boys + 15 girls = 24 students total. Our answer checks out!',
        },
      ],
      finalAnswer: '15 \\text{ girls}',
      encouragement: 'Great job using ratios! This skill helps you solve real-world problems like mixing recipes or splitting groups fairly.',
    },
  },
  {
    grade: 'Grade 8',
    title: 'Linear Equations',
    problem: 'Solve for x: 3x + 7 = 22',
    latex: '3x + 7 = 22',
    solution: {
      steps: [
        {
          step: 1,
          title: 'Isolate the variable term',
          expression: '3x + 7 - 7 = 22 - 7',
          explanation: 'Our goal is to get x alone. First, we subtract 7 from both sides to remove the constant from the left side. Whatever we do to one side, we must do to the other to keep the equation balanced.',
        },
        {
          step: 2,
          title: 'Simplify both sides',
          expression: '3x = 15',
          explanation: 'After subtracting, we have 3x on the left and 15 on the right. We\'re almost there!',
        },
        {
          step: 3,
          title: 'Solve for x',
          expression: 'x = \\frac{15}{3} = 5',
          explanation: 'Since 3 is multiplied by x, we divide both sides by 3 to find the value of x.',
        },
        {
          step: 4,
          title: 'Verify the solution',
          expression: '3(5) + 7 = 15 + 7 = 22 \\checkmark',
          explanation: 'Always check! Plug x = 5 back into the original equation: 3(5) + 7 = 22. It works!',
        },
      ],
      finalAnswer: 'x = 5',
      encouragement: 'You\'ve mastered solving a linear equation! This is a foundational algebra skill you\'ll use all through high school.',
    },
  },
  {
    grade: 'Grade 10',
    title: 'Quadratic Equations',
    problem: 'Solve x² - 5x + 6 = 0',
    latex: 'x^2 - 5x + 6 = 0',
    solution: {
      steps: [
        {
          step: 1,
          title: 'Identify as a quadratic',
          expression: 'ax^2 + bx + c = 0 \\quad \\Rightarrow \\quad a=1,\\; b=-5,\\; c=6',
          explanation: 'This is a quadratic equation (highest power of x is 2). We need two numbers that multiply to give c (6) and add to give b (-5).',
        },
        {
          step: 2,
          title: 'Find the factors',
          expression: '-2 \\times -3 = 6 \\quad \\text{and} \\quad -2 + (-3) = -5',
          explanation: 'We need two numbers that multiply to +6 and add to -5. Those numbers are -2 and -3. This is the key factoring step!',
        },
        {
          step: 3,
          title: 'Write in factored form',
          expression: '(x - 2)(x - 3) = 0',
          explanation: 'We can rewrite the quadratic as a product of two binomials. If the product equals zero, then at least one factor must be zero.',
        },
        {
          step: 4,
          title: 'Apply the zero product property',
          expression: 'x - 2 = 0 \\implies x = 2 \\quad \\text{or} \\quad x - 3 = 0 \\implies x = 3',
          explanation: 'Setting each factor equal to zero gives us two solutions. Quadratic equations can have up to 2 solutions!',
        },
      ],
      finalAnswer: 'x = 2 \\text{ or } x = 3',
      encouragement: 'Amazing! Factoring quadratics is one of the most important skills in Grade 10 math. You\'ll use this in physics and engineering too!',
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────
export default function MathSolver() {
  const [selectedProblem, setSelectedProblem] = useState<SampleProblem | null>(null);
  const [customProblem, setCustomProblem] = useState('');
  const [customGrade, setCustomGrade] = useState('Grade 8');
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

    try {
      const res = await fetch('/api/showcase/explorer-academy/math-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: customProblem, gradeLevel: customGrade }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to solve problem');
      }

      const data: Solution = await res.json();
      setSolution(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setMode('select');
    } finally {
      setLoading(false);
    }
  };

  const showNextStep = () => {
    if (solution && visibleSteps < solution.steps.length) {
      setVisibleSteps((v) => v + 1);
    }
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
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-r from-purple-50 to-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-purple-600">1.</span> AI Math Problem Solver
            </h2>
            <p className="text-gray-600 mt-1">
              Step-by-step solutions with explanations — like having a personal math tutor
            </p>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            Aligned to BC Mathematics Curriculum
          </span>
        </div>
      </div>

      <div className="p-6">
        {mode === 'select' && (
          <div className="space-y-6">
            {/* Sample Problems */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Try a Sample Problem
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SAMPLE_PROBLEMS.map((p) => (
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

            {/* Custom Problem Input */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Or Type Your Own Problem
              </h3>
              <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
                <select
                  value={customGrade}
                  onChange={(e) => setCustomGrade(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {['Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={customProblem}
                  onChange={(e) => setCustomProblem(e.target.value)}
                  placeholder="e.g., Solve 2x + 5 = 17"
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

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
        )}

        {mode === 'solving' && (
          <div className="space-y-6">
            {/* Problem Display */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="bg-purple-50 rounded-xl px-5 py-3">
                <span className="text-xs font-semibold text-purple-500 block mb-1">
                  {selectedProblem ? selectedProblem.grade : customGrade}
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {selectedProblem ? (
                    <MathDisplay latex={selectedProblem.latex} />
                  ) : (
                    customProblem
                  )}
                </span>
              </div>
              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Try another problem
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mx-auto mb-3" />
                  <p className="text-gray-500">Solving step by step...</p>
                </div>
              </div>
            )}

            {/* Solution Steps */}
            {solution && !loading && (
              <div className="space-y-4">
                {/* Whiteboard area */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                  {solution.steps.map((step, i) => (
                    <div
                      key={step.step}
                      className={`transition-all duration-500 ${
                        i < visibleSteps
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4 h-0 overflow-hidden'
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
                      {i < visibleSteps - 1 && (
                        <div className="ml-4 h-6 border-l-2 border-purple-200" />
                      )}
                    </div>
                  ))}

                  {/* Final answer */}
                  {visibleSteps >= solution.steps.length && (
                    <div className="mt-4 pt-4 border-t-2 border-purple-200 transition-all duration-500">
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

                {/* Controls */}
                <div className="flex items-center gap-3 justify-center">
                  {visibleSteps < solution.steps.length ? (
                    <>
                      <button
                        onClick={showNextStep}
                        className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-semibold transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
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

      {/* Powered by badge */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
        <span className="text-xs text-gray-400">Powered by Evelyn Learning</span>
      </div>
    </div>
  );
}
