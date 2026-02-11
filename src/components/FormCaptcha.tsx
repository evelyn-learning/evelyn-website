"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormCaptchaProps {
  onVerified: (verified: boolean) => void;
  storageKey?: string;
}

interface CaptchaChallenge {
  num1: number;
  num2: number;
  answer: number;
}

const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

function generateChallenge(): CaptchaChallenge {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    num1,
    num2,
    answer: num1 + num2,
  };
}

export function FormCaptcha({ onVerified, storageKey = "form_captcha" }: FormCaptchaProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Initialize challenge
  useEffect(() => {
    setChallenge(generateChallenge());

    // Check for existing lockout
    const storedLockout = localStorage.getItem(`${storageKey}_lockout`);
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout, 10);
      if (lockoutTime > Date.now()) {
        setLockedUntil(lockoutTime);
      } else {
        localStorage.removeItem(`${storageKey}_lockout`);
      }
    }

    // Check if already verified this session
    const verified = sessionStorage.getItem(`${storageKey}_verified`) === "true";
    if (verified) {
      setIsVerified(true);
      onVerified(true);
    }
  }, [storageKey, onVerified]);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, lockedUntil - Date.now());
      setTimeRemaining(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setChallenge(generateChallenge());
        localStorage.removeItem(`${storageKey}_lockout`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil, storageKey]);

  const handleVerify = useCallback(() => {
    if (!challenge) return;

    const answer = parseInt(userAnswer.trim(), 10);

    if (answer === challenge.answer) {
      setIsVerified(true);
      setError("");
      sessionStorage.setItem(`${storageKey}_verified`, "true");
      onVerified(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setUserAnswer("");
      setError("Incorrect answer. Please try again.");

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION;
        setLockedUntil(lockoutTime);
        localStorage.setItem(`${storageKey}_lockout`, lockoutTime.toString());
        setError("");
        onVerified(false);
      } else {
        setChallenge(generateChallenge());
      }
    }
  }, [challenge, userAnswer, attempts, onVerified, storageKey]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVerify();
    }
  };

  const refreshChallenge = () => {
    setChallenge(generateChallenge());
    setUserAnswer("");
    setError("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!challenge) return null;

  if (lockedUntil) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">Too many incorrect attempts</p>
            <p className="text-sm text-red-600">
              Please wait {formatTime(timeRemaining)} before trying again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="rounded-lg bg-green-50 p-4">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-green-800">Verification complete</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Security Check <span className="text-red-500">*</span>
      </label>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            What is <span className="font-semibold">{challenge.num1} + {challenge.num2}</span>?
          </p>
          <button
            type="button"
            onClick={refreshChallenge}
            className="text-gray-400 hover:text-gray-600"
            title="Get a new question"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your answer"
            className={cn(
              "flex-1 rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
              error ? "border-red-300" : "border-gray-200"
            )}
          />
          <button
            type="button"
            onClick={handleVerify}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Verify
          </button>
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {attempts > 0 && !error && (
          <p className="mt-2 text-xs text-gray-400">
            Attempt {attempts} of {MAX_ATTEMPTS}
          </p>
        )}
      </div>
    </div>
  );
}
