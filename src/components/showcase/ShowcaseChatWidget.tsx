'use client';

import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { MessageCircle, X, Send, Mail, RefreshCw, GraduationCap } from 'lucide-react';
import { SiteContext } from '@/app/showcase/[slug]/ShowcaseLayoutClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ShowcaseChatWidget() {
  const site = useContext(SiteContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(true); // No captcha for demo
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const WELCOME_MESSAGE = site
    ? `Hi! I'm here to help answer your questions about ${site.businessName}. How can I assist you today?`
    : 'Hi! How can I help you today?';

  // Initialize session
  useEffect(() => {
    if (!site) return;

    let storedSessionId = sessionStorage.getItem(`showcase_chat_${site.slug}`);
    if (!storedSessionId) {
      storedSessionId = `showcase_${site.slug}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem(`showcase_chat_${site.slug}`, storedSessionId);
    }
    setSessionId(storedSessionId);

    // Load saved messages
    const savedMessages = sessionStorage.getItem(`showcase_chat_messages_${site.slug}`);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        // Ignore parse errors
      }
    } else {
      // Add welcome message
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE
      }]);
    }
  }, [site, WELCOME_MESSAGE]);

  // Save messages to session storage
  useEffect(() => {
    if (site && messages.length > 0) {
      sessionStorage.setItem(`showcase_chat_messages_${site.slug}`, JSON.stringify(messages));
    }
  }, [messages, site]);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opening chat
  useEffect(() => {
    if (isOpen && isVerified && !showOfflineForm) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isVerified, showOfflineForm]);

  const sendMessage = useCallback(async () => {
    if (!site) return;
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmedInput,
    };

    const assistantMessageId = `assistant_${Date.now()}`;

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history (exclude welcome message for API)
      const conversationHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(`/api/showcase/${site.slug}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          sessionId,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let streamedContent = '';

      // Add empty assistant message that will be updated
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '' },
      ]);
      setIsLoading(false);

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'chunk') {
                streamedContent += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: streamedContent }
                      : msg
                  )
                );
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, sessionId, site]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (!site) return;
    sessionStorage.removeItem(`showcase_chat_messages_${site.slug}`);
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE
    }]);
  };

  if (!site) return null;

  const primaryColor = site.branding.primaryColor;
  const secondaryColor = site.branding.secondaryColor;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isOpen ? 'scale-0 opacity-0' : ''
        }`}
        style={{
          backgroundColor: primaryColor,
          '--tw-ring-color': primaryColor
        } as React.CSSProperties}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-0 right-0 z-50 flex flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out sm:bottom-6 sm:right-6 sm:rounded-2xl ${
          isOpen
            ? 'h-[100dvh] w-full opacity-100 sm:h-[500px] sm:w-[360px]'
            : 'pointer-events-none h-0 w-0 opacity-0'
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-none px-4 py-3 sm:rounded-t-2xl"
          style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              {site.branding.logoUrl ? (
                <img src={site.branding.logoUrl} alt="" className="h-6 w-6 rounded-full" />
              ) : (
                <GraduationCap className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Chat with {site.businessName.split(' ')[0]}
              </h2>
              <p className="text-xs text-white/70">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 1 && (
              <button
                onClick={clearChat}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                title="Clear chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {showOfflineForm ? (
            <div className="flex-1 p-4">
              <h3 className="font-semibold mb-4">Send us a message</h3>
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOfflineForm(false)}
                    className="flex-1 rounded-lg border py-2 text-sm hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg py-2 text-sm text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                          message.role === 'user'
                            ? 'rounded-br-md text-white'
                            : 'rounded-bl-md bg-gray-100 text-gray-800'
                        }`}
                        style={message.role === 'user' ? { backgroundColor: primaryColor } : {}}
                      >
                        {message.content || (
                          <span className="inline-flex gap-1">
                            <span className="animate-pulse">.</span>
                            <span className="animate-pulse delay-100">.</span>
                            <span className="animate-pulse delay-200">.</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2 text-sm text-gray-800">
                        <span className="inline-flex gap-1">
                          <span className="animate-pulse">.</span>
                          <span className="animate-pulse" style={{ animationDelay: '0.1s' }}>.</span>
                          <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Error */}
              {error && (
                <div className="mx-4 mb-2 flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-600">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-base focus:outline-none focus:ring-1 disabled:bg-gray-50"
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                {/* Offline message link */}
                <button
                  onClick={() => setShowOfflineForm(true)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"
                >
                  <Mail className="h-3 w-3" />
                  Leave an offline message
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-2 text-center">
          <p className="text-[10px] text-gray-400">
            Powered by{' '}
            <a
              href="https://evelynlearning.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: primaryColor }}
            >
              Evelyn Learning
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
