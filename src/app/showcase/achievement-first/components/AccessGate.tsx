'use client';

import React, { useState } from 'react';

const ACCESS_CODE = 'AF2026';

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
    <div className="min-h-screen bg-gradient-to-br from-[#003B71] via-[#00295a] to-[#001a3d] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
            <svg className="w-10 h-10 text-[#F5A623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Achievement First
          </h1>
          <p className="text-blue-200 text-sm">
            Welcome to your classroom learning platform preview.
            <br />
            Enter your access code to explore.
          </p>
        </div>

        {/* Access Code Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <label htmlFor="access-code" className="block text-sm font-medium text-blue-200 mb-2">
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
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent text-center text-lg tracking-widest uppercase"
            autoFocus
            autoComplete="off"
          />

          {error && (
            <p className="mt-2 text-sm text-red-300 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full mt-4 py-3 rounded-xl bg-[#F5A623] hover:bg-[#e6991a] text-[#003B71] font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p className="text-center text-blue-400 text-xs mt-6">
          Achievement First Learning Platform
        </p>
      </div>
    </div>
  );
}
