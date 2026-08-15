'use client';

import React from 'react';
import { PLAGIARISM_VERDICTS, getVerdict } from './constants';
import type { EnhancedAnalysisResult } from './types';

interface PlagiarismPanelProps {
  result: EnhancedAnalysisResult;
}

export default function PlagiarismPanel({ result }: PlagiarismPanelProps) {
  const { plagiarism } = result;
  const verdict = getVerdict(plagiarism.score, PLAGIARISM_VERDICTS);

  return (
    <div className={`p-5 rounded-xl border ${verdict.border} ${verdict.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-lg">&#128269;</span>
          Plagiarism Detection
        </h4>
        <span className="text-xs text-gray-500 cursor-help" title={`Raw score: ${plagiarism.score}%`}>
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
            width: `${plagiarism.score}%`,
            backgroundColor: plagiarism.score <= 15 ? '#16a34a'
              : plagiarism.score <= 35 ? '#ca8a04'
              : plagiarism.score <= 60 ? '#ea580c'
              : '#dc2626',
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>Original</span>
        <span title={`Plagiarism Score: ${plagiarism.score}%`} className="cursor-help">
          {plagiarism.score}%
        </span>
        <span>Copied</span>
      </div>

      {/* Copyscape overall match indicator */}
      {plagiarism.copyscapePercent != null && plagiarism.copyscapePercent > 0 && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-xs font-medium text-blue-700">
            Web Search: {plagiarism.copyscapePercent}% of text matched online sources
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            Web Match
          </span>
        </div>
      )}

      {/* Source Matches */}
      {plagiarism.sourceMatches.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Source Matches:</p>
          <div className="space-y-2">
            {plagiarism.sourceMatches.map((match, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 bg-white/60 rounded-lg border ${
                  match.verified ? 'border-blue-300 bg-blue-50/40' : 'border-orange-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-gray-800 truncate flex-1">
                    {match.title}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {match.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Web Match
                      </span>
                    )}
                    <span className={`text-xs font-semibold ${match.verified ? 'text-blue-600' : 'text-orange-600'}`}>
                      {match.matchPercent}%
                    </span>
                  </div>
                </div>
                {match.url && (
                  <a
                    href={match.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-600 truncate block mt-0.5 hover:underline"
                  >
                    {match.url}
                  </a>
                )}
                {match.verified && match.snippetText && (
                  <p className="text-xs text-gray-500 mt-1.5 italic border-l-2 border-blue-200 pl-2 line-clamp-2">
                    &ldquo;{match.snippetText}&rdquo;
                  </p>
                )}
                {match.verified && match.wordsMatched != null && match.wordsMatched > 0 && (
                  <p className="text-[10px] text-gray-400 mt-1">{match.wordsMatched} words matched</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {plagiarism.sourceMatches.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          No source matches found. Web search and pattern analysis found no plagiarism indicators.
        </p>
      )}
    </div>
  );
}
