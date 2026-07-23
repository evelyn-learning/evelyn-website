'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { CellContent } from './CellContent';
import { useFitScale } from './useFitScale';
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
  ComplexPlaneFigure,
  PlotDiagramFigure,
  RhetoricalTriangleFigure,
  RhetoricalAppeal,
  CharacterWebFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';
import {
  rhetoricalTriangleFeatureNames,
  characterWebFeatureNames,
  comparisonTableFeatureNames,
  tChartFeatureNames,
  kwlChartFeatureNames,
  frayerModelFeatureNames,
  argumentStructureFeatureNames,
  governmentBranchesFeatureNames,
  sentenceDiagramFeatureNames,
  historicalTimelineFeatureNames,
  hierarchyPyramidFeatureNames,
  unitCircleFeatureNames,
  transformationFeatureNames,
  inequalityGraphFeatureNames,
  complexPlaneFeatureNames,
  plotDiagramFeatureNames,
  PLOT_STAGES,
} from '@/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';

// ── Unit circle ───────────────────────────────────────────────────────────
export function CatalogUnitCircleRenderer({ figure }: { figure: UnitCircleFigure }) {
  const { angleDegrees, showSinCos, showRadians, title } = figure;
  const N = unitCircleFeatureNames;
  const W = 380;
  const H = 380;
  const cx = W / 2;
  const cy = H / 2;
  const r = 130;
  const rad = (angleDegrees * Math.PI) / 180;
  const px = cx + r * Math.cos(rad);
  const py = cy - r * Math.sin(rad);
  return (
    <div
      className="w-full flex flex-col items-center"
      data-feature={N.circle}
      data-feature-label={title || 'unit circle'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px]">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth={2} />
        <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="#9ca3af" strokeWidth={1} />
        <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="#9ca3af" strokeWidth={1} />
        <line
          x1={cx} y1={cy} x2={px} y2={py}
          stroke="#dc2626" strokeWidth={2.5}
          data-feature={N.angle}
          data-feature-label={`${angleDegrees}°`}
          data-feature-cx={((cx + px) / 2) / W}
          data-feature-cy={((cy + py) / 2) / H}
          data-feature-w={Math.abs(px - cx) / W + 20 / W}
          data-feature-h={Math.abs(py - cy) / H + 20 / H}
        />
        {showSinCos && (
          <g>
            <line
              x1={px} y1={py} x2={px} y2={cy}
              stroke="#16a34a" strokeWidth={1.5} strokeDasharray="4 3"
              data-feature={N.sinLine}
              data-feature-label="sin"
              data-feature-cx={px / W}
              data-feature-cy={((cy + py) / 2) / H}
              data-feature-w={20 / W}
              data-feature-h={Math.abs(cy - py) / H}
            />
            <line
              x1={cx} y1={py} x2={px} y2={py}
              stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3"
              data-feature={N.cosLine}
              data-feature-label="cos"
              data-feature-cx={((cx + px) / 2) / W}
              data-feature-cy={py / H}
              data-feature-w={Math.abs(px - cx) / W}
              data-feature-h={20 / H}
            />
            <text x={(cx + px) / 2} y={py - 6} fontSize={12} fill="#3b82f6" fontWeight={700} textAnchor="middle">
              cos = {Math.cos(rad).toFixed(2)}
            </text>
            <text x={px + 8} y={(cy + py) / 2} fontSize={12} fill="#16a34a" fontWeight={700}>
              sin = {Math.sin(rad).toFixed(2)}
            </text>
          </g>
        )}
        <circle
          cx={px} cy={py} r={5}
          fill="#dc2626"
          data-feature={N.endpoint}
          data-feature-label="endpoint"
          data-feature-cx={px / W}
          data-feature-cy={py / H}
          data-feature-w={24 / W}
          data-feature-h={24 / H}
        />
        <text
          x={cx} y={H - 14}
          fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}
          data-feature={N.thetaLabel}
          data-feature-label={`θ = ${angleDegrees}°`}
          data-feature-cx={cx / W}
          data-feature-cy={(H - 18) / H}
          data-feature-w={160 / W}
          data-feature-h={20 / H}
        >
          θ = {angleDegrees}°{showRadians ? ` = ${(rad).toFixed(3)} rad` : ''}
        </text>
      </svg>
    </div>
  );
}

// ── Transformation ────────────────────────────────────────────────────────
export function CatalogTransformationRenderer({ figure }: { figure: TransformationFigure }) {
  const { shape, transform, title } = figure;
  const N = transformationFeatureNames;
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
  // Compute bboxes for pre-image and image (in svg-coord fractions) so
  // the scribble tick lands ON the shape, not at the diagram corner.
  const bboxFrac = (verts: Array<{ x: number; y: number }>) => {
    const xs = verts.map((v) => px(v.x));
    const ys = verts.map((v) => py(v.y));
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return {
      cx: ((minX + maxX) / 2) / W,
      cy: ((minY + maxY) / 2) / H,
      w: (maxX - minX + 12) / W,
      h: (maxY - minY + 12) / H,
    };
  };
  const preBox = bboxFrac(shape.vertices);
  const imgBox = bboxFrac(transformed);
  return (
    <div
      className="w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || `${transform.type} transformation`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e5e7eb" strokeWidth={1} />
        {/* Pre-image */}
        <path
          d={path(shape.vertices)}
          fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth={2}
          data-feature={N.preimage}
          data-feature-label="pre-image"
          data-feature-cx={preBox.cx}
          data-feature-cy={preBox.cy}
          data-feature-w={preBox.w}
          data-feature-h={preBox.h}
        />
        {/* Image */}
        <path
          d={path(transformed)}
          fill="rgba(220, 38, 38, 0.2)" stroke="#dc2626" strokeWidth={2}
          data-feature={N.image}
          data-feature-label="image"
          data-feature-cx={imgBox.cx}
          data-feature-cy={imgBox.cy}
          data-feature-w={imgBox.w}
          data-feature-h={imgBox.h}
        />
        <text x={W - 14} y={20} fontSize={12} textAnchor="end" fill="#3b82f6" fontWeight={700}>pre-image</text>
        <text x={W - 14} y={36} fontSize={12} textAnchor="end" fill="#dc2626" fontWeight={700}>image</text>
        <text
          x={cx} y={H - 14}
          fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}
          data-feature={N.transformLabel}
          data-feature-label={transform.type}
          data-feature-cx={cx / W}
          data-feature-cy={(H - 18) / H}
          data-feature-w={240 / W}
          data-feature-h={20 / H}
        >
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
  const N = inequalityGraphFeatureNames;
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
  const rayEndX = direction > 0 ? W - PAD + 12 : PAD - 12;
  return (
    <div
      className="w-full flex flex-col items-center"
      data-feature={N.numberLine}
      data-feature-label={title || 'number line'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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
          x1={valueX} y1={cy} x2={rayEndX} y2={cy}
          stroke="#dc2626" strokeWidth={4}
          data-feature={N.ray}
          data-feature-label="solution ray"
          data-feature-cx={((valueX + rayEndX) / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={Math.abs(rayEndX - valueX) / W}
          data-feature-h={20 / H}
        />
        {/* Endpoint */}
        <circle
          cx={valueX} cy={cy} r={7}
          fill={includeEq ? '#dc2626' : '#fff'} stroke="#dc2626" strokeWidth={2.5}
          data-feature={N.endpoint}
          data-feature-label={`endpoint at ${value}`}
          data-feature-cx={valueX / W}
          data-feature-cy={cy / H}
          data-feature-w={24 / W}
          data-feature-h={24 / H}
        />
        <text
          x={W / 2} y={H - 14}
          fontSize={14} textAnchor="middle" fill="#374151" fontWeight={600}
          data-feature={N.inequalityLabel}
          data-feature-label={`${variable} ${operator} ${value}`}
          data-feature-cx={(W / 2) / W}
          data-feature-cy={(H - 18) / H}
          data-feature-w={160 / W}
          data-feature-h={20 / H}
        >
          {variable} {operator} {value}
        </text>
      </svg>
    </div>
  );
}

// ── Sentence diagram ──────────────────────────────────────────────────────
export function CatalogSentenceDiagramRenderer({ figure }: { figure: SentenceDiagramFigure }) {
  const { subject, verb, object, modifiers, title } = figure;
  const N = sentenceDiagramFeatureNames;
  const W = 720;
  const H = modifiers && modifiers.length > 0 ? 240 : 160;
  const baseY = 80;
  const subjEnd = 240;
  const verbEnd = object ? 480 : 600;
  // Per-cell bbox (subject, verb, object) is the slot between separators,
  // ~30px tall straddling the baseline. Modifier bbox is the diagonal
  // tail end ~22px tall × 60px wide.
  const cellH = 36;
  const subjCx = ((40 + subjEnd) / 2) / W;
  const verbCx = ((subjEnd + verbEnd) / 2) / W;
  const objCx = ((verbEnd + (W - 40)) / 2) / W;
  const subjW = (subjEnd - 40) / W;
  const verbW = (verbEnd - subjEnd) / W;
  const objW = ((W - 40) - verbEnd) / W;
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.diagram}
        data-feature-label={title || 'sentence diagram'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* Base line */}
        <line x1={40} y1={baseY} x2={W - 40} y2={baseY} stroke="#1f2937" strokeWidth={2} />
        {/* Subject | Verb separator */}
        <line x1={subjEnd} y1={baseY - 30} x2={subjEnd} y2={baseY + 30} stroke="#1f2937" strokeWidth={2} />
        {/* Verb | Object separator */}
        {object && <line x1={verbEnd} y1={baseY - 20} x2={verbEnd} y2={baseY} stroke="#1f2937" strokeWidth={2} />}
        <g
          data-feature={N.subject}
          data-feature-label={subject}
          data-feature-cx={subjCx}
          data-feature-cy={(baseY - cellH / 2 + 10) / H}
          data-feature-w={subjW}
          data-feature-h={cellH / H}
        >
          <text x={(40 + subjEnd) / 2} y={baseY - 10} fontSize={16} textAnchor="middle" fill="#1f2937" fontWeight={600}>{subject}</text>
        </g>
        <g
          data-feature={N.verb}
          data-feature-label={verb}
          data-feature-cx={verbCx}
          data-feature-cy={(baseY - cellH / 2 + 10) / H}
          data-feature-w={verbW}
          data-feature-h={cellH / H}
        >
          <text x={(subjEnd + verbEnd) / 2} y={baseY - 10} fontSize={16} textAnchor="middle" fill="#1f2937" fontWeight={600}>{verb}</text>
        </g>
        {object && (
          <g
            data-feature={N.object}
            data-feature-label={object}
            data-feature-cx={objCx}
            data-feature-cy={(baseY - cellH / 2 + 10) / H}
            data-feature-w={objW}
            data-feature-h={cellH / H}
          >
            <text x={(verbEnd + (W - 40)) / 2} y={baseY - 10} fontSize={16} textAnchor="middle" fill="#1f2937" fontWeight={600}>{object}</text>
          </g>
        )}
        {/* Modifiers as diagonal hangs */}
        {modifiers?.map((m, i) => {
          let baseX: number;
          if (m.attachTo === 'subject') baseX = (40 + subjEnd) / 2;
          else if (m.attachTo === 'verb') baseX = (subjEnd + verbEnd) / 2;
          else baseX = (verbEnd + (W - 40)) / 2;
          const dx = i % 2 === 0 ? -30 : 30;
          const tailX = baseX + dx;
          const tailY = baseY + 76;
          return (
            <g
              key={i}
              data-feature={N.modifier(i)}
              data-feature-label={m.word}
              data-feature-cx={tailX / W}
              data-feature-cy={tailY / H}
              data-feature-w={80 / W}
              data-feature-h={24 / H}
            >
              <line x1={baseX} y1={baseY} x2={tailX} y2={baseY + 60} stroke="#6b7280" strokeWidth={1.5} />
              <text x={tailX} y={tailY} fontSize={13} textAnchor="middle" fill="#6b7280" fontStyle="italic">{m.word}</text>
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
      {title && <div className="text-base font-semibold text-gray-800"><InlineMathText text={title} /></div>}
      <div data-feature={N.claim} data-feature-label="Claim" className="px-5 py-3 rounded-lg bg-blue-50 border-2 border-blue-400 max-w-[600px] w-full">
        <div className="text-xs font-bold uppercase text-blue-700 mb-1">Claim</div>
        <div className="text-base text-blue-900">{claim}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[640px] w-full">
        <div data-feature={N.evidence} data-feature-label="Evidence" className="p-3 rounded-lg bg-green-50 border border-green-300">
          <div className="text-xs font-bold uppercase text-green-700 mb-1">Evidence</div>
          <ul className="text-sm text-green-900 list-disc list-inside space-y-1">
            {evidence.map((e, i) => <li key={i} data-feature={N.evidenceItem(i)} data-feature-label={e}>{e}</li>)}
          </ul>
        </div>
        <div data-feature={N.reasoning} data-feature-label="Reasoning" className="p-3 rounded-lg bg-amber-50 border border-amber-300">
          <div className="text-xs font-bold uppercase text-amber-700 mb-1">Reasoning</div>
          <ul className="text-sm text-amber-900 list-disc list-inside space-y-1">
            {reasoning.map((r, i) => <li key={i} data-feature={N.reasoningItem(i)} data-feature-label={r}>{r}</li>)}
          </ul>
        </div>
      </div>
      {counter && (
        <div data-feature={N.counter} data-feature-label="Counterargument" className="p-3 rounded-lg bg-rose-50 border border-rose-300 max-w-[600px] w-full">
          <div className="text-xs font-bold uppercase text-rose-700 mb-1">Counterargument</div>
          <div className="text-sm text-rose-900">{counter}</div>
          {rebuttal && (
            <div data-feature={N.rebuttal} data-feature-label="Rebuttal" className="mt-2">
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
/** Wrap a label into ≤2 short lines for the timeline event card. Tries
 *  to break on the last space within `maxCharsPerLine`; if a single
 *  word exceeds that cap, lets it overflow rather than splitting mid-
 *  word. Returns 1 or 2 strings — never 3+. Anything past 2 lines is
 *  truncated with an ellipsis on the second line. */
function wrapTimelineLabel(label: string, maxCharsPerLine = 18): [string, string?] {
  const trimmed = label.trim();
  if (trimmed.length <= maxCharsPerLine) return [trimmed];
  const words = trimmed.split(/\s+/);
  let line1 = '';
  let i = 0;
  for (; i < words.length; i++) {
    const next = line1 ? `${line1} ${words[i]}` : words[i];
    if (next.length > maxCharsPerLine && line1) break;
    line1 = next;
  }
  const rest = words.slice(i).join(' ');
  if (!rest) return [line1];
  const line2 = rest.length > maxCharsPerLine ? rest.slice(0, maxCharsPerLine - 1) + '…' : rest;
  return [line1, line2];
}

export function CatalogHistoricalTimelineRenderer({ figure }: { figure: HistoricalTimelineFigure }) {
  const { events, title } = figure;
  const N = historicalTimelineFeatureNames;
  const W = 760;
  const H = 320;
  const PAD = 40;
  const BOX_W = 156;
  const BOX_H = 52; // taller to fit 2 lines of label
  const years = events.map((e) => e.year);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  const span = maxY - minY || 1;
  const usableW = W - PAD * 2;
  // Even spacing in author order when years aren't reliable (or degenerate),
  // else proportional by year. Prevents the squish/overlap from a stray year-0.
  const evenSpace = figure.evenSpace || maxY <= minY || events.length === 1;
  const xOf = (e: { year: number }, i: number) =>
    evenSpace
      ? PAD + (events.length === 1 ? usableW / 2 : (i / (events.length - 1)) * usableW)
      : PAD + ((e.year - minY) / span) * usableW;
  const baseY = 200;
  const altOffsets = [-100, 70, -70, 100, -80, 80];
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[820px]"
        data-feature={N.timeline}
        data-feature-label={title || 'timeline'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <g
          data-feature={N.axis}
          data-feature-label="timeline axis"
          data-feature-cx={0.5}
          data-feature-cy={baseY / H}
          data-feature-w={(W - PAD * 2) / W}
          data-feature-h={0.05}
        >
          <line x1={PAD} y1={baseY} x2={W - PAD} y2={baseY} stroke="#1f2937" strokeWidth={2} />
        </g>
        {events.map((e, i) => {
          const x = xOf(e, i);
          const dy = altOffsets[i % altOffsets.length];
          // Clamp labelY so the BOX (52px tall, centered on labelY)
          // stays inside the SVG viewBox. Without this the bottom-alt
          // events at dy=+100 (labelY=300) push the box to y=326,
          // clipped by the H=320 viewBox (observed 2026-05-13 session
          // #16: Mars Rover event box bottom cut off).
          const labelYRaw = baseY + dy;
          const labelY = Math.max(BOX_H / 2 + 4, Math.min(H - BOX_H / 2 - 4, labelYRaw));
          const color = e.color || '#3b82f6';
          const boxXNatural = x - BOX_W / 2;
          const boxX = Math.max(4, Math.min(W - BOX_W - 4, boxXNatural));
          const boxCenterX = boxX + BOX_W / 2;
          const [labelLine1, labelLine2] = wrapTimelineLabel(e.label);
          return (
            <g
              key={i}
              data-feature={N.event(i)}
              data-feature-label={`${e.date} ${e.label}`}
              data-feature-cx={(boxX + BOX_W / 2) / W}
              data-feature-cy={labelY / H}
              data-feature-w={BOX_W / W}
              data-feature-h={BOX_H / H}
            >
              <line x1={x} y1={baseY} x2={boxCenterX} y2={labelY} stroke={color} strokeWidth={1.5} strokeDasharray="3 2" />
              <circle cx={x} cy={baseY} r={6} fill={color} stroke="#fff" strokeWidth={2} />
              <rect x={boxX} y={labelY - BOX_H / 2} width={BOX_W} height={BOX_H} rx={4} fill={color + '22'} stroke={color} strokeWidth={1.5} />
              <text x={boxCenterX} y={labelY - BOX_H / 2 + 14} fontSize={11} textAnchor="middle" fill="#1f2937" fontWeight={700}>{e.date}</text>
              <text x={boxCenterX} y={labelY - BOX_H / 2 + 30} fontSize={11} textAnchor="middle" fill="#374151">{labelLine1}</text>
              {labelLine2 && (
                <text x={boxCenterX} y={labelY - BOX_H / 2 + 44} fontSize={11} textAnchor="middle" fill="#374151">{labelLine2}</text>
              )}
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <div data-feature={N.country} data-feature-label={country} className="text-sm text-gray-600 mb-3">{country}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[760px] w-full">
        {branches.map((b, i) => {
          const color = PALETTE[i % PALETTE.length];
          return (
            <div key={i} data-feature={N.branch(i)} data-feature-label={b.name} className="p-3 rounded-lg border-2" style={{ background: color + '11', borderColor: color }}>
              <div className="font-bold mb-1" style={{ color }}>{b.name}</div>
              {b.bodies && b.bodies.length > 0 && (
                <div data-feature={N.branchBodies(i)} data-feature-label={`${b.name} bodies`} className="text-xs text-gray-700 mb-1">
                  <span className="font-semibold">Bodies: </span>
                  {b.bodies.join(', ')}
                </div>
              )}
              {b.powers && b.powers.length > 0 && (
                <ul data-feature={N.branchPowers(i)} data-feature-label={`${b.name} powers`} className="text-sm list-disc list-inside text-gray-800">
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
  // W1 fix: an unconstrained wide table inside `items-center` used to
  // flex-center and get double-edge-clipped by the board's
  // `overflow-x-hidden` ancestor, with no way to reach the rest (live
  // session screenshot IMG_7807). Measure the table against the new
  // `w-full` wrapper below and scale it down to fit; if even floor 0.6 is
  // still too wide, the wrapper's `overflow-x-auto` keeps it reachable via
  // scroll instead of silently clipped.
  const { containerRef, contentRef, overflowing } = useFitScale<HTMLDivElement, HTMLTableElement>(
    { floor: 0.6 },
    [figure],
  );
  // data-feature values come from the SHARED naming helper that
  // buildComparisonTableManifest also calls — manifest names and DOM
  // attrs cannot drift by construction. Attribute name is `data-feature`
  // (matches the project-wide convention; WhiteboardCanvas overlay
  // queries `[data-feature="..."]` at line ~1083). See
  // src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social.ts.
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <div
        ref={containerRef}
        className="w-full max-w-full overflow-x-auto"
        data-fit-scale={overflowing ? 'floor' : undefined}
      >
        <table ref={contentRef} data-feature={N.table} className="border-collapse text-sm mx-auto">
          <thead>
            <tr data-feature={N.headerRow}>
              <th className="px-3 py-2 border border-gray-400 bg-gray-100"></th>
              {items.map((it, i) => (
                <th
                  key={i}
                  data-feature={N.col(i)}
                  data-feature-label={it}
                  className="px-3 py-2 border border-gray-400 bg-blue-50 font-semibold text-blue-900"
                >
                  <CellContent value={it} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr, ri) => (
              <tr key={ri} data-feature={N.row(ri)} data-feature-label={attr}>
                <th className="px-3 py-2 border border-gray-400 bg-amber-50 font-semibold text-amber-900 text-left"><CellContent value={attr} /></th>
                {cells[ri].map((c, ci) => (
                  <td
                    key={ci}
                    data-feature={N.cell(ri, ci)}
                    data-feature-label={`${items[ci]} / ${attr}`}
                    className="px-3 py-2 border border-gray-300"
                  >
                    <CellContent value={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  // W1 fix: this grid is already `w-full` (forced to fill its flex
  // parent), so a normal-length item never overflows — but an UNBREAKABLE
  // long token (a URL, a chemical formula with no spaces) can still force
  // a grid track wider than its `1fr` share via CSS's min-content
  // constraint, blowing the whole grid out past its own `w-full` box
  // (classic grid/flex "1fr overflow" bug). `overflow-wrap: anywhere` on
  // the item/header cells below is the PRIMARY defense (lets the token
  // break instead of demanding oversized min-content); useFitScale is the
  // fallback for whatever blowout still gets through.
  const { containerRef, contentRef, overflowing } = useFitScale<HTMLDivElement, HTMLDivElement>(
    { floor: 0.6 },
    [figure],
  );
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
      <div ref={containerRef} className="w-full max-w-[640px] overflow-x-auto" data-fit-scale={overflowing ? 'floor' : undefined}>
        {/* CSS subgrid: both columns span the SAME parent row tracks, so paired
            rows size to the taller cell and ALIGN across columns — fixes the
            drift when one side's item wraps to more lines (2026-06-23 ear-test).
            The leftColumn/rightColumn elements are kept (scribble targets). */}
        <div
          ref={contentRef}
          data-feature={N.chart}
          className="grid grid-cols-2 max-w-[640px] w-full border-2 border-gray-700"
          style={{ gridTemplateRows: `repeat(${rows + 1}, auto)` }}
        >
          <div
            data-feature={N.leftColumn}
            data-feature-label={figure.leftHeader || 'Left column'}
            className="border-r-2 border-gray-700"
            style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: '1 / -1' }}
          >
            <div data-feature={N.leftHeader} data-feature-label={figure.leftHeader} className="px-3 py-2 border-b border-gray-400 bg-blue-50 font-bold text-blue-900 text-center" style={{ overflowWrap: 'anywhere' }}>{figure.leftHeader}</div>
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                data-feature={N.leftItem(i)}
                data-feature-label={figure.leftItems?.[i] || ''}
                className={`px-3 py-2 ${i < rows - 1 ? 'border-b border-gray-400' : ''}`}
                style={{ overflowWrap: 'anywhere' }}
              >
                {figure.leftItems?.[i] || ''}
              </div>
            ))}
          </div>
          <div
            data-feature={N.rightColumn}
            data-feature-label={figure.rightHeader || 'Right column'}
            style={{ display: 'grid', gridTemplateRows: 'subgrid', gridRow: '1 / -1' }}
          >
            <div data-feature={N.rightHeader} data-feature-label={figure.rightHeader} className="px-3 py-2 border-b border-gray-400 bg-amber-50 font-bold text-amber-900 text-center" style={{ overflowWrap: 'anywhere' }}>{figure.rightHeader}</div>
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                data-feature={N.rightItem(i)}
                data-feature-label={figure.rightItems?.[i] || ''}
                className={`px-3 py-2 ${i < rows - 1 ? 'border-b border-gray-400' : ''}`}
                style={{ overflowWrap: 'anywhere' }}
              >
                {figure.rightItems?.[i] || ''}
              </div>
            ))}
          </div>
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
    { h: 'K — Know', label: 'Know', items: figure.know, bg: 'bg-blue-50', fg: 'text-blue-900', border: 'border-blue-400', col: N.kColumn, item: N.kItem },
    { h: 'W — Want to know', label: 'Want to know', items: figure.want, bg: 'bg-amber-50', fg: 'text-amber-900', border: 'border-amber-400', col: N.wColumn, item: N.wItem },
    { h: 'L — Learned', label: 'Learned', items: figure.learned, bg: 'bg-green-50', fg: 'text-green-900', border: 'border-green-400', col: N.lColumn, item: N.lItem },
  ];
  return (
    <div className="w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <div data-feature={N.chart} className="grid grid-cols-3 gap-2 max-w-[760px] w-full">
        {columns.map((col, i) => (
          <div key={i} data-feature={col.col} data-feature-label={col.label} className={`p-3 border-2 rounded ${col.bg} ${col.border}`}>
            <div className={`font-bold ${col.fg} mb-2`}>{col.h}</div>
            <ul className="list-disc list-inside text-sm space-y-1">
              {(col.items || []).map((it, j) => <li key={j} data-feature={col.item(j)} data-feature-label={it}>{it}</li>)}
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
        <div data-feature={N.definition} data-feature-label="Definition" className="p-3 border-r-2 border-b-2 border-gray-700 bg-blue-50">
          <div className="font-bold text-blue-900 text-xs uppercase mb-1">Definition</div>
          <div className="text-sm">{figure.definition || '—'}</div>
        </div>
        <div data-feature={N.characteristics} data-feature-label="Characteristics" className="p-3 border-b-2 border-gray-700 bg-green-50">
          <div className="font-bold text-green-900 text-xs uppercase mb-1">Characteristics</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.characteristics || []).map((c, i) => <li key={i} data-feature={N.characteristicItem(i)} data-feature-label={c}>{c}</li>)}
          </ul>
        </div>
        <div data-feature={N.examples} data-feature-label="Examples" className="p-3 border-r-2 border-gray-700 bg-amber-50">
          <div className="font-bold text-amber-900 text-xs uppercase mb-1">Examples</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.examples || []).map((c, i) => <li key={i} data-feature={N.exampleItem(i)} data-feature-label={c}>{c}</li>)}
          </ul>
        </div>
        <div data-feature={N.nonExamples} data-feature-label="Non-examples" className="p-3 bg-rose-50">
          <div className="font-bold text-rose-900 text-xs uppercase mb-1">Non-Examples</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {(figure.nonExamples || []).map((c, i) => <li key={i} data-feature={N.nonExampleItem(i)} data-feature-label={c}>{c}</li>)}
          </ul>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Term pill is intentionally TRANSPARENT (no bg / border)
              so the rendered content beneath remains visible. The
              prior solid-white pill covered cell text in the bottom
              of the characteristics quadrant (observed 2026-05-13
              session #12 image #36 — "Provides services" was clipped
              by the "Government" pill). Bold text + light text-shadow
              gives enough separation against any quadrant color. */}
          <div
            data-feature={N.term}
            data-feature-label={figure.term}
            className="px-4 py-1 font-bold text-gray-900"
            style={{ textShadow: '0 0 4px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.8)' }}
          >
            {figure.term}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hierarchy pyramid ─────────────────────────────────────────────────────
export function CatalogHierarchyPyramidRenderer({ figure }: { figure: HierarchyPyramidFigure }) {
  const { tiers, baseFirst, title } = figure;
  // baseFirst semantics (per the HierarchyPyramidFigure docstring):
  //   true  — tiers[0] is the BASE of the pyramid (rendered at the
  //           bottom, widest). Standard for food pyramids, Maslow,
  //           Bloom's. This is the default.
  //   false — tiers[0] is the APEX (top, narrowest). Inverted use case.
  //
  // The renderer iterates `ordered` top-to-bottom (i=0 is topmost). To
  // get baseFirst=true behavior — tiers[0] at the bottom — we reverse
  // the tiers so iteration walks last → first. (Previously the
  // reverse/no-reverse was inverted relative to the docstring;
  // observed 2026-05-13 session #15 image #46: brain emitted
  // {tiers: [Producers, ..., Apex], baseFirst: true} expecting
  // Producers at the BOTTOM of a food pyramid — renderer put Producers
  // at the TOP instead.)
  const ordered = baseFirst ? [...tiers].reverse() : [...tiers];
  const N = hierarchyPyramidFeatureNames;
  const W = 480;
  const TIER_H = 56;
  const H = ordered.length * TIER_H + 60;
  const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899'];
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[520px]"
        data-feature={N.pyramid}
        data-feature-label={title || 'pyramid'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {ordered.map((t, i) => {
          // Pyramid silhouette: narrow at top, wide at bottom.
          // Width grows with `fromTop` so i=0 (top) is narrowest and
          // i=last (bottom) is widest. (Previously used tierFromBottom
          // which made TOP widest — an inverted pyramid.) Min width
          // 150 keeps multi-word tier labels readable on the narrowest
          // tier; step 50 keeps the pyramid silhouette visually
          // distinct without the bottom getting absurdly wide.
          const fromTop = i;
          const w = 150 + fromTop * 50;
          const x = (W - w) / 2;
          const y = 30 + fromTop * TIER_H;
          const color = t.color || PALETTE[i % PALETTE.length];
          const cxFrac = (x + w / 2) / W;
          const cyFrac = (y + (TIER_H - 4) / 2) / H;
          return (
            <g
              key={i}
              data-feature={N.tier(i)}
              data-feature-label={t.label}
              data-feature-cx={cxFrac}
              data-feature-cy={cyFrac}
              data-feature-w={w / W}
              data-feature-h={(TIER_H - 4) / H}
            >
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

// ── Complex plane (Argand diagram) ──────────────────────────────────────────
export function CatalogComplexPlaneRenderer({ figure }: { figure: ComplexPlaneFigure }) {
  const N = complexPlaneFeatureNames;
  const { points, range, title } = figure;
  const W = 440;
  const H = 440;
  const pad = 34;
  const cx = W / 2;
  const cy = H / 2;
  const span = W - 2 * pad;
  const scale = (span / 2) / range;
  const X = (re: number) => cx + re * scale;
  const Y = (im: number) => cy - im * scale;

  const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];
  const INK = '#374151';
  const AXIS = '#475569';
  const GRID = '#e2e8f0';

  // integer gridlines + ticks
  const ticks: number[] = [];
  for (let v = -range; v <= range; v++) if (v !== 0) ticks.push(v);

  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[440px]"
        data-feature={N.plane}
        data-feature-label={title || 'Complex plane'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* gridlines */}
        {ticks.map((v) => (
          <g key={`g${v}`}>
            <line x1={X(v)} y1={pad} x2={X(v)} y2={H - pad} stroke={GRID} strokeWidth={1} />
            <line x1={pad} y1={Y(v)} x2={W - pad} y2={Y(v)} stroke={GRID} strokeWidth={1} />
          </g>
        ))}
        {/* axes */}
        <g data-feature={N.realAxis} data-feature-label="Real axis">
          <line x1={pad} y1={cy} x2={W - pad} y2={cy} stroke={AXIS} strokeWidth={1.6} />
          <text x={W - pad + 2} y={cy + 14} fontSize={13} fontStyle="italic" fill={AXIS}>Re</text>
        </g>
        <g data-feature={N.imaginaryAxis} data-feature-label="Imaginary axis">
          <line x1={cx} y1={H - pad} x2={cx} y2={pad} stroke={AXIS} strokeWidth={1.6} />
          <text x={cx + 6} y={pad + 2} fontSize={13} fontStyle="italic" fill={AXIS}>Im</text>
        </g>
        {/* integer tick labels (real + imaginary), skipping origin */}
        {ticks.map((v) => (
          <g key={`t${v}`}>
            <text x={X(v)} y={cy + 15} fontSize={9.5} fill="#94a3b8" textAnchor="middle">{v}</text>
            <text x={cx - 8} y={Y(v) + 3} fontSize={9.5} fill="#94a3b8" textAnchor="end">{v}i</text>
          </g>
        ))}

        {points.map((p, i) => {
          const color = p.color || COLORS[i % COLORS.length];
          const px = X(p.re), py = Y(p.im);
          const zText = p.label || `${p.re}${p.im >= 0 ? ' + ' : ' − '}${Math.abs(p.im)}i`;
          const modulus = Math.hypot(p.re, p.im);
          const angleDeg = Math.atan2(p.im, p.re) * 180 / Math.PI;
          return (
            <g key={i} data-feature={N.point(i)} data-feature-label={zText}>
              {p.showVector && (
                <line x1={cx} y1={cy} x2={px} y2={py} stroke={color} strokeWidth={2} opacity={0.85} />
              )}
              {p.showAngle && (
                <path
                  d={`M ${cx + 22} ${cy} A 22 22 0 ${Math.abs(angleDeg) > 180 ? 1 : 0} ${angleDeg < 0 ? 1 : 0} ${cx + 22 * Math.cos(angleDeg * Math.PI / 180)} ${cy - 22 * Math.sin(angleDeg * Math.PI / 180)}`}
                  fill="none" stroke={color} strokeWidth={1.2} opacity={0.7}
                />
              )}
              <circle cx={px} cy={py} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />
              <text x={px + (p.re >= 0 ? 9 : -9)} y={py + (p.im >= 0 ? -8 : 16)} fontSize={12} fontWeight={700} fill={color} textAnchor={p.re >= 0 ? 'start' : 'end'}>{zText}</text>
              {p.showModulus && (
                <text x={(cx + px) / 2 + 6} y={(cy + py) / 2 - 4} fontSize={10.5} fontStyle="italic" fill={color}>|z|={modulus.toFixed(2)}</text>
              )}
              {p.showAngle && (
                <text x={cx + 26} y={cy - 6} fontSize={10} fill={color}>{angleDeg.toFixed(0)}°</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Plot diagram (Freytag's pyramid) ────────────────────────────────────────
export function CatalogPlotDiagramRenderer({ figure }: { figure: PlotDiagramFigure }) {
  const N = plotDiagramFeatureNames;
  const { notes, title } = figure;
  const W = 720;
  const H = 440;
  const INK = '#374151';
  const LINE = '#2563eb';
  const DOT = '#1d4ed8';

  // Arc vertices across the pyramid: exposition (low left) → rising →
  // climax (peak) → falling → resolution (low right).
  const baseY = 320;
  const peakY = 70;
  const midY = 200;
  const pts: Record<string, [number, number]> = {
    exposition: [70, baseY],
    rising_action: [250, midY],
    climax: [360, peakY],
    falling_action: [470, midY],
    resolution: [650, baseY],
  };
  const order = PLOT_STAGES;
  const path = order.map((s, i) => `${i === 0 ? 'M' : 'L'} ${pts[s][0]} ${pts[s][1]}`).join(' ');

  const LABELS: Record<string, string> = {
    exposition: 'Exposition',
    rising_action: 'Rising action',
    climax: 'Climax',
    falling_action: 'Falling action',
    resolution: 'Resolution',
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{title || "Plot diagram (Freytag's pyramid)"}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[720px]"
        data-feature={N.figure}
        data-feature-label={title || 'Plot diagram'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* baseline */}
        <line x1={40} y1={baseY} x2={W - 40} y2={baseY} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />
        {/* the dramatic arc */}
        <path d={path} fill="none" stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />

        {order.map((s) => {
          const [x, y] = pts[s];
          const note = notes[s];
          // Place each stage's label clear of the arc line:
          //  - exposition / resolution: below the low endpoints
          //  - climax: above the peak
          //  - rising / falling: out to the side (left / right) of the slope
          let lx = x, labelY: number, anchor: 'start' | 'middle' | 'end', noteDy: number;
          if (s === 'climax') { labelY = y - 16; anchor = 'middle'; noteDy = -15; }
          else if (s === 'exposition') { labelY = y + 30; anchor = 'start'; noteDy = 15; }
          else if (s === 'resolution') { labelY = y + 30; anchor = 'end'; noteDy = 15; }
          else if (s === 'rising_action') { lx = x - 14; labelY = y + 2; anchor = 'end'; noteDy = -15; }
          else { lx = x + 14; labelY = y + 2; anchor = 'start'; noteDy = -15; } // falling_action
          return (
            <g key={s} data-feature={N.stage(s)} data-feature-label={LABELS[s]}>
              <circle cx={x} cy={y} r={5} fill={DOT} stroke="#fff" strokeWidth={1.5} />
              <text x={lx} y={labelY} fontSize={13} fontWeight={700} fill={INK} textAnchor={anchor}>{LABELS[s]}</text>
              {note && (
                <text x={lx} y={labelY + noteDy} fontSize={10.5} fill="#64748b" textAnchor={anchor}>
                  {note.length > 42 ? note.slice(0, 39) + '…' : note}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Rhetorical triangle (ethos / pathos / logos) ────────────────────────────
export function CatalogRhetoricalTriangleRenderer({ figure }: { figure: RhetoricalTriangleFigure }) {
  const N = rhetoricalTriangleFeatureNames;
  const heading = figure.title || 'The Rhetorical Triangle';
  const W = 580;
  const H = 470;

  const COLORS: Record<RhetoricalAppeal, string> = {
    ethos: '#2563eb',
    pathos: '#dc2626',
    logos: '#16a34a',
  };

  const apex = { x: 290, y: 78 };
  const bl = { x: 92, y: 384 };
  const br = { x: 488, y: 384 };
  const centroid = { x: (apex.x + bl.x + br.x) / 3, y: (apex.y + bl.y + br.y) / 3 };
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  const vertexOf: Record<RhetoricalAppeal, { x: number; y: number }> = { ethos: apex, logos: bl, pathos: br };

  const corners: Array<{ appeal: RhetoricalAppeal; v: { x: number; y: number }; dir: 'above' | 'below' }> = [
    { appeal: 'ethos', v: apex, dir: 'above' },
    { appeal: 'logos', v: bl, dir: 'below' },
    { appeal: 'pathos', v: br, dir: 'below' },
  ];

  const trianglePts = `${apex.x},${apex.y} ${bl.x},${bl.y} ${br.x},${br.y}`;

  // Highlight wedge = the highlighted vertex's third of the triangle.
  let wedge: string | null = null;
  if (figure.highlight) {
    const V = vertexOf[figure.highlight];
    const others = [apex, bl, br].filter((p) => p !== V);
    const m0 = mid(V, others[0]);
    const m1 = mid(V, others[1]);
    wedge = `${V.x},${V.y} ${m0.x},${m0.y} ${centroid.x},${centroid.y} ${m1.x},${m1.y}`;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: W }}
        data-feature={N.triangle}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {wedge && <polygon points={wedge} fill={COLORS[figure.highlight!]} fillOpacity={0.14} />}
        <polygon points={trianglePts} fill="#f8fafc" fillOpacity={wedge ? 0 : 1} stroke="#334155" strokeWidth={2.5} strokeLinejoin="round" />
        {/* medians to the centroid */}
        {[apex, bl, br].map((v, i) => (
          <line key={`med${i}`} x1={v.x} y1={v.y} x2={centroid.x} y2={centroid.y} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />
        ))}

        {/* subject at the centre */}
        <g data-feature={N.subject} data-feature-label={`Subject: ${figure.subject}`}>
          <text x={centroid.x} y={centroid.y - 7} textAnchor="middle" fontSize={11} fontWeight={700} fill="#94a3b8" letterSpacing={1}>SUBJECT</text>
          <text x={centroid.x} y={centroid.y + 13} textAnchor="middle" fontSize={15} fontWeight={700} fill="#334155">
            {figure.subject.length > 22 ? figure.subject.slice(0, 21) + '…' : figure.subject}
          </text>
        </g>

        {/* corners */}
        {corners.map(({ appeal, v, dir }) => {
          const c = figure[appeal];
          const color = COLORS[appeal];
          const active = figure.highlight === appeal;
          const baseY = dir === 'above' ? v.y - 58 : v.y + 22;
          const nameY = baseY;
          const roleY = baseY + 20;
          const noteY = baseY + 37;
          const clampNote = c.note.length > 30 ? c.note.slice(0, 29) + '…' : c.note;
          return (
            <g key={appeal} data-feature={N.corner(appeal)} data-feature-label={`${c.label}: ${c.role}`}>
              <circle cx={v.x} cy={v.y} r={active ? 8.5 : 6.5} fill={color} stroke="#fff" strokeWidth={2} />
              <text x={v.x} y={nameY} textAnchor="middle" fontSize={20} fontWeight={800} fill={color}>{c.label}</text>
              <text x={v.x} y={roleY} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#475569">{c.role}</text>
              <text x={v.x} y={noteY} textAnchor="middle" fontSize={11.5} fill="#64748b">{clampNote}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Character web (central character + relationship / trait spokes) ─────────
export function CatalogCharacterWebRenderer({ figure }: { figure: CharacterWebFigure }) {
  const N = characterWebFeatureNames;
  const heading = figure.title || `Character Web — ${figure.center}`;
  const W = 620;
  const H = 520;
  const cx = W / 2;
  const cy = H / 2 + 6;
  const ringR = 190;

  const CHAR_FILL = '#dbeafe';
  const CHAR_STROKE = '#2563eb';
  const TRAIT_FILL = '#dcfce7';
  const TRAIT_STROKE = '#16a34a';

  const nodes = figure.nodes;
  // Place nodes evenly around the ring, starting from the top.
  const placed = nodes.map((node, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length;
    return { node, x: cx + ringR * Math.cos(ang), y: cy + ringR * Math.sin(ang) };
  });

  const nodeRX = 58;
  const nodeRY = 24;
  const centerRX = 66;
  const centerRY = 30;

  // Trim an ellipse-to-ellipse connector so it meets the rims, not the centres.
  const edgeEnd = (fromX: number, fromY: number, toX: number, toY: number, rx: number, ry: number) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const t = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry));
    return { x: toX - dx * t, y: toY - dy * t };
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{heading}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: W }}
        data-feature={N.web}
        data-feature-label={heading}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* spokes + relation labels (drawn first, under the nodes) */}
        {placed.map(({ node, x, y }, i) => {
          const a = edgeEnd(x, y, cx, cy, centerRX, centerRY); // point on centre rim
          const b = edgeEnd(cx, cy, x, y, nodeRX, nodeRY);      // point on node rim
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g key={`edge${i}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#cbd5e1" strokeWidth={1.5} />
              {node.relation && (
                <>
                  <rect x={mx - node.relation.length * 3.6 - 5} y={my - 10} width={node.relation.length * 7.2 + 10} height={18} rx={4} fill="#fff" />
                  <text x={mx} y={my + 3} textAnchor="middle" fontSize={11} fontStyle="italic" fill="#64748b">{node.relation}</text>
                </>
              )}
            </g>
          );
        })}

        {/* centre */}
        <g data-feature={N.center} data-feature-label={figure.center}>
          <ellipse cx={cx} cy={cy} rx={centerRX} ry={centerRY} fill="#1e3a8a" stroke="#1e3a8a" />
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">
            {figure.center.length > 16 ? figure.center.slice(0, 15) + '…' : figure.center}
          </text>
        </g>

        {/* nodes */}
        {placed.map(({ node, x, y }, i) => {
          const isTrait = node.kind === 'trait';
          return (
            <g key={`node${i}`} data-feature={N.node(i)} data-feature-label={`${node.label}${node.relation ? ` (${node.relation})` : ''}`}>
              <ellipse cx={x} cy={y} rx={nodeRX} ry={nodeRY} fill={isTrait ? TRAIT_FILL : CHAR_FILL} stroke={isTrait ? TRAIT_STROKE : CHAR_STROKE} strokeWidth={2} {...(isTrait ? { strokeDasharray: '5 3' } : {})} />
              <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={isTrait ? '#166534' : '#1e40af'}>
                {node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label}
              </text>
            </g>
          );
        })}

        {/* legend */}
        <g transform={`translate(${W / 2 - 150}, ${H - 20})`}>
          <ellipse cx={8} cy={0} rx={9} ry={6} fill={CHAR_FILL} stroke={CHAR_STROKE} strokeWidth={1.5} />
          <text x={22} y={4} fontSize={11.5} fill="#475569">character / relationship</text>
          <ellipse cx={188} cy={0} rx={9} ry={6} fill={TRAIT_FILL} stroke={TRAIT_STROKE} strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={202} y={4} fontSize={11.5} fill="#475569">trait</text>
        </g>
      </svg>
    </div>
  );
}
