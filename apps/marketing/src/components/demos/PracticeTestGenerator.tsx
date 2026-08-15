'use client';

import React, { useState } from 'react';
import { safeAPICall } from '@core/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// Types
interface TestType {
  id: string;
  name: string;
  icon: string;
  color: string;
  subjects: string[];
}

interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  concept: string;
  difficulty: string;
}

// Data
const TEST_TYPES: TestType[] = [
  { id: 'sat-math', name: 'SAT Math', icon: '📐', color: 'blue', subjects: ['Algebra', 'Geometry', 'Data Analysis', 'Advanced Math'] },
  { id: 'sat-reading', name: 'SAT Reading & Writing', icon: '📖', color: 'purple', subjects: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Evidence-Based Writing'] },
  { id: 'act-math', name: 'ACT Math', icon: '🔢', color: 'green', subjects: ['Pre-Algebra', 'Algebra', 'Geometry', 'Trigonometry'] },
  { id: 'act-science', name: 'ACT Science', icon: '🔬', color: 'teal', subjects: ['Data Representation', 'Research Summaries', 'Conflicting Viewpoints'] },
  { id: 'ap-calc', name: 'AP Calculus', icon: '∫', color: 'red', subjects: ['Limits', 'Derivatives', 'Integrals', 'Applications'] },
  { id: 'ap-physics', name: 'AP Physics', icon: '⚡', color: 'amber', subjects: ['Mechanics', 'Electricity', 'Waves', 'Thermodynamics'] }
];

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { id: 'easy', name: 'Easy', description: 'Foundational concepts', color: 'green' },
  { id: 'medium', name: 'Medium', description: 'Standard test difficulty', color: 'yellow' },
  { id: 'hard', name: 'Hard', description: 'Challenging problems', color: 'red' }
];

export default function PracticeTestGenerator() {
  const trackInteraction = useTrackInteraction();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async () => {
    if (!selectedTest || !selectedSubject) {
      setError('Please select a test type and subject area.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setQuestions(null);
    setUserAnswers({});
    setShowResults(false);

    trackInteraction('tool_use', 'generate_test', { testType: selectedTest, subject: selectedSubject, difficulty, questionCount });

    const testInfo = TEST_TYPES.find(t => t.id === selectedTest);

    const systemPrompt = `You are an expert test question writer for standardized tests. Create high-quality, original practice questions that accurately reflect the style, difficulty, and format of real exams.

REQUIREMENTS:
- Questions should be unique and not copied from existing materials
- Include realistic answer choices with plausible distractors
- Provide detailed explanations for each answer
- Match the specified difficulty level
- Use proper mathematical notation where needed`;

    const userPrompt = `Generate ${questionCount} ${difficulty} difficulty multiple-choice questions for ${testInfo?.name}, specifically covering ${selectedSubject}.

Format your response as JSON with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "The question text (use \\n for line breaks if needed)",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correctAnswer": "A",
      "explanation": "Detailed explanation of why this answer is correct and why others are wrong",
      "concept": "The specific concept being tested",
      "difficulty": "${difficulty}"
    }
  ]
}

Make the questions authentic to ${testInfo?.name} style and ${difficulty} difficulty. Include word problems, graphs descriptions, or passage-based questions as appropriate for this test type.`;

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 4000
        })
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
          const parsed = JSON.parse(jsonMatch[0]);
          trackInteraction('tool_use', 'test_generated', { questionCount: parsed.questions.length });
          setQuestions(parsed.questions);
        } catch {
          setError('Could not parse questions. Please try again.');
        }
      } else {
        setError('Could not parse questions. Please try again.');
      }
    } else {
      setError('No response received. Please try again.');
    }

    setIsGenerating(false);
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const checkAnswers = () => {
    if (questions) {
      const correct = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
      const score = { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
      trackInteraction('click', 'check_answers', { score });
    }
    setShowResults(true);
  };

  const getScore = () => {
    if (!questions) return { correct: 0, total: 0, percentage: 0 };
    const correct = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const resetQuiz = () => {
    setQuestions(null);
    setUserAnswers({});
    setShowResults(false);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-6 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Practice Test Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate unlimited, unique practice questions tailored to specific subjects and difficulty levels.
            Every test is different—no memorization of answers possible.
          </p>
        </div>

        {!questions ? (
          /* Configuration Panel */
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Test Type Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Select Test Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TEST_TYPES.map(test => (
                  <button
                    key={test.id}
                    onClick={() => {
                      setSelectedTest(test.id);
                      setSelectedSubject(null);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTest === test.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{test.icon}</span>
                    <p className="font-medium text-gray-800 mt-2">{test.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            {selectedTest && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Select Subject Area</h2>
                <div className="flex flex-wrap gap-2">
                  {TEST_TYPES.find(t => t.id === selectedTest)?.subjects.map(subject => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`px-4 py-2 rounded-full border-2 transition-all ${
                        selectedSubject === subject
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty & Count */}
            {selectedSubject && (
              <>
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">3. Set Difficulty</h2>
                  <div className="flex gap-3">
                    {DIFFICULTY_LEVELS.map(level => (
                      <button
                        key={level.id}
                        onClick={() => setDifficulty(level.id)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          difficulty === level.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-800">{level.name}</p>
                        <p className="text-sm text-gray-500">{level.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">4. Number of Questions</h2>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <span className="w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold rounded-xl">
                      {questionCount}
                    </span>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateQuestions}
              disabled={!selectedTest || !selectedSubject || isGenerating}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating {questionCount} Questions...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Practice Test
                </>
              )}
            </button>

            {/* Loading overlay when generating */}
            {isGenerating && (
              <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-emerald-800 font-medium">Creating your personalized test...</p>
                <p className="text-emerald-600 text-sm mt-2">This may take 15-30 seconds as we generate unique questions tailored to your selections.</p>
              </div>
            )}
          </div>
        ) : (
          /* Questions Display */
          <div className="space-y-6">
            {/* Quiz Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {TEST_TYPES.find(t => t.id === selectedTest)?.name} - {selectedSubject}
                  </h2>
                  <p className="text-gray-500">
                    {questions.length} questions - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty
                  </p>
                </div>
                {showResults && (
                  <div className={`px-6 py-3 rounded-xl font-bold text-lg ${
                    getScore().percentage >= 80 ? 'bg-green-100 text-green-700' :
                    getScore().percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Score: {getScore().correct}/{getScore().total} ({getScore().percentage}%)
                  </div>
                )}
              </div>
            </div>

            {/* Questions */}
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-4 whitespace-pre-line">{q.question}</p>

                    <div className="space-y-2">
                      {Object.entries(q.options).map(([key, value]) => {
                        const isSelected = userAnswers[q.id] === key;
                        const isCorrect = q.correctAnswer === key;

                        let buttonStyle = 'border-gray-200 hover:border-gray-300';
                        if (showResults) {
                          if (isCorrect) buttonStyle = 'border-green-500 bg-green-50';
                          else if (isSelected && !isCorrect) buttonStyle = 'border-red-500 bg-red-50';
                        } else if (isSelected) {
                          buttonStyle = 'border-emerald-500 bg-emerald-50';
                        }

                        return (
                          <button
                            key={key}
                            onClick={() => handleAnswerSelect(q.id, key)}
                            disabled={showResults}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${buttonStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                showResults && isCorrect ? 'bg-green-500 text-white' :
                                showResults && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                                isSelected ? 'bg-emerald-500 text-white' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {key}
                              </span>
                              <span className="text-gray-700">{value}</span>
                              {showResults && isCorrect && (
                                <svg className="w-5 h-5 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {showResults && isSelected && !isCorrect && (
                                <svg className="w-5 h-5 text-red-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {showResults && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm font-semibold text-blue-800 mb-1">Explanation</p>
                        <p className="text-sm text-blue-900">{q.explanation}</p>
                        <p className="text-xs text-blue-600 mt-2">
                          <strong>Concept:</strong> {q.concept}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!showResults ? (
                <button
                  onClick={checkAnswers}
                  disabled={Object.keys(userAnswers).length !== questions.length}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition disabled:opacity-50"
                >
                  Check Answers ({Object.keys(userAnswers).length}/{questions.length} answered)
                </button>
              ) : (
                <>
                  <button
                    onClick={resetQuiz}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                  >
                    New Test (Same Settings)
                  </button>
                  <button
                    onClick={() => {
                      setQuestions(null);
                      setSelectedTest(null);
                      setSelectedSubject(null);
                    }}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition"
                  >
                    Change Settings
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Platform Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🎲', title: 'Always Unique', desc: 'Every test is newly generated—no answer memorization' },
              { icon: '📊', title: 'Difficulty Control', desc: 'Match questions to student skill level' },
              { icon: '📝', title: 'Detailed Explanations', desc: 'Learn from every question, right or wrong' },
              { icon: '🎯', title: 'Topic Targeting', desc: 'Focus practice on specific weak areas' }
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
