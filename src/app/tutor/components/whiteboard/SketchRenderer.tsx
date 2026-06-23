'use client';

/**
 * SketchRenderer — draws a doodler-authored SketchPrimitive[] as a rough,
 * hand-drawn doodle. Renderer half of the tutor sketch capability (grilled
 * 2026-06-22, see memory project_tutor_sketch_capability).
 *
 * Path-building lives in the pure sketch-render-core (shared with the PDF
 * renderer + smoke script); this component just maps the result to React
 * elements. Labels render as plain <text> (legible, not roughened) and carry
 * feat() data-attrs so tutor_scribble can target them.
 */
import React, { useMemo } from 'react';
import { buildSketchPaths } from '@/lib/tutor/whiteboard/sketch-render-core';
import { SKETCH_VIEWBOX, type SketchPrimitive } from '@/lib/tutor/whiteboard/sketch-schema';

export function SketchRenderer({
  primitives,
  title,
  description,
}: {
  primitives: SketchPrimitive[];
  title?: string;
  description?: string;
  /** Informational; labels are normally baked into primitives by the doodler. */
  labels?: string[];
}) {
  const { drawn, labels } = useMemo(() => buildSketchPaths(primitives), [primitives]);
  const { width: W, height: H } = SKETCH_VIEWBOX;

  return (
    <div className="w-full flex flex-col items-center" role="img" aria-label={description || title || 'sketch'}>
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px]" data-feature="sketch" style={{ overflow: 'visible' }}>
        {drawn.map(({ paths }, i) => (
          <g key={`s${i}`}>
            {paths.map((pi, j) => (
              <path
                key={j}
                d={pi.d}
                stroke={pi.stroke}
                strokeWidth={pi.strokeWidth}
                fill={pi.fill || 'none'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        ))}
        {labels.map((l, i) => (
          <g key={`t${i}`} {...l.feature}>
            <text
              x={l.x}
              y={l.y}
              fontSize={l.fontSize}
              fill={l.fill}
              textAnchor={l.anchor}
              dominantBaseline="middle"
              style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', 'Bradley Hand', cursive" }}
            >
              {l.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
