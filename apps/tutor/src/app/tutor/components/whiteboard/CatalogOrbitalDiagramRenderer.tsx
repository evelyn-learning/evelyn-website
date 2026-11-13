'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { orbitalDiagramFeatureNames, type OrbitalDiagramFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogOrbitalDiagramRenderer({ figure }: { figure: OrbitalDiagramFigure }) {
  const { element, Z, shells, title } = figure;
  const N = orbitalDiagramFeatureNames;
  // Many subshells (period 4-5 elements): smaller boxes so the whole ladder fits the board.
  const dense = shells.length > 7;
  const box = dense ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <div data-feature={N.orbital} data-feature-label={title || `${element} orbital diagram`} className="orbital-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <div data-feature={N.element} data-feature-label={`${element} (Z=${Z})`} className="text-sm text-gray-600 mb-3"><span className="font-semibold text-gray-800">{element}</span> · atomic number Z = {Z}</div>
      <div className={dense ? 'space-y-1.5' : 'space-y-3'}>
        {shells.map((sh, i) => (
          <div
            key={i}
            data-feature={N.shell(i)}
            data-feature-label={`${sh.subshell} shell`}
            className="flex items-center gap-3"
          >
            <div className="font-mono w-10 text-right text-gray-800 font-semibold">{sh.subshell}</div>
            <div className="flex gap-1">
              {sh.orbitals.map((orb, j) => (
                <div key={j} className={`${box} border border-gray-500 rounded-sm bg-white`}>
                  {/* Arrows drawn as strokes (font arrows render tiny and uneven). */}
                  <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
                    {orb.up && <path d="M 15 32 V 9 M 10.5 15 L 15 9 L 19.5 15" fill="none" stroke="#1d4ed8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />}
                    {orb.down && <path d="M 25 8 V 31 M 20.5 25 L 25 31 L 29.5 25" fill="none" stroke="#dc2626" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                </div>
              ))}
            </div>
            <div className="font-mono text-sm text-gray-500 w-10">{sh.subshell}<sup>{sh.orbitals.reduce((n, o) => n + (o.up ? 1 : 0) + (o.down ? 1 : 0), 0)}</sup></div>
          </div>
        ))}
      </div>
    </div>
  );
}
