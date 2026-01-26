'use client';

import React, { useState } from 'react';

// Types
interface Category {
  name: string;
  score: number;
  observations: string[];
  suggestions: string[];
}

interface RewriteExample {
  original: string;
  improved: string;
  explanation: string;
}

interface FeedbackData {
  categories: Category[];
  overallScore: number;
  overallAssessment: string;
  priorityImprovements: string[];
  rewriteExample: RewriteExample;
}

interface Rubric {
  name: string;
  categories: string[];
  maxScore: number;
  description: string;
}

interface ScoreBarProps {
  score: number;
  maxScore: number;
  label: string;
}

// Sample essays
const SAMPLE_ESSAYS = {
  good: `The impact of social media on modern communication represents one of the most significant cultural shifts of the 21st century. While critics argue that platforms like Instagram and Twitter have diminished the quality of human interaction, a closer examination reveals a more nuanced reality.

First, social media has democratized information sharing in unprecedented ways. Prior to these platforms, ordinary citizens had limited means to share their perspectives with a broad audience. Today, a teenager in rural Kansas can engage in meaningful dialogue with thought leaders across the globe. This accessibility has empowered marginalized voices and facilitated social movements that might otherwise have remained localized.

However, the benefits of this connectivity come with notable drawbacks. The brevity encouraged by platforms like Twitter can oversimplify complex issues, reducing nuanced debates to polarizing soundbites. Furthermore, the algorithmic curation of content creates echo chambers that reinforce existing beliefs rather than challenging them.

In conclusion, social media's impact on communication is neither wholly positive nor negative. The key lies in developing digital literacy skills that allow users to harness these tools' potential while mitigating their risks. As with any powerful technology, the outcome depends largely on how we choose to use it.`,

  needsWork: `Social media is really bad for people I think. Everyone is always on their phones and nobody talks anymore. My mom says when she was young people actually had conversations.

There are some good things about social media too though. You can talk to friends and see pictures. But mostly its bad because people get addicted and waste time. Studies show this is true.

Also cyberbullying is a big problem. Kids get bullied online and its really sad. The companies should do something about this but they dont care about anything except money.

In conclusion social media has good and bad parts but mostly bad. We should limit how much we use it.`
};

type EssayType = 'sat' | 'act' | 'college';

export default function EssayScoringDemo() {
  const [essay, setEssay] = useState('');
  const [essayType, setEssayType] = useState<EssayType>('sat');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rubrics: Record<EssayType, Rubric> = {
    sat: {
      name: 'SAT Essay',
      categories: ['Reading', 'Analysis', 'Writing'],
      maxScore: 8,
      description: 'Evaluates comprehension, analytical depth, and writing quality'
    },
    act: {
      name: 'ACT Writing',
      categories: ['Ideas & Analysis', 'Development & Support', 'Organization', 'Language Use'],
      maxScore: 6,
      description: 'Assesses argument quality, evidence, structure, and language'
    },
    college: {
      name: 'College Application',
      categories: ['Authenticity', 'Insight & Reflection', 'Writing Quality', 'Engagement'],
      maxScore: 10,
      description: 'Focuses on personal voice, self-awareness, and compelling narrative'
    }
  };

  const analyzeEssay = async () => {
    if (!essay.trim()) {
      setError('Please enter an essay to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setFeedback(null);

    const rubric = rubrics[essayType];

    const systemPrompt = `You are an expert essay evaluator for standardized tests and college admissions.
You provide detailed, constructive feedback that helps students improve their writing.
Always be encouraging while being honest about areas for improvement.
Your feedback should be specific and actionable.`;

    const userPrompt = `Please evaluate this ${rubric.name} essay using the following criteria: ${rubric.categories.join(', ')}.

For each category, provide:
1. A score from 1-${rubric.maxScore}
2. 2-3 specific observations (what works well)
3. 2-3 specific suggestions for improvement

Also provide:
- An overall score (average of categories)
- A brief overall assessment (2-3 sentences)
- The top 3 priority improvements
- One specific sentence from the essay that could be rewritten, with your improved version

Format your response as JSON with this structure:
{
  "categories": [
    {
      "name": "Category Name",
      "score": number,
      "observations": ["observation 1", "observation 2"],
      "suggestions": ["suggestion 1", "suggestion 2"]
    }
  ],
  "overallScore": number,
  "overallAssessment": "string",
  "priorityImprovements": ["improvement 1", "improvement 2", "improvement 3"],
  "rewriteExample": {
    "original": "original sentence",
    "improved": "improved sentence",
    "explanation": "why this is better"
  }
}

ESSAY TO EVALUATE:
"""
${essay}
"""`;

    try {
      const response = await fetch('/api/ai/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 2000
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.text) {
        // Extract JSON from response
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as FeedbackData;
          setFeedback(parsed);
        } else {
          setError('Could not parse feedback. Please try again.');
        }
      } else {
        setError('No response received. Please check your API configuration.');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}. Make sure the API is properly configured.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (quality: 'good' | 'needsWork') => {
    setEssay(SAMPLE_ESSAYS[quality]);
    setFeedback(null);
  };

  const ScoreBar = ({ score, maxScore, label }: ScoreBarProps) => {
    const percentage = (score / maxScore) * 100;
    const getColor = () => {
      if (percentage >= 80) return 'bg-emerald-500';
      if (percentage >= 60) return 'bg-purple-500';
      if (percentage >= 40) return 'bg-yellow-500';
      return 'bg-red-400';
    };

    return (
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="font-bold text-gray-900">{score}/{maxScore}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor()} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-purple-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Essay Scoring & Feedback System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant, detailed feedback on essays using advanced AI analysis.
            Scores are calibrated to official rubrics with actionable improvement suggestions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Essay Input</h2>
              <select
                value={essayType}
                onChange={(e) => setEssayType(e.target.value as EssayType)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="sat">SAT Essay Rubric</option>
                <option value="act">ACT Writing Rubric</option>
                <option value="college">College Application</option>
              </select>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-purple-800">
                <strong>{rubrics[essayType].name}:</strong> {rubrics[essayType].description}
              </p>
            </div>

            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Paste or type your essay here..."
              className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => loadSample('good')}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Load Strong Sample
                </button>
                <button
                  onClick={() => loadSample('needsWork')}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Load Weak Sample
                </button>
              </div>
              <span className="text-sm text-gray-400">
                {essay.split(/\s+/).filter(w => w).length} words
              </span>
            </div>

            <button
              onClick={analyzeEssay}
              disabled={isAnalyzing || !essay.trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-primary-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Essay...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Analyze Essay
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>

            {!feedback && !isAnalyzing && (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Enter an essay and click &quot;Analyze&quot; to see detailed feedback</p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Analyzing your essay...</p>
                  <p className="text-sm text-gray-400 mt-1">This takes about 5-10 seconds</p>
                </div>
              </div>
            )}

            {feedback && (
              <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-purple-500 to-primary-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Overall Score</p>
                      <p className="text-4xl font-bold">{feedback.overallScore.toFixed(1)}<span className="text-xl opacity-75">/{rubrics[essayType].maxScore}</span></p>
                    </div>
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-3xl font-bold">{Math.round((feedback.overallScore / rubrics[essayType].maxScore) * 100)}%</span>
                    </div>
                  </div>
                  <p className="mt-4 text-purple-100 text-sm">{feedback.overallAssessment}</p>
                </div>

                {/* Category Scores */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Category Breakdown</h3>
                  <div className="space-y-3">
                    {feedback.categories.map((cat, idx) => (
                      <ScoreBar
                        key={idx}
                        score={cat.score}
                        maxScore={rubrics[essayType].maxScore}
                        label={cat.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Priority Improvements */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Priority Improvements</h3>
                  <div className="space-y-2">
                    {feedback.priorityImprovements.map((imp, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-amber-900">{imp}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewrite Example */}
                {feedback.rewriteExample && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Sentence Improvement Example</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs font-medium text-red-600 mb-1">ORIGINAL</p>
                        <p className="text-sm text-red-900 italic">&quot;{feedback.rewriteExample.original}&quot;</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                        <p className="text-xs font-medium text-green-600 mb-1">IMPROVED</p>
                        <p className="text-sm text-green-900 italic">&quot;{feedback.rewriteExample.improved}&quot;</p>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>Why this works:</strong> {feedback.rewriteExample.explanation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Category Feedback */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Detailed Feedback</h3>
                  <div className="space-y-4">
                    {feedback.categories.map((cat, idx) => (
                      <details key={idx} className="border border-gray-200 rounded-lg">
                        <summary className="p-3 cursor-pointer hover:bg-gray-50 font-medium text-gray-700">
                          {cat.name} — {cat.score}/{rubrics[essayType].maxScore}
                        </summary>
                        <div className="p-4 pt-0 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-2">STRENGTHS</p>
                            <ul className="space-y-1">
                              {cat.observations.map((obs, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                  <span className="text-green-500">&#10003;</span> {obs}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-purple-600 mb-2">SUGGESTIONS</p>
                            <ul className="space-y-1">
                              {cat.suggestions.map((sug, i) => (
                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                  <span className="text-purple-500">&#8594;</span> {sug}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Platform Capabilities</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '⚡', title: 'Instant Feedback', desc: 'Results in under 10 seconds' },
              { icon: '📊', title: 'Rubric-Aligned', desc: 'SAT, ACT, and college essay scoring' },
              { icon: '🎯', title: 'Actionable Insights', desc: 'Specific improvement suggestions' },
              { icon: '📈', title: 'Progress Tracking', desc: 'Monitor improvement over time' }
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
