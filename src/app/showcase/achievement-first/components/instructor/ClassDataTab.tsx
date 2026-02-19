'use client';

import React, { useState } from 'react';
import { useAFStore } from '../../store';
import { STANDARDS_MASTERY } from '../../data/standards-mastery';

export default function ClassDataTab() {
  const currentUser = useAFStore((s) => s.currentUser);
  const assignIntervention = useAFStore((s) => s.assignIntervention);
  const interventionAssignments = useAFStore((s) => s.interventionAssignments);
  const [assignedGroups, setAssignedGroups] = useState<Set<string>>(new Set());

  if (!currentUser) return null;

  const data = STANDARDS_MASTERY[currentUser.grade];
  if (!data) return null;

  const handleAssignGroup = (group: { name: string; students: string[] }) => {
    assignIntervention(group.name, group.students);
    setAssignedGroups((prev) => new Set(prev).add(group.name));
  };

  const getCellColor = (score: number | null) => {
    if (score === null) return 'bg-gray-100 text-gray-400';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Standards Mastery Heatmap */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Standards Mastery Heatmap</h2>
          <p className="text-xs text-gray-400 mt-0.5">Grade {currentUser.grade} &middot; CCSS Math Standards</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-2.5 px-4 font-medium text-gray-500 sticky left-0 bg-gray-50 z-10">Student</th>
                {data.standards.map((std) => (
                  <th key={std} className="py-2.5 px-3 font-medium text-gray-500 text-center whitespace-nowrap text-xs">
                    {std}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.students.map((student) => (
                <tr key={student.studentName} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-2 px-4 font-medium text-gray-800 whitespace-nowrap sticky left-0 bg-white z-10">
                    {student.studentName}
                  </td>
                  {data.standards.map((std) => {
                    const score = student.scores[std];
                    return (
                      <td key={std} className="py-2 px-3 text-center">
                        <span className={`inline-block w-12 py-1 rounded text-xs font-bold ${getCellColor(score)}`}>
                          {score === null ? '—' : `${score}%`}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Legend */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100" /> 80%+</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-100" /> 60-79%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100" /> &lt;60%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100" /> Not assessed</span>
        </div>
      </div>

      {/* Recent Exit Tickets */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Exit Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.exitTickets.map((ticket, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{ticket.lesson}</p>
                  <p className="text-xs text-gray-400">{ticket.date}</p>
                </div>
                <span className={`text-lg font-bold ${
                  ticket.classAvg >= 80 ? 'text-green-600' :
                  ticket.classAvg >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {ticket.classAvg}%
                </span>
              </div>
              <div className="space-y-1.5">
                {ticket.questionsBreakdown.map((q, qi) => (
                  <div key={qi} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-8">Q{qi + 1}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          q.percentCorrect >= 80 ? 'bg-green-500' :
                          q.percentCorrect >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${q.percentCorrect}%` }}
                      />
                    </div>
                    <span className="text-gray-600 font-medium w-8 text-right">{q.percentCorrect}%</span>
                  </div>
                ))}
              </div>
              {ticket.flaggedStudents.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {ticket.flaggedStudents.map((name) => (
                    <span key={name} className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-medium">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Intervention Groups */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">AF Recommended Intervention Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.interventionGroups.map((group) => {
            const isAssigned = assignedGroups.has(group.name) || interventionAssignments[group.name] !== undefined;
            return (
              <div key={group.name} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-gray-800">{group.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{group.focus}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.students.map((name) => (
                    <span key={name} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      {name}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 italic">{group.recommendedContent}</p>
                {isAssigned ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Assigned
                  </div>
                ) : (
                  <button
                    onClick={() => handleAssignGroup(group)}
                    className="w-full py-2 rounded-lg bg-[#003B71] text-white text-sm font-medium hover:bg-[#002a55] transition-colors"
                  >
                    Assign to Group
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
