'use client';

import React from 'react';
import type { WaveFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

export function CatalogWaveDiagramRenderer({ figure }: { figure: WaveFigure }) {
  const { amplitude, wavelength, cycles, showAmplitude, showWavelength, title } = figure;
  const W = 640;
  const H = 280;
  const PAD = 40;
  const cy = H / 2;
  const ampPx = 70;
  const totalW = W - PAD * 2;
  const wavelengthPx = totalW / cycles;
  const points: string[] = [];
  const N = 200;
  for (let i = 0; i <= N; i++) {
    const x = PAD + (i / N) * totalW;
    const phase = ((i / N) * cycles) * 2 * Math.PI;
    const y = cy - ampPx * Math.sin(phase);
    points.push(`${x},${y}`);
  }
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        {/* Axis */}
        <line x1={PAD} y1={cy} x2={W - PAD} y2={cy} stroke="#9ca3af" strokeWidth={1.5} />
        {/* Wave */}
        <polyline points={points.join(' ')} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
        {/* Amplitude annotation */}
        {showAmplitude && (
          <g>
            <line x1={PAD + wavelengthPx * 0.25} y1={cy} x2={PAD + wavelengthPx * 0.25} y2={cy - ampPx} stroke="#dc2626" strokeWidth={2} markerEnd="url(#amp-arr)" markerStart="url(#amp-arr)" />
            <text x={PAD + wavelengthPx * 0.25 + 8} y={cy - ampPx / 2} fontSize={13} fill="#dc2626" fontWeight={700}>
              A = {amplitude}
            </text>
          </g>
        )}
        {/* Wavelength annotation */}
        {showWavelength && (
          <g>
            <line x1={PAD} y1={cy + ampPx + 16} x2={PAD + wavelengthPx} y2={cy + ampPx + 16} stroke="#16a34a" strokeWidth={2} markerEnd="url(#wl-arr)" markerStart="url(#wl-arr)" />
            <text x={PAD + wavelengthPx / 2} y={cy + ampPx + 36} fontSize={13} textAnchor="middle" fill="#16a34a" fontWeight={700}>
              λ = {wavelength}
            </text>
          </g>
        )}
        <defs>
          <marker id="amp-arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
          </marker>
          <marker id="wl-arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
