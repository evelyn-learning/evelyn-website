'use client';

import React from 'react';
import { DEMO_ACCOUNTS } from '../data/accounts';
import { useExplorerStore, DemoAccount } from '../store';

const ROLE_BADGE: Record<string, { label: string; classes: string }> = {
  student: { label: 'Student', classes: 'bg-purple-100 text-purple-700' },
  parent: { label: 'Parent', classes: 'bg-blue-100 text-blue-700' },
  instructor: { label: 'Instructor', classes: 'bg-green-100 text-green-700' },
};

function AccountCard({ account }: { account: DemoAccount }) {
  const login = useExplorerStore((s) => s.login);
  const badge = ROLE_BADGE[account.role];

  return (
    <button
      onClick={() => login(account)}
      className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-white/20 hover:border-yellow-400/60 hover:bg-white/10 transition-all text-left group"
    >
      <div
        className={`w-12 h-12 rounded-full ${account.color} text-white flex items-center justify-center text-lg font-bold flex-shrink-0`}
      >
        {account.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white group-hover:text-yellow-300 transition-colors truncate">
          {account.name}
        </p>
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${badge.classes}`}
        >
          {badge.label}
        </span>
      </div>
      <svg
        className="w-5 h-5 text-purple-300 group-hover:text-yellow-400 transition-colors flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function LoginScreen() {
  const grade3 = DEMO_ACCOUNTS.filter((a) => a.grade === 3);
  const grade6 = DEMO_ACCOUNTS.filter((a) => a.grade === 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Explorer Academy Learning Platform
          </h1>
          <p className="text-purple-200 text-sm">
            Choose an account to explore the platform
          </p>
        </div>

        {/* Account columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grade 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-bold text-white mb-1">Grade 3</h2>
            <p className="text-purple-300 text-xs mb-4">Math &amp; Science</p>
            <div className="space-y-2">
              {grade3.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>

          {/* Grade 6 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-bold text-white mb-1">Grade 6</h2>
            <p className="text-purple-300 text-xs mb-4">Math &amp; Science</p>
            <div className="space-y-2">
              {grade6.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-purple-400 text-xs mt-8">
          No password required — click any account to explore
        </p>
      </div>
    </div>
  );
}
