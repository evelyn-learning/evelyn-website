'use client';

import React, { useState } from 'react';
import { safeAPICall } from '@/lib/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Flashcard {
  front: string;
  back: string;
}

interface GeneratedContent {
  type: 'quiz' | 'flashcards';
  topic: string;
  quiz?: QuizQuestion[];
  flashcards?: Flashcard[];
}

const SAMPLE_TEXTS = {
  science: `Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process occurs in the chloroplasts, specifically using chlorophyll to capture light energy. The overall equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. Photosynthesis is essential for life on Earth as it produces oxygen and serves as the foundation of most food chains.`,
  history: `The Renaissance was a cultural movement that began in Italy during the 14th century and spread throughout Europe. It marked a transition from the Medieval period to the Early Modern age. Key characteristics included renewed interest in classical Greek and Roman culture, advances in art and architecture, and the development of humanism. Notable figures include Leonardo da Vinci, Michelangelo, and Galileo Galilei.`,
  literature: `In "To Kill a Mockingbird" by Harper Lee, Scout Finch narrates the story of her father Atticus, a lawyer defending Tom Robinson, a Black man falsely accused of a crime in 1930s Alabama. The novel explores themes of racial injustice, loss of innocence, and moral courage. The mockingbird symbolizes innocence that is destroyed by evil, as killing a mockingbird is considered a sin because they only make music.`,
};

export default function ContentAuthoringDemo() {
  const trackInteraction = useTrackInteraction();
  const [sourceText, setSourceText] = useState('');
  const [contentType, setContentType] = useState<'quiz' | 'flashcards'>('quiz');
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateContent = async () => {
    if (!sourceText.trim()) {
      setError('Please enter some text to generate content from.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setContent(null);
    trackInteraction('tool_use', 'generate_content', { contentType, wordCount: sourceText.trim().split(/\s+/).length });
    setSelectedAnswers({});
    setShowAnswers({});
    setCurrentQuestion(0);
    setCurrentCard(0);
    setIsFlipped(false);

    const systemPrompt = `You are an expert educational content creator. Create high-quality learning materials from source text.
For quizzes: Create challenging but fair multiple-choice questions that test understanding, not just memorization.
For flashcards: Create clear, concise cards that capture key concepts and definitions.`;

    const userPrompt = contentType === 'quiz'
      ? `Create a 5-question multiple choice quiz from this text. Each question should:
- Test understanding of key concepts
- Have 4 answer options (A, B, C, D)
- Include a brief explanation of the correct answer

Text:
"""
${sourceText}
"""

Format as JSON:
{
  "type": "quiz",
  "topic": "brief topic name",
  "quiz": [
    {
      "question": "the question",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": 0,
      "explanation": "why this is correct"
    }
  ]
}`
      : `Create 6 flashcards from this text. Each flashcard should:
- Have a clear term/concept/question on the front
- Have a concise explanation/answer on the back

Text:
"""
${sourceText}
"""

Format as JSON:
{
  "type": "flashcards",
  "topic": "brief topic name",
  "flashcards": [
    {
      "front": "term or question",
      "back": "definition or answer"
    }
  ]
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
      setIsGenerating(false);
      return;
    }

    if (data?.text) {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as GeneratedContent;
          setContent(parsed);
          trackInteraction('tool_use', 'content_generated', { contentType, itemCount: parsed.quiz?.length || parsed.flashcards?.length || 0, topic: parsed.topic });
        } catch {
          setError('Could not parse content. Please try again.');
        }
      } else {
        setError('Could not parse content. Please try again.');
      }
    }

    setIsGenerating(false);
  };

  const loadSample = (type: keyof typeof SAMPLE_TEXTS) => {
    setSourceText(SAMPLE_TEXTS[type]);
    setContent(null);
    trackInteraction('click', 'load_sample', { sampleType: type });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-emerald-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Content Authoring AI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste any educational text and instantly generate quizzes or flashcards.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Source Content</h3>

            {/* Content Type Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setContentType('quiz')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  contentType === 'quiz'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📝 Generate Quiz
              </button>
              <button
                onClick={() => setContentType('flashcards')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  contentType === 'flashcards'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🎴 Generate Flashcards
              </button>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste your educational content here... (textbook excerpt, article, notes)"
              className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-500">Try sample:</span>
              {Object.keys(SAMPLE_TEXTS).map((type) => (
                <button
                  key={type}
                  onClick={() => loadSample(type as keyof typeof SAMPLE_TEXTS)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 underline"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={generateContent}
              disabled={isGenerating || !sourceText.trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate {contentType === 'quiz' ? 'Quiz' : 'Flashcards'}
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Generated {contentType === 'quiz' ? 'Quiz' : 'Flashcards'}
            </h3>

            {!content && !isGenerating && (
              <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">{contentType === 'quiz' ? '📝' : '🎴'}</span>
                  <p>Paste content and generate {contentType}</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Creating your {contentType}...</p>
                </div>
              </div>
            )}

            {/* Quiz Display */}
            {content?.type === 'quiz' && content.quiz && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                    {content.topic}
                  </span>
                  <span className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {content.quiz.length}
                  </span>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-4">
                  {content.quiz.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-3 h-3 rounded-full transition ${
                        idx === currentQuestion
                          ? 'bg-emerald-600'
                          : showAnswers[idx]
                          ? selectedAnswers[idx] === content.quiz![idx].correctAnswer
                            ? 'bg-green-400'
                            : 'bg-red-400'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Single Question Display */}
                {(() => {
                  const q = content.quiz[currentQuestion];
                  const qIdx = currentQuestion;
                  return (
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-900 mb-4 text-lg">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-3">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => {
                              setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                              setShowAnswers(prev => ({ ...prev, [qIdx]: true }));
                              trackInteraction('click', 'quiz_answer', { questionIndex: qIdx, correct: optIdx === q.correctAnswer });
                            }}
                            disabled={showAnswers[qIdx]}
                            className={`w-full text-left p-4 rounded-lg border-2 transition ${
                              showAnswers[qIdx] && optIdx === q.correctAnswer
                                ? 'bg-green-100 border-green-500'
                                : showAnswers[qIdx] && optIdx === selectedAnswers[qIdx] && optIdx !== q.correctAnswer
                                ? 'bg-red-100 border-red-500'
                                : selectedAnswers[qIdx] === optIdx && !showAnswers[qIdx]
                                ? 'bg-emerald-50 border-emerald-400'
                                : 'bg-white border-gray-200 hover:border-emerald-400'
                            } ${showAnswers[qIdx] ? 'cursor-default' : ''}`}
                          >
                            <span className="font-semibold">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                          </button>
                        ))}
                      </div>
                      {showAnswers[qIdx] && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Navigation */}
                <div className="flex justify-between gap-4 pt-4">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 font-medium"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentQuestion(Math.min(content.quiz!.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === content.quiz.length - 1}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50 font-medium"
                  >
                    Next
                  </button>
                </div>

                {/* Score summary */}
                {Object.keys(showAnswers).length === content.quiz.length && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-xl text-center">
                    <p className="text-lg font-semibold text-emerald-800">
                      Quiz Complete! Score: {content.quiz.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length}/{content.quiz.length}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Flashcards Display */}
            {content?.type === 'flashcards' && content.flashcards && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                    {content.topic}
                  </span>
                  <span className="text-sm text-gray-500">
                    Card {currentCard + 1} of {content.flashcards.length}
                  </span>
                </div>

                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[200px] p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <div className="text-center text-white">
                    <p className="text-xs uppercase tracking-wide opacity-70 mb-2">
                      {isFlipped ? 'Answer' : 'Term'}
                    </p>
                    <p className="text-xl font-medium">
                      {isFlipped
                        ? content.flashcards[currentCard].back
                        : content.flashcards[currentCard].front}
                    </p>
                    <p className="text-xs mt-4 opacity-70">Click to flip</p>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => {
                      setCurrentCard(Math.max(0, currentCard - 1));
                      setIsFlipped(false);
                    }}
                    disabled={currentCard === 0}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      setCurrentCard(Math.min(content.flashcards!.length - 1, currentCard + 1));
                      setIsFlipped(false);
                    }}
                    disabled={currentCard === content.flashcards.length - 1}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>

                {/* Card indicators */}
                <div className="flex justify-center gap-2">
                  {content.flashcards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentCard(idx);
                        setIsFlipped(false);
                      }}
                      className={`w-3 h-3 rounded-full transition ${
                        idx === currentCard ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Content Types</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '📝', title: 'Multiple Choice', desc: 'Auto-generated quizzes' },
              { icon: '🎴', title: 'Flashcards', desc: 'Key terms & concepts' },
              { icon: '✍️', title: 'Fill-in-Blank', desc: 'Coming soon' },
              { icon: '🎯', title: 'Matching', desc: 'Coming soon' },
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
