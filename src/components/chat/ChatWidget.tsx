"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Mail, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatCaptcha } from "./ChatCaptcha";
import { ChatMessage } from "./ChatMessage";
import { OfflineMessageForm } from "./OfflineMessageForm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE =
  "Hi! I'm Evelyn, your AI assistant. I can help you learn about our AI-powered educational products and services. How can I help you today?";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session and check verification status
  useEffect(() => {
    // Generate or retrieve session ID
    let storedSessionId = sessionStorage.getItem("chat_session_id");
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
      sessionStorage.setItem("chat_session_id", storedSessionId);
    }
    setSessionId(storedSessionId);

    // Check if already verified
    const verified = sessionStorage.getItem("chat_verified") === "true";
    setIsVerified(verified);

    // Load saved messages
    const savedMessages = sessionStorage.getItem("chat_messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save messages to session storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opening chat
  useEffect(() => {
    if (isOpen && isVerified && !showOfflineForm) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isVerified, showOfflineForm]);

  // Add welcome message when verified
  useEffect(() => {
    if (isVerified && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: WELCOME_MESSAGE,
        },
      ]);
    }
  }, [isVerified, messages.length]);

  const handleVerified = useCallback(() => {
    setIsVerified(true);
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: trimmedInput,
    };

    const assistantMessageId = `assistant_${Date.now()}`;

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history (exclude welcome message for API)
      const conversationHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedInput,
          sessionId,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get response");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let streamedContent = "";

      // Add empty assistant message that will be updated
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);
      setIsLoading(false); // Stop showing loading indicator, show streaming message instead

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "chunk") {
                streamedContent += data.content;
                // Update the assistant message with new content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: streamedContent }
                      : msg
                  )
                );
              } else if (data.type === "error") {
                throw new Error(data.error);
              }
              // "done" type just confirms completion, content already updated
            } catch (parseError) {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  const handleOfflineSuccess = () => {
    setShowOfflineForm(false);
  };

  const clearChat = () => {
    sessionStorage.removeItem("chat_messages");
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
      },
    ]);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        data-tour="chat-widget"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 flex flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out sm:bottom-6 sm:right-6 sm:rounded-2xl",
          isOpen
            ? "h-[100dvh] w-full opacity-100 sm:h-[500px] sm:w-[360px]"
            : "pointer-events-none h-0 w-0 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-none bg-primary-600 px-4 py-3 sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Chat with Evelyn
              </h2>
              <p className="text-xs text-white/70">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isVerified && messages.length > 1 && (
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
          {!isVerified ? (
            <ChatCaptcha onVerified={handleVerified} />
          ) : showOfflineForm ? (
            <OfflineMessageForm
              onBack={() => setShowOfflineForm(false)}
              onSuccess={handleOfflineSuccess}
            />
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                    />
                  ))}
                  {isLoading && (
                    <ChatMessage role="assistant" content="" isLoading />
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Error */}
              {error && (
                <div className="mx-4 mb-2 flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-600">{error}</p>
                  <button
                    onClick={handleRetry}
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
                    className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            Powered by{" "}
            <a
              href="https://evelynlearning.com"
              className="text-primary-500 hover:underline"
            >
              Evelyn Learning
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
