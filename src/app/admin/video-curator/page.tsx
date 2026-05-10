'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type {
  DraftClip,
  SavedSegment,
  TopicWithStatus,
  VideoMeta,
} from '@/lib/admin/video-curator/types';

interface SearchQuery {
  query: string;
  channel: string;
  reason: string;
}

function fmt(s: number): string {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function VideoCuratorPage() {
  const { status } = useSession();
  const [topics, setTopics] = useState<TopicWithStatus[]>([]);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    (async () => {
      try {
        setTopicsLoading(true);
        const res = await fetch('/api/admin/video-curator/topics');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { topics: TopicWithStatus[] };
        if (!cancelled) setTopics(data.topics);
      } catch (e) {
        if (!cancelled)
          setTopicsError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setTopicsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const adjustTopic = (
    conceptId: string,
    patch: Partial<Pick<TopicWithStatus, 'savedSegmentCount' | 'draftCount'>>,
  ) => {
    setTopics((prev) =>
      prev.map((t) => (t.conceptId === conceptId ? { ...t, ...patch } : t)),
    );
  };

  const groupedByUnit = useMemo(() => {
    const map = new Map<string, TopicWithStatus[]>();
    for (const t of topics) {
      const arr = map.get(t.cedUnit) ?? [];
      arr.push(t);
      map.set(t.cedUnit, arr);
    }
    return Array.from(map.entries()).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [topics]);

  const activeTopic = topics.find((t) => t.conceptId === activeConceptId) ?? null;

  if (status === 'loading') {
    return <div className="p-8 text-gray-500">Loading session…</div>;
  }
  if (status !== 'authenticated') {
    return (
      <div className="p-8">
        <p className="text-red-600">You must be signed in as an admin.</p>
        <a href="/admin/login" className="text-blue-600 underline">
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h1 className="text-lg font-semibold">Video Curator</h1>
          <p className="text-xs text-gray-500 mt-1">AP Macroeconomics</p>
        </div>
        {topicsLoading && (
          <div className="p-4 text-sm text-gray-500">Loading topics…</div>
        )}
        {topicsError && (
          <div className="p-4 text-sm text-red-600">{topicsError}</div>
        )}
        {!topicsLoading &&
          groupedByUnit.map(([unit, unitTopics]) => (
            <div key={unit} className="border-b border-gray-100">
              <div className="px-4 py-2 bg-gray-100 text-xs font-medium text-gray-700">
                Unit {unit}
              </div>
              {unitTopics.map((t) => {
                const active = t.conceptId === activeConceptId;
                return (
                  <button
                    key={t.conceptId}
                    onClick={() => setActiveConceptId(t.conceptId)}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-l-4 ${
                      active
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {t.cedTopic} {t.cedTitle}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {t.savedSegmentCount > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                            ✓ {t.savedSegmentCount}
                          </span>
                        )}
                        {t.draftCount > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                            ⏳ {t.draftCount}
                          </span>
                        )}
                        {t.savedSegmentCount === 0 && t.draftCount === 0 && (
                          <span className="text-xs text-gray-400">·</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
      </aside>

      <main className="flex-1 overflow-y-auto">
        {activeTopic ? (
          <TopicDetail
            key={activeTopic.conceptId}
            topic={activeTopic}
            onApprove={() =>
              adjustTopic(activeTopic.conceptId, {
                savedSegmentCount: activeTopic.savedSegmentCount + 1,
                draftCount: Math.max(0, activeTopic.draftCount - 1),
              })
            }
            onRejectDraft={() =>
              adjustTopic(activeTopic.conceptId, {
                draftCount: Math.max(0, activeTopic.draftCount - 1),
              })
            }
            onDeleteSaved={() =>
              adjustTopic(activeTopic.conceptId, {
                savedSegmentCount: Math.max(
                  0,
                  activeTopic.savedSegmentCount - 1,
                ),
              })
            }
          />
        ) : (
          <div className="p-8 text-gray-500">
            Select a topic from the left to begin.
          </div>
        )}
      </main>
    </div>
  );
}

interface TopicDetailProps {
  topic: TopicWithStatus;
  onApprove: () => void;
  onRejectDraft: () => void;
  onDeleteSaved: () => void;
}

function TopicDetail({
  topic,
  onApprove,
  onRejectDraft,
  onDeleteSaved,
}: TopicDetailProps) {
  const [drafts, setDrafts] = useState<DraftClip[] | null>(null);
  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([]);
  const [draftsGeneratedAt, setDraftsGeneratedAt] = useState<string | null>(
    null,
  );
  const [draftsError, setDraftsError] = useState<string | null>(null);

  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([]);

  // Manual paste state.
  const [pasteInput, setPasteInput] = useState('');
  const [pasteWorking, setPasteWorking] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pasteDraft, setPasteDraft] = useState<DraftClip | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [draftsRes, savedRes] = await Promise.all([
          fetch(
            `/api/admin/video-curator/drafts?conceptId=${encodeURIComponent(topic.conceptId)}`,
          ),
          fetch(
            `/api/admin/video-curator/save?conceptId=${encodeURIComponent(topic.conceptId)}`,
          ),
        ]);
        if (!cancelled && draftsRes.ok) {
          const data = (await draftsRes.json()) as {
            drafts: DraftClip[];
            searchQueries: SearchQuery[];
            generatedAt: string;
          };
          setDrafts(data.drafts);
          setSearchQueries(data.searchQueries ?? []);
          setDraftsGeneratedAt(data.generatedAt);
        } else if (!cancelled) {
          setDraftsError(`HTTP ${draftsRes.status}`);
        }
        if (!cancelled && savedRes.ok) {
          const data = (await savedRes.json()) as { segments: SavedSegment[] };
          setSavedSegments(data.segments);
        }
      } catch (e) {
        if (!cancelled)
          setDraftsError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [topic.conceptId]);

  const updateDraft = (id: string, patch: Partial<DraftClip['clip']>) => {
    setDrafts((prev) =>
      prev
        ? prev.map((d) =>
            d.id === id && d.clip ? { ...d, clip: { ...d.clip, ...patch } } : d,
          )
        : prev,
    );
  };

  const updatePasteDraft = (patch: Partial<DraftClip['clip']>) => {
    setPasteDraft((prev) =>
      prev && prev.clip ? { ...prev, clip: { ...prev.clip, ...patch } } : prev,
    );
  };

  const approveDraft = async (draft: DraftClip, fromPaste = false) => {
    if (!draft.clip || !draft.video) return;
    try {
      const res = await fetch('/api/admin/video-curator/save', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          conceptId: topic.conceptId,
          video: draft.video,
          segments: [
            {
              startSec: draft.clip.startSec,
              endSec: draft.clip.endSec,
              summary: draft.clip.summary,
            },
          ],
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { saved: SavedSegment[] };
      setSavedSegments((prev) => [...prev, ...data.saved]);
      if (fromPaste) {
        setPasteDraft(null);
      } else {
        // Remove the approved draft from the drafts file too.
        await fetch(
          `/api/admin/video-curator/drafts?id=${encodeURIComponent(draft.id)}`,
          { method: 'DELETE' },
        );
        setDrafts((prev) => (prev ? prev.filter((d) => d.id !== draft.id) : prev));
      }
      onApprove();
    } catch (e) {
      alert(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const rejectDraft = async (draft: DraftClip) => {
    try {
      const res = await fetch(
        `/api/admin/video-curator/drafts?id=${encodeURIComponent(draft.id)}`,
        { method: 'DELETE' },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDrafts((prev) => (prev ? prev.filter((d) => d.id !== draft.id) : prev));
      onRejectDraft();
    } catch (e) {
      alert(`Reject failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const deleteSaved = async (id: string) => {
    if (!confirm('Delete this saved segment?')) return;
    try {
      const res = await fetch(
        `/api/admin/video-curator/save?id=${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSavedSegments((prev) => prev.filter((s) => s.id !== id));
      onDeleteSaved();
    } catch (e) {
      alert(`Delete failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const submitPaste = async () => {
    setPasteWorking(true);
    setPasteError(null);
    setPasteDraft(null);
    try {
      const validateRes = await fetch('/api/admin/video-curator/validate-video', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: pasteInput }),
      });
      if (!validateRes.ok) {
        const data = await validateRes.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${validateRes.status}`);
      }
      const { video } = (await validateRes.json()) as { video: VideoMeta };

      const segmentRes = await fetch('/api/admin/video-curator/segment-video', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          conceptId: topic.conceptId,
          youtubeId: video.youtubeId,
        }),
      });
      if (!segmentRes.ok) {
        const data = await segmentRes.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${segmentRes.status}`);
      }
      const segData = (await segmentRes.json()) as {
        video: VideoMeta;
        clip: DraftClip['clip'];
        errors: string[];
      };
      setPasteDraft({
        id: `paste-${Date.now()}`,
        conceptId: topic.conceptId,
        cedTopic: topic.cedTopic,
        cedTitle: topic.cedTitle,
        video: segData.video,
        reason: 'manually pasted',
        sourceQuality: 'unknown',
        clip: segData.clip,
        errors: segData.errors,
        generatedAt: new Date().toISOString(),
      });
      setPasteInput('');
    } catch (e) {
      setPasteError(e instanceof Error ? e.message : String(e));
    } finally {
      setPasteWorking(false);
    }
  };

  const noDraftsMessage =
    drafts !== null &&
    drafts.length === 0 &&
    (!draftsGeneratedAt ||
      draftsGeneratedAt === '1970-01-01T00:00:00.000Z');

  return (
    <div className="p-6 max-w-5xl">
      <header className="mb-6">
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Unit {topic.cedUnit} · Topic {topic.cedTopic}
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mt-1">
          {topic.cedTitle}
        </h2>
        <p className="text-sm text-gray-700 mt-2 max-w-3xl">
          {topic.loDescription}
        </p>
        {draftsGeneratedAt &&
          draftsGeneratedAt !== '1970-01-01T00:00:00.000Z' && (
            <p className="text-xs text-gray-400 mt-2">
              Drafts generated {new Date(draftsGeneratedAt).toLocaleString()}
            </p>
          )}
      </header>

      {savedSegments.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Approved ({savedSegments.length})
          </h3>
          <div className="space-y-2">
            {savedSegments.map((s) => (
              <div
                key={s.id}
                className="border border-green-200 bg-green-50 rounded p-3 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {s.videoTitle}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {s.videoChannel} · {fmt(s.startSec)}–{fmt(s.endSec)} ·{' '}
                    <a
                      href={`https://www.youtube.com/watch?v=${s.youtubeId}&t=${s.startSec}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      open
                    </a>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">{s.summary}</div>
                </div>
                <button
                  onClick={() => deleteSaved(s.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {drafts === null && !draftsError && (
        <div className="text-sm text-gray-500">Loading drafts…</div>
      )}
      {draftsError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {draftsError}
        </div>
      )}
      {noDraftsMessage && (
        <div className="text-sm text-gray-500 italic mb-6">
          No drafts yet. Run <code>scripts/curate-ap-macro-videos.ts</code> to
          populate, or paste a YouTube URL below.
        </div>
      )}
      {drafts && drafts.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Drafts to review ({drafts.length})
          </h3>
          <div className="space-y-4">
            {drafts.map((d) => (
              <DraftCard
                key={d.id}
                draft={d}
                onChangeClip={(patch) => updateDraft(d.id, patch)}
                onApprove={() => approveDraft(d)}
                onReject={() => rejectDraft(d)}
              />
            ))}
          </div>
        </section>
      )}

      {searchQueries.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Backup search queries
          </h3>
          <div className="space-y-1">
            {searchQueries.map((q, i) => (
              <a
                key={i}
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q.query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:underline"
              >
                🔍 {q.query}{' '}
                <span className="text-xs text-gray-500">
                  ({q.channel}) — {q.reason}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Or paste a YouTube URL
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={pasteInput}
            onChange={(e) => setPasteInput(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
          <button
            onClick={submitPaste}
            disabled={pasteWorking || !pasteInput.trim()}
            className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {pasteWorking ? 'Working…' : 'Find clip'}
          </button>
        </div>
        {pasteError && (
          <div className="text-xs text-red-600 mt-2">{pasteError}</div>
        )}
        {pasteDraft && (
          <div className="mt-4">
            <DraftCard
              draft={pasteDraft}
              onChangeClip={(patch) => updatePasteDraft(patch)}
              onApprove={() => approveDraft(pasteDraft, true)}
              onReject={() => setPasteDraft(null)}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function DraftCard({
  draft,
  onChangeClip,
  onApprove,
  onReject,
}: {
  draft: DraftClip;
  onChangeClip: (patch: Partial<NonNullable<DraftClip['clip']>>) => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const badge = {
    ap_daily: { text: 'AP Daily', className: 'bg-blue-100 text-blue-800' },
    high: { text: 'High quality', className: 'bg-green-100 text-green-800' },
    medium: { text: 'Medium', className: 'bg-amber-100 text-amber-800' },
    unknown: { text: 'Other', className: 'bg-gray-100 text-gray-700' },
  }[draft.sourceQuality];

  if (!draft.video) {
    return (
      <div className="border border-red-200 bg-red-50 rounded p-3">
        <div className="text-sm font-medium text-red-800">
          Could not load proposed video
        </div>
        <div className="text-xs text-red-700 mt-1">
          {draft.errors.join(' · ')}
        </div>
        <div className="mt-2">
          <button
            onClick={onReject}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  const clip = draft.clip;
  const dur = clip ? clip.endSec - clip.startSec : 0;
  const lengthOk = clip ? dur >= 30 && dur <= 240 : false;

  return (
    <div className="border border-gray-200 rounded bg-white">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {draft.video.title}
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              {draft.video.channel}
              {draft.video.durationSec
                ? ` · ${fmt(draft.video.durationSec)}`
                : ''}{' '}
              <span
                className={`ml-1 px-1.5 py-0.5 rounded text-xs ${badge.className}`}
              >
                {badge.text}
              </span>
              {clip && (
                <span className="ml-2 text-gray-500">
                  conf {(clip.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <div className="text-xs text-gray-700 mt-1 italic">
              {draft.reason}
            </div>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${draft.video.youtubeId}${
              clip ? `&t=${clip.startSec}s` : ''
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline shrink-0"
          >
            open ↗
          </a>
        </div>
      </div>

      {clip ? (
        <>
          <div className="p-3">
            <div className="aspect-video bg-black rounded overflow-hidden">
              <iframe
                key={`${draft.video.youtubeId}-${clip.startSec}-${clip.endSec}`}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${draft.video.youtubeId}?start=${clip.startSec}&end=${clip.endSec}&rel=0&modestbranding=1`}
                title={draft.video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Plays {fmt(clip.startSec)}–{fmt(clip.endSec)} ({dur}s).{' '}
              {!lengthOk && (
                <span className="text-amber-700">
                  ⚠ outside 30–240s target
                </span>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-2">
            <label className="text-xs text-gray-600">
              Start (sec)
              <input
                type="number"
                min={0}
                max={draft.video.durationSec || undefined}
                value={clip.startSec}
                onChange={(e) =>
                  onChangeClip({
                    startSec: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="block w-full mt-0.5 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <span className="text-xs text-gray-400">{fmt(clip.startSec)}</span>
            </label>
            <label className="text-xs text-gray-600">
              End (sec)
              <input
                type="number"
                min={clip.startSec + 1}
                max={draft.video.durationSec || undefined}
                value={clip.endSec}
                onChange={(e) =>
                  onChangeClip({
                    endSec: Math.max(
                      clip.startSec + 1,
                      Number(e.target.value) || 0,
                    ),
                  })
                }
                className="block w-full mt-0.5 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <span className="text-xs text-gray-400">{fmt(clip.endSec)}</span>
            </label>
            <label className="text-xs text-gray-600 md:col-span-1">
              Summary
              <textarea
                value={clip.summary}
                onChange={(e) => onChangeClip({ summary: e.target.value })}
                rows={2}
                className="block w-full mt-0.5 border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </label>
          </div>
        </>
      ) : (
        <div className="p-3 text-sm text-amber-800 bg-amber-50">
          No clip identified — segmenter found no good match.
          {draft.errors.length > 0 && (
            <div className="text-xs mt-1">{draft.errors.join(' · ')}</div>
          )}
        </div>
      )}

      <div className="p-3 border-t border-gray-100 flex justify-end gap-2">
        <button
          onClick={onReject}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Reject
        </button>
        <button
          onClick={onApprove}
          disabled={!clip}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Approve
        </button>
      </div>
    </div>
  );
}
