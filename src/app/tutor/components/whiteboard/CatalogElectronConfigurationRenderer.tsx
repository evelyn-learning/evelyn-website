'use client';

import React from 'react';
import type { ElectronConfigurationFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogElectronConfigurationRenderer({ figure }: { figure: ElectronConfigurationFigure }) {
  const { element, Z, config, title } = figure;
  const notation = config.map((c) => `${c.subshell}${superscript(c.electrons)}`).join(' ');
  return (
    <div className="electron-config-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <div className="px-6 py-4 rounded-lg bg-blue-50 border border-blue-200">
        <div className="text-sm text-gray-600 mb-2">{element} (Z = {Z})</div>
        <div className="text-2xl font-mono text-gray-900">{notation}</div>
      </div>
    </div>
  );
}

function superscript(n: number): string {
  const map: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map((c) => map[c] || c).join('');
}
