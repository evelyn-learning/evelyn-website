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
        <text x={187} y={eqCy - 12} fontSize={13} textAnchor="middle" fill={ORANGE} fontWeight={700}>
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
            <tspan x={430} dy={22}>N = N₀ · (½)^(t / t½)</tspan>
            <tspan x={430} dy={22}>the number of nuclei</tspan>
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
  const H = 340;
  const cy = 150;
  const inMotion = figure.movingIn;

  // magnet geometry (N faces the coil, on the right of the magnet)
  const magL = 70;
  const magR = 210;
  const magH = 46;
  const magMid = (magL + magR) / 2;

  // coil geometry (helix of loops, axis horizontal facing the magnet)
  const coilX0 = 300;
  const loops = 6;
  const dxL = 22;
  const ry = 46;
  const rx = 9;

  // galvanometer
  const gX = 540;
  const gY = 236;

  const coilRightX = coilX0 + (loops - 1) * dxL;

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
          <marker id="emi-arr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GREEN} />
          </marker>
        </defs>

        {/* motion arrow */}
        <g>
          {inMotion ? (
            <line x1={magMid} y1={cy - magH / 2 - 26} x2={magR + 46} y2={cy - magH / 2 - 26} stroke={INK} strokeWidth={2.5} markerEnd="url(#emi-arr)" />
          ) : (
            <line x1={magMid} y1={cy - magH / 2 - 26} x2={magL - 46} y2={cy - magH / 2 - 26} stroke={INK} strokeWidth={2.5} markerEnd="url(#emi-arr)" />
          )}
          <text x={inMotion ? magR + 4 : magL - 4} y={cy - magH / 2 - 32} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700} fontStyle="italic">v</text>
        </g>

        {/* bar magnet — S | N, N faces the coil */}
        <g data-feature={N.magnet} data-feature-label="Bar magnet">
          <rect x={magL} y={cy - magH / 2} width={(magR - magL) / 2} height={magH} fill={BLUE} stroke={INK} strokeWidth={1} />
          <rect x={magMid} y={cy - magH / 2} width={(magR - magL) / 2} height={magH} fill={RED} stroke={INK} strokeWidth={1} />
          <text x={(magL + magMid) / 2} y={cy + 5} fontSize={18} textAnchor="middle" fill="#fff" fontWeight={700}>S</text>
          <text x={(magMid + magR) / 2} y={cy + 5} fontSize={18} textAnchor="middle" fill="#fff" fontWeight={700}>N</text>
        </g>

        {/* coil (helix of loops) */}
        <g data-feature={N.coil} data-feature-label="Coil">
          {Array.from({ length: loops }, (_, i) => (
            <ellipse
              key={i}
              cx={coilX0 + i * dxL}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={INK}
              strokeWidth={2.2}
            />
          ))}
          <text x={(coilX0 + coilRightX) / 2} y={cy - ry - 12} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600}>coil</text>
        </g>

        {/* leads from coil to galvanometer + induced current arrows */}
        <g data-feature={N.current} data-feature-label="Induced current">
          {/* top lead */}
          <polyline
            points={`${coilRightX},${cy - ry} ${gX},${cy - ry} ${gX},${gY - 26}`}
            fill="none"
            stroke={GREEN}
            strokeWidth={2.4}
          />
          {/* bottom lead */}
          <polyline
            points={`${coilRightX},${cy + ry} ${gX + 40},${cy + ry} ${gX + 40},${gY}`}
            fill="none"
            stroke={GREEN}
            strokeWidth={2.4}
          />
          {/* current-direction arrowhead on the top lead */}
          <line
            x1={inMotion ? coilRightX + 70 : gX - 8}
            y1={cy - ry}
            x2={inMotion ? coilRightX + 108 : gX - 46}
            y2={cy - ry}
            stroke={GREEN}
            strokeWidth={2.4}
            markerEnd="url(#emi-arr-g)"
          />
          <text x={(coilRightX + gX) / 2} y={cy - ry - 8} fontSize={11.5} textAnchor="middle" fill={GREEN} fontWeight={700}>induced current</text>
        </g>

        {/* galvanometer */}
        <g data-feature={N.galvanometer} data-feature-label="Galvanometer">
          <circle cx={gX + 20} cy={gY} r={26} fill="#fff" stroke={INK} strokeWidth={2} />
          {/* needle: deflects one way for 'in', the other for 'out' */}
          <line
            x1={gX + 20}
            y1={gY}
            x2={gX + 20 + (inMotion ? 15 : -15)}
            y2={gY - 18}
            stroke={RED}
            strokeWidth={2.4}
          />
          <circle cx={gX + 20} cy={gY} r={2.6} fill={INK} />
          <text x={gX + 20} y={gY + 42} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={700}>G</text>
        </g>

        {/* caption */}
        <text x={W / 2} y={H - 12} fontSize={12} textAnchor="middle" fill={INK}>
          {inMotion
            ? 'Magnet moving toward coil → flux increasing → induced current opposes it (Lenz\'s law)'
            : 'Magnet moving away → flux decreasing → induced current opposes the change (Lenz\'s law)'}
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
    const H = 380;
    const cx = 330;
    const cy = 196;
    const radii = [40, 72, 104, 136];
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
          <defs>
            <marker id="mf-arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
            </marker>
          </defs>

          {/* concentric field circles (counter-clockwise: current out of page) */}
          <g data-feature={N.fieldLines} data-feature-label="Field lines">
            {radii.map((r) => (
              <g key={r}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={BLUE} strokeWidth={2} opacity={0.85} />
                {/* arrowhead at top pointing left → counter-clockwise */}
                <line x1={cx + 6} y1={cy - r} x2={cx - 6} y2={cy - r} stroke={BLUE} strokeWidth={2} markerEnd="url(#mf-arr)" />
                {/* arrowhead at bottom pointing right → counter-clockwise */}
                <line x1={cx - 6} y1={cy + r} x2={cx + 6} y2={cy + r} stroke={BLUE} strokeWidth={2} markerEnd="url(#mf-arr)" />
              </g>
            ))}
            <text x={cx + radii[radii.length - 1] + 6} y={cy + 4} fontSize={14} textAnchor="start" fill={BLUE} fontWeight={700} fontStyle="italic">B</text>
          </g>

          {/* the wire, out of the page (⊙) */}
          <g data-feature={N.conductor} data-feature-label="Wire">
            <circle cx={cx} cy={cy} r={11} fill="#fff" stroke={INK} strokeWidth={2} />
            <circle cx={cx} cy={cy} r={3.4} fill={INK} />
            <text x={cx} y={cy + 40 + radii[0]} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600}>
              I (out of page)
            </text>
          </g>

          {/* right-hand-rule note */}
          <text x={W / 2} y={H - 14} fontSize={12} textAnchor="middle" fill={INK}>
            Right-hand rule: thumb → current (out of page), fingers curl → B field
          </text>
        </svg>
      </div>
    );
  }

  // solenoid
  const H = 360;
  const bodyL = 180;
  const bodyR = 500;
  const cy = 168;
  const halfH = 58;
  const topY = cy - halfH;
  const botY = cy + halfH;
  const nCoils = 8;
  const coilXs = Array.from({ length: nCoils }, (_, i) => bodyL + 18 + i * ((bodyR - bodyL - 36) / (nCoils - 1)));

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
        <defs>
          <marker id="sol-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
          </marker>
        </defs>

        {/* external field loops (N on the right, S on the left) */}
        <g data-feature={N.fieldLines} data-feature-label="Field lines">
          {[0, 1].map((k) => {
            const spread = 34 + k * 30;
            return (
              <path
                key={k}
                d={`M ${bodyR} ${cy - 6} C ${bodyR + 90 + k * 40} ${cy - spread - 24}, ${bodyL - 90 - k * 40} ${cy - spread - 24}, ${bodyL} ${cy - 6}`}
                fill="none"
                stroke={BLUE}
                strokeWidth={1.8}
                opacity={0.75}
              />
            );
          })}
          {[0, 1].map((k) => {
            const spread = 34 + k * 30;
            return (
              <path
                key={`b${k}`}
                d={`M ${bodyR} ${cy + 6} C ${bodyR + 90 + k * 40} ${cy + spread + 24}, ${bodyL - 90 - k * 40} ${cy + spread + 24}, ${bodyL} ${cy + 6}`}
                fill="none"
                stroke={BLUE}
                strokeWidth={1.8}
                opacity={0.75}
              />
            );
          })}
          {/* interior uniform field arrows (point toward N = right) */}
          {[cy - 24, cy, cy + 24].map((yy, i) => (
            <line key={i} x1={bodyL + 30} y1={yy} x2={bodyR - 24} y2={yy} stroke={BLUE} strokeWidth={2.2} markerEnd="url(#sol-arr)" />
          ))}
          <text x={(bodyL + bodyR) / 2} y={cy - 34} fontSize={13} textAnchor="middle" fill={BLUE} fontWeight={700} fontStyle="italic">B</text>
        </g>

        {/* solenoid windings — top ⊗ (into page), bottom ⊙ (out of page) */}
        <g data-feature={N.conductor} data-feature-label="Solenoid">
          {coilXs.map((x, i) => (
            <g key={i}>
              {/* top: into page */}
              <circle cx={x} cy={topY} r={9} fill="#fff" stroke={INK} strokeWidth={1.6} />
              <line x1={x - 6} y1={topY - 6} x2={x + 6} y2={topY + 6} stroke={INK} strokeWidth={1.4} />
              <line x1={x - 6} y1={topY + 6} x2={x + 6} y2={topY - 6} stroke={INK} strokeWidth={1.4} />
              {/* bottom: out of page */}
              <circle cx={x} cy={botY} r={9} fill="#fff" stroke={INK} strokeWidth={1.6} />
              <circle cx={x} cy={botY} r={2.6} fill={INK} />
            </g>
          ))}
        </g>

        {/* poles */}
        <g data-feature={N.poles} data-feature-label="Poles (N / S)">
          <text x={bodyR + 12} y={cy + 6} fontSize={20} textAnchor="start" fill={RED} fontWeight={700}>N</text>
          <text x={bodyL - 12} y={cy + 6} fontSize={20} textAnchor="end" fill={BLUE} fontWeight={700}>S</text>
        </g>

        <text x={W / 2} y={H - 30} fontSize={11.5} textAnchor="middle" fill={INK}>
          ⊗ current into page (top)   ·   ⊙ current out of page (bottom)
        </text>
        <text x={W / 2} y={H - 12} fontSize={12} textAnchor="middle" fill={INK}>
          Field is uniform inside; the right-hand rule gives N at the right end
        </text>
      </svg>
    </div>
  );
}

// ── projectile_motion ─────────────────────────────────────────────────────────
export function CatalogProjectileRenderer({ figure }: { figure: ProjectileFigure }) {
  const N = projectileFeatureNames;
  const W = 680;
  const H = 400;
  const ground = 336;
  const ox = 78; // launch x
  const theta = (figure.angle * Math.PI) / 180;
  const sin2 = Math.sin(2 * theta);
  const sin1 = Math.sin(theta);

  // fit the parabola into the frame: budget 480px range, 232px height
  const S = Math.min(480 / Math.max(sin2, 1e-3), 460 / Math.max(sin1 * sin1, 1e-3));
  const R = S * sin2;
  const Hmax = (S * sin1 * sin1) / 2;

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
  const Lv = 92;
  const vTipX = ox + Lv * Math.cos(theta);
  const vTipY = ground - Lv * Math.sin(theta);

  return (
    <div className="w-full flex flex-col items-center">
      {figure.title
        ? <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
        : <div className="text-base font-semibold text-gray-800 mb-2">{`Projectile motion (launch angle ${figure.angle}°)`}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px]"
        data-feature={N.figure}
        data-feature-label={figure.title || `Projectile motion (${figure.angle}°)`}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="pm-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
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
        <line x1={40} y1={ground} x2={W - 30} y2={ground} stroke={INK} strokeWidth={2} />
        {Array.from({ length: 16 }, (_, i) => 46 + i * 40).map((hx) => (
          <line key={hx} x1={hx} y1={ground} x2={hx - 10} y2={ground + 10} stroke={GRAY} strokeWidth={1} />
        ))}

        {/* trajectory */}
        <g data-feature={N.trajectory} data-feature-label="Trajectory">
          <polyline points={path.join(' ')} fill="none" stroke={ORANGE} strokeWidth={3} />
        </g>

        {/* max-height guide + apex */}
        <g data-feature={N.apex} data-feature-label="Apex (max height)">
          <line x1={apexX} y1={apexY} x2={apexX} y2={ground} stroke={FAINT} strokeWidth={1.4} strokeDasharray="5 4" />
          <circle cx={apexX} cy={apexY} r={5} fill={ORANGE} stroke="#fff" strokeWidth={1.4} />
          {/* horizontal-only velocity at apex */}
          <line x1={apexX} y1={apexY} x2={apexX + 52} y2={apexY} stroke={BLUE} strokeWidth={2.2} markerEnd="url(#pm-arr-b)" />
          <text x={apexX + 28} y={apexY - 7} fontSize={11.5} textAnchor="middle" fill={BLUE}>vₓ</text>
          <text x={apexX} y={apexY - 26} fontSize={11.5} textAnchor="middle" fill={ORANGE} fontWeight={700}>apex (v_y = 0)</text>
          <text x={apexX - 8} y={(apexY + ground) / 2} fontSize={12} textAnchor="end" fill={INK} fontWeight={600}>H</text>
        </g>

        {/* range dimension */}
        <g data-feature={N.range} data-feature-label="Range">
          <line x1={ox} y1={ground + 26} x2={landX} y2={ground + 26} stroke={INK} strokeWidth={1.4} markerStart="url(#pm-arr)" markerEnd="url(#pm-arr)" />
          <text x={(ox + landX) / 2} y={ground + 42} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600}>R (range)</text>
          <line x1={ox} y1={ground} x2={ox} y2={ground + 30} stroke={FAINT} strokeWidth={1} />
          <line x1={landX} y1={ground} x2={landX} y2={ground + 30} stroke={FAINT} strokeWidth={1} />
          <circle cx={landX} cy={ground} r={3.4} fill={INK} />
        </g>

        {/* launch point */}
        <circle cx={ox} cy={ground} r={4.2} fill={INK} />

        {/* launch velocity vector + components */}
        {figure.showComponents && (
          <g data-feature={N.velocity} data-feature-label="Launch velocity (vₓ, v_y)">
            {/* components (dashed) */}
            <line x1={ox} y1={ground} x2={vTipX} y2={ground} stroke={BLUE} strokeWidth={1.8} strokeDasharray="5 4" markerEnd="url(#pm-arr-b)" />
            <line x1={vTipX} y1={ground} x2={vTipX} y2={vTipY} stroke={GREEN} strokeWidth={1.8} strokeDasharray="5 4" markerEnd="url(#pm-arr-g)" />
            <text x={(ox + vTipX) / 2} y={ground + 16} fontSize={11.5} textAnchor="middle" fill={BLUE} fontWeight={600}>vₓ = v·cos θ</text>
            <text x={vTipX + 6} y={(ground + vTipY) / 2} fontSize={11.5} textAnchor="start" fill={GREEN} fontWeight={600}>v_y = v·sin θ</text>
          </g>
        )}
        {/* resultant v (always) */}
        <line x1={ox} y1={ground} x2={vTipX} y2={vTipY} stroke={RED} strokeWidth={2.6} markerEnd="url(#pm-arr-r)" />
        <text x={vTipX + (figure.showComponents ? 2 : 6)} y={vTipY - 8} fontSize={14} textAnchor="start" fill={RED} fontWeight={700} fontStyle="italic">v</text>

        {/* angle arc */}
        <path
          d={`M ${ox + 40} ${ground} A 40 40 0 0 0 ${ox + 40 * Math.cos(theta)} ${ground - 40 * Math.sin(theta)}`}
          fill="none"
          stroke={INK}
          strokeWidth={1.6}
        />
        <text x={ox + 52} y={ground - 14} fontSize={13} textAnchor="start" fill={INK} fontWeight={700}>{`θ = ${figure.angle}°`}</text>
      </svg>
    </div>
  );
}
