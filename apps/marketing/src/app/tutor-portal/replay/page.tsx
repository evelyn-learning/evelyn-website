import { connectDB } from '@core/db';
import { TutorSession } from '@/models';
import { verifyReplayToken } from '@/lib/tutor/portal/replay-token';
import ReplayPlayer, { TranscriptBubble } from '../../admin/tutor-sessions/components/ReplayPlayer';
import ExportSessionPDFButton from '../../admin/tutor-sessions/components/ExportSessionPDFButton';

/**
 * Student-facing session replay (crimsora v2 — past sessions). Loaded in the
 * portal's iframe with a signed replay token; unlike the admin replay pages
 * this VERIFIES the token (HS256, partner secret) and ENFORCES ownership —
 * the token's student_id must match the stored session's studentId. Reuses
 * the admin ReplayPlayer + client-side PDF export unchanged.
 */

export const dynamic = 'force-dynamic';

interface ReplayPageProps {
  searchParams: Promise<{ token?: string }>;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Refusal({ message }: { message: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-100 p-6">
      <div className="max-w-md rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-lg font-semibold text-gray-900">Replay unavailable</h1>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export default async function StudentReplayPage({ searchParams }: ReplayPageProps) {
  const { token } = await searchParams;
  const verdict = verifyReplayToken(token ?? null);
  if (!verdict.ok) {
    return <Refusal message="This replay link is invalid or has expired. Open the session again from your dashboard." />;
  }
  const { payload } = verdict;

  await connectDB();
  const session = await TutorSession.findOne({ sessionId: payload.session_id }).lean<
    Record<string, unknown> & { studentId?: string } | null
  >();
  if (!session) return <Refusal message="This session recording could not be found." />;
  if (!session.studentId || session.studentId !== payload.student_id) {
    // Ownership is load-bearing here: a replay token only unlocks the
    // student's OWN recording, never a sibling's.
    return <Refusal message="This session does not belong to this account." />;
  }

  const s = JSON.parse(JSON.stringify(session));

  // Static page content (the modal is opt-in via "Open Session Replay") —
  // before 2026-07-15 this page was just the header floating over an empty
  // grey expanse. Everything below derives from the session doc alone.
  const transcript: { role: string; text: string; timestamp: string }[] = s.transcript || [];
  const sortedTranscript = [...transcript].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const studentMessages = transcript.filter((t) => t.role === 'student').length;
  const tutorMessages = transcript.length - studentMessages;
  const whiteboardItems = (s.whiteboardCommands || []).length || s.whiteboardItemCount || 0;
  // `duration` spans only the latest attempt for paused-and-resumed sessions;
  // it is still the most honest "time spent" figure the doc carries.
  const durationSec: number | undefined =
    s.duration ||
    (s.endedAt && s.startedAt
      ? Math.round((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000)
      : undefined);
  const topicsCovered: string[] = Array.isArray(s.topicsCovered) ? s.topicsCovered : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {s.subject || 'Session'}{s.topic ? ` · ${s.topic}` : ''}
            </h1>
            <p className="text-sm text-gray-500">
              {new Date(s.startedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <ExportSessionPDFButton
            transcript={s.transcript || []}
            whiteboardCommands={s.whiteboardCommands || []}
            topic={s.topic}
            subject={s.subject}
            level={s.level}
            sessionGoal={s.sessionGoal}
            studentName={s.studentName}
          />
        </div>

        <ReplayPlayer
          transcript={s.transcript || []}
          whiteboardCommands={s.whiteboardCommands || []}
          debugEvents={[]}
          startedAt={s.startedAt}
          endedAt={s.endedAt}
          duration={s.duration}
          studentName={s.studentName}
          subject={s.subject}
          topic={s.topic}
          sessionId={s.sessionId}
          hasAudio={s.hasAudio}
          audioToken={token}
        />

        {/* At-a-glance session stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Duration" value={durationSec ? formatDuration(durationSec) : '—'} />
          <StatTile label="Tutor messages" value={tutorMessages} />
          <StatTile label="Student messages" value={studentMessages} />
          <StatTile label="Whiteboard items" value={whiteboardItems} />
        </div>

        {topicsCovered.length > 0 && (
          <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Covered in this session</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {topicsCovered.map((t, i) => (
                <span key={i} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full conversation, read-only — same bubbles as the replay modal's
            progressive-reveal pane (TranscriptBubble is shared from
            ReplayPlayer so the two views can't drift apart). */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-medium text-gray-700">Conversation</h2>
          </div>
          <div className="space-y-2 px-4 py-4">
            {sortedTranscript.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">No messages were recorded for this session.</p>
            )}
            {sortedTranscript.map((entry, i) => (
              <TranscriptBubble key={i} entry={entry} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
