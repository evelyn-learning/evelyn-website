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
const HALO: React.CSSProperties = { paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' };

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
  const alongMin = horizontal ? 70 : H - 76;
  const alongMax = horizontal ? W - 96 : 84;
  const Yc = 216; // axis line (horizontal case)
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

  const axisStart = horizontal ? [alongMin - 24, Yc] : [Xc, alongMin + 24];
  const axisEnd = horizontal ? [alongMax + 34, Yc] : [Xc, alongMax - 34];
  const sh = figure.shell;
  const methodName = method === 'disk' ? 'Disk method' : method === 'washer' ? 'Washer method' : 'Shell method';
  const about = figure.axisLabel && figure.axisLabel.length > 8 ? figure.axisLabel : `revolved about the ${axis}-axis`;
  const shortAxis = figure.axisLabel && figure.axisLabel.length <= 8 ? figure.axisLabel : `${axis}-axis`;
  const curveLabels = (
    <g data-feature={N.curve}>
      {figure.funcLabel && <text x={16} y={22} fontSize={13} fill={BLUE} fontWeight={700}>{figure.funcLabel}</text>}
      {figure.innerLabel && (
        <text x={16} y={figure.funcLabel ? 40 : 22} fontSize={12.5} fill={BLUE} fontWeight={600}>
          <tspan fontWeight={400}>┄ </tspan>{figure.innerLabel}
        </text>
      )}
    </g>
  );
  const axisAndCaption = (
    <>
      <g data-feature={N.axis} data-feature-label="axis of revolution">
        <line x1={axisStart[0]} y1={axisStart[1]} x2={axisEnd[0]} y2={axisEnd[1]} stroke={AX} strokeWidth={1.5} strokeDasharray="6 4" markerEnd="url(#sor-arr)" />
        <text x={axisEnd[0] + (horizontal ? 8 : 0)} y={axisEnd[1] + (horizontal ? 4 : -9)} fontSize={12} fill={AX} fontWeight={600} textAnchor={horizontal ? 'start' : 'middle'}>
          {shortAxis}
        </text>
      </g>
      <text x={W / 2} y={H - 10} fontSize={12} textAnchor="middle" fill="#6b7280">
        {methodName} · {about}
      </text>
    </>
  );
  const frame = (children: React.ReactNode) => (
    <div className="solid-of-revolution-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2 text-center">{figure.title}</div>}
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
        {children}
      </svg>
    </div>
  );

  // ── Shells from curves across the axis (y = f(x) about the y-axis) ──────
  if (sh) {
    const lerp = (prof: Array<[number, number]>, rho: number) => radiusAt(prof, rho);
    const side = (prof: Array<[number, number]>, sign: number) => prof.map(([rho, h]) => pt(h, sign * rho).join(' ')).join(' L ');
    const rev = (prof: Array<[number, number]>) => [...prof].reverse();
    const half = (sign: number) => `M ${side(sh.top, sign)} L ${side(rev(sh.bottom), sign)} Z`;
    const rhoA = sh.top[0][0], rhoB = sh.top[sh.top.length - 1][0];
    const hTop = lerp(sh.top, sh.at), hBot = lerp(sh.bottom, sh.at);
    const wall = (rho: number, sign: number, props: React.SVGProps<SVGLineElement>) => {
      const p0 = pt(lerp(sh.top, rho), sign * rho), p1 = pt(lerp(sh.bottom, rho), sign * rho);
      return <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} {...props} />;
    };
    const shellFill = `M ${pt(hTop, sh.at).join(' ')} L ${pt(hBot, sh.at).join(' ')} L ${pt(hBot, -sh.at).join(' ')} L ${pt(hTop, -sh.at).join(' ')} Z`;
    const c0 = pt(hTop, 0), c1 = pt(hTop, sh.at);
    const hMid = pt((hTop + hBot) / 2, sh.at);
    return frame(
      <>
        <path d={half(1)} fill={FILL} fillOpacity={0.1} stroke="none" />
        <path d={half(-1)} fill={FILL} fillOpacity={0.1} stroke="none" />
        {[1, -1].map((sign) => (
          <g key={sign}>
            <path d={`M ${side(sh.top, sign)}`} fill="none" stroke={BLUE} strokeWidth={2} />
            <path d={`M ${side(sh.bottom, sign)}`} fill="none" stroke={BLUE} strokeWidth={2} />
            {wall(rhoB, sign, { stroke: BLUE, strokeWidth: 2 })}
            {rhoA > 1e-9 && wall(rhoA, sign, { stroke: BLUE, strokeWidth: 1.5, strokeDasharray: '4 3' })}
          </g>
        ))}
        {/* rims: the circles the region's corners sweep out */}
        {ring(lerp(sh.top, rhoB), rhoB, { fill: 'none', stroke: BLUE, strokeWidth: 1.5, strokeOpacity: 0.7 })}
        {ring(lerp(sh.bottom, rhoB), rhoB, { fill: 'none', stroke: BLUE, strokeWidth: 1.5, strokeOpacity: 0.7 })}
        {rhoA > 1e-9 && ring(lerp(sh.top, rhoA), rhoA, { fill: 'none', stroke: BLUE, strokeWidth: 1.2, strokeOpacity: 0.6, strokeDasharray: '4 3' })}
        {axisAndCaption}
        <g data-feature={N.slice} data-feature-label="representative shell">
          <path d={shellFill} fill={RED} fillOpacity={0.14} stroke="none" />
          {wall(sh.at, 1, { stroke: RED, strokeWidth: 2.25 })}
          {wall(sh.at, -1, { stroke: RED, strokeWidth: 2.25 })}
          {ring(hBot, sh.at, { fill: 'none', stroke: RED, strokeWidth: 2 })}
          {ring(hTop, sh.at, { fill: RED, fillOpacity: 0.18, stroke: RED, strokeWidth: 2.25 })}
          <line x1={c0[0]} y1={c0[1]} x2={c1[0]} y2={c1[1]} stroke={RED} strokeWidth={1.5} />
          <circle cx={c0[0]} cy={c0[1]} r={2.2} fill={RED} />
          <text x={(c0[0] + c1[0]) / 2 + (horizontal ? PERSP + 6 : 0)} y={(c0[1] + c1[1]) / 2 + (horizontal ? 4 : -PERSP - 5)} fontSize={13} fontStyle="italic" fill={RED} fontWeight={700} textAnchor={horizontal ? 'start' : 'middle'} style={HALO}>r</text>
          <text x={hMid[0] + (horizontal ? 0 : 8)} y={hMid[1] + (horizontal ? -8 : 4)} fontSize={13} fontStyle="italic" fill={RED} fontWeight={700} textAnchor={horizontal ? 'middle' : 'start'} style={HALO}>h</text>
        </g>
        {curveLabels}
      </>,
    );
  }

  return frame(
      <>
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

        {axisAndCaption}

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
                <text x={(c0x + c1x) / 2 + (horizontal ? PERSP + 7 : 0)} y={(c0y + c1y) / 2 + (horizontal ? 4 : -PERSP - 6)} fontSize={13} fontStyle="italic" fill={RED} fontWeight={700} textAnchor={horizontal ? 'start' : 'middle'} style={HALO}>
                  {method === 'washer' ? 'R' : 'r'}
                </text>
                {method === 'washer' && rRepIn > 0 && (() => {
                  const [ix, iy] = pt(rep, -rRepIn);
                  return (
                    <>
                      <line x1={c0x} y1={c0y} x2={ix} y2={iy} stroke={RED} strokeWidth={1.5} />
                      <text x={horizontal ? ix + PERSP + 7 : (c0x + ix) / 2} y={horizontal ? (c0y + iy) / 2 + 5 : iy + PERSP + 15} fontSize={13} fontStyle="italic" fill={RED} fontWeight={700} textAnchor={horizontal ? 'start' : 'middle'} style={HALO}>r</text>
                    </>
                  );
                })()}
              </>
            );
          })()}
        </g>

        {curveLabels}
      </>,
  );
}
