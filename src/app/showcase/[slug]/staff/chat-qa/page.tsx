'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Check,
  LogOut,
} from 'lucide-react';
import { SiteContext } from '../../ShowcaseLayoutClient';

interface QAPair {
  _id?: string;
  question: string;
  answer: string;
  enabled: boolean;
  createdAt?: string;
}

export default function ChatQAPage() {
  const site = useContext(SiteContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!site) return;

    // Check for staff session
    const stored = sessionStorage.getItem(`showcase_staff_${site.slug}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.authenticated) {
        loadQAPairs();
        return;
      }
    }
    router.push(`/showcase/${site.slug}/staff`);
  }, [site, router]);

  const loadQAPairs = async () => {
    if (!site) return;
    try {
      const res = await fetch(`/api/showcase/${site.slug}/chat-qa`);
      if (res.ok) {
        const data = await res.json();
        setQaPairs(data.qaPairs || []);
      }
    } catch (err) {
      console.error('Failed to load Q&A pairs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (qa: QAPair) => {
    if (!site) return;
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/showcase/${site.slug}/chat-qa`, {
        method: qa._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qa),
      });

      if (res.ok) {
        setSuccess(qa._id ? 'Q&A updated successfully!' : 'Q&A added successfully!');
        setTimeout(() => setSuccess(null), 3000);
        loadQAPairs();
        setEditingId(null);
        setIsAdding(false);
        setFormData({ question: '', answer: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save Q&A');
      }
    } catch {
      setError('Failed to save Q&A');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!site || !confirm('Are you sure you want to delete this Q&A?')) return;

    try {
      const res = await fetch(`/api/showcase/${site.slug}/chat-qa?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccess('Q&A deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
        loadQAPairs();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete Q&A');
      }
    } catch {
      setError('Failed to delete Q&A');
    }
  };

  const handleToggle = async (qa: QAPair) => {
    await handleSave({ ...qa, enabled: !qa.enabled });
  };

  const handleLogout = () => {
    if (!site) return;
    sessionStorage.removeItem(`showcase_staff_${site.slug}`);
    router.push(`/showcase/${site.slug}/staff`);
  };

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
                <h1 className="text-xl font-bold text-gray-900">Custom Q&A Pairs</h1>
                <p className="text-sm text-gray-500">Train your AI assistant with custom answers</p>
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
        {/* Info Box */}
        <div
          className="rounded-xl p-4 mb-6 flex items-start gap-3"
          style={{ backgroundColor: `${site.branding.primaryColor}10` }}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: site.branding.primaryColor }} />
          <div>
            <p className="text-sm" style={{ color: site.branding.primaryColor }}>
              Custom Q&A pairs help your AI assistant answer frequently asked questions with accurate, consistent information.
              When visitors ask similar questions, the AI will use these answers as reference.
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 rounded-xl bg-green-50 text-green-700 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add New Button */}
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              setFormData({ question: '', answer: '' });
            }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: site.branding.primaryColor }}
          >
            <Plus className="w-4 h-4" />
            Add New Q&A
          </button>
        )}

        {/* Add Form */}
        {isAdding && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Q&A</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g., What are your business hours?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide the answer that the AI should give..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSave({ question: formData.question, answer: formData.answer, enabled: true })}
                  disabled={!formData.question || !formData.answer || isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: site.branding.primaryColor }}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({ question: '', answer: '' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium transition hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Q&A List */}
        <div className="space-y-4">
          {qaPairs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-semibold text-gray-900 mb-2">No Q&A pairs yet</h3>
              <p className="text-gray-500 text-sm">
                Add custom Q&A pairs to help your AI assistant answer common questions.
              </p>
            </div>
          ) : (
            qaPairs.map((qa, idx) => (
              <div
                key={qa._id || idx}
                className={`bg-white rounded-xl shadow-sm border p-6 ${
                  qa.enabled ? 'border-gray-200' : 'border-gray-200 opacity-60'
                }`}
              >
                {editingId === qa._id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer
                      </label>
                      <textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSave({ ...qa, question: formData.question, answer: formData.answer })}
                        disabled={!formData.question || !formData.answer || isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: site.branding.primaryColor }}
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ question: '', answer: '' });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium transition hover:bg-gray-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{qa.question}</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{qa.answer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(qa)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            qa.enabled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {qa.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(qa._id || null);
                            setFormData({ question: qa.question, answer: qa.answer });
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => qa._id && handleDelete(qa._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
