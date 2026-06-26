'use client';

import React from 'react';
import {
  solidOfRevolutionFeatureNames,
  type SolidOfRevolutionFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/solid-of-revolution';

const BLUE = '#2563eb';
const FILL = '#3b82f6';
const RED = '#dc2626';
const AX = '#475569';

/** Linear-interpolate the radius at along-coord u from a sorted profile. */
function radiusAt(prof: Array<[number, number]>, u: number): number {
  if (u <= prof[0][0]) return prof[0][1];
  if (u >= prof[prof.length - 1][0]) return prof[prof.length - 1][1];
  for (let i = 1; i < prof.length; i++) {
    if (u <= prof[i][0]) {
      const [u0, r0] = prof[i - 1];
      const [u1, r1] = prof[i];
      const t = (u - u0) / (u1 - u0 || 1);
      return r0 + t * (r1 - r0);
    }
  }
  return prof[prof.length - 1][1];
}

export function CatalogSolidOfRevolutionRenderer({ figure }: { figure: SolidOfRevolutionFigure }) {
  const N = solidOfRevolutionFeatureNames;
  const { outer, inner, axis, method, a, b, representativeAt: rep } = figure;
  const W = 600;
  const H = 430;
  const PERSP = 11; // minor axis of the perspective cross-section ellipses

  const rMax = Math.max(
    ...outer.map((p) => p[1]),
    ...(inner ? inner.map((p) => p[1]) : [0]),
    0.0001,
  );
  const horizontal = axis === 'x';
  // along-axis pixel span + radius pixel scale
  const alongMin = horizontal ? 80 : H - 70;
  const alongMax = horizontal ? W - 50 : 70;
  const Yc = 210; // axis line (horizontal case)
  const Xc = 300; // axis line (vertical case)
  const scaleR = 140 / rMax;

  /** Screen point for along-coord u and SIGNED radius rr (rr>0 = above/right of axis). */
  const pt = (u: number, rr: number): [number, number] => {
    const t = (u - a) / (b - a || 1);
    if (horizontal) return [alongMin + t * (alongMax - alongMin), Yc - scaleR * rr];
    return [Xc + scaleR * rr, alongMin + t * (alongMax - alongMin)];
  };
  /** A cross-section ellipse (the revolved circle seen in perspective). */
  const ring = (u: number, r: number, props: React.SVGProps<SVGEllipseElement> & { key?: React.Key }) => {
    const [cx, cy] = pt(u, 0);
    const rx = horizontal ? PERSP : scaleR * r;
    const ry = horizontal ? scaleR * r : PERSP;
    const { key, ...rest } = props;
    return <ellipse key={key} cx={cx} cy={cy} rx={rx} ry={ry} {...rest} />;
  };
  /** Polyline along a profile at signed-radius multiplier sign (±1). */
  const profilePath = (prof: Array<[number, number]>, sign: number) =>
    prof.map(([u, r], i) => `${i ? 'L' : 'M'} ${pt(u, sign * r).join(' ')}`).join(' ');

  // Solid silhouette outline (outer top + bottom).
  const topPath = profilePath(outer, 1);
  const botPath = profilePath(outer, -1);
  const bodyFill = `${topPath} ${profilePath([...outer].reverse(), -1).replace('M', 'L')} Z`;

  const ringUs = Array.from({ length: 5 }, (_, i) => a + ((i + 1) / 6) * (b - a));
  const rRep = radiusAt(outer, rep);
  const rRepIn = inner ? radiusAt(inner, rep) : 0;

  const [axA] = [pt(a, 0)];
  const axisStart = horizontal ? [alongMin - 24, Yc] : [Xc, alongMin + 24];
  const axisEnd = horizontal ? [alongMax + 18, Yc] : [Xc, alongMax - 18];

  return (
    <div className="solid-of-revolution-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[600px]"
        data-feature={N.solid}
        data-feature-label={figure.title || 'solid of revolution'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="sor-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={AX} />
          </marker>
        </defs>

        {/* Solid body fill + outline */}
        <path d={bodyFill} fill={FILL} fillOpacity={0.1} stroke="none" />
        {/* faint cross-section rings (3D form) */}
        <g data-feature={N.solid}>
          {ringUs.map((u, i) => ring(u, radiusAt(outer, u), { key: i, fill: 'none', stroke: BLUE, strokeWidth: 1, strokeOpacity: 0.35 }))}
        </g>
        <path d={topPath} fill="none" stroke={BLUE} strokeWidth={2} />
        <path d={botPath} fill="none" stroke={BLUE} strokeWidth={2} />
        {/* end caps */}
        {ring(a, radiusAt(outer, a), { fill: 'none', stroke: BLUE, strokeWidth: 1.5, strokeOpacity: 0.6 })}
        {ring(b, radiusAt(outer, b), { fill: FILL, fillOpacity: 0.12, stroke: BLUE, strokeWidth: 2 })}

        {/* inner tube (washer) */}
        {inner && (
          <g>
            <path d={profilePath(inner, 1)} fill="none" stroke={BLUE} strokeWidth={1.5} strokeDasharray="4 3" />
            <path d={profilePath(inner, -1)} fill="none" stroke={BLUE} strokeWidth={1.5} strokeDasharray="4 3" />
            {ring(b, radiusAt(inner, b), { fill: '#fff', stroke: BLUE, strokeWidth: 1.5, strokeDasharray: '4 3' })}
          </g>
        )}

        {/* axis of revolution */}
        <g data-feature={N.axis} data-feature-label="axis of revolution">
          <line x1={axisStart[0]} y1={axisStart[1]} x2={axisEnd[0]} y2={axisEnd[1]} stroke={AX} strokeWidth={1.5} strokeDasharray="6 4" markerEnd="url(#sor-arr)" />
          <text x={axisEnd[0] + (horizontal ? -4 : 10)} y={axisEnd[1] + (horizontal ? -8 : 4)} fontSize={12} fill={AX} fontWeight={600} textAnchor={horizontal ? 'end' : 'start'}>
            {figure.axisLabel || `${axis}-axis`}
          </text>
        </g>

        {/* representative slice */}
        <g data-feature={N.slice} data-feature-label={`representative ${method}`}>
          {ring(rep, rRep, { fill: RED, fillOpacity: 0.22, stroke: RED, strokeWidth: 2.5 })}
          {method === 'washer' && ring(rep, rRepIn, { fill: '#fff', stroke: RED, strokeWidth: 2 })}
          {/* radius leader */}
          {(() => {
            const [c0x, c0y] = pt(rep, 0);
            const [c1x, c1y] = pt(rep, rRep);
            return (
              <>
                <line x1={c0x} y1={c0y} x2={c1x} y2={c1y} stroke={RED} strokeWidth={1.5} />
                <text x={(c0x + c1x) / 2 + (horizontal ? 6 : 0)} y={(c0y + c1y) / 2 - 4} fontSize={12} fill={RED} fontWeight={700} textAnchor={horizontal ? 'start' : 'middle'}>
                  {method === 'washer' ? 'R' : 'r'}
                </text>
              </>
            );
          })()}
        </g>

        {/* function label near the curve start */}
        {figure.funcLabel && (
          <text
            data-feature={N.curve}
            x={axA[0] + (horizontal ? 0 : 14)}
            y={pt(outer[Math.floor(outer.length / 3)][0], radiusAt(outer, outer[Math.floor(outer.length / 3)][0]))[1] - 8}
            fontSize={13}
            fill={BLUE}
            fontWeight={700}
          >
            {figure.funcLabel}
          </text>
        )}

        {/* method caption */}
        <text x={W / 2} y={H - 10} fontSize={12} textAnchor="middle" fill="#6b7280">
          {method === 'disk' ? 'Disk method' : method === 'washer' ? 'Washer method' : 'Shell method'} · revolved about the {axis}-axis
        </text>
      </svg>
    </div>
  );
}
