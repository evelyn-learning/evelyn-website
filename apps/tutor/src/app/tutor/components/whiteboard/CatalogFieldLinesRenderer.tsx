'use client';

import React from 'react';
import {
  fieldLinesFeatureNames,
  type FieldLinesFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/field-lines';

const POS = '#dc2626'; // + charge / N pole
const NEG = '#2563eb'; // - charge / S pole

export function CatalogFieldLinesRenderer({ figure }: { figure: FieldLinesFigure }) {
  const N = fieldLinesFeatureNames;
  const W = 520;
  const H = 400;
  const cx = W / 2;
  const cy = H / 2 + 4;
  const FL = figure.field === 'magnetic' ? '#16a34a' : '#2563eb';

  const arrow = (tip: [number, number], from: [number, number], color: string, size = 8) => {
    const dx = tip[0] - from[0], dy = tip[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const bx = tip[0] - ux * size, by = tip[1] - uy * size;
    const px = -uy, py = ux;
    return <polygon points={`${tip[0]},${tip[1]} ${bx + px * size * 0.55},${by + py * size * 0.55} ${bx - px * size * 0.55},${by - py * size * 0.55}`} fill={color} />;
  };

  let body: React.ReactNode = null;

  if (figure.config === 'point_charge') {
    const pos = figure.charge === '+';
    const lines: React.ReactNode[] = [];
    const Ncount = 12;
    for (let i = 0; i < Ncount; i++) {
      const a = (i / Ncount) * 2 * Math.PI;
      const inner: [number, number] = [cx + 20 * Math.cos(a), cy + 20 * Math.sin(a)];
      const outer: [number, number] = [cx + 150 * Math.cos(a), cy + 150 * Math.sin(a)];
      lines.push(<line key={i} x1={inner[0]} y1={inner[1]} x2={outer[0]} y2={outer[1]} stroke={FL} strokeWidth={1.6} />);
      // arrow points outward for +, inward for -
      const mid: [number, number] = [cx + 95 * Math.cos(a), cy + 95 * Math.sin(a)];
      lines.push(<g key={`a${i}`}>{pos ? arrow([cx + 110 * Math.cos(a), cy + 110 * Math.sin(a)], mid, FL) : arrow([cx + 55 * Math.cos(a), cy + 55 * Math.sin(a)], [cx + 95 * Math.cos(a), cy + 95 * Math.sin(a)], FL)}</g>);
    }
    body = (
      <g data-feature={N.field} data-feature-label={`${figure.field} field`}>
        {lines}
        <g data-feature={N.source} data-feature-label="the charge">
          <circle cx={cx} cy={cy} r={18} fill={pos ? POS : NEG} />
          <text x={cx} y={cy + 7} fontSize={22} textAnchor="middle" fill="#fff" fontWeight={700}>{pos ? '+' : '−'}</text>
        </g>
      </g>
    );
  } else if (figure.config === 'dipole') {
    const px = 95;
    const Lp: [number, number] = [cx - px, cy];
    const Rp: [number, number] = [cx + px, cy];
    const loops: React.ReactNode[] = [];
    // straight axis line + curved field lines from + (left) to − (right)
    loops.push(<line key="ax" x1={Lp[0] + 20} y1={cy} x2={Rp[0] - 20} y2={cy} stroke={FL} strokeWidth={1.6} />);
    loops.push(<g key="axa">{arrow([cx + 6, cy], [cx - 14, cy], FL)}</g>);
    [1, 2, 3].forEach((k) => {
      const h = k * 42;
      for (const sgn of [-1, 1]) {
        const c1: [number, number] = [Lp[0] + 30, cy + sgn * h];
        const c2: [number, number] = [Rp[0] - 30, cy + sgn * h];
        loops.push(<path key={`${k}${sgn}`} d={`M ${Lp[0] + 14} ${cy - sgn * 4} C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${Rp[0] - 14} ${cy - sgn * 4}`} fill="none" stroke={FL} strokeWidth={1.5} />);
        loops.push(<g key={`a${k}${sgn}`}>{arrow([cx + 10, cy + sgn * h * 0.82], [cx - 14, cy + sgn * h * 0.82], FL)}</g>);
      }
    });
    body = (
      <g data-feature={N.field} data-feature-label={`${figure.field} field`}>
        {loops}
        <g data-feature={N.source} data-feature-label="the dipole">
          <circle cx={Lp[0]} cy={cy} r={17} fill={POS} /><text x={Lp[0]} y={cy + 7} fontSize={21} textAnchor="middle" fill="#fff" fontWeight={700}>+</text>
          <circle cx={Rp[0]} cy={cy} r={17} fill={NEG} /><text x={Rp[0]} y={cy + 7} fontSize={21} textAnchor="middle" fill="#fff" fontWeight={700}>−</text>
        </g>
      </g>
    );
  } else if (figure.config === 'parallel_plates') {
    const top = cy - 95, bot = cy + 95, x0 = cx - 120, x1 = cx + 120;
    const lines: React.ReactNode[] = [];
    const nL = 7;
    for (let i = 0; i < nL; i++) {
      const x = x0 + 22 + (i / (nL - 1)) * (x1 - x0 - 44);
      lines.push(<line key={i} x1={x} y1={top + 6} x2={x} y2={bot - 6} stroke={FL} strokeWidth={1.6} />);
      lines.push(<g key={`a${i}`}>{arrow([x, cy + 8], [x, cy - 12], FL)}</g>);
    }
    body = (
      <g data-feature={N.field} data-feature-label={`${figure.field} field`}>
        {lines}
        <g data-feature={N.source} data-feature-label="the plates">
          <rect x={x0} y={top - 6} width={x1 - x0} height={6} fill={POS} />
          <text x={x0 - 14} y={top} fontSize={18} fill={POS} fontWeight={700}>+</text>
          <rect x={x0} y={bot} width={x1 - x0} height={6} fill={NEG} />
          <text x={x0 - 14} y={bot + 8} fontSize={18} fill={NEG} fontWeight={700}>−</text>
        </g>
        <text x={x1 + 8} y={cy + 4} fontSize={14} fill={FL} fontWeight={700}>E</text>
      </g>
    );
  } else {
    // bar_magnet — N (right, red) / S (left, blue). A dipole field: lines emerge
    // from distinct points on the N pole face, balloon OUT past the ends and over
    // (and under), and return to the S pole face — never converging to one point,
    // never crossing.
    const mw = 66, mh = 20;
    const Nx = cx + mw, Sx = cx - mw;
    type Pt = [number, number];
    const bez = (t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt => {
      const u = 1 - t;
      return [
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
      ];
    };
    const loops: React.ReactNode[] = [];
    const emg = 5.5; // endpoint spacing along the pole FACE
    [1, 2, 3].forEach((k) => {
      const h = 34 + k * 40;       // tall vertical bulge → loops tower over the bar
      const cxOff = 64 + k * 22;   // controls reach OUT past the ends → wrap the ends
      for (const sgn of [-1, 1]) {
        const ey = cy + sgn * k * emg; // outer loops attach further out on the face
        const p0: Pt = [Nx, ey], p1: Pt = [Nx + cxOff, cy + sgn * h], p2: Pt = [Sx - cxOff, cy + sgn * h], p3: Pt = [Sx, ey];
        loops.push(<path key={`${k}${sgn}`} d={`M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`} fill="none" stroke="#16a34a" strokeWidth={1.5} />);
        // flow exits N (t=0) → enters S (t=1); arrows sampled on the N and S sides
        for (const t of [0.3, 0.7]) {
          const a = bez(t, p0, p1, p2, p3), b = bez(t + 0.05, p0, p1, p2, p3);
          loops.push(<g key={`a${k}${sgn}${t}`}>{arrow(b, a, '#16a34a')}</g>);
        }
      }
    });
    body = (
      <g data-feature={N.field} data-feature-label="magnetic field">
        {loops}
        <g data-feature={N.source} data-feature-label="the magnet">
          <rect x={Sx} y={cy - mh} width={mw} height={mh * 2} fill={NEG} />
          <rect x={cx} y={cy - mh} width={mw} height={mh * 2} fill={POS} />
          <rect x={Sx} y={cy - mh} width={mw * 2} height={mh * 2} fill="none" stroke="#1f2937" strokeWidth={1.5} />
          <text x={Sx + mw / 2} y={cy + 6} fontSize={18} textAnchor="middle" fill="#fff" fontWeight={700}>S</text>
          <text x={cx + mw / 2} y={cy + 6} fontSize={18} textAnchor="middle" fill="#fff" fontWeight={700}>N</text>
        </g>
      </g>
    );
  }

  return (
    <div className="field-lines-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[560px]"
        data-feature={N.field}
        data-feature-label={figure.title || `${figure.field} field`}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {body}
        <text x={W / 2} y={H - 8} fontSize={12} textAnchor="middle" fill="#6b7280">
          {figure.field} field — {figure.config.replace(/_/g, ' ')}
        </text>
      </svg>
    </div>
  );
}
