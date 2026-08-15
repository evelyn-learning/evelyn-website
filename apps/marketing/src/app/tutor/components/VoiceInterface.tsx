'use client';

/**
 * Voice Interface Component
 *
 * Provides the UI for voice interaction with the AI tutor.
 * Includes microphone controls, voice selection, and visual feedback.
 */

import { useState, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, MessageSquare, Loader2 } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import type { VoiceId } from '@/lib/tutor/types';
import { AVAILABLE_VOICES } from '@/lib/tutor/types';

interface VoiceInterfaceProps {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  useTextMode: boolean;
  voiceId: VoiceId;
  currentTranscript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onAudioData: (data: Float32Array) => void;
  onTextMessage: (text: string) => void;
  onVoiceChange: (voiceId: VoiceId) => void;
  onToggleTextMode: () => void;
  onInterrupt: () => void;
}

export function VoiceInterface({
  isConnected,
  isListening,
  isSpeaking,
  isProcessing,
  useTextMode,
  voiceId,
  currentTranscript,
  onStartListening,
  onStopListening,
  onAudioData,
  onTextMessage,
  onVoiceChange,
  onToggleTextMode,
  onInterrupt,
}: VoiceInterfaceProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [textInput, setTextInput] = useState('');

  const {
    isRecording,
    hasPermission,
    requestPermission,
    startRecording,
    stopRecording,
    error: voiceError,
  } = useVoice({
    onAudioData,
    sampleRate: 16000,
  });

  // Handle microphone button click
  const handleMicClick = useCallback(async () => {
    if (!isConnected) return;

    if (isSpeaking) {
      // Interrupt tutor
      onInterrupt();
      return;
    }

    if (isRecording) {
      stopRecording();
      onStopListening();
    } else {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) return;
      }
      await startRecording();
      onStartListening();
    }
  }, [
    isConnected,
    isRecording,
    isSpeaking,
    hasPermission,
    requestPermission,
    startRecording,
    stopRecording,
    onStartListening,
    onStopListening,
    onInterrupt,
  ]);

  // Handle text submit
  const handleTextSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (textInput.trim() && isConnected) {
        onTextMessage(textInput.trim());
        setTextInput('');
      }
    },
    [textInput, isConnected, onTextMessage]
  );

  // Handle keyboard shortcut for push-to-talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar for push-to-talk (when not in text input)
      if (e.code === 'Space' && !useTextMode && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        if (!isRecording && isConnected && !isSpeaking) {
          handleMicClick();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isRecording) {
        e.preventDefault();
        stopRecording();
        onStopListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording, isConnected, isSpeaking, useTextMode, handleMicClick, stopRecording, onStopListening]);

  // Get current voice name
  const currentVoice = AVAILABLE_VOICES.find((v) => v.id === voiceId);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Text mode toggle */}
          <button
            onClick={onToggleTextMode}
            className={`p-2 rounded-lg transition-colors ${
              useTextMode
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={useTextMode ? 'Switch to voice' : 'Switch to text'}
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Voice settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tutor Voice</h4>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_VOICES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => onVoiceChange(voice.id)}
                className={`p-2 text-left rounded-lg border transition-colors ${
                  voiceId === voice.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{voice.name}</div>
                <div className="text-xs text-gray-500">{voice.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice error */}
      {voiceError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {voiceError}
        </div>
      )}

      {/* Main control area */}
      {useTextMode ? (
        /* Text input mode */
        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected || isProcessing}
          />
          <button
            type="submit"
            disabled={!isConnected || isProcessing || !textInput.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      ) : (
        /* Voice mode */
        <div className="flex flex-col items-center gap-4">
          {/* Transcript display */}
          {(currentTranscript || isRecording) && (
            <div className="w-full p-3 bg-gray-50 rounded-lg min-h-[60px]">
              <p className="text-gray-700">
                {currentTranscript || (
                  <span className="text-gray-400 italic">Listening...</span>
                )}
              </p>
            </div>
          )}

          {/* Microphone button */}
          <button
            onClick={handleMicClick}
            disabled={!isConnected}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : isSpeaking
                ? 'bg-blue-500 hover:bg-blue-600'
                : isProcessing
                ? 'bg-yellow-500'
                : 'bg-gray-200 hover:bg-gray-300'
            } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={
              isRecording
                ? 'Click to stop (or release Space)'
                : isSpeaking
                ? 'Click to interrupt'
                : 'Click to speak (or hold Space)'
            }
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : isSpeaking ? (
              <Volume2 className="w-8 h-8 text-white" />
            ) : isRecording ? (
              <Mic className="w-8 h-8 text-white" />
            ) : (
              <MicOff className="w-8 h-8 text-gray-500" />
            )}
          </button>

          {/* Instructions */}
          <p className="text-sm text-gray-500 text-center">
            {isRecording
              ? 'Release to send'
              : isSpeaking
              ? 'Tap to interrupt'
              : isProcessing
              ? 'Thinking...'
              : 'Hold Space or tap to speak'}
          </p>
        </div>
      )}

      {/* Current voice info */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <span>Voice: {currentVoice?.name || 'Default'}</span>
        <span>{useTextMode ? 'Text mode' : 'Voice mode'}</span>
      </div>
    </div>
  );
}
