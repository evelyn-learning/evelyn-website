'use client';

import React, { useState, useEffect } from 'react';
import { safeAPICall } from '@core/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// Types
interface SessionMessage {
  role: 'student' | 'tutor';
  message: string;
  time: string;
}

interface Suggestion {
  type: 'primary' | 'secondary';
  title: string;
  suggestion: string;
  example?: string;
}

interface AISuggestions {
  suggestions: Suggestion[];
  conceptCheck: string;
  warningSign: string | null;
}

interface StudentData {
  name: string;
  grade: string;
  avatar: string;
  subject: string;
  topic: string;
  learningStyle: string;
  recentScores: number[];
  struggles: string[];
}

// Scenario data
const SCENARIO_DATA = {
  student: {
    name: "Alex M.",
    grade: "10th Grade",
    avatar: "👨‍🎓",
    subject: "Algebra II",
    topic: "Quadratic Equations",
    learningStyle: "Visual learner, needs examples",
    recentScores: [72, 78, 75, 80],
    struggles: ["Factoring trinomials", "Word problems", "Completing the square"]
  } as StudentData,
  sessionHistory: [
    { role: 'student' as const, message: "I don't understand why we need to factor these equations", time: '2:00 PM' },
    { role: 'tutor' as const, message: "Great question! Factoring helps us find where the parabola crosses the x-axis. Let me show you...", time: '2:01 PM' },
    { role: 'student' as const, message: "But what about when the numbers are weird? Like x² + 5x + 6?", time: '2:03 PM' }
  ] as SessionMessage[]
};

export default function TutoringCoPilot() {
  const trackInteraction = useTrackInteraction();
  const [sessionHistory, setSessionHistory] = useState<SessionMessage[]>(SCENARIO_DATA.sessionHistory);
  const [studentMessage, setStudentMessage] = useState('');
  const [tutorMessage, setTutorMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const tutorTips = [
    "Alex responds well to visual representations. Try drawing a parabola to show roots.",
    "Consider using a real-world example like projectile motion for quadratics.",
    "Alex's recent improvement suggests momentum—reinforce positive progress.",
    "Break factoring into smaller steps: find factors of c that add to b."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tutorTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tutorTips.length]);

  const generateSuggestions = async (context: string) => {
    setIsAnalyzing(true);
    setAiSuggestions(null);

    const systemPrompt = `You are an AI tutoring assistant helping a human tutor during a live session.
Provide 3-4 specific, actionable suggestions for how the tutor should respond to the student.

STUDENT PROFILE:
- Name: ${SCENARIO_DATA.student.name}
- Grade: ${SCENARIO_DATA.student.grade}
- Subject: ${SCENARIO_DATA.student.subject}
- Topic: ${SCENARIO_DATA.student.topic}
- Learning Style: ${SCENARIO_DATA.student.learningStyle}
- Struggles with: ${SCENARIO_DATA.student.struggles.join(', ')}
- Recent test scores: ${SCENARIO_DATA.student.recentScores.join(', ')} (showing improvement)

Your suggestions should:
1. Be specific to the student's question and learning style
2. Include at least one visual/concrete approach
3. Address any underlying misconceptions
4. Build on what the student already knows`;

    const recentContext = sessionHistory.slice(-6).map(m =>
      `${m.role.toUpperCase()}: ${m.message}`
    ).join('\n');

    const userPrompt = `The student just said: "${context}"

Recent conversation:
${recentContext}

Provide 3-4 specific suggestions for how the tutor should respond. Format as JSON:
{
  "suggestions": [
    {
      "type": "primary",
      "title": "Brief title",
      "suggestion": "Specific suggestion text",
      "example": "An example of what to say or do"
    }
  ],
  "conceptCheck": "A question the tutor could ask to check understanding",
  "warningSign": "Any misconception or struggle pattern detected (or null)"
}`;

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
          max_tokens: 1000
        })
      }
    );

    if (apiError) {
      console.error('Error:', apiError.message);
      setIsAnalyzing(false);
      return;
    }

    if (data?.text) {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as AISuggestions;
          trackInteraction('tool_use', 'suggestions_generated', { count: parsed.suggestions?.length });
          setAiSuggestions(parsed);
        } catch {
          console.error('Error parsing suggestions');
        }
      }
    }

    setIsAnalyzing(false);
  };

  const handleStudentMessage = () => {
    if (!studentMessage.trim()) return;

    const newMessage: SessionMessage = {
      role: 'student',
      message: studentMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSessionHistory(prev => [...prev, newMessage]);
    trackInteraction('message', studentMessage, undefined, 'student');
    generateSuggestions(studentMessage);
    setStudentMessage('');
  };

  const handleTutorMessage = () => {
    if (!tutorMessage.trim()) return;

    const newMessage: SessionMessage = {
      role: 'tutor',
      message: tutorMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSessionHistory(prev => [...prev, newMessage]);
    trackInteraction('message', tutorMessage, undefined, 'tutor');
    setTutorMessage('');
    setAiSuggestions(null);
  };

  const useSuggestion = (suggestion: Suggestion, index: number) => {
    trackInteraction('click', 'use_suggestion', { index });
    setTutorMessage(suggestion.example || suggestion.suggestion);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-1 rounded-full text-sm font-medium mb-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Live Session Demo
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Tutoring Co-Pilot
          </h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Real-time AI assistance for tutors. Get teaching suggestions, identify misconceptions,
            and personalize instruction on the fly.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-4">
          {/* Student Profile Panel */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{SCENARIO_DATA.student.avatar}</span>
                <div>
                  <h3 className="text-white font-semibold">{SCENARIO_DATA.student.name}</h3>
                  <p className="text-slate-400 text-sm">{SCENARIO_DATA.student.grade}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide">Current Topic</p>
                  <p className="text-white">{SCENARIO_DATA.student.topic}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide">Learning Style</p>
                  <p className="text-purple-300 text-sm">{SCENARIO_DATA.student.learningStyle}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Recent Scores</p>
                  <div className="flex gap-1">
                    {SCENARIO_DATA.student.recentScores.map((score, idx) => (
                      <div key={idx} className="flex-1">
                        <div className="h-12 bg-slate-700 rounded relative overflow-hidden">
                          <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-purple-400 transition-all"
                            style={{ height: `${score}%` }}
                          />
                        </div>
                        <p className="text-center text-xs text-slate-400 mt-1">{score}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-green-400 text-xs mt-1">📈 Trending up</p>
                </div>
              </div>
            </div>

            {/* Struggles */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700">
              <h4 className="text-white font-medium mb-3">Known Struggles</h4>
              <div className="space-y-2">
                {SCENARIO_DATA.student.struggles.map((struggle, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                    <span className="text-slate-300">{struggle}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rotating Tips */}
            <div className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur rounded-2xl p-4 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <h4 className="text-white font-medium">AI Insight</h4>
              </div>
              <p className="text-purple-200 text-sm leading-relaxed">
                {tutorTips[currentTip]}
              </p>
              <div className="flex gap-1 mt-3">
                {tutorTips.map((_, idx) => (
                  <div key={idx} className={`h-1 flex-1 rounded-full transition-all ${
                    idx === currentTip ? 'bg-purple-400' : 'bg-slate-600'
                  }`} />
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Session Chat</h3>
                  <p className="text-slate-400 text-sm">{SCENARIO_DATA.student.subject} - {SCENARIO_DATA.student.topic}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sessionHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'tutor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${msg.role === 'tutor' ? 'order-1' : ''}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.role === 'tutor'
                          ? 'bg-purple-600 text-white rounded-br-md'
                          : 'bg-slate-700 text-slate-200 rounded-bl-md'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className={`text-xs text-slate-500 mt-1 ${msg.role === 'tutor' ? 'text-right' : ''}`}>
                        {msg.role === 'tutor' ? '👨‍🏫 Tutor' : '👨‍🎓 Student'} - {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Areas */}
              <div className="p-4 border-t border-slate-700 space-y-3">
                {/* Student Input (Simulation) */}
                <div>
                  <label className="text-slate-400 text-xs uppercase tracking-wide mb-1 block">
                    Simulate Student Message
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={studentMessage}
                      onChange={(e) => setStudentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleStudentMessage()}
                      placeholder="Type what the student says..."
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleStudentMessage}
                      className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>

                {/* Tutor Input */}
                <div>
                  <label className="text-purple-400 text-xs uppercase tracking-wide mb-1 block">
                    Your Response (Tutor)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tutorMessage}
                      onChange={(e) => setTutorMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTutorMessage()}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-2 bg-purple-900/50 border border-purple-700 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleTutorMessage}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions Panel */}
          <div className="lg:col-span-4">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 h-[600px] flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <h3 className="text-white font-semibold">AI Co-Pilot Suggestions</h3>
                </div>
                <p className="text-slate-400 text-sm mt-1">Real-time teaching recommendations</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Analyzing student response...</p>
                  </div>
                ) : aiSuggestions?.suggestions ? (
                  <div className="space-y-4">
                    {/* Warning if detected */}
                    {aiSuggestions.warningSign && (
                      <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span>⚠️</span>
                          <span className="text-amber-400 font-medium text-sm">Misconception Detected</span>
                        </div>
                        <p className="text-amber-200 text-sm">{aiSuggestions.warningSign}</p>
                      </div>
                    )}

                    {/* Suggestions */}
                    {aiSuggestions.suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                          sug.type === 'primary'
                            ? 'bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/30'
                            : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                        }`}
                        onClick={() => useSuggestion(sug, idx)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm">{sug.title}</span>
                          {sug.type === 'primary' && (
                            <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{sug.suggestion}</p>
                        {sug.example && (
                          <div className="p-2 bg-slate-800 rounded-lg">
                            <p className="text-xs text-slate-400 mb-1">Example:</p>
                            <p className="text-slate-200 text-sm italic">&quot;{sug.example}&quot;</p>
                          </div>
                        )}
                        <p className="text-purple-400 text-xs mt-2">Click to use →</p>
                      </div>
                    ))}

                    {/* Concept Check */}
                    {aiSuggestions.conceptCheck && (
                      <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span>❓</span>
                          <span className="text-blue-400 font-medium text-sm">Concept Check Question</span>
                        </div>
                        <p className="text-blue-200 text-sm">{aiSuggestions.conceptCheck}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                    <span className="text-4xl mb-4">💬</span>
                    <p>Send a student message to see AI suggestions</p>
                    <p className="text-sm mt-2">The co-pilot analyzes context and provides personalized teaching recommendations</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-6 bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4 text-center">Co-Pilot Capabilities</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🎯', title: 'Personalized Suggestions', desc: "Tailored to each student's learning style and history" },
              { icon: '⚡', title: 'Real-Time Analysis', desc: 'Instant insights as the conversation unfolds' },
              { icon: '🔍', title: 'Misconception Detection', desc: 'Identifies and flags conceptual misunderstandings' },
              { icon: '📈', title: 'Progress Tracking', desc: 'Integrates with student performance data' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4">
                <span className="text-2xl">{feature.icon}</span>
                <h4 className="text-white font-medium mt-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
