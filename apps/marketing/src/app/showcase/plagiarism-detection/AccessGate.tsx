'use client';

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const ACCESS_CODE = 'PD2026';

interface AccessGateProps {
  onAccessGranted: () => void;
}

export default function AccessGate({ onAccessGranted }: AccessGateProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (code.trim().toUpperCase() === ACCESS_CODE) {
        onAccessGranted();
      } else {
        setError('Invalid access code. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 40%, #7f1d1d 100%)' }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Plagiarism &amp; AI Detection</h1>
          <p className="text-white/80 text-sm">
            Evelyn Learning Showcase
            <br />
            Enter your access code to continue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <label htmlFor="access-code" className="block text-sm font-medium text-white/80 mb-2">
            Access Code
          </label>
          <input
            id="access-code"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
            placeholder="Enter your code"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-center text-lg tracking-widest uppercase"
            autoFocus
            autoComplete="off"
          />

          {error && <p className="mt-2 text-sm text-red-200 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full mt-4 py-3 rounded-xl text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ backgroundColor: '#ea580c' }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <p className="text-center text-white/50 text-xs mt-6">Evelyn Learning</p>
      </div>
    </div>
  );
}
