'use client';

import React, { useCallback, useEffect, useState } from 'react';
import HistoryDetail from './HistoryDetail';
import { TEACHER_ID_KEY } from '@/lib/plagiarism/save-history';

interface HistoryListItem {
  _id: string;
  documentName: string;
  source: 'upload' | 'classroom';
  studentName?: string;
  courseTitle?: string;
  assignmentTitle?: string;
  overallScore: number;
  overallVerdict: string;
  aiScore: number;
  aiVerdict: string;
  plagiarismScore: number;
  plagiarismVerdict: string;
  createdAt: string;
}

type ViewState =
  | { kind: 'list' }
  | { kind: 'detail'; id: string };

export default function HistoryTab() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [items, setItems] = useState<HistoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>({ kind: 'list' });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setTeacherId(localStorage.getItem(TEACHER_ID_KEY));
  }, []);

  const loadList = useCallback(async (tid: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/showcase/plagiarism-detection/history?teacherId=${encodeURIComponent(tid)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load history');
        return;
      }
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (teacherId) loadList(teacherId);
  }, [teacherId, loadList]);

  const handleDelete = async (id: string) => {
    if (!teacherId) return;
    if (!window.confirm('Delete this analysis from your history? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(
        `/api/showcase/plagiarism-detection/history/${encodeURIComponent(id)}?teacherId=${encodeURIComponent(teacherId)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setItems(prev => prev.filter(x => x._id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Delete failed');
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (!teacherId) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-700 mb-2 font-medium">History is saved to your teacher account.</p>
        <p className="text-sm text-gray-500">
          Connect Google Classroom (in the Google Classroom tab) to start saving analyses.
          New analyses you run while connected will appear here automatically.
        </p>
      </div>
    );
  }

  if (view.kind === 'detail') {
    return (
      <HistoryDetail
        teacherId={teacherId}
        id={view.id}
        onBack={() => setView({ kind: 'list' })}
      />
    );
  }

  const verdictColor = (score: number) =>
    score >= 75 ? 'text-green-700 bg-green-100'
    : score >= 40 ? 'text-yellow-700 bg-yellow-100'
    : 'text-red-700 bg-red-100';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Past Analyses</h3>
          <p className="text-xs text-gray-500">
            {items.length} {items.length === 1 ? 'result' : 'results'} on your account.
            Document text is not stored.
          </p>
        </div>
        <button
          onClick={() => teacherId && loadList(teacherId)}
          className="text-xs text-orange-600 hover:text-orange-700 underline"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-12 text-center text-gray-500 text-sm">
          <div className="w-8 h-8 mx-auto mb-2 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          Loading…
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="py-12 text-center text-gray-500 text-sm">
          No analyses yet. Run any single, batch, or Classroom analysis while signed in
          and it will appear here.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
            <div className="col-span-4">Document</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Originality</div>
            <div className="col-span-2">AI verdict</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((it) => (
              <div key={it._id} className="grid grid-cols-12 gap-2 px-3 py-3 text-sm items-center">
                <div className="col-span-4 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{it.documentName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {it.source === 'classroom'
                      ? [it.courseTitle, it.assignmentTitle, it.studentName].filter(Boolean).join(' · ')
                      : 'Uploaded'}
                  </p>
                </div>
                <div className="col-span-2 text-xs text-gray-600">
                  {new Date(it.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  <br />
                  <span className="text-gray-400">
                    {new Date(it.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${verdictColor(it.overallScore)}`}>
                    {it.overallScore}% · {it.overallVerdict}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-gray-700 truncate" title={it.aiVerdict}>
                  {it.aiVerdict || '—'}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setView({ kind: 'detail', id: it._id })}
                    className="text-xs text-orange-600 hover:text-orange-700 underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(it._id)}
                    disabled={deletingId === it._id}
                    className="text-xs text-red-600 hover:text-red-700 underline disabled:opacity-50"
                  >
                    {deletingId === it._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
