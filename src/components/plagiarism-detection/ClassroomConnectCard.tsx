'use client';

import React from 'react';

export default function ClassroomConnectCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm6 4a3 3 0 116 0 3 3 0 01-6 0zm-2 7a5 5 0 0110 0v1H7v-1z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Google Classroom</h3>
        <p className="text-sm text-gray-600 mb-6">
          Read-only access. Student documents are analyzed and not stored.
        </p>
        <a
          href="/api/auth/google"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#fff" d="M21.35 11.1H12v2.81h5.34c-.23 1.37-1.61 4.01-5.34 4.01-3.21 0-5.83-2.66-5.83-5.93s2.62-5.93 5.83-5.93c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 3.6 14.6 2.66 12 2.66 6.86 2.66 2.7 6.82 2.7 12s4.16 9.34 9.3 9.34c5.37 0 8.92-3.77 8.92-9.07 0-.61-.07-1.07-.17-1.55z"/>
          </svg>
          Connect with Google
        </a>
      </div>
    </div>
  );
}
