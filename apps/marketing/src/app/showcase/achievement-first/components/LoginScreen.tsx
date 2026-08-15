'use client';

import React from 'react';
import { DEMO_ACCOUNTS } from '../data/accounts';
import { useAFStore, DemoAccount } from '../store';

const ROLE_BADGE: Record<string, { label: string; classes: string }> = {
  student: { label: 'Student', classes: 'bg-blue-100 text-blue-700' },
  parent: { label: 'Parent', classes: 'bg-sky-100 text-sky-700' },
  instructor: { label: 'Instructor', classes: 'bg-green-100 text-green-700' },
};

function AccountCard({ account }: { account: DemoAccount }) {
  const login = useAFStore((s) => s.login);
  const badge = ROLE_BADGE[account.role];

  return (
    <button
      onClick={() => login(account)}
      className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-white/20 hover:border-[#F5A623]/60 hover:bg-white/10 transition-all text-left group"
    >
      <div
        className={`w-12 h-12 rounded-full ${account.color} text-white flex items-center justify-center text-lg font-bold flex-shrink-0`}
      >
        {account.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white group-hover:text-[#F5A623] transition-colors truncate">
          {account.name}
        </p>
        <span
          className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${badge.classes}`}
        >
          {badge.label}
        </span>
      </div>
      <svg
        className="w-5 h-5 text-blue-300 group-hover:text-[#F5A623] transition-colors flex-shrink-0"
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
    <div className="min-h-screen bg-gradient-to-br from-[#003B71] via-[#00295a] to-[#001a3d] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <svg
              className="w-8 h-8 text-[#F5A623]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Achievement First Learning Platform
          </h1>
          <p className="text-blue-200 text-sm">
            Choose an account to explore the platform
          </p>
          <p className="text-[#F5A623] text-xs mt-2 tracking-wider uppercase font-semibold">
            Respect &middot; Enthusiasm &middot; Achievement &middot; Citizenship &middot; Hard Work
          </p>
        </div>

        {/* Account columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grade 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-bold text-white mb-1">Grade 3</h2>
            <p className="text-blue-300 text-xs mb-4">Math &amp; Science</p>
            <div className="space-y-2">
              {grade3.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>

          {/* Grade 6 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-bold text-white mb-1">Grade 6</h2>
            <p className="text-blue-300 text-xs mb-4">Math &amp; Science</p>
            <div className="space-y-2">
              {grade6.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-blue-400 text-xs mt-8">
          No password required — click any account to explore
        </p>
      </div>
    </div>
  );
}
