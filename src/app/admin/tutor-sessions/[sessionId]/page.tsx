import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { TutorSession } from "@/models";
import { ArrowLeft, Clock, MessageSquare, Layers, DollarSign, User, BookOpen, Target } from "lucide-react";
import { formatRelativeTime } from "@/lib/tutor/recordings/relative-time";
import ReplayPlayer from "../components/ReplayPlayer";
import ExportSessionPDFButton from "../components/ExportSessionPDFButton";
import SpokenTranscript from "../components/SpokenTranscript";

interface SessionPageProps {
  params: Promise<{ sessionId: string }>;
}

async function getSession(sessionId: string) {
  await connectDB();
  const session = await TutorSession.findOne({ sessionId })
    .lean<{ studentName?: string; studentId?: string } & Record<string, unknown> | null>();
  if (!session) return null;
  // A2 name fallback — same rule as the list view: resolve a missing
  // studentName from a sibling session with the same studentId.
  if (!session.studentName && session.studentId) {
    const named = await TutorSession.findOne({
      studentId: session.studentId,
      studentName: { $nin: [null, ''] },
    })
      .select('studentName')
      .sort({ startedAt: -1 })
      .lean<{ studentName?: string } | null>();
    if (named?.studentName) session.studentName = named.studentName;
  }
  return JSON.parse(JSON.stringify(session));
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default async function SessionDetailPage({ params }: SessionPageProps) {
  const authSession = await getServerSession(authOptions);
  if (!authSession) redirect("/admin/login");

  const { sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) notFound();

  const statusColors: Record<string, string> = {
    active: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    abandoned: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/tutor-sessions" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Session Detail</h1>
              <p className="text-sm text-gray-500">{session.sessionId}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                  session.source === 'embed' ? 'bg-indigo-50 text-indigo-600'
                  : session.source === 'test' ? 'bg-purple-50 text-purple-600'
                  : session.source === 'showcase' ? 'bg-amber-50 text-amber-600'
                  : 'bg-blue-50 text-blue-600'
                }`}>
                  {session.source === 'embed' ? 'Portal' : session.source === 'test' ? 'Test' : session.source === 'showcase' ? 'Showcase' : 'Website'}
                </span>
                {session.sourcePartnerId && (
                  <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">{session.sourcePartnerId}</span>
                )}
                {session.sourceHost && (
                  <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700">{String(session.sourceHost).replace(/^https?:\/\//, '')}</span>
                )}
                {session.voiceEngine && (
                  <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">{session.voiceEngine}</span>
                )}
                {session.hasAudio && (
                  <span className="inline-flex rounded px-2 py-0.5 text-xs font-medium bg-green-50 text-green-600">Audio</span>
                )}
                <span className="inline-flex rounded px-2 py-0.5 text-xs text-gray-500" title={new Date(session.startedAt).toLocaleString('en-US')}>
                  {formatRelativeTime(session.startedAt)}
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <ExportSessionPDFButton
                transcript={session.transcript || []}
                whiteboardCommands={session.whiteboardCommands || []}
                topic={session.topic}
                subject={session.subject}
                level={session.level}
                sessionGoal={session.sessionGoal}
                studentName={session.studentName}
              />
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[session.status] || 'bg-gray-100'}`}>
                {session.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Metadata Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <MetaCard icon={User} label="Student" value={session.studentName || 'Anonymous'} />
          <MetaCard icon={BookOpen} label="Subject" value={`${session.subject || '-'} / ${session.topic || '-'}`} />
          <MetaCard icon={Target} label="Goal" value={session.sessionGoal || '-'} />
          <MetaCard icon={Clock} label="Duration" value={formatDuration(session.duration)} />
          <MetaCard icon={MessageSquare} label="Messages" value={`${session.messageCount || 0}`} />
          <MetaCard icon={Layers} label="Whiteboard" value={`${session.whiteboardItemCount || 0} items`} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 shadow text-center">
            <p className="text-xs text-gray-500 uppercase">Mode</p>
            <p className="text-lg font-semibold">{session.inputMode}{session.voiceEngine ? ` (${session.voiceEngine})` : ''}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow text-center">
            <p className="text-xs text-gray-500 uppercase">Level</p>
            <p className="text-lg font-semibold">{session.level || '-'}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <p className="text-xs text-gray-500 uppercase">Est. Cost</p>
            </div>
            <p className="text-lg font-semibold">${(session.estimatedCost || 0).toFixed(3)}</p>
          </div>
        </div>

        {/* Replay Player */}
        <ReplayPlayer
          transcript={session.transcript || []}
          whiteboardCommands={session.whiteboardCommands || []}
          debugEvents={session.debugEvents || []}
          startedAt={session.startedAt}
          endedAt={session.endedAt}
          duration={session.duration}
          studentName={session.studentName}
          subject={session.subject}
          topic={session.topic}
          sessionId={session.sessionId}
          hasAudio={session.hasAudio}
        />

        {/* Static Transcript (with spoken-form / TTS audit toggle) */}
        <SpokenTranscript transcript={session.transcript || []} />
      </main>
    </div>
  );
}

function MetaCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-gray-400" />
        <p className="text-xs text-gray-500 uppercase">{label}</p>
      </div>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}
