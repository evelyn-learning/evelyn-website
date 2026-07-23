'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { RayDiagramFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const W = 720;
const H = 320;
const AXIS_Y = 160;
const CENTER_X = 360;

export function CatalogRayDiagramRenderer({ figure }: { figure: RayDiagramFigure }) {
  const { optical, focalLength, objectDistance, objectHeight, title } = figure;
  // Use thin-lens / mirror equation to compute image distance/height.
  const isMirror = optical.endsWith('mirror');
  const isDiverging = optical === 'concave_lens' || optical === 'convex_mirror';
  const f = isDiverging ? -focalLength : focalLength;
  const u = objectDistance;
  // 1/f = 1/u + 1/v (using sign conventions)
  // For lens: positive f converging; v = positive on opposite side.
  // For simplicity use: v = (u * f) / (u - f) for lens, similar for concave mirror.
  let v: number;
  if (optical === 'plane_mirror') {
    v = -u; // virtual, behind mirror, same size, upright
  } else {
    v = (u * f) / (u - f);
  }
  const m = optical === 'plane_mirror' ? 1 : -v / u;
  const imgHeight = objectHeight * m;
  // Place object on the LEFT of the optical element.
  const ox = CENTER_X - u;
  const oy = AXIS_Y - objectHeight;
  // Image: lens places on right; mirror places on same side as object (negative v).
  const ix = isMirror ? CENTER_X + v : CENTER_X + v;
  const iy = AXIS_Y - imgHeight;
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]">
        {/* Principal axis */}
        <line x1={20} y1={AXIS_Y} x2={W - 20} y2={AXIS_Y} stroke="#9ca3af" strokeWidth={1.5} />
        {/* Optical element */}
        <OpticalElement optical={optical} cx={CENTER_X} cy={AXIS_Y} />
        {/* Focal points */}
        <circle cx={CENTER_X - focalLength} cy={AXIS_Y} r={3} fill="#374151" />
        <text x={CENTER_X - focalLength} y={AXIS_Y + 16} fontSize={11} textAnchor="middle" fill="#374151">F</text>
        <circle cx={CENTER_X + focalLength} cy={AXIS_Y} r={3} fill="#374151" />
        <text x={CENTER_X + focalLength} y={AXIS_Y + 16} fontSize={11} textAnchor="middle" fill="#374151">F</text>
        {/* Object arrow */}
        <line x1={ox} y1={AXIS_Y} x2={ox} y2={oy} stroke="#16a34a" strokeWidth={2.5} markerEnd="url(#ray-up)" />
        <text x={ox - 10} y={oy - 4} fontSize={12} fill="#16a34a" fontWeight={700} textAnchor="end">Obj</text>
        {/* Image arrow */}
        <line x1={ix} y1={AXIS_Y} x2={ix} y2={iy} stroke="#dc2626" strokeWidth={2.5} strokeDasharray={v > 0 ? '0' : '5 4'} markerEnd="url(#ray-img)" />
        <text x={ix + 10} y={iy + (imgHeight > 0 ? -4 : 12)} fontSize={12} fill="#dc2626" fontWeight={700}>Img</text>
        <defs>
          <marker id="ray-up" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#16a34a" />
          </marker>
          <marker id="ray-img" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 10 L 5 0 L 10 10 z" fill="#dc2626" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

function OpticalElement({ optical, cx, cy }: { optical: RayDiagramFigure['optical']; cx: number; cy: number }) {
  const h = 100;
  if (optical === 'plane_mirror') {
    return <line x1={cx} y1={cy - h} x2={cx} y2={cy + h} stroke="#1f2937" strokeWidth={4} />;
  }
  if (optical.endsWith('mirror')) {
    const concave = optical === 'concave_mirror';
    const dx = concave ? -10 : 10;
    return (
      <path d={`M ${cx + dx} ${cy - h} Q ${cx - dx} ${cy} ${cx + dx} ${cy + h}`} fill="none" stroke="#1f2937" strokeWidth={3} />
    );
  }
  // Lens
  const convex = optical === 'convex_lens';
  const w = 14;
  if (convex) {
    return (
      <path
        d={`M ${cx} ${cy - h} Q ${cx + w} ${cy} ${cx} ${cy + h} Q ${cx - w} ${cy} ${cx} ${cy - h} Z`}
        fill="rgba(59, 130, 246, 0.18)"
        stroke="#3b82f6"
        strokeWidth={2}
      />
    );
  }
  // concave lens: hourglass-ish
  return (
    <path
      d={`M ${cx - w} ${cy - h} Q ${cx} ${cy - h * 0.85} ${cx + w} ${cy - h} L ${cx + w} ${cy + h} Q ${cx} ${cy + h * 0.85} ${cx - w} ${cy + h} Z`}
      fill="rgba(59, 130, 246, 0.18)"
      stroke="#3b82f6"
      strokeWidth={2}
    />
  );
}
