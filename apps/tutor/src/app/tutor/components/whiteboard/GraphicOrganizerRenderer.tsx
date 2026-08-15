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

const SVG_W = 520;
const SVG_H = 320;

export type GraphicOrganizerSpec =
  | {
      kind: 'story_map';
      title?: string;
      character?: string;
      setting?: string;
      problem?: string;
      solution?: string;
    }
  | {
      kind: 'kwl';
      title?: string;
      know: string[];
      want: string[];
      learned: string[];
    }
  | {
      kind: 't_chart';
      title?: string;
      leftHeader: string;
      rightHeader: string;
      leftItems: string[];
      rightItems: string[];
    }
  | {
      kind: 'sequence';
      title?: string;
      steps: string[];
    }
  | {
      kind: 'cause_effect';
      title?: string;
      causes: string[];
      effects: string[];
    };

export default function GraphicOrganizerRenderer({ spec }: { spec: GraphicOrganizerSpec }) {
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
        {spec.kind === 'sequence' && renderSequence(spec)}
        {spec.kind === 'cause_effect' && renderCauseEffect(spec)}
      </svg>
    </div>
  );
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
              {c.items.map((item, i) => (
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
          {spec.leftItems.map((it, i) => (
            <div key={i} style={{ marginBottom: 4 }}>• {it}</div>
          ))}
        </div>
      </foreignObject>
      <foreignObject x={SVG_W / 2 + 8} y={68} width={SVG_W / 2 - 40} height={SVG_H - 90}>
        <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.4 }}>
          {spec.rightItems.map((it, i) => (
            <div key={i} style={{ marginBottom: 4 }}>• {it}</div>
          ))}
        </div>
      </foreignObject>
    </g>
  );
}

function renderSequence(spec: Extract<GraphicOrganizerSpec, { kind: 'sequence' }>) {
  const N = spec.steps.length;
  const boxW = (SVG_W - 30 - (N - 1) * 24) / N;
  const cy = SVG_H / 2;
  const palette = ['#3b82f6', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#06b6d4'];
  return (
    <g>
      {spec.steps.map((s, i) => {
        const x = 15 + i * (boxW + 24);
        const color = palette[i % palette.length];
        return (
          <g key={i}>
            <rect x={x} y={cy - 50} width={boxW} height={100} fill="#fff" stroke={color} strokeWidth={3} rx={8} />
            <text x={x + 12} y={cy - 32} fontSize={11} fontWeight={700} fill={color}>step {i + 1}</text>
            <foreignObject x={x + 8} y={cy - 22} width={boxW - 16} height={70}>
              <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.3 }}>{s}</div>
            </foreignObject>
            {i < N - 1 && (
              <g>
                <line x1={x + boxW + 4} y1={cy} x2={x + boxW + 18} y2={cy} stroke="#0f172a" strokeWidth={2.5} />
                <polygon points={`${x + boxW + 18},${cy - 5} ${x + boxW + 23},${cy} ${x + boxW + 18},${cy + 5}`} fill="#0f172a" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function renderCauseEffect(spec: Extract<GraphicOrganizerSpec, { kind: 'cause_effect' }>) {
  const cw = 200;
  const ew = 200;
  const padY = 30;
  const itemH = (SVG_H - 2 * padY) / Math.max(1, Math.max(spec.causes.length, spec.effects.length));
  return (
    <g>
      {/* Causes column */}
      {spec.causes.map((c, i) => (
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
      {spec.effects.map((e, i) => (
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
