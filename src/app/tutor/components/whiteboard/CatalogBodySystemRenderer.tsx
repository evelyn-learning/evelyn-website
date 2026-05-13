'use client';

import React from 'react';
import { bodySystemFeatureNames, type BodySystemFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogBodySystemRenderer({ figure }: { figure: BodySystemFigure }) {
  const { system, parts, title } = figure;
  const N = bodySystemFeatureNames;
  return (
    <div className="body-system-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      {/* Subtitle is intentionally suppressed when the title already
          mentions the system — observed 2026-05-13 session #14 image #49:
          title "The Digestive System" + subtitle "Digestive System" read
          as duplicate labels stacked above each other. Heuristic: hide
          the auto subtitle when the title (case-insensitive) contains
          the system name. */}
      {(!title || !title.toLowerCase().includes(system.toLowerCase())) && (
        <div className="text-sm text-gray-600 mb-3 capitalize">{system} system</div>
      )}
      <div data-feature={N.system} data-feature-label={`${system} system`} className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[640px]">
        {parts.map((p, i) => (
          <div
            key={i}
            data-feature={N.part(i)}
            data-feature-label={p.label}
            className="p-3 rounded-lg bg-rose-50 border border-rose-200"
          >
            <div className="font-semibold text-rose-900">{p.label}</div>
            {p.description && <div className="text-sm text-rose-700 mt-1">{p.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
