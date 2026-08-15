'use client';

import React, { useState } from 'react';
import { safeAPICall } from '@core/utils/api-error-handler';
import AnnotatedText from './AnnotatedText';
import AIDetectionPanel from './AIDetectionPanel';
import PlagiarismPanel from './PlagiarismPanel';
import ReportExport from './ReportExport';
import type { ComparisonResult, AssignmentContext as AssignmentContextType, EnhancedAnalysisResult } from './types';

interface ComparisonViewProps {
  originalText: string;
  originalResult?: EnhancedAnalysisResult;
  context: AssignmentContextType;
  enabled?: boolean;
}

export default function ComparisonView({ originalText, originalResult, context, enabled = true }: ComparisonViewProps) {
  const [revisedText, setRevisedText] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) return null;

  const handleCompare = async () => {
    if (!revisedText.trim()) {
      setError('Please paste the revised submission.');
      return;
    }
    if (revisedText.trim().split(/\s+/).length < 50) {
      setError('Revised text must be at least 50 words.');
      return;
    }

    setIsComparing(true);
    setError(null);
    setComparison(null);

    const { data, error: apiError } = await safeAPICall<{ result: ComparisonResult }>(
      '/api/showcase/plagiarism-detection/compare',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalText, revisedText, context }),
      }
    );

    if (apiError) {
      setError(apiError.message);
    } else if (data?.result) {
      setComparison(data.result);
    }

    setIsComparing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (ext === '.txt') {
      setRevisedText(await file.text());
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
      setRevisedText(data.text);
    } else if (data.error) {
      setError(data.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-1">Resubmission Comparison</h4>
        <p className="text-sm text-blue-700">
          Upload or paste the revised version to compare against the original submission.
          The tool will analyze what changed and whether concerns were addressed.
        </p>
      </div>

      {/* Revised text input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Revised Submission</label>
          <label className="text-xs text-orange-600 hover:text-orange-700 cursor-pointer">
            <input type="file" accept=".docx,.pdf,.txt" className="hidden" onChange={handleFileUpload} />
            Upload file
          </label>
        </div>
        <textarea
          value={revisedText}
          onChange={(e) => setRevisedText(e.target.value)}
          placeholder="Paste the revised submission here..."
          className="w-full min-h-[160px] p-4 border border-gray-200 rounded-xl resize-y focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">
            {revisedText.split(/\s+/).filter(w => w).length} words
          </span>
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={isComparing || revisedText.split(/\s+/).filter(w => w).length < 50}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isComparing ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Comparing versions...
          </>
        ) : 'Compare Submissions'}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          {/* Change Summary */}
          <div className={`p-4 rounded-xl border ${
            comparison.changes.rewriteAppearsAIGenerated
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
          }`}>
            <h4 className="font-semibold text-gray-900 mb-2">Change Summary</h4>
            <p className="text-sm text-gray-700 mb-3">{comparison.changes.summary}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-white/60 rounded-lg p-2">
                <div className="text-lg font-bold text-gray-800">{comparison.changes.flaggedSectionsRemoved}</div>
                <div className="text-xs text-gray-500">Flagged Sections Removed</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2">
                <div className="text-lg font-bold text-gray-800">{comparison.changes.flaggedSectionsRewritten}</div>
                <div className="text-xs text-gray-500">Sections Rewritten</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2">
                <div className="text-lg font-bold text-green-600">{comparison.changes.addedText.length}</div>
                <div className="text-xs text-gray-500">New Passages</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2">
                <div className={`text-lg font-bold ${comparison.changes.rewriteAppearsAIGenerated ? 'text-red-600' : 'text-green-600'}`}>
                  {comparison.changes.rewriteAppearsAIGenerated ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-gray-500">Rewrite Appears AI-Generated</div>
              </div>
            </div>
          </div>

          {/* Side by side */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Original */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                Original Submission
                <span className={`ml-auto text-sm font-normal px-2 py-0.5 rounded-full ${
                  comparison.originalAnalysis.overallScore >= 60 ? 'bg-green-100 text-green-700'
                  : comparison.originalAnalysis.overallScore >= 30 ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
                }`}>
                  {comparison.originalAnalysis.overallScore}%
                </span>
              </h4>
              <div className="bg-white rounded-xl border border-gray-200 p-4 max-h-[300px] overflow-y-auto">
                <AnnotatedText
                  text={originalText}
                  annotations={comparison.originalAnalysis.annotations || []}
                />
              </div>
              <div className="mt-3 space-y-3">
                <AIDetectionPanel result={comparison.originalAnalysis as EnhancedAnalysisResult} />
                <PlagiarismPanel result={comparison.originalAnalysis as EnhancedAnalysisResult} />
              </div>
            </div>

            {/* Revised */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Revised Submission
                <span className={`ml-auto text-sm font-normal px-2 py-0.5 rounded-full ${
                  comparison.revisedAnalysis.overallScore >= 60 ? 'bg-green-100 text-green-700'
                  : comparison.revisedAnalysis.overallScore >= 30 ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
                }`}>
                  {comparison.revisedAnalysis.overallScore}%
                </span>
              </h4>
              <div className="bg-white rounded-xl border border-gray-200 p-4 max-h-[300px] overflow-y-auto">
                <AnnotatedText
                  text={revisedText}
                  annotations={comparison.revisedAnalysis.annotations || []}
                />
              </div>
              <div className="mt-3 space-y-3">
                <AIDetectionPanel result={comparison.revisedAnalysis as EnhancedAnalysisResult} />
                <PlagiarismPanel result={comparison.revisedAnalysis as EnhancedAnalysisResult} />
              </div>
            </div>
          </div>

          {/* Changed passages */}
          {comparison.changes.removedText.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Removed Passages</h4>
              <div className="space-y-2">
                {comparison.changes.removedText.map((text, i) => (
                  <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 line-through italic">
                    &quot;{text}&quot;
                  </div>
                ))}
              </div>
            </div>
          )}

          {comparison.changes.addedText.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Added Passages</h4>
              <div className="space-y-2">
                {comparison.changes.addedText.map((text, i) => (
                  <div key={i} className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                    &quot;{text}&quot;
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export comparison report */}
          <ReportExport
            result={comparison.originalAnalysis as EnhancedAnalysisResult}
            submittedText={originalText}
            comparisonData={{
              originalText,
              revisedText,
              changes: comparison.changes,
              revisedResult: comparison.revisedAnalysis as EnhancedAnalysisResult,
            }}
          />
        </div>
      )}
    </div>
  );
}
