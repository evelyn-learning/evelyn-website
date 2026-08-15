'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { electronConfigurationFeatureNames, type ElectronConfigurationFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogElectronConfigurationRenderer({ figure }: { figure: ElectronConfigurationFigure }) {
  const { element, Z, config, title } = figure;
  const N = electronConfigurationFeatureNames;
  return (
    <div className="electron-config-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <div data-feature={N.notation} data-feature-label={title || `${element} configuration`} className="px-6 py-4 rounded-lg bg-blue-50 border border-blue-200">
        <div data-feature={N.element} data-feature-label={`${element} (Z=${Z})`} className="text-sm text-gray-600 mb-2">{element} (Z = {Z})</div>
        <div className="text-2xl font-mono text-gray-900 inline-flex gap-2 flex-wrap">
          {config.map((c, i) => (
            <span key={i} data-feature={N.subshell(i)} data-feature-label={`${c.subshell} (${c.electrons}e⁻)`}>
              {c.subshell}{superscript(c.electrons)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function superscript(n: number): string {
  const map: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map((c) => map[c] || c).join('');
}
