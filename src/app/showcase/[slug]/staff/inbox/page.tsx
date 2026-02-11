'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Check,
  Archive,
  Trash2,
  Reply,
  Star,
  StarOff,
  Search,
  Filter,
  User,
} from 'lucide-react';
import { SiteContext } from '../../ShowcaseLayoutClient';

interface StaffSession {
  site: {
    slug: string;
    businessName: string;
    enabledTools: string[];
  };
  timestamp: number;
  authenticated: boolean;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  archived: boolean;
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    email: 'sarah.m@email.com',
    phone: '(617) 555-1234',
    subject: 'SAT Prep Inquiry',
    message:
      'Hi, I am interested in enrolling my son in your SAT prep course. He is currently in 10th grade and we would like to start preparing early. Could you please provide more information about class schedules and pricing? Thank you!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    starred: true,
    archived: false,
  },
  {
    id: '2',
    name: 'David Chen',
    email: 'david.chen@email.com',
    subject: 'Class Schedule Question',
    message:
      'Hello, I saw that you offer Calculus classes. My daughter is in 11th grade and wants to prepare for the AP Calculus exam. What days and times are the classes offered?',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    starred: false,
    archived: false,
  },
  {
    id: '3',
    name: 'Jennifer Williams',
    email: 'jwilliams@email.com',
    phone: '(617) 555-5678',
    subject: 'Summer Program Registration',
    message:
      'Good morning! I would like to register my two children (ages 8 and 10) for your summer math program. Is sibling discount available? Please let me know what documents I need to bring for enrollment.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    starred: true,
    archived: false,
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    subject: 'Tutoring Availability',
    message:
      'I need private tutoring for Algebra II. My son is struggling in school and we need help as soon as possible. Do you have any tutors available this week?',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    starred: false,
    archived: false,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    subject: 'Thank You!',
    message:
      'I just wanted to say thank you for the wonderful instruction my daughter received. She improved her SAT math score by 150 points! We are so grateful for your help.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    starred: true,
    archived: false,
  },
];

export default function StaffInboxPage() {
  const site = useContext(SiteContext);
  const router = useRouter();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  useEffect(() => {
    if (!site) return;

    const stored = sessionStorage.getItem(`showcase_staff_${site.slug}`);
    if (stored) {
      const parsed = JSON.parse(stored) as StaffSession;
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.authenticated) {
        setSession(parsed);
        setIsLoading(false);
        return;
      }
    }
    router.push(`/showcase/${site.slug}/staff`);
  }, [site, router]);

  if (!site || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!session) return null;

  const baseUrl = `/showcase/${site.slug}`;

  const filteredMessages = messages.filter((msg) => {
    if (msg.archived) return false;
    if (filter === 'unread' && msg.read) return false;
    if (filter === 'starred' && !msg.starred) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        msg.subject.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const markAsRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const toggleStar = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
  };

  const archiveMessage = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, archived: true } : m)));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const unreadCount = messages.filter((m) => !m.read && !m.archived).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`${baseUrl}/staff/dashboard`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-7 h-7" style={{ color: site.branding.primaryColor }} />
            Contact Inbox
            {unreadCount > 0 && (
              <span
                className="px-2.5 py-0.5 text-sm font-medium text-white rounded-full"
                style={{ backgroundColor: site.branding.primaryColor }}
              >
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">Messages from your website contact form</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:border-transparent w-64"
                  style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'starred')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="starred">Starred</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-5">
            {/* Message List */}
            <div className="md:col-span-2 border-r border-gray-100 max-h-[600px] overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No messages found</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      markAsRead(msg.id);
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                      selectedMessage?.id === msg.id ? 'bg-blue-50' : ''
                    } ${!msg.read ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: site.branding.primaryColor }}
                        >
                          {msg.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-sm ${!msg.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                          >
                            {msg.name}
                          </span>
                          <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                        </div>
                        <div
                          className={`text-sm truncate ${!msg.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}
                        >
                          {msg.subject}
                        </div>
                        <div className="text-xs text-gray-400 truncate mt-1">{msg.message}</div>
                      </div>
                      {msg.starred && (
                        <Star className="w-4 h-4 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Detail */}
            <div className="md:col-span-3 p-6">
              {selectedMessage ? (
                <div>
                  {/* Message Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                        style={{ backgroundColor: site.branding.primaryColor }}
                      >
                        {selectedMessage.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {selectedMessage.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {selectedMessage.email}
                          </span>
                          {selectedMessage.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {selectedMessage.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStar(selectedMessage.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        {selectedMessage.starred ? (
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => archiveMessage(selectedMessage.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Archive"
                      >
                        <Archive className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <h4 className="font-semibold text-gray-900 mb-2">{selectedMessage.subject}</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                    <Clock className="w-3 h-3" />
                    {selectedMessage.timestamp.toLocaleString()}
                  </p>

                  {/* Message Body */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition"
                      style={{ backgroundColor: site.branding.primaryColor }}
                    >
                      <Reply className="w-4 h-4" />
                      Reply via Email
                    </a>
                    {selectedMessage.phone && (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center py-20">
                  <div>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <Mail className="w-8 h-8" style={{ color: site.branding.primaryColor }} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Select a Message</h3>
                    <p className="text-gray-500 text-sm">
                      Choose a message from the list to view details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
