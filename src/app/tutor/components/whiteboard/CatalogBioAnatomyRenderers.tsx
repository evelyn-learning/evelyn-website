'use client';

import React from 'react';
import {
  leafFeatureNames,
  nephronFeatureNames,
  digestiveFeatureNames,
  circulatoryFeatureNames,
  type LeafCrossSectionFigure,
  type LeafPart,
  type NephronFigure,
  type NephronPart,
  type DigestiveSystemFigure,
  type DigestivePart,
  type CirculatorySystemFigure,
  type CirculatoryPart,
} from '@/lib/tutor/diagrams/catalog/kinds/bio-anatomy';

const INK = '#374151';
const GRAY = '#94a3b8';
const FAINT = '#cbd5e1';
const RED = '#dc2626';
const BLUE = '#2563eb';
const GREEN = '#16a34a';
const DGREEN = '#15803d';
const LGREEN = '#86efac';
const AMBER = '#d97706';
const HL = '#059669';       // highlight (emerald)
const HL_STROKE = '#059669';

// ══════════════════════════════════════════════════════════════════════════
//  leaf_cross_section
// ══════════════════════════════════════════════════════════════════════════

export function CatalogLeafCrossSectionRenderer({ figure }: { figure: LeafCrossSectionFigure }) {
  const N = leafFeatureNames;
  const W = 680;
  const H = 470;
  const hi = (p: LeafPart) => figure.highlight.includes(p);

  // horizontal extent of the section
  const x0 = 60;
  const x1 = 500; // right edge of the tissue block; labels live to the right

  // layer y-bands
  const cutTop = 66, cutBot = 74;
  const upEpiTop = 74, upEpiBot = 112;
  const palTop = 112, palBot = 196;
  const spgTop = 196, spgBot = 300;
  const loEpiTop = 300, loEpiBot = 338;

  // palisade columns
  const palCols: number[] = [];
  for (let x = x0 + 16; x <= x1 - 12; x += 30) palCols.push(x);

  // spongy cells (staggered blobs)
  const spongy: Array<[number, number, number]> = [];
  const spgRows = [222, 258, 290];
  spgRows.forEach((cy, r) => {
    for (let x = x0 + 22 + (r % 2) * 20; x <= x1 - 18; x += 44) {
      spongy.push([x, cy, 15]);
    }
  });

  // vascular bundle center (a vein sitting in the spongy layer)
  const vbx = 300, vby = 250, vbr = 34;

  // stomata in the lower epidermis
  const stomataX = [190, 360];

  const labelX = 512;
  function leader(part: LeafPart, y: number, ty: number) {
    return (
      <g data-feature={N.part(part)} data-feature-label={String(part)}>
        <line x1={x1} y1={y} x2={labelX - 4} y2={ty} stroke={INK} strokeWidth={0.8} />
      </g>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'Leaf cross-section'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Leaf cross-section'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="leaf-arr-in" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GRAY} />
          </marker>
          <marker id="leaf-arr-o2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
          </marker>
        </defs>

        {/* ── cuticle (waxy top) ── */}
        <g data-feature={N.part('cuticle')} data-feature-label="Waxy cuticle">
          <rect x={x0} y={cutTop} width={x1 - x0} height={cutBot - cutTop} fill="#fde68a" {...(hi('cuticle') ? { stroke: HL_STROKE, strokeWidth: 3 } : { stroke: AMBER, strokeWidth: 1 })} />
        </g>

        {/* ── upper epidermis ── */}
        <g data-feature={N.part('upper_epidermis')} data-feature-label="Upper epidermis">
          <rect x={x0} y={upEpiTop} width={x1 - x0} height={upEpiBot - upEpiTop} fill="#ecfccb" stroke={hi('upper_epidermis') ? HL_STROKE : GREEN} strokeWidth={hi('upper_epidermis') ? 3 : 1} />
          {palCols.map((x, i) => (
            <line key={`ue-${i}`} x1={x - 15} y1={upEpiTop} x2={x - 15} y2={upEpiBot} stroke={LGREEN} strokeWidth={1} />
          ))}
        </g>

        {/* ── palisade mesophyll ── */}
        <g data-feature={N.part('palisade_mesophyll')} data-feature-label="Palisade mesophyll">
          <rect x={x0} y={palTop} width={x1 - x0} height={palBot - palTop} fill="#dcfce7" stroke={hi('palisade_mesophyll') ? HL_STROKE : 'none'} strokeWidth={hi('palisade_mesophyll') ? 3 : 0} />
          {palCols.map((x, i) => (
            <g key={`pal-${i}`}>
              <rect x={x - 12} y={palTop + 4} width={24} height={palBot - palTop - 8} rx={9} fill="#bbf7d0" stroke={DGREEN} strokeWidth={1.2} />
              {/* chloroplasts */}
              {[palTop + 22, palTop + 44, palTop + 66].map((cy, k) => (
                <ellipse key={k} cx={x} cy={cy} rx={6} ry={4} fill={DGREEN} />
              ))}
            </g>
          ))}
        </g>

        {/* ── spongy mesophyll (with air spaces) ── */}
        <g data-feature={N.part('spongy_mesophyll')} data-feature-label="Spongy mesophyll">
          <rect x={x0} y={spgTop} width={x1 - x0} height={spgBot - spgTop} fill="#f0fdf4" stroke={hi('spongy_mesophyll') ? HL_STROKE : 'none'} strokeWidth={hi('spongy_mesophyll') ? 3 : 0} />
          {spongy.map(([x, y, r], i) => (
            <circle key={`spg-${i}`} cx={x} cy={y} r={r} fill="#bbf7d0" stroke={DGREEN} strokeWidth={1.1} />
          ))}
        </g>
        {/* air space callout */}
        <g data-feature={N.part('air_space')} data-feature-label="Air space">
          <circle cx={240} cy={274} r={5} fill="none" stroke={hi('air_space') ? HL_STROKE : GRAY} strokeWidth={hi('air_space') ? 2.5 : 1} strokeDasharray="2 2" />
        </g>

        {/* ── vascular bundle (vein: xylem + phloem) ── */}
        <g data-feature={N.part('vascular_bundle')} data-feature-label="Vascular bundle (vein)">
          <circle cx={vbx} cy={vby} r={vbr} fill="#fff" stroke={hi('vascular_bundle') ? HL_STROKE : INK} strokeWidth={hi('vascular_bundle') ? 3 : 1.6} />
          <g data-feature={N.part('xylem')} data-feature-label="Xylem">
            {[[vbx - 12, vby - 12], [vbx + 2, vby - 14], [vbx + 14, vby - 8]].map(([cx, cy], i) => (
              <circle key={`xy-${i}`} cx={cx} cy={cy} r={6} fill="#fecaca" stroke={hi('xylem') ? HL_STROKE : RED} strokeWidth={hi('xylem') ? 2.2 : 1.2} />
            ))}
          </g>
          <g data-feature={N.part('phloem')} data-feature-label="Phloem">
            {[[vbx - 12, vby + 12], [vbx + 2, vby + 14], [vbx + 14, vby + 8]].map(([cx, cy], i) => (
              <circle key={`ph-${i}`} cx={cx} cy={cy} r={6} fill="#bbf7d0" stroke={hi('phloem') ? HL_STROKE : GREEN} strokeWidth={hi('phloem') ? 2.2 : 1.2} />
            ))}
          </g>
          <line x1={vbx - vbr + 4} y1={vby} x2={vbx + vbr - 4} y2={vby} stroke={GRAY} strokeWidth={0.8} strokeDasharray="3 3" />
        </g>

        {/* ── lower epidermis ── */}
        <g data-feature={N.part('lower_epidermis')} data-feature-label="Lower epidermis">
          <rect x={x0} y={loEpiTop} width={x1 - x0} height={loEpiBot - loEpiTop} fill="#ecfccb" stroke={hi('lower_epidermis') ? HL_STROKE : GREEN} strokeWidth={hi('lower_epidermis') ? 3 : 1} />
        </g>

        {/* ── stomata + guard cells (gaps in the lower epidermis) ── */}
        {stomataX.map((sx, i) => (
          <g key={`stoma-${i}`}>
            {/* the pore is a gap; guard cells are two beans flanking it */}
            <g data-feature={N.part('guard_cell')} data-feature-label="Guard cell">
              <path d={`M ${sx - 15} ${loEpiTop + 2} Q ${sx - 26} ${loEpiTop + 19} ${sx - 15} ${loEpiBot - 2} Q ${sx - 5} ${loEpiTop + 19} ${sx - 15} ${loEpiTop + 2} Z`} fill="#bbf7d0" stroke={hi('guard_cell') ? HL_STROKE : DGREEN} strokeWidth={hi('guard_cell') ? 2.4 : 1.3} />
              <path d={`M ${sx + 15} ${loEpiTop + 2} Q ${sx + 26} ${loEpiTop + 19} ${sx + 15} ${loEpiBot - 2} Q ${sx + 5} ${loEpiTop + 19} ${sx + 15} ${loEpiTop + 2} Z`} fill="#bbf7d0" stroke={hi('guard_cell') ? HL_STROKE : DGREEN} strokeWidth={hi('guard_cell') ? 2.4 : 1.3} />
            </g>
            <g data-feature={N.part('stoma')} data-feature-label="Stoma">
              <ellipse cx={sx} cy={(loEpiTop + loEpiBot) / 2} rx={4} ry={15} fill="#e0f2fe" stroke={hi('stoma') ? HL_STROKE : INK} strokeWidth={hi('stoma') ? 2.2 : 1} />
            </g>
          </g>
        ))}

        {/* ── gas-exchange arrows ── */}
        {figure.showGasExchange && (
          <>
            {/* CO2 in (into first stoma) */}
            <line x1={stomataX[0]} y1={H - 14} x2={stomataX[0]} y2={loEpiBot + 6} stroke={GRAY} strokeWidth={2.2} markerEnd="url(#leaf-arr-in)" />
            <text x={stomataX[0] - 6} y={H - 4} fontSize={11.5} textAnchor="end" fill={INK} fontWeight={700}>CO₂ in</text>
            {/* O2 + water vapour out (from second stoma) */}
            <line x1={stomataX[1]} y1={loEpiBot + 6} x2={stomataX[1]} y2={H - 14} stroke={BLUE} strokeWidth={2.2} markerEnd="url(#leaf-arr-o2)" />
            <text x={stomataX[1] + 8} y={H - 4} fontSize={11.5} textAnchor="start" fill={BLUE} fontWeight={700}>O₂ + H₂O out</text>
          </>
        )}

        {/* ── right-side labels with leaders ── */}
        {leader('cuticle', (cutTop + cutBot) / 2, 72)}
        {leader('upper_epidermis', (upEpiTop + upEpiBot) / 2, 96)}
        {leader('palisade_mesophyll', palTop + 40, 138)}
        {leader('spongy_mesophyll', spgBot - 24, 250)}
        {leader('lower_epidermis', (loEpiTop + loEpiBot) / 2, 322)}

        <text x={labelX} y={76} fontSize={11.5} textAnchor="start" fill={hi('cuticle') ? HL : INK} fontWeight={hi('cuticle') ? 700 : 400}>Waxy cuticle</text>
        <text x={labelX} y={100} fontSize={11.5} textAnchor="start" fill={hi('upper_epidermis') ? HL : INK} fontWeight={hi('upper_epidermis') ? 700 : 400}>Upper epidermis</text>
        <text x={labelX} y={138} fontSize={11.5} textAnchor="start" fill={hi('palisade_mesophyll') ? HL : INK} fontWeight={hi('palisade_mesophyll') ? 700 : 400}>Palisade mesophyll</text>
        <text x={labelX} y={152} fontSize={9.5} textAnchor="start" fill={GRAY}>(chloroplasts)</text>
        <text x={labelX} y={254} fontSize={11.5} textAnchor="start" fill={hi('spongy_mesophyll') ? HL : INK} fontWeight={hi('spongy_mesophyll') ? 700 : 400}>Spongy mesophyll</text>
        <text x={labelX} y={268} fontSize={9.5} textAnchor="start" fill={GRAY}>(air spaces)</text>
        <text x={labelX} y={326} fontSize={11.5} textAnchor="start" fill={hi('lower_epidermis') ? HL : INK} fontWeight={hi('lower_epidermis') ? 700 : 400}>Lower epidermis</text>

        {/* vascular bundle label */}
        <line x1={vbx + vbr} y1={vby} x2={labelX - 4} y2={200} stroke={INK} strokeWidth={0.8} />
        <text x={labelX} y={196} fontSize={11.5} textAnchor="start" fill={hi('vascular_bundle') ? HL : INK} fontWeight={hi('vascular_bundle') ? 700 : 400}>Vein (vascular bundle)</text>
        <text x={labelX} y={210} fontSize={9.5} textAnchor="start" fill={RED}>xylem</text>
        <text x={labelX + 40} y={210} fontSize={9.5} textAnchor="start" fill={GREEN}>· phloem</text>

        {/* stoma / guard cell label */}
        <line x1={stomataX[1] + 15} y1={loEpiBot} x2={labelX - 4} y2={362} stroke={INK} strokeWidth={0.8} />
        <text x={labelX} y={360} fontSize={11.5} textAnchor="start" fill={hi('stoma') || hi('guard_cell') ? HL : INK} fontWeight={hi('stoma') || hi('guard_cell') ? 700 : 400}>Stoma + guard cells</text>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  nephron
// ══════════════════════════════════════════════════════════════════════════

export function CatalogNephronRenderer({ figure }: { figure: NephronFigure }) {
  const N = nephronFeatureNames;
  const W = 680;
  const H = 500;
  const hi = (p: NephronPart) => figure.highlight.includes(p);
  const TUBE = '#fcd34d';       // tubule lumen fill
  const TUBE_ST = '#b45309';    // tubule wall

  // A tube segment as a thick rounded stroke path; when highlighted, an emerald overstroke.
  function seg(part: NephronPart, d: string, label: string) {
    const on = hi(part);
    return (
      <g data-feature={N.part(part)} data-feature-label={label}>
        {on && <path d={d} fill="none" stroke={HL_STROKE} strokeWidth={19} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />}
        <path d={d} fill="none" stroke={TUBE_ST} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={TUBE} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }

  // tube geometry (a continuous nephron laid left→right)
  const pctD = 'M 168 120 q 26 -20 42 4 q -22 20 6 34 q 30 -12 30 18';
  const descD = 'M 246 176 L 262 400';
  const loopD = 'M 262 400 q 22 34 44 0';
  const ascD = 'M 306 400 L 322 168';
  const dctD = 'M 322 168 q 26 -22 46 2 q -20 20 8 32 q 30 -8 36 14';
  const cdD = 'M 418 216 L 452 452';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'The nephron'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Nephron'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="neph-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={RED} />
          </marker>
          <marker id="neph-arr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GREEN} />
          </marker>
        </defs>

        {/* ── Bowman's capsule + glomerulus ── */}
        <g data-feature={N.part('bowmans_capsule')} data-feature-label="Bowman's capsule">
          {/* the capsule cup (C shape opening right, into the PCT) */}
          <path d="M 168 120 A 46 46 0 1 0 168 121 Z" fill="#dbeafe" stroke={hi('bowmans_capsule') ? HL_STROKE : INK} strokeWidth={hi('bowmans_capsule') ? 3 : 1.8} />
          <circle cx={104} cy={120} r={30} fill="#fff" opacity={0.55} />
        </g>
        <g data-feature={N.part('glomerulus')} data-feature-label="Glomerulus">
          {/* the glomerular capillary tuft */}
          <circle cx={104} cy={120} r={26} fill="#fecaca" stroke={hi('glomerulus') ? HL_STROKE : RED} strokeWidth={hi('glomerulus') ? 3 : 1.5} />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return <circle key={i} cx={104 + Math.cos(a) * 12} cy={120 + Math.sin(a) * 12} r={7} fill="none" stroke={RED} strokeWidth={1.6} />;
          })}
          {/* afferent / efferent arterioles */}
          <line x1={72} y1={104} x2={104} y2={116} stroke={RED} strokeWidth={3} />
          <line x1={104} y1={124} x2={74} y2={140} stroke={RED} strokeWidth={3} />
        </g>

        {/* ── tubule segments ── */}
        {seg('proximal_tubule', pctD, 'Proximal tubule')}
        {seg('descending_limb', descD, 'Descending limb')}
        {seg('loop_of_henle', loopD, 'Loop of Henle')}
        {seg('ascending_limb', ascD, 'Ascending limb')}
        {seg('distal_tubule', dctD, 'Distal tubule')}
        {seg('collecting_duct', cdD, 'Collecting duct')}

        {/* renal pelvis / exit */}
        <path d="M 440 452 L 464 452 L 452 476 Z" fill={TUBE_ST} />
        <text x={452} y={492} fontSize={10.5} textAnchor="middle" fill={GRAY}>to renal pelvis / ureter</text>

        {/* ── flow arrows ── */}
        {figure.showFlow && (
          <>
            <g data-feature={N.filtration} data-feature-label="Filtration">
              <line x1={128} y1={120} x2={158} y2={120} stroke={RED} strokeWidth={2.4} markerEnd="url(#neph-arr)" />
              <text x={128} y={92} fontSize={10.5} textAnchor="middle" fill={RED} fontWeight={700}>filtration</text>
            </g>
            <g data-feature={N.reabsorption} data-feature-label="Reabsorption">
              {[[222, 150], [280, 300], [388, 176]].map(([x, y], i) => (
                <line key={i} x1={x} y1={y} x2={x + 26} y2={y - 16} stroke={GREEN} strokeWidth={2} markerEnd="url(#neph-arr-g)" />
              ))}
              <text x={520} y={300} fontSize={10.5} textAnchor="start" fill={GREEN} fontWeight={700}>reabsorption →</text>
              <text x={520} y={314} fontSize={9.5} textAnchor="start" fill={GREEN}>water, glucose, ions</text>
            </g>
          </>
        )}

        {/* ── labels with leaders ── */}
        {(() => {
          const lbl = (part: NephronPart, x: number, y: number, tx: number, ty: number, text: string, anchor: 'start' | 'end' = 'start') => (
            <g>
              <line x1={x} y1={y} x2={tx + (anchor === 'end' ? 4 : -4)} y2={ty - 4} stroke={INK} strokeWidth={0.7} />
              <text x={tx} y={ty} fontSize={11.5} textAnchor={anchor} fill={hi(part) ? HL : INK} fontWeight={hi(part) ? 700 : 400}>{text}</text>
            </g>
          );
          return (
            <>
              {lbl('glomerulus', 104, 94, 60, 72, 'Glomerulus', 'start')}
              {lbl('bowmans_capsule', 150, 150, 40, 190, "Bowman's capsule", 'start')}
              {lbl('proximal_tubule', 210, 108, 190, 60, 'Proximal tubule (PCT)', 'start')}
              {lbl('descending_limb', 254, 300, 150, 320, 'Descending limb', 'end')}
              {lbl('loop_of_henle', 284, 420, 220, 452, 'Loop of Henle', 'start')}
              {lbl('ascending_limb', 314, 300, 340, 300, 'Ascending limb', 'start')}
              {lbl('distal_tubule', 380, 158, 388, 108, 'Distal tubule (DCT)', 'start')}
              {lbl('collecting_duct', 440, 330, 476, 356, 'Collecting duct', 'start')}
            </>
          );
        })()}
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  digestive_system
// ══════════════════════════════════════════════════════════════════════════

export function CatalogDigestiveSystemRenderer({ figure }: { figure: DigestiveSystemFigure }) {
  const N = digestiveFeatureNames;
  const W = 680;
  const H = 540;
  const hi = (p: DigestivePart) => figure.highlight.includes(p);
  const ORGAN = '#fca5a5';
  const ORGAN_ST = '#b91c1c';

  function organStroke(p: DigestivePart, base: string) {
    return hi(p) ? HL_STROKE : base;
  }
  function organWidth(p: DigestivePart, base: number) {
    return hi(p) ? base + 1.6 : base;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'The human digestive system'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Digestive system'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* faint body outline (head + torso) */}
        <path d="M 300 30 a 34 34 0 1 0 0.1 0 M 240 96 Q 300 78 360 96 L 384 250 Q 392 430 340 508 L 260 508 Q 208 430 216 250 Z"
          fill="#f8fafc" stroke={FAINT} strokeWidth={1.5} />

        {/* ── mouth ── */}
        <g data-feature={N.part('mouth')} data-feature-label="Mouth">
          <ellipse cx={300} cy={62} rx={16} ry={9} fill="#fecdd3" stroke={organStroke('mouth', ORGAN_ST)} strokeWidth={organWidth('mouth', 1.6)} />
        </g>

        {/* ── esophagus ── */}
        <g data-feature={N.part('esophagus')} data-feature-label="Esophagus">
          <path d="M 300 72 L 300 176" fill="none" stroke={organStroke('esophagus', '#f472b6')} strokeWidth={organWidth('esophagus', 11)} strokeLinecap="round" />
          <path d="M 300 72 L 300 176" fill="none" stroke="#fbcfe8" strokeWidth={5} strokeLinecap="round" />
        </g>

        {/* ── liver (accessory, upper right) ── */}
        <g data-feature={N.part('liver')} data-feature-label="Liver">
          <path d="M 336 172 Q 420 158 424 210 Q 420 242 356 236 Q 332 214 336 172 Z" fill="#a16207" opacity={0.85} stroke={organStroke('liver', '#713f12')} strokeWidth={organWidth('liver', 1.6)} />
        </g>
        {/* ── gallbladder ── */}
        <g data-feature={N.part('gallbladder')} data-feature-label="Gallbladder">
          <ellipse cx={368} cy={238} rx={9} ry={13} fill={GREEN} stroke={organStroke('gallbladder', DGREEN)} strokeWidth={organWidth('gallbladder', 1.4)} />
        </g>

        {/* ── stomach (J-shaped sac, left) ── */}
        <g data-feature={N.part('stomach')} data-feature-label="Stomach">
          <path d="M 300 178 Q 250 176 236 216 Q 224 262 268 276 Q 300 284 300 250 Q 288 246 284 224 Q 284 196 300 194 Z"
            fill={ORGAN} stroke={organStroke('stomach', ORGAN_ST)} strokeWidth={organWidth('stomach', 1.8)} />
        </g>

        {/* ── pancreas (accessory, behind stomach) ── */}
        <g data-feature={N.part('pancreas')} data-feature-label="Pancreas">
          <path d="M 268 272 Q 320 268 356 280" fill="none" stroke={organStroke('pancreas', '#ca8a04')} strokeWidth={organWidth('pancreas', 9)} strokeLinecap="round" />
        </g>

        {/* ── large intestine (frames the small intestine) ── */}
        <g data-feature={N.part('large_intestine')} data-feature-label="Large intestine">
          <path d="M 356 320 L 356 300 Q 356 288 344 288 L 258 288 Q 246 288 246 300 L 246 430 Q 246 452 268 452 L 300 452"
            fill="none" stroke={organStroke('large_intestine', '#92400e')} strokeWidth={organWidth('large_intestine', 15)} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 356 320 L 356 300 Q 356 288 344 288 L 258 288 Q 246 288 246 300 L 246 430 Q 246 452 268 452 L 300 452"
            fill="none" stroke="#d6a97a" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── small intestine (coiled mass) ── */}
        <g data-feature={N.part('small_intestine')} data-feature-label="Small intestine">
          <path d="M 300 300 q 40 8 34 34 q -8 22 -34 20 q -34 -2 -30 26 q 6 26 34 22 q 34 -4 30 26 q -6 24 -34 22"
            fill="none" stroke={organStroke('small_intestine', ORGAN_ST)} strokeWidth={organWidth('small_intestine', 11)} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 300 300 q 40 8 34 34 q -8 22 -34 20 q -34 -2 -30 26 q 6 26 34 22 q 34 -4 30 26 q -6 24 -34 22"
            fill="none" stroke="#fecdd3" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── rectum / anus ── */}
        <g data-feature={N.part('rectum')} data-feature-label="Rectum / anus">
          <path d="M 300 452 L 300 494" fill="none" stroke={organStroke('rectum', '#7c2d12')} strokeWidth={organWidth('rectum', 11)} strokeLinecap="round" />
        </g>

        {/* ── numbered labels (GI-tract order) with leaders ── */}
        {(() => {
          type L = { part: DigestivePart; n: number; x: number; y: number; tx: number; ty: number; anchor: 'start' | 'end' };
          const items: L[] = [
            { part: 'mouth', n: 1, x: 316, y: 62, tx: 356, ty: 60, anchor: 'start' },
            { part: 'esophagus', n: 2, x: 300, y: 130, tx: 176, ty: 128, anchor: 'end' },
            { part: 'liver', n: 0, x: 400, y: 196, tx: 452, ty: 190, anchor: 'start' },
            { part: 'gallbladder', n: 0, x: 376, y: 238, tx: 452, ty: 236, anchor: 'start' },
            { part: 'stomach', n: 3, x: 236, y: 226, tx: 150, ty: 224, anchor: 'end' },
            { part: 'pancreas', n: 0, x: 312, y: 274, tx: 452, ty: 284, anchor: 'start' },
            { part: 'small_intestine', n: 4, x: 330, y: 356, tx: 452, ty: 356, anchor: 'start' },
            { part: 'large_intestine', n: 5, x: 246, y: 380, tx: 150, ty: 380, anchor: 'end' },
            { part: 'rectum', n: 6, x: 300, y: 486, tx: 380, ty: 500, anchor: 'start' },
          ];
          return items.map((it) => {
            const txt = (it.n ? `${it.n}. ` : '') + (it.part === 'rectum' ? 'Rectum / anus'
              : it.part === 'small_intestine' ? 'Small intestine'
              : it.part === 'large_intestine' ? 'Large intestine'
              : it.part.charAt(0).toUpperCase() + it.part.slice(1));
            const acc = it.n === 0 ? ' (accessory)' : '';
            return (
              <g key={it.part}>
                <line x1={it.x} y1={it.y} x2={it.tx + (it.anchor === 'end' ? 4 : -4)} y2={it.ty - 4} stroke={INK} strokeWidth={0.7} />
                <text x={it.tx} y={it.ty} fontSize={11.5} textAnchor={it.anchor} fill={hi(it.part) ? HL : INK} fontWeight={hi(it.part) ? 700 : 400}>{txt}</text>
                {acc && <text x={it.tx} y={it.ty + 13} fontSize={9} textAnchor={it.anchor} fill={GRAY}>{acc.trim()}</text>}
              </g>
            );
          });
        })()}
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  circulatory_system  (double circulation schematic)
// ══════════════════════════════════════════════════════════════════════════

export function CatalogCirculatorySystemRenderer({ figure }: { figure: CirculatorySystemFigure }) {
  const N = circulatoryFeatureNames;
  const W = 680;
  const H = 560;
  const hi = (p: CirculatoryPart) => figure.highlight.includes(p);

  // layout anchors
  const lungY = 84;
  const bodyY = 476;
  // heart box
  const hx = 250, hy = 232, hw = 180, hh = 150;
  const midX = hx + hw / 2;   // 340
  const midY = hy + hh / 2;   // 307
  const leftX = 132;          // blue column (deoxygenated, flows up)
  const rightX = 548;         // red column (oxygenated, flows down)

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'Double circulation'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Circulatory system'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="circ-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
          </marker>
          <marker id="circ-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={RED} />
          </marker>
        </defs>

        {/* ── pulmonary-loop band label (top) ── */}
        <g data-feature={N.part('pulmonary_loop')} data-feature-label="Pulmonary circulation">
          {hi('pulmonary_loop') && <rect x={40} y={54} width={600} height={150} rx={12} fill="none" stroke={HL_STROKE} strokeWidth={2.5} strokeDasharray="6 5" />}
          <text x={W / 2} y={44} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={700}>PULMONARY CIRCULATION (heart ⇄ lungs)</text>
        </g>

        {/* ── lungs ── */}
        <g data-feature={N.part('lungs')} data-feature-label="Lungs">
          {[-1, 1].map((s) => (
            <path key={s} d={`M ${midX + s * 70} ${lungY - 34} q ${s * 44} 6 ${s * 40} 54 q ${-s * 4} 30 ${-s * 40} 30 q ${-s * 18} 0 ${-s * 18} -40 Z`}
              fill="#fce7f3" stroke={hi('lungs') ? HL_STROKE : '#db2777'} strokeWidth={hi('lungs') ? 3 : 1.6} />
          ))}
          <text x={midX} y={lungY + 6} fontSize={13} textAnchor="middle" fill="#be185d" fontWeight={700}>LUNGS</text>
          <text x={midX} y={lungY + 22} fontSize={9.5} textAnchor="middle" fill={GRAY}>gas exchange</text>
        </g>

        {/* ── body ── */}
        <g data-feature={N.part('body')} data-feature-label="Body">
          <rect x={midX - 90} y={bodyY - 30} width={180} height={64} rx={14} fill="#e5e7eb" stroke={hi('body') ? HL_STROKE : GRAY} strokeWidth={hi('body') ? 3 : 1.6} />
          <text x={midX} y={bodyY + 2} fontSize={13} textAnchor="middle" fill={INK} fontWeight={700}>BODY</text>
          <text x={midX} y={bodyY + 18} fontSize={9.5} textAnchor="middle" fill={GRAY}>tissues / organs</text>
        </g>
        {/* systemic-loop band label (bottom) */}
        <g data-feature={N.part('systemic_loop')} data-feature-label="Systemic circulation">
          {hi('systemic_loop') && <rect x={40} y={358} width={600} height={168} rx={12} fill="none" stroke={HL_STROKE} strokeWidth={2.5} strokeDasharray="6 5" />}
          <text x={W / 2} y={H - 8} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={700}>SYSTEMIC CIRCULATION (heart ⇄ body)</text>
        </g>

        {/* ══ blue (deoxygenated) column on the LEFT, flowing UP ══ */}
        {/* body → vena cava → RA */}
        <g data-feature={N.part('vena_cava')} data-feature-label="Vena cava">
          <path d={`M ${midX - 84} ${bodyY - 8} L ${leftX} ${bodyY - 8} L ${leftX} ${hy + 40}`} fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${leftX} ${hy + 40} L ${hx + 6} ${hy + 40}`} fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" markerEnd="url(#circ-b)" />
          <text x={leftX - 8} y={bodyY - 40} fontSize={11} textAnchor="end" fill={BLUE} fontWeight={700}>vena cava</text>
        </g>
        {/* RV → pulmonary artery → lungs */}
        <g data-feature={N.part('pulmonary_artery')} data-feature-label="Pulmonary artery">
          <path d={`M ${hx + 6} ${hy + hh - 34} L ${leftX + 44} ${hy + hh - 34} L ${leftX + 44} ${lungY + 44}`} fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${leftX + 44} ${lungY + 44} L ${midX - 66} ${lungY + 34}`} fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" markerEnd="url(#circ-b)" />
          <text x={leftX + 36} y={lungY + 70} fontSize={11} textAnchor="start" fill={BLUE} fontWeight={700}>pulmonary artery</text>
        </g>

        {/* ══ red (oxygenated) column on the RIGHT, flowing DOWN ══ */}
        {/* lungs → pulmonary vein → LA */}
        <g data-feature={N.part('pulmonary_vein')} data-feature-label="Pulmonary vein">
          <path d={`M ${midX + 66} ${lungY + 34} L ${rightX - 44} ${lungY + 44} L ${rightX - 44} ${hy + 40}`} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${rightX - 44} ${hy + 40} L ${hx + hw - 6} ${hy + 40}`} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" markerEnd="url(#circ-r)" />
          <text x={rightX - 36} y={lungY + 70} fontSize={11} textAnchor="end" fill={RED} fontWeight={700}>pulmonary vein</text>
        </g>
        {/* LV → aorta → body */}
        <g data-feature={N.part('aorta')} data-feature-label="Aorta">
          <path d={`M ${hx + hw - 6} ${hy + hh - 34} L ${rightX} ${hy + hh - 34} L ${rightX} ${bodyY - 8}`} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${rightX} ${bodyY - 8} L ${midX + 84} ${bodyY - 8}`} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" markerEnd="url(#circ-r)" />
          <text x={rightX + 8} y={bodyY - 40} fontSize={11} textAnchor="start" fill={RED} fontWeight={700}>aorta</text>
        </g>

        {/* ── heart (4 chambers) ── */}
        <g data-feature={N.part('heart')} data-feature-label="Heart">
          <rect x={hx} y={hy} width={hw} height={hh} rx={16} fill="#fff" stroke={hi('heart') ? HL_STROKE : INK} strokeWidth={hi('heart') ? 3.5 : 2} />
          <line x1={midX} y1={hy + 6} x2={midX} y2={hy + hh - 6} stroke={GRAY} strokeWidth={1} strokeDasharray="4 4" />
          <line x1={hx + 8} y1={midY} x2={hx + hw - 8} y2={midY} stroke={GRAY} strokeWidth={1} strokeDasharray="4 4" />
        </g>
        {/* chamber tints: left half of the box (viewer-left) = right heart (blue) */}
        <g data-feature={N.part('right_atrium')} data-feature-label="Right atrium">
          <rect x={hx + 4} y={hy + 4} width={hw / 2 - 6} height={hh / 2 - 6} rx={10} fill="#dbeafe" stroke={hi('right_atrium') ? HL_STROKE : 'none'} strokeWidth={hi('right_atrium') ? 3 : 0} />
          <text x={hx + hw / 4} y={midY - 30} fontSize={11} textAnchor="middle" fill={BLUE} fontWeight={700}>Right</text>
          <text x={hx + hw / 4} y={midY - 17} fontSize={11} textAnchor="middle" fill={BLUE} fontWeight={700}>atrium</text>
        </g>
        <g data-feature={N.part('right_ventricle')} data-feature-label="Right ventricle">
          <rect x={hx + 4} y={midY + 2} width={hw / 2 - 6} height={hh / 2 - 6} rx={10} fill="#bfdbfe" stroke={hi('right_ventricle') ? HL_STROKE : 'none'} strokeWidth={hi('right_ventricle') ? 3 : 0} />
          <text x={hx + hw / 4} y={midY + 24} fontSize={11} textAnchor="middle" fill={BLUE} fontWeight={700}>Right</text>
          <text x={hx + hw / 4} y={midY + 37} fontSize={11} textAnchor="middle" fill={BLUE} fontWeight={700}>ventricle</text>
        </g>
        <g data-feature={N.part('left_atrium')} data-feature-label="Left atrium">
          <rect x={midX + 2} y={hy + 4} width={hw / 2 - 6} height={hh / 2 - 6} rx={10} fill="#fee2e2" stroke={hi('left_atrium') ? HL_STROKE : 'none'} strokeWidth={hi('left_atrium') ? 3 : 0} />
          <text x={midX + hw / 4} y={midY - 30} fontSize={11} textAnchor="middle" fill={RED} fontWeight={700}>Left</text>
          <text x={midX + hw / 4} y={midY - 17} fontSize={11} textAnchor="middle" fill={RED} fontWeight={700}>atrium</text>
        </g>
        <g data-feature={N.part('left_ventricle')} data-feature-label="Left ventricle">
          <rect x={midX + 2} y={midY + 2} width={hw / 2 - 6} height={hh / 2 - 6} rx={10} fill="#fecaca" stroke={hi('left_ventricle') ? HL_STROKE : 'none'} strokeWidth={hi('left_ventricle') ? 3 : 0} />
          <text x={midX + hw / 4} y={midY + 24} fontSize={11} textAnchor="middle" fill={RED} fontWeight={700}>Left</text>
          <text x={midX + hw / 4} y={midY + 37} fontSize={11} textAnchor="middle" fill={RED} fontWeight={700}>ventricle</text>
        </g>
        <text x={midX} y={hy - 8} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={700}>HEART</text>

        {/* legend */}
        <g>
          <rect x={40} y={H - 44} width={12} height={12} rx={3} fill={BLUE} />
          <text x={58} y={H - 34} fontSize={10.5} textAnchor="start" fill={INK}>deoxygenated</text>
          <rect x={150} y={H - 44} width={12} height={12} rx={3} fill={RED} />
          <text x={168} y={H - 34} fontSize={10.5} textAnchor="start" fill={INK}>oxygenated</text>
        </g>
      </svg>
    </div>
  );
}
