'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  User,
  Bot,
  Clock,
  Calendar,
  ChevronRight,
  ChevronDown,
  LogOut,
  Search,
  RefreshCw,
} from 'lucide-react';
import { SiteContext } from '../../ShowcaseLayoutClient';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export default function ConversationsPage() {
  const site = useContext(SiteContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!site) return;

    // Check for staff session
    const stored = sessionStorage.getItem(`showcase_staff_${site.slug}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.authenticated) {
        loadConversations();
        return;
      }
    }
    router.push(`/showcase/${site.slug}/staff`);
  }, [site, router]);

  const loadConversations = async () => {
    if (!site) return;
    try {
      const res = await fetch(`/api/showcase/${site.slug}/conversations`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (!site) return;
    sessionStorage.removeItem(`showcase_staff_${site.slug}`);
    router.push(`/showcase/${site.slug}/staff`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFirstUserMessage = (conversation: Conversation) => {
    const userMessage = conversation.messages.find((m) => m.role === 'user');
    return userMessage?.content || 'No messages';
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return conv.messages.some((m) => m.content.toLowerCase().includes(query));
  });

  if (!site || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const baseUrl = `/showcase/${site.slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`${baseUrl}/staff/dashboard`}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chat Conversations</h1>
                <p className="text-sm text-gray-500">View and analyze visitor chat history</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search and Refresh */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
            />
          </div>
          <button
            onClick={loadConversations}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
                <p className="text-sm text-gray-500">Total Conversations</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.reduce((acc, conv) => acc + conv.messages.filter((m) => m.role === 'user').length, 0)}
                </p>
                <p className="text-sm text-gray-500">User Messages</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.filter((c) => {
                    const date = new Date(c.createdAt);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                  }).length}
                </p>
                <p className="text-sm text-gray-500">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No matching conversations' : 'No conversations yet'}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? 'Try a different search term.'
                  : 'When visitors chat with your AI assistant, their conversations will appear here.'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.sessionId}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Conversation Header */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === conversation.sessionId ? null : conversation.sessionId)
                  }
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <User className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {getFirstUserMessage(conversation).slice(0, 60)}
                        {getFirstUserMessage(conversation).length > 60 ? '...' : ''}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {formatDate(conversation.createdAt)}
                        <span className="text-gray-300">•</span>
                        {conversation.messages.length} messages
                      </p>
                    </div>
                  </div>
                  {expandedId === conversation.sessionId ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Expanded Messages */}
                {expandedId === conversation.sessionId && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {conversation.messages.map((message, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-3 ${message.role === 'user' ? '' : 'flex-row-reverse'}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === 'user' ? 'bg-gray-200' : ''
                            }`}
                            style={
                              message.role === 'assistant'
                                ? { backgroundColor: `${site.branding.primaryColor}15` }
                                : {}
                            }
                          >
                            {message.role === 'user' ? (
                              <User className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Bot className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                            )}
                          </div>
                          <div
                            className={`flex-1 rounded-xl p-3 ${
                              message.role === 'user'
                                ? 'bg-white border border-gray-200'
                                : 'text-white'
                            }`}
                            style={
                              message.role === 'assistant'
                                ? { backgroundColor: site.branding.primaryColor }
                                : {}
                            }
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.role === 'user' ? 'text-gray-400' : 'text-white/70'
                              }`}
                            >
                              {formatDate(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
