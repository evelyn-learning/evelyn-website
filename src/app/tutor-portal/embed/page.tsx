'use client';

/**
 * Embeddable Voice Tutor — lives inside partner iframes.
 *
 * Reads session config from a JWT token query param.
 * Skips setup/summary — goes straight to the tutoring session.
 * Applies partner branding (colors, logo, product name).
 *
 * Engine: all embeds run on claude-brain. The legacy `engine` token
 * field (standard / premium) is accepted for backwards compatibility
 * but does not change routing — every session goes through the brain
 * orchestrator with realtime voice.
 */

import { useState, useCallback, useRef, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { buildDisplayName } from '@/lib/tutor/topic-taxonomy';
import TutorSession from '@/app/tutor/components/session/TutorSession';
import { type TutorMilestone } from '@/app/tutor/components/VoiceTutorRealtime';
import type { SessionResult } from '@evelyn/portal-contract/v1';

/** The contract's milestone enum (derived from SessionResult — the package
 *  exports the type via this field rather than a standalone alias). */
type SessionMilestone = SessionResult['milestone'];

/** Ranking so the embed reports the FURTHEST milestone reached. Keyed by the
 *  contract enum — assigning a TutorMilestone here proves it maps to a valid
 *  SessionMilestone at compile time. */
const MILESTONE_RANK: Record<SessionMilestone, number> = {
  none: 0,
  first_concept_complete: 1,
  first_try_yourself_success: 2,
  recap_reached: 3,
};
import type { SessionGoal, TranscriptEntry } from '@/lib/tutor/types';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import type { OpenAIVoice } from '@/app/tutor/hooks/useOpenAIRealtime';

type InputMode = 'text' | 'voice';
type InternalEngine = 'claude-brain';

interface EmbedConfig {
  partner_id: string;
  student_id: string;
  student_name?: string;
  subject: string;
  topic?: string;
  level: string;
  session_goal?: SessionGoal;
  engine?: 'standard' | 'premium';
  locale?: string;
  input_mode?: InputMode;
  voice?: string;
  curriculum_module?: string;
  max_duration_minutes?: number;
  branding?: {
    primary_color?: string;
    logo_url?: string;
    product_name?: string;
  };
  features?: {
    homework_upload?: boolean;
    text_mode?: boolean;
    voice_mode?: boolean;
  };
  metadata?: Record<string, unknown>;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  operation: string;
  timestamp: Date;
  inputAudioTokens?: number;
  outputAudioTokens?: number;
  inputTextTokens?: number;
  outputTextTokens?: number;
}

function parseToken(tokenParam: string | null): EmbedConfig | null {
  if (!tokenParam) return null;
  try {
    // TODO: Replace with proper JWT verification using partner's API secret
    // For now, accept base64-encoded JSON for development/testing
    const decoded = atob(tokenParam);
    return JSON.parse(decoded);
  } catch {
    // Try plain JSON (for sandbox testing)
    try {
      return JSON.parse(decodeURIComponent(tokenParam));
    } catch {
      return null;
    }
  }
}

function mapEngine(_engine?: string): InternalEngine {
  // All embeds run on claude-brain. The token's `engine` field is
  // ignored for routing — only kept on the type for backwards
  // compatibility with existing partner JWTs.
  return 'claude-brain';
}

function EmbedSession() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');
  const config = useMemo(() => parseToken(tokenParam), [tokenParam]);

  // If no valid config, show error
  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-xl font-bold text-gray-900">Invalid Session Token</h1>
          <p className="text-sm text-gray-600">
            A valid session token is required to start a tutoring session.
            Please check your integration and try again.
          </p>
        </div>
      </div>
    );
  }

  return <EmbedSessionInner config={config} />;
}

function EmbedSessionInner({ config }: { config: EmbedConfig }) {
  const subject = config.subject;
  const level = config.level;
  const topic = config.topic || '';
  const studentName = config.student_name || '';
  const sessionGoal: SessionGoal = config.session_goal || 'practice';
  const inputMode: InputMode = config.input_mode || 'voice';
  const voiceEngine: InternalEngine = mapEngine(config.engine);
  const openAIVoice: OpenAIVoice = (config.voice as OpenAIVoice) || 'coral';
  // Clamp partner-supplied session length to [1, 120] min. The hard
  // ceiling matches the bound in lib/tutor/lesson-plan/session-budget
  // (MAX_SESSION_MINUTES) and exists to prevent runaway voice-API
  // costs and bad pedagogy from arbitrary partner-supplied values.
  const maxDuration = Math.max(
    1,
    Math.min(120, typeof config.max_duration_minutes === 'number' && Number.isFinite(config.max_duration_minutes)
      ? Math.floor(config.max_duration_minutes)
      : 30),
  );
  const branding = config.branding;

  // Apply branding color as CSS variable
  const brandStyle = branding?.primary_color
    ? { '--brand-color': branding.primary_color } as React.CSSProperties
    : {};

  // Session state. Transcript + whiteboard are mirrored from TutorSession via
  // its callbacks so saveSession + the session_ended postMessage have counts.
  const [sessionId] = useState(() => `embed-${Date.now()}`);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [whiteboardCommands, setWhiteboardCommands] = useState<WhiteboardCommand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const sessionStartRef = useRef(new Date());

  const topicDisplayName = useMemo(
    () => topic ? buildDisplayName(subject, level, topic) : `${subject} — ${level}`,
    [subject, level, topic]
  );

  // Text-mode chat, the auto-greeting, voice callbacks, and homework upload
  // all moved into the shared <TutorSession> (per the decision to route typed
  // input through the brain). The embed only mirrors transcript/whiteboard via
  // TutorSession's callbacks for saveSession + the session_ended counts.

  // Save session to DB
  const saveSession = useCallback((status: 'completed' | 'abandoned') => {
    const now = new Date();
    const duration = Math.round((now.getTime() - sessionStartRef.current.getTime()) / 1000);
    const payload = {
      sessionId,
      subject,
      topic,
      level,
      sessionGoal,
      inputMode,
      voiceEngine,
      source: 'embed',
      studentName: studentName || undefined,
      startedAt: sessionStartRef.current.toISOString(),
      endedAt: now.toISOString(),
      duration,
      messageCount: transcript.length,
      whiteboardItemCount: whiteboardCommands.length,
      status,
      transcript: transcript.map(t => ({
        role: t.role,
        text: t.text,
        timestamp: t.timestamp.toISOString(),
        ...(t.whiteboardCommands?.length ? { whiteboardCommands: t.whiteboardCommands } : {}),
        ...(t.pedagogicalIntent ? { pedagogicalIntent: t.pedagogicalIntent } : {}),
      })),
      whiteboardCommands: whiteboardCommands.map(cmd => ({
        action: cmd.action,
        data: { ...cmd, action: undefined },
        timestamp: now.toISOString(),
      })),
    };
    if (status === 'abandoned') {
      navigator.sendBeacon('/api/tutor/session-usage', JSON.stringify(payload));
    } else {
      fetch('/api/tutor/session-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }, [sessionId, subject, topic, level, sessionGoal, inputMode, voiceEngine, studentName, transcript, whiteboardCommands]);

  // Furthest pedagogical milestone reached this session (from the runtime).
  // Defaults to 'none'; reported to the portal in session_ended.
  const milestoneRef = useRef<SessionMilestone>('none');
  const handleMilestone = useCallback((m: TutorMilestone) => {
    if (MILESTONE_RANK[m] > MILESTONE_RANK[milestoneRef.current]) milestoneRef.current = m;
  }, []);

  // End session — save to DB + notify parent window
  const handleEndSession = useCallback(() => {
    saveSession('completed');
    setSessionEnded(true);
    const duration = Math.round((Date.now() - sessionStartRef.current.getTime()) / 1000);
    // Post message to parent window for partner integration
    window.parent.postMessage({
      type: 'evelyn:session_ended',
      data: {
        session_id: sessionId,
        duration,
        message_count: transcript.length,
        whiteboard_items: whiteboardCommands.length,
        // Real engine milestone (value-boxed). 'none' if the student bailed
        // before completing a concept — the portal consumes this directly.
        milestone: milestoneRef.current,
      },
    }, '*');
  }, [saveSession, sessionId, transcript.length, whiteboardCommands.length]);

  // Save as abandoned on page unload
  useEffect(() => {
    if (sessionEnded) return;
    const handleBeforeUnload = () => saveSession('abandoned');
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionEnded, saveSession]);

  // Session ended view
  if (sessionEnded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50" style={brandStyle}>
        <div className="max-w-md text-center p-8">
          <div className="mb-4 text-4xl">&#10003;</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">Session Complete</h1>
          <p className="text-sm text-gray-600">
            {transcript.length} messages exchanged, {whiteboardCommands.length} visuals generated.
          </p>
        </div>
      </div>
    );
  }

  // Partner brand lockup shown in the new UI's top bar (keeps branding while
  // matching the /tutor look). primary_color rides the --brand-color var below.
  const headerBrand = (branding?.logo_url || branding?.product_name) ? (
    <div className="flex items-center gap-2">
      {branding?.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={branding.logo_url} alt="" className="h-5" />
      )}
      {branding?.product_name && (
        <span className="text-sm font-semibold text-slate-800 truncate max-w-[38vw]">{branding.product_name}</span>
      )}
    </div>
  ) : undefined;

  return (
    <div style={brandStyle}>
      <TutorSession
        subject={subject}
        topic={topic || ''}
        level={level}
        studentName={studentName || undefined}
        studentId={config.student_id}
        sessionId={sessionId}
        sessionGoal={sessionGoal}
        lessonPlanId={config.curriculum_module || undefined}
        voice={openAIVoice}
        voiceEngine="claude-brain"
        sessionMaxMinutes={maxDuration}
        topicDisplayName={topicDisplayName}
        headerBrand={headerBrand}
        onEndSession={handleEndSession}
        onMilestone={handleMilestone}
        onTranscriptUpdate={setTranscript}
        onWhiteboardCommand={(cmds) => setWhiteboardCommands((prev) => [...prev, ...cmds])}
      />

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-20 right-4 z-[70] flex items-center gap-2 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700 shadow-lg">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">x</button>
        </div>
      )}
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <EmbedSession />
    </Suspense>
  );
}
