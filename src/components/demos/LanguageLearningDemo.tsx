'use client';

import React, { useState, useRef, useEffect } from 'react';
import { safeAPICall } from '@/lib/utils/api-error-handler';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  translation?: string;
}

const LANGUAGES = {
  spanish: { name: 'Spanish', flag: '🇪🇸', greeting: '¡Hola! ¿Cómo estás?' },
  french: { name: 'French', flag: '🇫🇷', greeting: 'Bonjour! Comment allez-vous?' },
  german: { name: 'German', flag: '🇩🇪', greeting: 'Hallo! Wie geht es Ihnen?' },
  japanese: { name: 'Japanese', flag: '🇯🇵', greeting: 'こんにちは！お元気ですか？' },
  mandarin: { name: 'Mandarin', flag: '🇨🇳', greeting: '你好！你好吗？' },
};

const SCENARIOS = {
  cafe: { name: 'At a Café', icon: '☕', description: 'Order food and drinks' },
  shopping: { name: 'Shopping', icon: '🛍️', description: 'Buy items at a store' },
  directions: { name: 'Asking Directions', icon: '🗺️', description: 'Navigate the city' },
  introduction: { name: 'Meeting People', icon: '👋', description: 'Introduce yourself' },
};

const DIFFICULTY_LEVELS = {
  beginner: { name: 'Beginner', description: 'Simple vocabulary, slow pace' },
  intermediate: { name: 'Intermediate', description: 'Varied vocabulary, natural pace' },
  advanced: { name: 'Advanced', description: 'Complex structures, idioms' },
};

export default function LanguageLearningDemo() {
  const [language, setLanguage] = useState<keyof typeof LANGUAGES>('spanish');
  const [scenario, setScenario] = useState<keyof typeof SCENARIOS>('cafe');
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY_LEVELS>('beginner');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Scroll within the messages container, not the whole page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = async () => {
    setMessages([]);
    setIsLoading(true);

    const langInfo = LANGUAGES[language];
    const scenarioInfo = SCENARIOS[scenario];
    const difficultyInfo = DIFFICULTY_LEVELS[difficulty];

    const systemPrompt = `You are a language learning conversation partner for ${langInfo.name}.

Scenario: ${scenarioInfo.name} - ${scenarioInfo.description}
Difficulty: ${difficultyInfo.name} - ${difficultyInfo.description}

Rules:
1. Start the conversation in ${langInfo.name} as a native speaker in the scenario
2. Keep responses appropriate for ${difficultyInfo.name} level
3. Be encouraging and helpful
4. If the user makes a mistake, gently correct them
5. Provide translations in parentheses for key phrases at ${difficultyInfo.name === 'beginner' ? 'all' : difficultyInfo.name === 'intermediate' ? 'some' : 'few'} times
6. Keep responses conversational and realistic to the scenario

Start the conversation now as if you are the ${scenarioInfo.name === 'At a Café' ? 'café worker' : scenarioInfo.name === 'Shopping' ? 'shop assistant' : scenarioInfo.name === 'Asking Directions' ? 'helpful local' : 'new acquaintance'}.`;

    const userPrompt = `Start the ${scenarioInfo.name} conversation in ${langInfo.name}. Provide the opening line that would be natural for this scenario.

Format your response as JSON:
{
  "message": "your message in ${langInfo.name}",
  "translation": "English translation"
}`;

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 500,
        }),
      }
    );

    if (apiError) {
      console.error('Error starting conversation:', apiError.message);
      setIsLoading(false);
      return;
    }

    if (data?.text) {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          setMessages([{
            role: 'assistant',
            content: parsed.message,
            translation: parsed.translation
          }]);
        } catch {
          console.error('Error parsing conversation response');
        }
      }
    }

    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const langInfo = LANGUAGES[language];
    const scenarioInfo = SCENARIOS[scenario];
    const difficultyInfo = DIFFICULTY_LEVELS[difficulty];

    const systemPrompt = `You are a language learning conversation partner for ${langInfo.name}.
Scenario: ${scenarioInfo.name}
Difficulty: ${difficultyInfo.name}

Continue the conversation naturally. If the user writes in English, respond in ${langInfo.name} but be understanding. If they make grammar mistakes in ${langInfo.name}, gently incorporate the correction in your response.

Always respond in JSON format:
{
  "message": "your response in ${langInfo.name}",
  "translation": "English translation",
  "correction": "optional - if user made a mistake, explain it kindly in English"
}`;

    const conversationHistory = messages.map(m => ({
      role: m.role,
      content: m.content
    }));
    conversationHistory.push({ role: 'user', content: input });

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          system: systemPrompt,
          max_tokens: 500,
        }),
      }
    );

    if (apiError) {
      console.error('Error sending message:', apiError.message);
      setIsLoading(false);
      return;
    }

    if (data?.text) {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: parsed.message,
            translation: parsed.translation
          }]);

          if (parsed.correction) {
            setMessages(prev => [...prev, {
              role: 'system',
              content: `💡 Tip: ${parsed.correction}`
            }]);
          }
        } catch {
          console.error('Error parsing message response');
        }
      }
    }

    setIsLoading(false);
  };

  const suggestResponse = async () => {
    if (isLoading || messages.length === 0) return;
    setIsLoading(true);

    const langInfo = LANGUAGES[language];
    const difficultyInfo = DIFFICULTY_LEVELS[difficulty];

    const systemPrompt = `Suggest a response the language learner could say in ${langInfo.name} at ${difficultyInfo.name} level.`;

    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `The conversation partner just said: "${lastAssistantMessage?.content}"

Suggest what the learner could say next in ${langInfo.name}. Give 2-3 options at ${difficultyInfo.name} level.

Format as JSON:
{
  "suggestions": [
    {"text": "phrase in ${langInfo.name}", "translation": "English"}
  ]
}`
          }],
          system: systemPrompt,
          max_tokens: 300,
        }),
      }
    );

    if (apiError) {
      console.error('Error getting suggestions:', apiError.message);
      setIsLoading(false);
      return;
    }

    if (data?.text) {
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          // Show suggestions as a system message
          const suggestionText = parsed.suggestions
            .map((s: { text: string; translation: string }) => `• ${s.text} (${s.translation})`)
            .join('\n');
          setMessages(prev => [...prev, {
            role: 'system',
            content: `💬 Suggestions:\n${suggestionText}`
          }]);
        } catch {
          console.error('Error parsing suggestions');
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-2xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Language Learning AI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice conversations in real-world scenarios with an AI language partner.
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Conversation Settings</h3>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Language */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Language</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(LANGUAGES).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => setLanguage(key as keyof typeof LANGUAGES)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                      language === key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Scenario</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SCENARIOS).map(([key, scn]) => (
                  <button
                    key={key}
                    onClick={() => setScenario(key as keyof typeof SCENARIOS)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                      scenario === key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{scn.icon}</span>
                    {scn.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Level</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key as keyof typeof DIFFICULTY_LEVELS)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      difficulty === key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startConversation}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            {messages.length > 0 ? 'Restart Conversation' : 'Start Conversation'}
          </button>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{LANGUAGES[language].flag}</span>
                <div>
                  <h3 className="font-semibold">{LANGUAGES[language].name} Practice</h3>
                  <p className="text-xs text-indigo-200">{SCENARIOS[scenario].name} • {DIFFICULTY_LEVELS[difficulty].name}</p>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showTranslations}
                  onChange={(e) => setShowTranslations(e.target.checked)}
                  className="rounded"
                />
                Show translations
              </label>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">💬</span>
                  <p>Click &quot;Start Conversation&quot; to begin practicing</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : msg.role === 'system'
                        ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    {showTranslations && msg.translation && msg.role === 'assistant' && (
                      <p className="text-sm mt-2 pt-2 border-t border-gray-200 text-gray-500 italic">
                        {msg.translation}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <button
                onClick={suggestResponse}
                disabled={isLoading || messages.length === 0}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition disabled:opacity-50 text-sm font-medium"
              >
                💡 Hint
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Type in ${LANGUAGES[language].name} or English...`}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={messages.length === 0}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim() || messages.length === 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Learning Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🌍', title: '5 Languages', desc: 'Spanish, French, German, Japanese, Mandarin' },
              { icon: '🎭', title: 'Real Scenarios', desc: 'Practical conversation practice' },
              { icon: '📊', title: '3 Levels', desc: 'Beginner to advanced' },
              { icon: '💡', title: 'Smart Hints', desc: 'AI-powered suggestions' },
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
