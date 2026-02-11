'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Save,
  X,
  FileQuestion,
  BookOpen,
  PenTool,
  BookMarked,
  Calculator,
  GraduationCap,
  Calendar,
  BookOpenCheck,
  Layers,
  FileText,
  LucideIcon,
  RefreshCw,
  Search,
  Eye,
  Users,
  TrendingUp,
  Globe,
  FlaskConical,
  LayoutGrid,
  Video,
  ScanLine,
  BarChart3,
  Navigation,
  PersonStanding,
  Briefcase,
} from 'lucide-react';

interface AITool {
  _id: string;
  toolId: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: string;
  color: string;
  status: 'active' | 'beta' | 'coming-soon' | 'deprecated';
  demoAvailability: 'live-demo' | 'interactive-preview' | 'request-demo';
  isDefault: boolean;
  hasImplementation: boolean;
  isPremium: boolean;
  defaultDailyLimit: number;
  defaultMonthlyLimit: number;
  tokensPerUse: number;
  apiModel: string;
  systemPrompt?: string;
  demoComponent?: string;
  sortOrder: number;
  totalUsageCount: number;
  createdAt: string;
  updatedAt: string;
}

const iconMap: Record<string, LucideIcon> = {
  FileQuestion,
  BookOpen,
  PenTool,
  FileText,
  BookMarked,
  Calculator,
  GraduationCap,
  Calendar,
  BookOpenCheck,
  Layers,
  Sparkles,
  Search,
  Eye,
  Users,
  TrendingUp,
  Globe,
  FlaskConical,
  LayoutGrid,
  Video,
  ScanLine,
  BarChart3,
  Navigation,
  PersonStanding,
  Briefcase,
  // Aliases for old icon names
  'Flask': FlaskConical,
  'Layout': LayoutGrid,
  'ScanText': ScanLine,
  'Compass': Navigation,
  'Accessibility': PersonStanding,
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  beta: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Beta' },
  'coming-soon': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Coming Soon' },
  deprecated: { bg: 'bg-red-100', text: 'text-red-700', label: 'Deprecated' },
};

const demoAvailabilityColors: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  'live-demo': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Live Demo', icon: '🟢' },
  'interactive-preview': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Interactive Preview', icon: '🟡' },
  'request-demo': { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Request Demo', icon: '⚪' },
};

const categories = [
  { value: 'test-prep', label: 'Test Prep' },
  { value: 'writing', label: 'Writing' },
  { value: 'math', label: 'Math' },
  { value: 'language', label: 'Language' },
  { value: 'study-aids', label: 'Study Aids' },
  { value: 'college-prep', label: 'College Prep' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'content-creation', label: 'Content Creation' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'accessibility', label: 'Accessibility' },
  { value: 'research', label: 'Research' },
  { value: 'training', label: 'Training' },
];

export default function AIToolsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/admin/ai-tools');
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (tool: Partial<AITool>) => {
    setIsSaving(true);
    try {
      const method = tool._id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/ai-tools', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tool),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: tool._id ? 'Tool updated successfully' : 'Tool created successfully' });
        fetchTools();
        setEditingTool(null);
        setIsCreating(false);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save tool' });
      }
    } catch (error) {
      console.error('Failed to save tool:', error);
      setMessage({ type: 'error', text: 'Failed to save tool' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const res = await fetch(`/api/admin/ai-tools?toolId=${toolId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Tool deleted successfully' });
        fetchTools();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete tool' });
      }
    } catch (error) {
      console.error('Failed to delete tool:', error);
      setMessage({ type: 'error', text: 'Failed to delete tool' });
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('This will add/update default tools. Continue?')) return;

    try {
      const res = await fetch('/api/admin/ai-tools/seed', { method: 'POST' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Default tools seeded successfully' });
        fetchTools();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to seed tools' });
      }
    } catch (error) {
      console.error('Failed to seed tools:', error);
      setMessage({ type: 'error', text: 'Failed to seed tools' });
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                AI Tools Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSeedDefaults}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Seed Defaults
              </button>
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingTool({
                    _id: '',
                    toolId: '',
                    name: '',
                    description: '',
                    shortDescription: '',
                    icon: 'Sparkles',
                    category: 'tutoring',
                    color: '#10B981',
                    status: 'coming-soon',
                    demoAvailability: 'request-demo',
                    isDefault: false,
                    hasImplementation: false,
                    isPremium: false,
                    defaultDailyLimit: 10,
                    defaultMonthlyLimit: 100,
                    tokensPerUse: 500,
                    apiModel: 'gpt-4o-mini',
                    systemPrompt: '',
                    demoComponent: '',
                    sortOrder: 100,
                    totalUsageCount: 0,
                    createdAt: '',
                    updatedAt: '',
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600"
              >
                <Plus className="w-4 h-4" />
                Add Tool
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{tools.length}</div>
            <div className="text-sm text-gray-500">Total Tools</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-emerald-600">
              {tools.filter((t) => t.demoAvailability === 'live-demo').length}
            </div>
            <div className="text-sm text-gray-500">🟢 Live Demo</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-amber-600">
              {tools.filter((t) => t.demoAvailability === 'interactive-preview').length}
            </div>
            <div className="text-sm text-gray-500">🟡 Interactive Preview</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-purple-600">
              {tools.reduce((sum, t) => sum + (t.totalUsageCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Total Usage</div>
          </div>
        </div>

        {/* Tools List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">All AI Tools</h2>
            <p className="text-sm text-gray-500 mt-1">
              🟢 Live Demo = fully functional &bull; 🟡 Interactive Preview = sample experience &bull; ⚪ Request Demo = contact for walkthrough
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {tools.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No tools found. Click &quot;Seed Defaults&quot; to add the default tools.
              </div>
            ) : (
              tools.map((tool) => {
                const IconComponent = iconMap[tool.icon] || Sparkles;
                const statusStyle = statusColors[tool.status];

                return (
                  <div key={tool._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${tool.color}20` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: tool.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{tool.name}</h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            {statusStyle.label}
                          </span>
                          {(() => {
                            const demoStyle = demoAvailabilityColors[tool.demoAvailability] || demoAvailabilityColors['request-demo'];
                            return (
                              <span className={`px-2 py-0.5 text-xs rounded-full ${demoStyle.bg} ${demoStyle.text} flex items-center gap-1`}>
                                <span>{demoStyle.icon}</span>
                                {demoStyle.label}
                              </span>
                            );
                          })()}
                          {tool.isDefault && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                              Default
                            </span>
                          )}
                          {tool.isPremium && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5 truncate">
                          {tool.shortDescription}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span>ID: {tool.toolId}</span>
                          <span>Category: {tool.category}</span>
                          {(tool as AITool & { demoComponent?: string }).demoComponent && (
                            <span className="text-purple-500">Component: {(tool as AITool & { demoComponent?: string }).demoComponent}</span>
                          )}
                          <span>Usage: {tool.totalUsageCount || 0}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTool(tool)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tool.toolId)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Edit/Create Modal */}
      {(editingTool || isCreating) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                {isCreating ? 'Create New Tool' : 'Edit Tool'}
              </h2>
              <button
                onClick={() => {
                  setEditingTool(null);
                  setIsCreating(false);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTool) handleSave(editingTool);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tool ID</label>
                  <input
                    type="text"
                    value={editingTool?.toolId || ''}
                    onChange={(e) =>
                      setEditingTool((prev) => prev && { ...prev, toolId: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                    }
                    placeholder="e.g., math-solver"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    disabled={!isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingTool?.name || ''}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, name: e.target.value })}
                    placeholder="e.g., Math Problem Solver"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingTool?.shortDescription || ''}
                  onChange={(e) => setEditingTool((prev) => prev && { ...prev, shortDescription: e.target.value })}
                  placeholder="Brief tagline (max 100 chars)"
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea
                  value={editingTool?.description || ''}
                  onChange={(e) => setEditingTool((prev) => prev && { ...prev, description: e.target.value })}
                  placeholder="Detailed description of what the tool does"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editingTool?.category || 'tutoring'}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingTool?.status || 'coming-soon'}
                    onChange={(e) =>
                      setEditingTool((prev) => prev && { ...prev, status: e.target.value as AITool['status'] })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="beta">Beta</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Demo Availability</label>
                  <select
                    value={editingTool?.demoAvailability || 'request-demo'}
                    onChange={(e) =>
                      setEditingTool((prev) => prev && { ...prev, demoAvailability: e.target.value as AITool['demoAvailability'] })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="live-demo">🟢 Live Demo - Try it now</option>
                    <option value="interactive-preview">🟡 Interactive Preview - Sample experience</option>
                    <option value="request-demo">⚪ Request Demo - Personalized walkthrough</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={editingTool?.icon || 'Sparkles'}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.keys(iconMap).map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={editingTool?.color || '#10B981'}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, color: e.target.value })}
                    className="w-full h-10 border border-gray-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingTool?.sortOrder || 100}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
                  <select
                    value={editingTool?.apiModel || 'gpt-4o-mini'}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, apiModel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Limit</label>
                  <input
                    type="number"
                    value={editingTool?.defaultDailyLimit || 10}
                    onChange={(e) =>
                      setEditingTool((prev) => prev && { ...prev, defaultDailyLimit: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit</label>
                  <input
                    type="number"
                    value={editingTool?.defaultMonthlyLimit || 100}
                    onChange={(e) =>
                      setEditingTool((prev) => prev && { ...prev, defaultMonthlyLimit: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tokens/Use</label>
                  <input
                    type="number"
                    value={editingTool?.tokensPerUse || 500}
                    onChange={(e) =>
                      setEditingTool((prev) => prev && { ...prev, tokensPerUse: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                <textarea
                  value={editingTool?.systemPrompt || ''}
                  onChange={(e) => setEditingTool((prev) => prev && { ...prev, systemPrompt: e.target.value })}
                  placeholder="Instructions for the AI model"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Demo Component</label>
                <input
                  type="text"
                  value={editingTool?.demoComponent || ''}
                  onChange={(e) => setEditingTool((prev) => prev && { ...prev, demoComponent: e.target.value })}
                  placeholder="e.g., PracticeTestGenerator, MathSolverDemo"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">React component name in /components/demos/</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTool?.hasImplementation || false}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, hasImplementation: e.target.checked })}
                    className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Has UI Implementation (Ready for Demo)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTool?.isDefault || false}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, isDefault: e.target.checked })}
                    className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Default (auto-enabled for new demos)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTool?.isPremium || false}
                    onChange={(e) => setEditingTool((prev) => prev && { ...prev, isPremium: e.target.checked })}
                    className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Premium (paid plans only)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTool(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isCreating ? 'Create Tool' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
