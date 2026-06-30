'use client';

/**
 * Session Controls Component
 *
 * Provides controls for managing the tutoring session:
 * - Timer
 * - End session
 * - Upload homework
 * - Export PDF
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, LogOut, Camera, Upload, X, Download, GripVertical } from 'lucide-react';

interface WhiteboardCommandData {
  action: string;
  [key: string]: unknown;
}

interface TranscriptEntry {
  id: string;
  timestamp: Date;
  role: 'student' | 'tutor' | 'system';
  text: string;
  whiteboardCommands?: WhiteboardCommandData[];
  pedagogicalIntent?: string;
}

interface SessionControlsProps {
  sessionId: string | null;
  /** Wallclock ms when the voice session actually started (student tapped the
   *  mic). The timer counts up from here. null/undefined → not started yet, so
   *  the timer stays at 0:00. */
  startedAtMs?: number | null;
  maxDuration: number; // minutes
  onEndSession: () => void;
  onUploadHomework: (imageData: string, mimeType: string) => void;
  transcript?: TranscriptEntry[];
  whiteboardCommands?: WhiteboardCommandData[];
  topicName?: string;
  sessionGoal?: string;
  studentName?: string;
  subject?: string;
  level?: string;
}

// ── Resizable Modal wrapper ──

function ResizableModal({
  children,
  onClose,
  defaultWidth = 448,
  defaultHeight,
  minWidth = 320,
  minHeight = 300,
}: {
  children: React.ReactNode;
  onClose: () => void;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight || 0 });
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const rect = modalRef.current?.getBoundingClientRect();
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      w: rect?.width || defaultWidth,
      h: rect?.height || defaultHeight || 400,
    };

    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const dx = ev.clientX - startPos.current.x;
      const dy = ev.clientY - startPos.current.y;
      setSize({
        width: Math.max(minWidth, startPos.current.w + dx),
        height: Math.max(minHeight, startPos.current.h + dy),
      });
    };

    const onUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [defaultWidth, defaultHeight, minWidth, minHeight]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col relative"
        style={{
          width: size.width,
          ...(size.height ? { height: size.height } : {}),
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      >
        {children}
        {/* Resize handle */}
        <div
          onMouseDown={onResizeStart}
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center text-gray-300 hover:text-gray-500 transition"
          title="Drag to resize"
        >
          <GripVertical className="w-3 h-3 rotate-[-45deg]" />
        </div>
      </div>
    </div>
  );
}

export function SessionControls({
  sessionId,
  startedAtMs,
  maxDuration,
  onEndSession,
  onUploadHomework,
  transcript = [],
  whiteboardCommands = [],
  topicName = 'AI Tutor',
  sessionGoal = 'practice',
  studentName,
  subject,
  level,
}: SessionControlsProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer — counts up from the moment the student actually starts the voice
  // session (mic tap), not from when this component mounted. Until then it
  // stays at 0:00. Deriving elapsed from a fixed start timestamp keeps the
  // clock accurate even if the tab is backgrounded (setInterval throttles).
  useEffect(() => {
    if (!startedAtMs) {
      setElapsedSeconds(0);
      return;
    }

    const tick = () =>
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [startedAtMs]);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate remaining time
  const remainingSeconds = maxDuration * 60 - elapsedSeconds;
  const isLowTime = remainingSeconds <= 300; // 5 minutes
  const isOvertime = remainingSeconds < 0;

  // Process an image file into a preview
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadPreview(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle file input change
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  // Handle drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  // Submit upload
  const handleUploadSubmit = useCallback(() => {
    if (!uploadPreview) return;

    // Extract base64 data and mime type
    const matches = uploadPreview.match(/^data:(.+);base64,(.+)$/);
    if (matches) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      onUploadHomework(base64Data, mimeType);
      setShowUploadModal(false);
      setUploadPreview(null);
    }
  }, [uploadPreview, onUploadHomework]);

  // Cancel upload
  const handleCancelUpload = useCallback(() => {
    setShowUploadModal(false);
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Export PDF
  const handleExportPDF = useCallback(async () => {
    if (transcript.length === 0) return;
    setIsExporting(true);
    try {
      const { exportTutorSessionPDF } = await import('@/lib/utils/export/pdf-tutor-session');
      await exportTutorSessionPDF(
        transcript,
        whiteboardCommands,
        topicName,
        sessionGoal,
        studentName,
        { subject, level }
      );
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  }, [transcript, whiteboardCommands, topicName, sessionGoal, studentName, subject, level]);

  return (
    <>
      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <Clock
            className={`w-5 h-5 ${
              isOvertime
                ? 'text-red-500'
                : isLowTime
                ? 'text-yellow-500'
                : 'text-gray-500'
            }`}
          />
          <span
            className={`font-mono font-medium ${
              isOvertime
                ? 'text-red-500'
                : isLowTime
                ? 'text-yellow-500'
                : 'text-gray-700'
            }`}
          >
            {formatTime(elapsedSeconds)}
            <span className="hidden sm:inline"> / {maxDuration}:00</span>
          </span>
          {isLowTime && !isOvertime && (
            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
              {Math.ceil(remainingSeconds / 60)} min left
            </span>
          )}
          {isOvertime && (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded">
              Overtime
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Export PDF button */}
          {transcript.length > 0 && (
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Export session as PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          )}

          {/* Upload homework button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Upload homework photo"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Problem</span>
          </button>

          {/* End session lives in the bottom control row (VoiceTutorRealtime)
              where it triggers the recap + wrap-up flow. Removed here to
              avoid two End buttons competing in the same view. */}
        </div>
      </div>

      {/* Upload modal (resizable) */}
      {showUploadModal && (
        <ResizableModal onClose={handleCancelUpload} defaultWidth={448} minHeight={280}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <h3 className="text-lg font-semibold">Upload Homework</h3>
            <button
              onClick={handleCancelUpload}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 overflow-auto">
            {uploadPreview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={uploadPreview}
                    alt="Homework preview"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setUploadPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  The tutor will extract problems from this image.
                </p>
              </div>
            ) : (
              <label
                className="block p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="w-10 h-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, or HEIC up to 10MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-4 bg-gray-50 flex-shrink-0">
            <button
              onClick={handleCancelUpload}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={!uploadPreview}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Extract Problems
            </button>
          </div>
        </ResizableModal>
      )}
    </>
  );
}
