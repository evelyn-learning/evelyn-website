'use client';

import React, { useState } from 'react';

const ACCESS_CODE = 'EA2026';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
            <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Explorer Academy
          </h1>
          <p className="text-purple-200 text-sm">
            Welcome to your personalized platform preview.
            <br />
            Enter your access code to explore.
          </p>
        </div>

        {/* Access Code Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <label htmlFor="access-code" className="block text-sm font-medium text-purple-200 mb-2">
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
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-center text-lg tracking-widest uppercase"
            autoFocus
            autoComplete="off"
          />

          {error && (
            <p className="mt-2 text-sm text-red-300 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full mt-4 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Enter'
            )}
          </button>
        </form>

        <p className="text-center text-purple-400 text-xs mt-6">
          Explorer Academy Learning Platform
        </p>
      </div>
    </div>
  );
}
