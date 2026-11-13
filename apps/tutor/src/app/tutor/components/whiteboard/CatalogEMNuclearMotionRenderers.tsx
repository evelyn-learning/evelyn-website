'use client';

import React from 'react';
import {
  nuclearDecayFeatureNames,
  emInductionFeatureNames,
  magneticFieldFeatureNames,
  projectileFeatureNames,
  type NuclearDecayFigure,
  type Nuclide,
  type EMInductionFigure,
  type MagneticFieldFigure,
  type ProjectileFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/em-nuclear-motion';

const BLUE = '#2563eb';
const RED = '#dc2626';
const ORANGE = '#ea580c';
const GREEN = '#16a34a';
const GRAY = '#94a3b8';
const FAINT = '#cbd5e1';
const INK = '#374151';

function fmtZ(z: number): string {
  return z < 0 ? `(${z})` : `${z}`;
}

// ── nuclear_decay ─────────────────────────────────────────────────────────────
/** Draw a nuclide ᴬ_Z X with A/Z stacked to the left of the symbol. Returns
 *  the x at which the symbol ends (for laying out an equation). */
function NuclideTerm({
  x,
  cy,
  nuclide,
  color,
  big = true,
}: {
  x: number;
  cy: number;
  nuclide: Nuclide;
  color: string;
  big?: boolean;
}) {
  const symSize = big ? 27 : 20;
  const supSize = big ? 13.5 : 11;
  return (
    <g>
      <text x={x} y={cy - 7} fontSize={supSize} textAnchor="end" fill={color} fontWeight={600}>
        {nuclide.displayA ?? nuclide.A}
      </text>
      <text x={x} y={cy + 12} fontSize={supSize} textAnchor="end" fill={color} fontWeight={600}>
        {nuclide.Z}
      </text>
      <text x={x + 3} y={cy} fontSize={symSize} textAnchor="start" fill={color} fontWeight={700} dominantBaseline="middle">
        {nuclide.symbol}
      </text>
    </g>
  );
}

export function CatalogNuclearDecayRenderer({ figure }: { figure: NuclearDecayFigure }) {
  const N = nuclearDecayFeatureNames;
  const W = 680;
  const H = figure.showHalfLife ? 400 : 220;
  const eqCy = 78;

  // half-life plot area
  const x0 = 92;
  const x1 = 372;
  const yTop = 250;
  const yBot = 352;
  const tMax = 4; // half-lives across the axis
  const px = (t: number) => x0 + (t / tMax) * (x1 - x0);
  const py = (n: number) => yBot - n * (yBot - yTop);
  const curve: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * tMax;
    curve.push(`${px(t).toFixed(1)},${py(Math.pow(0.5, t)).toFixed(1)}`);
  }

  return (
    <div className="w-full flex flex-col items-center">
      {figure.title
        ? <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
        : <div className="text-base font-semibold text-gray-800 mb-2">{`Nuclear decay — ${figure.modeLabel}`}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px]"
        data-feature={N.figure}
        data-feature-label={figure.title || `Nuclear decay (${figure.modeLabel})`}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="nd-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
        </defs>

        {/* decay equation */}
        <g data-feature={N.parent} data-feature-label="Parent nuclide">
          <NuclideTerm x={108} cy={eqCy} nuclide={figure.parent} color={INK} />
        </g>

        {/* reaction arrow */}
        <line x1={150} y1={eqCy} x2={224} y2={eqCy} stroke={INK} strokeWidth={2.5} markerEnd="url(#nd-arr)" />
        <text x={184} y={eqCy - 16} fontSize={13} textAnchor="middle" fill={ORANGE} fontWeight={700}>
          {figure.modeLabel}
        </text>

        <g data-feature={N.daughter} data-feature-label="Daughter nuclide">
          <NuclideTerm x={276} cy={eqCy} nuclide={figure.daughter} color={BLUE} />
        </g>

        <text x={330} y={eqCy} fontSize={22} textAnchor="middle" fill={INK} dominantBaseline="middle">+</text>

        <g data-feature={N.particle} data-feature-label="Emitted particle">
          <NuclideTerm x={382} cy={eqCy} nuclide={figure.particle} color={RED} />
        </g>

        {figure.extra && (
          <>
            <text x={430} y={eqCy} fontSize={20} textAnchor="middle" fill={INK} dominantBaseline="middle">+</text>
            <text x={448} y={eqCy} fontSize={14.5} textAnchor="start" fill={GRAY} dominantBaseline="middle" fontWeight={600}>
              {figure.extra}
            </text>
          </>
        )}

        {/* particle name caption */}
        <text x={382} y={eqCy + 36} fontSize={11.5} textAnchor="middle" fill={RED}>
          {figure.particle.name}
        </text>

        {/* conservation bookkeeping */}
        <text x={40} y={eqCy + 78} fontSize={13} textAnchor="start" fill={INK} fontWeight={600}>
          Mass number A:
        </text>
        <text x={210} y={eqCy + 78} fontSize={13.5} textAnchor="start" fill={INK}>
          {`${figure.parent.A} = ${figure.daughter.A} + ${figure.particle.A}   ✓`}
        </text>
        <text x={40} y={eqCy + 102} fontSize={13} textAnchor="start" fill={INK} fontWeight={600}>
          Atomic number Z:
        </text>
        <text x={210} y={eqCy + 102} fontSize={13.5} textAnchor="start" fill={INK}>
          {`${figure.parent.Z} = ${figure.daughter.Z} + ${fmtZ(figure.particle.Z)}   ✓`}
        </text>

        {/* half-life decay curve */}
        {figure.showHalfLife && (
          <g data-feature={N.halfLife} data-feature-label="Half-life curve">
            {/* axes */}
            <line x1={x0} y1={yTop - 12} x2={x0} y2={yBot} stroke={INK} strokeWidth={1.5} />
            <line x1={x0} y1={yBot} x2={x1 + 14} y2={yBot} stroke={INK} strokeWidth={1.5} />
            {/* N0 and 1/2 N0 guides */}
            <line x1={x0} y1={py(0.5)} x2={px(1)} y2={py(0.5)} stroke={FAINT} strokeWidth={1} strokeDasharray="4 3" />
            <line x1={px(1)} y1={py(0.5)} x2={px(1)} y2={yBot} stroke={FAINT} strokeWidth={1} strokeDasharray="4 3" />
            {/* curve */}
            <polyline points={curve.join(' ')} fill="none" stroke={GREEN} strokeWidth={2.5} />
            {/* markers */}
            <circle cx={px(1)} cy={py(0.5)} r={4} fill={GREEN} stroke="#fff" strokeWidth={1} />
            {/* labels */}
            <text x={x0 - 6} y={py(1) + 4} fontSize={11.5} textAnchor="end" fill={INK}>N₀</text>
            <text x={x0 - 6} y={py(0.5) + 4} fontSize={11.5} textAnchor="end" fill={INK}>½N₀</text>
            <text x={px(1)} y={yBot + 16} fontSize={11.5} textAnchor="middle" fill={INK}>t½</text>
            <text x={px(2)} y={yBot + 16} fontSize={11.5} textAnchor="middle" fill={GRAY}>2t½</text>
            <text x={px(3)} y={yBot + 16} fontSize={11.5} textAnchor="middle" fill={GRAY}>3t½</text>
            <text x={x1 + 20} y={yBot + 4} fontSize={12} textAnchor="start" fill={INK} fontStyle="italic">t</text>
            <text x={x0} y={yTop - 20} fontSize={12} textAnchor="middle" fill={INK} fontWeight={600}>N (nuclei remaining)</text>
          </g>
        )}

        {/* right-side legend for half-life */}
        {figure.showHalfLife && (
          <text x={430} y={300} fontSize={12} textAnchor="start" fill={INK}>
            <tspan x={430} dy={0} fontWeight={700}>Half-life decay</tspan>
            <tspan x={430} dy={24}>N = N₀ · (½)</tspan>
            <tspan dy={-6} fontSize={10}>t / t½</tspan>
            <tspan x={430} dy={28}>the number of nuclei</tspan>
            <tspan x={430} dy={18}>halves each half-life.</tspan>
          </text>
        )}
      </svg>
    </div>
  );
}

// ── em_induction ──────────────────────────────────────────────────────────────
export function CatalogEMInductionRenderer({ figure }: { figure: EMInductionFigure }) {
  const N = emInductionFeatureNames;
  const W = 680;
  const H = 356;
  const cy = 122;
  const inMotion = figure.movingIn;

  // magnet geometry (N faces the coil, on the right of the magnet)
  const magL = 62;
  const magR = 202;
  const magH = 46;
  const magMid = (magL + magR) / 2;

  // Coil drawn as a real helix (front strands dark, back strands light) so the
  // winding sense, and with it the current direction, can be read off.
  const coilX0 = 296;
  const turns = 6;
  const pitch = 28;
  const ry = 44;
  const tilt = 11;
  const coilX1 = coilX0 + turns * pitch;
  const helix = (phi: number): [number, number] => [
    coilX0 + (pitch * phi) / (2 * Math.PI) + tilt * Math.sin(phi),
    cy + ry * Math.cos(phi), // phi = 0 at the bottom; 0..π is the front half, rising
  ];
  const strand = (turn: number, front: boolean) => {
    const pts: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const [x, y] = helix(2 * Math.PI * turn + (front ? 0 : Math.PI) + (Math.PI * i) / 24);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  // Circuit: a plain rectangle from the two coil ends down to the galvanometer.
  const yW = cy + ry + 76;
  const gX = (coilX0 + coilX1) / 2;
  const gR = 24;
  // Lenz: with N approaching from the left the coil's near end must be N, so the
  // induced field inside points left; on the front strands the current then runs
  // upward, i.e. along the helix from the left end to the right end, and round
  // the outside circuit from the right end back to the left. Reversed for "out".
  const down = inMotion; // current direction in the right-hand lead
  const aMid = (cy + ry + yW) / 2;
  const head = (x: number, y: number, dy: number) => (
    <polygon points={`${x},${y + dy * 7} ${x - 6},${y - dy * 5} ${x + 6},${y - dy * 5}`} fill={GREEN} />
  );
  const nearPole = inMotion ? 'N' : 'S';
  const farPole = inMotion ? 'S' : 'N';
  const poleColor = (p: string) => (p === 'N' ? RED : BLUE);

  return (
    <div className="w-full flex flex-col items-center">
      {figure.title
        ? <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
        : <div className="text-base font-semibold text-gray-800 mb-2">Electromagnetic induction (Faraday / Lenz)</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Electromagnetic induction'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="emi-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
        </defs>

        {/* motion arrow above the magnet */}
        <g>
          <line
            x1={magMid - (inMotion ? 44 : -44)}
            y1={cy - magH / 2 - 22}
            x2={magMid + (inMotion ? 44 : -44)}
            y2={cy - magH / 2 - 22}
            stroke={INK}
            strokeWidth={2.5}
            markerEnd="url(#emi-arr)"
          />
          <text x={magMid} y={cy - magH / 2 - 31} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700} fontStyle="italic">v</text>
        </g>

        {/* bar magnet — S | N, N faces the coil */}
        <g data-feature={N.magnet} data-feature-label="Bar magnet">
          <rect x={magL} y={cy - magH / 2} width={(magR - magL) / 2} height={magH} fill={BLUE} stroke={INK} strokeWidth={1} />
          <rect x={magMid} y={cy - magH / 2} width={(magR - magL) / 2} height={magH} fill={RED} stroke={INK} strokeWidth={1} />
          <text x={(magL + magMid) / 2} y={cy + 6} fontSize={18} textAnchor="middle" fill="#fff" fontWeight={700}>S</text>
          <text x={(magMid + magR) / 2} y={cy + 6} fontSize={18} textAnchor="middle" fill="#fff" fontWeight={700}>N</text>
        </g>

        {/* coil */}
        <g data-feature={N.coil} data-feature-label="Coil">
          {Array.from({ length: turns }, (_, i) => (
            <polyline key={`b${i}`} points={strand(i, false)} fill="none" stroke={GRAY} strokeWidth={1.8} />
          ))}
          {Array.from({ length: turns }, (_, i) => (
            <polyline key={`f${i}`} points={strand(i, true)} fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          ))}
          <text x={gX} y={cy - ry - 14} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600}>coil</text>
          {/* induced poles of the coil */}
          <text x={coilX0 - 4} y={cy - ry - 14} fontSize={15} textAnchor="middle" fill={poleColor(nearPole)} fontWeight={700}>{nearPole}</text>
          <text x={coilX1 + 4} y={cy - ry - 14} fontSize={15} textAnchor="middle" fill={poleColor(farPole)} fontWeight={700}>{farPole}</text>
        </g>

        {/* leads + induced current */}
        <g data-feature={N.current} data-feature-label="Induced current">
          <polyline points={`${coilX0},${cy + ry} ${coilX0},${yW} ${gX - gR},${yW}`} fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          <polyline points={`${coilX1},${cy + ry} ${coilX1},${yW} ${gX + gR},${yW}`} fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          {head(coilX1, aMid, down ? 1 : -1)}
          {head(coilX0, aMid, down ? -1 : 1)}
          <text x={coilX1 + 14} y={aMid + 4} fontSize={12} textAnchor="start" fill={GREEN} fontWeight={700}>induced current</text>
        </g>

        {/* galvanometer */}
        <g data-feature={N.galvanometer} data-feature-label="Galvanometer">
          <circle cx={gX} cy={yW} r={gR} fill="#fff" stroke={INK} strokeWidth={2} />
          <path d={`M ${gX - 15} ${yW - 9} A 17.5 17.5 0 0 1 ${gX + 15} ${yW - 9}`} fill="none" stroke={GRAY} strokeWidth={1.2} />
          <line x1={gX} y1={yW - 21} x2={gX} y2={yW - 15} stroke={GRAY} strokeWidth={1.2} />
          {/* needle: deflects one way for 'in', the other for 'out' */}
          <line x1={gX} y1={yW + 6} x2={gX + (inMotion ? 12 : -12)} y2={yW - 14} stroke={RED} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={gX} cy={yW + 6} r={2.6} fill={INK} />
          <text x={gX} y={yW + gR + 16} fontSize={12} textAnchor="middle" fill={INK} fontWeight={600}>galvanometer</text>
        </g>

        {/* caption */}
        <text x={W / 2} y={H - 26} fontSize={12} textAnchor="middle" fill={INK}>
          {inMotion
            ? 'Magnet moving toward the coil: the flux through the coil increases.'
            : 'Magnet moving away from the coil: the flux through the coil decreases.'}
        </text>
        <text x={W / 2} y={H - 9} fontSize={12} textAnchor="middle" fill={INK}>
          {inMotion
            ? 'The induced current makes the near end a N pole, which repels the magnet (Lenz\'s law).'
            : 'The induced current makes the near end a S pole, which attracts the magnet (Lenz\'s law).'}
        </text>
      </svg>
    </div>
  );
}

// ── magnetic_field_current ────────────────────────────────────────────────────
export function CatalogMagneticFieldRenderer({ figure }: { figure: MagneticFieldFigure }) {
  const N = magneticFieldFeatureNames;
  const W = 680;

  if (figure.conductor === 'wire') {
    const H = 372;
    const cx = W / 2;
    const cy = 172;
    const radii = [40, 72, 104, 136];
    const keyX = (cx - radii[radii.length - 1]) / 2;
    return (
      <div className="w-full flex flex-col items-center">
        {figure.title
          ? <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
          : <div className="text-base font-semibold text-gray-800 mb-2">Magnetic field around a straight wire</div>}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-[700px]"
          data-feature={N.figure}
          data-feature-label={figure.title || 'Field around a wire'}
          data-feature-cx={0.5}
          data-feature-cy={0.5}
          data-feature-w={1}
          data-feature-h={1}
        >
          {/* concentric field circles (counter-clockwise: current out of page) */}
          <g data-feature={N.fieldLines} data-feature-label="Field lines">
            {radii.map((r) => (
              <g key={r}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={BLUE} strokeWidth={2} opacity={0.85} />
                {/* arrowheads: top pointing left, bottom pointing right → counter-clockwise */}
                <polygon points={`${cx - 7},${cy - r} ${cx + 5},${cy - r - 6} ${cx + 5},${cy - r + 6}`} fill={BLUE} />
                <polygon points={`${cx + 7},${cy + r} ${cx - 5},${cy + r - 6} ${cx - 5},${cy + r + 6}`} fill={BLUE} />
              </g>
            ))}
            <text x={cx + radii[radii.length - 1] + 10} y={cy + 5} fontSize={16} textAnchor="start" fill={BLUE} fontWeight={700} fontStyle="italic">B</text>
          </g>

          {/* the wire, out of the page (⊙) */}
          <g data-feature={N.conductor} data-feature-label="Wire">
            <circle cx={cx} cy={cy} r={11} fill="#fff" stroke={INK} strokeWidth={2} />
            <circle cx={cx} cy={cy} r={3.4} fill={INK} />
          </g>

          {/* key for the wire symbol, in the free column beside the rings */}
          <g>
            <circle cx={keyX} cy={cy - 22} r={11} fill="#fff" stroke={INK} strokeWidth={2} />
            <circle cx={keyX} cy={cy - 22} r={3.4} fill={INK} />
            <text x={keyX} y={cy + 10} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600}>
              <tspan x={keyX}>wire: current I,</tspan>
              <tspan x={keyX} dy={16}>out of the page</tspan>
            </text>
          </g>

          {/* right-hand-rule note */}
          <text x={W / 2} y={H - 14} fontSize={12} textAnchor="middle" fill={INK}>
            Right-hand rule: thumb along the current (out of the page), fingers curl the way B circles
          </text>
        </svg>
      </div>
    );
  }

  // solenoid — each field line runs straight through the inside and closes
  // outside as one smooth elliptical arc from the N end round to the S end.
  // Lines nearer the axis make the wider loops, so the loops nest and never cross.
  const H = 420;
  const bodyL = 240;
  const bodyR = 440;
  const cy = 184;
  const halfH = 40;
  const topY = cy - halfH;
  const botY = cy + halfH;
  const midX = (bodyL + bodyR) / 2;
  const halfL = (bodyR - bodyL) / 2;
  const nCoils = 8;
  const coilXs = Array.from({ length: nCoils }, (_, i) => bodyL + 12 + i * ((bodyR - bodyL - 24) / (nCoils - 1)));
  // [offset of the inside stretch from the axis, reach past the ends, height of the loop above the axis]
  const loopSpecs: [number, number, number][] = [
    [0.75 * halfH, 28, halfH + 30],
    [0.5 * halfH, 52, halfH + 64],
    [0.25 * halfH, 80, halfH + 104],
  ];
  const loops = loopSpecs.flatMap(([u, reach, top]) => {
    const a = halfL + reach;
    const sFace = Math.sqrt(1 - (halfL / a) ** 2);
    const b = (top - u) / (1 + sFace); // ellipse through both end points with its top at `top`
    return [-1, 1].map((sgn) => ({ y: cy + sgn * u, a, b, apex: cy + sgn * top, sweep: sgn < 0 ? 0 : 1 }));
  });
  const head = (x: number, y: number, dir: 1 | -1) => (
    <polygon points={`${x + dir * 6.5},${y} ${x - dir * 5},${y - 5.5} ${x - dir * 5},${y + 5.5}`} fill={BLUE} />
  );
  const axisReach = 118;
  const halo = { stroke: '#fff', strokeWidth: 5, paintOrder: 'stroke' as const, strokeLinejoin: 'round' as const };

  return (
    <div className="w-full flex flex-col items-center">
      {figure.title
        ? <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
        : <div className="text-base font-semibold text-gray-800 mb-2">Magnetic field of a solenoid</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Field of a solenoid'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <g data-feature={N.fieldLines} data-feature-label="Field lines">
          {/* axis line: straight through and out of both ends */}
          <line x1={bodyL - axisReach} y1={cy} x2={bodyR + axisReach} y2={cy} stroke={BLUE} strokeWidth={1.8} />
          {head(bodyL - axisReach / 2 - 20, cy, 1)}
          {head(midX, cy, 1)}
          {head(bodyR + axisReach / 2 + 20, cy, 1)}
          {loops.map((lp, i) => (
            <g key={i}>
              {/* inside: uniform, towards N */}
              <line x1={bodyL} y1={lp.y} x2={bodyR} y2={lp.y} stroke={BLUE} strokeWidth={1.8} />
              {head(midX, lp.y, 1)}
              {/* outside: N end round to S end */}
              <path d={`M ${bodyR} ${lp.y} A ${lp.a.toFixed(1)} ${lp.b.toFixed(1)} 0 1 ${lp.sweep} ${bodyL} ${lp.y}`} fill="none" stroke={BLUE} strokeWidth={1.8} />
              {head(midX, lp.apex, -1)}
            </g>
          ))}
        </g>
        <text x={midX + 44} y={cy - 4} fontSize={15} textAnchor="middle" fill={BLUE} fontWeight={700} fontStyle="italic" {...halo}>B</text>

        {/* windings in section — top ⊙ (out of page), bottom ⊗ (into page): by the
            right-hand rule that gives a field to the right inside */}
        <g data-feature={N.conductor} data-feature-label="Solenoid">
          {coilXs.map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={topY} r={8.5} fill="#fff" stroke={INK} strokeWidth={1.6} />
              <circle cx={x} cy={topY} r={2.6} fill={INK} />
              <circle cx={x} cy={botY} r={8.5} fill="#fff" stroke={INK} strokeWidth={1.6} />
              <line x1={x - 5.5} y1={botY - 5.5} x2={x + 5.5} y2={botY + 5.5} stroke={INK} strokeWidth={1.4} />
              <line x1={x - 5.5} y1={botY + 5.5} x2={x + 5.5} y2={botY - 5.5} stroke={INK} strokeWidth={1.4} />
            </g>
          ))}
        </g>

        {/* poles, named at the two ends of the axis line */}
        <g data-feature={N.poles} data-feature-label="Poles (N / S)">
          <text x={bodyR + axisReach + 10} y={cy + 7} fontSize={20} textAnchor="start" fill={RED} fontWeight={700}>N</text>
          <text x={bodyL - axisReach - 10} y={cy + 7} fontSize={20} textAnchor="end" fill={BLUE} fontWeight={700}>S</text>
        </g>

        <text x={W / 2} y={H - 32} fontSize={12} textAnchor="middle" fill={INK}>
          ⊙ current out of the page (top)   ·   ⊗ current into the page (bottom)
        </text>
        <text x={W / 2} y={H - 13} fontSize={12} textAnchor="middle" fill={INK}>
          The field is uniform inside; the right-hand rule gives N at the right end
        </text>
      </svg>
    </div>
  );
}

// ── projectile_motion ─────────────────────────────────────────────────────────
/** "v" with a real subscript (no raw "v_y"), followed by the rest of the label. */
function VSub({ sub, rest = '' }: { sub: string; rest?: string }) {
  return (
    <>
      <tspan fontStyle="italic">v</tspan>
      <tspan dy={3.5} fontSize="0.72em">{sub}</tspan>
      <tspan dy={-3.5}>{rest || '\u200b'}</tspan>
    </>
  );
}

export function CatalogProjectileRenderer({ figure }: { figure: ProjectileFigure }) {
  const N = projectileFeatureNames;
  const W = 680;
  const H = 388;
  const ground = 300;
  const theta = (figure.angle * Math.PI) / 180;
  const sin2 = Math.sin(2 * theta);
  const sin1 = Math.sin(theta);

  // fit the parabola into the frame: budget 470px range, 226px height
  const S = Math.min(470 / Math.max(sin2, 1e-3), 452 / Math.max(sin1 * sin1, 1e-3));
  const R = S * sin2;
  const Hmax = (S * sin1 * sin1) / 2;
  // Centre the flight in the frame; the left margin keeps room for the v-y label.
  const ox = Math.max(118, (W - R) / 2);

  const px = (x: number) => ox + x;
  const py = (y: number) => ground - y;
  const yOf = (x: number) => (4 * Hmax * x * (R - x)) / (R * R);

  const path: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = (i / 120) * R;
    path.push(`${px(x).toFixed(1)},${py(yOf(x)).toFixed(1)}`);
  }

  const apexX = px(R / 2);
  const apexY = py(Hmax);
  const landX = px(R);

  // launch velocity vector
  const Lv = 96;
  const vx = Lv * Math.cos(theta);
  const vy = Lv * Math.sin(theta);
  const vTipX = ox + vx;
  const vTipY = ground - vy;
  // Angle arc: wide for shallow launches, tight for steep ones, so it stays
  // inside the velocity vector; the θ label goes just past whichever reaches
  // further along the ground (arc or vₓ), below the path, where nothing crosses.
  const arcR = Math.max(30, Math.min(60, vx - 16));
  const thetaX = ox + Math.max(arcR, figure.showComponents ? vx : 0) + 9;
  const halo = { stroke: '#fff', strokeWidth: 4, paintOrder: 'stroke' as const, strokeLinejoin: 'round' as const };
  // apex label sits above the apex; its vₓ arrow runs to the right of it
  const dimY = ground + 48;
  // A flat flight leaves the top of the frame empty: crop it so the figure stays centred.
  const yCrop = Math.max(0, Math.min(apexY - 46, vTipY - 30) - 16);

  return (
    <div className="w-full flex flex-col items-center">
      {figure.title
        ? <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
        : <div className="text-base font-semibold text-gray-800 mb-2">{`Projectile motion (launch angle ${figure.angle}°)`}</div>}
      <svg
        viewBox={`0 ${yCrop} ${W} ${H - yCrop}`}
        className="w-full max-w-[700px]"
        data-feature={N.figure}
        data-feature-label={figure.title || `Projectile motion (${figure.angle}°)`}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="pm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
          <marker id="pm-arr-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={RED} />
          </marker>
          <marker id="pm-arr-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
          </marker>
          <marker id="pm-arr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GREEN} />
          </marker>
        </defs>

        {/* ground */}
        <line x1={30} y1={ground} x2={W - 30} y2={ground} stroke={INK} strokeWidth={2} />
        {Array.from({ length: 16 }, (_, i) => 46 + i * 40).map((hx) => (
          <line key={hx} x1={hx} y1={ground} x2={hx - 9} y2={ground + 9} stroke={GRAY} strokeWidth={1} />
        ))}

        {/* trajectory */}
        <g data-feature={N.trajectory} data-feature-label="Trajectory">
          <polyline points={path.join(' ')} fill="none" stroke={ORANGE} strokeWidth={3} />
        </g>

        {/* max-height guide + apex */}
        <g data-feature={N.apex} data-feature-label="Apex (max height)">
          <line x1={apexX} y1={apexY} x2={apexX} y2={ground} stroke={GRAY} strokeWidth={1.3} strokeDasharray="5 4" />
          <circle cx={apexX} cy={apexY} r={5} fill={ORANGE} stroke="#fff" strokeWidth={1.4} />
          {/* horizontal-only velocity at apex */}
          <line x1={apexX} y1={apexY} x2={apexX + 56} y2={apexY} stroke={BLUE} strokeWidth={2.2} markerEnd="url(#pm-arr-b)" />
          <text x={apexX + 32} y={apexY - 9} fontSize={13} textAnchor="middle" fill={BLUE} fontWeight={600}><VSub sub="x" /></text>
          <text x={apexX} y={apexY - 32} fontSize={12} textAnchor="middle" fill={ORANGE} fontWeight={700}>
            apex (<VSub sub="y" rest=" = 0)" />
          </text>
          <text x={apexX + 8} y={(apexY + ground) / 2 + 4} fontSize={13} textAnchor="start" fill={INK} fontWeight={600} fontStyle="italic" {...halo}>H</text>
        </g>

        {/* range dimension, below the ground hatching and the vₓ label */}
        <g data-feature={N.range} data-feature-label="Range">
          <line x1={ox} y1={dimY - 8} x2={ox} y2={dimY + 8} stroke={GRAY} strokeWidth={1.2} />
          <line x1={landX} y1={dimY - 8} x2={landX} y2={dimY + 8} stroke={GRAY} strokeWidth={1.2} />
          <line x1={ox + 1} y1={dimY} x2={landX - 1} y2={dimY} stroke={INK} strokeWidth={1.4} markerStart="url(#pm-arr)" markerEnd="url(#pm-arr)" />
          <text x={(ox + landX) / 2} y={dimY + 18} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600}>
            <tspan fontStyle="italic">R</tspan> (range)
          </text>
          <circle cx={landX} cy={ground} r={3.4} fill={INK} />
        </g>

        {/* launch velocity components: both drawn from the launch point */}
        {figure.showComponents && (
          <g data-feature={N.velocity} data-feature-label="Launch velocity components">
            {/* projection guides from the tip of v */}
            <line x1={vTipX} y1={vTipY} x2={vTipX} y2={ground} stroke={GRAY} strokeWidth={1.2} strokeDasharray="4 4" />
            <line x1={vTipX} y1={vTipY} x2={ox} y2={vTipY} stroke={GRAY} strokeWidth={1.2} strokeDasharray="4 4" />
            <line x1={ox} y1={ground} x2={vTipX} y2={ground} stroke={BLUE} strokeWidth={2.4} markerEnd="url(#pm-arr-b)" />
            <line x1={ox} y1={ground} x2={ox} y2={vTipY} stroke={GREEN} strokeWidth={2.4} markerEnd="url(#pm-arr-g)" />
            <text x={ox + Math.max(vx / 2, 8)} y={ground + 27} fontSize={12} textAnchor="middle" fill={BLUE} fontWeight={600}>
              <VSub sub="x" rest=" = " /><tspan fontStyle="italic">v</tspan>·cos θ
            </text>
            <text x={ox - 15} y={ground - Math.max(vy / 2, 12) + 4} fontSize={12} textAnchor="end" fill={GREEN} fontWeight={600}>
              <VSub sub="y" rest=" = " /><tspan fontStyle="italic">v</tspan>·sin θ
            </text>
          </g>
        )}
        {/* resultant v (always) */}
        <line x1={ox} y1={ground} x2={vTipX} y2={vTipY} stroke={RED} strokeWidth={2.6} markerEnd="url(#pm-arr-r)" />
        <text x={vTipX - 3} y={vTipY - 9} fontSize={15} textAnchor="middle" fill={RED} fontWeight={700} fontStyle="italic" {...halo}>v</text>

        {/* launch point */}
        <circle cx={ox} cy={ground} r={4.2} fill={INK} />

        {/* angle arc + value */}
        <path
          d={`M ${ox + arcR} ${ground} A ${arcR} ${arcR} 0 0 0 ${ox + arcR * Math.cos(theta)} ${ground - arcR * Math.sin(theta)}`}
          fill="none"
          stroke={INK}
          strokeWidth={1.6}
        />
        <text x={thetaX} y={ground - 7} fontSize={13} textAnchor="start" fill={INK} fontWeight={700} {...halo}>{`θ = ${figure.angle}°`}</text>
      </svg>
    </div>
  );
}
