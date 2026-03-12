'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { safeAPICall } from '@/lib/utils/api-error-handler';

// ── Types ──

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  translation?: string;
  correction?: string;
}

interface VocabWord {
  word: string;
  translation: string;
  context?: string;
}

// ── Constants ──

const LANGUAGES = {
  spanish: { name: 'Spanish', flag: '🇪🇸', code: 'es-ES', greeting: '¡Hola! ¿Cómo estás?' },
  french: { name: 'French', flag: '🇫🇷', code: 'fr-FR', greeting: 'Bonjour! Comment allez-vous?' },
  german: { name: 'German', flag: '🇩🇪', code: 'de-DE', greeting: 'Hallo! Wie geht es Ihnen?' },
  japanese: { name: 'Japanese', flag: '🇯🇵', code: 'ja-JP', greeting: 'こんにちは！お元気ですか？' },
  mandarin: { name: 'Mandarin', flag: '🇨🇳', code: 'zh-CN', greeting: '你好！你好吗？' },
};

const SCENARIOS = {
  cafe: { name: 'At a Café', icon: '☕', description: 'Order food and drinks', role: 'café worker' },
  shopping: { name: 'Shopping', icon: '🛍️', description: 'Buy items at a store', role: 'shop assistant' },
  directions: { name: 'Asking Directions', icon: '🗺️', description: 'Navigate the city', role: 'helpful local' },
  introduction: { name: 'Meeting People', icon: '👋', description: 'Introduce yourself', role: 'new acquaintance' },
  restaurant: { name: 'At a Restaurant', icon: '🍽️', description: 'Make reservations, order food', role: 'restaurant host' },
  doctor: { name: 'Doctor Visit', icon: '🏥', description: 'Describe symptoms, understand advice', role: 'doctor' },
  airport: { name: 'At the Airport', icon: '✈️', description: 'Check in, find your gate', role: 'airline agent' },
  school: { name: 'At School', icon: '🏫', description: 'Talk with classmates and teachers', role: 'classmate' },
  hotel: { name: 'Hotel Check-in', icon: '🏨', description: 'Book a room, ask about amenities', role: 'hotel receptionist' },
  market: { name: 'Street Market', icon: '🧺', description: 'Bargain and buy local goods', role: 'market vendor' },
};

const DIFFICULTY_LEVELS = {
  beginner: { name: 'Beginner', label: 'A1-A2', description: 'Simple vocabulary, slow pace, frequent translations' },
  intermediate: { name: 'Intermediate', label: 'B1-B2', description: 'Varied vocabulary, natural pace, some idioms' },
  advanced: { name: 'Advanced', label: 'C1-C2', description: 'Complex structures, idioms, cultural nuances' },
};

type LanguageKey = keyof typeof LANGUAGES;
type ScenarioKey = keyof typeof SCENARIOS;
type DifficultyKey = keyof typeof DIFFICULTY_LEVELS;

// ── Helpers ──

const buildSystemPrompt = (language: LanguageKey, scenario: ScenarioKey, difficulty: DifficultyKey) => {
  const lang = LANGUAGES[language];
  const scn = SCENARIOS[scenario];
  const diff = DIFFICULTY_LEVELS[difficulty];
  const translationFreq = difficulty === 'beginner' ? 'always' : difficulty === 'intermediate' ? 'for key phrases' : 'rarely';

  return `You are a native ${lang.name} speaker acting as a conversation partner for a language learner.

SCENARIO: You are a ${scn.role} in a "${scn.name}" scenario (${scn.description}).
DIFFICULTY: ${diff.name} (CEFR ${diff.label}) - ${diff.description}

RULES:
1. Respond ONLY in ${lang.name} as your character in the scenario.
2. Keep vocabulary and grammar appropriate for ${diff.name} level.
3. If the learner writes in English, still respond in ${lang.name} but be understanding.
4. If the learner makes a grammar/vocabulary mistake in ${lang.name}, weave the correction into your response naturally AND note it in the correction field.
5. Provide English translations ${translationFreq}.
6. Keep responses natural, conversational, and realistic to the scenario (2-4 sentences).
7. After your response, identify 1-3 key vocabulary words/phrases from YOUR response that would be useful for the learner.

ALWAYS respond in this exact JSON format:
{
  "message": "your response in ${lang.name}",
  "translation": "English translation of your response",
  "correction": "if learner made a mistake, explain it kindly in English (null if no mistake)",
  "vocabulary": [
    {"word": "word/phrase in ${lang.name}", "translation": "English meaning"}
  ]
}`;
};

// ── Component ──

export default function LanguageLearningDemo() {
  // Settings
  const [language, setLanguage] = useState<LanguageKey>('spanish');
  const [scenario, setScenario] = useState<ScenarioKey>('cafe');
  const [difficulty, setDifficulty] = useState<DifficultyKey>('beginner');

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranslations, setShowTranslations] = useState(true);

  // Vocabulary tracker
  const [vocabulary, setVocabulary] = useState<VocabWord[]>([]);

  // Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    requestAnimationFrame(() => scrollToBottom());
  }, [messages, scrollToBottom]);

  // Computed stats
  const corrections = useMemo(() => messages.filter(m => m.correction).length, [messages]);
  const exchanges = useMemo(() => messages.filter(m => m.role === 'user').length, [messages]);

  // ── Speech Functions (OpenAI TTS + Whisper STT) ──

  const isSpeakingRef = useRef(false);
  const speakText = useCallback(async (text: string) => {
    if (isSpeakingRef.current) return;
    isSpeakingRef.current = true;
    setIsSpeaking(true);

    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const speed = difficulty === 'beginner' ? 0.7 : difficulty === 'intermediate' ? 0.75 : 0.85;

      const response = await fetch('/api/showcase/language-learning/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speed }),
      });

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      audio.onerror = () => {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      isSpeakingRef.current = false;
      setIsSpeaking(false);
    }
  }, [difficulty]);

  const toggleListening = useCallback(async () => {
    // Stop recording
    if (isListening && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      return;
    }

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(t => t.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size < 100) return; // Too short

        // Send to Whisper
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('language', LANGUAGES[language].code);

        try {
          const response = await fetch('/api/showcase/language-learning/stt', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const { text } = await response.json();
            if (text) {
              setInput(prev => prev ? `${prev} ${text}` : text);
            }
          }
        } catch (err) {
          console.error('STT error:', err);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Microphone error:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  }, [isListening, language]);

  // ── API Calls ──

  const parseAIResponse = (text: string): { message: string; translation: string; correction: string | null; vocabulary: VocabWord[] } | null => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        message: parsed.message || '',
        translation: parsed.translation || '',
        correction: parsed.correction || null,
        vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
      };
    } catch {
      return null;
    }
  };

  const startConversation = async () => {
    setMessages([]);
    setVocabulary([]);
    setError(null);
    setIsLoading(true);

    const lang = LANGUAGES[language];
    const scn = SCENARIOS[scenario];
    const systemPrompt = buildSystemPrompt(language, scenario, difficulty);

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Start the ${scn.name} conversation in ${lang.name}. Give the opening line as the ${scn.role}.` }],
          system: systemPrompt,
          max_tokens: 500,
        }),
      }
    );

    if (apiError) {
      setError(apiError.message);
      setIsLoading(false);
      return;
    }

    if (data?.text) {
      const parsed = parseAIResponse(data.text);
      if (parsed) {
        setMessages([{
          role: 'assistant',
          content: parsed.message,
          translation: parsed.translation,
        }]);
        if (parsed.vocabulary.length > 0) {
          setVocabulary(parsed.vocabulary.map(v => ({ ...v, context: parsed.message })));
        }
      } else {
        setError('Could not start conversation. Please try again.');
      }
    }

    setIsLoading(false);
  };

  const sendMessage = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading || messages.length === 0) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    const systemPrompt = buildSystemPrompt(language, scenario, difficulty);
    const conversationHistory = messages.map(m => ({
      role: m.role === 'system' ? 'assistant' as const : m.role,
      content: m.content,
    }));
    conversationHistory.push({ role: 'user', content: messageText });

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
      setError(apiError.message);
      setIsLoading(false);
      return;
    }

    if (data?.text) {
      const parsed = parseAIResponse(data.text);
      if (parsed) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: parsed.message,
          translation: parsed.translation,
          correction: parsed.correction || undefined,
        }]);
        // Add new vocabulary (deduplicate)
        if (parsed.vocabulary.length > 0) {
          setVocabulary(prev => {
            const existing = new Set(prev.map(v => v.word.toLowerCase()));
            const newWords = parsed.vocabulary
              .filter((v: VocabWord) => !existing.has(v.word.toLowerCase()))
              .map((v: VocabWord) => ({ ...v, context: parsed.message }));
            return [...prev, ...newWords];
          });
        }
      } else {
        setError('Could not parse response. Please try again.');
      }
    }

    setIsLoading(false);
  };

  const suggestResponse = async () => {
    if (isLoading || messages.length === 0) return;
    setIsLoading(true);
    setError(null);

    const lang = LANGUAGES[language];
    const diff = DIFFICULTY_LEVELS[difficulty];
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');

    const { data, error: apiError } = await safeAPICall<{ text?: string }>(
      '/api/ai/claude',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `The conversation partner just said: "${lastAssistant?.content}"

Suggest 2-3 responses the learner could say in ${lang.name} at ${diff.name} (CEFR ${diff.label}) level.

Format as JSON:
{
  "suggestions": [
    {"text": "phrase in ${lang.name}", "translation": "English meaning"}
  ]
}`
          }],
          system: `You suggest ${lang.name} responses for a language learner at ${diff.name} level.`,
          max_tokens: 300,
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
          const parsed = JSON.parse(jsonMatch[0]);
          const suggestionText = parsed.suggestions
            .map((s: { text: string; translation: string }) => `• ${s.text} (${s.translation})`)
            .join('\n');
          setMessages(prev => [...prev, {
            role: 'system',
            content: `💬 Suggested responses:\n${suggestionText}`
          }]);
        } catch {
          setError('Could not parse suggestions.');
        }
      }
    }

    setIsLoading(false);
  };

  const handleExportPDF = async () => {
    try {
      const { exportLanguageSessionPDF } = await import('@/lib/utils/export/pdf-language-session');
      await exportLanguageSessionPDF(
        messages, vocabulary,
        LANGUAGES[language].name,
        SCENARIOS[scenario].name,
        DIFFICULTY_LEVELS[difficulty].name,
        corrections
      );
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  // ── Render ──

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
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
            Practice real conversations with an AI language partner. Get corrections,
            build vocabulary, and improve pronunciation — all at your level.
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Conversation Settings</h3>

          <div className="space-y-4">
            {/* Language */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Language</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(LANGUAGES).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => setLanguage(key as LanguageKey)}
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
                    onClick={() => setScenario(key as ScenarioKey)}
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
                    onClick={() => setDifficulty(key as DifficultyKey)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      difficulty === key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level.name} <span className="opacity-70 text-xs">({level.label})</span>
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
            {messages.length > 0 ? 'New Conversation' : 'Start Conversation'}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Chat - 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{LANGUAGES[language].flag}</span>
                    <div>
                      <h3 className="font-semibold">{LANGUAGES[language].name} Practice</h3>
                      <p className="text-xs text-indigo-200">
                        {SCENARIOS[scenario].name} · {DIFFICULTY_LEVELS[difficulty].name} ({DIFFICULTY_LEVELS[difficulty].label})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showTranslations}
                        onChange={(e) => setShowTranslations(e.target.checked)}
                        className="rounded"
                      />
                      Translations
                    </label>
                    {messages.length > 1 && (
                      <button
                        onClick={handleExportPDF}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                        title="Export session as PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="h-[420px] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <span className="text-5xl mb-4 block">💬</span>
                      <p>Choose your settings and click &quot;Start Conversation&quot;</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx}>
                      {msg.role === 'system' ? (
                        <div className="flex justify-center">
                          <div className="max-w-[85%] bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                            <p className="text-sm text-yellow-800 whitespace-pre-line">{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[80%] rounded-2xl p-4 ${
                              msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.content}</p>

                            {/* Translation (inline) */}
                            {showTranslations && msg.translation && msg.role === 'assistant' && (
                              <p className="text-sm mt-2 pt-2 border-t border-gray-200 text-gray-500 italic">
                                {msg.translation}
                              </p>
                            )}

                            {/* Inline correction */}
                            {msg.correction && msg.role === 'assistant' && (
                              <div className="mt-2 pt-2 border-t border-amber-200 bg-amber-50 -mx-4 -mb-4 px-4 py-2 rounded-b-2xl">
                                <p className="text-xs text-amber-700">
                                  <strong>📝 Correction:</strong> {msg.correction}
                                </p>
                              </div>
                            )}

                            {/* Speaker button for assistant messages */}
                            {msg.role === 'assistant' && (
                              <button
                                onClick={() => speakText(msg.content)}
                                disabled={isSpeaking}
                                className={`mt-2 text-xs flex items-center gap-1 ${
                                  isSpeaking ? 'text-indigo-400' : 'text-gray-400 hover:text-indigo-600'
                                } transition`}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                                {isSpeaking ? 'Speaking...' : 'Listen'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
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
              </div>

              {/* Error */}
              {error && (
                <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <button
                    onClick={suggestResponse}
                    disabled={isLoading || messages.length === 0}
                    className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition disabled:opacity-50 text-sm font-medium"
                    title="Get response suggestions"
                  >
                    💡
                  </button>
                  <button
                    onClick={toggleListening}
                    disabled={messages.length === 0}
                    className={`px-3 py-2 rounded-xl transition text-sm font-medium ${
                      isListening
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 animate-pulse'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } disabled:opacity-50`}
                    title={isListening ? 'Stop listening' : `Speak in ${LANGUAGES[language].name}`}
                  >
                    🎤
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={messages.length === 0 ? 'Start a conversation first...' : `Type in ${LANGUAGES[language].name} or English...`}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={messages.length === 0}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim() || messages.length === 0}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
                {isListening && (
                  <p className="text-xs text-red-500 mt-1 text-center animate-pulse">
                    Listening in {LANGUAGES[language].name}... speak now
                  </p>
                )}
              </div>
            </div>

            {/* Session Summary (shown after 3+ exchanges) */}
            {exchanges >= 3 && (
              <div className="mt-4 bg-white rounded-2xl shadow-lg p-5">
                <h4 className="font-semibold text-gray-800 mb-3">Session Summary</h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-indigo-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-indigo-700">{exchanges}</div>
                    <div className="text-xs text-gray-500">Exchanges</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-green-700">{vocabulary.length}</div>
                    <div className="text-xs text-gray-500">New Words</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-amber-700">{corrections}</div>
                    <div className="text-xs text-gray-500">Corrections</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-purple-700">{DIFFICULTY_LEVELS[difficulty].label}</div>
                    <div className="text-xs text-gray-500">CEFR Level</div>
                  </div>
                </div>
                <button
                  onClick={handleExportPDF}
                  className="mt-3 w-full py-2 bg-indigo-100 text-indigo-700 font-medium rounded-xl hover:bg-indigo-200 transition text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Session Report
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Vocabulary Tracker */}
          <div className="lg:col-span-1 space-y-4">
            {/* Vocabulary Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📖 Vocabulary
                {vocabulary.length > 0 && (
                  <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {vocabulary.length}
                  </span>
                )}
              </h3>
              {vocabulary.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  New words will appear here as you practice
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {vocabulary.map((word, idx) => (
                    <div key={idx} className="p-2 bg-indigo-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-indigo-900 text-sm">{word.word}</span>
                        <button
                          onClick={() => speakText(word.word)}
                          className="text-indigo-400 hover:text-indigo-600 transition"
                          title="Pronounce"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">{word.translation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session Stats */}
            {messages.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
                <h3 className="font-semibold mb-3">This Session</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-indigo-200 text-sm">Exchanges</span>
                    <span className="font-bold">{exchanges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200 text-sm">Corrections</span>
                    <span className="font-bold">{corrections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200 text-sm">Words Learned</span>
                    <span className="font-bold">{vocabulary.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pronunciation tip */}
            {messages.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎧</span>
                  <h3 className="font-semibold text-green-800 text-sm">Pronunciation</h3>
                </div>
                <p className="text-xs text-green-700">
                  Click the <strong>Listen</strong> button on any message to hear the pronunciation.
                  Use the 🎤 button to practice speaking.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Learning Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '🌍', title: '5 Languages', desc: 'Spanish, French, German, Japanese, Mandarin' },
              { icon: '🎭', title: '10 Scenarios', desc: 'Café, shopping, travel, school, and more' },
              { icon: '🎤', title: 'Speak & Listen', desc: 'AI-powered speech with OpenAI TTS and Whisper' },
              { icon: '📖', title: 'Vocabulary Tracker', desc: 'Builds your personal word list as you learn' },
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
