'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { orbitalDiagramFeatureNames, type OrbitalDiagramFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogOrbitalDiagramRenderer({ figure }: { figure: OrbitalDiagramFigure }) {
  const { element, Z, shells, title } = figure;
  const N = orbitalDiagramFeatureNames;
  return (
    <div data-feature={N.orbital} data-feature-label={title || `${element} orbital diagram`} className="orbital-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <div data-feature={N.element} data-feature-label={`${element} (Z=${Z})`} className="text-sm text-gray-600 mb-3">{element} (Z = {Z})</div>
      <div className="space-y-3">
        {shells.map((sh, i) => (
          <div
            key={i}
            data-feature={N.shell(i)}
            data-feature-label={`${sh.subshell} shell`}
            className="flex items-center gap-3"
          >
            <div className="font-mono w-10 text-right text-gray-700">{sh.subshell}</div>
            <div className="flex gap-1">
              {sh.orbitals.map((orb, j) => (
                <div key={j} className="w-10 h-10 border border-gray-400 rounded-sm flex items-center justify-center bg-white">
                  <div className="flex flex-col items-center justify-between h-full py-1">
                    <span className="text-xs leading-none">{orb.up ? '↑' : ''}</span>
                    <span className="text-xs leading-none">{orb.down ? '↓' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
