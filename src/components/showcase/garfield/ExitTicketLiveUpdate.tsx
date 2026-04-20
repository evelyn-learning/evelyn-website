'use client';

import React, { useCallback, useState } from 'react';
import { CellCoord } from './StandardsMasteryHeatmap';

interface Props {
  onPulse: (coord: CellCoord) => void;
  onCellOverride: (key: string, value: number) => void;
  onInterventionAdded: () => void;
  // Cache Williams is student index 3, 8.EE.C.8 is standard index 3
  targetStudentIdx?: number;
  targetStandardIdx?: number;
  targetStudentName?: string;
  targetNewMastery?: number;
}

type Stage = 'idle' | 'submitted' | 'heatmap-updated' | 'intervention-added';

export default function ExitTicketLiveUpdate({
  onPulse,
  onCellOverride,
  onInterventionAdded,
  targetStudentIdx = 3,
  targetStandardIdx = 3,
  targetStudentName = 'Cache Williams',
  targetNewMastery = 18,
}: Props) {
  const [stage, setStage] = useState<Stage>('idle');
  const [running, setRunning] = useState(false);

  const play = useCallback(() => {
    if (running) return;
    setRunning(true);
    setStage('submitted');

    setTimeout(() => {
      setStage('heatmap-updated');
      onPulse({
        studentIdx: targetStudentIdx,
        standardIdx: targetStandardIdx,
      });
      onCellOverride(
        `${targetStudentIdx}:${targetStandardIdx}`,
        targetNewMastery
      );
    }, 2000);

    setTimeout(() => {
      setStage('intervention-added');
      onInterventionAdded();
    }, 3800);

    setTimeout(() => {
      setRunning(false);
    }, 4400);
  }, [
    running,
    onPulse,
    onCellOverride,
    onInterventionAdded,
    targetStudentIdx,
    targetStandardIdx,
    targetNewMastery,
  ]);

  const replay = () => {
    setStage('idle');
    setTimeout(play, 100);
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: '#FAFAF8', borderColor: '#E5E7EB' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            On-the-go monitoring
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            A 5-question exit ticket comes in mid-period. Watch the mastery
            layer, the heatmap, and the intervention queue update in the same
            breath.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={stage === 'idle' ? play : replay}
            disabled={running}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#8B1A1A' }}
          >
            {running
              ? 'Running...'
              : stage === 'idle'
                ? '▶ Play animation'
                : '↻ Replay'}
          </button>
        </div>
      </div>

      {/* Animation timeline */}
      <div className="space-y-3">
        {/* Step 1: Exit ticket submitted */}
        <div
          className={`rounded-xl border p-4 transition-all duration-500 ${
            stage === 'idle'
              ? 'opacity-40 translate-y-0'
              : 'opacity-100 translate-y-0'
          }`}
          style={{
            backgroundColor: '#FFFFFF',
            borderColor:
              stage === 'idle' ? '#E5E7EB' : '#8B1A1A',
            borderWidth: 1,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor: stage === 'idle' ? '#CBD5E1' : '#8B1A1A',
              }}
            >
              1
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Exit ticket submitted
              </div>
              <div className="text-sm font-semibold text-gray-900 mt-0.5">
                {targetStudentName} — 8.EE.C.8 Systems of Equations — 2 of 5
                correct
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Missed: word-problem translation (Q2, Q4, Q5)
              </div>
            </div>
            {stage !== 'idle' && (
              <span className="text-xs text-gray-400">just now</span>
            )}
          </div>
        </div>

        {/* Step 2: Heatmap updated */}
        <div
          className={`rounded-xl border p-4 transition-all duration-500 ${
            stage === 'idle' || stage === 'submitted'
              ? 'opacity-40 translate-y-0'
              : 'opacity-100 translate-y-0'
          }`}
          style={{
            backgroundColor: '#FFFFFF',
            borderColor:
              stage === 'idle' || stage === 'submitted'
                ? '#E5E7EB'
                : '#FCA5A5',
            borderWidth: 1,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor:
                  stage === 'idle' || stage === 'submitted'
                    ? '#CBD5E1'
                    : '#DC2626',
              }}
            >
              2
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Mastery model updated
              </div>
              <div className="text-sm font-semibold text-gray-900 mt-0.5">
                Cell pulses red — {targetStudentName} × 8.EE.C.8 drops to{' '}
                {targetNewMastery}%
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Signal weighted with prior practice and last benchmark.
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Intervention group */}
        <div
          className={`rounded-xl border p-4 transition-all duration-500 ${
            stage === 'intervention-added'
              ? 'opacity-100 translate-y-0'
              : 'opacity-40 translate-y-0'
          }`}
          style={{
            backgroundColor:
              stage === 'intervention-added' ? '#FFF7ED' : '#FFFFFF',
            borderColor:
              stage === 'intervention-added' ? '#FB923C' : '#E5E7EB',
            borderWidth: 1,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor:
                  stage === 'intervention-added' ? '#EA580C' : '#CBD5E1',
              }}
            >
              3
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Intervention queue
              </div>
              <div className="text-sm font-semibold text-gray-900 mt-0.5">
                {targetStudentName} now qualifies for the Systems of Equations
                re-teach group
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                See group below — review and assign when you&apos;re ready.
              </div>
            </div>
            {stage === 'intervention-added' && (
              <span className="text-xs font-semibold" style={{ color: '#EA580C' }}>
                NEW
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 italic">
        No dashboard-hopping. No end-of-day export. The model moves with your
        classroom.
      </div>
    </div>
  );
}
