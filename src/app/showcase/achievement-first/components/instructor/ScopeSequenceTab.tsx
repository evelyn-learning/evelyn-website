'use client';

import React, { useState } from 'react';
import { useAFStore } from '../../store';
import { SCOPE_SEQUENCE } from '../../data/scope-sequence';

export default function ScopeSequenceTab() {
  const currentUser = useAFStore((s) => s.currentUser);
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);

  if (!currentUser) return null;

  const cycles = SCOPE_SEQUENCE[currentUser.grade];
  if (!cycles) return null;

  const toggleCycle = (cycle: number) => {
    setExpandedCycle(expandedCycle === cycle ? null : cycle);
  };

  const statusIcon = (status: string) => {
    if (status === 'completed') return (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
    if (status === 'current') return (
      <div className="w-5 h-5 rounded-full border-2 border-[#F5A623] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
      </div>
    );
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  const statusBadge = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'current') return 'bg-[#F5A623]/20 text-[#F5A623]';
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Scope &amp; Sequence</h2>
          <p className="text-sm text-gray-500">Grade {currentUser.grade} &middot; 2025-2026 School Year</p>
        </div>
      </div>

      <div className="space-y-3">
        {cycles.map((cycle) => {
          const isExpanded = expandedCycle === cycle.cycle;
          const completedUnits = cycle.units.filter((u) => u.status === 'completed').length;
          const totalUnits = cycle.units.length;
          const hasCurrent = cycle.units.some((u) => u.status === 'current');

          return (
            <div key={cycle.cycle} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCycle(cycle.cycle)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    completedUnits === totalUnits ? 'bg-green-100 text-green-700' :
                    hasCurrent ? 'bg-[#F5A623]/20 text-[#F5A623]' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {cycle.cycle}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{cycle.name}</p>
                    <p className="text-xs text-gray-500">{cycle.dateRange} &middot; {completedUnits}/{totalUnits} units complete</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold">
                      Current
                    </span>
                  )}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 space-y-3 border-t border-gray-100 pt-3">
                  {cycle.units.map((unit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{statusIcon(unit.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm ${unit.status === 'upcoming' ? 'text-gray-400' : 'text-gray-800'}`}>
                            {unit.name}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge(unit.status)}`}>
                            {unit.status === 'completed' ? 'Complete' : unit.status === 'current' ? 'In Progress' : 'Upcoming'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{unit.weeks}</p>
                        {unit.lessons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {unit.lessons.map((lesson, li) => (
                              <span key={li} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]">
                                {lesson}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
