'use client';

/**
 * Session Controls Component
 *
 * Provides controls for managing the tutoring session:
 * - Timer
 * - End session
 * - Upload homework
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, LogOut, Camera, Upload, X } from 'lucide-react';

interface SessionControlsProps {
  sessionId: string | null;
  maxDuration: number; // minutes
  onEndSession: () => void;
  onUploadHomework: (imageData: string, mimeType: string) => void;
}

export function SessionControls({
  sessionId,
  maxDuration,
  onEndSession,
  onUploadHomework,
}: SessionControlsProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer
  useEffect(() => {
    if (!sessionId) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId]);

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

  // Handle file upload
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Read file
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadPreview(base64);
      };
      reader.readAsDataURL(file);
    },
    []
  );

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

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
            {formatTime(elapsedSeconds)} / {maxDuration}:00
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
          {/* Upload homework button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Upload homework photo"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Problem</span>
          </button>

          {/* End session button */}
          <button
            onClick={onEndSession}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            title="End session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>
      </div>

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Upload Homework</h3>
              <button
                onClick={handleCancelUpload}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
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
                <label className="block p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
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
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-4 bg-gray-50">
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
          </div>
        </div>
      )}
    </>
  );
}
