'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { safeAPICall } from '@/lib/utils/api-error-handler';
import { saveAnalysisToHistory } from '@/lib/plagiarism/save-history';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';
import AssignmentContextInput from './AssignmentContext';
import AnnotatedText from './AnnotatedText';
import AIDetectionPanel from './AIDetectionPanel';
import PlagiarismPanel from './PlagiarismPanel';
import ReportExport from './ReportExport';
import BatchUploader from './BatchUploader';
import BatchDashboard from './BatchDashboard';
import ComparisonView from './ComparisonView';
import ClassroomTab from './ClassroomTab';
import HistoryTab from './HistoryTab';
import { SAMPLE_TEXTS, SEVERITY_STYLES } from './constants';
import type {
  AssignmentContext,
  EnhancedAnalysisResult,
  BatchSubmission,
  FeatureFlags,
  ViewMode,
} from './types';

interface PlagiarismDetectorProps {
  features?: Partial<FeatureFlags>;
}

export default function PlagiarismDetector({ features: featureOverrides }: PlagiarismDetectorProps) {
  const trackInteraction = useTrackInteraction();

  const features: FeatureFlags = {
    inlineHighlighting: true,
    splitScoring: true,
    contextInputs: true,
    reportExport: true,
    batchMode: true,
    resubmissionComparison: true,
    ...featureOverrides,
  };

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('single');

  // If we just returned from Google OAuth, land on the Classroom tab so its
  // mount effect can ingest the query params (google_connected / teacher_id /
  // teacher_email or google_error) instead of sitting on Single Analysis with
  // an unprocessed URL.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.has('google_connected') || params.has('google_error')) {
      setViewMode('classroom');
    }
  }, []);

  // Single analysis state
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EnhancedAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Assignment context
  const [context, setContext] = useState<AssignmentContext>({
    gradeLevel: 10,
    subject: 'english',
    assignmentType: 'essay',
  });

  // Batch state
  const [batchSubmissions, setBatchSubmissions] = useState<BatchSubmission[]>([]);
  const [selectedBatchItem, setSelectedBatchItem] = useState<BatchSubmission | null>(null);

  // File upload for single mode
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (ext === '.txt') {
      setText(await file.text());
      setResult(null);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/showcase/plagiarism-detection/parse-file', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.text) {
      setText(data.text);
      setResult(null);
    } else if (data.error) {
      setError(data.error);
    }
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter text to analyze.');
      return;
    }
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 50) {
      setError('Please enter at least 50 words for accurate analysis.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    trackInteraction('tool_use', 'analyze_text', { wordCount, context, submittedText: text.slice(0, 2000) });

    const { data, error: apiError } = await safeAPICall<{ result: EnhancedAnalysisResult }>(
      '/api/showcase/plagiarism-detection/analyze',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          context: features.contextInputs ? context : undefined,
        }),
      }
    );

    if (apiError) {
      setError(apiError.message);
    } else if (data?.result) {
      setResult(data.result);
      trackInteraction('tool_use', 'scan_complete', {
        overallScore: data.result.overallScore,
        aiScore: data.result.aiDetection.score,
        plagiarismScore: data.result.plagiarism.score,
        ...(data.result.usage && {
          inputTokens: data.result.usage.inputTokens,
          outputTokens: data.result.usage.outputTokens,
          model: data.result.usage.model,
        }),
      });
      // Best-effort save to teacher history (no-op if not connected).
      void saveAnalysisToHistory({
        documentName: selectedBatchItem?.fileName || 'Pasted text',
        source: 'upload',
        result: data.result,
        context,
      });
    }

    setIsAnalyzing(false);
  };

  const loadSample = (type: 'original' | 'suspicious') => {
    setText(SAMPLE_TEXTS[type]);
    setResult(null);
    trackInteraction('click', 'load_sample', { sampleType: type });
  };

  const handleBatchComplete = useCallback((submissions: BatchSubmission[]) => {
    setBatchSubmissions(submissions);
    trackInteraction('tool_use', 'batch_complete', { count: submissions.filter(s => s.status === 'complete').length });
  }, [trackInteraction]);

  const handleClassroomComplete = useCallback((submissions: BatchSubmission[]) => {
    setBatchSubmissions(submissions);
    trackInteraction('tool_use', 'classroom_batch_complete', {
      count: submissions.filter(s => s.status === 'complete').length,
      total: submissions.length,
    });
    // Stay on the Classroom tab — results render inline below.
  }, [trackInteraction]);

  const handleSelectBatchItem = (sub: BatchSubmission) => {
    setSelectedBatchItem(sub);
    setText(sub.text || '');
    setResult(sub.result || null);
    setViewMode('single');
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-green-50';
    if (score >= 40) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  // Determine which view to show for batch detail
  const showBatchDetail = selectedBatchItem && viewMode === 'single';

  return (
    <div className="bg-gradient-to-br from-slate-50 to-orange-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium mb-3">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            AI-Powered Analysis
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Plagiarism & AI Detection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Analyze student submissions for originality, AI-generated content, and plagiarism indicators.
            Designed for K-12 educators.
          </p>
        </div>

        {/* Mode tabs */}
        {(features.batchMode || features.resubmissionComparison) && (
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 max-w-md mx-auto">
            <button
              onClick={() => { setViewMode('single'); setSelectedBatchItem(null); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                viewMode === 'single' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Single Analysis
            </button>
            {features.batchMode && (
              <button
                onClick={() => setViewMode('batch')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  viewMode === 'batch' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Batch Upload
              </button>
            )}
            {features.batchMode && (
              <button
                onClick={() => setViewMode('classroom')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  viewMode === 'classroom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Google Classroom
              </button>
            )}
            <button
              onClick={() => setViewMode('history')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                viewMode === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              History
            </button>
            {features.resubmissionComparison && result && viewMode !== 'batch' && (
              <button
                onClick={() => setViewMode('comparison')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  viewMode === 'comparison' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Compare Revision
              </button>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SINGLE ANALYSIS MODE */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {viewMode === 'single' && (
          <>
            {/* Back to batch button */}
            {showBatchDetail && (
              <button
                onClick={() => { setViewMode('batch'); setSelectedBatchItem(null); setResult(null); setText(''); }}
                className="mb-4 text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Class Dashboard
              </button>
            )}

            {/* Assignment Context */}
            <div className="mb-6">
              <AssignmentContextInput
                context={context}
                onChange={setContext}
                enabled={features.contextInputs}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {showBatchDetail ? selectedBatchItem.fileName : 'Text to Analyze'}
                </h3>

                <textarea
                  value={text}
                  onChange={(e) => { setText(e.target.value); setResult(null); }}
                  placeholder="Paste student essay or text to analyze... (minimum 50 words)"
                  className="w-full min-h-[200px] p-4 border border-gray-200 rounded-xl resize-y focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />

                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-3 items-center">
                    <button onClick={() => loadSample('original')} className="text-xs text-orange-600 hover:text-orange-700 underline">
                      Original Sample
                    </button>
                    <button onClick={() => loadSample('suspicious')} className="text-xs text-orange-600 hover:text-orange-700 underline">
                      Suspicious Sample
                    </button>
                    <label className="text-xs text-orange-600 hover:text-orange-700 cursor-pointer underline">
                      <input type="file" accept=".docx,.pdf,.txt" className="hidden" onChange={handleFileUpload} />
                      Upload File
                    </label>
                  </div>
                  <span className="text-xs text-gray-400">
                    {text.split(/\s+/).filter(w => w).length} words
                  </span>
                </div>

                <button
                  onClick={analyzeText}
                  disabled={isAnalyzing || text.split(/\s+/).filter(w => w).length < 50}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : 'Analyze for Originality'}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Results Panel */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>

                {!result && !isAnalyzing && (
                  <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
                    <div className="text-center">
                      <span className="text-5xl mb-4 block">&#128269;</span>
                      <p>Paste text and click analyze to check originality</p>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="h-full flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                      <p className="text-gray-600">Scanning for originality issues...</p>
                      <p className="text-xs text-gray-400 mt-1">Analyzing AI patterns and plagiarism separately</p>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-5 overflow-y-auto max-h-[900px] pr-2">
                    {/* Overall Score */}
                    <div className={`${getScoreBg(result.overallScore)} rounded-xl p-5`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Overall Originality</p>
                          <p className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                            {result.overallScore}%
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-medium text-sm ${
                          result.overallVerdict === 'Original' ? 'bg-green-200 text-green-800' :
                          result.overallVerdict === 'Needs Review' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {result.overallVerdict}
                        </span>
                      </div>
                    </div>

                    {/* Report Export — prominent placement right after scores */}
                    <ReportExport
                      result={result}
                      submittedText={text}
                      enabled={features.reportExport}
                    />

                    {/* Split Panels */}
                    {features.splitScoring && (
                      <div className="space-y-4">
                        <AIDetectionPanel result={result} />
                        <PlagiarismPanel result={result} />
                      </div>
                    )}

                    {/* Concerns */}
                    {result.concerns.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Concerns Found</h4>
                        <div className="space-y-2">
                          {result.concerns.map((concern, idx) => (
                            <div key={idx} className={`p-3 rounded-lg border ${SEVERITY_STYLES[concern.severity]}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium uppercase">{concern.severity}</span>
                                <span className="font-medium text-sm">{concern.type}</span>
                              </div>
                              <p className="text-sm mb-1">{concern.description}</p>
                              <p className="text-xs opacity-80"><strong>Suggestion:</strong> {concern.suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
                        <ul className="space-y-1.5">
                          {result.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-green-500 mt-0.5">&#10003;</span> {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>

            {/* Inline Annotated Text — full width below */}
            {result && features.inlineHighlighting && result.annotations.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Annotated Submission
                </h3>
                <AnnotatedText
                  text={text}
                  annotations={result.annotations}
                  enabled={features.inlineHighlighting}
                />
              </div>
            )}

            {/* Resubmission Comparison entry (shown after results) */}
            {result && features.resubmissionComparison && viewMode === 'single' && (
              <div className="mt-6">
                <button
                  onClick={() => setViewMode('comparison')}
                  className="w-full py-3 bg-blue-50 border border-blue-200 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition text-sm"
                >
                  Compare with Revised Submission
                </button>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* BATCH MODE */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {viewMode === 'batch' && features.batchMode && (
          <div className="space-y-6">
            {/* Assignment context also applies to batch */}
            <AssignmentContextInput
              context={context}
              onChange={setContext}
              enabled={features.contextInputs}
            />

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Batch Upload</h3>
              <BatchUploader
                context={context}
                onComplete={handleBatchComplete}
                enabled={features.batchMode}
              />
            </div>

            {batchSubmissions.some(s => s.status === 'complete') && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Class Dashboard</h3>
                <BatchDashboard
                  submissions={batchSubmissions}
                  onSelectSubmission={handleSelectBatchItem}
                  enabled={features.batchMode}
                />
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* GOOGLE CLASSROOM MODE */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {viewMode === 'classroom' && features.batchMode && (
          <div className="space-y-6">
            <AssignmentContextInput
              context={context}
              onChange={setContext}
              enabled={features.contextInputs}
            />
            <ClassroomTab
              context={context}
              onAnalysisComplete={handleClassroomComplete}
            />
            {batchSubmissions.some(s => s.source === 'classroom' && s.status === 'complete') && (
              <div id="classroom-results" className="bg-white rounded-2xl shadow-lg p-6 scroll-mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Class Dashboard</h3>
                <BatchDashboard
                  submissions={batchSubmissions}
                  onSelectSubmission={handleSelectBatchItem}
                  enabled={features.batchMode}
                />
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HISTORY MODE */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {viewMode === 'history' && <HistoryTab />}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COMPARISON MODE */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {viewMode === 'comparison' && features.resubmissionComparison && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <ComparisonView
              originalText={text}
              originalResult={result || undefined}
              context={context}
              enabled={features.resubmissionComparison}
            />
          </div>
        )}

        {/* Features Banner */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Detection Capabilities</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '\u{1F4CB}', title: 'Plagiarism', desc: 'Source similarity detection' },
              { icon: 'AI', title: 'AI Detection', desc: 'AI-generated text patterns' },
              { icon: '\u270D\uFE0F', title: 'Inline Analysis', desc: 'Highlighted passages with context' },
              { icon: '\u{1F4CA}', title: 'Teacher Reports', desc: 'PDF & print-ready for parent meetings' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                <span className="text-2xl">{feature.icon}</span>
                <h4 className="font-medium text-gray-800 mt-2">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
