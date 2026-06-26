'use client';

import React from 'react';

/**
 * Shown in place of a rough sketch when the doodler abstains (the concept needs
 * precision a freehand doodle can't convey) or fails. A clean, student-facing
 * card built from the sketch's own title / concept / labels — so board-anchored
 * narration ("as you can see here…") always lands on something coherent instead
 * of a blank board or a misleading blob. NOT a debug/error surface.
 */
export function SketchFallbackCard({
  title,
  concept,
  labels,
}: {
  title?: string;
  concept?: string;
  labels?: string[];
}) {
  const heading = (title && title.trim()) || (concept && concept.trim()) || 'Key idea';
  const chips = (labels ?? []).map((l) => String(l).trim()).filter(Boolean);
  return (
    <div
      className="w-full max-w-[420px] rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
      data-feature="sketch"
      data-feature-label={heading}
    >
      <div className="text-center text-base font-semibold text-gray-800">{heading}</div>
      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {chips.map((c, i) => (
            <span
              key={i}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
