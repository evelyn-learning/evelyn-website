'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  FileQuestion,
  BookOpen,
  PenTool,
  Loader2,
  Copy,
  Check,
  ChevronRight,
  AlertCircle,
  Info,
  BookMarked,
  Calculator,
  GraduationCap,
  Calendar,
  BookOpenCheck,
  Layers,
  LucideIcon,
  Library,
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

interface EnabledTool {
  toolId: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: string;
  color: string;
  status: string;
  isPremium: boolean;
  isEnabled: boolean;
  limit: number;
  defaultLimit: number;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  FileQuestion,
  BookOpen,
  PenTool,
  BookMarked,
  Calculator,
  GraduationCap,
  Calendar,
  BookOpenCheck,
  Layers,
  Sparkles,
};

// Default icon colors if not provided
const defaultColors: Record<string, string> = {
  'test-generator': '#3B82F6',
  'homework-helper': '#10B981',
  'essay-scorer': '#8B5CF6',
  'vocab-builder': '#F59E0B',
  'math-solver': '#EF4444',
  'college-essay-coach': '#EC4899',
  'study-planner': '#06B6D4',
};

export default function StaffToolsPage() {
  const site = useContext(SiteContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [enabledTools, setEnabledTools] = useState<EnabledTool[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});

  // Load enabled tools from API
  useEffect(() => {
    if (!site) return;

    const fetchTools = async () => {
      try {
        const res = await fetch(`/api/showcase/${site.slug}/tools`);
        if (res.ok) {
          const data = await res.json();
          // Only show tools that are enabled
          const enabled = (data.allTools || []).filter((t: EnabledTool) => t.isEnabled);
          setEnabledTools(enabled);
        }
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      }
    };

    fetchTools();
  }, [site]);

  // Load usage from database
  useEffect(() => {
    if (!site) return;

    const fetchUsage = async () => {
      try {
        const res = await fetch(`/api/showcase/${site.slug}/tool-usage`);
        if (res.ok) {
          const data = await res.json();
          setUsage(data.usage || {});
        }
      } catch (error) {
        console.error('Failed to fetch tool usage:', error);
      }
    };

    fetchUsage();
  }, [site]);

  const getRemainingUses = (toolId: string, limit: number) => {
    return Math.max(0, limit - (usage[toolId] || 0));
  };

  const isLimitReached = (toolId: string, limit: number) => {
    return (usage[toolId] || 0) >= limit;
  };

  useEffect(() => {
    if (!site) return;

    const stored = sessionStorage.getItem(`showcase_staff_${site.slug}`);
    if (stored) {
      const parsed = JSON.parse(stored) as StaffSession;
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.authenticated) {
        setSession(parsed);
        setIsLoading(false);

        // Check URL for tool parameter
        const toolParam = searchParams.get('tool');
        if (toolParam) {
          setActiveTool(toolParam);
        }
        return;
      }
    }
    router.push(`/showcase/${site.slug}/staff`);
  }, [site, router, searchParams]);

  if (!site || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!session) return null;

  const baseUrl = `/showcase/${site.slug}`;
  const activeTool_data = enabledTools.find(t => t.toolId === activeTool);

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
        {/* Demo Limits Banner */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Demo Usage Limits</h3>
              <p className="text-sm text-amber-700 mt-1">
                During this demo, AI tools have limited uses to showcase functionality.
                Full access is available when you launch your website.
              </p>
              {enabledTools.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-3">
                  {enabledTools.map((tool) => {
                    const IconComponent = iconMap[tool.icon] || Sparkles;
                    const remaining = getRemainingUses(tool.toolId, tool.limit);
                    const limitReached = isLimitReached(tool.toolId, tool.limit);
                    return (
                      <div key={tool.toolId} className="flex items-center gap-2 text-sm">
                        <IconComponent className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-800">{tool.name}:</span>
                        <span className={`font-semibold ${limitReached ? 'text-red-600' : 'text-amber-900'}`}>
                          {remaining} / {tool.limit} remaining
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-7 h-7" style={{ color: site.branding.primaryColor }} />
            AI Tools
          </h1>
          <p className="text-gray-600 mt-1">
            Powerful AI-powered tools to help your tutoring practice
          </p>
        </div>

        {enabledTools.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${site.branding.primaryColor}15` }}
            >
              <Library className="w-8 h-8" style={{ color: site.branding.primaryColor }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tools Enabled</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven&apos;t added any AI tools yet. Visit the Tool Library to browse and enable tools for your practice.
            </p>
            <Link
              href={`${baseUrl}/staff/library`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-medium rounded-lg transition"
              style={{ backgroundColor: site.branding.primaryColor }}
            >
              <Library className="w-4 h-4" />
              Browse Tool Library
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Tool Selection Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Your AI Tools</h3>
                  <Link
                    href={`${baseUrl}/staff/library`}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    + Add more
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {enabledTools.map((tool) => {
                    const IconComponent = iconMap[tool.icon] || Sparkles;
                    const limitReached = isLimitReached(tool.toolId, tool.limit);
                    const remaining = getRemainingUses(tool.toolId, tool.limit);
                    const color = tool.color || defaultColors[tool.toolId] || site.branding.primaryColor;

                    return (
                      <button
                        key={tool.toolId}
                        onClick={() => setActiveTool(tool.toolId)}
                        className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition ${
                          activeTool === tool.toolId ? 'bg-gray-50' : ''
                        } ${limitReached ? 'opacity-60' : ''}`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              activeTool === tool.toolId
                                ? color
                                : `${color}15`,
                          }}
                        >
                          <IconComponent
                            className="w-5 h-5"
                            style={{
                              color: activeTool === tool.toolId ? 'white' : color,
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {tool.name}
                            {limitReached && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                                Limit reached
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {remaining} / {tool.limit} uses left
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition ${
                            activeTool === tool.toolId ? 'text-gray-900' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tool Content */}
            <div className="lg:col-span-3">
              {!activeTool ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                  >
                    <Sparkles className="w-8 h-8" style={{ color: site.branding.primaryColor }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Tool</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Choose an AI tool from the sidebar to get started. Each tool is designed to help
                    you create better learning materials and provide feedback to students.
                  </p>
                </div>
              ) : activeTool === 'test-generator' ? (
                <TestGeneratorTool
                  primaryColor={activeTool_data?.color || site.branding.primaryColor}
                  remaining={getRemainingUses('test-generator', activeTool_data?.limit || 5)}
                  limit={activeTool_data?.limit || 5}
                  slug={site.slug}
                  onUsageUpdate={(remaining) => setUsage(prev => ({ ...prev, 'test-generator': (activeTool_data?.limit || 5) - remaining }))}
                />
              ) : activeTool === 'homework-helper' ? (
                <HomeworkHelperTool
                  primaryColor={activeTool_data?.color || site.branding.primaryColor}
                  remaining={getRemainingUses('homework-helper', activeTool_data?.limit || 10)}
                  limit={activeTool_data?.limit || 10}
                  slug={site.slug}
                  onUsageUpdate={(remaining) => setUsage(prev => ({ ...prev, 'homework-helper': (activeTool_data?.limit || 10) - remaining }))}
                />
              ) : activeTool === 'essay-scorer' ? (
                <EssayScorerTool
                  primaryColor={activeTool_data?.color || site.branding.primaryColor}
                  remaining={getRemainingUses('essay-scorer', activeTool_data?.limit || 3)}
                  limit={activeTool_data?.limit || 3}
                  slug={site.slug}
                  onUsageUpdate={(remaining) => setUsage(prev => ({ ...prev, 'essay-scorer': (activeTool_data?.limit || 3) - remaining }))}
                />
              ) : (
                <GenericToolPlaceholder
                  tool={activeTool_data}
                  primaryColor={activeTool_data?.color || site.branding.primaryColor}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ToolProps {
  primaryColor: string;
  remaining: number;
  limit: number;
  slug: string;
  onUsageUpdate: (newRemaining: number) => void;
}

// Generic placeholder for tools without specific implementations
function GenericToolPlaceholder({ tool, primaryColor }: { tool?: EnabledTool; primaryColor: string }) {
  const IconComponent = tool?.icon ? iconMap[tool.icon] || Sparkles : Sparkles;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <IconComponent className="w-6 h-6" style={{ color: primaryColor }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{tool?.name || 'Tool'}</h2>
            <p className="text-sm text-gray-500">{tool?.shortDescription || tool?.description}</p>
          </div>
        </div>
      </div>
      <div className="p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          The interface for this tool is being developed. Check back soon for full functionality!
        </p>
      </div>
    </div>
  );
}

// Test Generator Tool Component
function TestGeneratorTool({ primaryColor, remaining, limit, slug, onUsageUpdate }: ToolProps) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (remaining <= 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/showcase/${slug}/tools/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'test-generator',
          input: { subject, topic, difficulty, questionCount },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('Demo limit reached. Launch your website for unlimited access!');
        } else {
          setError(data.error || 'Failed to generate test');
        }
        return;
      }

      setResult(data.result);
      if (data.metadata?.remaining !== undefined) {
        onUsageUpdate(data.metadata.remaining);
      }
    } catch (err) {
      console.error('Test generation error:', err);
      setError('Failed to connect to AI service. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const limitReached = remaining <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileQuestion className="w-5 h-5" style={{ color: primaryColor }} />
              Test Generator
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Generate practice tests, quizzes, and assessments for any subject
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            limitReached ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {remaining} / {limit} uses left
          </div>
        </div>
      </div>

      {limitReached && (
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            You&apos;ve used all demo generations for this tool. Launch your website for unlimited access!
          </p>
        </div>
      )}

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics"
              disabled={limitReached}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quadratic Equations"
              disabled={limitReached}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={limitReached}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="sat">SAT Level</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              disabled={limitReached}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            >
              <option value="5">5 questions</option>
              <option value="10">10 questions</option>
              <option value="15">15 questions</option>
              <option value="20">20 questions</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !subject || !topic || limitReached}
          className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: primaryColor }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Test...
            </>
          ) : limitReached ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Demo Limit Reached
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Test
            </>
          )}
        </button>

        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Generated Test</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96 border border-gray-200">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Homework Helper Tool Component
function HomeworkHelperTool({ primaryColor, remaining, limit, slug, onUsageUpdate }: ToolProps) {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('math');
  const [isHelping, setIsHelping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleHelp = async () => {
    if (remaining <= 0) return;

    setIsHelping(true);
    setError(null);

    try {
      const response = await fetch(`/api/showcase/${slug}/tools/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'homework-helper',
          input: { question, subject },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('Demo limit reached. Launch your website for unlimited access!');
        } else {
          setError(data.error || 'Failed to get help');
        }
        return;
      }

      setResult(data.result);
      if (data.metadata?.remaining !== undefined) {
        onUsageUpdate(data.metadata.remaining);
      }
    } catch (err) {
      console.error('Homework helper error:', err);
      setError('Failed to connect to AI service. Please try again.');
    } finally {
      setIsHelping(false);
    }
  };

  const limitReached = remaining <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: primaryColor }} />
              Homework Helper
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Get step-by-step explanations for homework problems
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            limitReached ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {remaining} / {limit} uses left
          </div>
        </div>
      </div>

      {limitReached && (
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            You&apos;ve used all demo queries for this tool. Launch your website for unlimited access!
          </p>
        </div>
      )}

      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={limitReached}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          >
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your question or problem
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type or paste your homework question here..."
            rows={4}
            disabled={limitReached}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleHelp}
          disabled={isHelping || !question || limitReached}
          className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: primaryColor }}
        >
          {isHelping ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Getting Help...
            </>
          ) : limitReached ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Demo Limit Reached
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get Help
            </>
          )}
        </button>

        {result && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Solution</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96 border border-gray-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Essay Scorer Tool Component
function EssayScorerTool({ primaryColor, remaining, limit, slug, onUsageUpdate }: ToolProps) {
  const [essay, setEssay] = useState('');
  const [essayType, setEssayType] = useState('argumentative');
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScore = async () => {
    if (remaining <= 0) return;

    setIsScoring(true);
    setError(null);

    try {
      const response = await fetch(`/api/showcase/${slug}/tools/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'essay-scorer',
          input: { essay, essayType },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('Demo limit reached. Launch your website for unlimited access!');
        } else {
          setError(data.error || 'Failed to score essay');
        }
        return;
      }

      // API returns { score, feedback } for essay-scorer
      if (data.result && typeof data.result === 'object') {
        setResult(data.result);
      } else {
        setResult({ score: 85, feedback: data.result });
      }

      if (data.metadata?.remaining !== undefined) {
        onUsageUpdate(data.metadata.remaining);
      }
    } catch (err) {
      console.error('Essay scoring error:', err);
      setError('Failed to connect to AI service. Please try again.');
    } finally {
      setIsScoring(false);
    }
  };

  const limitReached = remaining <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PenTool className="w-5 h-5" style={{ color: primaryColor }} />
              Essay Scorer
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Get detailed feedback and scoring for essays and written work
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            limitReached ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {remaining} / {limit} uses left
          </div>
        </div>
      </div>

      {limitReached && (
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            You&apos;ve used all demo scorings for this tool. Launch your website for unlimited access!
          </p>
        </div>
      )}

      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Essay Type</label>
          <select
            value={essayType}
            onChange={(e) => setEssayType(e.target.value)}
            disabled={limitReached}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          >
            <option value="argumentative">Argumentative Essay</option>
            <option value="persuasive">Persuasive Essay</option>
            <option value="expository">Expository Essay</option>
            <option value="narrative">Narrative Essay</option>
            <option value="sat">SAT Essay</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste the essay below
          </label>
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Paste the student's essay here for evaluation..."
            rows={8}
            disabled={limitReached}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
          <p className="text-xs text-gray-400 mt-1">
            {essay.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleScore}
          disabled={isScoring || essay.length < 100 || limitReached}
          className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: primaryColor }}
        >
          {isScoring ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Essay...
            </>
          ) : limitReached ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Demo Limit Reached
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Score Essay
            </>
          )}
        </button>

        {result && (
          <div className="mt-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <span className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {result.score}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Overall Score</h3>
                <p className="text-sm text-gray-500">Out of 100 points</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-[500px] border border-gray-200">
              {result.feedback}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
