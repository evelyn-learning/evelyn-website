'use client';

import React from 'react';
import {
  dataStructureFeatureNames,
  graphFeatureNames,
  hashTableFeatureNames,
  recursionTreeFeatureNames,
  sortingStepsFeatureNames,
  type DataStructureFigure,
  type GraphFigure,
  type HashTableFigure,
  type RecursionTreeFigure,
  type SortingStepsFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/cs-structures';

const BLUE = '#2563eb';
const RED = '#dc2626';
const GREEN = '#16a34a';
const PURPLE = '#7c3aed';
const GRAY = '#94a3b8';
const INK = '#374151';
const CELL = '#eff6ff';
const CELL_STROKE = '#93c5fd';

function TitleBar({ title, fallback }: { title?: string; fallback: string }) {
  return (
    <div className="text-base font-semibold text-gray-800 mb-2">{title || fallback}</div>
  );
}

/** White halo behind a label so a line passing under it never strikes it through. */
const HALO = { paintOrder: 'stroke' as const, stroke: '#ffffff', strokeWidth: 4, strokeLinejoin: 'round' as const };
const MONO_CW = 9.1; // width of one monospace glyph at fontSize 15

function Caption({ children, color = INK }: { children: React.ReactNode; color?: string }) {
  return <div className="text-[13px] font-medium mt-2 text-center" style={{ color }}>{children}</div>;
}

// ── data_structure ────────────────────────────────────────────────────────────
export function CatalogDataStructureRenderer({ figure }: { figure: DataStructureFigure }) {
  const N = dataStructureFeatureNames;
  if (figure.structure === 'stack') return <StackRenderer figure={figure} N={N} />;
  if (figure.structure === 'queue') return <QueueRenderer figure={figure} N={N} />;
  return <LinkedListRenderer figure={figure} N={N} />;
}

function StackRenderer({ figure, N }: { figure: DataStructureFigure; N: typeof dataStructureFeatureNames }) {
  const items = figure.items;
  const n = items.length;
  const longest = Math.max(0, ...items.map((s) => s.length));
  const BW = Math.max(130, Math.round(longest * MONO_CW) + 30); // the box fits the longest item
  const BH = n > 8 ? 34 : 42;
  const GAP = 5;
  const topPad = 64;
  const SIDE = 70; // room for "top" / "bottom" on the right, mirrored on the left
  const W = BW + SIDE * 2;
  const H = topPad + n * (BH + GAP) + 6;
  const bx = SIDE;
  const topY = topPad;
  const pushX = bx + BW / 2 - 26;
  const popX = bx + BW / 2 + 26;

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback="Stack (LIFO)" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(640, Math.round(W * 1.15)) }}
        data-feature={N.figure}
        data-feature-label={figure.title || 'Stack (LIFO)'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GREEN} />
          </marker>
        </defs>

        {/* top: push goes in, pop comes out */}
        <g data-feature={N.entry} data-feature-label="Top (push / pop)">
          <text x={pushX} y={16} fontSize={13} textAnchor="middle" fill={GREEN} fontWeight={700}>push</text>
          <line x1={pushX} y1={24} x2={pushX} y2={topY - 8} stroke={GREEN} strokeWidth={2.2} markerEnd="url(#cs-arr-green)" />
          <text x={popX} y={16} fontSize={13} textAnchor="middle" fill={GREEN} fontWeight={700}>pop</text>
          <line x1={popX} y1={topY - 6} x2={popX} y2={26} stroke={GREEN} strokeWidth={2.2} markerEnd="url(#cs-arr-green)" />
        </g>

        <g data-feature={N.cells} data-feature-label="Elements">
          {items.map((it, i) => {
            const y = topY + (n - 1 - i) * (BH + GAP);
            const isTop = i === n - 1;
            const omitted = i === figure.omittedIndex;
            return (
              <g key={i}>
                <rect x={bx} y={y} width={BW} height={BH} rx={5} fill={omitted ? '#f8fafc' : CELL} stroke={isTop ? GREEN : omitted ? GRAY : CELL_STROKE} strokeWidth={isTop ? 2.5 : 1.5} strokeDasharray={omitted ? '5 4' : undefined} />
                <text x={bx + BW / 2} y={y + BH / 2 + 5} fontSize={omitted ? 13 : 15} textAnchor="middle" fill={omitted ? '#64748b' : INK} fontWeight={600} fontFamily={omitted ? undefined : 'monospace'}>{it}</text>
              </g>
            );
          })}
        </g>

        <text x={bx + BW + 10} y={topY + BH / 2 + 4} fontSize={12.5} textAnchor="start" fill={GREEN} fontWeight={700}>← top</text>
        {n > 1 && <text x={bx + BW + 10} y={topY + (n - 1) * (BH + GAP) + BH / 2 + 4} fontSize={12.5} textAnchor="start" fill="#64748b">← bottom</text>}
      </svg>
      <Caption>Stack: last in, first out (LIFO)</Caption>
    </div>
  );
}

/** Cells laid out left to right, wrapped onto further rows when one row would force the
 *  text to shrink. Rows are balanced so the last one is not a lone leftover. */
function wrapRows(n: number, cellW: number, gap: number, maxRowW: number): { perRow: number; rows: number } {
  const fit = Math.max(2, Math.floor((maxRowW + gap) / (cellW + gap)));
  const rows = Math.max(1, Math.ceil(n / fit));
  return { perRow: Math.ceil(n / rows), rows };
}

function QueueRenderer({ figure, N }: { figure: DataStructureFigure; N: typeof dataStructureFeatureNames }) {
  const items = figure.items;
  const n = items.length;
  const longest = Math.max(0, ...items.filter((_, i) => i !== figure.omittedIndex).map((s) => s.length));
  const BW = Math.max(figure.omittedIndex !== undefined ? 92 : 58, Math.round(longest * MONO_CW) + 22); // the box fits the longest item
  const BH = 50;
  const GAP = 6;
  const SIDE = 96; // room for the dequeue / enqueue arrows and their words
  const { perRow, rows } = wrapRows(n, BW, GAP, 780 - SIDE * 2);
  const ROW_GAP = 44;
  const topPad = 34;
  const rowW = perRow * (BW + GAP) - GAP;
  const W = rowW + SIDE * 2;
  const H = topPad + rows * BH + (rows - 1) * ROW_GAP + 30;
  const cell = (i: number) => ({ x: SIDE + (i % perRow) * (BW + GAP), y: topPad + Math.floor(i / perRow) * (BH + ROW_GAP) });
  const first = cell(0);
  const last = cell(n - 1);

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback="Queue (FIFO)" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(720, Math.round(W * 1.1)) }}
        data-feature={N.figure}
        data-feature-label={figure.title || 'Queue (FIFO)'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
          </marker>
          <marker id="cs-arr-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={RED} />
          </marker>
          <marker id="cs-arr-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GRAY} />
          </marker>
        </defs>

        {/* the line carries on from the end of one row to the start of the next */}
        {Array.from({ length: rows - 1 }, (_, r) => {
          const yA = topPad + r * (BH + ROW_GAP) + BH / 2;
          const yB = yA + BH + ROW_GAP;
          const yMid = yA + BH / 2 + ROW_GAP / 2;
          const xR = SIDE + rowW + 14;
          const xL = SIDE - 14;
          return (
            <path key={r} d={`M ${SIDE + rowW + 2} ${yA} L ${xR} ${yA} L ${xR} ${yMid} L ${xL} ${yMid} L ${xL} ${yB} L ${SIDE - 3} ${yB}`} fill="none" stroke={GRAY} strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#cs-arr-gray)" />
          );
        })}

        <g data-feature={N.cells} data-feature-label="Elements">
          {items.map((it, i) => {
            const { x, y } = cell(i);
            const omitted = i === figure.omittedIndex;
            const end = i === 0 ? BLUE : i === n - 1 ? RED : null;
            return (
              <g key={i}>
                <rect x={x} y={y} width={BW} height={BH} rx={5} fill={omitted ? '#f8fafc' : CELL} stroke={end ?? (omitted ? GRAY : CELL_STROKE)} strokeWidth={end ? 2.2 : 1.5} strokeDasharray={omitted ? '5 4' : undefined} />
                <text x={x + BW / 2} y={y + BH / 2 + 5} fontSize={omitted ? 12 : 15} textAnchor="middle" fill={omitted ? '#64748b' : INK} fontWeight={600} fontFamily={omitted ? undefined : 'monospace'}>{it}</text>
              </g>
            );
          })}
        </g>

        {/* front (dequeue) leaves on the left of the first cell */}
        <g data-feature={N.exit} data-feature-label="Front (dequeue)">
          <text x={first.x + BW / 2} y={first.y - 10} fontSize={12.5} textAnchor="middle" fill={BLUE} fontWeight={700}>FRONT</text>
          <line x1={first.x - 8} y1={first.y + BH / 2} x2={first.x - 52} y2={first.y + BH / 2} stroke={BLUE} strokeWidth={2.2} markerEnd="url(#cs-arr-blue)" />
          <text x={first.x - 30} y={first.y + BH / 2 - 10} fontSize={12} textAnchor="middle" fill={BLUE} fontWeight={700}>dequeue</text>
        </g>

        {/* rear (enqueue) joins on the right of the last cell */}
        <g data-feature={N.entry} data-feature-label="Rear (enqueue)">
          <text x={last.x + BW / 2} y={last.y - 10} fontSize={12.5} textAnchor="middle" fill={RED} fontWeight={700}>{n > 1 ? 'REAR' : ''}</text>
          <line x1={last.x + BW + 52} y1={last.y + BH / 2} x2={last.x + BW + 8} y2={last.y + BH / 2} stroke={RED} strokeWidth={2.2} markerEnd="url(#cs-arr-red)" />
          <text x={last.x + BW + 30} y={last.y + BH / 2 - 10} fontSize={12} textAnchor="middle" fill={RED} fontWeight={700}>enqueue</text>
        </g>
      </svg>
      <Caption>Queue: first in, first out (FIFO)</Caption>
    </div>
  );
}

function LinkedListRenderer({ figure, N }: { figure: DataStructureFigure; N: typeof dataStructureFeatureNames }) {
  const items = figure.items;
  const n = items.length;
  const longest = Math.max(0, ...items.filter((_, i) => i !== figure.omittedIndex).map((s) => s.length));
  const VW = Math.max(figure.omittedIndex !== undefined ? 92 : 50, Math.round(longest * MONO_CW) + 18); // value cell fits the longest value
  const PW = 28; // next-pointer cell
  const BH = 46;
  const NODEW = VW + PW;
  const ARROW = 34;
  const leftPad = 22;
  const NULLW = 46; // room for "null" after the last pointer
  const { perRow, rows } = wrapRows(n, NODEW, ARROW, 700 - leftPad * 2 - NULLW - ARROW);
  const ROW_GAP = 46;
  const topPad = 44;
  const W = leftPad * 2 + perRow * (NODEW + ARROW) + NULLW;
  const H = topPad + rows * BH + (rows - 1) * ROW_GAP + 10;
  const node = (i: number) => ({ x: leftPad + (i % perRow) * (NODEW + ARROW), y: topPad + Math.floor(i / perRow) * (BH + ROW_GAP) });

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback="Linked list" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(720, Math.round(W * 1.1)) }}
        data-feature={N.figure}
        data-feature-label={figure.title || 'Linked list'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-arr-ll" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
          <marker id="cs-arr-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={PURPLE} />
          </marker>
        </defs>

        {/* head pointer: the word, then a short arrow down to the first node */}
        <text x={leftPad + VW / 2} y={14} fontSize={13} textAnchor="middle" fill={PURPLE} fontWeight={700}>head</text>
        <line x1={leftPad + VW / 2} y1={20} x2={leftPad + VW / 2} y2={topPad - 4} stroke={PURPLE} strokeWidth={2} markerEnd="url(#cs-arr-head)" />

        <g data-feature={N.cells} data-feature-label="Nodes">
          {items.map((it, i) => {
            const { x, y } = node(i);
            const dotX = x + VW + PW / 2;
            const cy = y + BH / 2;
            const isLast = i === n - 1;
            const omitted = i === figure.omittedIndex;
            const wraps = !isLast && (i + 1) % perRow === 0;
            const next = isLast ? null : node(i + 1);
            const yMid = y + BH + ROW_GAP / 2;
            return (
              <g key={i}>
                <rect x={x} y={y} width={VW} height={BH} rx={4} fill={omitted ? '#f8fafc' : CELL} stroke={omitted ? GRAY : CELL_STROKE} strokeWidth={1.5} strokeDasharray={omitted ? '5 4' : undefined} />
                <text x={x + VW / 2} y={cy + 5} fontSize={omitted ? 12 : 15} textAnchor="middle" fill={omitted ? '#64748b' : INK} fontWeight={600} fontFamily={omitted ? undefined : 'monospace'}>{it}</text>
                <rect x={x + VW} y={y} width={PW} height={BH} rx={4} fill="#f8fafc" stroke={omitted ? GRAY : CELL_STROKE} strokeWidth={1.5} strokeDasharray={omitted ? '5 4' : undefined} />
                <circle cx={dotX} cy={cy} r={3.5} fill={INK} />
                {isLast ? (
                  <>
                    <line x1={dotX} y1={cy} x2={x + NODEW + ARROW - 6} y2={cy} stroke={INK} strokeWidth={1.8} markerEnd="url(#cs-arr-ll)" />
                    <g data-feature={N.exit} data-feature-label="null">
                      <text x={x + NODEW + ARROW} y={cy + 5} fontSize={14} textAnchor="start" fill="#64748b" fontWeight={700} fontFamily="monospace">null</text>
                    </g>
                  </>
                ) : wraps && next ? (
                  // the pointer of a row's last node runs round to the first node of the next row
                  <path d={`M ${dotX} ${cy} L ${x + NODEW + 16} ${cy} L ${x + NODEW + 16} ${yMid} L ${next.x - 14} ${yMid} L ${next.x - 14} ${next.y + BH / 2} L ${next.x - 3} ${next.y + BH / 2}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" markerEnd="url(#cs-arr-ll)" />
                ) : (
                  <line x1={dotX} y1={cy} x2={x + NODEW + ARROW - 3} y2={cy} stroke={INK} strokeWidth={1.8} markerEnd="url(#cs-arr-ll)" />
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <Caption>Singly linked list: each node stores a value and a pointer to the next node</Caption>
    </div>
  );
}

// ── graph_diagram ─────────────────────────────────────────────────────────────
export function CatalogGraphRenderer({ figure }: { figure: GraphFigure }) {
  const N = graphFeatureNames;
  const n = figure.nodes.length;
  const RY = 20;
  // A vertex is a circle that widens into a pill for a long name, so the name is always inside.
  const rxOf = (label: string) => Math.max(RY, Math.round(label.length * 4.4) + 10);
  const rxMax = Math.max(RY, ...figure.nodes.map((nd) => rxOf(nd.label)));
  // The ring grows with the number of vertices and their width (the solver places them on a
  // ring: x = 0.5 + 0.4 cos, y = 0.5 + 0.42 sin).
  const ringR = Math.max(130, (n * (2 * rxMax + 54)) / (2 * Math.PI));
  const AW = (2 * ringR) / 0.8;
  const AH = (2 * ringR * 0.86) / 0.84;
  const padX = rxMax + 16;
  const padY = RY + 22;
  const W = AW * 0.8 + padX * 2;
  const H = AH * 0.84 + padY * 2;
  const px = (nx: number) => padX + (nx - 0.1) * AW;
  const py = (ny: number) => padY + (ny - 0.08) * AH;
  const nodeById = new Map(figure.nodes.map((nd) => [nd.id, nd]));
  const hasEdge = (a: string, b: string) => figure.edges.some((e) => e.from === a && e.to === b);

  type Seg = { x1: number; y1: number; x2: number; y2: number; weight?: number };
  const segs: Seg[] = [];
  for (const e of figure.edges) {
    const a = nodeById.get(e.from); const b = nodeById.get(e.to);
    if (!a || !b || a === b) { segs.push({ x1: NaN, y1: NaN, x2: NaN, y2: NaN }); continue; }
    let ax = px(a.x), ay = py(a.y), bx = px(b.x), by = py(b.y);
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const ux = (bx - ax) / len, uy = (by - ay) / len;
    // Two arrows between the same pair run side by side, not on top of each other.
    if (figure.directed && hasEdge(e.to, e.from)) { ax += uy * 6; ay -= ux * 6; bx += uy * 6; by -= ux * 6; }
    const reach = (rx: number) => 1 / Math.sqrt((ux / rx) ** 2 + (uy / RY) ** 2);
    const ra = reach(rxOf(a.label)); const rb = reach(rxOf(b.label)) + (figure.directed ? 3 : 0);
    segs.push({ x1: ax + ux * ra, y1: ay + uy * ra, x2: bx - ux * rb, y2: by - uy * rb, weight: e.weight });
  }
  // Weight labels sit on their own edge, at the first place along it that is clear of the
  // other weights, the vertices and the other edges.
  const distToSeg = (x: number, y: number, s: Seg) => {
    const dx = s.x2 - s.x1, dy = s.y2 - s.y1; const l2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((x - s.x1) * dx + (y - s.y1) * dy) / l2));
    return Math.hypot(x - (s.x1 + t * dx), y - (s.y1 + t * dy));
  };
  const placedW: Array<{ x: number; y: number; w: number }> = [];
  const weightPos = segs.map((s, i) => {
    if (s.weight === undefined || Number.isNaN(s.x1)) return null;
    const w = String(s.weight).length * 7.4 + 8;
    let best: { x: number; y: number } | null = null; let bestBad = Infinity;
    for (const t of [0.5, 0.4, 0.6, 0.32, 0.68, 0.25, 0.75, 0.18, 0.82]) {
      const x = s.x1 + (s.x2 - s.x1) * t; const y = s.y1 + (s.y2 - s.y1) * t;
      let bad = 0;
      for (const o of placedW) if (Math.abs(o.x - x) < (o.w + w) / 2 + 3 && Math.abs(o.y - y) < 18) bad += 3;
      for (const nd of figure.nodes) if (Math.abs(px(nd.x) - x) < rxOf(nd.label) + w / 2 + 2 && Math.abs(py(nd.y) - y) < RY + 10) bad += 3;
      segs.forEach((o, j) => { if (j !== i && !Number.isNaN(o.x1) && distToSeg(x, y, o) < 15) bad += 1; });
      if (bad < bestBad) { bestBad = bad; best = { x, y }; }
      if (bad === 0) break;
    }
    placedW.push({ ...best!, w });
    return { ...best!, w };
  });

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar
        title={figure.title}
        fallback={`${figure.directed ? 'Directed' : 'Undirected'} graph${figure.traversal ? ` — ${figure.traversal.toUpperCase()} traversal` : ''}`}
      />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(720, Math.round(W * 1.1)) }}
        data-feature={N.figure}
        data-feature-label={figure.title || 'Graph'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-graph-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
        </defs>

        <g data-feature={N.edges} data-feature-label="Edges">
          {segs.map((s, i) => Number.isNaN(s.x1) ? null : (
            <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={figure.directed ? '#64748b' : GRAY} strokeWidth={1.8} markerEnd={figure.directed ? 'url(#cs-graph-arr)' : undefined} />
          ))}
          {weightPos.map((p, i) => p ? (
            <g key={`w-${i}`}>
              <rect x={p.x - p.w / 2} y={p.y - 9} width={p.w} height={18} rx={4} fill="#ffffff" />
              <text x={p.x} y={p.y + 4.5} fontSize={12.5} textAnchor="middle" fill={PURPLE} fontWeight={700}>{segs[i].weight}</text>
            </g>
          ) : null)}
        </g>

        <g data-feature={N.nodes} data-feature-label="Vertices">
          {figure.nodes.map((nd) => {
            const rx = rxOf(nd.label);
            return (
              <g key={nd.id}>
                <rect x={px(nd.x) - rx} y={py(nd.y) - RY} width={rx * 2} height={RY * 2} rx={RY} fill={CELL} stroke={BLUE} strokeWidth={2} />
                <text x={px(nd.x)} y={py(nd.y) + 5} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700}>{nd.label}</text>
                {figure.traversal && nd.order !== undefined && (
                  <g data-feature={N.traversal} data-feature-label={`${figure.traversal.toUpperCase()} order`}>
                    <circle cx={px(nd.x) + rx - 5} cy={py(nd.y) - RY} r={9.5} fill={GREEN} stroke="#fff" strokeWidth={1.5} />
                    <text x={px(nd.x) + rx - 5} y={py(nd.y) - RY + 4} fontSize={11} textAnchor="middle" fill="#fff" fontWeight={700}>{nd.order}</text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      {figure.traversal && (
        <Caption color={GREEN}>{`Green numbers: ${figure.traversal.toUpperCase()} visit order, starting from ${figure.nodes[0]?.label}`}</Caption>
      )}
    </div>
  );
}

// ── hash_table ────────────────────────────────────────────────────────────────
export function CatalogHashTableRenderer({ figure }: { figure: HashTableFigure }) {
  const N = hashTableFeatureNames;
  const rows = figure.size;
  const IDXW = 44;
  const SLOTW = 54;
  const RH = 38;
  const GAP = 4;
  const topPad = 30;
  const leftPad = 12;
  const entryText = (e: { key: string; value: string }) => (e.value !== '' ? `${e.key}: ${e.value}` : e.key);
  // Each chained entry is as wide as its own "key: value".
  const entryW = (e: { key: string; value: string }) => Math.max(58, Math.round(entryText(e).length * 7.7) + 18);
  const CHGAP = 26;
  const chainW = (b: { chain: { key: string; value: string }[] }) => b.chain.reduce((sum, e) => sum + entryW(e) + CHGAP, 0);
  const maxChainW = Math.max(entryW({ key: 'key', value: '0' }) + CHGAP, ...figure.buckets.map(chainW));
  const anyCollision = figure.buckets.some((b) => b.chain.length > 1);
  const W = leftPad * 2 + IDXW + SLOTW + maxChainW;
  const H = topPad + rows * (RH + GAP) + 4;

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback={`Hash table (${figure.size} buckets, separate chaining)`} />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(720, Math.round(W * 1.15)) }}
        data-feature={N.figure}
        data-feature-label={figure.title || 'Hash table'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-hash-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
        </defs>

        <text x={leftPad + IDXW / 2} y={topPad - 10} fontSize={12} textAnchor="middle" fill="#64748b" fontWeight={700}>index</text>
        <text x={leftPad + IDXW + SLOTW / 2} y={topPad - 10} fontSize={12} textAnchor="middle" fill="#64748b" fontWeight={700}>bucket</text>

        <g data-feature={N.buckets} data-feature-label="Buckets">
          {figure.buckets.map((b) => {
            const y = topPad + b.index * (RH + GAP);
            const slotX = leftPad + IDXW;
            const cy = y + RH / 2;
            const collision = b.chain.length > 1;
            return (
              <g key={b.index}>
                <rect x={leftPad} y={y} width={IDXW} height={RH} rx={3} fill="#f1f5f9" stroke={GRAY} strokeWidth={1.3} />
                <text x={leftPad + IDXW / 2} y={cy + 5} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700} fontFamily="monospace">{b.index}</text>
                <rect x={slotX} y={y} width={SLOTW} height={RH} rx={3} fill="#fff" stroke={GRAY} strokeWidth={1.3} />
                {b.chain.length === 0 && (
                  <text x={slotX + SLOTW / 2} y={cy + 5} fontSize={13} textAnchor="middle" fill={GRAY} fontFamily="monospace">∅</text>
                )}
                {b.chain.length > 0 && <circle cx={slotX + SLOTW / 2} cy={cy} r={4} fill={INK} />}
                {b.chain.map((entry, j) => {
                  const CHW = entryW(entry);
                  const ex = slotX + SLOTW + CHGAP + chainW({ chain: b.chain.slice(0, j) });
                  const chainGroup = j > 0;
                  return (
                    <g key={j} data-feature={chainGroup ? N.chain : undefined} data-feature-label={chainGroup ? 'Collision chain' : undefined}>
                      <line
                        x1={j === 0 ? slotX + SLOTW / 2 : ex - CHGAP}
                        y1={cy}
                        x2={ex - 3}
                        y2={cy}
                        stroke={INK}
                        strokeWidth={1.6}
                        markerEnd="url(#cs-hash-arr)"
                      />
                      <rect x={ex} y={y + 3} width={CHW} height={RH - 6} rx={4} fill={collision ? '#fef2f2' : CELL} stroke={collision ? RED : CELL_STROKE} strokeWidth={1.6} />
                      <text x={ex + CHW / 2} y={cy + 4.5} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600} fontFamily="monospace">
                        {entryText(entry)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>
      <Caption>
        {`hash(key) = (sum of character codes) mod ${figure.size}`}
        {anyCollision && <span style={{ color: RED }}>{'  ·  red: keys that collide share a bucket (chaining)'}</span>}
      </Caption>
    </div>
  );
}

// ── recursion_tree ────────────────────────────────────────────────────────────
/** Tidy layout of the call tree: each subtree is laid out alone, then siblings are pushed
 *  together until their outlines are a fixed gap apart. Returns x per node id (px). */
function tidyCallTree(figure: RecursionTreeFigure, nodeW: number, gap: number): Map<string, number> {
  const kids = new Map<string, string[]>();
  for (const nd of figure.nodes) kids.set(nd.id, []);
  for (const [p, c] of figure.edges) kids.get(p)?.push(c);
  const x = new Map<string, number>();
  type Sub = { ids: string[]; left: number[]; right: number[] };
  const go = (id: string): Sub => {
    x.set(id, 0);
    const subs = (kids.get(id) ?? []).map(go);
    const left = [-nodeW / 2]; const right = [nodeW / 2];
    const ids = [id];
    if (subs.length === 0) return { ids, left, right };
    // place children left to right, each as close to the ones before as outlines allow
    const offs: number[] = [0];
    const accRight = [...subs[0].right];
    for (let k = 1; k < subs.length; k++) {
      let off = 0;
      for (let i = 0; i < Math.min(accRight.length, subs[k].left.length); i++) off = Math.max(off, accRight[i] - subs[k].left[i] + gap);
      offs.push(off);
      subs[k].right.forEach((v, i) => { accRight[i] = Math.max(accRight[i] ?? -Infinity, v + off); });
    }
    const mid = (offs[0] + offs[offs.length - 1]) / 2;
    subs.forEach((s, k) => {
      const dx = offs[k] - mid;
      for (const cid of s.ids) { x.set(cid, x.get(cid)! + dx); ids.push(cid); }
      s.left.forEach((v, i) => { left[i + 1] = Math.min(left[i + 1] ?? Infinity, v + dx); });
      s.right.forEach((v, i) => { right[i + 1] = Math.max(right[i + 1] ?? -Infinity, v + dx); });
    });
    return { ids, left, right };
  };
  const root = figure.nodes.find((nd) => nd.depth === 0) ?? figure.nodes[0];
  go(root.id);
  return x;
}

export function CatalogRecursionTreeRenderer({ figure }: { figure: RecursionTreeFigure }) {
  const N = recursionTreeFeatureNames;
  const fnName = figure.kind === 'fibonacci' ? 'fib' : 'fact';
  const longestLabel = Math.max(...figure.nodes.map((nd) => nd.label.length));
  const longestValue = figure.showValues ? Math.max(...figure.nodes.map((nd) => `= ${nd.value}`.length)) : 0;
  // The call and (when shown) its return value are both written INSIDE the node, so no
  // text ever sits on the lines between calls.
  const RX = Math.max(28, Math.round(Math.max(longestLabel * 7.3, longestValue * 6.6) / 2) + 9);
  const RY = figure.showValues ? 21 : 16;
  const isChain = figure.nodes.every((nd) => figure.edges.filter(([p]) => p === nd.id).length <= 1);
  const rowH = RY * 2 + (isChain ? 18 : 30);
  const pad = 8;
  const xs = tidyCallTree(figure, RX * 2, 8);
  const minX = Math.min(...xs.values()) - RX;
  const maxX = Math.max(...xs.values()) + RX;
  const W = maxX - minX + pad * 2;
  const H = pad * 2 + figure.maxDepth * rowH + RY * 2;
  const nodeById = new Map(figure.nodes.map((nd) => [nd.id, nd]));
  const cx = (id: string) => xs.get(id)! - minX + pad;
  const cy = (depth: number) => pad + RY + depth * rowH;

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback={`Recursion tree — ${fnName}(${figure.n})`} />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.min(720, Math.round(W * 1.2)) }}
        data-feature={N.figure}
        data-feature-label={figure.title || `Recursion tree — ${fnName}(${figure.n})`}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <g>
          {figure.edges.map(([pid, cid], i) => {
            const p = nodeById.get(pid)!;
            const c = nodeById.get(cid)!;
            return (
              <line key={i} x1={cx(p.id)} y1={cy(p.depth)} x2={cx(c.id)} y2={cy(c.depth)} stroke={GRAY} strokeWidth={1.6} />
            );
          })}
        </g>

        {figure.nodes.map((nd) => {
          const isRoot = nd.depth === 0;
          const color = nd.isBase ? GREEN : isRoot ? PURPLE : BLUE;
          const fill = nd.isBase ? '#f0fdf4' : isRoot ? '#f5f3ff' : CELL;
          const wrap = (children: React.ReactNode) =>
            isRoot ? (
              <g data-feature={N.root} data-feature-label="Root call">{children}</g>
            ) : nd.isBase ? (
              <g data-feature={N.leaves} data-feature-label="Base cases">{children}</g>
            ) : (
              <g>{children}</g>
            );
          const x = cx(nd.id); const y = cy(nd.depth);
          return (
            <React.Fragment key={nd.id}>
              {wrap(
                <>
                  <ellipse cx={x} cy={y} rx={RX} ry={RY} fill={fill} stroke={color} strokeWidth={2} />
                  <text x={x} y={figure.showValues ? y - 2 : y + 4} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600} fontFamily="monospace">{nd.label}</text>
                  {figure.showValues && (
                    <text x={x} y={y + 13} fontSize={11.5} textAnchor="middle" fill={color} fontWeight={700}>{`= ${nd.value}`}</text>
                  )}
                </>,
              )}
            </React.Fragment>
          );
        })}
      </svg>
      <Caption>
        {figure.kind === 'fibonacci' ? 'fib(n) = fib(n − 1) + fib(n − 2)' : 'fact(n) = n × fact(n − 1)'}
        <span style={{ color: GREEN }}>{figure.kind === 'fibonacci' ? '  ·  green: base case' : '  ·  green: base case, fact(1) = 1'}</span>
        {figure.kind === 'fibonacci' && figure.n >= 4 ? '  ·  the same call appears more than once' : ''}
      </Caption>
    </div>
  );
}

// ── sorting_steps ───────────────────────────────────────────────────────────────
export function CatalogSortingStepsRenderer({ figure }: { figure: SortingStepsFigure }) {
  const N = sortingStepsFeatureNames;
  const { rows } = figure;
  const start = rows[0].values;
  const n = start.length;
  // Bars are measured from zero, so a negative value hangs below the zero line instead of
  // posing as a small positive bar.
  const hi = Math.max(0, ...start);
  const lo = Math.min(0, ...start);
  const hasNegative = lo < 0;
  const longestValue = Math.max(...start.map((v) => String(v).length));

  const barW = Math.max(26, longestValue * 7.4 + 4);
  const barGap = 8;
  const cellW = barW + barGap;
  const arrayW = n * cellW - barGap;
  const labelW = 70;
  // Many passes: shorter bars, so a ten-value sort still fits on about one screen.
  const barMaxH = rows.length > 7 ? 30 : rows.length > 5 ? 42 : 58;
  const rowH = barMaxH + 30; // bars + value labels + spacing
  const padX = 10;
  const padTop = 6;
  const W = labelW + arrayW + padX * 2;
  const H = padTop + rows.length * rowH;
  const unit = barMaxH / (hi - lo || 1);

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback="Bubble sort — step by step" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxWidth: Math.round(W * 1.1) }}
        data-feature={N.figure}
        data-feature-label={figure.title || 'Sorting steps'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {rows.map((row, ri) => {
          const y0 = padTop + ri * rowH;
          const zeroY = y0 + hi * unit; // the zero line of this row
          const floorY = y0 + barMaxH; // lowest point a bar can reach
          const isFinal = row.label === 'Sorted';
          return (
            <g key={ri} {...(isFinal ? { 'data-feature': N.result, 'data-feature-label': `Sorted: ${row.values.join(', ')}` } : {})}>
              {ri > 0 && <line x1={padX} y1={y0 - 7} x2={W - padX} y2={y0 - 7} stroke="#e2e8f0" strokeWidth={1} />}
              <text x={padX} y={y0 + barMaxH / 2 + 5} fontSize={13} fontWeight={700} fill={isFinal ? GREEN : INK}>{row.label}</text>
              {hasNegative && <line x1={labelW + padX - 4} y1={zeroY} x2={labelW + padX + arrayW + 4} y2={zeroY} stroke={GRAY} strokeWidth={1} />}
              {row.values.map((v, i) => {
                const h = Math.max(3, Math.abs(v) * unit);
                const x = labelW + padX + i * cellW;
                const sorted = i >= row.sortedFrom;
                const fill = sorted ? GREEN : BLUE;
                return (
                  <g key={i}>
                    <rect x={x} y={v >= 0 ? zeroY - h : zeroY} width={barW} height={h} rx={2} fill={fill} fillOpacity={0.88} />
                    <text x={x + barW / 2} y={floorY + 14} textAnchor="middle" fontSize={12} fontWeight={600} fill={sorted ? '#15803d' : INK}>{v}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <Caption>
        <span style={{ color: GREEN }}>Green</span>{': already in its final place'}
        {hasNegative ? '  ·  bars below the line are negative values' : ''}
      </Caption>
    </div>
  );
}
