'use client';

import React from 'react';
import { InlineMathText } from './InlineMathText';

/**
 * Phase 4.2 (humanlike-latency): shown in place of a CONTENT-BEARING render
 * (organizer diagram, tree) whose text was fine but whose structure failed
 * validation — so narration that references the board lands on the actual
 * content instead of a blank space. Sibling of SketchFallbackCard (the
 * doodler-abstain card); this one carries free text through the KaTeX
 * inline path. NOT a debug/error surface — student-facing.
 */
export function RenderFallbackCard({
  title,
  body,
}: {
  title?: string;
  body?: string;
}) {
  const heading = (title && title.trim()) || 'Key idea';
  return (
    <div
      className="w-full max-w-[460px] rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
      data-feature="fallback-card"
      data-feature-label={heading}
    >
      <div className="text-center text-base font-semibold text-gray-800">
        <InlineMathText text={heading} />
      </div>
      {body && body.trim() && (
        <div className="mt-3 text-center text-sm leading-relaxed text-gray-700">
          <InlineMathText text={body} />
        </div>
      )}
    </div>
  );
}
