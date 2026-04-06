import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { TutorSession } from "@/models";
import { ArrowLeft, Play, Clock, MessageSquare, Layers } from "lucide-react";

async function getSessions() {
  await connectDB();
  const sessions = await TutorSession.find()
    .select('-transcript -whiteboardCommands -debugEvents -tokenUsage')
    .sort({ startedAt: -1 })
    .limit(100)
    .lean();
  return JSON.parse(JSON.stringify(sessions));
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatCost(cost?: number): string {
  if (!cost) return '-';
  return `$${cost.toFixed(3)}`;
}

const statusColors: Record<string, string> = {
  active: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  abandoned: 'bg-gray-100 text-gray-800',
};

const modeLabels: Record<string, string> = {
  text: 'Text',
  voice: 'Voice',
};

export default async function TutorSessionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const sessions = await getSessions();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Tutor Sessions</h1>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {sessions.length} sessions
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {sessions.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <p className="text-gray-500">No tutor sessions found.</p>
          </div>
        ) : (
          <div className="rounded-xl bg-white shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Subject / Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <Clock className="inline h-3.5 w-3.5 mr-1" />Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <MessageSquare className="inline h-3.5 w-3.5 mr-1" />Msgs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <Layers className="inline h-3.5 w-3.5 mr-1" />WB
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((s: Record<string, unknown>) => (
                    <tr key={s.sessionId as string} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        <div>{(s.studentName as string) || <span className="text-gray-400">Anonymous</span>}</div>
                        {s.source && String(s.source) !== 'tutor' ? (
                          <span className={`inline-flex mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            String(s.source) === 'embed' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {String(s.source) === 'embed' ? 'Portal' : String(s.source)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div>{s.subject as string}</div>
                        <div className="text-xs text-gray-400">{s.topic as string}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.level as string || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                          s.inputMode === 'voice' ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-600'
                        }`}>
                          {modeLabels[s.inputMode as string] || s.inputMode as string}
                        </span>
                        {s.voiceEngine ? (
                          <div className="text-[10px] text-gray-400 mt-0.5">{String(s.voiceEngine)}</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {formatDuration(s.duration as number)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.messageCount as number || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.whiteboardItemCount as number || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {formatCost(s.estimatedCost as number)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[s.status as string] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {s.status as string}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(s.startedAt as string).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          href={`/admin/tutor-sessions/${s.sessionId}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <Play className="h-3 w-3" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
