'use client';

import React from 'react';
import {
  bohrFeatureNames,
  galvanicFeatureNames,
  titrationFeatureNames,
  latticeFeatureNames,
  latticeName,
  eTerm,
  phScaleFeatureNames,
  type BohrFigure,
  type GalvanicFigure,
  type TitrationFigure,
  type LatticeFigure,
  type PhScaleFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/chemistry';

const BLUE = '#2563eb';
const RED = '#dc2626';
const ORANGE = '#ea580c';
const GREEN = '#16a34a';
const GRAY = '#94a3b8';
const FAINT = '#cbd5e1';
const INK = '#374151';

// ── bohr_model ────────────────────────────────────────────────────────────────
export function CatalogBohrRenderer({ figure }: { figure: BohrFigure }) {
  const N = bohrFeatureNames;
  const W = 560;
  const H = 460;
  const cx = W / 2;
  const cy = H / 2;
  const nShells = figure.shells.length;
  const r0 = 52;
  const dr = Math.min(46, (Math.min(W, H) / 2 - r0 - 22) / Math.max(nShells, 1));

  const heading =
    figure.title ||
    (figure.name ? `Bohr model — ${figure.name} (${figure.symbol})` : `Bohr model — ${figure.symbol || 'atom'}`);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[560px]"
        data-feature={N.figure}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* shell orbits */}
        <g data-feature={N.shells} data-feature-label="Electron shells">
          {figure.shells.map((_, i) => (
            <circle
              key={`orbit-${i}`}
              cx={cx}
              cy={cy}
              r={r0 + i * dr}
              fill="none"
              stroke={i === nShells - 1 ? BLUE : FAINT}
              strokeWidth={i === nShells - 1 ? 2 : 1.5}
            />
          ))}
        </g>

        {/* electrons */}
        {figure.shells.map((count, i) => {
          const r = r0 + i * dr;
          const isValence = i === nShells - 1;
          return (
            <g
              key={`el-${i}`}
              data-feature={isValence ? N.valence : undefined}
              data-feature-label={isValence ? 'Valence shell' : undefined}
            >
              {Array.from({ length: count }, (_, k) => {
                const ang = -Math.PI / 2 + (2 * Math.PI * k) / count;
                const ex = cx + r * Math.cos(ang);
                const ey = cy + r * Math.sin(ang);
                return (
                  <circle
                    key={k}
                    cx={ex}
                    cy={ey}
                    r={6}
                    fill={isValence ? BLUE : INK}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                );
              })}
              {/* Shell occupancy, written on the orbit in the gap between two
                  electrons (lower right), so it never sits on an electron. */}
              {(() => {
                const target = Math.PI / 6;
                let best = target;
                if (count > 1) {
                  let bestDiff = Infinity;
                  for (let k = 0; k < count; k++) {
                    const mid = -Math.PI / 2 + (2 * Math.PI * (k + 0.5)) / count;
                    let d = Math.abs(mid - target) % (2 * Math.PI);
                    if (d > Math.PI) d = 2 * Math.PI - d;
                    if (d < bestDiff) { bestDiff = d; best = mid; }
                  }
                }
                const lx = cx + r * Math.cos(best);
                const ly = cy + r * Math.sin(best);
                const label = `${count} e⁻`;
                const w = label.length * 6.2 + 8;
                return (
                  <g>
                    <rect x={lx - w / 2} y={ly - 9} width={w} height={18} rx={9} fill="#ffffff" stroke={isValence ? BLUE : FAINT} strokeWidth={1} />
                    <text x={lx} y={ly + 4} fontSize={11.5} textAnchor="middle" fill={isValence ? BLUE : '#64748b'} fontWeight={700}>
                      {label}
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })}

        {/* nucleus */}
        <g data-feature={N.nucleus} data-feature-label="Nucleus">
          <circle cx={cx} cy={cy} r={30} fill={RED} opacity={0.12} stroke={RED} strokeWidth={1.5} />
          <text x={cx} y={cy - 4} fontSize={13} textAnchor="middle" fill={RED} fontWeight={700}>
            {figure.protons}p⁺
          </text>
          <text x={cx} y={cy + 13} fontSize={13} textAnchor="middle" fill={INK} fontWeight={700}>
            {figure.neutrons}n
          </text>
        </g>

        {/* symbol badge */}
        <text x={22} y={34} fontSize={26} fill={INK} fontWeight={800}>
          {figure.symbol}
        </text>
        <text x={W - 22} y={34} fontSize={12.5} textAnchor="end" fill={GRAY}>
          {`Z = ${figure.protons}   ·   A = ${figure.protons + figure.neutrons}`}
        </text>
        <text x={W / 2} y={H - 8} fontSize={13} textAnchor="middle" fill={INK} fontWeight={600}>
          {`Electrons per shell: ${figure.shells.join(', ')}`}
        </text>
      </svg>
    </div>
  );
}

// ── galvanic_cell ─────────────────────────────────────────────────────────────
export function CatalogGalvanicRenderer({ figure }: { figure: GalvanicFigure }) {
  const N = galvanicFeatureNames;
  const W = 680;
  const H = 470;
  const { anode, cathode } = figure;

  // beaker geometry
  const beakerW = 176;
  const beakerH = 176;
  const beakerTop = 210;
  const solTop = beakerTop + 34; // solution surface
  const leftBX = 66;
  const rightBX = W - 66 - beakerW;
  const leftCenter = leftBX + beakerW / 2;
  const rightCenter = rightBX + beakerW / 2;

  // electrodes
  const elecW = 26;
  const elecTop = 150;
  const elecBottom = beakerTop + beakerH - 26;
  const leftElecX = leftCenter - elecW / 2;
  const rightElecX = rightCenter - elecW / 2;

  // wire + voltmeter
  const wireY = 74;
  const vmX = W / 2;
  const vmY = wireY;

  const Beaker = ({ x, sol }: { x: number; sol: string }) => (
    <g>
      <path
        d={`M ${x} ${beakerTop} L ${x} ${beakerTop + beakerH} L ${x + beakerW} ${beakerTop + beakerH} L ${x + beakerW} ${beakerTop}`}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* solution */}
      <rect x={x + 2} y={solTop} width={beakerW - 4} height={beakerTop + beakerH - solTop - 2} fill={BLUE} opacity={0.1} />
      <line x1={x + 2} y1={solTop} x2={x + beakerW - 2} y2={solTop} stroke={BLUE} strokeWidth={1.5} opacity={0.5} />
      <text x={x + beakerW / 2} y={beakerTop + beakerH - 14} fontSize={13} textAnchor="middle" fill={BLUE} fontWeight={700}>
        {sol}
      </text>
    </g>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">
        {figure.title || `Galvanic cell — ${anode.symbol} ‖ ${cathode.symbol}`}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Galvanic cell'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="gv-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ORANGE} />
          </marker>
        </defs>

        {/* external wire */}
        <polyline
          points={`${leftCenter},${elecTop} ${leftCenter},${wireY} ${vmX - 26},${wireY}`}
          fill="none"
          stroke={INK}
          strokeWidth={2.5}
        />
        <polyline
          points={`${vmX + 26},${wireY} ${rightCenter},${wireY} ${rightCenter},${elecTop}`}
          fill="none"
          stroke={INK}
          strokeWidth={2.5}
        />

        {/* voltmeter */}
        <g data-feature={N.voltmeter} data-feature-label="Voltmeter">
          <circle cx={vmX} cy={vmY} r={26} fill="#fff" stroke={INK} strokeWidth={2.5} />
          <text x={vmX} y={vmY + 7} fontSize={20} textAnchor="middle" fill={INK} fontWeight={700}>
            V
          </text>
        </g>

        {/* electron-flow arrow along the wire (anode → cathode) */}
        <line
          x1={leftCenter + 34}
          y1={wireY - 14}
          x2={vmX - 40}
          y2={wireY - 14}
          stroke={ORANGE}
          strokeWidth={2.5}
          markerEnd="url(#gv-arr)"
        />
        <line
          x1={vmX + 40}
          y1={wireY - 14}
          x2={rightCenter - 34}
          y2={wireY - 14}
          stroke={ORANGE}
          strokeWidth={2.5}
          markerEnd="url(#gv-arr)"
        />
        {/* One label per arrow, centred on it — clear of the voltmeter. */}
        <text x={(leftCenter + 34 + vmX - 40) / 2} y={wireY - 23} fontSize={13} textAnchor="middle" fill={ORANGE} fontWeight={700}>
          e⁻ flow
        </text>
        <text x={(vmX + 40 + rightCenter - 34) / 2} y={wireY - 23} fontSize={13} textAnchor="middle" fill={ORANGE} fontWeight={700}>
          e⁻ flow
        </text>

        {/* salt bridge (inverted U dipping into each solution) */}
        <g data-feature={N.saltBridge} data-feature-label="Salt bridge">
          {(() => {
            const bY = solTop + 6;
            const topY = 150;
            const lx = leftCenter + 58;
            const rx = rightCenter - 58;
            return (
              <path
                d={`M ${lx} ${bY} L ${lx} ${topY} Q ${lx} ${topY - 20} ${lx + 20} ${topY - 20} L ${rx - 20} ${topY - 20} Q ${rx} ${topY - 20} ${rx} ${topY} L ${rx} ${bY}`}
                fill="none"
                stroke={GRAY}
                strokeWidth={11}
                strokeLinejoin="round"
                opacity={0.55}
              />
            );
          })()}
          <text x={W / 2} y={142} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={700}>
            salt bridge
          </text>
          <text x={W / 2} y={158} fontSize={10.5} textAnchor="middle" fill={GRAY}>
            (KNO₃)
          </text>
        </g>

        {/* beakers + solutions */}
        <Beaker x={leftBX} sol={anode.solution} />
        <Beaker x={rightBX} sol={cathode.solution} />

        {/* anode electrode (left, −) */}
        <g data-feature={N.anode} data-feature-label={`Anode (${anode.symbol})`}>
          <rect x={leftElecX} y={elecTop} width={elecW} height={elecBottom - elecTop} fill={anode.color} stroke={INK} strokeWidth={2} />
          {/* Symbol beside the electrode (outer side), not on the wire above it. */}
          <text x={leftElecX - 9} y={elecTop + 22} fontSize={17} textAnchor="end" fill={INK} fontWeight={800}>
            {anode.symbol}
          </text>
          <text x={leftCenter} y={beakerTop + beakerH + 24} fontSize={13.5} textAnchor="middle" fill={RED} fontWeight={800}>
            ANODE (−)
          </text>
          <text x={leftCenter} y={beakerTop + beakerH + 42} fontSize={12.5} textAnchor="middle" fill={INK}>
            oxidation
          </text>
          <text x={leftCenter} y={beakerTop + beakerH + 60} fontSize={13} textAnchor="middle" fill={INK} fontWeight={600}>
            {`${anode.symbol} → ${anode.ion} + ${eTerm(anode.n)}`}
          </text>
        </g>

        {/* cathode electrode (right, +) */}
        <g data-feature={N.cathode} data-feature-label={`Cathode (${cathode.symbol})`}>
          <rect x={rightElecX} y={elecTop} width={elecW} height={elecBottom - elecTop} fill={cathode.color} stroke={INK} strokeWidth={2} />
          <text x={rightElecX + elecW + 9} y={elecTop + 22} fontSize={17} textAnchor="start" fill={INK} fontWeight={800}>
            {cathode.symbol}
          </text>
          <text x={rightCenter} y={beakerTop + beakerH + 24} fontSize={13.5} textAnchor="middle" fill={BLUE} fontWeight={800}>
            CATHODE (+)
          </text>
          <text x={rightCenter} y={beakerTop + beakerH + 42} fontSize={12.5} textAnchor="middle" fill={INK}>
            reduction
          </text>
          <text x={rightCenter} y={beakerTop + beakerH + 60} fontSize={13} textAnchor="middle" fill={INK} fontWeight={600}>
            {`${cathode.ion} + ${eTerm(cathode.n)} → ${cathode.symbol}`}
          </text>
        </g>
      </svg>
    </div>
  );
}

// ── titration_curve ───────────────────────────────────────────────────────────
export function CatalogTitrationRenderer({ figure }: { figure: TitrationFigure }) {
  const N = titrationFeatureNames;
  const W = 640;
  const H = 440;
  const PAD_L = 56;
  const PAD_R = 24;
  const PAD_T = 44;
  const PAD_B = 52;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const vMax = figure.vMax;

  const X = (v: number) => PAD_L + (v / vMax) * plotW;
  const Y = (ph: number) => PAD_T + (1 - ph / 14) * plotH;

  const path = figure.curve.map(([v, ph], i) => `${i === 0 ? 'M' : 'L'} ${X(v).toFixed(1)} ${Y(ph).toFixed(1)}`).join(' ');

  const typeWord = figure.type === 'weak_strong' ? 'weak acid – strong base' : 'strong acid – strong base';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">
        {figure.title || `Titration curve — ${typeWord}`}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Titration curve'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* gridlines (pH) */}
        {[0, 2, 4, 6, 8, 10, 12, 14].map((ph) => (
          <g key={`gy-${ph}`}>
            <line x1={PAD_L} y1={Y(ph)} x2={W - PAD_R} y2={Y(ph)} stroke={FAINT} strokeWidth={1} strokeDasharray="3 4" />
            <text x={PAD_L - 8} y={Y(ph) + 4} fontSize={11} textAnchor="end" fill={GRAY}>
              {ph}
            </text>
          </g>
        ))}
        {/* x ticks (volume) */}
        {[0, 10, 20, 30, 40, 50].filter((v) => v <= vMax).map((v) => (
          <text key={`gx-${v}`} x={X(v)} y={H - PAD_B + 18} fontSize={11} textAnchor="middle" fill={GRAY}>
            {v}
          </text>
        ))}

        {/* buffer region shading (weak-strong only) */}
        {figure.bufferRegion && (
          <g data-feature={N.buffer} data-feature-label="Buffer region">
            <rect
              x={X(figure.bufferRegion[0])}
              y={PAD_T}
              width={X(figure.bufferRegion[1]) - X(figure.bufferRegion[0])}
              height={plotH}
              fill={GREEN}
              opacity={0.08}
            />
            <text
              x={(X(figure.bufferRegion[0]) + X(figure.bufferRegion[1])) / 2}
              y={PAD_T + 18}
              fontSize={12.5}
              textAnchor="middle"
              fill={GREEN}
              fontWeight={700}
            >
              buffer region
            </text>
          </g>
        )}

        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke={INK} strokeWidth={2} />
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke={INK} strokeWidth={2} />

        {/* the curve */}
        <path d={path} fill="none" stroke={BLUE} strokeWidth={2.8} />

        {/* half-equivalence (pH = pKa) */}
        {figure.halfEquiv && (
          <g data-feature={N.halfEquiv} data-feature-label="Half-equivalence (pH = pKa)">
            <line
              x1={X(figure.halfEquiv.volume)}
              y1={Y(figure.halfEquiv.pH)}
              x2={X(figure.halfEquiv.volume)}
              y2={H - PAD_B}
              stroke={GREEN}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <circle cx={X(figure.halfEquiv.volume)} cy={Y(figure.halfEquiv.pH)} r={5} fill={GREEN} stroke="#fff" strokeWidth={1.5} />
            {/* Below-right of the point: the curve only rises to the right, so this corner is always clear. */}
            <text x={X(figure.halfEquiv.volume) + 10} y={Y(figure.halfEquiv.pH) + 22} fontSize={12} fill={GREEN} fontWeight={700} stroke="#ffffff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">
              half-equivalence
            </text>
            <text x={X(figure.halfEquiv.volume) + 10} y={Y(figure.halfEquiv.pH) + 38} fontSize={12} fill={GREEN} fontWeight={700} stroke="#ffffff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">
              {`pH = pKa ≈ ${figure.halfEquiv.pH.toFixed(2)}`}
            </text>
          </g>
        )}

        {/* equivalence point */}
        <g data-feature={N.equivalence} data-feature-label="Equivalence point">
          <line x1={X(figure.equivVolume)} y1={PAD_T} x2={X(figure.equivVolume)} y2={H - PAD_B} stroke={RED} strokeWidth={1.5} strokeDasharray="5 4" />
          <line x1={PAD_L} y1={Y(figure.equivPH)} x2={X(figure.equivVolume)} y2={Y(figure.equivPH)} stroke={RED} strokeWidth={1.5} strokeDasharray="5 4" />
          <circle cx={X(figure.equivVolume)} cy={Y(figure.equivPH)} r={6} fill={RED} stroke="#fff" strokeWidth={1.5} />
          <text
            x={X(figure.equivVolume) + 10}
            y={Y(figure.equivPH) + (figure.type === 'weak_strong' ? -10 : 22)}
            fontSize={12.5}
            fill={RED}
            fontWeight={700} stroke="#ffffff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round"
          >
            {`equivalence point (pH ${figure.equivPH.toFixed(1)})`}
          </text>
        </g>

        {/* axis labels */}
        <text x={PAD_L + plotW / 2} y={H - 12} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600}>
          volume of titrant added (mL)
        </text>
        <text
          x={16}
          y={PAD_T + plotH / 2}
          fontSize={12.5}
          textAnchor="middle"
          fill={INK}
          fontWeight={600}
          transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}
        >
          pH
        </text>
      </svg>
    </div>
  );
}

// ── crystal_lattice ───────────────────────────────────────────────────────────
export function CatalogLatticeRenderer({ figure }: { figure: LatticeFigure }) {
  const N = latticeFeatureNames;
  const W = 520;
  const H = 452;
  const S = 210; // cube edge in px
  const DX = 118; // depth x-shift for y-axis
  const DY = 74; // depth y-shift for y-axis
  const originX = 150;
  const originY = 330;

  // oblique projection: x → right, z → up, y (depth) → up-right
  const proj = (x: number, y: number, z: number): [number, number] => [
    originX + x * S + y * DX,
    originY - z * S - y * DY,
  ];

  // cube corner projected points, keyed by "xyz"
  const cornerKey = (x: number, y: number, z: number) => `${x}${y}${z}`;
  const P: Record<string, [number, number]> = {};
  for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) {
    P[cornerKey(x, y, z)] = proj(x, y, z);
  }

  // 12 cube edges as corner-key pairs
  const edges: [string, string][] = [
    ['000', '100'], ['100', '110'], ['110', '010'], ['010', '000'], // bottom
    ['001', '101'], ['101', '111'], ['111', '011'], ['011', '001'], // top
    ['000', '001'], ['100', '101'], ['110', '111'], ['010', '011'], // verticals
  ];
  // back edges (touching the far corner 010? actually far = y=1 up-right) drawn faint
  const backCorner = '010';
  const isBackEdge = (a: string, b: string) => a === backCorner || b === backCorner;

  // project + depth-sort atoms (far first). Depth: larger y = further; then lower z.
  const atoms = figure.atoms
    .map((a) => {
      const [px, py] = proj(a.x, a.y, a.z);
      const depth = a.y * 2 + (1 - a.z) * 0.5 + a.x * 0.1;
      return { ...a, px, py, depth };
    })
    .sort((p, q) => q.depth - p.depth);

  const atomColor = (role: string) => (role === 'corner' ? BLUE : role === 'body' ? RED : ORANGE);
  const name = latticeName(figure.type);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">
        {figure.title || `${name} unit cell`}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[520px]"
        data-feature={N.figure}
        data-feature-label={figure.title || `${name} unit cell`}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* cube edges */}
        {edges.map(([a, b], i) => (
          <line
            key={`e-${i}`}
            x1={P[a][0]}
            y1={P[a][1]}
            x2={P[b][0]}
            y2={P[b][1]}
            stroke={isBackEdge(a, b) ? FAINT : GRAY}
            strokeWidth={isBackEdge(a, b) ? 1.5 : 2}
            strokeDasharray={isBackEdge(a, b) ? '5 4' : undefined}
          />
        ))}

        {/* atoms (depth-sorted) */}
        {atoms.map((a, i) => (
          <g
            key={`a-${i}`}
            data-feature={a.role === 'corner' ? N.cornerAtoms : N.interiorAtoms}
            data-feature-label={a.role === 'corner' ? 'Corner atoms' : a.role === 'body' ? 'Body-centre atom' : 'Face-centre atoms'}
          >
            <circle cx={a.px} cy={a.py} r={16} fill={atomColor(a.role)} opacity={0.9} stroke="#fff" strokeWidth={2} />
            <circle cx={a.px - 5} cy={a.py - 5} r={5} fill="#fff" opacity={0.5} />
          </g>
        ))}

        {/* edge-length brace */}
        <text x={(P['000'][0] + P['100'][0]) / 2} y={P['000'][1] + 24} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600}>
          a
        </text>

        {/* legend + count, centred under the cell */}
        {(() => {
          const items: Array<{ c: string; t: string }> = [{ c: BLUE, t: 'corner atom (⅛ in the cell)' }];
          if (figure.type === 'bcc') items.push({ c: RED, t: 'body-centre atom (1 whole)' });
          if (figure.type === 'fcc') items.push({ c: ORANGE, t: 'face-centre atom (½ in the cell)' });
          const widths = items.map((it) => 22 + it.t.length * 6.4);
          const gap = 26;
          const total = widths.reduce((s2, w) => s2 + w, 0) + gap * (items.length - 1);
          let x = W / 2 - total / 2;
          return (
            <g>
              {items.map((it, i) => {
                const gx = x;
                x += widths[i] + gap;
                return (
                  <g key={i}>
                    <circle cx={gx + 7} cy={H - 50} r={7} fill={it.c} />
                    <text x={gx + 20} y={H - 45.5} fontSize={12.5} fill={INK}>{it.t}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        <text x={W / 2} y={H - 16} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700}>
          {`${figure.atomsPerCell} atom${figure.atomsPerCell === 1 ? '' : 's'} per unit cell`}
        </text>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  ph_scale
// ══════════════════════════════════════════════════════════════════════════

// Universal-indicator colour at an integer pH (0..14).
const PH_COLORS: Record<number, string> = {
  0: '#e11d48', 1: '#ef4444', 2: '#f97316', 3: '#fb923c', 4: '#f59e0b',
  5: '#eab308', 6: '#a3e635', 7: '#22c55e', 8: '#14b8a6', 9: '#06b6d4',
  10: '#0ea5e9', 11: '#3b82f6', 12: '#6366f1', 13: '#7c3aed', 14: '#6b21a8',
};

export function CatalogPhScaleRenderer({ figure }: { figure: PhScaleFigure }) {
  const N = phScaleFeatureNames;
  const W = 780;
  const INK = '#374151';
  const x0 = 56, x1 = 724;         // bar horizontal extent
  const barY = figure.showRegions ? 62 : 26;
  const barH = 42;
  const phX = (ph: number) => x0 + (ph / 14) * (x1 - x0);

  const heading = figure.title || 'The pH scale';

  // Markers go into as many rows as it takes for no two labels to touch:
  // sorted by pH, each label takes the first row whose last label ends before
  // it starts. Tick line + dot stay at the true pH x.
  const MARK_FS = 12;
  const rowH = 25;
  const fmtPh = (ph: number) => String(Math.round(ph * 10) / 10);
  const rowsRight: number[] = [];
  const placed = figure.markers
    .map((m, i) => ({ m, i }))
    .sort((a, b) => a.m.ph - b.m.ph)
    .map(({ m, i }) => {
      const textW = (m.label.length + ` (${fmtPh(m.ph)})`.length) * MARK_FS * 0.56;
      const mx = phX(m.ph);
      const lx = Math.max(4 + textW / 2, Math.min(mx, W - 4 - textW / 2));
      const left = lx - textW / 2;
      let row = rowsRight.findIndex((right) => right + 12 <= left);
      if (row === -1) { row = rowsRight.length; rowsRight.push(0); }
      rowsRight[row] = lx + textW / 2;
      return { m, i, mx, lx, row };
    });
  const markTop = barY + barH + 48;
  const H = placed.length > 0 ? markTop + (rowsRight.length - 1) * rowH + 14 : barY + barH + 34;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2 text-center">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[780px]"
        data-feature={N.scale}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <linearGradient id="ph-grad" x1="0" y1="0" x2="1" y2="0">
            {Array.from({ length: 15 }, (_, i) => (
              <stop key={i} offset={`${(i / 14) * 100}%`} stopColor={PH_COLORS[i]} />
            ))}
          </linearGradient>
        </defs>

        {/* region labels + brackets */}
        {figure.showRegions && (
          <>
            <g data-feature={N.acidic} data-feature-label="Acidic region">
              <line x1={phX(0)} y1={barY - 16} x2={phX(6.5)} y2={barY - 16} stroke="#dc2626" strokeWidth={2} />
              <text x={phX(3.25)} y={barY - 40} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">ACIDIC</text>
              <text x={phX(3.25)} y={barY - 24} textAnchor="middle" fontSize={11.5} fill="#dc2626">more H⁺</text>
            </g>
            <g data-feature={N.neutral} data-feature-label="Neutral">
              <text x={phX(7)} y={barY - 40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#15803d">NEUTRAL</text>
            </g>
            <g data-feature={N.basic} data-feature-label="Basic region">
              <line x1={phX(7.5)} y1={barY - 16} x2={phX(14)} y2={barY - 16} stroke="#6d28d9" strokeWidth={2} />
              <text x={phX(10.75)} y={barY - 40} textAnchor="middle" fontSize={13} fontWeight={700} fill="#6d28d9">BASIC (ALKALINE)</text>
              <text x={phX(10.75)} y={barY - 24} textAnchor="middle" fontSize={11.5} fill="#6d28d9">more OH⁻</text>
            </g>
          </>
        )}

        {/* the coloured bar */}
        <g data-feature={N.bar} data-feature-label="pH bar">
          <rect x={x0} y={barY} width={x1 - x0} height={barH} rx={4} fill="url(#ph-grad)" stroke={INK} strokeWidth={1.2} />
        </g>

        {/* integer ticks + numbers */}
        {Array.from({ length: 15 }, (_, i) => (
          <g key={i}>
            <line x1={phX(i)} y1={barY + barH} x2={phX(i)} y2={barY + barH + 7} stroke={INK} strokeWidth={i === 7 ? 2 : 1} />
            <text x={phX(i)} y={barY + barH + 22} textAnchor="middle" fontSize={12} fontWeight={i === 7 ? 700 : 500} fill={INK}>{i}</text>
          </g>
        ))}

        {/* highlight a specific pH */}
        {figure.highlightPh !== undefined && (
          <g>
            <line x1={phX(figure.highlightPh)} y1={barY - 6} x2={phX(figure.highlightPh)} y2={barY + barH + 6} stroke="#111827" strokeWidth={2.5} />
            {/* The value itself, on a white tag over the bar. */}
            <rect x={phX(figure.highlightPh) - 27} y={barY + barH / 2 - 11} width={54} height={22} rx={11} fill="#ffffff" stroke="#111827" strokeWidth={1.5} />
            <text x={phX(figure.highlightPh)} y={barY + barH / 2 + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#111827">{`pH ${Math.round(figure.highlightPh * 10) / 10}`}</text>
          </g>
        )}

        {/* substance markers: all leader lines first, then the labels on top
            (with a white halo) so a leader never strikes through a name */}
        {placed.map(({ i, mx, row }) => (
          <line key={`ld-${i}`} x1={mx} y1={barY + barH + 28} x2={mx} y2={markTop + row * rowH - 11} stroke="#cbd5e1" strokeWidth={1} />
        ))}
        {placed.map(({ m, i, mx, lx, row }) => {
          const ly = markTop + row * rowH;
          return (
            <g key={i} data-feature={N.marker(i)} data-feature-label={m.label}>
              <circle cx={mx} cy={barY + barH + 28} r={3.5} fill={PH_COLORS[Math.max(0, Math.min(14, Math.round(m.ph)))]} stroke="#fff" strokeWidth={1} />
              <text x={lx} y={ly} textAnchor="middle" fontSize={MARK_FS} fill={INK} stroke="#ffffff" strokeWidth={4} paintOrder="stroke" strokeLinejoin="round">
                <tspan fontWeight={600}>{m.label}</tspan>
                <tspan fill="#64748b"> ({fmtPh(m.ph)})</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
