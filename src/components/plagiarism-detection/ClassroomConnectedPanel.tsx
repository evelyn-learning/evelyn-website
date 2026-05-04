'use client';

import React, { useEffect, useState } from 'react';
import { saveAnalysisToHistory } from '@/lib/plagiarism/save-history';
import type { AssignmentContext, BatchSubmission, EnhancedAnalysisResult } from './types';

interface ClassroomCourseDTO { id: string; name: string; section?: string; }
interface ClassroomAssignmentDTO { id: string; title: string; dueDate?: string; }
interface ClassroomSubmissionDTO {
  id: string;
  studentName: string;
  studentEmail?: string;
  state?: string;
  submittedAt?: string;
  attachments: { driveFileId: string; title?: string }[];
}

interface Props {
  teacherId: string;
  teacherEmail: string;
  context: AssignmentContext;
  onDisconnect: () => void;
  onAuthLost: (code: string) => void;
  onAnalysisComplete: (submissions: BatchSubmission[]) => void;
}

export default function ClassroomConnectedPanel({
  teacherId,
  teacherEmail,
  context,
  onDisconnect,
  onAuthLost,
  onAnalysisComplete,
}: Props) {
  const [courses, setCourses] = useState<ClassroomCourseDTO[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const [assignments, setAssignments] = useState<ClassroomAssignmentDTO[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');

  const [submissions, setSubmissions] = useState<ClassroomSubmissionDTO[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState<{ done: number; total: number } | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  // Per-row analysis results (keyed by submission id), so each row can show
  // its own outcome instead of a stale "Pending" badge.
  const [analyzedById, setAnalyzedById] = useState<Record<string, BatchSubmission>>({});

  // Load courses on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCoursesLoading(true);
      setCoursesError(null);
      try {
        const res = await fetch(`/api/classroom/courses?teacherId=${encodeURIComponent(teacherId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 401 && data.code) {
          onAuthLost(data.code);
          return;
        }
        if (!res.ok) {
          setCoursesError(data.error || 'Failed to load courses');
          return;
        }
        setCourses(data.courses || []);
      } catch (err) {
        if (!cancelled) setCoursesError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        if (!cancelled) setCoursesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [teacherId, onAuthLost]);

  // Load assignments when course selected
  useEffect(() => {
    if (!selectedCourseId) {
      setAssignments([]);
      setSelectedAssignmentId('');
      return;
    }
    let cancelled = false;
    (async () => {
      setAssignmentsLoading(true);
      try {
        const res = await fetch(
          `/api/classroom/courses/${encodeURIComponent(selectedCourseId)}/assignments?teacherId=${encodeURIComponent(teacherId)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 401 && data.code) {
          onAuthLost(data.code);
          return;
        }
        setAssignments(data.assignments || []);
        setSelectedAssignmentId('');
      } finally {
        if (!cancelled) setAssignmentsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedCourseId, teacherId, onAuthLost]);

  // Load submissions preview when assignment selected
  useEffect(() => {
    // Reset prior-run results whenever the user switches course or assignment.
    setAnalyzedById({});
    setAnalyzeError(null);
    if (!selectedCourseId || !selectedAssignmentId) {
      setSubmissions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setSubmissionsLoading(true);
      try {
        const res = await fetch(
          `/api/classroom/assignments/${encodeURIComponent(selectedCourseId)}/${encodeURIComponent(selectedAssignmentId)}/submissions?teacherId=${encodeURIComponent(teacherId)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 401 && data.code) {
          onAuthLost(data.code);
          return;
        }
        setSubmissions(data.submissions || []);
      } finally {
        if (!cancelled) setSubmissionsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedCourseId, selectedAssignmentId, teacherId, onAuthLost]);

  const handleAnalyzeAll = async () => {
    setAnalyzing(true);
    setAnalyzeError(null);
    setAnalyzeProgress({ done: 0, total: submissions.filter(s => s.attachments.length > 0).length });
    try {
      const res = await fetch(
        `/api/classroom/assignments/${encodeURIComponent(selectedCourseId)}/${encodeURIComponent(selectedAssignmentId)}/analyze`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherId, context }),
        }
      );
      const data = await res.json();
      if (res.status === 401 && data.code) {
        onAuthLost(data.code);
        return;
      }
      if (!res.ok) {
        setAnalyzeError(data.error || 'Batch analysis failed');
        return;
      }

      const batch: BatchSubmission[] = (data.submissions || []).map((s: {
        id: string;
        fileName: string;
        studentName?: string;
        studentEmail?: string;
        driveFileId?: string;
        submittedAt?: string;
        status: 'complete' | 'error';
        result?: BatchSubmission['result'];
        error?: string;
      }) => ({
        id: s.id,
        fileName: s.studentName ? `${s.studentName} — ${s.fileName}` : s.fileName,
        studentName: s.studentName,
        studentEmail: s.studentEmail,
        driveFileId: s.driveFileId,
        submittedAt: s.submittedAt,
        source: 'classroom',
        status: s.status,
        result: s.result,
        error: s.error,
      }));

      // Keep a per-row map so each submission row can show its own outcome.
      const map: Record<string, BatchSubmission> = {};
      for (const b of batch) map[b.id] = b;
      setAnalyzedById(map);

      onAnalysisComplete(batch);
      setAnalyzeProgress({ done: batch.length, total: batch.length });

      // Surface the results: scroll the Class Dashboard into view so the user
      // sees them even if they were glancing at the submission list.
      setTimeout(() => {
        document
          .getElementById('classroom-results')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);

      // Persist each completed submission to teacher history (best-effort,
      // non-blocking). Raw text is not in `result` — see analyze-text.ts.
      const courseTitle = courses.find(c => c.id === selectedCourseId)?.name;
      const assignmentTitle = assignments.find(a => a.id === selectedAssignmentId)?.title;
      for (const sub of batch) {
        if (sub.status !== 'complete' || !sub.result) continue;
        void saveAnalysisToHistory({
          documentName: sub.fileName,
          source: 'classroom',
          result: sub.result as EnhancedAnalysisResult,
          studentName: sub.studentName,
          studentEmail: sub.studentEmail,
          courseId: selectedCourseId,
          courseTitle,
          assignmentId: selectedAssignmentId,
          assignmentTitle,
          driveFileId: sub.driveFileId,
          submittedAt: sub.submittedAt,
          context,
        });
      }
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'Batch analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const turnedInCount = submissions.filter(s => s.attachments.length > 0).length;
  const analyzedCount = Object.keys(analyzedById).length;
  const hasAnalyzed = analyzedCount > 0;
  const completedAnalyses = Object.values(analyzedById).filter(b => b.status === 'complete' && b.result);
  const concernCount = completedAnalyses.filter(b => b.result!.overallScore < 40).length;
  const reviewCount = completedAnalyses.filter(b => b.result!.overallScore >= 40 && b.result!.overallScore < 75).length;
  const originalCount = completedAnalyses.filter(b => b.result!.overallScore >= 75).length;

  const scrollToResults = () => {
    document
      .getElementById('classroom-results')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full" aria-hidden="true" />
          <div>
            <p className="text-sm text-gray-500 leading-tight">Connected as</p>
            <p className="font-medium text-gray-900">{teacherEmail}</p>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="text-sm text-gray-500 hover:text-red-600 underline"
        >
          Disconnect
        </button>
      </div>

      {/* Course + assignment dropdowns */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={coursesLoading || courses.length === 0}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="">{coursesLoading ? 'Loading…' : 'Select a course'}</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.section ? ` (${c.section})` : ''}
              </option>
            ))}
          </select>
          {coursesError && <p className="text-xs text-red-600 mt-1">{coursesError}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Assignment</label>
          <select
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            disabled={!selectedCourseId || assignmentsLoading || assignments.length === 0}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="">{!selectedCourseId ? 'Select course first' : assignmentsLoading ? 'Loading…' : 'Select an assignment'}</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}{a.dueDate ? ` — due ${a.dueDate}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success banner — shown after a completed analysis run. */}
      {selectedAssignmentId && hasAnalyzed && !analyzing && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-green-900">
                Analysis complete · {completedAnalyses.length} of {analyzedCount} analyzed
              </p>
              <p className="text-xs text-green-800 mt-0.5">
                {concernCount > 0 && <span className="font-medium">{concernCount} significant concern{concernCount === 1 ? '' : 's'}</span>}
                {concernCount > 0 && (reviewCount > 0 || originalCount > 0) && ' · '}
                {reviewCount > 0 && <span>{reviewCount} need{reviewCount === 1 ? 's' : ''} review</span>}
                {reviewCount > 0 && originalCount > 0 && ' · '}
                {originalCount > 0 && <span>{originalCount} original</span>}
                {completedAnalyses.length === 0 && <span>All submissions failed to analyze — see errors below.</span>}
              </p>
            </div>
          </div>
          <button
            onClick={scrollToResults}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition whitespace-nowrap"
          >
            View Results
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Submissions panel */}
      {selectedAssignmentId && (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-800">
              Submissions {submissionsLoading ? '(loading…)' : `(${submissions.length})`}
            </h4>
            <button
              onClick={handleAnalyzeAll}
              disabled={analyzing || turnedInCount === 0 || submissionsLoading}
              className={
                analyzing
                  ? 'px-4 py-2 text-sm bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
                  : hasAnalyzed
                    ? 'px-4 py-2 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'px-4 py-2 text-sm bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
              }
            >
              {analyzing
                ? `Analyzing ${analyzeProgress?.done ?? 0}/${analyzeProgress?.total ?? 0}…`
                : hasAnalyzed
                  ? `Re-analyze All Submissions${turnedInCount > 0 ? ` (${turnedInCount})` : ''}`
                  : `Analyze All Submissions${turnedInCount > 0 ? ` (${turnedInCount})` : ''}`}
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {submissions.length === 0 && !submissionsLoading && (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">No submissions for this assignment.</p>
            )}
            {submissions.map((s) => {
              const analyzed = analyzedById[s.id];
              const renderBadge = () => {
                if (s.attachments.length === 0) {
                  return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">No attachment</span>;
                }
                if (analyzing && !analyzed) {
                  return (
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing…
                    </span>
                  );
                }
                if (analyzed?.status === 'complete' && analyzed.result) {
                  const score = analyzed.result.overallScore;
                  const cls =
                    score >= 75 ? 'bg-green-100 text-green-800'
                    : score >= 40 ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800';
                  return (
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${cls}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {score}% · {analyzed.result.overallVerdict}
                    </span>
                  );
                }
                if (analyzed?.status === 'error') {
                  return (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700" title={analyzed.error}>
                      Failed
                    </span>
                  );
                }
                return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">Pending</span>;
              };

              return (
                <div key={s.id} className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{s.studentName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {s.attachments[0]?.title || '—'}
                        {s.submittedAt ? ` · ${new Date(s.submittedAt).toLocaleString()}` : ''}
                      </p>
                    </div>
                    {renderBadge()}
                  </div>
                  {analyzed?.status === 'error' && analyzed.error && (
                    <div className="mt-2 ml-0 p-2 rounded-md bg-red-50 border border-red-200 text-xs text-red-700">
                      <span className="font-semibold">Error:</span> {analyzed.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analyzeError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {analyzeError}
        </div>
      )}
    </div>
  );
}
