import React, { useState, useRef, useEffect } from 'react';

// 24/7 AI Homework Help Bot Demo
// Interactive chat interface for B2B prospects

const SAMPLE_QUESTIONS = [
  { subject: 'Math', question: 'How do I solve quadratic equations using the quadratic formula?', icon: '📐' },
  { subject: 'Physics', question: 'Can you explain Newton\'s third law with real-world examples?', icon: '🔬' },
  { subject: 'English', question: 'What\'s the difference between a metaphor and a simile?', icon: '📚' },
  { subject: 'Chemistry', question: 'How do I balance this equation: Fe + O2 → Fe2O3', icon: '⚗️' },
  { subject: 'History', question: 'What were the main causes of World War I?', icon: '🌍' },
  { subject: 'Biology', question: 'Explain the process of photosynthesis step by step', icon: '🌱' }
];

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: '📐', color: 'blue' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'green' },
  { id: 'english', name: 'English', icon: '📚', color: 'purple' },
  { id: 'history', name: 'History', icon: '🌍', color: 'amber' },
  { id: 'languages', name: 'Languages', icon: '🗣️', color: 'pink' }
];

export default function HomeworkHelpBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! 👋 I'm your AI homework helper. I can help you understand concepts, work through problems step-by-step, and explain things in different ways until they click.\n\n**How I can help:**\n- Break down complex problems into simple steps\n- Explain concepts with examples\n- Check your work and find mistakes\n- Suggest practice problems\n\nWhat subject are you working on today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const systemPrompt = `You are an expert, friendly homework tutor for middle school and high school students. Your goal is to help students UNDERSTAND concepts, not just give them answers.

TUTORING APPROACH:
1. Never just give the answer - guide students to discover it
2. Break complex problems into smaller, manageable steps
3. Use analogies and real-world examples
4. Ask guiding questions to check understanding
5. Celebrate progress and encourage persistence
6. If a student is frustrated, acknowledge it and try a different approach

FORMATTING:
- Use markdown for clarity (bold for key terms, bullet points for steps)
- For math, use clear notation and show each step
- Keep explanations concise but thorough
- End responses with a guiding question or next step when appropriate

TONE:
- Warm, encouraging, and patient
- Age-appropriate language
- Enthusiastic about learning
- Never condescending

Remember: Your goal is to build understanding and confidence, not dependency.`;

    // Build conversation history for context
    const conversationHistory = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));
    conversationHistory.push({ role: 'user', content: messageText });

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: systemPrompt,
          messages: conversationHistory
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        const assistantMessage = {
          role: 'assistant',
          content: data.content[0].text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No response received');
      }
    } catch (err) {
      const errorMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. In a production environment, this would be connected to your secure backend. Please try again!",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestion = (question) => {
    sendMessage(question);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMarkdown = (text) => {
    // Simple markdown rendering
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br/>');
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Demo
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            24/7 AI Homework Helper
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Instant help with any subject. Our AI tutor explains concepts step-by-step 
            and adapts to each student's learning style.
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
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                      selectedSubject === subject.id 
                        ? 'bg-indigo-100 text-indigo-800' 
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
                    className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition group"
                  >
                    <div className="flex items-start gap-2">
                      <span>{sample.icon}</span>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{sample.subject}</p>
                        <p className="text-sm text-gray-700 group-hover:text-indigo-700 line-clamp-2">
                          {sample.question}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
              <h3 className="font-semibold mb-3">Platform Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold">< 3 sec</p>
                  <p className="text-indigo-200 text-sm">Avg. response time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-indigo-200 text-sm">Subjects covered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-indigo-200 text-sm">Always available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold">AI Homework Helper</h2>
                  <div className="flex items-center gap-2 text-indigo-200 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Online and ready to help
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-md'
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
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your homework question..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Powered by Claude AI • Responses are educational guidance, not official answers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Why Students Love It</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🧠', title: 'Learns With You', desc: 'Adapts explanations to your learning style and pace' },
              { icon: '🔄', title: 'Step-by-Step', desc: 'Breaks down complex problems into manageable pieces' },
              { icon: '💡', title: 'Builds Understanding', desc: 'Guides discovery instead of just giving answers' },
              { icon: '🌙', title: 'Always Available', desc: 'Get help at 2 AM before that morning test' }
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
