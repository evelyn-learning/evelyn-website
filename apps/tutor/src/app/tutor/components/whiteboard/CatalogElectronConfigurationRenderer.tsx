'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { electronConfigurationFeatureNames, type ElectronConfigurationFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

// Noble-gas cores: [symbol, Z, number of leading subshells in filling order].
const CORES: Array<[string, number, number]> = [['Kr', 36, 8], ['Ar', 18, 5], ['Ne', 10, 3], ['He', 2, 1]];

export function CatalogElectronConfigurationRenderer({ figure }: { figure: ElectronConfigurationFigure }) {
  const { element, Z, config, title } = figure;
  const N = electronConfigurationFeatureNames;
  const core = CORES.find(([, z, n]) => Z > z && config.length > n);
  // Long configurations step the type down so the notation stays on one or two tidy lines.
  const size = config.length > 8 ? 'text-xl' : 'text-2xl';
  return (
    <div className="electron-config-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <div data-feature={N.notation} data-feature-label={title || `${element} configuration`} className="px-6 py-4 rounded-lg bg-blue-50 border border-blue-200 max-w-full">
        <div data-feature={N.element} data-feature-label={`${element} (Z=${Z})`} className="text-sm text-gray-600 mb-2">
          <span className="font-semibold text-gray-800">{element}</span> · atomic number Z = {Z}
        </div>
        <div className={`${size} font-mono text-gray-900 flex gap-x-3 gap-y-1 flex-wrap`}>
          {config.map((c, i) => (
            <span key={i} className="whitespace-nowrap" data-feature={N.subshell(i)} data-feature-label={`${c.subshell} (${c.electrons}e⁻)`}>
              {c.subshell}<sup className="text-[0.62em] text-blue-700 font-semibold">{c.electrons}</sup>
            </span>
          ))}
        </div>
        {core && (
          <div className="mt-3 pt-2 border-t border-blue-200 text-sm text-gray-600">
            Short form:{' '}
            <span className="font-mono text-base text-gray-900">
              [{core[0]}]
              {config.slice(core[2]).map((c, i) => (
                <span key={i} className="whitespace-nowrap">{' '}{c.subshell}<sup className="text-[0.66em] text-blue-700 font-semibold">{c.electrons}</sup></span>
              ))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
