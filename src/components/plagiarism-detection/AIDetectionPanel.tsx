'use client';

import React from 'react';
import { AI_VERDICTS, getVerdict } from './constants';
import type { EnhancedAnalysisResult } from './types';

interface AIDetectionPanelProps {
  result: EnhancedAnalysisResult;
}

export default function AIDetectionPanel({ result }: AIDetectionPanelProps) {
  const { aiDetection } = result;
  const verdict = getVerdict(aiDetection.score, AI_VERDICTS);

  return (
    <div className={`p-5 rounded-xl border ${verdict.border} ${verdict.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">
          AI Writing Detection
        </h4>
        <span className="text-xs text-gray-500 cursor-help" title={`Raw score: ${aiDetection.score}%`}>
          Details
        </span>
      </div>

      {/* Plain-English Verdict */}
      <p className={`text-sm font-medium mb-3 ${verdict.color}`}>
        {verdict.label}
      </p>

      {/* Score bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${aiDetection.score}%`,
            backgroundColor: aiDetection.score <= 25 ? '#16a34a'
              : aiDetection.score <= 50 ? '#ca8a04'
              : aiDetection.score <= 75 ? '#ea580c'
              : '#dc2626',
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>Original</span>
        <span title={`AI Detection Score: ${aiDetection.score}%`} className="cursor-help">
          {aiDetection.score}%
        </span>
        <span>AI-Generated</span>
      </div>

      {/* Model Attribution */}
      {aiDetection.modelAttribution && (
        <div className="mb-3 px-3 py-2 bg-white/60 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-700 font-medium">{aiDetection.modelAttribution}</p>
        </div>
      )}

      {/* Indicators */}
      {aiDetection.indicators.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Indicators:</p>
          <ul className="space-y-1">
            {aiDetection.indicators.map((indicator, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-gray-400 mt-0.5">-</span>
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
