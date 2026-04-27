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
  return (
    <g>
      {cols.map((c) => (
        <g key={c.label}>
          <rect x={c.x} y={30} width={colW} height={SVG_H - 50} fill="#fff" stroke={c.color} strokeWidth={3} rx={6} />
          <text x={c.x + colW / 2} y={20} fontSize={12} textAnchor="middle" fontWeight={700} fill={c.color}>{c.label}</text>
          {c.items.map((item, i) => (
            <text key={i} x={c.x + 10} y={56 + i * 22} fontSize={12} fill="#0f172a">• {item}</text>
          ))}
        </g>
      ))}
    </g>
  );
}

function renderTChart(spec: Extract<GraphicOrganizerSpec, { kind: 't_chart' }>) {
  const colW = (SVG_W - 30) / 2;
  return (
    <g>
      <line x1={SVG_W / 2} y1={30} x2={SVG_W / 2} y2={SVG_H - 20} stroke="#0f172a" strokeWidth={3} />
      <line x1={20} y1={56} x2={SVG_W - 20} y2={56} stroke="#0f172a" strokeWidth={3} />
      <text x={20 + colW / 2} y={46} fontSize={16} textAnchor="middle" fontWeight={700} fill="#0f172a">{spec.leftHeader}</text>
      <text x={SVG_W / 2 + colW / 2} y={46} fontSize={16} textAnchor="middle" fontWeight={700} fill="#0f172a">{spec.rightHeader}</text>
      {spec.leftItems.map((it, i) => (
        <text key={i} x={28} y={84 + i * 22} fontSize={13} fill="#0f172a">• {it}</text>
      ))}
      {spec.rightItems.map((it, i) => (
        <text key={i} x={SVG_W / 2 + 8} y={84 + i * 22} fontSize={13} fill="#0f172a">• {it}</text>
      ))}
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
