import { connectDB } from '@/lib/db';
import { TutorSession } from '@/models';
import { verifyReplayToken } from '@/lib/tutor/portal/replay-token';
import ReplayPlayer from '../../admin/tutor-sessions/components/ReplayPlayer';
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
      </main>
    </div>
  );
}
