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
const CENTER_X = W / 2;
const BEAM_HALF = 230;
const POST_H = 16;        // short post lifting each pan above the beam end
const ITEM_H = 44;
const ITEM_MIN_W = 44;
const ITEM_MAX_W = 150;
const ITEM_GAP = 8;
const ITEM_FONT = 16;
const ROW_MAX_W = 220;    // widest row of blocks a pan carries
const TOP_PAD = 14;
const STAND_H = 80;

function tiltAngle(state: BalanceFigure['state']): number {
  if (state === 'level') return 0;
  if (state === 'tilt_left') return -8;
  return 8;
}

/** Estimated width of a bold label, px. */
function estW(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}

interface SizedItem { item: BalanceItem; w: number; font: number; lines: string[] }

/** A block is as wide as its label needs (never narrower than a square).
 *  A label too long for the widest block wraps onto two lines, and only
 *  then shrinks its type. */
function sizeItem(item: BalanceItem): SizedItem {
  const label = item.label.trim();
  const oneLine = estW(label, ITEM_FONT) + 16;
  if (oneLine <= ITEM_MAX_W) {
    return { item, w: Math.max(ITEM_MIN_W, Math.ceil(oneLine)), font: ITEM_FONT, lines: [label] };
  }
  const words = label.split(/\s+/);
  for (const font of [14, 12, 11, 10]) {
    if (words.length > 1) {
      // best two-line split
      let best: string[] | null = null;
      let bestW = Infinity;
      for (let k = 1; k < words.length; k++) {
        const l1 = words.slice(0, k).join(' ');
        const l2 = words.slice(k).join(' ');
        const w = Math.max(estW(l1, font), estW(l2, font));
        if (w < bestW) { bestW = w; best = [l1, l2]; }
      }
      if (best && bestW + 14 <= ITEM_MAX_W) {
        return { item, w: Math.max(ITEM_MIN_W, Math.ceil(bestW + 14)), font, lines: best };
      }
    } else if (estW(label, font) + 12 <= ITEM_MAX_W) {
      return { item, w: Math.ceil(estW(label, font) + 12), font, lines: [label] };
    }
  }
  // Last resort: truncate with an ellipsis at the smallest size.
  const maxChars = Math.floor((ITEM_MAX_W - 12) / (10 * 0.6)) - 1;
  return { item, w: ITEM_MAX_W, font: 10, lines: [label.slice(0, maxChars) + '…'] };
}

interface PlacedItem extends SizedItem { dx: number; row: number }

/** Pack blocks into rows no wider than ROW_MAX_W, bottom row first. Each
 *  row is centred on the pan. Returns positions relative to the pan centre. */
function packItems(items: BalanceItem[]): { placed: PlacedItem[]; rows: number; maxRowW: number } {
  const sized = items.map(sizeItem);
  const rows: SizedItem[][] = [];
  let cur: SizedItem[] = [];
  let curW = 0;
  for (const it of sized) {
    const add = (cur.length ? ITEM_GAP : 0) + it.w;
    if (cur.length && curW + add > ROW_MAX_W) {
      rows.push(cur);
      cur = [it];
      curW = it.w;
    } else {
      cur.push(it);
      curW += add;
    }
  }
  if (cur.length) rows.push(cur);
  const placed: PlacedItem[] = [];
  let maxRowW = 0;
  rows.forEach((row, r) => {
    const rowW = row.reduce((s, it) => s + it.w, 0) + (row.length - 1) * ITEM_GAP;
    maxRowW = Math.max(maxRowW, rowW);
    let x = -rowW / 2;
    for (const it of row) {
      placed.push({ ...it, dx: x + it.w / 2, row: r });
      x += it.w + ITEM_GAP;
    }
  });
  return { placed, rows: rows.length, maxRowW };
}

function ItemBlock({ it, x, y }: { it: PlacedItem; x: number; y: number }) {
  const { item } = it;
  const fill = item.color || '#dbeafe';
  const stroke = item.color ? darken(item.color) : '#3b82f6';
  const lineH = it.font * 1.15;
  const firstY = y + it.font * 0.35 - ((it.lines.length - 1) * lineH) / 2;
  return (
    <g data-feature={`item-${item.label}`}>
      <rect
        x={x - it.w / 2}
        y={y - ITEM_H / 2}
        width={it.w}
        height={ITEM_H}
        rx={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
      />
      <text fontSize={it.font} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>
        {it.lines.map((line, i) => (
          <tspan key={i} x={x} y={firstY + i * lineH}>{line}</tspan>
        ))}
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

  const L = packItems(left);
  const R = packItems(right);

  // Beam endpoints rotated about the fulcrum.
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const riseL = -BEAM_HALF * sin; // beam-end y relative to the fulcrum (negative = up)
  const riseR = BEAM_HALF * sin;

  // The figure is as tall as the taller stack needs — the fulcrum drops to
  // make room, so a pan piled three rows high never leaves the board.
  const stackH = (rows: number) => rows * ITEM_H + Math.max(0, rows - 1) * ITEM_GAP;
  const needL = stackH(L.rows) + POST_H + 6 - riseL;
  const needR = stackH(R.rows) + POST_H + 6 - riseR;
  const FULCRUM_Y = TOP_PAD + Math.max(needL, needR, 70);
  const H = FULCRUM_Y + STAND_H + 14;

  const beamLX = CENTER_X - BEAM_HALF * cos;
  const beamLY = FULCRUM_Y + riseL;
  const beamRX = CENTER_X + BEAM_HALF * cos;
  const beamRY = FULCRUM_Y + riseR;

  // Pans sit on a short post ABOVE each beam end, so the blocks stand on the
  // pan and nothing is drawn across the beam.
  const panLY = beamLY - POST_H;
  const panRY = beamRY - POST_H;
  const panHalf = (maxRowW: number) => Math.max(60, Math.min(BEAM_HALF - 40, maxRowW / 2 + 12));

  const blockY = (panY: number, row: number) => panY - 5 - ITEM_H / 2 - row * (ITEM_H + ITEM_GAP);

  return (
    <div className="equation-balance-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px] h-auto" data-feature="balance-scale">
        {/* Floor */}
        <line x1={CENTER_X - 200} y1={FULCRUM_Y + STAND_H} x2={CENTER_X + 200} y2={FULCRUM_Y + STAND_H} stroke="#9ca3af" strokeWidth={1.5} />
        {/* Fulcrum: triangle */}
        <polygon
          points={`${CENTER_X - 28},${FULCRUM_Y + STAND_H} ${CENTER_X + 28},${FULCRUM_Y + STAND_H} ${CENTER_X},${FULCRUM_Y}`}
          fill="#6b7280"
          stroke="#374151"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Posts */}
        <line x1={beamLX} y1={beamLY} x2={beamLX} y2={panLY} stroke="#374151" strokeWidth={3} />
        <line x1={beamRX} y1={beamRY} x2={beamRX} y2={panRY} stroke="#374151" strokeWidth={3} />
        {/* Beam */}
        <line x1={beamLX} y1={beamLY} x2={beamRX} y2={beamRY} stroke="#374151" strokeWidth={5} strokeLinecap="round" />
        {/* Pivot dot */}
        <circle cx={CENTER_X} cy={FULCRUM_Y} r={5} fill="#1f2937" />

        {/* Pans (flat trays) */}
        <Pan cx={beamLX} cy={panLY} half={panHalf(L.maxRowW)} />
        <Pan cx={beamRX} cy={panRY} half={panHalf(R.maxRowW)} />

        {/* Items on each pan */}
        {L.placed.map((it, i) => (
          <ItemBlock key={`l-${i}`} it={it} x={beamLX + it.dx} y={blockY(panLY, it.row)} />
        ))}
        {R.placed.map((it, i) => (
          <ItemBlock key={`r-${i}`} it={it} x={beamRX + it.dx} y={blockY(panRY, it.row)} />
        ))}

        {/* Relation sign under the pivot, on the stand */}
        <text x={CENTER_X} y={FULCRUM_Y - 18} fontSize={26} textAnchor="middle" fill="#1f2937" fontWeight={700}>
          {state === 'level' ? '=' : state === 'tilt_left' ? '>' : '<'}
        </text>
      </svg>
      {caption && (
        <div className="mt-2 max-w-[600px] text-center text-sm leading-snug text-gray-700">
          <InlineMathText text={caption} />
        </div>
      )}
    </div>
  );
}

function Pan({ cx, cy, half }: { cx: number; cy: number; half: number }) {
  return (
    <path
      d={`M ${cx - half} ${cy - 5} L ${cx + half} ${cy - 5} L ${cx + half - 8} ${cy + 3} L ${cx - half + 8} ${cy + 3} Z`}
      fill="#e5e7eb"
      stroke="#6b7280"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  );
}
