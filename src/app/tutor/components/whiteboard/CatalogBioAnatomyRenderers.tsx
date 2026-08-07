'use client';

import React from 'react';
import {
  leafFeatureNames,
  nephronFeatureNames,
  digestiveFeatureNames,
  circulatoryFeatureNames,
  respiratoryFeatureNames,
  flowerFeatureNames,
  energyPyramidFeatureNames,
  eyeFeatureNames,
  earFeatureNames,
  type LeafCrossSectionFigure,
  type LeafPart,
  type NephronFigure,
  type NephronPart,
  type DigestiveSystemFigure,
  type DigestivePart,
  type CirculatorySystemFigure,
  type CirculatoryPart,
  type RespiratorySystemFigure,
  type RespiratoryPart,
  type FlowerStructureFigure,
  type FlowerPart,
  type EnergyPyramidFigure,
  type EyeCrossSectionFigure,
  type EyePart,
  type EarCrossSectionFigure,
  type EarPart,
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

// ══════════════════════════════════════════════════════════════════════════
//  energy_pyramid
// ══════════════════════════════════════════════════════════════════════════

const PYRAMID_COLORS = ['#16a34a', '#65a30d', '#d97706', '#dc2626', '#9333ea', '#0891b2'];

export function CatalogEnergyPyramidRenderer({ figure }: { figure: EnergyPyramidFigure }) {
  const N = energyPyramidFeatureNames;
  const H = 460;
  const cx = 300;
  const n = figure.levels.length;

  const apexY = 60;
  const baseY = 380;
  const Wtop = 150;   // truncated apex width (keeps top label readable)
  const Wbase = 460;
  // The per-tier energy annotation renders anchor=start just right of its
  // tier, so the canvas must fit the longest energy string (~6.9px/char at
  // fontSize 11.5) — a fixed 640 clipped even the solver defaults
  // ("10,000 kcal/m²/yr") beside the base tier.
  const longestEnergy = figure.showEnergy
    ? Math.max(0, ...figure.levels.map((l) => `${l.energy.toLocaleString()} ${figure.units}`.length))
    : 0;
  const W = Math.max(640, cx + Wbase / 2 + 8 + Math.round(longestEnergy * 6.9) + 8);
  const th = (baseY - apexY) / n;
  const widthAt = (y: number) => Wtop + (Wbase - Wtop) * ((y - apexY) / (baseY - apexY));

  const heading = figure.title || 'Energy pyramid';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[640px]"
        data-feature={N.figure}
        data-feature-label={heading}
        data-feature-cx={cx / W}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {figure.levels.map((lvl, iFromBottom) => {
          // tier k from top corresponds to level (n-1-k) from bottom.
          const k = n - 1 - iFromBottom;
          const yTop = apexY + k * th;
          const yBot = yTop + th;
          const topW = widthAt(yTop);
          const botW = widthAt(yBot);
          const color = PYRAMID_COLORS[iFromBottom % PYRAMID_COLORS.length];
          const midY = (yTop + yBot) / 2;
          return (
            <g key={iFromBottom} data-feature={N.tier(iFromBottom)} data-feature-label={lvl.label}>
              <polygon
                points={`${cx - topW / 2},${yTop} ${cx + topW / 2},${yTop} ${cx + botW / 2},${yBot} ${cx - botW / 2},${yBot}`}
                fill={color}
                fillOpacity={0.82}
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text x={cx} y={midY - (lvl.organisms ? 6 : 2)} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">{lvl.label}</text>
              {lvl.organisms && (
                <text x={cx} y={midY + 11} textAnchor="middle" fontSize={10.5} fill="#f8fafc">({lvl.organisms})</text>
              )}
              {figure.showEnergy && (
                <text x={cx + botW / 2 + 8} y={midY + 4} fontSize={11.5} fontWeight={600} fill={color} textAnchor="start">
                  {lvl.energy.toLocaleString()} {figure.units}
                </text>
              )}
              {/* 10%-transfer arrow between this tier and the one above */}
              {k > 0 && (
                <g>
                  <line x1={cx - botW / 2 - 14} y1={yTop} x2={cx - widthAt(yTop - th) / 2 - 14} y2={yTop - th} stroke="#475569" strokeWidth={1.5} markerEnd="url(#ep-arrow)" />
                </g>
              )}
            </g>
          );
        })}
        <defs>
          <marker id="ep-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#475569" />
          </marker>
        </defs>
        {figure.showEnergy && (
          <text x={cx - Wbase / 2 - 16} y={(apexY + baseY) / 2} fontSize={11} fill="#475569" textAnchor="middle" transform={`rotate(-90 ${cx - Wbase / 2 - 16} ${(apexY + baseY) / 2})`}>
            only ~{Math.round(figure.efficiency * 100)}% passes up · ~{Math.round((1 - figure.efficiency) * 100)}% lost as heat
          </text>
        )}
        <text x={cx} y={baseY + 30} textAnchor="middle" fontSize={11.5} fill="#64748b">Energy decreases up each trophic level</text>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  respiratory_system
// ══════════════════════════════════════════════════════════════════════════

export function CatalogRespiratorySystemRenderer({ figure }: { figure: RespiratorySystemFigure }) {
  const N = respiratoryFeatureNames;
  const W = 730;
  const H = 500;
  const hi = (p: RespiratoryPart) => figure.highlight.includes(p);
  const cx = 300;

  const AIR = '#93c5fd';       // airway fill
  const AIRSTROKE = '#2563eb';
  const LUNGL = '#fbcfe8';     // lung fill
  const LUNGSTROKE = '#db2777';
  const HLC = '#059669';
  const strokeFor = (p: RespiratoryPart, base: string) => (hi(p) ? HLC : base);
  const widthFor = (p: RespiratoryPart, base: number) => (hi(p) ? base + 1.5 : base);

  const labelL = 40;   // left label column x (text flows right)
  const labelR = 556;  // right label column x (text flows right; leaders end at labelR-6)

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'The respiratory system'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[730px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Respiratory system'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* nasal cavity + pharynx + larynx (upper tract, top center) */}
        <g data-feature={N.part('nasal_cavity')} data-feature-label="Nasal cavity">
          <path d="M250 40 Q300 20 340 44 L336 70 L262 70 Z" fill="#fde68a" fillOpacity={0.6} stroke={strokeFor('nasal_cavity', '#a16207')} strokeWidth={widthFor('nasal_cavity', 1.5)} />
          <line x1={262} y1={52} x2={labelL + 60} y2={40} stroke={INK} strokeWidth={0.7} />
          <text x={labelL} y={44} fontSize={12} fill={strokeFor('nasal_cavity', INK)} fontWeight={hi('nasal_cavity') ? 700 : 400}>Nasal cavity</text>
        </g>
        <g data-feature={N.part('pharynx')} data-feature-label="Pharynx">
          <rect x={288} y={70} width={24} height={26} fill={AIR} fillOpacity={0.5} stroke={strokeFor('pharynx', AIRSTROKE)} strokeWidth={widthFor('pharynx', 1.2)} />
          <line x1={312} y1={80} x2={labelR - 6} y2={62} stroke={INK} strokeWidth={0.7} />
          <text x={labelR} y={66} fontSize={12} fill={strokeFor('pharynx', INK)} fontWeight={hi('pharynx') ? 700 : 400}>Pharynx (throat)</text>
        </g>
        <g data-feature={N.part('larynx')} data-feature-label="Larynx">
          <rect x={286} y={96} width={28} height={22} rx={4} fill="#c7d2fe" stroke={strokeFor('larynx', '#4338ca')} strokeWidth={widthFor('larynx', 1.4)} />
          <line x1={286} y1={107} x2={labelL + 54} y2={100} stroke={INK} strokeWidth={0.7} />
          <text x={labelL} y={104} fontSize={12} fill={strokeFor('larynx', INK)} fontWeight={hi('larynx') ? 700 : 400}>Larynx</text>
        </g>

        {/* trachea (vertical tube with cartilage rings) */}
        <g data-feature={N.part('trachea')} data-feature-label="Trachea">
          <rect x={286} y={118} width={28} height={110} rx={6} fill={AIR} stroke={strokeFor('trachea', AIRSTROKE)} strokeWidth={widthFor('trachea', 1.8)} />
          {[132, 148, 164, 180, 196, 212].map((y) => (
            <line key={y} x1={288} y1={y} x2={312} y2={y} stroke={AIRSTROKE} strokeWidth={0.9} opacity={0.6} />
          ))}
          <line x1={314} y1={150} x2={labelR - 6} y2={132} stroke={INK} strokeWidth={0.7} />
          <text x={labelR} y={136} fontSize={12} fill={strokeFor('trachea', INK)} fontWeight={hi('trachea') ? 700 : 400}>Trachea (windpipe)</text>
        </g>

        {/* bronchi (two tubes branching to each lung) */}
        <g data-feature={N.part('bronchi')} data-feature-label="Bronchi">
          <path d="M298 228 Q250 250 214 286" fill="none" stroke={strokeFor('bronchi', AIRSTROKE)} strokeWidth={widthFor('bronchi', 10)} strokeLinecap="round" />
          <path d="M302 228 Q350 250 386 286" fill="none" stroke={strokeFor('bronchi', AIRSTROKE)} strokeWidth={widthFor('bronchi', 10)} strokeLinecap="round" />
          <line x1={214} y1={286} x2={labelL + 46} y2={276} stroke={INK} strokeWidth={0.7} />
          <text x={labelL} y={280} fontSize={12} fill={strokeFor('bronchi', INK)} fontWeight={hi('bronchi') ? 700 : 400}>Bronchi</text>
        </g>

        {/* lungs */}
        <g data-feature={N.part('right_lung')} data-feature-label="Right lung">
          <path d="M214 286 Q150 300 150 380 Q150 440 210 452 Q244 452 244 400 L232 300 Q226 288 214 286 Z" fill={LUNGL} fillOpacity={0.75} stroke={strokeFor('right_lung', LUNGSTROKE)} strokeWidth={widthFor('right_lung', 1.8)} />
          <text x={182} y={340} fontSize={11.5} fill={strokeFor('right_lung', '#9d174d')} fontWeight={hi('right_lung') ? 700 : 500} textAnchor="middle">Right lung</text>
          <text x={182} y={356} fontSize={9.5} fill="#9d174d" textAnchor="middle">(3 lobes)</text>
        </g>
        <g data-feature={N.part('left_lung')} data-feature-label="Left lung">
          <path d="M386 286 Q450 300 450 380 Q450 440 390 452 Q356 452 356 400 L368 300 Q374 288 386 286 Z" fill={LUNGL} fillOpacity={0.75} stroke={strokeFor('left_lung', LUNGSTROKE)} strokeWidth={widthFor('left_lung', 1.8)} />
          <text x={418} y={340} fontSize={11.5} fill={strokeFor('left_lung', '#9d174d')} fontWeight={hi('left_lung') ? 700 : 500} textAnchor="middle">Left lung</text>
          <text x={418} y={356} fontSize={9.5} fill="#9d174d" textAnchor="middle">(2 lobes)</text>
        </g>

        {/* bronchioles (fine branching inside the right lung) */}
        <g data-feature={N.part('bronchioles')} data-feature-label="Bronchioles">
          <path d="M214 286 Q205 320 196 344 M196 344 Q188 360 180 372 M196 344 Q206 362 214 374" fill="none" stroke={strokeFor('bronchioles', AIRSTROKE)} strokeWidth={widthFor('bronchioles', 2)} strokeLinecap="round" opacity={0.8} />
          <line x1={180} y1={372} x2={labelL + 56} y2={396} stroke={INK} strokeWidth={0.7} />
          <text x={labelL} y={400} fontSize={12} fill={strokeFor('bronchioles', INK)} fontWeight={hi('bronchioles') ? 700 : 400}>Bronchioles</text>
        </g>

        {/* alveoli inset (zoomed grape-cluster from the left lung) */}
        <g data-feature={N.part('alveoli')} data-feature-label="Alveoli">
          <line x1={396} y1={360} x2={470} y2={330} stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 3" />
          {[[470, 320], [492, 316], [486, 338], [508, 330], [478, 340], [500, 348]].map(([ax, ay], i) => (
            <circle key={i} cx={ax} cy={ay} r={11} fill="#fecdd3" stroke={strokeFor('alveoli', LUNGSTROKE)} strokeWidth={widthFor('alveoli', 1.3)} />
          ))}
          <text x={labelR} y={312} fontSize={12} fill={strokeFor('alveoli', INK)} fontWeight={hi('alveoli') ? 700 : 400}>Alveoli (air sacs)</text>
          <text x={labelR} y={326} fontSize={9.5} fill="#64748b">gas exchange</text>
        </g>

        {/* diaphragm (dome muscle under the lungs) */}
        <g data-feature={N.part('diaphragm')} data-feature-label="Diaphragm">
          <path d="M150 456 Q300 500 450 456" fill="none" stroke={strokeFor('diaphragm', '#b45309')} strokeWidth={widthFor('diaphragm', 4)} />
          <line x1={360} y1={472} x2={labelR - 6} y2={468} stroke={INK} strokeWidth={0.7} />
          <text x={labelR} y={472} fontSize={12} fill={strokeFor('diaphragm', INK)} fontWeight={hi('diaphragm') ? 700 : 400}>Diaphragm</text>
        </g>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  flower_structure  (longitudinal section)
// ══════════════════════════════════════════════════════════════════════════

export function CatalogFlowerStructureRenderer({ figure }: { figure: FlowerStructureFigure }) {
  const N = flowerFeatureNames;
  const W = 700;
  const H = 500;
  const hi = (p: FlowerPart) => figure.highlight.includes(p);
  const cx = 300;
  const HLC = '#059669';
  const strokeFor = (p: FlowerPart, base: string) => (hi(p) ? HLC : base);
  const widthFor = (p: FlowerPart, base: number) => (hi(p) ? base + 1.5 : base);
  const labelL = 40, labelR = 556; // both columns left-anchored; right leaders end at labelR-6

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'Parts of a flower'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[700px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Flower structure'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* petals (spreading behind, colored) */}
        <g data-feature={N.part('petal')} data-feature-label="Petal">
          <path d="M300 250 Q150 210 120 120 Q210 150 300 250 Z" fill="#f9a8d4" fillOpacity={0.8} stroke={strokeFor('petal', '#be185d')} strokeWidth={widthFor('petal', 1.5)} />
          <path d="M300 250 Q450 210 480 120 Q390 150 300 250 Z" fill="#f9a8d4" fillOpacity={0.8} stroke={strokeFor('petal', '#be185d')} strokeWidth={widthFor('petal', 1.5)} />
          <path d="M300 250 Q210 150 300 96 Q390 150 300 250 Z" fill="#f9a8d4" fillOpacity={0.65} stroke={strokeFor('petal', '#be185d')} strokeWidth={widthFor('petal', 1.5)} />
          <line x1={140} y1={140} x2={labelL + 40} y2={130} stroke={INK} strokeWidth={0.7} />
          <text x={labelL} y={134} fontSize={12} fill={strokeFor('petal', INK)} fontWeight={hi('petal') ? 700 : 400}>Petal</text>
        </g>

        {/* stamens (filament + anther) flanking the center */}
        <g data-feature={N.part('filament')} data-feature-label="Filament">
          <path d="M262 250 Q248 190 236 150" fill="none" stroke={strokeFor('filament', '#ca8a04')} strokeWidth={widthFor('filament', 2.5)} />
          <path d="M338 250 Q352 190 364 150" fill="none" stroke={strokeFor('filament', '#ca8a04')} strokeWidth={widthFor('filament', 2.5)} />
          <line x1={236} y1={190} x2={labelL + 40} y2={186} stroke={INK} strokeWidth={0.7} />
          <text x={labelL} y={190} fontSize={12} fill={strokeFor('filament', INK)} fontWeight={hi('filament') ? 700 : 400}>Filament</text>
        </g>
        <g data-feature={N.part('anther')} data-feature-label="Anther">
          <ellipse cx={236} cy={144} rx={12} ry={8} fill="#fbbf24" stroke={strokeFor('anther', '#b45309')} strokeWidth={widthFor('anther', 1.4)} />
          <ellipse cx={364} cy={144} rx={12} ry={8} fill="#fbbf24" stroke={strokeFor('anther', '#b45309')} strokeWidth={widthFor('anther', 1.4)} />
          <line x1={376} y1={144} x2={labelR - 6} y2={150} stroke={INK} strokeWidth={0.7} />
          <text x={labelR} y={154} fontSize={12} fill={strokeFor('anther', INK)} fontWeight={hi('anther') ? 700 : 400}>Anther (pollen)</text>
        </g>

        {/* central carpel: ovary → style → stigma */}
        <g data-feature={N.part('stigma')} data-feature-label="Stigma">
          <ellipse cx={300} cy={110} rx={20} ry={11} fill="#a3e635" stroke={strokeFor('stigma', '#4d7c0f')} strokeWidth={widthFor('stigma', 1.6)} />
          <line x1={320} y1={110} x2={labelR - 6} y2={112} stroke={INK} strokeWidth={0.7} />
          <text x={labelR} y={116} fontSize={12} fill={strokeFor('stigma', INK)} fontWeight={hi('stigma') ? 700 : 400}>Stigma</text>
        </g>
        <g data-feature={N.part('style')} data-feature-label="Style">
          <rect x={294} y={118} width={12} height={130} rx={6} fill="#bef264" stroke={strokeFor('style', '#4d7c0f')} strokeWidth={widthFor('style', 1.4)} />
          <line x1={306} y1={183} x2={labelR - 6} y2={196} stroke={INK} strokeWidth={0.7} />
          <text x={labelR} y={200} fontSize={12} fill={strokeFor('style', INK)} fontWeight={hi('style') ? 700 : 400}>Style</text>
        </g>
        <g data-feature={N.part('ovary')} data-feature-label="Ovary">
          <path d="M300 248 Q256 250 258 320 Q262 372 300 374 Q338 372 342 320 Q344 250 300 248 Z" fill="#86efac" fillOpacity={0.85} stroke={strokeFor('ovary', '#15803d')} strokeWidth={widthFor('ovary', 1.8)} />
          <line x1={342} y1={320} x2={labelR - 6} y2={330} stroke={INK} strokeWidth={0.7} />
          <text x={labelR} y={334} fontSize={12} fill={strokeFor('ovary', INK)} fontWeight={hi('ovary') ? 700 : 400}>Ovary</text>
        </g>
        <g data-feature={N.part('ovule')} data-feature-label="Ovule">
          {[[286, 312], [314, 312], [300, 338]].map(([ox, oy], i) => (
            <circle key={i} cx={ox} cy={oy} r={8} fill="#fef9c3" stroke={strokeFor('ovule', '#15803d')} strokeWidth={widthFor('ovule', 1.2)} />
          ))}
          <line x1={286} y1={312} x2={labelL + 40} y2={330} stroke={INK} strokeWidth={0.7} />
          <text x={labelL} y={334} fontSize={12} fill={strokeFor('ovule', INK)} fontWeight={hi('ovule') ? 700 : 400}>Ovule → seed</text>
        </g>

        {/* sepals (green, below petals) */}
        <g data-feature={N.part('sepal')} data-feature-label="Sepal">
          <path d="M300 250 Q240 260 214 300 Q270 286 300 250 Z" fill="#4ade80" fillOpacity={0.7} stroke={strokeFor('sepal', '#15803d')} strokeWidth={widthFor('sepal', 1.4)} />
          <path d="M300 250 Q360 260 386 300 Q330 286 300 250 Z" fill="#4ade80" fillOpacity={0.7} stroke={strokeFor('sepal', '#15803d')} strokeWidth={widthFor('sepal', 1.4)} />
          <line x1={214} y1={300} x2={labelL + 40} y2={282} stroke={INK} strokeWidth={0.7} />
          <text x={labelL} y={286} fontSize={12} fill={strokeFor('sepal', INK)} fontWeight={hi('sepal') ? 700 : 400}>Sepal</text>
        </g>

        {/* receptacle + stalk */}
        <g data-feature={N.part('receptacle')} data-feature-label="Receptacle">
          <path d="M272 374 Q300 396 328 374 L322 396 Q300 408 278 396 Z" fill="#65a30d" stroke={strokeFor('receptacle', '#3f6212')} strokeWidth={widthFor('receptacle', 1.5)} />
          <rect x={294} y={400} width={12} height={70} fill="#4d7c0f" />
          <line x1={328} y1={386} x2={labelR - 6} y2={392} stroke={INK} strokeWidth={0.7} />
          <text x={labelR} y={396} fontSize={12} fill={strokeFor('receptacle', INK)} fontWeight={hi('receptacle') ? 700 : 400}>Receptacle</text>
        </g>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  eye_cross_section
// ══════════════════════════════════════════════════════════════════════════

export function CatalogEyeCrossSectionRenderer({ figure }: { figure: EyeCrossSectionFigure }) {
  const N = eyeFeatureNames;
  const W = 860;
  const H = 560;
  const hi = (p: EyePart) => figure.highlight.includes(p);
  const HLC = '#059669';
  const sFor = (p: EyePart, base: string) => (hi(p) ? HLC : base);
  const wFor = (p: EyePart, base: number) => (hi(p) ? base + 1.5 : base);

  const Ox = 430, Oy = 280, R = 175;
  // point on a circle of radius r at standard angle θ° (screen coords, y down)
  const P = (r: number, deg: number): [number, number] => {
    const t = (deg * Math.PI) / 180;
    return [Ox + r * Math.cos(t), Oy - r * Math.sin(t)];
  };

  // sclera opening for the cornea: front window between 150° and 210°.
  const [sxTop, syTop] = P(R, 150);
  const [sxBot, syBot] = P(R, 210);
  // cornea apex (bulges left, more curved than the sphere)
  const corneaApex: [number, number] = [Ox - R - 8, Oy];

  // colors
  const SCLERA = '#f1f5f9', SCLERA_ST = '#64748b';
  const CHOROID = '#9f1239';
  const RETINA = '#fcd34d';
  const CORNEA = '#bfdbfe';
  const AQUEOUS = '#e0f2fe';
  const VITREOUS = '#eff6ff';
  const IRIS = '#0891b2';
  const LENS = '#a5f3fc';
  const NERVE = '#facc15';
  const INK = '#374151';

  // Back-lining arc as an explicitly-sampled polyline (SVG A-flags are
  // error-prone for major arcs). Sweeps increasing angle a1→a2 (degrees),
  // so passing a1=212, a2=508 traces the posterior ~296° and leaves the
  // front window (148°–212°) open for the cornea / iris / lens.
  const coatArc = (r: number, a1: number, a2: number) => {
    const pts: string[] = [];
    for (let a = a1; a <= a2; a += 3) {
      const [x, y] = P(r, a);
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ');
  };

  // lens (biconvex) centred behind the pupil
  const lensCx = 342, lensCy = Oy, lensRx = 22, lensRy = 60;
  const lensPath =
    `M ${lensCx} ${lensCy - lensRy} ` +
    `Q ${lensCx + lensRx + 8} ${lensCy} ${lensCx} ${lensCy + lensRy} ` +
    `Q ${lensCx - lensRx - 8} ${lensCy} ${lensCx} ${lensCy - lensRy} Z`;

  // optic nerve exit (posterior, slightly below the axis)
  const [onx, ony] = P(R - 6, 340);

  // light path: two parallel rays from the left → cornea → pupil → lens → fovea
  const foveaPt: [number, number] = P(R - 18, 2);

  const LX = 232;   // left labels: end-anchored, text ends here
  const RX = 632;   // right labels: start-anchored, text starts here
  type Row = { part: EyePart; ly: number; ax: number; ay: number };
  const leftRows: Row[] = [
    { part: 'cornea',                ly: 150, ax: corneaApex[0] + 2, ay: 288 },
    { part: 'aqueous_humor',         ly: 196, ax: 300, ay: 236 },
    { part: 'iris',                  ly: 242, ax: 300, ay: 222 },
    { part: 'pupil',                 ly: 300, ax: 300, ay: 280 },
    { part: 'lens',                  ly: 350, ax: lensCx, ay: Oy },
    { part: 'ciliary_body',          ly: 404, ax: 300, ay: 210 },
    { part: 'suspensory_ligaments',  ly: 452, ax: 322, ay: 236 },
  ];
  const rightRows: Row[] = [
    { part: 'sclera',          ly: 132, ax: P(R, 60)[0],  ay: P(R, 60)[1] },
    { part: 'choroid',         ly: 180, ax: P(R - 6, 46)[0], ay: P(R - 6, 46)[1] },
    { part: 'retina',          ly: 228, ax: P(R - 16, 30)[0], ay: P(R - 16, 30)[1] },
    { part: 'vitreous_humor',  ly: 300, ax: 486, ay: 316 },
    { part: 'fovea',           ly: 352, ax: foveaPt[0], ay: foveaPt[1] },
    { part: 'blind_spot',      ly: 404, ax: P(R - 14, 344)[0], ay: P(R - 14, 344)[1] },
    { part: 'optic_nerve',     ly: 456, ax: onx + 40, ay: ony + 26 },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'The human eye (cross-section)'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[860px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Eye cross-section'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* eyeball interior (vitreous humour) */}
        <g data-feature={N.part('vitreous_humor')} data-feature-label="Vitreous humour">
          <circle cx={Ox} cy={Oy} r={R - 3} fill={VITREOUS} />
        </g>

        {/* sclera (outer coat) — posterior wall, front window left open for the cornea */}
        <g data-feature={N.part('sclera')} data-feature-label="Sclera">
          <path d={coatArc(R, 212, 508)} fill="none" stroke={sFor('sclera', SCLERA_ST)} strokeWidth={wFor('sclera', 6)} strokeLinecap="round" />
        </g>
        {/* choroid + retina lining the back */}
        <g data-feature={N.part('choroid')} data-feature-label="Choroid">
          <path d={coatArc(R - 8, 214, 506)} fill="none" stroke={sFor('choroid', CHOROID)} strokeWidth={wFor('choroid', 7)} strokeLinecap="round" opacity={0.85} />
        </g>
        <g data-feature={N.part('retina')} data-feature-label="Retina">
          <path d={coatArc(R - 17, 214, 506)} fill="none" stroke={sFor('retina', RETINA)} strokeWidth={wFor('retina', 8)} strokeLinecap="round" />
        </g>

        {/* aqueous humour (front chamber) */}
        <g data-feature={N.part('aqueous_humor')} data-feature-label="Aqueous humour">
          <path d={`M ${sxTop} ${syTop} Q ${corneaApex[0]} ${corneaApex[1]} ${sxBot} ${syBot} L 330 320 L 330 240 Z`} fill={AQUEOUS} opacity={0.7} />
        </g>

        {/* light path */}
        {figure.showLightPath && (
          <g opacity={0.7}>
            {[250, 310].map((y0, i) => (
              <polyline
                key={i}
                points={`92,${y0} ${corneaApex[0] + 6},${y0} 315,${Oy} ${foveaPt[0]},${foveaPt[1]}`}
                fill="none" stroke="#f59e0b" strokeWidth={1.4} strokeDasharray="5 4"
              />
            ))}
            <text x={96} y={232} fontSize={11} fill="#b45309" fontStyle="italic">light</text>
          </g>
        )}

        {/* cornea (transparent bulging front dome) */}
        <g data-feature={N.part('cornea')} data-feature-label="Cornea">
          <path d={`M ${sxTop} ${syTop} Q ${corneaApex[0]} ${corneaApex[1]} ${sxBot} ${syBot}`} fill={CORNEA} fillOpacity={0.5} stroke={sFor('cornea', '#3b82f6')} strokeWidth={wFor('cornea', 2.5)} />
        </g>

        {/* iris (two segments) + pupil opening */}
        <g data-feature={N.part('iris')} data-feature-label="Iris">
          <path d={`M ${sxTop} ${syTop} L 316 254 L 300 250 L ${sxTop - 2} ${syTop + 10} Z`} fill={sFor('iris', IRIS)} stroke={sFor('iris', '#0e7490')} strokeWidth={wFor('iris', 1)} />
          <path d={`M ${sxBot} ${syBot} L 316 306 L 300 310 L ${sxBot - 2} ${syBot - 10} Z`} fill={sFor('iris', IRIS)} stroke={sFor('iris', '#0e7490')} strokeWidth={wFor('iris', 1)} />
        </g>
        <g data-feature={N.part('pupil')} data-feature-label="Pupil">
          <line x1={316} y1={254} x2={316} y2={306} stroke={sFor('pupil', '#111827')} strokeWidth={wFor('pupil', 4)} strokeLinecap="round" />
        </g>

        {/* ciliary body (wedges) + suspensory ligaments (zonules) */}
        <g data-feature={N.part('ciliary_body')} data-feature-label="Ciliary body">
          <path d={`M ${sxTop} ${syTop} l 14 8 l -14 8 Z`} fill={sFor('ciliary_body', '#7c3aed')} />
          <path d={`M ${sxBot} ${syBot} l 14 -8 l -14 -8 Z`} fill={sFor('ciliary_body', '#7c3aed')} />
        </g>
        <g data-feature={N.part('suspensory_ligaments')} data-feature-label="Suspensory ligaments">
          {[-1, 1].map((s) => (
            <g key={s}>
              <line x1={sxTop + 8} y1={s > 0 ? syTop + 8 : syBot - 8} x2={lensCx} y2={lensCy + s * (lensRy - 6)} stroke={sFor('suspensory_ligaments', '#94a3b8')} strokeWidth={wFor('suspensory_ligaments', 1)} />
            </g>
          ))}
        </g>

        {/* lens */}
        <g data-feature={N.part('lens')} data-feature-label="Lens">
          <path d={lensPath} fill={sFor('lens', LENS)} fillOpacity={0.85} stroke={sFor('lens', '#0891b2')} strokeWidth={wFor('lens', 1.8)} />
        </g>

        {/* fovea (notch on the retina at the back, on the axis) */}
        <g data-feature={N.part('fovea')} data-feature-label="Fovea">
          <circle cx={foveaPt[0]} cy={foveaPt[1]} r={4} fill={sFor('fovea', '#b45309')} />
        </g>

        {/* optic nerve + blind spot */}
        <g data-feature={N.part('optic_nerve')} data-feature-label="Optic nerve">
          <path d={`M ${onx - 6} ${ony - 16} Q ${onx + 60} ${ony + 4} ${onx + 76} ${ony + 30} L ${onx + 60} ${ony + 46} Q ${onx + 30} ${ony + 24} ${onx - 6} ${ony + 16} Z`} fill={sFor('optic_nerve', NERVE)} stroke={sFor('optic_nerve', '#a16207')} strokeWidth={wFor('optic_nerve', 1.5)} />
        </g>
        <g data-feature={N.part('blind_spot')} data-feature-label="Blind spot">
          <circle cx={P(R - 14, 344)[0]} cy={P(R - 14, 344)[1]} r={3.5} fill={sFor('blind_spot', '#334155')} />
        </g>

        {/* labels — left column (end-anchored), leaders end just right of text */}
        {leftRows.map((r) => (
          <g key={r.part} data-feature={N.part(r.part)} data-feature-label={String(r.part)}>
            <line x1={LX + 6} y1={r.ly - 4} x2={r.ax} y2={r.ay} stroke={INK} strokeWidth={0.7} />
            <text x={LX} y={r.ly} fontSize={12.5} textAnchor="end" fill={sFor(r.part, INK)} fontWeight={hi(r.part) ? 700 : 400}>{EYE_LABELS_R[r.part]}</text>
          </g>
        ))}
        {/* right column (start-anchored), leaders end just left of text */}
        {rightRows.map((r) => (
          <g key={r.part} data-feature={N.part(r.part)} data-feature-label={String(r.part)}>
            <line x1={RX - 6} y1={r.ly - 4} x2={r.ax} y2={r.ay} stroke={INK} strokeWidth={0.7} />
            <text x={RX} y={r.ly} fontSize={12.5} fill={sFor(r.part, INK)} fontWeight={hi(r.part) ? 700 : 400}>{EYE_LABELS_R[r.part]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const EYE_LABELS_R: Record<EyePart, string> = {
  cornea: 'Cornea',
  aqueous_humor: 'Aqueous humour',
  iris: 'Iris',
  pupil: 'Pupil',
  lens: 'Lens',
  ciliary_body: 'Ciliary body',
  suspensory_ligaments: 'Suspensory ligaments',
  sclera: 'Sclera',
  choroid: 'Choroid',
  retina: 'Retina',
  fovea: 'Fovea (yellow spot)',
  optic_nerve: 'Optic nerve',
  blind_spot: 'Blind spot',
  vitreous_humor: 'Vitreous humour',
};

// ══════════════════════════════════════════════════════════════════════════
//  ear_cross_section
// ══════════════════════════════════════════════════════════════════════════

export function CatalogEarCrossSectionRenderer({ figure }: { figure: EarCrossSectionFigure }) {
  const N = earFeatureNames;
  const W = 880;
  const H = 560;
  const hi = (p: EarPart) => figure.highlight.includes(p);
  const HLC = '#059669';
  const sFor = (p: EarPart, base: string) => (hi(p) ? HLC : base);
  const wFor = (p: EarPart, base: number) => (hi(p) ? base + 1.5 : base);

  const SKIN = '#fed7aa', SKIN_ST = '#c2410c';
  const BONE = '#e2e8f0', BONE_ST = '#475569';
  const COCHLEA = '#f472b6', COCHLEA_ST = '#be185d';
  const CANAL = '#38bdf8', CANAL_ST = '#0369a1';
  const NERVE = '#facc15', NERVE_ST = '#a16207';
  const INK = '#374151';

  // cochlea spiral (outer radius r0 spiralling inward), as a sampled polyline
  const spiral = (cx: number, cy: number, r0: number, rEnd: number, turns: number) => {
    const pts: string[] = [];
    const steps = Math.round(turns * 40);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ang = t * turns * 2 * Math.PI - Math.PI / 2;
      const r = r0 + (rEnd - r0) * t;
      pts.push(`${(cx + r * Math.cos(ang)).toFixed(1)} ${(cy + r * Math.sin(ang)).toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ');
  };

  const cochCx = 622, cochCy = 382;
  const vestibule: [number, number] = [548, 292];

  // label rows
  const LX = 208, RX = 660;
  type Row = { part: EarPart; ly: number; ax: number; ay: number; side: 'l' | 'r' | 't'; lx?: number };
  const rows: Row[] = [
    { part: 'pinna',               side: 'l', ly: 150, ax: 96,  ay: 220 },
    { part: 'ear_canal',           side: 'l', ly: 224, ax: 250, ay: 268 },
    { part: 'eardrum',             side: 'l', ly: 320, ax: 372, ay: 292 },
    { part: 'eustachian_tube',     side: 'l', ly: 430, ax: 452, ay: 430 },
    { part: 'malleus',             side: 't', lx: 372, ly: 72, ax: 392, ay: 250 },
    { part: 'incus',               side: 't', lx: 440, ly: 72, ax: 424, ay: 258 },
    { part: 'stapes',              side: 't', lx: 508, ly: 72, ax: 462, ay: 272 },
    { part: 'semicircular_canals', side: 'r', ly: 150, ax: 566, ay: 196 },
    { part: 'oval_window',         side: 'r', ly: 224, ax: 520, ay: 288 },
    { part: 'cochlea',             side: 'r', ly: 344, ax: cochCx + 44, ay: cochCy + 8 },
    { part: 'auditory_nerve',      side: 'r', ly: 430, ax: 726, ay: 392 },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'The human ear (cross-section)'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[880px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Ear cross-section'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* region bands */}
        {figure.showRegions && (
          <g opacity={0.5}>
            <rect x={0} y={100} width={345} height={430} fill="#fff7ed" />
            <rect x={345} y={100} width={155} height={430} fill="#eff6ff" />
            <rect x={500} y={100} width={380} height={430} fill="#fdf2f8" />
            <text x={172} y={122} fontSize={12.5} fontWeight={700} fill="#9a3412" textAnchor="middle">OUTER EAR</text>
            <text x={422} y={122} fontSize={12.5} fontWeight={700} fill="#1e40af" textAnchor="middle">MIDDLE EAR</text>
            <text x={690} y={122} fontSize={12.5} fontWeight={700} fill="#9d174d" textAnchor="middle">INNER EAR</text>
          </g>
        )}

        {/* ── outer ear ── */}
        <g data-feature={N.part('pinna')} data-feature-label="Pinna">
          <path d="M150 300 Q60 300 62 220 Q64 150 130 158 Q118 200 150 210 Q120 236 150 250 Q116 268 150 300 Z"
            fill={sFor('pinna', SKIN)} stroke={sFor('pinna', SKIN_ST)} strokeWidth={wFor('pinna', 2)} strokeLinejoin="round" />
        </g>
        <g data-feature={N.part('ear_canal')} data-feature-label="Ear canal">
          <path d="M150 250 L360 262 L360 300 L150 300 Z" fill={sFor('ear_canal', '#ffedd5')} stroke={sFor('ear_canal', SKIN_ST)} strokeWidth={wFor('ear_canal', 1.6)} />
        </g>

        {/* ── middle ear ── */}
        {/* tympanic (middle-ear) air cavity — grounds the ossicles + Eustachian tube */}
        <path d="M372 244 Q470 232 505 262 Q520 300 496 322 Q450 342 410 330 Q378 318 372 244 Z" fill="#dbeafe" opacity={0.55} />
        <g data-feature={N.part('eardrum')} data-feature-label="Eardrum">
          <line x1={364} y1={252} x2={376} y2={306} stroke={sFor('eardrum', '#7c3aed')} strokeWidth={wFor('eardrum', 4)} strokeLinecap="round" />
        </g>
        {/* ossicles: malleus → incus → stapes */}
        <g data-feature={N.part('malleus')} data-feature-label="Malleus">
          <line x1={370} y1={278} x2={398} y2={244} stroke={sFor('malleus', BONE_ST)} strokeWidth={wFor('malleus', 3)} strokeLinecap="round" />
          <circle cx={400} cy={242} r={7} fill={sFor('malleus', BONE)} stroke={sFor('malleus', BONE_ST)} strokeWidth={wFor('malleus', 1.5)} />
        </g>
        <g data-feature={N.part('incus')} data-feature-label="Incus">
          <path d="M400 242 L428 250 L436 272" fill="none" stroke={sFor('incus', BONE_ST)} strokeWidth={wFor('incus', 3)} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={428} cy={250} r={6} fill={sFor('incus', BONE)} stroke={sFor('incus', BONE_ST)} strokeWidth={wFor('incus', 1.5)} />
        </g>
        <g data-feature={N.part('stapes')} data-feature-label="Stapes">
          {/* two crura from the incus down to the footplate on the oval window */}
          <path d="M436 272 L508 280 M436 272 L508 292" fill="none" stroke={sFor('stapes', BONE_ST)} strokeWidth={wFor('stapes', 2.4)} strokeLinecap="round" />
        </g>
        <g data-feature={N.part('oval_window')} data-feature-label="Oval window">
          <ellipse cx={512} cy={286} rx={3.5} ry={11} fill={sFor('oval_window', '#fbbf24')} stroke={sFor('oval_window', '#a16207')} strokeWidth={wFor('oval_window', 1.3)} />
        </g>
        <g data-feature={N.part('eustachian_tube')} data-feature-label="Eustachian tube">
          <path d="M448 322 Q470 400 512 476" fill="none" stroke={sFor('eustachian_tube', SKIN_ST)} strokeWidth={wFor('eustachian_tube', 10)} strokeLinecap="round" opacity={0.85} />
          <path d="M448 322 Q470 400 512 476" fill="none" stroke="#ffedd5" strokeWidth={4.5} strokeLinecap="round" />
        </g>

        {/* ── inner ear ── */}
        {/* auditory nerve first, so the cochlea + vestibule sit on top of it */}
        <g data-feature={N.part('auditory_nerve')} data-feature-label="Auditory nerve">
          <path d={`M ${cochCx} ${cochCy} Q 690 420 748 398 L 748 386 Q 694 404 ${cochCx} ${cochCy - 14} Z`}
            fill={sFor('auditory_nerve', NERVE)} stroke={sFor('auditory_nerve', NERVE_ST)} strokeWidth={wFor('auditory_nerve', 1.5)} />
        </g>
        {/* semicircular canals: three loops fanning up/back from the vestibule */}
        <g data-feature={N.part('semicircular_canals')} data-feature-label="Semicircular canals">
          {[-46, -12, 24].map((rot, i) => (
            <ellipse key={i} cx={vestibule[0] + 2} cy={vestibule[1] - 56} rx={15} ry={50} fill="none"
              stroke={sFor('semicircular_canals', CANAL)} strokeWidth={wFor('semicircular_canals', 6)} strokeLinecap="round"
              transform={`rotate(${rot} ${vestibule[0] + 2} ${vestibule[1] - 4})`} />
          ))}
        </g>
        {/* vestibule connecting canals + cochlea */}
        <circle cx={vestibule[0]} cy={vestibule[1]} r={15} fill={sFor('semicircular_canals', '#bae6fd')} stroke={CANAL_ST} strokeWidth={1.4} />
        <g data-feature={N.part('cochlea')} data-feature-label="Cochlea">
          {/* neck connecting vestibule down to the cochlear spiral */}
          <path d={`M ${vestibule[0]} ${vestibule[1] + 8} Q ${vestibule[0] + 22} ${cochCy - 44} ${cochCx - 30} ${cochCy - 30}`} fill="none" stroke={sFor('cochlea', COCHLEA)} strokeWidth={wFor('cochlea', 12)} strokeLinecap="round" />
          <path d={spiral(cochCx, cochCy, 50, 6, 2.75)} fill="none" stroke={sFor('cochlea', COCHLEA)} strokeWidth={wFor('cochlea', 12)} strokeLinecap="round" />
          <path d={spiral(cochCx, cochCy, 50, 6, 2.75)} fill="none" stroke={COCHLEA_ST} strokeWidth={1} strokeLinecap="round" opacity={0.45} />
        </g>

        {/* ── labels ── */}
        {rows.map((r) => {
          const anchor = r.side === 'l' ? 'end' : r.side === 'r' ? 'start' : 'middle';
          const tx = r.side === 'l' ? LX : r.side === 'r' ? RX : (r.lx ?? 0);
          const x1 = r.side === 'l' ? LX + 6 : r.side === 'r' ? RX - 6 : (r.lx ?? 0);
          const y1 = r.side === 't' ? r.ly + 6 : r.ly - 4;
          return (
            <g key={r.part} data-feature={N.part(r.part)} data-feature-label={String(r.part)}>
              <line x1={x1} y1={y1} x2={r.ax} y2={r.ay} stroke={INK} strokeWidth={0.7} />
              <text x={tx} y={r.ly} fontSize={12.5} textAnchor={anchor} fill={sFor(r.part, INK)} fontWeight={hi(r.part) ? 700 : 400}>{EAR_LABELS_R[r.part]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const EAR_LABELS_R: Record<EarPart, string> = {
  pinna: 'Pinna (auricle)',
  ear_canal: 'Ear canal',
  eardrum: 'Eardrum',
  malleus: 'Malleus',
  incus: 'Incus',
  stapes: 'Stapes',
  oval_window: 'Oval window',
  semicircular_canals: 'Semicircular canals',
  cochlea: 'Cochlea',
  auditory_nerve: 'Auditory nerve',
  eustachian_tube: 'Eustachian tube',
};
