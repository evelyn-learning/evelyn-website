"use client";

import { useState } from "react";
import { MessageCircle, Clock } from "lucide-react";

interface Conversation {
  _id: string;
  sessionId: string;
  status: string;
  messageCount: number;
  lastMessage: string;
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
          {conversations.map((conv) => (
            <div key={conv._id} className="p-4 hover:bg-gray-50">
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

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatDate(conv.updatedAt)}
                  </div>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {conv.messageCount} messages
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
