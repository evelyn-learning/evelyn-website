'use client';

import React from 'react';
import {
  solid3DFeatureNames,
  type Solid3DFigure,
  type SolidShape,
} from '@/lib/tutor/diagrams/catalog/kinds/solid-3d';

const EDGE = '#1e3a8a';
const FILL = '#3b82f6';
const HID = '#93c5fd';
const DIM = '#b91c1c';
const KZX = 0.5; // depth → screen x
const KZY = 0.34; // depth → screen y

type P = [number, number];

/** Draw one labeled 3D solid centered in a [0..bw]×[0..bh] box. */
function drawSolid(shape: SolidShape, dims: Record<string, number>, cx: number, cy: number, S: number): React.ReactNode {
  const proj = (x: number, y: number, z: number): P => [cx + S * (x + z * KZX), cy - S * (y + z * KZY)];
  const poly = (pts: P[], props: React.SVGProps<SVGPolygonElement>) => (
    <polygon points={pts.map((p) => p.join(',')).join(' ')} {...props} />
  );
  const dimLabel = (p: P, text: string, dx = 0, dy = 0, anchor: 'start' | 'middle' | 'end' = 'middle') => (
    <text x={p[0] + dx} y={p[1] + dy} fontSize={12.5} fill={DIM} fontWeight={700} textAnchor={anchor}>{text}</text>
  );
  const f = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

  if (shape === 'rectangular_prism' || shape === 'cube') {
    const L = shape === 'cube' ? dims.side : dims.length;
    const H = shape === 'cube' ? dims.side : dims.height;
    const W = shape === 'cube' ? dims.side : dims.width;
    const x0 = -L / 2, y0 = -H / 2, z0 = -W / 2;
    const c = (x: number, y: number, z: number) => proj(x0 + x, y0 + y, z0 + z);
    const fbl = c(0, 0, 0), fbr = c(L, 0, 0), ftr = c(L, H, 0), ftl = c(0, H, 0);
    const bbl = c(0, 0, W), bbr = c(L, 0, W), btr = c(L, H, W), btl = c(0, H, W);
    return (
      <g>
        {/* hidden back edges */}
        {[[bbl, bbr], [bbl, btl], [bbl, fbl]].map((e, i) => (
          <line key={i} x1={e[0][0]} y1={e[0][1]} x2={e[1][0]} y2={e[1][1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        ))}
        {poly([ftl, ftr, btr, btl], { fill: FILL, fillOpacity: 0.16, stroke: EDGE, strokeWidth: 2 })}{/* top */}
        {poly([fbr, ftr, btr, bbr], { fill: FILL, fillOpacity: 0.1, stroke: EDGE, strokeWidth: 2 })}{/* right */}
        {poly([fbl, fbr, ftr, ftl], { fill: FILL, fillOpacity: 0.22, stroke: EDGE, strokeWidth: 2 })}{/* front */}
        {dimLabel([(fbl[0] + fbr[0]) / 2, fbl[1]], f(L), 0, 16)}
        {dimLabel([fbl[0], (fbl[1] + ftl[1]) / 2], f(H), -12, 4)}
        {dimLabel([(ftr[0] + btr[0]) / 2, (ftr[1] + btr[1]) / 2], f(W), 10, -4)}
      </g>
    );
  }

  if (shape === 'cylinder' || shape === 'cone') {
    const R = dims.radius, Ht = dims.height;
    const rx = S * R, ry = rx * 0.34;
    const [bx, by] = proj(0, -Ht / 2, 0); // base center
    const topY = by - S * Ht;
    if (shape === 'cylinder') {
      return (
        <g>
          <line x1={bx - rx} y1={by} x2={bx - rx} y2={topY} stroke={EDGE} strokeWidth={2} />
          <line x1={bx + rx} y1={by} x2={bx + rx} y2={topY} stroke={EDGE} strokeWidth={2} />
          <path d={`M ${bx - rx} ${by} A ${rx} ${ry} 0 0 0 ${bx + rx} ${by}`} fill="none" stroke={EDGE} strokeWidth={2} />
          <path d={`M ${bx - rx} ${by} A ${rx} ${ry} 0 0 1 ${bx + rx} ${by}`} fill="none" stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
          <ellipse cx={bx} cy={topY} rx={rx} ry={ry} fill={FILL} fillOpacity={0.18} stroke={EDGE} strokeWidth={2} />
          <line x1={bx} y1={topY} x2={bx + rx} y2={topY} stroke={DIM} strokeWidth={1.4} />
          {dimLabel([bx + rx / 2, topY], `r=${f(R)}`, 0, -5)}
          {dimLabel([bx + rx + 2, (by + topY) / 2], `h=${f(Ht)}`, 10, 4)}
        </g>
      );
    }
    // cone
    const apex: P = [bx, topY];
    return (
      <g>
        <path d={`M ${bx - rx} ${by} A ${rx} ${ry} 0 0 1 ${bx + rx} ${by}`} fill="none" stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        <path d={`M ${bx - rx} ${by} A ${rx} ${ry} 0 0 0 ${bx + rx} ${by}`} fill={FILL} fillOpacity={0.16} stroke={EDGE} strokeWidth={2} />
        <line x1={bx - rx} y1={by} x2={apex[0]} y2={apex[1]} stroke={EDGE} strokeWidth={2} />
        <line x1={bx + rx} y1={by} x2={apex[0]} y2={apex[1]} stroke={EDGE} strokeWidth={2} />
        <line x1={bx} y1={by} x2={apex[0]} y2={apex[1]} stroke={DIM} strokeWidth={1.3} strokeDasharray="3 3" />
        <line x1={bx} y1={by} x2={bx + rx} y2={by} stroke={DIM} strokeWidth={1.4} />
        {dimLabel([bx + rx / 2, by], `r=${f(R)}`, 0, 16)}
        {dimLabel([bx, (by + apex[1]) / 2], `h=${f(Ht)}`, -12, 4, 'end')}
      </g>
    );
  }

  if (shape === 'sphere') {
    const R = dims.radius, r = S * R;
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={FILL} fillOpacity={0.14} stroke={EDGE} strokeWidth={2} />
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.3} fill="none" stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={DIM} strokeWidth={1.5} />
        {dimLabel([cx + r / 2, cy], `r=${f(R)}`, 0, -5)}
      </g>
    );
  }

  if (shape === 'square_pyramid') {
    const B = dims.base, Ht = dims.height;
    const h = B / 2;
    const bfl = proj(-h, -Ht / 2, -h), bfr = proj(h, -Ht / 2, -h);
    const bbr = proj(h, -Ht / 2, h), bbl = proj(-h, -Ht / 2, h);
    const apex = proj(0, Ht / 2, 0);
    return (
      <g>
        <line x1={bbl[0]} y1={bbl[1]} x2={bbr[0]} y2={bbr[1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        <line x1={apex[0]} y1={apex[1]} x2={bbl[0]} y2={bbl[1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
        {poly([bfl, bfr, bbr, bbl], { fill: FILL, fillOpacity: 0.1, stroke: EDGE, strokeWidth: 2 })}
        {poly([bfl, bfr, apex], { fill: FILL, fillOpacity: 0.22, stroke: EDGE, strokeWidth: 2 })}
        <line x1={apex[0]} y1={apex[1]} x2={bbr[0]} y2={bbr[1]} stroke={EDGE} strokeWidth={2} />
        {dimLabel([(bfl[0] + bfr[0]) / 2, bfl[1]], `${f(B)}`, 0, 16)}
        {dimLabel([apex[0], (apex[1] + bfl[1]) / 2], `h=${f(Ht)}`, -14, 0)}
      </g>
    );
  }

  // triangular_prism
  const { base: tb, triHeight: th, length: tl } = dims;
  const a0 = proj(-tb / 2, -th / 2, -tl / 2), b0 = proj(tb / 2, -th / 2, -tl / 2), c0 = proj(0, th / 2, -tl / 2);
  const a1 = proj(-tb / 2, -th / 2, tl / 2), b1 = proj(tb / 2, -th / 2, tl / 2), c1 = proj(0, th / 2, tl / 2);
  return (
    <g>
      {[[a1, b1], [b1, c1], [a1, c1]].map((e, i) => (
        <line key={i} x1={e[0][0]} y1={e[0][1]} x2={e[1][0]} y2={e[1][1]} stroke={HID} strokeWidth={1.3} strokeDasharray="4 3" />
      ))}
      {poly([b0, c0, c1, b1], { fill: FILL, fillOpacity: 0.12, stroke: EDGE, strokeWidth: 2 })}
      {poly([a0, c0, c1, a1], { fill: FILL, fillOpacity: 0.16, stroke: EDGE, strokeWidth: 2 })}
      {poly([a0, b0, c0], { fill: FILL, fillOpacity: 0.22, stroke: EDGE, strokeWidth: 2 })}
      {dimLabel([(a0[0] + b0[0]) / 2, a0[1]], `${f(tb)}`, 0, 15)}
      {dimLabel([c0[0], (c0[1] + a0[1]) / 2], `h=${f(th)}`, -12, 0)}
      {dimLabel([(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2], `${f(tl)}`, 10, 0)}
    </g>
  );
}

export function CatalogSolid3DRenderer({ figure }: { figure: Solid3DFigure }) {
  const N = solid3DFeatureNames;
  const W = 480;
  const H = 380;
  // Scale so the largest dimension fits comfortably.
  const maxDim = Math.max(...Object.values(figure.dims), 1);
  const S = Math.min(34, 200 / maxDim);

  return (
    <div className="solid-3d-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[520px]"
        data-feature={N.solid}
        data-feature-label={figure.title || figure.shape.replace(/_/g, ' ')}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {drawSolid(figure.shape, figure.dims, W / 2 - 20, H / 2 + 30, S)}
        <text x={W / 2} y={H - 12} fontSize={12.5} textAnchor="middle" fill="#6b7280">
          {figure.shape.replace(/_/g, ' ')}
        </text>
      </svg>
    </div>
  );
}
