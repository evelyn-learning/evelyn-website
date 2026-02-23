'use client';

import React, { useState } from 'react';
import { safeAPICall } from '@/lib/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

interface AnalysisResult {
  overallScore: number;
  verdict: string;
  concerns: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
  }[];
  highlights: {
    text: string;
    issue: string;
  }[];
  aiWritingIndicators: {
    present: boolean;
    confidence: number;
    reasons: string[];
  };
  recommendations: string[];
}

const SAMPLE_TEXTS = {
  original: `The impact of social media on mental health has become a growing concern among researchers and healthcare professionals. Studies conducted at major universities have shown correlations between excessive social media use and increased rates of anxiety and depression, particularly among teenagers and young adults. However, it's important to note that correlation doesn't imply causation, and many individuals use social media without experiencing negative mental health effects. The key seems to lie in how platforms are used - passive consumption tends to be more harmful than active engagement with communities.`,
  suspicious: `Social media has emerged as a transformative force in contemporary society, fundamentally reshaping the landscape of human interaction and communication. This digital revolution has engendered a paradigm shift in how individuals perceive and engage with the world around them. The ubiquitous nature of these platforms has facilitated unprecedented connectivity, enabling instantaneous communication across geographical boundaries while simultaneously raising pertinent questions regarding privacy, mental health, and the authenticity of human relationships in an increasingly digitized world.`,
};

export default function PlagiarismDetectionDemo() {
  const trackInteraction = useTrackInteraction();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter text to analyze.');
      return;
    }

    if (text.trim().split(/\s+/).length < 50) {
      setError('Please enter at least 50 words for accurate analysis.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    trackInteraction('tool_use', 'analyze_text', { wordCount: text.trim().split(/\s+/).length });

    const systemPrompt = `You are an expert academic integrity analyst specializing in detecting plagiarism and AI-generated content.
Analyze writing for:
1. Originality and authenticity
2. Signs of AI-generated content
3. Stylistic inconsistencies
4. Unusual phrasing or vocabulary

Be fair and balanced - not all formal writing is plagiarized or AI-generated.`;

    const userPrompt = `Analyze this text for originality and authenticity:

"""
${text}
"""

Provide analysis in this JSON format:
{
  "overallScore": number from 0-100 (100 = highly original),
  "verdict": "Original", "Needs Review", or "Significant Concerns",
  "concerns": [
    {
      "type": "type of concern",
      "severity": "low" | "medium" | "high",
      "description": "what was found",
      "suggestion": "how to address"
    }
  ],
  "highlights": [
    {
      "text": "specific phrase of concern",
      "issue": "why it's flagged"
    }
  ],
  "aiWritingIndicators": {
    "present": boolean,
    "confidence": number 0-100,
    "reasons": ["specific indicators observed"]
  },
  "recommendations": ["actionable suggestions"]
}`;

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 2000,
        }),
      }
    );

    if (apiError) {
      setError(apiError.message);
      setIsAnalyzing(false);
      return;
    }

    if (data?.text) {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as AnalysisResult;
          setResult(parsed);
          trackInteraction('tool_use', 'scan_complete', { verdict: parsed.verdict, score: parsed.overallScore, aiDetected: parsed.aiWritingIndicators.present });
        } catch {
          setError('Could not parse analysis. Please try again.');
        }
      } else {
        setError('Could not parse analysis. Please try again.');
      }
    }

    setIsAnalyzing(false);
  };

  const loadSample = (type: 'original' | 'suspicious') => {
    setText(SAMPLE_TEXTS[type]);
    setResult(null);
    trackInteraction('click', 'load_sample', { sampleType: type });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-orange-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Plagiarism & AI Detection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze text for originality, potential plagiarism, and AI-generated content indicators.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Text to Analyze</h3>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste student essay or text to analyze for originality... (minimum 50 words)"
              className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-3">
                <button
                  onClick={() => loadSample('original')}
                  className="text-sm text-orange-600 hover:text-orange-700 underline"
                >
                  Load Original Sample
                </button>
                <button
                  onClick={() => loadSample('suspicious')}
                  className="text-sm text-orange-600 hover:text-orange-700 underline"
                >
                  Load Suspicious Sample
                </button>
              </div>
              <span className="text-sm text-gray-400">
                {text.split(/\s+/).filter(w => w).length} words
              </span>
            </div>

            <button
              onClick={analyzeText}
              disabled={isAnalyzing || text.split(/\s+/).filter(w => w).length < 50}
              className="w-full mt-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Analyze for Originality
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>

            {!result && !isAnalyzing && (
              <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">🔍</span>
                  <p>Paste text and click analyze to check originality</p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Scanning for originality issues...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                {/* Overall Score */}
                <div className={`${getScoreBg(result.overallScore)} rounded-xl p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Originality Score</p>
                      <p className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}%
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-full font-medium ${
                        result.verdict === 'Original' ? 'bg-green-200 text-green-800' :
                        result.verdict === 'Needs Review' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {result.verdict}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Detection */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <span>🤖</span> AI Writing Detection
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-700">AI-Generated Content:</span>
                    <span className={`font-medium ${result.aiWritingIndicators.present ? 'text-red-600' : 'text-green-600'}`}>
                      {result.aiWritingIndicators.present ? 'Indicators Found' : 'Not Detected'}
                    </span>
                  </div>
                  <div className="h-2 bg-purple-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-purple-600 transition-all"
                      style={{ width: `${result.aiWritingIndicators.confidence}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-600">{result.aiWritingIndicators.confidence}% confidence</p>
                  {result.aiWritingIndicators.reasons.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {result.aiWritingIndicators.reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                          <span>•</span> {reason}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Concerns */}
                {result.concerns.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Concerns Found</h4>
                    <div className="space-y-3">
                      {result.concerns.map((concern, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(concern.severity)}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium uppercase">{concern.severity}</span>
                            <span className="font-medium">{concern.type}</span>
                          </div>
                          <p className="text-sm mb-2">{concern.description}</p>
                          <p className="text-xs opacity-80"><strong>Suggestion:</strong> {concern.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flagged Phrases */}
                {result.highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Flagged Phrases</h4>
                    <div className="space-y-2">
                      {result.highlights.map((highlight, idx) => (
                        <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 italic">&quot;{highlight.text}&quot;</p>
                          <p className="text-xs text-yellow-700 mt-1">{highlight.issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500">✓</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Detection Capabilities</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📋', title: 'Plagiarism', desc: 'Text similarity detection' },
              { icon: '🤖', title: 'AI Detection', desc: 'ChatGPT & LLM patterns' },
              { icon: '✍️', title: 'Style Analysis', desc: 'Writing inconsistencies' },
              { icon: '📊', title: 'Detailed Report', desc: 'Actionable insights' },
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
