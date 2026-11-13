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
  const cy = H / 2 - 11; // centre of the framed area above the caption
  const FL = figure.field === 'magnetic' ? '#16a34a' : '#2563eb';

  const arrow = (tip: [number, number], from: [number, number], color: string, size = 8) => {
    const dx = tip[0] - from[0], dy = tip[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const bx = tip[0] - ux * size, by = tip[1] - uy * size;
    const px = -uy, py = ux;
    return <polygon points={`${tip[0]},${tip[1]} ${bx + px * size * 0.55},${by + py * size * 0.55} ${bx - px * size * 0.55},${by - py * size * 0.55}`} fill={color} />;
  };

  // Field-line tracing: follow the summed inverse-square field of point
  // sources in small steps until the line ends on a source or leaves the frame.
  type Pt = [number, number];
  type Src = { x: number; y: number; q: number };
  const FX0 = 12, FX1 = W - 12, FY0 = 10, FY1 = H - 32;
  const trace = (start: Pt, srcs: Src[], sign: 1 | -1, stop: (x: number, y: number) => boolean): Pt[] => {
    const dirAt = (x: number, y: number): Pt => {
      let ex = 0, ey = 0;
      for (const s of srcs) {
        const dx = x - s.x, dy = y - s.y;
        const r3 = Math.pow(dx * dx + dy * dy, 1.5) || 1e-9;
        ex += (s.q * dx) / r3; ey += (s.q * dy) / r3;
      }
      const m = Math.hypot(ex, ey) || 1;
      return [(sign * ex) / m, (sign * ey) / m];
    };
    const pts: Pt[] = [start];
    let [x, y] = start;
    const h = 1.5;
    for (let i = 0; i < 4000; i++) {
      // midpoint step keeps the loops smooth and closed
      const [kx, ky] = dirAt(x, y);
      const [mx2, my2] = dirAt(x + (kx * h) / 2, y + (ky * h) / 2);
      x += mx2 * h; y += my2 * h;
      pts.push([x, y]);
      if (stop(x, y)) break;
      if (x < FX0 - 30 || x > FX1 + 30 || y < FY0 - 30 || y > FY1 + 30) break;
    }
    return pts;
  };
  const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  // Arrowhead centred ON the line at a fraction of its visible (in-frame) length.
  const arrowAt = (pts: Pt[], frac: number, color: string) => {
    const vis = pts.filter(([x, y]) => x >= FX0 && x <= FX1 && y >= FY0 && y <= FY1);
    if (vis.length < 8) return null;
    const i = Math.max(2, Math.min(vis.length - 3, Math.round(frac * (vis.length - 1))));
    const a = vis[i - 2], b = vis[i + 2];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
    const p = vis[i];
    return arrow([p[0] + ux * 4.5, p[1] + uy * 4.5], [p[0] - ux * 4.5, p[1] - uy * 4.5], color, 9);
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
    // True dipole field: every line is traced through the summed field of the
    // two poles, so lines also leave outward and around, not only in between.
    const half = 76;
    const magnetic = figure.field === 'magnetic';
    const srcs: Src[] = [{ x: cx - half, y: cy, q: 1 }, { x: cx + half, y: cy, q: -1 }];
    const R0 = 17;
    const els: React.ReactNode[] = [];
    const nSeeds = 12;
    for (let i = 0; i < nSeeds; i++) {
      const a = (i / nSeeds) * 2 * Math.PI;
      const pts = trace([srcs[0].x + R0 * Math.cos(a), cy - R0 * Math.sin(a)], srcs, 1,
        (x, y) => Math.hypot(x - srcs[1].x, y - cy) < R0);
      const closed = Math.hypot(pts[pts.length - 1][0] - srcs[1].x, pts[pts.length - 1][1] - cy) < R0 + 3;
      els.push(<path key={`l${i}`} d={toPath(pts)} fill="none" stroke={FL} strokeWidth={1.6} />);
      if (closed) {
        els.push(<g key={`a${i}`}>{arrowAt(pts, 0.5, FL)}</g>);
      } else {
        // A line that runs off the frame has a mirror partner arriving at the other pole.
        const mir = pts.map(([x, y]) => [2 * cx - x, y] as Pt).reverse();
        els.push(<path key={`m${i}`} d={toPath(mir)} fill="none" stroke={FL} strokeWidth={1.6} />);
        els.push(<g key={`a${i}`}>{arrowAt(pts, 0.55, FL)}</g>);
        els.push(<g key={`am${i}`}>{arrowAt(mir, 0.45, FL)}</g>);
      }
    }
    body = (
      <g data-feature={N.field} data-feature-label={`${figure.field} field`}>
        <g clipPath="url(#fl-clip)">{els}</g>
        <g data-feature={N.source} data-feature-label="the dipole">
          <circle cx={srcs[0].x} cy={cy} r={R0} fill={POS} /><text x={srcs[0].x} y={cy + (magnetic ? 6.5 : 7)} fontSize={magnetic ? 18 : 21} textAnchor="middle" fill="#fff" fontWeight={700}>{magnetic ? 'N' : '+'}</text>
          <circle cx={srcs[1].x} cy={cy} r={R0} fill={NEG} /><text x={srcs[1].x} y={cy + (magnetic ? 6.5 : 7)} fontSize={magnetic ? 18 : 21} textAnchor="middle" fill="#fff" fontWeight={700}>{magnetic ? 'S' : '−'}</text>
        </g>
      </g>
    );
  } else if (figure.config === 'parallel_plates') {
    const top = cy - 112, bot = cy + 112, x0 = cx - 165, x1 = cx + 165;
    const lines: React.ReactNode[] = [];
    const nL = 9;
    for (let i = 0; i < nL; i++) {
      const x = x0 + 26 + (i / (nL - 1)) * (x1 - x0 - 52);
      lines.push(<line key={i} x1={x} y1={top + 2} x2={x} y2={bot - 2} stroke={FL} strokeWidth={1.6} />);
      lines.push(<g key={`a${i}`}>{arrow([x, cy + 6], [x, cy - 6], FL, 10)}</g>);
    }
    // charge marks along each plate (pole letters for a magnetic field)
    const pm = figure.field !== 'magnetic';
    const marks = [0.1, 0.3, 0.5, 0.7, 0.9].map((f) => x0 + f * (x1 - x0));
    body = (
      <g data-feature={N.field} data-feature-label={`${figure.field} field`}>
        {lines}
        <g data-feature={N.source} data-feature-label="the plates">
          <rect x={x0} y={top - 8} width={x1 - x0} height={8} rx={2} fill={POS} />
          {marks.map((x) => <text key={`p${x}`} x={x} y={top - 15} fontSize={pm ? 18 : 14} textAnchor="middle" fill={POS} fontWeight={700}>{pm ? '+' : 'N'}</text>)}
          <rect x={x0} y={bot} width={x1 - x0} height={8} rx={2} fill={NEG} />
          {marks.map((x) => <text key={`n${x}`} x={x} y={bot + (pm ? 25 : 23)} fontSize={pm ? 18 : 14} textAnchor="middle" fill={NEG} fontWeight={700}>{pm ? '−' : 'S'}</text>)}
        </g>
        <text x={x1 + 12} y={cy + 6} fontSize={17} fill={FL} fontWeight={700} fontStyle="italic">{figure.field === 'magnetic' ? 'B' : 'E'}</text>
      </g>
    );
  } else {
    // bar_magnet — N (right, red) / S (left, blue). The lines are traced through
    // the field of the two pole faces (a uniformly magnetised bar), so they are
    // smooth loops that leave the N half and return to the S half, never crossing.
    const mw = 66, mh = 22;
    // Each pole is spread along the end third of the bar, so lines come out of
    // the end face and the sides near it instead of bunching at the corners.
    const srcs: Src[] = [];
    const nPole = 7;
    for (let i = 0; i < nPole; i++) {
      const dx = mw * (0.5 + 0.45 * (i / (nPole - 1)));
      srcs.push({ x: cx + dx, y: cy, q: 1 / nPole }, { x: cx - dx, y: cy, q: -1 / nPole });
    }
    const inMagnet = (x: number, y: number) => Math.abs(x - cx) < mw && Math.abs(y - cy) < mh;
    const MG = '#16a34a';
    const els: React.ReactNode[] = [];
    // closed loops, seeded on the mid-plane above and below the bar
    [13, 34, 62, 100, 150].forEach((h, k) => {
      for (const sgn of [-1, 1]) {
        const seed: Pt = [cx, cy + sgn * (mh + h)];
        const fwd = trace(seed, srcs, 1, inMagnet);   // towards S
        const back = trace(seed, srcs, -1, inMagnet); // back to N
        const pts = [...back.reverse(), ...fwd.slice(1)];
        els.push(<path key={`l${k}${sgn}`} d={toPath(pts)} fill="none" stroke={MG} strokeWidth={1.5} />);
        els.push(<g key={`a${k}${sgn}`}>{arrowAt(pts, 0.5, MG)}</g>);
      }
    });
    // lines out of the N face that run off the frame, and their partners into S
    [-0.5, 0, 0.5].forEach((f, k) => {
      const pts = trace([cx + mw + 1, cy + f * mh], srcs, 1, inMagnet);
      const mir = pts.map(([x, y]) => [2 * cx - x, y] as Pt).reverse();
      els.push(<path key={`o${k}`} d={toPath(pts)} fill="none" stroke={MG} strokeWidth={1.5} />);
      els.push(<path key={`om${k}`} d={toPath(mir)} fill="none" stroke={MG} strokeWidth={1.5} />);
      els.push(<g key={`oa${k}`}>{arrowAt(pts, 0.4, MG)}</g>);
      els.push(<g key={`oam${k}`}>{arrowAt(mir, 0.6, MG)}</g>);
    });
    const Sx = cx - mw;
    body = (
      <g data-feature={N.field} data-feature-label="magnetic field">
        <g clipPath="url(#fl-clip)">{els}</g>
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
        <defs>
          <clipPath id="fl-clip"><rect x={FX0} y={FY0} width={FX1 - FX0} height={FY1 - FY0} /></clipPath>
        </defs>
        {body}
        <text x={W / 2} y={H - 8} fontSize={12} textAnchor="middle" fill="#6b7280">
          {figure.field} field — {figure.config.replace(/_/g, ' ')}
        </text>
      </svg>
    </div>
  );
}
