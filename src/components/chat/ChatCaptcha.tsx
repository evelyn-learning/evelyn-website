"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";

interface ChatCaptchaProps {
  onVerified: () => void;
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

export function ChatCaptcha({ onVerified }: ChatCaptchaProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Initialize challenge
  useEffect(() => {
    setChallenge(generateChallenge());

    // Check for existing lockout
    const storedLockout = localStorage.getItem("chat_captcha_lockout");
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout, 10);
      if (lockoutTime > Date.now()) {
        setLockedUntil(lockoutTime);
      } else {
        localStorage.removeItem("chat_captcha_lockout");
      }
    }
  }, []);

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
        localStorage.removeItem("chat_captcha_lockout");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!challenge) return;

      const answer = parseInt(userAnswer.trim(), 10);

      if (answer === challenge.answer) {
        // Mark as verified in session storage
        sessionStorage.setItem("chat_verified", "true");
        onVerified();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setUserAnswer("");
        setError("Incorrect answer. Please try again.");

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION;
          setLockedUntil(lockoutTime);
          localStorage.setItem("chat_captcha_lockout", lockoutTime.toString());
          setError("");
        } else {
          // Generate new challenge after wrong answer
          setChallenge(generateChallenge());
        }
      }
    },
    [challenge, userAnswer, attempts, onVerified]
  );

  if (!challenge) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (lockedUntil) {
    return (
      <div className="p-4 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-900">Too many attempts</h3>
        <p className="mt-1 text-xs text-gray-500">
          Please wait {formatTime(timeRemaining)} before trying again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">
          Please verify you&apos;re human to start chatting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-lg font-medium text-gray-800">
            What is {challenge.num1} + {challenge.num2}?
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Verify
          </button>
        </div>

        {attempts > 0 && (
          <p className="text-center text-xs text-gray-400">
            Attempt {attempts} of {MAX_ATTEMPTS}
          </p>
        )}
      </form>
    </div>
  );
}
