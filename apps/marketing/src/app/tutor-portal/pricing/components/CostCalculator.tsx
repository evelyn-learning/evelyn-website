'use client';

import { useState } from 'react';
import { pricingTiers, volumeDiscounts, platformFees, launchPromo, calculateMonthlyCost } from '../../data/pricing';

export function CostCalculator() {
  const [students, setStudents] = useState(500);
  const [sessionsPerStudent, setSessionsPerStudent] = useState(4);
  const [avgMinutes, setAvgMinutes] = useState(25);
  const [tierIndex, setTierIndex] = useState(0);
  const [usePromo, setUsePromo] = useState(true);

  const tier = pricingTiers[tierIndex];
  const result = calculateMonthlyCost(students, sessionsPerStudent, avgMinutes, tier, usePromo);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-slate-900">Cost Calculator</h3>

      {/* Engine selector */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">Engine Tier</label>
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {pricingTiers.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setTierIndex(i)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tierIndex === i
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Promo toggle */}
      <div className="mb-5 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Launch Partner pricing</label>
        <button
          onClick={() => setUsePromo(!usePromo)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            usePromo ? 'bg-blue-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              usePromo ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

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

      {/* Results */}
      <div className="rounded-xl bg-slate-50 p-5">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Total minutes/month</p>
            <p className="text-lg font-bold text-slate-900">{result.totalMinutes.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Rate</p>
            <p className="text-lg font-bold text-slate-900">${tier.costPerMinute.toFixed(2)}/min</p>
          </div>
        </div>

        {result.discount > 0 && (
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-600">Volume discount</span>
            <span className="font-medium text-green-600">
              -{((result.discount / result.grossCost) * 100).toFixed(0)}% (-${result.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </span>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-slate-600">Platform fee{usePromo ? ' (promo)' : ''}</span>
          <span className="text-slate-700">
            ${result.platformFee}/mo
            {usePromo && <span className="ml-1 text-xs text-slate-400 line-through">${platformFees.monthly}</span>}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Estimated monthly total</span>
            <span className="text-2xl font-bold text-slate-900">
              ${(result.netCost + result.platformFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {volumeDiscounts.find((d) => d.discount === null && result.totalMinutes >= d.minMinutes)
              ? 'Contact us for custom pricing at this volume.'
              : `Per student: $${((result.netCost + result.platformFee) / students).toFixed(2)}/mo`}
          </p>
        </div>
      </div>
    </div>
  );
}
