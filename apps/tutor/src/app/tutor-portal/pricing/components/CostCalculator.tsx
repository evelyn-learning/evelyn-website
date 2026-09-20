'use client';

import { useState } from 'react';
import { pricing, estimateMonthlyCost, type SessionMode } from '../../data/pricing';

const money = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CostCalculator() {
  const [students, setStudents] = useState(500);
  const [sessionsPerStudent, setSessionsPerStudent] = useState(4);
  const [avgMinutes, setAvgMinutes] = useState(25);
  const [mode, setMode] = useState<SessionMode>('voice');

  const result = estimateMonthlyCost(students, sessionsPerStudent, avgMinutes, mode);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-slate-900">Cost Calculator</h3>

      {/* Students */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Active students/month</label>
          <input
            type="number"
            value={students}
            onChange={(e) => setStudents(Math.max(1, Number(e.target.value)))}
            className="w-24 rounded-md border border-slate-200 px-3 py-1.5 text-right text-sm"
          />
        </div>
        <input
          type="range"
          min={10}
          max={10000}
          step={10}
          value={students}
          onChange={(e) => setStudents(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Sessions per student */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Sessions per student/month</label>
          <input
            type="number"
            value={sessionsPerStudent}
            onChange={(e) => setSessionsPerStudent(Math.max(1, Number(e.target.value)))}
            className="w-24 rounded-md border border-slate-200 px-3 py-1.5 text-right text-sm"
          />
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={sessionsPerStudent}
          onChange={(e) => setSessionsPerStudent(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Average session length */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Avg session length (min)</label>
          <input
            type="number"
            value={avgMinutes}
            onChange={(e) => setAvgMinutes(Math.max(1, Number(e.target.value)))}
            className="w-24 rounded-md border border-slate-200 px-3 py-1.5 text-right text-sm"
          />
        </div>
        <input
          type="range"
          min={5}
          max={60}
          value={avgMinutes}
          onChange={(e) => setAvgMinutes(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-slate-700" htmlFor="cost-calc-mode">Session mode</label>
        <select
          id="cost-calc-mode"
          value={mode}
          onChange={(e) => setMode(e.target.value as SessionMode)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm"
        >
          <option value="voice">Voice (${pricing.perMinuteUsd.toFixed(2)}/min)</option>
          <option value="text">Text-only (${pricing.textPerMinuteUsd.toFixed(2)}/min)</option>
        </select>
      </div>

      {/* Results */}
      <div className="rounded-xl bg-slate-50 p-5">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Total minutes/month</p>
            <p className="text-lg font-bold text-slate-900">{result.totalMinutes.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Rate</p>
            <p className="text-lg font-bold text-slate-900">${result.rate.toFixed(2)}/min</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Estimated monthly total</span>
            <span className="text-2xl font-bold text-slate-900">${money(result.cost)}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Per student: ${result.perStudent.toFixed(2)}/mo · no setup or platform fees
            {result.totalMinutes >= 50_000 ? ' · contact us for volume pricing at this scale' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
