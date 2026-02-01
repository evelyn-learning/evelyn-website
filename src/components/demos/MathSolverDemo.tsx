'use client';

import React, { useState } from 'react';
import { safeAPICall } from '@/lib/utils/api-error-handler';

interface Step {
  step: number;
  description: string;
  expression: string;
}

interface SolutionData {
  originalProblem: string;
  finalAnswer: string;
  steps: Step[];
  explanation: string;
  concept: string;
}

const SAMPLE_PROBLEMS = {
  algebra: '2x + 5 = 13',
  quadratic: 'x² - 5x + 6 = 0',
  calculus: 'd/dx (3x² + 2x - 5)',
  fractions: '3/4 + 2/5',
};

export default function MathSolverDemo() {
  const [problem, setProblem] = useState('');
  const [mathType, setMathType] = useState<'algebra' | 'quadratic' | 'calculus' | 'fractions'>('algebra');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<SolutionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const solveProblem = async () => {
    if (!problem.trim()) {
      setError('Please enter a math problem to solve.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSolution(null);

    const systemPrompt = `You are an expert math tutor. Solve math problems step-by-step, showing your work clearly.
For each problem:
1. Break down the solution into clear steps
2. Explain the reasoning at each step
3. Provide the final answer
4. Mention the mathematical concept being applied

Always be educational and help the student understand, not just get the answer.`;

    const userPrompt = `Solve this math problem step-by-step:

${problem}

Format your response as JSON:
{
  "originalProblem": "the problem as given",
  "finalAnswer": "the final answer",
  "steps": [
    {
      "step": 1,
      "description": "what you're doing in this step",
      "expression": "the mathematical expression at this step"
    }
  ],
  "explanation": "brief explanation of the approach",
  "concept": "the mathematical concept (e.g., 'Linear Equations', 'Quadratic Formula')"
}`;

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 1500,
        }),
      }
    );

    if (apiError) {
      setError(apiError.message);
      setIsLoading(false);
      return;
    }

    if (data?.text) {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as SolutionData;
          setSolution(parsed);
        } catch {
          setError('Could not parse solution. Please try again.');
        }
      } else {
        setError('Could not parse solution. Please try again.');
      }
    }

    setIsLoading(false);
  };

  const loadSample = (type: keyof typeof SAMPLE_PROBLEMS) => {
    setMathType(type);
    setProblem(SAMPLE_PROBLEMS[type]);
    setSolution(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Math Problem Solver
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter any math problem and get a detailed step-by-step solution with explanations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Enter Problem</h3>

            {/* Math Type Selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(SAMPLE_PROBLEMS).map((type) => (
                <button
                  key={type}
                  onClick={() => loadSample(type as keyof typeof SAMPLE_PROBLEMS)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    mathType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Enter your math problem here... (e.g., 2x + 5 = 13)"
              className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
            />

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                {Object.entries(SAMPLE_PROBLEMS).map(([type, prob]) => (
                  <button
                    key={type}
                    onClick={() => loadSample(type as keyof typeof SAMPLE_PROBLEMS)}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Try {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={solveProblem}
              disabled={isLoading || !problem.trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Solving...
                </>
              ) : (
                <>
                  <span>🧮</span>
                  Solve Problem
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Solution Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Step-by-Step Solution</h3>

            {!solution && !isLoading && (
              <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">🔢</span>
                  <p>Enter a problem and click &quot;Solve&quot; to see the solution</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Working through the problem...</p>
                </div>
              </div>
            )}

            {solution && (
              <div className="space-y-6">
                {/* Problem & Answer */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Problem</p>
                      <p className="text-lg font-mono text-gray-900">{solution.originalProblem}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600 font-medium">Answer</p>
                      <p className="text-2xl font-bold text-blue-700">{solution.finalAnswer}</p>
                    </div>
                  </div>
                </div>

                {/* Concept Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                    {solution.concept}
                  </span>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Solution Steps:</h4>
                  {solution.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 mb-1">{step.description}</p>
                        <p className="font-mono text-lg text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {step.expression}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700">
                    <strong>Why this works:</strong> {solution.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Capabilities</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📐', title: 'Algebra', desc: 'Linear & quadratic equations' },
              { icon: '📊', title: 'Calculus', desc: 'Derivatives & integrals' },
              { icon: '🔢', title: 'Arithmetic', desc: 'Fractions & decimals' },
              { icon: '📈', title: 'Functions', desc: 'Graphing & analysis' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                <span className="text-2xl">{feature.icon}</span>
                <h4 className="font-medium text-gray-800 mt-2">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
