'use client';

import React, { useRef, useState, useCallback } from 'react';
import { UPLOAD_CONSTRAINTS } from './constants';
import { generateId, validateFile } from './utils';
import { saveAnalysisToHistory } from '@/lib/plagiarism/save-history';
import type { BatchSubmission, AssignmentContext, EnhancedAnalysisResult } from './types';

interface BatchUploaderProps {
  context: AssignmentContext;
  onComplete: (submissions: BatchSubmission[]) => void;
  enabled?: boolean;
}

export default function BatchUploader({ context, onComplete, enabled = true }: BatchUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submissions, setSubmissions] = useState<BatchSubmission[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errors, setErrors] = useState<string[]>([]);

  if (!enabled) return null;

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newErrors: string[] = [];

    if (fileArray.length > UPLOAD_CONSTRAINTS.maxBatchSize) {
      newErrors.push(`Maximum ${UPLOAD_CONSTRAINTS.maxBatchSize} files per batch. You selected ${fileArray.length}.`);
      setErrors(newErrors);
      return;
    }

    const newSubmissions: BatchSubmission[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file, UPLOAD_CONSTRAINTS.maxFileSize, [...UPLOAD_CONSTRAINTS.acceptedTypes]);
      if (!validation.valid) {
        newErrors.push(`${file.name}: ${validation.error}`);
        continue;
      }
      newSubmissions.push({
        id: generateId(),
        fileName: file.name,
        text: '',
        status: 'pending',
      });
    }

    setErrors(newErrors);
    setSubmissions(newSubmissions);

    // Parse files
    const validFiles = fileArray.filter(f =>
      validateFile(f, UPLOAD_CONSTRAINTS.maxFileSize, [...UPLOAD_CONSTRAINTS.acceptedTypes]).valid
    );

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const sub = newSubmissions[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/showcase/plagiarism-detection/parse-file', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.error) {
          sub.status = 'error';
          sub.error = data.error;
        } else {
          sub.text = data.text;
        }
      } catch {
        sub.status = 'error';
        sub.error = 'Failed to parse file.';
      }
    }

    setSubmissions([...newSubmissions]);
  };

  const processAll = useCallback(async () => {
    const pending = submissions.filter(s => s.status !== 'error' && s.text);
    if (pending.length === 0) return;

    setIsProcessing(true);
    setProgress({ current: 0, total: pending.length });

    const updated = [...submissions];

    for (let i = 0; i < pending.length; i++) {
      const sub = pending[i];
      const idx = updated.findIndex(s => s.id === sub.id);
      updated[idx] = { ...updated[idx], status: 'analyzing' };
      setSubmissions([...updated]);
      setProgress({ current: i + 1, total: pending.length });

      try {
        const res = await fetch('/api/showcase/plagiarism-detection/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sub.text, context }),
        });
        const data = await res.json();

        if (data.error) {
          updated[idx] = { ...updated[idx], status: 'error', error: data.error };
        } else {
          const result = data.result as EnhancedAnalysisResult;
          updated[idx] = { ...updated[idx], status: 'complete', result };
          // Best-effort save (no-op if teacher not connected).
          void saveAnalysisToHistory({
            documentName: updated[idx].fileName,
            source: 'upload',
            result,
            context,
          });
        }
      } catch {
        updated[idx] = { ...updated[idx], status: 'error', error: 'Analysis failed.' };
      }

      setSubmissions([...updated]);
    }

    setIsProcessing(false);
    onComplete(updated);
  }, [submissions, context, onComplete]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const readyCount = submissions.filter(s => s.status !== 'error' && s.text).length;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={UPLOAD_CONSTRAINTS.acceptedTypes.join(',')}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-gray-600 font-medium">Drop files here or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">
          .docx, .pdf, .txt &mdash; up to {UPLOAD_CONSTRAINTS.maxBatchSize} files, {UPLOAD_CONSTRAINTS.maxFileSize / 1024 / 1024}MB each
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-600">{err}</p>
          ))}
        </div>
      )}

      {/* File list */}
      {submissions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {submissions.length} file{submissions.length !== 1 ? 's' : ''} uploaded
              {readyCount > 0 && ` (${readyCount} ready)`}
            </p>
            <button
              onClick={() => { setSubmissions([]); setErrors([]); }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear All
            </button>
          </div>

          {submissions.map(sub => (
            <div key={sub.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              sub.status === 'error' ? 'bg-red-50' : sub.status === 'complete' ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <span className="text-gray-500 truncate flex-1">{sub.fileName}</span>
              {sub.status === 'pending' && sub.text && <span className="text-xs text-gray-400">Ready</span>}
              {sub.status === 'pending' && !sub.text && <span className="text-xs text-gray-400">Parsing...</span>}
              {sub.status === 'analyzing' && (
                <span className="text-xs text-orange-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  Analyzing
                </span>
              )}
              {sub.status === 'complete' && <span className="text-xs text-green-600">Done</span>}
              {sub.status === 'error' && <span className="text-xs text-red-600">{sub.error}</span>}
            </div>
          ))}

          {/* Process button */}
          {readyCount > 0 && (
            <button
              onClick={processAll}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing {progress.current} of {progress.total}...
                </>
              ) : (
                `Analyze ${readyCount} Document${readyCount !== 1 ? 's' : ''}`
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
