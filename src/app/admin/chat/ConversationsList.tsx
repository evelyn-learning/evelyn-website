"use client";

import { useState } from "react";
import { MessageCircle, Clock, ChevronDown, ChevronUp, Loader2, User, Bot } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  sessionId: string;
  status: string;
  messageCount: number;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

interface FullConversation {
  _id: string;
  sessionId: string;
  messages: ChatMessage[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ConversationsListProps {
  initialConversations: Conversation[];
}

export function ConversationsList({
  initialConversations,
}: ConversationsListProps) {
  const [conversations] = useState(initialConversations);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [fullConversations, setFullConversations] = useState<Record<string, FullConversation>>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      const mins = Math.floor(diffMs / (1000 * 60));
      return `${mins}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleRowClick = async (convId: string) => {
    if (expandedId === convId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(convId);

    if (fullConversations[convId]) return;

    setLoadingId(convId);
    try {
      const res = await fetch(`/api/admin/chat/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setFullConversations((prev) => ({ ...prev, [convId]: data }));
      }
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    offline_message: "bg-yellow-100 text-yellow-700",
    completed: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="rounded-xl bg-white shadow">
      {conversations.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          No chat conversations yet.
        </div>
      ) : (
        <div className="divide-y">
          {conversations.map((conv) => {
            const isExpanded = expandedId === conv._id;
            const isLoading = loadingId === conv._id;
            const fullConv = fullConversations[conv._id];

            return (
              <div key={conv._id}>
                <div
                  className="cursor-pointer p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => handleRowClick(conv._id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                        <MessageCircle className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            Session {conv.sessionId.slice(8, 16)}...
                          </span>
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              statusColors[conv.status] || statusColors.active
                            }`}
                          >
                            {conv.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                          {conv.lastMessage || "No messages"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatDate(conv.updatedAt)}
                        </div>
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {conv.messageCount} messages
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t bg-gray-50 px-4 py-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">Loading messages...</span>
                      </div>
                    ) : fullConv ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {fullConv.messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex max-w-[80%] gap-2 ${
                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                              }`}
                            >
                              <div
                                className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                                  msg.role === "user"
                                    ? "bg-primary-100"
                                    : "bg-gray-200"
                                }`}
                              >
                                {msg.role === "user" ? (
                                  <User className="h-3 w-3 text-primary-600" />
                                ) : (
                                  <Bot className="h-3 w-3 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <div
                                  className={`rounded-lg px-3 py-2 text-sm ${
                                    msg.role === "user"
                                      ? "bg-primary-600 text-white"
                                      : "bg-white text-gray-800 border border-gray-200"
                                  }`}
                                >
                                  {msg.content}
                                </div>
                                <p
                                  className={`mt-0.5 text-xs text-gray-400 ${
                                    msg.role === "user" ? "text-right" : "text-left"
                                  }`}
                                >
                                  {formatTimestamp(msg.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-sm text-gray-500">
                        Failed to load messages.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
