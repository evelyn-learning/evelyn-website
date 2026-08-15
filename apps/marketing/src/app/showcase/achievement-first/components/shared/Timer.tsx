'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TimerProps {
  seconds: number;
  size?: number;
  onComplete?: () => void;
  autoStart?: boolean;
  label?: string;
}

export default function Timer({ seconds, size = 120, onComplete, autoStart = false, label }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          stop();
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, stop]);

  const start = () => {
    if (remaining <= 0) setRemaining(seconds);
    setRunning(true);
  };

  const reset = () => {
    stop();
    setRemaining(seconds);
  };

  const progress = remaining / seconds;
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = minutes > 0 ? `${minutes}:${secs.toString().padStart(2, '0')}` : `${secs}s`;

  const isWarning = remaining <= 10 && remaining > 0;
  const isDone = remaining === 0;

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{label}</p>
      )}
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="-rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isDone ? '#22c55e' : isWarning ? '#ef4444' : '#F5A623'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${isDone ? 'text-green-600' : isWarning ? 'text-red-500' : 'text-gray-800'}`}>
            {isDone ? 'Done' : timeStr}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {!running && !isDone && (
          <button
            onClick={start}
            className="px-4 py-2 rounded-lg bg-[#F5A623] text-[#003B71] font-semibold text-sm hover:bg-[#e6991a] transition-colors"
          >
            {remaining < seconds ? 'Resume' : 'Start'}
          </button>
        )}
        {running && (
          <button
            onClick={stop}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-300 transition-colors"
          >
            Pause
          </button>
        )}
        {(remaining < seconds || isDone) && (
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
