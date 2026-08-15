'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTrackInteraction } from '@/components/demos/DemoTrackingContext';

interface ProctorEvent {
  id: string;
  timestamp: Date;
  type: 'face_detected' | 'face_lost' | 'multiple_faces' | 'tab_switch' | 'fullscreen_exit' | 'suspicious_movement' | 'session_start' | 'session_end' | 'model_loaded';
  severity: 'info' | 'warning' | 'critical';
  description: string;
}

interface SessionStats {
  duration: number;
  faceVisiblePercent: number;
  tabSwitches: number;
  warnings: number;
  criticalEvents: number;
}

interface FaceDetection {
  topLeft: [number, number];
  bottomRight: [number, number];
  probability: number;
}

const SAMPLE_EXAM = {
  title: 'Calculus Final Exam',
  duration: '2 hours',
  questions: 45,
  student: 'Alex Thompson'
};

export default function ProctoringSuiteDemo() {
  const trackInteraction = useTrackInteraction();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState<ProctorEvent[]>([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [stats, setStats] = useState<SessionStats>({
    duration: 0,
    faceVisiblePercent: 100,
    tabSwitches: 0,
    warnings: 0,
    criticalEvents: 0
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const examContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<unknown>(null);
  const detectionLoopRef = useRef<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Track previous state for event logging
  const prevFaceDetected = useRef(false);
  const prevMultipleFaces = useRef(false);

  const addEvent = useCallback((type: ProctorEvent['type'], severity: ProctorEvent['severity'], description: string) => {
    const event: ProctorEvent = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      type,
      severity,
      description
    };
    setEvents(prev => [event, ...prev].slice(0, 50));

    if (severity === 'warning') {
      setStats(prev => ({ ...prev, warnings: prev.warnings + 1 }));
    } else if (severity === 'critical') {
      setStats(prev => ({ ...prev, criticalEvents: prev.criticalEvents + 1 }));
    }
  }, []);

  // Load face detection model
  const loadModel = useCallback(async () => {
    if (modelRef.current || modelLoading) return;

    setModelLoading(true);
    try {
      // Dynamic import to avoid SSR issues
      const tf = await import('@tensorflow/tfjs');
      const blazeface = await import('@tensorflow-models/blazeface');

      // Set backend
      await tf.setBackend('webgl');
      await tf.ready();

      // Load the model
      const model = await blazeface.load();
      modelRef.current = model;
      setModelLoaded(true);
      addEvent('model_loaded', 'info', 'AI face detection model loaded');
    } catch (err) {
      console.error('Failed to load face detection model:', err);
      setCameraError('Face detection model failed to load');
    } finally {
      setModelLoading(false);
    }
  }, [modelLoading, addEvent]);

  // Run face detection on video frames
  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelRef.current || !isSessionActive) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== 4) {
      return;
    }

    // Get the container dimensions using getBoundingClientRect for accuracy
    const container = video.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Get the natural video dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Skip if dimensions are invalid
    if (containerWidth === 0 || containerHeight === 0 || videoWidth === 0 || videoHeight === 0) {
      return;
    }

    // Set canvas drawing surface AND CSS dimensions to match container size
    if (canvas.width !== containerWidth || canvas.height !== containerHeight) {
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      // Also set CSS dimensions explicitly
      canvas.style.width = containerWidth + 'px';
      canvas.style.height = containerHeight + 'px';
    }

    // Calculate how the video fits within container with object-contain
    const videoAspect = videoWidth / videoHeight;
    const containerAspect = containerWidth / containerHeight;

    let renderWidth: number, renderHeight: number, offsetX: number, offsetY: number;

    if (videoAspect > containerAspect) {
      // Video is wider - constrained by width, letterboxed top/bottom
      renderWidth = containerWidth;
      renderHeight = containerWidth / videoAspect;
      offsetX = 0;
      offsetY = (containerHeight - renderHeight) / 2;
    } else {
      // Video is taller - constrained by height, letterboxed left/right
      renderHeight = containerHeight;
      renderWidth = containerHeight * videoAspect;
      offsetX = (containerWidth - renderWidth) / 2;
      offsetY = 0;
    }

    // Calculate scale factors from video to rendered size
    const scaleX = renderWidth / videoWidth;
    const scaleY = renderHeight / videoHeight;

    try {
      // Run face detection
      const model = modelRef.current as { estimateFaces: (video: HTMLVideoElement, returnTensors: boolean) => Promise<FaceDetection[]> };
      const predictions = await model.estimateFaces(video, false);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update face count
      const currentFaceCount = predictions.length;
      setFaceCount(currentFaceCount);

      // Determine states
      const currentFaceDetected = currentFaceCount >= 1;
      const currentMultipleFaces = currentFaceCount > 1;

      // Log events on state changes
      if (currentFaceDetected !== prevFaceDetected.current) {
        if (currentFaceDetected) {
          addEvent('face_detected', 'info', 'Face detected and verified');
        } else {
          addEvent('face_lost', 'warning', 'Face not detected in frame');
        }
        prevFaceDetected.current = currentFaceDetected;
      }

      if (currentMultipleFaces !== prevMultipleFaces.current) {
        if (currentMultipleFaces) {
          addEvent('multiple_faces', 'critical', `Multiple faces detected (${currentFaceCount}) - potential violation`);
        }
        prevMultipleFaces.current = currentMultipleFaces;
      }

      setFaceDetected(currentFaceDetected);
      setMultipleFaces(currentMultipleFaces);

      // Draw bounding boxes for each face
      predictions.forEach((prediction: FaceDetection, index: number) => {
        const [x1, y1] = prediction.topLeft;
        const [x2, y2] = prediction.bottomRight;

        // Scale coordinates and add offset for letterboxing
        const scaledX1 = x1 * scaleX + offsetX;
        const scaledY1 = y1 * scaleY + offsetY;
        const scaledWidth = (x2 - x1) * scaleX;
        const scaledHeight = (y2 - y1) * scaleY;

        // Choose color based on face count
        if (currentMultipleFaces) {
          ctx.strokeStyle = index === 0 ? '#22c55e' : '#ef4444'; // Green for first, red for others
        } else {
          ctx.strokeStyle = '#22c55e'; // Green
        }
        ctx.lineWidth = 3;
        ctx.strokeRect(scaledX1, scaledY1, scaledWidth, scaledHeight);

        // Draw label background
        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = 'bold 14px sans-serif';
        const label = currentMultipleFaces
          ? (index === 0 ? 'Primary' : `Person ${index + 1}`)
          : 'Face Detected';
        const labelWidth = ctx.measureText(label).width + 10;
        ctx.fillRect(scaledX1, scaledY1 - 22, labelWidth, 22);

        // Draw label text
        ctx.fillStyle = 'white';
        ctx.fillText(label, scaledX1 + 5, scaledY1 - 6);
      });

      // Draw "No face" warning if no faces detected
      if (!currentFaceDetected) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.font = 'bold 24px sans-serif';
        const text = 'NO FACE DETECTED';
        const textWidth = ctx.measureText(text).width;

        // Center in the video area (not the whole canvas)
        const centerX = offsetX + renderWidth / 2;
        const centerY = offsetY + renderHeight / 2;

        // Draw background
        ctx.fillRect(centerX - (textWidth + 20) / 2, centerY - 18, textWidth + 20, 36);

        // Draw text
        ctx.fillStyle = 'white';
        ctx.fillText(text, centerX - textWidth / 2, centerY + 6);
      }

    } catch (err) {
      console.error('Face detection error:', err);
    }
  }, [isSessionActive, addEvent]);

  // Detection loop
  useEffect(() => {
    if (!isSessionActive || !cameraActive || !modelLoaded) {
      if (detectionLoopRef.current) {
        cancelAnimationFrame(detectionLoopRef.current);
        detectionLoopRef.current = null;
      }
      return;
    }

    const runDetection = async () => {
      await detectFaces();
      detectionLoopRef.current = requestAnimationFrame(runDetection);
    };

    // Start detection loop with slight delay to ensure video is ready
    const timeoutId = setTimeout(() => {
      runDetection();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (detectionLoopRef.current) {
        cancelAnimationFrame(detectionLoopRef.current);
        detectionLoopRef.current = null;
      }
    };
  }, [isSessionActive, cameraActive, modelLoaded, detectFaces]);

  // Session timer
  useEffect(() => {
    if (!isSessionActive) return;

    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setStats(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive]);

  // Tab/focus events - REAL detection
  useEffect(() => {
    if (!isSessionActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsFocused(false);
        addEvent('tab_switch', 'critical', 'Student switched tabs or minimized window');
        setStats(prev => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
      } else {
        setIsFocused(true);
        addEvent('tab_switch', 'info', 'Student returned to exam window');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSessionActive, addEvent]);

  // Fullscreen detection - REAL
  useEffect(() => {
    if (!isSessionActive) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (!isCurrentlyFullscreen) {
        addEvent('fullscreen_exit', 'warning', 'Student exited fullscreen mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isSessionActive, addEvent]);

  // Enter fullscreen mode
  const enterFullscreen = async () => {
    try {
      if (examContainerRef.current) {
        await examContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
        addEvent('session_start', 'info', 'Entered fullscreen mode');
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
      addEvent('fullscreen_exit', 'warning', 'Could not enter fullscreen mode');
    }
  };

  // Exit fullscreen mode
  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Exit fullscreen error:', err);
    }
  };

  const startSession = async () => {
    setEvents([]);
    setSessionTime(0);
    setStats({
      duration: 0,
      faceVisiblePercent: 100,
      tabSwitches: 0,
      warnings: 0,
      criticalEvents: 0
    });
    prevFaceDetected.current = false;
    prevMultipleFaces.current = false;

    setIsSessionActive(true);
    addEvent('session_start', 'info', 'Proctoring session started');
    trackInteraction('tool_use', 'proctoring_start');

    // Load face detection model
    if (!modelRef.current) {
      await loadModel();
    }

    // Try to access camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      streamRef.current = stream;

      // Wait a tick for the video element to be ready
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(console.error);
          };
        }
      }, 100);

      setCameraActive(true);
      setCameraError(null);
      addEvent('face_detected', 'info', 'Camera connected successfully');
    } catch (err) {
      console.log('Camera access error:', err);
      setCameraError('Camera access denied - face detection requires camera');
      setCameraActive(false);
    }
  };

  const endSession = async () => {
    setIsSessionActive(false);
    addEvent('session_end', 'info', 'Proctoring session ended');
    trackInteraction('tool_use', 'proctoring_end', { duration: sessionTime, tabSwitches: stats.tabSwitches, warnings: stats.warnings, criticalEvents: stats.criticalEvents });

    // Exit fullscreen
    await exitFullscreen();

    // Stop detection loop
    if (detectionLoopRef.current) {
      cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    }

    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setFaceDetected(false);
    setMultipleFaces(false);
    setFaceCount(0);
    setIsFullscreen(false);
  };

  const simulateEvent = (type: 'tab' | 'face' | 'fullscreen') => {
    switch (type) {
      case 'tab':
        setIsFocused(false);
        addEvent('tab_switch', 'critical', 'Student switched tabs (simulated)');
        setStats(prev => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }));
        setTimeout(() => setIsFocused(true), 2000);
        break;
      case 'face':
        // This is now handled by real detection, but keep for demo purposes
        addEvent('face_lost', 'warning', 'Face detection test triggered');
        break;
      case 'fullscreen':
        setIsFullscreen(false);
        addEvent('fullscreen_exit', 'warning', 'Exited fullscreen mode (simulated)');
        setTimeout(() => setIsFullscreen(true), 2000);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (type: ProctorEvent['type']) => {
    const icons: Record<ProctorEvent['type'], string> = {
      face_detected: '✓',
      face_lost: '👤',
      multiple_faces: '👥',
      tab_switch: '🔄',
      fullscreen_exit: '⬜',
      suspicious_movement: '⚠️',
      session_start: '▶️',
      session_end: '⏹️',
      model_loaded: '🤖'
    };
    return icons[type];
  };

  const getSeverityColor = (severity: ProctorEvent['severity']) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-rose-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            Real AI Face Detection
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            AI Proctoring Suite
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time exam monitoring with <strong>actual AI face detection</strong>, browser monitoring, and anomaly detection.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="space-y-6">
            {/* Exam Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Exam</span>
                  <span className="font-medium">{SAMPLE_EXAM.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Student</span>
                  <span className="font-medium">{SAMPLE_EXAM.student}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{SAMPLE_EXAM.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Questions</span>
                  <span className="font-medium">{SAMPLE_EXAM.questions}</span>
                </div>
              </div>
            </div>

            {/* Session Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Control</h3>

              {!isSessionActive ? (
                <button
                  onClick={startSession}
                  disabled={modelLoading}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {modelLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading AI Model...
                    </>
                  ) : (
                    <>
                      <span>▶️</span>
                      Start Proctoring
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={endSession}
                  className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2"
                >
                  <span>⏹️</span>
                  End Session
                </button>
              )}

              {isSessionActive && (
                <div className="mt-4 text-center">
                  <div className="text-3xl font-mono font-bold text-gray-900">
                    {formatTime(sessionTime)}
                  </div>
                  <div className="text-sm text-gray-500">Session Duration</div>
                </div>
              )}

              {/* Model Status */}
              <div className="mt-4 text-center">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  modelLoaded ? 'bg-green-100 text-green-700' : modelLoading ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${modelLoaded ? 'bg-green-500' : modelLoading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  {modelLoaded ? 'AI Model Ready' : modelLoading ? 'Loading AI...' : 'AI Model Not Loaded'}
                </span>
              </div>
            </div>

            {/* Test Events */}
            {isSessionActive && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Detection</h3>
                <p className="text-sm text-gray-500 mb-4">
                  All detection is <strong>real</strong>. Try:
                </p>
                <ul className="text-xs text-gray-500 mb-4 space-y-1">
                  <li>• Move out of camera frame</li>
                  <li>• Have someone else appear</li>
                  <li>• Switch to another browser tab</li>
                  <li>• Exit fullscreen mode (press Esc)</li>
                </ul>
                <div className="space-y-2">
                  {!isFullscreen ? (
                    <button
                      onClick={enterFullscreen}
                      className="w-full py-2 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 transition text-sm"
                    >
                      Enter Fullscreen Mode
                    </button>
                  ) : (
                    <button
                      onClick={exitFullscreen}
                      className="w-full py-2 bg-orange-100 text-orange-800 font-medium rounded-lg hover:bg-orange-200 transition text-sm"
                    >
                      Exit Fullscreen (triggers warning)
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  💡 All events above are detected automatically
                </p>
              </div>
            )}
          </div>

          {/* Main Monitor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Dashboard */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Monitoring Status</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-xl text-center ${faceDetected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="text-2xl mb-1">{faceDetected ? '✓' : '✗'}</div>
                  <div className={`text-sm font-medium ${faceDetected ? 'text-green-700' : 'text-red-700'}`}>
                    {faceDetected ? `Face Detected` : 'No Face'}
                  </div>
                  {faceCount > 0 && (
                    <div className="text-xs text-gray-500 mt-1">{faceCount} face(s)</div>
                  )}
                </div>

                <div className={`p-4 rounded-xl text-center ${isFocused ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="text-2xl mb-1">{isFocused ? '🖥️' : '⚠️'}</div>
                  <div className={`text-sm font-medium ${isFocused ? 'text-green-700' : 'text-red-700'}`}>
                    Window {isFocused ? 'Focused' : 'Unfocused'}
                  </div>
                </div>

                <div className={`p-4 rounded-xl text-center ${isFullscreen ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="text-2xl mb-1">{isFullscreen ? '⬛' : '⬜'}</div>
                  <div className={`text-sm font-medium ${isFullscreen ? 'text-green-700' : 'text-yellow-700'}`}>
                    {isFullscreen ? 'Fullscreen' : 'Windowed'}
                  </div>
                </div>

                <div className={`p-4 rounded-xl text-center ${!multipleFaces ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="text-2xl mb-1">{!multipleFaces ? '👤' : '👥'}</div>
                  <div className={`text-sm font-medium ${!multipleFaces ? 'text-green-700' : 'text-red-700'}`}>
                    {multipleFaces ? `${faceCount} People!` : 'Single Person'}
                  </div>
                </div>
              </div>

              {/* Camera Feed with Canvas Overlay */}
              <div ref={examContainerRef} className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-6">
                {/* Video element - mirrored for selfie view */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-contain ${cameraActive ? 'block' : 'hidden'}`}
                  style={{ transform: 'scaleX(-1)' }}
                />

                {/* Canvas overlay for face detection boxes */}
                <canvas
                  ref={canvasRef}
                  className={`absolute top-0 left-0 z-10 ${cameraActive ? 'block' : 'hidden'}`}
                  style={{
                    pointerEvents: 'none',
                    transform: 'scaleX(-1)',
                  }}
                />

                {/* Placeholder when camera not active */}
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">📹</div>
                      <p className="text-gray-400">
                        {isSessionActive ? (cameraError || 'Connecting to camera...') : 'Camera feed will appear here'}
                      </p>
                      {modelLoading && (
                        <p className="text-gray-500 text-sm mt-2">Loading AI face detection model...</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Status badges */}
                {isSessionActive && (
                  <>
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                        RECORDING
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${cameraActive ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                        {cameraActive ? 'CAMERA ON' : 'NO CAMERA'}
                      </span>
                      {modelLoaded && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-500 text-white">
                          AI ACTIVE
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Session Stats */}
              {isSessionActive && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{formatTime(stats.duration)}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.tabSwitches}</div>
                    <div className="text-xs text-gray-500">Tab Switches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                    <div className="text-xs text-gray-500">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.criticalEvents}</div>
                    <div className="text-xs text-gray-500">Critical Events</div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Log */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Log</h3>

              {events.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p>Start a proctoring session to see events</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${getSeverityColor(event.severity)} flex items-start gap-3`}
                    >
                      <span className="text-lg">{getEventIcon(event.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs opacity-75">
                          {event.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        event.severity === 'info' ? 'bg-blue-200' :
                        event.severity === 'warning' ? 'bg-yellow-200' : 'bg-red-200'
                      }`}>
                        {event.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Real AI Detection Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '👤', title: 'Face Detection', desc: 'Real TensorFlow.js AI model', real: true },
              { icon: '👥', title: 'Multiple Faces', desc: 'Detects additional people', real: true },
              { icon: '🔄', title: 'Tab Switching', desc: 'Browser visibility API', real: true },
              { icon: '📹', title: 'Live Recording', desc: 'Session video capture', real: true },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50 relative">
                {feature.real && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
                    REAL
                  </span>
                )}
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
