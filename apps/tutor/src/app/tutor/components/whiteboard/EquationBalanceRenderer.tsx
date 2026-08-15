'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Equation Balance Renderer — math (NOT chemistry).
 *
 * Renders a balance scale showing equality between two sides. The
 * solver enforces actual balance from item weights, so the brain
 * cannot ask for a "balanced" scale that isn't.
 */

import React from 'react';
import type { BalanceFigure, BalanceItem } from '@/lib/tutor/diagrams/catalog/kinds/equation-balance';

export interface EquationBalanceRendererProps {
  figure: BalanceFigure;
}

const W = 720;
const H = 320;
const CENTER_X = W / 2;
const FULCRUM_Y = 220;
const BEAM_HALF = 240;
const PAN_OFFSET_Y = 32;
const ITEM_SIZE = 44;
const ITEM_GAP = 8;

function tiltAngle(state: BalanceFigure['state']): number {
  if (state === 'level') return 0;
  if (state === 'tilt_left') return -8;
  return 8;
}

function ItemBlock({ item, x, y }: { item: BalanceItem; x: number; y: number }) {
  const fill = item.color || '#dbeafe';
  const stroke = item.color ? darken(item.color) : '#3b82f6';
  return (
    <g data-feature={`item-${item.label}`}>
      <rect
        x={x - ITEM_SIZE / 2}
        y={y - ITEM_SIZE / 2}
        width={ITEM_SIZE}
        height={ITEM_SIZE}
        rx={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
      />
      <text
        x={x}
        y={y + 5}
        fontSize={16}
        textAnchor="middle"
        fill="#1e3a8a"
        fontWeight={700}
      >
        {item.label}
      </text>
    </g>
  );
}

function darken(hex: string): string {
  // Light heuristic: assume hex like #rrggbb; clamp components to 70%.
  if (!hex.startsWith('#') || hex.length !== 7) return '#1f2937';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 0.7;
  const to2 = (n: number) => Math.round(n * f).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

export function EquationBalanceRenderer({ figure }: EquationBalanceRendererProps) {
  const { left, right, state, title, caption } = figure;
  const angle = tiltAngle(state);

  // Beam endpoints rotated about the fulcrum.
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const beamLX = CENTER_X - BEAM_HALF * cos;
  const beamLY = FULCRUM_Y - BEAM_HALF * sin;
  const beamRX = CENTER_X + BEAM_HALF * cos;
  const beamRY = FULCRUM_Y + BEAM_HALF * sin;

  // Pan top centers — drop straight down from the beam endpoints.
  const panLX = beamLX;
  const panLY = beamLY + PAN_OFFSET_Y;
  const panRX = beamRX;
  const panRY = beamRY + PAN_OFFSET_Y;

  return (
    <div className="equation-balance-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px] h-auto" data-feature="balance-scale">
        {/* Floor */}
        <line x1={CENTER_X - 200} y1={FULCRUM_Y + 80} x2={CENTER_X + 200} y2={FULCRUM_Y + 80} stroke="#9ca3af" strokeWidth={1.5} />
        {/* Fulcrum: triangle */}
        <polygon
          points={`${CENTER_X - 28},${FULCRUM_Y + 80} ${CENTER_X + 28},${FULCRUM_Y + 80} ${CENTER_X},${FULCRUM_Y}`}
          fill="#6b7280"
          stroke="#374151"
          strokeWidth={1.5}
        />
        {/* Beam */}
        <line x1={beamLX} y1={beamLY} x2={beamRX} y2={beamRY} stroke="#374151" strokeWidth={5} strokeLinecap="round" />
        {/* Pivot dot */}
        <circle cx={CENTER_X} cy={FULCRUM_Y} r={5} fill="#1f2937" />

        {/* Suspension lines */}
        <line x1={beamLX} y1={beamLY} x2={panLX} y2={panLY} stroke="#9ca3af" strokeWidth={1.5} />
        <line x1={beamRX} y1={beamRY} x2={panRX} y2={panRY} stroke="#9ca3af" strokeWidth={1.5} />

        {/* Pans (curved tray) */}
        <Pan cx={panLX} cy={panLY} />
        <Pan cx={panRX} cy={panRY} />

        {/* Items on each pan */}
        {layoutItems(left, panLX, panLY).map((it, i) => (
          <ItemBlock key={`l-${i}`} item={it.item} x={it.x} y={it.y} />
        ))}
        {layoutItems(right, panRX, panRY).map((it, i) => (
          <ItemBlock key={`r-${i}`} item={it.item} x={it.x} y={it.y} />
        ))}

        {/* Operator hint between pans, useful for equality */}
        <text x={CENTER_X} y={FULCRUM_Y - 30} fontSize={28} textAnchor="middle" fill="#1f2937" fontWeight={700}>
          {state === 'level' ? '=' : state === 'tilt_left' ? '>' : '<'}
        </text>
      </svg>
      {caption && <div className="mt-3 text-lg font-mono text-gray-800">{caption}</div>}
    </div>
  );
}

/** Center items above the pan, two per row at most. Tightly packed. */
function layoutItems(items: BalanceItem[], panCx: number, panCy: number): Array<{ item: BalanceItem; x: number; y: number }> {
  const out: Array<{ item: BalanceItem; x: number; y: number }> = [];
  if (items.length === 0) return out;
  const perRow = Math.min(3, items.length);
  const rowW = perRow * ITEM_SIZE + (perRow - 1) * ITEM_GAP;
  const startX = panCx - rowW / 2 + ITEM_SIZE / 2;
  // Stack items above the pan; pan top is at panCy.
  let row = 0;
  let col = 0;
  for (const it of items) {
    const x = startX + col * (ITEM_SIZE + ITEM_GAP);
    const y = panCy - 26 - row * (ITEM_SIZE + ITEM_GAP);
    out.push({ item: it, x, y });
    col += 1;
    if (col >= perRow) {
      col = 0;
      row += 1;
    }
  }
  return out;
}

function Pan({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path
        d={`M ${cx - 60} ${cy} Q ${cx} ${cy + 18} ${cx + 60} ${cy}`}
        fill="#e5e7eb"
        stroke="#6b7280"
        strokeWidth={1.5}
      />
      <line x1={cx - 60} y1={cy} x2={cx + 60} y2={cy} stroke="#6b7280" strokeWidth={1.5} />
    </g>
  );
}
