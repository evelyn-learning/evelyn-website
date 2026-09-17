'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, PlayCircle } from 'lucide-react';
import { ROSTER, ROSTER_SESSIONS, type FunnelStage } from './data';

const STAGE_STYLE: Record<FunnelStage, string> = {
  'signed up': 'bg-slate-100 text-slate-600',
  enrolled: 'bg-sky-50 text-sky-700',
  'first session': 'bg-amber-50 text-amber-700',
  engaged: 'bg-emerald-50 text-emerald-700',
};

export default function AdminRoster() {
  const [open, setOpen] = useState<string | null>(ROSTER[0]!.name);
  const engaged = ROSTER.filter((s) => s.stage === 'engaged').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Learners', value: String(ROSTER.length) },
          { label: 'Engaged', value: String(engaged) },
          { label: 'Tutoring this month', value: '14.6h' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium">Learner</th>
                <th className="px-2 py-2.5 font-medium">Joined · source</th>
                <th className="px-2 py-2.5 font-medium">Stage</th>
                <th className="px-2 py-2.5 font-medium">Sessions · hours</th>
                <th className="px-2 py-2.5 font-medium">Last seen</th>
                <th className="px-2 py-2.5 font-medium">Access</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {ROSTER.map((s) => {
                const isOpen = open === s.name;
                const stalled = s.stage !== 'engaged' && s.sessions <= 1;
                return (
                  <Fragment key={s.name}>
                    <tr
                      onClick={() => setOpen(isOpen ? null : s.name)}
                      className={`cursor-pointer border-b border-slate-50 hover:bg-slate-50 ${stalled ? 'bg-amber-50/40' : ''}`}
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-900 whitespace-nowrap">{s.name}</td>
                      <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap">
                        {s.joined} · <span className="text-slate-400">{s.source}</span>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STAGE_STYLE[s.stage]}`}>{s.stage}</span>
                      </td>
                      <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap">
                        {s.sessions} · {s.hours}
                      </td>
                      <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap">{s.lastSeen}</td>
                      <td className="px-2 py-2.5 text-slate-600">{s.access}</td>
                      <td className="pr-3">
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-slate-100">
                        <td colSpan={7} className="px-4 py-3" style={{ background: 'var(--ab-soft)' }}>
                          {s.sessions === 0 ? (
                            <p className="text-xs text-slate-600">No sessions yet — a nudge email is the usual next step.</p>
                          ) : (
                            <ul className="space-y-1.5">
                              {ROSTER_SESSIONS.slice(0, Math.min(3, s.sessions)).map((row) => (
                                <li key={row.when} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700">
                                  <span className="w-24 text-slate-500">{row.when}</span>
                                  <span className="flex-1 min-w-[160px]">{row.lesson}</span>
                                  <span>{row.status}</span>
                                  <span>{row.time}</span>
                                  <span className="text-slate-500">{row.coverage}</span>
                                  <span className="inline-flex items-center gap-1 font-medium" style={{ color: 'var(--ab-primary)' }}>
                                    <PlayCircle className="w-3.5 h-3.5" />
                                    Replay
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Highlighted rows are learners who signed up but stalled before a second session — the ones worth a nudge. Every session
        can be replayed, whiteboard and audio.
      </p>
    </div>
  );
}
