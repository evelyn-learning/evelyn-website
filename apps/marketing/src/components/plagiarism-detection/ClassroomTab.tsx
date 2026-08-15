'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ClassroomConnectCard from './ClassroomConnectCard';
import ClassroomConnectedPanel from './ClassroomConnectedPanel';
import ClassroomErrorCard from './ClassroomErrorCard';
import type { AssignmentContext, BatchSubmission } from './types';

const TEACHER_ID_KEY = 'plagiarism_teacher_id';
const TEACHER_EMAIL_KEY = 'plagiarism_teacher_email';

type State =
  | { kind: 'loading' }
  | { kind: 'disconnected' }
  | { kind: 'connected'; teacherId: string; teacherEmail: string }
  | { kind: 'error'; code: string };

interface Props {
  context: AssignmentContext;
  onAnalysisComplete: (submissions: BatchSubmission[]) => void;
}

export default function ClassroomTab({ context, onAnalysisComplete }: Props) {
  const [state, setState] = useState<State>({ kind: 'loading' });

  const ingestUrlAndCheckStatus = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const errorCode = params.get('google_error');
    if (errorCode) {
      params.delete('google_error');
      window.history.replaceState(null, '', `${url.pathname}${params.toString() ? '?' + params.toString() : ''}`);
      setState({ kind: 'error', code: errorCode });
      return;
    }

    const newTeacherId = params.get('teacher_id');
    const newTeacherEmail = params.get('teacher_email');
    if (params.get('google_connected') === 'true' && newTeacherId) {
      localStorage.setItem(TEACHER_ID_KEY, newTeacherId);
      if (newTeacherEmail) localStorage.setItem(TEACHER_EMAIL_KEY, newTeacherEmail);
      params.delete('google_connected');
      params.delete('teacher_id');
      params.delete('teacher_email');
      window.history.replaceState(null, '', `${url.pathname}${params.toString() ? '?' + params.toString() : ''}`);
    }

    const teacherId = localStorage.getItem(TEACHER_ID_KEY);
    if (!teacherId) {
      setState({ kind: 'disconnected' });
      return;
    }

    try {
      const res = await fetch(`/api/auth/google/status?teacherId=${encodeURIComponent(teacherId)}`);
      const data = await res.json();
      if (data.connected) {
        setState({
          kind: 'connected',
          teacherId,
          teacherEmail: data.email || localStorage.getItem(TEACHER_EMAIL_KEY) || '(unknown)',
        });
      } else {
        setState({ kind: 'disconnected' });
      }
    } catch {
      setState({ kind: 'disconnected' });
    }
  }, []);

  useEffect(() => {
    ingestUrlAndCheckStatus();
  }, [ingestUrlAndCheckStatus]);

  const handleDisconnect = useCallback(async () => {
    const teacherId = localStorage.getItem(TEACHER_ID_KEY);
    if (!teacherId) {
      setState({ kind: 'disconnected' });
      return;
    }
    try {
      await fetch('/api/auth/google/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId }),
      });
    } catch (err) {
      console.warn('Disconnect call failed:', err);
    }
    localStorage.removeItem(TEACHER_ID_KEY);
    localStorage.removeItem(TEACHER_EMAIL_KEY);
    setState({ kind: 'disconnected' });
  }, []);

  const handleAuthLost = useCallback((code: string) => {
    setState({ kind: 'error', code });
  }, []);

  const handleReconnect = useCallback(() => {
    localStorage.removeItem(TEACHER_ID_KEY);
    localStorage.removeItem(TEACHER_EMAIL_KEY);
    window.location.href = '/api/auth/google';
  }, []);

  return (
    <div className="space-y-4">
      {state.kind === 'loading' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
          <div className="w-10 h-10 mx-auto mb-3 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          Checking Google Classroom connection…
        </div>
      )}

      {state.kind === 'disconnected' && <ClassroomConnectCard />}

      {state.kind === 'error' && (
        <ClassroomErrorCard errorCode={state.code} onReconnect={handleReconnect} />
      )}

      {state.kind === 'connected' && (
        <ClassroomConnectedPanel
          teacherId={state.teacherId}
          teacherEmail={state.teacherEmail}
          context={context}
          onDisconnect={handleDisconnect}
          onAuthLost={handleAuthLost}
          onAnalysisComplete={onAnalysisComplete}
        />
      )}

      <p className="text-xs text-gray-500 text-center px-4">
        Evelyn Learning accesses your Google Classroom in read-only mode.
        Student documents are analyzed and never stored. FERPA compliant.
      </p>
    </div>
  );
}
