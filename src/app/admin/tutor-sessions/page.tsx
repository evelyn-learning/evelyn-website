import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { TutorSession } from "@/models";
import { LessonPlanModel } from "@/models/LessonPlan";
import { ArrowLeft, Play, Clock, MessageSquare, Layers } from "lucide-react";
import { formatRelativeTime } from "@/lib/tutor/recordings/relative-time";
import { buildSessionFilter, type SessionFilterParams } from "@/lib/tutor/recordings/filters";

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function param(sp: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = sp[key];
  return typeof v === 'string' && v ? v : undefined;
}

/** A2: an "active" session with no messages that started this long ago is a
 *  stranded double-start/reload artifact, not a live session — mark it
 *  abandoned so the default view stops showing ghost actives. */
const STALE_EMPTY_ACTIVE_MS = 30 * 60 * 1000;

async function getSessions(filters: SessionFilterParams, page: number) {
  await connectDB();
  // A2 sweep: collapse stale empty "active" sessions to abandoned before
  // querying. Cheap indexed updateMany; idempotent.
  await TutorSession.updateMany(
    {
      status: 'active',
      startedAt: { $lt: new Date(Date.now() - STALE_EMPTY_ACTIVE_MS) },
      $or: [{ messageCount: 0 }, { messageCount: { $exists: false } }],
    },
    { $set: { status: 'abandoned' } },
  );
  const query = buildSessionFilter(filters);
  const [sessions, total, partners, hosts] = await Promise.all([
    TutorSession.find(query)
      .select('-transcript -whiteboardCommands -debugEvents -tokenUsage')
      .sort({ startedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    TutorSession.countDocuments(query),
    TutorSession.distinct('sourcePartnerId', { sourcePartnerId: { $nin: [null, ''] } }),
    TutorSession.distinct('sourceHost', { sourceHost: { $nin: [null, ''] } }),
  ]);
  // A2 name fallback: a session whose own studentName never arrived (token
  // minted without student_name on a double-start) resolves its display name
  // from a sibling session with the same studentId that has one.
  const missing = sessions.filter((s) => !s.studentName && s.studentId);
  if (missing.length > 0) {
    const ids = [...new Set(missing.map((s) => s.studentId as string))];
    const named = await TutorSession.find({
      studentId: { $in: ids },
      studentName: { $nin: [null, ''] },
    })
      .select('studentId studentName')
      .sort({ startedAt: -1 })
      .lean();
    const nameById = new Map<string, string>();
    for (const n of named) {
      if (n.studentId && !nameById.has(n.studentId)) nameById.set(n.studentId, n.studentName as string);
    }
    for (const s of missing) {
      const resolved = nameById.get(s.studentId as string);
      if (resolved) s.studentName = resolved;
    }
  }
  // Lesson titles for the Subject/Topic cell — one batched query per page.
  const planIds = [
    ...new Set(
      sessions
        .map((s) => (s.lessonProgress as { lessonPlanId?: string } | undefined)?.lessonPlanId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const lessonTitles: Record<string, string> = {};
  if (planIds.length > 0) {
    const plans = await LessonPlanModel.find({ _id: { $in: planIds } })
      .select('title')
      .lean();
    for (const p of plans) lessonTitles[String(p._id)] = p.title as string;
  }
  return {
    sessions: JSON.parse(JSON.stringify(sessions)),
    total,
    partners: partners.sort(),
    hosts: hosts.sort(),
    lessonTitles,
  };
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

const SOURCE_CHIPS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'Students' },
  { value: 'all', label: 'All' },
  { value: 'tutor', label: 'Website' },
  { value: 'embed', label: 'Portal' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'test', label: 'Tests' },
];

const RANGE_CHIPS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
];

/** Build an href preserving current filters, overriding the given keys.
 *  Setting a key to undefined removes it. Page resets unless explicitly set. */
function filterHref(current: SessionFilterParams & { page?: string }, overrides: Record<string, string | undefined>): string {
  const merged: Record<string, string | undefined> = { ...current, page: undefined, ...overrides };
  const qs = Object.entries(merged)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join('&');
  return qs ? `/admin/tutor-sessions?${qs}` : '/admin/tutor-sessions';
}

export default async function TutorSessionsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const filters: SessionFilterParams = {
    src: param(sp, 'src'),
    partner: param(sp, 'partner'),
    host: param(sp, 'host'),
    audio: param(sp, 'audio'),
    range: param(sp, 'range'),
  };
  const page = Math.max(1, parseInt(param(sp, 'page') || '1', 10) || 1);
  const { sessions, total, partners, hosts, lessonTitles } = await getSessions(filters, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const now = new Date();
  const hasActiveFilters = Boolean(filters.src || filters.partner || filters.host || filters.audio || filters.range);

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
              {total} sessions
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {SOURCE_CHIPS.map((c) => (
            <Link
              key={c.label}
              href={filterHref(filters, { src: c.value })}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                filters.src === c.value || (!filters.src && !c.value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {c.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-gray-300" />
          {RANGE_CHIPS.map((c) => (
            <Link
              key={c.label}
              href={filterHref(filters, { range: c.value })}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                filters.range === c.value || (!filters.range && !c.value)
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {c.label}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-gray-300" />
          <Link
            href={filterHref(filters, { audio: filters.audio === '1' ? undefined : '1' })}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              filters.audio === '1'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Has audio
          </Link>
        </div>
        {(partners.length > 0 || hosts.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {partners.length > 0 && (
              <span className="flex flex-wrap items-center gap-1 text-gray-400">
                Partner:
                {partners.map((p: string) => (
                  <Link key={p} href={filterHref(filters, { partner: filters.partner === p ? undefined : p })}
                    className={`rounded px-2 py-0.5 border ${filters.partner === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    {p}
                  </Link>
                ))}
              </span>
            )}
            {hosts.length > 0 && (
              <span className="flex flex-wrap items-center gap-1 text-gray-400">
                Host:
                {hosts.map((h: string) => (
                  <Link key={h} href={filterHref(filters, { host: filters.host === h ? undefined : h })}
                    className={`rounded px-2 py-0.5 border ${filters.host === h ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    {h.replace(/^https?:\/\//, '')}
                  </Link>
                ))}
              </span>
            )}
          </div>
        )}
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {sessions.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <p className="text-gray-500">
              {hasActiveFilters
                ? 'No sessions match these filters.'
                : 'No student sessions found. Use the All chip to include test and showcase sessions.'}
            </p>
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
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
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
                        {(s.source && String(s.source) !== 'tutor') || s.sourcePartnerId ? (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {String(s.source) !== 'tutor' && (
                              <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                String(s.source) === 'embed' ? 'bg-indigo-50 text-indigo-600'
                                : String(s.source) === 'test' ? 'bg-purple-50 text-purple-600'
                                : 'bg-amber-50 text-amber-600'
                              }`}>
                                {String(s.source) === 'embed' ? 'Portal' : String(s.source) === 'test' ? 'Test' : String(s.source)}
                              </span>
                            )}
                            {s.sourcePartnerId ? (
                              <span className="inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600">
                                {String(s.sourcePartnerId)}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div>{s.subject as string}</div>
                        <div className="text-xs text-gray-400">{s.topic as string}</div>
                        {(() => {
                          const planId = (s.lessonProgress as { lessonPlanId?: string } | undefined)?.lessonPlanId;
                          if (!planId) return null;
                          return <div className="text-xs text-indigo-500">{lessonTitles[planId] || planId}</div>;
                        })()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.level as string || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {formatDuration(s.duration as number)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.messageCount as number || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.whiteboardItemCount as number || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {formatCost(s.estimatedCost as number)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600" title={(s.clientIp as string) || undefined}>
                        {(() => {
                          const loc = s.location as { city?: string; country?: string } | undefined;
                          const text = [loc?.city, loc?.country].filter(Boolean).join(', ');
                          return text || <span className="text-gray-400">–</span>;
                        })()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[s.status as string] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {s.status as string}
                        </span>
                        {s.voiceEngine ? (
                          <div className="text-[10px] text-gray-400 mt-0.5">{String(s.voiceEngine)}</div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500" title={new Date(s.startedAt as string).toLocaleString('en-US')}>
                        {formatRelativeTime(s.startedAt as string, now)}
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-1 py-4 text-sm text-gray-500">
            <span>Page {page} of {totalPages} · {total} sessions</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={filterHref(filters, { page: String(page - 1) })} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50">← Newer</Link>
              )}
              {page < totalPages && (
                <Link href={filterHref(filters, { page: String(page + 1) })} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50">Older →</Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
