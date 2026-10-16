'use client';

/**
 * GraphicOrganizerRenderer — common ELA / writing organizers.
 *
 * Five shapes under one tool (one `kind` per layout):
 *   - story_map      character / setting / problem / solution boxes
 *   - kwl            three columns: Know / Want to know / Learned
 *   - t_chart        two columns with a header per side
 *   - sequence       horizontal arrow chain of steps
 *   - cause_effect   left "cause" boxes → arrows → right "effects"
 *
 * Brain emits the data; the renderer handles layout.
 */

import React from 'react';
import {
  normalizeGraphicOrganizerSpec,
  type NormalizedGraphicOrganizerSpec,
} from '@/lib/tutor/validation/graphic-organizer-guard';

const SVG_W = 520;
const SVG_H = 320;

/** The drawable shape. What the brain sends is NOT trusted to match it — the
 *  tool schema only requires `kind` — so the component normalizes its input
 *  (validation/graphic-organizer-guard.ts) before any layout code runs. */
export type GraphicOrganizerSpec = NormalizedGraphicOrganizerSpec;

/**
 * Never throws on a malformed spec (2026-10-05: `spec.<list>.map` on a
 * missing list took the whole session page down). Missing lists are empty,
 * non-text items are coerced or skipped, and a spec with nothing to show
 * renders nothing rather than an empty frame.
 */
export default function GraphicOrganizerRenderer({ spec: rawSpec }: { spec: unknown }) {
  const decision = normalizeGraphicOrganizerSpec(rawSpec);
  if (!decision.ok) return null;
  const spec = decision.spec;
  if (spec.kind === 'sequence') return <SequenceOrganizer spec={spec} />;
  return (
    <div className="graphic-organizer-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">{spec.title}</div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto" style={{ maxWidth: SVG_W }}>
        <rect width={SVG_W} height={SVG_H} fill="#fafbfc" rx={4} />
        {spec.kind === 'story_map' && renderStoryMap(spec)}
        {spec.kind === 'kwl' && renderKWL(spec)}
        {spec.kind === 't_chart' && renderTChart(spec)}
        {spec.kind === 'cause_effect' && renderCauseEffect(spec)}
      </svg>
    </div>
  );
}

/** Belt and braces for the layout functions below: they only ever receive a
 *  normalized spec, but a list is still read through this so no future caller
 *  can reintroduce `.map` on undefined. */
function list(items: unknown): string[] {
  return Array.isArray(items) ? items.filter((x): x is string => typeof x === 'string') : [];
}

function renderStoryMap(spec: Extract<GraphicOrganizerSpec, { kind: 'story_map' }>) {
  const boxes = [
    { label: 'Character', text: spec.character, color: '#3b82f6', x: 30, y: 40 },
    { label: 'Setting', text: spec.setting, color: '#10b981', x: 270, y: 40 },
    { label: 'Problem', text: spec.problem, color: '#f59e0b', x: 30, y: 170 },
    { label: 'Solution', text: spec.solution, color: '#7c3aed', x: 270, y: 170 },
  ];
  return (
    <g>
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={220} height={120} fill="#fff" stroke={b.color} strokeWidth={3} rx={8} />
          <text x={b.x + 110} y={b.y + 22} fontSize={14} textAnchor="middle" fontWeight={700} fill={b.color}>{b.label}</text>
          {b.text && <foreignObject x={b.x + 8} y={b.y + 30} width={204} height={86}>
            <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.3 }}>{b.text}</div>
          </foreignObject>}
        </g>
      ))}
    </g>
  );
}

function renderKWL(spec: Extract<GraphicOrganizerSpec, { kind: 'kwl' }>) {
  const cols = [
    { label: 'K — what I Know', items: spec.know, color: '#3b82f6', x: 16 },
    { label: 'W — what I Want to know', items: spec.want, color: '#7c3aed', x: 184 },
    { label: 'L — what I Learned', items: spec.learned, color: '#10b981', x: 352 },
  ];
  const colW = 152;
  // Items (and headers) render as wrapping HTML in foreignObject, matching
  // the sibling variants (story_map/sequence/cause_effect) — bare <text> in
  // a 152u column clipped anything longer than ~20 chars.
  return (
    <g>
      {cols.map((c) => (
        <g key={c.label}>
          <rect x={c.x} y={30} width={colW} height={SVG_H - 50} fill="#fff" stroke={c.color} strokeWidth={3} rx={6} />
          <foreignObject x={c.x} y={4} width={colW} height={26}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.color, textAlign: 'center', lineHeight: 1.1 }}>{c.label}</div>
          </foreignObject>
          <foreignObject x={c.x + 8} y={40} width={colW - 16} height={SVG_H - 66}>
            <div style={{ fontSize: 12, color: '#0f172a', lineHeight: 1.35 }}>
              {list(c.items).map((item, i) => (
                <div key={i} style={{ marginBottom: 4 }}>• {item}</div>
              ))}
            </div>
          </foreignObject>
        </g>
      ))}
    </g>
  );
}

function renderTChart(spec: Extract<GraphicOrganizerSpec, { kind: 't_chart' }>) {
  const colW = (SVG_W - 30) / 2;
  // Headers and items render as wrapping HTML in foreignObject, matching the
  // sibling variants (story_map/sequence/cause_effect) — bare <text> clipped
  // long brain-authored headers/items at the column/viewBox edge.
  return (
    <g>
      <line x1={SVG_W / 2} y1={30} x2={SVG_W / 2} y2={SVG_H - 20} stroke="#0f172a" strokeWidth={3} />
      <line x1={20} y1={56} x2={SVG_W - 20} y2={56} stroke="#0f172a" strokeWidth={3} />
      <foreignObject x={24} y={30} width={colW - 12} height={24}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', textAlign: 'center', lineHeight: 1.1 }}>{spec.leftHeader}</div>
      </foreignObject>
      <foreignObject x={SVG_W / 2 + 8} y={30} width={colW - 12} height={24}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', textAlign: 'center', lineHeight: 1.1 }}>{spec.rightHeader}</div>
      </foreignObject>
      <foreignObject x={28} y={68} width={SVG_W / 2 - 40} height={SVG_H - 90}>
        <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.4 }}>
          {list(spec.leftItems).map((it, i) => (
            <div key={i} style={{ marginBottom: 4 }}>• {it}</div>
          ))}
        </div>
      </foreignObject>
      <foreignObject x={SVG_W / 2 + 8} y={68} width={SVG_W / 2 - 40} height={SVG_H - 90}>
        <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.4 }}>
          {list(spec.rightItems).map((it, i) => (
            <div key={i} style={{ marginBottom: 4 }}>• {it}</div>
          ))}
        </div>
      </foreignObject>
    </g>
  );
}

/** Sequence as wrapping HTML boxes, not a fixed SVG row: six steps in a
 *  520-unit row left ~60px per box, so step text was cut off mid-word and the
 *  fixed 320-unit canvas left a blank band above the row (GDI meeting session
 *  2026-10-15). Boxes now wrap onto new rows and grow to fit their text. */
const SEQ_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#06b6d4'];
function SequenceOrganizer({ spec }: { spec: Extract<GraphicOrganizerSpec, { kind: 'sequence' }> }) {
  const steps = list(spec.steps);
  return (
    <div className="graphic-organizer-renderer">
      {spec.title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">{spec.title}</div>
      )}
      <ol className="flex flex-wrap items-stretch gap-y-3 rounded bg-[#fafbfc] p-3" style={{ listStyle: 'none', margin: 0 }}>
        {steps.map((s, i) => {
          const color = SEQ_PALETTE[i % SEQ_PALETTE.length];
          return (
            <li key={i} className="flex items-center" data-feature={`step-${i + 1}`}>
              <div
                className="rounded-lg bg-white px-3 py-2"
                style={{ border: `3px solid ${color}`, width: 150, minHeight: 72, overflowWrap: 'anywhere' }}
              >
                <div className="text-[11px] font-bold" style={{ color }}>step {i + 1}</div>
                <div className="text-[13px] leading-snug text-slate-900">{s}</div>
              </div>
              {i < steps.length - 1 && <span aria-hidden="true" className="px-1.5 text-lg font-bold text-slate-900">→</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function renderCauseEffect(spec: Extract<GraphicOrganizerSpec, { kind: 'cause_effect' }>) {
  const cw = 200;
  const ew = 200;
  const padY = 30;
  const causes = list(spec.causes);
  const effects = list(spec.effects);
  const itemH = (SVG_H - 2 * padY) / Math.max(1, Math.max(causes.length, effects.length));
  return (
    <g>
      {/* Causes column */}
      {causes.map((c, i) => (
        <g key={i}>
          <rect x={20} y={padY + i * itemH + 8} width={cw} height={itemH - 16} fill="#fff" stroke="#f59e0b" strokeWidth={2.5} rx={6} />
          <foreignObject x={28} y={padY + i * itemH + 16} width={cw - 16} height={itemH - 32}>
            <div style={{ fontSize: 13, color: '#0f172a' }}>{c}</div>
          </foreignObject>
        </g>
      ))}
      <text x={20 + cw / 2} y={padY - 8} fontSize={14} textAnchor="middle" fontWeight={700} fill="#92400e">Causes</text>
      {/* Arrow band */}
      <line x1={20 + cw + 5} y1={SVG_H / 2} x2={SVG_W - 20 - ew - 5} y2={SVG_H / 2} stroke="#0f172a" strokeWidth={2} />
      <polygon points={`${SVG_W - 20 - ew - 5},${SVG_H / 2 - 6} ${SVG_W - 20 - ew + 4},${SVG_H / 2} ${SVG_W - 20 - ew - 5},${SVG_H / 2 + 6}`} fill="#0f172a" />
      {/* Effects column */}
      {effects.map((e, i) => (
        <g key={i}>
          <rect x={SVG_W - 20 - ew} y={padY + i * itemH + 8} width={ew} height={itemH - 16} fill="#fff" stroke="#10b981" strokeWidth={2.5} rx={6} />
          <foreignObject x={SVG_W - 12 - ew} y={padY + i * itemH + 16} width={ew - 16} height={itemH - 32}>
            <div style={{ fontSize: 13, color: '#0f172a' }}>{e}</div>
          </foreignObject>
        </g>
      ))}
      <text x={SVG_W - 20 - ew / 2} y={padY - 8} fontSize={14} textAnchor="middle" fontWeight={700} fill="#065f46">Effects</text>
    </g>
  );
}
