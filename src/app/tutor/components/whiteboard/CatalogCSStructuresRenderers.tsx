'use client';

import React from 'react';
import {
  dataStructureFeatureNames,
  graphFeatureNames,
  hashTableFeatureNames,
  recursionTreeFeatureNames,
  type DataStructureFigure,
  type GraphFigure,
  type HashTableFigure,
  type RecursionTreeFigure,
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
  const BW = 150;
  const BH = 42;
  const GAP = 6;
  const topPad = 78;
  const botPad = 54;
  const W = 420;
  const H = topPad + n * (BH + GAP) + botPad;
  const bx = (W - BW) / 2;
  const topY = topPad;

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback="Stack (LIFO)" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[440px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Stack (LIFO)'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-arr-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
        </defs>

        {/* top: push / pop */}
        <g data-feature={N.entry} data-feature-label="Top (push / pop)">
          <line x1={bx + BW / 2} y1={20} x2={bx + BW / 2} y2={topY - 6} stroke={GREEN} strokeWidth={2.5} markerEnd="url(#cs-arr-ink)" />
          <line x1={bx + BW / 2} y1={topY - 6} x2={bx + BW / 2} y2={20} stroke={GREEN} strokeWidth={2.5} markerEnd="url(#cs-arr-ink)" />
          <text x={bx + BW / 2} y={14} fontSize={13} textAnchor="middle" fill={GREEN} fontWeight={700}>
            push / pop  →  TOP
          </text>
        </g>

        <g data-feature={N.cells} data-feature-label="Elements">
          {items.map((it, i) => {
            const y = topY + (n - 1 - i) * (BH + GAP);
            const isTop = i === n - 1;
            return (
              <g key={i}>
                <rect x={bx} y={y} width={BW} height={BH} rx={5} fill={CELL} stroke={isTop ? GREEN : CELL_STROKE} strokeWidth={isTop ? 2.5 : 1.5} />
                <text x={bx + BW / 2} y={y + BH / 2 + 5} fontSize={15} textAnchor="middle" fill={INK} fontWeight={600} fontFamily="monospace">{it}</text>
              </g>
            );
          })}
        </g>

        <text x={bx + BW + 12} y={topY + BH / 2 + 5} fontSize={11.5} textAnchor="start" fill={GREEN} fontWeight={700}>top</text>
        <text x={bx + BW + 12} y={topY + (n - 1) * (BH + GAP) + BH / 2 + 5} fontSize={11.5} textAnchor="start" fill={GRAY}>bottom</text>

        <text x={W / 2} y={H - 18} fontSize={12} textAnchor="middle" fill={INK} fontWeight={600}>Stack — Last In, First Out (LIFO)</text>
      </svg>
    </div>
  );
}

function QueueRenderer({ figure, N }: { figure: DataStructureFigure; N: typeof dataStructureFeatureNames }) {
  const items = figure.items;
  const n = items.length;
  const BW = 64;
  const BH = 56;
  const GAP = 6;
  const leftPad = 92;
  const rightPad = 92;
  const W = leftPad + n * (BW + GAP) + rightPad;
  const H = 210;
  const rowY = 92;

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback="Queue (FIFO)" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Queue (FIFO)'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
          </marker>
          <marker id="cs-arr-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={RED} />
          </marker>
        </defs>

        <g data-feature={N.cells} data-feature-label="Elements">
          {items.map((it, i) => {
            const x = leftPad + i * (BW + GAP);
            return (
              <g key={i}>
                <rect x={x} y={rowY} width={BW} height={BH} rx={5} fill={CELL} stroke={CELL_STROKE} strokeWidth={1.5} />
                <text x={x + BW / 2} y={rowY + BH / 2 + 5} fontSize={15} textAnchor="middle" fill={INK} fontWeight={600} fontFamily="monospace">{it}</text>
              </g>
            );
          })}
        </g>

        {/* front (dequeue) on the left */}
        <g data-feature={N.exit} data-feature-label="Front (dequeue)">
          <line x1={leftPad - 8} y1={rowY + BH / 2} x2={leftPad - 62} y2={rowY + BH / 2} stroke={BLUE} strokeWidth={2.5} markerEnd="url(#cs-arr-blue)" />
          <text x={leftPad + BW / 2} y={rowY - 12} fontSize={13} textAnchor="middle" fill={BLUE} fontWeight={700}>FRONT</text>
          <text x={leftPad - 66} y={rowY + BH / 2 - 8} fontSize={12} textAnchor="start" fill={BLUE} fontWeight={700}>dequeue</text>
        </g>

        {/* rear (enqueue) on the right */}
        <g data-feature={N.entry} data-feature-label="Rear (enqueue)">
          {(() => { const rx = leftPad + (n - 1) * (BW + GAP) + BW; return (
            <>
              <line x1={rx + 62} y1={rowY + BH / 2} x2={rx + 8} y2={rowY + BH / 2} stroke={RED} strokeWidth={2.5} markerEnd="url(#cs-arr-red)" />
              <text x={rx - BW / 2} y={rowY - 12} fontSize={13} textAnchor="middle" fill={RED} fontWeight={700}>REAR</text>
              <text x={rx + 66} y={rowY + BH / 2 - 8} fontSize={12} textAnchor="end" fill={RED} fontWeight={700}>enqueue</text>
            </>
          ); })()}
        </g>

        <text x={W / 2} y={H - 20} fontSize={12} textAnchor="middle" fill={INK} fontWeight={600}>Queue — First In, First Out (FIFO)</text>
      </svg>
    </div>
  );
}

function LinkedListRenderer({ figure, N }: { figure: DataStructureFigure; N: typeof dataStructureFeatureNames }) {
  const items = figure.items;
  const n = items.length;
  const VW = 54; // value cell
  const PW = 30; // next-pointer cell
  const BH = 48;
  const NODEW = VW + PW;
  const ARROW = 40;
  const leftPad = 24;
  const rightPad = 70; // room for → null
  const rowY = 70;
  const W = leftPad + n * NODEW + n * ARROW + rightPad;
  const H = 170;

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback="Linked list" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Linked list'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-arr-ll" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
        </defs>

        {/* head label */}
        <text x={leftPad + VW / 2} y={rowY - 14} fontSize={12.5} textAnchor="middle" fill={PURPLE} fontWeight={700}>head</text>
        <line x1={leftPad + VW / 2} y1={rowY - 10} x2={leftPad + VW / 2} y2={rowY - 2} stroke={PURPLE} strokeWidth={2} markerEnd="url(#cs-arr-ll)" />

        <g data-feature={N.cells} data-feature-label="Nodes">
          {items.map((it, i) => {
            const x = leftPad + i * (NODEW + ARROW);
            const cx = x + VW + PW / 2;
            const cy = rowY + BH / 2;
            const arrowStartX = x + NODEW;
            const nextNodeX = arrowStartX + ARROW;
            const isLast = i === n - 1;
            return (
              <g key={i}>
                {/* value cell */}
                <rect x={x} y={rowY} width={VW} height={BH} rx={4} fill={CELL} stroke={CELL_STROKE} strokeWidth={1.5} />
                <text x={x + VW / 2} y={cy + 5} fontSize={15} textAnchor="middle" fill={INK} fontWeight={600} fontFamily="monospace">{it}</text>
                {/* next-pointer cell */}
                <rect x={x + VW} y={rowY} width={PW} height={BH} rx={4} fill="#f8fafc" stroke={CELL_STROKE} strokeWidth={1.5} />
                <circle cx={cx} cy={cy} r={3.5} fill={INK} />
                {/* pointer arrow */}
                {isLast ? (
                  <>
                    <line x1={cx} y1={cy} x2={nextNodeX - 6} y2={cy} stroke={INK} strokeWidth={2} markerEnd="url(#cs-arr-ll)" />
                    <g data-feature={N.exit} data-feature-label="null">
                      <text x={nextNodeX + 2} y={cy + 5} fontSize={13} textAnchor="start" fill={GRAY} fontWeight={700} fontFamily="monospace">null</text>
                    </g>
                  </>
                ) : (
                  <line x1={cx} y1={cy} x2={nextNodeX - 4} y2={cy} stroke={INK} strokeWidth={2} markerEnd="url(#cs-arr-ll)" />
                )}
              </g>
            );
          })}
        </g>

        <text x={W / 2} y={H - 16} fontSize={12} textAnchor="middle" fill={INK} fontWeight={600}>Singly linked list — each node stores a value and a pointer to the next</text>
      </svg>
    </div>
  );
}

// ── graph_diagram ─────────────────────────────────────────────────────────────
export function CatalogGraphRenderer({ figure }: { figure: GraphFigure }) {
  const N = graphFeatureNames;
  const W = 560;
  const H = 460;
  const padX = 70;
  const padY = 60;
  const R = 20;
  const AW = W - padX * 2;
  const AH = H - padY * 2;
  const px = (nx: number) => padX + nx * AW;
  const py = (ny: number) => padY + ny * AH;
  const nodeById = new Map(figure.nodes.map((nd) => [nd.id, nd]));

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar
        title={figure.title}
        fallback={`${figure.directed ? 'Directed' : 'Undirected'} graph${figure.traversal ? ` — ${figure.traversal.toUpperCase()} traversal` : ''}`}
      />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[600px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Graph'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-graph-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={GRAY} />
          </marker>
        </defs>

        {/* edges */}
        <g data-feature={N.edges} data-feature-label="Edges">
          {figure.edges.map((e, i) => {
            const a = nodeById.get(e.from);
            const b = nodeById.get(e.to);
            if (!a || !b) return null;
            const ax = px(a.x), ay = py(a.y), bx = px(b.x), by = py(b.y);
            const dx = bx - ax, dy = by - ay;
            const len = Math.hypot(dx, dy) || 1;
            const ux = dx / len, uy = dy / len;
            // stop the arrow at the node boundary
            const x1 = ax + ux * R, y1 = ay + uy * R;
            const x2 = bx - ux * (R + (figure.directed ? 4 : 0)), y2 = by - uy * (R + (figure.directed ? 4 : 0));
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GRAY} strokeWidth={2} markerEnd={figure.directed ? 'url(#cs-graph-arr)' : undefined} />
                {e.weight !== undefined && (
                  <>
                    <rect x={mx - 12} y={my - 10} width={24} height={17} rx={3} fill="#fff" opacity={0.9} />
                    <text x={mx} y={my + 3} fontSize={12} textAnchor="middle" fill={PURPLE} fontWeight={700}>{e.weight}</text>
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* nodes */}
        <g data-feature={N.nodes} data-feature-label="Vertices">
          {figure.nodes.map((nd) => (
            <g key={nd.id}>
              <circle cx={px(nd.x)} cy={py(nd.y)} r={R} fill={CELL} stroke={BLUE} strokeWidth={2} />
              <text x={px(nd.x)} y={py(nd.y) + 5} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700}>{nd.label}</text>
              {figure.traversal && nd.order !== undefined && (
                <g data-feature={N.traversal} data-feature-label={`${figure.traversal.toUpperCase()} order`}>
                  <circle cx={px(nd.x) + R - 2} cy={py(nd.y) - R + 2} r={9} fill={GREEN} stroke="#fff" strokeWidth={1.5} />
                  <text x={px(nd.x) + R - 2} y={py(nd.y) - R + 6} fontSize={11} textAnchor="middle" fill="#fff" fontWeight={700}>{nd.order}</text>
                </g>
              )}
            </g>
          ))}
        </g>

        {figure.traversal && (
          <text x={W / 2} y={H - 14} fontSize={12} textAnchor="middle" fill={GREEN} fontWeight={700}>
            {`green badges = ${figure.traversal.toUpperCase()} visit order from ${figure.nodes[0]?.label}`}
          </text>
        )}
      </svg>
    </div>
  );
}

// ── hash_table ────────────────────────────────────────────────────────────────
export function CatalogHashTableRenderer({ figure }: { figure: HashTableFigure }) {
  const N = hashTableFeatureNames;
  const rows = figure.size;
  const IDXW = 44;
  const SLOTW = 60;
  const RH = 40;
  const GAP = 4;
  const topPad = 44;
  const leftPad = 90;
  const CHW = 78; // chained entry width
  const CHGAP = 22;
  const maxChain = Math.max(1, ...figure.buckets.map((b) => b.chain.length));
  const anyCollision = figure.buckets.some((b) => b.chain.length > 1);
  const noteText =
    `hash(key) = (Σ char codes) mod ${figure.size}` +
    (anyCollision ? '    ·    red = collision (separate chaining)' : '');
  const W = Math.max(
    leftPad + IDXW + SLOTW + maxChain * (CHW + CHGAP) + 40,
    leftPad + noteText.length * 6.3 + 20,
  );
  const H = topPad + rows * (RH + GAP) + 30;

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback={`Hash table (${figure.size} buckets, separate chaining)`} />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Hash table'}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        <defs>
          <marker id="cs-hash-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
        </defs>

        <text x={leftPad + IDXW / 2} y={topPad - 14} fontSize={12} textAnchor="middle" fill={GRAY} fontWeight={700}>index</text>
        <text x={leftPad + IDXW + SLOTW / 2} y={topPad - 14} fontSize={12} textAnchor="middle" fill={GRAY} fontWeight={700}>bucket</text>

        <g data-feature={N.buckets} data-feature-label="Buckets">
          {figure.buckets.map((b) => {
            const y = topPad + b.index * (RH + GAP);
            const slotX = leftPad + IDXW;
            const cy = y + RH / 2;
            const collision = b.chain.length > 1;
            return (
              <g key={b.index}>
                {/* index cell */}
                <rect x={leftPad} y={y} width={IDXW} height={RH} rx={3} fill="#f1f5f9" stroke={GRAY} strokeWidth={1.3} />
                <text x={leftPad + IDXW / 2} y={cy + 5} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700} fontFamily="monospace">{b.index}</text>
                {/* bucket slot */}
                <rect x={slotX} y={y} width={SLOTW} height={RH} rx={3} fill="#fff" stroke={GRAY} strokeWidth={1.3} />
                {b.chain.length === 0 && (
                  <text x={slotX + SLOTW / 2} y={cy + 5} fontSize={12} textAnchor="middle" fill={GRAY} fontFamily="monospace">∅</text>
                )}
                {b.chain.length > 0 && <circle cx={slotX + SLOTW / 2} cy={cy} r={4} fill={INK} />}
                {/* chained entries */}
                {b.chain.map((entry, j) => {
                  const ex = slotX + SLOTW + CHGAP + j * (CHW + CHGAP);
                  const chainGroup = j > 0;
                  return (
                    <g key={j} data-feature={chainGroup ? N.chain : undefined} data-feature-label={chainGroup ? 'Collision chain' : undefined}>
                      <line
                        x1={j === 0 ? slotX + SLOTW / 2 : ex - CHGAP}
                        y1={cy}
                        x2={ex - 4}
                        y2={cy}
                        stroke={INK}
                        strokeWidth={1.8}
                        markerEnd="url(#cs-hash-arr)"
                      />
                      <rect x={ex} y={y + 3} width={CHW} height={RH - 6} rx={4} fill={collision ? '#fef2f2' : CELL} stroke={collision ? RED : CELL_STROKE} strokeWidth={1.6} />
                      <text x={ex + CHW / 2} y={cy + 4} fontSize={12.5} textAnchor="middle" fill={INK} fontWeight={600} fontFamily="monospace">
                        {entry.value !== '' ? `${entry.key}:${entry.value}` : entry.key}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>

        <text x={leftPad} y={H - 8} fontSize={11.5} textAnchor="start" fill={INK}>{noteText}</text>
      </svg>
    </div>
  );
}

// ── recursion_tree ────────────────────────────────────────────────────────────
export function CatalogRecursionTreeRenderer({ figure }: { figure: RecursionTreeFigure }) {
  const N = recursionTreeFeatureNames;
  const fnName = figure.kind === 'fibonacci' ? 'fib' : 'fact';
  const colW = 78;
  const rowH = 74;
  const padX = 46;
  const padY = 44;
  const W = Math.max(360, padX * 2 + (figure.maxX + 1) * colW);
  const H = padY * 2 + (figure.maxDepth + 1) * rowH;
  const nodeById = new Map(figure.nodes.map((nd) => [nd.id, nd]));
  const cx = (x: number) => padX + colW / 2 + x * colW;
  const cy = (depth: number) => padY + depth * rowH + 22;
  const RX = 32, RY = 17;

  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar title={figure.title} fallback={`Recursion tree — ${fnName}(${figure.n})`} />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.figure}
        data-feature-label={figure.title || `Recursion tree — ${fnName}(${figure.n})`}
        data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}
      >
        {/* edges */}
        <g>
          {figure.edges.map(([pid, cid], i) => {
            const p = nodeById.get(pid)!;
            const c = nodeById.get(cid)!;
            return (
              <line key={i} x1={cx(p.x)} y1={cy(p.depth) + RY} x2={cx(c.x)} y2={cy(c.depth) - RY} stroke={GRAY} strokeWidth={1.6} />
            );
          })}
        </g>

        {/* nodes */}
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
          return (
            <React.Fragment key={nd.id}>
              {wrap(
                <>
                  <ellipse cx={cx(nd.x)} cy={cy(nd.depth)} rx={RX} ry={RY} fill={fill} stroke={color} strokeWidth={2} />
                  <text x={cx(nd.x)} y={cy(nd.depth) + 4} fontSize={12} textAnchor="middle" fill={INK} fontWeight={600} fontFamily="monospace">{nd.label}</text>
                  {figure.showValues && (
                    <text x={cx(nd.x)} y={cy(nd.depth) + RY + 13} fontSize={11} textAnchor="middle" fill={color} fontWeight={700}>{`= ${nd.value}`}</text>
                  )}
                </>,
              )}
            </React.Fragment>
          );
        })}

        <text x={W / 2} y={H - 8} fontSize={11.5} textAnchor="middle" fill={INK}>
          {figure.kind === 'fibonacci'
            ? 'fib(n) = fib(n−1) + fib(n−2)   ·   green = base case   ·   overlapping subproblems'
            : 'fact(n) = n × fact(n−1)   ·   green = base case fact(1) = 1'}
        </text>
      </svg>
    </div>
  );
}
