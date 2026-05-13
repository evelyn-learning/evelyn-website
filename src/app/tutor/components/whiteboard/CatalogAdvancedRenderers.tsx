'use client';

import React from 'react';
import type {
  UnitCircleFigure,
  TransformationFigure,
  InequalityGraphFigure,
  SentenceDiagramFigure,
  ArgumentFigure,
  HistoricalTimelineFigure,
  GovernmentBranchesFigure,
  ComparisonTableFigure,
  OrganizerFigure,
  HierarchyPyramidFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';
import {
  comparisonTableFeatureNames,
  tChartFeatureNames,
  kwlChartFeatureNames,
  frayerModelFeatureNames,
  argumentStructureFeatureNames,
  governmentBranchesFeatureNames,
} from '@/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';

// ── Unit circle ───────────────────────────────────────────────────────────
export function CatalogUnitCircleRenderer({ figure }: { figure: UnitCircleFigure }) {
  const { angleDegrees, showSinCos, showRadians, title } = figure;
  const W = 380;
  const H = 380;
  const cx = W / 2;
  const cy = H / 2;
  const r = 130;
  const rad = (angleDegrees * Math.PI) / 180;
  const px = cx + r * Math.cos(rad);
  const py = cy - r * Math.sin(rad);
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px]">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth={2} />
        <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="#9ca3af" strokeWidth={1} />
        <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="#9ca3af" strokeWidth={1} />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="#dc2626" strokeWidth={2.5} />
        {showSinCos && (
          <g>
            <line x1={px} y1={py} x2={px} y2={cy} stroke="#16a34a" strokeWidth={1.5} strokeDasharray="4 3" />
            <line x1={cx} y1={py} x2={px} y2={py} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={(cx + px) / 2} y={py - 6} fontSize={12} fill="#3b82f6" fontWeight={700} textAnchor="middle">
              cos = {Math.cos(rad).toFixed(2)}
            </text>
            <text x={px + 8} y={(cy + py) / 2} fontSize={12} fill="#16a34a" fontWeight={700}>
              sin = {Math.sin(rad).toFixed(2)}
            </text>
          </g>
        )}
        <circle cx={px} cy={py} r={5} fill="#dc2626" />
        <text x={cx} y={H - 14} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>
          θ = {angleDegrees}°{showRadians ? ` = ${(rad).toFixed(3)} rad` : ''}
        </text>
      </svg>
    </div>
  );
}

// ── Transformation ────────────────────────────────────────────────────────
export function CatalogTransformationRenderer({ figure }: { figure: TransformationFigure }) {
  const { shape, transform, title } = figure;
  const W = 480;
  const H = 380;
  const cx = W / 2;
  const cy = H / 2;
  const scale = 24;
  const px = (x: number) => cx + x * scale;
  const py = (y: number) => cy - y * scale;
  // Compute transformed vertices.
  const transformed = shape.vertices.map((v) => {
    let { x, y } = v;
    if (transform.type === 'translate') {
      x += transform.tx ?? 0; y += transform.ty ?? 0;
    } else if (transform.type === 'rotate') {
      const a = ((transform.angleDeg ?? 0) * Math.PI) / 180;
      const nx = x * Math.cos(a) - y * Math.sin(a);
      const ny = x * Math.sin(a) + y * Math.cos(a);
      x = nx; y = ny;
    } else if (transform.type === 'reflect') {
      if (transform.axis === 'x') y = -y;
      if (transform.axis === 'y') x = -x;
    } else if (transform.type === 'scale') {
      x *= transform.sx ?? 1; y *= transform.sy ?? 1;
    }
    return { x, y };
  });
  const path = (verts: Array<{ x: number; y: number }>) =>
    `M ${verts.map((v) => `${px(v.x)} ${py(v.y)}`).join(' L ')} Z`;
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e5e7eb" strokeWidth={1} />
        {/* Pre-image */}
        <path d={path(shape.vertices)} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth={2} />
        {/* Image */}
        <path d={path(transformed)} fill="rgba(220, 38, 38, 0.2)" stroke="#dc2626" strokeWidth={2} />
        <text x={W - 14} y={20} fontSize={12} textAnchor="end" fill="#3b82f6" fontWeight={700}>pre-image</text>
        <text x={W - 14} y={36} fontSize={12} textAnchor="end" fill="#dc2626" fontWeight={700}>image</text>
        <text x={cx} y={H - 14} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>
          {transform.type}
          {transform.type === 'translate' && ` (${transform.tx ?? 0}, ${transform.ty ?? 0})`}
          {transform.type === 'rotate' && ` ${transform.angleDeg}°`}
          {transform.type === 'reflect' && ` over ${transform.axis}-axis`}
          {transform.type === 'scale' && ` (${transform.sx}, ${transform.sy})`}
        </text>
      </svg>
    </div>
  );
}

// ── Inequality graph ──────────────────────────────────────────────────────
export function CatalogInequalityGraphRenderer({ figure }: { figure: InequalityGraphFigure }) {
  const { variable, operator, value, title } = figure;
  const W = 600;
  const H = 140;
  const cy = H / 2;
  const span = Math.max(Math.abs(value) * 2 + 6, 10);
  const min = -span / 2;
  const max = span / 2;
  const center = value;
  const PAD = 50;
  const usableW = W - PAD * 2;
  const xOf = (v: number) => PAD + ((v - (center + min)) / span) * usableW;
  const valueX = xOf(value);
  const includeEq = operator === '<=' || operator === '>=';
  const direction = operator === '<' || operator === '<=' ? -1 : 1;
  const ticks: number[] = [];
  for (let v = Math.floor(center + min); v <= Math.ceil(center + max); v++) ticks.push(v);
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        <line x1={PAD - 12} y1={cy} x2={W - PAD + 12} y2={cy} stroke="#1f2937" strokeWidth={2} />
        <polygon points={`${PAD - 12},${cy} ${PAD - 4},${cy - 5} ${PAD - 4},${cy + 5}`} fill="#1f2937" />
        <polygon points={`${W - PAD + 12},${cy} ${W - PAD + 4},${cy - 5} ${W - PAD + 4},${cy + 5}`} fill="#1f2937" />
        {ticks.map((t) => {
          const x = xOf(t);
          if (x < PAD - 12 || x > W - PAD + 12) return null;
          return (
            <g key={t}>
              <line x1={x} y1={cy - 6} x2={x} y2={cy + 6} stroke="#1f2937" strokeWidth={1.5} />
              <text x={x} y={cy + 22} fontSize={12} textAnchor="middle" fill="#374151">{t}</text>
            </g>
          );
        })}
        {/* Ray */}
        <line
          x1={valueX}
          y1={cy}
          x2={direction > 0 ? W - PAD + 12 : PAD - 12}
          y2={cy}
          stroke="#dc2626"
          strokeWidth={4}
        />
        {/* Endpoint */}
        <circle cx={valueX} cy={cy} r={7} fill={includeEq ? '#dc2626' : '#fff'} stroke="#dc2626" strokeWidth={2.5} />
        <text x={W / 2} y={H - 14} fontSize={14} textAnchor="middle" fill="#374151" fontWeight={600}>
          {variable} {operator} {value}
        </text>
      </svg>
    </div>
  );
}

// ── Sentence diagram ──────────────────────────────────────────────────────
export function CatalogSentenceDiagramRenderer({ figure }: { figure: SentenceDiagramFigure }) {
  const { subject, verb, object, modifiers, title } = figure;
  const W = 720;
  const H = modifiers && modifiers.length > 0 ? 240 : 160;
  const baseY = 80;
  const subjEnd = 240;
  const verbEnd = object ? 480 : 600;
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]">
        {/* Base line */}
        <line x1={40} y1={baseY} x2={W - 40} y2={baseY} stroke="#1f2937" strokeWidth={2} />
        {/* Subject | Verb separator */}
        <line x1={subjEnd} y1={baseY - 30} x2={subjEnd} y2={baseY + 30} stroke="#1f2937" strokeWidth={2} />
        {/* Verb | Object separator */}
        {object && <line x1={verbEnd} y1={baseY - 20} x2={verbEnd} y2={baseY} stroke="#1f2937" strokeWidth={2} />}
        <text x={(40 + subjEnd) / 2} y={baseY - 10} fontSize={16} textAnchor="middle" fill="#1f2937" fontWeight={600}>{subject}</text>
        <text x={(subjEnd + verbEnd) / 2} y={baseY - 10} fontSize={16} textAnchor="middle" fill="#1f2937" fontWeight={600}>{verb}</text>
        {object && <text x={(verbEnd + (W - 40)) / 2} y={baseY - 10} fontSize={16} textAnchor="middle" fill="#1f2937" fontWeight={600}>{object}</text>}
        {/* Modifiers as diagonal hangs */}
        {modifiers?.map((m, i) => {
          let baseX: number;
          if (m.attachTo === 'subject') baseX = (40 + subjEnd) / 2;
          else if (m.attachTo === 'verb') baseX = (subjEnd + verbEnd) / 2;
          else baseX = (verbEnd + (W - 40)) / 2;
          const dx = i % 2 === 0 ? -30 : 30;
          return (
            <g key={i}>
              <line x1={baseX} y1={baseY} x2={baseX + dx} y2={baseY + 60} stroke="#6b7280" strokeWidth={1.5} />
              <text x={baseX + dx} y={baseY + 76} fontSize={13} textAnchor="middle" fill="#6b7280" fontStyle="italic">{m.word}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Argument structure ────────────────────────────────────────────────────
export function CatalogArgumentStructureRenderer({ figure }: { figure: ArgumentFigure }) {
  const { claim, evidence, reasoning, counter, rebuttal, title } = figure;
  const N = argumentStructureFeatureNames;
  return (
    <div data-feature={N.argument} className="w-full flex flex-col items-center gap-3">
      {title && <div className="text-base font-semibold text-gray-800">{title}</div>}
      <div data-feature={N.claim} className="px-5 py-3 rounded-lg bg-blue-50 border-2 border-blue-400 max-w-[600px] w-full">
        <div className="text-xs font-bold uppercase text-blue-700 mb-1">Claim</div>
        <div className="text-base text-blue-900">{claim}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[640px] w-full">
        <div data-feature={N.evidence} className="p-3 rounded-lg bg-green-50 border border-green-300">
          <div className="text-xs font-bold uppercase text-green-700 mb-1">Evidence</div>
          <ul className="text-sm text-green-900 list-disc list-inside space-y-1">
            {evidence.map((e, i) => <li key={i} data-feature={N.evidenceItem(i)}>{e}</li>)}
          </ul>
        </div>
        <div data-feature={N.reasoning} className="p-3 rounded-lg bg-amber-50 border border-amber-300">
          <div className="text-xs font-bold uppercase text-amber-700 mb-1">Reasoning</div>
          <ul className="text-sm text-amber-900 list-disc list-inside space-y-1">
            {reasoning.map((r, i) => <li key={i} data-feature={N.reasoningItem(i)}>{r}</li>)}
          </ul>
        </div>
      </div>
      {counter && (
        <div data-feature={N.counter} className="p-3 rounded-lg bg-rose-50 border border-rose-300 max-w-[600px] w-full">
          <div className="text-xs font-bold uppercase text-rose-700 mb-1">Counterargument</div>
          <div className="text-sm text-rose-900">{counter}</div>
          {rebuttal && (
            <div data-feature={N.rebuttal} className="mt-2">
              <div className="text-xs font-bold uppercase text-rose-700 mb-1">Rebuttal</div>
              <div className="text-sm text-rose-900">{rebuttal}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Historical timeline ───────────────────────────────────────────────────
export function CatalogHistoricalTimelineRenderer({ figure }: { figure: HistoricalTimelineFigure }) {
  const { events, title } = figure;
  const W = 760;
  const PAD = 40;
  const minY = events[0].year;
  const maxY = events[events.length - 1].year;
  const span = maxY - minY || 1;
  const usableW = W - PAD * 2;
  const xOf = (y: number) => PAD + ((y - minY) / span) * usableW;
  const baseY = 200;
  const altOffsets = [-100, 60, -60, 100, -80, 80];
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} 320`} className="w-full max-w-[820px]">
        <line x1={PAD} y1={baseY} x2={W - PAD} y2={baseY} stroke="#1f2937" strokeWidth={2} />
        {events.map((e, i) => {
          const x = xOf(e.year);
          const dy = altOffsets[i % altOffsets.length];
          const labelY = baseY + dy;
          const color = e.color || '#3b82f6';
          return (
            <g key={i}>
              <line x1={x} y1={baseY} x2={x} y2={labelY} stroke={color} strokeWidth={1.5} strokeDasharray="3 2" />
              <circle cx={x} cy={baseY} r={6} fill={color} stroke="#fff" strokeWidth={2} />
              <rect x={x - 70} y={labelY - 18} width={140} height={36} rx={4} fill={color + '22'} stroke={color} strokeWidth={1.5} />
              <text x={x} y={labelY - 4} fontSize={11} textAnchor="middle" fill="#1f2937" fontWeight={700}>{e.date}</text>
              <text x={x} y={labelY + 12} fontSize={11} textAnchor="middle" fill="#374151">{e.label.slice(0, 22)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Government branches ───────────────────────────────────────────────────
export function CatalogGovernmentBranchesRenderer({ figure }: { figure: GovernmentBranchesFigure }) {
  const { country, branches, title } = figure;
  const N = governmentBranchesFeatureNames;
  const PALETTE = ['#3b82f6', '#16a34a', '#dc2626', '#8b5cf6'];
  return (
    <div data-feature={N.branches} className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <div data-feature={N.country} className="text-sm text-gray-600 mb-3">{country}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[760px] w-full">
        {branches.map((b, i) => {
          const color = PALETTE[i % PALETTE.length];
          return (
            <div key={i} data-feature={N.branch(i)} className="p-3 rounded-lg border-2" style={{ background: color + '11', borderColor: color }}>
              <div className="font-bold mb-1" style={{ color }}>{b.name}</div>
              {b.bodies && b.bodies.length > 0 && (
                <div data-feature={N.branchBodies(i)} className="text-xs text-gray-700 mb-1">
                  <span className="font-semibold">Bodies: </span>
                  {b.bodies.join(', ')}
                </div>
              )}
              {b.powers && b.powers.length > 0 && (
                <ul data-feature={N.branchPowers(i)} className="text-sm list-disc list-inside text-gray-800">
                  {b.powers.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Comparison table ──────────────────────────────────────────────────────
export function CatalogComparisonTableRenderer({ figure }: { figure: ComparisonTableFigure }) {
  const { items, attributes, cells, title } = figure;
  const N = comparisonTableFeatureNames;
  // data-feature values come from the SHARED naming helper that
  // buildComparisonTableManifest also calls — manifest names and DOM
  // attrs cannot drift by construction. Attribute name is `data-feature`
  // (matches the project-wide convention; WhiteboardCanvas overlay
  // queries `[data-feature="..."]` at line ~1083). See
  // src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social.ts.
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <table data-feature={N.table} className="border-collapse text-sm">
        <thead>
          <tr data-feature={N.headerRow}>
            <th className="px-3 py-2 border border-gray-400 bg-gray-100"></th>
            {items.map((it, i) => (
              <th
                key={i}
                data-feature={N.col(i)}
                className="px-3 py-2 border border-gray-400 bg-blue-50 font-semibold text-blue-900"
              >
                {it}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributes.map((attr, ri) => (
            <tr key={ri} data-feature={N.row(ri)}>
              <th className="px-3 py-2 border border-gray-400 bg-amber-50 font-semibold text-amber-900 text-left">{attr}</th>
              {cells[ri].map((c, ci) => (
                <td
                  key={ci}
                  data-feature={N.cell(ri, ci)}
                  className="px-3 py-2 border border-gray-300"
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Organizers (T-chart, KWL, Frayer) ─────────────────────────────────────
export function CatalogOrganizerRenderer({ figure }: { figure: OrganizerFigure }) {
  if (figure.kind === 't_chart') return <TChart figure={figure} />;
  if (figure.kind === 'kwl_chart') return <KWLChart figure={figure} />;
  return <FrayerModel figure={figure} />;
}

function TChart({ figure }: { figure: OrganizerFigure }) {
  const N = tChartFeatureNames;
  const rows = Math.max(figure.leftItems?.length || 0, figure.rightItems?.length || 0);
  // Rendered as CSS-grid divs (not <table>) so the LEFT and RIGHT
  // columns are actual DOM elements that can carry data-feature
  // markers for tutor_scribble. The previous <table> form had no
  // column-spanning element, so target="left-column" resolved
  // through the catalog but missed the DOM (observed 2026-05-13
  // session #7: 60+ "[Scribble] resolve-miss: data-feature=
  // 'left-column' not in HTML DOM" warnings as brain repeatedly
  // tried to highlight the Rights column).
  return (
    <div className="w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <div data-feature={N.chart} className="grid grid-cols-2 max-w-[640px] w-full border-2 border-gray-700">
        <div data-feature={N.leftColumn} className="flex flex-col border-r-2 border-gray-700">
          <div data-feature={N.leftHeader} className="px-3 py-2 border-b border-gray-400 bg-blue-50 font-bold text-blue-900 text-center">{figure.leftHeader}</div>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              data-feature={N.leftItem(i)}
              className={`px-3 py-2 ${i < rows - 1 ? 'border-b border-gray-400' : ''}`}
            >
              {figure.leftItems?.[i] || ''}
            </div>
          ))}
        </div>
        <div data-feature={N.rightColumn} className="flex flex-col">
          <div data-feature={N.rightHeader} className="px-3 py-2 border-b border-gray-400 bg-amber-50 font-bold text-amber-900 text-center">{figure.rightHeader}</div>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              data-feature={N.rightItem(i)}
              className={`px-3 py-2 ${i < rows - 1 ? 'border-b border-gray-400' : ''}`}
            >
              {figure.rightItems?.[i] || ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KWLChart({ figure }: { figure: OrganizerFigure }) {
  const N = kwlChartFeatureNames;
  // Each column needs its own data-feature (k-column / w-column / l-column)
  // and each list-item needs k-item-N / w-item-N / l-item-N. Loop iterates
  // [K, W, L] in order so column index 0=K, 1=W, 2=L.
  const columns = [
    { h: 'K — Know', items: figure.know, bg: 'bg-blue-50', fg: 'text-blue-900', border: 'border-blue-400', col: N.kColumn, item: N.kItem },
    { h: 'W — Want to know', items: figure.want, bg: 'bg-amber-50', fg: 'text-amber-900', border: 'border-amber-400', col: N.wColumn, item: N.wItem },
    { h: 'L — Learned', items: figure.learned, bg: 'bg-green-50', fg: 'text-green-900', border: 'border-green-400', col: N.lColumn, item: N.lItem },
  ];
  return (
    <div className="w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <div data-feature={N.chart} className="grid grid-cols-3 gap-2 max-w-[760px] w-full">
        {columns.map((col, i) => (
          <div key={i} data-feature={col.col} className={`p-3 border-2 rounded ${col.bg} ${col.border}`}>
            <div className={`font-bold ${col.fg} mb-2`}>{col.h}</div>
            <ul className="list-disc list-inside text-sm space-y-1">
              {(col.items || []).map((it, j) => <li key={j} data-feature={col.item(j)}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function FrayerModel({ figure }: { figure: OrganizerFigure }) {
  const N = frayerModelFeatureNames;
  return (
    <div className="w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <div data-feature={N.frayer} className="relative grid grid-cols-2 gap-0 max-w-[600px] w-full border-2 border-gray-700">
        <div data-feature={N.definition} className="p-3 border-r-2 border-b-2 border-gray-700 bg-blue-50">
          <div className="font-bold text-blue-900 text-xs uppercase mb-1">Definition</div>
          <div className="text-sm">{figure.definition || '—'}</div>
        </div>
        <div data-feature={N.characteristics} className="p-3 border-b-2 border-gray-700 bg-green-50">
          <div className="font-bold text-green-900 text-xs uppercase mb-1">Characteristics</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.characteristics || []).map((c, i) => <li key={i} data-feature={N.characteristicItem(i)}>{c}</li>)}
          </ul>
        </div>
        <div data-feature={N.examples} className="p-3 border-r-2 border-gray-700 bg-amber-50">
          <div className="font-bold text-amber-900 text-xs uppercase mb-1">Examples</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.examples || []).map((c, i) => <li key={i} data-feature={N.exampleItem(i)}>{c}</li>)}
          </ul>
        </div>
        <div data-feature={N.nonExamples} className="p-3 bg-rose-50">
          <div className="font-bold text-rose-900 text-xs uppercase mb-1">Non-Examples</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.nonExamples || []).map((c, i) => <li key={i} data-feature={N.nonExampleItem(i)}>{c}</li>)}
          </ul>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div data-feature={N.term} className="bg-white border-2 border-gray-700 rounded-full px-4 py-1 font-bold text-gray-900">{figure.term}</div>
        </div>
      </div>
    </div>
  );
}

// ── Hierarchy pyramid ─────────────────────────────────────────────────────
export function CatalogHierarchyPyramidRenderer({ figure }: { figure: HierarchyPyramidFigure }) {
  const { tiers, baseFirst, title } = figure;
  const ordered = baseFirst ? [...tiers] : [...tiers].reverse();
  const W = 480;
  const TIER_H = 56;
  const H = ordered.length * TIER_H + 60;
  const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899'];
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        {ordered.map((t, i) => {
          // Wider at the bottom (large index in ordered) when baseFirst.
          const fromTop = i;
          const tierFromBottom = ordered.length - 1 - fromTop;
          const w = 80 + tierFromBottom * 70;
          const x = (W - w) / 2;
          const y = 30 + fromTop * TIER_H;
          const color = t.color || PALETTE[i % PALETTE.length];
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={TIER_H - 4} fill={color} stroke="#1f2937" strokeWidth={1.5} />
              <text x={x + w / 2} y={y + TIER_H / 2 + 4} fontSize={13} textAnchor="middle" fill="#fff" fontWeight={700}>
                {t.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
