'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { safeAPICall } from '@core/utils/api-error-handler';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

// Types
interface Message {
  role: 'user' | 'assistant' | 'system-notice';
  content: string;
  timestamp: Date;
  isError?: boolean;
  extractedProblem?: string;
  followUps?: string[];
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  promptHint: string;
}

interface SampleQuestion {
  subject: string;
  question: string;
  icon: string;
}

// Sample data
const SAMPLE_QUESTIONS: SampleQuestion[] = [
  { subject: 'Math', question: 'How do I solve quadratic equations using the quadratic formula?', icon: '📐' },
  { subject: 'Physics', question: "Can you explain Newton's third law with real-world examples?", icon: '🔬' },
  { subject: 'English', question: "What's the difference between a metaphor and a simile?", icon: '📚' },
  { subject: 'Chemistry', question: 'How do I balance this equation: Fe + O2 → Fe2O3', icon: '⚗️' },
  { subject: 'History', question: 'What were the main causes of World War I?', icon: '🌍' },
  { subject: 'Biology', question: 'Explain the process of photosynthesis step by step', icon: '🌱' }
];

const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', icon: '📐', color: 'blue', promptHint: 'For math problems: show the setup and guide through each step of the solution process. Use clear mathematical notation. Ask the student to attempt each step before revealing it.' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'green', promptHint: 'For science questions: connect concepts to observable phenomena and real-world examples. Encourage hypothesis formation. Ask "what do you think would happen if..." questions.' },
  { id: 'english', name: 'English', icon: '📚', color: 'purple', promptHint: 'For English/Language Arts: guide literary analysis through evidence-based questions. Help students develop their own interpretations. For writing, focus on structure and reasoning rather than rewriting for them.' },
  { id: 'history', name: 'History', icon: '🌍', color: 'amber', promptHint: 'For history: encourage cause-and-effect thinking and multiple perspectives. Ask students to consider "why" events happened rather than just "what" happened. Connect historical events to broader patterns.' },
  { id: 'languages', name: 'Languages', icon: '🗣️', color: 'pink', promptHint: 'For languages: help with grammar rules and vocabulary in context. Encourage the student to construct sentences themselves. Explain patterns rather than just corrections.' }
];

const ACADEMIC_INTEGRITY_PROMPT = `CRITICAL ACADEMIC INTEGRITY RULES — YOU MUST FOLLOW THESE AT ALL TIMES:
1. NEVER provide complete answers, full solutions, or finished work that a student could copy and submit.
2. NEVER write essays, paragraphs, or complete responses for writing assignments.
3. NEVER solve an entire math problem end-to-end. Walk through the METHOD, then ask the student to apply it.
4. If a student asks you to "just give me the answer" or "solve this for me", politely redirect:
   - Acknowledge their frustration
   - Explain that understanding the process is more valuable than getting one answer
   - Offer to break the problem into smaller, more manageable steps
5. For uploaded homework images: identify the problem, explain the relevant concepts, and ask guiding questions — but do NOT solve it.
6. Always end your response with a question or prompt that requires the student to think and respond.
7. If you show a worked example, use DIFFERENT numbers/content than the student's actual problem, then ask them to apply the same approach to theirs.

Your purpose is to BUILD UNDERSTANDING. A student should leave this conversation knowing HOW to solve problems like this on their own.`;

const buildSystemPrompt = (selectedSubject: string | null) => {
  const subjectHint = selectedSubject
    ? SUBJECTS.find(s => s.id === selectedSubject)?.promptHint || ''
    : '';

  return `You are an expert, friendly homework tutor for middle school and high school students. Your goal is to help students UNDERSTAND concepts, not just give them answers.

${ACADEMIC_INTEGRITY_PROMPT}

TUTORING APPROACH:
1. Never just give the answer — guide students to discover it themselves
2. Break complex problems into smaller, manageable steps
3. Use analogies and real-world examples
4. Ask guiding questions to check understanding
5. Celebrate progress and encourage persistence
6. If a student is frustrated, acknowledge it and try a different approach
7. When showing a method, use a DIFFERENT example first, then ask the student to apply it to their problem

FORMATTING:
- Use markdown for clarity (bold for key terms, bullet points for steps)
- For math, use clear notation and show each step
- Keep explanations concise but thorough
- End responses with a guiding question or next step

TONE:
- Warm, encouraging, and patient
- Age-appropriate language
- Enthusiastic about learning
- Never condescending

${subjectHint}

Remember: Your goal is to build understanding and confidence, not dependency. The student should be able to solve similar problems on their own after working with you.

At the end of EVERY response, include a JSON block (hidden from the student) with 2-3 suggested follow-up questions they could ask. Format it exactly like this on its own line:
<!--followups:["Question 1?","Question 2?","Question 3?"]-->`;
};

const parseFollowUps = (text: string): { cleanText: string; followUps: string[] } => {
  const match = text.match(/<!--followups:(\[.*?\])-->/);
  if (match) {
    try {
      const followUps = JSON.parse(match[1]) as string[];
      const cleanText = text.replace(/<!--followups:.*?-->/, '').trim();
      return { cleanText, followUps };
    } catch {
      // ignore parse errors
    }
  }
  return { cleanText: text, followUps: [] };
};

export default function HomeworkHelpBot() {
  const trackInteraction = useTrackInteraction();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm your AI homework helper. I won't just give you answers — instead, I'll help you truly **understand** the material by guiding you step-by-step.\n\n**How I can help:**\n- Break down complex problems into simple steps\n- Explain concepts with examples and analogies\n- Check your work and help you find mistakes\n- Guide you to discover solutions yourself\n\nYou can also **upload a photo** of your homework and I'll help you work through it.\n\nWhat subject are you working on today?",
      timestamp: new Date(),
      followUps: [
        'I need help with a math problem',
        'Can you explain a science concept?',
        'I have an English essay question'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Small delay to let follow-up chips render before scrolling
    requestAnimationFrame(() => scrollToBottom());
  }, [messages, scrollToBottom]);

  const sendMessage = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    trackInteraction('message', messageText, undefined, 'student');
    setInput('');
    setIsLoading(true);

    const systemPrompt = buildSystemPrompt(selectedSubject);

    // Build conversation history for context (last 10 messages)
    const conversationHistory = messages.slice(-10).map(m => ({
      role: m.role === 'system-notice' ? 'assistant' as const : m.role,
      content: m.content
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
          max_tokens: 1500
        })
      }
    );

    if (apiError) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: apiError.message,
        timestamp: new Date(),
        isError: true
      }]);
      setIsLoading(false);
      return;
    }

    if (data?.text) {
      const { cleanText, followUps } = parseFollowUps(data.text);
      trackInteraction('message', cleanText, undefined, 'tutor');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: cleanText,
        timestamp: new Date(),
        followUps
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'No response received. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    }

    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Please upload a JPEG, PNG, GIF, or WebP image.',
        timestamp: new Date(),
        isError: true
      }]);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Image is too large. Please upload an image under 10 MB.',
        timestamp: new Date(),
        isError: true
      }]);
      return;
    }

    setIsUploading(true);
    setIsLoading(true);

    trackInteraction('tool_use', 'homework_upload', { subject: selectedSubject });

    // Show user message with image indicator
    setMessages(prev => [...prev, {
      role: 'user',
      content: `📷 Uploaded homework photo: ${file.name}`,
      timestamp: new Date()
    }]);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];

      try {
        const res = await fetch('/api/tutor/extract-homework', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64,
            mimeType: file.type,
            subject: selectedSubject || 'general',
            topic: 'homework',
            level: 'high school',
          })
        });

        const data = await res.json();

        if (data.error) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I couldn't read that image clearly. ${data.error}. Could you try uploading a clearer photo?`,
            timestamp: new Date(),
            isError: true
          }]);
        } else {
          // Show extracted problem as a system notice
          if (data.extractedProblem) {
            setMessages(prev => [...prev, {
              role: 'system-notice',
              content: `**Problem detected:**\n${data.extractedProblem}`,
              timestamp: new Date()
            }]);
          }

          // Show tutor's Socratic response
          const { cleanText, followUps } = parseFollowUps(data.text || '');
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: cleanText || "I can see your homework problem! Let me help you work through it. Remember, I'll guide you through the process rather than just giving you the answer — that way you'll really understand the material.\n\nLet's start by identifying what we know and what we need to find. What information can you pick out from this problem?",
            timestamp: new Date(),
            followUps: followUps.length > 0 ? followUps : [
              'What concept does this problem involve?',
              'Can you explain the first step?',
              'What formula should I use here?'
            ]
          }]);
        }
      } catch (err) {
        console.error('Image upload error:', err);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Something went wrong processing the image. Please try again.',
          timestamp: new Date(),
          isError: true
        }]);
      }

      setIsUploading(false);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);

    // Reset the file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNewConversation = () => {
    setMessages([{
      role: 'assistant',
      content: "Fresh start! What would you like help with? Remember, I'm here to guide you through problems step-by-step so you truly understand the material.\n\nAsk a question, or upload a photo of your homework.",
      timestamp: new Date(),
      followUps: [
        'I need help with a math problem',
        'Can you explain a science concept?',
        'I have an English essay question'
      ]
    }]);
    setInput('');
  };

  const handleSampleQuestion = (question: string) => {
    trackInteraction('click', 'sample_question');
    sendMessage(question);
  };

  const handleExportChat = async () => {
    try {
      const { exportTutoringSessionPDF } = await import('@/lib/utils/export/pdf-tutoring-session');
      const subjectName = selectedSubject
        ? SUBJECTS.find(s => s.id === selectedSubject)?.name || 'General'
        : 'General';
      await exportTutoringSessionPDF(messages, subjectName);
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMarkdown = (text: string) => {
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const escaped = escapeHtml(text);
    const html = escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br/>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Get the last assistant message's follow-ups
  const lastFollowUps = [...messages].reverse().find(m => m.role === 'assistant' && m.followUps && m.followUps.length > 0)?.followUps || [];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-primary-50 rounded-2xl">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Demo
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            24/7 AI Homework Helper
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Instant help with any subject. Our AI tutor guides students step-by-step
            to build real understanding — never just gives away answers.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Subject Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Subjects</h3>
              <div className="space-y-2">
                {SUBJECTS.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                      selectedSubject === subject.id
                        ? 'bg-purple-100 text-purple-800'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{subject.icon}</span>
                    <span className="font-medium">{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Questions */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Try These Questions</h3>
              <div className="space-y-2">
                {SAMPLE_QUESTIONS.slice(0, 4).map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleQuestion(sample.question)}
                    className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition group"
                  >
                    <div className="flex items-start gap-2">
                      <span>{sample.icon}</span>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{sample.subject}</p>
                        <p className="text-sm text-gray-700 group-hover:text-purple-700 line-clamp-2">
                          {sample.question}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Integrity Badge */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="font-semibold text-green-800 text-sm">Academic Integrity</h3>
              </div>
              <p className="text-xs text-green-700 leading-relaxed">
                This tutor is designed to <strong>guide learning, not provide answers</strong>. It uses the Socratic method to help students build genuine understanding they can apply independently.
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-purple-500 to-primary-600 rounded-2xl shadow-lg p-4 text-white">
              <h3 className="font-semibold mb-3">Platform Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold">&lt; 3 sec</p>
                  <p className="text-purple-200 text-sm">Avg. response time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-purple-200 text-sm">Subjects covered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-purple-200 text-sm">Always available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-600 to-primary-600 px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-semibold">AI Homework Helper</h2>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Online and ready to help
                    {selectedSubject && (
                      <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {SUBJECTS.find(s => s.id === selectedSubject)?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 1 && (
                    <button
                      onClick={handleExportChat}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                      title="Save session as PDF"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={handleNewConversation}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                    title="New conversation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, idx) => (
                  <div key={idx}>
                    {message.role === 'system-notice' ? (
                      <div className="flex justify-center">
                        <div className="max-w-[85%] bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                          <div className="text-sm text-blue-800 leading-relaxed">
                            {renderMarkdown(message.content)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-purple-600 text-white rounded-br-md'
                                : message.isError
                                ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                                : 'bg-gray-100 text-gray-800 rounded-bl-md'
                            }`}
                          >
                            <div className="text-sm leading-relaxed">
                              {renderMarkdown(message.content)}
                            </div>
                          </div>
                          <p className={`text-xs text-gray-400 mt-1 ${
                            message.role === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {isUploading ? 'Reading your homework...' : 'Thinking...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Follow-up suggestions */}
                {!isLoading && lastFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-2">
                    {lastFollowUps.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-full hover:bg-purple-100 transition border border-purple-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  {/* Image upload button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="px-3 py-3 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 hover:text-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload homework photo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your homework question..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  This tutor guides learning through the Socratic method — it helps you understand, not just get answers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Designed for Learning, Not Shortcuts</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🛡️', title: 'Academic Integrity', desc: 'Never gives direct answers — guides students to discover solutions themselves' },
              { icon: '🔄', title: 'Step-by-Step', desc: 'Breaks down complex problems into manageable pieces students can follow' },
              { icon: '💡', title: 'Builds Understanding', desc: 'Uses the Socratic method so students can solve similar problems on their own' },
              { icon: '🌙', title: 'Always Available', desc: 'Get guided help at any hour — like having a patient tutor on call 24/7' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <span className="text-4xl">{feature.icon}</span>
                <h4 className="font-semibold text-gray-800 mt-3">{feature.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
