'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Plus,
  Minus,
  Search,
  Filter,
  Loader2,
  Crown,
  Beaker,
  Clock,
  FileQuestion,
  BookOpen,
  FileText,
  BookMarked,
  Calculator,
  GraduationCap,
  Calendar,
  BookOpenCheck,
  Layers,
  LucideIcon,
  Lightbulb,
  Send,
  X,
  MessageSquarePlus,
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

interface Tool {
  toolId: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: string;
  color: string;
  status: 'active' | 'beta' | 'coming-soon';
  isPremium: boolean;
  isEnabled: boolean;
  limit: number;
  defaultLimit: number;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  FileQuestion,
  BookOpen,
  FileText,
  BookMarked,
  Calculator,
  GraduationCap,
  Calendar,
  BookOpenCheck,
  Layers,
  Sparkles,
};

const categoryLabels: Record<string, string> = {
  'test-prep': 'Test Preparation',
  'writing': 'Writing & Essays',
  'math': 'Mathematics',
  'language': 'Language & Vocabulary',
  'study-aids': 'Study Tools',
  'college-prep': 'College Preparation',
  'tutoring': 'Tutoring & Homework',
};

export default function ToolLibraryPage() {
  const site = useContext(SiteContext);
  const router = useRouter();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEnabledOnly, setShowEnabledOnly] = useState(false);
  const [updatingTool, setUpdatingTool] = useState<string | null>(null);

  // Tool request state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ toolName: '', description: '', useCase: '' });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    if (!site) return;

    const stored = sessionStorage.getItem(`showcase_staff_${site.slug}`);
    if (stored) {
      const parsed = JSON.parse(stored) as StaffSession;
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.authenticated) {
        setSession(parsed);
        fetchTools();
        return;
      }
    }
    router.push(`/showcase/${site.slug}/staff`);
  }, [site, router]);

  const fetchTools = async () => {
    if (!site) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/showcase/${site.slug}/tools`);
      if (res.ok) {
        const data = await res.json();
        setTools(data.allTools || []);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    }
    setIsLoading(false);
  };

  const toggleTool = async (toolId: string, currentlyEnabled: boolean) => {
    if (!site) return;
    setUpdatingTool(toolId);

    try {
      const res = await fetch(`/api/showcase/${site.slug}/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          action: currentlyEnabled ? 'disable' : 'enable',
        }),
      });

      if (res.ok) {
        // Update local state
        setTools(tools.map(t =>
          t.toolId === toolId ? { ...t, isEnabled: !currentlyEnabled } : t
        ));

        // Update session storage
        if (session) {
          const newEnabledTools = currentlyEnabled
            ? session.site.enabledTools.filter(id => id !== toolId)
            : [...session.site.enabledTools, toolId];

          const updatedSession = {
            ...session,
            site: { ...session.site, enabledTools: newEnabledTools },
          };
          sessionStorage.setItem(`showcase_staff_${site.slug}`, JSON.stringify(updatedSession));
          setSession(updatedSession);
        }
      }
    } catch (error) {
      console.error('Failed to toggle tool:', error);
    }

    setUpdatingTool(null);
  };

  const submitToolRequest = async () => {
    if (!site || !requestForm.toolName || !requestForm.description) return;

    setIsSubmittingRequest(true);
    try {
      const res = await fetch(`/api/showcase/${site.slug}/tool-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestForm),
      });

      if (res.ok) {
        setRequestSuccess(true);
        setRequestForm({ toolName: '', description: '', useCase: '' });
        setTimeout(() => {
          setShowRequestModal(false);
          setRequestSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit tool request:', error);
    }
    setIsSubmittingRequest(false);
  };

  if (!site || !session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const baseUrl = `/showcase/${site.slug}`;

  // Get unique categories
  const categories = [...new Set(tools.map(t => t.category))];

  // Filter tools
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
    const matchesEnabled = !showEnabledOnly || tool.isEnabled;
    return matchesSearch && matchesCategory && matchesEnabled;
  });

  // Group by category
  const groupedTools = filteredTools.reduce((acc, tool) => {
    const cat = tool.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const enabledCount = tools.filter(t => t.isEnabled).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`${baseUrl}/staff/dashboard`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              {enabledCount} tools enabled
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-7 h-7" style={{ color: site.branding.primaryColor }} />
            AI Tools Library
          </h1>
          <p className="text-gray-600 mt-1">
            Browse and enable AI tools for your tutoring practice. Enable the tools you want to use.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2"
                style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{categoryLabels[cat] || cat}</option>
                ))}
              </select>
            </div>

            {/* Enabled Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showEnabledOnly}
                onChange={(e) => setShowEnabledOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Show enabled only</span>
            </label>
          </div>
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : Object.keys(groupedTools).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTools).map(([category, categoryTools]) => (
              <div key={category}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {categoryLabels[category] || category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTools.map((tool) => {
                    const IconComponent = iconMap[tool.icon] || Sparkles;
                    const isUpdating = updatingTool === tool.toolId;

                    return (
                      <div
                        key={tool.toolId}
                        className={`bg-white rounded-xl shadow-sm border p-5 transition ${
                          tool.isEnabled
                            ? 'border-green-200 bg-green-50/30'
                            : 'border-gray-100 hover:border-gray-200'
                        } ${tool.status === 'coming-soon' ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${tool.color}20` }}
                          >
                            <IconComponent
                              className="w-6 h-6"
                              style={{ color: tool.color }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {tool.name}
                              </h3>
                              {tool.isPremium && (
                                <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              )}
                              {tool.status === 'beta' && (
                                <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                                  <Beaker className="w-3 h-3" />
                                  Beta
                                </span>
                              )}
                              {tool.status === 'coming-soon' && (
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Soon
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {tool.shortDescription}
                            </p>

                            {/* Usage limit */}
                            <div className="text-xs text-gray-400 mt-2">
                              {tool.limit} uses/day
                            </div>
                          </div>
                        </div>

                        {/* Toggle Button */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {tool.status === 'coming-soon' ? (
                            <button
                              disabled
                              className="w-full py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                            >
                              Coming Soon
                            </button>
                          ) : tool.isEnabled ? (
                            <button
                              onClick={() => toggleTool(tool.toolId, true)}
                              disabled={isUpdating}
                              className="w-full py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition flex items-center justify-center gap-2"
                            >
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Minus className="w-4 h-4" />
                                  Remove from My Tools
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleTool(tool.toolId, false)}
                              disabled={isUpdating}
                              className="w-full py-2 text-sm font-medium text-white rounded-lg transition flex items-center justify-center gap-2"
                              style={{ backgroundColor: site.branding.primaryColor }}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  Add to My Tools
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request a Tool Section */}
        <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className="text-sm text-amber-700 mb-4">
                We&apos;re always adding new AI tools. Let us know what tool would help your tutoring practice!
              </p>
              <button
                onClick={() => setShowRequestModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Request a Tool
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
          <p className="text-sm text-blue-700">
            Tools you enable will appear in your{' '}
            <Link href={`${baseUrl}/staff/tools`} className="underline hover:no-underline">
              AI Tools page
            </Link>
            . During the demo, each tool has limited uses. After launching your website, you&apos;ll have access to higher limits or unlimited usage depending on your plan.
          </p>
        </div>
      </div>

      {/* Request Tool Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Request a New Tool</h2>
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestForm({ toolName: '', description: '', useCase: '' });
                  setRequestSuccess(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {requestSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-500">
                    Thank you for your suggestion. We&apos;ll review it and get back to you.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Tell us about the AI tool you&apos;d like to see. We review all suggestions and prioritize based on demand.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tool Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={requestForm.toolName}
                        onChange={(e) => setRequestForm({ ...requestForm, toolName: e.target.value })}
                        placeholder="e.g., Science Lab Simulator"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={requestForm.description}
                        onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                        placeholder="Describe what the tool should do..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent resize-none"
                        style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        How would you use it? <span className="text-gray-400">(optional)</span>
                      </label>
                      <textarea
                        value={requestForm.useCase}
                        onChange={(e) => setRequestForm({ ...requestForm, useCase: e.target.value })}
                        placeholder="e.g., I want to create interactive science experiments for my students..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent resize-none"
                        style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!requestSuccess && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestForm({ toolName: '', description: '', useCase: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitToolRequest}
                  disabled={isSubmittingRequest || !requestForm.toolName || !requestForm.description}
                  className="px-4 py-2 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: site.branding.primaryColor }}
                >
                  {isSubmittingRequest ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
