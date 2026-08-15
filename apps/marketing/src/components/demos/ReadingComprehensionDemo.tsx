'use client';

import React, { useState } from 'react';
import { safeAPICall } from '@core/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

interface ComprehensionQuestion {
  question: string;
  type: 'literal' | 'inferential' | 'evaluative';
  modelAnswer: string;
}

interface ReadingAnalysis {
  passage: {
    title: string;
    readingLevel: string;
    wordCount: number;
    estimatedReadTime: string;
  };
  summary: string;
  mainIdea: string;
  keyVocabulary: {
    term: string;
    definition: string;
    context: string;
  }[];
  questions: ComprehensionQuestion[];
  textStructure: string;
  themes: string[];
}

const SAMPLE_PASSAGES = {
  science: `The water cycle, also known as the hydrological cycle, describes the continuous movement of water within the Earth and atmosphere. It begins when the sun heats water in oceans, lakes, and rivers, causing it to evaporate into water vapor. This vapor rises into the atmosphere where cooler temperatures cause it to condense into tiny water droplets, forming clouds. When these droplets combine and become heavy enough, they fall back to Earth as precipitation—rain, snow, sleet, or hail. Some precipitation flows into rivers and streams (runoff), some seeps into the ground (infiltration), and some evaporates back into the atmosphere. This cycle has been operating for billions of years and is essential for all life on Earth.`,

  literature: `The old man sat alone on the park bench, watching children play in the distance. Their laughter echoed across the green expanse, a sound both joyful and melancholic to his ears. Fifty years ago, he had played on these same swings, chased friends across this same grass. Now his grandchildren lived across the country, their visits rare as summer snow. He pulled out a worn photograph from his wallet—three generations smiling at a camera, frozen in a moment that felt both recent and ancient. The autumn leaves began to fall around him, each one a reminder that seasons change, that nothing stays the same, but also that new springs always follow.`,

  history: `The Industrial Revolution, which began in Britain in the late 18th century, fundamentally transformed human society. Before this period, most people lived in rural areas and made goods by hand. The introduction of machines powered first by water and then by steam changed everything. Factories replaced workshops, cities grew rapidly as workers migrated from farms, and new transportation networks like railroads connected distant regions. While industrialization brought unprecedented economic growth and technological innovation, it also created significant challenges: dangerous working conditions, child labor, urban poverty, and environmental pollution. The changes set in motion during this era continue to shape our world today.`,
};

export default function ReadingComprehensionDemo() {
  const trackInteraction = useTrackInteraction();
  const [passage, setPassage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReadingAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const analyzePassage = async () => {
    trackInteraction('click', 'submit_answer');
    if (!passage.trim()) {
      setError('Please enter a reading passage to analyze.');
      return;
    }

    if (passage.trim().split(/\s+/).length < 50) {
      setError('Please enter at least 50 words for comprehensive analysis.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    const systemPrompt = `You are an expert reading comprehension specialist and educational content developer.
Analyze passages to:
1. Determine reading level and complexity
2. Identify main ideas, themes, and text structure
3. Extract key vocabulary in context
4. Generate varied comprehension questions (literal, inferential, evaluative)

Create questions that develop critical thinking, not just recall.`;

    const userPrompt = `Analyze this reading passage and generate comprehension materials:

"""
${passage}
"""

Provide analysis in this JSON format:
{
  "passage": {
    "title": "suggested title",
    "readingLevel": "grade level (e.g., '6th Grade', 'High School')",
    "wordCount": number,
    "estimatedReadTime": "X minutes"
  },
  "summary": "2-3 sentence summary",
  "mainIdea": "one sentence main idea",
  "keyVocabulary": [
    {
      "term": "vocabulary word",
      "definition": "definition",
      "context": "how it's used in the passage"
    }
  ],
  "questions": [
    {
      "question": "comprehension question",
      "type": "literal" | "inferential" | "evaluative",
      "modelAnswer": "sample correct answer"
    }
  ],
  "textStructure": "e.g., cause/effect, compare/contrast, chronological, problem/solution",
  "themes": ["theme 1", "theme 2"]
}

Generate at least 5 questions: 2 literal, 2 inferential, 1 evaluative.`;

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 2500,
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
          const parsed = JSON.parse(jsonMatch[0]) as ReadingAnalysis;
          setAnalysis(parsed);
        } catch {
          setError('Could not parse analysis. Please try again.');
        }
      } else {
        setError('Could not parse analysis. Please try again.');
      }
    }

    setIsAnalyzing(false);
  };

  const loadSample = (type: keyof typeof SAMPLE_PASSAGES) => {
    trackInteraction('click', 'select_passage', { passage: type });
    setPassage(SAMPLE_PASSAGES[type]);
    setAnalysis(null);
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'literal': return 'bg-blue-100 text-blue-700';
      case 'inferential': return 'bg-purple-100 text-purple-700';
      case 'evaluative': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reading Comprehension AI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste any passage to generate reading level analysis, vocabulary, and comprehension questions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reading Passage</h3>

            <textarea
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              placeholder="Paste a reading passage here... (minimum 50 words)"
              className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-500">Try sample:</span>
              {Object.keys(SAMPLE_PASSAGES).map((type) => (
                <button
                  key={type}
                  onClick={() => loadSample(type as keyof typeof SAMPLE_PASSAGES)}
                  className="text-sm text-purple-600 hover:text-purple-700 underline"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-2">
              <span className="text-sm text-gray-400">
                {passage.split(/\s+/).filter(w => w).length} words
              </span>
            </div>

            <button
              onClick={analyzePassage}
              disabled={isAnalyzing || passage.split(/\s+/).filter(w => w).length < 50}
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  <span>📖</span>
                  Analyze Passage
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis & Questions</h3>

            {!analysis && !isAnalyzing && (
              <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">📖</span>
                  <p>Paste a passage to generate comprehension materials</p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Analyzing passage...</p>
                </div>
              </div>
            )}

            {analysis && (
              <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                {/* Passage Info */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">{analysis.passage.title}</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-purple-700">{analysis.passage.readingLevel}</p>
                      <p className="text-xs text-purple-600">Reading Level</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-700">{analysis.passage.wordCount}</p>
                      <p className="text-xs text-purple-600">Words</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-700">{analysis.passage.estimatedReadTime}</p>
                      <p className="text-xs text-purple-600">Read Time</p>
                    </div>
                  </div>
                </div>

                {/* Main Idea & Summary */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Main Idea</h4>
                  <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">{analysis.mainIdea}</p>
                  <h4 className="font-semibold text-gray-800 mb-2 mt-4">Summary</h4>
                  <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">{analysis.summary}</p>
                </div>

                {/* Text Structure & Themes */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {analysis.textStructure}
                  </span>
                  {analysis.themes.map((theme, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {theme}
                    </span>
                  ))}
                </div>

                {/* Key Vocabulary */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Key Vocabulary</h4>
                  <div className="space-y-2">
                    {analysis.keyVocabulary.map((vocab, idx) => (
                      <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="font-medium text-gray-900">{vocab.term}</p>
                        <p className="text-sm text-gray-600">{vocab.definition}</p>
                        <p className="text-xs text-yellow-700 mt-1 italic">&quot;{vocab.context}&quot;</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comprehension Questions */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Comprehension Questions</h4>
                  <div className="space-y-3">
                    {analysis.questions.map((q, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getQuestionTypeColor(q.type)}`}>
                            {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                          </span>
                          <button
                            onClick={() => setExpandedQuestion(expandedQuestion === idx ? null : idx)}
                            className="text-sm text-purple-600 hover:text-purple-700"
                          >
                            {expandedQuestion === idx ? 'Hide Answer' : 'Show Answer'}
                          </button>
                        </div>
                        <p className="font-medium text-gray-900">{idx + 1}. {q.question}</p>
                        {expandedQuestion === idx && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Model Answer:</strong> {q.modelAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Analysis Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📊', title: 'Reading Level', desc: 'Grade-level assessment' },
              { icon: '📝', title: 'Questions', desc: 'Multi-level comprehension' },
              { icon: '📚', title: 'Vocabulary', desc: 'Context-based definitions' },
              { icon: '🎯', title: 'Analysis', desc: 'Structure & themes' },
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
