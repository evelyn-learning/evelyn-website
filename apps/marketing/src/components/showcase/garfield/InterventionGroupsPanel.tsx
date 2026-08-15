'use client';

import React, { useState } from 'react';

export interface InterventionGroup {
  id: string;
  title: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  students: string[];
  standards: string[];
  standardsNote: string;
  rootMisconception?: string;
  recommendation: string;
  assignModalBody: string;
  tone: 'red' | 'amber' | 'green';
}

interface Props {
  highlightGroupId?: string | null;
}

const DEFAULT_GROUPS: InterventionGroup[] = [
  {
    id: 'systems-foundations',
    title: 'Systems of Equations: Foundations',
    priority: 'HIGH',
    students: [
      'Brantley Miller',
      'Cache Williams',
      'Hunter Davis',
      'Kyle Hansen',
    ],
    standards: ['8.EE.C.8'],
    standardsNote: 'all below 50%',
    rootMisconception:
      'Struggles to translate word problems into two-variable equations.',
    recommendation:
      '3 sessions × 20 minutes. Start with the visual graphing method before moving to algebraic substitution. First session built around word-problem translation, not arithmetic.',
    assignModalBody:
      'Intervention assigned. Students will see 3 practice sets on their Chromebooks at next login. Homework Helper will prioritize systems-of-equations word problems for these students for the next two weeks.',
    tone: 'red',
  },
  {
    id: 'linear-gap-fill',
    title: 'Linear Functions Gap-Fill',
    priority: 'MEDIUM',
    students: ['Addison Clark', 'Haylee Peterson', 'Jaxon Wilson'],
    standards: ['8.F.B.4'],
    standardsNote: '55–65% — strong elsewhere, stuck here',
    rootMisconception:
      'Reads rate of change from tables but cannot translate it into a complete equation.',
    recommendation:
      '2 sessions × 15 minutes on constructing equations from tables and from two points. Pair-work recommended — these three are close enough in skill to teach each other.',
    assignModalBody:
      'Intervention assigned. Two practice sets scheduled across the next 5 school days. Progress shows on the heatmap as cells update.',
    tone: 'amber',
  },
  {
    id: 'enrichment',
    title: 'Enrichment: Ready for Algebra I prep',
    priority: 'LOW',
    students: ['Emma Taylor', 'Kennedy Smith', 'Olivia Martinez'],
    standards: ['all standards'],
    standardsNote: 'above 85% across the board',
    recommendation:
      'Challenge problem set: systems with three variables, real-world modeling, and a few SAT-style questions to stretch into Algebra I territory.',
    assignModalBody:
      'Enrichment assigned. Students will see an optional challenge set on their Chromebooks — they can work through it at their own pace. Will not affect their current grade.',
    tone: 'green',
  },
];

function toneStyles(tone: InterventionGroup['tone']) {
  switch (tone) {
    case 'red':
      return {
        bg: '#FEF2F2',
        border: '#FECACA',
        accent: '#8B1A1A',
        badgeBg: '#8B1A1A',
      };
    case 'amber':
      return {
        bg: '#FFFBEB',
        border: '#FDE68A',
        accent: '#B45309',
        badgeBg: '#B45309',
      };
    case 'green':
      return {
        bg: '#F0FDF4',
        border: '#BBF7D0',
        accent: '#15803D',
        badgeBg: '#15803D',
      };
  }
}

export default function InterventionGroupsPanel({ highlightGroupId }: Props) {
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [modalGroup, setModalGroup] = useState<InterventionGroup | null>(null);

  const handleAssign = (group: InterventionGroup) => {
    setModalGroup(group);
  };

  const confirmAssign = () => {
    if (modalGroup) {
      setAssignedIds((prev) => new Set(prev).add(modalGroup.id));
    }
    setModalGroup(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Auto-generated intervention groups
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Pulled from the heatmap. Review, adjust, and assign — students see
          targeted practice at next login.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_GROUPS.map((group) => {
          const s = toneStyles(group.tone);
          const assigned = assignedIds.has(group.id);
          const highlighted = highlightGroupId === group.id;

          return (
            <div
              key={group.id}
              className={`rounded-xl border p-5 flex flex-col transition-all ${
                highlighted ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                backgroundColor: s.bg,
                borderColor: s.border,
                ['--tw-ring-color' as string]: s.accent,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  {group.title}
                </h4>
                {group.priority && (
                  <span
                    className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full tracking-wide flex-shrink-0 ml-2"
                    style={{ backgroundColor: s.badgeBg }}
                  >
                    {group.priority}
                  </span>
                )}
              </div>

              <div className="text-xs font-medium text-gray-600 mb-3">
                {group.standards.join(', ')} · {group.standardsNote}
              </div>

              <div className="mb-3">
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Students
                </div>
                <ul className="space-y-0.5">
                  {group.students.map((name) => (
                    <li key={name} className="text-xs text-gray-800">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>

              {group.rootMisconception && (
                <div className="mb-3">
                  <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Root misconception
                  </div>
                  <div className="text-xs text-gray-700 leading-snug">
                    {group.rootMisconception}
                  </div>
                </div>
              )}

              <div className="mb-4 flex-1">
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Recommended
                </div>
                <div className="text-xs text-gray-700 leading-snug">
                  {group.recommendation}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAssign(group)}
                disabled={assigned}
                className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-60"
                style={{ backgroundColor: s.accent }}
              >
                {assigned ? '✓ Intervention assigned' : 'Assign intervention'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Assign confirmation modal */}
      {modalGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setModalGroup(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: toneStyles(modalGroup.tone).bg }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke={toneStyles(modalGroup.tone).accent}
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              {modalGroup.title}
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {modalGroup.assignModalBody}
            </p>
            <div className="text-xs text-gray-500 mb-4">
              Students: {modalGroup.students.join(', ')}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setModalGroup(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAssign}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: toneStyles(modalGroup.tone).accent }}
              >
                Confirm assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
