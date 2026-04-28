'use client';

import React from 'react';
import type { BodySystemFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogBodySystemRenderer({ figure }: { figure: BodySystemFigure }) {
  const { system, parts, title } = figure;
  return (
    <div className="body-system-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <div className="text-sm text-gray-600 mb-3 capitalize">{system} system</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[640px]">
        {parts.map((p, i) => (
          <div key={i} className="p-3 rounded-lg bg-rose-50 border border-rose-200">
            <div className="font-semibold text-rose-900">{p.label}</div>
            {p.description && <div className="text-sm text-rose-700 mt-1">{p.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
