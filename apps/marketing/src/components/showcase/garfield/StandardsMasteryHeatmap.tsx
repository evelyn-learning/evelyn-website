'use client';

import React, { useMemo, useState } from 'react';
import {
  ROSTER,
  getCell,
  getMasteryGrid,
  getClassAverage,
  getStandardAverage,
  getWeakestStandardIdx,
  getAtRiskCount,
} from '@/data/garfield/classroom';
import { GRADE_8_UTAH_STANDARDS } from '@/data/garfield/standards';

export interface CellCoord {
  studentIdx: number;
  standardIdx: number;
}

interface Props {
  pulseCell?: CellCoord | null;
  cellOverrides?: Record<string, number>; // key = "studentIdx:standardIdx"
}

function masteryColor(mastery: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (mastery >= 80) {
    return { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' };
  }
  if (mastery >= 60) {
    return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' };
  }
  return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' };
}

export default function StandardsMasteryHeatmap({
  pulseCell,
  cellOverrides,
}: Props) {
  const [selected, setSelected] = useState<CellCoord | null>(null);
  const [hovered, setHovered] = useState<CellCoord | null>(null);

  const grid = useMemo(() => getMasteryGrid(), []);

  // Apply any external overrides (e.g. after exit ticket update)
  const effectiveGrid = useMemo(() => {
    if (!cellOverrides || Object.keys(cellOverrides).length === 0) return grid;
    const next = grid.map((row) => [...row]);
    Object.entries(cellOverrides).forEach(([key, value]) => {
      const [s, c] = key.split(':').map(Number);
      if (Number.isFinite(s) && Number.isFinite(c)) {
        next[s][c] = value;
      }
    });
    return next;
  }, [grid, cellOverrides]);

  const classAvg = useMemo(() => {
    const all = effectiveGrid.flat();
    return Math.round(all.reduce((a, b) => a + b, 0) / all.length);
  }, [effectiveGrid]);

  const weakestIdx = getWeakestStandardIdx();
  const weakestAvg = getStandardAverage(weakestIdx);
  const atRisk = getAtRiskCount();

  const selectedCell = selected
    ? getCell(selected.studentIdx, selected.standardIdx)
    : null;
  const selectedStudent = selected ? ROSTER[selected.studentIdx] : null;
  const selectedStandard = selected
    ? GRADE_8_UTAH_STANDARDS[selected.standardIdx]
    : null;
  const selectedMastery =
    selected !== null
      ? effectiveGrid[selected.studentIdx][selected.standardIdx]
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Class-level summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Class average
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {classAvg}%
          </div>
          <div className="text-xs text-gray-500">mastery across all standards</div>
        </div>
        <div
          className="rounded-xl p-4 border"
          style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
        >
          <div
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: '#8B1A1A' }}
          >
            Top struggle standard
          </div>
          <div className="mt-1 text-lg font-bold text-gray-900">
            {GRADE_8_UTAH_STANDARDS[weakestIdx].code}
          </div>
          <div className="text-xs text-gray-700">
            {GRADE_8_UTAH_STANDARDS[weakestIdx].shortLabel} ·{' '}
            <span className="font-semibold" style={{ color: '#8B1A1A' }}>
              {weakestAvg}% class avg
            </span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            At-risk students
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{atRisk}</div>
          <div className="text-xs text-gray-500">
            below 60% on 3+ standards
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Heatmap grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Column headers */}
            <div className="flex">
              <div className="w-40 flex-shrink-0" />
              {GRADE_8_UTAH_STANDARDS.map((std) => (
                <div
                  key={std.code}
                  className="w-20 flex-shrink-0 px-1 pb-2 text-center"
                >
                  <div className="text-[10px] font-semibold text-gray-800 leading-tight">
                    {std.code}
                  </div>
                  <div className="text-[9px] text-gray-500 leading-tight mt-0.5">
                    {std.shortLabel}
                  </div>
                </div>
              ))}
            </div>

            {/* Student rows */}
            {ROSTER.map((student, sIdx) => (
              <div key={student.id} className="flex items-center">
                <div
                  className="w-40 flex-shrink-0 pr-3 py-1 text-xs font-medium text-gray-700 truncate"
                  title={student.name}
                >
                  {student.name}
                </div>
                {GRADE_8_UTAH_STANDARDS.map((std, cIdx) => {
                  const mastery = effectiveGrid[sIdx][cIdx];
                  const color = masteryColor(mastery);
                  const isHovered =
                    hovered?.studentIdx === sIdx &&
                    hovered?.standardIdx === cIdx;
                  const isPulsing =
                    pulseCell?.studentIdx === sIdx &&
                    pulseCell?.standardIdx === cIdx;
                  const isSelected =
                    selected?.studentIdx === sIdx &&
                    selected?.standardIdx === cIdx;

                  return (
                    <button
                      key={`${student.id}-${std.code}`}
                      type="button"
                      aria-label={`${student.name} — ${std.code}: ${mastery}%`}
                      onClick={() =>
                        setSelected({ studentIdx: sIdx, standardIdx: cIdx })
                      }
                      onMouseEnter={() =>
                        setHovered({ studentIdx: sIdx, standardIdx: cIdx })
                      }
                      onMouseLeave={() => setHovered(null)}
                      className={`w-20 h-8 mx-0.5 my-0.5 rounded border flex items-center justify-center text-[11px] font-semibold transition-all ${
                        isPulsing ? 'garfield-pulse' : ''
                      } ${isSelected ? 'ring-2 ring-offset-1' : ''}`}
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                        borderColor: color.border,
                        ...(isSelected
                          ? ({
                              // ring color via outline since we can't use tailwind arbitrary with inline style easily
                            } as React.CSSProperties)
                          : {}),
                      }}
                    >
                      {isHovered ? `${mastery}%` : ''}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-4 h-4 rounded border"
                  style={{ backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }}
                />
                ≥ 80%
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-4 h-4 rounded border"
                  style={{ backgroundColor: '#FEF3C7', borderColor: '#FCD34D' }}
                />
                60–79%
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-4 h-4 rounded border"
                  style={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }}
                />
                &lt; 60%
              </div>
              <div className="ml-auto text-gray-400">
                Click any cell for misconception detail.
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <aside
          className={`w-80 flex-shrink-0 rounded-xl border border-gray-200 p-5 transition-opacity ${
            selected ? 'opacity-100' : 'opacity-60'
          }`}
          style={{ backgroundColor: '#FAFAF8' }}
        >
          {selected && selectedCell && selectedStudent && selectedStandard ? (
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {selectedStandard.code}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedStandard.shortLabel}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-700 text-lg leading-none"
                  aria-label="Close panel"
                >
                  ×
                </button>
              </div>
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="text-sm font-medium text-gray-800">
                  {selectedStudent.name}
                </div>
                <div
                  className="mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold"
                  style={{
                    backgroundColor: masteryColor(selectedMastery).bg,
                    color: masteryColor(selectedMastery).text,
                  }}
                >
                  {selectedMastery}% mastery
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                  Likely misconception
                </div>
                <div className="text-sm text-gray-800 leading-relaxed">
                  {selectedCell.misconception ||
                    (selectedMastery >= 80
                      ? 'Demonstrating mastery. No active misconception detected — consider enrichment.'
                      : 'Mixed performance. Recommend a short diagnostic to localize the gap.')}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                Sourced from exit tickets, practice sets, and last benchmark.
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Click a cell in the heatmap to see the specific misconception
              driving the gap for that student on that standard.
            </div>
          )}
        </aside>
      </div>

      {/* Pulse animation keyframes */}
      <style jsx>{`
        :global(.garfield-pulse) {
          animation: garfieldPulse 1.2s ease-out 3;
        }
        @keyframes garfieldPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(139, 26, 26, 0.6);
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 0 8px rgba(139, 26, 26, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(139, 26, 26, 0);
          }
        }
      `}</style>
    </div>
  );
}
