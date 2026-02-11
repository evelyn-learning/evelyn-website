'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Globe,
  Building2,
  Palette,
  Wrench,
  Save,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';

const BUSINESS_TYPES = [
  { id: 'test-prep', name: 'Test Prep', description: 'SAT, ACT, AP exams, standardized testing' },
  { id: 'college-consulting', name: 'College Consulting', description: 'Admissions, essays, college planning' },
  { id: 'tutoring', name: 'General Tutoring', description: 'Subject tutoring, homework help' },
  { id: 'homeschool', name: 'Homeschool', description: 'Homeschool curriculum, resources' },
  { id: 'special-ed', name: 'Special Education', description: 'Learning differences, IEP support' },
];

const AI_TOOLS = [
  { id: 'test-generator', name: 'Practice Test Generator', description: 'Generate unlimited practice tests' },
  { id: 'homework-bot', name: '24/7 Homework Helper', description: 'AI homework assistance chatbot' },
  { id: 'essay-ai', name: 'Essay Scorer', description: 'AI-powered essay feedback' },
  { id: 'math-solver', name: 'Math Solver', description: 'Step-by-step math solutions' },
  { id: 'tutor-copilot', name: 'Tutoring Co-Pilot', description: 'AI assistant for tutors' },
];

const TRIAL_OPTIONS = [
  { days: 7, label: '7 days' },
  { days: 14, label: '14 days (Recommended)' },
  { days: 30, label: '30 days' },
];

export default function NewShowcasePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSite, setCreatedSite] = useState<{ slug: string; accessCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'test-prep',
    originalWebsiteUrl: '',
    trialDays: 14,
    enabledTools: ['test-generator', 'homework-bot', 'essay-ai'],
    theme: {
      primaryColor: '#10B981',
      secondaryColor: '#0F766E',
      accentColor: '#F59E0B',
    },
    content: {
      heroTitle: '',
      heroSubtitle: '',
      aboutText: '',
      services: [] as string[],
    },
    contact: {
      email: '',
      phone: '',
      address: '',
      businessHours: '',
    },
  });

  const [newService, setNewService] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Auto-fill hero title if empty
    const submitData = {
      ...formData,
      content: {
        ...formData.content,
        heroTitle: formData.content.heroTitle || formData.businessName,
        heroSubtitle: formData.content.heroSubtitle || 'AI-Powered Learning Solutions',
      },
    };

    try {
      const res = await fetch('/api/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create site');
      }

      setCreatedSite({
        slug: data.site.slug,
        accessCode: data.site.accessCode,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create site');
    }

    setIsSubmitting(false);
  };

  const toggleTool = (toolId: string) => {
    setFormData(prev => ({
      ...prev,
      enabledTools: prev.enabledTools.includes(toolId)
        ? prev.enabledTools.filter(t => t !== toolId)
        : [...prev.enabledTools, toolId],
    }));
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          services: [...prev.content.services, newService.trim()],
        },
      }));
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        services: prev.content.services.filter((_, i) => i !== index),
      },
    }));
  };

  const copyAccessDetails = async () => {
    if (!createdSite) return;
    const url = `${window.location.origin}/showcase/${createdSite.slug}`;
    const text = `Your demo site is ready!\n\nURL: ${url}\nAccess Code: ${createdSite.accessCode}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Success state
  if (createdSite) {
    const siteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/showcase/${createdSite.slug}`;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Site Created!</h2>
          <p className="text-gray-600 mb-6">
            Your showcase site is ready. Share the access details with your prospect.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Site URL</div>
              <div className="font-mono text-sm text-gray-900 break-all">{siteUrl}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Access Code</div>
              <div className="font-mono text-lg font-bold text-emerald-600">{createdSite.accessCode}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyAccessDetails}
              className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Details'}
            </button>
            <Link
              href={siteUrl}
              target="_blank"
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              href="/admin/showcase"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Showcase Manager
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/admin/showcase"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Showcase Manager
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Showcase Site
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Information */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
                <p className="text-sm text-gray-500">Basic details about the prospect</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="e.g., First School of Mathematics"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Website URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.originalWebsiteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalWebsiteUrl: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Business Type *
              </label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {BUSINESS_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, businessType: type.id }))}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      formData.businessType === type.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Trial Period
              </label>
              <div className="flex gap-3">
                {TRIAL_OPTIONS.map((option) => (
                  <button
                    key={option.days}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, trialDays: option.days }))}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      formData.trialDays === option.days
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* AI Tools */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Tools</h2>
                <p className="text-sm text-gray-500">Select which AI tools to enable for this site</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    formData.enabledTools.includes(tool.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.enabledTools.includes(tool.id)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.enabledTools.includes(tool.id) && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{tool.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 ml-7">{tool.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Theme */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Theme & Branding</h2>
                <p className="text-sm text-gray-500">Customize colors to match their brand</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.theme.primaryColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: e.target.value }
                    }))}
                    className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme.primaryColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.theme.secondaryColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, secondaryColor: e.target.value }
                    }))}
                    className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme.secondaryColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, secondaryColor: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.theme.accentColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, accentColor: e.target.value }
                    }))}
                    className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.theme.accentColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, accentColor: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Content</h2>
                <p className="text-sm text-gray-500">Website copy and information (optional - can be filled later)</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={formData.content.heroTitle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, heroTitle: e.target.value }
                    }))}
                    placeholder={formData.businessName || "Business name will be used if empty"}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.content.heroSubtitle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, heroSubtitle: e.target.value }
                    }))}
                    placeholder="AI-Powered Learning Solutions"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Text
                </label>
                <textarea
                  value={formData.content.aboutText}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    content: { ...prev.content, aboutText: e.target.value }
                  }))}
                  placeholder="Brief description of the business..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    placeholder="Add a service..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addService}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Add
                  </button>
                </div>
                {formData.content.services.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.content.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {service}
                        <button
                          type="button"
                          onClick={() => removeService(idx)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.contact.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contact: { ...prev.contact, address: e.target.value }
                  }))}
                  placeholder="123 Main St, City, State ZIP"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/showcase"
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.businessName || !formData.originalWebsiteUrl}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Showcase Site
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
