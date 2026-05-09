'use client';

/**
 * Dev-only learning-gaps inspector. NOT linked from production UI;
 * accessible at /tutor/dev/gaps?studentId=<id>. Read-only.
 *
 * Purpose: verify the gap-detection pipeline end-to-end on the existing
 * demo tutor — fire some misconception-style errors, end the session,
 * open this page to confirm the rich GapEntry shape (kind, status,
 * confidence, observation, signals, quotes, sessionIds) landed.
 */

import { useEffect, useState } from 'react';

interface GapEvidence {
  signals: string[];
  observation: string;
  studentQuotes: string[];
}

interface GapEntry {
  id: string;
  kind?: 'lo' | 'prerequisite';
  loId?: string;
  conceptLabel?: string;
  conceptId?: string;
  status: 'candidate' | 'confirmed' | 'resolved' | 'open';
  confidence?: number;
  evidence?: GapEvidence;
  sessionIds?: string[];
  firstSeenAt: string;
  lastSeenAt: string;
  description?: string;
}

interface ProfileResp {
  profile?: {
    id: string;
    gaps: GapEntry[];
  };
}

function statusBadgeClass(status: GapEntry['status']): string {
  switch (status) {
    case 'candidate': return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    case 'confirmed': return 'bg-red-100 text-red-900 border-red-300';
    case 'resolved': return 'bg-green-100 text-green-900 border-green-300';
    case 'open': return 'bg-gray-100 text-gray-900 border-gray-300';
  }
}

export default function GapsDevPage() {
  const [studentId, setStudentId] = useState('');
  const [gaps, setGaps] = useState<GapEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastFetchedAt, setLastFetchedAt] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('studentId') ?? '';
    setStudentId(sid);
  }, []);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/tutor/student-profile/${encodeURIComponent(studentId)}`)
      .then((r) => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then((data: ProfileResp) => {
        setGaps(data.profile?.gaps ?? []);
        setLastFetchedAt(new Date().toLocaleTimeString());
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [studentId, refreshKey]);

  // Auto-refetch when the tab regains focus — common workflow is end the
  // session, switch to this tab, but the commit is still in flight on
  // first focus. A focus listener re-fetches once the user comes back.
  useEffect(() => {
    function onFocus() { setRefreshKey((k) => k + 1); }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-mono text-sm text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-bold">Learning gaps — dev inspector</h1>
        <p className="mb-4 text-xs text-gray-600">
          Read-only view of <code>StudentProfile.gaps</code>. Fire some misconception-style errors in the demo tutor, end the session, then refresh.
        </p>
        <div className="mb-4 flex items-center gap-2">
          <label className="text-xs uppercase tracking-wide text-gray-500">studentId:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. demo-student-001"
            className="flex-1 rounded border border-gray-300 bg-white px-3 py-1.5 font-mono"
          />
          <button
            onClick={refresh}
            className="rounded bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
        {lastFetchedAt && (
          <div className="mb-3 text-[11px] text-gray-500">last fetched: {lastFetchedAt}</div>
        )}

        {!studentId && (
          <div className="rounded border border-gray-200 bg-white p-4 text-gray-500">
            Enter a studentId above, or pass <code>?studentId=…</code> in the URL.
          </div>
        )}
        {loading && <div className="text-gray-500">Loading…</div>}
        {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-800">Error: {error}</div>}

        {gaps && gaps.length === 0 && (
          <div className="rounded border border-gray-200 bg-white p-4 text-gray-500">
            No gaps recorded for this student yet.
          </div>
        )}

        {gaps && gaps.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-gray-600">{gaps.length} gap{gaps.length === 1 ? '' : 's'}</div>
            {gaps.map((g) => (
              <div key={g.id} className="rounded border border-gray-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-900">
                    {g.kind ?? 'legacy'}
                  </span>
                  <span className={`rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusBadgeClass(g.status)}`}>
                    {g.status}
                  </span>
                  {g.confidence !== undefined && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      conf {g.confidence.toFixed(2)}
                    </span>
                  )}
                  {g.kind === 'prerequisite' ? (
                    <span className="font-semibold">&ldquo;{g.conceptLabel ?? '(?)'}&rdquo;</span>
                  ) : (
                    <span className="font-semibold">{g.loId ?? '(?)'}</span>
                  )}
                  {g.conceptId && <span className="text-xs text-gray-500">→ {g.conceptId}</span>}
                </div>

                <div className="mb-2 text-gray-800">
                  {g.evidence?.observation ?? g.description ?? <em className="text-gray-400">(no observation)</em>}
                </div>

                {g.evidence?.signals && g.evidence.signals.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {g.evidence.signals.map((s, i) => (
                      <span key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">{s}</span>
                    ))}
                  </div>
                )}

                {g.evidence?.studentQuotes && g.evidence.studentQuotes.length > 0 && (
                  <div className="mb-2 border-l-2 border-gray-300 pl-3 text-gray-700">
                    {g.evidence.studentQuotes.map((q, i) => (
                      <div key={i}>&ldquo;{q}&rdquo;</div>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
                  <span>first seen: {g.firstSeenAt.slice(0, 16).replace('T', ' ')}</span>
                  <span>last seen: {g.lastSeenAt.slice(0, 16).replace('T', ' ')}</span>
                  {g.sessionIds && g.sessionIds.length > 0 && (
                    <span>sessions: {g.sessionIds.length}</span>
                  )}
                  <span className="text-gray-400">{g.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
