'use client';

import React from 'react';

interface Props {
  errorCode: string;
  onReconnect: () => void;
}

const MESSAGES: Record<string, string> = {
  state_mismatch: 'Security check failed during sign-in. Please try again.',
  state_missing: 'Security check failed during sign-in (state missing). Please try again.',
  state_malformed: 'Security check failed during sign-in (state malformed). Please try again.',
  state_bad_signature: 'Security check failed during sign-in (signature mismatch). Please try again.',
  state_expired: 'Sign-in took too long. Please try again.',
  missing_code: 'Google did not return an authorization code.',
  missing_tokens: 'Google did not return refresh credentials. Make sure you grant offline access.',
  missing_email: 'Could not read your Google account email.',
  callback_failed: 'Sign-in failed. Please try connecting again.',
  access_denied: 'Permission was denied at the consent screen. Reconnect and accept the requested scopes.',
  INVALID_GRANT: 'Your Google Classroom access has expired or was revoked. Please reconnect.',
  NOT_CONNECTED: 'No Classroom connection found for this teacher.',
};

export default function ClassroomErrorCard({ errorCode, onReconnect }: Props) {
  const message = MESSAGES[errorCode] || `Connection error (${errorCode}). Please reconnect.`;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-red-200">
      <div className="max-w-md mx-auto">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 19.07a10 10 0 1114.14 0H4.93z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Classroom not connected</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onReconnect}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition"
        >
          Reconnect
        </button>
      </div>
    </div>
  );
}
